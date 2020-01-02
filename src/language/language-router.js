const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const linkedList = require("./linkedList");

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: "You don't have any languages"
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  // implement me
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.user_id
    );
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );
    const currentWord = words.find(element => element.id === language.head);
    const responseObject = {
      nextWord: currentWord.original,
      wordCorrectCount: currentWord.correct_count,
      wordIncorrectCount: currentWord.incorrect_count,
      totalScore: language.total_score
    };
    res.json(responseObject);
  } catch (error) {
    next(error);
  }
});

languageRouter.post("/guess", jsonBodyParser, async (req, res, next) => {
  const { guess } = req.body;
  const user_id = req.user.id
  if (guess === undefined) {
    return res.status(400).json({ error: "Missing 'guess' in request body" });
  }
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.user_id
    );
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );
    const startingList = new linkedList();
    const currList = new linkedList();
    await words.forEach(word => startingList.itemPush(word));
    await words.forEach(word => currList.itemPush(word));
    let isCorrect = false;
    let memV = 1;
    let totalScore = language.total_score;
    if (guess === startingList.head.value.translation) {
      // console.log("correct");
      isCorrect = true;
      memV = memV * 2;
      totalScore += 1;
      currList.head.value.correct_count += 1;
      await LanguageService.correctAnswer(
        req.app.get("db"),
        currList.head.value.id
      );
      await LanguageService.incrementTotalScore(
        req.app.get("db"),
        user_id,
        totalScore
      );
    } else {
      memV = 1;
      await LanguageService.incorrectAnswer(req.app.get("db"), currList.head.value.id);
    }
    let answer = currList.head.value.translation
    let nextWord = currList.head.next.value.original
    let wordIncorrectCount = currList.head.value.incorrect_count
    await currList.insertAt(currList.head.value, memV);
    // console.log("after insert " + currList.display());
    await currList.removeById(currList.head.value.id);
    let wordCorrectCount = currList.head.value.correct_count
    // console.log("after remove " + currList.display());
    let currWord = currList.head
    while(currWord !== null) {
      await LanguageService.updateNextValue(
        req.app.get("db"),
        currWord.value.id,
        currWord.value.next
      )
      currWord = currWord.next
    }

    let resObj = {
      answer: answer,
      isCorrect: isCorrect,
      nextWord: nextWord,
      totalScore: totalScore,
      wordCorrectCount: wordCorrectCount,
      wordIncorrectCount: wordIncorrectCount
    };
    res.json(resObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

module.exports = languageRouter;

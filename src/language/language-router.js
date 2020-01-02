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
      // answer: currentWord.translation,
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
  const user_id = req.user.id;
  if (guess === undefined) {
    return res.status(400).json({ error: "Missing 'guess' in request body" });
  }
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.user_id
    );
    let words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );
    let currList = new linkedList();
    await words.forEach(word => currList.itemPush(word));
    let isCorrect; // hold boolean for correctness
    if (guess == currList.head.value.translation) {
      isCorrect = true;
      language.total_score = language.total_score + 1;
      currList.head.value.correct_count += 1;
      currList.head.value.memory_value *= 2;
      await LanguageService.incrementTotalScore(req.app.get("db"), user_id);
      await LanguageService.correctAnswer(
        req.app.get("db"),
        currList.head.value.id
      );
      await LanguageService.updateMemory(
        req.app.get("db"),
        currList.head.value.id,
        currList.head.value.memory_value
      );
    } else {
      isCorrect = false;
      currList.head.value.memory_value = 1;
      await LanguageService.incorrectAnswer(
        req.app.get("db"),
        currList.head.value.id
      );
      await LanguageService.updateMemory(
        req.app.get("db"),
        currList.head.value.id,
        currList.head.value.memory_value
      );
    }
    let answer = currList.head.value.translation;
    await currList.insertAt(
      currList.head.value,
      currList.head.value.memory_value + 1
    );
    await currList.remove(currList.head.value);
    let currWord = currList.head;
    while (currWord !== null) {
      await LanguageService.updateNextValue(
        req.app.get("db"),
        currWord.value.id,
        currWord.value.next
      );
      currWord = currWord.next;
    }
    // await updateHead(db, user_id, newHead)
    await LanguageService.updateHead(
      req.app.get("db"),
      user_id,
      currList.head.value.id
    )

    let resObj = {
      answer: answer,
      isCorrect: isCorrect,
      nextWord: currList.head.value.original,
      totalScore: language.total_score,
      wordCorrectCount: currList.head.value.correct_count,
      wordIncorrectCount: currList.head.value.incorrect_count
    };
    res.json(resObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

module.exports = languageRouter;

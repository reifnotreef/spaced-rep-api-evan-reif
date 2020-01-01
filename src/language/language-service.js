const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score",
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count",
      )
      .where({ language_id });
  },

  updateHead(db, user_id, newHead) {
    return db
      .from("language")
      .where("language.user_id", user_id)
      .update({ head: newHead });
  },

  correctAnswer(db, id) {
    return db
      .from("word")
      .where(id, id)
      .increment("correct_count")
      .returning("correct_count");
  },

  incorrectAnswer(db, id) {
    return db
      .from("word")
      .where(id, id)
      .increment("incorrect_count")
      .returning("incorrect_count");
  },

  incrementTotalScore(db, user_id) {
    return db
      .from("language")
      .where({ user_id: user_id })
      .increment("total_score")
      .returning("total_score");
  },

  updateMemory(db, id, newMem) {
    return db
      .from("word")
      .where(id, id)
      .update({ memory_value: newMem });
  },
  updateNext(db, id, nextItem) {
    return db
      .from("word")
      .where(id, id)
      .update(next, nextItem)
      .returning("next");
  },
};

module.exports = LanguageService;

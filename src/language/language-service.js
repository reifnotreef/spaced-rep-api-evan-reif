const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
<<<<<<< HEAD
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
=======
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score",
<<<<<<< HEAD
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
=======
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
      )
      .where('language.user_id', user_id)
      .first();
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
<<<<<<< HEAD
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getTranslation(db, word_id) {
=======
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
<<<<<<< HEAD
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
=======
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
    return db
      .from('word')
      .select('id','translation', 'memory_value', 'correct_count', 'incorrect_count')
      .where({ id: word_id })
      .first();
  },
  correctAnswer(db, word) {
    console.log('here');
    console.log(word);
    return db
<<<<<<< HEAD
      .from('word')
      .update({
        memory_value: word.memory_value * 2,
        correct_count: word.correct_count + 1,
      })
      .where({id: word.id})
      .returning('*')
      .then(([word]) => word)
=======
      .from("word")
      .where(id, id)
      .increment("correct_count");
<<<<<<< HEAD
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
=======
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
  },
  incorrectAnswer(db, word) {
    return db
<<<<<<< HEAD
      .from('word')
      .update({
        memory_value: 1,
        incorrect_count: word.incorrect_count + 1,
      })
      .where({ id: word.id })
      .returning('*')
      .then(([word]) => word);
=======
      .from("word")
      .where(id, id)
      .increment("incorrect_count");
<<<<<<< HEAD
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
  },
  updateTotalScore(db, language) {
    return db
<<<<<<< HEAD
      .from('language')
      .update({
        total_score: language.total_score + 1,
      })      
      .where({ id: language.id })
      .returning('*')
      .then(([language]) => language);
=======
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7
  },

  getHeadWord(db, language_id, language_head){
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({language_id, id: language_head})
      .first()
  }
}
=======
      .from("language")
      .where({ user_id: user_id })
      .increment("total_score");
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
      .update(next, nextItem);
  },
};
>>>>>>> 6d9911fdc42ed8572182e2c07e682335aa64e8e7

module.exports = LanguageService;
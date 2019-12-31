const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db("users")
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  },
  populateUserWords(db, user_id) {
    return db.transaction(async trx => {
      const [languageId] = await trx
        .into("language")
        .insert([{ name: "Latin", user_id }], ["id"]);

      // when inserting words,
      // we need to know the current sequence number
      // so that we can set the `next` field of the linked language
      const seq = await db
        .from("word_id_seq")
        .select("last_value")
        .first();

      const languageWords = [
        ['semper', 'always', 2],
        ['ubi', 'where', 3],
        ['sub', 'under', 4],
        ['perfide', 'rogue', 5],
        ['sagittarius', 'archer', 6],
        ['malleus', 'hammer', 7],
        ['panis', 'bread', 8],
        ['lodix', 'lodix', 9],
        ['rota', 'wheel', 10],
        ['fenestra', 'window', 11],
        ['janua', 'door', 12],
        ['tectum', 'roof', null]
      ];


      const [languageHeadId] = await trx.into("word").insert(
        languageWords.map(([original, translation, nextInc]) => ({
          language_id: languageId.id,
          original,
          translation,
          next: nextInc ? Number(seq.last_value) + nextInc : null,
        })),
        ["id"],
      );

      await trx("language")
        .where("id", languageId.id)
        .update({
          head: languageHeadId.id,
        });
    });
  },
};

module.exports = UserService;

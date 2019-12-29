BEGIN;

  TRUNCATE "word", "language", "user";

  INSERT INTO "user"
    ("id", "username", "name", "password")
  VALUES
    (
      1,
      'susu',
      'susu test user',
      -- password = "pass"
      'password'
  );

  INSERT INTO "language"
    ("id", "name", "user_id")
  VALUES
    (1, 'Latin', 1);

  INSERT INTO "word"
    ("id", "language_id", "original", "translation", "next")
  VALUES
    (1, 1, 'prius', 'before', 2),
    (2, 1, 'ignis', 'fire', 3),
    (3, 1, 'bellator', 'warrior', 4),
    (4, 1, 'perfide', 'rogue', 5),
    (5, 1, 'sagittarius', 'archer', 6),
    (6, 1, 'malleus', 'hammer', 7),
    (7, 1, 'panis', 'bread', 8),
    (8, 1, 'lodix', 'lodix', 9),
    (9, 1, 'rota', 'wheel', 10),
    (10, 1, 'fenestra', 'window', 11),
    (11, 1, 'janua', 'door', 12),
    (12, 1, 'tectum', 'roof', null);

  UPDATE "language" SET head = 1 WHERE id = 1;

  -- because we explicitly set the id fields
  -- update the sequencer for future automatic id setting
  SELECT setval('word_id_seq', (SELECT MAX(id)
    from "word"));
  SELECT setval('language_id_seq', (SELECT MAX(id)
    from "language"));
  SELECT setval('user_id_seq', (SELECT MAX(id)
    from "user"));

  COMMIT;

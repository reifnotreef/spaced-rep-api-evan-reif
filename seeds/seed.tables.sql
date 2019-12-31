BEGIN;

TRUNCATE
  "word",
  "language",
  "users";

INSERT INTO "users" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Latin', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
    (1, 1, 'semper', 'always', 2),
    (2, 1, 'ubi', 'where', 3),
    (3, 1, 'sub', 'under', 4),
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
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

COMMIT;
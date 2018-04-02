CREATE TABLE IF NOT EXISTS messages (
id SERIAL PRIMARY KEY,
author TEXT NOT NULL,
message TEXT NOT NULL,
room INTEGER
);
-- INSERT INTO messages (author, message, room) VALUES ('Brent', 'Hey!', 1);
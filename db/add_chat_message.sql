INSERT INTO messages (author, message, room) VALUES ($1, $2, $3);
SELECT * FROM messages;
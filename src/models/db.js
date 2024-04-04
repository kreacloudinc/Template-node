const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('../db/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the sample database.');
  });
  
  module.exports = db;
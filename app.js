const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");

let db = null;
const initiliazeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started");
    });
  } catch (e) {
    console.log("DB Error");
  }
};
initiliazeDbAndServer();

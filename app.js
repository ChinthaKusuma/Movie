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
    app.get("/movies/", async (request, response) => {
      const MoviesNamesQuery = `select movie_name from Movie;`;
      const dbResponse = await db.all(MoviesNamesQuery);
      response.send(
        dbResponse.map((eachItem) => ({ movieName: eachItem.movie_name }))
      );
    });
  } catch (e) {
    console.log("DB Error");
  }
};
initiliazeDbAndServer();
module.exports = app;

const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");
let db = null;
app.use(express.json());

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
    app.post("/movies/", async (request, response) => {
      const addData = request.body;
      const { directorId, movieName, leadActor } = addData;
      const addDataQuery = `insert into Movie(director_id,movie_name,lead_actor)
        values(${directorId},'${movieName}','${leadActor}');`;
      const dbResponse2 = await db.run(addDataQuery);
      response.send("Movie Successfully Added");
    });
  } catch (e) {
    console.log("DB Error");
  }
};
initiliazeDbAndServer();
module.exports = app;

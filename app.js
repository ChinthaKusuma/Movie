const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");
let db = null;
app.use(express.json());
const convertCase = (dbResponse3) => {
  return {
    movieId: dbResponse3.movie_id,
    directorId: dbResponse3.director_id,
    movieName: dbResponse3.movie_name,
    leadActor: dbResponse3.lead_actor,
  };
};

const convertDirectorCase = (eachElement) => {
  return {
    directorId: eachElement.director_id,
    directorName: eachElement.director_name,
  };
};

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
    app.get("/movies/:movieId/", async (request, response) => {
      const { movieId } = request.params;
      const movieIdQuery = `select * from Movie where 
        movie_id=${movieId};`;
      const dbResponse3 = await db.get(movieIdQuery);
      const resultDbResponse3 = convertCase(dbResponse3);
      response.send(resultDbResponse3);
    });
    app.put("/movies/:movieId/", async (request, response) => {
      const { movieId } = request.params;
      const movieDetails = request.body;
      const { directorId, movieName, leadActor } = movieDetails;
      const putQuery = `update Movie
        set 
        movie_id=${movieId},
        director_id=${directorId},
        movie_name='${movieName}',
        lead_actor='${leadActor}'
        where movie_id=${movieId};`;
      const dbResponse4 = await db.run(putQuery);
      response.send("Movie Details Updated");
    });
    app.delete("/movies/:movieId/", async (request, response) => {
      const { movieId } = request.params;
      const deleteQuery = `delete from Movie 
        where movie_id=${movieId};`;
      const dbResponse5 = await db.run(deleteQuery);
      response.send("Movie Removed");
    });
    app.get("/directors/", async (request, response) => {
      const directorQuery = `select * from director;`;
      const dbResponse6 = await db.all(directorQuery);
      const result = dbResponse6.map((eachElement) =>
        convertDirectorCase(eachElement)
      );
      response.send(result);
    });
    app.get("/directors/:directorId/movies/", async (request, response) => {
      const { directorId } = request.params;
      const directorMovieQuery = `select movie_name from Movie 
        where director_id=${directorId};`;
      const dbResponse7 = await db.all(directorMovieQuery);
      const result1 = dbResponse7.map((eachElement) => ({
        movieName: eachElement.movie_name,
      }));

      response.send(result1);
    });
  } catch (e) {
    console.log("DB Error");
  }
};
initiliazeDbAndServer();
module.exports = app;

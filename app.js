const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const filepath = path.join(__dirname, "moviesData.db");
let db = null;

const initializedbandservice = async () => {
  try {
    db = await open({
      filename: filepath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is on");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
  }
};
initializedbandservice();
const convert = (object) => {
  return {
    movieId: object.movie_id,
    directorId: object.director_id,
    movieName: object.movie_name,
    leadActor: object.lead_actor,
  };
};

const convertdirector = (object) => {
  return {
    directorId: object.director_id,
    directorName: object.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const query = `
    SELECT 
    movie_name 
    FROM
    movie;
     `;
  const moviesdetails = await db.all(query);
  response.send(
    moviesdetails.map((eachmovie) => ({ movieName: eachmovie.movie_name }))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const querys = `
    INSERT INTO 
    movie ( director_id, movie_name, lead_actor)
    VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(querys);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `
    SELECT 
    *
    FROM
    movie
    where movie_id=${movieId};
     `;
  const moviesdetails = await db.get(query);
  response.send(convert(moviesdetails));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const query = `
    UPDATE 
    movie
    SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE 
    movie_id=${movieId};`;
  await db.run(query);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `
   DELETE  FROM
    movie
  WHERE movie_id=${movieId};`;
  const moviesdetails = await db.run(query);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const query = `
    SELECT 
    *
    FROM
    director;`;
  const moviesdetails = await db.all(query);
  response.send(moviesdetails.map((eachmovie) => convertdirector(eachmovie)));
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `
    SELECT 
      movie_name
    FROM
       movie
    WHERE 
       director_id='${directorId}';`;
  const moviesdetails = await db.all(query);
  response.send(
    moviesdetails.map((eachmovie) => ({ movieName: eachmovie.movie_name }))
  );
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id='${directorId}';`;
  const moviesArray = await database.all(getDirectorMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});
module.exports = app;

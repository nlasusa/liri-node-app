//read and set environment variables 
require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios") 
var Spotify = require('node-spotify-api')
var moment = require("moment"); 
var spotify = new Spotify(keys.spotify);

// setting default variable to display if user doesn't input a movie 
var defaultMovie = "The Sweetest Thing";

// Name of venue, venue location, date of event (using moment to format this as MM/DD/YYYY)
var action = process.argv[2];
var value = process.argv[3];

switch (action) {
case "concert-this": 
getBands(value)
break; 

case "spotify-this-song":
getSongs(value)
break;

case "movie-this":
if (value == "") {
    value = defaultMovie; 
}
getMovies(value)
break; 

case "do-what-it-says":
doWhatItSays()
break;
default:
break; 
}

// function for getting artist bands in town
function getBands(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      console.log("Name of the venue:", response.data[0].venue.name);
      console.log("Venue location:", response.data[0].venue.city);
      var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
      console.log("Date of the Event:", eventDate); 
    })
    .catch(function (error) {
      console.log(error);
    });
}


// function for getting songs in spotify. If user hasn't specified a song, it will display the default song, "Caravan"
function getSongs(songName) {

    // response if user does not type in a song name 
    if (songName === "") {
        songName = "Born in the USA";
      }

   spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
    // A preview link of the song from Spotify
    console.log("Preview Link: ", data.tracks.items[0].preview_url)
    // The album that the song is from
    console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

// function for getting movies from OMDB API 

function getMovies(movieName) {

    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + movieName)
      .then(function (data) {
        // console.log(data.data); 

        var results = `
        Title of the movie: ${data.data.Title}
        Year the movie came out: ${data.data.Year}
        IMDB Rating of the movie: ${data.data.Rated}
        Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
        Country where the movie was produced: ${data.data.Country}
        Language of the movie: ${data.data.Language}
        Plot of the movie: ${data.data.Plot}
        Actors in the movie: ${data.data.Actors}`;
        console.log(results)
  
      })
      .catch(function (error) {
        console.log(error);
      });

      //Response if user does not type in a movie title
      if (movieName === "") {
        console.log("-----------------------");
        console.log("If you haven't watched 'The Sweetest Thing,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };
  }

//   function using fs node package to run spotify-this-song to display random.txt

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
      data = data.split(",");
      var action = data[0]
      var value = data[1]
      // getSongs(value)
      switch (action) {
        case "concert-this":
          getBands(value)
          break;
        case "spotify-this-song":
          getSongs(value)
          break;
        case "movie-this":
          getMovies(value)
          break;
        default:
          break;
      }
    });
  }


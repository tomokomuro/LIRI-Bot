require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

if (command == "my-tweets") {

    var params = { screen_name: 'TigerWoods', count: 10 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {

                var separator = ((i + 1) + ". -------------------");

                var theDate = tweets[i].created_at;

                var theTXT = tweets[i].text;

                var CC = "\n" + separator + "\n" + theDate + "\n" + theTXT + "\n";

                console.log(CC);
                appendData(CC);

            }

        } else {
            console.log(error);
        }
    });
} 


if (command == "spotify-this-song") {
    var song = process.argv[3];


    spotify.search({ type: 'track', query: song, limit: 20 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items);
        for (var i = 0; i < data.tracks.items.length; i++) {
            var theSong = data.tracks.items[i];

            var artistsObj = theSong.artists;
            var artistsCatch = "";
            // console.log(artistsObj);
            for (var x = 0; x < artistsObj.length; x++) {
                artistsCatch = artistsCatch + artistsObj[x].name + "|";
            }

            var separator = (i+1) + ". --------";
            var songTxt = "\n" +separator + "\nArtist(s): " + artistsCatch +"\nSong Name: " + theSong.name + "\nPreview URL: " + theSong.preview_url + "\nAlbum Name: " + theSong.album.name + "\n"
            console.log(songTxt);
            appendData(songTxt);
        }
    });
}

if(command == "movie-this"){
    movieName = process.argv[3];
    omdbKey = "e534fcdd";
    request("http://www.omdbapi.com/?t=" + movieName + "&apikey=" + omdbKey, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var separator = ("---------");
            var Title = "Title: " + JSON.parse(body).Title;
            var Year = "Year: " + JSON.parse(body).Year;
            var Rated = "Rated: " + JSON.parse(body).Rated;
            var imdbRatings = "imdb Ratings: " + JSON.parse(body).imdbRating;
            var Country = "Country: " + JSON.parse(body).Country;
            var Language = "Language: " + JSON.parse(body).Language;
            var Plot = "Plot: " + JSON.parse(body).Plot;

            var movieTxt = "\n" + separator + "\n" + Title + "\n" + Year + "\n" + Rated + "\n" + imdbRatings + "\n" + Country + "\n" + Language + "\n" + Plot + "\n"
            console.log(movieTxt);
            appendData(movieTxt);
        }
    });
}

if (command == "do-what-it-says"){
    fs.readFile("./random.txt", "utf8", function(err, data){
        console.log(data);
    })
}

function appendData(data) {
    fs.appendFile('random.txt', data, (err) => {
        if (err) throw err;
    });
}


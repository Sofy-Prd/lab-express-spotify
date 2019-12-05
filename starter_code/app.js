require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials') 
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });


// the routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
  });

  app.get('/search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      
 
      res.render("artists", {
        artists: data.body.artists.items,
         

      })
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
    
  });

  app.get('/albums/:id', (req, res, next) => {
    const id = req.params.id
    spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      // console.log("The received data albums from the API: ", data.body.items);
      
     
      res.render("albums", {
        albums: data.body.items,
         

      })
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
    
  });

  app.get('/tracks/:id', (req, res, next) => {
    const stracksId = req.params.id
    spotifyApi
    .getAlbumTracks(stracksId)
    .then(data => {
      console.log("The received data tracks from the API: ", data.body.items);
      
     
      res.render("tracks", {
        tracks: data.body.items
         

      })
      
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
    
  });

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

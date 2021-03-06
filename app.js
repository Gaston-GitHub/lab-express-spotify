require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
})

// Get Artist
app.get('/artist-search', (req, res, next) => {

  const artist = req.query.artist

  spotifyApi
  .searchArtists(artist, {limit: 6})
  .then(data => { 
    console.log('The received data from the API: ', data.body);
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {
      artists: data.body.artists.items,
      data: data,
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Get Albums

app.get('/albums/:albumId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.albumId)
  .then(data => {
    console.log('render this:', data.body)
    res.render('albums', {albums: data.body.items})
  })
  .catch(err => console.log('error while searching artist', err))
})

//Get Tracks

app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.albumId)
  .then(data => {
    console.log('render.this:', data.body)
    res.render('tracks', {tracks: data.body.items})
  })
  .catch(err => console.log('The error while searching artist ocurred:', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')
let app = express() 


// let redirect_uri_login = 'https://onemusicauthserver.azurewebsites.net/callback'
let redirect_uri_login = 'http://localhost:8888/callback'
let client_id = ''
let client_secret = ''

app.use(cors())

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: redirect_uri_login
    }))
})


app.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            client_id + ':' + client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

      // let uri = process.env.FRONTEND_URI || 'https://one-music.azurewebsites.net/playlist'
      res.redirect(uri + '?access_token=' + access_token)
    })
  })


  // Generate apple music Token
const jwt = require('jsonwebtoken');
const fs = require('fs');

const private_key = fs.readFileSync('apple_private_key.p8').toString(); 
const team_id = ''; 
const key_id = ''; 
const token = jwt.sign({}, private_key, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: team_id,
  header: {
    alg: 'ES256',
    kid: key_id
  }
});

app.get('/token', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({token: token}));
});


let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
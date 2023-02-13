# Spotify To Apple Music Transfer

## Table of Contents
1. Folders
2. Logic
3. Setting up the Developer Accounts
4. Instructions

This project contains the source code for the music project that transfer playlist/songs from spotify to apple
music. The project is no longer live on Azure, but can be hosted on your local machine as you will see
later in the following sections.

## Folders
The project contains two node apps, one is node authentication server, `auth-server`, that handles obtaining spotify tokens, and generating apple music tokens. The second is the `spotify-to-applemusic` React client app that uses the obtained tokens to make direct calls to the Spotify and Apple Music API. 

## Logic
The app uses the spotify API to fetch the playlists from a spotify account. When playlists to be transfered have been selected, it goes and looks for the songs in those playlists, prepares a list of the songs in each playlist (artist name and song name, album). It then use the apple music api to search for all the songs in a playlist, then find the code for those songs. Then creates a playlists with the found codes for each song in a playlist. 

## Setting up the Developer Accounts
The setup for both of these accounts is pretty straightforward, however, the apple developer account will cost
you $99.

#### Note: You may have to wait up to 48 hours to get your apple developer account approved.

### Spotify Developer Account Setup
To sign up for a developer account use this link: https://developer.spotify.com/ .
Once you get on the site, go to the dashboard tab section and you should see an image similar to
the one below, but with no app created. Once you have created an app you can name it whatever you would
like and retrieve the client id and client secret.


<img width="941" alt="Spotify Developer Account" src="https://user-images.githubusercontent.com/73921414/218345782-3e915464-6a37-4953-a668-41716469cd7f.PNG">

### Apple Developer Account Setup

<img width="860" alt="Identifier_AppleDev" src="https://user-images.githubusercontent.com/73921414/218345141-32cbbf3e-c8e9-4587-8caf-f5910315a420.PNG">

## Instructions:
To run the webapp locally, you will need a Spotify developer account and an Apple developer account. The
setup for both accounts is mentioned above.

1. Clone the repo
2. Replace the `client_id` and `client_secret` with your spotify developer account values and the `team_id` and `key_id` with your apple developer account values. These changes will happen in the `auth-server/server.js` file.
3. Replace the `token_key` variable with a random UUID. Save this UUID as you will use it in the client to get the token from the server. 
4. Copy your key file (.p8) from the apple developer account and put it in the auth server folder, it is used in generating the apple music token.
5. `cd auth-server` and Run `npm install`, then start the server using `npm start`. Ensure the server is running by visiting `http://localhost:8888/login`, it should redirect to Spotify login page. `http://localhost:8888/token?key='your_UUID_from_step3`, this should return a token. 
6. `cd spotify-to-applemusic`. Replace the key in `src/apple/apple-auth.js` with your UUID from step 3. Run `npm install` then `npm start` to start the react app. 

Full Project Overview: https://www.youtube.com/watch?v=mS2J0dKcvAA&list=PLzFtdULM-ECKsfdNcUvU6Q1rCLcMC8q_B



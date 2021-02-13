import { getSpotifyPlaylists, extractSongName, fetchAllTracksFromGivenPlaylists } from '../../spotify/spotify'
import spotify_default from '../../svg/Spotify-liked-track.jpg'
import { store } from '../store/store';

export function fetchSpotifyPlaylists(data) {

  return (dispatch) => {
    return getSpotifyPlaylists(data)
      .then((response) => {

        let playlistData = [];
        let likedSongData = []
        var tempMap = {};

        //Adding the liked tracks as part of our playlists
        playlistData.push({
          name: 'Liked Songs',
          no_of_songs: response[1].length,
          playlist_owner: response[0][0].owner.display_name,
          image: spotify_default,
          id: 'allthelikedsongsid',
          isChecked: false,
        })

        //Parsing playlist for our client side
        response[0].forEach((response_item) => {
          let curItem = {};
          curItem['name'] = response_item.name;
          curItem['no_of_songs'] = response_item.tracks.total
          curItem['playlist_owner'] = response_item.owner.display_name
          var imurl = response_item.images[0].url
          if (imurl !== undefined) {
            curItem['image'] = response_item.images[0].url
          } else {
            curItem['image'] = spotify_default
          }
          curItem['image'] = response_item.images[0].url
          curItem['id'] = response_item.id
          curItem['isChecked'] = false
          playlistData.push(curItem)
          tempMap[response_item.id] = { name: response_item.name, description: response_item.description };
        })


        //Parsing the liked song for future purposes    
        response[1].forEach((song) => {
          let curItemSong = {};
          //Song parameters
          curItemSong["trackName"] = extractSongName(song.track.name);
          curItemSong["artistName"] = [];
          song.track.artists.forEach((artist) => {
            curItemSong["artistName"].push(artist.name)
          })
          // add album parameters
          curItemSong["albumName"] = song.track.album.name
          curItemSong["albumArtist"] = []
          song.track.album.artists.forEach((artist) => {
            curItemSong["albumArtist"].push(artist.name)
          })

          likedSongData.push(curItemSong)
        })

        dispatch({
          type: 'UPDATE_PLAYLIST',
          payload: {
            playlists: playlistData,
            tempMap: tempMap,
            likedSongData: likedSongData
          }
        });
      })
  };
};



export function prepareSpotifyDataToBeTransfered(playlistToBeTransferedIDs, tokenjson) {

  return (dispatch) => {
    return fetchAllTracksFromGivenPlaylists(playlistToBeTransferedIDs, tokenjson)
      .then((response) => {
        const state = store.getState();
        var playlistToBeTransfered = []

        if(playlistToBeTransferedIDs.has('allthelikedsongsid')){
          playlistToBeTransfered.push({ 'name': 'Liked Songs', 'description': 'Liked Songs in the playlist', 'tracks': state.spotify_reducer.likedSongData})
        }

        // var playlistToBeTransferedArray = Array.from(playlistToBeTransfered)
        response.forEach((response_item) => {
          for (var k in response_item) {
            var cur = {}
            cur["name"] = state.spotify_reducer.tempMap[k].name;
            cur["description"] = state.spotify_reducer.tempMap[k].description;
            cur["tracks"] = response_item[k];
            playlistToBeTransfered.push(cur)

          }
        })

        dispatch({
          type: 'TRANSFER',
          payload: playlistToBeTransfered
        });

      })
  }

}


export function updateToken(accessToken) {
  return {
    type: 'UPDATE_TOKEN',
    payload: accessToken
  }
}

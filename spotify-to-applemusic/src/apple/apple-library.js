import { apple_auth } from './apple-provider'
import { store } from '../modules/store/store'
import { updateSongsNotFound, updateTransferFinished } from '../modules/actions/apple-actions'

export function addToAppleLibrary() {

    const state = store.getState();
    var playlistToTransfer = state.spotify_reducer.transfer;
    var songsInPlaylists = [];
 
    playlistToTransfer.forEach((playlist) => {

        songsInPlaylists = [];
        playlist.tracks.forEach((item) => {
            songsInPlaylists.push({ a_name: item.artistName[0], t_name: item.trackName })
        })

        return Promise.all([
            songsInPlaylists.map((song) =>
                new Promise((resolve, reject) => {
                    findSong(song.a_name, song.t_name, resolve, reject)
                }))
        ]).then((res) => {
            Promise.all(res[0])
            .then((resolvedPlaylist) => {
                createPlaylistsInAppleLib({ name: playlist.name, tracks: resolvedPlaylist }, playlistToTransfer.indexOf(playlist), playlistToTransfer.length)
            })
        })
    });
}

export function findSong(artist, song, resolve, reject) {

    let extractedSong = extractSongNameVerbose(song)
    let searchparam = artist + ' ' + extractedSong.replace(/ /g, '+')

    searchparam = encodeURIComponent(searchparam)

    var url = 'https://api.music.apple.com/v1/catalog/us/search?term=' + searchparam + '&limit=25&types=songs'

    let data = {};
    fetch(url, {
        headers: apple_auth.getHeader()
    }).then((response) => {
        var res = response.json()
        var status = response.status;
        res.then((response) => {
            if (status === 200) {
                let added = false
                if (response.results.songs !== undefined) {
                    for (var i = 0; i < response.results.songs.data.length; i++) {
                        if (artistExists(artist, splitArtists(response.results.songs.data[i].attributes.artistName))) {
                            data.id = response.results.songs.data[i].id
                            data.type = 'songs'
                            resolve(data)
                            added = true;
                            break;
                        }
                    }
                } else {
                    resolve({ id: `We could not find ${song} by ${artist}` })
                }
                if (added) {
                    return;
                }
            }

            if (status === 400) {
                console.log('We got a 400 because of ' + song + ' by ' + artist)
                resolve({ id: `We could not find ${song} by ${artist}` })
            }
        })
    }).catch((error) => {
        console.log('Error', error)
    })
}


export function apiSearchHelper(url, resolve, reject, artist, song, delay) {
    let data = {};
    fetch(url, {
        headers: apple_auth.getHeader()
    }).then((response) => {
        var res = response.json()
        var status = response.status;
        res.then((response) => {
            if (status === 200) {
                let added = false

                if (response.results.songs !== undefined) {
                    for (var i = 0; i < response.results.songs.data.length; i++) {
                        if (artistExists(artist, splitArtists(response.results.songs.data[i].attributes.artistName))) {
                            data.id = response.results.songs.data[i].id
                            data.type = 'songs'
                            resolve(data)
                            added = true;
                            break;
                        }
                    }
                }
                if (added) {
                    return;
                }
            }

            if (status === 400) {
                console.log('We got a 400 because of ' + song + ' by ' + artist)
                resolve({ id: `We could not find ${song} by ${artist}` })
            }
        })
    }).catch((error) => {
        console.log('Error', error)
        if (delay > 10000) {
            return
        }

        delay = delay * 2
        setTimeout(() => {
            apiSearchHelper(url, resolve, reject, artist, song, delay)
        }, delay * 1000);
    })
}

export function createPlaylistsInAppleLib(thePlayList, currentIndexBeingProccessed, totalToProcess) {
    var validIDs = [];
    var invalidSongs = []
    thePlayList.tracks.forEach((t) => {
            if (t.id.includes("We could not find")) {
                invalidSongs.push(t.id.toString().substring(18))
            } else {
                validIDs.push(t)
            }
    })

    let data = {
        "attributes": {
            "name": thePlayList.name,
            "description": "..."
        },
        "relationships": {
            "tracks": {
                "data": validIDs
            }
        }
    }

    fetch('https://api.music.apple.com/v1/me/library/playlists', {
        headers: apple_auth.getHeader(),
        method: "POST",
        body: JSON.stringify(data),
        mode: 'cors'
    }).then((response) => {
        var res = response.json()
        var status = response.status;

        res.then((response) => {
            if (status !== 201) {
                console.log(status)
                console.log(response.error)
                console.log("There was an error creating the playlis with the songs")
                return;
            }

            //Update our not added list
            if (invalidSongs.length !== 0) {
                store.dispatch(updateSongsNotFound([{name: thePlayList.name, tracks: invalidSongs}]));
            }

            if (currentIndexBeingProccessed === totalToProcess - 1) {
                console.log("Added the songs to spotify, success !")
                store.dispatch(updateTransferFinished())

            }
        })
    }).catch((error) => {
        console.log(error)
    })
}

export function extractSongNameVerbose(str) {
    // remove (outro)
    // feat
    if (str.includes('(feat. ')) {
        return str.substring(0, str.indexOf('(feat. '))
    }
    if (str.includes('(Outro')) {
        return str.substring(0, str.indexOf('(Outro'))
    }
    if (str.includes('- Outro')) {
        return str.substring(0, str.indexOf('- Outro'))
    }
    if (str.includes('- Single')) {
        return str.substring(0, str.indexOf('- Single'))
    }
    if (str.includes('(Single')) {
        return str.substring(0, str.indexOf('(Single'))
    }

    // add curse words
    if (str.includes('f**k')) {
        str.replace('f**k', 'fuck')
    }
    if (str[str.length - 1] === ' ') {
        return (str.substring(0, str.length - 1))
    }
    return str
}

export function artistExists(artist, songArtist) {
    let arr = songArtist.map((artist) => {
        return artist.toLowerCase()
    })
    return arr.indexOf(artist.toLowerCase()) > -1
}

export function splitArtists(artists) {
    let seperatedArtists = []
    let firstSplit = artists.split(', ')
    for (let i = 0; i < firstSplit.length; i++) {
        let secondSplit = firstSplit[i].split(' & ')
        if (secondSplit.length < 2) {
            seperatedArtists.push(secondSplit[0])
        }
        else {
            // seperate by &
            secondSplit.forEach(
                (e) => {
                    seperatedArtists.push(e)
                }
            )
        }
    }
    return seperatedArtists
}

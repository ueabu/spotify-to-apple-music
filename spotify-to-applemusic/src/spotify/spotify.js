let baseSpotifyAPI = "https://api.spotify.com/v1";

export function getSpotifyPlaylists(tokenjson) {

    let accessToken = tokenjson.access_token
    var getPlaylistURL = baseSpotifyAPI + '/me/playlists?limit=50';
    // var getLikedSongsURL = baseSpotifyAPI + '/me/tracks';

    return Promise.all([
        new Promise((resolve, reject) => {
            getAllDataRecursively(getPlaylistURL, [], resolve, reject, accessToken) //Fetch Playlists
        }),
        // new Promise((resolve, reject) => {
        //     getAllDataRecursively(getLikedSongsURL, [], resolve, reject, accessToken) //Fetch liked song
        // })
    ])
}


export function getAllDataRecursively(url, data, resolve, reject, accessToken) {
    fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const retrievedData = data.concat(response.items);
            if (response.next !== null) {
                getAllDataRecursively(response.next, retrievedData, resolve, reject, accessToken)
            }
            else {
                resolve(retrievedData)
            }
        }).catch(error => {
            console.log(error)
            handleErrors(error)
            reject('Something wrong. Please refresh the page and try again.')
        })
}

function handleErrors(response) {
    if (!response.ok) {
        if (response.status === 401) {
            console.log(response)

            throw Error(response.statusText);
        }
        return response;
    }

}

export function extractSongName(str) {
    if (str.includes('(feat. ')) {
        return str.substring(0, str.indexOf('(feat. '))
    }
    else if (str.includes('(Feat. ')) {
        return str.substring(0, str.indexOf('(Feat. '))
    }
    else if (str.includes('(with ')) {
        return str.substring(0, str.indexOf('(with '))
    }
    return str
}



export function fetchAllTracksFromGivenPlaylists(listOfPlayListIDs, token) {
    let accessToken = token.access_token

    var listOfPlayListIDsArray = Array.from(listOfPlayListIDs)
    var getPlaylistURLs = listOfPlayListIDsArray.filter(function(id){
        if(id === 'allthelikedsongsid'){
            return false;
        }
        return true
    }).map((id) => {
        return baseSpotifyAPI + '/playlists/' + id + '/tracks?limit=50'
    });

    var playlistPromises = getPlaylistURLs.map((url) => 
    
    new Promise((resolve, reject) => {
        fetchSongsInfosInASinglePlaylistRecursively(url, [], accessToken, resolve, reject)
    }));

    return Promise.all(playlistPromises);
}


export function fetchSongsInfosInASinglePlaylistRecursively(url, compileddata, accessToken, resolve, reject) {
    console.log(url)
        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((response) => response.json())
        .then((response) => {
            let newData = [];
            response.items.forEach((data) => {
                let cur = {};
                if (data.track !== null) {
                    cur["trackName"] = extractSongName(data.track.name);
                    cur["artistName"] = [];
                    data.track.artists.forEach((artist) => {
                        cur["artistName"].push(artist.name)
                    })
                    // add album parameters
                    cur["albumName"] = data.track.album.name
                    cur["albumArtist"] = []
                    data.track.album.artists.forEach((artist) => {
                        cur["albumArtist"].push(artist.name)
                    })
                    newData.push(cur);
                }
            })
            const retrievedData = compileddata.concat(newData);
            if (response.next !== null) {
                fetchSongsInfosInASinglePlaylistRecursively(response.next, retrievedData, accessToken, resolve, reject)
            } else {
                var finalRES = {};
                finalRES[url.split('/')[5]] = retrievedData
                resolve(finalRES)
            }
        }).catch(error => {
            console.log(error)
            reject('Something wrong. Please refresh the page and try again.')
        })
}

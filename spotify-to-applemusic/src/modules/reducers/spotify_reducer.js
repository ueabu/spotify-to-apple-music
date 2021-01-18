const defaultState = {
  accessToken: '',
  playlists: [],
  transfer: [],
  loaded: false,
  likedSongData: [],
  tempMap: {}, 
  transferReady: false
}

export default function spotify_reducer(state = defaultState, action) {
  switch (action.type) {
    case 'UPDATE_TOKEN':
      return { ...state, accessToken: action.payload }
    case 'UPDATE_PLAYLIST':
      return { ...state, 
        playlists: action.payload.playlists, 
        likedSongData: action.payload.likedSongData, 
        tempMap: action.payload.tempMap, 
        loaded: true 
      }
    case 'TRANSFER':
      return { ...state, transfer: action.payload, transferReady: true }
    default:
      return state;
  }
}
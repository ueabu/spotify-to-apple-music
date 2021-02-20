const defaultState = {
  songsNotFound: [],
  transferDone: false,
  currentPlaylist: '',
  currentSong: ''
}

export default function apple_reducer(state = defaultState, action) {
  switch (action.type) {
    case 'UPDATE_NOTFOUND':
      return {
        ...state,
        songsNotFound: [...state.songsNotFound, ...action.payload],
      }
    case 'UPDATE_TRANSFER_FINISHED':
      return {
        ...state,
        transferDone: action.payload,
      }
    case 'UPDATE_CURRENT_PLAYLIST':
      console.log(action.payload)
      return {
        ...state,
        currentPlaylist: action.payload,
      }
    case 'UPDATE_CURRENT_SONG':
      return {
        ...state,
        currentSong: action.payload,
      }
    default:
      return state;
  }
}
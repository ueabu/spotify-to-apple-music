const defaultState = {
  songsNotFound: [],
  transferDone: false
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
    default:
      return state;
  }
}
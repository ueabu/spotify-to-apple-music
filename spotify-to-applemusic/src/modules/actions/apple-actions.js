import { addToAppleLibrary } from '../../apple/apple-library'

export function addPlaylistToApple(data) {
    return (dispatch) => {
        return addToAppleLibrary(data)
    }
}

export function updateSongsNotFound(data) {
    return {
        type: 'UPDATE_NOTFOUND',
        payload: data
    }
}

export function updateTransferFinished() {
    return {
        type: 'UPDATE_TRANSFER_FINISHED',
        payload: true
    }
}

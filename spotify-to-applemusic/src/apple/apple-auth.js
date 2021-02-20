const instance = window.MusicKit
const key = ''

/**
 * Configure the MusicKit library using the developer token, 
 * the call to the server for the token passes a key that the server is expecting
 * if you dont upload the key, the server will not return a result
 * @param {String} token 
 */
export async function configure(token) {
    var serverurl = 'http://localhost:8888/token?key='+key
    await fetch(serverurl, {
        mode: 'cors',
    })
        .then(response => response.json())
        .then(res => {
            console.log(res.token)
            instance.configure({
                developerToken: res.token,
                app: {
                    name: 'Playlist Converter',
                    build: '1978.4.1'
                }
            });
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * Return the Musickit instance
 */
export function getMusicInstance() {
    return instance.getInstance();
}


/**
 * Return users login status
 */
export function isLoggedIn() {
    try {
        return getMusicInstance().isAuthorized
    }
    catch (error) {
        return false;
    }
}

/**
 * Authorizes a user and retrieves a user token
 */
export function LogIn() {
    return getMusicInstance().authorize()
}

/**
 * Signs a User out
 */
export function LogOut() {
    return getMusicInstance().unauthorize()
}

export function getHeader() {
    const header = {
        Authorization: `Bearer ${getMusicInstance().developerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Music-User-Token': getMusicInstance().musicUserToken
    }
    return header
}
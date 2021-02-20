const instance = window.MusicKit


/**
 * Configure the MusicKit library using the developer token
 * @param {String} token 
 */
export async function configure(token){
    await fetch('https://onemusicauthserver.azurewebsites.net/token', {mode: 'cors'})
        .then(response=> response.json())
        .then(res => {
            instance.configure({
                developerToken:res.token,
                app: {
                    name: 'Playlist Converter',
                    build: '1978.4.1'
                }
            });
        })
        .catch((error)=>{
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
export function isLoggedIn(){
    try{
        return getMusicInstance().isAuthorized
    }
    catch(error){
        return false;
    }
}

/**
 * Authorizes a user and retrieves a user token
 */
export function LogIn(){
    return getMusicInstance().authorize()
}

/**
 * Signs a User out
 */
export function LogOut(){
    return getMusicInstance().unauthorize()
}

export function getHeader(){
    const header = {Authorization: `Bearer ${getMusicInstance().developerToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Music-User-Token': getMusicInstance().musicUserToken}
    return header
}
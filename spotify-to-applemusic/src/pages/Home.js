import React from 'react';
import screenShot from '../svg/two-images-refactor-1.png'


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            isShowing: false,
        }
    }

    showForm = () => {
        window.location.replace('https://onemusicauthserver.azurewebsites.net/login')
        // window.location.replace('http://localhost:8888/login')

    }

    closeForm = () => {
        this.setState({ isShowing: false });
    }

    render() {
        return (
            <section className="landing-page" >
                <div className="main-container">
                    <div className="landing-inner-div">
                        <p>Transfer playlists from Spotify to Apple Music.</p>
                        <p><strong>Ensure you have accounts with both Spotify and Apple Music before starting.</strong></p>

                        <button className="btn" onClick={this.showForm}>Transfer To Apple Music</button>
                        <img className="landingPageImage" src={screenShot} alt="Spotify to Apple music and Apple music to spotify"></img>
                    </div>
                </div>
            </section>
        );
    }
}

export default Home;
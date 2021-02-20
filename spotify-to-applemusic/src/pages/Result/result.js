import React from 'react';
import ScaleLoader from "react-spinners/ScaleLoader"
import { Redirect } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { apple_auth } from '../../apple/apple-provider'
import { addPlaylistToApple } from '../../modules/actions/apple-actions'
import success from '../../svg/success.svg'
import { SocialIcon } from 'react-social-icons';

import './style.scss'

class Results extends React.Component {
    constructor() {
        super()
        this.state = {
            transfer: [],
            loading: true,
            redirect: false,
            not_added: [],
            tabs: [],
            current_platform: '',
            foundjams: [],
            current_song: '',
            current_playlist: ''
        }
    }

    componentDidMount() {
        if (!apple_auth.isLoggedIn()) {
            this.setState({ redirect: true })
        }
        this.props.addPlaylistToApple(this.props.transfer)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.transferDone !== prevProps.transferDone) {
            this.setState({
                loading: false,
                not_added: this.props.songsNotFound
            })
        }
    }

    spinnerCss() {
        return (`height: 50vh;
        display: block;
        margin: 0 auto;
        margin-top: 50px;`)
    }

    success() {
        return (
            <div >
                <img alt="success" src={success} />
                <h1>Success!</h1>
                <p>Your playlists have been added to your Apple Music Account. Wait for 15 - 30 seconds and it should show up on the app.</p>
                {this.state.not_added.length > 0 ?
                    <div className="added">
                        <h3>These songs could not be added: </h3>
                        <div className="not-added">
                            {this.state.not_added.map(function (item) {
                                return (
                                    <div key={uuidv1()} className="tab">
                                        <h3>{item.name}</h3>
                                        <ul>
                                            {
                                                item.tracks.map(function (track) {
                                                    return <li key={uuidv1()}>{track}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        <p>
                            These songs could not be found on {this.state.current_platform} because the name of the song may be different on {this.state.current_platform} or the artist name
                            is different on {this.state.current_platform} or they do not exist on {this.state.current_platform}.
                            <br></br>
                            Feel free to search for them and add them manually to your playlist.
                        </p>
                    </div>
                    :
                    <div style={{
                        marginTop: '40px',
                        marginBottom: '40px'

                    }}>All the songs were added.</div>
                }
                <SocialIcon target="_blank" url="https://www.youtube.com/channel/UCvDqylEzCZJHNea6k1XMkQw" network="youtube" style={{ margin: 5 }} />
                <SocialIcon target="_blank" url="https://www.instagram.com/umacodes/?igshid=7fb4ipoir4xc" bgColor='#000000' network="instagram" style={{ margin: 5 }} />
                <SocialIcon target="_blank" url="https://github.com/ueabu/spotify-to-apple-music" bgColor='#000000' network="github" style={{ margin: 5 }} />
                <p style={{margin: 10}}>What to learn how I made this? Checkout the <a style={{color: 'red', textDecoration: 'underline'}} href="https://www.youtube.com/watch?v=mS2J0dKcvAA&list=PLzFtdULM-ECKsfdNcUvU6Q1rCLcMC8q_B" target="_blank" rel="noreferrer"><strong>Youtube Playlist</strong></a> that goes over the high level steps. 
                The code is available on <a style={{color: 'black', textDecoration: 'underline'}} rel="noreferrer" target="_blank" href="https://github.com/ueabu/spotify-to-apple-music" ><strong>Github</strong></a> as well. Feel free to fork and open a <a rel="noreferrer" style={{color: 'black', textDecoration: 'underline'}} target="_blank" href="https://github.com/ueabu/spotify-to-apple-music/pulls" ><strong>Pull Request</strong></a>. All Feedback is welcomed. Feel free to open <a style={{color: 'black', textDecoration: 'underline'}} rel="noreferrer" target="_blank" href="https://github.com/ueabu/spotify-to-apple-music/issues/new"><strong>issues and feature requests</strong></a>.</p>
            </div>
        )
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return (
            <div className="main-container results">
                {this.state.loading ?
                    <div style={{
                        marginTop: '50px'
                    }}>
                        <p>Searching for songs in the playlists and adding them. </p>
                        <ScaleLoader size={150} css={this.spinnerCss()} color={"#123abc"} />
                    </div>

                    : this.success()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        songsNotFound: state.apple_reducer.songsNotFound,
        transferDone: state.apple_reducer.transferDone,
        currentPlaylist: state.apple_reducer.currentPlaylist,
        currentSong: state.apple_reducer.currentSong
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addPlaylistToApple: bindActionCreators(addPlaylistToApple, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Results);
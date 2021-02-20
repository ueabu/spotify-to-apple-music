import React from 'react';
// import Checkbox from 'react-simple-checkbox';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { updateToken, fetchSpotifyPlaylists, prepareSpotifyDataToBeTransfered } from '../../modules/actions/spotify-actions'
import PlaylistCard from '../../components/PlaylistCard/playlistcard'
import ScaleLoader from "react-spinners/ScaleLoader"
import queryString from 'query-string';
import { apple_auth } from '../../apple/apple-provider'
import './style.scss';

class Playlist extends React.Component {

    constructor() {
        super();
        this.state = {
            parsedJsonData: [],
            spotifyAccessTokenJson: '',
            loading: true,
        };
    };

    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        this.props.updateToken(parsed.access_token)
        this.setState({ spotifyAccessTokenJson: parsed })
        this.props.fetchSpotifyPlaylists(parsed)
        this.selectedPlaylists = new Set();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.loaded !== prevProps.loaded){
            this.setState({
                loading: false,
                parsedJsonData: this.props.playlists
            })
        }

        if (this.props.transferReady !== prevProps.transferReady) {
            apple_auth.LogIn()
                .then((res) => {
                    if (res) {
                        this.props.history.push({
                            pathname: '/result',
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    handleCheckChildElement = (event) => {
        let json_data = this.state.parsedJsonData
        json_data.forEach(data => {
            if (data.id === event.target.id) {
                if (data.isChecked) {
                    data.isChecked = false
                    this.selectedPlaylists.delete(event.target.id);
                } else {
                    data.isChecked = true;
                    this.selectedPlaylists.add(event.target.id);
                }
            }
        })
        this.setState({ parsedJsonData: json_data })
    }

    spinnerCss() {
        return (`height: 50vh;
        display: block;
        margin: 0 auto;
        margin-top: 100px;`)
    }

    transferToApple = () => {
        this.setState({
            loading: true,
        })
        this.props.prepareSpotifyDataToBeTransfered(this.selectedPlaylists, this.state.spotifyAccessTokenJson)
    }

    render() {
        return (
            <div className="playlist">
                {
                    this.state.loading ? <p>Fetching playlists you own ...</p>
                    :
                    <p>Showing playlists you own. Select the Playlists you want to transfer</p>
                }
                


                <div className="playlist-inner">
                <div className="button-wrapper">
                    <button onClick={this.transferToApple}>Transfer Selected Playlists To Apple Music</button>
                </div>

                {(this.state.loading ? <ScaleLoader css={this.spinnerCss()} size={150} color={"#123abc"} /> : ' ')}
                {this.state.loading ? '' :
                    this.state.parsedJsonData.map((data) => {
                        return (<PlaylistCard
                            key={data.id}
                            name={data.name}
                            no_of_songs={data.no_of_songs}
                            playlist_owner={data.playlist_owner}
                            image={data.image}
                            uid={data.id}
                            handleCheckboxChange={this.handleCheckChildElement}
                            isSelected={data.isChecked}
                        />)
                    })
                }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accessToken: state.spotify_reducer.accessToken,
        transfer: state.spotify_reducer.transfer,
        playlists: state.spotify_reducer.playlists,
        loaded: state.spotify_reducer.loaded, 
        transferReady: state.spotify_reducer.transferReady, 
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateToken: bindActionCreators(updateToken, dispatch),
        fetchSpotifyPlaylists: bindActionCreators(fetchSpotifyPlaylists, dispatch),
        prepareSpotifyDataToBeTransfered: bindActionCreators(prepareSpotifyDataToBeTransfered, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);
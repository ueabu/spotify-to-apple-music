import React from 'react';
import ScaleLoader from "react-spinners/ScaleLoader"
import { Redirect } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { apple_auth } from '../../apple/apple-provider'
import {addPlaylistToApple} from '../../modules/actions/apple-actions'
import success from '../../svg/success.svg'
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
        }
    }

    componentDidMount() {
        if (!apple_auth.isLoggedIn()) {
            this.setState({ redirect: true })
        }
        this.props.addPlaylistToApple(this.props.transfer)

    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.transferDone !== prevProps.transferDone){
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
        margin-top: 100px;`)
    }

    success() {
        return (
            <div >
                <img alt="success" src={success} />
                <h1>Success!</h1>
                <p>Your playlists have been added to your Apple account.</p>
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
                    <div></div>
                }

            </div>
        )
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return (
            <div className="main-container results">
                {this.state.loading ? <ScaleLoader size={150} css={this.spinnerCss()} color={"#123abc"} /> : this.success()}
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {
        songsNotFound: state.apple_reducer.songsNotFound,
        transferDone: state.apple_reducer.transferDone
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
import { combineReducers } from 'redux';
import spotify_reducer from './spotify_reducer'
import apple_reducer from './apple_reducer'

const rootReducer = combineReducers({
  spotify_reducer,
  apple_reducer
});
  
export default rootReducer;
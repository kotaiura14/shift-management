import { createStore, combineReducers } from 'redux';
import shiftReducer from './reducers/shiftReducer';
import laborReducer from './reducers/laborReducer';

const rootReducer = combineReducers({
  shifts: shiftReducer,
  labor: laborReducer,
});

const store = createStore(rootReducer);

export default store;

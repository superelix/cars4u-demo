import { createStore, applyMiddleware,combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { carsReducer } from './reducers/carsReducer';
import thunk from 'redux-thunk';
import { alertsReducer } from './reducers/alertsReducer';
import { bookingsReducer } from './reducers/bookingsReducer';

const composeEnhancers = composeWithDevTools({
  
});

const rootReducer=combineReducers({
           alertsReducer,
           carsReducer,
           bookingsReducer
});

const store = createStore(
    rootReducer,
    composeEnhancers(
  applyMiddleware(thunk),
)
);

export default store;
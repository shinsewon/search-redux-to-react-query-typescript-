import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import searchReducer from '../search/reducer';
import searchSaga from '../search/saga';

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const enhancers = [
  applyMiddleware(logger, sagaMiddleware),
  composeWithDevTools(),
];

const store = createStore(searchReducer, compose(...enhancers));

export default store;
sagaMiddleware.run(searchSaga);

import { createStore, applyMiddleware } from 'redux';
import appReducers from 'redux/reducers';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducers, composeWithDevTools(applyMiddleware(sagaMiddleware)));

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
export { persistor };
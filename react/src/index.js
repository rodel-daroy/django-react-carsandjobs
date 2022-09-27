import './polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './redux';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { unregister } from './registerServiceWorker';
import { PersistGate } from 'redux-persist/integration/react';
import EmptyState from 'components/Layout/EmptyState';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import 'moment/locale/en-ca';
import 'moment/locale/fr-ca';

render(
	<DndProvider backend={HTML5Backend}>
		<Provider store={store}>
			<PersistGate 
				loading={<EmptyState.Loading />} 
				persistor={persistor}>

				<BrowserRouter>
					<App />
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</DndProvider>, 
	document.getElementById('root')
);
unregister();

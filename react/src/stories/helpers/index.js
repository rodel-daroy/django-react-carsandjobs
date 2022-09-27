import React from 'react';

import { Provider } from 'react-redux';
import store from '../../redux';
import { BrowserRouter } from 'react-router-dom';
import ModalContainer from 'components/Modals/ModalContainer';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import 'index.css';
import 'App.css';
import './index.css';

export const decorator = story => (
	<DndProvider backend={HTML5Backend}>
		<Provider store={store}>
			<BrowserRouter>
				<div>
					<ModalContainer />

					{story()}
				</div>
			</BrowserRouter>
		</Provider>
	</DndProvider>
);

let imageIndex = 0;

export const randomImage = (width, height, tags = 'cars') =>
	`https://loremflickr.com/${width}/${height}/${tags}?${imageIndex++}`;







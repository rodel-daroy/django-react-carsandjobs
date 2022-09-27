import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { decorator } from '../src/stories/helpers/index';

const req = require.context('../src/stories', false, /\.js$/);

function loadStories() {
	addDecorator(withKnobs);
	addDecorator(decorator);
	
	req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

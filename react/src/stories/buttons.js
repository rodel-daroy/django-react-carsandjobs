/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, boolean } from '@storybook/addon-knobs';

import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import RadialButton from 'components/Buttons/RadialButton';
import ThemeContext from 'components/Common/ThemeContext';

storiesOf('Buttons/Primary button', module)
	.add('large button', () => (
		<PrimaryButton size="large" onClick={action('onClick')}>
			Large button
		</PrimaryButton>
	))
	.add('medium button', () => (
		<PrimaryButton size="medium" onClick={action('onClick')}>
			Medium button
		</PrimaryButton>
	))
	.add('small button', () => (
		<PrimaryButton size="small" onClick={action('onClick')}>
			Small button
		</PrimaryButton>
	))
	.add('disabled', () => (
		<PrimaryButton disabled onClick={action('onClick')}>
			Button text
		</PrimaryButton>
	));

storiesOf('Buttons/Primary link', module)
	.add('link', () => (
		<PrimaryLink href="#">
			Primary link
		</PrimaryLink>
	))
	.add('link with icon', () => (
		<PrimaryLink 
			href="#" 
			iconClassName="icon icon-angle-right"
			hasIcon>

			Primary link
		</PrimaryLink>
	))
	.add('link with icon on right', () => (
		<PrimaryLink 
			href="#" 
			iconClassName="icon icon-angle-right"
			iconPosition="right"
			hasIcon>
			
			Primary link
		</PrimaryLink>
	))
	.add('disabled', () => (
		<PrimaryLink 
			href="#" 
			iconClassName="icon icon-angle-right"
			hasIcon
			disabled>

			Primary link
		</PrimaryLink>
	));

storiesOf('Buttons', module)
	.add('Radial button', () => {
		const size = select('Size', ['tiny', 'small', 'large'], RadialButton.defaultProps.size);
		const dark = boolean('Dark', false);

		return (
			<ThemeContext.Provider value={{ dark }}>
				<RadialButton size={size}>
					<span className="icon icon-angle-right"></span>
				</RadialButton>
			</ThemeContext.Provider>
		);
	});

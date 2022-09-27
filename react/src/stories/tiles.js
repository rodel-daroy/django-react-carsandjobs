/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';
import TileView from 'components/Tiles/TileView';
import TileSlot from 'components/Tiles/TileSlot';
import Tile from 'components/Tiles/Tile';
import TileContent from 'components/Tiles/TileContent';
import TileEditView from 'components/Tiles/TileEditView';
import TileEditViewTest from './helpers/TileEditViewTest';
import TileSelectViewTest from './helpers/TileSelectViewTest';
import { randomImage } from './helpers';
import range from 'lodash/range';

const IMAGES = range(0, 10).map(() => randomImage(960, 350));

storiesOf('Tiles', module)
	.add('tile', () => {
		const title = text('Title', 'title');
		const txt = text('Text', 'Lorem ipsum');
		const buttonText = text('Button text');
		const size = select('Size', [1, 2], 1);

		const to = text('To');
		const href = text('Href', 'https://www.youtube.com/embed/WApVQ-cBFcw');
		const target = text('Target', '_self');
		const image = select('Image', IMAGES, IMAGES[0]);

		return (
			<TileView>
				<TileSlot size={size}>
					<Tile 
						to={to} 
						href={href} 
						target={target}
						imageUrl={image}>

						<TileContent 
							title={title}
							text={txt}
							buttonText={buttonText}
							kind={size} />
					</Tile>
				</TileSlot>
			</TileView>
		);
	})
	.add('tile view', () => (
		<TileView>
			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" />
				</Tile>
			</TileSlot>
		</TileView>
	))
	.add('edit view', () => (
		<TileEditView 
			onInsert={action('onInsert')}
			onMove={action('onMove')}
			onEdit={action('onEdit')}
			onDelete={action('onDelete')}>

			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" title="Tile 1" />
				</Tile>
			</TileSlot>
			<TileSlot size={2}>
				<Tile>
					<TileContent kind="B" title="Tile 2" />
				</Tile>
			</TileSlot>
			<TileSlot size={2}>
				<Tile>
					<TileContent kind="B" title="Tile 3" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile>
					<TileContent kind="A" title="Tile 4" />
				</Tile>
			</TileSlot>
		</TileEditView>
	))
	.add('live edit view', () => (
		<TileEditViewTest />
	))
	.add('select view', () => (
		<TileSelectViewTest />
	));
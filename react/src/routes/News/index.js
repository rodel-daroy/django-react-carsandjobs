import React from 'react';
import TileView from 'components/Tiles/TileView';
import TileSlot from 'components/Tiles/TileSlot';
import TileContent from 'components/Tiles/TileContent';
import Tile from 'components/Tiles/Tile';
import ContentMetaTags from 'components/Content/ContentMetaTags';

const News = () => (
	<div className="news">
		<ContentMetaTags title="News" />

		<TileView>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=1" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=2" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={2}>
				<Tile imageUrl="https://picsum.photos/960/350?random=3" to="/">
					<TileContent kind="B" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={2}>
				<Tile imageUrl="https://picsum.photos/960/350?random=6" to="/">
					<TileContent kind="B" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=4" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=5" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=7" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={1}>
				<Tile imageUrl="https://picsum.photos/960/350?random=8" to="/">
					<TileContent kind="A" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
			<TileSlot size={2}>
				<Tile imageUrl="https://picsum.photos/960/350?random=9" to="/">
					<TileContent kind="B" title="Lorem ipsum" text="Donec quis dictum quam, in hendrerit risus" />
				</Tile>
			</TileSlot>
		</TileView>
	</div>
);

export default News;
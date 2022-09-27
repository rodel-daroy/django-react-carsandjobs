import orderBy from 'lodash/orderBy';

export const getTileCategories = async service => service.fetch({
	method: 'GET',
	url: 'tiles/all-tiles-categories/'
});

export const getUnusedTiles = async service => service.fetch({
	method: 'GET',
	url: 'tiles/unused-tiles/'
});

export const createTile = async (service, body) => service.fetch({
	method: 'POST',
	url: 'tiles/create-tile/',
	body
});

export const updateTile = async (service, { id, ...body }) => service.fetch({
	method: 'POST',
	url: `tiles/update-tile/${id}/`,
	body
});

export const getCategoryTiles = async (service, { categoryId }) => {
	let result = await service.fetch({
		method: 'POST',
		url: 'tiles/tiles/',
		body: {
			category: categoryId
		}
	});

	result = result.filter(tile => tile.active);
	result = orderBy(result, ['order']);
	return result;
};

export const setTileOrder = async (service, { categoryId, tiles }) => service.fetch({
	method: 'POST',
	url: 'tiles/set-tile-order/',
	body: {
		category: categoryId,
		tiles
	}
});

export const deleteTile = async (service, { tileId }) => service.fetch({
	method: 'POST',
	url: `tiles/delete-tile/${tileId}/`
});

export const getArticles = async (service, { language, ...body }) => service.fetch({
	method: 'POST',
	url: 'articles/all/',
	headers: {
		'Accept-Language': language
	},
	body
});
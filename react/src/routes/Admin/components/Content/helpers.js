let imageIndex = 0;

export const randomImage = (width, height, tags = 'cars') =>
	`https://loremflickr.com/${width}/${height}/${tags}?${imageIndex++}`;
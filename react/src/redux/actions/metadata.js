export const SAVE_METADATA = 'metadata/SAVE_METADATA';
export const REMOVE_METADATA = 'metadata/REMOVE_METADATA';

export const saveMetadata = (key, metadata) => ({
	type: SAVE_METADATA,
	payload: {
		key,
		metadata
	}
});

export const removeMetadata = (key) => ({
	type: REMOVE_METADATA,
	payload: {
		key
	}
});
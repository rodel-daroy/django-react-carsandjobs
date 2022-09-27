export const randomLatency = (errorChance = /* .1 */0) => new Promise((resolve, reject) => {
	setTimeout(() => {
		if(Math.random() <= errorChance)
			reject(new Error('Random API server error'));
		else
			resolve();
	}, Math.random() * 1000);
});
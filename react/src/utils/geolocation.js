import * as here from 'services/here';

export const getCurrentPosition = () => new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(resolve, reject);
});

export const getCurrentProvince = async () => {
	const { coords: { latitude, longitude } } = await getCurrentPosition();
	return here.reverseGeocodeProvince({ latitude, longitude });
};
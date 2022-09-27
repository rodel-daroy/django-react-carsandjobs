import { objToUrlSearch } from 'utils/url';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import { fetchApi } from 'services/helpers';
import { PROVINCES, HERE_APP_ID, HERE_APP_CODE } from 'config/constants';

const PROVINCE_CODES = PROVINCES.map(([, code]) => code);

const fetchHere = async (url, params = {}) => {
	const query = objToUrlSearch({
		gen: 9,
		...params,
		app_code: HERE_APP_CODE,
		app_id: HERE_APP_ID
	});

	const fullUrl = `${url}${query}`;

	return fetchApi(fullUrl, json => get(json, 'error_description'));
};

const autoComplete = async query => fetchHere('https://autocomplete.geocoder.api.here.com/6.2/suggest.json', query);

export const autoCompleteLocation = async ({ search }) => {
	const { suggestions } = await autoComplete({
		query: search,
		maxresults: 20,
		country: 'can',
		resultType: 'areas'
	});

	const locations = 
		(suggestions || [])
			.filter(suggestion => suggestion.matchLevel !== 'state')
			.map(suggestion => {
				const { address, matchLevel, locationId } = suggestion;

				let { state: province } = address;
				if(!PROVINCE_CODES.includes(province)) {
					const foundProvince = PROVINCES.find(([{ en, fr }]) => en === province || fr === province);

					if(foundProvince)
						province = foundProvince[1];
					else
						return null;
				}

				return {
					city: address[matchLevel],
					province,
					locationId
				};
			})
			.filter(location => !!location);

	return uniqBy(locations, ({ city, province }) => city + province);
};

const geocodeLocation = async locationId => fetchHere('https://geocoder.api.here.com/6.2/geocode.json', {
	locationid: locationId
});

const getPosition = result => {
	const displayPosition = get(result, 'Response.View[0].Result[0].Location.DisplayPosition');
	if(displayPosition) {
		return {
			latitude: displayPosition.Latitude,
			longitude: displayPosition.Longitude
		};
	}

	return null;
};

export const geocodeLocationPosition = async ({ locationId }) => {
	if(locationId)
		return getPosition(await geocodeLocation(locationId));

	return null;
};

const geocodeProvince = async province => fetchHere('https://geocoder.api.here.com/6.2/geocode.json', {
	addressattributes: 'state,country',
	state: province,
	country: 'CAN'
});

export const geocodeProvincePosition = async ({ province }) => getPosition(await geocodeProvince(province));

const reverseGeocode = async ({ latitude, longitude }) => fetchHere('https://reverse.geocoder.api.here.com/6.2/reversegeocode.json', {
	prox: `${latitude},${longitude}`,
	mode: 'retrieveAreas',
	maxresults: 1
});

export const reverseGeocodeProvince = async ({ latitude, longitude }) => {
	const result = await reverseGeocode({ latitude, longitude });

	const province = get(result, 'Response.View[0].Result[0].Location.Address.State');
	if(PROVINCE_CODES.includes(province))
		return province;

	return null;
};
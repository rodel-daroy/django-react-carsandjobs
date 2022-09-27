export const RECEIVER_PATH = '/complete';
 
export const redirectToSimpleReceiver = (payload, { location, match, history }) => {
	const newLocation = {
		...location,
		pathname: match.url + RECEIVER_PATH,
		state: payload
	};
	history.push(newLocation, false);
};
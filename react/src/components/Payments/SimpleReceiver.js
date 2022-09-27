import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { PaymentReceiverPropTypes } from './types';
import usePrevious from 'hooks/usePrevious';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const SimpleReceiver = ({ location: { state }, onSuccess, onError }) => {
	const prevState = usePrevious(state);

	useEffect(() => {
		if(state !== prevState) {
			if(state)
				onSuccess(state);
			else
				onError();
		}
	}, [state, prevState, onSuccess, onError]);

	return null;
};

SimpleReceiver.propTypes = {
	...PaymentReceiverPropTypes,

	location: PropTypes.object.isRequired
};

export default withLocaleRouter(SimpleReceiver);
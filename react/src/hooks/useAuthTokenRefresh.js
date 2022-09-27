import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthTokenRefreshing, authToken, hasAuthTokenRefreshError } from 'redux/selectors';
import { refreshToken } from 'redux/actions/user';
import usePrevious from './usePrevious';
import { persistor } from '../redux';

const useAuthTokenRefresh = () => {
	const dispatch = useDispatch();
	const refreshing = useSelector(isAuthTokenRefreshing);
	const prevRefreshing = usePrevious(refreshing);
	const refreshError = useSelector(hasAuthTokenRefreshError);

	const token = useSelector(authToken);

	const afterRefreshRef = useRef([]);

	const finishedRefresh = !refreshing && prevRefreshing;

	useEffect(() => {
		let cancelled = false;

		if(finishedRefresh) {
			persistor.flush().then(() => {
				if(!cancelled) {
					for(const handler of afterRefreshRef.current)
						handler(!refreshError && token);

					afterRefreshRef.current = [];
				}
			});
		}

		return () => {
			cancelled = true;
		};

	}, [finishedRefresh, token, refreshError]);

	const refreshRef = useRef();
	useEffect(() => {
		refreshRef.current = onAfterRefresh => {
			if(onAfterRefresh)
				afterRefreshRef.current.push(onAfterRefresh);

			if(!refreshing)
				dispatch(refreshToken({ throwError: true }));
		};
	}, [dispatch, refreshing]);

	const refresh = useCallback(onAfterRefresh => refreshRef.current(onAfterRefresh), []);

	return {
		refreshToken: refresh,
		isTokenRefreshing: refreshing
	};
};

export default useAuthTokenRefresh;
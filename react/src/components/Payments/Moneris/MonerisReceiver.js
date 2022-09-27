import { useEffect, useMemo } from 'react';
import { PaymentReceiverPropTypes } from 'components/Payments/types';
import { urlSearchToObj } from 'utils/url';
import usePrevious from 'hooks/usePrevious';

const MonerisReceiver = ({ location: { search }, onSuccess, onError }) => {
	const transaction = useMemo(() => urlSearchToObj(search), [search]);
	const prevTransaction = usePrevious(transaction);

	useEffect(() => {
		if(transaction.result != null && transaction !== prevTransaction) {
			if(transaction.result === '1') {
				// extract user data from rvar_ form values
				const userData = Object.keys(transaction)
					.map(key => {
						const result = key.match(/^rvar_(.*)$/);
						if(result)
							return {
								name: result[1],
								value: transaction[key]
							};

						return null;
					})
					.reduce((acc, cur) => {
						if(cur)
							return {
								...acc,
								[cur.name]: cur.value
							};

						return acc;
					}, {});

				const payload = {
					...userData,

					saleId: transaction.transactionKey,
					paymentGateway: 'moneris',
					result: transaction
				};

				onSuccess(payload);
			}
			else
				onError();
		}
	}, [transaction, prevTransaction, onSuccess, onError]);

	return null;
};

MonerisReceiver.propTypes = {
	...PaymentReceiverPropTypes
};
 
export default MonerisReceiver;
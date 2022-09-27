import { ADMIN_ROLE } from 'redux/selectors';

export const selectedDealers = (dealerId, dealers, role) => {
	if(dealerId)
		return [dealerId];
	else
		return (role === ADMIN_ROLE) ? null : dealers.map(d => d.id);
};
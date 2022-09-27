import React from 'react';
import './Spinner.css';

const Spinner = () => (
	<div className="spinner" role="progressbar">
		<div className="lds-spinner" style={{ width: '100%', height: '100%' }} role="presentation">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
);

export default Spinner;
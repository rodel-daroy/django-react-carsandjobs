import React, { Component } from 'react';
import PropTypes from 'prop-types';
import postscribe from 'postscribe';
import { INDEED_CONVERSION_ID } from 'config/constants';

class IndeedConversion extends Component {
	componentDidMount() {
		const { conversionId } = this.props;

		postscribe(this._container, 
			`<!-- Begin INDEED conversion code -->
			<script type="text/javascript">
			/* <![CDATA[ */
			var indeed_conversion_id = '${conversionId}';
			var indeed_conversion_label = '';
			/* ]]> */
			</script>
			<script type="text/javascript" src="//conv.indeed.com/applyconversion.js">
			</script>
			<noscript>
			<img height=1 width=1 border=0 src="//conv.indeed.com/pagead/conv/${conversionId}/?script=0">
			</noscript>
			<!-- End INDEED conversion code -->`);
	}

	render() { 
		return (
			<div ref={ref => this._container = ref}></div>
		);
	}
}

IndeedConversion.propTypes = {
	conversionId: PropTypes.string
};

IndeedConversion.defaultProps = {
	conversionId: INDEED_CONVERSION_ID
};
 
export default IndeedConversion;
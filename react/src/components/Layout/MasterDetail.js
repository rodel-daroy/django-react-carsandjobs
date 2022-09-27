import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import './MasterDetail.css';

const MasterDetail = ({ master, detail, className, showDetail, ratio, children, reverse, widthBreak, ...otherProps }) => {
	const getClassName = suffix => className ? `${className}${suffix || ''}` : '';

	const query = widthBreak ? { maxWidth: widthBreak } : mediaQuery('xs sm');

	return (
		<Media query={query}>
			{matches => {
				const masterVisible = !matches || !showDetail;
				const detailVisible = !matches || showDetail;

				return (
					<div {...otherProps} className={`md-layout ${reverse ? 'reverse' : ''} ${showDetail ? 'detail' : 'master'} ${ratio} ${getClassName()}`}>
						{children && children({ masterVisible, detailVisible })}

						{!children && masterVisible && (
							<div className={`md-layout-master ${getClassName('-master')}`}>
								<div className={`md-layout-master-inner ${getClassName('-master-inner')}`}>
									{master({ masterVisible, detailVisible })}
								</div>
							</div>
						)}

						{!children && detailVisible && (
							<div className={`md-layout-detail ${getClassName('-detail')}`}>
								<div className={`md-layout-detail-inner ${getClassName('-detail-inner')}`}>
									{detail({ masterVisible, detailVisible })}
								</div>
							</div>
						)}
					</div>
				);
			}}
		</Media>
	);
};

MasterDetail.propTypes = {
	master: PropTypes.func,
	detail: PropTypes.func,
	className: PropTypes.string,
	showDetail: PropTypes.bool,
	ratio: PropTypes.oneOf(['third', 'quarter']), 
	children: PropTypes.func,
	reverse: PropTypes.bool,
	widthBreak: integer()
};

MasterDetail.defaultProps = {
	ratio: 'third'
};

export default MasterDetail;
import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import RadialButton from 'components/Buttons/RadialButton';
import Paginator from 'components/Navigation/Paginator';
import Stepper from 'components/Navigation/Stepper';
import Localized from 'components/Localization/Localized';
import './PageStepper.css';

const handleIndexChange = (onChange, count) => newIndex => {	
	if(newIndex < 0)
		newIndex = count + newIndex;
	newIndex = newIndex % count;

	onChange(newIndex);
};

const PageStepper = ({ onChange, count, index, dark, wrapAround, className, size, numbers, limit }) => {
	const handleChange = handleIndexChange(onChange, count, index);

	const first = !wrapAround && index === 0;
	const last = !wrapAround && index === count - 1;

	return (
		<div className={`page-stepper ${className || ''}`}>
			<div className="page-stepper-page">
				<Stepper size={size} first={first} last={last} dark={dark} orientation="horizontal" onPrevious={handleChange.bind(this, index - 1)} onNext={handleChange.bind(this, index + 1)}>
					<Paginator dark={dark} pageCount={count} selectedPage={index % count} onChange={handleChange} numbers={numbers} limit={limit} />
				</Stepper>
			</div>
		</div>
	);
};

PageStepper.propTypes = {
	onChange: PropTypes.func.isRequired,
	count: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	dark: PropTypes.bool,
	wrapAround: PropTypes.bool,
	className: PropTypes.string,
	size: PropTypes.oneOf(['small', 'large']),
	numbers: PropTypes.bool,
	limit: integer()
};

PageStepper.defaultProps = {
	wrapAround: true
};

const PageStepperSmall = props => {
	const { onChange, count, index, wrapAround, className } = props;

	const handleChange = handleIndexChange(onChange, count, index);

	const first = !wrapAround && index === 0;
	const last = !wrapAround && index === count - 1;

	return (
		<Localized names="Common">
			{({ NextLabel, PreviousLabel }) => (
				<div className={`page-stepper small ${className || ''}`}>
					<div className="page-stepper-arrows">
						<div className="page-stepper-previous">
							<RadialButton disabled={first} size="tiny" onClick={handleChange.bind(this, index - 1)} aria-label={PreviousLabel}>
								<span className="icon icon-angle-left"></span>
								<span className="sr-only">{PreviousLabel}</span>
							</RadialButton>
						</div>
						<div className="page-stepper-index">
							{((index % count) + 1) || 0} / {count}
						</div>
						<div className="page-stepper-next">
							<RadialButton disabled={last} size="tiny" onClick={handleChange.bind(this, index + 1)} aria-label={NextLabel}>
								<span className="icon icon-angle-right"></span>
								<span className="sr-only">{NextLabel}</span>
							</RadialButton>
						</div>
					</div>
				</div>
			)}
		</Localized>
	);
};

PageStepperSmall.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...PageStepper.propTypes
};

PageStepperSmall.defaultProps = {
	...PageStepper.defaultProps
};

export { PageStepper, PageStepperSmall };
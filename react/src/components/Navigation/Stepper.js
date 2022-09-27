import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import RadialButton from 'components/Buttons/RadialButton';
import Localized from 'components/Localization/Localized';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './Stepper.css';

const Stepper = props => {
	const {
		orientation,
		first,
		last,
		onPrevious,
		onNext,
		children,
		dark,
		size
	} = props;

	const handleKeyDown = e => {
		switch(e.key) {
			case 'ArrowLeft': {
				if(onPrevious && !first) {
					e.preventDefault();
					onPrevious();
				}

				break;
			}

			case 'ArrowRight': {
				if(onNext && !last) {
					e.preventDefault();
					onNext();
				}

				break;
			}

			default:
				break;
		}
	};

	return (
		<Localized names="Common">
			{({ PreviousLabel, NextLabel }) => (
				<nav className={`stepper ${orientation} ${dark ? 'dark' : 'light'}`} onKeyDown={handleKeyDown}>
					<Media query={mediaQuery('xs')}>
						{matches =>
							((matches && size !== 'small') || size === 'large')
								? <div className="stepper-inner">
									<RadialButton
										dark={dark}
										disabled={first}
										onClick={onPrevious}
										size="tiny"
										aria-label={PreviousLabel}>
										
										{orientation === 'horizontal'
											? <span className="icon icon-angle-left" />
											: <span className="icon icon-angle-up" />}
									</RadialButton>

									{children}

									<RadialButton dark={dark} disabled={last} onClick={onNext} size="tiny" aria-label={NextLabel}>
										{orientation === 'horizontal'
											? <span className="icon icon-angle-right" />
											: <span className="icon icon-angle-down" />}
									</RadialButton>
								</div>
								: <div className="stepper-inner">
									<PrimaryLink
										className="stepper-button"
										as="button"
										type="button"
										size="large"
										disabled={first}
										onClick={onPrevious}
										aria-label={PreviousLabel}>

										{orientation === 'horizontal'
											? <span className="icon icon-angle-left" />
											: <span className="icon icon-angle-up" />}
									</PrimaryLink>

									{children}

									<PrimaryLink
										className="stepper-button"
										as="button"
										type="button"
										size="large"
										disabled={last}
										onClick={onNext}
										aria-label={NextLabel}>

										{orientation === 'horizontal'
											? <span className="icon icon-angle-right" />
											: <span className="icon icon-angle-down" />}
									</PrimaryLink>
								</div>}
					</Media>
				</nav>
			)}
		</Localized>
	);
};

Stepper.propTypes = {
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),
	first: PropTypes.bool,
	last: PropTypes.bool,
	onPrevious: PropTypes.func,
	onNext: PropTypes.func,
	children: PropTypes.node,
	dark: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'large'])
};

Stepper.defaultProps = {
	orientation: 'vertical'
};

export default Stepper;

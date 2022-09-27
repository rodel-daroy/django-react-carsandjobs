import React from 'react';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import CommandBar from 'components/Layout/CommandBar';
import Localized from 'components/Localization/Localized';
import Timeout from 'components/Common/Timeout';
import './helpers.css';

export const renderModalContent = (content, close) => typeof content === 'function' ? content({ close }) : content;

const defaultConfirmContent = () => (
	<Localized names="Common">
		{({ ConfirmMessage }) => ConfirmMessage}
	</Localized>
);

export const confirmModal = ({ content = defaultConfirmContent, onOk, ...props }) => ({
	...props,
	/* eslint-disable react/display-name, react/prop-types */
	content: ({ close }) => (
		<Localized names="Common">
			{({ OkLabel, CancelLabel }) => (
				<div>
					<div className="confirm-modal-content">
						{renderModalContent(content, close)}
					</div>

					<CommandBar>
						<PrimaryButton 
							onClick={() => {
								onOk();
								close();
							}}>

							{OkLabel}
						</PrimaryButton>
						<PrimaryLink as="button" onClick={close} hasIcon iconClassName="icon icon-cancel">
							{CancelLabel}
						</PrimaryLink>
					</CommandBar>
				</div>
			)}
		</Localized>
	)
	/* eslint-enable */
});

export const passiveModal = ({ content, timeout = 2000, ...props }) => ({
	...props,
	clickToClose: true,

	/* eslint-disable react/display-name, react/prop-types */
	content: ({ close }) => (
		<Timeout timeout={timeout} onTimeout={close}>
			{renderModalContent(content, close)}
		</Timeout>
	)
	/* eslint-enable */
});
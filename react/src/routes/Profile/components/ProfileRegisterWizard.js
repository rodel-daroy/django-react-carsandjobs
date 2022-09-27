import React from 'react';
import { RegisterForms } from './Forms';
import Wizard from 'components/Forms/Wizard';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';

const ProfileRegisterWizard = props => (
	<Localized names="Profile">
		{localized => {
			const { RegisterTitle } = localized;

			return (
				<React.Fragment>
					<ContentMetaTags title={RegisterTitle} />

					<Wizard 
						{...props}
						
						title={<h1>{RegisterTitle}</h1>}
						forms={RegisterForms} 
						form="register"
						localized={localized} />
				</React.Fragment>
			);
		}}
	</Localized>
);

export default ProfileRegisterWizard;



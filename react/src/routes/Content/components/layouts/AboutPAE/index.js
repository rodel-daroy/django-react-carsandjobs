import React from 'react';
import { ContentPropTypes } from '../../types';
import ContentLayout from '../../ContentLayout';

const AboutPAE = ({ content }) => (
	<ContentLayout className="about-pae-layout">
		<ContentLayout.Content>
			{content}
		</ContentLayout.Content>
	</ContentLayout>
);

AboutPAE.propTypes = {
	...ContentPropTypes
};
 
export default AboutPAE;
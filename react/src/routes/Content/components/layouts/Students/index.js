import React from 'react';
import { ContentPropTypes } from '../../types';
import ASpot from 'components/Content/ASpot';
import ProgrammeSearchBox from './ProgrammeSearchBox';
import ContentLayout from '../../ContentLayout';
import { SCREEN_MD_MAX } from 'utils/style';
import { mediaQuery } from 'utils/style';
import Media from 'react-media';
import Sticky from 'react-sticky-el';
import './index.css';

const Students = ({ title, subTitle, content, image }) => (
	<ContentLayout className="students-layout" reverse ratio="third" widthBreak={SCREEN_MD_MAX}>
		<ASpot image={image}>
			<h1>{title}</h1>
			{subTitle && <h2>{subTitle}</h2>}
		</ASpot>

		<ContentLayout.Content
			sidebar={(
				<Sticky topOffset={-24}>
					<ProgrammeSearchBox compact />
				</Sticky>
			)}>

			{content}
		</ContentLayout.Content>

		<Media query={mediaQuery('xs sm md')}>
			<ProgrammeSearchBox />
		</Media>
	</ContentLayout>
);

Students.propTypes = {
	...ContentPropTypes
};
 
export default Students;
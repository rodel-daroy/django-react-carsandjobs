/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { BrowserRouter } from 'react-router-dom';

import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import SectionIndicator from 'components/Navigation/SectionIndicator';
import AnchorNav from 'components/Navigation/AnchorNav';
import TabSet from 'components/Navigation/TabSet';
import FieldTest from './helpers/FieldTest';

storiesOf('Navigation/Breadcrumbs', module)
	.add('breadcrumbs', () => (
		<BrowserRouter>
			<Breadcrumbs>
				<Breadcrumbs.Crumb name="test 1" to="/test1" />
				<Breadcrumbs.Crumb name="test 2" to="/test2" />
			</Breadcrumbs>
		</BrowserRouter>
	))
	.add('breadcrumbs with current crumb', () => (
		<BrowserRouter>
			<Breadcrumbs>
				<Breadcrumbs.Crumb name="test 1" to="/test1" />
				<Breadcrumbs.Crumb name="test 2" to="/" />
			</Breadcrumbs>
		</BrowserRouter>
	));

storiesOf('Navigation/Tab set', module)
	.add('Tab set', () => (
		/* eslint-disable react/display-name */ 
		<FieldTest as={TabSet} valueProp="index" name="tabs">
			<TabSet.Tab caption="Tab 1">
				{() => (
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus non enim in volutpat. Donec varius velit in erat dignissim, vel posuere nunc vulputate. Suspendisse lorem dolor, porta sit amet lacus sed, congue fringilla justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus libero mi, bibendum non placerat ut, facilisis ut ante. Suspendisse viverra elit lacus. Donec egestas tortor non arcu placerat faucibus. Nunc eu posuere leo. Quisque ut lacus ut urna placerat condimentum. Nam ut nibh vitae justo aliquet maximus a dignissim risus. Quisque sed libero pulvinar, gravida magna quis, porta sapien. Nunc vitae elit quis eros auctor ultricies. Praesent congue fermentum felis, mattis accumsan nisi pharetra vitae. Sed at ullamcorper tellus. Aenean aliquet metus sed ex efficitur sagittis.</p>
				)}
			</TabSet.Tab>
			<TabSet.Tab caption="Tab 2">
				{() => (
					<p>Donec posuere erat quis nunc varius, id ultrices leo rutrum. Pellentesque id molestie ligula, id semper elit. Aenean tristique augue sit amet velit tempor consectetur. Nulla non vulputate enim, nec maximus purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sodales nulla ipsum, ac tincidunt justo maximus vitae. Aliquam congue neque vitae lacus accumsan feugiat. Aliquam magna massa, sollicitudin sit amet sollicitudin at, sagittis ut velit. Fusce pellentesque velit mauris, non faucibus orci pellentesque vel. Aenean suscipit quam ante, ac mattis dui vulputate vel. Nullam non sollicitudin arcu, a varius ligula. In tristique ipsum eget molestie vulputate. In hac habitasse platea dictumst. Vestibulum lacinia lacus et tempus mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
				)}
			</TabSet.Tab>
		</FieldTest>
		/* eslint-enable */
	))
	.add('Tab set with initial tab', () => (
		/* eslint-disable react/display-name */ 
		<FieldTest as={TabSet} valueProp="index" name="tabs" value={1}>
			<TabSet.Tab caption="Tab 1">
				{() => (
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus non enim in volutpat. Donec varius velit in erat dignissim, vel posuere nunc vulputate. Suspendisse lorem dolor, porta sit amet lacus sed, congue fringilla justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus libero mi, bibendum non placerat ut, facilisis ut ante. Suspendisse viverra elit lacus. Donec egestas tortor non arcu placerat faucibus. Nunc eu posuere leo. Quisque ut lacus ut urna placerat condimentum. Nam ut nibh vitae justo aliquet maximus a dignissim risus. Quisque sed libero pulvinar, gravida magna quis, porta sapien. Nunc vitae elit quis eros auctor ultricies. Praesent congue fermentum felis, mattis accumsan nisi pharetra vitae. Sed at ullamcorper tellus. Aenean aliquet metus sed ex efficitur sagittis.</p>
				)}
			</TabSet.Tab>
			<TabSet.Tab caption="Tab 2">
				{() => (
					<p>Donec posuere erat quis nunc varius, id ultrices leo rutrum. Pellentesque id molestie ligula, id semper elit. Aenean tristique augue sit amet velit tempor consectetur. Nulla non vulputate enim, nec maximus purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sodales nulla ipsum, ac tincidunt justo maximus vitae. Aliquam congue neque vitae lacus accumsan feugiat. Aliquam magna massa, sollicitudin sit amet sollicitudin at, sagittis ut velit. Fusce pellentesque velit mauris, non faucibus orci pellentesque vel. Aenean suscipit quam ante, ac mattis dui vulputate vel. Nullam non sollicitudin arcu, a varius ligula. In tristique ipsum eget molestie vulputate. In hac habitasse platea dictumst. Vestibulum lacinia lacus et tempus mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
				)}
			</TabSet.Tab>
		</FieldTest>
		/* eslint-enable */
	))
	.add('Uncontrolled', () => (
		<TabSet name="tabs" onChange={action('onChange')}>
			<TabSet.Tab caption="Tab 1">
				{() => (
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus non enim in volutpat. Donec varius velit in erat dignissim, vel posuere nunc vulputate. Suspendisse lorem dolor, porta sit amet lacus sed, congue fringilla justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus libero mi, bibendum non placerat ut, facilisis ut ante. Suspendisse viverra elit lacus. Donec egestas tortor non arcu placerat faucibus. Nunc eu posuere leo. Quisque ut lacus ut urna placerat condimentum. Nam ut nibh vitae justo aliquet maximus a dignissim risus. Quisque sed libero pulvinar, gravida magna quis, porta sapien. Nunc vitae elit quis eros auctor ultricies. Praesent congue fermentum felis, mattis accumsan nisi pharetra vitae. Sed at ullamcorper tellus. Aenean aliquet metus sed ex efficitur sagittis.</p>
				)}
			</TabSet.Tab>
			<TabSet.Tab caption="Tab 2">
				{() => (
					<p>Donec posuere erat quis nunc varius, id ultrices leo rutrum. Pellentesque id molestie ligula, id semper elit. Aenean tristique augue sit amet velit tempor consectetur. Nulla non vulputate enim, nec maximus purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sodales nulla ipsum, ac tincidunt justo maximus vitae. Aliquam congue neque vitae lacus accumsan feugiat. Aliquam magna massa, sollicitudin sit amet sollicitudin at, sagittis ut velit. Fusce pellentesque velit mauris, non faucibus orci pellentesque vel. Aenean suscipit quam ante, ac mattis dui vulputate vel. Nullam non sollicitudin arcu, a varius ligula. In tristique ipsum eget molestie vulputate. In hac habitasse platea dictumst. Vestibulum lacinia lacus et tempus mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
				)}
			</TabSet.Tab>
		</TabSet>
	));

storiesOf('Navigation/Section indicator', module)
	.add('section indicator', () => (
		<SectionIndicator
			onChange={action('onChange')}
			index={2}
			sections={[
				{
					name: 'Section 1',
					complete: true
				},
				{
					name: 'Section 2',
					complete: true
				},
				{
					name: 'Section 3',
					complete: false
				},
				{
					name: 'Section 4',
					complete: false,
					disabled: true
				}
			]} />
	));

storiesOf('Navigation/Anchor nav', module)
	.add('Anchor nav', () => (
		<BrowserRouter>
			<div className="anchor-nav-container">
				<div className="anchor-nav-container-nav">
					<AnchorNav scrollSelector=".anchor-nav-container">
						<AnchorNav.Link name="Test 1" anchor="test1" />
						<AnchorNav.Link name="Test 2" anchor="test2" />
						<AnchorNav.Link name="Test 3" anchor="test3" />
					</AnchorNav>
				</div>

				<div className="anchor-nav-container-scrolling">
					<h1 id="test1">Test 1</h1>
					<h1 id="test2">Test 2</h1>
					<h1 id="test3">Test 3</h1>
				</div>
			</div>
		</BrowserRouter>
	));
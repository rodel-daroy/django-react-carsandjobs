import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import LocaleLink from 'components/Localization/LocaleLink';
import omit from 'lodash/omit';
import VideoFrame from 'components/Content/VideoFrame';
import { useSelector } from 'react-redux';
import { language } from 'redux/selectors';
import './TileAction.css';

export const VideoPropTypes = {
	src: PropTypes.string,
	type: PropTypes.string
};

export const TileActionPropTypes = {
	to: PropTypes.any,
	href: PropTypes.string,
	target: PropTypes.string,
	onClick: PropTypes.func,
	video: PropTypes.shape(VideoPropTypes)
};

const EMBED_URLS = [
	[/(https:\/\/)?((www|m)\.)?youtube\.com\/(embed\/|watch\?v=)([a-zA-Z0-9-]+)/gi, 'https://www.youtube.com/embed/$5'],
	[/(https:\/\/)?youtu\.be\/([a-zA-Z0-9-]+)/gi, 'https://www.youtube.com/embed/$2']
];

const getEmbedUrl = (url, parameters) => {
	if(url)
		for(const [regex, replace] of EMBED_URLS) {
			if(regex.test(url))
				return url.replace(regex, replace) + (parameters || '');
		}

	return undefined;
};

const TileAction = props => {
	const { to, href, target, onClick, children, className, video } = props;
	const [playingVideo, setPlayingVideo] = useState(false);

	const handlePlayVideo = useCallback(() => void setPlayingVideo(true), [setPlayingVideo]);
	const handleVideoClose = useCallback(() => void setPlayingVideo(false), [setPlayingVideo]);

	const lang = useSelector(language);
	const youtubeParams = `?rel=0&autoplay=1&modestbranding=1&hl=${lang}`;

	const embedUrl = getEmbedUrl(href, youtubeParams);

	const otherProps = omit(props, Object.keys(AllTileActionPropTypes));

	const outlineElement = <div className="tile-action-outline"></div>;

	if(href && !embedUrl) {
		return (
			<a {...otherProps} className={`tile-action ${className || ''}`} href={href} target={target}>
				{outlineElement}
				{children}
			</a>
		);
	}

	if(to && !embedUrl)
		return (
			<LocaleLink {...otherProps} className={`tile-action ${className || ''}`} to={to}>
				{outlineElement}
				{children}
			</LocaleLink>
		);

	// must be video
	return (
		<button {...otherProps} className={`btn tile-action ${className || ''}`} onClick={onClick || handlePlayVideo}>
			{outlineElement}
			{children}

			{(video || embedUrl) && (
				<VideoFrame 
					{...video}
					embedUrl={embedUrl}
					onClose={handleVideoClose}
					isOpen={playingVideo} />
			)}
		</button>
	);
};

export const AllTileActionPropTypes = {
	...TileActionPropTypes,

	children: PropTypes.node,
	className: PropTypes.string
};

TileAction.propTypes = {
	...AllTileActionPropTypes
};

export default TileAction;
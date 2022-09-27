import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMde, { ReactMdeCommands, DraftUtil } from 'react-mde';
import { parseMarkdown } from 'utils/format';
import PasteFromWordModal from './PasteFromWordModal';
import Localized from 'components/Localization/Localized';
import './MarkdownEditor.css';

const { headerCommand, boldCommand, italicCommand, unorderedListCommand, orderedListCommand } = ReactMdeCommands;

const COMMANDS = [
	[headerCommand, boldCommand, italicCommand],
	[unorderedListCommand, orderedListCommand]
];

const OFFSET_HEADINGS = 2;

class MarkdownEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mdeState: {
				markdown: props.value || ''
			}
		};
	}

	updateState(markdown) {
		const { mdeState } = this.state;

		if(mdeState.draftEditorState) {
			const draftState = DraftUtil.buildNewDraftState(mdeState.draftEditorState, {
				selection: {
					start: 0,
					end: 0
				},
				text: markdown
			});

			this.setState({
				mdeState: {
					markdown,
					html: parseMarkdown(markdown, { offsetHeadings: OFFSET_HEADINGS }),
					draftEditorState: draftState
				}
			});
		}
		else {
			this.setState({
				mdeState: {
					markdown
				}
			});
		}
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;
		const { mdeState } = this.state;

		const currentMarkdown = mdeState.markdown || '';
		const newMarkdown = value || '';

		if(prevProps.value !== value && newMarkdown !== currentMarkdown)
			this.updateState(newMarkdown);
	}

	handleChange = mdeState => {
		const { onChange } = this.props;

		this.setState({
			mdeState
		});

		if(onChange)
			onChange(mdeState.markdown);
	}

	generateMarkdownPreview = markdown => {
		return Promise.resolve(parseMarkdown(markdown, { offsetHeadings: OFFSET_HEADINGS }));
	}

	handleFocus = () => {
		const { onFocus } = this.props;

		this.setState({
			focused: true
		});

		if(onFocus)
			onFocus();
	}

	handleBlur = () => {
		const { onBlur } = this.props;

		this.setState({
			focused: false
		});

		if(onBlur)
			onBlur();
	}

	pasteFromWordCommand = {
		buttonContentBuilder: ({ iconProvider }) => iconProvider('file-word'),
		buttonProps: { 'aria-label': 'Paste from Word' },
		execute: state => {
			this.setState({
				showPasteFromWord: true
			});

			return state;
		}
	}

	handlePasteFromWord = text => {
		const { onChange } = this.props;

		this.setState({
			showPasteFromWord: false
		});

		if(onChange)
			onChange(text);
	}

	handlePasteFromWordClose = () => {
		this.setState({
			showPasteFromWord: false
		});
	}

	render() { 
		const { className, state, disabled, readOnly } = this.props;
		const { mdeState, focused, showPasteFromWord } = this.state;

		const disable = disabled || readOnly;

		return (
			<Localized names="Common">
				{({ PreviewLabel = 'Preview' }) => (
					<div 
						className={`markdown-editor ${focused ? 'focused' : ''} ${state || ''} ${disable ? 'disabled' : ''} ${className || ''}`} 
						onFocus={this.handleFocus} 
						onBlur={this.handleBlur}>

						<ReactMde
							layout="vertical"
							onChange={this.handleChange}
							editorState={mdeState}
							generateMarkdownPreview={this.generateMarkdownPreview}
							buttonContentOptions={{
								iconProvider: name => <span className={`icon icon-${name}`}></span>
							}}
							commands={[...COMMANDS, [this.pasteFromWordCommand]]} />

						<div className="markdown-editor-preview">
							<div className="markdown-editor-preview-title">
								{PreviewLabel}
							</div>
							<div 
								className="markdown-editor-preview-content" 
								dangerouslySetInnerHTML={{ __html: mdeState.html }}></div>
						</div>

						<PasteFromWordModal 
							isOpen={showPasteFromWord} 
							onSubmit={this.handlePasteFromWord}
							onClose={this.handlePasteFromWordClose} />
					</div>
				)}
			</Localized>
		);
	}
}

MarkdownEditor.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	className: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	state: PropTypes.oneOf(['success', 'error', 'warning']),
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool
};
 
export default MarkdownEditor;
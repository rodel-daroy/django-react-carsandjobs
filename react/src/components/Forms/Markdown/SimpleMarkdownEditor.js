import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import EasyMDE from 'easymde';
import PasteFromWordModal from './PasteFromWordModal';
import Localized from 'components/Localization/Localized';
import debounce from 'lodash/debounce';
import { parseMarkdown } from 'utils/format';
import memoize from 'lodash/memoize';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import './SimpleMarkdownEditor.css';

class MarkdownEditor extends Component {
	state = {}

	static getCommands = memoize(localized => {
		return [
			{
				name: 'heading',
				action: EasyMDE.toggleHeadingSmaller,
				className: 'icon icon-heading',
				title: localized.HeadingFormatLabel
			},
			{
				name: 'bold',
				action: EasyMDE.toggleBold,
				className: 'icon icon-bold',
				title: localized.BoldFormatLabel
			},
			{
				name: 'italic',
				action: EasyMDE.toggleItalic,
				className: 'icon icon-italic',
				title: localized.ItalicFormatLabel
			},
			'|',
			{
				name: 'unordered-list',
				action: EasyMDE.toggleUnorderedList,
				className: 'icon icon-list-ul',
				title: localized.BulletsFormatLabel
			},
			{
				name: 'ordered-list',
				action: EasyMDE.toggleOrderedList,
				className: 'icon icon-list-ol',
				title: localized.NumberedListFormatLabel
			},
			/* '|',
			{
				name: 'paste-from-word',
				action: () => {
					this.setState({
						showPasteFromWord: true
					});
				},
				className: 'icon icon-file-word',
				title: localized.PasteFromWordFormatLabel
			} */
		];
	})

	componentDidMount() {
		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
		this.handleResize();

		this.updatePreview(this.props.value);
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;

		if(value !== prevProps.value)
			this.updatePreview(value);
	}

	componentWillUnmount() {
		this._resizeSensor.detach();

		this._unmounting = true;
	}

	handleResize = () => {
		const showPreview = this._container.clientWidth >= 600;

		if(showPreview !== this.state.showPreview)
			this.setState({
				showPreview
			});
	}

	handlePasteFromWord = text => {
		this.setState({
			showPasteFromWord: false
		});

		this.handleChange(text);
	}

	handlePasteFromWordClose = () => {
		this.setState({
			showPasteFromWord: false
		});
	}

	handleChange = value => {
		const { onChange } = this.props;

		this.updatePreview(value);

		if(onChange)
			onChange(value);
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

	updatePreview = debounce(value => {
		if(!this._unmounting && value !== this.state.lastPreviewed)
			this.setState({
				preview: parseMarkdown(value, { offsetHeadings: 2 }),
				lastPreviewed: value
			});
	}, 100)

	render() {
		const { id, value, className, disabled, readOnly, state, placeholder, autofilled, template } = this.props;
		const { showPasteFromWord, preview, focused, showPreview } = this.state;

		const disable = disabled || readOnly;

		return (
			<Localized names="Common">
				{({ 
					PreviewLabel = 'Preview',
					...localized
				}) => (
					<div 
						ref={ref => this._container = ref}
						className={`simple-markdown-editor 
							${template ? 'template' : ''}
							${focused ? 'focused' : ''} 
							${state || ''} 
							${autofilled ? 'autofilled' : ''} 
							${disable ? 'disabled' : ''} 
							${className || ''}`}
						onFocus={this.handleFocus} 
						onBlur={this.handleBlur}>

						{!disable && (
							<SimpleMDE 
								className="simple-markdown-editor-mde"
								id={id}
								value={value} 
								onChange={this.handleChange}
								options={{
									autoDownloadFontAwesome: false,
									spellChecker: false,
									status: false,
									toolbar: MarkdownEditor.getCommands(localized),
									parsingConfig: {
										allowAtxHeaderWithoutSpace: true
									},
									placeholder
								}} />
						)}

						{showPreview && (
							<div className="simple-markdown-editor-preview">
								<div className="simple-markdown-editor-preview-title">
									{PreviewLabel}
								</div>
								<div 
									className="simple-markdown-editor-preview-content" 
									dangerouslySetInnerHTML={{ __html: preview }}></div>
							</div>
						)}

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
	id: PropTypes.string,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	state: PropTypes.oneOf(['success', 'error', 'warning']),
	placeholder: PropTypes.string,
	autofilled: PropTypes.bool,
	template: PropTypes.bool
};
 
export default MarkdownEditor;
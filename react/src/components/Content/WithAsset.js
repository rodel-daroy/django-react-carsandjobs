import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAsset } from 'redux/actions/content';
import { Asset } from 'types/content';
import get from 'lodash/get';
import AssetConverter from './AssetConverter';

class WithAsset extends Component {
	constructor(props) {
		super(props);

		const { loadAsset, name, asset } = props;
		if(!asset)
			loadAsset({ name });

		this.state = {
			asset: new AssetConverter(asset)
		};
	}

	componentDidUpdate(prevProps) {
		const { name, loadAsset, asset } = this.props;

		if(name !== prevProps.name)
			loadAsset({ name });

		if(asset !== prevProps.asset)
			this.setState({
				asset: new AssetConverter(asset)
			});
	}

	render() {
		const { children } = this.props;
		const { asset } = this.state;

		return children(asset);
	}
}

WithAsset.propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.func.isRequired,

	asset: Asset,
	loadAsset: PropTypes.func.isRequired
};

const mapStateToProps = (state, { name }) => ({
	asset: get(state, `content.asset.all['${name}']`)
});
 
export default connect(mapStateToProps, { loadAsset })(WithAsset);
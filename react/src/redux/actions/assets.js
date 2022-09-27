import { actionCreator } from 'utils/redux';

export const LOAD_ASSETS = 'assets/LOAD_ASSETS';
export const CREATE_ASSET = 'assets/CREATE_ASSET';

export const loadAssets = actionCreator(LOAD_ASSETS);
export const createAsset = actionCreator(CREATE_ASSET);
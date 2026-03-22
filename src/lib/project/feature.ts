import { type Entry } from './entry';

const sketchType = {
	SKETCH: 'sketch'
} as const;

const modelingType = {
	PAD: 'pad',
	POCKET: 'pocket',
	REVOLVE: 'revolve'
} as const;

const patternType = {
	LINEAR: 'linear',
	RADIAL: 'radial'
} as const;

const dressUpType = {
	FILLET: 'fillet',
	CHAMFER: 'chamfer'
} as const;

export const featureCategory = {
	ANY: 'any',
	SKETCH: 'sketch',
	MODELING: 'modeling',
	PATTERN: 'pattern',
	DRESS_UP: 'dressUp'
} as const;

export type FeatureCategory = (typeof featureCategory)[keyof typeof featureCategory];

export const isSketchType = (
	type: FeatureType
): type is (typeof sketchType)[keyof typeof sketchType] => {
	return type === 'sketch';
};

export const isModelingType = (
	type: FeatureType
): type is (typeof modelingType)[keyof typeof modelingType] => {
	return type === 'pad' || type === 'revolve';
};

export const isPatternType = (
	type: FeatureType
): type is (typeof patternType)[keyof typeof patternType] => {
	return type === 'linear' || type === 'radial';
};

export const isDressUpType = (
	type: FeatureType
): type is (typeof dressUpType)[keyof typeof dressUpType] => {
	return type === 'fillet' || type === 'chamfer';
};

export const featureType = { ...modelingType, ...sketchType, ...patternType, ...dressUpType };
export type FeatureType = (typeof featureType)[keyof typeof featureType];

export interface Feature extends Entry {
	type: FeatureType;
	children: Feature[];
}

export const feature = (type: FeatureType, name: string): Feature => {
	const feature: Feature = { id: crypto.randomUUID(), type, name, children: [] };

	return feature;
};

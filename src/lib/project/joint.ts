import type { Entry } from './entry';

const basicType = {
	FIXED: 'fixed',
	REVOLUTE: 'revolute',
	CYLINDRICAL: 'cylindrical',
	SLIDER: 'slider',
	BALL: 'ball'
} as const;

const faceType = {
	DISTANCE: 'distance',
	PARALLEL: 'parallel',
	PERPENDICULAR: 'perpendicular',
	ANGLE: 'angle'
} as const;

const otherType = {
	RACK_AND_PINION: 'rack-and-pinion',
	SCREW: 'screw',
	GEARS: 'gears',
	BELT: 'belt'
} as const;

export const jointType = { ...basicType, ...faceType, ...otherType };
export type JointType = (typeof jointType)[keyof typeof jointType];

export interface Joint extends Entry {
	type: JointType;
}

export const joint = (type: JointType, name: string): Joint => {
	const joint: Joint = { id: crypto.randomUUID(), type, name };

	return joint;
};

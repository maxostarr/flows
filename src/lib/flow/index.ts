import { ellipse, fill, noStroke, type SimpleVector } from './canvasUtils';

const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(x, min));
const vClamp = ([x, y]: SimpleVector, [min, max]: SimpleVector) => [
	clamp(x, min, max),
	clamp(y, min, max)
];

const vWindowToField = ([x, y]: SimpleVector, fieldSize: number, n: number) => {
	const fv = [Math.floor(x / fieldSize), Math.floor(y / fieldSize)] as SimpleVector;
	return vClamp(fv, [0, n - 1]);
};

const vAdd = ([x, y]: SimpleVector, [x2, y2]: SimpleVector) => [x + x2, y + y2] as SimpleVector;

export const makeParticlesArray = (w: number, h: number, pn: number) => {
	const particles: SimpleVector[] = [];
	for (let i = 0; i < pn; i++) {
		particles.push([Math.random() * w, Math.random() * h]);
	}
	return particles;
};

export const makeLifetimesArray = (pn: number, maxLifetime: number) => {
	const lifetimes: number[] = [];
	for (let i = 0; i < pn; i++) {
		lifetimes.push(Math.round(Math.random() * maxLifetime));
	}
	return lifetimes;
};

export type DrawProps = {
	ctx: CanvasRenderingContext2D;
	w: number;
	h: number;
	pn: number;
	n: number;
	particles: SimpleVector[];
	lifetimes: number[];
	maxLifetime: number;
	field: SimpleVector[][];
};

export const drawFrame = ({
	ctx,
	w,
	h,
	pn,
	particles,
	n,
	field,
	lifetimes,
	maxLifetime
}: DrawProps): void => {
	// background(ctx, 0, 0, 0, 0.05, w, h);

	const fieldSize = w / n;

	noStroke(ctx);
	fill(ctx, 255, 255, 255, 0.05);

	for (let i = 0; i < pn; i++) {
		const p = particles[i];
		const [fx, fy] = vWindowToField(p, fieldSize, n);
		const fv = field[fy][fx];
		particles[i] = vAdd(p, fv);

		ellipse(ctx, particles[i], 1);

		if (lifetimes[i]-- <= 0) {
			particles[i] = [Math.random() * w, Math.random() * h];
			lifetimes[i] = Math.round(Math.random() * maxLifetime);
		}
	}
};

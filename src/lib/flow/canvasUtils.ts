export type SimpleVector = [number, number];

export const poly = (x: number, y: number, sides: number, r: number) => {
	const points = [];
	for (let i = 0; i < sides; i++) {
		const X = x + Math.cos(((Math.PI * 2) / sides) * i) * r;
		const Y = y + Math.sin(((Math.PI * 2) / sides) * i) * r;
		points.push([X, Y]);
	}
	return points;
};
export const fill = (ctx: CanvasRenderingContext2D, r = 0, g = 0, b = 0, a = 255) => {
	ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

export const noFill = (ctx: CanvasRenderingContext2D) => {
	fill(ctx, 0, 0, 0, 0);
};

export const background = (
	ctx: CanvasRenderingContext2D,
	r = 0,
	g = 0,
	b = 0,
	a = 255,
	w = 500,
	h = 500
) => {
	fill(ctx, r, g, b, a);
	ctx.fillRect(0, 0, w, h);
};

export const stroke = (ctx: CanvasRenderingContext2D, r = 0, g = 0, b = 0, a = 255) => {
	ctx.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

export const noStroke = (ctx: CanvasRenderingContext2D) => {
	stroke(ctx, 0, 0, 0, 0);
};

export const strokeWeight = (ctx: CanvasRenderingContext2D, weight: number) => {
	ctx.lineWidth = weight;
};

export const line = (ctx: CanvasRenderingContext2D, v: SimpleVector, v2: SimpleVector) => {
	ctx.beginPath();
	ctx.moveTo(...v);
	ctx.lineTo(...v2);
	ctx.stroke();
	ctx.closePath();
};

export const ellipse = (
	ctx: CanvasRenderingContext2D,
	v: SimpleVector,
	rx: number,
	ry = rx,
	oa = 0,
	sa = 0,
	ea = Math.PI * 2
) => {
	ctx.beginPath();
	ctx.ellipse(...v, rx, ry, oa, sa, ea, false);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
};

export const arc = (
	ctx: CanvasRenderingContext2D,
	v: SimpleVector,
	r: number,
	sa = 0,
	ea = Math.PI * 2
) => {
	ctx.beginPath();
	ctx.arc(...v, r, sa, ea, false);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
};

export const drawPoly = (ctx: CanvasRenderingContext2D, ps: Array<SimpleVector>) => {
	ctx.beginPath();
	ctx.moveTo(...ps[0]);
	for (let i = 1; i < ps.length; i++) {
		ctx.lineTo(...ps[i]);
	}
	ctx.lineTo(...ps[0]);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
};

export const rect = (ctx: CanvasRenderingContext2D, pos: SimpleVector, w: number, h: number) => {
	ctx.beginPath();
	ctx.fillRect(...pos, w, h);
	ctx.rect(...pos, w, h);
	ctx.stroke();
};

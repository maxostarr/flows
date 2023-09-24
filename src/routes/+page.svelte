<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { drawFrame, makeLifetimesArray, makeParticlesArray } from '$lib/flow';
	import type { SimpleVector } from '$lib/flow/canvasUtils';
	import { onMount } from 'svelte';

	let value = `
  function computeFieldValue ([x, y]) {
  const sins = [
    Math.sin(x*0.1 + y*0.1),
    Math.sin(x*0.08 * y*-0.15),
    Math.sin((x & y) * 0.4),
  ];
  const averageSin = sins.reduce((a, b) => a + b, 0) / sins.length;

  return [(((averageSin + 1) / 2) * Math.PI * 2), 1];
}
`;

	var wrap = (s: string) => '{ return ' + s.trim() + ' };'; //return the block having function expression

	let canvas: HTMLCanvasElement | null = null;

	const canvasHeight = 400;
	const canvasWidth = 400;

	let n = 40;
	let maxLifetimeSecs = 10;
	let maxLifetime = maxLifetimeSecs * 60;
	let pn = 400;

	$: particles = makeParticlesArray(canvasWidth, canvasHeight, pn);
	$: lifetimes = makeLifetimesArray(pn, maxLifetime);

	$: computeFieldValue = ([x, y]: SimpleVector) => {
		try {
			return new Function(wrap(value)).call(null).call(null, [x, y]);
		} catch (e) {
			console.error(e);
			return [0, 0];
		}
	};

	// $: console.log(particles);

	$: field = Array.from({ length: n }, (_, y) =>
		Array.from({ length: n }, (__, x) => {
			return computeFieldValue([x, y]);
		})
	);

	$: drawFunc = drawFrame({
		w: canvasWidth,
		h: canvasHeight,
		n,
		pn,
		maxLifetime,
		particles,
		lifetimes,
		field
	});

	// $: if (canvas) {
	// 	const ctx = canvas.getContext('2d');
	// 	if (ctx) {
	// 		function draw() {
	// 			if (!ctx) return;
	// 			drawFunc(ctx);
	// 			window.requestAnimationFrame(draw);
	// 		}

	// 		draw();
	// 	}
	// }

	onMount(() => {
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				function draw() {
					if (!ctx) return;
					drawFunc(ctx);
					window.requestAnimationFrame(draw);
				}

				draw();
			}
		}
	});
</script>

<h1>Flows</h1>

<main>
	<div class="editor">
		<CodeMirror bind:value lang={javascript()} />
	</div>

	<aside class="options">
		<label>
			Number of Subdivisions
			<input type="number" bind:value={n} />
		</label>
		<label>
			Particles
			<input type="number" bind:value={pn} />
		</label>
		<label>
			Max Lifetime
			<input type="number" bind:value={maxLifetimeSecs} />
		</label>
	</aside>
	<canvas id="canvas" width={canvasWidth} height={canvasHeight} bind:this={canvas} />
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
	}

	.editor {
		flex: 1;
	}

	#canvas {
		flex: 1;
		aspect-ratio: 1;
	}

	.options {
		display: flex;
		flex-direction: column;
	}
</style>

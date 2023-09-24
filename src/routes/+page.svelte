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
	$: maxLifetime = maxLifetimeSecs * 60;
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

<main class="flex w-full h-full">
	<div class="h-full card flex flex-col">
		<h1 class="text-3xl font-bold underline">Flows</h1>

		<div class="flex-1">
			<CodeMirror bind:value lang={javascript()} />
		</div>

		<aside class="card flex flex-col gap-5">
			<div class="flex justify-between rounded-md border-solid border-2">
				<label
					for="divisions"
					class="align-middle flex-1 text-center block text-sm font-medium leading-loose text-gray-900"
					>Number of Subdivisions</label
				>
				<div class="relative rounded-md shadow-sm">
					<input
						type="text"
						pattern="[0-9]*"
						name="divisions"
						id="divisions"
						class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						bind:value={n}
					/>
				</div>
			</div>
			<div class="flex justify-between align-middle rounded-md border-solid border-2">
				<label
					for="particles"
					class="align-middle flex-1 text-center block text-sm font-medium leading-loose text-gray-900"
					>Particles</label
				>
				<div class="relative rounded-md shadow-sm">
					<input
						type="text"
						pattern="[0-9]*"
						name="particles"
						id="particles"
						class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						bind:value={pn}
					/>
				</div>
			</div>
			<div class="flex justify-between rounded-md border-solid border-2">
				<label
					for="maxLifetimeSecs"
					class="align-middle flex-1 text-center block text-sm font-medium leading-loose text-gray-900"
					>Max Lifetime</label
				>
				<div class="relative rounded-md shadow-sm">
					<input
						type="text"
						pattern="[0-9]*"
						name="maxLifetimeSecs"
						id="maxLifetimeSecs"
						class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						bind:value={maxLifetimeSecs}
					/>
				</div>
			</div>
		</aside>
	</div>
	<div class="flex flex-col justify-center items-center w-full h-full">
		<canvas
			id="canvas"
			class="h-4/6"
			width={canvasWidth}
			height={canvasHeight}
			bind:this={canvas}
		/>
	</div>
</main>

<style lang="postcss">
	.card {
		background-color: theme('colors.white');
		border-radius: theme('borderRadius.lg');
		padding: theme('spacing.6');
		box-shadow: theme('boxShadow.xl');
	}
</style>

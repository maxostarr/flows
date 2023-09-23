<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { makeLifetimesArray, makeParticlesArray } from '$lib/flow';

	let value = Array.from({ length: 30 }, () => '\n').join('');
	let canvas: HTMLCanvasElement | null = null;

	const canvasHeight = 400;
	const canvasWidth = 400;

	let n = 40;
	let maxLifetimeSecs = 10;
	let maxLifetime = maxLifetimeSecs * 60;
	let pn = 400;

	$: particles = makeParticlesArray(canvasWidth, canvasHeight, pn);
	$: lifetimes = makeLifetimesArray(particles.length, maxLifetime);

	$: if (canvas) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		}
	}
</script>

<h1>Page</h1>

<main>
	<div class="editor">
		<CodeMirror bind:value lang={javascript()} />
	</div>
	<canvas id="canvas" width={canvasWidth} height={canvasHeight} bind:this={canvas} />

	<aside class="options">
		<button on:click={() => console.log(value)}>Run</button>
		<button on:click={() => console.log(value)}>Save</button>
		<button on:click={() => console.log(value)}>Share</button>
		<button on:click={() => console.log(value)}>Fork</button>
		<button on:click={() => console.log(value)}>Export</button>
		<button on:click={() => console.log(value)}>Settings</button>
	</aside>
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

<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';

	let value = Array.from({ length: 30 }, () => '\n').join('');
	let canvas: HTMLCanvasElement | null = null;

	$: if (canvas) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, canvasWidth, convasHeight);
		}
	}

	const convasHeight = 400;
	const canvasWidth = 400;
</script>

<h1>Page</h1>

<main>
	<div class="editor">
		<CodeMirror bind:value lang={javascript()} />
	</div>
	<canvas id="canvas" width={canvasWidth} height={convasHeight} bind:this={canvas} />

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
		height: 12rem;
	}

	.editor .codemirror-wrapper {
		height: 100%;
	}

	.options {
		display: flex;
		flex-direction: column;
	}
</style>

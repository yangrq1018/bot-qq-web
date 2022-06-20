<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import TextField from '@smui/textfield';
	import Button from '@smui/button';
	import { DateInput } from 'date-picker-svelte';

	const skinName = field('skinName', '', [required()]);
	const qqUIN = field('qqUIN', '', [required()]);
	const drawDate = field('drawDate', new Date(), [required()]);
	const myForm = form(skinName, qqUIN, drawDate);

	interface rollEvent {
		skinName: string;
		qqUIN: string;
		drawDate: Date;
	}

	function handleSubmit() {
		myForm.validate().then(() =>  {
			if ($myForm.valid) {
				submitRollEvent(myForm.summary() as rollEvent);
			}
		})
	}

	function submitRollEvent(r: rollEvent) {
		r.drawDate.setSeconds(0, 0);
		console.log(r);
		// call backend
	}
</script>

<main>
	<h1>开始抽奖吧</h1>
	<section>
		<TextField class="text-field" bind:value={$skinName.value} label="饰品名称" />
		{#if $myForm.hasError('skinName.required')}
			<div class="invalid-alert">名称不能为空</div>
		{/if}
		<TextField class="text-field" bind:value={$qqUIN.value} label="QQ号码" />
		{#if $myForm.hasError('qqUIN.required')}
			<div  class="invalid-alert">QQ号码不能为空</div>
		{/if}
		<div class="draw-time-pick">
			<label for="draw-time">开奖日期</label>
			<DateInput bind:value={$drawDate.value} format="yyyy-MM-dd HH:mm" />
		</div>
	</section>
	<Button on:click={handleSubmit} variant="raised" disabled={!$myForm.valid}>提交</Button>
	<Button on:click={myForm.reset} variant="raised">重置</Button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 480px;
		margin: 0 auto;
	}
	/* limit this to component scope only */
	* :global(.text-field),
	.draw-time-pick {
		display: flex;
	}

	.draw-time-pick label {
		display: flex;
		flex: 1;
		/* text-align: center;
		align-content: center; */
	}

	.draw-time-pick {
		margin-top: 8px;
		font-size: 1.1rem;
	}

	section {
		margin-bottom: 10px;
	}

	.invalid-alert {
		color: red;
		font-size: 0.8rem;
		margin-top: 8px;
	}
</style>

<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import TextField from '@smui/textfield';
	import Button from '@smui/button';
	import Select, { Option } from '@smui/select';
	import { DateInput } from 'date-picker-svelte';
	import axios from 'axios';
	import { toast } from '@zerodevx/svelte-toast';
	import type { RollEvent } from '$lib/types';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Autocomplete from '@smui-extra/autocomplete';

	const successOptions = {
		theme: {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		}
	};

	let groups = ['852485822', '1007452144'];
	let senderIdOptions: any[] = [];

	onMount(async () => {
		let res = await axios.get('/api/members/' + groups[0]);
		let members = res.data.members as any[];
		senderIdOptions = members.map((m, i) => {
			return m.Uin;
		});
		console.log(senderIdOptions);
	});

	const skinName = field('skinName', '纪念龙狙', [required()]);
	const senderId = field('senderId', '', [required()]);
	const drawTime = field('drawTime', new Date(), [required()]);
	const groupCode = field('groupCode', groups[0], [required()]);
	const myForm = form(skinName, senderId, drawTime, groupCode);

	function handleSubmit() {
		myForm.validate().then(() => {
			if ($myForm.valid) {
				submitRollEvent(myForm.summary() as RollEvent);
			}
		});
	}

	function submitRollEvent(r: RollEvent) {
		r.drawTime.setSeconds(0, 0);
		// call backend
		axios.post('/api/roll', r).then((res) => {
			toast.push('Successfully submitted: ' + res.data.insertedId, successOptions);
		});
	}
</script>

<main>
	<h1>开始抽奖吧</h1>
	<section>
		<TextField class="field" bind:value={$skinName.value} label="饰品名称" />
		{#if $myForm.hasError('skinName.required')}
			<div class="invalid-alert">名称不能为空</div>
		{/if}

		<div>
			<Autocomplete
				class="field"
				options={senderIdOptions}
				bind:value={$senderId.value}
				label="QQ号码"
			>
			</Autocomplete>
			<!-- <pre class="status">Selected: {$senderId.value ? JSON.stringify($senderId.value) : ''}</pre> -->
		</div>

		<!-- <TextField class="field" bind:value={$senderId.value} label="QQ号码" /> -->
		{#if $myForm.hasError('senderId.required')}
			<div class="invalid-alert">QQ号码不能为空</div>
		{/if}
		<Select label="QQ群" class="field" bind:value={$groupCode.value}>
			{#each groups as group}
				<Option value={group}>{group}</Option>
			{/each}
		</Select>
		<div class="draw-time-pick">
			<label for="draw-time">开奖日期</label>
			<DateInput bind:value={$drawTime.value} format="yyyy-MM-dd HH:mm" />
		</div>
	</section>
	<Button on:click={handleSubmit} variant="raised" disabled={!$myForm.valid}>提交</Button>
	<Button on:click={myForm.reset} variant="raised">重置</Button>
	<SvelteToast />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 480px;
		margin: 0 auto;
	}
	/* limit this to component scope only */
	* :global(.field),
	* :global(.field  > div),
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

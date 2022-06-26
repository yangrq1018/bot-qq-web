<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import Select, { Option } from '@smui/select';
	import { DateInput } from 'date-picker-svelte';
	import axios from 'axios';
	import { toast } from '@zerodevx/svelte-toast';
	import type { RollEvent, GroupMember } from '$lib/types';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Autocomplete from '@smui-extra/autocomplete';
	import { derived, type Readable } from 'svelte/store';
	import type { Field } from 'svelte-forms/types';

	const successOptions = {
		theme: {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		}
	};
	const groups = ['852485822'];
	const skinName = field('skinName', '纪念龙狙', [required()]);
	const senderId = field('senderId', '', [required()]);
	const drawTime = field('drawTime', new Date(), [required()]);
	const groupCode = field('groupCode', groups[0], [required()]);
	const myForm = form(skinName, senderId, drawTime, groupCode);

	function getMembers(x: Field<string>): Promise<GroupMember[]> {
		return axios
			.get('/api/members/' + x.value)
			.then((res) => res.data.members)
			.catch(() => []);
	}

	let senderIdOptions = derived(groupCode, getMembers);

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

	function getOptionLabel(option: GroupMember) {
		return option ? option.Uin + `(${option.Nickname})` : '';
	}
</script>

<svelte:head>
	<title>预约抽奖</title>
	<html lang="en" />
</svelte:head>
<main>
	<h1>开始抽奖吧</h1>
	<section>
		<div class="field">
			<Textfield bind:value={$skinName.value} label="饰品名称" />
			{#if $myForm.hasError('skinName.required')}
				<div class="invalid-alert">名称不能为空</div>
			{/if}
		</div>

		<div class="field">
			<Select label="QQ群" bind:value={$groupCode.value}>
				{#each groups as group}
					<Option value={group}>{group}</Option>
				{/each}
			</Select>
		</div>

		<div class="field">
			<Autocomplete
				{getOptionLabel}
				search={async (input) => {
					const linput = input.toLowerCase();
					if (linput === '') {
						return false;
					}
					let result = (await $senderIdOptions).filter(
						(item) =>
							getOptionLabel(item).toLowerCase().includes(linput) || item.Nickname.includes(linput)
					);
					result = result.slice(0, 5);
					result.sort((a, b) => {
						const aString = a.Nickname.toLowerCase();
						const bString = b.Nickname.toLowerCase();
						if (aString.startsWith(linput) && !bString.startsWith(linput)) {
							return -1;
						} else if (bString.startsWith(linput) && !aString.startsWith(linput)) {
							return 1;
						}
						return 0;
					});
					return result;
				}}
				bind:value={$senderId.value}
				label="QQ号码"
			/>
			{#if $myForm.hasError('senderId.required')}
				<div class="invalid-alert">QQ号码不能为空</div>
			{/if}
		</div>

		<div class=field>
			
		</div>

		<div class="field draw-time-field">
			<label for="draw-time-picker">开奖日期</label>
			<div class="draw-time-picker">
				<DateInput bind:value={$drawTime.value} format="yyyy-MM-dd HH:mm" />
			</div>
		</div>
	</section>
	<Button on:click={handleSubmit} variant="raised" disabled={!$myForm.valid}>提交</Button>
	<Button on:click={myForm.reset} variant="raised">重置</Button>
	<SvelteToast />
</main>

<style>
	main {
		padding: 1em;
		margin: 0 auto;
	}

	.field {
		display: flex;
	}

	section {
		margin-bottom: 10px;
	}

	.draw-time-field {
		margin-top: 20px;
	}

	.invalid-alert {
		color: red;
		font-size: 0.8rem;
		margin-top: 8px;
	}
</style>

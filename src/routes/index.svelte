<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import Textfield from '@smui/textfield';
	import Button, { GroupItem } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import CheckBox from '@smui/checkbox';
	import { DateInput } from 'date-picker-svelte';
	import axios from 'axios';
	import { toast } from '@zerodevx/svelte-toast';
	import type { RollEvent, GroupMember, GroupInfo } from '$lib/types';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Autocomplete from '@smui-extra/autocomplete';
	import { derived, type Readable } from 'svelte/store';
	import type { Field } from 'svelte-forms/types';
	import FormField from '@smui/form-field';
	import { onMount } from 'svelte';
	import CircularProgress from '@smui/circular-progress';

	let groups: GroupInfo[] = [];
	let isAdmin = false;
	const successOptions = {
		theme: {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		}
	};

	const skinName = field('skinName', '', [required()]);
	const senderId = field('senderId', '', [required()]);
	const drawTime = field('drawTime', new Date(), [required()]);
	const groupCode = field('groupCode', '', [required()]);
	let senderIdOptions = derived(groupCode, getMembers);
	const myForm = form(skinName, senderId, drawTime, groupCode);

	onMount(async () => {
		groups = (await axios.get('/api/groups').then((res) => res.data)) as GroupInfo[];
		if (groups.filter((g) => g.Name.includes('总部'))) {
			groupCode.set(groups.filter((g) => g.Name.includes('总部'))[0].Code + '');
		} else if (groups.length > 0) {
			groupCode.set(groups[0].Code + '');
		}
	});

	function getMembers(x: Field<string>): Promise<GroupMember[]> {
		if (!x.value) {
			return Promise.resolve([]);
		}
		return axios.get('/api/members/' + x.value).then((res) => res.data.members);
	}

	function handleSubmit() {
		myForm.validate().then(() => {
			if ($myForm.valid) {
				submitRollEvent(myForm.summary() as RollEvent);
			}
		});
	}

	function submitRollEvent(r: RollEvent) {
		r.drawTime.setSeconds(0, 0);
		axios.post('/api/roll', r).then((res) => {
			toast.push('Successfully submitted: ' + res.data.insertedId, successOptions);
		});
	}

	function getOptionLabel(option: GroupMember) {
		return option ? option.Uin + `(${option.CardName ? option.CardName : option.Nickname})` : '';
	}

	async function searchQQUin(input: string) {
		const linput = input.toLowerCase();
		if (linput === '') {
			return false;
		}

		let result = (await $senderIdOptions).filter(
			(item) =>
				(item.Uin + '').includes(linput) ||
				item.Nickname.toLowerCase().includes(linput) ||
				item.CardName.toLowerCase().includes(linput)
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
			<FormField>
				<Textfield bind:value={$skinName.value} label="饰品名称" />
				{#if $myForm.hasError('skinName.required')}
					<div class="invalid-alert">名称不能为空</div>
				{/if}
			</FormField>
		</div>

		<div class="field">
			<FormField>
				{#if groups.length > 0}
					<Select label="QQ群" bind:value={$groupCode.value}>
						{#each groups as group}
							<Option value={group.Code + ''}>{group.Name}</Option>
						{/each}
					</Select>
				{:else}
					<CircularProgress style="height: 24px; width: 24px;" indeterminate />
				{/if}
			</FormField>
		</div>

		<div class="field">
			<FormField>
				<Autocomplete
					{getOptionLabel}
					search={searchQQUin}
					bind:value={$senderId.value}
					label="QQ号码"
				/>
				{#if $myForm.hasError('senderId.required')}
					<div class="invalid-alert">QQ号码不能为空</div>
				{/if}
			</FormField>
		</div>

		<div class="field">
			<FormField>
				<CheckBox bind:value={isAdmin} />
				<span slot="label">Are you admin?</span>
				<!-- TODO: {#if isAdmin}
				{/if} -->
			</FormField>
		</div>

		<div class="field draw-time-field">
			<FormField>
				<label for="draw-time-picker">开奖日期</label>
				<div class="draw-time-picker">
					<DateInput bind:value={$drawTime.value} format="yyyy-MM-dd HH:mm" />
				</div>
			</FormField>
		</div>
	</section>

	<div class="submit-region">
		<Button on:click={handleSubmit} variant="raised" disabled={!$myForm.valid}>提交</Button>
		<Button on:click={myForm.reset} variant="raised">重置</Button>
	</div>
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

	.invalid-alert {
		color: red;
		font-size: 0.8rem;
		margin-top: 8px;
	}

	.submit-region {
		padding: 10px 20px;
	}
</style>

<script lang="ts">
	import axios from 'axios';
	import type { Cashflow } from '$lib/types';
	import { onMount } from 'svelte';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import moment from 'moment';
	import Select, { Option } from '@smui/select';
	import { derived, writable } from 'svelte/store';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';

	let rows: Cashflow[] = [];
	let loaded = true;
	let strategies = ['CBOND_FUT', 'CBOND_FUT_HF'];
	let accounts = ['xlc2-gtja', 'xlc6-ms', 'xla-yhsn'];
	let strategy = writable(strategies[0]);
	let account = writable('account');
	let option = derived([strategy, account], ($values) => {
		return { strategy: $values[0], account: $values[1] };
	});
	let cashIO = 0;

	onMount(() => {
		axios.get('/api/cash').then((res) => {
			const cashflows = res.data as Cashflow[];
			rows = cashflows;
		});

		option.subscribe((o) => {
			const base = '/api/cash';
			const params = new URLSearchParams();
			if (o.strategy) {
				params.set('strategy', o.strategy);
			}
			if (o.account) {
				params.set('account', o.account);
			}
			const u = base + '?' + params.toString();
			axios.get(u).then((res) => {
				const cashflows = res.data as Cashflow[];
				rows = cashflows;
			});
		});
	});

	function submitCashIO() {
		if ($strategy && $account) {
			const item: Cashflow = {
				strategy: $strategy,
				fundAccount: $account,
				fundFlow: cashIO,
				t: new Date(new Date().toDateString())
			};
			axios.post('/api/cash', item).then((res) => {
				toast.push(`提交成功! affect ${res.data.affected}行, id ${res.data.insertedId}`);
			});
		} else {
			alert('设置出入金账户和策略');
		}
	}
</script>

<div class="container">
	<div class="option">
		<Select bind:value={$strategy} label="策略">
			{#each strategies as strategy}
				<Option value={strategy}>{strategy}</Option>
			{/each}
		</Select>

		<Select bind:value={$account} label="账户">
			<Option value={''}>无</Option>
			{#each accounts as account}
				<Option value={account}>{account}</Option>
			{/each}
		</Select>
		<Textfield type="number" label="出入金额" bind:value={cashIO} />
		<Button on:click={submitCashIO} variant="raised">增加出入金</Button>
	</div>
	<DataTable sortable stickyHeader style="max-width: 100%">
		<Head>
			<Row>
				<Cell>日期</Cell>
				<Cell>策略</Cell>
				<Cell>账户</Cell>
				<Cell>金额</Cell>
			</Row>
		</Head>
		<Body>
			{#each rows as row (row.id)}
				<Row>
					<Cell>{moment(row.t).format('YYYY-MM-DD')}</Cell>
					<Cell>{row.strategy}</Cell>
					<Cell>{row.fundAccount}</Cell>
					<Cell>{row.fundFlow}</Cell>
				</Row>
			{/each}
		</Body>
		<LinearProgress
			indeterminate
			bind:closed={loaded}
			aria-label="Data is being loaded..."
			slot="progress"
		/>
	</DataTable>
	<SvelteToast />
</div>

<style>
	.option {
		display: flex;
		flex-direction: column;
		width: 200px;
		margin: 20px 10px;
	}
</style>

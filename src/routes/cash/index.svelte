<script lang="ts">
	import axios from 'axios';
	import type { Cashflow } from '$lib/types';
	import { onMount } from 'svelte';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';

	let rows: Cashflow[] = [];
	let loaded = true;

	onMount(() => {
		axios.get('/api/cash').then((res) => {
			const cashflows = res.data as Cashflow[];
			rows = cashflows;
		});
	});
</script>

<DataTable sortable style="max-width: 100%;">
	<Head>
		<Row>
			<Cell>ID</Cell>
			<Cell>日期</Cell>
			<Cell>策略</Cell>
			<Cell>账户</Cell>
			<Cell>金额</Cell>
		</Row>
	</Head>
	<Body>
		{#each rows as row (row.id)}
			<Row>
				<Cell>{row.id}</Cell>
				<Cell>{row.t}</Cell>
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

<style>
</style>

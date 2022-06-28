<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Label, SortValue } from '@smui/data-table';
	import type { Price } from '$lib/types';
	import IconButton from '@smui/icon-button';

	export let rows: Price[] = [];

	let sort: keyof Price = 'bondCode';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	function handleSort() {
		console.log("sort by " + sort)
		rows.sort((a, b) => {
			const [aVal, bVal] = [a[sort], b[sort]][
				sortDirection === 'ascending' ? 'slice' : 'reverse'
			]();
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}
			return Number(aVal) - Number(bVal);
		});
		rows = rows;
	}
</script>

<DataTable
	sortable
	bind:sort
	bind:sortDirection
	on:SMUIDataTable:sorted={handleSort}
	style="max-width: 100%;"
>
	<Head>
		<Row>
			<Cell sortable columnId="bondCode">
				<Label>代码</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
			<Cell>名称</Cell>
			<Cell sortable columnId="theoryValue">
				<IconButton class="material-icons">arrow_upward</IconButton>
				<Label>理论价格</Label>
			</Cell>
			<Cell numeric>交易价格</Cell>
			<Cell numeirc sortable columnId="delta">
				<IconButton class="material-icons">arrow_upward</IconButton>
				<Label>Delta</Label>
			</Cell>
		</Row>
	</Head>
	<Body>
		{#each rows as row (row.bondCode)}
			<Row>
				<Cell>{row.bondCode}</Cell>
				<Cell>{row.symbol}</Cell>
				<Cell numeric>{row.theoryValue.toFixed(2)}</Cell>
				<Cell numeric>{row.tradeValue.toFixed(2)}</Cell>
				<Cell numeric>{(row.delta * 100).toFixed(4)}</Cell>
			</Row>
		{/each}
	</Body>
</DataTable>

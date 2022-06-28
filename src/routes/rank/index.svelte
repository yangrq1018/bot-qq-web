<script lang="ts">
	import type { Price } from '$lib/types';
	import { onMount } from 'svelte';
	import Table from '../../components/table.svelte';

	const websocketURL = 'wss://nowtest.xuanlingasset.com/ws';
	let socket: WebSocket;
	let bonds: Price[] = [];
	let temp: Price[] = []; // a temporary buffer to hold initial syncing bonds
	let syncing = true;

	function handleSocketMessage(e: MessageEvent<any>) {
		const data = JSON.parse(e.data)
		const payload = data.payload;
		const signal = data.signal;
		if (signal === "sync_done") {
			bonds = temp
			syncing = false
			return
		}
		payload['valueOn'] = new Date(payload['valueOn']);
		const bean = payload as Price;
		let matched = false;
		bonds.forEach((b, i) => {
			if (b.bondCode == bean.bondCode) {
				bonds[i] = bean;
				matched = true;
				return;
			}
		});

		if (!matched) {
			// don't use bonds.push, won't trigger child component prop update
			// svelte reactivity is triggered by assignment
			temp = [...temp, bean];
		}
	}

	// obtain a websock
	onMount(() => {
		socket = new WebSocket(websocketURL);
		socket.onmessage = handleSocketMessage;
		socket.onopen = () => {
			console.log('connected');
		};
		socket.onclose = () => {
			console.log('disconnected');
		};
	});
</script>

<Table rows={bonds} loaded={!syncing} />

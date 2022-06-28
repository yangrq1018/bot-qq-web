<script lang="ts">
	import type { Price } from '$lib/types';
	import { onMount } from 'svelte';
	import Table from '../../components/table.svelte';

	const websocketURL = 'wss://nowtest.xuanlingasset.com/ws';
	let socket: WebSocket;

	let bonds: Price[] = [];

	function handleSocketMessage(e: MessageEvent<any>) {
		const payload = JSON.parse(e.data).payload;
        payload["valueOn"] = new Date(payload["valueOn"]);
        const bean = payload as Price;
        let matched = false;
        bonds.forEach((b, i) => {
            if (b.bondCode == bean.bondCode) {
                bonds[i] = bean;
                matched = true
                return
            }
        })

        if (!matched) {
            bonds.push(bean);
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

<Table rows={bonds} />

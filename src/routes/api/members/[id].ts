import type { RequestEvent } from '@sveltejs/kit';
import axios from 'axios';

export async function get(event: RequestEvent) {
    console.log(event.params.id);
    const res = await axios.get("http://127.0.0.1:8083/members/" + event.params.id)
    return {
        status: 200,
        body: res.data
    }
}
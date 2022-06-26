import type { RequestEvent } from '@sveltejs/kit';
import axios from 'axios';
import 'dotenv/config'

export async function get(event: RequestEvent) {
    const res = await axios.get(process.env.BOT_BACKEND + "/members/" + event.params.id);
    return {
        status: 200,
        body: res.data
    }
}
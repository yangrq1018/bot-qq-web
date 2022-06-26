import axios from 'axios';
import 'dotenv/config'
import type { GroupInfo } from '$lib/types';

export async function get() {
    const res = await axios.get(process.env.BOT_BACKEND + "/groups");
    return {
        status: 200,
        body: res.data as GroupInfo[]
    }
}
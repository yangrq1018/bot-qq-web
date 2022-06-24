import type { RequestEvent } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://martin:ByyYSSEieTnSuD6k@cluster0.wvjww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "qq";
const collectionName = "csgo";


export async function post(event: RequestEvent) {
    const body = await event.request.json();
    let insertedId: string;
    try {
        await client.connect();
        const col = client.db(dbName).collection(collectionName);
        const result = await col.insertOne({
            sender_id: body.senderId.Uin,
            sender_nickname: body.senderId.Nickname,
            skin_name: body.skinName,
            draw_time: new Date(body.drawTime),
            group_code: body.senderId.Group.Code,
            group_name: body.senderId.Group.Name,
            source: "web",
            participants: [],
        })
        insertedId = result.insertedId.toString();

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return {
        status: 201,
        body: {
            insertedId
        }
    };
}

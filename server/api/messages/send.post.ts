import {createDirectus, rest, withToken, readItems, updateFiles, updateFile, createItem} from "@directus/sdk";
import {io} from "~/server/plugins/socket.io";




export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)

    // event.req.socket.emit("hello", "world");

    // return await client.request(
    //     withToken(directusToken,
    //         createItem('dialog_of_messages', {
    //             user_created: '9a7a9a94-fc1a-40ff-837e-3ac4aa76796f',
    //             rental_id: 5,
    //         })
    //     )
    // )
    await client.request(
        withToken(directusToken,
            createItem('messages', {
                user_created: data.user_id,
                dialog_of_messages_id: 3,
                content: data.message
            })
        )
    )
   io.emit('updateChat')


    return data

})
import {createDirectus, createItem, readItem, readItems, rest, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    const user_id = await getUserIDbyToken(data.token);

});
import {createDirectus, rest, readUsers, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const email = (getQuery(event).email || '').toString()
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());

    if (email){
        const result = await client.request(
            withToken(directusToken, readUsers({
                search: email
            }))
        );
        return !!result.length
    } else return false

})
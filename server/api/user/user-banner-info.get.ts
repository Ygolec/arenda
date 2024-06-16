import {createDirectus, rest, withToken, readUser} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const userID = (getQuery(event).user_id || '').toString()
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());

    if (userID) {
        const result = await client.request(
            withToken(directusToken, readUser(userID, {
                    fields: ['*'],
                })
            )
        );
        return result
    } else return false

})
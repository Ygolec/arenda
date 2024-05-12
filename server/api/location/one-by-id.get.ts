import {createDirectus, rest, withToken, readItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const location_id = getQuery(event).location_id
    if (location_id) {
        return await client.request(withToken(directusToken,
                readItem('location', location_id.toString(), {
                    // fields: ['price', 'location_id']
                })
            )
        )
    }

})
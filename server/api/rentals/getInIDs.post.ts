import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rentals_id = await readBody(event)
    return await client.request(
        withToken(directusToken,
            readItems('rentals', {
                filter: {
                    'id': {
                        "_in": rentals_id
                    }
                },
                fields:['id']
            })
        )
    );

})
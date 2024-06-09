import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const location_ids = await readBody(event)
    if (location_ids) {
        return await client.request(
            withToken(directusToken,
                readItems('location', {
                    filter: {
                        id: {
                            "_in": location_ids
                        },
                    }
                })
            )
        )
    }

})
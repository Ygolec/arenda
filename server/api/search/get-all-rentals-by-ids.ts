import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_ids = await readBody(event)

    if (rental_ids) {
        return await client.request(
            withToken(directusToken,
                readItems('rentals', {
                    fields: ['id', 'price', 'location_id', 'content_id'],
                    filter: {
                        id: {
                            "_in": rental_ids
                        },
                    }
                })
            )
        )
    }

})
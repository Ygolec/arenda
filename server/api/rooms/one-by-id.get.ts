import {createDirectus, rest, withToken, readItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_id = getQuery(event).rental_id
    if (rental_id) {
        return await client.request(withToken(directusToken,
                readItem('rentals', rental_id, {
                    // fields: ['price', 'location_id', 'content_id']
                })
            )
        )
    }

})
import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_id = getQuery(event).rental_id
    if (rental_id) {
        return await client.request(withToken(directusToken,
                readItems('rental_comments', {
                        filter: {
                            rental_id: {
                                "_eq": rental_id.toString()
                            }
                        }
                    }
                )
            )
        )
    }

})
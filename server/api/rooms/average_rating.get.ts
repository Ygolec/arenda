import {aggregate, createDirectus, readItems, rest, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const rental_id = (getQuery(event).rental_id || '')
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());

    if (rental_id) {
        const result = await client.request(
            withToken(directusToken, readItems('rental_comments', {
                filter: {
                    rental_id: {
                        _eq: rental_id
                    }
                },
                aggregate: {
                    avg: ['cleanliness', 'communication', 'location', 'arrival', 'accuracy'],
                },

            }))
        );
        if (result[0].avg){
            return Object.values(result[0].avg as Record<string, string>).reduce((sum, current) => sum + parseFloat(current), 0) / 5
        }
        else return false
    } else return false

})
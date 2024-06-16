import {createDirectus, rest, withToken, readUser, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const rental_id = (getQuery(event).rental_id || '').toString()
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());

    if (rental_id) {
        const result = await client.request(
            withToken(directusToken, readItems('bookings_of_rental', {
                fields:['user_created'],
                    filter: {
                        rental_id: {
                            _eq: rental_id
                        },
                        status: {
                            _in: ['created','accepted']
                        }
                    }
                })
            )
        );
        return result
    } else return false

})
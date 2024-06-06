import {createDirectus, createItem, readItem, readItems, rest, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_id = await getQuery(event).rental_id

    const booking_of_rental = await client.request(
        withToken(directusToken,
            readItems('bookings_of_rental', {
                fields: ['date_start', 'date_finish'],
                filter: {
                    rental_id: {
                        _eq: rental_id
                    },
                    status: {
                        _eq: 'accepted'
                    }
                }
            })
        )
    );


    return booking_of_rental.map((date) => {
        return {start: date.date_start, end: date.date_finish}
    })
});
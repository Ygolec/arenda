import {createDirectus, createItem, readFolders, readItem, readItems, rest, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    const user_id = await getUserIDbyToken(data.token);

    const upcomingBookings = await client.request(
        withToken(directusToken,
            readItems('bookings_of_rental', {
                filter: {
                    rental_id: {
                        user_created: {
                            _eq: user_id
                        }
                    },
                    status:{
                        _eq: 'created'
                    }
                }
            })
        )
    );

    const formattedBookings = upcomingBookings.map((booking: any) => {
        return {
            id: booking.id,
            status: booking.status,
            guests: booking.user_created,
            checkIn: booking.date_start,
            checkOut: booking.date_finish,
            bookingDate: booking.date_created,
            rental: booking.rental_id,
            totalPrice: 0
        }
    });
    return formattedBookings
});
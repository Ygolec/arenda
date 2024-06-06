import {createDirectus, readItem, rest, updateItem, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    const user_id = await getUserIDbyToken(data.token);
    const booking_id = data.booking_id;

    const isBookingOfUser = await client.request(
        withToken(directusToken,
            readItem('bookings_of_rental', booking_id, {
                filter: {
                    rental_id: {
                        user_created: {
                            _eq: user_id
                        }
                    },
                    status: {
                        _eq: 'accepted'
                    }
                }
            })
        )
    );

    if (isBookingOfUser) {
        const updatedBooking = await client.request(
            withToken(directusToken,
                updateItem('bookings_of_rental', booking_id, {
                    status: 'canceled',
                    cancellation_reason: data.reason
                })
            )
        );
        return updatedBooking
    } else {
        throw createError({
            status: 400,
            statusMessage: 'Бронирование не найдено или не пренадлежит вам'
        });
    }

});
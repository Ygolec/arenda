import {createDirectus, createItem, readItem, readItems, rest, withToken} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    const date_start = data.start.split('-')[2] + '-' + data.start.split('-')[1] + '-' + data.start.split('-')[0];
    const date_finish = data.end.split('-')[2] + '-' + data.end.split('-')[1] + '-' + data.end.split('-')[0];
    const user_id = await getUserIDbyToken(data.token);

    const rental = await client.request(
        withToken(directusToken,
            readItem('rentals', data.rental_id)
        )
    );
    if (rental.user_created == user_id) {
        throw createError({
            status: 400,
            statusMessage: 'Нельзя арендовать своё же объявление'
        });
    } else {
        const booking_of_rental = await client.request(
            withToken(directusToken,
                readItems('bookings_of_rental', {
                    filter: {
                        rental_id: {
                            _eq: data.rental_id
                        },
                        user_created: {
                            _eq: user_id
                        }
                    }
                })
            )
        );

        if (booking_of_rental.length > 0) {
            throw createError({
                status: 400,
                statusMessage: 'Вы уже арендуете это объявление'
            });
        }


        const booking_of_rental_by_date_range = await client.request(
                withToken(directusToken,
                    readItems('bookings_of_rental', {
                        filter: {
                            rental_id: {
                                _eq: data.rental_id
                            },
                            date_finish: {
                                _gte: date_start
                            },
                            date_start: {
                                _lte: date_finish
                            }
                        }
                    })
                )
            )
        ;

        if (booking_of_rental_by_date_range.length > 0) {
            throw createError({
                status: 400,
                statusMessage: 'Объявление занято в это время'
            });
        }

        await client.request(
            withToken(directusToken,
                createItem('bookings_of_rental', {
                    rental_id: data.rental_id,
                    user_created: user_id,
                    date_start: date_start,
                    date_finish: date_finish,
                    number_of_children: data.children,
                    number_of_adults: data.adults,
                    number_of_pets: data.pets,
                })
            )
        )
    }

    return rental
});
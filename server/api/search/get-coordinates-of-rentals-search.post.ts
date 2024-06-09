import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    const date_start = data.checkin.split('-')[2] + '-' + data.checkin.split('-')[1] + '-' + data.checkin.split('-')[0];
    const date_finish = data.checkout.split('-')[2] + '-' + data.checkout.split('-')[1] + '-' + data.checkout.split('-')[0];

    let rentals_coordinate = await client.request(
        withToken(directusToken,
            readItems('rentals_coordinate', {
                filter: {
                    'latitude': {
                        "_between": [data.bounds[1][1], data.bounds[0][1]]
                    },
                    'longitude': {
                        "_between": [data.bounds[0][0], data.bounds[1][0]]
                    },
                }
            })
        )
    );


    if (data.amenities) {
        const rentals_conveniences_of_rentals = await client.request(
            withToken(directusToken,
                readItems('rentals_conveniences_of_rentals', {
                    fields: ['rentals_id', 'conveniences_of_rentals_id'],
                    filter: {
                        rentals_id: {
                            "_in": rentals_coordinate.map((item: any) => item.rental_id)
                        },
                        conveniences_of_rentals_id: {
                            "_in": data.amenities
                        }
                    },

                })
            )
        );

        const groupedByRentalsId = rentals_conveniences_of_rentals.reduce((acc, item) => {
            if (!acc[item.rentals_id]) {
                acc[item.rentals_id] = [];
            }
            acc[item.rentals_id].push(item.conveniences_of_rentals_id);
            return acc;
        }, {});

        const result = Object.keys(groupedByRentalsId).map(key => ({
            rentals_id: parseInt(key),
            conveniences_of_rentals_id: groupedByRentalsId[key]
        }));

        const rentals_with_selected_amenities = result.filter((rental: any) =>
            data.amenities.every((amenity: any) => rental.conveniences_of_rentals_id.includes(amenity))
        );

        rentals_coordinate = await client.request(
            withToken(directusToken,
                readItems('rentals_coordinate', {
                    filter: {
                        rental_id: {
                            "_in": rentals_with_selected_amenities.map((item: any) => item.rentals_id)
                        },
                        'latitude': {
                            "_between": [data.bounds[1][1], data.bounds[0][1]]
                        },
                        'longitude': {
                            "_between": [data.bounds[0][0], data.bounds[1][0]]
                        },
                    }
                })
            )
        );

    }

    if (rentals_coordinate.length != 0) {
        const bookings_of_rental = await client.request(
            withToken(directusToken,
                readItems('bookings_of_rental', {
                    fields: ['id', 'rental_id'],
                    filter: {
                        rental_id: {
                            "_in": rentals_coordinate.map((item: any) => item.rental_id)
                        },
                        date_finish: {
                            _gte: date_start
                        },
                        date_start: {
                            _lte: date_finish
                        },
                        status: {
                            "_eq": 'accepted'
                        }
                    }
                })
            )
        );

        let content_of_rental;
        if (bookings_of_rental.length == 0) {
            content_of_rental = await client.request(
                withToken(directusToken,
                    readItems('content_of_rental', {
                        fields: ['id', 'rental_id'],
                        filter: {
                            rental_id: {
                                "_in": rentals_coordinate.map((item: any) => item.rental_id)
                            },
                            number_of_beds: {
                                "_gte": data.min_beds
                            },
                            number_of_bathrooms: {
                                "_gte": data.min_bathrooms
                            },
                            number_of_bedrooms: {
                                "_gte": data.min_bedrooms
                            }

                        }
                    })
                )
            );
        } else {
            content_of_rental = await client.request(
                withToken(directusToken,
                    readItems('content_of_rental', {
                        fields: ['id', 'rental_id'],
                        filter: {
                            rental_id: {
                                "_nin": bookings_of_rental.map((item: any) => item.rental_id)
                            },
                            number_of_beds: {
                                "_gte": data.min_beds
                            },
                            number_of_bathrooms: {
                                "_gte": data.min_bathrooms
                            },
                            number_of_bedrooms: {
                                "_gte": data.min_bedrooms
                            }
                        }
                    })
                )
            );
        }
        if (content_of_rental.length != 0) {
            return await client.request(
                withToken(directusToken,
                    readItems('rentals_coordinate', {
                        filter: {
                            rental_id: {
                                "_in": content_of_rental.map((item: any) => item.rental_id)
                            }
                        }
                    })
                )
            );
        } else {
            return []
        }
    }
    return []


})
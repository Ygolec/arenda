import {createDirectus, rest, withToken, readItems, readUsers, createItem, updateItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const data = await readBody(event)
    if (data) {
        if (data.user_id) {
            const existUser = await client.request(
                withToken(directusToken, readUsers({
                    search: data.user_id
                }))
            );
            if (existUser) {
                const rentalsOfUser = await client.request(
                    withToken(directusToken, readItems('rentals', {
                        filter: {
                            user_created: {
                                "_eq": data.user_id
                            }
                        }
                    }))
                );
                if (!rentalsOfUser.length) {
                    throw createError({
                        status: 400,
                        statusMessage: 'У данного пользователя нет ни одного объекта аренды'
                    })
                } else {
                    if (rentalsOfUser.find(rental => rental.id == data.rental_id)) {
                        const coordinateByRental = await client.request(
                            withToken(directusToken, readItems('rentals_coordinate', {
                                filter: {
                                    rental_id: {
                                        "_eq": data.rental_id
                                    }
                                }
                            }))
                        );

                        if (coordinateByRental.length) {
                            throw createError({
                                status: 400,
                                statusMessage: 'У данного объекта аренды уже есть координаты'
                            })
                        } else {
                            const coordinate = await client.request(
                                withToken(directusToken, createItem('rentals_coordinate', {
                                    longitude: data.coordinates[0],
                                    latitude: data.coordinates[1],
                                    rental_id: data.rental_id
                                }))
                            )
                            if (coordinate) {
                                const rental = await client.request(
                                    withToken(directusToken, updateItem('rentals', data.rental_id, {
                                        coordinates_id: coordinate.id,
                                    }))
                                )
                                if (rental) {
                                    return coordinate
                                } else throw createError({
                                    status: 400,
                                    statusMessage: 'Ошибка при обновлении объекта аренды'
                                })
                            } else throw createError({
                                status: 400,
                                statusMessage: 'Ошибка при создании координат'
                            })
                        }
                    } else throw createError({
                        status: 400,
                        statusMessage: 'Данный объект аренды не принадлежит данному пользователю'
                    })
                }
            }
        }
    }
})
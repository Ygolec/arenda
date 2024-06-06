import {createDirectus, rest, withToken, readItems, readUsers, readMe} from "@directus/sdk";

const client = createDirectus('http://localhost:8055').with(rest());

export async function getUserIDbyToken(token: string) {
    if (token) {
        const user = await client.request(
            withToken(token,
                readMe({
                    fields: ['*'],
                }))
        )
        if (user) {
            return user.id
        } else {
            throw createError({
                status: 400,
                statusMessage: 'Пользователь не найден'
            })
        }
    } else {
        throw createError({
            status: 400,
            statusMessage: 'Токен не найден'
        })
    }
}
import {
    createDirectus,
    rest,
    registerUser,
    withToken,
    readUsers,
    updateUser,
} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const user = await readBody(event)

    const existUser: boolean = await $fetch('/api/user/exist', {params: {email: user.email}})

    if (existUser) return createError({message: 'User already exist', status: 400})

    const result = await client.request(registerUser(user.email, user.password, {
            first_name: user.first_name,
            last_name: user.last_name,
        }
    ));
    const createdUser = await client.request(
        withToken(directusToken, readUsers({
            search: user.email
        }))
    );

    if (!createdUser) {
        return createError({message: 'User not created', status: 400})
    } else {
        await client.request(
            withToken(directusToken, updateUser(createdUser[0].id, {
                date_of_birthday: new Date(user.date_of_birthday.split('.').reverse().join('-')).toISOString().split('T')[0],
            }))
        );
    }


    return {status: 'ok', message: 'User created successfully'}

})
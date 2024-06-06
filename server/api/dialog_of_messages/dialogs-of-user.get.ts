import {
    createDirectus,
    rest,
    withToken,
    readItems,
    updateFiles,
    updateFile,
    createItem,
    readUsers
} from "@directus/sdk";
import {io} from "~/server/plugins/socket.io";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const token = getQuery(event).token

    const user_id = await getUserIDbyToken(token);

    if (user_id) {
        const dialogs_of_messages = await client.request(
            withToken(directusToken,
                readItems('dialog_of_messages', {
                    sort: ['-date_created'],
                    filter: {
                        user_created: {
                            _eq: user_id.toString()
                        }
                    }
                })
            )
        );

        if (dialogs_of_messages.length == 0) {
            const rental_owner_dialogs_of_messages = await client.request(
                withToken(directusToken,
                    readItems('dialog_of_messages', {
                        sort: ['-date_created'],
                        filter: {
                            rental_id: {
                                user_created: {
                                    _eq: user_id.toString()
                                }
                            }
                        }
                    })
                )
            );

            const names_of_users = await client.request(
                withToken(directusToken,
                    readUsers({
                        fields: ['first_name', 'id', 'avatar'],
                        filter: {
                            id: {
                                _in: rental_owner_dialogs_of_messages.map(user => user.user_created)
                            }
                        }
                    })
                )
            );

            rental_owner_dialogs_of_messages.forEach(dialog => {
                dialog.user_name = names_of_users.find(user => user.id == dialog.user_created).first_name
                dialog.user_avatar = names_of_users.find(user => user.id == dialog.user_created).avatar
            })

            return rental_owner_dialogs_of_messages
        }

        const users_of_rentals = await client.request(
            withToken(directusToken,
                readItems('rentals', {
                    fields: ['user_created', 'id', 'content_id'],
                    filter: {
                        id: {
                            _in: dialogs_of_messages.map(dialog => dialog.rental_id)
                        }
                    }
                })
            )
        );

        const names_of_users = await client.request(
            withToken(directusToken,
                readUsers({
                    fields: ['first_name', 'id', 'avatar'],
                    filter: {
                        id: {
                            _in: users_of_rentals.map(user => user.user_created)
                        }
                    }
                })
            )
        );

        dialogs_of_messages.forEach(dialog => {
            dialog.user_name = names_of_users.find(user => user.id == users_of_rentals.find(user => user.id == dialog.rental_id).user_created).first_name
            dialog.user_avatar = names_of_users.find(user => user.id == users_of_rentals.find(user => user.id == dialog.rental_id).user_created).avatar
        })
        return dialogs_of_messages
    }


})
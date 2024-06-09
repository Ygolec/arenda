import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const content_id = await readBody(event)

    if (content_id) {
        return await client.request(
            withToken(directusToken,
                readItems('content_of_rental_files', {
                    filter: {
                        content_of_rental_id: {
                            "_in": content_id
                        },
                    }
                })
            )
        )
    }

})
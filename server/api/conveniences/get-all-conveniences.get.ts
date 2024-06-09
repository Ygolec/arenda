import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());

        return await client.request(withToken(directusToken,
                readItems('conveniences_of_rentals', {
                    fields: ['*'],
                    }
                )
            )
        )


})
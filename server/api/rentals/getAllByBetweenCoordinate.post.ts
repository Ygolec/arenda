import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const bounds = await readBody(event)

    return await client.request(
        withToken(directusToken,
            readItems('rentals_coordinate', {
                filter: {
                    'latitude': {
                        "_between": [bounds[1][1], bounds[0][1]]
                    },
                    'longitude': {
                        "_between": [bounds[0][0], bounds[1][0]]
                    }
                }
            })
        )
    );

})
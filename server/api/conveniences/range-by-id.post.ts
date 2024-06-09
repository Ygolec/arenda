import {createDirectus, rest, withToken, readItems} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const conveniences_ids = await readBody(event)
    if (conveniences_ids) {
        const conveniences_of_rentals = await client.request(withToken(directusToken,
                readItems('rentals_conveniences_of_rentals', {
                        filter: {
                            id: {
                                "_in": conveniences_ids
                            }
                        }
                    }
                )
            )
        )
        
        return await client.request(withToken(directusToken,
                readItems('conveniences_of_rentals', {
                        filter: {
                            id: {
                                "_in": conveniences_of_rentals.map((item: any) => item.conveniences_of_rentals_id)
                            }
                        }
                    }
                )
            )
        )
    }

})
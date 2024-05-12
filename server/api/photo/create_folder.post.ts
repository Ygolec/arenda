import {createDirectus, rest, readUsers, withToken, createFolder, readFolders} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_id = 4

    const checkExist = await client.request(
        withToken(directusToken,
            readFolders({
                filter: {
                    parent: {
                        _eq: 'b3d32301-192d-41e2-aedc-0d3fc6bc9466'
                    },
                    name: {
                        _eq: rental_id.toString()
                    }
                }
            })
        )
    );
    if (!checkExist.length) {
        const result = await client.request(
            withToken(directusToken,
                createFolder({
                    parent:'b3d32301-192d-41e2-aedc-0d3fc6bc9466',
                    name: rental_id.toString()
                })
            )
        );
    } else return false

})
import {createDirectus, rest, withToken, readItems, updateFiles, updateFile} from "@directus/sdk";

export default defineEventHandler(async (event) => {

    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const content_id = (getQuery(event).content_id || null)
    const photo_id = (getQuery(event).photo_id || null)

    if (content_id && photo_id) {

        const photos = await client.request(
            withToken(directusToken,
                readItems('content_of_rental_files', {
                    fields: ['directus_files_id'],
                    filter: {
                        content_of_rental_id: {
                            _eq: content_id
                        }
                    }
                })
            )
        )
        await client.request(
            withToken(directusToken,
                updateFiles(photos.map(photo =>photo.directus_files_id ), {
                    tags: [''],
                })
            )
        )
        return await client.request(
            withToken(directusToken,updateFile(photo_id, {
                tags: ['main'],
            })
        ));
    }

})
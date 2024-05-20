import {
    createDirectus,
    rest,
    readUsers,
    withToken,
    createFolder,
    readFolders,
    uploadFiles,
    readItems, createItem, updateFile
} from "@directus/sdk";
import {readFiles} from "h3-formidable";
import {readFileSync} from "node:fs";

export default defineEventHandler(async (event) => {
    const directusToken: string = process.env.DIRECTUS_TOKEN || ''
    const client = createDirectus('http://localhost:8055').with(rest());
    const rental_id = (getQuery(event).rental_id || null)
    if (rental_id) {
        const checkExistFolder = await client.request(
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
        if (!checkExistFolder.length) {
            await client.request(
                withToken(directusToken,
                    createFolder({
                        parent: 'b3d32301-192d-41e2-aedc-0d3fc6bc9466',
                        name: rental_id.toString()
                    })
                )
            );
        }
        const formData = new FormData();
        const files = await readMultipartFormData(event)
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('folder', checkExistFolder[0].id);
                formData.append('file', new Blob([files[i].data], {type: files[i].type}), files[i].filename);
            }
        }

        if (formData) {
            const uploadPhotos = await client.request(
                withToken(directusToken,
                    uploadFiles(formData)
                )
            );
            if (uploadPhotos) {
                const idOfRentalContent = await client.request(
                    withToken(directusToken,
                        readItems('content_of_rental', {
                            fields: ['id'],
                            filter: {
                                rental_id: {
                                    _eq: rental_id.toString()
                                }
                            }
                        })
                    )
                )

                if (idOfRentalContent[0].id) {
                    const photos = await client.request(
                        withToken(directusToken,
                            readItems('content_of_rental_files', {
                                filter: {
                                    content_of_rental_id: {
                                        _eq: idOfRentalContent[0].id
                                    }
                                }
                            })
                        )
                    )


                    if (uploadPhotos.length) {
                        for (let i = 0; i < uploadPhotos.length; i++) {
                            await client.request(
                                withToken(directusToken,
                                    createItem('content_of_rental_files', {
                                        content_of_rental_id: idOfRentalContent[0].id,
                                        directus_files_id: uploadPhotos[i].id
                                    })
                                )
                            )
                        }
                    } else {
                        await client.request(
                            withToken(directusToken,
                                createItem('content_of_rental_files', {
                                    content_of_rental_id: idOfRentalContent[0].id,
                                    directus_files_id: uploadPhotos.id
                                })
                            )
                        )
                    }
                    if (!photos.length) {
                        const temp = await client.request(
                            withToken(directusToken,
                                readItems('content_of_rental_files', {
                                    fields: ['directus_files_id'],
                                    filter: {
                                        content_of_rental_id: {
                                            _eq: idOfRentalContent[0].id
                                        }
                                    }
                                })
                            )
                        )
                        await client.request(
                            withToken(directusToken,
                                updateFile(temp[0].directus_files_id, {
                                    tags: ['main']
                                })
                            )
                        )
                    }
                    return uploadPhotos
                }

            }
        }
    } else throw createError({
        status: 400,
        statusMessage: 'Rental id is required'
    })


})
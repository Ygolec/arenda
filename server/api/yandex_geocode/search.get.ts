export default defineEventHandler(async (event) => {
    const coordinates = (getQuery(event).coordinates || '').toString()
    const apiSearch = 'https://geocode-maps.yandex.ru/1.x/' +
        `?apikey=${process.env.API_YANDEX_GEOCODER}` +
        '&format=json' +
        `&geocode=${coordinates}` +
        '&lang=ru_RU' +
        '&results=1'
    const result = await $fetch(apiSearch)
    const formattedResult = result.response.GeoObjectCollection.featureMember.map((item: any) => {
        return {
            name: item.GeoObject?.name,
            description: item.GeoObject?.description,
            point: item.GeoObject?.Point?.pos?.split(' ')?.map((item: string) => parseFloat(item)),
            full_address: item.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AdministrativeArea?.Locality?.Thoroughfare?.ThoroughfareName,
            city: item.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AdministrativeArea?.Locality?.LocalityName,
            country: item.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.CountryName,
            index: item.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AdministrativeArea?.Locality?.Thoroughfare?.Premise?.PostalCode?.PostalCodeNumber,
        }
    })
    // return result
    return formattedResult[0]
})
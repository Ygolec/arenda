export default defineNuxtRouteMiddleware(async (to, _from) => {
    // const user = useDirectusUser();
    const {refreshTokens} = useDirectusToken();
    await refreshTokens();
    // const newToken = refreshTokens();
    // console.log('newToken', newToken)
    // if (user.value) {
    //     await refreshTokens();
    //
    // }

});

import {Router} from 'express'

const router = Router()

router.get('/api/products', (request, response) => {
    console.log(request.headers.cookie);
    console.log(request.cookies);
    if(request.signedCookies.hello && request.signedCookies.hello === 'world')
     return response.send([{id : 123, name : 'chicken brest' , price : 12.99}])
    return response.send({msg : 'Sorry. You Need the correct cookie'});
})


export default router

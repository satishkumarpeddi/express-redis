import express from 'express'
import redisClient from '../config/redis.js'
import cacheMiddleware from '../middleware/cache.middleware.js'


const router = express.Router();


let products = [
    { id: 1, name: "Laptop", price: 55000 },
    { id: 2, name: "Keyboard", price: 1500 },
    { id: 3, name: "Mouse", price: 800 }
];

const CACHE_KEY = 'cache:/api/products'

router.get('/products',cacheMiddleware,async(req,res)=>{
    console.log("Fetching products from database...");

    await new Promise(resolve => setTimeout(resolve,2000))

    res.json({
        success:true,
        count:products.length,
        products
    })
})

router.post('/products',async(req,res)=>{
    try{
        const {name,price} = req.body;

        if(!name || typeof price!=="number" || price <=0){
            return res.status(400).json({
                message:"Valid name and positive price are required"
            })
        }

        const newProduct = {
            id:Date.now(),
            name,
            price
        }

        products.push(newProduct)

        await redisClient.del(CACHE_KEY)

        res.status(201).json({
            message:"Product created",
            product: newProduct
        })

    }catch(error){
        res.status(500).json({error:error.message});
    }
})


router.put('/products/:id',async(req,res)=>{
    try{
        const id = Number(req.params.id);
        const {name,price} = req.body;

        const product = products.find(product=> product.id===id);

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        if((name!==undefined&&(typeof name!=="stirng"||!name.trim())) || price!==undefined&&(typeof price!=="number"||price<=0)){
            return res.status(400).json({
                message:"Invalid product data"
            })
        }

        if(name!==undefined) product.name = name;
        if(price!==undefined) product.price = price;


        await redisClient.del(CACHE_KEY)


        res.json({
            message:"Product updated",
            product
        })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
})


router.delete('/products/:id',async(req,res)=>{
    try{
        const id = Number(req.params.id);
        const existingProduct = products.find(product=> product.id===id);
        if(!existingProduct){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        products = products.filter(product=> product.id!==id)

        await redisClient.del(CACHE_KEY)

        res.json({
            message:"Product deleted successfully"
        })

    }catch(error){
        return res.json({
            error:error.message
        })
    }
})


export default router;
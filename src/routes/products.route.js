import express from "express";
import cacheMiddleware from "../middleware/cache.middleware.js";
const router = express.Router();

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 55000
    },
    {
        id: 2,
        name: "Keyboard",
        price: 1500
    },
    {
        id: 3,
        name: "Mouse",
        price: 800
    }
];

router.get('/products',cacheMiddleware(30),async(req,res)=>{
    console.log("Fetching products from database..");

    await new Promise(resolve => setTimeout(resolve,2000));

    res.json({
        success:true,
        count:products.length,
        products
    })
})


export default router;
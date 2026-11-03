import express, { json } from 'express'
import redisConnect from './config/redis.js'
import productRouter from "./routes/products.route.js"
const app = express();

app.use(express.json())

app.use('/api',productRouter)

app.post('/redis/set',async(req,res)=>{
    const {key,value} = req.body;
    try{
        await redisConnect.set(key,value,{
            EX:30
        })

        res.status(201).json({
            message:"Data stored successfully"
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

app.get('/redis/get/:key',async(req,res)=>{
    
    const {key} =req.params;
    try{
       const value =   await redisConnect.get(key);

       res.status(200).json({
        key:key,
        value:value
       })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}) 

app.delete('/redis/delete/:key',async(req,res)=>{
    try{
        const {key} = req.params;

        const response = await redisConnect.del(key)

        res.json({
            delete:response===1
        })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    } 
})


const startServer = async() =>{
    try{
        await redisConnect.connect();
        console.log("Redis connected successfully");

        app.listen(process.env.PORT || 3000,"0.0.0.0",()=>{
            console.log("Express server running!")
        })
    }catch(err){
        console.error("Server startup failed:",error);
        process.exit(1)
    }
}

startServer();
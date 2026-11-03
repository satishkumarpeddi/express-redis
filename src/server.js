import express from 'express'
import redisConnect from './config/redis.js'

const app = express();

app.use(express.json())


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
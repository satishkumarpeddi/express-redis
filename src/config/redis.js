import path from "path"
import  "dotenv/config"
import {createClient} from "redis"

console.log(process.env.REDIS_URL)

// dotenv.config({
//     path:path.resolve(__dirname,'../../.env')
// })
const redisConnect = createClient({
    url:process.env.REDIS_URL
})

redisConnect.on("error",(err)=>{
    console.error("Redis error:",err)
})


redisConnect.on("connect",()=>{
    console.log("Connecting redis")
})

redisConnect.on("ready",()=>{
    console.log("Redis connection ready")
})

export default redisConnect;
import redisClient from '../config/redis.js'

const cacheMiddleware = (ttl=30) => {
    return async(req,res,next) => {
        const cacheKey = `cache:${req.originalUrl}`;

        try{
            const cacheData = await redisClient.get(cacheKey);


            if(cacheData!==null){
                console.log("CACHE HIT:",cacheKey)

                res.set("X-Cache","HIT");

                return res.json(JSON.parse(cacheData))
            }

            console.log("CACHE MISS:",cacheKey)

            res.set("X-Cache","MISS")

            const originalJson = res.json.bind(res);

            res.json=(data)=>{
                if(res.statusCode < 400){
                    redisClient.set(
                        cacheKey,
                        JSON.stringify(data),
                        {EX:ttl}
                    ).catch(console.error)
                }
                return originalJson(data)
            }
            next();
        }catch(error){
            console.error("Redis Cache Error:",error);
            next();
        }
    }
}

export default cacheMiddleware;
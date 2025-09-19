const { createClient } = require ('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-10236.c114.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10236
    }
});
module.exports= redisClient;
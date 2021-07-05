(async () =>{
const redis = require('promise-redis')();
const client = redis.createClient();
//SET
const result = await client.set('chave','valor');
console.log(result);
client.get('chave');
const result2 = await client.get('chave');
console.log(result2);
})();

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}


let dbPromise = getDbPromise().then((promise)=>{
  return promise;
})
.catch((error=>{
  console.error(error);
}));

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

async function getDbPromise(){
  let client;
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = await client.connect()
    }
    return global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    let promise = await client.connect();
    return promise;
  }
}


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.

export default dbPromise
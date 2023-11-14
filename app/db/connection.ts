import { MongoClient } from "mongodb";

if ( ! process.env.MONGODB_URI ){
  throw "Cannot read connection string.";
  
}

export const client = new MongoClient( process.env.MONGODB_URI );

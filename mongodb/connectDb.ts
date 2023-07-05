import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const DB = process.env.MONGO_DB || "mongodb://";
const MONGO_DB_ATLAS = process.env.MONGO_DB_ATLAS;
const USER = process.env.MONGODB_USERNAME || "";
const PASSWORD = encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD || "");
const DB_NAME = process.env.MONGODB_DATABASE_NAME || "";
const HOST = process.env.MONGODB_HOST || "172.18.0.2";
const PORT = process.env.MONGODB_PORT || "27017";
const DB_MECHANISM = process.env.DB_MECHANISM || "?authMechanism=DEFAULT";

const cloudurl = `${DB}${USER}:${PASSWORD}@${HOST}/${DB_MECHANISM}`;
/* const dbUrl = DB_NAME === "local" ? `${DB}${USER}:${PASSWORD}@${HOST}:${PORT}/?authMechanism=DEFAULT` : cloudurl; */

//MongoDB Atlass
const dbUrl = `${MONGO_DB_ATLAS}`;


console.log("DBURL", dbUrl);

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const mongoDbConnection = await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 20000 });
    if (mongoDbConnection.connection.readyState === 1) {
      console.log("Connection success");
    } else {
      console.error("Connection failed");
    }
  } catch (error: any) {
    console.log("DB connection failed", error.message);
    // setTimeout(connectDb, 5000);
  }
};

export { connectDb };

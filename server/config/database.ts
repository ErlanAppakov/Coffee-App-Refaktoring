import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Загрузка JWT_SECRET
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_in_production";

const connectDB = async (): Promise<void> => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri && mongoUri.includes(':5001')) {
      console.warn('⚠️  Warning: MONGODB_URI contains port 5001, correcting to 27017');
      mongoUri = mongoUri.replace(':5001', ':27017');
    }
    
    if (!mongoUri) {
      mongoUri = "mongodb://127.0.0.1:27017/coffee-app";
    }
    
    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will continue, but database operations may fail');
    console.log('💡 Make sure MongoDB is running: docker-compose up -d');
  }
};

export default connectDB;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const result = await db.collection('reviews').dropIndex('user_1_product_1');
    console.log('Index dropped:', result);
    
    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

dropIndex();

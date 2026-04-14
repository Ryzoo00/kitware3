import mongoose from 'mongoose';
import { config } from './config/index.js';
import { User } from './models/user.model.js';
import { connectDB } from './db/connection.js';

try {
  await connectDB();
  
  const admin = await User.findOne({ email: 'admin@luxeliving.com' });
  
  if (admin) {
    console.log('\n✅ Admin user found:');
    console.log('  Name:', admin.name);
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('  ID:', admin._id);
    console.log('');
  } else {
    console.log('\n❌ Admin user NOT found!\n');
  }
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

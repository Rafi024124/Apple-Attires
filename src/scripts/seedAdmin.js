import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });


import bcrypt from 'bcrypt';
import dbConnect, { collectionNamesObj } from '../lib/dbConnect.js';

async function seedAdmin() {
  const db = await dbConnect(collectionNamesObj.adminsCollection);

  const existing = await db.findOne({ email: 'admin@appleattires.com' });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const password = process.env.NEW_ADMIN_PASSWORD;
  if (!password) {
    console.error('❌ Please set NEW_ADMIN_PASSWORD in your .env.local file');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insertOne({
    email: 'admin@appleattires.com',
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date(),
  });

  console.log('✅ Admin created');
}

// Call the function
seedAdmin()
  .then(() => {
    console.log('Seeding done');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });

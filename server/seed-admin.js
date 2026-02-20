require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newshub';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@newshub.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'securepassword';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'newshub' });
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = new User({
                name: 'Admin',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }

        await mongoose.disconnect();
        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

seedAdmin();

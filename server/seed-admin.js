require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newshub';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'newshub' });
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@newshub.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = new User({
                name: 'Admin',
                email: 'admin@newshub.com',
                password: 'admin123',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created: admin@newshub.com / admin123');
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

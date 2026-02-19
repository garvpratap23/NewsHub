require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
        { email: 'garv@gmail.com' },
        { role: 'admin' },
        { new: true }
    );
    if (user) {
        console.log('SUCCESS: Updated', user.name, '-> role:', user.role);
    } else {
        console.log('No user found with email garv@gmail.com');
    }
    await mongoose.disconnect();
}

makeAdmin().catch(err => { console.error(err); process.exit(1); });

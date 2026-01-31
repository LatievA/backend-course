require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { connect } = require('./config/db');
const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await connect(process.env.MONGODB_URI);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
            console.log('To create a new admin, delete the existing one first or use different credentials.');
        } else {
            // Create admin user
            const admin = new User({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                name: ADMIN_NAME,
                role: 'admin'
            });

            await admin.save();
            console.log('✓ Admin user created successfully!');
            console.log(`  Email: ${ADMIN_EMAIL}`);
            console.log(`  Password: ${ADMIN_PASSWORD}`);
            console.log(`  Role: admin`);
        }

        // Show all users summary
        const userCount = await User.countDocuments({ role: 'user' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        console.log(`\nDatabase summary:`);
        console.log(`  Total admins: ${adminCount}`);
        console.log(`  Total users: ${userCount}`);

    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        process.exit(0);
    }
}

seed();

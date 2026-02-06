require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { connect } = require('./config/db');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Exercise = require('./models/Exercise');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await connect(process.env.MONGODB_URI);

        // Check if admin already exists
        let admin = await User.findOne({ email: ADMIN_EMAIL });

        if (admin) {
            // Reset admin password to ensure login works
            admin.name = ADMIN_NAME;
            admin.role = 'admin';
            admin.password = ADMIN_PASSWORD;
            await admin.save();
            console.log(`✓ Admin user updated: ${ADMIN_EMAIL}`);
            console.log(`  Password reset to: ${ADMIN_PASSWORD}`);
        } else {
            // Create admin user
            admin = new User({
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

        // Seed mock workouts and exercises if none exist
        const existingWorkouts = await Workout.countDocuments();
        if (existingWorkouts === 0) {
            console.log('\nSeeding mock workouts and exercises...');

            const workoutData = [
                {
                    title: 'Beginner Full Body',
                    duration: 30,
                    difficulty: 'Beginner',
                    description: 'A balanced full-body routine for beginners.'
                },
                {
                    title: 'Strength Builder',
                    duration: 45,
                    difficulty: 'Intermediate',
                    description: 'Focus on compound lifts and strength progression.'
                },
                {
                    title: 'HIIT Advanced',
                    duration: 25,
                    difficulty: 'Advanced',
                    description: 'High-intensity interval training for experienced athletes.'
                }
            ];

            const workouts = await Workout.insertMany(workoutData);

            const exerciseData = [
                {
                    name: 'Push-ups',
                    sets: 3,
                    reps: 12,
                    description: 'Keep your body straight and core engaged.',
                    workout: workouts[0]._id
                },
                {
                    name: 'Bodyweight Squats',
                    sets: 3,
                    reps: 15,
                    description: 'Sit back and keep knees aligned with toes.',
                    workout: workouts[0]._id
                },
                {
                    name: 'Deadlifts',
                    sets: 4,
                    reps: 6,
                    description: 'Maintain a neutral spine throughout the lift.',
                    workout: workouts[1]._id
                },
                {
                    name: 'Pull-ups',
                    sets: 4,
                    reps: 8,
                    description: 'Use a full range of motion with controlled tempo.',
                    workout: workouts[1]._id
                },
                {
                    name: 'Burpees',
                    sets: 5,
                    reps: 10,
                    description: 'Explosive movement for cardio and strength.',
                    workout: workouts[2]._id
                },
                {
                    name: 'Mountain Climbers',
                    sets: 4,
                    reps: 20,
                    description: 'Keep hips low and drive knees quickly.',
                    workout: workouts[2]._id
                }
            ];

            const exercises = await Exercise.insertMany(exerciseData);

            // Link exercises to workouts
            const workoutExerciseMap = new Map();
            exercises.forEach(ex => {
                const key = ex.workout.toString();
                if (!workoutExerciseMap.has(key)) workoutExerciseMap.set(key, []);
                workoutExerciseMap.get(key).push(ex._id);
            });

            for (const workout of workouts) {
                const exIds = workoutExerciseMap.get(workout._id.toString()) || [];
                workout.exercises = exIds;
                await workout.save();
            }

            console.log('✓ Mock workouts and exercises created!');
        } else {
            console.log('\nMock data already exists. Skipping workout/exercise seeding.');
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

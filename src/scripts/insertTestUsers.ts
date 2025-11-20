// Script to insert test users into Supabase database
import { createClient } from '@supabase/supabase-js';
import { seedUsers } from '../data/seedUsers';

const supabaseUrl = 'https://utvozryyrirwllumubqn.supabase.co';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Replace with actual service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTestUsers() {
  console.log('Starting to insert test users...\n');

  for (const userData of seedUsers) {
    try {
      console.log(`\n=== Processing user: ${userData.username} (${userData.email}) ===`);

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          username: userData.username,
          avatar: userData.avatar,
          language: userData.language,
        }
      });

      if (authError) {
        console.error(`Auth error for ${userData.email}:`, authError);
        continue;
      }

      const userId = authData.user.id;
      console.log(`✓ Created auth user with ID: ${userId}`);

      // 2. Insert user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: userData.username,
          avatar: userData.avatar,
          location: userData.location,
          bio: userData.bio,
          language: userData.language,
          friends_count: userData.friendsCount,
          posts_count: userData.posts,
        });

      if (profileError) {
        console.error(`Profile error for ${userData.email}:`, profileError);
      } else {
        console.log(`✓ Created profile`);
      }

      // 3. Insert device info
      const { error: deviceError } = await supabase
        .from('devices')
        .insert({
          user_id: userId,
          bike_model: userData.bikeModel,
          battery_level: userData.battery,
          is_connected: false,
        });

      if (deviceError) {
        console.error(`Device error for ${userData.email}:`, deviceError);
      } else {
        console.log(`✓ Created device: ${userData.bikeModel}`);
      }

      // 4. Insert statistics
      const { error: statsError } = await supabase
        .from('statistics')
        .insert({
          user_id: userId,
          total_distance: userData.totalDistance,
          today_distance: userData.todayDistance,
          total_rides: userData.totalRides,
          total_time: userData.totalTime,
          avg_speed: userData.avgSpeed,
          carbon_saved: userData.carbonSaved,
          energy_points: userData.energyPoints,
          calories: userData.calories,
          elevation: userData.elevation,
        });

      if (statsError) {
        console.error(`Statistics error for ${userData.email}:`, statsError);
      } else {
        console.log(`✓ Created statistics`);
      }

      // 5. Insert ride history
      for (const ride of userData.recentRides) {
        const { error: rideError } = await supabase
          .from('ride_history')
          .insert({
            user_id: userId,
            date: ride.date,
            distance: ride.distance,
            duration: ride.time,
            avg_speed: ride.avgSpeed,
            calories: ride.calories,
          });

        if (rideError) {
          console.error(`Ride history error:`, rideError);
        }
      }
      console.log(`✓ Created ${userData.recentRides.length} ride history entries`);

      // 6. Insert achievements
      for (const achievement of userData.achievements) {
        const { error: achievementError } = await supabase
          .from('achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement,
            unlocked_at: new Date().toISOString(),
          });

        if (achievementError) {
          console.error(`Achievement error:`, achievementError);
        }
      }
      console.log(`✓ Created ${userData.achievements.length} achievements`);

      // 7. Insert check-ins
      for (const landmarkId of userData.visitedLandmarks) {
        const { error: checkInError } = await supabase
          .from('check_ins')
          .insert({
            user_id: userId,
            landmark_id: landmarkId,
            checked_in_at: new Date().toISOString(),
          });

        if (checkInError) {
          console.error(`Check-in error:`, checkInError);
        }
      }
      console.log(`✓ Created ${userData.visitedLandmarks.length} check-ins`);

      // 8. Insert ranking data
      const { error: rankError } = await supabase
        .from('rankings')
        .insert({
          user_id: userId,
          carbon_rank: userData.carbonRank,
          badge: userData.badge,
          carbon_saved: userData.carbonSaved,
        });

      if (rankError) {
        console.error(`Ranking error for ${userData.email}:`, rankError);
      } else {
        console.log(`✓ Created ranking: #${userData.carbonRank} (${userData.badge})`);
      }

      console.log(`\n✅ Successfully created user: ${userData.username}`);

    } catch (error) {
      console.error(`\n❌ Error creating user ${userData.email}:`, error);
    }
  }

  console.log('\n\n=== All users processed ===\n');
  displayUserCredentials();
}

function displayUserCredentials() {
  console.log('=== Blitz App Test User Credentials ===\n');
  seedUsers.forEach((user, index) => {
    console.log(`User ${index + 1} (${user.language === 'en' ? 'English' : '中文'}):`)
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Bike Model: ${user.bikeModel}`);
    console.log(`  Total Distance: ${user.totalDistance} km`);
    console.log(`  Carbon Rank: #${user.carbonRank}`);
    console.log(`  Badge: ${user.badge}`);
    console.log('');
  });
}

// Run the script
insertTestUsers().catch(console.error);

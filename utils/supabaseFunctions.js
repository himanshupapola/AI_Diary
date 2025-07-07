import {supabase} from './supabase';
import uuid from 'react-native-uuid';

const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/ddu1cyhxh/image/upload/v1742240527/hwuw0q4dixnrgetabw3c.png';
const DEFAULT_BIRTHDATE = new Date(2000, 5, 24);
const DEFAULT_GENDER = 'Male';
const DEFAULT_CITY = 'Tokyo, Japan';

// Generate a consistent UID from email
export function generateUID(email) {
  return uuid.v5(email, '123e4567-e89b-12d3-a456-426614174000');
}

// Save or update user profile
export async function saveUserProfile(email, date, gender, city, profileImage) {
  const uid = generateUID(email);

  // Ensure only valid URLs are stored
  const profilePicture = profileImage?.startsWith('http')
    ? profileImage
    : DEFAULT_IMAGE_URL;

  const {data, error} = await supabase.from('users').upsert(
    [
      {
        uid,
        date,
        email,
        gender,
        city,
        profile_picture: profilePicture,
        updated_at: new Date(),
      },
    ],
    {onConflict: ['uid']},
  );

  if (error) {
    console.error('❌ Error saving user data:', error);
    return null;
  }

  return data;
}

// Fetch user profile (creates one if not found)
export async function getUserProfile(email) {
  const uid = generateUID(email);

  let {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      await saveUserProfile(
        email,
        DEFAULT_BIRTHDATE,
        DEFAULT_GENDER,
        DEFAULT_CITY,
        DEFAULT_IMAGE_URL,
      );

      const {data: newData, error: newError} = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .single();

      if (newError) {
        console.error(
          '❌ Error fetching newly created user profile:',
          newError,
        );
        return null;
      }

      return newData; // Return the new user profile
    }

    console.error('❌ Error fetching user profile:', error);
    return null;
  }

  return data;
}

// Update user profile
export async function updateUserProfile(email, updatedData) {
  const uid = generateUID(email);

  const {data, error} = await supabase
    .from('users')
    .update(updatedData)
    .eq('uid', uid)
    .select()
    .single(); // Ensures a single row is returned

  if (error) {
    console.error('❌ Error updating user profile:', error);
    return {success: false, error};
  }
  return {success: true, data};
}

// Update Image
export async function updateProfileImageInSupabase(uid, uploadUrl) {
  const {error} = await supabase
    .from('users')
    .update({profile_picture: uploadUrl})
    .eq('uid', uid);

  if (error) {
    console.error('❌ Error updating profile image in Supabase:', error);
  }
}

//fetch posts
export const fetchPosts = async () => {
  const {data, error} = await supabase
    .from('posts')
    .select('*, users(profile_picture)')
    .order('time', {ascending: false}); // Order by latest posts

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
};

// Creat Post
export const createPost = async (uid, username, content, category) => {
  const {error} = await supabase.from('posts').insert([
    {
      uid,
      username,
      content,
      likes: 0,
      category,
      time: new Date(),
    },
  ]);

  if (error) {
    console.error('Error creating post:', error);
  }
};

//  Likes
export const toggleLike = async (postId, uid) => {
  // Insert like into post_likes table
  const {error: insertError} = await supabase
    .from('post_likes')
    .insert([{post_id: postId, uid}]);

  if (insertError) {
    console.error('Error liking post:', insertError);
    return null;
  }

  // Get the current like count from the posts table
  const {data: postData, error: fetchError} = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (fetchError) {
    console.error('Error fetching post likes:', fetchError);
    return null;
  }

  const currentLikes = postData?.likes || 0; // Ensure valid count

  // Increment likes count by 1
  const newLikeCount = currentLikes + 1;

  // Update the likes count in the posts table
  const {error: updateError} = await supabase
    .from('posts')
    .update({likes: newLikeCount})
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating post likes:', updateError);
    return null;
  }

  return true; // Post is now liked and like count updated
};

export const checkIfLiked = async (postId, uid) => {
  const {data, error} = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('uid', uid)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking like status:', error);
  }

  return !!data;
};

// Fetch all diary entries for a user
export const fetchDiaryEntries = async email => {
  const uid = generateUID(email);

  const {data, error} = await supabase
    .from('diary')
    .select('*')
    .eq('uid', uid)
    .order('date', {ascending: false});

  if (error) {
    console.error('❌ Error fetching diary entries:', error);
    return [];
  }

  return data;
};

// Create a new diary entry
export const createDiaryEntry = async (email, title, content, emoji, date) => {
  const uid = generateUID(email);

  const {error} = await supabase.from('diary').insert([
    {
      uid,
      title,
      content,
      emoji,
      date: date || new Date().toISOString().split('T')[0],
      created_at: new Date(),
    },
  ]);

  if (error) {
    console.error('❌ Error creating diary entry:', error);
    return null;
  }

  return true;
};

//Fetch dates
export const fetchDiaryDateEntry = async email => {
  const uid = generateUID(email);

  const {data, error} = await supabase
    .from('diary')
    .select('date') // Fetch only the date column
    .eq('uid', uid)
    .order('date', {ascending: false});

  if (error) {
    console.error('❌ Error fetching diary dates:', error);
    return [];
  }

  // Remove duplicates using a Set
  const uniqueDates = [...new Set(data.map(entry => entry.date))];

  // Convert to required format [{ date: "YYYY-MM-DD" }]
  return uniqueDates.map(date => ({date}));
};

// mood fetch
export const fetchDiaryEmojis = async email => {
  const uid = generateUID(email);

  const {data, error} = await supabase
    .from('diary')
    .select('emoji, date')
    .eq('uid', uid)
    .order('date', {ascending: false})
    .limit(100);

  if (error) {
    console.error('❌ Error fetching diary emojis:', error);
    return [];
  }

  const moodsByDate = new Map();

  data.forEach(entry => {
    const date = entry.date.split('T')[0];
    if (!moodsByDate.has(date)) {
      moodsByDate.set(date, []);
    }
    moodsByDate.get(date).push(entry.emoji);
  });

  const dailyMoods = [];

  // Process moods for each day
  moodsByDate.forEach((moods, date) => {
    let finalMood;

    if (moods.length === 1) {
      finalMood = moods[0];
    } else {
      const moodCounts = moods.reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      const maxCount = Math.max(...Object.values(moodCounts));
      const mostFrequentMoods = Object.keys(moodCounts).filter(
        mood => moodCounts[mood] === maxCount,
      );

      finalMood = mostFrequentMoods.includes(moods[moods.length - 1])
        ? moods[moods.length - 1]
        : mostFrequentMoods[0];
    }

    dailyMoods.push([finalMood, date]); // Store as [mood, date]
  });

  return dailyMoods.slice(0, 30);
};

export const listenForNewPosts = callback => {
  return supabase
    .channel('posts-listener')
    .on(
      'postgres_changes',
      {event: 'INSERT', schema: 'public', table: 'posts'},
      async payload => {
        const {id, uid, username} = payload.new;

        // Fetch the user's profile picture
        const {data: userData, error} = await supabase
          .from('users')
          .select('profile_picture')
          .eq('uid', uid)
          .single();

        if (error) {
          console.error('❌ Error fetching user profile:', error);
          return;
        }

        const notification = {
          id: `S-${id}`,
          type: 'post',
          user: username,
          message: 'shared a new post!',
          image: userData?.profile_picture || DEFAULT_IMAGE_URL,
          backgroundColor: '#E3F2FD',
          read: false,
        };

        callback(notification); // Pass the notification to the callback
      },
    )
    .subscribe();
};

// save fcm token
export async function saveFCMToken(email, token) {
  const uid = generateUID(email);

  const {data, error} = await supabase
    .from('fcm_tokens')
    .upsert([{uid, token, timestamp: new Date()}], {onConflict: ['uid']});

  if (error) {
    console.error('❌ Error saving FCM token:', error);
    return {success: false, error};
  }

  return {success: true, data};
}

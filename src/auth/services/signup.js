import { supabase } from '../../supabase-client/supabase-client.js';
import { cropAndUploadPhoto } from '@/profile-photo/process-and-upload-photo.js';

/**
 * Sign up a new user with email & password.
 * @param firstName
 * @param lastName
 * @param username
 * @param profilePhoto
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object | null, session: object | null, error: object | null }>}
 */
export async function signUpUser(
  firstName,
  lastName,
  username,
  email,
  password,
  profilePhoto,
) {
  console.time('signUpUser');

  const {
    data: { user, session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return;
  }

  const userId = user.id;
  const photoUrl = await cropAndUploadPhoto(profilePhoto);

  await insertPhotoAndNamesToUserRow(
    userId,
    firstName,
    lastName,
    username,
    photoUrl,
  );

  console.timeEnd('signUpUser');
}

async function insertPhotoAndNamesToUserRow(
  userId,
  firstName,
  lastName,
  username,
  photoFilePath,
) {
  let { data, error } = await supabase
    .from('users')
    .update({
      profile_photo_url: photoFilePath,
      first_name: firstName,
      last_name: lastName,
      username: username,
    })
    .eq('id', userId);
  if (data) {
    console.log(data);
  } else if (error) {
    console.log(error);
  }
}

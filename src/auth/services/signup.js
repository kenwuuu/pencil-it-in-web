import { supabase } from '../../supabase-client/supabase-client.js';

/**
 * Sign up a new user with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object | null, session: object | null, error: object | null }>}
 */
export async function signUpUser(
  firstName,
  lastName,
  username,
  profilePhoto,
  email,
  password,
) {
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  const userId = user.id;

  // compress photo to AVIF
  function compressPhoto(file) {
    return photo;
  }

  // upload profile photo
  async function uploadFile(file) {
    const { data, error } = await supabase.storage
      .from('profile_photos')
      // replace file_path with gen4 uuid
      .upload('file_path', file, {
        contentType: 'image/avif',
      });
    if (error) {
      // Handle error
    } else {
      // Handle success
    }
  }

  async function insertPhotoUrlToUserRow(userId, photoFilePath) {
    let { data, error } = await supabase
      .from('users')
      .update({ profile_photo_url: photoFilePath })
      .eq('id', userId);
  }

  return { user, session, error };
}

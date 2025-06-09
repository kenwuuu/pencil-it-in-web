import { supabase } from '../../supabase-client/supabase-client.js';

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

  console.log(firstName);
  console.log(lastName);

  // profilePhoto = compressPhoto();
  const filePath = await uploadFile(profilePhoto);
  const photoUrl = buildBucketUrl(filePath);

  insertPhotoAndNamesToUserRow(userId, firstName, lastName, username, photoUrl);

  // compress photo to AVIF
  function compressPhoto(file) {
    return file;
  }

  // upload profile photo
  async function uploadFile(file) {
    const uuid = crypto.randomUUID(); // generates a UUID v4

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(uuid, file, {
        contentType: file.type || 'image/jpg',
      });

    if (error) {
      console.error('Upload failed:', error);
    } else {
      console.log('Upload successful:', data);
      return data.path;
    }
  }

  function buildBucketUrl(filePath) {
    const bucketUrl =
      'https://mpounklnfrcfpkefidfn.supabase.co/storage/v1/object/public/profile-photos/';
    return bucketUrl + filePath;
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

  // return { user, session, error };
}

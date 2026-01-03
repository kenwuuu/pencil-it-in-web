import { supabase } from '../../supabase-client/supabase-client.ts';
import Compressor from 'compressorjs';

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

  console.log(
    `Original file size: ${(profilePhoto.size / 1024 / 1024).toFixed(2)} MB`,
  );

  let profilePhoto512 = await cropPhoto(profilePhoto, 512);
  profilePhoto512 = await compressPhoto(profilePhoto512);

  let profilePhoto256 = await cropPhoto(profilePhoto, 256);
  profilePhoto256 = await compressPhoto(profilePhoto256);

  console.log(
    `Final file size: ${(profilePhoto.size / 1024 / 1024).toFixed(2)} MB`,
  );

  const uuid = crypto.randomUUID(); // generates a v4 UUID
  await uploadProfilePhoto(profilePhoto512, uuid, '512');
  const filePath = await uploadProfilePhoto(profilePhoto256, uuid, '256');
  const photoUrl = buildBucketUrl(filePath);

  await insertPhotoAndNamesToUserRow(
    userId,
    firstName,
    lastName,
    username,
    photoUrl,
  );

  console.timeEnd('signUpUser');
}

// crop photo to square based on shortest edge
async function cropPhoto(file, cropSize) {
  console.time('cropPhoto');

  return new Promise((resolve, reject) => {
    // Create image element
    const img = new Image();
    img.onload = () => {
      // Calculate crop dimensions (square based on shortest edge)
      const shortestEdge = Math.min(img.width, img.height);
      cropSize = Math.min(shortestEdge, cropSize);

      console.log(
        `Cropping from ${img.width}x${img.height} to ${cropSize}x${cropSize}`,
      );

      // Calculate center crop position
      const cropX = (img.width - shortestEdge) / 2;
      const cropY = (img.height - shortestEdge) / 2;

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size
      canvas.width = cropSize;
      canvas.height = cropSize;

      // Draw cropped image
      ctx.drawImage(
        img,
        cropX,
        cropY,
        shortestEdge,
        shortestEdge, // source rectangle
        0,
        0,
        cropSize,
        cropSize, // destination rectangle
      );

      // Convert canvas to blob and create new File
      canvas.toBlob(blob => {
        if (blob) {
          const croppedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          console.timeEnd('cropPhoto');
          resolve(croppedFile);
        } else {
          console.timeEnd('cropPhoto');
          reject(new Error('Failed to crop image'));
        }
      }, file.type);
    };

    img.onerror = () => {
      console.timeEnd('cropPhoto');
      reject(new Error('Failed to load image for cropping'));
    };
    img.src = URL.createObjectURL(file);
  });
}

// compress photo and convert to WEBP
async function compressPhoto(file) {
  console.time('compressPhoto');

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      convertSize: 0, // always compress
      convertTypes: ['image/webp'],
      success(result) {
        // Create new File with .webp extension
        const fileName = file.name.replace(/\.[^/.]+$/, '.jpg');
        const photo = new File([result], fileName, {
          type: 'image/jpg',
          lastModified: Date.now(),
        });
        console.timeEnd('compressPhoto');
        resolve(photo);
      },
      error(err) {
        console.timeEnd('compressPhoto');
        reject(new Error(`Compression failed: ${err.message}`));
      },
    });
  });
}

async function uploadProfilePhoto(photo, uuid, folder) {
  // upload photo
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(folder + '/' + uuid, photo, {
      contentType: photo.type || 'image/webp',
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

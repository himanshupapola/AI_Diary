const CLOUD_NAME = 'ddu1cyhxh';
const UPLOAD_PRESET = 'diary_profile_upload';

export default async function uploadToCloudinary(imageUri, fileType, uid) {
  const folderPath = 'diary/profile';
  const publicId = `${uid}_${Date.now()}`; // Explicitly set the public ID

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: fileType,
    name: `${uid}.${fileType.split('/')[1] || 'jpg'}`,
  });
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folderPath);
  formData.append('public_id', publicId); // Force Cloudinary to use this public ID

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const result = await response.json();

    return result.secure_url || null;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return null;
  }
}

export async function fetchCloudinaryImage(uid) {
  const possibleExtensions = ['jpg', 'png', 'jpeg', 'webp'];
  for (let ext of possibleExtensions) {
    const timestamp = Date.now(); // Cache busting
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/diary/profile/${uid}.${ext}?v=${timestamp}`;

    try {
      const response = await fetch(url, {method: 'HEAD'});
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.error(`❌ Error checking ${ext} format for UID:`, error);
    }
  }
  console.warn('⚠️ Image not found for UID:', uid);
  return null;
}

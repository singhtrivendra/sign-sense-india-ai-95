const API_URL = 'https://sign-lang-project-1.onrender.com'; 

export const initializeHandGestureModel = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("Error initializing model connection:", error);
    return false;
  }
};

export const captureVideoFrame = (videoElement) => {
  if (!videoElement || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
    return null;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

export const recognizeHandGesture = async (imageData) => {
  if (!imageData) return null;
  
  try {
    const response = await fetch(`${API_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });
    
    const result = await response.json();
    
    if (result.success && result.sign) {
      return result.sign;
    }
    
    return null;
  } catch (error) {
    console.error('Error recognizing gesture:', error);
    return null;
  }
};

export const debugCameraAccess = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    
    return {
      success: true,
      devices: cameras,
      deviceCount: cameras.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
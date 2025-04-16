
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use the right settings
env.allowLocalModels = false;
env.useBrowserCache = false;

// Initialize the model - we'll use an image classification model for hand gestures
let classifier: any = null;

export const initializeHandGestureModel = async () => {
  try {
    classifier = await pipeline(
      'image-classification',
      'Xenova/sign-language-recognition',
      { device: 'webgpu' }
    );
    return true;
  } catch (error) {
    console.error('Error initializing hand gesture model:', error);
    return false;
  }
};

export const recognizeHandGesture = async (imageData: string): Promise<string | null> => {
  if (!classifier) {
    const initialized = await initializeHandGestureModel();
    if (!initialized) return null;
  }

  try {
    // Process the image and get prediction
    const result = await classifier(imageData);
    
    if (result && result.length > 0) {
      // Return the top prediction
      return result[0].label;
    }
    return null;
  } catch (error) {
    console.error('Error recognizing hand gesture:', error);
    return null;
  }
};

// Helper function to capture a frame from video element
export const captureVideoFrame = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Draw the current video frame to the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    // Return as data URL
    return canvas.toDataURL('image/jpeg', 0.8);
  }
  
  return '';
};

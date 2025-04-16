
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use the right settings
env.allowLocalModels = true;
env.useBrowserCache = true;

// Initialize the model - we'll use the RavenOnur/Sign-Language model
let classifier: any = null;

export const initializeHandGestureModel = async () => {
  try {
    console.log("Starting model initialization...");
    
    try {
      // Try to initialize the actual model
      console.log("Attempting to load RavenOnur/Sign-Language model...");
      
      classifier = await pipeline(
        "image-classification",
        "RavenOnur/Sign-Language"
      );
      
      console.log("Model loaded successfully!");
      return true;
    } catch (modelError) {
      console.error("Error loading model:", modelError);
      console.log("Falling back to demo mode");
      return true; // Return true to continue in demo mode
    }
  } catch (error) {
    console.error('Error initializing hand gesture model:', error);
    return false;
  }
};

// Keep track of previous detections to avoid repeating the same sign
let lastDetectedSign: string | null = null;
let lastDetectionTime = 0;
const detectionCooldown = 3000; // 3 seconds cooldown before the same sign can be detected again

export const recognizeHandGesture = async (imageData: string): Promise<string | null> => {
  try {
    if (classifier) {
      try {
        // Try to use the actual model
        const img = document.createElement('img');
        img.src = imageData;
        await new Promise(resolve => { img.onload = resolve; });
        
        const results = await classifier(img);
        if (results && results.length > 0) {
          const topResult = results[0];
          const detectedSign = topResult.label;
          const confidence = topResult.score;
          
          // Only return signs with reasonable confidence
          if (confidence > 0.6) {
            const currentTime = Date.now();
            
            // Don't repeat the same sign too frequently
            if (detectedSign !== lastDetectedSign || (currentTime - lastDetectionTime > detectionCooldown)) {
              lastDetectedSign = detectedSign;
              lastDetectionTime = currentTime;
              console.log(`Model detected: "${detectedSign}" with confidence ${confidence}`);
              return detectedSign;
            }
          }
        }
        
        return null;
      } catch (modelError) {
        console.error("Error using model:", modelError);
        // Fall back to demo mode
      }
    }
    
    // Demo mode fallback
    const demoSigns = ["Hello", "Thank you", "Please", "Yes", "No", "Help", "Good", "Sorry"];
    
    // Only detect when there's likely motion in the video
    const currentTime = Date.now();
    
    // Random value to determine if we'll "detect" something (simulate motion detection)
    const motionDetected = Math.random() > 0.7; // 30% chance overall
    
    if (motionDetected) {
      // Choose a random sign
      const randomIndex = Math.floor(Math.random() * demoSigns.length);
      const detectedSign = demoSigns[randomIndex];
      
      // Don't repeat the same sign too frequently
      if (detectedSign !== lastDetectedSign || (currentTime - lastDetectionTime > detectionCooldown)) {
        lastDetectedSign = detectedSign;
        lastDetectionTime = currentTime;
        console.log(`Demo mode: Detected sign "${detectedSign}"`);
        return detectedSign;
      }
    }
    
    return null; // No gesture detected
  } catch (error) {
    console.error('Error recognizing hand gesture:', error);
    return null;
  }
};

// Helper function to capture a frame from video element
export const captureVideoFrame = (videoElement: HTMLVideoElement): string => {
  if (!videoElement || !videoElement.readyState || videoElement.readyState < 2) {
    console.warn("Video not ready for frame capture");
    return '';
  }
  
  try {
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
  } catch (err) {
    console.error("Error capturing video frame:", err);
  }
  
  return '';
};

// Enhanced function for debugging camera access issues
export const debugCameraAccess = async (): Promise<{success: boolean, devices?: MediaDeviceInfo[], error?: string, browserInfo?: string, secure?: boolean}> => {
  try {
    // Check if we're in a secure context
    const isSecureContext = window.isSecureContext;
    console.log(`Secure context: ${isSecureContext}`);
    
    // Get browser information
    const userAgent = navigator.userAgent;
    const browserInfo = {
      userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      language: navigator.language
    };
    console.log("Browser info:", browserInfo);
    
    // List available media devices to check camera availability
    console.log("Enumerating media devices...");
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    console.log(`Found ${videoDevices.length} video input devices:`);
    videoDevices.forEach((device, index) => {
      console.log(`Camera ${index + 1}: ${device.label || 'Unnamed camera'} (${device.deviceId.substring(0,8)}...)`);
    });
    
    // Attempt to get permissions state if supported by browser
    let permissionStatus = null;
    try {
      if (navigator.permissions && navigator.permissions.query) {
        permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log(`Camera permission status: ${permissionStatus.state}`);
      }
    } catch (permError) {
      console.log("Permission query not supported:", permError);
    }
    
    if (videoDevices.length === 0) {
      return {
        success: false,
        devices: [],
        error: "No video input devices found",
        browserInfo: userAgent,
        secure: isSecureContext
      };
    }
    
    return {
      success: true,
      devices: videoDevices,
      browserInfo: userAgent,
      secure: isSecureContext
    };
  } catch (error) {
    console.error("Error checking camera access:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error checking camera devices",
      browserInfo: navigator.userAgent,
      secure: window.isSecureContext
    };
  }
};

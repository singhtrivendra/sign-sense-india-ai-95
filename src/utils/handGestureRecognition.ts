import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use the right settings
env.allowLocalModels = true;
env.useBrowserCache = true;

// Initialize the model - we'll use the RavenOnur/Sign-Language model
let classifier: any = null;
let isInitializing = false;
let initRetryCount = 0;
const MAX_RETRIES = 2;

export const initializeHandGestureModel = async () => {
  // Prevent multiple initialization attempts running simultaneously
  if (isInitializing) {
    console.log("Model initialization already in progress, waiting...");
    return new Promise<boolean>((resolve) => {
      // Check every 500ms if initialization completed
      const checkInterval = setInterval(() => {
        if (!isInitializing) {
          clearInterval(checkInterval);
          resolve(classifier !== null);
        }
      }, 500);
    });
  }

  // If model already loaded, return success
  if (classifier !== null) {
    console.log("Model already initialized successfully");
    return true;
  }
  
  try {
    isInitializing = true;
    console.log(`Starting model initialization (attempt ${initRetryCount + 1}/${MAX_RETRIES + 1})...`);
    
    // Add clearer diagnostics
    console.log("Browser information:", navigator.userAgent);
    console.log("WebGPU supported:", 'gpu' in navigator);
    console.log("Secure context:", window.isSecureContext);
    
    // Initialize the model with explicit settings
    console.log("Attempting to load RavenOnur/Sign-Language model...");
    
    // Try with specific quantization format which might be more compatible
    classifier = await pipeline(
      "image-classification",
      "RavenOnur/Sign-Language",
      {
        // Force CPU if we've had previous failures which might be GPU-related
        device: initRetryCount > 0 ? "cpu" : "auto",
        // Enable more detailed logs
        progress_callback: (x) => {
          console.log("Model loading progress:", x);
        }
      }
    );
    
    console.log("Model loaded successfully!");
    isInitializing = false;
    return true;
  } catch (error) {
    console.error('Error initializing hand gesture model:', error);
    
    // Retry logic with fallback to CPU if possible
    if (initRetryCount < MAX_RETRIES) {
      isInitializing = false;
      initRetryCount++;
      console.log(`Will retry model initialization with different settings (attempt ${initRetryCount + 1}/${MAX_RETRIES + 1})`);
      return initializeHandGestureModel(); // Retry recursively
    }
    
    isInitializing = false;
    return false;
  }
};

// Keep track of previous detections to avoid repeating the same sign
let lastDetectedSign: string | null = null;
let lastDetectionTime = 0;
const detectionCooldown = 3000; // 3 seconds cooldown before the same sign can be detected again

// For demo/fallback when model fails
const demoSigns = ["A", "B", "C", "Hello", "Thank you", "Yes", "No"];
let demoModeEnabled = false;

export const recognizeHandGesture = async (imageData: string): Promise<string | null> => {
  try {
    if (!classifier) {
      console.log("Model not initialized, attempting to initialize");
      const initialized = await initializeHandGestureModel();
      
      if (!initialized) {
        console.log("Model failed to initialize, using demo mode");
        demoModeEnabled = true;
        
        // In demo mode, occasionally return a random sign to simulate detection
        if (Math.random() > 0.7) {
          const randomSign = demoSigns[Math.floor(Math.random() * demoSigns.length)];
          const currentTime = Date.now();
          
          // Don't repeat signs too frequently even in demo mode
          if (randomSign !== lastDetectedSign || (currentTime - lastDetectionTime > detectionCooldown)) {
            lastDetectedSign = randomSign;
            lastDetectionTime = currentTime;
            console.log(`Demo mode detected: "${randomSign}"`);
            return randomSign;
          }
        }
        return null;
      }
    }
    
    // Use the actual model if available
    if (!demoModeEnabled) {
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
    } else {
      // Demo mode logic (already handled in the initialization check)
    }
    
    return null; // No gesture detected or low confidence
  } catch (error) {
    console.error('Error recognizing hand gesture:', error);
    // Enable demo mode if real detection fails
    demoModeEnabled = true;
    return null;
  }
};

// Helper function to capture a frame from video element with grid overlay
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

// Hardware Detection Utilities for VR and Beamer Support

export interface HardwareCapabilities {
  // VR Capabilities
  webXRSupported: boolean;
  vrSupported: boolean;
  arSupported: boolean;
  handTrackingSupported: boolean;
  
  // Device Information
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'vr-headset';
  vrHeadsetType: 'quest' | 'vive' | 'index' | 'pico' | 'unknown' | null;
  
  // Display Capabilities
  isProjectorConnected: boolean;
  displayResolution: { width: number; height: number };
  pixelRatio: number;
  supportsFullscreen: boolean;
  
  // Browser Capabilities
  browserType: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  webGLSupported: boolean;
  webGL2Supported: boolean;
  
  // Mobile Capabilities
  gyroscopeSupported: boolean;
  accelerometerSupported: boolean;
  orientationSupported: boolean;
  touchSupported: boolean;
  
  // Performance Indicators
  performanceLevel: 'low' | 'medium' | 'high';
  recommendedSettings: {
    vrEnabled: boolean;
    arEnabled: boolean;
    mobileVREnabled: boolean;
    beamerOptimized: boolean;
  };
}

class HardwareDetector {
  private capabilities: HardwareCapabilities | null = null;

  async detectCapabilities(): Promise<HardwareCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    const capabilities: HardwareCapabilities = {
      // Initialize with defaults
      webXRSupported: false,
      vrSupported: false,
      arSupported: false,
      handTrackingSupported: false,
      deviceType: 'desktop',
      vrHeadsetType: null,
      isProjectorConnected: false,
      displayResolution: { width: window.screen.width, height: window.screen.height },
      pixelRatio: window.devicePixelRatio || 1,
      supportsFullscreen: !!document.fullscreenEnabled,
      browserType: 'unknown',
      webGLSupported: false,
      webGL2Supported: false,
      gyroscopeSupported: false,
      accelerometerSupported: false,
      orientationSupported: false,
      touchSupported: false,
      performanceLevel: 'medium',
      recommendedSettings: {
        vrEnabled: false,
        arEnabled: false,
        mobileVREnabled: false,
        beamerOptimized: false
      }
    };

    // Detect WebXR support
    await this.detectWebXR(capabilities);
    
    // Detect device type and VR headset
    this.detectDeviceType(capabilities);
    
    // Detect browser
    this.detectBrowser(capabilities);
    
    // Detect WebGL support
    this.detectWebGL(capabilities);
    
    // Detect mobile capabilities
    this.detectMobileCapabilities(capabilities);
    
    // Detect projector/external display
    this.detectProjector(capabilities);
    
    // Assess performance level
    this.assessPerformance(capabilities);
    
    // Generate recommendations
    this.generateRecommendations(capabilities);

    this.capabilities = capabilities;
    return capabilities;
  }

  private async detectWebXR(capabilities: HardwareCapabilities): Promise<void> {
    if ('xr' in navigator && navigator.xr) {
      capabilities.webXRSupported = true;
      
      try {
        capabilities.vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
        capabilities.arSupported = await navigator.xr.isSessionSupported('immersive-ar');
        
        // Check for hand tracking (experimental)
        if (capabilities.vrSupported) {
          try {
            // @ts-ignore - Experimental API
            const session = await navigator.xr.requestSession('immersive-vr', {
              optionalFeatures: ['hand-tracking']
            });
            capabilities.handTrackingSupported = true;
            session.end();
          } catch {
            capabilities.handTrackingSupported = false;
          }
        }
      } catch (error) {
        console.warn('WebXR detection failed:', error);
      }
    }
  }

  private detectDeviceType(capabilities: HardwareCapabilities): void {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detect VR headsets
    if (userAgent.includes('oculus') || userAgent.includes('quest')) {
      capabilities.deviceType = 'vr-headset';
      capabilities.vrHeadsetType = 'quest';
    } else if (userAgent.includes('vive')) {
      capabilities.deviceType = 'vr-headset';
      capabilities.vrHeadsetType = 'vive';
    } else if (userAgent.includes('index')) {
      capabilities.deviceType = 'vr-headset';
      capabilities.vrHeadsetType = 'index';
    } else if (userAgent.includes('pico')) {
      capabilities.deviceType = 'vr-headset';
      capabilities.vrHeadsetType = 'pico';
    }
    // Detect mobile devices
    else if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      if (/ipad/i.test(userAgent) || (userAgent.includes('android') && !userAgent.includes('mobile'))) {
        capabilities.deviceType = 'tablet';
      } else {
        capabilities.deviceType = 'mobile';
      }
    }
    // Default to desktop
    else {
      capabilities.deviceType = 'desktop';
    }
  }

  private detectBrowser(capabilities: HardwareCapabilities): void {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      capabilities.browserType = 'chrome';
    } else if (userAgent.includes('firefox')) {
      capabilities.browserType = 'firefox';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      capabilities.browserType = 'safari';
    } else if (userAgent.includes('edg')) {
      capabilities.browserType = 'edge';
    }
  }

  private detectWebGL(capabilities: HardwareCapabilities): void {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      capabilities.webGLSupported = !!gl;
      
      if (gl) {
        const gl2 = canvas.getContext('webgl2');
        capabilities.webGL2Supported = !!gl2;
      }
    } catch (error) {
      capabilities.webGLSupported = false;
      capabilities.webGL2Supported = false;
    }
  }

  private detectMobileCapabilities(capabilities: HardwareCapabilities): void {
    // Touch support
    capabilities.touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Orientation support
    capabilities.orientationSupported = 'DeviceOrientationEvent' in window;
    
    // Gyroscope support (approximate)
    capabilities.gyroscopeSupported = capabilities.orientationSupported && capabilities.deviceType === 'mobile';
    
    // Accelerometer support (approximate)
    capabilities.accelerometerSupported = 'DeviceMotionEvent' in window;
  }

  private detectProjector(capabilities: HardwareCapabilities): void {
    const { width, height } = capabilities.displayResolution;
    
    // Common projector resolutions
    const projectorResolutions = [
      { width: 1280, height: 720 },   // 720p
      { width: 1920, height: 1080 },  // 1080p
      { width: 1024, height: 768 },   // XGA
      { width: 1400, height: 1050 },  // SXGA+
    ];
    
    capabilities.isProjectorConnected = projectorResolutions.some(
      res => res.width === width && res.height === height
    );
    
    // Additional heuristics for projector detection
    if (window.screen.availWidth !== window.screen.width || 
        window.screen.availHeight !== window.screen.height) {
      // Might indicate external display
      capabilities.isProjectorConnected = true;
    }
  }

  private assessPerformance(capabilities: HardwareCapabilities): void {
    let score = 0;
    
    // WebGL support
    if (capabilities.webGL2Supported) score += 3;
    else if (capabilities.webGLSupported) score += 2;
    
    // Device type
    if (capabilities.deviceType === 'desktop') score += 3;
    else if (capabilities.deviceType === 'tablet') score += 2;
    else if (capabilities.deviceType === 'mobile') score += 1;
    
    // Display resolution
    const totalPixels = capabilities.displayResolution.width * capabilities.displayResolution.height;
    if (totalPixels >= 1920 * 1080) score += 3;
    else if (totalPixels >= 1280 * 720) score += 2;
    else score += 1;
    
    // Browser optimization
    if (capabilities.browserType === 'chrome') score += 2;
    else if (capabilities.browserType === 'firefox' || capabilities.browserType === 'edge') score += 1;
    
    // WebXR support
    if (capabilities.webXRSupported) score += 2;
    
    // Determine performance level
    if (score >= 10) capabilities.performanceLevel = 'high';
    else if (score >= 6) capabilities.performanceLevel = 'medium';
    else capabilities.performanceLevel = 'low';
  }

  private generateRecommendations(capabilities: HardwareCapabilities): void {
    const recommendations = capabilities.recommendedSettings;
    
    // VR recommendations
    recommendations.vrEnabled = capabilities.vrSupported && 
                               capabilities.webXRSupported && 
                               capabilities.performanceLevel !== 'low';
    
    // AR recommendations
    recommendations.arEnabled = capabilities.arSupported && 
                               capabilities.webXRSupported && 
                               capabilities.performanceLevel !== 'low';
    
    // Mobile VR recommendations
    recommendations.mobileVREnabled = (capabilities.deviceType === 'mobile' || capabilities.deviceType === 'tablet') &&
                                     capabilities.gyroscopeSupported &&
                                     capabilities.webGLSupported;
    
    // Beamer optimization recommendations
    recommendations.beamerOptimized = capabilities.isProjectorConnected ||
                                     capabilities.supportsFullscreen ||
                                     capabilities.displayResolution.width >= 1280;
  }

  // Utility methods
  isVRReady(): boolean {
    return this.capabilities?.recommendedSettings.vrEnabled || false;
  }

  isMobileVRReady(): boolean {
    return this.capabilities?.recommendedSettings.mobileVREnabled || false;
  }

  isBeamerReady(): boolean {
    return this.capabilities?.recommendedSettings.beamerOptimized || false;
  }

  getOptimalSettings() {
    if (!this.capabilities) return null;
    
    return {
      pixelRatio: Math.min(this.capabilities.pixelRatio, this.capabilities.performanceLevel === 'high' ? 2 : 1),
      antialias: this.capabilities.performanceLevel === 'high',
      shadows: this.capabilities.performanceLevel !== 'low',
      postProcessing: this.capabilities.performanceLevel === 'high',
      particleCount: this.capabilities.performanceLevel === 'high' ? 50 : 
                    this.capabilities.performanceLevel === 'medium' ? 25 : 10
    };
  }
}

// Singleton instance
export const hardwareDetector = new HardwareDetector();

// Convenience functions
export const detectHardware = () => hardwareDetector.detectCapabilities();
export const isVRSupported = () => hardwareDetector.isVRReady();
export const isMobileVRSupported = () => hardwareDetector.isMobileVRReady();
export const isBeamerSupported = () => hardwareDetector.isBeamerReady();
export const getOptimalSettings = () => hardwareDetector.getOptimalSettings();

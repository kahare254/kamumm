// Browser Compatibility Layer for VR and Beamer Features

export interface BrowserFeatures {
  webXR: boolean;
  webGL: boolean;
  webGL2: boolean;
  fullscreen: boolean;
  deviceOrientation: boolean;
  gamepad: boolean;
  mediaDevices: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  performanceObserver: boolean;
}

export interface BrowserInfo {
  name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  version: number;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  features: BrowserFeatures;
}

class BrowserCompatibilityManager {
  private browserInfo: BrowserInfo | null = null;

  getBrowserInfo(): BrowserInfo {
    if (this.browserInfo) {
      return this.browserInfo;
    }

    const userAgent = navigator.userAgent;
    const browserInfo: BrowserInfo = {
      name: 'unknown',
      version: 0,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      features: this.detectFeatures()
    };

    // Detect browser name and version
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserInfo.name = 'chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 0;
    } else if (userAgent.includes('Firefox')) {
      browserInfo.name = 'firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 0;
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserInfo.name = 'safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 0;
    } else if (userAgent.includes('Edg')) {
      browserInfo.name = 'edge';
      const match = userAgent.match(/Edg\/(\d+)/);
      browserInfo.version = match ? parseInt(match[1]) : 0;
    }

    this.browserInfo = browserInfo;
    return browserInfo;
  }

  private detectFeatures(): BrowserFeatures {
    return {
      webXR: 'xr' in navigator,
      webGL: this.hasWebGL(),
      webGL2: this.hasWebGL2(),
      fullscreen: 'requestFullscreen' in document.documentElement,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      gamepad: 'getGamepads' in navigator,
      mediaDevices: 'mediaDevices' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      performanceObserver: 'PerformanceObserver' in window
    };
  }

  private hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private hasWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch {
      return false;
    }
  }

  // WebXR Polyfills and Fallbacks
  async initializeWebXR(): Promise<boolean> {
    const browserInfo = this.getBrowserInfo();
    
    // Load WebXR polyfill for browsers that need it
    if (!browserInfo.features.webXR) {
      try {
        const WebXRPolyfill = await import('webxr-polyfill');
        new WebXRPolyfill.default();
        return true;
      } catch (error) {
        console.warn('Failed to load WebXR polyfill:', error);
        return false;
      }
    }
    
    return browserInfo.features.webXR;
  }

  // Device Orientation Permissions (iOS 13+)
  async requestDeviceOrientationPermission(): Promise<boolean> {
    const browserInfo = this.getBrowserInfo();
    
    if (browserInfo.isIOS && browserInfo.name === 'safari' && browserInfo.version >= 13) {
      try {
        // @ts-ignore - iOS specific API
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          // @ts-ignore
          const permission = await DeviceOrientationEvent.requestPermission();
          return permission === 'granted';
        }
      } catch (error) {
        console.warn('Device orientation permission request failed:', error);
        return false;
      }
    }
    
    return browserInfo.features.deviceOrientation;
  }

  // Fullscreen API Compatibility
  async requestFullscreen(element: HTMLElement): Promise<boolean> {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ('webkitRequestFullscreen' in element) {
        // @ts-ignore - Safari compatibility
        await element.webkitRequestFullscreen();
      } else if ('mozRequestFullScreen' in element) {
        // @ts-ignore - Firefox compatibility
        await element.mozRequestFullScreen();
      } else if ('msRequestFullscreen' in element) {
        // @ts-ignore - IE/Edge compatibility
        await element.msRequestFullscreen();
      } else {
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
      return false;
    }
  }

  async exitFullscreen(): Promise<boolean> {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ('webkitExitFullscreen' in document) {
        // @ts-ignore - Safari compatibility
        await document.webkitExitFullscreen();
      } else if ('mozCancelFullScreen' in document) {
        // @ts-ignore - Firefox compatibility
        await document.mozCancelFullScreen();
      } else if ('msExitFullscreen' in document) {
        // @ts-ignore - IE/Edge compatibility
        await document.msExitFullscreen();
      } else {
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
      return false;
    }
  }

  // Performance Optimizations by Browser
  getOptimizedSettings() {
    const browserInfo = this.getBrowserInfo();
    
    const baseSettings = {
      antialias: true,
      shadows: true,
      postProcessing: true,
      particleCount: 50,
      maxLights: 8,
      shadowMapSize: 2048
    };

    // Browser-specific optimizations
    switch (browserInfo.name) {
      case 'chrome':
        // Chrome handles WebGL very well
        return {
          ...baseSettings,
          antialias: true,
          shadows: true,
          postProcessing: true,
          particleCount: browserInfo.isMobile ? 25 : 50
        };

      case 'firefox':
        // Firefox is good but slightly more conservative
        return {
          ...baseSettings,
          antialias: !browserInfo.isMobile,
          shadows: !browserInfo.isMobile,
          postProcessing: !browserInfo.isMobile,
          particleCount: browserInfo.isMobile ? 15 : 35,
          shadowMapSize: browserInfo.isMobile ? 1024 : 2048
        };

      case 'safari':
        // Safari needs more conservative settings, especially on mobile
        return {
          ...baseSettings,
          antialias: false,
          shadows: !browserInfo.isMobile,
          postProcessing: false,
          particleCount: browserInfo.isMobile ? 10 : 25,
          maxLights: browserInfo.isMobile ? 4 : 6,
          shadowMapSize: 1024
        };

      case 'edge':
        // Edge is similar to Chrome but slightly more conservative
        return {
          ...baseSettings,
          antialias: !browserInfo.isMobile,
          shadows: true,
          postProcessing: !browserInfo.isMobile,
          particleCount: browserInfo.isMobile ? 20 : 40
        };

      default:
        // Conservative defaults for unknown browsers
        return {
          ...baseSettings,
          antialias: false,
          shadows: false,
          postProcessing: false,
          particleCount: 15,
          maxLights: 4,
          shadowMapSize: 1024
        };
    }
  }

  // Feature Detection and Polyfill Loading
  async loadRequiredPolyfills(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    const promises: Promise<any>[] = [];

    // WebXR Polyfill
    if (!browserInfo.features.webXR) {
      promises.push(this.initializeWebXR());
    }

    // Intersection Observer Polyfill
    if (!browserInfo.features.intersectionObserver) {
      promises.push(
        import('intersection-observer').catch(() => {
          console.warn('Failed to load IntersectionObserver polyfill');
        })
      );
    }

    // Resize Observer Polyfill
    if (!browserInfo.features.resizeObserver) {
      promises.push(
        import('resize-observer-polyfill').then((module) => {
          if (!window.ResizeObserver) {
            window.ResizeObserver = module.default;
          }
        }).catch(() => {
          console.warn('Failed to load ResizeObserver polyfill');
        })
      );
    }

    await Promise.allSettled(promises);
  }

  // Browser-specific VR/AR compatibility checks
  isVRCompatible(): boolean {
    const browserInfo = this.getBrowserInfo();
    
    // Chrome and Edge have the best WebXR support
    if (browserInfo.name === 'chrome' && browserInfo.version >= 79) return true;
    if (browserInfo.name === 'edge' && browserInfo.version >= 79) return true;
    
    // Firefox has experimental WebXR support
    if (browserInfo.name === 'firefox' && browserInfo.version >= 98) return true;
    
    // Safari has limited WebXR support
    if (browserInfo.name === 'safari' && browserInfo.version >= 15) return true;
    
    return false;
  }

  isBeamerCompatible(): boolean {
    const browserInfo = this.getBrowserInfo();
    
    // All modern browsers support fullscreen and high-resolution displays
    return browserInfo.features.fullscreen && browserInfo.features.webGL;
  }

  isMobileVRCompatible(): boolean {
    const browserInfo = this.getBrowserInfo();
    
    return browserInfo.isMobile && 
           browserInfo.features.deviceOrientation && 
           browserInfo.features.webGL;
  }

  // Error handling and fallback strategies
  getVRFallbackStrategy(): 'mobile-vr' | 'desktop-3d' | 'none' {
    const browserInfo = this.getBrowserInfo();
    
    if (this.isVRCompatible()) return 'none'; // No fallback needed
    if (this.isMobileVRCompatible()) return 'mobile-vr';
    if (browserInfo.features.webGL) return 'desktop-3d';
    
    return 'none';
  }
}

// Singleton instance
export const browserCompatibility = new BrowserCompatibilityManager();

// Convenience functions
export const getBrowserInfo = () => browserCompatibility.getBrowserInfo();
export const initializeWebXR = () => browserCompatibility.initializeWebXR();
export const requestDeviceOrientation = () => browserCompatibility.requestDeviceOrientationPermission();
export const requestFullscreen = (element: HTMLElement) => browserCompatibility.requestFullscreen(element);
export const exitFullscreen = () => browserCompatibility.exitFullscreen();
export const getOptimizedSettings = () => browserCompatibility.getOptimizedSettings();
export const loadPolyfills = () => browserCompatibility.loadRequiredPolyfills();
export const isVRCompatible = () => browserCompatibility.isVRCompatible();
export const isBeamerCompatible = () => browserCompatibility.isBeamerCompatible();
export const isMobileVRCompatible = () => browserCompatibility.isMobileVRCompatible();

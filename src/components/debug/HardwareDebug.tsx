import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { detectHardware, HardwareCapabilities } from '@/utils/hardwareDetection';
import { getBrowserInfo, BrowserInfo } from '@/utils/browserCompatibility';

export const HardwareDebug: React.FC = () => {
  const [hardware, setHardware] = useState<HardwareCapabilities | null>(null);
  const [browser, setBrowser] = useState<BrowserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDetection = async () => {
    setIsLoading(true);
    try {
      const hardwareInfo = await detectHardware();
      const browserInfo = getBrowserInfo();
      setHardware(hardwareInfo);
      setBrowser(browserInfo);
    } catch (error) {
      console.error('Hardware detection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDetection();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Detecting hardware capabilities...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hardware Detection Debug</h2>
        <Button onClick={runDetection} className="mb-4">
          Refresh Detection
        </Button>

        {browser && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Browser Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Browser:</strong> {browser.name} v{browser.version}
              </div>
              <div>
                <strong>Device Type:</strong> {browser.isMobile ? 'Mobile' : 'Desktop'}
              </div>
              <div>
                <strong>iOS:</strong> {browser.isIOS ? '✅' : '❌'}
              </div>
              <div>
                <strong>Android:</strong> {browser.isAndroid ? '✅' : '❌'}
              </div>
            </div>

            <h4 className="font-semibold mt-4 mb-2">Browser Features</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>WebXR: {browser.features.webXR ? '✅' : '❌'}</div>
              <div>WebGL: {browser.features.webGL ? '✅' : '❌'}</div>
              <div>WebGL2: {browser.features.webGL2 ? '✅' : '❌'}</div>
              <div>Fullscreen: {browser.features.fullscreen ? '✅' : '❌'}</div>
              <div>Device Orientation: {browser.features.deviceOrientation ? '✅' : '❌'}</div>
              <div>Gamepad: {browser.features.gamepad ? '✅' : '❌'}</div>
            </div>
          </div>
        )}

        {hardware && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Hardware Capabilities</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <strong>Device Type:</strong> {hardware.deviceType}
              </div>
              <div>
                <strong>VR Headset:</strong> {hardware.vrHeadsetType || 'None detected'}
              </div>
              <div>
                <strong>Performance Level:</strong> {hardware.performanceLevel}
              </div>
              <div>
                <strong>Projector Connected:</strong> {hardware.isProjectorConnected ? '✅' : '❌'}
              </div>
            </div>

            <h4 className="font-semibold mb-2">VR/AR Support</h4>
            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
              <div>WebXR: {hardware.webXRSupported ? '✅' : '❌'}</div>
              <div>VR: {hardware.vrSupported ? '✅' : '❌'}</div>
              <div>AR: {hardware.arSupported ? '✅' : '❌'}</div>
              <div>Hand Tracking: {hardware.handTrackingSupported ? '✅' : '❌'}</div>
            </div>

            <h4 className="font-semibold mb-2">Mobile Capabilities</h4>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>Gyroscope: {hardware.gyroscopeSupported ? '✅' : '❌'}</div>
              <div>Accelerometer: {hardware.accelerometerSupported ? '✅' : '❌'}</div>
              <div>Orientation: {hardware.orientationSupported ? '✅' : '❌'}</div>
              <div>Touch: {hardware.touchSupported ? '✅' : '❌'}</div>
            </div>

            <h4 className="font-semibold mb-2">Display Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>Resolution: {hardware.displayResolution.width}x{hardware.displayResolution.height}</div>
              <div>Pixel Ratio: {hardware.pixelRatio}</div>
              <div>Fullscreen Support: {hardware.supportsFullscreen ? '✅' : '❌'}</div>
            </div>

            <h4 className="font-semibold mb-2">Recommendations</h4>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>VR Enabled: {hardware.recommendedSettings.vrEnabled ? '✅' : '❌'}</div>
              <div>AR Enabled: {hardware.recommendedSettings.arEnabled ? '✅' : '❌'}</div>
              <div>Mobile VR: {hardware.recommendedSettings.mobileVREnabled ? '✅' : '❌'}</div>
              <div>Beamer Optimized: {hardware.recommendedSettings.beamerOptimized ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Test Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feature Tests</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              if ('xr' in navigator) {
                navigator.xr?.isSessionSupported('immersive-vr').then(supported => {
                  alert(`VR Support: ${supported ? 'Available' : 'Not Available'}`);
                });
              } else {
                alert('WebXR not available in this browser');
              }
            }}
          >
            Test VR Support
          </Button>

          <Button
            onClick={() => {
              if ('DeviceOrientationEvent' in window) {
                const handler = (event: DeviceOrientationEvent) => {
                  alert(`Gyroscope: α=${event.alpha?.toFixed(1)}, β=${event.beta?.toFixed(1)}, γ=${event.gamma?.toFixed(1)}`);
                  window.removeEventListener('deviceorientation', handler);
                };
                window.addEventListener('deviceorientation', handler);
                setTimeout(() => {
                  window.removeEventListener('deviceorientation', handler);
                  alert('No gyroscope data received');
                }, 3000);
              } else {
                alert('Device orientation not supported');
              }
            }}
          >
            Test Gyroscope
          </Button>

          <Button
            onClick={async () => {
              try {
                await document.documentElement.requestFullscreen();
                setTimeout(() => {
                  document.exitFullscreen();
                }, 2000);
              } catch (error) {
                alert(`Fullscreen failed: ${error}`);
              }
            }}
          >
            Test Fullscreen
          </Button>

          <Button
            onClick={() => {
              const canvas = document.createElement('canvas');
              const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
              if (gl) {
                const info = gl.getExtension('WEBGL_debug_renderer_info');
                const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'Unknown';
                alert(`WebGL Renderer: ${renderer}`);
              } else {
                alert('WebGL not supported');
              }
            }}
          >
            Test WebGL
          </Button>
        </div>
      </Card>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { XR, Controllers, Hands, useXR } from '@react-three/xr';
import * as THREE from 'three';

// WebXR support detection - polyfill will be loaded dynamically if needed

interface WebXRManagerProps {
  children: React.ReactNode;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export const WebXRManager: React.FC<WebXRManagerProps> = ({ 
  children, 
  onSessionStart, 
  onSessionEnd 
}) => {
  const { gl, scene, camera } = useThree();
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const sessionRef = useRef<XRSession | null>(null);

  useEffect(() => {
    // Check WebXR support
    const checkXRSupport = async () => {
      if ('xr' in navigator) {
        try {
          const vrSupported = await navigator.xr!.isSessionSupported('immersive-vr');
          const arSupported = await navigator.xr!.isSessionSupported('immersive-ar');
          setIsVRSupported(vrSupported);
          setIsARSupported(arSupported);
        } catch (error) {
          console.warn('WebXR support check failed:', error);
        }
      }
    };

    checkXRSupport();
  }, []);

  useEffect(() => {
    // Configure WebXR
    if (gl.xr) {
      gl.xr.enabled = true;
      
      // Set up session event listeners
      const onSessionStart = () => {
        sessionRef.current = gl.xr.getSession();
        onSessionStart?.();
      };

      const onSessionEnd = () => {
        sessionRef.current = null;
        onSessionEnd?.();
      };

      gl.xr.addEventListener('sessionstart', onSessionStart);
      gl.xr.addEventListener('sessionend', onSessionEnd);

      return () => {
        gl.xr.removeEventListener('sessionstart', onSessionStart);
        gl.xr.removeEventListener('sessionend', onSessionEnd);
      };
    }
  }, [gl, onSessionStart, onSessionEnd]);

  return (
    <>
      {children}
      <Controllers />
      <Hands />
    </>
  );
};

// VR Controller Component for hand tracking and interactions
export const VRControllers: React.FC = () => {
  const { controllers } = useXR();
  
  useFrame(() => {
    controllers.forEach((controller, index) => {
      if (controller.grip) {
        // Handle controller grip interactions
        const grip = controller.grip;
        // Add haptic feedback, gesture recognition, etc.
      }
    });
  });

  return (
    <>
      {controllers.map((controller, index) => (
        <group key={index}>
          {/* Controller visualization */}
          <mesh position={controller.grip?.position || [0, 0, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
        </group>
      ))}
    </>
  );
};

// 360° Movement System
export const VRMovementSystem: React.FC = () => {
  const { camera } = useThree();
  const { controllers } = useXR();
  const moveSpeed = useRef(2.0);
  const rotationSpeed = useRef(1.0);

  useFrame((state, delta) => {
    controllers.forEach((controller) => {
      if (controller.inputSource?.gamepad) {
        const gamepad = controller.inputSource.gamepad;
        
        // Thumbstick movement (if available)
        if (gamepad.axes.length >= 2) {
          const x = gamepad.axes[0];
          const y = gamepad.axes[1];
          
          if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
            // Calculate movement direction based on camera orientation
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            
            // Forward/backward movement
            const forward = direction.clone().multiplyScalar(-y * moveSpeed.current * delta);
            // Strafe movement
            const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
            const strafe = right.multiplyScalar(x * moveSpeed.current * delta);
            
            // Apply movement
            camera.position.add(forward).add(strafe);
          }
        }
        
        // Rotation with second thumbstick (if available)
        if (gamepad.axes.length >= 4) {
          const rotX = gamepad.axes[2];
          const rotY = gamepad.axes[3];
          
          if (Math.abs(rotX) > 0.1) {
            camera.rotateY(-rotX * rotationSpeed.current * delta);
          }
          
          if (Math.abs(rotY) > 0.1) {
            camera.rotateX(-rotY * rotationSpeed.current * delta);
          }
        }
      }
    });
  });

  return null;
};

// Teleportation System for VR
export const VRTeleportation: React.FC = () => {
  const { scene, camera, raycaster } = useThree();
  const { controllers } = useXR();
  const [teleportTarget, setTeleportTarget] = useState<THREE.Vector3 | null>(null);

  useFrame(() => {
    controllers.forEach((controller) => {
      if (controller.inputSource?.gamepad) {
        const gamepad = controller.inputSource.gamepad;
        
        // Check for teleport button press (typically trigger or A button)
        if (gamepad.buttons[0]?.pressed) {
          // Cast ray from controller
          const controllerPosition = new THREE.Vector3();
          const controllerDirection = new THREE.Vector3(0, 0, -1);
          
          if (controller.grip) {
            controller.grip.getWorldPosition(controllerPosition);
            controller.grip.getWorldDirection(controllerDirection);
            
            raycaster.set(controllerPosition, controllerDirection);
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            if (intersects.length > 0) {
              setTeleportTarget(intersects[0].point);
            }
          }
        }
        
        // Execute teleportation on button release
        if (gamepad.buttons[0]?.value === 0 && teleportTarget) {
          camera.position.copy(teleportTarget);
          camera.position.y += 1.6; // Average eye height
          setTeleportTarget(null);
        }
      }
    });
  });

  return teleportTarget ? (
    <mesh position={teleportTarget}>
      <cylinderGeometry args={[0.5, 0.5, 0.1]} />
      <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
    </mesh>
  ) : null;
};

// Hardware Detection Hook
export const useVRHardware = () => {
  const [hardware, setHardware] = useState({
    isVRSupported: false,
    isARSupported: false,
    hasControllers: false,
    hasHandTracking: false,
    deviceType: 'unknown' as 'quest' | 'vive' | 'index' | 'pico' | 'unknown'
  });

  useEffect(() => {
    const detectHardware = async () => {
      if ('xr' in navigator) {
        try {
          const vrSupported = await navigator.xr!.isSessionSupported('immersive-vr');
          const arSupported = await navigator.xr!.isSessionSupported('immersive-ar');
          
          setHardware(prev => ({
            ...prev,
            isVRSupported: vrSupported,
            isARSupported: arSupported
          }));

          // Detect device type based on user agent or WebXR features
          const userAgent = navigator.userAgent.toLowerCase();
          let deviceType: typeof hardware.deviceType = 'unknown';
          
          if (userAgent.includes('oculus') || userAgent.includes('quest')) {
            deviceType = 'quest';
          } else if (userAgent.includes('vive')) {
            deviceType = 'vive';
          } else if (userAgent.includes('index')) {
            deviceType = 'index';
          } else if (userAgent.includes('pico')) {
            deviceType = 'pico';
          }
          
          setHardware(prev => ({ ...prev, deviceType }));
        } catch (error) {
          console.warn('Hardware detection failed:', error);
        }
      }
    };

    detectHardware();
  }, []);

  return hardware;
};

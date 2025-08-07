import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { MemorialData } from '../memorial/MemorialCard';
import * as THREE from 'three';

interface GLBMemorialModelProps {
  memorial: MemorialData;
  scale?: number;
}

export const GLBMemorialModel: React.FC<GLBMemorialModelProps> = ({ memorial, scale = 1 }) => {
  const group = useRef<THREE.Group>();
  const { scene, animations } = useGLTF(`/models/memorial-gate-${memorial.cardType}.glb`);
  const mixer = useRef<THREE.AnimationMixer>();

  useEffect(() => {
    if (animations.length && scene) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.play();
      });
    }
    return () => mixer.current?.stopAllAction();
  }, [animations, scene]);

  useEffect(() => {
    if (mixer.current) {
      mixer.current.timeScale = 1; // Adjust animation speed if needed
    }
  }, [memorial.cardType]);

  // Update the mixer on each frame
  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive object={scene} ref={group} scale={[scale, scale, scale]} />;
};

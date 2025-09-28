'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Avatar3DProps {
  name: string;
  wins: number;
  losses: number;
  className?: string;
  interactive?: boolean;
}

// 3D Fighter Avatar Component
function FighterAvatar({ name, wins, losses }: { name: string; wins: number; losses: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const winPercentage = wins / (wins + losses);
  const avatarColor = useMemo(() => {
    if (winPercentage > 0.8) return '#00ff88'; // Green for high win rate
    if (winPercentage > 0.6) return '#00ccff'; // Blue for good win rate
    if (winPercentage > 0.4) return '#ffaa00'; // Orange for average
    return '#ff3366'; // Red for low win rate
  }, [winPercentage]);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      // Slow rotation
      groupRef.current.rotation.y += 0.005;
      
      // Pulsing effect based on wins
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <group ref={groupRef}>
      {/* Main Avatar Sphere */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={avatarColor}
          emissive={avatarColor}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {/* Glow Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial 
          color={avatarColor} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Fighter Initials */}
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron-bold.woff"
      >
        {initials}
      </Text>
      
      {/* Stats Orbiting Elements */}
      {Array.from({ length: wins }, (_, i) => (
        <Sphere key={`win-${i}`} args={[0.05]} position={[
          Math.cos((i / wins) * Math.PI * 2) * 2,
          Math.sin((i / wins) * Math.PI * 2) * 2,
          0
        ]}>
          <meshBasicMaterial color="#00ff88" />
        </Sphere>
      ))}
      
      {Array.from({ length: losses }, (_, i) => (
        <Sphere key={`loss-${i}`} args={[0.05]} position={[
          Math.cos((i / losses) * Math.PI * 2) * 2.5,
          Math.sin((i / losses) * Math.PI * 2) * 2.5,
          0
        ]}>
          <meshBasicMaterial color="#ff3366" />
        </Sphere>
      ))}
      
      {/* Ambient Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Sphere key={`particle-${i}`} args={[0.02]} position={[
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ]}>
          <meshBasicMaterial 
            color={avatarColor} 
            transparent 
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
}

export function Avatar3D({ name, wins, losses, className = '', interactive = true }: Avatar3DProps) {
  return (
    <motion.div 
      className={`w-full h-64 rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={interactive ? { scale: 1.05 } : {}}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ccff" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1}
          color="#ffffff"
        />
        
        {/* 3D Avatar */}
        <FighterAvatar name={name} wins={wins} losses={losses} />
        
        {/* Controls for interaction */}
        {interactive && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </motion.div>
  );
}

// Holographic Fighter Display
export function HolographicDisplay({ 
  name, 
  wins, 
  losses, 
  className = '' 
}: Avatar3DProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Holographic Base */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-2xl" />
      
      {/* Scan Lines */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ top: `${i * 10}%` }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}
      </div>
      
      {/* 3D Avatar */}
      <Avatar3D 
        name={name} 
        wins={wins} 
        losses={losses} 
        interactive={false}
      />
      
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-600/10 rounded-2xl" />
      
      {/* Corner Elements */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />
    </div>
  );
}
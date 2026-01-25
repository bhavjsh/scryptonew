import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Morphing geometry that transitions between shapes
function MorphingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);

  const shapes = useMemo(() => [
    { type: 'icosahedron', args: [1, 1] },
    { type: 'dodecahedron', args: [1, 0] },
    { type: 'octahedron', args: [1, 0] },
    { type: 'tetrahedron', args: [1, 0] },
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [shapes.length]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Pulsing scale effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(2 * pulse);
    }
    
    // Smooth morph transition
    setMorphProgress((state.clock.elapsedTime % 3) / 3);
  });

  const currentShape = shapes[shapeIndex];

  const getGeometry = () => {
    switch (currentShape.type) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 2]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 1]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 1]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 1]} />;
      default:
        return <icosahedronGeometry args={[1, 2]} />;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        {getGeometry()}
        <MeshDistortMaterial
          color="#00e5ff"
          attach="material"
          distort={0.4 + morphProgress * 0.2}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive="#00e5ff"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

// Secondary floating shapes
function FloatingOrbitals() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbitals = useMemo(() => [
    { position: [3, 0, 0], scale: 0.3, speed: 1, color: '#ff00ff' },
    { position: [-3, 0, 0], scale: 0.25, speed: 1.2, color: '#00e5ff' },
    { position: [0, 3, 0], scale: 0.2, speed: 0.8, color: '#ff00ff' },
    { position: [0, -3, 0], scale: 0.35, speed: 1.5, color: '#00e5ff' },
    { position: [2, 2, 0], scale: 0.15, speed: 2, color: '#ff00ff' },
    { position: [-2, -2, 0], scale: 0.2, speed: 1.8, color: '#00e5ff' },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {orbitals.map((orbital, index) => (
        <Float key={index} speed={orbital.speed} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={orbital.position as [number, number, number]} scale={orbital.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <MeshWobbleMaterial
              color={orbital.color}
              factor={0.4}
              speed={2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Enhanced particles with trails
function EnhancedParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 8 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Gradient colors from cyan to magenta
      const t = Math.random();
      colors[i3] = t * 1 + (1 - t) * 0;     // R
      colors[i3 + 1] = (1 - t) * 0.9;        // G
      colors[i3 + 2] = t * 1 + (1 - t) * 1;  // B
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Connecting lines between shapes
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const points: number[] = [];
    const lineCount = 20;
    
    for (let i = 0; i < lineCount; i++) {
      const angle1 = (i / lineCount) * Math.PI * 2;
      const angle2 = ((i + 1) / lineCount) * Math.PI * 2;
      const radius = 4;
      
      points.push(
        Math.cos(angle1) * radius, Math.sin(angle1) * radius * 0.3, Math.sin(angle1) * radius,
        Math.cos(angle2) * radius, Math.sin(angle2) * radius * 0.3, Math.sin(angle2) * radius
      );
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.2} />
    </lineSegments>
  );
}

export function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00e5ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff00ff" />
          <pointLight position={[0, 10, 5]} intensity={0.5} color="#ffffff" />
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            color="#00e5ff"
          />
          
          {/* 3D Elements */}
          <MorphingShape />
          <FloatingOrbitals />
          <EnhancedParticles />
          <ConnectionLines />
          
          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

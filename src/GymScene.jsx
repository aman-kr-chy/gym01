import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';

function Dumbbell() {
  const group = useRef();
  useFrame(({ clock }, delta) => { if (group.current) { group.current.rotation.y += delta * 0.12; group.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.06; } });
  return <group ref={group} rotation={[0.16, 0, -0.35]}>
    <mesh castShadow><cylinderGeometry args={[0.09, 0.09, 2.6, 32]}/><meshStandardMaterial color="#b7b7b2" metalness={0.94} roughness={0.18}/></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 1.04, 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.7, 0.7, 0.24, 48]}/><meshStandardMaterial color="#17191a" metalness={0.82} roughness={0.28}/></mesh>
      <mesh position={[side * 0.22, 0, 0]} castShadow><cylinderGeometry args={[0.57, 0.57, 0.18, 48]}/><meshStandardMaterial color="#292b2b" metalness={0.8} roughness={0.3}/></mesh>
      <mesh position={[0, 0, 0.14]}><cylinderGeometry args={[0.22, 0.22, 0.012, 40]}/><meshStandardMaterial color="#ff5a1f" emissive="#f04a17" emissiveIntensity={0.18} metalness={0.4}/></mesh>
    </group>)}
    <mesh position={[0, 0, 0.075]}><cylinderGeometry args={[0.105, 0.105, 1.25, 32]}/><meshStandardMaterial color="#ff5a1f" metalness={0.55} roughness={0.24}/></mesh>
  </group>;
}

function Particles() {
  const points = useRef();
  const positions = useMemo(() => Float32Array.from({ length: 180 }, () => (Math.random() - 0.5) * 9), []);
  useFrame((_, delta) => { if (points.current) points.current.rotation.y += delta * 0.008; });
  return <points ref={points} position={[0, 0, -1]}><bufferGeometry><bufferAttribute attach="attributes-position" count={60} array={positions} itemSize={3}/></bufferGeometry><pointsMaterial color="#ff8c59" size={0.025} transparent opacity={0.7} sizeAttenuation/></points>;
}

function MachineFrame() {
  const bars = [[-1.85,-0.35,-0.8,0.08,2.6,0.08],[1.85,-0.35,-0.8,0.08,2.6,0.08],[-1.85,0.95,-0.8,3.78,0.08,0.08],[1.85,-0.35,-0.8,0.08,2.6,0.08],[-1.85,-0.35,-0.8,3.78,0.08,0.08]];
  return <group rotation={[0, 0.2, 0]}>{bars.map((b,i)=><mesh key={i} position={[b[0],b[1],b[2]]}><boxGeometry args={b.slice(3)}/><meshStandardMaterial color="#3c4141" metalness={0.84} roughness={0.35}/></mesh>)}<mesh position={[-1.36,0.1,-0.75]}><cylinderGeometry args={[0.25,0.25,0.16,32]}/><meshStandardMaterial color="#17191a" metalness={0.8}/></mesh><mesh position={[1.36,0.1,-0.75]}><cylinderGeometry args={[0.25,0.25,0.16,32]}/><meshStandardMaterial color="#17191a" metalness={0.8}/></mesh></group>;
}

export default function GymScene() {
  return <Canvas aria-label="Interactive 3D view of a dumbbell and gym equipment; drag to rotate" camera={{ position: [4.8, 2.8, 5.2], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={0.6}/><spotLight position={[3, 6, 4]} intensity={90} angle={0.4} penumbra={1} castShadow color="#fff0df"/><pointLight position={[-4, 1, -2]} intensity={25} color="#ff541b"/>
    <Environment preset="warehouse"/><Particles/><MachineFrame/><Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.28}><Dumbbell/></Float>
    <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={7} blur={2.6} far={3}/>
    <OrbitControls enablePan={false} minDistance={4.4} maxDistance={7.2} minPolarAngle={0.75} maxPolarAngle={2.15} autoRotate autoRotateSpeed={0.55}/>
  </Canvas>;
}

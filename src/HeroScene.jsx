import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Lifter } from './WorkoutScene.jsx';

function WeightPlate({ radius = 0.85, depth = 0.2, position = [0, 0, 0], accent = false, horizontal = false }) {
  return <group position={position} rotation={horizontal ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
    <mesh castShadow receiveShadow><cylinderGeometry args={[radius, radius, depth, 64]}/><meshStandardMaterial color="#171a1b" metalness={0.83} roughness={0.26}/></mesh>
    <mesh position={[0, depth / 2 + 0.008, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius * 0.72, 0.018, 10, 64]}/><meshStandardMaterial color={accent ? '#ff5a1f' : '#707170'} emissive={accent ? '#ff4010' : '#000000'} emissiveIntensity={accent ? 1.3 : 0} metalness={0.65} roughness={0.3}/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[radius * 0.17, radius * 0.17, depth + 0.03, 32]}/><meshStandardMaterial color="#090a0a" metalness={0.8} roughness={0.2}/></mesh>
    {[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2.094) * radius * 0.48, depth / 2 + 0.012, Math.sin(i * 2.094) * radius * 0.48]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.012, 16]}/><meshStandardMaterial color="#686a68" metalness={0.8}/></mesh>)}
  </group>;
}

function Barbell() {
  const bar = useRef();
  useFrame(({ clock }, delta) => { if (bar.current) { bar.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.025; bar.current.position.y = 0.32 + Math.sin(clock.elapsedTime * 1.1) * 0.07; bar.current.rotation.y += delta * 0.035; } });
  return <group ref={bar} rotation={[0.12, 0.1, -0.12]}>
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.055, 0.055, 4.3, 32]}/><meshStandardMaterial color="#c2c2bc" metalness={0.96} roughness={0.17}/></mesh>
    <mesh><cylinderGeometry args={[0.067, 0.067, 0.68, 32]}/><meshStandardMaterial color="#ff5a1f" metalness={0.63} roughness={0.24}/></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 1.45, 0, 0]}><WeightPlate radius={0.77} depth={0.3} accent horizontal/><WeightPlate radius={0.64} depth={0.24} position={[side * 0.3, 0, 0]} horizontal/><mesh position={[side * 0.62, 0, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.1, 0.1, 0.3, 32]}/><meshStandardMaterial color="#b9bab4" metalness={0.96}/></mesh></group>)}
  </group>;
}

function Rack() {
  const Steel = () => <meshStandardMaterial color="#25292a" metalness={0.86} roughness={0.24}/>;
  const uprights = [-2.2, 2.2].map((x, index) => <group key={index} position={[x, 0, -0.35]}>
    <mesh position={[0, 1.05, 0]} castShadow><boxGeometry args={[0.12, 2.45, 0.12]}/><Steel/></mesh>
    <mesh position={[0, 0.22, 0]} castShadow><boxGeometry args={[0.5, 0.09, 0.65]}/><Steel/></mesh>
    <mesh position={[0, 0.2, 0.02]}><boxGeometry args={[0.42, 0.035, 0.5]}/><meshStandardMaterial color="#ff5a1f" emissive="#ff4a17" emissiveIntensity={0.32}/></mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.075, 0.45 + i * 0.19, 0.075]}><sphereGeometry args={[0.027, 12, 12]}/><meshStandardMaterial color="#878984" metalness={0.8}/></mesh>)}
  </group>);
  return <group>{uprights}<mesh position={[0, 2.28, -0.35]} castShadow><boxGeometry args={[4.55, 0.13, 0.14]}/><Steel/></mesh><mesh position={[0, 0.38, -0.35]} castShadow><boxGeometry args={[4.5, 0.1, 0.12]}/><Steel/></mesh>
    {[-1.55, 1.55].map(x => <group key={x}><WeightPlate radius={0.64} depth={0.18} position={[x, 0.74, -0.54]} horizontal/><WeightPlate radius={0.52} depth={0.16} position={[x + 0.22, 0.74, -0.54]} horizontal/></group>)}
  </group>;
}

function FloorGrid() {
  return <group position={[0, -0.12, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 12]}/><meshStandardMaterial color="#151717" metalness={0.18} roughness={0.8}/></mesh>
    {Array.from({ length: 11 }, (_, i) => <mesh key={`x${i}`} position={[-5 + i, -0.001, 0]}><boxGeometry args={[0.008, 0.002, 11]}/><meshBasicMaterial color="#414342" transparent opacity={0.34}/></mesh>)}
    {Array.from({ length: 10 }, (_, i) => <mesh key={`z${i}`} position={[0, -0.001, -5 + i]}><boxGeometry args={[13, 0.002, 0.008]}/><meshBasicMaterial color="#414342" transparent opacity={0.34}/></mesh>)}
  </group>;
}

function Atmosphere() {
  const points = useRef();
  const positions = useMemo(() => { const p = new Float32Array(420); for (let i = 0; i < p.length; i += 3) { p[i] = (Math.random() - .5) * 8; p[i + 1] = Math.random() * 4; p[i + 2] = (Math.random() - .5) * 6; } return p; }, []);
  useFrame((_, delta) => { if (points.current) points.current.rotation.y += delta * 0.012; });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" count={140} array={positions} itemSize={3}/></bufferGeometry><pointsMaterial color="#ff915f" size={0.025} transparent opacity={0.72} sizeAttenuation/></points>;
}

function Rig() {
  const rig = useRef();
  useFrame(({ clock }) => { if (rig.current) rig.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.08; });
  return <group ref={rig}><Rack/></group>;
}

export default function HeroScene({ paused, exercise }) {
  return <Canvas aria-label="Interactive 3D power rack and barbell. Drag or swipe to rotate the view." camera={{ position: [5.1, 3.05, 7.4], fov: 36 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <ambientLight intensity={0.78}/><hemisphereLight intensity={0.55} groundColor="#151719" color="#f6e6d7"/>
    <spotLight position={[1.5, 7, 4]} intensity={125} angle={0.46} penumbra={0.9} castShadow color="#fff0df"/><spotLight position={[-5, 4, -2]} intensity={68} angle={0.58} penumbra={0.9} color="#ff571e"/><pointLight position={[4, 1.4, 1]} intensity={18} color="#ff632b"/>
    <Environment preset="warehouse"/><FloorGrid/><Atmosphere/><Rig/>
    <Lifter paused={paused} exercise={exercise} position={[0,0,0.16]}/>
    <Lifter paused={paused} exercise="Squat" position={[-1.8,0,-1.35]} scale={0.43}/>
    <Lifter paused={paused} exercise="Curl" position={[1.8,0,-1.55]} scale={0.43}/>
    <ContactShadows position={[0, -0.11, 0]} opacity={0.48} scale={11} blur={2.5} far={3}/>
    <OrbitControls enablePan={false} enableZoom={false} minAzimuthAngle={-0.82} maxAzimuthAngle={0.82} minPolarAngle={0.93} maxPolarAngle={1.7} autoRotate autoRotateSpeed={0.26} rotateSpeed={0.7} target={[0,1.22,0]}/>
  </Canvas>;
}

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';

const Suit = () => <meshStandardMaterial color="#292b2b" metalness={0.12} roughness={0.78}/>;
const Skin = () => <meshStandardMaterial color="#a9785d" metalness={0.06} roughness={0.62}/>;
const Top = () => <meshStandardMaterial color="#e94f1b" metalness={0.08} roughness={0.72}/>;

const mix = (a, b, t) => a.map((value, index) => value + (b[index] - value) * t);
function segment(mesh, start, end) {
  const a = mesh.userData.start.set(...start), b = mesh.userData.end.set(...end);
  const direction = b.clone().sub(a); mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(mesh.userData.up, direction.clone().normalize());
  mesh.scale.y = direction.length();
}

export function Lifter({ paused, exercise, position = [0, 0, 0], scale = 1 }) {
  const refs = useRef({});
  useFrame(({ clock }) => {
    if (paused || !refs.current.torso) return;
    const duration = exercise === 'Squat' ? 3.6 : exercise === 'Curl' ? 2.8 : 4.2;
    const t = (clock.getElapsedTime() % duration) / duration;
    const phase = t < 0.18 ? 0 : t < 0.52 ? (1 - Math.cos(((t - 0.18) / 0.34) * Math.PI)) / 2 : t < 0.66 ? 1 : t < 0.94 ? (1 + Math.cos(((t - 0.66) / 0.28) * Math.PI)) / 2 : 0;
    let hip, shoulder, knees, elbowNear, elbowFar, handNear, handFar, barY;
    if (exercise === 'Squat') {
      hip = [0, 1.82 - phase * 0.48, 0]; shoulder = [-phase * 0.1, 2.55 - phase * 0.08, 0];
      knees = [[-0.18, 0.78 - phase * 0.16, 0.3], [-0.18, 0.78 - phase * 0.16, -0.3]];
      elbowNear = [-0.62, 2.27 - phase * 0.06, 0.23]; elbowFar = [0.62, 2.27 - phase * 0.06, -0.23];
      handNear = [-0.85, 2.35 - phase * 0.04, 0.2]; handFar = [0.85, 2.35 - phase * 0.04, -0.2]; barY = 2.42;
    } else if (exercise === 'Curl') {
      hip = [0, 1.82, 0]; shoulder = [0, 2.52, 0];
      knees = [[0, 0.93, 0.3], [0, 0.93, -0.3]];
      elbowNear = [-0.34, 1.38, 0.22]; elbowFar = [0.34, 1.38, -0.22];
      handNear = [-0.42, 1.03 + phase * 0.68, 0.28]; handFar = [0.42, 1.03 + phase * 0.68, -0.28]; barY = 0.49;
    } else {
      hip = [0.12 + phase * 0.04, 1.38 + phase * 0.5, 0]; shoulder = mix([-0.43, 2.11, 0], [0.08, 2.62, 0], phase);
      knees = [[-0.2 + phase * 0.15, 0.78 + phase * 0.2, 0.3], [-0.2 + phase * 0.15, 0.78 + phase * 0.2, -0.3]];
      elbowNear = [-0.52 + phase * 0.18, 1.24 + phase * 0.07, 0.2]; elbowFar = [0.52 + phase * 0.18, 1.24 + phase * 0.07, -0.2];
      handNear = [-0.58, 0.49 + phase * 0.72, 0.28]; handFar = [0.58, 0.49 + phase * 0.72, -0.28]; barY = 0.49 + phase * 0.72;
    }
    const head = [shoulder[0] + 0.02, shoulder[1] + 0.24, 0];
    const ankles = [[0, 0.18, 0.3], [0, 0.18, -0.3]];
    const mesh = refs.current;
    segment(mesh.torso, hip, shoulder); segment(mesh.pelvis, [hip[0] - .26, hip[1] - .04, 0], [hip[0] + .26, hip[1] + .04, 0]);
    segment(mesh.armNear, [shoulder[0], shoulder[1], .16], elbowNear); segment(mesh.forearmNear, elbowNear, handNear);
    segment(mesh.armFar, [shoulder[0], shoulder[1], -.16], elbowFar); segment(mesh.forearmFar, elbowFar, handFar);
    segment(mesh.thighNear, hip, knees[0]); segment(mesh.shinNear, knees[0], ankles[0]);
    segment(mesh.thighFar, [hip[0], hip[1], -.3], knees[1]); segment(mesh.shinFar, knees[1], ankles[1]);
    mesh.head.position.set(...head); mesh.head.rotation.z = -phase * 0.13;
    mesh.handNear.position.set(...handNear); mesh.handFar.position.set(...handFar);
    mesh.elbowNear.position.set(...elbowNear); mesh.elbowFar.position.set(...elbowFar);
    mesh.kneeNear.position.set(...knees[0]); mesh.kneeFar.position.set(...knees[1]);
    mesh.bar.visible = exercise !== 'Curl'; mesh.bar.position.y = barY;
    mesh.dumbbellNear.visible = exercise === 'Curl'; mesh.dumbbellFar.visible = exercise === 'Curl';
    mesh.dumbbellNear.position.set(...handNear); mesh.dumbbellFar.position.set(...handFar);
    mesh.bar.rotation.z = Math.sin(clock.getElapsedTime() * 2.1) * 0.018;
    mesh.glow.material.opacity = 0.1 + phase * 0.18;
  });
  const bind = (name) => (mesh) => { if (mesh) { mesh.userData.start = mesh.userData.start || new Vector3(); mesh.userData.end = mesh.userData.end || new Vector3(); mesh.userData.up = mesh.userData.up || new Vector3(0, 1, 0); refs.current[name] = mesh; } else { delete refs.current[name]; } };
  const Limb = ({ name, radius, material }) => <mesh ref={bind(name)} castShadow><cylinderGeometry args={[radius * .78, radius, 1, 24]}/>{material}</mesh>;
  const joint = (name, radius) => <mesh ref={bind(name)} castShadow><sphereGeometry args={[radius, 24, 18]}/><meshStandardMaterial color="#a5a5a1" metalness={0.38} roughness={0.42}/></mesh>;
  return <group position={position} scale={scale}>
    <group>
      <Limb name="torso" radius={.26} material={<Top/>}/><Limb name="pelvis" radius={.23} material={<Suit/>}/>
      <Limb name="armNear" radius={.105} material={<Skin/>}/><Limb name="forearmNear" radius={.085} material={<Skin/>}/>
      <Limb name="armFar" radius={.09} material={<Suit/>}/><Limb name="forearmFar" radius={.074} material={<Skin/>}/>
      <Limb name="thighNear" radius={.145} material={<Suit/>}/><Limb name="shinNear" radius={.11} material={<Skin/>}/>
      <Limb name="thighFar" radius={.13} material={<Suit/>}/><Limb name="shinFar" radius={.095} material={<Skin/>}/>
      {joint('elbowNear', .095)}{joint('elbowFar', .082)}{joint('kneeNear', .13)}{joint('kneeFar', .115)}
      <group ref={bind('head')}>
        <mesh castShadow><sphereGeometry args={[.22, 32, 24]}/><Skin/></mesh>
        <mesh position={[0,.13,-.015]} scale={[1.02,.54,1]}><sphereGeometry args={[.205,24,18]}/><meshStandardMaterial color="#171717" roughness={.88}/></mesh>
        <mesh position={[.018,-.055,.205]}><sphereGeometry args={[.052,.066,.075]}/><meshStandardMaterial color="#a9785d" roughness={.56}/></mesh>
        {[-.072,.058].map(x=><group key={x} position={[x,.035,.194]}><mesh><sphereGeometry args={[.026,.018,.012]}/><meshStandardMaterial color="#ece5dc" roughness={.6}/></mesh><mesh position={[0,0,.012]}><sphereGeometry args={[.012,.012,.009]}/><meshStandardMaterial color="#201b18" roughness={.35}/></mesh></group>)}
        <mesh position={[-.01,-.105,.19]} scale={[.09,.018,.012]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#55382f" roughness={.65}/></mesh>
      </group>
      {joint('handNear', .09)}{joint('handFar', .075)}
      <mesh ref={bind('shoeNear')} position={[0,.1,.3]} rotation={[0,0,-.04]} castShadow><capsuleGeometry args={[.12,.28,5,10]}/><meshStandardMaterial color="#111313" metalness={.25} roughness={.68}/></mesh>
      <mesh ref={bind('shoeFar')} position={[0,.1,-.3]} rotation={[0,0,-.04]} castShadow><capsuleGeometry args={[.11,.26,5,10]}/><meshStandardMaterial color="#181a1a" metalness={.2} roughness={.7}/></mesh>
      <mesh ref={bind('glow')} position={[0,.04,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[1.65,48]}/><meshBasicMaterial color="#ff571e" transparent opacity={.12} depthWrite={false}/></mesh>
      <group ref={bind('bar')} position={[0,.33,0]} rotation={[0,0,0]}>
        <mesh castShadow><cylinderGeometry args={[.035,.035,3.35,32]}/><meshStandardMaterial color="#c6c6c0" metalness={.96} roughness={.19}/></mesh>
        {[-1,1].map(side=><group key={side} position={[side*1.24,0,0]} rotation={[0,0,Math.PI/2]}><mesh castShadow><cylinderGeometry args={[.48,.48,.26,48]}/><meshStandardMaterial color="#111313" metalness={.72} roughness={.32}/></mesh><mesh position={[0,.14,0]}><torusGeometry args={[.35,.017,10,48]}/><meshStandardMaterial color="#ff5a1f" emissive="#ff4a17" emissiveIntensity={.8} metalness={.6}/></mesh><mesh position={[0,.15,0]}><cylinderGeometry args={[.1,.1,.3,24]}/><meshStandardMaterial color="#aaa9a3" metalness={.9}/></mesh></group>)}
      </group>
      {['Near','Far'].map((side, index) => <group key={side} ref={bind(`dumbbell${side}`)} visible={false}><mesh><cylinderGeometry args={[.035,.035,.32,20]}/><meshStandardMaterial color="#bdbdb6" metalness={.9}/></mesh>{[-1,1].map(end=><mesh key={end} position={[0,end*.18,0]}><cylinderGeometry args={[.13,.13,.08,24]}/><meshStandardMaterial color="#17191a" metalness={.75} roughness={.3}/></mesh>)}</group>)}
    </group>
  </group>;
}

function Dust() {
  const points = useRef();
  const positions = useMemo(() => { const p = new Float32Array(210); for (let i = 0; i < p.length; i += 3) { p[i] = (Math.random() - .5) * 5.5; p[i+1] = Math.random() * 3.5; p[i+2] = (Math.random() - .5) * 3; } return p; }, []);
  useFrame((_, delta) => { if (points.current) points.current.rotation.y += delta * .009; });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" count={70} array={positions} itemSize={3}/></bufferGeometry><pointsMaterial color="#ff8a54" size={.018} transparent opacity={.55}/></points>;
}

export default function WorkoutScene({ paused, exercise }) {
  return <Canvas aria-label="Animated 3D athlete performing a deadlift. Drag to rotate the view." camera={{ position: [3.5, 2.55, 6.4], fov: 37 }} dpr={[1, 1.4]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <ambientLight intensity={.68}/><hemisphereLight intensity={.62} groundColor="#18191a" color="#fff1e5"/>
    <spotLight position={[-3,5,4]} intensity={86} angle={.52} penumbra={.95} color="#fff0e0" castShadow/><spotLight position={[3,3,-3]} intensity={58} angle={.58} penumbra={.9} color="#ff581f"/><pointLight position={[-1,1,2]} intensity={8} color="#ff672c"/>
    <Environment preset="warehouse"/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.01,0]} receiveShadow><planeGeometry args={[10,8]}/><meshStandardMaterial color="#111313" metalness={.08} roughness={.88}/></mesh>
    <Dust/><Lifter paused={paused} exercise={exercise}/><Lifter paused={paused} exercise="Squat" position={[-1.45,0,-1.45]} scale={.43}/><Lifter paused={paused} exercise="Curl" position={[1.45,0,-1.7]} scale={.43}/><ContactShadows position={[0,0,0]} opacity={.42} scale={6} blur={2.4} far={2.5}/>
    <OrbitControls enablePan={false} enableZoom={false} minAzimuthAngle={-1.05} maxAzimuthAngle={1.05} minPolarAngle={.8} maxPolarAngle={1.8} rotateSpeed={.62} target={[0,1.4,0]}/>
  </Canvas>;
}

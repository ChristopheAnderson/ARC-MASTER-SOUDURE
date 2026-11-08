import { useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------------------------------------------------
   Assemblage métallique abstrait : poutres IPE, contreventements
   et points de soudure. S'assemble et pivote au scroll.
------------------------------------------------------------- */

const H = 3.2; // hauteur
const S = 1.25; // demi-côté

function iProfile(w = 0.16, h = 0.2, tf = 0.032, tw = 0.022) {
  const s = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  s.moveTo(-hw, -hh);
  s.lineTo(hw, -hh);
  s.lineTo(hw, -hh + tf);
  s.lineTo(tw / 2, -hh + tf);
  s.lineTo(tw / 2, hh - tf);
  s.lineTo(hw, hh - tf);
  s.lineTo(hw, hh);
  s.lineTo(-hw, hh);
  s.lineTo(-hw, hh - tf);
  s.lineTo(-tw / 2, hh - tf);
  s.lineTo(-tw / 2, -hh + tf);
  s.lineTo(-hw, -hh + tf);
  s.closePath();
  return s;
}

type Part = {
  kind: 'beam' | 'brace' | 'node';
  from: THREE.Vector3;
  to: THREE.Vector3;
  explode: THREE.Vector3;
  delay: number;
};

function buildParts(): Part[] {
  const parts: Part[] = [];
  const corners = [
    new THREE.Vector3(-S, 0, -S),
    new THREE.Vector3(S, 0, -S),
    new THREE.Vector3(S, 0, S),
    new THREE.Vector3(-S, 0, S),
  ];
  const levels = [0, H * 0.5, H];
  const rnd = (seed: number) => {
    const x = Math.sin(seed * 999.13) * 10000;
    return x - Math.floor(x);
  };
  let k = 0;
  const ex = (base: THREE.Vector3, mag = 2.6) => {
    k++;
    const dir = base.clone().setY(base.y - H / 2);
    if (dir.lengthSq() < 0.01) dir.set(rnd(k) - 0.5, 1, rnd(k + 3) - 0.5);
    return dir.normalize().multiplyScalar(mag + rnd(k + 7) * 1.6).add(new THREE.Vector3(0, (rnd(k + 11) - 0.3) * 1.5, 0));
  };

  // Colonnes
  corners.forEach((c, i) => {
    const from = c.clone();
    const to = c.clone().setY(H);
    parts.push({ kind: 'beam', from, to, explode: ex(from.clone().lerp(to, 0.5), 2.2), delay: i * 0.03 });
  });
  // Poutres horizontales
  levels.forEach((y, li) => {
    for (let i = 0; i < 4; i++) {
      const a = corners[i].clone().setY(y);
      const b = corners[(i + 1) % 4].clone().setY(y);
      parts.push({ kind: 'beam', from: a, to: b, explode: ex(a.clone().lerp(b, 0.5)), delay: 0.12 + li * 0.08 + i * 0.02 });
    }
  });
  // Contreventements en croix (faces)
  for (let i = 0; i < 4; i++) {
    for (let l = 0; l < 2; l++) {
      const y0 = levels[l];
      const y1 = levels[l + 1];
      const a0 = corners[i].clone().setY(y0);
      const b1 = corners[(i + 1) % 4].clone().setY(y1);
      const a1 = corners[i].clone().setY(y1);
      const b0 = corners[(i + 1) % 4].clone().setY(y0);
      if ((i + l) % 2 === 0) {
        parts.push({ kind: 'brace', from: a0, to: b1, explode: ex(a0.clone().lerp(b1, 0.5), 3), delay: 0.35 + l * 0.08 + i * 0.03 });
      } else {
        parts.push({ kind: 'brace', from: a1, to: b0, explode: ex(a1.clone().lerp(b0, 0.5), 3), delay: 0.35 + l * 0.08 + i * 0.03 });
      }
    }
  }
  // Noeuds de soudure
  corners.forEach((c) =>
    levels.forEach((y) => {
      const p = c.clone().setY(y);
      parts.push({ kind: 'node', from: p, to: p, explode: ex(p, 3.4), delay: 0.55 + rnd(k++) * 0.2 });
    }),
  );
  return parts;
}

const steel = new THREE.MeshStandardMaterial({ color: '#cfd5db', metalness: 1, roughness: 0.28 });
const darkSteel = new THREE.MeshStandardMaterial({ color: '#30455b', metalness: 0.9, roughness: 0.38 });
const weld = new THREE.MeshStandardMaterial({ color: '#f07832', emissive: '#f07832', emissiveIntensity: 1.4, metalness: 0.4, roughness: 0.4 });

function PartMesh({ part, progress }: { part: Part; progress: RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const { geometry, quat, mid } = useMemo(() => {
    const dir = part.to.clone().sub(part.from);
    const len = dir.length();
    const mid = part.from.clone().add(part.to).multiplyScalar(0.5);
    const quat = new THREE.Quaternion();
    let geometry: THREE.BufferGeometry;
    if (part.kind === 'beam') {
      geometry = new THREE.ExtrudeGeometry(iProfile(), { depth: len + 0.16, bevelEnabled: false, steps: 1 });
      geometry.translate(0, 0, -(len + 0.16) / 2);
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
    } else if (part.kind === 'brace') {
      geometry = new THREE.BoxGeometry(0.05, 0.11, len);
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
    } else {
      geometry = new THREE.SphereGeometry(0.075, 16, 16);
    }
    return { geometry, quat, mid };
  }, [part]);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const p = progress.current ?? 0;
    // Assemblage : 0 → éclaté, 1 → assemblé (avec décalage par pièce)
    const local = THREE.MathUtils.clamp((p * 1.35 - part.delay) / 0.55, 0, 1);
    const e = 1 - Math.pow(1 - local, 3);
    g.position.copy(mid).addScaledVector(part.explode, 1 - e);
    g.quaternion.copy(quat);
    if (part.kind !== 'node') g.rotateZ((1 - e) * 1.2);
    const sc = part.kind === 'node' ? e : 1;
    g.scale.setScalar(Math.max(sc, 0.001));
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry} material={part.kind === 'beam' ? steel : part.kind === 'brace' ? darkSteel : weld} castShadow />
    </group>
  );
}

function Structure({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const parts = useMemo(buildParts, []);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const targetY = p * Math.PI * 1.6 + state.pointer.x * 0.35 + state.clock.elapsedTime * 0.06;
    const targetX = -0.12 + state.pointer.y * -0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt);
    weld.emissiveIntensity = 1.1 + Math.sin(state.clock.elapsedTime * 9) * 0.25 + Math.random() * 0.25;
  });
  return (
    <group ref={group} position={[0, -H / 2, 0]}>
      {parts.map((part, i) => (
        <PartMesh key={i} part={part} progress={progress} />
      ))}
    </group>
  );
}

interface SteelSceneProps {
  progress: RefObject<number>;
  active?: boolean;
}

export default function SteelScene({ progress, active = true }: SteelSceneProps) {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  return (
    <Canvas
      dpr={[1, mobile ? 1.4 : 1.8]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [5.2, 2.4, 6.4], fov: 36 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} />
      <Structure progress={progress} />
      <ContactShadows position={[0, -H / 2 - 0.05, 0]} opacity={0.32} scale={9} blur={2.6} far={4} resolution={mobile ? 256 : 512} color="#10243a" />
      <Environment resolution={mobile ? 64 : 256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#dbe4ee" />
        <Lightformer form="rect" intensity={1.2} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffd2b0" />
        <Lightformer form="ring" intensity={2.4} position={[2, 3, 6]} scale={2} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#f4f6f8" />
      </Environment>
    </Canvas>
  );
}

'use client'

import { Suspense, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   SHARED: Satellite position cache for lightning system
   ═══════════════════════════════════════════════════════════════ */
const satPositionCache: THREE.Vector3[] = Array.from({ length: 6 }, () => new THREE.Vector3())
const moonStrikeTime: number[] = Array.from({ length: 6 }, () => -999)

/* ═══════════════════════════════════════════════════════════════
   SHARED REACTIVE STATE — mutated by parent, read by scene children
   ═══════════════════════════════════════════════════════════════ */
const reactiveState = {
  isSpeaking: false,
  isThinking: false,
  speechIntensity: 0,
  thinkIntensity: 0,
  onLightning: null as (() => void) | null,
}

/* ═══════════════════════════════════════════════════════════════
   GLSL: Simplex noise for organic turbulence
   ═══════════════════════════════════════════════════════════════ */
const simplexNoise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`

/* ═══════════════════════════════════════════════════════════════
   NEBULA PARTICLE FIELD — 40,000 GPU particles
   ═══════════════════════════════════════════════════════════════ */
const nebulaVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  attribute float aScale;
  attribute float aLayer;
  attribute vec3 aRandomness;
  varying vec3 vColor;
  varying float vAlpha;

  ${simplexNoise}

  void main() {
    vec3 pos = position;
    float layer = aLayer;

    vec3 toCenter = -pos;
    float dist = length(toCenter);

    float noiseFreq = mix(0.15, 0.4, layer);
    float noiseAmp = mix(0.8, 0.3, layer);
    float timeScale = mix(0.12, 0.25, layer);
    float t = uTime * timeScale;

    pos.x += snoise(vec3(pos.x * noiseFreq + t, pos.y * noiseFreq, pos.z * noiseFreq)) * noiseAmp;
    pos.y += snoise(vec3(pos.x * noiseFreq, pos.y * noiseFreq + t * 1.3, pos.z * noiseFreq)) * noiseAmp;
    pos.z += snoise(vec3(pos.x * noiseFreq, pos.y * noiseFreq, pos.z * noiseFreq + t * 0.7)) * noiseAmp;

    float angle = uTime * mix(0.03, 0.08, layer);
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec3 rotated = vec3(
      pos.x * cosA - pos.z * sinA,
      pos.y,
      pos.x * sinA + pos.z * cosA
    );
    pos = rotated;

    pos += aRandomness * sin(uTime * 0.3 + aRandomness.x * 6.28) * 0.15;

    vec3 mouseWorld = vec3(uMouse.x * 8.0, uMouse.y * 5.0, 0.0);
    vec3 fromMouse = pos - mouseWorld;
    float mouseDist = length(fromMouse);
    if (mouseDist < 3.0) {
      pos += normalize(fromMouse) * (3.0 - mouseDist) * 0.15;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeMultiplier = mix(1.5, 0.6, layer);
    gl_PointSize = uSize * aScale * sizeMultiplier * (250.0 / -mvPosition.z);

    // EPT teal-cyan palette (matches --ept-accent: teal)
    vec3 deepNavy = vec3(0.02, 0.04, 0.12);
    vec3 cosmicTeal = vec3(0.04, 0.14, 0.35);
    vec3 electricCyan = vec3(0.0, 0.55, 0.7);
    vec3 nebulaTeal = vec3(0.05, 0.3, 0.35);
    vec3 dustyBlue = vec3(0.06, 0.1, 0.25);
    vec3 warmAccent = vec3(0.05, 0.2, 0.3);
    vec3 starWhite = vec3(0.75, 0.85, 0.9);

    float colorNoise = snoise(vec3(pos * 0.15 + uTime * 0.05));
    float colorNoise2 = snoise(vec3(pos * 0.08 - uTime * 0.03));

    vec3 baseColor;
    if (colorNoise > 0.4) {
      baseColor = mix(cosmicTeal, electricCyan, smoothstep(0.4, 0.9, colorNoise));
    } else if (colorNoise > 0.0) {
      baseColor = mix(dustyBlue, cosmicTeal, smoothstep(0.0, 0.4, colorNoise));
    } else if (colorNoise > -0.3) {
      baseColor = mix(nebulaTeal, dustyBlue, smoothstep(-0.3, 0.0, colorNoise));
    } else {
      float warmMix = smoothstep(-0.8, -0.3, colorNoise);
      baseColor = mix(deepNavy, nebulaTeal, warmMix);
      baseColor = mix(baseColor, warmAccent, max(0.0, colorNoise2) * 0.3);
    }

    float starChance = step(0.97, fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453));
    baseColor = mix(baseColor, starWhite, starChance * 0.5);

    float coreBrightness = smoothstep(6.0, 2.5, dist) * 0.15;
    baseColor += vec3(0.02, 0.08, 0.12) * coreBrightness;

    vColor = baseColor;

    float edgeFade = 1.0 - smoothstep(8.0, 18.0, dist);
    float coreFade = smoothstep(1.5, 4.0, dist);
    vAlpha = edgeFade * coreFade * mix(0.35, 0.6, layer);
  }
`

const nebulaFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = exp(-d * d * 10.0) * vAlpha;
    vec3 glow = vColor;
    gl_FragColor = vec4(glow, alpha * 0.4);
  }
`

function NebulaField({ count = 40000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef(new THREE.Vector2(0, 0))

  const { positions, scales, randomness, layers } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randomness = new Float32Array(count * 3)
    const layers = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const isInner = i < count * 0.35

      if (isInner) {
        const radius = Math.pow(Math.random(), 0.6) * 6
        const branchAngle = ((i % 5) / 5) * Math.PI * 2
        const spinAngle = radius * 0.8
        const scatter = Math.pow(Math.random(), 2) * 1.5

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * scatter
        positions[i3 + 1] = (Math.random() - 0.5) * scatter * 0.6
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * scatter
        layers[i] = 1.0
      } else {
        const radius = Math.random() * 16 + 3
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const flattenY = 0.4

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.cos(phi) * flattenY
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
        layers[i] = 0.0
      }

      scales[i] = Math.random() * 0.8 + 0.2
      randomness[i3] = (Math.random() - 0.5) * 2
      randomness[i3 + 1] = (Math.random() - 0.5) * 2
      randomness[i3 + 2] = (Math.random() - 0.5) * 2
    }

    return { positions, scales, randomness, layers }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 2.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  useFrame((state) => {
    if (pointsRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime
      uniforms.uMouse.value.copy(mouseRef.current)
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  const { gl } = useThree()
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    },
    [gl]
  )

  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', handlePointerMove)
      return () => window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [handlePointerMove])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aLayer" args={[layers, 1]} />
        <bufferAttribute attach="attributes-aRandomness" args={[randomness, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   GENESIS ORB — Glowing energy sphere at nebula core
   ═══════════════════════════════════════════════════════════════ */
const orbVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const orbFragmentShader = `
  uniform float uTime;
  uniform float uSpeechPulse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  ${simplexNoise}

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);

    float noiseSpeed = 0.3 + uSpeechPulse * 1.2;
    float noise1 = snoise(vPosition * 2.0 + uTime * noiseSpeed) * 0.5 + 0.5;
    float noise2 = snoise(vPosition * 4.0 - uTime * noiseSpeed * 0.7) * 0.5 + 0.5;
    float noise3 = snoise(vPosition * 6.0 + uTime * noiseSpeed * 2.0) * 0.5 + 0.5;
    float surfacePattern = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2 * uSpeechPulse;

    // EPT teal-cyan orb palette
    vec3 voidBlack = vec3(0.01, 0.03, 0.05);
    vec3 deepCore = vec3(0.02, 0.06, 0.1);
    vec3 veinColor = vec3(0.0, 0.2, 0.3);
    vec3 rimColor = vec3(0.05, 0.45, 0.55);
    vec3 plasmaHot = vec3(0.0, 0.5, 0.6);
    vec3 plasmaCyan = vec3(0.0, 0.72, 0.66);

    vec3 surfaceColor = mix(voidBlack, deepCore, surfacePattern * 0.5);

    float veinThreshold = mix(0.65, 0.35, uSpeechPulse);
    float veinMask = smoothstep(veinThreshold, 0.85, surfacePattern);
    vec3 activeVeinColor = mix(veinColor, plasmaHot, uSpeechPulse);
    surfaceColor = mix(surfaceColor, activeVeinColor, veinMask * mix(0.4, 0.9, uSpeechPulse));

    float rimStrength = mix(0.6, 1.2, uSpeechPulse);
    vec3 activeRimColor = mix(rimColor, plasmaCyan, uSpeechPulse * 0.7);
    surfaceColor = mix(surfaceColor, activeRimColor, fresnel * rimStrength);

    float speechRhythm = sin(uTime * 8.0) * 0.3 + sin(uTime * 13.0) * 0.15 + sin(uTime * 21.0) * 0.08;
    float pulse = sin(uTime * 1.5) * 0.08 + 0.92 + uSpeechPulse * speechRhythm * 0.25;
    surfaceColor *= pulse;

    surfaceColor += vec3(0.0, 0.06, 0.08) * uSpeechPulse;

    float alpha = 0.95;
    gl_FragColor = vec4(surfaceColor, alpha);
  }
`

function GenesisOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const midGlowRef = useRef<THREE.Mesh>(null)
  const ringGroupRef = useRef<THREE.Group>(null)

  const orbUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeechPulse: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    orbUniforms.uTime.value = t

    const targetSpeech = reactiveState.isSpeaking ? 1.0 : 0.0
    reactiveState.speechIntensity += (targetSpeech - reactiveState.speechIntensity) * 0.08
    orbUniforms.uSpeechPulse.value = reactiveState.speechIntensity

    const targetThink = reactiveState.isThinking ? 1.0 : 0.0
    reactiveState.thinkIntensity += (targetThink - reactiveState.thinkIntensity) * 0.06

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1

      const sp = reactiveState.speechIntensity
      const speechScale = 1.0 + sp * (
        Math.sin(t * 7.0) * 0.04 +
        Math.sin(t * 11.0) * 0.025 +
        Math.sin(t * 17.0) * 0.015
      )
      meshRef.current.scale.setScalar(speechScale)
    }
    if (glowRef.current) {
      const sp = reactiveState.speechIntensity
      const breathe = 1.0 + Math.sin(t * 1.2) * 0.08 + sp * (Math.sin(t * 5.0) * 0.12)
      glowRef.current.scale.setScalar(breathe)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.08 + sp * 0.15
    }
    if (midGlowRef.current) {
      const sp = reactiveState.speechIntensity
      const mat = midGlowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.12 + sp * 0.18
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.12
    }
  })

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.6, 64, 64]} />
        <meshBasicMaterial color="#003344" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      <mesh ref={midGlowRef}>
        <sphereGeometry args={[3.0, 64, 64]} />
        <meshBasicMaterial color="#001a2a" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      <group ref={ringGroupRef} rotation={[Math.PI / 2.2, 0.15, 0]}>
        <mesh>
          <ringGeometry args={[2.6, 4.2, 128]} />
          <meshBasicMaterial color="#0d6060" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.8, 3.2, 128]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[3.6, 4.0, 128]} />
          <meshBasicMaterial color="#0d7377" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <torusGeometry args={[3.4, 0.015, 8, 200]} />
          <meshBasicMaterial color="#2dd4bf" transparent opacity={0.5} />
        </mesh>
      </group>

      <mesh ref={meshRef}>
        <sphereGeometry args={[2.0, 128, 128]} />
        <shaderMaterial
          vertexShader={orbVertexShader}
          fragmentShader={orbFragmentShader}
          uniforms={orbUniforms}
          transparent
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#001a1a" transparent opacity={0.8} />
      </mesh>

      <pointLight color="#0d7377" intensity={1.2} distance={12} decay={2} />
      <pointLight color="#14b8a6" intensity={0.6} distance={8} decay={2} position={[0, 1, 0]} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ORBITAL SATELLITES — small energy nodes circling the orb
   ═══════════════════════════════════════════════════════════════ */
function OrbitalSatellites() {
  const groupRef = useRef<THREE.Group>(null)

  const satellites = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        radius: 3.6 + i * 0.6,
        speed: 0.25 + i * 0.06,
        offset: (i / 6) * Math.PI * 2,
        tilt: ((i % 3) - 1) * 0.35,
        size: 0.2 - i * 0.012,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    const thinkBoost = 1.0 + reactiveState.thinkIntensity * 1.5
    const speakBoost = 1.0 + reactiveState.speechIntensity * 0.3

    groupRef.current.children.forEach((child, i) => {
      const sat = satellites[i]
      if (!sat) return
      const speedMul = thinkBoost * speakBoost
      const angle = t * sat.speed * speedMul + sat.offset
      child.position.x = Math.cos(angle) * sat.radius
      child.position.y = Math.sin(angle) * sat.radius * 0.3 + Math.sin(t + i) * sat.tilt
      child.position.z = Math.sin(angle) * sat.radius
      child.rotation.y = t * (1.5 + i * 0.3) * speedMul
      child.rotation.x = t * (0.8 + i * 0.2) * speedMul
      if (satPositionCache[i]) satPositionCache[i].copy(child.position)

      try {
        const age = t - (moonStrikeTime[i] ?? -999)
        const glow = age < 0.4 ? Math.max(0, 1.0 - age / 0.4) : 0
        const grp = child as THREE.Group
        if (glow > 0 && grp.children?.[0]) {
          const mesh = grp.children[0] as THREE.Mesh
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat?.emissive) {
            mat.emissive.setRGB(glow * 0.2, glow * 0.7, glow * 0.6)
            mat.emissiveIntensity = glow * 3.0
          }
        } else if (grp.children?.[0]) {
          const mat = (grp.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial
          if (mat?.emissiveIntensity !== undefined) mat.emissiveIntensity = 0
        }
      } catch (_) { /* no crash */ }
    })
  })

  return (
    <group ref={groupRef}>
      {satellites.map((sat, i) => (
        <group key={i}>
          <mesh>
            <sphereGeometry args={[sat.size, 32, 32]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#7899aa' : '#89aabb'}
              metalness={0.9}
              roughness={0.15 + (i % 3) * 0.1}
              envMapIntensity={1.5}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[sat.size * 1.6, 16, 16]} />
            <meshBasicMaterial color="#aabbcc" transparent opacity={0.06} />
          </mesh>
          <pointLight color="#ddeeff" intensity={0.15} distance={1.5} decay={2} />
        </group>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ENERGY TENDRILS — bright streaks connecting orb to nebula
   ═══════════════════════════════════════════════════════════════ */
function EnergyTendrils() {
  const groupRef = useRef<THREE.Group>(null)

  const tendrils = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const points: THREE.Vector3[] = []
      for (let t = 0; t < 20; t++) {
        const r = (t / 20) * 8
        points.push(
          new THREE.Vector3(
            Math.cos(angle + t * 0.15) * r,
            (Math.random() - 0.5) * r * 0.3,
            Math.sin(angle + t * 0.15) * r
          )
        )
      }
      return new THREE.CatmullRomCurve3(points)
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <group ref={groupRef}>
      {tendrils.map((curve, i) => {
        const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.02, 4, false)
        return (
          <mesh key={i} geometry={tubeGeo}>
            <meshBasicMaterial
              color={i % 2 === 0 ? '#0d7377' : '#14b8a6'}
              transparent
              opacity={0.15}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTNING BOLTS — electrical arcs from orb to moons
   ═══════════════════════════════════════════════════════════════ */
const MAX_BOLTS = 4
const MAX_VERTS = 300

interface BoltState {
  active: boolean
  birthTime: number
  lifetime: number
}

function LightningBolts() {
  const groupRef = useRef<THREE.Group>(null)
  const lastFireTime = useRef(0)
  const nextInterval = useRef(2.0)
  const boltStates = useRef<BoltState[]>(
    Array.from({ length: MAX_BOLTS }, () => ({
      active: false,
      birthTime: 0,
      lifetime: 0.4,
    }))
  )

  const lines = useMemo(() => {
    return Array.from({ length: MAX_BOLTS }, () => {
      const geo = new THREE.BufferGeometry()
      const positions = new Float32Array(MAX_VERTS * 3)
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setDrawRange(0, 0)
      const mat = new THREE.LineBasicMaterial({
        color: 0x66ddcc,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      return new THREE.Line(geo, mat)
    })
  }, [])

  const glowLines = useMemo(() => {
    return Array.from({ length: MAX_BOLTS }, () => {
      const geo = new THREE.BufferGeometry()
      const positions = new Float32Array(MAX_VERTS * 3)
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setDrawRange(0, 0)
      const mat = new THREE.LineBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      return new THREE.Line(geo, mat)
    })
  }, [])

  const displace = useCallback(
    (
      sx: number, sy: number, sz: number,
      ex: number, ey: number, ez: number,
      detail: number
    ): number[] => {
      let pts: number[][] = [[sx, sy, sz], [ex, ey, ez]]
      const dist = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2 + (ez - sz) ** 2)

      for (let d = 0; d < detail; d++) {
        const next: number[][] = [pts[0]]
        const jitter = dist * 0.14 / Math.pow(1.7, d)
        for (let i = 0; i < pts.length - 1; i++) {
          const [ax, ay, az] = pts[i]
          const [bx, by, bz] = pts[i + 1]
          next.push([
            (ax + bx) / 2 + (Math.random() - 0.5) * jitter,
            (ay + by) / 2 + (Math.random() - 0.5) * jitter,
            (az + bz) / 2 + (Math.random() - 0.5) * jitter,
          ])
          next.push(pts[i + 1])
        }
        pts = next
      }

      const flat: number[] = []
      for (const p of pts) { flat.push(p[0], p[1], p[2]) }
      return flat
    },
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    const thinkMod = reactiveState.thinkIntensity
    const baseInterval = thinkMod > 0.5 ? 0.15 + Math.random() * 0.25 : 1.8 + Math.random() * 2.5
    if (t - lastFireTime.current > (nextInterval.current * (1.0 - thinkMod * 0.85))) {
      lastFireTime.current = t
      nextInterval.current = baseInterval

      const slot = boltStates.current.findIndex((b) => !b.active)
      if (slot !== -1) {
        const indices = [0, 1, 2, 3, 4, 5]
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }
        const chainLen = 2 + Math.floor(Math.random() * 2)

        let allVerts: number[] = []
        let px = 0, py = 0, pz = 0

        for (let c = 0; c < chainLen; c++) {
          const mp = satPositionCache[indices[c]]
          const segment = displace(px, py, pz, mp.x, mp.y, mp.z, 5)
          const start = c > 0 ? 3 : 0
          for (let j = start; j < segment.length; j++) {
            allVerts.push(segment[j])
          }
          px = mp.x; py = mp.y; pz = mp.z
        }

        if (chainLen >= 2 && Math.random() > 0.4) {
          const branchStart = Math.floor(allVerts.length / 6) * 3
          const bsx = allVerts[branchStart] || 0
          const bsy = allVerts[branchStart + 1] || 0
          const bsz = allVerts[branchStart + 2] || 0
          const bex = bsx + (Math.random() - 0.5) * 2.5
          const bey = bsy + (Math.random() - 0.5) * 2.5
          const bez = bsz + (Math.random() - 0.5) * 2.5
          const branch = displace(bsx, bsy, bsz, bex, bey, bez, 3)
          for (let j = 0; j < branch.length; j++) allVerts.push(branch[j])
        }

        const vertCount = Math.min(Math.floor(allVerts.length / 3), MAX_VERTS)

        const mainGeo = lines[slot].geometry as THREE.BufferGeometry
        const mainPos = mainGeo.getAttribute('position') as THREE.BufferAttribute
        const mainArr = mainPos.array as Float32Array
        for (let j = 0; j < vertCount * 3; j++) mainArr[j] = allVerts[j]
        mainPos.needsUpdate = true
        mainGeo.setDrawRange(0, vertCount)

        const glowGeo = glowLines[slot].geometry as THREE.BufferGeometry
        const glowPos = glowGeo.getAttribute('position') as THREE.BufferAttribute
        const glowArr = glowPos.array as Float32Array
        for (let j = 0; j < vertCount * 3; j++) {
          glowArr[j] = allVerts[j] + (Math.random() - 0.5) * 0.03
        }
        glowPos.needsUpdate = true
        glowGeo.setDrawRange(0, vertCount)

        for (let c = 0; c < chainLen; c++) {
          moonStrikeTime[indices[c]] = t
        }

        boltStates.current[slot] = {
          active: true,
          birthTime: t,
          lifetime: 0.25 + Math.random() * 0.3,
        }

        // Fire lightning sound callback
        if (reactiveState.onLightning) reactiveState.onLightning()
      }
    }

    for (let i = 0; i < MAX_BOLTS; i++) {
      const bolt = boltStates.current[i]
      if (!bolt.active) continue

      const age = t - bolt.birthTime
      const progress = age / bolt.lifetime

      if (progress >= 1.0) {
        bolt.active = false
        ;(lines[i].geometry as THREE.BufferGeometry).setDrawRange(0, 0)
        ;(glowLines[i].geometry as THREE.BufferGeometry).setDrawRange(0, 0)
        ;(lines[i].material as THREE.LineBasicMaterial).opacity = 0
        ;(glowLines[i].material as THREE.LineBasicMaterial).opacity = 0
      } else {
        const fade = progress < 0.15
          ? 1.0
          : 1.0 - Math.pow((progress - 0.15) / 0.85, 0.4)

        const mainMat = lines[i].material as THREE.LineBasicMaterial
        mainMat.opacity = fade * 1.0
        const r = THREE.MathUtils.lerp(0.5, 0.05, progress)
        const g = THREE.MathUtils.lerp(1.5, 0.7, progress)
        mainMat.color.setRGB(r, g, 1.2)

        const glowMat = glowLines[i].material as THREE.LineBasicMaterial
        glowMat.opacity = fade * 0.8
        glowMat.color.setRGB(0.1, THREE.MathUtils.lerp(1.0, 0.4, progress), THREE.MathUtils.lerp(0.9, 0.5, progress))
      }
    }
  })

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <primitive key={`bolt-${i}`} object={line} />
      ))}
      {glowLines.map((line, i) => (
        <primitive key={`glow-${i}`} object={line} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SCENE COMPOSITION
   ═══════════════════════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={55} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 6, 10]} intensity={1.2} color="#ddeeff" />
      <directionalLight position={[-5, -3, -8]} intensity={0.4} color="#446688" />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#0d7377" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#14b8a6" />

      <NebulaField count={40000} />
      <GenesisOrb />
      <OrbitalSatellites />
      <EnergyTendrils />
      <LightningBolts />

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.7}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0015, 0.0015) as any}
          radialModulation={false as any}
          modulationOffset={0 as any}
        />
        <Noise opacity={0.03} />
        <Vignette offset={0.2} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════ */
interface NebulaCoreProps {
  isSpeaking?: boolean
  isThinking?: boolean
  onLightning?: () => void
}

export default function NebulaCoreScene({ isSpeaking = false, isThinking = false, onLightning }: NebulaCoreProps) {
  reactiveState.isSpeaking = isSpeaking
  reactiveState.isThinking = isThinking
  reactiveState.onLightning = onLightning || null

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

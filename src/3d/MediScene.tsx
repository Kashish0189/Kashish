import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MediAnimationState } from "../types";
import { Eye, Layers, RotateCcw, Upload, Sparkles, Sliders } from "lucide-react";

interface MediSceneProps {
  animationState: MediAnimationState;
  onStateChange?: (state: MediAnimationState) => void;
  interactiveHead?: boolean;
  className?: string;
  showInspector?: boolean;
}

export const MediScene: React.FC<MediSceneProps> = ({
  animationState,
  onStateChange,
  interactiveHead = true,
  className = "",
  showInspector = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Inspector and controls state
  const [wireframe, setWireframe] = useState(false);
  const [showScaleHUD, setShowScaleHUD] = useState(false);
  const [hologramIntensity, setHologramIntensity] = useState(1.0);
  const [modelType, setModelType] = useState<"built-in" | "custom">("built-in");
  const [customModelName, setCustomModelName] = useState<string | null>(null);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const visorMeshRef = useRef<THREE.Mesh | null>(null);
  const eyesMeshRef = useRef<THREE.Mesh | null>(null);
  const mouthMeshRef = useRef<THREE.Mesh | null>(null);
  const holoRingsGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const customModelGroupRef = useRef<THREE.Group | null>(null);

  const materialsRef = useRef<THREE.Material[]>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animStateRef = useRef<MediAnimationState>(animationState);

  useEffect(() => {
    animStateRef.current = animationState;
  }, [animationState]);

  // Wireframe toggle effect
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if ("wireframe" in mat) {
        (mat as any).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 500;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.18);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.85, 2.7);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // CONTROLS
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 4.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.08; // Don't flip under ground
    controls.target.set(0, 0.65, 0);
    controlsRef.current = controls;

    // LIGHTING
    // Ambient light - soft cool midnight blue
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    // Key front light - soft white/cyan
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    keyLight.position.set(1.5, 3.0, 2.5);
    scene.add(keyLight);

    // Rim light cyan (left side)
    const rimCyan = new THREE.PointLight(0x06b6d4, 3.5, 8);
    rimCyan.position.set(-2.0, 1.8, -1.0);
    scene.add(rimCyan);

    // Rim light violet/pink (right side)
    const rimViolet = new THREE.PointLight(0xa855f7, 3.0, 8);
    rimViolet.position.set(2.0, 1.5, -1.2);
    scene.add(rimViolet);

    // Underlight holographic upward beam
    const holoFloorLight = new THREE.PointLight(0x38bdf8, 4.0, 4);
    holoFloorLight.position.set(0, 0.05, 0);
    scene.add(holoFloorLight);

    // MATERIALS
    materialsRef.current = [];

    // Ceramic White chassis (smooth, glossy, gentle pearlescent)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
    materialsRef.current.push(bodyMat);

    // Accent Lavender / Violet trim
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x9333ea,
      emissiveIntensity: 0.25,
    });
    materialsRef.current.push(accentMat);

    // Dark Visor glass face
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050814,
      roughness: 0.05,
      metalness: 0.8,
      clearcoat: 1.0,
      transmission: 0.15,
      opacity: 0.95,
      transparent: true,
    });
    materialsRef.current.push(visorMat);

    // Glowing Cyan Eyes & Mouth
    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
    });
    materialsRef.current.push(cyanGlowMat);

    // Glowing Heart Emissive
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    materialsRef.current.push(heartMat);

    // Joint / Chrome metal material
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.2,
      metalness: 0.85,
    });
    materialsRef.current.push(jointMat);

    // Hologram Ring Line Material
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    materialsRef.current.push(holoRingMat);

    // BUILD PROCEDURAL MEDI ROBOT
    // Virtual Dimensions: 1.20m total height, 0.48m width, 0.38m depth
    const robotRoot = new THREE.Group();
    robotRoot.name = "MEDI_Rig_Root";
    robotGroupRef.current = robotRoot;
    scene.add(robotRoot);

    // Floating Torso (height ~0.40m, center around y=0.55)
    const torsoGroup = new THREE.Group();
    torsoGroup.name = "Torso";
    robotRoot.add(torsoGroup);

    // Main Torso Body (curved aerodynamic egg/capsule body)
    const torsoGeo = new THREE.SphereGeometry(0.24, 32, 28);
    torsoGeo.scale(0.95, 1.25, 0.85);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.set(0, 0.52, 0);
    torsoGroup.add(torsoMesh);

    // Lower chassis base ring (lavender glow)
    const torsoTrimGeo = new THREE.TorusGeometry(0.22, 0.018, 16, 48);
    torsoTrimGeo.rotateX(Math.PI / 2);
    const torsoTrimMesh = new THREE.Mesh(torsoTrimGeo, accentMat);
    torsoTrimMesh.position.set(0, 0.42, 0);
    torsoGroup.add(torsoTrimMesh);

    // Heart Badge on Chest (cyan glowing heart emblem)
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.025, y + 0.025);
    heartShape.bezierCurveTo(x + 0.025, y + 0.025, x + 0.02, y, x, y);
    heartShape.bezierCurveTo(x - 0.03, y, x - 0.03, y + 0.035, x - 0.03, y + 0.035);
    heartShape.bezierCurveTo(x - 0.03, y + 0.055, x - 0.01, y + 0.077, x + 0.025, y + 0.095);
    heartShape.bezierCurveTo(x + 0.06, y + 0.077, x + 0.08, y + 0.055, x + 0.08, y + 0.035);
    heartShape.bezierCurveTo(x + 0.08, y + 0.035, x + 0.08, y, x + 0.05, y);
    heartShape.bezierCurveTo(x + 0.035, y, x + 0.025, y + 0.025, x + 0.025, y + 0.025);

    const heartGeo = new THREE.ShapeGeometry(heartShape);
    heartGeo.center();
    heartGeo.scale(0.7, -0.7, 0.7); // Invert so heart points down correctly
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0, 0.58, 0.205);
    torsoGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // Heart bezel frame
    const heartFrameGeo = new THREE.RingGeometry(0.045, 0.06, 32);
    const heartFrameMesh = new THREE.Mesh(heartFrameGeo, accentMat);
    heartFrameMesh.position.set(0, 0.58, 0.202);
    torsoGroup.add(heartFrameMesh);

    // NECK & HEAD
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.06, 20), jointMat);
    neckMesh.position.set(0, 0.78, 0);
    robotRoot.add(neckMesh);

    // Head Group (pivot at neck connection: y=0.82)
    const headGroup = new THREE.Group();
    headGroup.name = "Head";
    headGroup.position.set(0, 0.85, 0);
    robotRoot.add(headGroup);
    headGroupRef.current = headGroup;

    // Helmet outer shell (smooth cute rounded helmet)
    const helmetGeo = new THREE.SphereGeometry(0.23, 32, 28);
    helmetGeo.scale(1.15, 0.95, 1.05);
    const helmetMesh = new THREE.Mesh(helmetGeo, bodyMat);
    headGroup.add(helmetMesh);

    // Dark Visor Screen (front face of helmet)
    const visorGeo = new THREE.SphereGeometry(0.21, 32, 24, 0, Math.PI, 0, Math.PI);
    visorGeo.scale(1.08, 0.88, 0.98);
    visorGeo.rotateY(-Math.PI / 2);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, -0.01, 0.045);
    headGroup.add(visorMesh);
    visorMeshRef.current = visorMesh;

    // Visor border trim (accent lavender)
    const visorBorderGeo = new THREE.TorusGeometry(0.185, 0.012, 16, 40);
    visorBorderGeo.scale(1.15, 0.85, 1.0);
    const visorBorderMesh = new THREE.Mesh(visorBorderGeo, accentMat);
    visorBorderMesh.position.set(0, 0.0, 0.17);
    headGroup.add(visorBorderMesh);

    // Expressive Digital Eyes on visor screen
    const eyesGroup = new THREE.Group();
    headGroup.add(eyesGroup);

    // Left Eye (cute curved pill / ring with inner pupil)
    const eyeRingGeo = new THREE.TorusGeometry(0.028, 0.007, 16, 32);
    const leftEyeMesh = new THREE.Mesh(eyeRingGeo, cyanGlowMat);
    leftEyeMesh.position.set(-0.075, 0.02, 0.21);
    leftEyeMesh.rotation.y = -0.15;
    eyesGroup.add(leftEyeMesh);

    const leftPupil = new THREE.Mesh(new THREE.CircleGeometry(0.018, 20), cyanGlowMat);
    leftPupil.position.set(-0.075, 0.02, 0.212);
    leftPupil.rotation.y = -0.15;
    eyesGroup.add(leftPupil);

    // Right Eye
    const rightEyeMesh = new THREE.Mesh(eyeRingGeo, cyanGlowMat);
    rightEyeMesh.position.set(0.075, 0.02, 0.21);
    rightEyeMesh.rotation.y = 0.15;
    eyesGroup.add(rightEyeMesh);

    const rightPupil = new THREE.Mesh(new THREE.CircleGeometry(0.018, 20), cyanGlowMat);
    rightPupil.position.set(0.075, 0.02, 0.212);
    rightPupil.rotation.y = 0.15;
    eyesGroup.add(rightPupil);
    eyesMeshRef.current = eyesGroup as any;

    // Smiling Digital Mouth (curved line)
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.035, -0.04, 0.21),
      new THREE.Vector3(0, -0.065, 0.215),
      new THREE.Vector3(0.035, -0.04, 0.21)
    );
    const mouthGeo = new THREE.TubeGeometry(smileCurve, 20, 0.004, 8, false);
    const mouthMesh = new THREE.Mesh(mouthGeo, cyanGlowMat);
    headGroup.add(mouthMesh);
    mouthMeshRef.current = mouthMesh;

    // Cute Ear Headphone nodes (left and right with glowing inner discs)
    [-1, 1].forEach((side) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(side * 0.25, 0, 0);

      const earCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 24), bodyMat);
      earCylinder.rotation.z = Math.PI / 2;
      earGroup.add(earCylinder);

      const earGlow = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.042, 24), accentMat);
      earGlow.rotation.y = side * (Math.PI / 2);
      earGlow.position.set(side * 0.018, 0, 0);
      earGroup.add(earGlow);

      headGroup.add(earGroup);
    });

    // Cute Ribbon Bow / Antenna accent on top right (as in user screenshot)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0.13, 0.19, 0.08);
    bowGroup.rotation.z = -0.25;
    bowGroup.rotation.x = 0.15;

    const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), accentMat);
    bowGroup.add(bowCenter);

    const bowWingGeo = new THREE.ConeGeometry(0.035, 0.06, 16);
    bowWingGeo.rotateZ(Math.PI / 2);

    const bowLeft = new THREE.Mesh(bowWingGeo, accentMat);
    bowLeft.position.set(-0.035, 0, 0);
    bowGroup.add(bowLeft);

    const bowRight = new THREE.Mesh(bowWingGeo, accentMat);
    bowRight.rotation.y = Math.PI;
    bowRight.position.set(0.035, 0, 0);
    bowGroup.add(bowRight);
    headGroup.add(bowGroup);

    // RIGHT ARM & HAND (Friendly Waving Arm)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.name = "RightArm_Shoulder";
    rightArmGroup.position.set(-0.25, 0.65, 0);
    robotRoot.add(rightArmGroup);
    rightArmGroupRef.current = rightArmGroup;

    // Shoulder ball
    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 20), accentMat);
    rightArmGroup.add(rightShoulder);

    // Upper arm
    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.16, 20), bodyMat);
    rightUpperArm.position.set(-0.05, -0.09, 0.04);
    rightUpperArm.rotation.z = 0.4;
    rightUpperArm.rotation.x = 0.2;
    rightArmGroup.add(rightUpperArm);

    // Forearm & Hand group
    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(-0.09, -0.18, 0.08);
    rightArmGroup.add(rightForearmGroup);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.15, 20), bodyMat);
    rightForearm.position.set(-0.03, 0.08, 0.08);
    rightForearm.rotation.z = -0.5;
    rightForearm.rotation.x = -0.6;
    rightForearmGroup.add(rightForearm);

    // Hand palm with glowing cyan heart (raised in warm friendly greeting as in photo)
    const palmMesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 16), bodyMat);
    palmMesh.scale.set(0.8, 1.2, 0.5);
    palmMesh.position.set(-0.08, 0.19, 0.14);
    rightForearmGroup.add(palmMesh);

    // Palm glowing heart badge
    const palmHeartMesh = new THREE.Mesh(heartGeo, heartMat);
    palmHeartMesh.scale.set(0.25, -0.25, 0.25);
    palmHeartMesh.position.set(-0.08, 0.19, 0.165);
    rightForearmGroup.add(palmHeartMesh);

    // Cute articulated fingers
    [-0.02, 0, 0.02, 0.035].forEach((offset, idx) => {
      const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.025, 8, 12), bodyMat);
      finger.position.set(-0.08 + offset, 0.24 + (idx === 1 ? 0.01 : 0), 0.14);
      rightForearmGroup.add(finger);
    });

    // LEFT ARM (Relaxed at side)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.name = "LeftArm_Shoulder";
    leftArmGroup.position.set(0.25, 0.65, 0);
    robotRoot.add(leftArmGroup);
    leftArmGroupRef.current = leftArmGroup;

    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 20), accentMat);
    leftArmGroup.add(leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.18, 20), bodyMat);
    leftUpperArm.position.set(0.03, -0.10, 0);
    leftArmGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.16, 20), bodyMat);
    leftForearm.position.set(0.05, -0.24, 0.02);
    leftArmGroup.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), bodyMat);
    leftHand.position.set(0.06, -0.33, 0.03);
    leftArmGroup.add(leftHand);

    // HOLOGRAPHIC EMITTER FLOOR BASE
    const holoRingsGroup = new THREE.Group();
    holoRingsGroup.position.set(0, 0.02, 0);
    scene.add(holoRingsGroup);
    holoRingsGroupRef.current = holoRingsGroup;

    // Glowing Concentric Projection Rings
    const ringRadii = [0.25, 0.42, 0.65, 0.85];
    ringRadii.forEach((r, i) => {
      const ringGeo = new THREE.RingGeometry(r - 0.008, r, 64);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0x818cf8,
        transparent: true,
        opacity: 0.65 - i * 0.1,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      holoRingsGroup.add(ringMesh);
    });

    // Outer Tech Segmented Arc HUD
    const segGeo = new THREE.RingGeometry(0.72, 0.76, 48, 1, 0, Math.PI * 0.6);
    segGeo.rotateX(-Math.PI / 2);
    const segMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const segMesh = new THREE.Mesh(segGeo, segMat);
    holoRingsGroup.add(segMesh);

    const segMesh2 = segMesh.clone();
    segMesh2.rotation.y = Math.PI;
    holoRingsGroup.add(segMesh2);

    // HOLOGRAPHIC PARTICLES FIELD (Rising upward like holographic dust)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.2 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.random() * 1.5;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.016,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse Tracking Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x: nx, y: ny };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mousePosRef.current = { x: nx, y: ny };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const state = animStateRef.current;

      // Rotate Hologram floor rings
      if (holoRingsGroupRef.current) {
        const ringSpeed = state === "MEDI_LISTENING" ? 0.8 : 0.25;
        holoRingsGroupRef.current.rotation.y += 0.008 * (ringSpeed / 0.25);
      }

      // Animate Particles rising
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          array[i * 3 + 1] += 0.004;
          if (array[i * 3 + 1] > 1.6) {
            array[i * 3 + 1] = 0.05;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Procedural Character Kinematics & States
      if (robotGroupRef.current && headGroupRef.current && rightArmGroupRef.current) {
        // Floating bobbing & breathing
        const breatheFreq = state === "MEDI_ALERT" ? 4.0 : 1.8;
        const breatheAmp = state === "MEDI_ALERT" ? 0.04 : 0.018;
        const bobbing = Math.sin(elapsedTime * breatheFreq) * breatheAmp;
        robotGroupRef.current.position.y = bobbing;

        // Head tracking & state animation
        let targetHeadRotY = 0;
        let targetHeadRotX = 0;
        let targetHeadRotZ = 0;

        if (interactiveHead) {
          // Subtle look toward cursor
          targetHeadRotY = mousePosRef.current.x * 0.45;
          targetHeadRotX = -mousePosRef.current.y * 0.25;
        }

        // State-specific kinematics
        if (state === "MEDI_IDLE") {
          targetHeadRotY += Math.sin(elapsedTime * 0.8) * 0.08;
          targetHeadRotZ += Math.cos(elapsedTime * 0.6) * 0.03;
          // Right arm gentle breathing rest
          rightArmGroupRef.current.rotation.x = Math.sin(elapsedTime * 1.5) * 0.06;
          rightArmGroupRef.current.rotation.z = Math.cos(elapsedTime * 1.2) * 0.04;
        } else if (state === "MEDI_LISTENING") {
          // Attentive: perks up, leans forward curiously with an alert, welcoming companion head-tilt
          targetHeadRotX += 0.18;
          targetHeadRotZ += 0.10 + Math.sin(elapsedTime * 2.2) * 0.02; // Inquisitive companion ear-cock
          targetHeadRotY += 0.04;
          // Right arm raises attentively to chest/listening height, welcoming user voice
          rightArmGroupRef.current.rotation.x = 0.32 + Math.sin(elapsedTime * 2.8) * 0.03;
          rightArmGroupRef.current.rotation.z = 0.18;
          if (leftArmGroupRef.current) {
            leftArmGroupRef.current.rotation.x = 0.12 + Math.sin(elapsedTime * 2.5) * 0.02;
          }
        } else if (state === "MEDI_THINKING") {
          // Contemplative tilt up and to side
          targetHeadRotX -= 0.15;
          targetHeadRotY += 0.25;
          targetHeadRotZ -= 0.1;
          rightArmGroupRef.current.rotation.x = 0.1;
          rightArmGroupRef.current.rotation.z = 0.08;
        } else if (state === "MEDI_SPEAKING") {
          // Natural speech head nodding
          targetHeadRotX += Math.sin(elapsedTime * 4.5) * 0.06;
          targetHeadRotY += Math.cos(elapsedTime * 2.2) * 0.08;
          // Friendly waving gesture with right hand!
          rightArmGroupRef.current.rotation.x = 0.35 + Math.sin(elapsedTime * 5.0) * 0.15;
          rightArmGroupRef.current.rotation.z = 0.2 + Math.cos(elapsedTime * 4.0) * 0.1;
        } else if (state === "MEDI_ALERT") {
          // Alert posture
          targetHeadRotX += 0.08;
          targetHeadRotY += Math.sin(elapsedTime * 8.0) * 0.1;
          rightArmGroupRef.current.rotation.x = 0.45 + Math.sin(elapsedTime * 6.0) * 0.12;
          rightArmGroupRef.current.rotation.z = 0.3;
        }

        // Smooth Lerp transitions
        headGroupRef.current.rotation.y += (targetHeadRotY - headGroupRef.current.rotation.y) * 0.08;
        headGroupRef.current.rotation.x += (targetHeadRotX - headGroupRef.current.rotation.x) * 0.08;
        headGroupRef.current.rotation.z += (targetHeadRotZ - headGroupRef.current.rotation.z) * 0.08;

        // Heart pulse emissive
        if (heartMeshRef.current) {
          const heartMatInstance = heartMeshRef.current.material as THREE.MeshStandardMaterial;
          if (state === "MEDI_ALERT") {
            heartMatInstance.emissive.setHex(0xef4444); // red pulse
            heartMatInstance.emissiveIntensity = 2.0 + Math.sin(elapsedTime * 10) * 1.5;
          } else if (state === "MEDI_LISTENING") {
            heartMatInstance.emissive.setHex(0x06b6d4); // bright cyan
            heartMatInstance.emissiveIntensity = 2.4 + Math.sin(elapsedTime * 6) * 0.8;
          } else {
            heartMatInstance.emissive.setHex(0x38bdf8); // calm blue
            heartMatInstance.emissiveIntensity = 1.6 + Math.sin(elapsedTime * 2.5) * 0.6;
          }
        }

        // Visor eyes attentive dilation during listening
        if (eyesMeshRef.current) {
          if (state === "MEDI_LISTENING") {
            const listenPupilScale = 1.15 + Math.sin(elapsedTime * 4.0) * 0.05;
            eyesMeshRef.current.scale.set(listenPupilScale, listenPupilScale, listenPupilScale);
          } else {
            eyesMeshRef.current.scale.set(1.0, 1.0, 1.0);
          }
        }

        // Visor mouth pulse during speech
        if (mouthMeshRef.current) {
          if (state === "MEDI_SPEAKING") {
            const speechScale = 1.0 + Math.abs(Math.sin(elapsedTime * 12)) * 0.8;
            mouthMeshRef.current.scale.set(1.0, speechScale, 1.0);
          } else {
            mouthMeshRef.current.scale.set(1.0, 1.0, 1.0);
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [interactiveHead]);

  // Handle GLB file drag and drop / upload (for Blender 3D artists & funding partners)
  const handleGLBUpload = (file: File) => {
    if (!sceneRef.current) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as ArrayBuffer;
      const loader = new GLTFLoader();
      loader.parse(
        contents,
        "",
        (gltf) => {
          if (customModelGroupRef.current && sceneRef.current) {
            sceneRef.current.remove(customModelGroupRef.current);
          }
          if (robotGroupRef.current) {
            robotGroupRef.current.visible = false; // Hide procedural model
          }
          const model = gltf.scene;
          model.name = "Custom_Blender_MEDI";
          // Auto-scale to 1.20m target height
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const scaleFactor = 1.2 / (size.y || 1);
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);
          model.position.set(0, 0, 0);

          sceneRef.current?.add(model);
          customModelGroupRef.current = model;
          setModelType("custom");
          setCustomModelName(file.name);
        },
        (error) => {
          console.info("[MediScene] Could not parse custom GLB file, maintaining default MEDI avatar:", error);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleResetToBuiltin = () => {
    if (customModelGroupRef.current && sceneRef.current) {
      sceneRef.current.remove(customModelGroupRef.current);
      customModelGroupRef.current = null;
    }
    if (robotGroupRef.current) {
      robotGroupRef.current.visible = true;
    }
    setModelType("built-in");
    setCustomModelName(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] select-none overflow-hidden ${className}`}
    >
      {/* Real-time 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Holographic Subtle Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-24 animate-scan opacity-60" />

      {/* Ambient Vignette & Spatial Lighting Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,7,18,0.75)_95%)]" />

      {/* Real-time 3D Status Overlay Tag (Top Left of Canvas) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs text-cyan-300 font-mono tracking-wider shadow-lg shadow-cyan-950/40">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                animationState === "MEDI_ALERT"
                  ? "bg-rose-400"
                  : animationState === "MEDI_LISTENING"
                  ? "bg-cyan-400"
                  : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                animationState === "MEDI_ALERT"
                  ? "bg-rose-500"
                  : animationState === "MEDI_LISTENING"
                  ? "bg-cyan-500"
                  : "bg-emerald-500"
              }`}
            />
          </span>
          <span className="font-semibold text-slate-100">
            {animationState.replace("MEDI_", "")}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">REAL-TIME 3D</span>
        </div>

        {modelType === "custom" && customModelName && (
          <div className="px-2.5 py-1 rounded bg-violet-950/80 border border-violet-500/40 text-[11px] text-violet-300 font-mono flex items-center justify-between gap-2">
            <span>Model: {customModelName}</span>
            <button
              onClick={handleResetToBuiltin}
              className="text-xs hover:text-white underline"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 3D Scale HUD Reference (Virtual 1.20m metric height) */}
      {showScaleHUD && (
        <div className="absolute right-4 top-16 z-10 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md text-xs font-mono text-cyan-300 pointer-events-auto shadow-2xl w-56">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/50">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Blender Metric Rig
            </span>
            <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-800">
              Target 1.20m
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Height:</span>
              <span className="text-white font-semibold">1.20 m (120 cm)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Width / Depth:</span>
              <span className="text-white">0.48 m × 0.38 m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Head / Torso:</span>
              <span className="text-white">0.25 m / 0.40 m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Arms / Pod:</span>
              <span className="text-white">0.45 m / 0.45 m</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px] text-cyan-400">
              <span>Pipeline:</span>
              <span>Blender → Rig → GLB</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive 3D View Controls & Inspector Toolbar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl pointer-events-auto">
        {/* Wireframe toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          title="Toggle 3D Wireframe / Topology"
          className={`p-2 rounded-full transition-colors text-xs flex items-center gap-1 ${
            wireframe
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Mesh</span>
        </button>

        {/* Metric Scale HUD Toggle */}
        <button
          onClick={() => setShowScaleHUD(!showScaleHUD)}
          title="Inspect 1.20m Metric Proportions"
          className={`p-2 rounded-full transition-colors text-xs flex items-center gap-1 ${
            showScaleHUD
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">1.20m Scale</span>
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              cameraRef.current.position.set(0, 0.85, 2.7);
              controlsRef.current.target.set(0, 0.65, 0);
              controlsRef.current.update();
            }
          }}
          title="Reset Camera"
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Upload custom Blender GLB model */}
        <label
          title="Upload Blender .glb Model to test in prototype"
          className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Load GLB</span>
          <input
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleGLBUpload(f);
            }}
          />
        </label>
      </div>

      {/* Floating State Selector Pills (Bottom Center for testing animation states) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800/80 pointer-events-auto">
        {(
          [
            "MEDI_IDLE",
            "MEDI_LISTENING",
            "MEDI_THINKING",
            "MEDI_SPEAKING",
            "MEDI_ALERT",
          ] as MediAnimationState[]
        ).map((st) => {
          const isActive = animationState === st;
          const label = st.replace("MEDI_", "").toLowerCase();
          return (
            <button
              key={st}
              onClick={() => onStateChange?.(st)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all capitalize whitespace-nowrap ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

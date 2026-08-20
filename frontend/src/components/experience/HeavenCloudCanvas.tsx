import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeavenCloudCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup with Mountain Cool nocturnal atmospheric mist
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xddecfa, 0.0016);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1200
    );
    camera.position.z = 400;
    camera.position.y = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting in Mountain Cool palette
    const ambientLight = new THREE.AmbientLight(0xddecfa, 1.4);
    scene.add(ambientLight);

    const moonSunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    moonSunLight.position.set(150, 400, 300);
    scene.add(moonSunLight);

    const coolRimLight = new THREE.DirectionalLight(0x7aa2dc, 0.8);
    coolRimLight.position.set(-300, -100, -200);
    scene.add(coolRimLight);

    // Create Soft Volumetric Cloud Texture
    const createCloudTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(0.35, "rgba(235, 244, 253, 0.65)");
        gradient.addColorStop(0.7, "rgba(221, 236, 250, 0.2)");
        gradient.addColorStop(1, "rgba(221, 236, 250, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const cloudTexture = createCloudTexture();
    const cloudMaterial = new THREE.SpriteMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const cloudGroup = new THREE.Group();
    const cloudCount = 36;
    const clouds: { sprite: THREE.Sprite; basePos: THREE.Vector3 }[] = [];

    for (let i = 0; i < cloudCount; i++) {
      const sprite = new THREE.Sprite(cloudMaterial.clone());
      const x = (Math.random() - 0.5) * 950;
      const y = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 500 - 120;

      sprite.position.set(x, y, z);
      const scale = 200 + Math.random() * 280;
      sprite.scale.set(scale, scale * 0.65, 1);

      cloudGroup.add(sprite);
      clouds.push({
        sprite,
        basePos: new THREE.Vector3(x, y, z),
      });
    }
    scene.add(cloudGroup);

    // Soft Circular Stardust (NO square blocks!)
    const createStarTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(185, 215, 245, 0.7)");
        gradient.addColorStop(0.7, "rgba(100, 160, 230, 0.15)");
        gradient.addColorStop(1, "rgba(100, 160, 230, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();
    const starCount = 80;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 900;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 700;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      size: 4.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Mouse Interaction for interactive night sky
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interactive camera movement
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      camera.position.x = targetX * 0.5;
      camera.position.y = 15 - targetY * 0.35;
      camera.lookAt(0, 0, 0);

      // Gentle cloud drift
      clouds.forEach((cloud, index) => {
        cloud.sprite.position.x =
          cloud.basePos.x + Math.sin(elapsedTime * 0.12 + index) * 15;
        cloud.sprite.position.y =
          cloud.basePos.y + Math.cos(elapsedTime * 0.15 + index * 0.5) * 8;
      });

      // Subtle celestial rotation
      stars.rotation.y = elapsedTime * 0.008;
      stars.rotation.x = Math.sin(elapsedTime * 0.006) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cloudTexture.dispose();
      cloudMaterial.dispose();
      starTexture.dispose();
      starMaterial.dispose();
      starGeometry.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

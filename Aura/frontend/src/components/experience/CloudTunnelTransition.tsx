import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import gsap from "gsap";

interface CloudNavContextType {
  navigateWithClouds: (target: string, isRoute?: boolean) => void;
  isTransitioning: boolean;
}

const CloudNavContext = createContext<CloudNavContextType>({
  navigateWithClouds: () => {},
  isTransitioning: false,
});

export const useCloudNavigate = () => useContext(CloudNavContext);

export const CloudNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const threeStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    cloudSprites: THREE.Sprite[];
    fog: THREE.FogExp2;
    animFrameId: number;
  } | null>(null);

  // Initialize Three.js Volumetric Dreamlike Cloud Tunnel
  const initThree = useCallback(() => {
    const container = canvasContainerRef.current;
    if (!container || threeStateRef.current) return;

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0xddecfa, 0.0012);
    scene.fog = fog;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(65, width / height, 1, 3500);
    camera.position.set(0, 0, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Create high-res soft volumetric cloud texture with feathering
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      grad.addColorStop(0.3, "rgba(240, 248, 255, 0.75)");
      grad.addColorStop(0.6, "rgba(221, 236, 250, 0.35)");
      grad.addColorStop(0.85, "rgba(195, 218, 242, 0.1)");
      grad.addColorStop(1, "rgba(195, 218, 242, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE.CanvasTexture(canvas);

    // Dreamy ambient & directional lights
    const ambLight = new THREE.AmbientLight(0xddecfa, 2.4);
    scene.add(ambLight);

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(0, 200, 600);
    scene.add(sun);

    const tunnelLight = new THREE.PointLight(0x7aa2dc, 2.5, 2000);
    tunnelLight.position.set(0, 0, 0);
    scene.add(tunnelLight);

    // Generate Volumetric Cloud Tunnel Ring Array
    const cloudSprites: THREE.Sprite[] = [];
    const cloudCount = 140;
    const tunnelLength = 3200;
    const tunnelRadius = 340;

    for (let i = 0; i < cloudCount; i++) {
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const sprite = new THREE.Sprite(mat);

      // Smooth cylindrical tunnel distribution
      const angle = (i / cloudCount) * Math.PI * 10 + (Math.random() - 0.5) * 0.9;
      const r = tunnelRadius + (Math.random() - 0.5) * 240;
      const z = (Math.random() - 0.5) * tunnelLength;

      sprite.position.set(
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.75,
        z
      );

      const scale = 420 + Math.random() * 380;
      sprite.scale.set(scale, scale * 0.72, 1);
      scene.add(sprite);
      cloudSprites.push(sprite);
    }

    threeStateRef.current = {
      scene,
      camera,
      renderer,
      cloudSprites,
      fog,
      animFrameId: 0,
    };
  }, []);

  const navigateWithClouds = useCallback((target: string, isRoute: boolean = true) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (isRoute) {
        navigate(target);
      } else {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "auto" });
      }
      return;
    }

    initThree();
    const container = canvasContainerRef.current;
    const state = threeStateRef.current;

    if (!container || !state) {
      if (isRoute) navigate(target);
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsTransitioning(true);

    const { camera, renderer, scene, cloudSprites } = state;
    camera.position.set(0, 0, 1100);
    camera.rotation.set(0, 0, 0);

    cloudSprites.forEach((sprite) => {
      sprite.material.opacity = 0.65;
    });

    let running = true;
    const animate = () => {
      if (!running) return;
      state.animFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const tl = gsap.timeline({
      onComplete: () => {
        running = false;
        cancelAnimationFrame(state.animFrameId);
        setIsTransitioning(false);
        gsap.set(container, { opacity: 0, pointerEvents: "none" });
      },
    });

    // 2.4s cinematic volumetric passage with smooth cubic easing
    tl.set(container, { opacity: 0, pointerEvents: "auto" })
      .to(container, { opacity: 1, duration: 0.6, ease: "power2.in" })
      .to(
        camera.position,
        {
          z: -1200,
          duration: 2.4,
          ease: "power3.inOut",
          onUpdate: () => {
            camera.rotation.z = Math.sin(camera.position.z * 0.002) * 0.06;
          },
        },
        0
      )
      // Switch underlying route / section at peak cloud immersion
      .call(() => {
        if (isRoute) {
          navigate(target);
          window.scrollTo({ top: 0, behavior: "instant" });
        } else {
          const el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: "auto" });
          }
        }
      }, [], 1.2)
      // Clouds gently disperse as new page settles
      .to(container, { opacity: 0, duration: 0.8, ease: "power2.out" }, 1.6);

  }, [initThree, navigate]);

  return (
    <CloudNavContext.Provider value={{ navigateWithClouds, isTransitioning }}>
      {children}
      {/* Full-screen Fixed Volumetric Cloud Tunnel Overlay */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 z-[99999] pointer-events-none opacity-0 overflow-hidden bg-transparent"
        style={{ willChange: "opacity" }}
        aria-hidden="true"
      />
    </CloudNavContext.Provider>
  );
};

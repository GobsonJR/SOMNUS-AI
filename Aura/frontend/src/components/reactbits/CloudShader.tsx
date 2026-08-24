import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CloudShaderProps {
  className?: string;
  speed?: number;
  cloudColor?: string;
  skyColor?: string;
}

export default function CloudShader({
  className = "",
  speed = 0.5,
  cloudColor = "#ffffff",
  skyColor = "#ddecfa",
}: CloudShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const hexToVec3 = (hex: string) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    // Volumetric Procedural Cloud Shader GLSL
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColorSky;
      uniform vec3 uColorCloud;
      varying vec2 vUv;

      // 2D Random & Perlin/FBM Noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
        float t = uTime * 0.08;

        // Flowing atmospheric cloud density
        vec2 q = vec2(fbm(uv + vec2(t * 0.4, t * 0.1)),
                      fbm(uv + vec2(t * 0.2, t * 0.3)));

        vec2 r = vec2(fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                      fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t));

        float f = fbm(uv + r * 1.5);

        // Soft radial falloff so it blends smoothly around center
        float dist = length(vUv - 0.5) * 2.0;
        float mask = smoothstep(1.2, 0.2, dist);

        // Mix Sky and Cloud colors
        vec3 color = mix(uColorSky, uColorCloud, clamp(f * f * 3.5, 0.0, 1.0));
        color = mix(color, vec3(0.92, 0.96, 1.0), clamp(length(q), 0.0, 1.0) * 0.3);

        float alpha = clamp((f * 1.4 - 0.15) * mask, 0.0, 0.85);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uColorSky: { value: hexToVec3(skyColor) },
      uColorCloud: { value: hexToVec3(cloudColor) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(plane);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime() * speed;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
    };
  }, [speed, cloudColor, skyColor]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

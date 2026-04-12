"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;

    // --- Vertical blinds ---
    float blindCount = 14.0;
    float blindX = uv.x * blindCount;
    float blindIndex = floor(blindX);
    float blindFract = fract(blindX);

    // Each blind has depth — rounded shape with dark gaps
    float blindShape = smoothstep(0.0, 0.08, blindFract) * smoothstep(1.0, 0.92, blindFract);

    // 3D curvature on each blind — brighter in center, dark at edges
    float curvature = pow(sin(blindFract * 3.14159), 0.6);

    // Per-blind subtle sway
    float phase = hash(vec2(blindIndex, 1.0)) * 6.283;
    float sway = sin(u_time * 0.5 + phase) * 0.008;

    // --- Colors: deep red/orange like the reference ---
    vec3 darkRed = vec3(0.18, 0.02, 0.01);
    vec3 midRed = vec3(0.55, 0.08, 0.03);
    vec3 brightRed = vec3(0.91, 0.30, 0.12);
    vec3 hotOrange = vec3(0.95, 0.45, 0.18);

    // Base blind color — gradient from dark edges to mid
    vec3 blindColor = mix(darkRed, midRed, curvature);

    // --- Central spotlight / glow ---
    vec2 center = vec2(0.5, 0.45);
    vec2 mousePos = mix(center, u_mouse, 0.3); // subtle mouse influence
    float dist = distance(
      uv * vec2(aspect, 1.0),
      mousePos * vec2(aspect, 1.0)
    );

    // Soft radial spotlight
    float spot = 1.0 - smoothstep(0.0, 0.55, dist);
    spot = pow(spot, 1.8);

    // In the spotlight, blinds go from midRed -> brightRed -> hotOrange
    vec3 litColor = mix(midRed, brightRed, curvature);
    litColor = mix(litColor, hotOrange, curvature * spot * 0.7);

    blindColor = mix(blindColor, litColor, spot);

    // Specular highlight on each blind — thin bright line near center of each blind
    float specular = pow(max(0.0, 1.0 - abs(blindFract - 0.45) * 4.0), 3.0);
    blindColor += hotOrange * specular * spot * 0.6;

    // Apply blind shape (dark gaps between blinds)
    vec3 gapColor = vec3(0.02, 0.005, 0.003);
    vec3 col = mix(gapColor, blindColor, blindShape);

    // --- Vertical gradient: darker at top and bottom ---
    float vGrad = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.65, uv.y);
    col *= mix(0.3, 1.0, vGrad);

    // --- Horizontal vignette ---
    float hVig = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
    col *= mix(0.2, 1.0, hVig);

    // --- Subtle animated shine sweep ---
    float shineLine = fract(u_time * 0.06 - uv.x * 0.8 + blindIndex * 0.03);
    float shine = smoothstep(0.48, 0.50, shineLine) * smoothstep(0.52, 0.50, shineLine);
    col += hotOrange * shine * 0.15 * blindShape * vGrad;

    // --- Film grain ---
    float grain = (hash(uv * 800.0 + u_time * 5.0) - 0.5) * 0.06;
    col += grain;

    // --- Bottom fade to black for seamless blend ---
    float bottomFade = smoothstep(0.0, 0.15, uv.y);
    col *= bottomFade;

    // Top fade
    float topFade = smoothstep(1.0, 0.88, uv.y);
    col *= topFade;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

export default function GradientBlinds() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTime = gl.getUniformLocation(prog, "u_time");

    let mx = 0.5, my = 0.55, cx = 0.5, cy = 0.55;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = 1.0 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("mousemove", onMove);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, cx, cy);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

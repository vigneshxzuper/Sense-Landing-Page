"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEventHandler,
  type RefObject,
} from "react";
import { motion } from "framer-motion";

type FalloffType = "linear" | "exponential" | "gaussian";

type Props = {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: FalloffType;
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  style?: CSSProperties;
};

function useAnimationFrame(cb: () => void) {
  useEffect(() => {
    let id = 0;
    const loop = () => {
      cb();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [cb]);
}

function useMousePositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update = (x: number, y: number) => {
      const el = containerRef?.current;
      if (el) {
        const r = el.getBoundingClientRect();
        positionRef.current = { x: x - r.left, y: y - r.top };
      } else {
        positionRef.current = { x, y };
      }
    };
    const onMouse = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, Props>((props, ref) => {
  const {
    label,
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 800, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const parsedSettings = useMemo(() => {
    const parse = (s: string) =>
      new Map(
        s
          .split(",")
          .map((p) => p.trim())
          .map((p) => {
            const [name, value] = p.split(" ");
            return [name.replace(/['"]/g, ""), parseFloat(value)] as const;
          })
      );
    const from = parse(fromFontVariationSettings);
    const to = parse(toFontVariationSettings);
    return Array.from(from.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: to.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const dist = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const falloffFn = (d: number) => {
    const n = Math.min(Math.max(1 - d / radius, 0), 1);
    if (falloff === "exponential") return n ** 2;
    if (falloff === "gaussian")
      return Math.exp(-((d / (radius / 2)) ** 2) / 2);
    return n;
  };

  useAnimationFrame(() => {
    const c = containerRef?.current;
    if (!c) return;
    const cRect = c.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y)
      return;
    lastPositionRef.current = { x, y };

    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - cRect.left;
      const cy = r.top + r.height / 2 - cRect.top;
      const d = dist(x, y, cx, cy);
      if (d >= radius) {
        el.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }
      const f = falloffFn(d);
      const settings = parsedSettings
        .map(
          ({ axis, fromValue, toValue }) =>
            `'${axis}' ${fromValue + (toValue - fromValue) * f}`
        )
        .join(", ");
      interpolatedSettingsRef.current[i] = settings;
      el.style.fontVariationSettings = settings;
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: "inline", ...style }}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((ch) => {
            const idx = letterIndex++;
            return (
              <motion.span
                key={idx}
                ref={(el) => {
                  letterRefs.current[idx] = el;
                }}
                style={{
                  display: "inline-block",
                  fontVariationSettings:
                    interpolatedSettingsRef.current[idx],
                  transition: "font-variation-settings 420ms cubic-bezier(0.33, 1, 0.68, 1)",
                  willChange: "font-variation-settings",
                }}
                aria-hidden
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;

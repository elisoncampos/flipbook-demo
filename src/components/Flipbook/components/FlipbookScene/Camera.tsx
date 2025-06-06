import { useCoverStore } from "../../stores/cover";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";

export const Camera = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const coverHeight = useCoverStore((state) => state.totalHeight);

  useEffect(() => {
    let timeoutId: number;

    const handleInteraction = () => {
      setAutoRotate(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setAutoRotate(true);
      }, 20000);
    };

    window.addEventListener("click", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      clearTimeout(timeoutId);
    };
  }, []);

  const position = useMemo(() => {
    const x = 0;
    // pra compensar o scale;
    const y = coverHeight * 4;
    const z = 0;
    return new Vector3(x, y, z);
  }, [coverHeight]);

  return (
    <OrbitControls
      target={position}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      maxPolarAngle={Math.PI / 1.85} // Limitar o ângulo máximo para evitar a visão de baixo
      minDistance={1}
      maxDistance={16}
      dampingFactor={0.25}
      enableDamping={true}
    />
  );
};

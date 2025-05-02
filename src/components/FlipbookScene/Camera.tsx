import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Object3D, Vector3 } from "three";

interface CameraProps {
  target: Object3D | undefined;
}

export const Camera = ({ target }: CameraProps) => {
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

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

  return (
    <OrbitControls
      ref={controlsRef}
      target={target ? target.position : new Vector3(0, 0, 0)}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      maxPolarAngle={Math.PI / 1.85} // Limitar o ângulo máximo para evitar a visão de baixo
      minDistance={2}
      maxDistance={8}
      dampingFactor={0.25}
      enableDamping={true}
      // TODO: remover depois que spine estiver pronta
      minAzimuthAngle={-Math.PI / 2} // -90 graus
      maxAzimuthAngle={Math.PI / 2} // +90 graus
    />
  );
};

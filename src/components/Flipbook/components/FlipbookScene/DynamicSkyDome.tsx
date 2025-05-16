import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import {
  BackSide,
  EquirectangularReflectionMapping,
  TextureLoader,
} from "three";

const scale = 50;

export const DynamicSkyDome = ({
  environmentUrl,
}: {
  environmentUrl: string;
}) => {
  const texture = useLoader(TextureLoader, environmentUrl);

  useEffect(() => {
    texture.mapping = EquirectangularReflectionMapping;
    texture.colorSpace = "srgb";
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI;
    texture.flipY = true;
  }, [texture]);

  return (
    <mesh scale={[scale, -scale, scale]}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
    </mesh>
  );
};

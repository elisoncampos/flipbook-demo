import { Light } from "./Light";
import { FlipbookEnvironmentProps } from "../../types";
import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const scale = 50;

export const DynamicSkyDome = ({
  environmentUrl,
}: {
  environmentUrl: string;
}) => {
  const texture = useLoader(THREE.TextureLoader, environmentUrl);

  useEffect(() => {
    // Configura a textura para mapeamento equiretangular
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = "srgb";
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI;
    texture.flipY = true;
  }, [texture]);

  // Calcula a escala base uma única vez

  return (
    <mesh scale={[scale, -scale, scale]}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
};

export const FlipbookEnvironment = ({
  environmentUrl,
}: FlipbookEnvironmentProps) => {
  const groupRef = useRef<Group>(null);

  const environment = useMemo(
    () => environmentUrl && <DynamicSkyDome environmentUrl={environmentUrl} />,
    [environmentUrl]
  );

  const light = useMemo(() => <Light />, []);

  return (
    <group ref={groupRef}>
      {light}
      {environment}
    </group>
  );
};

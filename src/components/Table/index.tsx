import { useCoverStore } from "@/stores/cover";
import { forwardRef } from "react";
import { Group, DoubleSide } from "three";

interface TableProps {
  topHeight?: number;
  footerRadius?: number;
  footerHeight?: number;
}

export const Table = forwardRef<Group, TableProps>(
  ({ topHeight = 0.05, footerRadius = 0.5, footerHeight = 10 }, ref) => {
    const width = useCoverStore((state) => state.width);

    const topRadius = width * 0.75;

    return (
      <group ref={ref}>
        {/* Tampo da mesa redonda de vidro */}
        <mesh position={[0, topHeight / 2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[topRadius, topRadius, topHeight, 64]} />
          <meshStandardMaterial
            attach="material"
            color={0x1e2a3d} // Azul escuro para o vidro
            transparent={true}
            opacity={0.8} // Opacidade do vidro
            roughness={0.0} // Superfície completamente lisa
            metalness={0.0} // Vidro não é metálico
            envMapIntensity={1.0} // Reflexão do ambiente com maior intensidade
            flatShading={false} // Sombramento suave
            side={DoubleSide} // Aplica o material a ambos os lados da geometria
          />
        </mesh>

        {/* Pé central da mesa com material metálico */}
        <mesh
          position={[0, -footerHeight / 2 - topHeight / 2, 0]}
          receiveShadow
          castShadow
        >
          <cylinderGeometry
            args={[footerRadius / 2, footerRadius / 2, footerHeight, 32]}
          />
          <meshStandardMaterial
            attach="material"
            color={0x808080}
            roughness={0.2}
            metalness={0.9}
            side={DoubleSide}
          />
        </mesh>
      </group>
    );
  }
);

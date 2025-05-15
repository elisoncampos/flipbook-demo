import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Group, MeshStandardMaterial } from "three";
import {
  createPaperTexture,
  usePageTextures,
} from "../../hooks/book/useBookTextures";
import { SinglePageObject, SinglePageProps } from "../../types";
import { usePageStore } from "../../stores/page";
import { useSharedMaterials } from "../../hooks/utils/useSharedMaterials";

const sharedMaterials = Array.from(
  { length: 6 },
  () => new MeshStandardMaterial({ map: createPaperTexture() })
);

export const SinglePage = forwardRef<SinglePageObject, SinglePageProps>(
  ({ data, onClick, visible = true }, ref) => {
    const innerRef = useRef<Group>(null);

    useImperativeHandle(
      ref,
      () => {
        const group = innerRef.current;
        if (!group) {
          throw new Error("reference is not initialized.");
        }

        return Object.assign(group, {
          thickness: data.thickness,
        });
      },
      [data.thickness]
    );

    const width = usePageStore((state) => state.width);
    const height = usePageStore((state) => state.height);

    const { frontTexture, backTexture } = usePageTextures(
      data.front,
      data.back,
      data.color
    );

    const materials = useSharedMaterials({
      baseMaterials: sharedMaterials,
      textures: [
        { texture: frontTexture, index: 4 },
        { texture: backTexture, index: 5 },
      ],
    });

    return useMemo(
      () => (
        <group ref={innerRef} onClick={onClick}>
          <mesh
            position={[0, 0, width / 2]}
            rotation={[0, -Math.PI / 2, 0]}
            castShadow
            receiveShadow
            material={materials}
            visible={visible}
          >
            <boxGeometry args={[width, height, data.thickness]} />
          </mesh>
        </group>
      ),
      [data.thickness, height, materials, onClick, visible, width]
    );
  }
);

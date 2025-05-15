import { useBones } from "../../hooks/PagesGatherer/useBones";
import { useFlipperStore } from "../../stores/flipper";
import { PagesGathererObject, PagesGathererProps } from "../../types";
import { radQuartenion } from "../../utils/quartenion";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Bone, Group } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const openAngle = degToRad(180);

export const PagesGatherer = forwardRef<
  PagesGathererObject,
  PagesGathererProps
>(({ pagesData }, ref) => {
  const currentPage = useFlipperStore((state) => state.currentPage);

  const innerRef = useRef<Group>(null);
  const boneRef = useRef<Bone>(null);

  const { bones } = useBones({ pagesData });

  const { openPage, closedPage } = useMemo(
    () => ({
      openPage: radQuartenion(-openAngle),
      closedPage: radQuartenion(0),
    }),
    []
  );

  const turningSpeed = useFlipperStore((state) => state.turningSpeed);
  const pageTotal = useFlipperStore((state) => state.totalPages);

  useImperativeHandle(
    ref,
    () => ({
      assingPages(pages: Group[]) {
        if (!bones) return;

        pages.forEach((pageGroup, index) => {
          const reverseIndex = pages.length - index - 1;
          const bone = bones[reverseIndex];
          if (!bone) {
            throw new Error("Bone not found");
          }

          pageGroup.position.x = pagesData[index].thickness / 2;
          pageGroup.rotation.y = Math.PI;
          bone.add(pageGroup);
        });
      },
      getBones() {
        return bones;
      },
    }),
    [bones, pagesData]
  );

  useFrame(() => {
    if (!innerRef.current) return;
    if (!bones) return;

    const activeIndex = pageTotal - currentPage + 1;

    bones.forEach((bone, index) => {
      const isActive = index === activeIndex;
      const targetQuaternion = isActive ? openPage : closedPage;

      if (bone.quaternion.angleTo(targetQuaternion) > 0.001) {
        bone.quaternion.slerp(targetQuaternion, turningSpeed);
      } else {
        bone.quaternion.copy(targetQuaternion);
      }
    });
  });

  return useMemo(
    () => (
      <group ref={innerRef} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={bones?.[0]} ref={boneRef} />
      </group>
    ),
    [bones]
  );
});

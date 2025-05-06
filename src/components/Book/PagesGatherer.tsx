import { useBones } from "@/hooks/PagesGatherer/useBones";
import { usePageStore } from "@/stores/page";
import { PageDefinition } from "@/types";
import { radQuartenion } from "@/utils/quartenion";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Bone, Group } from "three";

export interface PagesGathererActions {
  assingPages: (pages: Group[]) => void;
  getBones: () => Bone[] | undefined;
}

interface PagesGathererProps {
  currentPage: number;
  pagesData: PageDefinition[];
}

export const PagesGatherer = forwardRef<
  PagesGathererActions,
  PagesGathererProps
>(({ currentPage, pagesData }, ref) => {
  const innerRef = useRef<Group>(null);
  const boneRef = useRef<Bone>(null);

  const { bones } = useBones({ pagesData });

  const { openPage, closedPage } = useMemo(
    () => ({
      openPage: radQuartenion(-Math.PI),
      closedPage: radQuartenion(0),
    }),
    []
  );

  const turningSpeed = usePageStore((state) => state.turningSpeed);
  const pageTotal = usePageStore((state) => state.total);

  useImperativeHandle(ref, () => ({
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
  }));

  useFrame(() => {
    if (!innerRef.current) return;
    if (!bones) return;

    const activeIndex = pageTotal + 2 - currentPage + 1;

    bones.forEach((bone, index) => {
      if (index === 0) return;

      const isActive = index === activeIndex;
      const targetQuaternion = isActive ? openPage : closedPage;

      if (bone.quaternion.angleTo(targetQuaternion) > 0.001) {
        bone.quaternion.slerp(targetQuaternion, turningSpeed);
      } else {
        bone.quaternion.copy(targetQuaternion);
      }
    });
  });

  return (
    <group ref={innerRef}>
      <primitive
        object={bones?.[0]}
        ref={boneRef}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
});

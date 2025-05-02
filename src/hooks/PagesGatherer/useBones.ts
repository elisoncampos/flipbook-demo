import { PageDefinition } from "@/types";
import { useMemo } from "react";
import { Bone } from "three";

interface UseBones {
  pagesData: PageDefinition[];
}

export const useBones = ({ pagesData }: UseBones) => {
  const totalWidth = useMemo(() => {
    return pagesData.reduce((acc, page) => {
      return acc + page.thickness;
    }, 0);
  }, [pagesData]);

  return useMemo(() => {
    const bones: Bone[] = [];

    const rootBone = new Bone();
    rootBone.name = "rootBone";

    for (let i = 0; i < pagesData.length; i++) {
      const bone = new Bone();
      bones.push(bone);

      if (i === 0) {
        rootBone.add(bone);
      } else {
        const prevBone = bones[i - 1];
        prevBone.add(bone);
      }

      bone.position.x = pagesData[i].thickness;
    }

    rootBone.position.x = -totalWidth / 2;

    bones.unshift(rootBone);
    return {
      bones,
    };
  }, [pagesData, totalWidth]);
};

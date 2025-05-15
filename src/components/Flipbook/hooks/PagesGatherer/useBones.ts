import { UseBones } from "../../types";
import { useMemo } from "react";
import { Bone } from "three";

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

    for (let i = pagesData.length - 1; i >= 0; i--) {
      const bone = new Bone();
      bones.push(bone);

      if (i === pagesData.length - 1) {
        rootBone.add(bone);
      } else {
        const prevBone = bones[pagesData.length - i - 2];
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

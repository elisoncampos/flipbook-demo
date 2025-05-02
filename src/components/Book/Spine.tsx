import { useCoverStore } from "@/stores/cover";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import {
  Bone,
  BoxGeometry,
  Float32BufferAttribute,
  Group,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { CCDIKSolver } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";

export interface SpineActions {
  getBones: () => Bone[] | undefined;
  getObject: () => Group | null;
}

interface SpineProps {}

export const Spine = forwardRef<SpineActions, SpineProps>(({}, ref) => {
  const innerRef = useRef<Group>(null);
  const meshRef = useRef<SkinnedMesh>(null);
  const solverRef = useRef<CCDIKSolver>(null);

  const height = useCoverStore((state) => state.totalHeight);
  const thickness = useCoverStore((state) => state.thickness);

  const spineWidth = useCoverStore((state) => state.spineWidth);
  const guardWidth = useCoverStore((state) => state.guardWidth);
  const outsideColor = useCoverStore((state) => state.outsideColor);

  const totalWidth = useMemo(() => {
    return spineWidth + guardWidth * 2;
  }, [spineWidth, guardWidth]);

  const bones = useMemo(() => {
    const rootBone = new Bone();
    rootBone.position.x = -totalWidth / 2;

    const pivotBone = new Bone();

    const backGuard = new Bone();
    const coverGuard = new Bone();
    const spine = new Bone();
    const targetBone = new Bone();

    rootBone.add(pivotBone);

    pivotBone.add(coverGuard);
    coverGuard.position.x = guardWidth;

    coverGuard.add(spine);
    spine.position.x = spineWidth;

    spine.add(backGuard);
    backGuard.position.x = guardWidth;

    rootBone.add(targetBone);

    /* const cube = new BoxGeometry(0.05, 0.05, 0.05);

    const material = new MeshStandardMaterial({ color: "red" });

    const cubeMesh = new Mesh(cube, material);

    targetBone.add(cubeMesh) */

    return [rootBone, pivotBone, coverGuard, spine, backGuard, targetBone];
  }, [totalWidth, guardWidth, spineWidth]);

  const { mesh } = useMemo(() => {
    const geometry = new BoxGeometry(
      totalWidth,
      height,
      thickness,
      (totalWidth / guardWidth) * 10,
      1,
      1
    );

    const skinIndices: number[] = [];
    const skinWeights: number[] = [];
    const position = geometry.attributes.position;
    const vertex = new Vector3();

    const boundaries = [
      {
        start: 0,
        end: guardWidth,
        boneIndex: 1,
      },
      {
        start: guardWidth,
        end: guardWidth * 2,
        boneIndex: 2,
      },
      {
        start: guardWidth * 2,
        end: guardWidth * 3,
        boneIndex: 2,
      },
      {
        start: guardWidth * 3,
        end: guardWidth * 4,
        boneIndex: 3,
      },
      {
        start: guardWidth * 4,
        end: guardWidth * 5,
        boneIndex: 4,
      },
    ];
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const x = vertex.x;
      const positiveX = x + totalWidth / 2;
      const clampedX = Math.max(0, Math.min(positiveX, totalWidth));

      let boneIndex = -1;
      for (let j = 0; j < boundaries.length; j++) {
        const { start, end, boneIndex: index } = boundaries[j];
        if (clampedX >= start && clampedX <= end) {
          boneIndex = index;
          break;
        }
      }

      if (boneIndex === -1) {
        console.warn("No bone index found for vertex", clampedX);
        continue;
      }

      skinIndices.push(boneIndex, 0, 0, 0);
      skinWeights.push(1, 0, 0, 0);
    }

    geometry.setAttribute(
      "skinIndex",
      new Uint16BufferAttribute(skinIndices, 4)
    );
    geometry.setAttribute(
      "skinWeight",
      new Float32BufferAttribute(skinWeights, 4)
    );

    const skeleton = new Skeleton(bones);
    const mesh = new SkinnedMesh(
      geometry,
      new MeshStandardMaterial({
        visible: true,
        // TODO: usar textura de imagem depois da demo
        color: outsideColor,
        roughness: 0.1,
      })
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);

    return { geometry, mesh };
  }, [bones, outsideColor, totalWidth, height, thickness, guardWidth]);

  useImperativeHandle(ref, () => ({
    getBones: () => bones,
    getObject: () => innerRef.current,
  }));

  useFrame(() => {
    if (!meshRef.current) return;
    if (!solverRef.current) {
      const iks = [
        {
          target: 5,
          effector: 4,
          links: [
            {
              limit: new Vector3(0, 1, 0),
              index: 3,
              rotationMin: new Vector3(0, degToRad(-331), 0),
              rotationMax: new Vector3(0, degToRad(290), 0),
            },
            {
              limit: new Vector3(0, 1, 0),
              index: 2,
              rotationMin: new Vector3(0, degToRad(-360), 0),
              rotationMax: new Vector3(0, degToRad(360), 0),
            },
            {
              limit: new Vector3(0, 1, 0),
              index: 1,
              rotationMin: new Vector3(0, degToRad(45), 0),
              rotationMax: new Vector3(0, degToRad(360), 0),
            },
          ],
          iterations: 360,
          maxAngle: degToRad(0.5),
        },
      ];

      solverRef.current = new CCDIKSolver(meshRef.current, iks);
    }

    solverRef.current.update();
  });

  /*  const jointLimits = useRef([
    { min: 0, max: 0 }, // Joint 1
    { min: 0, max: 0 }, // Joint 2
    { min: 0, max: 0 }, // Joint 3
  ]);
// fine tune joint limits
  const controls = useControls("Joint Limits", {
    joint1Min: { value: -331, min: -360, max: 360, step: 1 },
    joint1Max: { value: 290, min: -360, max: 360, step: 1 },
    joint2Min: { value: -360, min: -360, max: 360, step: 1 },
    joint2Max: { value: 360, min: -360, max: 360, step: 1 },
    joint3Min: { value: 45, min: -360, max: 360, step: 1 },
    joint3Max: { value: 360, min: -360, max: 360, step: 1 },
  });

  useEffect(() => {
    jointLimits.current = [
      { min: controls.joint1Min, max: controls.joint1Max },
      { min: controls.joint2Min, max: controls.joint2Max },
      { min: controls.joint3Min, max: controls.joint3Max },
    ];

    if (solverRef.current) {
      const links = solverRef.current.iks[0].links;
      jointLimits.current.forEach((limit, i) => {
        links[i].rotationMin!.set(0, degToRad(limit.min), 0);
        links[i].rotationMax!.set(0, degToRad(limit.max), 0);
      });
    }
    solverRef.current?.update();
  }, [controls]); */

  return (
    <group
      ref={innerRef}
      position={[0, 0, -guardWidth]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <primitive object={mesh} ref={meshRef} rotation={[0, 0, 0]} />
    </group>
  );
});

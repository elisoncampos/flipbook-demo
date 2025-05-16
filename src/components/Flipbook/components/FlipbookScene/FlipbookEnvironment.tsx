import { useMemo, useRef } from "react";
import { FlipbookEnvironmentProps } from "../../types";
import { Group } from "three";
import { DynamicSkyDome } from "./DynamicSkyDome";
import { Light } from "./Light";

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

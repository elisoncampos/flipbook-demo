import { Environment } from "@react-three/drei";
import { Light } from "./Light";
import { FlipbookEnvironmentProps } from "../../types";
import { useMemo } from "react";

export const FlipbookEnvironment = ({
  environmentUrl,
}: FlipbookEnvironmentProps) => {
  return useMemo(
    () => (
      <group>
        <Light />
        <Environment
          preset={environmentUrl ? undefined : "studio"}
          files={environmentUrl}
          background={!!environmentUrl}
        />
      </group>
    ),
    [environmentUrl]
  );
};

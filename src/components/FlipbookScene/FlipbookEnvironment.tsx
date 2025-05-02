import { Environment } from "@react-three/drei";
import { Light } from "./Light";

interface FlipbookEnvironmentProps {
  environmentUrl?: string;
}

export const FlipbookEnvironment = ({
  environmentUrl,
}: FlipbookEnvironmentProps) => {

  return (
    <group>
      <Light />
      <Environment
        preset={environmentUrl ? undefined : "studio"}
        files={environmentUrl}
        background={!!environmentUrl}
      />
    </group>
  );
};

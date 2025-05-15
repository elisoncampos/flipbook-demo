import { Book } from "../../components/Book";
import { Table } from "../../components/Table";
import { Camera } from "./Camera";
import { FlipbookEnvironment } from "./FlipbookEnvironment";
import { FlipbookSceneProps } from "../../types";
import { useMemo } from "react";

export const FlipbookScene = ({ environmentUrl }: FlipbookSceneProps) => {
  return useMemo(
    () => (
      <group>
        <FlipbookEnvironment environmentUrl={environmentUrl} />
        <group>
          <Book />
          <Table />
        </group>
        <Camera />
      </group>
    ),
    [environmentUrl]
  );
};

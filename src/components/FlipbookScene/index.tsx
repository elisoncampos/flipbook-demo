import { Book } from "@/components/Book";
import { Table } from "@/components/Table";
import { Camera } from "./Camera";
import { BookActions } from "@/types";
import { FlipbookEnvironment } from "./FlipbookEnvironment";

interface FlipbookSceneProps {
  bookRef: React.RefObject<BookActions | null>;
  environmentUrl?: string;
}

export const FlipbookScene = ({
  bookRef,
  environmentUrl,
}: FlipbookSceneProps) => {

  return (
    <group>
      <FlipbookEnvironment environmentUrl={environmentUrl} />
      <group>
        <Book ref={bookRef} />
        <Table />
      </group>
      <Camera />
    </group>
  );
};

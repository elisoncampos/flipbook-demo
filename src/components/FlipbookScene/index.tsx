import { Object3D, Group } from "three";
import { Book } from "@/components/Book";
import { Table } from "@/components/Table";
import { Camera } from "./Camera";
import { useEffect, useRef, useState } from "react";
import { BookActions } from "@/types";
import { FlipbookEnvironment } from "./FlipbookEnvironment";
import { useCoverStore } from "@/stores/cover";

interface FlipbookSceneProps {
  bookRef: React.RefObject<BookActions | null>;
  environmentUrl?: string;
}

export const FlipbookScene = ({
  bookRef,
  environmentUrl,
}: FlipbookSceneProps) => {
  const tableRef = useRef<Group>(null);
  const coverHeight = useCoverStore((state) => state.height);
  const [target, setTarget] = useState<Object3D>();

  useEffect(() => {
    if (!bookRef.current || !tableRef.current) return;
    const bookObj = bookRef.current.getObject();

    tableRef.current.add(bookObj);
    bookObj.position.set(0, coverHeight / 2, 0);

    setTarget(bookObj);
  }, [coverHeight, bookRef]);

  return (
    <group>
      <FlipbookEnvironment environmentUrl={environmentUrl} />
      <group>
        <Book ref={bookRef} />
        <Table ref={tableRef} />
      </group>
      <Camera target={target} />
    </group>
  );
};

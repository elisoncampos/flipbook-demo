import { Vector3, Object3D, Group, Box3 } from "three";
import { Book } from "@/components/Book";
import { Table } from "@/components/Table";
import { Camera } from "./Camera";
import { useEffect, useRef, useState } from "react";
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
  const tableRef = useRef<Group>(null);

  const [target, setTarget] = useState<Object3D>();

  useEffect(() => {
    let frameId: number;

    const tryPositionBook = () => {
      if (!bookRef.current || !tableRef.current) {
        frameId = requestAnimationFrame(tryPositionBook);
        return;
      }

      const bookObj = bookRef.current.getObject();
      if (!bookObj) {
        frameId = requestAnimationFrame(tryPositionBook);
        return;
      }

      const tableWorldPos = tableRef.current.getWorldPosition(new Vector3());
      const tableBox = new Box3().setFromObject(tableRef.current);
      const tableTopY = tableBox.max.y;

      const bookBox = new Box3().setFromObject(bookObj);
      const bookHeight = bookBox.max.y - bookBox.min.y;

      const newBookY = tableTopY + bookHeight / 2;

      bookObj.position.set(tableWorldPos.x, newBookY, tableWorldPos.z);

      setTarget(bookObj);
    };

    frameId = requestAnimationFrame(tryPositionBook);

    return () => cancelAnimationFrame(frameId);
  }, []);

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

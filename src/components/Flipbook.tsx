import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { FlipbookScene } from "@/components/FlipbookScene";
import { FlipbookApi } from "@/hooks/flipbook/useFlipbook";
import { useBookLoader } from "@/hooks/book/useBookLoader";
import { useBookStore } from "@/stores/book";

type FlipbookProps = {
  book: FlipbookApi["book"];
  pages: string[];
  frontCover: string | null;
  backCover: string | null;
  environmentUrl?: string;
};

export const Flipbook = ({
  book,
  pages,
  frontCover,
  backCover,
  environmentUrl,
}: FlipbookProps) => {
  const loaded = useBookStore((state) => state.loaded);

  useBookLoader({
    images: pages,
    frontCover,
    backCover,
  });

  return (
    <Suspense fallback={null}>
      {loaded && (
        <Canvas camera={{ position: [0, 3, 10], fov: 45 }} shadows>
          <FlipbookScene bookRef={book.ref} environmentUrl={environmentUrl} />
        </Canvas>
      )}
    </Suspense>
  );
};

export { Flipbook as default };

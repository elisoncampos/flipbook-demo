import { useEffect } from "react";
import "./App.css";
import { Flipbook, useFlipbook } from "./components/Flipbook";
import Loader from "./components/Loader";

import { crop } from "./utils/crop";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";

const App = () => {
  const images = [
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-1.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-2.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-3.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-4.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-5.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-6.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-7.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-8.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-9.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-10.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-11.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-12.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-13.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-14.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-15.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-16.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-17.jpg",
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/image-18.jpg",
  ];

  const scaledWidth = 2048 / 2;
  const scaledHeight = 1024 / 2;

  const croppedImages = images
    .map((image) => {
      return [
        crop(image, scaledWidth, scaledHeight, "cl"),
        crop(image, scaledWidth, scaledHeight, "cr"),
      ];
    })
    .flat();

  const cover =
    "https://goimage-3d-viewer.s3.sa-east-1.amazonaws.com/projects/5e1decbc9170d30001b259a9/capa 30x30.jpg";
  const frontCover = crop(cover, scaledWidth, scaledHeight, "cl");
  const backCover = crop(cover, scaledWidth, scaledHeight, "cr");

  const { book } = useFlipbook();
  const { nextPage, prevPage, loaded } = book;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === "ArrowRight") {
        nextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  return (
    <div className="h-screen w-screen bg-neutral-800">
      <div className="absolute bottom-2 flex justify-center w-full gap-6 z-50">
        <button
          className="bg-neutral-700 text-white px-3 py-1 rounded-md flex items-center gap-2 hover:cursor-pointer"
          onClick={prevPage}
        >
          <SquareArrowLeft className="w-4 h-4" />
          <span className="text-sm">Página anterior</span>
        </button>
        <button
          className="bg-neutral-700 text-white px-3 py-1 rounded-md flex items-center gap-2 hover:cursor-pointer"
          onClick={nextPage}
        >
          <span className="text-sm">Próxima página</span>
          <SquareArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!loaded && <Loader />}

      <div className="h-full w-full">
        <Flipbook
          pages={croppedImages}
          hasGuardPage={false}
          guardPageColor="#000000"
          frontCover={frontCover}
          backCover={backCover}
          environmentUrl="family-2.jpg"
          preload={true}
        />
      </div>
    </div>
  );
};

export default App;

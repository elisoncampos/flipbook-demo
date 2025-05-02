import "./App.css";
import Flipbook from "./components/Flipbook";
import { useFlipbook } from "./hooks/flipbook/useFlipbook";
import { crop } from "./utils/crop";

const App = () => {
  const images = [
    "https://i.postimg.cc/SxMzZBRB/L01-P00-01.jpg",
    "https://i.postimg.cc/HxhY1LPB/L02-P02-03.jpg",
    "https://i.postimg.cc/SRYySpBq/L03-P04-05.jpg",
    "https://i.postimg.cc/7bvqbW4z/L04-P06-07.jpg",
    "https://i.postimg.cc/nVX7j9ZV/L05-P08-09.jpg",
    "https://i.postimg.cc/8kxvhkPR/L06-P10-11.jpg",
    "https://i.postimg.cc/BQDKNWXd/L07-P12-13.jpg",
    "https://i.postimg.cc/t4jVMr67/L08-P14-15.jpg",
    "https://i.postimg.cc/vBQgZDhy/L09-P16-17.jpg",
    "https://i.postimg.cc/wv0tyH4m/L10-P18-19.jpg",
    "https://i.postimg.cc/sxxM58b0/L11-P20-21.jpg",
    "https://i.postimg.cc/CKCn0bjJ/L12-P22-23.jpg",
    "https://i.postimg.cc/Wzyh88vp/L13-P24-25.jpg",
    "https://i.postimg.cc/bwks01F8/L14-P26-27.jpg",
    "https://i.postimg.cc/VLSS6xqJ/L15-P28-29.jpg",
    "https://i.postimg.cc/yYwDSLjv/L16-P30-31.jpg",
    "https://i.postimg.cc/rpTzfzv4/L17-P32-33.jpg",
    "https://i.postimg.cc/BvCbk40V/L18-P34-35.jpg",
    "https://i.postimg.cc/ydYxzt6Y/L19-P36-37.jpg",
    "https://i.postimg.cc/Px3xfyNb/L20-P38-39.jpg",
    "https://i.postimg.cc/mkPrP9Fv/L21-P40-41.jpg",
    "https://i.postimg.cc/Wzx1g4Gh/L22-P42-43.jpg",
    "https://i.postimg.cc/FF6R2TMN/L23-P44-45.jpg",
    "https://i.postimg.cc/02JQxpvm/L24-P46-47.jpg",
    "https://i.postimg.cc/13G3Vsf3/L25-P48-49.jpg",
    "https://i.postimg.cc/dVP00LQf/L26-P50-51.jpg",
    "https://i.postimg.cc/Lsm6zw1B/L27-P52-53.jpg",
    "https://i.postimg.cc/cJT1Th7q/L28-P54-55.jpg",
    "https://i.postimg.cc/ydd1GRnD/L29-P56-57.jpg",
  ];

  const scaledWidth = 1417 * 4;
  const scaledHeight = 709 * 4;

  const croppedImages = images
    .map((image) => {
      return [
        crop(image, scaledWidth, scaledHeight, "cl"),
        crop(image, scaledWidth, scaledHeight, "cr"),
      ];
    })
    .flat();

  const frontCover = "https://picsum.photos/id/1/3050/2875";
  const backCover = "https://picsum.photos/id/1/3050/2875";

  const { book } = useFlipbook();
  const { nextPage, prevPage, setPage } = book;

  return (
    <div>
      <div
        style={{
          margin: "0 auto",
          width: "fit-content",
        }}
      >
        <button onClick={prevPage}>previousPage</button>
        <button onClick={() => setPage(5)}>Flip to Page 5</button>
        <button onClick={nextPage}>nextPage</button>
      </div>

      <div style={{ width: "100vw", height: "100vh" }}>
        <Flipbook
          book={book}
          pages={croppedImages}
          frontCover={frontCover}
          backCover={backCover}
          environmentUrl="family-2.jpg"
        />
      </div>
    </div>
  );
};

export default App;

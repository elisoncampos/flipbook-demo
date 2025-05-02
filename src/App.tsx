import "./App.css";
import Flipbook from "./components/Flipbook";
import { useFlipbook } from "./hooks/flipbook/useFlipbook";

const App = () => {
  const pages = Array.from(
    { length: 32 },
    (_, i) => `https://picsum.photos/id/${i + 1}/2840/2840`
  );

  const frontCover = "https://picsum.photos/id/1/3000/3000";
  const backCover = "https://picsum.photos/id/1/3000/3000";

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
          pages={pages}
          frontCover={frontCover}
          backCover={backCover}
          environmentUrl="family-2.jpg"
        />
      </div>
    </div>
  );
};

export default App;

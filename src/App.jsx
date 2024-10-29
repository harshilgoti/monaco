import "./App.css";
import SqlEditor from "./monaco";

function App() {
  return (
    <div
      style={{
        height: "1000px",
        width: "1000px",
      }}
    >
      <SqlEditor />
    </div>
  );
}

export default App;

import "./App.css";

import Header from "./components/Header";
import Router from "./Router";

function App() {
  return (
    <main>
      <Router>
        <Header />
      </Router>
    </main>
  );
}

export default App;

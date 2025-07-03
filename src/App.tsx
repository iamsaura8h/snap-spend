
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Saurabh from "./pages/Saurabh";
import Sau2 from "./pages/Sau2";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Saurabh />} />
      <Route path="/chatbot" element={<Sau2 />} />
      <Route path="*" element={<Saurabh />} />
    </Routes>
  </BrowserRouter>
);

export default App;

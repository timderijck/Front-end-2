import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const {data, error} = await supabase.from("instruments").select();

    if (error) {
      console.error(error);
      return;
    }

    setInstruments(data);
  }

  return (
      <>
        <Router>
          <Routes>
            <Route
                exact
                path="/"
                element={<App/>}
            />
            <Route
                path="/login"
                element={<Login/>}
            />
          </Routes>
        </Router>
        <ul>
          {instruments.map((item) => (
              <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </>
  );
}
export default App;
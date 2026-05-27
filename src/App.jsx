import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data, error } = await supabase.from("instruments").select();

    if (error) {
      console.error(error);
      return;
    }

    setInstruments(data);
  }

  return (
      <ul>
        {instruments.map((item) => (
            <li key={item.name}>{item.name}</li>
        ))}
      </ul>
  );
}

export default App;
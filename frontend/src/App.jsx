import { useState, useEffect } from "react";
import { RefreshCw, Save, Copy, Lock, Unlock, Check } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api/palettes";

export default function App() {
  const [palette, setPalette] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedPalettes, setSavedPalettes] = useState([]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color =l -a *Math.max(Math.min(k - 3, 9 - k, 1),-1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 35) + 55;
    const current = palette.length > 0 ? palette: Array.from({ length: 5 }, () => ({hex: "",locked: false}));

    const newPalette = current.map((color, index) => {
      if (color.locked) return color;
      return {...color,hex: hslToHex(
          (baseHue + index * 28) % 360,saturation,20 + index * 15),
      };
    });

    setPalette(newPalette);
  };

   const fetchPalettes = async () => {
    try {
      const res = await axios.get(API);
    setSavedPalettes(res.data);
  } catch (err) {
    console.log(err);
  }
};

 

  useEffect(() => {
    generatePalette();
    fetchPalettes();
  }, []);

  const toggleLock = (index) => {
    setPalette((prev) =>
      prev.map((color, i) => i === index ? { ...color, locked: !color.locked }: color));
  };

  const copyColor = async (hex, index) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };
  const savePalette = async () => {
    try {
      await axios.post(API, {
        name: `Palette ${savedPalettes.length + 1}`,
        colors: palette.map((color) => color.hex),
      });
      await fetchPalettes();
      alert("Palette saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to save palette.");
    }
  };
  const deletePalette = async (id) => {
  try {
    await axios.delete(`${API}/${id}`);

    setSavedPalettes((prev) =>
      prev.filter((palette) => palette._id !== id)
    );
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div   className={`min-h-screen transition-colors duration-300 ${
    darkMode
      ? "bg-slate-950 text-white"
      : "bg-gray-100 text-slate-900"}`}>
      <header className={`border-b transition-colors duration-300 ${darkMode
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-300"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-4xl font-black">
              Colour Palette Generator
            </h1>

            <p className="mt-2 text-slate-400">
              Generate beautiful colour palettes instantly.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generatePalette}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-700 text-white"
            >
              <RefreshCw size={18} />
              Generate
            </button>

            <button
              onClick={savePalette}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium transition hover:bg-emerald-700 text-white"
            >
              <Save size={18} />
              Save
            </button>
            <button onClick={toggleTheme} className={`p-3 rounded-xl transition ${darkMode? "bg-slate-800 hover:bg-slate-700": "bg-gray-200 hover:bg-gray-300"}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

        <main className="mx-auto max-w-7xl p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {palette.map((color, index) => (
                <div key={index}   className={`overflow-hidden rounded-2xl shadow-lg border transition ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-300"}`}>
                  <div className="h-72 transition-all duration-300" style={{ backgroundColor: color.hex }}/>
                  <div className="space-y-5 p-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold uppercase tracking-wider">
                          {color.hex}
                        </h2>
                        <div className="h-6 w-6 rounded-full border border-white/30" style={{ backgroundColor: color.hex }}/>
                      </div>

                    <div className="flex gap-3">
                      <button onClick={() => toggleLock(index)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition text-white ${
                          color.locked ? "bg-[#4682B4] hover:bg-[#3b6d99]":"bg-slate-800 hover:bg-slate-700"
                        }`}>
                        {color.locked ? (
                          <>
                            <Lock size={18} />
                            Locked
                          </>
                        ) : (
                          <>
                            <Unlock size={18} />
                            Lock
                          </>)}
                      </button>
                      <button
                        onClick={() => copyColor(color.hex, index)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium transition hover:bg-indigo-700 text-white ">
                        {copiedIndex === index ? (
                          <>
                            <Check size={18} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>  
      </main>
      <section className="mx-auto mt-12 max-w-7xl px-8">
        <h2 className="mb-6 text-3xl font-bold">
          Saved Palettes
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedPalettes.map((palette) => (
            <div
              key={palette._id}
              className={`rounded-xl border p-5 shadow ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-300"
              }`}
            >
              <h3 className="mb-4 font-semibold">
                {palette.name}
              </h3>

              <div className="mb-5 flex overflow-hidden rounded-lg">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="h-12 flex-1"
                    style={{ backgroundColor: color }}
                  />
                
                ))}
              </div>

              <button
                onClick={() => deletePalette(palette._id)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const Ctx = createContext(false);

export function NavLoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [pct, setPct] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setPct(15);
    const t1 = setTimeout(() => setPct(50), 100);
    const t2 = setTimeout(() => setPct(85), 250);
    const t3 = setTimeout(() => setPct(100), 420);
    const t4 = setTimeout(() => { setLoading(false); setPct(0); }, 600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <Ctx.Provider value={loading}>
      {loading && (
        <div className="fixed inset-x-0 top-0 z-[99999] h-0.5 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {children}
    </Ctx.Provider>
  );
}

export const useNavLoading = () => useContext(Ctx);

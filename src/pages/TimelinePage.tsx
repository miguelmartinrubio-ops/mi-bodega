import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Toma {
  id: string;
  vino_id: number;
  fecha: string;
  lugar: string | null;
  created_at: string;
  vinos?: {
    marca: string;
    bodega: string;
    tipo: string;
  };
}

type ViewMode = "cronologico" | "por_vino";

export default function TimelinePage() {
  const [tomas, setTomas] = useState<Toma[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cronologico");

  useEffect(() => {
    fetchTomas();
  }, []);

  async function fetchTomas() {
    const { data, error } = await supabase
      .from("tomas")
      .select("*, vinos(marca, bodega, tipo)")
      .order("fecha", { ascending: false });

    if (!error && data) setTomas(data);
    setLoading(false);
  }

  const grouped = tomas.reduce((acc, toma) => {
    const key = `${toma.vino_id}`;
    if (!acc[key]) acc[key] = { info: toma.vinos, tomas: [] };
    acc[key].tomas.push(toma);
    return acc;
  }, {} as Record<string, { info: Toma["vinos"]; tomas: Toma[] }>);

  const formatFecha = (fecha: string) =>
    new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 flex gap-1">
          <button
            onClick={() => setViewMode("cronologico")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "cronologico"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📅 Cronológico
          </button>
          <button
            onClick={() => setViewMode("por_vino")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "por_vino"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🍷 Por vino
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-400">Cargando...</p>
      )}

      {!loading && tomas.length === 0 && (
        <p className="text-center text-gray-400">
          Aún no hay tomas registradas. Ábrelas desde la ficha de cada vino.
        </p>
      )}

      {/* Vista cronológica */}
      {!loading && viewMode === "cronologico" && (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-6">
            {tomas.map((toma) => (
              <div key={toma.id} className="flex gap-4 items-start pl-10 relative">
                <div className="absolute left-3 top-2 w-3 h-3 rounded-full bg-wine-500 border-2 border-white shadow" style={{ backgroundColor: "#7c3048" }} />
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-1">
                  <p className="text-xs text-gray-400 mb-1">{formatFecha(toma.fecha)}</p>
                  <p className="font-semibold text-gray-800">
                    {toma.vinos?.marca || "Vino desconocido"}
                  </p>
                  <p className="text-sm text-gray-500">{toma.vinos?.bodega}</p>
                  {toma.lugar && (
                    <p className="text-sm text-gray-600 mt-2">📍 {toma.lugar}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista por vino */}
      {!loading && viewMode === "por_vino" && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([vinoId, { info, tomas: vinoTomas }]) => (
            <div key={vinoId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{info?.marca || "Vino"}</p>
                <p className="text-sm text-gray-500">{info?.bodega} · {info?.tipo}</p>
              </div>
              <div className="space-y-2">
                {vinoTomas.map((toma) => (
                  <div key={toma.id} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-400 min-w-[110px]">{formatFecha(toma.fecha)}</span>
                    {toma.lugar && <span className="text-gray-600">📍 {toma.lugar}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

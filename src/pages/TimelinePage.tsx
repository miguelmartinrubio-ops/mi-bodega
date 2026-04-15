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
      day: "numeric", month: "short", year: "numeric",
    });

  const TomaRow = ({ toma }: { toma: Toma }) => (
    <div className="flex items-center gap-3 relative pl-6">
      {/* Dot */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#8B2252]"
        style={{ background: '#8B2252' }}
      />
      {/* Card */}
      <div
        className="flex items-center gap-4 flex-1 px-4 py-2 rounded-lg text-sm"
        style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}
      >
        <span className="text-[#C4A942] whitespace-nowrap text-xs font-medium min-w-[100px]">
          {formatFecha(toma.fecha)}
        </span>
        <span className="text-[#e8e0d5] font-semibold truncate">
          {toma.vinos?.marca || '—'}
        </span>
        <span className="text-[#666] truncate hidden sm:block">
          {toma.vinos?.bodega}
        </span>
        {toma.lugar && (
          <span className="text-[#888] whitespace-nowrap ml-auto text-xs">
            📍 {toma.lugar}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-1 p-1 rounded-full" style={{ background: '#ffffff0a', border: '1px solid #ffffff15' }}>
          <button
            onClick={() => setViewMode("cronologico")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={viewMode === "cronologico"
              ? { background: 'linear-gradient(135deg, #8B2252, #C4A942)', color: '#fff' }
              : { color: '#666' }}
          >
            📅 Cronológico
          </button>
          <button
            onClick={() => setViewMode("por_vino")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={viewMode === "por_vino"
              ? { background: 'linear-gradient(135deg, #8B2252, #C4A942)', color: '#fff' }
              : { color: '#666' }}
          >
            🍷 Por vino
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-[#666] text-sm">Cargando...</p>}

      {!loading && tomas.length === 0 && (
        <p className="text-center text-[#555] text-sm italic">
          Aún no hay catas registradas. Ábrelas desde la ficha de cada vino.
        </p>
      )}

      {/* Vista cronológica */}
      {!loading && viewMode === "cronologico" && (
        <div className="relative">
          <div className="absolute left-[3px] top-0 bottom-0 w-px" style={{ background: '#8B225233' }} />
          <div className="space-y-2">
            {tomas.map(toma => <TomaRow key={toma.id} toma={toma} />)}
          </div>
        </div>
      )}

      {/* Vista por vino */}
      {!loading && viewMode === "por_vino" && (
        <div className="space-y-5">
          {Object.entries(grouped).map(([vinoId, { info, tomas: vinoTomas }]) => (
            <div key={vinoId}>
              {/* Cabecera del vino */}
              <div className="flex items-baseline gap-2 mb-2 px-1">
                <span className="text-sm font-bold" style={{ color: '#e8e0d5' }}>{info?.marca || 'Vino'}</span>
                <span className="text-xs" style={{ color: '#666' }}>{info?.bodega}</span>
                <span
                  className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: '#ffffff0a', color: '#C4A942', border: '1px solid #C4A94233' }}
                >
                  {vinoTomas.length} {vinoTomas.length === 1 ? 'cata' : 'catas'}
                </span>
              </div>
              {/* Filas */}
              <div className="relative">
                <div className="absolute left-[3px] top-0 bottom-0 w-px" style={{ background: '#8B225233' }} />
                <div className="space-y-1.5">
                  {vinoTomas.map(toma => <TomaRow key={toma.id} toma={toma} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

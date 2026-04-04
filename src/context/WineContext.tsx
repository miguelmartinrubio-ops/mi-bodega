import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const WineContext = createContext(null);

export function WineProvider({ children }) {
  const [vinos, setVinos] = useState([]);
  const [champagnes, setChampagnes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: vinosData } = await supabase
        .from('vinos')
        .select('*')
        .order('bodega');
      const { data: champData } = await supabase
        .from('champagnes')
        .select('*')
        .order('vino');
      setVinos(vinosData || []);
      setChampagnes(champData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function addVino(form) {
    const { data } = await supabase.from('vinos').insert([form]).select();
    if (data) setVinos((prev) => [...prev, data[0]]);
  }

  async function updateVino(id, form) {
    const { data } = await supabase
      .from('vinos')
      .update(form)
      .eq('id', id)
      .select();
    if (data) setVinos((prev) => prev.map((v) => (v.id === id ? data[0] : v)));
  }

  async function deleteVino(id) {
    await supabase.from('vinos').delete().eq('id', id);
    setVinos((prev) => prev.filter((v) => v.id !== id));
  }

  async function addChampagne(form) {
    const { data } = await supabase.from('champagnes').insert([form]).select();
    if (data) setChampagnes((prev) => [...prev, data[0]]);
  }

  async function updateChampagne(id, form) {
    const { data } = await supabase
      .from('champagnes')
      .update(form)
      .eq('id', id)
      .select();
    if (data)
      setChampagnes((prev) => prev.map((c) => (c.id === id ? data[0] : c)));
  }

  async function deleteChampagne(id) {
    await supabase.from('champagnes').delete().eq('id', id);
    setChampagnes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <WineContext.Provider
      value={{
        data: { vinos, champagnes },
        loading,
        addVino,
        updateVino,
        deleteVino,
        addChampagne,
        updateChampagne,
        deleteChampagne,
      }}
    >
      {children}
    </WineContext.Provider>
  );
}

export function useWineData() {
  return useContext(WineContext);
}

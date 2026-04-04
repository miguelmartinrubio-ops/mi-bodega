import { useWineData } from '../context/WineContext';

export default function Header() {
  const { data } = useWineData();

  return (
    <div className="text-center mb-10">
      <h1
        className="font-black tracking-tight mb-2"
        style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          background: 'linear-gradient(135deg, #C4A942, #8B2252, #C4A942)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Mi Bodega Personal
      </h1>
      <p className="text-sm text-[#666] tracking-widest">
        DIARIO DE CATAS · {data.vinos.length + data.champagnes.length} VINOS
      </p>
    </div>
  );
}

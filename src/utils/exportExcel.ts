import * as XLSX from 'xlsx'

export function exportToExcel(data) {
  const vinosSheet = XLSX.utils.json_to_sheet(data.vinos.map(v => ({
    Marca: v.marca,
    Bodega: v.bodega,
    Tipo: v.tipo,
    Grado: v.grado,
    Variedad: v.variedad,
    Region: v.region,
    Precio: v.precio,
    'Anadas probadas': v.anadas_probadas,
    'Anadas recomendadas': v.anadas_recomendadas,
    Rating: v.tier ? v.tier + '/5' : '',
    Comentarios: v.comentarios,
  })))

  const champSheet = XLSX.utils.json_to_sheet(data.champagnes.map(c => ({
    Vino: c.vino,
    Bodega: c.bodega,
    Variedad: c.variedad,
    Zona: c.zona,
    Precio: c.precio,
    Lugar: c.lugar,
    Fecha: c.fecha,
  })))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, vinosSheet, 'Vinos')
  XLSX.utils.book_append_sheet(wb, champSheet, 'Champagnes')
  XLSX.writeFile(wb, 'mi-bodega-personal.xlsx')
}
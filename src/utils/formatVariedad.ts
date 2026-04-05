export function formatVariedad(variedad: string): string {
  if (!variedad) return ''

  return variedad
    // Quitar espacios extra
    .trim()
    // Normalizar separadores: comas seguidas de espacio -> barras
    .replace(/,\s*/g, ' / ')
    // Normalizar " y " entre variedades -> " / "
    .replace(/\s+y\s+/g, ' / ')
    // Quitar barras al final
    .replace(/\s*\/\s*$/, '')
    // Normalizar espacios alrededor de barras
    .replace(/\s*\/\s*/g, ' / ')
    // Quitar punto final
    .replace(/\.$/, '')
    // Capitalizar primera letra de cada palabra después de barra o al inicio
    .replace(/(^|\/ )([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase())
    // Normalizar % sin espacio
    .replace(/(\d+)\s+%/g, '$1%')
}

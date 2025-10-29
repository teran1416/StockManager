// Utilidad para formatear números como moneda COP (sin símbolo, sin decimales)
export function formatCOP(value) {
  const num = Number(value) || 0
  // Redondeamos al entero más cercano y formateamos con separador de miles "\." para 'es-CO'
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(num))
}

/**
 * Iconos SVG del mapa.
 *
 * SVG y no imágenes: escala sin pixelarse, pesa nada, y sobre todo **se puede
 * recolorear en caliente** para reflejar la prioridad que calculó el protocolo
 * a partir de las banderas de Jev.
 */

/** Ambulancia, vista lateral, con cruz y barra de luces. */
export function buildAmbulanceSvg(color: string, busy: boolean): string {
  const lights = busy
    ? `<rect x="14" y="3.5" width="12" height="3" rx="1.5" fill="#38bdf8"/>`
    : '';
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="44" height="28">
  <defs>
    <filter id="a" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <g filter="url(#a)">
    ${lights}
    <!-- furgón -->
    <rect x="3" y="8" width="31" height="20" rx="2.5" fill="#f8fafc"/>
    <rect x="3" y="24" width="31" height="4" rx="1" fill="${color}"/>
    <!-- cruz -->
    <rect x="15" y="12" width="7" height="2.6" rx="0.6" fill="${color}"/>
    <rect x="17.2" y="9.8" width="2.6" height="7" rx="0.6" fill="${color}"/>
    <!-- cabina -->
    <path d="M34 12h10.5c1 0 1.9.5 2.4 1.3l5 7.7c.3.5.5 1 .5 1.6V28H34z" fill="#f8fafc"/>
    <path d="M36.4 14.2h7.6c.5 0 1 .25 1.3.7l3.2 5c.35.55-.05 1.25-.7 1.25H36.4z" fill="#0f172a" opacity="0.72"/>
    <!-- franja inferior -->
    <rect x="3" y="27.5" width="49" height="2.4" rx="1.2" fill="${color}"/>
    <!-- ruedas -->
    <circle cx="14" cy="31" r="5" fill="#0f172a"/><circle cx="14" cy="31" r="2" fill="#64748b"/>
    <circle cx="44" cy="31" r="5" fill="#0f172a"/><circle cx="44" cy="31" r="2" fill="#64748b"/>
  </g>
</svg>`.trim();
}

/** Hospital: cruz dentro de un marcador. `chosen` lo resalta. */
export function buildHospitalSvg(chosen: boolean): string {
  const fill = chosen ? '#38bdf8' : '#1e293b';
  const stroke = chosen ? '#7dd3fc' : '#475569';
  const cross = chosen ? '#0b1220' : '#94a3b8';
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="${chosen ? 26 : 20}" height="${chosen ? 26 : 20}">
  <rect x="2" y="2" width="22" height="22" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <rect x="8" y="11.6" width="10" height="2.8" rx="0.7" fill="${cross}"/>
  <rect x="11.6" y="8" width="2.8" height="10" rx="0.7" fill="${cross}"/>
</svg>`.trim();
}

/**
 * Punto del incidente: es DESDE DÓNDE LLAMAN, y tiene que verse por encima de
 * todo lo demás. Anillo exterior pulsante + núcleo sólido + teléfono.
 */
export function buildIncidentSvg(color: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="40" height="40">
  <circle cx="22" cy="22" r="20" fill="${color}" opacity="0.18"/>
  <circle cx="22" cy="22" r="14" fill="${color}" opacity="0.34"/>
  <circle cx="22" cy="22" r="9" fill="${color}" stroke="#0b1220" stroke-width="2.5"/>
  <path d="M18.6 17.4c-.3.9-.1 1.9.5 2.9.9 1.6 2.4 3.1 4 4 1 .6 2 .8 2.9.5l1.3-.4c.4-.1.6-.6.4-1l-.8-1.6a.8.8 0 0 0-.9-.4l-1.3.3a6 6 0 0 1-2.2-2.2l.3-1.3a.8.8 0 0 0-.4-.9l-1.6-.8a.8.8 0 0 0-1 .4z"
        fill="#0b1220"/>
</svg>`.trim();
}

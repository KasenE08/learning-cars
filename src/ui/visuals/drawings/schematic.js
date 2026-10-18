// Builder for system schematics: tappable component boxes joined by animated flow lines.
// node: { id, x, y, w, h, shape?: 'box'|'circle'|'tank'|'pill', label, sub? }
// link: { d, kind } where kind sets the color of the moving dashes.
const KIND = {
  air: '#7fb2e0', hot: '#ff8a45', cool: '#a8d8ff', exhaust: '#b39a84', fuel: '#ffc21a', hpfuel: '#ff9f1a',
  coolant: '#4fb3d9', hotcoolant: '#ff7a3d', oil: '#c9a24a', elec: '#ffe08a', ground: '#8994a1', brake: '#e07a7a', vapor: '#9fb89a',
};

export function schematic({ nodes, links, extra = '' }) {
  const linkSvg = links.map((l) => `<path d="${l.d}" class="sx-pipe" style="stroke-width:${l.w || 7}px"/><path d="${l.d}" class="sx-flow ${l.slow ? 'is-slow' : ''}" style="stroke:${KIND[l.kind]};stroke-width:${Math.max(2, (l.w || 7) - 4)}px"/>`).join('');
  const nodeSvg = nodes.map((n) => {
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
    let shape;
    if (n.shape === 'circle') shape = `<circle class="hl sx-node" cx="${cx}" cy="${cy}" r="${n.w / 2}"/>`;
    else if (n.shape === 'tank') shape = `<rect class="hl sx-node sx-tank" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14"/>`;
    else if (n.shape === 'pill') shape = `<rect class="hl sx-node" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${Math.min(n.w, n.h) / 2}"/>`;
    else if (n.shape === 'path') shape = n.art;
    else shape = `<rect class="hl sx-node" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="5"/>`;
    const ly = n.labelAt === 'below' ? n.y + n.h + 13 : n.labelAt === 'above' ? n.y - 6 : cy + (n.sub ? -1 : 4);
    return `<g data-part="${n.id}"><rect class="hit" x="${n.x - 6}" y="${n.y - 6}" width="${n.w + 12}" height="${n.h + 12}"/>${shape}${n.deco || ''}
      ${n.label ? `<text class="sx-lbl" x="${n.lx ?? cx}" y="${n.ly ?? ly}" text-anchor="middle">${n.label}</text>` : ''}
      ${n.sub ? `<text class="sx-sub" x="${n.lx ?? cx}" y="${(n.ly ?? ly) + 12}" text-anchor="middle">${n.sub}</text>` : ''}</g>`;
  }).join('');
  return `${linkSvg}${extra}${nodeSvg}`;
}

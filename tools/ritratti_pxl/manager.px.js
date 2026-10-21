// Nuovi ritratti dei manager, disegnati con pxl (.claude/skills/pxl-pixel-art).
// Stessa sagoma di tools/portraits3.py e portraits4.py (griglia 48×56, busto, collo, testa, orecchie,
// ombre a fascia diagonale, contorno #1b1420), così stanno accanto ai ritratti che il gioco ha già.
// In più: acconciature (chignon, coda, ciuffo, afro, velo, pixie, rasato, stempiato, riga, ondulati),
// due carnagioni, età (rughe), lentiggini e accessori da magazzino e da ufficio.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/ritratti_pxl/manager.px.js --out tools/out/ritratti_pxl --scale 2
//
// --scale 2 dà i PNG 96×112 come quelli di assets/p_*.png.

const W = 48, H = 56
const OUTL = "#1b1420"
pal({ k: OUTL, z: "#2a3a50" })

// ---------- motore (lo stesso di portraits*.py: maschere sui centri dei pixel) ----------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const toHex = (c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.floor(v))).toString(16).padStart(2, "0")).join("")
const ell = (cx, cy, rx, ry) => (x, y) => ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1
const rect = (x0, y0, x1, y1) => (x, y) => x + 0.5 >= x0 && x + 0.5 < x1 && y + 0.5 >= y0 && y + 0.5 < y1
const and = (...m) => (x, y) => m.every((f) => f(x, y))
const or = (...m) => (x, y) => m.some((f) => f(x, y))
const not = (m) => (x, y) => !m(x, y)
const row = (x0, x1, y) => Array.from({ length: x1 - x0 + 1 }, (_, i) => [x0 + i, y])
const col = (x, y0, y1) => Array.from({ length: y1 - y0 + 1 }, (_, i) => [x, y0 + i])
const TORSO = and(ell(24, 58, 24, 18), (x, y) => y + 0.5 < 56)
const HEAD = or(ell(24, 23, 9.8, 12), ell(24, 27, 9.3, 8.5))

class Cv {
  constructor() { this.img = new Array(W * H).fill(null) }
  set(x, y, c) { if (x >= 0 && x < W && y >= 0 && y < H) this.img[y * W + x] = c }
  get(x, y) { return x >= 0 && x < W && y >= 0 && y < H ? this.img[y * W + x] : null }
  each(m, f) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m(x, y)) f(x, y) }
  fill(m, c) { const v = hex(c); this.each(m, (x, y) => this.set(x, y, v)) }
  px(pts, c) { const v = hex(c); for (const [x, y] of pts) this.set(x, y, v) }
  // colora solo dove c'è già qualcosa (trame su capelli e vestiti)
  tint(m, c) { const v = hex(c); this.each(m, (x, y) => this.get(x, y) && this.set(x, y, v)) }
  mul(m, k) { this.each(m, (x, y) => { const v = this.get(x, y); if (v) this.set(x, y, v.map((n) => Math.floor(n * k))) }) }
  shaded(m, base, dark, light, cx, cy, rx, ry, td = 0.35, tl = -0.5) {
    const [b, d, l] = [base, dark, light].map(hex)
    this.each(m, (x, y) => {
      const u = ((x + 0.5 - cx) / rx) * 0.8 + ((y + 0.5 - cy) / ry) * 0.6
      this.set(x, y, u > td ? d : u < tl ? l : b)
    })
  }
  // contorno: i pixel pieni che toccano (in croce) il vuoto o il bordo, come binary_erosion di scipy
  framed(pts, k) {
    const v = hex(OUTL), on = new Set(pts.map(([x, y]) => x + "," + y))
    for (const [x, y] of pts) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
      if (!on.has(x + dx + "," + (y + dy))) this.set(x + dx, y + dy, v)
    this.px(pts, k)
  }
  outline(c = OUTL) {
    const v = hex(c), edge = []
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
      if (this.get(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !this.get(x + dx, y + dy))) edge.push([x, y])
    for (const [x, y] of edge) this.set(x, y, v)
  }
}

// ---------- carnagioni: base, ombra, luce, ombra profonda, guance ----------
const SKINS = {
  chiara: ["#f1c4a0", "#d29a76", "#fbdcc0", "#b07a58", "#e39383"],
  media: ["#e9b48c", "#c98762", "#f6d2b0", "#a86a4a", "#e39383"],
  olivastra: ["#d9a878", "#b5814f", "#e8c194", "#8f6038", "#d0806a"],
  scura: ["#c98f62", "#a26c45", "#dcaa80", "#83532f", "#b9705a"],
  ebano: ["#8d5b3c", "#6e432a", "#a87452", "#52301c", "#9a5040"],
}
const DARKH = "#1c1612"
const isDark = (h) => h < "#5"   // come in portraits*.py: i capelli scuri prendono l'ombra quasi nera

// ---------- la persona ----------
function person(o) {
  const [s, sd, sl, sdd, blush] = SKINS[o.skin ?? "media"]
  const hair = o.hair ?? "#3d2419", hl = o.hairl ?? hair, hd = o.haird ?? (isDark(hair) ? DARKH : hair)
  const st = o.style ?? "short"
  const c = new Cv()
  c.shaded(TORSO, o.cloth, o.clothd ?? o.cloth, o.clothl ?? o.cloth, 24, 50, 22, 10)
  if (o.under) o.under(c, o)
  // capelli dietro la testa
  if (["long", "bob", "curly", "wavy"].includes(st)) {
    const long = st === "long" || st === "wavy"
    let back = or(ell(24, 22, 13.5, 13), and(rect(10.5, 20, 37.5, long ? 44 : 36), ell(24, 27, 13.5, long ? 19 : 14)))
    if (st === "curly") back = or(ell(24, 21, 14.5, 13.5), and(rect(9.5, 20, 38.5, 36), ell(24, 26, 14.5, 14)))
    c.shaded(back, hair, hd, hl, 22, 18, 13, 13)
    if (st === "curly") c.tint(and(back, (x, y) => (x * 3 + y * 2) % 5 === 0), hl)
    if (st === "wavy") c.tint(and(back, (x, y) => (x + Math.floor(y / 3) * 2) % 6 === 0 && y > 20), hd)
  }
  if (st === "afro") {
    const back = and(ell(24, 19, 17, 15.5), (x, y) => y + 0.5 < 33)
    c.shaded(back, hair, hd, hl, 21, 14, 15, 13)
    c.tint(and(back, (x, y) => (x * 2 + y * 3) % 7 === 0), hl)
    c.tint(and(back, (x, y) => (x * 5 + y) % 9 === 0), hd)
  }
  if (st === "ponytail") {
    const tail = or(ell(36.5, 33, 3, 9.5), ell(35, 25, 2.5, 4))
    c.shaded(tail, hair, hd, hl, 35, 30, 4, 9)
  }
  if (st === "bun") {
    const bun = ell(24, 6.5, 5.5, 4)
    c.shaded(bun, hair, hd, hl, 22, 5, 5, 4)
    c.tint(and(bun, (x, y) => (x + y) % 4 === 0), hd)
  }
  if (st === "hijab") {
    // velo: copre testa, orecchie e collo e scende sulle spalle
    const veil = or(ell(24, 22, 14, 15.5), and(ell(24, 40, 15, 9), (x, y) => y + 0.5 > 28))
    c.shaded(veil, o.veil, o.veild, o.veill, 22, 20, 14, 16)
    c.tint(and(veil, (x, y) => y > 36 && (x + y) % 9 === 0 && Math.abs(x - 24) > 4), o.veild)
  } else {
    c.shaded(rect(20, 32, 28, 42), sd, sdd, s, 24, 36, 4, 5, 0.25, -0.6)
    c.px(row(21, 26, 41), sdd)
    if (o.collar) o.collar(c, o)
    if (!o.noEars) for (const ex of [14, 34]) c.shaded(ell(ex, 24, 2, 3), s, sd, sl, ex, 24, 2, 3)
  }
  // testa
  c.shaded(HEAD, s, sd, sl, 22, 22, 10, 12)
  c.px(row(20, 28, 35), sd)
  // capelli davanti
  if (st === "short" || st === "sidepart" || st === "receding" || st === "slick") {
    let h = or(and(ell(24, 15, 10.8, 6.5), (x, y) => y + 0.5 < 18.5), and(rect(14, 14, 16.5, 22), HEAD), and(rect(31.5, 14, 34, 22), HEAD))
    if (st === "sidepart") h = or(h, and(ell(27, 15.5, 9.5, 5), (x, y) => y + 0.5 < 19.5 && x > 18))
    if (st === "receding") h = and(h, not(ell(24, 17.6, 6.6, 4.4)), not(ell(18.2, 16.4, 2.6, 3.6)), not(ell(29.8, 16.4, 2.6, 3.6)))
    c.shaded(h, hair, hd, hl, 20, 10, 11, 6)
    if (st === "sidepart") { c.px(col(19, 9, 13), hd); c.px([[20, 9], [20, 10], [21, 9]], hl) }
    if (st === "slick") c.tint(and(h, (x, y) => y > 9 && y < 17 && Math.round(y + Math.abs(x + 0.5 - 24) * 0.35) % 3 === 0 && (x + y) % 5 !== 0), hd)
    if (o.temples) {
      c.fill(or(and(rect(14, 17, 16.5, 22), HEAD), and(rect(31.5, 17, 34, 22), HEAD)), o.temples)
      c.tint(and(h, (x, y) => (x * 7 + y * 13) % 11 === 0 && y > 9), o.salt ?? o.temples)
    }
  } else if (st === "buzz") {
    const h = and(ell(24, 15.5, 10.5, 6), (x, y) => y + 0.5 < 17.5)
    c.shaded(h, hair, DARKH, hl, 20, 10, 11, 6)
    c.mul(and(h, (x, y) => (x + y) % 2 === 0), 0.8)
  } else if (st === "messy") {
    const h = or(and(ell(24, 14, 11.5, 7), (x, y) => y + 0.5 < 18), and(rect(14, 14, 16.5, 23), HEAD), and(rect(31.5, 14, 34, 23), HEAD))
    c.shaded(h, hair, DARKH, hl, 20, 10, 11, 6)
    c.px([[16, 8], [19, 7], [22, 7], [26, 7], [29, 8], [31, 9], [17, 8], [28, 7]], hair)
  } else if (st === "quiff") {
    // ciuffo alto pettinato in su, lati corti
    const sides = or(and(rect(14, 13, 16.5, 21), HEAD), and(rect(31.5, 13, 34, 21), HEAD))
    const top = and(ell(24, 14.5, 10.6, 6), (x, y) => y + 0.5 < 17.5)
    const crest = and(ell(22.5, 9, 9, 5), (x, y) => y + 0.5 < 12)
    c.shaded(or(sides, top), hair, hd, hl, 20, 10, 11, 6)
    c.mul(and(sides, (x, y) => (x + y) % 2 === 0), 0.85)
    c.shaded(crest, hair, hd, hl, 19, 6, 9, 5)
    c.px([[17, 6], [18, 5], [19, 5], [20, 5]], hl)
  } else if (st === "pixie") {
    // corto femminile, frangia lunga di lato
    const h = or(and(ell(24, 14.5, 11.4, 7), (x, y) => y + 0.5 < 16), and(rect(13.5, 14, 16.5, 25), HEAD), and(rect(31.5, 14, 34.5, 20), HEAD))
    const edge = (y) => 31 - (y - 15) * 3.2
    const fringe = and(HEAD, (x, y) => y >= 15 && y <= 20 && x >= 14 && x < edge(y))
    c.shaded(or(h, fringe), hair, hd, hl, 20, 10, 11, 6)
    c.tint(and(fringe, (x, y) => Math.abs(x - (edge(y) - 3)) < 1 && y < 19), hl)
    c.px([[17, 10], [18, 10], [19, 9], [20, 9], [29, 9], [29, 10], [30, 11]], hl)
  } else if (st === "bald") {
    c.shaded(or(and(rect(13.5, 16, 17, 25), HEAD), and(rect(31, 16, 34.5, 25), HEAD)), hair, hair, hl, 24, 20, 10, 8)
    c.px([[20, 13], [21, 13], [22, 14]], sl)
  } else if (st === "shaved") {
    c.px([[19, 13], [20, 13], [21, 13], [20, 12], [22, 14]], sl)
  } else if (["bob", "long", "curly", "wavy"].includes(st)) {
    const fr = and(ell(24, 13, 12, 7), (x, y) => y + 0.5 < 18, (x, y) => !(y + 0.5 >= 15.5 && x % 3 === 0))
    c.shaded(fr, hair, hd, hl, 20, 10, 12, 6)
    c.shaded(and(or(rect(13, 15, 16.5, 33), rect(31.5, 15, 35, 33)), ell(24, 24, 14, 14)), hair, hd, hl, 22, 18, 13, 13)
  } else if (st === "perm") {
    const h = or(and(ell(24, 15, 12.5, 8.5), (x, y) => y + 0.5 < 20), and(rect(12.5, 14, 16.5, 25), ell(24, 20, 13, 12)), and(rect(31.5, 14, 35.5, 25), ell(24, 20, 13, 12)))
    c.shaded(h, hair, "#8f949b", hl, 20, 10, 11, 7)
    c.tint(and(h, (x, y) => (x * 2 + y * 3) % 4 === 0), hl)
  } else if (st === "ponytail" || st === "bun") {
    // tirati indietro: niente frangia, riga in mezzo
    const h = or(and(ell(24, 15, 11, 6.8), (x, y) => y + 0.5 < 18), and(rect(14, 14, 16.5, 24), HEAD), and(rect(31.5, 14, 34, 24), HEAD))
    c.shaded(h, hair, hd, hl, 20, 10, 11, 6)
    c.px(col(24, 9, 12), hl)
    if (st === "ponytail") c.px([[34, 22], [35, 22], [35, 23]], o.band ?? "#e0393e")
  } else if (st === "afro") {
    const h = and(ell(24, 13.5, 11.5, 6.5), (x, y) => y + 0.5 < 17.5)
    c.shaded(h, hair, hd, hl, 20, 10, 11, 6)
    c.tint(and(h, (x, y) => (x * 2 + y * 3) % 7 === 0), hl)
  } else if (st === "hijab") {
    // bordo del velo sulla fronte e ai lati del viso
    const band = or(and(ell(24, 14, 11.2, 6.2), (x, y) => y + 0.5 < 17.5), and(rect(13, 13, 16, 34), HEAD), and(rect(32, 13, 35, 34), HEAD))
    c.shaded(band, o.veil, o.veild, o.veill, 22, 14, 11, 10)
    c.px(row(17, 31, 17), o.veild)
  }
  if (o.hat) o.hat(c, o)
  // sopracciglia e occhi
  const bc = o.brows ?? (st === "bald" || st === "shaved" ? "#5d636b" : hair)
  c.px(row(17, 21, 20), bc); c.px(row(27, 31, 20), bc)
  c.px([[18, 23], [19, 23], [20, 23]], "#f4f1ec"); c.px([[19, 23], [20, 23], [19, 24]], "#2a1d1d")
  c.px([[28, 23], [29, 23], [30, 23]], "#f4f1ec"); c.px([[28, 23], [29, 23], [29, 24]], "#2a1d1d")
  c.px([[18, 24], [20, 24], [30, 24], [28, 24]], sd)
  if (o.age) {
    // zampe di gallina e solchi ai lati del naso
    c.px([[16, 24], [15, 23], [16, 25], [32, 24], [33, 23], [32, 25]], sd)
    c.px([[21, 29], [20, 30], [27, 29], [28, 30]], sd)
    if (o.age > 1) { c.px(row(21, 27, 17), sd); c.px(row(22, 26, 15).filter(([x]) => x !== 24), sd) }
  }
  if (o.glasses) {
    const g = o.glasses
    c.px([...row(16, 22, 22), ...row(26, 32, 22), [23, 23], [24, 23], [25, 23]], g)
    c.px([[16, 23], [16, 24], [22, 23], [22, 24], [26, 23], [26, 24], [32, 23], [32, 24]], g)
    c.px([...row(17, 21, 25), ...row(27, 31, 25)], g)
  }
  if (o.halfmoon) {
    // occhiali a mezzaluna, bassi sul naso: si guarda sopra
    const g = o.halfmoon
    c.px([...row(17, 21, 25), ...row(27, 31, 25), [22, 25], [26, 25], [23, 24], [24, 24], [25, 24]], g)
    c.px([[17, 26], [21, 26], [27, 26], [31, 26], ...row(18, 20, 27), ...row(28, 30, 27), [16, 24], [15, 23], [32, 24], [33, 23]], g)
    c.px([...row(18, 20, 26), ...row(28, 30, 26)], "#e4eef6")
  }
  if (o.roundg) {
    const g = o.roundg
    c.px([...row(18, 20, 21), ...row(28, 30, 21), ...row(18, 20, 26), ...row(28, 30, 26)], g)
    c.px([...col(17, 22, 25), ...col(21, 22, 25), ...col(27, 22, 25), ...col(31, 22, 25), [22, 23], [23, 22], [24, 22], [25, 22], [26, 23], [16, 22], [32, 22]], g)
  }
  // naso e guance
  c.px([[24, 25], [24, 26], [25, 27], [23, 28], [25, 28]], sd); c.px([[24, 28]], sdd)
  c.px([[18, 27], [19, 27], [29, 27], [30, 27]], blush)
  if (o.freckles) c.px([[17, 26], [19, 26], [20, 27], [28, 27], [29, 26], [31, 26]], o.freckles)
  if (o.beard) {
    const b = and(HEAD, (x, y) => y + 0.5 > (o.beardTop ?? 27.5), not(ell(24, 31.5, 3.5, 1.6)))
    c.shaded(b, o.beard, o.beard, o.beard, 24, 32, 9, 6)
    c.mul(and(b, (x, y) => (x + y) % 2 === 0), 0.85)
  }
  if (o.stubble) c.tint(and(HEAD, (x, y) => y > 30 && y < 35 && (x + y) % 2 === 0 && !(y === 32 && x > 20 && x < 28)), o.stubble)
  if (o.mustache) c.px([...row(20, 28, 29), ...row(19, 29, 30), [19, 31], [29, 31]], o.mustache)
  if (o.walrus) {
    // baffoni che coprono il labbro
    c.px([...row(20, 28, 29), ...row(18, 30, 30), ...row(18, 21, 31), ...row(27, 30, 31), [18, 32], [30, 32]], o.walrus)
    c.px([...row(21, 27, 29).filter(([x]) => x % 2 === 0)], o.walrusl ?? o.walrus)
  }
  if (o.lips) { c.px(row(22, 26, 31), o.lips); c.px(row(23, 25, 32), o.lips) }
  else c.px(o.mustache || o.walrus ? row(21, 27, 32) : [[21, 31], [22, 32], [23, 32], [24, 32], [25, 32], [26, 32], [27, 31]], "#8f3a32")
  if (o.smile) c.px([[21, 31], [27, 31], [20, 30], [28, 30]], sdd)
  if (o.mole) c.px([o.mole], sdd)
  if (o.earring) c.px([[14, 30], [34, 30]], o.earring)
  if (o.extra) o.extra(c, o)
  c.outline()
  if (o.hoops) c.px([[13, 29], [15, 29], [12, 30], [16, 30], [12, 31], [16, 31], [13, 32], [15, 32], [14, 33], [35, 29], [33, 29], [36, 30], [32, 30], [36, 31], [32, 31], [35, 32], [33, 32], [34, 33]], o.hoops)
  if (o.stud) c.px([[14, 27], [34, 27]], o.stud)
  if (o.post) o.post(c, o)
  return c
}

// ---------- vestiti e accessori (si combinano: collar sotto la testa, extra sopra a tutto) ----------
const both = (...f) => (c, o) => f.forEach((g) => g(c, o))
const shirtV = (w, fill, dark) => (c) => {
  const m = and((x, y) => Math.abs(x + 0.5 - 24) < (y + 0.5 - 39) * w, TORSO)
  c.fill(m, fill)
  if (dark) c.tint(and(m, (x) => x > 25), dark)
}
const tie = (k) => both(shirtV(0.55, "#f4f5f7", "#d6dbe2"), (c) => c.fill(and(TORSO, (x, y) => Math.abs(x + 0.5 - 24) <= 1.2 && y + 0.5 > 41), k))
const lapels = (k) => (c) => c.fill(and(TORSO, (x, y) => Math.abs(Math.abs(x + 0.5 - 24) - (y + 0.5 - 38) * 0.7) < 1.3 && y > 39), k)
const necklace = (k) => (c) => c.px([[21, 41], [22, 42], [23, 42], [24, 42], [25, 42], [26, 42], [27, 41]], k)
const pearls = (c) => {
  const p = [[19, 41], [20, 42], [21, 43], [22, 43], [23, 44], [24, 44], [25, 44], [26, 43], [27, 43], [28, 42], [29, 41]]
  p.forEach(([x, y], i) => c.px([[x, y]], i % 2 ? "#c3d0dc" : "#ffffff"))
}
const polo = (k) => (c) => c.fill(and(TORSO, (x, y) => Math.abs(x + 0.5 - 24) < 3 && y + 0.5 < 47 && y + 0.5 > 40), k)
const tshirt = (k) => (c) => c.fill(and(ell(24, 41, 6, 3.2), not(ell(24, 40.5, 4.6, 2.2)), (x, y) => y + 0.5 > 40), k)
const turtleneck = (k, kd, kl) => (c) => {
  const m = and(rect(18.5, 36, 29.5, 45), (x, y) => !(y < 38 && (x < 19 || x > 28)))
  c.shaded(m, k, kd, kl, 24, 40, 5, 4)
  c.tint(and(m, (x, y) => y % 2 === 0 && y < 43), kd)
}
const hoodie = (k, kd, cord) => (c) => {
  const hood = and(ell(24, 42, 11, 5.5), not(ell(24, 41, 6.5, 3)), (x, y) => y + 0.5 > 37, not(rect(20, 32, 28, 42)))
  c.shaded(hood, k, kd, k, 24, 42, 10, 5)
  c.px([...col(21, 45, 51), ...col(27, 45, 51)], cord)
  c.px([[21, 52], [27, 52]], "#c3d0dc")
}
const fleece = (k, zip) => (c) => {
  const coll = and(or(rect(17, 38, 21, 46), rect(27, 38, 31, 46)), TORSO)
  c.fill(and(rect(17, 37, 31, 46), (x, y) => Math.abs(x + 0.5 - 24) >= 3.5 && y + 0.5 > 37 + Math.abs(x + 0.5 - 24) * 0.1), k)
  c.px(col(24, 42, 55), zip); c.px([[23, 44], [25, 44]], zip)
  c.px([[34, 47], [35, 47], [36, 47], [34, 48], [36, 48], [35, 49]], "#ff7a3d")   // logo dell'azienda
}
const vest = (k, strip) => (c) => {
  const v = and(TORSO, (x) => x + 0.5 < 19.5 || x + 0.5 > 28.5)
  c.fill(v, k)
  c.px([...row(6, 19, 49), ...row(29, 41, 49)], strip)
  c.px([...row(7, 19, 52), ...row(29, 40, 52)], strip)
}
const lanyard = (k, card) => (c) => {
  c.px([[20, 42], [20, 43], [21, 44], [21, 45], [22, 46], [22, 47], [28, 42], [28, 43], [27, 44], [27, 45], [26, 46], [26, 47], [23, 48], [25, 48]], k)
  c.fill(rect(21, 49, 28, 55), "#f4f5f7"); c.fill(rect(21, 49, 28, 51), card)
  c.px([[22, 52], [23, 52], [24, 52], [22, 53], [23, 53]], "#8a96a6"); c.px([[25, 52], [26, 52], [25, 53], [26, 53]], "#2f7fd6")
}
const scarf = (k, kd) => (c) => {
  const s = and(ell(24, 41.5, 9, 3.6), not(ell(24, 40, 4.4, 1.6)))
  c.shaded(s, k, kd, k, 24, 41, 8, 3)
  c.shaded(rect(26, 43, 30, 54), k, kd, k, 28, 48, 2, 5)
  c.px([[26, 54], [28, 54]], kd); c.px(row(26, 29, 47), kd)
}
const cardigan = (k, kd) => (c) => {
  shirtV(0.5, k, kd)(c)
  c.px(col(24, 44, 55).filter(([, y]) => y % 3 === 0), "#e8c96a")
}
const check = (k) => (c) => c.mul(and(TORSO, (x, y) => (Math.floor(x / 3) % 2 === 0) !== (Math.floor(y / 3) % 2 === 0)), k)
const pocketPen = (k) => (c) => {
  c.px([...row(30, 35, 46), ...col(30, 46, 51), ...col(35, 46, 51), ...row(30, 35, 51)], "#2a3a50")
  c.px([...col(32, 43, 47)], k); c.px([[32, 42]], "#16202e")
}
const pencilEar = (c) => {
  // matita dietro l'orecchio: disegnata dopo il contorno, col suo bordo scuro
  const body = [[33, 19], [34, 18], [35, 17], [36, 16], [37, 15], [34, 19], [35, 18], [36, 17], [37, 16], [38, 15]]
  c.framed([...body, [32, 20], [38, 14], [39, 14]], "#ffd23f")
  c.px([[34, 19], [35, 18], [36, 17], [37, 16], [38, 15]], "#c98a00")
  c.px([[32, 20]], "#3d2412"); c.px([[38, 14], [39, 14]], "#ff8a8d")
}
const earbuds = (c) => {
  c.framed([[13, 24], [13, 25], [12, 24], [35, 24], [35, 25], [36, 24]], "#ffffff")
  c.px([[13, 25], [35, 25]], "#c3d0dc")
}
const headset = (c) => {
  c.px([...row(14, 34, 9), [13, 10], [35, 10], [13, 11], [35, 11]], "#16202e")
  c.fill(rect(11, 20, 15, 28), "#16202e")
  c.px([[14, 28], [15, 29], [16, 30], [17, 31], [18, 31]], "#16202e")
}
const helmet = (k, kd, kl) => (c) => {
  c.shaded(and(ell(24, 15, 11.5, 7.5), (x, y) => y + 0.5 < 17), k, kd, kl, 22, 10, 11, 6)
  c.px(row(12, 36, 17), kd)
}
const flatcap = (k, kd, kl) => (c) => {
  // coppola: tela a quadretti e visiera corta
  const crown = and(ell(24.5, 14, 12.4, 6.6), (x, y) => y + 0.5 < 17)
  c.shaded(crown, k, kd, kl, 22, 10, 12, 6)
  c.mul(and(crown, (x, y) => (x + y * 2) % 4 === 0), 0.86)
  c.shaded(and(ell(24, 17, 12, 2.2), (x, y) => y + 0.5 >= 16), kd, kd, k, 24, 17, 12, 2)
  c.px([[23, 8], [24, 8], [25, 8]], kl)
}

// ---------- i quindici ----------
const PEOPLE = {
  // amministrazione vecchia scuola: chignon, occhiali a mezzaluna, cardigan e perle
  ornella: { skin: "chiara", style: "bun", hair: "#8a7a70", hairl: "#b5a79c", haird: "#5d524c", age: 2, halfmoon: "#8a5f36", lips: "#a8505a",
    cloth: "#8a2a3e", clothd: "#641c2c", clothl: "#b04a5c", collar: both(cardigan("#f4f1ec", "#d6dbe2"), pearls) },
  // capo operativo: stempiato, barba corta, pile aziendale con la zip
  marco: { skin: "media", style: "receding", hair: "#3d2419", hairl: "#5a3a28", beard: "#3d2419", beardTop: 28.5,
    cloth: "#2b3550", clothd: "#1b2238", clothl: "#44547a", collar: fleece("#2b3550", "#c3d0dc") },
  // analista dati: coda di cavallo, felpa col cappuccio, auricolari
  giada: { skin: "chiara", style: "ponytail", hair: "#2c2420", hairl: "#4a3c34", band: "#ffd23f", lips: "#c85a62",
    cloth: "#9b6bff", clothd: "#6f43cf", clothl: "#c8adff", collar: hoodie("#9b6bff", "#6f43cf", "#f4f5f7"), post: earbuds },
  // responsabile trasporti: riga di lato, barba piena, polo
  hamza: { skin: "olivastra", style: "sidepart", hair: "#1c1612", hairl: "#3d2419", beard: "#1c1612", beardTop: 26.5,
    cloth: "#e0393e", clothd: "#a8262a", clothl: "#ff6a6e", collar: polo("#a8262a") },
  // dogane ed export: velo, giacca e badge
  samira: { skin: "olivastra", style: "hijab", veil: "#2f7fd6", veild: "#264f86", veill: "#5fb4f0", lips: "#b0505a",
    cloth: "#4a5f7a", clothd: "#33445a", clothl: "#6b819e", collar: both(shirtV(0.5, "#f4f5f7", "#d6dbe2"), lapels("#6b819e")), extra: lanyard("#e0393e", "#e0393e") },
  // la vecchia guardia: capelli bianchi all'indietro, baffoni, giacca e cravatta
  ettore: { skin: "media", style: "slick", hair: "#dfe3e8", hairl: "#ffffff", haird: "#9aa0a8", age: 2, walrus: "#c9ced4", walrusl: "#eef1f4", brows: "#c9ced4",
    cloth: "#5a3e2b", clothd: "#3e2a1c", clothl: "#7a5a40", collar: both(tie("#e0393e"), lapels("#7a5a40")) },
  // capo magazzino: pixie ramato, lentiggini, gilet alta visibilità
  federica: { skin: "chiara", style: "pixie", hair: "#a3482c", hairl: "#c86a40", haird: "#7a3220", freckles: "#dfa07c", stud: "#5fb4f0",
    cloth: "#4a5f7a", clothd: "#33445a", clothl: "#6b819e", collar: both(polo("#33445a"), vest("#ff7a3d", "#e6ecf0")) },
  // giovane talento: ciuffo alto, dolcevita nero, occhiali tondi
  tommaso: { skin: "media", style: "quiff", hair: "#4a3426", hairl: "#6e4e38", roundg: "#c98a00",
    cloth: "#16202e", clothd: "#0c131d", clothl: "#2f3d52", collar: turtleneck("#2f3d52", "#16202e", "#4a5f7a") },
  // commerciale: afro, giacca senape, orecchini a cerchio
  grace: { skin: "ebano", style: "afro", hair: "#1c1612", hairl: "#3d2419", haird: "#0c0a08", lips: "#7a2e2e", hoops: "#ffd23f", smile: true,
    cloth: "#e8a317", clothd: "#b97f0c", clothl: "#ffd36b", collar: both(shirtV(0.5, "#f4f5f7", "#d6dbe2"), lapels("#ffd36b")) },
  // capo piazzale: coppola, baffi grigi, camicia a quadri, matita dietro l'orecchio
  bruno: { skin: "media", style: "bald", hair: "#9aa0a8", hairl: "#c9ced4", age: 1, mustache: "#9aa0a8",
    cloth: "#2f7fd6", clothd: "#264f86", clothl: "#5fb4f0", collar: both(check(0.82), polo("#264f86")), hat: flatcap("#6b5a48", "#4a3c30", "#8a7660"), post: pencilEar },
  // customer service: capelli lunghi neri con frangia, cuffia del telefono
  mei: { skin: "chiara", style: "long", hair: "#16120f", hairl: "#3a302a", lips: "#c85a62",
    cloth: "#1f9e8f", clothd: "#146b61", clothl: "#5fd4c4", collar: necklace("#f4f5f7"), extra: headset },
  // sistemi informativi: rasato, barba grigia lunga, maglietta
  alessio: { skin: "chiara", style: "shaved", beard: "#9aa0a8", beardTop: 26.5, brows: "#7d838b", mole: [30, 28],
    cloth: "#2e9e48", clothd: "#217a36", clothl: "#8ed15b", collar: tshirt("#217a36"), stud: "#c3d0dc" },
  // risorse umane: lunghi mossi rossi, lentiggini, sciarpa
  lucia: { skin: "chiara", style: "wavy", hair: "#c8551f", hairl: "#ff8a4a", haird: "#8a3e14", freckles: "#e0a07e", lips: "#b8323a",
    cloth: "#2b3550", clothd: "#1b2238", clothl: "#44547a", collar: scarf("#ffd23f", "#c98a00") },
  // finanza: sale e pepe, tempie grigie, giacca blu e camicia azzurra, penna nel taschino
  dario: { skin: "scura", style: "short", hair: "#3a3634", hairl: "#5d636b", temples: "#9aa0a8", salt: "#6b6f75", glasses: "#16202e",
    cloth: "#26365c", clothd: "#18233f", clothl: "#3b5288", collar: both(shirtV(0.55, "#bfe6ff", "#9cc8e6"), lapels("#3b5288"), pocketPen("#e0393e")) },
  // qualità e certificazioni: caschetto platino, occhiali rossi, giacca viola
  valentina: { skin: "media", style: "bob", hair: "#e6e9ec", hairl: "#ffffff", haird: "#b9bec5", glasses: "#e0393e", lips: "#c85a62", earring: "#e2b84a",
    cloth: "#7a4fa0", clothd: "#58377a", clothl: "#9b6bc4", collar: both(shirtV(0.5, "#16202e"), lapels("#9b6bc4"), necklace("#e2b84a")) },
}

const NAMES = Object.keys(PEOPLE)
for (const n of NAMES) {
  const cv = person(PEOPLE[n])
  sprite("m_" + n, { w: W, h: H }, (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const v = cv.get(x, y); if (v) c.px(x, y, toHex(v)) }
  })
}

// foglio di prova: i quindici su sfondo blu notte, come nelle anteprime di portraits*.py
const COLS = 5, CW = W + 4, CH = H + 4
scene("manager_foglio", { w: COLS * CW + 4, h: Math.ceil(NAMES.length / COLS) * CH + 4, bg: "#2a3a50" },
  ...NAMES.map((n, i) => stamp("m_" + n, 4 + (i % COLS) * CW, 4 + Math.floor(i / COLS) * CH)))

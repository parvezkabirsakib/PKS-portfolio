/**
 * ============================================================================
 * SHATTER TYPE - 3D Glass Shatter Text Animation
 * Technology: Three.js (WebGL) + Procedural Voronoi/Delaunay Shard Simulation
 * Interactive & Physics text component inspired by ReactBits Pro
 * Configured specifically for MD Parvez Kabir on the portfolio hero section.
 * Safe boundaries: Strictly contained to avoid navbar overlap and screen overflow.
 * ============================================================================
 */

(function (window) {
  'use strict';

  if (typeof window === 'undefined') return;

  // Vertex Shader for Shard Deformation, Quaternions & Dynamic Cracks
  const VERTEX_SHADER = `
uniform sampler2D uState;
uniform vec2 uStateSize;
attribute vec3 center;
attribute vec3 bary;
attribute float shard;
varying vec2 vUv;
varying vec3 vBary;
varying vec3 vNormal;
varying float vCrack;
varying float vFlash;
varying float vAlpha;
varying float vOrigin;

vec4 fetchState(float k) {
  float column = mod(shard, 256.0) * 3.0 + k;
  float row = floor(shard / 256.0);
  return texture2D(uState, (vec2(column, row) + 0.5) / uStateSize);
}

vec3 rotateQ(vec4 q, vec3 v) {
  vec3 t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

void main() {
  vec4 motion = fetchState(0.0);
  vec4 turn = fetchState(1.0);
  vec4 extra = fetchState(2.0);
  vec3 world = center + motion.xyz + rotateQ(turn, position * motion.w);
  vNormal = rotateQ(turn, vec3(0.0, 0.0, 1.0));
  vUv = uv;
  vBary = bary;
  vCrack = extra.x;
  vFlash = extra.y;
  vAlpha = extra.z;
  vOrigin = center.x + position.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`;

  // Fragment Shader for Glass Facets, Specular Glints & Glowing Seams
  const FRAGMENT_SHADER = `
uniform sampler2D uMask;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;
uniform vec2 uBounds;
uniform float uGlint;
varying vec2 vUv;
varying vec3 vBary;
varying vec3 vNormal;
varying float vCrack;
varying float vFlash;
varying float vAlpha;
varying float vOrigin;

void main() {
  float mask = texture2D(uMask, vUv).a;
  float alpha = mask * vAlpha;
  if (alpha < 0.004) discard;
  vec3 n = normalize(vNormal);
  bool front = gl_FrontFacing;
  vec3 facing = front ? n : -n;
  float t = clamp((vOrigin - uBounds.x) / max(1.0, uBounds.y - uBounds.x), 0.0, 1.0);
  vec3 base = front ? mix(uColorA, uColorB, t) : uAccent;
  vec3 light = normalize(vec3(-0.45, 0.62, 0.64));
  float shade = 1.0 + 0.6 * (dot(facing, light) - light.z);
  vec3 bounce = reflect(-light, facing);
  float tilt = smoothstep(0.0, 0.3, 1.0 - facing.z);
  float spark = pow(max(bounce.z, 0.0), 26.0) * tilt * uGlint;
  float edge = min(min(vBary.x, vBary.y), vBary.z);
  float seam = 1.0 - smoothstep(0.0, fwidth(edge) * 1.5, edge);
  vec3 colour = base * clamp(shade, 0.35, 1.4);
  colour = mix(colour, vec3(1.0), clamp(spark + seam * vCrack * 0.4 + vFlash * 0.5, 0.0, 1.0));
  gl_FragColor = vec4(colour, alpha);
}
`;

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const numOrFallback = (val, fallback) => (Number.isFinite(val) ? val : fallback);
  const smoothstep = (min, max, x) => {
    const r = clamp((x - min) / (max - min), 0, 1);
    return r * r * (3 - 2 * r);
  };
  const mulberry32 = (seed) => {
    let t = seed >>> 0;
    return () => {
      let e = (t = (t + 0x6d2b79f5) >>> 0);
      e = Math.imul(e ^ (e >>> 15), 1 | e);
      return (((e ^= e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ (e >>> 14)) >>> 0) / 0x100000000;
    };
  };

  // Standalone Core Engine Initialization
  const createCoreEngine = (function () {
    return function (container, optionsRef) {
      if (!window.THREE) return null;
      const THREE = window.THREE;
      const d = VERTEX_SHADER;
      const f = FRAGMENT_SHADER;
      const m = clamp;
      const p = numOrFallback;
      const y = smoothstep;
      const v = mulberry32;

      // Safe, contained bleed padding: Enough for shards to spread clearly without touching navbar or overflowing screen
      const padX = 45;
      const padY = 28;

      let a,
        r = container.ownerDocument,
        n = r.createElement('canvas');
      n.setAttribute('aria-hidden', 'true');
      n.style.cssText = `position:absolute;top:-${padY}px;left:-${padX}px;width:calc(100% + ${padX * 2}px);height:calc(100% + ${padY * 2}px);display:block;pointer-events:none;z-index:2;`;
      container.insertBefore(n, container.firstChild);

      try {
        a = new THREE.WebGLRenderer({
          canvas: n,
          alpha: true,
          premultipliedAlpha: true,
          antialias: true
        });
      } catch (err) {
        n.remove();
        return null;
      }

      a.setClearColor(0, 0);
      let i = r.defaultView ?? window,
        l = i.matchMedia('(pointer: fine)'),
        o = new THREE.Scene(),
        h = new THREE.PerspectiveCamera(24, 1, 1, 10000),
        w = r.createElement('canvas'),
        b = new THREE.CanvasTexture(w);
      b.minFilter = THREE.LinearFilter;
      b.magFilter = THREE.LinearFilter;
      b.generateMipmaps = false;

      let x = new Float32Array(4),
        F = new THREE.DataTexture(x, 1, 1, THREE.RGBAFormat, THREE.FloatType),
        M = new THREE.ShaderMaterial({
          vertexShader: d,
          fragmentShader: f,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: true,
          depthWrite: true,
          uniforms: {
            uState: { value: F },
            uStateSize: { value: new THREE.Vector2(1, 1) },
            uMask: { value: b },
            uColorA: { value: new THREE.Color(1, 1, 1) },
            uColorB: { value: new THREE.Color(1, 1, 1) },
            uAccent: { value: new THREE.Color(1, 0.55, 0) },
            uBounds: { value: new THREE.Vector2(0, 1) },
            uGlint: { value: 0.9 }
          }
        }),
        S = new THREE.BufferGeometry(),
        A = new THREE.Mesh(S, M);
      A.frustumCulled = false;
      o.add(A);

      let C = 0,
        k = 0,
        E = 0,
        j = false,
        B = true,
        R = false,
        z = 0,
        I = 0,
        T = 64,
        P = 0,
        D = '',
        U = '',
        L = Infinity,
        H = 0,
        N = v(5369127),
        W = new Float32Array(0),
        G = new Float32Array(0),
        q = new Float32Array(0),
        Y = new Float32Array(0),
        $ = new Float32Array(0),
        O = new Float32Array(0),
        Q = new Float32Array(0),
        X = new Float32Array(0),
        _ = new Float32Array(0),
        V = new Float32Array(0),
        K = new Float32Array(0),
        Z = new Float32Array(0),
        J = new Float32Array(0),
        ee = new Float32Array(0),
        et = new Float32Array(0),
        ea = new Float32Array(0),
        er = new Float32Array(0),
        en = new Float32Array(0),
        ei = new Float32Array(0),
        el = new Float32Array(0),
        eo = new Float32Array(0),
        es = new Float64Array(0),
        eu = new Float64Array(0),
        eh = new Uint8Array(0),
        ec = new Uint8Array(0),
        ed = { x: 0, y: 0, inside: false, at: 0, speed: 0 },
        ef = { x: 0, y: 0, at: 0, live: false };

      const em = () => {
        let a = optionsRef.current,
          r = '',
          n = (t) => {
            let a = (t ?? '').trim();
            return a && 'currentcolor' !== a.toLowerCase()
              ? a
              : (r || (r = i.getComputedStyle(container).color), r);
          },
          l = Array.isArray(a.colors) ? a.colors : [],
          o = n(l[0]),
          s = n(l[1] ?? l[0]),
          u = n(a.accentColor),
          h = `${o}|${s}|${u}`;
        if (h === U) return;
        U = h;

        let c = (e, t) => {
          let col = new THREE.Color(t);
          M.uniforms[e].value.copy(col);
        };
        c('uColorA', o);
        c('uColorB', s);
        c('uAccent', u);
      };

      const ep = (e, a, r, n) => {
        let i = m(p(optionsRef.current.introDuration, 1.5), 0.2, 5),
          l = z > 0 ? (W[e] + z / 2) / z : 0.5;
        if (
          ((eh[e] = 2),
          (es[e] = r + (0.5 * l + 0.14 * N()) * i * n),
          (O[e] = 0),
          (Q[e] = 0),
          (X[e] = 0),
          (Z[e] = 0),
          (J[e] = 0),
          (ee[e] = 0),
          (ec[e] = 'drop' === a ? 3 : 2),
          'drop' === a)
        ) {
          (q[e] = (N() - 0.5) * T * 0.3),
            (Y[e] = I * (0.45 + 0.35 * N()) + T),
            ($[e] = N() * T * 0.5),
            (_[e] = (N() - 0.5) * 1.0),
            (V[e] = (N() - 0.5) * 1.0),
            (K[e] = (N() - 0.5) * 1.2),
            (ei[e] = 1);
          return;
        }
        if ('fade' === a) {
          (q[e] = 0),
            (Y[e] = 0),
            ($[e] = T * (0.5 + 0.6 * N())),
            (_[e] = (N() - 0.5) * 0.4),
            (V[e] = (N() - 0.5) * 0.4),
            (K[e] = (N() - 0.5) * 0.2),
            (ei[e] = 0);
          return;
        }
        let o = N() * Math.PI * 2,
          s = (0.2 + 0.6 * N()) * T * 0.9;
        (q[e] = Math.cos(o) * s),
          (Y[e] = Math.sin(o) * s * 0.65),
          ($[e] = T * (0.4 + 1.2 * N())),
          (_[e] = (N() - 0.5) * Math.PI * 1.5),
          (V[e] = (N() - 0.5) * Math.PI * 1.5),
          (K[e] = (N() - 0.5) * Math.PI * 1.5),
          (ei[e] = 0);
      };

      const ey = (e) => {
        let a = optionsRef.current,
          r = a.reduced ? 'none' : a.intro;
        for (let t = 0; t < P; t++)
          'none' === r
            ? ((eh[t] = 0),
              (q[t] = 0),
              (Y[t] = 0),
              ($[t] = 0),
              (_[t] = 0),
              (V[t] = 0),
              (K[t] = 0),
              (ei[t] = 1),
              (ec[t] = 0))
            : ep(t, r, e, 1);
        let n = m(p(a.introDuration, 1.5), 0.2, 5);
        (H = 'none' === r ? e : e + 1.1 * n),
          (L = e + ('none' === r ? 1.2 : n + 1.4));
      };

      const ev = () => {
        let l = optionsRef.current,
          oRect = container.getBoundingClientRect(),
          s = Math.max(1, Math.round(oRect.width)),
          c = Math.max(1, Math.round(oRect.height)),
          totalW = s + padX * 2,
          totalH = c + padY * 2,
          d = Math.min(i.devicePixelRatio || 1, 2) * m(p(l.quality, 1), 0.5, 1),
          f =
            (l.fontFamily ?? '').trim() ||
            i.getComputedStyle(container).fontFamily ||
            'sans-serif',
          yVal = [
            s,
            c,
            d,
            l.text,
            f,
            l.fontWeight,
            l.fontSize,
            l.letterSpacing,
            l.lineHeight,
            l.align,
            l.shardSize,
            l.irregularity
          ].join('|');
        if (yVal === D) return false;
        (D = yVal),
          (z = totalW),
          (I = totalH),
          a.setPixelRatio(d),
          a.setSize(totalW, totalH, false),
          (h.aspect = totalW / totalH),
          h.position.set(0, 0, totalH / 2 / Math.tan((24 * Math.PI) / 360)),
          (h.near = 1),
          (h.far = 4 * h.position.z),
          h.updateProjectionMatrix();

        let g = String(l.text ?? '').split('\n'),
          C_weight = m(Math.round(p(Number(l.fontWeight), 800)), 100, 900),
          k_spacing = p(l.letterSpacing, -0.02),
          E_lh = m(p(l.lineHeight, 1.15), 0.6, 3);
        (w.width = Math.max(1, Math.ceil(totalW * d))),
          (w.height = Math.max(1, Math.ceil(totalH * d)));
        let jCtx = w.getContext('2d', { willReadFrequently: true });
        if (!jCtx) return false;

        let B_ls = 'letterSpacing' in jCtx,
          U_font = (e) => `${C_weight} ${e}px ${f}`,
          L_measure = (e) => {
            jCtx.font = U_font(e);
            B_ls && (jCtx.letterSpacing = `${k_spacing * e}px`);
            let t = 0;
            for (let el of g) t = Math.max(t, jCtx.measureText(el).width);
            return t;
          },
          computedFont = parseFloat(i.getComputedStyle(container).fontSize) || 48,
          ed_fs = p(l.fontSize, 0);

        if (!(ed_fs > 0)) {
          ed_fs = computedFont;
          for (
            let e = 0;
            e < 60 &&
            (!(L_measure(ed_fs) <= 0.98 * s) ||
              !(g.length * ed_fs * E_lh <= 0.98 * c));
            e++
          )
            ed_fs *= 0.96;
        }

        (T = ed_fs = Math.max(6, ed_fs)),
          jCtx.setTransform(1, 0, 0, 1, 0, 0),
          jCtx.clearRect(0, 0, w.width, w.height),
          jCtx.setTransform(d, 0, 0, d, 0, 0),
          jCtx.font = U_font(ed_fs),
          B_ls && (jCtx.letterSpacing = `${k_spacing * ed_fs}px`),
          (jCtx.fillStyle = '#ffffff'),
          (jCtx.textBaseline = 'alphabetic');

        let ef_metric = jCtx.measureText(g.find((e) => e.trim()) ?? 'M'),
          em_asc = ef_metric.actualBoundingBoxAscent || 0.72 * ed_fs,
          ep_desc = ef_metric.actualBoundingBoxDescent || 0.2 * ed_fs,
          ev_baseline = padY + (c - ((g.length - 1) * ed_fs * E_lh + em_asc + ep_desc)) / 2 + em_asc,
          eg_bound = Infinity,
          ew_bound = -Infinity;

        for (let e of g) {
          let tWidth = jCtx.measureText(e).width,
            aLeft =
              'left' === l.align
                ? padX + 0.02 * s
                : 'right' === l.align
                ? padX + 0.98 * s - tWidth
                : padX + (s - tWidth) / 2;
          jCtx.fillText(e, aLeft, ev_baseline);
          e.trim() &&
            ((eg_bound = Math.min(eg_bound, aLeft)),
            (ew_bound = Math.max(ew_bound, aLeft + tWidth)));
          ev_baseline += ed_fs * E_lh;
        }

        Number.isFinite(eg_bound) || ((eg_bound = padX), (ew_bound = padX + s));
        b.dispose();
        b.needsUpdate = true;
        M.uniforms.uMask.value = b;
        M.uniforms.uBounds.value.set(eg_bound, ew_bound);

        let eb_data = jCtx.getImageData(0, 0, w.width, w.height).data,
          ex_stride = w.width,
          eF_check = (e, t, a, r) => {
            let n = Math.max(0, Math.floor(e * d)),
              i = Math.min(ex_stride - 1, Math.ceil(a * d)),
              l = Math.max(0, Math.floor(t * d)),
              o = Math.min(w.height - 1, Math.ceil(r * d));
            for (let s = l; s <= o; s++) {
              let e = s * ex_stride;
              for (let t = n; t <= i; t++) if (eb_data[(e + t) * 4 + 3] > 2) return true;
            }
            return false;
          };

        N = v(5369127);
        let eM_shard = Math.max(5.5, m(p(l.shardSize, 0.10), 0.04, 0.4) * ed_fs),
          eS_irreg = m(p(l.irregularity, 0.6), 0, 1),
          eA_half = eM_shard / 2,
          eC_cols = Math.ceil(totalW / eA_half) + 1,
          ek_rows = Math.ceil(totalH / eA_half) + 1,
          eE_grid = new Uint8Array(eC_cols * ek_rows),
          ej_minX = Math.max(0, Math.floor((eg_bound - 0.25 * ed_fs) * d)),
          eB_maxX = Math.min(ex_stride - 1, Math.ceil((ew_bound + 0.25 * ed_fs) * d));

        for (let e = 0; e < w.height; e++) {
          let t = e * ex_stride,
            a = Math.floor(e / d / eA_half) * eC_cols;
          for (let e = ej_minX; e <= eB_maxX; e++)
            eb_data[(t + e) * 4 + 3] > 2 &&
              (eE_grid[a + Math.floor(e / d / eA_half)] = 1);
        }

        let eR_isNear = (e, t) => {
            let a = Math.floor(e / eA_half),
              r = Math.floor(t / eA_half);
            for (let e = -3; e <= 3; e++) {
              let t = r + e;
              if (!(t < 0) && !(t >= ek_rows))
                for (let e = -3; e <= 3; e++) {
                  let r = a + e;
                  if (r >= 0 && r < eC_cols && eE_grid[t * eC_cols + r]) return true;
                }
            }
            return false;
          },
          ez_ptsX = new Float64Array(3200),
          eI_ptsY = new Float64Array(3200),
          eT_count = 0,
          eP_sqrt3 = 0.8660254037844386,
          eD_stepY = eM_shard * eP_sqrt3,
          eU_stepX = eM_shard,
          eL_boundPad = 1.2 * eM_shard;

        for (
          let e = -eL_boundPad;
          e <= totalH + eL_boundPad;
          e += eD_stepY
        ) {
          let a = Math.abs(Math.floor(e / eD_stepY) % 2) * (eU_stepX / 2);
          for (let t = -eL_boundPad + a; t <= totalW + eL_boundPad; t += eU_stepX) {
            let a = t + (N() - 0.5) * eM_shard * 0.75 * eS_irreg,
              r = e + (N() - 0.5) * eM_shard * 0.75 * eS_irreg;
            eR_isNear(a, r) &&
              eT_count < 3200 &&
              ((ez_ptsX[eT_count] = a), (eI_ptsY[eT_count] = r), eT_count++);
          }
        }

        if (eT_count < 3) return false;
        let eH_subX = ez_ptsX.subarray(0, eT_count),
          eN_subY = eI_ptsY.subarray(0, eT_count),
          eW_minX = Infinity,
          eG_minY = Infinity,
          eq_maxX = -Infinity,
          eY_maxY = -Infinity;

        for (let e = 0; e < eT_count; e++) {
          let t = eH_subX[e],
            a = eN_subY[e];
          t < eW_minX && (eW_minX = t),
            a < eG_minY && (eG_minY = a),
            t > eq_maxX && (eq_maxX = t),
            a > eY_maxY && (eY_maxY = a);
        }

        let e$_dx = eq_maxX - eW_minX,
          eO_dy = eY_maxY - eG_minY,
          eQ_delta = Math.max(e$_dx, eO_dy),
          eX_midX = (eW_minX + eq_maxX) / 2,
          e__midY = (eG_minY + eY_maxY) / 2,
          eV_p1x = eX_midX - 20 * eQ_delta,
          eK_p1y = e__midY - eQ_delta,
          eZ_p2x = eX_midX,
          eJ_p2y = e__midY + 20 * eQ_delta,
          e0_p3x = eX_midX + 20 * eQ_delta,
          e1_p3y = e__midY - eQ_delta,
          e2_triCap = 2 * eT_count + 1,
          e3_tA = new Int32Array(e2_triCap),
          e4_tB = new Int32Array(e2_triCap),
          e5_tC = new Int32Array(e2_triCap),
          e6_open = new Uint8Array(e2_triCap),
          e7_numTri = 0,
          e8_pushTri = (e, t, a) => {
            let r = e7_numTri++;
            return (
              r >= e3_tA.length &&
                ((e3_tA = ((e) => {
                  let t = new Int32Array(2 * e.length);
                  return t.set(e), t;
                })(e3_tA)),
                (e4_tB = ((e) => {
                  let t = new Int32Array(2 * e.length);
                  return t.set(e), t;
                })(e4_tB)),
                (e5_tC = ((e) => {
                  let t = new Int32Array(2 * e.length);
                  return t.set(e), t;
                })(e5_tC)),
                (e6_open = ((e) => {
                  let t = new Uint8Array(2 * e.length);
                  return t.set(e), t;
                })(e6_open))),
              (e3_tA[r] = e),
              (e4_tB[r] = t),
              (e5_tC[r] = a),
              (e6_open[r] = 1),
              r
            );
          };

        e8_pushTri(-1, -2, -3);
        let e9_getX = (e) =>
            -1 === e ? eV_p1x : -2 === e ? eZ_p2x : -3 === e ? e0_p3x : eH_subX[e],
          tt_getY = (e) =>
            -1 === e ? eK_p1y : -2 === e ? eJ_p2y : -3 === e ? e1_p3y : eN_subY[e],
          ta_edges = new Int32Array(1024),
          tr_edgeCount = 0,
          tn_pushEdge = (e, t) => {
            for (let a = 0; a < tr_edgeCount; a += 2)
              if (
                (ta_edges[a] === e && ta_edges[a + 1] === t) ||
                (ta_edges[a] === t && ta_edges[a + 1] === e)
              ) {
                (ta_edges[a] = ta_edges[tr_edgeCount - 2]),
                  (ta_edges[a + 1] = ta_edges[tr_edgeCount - 1]),
                  (tr_edgeCount -= 2);
                return;
              }
            tr_edgeCount + 2 > ta_edges.length &&
              ((ta_edges = ((e) => {
                let t = new Int32Array(2 * e.length);
                return t.set(e), t;
              })(ta_edges))),
              (ta_edges[tr_edgeCount++] = e),
              (ta_edges[tr_edgeCount++] = t);
          };

        for (let e = 0; e < eT_count; e++) {
          let t = eH_subX[e],
            a = eN_subY[e];
          tr_edgeCount = 0;
          for (let r = 0; r < e7_numTri; r++)
            if (e6_open[r]) {
              let n = e3_tA[r],
                i = e4_tB[r],
                l = e5_tC[r],
                o = e9_getX(n),
                s = tt_getY(n),
                c = e9_getX(i),
                d = tt_getY(i),
                u = e9_getX(l),
                h = tt_getY(l),
                w = 2 * (o * (d - h) + c * (h - s) + u * (s - d));
              if (Math.abs(w) < 1e-12) continue;
              let b = o * o + s * s,
                x = c * c + d * d,
                F = u * u + h * h,
                M = (b * (d - h) + x * (h - s) + F * (s - d)) / w,
                S = (b * (u - c) + x * (o - u) + F * (c - o)) / w,
                A = Math.hypot(o - M, s - S);
              Math.hypot(t - M, a - S) <= A &&
                ((e6_open[r] = 0),
                tn_pushEdge(n, i),
                tn_pushEdge(i, l),
                tn_pushEdge(l, n));
            }
          for (let t = 0; t < tr_edgeCount; t += 2)
            e8_pushTri(ta_edges[t], ta_edges[t + 1], e);
        }

        let ti_finalShards = 0,
          tl_shardCap = e7_numTri;
        (W = new Float32Array(tl_shardCap)),
          (G = new Float32Array(tl_shardCap)),
          (q = new Float32Array(tl_shardCap)),
          (Y = new Float32Array(tl_shardCap)),
          ($ = new Float32Array(tl_shardCap)),
          (O = new Float32Array(tl_shardCap)),
          (Q = new Float32Array(tl_shardCap)),
          (X = new Float32Array(tl_shardCap)),
          (_ = new Float32Array(tl_shardCap)),
          (V = new Float32Array(tl_shardCap)),
          (K = new Float32Array(tl_shardCap)),
          (Z = new Float32Array(tl_shardCap)),
          (J = new Float32Array(tl_shardCap)),
          (ee = new Float32Array(tl_shardCap)),
          (et = new Float32Array(tl_shardCap)),
          (ea = new Float32Array(tl_shardCap)),
          (er = new Float32Array(tl_shardCap)),
          (en = new Float32Array(tl_shardCap)),
          (ei = new Float32Array(tl_shardCap)),
          (el = new Float32Array(tl_shardCap)),
          (eo = new Float32Array(tl_shardCap)),
          (es = new Float64Array(tl_shardCap)),
          (eu = new Float64Array(tl_shardCap)),
          (eh = new Uint8Array(tl_shardCap)),
          (ec = new Uint8Array(tl_shardCap));

        let to_pos = new Float32Array(9 * tl_shardCap),
          ts_cent = new Float32Array(9 * tl_shardCap),
          tc_uvs = new Float32Array(6 * tl_shardCap),
          tu_bary = new Float32Array(9 * tl_shardCap),
          td_shard = new Float32Array(3 * tl_shardCap);

        for (let e = 0; e < e7_numTri; e++)
          if (e6_open[e]) {
            let t = e3_tA[e],
              a = e4_tB[e],
              r = e5_tC[e];
            if (t < 0 || a < 0 || r < 0) continue;
            let n = eH_subX[t],
              i = eN_subY[t],
              l = eH_subX[a],
              o = eN_subY[a],
              h = eH_subX[r],
              w = eN_subY[r],
              b = Math.min(n, l, h),
              x = Math.max(n, l, h),
              F = Math.min(i, o, w),
              M = Math.max(i, o, w);
            if (!eF_check(b, F, x, M)) continue;

            let C_idx = ti_finalShards++,
              k_cX = (n + l + h) / 3,
              E_cY = (i + o + w) / 3,
              j_wX = k_cX - totalW / 2,
              B_wY = totalH / 2 - E_cY;
            (W[C_idx] = j_wX), (G[C_idx] = B_wY);
            let U_norm = Math.hypot(j_wX, B_wY) || 1;
            (el[C_idx] = j_wX / U_norm),
              (eo[C_idx] = B_wY / U_norm),
              (et[C_idx] = 1),
              (ei[C_idx] = 1);

            let L_vIdx = 9 * C_idx,
              ed_uvIdx = 6 * C_idx,
              ef_bIdx = 9 * C_idx,
              em_sIdx = 3 * C_idx;

            (to_pos[L_vIdx] = n - k_cX),
              (to_pos[L_vIdx + 1] = -(i - E_cY)),
              (to_pos[L_vIdx + 2] = 0),
              (to_pos[L_vIdx + 3] = l - k_cX),
              (to_pos[L_vIdx + 4] = -(o - E_cY)),
              (to_pos[L_vIdx + 5] = 0),
              (to_pos[L_vIdx + 6] = h - k_cX),
              (to_pos[L_vIdx + 7] = -(w - E_cY)),
              (to_pos[L_vIdx + 8] = 0);

            for (let e = 0; e < 3; e++) {
              let t = L_vIdx + 3 * e;
              (ts_cent[t] = j_wX), (ts_cent[t + 1] = B_wY), (ts_cent[t + 2] = 0);
            }

            (tc_uvs[ed_uvIdx] = n / totalW),
              (tc_uvs[ed_uvIdx + 1] = 1 - i / totalH),
              (tc_uvs[ed_uvIdx + 2] = l / totalW),
              (tc_uvs[ed_uvIdx + 3] = 1 - o / totalH),
              (tc_uvs[ed_uvIdx + 4] = h / totalW),
              (tc_uvs[ed_uvIdx + 5] = 1 - w / totalH);

            (tu_bary[ef_bIdx] = 1),
              (tu_bary[ef_bIdx + 1] = 0),
              (tu_bary[ef_bIdx + 2] = 0),
              (tu_bary[ef_bIdx + 3] = 0),
              (tu_bary[ef_bIdx + 4] = 1),
              (tu_bary[ef_bIdx + 5] = 0),
              (tu_bary[ef_bIdx + 6] = 0),
              (tu_bary[ef_bIdx + 7] = 0),
              (tu_bary[ef_bIdx + 8] = 1);

            (td_shard[em_sIdx] = C_idx),
              (td_shard[em_sIdx + 1] = C_idx),
              (td_shard[em_sIdx + 2] = C_idx);
          }

        if (((P = ti_finalShards), !P)) return false;
        let ep_subPos = to_pos.subarray(0, 9 * P),
          ev_subCent = ts_cent.subarray(0, 9 * P),
          eg_subUvs = tc_uvs.subarray(0, 6 * P),
          ew_subBary = tu_bary.subarray(0, 9 * P),
          eb_subSh = td_shard.subarray(0, 3 * P);

        S.dispose();
        let eY_geom = new THREE.BufferGeometry();
        eY_geom.setAttribute('position', new THREE.BufferAttribute(ep_subPos, 3)),
          eY_geom.setAttribute('center', new THREE.BufferAttribute(ev_subCent, 3)),
          eY_geom.setAttribute('uv', new THREE.BufferAttribute(eg_subUvs, 2)),
          eY_geom.setAttribute('bary', new THREE.BufferAttribute(ew_subBary, 3)),
          eY_geom.setAttribute('shard', new THREE.BufferAttribute(eb_subSh, 1)),
          (A.geometry = S = eY_geom);

        let e$_rows = Math.ceil(P / 256);
        (x = new Float32Array(768 * e$_rows * 4)),
          F.dispose(),
          ((F = new THREE.DataTexture(
            x,
            768,
            e$_rows,
            THREE.RGBAFormat,
            THREE.FloatType
          )).minFilter = THREE.NearestFilter),
          (F.magFilter = THREE.NearestFilter),
          (F.needsUpdate = true),
          (M.uniforms.uState.value = F),
          M.uniforms.uStateSize.value.set(768, e$_rows);

        let eO_now = performance.now() / 1000;
        ey(eO_now);
        return true;
      };

      const eg = (e, t, a, r = 1) => {
        let n = optionsRef.current;
        if (!P || n.reduced || !n.shatter) return;
        let i = e - z / 2,
          l = I / 2 - t,
          // Controlled impact radius - wide enough to shatter smoothly, but strictly contained
          o = m(p(n.shatterRadius, 1.8), 0.2, 5.0) * T,
          s = m(p(n.force, 1.4), 0, 3.5) * r,
          c = m(p(n.spin, 1.5), 0, 3.5),
          d = m(p(n.depth, 1.2), 0, 2.5),
          u = m(p(n.reassemble, 1.6), 0.2, 4.5);

        for (let e = 0; e < P; e++) {
          let t = W[e] - i,
            r = G[e] - l,
            h = Math.hypot(t, r);
          if (h <= o) {
            let i = 1 - h / o,
              l = (0.35 + 0.65 * N()) * i * s,
              w = h > 1e-4 ? t / h : N() - 0.5,
              b = h > 1e-4 ? r / h : N() - 0.5,
              x = Math.hypot(w, b) || 1;
            (w /= x), (b /= x);

            // Controlled physical impulse
            let F = l * T * 7.5;
            (O[e] += w * F * 1.05 + (N() - 0.5) * T * 1.6 * s),
              (Q[e] += b * F * 0.8 + (N() - 0.5) * T * 1.2 * s),
              (X[e] += (0.5 + 0.5 * N()) * T * 6.5 * s * d);

            let M = c * (8 + 16 * N()) * (N() < 0.5 ? -1 : 1);
            (Z[e] += (N() - 0.5) * M),
              (J[e] += (N() - 0.5) * M),
              (ee[e] += (N() - 0.5) * M),
              (en[e] = Math.max(en[e], 1.2 * i)),
              (eh[e] = 1),
              (ec[e] = 1),
              (eu[e] = a + 0.05 * (1 - i)),
              (es[e] = eu[e] + u * (0.85 + 0.3 * N()));
          }
        }
        L = a + m(p(n.autoplayInterval, 4), 1.5, 10);
        ex();
      };

      const ew_mod = (e) => {
        let t = Math.PI * 2;
        return ((e % t) + t) % t;
      };

      const eb_sim = (e, a) => {
        let r = optionsRef.current,
          n = 22 * m(p(r.stiffness, 0.55), 0.1, 1),
          i = Math.max(1, 0.85 * n),
          l = 180 * m(p(r.gravity, 0), 0, 1) * T,
          o = Math.exp(-e * 0.45),
          s = Math.exp(-e * 0.55),
          u = Math.max(0.2, p(r.heal, 0.85)),
          // Controlled crack radius
          c = m(p(r.crackRadius, 1.2), 0.15, 3.5) * T,
          d = m(p(r.crack, 0.75), 0, 1),
          h = Math.min(1, ed.speed / 350),
          f = ed.inside && d > 0,
          v = ed.x - z / 2,
          g = I / 2 - ed.y,
          w = 0;

        // Strict boundary containment limits so shards cannot escape beyond safe pad margins
        const maxDispX = padX - 6;
        const maxDispY = padY - 6;

        for (let t = 0; t < P; t++) {
          if (2 === eh[t]) {
            if (a < es[t]) continue;
            eh[t] = 0;
          }
          if (1 === eh[t])
            if (a >= es[t])
              (eh[t] = 0),
                (_[t] = ew_mod(_[t])),
                (V[t] = ew_mod(V[t])),
                (K[t] = ew_mod(K[t])),
                (O[t] *= 0.25),
                (Q[t] *= 0.25),
                (X[t] *= 0.25);
            else if (a >= eu[t]) {
              (Q[t] -= l * e),
                (O[t] *= o),
                (Q[t] *= o),
                (X[t] *= o),
                (Z[t] *= s),
                (J[t] *= s),
                (ee[t] *= s),
                (q[t] += O[t] * e),
                (Y[t] += Q[t] * e),
                ($[t] += X[t] * e),
                (_[t] += Z[t] * e),
                (V[t] += J[t] * e),
                (K[t] += ee[t] * e),
                (w += 1);

              // Boundary clamp with soft bounce
              if (q[t] > maxDispX) { q[t] = maxDispX; O[t] *= -0.3; }
              else if (q[t] < -maxDispX) { q[t] = -maxDispX; O[t] *= -0.3; }

              if (Y[t] > maxDispY) { Y[t] = maxDispY; Q[t] *= -0.3; }
              else if (Y[t] < -maxDispY) { Y[t] = -maxDispY; Q[t] *= -0.3; }

              continue;
            } else {
              w += 1;
              continue;
            }

          if (f) {
            let e = Math.hypot(W[t] - v, G[t] - g);
            if (e < c) {
              let a = h * d * Math.pow(1 - e / c, 1.4);
              a > er[t] && (er[t] = a);
            }
          }

          let r_stiff =
              2 === ec[t]
                ? i
                : 3 === ec[t]
                ? 1.25 * i
                : ec[t]
                ? n
                : 18,
            m_damp =
              2 === ec[t] ? 1 : 3 === ec[t] ? 0.5 : ec[t] ? 0.68 : 0.9,
            p_omega = r_stiff * r_stiff,
            y_gamma = 2 * m_damp * r_stiff,
            b_offX = eo[t] * er[t] * 0.15,
            x_offY = -el[t] * er[t] * 0.15;

          (O[t] += (-p_omega * q[t] - y_gamma * O[t]) * e),
            (Q[t] += (-p_omega * Y[t] - y_gamma * Q[t]) * e),
            (X[t] += (-p_omega * $[t] - y_gamma * X[t]) * e),
            (q[t] += O[t] * e),
            (Y[t] += Q[t] * e),
            ($[t] += X[t] * e),
            (Z[t] += (-p_omega * (_[t] - b_offX) - y_gamma * Z[t]) * e),
            (J[t] += (-p_omega * (V[t] - x_offY) - y_gamma * J[t]) * e),
            (ee[t] += (-p_omega * K[t] - y_gamma * ee[t]) * e),
            (_[t] += Z[t] * e),
            (V[t] += J[t] * e),
            (K[t] += ee[t] * e);

          // Position boundary clamp with soft reflection
          if (q[t] > maxDispX) { q[t] = maxDispX; O[t] *= -0.3; }
          else if (q[t] < -maxDispX) { q[t] = -maxDispX; O[t] *= -0.3; }

          if (Y[t] > maxDispY) { Y[t] = maxDispY; Q[t] *= -0.3; }
          else if (Y[t] < -maxDispY) { Y[t] = -maxDispY; Q[t] *= -0.3; }

          let F_scale = 1 - 0.025 * er[t];
          (ea[t] += (-324 * (et[t] - F_scale) - 30 * ea[t]) * e),
            (et[t] += ea[t] * e),
            ei[t] < 1 && (ei[t] = Math.min(1, ei[t] + 4.5 * e)),
            ec[t] &&
              Math.abs(q[t]) + Math.abs(Y[t]) + Math.abs($[t]) < 1.5 &&
              Math.abs(_[t]) + Math.abs(V[t]) + Math.abs(K[t]) < 0.06 &&
              ((ec[t] = 0), (en[t] = Math.max(en[t], 0.9))),
            (er[t] *= Math.exp(-e * u)),
            er[t] < 0.015 && (er[t] = 0),
            (en[t] *= Math.exp(-e / 0.16)),
            en[t] < 0.01 && (en[t] = 0);

          let M_settled =
            Math.abs(q[t]) + Math.abs(Y[t]) + Math.abs($[t]) < 0.3 &&
            Math.abs(O[t]) + Math.abs(Q[t]) + Math.abs(X[t]) < 3 &&
            Math.abs(_[t] - b_offX) +
              Math.abs(V[t] - x_offY) +
              Math.abs(K[t]) <
              0.004 &&
            Math.abs(Z[t]) + Math.abs(J[t]) + Math.abs(ee[t]) < 0.06 &&
            0.0008 > Math.abs(et[t] - F_scale) &&
            0.02 > Math.abs(ea[t]);

          M_settled &&
            ((q[t] = 0),
            (Y[t] = 0),
            ($[t] = 0),
            (O[t] = 0),
            (Q[t] = 0),
            (X[t] = 0),
            (_[t] = b_offX),
            (V[t] = x_offY),
            (K[t] = 0),
            (Z[t] = 0),
            (J[t] = 0),
            (ee[t] = 0),
            (et[t] = F_scale),
            (ea[t] = 0),
            ec[t] && ((ec[t] = 0), (en[t] = Math.max(en[t], 0.9))));

          let S_active = +!M_settled + er[t] + en[t] + (1 - ei[t]);
          S_active > 0.004 && (w += S_active);
        }
        return w;
      };

      const ex = () => {
        j || !B || C || (C = i.requestAnimationFrame(eF));
      };

      function eF(e) {
        if (((C = 0), j)) return;
        let r = optionsRef.current,
          n_dt = E ? m((e - E) / 1000, 0, 0.05) : 1 / 60;
        E = e;
        let l_now = performance.now() / 1000;
        if (r.paused) {
          E = 0;
          return;
        }

        if (r.autoplay && !r.reduced && R && P && !ed.inside && l_now >= L) {
          L = l_now + m(p(r.autoplayInterval, 4), 0.8, 30) * (0.85 + 0.3 * N());
          let eIdx = Math.floor(N() * P);
          eg(W[eIdx] + z / 2, I / 2 - G[eIdx], l_now, 0.9);
        }

        let s_active = 0,
          u_remain = n_dt,
          d_curr = l_now - n_dt;
        for (; u_remain > 1e-6; ) {
          let eStep = Math.min(0.016, u_remain);
          (u_remain -= eStep), (d_curr += eStep), (s_active = eb_sim(eStep, d_curr));
        }

        M.uniforms.uGlint.value = m(p(r.glint, 0.9), 0, 2);

        (() => {
          let eCrack = m(p(optionsRef.current.crack, 0.75), 0, 1),
            aGlint = m(p(optionsRef.current.glint, 0.9), 0, 2);
          for (let t = 0; t < P; t++) {
            let rIdx = (256 * Math.floor(t / 256) * 3 + (t % 256) * 3) * 4;
            (x[rIdx] = q[t]),
              (x[rIdx + 1] = Y[t]),
              (x[rIdx + 2] = $[t]),
              (x[rIdx + 3] = et[t]);
            let n_cosZ = Math.cos(_[t] / 2),
              i_sinZ = Math.sin(_[t] / 2),
              l_cosY = Math.cos(V[t] / 2),
              o_sinY = Math.sin(V[t] / 2),
              s_cosX = Math.cos(K[t] / 2),
              u_sinX = Math.sin(K[t] / 2);
            (x[rIdx + 4] = i_sinZ * l_cosY * s_cosX + n_cosZ * o_sinY * u_sinX),
              (x[rIdx + 5] = n_cosZ * o_sinY * s_cosX - i_sinZ * l_cosY * u_sinX),
              (x[rIdx + 6] = n_cosZ * l_cosY * u_sinX + i_sinZ * o_sinY * s_cosX),
              (x[rIdx + 7] = n_cosZ * l_cosY * s_cosX - i_sinZ * o_sinY * u_sinX),
              (x[rIdx + 8] = er[t] * eCrack),
              (x[rIdx + 9] = en[t] * aGlint),
              (x[rIdx + 10] = ei[t]),
              (x[rIdx + 11] = 0);
          }
          F.needsUpdate = true;
        })();

        a.render(o, h);

        let f_animating = false;
        for (let e = 0; e < P && !f_animating; e++)
          2 === eh[e] && es[e] !== Infinity && (f_animating = true);

        s_active > 0.004 || f_animating || (ed.inside && l_now - ed.at < 0.2)
          ? ex()
          : (k && (i.clearTimeout(k), (k = 0)),
            r.autoplay &&
              !r.reduced &&
              R &&
              Number.isFinite(L) &&
              (k = i.setTimeout(() => {
                (k = 0), ex();
              }, Math.max(16, (L - l_now) * 1000))));
      }

      let eM_pointer = (t, a) => {
        let rRect = container.getBoundingClientRect();
        (ed.x = t - rRect.left + padX), (ed.y = a - rRect.top + padY);
      };

      let eS_move = (e) => {
        if ('touch' === e.pointerType || !optionsRef.current.interactive || !l.matches)
          return;
        let aPrevX = ed.x,
          rPrevY = ed.y,
          nNow = performance.now() / 1000,
          iDt = Math.max(0.008, nNow - ed.at);
        eM_pointer(e.clientX, e.clientY);
        let oDist = ed.inside ? Math.hypot(ed.x - aPrevX, ed.y - rPrevY) / iDt : 0;
        (ed.speed +=
          (Math.min(oDist, 4000) - ed.speed) * Math.min(1, iDt / 0.05)),
          (ed.inside = true),
          (ed.at = nNow),
          ex();
      };

      let eA_leave = (e) => {
        'touch' !== e.pointerType &&
          ((ed.inside = false),
          (L = Math.max(L, performance.now() / 1000 + 1.5)),
          ex());
      };

      let eC_down = (e) => {
        let a = optionsRef.current;
        if (a.interactive && a.shatter) {
          if ('touch' === e.pointerType) {
            (ef.x = e.clientX),
              (ef.y = e.clientY),
              (ef.at = performance.now() / 1000),
              (ef.live = true);
            return;
          }
          0 === e.button &&
            (eM_pointer(e.clientX, e.clientY),
            eg(ed.x, ed.y, performance.now() / 1000));
        }
      };

      let ek_up = (t) => {
        if (
          'touch' !== t.pointerType ||
          !ef.live ||
          ((ef.live = false),
          Math.hypot(t.clientX - ef.x, t.clientY - ef.y) > 10 ||
            performance.now() / 1000 - ef.at > 0.35)
        )
          return;
        let aRect = container.getBoundingClientRect();
        eg((t.clientX - aRect.left) + padX, (t.clientY - aRect.top) + padY, performance.now() / 1000);
      };

      let eE_sync = () => {
        em();
        ev();
        ex();
      };

      let ej_resize = new ResizeObserver(() => eE_sync());
      ej_resize.observe(container);

      let eB_io = new IntersectionObserver(
        ([e]) => {
          (B = e.isIntersecting)
            ? ((E = 0),
              eE_sync(),
              R || ((R = true), ey(performance.now() / 1000), ex()),
              ex())
            : C && (i.cancelAnimationFrame(C), (C = 0));
        },
        { threshold: 0.15 }
      );
      eB_io.observe(container);

      let eR_fontDone = () => {
        (D = ''), eE_sync();
      };
      r.fonts?.addEventListener?.('loadingdone', eR_fontDone);
      r.fonts?.ready?.then(() => {
        j || eR_fontDone();
      });

      container.addEventListener('pointermove', eS_move, { passive: true });
      container.addEventListener('pointerleave', eA_leave);
      container.addEventListener('pointerdown', eC_down, { passive: true });
      i.addEventListener('pointerup', ek_up, { passive: true });

      em();
      const didInit = ev();

      return {
        isSupported: didInit,
        sync: () => eE_sync(),
        shatter: (e, t) => {
          if (!P) return;
          if (
            'number' == typeof e &&
            'number' == typeof t &&
            Number.isFinite(e) &&
            Number.isFinite(t)
          )
            return void eg(e + padX, t + padY, performance.now() / 1000);
          let aIdx = Math.floor(N() * P);
          eg(W[aIdx] + z / 2, I / 2 - G[aIdx], performance.now() / 1000);
        },
        assemble: () => {
          (R = true), ey(performance.now() / 1000), ex();
        },
        destroy: () => {
          (j = true),
            C && i.cancelAnimationFrame(C),
            k && i.clearTimeout(k),
            ej_resize.disconnect(),
            eB_io.disconnect(),
            r.fonts?.removeEventListener?.('loadingdone', eR_fontDone),
            container.removeEventListener('pointermove', eS_move),
            container.removeEventListener('pointerleave', eA_leave),
            container.removeEventListener('pointerdown', eC_down),
            i.removeEventListener('pointerup', ek_up),
            S.dispose(),
            M.dispose(),
            b.dispose(),
            F.dispose(),
            a.dispose(),
            a.forceContextLoss(),
            n.remove();
        }
      };
    };
  })();

  // Global helper on window
  window.initShatterType = function (container, userOptions) {
    if (!container || !window.THREE) return null;

    const defaults = {
      text: 'MD Parvez Kabir',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 800,
      fontSize: 0,
      letterSpacing: -0.02,
      lineHeight: 1.15,
      align: 'left',
      colors: ['#FFFFFF', '#FFFFFF'],
      accentColor: '#FF8C00', // Signature neon-orange shards
      shardSize: 0.10, // Clean, crisp geometric glass shards
      irregularity: 0.6, // Natural organic fracture lines
      crack: 0.75, // Clearly visible glowing crack lines under cursor
      crackRadius: 1.2, // Controlled crack propagation
      heal: 0.85, // Smooth crack healing
      shatter: true, // Shatter on click
      shatterRadius: 1.8, // Controlled, balanced shatter area
      force: 1.4, // Contained, crisp explosive dispersion
      spin: 1.5, // 3D rotational spin showing shard edges
      depth: 1.2, // 3D depth projection
      gravity: 0,
      reassemble: 1.6, // Clean 1.6s display time before reassembling
      stiffness: 0.55,
      glint: 0.9, // Specular glints
      intro: 'assemble',
      introDuration: 1.5,
      autoplay: false,
      autoplayInterval: 4,
      interactive: true,
      paused: false,
      quality: Math.min(window.devicePixelRatio || 1, 2),
      reduced: window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false
    };

    const optionsRef = {
      current: Object.assign({}, defaults, userOptions || {})
    };

    try {
      const instance = createCoreEngine(container, optionsRef);
      if (instance && instance.isSupported !== false) {
        container.classList.add('shatter-initialized');
      }
      return instance;
    } catch (err) {
      console.warn('ShatterType WebGL initialization skipped:', err);
      return null;
    }
  };
})(window);

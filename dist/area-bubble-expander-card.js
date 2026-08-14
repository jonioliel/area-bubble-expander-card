/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pe = globalThis, at = Pe.ShadowRoot && (Pe.ShadyCSS === void 0 || Pe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), dt = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (at && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = dt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && dt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ni = (e) => new It(typeof e == "string" ? e : e + "", void 0, ot), ke = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, o, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[r + 1], e[0]);
  return new It(i, e, ot);
}, si = (e, t) => {
  if (at) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), o = Pe.litNonce;
    o !== void 0 && a.setAttribute("nonce", o), a.textContent = i.cssText, e.appendChild(a);
  }
}, pt = at ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return ni(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ci, defineProperty: li, getOwnPropertyDescriptor: di, getOwnPropertyNames: pi, getOwnPropertySymbols: ui, getPrototypeOf: hi } = Object, Q = globalThis, ut = Q.trustedTypes, bi = ut ? ut.emptyScript : "", He = Q.reactiveElementPolyfillSupport, ve = (e, t) => e, Ne = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? bi : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, rt = (e, t) => !ci(e, t), ht = { attribute: !0, type: String, converter: Ne, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Q.litPropertyMetadata ?? (Q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let se = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ht) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), o = this.getPropertyDescriptor(t, a, i);
      o !== void 0 && li(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: o, set: r } = di(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: o, set(n) {
      const s = o == null ? void 0 : o.call(this);
      r == null || r.call(this, n), this.requestUpdate(t, s, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ve("elementProperties"))) return;
    const t = hi(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ve("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ve("properties"))) {
      const i = this.properties, a = [...pi(i), ...ui(i)];
      for (const o of a) this.createProperty(o, i[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [a, o] of i) this.elementProperties.set(a, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const o = this._$Eu(i, a);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const o of a) i.unshift(pt(o));
    } else t !== void 0 && i.push(pt(t));
    return i;
  }
  static _$Eu(t, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const a of i.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return si(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var a;
      return (a = i.hostConnected) == null ? void 0 : a.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var a;
      return (a = i.hostDisconnected) == null ? void 0 : a.call(i);
    });
  }
  attributeChangedCallback(t, i, a) {
    this._$AK(t, a);
  }
  _$ET(t, i) {
    var r;
    const a = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, a);
    if (o !== void 0 && a.reflect === !0) {
      const n = (((r = a.converter) == null ? void 0 : r.toAttribute) !== void 0 ? a.converter : Ne).toAttribute(i, a.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, n;
    const a = this.constructor, o = a._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const s = a.getPropertyOptions(o), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((r = s.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? s.converter : Ne;
      this._$Em = o;
      const u = c.fromAttribute(i, s.type);
      this[o] = u ?? ((n = this._$Ej) == null ? void 0 : n.get(o)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, o = !1, r) {
    var n;
    if (t !== void 0) {
      const s = this.constructor;
      if (o === !1 && (r = this[t]), a ?? (a = s.getPropertyOptions(t)), !((a.hasChanged ?? rt)(r, i) || a.useDefault && a.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(s._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: o, wrapped: r }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), o === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [r, n] of o) {
        const { wrapped: s } = n, c = this[r];
        s !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (a = this._$EO) == null || a.forEach((o) => {
        var r;
        return (r = o.hostUpdate) == null ? void 0 : r.call(o);
      }), this.update(i)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((a) => {
      var o;
      return (o = a.hostUpdated) == null ? void 0 : o.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
se.elementStyles = [], se.shadowRootOptions = { mode: "open" }, se[ve("elementProperties")] = /* @__PURE__ */ new Map(), se[ve("finalized")] = /* @__PURE__ */ new Map(), He == null || He({ ReactiveElement: se }), (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis, bt = (e) => e, Re = ye.trustedTypes, mt = Re ? Re.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, zt = "$lit$", K = `lit$${Math.random().toFixed(9).slice(2)}$`, Nt = "?" + K, mi = `<${Nt}>`, oe = document, xe = () => oe.createComment(""), $e = (e) => e === null || typeof e != "object" && typeof e != "function", nt = Array.isArray, gi = (e) => nt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Ue = `[ 	
\f\r]`, be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, ft = />/g, Z = RegExp(`>|${Ue}(?:([^\\s"'>=/]+)(${Ue}*=${Ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, yt = /"/g, Rt = /^(?:script|style|textarea|title)$/i, fi = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = fi(1), de = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), te = oe.createTreeWalker(oe, 129);
function Ft(e, t) {
  if (!nt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return mt !== void 0 ? mt.createHTML(t) : t;
}
const vi = (e, t) => {
  const i = e.length - 1, a = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = be;
  for (let s = 0; s < i; s++) {
    const c = e[s];
    let u, m, h = -1, d = 0;
    for (; d < c.length && (n.lastIndex = d, m = n.exec(c), m !== null); ) d = n.lastIndex, n === be ? m[1] === "!--" ? n = gt : m[1] !== void 0 ? n = ft : m[2] !== void 0 ? (Rt.test(m[2]) && (o = RegExp("</" + m[2], "g")), n = Z) : m[3] !== void 0 && (n = Z) : n === Z ? m[0] === ">" ? (n = o ?? be, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? Z : m[3] === '"' ? yt : vt) : n === yt || n === vt ? n = Z : n === gt || n === ft ? n = be : (n = Z, o = void 0);
    const f = n === Z && e[s + 1].startsWith("/>") ? " " : "";
    r += n === be ? c + mi : h >= 0 ? (a.push(u), c.slice(0, h) + zt + c.slice(h) + K + f) : c + K + (h === -2 ? s : f);
  }
  return [Ft(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class we {
  constructor({ strings: t, _$litType$: i }, a) {
    let o;
    this.parts = [];
    let r = 0, n = 0;
    const s = t.length - 1, c = this.parts, [u, m] = vi(t, i);
    if (this.el = we.createElement(u, a), te.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = te.nextNode()) !== null && c.length < s; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(zt)) {
          const d = m[n++], f = o.getAttribute(h).split(K), y = /([.?@])?(.*)/.exec(d);
          c.push({ type: 1, index: r, name: y[2], strings: f, ctor: y[1] === "." ? _i : y[1] === "?" ? xi : y[1] === "@" ? $i : Le }), o.removeAttribute(h);
        } else h.startsWith(K) && (c.push({ type: 6, index: r }), o.removeAttribute(h));
        if (Rt.test(o.tagName)) {
          const h = o.textContent.split(K), d = h.length - 1;
          if (d > 0) {
            o.textContent = Re ? Re.emptyScript : "";
            for (let f = 0; f < d; f++) o.append(h[f], xe()), te.nextNode(), c.push({ type: 2, index: ++r });
            o.append(h[d], xe());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Nt) c.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(K, h + 1)) !== -1; ) c.push({ type: 7, index: r }), h += K.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const a = oe.createElement("template");
    return a.innerHTML = t, a;
  }
}
function pe(e, t, i = e, a) {
  var n, s;
  if (t === de) return t;
  let o = a !== void 0 ? (n = i._$Co) == null ? void 0 : n[a] : i._$Cl;
  const r = $e(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== r && ((s = o == null ? void 0 : o._$AO) == null || s.call(o, !1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = o : i._$Cl = o), o !== void 0 && (t = pe(e, o._$AS(e, t.values), o, a)), t;
}
class yi {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: a } = this._$AD, o = ((t == null ? void 0 : t.creationScope) ?? oe).importNode(i, !0);
    te.currentNode = o;
    let r = te.nextNode(), n = 0, s = 0, c = a[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let u;
        c.type === 2 ? u = new Se(r, r.nextSibling, this, t) : c.type === 1 ? u = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (u = new wi(r, this, t)), this._$AV.push(u), c = a[++s];
      }
      n !== (c == null ? void 0 : c.index) && (r = te.nextNode(), n++);
    }
    return te.currentNode = oe, o;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class Se {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, a, o) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = pe(this, t, i), $e(t) ? t === b || t == null || t === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : t !== this._$AH && t !== de && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : gi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== b && $e(this._$AH) ? this._$AA.nextSibling.data = t : this.T(oe.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: a } = t, o = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = we.createElement(Ft(a.h, a.h[0]), this.options)), a);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === o) this._$AH.p(i);
    else {
      const n = new yi(o, this), s = n.u(this.options);
      n.p(i), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = _t.get(t.strings);
    return i === void 0 && _t.set(t.strings, i = new we(t)), i;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, o = 0;
    for (const r of t) o === i.length ? i.push(a = new Se(this.O(xe()), this.O(xe()), this, this.options)) : a = i[o], a._$AI(r), o++;
    o < i.length && (this._$AR(a && a._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); t !== this._$AB; ) {
      const o = bt(t).nextSibling;
      bt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Le {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, o, r) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = b;
  }
  _$AI(t, i = this, a, o) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = pe(this, t, i, 0), n = !$e(t) || t !== this._$AH && t !== de, n && (this._$AH = t);
    else {
      const s = t;
      let c, u;
      for (t = r[0], c = 0; c < r.length - 1; c++) u = pe(this, s[a + c], i, c), u === de && (u = this._$AH[c]), n || (n = !$e(u) || u !== this._$AH[c]), u === b ? t = b : t !== b && (t += (u ?? "") + r[c + 1]), this._$AH[c] = u;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class _i extends Le {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
}
class xi extends Le {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== b);
  }
}
class $i extends Le {
  constructor(t, i, a, o, r) {
    super(t, i, a, o, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = pe(this, t, i, 0) ?? b) === de) return;
    const a = this._$AH, o = t === b && a !== b || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, r = t !== b && (a === b || o);
    o && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class wi {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    pe(this, t);
  }
}
const Be = ye.litHtmlPolyfillSupport;
Be == null || Be(we, Se), (ye.litHtmlVersions ?? (ye.litHtmlVersions = [])).push("3.3.3");
const ki = (e, t, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? t;
  let o = a._$litPart$;
  if (o === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = o = new Se(t.insertBefore(xe(), r), r, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = globalThis;
class W extends se {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ki(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return de;
  }
}
var Pt;
W._$litElement$ = !0, W.finalized = !0, (Pt = ie.litElementHydrateSupport) == null || Pt.call(ie, { LitElement: W });
const Ve = ie.litElementPolyfillSupport;
Ve == null || Ve({ LitElement: W });
(ie.litElementVersions ?? (ie.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Si = { attribute: !0, type: String, converter: Ne, reflect: !1, hasChanged: rt }, Ai = (e = Si, t, i) => {
  const { kind: a, metadata: o } = i;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), a === "accessor") {
    const { name: n } = i;
    return { set(s) {
      const c = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(n, c, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(n, void 0, e, s), s;
    } };
  }
  if (a === "setter") {
    const { name: n } = i;
    return function(s) {
      const c = this[n];
      t.call(this, s), this.requestUpdate(n, c, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function Ae(e) {
  return (t, i) => typeof i == "object" ? Ai(e, t, i) : ((a, o, r) => {
    const n = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, a), n ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(e) {
  return Ae({ ...e, state: !0, attribute: !1 });
}
const Ei = "custom:area-bubble-expander-card", Ci = "area-bubble-expander-card", qt = "area-bubble-expander-card-editor", Ti = "area-bubble-expander-card", Oi = ["light", "switch", "fan", "climate", "media_player"], Pi = [
  "sensor",
  "automation",
  "script",
  "scene",
  "input_number",
  "input_select",
  "button",
  "update",
  "device_tracker",
  "person",
  "camera",
  "alarm_control_panel"
], Ii = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, zi = {
  climate: ["off", "unavailable", "unknown"]
}, Ni = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), Ri = ["always_on", "critical", "infrastructure", "no_turn_off"], Fi = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], qi = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, Mt = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, Qe = {
  preset: "bubble_glass",
  glass: !0,
  compact: !1,
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 52,
  icon_size: 22,
  area_icon_size: 26,
  entity_icon_size: 22,
  background_opacity: 0.08,
  border_opacity: 0.12,
  show_shadows: !0,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  danger_color: "#ff5252",
  header_background: "rgba(255,255,255,0.05)",
  expanded_background: "rgba(255,255,255,0.07)",
  collapsed_background: "rgba(255,255,255,0.06)",
  row_background: "rgba(255,255,255,0.08)",
  chip_background: "rgba(255,255,255,0.11)",
  text_size: 15,
  secondary_text_size: 12
}, Mi = {
  bubble_glass: {},
  bubble_solid: {
    glass: !1,
    blur: 0,
    background_opacity: 1,
    row_background: "var(--secondary-background-color)",
    chip_background: "color-mix(in srgb, var(--primary-text-color) 9%, transparent)"
  },
  expander_minimal: {
    glass: !1,
    blur: 0,
    border_radius: 16,
    section_gap: 8,
    show_shadows: !1,
    header_background: "transparent",
    expanded_background: "transparent",
    collapsed_background: "transparent",
    row_background: "var(--secondary-background-color)"
  },
  home_assistant_native: {
    glass: !1,
    blur: 0,
    border_radius: 12,
    section_gap: 8,
    show_shadows: !1,
    header_background: "var(--card-background-color)",
    expanded_background: "var(--card-background-color)",
    collapsed_background: "var(--card-background-color)",
    row_background: "var(--secondary-background-color)",
    chip_background: "var(--secondary-background-color)"
  },
  dark_glass: {
    glass: !0,
    header_background: "rgba(8, 12, 20, 0.6)",
    expanded_background: "rgba(8, 12, 20, 0.54)",
    collapsed_background: "rgba(8, 12, 20, 0.48)",
    row_background: "rgba(10, 15, 24, 0.58)",
    chip_background: "rgba(255,255,255,0.1)"
  },
  light_glass: {
    glass: !0,
    header_background: "rgba(255,255,255,0.52)",
    expanded_background: "rgba(255,255,255,0.46)",
    collapsed_background: "rgba(255,255,255,0.38)",
    row_background: "rgba(255,255,255,0.5)",
    chip_background: "rgba(255,255,255,0.62)"
  },
  compact_mobile: {
    compact: !0,
    border_radius: 18,
    section_gap: 7,
    row_height: 44,
    icon_size: 19,
    area_icon_size: 22,
    entity_icon_size: 19,
    text_size: 14,
    secondary_text_size: 11
  }
}, me = {
  type: Ei,
  language: "auto",
  rtl: "auto",
  show_header: !0,
  show_total_count: !0,
  show_active_area_count: !0,
  show_empty: !0,
  default_expanded: !1,
  remember_expanded_state: !0,
  expand_on_header_tap: !0,
  collapse_empty_areas: !0,
  show_area_icons: !0,
  show_entity_icons: !0,
  show_entity_secondary_info: !0,
  show_domain_chips: !0,
  domain_chip_mode: "icons",
  show_preview_entities: !0,
  preview_entity_count: 3,
  show_area_turn_off: !0,
  show_entity_turn_off: !0,
  show_global_turn_off: !1,
  confirm_area_turn_off: !0,
  confirm_entity_turn_off: !1,
  confirm_global_turn_off: !0,
  area_turn_off_mode: "safe_displayed_entities",
  domains: Oi,
  exclude_domains: Pi,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: Ii,
  inactive_states: zi,
  paused_media_players_active: !0,
  protected_labels: Ri,
  protected_entities: Fi,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: qi,
  domain_icons: Mt,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: Qe,
  max_entities_per_area: 0,
  show_last_changed: !1,
  show_brightness: !0,
  show_temperature: !0,
  show_media_title: !0,
  show_entity_ids: !1,
  show_area_ids: !1,
  show_debug: !1,
  debug: !1,
  enable_animations: !0,
  respect_reduced_motion: !0
}, Di = ke`
  :host {
    display: block;
    color: var(--primary-text-color);
    --abec-editor-radius: 12px;
    --abec-editor-control-height: 44px;
    --abec-editor-surface: var(--card-background-color, var(--ha-card-background));
    --abec-editor-muted-surface: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    --abec-editor-border: var(--divider-color, rgba(127, 127, 127, 0.24));
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    color: inherit;
  }

  .editor {
    display: grid;
    gap: 16px;
    min-width: 0;
  }

  .editor-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 2px 2px 0;
  }

  .editor-heading ha-icon {
    flex: 0 0 auto;
    color: var(--primary-color);
    --mdc-icon-size: 28px;
  }

  .editor-heading-text {
    min-width: 0;
  }

  .editor-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.25;
  }

  .editor-subtitle,
  .section-description,
  .picker-heading span,
  .field-helper,
  .picker-meta,
  .status-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.4;
  }

  .editor-layout {
    display: grid;
    grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
    align-items: start;
    gap: 16px;
    min-width: 0;
  }

  .section-nav {
    position: sticky;
    top: 8px;
    display: grid;
    gap: 3px;
    max-height: min(72vh, 720px);
    overflow: auto;
    padding: 8px;
    border: 1px solid var(--abec-editor-border);
    border-radius: var(--abec-editor-radius);
    background: var(--abec-editor-surface);
  }

  .section-tab {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 42px;
    padding: 7px 9px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    text-align: start;
    cursor: pointer;
  }

  .section-tab:hover {
    background: var(--abec-editor-muted-surface);
  }

  .section-tab[aria-selected="true"] {
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    color: var(--primary-color);
    font-weight: 600;
  }

  .section-tab ha-icon {
    --mdc-icon-size: 21px;
  }

  .section-tab .chevron {
    opacity: 0;
    --mdc-icon-size: 18px;
  }

  .section-tab[aria-selected="true"] .chevron {
    opacity: 1;
  }

  :host-context([dir="rtl"]) .section-tab .chevron,
  .editor[dir="rtl"] .section-tab .chevron {
    transform: rotate(180deg);
  }

  .mobile-navigation {
    display: none;
  }

  .section-panel {
    display: grid;
    gap: 14px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--abec-editor-border);
    border-radius: var(--abec-editor-radius);
    background: var(--abec-editor-surface);
  }

  .section-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 10px;
    padding-block-end: 12px;
    border-block-end: 1px solid var(--abec-editor-border);
  }

  .section-heading > ha-icon {
    margin-block-start: 1px;
    color: var(--primary-color);
    --mdc-icon-size: 24px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
  }

  .field {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .field-label,
  .row-label {
    font-weight: 500;
    line-height: 1.35;
  }

  .field-helper code {
    font-family: var(--code-font-family, monospace);
    font-size: 11px;
  }

  input:not([type="checkbox"]),
  select,
  textarea {
    width: 100%;
    min-width: 0;
    min-height: var(--abec-editor-control-height);
    padding: 9px 11px;
    border: 1px solid var(--abec-editor-border);
    border-radius: 8px;
    outline: none;
    background: var(--abec-editor-surface);
    color: var(--primary-text-color);
  }

  textarea {
    min-height: 104px;
    resize: vertical;
    line-height: 1.45;
  }

  input:not([type="checkbox"]):hover,
  select:hover,
  textarea:hover {
    border-color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
  }

  input:not([type="checkbox"]):focus,
  select:focus,
  textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  input[aria-invalid="true"],
  textarea[aria-invalid="true"] {
    border-color: var(--error-color, #db4437);
    box-shadow: 0 0 0 1px var(--error-color, #db4437);
  }

  select {
    cursor: pointer;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-height: 44px;
  }

  .row-text {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .native-switch {
    position: relative;
    flex: 0 0 auto;
    width: 40px;
    height: 24px;
    margin: 0;
    border: 2px solid color-mix(in srgb, var(--secondary-text-color) 65%, transparent);
    border-radius: 999px;
    appearance: none;
    background: transparent;
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease;
  }

  .native-switch::before {
    content: "";
    position: absolute;
    inset-block-start: 3px;
    inset-inline-start: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--secondary-text-color);
    transition: transform 120ms ease, background-color 120ms ease;
  }

  .native-switch:checked {
    border-color: var(--primary-color);
    background: var(--primary-color);
  }

  .native-switch:checked::before {
    background: var(--text-primary-color, white);
    transform: translateX(16px);
  }

  .editor[dir="rtl"] .native-switch:checked::before {
    transform: translateX(-16px);
  }

  .native-switch:focus-visible,
  button:focus-visible,
  [role="button"]:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .yaml {
    direction: ltr;
    text-align: left;
    tab-size: 2;
    font-family: var(--code-font-family, ui-monospace, SFMono-Regular, Consolas, monospace);
    font-size: 12px;
  }

  .json-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .json-status {
    min-width: 0;
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .json-status.error {
    color: var(--error-color, #db4437);
  }

  .json-actions,
  .picker-actions,
  .order-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }

  .action-button,
  .pill,
  .icon-action,
  .drag-handle {
    min-height: 34px;
    border: 1px solid var(--abec-editor-border);
    border-radius: 9px;
    background: transparent;
    cursor: pointer;
  }

  .action-button,
  .pill {
    padding: 0 11px;
    font-size: 12px;
    font-weight: 600;
  }

  .action-button.primary {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color, white);
  }

  .action-button:hover,
  .pill:hover,
  .icon-action:hover,
  .drag-handle:hover {
    background: var(--abec-editor-muted-surface);
  }

  .action-button[disabled],
  .pill[disabled],
  .icon-action[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .picker-panel {
    display: grid;
    gap: 11px;
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--abec-editor-border);
    border-radius: 10px;
    background: var(--abec-editor-muted-surface);
  }

  .picker-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(170px, 270px);
    align-items: center;
    gap: 10px;
  }

  .picker-heading.single {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .picker-heading strong,
  .picker-heading span {
    display: block;
  }

  .picker-list {
    display: grid;
    gap: 7px;
    max-height: 360px;
    overflow: auto;
    overscroll-behavior: contain;
    padding-inline-end: 2px;
  }

  .picker-list.entities-picker {
    max-height: 480px;
  }

  .picker-list.compact-picker {
    max-height: 300px;
  }

  .picker-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 52px;
    padding: 7px 8px;
    border: 1px solid color-mix(in srgb, var(--abec-editor-border) 78%, transparent);
    border-radius: 9px;
    background: var(--abec-editor-surface);
  }

  .picker-item.order-item {
    grid-template-columns: auto auto minmax(0, 1fr) auto;
  }

  .picker-item.drag-over {
    border-color: var(--primary-color);
    box-shadow: inset 0 0 0 1px var(--primary-color);
  }

  .picker-item.dragging {
    opacity: 0.55;
  }

  .picker-item > ha-icon {
    color: var(--primary-color);
    --mdc-icon-size: 22px;
  }

  .picker-main {
    min-width: 0;
  }

  .picker-title,
  .picker-meta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .picker-title {
    font-weight: 500;
  }

  .pill {
    border-radius: 999px;
  }

  .pill.active {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    color: var(--primary-color);
  }

  .pill.danger.active {
    border-color: var(--error-color, #db4437);
    background: color-mix(in srgb, var(--error-color, #db4437) 13%, transparent);
    color: var(--error-color, #db4437);
  }

  .icon-action,
  .drag-handle {
    display: inline-grid;
    place-items: center;
    width: 34px;
    padding: 0;
  }

  .icon-action ha-icon,
  .drag-handle ha-icon {
    --mdc-icon-size: 19px;
  }

  .drag-handle {
    border-color: transparent;
    cursor: grab;
    touch-action: none;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .status-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 9px 10px;
    border: 1px solid var(--abec-editor-border);
    border-radius: 9px;
    background: var(--abec-editor-surface);
  }

  .template-output {
    min-height: 420px;
    white-space: pre;
  }

  .template-output.small {
    min-height: 150px;
  }

  .empty-picker {
    padding: 18px 10px;
    color: var(--secondary-text-color);
    text-align: center;
    font-size: 13px;
  }

  .visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  @media (max-width: 760px) {
    .editor-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .section-nav {
      display: none;
    }

    .mobile-navigation {
      display: grid;
      gap: 6px;
    }

    .section-panel {
      padding: 14px;
    }

    .picker-heading,
    .picker-heading.single {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 520px) {
    .editor-title {
      font-size: 18px;
    }

    .section-panel {
      padding: 12px;
    }

    .picker-item,
    .picker-item.order-item {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .picker-item .picker-actions,
    .picker-item .order-actions {
      grid-column: 1 / -1;
      width: 100%;
    }

    .picker-item .picker-actions .pill {
      flex: 1 1 0;
    }

    .picker-item.order-item > .drag-handle {
      grid-column: 1;
    }

    .json-footer {
      align-items: stretch;
      flex-direction: column;
    }

    .json-actions .action-button {
      flex: 1 1 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }
`, q = (e) => Array.isArray(e) ? [...e] : [], V = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, ce = (e) => {
  const t = V(e.style), i = typeof t.preset == "string" ? t.preset : Qe.preset, a = Mi[i] ?? {}, o = { ...Qe, ...a, ...t }, r = {
    ...me,
    ...e,
    style: o
  };
  return {
    ...r,
    type: "custom:area-bubble-expander-card",
    title: r.title ?? "",
    empty_title: r.empty_title ?? "",
    empty_subtitle: r.empty_subtitle ?? "",
    include_entities: q(r.include_entities),
    exclude_entities: q(r.exclude_entities),
    include_areas: q(r.include_areas),
    exclude_areas: q(r.exclude_areas),
    exclude_labels: q(r.exclude_labels),
    exclude_entity_category: q(r.exclude_entity_category),
    exclude_by_regex: q(r.exclude_by_regex),
    active_states: { ...me.active_states ?? {}, ...V(e.active_states) },
    inactive_states: { ...me.inactive_states ?? {}, ...V(e.inactive_states) },
    protected_entities: q(r.protected_entities),
    disable_turn_off_for_domains: q(r.disable_turn_off_for_domains),
    dangerous_domains: q(r.dangerous_domains),
    service_mapping: { ...me.service_mapping ?? {}, ...V(e.service_mapping) },
    custom_area_order: q(r.custom_area_order),
    custom_entity_order: q(r.custom_entity_order),
    areas: { ...V(r.areas) },
    entity_overrides: { ...V(r.entity_overrides) },
    labels: { ...V(r.labels) },
    domain_labels: { ...V(r.domain_labels) },
    domain_icons: { ...me.domain_icons ?? {}, ...V(r.domain_icons) },
    style: o
  };
}, Li = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, Ce = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), ji = (e) => Array.isArray(e) ? e.join(`
`) : "", xt = {
  he: {
    title: "מה דלוק בבית",
    empty_title: "הכל כבוי",
    empty_subtitle: "אין מכשירים דלוקים כרגע",
    turn_off_area: "כבה אזור",
    turn_off_entity: "כבה",
    turn_off_all: "כבה הכל",
    expand_area: "פתח אזור",
    collapse_area: "סגור אזור",
    active_entities: "דלוקים",
    active_areas: "אזורים פעילים",
    no_area: "ללא אזור",
    confirm_area_turn_off: "לכבות {count} מכשירים דלוקים באזור {area}?",
    confirm_entity_turn_off: "לכבות את {entity}?",
    confirm_global_turn_off: "לכבות את כל המכשירים הדלוקים?",
    protected: "מוגן",
    protected_entity: "ישות מוגנת",
    protected_will_remain: "ישויות מוגנות לא יכבו.",
    not_available: "לא זמין",
    no_active_entities: "אין ישויות פעילות",
    show_more: "הצג עוד",
    show_less: "הצג פחות",
    locked_by_safety: "נעול על ידי הגנת בטיחות",
    area: "אזור",
    entities: "ישויות",
    debug_skipped: "דילוגים"
  },
  en: {
    title: "What's on at home",
    empty_title: "Everything is off",
    empty_subtitle: "No active devices right now",
    turn_off_area: "Turn off area",
    turn_off_entity: "Turn off",
    turn_off_all: "Turn off all",
    expand_area: "Expand area",
    collapse_area: "Collapse area",
    active_entities: "active",
    active_areas: "active areas",
    no_area: "No Area",
    confirm_area_turn_off: "Turn off {count} active devices in {area}?",
    confirm_entity_turn_off: "Turn off {entity}?",
    confirm_global_turn_off: "Turn off all active devices?",
    protected: "Protected",
    protected_entity: "Protected entity",
    protected_will_remain: "Protected entities will not be turned off.",
    not_available: "Not available",
    no_active_entities: "No active entities",
    show_more: "Show more",
    show_less: "Show less",
    locked_by_safety: "Locked by safety rules",
    area: "Area",
    entities: "entities",
    debug_skipped: "Skipped"
  }
}, Hi = {
  he: {
    light: "תאורה",
    switch: "מתגים",
    fan: "מאווררים",
    climate: "מיזוג",
    media_player: "מדיה",
    cover: "תריסים",
    lock: "מנעולים",
    binary_sensor: "חיישנים",
    input_boolean: "בוליאנים"
  },
  en: {
    light: "Lights",
    switch: "Switches",
    fan: "Fans",
    climate: "Climate",
    media_player: "Media",
    cover: "Covers",
    lock: "Locks",
    binary_sensor: "Binary sensors",
    input_boolean: "Booleans"
  }
}, ue = (e, t) => {
  var a;
  if (t === "he" || t === "en") return t;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Dt = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = ue(e, t.language), a = document.documentElement.dir;
  return i === "he" || a === "rtl";
}, A = (e, t, i, a = {}) => {
  const o = ue(t, e.language);
  let n = e.labels[i] ?? xt[o][i] ?? xt.en[i] ?? i;
  for (const [s, c] of Object.entries(a))
    n = n.replace(new RegExp(`\\{${s}\\}`, "g"), String(c));
  return n;
}, $t = (e, t, i) => {
  const a = ue(t, e.language);
  return e.domain_labels[i] ?? Hi[a][i] ?? i.replace(/_/g, " ");
}, Ui = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const o = a.area_id ?? a.id ?? i;
    t.set(o, a);
  }
  return t;
}, We = (e, t, i) => {
  var h, d;
  const a = Ui(e), o = (h = e == null ? void 0 : e.entities) == null ? void 0 : h[i], r = o != null && o.device_id ? (d = e == null ? void 0 : e.devices) == null ? void 0 : d[o.device_id] : void 0, n = (o == null ? void 0 : o.area_id) ?? (r == null ? void 0 : r.area_id) ?? "no_area", s = n ? a.get(n) : void 0, c = t.areas[n] ?? t.areas[(s == null ? void 0 : s.name) ?? ""], u = (s == null ? void 0 : s.name) ?? A(t, e, "no_area"), m = (c == null ? void 0 : c.name) ?? u;
  return {
    id: n || "no_area",
    name: m,
    icon: (c == null ? void 0 : c.icon) ?? (s == null ? void 0 : s.icon) ?? (n === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, Bi = (e, t, i) => {
  const a = i.areas[e] ?? i.areas[t];
  return a != null && a.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, ge = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, Vi = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), Ji = (e, t, i, a) => {
  if (e.state === "unavailable") return A(i, a, "not_available");
  if (t === "light" && i.show_brightness) {
    const o = ge(e, "brightness");
    if (o !== void 0) return `${Math.round(o / 255 * 100)}%`;
  }
  if (t === "fan") {
    const o = ge(e, "percentage");
    if (o !== void 0) return `${o}%`;
  }
  if (t === "climate") {
    const o = String(e.attributes.hvac_action ?? e.state), r = ge(e, "current_temperature"), n = ge(e, "temperature");
    return i.show_temperature && (r !== void 0 || n !== void 0) ? [o, r !== void 0 ? `${r}°` : "", n !== void 0 ? `→ ${n}°` : ""].filter(Boolean).join(" ") : o;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const o = ge(e, "current_position");
    return o !== void 0 ? `${o}%` : e.state;
  }
  return String(e.state);
}, Gi = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const a = Math.round(i / 60);
  return a < 24 ? `${a}h` : `${Math.round(a / 24)}d`;
}, Ki = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(A(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(Gi(e.entity)), i.filter(Boolean).join(" · ");
}, Qi = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), Wi = (e, t, i) => {
  var n, s;
  const a = String(e.state ?? "").toLowerCase();
  if (Ni.has(a) || t === "media_player" && !i.paused_media_players_active && a === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (Qi.has(c)) return !0;
  }
  const o = (n = i.inactive_states[t]) == null ? void 0 : n.map((c) => c.toLowerCase());
  if (o != null && o.includes(a)) return !1;
  const r = (s = i.active_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  return r != null && r.length ? r.includes(a) : o != null && o.length ? !0 : a === "on";
}, Yi = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []];
}, Xi = (e, t, i) => {
  const a = i.entity_overrides[e];
  return a != null && a.protected || i.protected_entities.includes(e) ? !0 : t.some((o) => i.protected_labels.includes(o));
}, Lt = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return A(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, Zi = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, Ie = (e, t) => e.filter((i) => !Lt(i, t)), Fe = (e, t, i) => {
  const a = e.indexOf(t);
  if (a >= 0) return a;
  if (i) {
    const o = e.indexOf(i);
    if (o >= 0) return o;
  }
  return Number.MAX_SAFE_INTEGER;
}, ea = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((a, o) => a.name.localeCompare(o.name)) : t.area_sort === "count_asc" ? i.sort((a, o) => a.entities.length - o.entities.length || a.name.localeCompare(o.name)) : t.area_sort === "custom" ? i.sort(
    (a, o) => Fe(t.custom_area_order, a.id, a.name) - Fe(t.custom_area_order, o.id, o.name) || a.name.localeCompare(o.name)
  ) : i.sort((a, o) => o.entities.length - a.entities.length || a.name.localeCompare(o.name));
}, ta = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((a, o) => a.name.localeCompare(o.name)) : t.entity_sort === "state" ? i.sort((a, o) => a.entity.state.localeCompare(o.entity.state) || a.name.localeCompare(o.name)) : t.entity_sort === "last_changed" ? i.sort((a, o) => new Date(o.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((a, o) => Fe(t.custom_entity_order, a.entityId) - Fe(t.custom_entity_order, o.entityId)) : i.sort((a, o) => a.domain.localeCompare(o.domain) || a.name.localeCompare(o.name));
}, ia = (e) => e.split(".")[0] ?? "", aa = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), oa = (e, t) => t.some((i) => i.test(e)), Ye = (e, t) => {
  var u;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), a = [], o = aa(t.exclude_by_regex), r = new Set(t.domains), n = new Set(t.exclude_domains), s = new Set(t.include_entities);
  for (const m of Object.values(e.states)) {
    const h = m.entity_id, d = ia(h), f = (u = e.entities) == null ? void 0 : u[h], y = t.entity_overrides[h], x = Yi(e, h), l = [];
    y != null && y.hidden && l.push("hidden by entity override"), t.exclude_entities.includes(h) && l.push("excluded entity"), t.exclude_unavailable && m.state === "unavailable" && l.push("unavailable"), t.exclude_hidden_entities && (f != null && f.hidden_by || f != null && f.hidden) && l.push("hidden entity"), f != null && f.disabled_by && l.push("disabled entity"), f != null && f.entity_category && t.exclude_entity_category.includes(f.entity_category) && l.push("excluded entity category"), n.has(d) && l.push("excluded domain"), !r.has(d) && !s.has(h) && l.push("domain not included"), x.some(($) => t.exclude_labels.includes($)) && l.push("excluded label"), oa(h, o) && l.push("excluded by regex");
    const g = We(e, t, h);
    if (Bi(g.id, g.name, t) || l.push("excluded area"), Wi(m, d, t) || l.push("inactive state"), l.length) {
      a.push({ entity_id: h, reasons: l });
      continue;
    }
    const _ = Xi(h, x, t), v = {
      entity: m,
      entityId: h,
      domain: d,
      name: Vi(m, y == null ? void 0 : y.name),
      icon: (y == null ? void 0 : y.icon) ?? String(m.attributes.icon ?? t.domain_icons[d] ?? Mt[d] ?? "mdi:toggle-switch-outline"),
      areaId: g.id,
      areaName: g.name,
      areaIcon: g.icon,
      labels: x,
      category: f == null ? void 0 : f.entity_category,
      hidden: !!(f != null && f.hidden_by || f != null && f.hidden),
      active: !0,
      protected: _,
      controllable: !0,
      secondary: Ji(m, d, t, e),
      skipReasons: []
    };
    if (v.disabledReason = Lt(v, t), v.controllable = !v.disabledReason, !Zi(v, t)) {
      a.push({ entity_id: h, reasons: ["protected hidden"] });
      continue;
    }
    const E = i.get(g.id) ?? {
      id: g.id,
      name: g.name,
      icon: g.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    E.entities.push(v), E.domainCounts[d] = (E.domainCounts[d] ?? 0) + 1, _ && (E.protectedCount += 1), i.set(g.id, E);
  }
  const c = [...i.values()].map((m) => ({ ...m, entities: ta(m.entities, t) }));
  return { groups: ea(c, t), skipped: a };
};
var ra = Object.defineProperty, na = Object.getOwnPropertyDescriptor, R = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? na(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ra(t, i, o), o;
};
const j = [
  { id: "General", icon: "mdi:tune", title: { en: "General", he: "כללי" }, description: { en: "Title and summary behavior.", he: "כותרת והתנהגות הסיכום של הכרטיס." } },
  { id: "Display", icon: "mdi:card-outline", title: { en: "Display", he: "תצוגה" }, description: { en: "Expansion, icons, previews, and row limits.", he: "פתיחה, סמלים, תצוגה מקדימה ומגבלות שורות." } },
  { id: "Areas", icon: "mdi:floor-plan", title: { en: "Areas", he: "אזורים" }, description: { en: "Choose, hide, rename, and order Home Assistant Areas.", he: "בחירה, הסתרה, שינוי שם וסידור אזורים מ־Home Assistant." } },
  { id: "Entities", icon: "mdi:devices", title: { en: "Entities", he: "ישויות" }, description: { en: "Choose entities, domains, labels, and overrides.", he: "בחירת ישויות, תחומים, תוויות ודריסות." } },
  { id: "Active Rules", icon: "mdi:list-status", title: { en: "Active rules", he: "כללי פעילות" }, description: { en: "Define which entity states count as active.", he: "הגדרה אילו מצבי ישות נחשבים לפעילים." } },
  { id: "Actions", icon: "mdi:gesture-tap-button", title: { en: "Actions", he: "פעולות" }, description: { en: "Turn-off controls, confirmations, and tap actions.", he: "פקדי כיבוי, אישורים ופעולות לחיצה." } },
  { id: "Safety", icon: "mdi:shield-check-outline", title: { en: "Safety", he: "בטיחות" }, description: { en: "Protect critical entities and domains.", he: "הגנה על ישויות ותחומים קריטיים." } },
  { id: "Sorting", icon: "mdi:sort", title: { en: "Sorting", he: "מיון" }, description: { en: "Control Area and entity display order.", he: "שליטה בסדר התצוגה של אזורים וישויות." } },
  { id: "Style", icon: "mdi:palette-outline", title: { en: "Style", he: "עיצוב" }, description: { en: "Appearance, spacing, typography, and colors.", he: "מראה, מרווחים, טיפוגרפיה וצבעים." } },
  { id: "Hebrew / RTL", icon: "mdi:translate", title: { en: "Language & RTL", he: "שפה ו־RTL" }, description: { en: "Language, direction, and custom labels.", he: "שפה, כיוון ותוויות מותאמות." } },
  { id: "Advanced", icon: "mdi:cog-outline", title: { en: "Advanced", he: "מתקדם" }, description: { en: "Secondary data and animation preferences.", he: "מידע משני והעדפות הנפשה." } },
  { id: "Debug", icon: "mdi:bug-outline", title: { en: "Debug", he: "ניפוי שגיאות" }, description: { en: "Diagnostics and the resulting raw configuration.", he: "אבחון והתצורה הגולמית המתקבלת." } },
  { id: "Badge", icon: "mdi:counter", title: { en: "Badge helper", he: "עזר לתג" }, description: { en: "Generate optional template sensors and badge YAML.", he: "יצירת חיישני Template ו־YAML אופציונלי לתג." } }
], sa = [
  { section: "General", key: "id", label: "Stable card ID", type: "text" },
  { section: "General", key: "title", label: "Card title", type: "text" },
  { section: "General", key: "show_header", label: "Show header", type: "boolean" },
  { section: "General", key: "show_total_count", label: "Show total active count", type: "boolean" },
  { section: "General", key: "show_active_area_count", label: "Show active area count", type: "boolean" },
  { section: "General", key: "show_empty", label: "Show empty state", type: "boolean" },
  { section: "General", key: "empty_title", label: "Empty title", type: "text" },
  { section: "General", key: "empty_subtitle", label: "Empty subtitle", type: "text" },
  { section: "Display", key: "default_expanded", label: "Default expanded", type: "boolean" },
  { section: "Display", key: "remember_expanded_state", label: "Remember expanded state", type: "boolean" },
  { section: "Display", key: "expand_on_header_tap", label: "Expand on header tap", type: "boolean" },
  { section: "Display", key: "collapse_empty_areas", label: "Collapse empty areas", type: "boolean" },
  { section: "Display", key: "show_area_icons", label: "Show area icons", type: "boolean" },
  { section: "Display", key: "show_entity_icons", label: "Show entity icons", type: "boolean" },
  { section: "Display", key: "show_entity_secondary_info", label: "Show secondary info", type: "boolean" },
  { section: "Display", key: "show_domain_chips", label: "Show domain chips", type: "boolean" },
  {
    section: "Display",
    key: "domain_chip_mode",
    label: "Domain chip mode",
    type: "select",
    options: [
      { value: "icons", label: "Icons" },
      { value: "text", label: "Text" },
      { value: "icons_and_text", label: "Icons and text" }
    ]
  },
  { section: "Display", key: "show_preview_entities", label: "Show preview entities", type: "boolean" },
  { section: "Display", key: "preview_entity_count", label: "Preview entity count", type: "number", min: 0, max: 10, step: 1 },
  { section: "Display", key: "max_entities_per_area", label: "Max entities per area (0 = unlimited)", type: "number", min: 0, max: 200, step: 1 },
  { section: "Areas", key: "include_areas", label: "Include areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "exclude_areas", label: "Exclude areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "custom_area_order", label: "Custom area order", type: "multi-text" },
  { section: "Areas", key: "areas", label: "Area overrides JSON", type: "textarea" },
  { section: "Entities", key: "domains", label: "Included domains", type: "multi-text" },
  { section: "Entities", key: "exclude_domains", label: "Excluded domains", type: "multi-text" },
  { section: "Entities", key: "include_entities", label: "Include entities", type: "multi-text" },
  { section: "Entities", key: "exclude_entities", label: "Exclude entities", type: "multi-text" },
  { section: "Entities", key: "exclude_labels", label: "Exclude labels", type: "multi-text" },
  { section: "Entities", key: "exclude_entity_category", label: "Exclude entity categories", type: "multi-text" },
  { section: "Entities", key: "exclude_by_regex", label: "Exclude by regex", type: "multi-text" },
  { section: "Entities", key: "exclude_hidden_entities", label: "Exclude hidden entities", type: "boolean" },
  { section: "Entities", key: "exclude_unavailable", label: "Exclude unavailable", type: "boolean" },
  { section: "Entities", key: "entity_overrides", label: "Entity overrides JSON", type: "textarea" },
  { section: "Entities", key: "domain_icons", label: "Domain icons JSON", type: "textarea" },
  { section: "Active Rules", key: "paused_media_players_active", label: "Paused media players count as active", type: "boolean" },
  { section: "Active Rules", key: "active_states", label: "Active states JSON", type: "textarea" },
  { section: "Active Rules", key: "inactive_states", label: "Inactive states JSON", type: "textarea" },
  { section: "Actions", key: "show_area_turn_off", label: "Show area turn-off", type: "boolean" },
  { section: "Actions", key: "show_entity_turn_off", label: "Show entity turn-off", type: "boolean" },
  { section: "Actions", key: "show_global_turn_off", label: "Show global turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_area_turn_off", label: "Confirm area turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_entity_turn_off", label: "Confirm entity turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_global_turn_off", label: "Confirm global turn-off", type: "boolean" },
  {
    section: "Actions",
    key: "area_turn_off_mode",
    label: "Area turn-off mode",
    type: "select",
    options: [
      { value: "safe_displayed_entities", label: "Safe displayed entities" },
      { value: "domain_grouped_services", label: "Domain grouped services" },
      { value: "homeassistant_area", label: "Home Assistant area target" }
    ]
  },
  { section: "Actions", key: "service_mapping", label: "Service mapping JSON", type: "textarea" },
  { section: "Actions", key: "tap_action", label: "Tap action JSON", type: "textarea" },
  { section: "Actions", key: "hold_action", label: "Hold action JSON", type: "textarea" },
  { section: "Actions", key: "double_tap_action", label: "Double-tap action JSON", type: "textarea" },
  { section: "Safety", key: "protected_labels", label: "Protected labels", type: "multi-text" },
  { section: "Safety", key: "protected_entities", label: "Protected entities", type: "multi-text" },
  { section: "Safety", key: "disable_turn_off_for_domains", label: "Disable turn-off for domains", type: "multi-text" },
  { section: "Safety", key: "dangerous_domains", label: "Dangerous domains", type: "multi-text" },
  {
    section: "Safety",
    key: "protected_entity_behavior",
    label: "Protected entity behavior",
    type: "select",
    options: [
      { value: "hide", label: "Hide" },
      { value: "show_disabled", label: "Show disabled" },
      { value: "show_with_lock_icon", label: "Show with lock icon" }
    ]
  },
  {
    section: "Safety",
    key: "safety_mode",
    label: "Safety mode",
    type: "select",
    options: [
      { value: "strict", label: "Strict" },
      { value: "normal", label: "Normal" },
      { value: "custom", label: "Custom" }
    ]
  },
  {
    section: "Sorting",
    key: "area_sort",
    label: "Area sort",
    type: "select",
    options: [
      { value: "count_desc", label: "Count descending" },
      { value: "count_asc", label: "Count ascending" },
      { value: "name", label: "Name" },
      { value: "custom", label: "Custom" },
      { value: "original", label: "Original" }
    ]
  },
  {
    section: "Sorting",
    key: "entity_sort",
    label: "Entity sort",
    type: "select",
    options: [
      { value: "domain", label: "Domain" },
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last_changed", label: "Last changed" },
      { value: "custom", label: "Custom" }
    ]
  },
  { section: "Sorting", key: "custom_entity_order", label: "Custom entity order", type: "multi-text" },
  {
    section: "Style",
    key: "style.preset",
    label: "Theme preset",
    type: "select",
    options: [
      { value: "bubble_glass", label: "Bubble Glass" },
      { value: "bubble_solid", label: "Bubble Solid" },
      { value: "expander_minimal", label: "Expander Minimal" },
      { value: "home_assistant_native", label: "Home Assistant Native" },
      { value: "dark_glass", label: "Dark Glass" },
      { value: "light_glass", label: "Light Glass" },
      { value: "compact_mobile", label: "Compact Mobile" }
    ]
  },
  { section: "Style", key: "style.glass", label: "Glass mode", type: "boolean" },
  { section: "Style", key: "style.compact", label: "Compact mode", type: "boolean" },
  { section: "Style", key: "style.border_radius", label: "Border radius", type: "number", min: 4, max: 40, step: 1 },
  { section: "Style", key: "style.blur", label: "Blur", type: "number", min: 0, max: 40, step: 1 },
  { section: "Style", key: "style.section_gap", label: "Section gap", type: "number", min: 4, max: 30, step: 1 },
  { section: "Style", key: "style.row_height", label: "Row height", type: "number", min: 40, max: 80, step: 1 },
  { section: "Style", key: "style.icon_size", label: "Base icon size", type: "number", min: 12, max: 48, step: 1 },
  { section: "Style", key: "style.area_icon_size", label: "Area icon size", type: "number", min: 12, max: 52, step: 1 },
  { section: "Style", key: "style.entity_icon_size", label: "Entity icon size", type: "number", min: 12, max: 48, step: 1 },
  { section: "Style", key: "style.background_opacity", label: "Background opacity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.border_opacity", label: "Border opacity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.show_shadows", label: "Show shadows", type: "boolean" },
  { section: "Style", key: "style.shadow_intensity", label: "Shadow intensity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.accent_color", label: "Accent color", type: "color" },
  { section: "Style", key: "style.danger_color", label: "Danger color", type: "color" },
  { section: "Style", key: "style.header_background", label: "Header background", type: "text" },
  { section: "Style", key: "style.expanded_background", label: "Expanded background", type: "text" },
  { section: "Style", key: "style.collapsed_background", label: "Collapsed background", type: "text" },
  { section: "Style", key: "style.row_background", label: "Row background", type: "text" },
  { section: "Style", key: "style.chip_background", label: "Chip background", type: "text" },
  { section: "Style", key: "style.text_size", label: "Primary text size", type: "number", min: 10, max: 28, step: 1 },
  { section: "Style", key: "style.secondary_text_size", label: "Secondary text size", type: "number", min: 8, max: 22, step: 1 },
  {
    section: "Hebrew / RTL",
    key: "language",
    label: "Language",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "he", label: "Hebrew" },
      { value: "en", label: "English" }
    ]
  },
  {
    section: "Hebrew / RTL",
    key: "rtl",
    label: "RTL",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "true", label: "Enabled" },
      { value: "false", label: "Disabled" }
    ]
  },
  { section: "Hebrew / RTL", key: "labels", label: "Custom labels JSON", type: "textarea" },
  { section: "Hebrew / RTL", key: "domain_labels", label: "Custom domain labels JSON", type: "textarea" },
  { section: "Advanced", key: "show_last_changed", label: "Show last changed", type: "boolean" },
  { section: "Advanced", key: "show_brightness", label: "Show light brightness", type: "boolean" },
  { section: "Advanced", key: "show_temperature", label: "Show climate temperature", type: "boolean" },
  { section: "Advanced", key: "show_media_title", label: "Show media title", type: "boolean" },
  { section: "Advanced", key: "enable_animations", label: "Enable animations", type: "boolean" },
  { section: "Advanced", key: "respect_reduced_motion", label: "Respect reduced motion", type: "boolean" },
  { section: "Debug", key: "debug", label: "Debug logging", type: "boolean" },
  { section: "Debug", key: "show_debug", label: "Show skipped/protected diagnostics", type: "boolean" },
  { section: "Debug", key: "show_entity_ids", label: "Show entity IDs", type: "boolean" },
  { section: "Debug", key: "show_area_ids", label: "Show area IDs", type: "boolean" }
], ca = {
  id: "מזהה קבוע לכרטיס",
  title: "כותרת הכרטיס",
  show_header: "הצגת כותרת",
  show_total_count: "הצגת מספר הישויות הפעילות",
  show_active_area_count: "הצגת מספר האזורים הפעילים",
  show_empty: "הצגת מצב ריק",
  empty_title: "כותרת למצב ריק",
  empty_subtitle: "כותרת משנה למצב ריק",
  default_expanded: "פתוח כברירת מחדל",
  remember_expanded_state: "זכירת מצב הפתיחה",
  expand_on_header_tap: "פתיחה בלחיצה על כותרת האזור",
  collapse_empty_areas: "כיווץ אזורים ריקים",
  show_area_icons: "הצגת סמלי אזורים",
  show_entity_icons: "הצגת סמלי ישויות",
  show_entity_secondary_info: "הצגת מידע משני",
  show_domain_chips: "הצגת תגיות תחום",
  domain_chip_mode: "תצוגת תגיות תחום",
  show_preview_entities: "הצגת ישויות בתצוגה מקדימה",
  preview_entity_count: "מספר ישויות בתצוגה מקדימה",
  max_entities_per_area: "מספר מרבי של ישויות באזור (0 = ללא הגבלה)",
  include_areas: "אזורים להצגה (מזהה או שם)",
  exclude_areas: "אזורים להסתרה (מזהה או שם)",
  custom_area_order: "סדר אזורים מותאם",
  areas: "דריסות אזור — JSON",
  domains: "תחומים להצגה",
  exclude_domains: "תחומים להסתרה",
  include_entities: "ישויות להצגה",
  exclude_entities: "ישויות להסתרה",
  exclude_labels: "תוויות להסתרה",
  exclude_entity_category: "קטגוריות ישות להסתרה",
  exclude_by_regex: "הסתרה לפי ביטוי רגולרי",
  exclude_hidden_entities: "הסתרת ישויות מוסתרות",
  exclude_unavailable: "הסתרת ישויות לא זמינות",
  entity_overrides: "דריסות ישות — JSON",
  domain_icons: "סמלי תחומים — JSON",
  paused_media_players_active: "נגן מושהה נחשב פעיל",
  active_states: "מצבים פעילים — JSON",
  inactive_states: "מצבים לא פעילים — JSON",
  show_area_turn_off: "הצגת כיבוי לאזור",
  show_entity_turn_off: "הצגת כיבוי לישות",
  show_global_turn_off: "הצגת כיבוי כללי",
  confirm_area_turn_off: "אישור לפני כיבוי אזור",
  confirm_entity_turn_off: "אישור לפני כיבוי ישות",
  confirm_global_turn_off: "אישור לפני כיבוי כללי",
  area_turn_off_mode: "אופן כיבוי אזור",
  service_mapping: "מיפוי שירותים — JSON",
  tap_action: "פעולת לחיצה — JSON",
  hold_action: "פעולת לחיצה ארוכה — JSON",
  double_tap_action: "פעולת לחיצה כפולה — JSON",
  protected_labels: "תוויות מוגנות",
  protected_entities: "ישויות מוגנות",
  disable_turn_off_for_domains: "תחומים ללא אפשרות כיבוי",
  dangerous_domains: "תחומים מסוכנים",
  protected_entity_behavior: "תצוגת ישות מוגנת",
  safety_mode: "מצב בטיחות",
  area_sort: "מיון אזורים",
  entity_sort: "מיון ישויות",
  custom_entity_order: "סדר ישויות מותאם",
  "style.preset": "ערכת עיצוב",
  "style.glass": "אפקט זכוכית",
  "style.compact": "מצב קומפקטי",
  "style.border_radius": "רדיוס פינות",
  "style.blur": "טשטוש",
  "style.section_gap": "מרווח בין אזורים",
  "style.row_height": "גובה שורה",
  "style.icon_size": "גודל סמל בסיסי",
  "style.area_icon_size": "גודל סמל אזור",
  "style.entity_icon_size": "גודל סמל ישות",
  "style.background_opacity": "אטימות רקע",
  "style.border_opacity": "אטימות מסגרת",
  "style.show_shadows": "הצגת צללים",
  "style.shadow_intensity": "עוצמת צל",
  "style.accent_color": "צבע הדגשה",
  "style.danger_color": "צבע אזהרה",
  "style.header_background": "רקע כותרת",
  "style.expanded_background": "רקע אזור פתוח",
  "style.collapsed_background": "רקע אזור סגור",
  "style.row_background": "רקע שורה",
  "style.chip_background": "רקע תגית",
  "style.text_size": "גודל טקסט ראשי",
  "style.secondary_text_size": "גודל טקסט משני",
  language: "שפה",
  rtl: "כיוון RTL",
  labels: "תוויות מותאמות — JSON",
  domain_labels: "שמות תחומים מותאמים — JSON",
  show_last_changed: "הצגת זמן שינוי אחרון",
  show_brightness: "הצגת בהירות תאורה",
  show_temperature: "הצגת טמפרטורת מיזוג",
  show_media_title: "הצגת שם המדיה",
  enable_animations: "הפעלת הנפשות",
  respect_reduced_motion: "כיבוד העדפת הפחתת תנועה",
  debug: "רישום אבחון למסוף",
  show_debug: "הצגת אבחון ישויות שסוננו",
  show_entity_ids: "הצגת מזהי ישויות",
  show_area_ids: "הצגת מזהי אזורים"
}, la = {
  icons: "סמלים",
  text: "טקסט",
  icons_and_text: "סמלים וטקסט",
  safe_displayed_entities: "ישויות מוצגות ובטוחות",
  domain_grouped_services: "שירותים מקובצים לפי תחום",
  homeassistant_area: "יעד אזור של Home Assistant",
  hide: "הסתרה",
  show_disabled: "הצגה מושבתת",
  show_with_lock_icon: "הצגה עם סמל מנעול",
  strict: "מחמיר",
  normal: "רגיל",
  custom: "מותאם",
  count_desc: "כמות — מהגבוה לנמוך",
  count_asc: "כמות — מהנמוך לגבוה",
  name: "שם",
  original: "סדר מקורי",
  domain: "תחום",
  state: "מצב",
  last_changed: "שינוי אחרון",
  bubble_glass: "Bubble Glass",
  bubble_solid: "Bubble Solid",
  expander_minimal: "Expander Minimal",
  home_assistant_native: "Home Assistant Native",
  dark_glass: "Dark Glass",
  light_glass: "Light Glass",
  compact_mobile: "Compact Mobile",
  auto: "אוטומטי",
  he: "עברית",
  en: "אנגלית",
  true: "מופעל",
  false: "מושבת"
}, N = {
  en: {
    title: "Card settings",
    subtitle: "Changes are reflected in the Home Assistant preview.",
    chooseSection: "Settings section",
    searchAreas: "Search area name or ID",
    searchEntities: "Search entity, area, domain, or label",
    searchLabels: "Search label name or ID",
    areasFromHa: "Areas from Home Assistant",
    entitiesFromHa: "Entities from Home Assistant",
    labelsFromHa: "Labels from Home Assistant",
    include: "Include",
    exclude: "Exclude",
    hide: "Hide",
    noResults: "No matching items",
    areaOrder: "Area display order",
    areaOrderHelp: "Drag the handle or use the arrow buttons. A custom order is saved automatically.",
    customOrder: "Use custom order",
    moveUp: "Move up",
    moveDown: "Move down",
    drag: "Drag to reorder",
    apply: "Apply",
    reset: "Reset",
    jsonValid: "Valid JSON — apply to save.",
    jsonInvalid: "Invalid JSON",
    jsonObject: "A JSON object is required.",
    configKey: "Configuration key",
    labelsFallback: "Live Label registry is unavailable; showing labels already present in Home Assistant data.",
    retry: "Retry",
    badgeHelper: "Badge / Template helper",
    templateSensors: "Template sensors YAML",
    dashboardBadge: "Dashboard badge YAML",
    currentConfig: "Resulting config JSON",
    activeNow: "active entities",
    activeAreas: "active areas right now"
  },
  he: {
    title: "הגדרות הכרטיס",
    subtitle: "השינויים משתקפים בתצוגה המקדימה של Home Assistant.",
    chooseSection: "קטגוריית הגדרות",
    searchAreas: "חיפוש לפי שם אזור או מזהה",
    searchEntities: "חיפוש ישות, אזור, תחום או תווית",
    searchLabels: "חיפוש לפי שם תווית או מזהה",
    areasFromHa: "אזורים מ־Home Assistant",
    entitiesFromHa: "ישויות מ־Home Assistant",
    labelsFromHa: "תוויות מ־Home Assistant",
    include: "הצגה",
    exclude: "החרגה",
    hide: "הסתרה",
    noResults: "לא נמצאו פריטים תואמים",
    areaOrder: "סדר תצוגת האזורים",
    areaOrderHelp: "ניתן לגרור את הידית או להשתמש בחיצים. סדר מותאם נשמר אוטומטית.",
    customOrder: "שימוש בסדר מותאם",
    moveUp: "הזזה למעלה",
    moveDown: "הזזה למטה",
    drag: "גרירה לשינוי סדר",
    apply: "החלה",
    reset: "איפוס",
    jsonValid: "ה־JSON תקין — יש להחיל כדי לשמור.",
    jsonInvalid: "JSON לא תקין",
    jsonObject: "נדרש אובייקט JSON.",
    configKey: "מפתח תצורה",
    labelsFallback: "רישום התוויות החי אינו זמין; מוצגות תוויות שכבר קיימות בנתוני Home Assistant.",
    retry: "ניסיון חוזר",
    badgeHelper: "עזר לתג / Template",
    templateSensors: "YAML לחיישני Template",
    dashboardBadge: "YAML לתג בלוח הבקרה",
    currentConfig: "תצורת JSON המתקבלת",
    activeNow: "ישויות פעילות",
    activeAreas: "אזורים פעילים כעת"
  }
};
let P = class extends W {
  constructor() {
    super(...arguments), this.config = { type: "custom:area-bubble-expander-card" }, this.activeSection = "General", this.areaSearch = "", this.entitySearch = "", this.labelSearch = "", this.registryLabels = [], this.labelRegistryStatus = "idle", this.jsonDrafts = {}, this.jsonErrors = {}, this.jsonDraftBaselines = {};
  }
  setConfig(e) {
    const t = this.cloneConfig(e);
    for (const i of Object.keys(this.jsonDrafts)) {
      const a = this.jsonCommittedText(i, t);
      this.jsonDraftBaselines[i] !== a && this.clearJsonDraft(i);
    }
    this.config = t;
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass") || this.activeSection === "Badge") return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : this.activeSection === "Areas" || this.activeSection === "Entities" ? Object.keys(t.states ?? {}).length !== Object.keys(this.hass.states ?? {}).length : !1;
  }
  updated(e) {
    e.has("hass") && this.labelRegistryStatus === "idle" && this.loadLabelRegistry();
  }
  render() {
    const e = ce(this.config), t = ue(this.hass, e.language), i = Dt(this.hass, e), a = j.find((r) => r.id === this.activeSection) ?? j[0], o = sa.filter((r) => r.section === this.activeSection);
    return p`
      <div class="editor" dir=${i ? "rtl" : "ltr"} lang=${t}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${N[t].title}</div>
            <div class="editor-subtitle">${N[t].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${N[t].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${j.map((r) => p`<option value=${r.id}>${r.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${N[t].chooseSection} aria-orientation="vertical">
            ${j.map(
      (r, n) => p`
                <button
                  type="button"
                  id=${`abec-editor-tab-${n}`}
                  class="section-tab"
                  role="tab"
                  aria-selected=${this.activeSection === r.id ? "true" : "false"}
                  aria-controls="abec-editor-panel"
                  tabindex=${this.activeSection === r.id ? "0" : "-1"}
                  @click=${() => this.selectSection(r.id)}
                  @keydown=${(s) => this.navigateSections(s, n)}
                >
                  <ha-icon icon=${r.icon}></ha-icon>
                  <span>${r.title[t]}</span>
                  <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
    )}
          </nav>

          <section
            id="abec-editor-panel"
            class="section-panel"
            role="tabpanel"
            aria-labelledby=${`abec-editor-tab-${Math.max(0, j.findIndex((r) => r.id === a.id))}`}
          >
            <div class="section-heading">
              <ha-icon icon=${a.icon}></ha-icon>
              <div>
                <div class="section-title">${a.title[t]}</div>
                <div class="section-description">${a.description[t]}</div>
              </div>
            </div>

          ${this.activeSection === "Areas" ? this.renderAreaPicker(e) : b}
          ${this.activeSection === "Areas" ? this.renderAreaOrder(e) : b}
          ${this.activeSection === "Entities" ? this.renderEntityPicker(e) : b}
          ${this.activeSection === "Entities" ? this.renderLabelPicker(e) : b}
          ${this.activeSection === "Badge" ? this.renderBadgeTemplates(e) : b}
            ${o.map((r) => this.renderField(r, e))}
          ${this.activeSection === "Debug" ? p`<div class="field"><label class="field-label" for="abec-resulting-config">${N[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : b}
          </section>
        </div>
      </div>
    `;
  }
  async loadLabelRegistry() {
    var i, a;
    const e = (a = (i = this.hass) == null ? void 0 : i.callWS) == null ? void 0 : a.bind(this.hass);
    if (this.labelRegistryStatus !== "idle" || !e) return;
    this.labelRegistryStatus = "loading";
    const t = this.hass;
    this.labelRegistryHass = t;
    try {
      const o = await e({
        type: "config/label_registry/list"
      });
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = Array.isArray(o) ? o : [], this.labelRegistryStatus = "loaded";
    } catch {
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = [], this.labelRegistryStatus = "failed";
    }
  }
  retryLabelRegistry() {
    this.labelRegistryHass = void 0, this.labelRegistryStatus = "idle", this.loadLabelRegistry();
  }
  renderAreaPicker(e) {
    const t = this.editorLanguage(e), i = N[t], a = this.areaOptions(e), o = a.filter((r) => this.matchesSearch(`${r.name} ${r.id}`, this.areaSearch));
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.areasFromHa}</strong>
            <span>${o.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-area-search">${i.searchAreas}</label>
          <input
            id="abec-area-search"
            class="search"
            type="search"
            placeholder=${i.searchAreas}
            .value=${this.areaSearch}
            @input=${(r) => this.updateSearch(r, "area")}
          />
        </div>
        <div class="picker-list">
          ${o.length ? o.map(
      (r) => p`
              <div class="picker-item">
                <ha-icon icon=${r.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${r.name}</div>
                  <div class="picker-meta">${r.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_areas.includes(r.id) || e.include_areas.includes(r.name) ? "active" : ""}"
                    aria-pressed=${e.include_areas.includes(r.id) || e.include_areas.includes(r.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_areas", r.id, "exclude_areas", [r.id, r.name])}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_areas.includes(r.id) || e.exclude_areas.includes(r.name) ? "active" : ""}"
                    aria-pressed=${e.exclude_areas.includes(r.id) || e.exclude_areas.includes(r.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_areas", r.id, "include_areas", [r.id, r.name])}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : p`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderEntityPicker(e) {
    const t = this.editorLanguage(e), i = N[t], a = this.entityOptions(e), o = a.filter(
      (r) => this.matchesSearch(`${r.name} ${r.entityId} ${r.domain} ${r.areaName} ${r.labels}`, this.entitySearch)
    );
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.entitiesFromHa}</strong>
            <span>${o.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-entity-search">${i.searchEntities}</label>
          <input
            id="abec-entity-search"
            class="search"
            type="search"
            placeholder=${i.searchEntities}
            .value=${this.entitySearch}
            @input=${(r) => this.updateSearch(r, "entity")}
          />
        </div>
        <div class="picker-list entities-picker">
          ${o.length ? o.map(
      (r) => p`
              <div class="picker-item">
                <ha-icon icon=${r.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${r.name}</div>
                  <div class="picker-meta">
                    ${r.entityId} · ${r.areaName} · ${r.domain}${r.labels ? ` · labels: ${r.labels}` : ""}
                  </div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_entities.includes(r.entityId) ? "active" : ""}"
                    aria-pressed=${e.include_entities.includes(r.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_entities", r.entityId, "exclude_entities")}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_entities.includes(r.entityId) ? "active" : ""}"
                    aria-pressed=${e.exclude_entities.includes(r.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_entities", r.entityId, "include_entities")}
                  >${i.hide}</button>
                </div>
              </div>
            `
    ) : p`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderLabelPicker(e) {
    const t = this.editorLanguage(e), i = N[t], a = this.labelOptions(), o = a.filter((r) => this.matchesSearch(`${r.id} ${r.name}`, this.labelSearch));
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.labelsFromHa}</strong>
            <span>${o.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-label-search">${i.searchLabels}</label>
          <input
            id="abec-label-search"
            class="search"
            type="search"
            placeholder=${i.searchLabels}
            .value=${this.labelSearch}
            @input=${(r) => this.updateSearch(r, "label")}
          />
        </div>
        ${this.labelRegistryStatus === "failed" ? p`
              <div class="status-banner" role="status">
                <span class="status-text">${i.labelsFallback}</span>
                <button type="button" class="action-button" @click=${this.retryLabelRegistry}>${i.retry}</button>
              </div>
            ` : b}
        <div class="picker-list compact-picker">
          ${o.length ? o.map(
      (r) => p`
              <div class="picker-item">
                <ha-icon icon=${r.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${r.name}</div>
                  <div class="picker-meta">${r.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill danger ${e.exclude_labels.includes(r.id) ? "active" : ""}"
                    aria-pressed=${e.exclude_labels.includes(r.id) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_labels", r.id)}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : p`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderAreaOrder(e) {
    const t = this.editorLanguage(e), i = N[t], a = this.orderedAreaOptions(e);
    return p`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${i.areaOrder}</strong>
            <span>${i.areaOrderHelp}</span>
          </div>
          <button
            type="button"
            class="pill ${e.area_sort === "custom" ? "active" : ""}"
            aria-pressed=${e.area_sort === "custom" ? "true" : "false"}
            @click=${() => this.enableCustomAreaOrder(a)}
          >
            ${i.customOrder}
          </button>
        </div>
        <div class="picker-list compact-picker">
          ${a.map(
      (o, r) => p`
              <div
                class="picker-item order-item ${this.draggedAreaId === o.id ? "dragging" : ""} ${this.dragOverAreaId === o.id ? "drag-over" : ""}"
                @dragover=${(n) => this.dragAreaOver(n, o.id)}
                @drop=${(n) => this.dropArea(n, o.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${i.drag}
                  aria-hidden="true"
                  @dragstart=${(n) => this.startAreaDrag(n, o.id)}
                  @dragend=${this.endAreaDrag}
                ><ha-icon icon="mdi:drag-vertical"></ha-icon></span>
                <ha-icon icon=${o.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${o.name}</div>
                  <div class="picker-meta">${o.id}</div>
                </div>
                <div class="order-actions">
                  <button type="button" class="icon-action" title=${i.moveUp} aria-label=${`${i.moveUp}: ${o.name}`} ?disabled=${r === 0} @click=${() => this.moveArea(o.id, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button type="button" class="icon-action" title=${i.moveDown} aria-label=${`${i.moveDown}: ${o.name}`} ?disabled=${r === a.length - 1} @click=${() => this.moveArea(o.id, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </button>
                </div>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  renderBadgeTemplates(e) {
    const t = this.editorLanguage(e), i = N[t], { groups: a } = Ye(this.hass, e), o = a.reduce((n, s) => n + s.entities.length, 0), r = a.length;
    return p`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${i.badgeHelper}</strong>
            <span>${o} ${i.activeNow} · ${r} ${i.activeAreas}</span>
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="abec-template-sensors">${i.templateSensors}</label>
          <textarea id="abec-template-sensors" class="yaml template-output" readonly .value=${this.templateSensorYaml(e)}></textarea>
        </div>
        <div class="field">
          <label class="field-label" for="abec-badge-yaml">${i.dashboardBadge}</label>
          <textarea id="abec-badge-yaml" class="yaml template-output small" readonly .value=${this.badgeYaml()}></textarea>
        </div>
      </div>
    `;
  }
  areaOptions(e) {
    var a, o;
    const t = Object.entries(((a = this.hass) == null ? void 0 : a.areas) ?? {}).map(([r, n]) => ({
      id: n.area_id ?? n.id ?? r,
      name: n.name,
      icon: n.icon ?? "mdi:floor-plan"
    })), i = /* @__PURE__ */ new Map();
    for (const r of Object.keys(((o = this.hass) == null ? void 0 : o.states) ?? {})) {
      const n = We(this.hass, e, r);
      i.set(n.id, { id: n.id, name: n.name, icon: n.icon });
    }
    return [...t, ...i.values()].filter((r, n, s) => s.findIndex((c) => c.id === r.id) === n).sort((r, n) => r.name.localeCompare(n.name));
  }
  orderedAreaOptions(e) {
    const t = this.areaOptions(e), i = e.custom_area_order;
    return t.sort((a, o) => {
      const r = this.orderIndex(i, a.id, a.name), n = this.orderIndex(i, o.id, o.name);
      return r - n || a.name.localeCompare(o.name);
    });
  }
  entityOptions(e) {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).map((i) => {
      const a = i.entity_id.split(".")[0] ?? "", o = We(this.hass, e, i.entity_id);
      return {
        entityId: i.entity_id,
        domain: a,
        areaName: o.name,
        name: String(i.attributes.friendly_name ?? i.entity_id),
        icon: String(i.attributes.icon ?? e.domain_icons[a] ?? "mdi:toggle-switch-outline"),
        labels: this.labelsForEntity(i.entity_id).join(" ")
      };
    }).sort((i, a) => i.areaName.localeCompare(a.areaName) || i.name.localeCompare(a.name));
  }
  labelOptions() {
    var t, i;
    const e = /* @__PURE__ */ new Map();
    for (const a of this.registryLabels) {
      const o = a.label_id ?? a.id;
      o && e.set(o, {
        id: o,
        name: a.name ?? o,
        icon: a.icon ?? "mdi:label-outline"
      });
    }
    for (const [a, o] of Object.entries(((t = this.hass) == null ? void 0 : t.labels) ?? {})) {
      const r = o.label_id ?? a;
      e.has(r) || e.set(r, {
        id: r,
        name: o.name ?? r,
        icon: o.icon ?? "mdi:label-outline"
      });
    }
    for (const a of Object.keys(((i = this.hass) == null ? void 0 : i.states) ?? {}))
      for (const o of this.labelsForEntity(a))
        e.has(o) || e.set(o, { id: o, name: o, icon: "mdi:label-outline" });
    return [...e.values()].sort((a, o) => a.name.localeCompare(o.name));
  }
  templateSensorYaml(e) {
    const t = JSON.stringify(e.domains), i = JSON.stringify(e.exclude_domains), a = JSON.stringify(e.exclude_entities), o = JSON.stringify(e.exclude_areas), r = JSON.stringify(e.exclude_labels), n = JSON.stringify(e.active_states), s = JSON.stringify(e.inactive_states);
    return `template:
  - sensor:
      - name: Area Bubble Active Entities
        unique_id: area_bubble_active_entities
        icon: mdi:power-plug
        state: >
          {% set domains = ${t} %}
          {% set exclude_domains = ${i} %}
          {% set exclude_entities = ${a} %}
          {% set exclude_areas = ${o} %}
          {% set exclude_labels = ${r} %}
          {% set active_states = ${n} %}
          {% set inactive_states = ${s} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(count=0) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active %}
              {% set ns.count = ns.count + 1 %}
            {% endif %}
          {% endfor %}
          {{ ns.count }}
      - name: Area Bubble Active Areas
        unique_id: area_bubble_active_areas
        icon: mdi:floor-plan
        state: >
          {% set domains = ${t} %}
          {% set exclude_domains = ${i} %}
          {% set exclude_entities = ${a} %}
          {% set exclude_areas = ${o} %}
          {% set exclude_labels = ${r} %}
          {% set active_states = ${n} %}
          {% set inactive_states = ${s} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(areas=[]) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active and area not in ns.areas %}
              {% set ns.areas = ns.areas + [area] %}
            {% endif %}
          {% endfor %}
          {{ ns.areas | count }}`;
  }
  badgeYaml() {
    return `type: entity
entity: sensor.area_bubble_active_entities
name: דלוקים
show_name: true
show_state: true
tap_action:
  action: navigate
  navigation_path: /lovelace/0`;
  }
  labelsForEntity(e) {
    var a, o, r, n;
    const t = (o = (a = this.hass) == null ? void 0 : a.entities) == null ? void 0 : o[e], i = t != null && t.device_id ? (n = (r = this.hass) == null ? void 0 : r.devices) == null ? void 0 : n[t.device_id] : void 0;
    return [.../* @__PURE__ */ new Set([...(t == null ? void 0 : t.labels) ?? [], ...(i == null ? void 0 : i.labels) ?? []])];
  }
  editorLanguage(e = ce(this.config)) {
    return ue(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? ca[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? la[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    j.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % j.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + j.length) % j.length), e.key === "Home" && (i = 0), e.key === "End" && (i = j.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(j[i].id), this.updateComplete.then(() => {
      var a;
      return (a = this.renderRoot.querySelector(`#abec-editor-tab-${i}`)) == null ? void 0 : a.focus();
    }));
  }
  matchesSearch(e, t) {
    const i = t.trim().toLowerCase();
    return !i || e.toLowerCase().includes(i);
  }
  updateSearch(e, t) {
    e.stopPropagation();
    const i = e.target.value;
    t === "area" && (this.areaSearch = i), t === "entity" && (this.entitySearch = i), t === "label" && (this.labelSearch = i);
  }
  moveArea(e, t) {
    const i = ce(this.config), a = this.orderedAreaOptions(i).map((s) => s.id), o = a.indexOf(e), r = o + t;
    if (o < 0 || r < 0 || r >= a.length) return;
    const n = [...a];
    [n[o], n[r]] = [n[r], n[o]], this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  enableCustomAreaOrder(e) {
    const t = Ce(this.readPath("custom_area_order"));
    this.updateKeys({
      area_sort: "custom",
      custom_area_order: t.length ? t : e.map((i) => i.id)
    });
  }
  startAreaDrag(e, t) {
    this.draggedAreaId = t, this.dragOverAreaId = void 0, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", t));
  }
  dragAreaOver(e, t) {
    !this.draggedAreaId || this.draggedAreaId === t || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), this.dragOverAreaId !== t && (this.dragOverAreaId = t));
  }
  dropArea(e, t) {
    var c;
    e.preventDefault();
    const i = this.draggedAreaId ?? ((c = e.dataTransfer) == null ? void 0 : c.getData("text/plain"));
    if (this.endAreaDrag(), !i || i === t) return;
    const a = this.orderedAreaOptions(ce(this.config)).map((u) => u.id), o = a.indexOf(i), r = a.indexOf(t);
    if (o < 0 || r < 0) return;
    const n = [...a];
    n.splice(o, 1);
    const s = n.indexOf(t) + (o < r ? 1 : 0);
    n.splice(s, 0, i), this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  endAreaDrag() {
    this.draggedAreaId = void 0, this.dragOverAreaId = void 0;
  }
  orderIndex(e, t, i) {
    const a = e.indexOf(t);
    if (a >= 0) return a;
    if (i) {
      const o = e.indexOf(i);
      if (o >= 0) return o;
    }
    return Number.MAX_SAFE_INTEGER;
  }
  toggleListValue(e, t, i, a = [t]) {
    const o = Ce(this.readPath(e)), r = a.some((c) => o.includes(c)), n = r ? o.filter((c) => !a.includes(c)) : [...o.filter((c) => !a.includes(c)), t], s = { [e]: n };
    !r && i && (s[i] = Ce(this.readPath(i)).filter((c) => !a.includes(c))), this.updateKeys(s);
  }
  renderField(e, t) {
    var s;
    const i = this.editorLanguage(t), a = N[i], o = this.readPath(e.key), r = this.fieldId(e.key), n = this.fieldLabel(e, i);
    if (e.type === "boolean")
      return p`
        <div class="row">
          <div class="row-text">
            <label class="row-label" for=${r}>${n}</label>
            <span class="field-helper"><code>${e.key}</code></span>
          </div>
          <input
            id=${r}
            class="native-switch"
            type="checkbox"
            role="switch"
            .checked=${!!(o ?? this.readResolvedPath(t, e.key))}
            @change=${(c) => this.updateField(e, c.target.checked)}
          />
        </div>
      `;
    if (e.type === "select") {
      const c = this.stringifySelectValue(o ?? this.readResolvedPath(t, e.key));
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <select id=${r} .value=${c} @change=${(u) => this.updateField(e, this.parseSelectValue(e.key, u.target.value))}>
            ${(s = e.options) == null ? void 0 : s.map((u) => p`<option value=${u.value}>${this.optionLabel(u.value, u.label, i)}</option>`)}
          </select>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    }
    if (e.type === "number")
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <input
            id=${r}
            type="number"
            min=${e.min ?? ""}
            max=${e.max ?? ""}
            step=${e.step ?? 1}
            .value=${String(o ?? this.readResolvedPath(t, e.key) ?? "")}
            @change=${(c) => this.updateNumberField(e, c.target)}
          />
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "multi-text")
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <textarea id=${r} .value=${ji(o ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, Ce(c.target.value))}></textarea>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), u = this.jsonDrafts[e.key] ?? c, m = this.jsonErrors[e.key] ?? this.validateJson(u), h = u !== c;
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <textarea
            id=${r}
            class="yaml"
            spellcheck="false"
            aria-invalid=${m ? "true" : "false"}
            aria-describedby=${`${r}-status`}
            .value=${u}
            @input=${(d) => this.updateJsonDraft(e, d.target.value)}
            @keydown=${(d) => this.handleJsonKeydown(d, e)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${r}-status`} class="json-status ${m ? "error" : ""}" role="status" aria-live="polite">
              ${m ?? (h ? a.jsonValid : `${a.configKey}: ${e.key}`)}
            </span>
            <div class="json-actions">
              <button type="button" class="action-button" ?disabled=${!h} @click=${() => this.resetJsonDraft(e.key)}>${a.reset}</button>
              <button type="button" class="action-button primary" ?disabled=${!h || !!m} @click=${() => this.applyJsonDraft(e)}>${a.apply}</button>
            </div>
          </div>
        </div>
      `;
    }
    return p`
      <div class="field">
        <label class="field-label" for=${r}>${n}</label>
        <input
          id=${r}
          type="text"
          autocomplete="off"
          .value=${String(o ?? this.readResolvedPath(t, e.key) ?? "")}
          @change=${(c) => this.updateField(e, c.target.value)}
        />
        <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
      </div>
    `;
  }
  updateNumberField(e, t) {
    if (!t.value.trim()) {
      this.updateField(e, void 0);
      return;
    }
    const i = Number(t.value);
    if (!Number.isFinite(i)) return;
    const a = e.min ?? -1 / 0, o = e.max ?? 1 / 0;
    this.updateField(e, Math.min(o, Math.max(a, i)));
  }
  updateJsonDraft(e, t) {
    e.key in this.jsonDraftBaselines || (this.jsonDraftBaselines[e.key] = this.jsonCommittedText(e.key));
    const i = this.validateJson(t);
    this.jsonDrafts = { ...this.jsonDrafts, [e.key]: t };
    const a = { ...this.jsonErrors };
    i ? a[e.key] = i : delete a[e.key], this.jsonErrors = a;
  }
  validateJson(e) {
    if (!e.trim()) return;
    const t = this.editorLanguage();
    try {
      const i = JSON.parse(e);
      return !i || typeof i != "object" || Array.isArray(i) ? N[t].jsonObject : void 0;
    } catch (i) {
      const a = i instanceof Error ? i.message : String(i);
      return `${N[t].jsonInvalid}: ${a}`;
    }
  }
  applyJsonDraft(e) {
    const t = this.jsonDrafts[e.key];
    if (t === void 0) return;
    const i = this.validateJson(t);
    if (i) {
      this.jsonErrors = { ...this.jsonErrors, [e.key]: i };
      return;
    }
    const a = t.trim() ? JSON.parse(t) : void 0;
    this.clearJsonDraft(e.key), this.updateField(e, a);
  }
  handleJsonKeydown(e, t) {
    (e.ctrlKey || e.metaKey) && e.key === "Enter" && (e.preventDefault(), this.applyJsonDraft(t)), e.key === "Escape" && (e.preventDefault(), this.resetJsonDraft(t.key));
  }
  resetJsonDraft(e) {
    this.clearJsonDraft(e);
  }
  clearJsonDraft(e) {
    if (!(e in this.jsonDrafts) && !(e in this.jsonErrors) && !(e in this.jsonDraftBaselines)) return;
    const t = { ...this.jsonDrafts }, i = { ...this.jsonErrors };
    delete t[e], delete i[e], delete this.jsonDraftBaselines[e], this.jsonDrafts = t, this.jsonErrors = i;
  }
  jsonCommittedText(e, t = this.config) {
    const i = ce(t), o = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
    return this.textareaValue(o);
  }
  updateField(e, t) {
    this.updateKey(e.key, t);
  }
  updateKey(e, t) {
    this.updateKeys({ [e]: t });
  }
  updateKeys(e) {
    const t = this.cloneConfig(this.config);
    for (const [i, a] of Object.entries(e)) this.writePath(t, i, a);
    this.config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: this.config }
      })
    );
  }
  cloneConfig(e) {
    return typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
  }
  readPath(e) {
    return this.readResolvedPath(this.config, e);
  }
  readResolvedPath(e, t) {
    return t.split(".").reduce((i, a) => {
      if (i && typeof i == "object") return i[a];
    }, e);
  }
  writePath(e, t, i) {
    const a = t.split(".");
    let o = e;
    for (const n of a.slice(0, -1)) {
      const s = o[n];
      if (s && typeof s == "object" && !Array.isArray(s)) {
        o = s;
        continue;
      }
      if (i === void 0 || i === "") return;
      o[n] = {}, o = o[n];
    }
    const r = a[a.length - 1];
    i === void 0 || i === "" ? delete o[r] : o[r] = i;
  }
  textareaValue(e) {
    return typeof e == "string" ? e : JSON.stringify(e ?? {}, null, 2) ?? "{}";
  }
  stringifySelectValue(e) {
    return String(typeof e == "boolean" ? e : e ?? "");
  }
  parseSelectValue(e, t) {
    return e === "rtl" ? t === "true" ? !0 : t === "false" ? !1 : "auto" : t;
  }
};
P.styles = Di;
R([
  Ae({ attribute: !1 })
], P.prototype, "hass", 2);
R([
  w()
], P.prototype, "config", 2);
R([
  w()
], P.prototype, "activeSection", 2);
R([
  w()
], P.prototype, "areaSearch", 2);
R([
  w()
], P.prototype, "entitySearch", 2);
R([
  w()
], P.prototype, "labelSearch", 2);
R([
  w()
], P.prototype, "registryLabels", 2);
R([
  w()
], P.prototype, "labelRegistryStatus", 2);
R([
  w()
], P.prototype, "jsonDrafts", 2);
R([
  w()
], P.prototype, "jsonErrors", 2);
R([
  w()
], P.prototype, "draggedAreaId", 2);
R([
  w()
], P.prototype, "dragOverAreaId", 2);
P = R([
  je(qt)
], P);
const da = ke`
  :host {
    display: block;
    direction: var(--abec-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --abec-radius: var(--area-bubble-expander-card-border-radius, 26px);
    --abec-bg: var(--area-bubble-expander-card-background, rgba(255, 255, 255, 0.06));
    --abec-bg-expanded: var(--area-bubble-expander-card-background-expanded, rgba(255, 255, 255, 0.07));
    --abec-blur: var(--area-bubble-expander-card-glass-blur, 18px);
    --abec-accent: var(--area-bubble-expander-card-accent-color, var(--primary-color));
    --abec-danger: var(--area-bubble-expander-card-danger-color, #ff5252);
    --abec-icon-bg: var(--area-bubble-expander-card-icon-background, rgba(var(--rgb-primary-color, 3, 169, 244), 0.16));
    --abec-gap: var(--area-bubble-expander-card-section-gap, 12px);
    --abec-row-height: var(--area-bubble-expander-card-row-height, 52px);
    --abec-shadow: var(--area-bubble-expander-card-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
    --abec-header-size: var(--area-bubble-expander-card-header-font-size, 15px);
    --abec-secondary-size: var(--area-bubble-expander-card-secondary-font-size, 12px);
    --abec-chip-bg: var(--area-bubble-expander-card-chip-background, rgba(255, 255, 255, 0.11));
    --abec-row-bg: var(--area-bubble-expander-card-row-background, rgba(255, 255, 255, 0.08));
    --abec-header-bg: var(--area-bubble-expander-card-header-background, transparent);
    --abec-border: var(--area-bubble-expander-card-border-color, rgba(255, 255, 255, 0.12));
  }

  ha-card {
    overflow: hidden;
    border-radius: var(--abec-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035)),
      var(--abec-bg);
    border: 1px solid var(--abec-border);
    box-shadow: var(--abec-shadow);
    backdrop-filter: blur(var(--abec-blur));
    -webkit-backdrop-filter: blur(var(--abec-blur));
  }

  .root {
    padding: 14px;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 4px 12px;
    border-radius: calc(var(--abec-radius) - 8px);
    background: var(--abec-header-bg);
  }

  .title {
    min-width: 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .subtitle,
  .secondary,
  .preview,
  .debug {
    color: var(--secondary-text-color);
    font-size: var(--abec-secondary-size);
    line-height: 1.35;
  }

  .sections {
    display: grid;
    gap: var(--abec-gap);
  }

  .area-section {
    overflow: hidden;
    border-radius: var(--abec-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025)),
      var(--abec-bg);
    border: 1px solid var(--abec-border);
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .area-section.expanded {
    background: var(--abec-bg-expanded);
    border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.24);
  }

  .area-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 66px;
    padding: 10px;
  }

  :host([dir="rtl"]) .area-header {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .area-toggle,
  .entity-lead {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    text-align: start;
    cursor: pointer;
    font: inherit;
  }

  .area-toggle[disabled] {
    cursor: default;
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.22), transparent 45%),
      var(--abec-icon-bg);
    color: var(--abec-accent);
  }

  .area-icon ha-icon {
    --mdc-icon-size: var(--area-bubble-expander-card-area-icon-size, 26px);
  }

  .entity-icon ha-icon {
    --mdc-icon-size: var(--area-bubble-expander-card-entity-icon-size, 22px);
  }

  .icon-button ha-icon {
    --mdc-icon-size: var(--area-bubble-expander-card-icon-size, 22px);
  }

  .area-main,
  .entity-main {
    min-width: 0;
  }

  .area-line,
  .entity-line {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .area-name,
  .entity-name {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--abec-header-size);
    font-weight: 650;
  }

  .count {
    flex: 0 0 auto;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 150px;
    min-height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--abec-chip-bg);
    color: var(--secondary-text-color);
    font-size: 11px;
    line-height: 1;
  }

  .chip ha-icon {
    --mdc-icon-size: 14px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon-button {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--primary-text-color);
    cursor: pointer;
    transition:
      background-color 140ms ease,
      color 140ms ease,
      transform 140ms ease;
  }

  .icon-button:hover,
  .area-toggle:hover:not([disabled]),
  .entity-row:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .icon-button:active,
  .area-toggle:active:not([disabled]),
  .entity-lead:active {
    transform: scale(0.985);
  }

  .area-toggle:focus-visible,
  .entity-lead:focus-visible,
  .icon-button:focus-visible {
    outline: 2px solid var(--abec-accent);
    outline-offset: 2px;
  }

  .icon-button.danger {
    color: var(--abec-danger);
  }

  .icon-button[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .chevron {
    transition: transform 160ms ease;
  }

  .expanded .chevron {
    transform: rotate(180deg);
  }

  .entities {
    display: grid;
    gap: 8px;
    padding: 0 10px 10px;
    animation: abec-expand 160ms ease both;
  }

  .entity-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: var(--abec-row-height);
    padding: 7px 8px;
    border: 0;
    border-radius: calc(var(--abec-radius) - 10px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035)),
      var(--abec-row-bg);
    color: inherit;
    text-align: start;
    font: inherit;
  }

  .entity-lead {
    width: 100%;
  }

  .protected-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--warning-color, #f6a623);
    font-size: 11px;
  }

  .protected-badge ha-icon {
    --mdc-icon-size: 14px;
  }

  .empty {
    display: grid;
    place-items: center;
    gap: 8px;
    min-height: 128px;
    padding: 22px;
    text-align: center;
  }

  .empty ha-icon {
    color: var(--abec-accent);
    --mdc-icon-size: 44px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 700;
  }

  .debug {
    margin-top: 12px;
    padding: 10px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.16);
    direction: ltr;
    text-align: left;
    white-space: pre-wrap;
  }

  @keyframes abec-expand {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :host([animations-disabled]) .entities {
    animation: none;
  }

  :host([animations-disabled]) .chevron,
  :host([animations-disabled]) .area-section,
  :host([animations-disabled]) .icon-button {
    transition: none;
  }

  :host([compact]) .root {
    padding: 10px;
  }

  :host([compact]) .area-header {
    min-height: 54px;
    padding: 7px;
  }

  :host([compact]) .icon-bubble {
    width: 36px;
    height: 36px;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([respect-reduced-motion]) .entities,
    :host([respect-reduced-motion]) .chevron {
      animation: none;
      transition: none;
    }
  }

  @media (max-width: 420px) {
    .root {
      padding: 10px;
    }

    .header {
      gap: 8px;
      padding-bottom: 10px;
    }

    .title {
      font-size: 17px;
      line-height: 1.3;
    }

    .area-header {
      align-items: start;
      gap: 8px;
      padding: 9px;
    }

    .area-line,
    .entity-line {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;
    }

    .area-name,
    .entity-name {
      overflow: visible;
      text-overflow: clip;
      white-space: normal;
      overflow-wrap: anywhere;
      line-height: 1.28;
    }

    .count {
      line-height: 1.25;
    }

    .controls {
      align-self: start;
      flex-shrink: 0;
    }

    .icon-bubble {
      width: 38px;
      height: 38px;
    }

    .icon-button {
      width: 36px;
      height: 36px;
    }

    .entity-row {
      align-items: start;
      min-height: 48px;
    }

    .chip {
      max-width: 112px;
    }
  }
`;
ke`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tab {
    border: 0;
    border-radius: 999px;
    padding: 8px 12px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    transition:
      background-color 140ms ease,
      transform 140ms ease;
  }

  .tab.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
  }

  .tab:active {
    transform: scale(0.98);
  }

  .section {
    display: grid;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  label {
    font-weight: 600;
  }

  input,
  select,
  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    padding: 8px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
  }

  textarea {
    min-height: 88px;
    resize: vertical;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .yaml {
    direction: ltr;
    font-family: var(--code-font-family, monospace);
    font-size: 12px;
  }

  .template-output {
    min-height: 420px;
    white-space: pre;
  }

  .template-output.small {
    min-height: 150px;
  }

  .picker-panel {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--secondary-background-color) 82%, transparent);
    border: 1px solid var(--divider-color);
  }

  .picker-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(180px, 280px);
    align-items: center;
    gap: 10px;
  }

  .picker-heading.single {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .picker-heading strong,
  .picker-heading span {
    display: block;
  }

  .picker-heading span {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 2px;
  }

  .search {
    min-height: 38px;
  }

  .picker-list {
    display: grid;
    gap: 8px;
    max-height: 360px;
    overflow: auto;
    padding-inline-end: 2px;
  }

  .picker-list.entities-picker {
    max-height: 460px;
  }

  .picker-list.compact-picker {
    max-height: 280px;
  }

  .picker-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    min-height: 50px;
    padding: 8px;
    border-radius: 10px;
    background: var(--card-background-color);
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
  }

  .picker-item.order-item {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
  }

  .picker-item ha-icon {
    color: var(--primary-color);
    --mdc-icon-size: 22px;
  }

  .picker-main {
    min-width: 0;
  }

  .picker-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
  }

  .picker-meta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .pill {
    min-height: 32px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    padding: 0 10px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    font-weight: 650;
  }

  .pill[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .pill.active {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    color: var(--primary-color);
  }

  .pill.danger.active {
    border-color: var(--error-color, #ff5252);
    background: color-mix(in srgb, var(--error-color, #ff5252) 18%, transparent);
    color: var(--error-color, #ff5252);
  }

  @media (max-width: 560px) {
    .picker-heading {
      grid-template-columns: 1fr;
    }

    .picker-item {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .pill {
      grid-column: span 1;
      width: 100%;
    }
  }
`;
const jt = (e) => `${Ti}:${e}:expanded`, pa = (e) => {
  try {
    const t = localStorage.getItem(jt(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, ua = (e, t) => {
  try {
    localStorage.setItem(jt(e), JSON.stringify(t));
  } catch {
  }
}, Ht = (e) => {
  const [t, i] = e.split(".");
  return { domain: t, service: i };
}, ha = async (e, t, i) => {
  const a = i.service_mapping[t.domain];
  if (!a) throw new Error(`No turn-off service configured for ${t.domain}`);
  const o = Ht(a);
  await e.callService(o.domain, o.service, void 0, { entity_id: t.entityId });
}, wt = async (e, t, i) => {
  const a = /* @__PURE__ */ new Map();
  for (const o of Ie(t, i)) {
    const r = i.service_mapping[o.domain];
    if (!r) continue;
    const n = a.get(r) ?? [];
    n.push(o.entityId), a.set(r, n);
  }
  await Promise.all(
    [...a.entries()].map(([o, r]) => {
      const n = Ht(o);
      return e.callService(n.domain, n.service, void 0, { entity_id: r });
    })
  );
}, ba = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var ma = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, Ee = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? ga(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ma(t, i, o), o;
};
let re = class extends W {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(qt);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      Li(e), this.config = ce(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? pa(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = Ye(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return p`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return b;
    const e = Dt(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = Ye(this.hass, this.config), a = t.reduce((r, n) => r + n.entities.length, 0), o = t.length;
    return p`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(t, a, o) : b}
          ${t.length ? p`<div class="sections">${t.map((r) => this.renderArea(r))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug ? p`<div class="debug">${JSON.stringify(i.slice(0, 80), null, 2)}</div>` : b}
        </div>
      </ha-card>
    `;
  }
  renderHeader(e, t, i) {
    if (!this.config) return b;
    const a = this.config.title || A(this.config, this.hass, "title"), o = [
      this.config.show_total_count ? `${t} ${A(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${i} ${A(this.config, this.hass, "active_areas")}` : ""
    ].filter(Boolean).join(" · ");
    return p`
      <div class="header">
        <div class="title">
          <div>${a}</div>
          ${o ? p`<div class="subtitle">${o}</div>` : b}
        </div>
        ${this.config.show_global_turn_off ? p`
              <button
                class="icon-button danger"
                title=${A(this.config, this.hass, "turn_off_all")}
                aria-label=${A(this.config, this.hass, "turn_off_all")}
                @click=${(r) => this.turnOffGlobal(r, e)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : b}
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return b;
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), a = Ie(e.entities, this.config), o = this.config.areas[e.id] ?? this.config.areas[e.name], r = (o == null ? void 0 : o.allow_turn_off) !== !1 && a.length > 0, n = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, s = e.entities.length - n.length;
    return p`
      <section class="area-section ${t ? "expanded" : ""}" style=${o != null && o.accent_color ? `--abec-accent:${o.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${`${A(this.config, this.hass, t ? "collapse_area" : "expand_area")}: ${e.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(e)}
          >
            ${this.config.show_area_icons ? p`<span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : b}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${e.name}</span>
                <span class="count">${e.entities.length} ${A(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !t && i ? p`<span class="preview">${i}</span>` : b}
              ${this.config.show_domain_chips ? this.renderDomainChips(e) : b}
              ${this.config.show_area_ids ? p`<span class="preview">${e.id}</span>` : b}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off ? p`
                  <button
                    class="icon-button danger"
                    ?disabled=${!r}
                    title=${A(this.config, this.hass, "turn_off_area")}
                    aria-label=${A(this.config, this.hass, "turn_off_area")}
                    @click=${(c) => this.turnOffArea(c, e)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                ` : b}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${t ? p`
              <div class="entities">
                ${n.map((c) => this.renderEntity(c))}
                ${s > 0 ? p`<div class="secondary">${s} ${A(this.config, this.hass, "show_more")}</div>` : b}
              </div>
            ` : b}
      </section>
    `;
  }
  renderDomainChips(e) {
    return this.config ? p`
      <div class="chips">
        ${Object.entries(e.domainCounts).map(([t, i]) => {
      var o;
      const a = ((o = this.config) == null ? void 0 : o.domain_chip_mode) ?? "icons";
      return p`
            <span class="chip" title=${$t(this.config, this.hass, t)}>
              ${a !== "text" ? p`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : b}
              ${a !== "icons" ? p`<span>${i} ${$t(this.config, this.hass, t)}</span>` : p`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : b;
  }
  renderEntity(e) {
    if (!this.config) return b;
    const t = this.config.show_entity_secondary_info ? Ki(e, this.config) : "";
    return p`
      <div
        class="entity-row"
      >
        <button
          class="entity-lead"
          type="button"
          @click=${() => {
      var i;
      return this.handleAction(e, ((i = this.config) == null ? void 0 : i.tap_action) ?? { action: "more-info" });
    }}
          @contextmenu=${(i) => this.handleHoldAction(i, e)}
          @dblclick=${() => {
      var i;
      return this.handleAction(e, ((i = this.config) == null ? void 0 : i.double_tap_action) ?? { action: "none" });
    }}
        >
          ${this.config.show_entity_icons ? p`<span class="icon-bubble entity-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : b}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${e.name}</span>
              ${e.protected ? p`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${A(this.config, this.hass, "protected")}</span>` : b}
            </span>
            ${t ? p`<span class="secondary">${t}</span>` : b}
          </span>
        </button>
        ${this.config.show_entity_turn_off ? p`
              <button
                class="icon-button danger"
                ?disabled=${!e.controllable}
                title=${e.disabledReason ?? A(this.config, this.hass, "turn_off_entity")}
                aria-label=${A(this.config, this.hass, "turn_off_entity")}
                @click=${(i) => this.turnOffEntity(i, e)}
              >
                <ha-icon icon=${e.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            ` : b}
      </div>
    `;
  }
  renderEmpty() {
    return !this.config || !this.config.show_empty ? b : p`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || A(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || A(this.config, this.hass, "empty_subtitle")}</div>
      </div>
    `;
  }
  isExpanded(e) {
    if (!this.config) return !1;
    const t = this.config.areas[e.id] ?? this.config.areas[e.name];
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? this.config.default_expanded;
  }
  toggleArea(e) {
    var t;
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && ua(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(A(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await ha(this.hass, t, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ie(t.entities, this.config);
    if (!i.length) return;
    const a = this.config.areas[t.id] ?? this.config.areas[t.name], o = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((s) => this.config.dangerous_domains.includes(s.domain)), r = (a == null ? void 0 : a.confirm_turn_off) ?? o, n = `${A(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${A(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(r && !window.confirm(n)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await ba(this.hass, t.id) : await wt(this.hass, i, this.config);
      } catch (s) {
        this.reportError(s);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ie(t.flatMap((o) => o.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((o) => this.config.dangerous_domains.includes(o.domain))) && !window.confirm(A(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await wt(this.hass, i, this.config);
      } catch (o) {
        this.reportError(o);
      }
  }
  handleAction(e, t) {
    if (this.hass && t.action !== "none") {
      if (t.action === "more-info") {
        this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: !0, composed: !0, detail: { entityId: e.entityId } }));
        return;
      }
      if (t.action === "toggle") {
        this.hass.callService("homeassistant", "toggle", void 0, { entity_id: e.entityId });
        return;
      }
      if (t.action === "turn-off") {
        this.turnOffEntity(new Event("click"), e);
        return;
      }
      if (t.action === "navigate" && history.pushState(null, "", t.navigation_path), t.action === "url" && window.open(t.url_path, "_blank", "noopener"), t.action === "call-service") {
        const [i, a] = t.service.split(".");
        this.hass.callService(i, a, t.service_data, t.target ?? { entity_id: e.entityId });
      }
    }
  }
  reportError(e) {
    var i;
    const t = e instanceof Error ? e.message : String(e);
    (i = this.config) != null && i.debug && console.warn("[area-bubble-expander-card]", e), this.dispatchEvent(new CustomEvent("hass-notification", { bubbles: !0, composed: !0, detail: { message: t } }));
  }
  applyStyleVars() {
    if (!this.config) return;
    const e = this.config.style;
    this.style.setProperty("--area-bubble-expander-card-border-radius", `${e.border_radius}px`), this.style.setProperty("--area-bubble-expander-card-glass-blur", `${e.glass ? e.blur : 0}px`), this.style.setProperty("--area-bubble-expander-card-accent-color", e.accent_color), this.style.setProperty("--area-bubble-expander-card-danger-color", e.danger_color), this.style.setProperty("--area-bubble-expander-card-section-gap", `${e.section_gap}px`), this.style.setProperty("--area-bubble-expander-card-row-height", `${e.row_height}px`), this.style.setProperty("--area-bubble-expander-card-header-font-size", `${e.text_size}px`), this.style.setProperty("--area-bubble-expander-card-secondary-font-size", `${e.secondary_text_size}px`), this.style.setProperty("--area-bubble-expander-card-chip-background", e.chip_background), this.style.setProperty("--area-bubble-expander-card-row-background", e.row_background), this.style.setProperty("--area-bubble-expander-card-header-background", e.header_background), this.style.setProperty("--area-bubble-expander-card-background", e.collapsed_background), this.style.setProperty("--area-bubble-expander-card-background-expanded", e.expanded_background), this.style.setProperty("--area-bubble-expander-card-border-color", `rgba(255,255,255,${e.border_opacity})`), this.style.setProperty("--area-bubble-expander-card-area-icon-size", `${e.area_icon_size}px`), this.style.setProperty("--area-bubble-expander-card-entity-icon-size", `${e.entity_icon_size}px`), this.style.setProperty("--area-bubble-expander-card-icon-size", `${e.icon_size}px`), this.style.setProperty("--area-bubble-expander-card-shadow", e.show_shadows ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none");
  }
  stableCardId(e) {
    const t = JSON.stringify({
      title: e.title ?? "",
      include_areas: e.include_areas ?? [],
      exclude_areas: e.exclude_areas ?? [],
      custom_area_order: e.custom_area_order ?? []
    });
    let i = 2166136261;
    for (let a = 0; a < t.length; a += 1)
      i ^= t.charCodeAt(a), i = Math.imul(i, 16777619);
    return `card-${(i >>> 0).toString(36)}`;
  }
};
re.styles = da;
Ee([
  Ae({ attribute: !1 })
], re.prototype, "hass", 2);
Ee([
  w()
], re.prototype, "config", 2);
Ee([
  w()
], re.prototype, "expanded", 2);
Ee([
  w()
], re.prototype, "error", 2);
re = Ee([
  je(Ci)
], re);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.8.0 ${ue(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const ae = "custom:area-bubble-overview-card", Xe = "area-bubble-overview-card", Ut = "area-bubble-overview-card-editor", kt = "area-bubble-overview-card", ee = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256
}, _e = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16384
}, Bt = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8
}, H = ["climate", "floor_heating", "covers", "lights_switches", "media"], Vt = ["lights", "climate", "floor_heating", "switches", "covers", "media"], Jt = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, Ze = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, qe = {
  on: "mdi:toggle-switch",
  off: "mdi:toggle-switch-off-outline",
  open: "mdi:arrow-up-bold-circle-outline",
  close: "mdi:arrow-down-bold-circle-outline"
}, le = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  area_name_size: 17,
  show_shadows: !0,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "color-mix(in srgb, var(--secondary-background-color) 78%, transparent)",
  card_background: "var(--ha-card-background, var(--card-background-color))",
  card_transparent: !0,
  active_color: "var(--state-active-color, #ffd54f)",
  active_surface: "rgba(174, 215, 219, 0.94)",
  climate_surface: "rgba(139, 181, 255, 0.94)",
  control_surface: "rgba(11, 28, 58, 0.94)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)",
  temperature_off_surface: "rgba(11, 28, 58, 0.94)",
  temperature_cool_surface: "rgba(34, 113, 196, 0.96)",
  temperature_heat_surface: "rgba(198, 83, 47, 0.96)",
  temperature_active_surface: "rgba(91, 86, 168, 0.96)",
  quick_action_size: 38,
  quick_action_icon_size: 20,
  section_action_size: 44,
  section_action_icon_size: 22,
  category_gap: 12
}, St = {
  type: ae,
  target_icon: "",
  language: "auto",
  rtl: "auto",
  show_header: !0,
  show_floor_header: !0,
  show_temperature: !0,
  show_occupancy: !0,
  show_quick_actions: !0,
  show_area_expand_button: !0,
  show_empty_sections: !1,
  default_expanded: !1,
  floor_default_expanded: !0,
  remember_expanded_state: !0,
  section_order: H,
  section_styles: {},
  section_action_mode: "dual",
  section_action_icons: qe,
  quick_actions: Vt,
  quick_action_icons: {},
  area_order: [],
  floor_heating_labels: ["floor_heating", "underfloor_heating"],
  floor_heating_entities: [],
  occupancy_device_classes: ["occupancy", "presence", "motion"],
  include_entities: {},
  exclude_entities: [],
  protected_labels: ["always_on", "critical", "infrastructure", "no_turn_off"],
  protected_entities: [],
  area_overrides: {},
  entity_overrides: {},
  style: le,
  debug: !1
}, M = (e, t) => {
  const i = e.attributes.supported_features;
  return typeof i != "number" || (i & t) !== 0;
}, Gt = (e) => Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], fa = /* @__PURE__ */ new Set(["onoff", "unknown"]), va = (e) => {
  if (e.domain !== "light") return !1;
  const t = Array.isArray(e.entity.attributes.supported_color_modes) ? e.entity.attributes.supported_color_modes.map(String) : [], i = typeof e.entity.attributes.color_mode == "string" ? [e.entity.attributes.color_mode] : [];
  return [...t, ...i].some((a) => !fa.has(a)) || typeof e.entity.attributes.brightness == "number";
}, At = (e) => {
  if (!e.powered) return 0;
  const t = e.entity.attributes.brightness;
  return typeof t != "number" || !Number.isFinite(t) ? 100 : Math.min(100, Math.max(0, Math.round(t / 255 * 100)));
}, Te = (e) => e.powered && e.domain !== "cover", J = (e, t) => {
  if (e.domain === "climate") {
    const i = t ? ee.TURN_ON : ee.TURN_OFF;
    if (M(e.entity, i)) return { service: t ? "turn_on" : "turn_off" };
    const a = Gt(e);
    if (!t && a.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const o = a.find((r) => r !== "off");
    return t && o ? { service: "set_hvac_mode", data: { hvac_mode: o } } : void 0;
  }
  if (e.domain === "media_player") {
    const i = t ? _e.TURN_ON : _e.TURN_OFF;
    return M(e.entity, i) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  }
  if (e.domain === "water_heater")
    return M(e.entity, Bt.ON_OFF) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  if (["light", "switch", "fan", "input_boolean"].includes(e.domain))
    return { service: t ? "turn_on" : "turn_off" };
}, Kt = 2, Qt = 1, Wt = (e, t) => t === "lights" ? e.domain === "light" : t === "switches" ? e.domain === "switch" && e.section === "lights_switches" : t === "climate" ? e.section === "climate" : t === "floor_heating" ? e.section === "floor_heating" : t === "covers" ? e.domain === "cover" : e.domain === "media_player", Me = (e, t) => e.allEntities.filter((i) => Wt(i, t)), ya = (e, t) => t.map((i) => ({ action: i, entities: Me(e, i) })).filter(({ entities: i }) => i.some((a) => a.powered)), et = (e, t, i) => {
  if (Wt(t, e)) {
    if (e === "covers") {
      const a = i ? Qt : Kt;
      return t.domain !== "cover" || !M(t.entity, a) ? void 0 : { service: i ? "open_cover" : "close_cover" };
    }
    return J(t, i);
  }
}, st = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const { entity: i, service: a } of e) {
    const o = `${a.domain}.${a.service}:${JSON.stringify(a.data ?? {})}`, r = t.get(o) ?? { ...a, entityIds: [] };
    r.entityIds.push(i.entityId), t.set(o, r);
  }
  return [...t.values()];
}, ct = async (e, t, i) => {
  const a = await Promise.allSettled(
    t.map((r) => e.callService(r.domain, r.service, r.data, { entity_id: r.entityIds }))
  ), o = a.filter((r) => r.status === "rejected");
  if (o.length) throw new Error(`${o.length} of ${a.length} ${i} failed.`);
}, Yt = (e, t, i) => {
  const a = [];
  for (const o of Me(e, t)) {
    if (!o.available || o.protected || o.powered === i) continue;
    const r = et(t, o, i);
    r && a.push({ entity: o, service: { domain: o.domain, ...r } });
  }
  return a;
}, Je = (e, t, i) => Yt(e, t, i).map(({ entity: a }) => a), _a = async (e, t, i, a) => {
  const o = Yt(t, i, a);
  await ct(e, st(o), "area actions");
}, Xt = (e, t) => {
  const i = [];
  for (const a of e.allEntities) {
    if (a.domain === "cover" || !a.available || a.protected || a.powered === t) continue;
    const o = J(a, t);
    o && i.push({ entity: a, service: { domain: a.domain, ...o } });
  }
  return i;
}, Oe = (e, t = !1) => Xt(e, t).map(({ entity: i }) => i), Et = async (e, t, i) => {
  await ct(e, st(Xt(t, i)), "room actions");
}, xa = (e, t, i) => {
  if (e.id === "covers") {
    const o = i ? Qt : Kt;
    return t.domain !== "cover" || !M(t.entity, o) ? void 0 : { domain: "cover", service: i ? "open_cover" : "close_cover" };
  }
  const a = J(t, i);
  return a ? { domain: t.domain, ...a } : void 0;
}, Zt = (e, t) => {
  const i = [];
  for (const a of e.entities) {
    if (!a.available || a.protected || a.powered === t) continue;
    const o = xa(e, a, t);
    o && i.push({ entity: a, service: o });
  }
  return i;
}, Ge = (e, t = !1) => Zt(e, t).map(({ entity: i }) => i), $a = async (e, t, i) => {
  const a = Zt(t, i);
  await ct(e, st(a), "section actions");
}, U = (e, t, i, a) => {
  const o = t.split(".")[0] ?? "homeassistant";
  return e.callService(o, i, a, { entity_id: t });
}, L = (e) => !!e && typeof e == "object" && !Array.isArray(e), D = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], ei = (e) => {
  const t = new Set(H), i = D(e).filter((a) => t.has(a));
  return [.../* @__PURE__ */ new Set([...i, ...H])];
}, tt = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of H) {
    const a = D(e[i]);
    a.length && (t[i] = a);
  }
  return t;
}, ti = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of H)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, ii = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of H) {
    const a = e[i];
    if (!L(a)) continue;
    const o = typeof a.background == "string" ? a.background.trim() : "", r = typeof a.border_color == "string" ? a.border_color.trim() : "";
    t[i] = {
      ...o ? { background: o } : {},
      ...r ? { border_color: r } : {},
      ...typeof a.show_border == "boolean" ? { show_border: a.show_border } : {}
    };
  }
  return t;
}, wa = (e) => {
  const t = L(e) ? e : {};
  return Object.fromEntries(
    Object.keys(qe).map((i) => {
      const a = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, a || qe[i]];
    })
  );
}, ka = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(D(e).filter((i) => t.has(i)))];
}, Sa = (e) => {
  const t = L(e) ? e : {};
  return Object.fromEntries(
    Object.keys(Ze).map((i) => {
      const a = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, a || Ze[i]];
    })
  );
}, Aa = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const [i, a] of Object.entries(e))
    L(a) && (t[i] = {
      ...typeof a.name == "string" && a.name.trim() ? { name: a.name.trim() } : {},
      ...typeof a.icon == "string" && a.icon.trim() ? { icon: a.icon.trim() } : {},
      ...typeof a.parent_area == "string" && a.parent_area.trim() ? { parent_area: a.parent_area.trim() } : {},
      ...typeof a.show_when_parent_collapsed == "boolean" ? { show_when_parent_collapsed: a.show_when_parent_collapsed } : {},
      ...typeof a.hidden == "boolean" ? { hidden: a.hidden } : {},
      ...typeof a.default_expanded == "boolean" ? { default_expanded: a.default_expanded } : {},
      ...typeof a.temperature_entity == "string" && a.temperature_entity.trim() ? { temperature_entity: a.temperature_entity.trim() } : {},
      ...typeof a.occupancy_count_entity == "string" && a.occupancy_count_entity.trim() ? { occupancy_count_entity: a.occupancy_count_entity.trim() } : {},
      occupancy_entities: D(a.occupancy_entities),
      ...Array.isArray(a.section_order) ? { section_order: ei(a.section_order) } : {},
      section_titles: ti(a.section_titles),
      section_styles: ii(a.section_styles),
      entity_order: tt(a.entity_order),
      include_entities: tt(a.include_entities),
      exclude_entities: D(a.exclude_entities)
    });
  return t;
}, Ea = (e) => {
  if (!L(e)) return {};
  const t = new Set(H), i = {};
  for (const [a, o] of Object.entries(e))
    L(o) && (i[a] = {
      ...typeof o.name == "string" && o.name.trim() ? { name: o.name.trim() } : {},
      ...typeof o.icon == "string" && o.icon.trim() ? { icon: o.icon.trim() } : {},
      ...typeof o.section == "string" && t.has(o.section) ? { section: o.section } : {},
      ...typeof o.group == "string" && o.group.trim() ? { group: o.group.trim() } : {},
      ...typeof o.hidden == "boolean" ? { hidden: o.hidden } : {},
      ...typeof o.protected == "boolean" ? { protected: o.protected } : {}
    });
  return i;
}, fe = (e) => {
  const t = { ...St, ...e }, i = ti(e.section_titles), a = L(e.style) ? e.style : {}, o = a.area_name_size, r = typeof o == "number" && Number.isFinite(o) ? Math.min(24, Math.max(11, o)) : le.area_name_size, n = typeof a.card_background == "string" && a.card_background.trim() ? a.card_background.trim() : le.card_background, s = typeof a.card_transparent == "boolean" ? a.card_transparent : le.card_transparent, c = (u, m, h) => {
    const d = a[u];
    return typeof d == "number" && Number.isFinite(d) ? Math.min(h, Math.max(m, d)) : le[u];
  };
  return {
    ...t,
    type: ae,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    target_icon: typeof e.target_icon == "string" ? e.target_icon.trim() : "",
    show_area_expand_button: typeof e.show_area_expand_button == "boolean" ? e.show_area_expand_button : St.show_area_expand_button,
    section_order: ei(e.section_order),
    section_titles: Object.fromEntries(
      H.map((u) => [u, typeof i[u] == "string" ? i[u] : ""])
    ),
    section_styles: Object.fromEntries(
      H.map((u) => [u, ii(e.section_styles)[u] ?? {}])
    ),
    section_action_mode: e.section_action_mode === "toggle" ? "toggle" : "dual",
    section_action_icons: wa(e.section_action_icons),
    quick_actions: ka(e.quick_actions ?? t.quick_actions),
    quick_action_icons: Sa(e.quick_action_icons),
    area_order: D(e.area_order),
    floor_heating_labels: D(t.floor_heating_labels),
    floor_heating_entities: D(t.floor_heating_entities),
    occupancy_device_classes: D(t.occupancy_device_classes),
    include_entities: tt(e.include_entities),
    exclude_entities: D(t.exclude_entities),
    protected_labels: D(t.protected_labels),
    protected_entities: D(t.protected_entities),
    area_overrides: Aa(e.area_overrides),
    entity_overrides: Ea(e.entity_overrides),
    style: {
      ...le,
      ...a,
      area_name_size: r,
      card_background: n,
      card_transparent: s,
      quick_action_size: c("quick_action_size", 28, 52),
      quick_action_icon_size: c("quick_action_icon_size", 14, 34),
      section_action_size: c("section_action_size", 36, 56),
      section_action_icon_size: c("section_action_icon_size", 16, 36),
      category_gap: c("category_gap", 0, 40)
    }
  };
}, Ca = (e) => {
  if (!L(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== ae) throw new Error(`Card type must be ${ae}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, Ta = {
  he: {
    card_name: "סקירת אזור",
    choose_target: "בחרו אזור או קומה בהגדרות הכרטיס",
    no_areas: "לא נמצאו אזורים להצגה",
    occupied: "מאוכלס",
    vacant: "ריק",
    unknown: "לא ידוע",
    on: "פועל",
    off: "כבוי",
    unavailable: "לא זמין",
    current: "כעת",
    target: "יעד",
    open: "פתוח",
    closed: "סגור",
    playing: "מתנגן",
    turn_off: "כיבוי",
    expand: "פתיחת אזור",
    collapse: "סגירת אזור"
  },
  en: {
    card_name: "Area overview",
    choose_target: "Choose an area or floor in the card settings",
    no_areas: "No areas found to display",
    occupied: "Occupied",
    vacant: "Vacant",
    unknown: "Unknown",
    on: "On",
    off: "Off",
    unavailable: "Unavailable",
    current: "Now",
    target: "Target",
    open: "Open",
    closed: "Closed",
    playing: "Playing",
    turn_off: "Turn off",
    expand: "Expand area",
    collapse: "Collapse area"
  }
}, Oa = {
  he: {
    climate: "מיזוג אוויר",
    floor_heating: "חימום רצפתי",
    covers: "תריסים",
    lights_switches: "מפסקים ותאורה",
    media: "מוזיקה"
  },
  en: {
    climate: "Climate",
    floor_heating: "Floor heating",
    covers: "Covers",
    lights_switches: "Lights and switches",
    media: "Music"
  }
}, Pa = {
  he: {
    lights: "תאורה",
    climate: "מיזוג אוויר",
    floor_heating: "חימום רצפתי",
    switches: "מפסקים",
    covers: "תריסים",
    media: "מוזיקה"
  },
  en: {
    lights: "Lights",
    climate: "Climate",
    floor_heating: "Floor heating",
    switches: "Switches",
    covers: "Covers",
    media: "Music"
  }
}, Y = (e, t) => {
  var a;
  if (t.language === "he" || t.language === "en") return t.language;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Ia = (e, t) => typeof t.rtl == "boolean" ? t.rtl : Y(e, t) === "he" || document.documentElement.dir === "rtl", O = (e, t, i) => Ta[Y(e, t)][i], za = (e, t, i, a) => a || t.section_titles[i] || Oa[Y(e, t)][i], Ct = (e, t, i) => Pa[Y(e, t)][i], he = (e) => e.split(".")[0] ?? "", it = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, Na = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(a.area_id ?? a.id ?? i, a);
  return t;
}, Ra = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), ze = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (a == null ? void 0 : a.area_id) ?? void 0;
}, Fa = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []])];
}, qa = (e, t, i, a) => {
  var n, s, c;
  const o = e.entity_overrides[a];
  if (o != null && o.section) return o.section;
  const r = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const u of e.section_order)
    if ((s = (n = r == null ? void 0 : r.include_entities) == null ? void 0 : n[u]) != null && s.includes(a) || (c = e.include_entities[u]) != null && c.includes(a)) return u;
}, Ma = (e, t, i, a, o, r) => {
  const n = qa(e, t, i, a);
  if (n) return n;
  if (e.floor_heating_entities.includes(a) || r.some((s) => e.floor_heating_labels.includes(s)))
    return "floor_heating";
  if (o === "climate" || o === "fan") return "climate";
  if (o === "cover") return "covers";
  if (o === "light" || o === "switch") return "lights_switches";
  if (o === "media_player") return "media";
}, Da = (e, t = he(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, ai = (e, t = he(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable"].includes(i) ? !1 : t === "media_player" ? !["off", "standby"].includes(i) : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : i === "on";
}, La = (e) => {
  const t = e.filter((o) => o.domain === "climate" && o.section === "climate" && o.available);
  if (!t.length) return "none";
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const r = String(o.entity.attributes.hvac_action ?? "").toLowerCase(), n = String(o.entity.state ?? "").toLowerCase();
    r === "heating" ? i.add("heat") : r === "cooling" ? i.add("cool") : ["drying", "fan"].includes(r) ? i.add("active") : r === "off" ? i.add("off") : n === "heat" ? i.add("heat") : n === "cool" ? i.add("cool") : n === "off" ? i.add("off") : i.add("active");
  }
  const a = [...i].filter((o) => o !== "off");
  return a.length ? new Set(a).size > 1 || i.has("active") ? "active" : i.has("heat") ? "heat" : i.has("cool") ? "cool" : "active" : "off";
}, ja = (e, t, i) => {
  var a;
  return i || ((a = e == null ? void 0 : e.formatEntityName) == null ? void 0 : a.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, Ha = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), Tt = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, Ke = (e) => {
  if (!e) return {};
  const t = it(e.attributes.current_temperature), i = it(e.state), a = t ?? i, o = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: a, unit: o };
}, Ot = (e) => {
  if (!e.length) return;
  const t = [...e].sort((a, o) => a - o), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, Ua = (e, t, i, a, o, r) => {
  var m, h;
  const n = o.area_overrides[t] ?? o.area_overrides[(i == null ? void 0 : i.name) ?? ""], s = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((d) => !!d).filter((d) => !r.has(d)))];
  for (const d of s) {
    const f = Ke(e == null ? void 0 : e.states[d]);
    if (f.value !== void 0) return { temperature: f.value, unit: f.unit };
  }
  const c = a.map((d) => e == null ? void 0 : e.states[d]).filter((d) => !!d).filter((d) => he(d.entity_id) === "sensor" && d.attributes.device_class === "temperature").map(Ke).filter((d) => d.value !== void 0);
  if (c.length) return { temperature: Ot(c.map((d) => d.value)), unit: (m = c.find((d) => d.unit)) == null ? void 0 : m.unit };
  const u = a.map((d) => e == null ? void 0 : e.states[d]).filter((d) => d !== void 0 && he(d.entity_id) === "climate").map(Ke).filter((d) => d.value !== void 0);
  return { temperature: Ot(u.map((d) => d.value)), unit: (h = u.find((d) => d.unit)) == null ? void 0 : h.unit };
}, Ba = (e, t, i, a, o, r) => {
  const n = o.area_overrides[t] ?? o.area_overrides[i ?? ""], s = n == null ? void 0 : n.occupancy_count_entity;
  if (s && !r.has(s)) {
    const y = e == null ? void 0 : e.states[s];
    if (y) {
      const x = it(y.state);
      if (x !== void 0) {
        const l = Math.max(0, Math.round(x));
        return { occupancy: l > 0 ? "occupied" : "vacant", count: l, countSource: "entity", entities: [s] };
      }
      return { occupancy: "unknown", countSource: "entity", entities: [s] };
    }
  }
  const c = ((n == null ? void 0 : n.occupancy_entities) ?? []).filter((y) => !r.has(y)), u = c.length ? c : a.filter((y) => {
    const x = e == null ? void 0 : e.states[y];
    return he(y) === "binary_sensor" && o.occupancy_device_classes.includes(String((x == null ? void 0 : x.attributes.device_class) ?? ""));
  });
  if (!u.length) return { occupancy: "none", countSource: "none", entities: [] };
  const m = u.map((y) => {
    var x;
    return String(((x = e == null ? void 0 : e.states[y]) == null ? void 0 : x.state) ?? "unknown").toLowerCase();
  }), h = /* @__PURE__ */ new Set(["on", "home", "occupied", "present", "detected"]), d = /* @__PURE__ */ new Set(["off", "not_home", "away", "vacant", "clear"]), f = m.filter((y) => h.has(y)).length;
  return f > 0 ? { occupancy: "occupied", count: f, countSource: "sensors", entities: u } : m.every((y) => d.has(y)) ? { occupancy: "vacant", count: 0, countSource: "sensors", entities: u } : { occupancy: "unknown", countSource: "sensors", entities: u };
}, Va = (e, t, i, a, o) => {
  var x, l, g, _, v, E;
  const r = t.area_overrides[i] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""];
  if (r != null && r.hidden) return;
  const n = Object.values((r == null ? void 0 : r.include_entities) ?? {}).flat(), s = [.../* @__PURE__ */ new Set([...o, ...n])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(r == null ? void 0 : r.exclude_entities) ?? []]);
  for (const [$, T] of Object.entries(t.entity_overrides))
    T.hidden === !0 && c.add($);
  for (const $ of s)
    ((x = t.entity_overrides[$]) == null ? void 0 : x.hidden) === !0 && c.add($);
  const u = s.filter(($) => !c.has($)), m = [];
  for (const $ of s) {
    const T = e == null ? void 0 : e.states[$];
    if (!T || c.has($)) continue;
    const S = (l = e == null ? void 0 : e.entities) == null ? void 0 : l[$], z = S != null && S.device_id ? (g = e == null ? void 0 : e.devices) == null ? void 0 : g[S.device_id] : void 0, k = t.entity_overrides[$];
    if (k != null && k.hidden || S != null && S.hidden || S != null && S.hidden_by || S != null && S.disabled_by || z != null && z.disabled_by || (S == null ? void 0 : S.entity_category) === "config" || (S == null ? void 0 : S.entity_category) === "diagnostic") continue;
    const G = he($), ne = Fa(e, $), lt = Ma(t, i, a == null ? void 0 : a.name, $, G, ne);
    lt && m.push({
      entity: T,
      entityId: $,
      domain: G,
      name: ja(e, T, k == null ? void 0 : k.name),
      icon: Ha(T, G, k == null ? void 0 : k.icon),
      areaId: i,
      section: lt,
      labels: ne,
      available: !["unavailable", "unknown"].includes(T.state),
      active: Da(T, G),
      powered: ai(T, G),
      protected: (k == null ? void 0 : k.protected) === !0 || t.protected_entities.includes($) || ne.some((ri) => t.protected_labels.includes(ri)),
      group: k == null ? void 0 : k.group
    });
  }
  const d = ((_ = r == null ? void 0 : r.section_order) != null && _.length ? r.section_order : t.section_order).map(($) => {
    var S;
    const T = m.filter((z) => z.section === $).sort(
      (z, k) => {
        var G, ne;
        return Tt((G = r == null ? void 0 : r.entity_order) == null ? void 0 : G[$], z.entityId) - Tt((ne = r == null ? void 0 : r.entity_order) == null ? void 0 : ne[$], k.entityId) || z.name.localeCompare(k.name);
      }
    );
    return {
      id: $,
      title: za(e, t, $, (S = r == null ? void 0 : r.section_titles) == null ? void 0 : S[$]),
      icon: Jt[$],
      entities: T,
      activeCount: T.filter((z) => z.powered).length
    };
  }).filter(($) => t.show_empty_sections || $.entities.length > 0), f = Ua(e, i, a, u, t, c), y = Ba(e, i, a == null ? void 0 : a.name, u, t, c);
  return {
    id: i,
    name: (r == null ? void 0 : r.name) ?? (a == null ? void 0 : a.name) ?? i,
    icon: (r == null ? void 0 : r.icon) ?? (a == null ? void 0 : a.icon) ?? "mdi:floor-plan",
    floorId: (a == null ? void 0 : a.floor_id) ?? void 0,
    parentAreaId: r == null ? void 0 : r.parent_area,
    showWhenParentCollapsed: (r == null ? void 0 : r.show_when_parent_collapsed) === !0,
    sections: d,
    allEntities: m,
    temperature: f.temperature,
    temperatureUnit: f.unit ?? ((E = (v = e == null ? void 0 : e.config) == null ? void 0 : v.unit_system) == null ? void 0 : E.temperature) ?? "°C",
    temperatureMode: La(m),
    occupancy: y.occupancy,
    occupancyCount: y.count,
    occupancyCountSource: y.countSource,
    occupancyEntities: y.entities
  };
}, Ja = (e, t, i) => {
  if (t.area) {
    const a = [...i.entries()].find(([r, n]) => r === t.area || n.name === t.area);
    if (!a) return { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
    const o = t.area_overrides[a[0]] ?? t.area_overrides[a[1].name];
    return { ids: [a[0]], targetName: a[1].name, targetIcon: t.target_icon || (o == null ? void 0 : o.icon) || a[1].icon || "mdi:floor-plan", kind: "area", warnings: [] };
  }
  if (t.floor) {
    const a = Ra(e).find((r) => r.id === t.floor || r.name === t.floor);
    if (!a) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const o = [...i.entries()].filter(([, r]) => r.floor_id === a.id).map(([r]) => r);
    return { ids: o, targetName: a.name, targetIcon: t.target_icon || a.icon || "mdi:home-floor-0", kind: "floor", warnings: o.length ? [] : [`Floor has no areas: ${a.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, De = (e, t) => {
  var x;
  const i = Na(e), a = Ja(e, t, i), o = /* @__PURE__ */ new Map();
  for (const l of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const g = ze(e, l);
    if (!g) continue;
    const _ = o.get(g) ?? [];
    _.push(l), o.set(g, _);
  }
  const r = (l, g) => {
    const _ = t.area_order.findIndex((v) => v === l || v === g);
    return _ < 0 ? Number.MAX_SAFE_INTEGER : _;
  }, n = a.ids.map((l) => Va(e, t, l, i.get(l), o.get(l) ?? [])).filter((l) => !!l).sort((l, g) => r(l.id, l.name) - r(g.id, g.name) || l.name.localeCompare(g.name)), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = (l, g) => {
    if (!l) return;
    const _ = c.get(l) ?? /* @__PURE__ */ new Set();
    _.add(g), c.set(l, _);
  };
  for (const l of n) {
    s.set(l.id, l.id), u(l.name, l.id);
    const g = (x = i.get(l.id)) == null ? void 0 : x.name;
    u(g, l.id);
  }
  for (const [l, g] of c)
    g.size === 1 && !s.has(l) && s.set(l, [...g][0]);
  const m = n.map((l) => {
    const g = l.parentAreaId ? s.get(l.parentAreaId) : void 0;
    return { ...l, parentAreaId: g && g !== l.id ? g : void 0 };
  }), h = new Map(m.filter((l) => l.parentAreaId).map((l) => [l.id, l.parentAreaId])), d = /* @__PURE__ */ new Set();
  for (const l of m) {
    const g = [], _ = /* @__PURE__ */ new Map();
    let v = l.id;
    for (; v; ) {
      const E = _.get(v);
      if (E !== void 0) {
        for (const $ of g.slice(E)) d.add($);
        break;
      }
      _.set(v, g.length), g.push(v), v = h.get(v);
    }
  }
  const f = m.map((l) => d.has(l.id) ? { ...l, parentAreaId: void 0 } : l), y = d.size ? [`Area parent cycle ignored: ${[...d].join(", ")}`] : [];
  return {
    areas: f,
    targetName: t.title || a.targetName,
    targetIcon: a.targetIcon,
    targetKind: a.kind,
    warnings: [...a.warnings, ...y]
  };
}, oi = (e) => {
  const t = new Map(e.map((n) => [n.id, n])), i = /* @__PURE__ */ new Map();
  for (const n of e)
    n.parentAreaId && n.parentAreaId !== n.id && t.has(n.parentAreaId) && i.set(n.id, n.parentAreaId);
  const a = /* @__PURE__ */ new Set();
  for (const n of e) {
    const s = [], c = /* @__PURE__ */ new Map();
    let u = n.id;
    for (; u; ) {
      const m = c.get(u);
      if (m !== void 0) {
        for (const h of s.slice(m)) a.add(h);
        break;
      }
      c.set(u, s.length), s.push(u), u = i.get(u);
    }
  }
  const o = /* @__PURE__ */ new Map(), r = [];
  for (const n of e) {
    const s = a.has(n.id) ? void 0 : i.get(n.id);
    if (!s) {
      r.push(n);
      continue;
    }
    const c = o.get(s) ?? [];
    c.push(n), o.set(s, c);
  }
  return { roots: r, children: o };
}, Ga = (e, t) => {
  const { roots: i, children: a } = oi(e), o = [], r = /* @__PURE__ */ new Set(), n = (s) => {
    if (r.has(s.id)) return;
    r.add(s.id), o.push(s);
    const c = t(s);
    for (const u of a.get(s.id) ?? [])
      (c || u.showWhenParentCollapsed) && n(u);
  };
  for (const s of i) n(s);
  return o;
};
var Ka = Object.defineProperty, Qa = Object.getOwnPropertyDescriptor, X = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Qa(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ka(t, i, o), o;
};
let B = class extends W {
  constructor() {
    super(...arguments), this.config = { type: ae }, this.targetMode = "area", this.activeAreaId = "", this.entitySearch = "", this.candidateEntityId = "", this.candidateSection = "floor_heating";
  }
  setConfig(e) {
    const t = { ...e, type: ae };
    typeof e.show_area_expand_button != "boolean" && delete t.show_area_expand_button, this.config = t, this.targetMode = e.floor ? "floor" : "area", e.area && (this.activeAreaId = e.area);
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.floors !== this.hass.floors || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : t.states !== this.hass.states;
  }
  render() {
    const e = fe(this.config), t = Y(this.hass, e), i = typeof e.rtl == "boolean" ? e.rtl : t === "he";
    this.setAttribute("dir", i ? "rtl" : "ltr"), this.style.setProperty("--overview-editor-direction", i ? "rtl" : "ltr");
    const a = De(this.hass, e), o = this.targetAreas(e), r = this.entityMapByArea();
    return o.length && !o.some((n) => n.id === this.activeAreaId) && queueMicrotask(() => this.activeAreaId = o[0].id), p`
      <div class="editor">
        <div class="intro">
          <span class="intro-icon"><ha-icon icon="mdi:home-analytics"></ha-icon></span>
          <div>
            <strong>${this.l("סקירת אזור וקומה", "Area and floor overview", t)}</strong>
            <span>${this.l("גילוי אוטומטי עם סידור והתאמות שנשמרים גם כשנוספים רכיבים", "Automatic discovery with ordering that keeps working as devices are added", t)}</span>
          </div>
        </div>
        ${this.renderTarget(e, t)}
        ${this.renderSummarySettings(e, t)}
        ${this.renderSections(e, t)}
        ${this.renderAreas(e, o, r, t)}
        ${this.renderEntities(e, a, o, t)}
        ${this.renderAppearance(e, t)}
        ${this.renderAdvanced(e, t)}
      </div>
    `;
  }
  renderTarget(e, t) {
    var s;
    const i = this.areaOptions(), a = this.floorOptions(), o = this.targetMode === "area" ? this.areaIdFor(e.area) : this.floorIdFor(e.floor), n = ((s = (this.targetMode === "area" ? i : a).find((c) => c.id === o)) == null ? void 0 : s.icon) ?? (this.targetMode === "floor" ? "mdi:home-floor-0" : "mdi:floor-plan");
    return p`
      <details open>
        ${this.summary("mdi:map-marker-radius", this.l("יעד", "Target", t), this.l("בחרו חדר יחיד או קומה שלמה", "Choose one room or a complete floor", t))}
        <div class="panel">
          <div class="segmented">
            <button type="button" class="segment ${this.targetMode === "area" ? "active" : ""}" @click=${() => this.targetMode = "area"}>${this.l("אזור", "Area", t)}</button>
            <button type="button" class="segment ${this.targetMode === "floor" ? "active" : ""}" @click=${() => this.targetMode = "floor"}>${this.l("קומה", "Floor", t)}</button>
          </div>
          <div class="field">
            <label>${this.targetMode === "area" ? this.l("אזור להצגה", "Area to show", t) : this.l("קומה להצגה", "Floor to show", t)}</label>
            <select .value=${o} @change=${(c) => this.setTarget(c.target.value)}>
              <option value="" ?selected=${!o}>${this.l("בחרו...", "Choose...", t)}</option>
              ${(this.targetMode === "area" ? i : a).map((c) => p`<option value=${c.id} ?selected=${c.id === o}>${c.name}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${this.l("כותרת מותאמת (רשות)", "Custom title (optional)", t)}</label>
            <input type="text" .value=${e.title} @change=${(c) => this.commitKey("title", c.target.value)} />
          </div>
          ${this.iconField(
      this.l("אייקון הכותרת", "Header icon", t),
      e.target_icon,
      n,
      t,
      (c) => this.commitKey("target_icon", c)
    )}
          ${this.targetMode === "floor" && !a.length ? p`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", t)}</div>` : b}
        </div>
      </details>
    `;
  }
  renderSummarySettings(e, t) {
    const i = [
      ["show_header", this.l("הצג כותרת", "Show header", t), this.l("כותרת קומה או כותרת מותאמת", "Floor or custom card heading", t), e.show_header],
      ["show_temperature", this.l("הצג טמפרטורה", "Show temperature", t), this.l("חיישן מועדף, חיישני טמפרטורה או מזגן", "Preferred sensor, temperature sensors, or climate", t), e.show_temperature],
      ["show_occupancy", this.l("הצג נוכחות", "Show occupancy", t), this.l("מאוכלס, ריק או לא ידוע", "Occupied, vacant, or unknown", t), e.show_occupancy],
      ["show_quick_actions", this.l("הצג פעולות מהירות", "Show quick actions", t), this.l("פתח שליטה רק לקטגוריות פעילות", "Open control popups only for active categories", t), e.show_quick_actions],
      ["show_area_expand_button", this.l("הצג חץ פתיחה לאזורים", "Show area expand buttons", t), this.l("ניתן לפתוח ולכווץ גם בלחיצה על שם האזור", "Areas can still be expanded and collapsed by clicking their name", t), e.show_area_expand_button],
      ["default_expanded", this.l("פתוח כברירת מחדל", "Expanded by default", t), "", e.default_expanded],
      ["floor_default_expanded", this.l("פתח קומה כברירת מחדל", "Floor expanded by default", t), this.l("חל רק כאשר היעד הוא קומה", "Used only when the target is a floor", t), e.floor_default_expanded],
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", t), this.l("שומר בנפרד את מצב הקומה ואת מצב כל אזור", "Remembers the floor and each area separately", t), e.remember_expanded_state],
      ["show_empty_sections", this.l("הצג סעיפים ריקים", "Show empty sections", t), "", e.show_empty_sections]
    ];
    return p`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", t), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", t))}
        <div class="panel"><div class="settings-list">${i.map(([a, o, r, n]) => this.booleanRow(o, r, n, (s) => this.commitKey(a, s)))}</div></div>
      </details>
    `;
  }
  renderSections(e, t) {
    return p`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", t), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", t))}
        <div class="panel">
          <div class="hint">${this.l("ישויות חדשות מצטרפות אוטומטית בסוף הסעיף, כך שהסידור הידני נשאר יציב.", "New entities are appended automatically, so your manual order remains stable.", t)}</div>
          <div class="field">
            <label>${this.l("כפתורי שליטה בכותרת קטגוריה", "Category header controls", t)}</label>
            <select .value=${e.section_action_mode} @change=${(i) => this.commitKey("section_action_mode", i.target.value)}>
              <option value="toggle">${this.l("כפתור אחד — החלפת מצב", "One smart toggle button", t)}</option>
              <option value="dual">${this.l("שני כפתורים — הדלקה וכיבוי", "Two buttons — on and off", t)}</option>
            </select>
          </div>
          <div class="inline-fields">
            ${["on", "off", "open", "close"].map((i) => {
      var a;
      return this.iconField(
        this.sectionActionIconName(i, t),
        typeof ((a = this.config.section_action_icons) == null ? void 0 : a[i]) == "string" ? this.config.section_action_icons[i] : "",
        qe[i],
        t,
        (o) => this.setSectionActionIcon(i, o)
      );
    })}
          </div>
          <div class="order-list">
            ${e.section_order.map((i, a) => {
      var o, r, n, s;
      return p`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${Jt[i]}></ha-icon></span>
                <div class="order-main field">
                  <label>${this.sectionDefaultName(i, t)}</label>
                  <input type="text" .value=${e.section_titles[i]} placeholder=${this.sectionDefaultName(i, t)} @change=${(c) => this.setSectionTitle(i, c.target.value)} />
                </div>
                ${this.orderButtons(a, e.section_order.length, () => this.moveSection(i, -1), () => this.moveSection(i, 1))}
                <div class="section-style-editor">
                  ${this.booleanRow(
        this.l("מסגרת קלה לקטגוריה", "Subtle category frame", t),
        this.l("ניתן לדרוס את ההגדרה בכל חדר בנפרד.", "Can be overridden for an individual room.", t),
        e.section_styles[i].show_border ?? !1,
        (c) => this.setGlobalSectionStyle(i, { show_border: c })
      )}
                  <div class="inline-fields">
                    ${this.valueColorField(
        this.l("רקע קטגוריה", "Category background", t),
        e.section_styles[i].background ?? "transparent",
        "#ffffff",
        !!((r = (o = this.config.section_styles) == null ? void 0 : o[i]) != null && r.background),
        t,
        (c) => this.setGlobalSectionStyle(i, { background: c || void 0 })
      )}
                    ${this.valueColorField(
        this.l("צבע מסגרת", "Frame color", t),
        e.section_styles[i].border_color ?? "var(--divider-color)",
        "#888888",
        !!((s = (n = this.config.section_styles) == null ? void 0 : n[i]) != null && s.border_color),
        t,
        (c) => this.setGlobalSectionStyle(i, { border_color: c || void 0 })
      )}
                  </div>
                </div>
              </div>
            `;
    })}
          </div>
          <div class="setting-title">${this.l("פעולות מהירות", "Quick actions", t)}</div>
          <div class="order-list">
            ${[...e.quick_actions, ...Vt.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      var s;
      const a = e.quick_actions.includes(i), o = e.quick_actions.indexOf(i), r = (s = this.config.quick_action_icons) == null ? void 0 : s[i], n = typeof r == "string" ? r : "";
      return p`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${e.quick_action_icons[i]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(i, t)}</div></div>
                  <div class="area-actions">
                    ${a ? this.orderButtons(o, e.quick_actions.length, () => this.moveQuickAction(i, -1), () => this.moveQuickAction(i, 1)) : b}
                    ${this.switchControl(a, (c) => this.toggleQuickAction(i, c), this.quickName(i, t))}
                  </div>
                  <div class="quick-action-icon-field">
                    ${this.iconField(
        `${this.l("אייקון פעולה", "Action icon", t)} · ${this.quickName(i, t)}`,
        n,
        Ze[i],
        t,
        (c) => this.setQuickActionIcon(i, c)
      )}
                  </div>
                </div>
              `;
    })}
          </div>
        </div>
      </details>
    `;
  }
  renderAreas(e, t, i, a) {
    return p`
      <details>
        ${this.summary("mdi:floor-plan", this.l("אזורים בקומה", "Areas", a), this.l("סדר, כותרת, אייקון וחיישנים מועדפים", "Order, title, icon, and preferred sensors", a))}
        <div class="panel">
          ${t.length ? p`<div class="order-list">${t.map((o) => {
      const r = this.normalizedParentId(o.id, e), n = t.filter((s) => this.normalizedParentId(s.id, e) === r);
      return this.renderAreaEditor(o, n.findIndex((s) => s.id === o.id), n.length, e, i.get(o.id) ?? [], a);
    })}</div>` : p`<div class="empty">${this.l("בחרו יעד כדי לערוך אזורים", "Choose a target to edit its areas", a)}</div>`}
        </div>
      </details>
    `;
  }
  renderAreaEditor(e, t, i, a, o, r) {
    var y, x;
    const n = a.area_overrides[e.id] ?? a.area_overrides[e.name] ?? {}, s = this.activeAreaId === e.id, c = o.filter(
      (l) => l.entity_id.startsWith("climate.") || l.entity_id.startsWith("sensor.") && l.attributes.device_class === "temperature"
    ), u = o.filter((l) => {
      const g = l.entity_id.split(".")[0];
      return g === "binary_sensor" || g === "person" || g === "device_tracker";
    }), m = o.filter((l) => {
      const g = l.entity_id.split(".")[0];
      return ["sensor", "input_number", "counter"].includes(g ?? "") && (Number.isFinite(Number(l.state)) || l.entity_id === n.occupancy_count_entity);
    }), h = this.targetAreas(a).filter((l) => {
      const g = a.area_overrides[l.id] ?? a.area_overrides[l.name];
      return l.id !== e.id && (g == null ? void 0 : g.hidden) !== !0 && !this.wouldCreateAreaCycle(e.id, l.id, a);
    }), d = n.parent_area ? ((y = this.areaOptions().find((l) => l.id === n.parent_area || l.name === n.parent_area)) == null ? void 0 : y.id) ?? "" : "", f = ((x = this.areaOptions().find((l) => l.id === d)) == null ? void 0 : x.name) ?? d;
    return p`
      <div class="area-card ${n.hidden ? "hidden" : ""} ${d ? "child" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${n.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${s ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${n.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, a), () => this.moveArea(e.id, 1, a))}
            ${this.switchControl(!n.hidden, (l) => this.updateAreaOverride(e.id, { hidden: !l }), this.l("הצג אזור", "Show area", r))}
          </div>
        </div>
        ${s ? p`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", r)}</label><input type="text" .value=${n.name ?? ""} placeholder=${e.name} @change=${(l) => this.updateAreaOverride(e.id, { name: l.target.value || void 0 })} /></div>
                ${this.iconField(this.l("אייקון האזור", "Area icon", r), n.icon ?? "", e.icon, r, (l) => this.updateAreaOverride(e.id, { icon: l || void 0 }))}
              </div>
              <div class="field">
                <label>${this.l("תת־אזור של", "Parent area", r)}</label>
                <select .value=${d} @change=${(l) => this.updateAreaOverride(e.id, { parent_area: l.target.value || void 0 })}>
                  <option value="">${this.l("ללא אזור אב", "No parent area", r)}</option>
                  ${h.map((l) => p`<option value=${l.id}>${l.name}</option>`)}
                </select>
                <div class="hint">${this.l("הקשר הוא חזותי בלבד; המצב והפעולות של כל אזור נשארים עצמאיים.", "Nesting is visual only; every area's state and actions remain independent.", r)}</div>
              </div>
              ${d ? this.booleanRow(
      this.l("הצג כשהאזור הראשי מכווץ", "Show when parent is collapsed", r),
      this.l(
        `כבוי כברירת מחדל. כשהאפשרות פעילה, תת־האזור נשאר גלוי בתוך ${f} גם כשהוא מכווץ. החצים בשורת האזור קובעים את הסדר רק בין תתי־אזורים של אותו אזור אב.`,
        `Off by default. When enabled, this child remains visible inside ${f} while the parent is collapsed. The arrows in the area row order only children of the same parent.`,
        r
      ),
      n.show_when_parent_collapsed ?? !1,
      (l) => this.updateAreaOverride(e.id, { show_when_parent_collapsed: l })
    ) : b}
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", r)}</label>
                <select .value=${n.temperature_entity ?? ""} @change=${(l) => this.updateAreaOverride(e.id, { temperature_entity: l.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", r)}</option>
                  ${c.map((l) => p`<option value=${l.entity_id}>${this.entityName(l)}</option>`)}
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור ספירת נוכחים", "Occupancy count source", r)}</label>
                <select .value=${n.occupancy_count_entity ?? ""} @change=${(l) => this.updateAreaOverride(e.id, { occupancy_count_entity: l.target.value || void 0 })}>
                  <option value="">${this.l("ספירת חיישני נוכחות פעילים", "Count active presence sensors", r)}</option>
                  ${m.map((l) => p`<option value=${l.entity_id}>${this.entityName(l)}</option>`)}
                </select>
                <div class="hint">${this.l("בחרו חיישן מספרי כדי להציג מספר אנשים אמיתי; אחרת יוצג מספר חיישני הנוכחות הפעילים.", "Choose a numeric sensor for a true people count; otherwise the card shows the number of active presence sensors.", r)}</div>
              </div>
              ${u.length ? p`<div class="field"><label>${this.l("מקורות נוכחות (ריק = אוטומטי)", "Presence sources (empty = automatic)", r)}</label><div class="entity-flags">${u.map((l) => {
      var _;
      const g = ((_ = n.occupancy_entities) == null ? void 0 : _.includes(l.entity_id)) ?? !1;
      return p`<label class="check-label"><input type="checkbox" .checked=${g} @change=${(v) => this.toggleAreaList(e.id, "occupancy_entities", l.entity_id, v.target.checked)} />${this.entityName(l)}</label>`;
    })}</div></div>` : b}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", r)}</div></div>${this.switchControl(n.default_expanded ?? a.default_expanded, (l) => this.updateAreaOverride(e.id, { default_expanded: l }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", r)}</div>
              <div class="inline-fields">
                ${a.section_order.map((l) => {
      var g;
      return p`<div class="field"><label>${this.sectionDefaultName(l, r)}</label><input type="text" .value=${((g = n.section_titles) == null ? void 0 : g[l]) ?? ""} placeholder=${a.section_titles[l] || this.sectionDefaultName(l, r)} @change=${(_) => this.setAreaSectionTitle(e.id, l, _.target.value)} /></div>`;
    })}
              </div>
              <div class="setting-title">${this.l("מראה קטגוריות בחדר", "Room category appearance", r)}</div>
              <div class="order-list">
                ${a.section_order.map((l) => {
      var v;
      const g = a.section_styles[l], _ = ((v = n.section_styles) == null ? void 0 : v[l]) ?? {};
      return p`
                    <div class="area-card">
                      <div class="setting-title">${this.sectionDefaultName(l, r)}</div>
                      ${this.booleanRow(
        this.l("הצג מסגרת בחדר זה", "Show frame in this room", r),
        "",
        _.show_border ?? g.show_border ?? !1,
        (E) => this.setAreaSectionStyle(e.id, l, { show_border: E })
      )}
                      <div class="inline-fields">
                        ${this.valueColorField(
        this.l("רקע בחדר זה", "Background in this room", r),
        _.background ?? g.background ?? "transparent",
        "#ffffff",
        !!_.background,
        r,
        (E) => this.setAreaSectionStyle(e.id, l, { background: E || void 0 })
      )}
                        ${this.valueColorField(
        this.l("צבע מסגרת בחדר זה", "Frame color in this room", r),
        _.border_color ?? g.border_color ?? "var(--divider-color)",
        "#888888",
        !!_.border_color,
        r,
        (E) => this.setAreaSectionStyle(e.id, l, { border_color: E || void 0 })
      )}
                      </div>
                    </div>
                  `;
    })}
              </div>
            ` : b}
      </div>
    `;
  }
  renderEntities(e, t, i, a) {
    var h;
    const o = this.activeAreaId || ((h = i[0]) == null ? void 0 : h.id) || "", r = t.areas.find((d) => d.id === o), n = De(this.hass, this.configForEntityEditor(e, o)).areas.find((d) => d.id === o), s = new Map(((n == null ? void 0 : n.allEntities) ?? (r == null ? void 0 : r.allEntities) ?? []).map((d) => [d.entityId, d])), c = this.entitiesForEditor(o, s, e), u = this.unclassifiedCandidates(o, s), m = c.filter((d) => `${d.name} ${d.entityId} ${d.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return p`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", a), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", a))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${o} @change=${(d) => this.activeAreaId = d.target.value}>${i.map((d) => p`<option value=${d.id}>${d.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", a)} .value=${this.entitySearch} @input=${(d) => this.entitySearch = d.target.value} />
          </div>
          <div class="hint">${this.l("לכל רכיב יש כפתור הסתרה מלא. רכיב מוסתר נשאר כאן לשחזור, אך אינו מוצג ואינו משפיע על צבע, מונים או פעולות האזור.", "Every device has a complete hide control. Hidden devices remain here for restore, but do not appear or affect area color, counts, or actions.", a)}</div>
          ${u.length ? p`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", a)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", a)}</label>
                      <select .value=${this.candidateEntityId} @change=${(d) => this.candidateEntityId = d.target.value}>
                        <option value="">${this.l("בחרו...", "Choose...", a)}</option>
                        ${u.map((d) => p`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", a)}</label>
                      <select .value=${this.candidateSection} @change=${(d) => this.candidateSection = d.target.value}>
                        ${H.map((d) => p`<option value=${d}>${this.sectionDefaultName(d, a)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", a)}
                  </button>
                </div>
              ` : b}
          <div class="entity-list">
            ${m.length ? m.map((d) => {
      const f = e.entity_overrides[d.entityId] ?? {}, y = c.filter((v) => v.section === d.section), x = y.findIndex((v) => v.entityId === d.entityId), l = this.isEntityExcluded(o, d.entityId, e), g = this.isEntityGloballyExcluded(d.entityId, e), _ = g ? this.l("מוסתר גלובלית — ניתן לשנות במתקדם", "Globally hidden — change it in Advanced", a) : l ? this.l("החזר רכיב לאזור", "Restore device to area", a) : this.l("הסתר רכיב לחלוטין מהאזור", "Hide device completely from area", a);
      return p`
                    <div class="entity-item ${!l && d.active ? "active" : ""} ${l ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${f.icon ?? d.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${f.name || d.name}</div><div class="meta">${d.entityId}${l ? ` · ${g ? this.l("מוסתר גלובלית", "globally hidden", a) : this.l("מוסר מהאזור", "removed from area", a)}` : ""}</div></div>
                      <button
                        class="visibility-button ${l ? "restore" : ""}"
                        type="button"
                        title=${_}
                        aria-label=${`${_}: ${d.name}`}
                        ?disabled=${g}
                        @click=${() => this.setEntityVisible(o, d.entityId, l)}
                      ><ha-icon icon=${l ? "mdi:restore" : "mdi:eye-off-outline"}></ha-icon></button>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", a)}</label><input type="text" .value=${f.name ?? ""} placeholder=${d.name} @change=${(v) => this.updateEntityOverride(d.entityId, { name: v.target.value || void 0 })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", a)}</label><select .value=${f.section ?? d.section} @change=${(v) => this.updateEntityOverride(d.entityId, { section: v.target.value })}>${H.map((v) => p`<option value=${v}>${this.sectionDefaultName(v, a)}</option>`)}</select></div>
                        <div class="field"><label>${this.l("תת־קבוצה בתוך החדר", "Sub-group inside room", a)}</label><input type="text" .value=${f.group ?? d.group ?? ""} placeholder=${this.l("לדוגמה: מקלחת", "Example: Shower", a)} @change=${(v) => this.updateEntityOverride(d.entityId, { group: v.target.value.trim() || void 0 })} /><div class="hint">${this.l("רכיבים עם אותו שם קבוצה יוצגו יחד בתוך הקטגוריה.", "Devices with the same group name are shown together inside the category.", a)}</div></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", a), f.icon ?? "", d.icon, a, (v) => this.updateEntityOverride(d.entityId, { icon: v || void 0 }))}
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${f.protected ?? d.protected} @change=${(v) => this.updateEntityOverride(d.entityId, { protected: v.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", a)}</label>
                        ${this.orderButtons(x, y.length, () => this.moveEntity(o, d.section, d.entityId, -1, y.map((v) => v.entityId)), () => this.moveEntity(o, d.section, d.entityId, 1, y.map((v) => v.entityId)))}
                      </div>
                    </div>
                  `;
    }) : p`<div class="empty">${this.l("אין רכיבים להצגה באזור זה", "No devices to show in this area", a)}</div>`}
          </div>
        </div>
      </details>
    `;
  }
  renderAppearance(e, t) {
    return p`
      <details>
        ${this.summary("mdi:palette-outline", this.l("מראה ושפה", "Appearance and language", t), this.l("צבעים, מרווחים ו-RTL", "Colors, spacing, and RTL", t))}
        <div class="panel">
          <div class="inline-fields">
            ${this.numberField(this.l("עיגול פינות", "Corner radius", t), e.style.border_radius, 4, 40, (i) => this.setStyle("border_radius", i))}
            ${this.numberField(this.l("טשטוש זכוכית", "Glass blur", t), e.style.blur, 0, 40, (i) => this.setStyle("blur", i))}
            ${this.numberField(this.l("גובה שורה", "Row height", t), e.style.row_height, 44, 84, (i) => this.setStyle("row_height", i))}
            ${this.numberField(this.l("גודל שם חדר", "Room name size", t), e.style.area_name_size, 11, 24, (i) => this.setStyle("area_name_size", i))}
            ${this.numberField(this.l("מרווח כללי", "General spacing", t), e.style.section_gap, 4, 30, (i) => this.setStyle("section_gap", i))}
            ${this.numberField(this.l("רווח בין קטגוריות", "Gap between categories", t), e.style.category_gap, 0, 40, (i) => this.setStyle("category_gap", i))}
            ${this.numberField(this.l("גודל עיגול פעולה מהירה בחדר", "Room quick-action circle size", t), e.style.quick_action_size, 28, 52, (i) => this.setStyle("quick_action_size", i))}
            ${this.numberField(this.l("גודל אייקון פעולה מהירה בחדר", "Room quick-action icon size", t), e.style.quick_action_icon_size, 14, 34, (i) => this.setStyle("quick_action_icon_size", i))}
            ${this.numberField(this.l("גודל כפתור פעולה בקטגוריה", "Category action button size", t), e.style.section_action_size, 36, 56, (i) => this.setStyle("section_action_size", i))}
            ${this.numberField(this.l("גודל אייקון פעולה בקטגוריה", "Category action icon size", t), e.style.section_action_icon_size, 16, 36, (i) => this.setStyle("section_action_icon_size", i))}
          </div>
          ${this.booleanRow(
      this.l("רקע כרטיס שקוף", "Transparent card background", t),
      this.l("מציג את רקע הדשבורד שמאחורי הכרטיס. כיבוי האפשרות משתמש בצבע שנבחר למטה.", "Shows the dashboard behind the card. Turn it off to use the background color selected below.", t),
      e.style.card_transparent,
      (i) => this.setStyle("card_transparent", i)
    )}
          <div class="setting-title">${this.l("צבעי מצב", "State colors", t)}</div>
          <div class="state-preview">
            <div class="state-preview-item off" style=${`--preview-surface: ${e.style.row_background}`}>${this.l("כבוי", "OFF", t)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${e.style.active_surface}`}>${this.l("דלוק", "ON", t)}</div>
          </div>
          <div class="inline-fields">
            ${this.colorField(this.l("רקע הכרטיס", "Card background", t), "card_background", e.style.card_background, "#ffffff", t)}
            ${this.colorField(this.l("רקע כבוי", "OFF surface", t), "row_background", e.style.row_background, "#e7e7e7", t)}
            ${this.colorField(this.l("רקע דלוק", "ON surface", t), "active_surface", e.style.active_surface, "#aed7db", t)}
            ${this.colorField(this.l("צבע תג פעיל", "Active count badge", t), "active_color", e.style.active_color, "#ffd54f", t)}
            ${this.colorField(this.l("צבע הדגשה", "Accent color", t), "accent_color", e.style.accent_color, "#03a9f4", t)}
            ${this.colorField(this.l("טמפרטורה — מיזוג כבוי", "Temperature — climate off", t), "temperature_off_surface", e.style.temperature_off_surface, "#0b1c3a", t)}
            ${this.colorField(this.l("טמפרטורה — קירור", "Temperature — cooling", t), "temperature_cool_surface", e.style.temperature_cool_surface, "#2271c4", t)}
            ${this.colorField(this.l("טמפרטורה — חימום", "Temperature — heating", t), "temperature_heat_surface", e.style.temperature_heat_surface, "#c6532f", t)}
            ${this.colorField(this.l("טמפרטורה — מצב פעיל אחר", "Temperature — other active mode", t), "temperature_active_surface", e.style.temperature_active_surface, "#5b56a8", t)}
            ${this.colorField(this.l("רקע מזגן פעיל", "Active climate surface", t), "climate_surface", e.style.climate_surface, "#8bb5ff", t)}
            ${this.colorField(this.l("רקע פקדי גלולה", "Pill control surface", t), "control_surface", e.style.control_surface, "#0b1c3a", t)}
            ${this.colorField(this.l("צבע מיזוג", "Climate accent", t), "climate_color", e.style.climate_color, "#2196f3", t)}
            ${this.colorField(this.l("צבע תריסים", "Cover accent", t), "cover_color", e.style.cover_color, "#00bcd4", t)}
            ${this.colorField(this.l("צבע מוזיקה", "Music accent", t), "media_color", e.style.media_color, "#9c27b0", t)}
          </div>
          <div class="inline-fields">
            <div class="field"><label>${this.l("שפה", "Language", t)}</label><select .value=${e.language} @change=${(i) => this.commitKey("language", i.target.value)}><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
            <div class="field"><label>RTL</label><select .value=${String(e.rtl)} @change=${(i) => this.commitKey("rtl", this.parseRtl(i.target.value))}><option value="auto">Auto</option><option value="true">Enabled</option><option value="false">Disabled</option></select></div>
          </div>
        </div>
      </details>
    `;
  }
  renderAdvanced(e, t) {
    return p`
      <details>
        ${this.summary("mdi:cog-outline", this.l("מתקדם ובטיחות", "Advanced and safety", t), this.l("תוויות, החרגות ומזהה אחסון", "Labels, exclusions, and storage ID", t))}
        <div class="panel">
          ${this.listField(this.l("תוויות חימום רצפתי", "Floor-heating labels", t), e.floor_heating_labels, (i) => this.commitKey("floor_heating_labels", i))}
          ${this.listField(this.l("ישויות חימום רצפתי", "Floor-heating entities", t), e.floor_heating_entities, (i) => this.commitKey("floor_heating_entities", i))}
          ${this.listField(this.l("ישויות מוגנות", "Protected entities", t), e.protected_entities, (i) => this.commitKey("protected_entities", i))}
          ${this.listField(this.l("תוויות מוגנות", "Protected labels", t), e.protected_labels, (i) => this.commitKey("protected_labels", i))}
          ${this.listField(this.l("ישויות מוסתרות", "Excluded entities", t), e.exclude_entities, (i) => this.commitKey("exclude_entities", i))}
          <div class="field"><label>${this.l("מזהה יציב לכרטיס", "Stable card ID", t)}</label><input type="text" .value=${e.id} placeholder="kids-room" @change=${(i) => this.commitKey("id", i.target.value)} /><div class="hint">${this.l("משמש לשמירת מצב פתיחה. מומלץ כאשר יש כמה כרטיסים לאותו יעד.", "Used to remember expansion; recommended when several cards share a target.", t)}</div></div>
          ${this.booleanRow(this.l("מצב אבחון", "Debug mode", t), this.l("מציג את מודל הגילוי בתוך הכרטיס", "Shows the discovery model inside the card", t), e.debug, (i) => this.commitKey("debug", i))}
        </div>
      </details>
    `;
  }
  summary(e, t, i) {
    return p`<summary><ha-icon icon=${e}></ha-icon><span><span class="summary-title">${t}</span><span class="summary-subtitle">${i}</span></span><ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon></summary>`;
  }
  booleanRow(e, t, i, a) {
    return p`<div class="setting-row"><div class="setting-main"><div class="setting-title">${e}</div>${t ? p`<div class="meta">${t}</div>` : b}</div>${this.switchControl(i, a, e)}</div>`;
  }
  switchControl(e, t, i) {
    return p`<label class="switch" title=${i}><input type="checkbox" .checked=${e} aria-label=${i} @change=${(a) => t(a.target.checked)} /><span></span></label>`;
  }
  orderButtons(e, t, i, a) {
    return p`<div class="order-controls"><button class="icon-button" type="button" ?disabled=${e <= 0} @click=${i} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="icon-button" type="button" ?disabled=${e < 0 || e >= t - 1} @click=${a} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;
  }
  numberField(e, t, i, a, o) {
    return p`<div class="field"><label>${e}</label><input type="number" min=${i} max=${a} .value=${String(t)} @change=${(r) => o(Number(r.target.value))} /></div>`;
  }
  listField(e, t, i) {
    return p`<div class="field"><label>${e}</label><textarea .value=${t.join(`
`)} @change=${(a) => i(this.splitList(a.target.value))}></textarea></div>`;
  }
  iconField(e, t, i, a, o) {
    const r = t.trim() || i || "mdi:circle-outline";
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="icon-picker-row">
          <span class="icon-preview"><ha-icon icon=${r}></ha-icon></span>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${t}
            @value-changed=${(n) => o(this.controlValue(n))}
          ></ha-icon-picker>
          <button class="reset-button" type="button" ?disabled=${!t} @click=${() => o("")}>${this.l("איפוס", "Reset", a)}</button>
        </div>
        <input type="text" dir="ltr" .value=${t} placeholder=${i} @change=${(n) => o(n.target.value.trim())} />
        <div class="hint">${this.l("אפשר לבחור מהרשימה או להזין אייקון MDI ידנית.", "Choose from the picker or enter an MDI icon manually.", a)}</div>
      </div>
    `;
  }
  colorField(e, t, i, a, o) {
    var n;
    const r = ((n = this.config.style) == null ? void 0 : n[t]) !== void 0;
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(i, a)} aria-label=${e} @input=${(s) => this.setStyle(t, s.target.value)} />
          <input type="text" .value=${i} aria-label=${`${e} CSS`} @change=${(s) => this.setStyle(t, s.target.value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!r} @click=${() => this.setStyle(t, void 0)}>${this.l("איפוס", "Reset", o)}</button>
        </div>
      </div>
    `;
  }
  valueColorField(e, t, i, a, o, r) {
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(t, i)} aria-label=${e} @input=${(n) => r(n.target.value)} />
          <input type="text" .value=${t} aria-label=${`${e} CSS`} @change=${(n) => r(n.target.value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!a} @click=${() => r("")}>${this.l("איפוס", "Reset", o)}</button>
        </div>
      </div>
    `;
  }
  pickerColor(e, t) {
    var o;
    const i = (o = e.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) == null ? void 0 : o[1];
    if (i) return i.length === 3 ? `#${[...i].map((r) => `${r}${r}`).join("")}` : `#${i}`;
    const a = e.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    return a ? `#${a.slice(1, 4).map((r) => Math.max(0, Math.min(255, Math.round(Number(r)))).toString(16).padStart(2, "0")).join("")}` : t;
  }
  controlValue(e) {
    const t = e.detail, i = e.currentTarget, a = (t == null ? void 0 : t.value) ?? i.value;
    return typeof a == "string" ? a.trim() : "";
  }
  areaOptions() {
    var e;
    return Object.entries(((e = this.hass) == null ? void 0 : e.areas) ?? {}).map(([t, i]) => ({ id: i.area_id ?? i.id ?? t, name: i.name, icon: i.icon ?? "mdi:floor-plan", floorId: i.floor_id ?? void 0 })).sort((t, i) => t.name.localeCompare(i.name));
  }
  floorOptions() {
    var e;
    return Object.entries(((e = this.hass) == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ id: i.floor_id ?? i.id ?? t, name: i.name, icon: i.icon ?? "mdi:home-floor-0", level: i.level ?? Number.MAX_SAFE_INTEGER })).sort((t, i) => t.level - i.level || t.name.localeCompare(i.name));
  }
  targetAreas(e) {
    const t = this.areaOptions();
    let i = t;
    if (e.area && (i = t.filter((a) => a.id === e.area || a.name === e.area)), e.floor) {
      const a = this.floorIdFor(e.floor);
      i = t.filter((o) => o.floorId === a);
    }
    return i.sort((a, o) => {
      const r = e.area_order.findIndex((s) => s === a.id || s === a.name), n = e.area_order.findIndex((s) => s === o.id || s === o.name);
      return (r < 0 ? Number.MAX_SAFE_INTEGER : r) - (n < 0 ? Number.MAX_SAFE_INTEGER : n) || a.name.localeCompare(o.name);
    });
  }
  entityMapByArea() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const i of Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {})) {
      const a = ze(this.hass, i.entity_id);
      if (!a) continue;
      const o = e.get(a) ?? [];
      o.push(i), e.set(a, o);
    }
    return e;
  }
  entitiesForEditor(e, t, i) {
    var o, r, n;
    const a = [...t.values()];
    for (const s of Object.values(((o = this.hass) == null ? void 0 : o.states) ?? {})) {
      if (ze(this.hass, s.entity_id) !== e || t.has(s.entity_id)) continue;
      const c = (n = (r = this.hass) == null ? void 0 : r.entities) == null ? void 0 : n[s.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const u = i.entity_overrides[s.entity_id];
      if (!(u != null && u.section)) continue;
      const m = s.entity_id.split(".")[0] ?? "";
      a.push({
        entity: s,
        entityId: s.entity_id,
        domain: m,
        name: u.name ?? this.entityName(s),
        icon: u.icon ?? String(s.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: u.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(s.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(s.state),
        powered: ai(s, m),
        protected: u.protected === !0,
        group: u.group
      });
    }
    return a;
  }
  unclassifiedCandidates(e, t) {
    var a;
    const i = /* @__PURE__ */ new Set(["input_boolean", "water_heater"]);
    return Object.values(((a = this.hass) == null ? void 0 : a.states) ?? {}).filter((o) => {
      var n, s, c, u;
      if (ze(this.hass, o.entity_id) !== e || t.has(o.entity_id) || (s = (n = this.config.entity_overrides) == null ? void 0 : n[o.entity_id]) != null && s.section) return !1;
      const r = (u = (c = this.hass) == null ? void 0 : c.entities) == null ? void 0 : u[o.entity_id];
      return r != null && r.hidden || r != null && r.hidden_by || r != null && r.disabled_by || r != null && r.entity_category ? !1 : i.has(o.entity_id.split(".")[0] ?? "");
    });
  }
  addCandidateEntity() {
    this.candidateEntityId && (this.updateEntityOverride(this.candidateEntityId, { section: this.candidateSection }), this.candidateEntityId = "");
  }
  entityName(e) {
    var t, i;
    return ((i = (t = this.hass) == null ? void 0 : t.formatEntityName) == null ? void 0 : i.call(t, e)) ?? String(e.attributes.friendly_name ?? e.entity_id);
  }
  setTarget(e) {
    const t = { ...this.config };
    this.targetMode === "area" ? (t.area = e || void 0, delete t.floor, this.activeAreaId = e) : (t.floor = e || void 0, delete t.area, this.activeAreaId = ""), this.commit(t);
  }
  setSectionTitle(e, t) {
    this.commit({ ...this.config, section_titles: { ...this.config.section_titles ?? {}, [e]: t || void 0 } });
  }
  moveSection(e, t) {
    const i = [...fe(this.config).section_order];
    this.moveValue(i, e, t), this.commitKey("section_order", i);
  }
  toggleQuickAction(e, t) {
    const i = [...fe(this.config).quick_actions], a = t ? [...i.filter((o) => o !== e), e] : i.filter((o) => o !== e);
    this.commitKey("quick_actions", a);
  }
  moveQuickAction(e, t) {
    const i = [...fe(this.config).quick_actions];
    this.moveValue(i, e, t), this.commitKey("quick_actions", i);
  }
  setQuickActionIcon(e, t) {
    const i = this.config.quick_action_icons, a = i && typeof i == "object" && !Array.isArray(i) ? { ...i } : {}, o = t.trim();
    o ? a[e] = o : delete a[e], this.commit({ ...this.config, quick_action_icons: a });
  }
  setSectionActionIcon(e, t) {
    const i = { ...this.config.section_action_icons ?? {} }, a = t.trim();
    a ? i[e] = a : delete i[e], this.commit({ ...this.config, section_action_icons: i });
  }
  cleanSectionStyle(e) {
    return Object.fromEntries(Object.entries(e).filter(([, t]) => t !== void 0 && t !== ""));
  }
  setGlobalSectionStyle(e, t) {
    const i = { ...this.config.section_styles ?? {} }, a = this.cleanSectionStyle({ ...i[e] ?? {}, ...t });
    Object.keys(a).length ? i[e] = a : delete i[e], this.commit({ ...this.config, section_styles: i });
  }
  normalizedParentId(e, t) {
    var n;
    const i = this.targetAreas(t), a = i.find((s) => s.id === e), o = t.area_overrides[e] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""], r = o == null ? void 0 : o.parent_area;
    if (r)
      return (n = i.find((s) => s.id === r || s.name === r)) == null ? void 0 : n.id;
  }
  wouldCreateAreaCycle(e, t, i) {
    const a = /* @__PURE__ */ new Set();
    let o = t;
    for (; o && !a.has(o); ) {
      if (o === e) return !0;
      a.add(o), o = this.normalizedParentId(o, i);
    }
    return !1;
  }
  moveArea(e, t, i) {
    const a = this.targetAreas(i), o = this.normalizedParentId(e, i), r = a.filter((h) => this.normalizedParentId(h.id, i) === o).map((h) => h.id), n = r.indexOf(e), s = r[n + t];
    if (n < 0 || !s) return;
    const c = a.map((h) => h.id), u = c.indexOf(e), m = c.indexOf(s);
    [c[u], c[m]] = [c[m], c[u]], this.commitKey("area_order", c);
  }
  updateAreaOverride(e, t) {
    var r;
    const i = { ...this.config.area_overrides ?? {} }, a = (r = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : r.name, o = this.currentAreaOverride(e);
    a && a !== e && delete i[a], i[e] = { ...o, ...t }, this.commit({ ...this.config, area_overrides: i });
  }
  toggleAreaList(e, t, i, a) {
    const r = [...this.currentAreaOverride(e)[t] ?? []].filter((n) => n !== i);
    a && r.push(i), this.updateAreaOverride(e, { [t]: r });
  }
  setAreaSectionTitle(e, t, i) {
    const a = this.currentAreaOverride(e);
    this.updateAreaOverride(e, { section_titles: { ...a.section_titles ?? {}, [t]: i || void 0 } });
  }
  setAreaSectionStyle(e, t, i) {
    const o = { ...this.currentAreaOverride(e).section_styles ?? {} }, r = this.cleanSectionStyle({ ...o[t] ?? {}, ...i });
    Object.keys(r).length ? o[t] = r : delete o[t], this.updateAreaOverride(e, { section_styles: o });
  }
  updateEntityOverride(e, t) {
    var a;
    const i = ((a = this.config.entity_overrides) == null ? void 0 : a[e]) ?? {};
    this.commit({ ...this.config, entity_overrides: { ...this.config.entity_overrides ?? {}, [e]: { ...i, ...t } } });
  }
  configForEntityEditor(e, t) {
    var a;
    if (!t) return e;
    const i = e.area_overrides[t] ?? e.area_overrides[((a = this.areaOptions().find((o) => o.id === t)) == null ? void 0 : a.name) ?? ""] ?? {};
    return {
      ...e,
      exclude_entities: [],
      area_overrides: {
        ...e.area_overrides,
        [t]: { ...i, hidden: !1, exclude_entities: [] }
      },
      entity_overrides: Object.fromEntries(
        Object.entries(e.entity_overrides).map(([o, r]) => [o, { ...r, hidden: !1 }])
      )
    };
  }
  isEntityExcluded(e, t, i) {
    var o, r, n;
    const a = i.area_overrides[e] ?? i.area_overrides[((o = this.areaOptions().find((s) => s.id === e)) == null ? void 0 : o.name) ?? ""] ?? {};
    return i.exclude_entities.includes(t) || !!((r = a.exclude_entities) != null && r.includes(t)) || ((n = i.entity_overrides[t]) == null ? void 0 : n.hidden) === !0;
  }
  isEntityGloballyExcluded(e, t) {
    var i;
    return t.exclude_entities.includes(e) || ((i = t.entity_overrides[e]) == null ? void 0 : i.hidden) === !0;
  }
  setEntityVisible(e, t, i) {
    var c;
    const a = { ...this.config.area_overrides ?? {} }, o = (c = this.areaOptions().find((u) => u.id === e)) == null ? void 0 : c.name, r = this.currentAreaOverride(e), n = [...r.exclude_entities ?? []].filter((u) => u !== t);
    i || n.push(t);
    const s = { ...r, exclude_entities: n };
    o && o !== e && delete a[o], a[e] = s, this.commit({ ...this.config, area_overrides: a });
  }
  moveEntity(e, t, i, a, o) {
    var c;
    const r = this.currentAreaOverride(e), n = ((c = r.entity_order) == null ? void 0 : c[t]) ?? [], s = [...n, ...o.filter((u) => !n.includes(u))];
    this.moveValue(s, i, a), this.updateAreaOverride(e, { entity_order: { ...r.entity_order ?? {}, [t]: s } });
  }
  currentAreaOverride(e) {
    var a, o, r;
    const t = (a = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : a.name;
    return { ...(t && t !== e ? (o = this.config.area_overrides) == null ? void 0 : o[t] : void 0) ?? {}, ...((r = this.config.area_overrides) == null ? void 0 : r[e]) ?? {} };
  }
  setStyle(e, t) {
    const i = { ...this.config.style ?? {} };
    t === void 0 || t === "" ? delete i[e] : i[e] = t, this.commit({ ...this.config, style: i });
  }
  commitKey(e, t) {
    const i = { ...this.config };
    t === "" || t === void 0 ? delete i[e] : i[e] = t, this.commit(i);
  }
  commit(e) {
    this.config = { ...e, type: ae }, this.dispatchEvent(new CustomEvent("config-changed", { bubbles: !0, composed: !0, detail: { config: this.config } }));
  }
  moveValue(e, t, i) {
    const a = e.indexOf(t), o = a + i;
    a < 0 || o < 0 || o >= e.length || ([e[a], e[o]] = [e[o], e[a]]);
  }
  splitList(e) {
    return e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean);
  }
  parseRtl(e) {
    return e === "true" ? !0 : e === "false" ? !1 : "auto";
  }
  areaIdFor(e) {
    var t;
    return e ? ((t = this.areaOptions().find((i) => i.id === e || i.name === e)) == null ? void 0 : t.id) ?? e : "";
  }
  floorIdFor(e) {
    var t;
    return e ? ((t = this.floorOptions().find((i) => i.id === e || i.name === e)) == null ? void 0 : t.id) ?? e : "";
  }
  l(e, t, i) {
    return i === "he" ? e : t;
  }
  sectionDefaultName(e, t) {
    return {
      he: { climate: "מיזוג אוויר", floor_heating: "חימום רצפתי", covers: "תריסים", lights_switches: "מפסקים ותאורה", media: "מוזיקה" },
      en: { climate: "Climate", floor_heating: "Floor heating", covers: "Covers", lights_switches: "Lights and switches", media: "Music" }
    }[t][e];
  }
  quickName(e, t) {
    return {
      he: { lights: "תאורה", climate: "מיזוג", floor_heating: "חימום רצפתי", switches: "מפסקים", covers: "תריסים", media: "מוזיקה" },
      en: { lights: "Lights", climate: "Climate", floor_heating: "Floor heating", switches: "Switches", covers: "Covers", media: "Music" }
    }[t][e];
  }
  sectionActionIconName(e, t) {
    return {
      he: { on: "אייקון הדלקה", off: "אייקון כיבוי", open: "אייקון פתיחת תריסים", close: "אייקון סגירת תריסים" },
      en: { on: "Turn-on icon", off: "Turn-off icon", open: "Open-covers icon", close: "Close-covers icon" }
    }[t][e];
  }
};
B.styles = ke`
    :host { display: block; color: var(--primary-text-color); }
    * { box-sizing: border-box; }
    .editor { display: grid; gap: 12px; direction: var(--overview-editor-direction, ltr); }
    .intro {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }
    .intro-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 16%, transparent); color: var(--primary-color); }
    .intro strong, .intro span { display: block; }
    .intro span, .hint, .meta { color: var(--secondary-text-color); font-size: 12px; line-height: 1.4; }
    details { overflow: hidden; border: 1px solid var(--divider-color); border-radius: 14px; background: var(--card-background-color); }
    summary { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 58px; padding: 10px 14px; cursor: pointer; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary > ha-icon:first-child { color: var(--primary-color); }
    summary .summary-title { display: block; font-weight: 700; }
    summary .summary-subtitle { display: block; margin-top: 2px; color: var(--secondary-text-color); font-size: 12px; }
    summary .chevron { transition: transform 140ms ease; }
    details[open] summary .chevron { transform: rotate(180deg); }
    .panel { display: grid; gap: 12px; padding: 0 14px 14px; border-top: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent); }
    .panel > :first-child { margin-top: 14px; }
    .segmented { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 12px; background: var(--secondary-background-color); }
    button { font: inherit; }
    .segment, .small-button, .icon-button {
      min-height: 38px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .segment.active { background: var(--card-background-color); border-color: var(--divider-color); color: var(--primary-color); font-weight: 700; }
    .field { display: grid; gap: 6px; }
    .field > label { font-size: 13px; font-weight: 650; }
    input[type="text"], input[type="search"], input[type="number"], select, textarea {
      width: 100%; min-height: 42px; padding: 8px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit;
    }
    ha-icon-picker { display: block; width: 100%; min-width: 0; }
    .icon-picker-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px; }
    .icon-preview { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 14%, transparent); color: var(--primary-color); }
    .reset-button { min-height: 38px; padding: 0 10px; border: 1px solid var(--divider-color); border-radius: 10px; background: transparent; color: var(--primary-text-color); cursor: pointer; }
    .color-control { display: grid; grid-template-columns: 42px minmax(0, 1fr) auto; align-items: center; gap: 8px; }
    .color-control input[type="color"] { width: 42px; height: 42px; padding: 3px; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--card-background-color); cursor: pointer; }
    .color-control input[type="text"] { min-width: 0; direction: ltr; text-align: left; }
    .state-preview { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .state-preview-item { display: flex; align-items: center; gap: 9px; min-height: 48px; padding: 7px 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--preview-surface); color: var(--primary-text-color); font-size: 12px; font-weight: 700; }
    .state-preview-item.on { color: #111827; }
    .state-preview-item.off { color: #f4f3ec; }
    .state-preview-item::before { content: ""; width: 28px; height: 28px; border-radius: 50%; background: color-mix(in srgb, var(--primary-text-color) 12%, transparent); }
    textarea { min-height: 90px; resize: vertical; direction: ltr; }
    input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .settings-list { display: grid; gap: 2px; }
    .setting-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 6px 2px; border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent); }
    .setting-row:last-child { border-bottom: 0; }
    .setting-main { min-width: 0; }
    .setting-title { font-size: 13px; font-weight: 650; }
    .switch { position: relative; display: inline-flex; width: 42px; height: 24px; flex: 0 0 auto; }
    .switch input { position: absolute; width: 1px; height: 1px; opacity: 0; }
    .switch span { width: 42px; height: 24px; border-radius: 999px; background: var(--disabled-color, #777); transition: background-color 120ms ease; cursor: pointer; }
    .switch span::after { content: ""; display: block; width: 18px; height: 18px; margin: 3px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,.35); transition: transform 120ms ease; }
    .switch input:checked + span { background: var(--primary-color); }
    .switch input:checked + span::after { transform: translateX(18px); }
    :host([dir="rtl"]) .switch input:checked + span::after { transform: translateX(-18px); }
    .switch input:focus-visible + span { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .order-list { display: grid; gap: 8px; }
    .order-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 54px; padding: 8px; border: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent); border-radius: 11px; background: var(--secondary-background-color); }
    .order-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 13%, transparent); color: var(--primary-color); }
    .order-main { min-width: 0; }
    .order-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 650; }
    .order-controls { display: flex; gap: 4px; }
    .icon-button { display: grid; place-items: center; width: 34px; min-height: 34px; border-color: var(--divider-color); }
    .icon-button[disabled], .small-button[disabled] { cursor: not-allowed; opacity: .4; }
    .inline-fields { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .area-card { display: grid; gap: 10px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .area-card.child { margin-inline-start: 18px; border-inline-start: 3px solid color-mix(in srgb, var(--primary-color) 44%, var(--divider-color)); }
    .area-card.hidden { opacity: .62; }
    .area-line { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; }
    .area-actions { display: flex; align-items: center; gap: 4px; }
    .entity-toolbar { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-block: 4px; background: var(--card-background-color); }
    .entity-list { display: grid; gap: 8px; max-height: 560px; overflow: auto; padding-inline-end: 2px; }
    .entity-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 9px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--secondary-background-color); }
    .entity-item.active { border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color)); }
    .entity-item.excluded { border-style: dashed; opacity: .68; }
    .entity-item.excluded .order-icon { color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent); }
    .visibility-button { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--card-background-color); color: var(--error-color, #db4437); cursor: pointer; }
    .visibility-button.restore { color: var(--success-color, #4caf50); }
    .visibility-button[disabled] { cursor: not-allowed; opacity: .45; }
    .quick-action-icon-field { grid-column: 1 / -1; width: 100%; }
    .section-style-editor { grid-column: 1 / -1; display: grid; gap: 8px; width: 100%; padding-block-start: 4px; border-block-start: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent); }
    .entity-fields { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .entity-flags { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; }
    .check-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
    .empty { padding: 18px; color: var(--secondary-text-color); text-align: center; }
    .status { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; padding: 0 8px; border-radius: 999px; background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent); color: var(--success-color, #4caf50); font-size: 11px; font-weight: 700; }
    @media (max-width: 560px) {
      .inline-fields, .entity-toolbar, .entity-fields, .state-preview { grid-template-columns: 1fr; }
      .icon-picker-row, .color-control { grid-template-columns: auto minmax(0, 1fr); }
      .icon-picker-row .reset-button, .color-control .reset-button { grid-column: 1 / -1; }
      .order-item { grid-template-columns: auto minmax(0, 1fr); }
      .order-controls { grid-column: 1 / -1; }
      .icon-button { flex: 1; width: auto; }
    }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `;
X([
  Ae({ attribute: !1 })
], B.prototype, "hass", 2);
X([
  w()
], B.prototype, "config", 2);
X([
  w()
], B.prototype, "targetMode", 2);
X([
  w()
], B.prototype, "activeAreaId", 2);
X([
  w()
], B.prototype, "entitySearch", 2);
X([
  w()
], B.prototype, "candidateEntityId", 2);
X([
  w()
], B.prototype, "candidateSection", 2);
B = X([
  je(Ut)
], B);
const Wa = ke`
  :host {
    display: block;
    container-name: overview-card;
    container-type: inline-size;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --aboc-radius: var(--area-bubble-overview-border-radius, 26px);
    --aboc-blur: var(--area-bubble-overview-blur, 18px);
    --aboc-gap: var(--area-bubble-overview-gap, 12px);
    --aboc-section-gap: var(--area-bubble-overview-section-gap, 12px);
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-area-name-size: var(--area-bubble-overview-area-name-size, 17px);
    --aboc-quick-action-size: var(--area-bubble-overview-quick-action-size, 38px);
    --aboc-quick-action-icon-size: var(--area-bubble-overview-quick-action-icon-size, 20px);
    --aboc-section-action-size: var(--area-bubble-overview-section-action-size, 44px);
    --aboc-section-action-icon-size: var(--area-bubble-overview-section-action-icon-size, 22px);
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffd54f));
    --aboc-active-surface: var(--area-bubble-overview-active-surface, rgba(174, 215, 219, 0.94));
    --aboc-climate-surface: var(--area-bubble-overview-climate-surface, rgba(139, 181, 255, 0.94));
    --aboc-control-surface: var(--area-bubble-overview-control-surface, rgba(11, 28, 58, 0.94));
    --aboc-climate: var(--area-bubble-overview-climate-color, var(--state-climate-cool-color, #2196f3));
    --aboc-cover: var(--area-bubble-overview-cover-color, var(--state-cover-active-color, #00bcd4));
    --aboc-media: var(--area-bubble-overview-media-color, var(--state-media-player-active-color, #9c27b0));
    --aboc-temperature-off: var(--area-bubble-overview-temperature-off-surface, rgba(11, 28, 58, 0.94));
    --aboc-temperature-cool: var(--area-bubble-overview-temperature-cool-surface, rgba(34, 113, 196, 0.96));
    --aboc-temperature-heat: var(--area-bubble-overview-temperature-heat-surface, rgba(198, 83, 47, 0.96));
    --aboc-temperature-active: var(--area-bubble-overview-temperature-active-surface, rgba(91, 86, 168, 0.96));
    --aboc-row-bg: var(
      --area-bubble-overview-row-bg,
      color-mix(in srgb, var(--secondary-background-color) 78%, transparent)
    );
    --aboc-card-bg: var(--area-bubble-overview-card-bg, transparent);
    --aboc-card-border: var(--area-bubble-overview-card-border, transparent);
    --aboc-shadow: var(--area-bubble-overview-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
    --aboc-dark-text: #111827;
    --aboc-light-text: #f4f3ec;
  }

  * {
    box-sizing: border-box;
  }

  button,
  select {
    font: inherit;
  }

  ha-card {
    overflow: hidden;
    border: 1px solid var(--aboc-card-border);
    border-radius: var(--aboc-radius);
    background: var(--aboc-card-bg);
    box-shadow: var(--aboc-shadow);
    backdrop-filter: blur(var(--aboc-blur));
    -webkit-backdrop-filter: blur(var(--aboc-blur));
  }

  .root {
    display: grid;
    gap: var(--aboc-gap);
    padding: 12px;
  }

  .overview-heading {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
  }

  .overview-heading.floor-heading {
    padding: 0;
  }

  .floor-summary-pill {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 5px;
    border: 2px solid color-mix(in srgb, var(--divider-color) 70%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
  }

  .floor-heading.has-active .floor-summary-pill {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color));
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .floor-toggle {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
    min-height: 58px;
    padding: 1px 2px;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 8px);
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .floor-toggle .heading-main {
    direction: var(--aboc-direction, ltr);
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .floor-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 760;
  }

  .floor-chevron {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    transition: transform 160ms ease;
  }

  .floor-chevron.expanded {
    transform: rotate(180deg);
  }

  .floor-active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 44px;
    height: 44px;
    padding-inline: 7px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    font-size: 12px;
    font-weight: 820;
    cursor: pointer;
  }

  .floor-active-badge ha-icon {
    --mdc-icon-size: 19px;
  }

  .overview-heading .heading-main {
    direction: var(--aboc-direction, ltr);
    min-width: 0;
    flex: 1;
  }

  .overview-heading h2 {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 750;
  }

  .overview-heading .subtitle,
  .secondary,
  .state-text,
  .active-summary {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.35;
  }

  .areas {
    display: grid;
    gap: var(--aboc-gap);
  }

  .area-tree-node,
  .subareas {
    display: grid;
    gap: var(--aboc-gap);
    min-width: 0;
  }

  .subareas {
    margin-block-end: 8px;
    margin-inline-end: 8px;
    margin-inline-start: 22px;
    padding-block-start: 2px;
    padding-inline-start: 9px;
    border-inline-start: 2px solid color-mix(in srgb, var(--aboc-accent) 38%, var(--divider-color));
  }

  .subareas .subareas {
    margin-inline-start: 14px;
    padding-inline-start: 7px;
  }

  .subareas .subareas .subareas {
    margin-inline-start: 8px;
    padding-inline-start: 4px;
  }

  .area-panel {
    --aboc-area-frame-color: color-mix(
      in srgb,
      var(--divider-color, rgba(127, 127, 127, 0.45)) 72%,
      transparent
    );
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .area-panel.expanded {
    overflow: hidden;
    border: 2px solid var(--aboc-area-frame-color);
    border-radius: calc(var(--aboc-radius) + 4px);
    background: var(--aboc-row-bg);
  }

  .area-panel.has-active {
    --aboc-area-frame-color: color-mix(
      in srgb,
      var(--aboc-control-surface) 72%,
      var(--divider-color, rgba(127, 127, 127, 0.45))
    );
  }

  .area-panel.expanded.has-active {
    background: var(--aboc-active-surface);
  }

  .area-panel.expanded > .area-summary {
    width: calc(100% + 4px);
    margin-block: -2px 0;
    margin-inline: -2px;
    padding: 0;
  }

  .area-panel:not(.expanded) > .area-summary {
    padding: 0;
  }

  .area-summary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }

  .area-summary.without-expand-button {
    grid-template-columns: minmax(0, 1fr);
  }

  .area-summary-pill {
    display: flex;
    direction: var(--aboc-direction, ltr);
    align-items: center;
    gap: 6px;
    min-width: 0;
    min-height: 60px;
    padding-block: 5px;
    padding-inline: 5px 8px;
    border: 2px solid var(--aboc-area-frame-color);
    overflow: hidden;
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .area-panel.has-active > .area-summary > .area-summary-pill {
    border-color: var(--aboc-area-frame-color);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .area-summary-pill.compact-statuses {
    gap: 4px;
    padding-inline-end: 6px;
  }

  .area-summary-pill.compact-statuses .area-toggle {
    gap: 6px;
    min-width: 72px;
    flex-basis: 96px;
  }

  .area-summary-pill.compact-statuses .area-icon {
    width: 40px;
    height: 40px;
  }

  .area-summary-pill.compact-statuses .area-statuses,
  .area-summary-pill.compact-statuses .quick-actions {
    gap: 3px;
  }

  .area-summary-pill.compact-statuses .occupancy {
    min-width: 40px;
    height: 40px;
    padding-inline: 6px;
  }

  .area-summary-pill.compact-statuses .area-temperature {
    padding-inline: 7px;
    font-size: 13px;
  }

  .area-summary-pill .area-toggle {
    width: auto;
  }

  .area-summary-pill .occupancy {
    grid-area: occupancy;
  }

  .area-summary-pill .area-temperature {
    grid-area: area-temperature;
  }

  .area-toggle {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 92px;
    flex: 1 1 132px;
    min-height: 48px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .area-main,
  .entity-main {
    direction: var(--aboc-direction, ltr);
    min-width: 0;
    text-align: start;
  }

  .area-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--aboc-area-name-size);
    font-weight: 780;
  }

  .active-summary {
    display: block;
    margin-top: 1px;
    color: color-mix(in srgb, var(--aboc-dark-text) 72%, transparent);
    font-weight: 650;
  }

  .area-statuses {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    min-width: 0;
    flex: 0 1 auto;
    overflow: hidden;
  }

  .expand-button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .chevron {
    display: grid;
    place-items: center;
    transition: transform 160ms ease;
  }

  .area-panel.expanded > .area-summary .chevron {
    transform: rotate(180deg);
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--aboc-accent);
  }

  .area-panel.has-active > .area-summary .area-icon {
    background: color-mix(in srgb, var(--aboc-control-surface) 72%, transparent);
    color: var(--aboc-light-text);
  }

  .area-panel.all-off > .area-summary .area-icon {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--secondary-text-color);
  }

  .icon-bubble.small {
    width: 44px;
    height: 44px;
  }

  .icon-bubble ha-icon {
    --mdc-icon-size: 25px;
  }

  .summary-chip,
  .quick-action,
  .control-button {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .quick-action {
    width: var(--aboc-quick-action-size);
    height: var(--aboc-quick-action-size);
    flex-basis: var(--aboc-quick-action-size);
  }

  .summary-chip {
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
  }

  .summary-chip.occupied {
    color: var(--success-color, #74d680);
  }

  .summary-chip.occupancy {
    grid-template-columns: auto auto;
    width: auto;
    min-width: 44px;
    padding-inline: 9px;
    font-variant-numeric: tabular-nums;
  }

  .summary-chip.occupancy.vacant {
    color: var(--aboc-light-text);
  }

  .summary-chip.occupancy.unknown {
    color: var(--warning-color, #ffb74d);
  }

  .occupancy-count {
    min-width: 1ch;
    font-size: 13px;
    font-weight: 820;
    line-height: 1;
  }

  .summary-chip ha-icon {
    --mdc-icon-size: 21px;
  }

  .quick-action ha-icon {
    --mdc-icon-size: var(--aboc-quick-action-icon-size);
  }

  .occupancy-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .quick-actions {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 5px;
    width: max-content;
    min-width: 0;
    max-width: 100%;
    flex: 0 1 auto;
    flex-wrap: nowrap;
    padding-inline: 3px;
    justify-content: flex-end;
    padding-block: 3px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scroll-padding-inline: 3px;
    scrollbar-width: none;
  }

  .quick-actions::-webkit-scrollbar {
    display: none;
  }

  .quick-action {
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .quick-action::before {
    content: "";
    position: absolute;
    inset: calc((var(--aboc-quick-action-size) - 44px) / 2);
    border-radius: inherit;
  }

  .quick-action.inactive {
    filter: saturate(0.35);
  }

  .quick-action .count-badge {
    position: absolute;
    inset-block-start: -3px;
    inset-inline-end: -3px;
    display: grid;
    place-items: center;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border: 2px solid var(--aboc-active-surface);
    border-radius: 999px;
    background: var(--aboc-active);
    color: #111;
    font-size: 9px;
    font-weight: 850;
  }

  .quick-action-dialog {
    inset: 0;
    width: min(520px, calc(100vw - 24px));
    max-width: none;
    max-height: min(720px, calc(100dvh - 24px));
    margin: auto;
    padding: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: calc(var(--aboc-radius) + 2px);
    outline: 0;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: 0 24px 72px rgba(0, 0, 0, 0.42);
    direction: var(--aboc-direction, ltr);
  }

  .quick-action-dialog::backdrop {
    background: rgba(0, 0, 0, 0.54);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .quick-popup {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    max-height: min(720px, calc(100dvh - 24px));
    overflow: hidden;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.065), transparent),
      var(--ha-card-background, var(--card-background-color));
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 14px 14px 10px;
    border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
  }

  .popup-icon {
    width: 44px;
    height: 44px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .quick-popup-heading {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: start;
  }

  .quick-popup-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 19px;
    font-weight: 800;
  }

  .quick-popup-summary {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 650;
  }

  .quick-popup-close,
  .quick-popup-entity-toggle {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .quick-popup-group-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 58%, transparent);
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-group-button {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
    min-height: 48px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    text-align: start;
    cursor: pointer;
  }

  .quick-popup-group-button.turn-on {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .quick-popup-group-button span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 760;
  }

  .quick-popup-group-button small {
    min-width: 20px;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    text-align: center;
    font-size: 10px;
    font-weight: 800;
  }

  .quick-popup-list {
    display: grid;
    align-content: start;
    gap: 8px;
    min-height: 0;
    padding: 12px 14px 16px;
    overflow: auto;
    overscroll-behavior: contain;
  }

  .floor-all-off {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    margin: 10px 14px 0;
    padding-inline: 14px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    text-align: start;
    cursor: pointer;
  }

  .floor-all-off span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 760;
  }

  .floor-all-off small {
    min-width: 24px;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    text-align: center;
  }

  .floor-room-list {
    display: grid;
    align-content: start;
    gap: 8px;
    min-height: 0;
    padding: 12px 14px 16px;
    overflow: auto;
  }

  .floor-room-row {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 9px;
    min-height: 60px;
    padding: 7px 9px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 7px);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .floor-room-main {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: start;
  }

  .floor-room-main strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .floor-room-main small {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .floor-room-off {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .quick-popup-entity {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 8px;
    min-width: 0;
    min-height: 62px;
    padding: 7px 8px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: var(--aboc-row-bg);
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-entity.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 56%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .quick-popup-entity.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .quick-popup-entity-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 48px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 8px);
    background: transparent;
    color: inherit;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    cursor: pointer;
  }

  .quick-popup-entity.active .quick-popup-entity-main .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 74%, transparent);
    color: var(--aboc-light-text);
  }

  .quick-popup-entity-toggle {
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .quick-popup-entity-toggle.active {
    color: var(--aboc-active);
  }

  .temperature {
    direction: ltr;
    min-width: max-content;
    padding: 9px 12px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    font-size: 14px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
    transition: background-color 180ms ease, box-shadow 180ms ease;
  }

  .temperature-climate-tag {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-inline-start: -13px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-temperature-active);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .temperature-climate-tag::before {
    content: "";
    position: absolute;
    inset: -9px;
    border-radius: inherit;
  }

  .temperature-climate-tag ha-icon {
    --mdc-icon-size: 15px;
  }

  .temperature-climate-tag.temperature-off {
    background: var(--aboc-temperature-off);
  }

  .temperature-climate-tag.temperature-cool {
    background: var(--aboc-temperature-cool);
  }

  .temperature-climate-tag.temperature-heat {
    background: var(--aboc-temperature-heat);
  }

  .temperature.temperature-none {
    background: var(--aboc-control-surface);
  }

  .temperature.temperature-off {
    background: var(--aboc-temperature-off);
  }

  .temperature.temperature-cool {
    background: var(--aboc-temperature-cool);
    box-shadow: 0 0 0 1px color-mix(in srgb, #64b5f6 55%, transparent);
  }

  .temperature.temperature-heat {
    background: var(--aboc-temperature-heat);
    box-shadow: 0 0 0 1px color-mix(in srgb, #ffab91 55%, transparent);
  }

  .temperature.temperature-active {
    background: var(--aboc-temperature-active);
  }

  .expanded-content {
    display: grid;
    gap: var(--aboc-section-gap);
    padding: 0 9px 10px;
    animation: overview-expand 170ms ease both;
  }

  .area-disclosure[hidden] {
    display: none;
  }

  .device-section {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 7px;
    border: 1px solid transparent;
    border-radius: calc(var(--aboc-radius) - 5px);
    background: var(--aboc-section-background, transparent);
  }

  .device-section.section-framed {
    border-color: var(--aboc-section-border-color);
  }

  .section-heading {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-height: max(44px, var(--aboc-section-action-size));
    margin: 0;
    padding: 3px 5px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 680;
    letter-spacing: 0.01em;
    min-width: 0;
  }

  .section-heading-main {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: var(--aboc-direction, ltr);
    text-align: start;
  }

  .section-count {
    margin-inline-start: auto;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .section-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
    direction: var(--aboc-direction, ltr);
  }

  .section-on-button,
  .section-off-button,
  .section-toggle-button {
    display: grid;
    place-items: center;
    width: var(--aboc-section-action-size);
    height: var(--aboc-section-action-size);
    flex: 0 0 var(--aboc-section-action-size);
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-control-surface) 92%, transparent);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .section-on-button {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .section-toggle-button.turn-on {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .section-on-button ha-icon,
  .section-off-button ha-icon,
  .section-toggle-button ha-icon {
    --mdc-icon-size: var(--aboc-section-action-icon-size);
  }

  .section-entities {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    min-width: 0;
  }

  .section-lights_switches .section-entities,
  .section-floor_heating .section-entities {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .entity-subgroup {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 7px;
    border: 1px dashed color-mix(in srgb, var(--aboc-accent) 28%, var(--divider-color));
    border-radius: calc(var(--aboc-radius) - 8px);
    background: color-mix(in srgb, var(--aboc-row-bg) 54%, transparent);
  }

  .entity-subgroup-heading {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-height: 28px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 720;
  }

  .entity-subgroup-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 17px;
  }

  .full-span,
  .section-empty {
    grid-column: 1 / -1;
  }

  .entity-card {
    min-width: 0;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 2px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.055), transparent),
      var(--aboc-row-bg);
    color: var(--primary-text-color);
  }

  .entity-card:not(.active) {
    background: var(--aboc-row-bg);
  }

  .entity-lead {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 44px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 6px);
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .entity-name {
    display: -webkit-box;
    overflow: hidden;
    font-size: 15px;
    font-weight: 720;
    line-height: 1.22;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .state-text {
    display: block;
    overflow: hidden;
    margin-top: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toggle-tile {
    direction: ltr;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    width: 100%;
    min-height: max(56px, var(--aboc-row-height));
    padding: 8px 10px;
    text-align: start;
    cursor: pointer;
    transition: transform 120ms ease, background-color 140ms ease, color 140ms ease;
  }

  .hold-target {
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }

  .hold-target.holding {
    filter: brightness(1.08);
    transform: scale(0.98);
  }

  .toggle-tile.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 62%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .toggle-tile.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 78%, transparent);
    color: var(--aboc-light-text);
  }

  .toggle-tile.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .climate-card,
  .thermostat-card {
    display: grid;
    gap: 8px;
    min-height: 108px;
    padding: 9px;
  }

  .climate-card.active {
    border: 2px solid color-mix(in srgb, var(--aboc-climate) 66%, var(--aboc-control-surface));
    background: var(--aboc-climate-surface);
    color: var(--aboc-dark-text);
  }

  .climate-card.active .state-text,
  .thermostat-card.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .climate-card.active .icon-bubble,
  .thermostat-card.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 74%, transparent);
    color: var(--aboc-light-text);
  }

  .climate-primary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(88px, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .control-button {
    border: 0;
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .control-button ha-icon {
    --mdc-icon-size: 23px;
  }

  .climate-secondary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .temperature-range {
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .range-stepper {
    width: 100%;
    min-width: 0;
  }

  .range-stepper small {
    display: block;
    margin-bottom: -2px;
    font-size: 9px;
    font-weight: 600;
    opacity: 0.72;
  }

  .mode-select {
    direction: var(--aboc-direction, ltr);
    display: block;
    width: 100%;
    min-width: 0;
    --control-select-menu-height: 44px;
    --control-select-menu-border-radius: 999px;
    --control-select-menu-padding: 5px 10px;
    --control-select-menu-background-color: var(--secondary-background-color);
    --control-select-menu-background-opacity: 1;
    --control-select-menu-focus-color: var(--aboc-accent);
    --mdc-icon-size: 21px;
  }

  .light-card {
    display: grid;
    gap: 7px;
    min-height: max(92px, var(--aboc-row-height));
    padding: 8px 10px;
  }

  .light-card.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 62%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .light-card.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .light-card.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 78%, transparent);
    color: var(--aboc-light-text);
  }

  .light-primary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .light-power {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .brightness-control {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .brightness-slider {
    min-width: 0;
    min-height: 44px;
    --control-slider-thickness: 38px;
    --control-slider-border-radius: 999px;
    --control-slider-color: var(--aboc-accent);
    --control-slider-background: var(--aboc-control-surface);
    --control-slider-background-opacity: 0.22;
  }

  .brightness-value {
    color: inherit;
    text-align: center;
    font-size: 12px;
    font-weight: 760;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
  }

  .temperature-stepper {
    direction: ltr;
    display: grid;
    grid-template-columns: 44px minmax(52px, 1fr) 44px;
    align-items: center;
    min-width: 140px;
    min-height: 44px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .temperature-stepper button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .temperature-stepper span {
    min-width: 0;
    text-align: center;
    font-size: 14px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
  }

  .current-temperature {
    align-self: center;
  }

  .thermostat-card.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 52%, transparent);
    background: color-mix(in srgb, var(--aboc-active-surface) 74%, var(--aboc-row-bg));
    color: var(--aboc-dark-text);
  }

  .thermostat-primary {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(110px, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .thermostat-power {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .thermostat-power ha-icon {
    --mdc-icon-size: 22px;
  }

  .cover-card,
  .media-card {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-height: max(56px, var(--aboc-row-height));
    padding: 8px 10px;
  }

  .cover-card.active {
    border-color: color-mix(in srgb, var(--aboc-cover) 42%, var(--divider-color));
  }

  .media-card.active {
    border-color: color-mix(in srgb, var(--aboc-media) 42%, var(--divider-color));
  }

  .cover-controls,
  .media-controls {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
  }

  .cover-control {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .cover-control ha-icon {
    --mdc-icon-size: 27px;
  }

  .media-controls .secondary {
    min-width: 38px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  button[disabled],
  select[disabled] {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .toggle-tile[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .entity-card.unavailable {
    border-style: dashed;
  }

  .entity-card.unavailable .entity-main {
    opacity: 0.72;
  }

  ha-icon[icon="mdi:loading"] {
    animation: overview-spin 0.9s linear infinite;
  }

  .area-toggle:hover,
  .floor-toggle:hover,
  .expand-button:hover,
  .entity-lead:hover,
  .quick-action:hover:not([disabled]),
  .quick-popup-close:hover:not([disabled]),
  .quick-popup-group-button:hover:not([disabled]),
  .quick-popup-entity-main:hover,
  .quick-popup-entity-toggle:hover:not([disabled]),
  .section-on-button:hover:not([disabled]),
  .section-off-button:hover:not([disabled]),
  .section-toggle-button:hover:not([disabled]),
  .floor-active-badge:hover:not([disabled]),
  .floor-all-off:hover:not([disabled]),
  .floor-room-off:hover:not([disabled]),
  .control-button:hover:not([disabled]),
  .cover-control:hover:not([disabled]),
  .temperature-stepper button:hover:not([disabled]),
  .thermostat-power:hover:not([disabled]) {
    filter: brightness(1.1);
  }

  .toggle-tile:hover:not([aria-disabled="true"]) {
    transform: translateY(-1px);
  }

  .quick-action:active:not([disabled]),
  .quick-popup-close:active:not([disabled]),
  .quick-popup-group-button:active:not([disabled]),
  .quick-popup-entity-toggle:active:not([disabled]),
  .section-on-button:active:not([disabled]),
  .section-off-button:active:not([disabled]),
  .section-toggle-button:active:not([disabled]),
  .floor-active-badge:active:not([disabled]),
  .floor-all-off:active:not([disabled]),
  .floor-room-off:active:not([disabled]),
  .control-button:active:not([disabled]),
  .cover-control:active:not([disabled]),
  .temperature-stepper button:active:not([disabled]),
  .thermostat-power:active:not([disabled]),
  .toggle-tile:active:not([aria-disabled="true"]) {
    transform: scale(0.96);
  }

  button:focus-visible,
  select:focus-visible,
  .entity-lead:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--aboc-accent), 0 0 0 2px color-mix(in srgb, var(--aboc-accent) 34%, transparent);
  }

  .empty,
  .warning {
    display: grid;
    place-items: center;
    gap: 8px;
    min-height: 116px;
    padding: 22px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  .warning {
    min-height: auto;
    padding: 10px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    color: var(--warning-color, #ff9800);
    font-size: 12px;
  }

  .debug {
    overflow: auto;
    margin: 0;
    padding: 10px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.16);
    direction: ltr;
    color: var(--secondary-text-color);
    font: 11px/1.4 monospace;
    text-align: left;
    white-space: pre-wrap;
  }

  @keyframes overview-expand {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes overview-spin {
    to { transform: rotate(360deg); }
  }

  @container overview-card (max-width: 430px) {
    .root {
      padding: 8px;
    }

    .area-summary {
      padding: 6px;
    }

    .area-summary-pill {
      min-height: 58px;
      padding-inline-end: 6px;
      gap: 4px;
    }

    .area-summary-pill .area-toggle,
    .area-summary-pill.compact-statuses .area-toggle {
      min-width: 120px;
      flex: 1 0 120px;
      gap: 5px;
    }

    .area-statuses {
      gap: 3px;
      max-width: calc(100% - 124px);
      flex: 0 1 auto;
      padding-block: 5px;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-inline: contain;
      scrollbar-width: none;
    }

    .area-statuses::-webkit-scrollbar {
      display: none;
    }

    .quick-actions {
      gap: 6px;
      flex: 0 0 auto;
      padding-block: 0;
      overflow: visible;
    }

    .area-summary-pill.compact-statuses .quick-actions {
      gap: 6px;
    }

    .quick-action {
      width: var(--aboc-quick-action-size);
      height: var(--aboc-quick-action-size);
      flex-basis: var(--aboc-quick-action-size);
    }

    .quick-action::before {
      inset: calc((var(--aboc-quick-action-size) - 44px) / 2);
    }

    .quick-action ha-icon {
      --mdc-icon-size: var(--aboc-quick-action-icon-size);
    }

    .quick-action .count-badge {
      inset-block-start: -2px;
      inset-inline-end: -2px;
    }

    .active-summary {
      display: none;
    }

    .area-name {
      font-size: min(var(--aboc-area-name-size), 14px);
    }

    .area-temperature {
      padding-inline: 10px;
      font-size: 13px;
    }

    .section-heading {
      padding-inline: 5px;
    }

    .expanded-content {
      padding-inline: 7px;
    }
  }

  @container overview-card (min-width: 341px) and (max-width: 430px) {
    .area-summary-pill.summary-load-5 .area-temperature {
      padding-inline: 5px;
    }
  }

  @container overview-card (max-width: 360px) {
    .subareas {
      margin-inline-start: 10px;
      padding-inline-start: 6px;
    }

    .subareas .subareas {
      margin-inline-start: 8px;
      padding-inline-start: 4px;
    }

    .subareas .subareas .subareas {
      margin-inline-start: 6px;
      padding-inline-start: 3px;
    }
    .area-summary {
      grid-template-columns: minmax(0, 1fr) 40px;
      gap: 3px;
    }

    .area-summary-pill {
      gap: 4px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill .summary-chip:not(.occupancy) {
      width: 40px;
      height: 40px;
      flex-basis: 40px;
    }

    .area-summary-pill .area-icon {
      width: 40px;
      height: 40px;
    }

    .area-summary-pill .occupancy {
      min-height: 40px;
      height: 40px;
      padding-inline: 7px;
    }
  }

  @container overview-card (max-width: 340px) {
    .area-summary-pill {
      display: flex;
      min-height: 52px;
      padding-block: 4px;
      padding-inline: 4px 5px;
      border-radius: 999px;
    }

    .area-summary-pill .area-toggle {
      width: auto;
      min-width: 112px;
      flex: 1 0 112px;
      gap: 4px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill.compact-statuses .area-icon {
      width: 36px;
      height: 36px;
    }

    .area-summary-pill .occupancy,
    .area-summary-pill.compact-statuses .occupancy {
      min-width: 36px;
      width: 36px;
      height: 36px;
      min-height: 36px;
      flex-basis: 36px;
      padding-inline: 4px;
      gap: 2px;
    }

    .area-summary-pill .occupancy ha-icon {
      --mdc-icon-size: 18px;
    }

    .area-summary-pill .occupancy-count {
      font-size: 12px;
    }

    .area-summary-pill .area-temperature,
    .area-summary-pill.compact-statuses .area-temperature {
      padding-inline: 5px;
      font-size: 12px;
    }

    .area-statuses {
      display: flex;
      min-width: 0;
      max-width: calc(100% - 116px);
      overflow-x: auto;
      overflow-y: hidden;
    }

    .quick-actions {
      width: max-content;
      min-width: 0;
      max-width: 100%;
      flex: 0 1 auto;
      flex-wrap: nowrap;
      overflow: visible;
    }

    .area-summary.without-expand-button .area-toggle {
      min-width: 112px;
      flex: 1 0 112px;
    }

    .area-summary.without-expand-button .area-statuses {
      max-width: calc(100% - 116px);
      flex: 0 1 auto;
    }

    .area-summary.without-expand-button .quick-actions {
      flex: 0 0 auto;
    }

    .climate-primary {
      grid-template-columns: minmax(0, 1fr);
    }

    .climate-primary .temperature-stepper,
    .climate-primary .current-temperature {
      grid-column: 1 / -1;
      width: 100%;
    }

    .temperature-range {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @container overview-card (max-width: 299px) {
    .section-lights_switches .section-entities,
    .section-floor_heating .section-entities {
      grid-template-columns: minmax(0, 1fr);
    }

    .climate-secondary,
    .thermostat-primary,
    .cover-card,
    .media-card {
      grid-template-columns: minmax(0, 1fr);
    }

    .thermostat-primary .temperature-stepper {
      width: 100%;
    }

    .cover-controls,
    .media-controls {
      justify-content: stretch;
    }

    .cover-controls > *,
    .media-controls > * {
      flex: 1 1 44px;
    }
  }

  @media (max-width: 480px) {
    .quick-action-dialog {
      width: calc(100vw - 12px);
      max-height: calc(100dvh - 12px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      margin-block: auto max(6px, env(safe-area-inset-bottom));
      margin-inline: auto;
    }

    .quick-popup {
      max-height: calc(100dvh - 12px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }

    .quick-popup-header {
      padding: 12px 10px 9px;
    }

    .quick-popup-group-actions {
      padding: 9px 10px;
    }

    .quick-popup-list {
      padding: 10px 10px max(14px, env(safe-area-inset-bottom));
    }

    .floor-room-list {
      padding: 10px 10px max(14px, env(safe-area-inset-bottom));
    }

    .floor-all-off {
      margin-inline: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .expanded-content,
    ha-icon[icon="mdi:loading"] {
      animation: none;
    }

    .chevron,
    .floor-chevron,
    .section-off-button,
    .section-on-button,
    .section-toggle-button,
    .quick-action,
    .quick-popup-close,
    .quick-popup-group-button,
    .quick-popup-entity-toggle,
    .control-button,
    .toggle-tile,
    .hold-target {
      transition: none;
    }
  }
`;
var Ya = Object.defineProperty, Xa = Object.getOwnPropertyDescriptor, F = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Xa(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ya(t, i, o), o;
};
const C = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
};
let I = class extends W {
  constructor() {
    super(...arguments), this.expanded = {}, this.floorExpanded = !0, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingSections = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.floorPopupOpen = !1, this.pendingFloor = !1, this.pendingFloorRooms = /* @__PURE__ */ new Set(), this.storageId = "overview", this.suppressClickUntil = 0, this.restoreQuickPopupFocus = !0;
  }
  static getConfigElement() {
    return document.createElement(Ut);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    this.resetQuickPopup(), this.resetFloorPopup();
    try {
      Ca(e), this.config = fe(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.floorExpanded = this.config.remember_expanded_state ? this.readFloorExpanded() ?? this.config.floor_default_expanded : this.config.floor_default_expanded, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = De(this.hass, this.config);
    if (e.targetKind === "floor" && this.config.show_header && this.config.show_floor_header && !this.floorExpanded) return 2;
    const t = Ga(e.areas, (i) => this.isExpanded(i));
    return Math.max(
      2,
      t.reduce(
        (i, a) => i + 2 + (this.isExpanded(a) ? a.sections.reduce((o, r) => o + r.entities.length, 0) : 0),
        e.targetKind === "floor" ? 1 : 0
      )
    );
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.cancelHold(), this.resetQuickPopup(), this.resetFloorPopup();
  }
  render() {
    if (this.error) return p`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return b;
    const e = Ia(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = De(this.hass, this.config), i = `overview-floor-${this.storageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`, a = t.targetKind === "floor" && this.config.show_header && this.config.show_floor_header;
    return p`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t, i)}
          ${t.targetKind === "none" ? this.renderEmpty(O(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : p`
                <div id=${i} ?hidden=${a && !this.floorExpanded}>
                  ${t.areas.length ? this.renderAreaHierarchy(t.areas) : this.renderEmpty(O(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
                </div>
              `}
          ${t.warnings.length && t.targetKind !== "none" ? p`<div class="warning">${t.warnings.join(" · ")}</div>` : b}
          ${this.config.debug ? p`<pre class="debug">${JSON.stringify(t, null, 2)}</pre>` : b}
        </div>
      </ha-card>
      ${this.renderQuickActionPopup(t)}
      ${this.renderFloorPopup(t)}
    `;
  }
  renderOverallHeader(e, t) {
    var a;
    if (!((a = this.config) != null && a.show_header) || !(e.targetKind === "floor" ? this.config.show_floor_header : !!this.config.title) || !e.targetName) return b;
    if (e.targetKind === "floor") {
      const o = e.areas.filter((c) => c.allEntities.some(Te)), r = e.areas.filter((c) => c.occupancy === "occupied").length, n = [
        `${e.areas.length} ${this.localText("אזורים", "areas")}`,
        o.length ? `${o.length} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && r ? `${r} ${this.localText("מאוכלסים", "occupied")}` : ""
      ].filter(Boolean).join(" · "), s = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${e.targetName}`;
      return p`
        <div class="overview-heading floor-heading ${o.length ? "has-active" : "all-off"}" data-powered=${o.length ? "true" : "false"}>
          <div class="floor-summary-pill">
            <button class="floor-toggle" type="button" aria-expanded=${this.floorExpanded} aria-controls=${t} aria-label=${s} @click=${() => this.toggleFloor()}>
              <span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span>
              <span class="heading-main"><span class="floor-title">${e.targetName}</span><span class="subtitle">${n}</span></span>
              <span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
            </button>
            ${o.length ? p`<button
                  class="floor-active-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${this.floorPopupOpen}
                  aria-label=${`${this.localText("פתיחת חדרים פעילים", "Open active rooms")}: ${o.length}`}
                  @click=${(c) => this.openFloorPopup(c)}
                ><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><span>${o.length}</span></button>` : b}
          </div>
        </div>
      `;
    }
    return p`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span><div class="heading-main"><h2>${e.targetName}</h2></div></div>`;
  }
  renderAreaHierarchy(e) {
    const { roots: t, children: i } = oi(e), a = /* @__PURE__ */ new Set(), o = (r) => {
      if (a.has(r.id)) return b;
      a.add(r.id);
      const n = i.get(r.id) ?? [], c = this.isExpanded(r) ? n : n.filter((m) => m.showWhenParentCollapsed), u = c.length ? p`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${r.name}`}>${c.map(o)}</div>` : b;
      return p`
        <div class="area-tree-node">
          ${this.renderArea(r, u)}
        </div>
      `;
    };
    return p`<div class="areas">${t.map(o)}</div>`;
  }
  renderArea(e, t = b) {
    var _;
    if (!this.config) return b;
    const i = this.isExpanded(e), a = e.allEntities.filter(Te).length, o = this.config.show_quick_actions ? ya(e, this.config.quick_actions) : [], r = this.config.show_occupancy && e.occupancy !== "none", n = this.config.show_temperature && e.temperature !== void 0, s = n ? o.find(({ action: v }) => v === "climate") : void 0, c = s ? o.filter(({ action: v }) => v !== "climate") : o, u = (s == null ? void 0 : s.entities.filter((v) => v.powered).length) ?? 0, m = n ? this.formatTemperature(e.temperature, e.temperatureUnit) : "", h = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active")
    }[e.temperatureMode], d = Math.min(8, c.length + Number(r) + Number(n) * 2), f = d >= 5, y = e.id.replace(/[^a-zA-Z0-9_-]/g, "-"), x = `overview-area-${y}`, l = `overview-area-name-${y}`, g = `${O(this.hass, this.config, i ? "collapse" : "expand")}: ${e.name}`;
    return p`
      <section
        class="area-panel ${a ? "has-active" : "all-off"} ${i ? "expanded" : ""}"
        data-powered=${a ? "true" : "false"}
        aria-labelledby=${l}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div class="area-summary-pill summary-load-${d} ${f ? "compact-statuses" : ""}">
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${i}
              aria-controls=${x}
              aria-label=${g}
              @click=${() => this.toggleArea(e)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name" id=${l}>${e.name}</span>
                ${a ? p`<span class="active-summary">${a} ${this.localText("פעילים", "active")}</span>` : b}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(e)}
              ${c.length ? this.renderQuickActions(e, c) : b}
              ${n ? p`<span class="temperature area-temperature temperature-${e.temperatureMode}" title=${`${m} · ${h}`} aria-label=${`${m} · ${h}`}>${m}</span>` : b}
              ${s ? p`<button
                    class="temperature-climate-tag temperature-${e.temperatureMode}"
                    type="button"
                    title=${`${u} ${this.localText("מזגנים פעילים", "active climate devices")}`}
                    aria-label=${`${this.localText("פתיחת מיזוג אוויר", "Open climate controls")}: ${e.name} (${u}/${s.entities.length})`}
                    aria-haspopup="dialog"
                    aria-expanded=${((_ = this.quickPopup) == null ? void 0 : _.areaId) === e.id && this.quickPopup.action === "climate"}
                    aria-busy=${this.quickActionPending(e.id, "climate")}
                    ?disabled=${this.quickActionPending(e.id, "climate")}
                    @click=${(v) => this.openQuickActionPopup(v, e, "climate")}
                  >
                    <ha-icon icon=${this.config.quick_action_icons.climate}></ha-icon>
                  </button>` : b}
            </div>
          </div>
          ${this.config.show_area_expand_button ? p`<button
                class="expand-button"
                type="button"
                aria-expanded=${i}
                aria-controls=${x}
                aria-label=${g}
                @click=${() => this.toggleArea(e)}
              ><span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span></button>` : b}
        </header>
        <div class="area-disclosure" id=${x} ?hidden=${!i}>
          <div class="expanded-content">${e.sections.map((v) => this.renderSection(v, e))}</div>
          ${i ? t : b}
        </div>
        ${i ? b : t}
      </section>
    `;
  }
  renderOccupancy(e) {
    var n;
    if (!((n = this.config) != null && n.show_occupancy) || e.occupancy === "none") return b;
    const t = e.occupancy === "occupied", i = e.occupancyCount === void 0 ? "?" : e.occupancyCount > 9 ? "9+" : String(e.occupancyCount), a = t ? "mdi:account-multiple" : e.occupancy === "vacant" ? "mdi:account-multiple-outline" : "mdi:account-question-outline", o = O(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown"), r = e.occupancyCount === void 0 ? o : e.occupancyCountSource === "entity" ? `${e.name}: ${e.occupancyCount} ${this.localText("נוכחים", "occupants")}` : `${e.name}: ${e.occupancyCount} ${this.localText("חיישני נוכחות פעילים", "active presence sensors")}`;
    return p`
      <span class="summary-chip occupancy ${t ? "occupied" : e.occupancy === "unknown" ? "unknown" : "vacant"}" title=${r} aria-label=${r}>
        <ha-icon icon=${a}></ha-icon>
        <span class="occupancy-count" aria-hidden="true">${i}</span>
        <span class="occupancy-label">${r}</span>
      </span>
    `;
  }
  renderQuickActions(e, t) {
    return this.config ? p`
      <div class="quick-actions" role="group" aria-label=${`${this.localText("פעולות מהירות", "Quick actions")}: ${e.name}`}>
        ${t.map(({ action: i, entities: a }) => {
      var u;
      const o = a.filter((m) => m.powered).length, r = this.quickActionPending(e.id, i) || a.some((m) => this.pendingEntities.has(m.entityId)), n = Ct(this.hass, this.config, i), s = `${this.localText("פתיחת", "Open")} ${n}: ${e.name} (${o}/${a.length})`, c = ((u = this.quickPopup) == null ? void 0 : u.areaId) === e.id && this.quickPopup.action === i;
      return p`
            <button
              class="quick-action ${o ? "active" : "inactive"}"
              type="button"
              title=${s}
              aria-label=${s}
              aria-haspopup="dialog"
              aria-expanded=${c}
              aria-busy=${r}
              ?disabled=${r}
              @click=${(m) => this.openQuickActionPopup(m, e, i)}
            >
              <ha-icon icon=${r ? "mdi:loading" : this.config.quick_action_icons[i]}></ha-icon>
              ${o ? p`<span class="count-badge">${o}</span>` : b}
            </button>
          `;
    })}
      </div>
    ` : b;
  }
  renderSection(e, t) {
    var E, $, T, S, z;
    const i = t.id, a = `overview-section-${e.id}-${i.replace(/[^a-zA-Z0-9_-]/g, "-")}`, o = Ge(e, !0), r = Ge(e, !1), n = this.pendingSections.has(`${i}:${e.id}:on`), s = this.pendingSections.has(`${i}:${e.id}:off`), c = n || s || e.entities.some((k) => this.pendingEntities.has(k.entityId)), u = e.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on"), m = e.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off"), h = `${u}: ${e.title} (${o.length})`, d = `${m}: ${e.title} (${r.length})`, f = ((E = this.config) == null ? void 0 : E.area_overrides[t.id]) ?? (($ = this.config) == null ? void 0 : $.area_overrides[t.name]), y = { ...((T = this.config) == null ? void 0 : T.section_styles[e.id]) ?? {}, ...((S = f == null ? void 0 : f.section_styles) == null ? void 0 : S[e.id]) ?? {} }, x = [
      `--aboc-section-background:${y.background || "transparent"}`,
      `--aboc-section-border-color:${y.border_color || "color-mix(in srgb, var(--divider-color) 58%, transparent)"}`
    ].join(";"), l = r.length === 0, g = l ? o : r, _ = l ? n : s, v = l ? h : d;
    return p`
      <section class="device-section section-${e.id} ${y.show_border ? "section-framed" : ""}" style=${x} aria-labelledby=${a}>
        <h3 class="section-heading" id=${a}>
          <span class="section-heading-main"><ha-icon icon=${e.icon}></ha-icon><span class="section-title" title=${e.title}>${e.title}</span><span class="section-count">${e.activeCount}/${e.entities.length}</span></span>
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${e.title}`}>
            ${((z = this.config) == null ? void 0 : z.section_action_mode) === "toggle" ? p`<button
                  class="section-toggle-button ${l ? "turn-on" : "turn-off"}"
                  type="button"
                  title=${v}
                  aria-label=${v}
                  aria-busy=${_}
                  ?disabled=${c || g.length === 0}
                  @click=${(k) => this.handleSectionAction(k, e, i, l)}
                ><ha-icon icon=${_ ? "mdi:loading" : this.sectionActionIcon(e.id, l)}></ha-icon></button>` : p`
                  <button
                    class="section-on-button"
                    type="button"
                    title=${h}
                    aria-label=${h}
                    aria-busy=${n}
                    ?disabled=${c || o.length === 0}
                    @click=${(k) => this.handleSectionAction(k, e, i, !0)}
                  ><ha-icon icon=${n ? "mdi:loading" : this.sectionActionIcon(e.id, !0)}></ha-icon></button>
                  <button
                    class="section-off-button"
                    type="button"
                    title=${d}
                    aria-label=${d}
                    aria-busy=${s}
                    ?disabled=${c || r.length === 0}
                    @click=${(k) => this.handleSectionAction(k, e, i, !1)}
                  ><ha-icon icon=${s ? "mdi:loading" : this.sectionActionIcon(e.id, !1)}></ha-icon></button>
                `}
          </span>
        </h3>
        ${this.renderSectionEntities(e)}
      </section>
    `;
  }
  renderSectionEntities(e) {
    if (!e.entities.length)
      return p`<div class="section-entities"><div class="secondary section-empty">${this.config && Y(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div></div>`;
    const t = e.entities.filter((a) => !a.group), i = /* @__PURE__ */ new Map();
    for (const a of e.entities) {
      if (!a.group) continue;
      const o = i.get(a.group) ?? [];
      o.push(a), i.set(a.group, o);
    }
    return p`
      ${t.length ? p`<div class="section-entities">${t.map((a) => this.renderEntity(a, e.id))}</div>` : b}
      ${[...i.entries()].map(([a, o]) => p`
        <section class="entity-subgroup" aria-label=${a}>
          <div class="entity-subgroup-heading"><ha-icon icon="mdi:folder-home-outline"></ha-icon><span>${a}</span><small>${o.filter((r) => r.powered).length}/${o.length}</small></div>
          <div class="section-entities">${o.map((r) => this.renderEntity(r, e.id))}</div>
        </section>
      `)}
    `;
  }
  sectionActionIcon(e, t) {
    return this.config ? e === "covers" ? t ? this.config.section_action_icons.open : this.config.section_action_icons.close : t ? this.config.section_action_icons.on : this.config.section_action_icons.off : t ? "mdi:play-circle-outline" : "mdi:stop-circle-outline";
  }
  renderQuickActionPopup(e) {
    if (!this.config || !this.quickPopup) return b;
    const t = e.areas.find((g) => {
      var _;
      return g.id === ((_ = this.quickPopup) == null ? void 0 : _.areaId);
    });
    if (!t)
      return queueMicrotask(() => this.resetQuickPopup()), b;
    const i = this.quickPopup.action, a = Me(t, i);
    if (!a.length)
      return queueMicrotask(() => this.resetQuickPopup()), b;
    const o = Ct(this.hass, this.config, i), r = a.filter((g) => g.powered).length, n = Je(t, i, !0), s = Je(t, i, !1), c = this.pendingActions.has(`${t.id}:${i}:on`), u = this.pendingActions.has(`${t.id}:${i}:off`), m = c || u, h = a.some((g) => this.pendingEntities.has(g.entityId)), d = m || h, y = `overview-quick-popup-title-${`${t.id}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "-")}`, x = i === "covers" ? this.localText("פתיחת הכל", "Open all") : this.localText("הפעלת הכל", "Turn all on"), l = i === "covers" ? this.localText("סגירת הכל", "Close all") : this.localText("כיבוי הכל", "Turn all off");
    return p`
      <dialog
        class="quick-action-dialog area-quick-action-dialog"
        aria-modal="true"
        aria-labelledby=${y}
        @cancel=${(g) => this.handleQuickPopupCancel(g)}
        @close=${() => this.handleQuickPopupClosed()}
        @click=${(g) => this.handleQuickPopupBackdrop(g)}
        @keydown=${(g) => this.handleQuickPopupKeydown(g)}
      >
        <section class="quick-popup" aria-busy=${d}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${this.config.quick_action_icons[i]}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${y}>${o} · ${t.name}</span>
              <span class="quick-popup-summary">${r} ${this.localText("דלוקים מתוך", "on of")} ${a.length}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeQuickActionPopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="quick-popup-group-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${o}`}>
            <button
              class="quick-popup-group-button turn-on"
              type="button"
              aria-label=${`${x}: ${o} (${n.length})`}
              aria-busy=${c}
              ?disabled=${d || n.length === 0}
              @click=${(g) => this.handleQuickPopupGroupAction(g, t, i, !0)}
            ><ha-icon icon=${c ? "mdi:loading" : i === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${x}</span><small>${n.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${l}: ${o} (${s.length})`}
              aria-busy=${u}
              ?disabled=${d || s.length === 0}
              @click=${(g) => this.handleQuickPopupGroupAction(g, t, i, !1)}
            ><ha-icon icon=${u ? "mdi:loading" : i === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon><span>${l}</span><small>${s.length}</small></button>
          </div>
          <div class="quick-popup-list" role="list" aria-label=${o}>
            ${a.map((g) => this.renderQuickPopupEntity(g, i, m))}
          </div>
        </section>
      </dialog>
    `;
  }
  renderFloorPopup(e) {
    if (!this.config || !this.floorPopupOpen || e.targetKind !== "floor") return b;
    const t = e.areas.filter((o) => o.allEntities.some(Te));
    if (!t.length)
      return queueMicrotask(() => this.resetFloorPopup()), b;
    const i = t.flatMap((o) => Oe(o, !1)), a = "overview-floor-popup-title";
    return p`
      <dialog
        class="quick-action-dialog floor-action-dialog"
        aria-modal="true"
        aria-labelledby=${a}
        @cancel=${(o) => {
      o.preventDefault(), this.closeFloorPopup();
    }}
        @close=${() => this.handleFloorPopupClosed()}
        @click=${(o) => {
      o.target === o.currentTarget && this.closeFloorPopup();
    }}
      >
        <section class="quick-popup floor-popup" aria-busy=${this.pendingFloor || this.pendingFloorRooms.size > 0}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${e.targetIcon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${a}>${this.localText("חדרים פעילים", "Active rooms")} · ${e.targetName}</span>
              <span class="quick-popup-summary">${t.length} ${this.localText("חדרים דלוקים", "rooms on")}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeFloorPopup()}><ha-icon icon="mdi:close"></ha-icon></button>
          </header>
          <button
            class="floor-all-off"
            type="button"
            aria-label=${`${this.localText("כיבוי כל החדרים", "Turn off all rooms")} (${i.length})`}
            aria-busy=${this.pendingFloor}
            ?disabled=${this.pendingFloor || this.pendingFloorRooms.size > 0 || i.length === 0}
            @click=${(o) => this.handleFloorAllOff(o, t)}
          ><ha-icon icon=${this.pendingFloor ? "mdi:loading" : this.config.section_action_icons.off}></ha-icon><span>${this.localText("כיבוי כל החדרים", "Turn off all rooms")}</span><small>${i.length}</small></button>
          <div class="floor-room-list" role="list">
            ${t.map((o) => {
      const r = Oe(o, !1), n = this.pendingFloor || this.pendingFloorRooms.has(o.id) || r.some((s) => this.pendingEntities.has(s.entityId));
      return p`
                <article class="floor-room-row" role="listitem">
                  <span class="icon-bubble small"><ha-icon icon=${o.icon}></ha-icon></span>
                  <span class="floor-room-main"><strong>${o.name}</strong><small>${o.allEntities.filter(Te).length} ${this.localText("פעילים", "active")}</small></span>
                  <button
                    class="floor-room-off"
                    type="button"
                    aria-label=${`${this.localText("כיבוי חדר", "Turn off room")}: ${o.name} (${r.length})`}
                    aria-busy=${this.pendingFloorRooms.has(o.id)}
                    ?disabled=${n || r.length === 0}
                    @click=${(s) => this.handleFloorRoomOff(s, o)}
                  ><ha-icon icon=${this.pendingFloorRooms.has(o.id) ? "mdi:loading" : this.config.section_action_icons.off}></ha-icon></button>
                </article>
              `;
    })}
          </div>
        </section>
      </dialog>
    `;
  }
  renderQuickPopupEntity(e, t, i) {
    const a = this.entityBusy(e), o = !e.powered, r = et(t, e, o), n = !e.available || a || i || !r, s = t === "covers" ? o ? this.localText("פתיחה", "Open") : this.localText("סגירה", "Close") : o ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off"), c = e.available ? r ? "" : this.localText("אין פעולת שליטה נתמכת", "No supported control action") : O(this.hass, this.config, "unavailable");
    return p`
      <article class="quick-popup-entity ${e.powered ? "active" : "inactive"} ${e.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(u) => this.startHold(u, e)}
          @pointermove=${(u) => this.moveHold(u)}
          @pointerup=${(u) => this.finishHold(u)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(u) => this.handleMoreInfoClick(u, e)}
        >
          <span class="icon-bubble small"><ha-icon icon=${e.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${e.name}</span>
            <span class="state-text">${this.entitySecondary(e)}${e.protected ? ` · ${this.localText("מוגן מקבוצה", "group protected")}` : ""}</span>
          </span>
        </button>
        <button
          class="quick-popup-entity-toggle ${e.powered ? "active" : ""}"
          type="button"
          aria-pressed=${e.powered}
          aria-busy=${a}
          aria-label=${c || `${s}: ${e.name}`}
          title=${c || `${s}: ${e.name}`}
          ?disabled=${n}
          @click=${(u) => this.handleQuickPopupEntityAction(u, e, t)}
        ><ha-icon icon=${a ? "mdi:loading" : t === "covers" ? o ? "mdi:arrow-up" : "mdi:arrow-down" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderEntity(e, t) {
    return t === "floor_heating" ? this.renderFloorHeating(e) : e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : va(e) ? this.renderLight(e) : this.renderToggle(e);
  }
  renderEntityLead(e) {
    return p`
      <button
        class="entity-lead hold-target"
        type="button"
        title=${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}
        @pointerdown=${(t) => this.startHold(t, e)}
        @pointermove=${(t) => this.moveHold(t)}
        @pointerup=${(t) => this.finishHold(t)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(t) => this.handleMoreInfoClick(t, e)}
      >
        <span class="icon-bubble small"><ha-icon icon=${e.icon}></ha-icon></span>
        <span class="entity-main">
          <span class="entity-name">${e.name}</span>
          <span class="state-text">${this.entitySecondary(e)}</span>
        </span>
      </button>
    `;
  }
  renderToggle(e) {
    const t = this.entityBusy(e), i = J(e, !e.powered), a = !e.available || t || !i;
    return p`
      <button
        class="toggle-tile entity-card hold-target ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${e.powered}
        aria-busy=${t}
        aria-disabled=${a}
        aria-label=${`${e.name}: ${this.entitySecondary(e)}. ${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}`}
        title=${`${e.active ? O(this.hass, this.config, "turn_off") : O(this.hass, this.config, "on")} · ${this.localText("לחיצה ארוכה לפרטים", "hold for details")}`}
        @pointerdown=${(o) => this.startHold(o, e)}
        @pointermove=${(o) => this.moveHold(o)}
        @pointerup=${(o) => this.finishHold(o)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(o) => this.handleToggleClick(o, e)}
      >
        <span class="icon-bubble small"><ha-icon icon=${t ? "mdi:loading" : e.icon}></ha-icon></span>
        <span class="entity-main">
          <span class="entity-name">${e.name}</span>
          <span class="state-text">${this.entitySecondary(e)}</span>
        </span>
      </button>
    `;
  }
  renderClimate(e) {
    const t = C(e, "current_temperature"), i = C(e, "target_temp_step") ?? 0.5, a = M(e.entity, ee.TARGET_TEMPERATURE) ? C(e, "temperature") : void 0, o = M(e.entity, ee.TARGET_TEMPERATURE_RANGE) ? C(e, "target_temp_low") : void 0, r = M(e.entity, ee.TARGET_TEMPERATURE_RANGE) ? C(e, "target_temp_high") : void 0, n = o !== void 0 && r !== void 0, s = Gt(e), c = M(e.entity, ee.FAN_MODE) && Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], u = this.entityBusy(e), m = this.climateModeIcon(e.entity.state);
    return p`
      <article class="climate-card entity-card full-span mode-${e.entity.state} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${u}>
        <div class="climate-primary">
          ${this.renderEntityLead(e)}
          ${!n && a !== void 0 ? p`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${u || !e.available} @click=${() => this.setClimateTemperature(e, a - i)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                  <span>${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>
                  <button type="button" ?disabled=${u || !e.available} @click=${() => this.setClimateTemperature(e, a + i)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
                </span>
              ` : t !== void 0 ? p`<span class="temperature current-temperature">${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>` : b}
        </div>
        ${n ? this.renderClimateRange(e, o, r, i, u) : b}
        ${s.length || c.length ? p`<div class="climate-secondary" @click=${(h) => h.stopPropagation()}>
          ${s.length ? p`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${e.name}`}
                .value=${e.entity.state}
                .disabled=${u || !e.available}
                .options=${s.map((h) => ({ value: h, label: this.climateModeLabel(h), icon: this.climateModeIcon(h) }))}
                @wa-select=${(h) => this.setClimateMode(e, h)}
              ><ha-icon slot="icon" icon=${m}></ha-icon></ha-control-select-menu>` : b}
          ${c.length ? p`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${e.name}`}
                .value=${String(e.entity.attributes.fan_mode ?? "")}
                .disabled=${u || !e.available}
                .options=${c.map((h) => ({ value: h, label: this.modeLabel(h), icon: "mdi:fan" }))}
                @wa-select=${(h) => this.setFanMode(e, h)}
              ><ha-icon slot="icon" icon="mdi:fan"></ha-icon></ha-control-select-menu>` : b}
          </div>` : b}
      </article>
    `;
  }
  renderLight(e) {
    var r;
    const t = this.entityBusy(e), i = At(e), a = J(e, !e.powered), o = `${this.localText("בהירות", "Brightness")}: ${e.name}`;
    return p`
      <article class="light-card entity-card ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        <div class="light-primary">
          ${this.renderEntityLead(e)}
          <button
            class="light-power ${e.powered ? "active" : ""}"
            type="button"
            aria-pressed=${e.powered}
            aria-label=${`${e.powered ? O(this.hass, this.config, "turn_off") : O(this.hass, this.config, "on")}: ${e.name}`}
            ?disabled=${t || !e.available || !a}
            @click=${(n) => this.toggleEntity(n, e)}
          ><ha-icon icon=${t ? "mdi:loading" : "mdi:power"}></ha-icon></button>
        </div>
        <div class="brightness-control" @click=${(n) => n.stopPropagation()}>
          <ha-control-slider
            class="brightness-slider"
            .value=${i}
            .min=${0}
            .max=${100}
            .step=${1}
            .disabled=${t || !e.available}
            .locale=${(r = this.hass) == null ? void 0 : r.locale}
            .label=${o}
            unit="%"
            show-handle
            tooltip-mode="interaction"
            @value-changed=${(n) => this.setLightBrightness(e, n)}
          ></ha-control-slider>
          <span class="brightness-value" aria-hidden="true">${i}%</span>
        </div>
      </article>
    `;
  }
  renderClimateRange(e, t, i, a, o) {
    return p`
      <div class="temperature-range" role="group" aria-label=${`${this.localText("טווח טמפרטורה", "Temperature range")}: ${e.name}`}>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateRange(e, t - a, i, "low")} aria-label=${`${this.localText("הורדת סף תחתון", "Decrease low target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("נמוך", "Low")}</small>${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateRange(e, t + a, i, "low")} aria-label=${`${this.localText("העלאת סף תחתון", "Increase low target")}: ${e.name}`}>+</button>
        </span>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateRange(e, t, i - a, "high")} aria-label=${`${this.localText("הורדת סף עליון", "Decrease high target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("גבוה", "High")}</small>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateRange(e, t, i + a, "high")} aria-label=${`${this.localText("העלאת סף עליון", "Increase high target")}: ${e.name}`}>+</button>
        </span>
      </div>
    `;
  }
  renderFloorHeating(e) {
    const t = e.domain === "water_heater" ? Bt.TARGET_TEMPERATURE : ee.TARGET_TEMPERATURE, i = M(e.entity, t) ? C(e, "temperature") : void 0, a = C(e, "current_temperature");
    if (i === void 0 && a === void 0) return this.renderToggle(e);
    const o = C(e, "target_temp_step") ?? 0.5, r = this.entityBusy(e), n = J(e, !e.powered);
    return p`
      <article class="thermostat-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${r}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(e)}
          ${i !== void 0 ? p`<span class="temperature-stepper">
                <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateTemperature(e, i - o)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                <span>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
                <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateTemperature(e, i + o)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
              </span>` : p`<span class="temperature current-temperature">${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>`}
        </div>
        <button
          class="thermostat-power ${e.powered ? "active" : ""}"
          type="button"
          aria-pressed=${e.powered}
          aria-label=${`${e.powered ? O(this.hass, this.config, "turn_off") : O(this.hass, this.config, "on")}: ${e.name}`}
          ?disabled=${r || !e.available || !n}
          @click=${(s) => this.toggleEntity(s, e)}
        ><ha-icon icon=${r ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderCover(e) {
    const t = this.entityBusy(e), i = C(e, "supported_features"), a = C(e, "current_position"), o = e.entity.state, r = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 }
    ].filter(({ feature: s }) => i === void 0 || (i & s) !== 0), n = (s) => s === "open_cover" ? o === "open" || a !== void 0 && a >= 100 : s === "close_cover" ? o === "closed" || a !== void 0 && a <= 0 : s === "stop_cover" && !["opening", "closing"].includes(o);
    return p`
      <article class="cover-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${e.name}`}>
          ${r.map(({ service: s, icon: c }) => p`
            <button
              class="cover-control"
              type="button"
              ?disabled=${!e.available || t || n(s)}
              @click=${(u) => this.runEntityService(u, e, s)}
              aria-label=${`${this.coverServiceLabel(s)}: ${e.name}`}
            ><ha-icon icon=${c}></ha-icon></button>
          `)}
        </span>
      </article>
    `;
  }
  renderMedia(e) {
    const t = this.entityBusy(e), i = e.entity.state === "playing", a = C(e, "volume_level"), o = a !== void 0 && M(e.entity, _e.VOLUME_SET), r = M(e.entity, i ? _e.PAUSE : _e.PLAY), n = J(e, !e.powered);
    return p`
      <article class="media-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${o ? p`
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${e.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(a * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${e.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : b}
          ${r ? p`<button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(s) => this.runEntityService(s, e, i ? "media_pause" : "media_play")} aria-label=${`${this.localText(i ? "השהיה" : "ניגון", i ? "Pause" : "Play")}: ${e.name}`}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>` : b}
          ${n ? p`<button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.toggleEntity(s, e)} aria-label=${`${e.powered ? O(this.hass, this.config, "turn_off") : O(this.hass, this.config, "on")}: ${e.name}`}><ha-icon icon="mdi:power"></ha-icon></button>` : b}
        </div>
      </article>
    `;
  }
  entitySecondary(e) {
    var t, i;
    if (!e.available) return O(this.hass, this.config, "unavailable");
    if (e.domain === "climate") {
      const a = C(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const a = C(e, "current_position");
      return a !== void 0 ? `${e.entity.state} · ${Math.round(a)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const a = C(e, "brightness");
      return a !== void 0 && e.active ? `${O(this.hass, this.config, "on")} · ${Math.round(a / 255 * 100)}%` : e.entity.state;
    }
    if (e.domain === "media_player")
      return String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state);
    if (e.section === "floor_heating") {
      const a = C(e, "current_temperature");
      return [e.entity.state, a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    return ((i = (t = this.hass) == null ? void 0 : t.formatEntityState) == null ? void 0 : i.call(t, e.entity)) ?? e.entity.state;
  }
  climateModeIcon(e) {
    return e === "cool" ? "mdi:snowflake" : e === "heat" ? "mdi:fire" : e === "dry" ? "mdi:water-percent" : e === "fan_only" ? "mdi:fan" : e === "heat_cool" || e === "auto" ? "mdi:autorenew" : "mdi:power";
  }
  climateModeLabel(e) {
    const i = {
      off: ["כבוי", "Off"],
      auto: ["אוטומטי", "Auto"],
      cool: ["קירור", "Cool"],
      heat: ["חימום", "Heat"],
      dry: ["ייבוש", "Dry"],
      fan_only: ["מאוורר בלבד", "Fan only"],
      heat_cool: ["חימום וקירור", "Heat/Cool"]
    }[e];
    return i ? this.localText(i[0], i[1]) : this.modeLabel(e);
  }
  modeLabel(e) {
    return e.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
  }
  coverServiceLabel(e) {
    return e === "open_cover" ? this.localText("פתיחה", "Open") : e === "stop_cover" ? this.localText("עצירה", "Stop") : this.localText("סגירה", "Close");
  }
  localText(e, t) {
    return this.config && Y(this.hass, this.config) === "he" ? e : t;
  }
  areaTemperatureUnit(e) {
    var t, i, a;
    return String(e.entity.attributes.temperature_unit ?? ((a = (i = (t = this.hass) == null ? void 0 : t.config) == null ? void 0 : i.unit_system) == null ? void 0 : a.temperature) ?? "°C");
  }
  formatTemperature(e, t = "°C") {
    const i = this.config && Y(this.hass, this.config) === "he" ? "he-IL" : void 0;
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: 1 }).format(e)} ${t}`;
  }
  renderEmpty(e, t) {
    return p`<div class="empty"><ha-icon icon=${t}></ha-icon><span>${e}</span></div>`;
  }
  isExpanded(e) {
    var i, a, o;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? ((o = this.config) == null ? void 0 : o.default_expanded) ?? !1;
  }
  toggleArea(e) {
    var t;
    this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, (t = this.config) != null && t.remember_expanded_state && this.writeExpanded(), this.updateComplete.then(() => this.dispatchEvent(new Event("iron-resize", { bubbles: !0, composed: !0 })));
  }
  toggleFloor() {
    var e;
    this.floorExpanded = !this.floorExpanded, (e = this.config) != null && e.remember_expanded_state && this.writeFloorExpanded(), this.updateComplete.then(() => this.dispatchEvent(new Event("iron-resize", { bubbles: !0, composed: !0 })));
  }
  startHold(e, t) {
    e.button === 0 && (this.cancelHold(), this.holdPointerId = e.pointerId, this.holdEntityId = t.entityId, this.holdStart = { x: e.clientX, y: e.clientY }, this.holdTarget = e.currentTarget, this.holdTarget.classList.add("holding"), this.holdTimer = window.setTimeout(() => {
      var i, a;
      if (this.holdEntityId === t.entityId) {
        this.holdTimer = void 0, this.suppressClickEntityId = t.entityId, this.suppressClickUntil = Date.now() + 1500, (i = this.holdTarget) == null || i.classList.remove("holding"), this.showMoreInfo(t);
        try {
          (a = navigator.vibrate) == null || a.call(navigator, 18);
        } catch {
        }
      }
    }, 500));
  }
  moveHold(e) {
    e.pointerId !== this.holdPointerId || !this.holdStart || Math.hypot(e.clientX - this.holdStart.x, e.clientY - this.holdStart.y) > 8 && this.cancelHold();
  }
  finishHold(e) {
    e.pointerId === this.holdPointerId && this.clearHoldTracking();
  }
  cancelHold() {
    this.clearHoldTracking();
  }
  clearHoldTracking() {
    var e;
    this.holdTimer !== void 0 && window.clearTimeout(this.holdTimer), (e = this.holdTarget) == null || e.classList.remove("holding"), this.holdTimer = void 0, this.holdPointerId = void 0, this.holdEntityId = void 0, this.holdStart = void 0, this.holdTarget = void 0;
  }
  consumeHeldClick(e, t) {
    const i = this.suppressClickEntityId === t.entityId && Date.now() <= this.suppressClickUntil;
    return this.suppressClickEntityId = void 0, this.suppressClickUntil = 0, i ? (e.preventDefault(), e.stopPropagation(), !0) : !1;
  }
  handleMoreInfoClick(e, t) {
    e.stopPropagation(), this.consumeHeldClick(e, t) || this.showMoreInfo(t);
  }
  handleToggleClick(e, t) {
    if (!this.consumeHeldClick(e, t)) {
      if (!t.available || this.entityBusy(t) || !J(t, !t.powered)) {
        e.preventDefault(), e.stopPropagation();
        return;
      }
      this.toggleEntity(e, t);
    }
  }
  quickActionPending(e, t) {
    return this.pendingActions.has(`${e}:${t}:on`) || this.pendingActions.has(`${e}:${t}:off`);
  }
  openFloorPopup(e) {
    e.stopPropagation(), this.resetQuickPopup(), this.floorPopupTrigger = e.currentTarget, this.floorPopupOpen = !0, this.updateComplete.then(() => {
      const t = this.renderRoot.querySelector(".floor-action-dialog");
      !t || t.open || !t.isConnected || (typeof t.showModal == "function" ? t.showModal() : t.setAttribute("open", ""));
    });
  }
  closeFloorPopup() {
    const e = this.renderRoot.querySelector(".floor-action-dialog");
    e != null && e.open && typeof e.close == "function" ? e.close() : this.handleFloorPopupClosed();
  }
  handleFloorPopupClosed() {
    this.floorPopupOpen = !1;
    const e = this.floorPopupTrigger;
    this.floorPopupTrigger = void 0, this.updateComplete.then(() => {
      e != null && e.isConnected && e.focus();
    });
  }
  resetFloorPopup() {
    var t;
    const e = (t = this.renderRoot) == null ? void 0 : t.querySelector(".floor-action-dialog");
    e != null && e.open && typeof e.close == "function" && e.close(), this.floorPopupOpen = !1, this.floorPopupTrigger = void 0;
  }
  async handleFloorRoomOff(e, t) {
    if (e.stopPropagation(), !this.hass || this.pendingFloor || this.pendingFloorRooms.has(t.id)) return;
    const i = Oe(t, !1);
    if (!(!i.length || i.some((a) => this.pendingEntities.has(a.entityId)))) {
      this.pendingFloorRooms = /* @__PURE__ */ new Set([...this.pendingFloorRooms, t.id]), this.lockPendingEntities(i);
      try {
        await Et(this.hass, t, !1);
      } catch (a) {
        this.reportError(a);
      } finally {
        const a = new Set(this.pendingFloorRooms);
        a.delete(t.id), this.pendingFloorRooms = a, this.unlockPendingEntities(i);
      }
    }
  }
  async handleFloorAllOff(e, t) {
    if (e.stopPropagation(), !this.hass || this.pendingFloor || this.pendingFloorRooms.size) return;
    const i = t.flatMap((a) => Oe(a, !1));
    if (!(!i.length || i.some((a) => this.pendingEntities.has(a.entityId)))) {
      this.pendingFloor = !0, this.lockPendingEntities(i);
      try {
        const a = await Promise.allSettled(t.map((r) => Et(this.hass, r, !1))), o = a.filter((r) => r.status === "rejected");
        if (o.length) throw new Error(`${o.length} of ${a.length} room actions failed.`);
      } catch (a) {
        this.reportError(a);
      } finally {
        this.pendingFloor = !1, this.unlockPendingEntities(i);
      }
    }
  }
  openQuickActionPopup(e, t, i) {
    e.stopPropagation(), this.resetFloorPopup(), this.quickPopupTrigger = e.currentTarget, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0, this.quickPopup = { areaId: t.id, action: i }, this.updateComplete.then(() => {
      const a = this.renderRoot.querySelector(".area-quick-action-dialog");
      !a || a.open || !a.isConnected || (typeof a.showModal == "function" ? a.showModal() : a.setAttribute("open", ""));
    });
  }
  closeQuickActionPopup(e = !0, t) {
    this.restoreQuickPopupFocus = e, this.quickPopupMoreInfo = t;
    const i = this.renderRoot.querySelector(".area-quick-action-dialog");
    i != null && i.open && typeof i.close == "function" ? i.close() : this.handleQuickPopupClosed();
  }
  handleQuickPopupClosed() {
    const e = this.quickPopupMoreInfo, t = this.restoreQuickPopupFocus;
    this.quickPopup = void 0;
    const i = this.quickPopupTrigger;
    this.quickPopupTrigger = void 0, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0, this.updateComplete.then(() => {
      e ? this.moreInfo(e) : t && (i != null && i.isConnected) && i.focus();
    });
  }
  resetQuickPopup() {
    var t;
    const e = (t = this.renderRoot) == null ? void 0 : t.querySelector(".area-quick-action-dialog");
    e != null && e.open && typeof e.close == "function" && e.close(), this.quickPopup = void 0, this.quickPopupTrigger = void 0, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0;
  }
  showMoreInfo(e) {
    this.quickPopup ? this.closeQuickActionPopup(!1, e) : this.moreInfo(e);
  }
  handleQuickPopupBackdrop(e) {
    e.target === e.currentTarget && this.closeQuickActionPopup();
  }
  handleQuickPopupCancel(e) {
    e.preventDefault(), this.closeQuickActionPopup();
  }
  handleQuickPopupKeydown(e) {
    e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), this.closeQuickActionPopup());
  }
  async handleQuickPopupGroupAction(e, t, i, a) {
    if (e.stopPropagation(), !this.hass) return;
    const o = `${t.id}:${i}:${a ? "on" : "off"}`, r = Me(t, i), n = Je(t, i, a);
    if (!(this.quickActionPending(t.id, i) || r.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingActions = /* @__PURE__ */ new Set([...this.pendingActions, o]), this.lockPendingEntities(n);
      try {
        await _a(this.hass, t, i, a);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingActions);
        s.delete(o), this.pendingActions = s, this.unlockPendingEntities(n);
      }
    }
  }
  handleQuickPopupEntityAction(e, t, i) {
    e.stopPropagation();
    const a = et(i, t, !t.powered);
    !this.hass || !t.available || this.entityBusy(t) || this.quickPopup && this.quickActionPending(this.quickPopup.areaId, i) || !a || this.performEntityCall(t, () => U(this.hass, t.entityId, a.service, a.data));
  }
  async handleSectionAction(e, t, i, a) {
    if (e.stopPropagation(), !this.hass) return;
    const o = `${i}:${t.id}:${a ? "on" : "off"}`, r = `${i}:${t.id}:${a ? "off" : "on"}`, n = Ge(t, a);
    if (!(this.pendingSections.has(o) || this.pendingSections.has(r) || t.entities.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingSections = /* @__PURE__ */ new Set([...this.pendingSections, o]), this.lockPendingEntities(n);
      try {
        await $a(this.hass, t, a);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingSections);
        s.delete(o), this.pendingSections = s, this.unlockPendingEntities(n);
      }
    }
  }
  lockPendingEntities(e) {
    this.pendingEntities = /* @__PURE__ */ new Set([...this.pendingEntities, ...e.map((t) => t.entityId)]);
  }
  unlockPendingEntities(e) {
    const t = new Set(this.pendingEntities);
    for (const i of e) t.delete(i.entityId);
    this.pendingEntities = t;
  }
  entityBusy(e) {
    return this.pendingEntities.has(e.entityId) || this.pendingSections.has(`${e.areaId}:${e.section}:on`) || this.pendingSections.has(`${e.areaId}:${e.section}:off`);
  }
  toggleEntity(e, t) {
    e.stopPropagation();
    const i = J(t, !t.powered);
    i && this.performEntityCall(t, () => U(this.hass, t.entityId, i.service, i.data));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => U(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = C(e, "min_temp") ?? -100, a = C(e, "max_temp") ?? 100, o = Math.min(a, Math.max(i, t));
    this.performEntityCall(e, () => U(this.hass, e.entityId, "set_temperature", { temperature: o }));
  }
  setClimateRange(e, t, i, a) {
    const o = C(e, "min_temp") ?? -100, r = C(e, "max_temp") ?? 100, n = a === "low" ? Math.min(i, Math.max(o, t)) : t, s = a === "high" ? Math.max(n, Math.min(r, i)) : i;
    this.performEntityCall(e, () => U(this.hass, e.entityId, "set_temperature", {
      target_temp_low: n,
      target_temp_high: s
    }));
  }
  menuValue(e) {
    var a;
    const t = e.detail, i = (t == null ? void 0 : t.value) ?? ((a = t == null ? void 0 : t.item) == null ? void 0 : a.value);
    return typeof i == "string" && i ? i : void 0;
  }
  setClimateMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === e.entity.state || this.performEntityCall(e, () => U(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i }));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === String(e.entity.attributes.fan_mode ?? "") || this.performEntityCall(e, () => U(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setLightBrightness(e, t) {
    var o;
    t.stopPropagation();
    const i = (o = t.detail) == null ? void 0 : o.value;
    if (typeof i != "number" || !Number.isFinite(i)) return;
    const a = Math.min(100, Math.max(0, Math.round(i)));
    a !== At(e) && this.performEntityCall(e, () => a === 0 ? U(this.hass, e.entityId, "turn_off") : U(this.hass, e.entityId, "turn_on", { brightness_pct: a }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => U(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
  }
  async performEntityCall(e, t) {
    if (!(!this.hass || this.entityBusy(e))) {
      this.pendingEntities = /* @__PURE__ */ new Set([...this.pendingEntities, e.entityId]);
      try {
        await t();
      } catch (i) {
        this.reportError(i);
      } finally {
        const i = new Set(this.pendingEntities);
        i.delete(e.entityId), this.pendingEntities = i;
      }
    }
  }
  moreInfo(e) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: !0, composed: !0, detail: { entityId: e.entityId } }));
  }
  reportError(e) {
    var i;
    const t = e instanceof Error ? e.message : String(e);
    (i = this.config) != null && i.debug && console.warn("[area-bubble-overview-card]", e), this.dispatchEvent(new CustomEvent("hass-notification", { bubbles: !0, composed: !0, detail: { message: t } }));
  }
  storageKey() {
    return `${kt}:${this.storageId}:expanded`;
  }
  floorStorageKey() {
    return `${kt}:${this.storageId}:floor-expanded`;
  }
  readExpanded() {
    try {
      const e = localStorage.getItem(this.storageKey());
      return e ? JSON.parse(e) : {};
    } catch {
      return {};
    }
  }
  writeExpanded() {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(this.expanded));
    } catch {
    }
  }
  readFloorExpanded() {
    try {
      const e = localStorage.getItem(this.floorStorageKey());
      return e === null ? void 0 : e === "true";
    } catch {
      return;
    }
  }
  writeFloorExpanded() {
    try {
      localStorage.setItem(this.floorStorageKey(), String(this.floorExpanded));
    } catch {
    }
  }
  applyStyleVariables() {
    if (!this.config) return;
    const e = this.config.style;
    this.style.setProperty("--area-bubble-overview-border-radius", `${e.border_radius}px`), this.style.setProperty("--area-bubble-overview-blur", `${e.blur}px`), this.style.setProperty("--area-bubble-overview-gap", `${e.section_gap}px`), this.style.setProperty("--area-bubble-overview-section-gap", `${e.category_gap}px`), this.style.setProperty("--area-bubble-overview-row-height", `${e.row_height}px`), this.style.setProperty("--area-bubble-overview-area-name-size", `${e.area_name_size}px`), this.style.setProperty("--area-bubble-overview-quick-action-size", `${e.quick_action_size}px`), this.style.setProperty("--area-bubble-overview-quick-action-icon-size", `${e.quick_action_icon_size}px`), this.style.setProperty("--area-bubble-overview-section-action-size", `${e.section_action_size}px`), this.style.setProperty("--area-bubble-overview-section-action-icon-size", `${e.section_action_icon_size}px`), this.style.setProperty("--area-bubble-overview-accent", e.accent_color), this.style.setProperty("--area-bubble-overview-active", e.active_color), this.style.setProperty("--area-bubble-overview-row-bg", e.row_background), this.style.setProperty(
      "--area-bubble-overview-card-bg",
      e.card_transparent ? "transparent" : e.card_background
    ), this.style.setProperty(
      "--area-bubble-overview-card-border",
      e.card_transparent ? "transparent" : "color-mix(in srgb, var(--divider-color) 58%, transparent)"
    ), this.style.setProperty("--area-bubble-overview-active-surface", e.active_surface), this.style.setProperty("--area-bubble-overview-climate-surface", e.climate_surface), this.style.setProperty("--area-bubble-overview-control-surface", e.control_surface), this.style.setProperty("--area-bubble-overview-climate-color", e.climate_color), this.style.setProperty("--area-bubble-overview-cover-color", e.cover_color), this.style.setProperty("--area-bubble-overview-media-color", e.media_color), this.style.setProperty("--area-bubble-overview-temperature-off-surface", e.temperature_off_surface), this.style.setProperty("--area-bubble-overview-temperature-cool-surface", e.temperature_cool_surface), this.style.setProperty("--area-bubble-overview-temperature-heat-surface", e.temperature_heat_surface), this.style.setProperty("--area-bubble-overview-temperature-active-surface", e.temperature_active_surface), this.style.setProperty(
      "--area-bubble-overview-shadow",
      e.show_shadows && !e.card_transparent ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none"
    );
  }
};
I.styles = Wa;
F([
  Ae({ attribute: !1 })
], I.prototype, "hass", 2);
F([
  w()
], I.prototype, "config", 2);
F([
  w()
], I.prototype, "expanded", 2);
F([
  w()
], I.prototype, "floorExpanded", 2);
F([
  w()
], I.prototype, "pendingActions", 2);
F([
  w()
], I.prototype, "pendingSections", 2);
F([
  w()
], I.prototype, "pendingEntities", 2);
F([
  w()
], I.prototype, "quickPopup", 2);
F([
  w()
], I.prototype, "floorPopupOpen", 2);
F([
  w()
], I.prototype, "pendingFloor", 2);
F([
  w()
], I.prototype, "pendingFloorRooms", 2);
F([
  w()
], I.prototype, "error", 2);
I = F([
  je(Xe)
], I);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === Xe) || window.customCards.push({
  type: Xe,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

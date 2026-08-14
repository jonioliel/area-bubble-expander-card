/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ce = globalThis, et = Ce.ShadowRoot && (Ce.ShadyCSS === void 0 || Ce.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), ot = /* @__PURE__ */ new WeakMap();
let St = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (et && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = ot.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && ot.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ei = (e) => new St(typeof e == "string" ? e : e + "", void 0, tt), $e = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, r, o) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new St(i, e, tt);
}, ti = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), r = Ce.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = i.cssText, e.appendChild(a);
  }
}, nt = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return ei(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ii, defineProperty: ai, getOwnPropertyDescriptor: ri, getOwnPropertyNames: oi, getOwnPropertySymbols: ni, getPrototypeOf: si } = Object, Q = globalThis, st = Q.trustedTypes, ci = st ? st.emptyScript : "", ze = Q.reactiveElementPolyfillSupport, ge = (e, t) => e, Ie = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ci : null;
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
} }, it = (e, t) => !ii(e, t), ct = { attribute: !0, type: String, converter: Ie, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Q.litPropertyMetadata ?? (Q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let se = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ct) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(t, a, i);
      r !== void 0 && ai(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: r, set: o } = ri(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const s = r == null ? void 0 : r.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, s, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ge("elementProperties"))) return;
    const t = si(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ge("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ge("properties"))) {
      const i = this.properties, a = [...oi(i), ...ni(i)];
      for (const r of a) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [a, r] of i) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const r = this._$Eu(i, a);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a) i.unshift(nt(r));
    } else t !== void 0 && i.push(nt(t));
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
    return ti(t, this.constructor.elementStyles), t;
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
    var o;
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const n = (((o = a.converter) == null ? void 0 : o.toAttribute) !== void 0 ? a.converter : Ie).toAttribute(i, a.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var o, n;
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const s = a.getPropertyOptions(r), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((o = s.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? s.converter : Ie;
      this._$Em = r;
      const p = c.fromAttribute(i, s.type);
      this[r] = p ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, r = !1, o) {
    var n;
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (o = this[t]), a ?? (a = s.getPropertyOptions(t)), !((a.hasChanged ?? it)(o, i) || a.useDefault && a.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(s._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: r, wrapped: o }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, n] of r) {
        const { wrapped: s } = n, c = this[o];
        s !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, n, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (a = this._$EO) == null || a.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((a) => {
      var r;
      return (r = a.hostUpdated) == null ? void 0 : r.call(a);
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
se.elementStyles = [], se.shadowRootOptions = { mode: "open" }, se[ge("elementProperties")] = /* @__PURE__ */ new Map(), se[ge("finalized")] = /* @__PURE__ */ new Map(), ze == null || ze({ ReactiveElement: se }), (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, lt = (e) => e, Pe = ve.trustedTypes, dt = Pe ? Pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Et = "$lit$", K = `lit$${Math.random().toFixed(9).slice(2)}$`, Ct = "?" + K, li = `<${Ct}>`, re = document, _e = () => re.createComment(""), xe = (e) => e === null || typeof e != "object" && typeof e != "function", at = Array.isArray, di = (e) => at(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", qe = `[ 	
\f\r]`, he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pt = /-->/g, ut = />/g, Z = RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, bt = /"/g, Tt = /^(?:script|style|textarea|title)$/i, pi = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = pi(1), le = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), mt = /* @__PURE__ */ new WeakMap(), te = re.createTreeWalker(re, 129);
function Ot(e, t) {
  if (!at(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const ui = (e, t) => {
  const i = e.length - 1, a = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = he;
  for (let s = 0; s < i; s++) {
    const c = e[s];
    let p, m, h = -1, l = 0;
    for (; l < c.length && (n.lastIndex = l, m = n.exec(c), m !== null); ) l = n.lastIndex, n === he ? m[1] === "!--" ? n = pt : m[1] !== void 0 ? n = ut : m[2] !== void 0 ? (Tt.test(m[2]) && (r = RegExp("</" + m[2], "g")), n = Z) : m[3] !== void 0 && (n = Z) : n === Z ? m[0] === ">" ? (n = r ?? he, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, p = m[1], n = m[3] === void 0 ? Z : m[3] === '"' ? bt : ht) : n === bt || n === ht ? n = Z : n === pt || n === ut ? n = he : (n = Z, r = void 0);
    const g = n === Z && e[s + 1].startsWith("/>") ? " " : "";
    o += n === he ? c + li : h >= 0 ? (a.push(p), c.slice(0, h) + Et + c.slice(h) + K + g) : c + K + (h === -2 ? s : g);
  }
  return [Ot(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class we {
  constructor({ strings: t, _$litType$: i }, a) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const s = t.length - 1, c = this.parts, [p, m] = ui(t, i);
    if (this.el = we.createElement(p, a), te.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = te.nextNode()) !== null && c.length < s; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Et)) {
          const l = m[n++], g = r.getAttribute(h).split(K), v = /([.?@])?(.*)/.exec(l);
          c.push({ type: 1, index: o, name: v[2], strings: g, ctor: v[1] === "." ? bi : v[1] === "?" ? mi : v[1] === "@" ? fi : De }), r.removeAttribute(h);
        } else h.startsWith(K) && (c.push({ type: 6, index: o }), r.removeAttribute(h));
        if (Tt.test(r.tagName)) {
          const h = r.textContent.split(K), l = h.length - 1;
          if (l > 0) {
            r.textContent = Pe ? Pe.emptyScript : "";
            for (let g = 0; g < l; g++) r.append(h[g], _e()), te.nextNode(), c.push({ type: 2, index: ++o });
            r.append(h[l], _e());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ct) c.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(K, h + 1)) !== -1; ) c.push({ type: 7, index: o }), h += K.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const a = re.createElement("template");
    return a.innerHTML = t, a;
  }
}
function de(e, t, i = e, a) {
  var n, s;
  if (t === le) return t;
  let r = a !== void 0 ? (n = i._$Co) == null ? void 0 : n[a] : i._$Cl;
  const o = xe(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((s = r == null ? void 0 : r._$AO) == null || s.call(r, !1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = r : i._$Cl = r), r !== void 0 && (t = de(e, r._$AS(e, t.values), r, a)), t;
}
class hi {
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
    const { el: { content: i }, parts: a } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? re).importNode(i, !0);
    te.currentNode = r;
    let o = te.nextNode(), n = 0, s = 0, c = a[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let p;
        c.type === 2 ? p = new ke(o, o.nextSibling, this, t) : c.type === 1 ? p = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (p = new gi(o, this, t)), this._$AV.push(p), c = a[++s];
      }
      n !== (c == null ? void 0 : c.index) && (o = te.nextNode(), n++);
    }
    return te.currentNode = re, r;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class ke {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, a, r) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = de(this, t, i), xe(t) ? t === b || t == null || t === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : t !== this._$AH && t !== le && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : di(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== b && xe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(re.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: i, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = we.createElement(Ot(a.h, a.h[0]), this.options)), a);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(i);
    else {
      const n = new hi(r, this), s = n.u(this.options);
      n.p(i), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = mt.get(t.strings);
    return i === void 0 && mt.set(t.strings, i = new we(t)), i;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, r = 0;
    for (const o of t) r === i.length ? i.push(a = new ke(this.O(_e()), this.O(_e()), this, this.options)) : a = i[r], a._$AI(o), r++;
    r < i.length && (this._$AR(a && a._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = lt(t).nextSibling;
      lt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class De {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, r, o) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = b;
  }
  _$AI(t, i = this, a, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = de(this, t, i, 0), n = !xe(t) || t !== this._$AH && t !== le, n && (this._$AH = t);
    else {
      const s = t;
      let c, p;
      for (t = o[0], c = 0; c < o.length - 1; c++) p = de(this, s[a + c], i, c), p === le && (p = this._$AH[c]), n || (n = !xe(p) || p !== this._$AH[c]), p === b ? t = b : t !== b && (t += (p ?? "") + o[c + 1]), this._$AH[c] = p;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class bi extends De {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
}
class mi extends De {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== b);
  }
}
class fi extends De {
  constructor(t, i, a, r, o) {
    super(t, i, a, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = de(this, t, i, 0) ?? b) === le) return;
    const a = this._$AH, r = t === b && a !== b || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, o = t !== b && (a === b || r);
    r && this.element.removeEventListener(this.name, this, a), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class gi {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    de(this, t);
  }
}
const Fe = ve.litHtmlPolyfillSupport;
Fe == null || Fe(we, ke), (ve.litHtmlVersions ?? (ve.litHtmlVersions = [])).push("3.3.3");
const vi = (e, t, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = r = new ke(t.insertBefore(_e(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = vi(i, this.renderRoot, this.renderOptions);
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
    return le;
  }
}
var At;
W._$litElement$ = !0, W.finalized = !0, (At = ie.litElementHydrateSupport) == null || At.call(ie, { LitElement: W });
const je = ie.litElementPolyfillSupport;
je == null || je({ LitElement: W });
(ie.litElementVersions ?? (ie.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yi = { attribute: !0, type: String, converter: Ie, reflect: !1, hasChanged: it }, _i = (e = yi, t, i) => {
  const { kind: a, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), a === "accessor") {
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
  return (t, i) => typeof i == "object" ? _i(e, t, i) : ((a, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, a), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $(e) {
  return Ae({ ...e, state: !0, attribute: !1 });
}
const xi = "custom:area-bubble-expander-card", wi = "area-bubble-expander-card", It = "area-bubble-expander-card-editor", $i = "area-bubble-expander-card", ki = ["light", "switch", "fan", "climate", "media_player"], Ai = [
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
], Si = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, Ei = {
  climate: ["off", "unavailable", "unknown"]
}, Ci = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), Ti = ["always_on", "critical", "infrastructure", "no_turn_off"], Oi = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], Ii = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, Pt = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, Ve = {
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
}, Pi = {
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
}, be = {
  type: xi,
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
  domains: ki,
  exclude_domains: Ai,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: Si,
  inactive_states: Ei,
  paused_media_players_active: !0,
  protected_labels: Ti,
  protected_entities: Oi,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: Ii,
  domain_icons: Pt,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: Ve,
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
}, Ni = $e`
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
`, N = (e) => Array.isArray(e) ? [...e] : [], U = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, ce = (e) => {
  const t = U(e.style), i = typeof t.preset == "string" ? t.preset : Ve.preset, a = Pi[i] ?? {}, r = { ...Ve, ...a, ...t }, o = {
    ...be,
    ...e,
    style: r
  };
  return {
    ...o,
    type: "custom:area-bubble-expander-card",
    title: o.title ?? "",
    empty_title: o.empty_title ?? "",
    empty_subtitle: o.empty_subtitle ?? "",
    include_entities: N(o.include_entities),
    exclude_entities: N(o.exclude_entities),
    include_areas: N(o.include_areas),
    exclude_areas: N(o.exclude_areas),
    exclude_labels: N(o.exclude_labels),
    exclude_entity_category: N(o.exclude_entity_category),
    exclude_by_regex: N(o.exclude_by_regex),
    active_states: { ...be.active_states ?? {}, ...U(e.active_states) },
    inactive_states: { ...be.inactive_states ?? {}, ...U(e.inactive_states) },
    protected_entities: N(o.protected_entities),
    disable_turn_off_for_domains: N(o.disable_turn_off_for_domains),
    dangerous_domains: N(o.dangerous_domains),
    service_mapping: { ...be.service_mapping ?? {}, ...U(e.service_mapping) },
    custom_area_order: N(o.custom_area_order),
    custom_entity_order: N(o.custom_entity_order),
    areas: { ...U(o.areas) },
    entity_overrides: { ...U(o.entity_overrides) },
    labels: { ...U(o.labels) },
    domain_labels: { ...U(o.domain_labels) },
    domain_icons: { ...be.domain_icons ?? {}, ...U(o.domain_icons) },
    style: r
  };
}, Mi = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, Ee = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), Ri = (e) => Array.isArray(e) ? e.join(`
`) : "", ft = {
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
}, Di = {
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
}, pe = (e, t) => {
  var a;
  if (t === "he" || t === "en") return t;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Nt = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = pe(e, t.language), a = document.documentElement.dir;
  return i === "he" || a === "rtl";
}, k = (e, t, i, a = {}) => {
  const r = pe(t, e.language);
  let n = e.labels[i] ?? ft[r][i] ?? ft.en[i] ?? i;
  for (const [s, c] of Object.entries(a))
    n = n.replace(new RegExp(`\\{${s}\\}`, "g"), String(c));
  return n;
}, gt = (e, t, i) => {
  const a = pe(t, e.language);
  return e.domain_labels[i] ?? Di[a][i] ?? i.replace(/_/g, " ");
}, Li = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const r = a.area_id ?? a.id ?? i;
    t.set(r, a);
  }
  return t;
}, Je = (e, t, i) => {
  var h, l;
  const a = Li(e), r = (h = e == null ? void 0 : e.entities) == null ? void 0 : h[i], o = r != null && r.device_id ? (l = e == null ? void 0 : e.devices) == null ? void 0 : l[r.device_id] : void 0, n = (r == null ? void 0 : r.area_id) ?? (o == null ? void 0 : o.area_id) ?? "no_area", s = n ? a.get(n) : void 0, c = t.areas[n] ?? t.areas[(s == null ? void 0 : s.name) ?? ""], p = (s == null ? void 0 : s.name) ?? k(t, e, "no_area"), m = (c == null ? void 0 : c.name) ?? p;
  return {
    id: n || "no_area",
    name: m,
    icon: (c == null ? void 0 : c.icon) ?? (s == null ? void 0 : s.icon) ?? (n === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, zi = (e, t, i) => {
  const a = i.areas[e] ?? i.areas[t];
  return a != null && a.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, me = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, qi = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), Fi = (e, t, i, a) => {
  if (e.state === "unavailable") return k(i, a, "not_available");
  if (t === "light" && i.show_brightness) {
    const r = me(e, "brightness");
    if (r !== void 0) return `${Math.round(r / 255 * 100)}%`;
  }
  if (t === "fan") {
    const r = me(e, "percentage");
    if (r !== void 0) return `${r}%`;
  }
  if (t === "climate") {
    const r = String(e.attributes.hvac_action ?? e.state), o = me(e, "current_temperature"), n = me(e, "temperature");
    return i.show_temperature && (o !== void 0 || n !== void 0) ? [r, o !== void 0 ? `${o}°` : "", n !== void 0 ? `→ ${n}°` : ""].filter(Boolean).join(" ") : r;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const r = me(e, "current_position");
    return r !== void 0 ? `${r}%` : e.state;
  }
  return String(e.state);
}, ji = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const a = Math.round(i / 60);
  return a < 24 ? `${a}h` : `${Math.round(a / 24)}d`;
}, Hi = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(k(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(ji(e.entity)), i.filter(Boolean).join(" · ");
}, Ui = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), Bi = (e, t, i) => {
  var n, s;
  const a = String(e.state ?? "").toLowerCase();
  if (Ci.has(a) || t === "media_player" && !i.paused_media_players_active && a === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (Ui.has(c)) return !0;
  }
  const r = (n = i.inactive_states[t]) == null ? void 0 : n.map((c) => c.toLowerCase());
  if (r != null && r.includes(a)) return !1;
  const o = (s = i.active_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  return o != null && o.length ? o.includes(a) : r != null && r.length ? !0 : a === "on";
}, Vi = (e, t) => {
  var r, o;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (o = e == null ? void 0 : e.devices) == null ? void 0 : o[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []];
}, Ji = (e, t, i) => {
  const a = i.entity_overrides[e];
  return a != null && a.protected || i.protected_entities.includes(e) ? !0 : t.some((r) => i.protected_labels.includes(r));
}, Mt = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return k(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, Gi = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, Te = (e, t) => e.filter((i) => !Mt(i, t)), Ne = (e, t, i) => {
  const a = e.indexOf(t);
  if (a >= 0) return a;
  if (i) {
    const r = e.indexOf(i);
    if (r >= 0) return r;
  }
  return Number.MAX_SAFE_INTEGER;
}, Ki = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.area_sort === "count_asc" ? i.sort((a, r) => a.entities.length - r.entities.length || a.name.localeCompare(r.name)) : t.area_sort === "custom" ? i.sort(
    (a, r) => Ne(t.custom_area_order, a.id, a.name) - Ne(t.custom_area_order, r.id, r.name) || a.name.localeCompare(r.name)
  ) : i.sort((a, r) => r.entities.length - a.entities.length || a.name.localeCompare(r.name));
}, Qi = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.entity_sort === "state" ? i.sort((a, r) => a.entity.state.localeCompare(r.entity.state) || a.name.localeCompare(r.name)) : t.entity_sort === "last_changed" ? i.sort((a, r) => new Date(r.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((a, r) => Ne(t.custom_entity_order, a.entityId) - Ne(t.custom_entity_order, r.entityId)) : i.sort((a, r) => a.domain.localeCompare(r.domain) || a.name.localeCompare(r.name));
}, Wi = (e) => e.split(".")[0] ?? "", Yi = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), Xi = (e, t) => t.some((i) => i.test(e)), Ge = (e, t) => {
  var p;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), a = [], r = Yi(t.exclude_by_regex), o = new Set(t.domains), n = new Set(t.exclude_domains), s = new Set(t.include_entities);
  for (const m of Object.values(e.states)) {
    const h = m.entity_id, l = Wi(h), g = (p = e.entities) == null ? void 0 : p[h], v = t.entity_overrides[h], _ = Vi(e, h), d = [];
    v != null && v.hidden && d.push("hidden by entity override"), t.exclude_entities.includes(h) && d.push("excluded entity"), t.exclude_unavailable && m.state === "unavailable" && d.push("unavailable"), t.exclude_hidden_entities && (g != null && g.hidden_by || g != null && g.hidden) && d.push("hidden entity"), g != null && g.disabled_by && d.push("disabled entity"), g != null && g.entity_category && t.exclude_entity_category.includes(g.entity_category) && d.push("excluded entity category"), n.has(l) && d.push("excluded domain"), !o.has(l) && !s.has(h) && d.push("domain not included"), _.some((x) => t.exclude_labels.includes(x)) && d.push("excluded label"), Xi(h, r) && d.push("excluded by regex");
    const f = Je(e, t, h);
    if (zi(f.id, f.name, t) || d.push("excluded area"), Bi(m, l, t) || d.push("inactive state"), d.length) {
      a.push({ entity_id: h, reasons: d });
      continue;
    }
    const w = Ji(h, _, t), y = {
      entity: m,
      entityId: h,
      domain: l,
      name: qi(m, v == null ? void 0 : v.name),
      icon: (v == null ? void 0 : v.icon) ?? String(m.attributes.icon ?? t.domain_icons[l] ?? Pt[l] ?? "mdi:toggle-switch-outline"),
      areaId: f.id,
      areaName: f.name,
      areaIcon: f.icon,
      labels: _,
      category: g == null ? void 0 : g.entity_category,
      hidden: !!(g != null && g.hidden_by || g != null && g.hidden),
      active: !0,
      protected: w,
      controllable: !0,
      secondary: Fi(m, l, t, e),
      skipReasons: []
    };
    if (y.disabledReason = Mt(y, t), y.controllable = !y.disabledReason, !Gi(y, t)) {
      a.push({ entity_id: h, reasons: ["protected hidden"] });
      continue;
    }
    const L = i.get(f.id) ?? {
      id: f.id,
      name: f.name,
      icon: f.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    L.entities.push(y), L.domainCounts[l] = (L.domainCounts[l] ?? 0) + 1, w && (L.protectedCount += 1), i.set(f.id, L);
  }
  const c = [...i.values()].map((m) => ({ ...m, entities: Qi(m.entities, t) }));
  return { groups: Ki(c, t), skipped: a };
};
var Zi = Object.defineProperty, ea = Object.getOwnPropertyDescriptor, I = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ea(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && Zi(t, i, r), r;
};
const z = [
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
], ta = [
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
], ia = {
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
}, aa = {
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
}, O = {
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
let T = class extends W {
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
    const e = ce(this.config), t = pe(this.hass, e.language), i = Nt(this.hass, e), a = z.find((o) => o.id === this.activeSection) ?? z[0], r = ta.filter((o) => o.section === this.activeSection);
    return u`
      <div class="editor" dir=${i ? "rtl" : "ltr"} lang=${t}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${O[t].title}</div>
            <div class="editor-subtitle">${O[t].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${O[t].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${z.map((o) => u`<option value=${o.id}>${o.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${O[t].chooseSection} aria-orientation="vertical">
            ${z.map(
      (o, n) => u`
                <button
                  type="button"
                  id=${`abec-editor-tab-${n}`}
                  class="section-tab"
                  role="tab"
                  aria-selected=${this.activeSection === o.id ? "true" : "false"}
                  aria-controls="abec-editor-panel"
                  tabindex=${this.activeSection === o.id ? "0" : "-1"}
                  @click=${() => this.selectSection(o.id)}
                  @keydown=${(s) => this.navigateSections(s, n)}
                >
                  <ha-icon icon=${o.icon}></ha-icon>
                  <span>${o.title[t]}</span>
                  <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
    )}
          </nav>

          <section
            id="abec-editor-panel"
            class="section-panel"
            role="tabpanel"
            aria-labelledby=${`abec-editor-tab-${Math.max(0, z.findIndex((o) => o.id === a.id))}`}
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
            ${r.map((o) => this.renderField(o, e))}
          ${this.activeSection === "Debug" ? u`<div class="field"><label class="field-label" for="abec-resulting-config">${O[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : b}
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
      const r = await e({
        type: "config/label_registry/list"
      });
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = Array.isArray(r) ? r : [], this.labelRegistryStatus = "loaded";
    } catch {
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = [], this.labelRegistryStatus = "failed";
    }
  }
  retryLabelRegistry() {
    this.labelRegistryHass = void 0, this.labelRegistryStatus = "idle", this.loadLabelRegistry();
  }
  renderAreaPicker(e) {
    const t = this.editorLanguage(e), i = O[t], a = this.areaOptions(e), r = a.filter((o) => this.matchesSearch(`${o.name} ${o.id}`, this.areaSearch));
    return u`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.areasFromHa}</strong>
            <span>${r.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-area-search">${i.searchAreas}</label>
          <input
            id="abec-area-search"
            class="search"
            type="search"
            placeholder=${i.searchAreas}
            .value=${this.areaSearch}
            @input=${(o) => this.updateSearch(o, "area")}
          />
        </div>
        <div class="picker-list">
          ${r.length ? r.map(
      (o) => u`
              <div class="picker-item">
                <ha-icon icon=${o.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${o.name}</div>
                  <div class="picker-meta">${o.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_areas.includes(o.id) || e.include_areas.includes(o.name) ? "active" : ""}"
                    aria-pressed=${e.include_areas.includes(o.id) || e.include_areas.includes(o.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_areas", o.id, "exclude_areas", [o.id, o.name])}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_areas.includes(o.id) || e.exclude_areas.includes(o.name) ? "active" : ""}"
                    aria-pressed=${e.exclude_areas.includes(o.id) || e.exclude_areas.includes(o.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_areas", o.id, "include_areas", [o.id, o.name])}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : u`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderEntityPicker(e) {
    const t = this.editorLanguage(e), i = O[t], a = this.entityOptions(e), r = a.filter(
      (o) => this.matchesSearch(`${o.name} ${o.entityId} ${o.domain} ${o.areaName} ${o.labels}`, this.entitySearch)
    );
    return u`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.entitiesFromHa}</strong>
            <span>${r.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-entity-search">${i.searchEntities}</label>
          <input
            id="abec-entity-search"
            class="search"
            type="search"
            placeholder=${i.searchEntities}
            .value=${this.entitySearch}
            @input=${(o) => this.updateSearch(o, "entity")}
          />
        </div>
        <div class="picker-list entities-picker">
          ${r.length ? r.map(
      (o) => u`
              <div class="picker-item">
                <ha-icon icon=${o.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${o.name}</div>
                  <div class="picker-meta">
                    ${o.entityId} · ${o.areaName} · ${o.domain}${o.labels ? ` · labels: ${o.labels}` : ""}
                  </div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_entities.includes(o.entityId) ? "active" : ""}"
                    aria-pressed=${e.include_entities.includes(o.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_entities", o.entityId, "exclude_entities")}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_entities.includes(o.entityId) ? "active" : ""}"
                    aria-pressed=${e.exclude_entities.includes(o.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_entities", o.entityId, "include_entities")}
                  >${i.hide}</button>
                </div>
              </div>
            `
    ) : u`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderLabelPicker(e) {
    const t = this.editorLanguage(e), i = O[t], a = this.labelOptions(), r = a.filter((o) => this.matchesSearch(`${o.id} ${o.name}`, this.labelSearch));
    return u`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.labelsFromHa}</strong>
            <span>${r.length} / ${a.length}</span>
          </div>
          <label class="visually-hidden" for="abec-label-search">${i.searchLabels}</label>
          <input
            id="abec-label-search"
            class="search"
            type="search"
            placeholder=${i.searchLabels}
            .value=${this.labelSearch}
            @input=${(o) => this.updateSearch(o, "label")}
          />
        </div>
        ${this.labelRegistryStatus === "failed" ? u`
              <div class="status-banner" role="status">
                <span class="status-text">${i.labelsFallback}</span>
                <button type="button" class="action-button" @click=${this.retryLabelRegistry}>${i.retry}</button>
              </div>
            ` : b}
        <div class="picker-list compact-picker">
          ${r.length ? r.map(
      (o) => u`
              <div class="picker-item">
                <ha-icon icon=${o.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${o.name}</div>
                  <div class="picker-meta">${o.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill danger ${e.exclude_labels.includes(o.id) ? "active" : ""}"
                    aria-pressed=${e.exclude_labels.includes(o.id) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_labels", o.id)}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : u`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderAreaOrder(e) {
    const t = this.editorLanguage(e), i = O[t], a = this.orderedAreaOptions(e);
    return u`
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
      (r, o) => u`
              <div
                class="picker-item order-item ${this.draggedAreaId === r.id ? "dragging" : ""} ${this.dragOverAreaId === r.id ? "drag-over" : ""}"
                @dragover=${(n) => this.dragAreaOver(n, r.id)}
                @drop=${(n) => this.dropArea(n, r.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${i.drag}
                  aria-hidden="true"
                  @dragstart=${(n) => this.startAreaDrag(n, r.id)}
                  @dragend=${this.endAreaDrag}
                ><ha-icon icon="mdi:drag-vertical"></ha-icon></span>
                <ha-icon icon=${r.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${r.name}</div>
                  <div class="picker-meta">${r.id}</div>
                </div>
                <div class="order-actions">
                  <button type="button" class="icon-action" title=${i.moveUp} aria-label=${`${i.moveUp}: ${r.name}`} ?disabled=${o === 0} @click=${() => this.moveArea(r.id, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button type="button" class="icon-action" title=${i.moveDown} aria-label=${`${i.moveDown}: ${r.name}`} ?disabled=${o === a.length - 1} @click=${() => this.moveArea(r.id, 1)}>
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
    const t = this.editorLanguage(e), i = O[t], { groups: a } = Ge(this.hass, e), r = a.reduce((n, s) => n + s.entities.length, 0), o = a.length;
    return u`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${i.badgeHelper}</strong>
            <span>${r} ${i.activeNow} · ${o} ${i.activeAreas}</span>
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
    var a, r;
    const t = Object.entries(((a = this.hass) == null ? void 0 : a.areas) ?? {}).map(([o, n]) => ({
      id: n.area_id ?? n.id ?? o,
      name: n.name,
      icon: n.icon ?? "mdi:floor-plan"
    })), i = /* @__PURE__ */ new Map();
    for (const o of Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      const n = Je(this.hass, e, o);
      i.set(n.id, { id: n.id, name: n.name, icon: n.icon });
    }
    return [...t, ...i.values()].filter((o, n, s) => s.findIndex((c) => c.id === o.id) === n).sort((o, n) => o.name.localeCompare(n.name));
  }
  orderedAreaOptions(e) {
    const t = this.areaOptions(e), i = e.custom_area_order;
    return t.sort((a, r) => {
      const o = this.orderIndex(i, a.id, a.name), n = this.orderIndex(i, r.id, r.name);
      return o - n || a.name.localeCompare(r.name);
    });
  }
  entityOptions(e) {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).map((i) => {
      const a = i.entity_id.split(".")[0] ?? "", r = Je(this.hass, e, i.entity_id);
      return {
        entityId: i.entity_id,
        domain: a,
        areaName: r.name,
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
      const r = a.label_id ?? a.id;
      r && e.set(r, {
        id: r,
        name: a.name ?? r,
        icon: a.icon ?? "mdi:label-outline"
      });
    }
    for (const [a, r] of Object.entries(((t = this.hass) == null ? void 0 : t.labels) ?? {})) {
      const o = r.label_id ?? a;
      e.has(o) || e.set(o, {
        id: o,
        name: r.name ?? o,
        icon: r.icon ?? "mdi:label-outline"
      });
    }
    for (const a of Object.keys(((i = this.hass) == null ? void 0 : i.states) ?? {}))
      for (const r of this.labelsForEntity(a))
        e.has(r) || e.set(r, { id: r, name: r, icon: "mdi:label-outline" });
    return [...e.values()].sort((a, r) => a.name.localeCompare(r.name));
  }
  templateSensorYaml(e) {
    const t = JSON.stringify(e.domains), i = JSON.stringify(e.exclude_domains), a = JSON.stringify(e.exclude_entities), r = JSON.stringify(e.exclude_areas), o = JSON.stringify(e.exclude_labels), n = JSON.stringify(e.active_states), s = JSON.stringify(e.inactive_states);
    return `template:
  - sensor:
      - name: Area Bubble Active Entities
        unique_id: area_bubble_active_entities
        icon: mdi:power-plug
        state: >
          {% set domains = ${t} %}
          {% set exclude_domains = ${i} %}
          {% set exclude_entities = ${a} %}
          {% set exclude_areas = ${r} %}
          {% set exclude_labels = ${o} %}
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
          {% set exclude_areas = ${r} %}
          {% set exclude_labels = ${o} %}
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
    var a, r, o, n;
    const t = (r = (a = this.hass) == null ? void 0 : a.entities) == null ? void 0 : r[e], i = t != null && t.device_id ? (n = (o = this.hass) == null ? void 0 : o.devices) == null ? void 0 : n[t.device_id] : void 0;
    return [.../* @__PURE__ */ new Set([...(t == null ? void 0 : t.labels) ?? [], ...(i == null ? void 0 : i.labels) ?? []])];
  }
  editorLanguage(e = ce(this.config)) {
    return pe(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? ia[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? aa[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    z.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % z.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + z.length) % z.length), e.key === "Home" && (i = 0), e.key === "End" && (i = z.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(z[i].id), this.updateComplete.then(() => {
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
    const i = ce(this.config), a = this.orderedAreaOptions(i).map((s) => s.id), r = a.indexOf(e), o = r + t;
    if (r < 0 || o < 0 || o >= a.length) return;
    const n = [...a];
    [n[r], n[o]] = [n[o], n[r]], this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  enableCustomAreaOrder(e) {
    const t = Ee(this.readPath("custom_area_order"));
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
    const a = this.orderedAreaOptions(ce(this.config)).map((p) => p.id), r = a.indexOf(i), o = a.indexOf(t);
    if (r < 0 || o < 0) return;
    const n = [...a];
    n.splice(r, 1);
    const s = n.indexOf(t) + (r < o ? 1 : 0);
    n.splice(s, 0, i), this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  endAreaDrag() {
    this.draggedAreaId = void 0, this.dragOverAreaId = void 0;
  }
  orderIndex(e, t, i) {
    const a = e.indexOf(t);
    if (a >= 0) return a;
    if (i) {
      const r = e.indexOf(i);
      if (r >= 0) return r;
    }
    return Number.MAX_SAFE_INTEGER;
  }
  toggleListValue(e, t, i, a = [t]) {
    const r = Ee(this.readPath(e)), o = a.some((c) => r.includes(c)), n = o ? r.filter((c) => !a.includes(c)) : [...r.filter((c) => !a.includes(c)), t], s = { [e]: n };
    !o && i && (s[i] = Ee(this.readPath(i)).filter((c) => !a.includes(c))), this.updateKeys(s);
  }
  renderField(e, t) {
    var s;
    const i = this.editorLanguage(t), a = O[i], r = this.readPath(e.key), o = this.fieldId(e.key), n = this.fieldLabel(e, i);
    if (e.type === "boolean")
      return u`
        <div class="row">
          <div class="row-text">
            <label class="row-label" for=${o}>${n}</label>
            <span class="field-helper"><code>${e.key}</code></span>
          </div>
          <input
            id=${o}
            class="native-switch"
            type="checkbox"
            role="switch"
            .checked=${!!(r ?? this.readResolvedPath(t, e.key))}
            @change=${(c) => this.updateField(e, c.target.checked)}
          />
        </div>
      `;
    if (e.type === "select") {
      const c = this.stringifySelectValue(r ?? this.readResolvedPath(t, e.key));
      return u`
        <div class="field">
          <label class="field-label" for=${o}>${n}</label>
          <select id=${o} .value=${c} @change=${(p) => this.updateField(e, this.parseSelectValue(e.key, p.target.value))}>
            ${(s = e.options) == null ? void 0 : s.map((p) => u`<option value=${p.value}>${this.optionLabel(p.value, p.label, i)}</option>`)}
          </select>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    }
    if (e.type === "number")
      return u`
        <div class="field">
          <label class="field-label" for=${o}>${n}</label>
          <input
            id=${o}
            type="number"
            min=${e.min ?? ""}
            max=${e.max ?? ""}
            step=${e.step ?? 1}
            .value=${String(r ?? this.readResolvedPath(t, e.key) ?? "")}
            @change=${(c) => this.updateNumberField(e, c.target)}
          />
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "multi-text")
      return u`
        <div class="field">
          <label class="field-label" for=${o}>${n}</label>
          <textarea id=${o} .value=${Ri(r ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, Ee(c.target.value))}></textarea>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), p = this.jsonDrafts[e.key] ?? c, m = this.jsonErrors[e.key] ?? this.validateJson(p), h = p !== c;
      return u`
        <div class="field">
          <label class="field-label" for=${o}>${n}</label>
          <textarea
            id=${o}
            class="yaml"
            spellcheck="false"
            aria-invalid=${m ? "true" : "false"}
            aria-describedby=${`${o}-status`}
            .value=${p}
            @input=${(l) => this.updateJsonDraft(e, l.target.value)}
            @keydown=${(l) => this.handleJsonKeydown(l, e)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${o}-status`} class="json-status ${m ? "error" : ""}" role="status" aria-live="polite">
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
    return u`
      <div class="field">
        <label class="field-label" for=${o}>${n}</label>
        <input
          id=${o}
          type="text"
          autocomplete="off"
          .value=${String(r ?? this.readResolvedPath(t, e.key) ?? "")}
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
    const a = e.min ?? -1 / 0, r = e.max ?? 1 / 0;
    this.updateField(e, Math.min(r, Math.max(a, i)));
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
      return !i || typeof i != "object" || Array.isArray(i) ? O[t].jsonObject : void 0;
    } catch (i) {
      const a = i instanceof Error ? i.message : String(i);
      return `${O[t].jsonInvalid}: ${a}`;
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
    const i = ce(t), r = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
    return this.textareaValue(r);
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
    let r = e;
    for (const n of a.slice(0, -1)) {
      const s = r[n];
      if (s && typeof s == "object" && !Array.isArray(s)) {
        r = s;
        continue;
      }
      if (i === void 0 || i === "") return;
      r[n] = {}, r = r[n];
    }
    const o = a[a.length - 1];
    i === void 0 || i === "" ? delete r[o] : r[o] = i;
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
T.styles = Ni;
I([
  Ae({ attribute: !1 })
], T.prototype, "hass", 2);
I([
  $()
], T.prototype, "config", 2);
I([
  $()
], T.prototype, "activeSection", 2);
I([
  $()
], T.prototype, "areaSearch", 2);
I([
  $()
], T.prototype, "entitySearch", 2);
I([
  $()
], T.prototype, "labelSearch", 2);
I([
  $()
], T.prototype, "registryLabels", 2);
I([
  $()
], T.prototype, "labelRegistryStatus", 2);
I([
  $()
], T.prototype, "jsonDrafts", 2);
I([
  $()
], T.prototype, "jsonErrors", 2);
I([
  $()
], T.prototype, "draggedAreaId", 2);
I([
  $()
], T.prototype, "dragOverAreaId", 2);
T = I([
  Le(It)
], T);
const ra = $e`
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
$e`
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
const Rt = (e) => `${$i}:${e}:expanded`, oa = (e) => {
  try {
    const t = localStorage.getItem(Rt(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, na = (e, t) => {
  try {
    localStorage.setItem(Rt(e), JSON.stringify(t));
  } catch {
  }
}, Dt = (e) => {
  const [t, i] = e.split(".");
  return { domain: t, service: i };
}, sa = async (e, t, i) => {
  const a = i.service_mapping[t.domain];
  if (!a) throw new Error(`No turn-off service configured for ${t.domain}`);
  const r = Dt(a);
  await e.callService(r.domain, r.service, void 0, { entity_id: t.entityId });
}, vt = async (e, t, i) => {
  const a = /* @__PURE__ */ new Map();
  for (const r of Te(t, i)) {
    const o = i.service_mapping[r.domain];
    if (!o) continue;
    const n = a.get(o) ?? [];
    n.push(r.entityId), a.set(o, n);
  }
  await Promise.all(
    [...a.entries()].map(([r, o]) => {
      const n = Dt(r);
      return e.callService(n.domain, n.service, void 0, { entity_id: o });
    })
  );
}, ca = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var la = Object.defineProperty, da = Object.getOwnPropertyDescriptor, Se = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? da(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && la(t, i, r), r;
};
let oe = class extends W {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(It);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      Mi(e), this.config = ce(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? oa(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = Ge(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return u`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return b;
    const e = Nt(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = Ge(this.hass, this.config), a = t.reduce((o, n) => o + n.entities.length, 0), r = t.length;
    return u`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(t, a, r) : b}
          ${t.length ? u`<div class="sections">${t.map((o) => this.renderArea(o))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug ? u`<div class="debug">${JSON.stringify(i.slice(0, 80), null, 2)}</div>` : b}
        </div>
      </ha-card>
    `;
  }
  renderHeader(e, t, i) {
    if (!this.config) return b;
    const a = this.config.title || k(this.config, this.hass, "title"), r = [
      this.config.show_total_count ? `${t} ${k(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${i} ${k(this.config, this.hass, "active_areas")}` : ""
    ].filter(Boolean).join(" · ");
    return u`
      <div class="header">
        <div class="title">
          <div>${a}</div>
          ${r ? u`<div class="subtitle">${r}</div>` : b}
        </div>
        ${this.config.show_global_turn_off ? u`
              <button
                class="icon-button danger"
                title=${k(this.config, this.hass, "turn_off_all")}
                aria-label=${k(this.config, this.hass, "turn_off_all")}
                @click=${(o) => this.turnOffGlobal(o, e)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : b}
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return b;
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), a = Te(e.entities, this.config), r = this.config.areas[e.id] ?? this.config.areas[e.name], o = (r == null ? void 0 : r.allow_turn_off) !== !1 && a.length > 0, n = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, s = e.entities.length - n.length;
    return u`
      <section class="area-section ${t ? "expanded" : ""}" style=${r != null && r.accent_color ? `--abec-accent:${r.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${`${k(this.config, this.hass, t ? "collapse_area" : "expand_area")}: ${e.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(e)}
          >
            ${this.config.show_area_icons ? u`<span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : b}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${e.name}</span>
                <span class="count">${e.entities.length} ${k(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !t && i ? u`<span class="preview">${i}</span>` : b}
              ${this.config.show_domain_chips ? this.renderDomainChips(e) : b}
              ${this.config.show_area_ids ? u`<span class="preview">${e.id}</span>` : b}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off ? u`
                  <button
                    class="icon-button danger"
                    ?disabled=${!o}
                    title=${k(this.config, this.hass, "turn_off_area")}
                    aria-label=${k(this.config, this.hass, "turn_off_area")}
                    @click=${(c) => this.turnOffArea(c, e)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                ` : b}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${t ? u`
              <div class="entities">
                ${n.map((c) => this.renderEntity(c))}
                ${s > 0 ? u`<div class="secondary">${s} ${k(this.config, this.hass, "show_more")}</div>` : b}
              </div>
            ` : b}
      </section>
    `;
  }
  renderDomainChips(e) {
    return this.config ? u`
      <div class="chips">
        ${Object.entries(e.domainCounts).map(([t, i]) => {
      var r;
      const a = ((r = this.config) == null ? void 0 : r.domain_chip_mode) ?? "icons";
      return u`
            <span class="chip" title=${gt(this.config, this.hass, t)}>
              ${a !== "text" ? u`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : b}
              ${a !== "icons" ? u`<span>${i} ${gt(this.config, this.hass, t)}</span>` : u`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : b;
  }
  renderEntity(e) {
    if (!this.config) return b;
    const t = this.config.show_entity_secondary_info ? Hi(e, this.config) : "";
    return u`
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
          ${this.config.show_entity_icons ? u`<span class="icon-bubble entity-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : b}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${e.name}</span>
              ${e.protected ? u`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${k(this.config, this.hass, "protected")}</span>` : b}
            </span>
            ${t ? u`<span class="secondary">${t}</span>` : b}
          </span>
        </button>
        ${this.config.show_entity_turn_off ? u`
              <button
                class="icon-button danger"
                ?disabled=${!e.controllable}
                title=${e.disabledReason ?? k(this.config, this.hass, "turn_off_entity")}
                aria-label=${k(this.config, this.hass, "turn_off_entity")}
                @click=${(i) => this.turnOffEntity(i, e)}
              >
                <ha-icon icon=${e.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            ` : b}
      </div>
    `;
  }
  renderEmpty() {
    return !this.config || !this.config.show_empty ? b : u`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || k(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || k(this.config, this.hass, "empty_subtitle")}</div>
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
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && na(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(k(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await sa(this.hass, t, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Te(t.entities, this.config);
    if (!i.length) return;
    const a = this.config.areas[t.id] ?? this.config.areas[t.name], r = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((s) => this.config.dangerous_domains.includes(s.domain)), o = (a == null ? void 0 : a.confirm_turn_off) ?? r, n = `${k(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${k(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(o && !window.confirm(n)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await ca(this.hass, t.id) : await vt(this.hass, i, this.config);
      } catch (s) {
        this.reportError(s);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Te(t.flatMap((r) => r.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((r) => this.config.dangerous_domains.includes(r.domain))) && !window.confirm(k(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await vt(this.hass, i, this.config);
      } catch (r) {
        this.reportError(r);
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
oe.styles = ra;
Se([
  Ae({ attribute: !1 })
], oe.prototype, "hass", 2);
Se([
  $()
], oe.prototype, "config", 2);
Se([
  $()
], oe.prototype, "expanded", 2);
Se([
  $()
], oe.prototype, "error", 2);
oe = Se([
  Le(wi)
], oe);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.6.0 ${pe(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const ae = "custom:area-bubble-overview-card", Ke = "area-bubble-overview-card", Lt = "area-bubble-overview-card-editor", yt = "area-bubble-overview-card", ee = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256
}, ye = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16384
}, zt = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8
}, B = ["climate", "floor_heating", "covers", "lights_switches", "media"], qt = ["lights", "climate", "floor_heating", "switches", "covers", "media"], Ft = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, Qe = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, We = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  area_name_size: 17,
  show_shadows: !0,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "color-mix(in srgb, var(--secondary-background-color) 78%, transparent)",
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
  temperature_active_surface: "rgba(91, 86, 168, 0.96)"
}, _t = {
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
  section_order: B,
  quick_actions: qt,
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
  style: We,
  debug: !1
}, M = (e, t) => {
  const i = e.attributes.supported_features;
  return typeof i != "number" || (i & t) !== 0;
}, jt = (e) => Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], pa = /* @__PURE__ */ new Set(["onoff", "unknown"]), ua = (e) => {
  if (e.domain !== "light") return !1;
  const t = Array.isArray(e.entity.attributes.supported_color_modes) ? e.entity.attributes.supported_color_modes.map(String) : [], i = typeof e.entity.attributes.color_mode == "string" ? [e.entity.attributes.color_mode] : [];
  return [...t, ...i].some((a) => !pa.has(a)) || typeof e.entity.attributes.brightness == "number";
}, xt = (e) => {
  if (!e.powered) return 0;
  const t = e.entity.attributes.brightness;
  return typeof t != "number" || !Number.isFinite(t) ? 100 : Math.min(100, Math.max(0, Math.round(t / 255 * 100)));
}, G = (e, t) => {
  if (e.domain === "climate") {
    const i = t ? ee.TURN_ON : ee.TURN_OFF;
    if (M(e.entity, i)) return { service: t ? "turn_on" : "turn_off" };
    const a = jt(e);
    if (!t && a.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const r = a.find((o) => o !== "off");
    return t && r ? { service: "set_hvac_mode", data: { hvac_mode: r } } : void 0;
  }
  if (e.domain === "media_player") {
    const i = t ? ye.TURN_ON : ye.TURN_OFF;
    return M(e.entity, i) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  }
  if (e.domain === "water_heater")
    return M(e.entity, zt.ON_OFF) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  if (["light", "switch", "fan", "input_boolean"].includes(e.domain))
    return { service: t ? "turn_on" : "turn_off" };
}, Ht = 2, Ut = 1, Bt = (e, t) => t === "lights" ? e.domain === "light" : t === "switches" ? e.domain === "switch" && e.section === "lights_switches" : t === "climate" ? e.section === "climate" : t === "floor_heating" ? e.section === "floor_heating" : t === "covers" ? e.domain === "cover" : e.domain === "media_player", Me = (e, t) => e.allEntities.filter((i) => Bt(i, t)), ha = (e, t) => t.map((i) => ({ action: i, entities: Me(e, i) })).filter(({ entities: i }) => i.some((a) => a.powered)), Ye = (e, t, i) => {
  if (Bt(t, e)) {
    if (e === "covers") {
      const a = i ? Ut : Ht;
      return t.domain !== "cover" || !M(t.entity, a) ? void 0 : { service: i ? "open_cover" : "close_cover" };
    }
    return G(t, i);
  }
}, Vt = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const { entity: i, service: a } of e) {
    const r = `${a.domain}.${a.service}:${JSON.stringify(a.data ?? {})}`, o = t.get(r) ?? { ...a, entityIds: [] };
    o.entityIds.push(i.entityId), t.set(r, o);
  }
  return [...t.values()];
}, Jt = async (e, t, i) => {
  const a = await Promise.allSettled(
    t.map((o) => e.callService(o.domain, o.service, o.data, { entity_id: o.entityIds }))
  ), r = a.filter((o) => o.status === "rejected");
  if (r.length) throw new Error(`${r.length} of ${a.length} ${i} failed.`);
}, Gt = (e, t, i) => {
  const a = [];
  for (const r of Me(e, t)) {
    if (!r.available || r.protected || r.powered === i) continue;
    const o = Ye(t, r, i);
    o && a.push({ entity: r, service: { domain: r.domain, ...o } });
  }
  return a;
}, He = (e, t, i) => Gt(e, t, i).map(({ entity: a }) => a), ba = async (e, t, i, a) => {
  const r = Gt(t, i, a);
  await Jt(e, Vt(r), "area actions");
}, ma = (e, t, i) => {
  if (e.id === "covers") {
    const r = i ? Ut : Ht;
    return t.domain !== "cover" || !M(t.entity, r) ? void 0 : { domain: "cover", service: i ? "open_cover" : "close_cover" };
  }
  const a = G(t, i);
  return a ? { domain: t.domain, ...a } : void 0;
}, Kt = (e, t) => {
  const i = [];
  for (const a of e.entities) {
    if (!a.available || a.protected || a.powered === t) continue;
    const r = ma(e, a, t);
    r && i.push({ entity: a, service: r });
  }
  return i;
}, Ue = (e, t = !1) => Kt(e, t).map(({ entity: i }) => i), fa = async (e, t, i) => {
  const a = Kt(t, i);
  await Jt(e, Vt(a), "section actions");
}, F = (e, t, i, a) => {
  const r = t.split(".")[0] ?? "homeassistant";
  return e.callService(r, i, a, { entity_id: t });
}, V = (e) => !!e && typeof e == "object" && !Array.isArray(e), R = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], Qt = (e) => {
  const t = new Set(B), i = R(e).filter((a) => t.has(a));
  return [.../* @__PURE__ */ new Set([...i, ...B])];
}, Xe = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const i of B) {
    const a = R(e[i]);
    a.length && (t[i] = a);
  }
  return t;
}, Wt = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const i of B)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, ga = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(R(e).filter((i) => t.has(i)))];
}, va = (e) => {
  const t = V(e) ? e : {};
  return Object.fromEntries(
    Object.keys(Qe).map((i) => {
      const a = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, a || Qe[i]];
    })
  );
}, ya = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const [i, a] of Object.entries(e))
    V(a) && (t[i] = {
      ...typeof a.name == "string" && a.name.trim() ? { name: a.name.trim() } : {},
      ...typeof a.icon == "string" && a.icon.trim() ? { icon: a.icon.trim() } : {},
      ...typeof a.parent_area == "string" && a.parent_area.trim() ? { parent_area: a.parent_area.trim() } : {},
      ...typeof a.show_when_parent_collapsed == "boolean" ? { show_when_parent_collapsed: a.show_when_parent_collapsed } : {},
      ...typeof a.hidden == "boolean" ? { hidden: a.hidden } : {},
      ...typeof a.default_expanded == "boolean" ? { default_expanded: a.default_expanded } : {},
      ...typeof a.temperature_entity == "string" && a.temperature_entity.trim() ? { temperature_entity: a.temperature_entity.trim() } : {},
      ...typeof a.occupancy_count_entity == "string" && a.occupancy_count_entity.trim() ? { occupancy_count_entity: a.occupancy_count_entity.trim() } : {},
      occupancy_entities: R(a.occupancy_entities),
      ...Array.isArray(a.section_order) ? { section_order: Qt(a.section_order) } : {},
      section_titles: Wt(a.section_titles),
      entity_order: Xe(a.entity_order),
      include_entities: Xe(a.include_entities),
      exclude_entities: R(a.exclude_entities)
    });
  return t;
}, _a = (e) => {
  if (!V(e)) return {};
  const t = new Set(B), i = {};
  for (const [a, r] of Object.entries(e))
    V(r) && (i[a] = {
      ...typeof r.name == "string" && r.name.trim() ? { name: r.name.trim() } : {},
      ...typeof r.icon == "string" && r.icon.trim() ? { icon: r.icon.trim() } : {},
      ...typeof r.section == "string" && t.has(r.section) ? { section: r.section } : {},
      ...typeof r.hidden == "boolean" ? { hidden: r.hidden } : {},
      ...typeof r.protected == "boolean" ? { protected: r.protected } : {}
    });
  return i;
}, fe = (e) => {
  const t = { ..._t, ...e }, i = Wt(e.section_titles), a = V(e.style) ? e.style : {}, r = a.area_name_size, o = typeof r == "number" && Number.isFinite(r) ? Math.min(24, Math.max(11, r)) : We.area_name_size;
  return {
    ...t,
    type: ae,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    target_icon: typeof e.target_icon == "string" ? e.target_icon.trim() : "",
    show_area_expand_button: typeof e.show_area_expand_button == "boolean" ? e.show_area_expand_button : _t.show_area_expand_button,
    section_order: Qt(e.section_order),
    section_titles: Object.fromEntries(
      B.map((n) => [n, typeof i[n] == "string" ? i[n] : ""])
    ),
    quick_actions: ga(e.quick_actions ?? t.quick_actions),
    quick_action_icons: va(e.quick_action_icons),
    area_order: R(e.area_order),
    floor_heating_labels: R(t.floor_heating_labels),
    floor_heating_entities: R(t.floor_heating_entities),
    occupancy_device_classes: R(t.occupancy_device_classes),
    include_entities: Xe(e.include_entities),
    exclude_entities: R(t.exclude_entities),
    protected_labels: R(t.protected_labels),
    protected_entities: R(t.protected_entities),
    area_overrides: ya(e.area_overrides),
    entity_overrides: _a(e.entity_overrides),
    style: { ...We, ...a, area_name_size: o }
  };
}, xa = (e) => {
  if (!V(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== ae) throw new Error(`Card type must be ${ae}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, wa = {
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
}, $a = {
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
}, ka = {
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
}, Aa = (e, t) => typeof t.rtl == "boolean" ? t.rtl : Y(e, t) === "he" || document.documentElement.dir === "rtl", C = (e, t, i) => wa[Y(e, t)][i], Sa = (e, t, i, a) => a || t.section_titles[i] || $a[Y(e, t)][i], wt = (e, t, i) => ka[Y(e, t)][i], ue = (e) => e.split(".")[0] ?? "", Ze = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, Ea = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(a.area_id ?? a.id ?? i, a);
  return t;
}, Ca = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), Oe = (e, t) => {
  var r, o;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (o = e == null ? void 0 : e.devices) == null ? void 0 : o[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (a == null ? void 0 : a.area_id) ?? void 0;
}, Ta = (e, t) => {
  var r, o;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (o = e == null ? void 0 : e.devices) == null ? void 0 : o[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []])];
}, Oa = (e, t, i, a) => {
  var n, s, c;
  const r = e.entity_overrides[a];
  if (r != null && r.section) return r.section;
  const o = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const p of e.section_order)
    if ((s = (n = o == null ? void 0 : o.include_entities) == null ? void 0 : n[p]) != null && s.includes(a) || (c = e.include_entities[p]) != null && c.includes(a)) return p;
}, Ia = (e, t, i, a, r, o) => {
  const n = Oa(e, t, i, a);
  if (n) return n;
  if (e.floor_heating_entities.includes(a) || o.some((s) => e.floor_heating_labels.includes(s)))
    return "floor_heating";
  if (r === "climate" || r === "fan") return "climate";
  if (r === "cover") return "covers";
  if (r === "light" || r === "switch") return "lights_switches";
  if (r === "media_player") return "media";
}, Pa = (e, t = ue(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, Yt = (e, t = ue(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable"].includes(i) ? !1 : t === "media_player" ? !["off", "standby"].includes(i) : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : i === "on";
}, Na = (e) => {
  const t = e.filter((r) => r.domain === "climate" && r.section === "climate" && r.available);
  if (!t.length) return "none";
  const i = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = String(r.entity.attributes.hvac_action ?? "").toLowerCase(), n = String(r.entity.state ?? "").toLowerCase();
    o === "heating" ? i.add("heat") : o === "cooling" ? i.add("cool") : ["drying", "fan"].includes(o) ? i.add("active") : o === "off" ? i.add("off") : n === "heat" ? i.add("heat") : n === "cool" ? i.add("cool") : n === "off" ? i.add("off") : i.add("active");
  }
  const a = [...i].filter((r) => r !== "off");
  return a.length ? new Set(a).size > 1 || i.has("active") ? "active" : i.has("heat") ? "heat" : i.has("cool") ? "cool" : "active" : "off";
}, Ma = (e, t, i) => {
  var a;
  return i || ((a = e == null ? void 0 : e.formatEntityName) == null ? void 0 : a.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, Ra = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), $t = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, Be = (e) => {
  if (!e) return {};
  const t = Ze(e.attributes.current_temperature), i = Ze(e.state), a = t ?? i, r = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: a, unit: r };
}, kt = (e) => {
  if (!e.length) return;
  const t = [...e].sort((a, r) => a - r), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, Da = (e, t, i, a, r, o) => {
  var m, h;
  const n = r.area_overrides[t] ?? r.area_overrides[(i == null ? void 0 : i.name) ?? ""], s = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((l) => !!l).filter((l) => !o.has(l)))];
  for (const l of s) {
    const g = Be(e == null ? void 0 : e.states[l]);
    if (g.value !== void 0) return { temperature: g.value, unit: g.unit };
  }
  const c = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => !!l).filter((l) => ue(l.entity_id) === "sensor" && l.attributes.device_class === "temperature").map(Be).filter((l) => l.value !== void 0);
  if (c.length) return { temperature: kt(c.map((l) => l.value)), unit: (m = c.find((l) => l.unit)) == null ? void 0 : m.unit };
  const p = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => l !== void 0 && ue(l.entity_id) === "climate").map(Be).filter((l) => l.value !== void 0);
  return { temperature: kt(p.map((l) => l.value)), unit: (h = p.find((l) => l.unit)) == null ? void 0 : h.unit };
}, La = (e, t, i, a, r, o) => {
  const n = r.area_overrides[t] ?? r.area_overrides[i ?? ""], s = n == null ? void 0 : n.occupancy_count_entity;
  if (s && !o.has(s)) {
    const v = e == null ? void 0 : e.states[s];
    if (v) {
      const _ = Ze(v.state);
      if (_ !== void 0) {
        const d = Math.max(0, Math.round(_));
        return { occupancy: d > 0 ? "occupied" : "vacant", count: d, countSource: "entity", entities: [s] };
      }
      return { occupancy: "unknown", countSource: "entity", entities: [s] };
    }
  }
  const c = ((n == null ? void 0 : n.occupancy_entities) ?? []).filter((v) => !o.has(v)), p = c.length ? c : a.filter((v) => {
    const _ = e == null ? void 0 : e.states[v];
    return ue(v) === "binary_sensor" && r.occupancy_device_classes.includes(String((_ == null ? void 0 : _.attributes.device_class) ?? ""));
  });
  if (!p.length) return { occupancy: "none", countSource: "none", entities: [] };
  const m = p.map((v) => {
    var _;
    return String(((_ = e == null ? void 0 : e.states[v]) == null ? void 0 : _.state) ?? "unknown").toLowerCase();
  }), h = /* @__PURE__ */ new Set(["on", "home", "occupied", "present", "detected"]), l = /* @__PURE__ */ new Set(["off", "not_home", "away", "vacant", "clear"]), g = m.filter((v) => h.has(v)).length;
  return g > 0 ? { occupancy: "occupied", count: g, countSource: "sensors", entities: p } : m.every((v) => l.has(v)) ? { occupancy: "vacant", count: 0, countSource: "sensors", entities: p } : { occupancy: "unknown", countSource: "sensors", entities: p };
}, za = (e, t, i, a, r) => {
  var _, d, f, w, y, L;
  const o = t.area_overrides[i] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""];
  if (o != null && o.hidden) return;
  const n = Object.values((o == null ? void 0 : o.include_entities) ?? {}).flat(), s = [.../* @__PURE__ */ new Set([...r, ...n])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(o == null ? void 0 : o.exclude_entities) ?? []]);
  for (const [x, P] of Object.entries(t.entity_overrides))
    P.hidden === !0 && c.add(x);
  for (const x of s)
    ((_ = t.entity_overrides[x]) == null ? void 0 : _.hidden) === !0 && c.add(x);
  const p = s.filter((x) => !c.has(x)), m = [];
  for (const x of s) {
    const P = e == null ? void 0 : e.states[x];
    if (!P || c.has(x)) continue;
    const A = (d = e == null ? void 0 : e.entities) == null ? void 0 : d[x], q = A != null && A.device_id ? (f = e == null ? void 0 : e.devices) == null ? void 0 : f[A.device_id] : void 0, E = t.entity_overrides[x];
    if (E != null && E.hidden || A != null && A.hidden || A != null && A.hidden_by || A != null && A.disabled_by || q != null && q.disabled_by || (A == null ? void 0 : A.entity_category) === "config" || (A == null ? void 0 : A.entity_category) === "diagnostic") continue;
    const J = ue(x), ne = Ta(e, x), rt = Ia(t, i, a == null ? void 0 : a.name, x, J, ne);
    rt && m.push({
      entity: P,
      entityId: x,
      domain: J,
      name: Ma(e, P, E == null ? void 0 : E.name),
      icon: Ra(P, J, E == null ? void 0 : E.icon),
      areaId: i,
      section: rt,
      labels: ne,
      available: !["unavailable", "unknown"].includes(P.state),
      active: Pa(P, J),
      powered: Yt(P, J),
      protected: (E == null ? void 0 : E.protected) === !0 || t.protected_entities.includes(x) || ne.some((Zt) => t.protected_labels.includes(Zt))
    });
  }
  const l = ((w = o == null ? void 0 : o.section_order) != null && w.length ? o.section_order : t.section_order).map((x) => {
    var A;
    const P = m.filter((q) => q.section === x).sort(
      (q, E) => {
        var J, ne;
        return $t((J = o == null ? void 0 : o.entity_order) == null ? void 0 : J[x], q.entityId) - $t((ne = o == null ? void 0 : o.entity_order) == null ? void 0 : ne[x], E.entityId) || q.name.localeCompare(E.name);
      }
    );
    return {
      id: x,
      title: Sa(e, t, x, (A = o == null ? void 0 : o.section_titles) == null ? void 0 : A[x]),
      icon: Ft[x],
      entities: P,
      activeCount: P.filter((q) => q.powered).length
    };
  }).filter((x) => t.show_empty_sections || x.entities.length > 0), g = Da(e, i, a, p, t, c), v = La(e, i, a == null ? void 0 : a.name, p, t, c);
  return {
    id: i,
    name: (o == null ? void 0 : o.name) ?? (a == null ? void 0 : a.name) ?? i,
    icon: (o == null ? void 0 : o.icon) ?? (a == null ? void 0 : a.icon) ?? "mdi:floor-plan",
    floorId: (a == null ? void 0 : a.floor_id) ?? void 0,
    parentAreaId: o == null ? void 0 : o.parent_area,
    showWhenParentCollapsed: (o == null ? void 0 : o.show_when_parent_collapsed) === !0,
    sections: l,
    allEntities: m,
    temperature: g.temperature,
    temperatureUnit: g.unit ?? ((L = (y = e == null ? void 0 : e.config) == null ? void 0 : y.unit_system) == null ? void 0 : L.temperature) ?? "°C",
    temperatureMode: Na(m),
    occupancy: v.occupancy,
    occupancyCount: v.count,
    occupancyCountSource: v.countSource,
    occupancyEntities: v.entities
  };
}, qa = (e, t, i) => {
  if (t.area) {
    const a = [...i.entries()].find(([o, n]) => o === t.area || n.name === t.area);
    if (!a) return { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
    const r = t.area_overrides[a[0]] ?? t.area_overrides[a[1].name];
    return { ids: [a[0]], targetName: a[1].name, targetIcon: t.target_icon || (r == null ? void 0 : r.icon) || a[1].icon || "mdi:floor-plan", kind: "area", warnings: [] };
  }
  if (t.floor) {
    const a = Ca(e).find((o) => o.id === t.floor || o.name === t.floor);
    if (!a) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const r = [...i.entries()].filter(([, o]) => o.floor_id === a.id).map(([o]) => o);
    return { ids: r, targetName: a.name, targetIcon: t.target_icon || a.icon || "mdi:home-floor-0", kind: "floor", warnings: r.length ? [] : [`Floor has no areas: ${a.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, Re = (e, t) => {
  var _;
  const i = Ea(e), a = qa(e, t, i), r = /* @__PURE__ */ new Map();
  for (const d of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const f = Oe(e, d);
    if (!f) continue;
    const w = r.get(f) ?? [];
    w.push(d), r.set(f, w);
  }
  const o = (d, f) => {
    const w = t.area_order.findIndex((y) => y === d || y === f);
    return w < 0 ? Number.MAX_SAFE_INTEGER : w;
  }, n = a.ids.map((d) => za(e, t, d, i.get(d), r.get(d) ?? [])).filter((d) => !!d).sort((d, f) => o(d.id, d.name) - o(f.id, f.name) || d.name.localeCompare(f.name)), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), p = (d, f) => {
    if (!d) return;
    const w = c.get(d) ?? /* @__PURE__ */ new Set();
    w.add(f), c.set(d, w);
  };
  for (const d of n) {
    s.set(d.id, d.id), p(d.name, d.id);
    const f = (_ = i.get(d.id)) == null ? void 0 : _.name;
    p(f, d.id);
  }
  for (const [d, f] of c)
    f.size === 1 && !s.has(d) && s.set(d, [...f][0]);
  const m = n.map((d) => {
    const f = d.parentAreaId ? s.get(d.parentAreaId) : void 0;
    return { ...d, parentAreaId: f && f !== d.id ? f : void 0 };
  }), h = new Map(m.filter((d) => d.parentAreaId).map((d) => [d.id, d.parentAreaId])), l = /* @__PURE__ */ new Set();
  for (const d of m) {
    const f = [], w = /* @__PURE__ */ new Map();
    let y = d.id;
    for (; y; ) {
      const L = w.get(y);
      if (L !== void 0) {
        for (const x of f.slice(L)) l.add(x);
        break;
      }
      w.set(y, f.length), f.push(y), y = h.get(y);
    }
  }
  const g = m.map((d) => l.has(d.id) ? { ...d, parentAreaId: void 0 } : d), v = l.size ? [`Area parent cycle ignored: ${[...l].join(", ")}`] : [];
  return {
    areas: g,
    targetName: t.title || a.targetName,
    targetIcon: a.targetIcon,
    targetKind: a.kind,
    warnings: [...a.warnings, ...v]
  };
}, Xt = (e) => {
  const t = new Map(e.map((n) => [n.id, n])), i = /* @__PURE__ */ new Map();
  for (const n of e)
    n.parentAreaId && n.parentAreaId !== n.id && t.has(n.parentAreaId) && i.set(n.id, n.parentAreaId);
  const a = /* @__PURE__ */ new Set();
  for (const n of e) {
    const s = [], c = /* @__PURE__ */ new Map();
    let p = n.id;
    for (; p; ) {
      const m = c.get(p);
      if (m !== void 0) {
        for (const h of s.slice(m)) a.add(h);
        break;
      }
      c.set(p, s.length), s.push(p), p = i.get(p);
    }
  }
  const r = /* @__PURE__ */ new Map(), o = [];
  for (const n of e) {
    const s = a.has(n.id) ? void 0 : i.get(n.id);
    if (!s) {
      o.push(n);
      continue;
    }
    const c = r.get(s) ?? [];
    c.push(n), r.set(s, c);
  }
  return { roots: o, children: r };
}, Fa = (e, t) => {
  const { roots: i, children: a } = Xt(e), r = [], o = /* @__PURE__ */ new Set(), n = (s) => {
    if (o.has(s.id)) return;
    o.add(s.id), r.push(s);
    const c = t(s);
    for (const p of a.get(s.id) ?? [])
      (c || p.showWhenParentCollapsed) && n(p);
  };
  for (const s of i) n(s);
  return r;
};
var ja = Object.defineProperty, Ha = Object.getOwnPropertyDescriptor, X = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Ha(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && ja(t, i, r), r;
};
let j = class extends W {
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
    const a = Re(this.hass, e), r = this.targetAreas(e), o = this.entityMapByArea();
    return r.length && !r.some((n) => n.id === this.activeAreaId) && queueMicrotask(() => this.activeAreaId = r[0].id), u`
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
        ${this.renderAreas(e, r, o, t)}
        ${this.renderEntities(e, a, r, t)}
        ${this.renderAppearance(e, t)}
        ${this.renderAdvanced(e, t)}
      </div>
    `;
  }
  renderTarget(e, t) {
    var s;
    const i = this.areaOptions(), a = this.floorOptions(), r = this.targetMode === "area" ? this.areaIdFor(e.area) : this.floorIdFor(e.floor), n = ((s = (this.targetMode === "area" ? i : a).find((c) => c.id === r)) == null ? void 0 : s.icon) ?? (this.targetMode === "floor" ? "mdi:home-floor-0" : "mdi:floor-plan");
    return u`
      <details open>
        ${this.summary("mdi:map-marker-radius", this.l("יעד", "Target", t), this.l("בחרו חדר יחיד או קומה שלמה", "Choose one room or a complete floor", t))}
        <div class="panel">
          <div class="segmented">
            <button type="button" class="segment ${this.targetMode === "area" ? "active" : ""}" @click=${() => this.targetMode = "area"}>${this.l("אזור", "Area", t)}</button>
            <button type="button" class="segment ${this.targetMode === "floor" ? "active" : ""}" @click=${() => this.targetMode = "floor"}>${this.l("קומה", "Floor", t)}</button>
          </div>
          <div class="field">
            <label>${this.targetMode === "area" ? this.l("אזור להצגה", "Area to show", t) : this.l("קומה להצגה", "Floor to show", t)}</label>
            <select .value=${r} @change=${(c) => this.setTarget(c.target.value)}>
              <option value="" ?selected=${!r}>${this.l("בחרו...", "Choose...", t)}</option>
              ${(this.targetMode === "area" ? i : a).map((c) => u`<option value=${c.id} ?selected=${c.id === r}>${c.name}</option>`)}
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
          ${this.targetMode === "floor" && !a.length ? u`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", t)}</div>` : b}
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
    return u`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", t), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", t))}
        <div class="panel"><div class="settings-list">${i.map(([a, r, o, n]) => this.booleanRow(r, o, n, (s) => this.commitKey(a, s)))}</div></div>
      </details>
    `;
  }
  renderSections(e, t) {
    return u`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", t), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", t))}
        <div class="panel">
          <div class="hint">${this.l("ישויות חדשות מצטרפות אוטומטית בסוף הסעיף, כך שהסידור הידני נשאר יציב.", "New entities are appended automatically, so your manual order remains stable.", t)}</div>
          <div class="order-list">
            ${e.section_order.map((i, a) => u`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${Ft[i]}></ha-icon></span>
                <div class="order-main field">
                  <label>${this.sectionDefaultName(i, t)}</label>
                  <input type="text" .value=${e.section_titles[i]} placeholder=${this.sectionDefaultName(i, t)} @change=${(r) => this.setSectionTitle(i, r.target.value)} />
                </div>
                ${this.orderButtons(a, e.section_order.length, () => this.moveSection(i, -1), () => this.moveSection(i, 1))}
              </div>
            `)}
          </div>
          <div class="setting-title">${this.l("פעולות מהירות", "Quick actions", t)}</div>
          <div class="order-list">
            ${[...e.quick_actions, ...qt.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      var s;
      const a = e.quick_actions.includes(i), r = e.quick_actions.indexOf(i), o = (s = this.config.quick_action_icons) == null ? void 0 : s[i], n = typeof o == "string" ? o : "";
      return u`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${e.quick_action_icons[i]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(i, t)}</div></div>
                  <div class="area-actions">
                    ${a ? this.orderButtons(r, e.quick_actions.length, () => this.moveQuickAction(i, -1), () => this.moveQuickAction(i, 1)) : b}
                    ${this.switchControl(a, (c) => this.toggleQuickAction(i, c), this.quickName(i, t))}
                  </div>
                  <div class="quick-action-icon-field">
                    ${this.iconField(
        `${this.l("אייקון פעולה", "Action icon", t)} · ${this.quickName(i, t)}`,
        n,
        Qe[i],
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
    return u`
      <details>
        ${this.summary("mdi:floor-plan", this.l("אזורים בקומה", "Areas", a), this.l("סדר, כותרת, אייקון וחיישנים מועדפים", "Order, title, icon, and preferred sensors", a))}
        <div class="panel">
          ${t.length ? u`<div class="order-list">${t.map((r) => {
      const o = this.normalizedParentId(r.id, e), n = t.filter((s) => this.normalizedParentId(s.id, e) === o);
      return this.renderAreaEditor(r, n.findIndex((s) => s.id === r.id), n.length, e, i.get(r.id) ?? [], a);
    })}</div>` : u`<div class="empty">${this.l("בחרו יעד כדי לערוך אזורים", "Choose a target to edit its areas", a)}</div>`}
        </div>
      </details>
    `;
  }
  renderAreaEditor(e, t, i, a, r, o) {
    var v, _;
    const n = a.area_overrides[e.id] ?? a.area_overrides[e.name] ?? {}, s = this.activeAreaId === e.id, c = r.filter(
      (d) => d.entity_id.startsWith("climate.") || d.entity_id.startsWith("sensor.") && d.attributes.device_class === "temperature"
    ), p = r.filter((d) => {
      const f = d.entity_id.split(".")[0];
      return f === "binary_sensor" || f === "person" || f === "device_tracker";
    }), m = r.filter((d) => {
      const f = d.entity_id.split(".")[0];
      return ["sensor", "input_number", "counter"].includes(f ?? "") && (Number.isFinite(Number(d.state)) || d.entity_id === n.occupancy_count_entity);
    }), h = this.targetAreas(a).filter((d) => {
      const f = a.area_overrides[d.id] ?? a.area_overrides[d.name];
      return d.id !== e.id && (f == null ? void 0 : f.hidden) !== !0 && !this.wouldCreateAreaCycle(e.id, d.id, a);
    }), l = n.parent_area ? ((v = this.areaOptions().find((d) => d.id === n.parent_area || d.name === n.parent_area)) == null ? void 0 : v.id) ?? "" : "", g = ((_ = this.areaOptions().find((d) => d.id === l)) == null ? void 0 : _.name) ?? l;
    return u`
      <div class="area-card ${n.hidden ? "hidden" : ""} ${l ? "child" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${n.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${s ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${n.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, a), () => this.moveArea(e.id, 1, a))}
            ${this.switchControl(!n.hidden, (d) => this.updateAreaOverride(e.id, { hidden: !d }), this.l("הצג אזור", "Show area", o))}
          </div>
        </div>
        ${s ? u`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", o)}</label><input type="text" .value=${n.name ?? ""} placeholder=${e.name} @change=${(d) => this.updateAreaOverride(e.id, { name: d.target.value || void 0 })} /></div>
                ${this.iconField(this.l("אייקון האזור", "Area icon", o), n.icon ?? "", e.icon, o, (d) => this.updateAreaOverride(e.id, { icon: d || void 0 }))}
              </div>
              <div class="field">
                <label>${this.l("תת־אזור של", "Parent area", o)}</label>
                <select .value=${l} @change=${(d) => this.updateAreaOverride(e.id, { parent_area: d.target.value || void 0 })}>
                  <option value="">${this.l("ללא אזור אב", "No parent area", o)}</option>
                  ${h.map((d) => u`<option value=${d.id}>${d.name}</option>`)}
                </select>
                <div class="hint">${this.l("הקשר הוא חזותי בלבד; המצב והפעולות של כל אזור נשארים עצמאיים.", "Nesting is visual only; every area's state and actions remain independent.", o)}</div>
              </div>
              ${l ? this.booleanRow(
      this.l("הצג כשהאזור הראשי מכווץ", "Show when parent is collapsed", o),
      this.l(
        `כבוי כברירת מחדל. כשהאפשרות פעילה, תת־האזור נשאר גלוי בתוך ${g} גם כשהוא מכווץ. החצים בשורת האזור קובעים את הסדר רק בין תתי־אזורים של אותו אזור אב.`,
        `Off by default. When enabled, this child remains visible inside ${g} while the parent is collapsed. The arrows in the area row order only children of the same parent.`,
        o
      ),
      n.show_when_parent_collapsed ?? !1,
      (d) => this.updateAreaOverride(e.id, { show_when_parent_collapsed: d })
    ) : b}
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", o)}</label>
                <select .value=${n.temperature_entity ?? ""} @change=${(d) => this.updateAreaOverride(e.id, { temperature_entity: d.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", o)}</option>
                  ${c.map((d) => u`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור ספירת נוכחים", "Occupancy count source", o)}</label>
                <select .value=${n.occupancy_count_entity ?? ""} @change=${(d) => this.updateAreaOverride(e.id, { occupancy_count_entity: d.target.value || void 0 })}>
                  <option value="">${this.l("ספירת חיישני נוכחות פעילים", "Count active presence sensors", o)}</option>
                  ${m.map((d) => u`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                </select>
                <div class="hint">${this.l("בחרו חיישן מספרי כדי להציג מספר אנשים אמיתי; אחרת יוצג מספר חיישני הנוכחות הפעילים.", "Choose a numeric sensor for a true people count; otherwise the card shows the number of active presence sensors.", o)}</div>
              </div>
              ${p.length ? u`<div class="field"><label>${this.l("מקורות נוכחות (ריק = אוטומטי)", "Presence sources (empty = automatic)", o)}</label><div class="entity-flags">${p.map((d) => {
      var w;
      const f = ((w = n.occupancy_entities) == null ? void 0 : w.includes(d.entity_id)) ?? !1;
      return u`<label class="check-label"><input type="checkbox" .checked=${f} @change=${(y) => this.toggleAreaList(e.id, "occupancy_entities", d.entity_id, y.target.checked)} />${this.entityName(d)}</label>`;
    })}</div></div>` : b}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", o)}</div></div>${this.switchControl(n.default_expanded ?? a.default_expanded, (d) => this.updateAreaOverride(e.id, { default_expanded: d }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", o)}</div>
              <div class="inline-fields">
                ${a.section_order.map((d) => {
      var f;
      return u`<div class="field"><label>${this.sectionDefaultName(d, o)}</label><input type="text" .value=${((f = n.section_titles) == null ? void 0 : f[d]) ?? ""} placeholder=${a.section_titles[d] || this.sectionDefaultName(d, o)} @change=${(w) => this.setAreaSectionTitle(e.id, d, w.target.value)} /></div>`;
    })}
              </div>
            ` : b}
      </div>
    `;
  }
  renderEntities(e, t, i, a) {
    var h;
    const r = this.activeAreaId || ((h = i[0]) == null ? void 0 : h.id) || "", o = t.areas.find((l) => l.id === r), n = Re(this.hass, this.configForEntityEditor(e, r)).areas.find((l) => l.id === r), s = new Map(((n == null ? void 0 : n.allEntities) ?? (o == null ? void 0 : o.allEntities) ?? []).map((l) => [l.entityId, l])), c = this.entitiesForEditor(r, s, e), p = this.unclassifiedCandidates(r, s), m = c.filter((l) => `${l.name} ${l.entityId} ${l.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return u`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", a), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", a))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${r} @change=${(l) => this.activeAreaId = l.target.value}>${i.map((l) => u`<option value=${l.id}>${l.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", a)} .value=${this.entitySearch} @input=${(l) => this.entitySearch = l.target.value} />
          </div>
          <div class="hint">${this.l("לכל רכיב יש כפתור הסתרה מלא. רכיב מוסתר נשאר כאן לשחזור, אך אינו מוצג ואינו משפיע על צבע, מונים או פעולות האזור.", "Every device has a complete hide control. Hidden devices remain here for restore, but do not appear or affect area color, counts, or actions.", a)}</div>
          ${p.length ? u`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", a)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", a)}</label>
                      <select .value=${this.candidateEntityId} @change=${(l) => this.candidateEntityId = l.target.value}>
                        <option value="">${this.l("בחרו...", "Choose...", a)}</option>
                        ${p.map((l) => u`<option value=${l.entity_id}>${this.entityName(l)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", a)}</label>
                      <select .value=${this.candidateSection} @change=${(l) => this.candidateSection = l.target.value}>
                        ${B.map((l) => u`<option value=${l}>${this.sectionDefaultName(l, a)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", a)}
                  </button>
                </div>
              ` : b}
          <div class="entity-list">
            ${m.length ? m.map((l) => {
      const g = e.entity_overrides[l.entityId] ?? {}, v = c.filter((y) => y.section === l.section), _ = v.findIndex((y) => y.entityId === l.entityId), d = this.isEntityExcluded(r, l.entityId, e), f = this.isEntityGloballyExcluded(l.entityId, e), w = f ? this.l("מוסתר גלובלית — ניתן לשנות במתקדם", "Globally hidden — change it in Advanced", a) : d ? this.l("החזר רכיב לאזור", "Restore device to area", a) : this.l("הסתר רכיב לחלוטין מהאזור", "Hide device completely from area", a);
      return u`
                    <div class="entity-item ${!d && l.active ? "active" : ""} ${d ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${g.icon ?? l.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${g.name || l.name}</div><div class="meta">${l.entityId}${d ? ` · ${f ? this.l("מוסתר גלובלית", "globally hidden", a) : this.l("מוסר מהאזור", "removed from area", a)}` : ""}</div></div>
                      <button
                        class="visibility-button ${d ? "restore" : ""}"
                        type="button"
                        title=${w}
                        aria-label=${`${w}: ${l.name}`}
                        ?disabled=${f}
                        @click=${() => this.setEntityVisible(r, l.entityId, d)}
                      ><ha-icon icon=${d ? "mdi:restore" : "mdi:eye-off-outline"}></ha-icon></button>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", a)}</label><input type="text" .value=${g.name ?? ""} placeholder=${l.name} @change=${(y) => this.updateEntityOverride(l.entityId, { name: y.target.value || void 0 })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", a)}</label><select .value=${g.section ?? l.section} @change=${(y) => this.updateEntityOverride(l.entityId, { section: y.target.value })}>${B.map((y) => u`<option value=${y}>${this.sectionDefaultName(y, a)}</option>`)}</select></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", a), g.icon ?? "", l.icon, a, (y) => this.updateEntityOverride(l.entityId, { icon: y || void 0 }))}
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${g.protected ?? l.protected} @change=${(y) => this.updateEntityOverride(l.entityId, { protected: y.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", a)}</label>
                        ${this.orderButtons(_, v.length, () => this.moveEntity(r, l.section, l.entityId, -1, v.map((y) => y.entityId)), () => this.moveEntity(r, l.section, l.entityId, 1, v.map((y) => y.entityId)))}
                      </div>
                    </div>
                  `;
    }) : u`<div class="empty">${this.l("אין רכיבים להצגה באזור זה", "No devices to show in this area", a)}</div>`}
          </div>
        </div>
      </details>
    `;
  }
  renderAppearance(e, t) {
    return u`
      <details>
        ${this.summary("mdi:palette-outline", this.l("מראה ושפה", "Appearance and language", t), this.l("צבעים, מרווחים ו-RTL", "Colors, spacing, and RTL", t))}
        <div class="panel">
          <div class="inline-fields">
            ${this.numberField(this.l("עיגול פינות", "Corner radius", t), e.style.border_radius, 4, 40, (i) => this.setStyle("border_radius", i))}
            ${this.numberField(this.l("טשטוש זכוכית", "Glass blur", t), e.style.blur, 0, 40, (i) => this.setStyle("blur", i))}
            ${this.numberField(this.l("גובה שורה", "Row height", t), e.style.row_height, 44, 84, (i) => this.setStyle("row_height", i))}
            ${this.numberField(this.l("גודל שם חדר", "Room name size", t), e.style.area_name_size, 11, 24, (i) => this.setStyle("area_name_size", i))}
            ${this.numberField(this.l("מרווח סעיפים", "Section gap", t), e.style.section_gap, 4, 30, (i) => this.setStyle("section_gap", i))}
          </div>
          <div class="setting-title">${this.l("צבעי מצב", "State colors", t)}</div>
          <div class="state-preview">
            <div class="state-preview-item off" style=${`--preview-surface: ${e.style.row_background}`}>${this.l("כבוי", "OFF", t)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${e.style.active_surface}`}>${this.l("דלוק", "ON", t)}</div>
          </div>
          <div class="inline-fields">
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
    return u`
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
    return u`<summary><ha-icon icon=${e}></ha-icon><span><span class="summary-title">${t}</span><span class="summary-subtitle">${i}</span></span><ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon></summary>`;
  }
  booleanRow(e, t, i, a) {
    return u`<div class="setting-row"><div class="setting-main"><div class="setting-title">${e}</div>${t ? u`<div class="meta">${t}</div>` : b}</div>${this.switchControl(i, a, e)}</div>`;
  }
  switchControl(e, t, i) {
    return u`<label class="switch" title=${i}><input type="checkbox" .checked=${e} aria-label=${i} @change=${(a) => t(a.target.checked)} /><span></span></label>`;
  }
  orderButtons(e, t, i, a) {
    return u`<div class="order-controls"><button class="icon-button" type="button" ?disabled=${e <= 0} @click=${i} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="icon-button" type="button" ?disabled=${e < 0 || e >= t - 1} @click=${a} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;
  }
  numberField(e, t, i, a, r) {
    return u`<div class="field"><label>${e}</label><input type="number" min=${i} max=${a} .value=${String(t)} @change=${(o) => r(Number(o.target.value))} /></div>`;
  }
  listField(e, t, i) {
    return u`<div class="field"><label>${e}</label><textarea .value=${t.join(`
`)} @change=${(a) => i(this.splitList(a.target.value))}></textarea></div>`;
  }
  iconField(e, t, i, a, r) {
    const o = t.trim() || i || "mdi:circle-outline";
    return u`
      <div class="field">
        <label>${e}</label>
        <div class="icon-picker-row">
          <span class="icon-preview"><ha-icon icon=${o}></ha-icon></span>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${t}
            @value-changed=${(n) => r(this.controlValue(n))}
          ></ha-icon-picker>
          <button class="reset-button" type="button" ?disabled=${!t} @click=${() => r("")}>${this.l("איפוס", "Reset", a)}</button>
        </div>
        <input type="text" dir="ltr" .value=${t} placeholder=${i} @change=${(n) => r(n.target.value.trim())} />
        <div class="hint">${this.l("אפשר לבחור מהרשימה או להזין אייקון MDI ידנית.", "Choose from the picker or enter an MDI icon manually.", a)}</div>
      </div>
    `;
  }
  colorField(e, t, i, a, r) {
    var n;
    const o = ((n = this.config.style) == null ? void 0 : n[t]) !== void 0;
    return u`
      <div class="field">
        <label>${e}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(i, a)} aria-label=${e} @input=${(s) => this.setStyle(t, s.target.value)} />
          <input type="text" .value=${i} aria-label=${`${e} CSS`} @change=${(s) => this.setStyle(t, s.target.value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!o} @click=${() => this.setStyle(t, void 0)}>${this.l("איפוס", "Reset", r)}</button>
        </div>
      </div>
    `;
  }
  pickerColor(e, t) {
    var r;
    const i = (r = e.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) == null ? void 0 : r[1];
    if (i) return i.length === 3 ? `#${[...i].map((o) => `${o}${o}`).join("")}` : `#${i}`;
    const a = e.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    return a ? `#${a.slice(1, 4).map((o) => Math.max(0, Math.min(255, Math.round(Number(o)))).toString(16).padStart(2, "0")).join("")}` : t;
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
      i = t.filter((r) => r.floorId === a);
    }
    return i.sort((a, r) => {
      const o = e.area_order.findIndex((s) => s === a.id || s === a.name), n = e.area_order.findIndex((s) => s === r.id || s === r.name);
      return (o < 0 ? Number.MAX_SAFE_INTEGER : o) - (n < 0 ? Number.MAX_SAFE_INTEGER : n) || a.name.localeCompare(r.name);
    });
  }
  entityMapByArea() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const i of Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {})) {
      const a = Oe(this.hass, i.entity_id);
      if (!a) continue;
      const r = e.get(a) ?? [];
      r.push(i), e.set(a, r);
    }
    return e;
  }
  entitiesForEditor(e, t, i) {
    var r, o, n;
    const a = [...t.values()];
    for (const s of Object.values(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      if (Oe(this.hass, s.entity_id) !== e || t.has(s.entity_id)) continue;
      const c = (n = (o = this.hass) == null ? void 0 : o.entities) == null ? void 0 : n[s.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const p = i.entity_overrides[s.entity_id];
      if (!(p != null && p.section)) continue;
      const m = s.entity_id.split(".")[0] ?? "";
      a.push({
        entity: s,
        entityId: s.entity_id,
        domain: m,
        name: p.name ?? this.entityName(s),
        icon: p.icon ?? String(s.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: p.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(s.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(s.state),
        powered: Yt(s, m),
        protected: p.protected === !0
      });
    }
    return a;
  }
  unclassifiedCandidates(e, t) {
    var a;
    const i = /* @__PURE__ */ new Set(["input_boolean", "water_heater"]);
    return Object.values(((a = this.hass) == null ? void 0 : a.states) ?? {}).filter((r) => {
      var n, s, c, p;
      if (Oe(this.hass, r.entity_id) !== e || t.has(r.entity_id) || (s = (n = this.config.entity_overrides) == null ? void 0 : n[r.entity_id]) != null && s.section) return !1;
      const o = (p = (c = this.hass) == null ? void 0 : c.entities) == null ? void 0 : p[r.entity_id];
      return o != null && o.hidden || o != null && o.hidden_by || o != null && o.disabled_by || o != null && o.entity_category ? !1 : i.has(r.entity_id.split(".")[0] ?? "");
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
    const i = [...fe(this.config).quick_actions], a = t ? [...i.filter((r) => r !== e), e] : i.filter((r) => r !== e);
    this.commitKey("quick_actions", a);
  }
  moveQuickAction(e, t) {
    const i = [...fe(this.config).quick_actions];
    this.moveValue(i, e, t), this.commitKey("quick_actions", i);
  }
  setQuickActionIcon(e, t) {
    const i = this.config.quick_action_icons, a = i && typeof i == "object" && !Array.isArray(i) ? { ...i } : {}, r = t.trim();
    r ? a[e] = r : delete a[e], this.commit({ ...this.config, quick_action_icons: a });
  }
  normalizedParentId(e, t) {
    var n;
    const i = this.targetAreas(t), a = i.find((s) => s.id === e), r = t.area_overrides[e] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""], o = r == null ? void 0 : r.parent_area;
    if (o)
      return (n = i.find((s) => s.id === o || s.name === o)) == null ? void 0 : n.id;
  }
  wouldCreateAreaCycle(e, t, i) {
    const a = /* @__PURE__ */ new Set();
    let r = t;
    for (; r && !a.has(r); ) {
      if (r === e) return !0;
      a.add(r), r = this.normalizedParentId(r, i);
    }
    return !1;
  }
  moveArea(e, t, i) {
    const a = this.targetAreas(i), r = this.normalizedParentId(e, i), o = a.filter((h) => this.normalizedParentId(h.id, i) === r).map((h) => h.id), n = o.indexOf(e), s = o[n + t];
    if (n < 0 || !s) return;
    const c = a.map((h) => h.id), p = c.indexOf(e), m = c.indexOf(s);
    [c[p], c[m]] = [c[m], c[p]], this.commitKey("area_order", c);
  }
  updateAreaOverride(e, t) {
    var o;
    const i = { ...this.config.area_overrides ?? {} }, a = (o = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : o.name, r = this.currentAreaOverride(e);
    a && a !== e && delete i[a], i[e] = { ...r, ...t }, this.commit({ ...this.config, area_overrides: i });
  }
  toggleAreaList(e, t, i, a) {
    const o = [...this.currentAreaOverride(e)[t] ?? []].filter((n) => n !== i);
    a && o.push(i), this.updateAreaOverride(e, { [t]: o });
  }
  setAreaSectionTitle(e, t, i) {
    const a = this.currentAreaOverride(e);
    this.updateAreaOverride(e, { section_titles: { ...a.section_titles ?? {}, [t]: i || void 0 } });
  }
  updateEntityOverride(e, t) {
    var a;
    const i = ((a = this.config.entity_overrides) == null ? void 0 : a[e]) ?? {};
    this.commit({ ...this.config, entity_overrides: { ...this.config.entity_overrides ?? {}, [e]: { ...i, ...t } } });
  }
  configForEntityEditor(e, t) {
    var a;
    if (!t) return e;
    const i = e.area_overrides[t] ?? e.area_overrides[((a = this.areaOptions().find((r) => r.id === t)) == null ? void 0 : a.name) ?? ""] ?? {};
    return {
      ...e,
      exclude_entities: [],
      area_overrides: {
        ...e.area_overrides,
        [t]: { ...i, hidden: !1, exclude_entities: [] }
      },
      entity_overrides: Object.fromEntries(
        Object.entries(e.entity_overrides).map(([r, o]) => [r, { ...o, hidden: !1 }])
      )
    };
  }
  isEntityExcluded(e, t, i) {
    var r, o, n;
    const a = i.area_overrides[e] ?? i.area_overrides[((r = this.areaOptions().find((s) => s.id === e)) == null ? void 0 : r.name) ?? ""] ?? {};
    return i.exclude_entities.includes(t) || !!((o = a.exclude_entities) != null && o.includes(t)) || ((n = i.entity_overrides[t]) == null ? void 0 : n.hidden) === !0;
  }
  isEntityGloballyExcluded(e, t) {
    var i;
    return t.exclude_entities.includes(e) || ((i = t.entity_overrides[e]) == null ? void 0 : i.hidden) === !0;
  }
  setEntityVisible(e, t, i) {
    var c;
    const a = { ...this.config.area_overrides ?? {} }, r = (c = this.areaOptions().find((p) => p.id === e)) == null ? void 0 : c.name, o = this.currentAreaOverride(e), n = [...o.exclude_entities ?? []].filter((p) => p !== t);
    i || n.push(t);
    const s = { ...o, exclude_entities: n };
    r && r !== e && delete a[r], a[e] = s, this.commit({ ...this.config, area_overrides: a });
  }
  moveEntity(e, t, i, a, r) {
    var c;
    const o = this.currentAreaOverride(e), n = ((c = o.entity_order) == null ? void 0 : c[t]) ?? [], s = [...n, ...r.filter((p) => !n.includes(p))];
    this.moveValue(s, i, a), this.updateAreaOverride(e, { entity_order: { ...o.entity_order ?? {}, [t]: s } });
  }
  currentAreaOverride(e) {
    var a, r, o;
    const t = (a = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : a.name;
    return { ...(t && t !== e ? (r = this.config.area_overrides) == null ? void 0 : r[t] : void 0) ?? {}, ...((o = this.config.area_overrides) == null ? void 0 : o[e]) ?? {} };
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
    const a = e.indexOf(t), r = a + i;
    a < 0 || r < 0 || r >= e.length || ([e[a], e[r]] = [e[r], e[a]]);
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
};
j.styles = $e`
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
], j.prototype, "hass", 2);
X([
  $()
], j.prototype, "config", 2);
X([
  $()
], j.prototype, "targetMode", 2);
X([
  $()
], j.prototype, "activeAreaId", 2);
X([
  $()
], j.prototype, "entitySearch", 2);
X([
  $()
], j.prototype, "candidateEntityId", 2);
X([
  $()
], j.prototype, "candidateSection", 2);
j = X([
  Le(Lt)
], j);
const Ua = $e`
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
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-area-name-size: var(--area-bubble-overview-area-name-size, 17px);
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
    border: 1px solid color-mix(in srgb, var(--divider-color) 58%, transparent);
    border-radius: var(--aboc-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
      var(--ha-card-background, var(--card-background-color));
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

  .floor-toggle {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 58px;
    padding: 6px 7px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
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
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: calc(var(--aboc-radius) + 4px);
    background: transparent;
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  .area-panel.expanded {
    background: transparent;
  }

  .area-panel.expanded.has-active {
    border-color: color-mix(in srgb, var(--aboc-accent) 62%, var(--divider-color));
  }

  .area-panel.expanded.all-off {
    border-color: color-mix(in srgb, var(--aboc-accent) 46%, var(--divider-color));
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
    border: 2px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    overflow: hidden;
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .area-panel.has-active > .area-summary > .area-summary-pill {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color));
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
  .control-button,
  .climate-mode-button {
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

  .summary-chip ha-icon,
  .quick-action ha-icon {
    --mdc-icon-size: 21px;
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
    gap: 13px;
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
  }

  .section-heading {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    margin: 0;
    padding: 0 7px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 680;
    letter-spacing: 0.01em;
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
  .section-off-button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
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

  .section-on-button ha-icon,
  .section-off-button ha-icon {
    --mdc-icon-size: 21px;
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
    direction: ltr;
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
  .control-button:hover:not([disabled]),
  .climate-mode-button:hover:not([disabled]),
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
  .control-button:active:not([disabled]),
  .climate-mode-button:active:not([disabled]),
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

    .area-toggle {
      min-width: 82px;
      flex-basis: 104px;
      gap: 6px;
    }

    .area-statuses {
      gap: 3px;
    }

    .quick-actions {
      gap: 6px;
    }

    .area-summary-pill.compact-statuses .quick-actions {
      gap: 6px;
    }

    .quick-action {
      width: 38px;
      height: 38px;
      flex-basis: 38px;
    }

    .quick-action::before {
      content: "";
      position: absolute;
      inset: -3px;
      border-radius: inherit;
    }

    .quick-action ha-icon {
      --mdc-icon-size: 19px;
    }

    .quick-action .count-badge {
      inset-block-start: -2px;
      inset-inline-end: -2px;
    }

    .active-summary {
      display: none;
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
    .area-summary-pill.summary-load-5 .area-toggle {
      min-width: 78px;
      flex-basis: 78px;
    }

    .area-summary-pill.summary-load-5 .area-statuses,
    .area-summary-pill.summary-load-5 .quick-actions {
      flex-shrink: 0;
    }

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

    .area-toggle {
      min-width: 84px;
      flex-basis: 96px;
      gap: 6px;
    }

    .area-name {
      font-size: min(var(--aboc-area-name-size), 15px);
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
      min-width: 64px;
      flex-basis: 82px;
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
      overflow: hidden;
    }

    .quick-actions {
      width: max-content;
      min-width: 0;
      max-width: 100%;
      flex: 0 1 auto;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .area-summary.without-expand-button .area-toggle {
      min-width: 64px;
      flex-basis: 72px;
    }

    .area-summary.without-expand-button .area-statuses {
      max-width: calc(100% - 68px);
      flex: 0 0 auto;
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
    .quick-action,
    .quick-popup-close,
    .quick-popup-group-button,
    .quick-popup-entity-toggle,
    .control-button,
    .climate-mode-button,
    .toggle-tile,
    .hold-target {
      transition: none;
    }
  }
`;
var Ba = Object.defineProperty, Va = Object.getOwnPropertyDescriptor, H = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Va(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && Ba(t, i, r), r;
};
const S = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
};
let D = class extends W {
  constructor() {
    super(...arguments), this.expanded = {}, this.floorExpanded = !0, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingSections = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.storageId = "overview", this.suppressClickUntil = 0, this.restoreQuickPopupFocus = !0;
  }
  static getConfigElement() {
    return document.createElement(Lt);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    this.resetQuickPopup();
    try {
      xa(e), this.config = fe(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.floorExpanded = this.config.remember_expanded_state ? this.readFloorExpanded() ?? this.config.floor_default_expanded : this.config.floor_default_expanded, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = Re(this.hass, this.config);
    if (e.targetKind === "floor" && this.config.show_header && this.config.show_floor_header && !this.floorExpanded) return 2;
    const t = Fa(e.areas, (i) => this.isExpanded(i));
    return Math.max(
      2,
      t.reduce(
        (i, a) => i + 2 + (this.isExpanded(a) ? a.sections.reduce((r, o) => r + o.entities.length, 0) : 0),
        e.targetKind === "floor" ? 1 : 0
      )
    );
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.cancelHold(), this.resetQuickPopup();
  }
  render() {
    if (this.error) return u`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return b;
    const e = Aa(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = Re(this.hass, this.config), i = `overview-floor-${this.storageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`, a = t.targetKind === "floor" && this.config.show_header && this.config.show_floor_header;
    return u`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t, i)}
          ${t.targetKind === "none" ? this.renderEmpty(C(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : u`
                <div id=${i} ?hidden=${a && !this.floorExpanded}>
                  ${t.areas.length ? this.renderAreaHierarchy(t.areas) : this.renderEmpty(C(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
                </div>
              `}
          ${t.warnings.length && t.targetKind !== "none" ? u`<div class="warning">${t.warnings.join(" · ")}</div>` : b}
          ${this.config.debug ? u`<pre class="debug">${JSON.stringify(t, null, 2)}</pre>` : b}
        </div>
      </ha-card>
      ${this.renderQuickActionPopup(t)}
    `;
  }
  renderOverallHeader(e, t) {
    var a;
    if (!((a = this.config) != null && a.show_header) || !(e.targetKind === "floor" ? this.config.show_floor_header : !!this.config.title) || !e.targetName) return b;
    if (e.targetKind === "floor") {
      const r = e.areas.filter((c) => c.allEntities.some((p) => p.powered)).length, o = e.areas.filter((c) => c.occupancy === "occupied").length, n = [
        `${e.areas.length} ${this.localText("אזורים", "areas")}`,
        r ? `${r} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && o ? `${o} ${this.localText("מאוכלסים", "occupied")}` : ""
      ].filter(Boolean).join(" · "), s = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${e.targetName}`;
      return u`
        <div class="overview-heading floor-heading">
          <button class="floor-toggle" type="button" aria-expanded=${this.floorExpanded} aria-controls=${t} aria-label=${s} @click=${() => this.toggleFloor()}>
            <span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span>
            <span class="heading-main"><span class="floor-title">${e.targetName}</span><span class="subtitle">${n}</span></span>
            <span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </button>
        </div>
      `;
    }
    return u`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span><div class="heading-main"><h2>${e.targetName}</h2></div></div>`;
  }
  renderAreaHierarchy(e) {
    const { roots: t, children: i } = Xt(e), a = /* @__PURE__ */ new Set(), r = (o) => {
      if (a.has(o.id)) return b;
      a.add(o.id);
      const n = i.get(o.id) ?? [], c = this.isExpanded(o) ? n : n.filter((m) => m.showWhenParentCollapsed), p = c.length ? u`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${o.name}`}>${c.map(r)}</div>` : b;
      return u`
        <div class="area-tree-node">
          ${this.renderArea(o, p)}
        </div>
      `;
    };
    return u`<div class="areas">${t.map(r)}</div>`;
  }
  renderArea(e, t = b) {
    if (!this.config) return b;
    const i = this.isExpanded(e), a = e.allEntities.filter((_) => _.powered).length, r = this.config.show_quick_actions ? ha(e, this.config.quick_actions) : [], o = this.config.show_occupancy && e.occupancy !== "none", n = this.config.show_temperature && e.temperature !== void 0, s = n ? this.formatTemperature(e.temperature, e.temperatureUnit) : "", c = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active")
    }[e.temperatureMode], p = Math.min(8, r.length + Number(o) + Number(n) * 2), m = p >= 5, h = e.id.replace(/[^a-zA-Z0-9_-]/g, "-"), l = `overview-area-${h}`, g = `overview-area-name-${h}`, v = `${C(this.hass, this.config, i ? "collapse" : "expand")}: ${e.name}`;
    return u`
      <section
        class="area-panel ${a ? "has-active" : "all-off"} ${i ? "expanded" : ""}"
        data-powered=${a ? "true" : "false"}
        aria-labelledby=${g}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div class="area-summary-pill summary-load-${p} ${m ? "compact-statuses" : ""}">
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${i}
              aria-controls=${l}
              aria-label=${v}
              @click=${() => this.toggleArea(e)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name" id=${g}>${e.name}</span>
                ${a ? u`<span class="active-summary">${a} ${this.localText("פעילים", "active")}</span>` : b}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(e)}
              ${r.length ? this.renderQuickActions(e, r) : b}
              ${n ? u`<span class="temperature area-temperature temperature-${e.temperatureMode}" title=${`${s} · ${c}`} aria-label=${`${s} · ${c}`}>${s}</span>` : b}
            </div>
          </div>
          ${this.config.show_area_expand_button ? u`<button
                class="expand-button"
                type="button"
                aria-expanded=${i}
                aria-controls=${l}
                aria-label=${v}
                @click=${() => this.toggleArea(e)}
              ><span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span></button>` : b}
        </header>
        <div class="area-disclosure" id=${l} ?hidden=${!i}>
          <div class="expanded-content">${e.sections.map((_) => this.renderSection(_, e.id))}</div>
          ${i ? t : b}
        </div>
        ${i ? b : t}
      </section>
    `;
  }
  renderOccupancy(e) {
    var n;
    if (!((n = this.config) != null && n.show_occupancy) || e.occupancy === "none") return b;
    const t = e.occupancy === "occupied", i = e.occupancyCount === void 0 ? "?" : e.occupancyCount > 9 ? "9+" : String(e.occupancyCount), a = t ? "mdi:account-multiple" : e.occupancy === "vacant" ? "mdi:account-multiple-outline" : "mdi:account-question-outline", r = C(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown"), o = e.occupancyCount === void 0 ? r : e.occupancyCountSource === "entity" ? `${e.name}: ${e.occupancyCount} ${this.localText("נוכחים", "occupants")}` : `${e.name}: ${e.occupancyCount} ${this.localText("חיישני נוכחות פעילים", "active presence sensors")}`;
    return u`
      <span class="summary-chip occupancy ${t ? "occupied" : e.occupancy === "unknown" ? "unknown" : "vacant"}" title=${o} aria-label=${o}>
        <ha-icon icon=${a}></ha-icon>
        <span class="occupancy-count" aria-hidden="true">${i}</span>
        <span class="occupancy-label">${o}</span>
      </span>
    `;
  }
  renderQuickActions(e, t) {
    return this.config ? u`
      <div class="quick-actions" role="group" aria-label=${`${this.localText("פעולות מהירות", "Quick actions")}: ${e.name}`}>
        ${t.map(({ action: i, entities: a }) => {
      var p;
      const r = a.filter((m) => m.powered).length, o = this.quickActionPending(e.id, i) || a.some((m) => this.pendingEntities.has(m.entityId)), n = wt(this.hass, this.config, i), s = `${this.localText("פתיחת", "Open")} ${n}: ${e.name} (${r}/${a.length})`, c = ((p = this.quickPopup) == null ? void 0 : p.areaId) === e.id && this.quickPopup.action === i;
      return u`
            <button
              class="quick-action ${r ? "active" : "inactive"}"
              type="button"
              title=${s}
              aria-label=${s}
              aria-haspopup="dialog"
              aria-expanded=${c}
              aria-busy=${o}
              ?disabled=${o}
              @click=${(m) => this.openQuickActionPopup(m, e, i)}
            >
              <ha-icon icon=${o ? "mdi:loading" : this.config.quick_action_icons[i]}></ha-icon>
              ${r ? u`<span class="count-badge">${r}</span>` : b}
            </button>
          `;
    })}
      </div>
    ` : b;
  }
  renderSection(e, t) {
    const i = `overview-section-${e.id}-${t.replace(/[^a-zA-Z0-9_-]/g, "-")}`, a = Ue(e, !0), r = Ue(e, !1), o = this.pendingSections.has(`${t}:${e.id}:on`), n = this.pendingSections.has(`${t}:${e.id}:off`), s = o || n || e.entities.some((l) => this.pendingEntities.has(l.entityId)), c = e.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on"), p = e.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off"), m = `${c}: ${e.title} (${a.length})`, h = `${p}: ${e.title} (${r.length})`;
    return u`
      <section class="device-section section-${e.id}" aria-labelledby=${i}>
        <h3 class="section-heading" id=${i}>
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="section-title" title=${e.title}>${e.title}</span>
          <span class="section-count">${e.activeCount}/${e.entities.length}</span>
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${e.title}`}>
            <button
              class="section-on-button"
              type="button"
              title=${m}
              aria-label=${m}
              aria-busy=${o}
              ?disabled=${s || a.length === 0}
              @click=${(l) => this.handleSectionAction(l, e, t, !0)}
            ><ha-icon icon=${o ? "mdi:loading" : e.id === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon></button>
            <button
              class="section-off-button"
              type="button"
              title=${h}
              aria-label=${h}
              aria-busy=${n}
              ?disabled=${s || r.length === 0}
              @click=${(l) => this.handleSectionAction(l, e, t, !1)}
            ><ha-icon icon=${n ? "mdi:loading" : e.id === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon></button>
          </span>
        </h3>
        <div class="section-entities">
          ${e.entities.length ? e.entities.map((l) => this.renderEntity(l, e.id)) : u`<div class="secondary section-empty">${this.config && Y(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div>`}
        </div>
      </section>
    `;
  }
  renderQuickActionPopup(e) {
    if (!this.config || !this.quickPopup) return b;
    const t = e.areas.find((f) => {
      var w;
      return f.id === ((w = this.quickPopup) == null ? void 0 : w.areaId);
    });
    if (!t)
      return queueMicrotask(() => this.resetQuickPopup()), b;
    const i = this.quickPopup.action, a = Me(t, i);
    if (!a.length)
      return queueMicrotask(() => this.resetQuickPopup()), b;
    const r = wt(this.hass, this.config, i), o = a.filter((f) => f.powered).length, n = He(t, i, !0), s = He(t, i, !1), c = this.pendingActions.has(`${t.id}:${i}:on`), p = this.pendingActions.has(`${t.id}:${i}:off`), m = c || p, h = a.some((f) => this.pendingEntities.has(f.entityId)), l = m || h, v = `overview-quick-popup-title-${`${t.id}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "-")}`, _ = i === "covers" ? this.localText("פתיחת הכל", "Open all") : this.localText("הפעלת הכל", "Turn all on"), d = i === "covers" ? this.localText("סגירת הכל", "Close all") : this.localText("כיבוי הכל", "Turn all off");
    return u`
      <dialog
        class="quick-action-dialog"
        aria-modal="true"
        aria-labelledby=${v}
        @cancel=${(f) => this.handleQuickPopupCancel(f)}
        @close=${() => this.handleQuickPopupClosed()}
        @click=${(f) => this.handleQuickPopupBackdrop(f)}
        @keydown=${(f) => this.handleQuickPopupKeydown(f)}
      >
        <section class="quick-popup" aria-busy=${l}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${this.config.quick_action_icons[i]}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${v}>${r} · ${t.name}</span>
              <span class="quick-popup-summary">${o} ${this.localText("דלוקים מתוך", "on of")} ${a.length}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeQuickActionPopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="quick-popup-group-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${r}`}>
            <button
              class="quick-popup-group-button turn-on"
              type="button"
              aria-label=${`${_}: ${r} (${n.length})`}
              aria-busy=${c}
              ?disabled=${l || n.length === 0}
              @click=${(f) => this.handleQuickPopupGroupAction(f, t, i, !0)}
            ><ha-icon icon=${c ? "mdi:loading" : i === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${_}</span><small>${n.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${d}: ${r} (${s.length})`}
              aria-busy=${p}
              ?disabled=${l || s.length === 0}
              @click=${(f) => this.handleQuickPopupGroupAction(f, t, i, !1)}
            ><ha-icon icon=${p ? "mdi:loading" : i === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon><span>${d}</span><small>${s.length}</small></button>
          </div>
          <div class="quick-popup-list" role="list" aria-label=${r}>
            ${a.map((f) => this.renderQuickPopupEntity(f, i, m))}
          </div>
        </section>
      </dialog>
    `;
  }
  renderQuickPopupEntity(e, t, i) {
    const a = this.entityBusy(e), r = !e.powered, o = Ye(t, e, r), n = !e.available || a || i || !o, s = t === "covers" ? r ? this.localText("פתיחה", "Open") : this.localText("סגירה", "Close") : r ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off"), c = e.available ? o ? "" : this.localText("אין פעולת שליטה נתמכת", "No supported control action") : C(this.hass, this.config, "unavailable");
    return u`
      <article class="quick-popup-entity ${e.powered ? "active" : "inactive"} ${e.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(p) => this.startHold(p, e)}
          @pointermove=${(p) => this.moveHold(p)}
          @pointerup=${(p) => this.finishHold(p)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(p) => this.handleMoreInfoClick(p, e)}
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
          @click=${(p) => this.handleQuickPopupEntityAction(p, e, t)}
        ><ha-icon icon=${a ? "mdi:loading" : t === "covers" ? r ? "mdi:arrow-up" : "mdi:arrow-down" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderEntity(e, t) {
    return t === "floor_heating" ? this.renderFloorHeating(e) : e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : ua(e) ? this.renderLight(e) : this.renderToggle(e);
  }
  renderEntityLead(e) {
    return u`
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
    const t = this.entityBusy(e), i = G(e, !e.powered), a = !e.available || t || !i;
    return u`
      <button
        class="toggle-tile entity-card hold-target ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${e.powered}
        aria-busy=${t}
        aria-disabled=${a}
        aria-label=${`${e.name}: ${this.entitySecondary(e)}. ${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}`}
        title=${`${e.active ? C(this.hass, this.config, "turn_off") : C(this.hass, this.config, "on")} · ${this.localText("לחיצה ארוכה לפרטים", "hold for details")}`}
        @pointerdown=${(r) => this.startHold(r, e)}
        @pointermove=${(r) => this.moveHold(r)}
        @pointerup=${(r) => this.finishHold(r)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(r) => this.handleToggleClick(r, e)}
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
    const t = S(e, "current_temperature"), i = S(e, "target_temp_step") ?? 0.5, a = M(e.entity, ee.TARGET_TEMPERATURE) ? S(e, "temperature") : void 0, r = M(e.entity, ee.TARGET_TEMPERATURE_RANGE) ? S(e, "target_temp_low") : void 0, o = M(e.entity, ee.TARGET_TEMPERATURE_RANGE) ? S(e, "target_temp_high") : void 0, n = r !== void 0 && o !== void 0, s = jt(e), c = M(e.entity, ee.FAN_MODE) && Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], p = this.entityBusy(e), m = this.climateModeIcon(e.entity.state);
    return u`
      <article class="climate-card entity-card full-span mode-${e.entity.state} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${p}>
        <div class="climate-primary">
          ${this.renderEntityLead(e)}
          ${!n && a !== void 0 ? u`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${p || !e.available} @click=${() => this.setClimateTemperature(e, a - i)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                  <span>${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>
                  <button type="button" ?disabled=${p || !e.available} @click=${() => this.setClimateTemperature(e, a + i)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
                </span>
              ` : t !== void 0 ? u`<span class="temperature current-temperature">${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>` : b}
        </div>
        ${n ? this.renderClimateRange(e, r, o, i, p) : b}
        ${s.length || c.length ? u`<div class="climate-secondary" @click=${(h) => h.stopPropagation()}>
          ${s.length ? u`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${e.name}`}
                .value=${e.entity.state}
                .disabled=${p || !e.available}
                .options=${s.map((h) => ({ value: h, label: this.climateModeLabel(h), icon: this.climateModeIcon(h) }))}
                @wa-select=${(h) => this.setClimateMode(e, h)}
              ><ha-icon slot="icon" icon=${m}></ha-icon></ha-control-select-menu>` : b}
          ${c.length ? u`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${e.name}`}
                .value=${String(e.entity.attributes.fan_mode ?? "")}
                .disabled=${p || !e.available}
                .options=${c.map((h) => ({ value: h, label: this.modeLabel(h), icon: "mdi:fan" }))}
                @wa-select=${(h) => this.setFanMode(e, h)}
              ><ha-icon slot="icon" icon="mdi:fan"></ha-icon></ha-control-select-menu>` : b}
          </div>` : b}
      </article>
    `;
  }
  renderLight(e) {
    var o;
    const t = this.entityBusy(e), i = xt(e), a = G(e, !e.powered), r = `${this.localText("בהירות", "Brightness")}: ${e.name}`;
    return u`
      <article class="light-card entity-card ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        <div class="light-primary">
          ${this.renderEntityLead(e)}
          <button
            class="light-power ${e.powered ? "active" : ""}"
            type="button"
            aria-pressed=${e.powered}
            aria-label=${`${e.powered ? C(this.hass, this.config, "turn_off") : C(this.hass, this.config, "on")}: ${e.name}`}
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
            .locale=${(o = this.hass) == null ? void 0 : o.locale}
            .label=${r}
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
  renderClimateRange(e, t, i, a, r) {
    return u`
      <div class="temperature-range" role="group" aria-label=${`${this.localText("טווח טמפרטורה", "Temperature range")}: ${e.name}`}>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateRange(e, t - a, i, "low")} aria-label=${`${this.localText("הורדת סף תחתון", "Decrease low target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("נמוך", "Low")}</small>${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateRange(e, t + a, i, "low")} aria-label=${`${this.localText("העלאת סף תחתון", "Increase low target")}: ${e.name}`}>+</button>
        </span>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateRange(e, t, i - a, "high")} aria-label=${`${this.localText("הורדת סף עליון", "Decrease high target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("גבוה", "High")}</small>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${r || !e.available} @click=${() => this.setClimateRange(e, t, i + a, "high")} aria-label=${`${this.localText("העלאת סף עליון", "Increase high target")}: ${e.name}`}>+</button>
        </span>
      </div>
    `;
  }
  renderFloorHeating(e) {
    const t = e.domain === "water_heater" ? zt.TARGET_TEMPERATURE : ee.TARGET_TEMPERATURE, i = M(e.entity, t) ? S(e, "temperature") : void 0, a = S(e, "current_temperature");
    if (i === void 0 && a === void 0) return this.renderToggle(e);
    const r = S(e, "target_temp_step") ?? 0.5, o = this.entityBusy(e), n = G(e, !e.powered);
    return u`
      <article class="thermostat-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${o}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(e)}
          ${i !== void 0 ? u`<span class="temperature-stepper">
                <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateTemperature(e, i - r)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                <span>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
                <button type="button" ?disabled=${o || !e.available} @click=${() => this.setClimateTemperature(e, i + r)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
              </span>` : u`<span class="temperature current-temperature">${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>`}
        </div>
        <button
          class="thermostat-power ${e.powered ? "active" : ""}"
          type="button"
          aria-pressed=${e.powered}
          aria-label=${`${e.powered ? C(this.hass, this.config, "turn_off") : C(this.hass, this.config, "on")}: ${e.name}`}
          ?disabled=${o || !e.available || !n}
          @click=${(s) => this.toggleEntity(s, e)}
        ><ha-icon icon=${o ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderCover(e) {
    const t = this.entityBusy(e), i = S(e, "supported_features"), a = S(e, "current_position"), r = e.entity.state, o = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 }
    ].filter(({ feature: s }) => i === void 0 || (i & s) !== 0), n = (s) => s === "open_cover" ? r === "open" || a !== void 0 && a >= 100 : s === "close_cover" ? r === "closed" || a !== void 0 && a <= 0 : s === "stop_cover" && !["opening", "closing"].includes(r);
    return u`
      <article class="cover-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${e.name}`}>
          ${o.map(({ service: s, icon: c }) => u`
            <button
              class="cover-control"
              type="button"
              ?disabled=${!e.available || t || n(s)}
              @click=${(p) => this.runEntityService(p, e, s)}
              aria-label=${`${this.coverServiceLabel(s)}: ${e.name}`}
            ><ha-icon icon=${c}></ha-icon></button>
          `)}
        </span>
      </article>
    `;
  }
  renderMedia(e) {
    const t = this.entityBusy(e), i = e.entity.state === "playing", a = S(e, "volume_level"), r = a !== void 0 && M(e.entity, ye.VOLUME_SET), o = M(e.entity, i ? ye.PAUSE : ye.PLAY), n = G(e, !e.powered);
    return u`
      <article class="media-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${r ? u`
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${e.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(a * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${e.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : b}
          ${o ? u`<button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(s) => this.runEntityService(s, e, i ? "media_pause" : "media_play")} aria-label=${`${this.localText(i ? "השהיה" : "ניגון", i ? "Pause" : "Play")}: ${e.name}`}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>` : b}
          ${n ? u`<button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.toggleEntity(s, e)} aria-label=${`${e.powered ? C(this.hass, this.config, "turn_off") : C(this.hass, this.config, "on")}: ${e.name}`}><ha-icon icon="mdi:power"></ha-icon></button>` : b}
        </div>
      </article>
    `;
  }
  entitySecondary(e) {
    var t, i;
    if (!e.available) return C(this.hass, this.config, "unavailable");
    if (e.domain === "climate") {
      const a = S(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const a = S(e, "current_position");
      return a !== void 0 ? `${e.entity.state} · ${Math.round(a)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const a = S(e, "brightness");
      return a !== void 0 && e.active ? `${C(this.hass, this.config, "on")} · ${Math.round(a / 255 * 100)}%` : e.entity.state;
    }
    if (e.domain === "media_player")
      return String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state);
    if (e.section === "floor_heating") {
      const a = S(e, "current_temperature");
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
    return u`<div class="empty"><ha-icon icon=${t}></ha-icon><span>${e}</span></div>`;
  }
  isExpanded(e) {
    var i, a, r;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? ((r = this.config) == null ? void 0 : r.default_expanded) ?? !1;
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
      if (!t.available || this.entityBusy(t) || !G(t, !t.powered)) {
        e.preventDefault(), e.stopPropagation();
        return;
      }
      this.toggleEntity(e, t);
    }
  }
  quickActionPending(e, t) {
    return this.pendingActions.has(`${e}:${t}:on`) || this.pendingActions.has(`${e}:${t}:off`);
  }
  openQuickActionPopup(e, t, i) {
    e.stopPropagation(), this.quickPopupTrigger = e.currentTarget, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0, this.quickPopup = { areaId: t.id, action: i }, this.updateComplete.then(() => {
      const a = this.renderRoot.querySelector(".quick-action-dialog");
      !a || a.open || !a.isConnected || (typeof a.showModal == "function" ? a.showModal() : a.setAttribute("open", ""));
    });
  }
  closeQuickActionPopup(e = !0, t) {
    this.restoreQuickPopupFocus = e, this.quickPopupMoreInfo = t;
    const i = this.renderRoot.querySelector(".quick-action-dialog");
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
    const e = (t = this.renderRoot) == null ? void 0 : t.querySelector(".quick-action-dialog");
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
    const r = `${t.id}:${i}:${a ? "on" : "off"}`, o = Me(t, i), n = He(t, i, a);
    if (!(this.quickActionPending(t.id, i) || o.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingActions = /* @__PURE__ */ new Set([...this.pendingActions, r]), this.lockPendingEntities(n);
      try {
        await ba(this.hass, t, i, a);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingActions);
        s.delete(r), this.pendingActions = s, this.unlockPendingEntities(n);
      }
    }
  }
  handleQuickPopupEntityAction(e, t, i) {
    e.stopPropagation();
    const a = Ye(i, t, !t.powered);
    !this.hass || !t.available || this.entityBusy(t) || this.quickPopup && this.quickActionPending(this.quickPopup.areaId, i) || !a || this.performEntityCall(t, () => F(this.hass, t.entityId, a.service, a.data));
  }
  async handleSectionAction(e, t, i, a) {
    if (e.stopPropagation(), !this.hass) return;
    const r = `${i}:${t.id}:${a ? "on" : "off"}`, o = `${i}:${t.id}:${a ? "off" : "on"}`, n = Ue(t, a);
    if (!(this.pendingSections.has(r) || this.pendingSections.has(o) || t.entities.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingSections = /* @__PURE__ */ new Set([...this.pendingSections, r]), this.lockPendingEntities(n);
      try {
        await fa(this.hass, t, a);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingSections);
        s.delete(r), this.pendingSections = s, this.unlockPendingEntities(n);
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
    const i = G(t, !t.powered);
    i && this.performEntityCall(t, () => F(this.hass, t.entityId, i.service, i.data));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => F(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = S(e, "min_temp") ?? -100, a = S(e, "max_temp") ?? 100, r = Math.min(a, Math.max(i, t));
    this.performEntityCall(e, () => F(this.hass, e.entityId, "set_temperature", { temperature: r }));
  }
  setClimateRange(e, t, i, a) {
    const r = S(e, "min_temp") ?? -100, o = S(e, "max_temp") ?? 100, n = a === "low" ? Math.min(i, Math.max(r, t)) : t, s = a === "high" ? Math.max(n, Math.min(o, i)) : i;
    this.performEntityCall(e, () => F(this.hass, e.entityId, "set_temperature", {
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
    !i || i === e.entity.state || this.performEntityCall(e, () => F(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i }));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === String(e.entity.attributes.fan_mode ?? "") || this.performEntityCall(e, () => F(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setLightBrightness(e, t) {
    var r;
    t.stopPropagation();
    const i = (r = t.detail) == null ? void 0 : r.value;
    if (typeof i != "number" || !Number.isFinite(i)) return;
    const a = Math.min(100, Math.max(0, Math.round(i)));
    a !== xt(e) && this.performEntityCall(e, () => a === 0 ? F(this.hass, e.entityId, "turn_off") : F(this.hass, e.entityId, "turn_on", { brightness_pct: a }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => F(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
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
    return `${yt}:${this.storageId}:expanded`;
  }
  floorStorageKey() {
    return `${yt}:${this.storageId}:floor-expanded`;
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
    this.style.setProperty("--area-bubble-overview-border-radius", `${e.border_radius}px`), this.style.setProperty("--area-bubble-overview-blur", `${e.blur}px`), this.style.setProperty("--area-bubble-overview-gap", `${e.section_gap}px`), this.style.setProperty("--area-bubble-overview-row-height", `${e.row_height}px`), this.style.setProperty("--area-bubble-overview-area-name-size", `${e.area_name_size}px`), this.style.setProperty("--area-bubble-overview-accent", e.accent_color), this.style.setProperty("--area-bubble-overview-active", e.active_color), this.style.setProperty("--area-bubble-overview-row-bg", e.row_background), this.style.setProperty("--area-bubble-overview-active-surface", e.active_surface), this.style.setProperty("--area-bubble-overview-climate-surface", e.climate_surface), this.style.setProperty("--area-bubble-overview-control-surface", e.control_surface), this.style.setProperty("--area-bubble-overview-climate-color", e.climate_color), this.style.setProperty("--area-bubble-overview-cover-color", e.cover_color), this.style.setProperty("--area-bubble-overview-media-color", e.media_color), this.style.setProperty("--area-bubble-overview-temperature-off-surface", e.temperature_off_surface), this.style.setProperty("--area-bubble-overview-temperature-cool-surface", e.temperature_cool_surface), this.style.setProperty("--area-bubble-overview-temperature-heat-surface", e.temperature_heat_surface), this.style.setProperty("--area-bubble-overview-temperature-active-surface", e.temperature_active_surface), this.style.setProperty(
      "--area-bubble-overview-shadow",
      e.show_shadows ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none"
    );
  }
};
D.styles = Ua;
H([
  Ae({ attribute: !1 })
], D.prototype, "hass", 2);
H([
  $()
], D.prototype, "config", 2);
H([
  $()
], D.prototype, "expanded", 2);
H([
  $()
], D.prototype, "floorExpanded", 2);
H([
  $()
], D.prototype, "pendingActions", 2);
H([
  $()
], D.prototype, "pendingSections", 2);
H([
  $()
], D.prototype, "pendingEntities", 2);
H([
  $()
], D.prototype, "quickPopup", 2);
H([
  $()
], D.prototype, "error", 2);
D = H([
  Le(Ke)
], D);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === Ke) || window.customCards.push({
  type: Ke,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

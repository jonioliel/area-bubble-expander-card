/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = globalThis, He = we.ShadowRoot && (we.ShadyCSS === void 0 || we.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Be = Symbol(), qe = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== Be) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (He && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = qe.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && qe.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const It = (e) => new dt(typeof e == "string" ? e : e + "", void 0, Be), ge = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, r, n) => a + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new dt(i, e, Be);
}, Nt = (e, t) => {
  if (He) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), r = we.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = i.cssText, e.appendChild(a);
  }
}, Ke = He ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return It(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Dt, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Lt, getOwnPropertySymbols: Rt, getPrototypeOf: jt } = Object, H = globalThis, Ge = H.trustedTypes, zt = Ge ? Ge.emptyScript : "", Ie = H.reactiveElementPolyfillSupport, pe = (e, t) => e, Se = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? zt : null;
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
} }, Ue = (e, t) => !Tt(e, t), We = { attribute: !0, type: String, converter: Se, reflect: !1, useDefault: !1, hasChanged: Ue };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), H.litPropertyMetadata ?? (H.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let te = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = We) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(t, a, i);
      r !== void 0 && Dt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: r, set: n } = Pt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: r, set(s) {
      const o = r == null ? void 0 : r.call(this);
      n == null || n.call(this, s), this.requestUpdate(t, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? We;
  }
  static _$Ei() {
    if (this.hasOwnProperty(pe("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(pe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(pe("properties"))) {
      const i = this.properties, a = [...Lt(i), ...Rt(i)];
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
      for (const r of a) i.unshift(Ke(r));
    } else t !== void 0 && i.push(Ke(t));
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
    return Nt(t, this.constructor.elementStyles), t;
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
    var n;
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const s = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : Se).toAttribute(i, a.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, s;
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = a.getPropertyOptions(r), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Se;
      this._$Em = r;
      const p = c.fromAttribute(i, o.type);
      this[r] = p ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, r = !1, n) {
    var s;
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), a ?? (a = o.getPropertyOptions(t)), !((a.hasChanged ?? Ue)(n, i) || a.useDefault && a.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(o._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: r, wrapped: n }, s) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, s] of r) {
        const { wrapped: o } = s, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, s, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (a = this._$EO) == null || a.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
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
te.elementStyles = [], te.shadowRootOptions = { mode: "open" }, te[pe("elementProperties")] = /* @__PURE__ */ new Map(), te[pe("finalized")] = /* @__PURE__ */ new Map(), Ie == null || Ie({ ReactiveElement: te }), (H.reactiveElementVersions ?? (H.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = globalThis, Ye = (e) => e, Ae = ue.trustedTypes, Xe = Ae ? Ae.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pt = "$lit$", F = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + F, Mt = `<${ut}>`, Y = document, he = () => Y.createComment(""), be = (e) => e === null || typeof e != "object" && typeof e != "function", Je = Array.isArray, Ft = (e) => Je(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Ne = `[ 	
\f\r]`, oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qe = /-->/g, Ze = />/g, q = RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, tt = /"/g, ht = /^(?:script|style|textarea|title)$/i, Ht = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = Ht(1), ae = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), K = Y.createTreeWalker(Y, 129);
function bt(e, t) {
  if (!Je(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Xe !== void 0 ? Xe.createHTML(t) : t;
}
const Bt = (e, t) => {
  const i = e.length - 1, a = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = oe;
  for (let o = 0; o < i; o++) {
    const c = e[o];
    let p, u, l = -1, b = 0;
    for (; b < c.length && (s.lastIndex = b, u = s.exec(c), u !== null); ) b = s.lastIndex, s === oe ? u[1] === "!--" ? s = Qe : u[1] !== void 0 ? s = Ze : u[2] !== void 0 ? (ht.test(u[2]) && (r = RegExp("</" + u[2], "g")), s = q) : u[3] !== void 0 && (s = q) : s === q ? u[0] === ">" ? (s = r ?? oe, l = -1) : u[1] === void 0 ? l = -2 : (l = s.lastIndex - u[2].length, p = u[1], s = u[3] === void 0 ? q : u[3] === '"' ? tt : et) : s === tt || s === et ? s = q : s === Qe || s === Ze ? s = oe : (s = q, r = void 0);
    const m = s === q && e[o + 1].startsWith("/>") ? " " : "";
    n += s === oe ? c + Mt : l >= 0 ? (a.push(p), c.slice(0, l) + pt + c.slice(l) + F + m) : c + F + (l === -2 ? o : m);
  }
  return [bt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class me {
  constructor({ strings: t, _$litType$: i }, a) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const o = t.length - 1, c = this.parts, [p, u] = Bt(t, i);
    if (this.el = me.createElement(p, a), K.currentNode = this.el.content, i === 2 || i === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = K.nextNode()) !== null && c.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(pt)) {
          const b = u[s++], m = r.getAttribute(l).split(F), x = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: n, name: x[2], strings: m, ctor: x[1] === "." ? Jt : x[1] === "?" ? Vt : x[1] === "@" ? qt : Ce }), r.removeAttribute(l);
        } else l.startsWith(F) && (c.push({ type: 6, index: n }), r.removeAttribute(l));
        if (ht.test(r.tagName)) {
          const l = r.textContent.split(F), b = l.length - 1;
          if (b > 0) {
            r.textContent = Ae ? Ae.emptyScript : "";
            for (let m = 0; m < b; m++) r.append(l[m], he()), K.nextNode(), c.push({ type: 2, index: ++n });
            r.append(l[b], he());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ut) c.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(F, l + 1)) !== -1; ) c.push({ type: 7, index: n }), l += F.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const a = Y.createElement("template");
    return a.innerHTML = t, a;
  }
}
function re(e, t, i = e, a) {
  var s, o;
  if (t === ae) return t;
  let r = a !== void 0 ? (s = i._$Co) == null ? void 0 : s[a] : i._$Cl;
  const n = be(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((o = r == null ? void 0 : r._$AO) == null || o.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = r : i._$Cl = r), r !== void 0 && (t = re(e, r._$AS(e, t.values), r, a)), t;
}
class Ut {
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
    const { el: { content: i }, parts: a } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? Y).importNode(i, !0);
    K.currentNode = r;
    let n = K.nextNode(), s = 0, o = 0, c = a[0];
    for (; c !== void 0; ) {
      if (s === c.index) {
        let p;
        c.type === 2 ? p = new _e(n, n.nextSibling, this, t) : c.type === 1 ? p = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (p = new Kt(n, this, t)), this._$AV.push(p), c = a[++o];
      }
      s !== (c == null ? void 0 : c.index) && (n = K.nextNode(), s++);
    }
    return K.currentNode = Y, r;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class _e {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, a, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = re(this, t, i), be(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== ae && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ft(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && be(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = me.createElement(bt(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const s = new Ut(r, this), o = s.u(this.options);
      s.p(i), this.T(o), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = it.get(t.strings);
    return i === void 0 && it.set(t.strings, i = new me(t)), i;
  }
  k(t) {
    Je(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, r = 0;
    for (const n of t) r === i.length ? i.push(a = new _e(this.O(he()), this.O(he()), this, this.options)) : a = i[r], a._$AI(n), r++;
    r < i.length && (this._$AR(a && a._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = Ye(t).nextSibling;
      Ye(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Ce {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(t, i = this, a, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = re(this, t, i, 0), s = !be(t) || t !== this._$AH && t !== ae, s && (this._$AH = t);
    else {
      const o = t;
      let c, p;
      for (t = n[0], c = 0; c < n.length - 1; c++) p = re(this, o[a + c], i, c), p === ae && (p = this._$AH[c]), s || (s = !be(p) || p !== this._$AH[c]), p === h ? t = h : t !== h && (t += (p ?? "") + n[c + 1]), this._$AH[c] = p;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends Ce {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Vt extends Ce {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class qt extends Ce {
  constructor(t, i, a, r, n) {
    super(t, i, a, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = re(this, t, i, 0) ?? h) === ae) return;
    const a = this._$AH, r = t === h && a !== h || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, n = t !== h && (a === h || r);
    r && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Kt {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    re(this, t);
  }
}
const Te = ue.litHtmlPolyfillSupport;
Te == null || Te(me, _e), (ue.litHtmlVersions ?? (ue.litHtmlVersions = [])).push("3.3.3");
const Gt = (e, t, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = r = new _e(t.insertBefore(he(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis;
class B extends te {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Gt(i, this.renderRoot, this.renderOptions);
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
    return ae;
  }
}
var lt;
B._$litElement$ = !0, B.finalized = !0, (lt = G.litElementHydrateSupport) == null || lt.call(G, { LitElement: B });
const De = G.litElementPolyfillSupport;
De == null || De({ LitElement: B });
(G.litElementVersions ?? (G.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = { attribute: !0, type: String, converter: Se, reflect: !1, hasChanged: Ue }, Yt = (e = Wt, t, i) => {
  const { kind: a, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), a === "accessor") {
    const { name: s } = i;
    return { set(o) {
      const c = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(s, c, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(s, void 0, e, o), o;
    } };
  }
  if (a === "setter") {
    const { name: s } = i;
    return function(o) {
      const c = this[s];
      t.call(this, o), this.requestUpdate(s, c, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function ve(e) {
  return (t, i) => typeof i == "object" ? Yt(e, t, i) : ((a, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, a), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(e) {
  return ve({ ...e, state: !0, attribute: !1 });
}
const Xt = "custom:area-bubble-expander-card", Qt = "area-bubble-expander-card", mt = "area-bubble-expander-card-editor", Zt = "area-bubble-expander-card", ei = ["light", "switch", "fan", "climate", "media_player"], ti = [
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
], ii = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, ai = {
  climate: ["off", "unavailable", "unknown"]
}, ri = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), ni = ["always_on", "critical", "infrastructure", "no_turn_off"], si = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], oi = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, ft = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, Le = {
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
}, ci = {
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
}, ce = {
  type: Xt,
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
  domains: ei,
  exclude_domains: ti,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: ii,
  inactive_states: ai,
  paused_media_players_active: !0,
  protected_labels: ni,
  protected_entities: si,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: oi,
  domain_icons: ft,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: Le,
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
}, li = ge`
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
`, O = (e) => Array.isArray(e) ? [...e] : [], L = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, ie = (e) => {
  const t = L(e.style), i = typeof t.preset == "string" ? t.preset : Le.preset, a = ci[i] ?? {}, r = { ...Le, ...a, ...t }, n = {
    ...ce,
    ...e,
    style: r
  };
  return {
    ...n,
    type: "custom:area-bubble-expander-card",
    title: n.title ?? "",
    empty_title: n.empty_title ?? "",
    empty_subtitle: n.empty_subtitle ?? "",
    include_entities: O(n.include_entities),
    exclude_entities: O(n.exclude_entities),
    include_areas: O(n.include_areas),
    exclude_areas: O(n.exclude_areas),
    exclude_labels: O(n.exclude_labels),
    exclude_entity_category: O(n.exclude_entity_category),
    exclude_by_regex: O(n.exclude_by_regex),
    active_states: { ...ce.active_states ?? {}, ...L(e.active_states) },
    inactive_states: { ...ce.inactive_states ?? {}, ...L(e.inactive_states) },
    protected_entities: O(n.protected_entities),
    disable_turn_off_for_domains: O(n.disable_turn_off_for_domains),
    dangerous_domains: O(n.dangerous_domains),
    service_mapping: { ...ce.service_mapping ?? {}, ...L(e.service_mapping) },
    custom_area_order: O(n.custom_area_order),
    custom_entity_order: O(n.custom_entity_order),
    areas: { ...L(n.areas) },
    entity_overrides: { ...L(n.entity_overrides) },
    labels: { ...L(n.labels) },
    domain_labels: { ...L(n.domain_labels) },
    domain_icons: { ...ce.domain_icons ?? {}, ...L(n.domain_icons) },
    style: r
  };
}, di = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, xe = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), pi = (e) => Array.isArray(e) ? e.join(`
`) : "", at = {
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
}, ui = {
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
}, ne = (e, t) => {
  var a;
  if (t === "he" || t === "en") return t;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, gt = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = ne(e, t.language), a = document.documentElement.dir;
  return i === "he" || a === "rtl";
}, y = (e, t, i, a = {}) => {
  const r = ne(t, e.language);
  let s = e.labels[i] ?? at[r][i] ?? at.en[i] ?? i;
  for (const [o, c] of Object.entries(a))
    s = s.replace(new RegExp(`\\{${o}\\}`, "g"), String(c));
  return s;
}, rt = (e, t, i) => {
  const a = ne(t, e.language);
  return e.domain_labels[i] ?? ui[a][i] ?? i.replace(/_/g, " ");
}, hi = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const r = a.area_id ?? a.id ?? i;
    t.set(r, a);
  }
  return t;
}, Re = (e, t, i) => {
  var l, b;
  const a = hi(e), r = (l = e == null ? void 0 : e.entities) == null ? void 0 : l[i], n = r != null && r.device_id ? (b = e == null ? void 0 : e.devices) == null ? void 0 : b[r.device_id] : void 0, s = (r == null ? void 0 : r.area_id) ?? (n == null ? void 0 : n.area_id) ?? "no_area", o = s ? a.get(s) : void 0, c = t.areas[s] ?? t.areas[(o == null ? void 0 : o.name) ?? ""], p = (o == null ? void 0 : o.name) ?? y(t, e, "no_area"), u = (c == null ? void 0 : c.name) ?? p;
  return {
    id: s || "no_area",
    name: u,
    icon: (c == null ? void 0 : c.icon) ?? (o == null ? void 0 : o.icon) ?? (s === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, bi = (e, t, i) => {
  const a = i.areas[e] ?? i.areas[t];
  return a != null && a.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, le = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, mi = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), fi = (e, t, i, a) => {
  if (e.state === "unavailable") return y(i, a, "not_available");
  if (t === "light" && i.show_brightness) {
    const r = le(e, "brightness");
    if (r !== void 0) return `${Math.round(r / 255 * 100)}%`;
  }
  if (t === "fan") {
    const r = le(e, "percentage");
    if (r !== void 0) return `${r}%`;
  }
  if (t === "climate") {
    const r = String(e.attributes.hvac_action ?? e.state), n = le(e, "current_temperature"), s = le(e, "temperature");
    return i.show_temperature && (n !== void 0 || s !== void 0) ? [r, n !== void 0 ? `${n}°` : "", s !== void 0 ? `→ ${s}°` : ""].filter(Boolean).join(" ") : r;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const r = le(e, "current_position");
    return r !== void 0 ? `${r}%` : e.state;
  }
  return String(e.state);
}, gi = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const a = Math.round(i / 60);
  return a < 24 ? `${a}h` : `${Math.round(a / 24)}d`;
}, _i = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(y(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(gi(e.entity)), i.filter(Boolean).join(" · ");
}, vi = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), yi = (e, t, i) => {
  var s, o;
  const a = String(e.state ?? "").toLowerCase();
  if (ri.has(a) || t === "media_player" && !i.paused_media_players_active && a === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (vi.has(c)) return !0;
  }
  const r = (s = i.inactive_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  if (r != null && r.includes(a)) return !1;
  const n = (o = i.active_states[t]) == null ? void 0 : o.map((c) => c.toLowerCase());
  return n != null && n.length ? n.includes(a) : r != null && r.length ? !0 : a === "on";
}, xi = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []];
}, wi = (e, t, i) => {
  const a = i.entity_overrides[e];
  return a != null && a.protected || i.protected_entities.includes(e) ? !0 : t.some((r) => i.protected_labels.includes(r));
}, _t = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return y(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, $i = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, $e = (e, t) => e.filter((i) => !_t(i, t)), Ee = (e, t, i) => {
  const a = e.indexOf(t);
  if (a >= 0) return a;
  if (i) {
    const r = e.indexOf(i);
    if (r >= 0) return r;
  }
  return Number.MAX_SAFE_INTEGER;
}, ki = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.area_sort === "count_asc" ? i.sort((a, r) => a.entities.length - r.entities.length || a.name.localeCompare(r.name)) : t.area_sort === "custom" ? i.sort(
    (a, r) => Ee(t.custom_area_order, a.id, a.name) - Ee(t.custom_area_order, r.id, r.name) || a.name.localeCompare(r.name)
  ) : i.sort((a, r) => r.entities.length - a.entities.length || a.name.localeCompare(r.name));
}, Si = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.entity_sort === "state" ? i.sort((a, r) => a.entity.state.localeCompare(r.entity.state) || a.name.localeCompare(r.name)) : t.entity_sort === "last_changed" ? i.sort((a, r) => new Date(r.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((a, r) => Ee(t.custom_entity_order, a.entityId) - Ee(t.custom_entity_order, r.entityId)) : i.sort((a, r) => a.domain.localeCompare(r.domain) || a.name.localeCompare(r.name));
}, Ai = (e) => e.split(".")[0] ?? "", Ei = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), Ci = (e, t) => t.some((i) => i.test(e)), je = (e, t) => {
  var p;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), a = [], r = Ei(t.exclude_by_regex), n = new Set(t.domains), s = new Set(t.exclude_domains), o = new Set(t.include_entities);
  for (const u of Object.values(e.states)) {
    const l = u.entity_id, b = Ai(l), m = (p = e.entities) == null ? void 0 : p[l], x = t.entity_overrides[l], v = xi(e, l), w = [];
    x != null && x.hidden && w.push("hidden by entity override"), t.exclude_entities.includes(l) && w.push("excluded entity"), t.exclude_unavailable && u.state === "unavailable" && w.push("unavailable"), t.exclude_hidden_entities && (m != null && m.hidden_by || m != null && m.hidden) && w.push("hidden entity"), m != null && m.disabled_by && w.push("disabled entity"), m != null && m.entity_category && t.exclude_entity_category.includes(m.entity_category) && w.push("excluded entity category"), s.has(b) && w.push("excluded domain"), !n.has(b) && !o.has(l) && w.push("domain not included"), v.some((_) => t.exclude_labels.includes(_)) && w.push("excluded label"), Ci(l, r) && w.push("excluded by regex");
    const A = Re(e, t, l);
    if (bi(A.id, A.name, t) || w.push("excluded area"), yi(u, b, t) || w.push("inactive state"), w.length) {
      a.push({ entity_id: l, reasons: w });
      continue;
    }
    const se = wi(l, v, t), f = {
      entity: u,
      entityId: l,
      domain: b,
      name: mi(u, x == null ? void 0 : x.name),
      icon: (x == null ? void 0 : x.icon) ?? String(u.attributes.icon ?? t.domain_icons[b] ?? ft[b] ?? "mdi:toggle-switch-outline"),
      areaId: A.id,
      areaName: A.name,
      areaIcon: A.icon,
      labels: v,
      category: m == null ? void 0 : m.entity_category,
      hidden: !!(m != null && m.hidden_by || m != null && m.hidden),
      active: !0,
      protected: se,
      controllable: !0,
      secondary: fi(u, b, t, e),
      skipReasons: []
    };
    if (f.disabledReason = _t(f, t), f.controllable = !f.disabledReason, !$i(f, t)) {
      a.push({ entity_id: l, reasons: ["protected hidden"] });
      continue;
    }
    const $ = i.get(A.id) ?? {
      id: A.id,
      name: A.name,
      icon: A.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    $.entities.push(f), $.domainCounts[b] = ($.domainCounts[b] ?? 0) + 1, se && ($.protectedCount += 1), i.set(A.id, $);
  }
  const c = [...i.values()].map((u) => ({ ...u, entities: Si(u.entities, t) }));
  return { groups: ki(c, t), skipped: a };
};
var Oi = Object.defineProperty, Ii = Object.getOwnPropertyDescriptor, C = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Ii(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Oi(t, i, r), r;
};
const N = [
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
], Ni = [
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
], Ti = {
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
}, Di = {
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
}, E = {
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
let S = class extends B {
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
    const e = ie(this.config), t = ne(this.hass, e.language), i = gt(this.hass, e), a = N.find((n) => n.id === this.activeSection) ?? N[0], r = Ni.filter((n) => n.section === this.activeSection);
    return d`
      <div class="editor" dir=${i ? "rtl" : "ltr"} lang=${t}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${E[t].title}</div>
            <div class="editor-subtitle">${E[t].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${E[t].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${N.map((n) => d`<option value=${n.id}>${n.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${E[t].chooseSection} aria-orientation="vertical">
            ${N.map(
      (n, s) => d`
                <button
                  type="button"
                  id=${`abec-editor-tab-${s}`}
                  class="section-tab"
                  role="tab"
                  aria-selected=${this.activeSection === n.id ? "true" : "false"}
                  aria-controls="abec-editor-panel"
                  tabindex=${this.activeSection === n.id ? "0" : "-1"}
                  @click=${() => this.selectSection(n.id)}
                  @keydown=${(o) => this.navigateSections(o, s)}
                >
                  <ha-icon icon=${n.icon}></ha-icon>
                  <span>${n.title[t]}</span>
                  <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
    )}
          </nav>

          <section
            id="abec-editor-panel"
            class="section-panel"
            role="tabpanel"
            aria-labelledby=${`abec-editor-tab-${Math.max(0, N.findIndex((n) => n.id === a.id))}`}
          >
            <div class="section-heading">
              <ha-icon icon=${a.icon}></ha-icon>
              <div>
                <div class="section-title">${a.title[t]}</div>
                <div class="section-description">${a.description[t]}</div>
              </div>
            </div>

          ${this.activeSection === "Areas" ? this.renderAreaPicker(e) : h}
          ${this.activeSection === "Areas" ? this.renderAreaOrder(e) : h}
          ${this.activeSection === "Entities" ? this.renderEntityPicker(e) : h}
          ${this.activeSection === "Entities" ? this.renderLabelPicker(e) : h}
          ${this.activeSection === "Badge" ? this.renderBadgeTemplates(e) : h}
            ${r.map((n) => this.renderField(n, e))}
          ${this.activeSection === "Debug" ? d`<div class="field"><label class="field-label" for="abec-resulting-config">${E[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : h}
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
    const t = this.editorLanguage(e), i = E[t], a = this.areaOptions(e), r = a.filter((n) => this.matchesSearch(`${n.name} ${n.id}`, this.areaSearch));
    return d`
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
            @input=${(n) => this.updateSearch(n, "area")}
          />
        </div>
        <div class="picker-list">
          ${r.length ? r.map(
      (n) => d`
              <div class="picker-item">
                <ha-icon icon=${n.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${n.name}</div>
                  <div class="picker-meta">${n.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_areas.includes(n.id) || e.include_areas.includes(n.name) ? "active" : ""}"
                    aria-pressed=${e.include_areas.includes(n.id) || e.include_areas.includes(n.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_areas", n.id, "exclude_areas", [n.id, n.name])}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_areas.includes(n.id) || e.exclude_areas.includes(n.name) ? "active" : ""}"
                    aria-pressed=${e.exclude_areas.includes(n.id) || e.exclude_areas.includes(n.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_areas", n.id, "include_areas", [n.id, n.name])}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : d`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderEntityPicker(e) {
    const t = this.editorLanguage(e), i = E[t], a = this.entityOptions(e), r = a.filter(
      (n) => this.matchesSearch(`${n.name} ${n.entityId} ${n.domain} ${n.areaName} ${n.labels}`, this.entitySearch)
    );
    return d`
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
            @input=${(n) => this.updateSearch(n, "entity")}
          />
        </div>
        <div class="picker-list entities-picker">
          ${r.length ? r.map(
      (n) => d`
              <div class="picker-item">
                <ha-icon icon=${n.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${n.name}</div>
                  <div class="picker-meta">
                    ${n.entityId} · ${n.areaName} · ${n.domain}${n.labels ? ` · labels: ${n.labels}` : ""}
                  </div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${e.include_entities.includes(n.entityId) ? "active" : ""}"
                    aria-pressed=${e.include_entities.includes(n.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_entities", n.entityId, "exclude_entities")}
                  >${i.include}</button>
                  <button
                    type="button"
                    class="pill danger ${e.exclude_entities.includes(n.entityId) ? "active" : ""}"
                    aria-pressed=${e.exclude_entities.includes(n.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_entities", n.entityId, "include_entities")}
                  >${i.hide}</button>
                </div>
              </div>
            `
    ) : d`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderLabelPicker(e) {
    const t = this.editorLanguage(e), i = E[t], a = this.labelOptions(), r = a.filter((n) => this.matchesSearch(`${n.id} ${n.name}`, this.labelSearch));
    return d`
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
            @input=${(n) => this.updateSearch(n, "label")}
          />
        </div>
        ${this.labelRegistryStatus === "failed" ? d`
              <div class="status-banner" role="status">
                <span class="status-text">${i.labelsFallback}</span>
                <button type="button" class="action-button" @click=${this.retryLabelRegistry}>${i.retry}</button>
              </div>
            ` : h}
        <div class="picker-list compact-picker">
          ${r.length ? r.map(
      (n) => d`
              <div class="picker-item">
                <ha-icon icon=${n.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${n.name}</div>
                  <div class="picker-meta">${n.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill danger ${e.exclude_labels.includes(n.id) ? "active" : ""}"
                    aria-pressed=${e.exclude_labels.includes(n.id) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_labels", n.id)}
                  >${i.exclude}</button>
                </div>
              </div>
            `
    ) : d`<div class="empty-picker">${i.noResults}</div>`}
        </div>
      </div>
    `;
  }
  renderAreaOrder(e) {
    const t = this.editorLanguage(e), i = E[t], a = this.orderedAreaOptions(e);
    return d`
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
      (r, n) => d`
              <div
                class="picker-item order-item ${this.draggedAreaId === r.id ? "dragging" : ""} ${this.dragOverAreaId === r.id ? "drag-over" : ""}"
                @dragover=${(s) => this.dragAreaOver(s, r.id)}
                @drop=${(s) => this.dropArea(s, r.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${i.drag}
                  aria-hidden="true"
                  @dragstart=${(s) => this.startAreaDrag(s, r.id)}
                  @dragend=${this.endAreaDrag}
                ><ha-icon icon="mdi:drag-vertical"></ha-icon></span>
                <ha-icon icon=${r.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${r.name}</div>
                  <div class="picker-meta">${r.id}</div>
                </div>
                <div class="order-actions">
                  <button type="button" class="icon-action" title=${i.moveUp} aria-label=${`${i.moveUp}: ${r.name}`} ?disabled=${n === 0} @click=${() => this.moveArea(r.id, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button type="button" class="icon-action" title=${i.moveDown} aria-label=${`${i.moveDown}: ${r.name}`} ?disabled=${n === a.length - 1} @click=${() => this.moveArea(r.id, 1)}>
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
    const t = this.editorLanguage(e), i = E[t], { groups: a } = je(this.hass, e), r = a.reduce((s, o) => s + o.entities.length, 0), n = a.length;
    return d`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${i.badgeHelper}</strong>
            <span>${r} ${i.activeNow} · ${n} ${i.activeAreas}</span>
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
    const t = Object.entries(((a = this.hass) == null ? void 0 : a.areas) ?? {}).map(([n, s]) => ({
      id: s.area_id ?? s.id ?? n,
      name: s.name,
      icon: s.icon ?? "mdi:floor-plan"
    })), i = /* @__PURE__ */ new Map();
    for (const n of Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      const s = Re(this.hass, e, n);
      i.set(s.id, { id: s.id, name: s.name, icon: s.icon });
    }
    return [...t, ...i.values()].filter((n, s, o) => o.findIndex((c) => c.id === n.id) === s).sort((n, s) => n.name.localeCompare(s.name));
  }
  orderedAreaOptions(e) {
    const t = this.areaOptions(e), i = e.custom_area_order;
    return t.sort((a, r) => {
      const n = this.orderIndex(i, a.id, a.name), s = this.orderIndex(i, r.id, r.name);
      return n - s || a.name.localeCompare(r.name);
    });
  }
  entityOptions(e) {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).map((i) => {
      const a = i.entity_id.split(".")[0] ?? "", r = Re(this.hass, e, i.entity_id);
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
      const n = r.label_id ?? a;
      e.has(n) || e.set(n, {
        id: n,
        name: r.name ?? n,
        icon: r.icon ?? "mdi:label-outline"
      });
    }
    for (const a of Object.keys(((i = this.hass) == null ? void 0 : i.states) ?? {}))
      for (const r of this.labelsForEntity(a))
        e.has(r) || e.set(r, { id: r, name: r, icon: "mdi:label-outline" });
    return [...e.values()].sort((a, r) => a.name.localeCompare(r.name));
  }
  templateSensorYaml(e) {
    const t = JSON.stringify(e.domains), i = JSON.stringify(e.exclude_domains), a = JSON.stringify(e.exclude_entities), r = JSON.stringify(e.exclude_areas), n = JSON.stringify(e.exclude_labels), s = JSON.stringify(e.active_states), o = JSON.stringify(e.inactive_states);
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
          {% set exclude_labels = ${n} %}
          {% set active_states = ${s} %}
          {% set inactive_states = ${o} %}
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
          {% set exclude_labels = ${n} %}
          {% set active_states = ${s} %}
          {% set inactive_states = ${o} %}
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
    var a, r, n, s;
    const t = (r = (a = this.hass) == null ? void 0 : a.entities) == null ? void 0 : r[e], i = t != null && t.device_id ? (s = (n = this.hass) == null ? void 0 : n.devices) == null ? void 0 : s[t.device_id] : void 0;
    return [.../* @__PURE__ */ new Set([...(t == null ? void 0 : t.labels) ?? [], ...(i == null ? void 0 : i.labels) ?? []])];
  }
  editorLanguage(e = ie(this.config)) {
    return ne(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? Ti[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? Di[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    N.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % N.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + N.length) % N.length), e.key === "Home" && (i = 0), e.key === "End" && (i = N.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(N[i].id), this.updateComplete.then(() => {
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
    const i = ie(this.config), a = this.orderedAreaOptions(i).map((o) => o.id), r = a.indexOf(e), n = r + t;
    if (r < 0 || n < 0 || n >= a.length) return;
    const s = [...a];
    [s[r], s[n]] = [s[n], s[r]], this.updateKeys({ area_sort: "custom", custom_area_order: s });
  }
  enableCustomAreaOrder(e) {
    const t = xe(this.readPath("custom_area_order"));
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
    const a = this.orderedAreaOptions(ie(this.config)).map((p) => p.id), r = a.indexOf(i), n = a.indexOf(t);
    if (r < 0 || n < 0) return;
    const s = [...a];
    s.splice(r, 1);
    const o = s.indexOf(t) + (r < n ? 1 : 0);
    s.splice(o, 0, i), this.updateKeys({ area_sort: "custom", custom_area_order: s });
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
    const r = xe(this.readPath(e)), n = a.some((c) => r.includes(c)), s = n ? r.filter((c) => !a.includes(c)) : [...r.filter((c) => !a.includes(c)), t], o = { [e]: s };
    !n && i && (o[i] = xe(this.readPath(i)).filter((c) => !a.includes(c))), this.updateKeys(o);
  }
  renderField(e, t) {
    var o;
    const i = this.editorLanguage(t), a = E[i], r = this.readPath(e.key), n = this.fieldId(e.key), s = this.fieldLabel(e, i);
    if (e.type === "boolean")
      return d`
        <div class="row">
          <div class="row-text">
            <label class="row-label" for=${n}>${s}</label>
            <span class="field-helper"><code>${e.key}</code></span>
          </div>
          <input
            id=${n}
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
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${s}</label>
          <select id=${n} .value=${c} @change=${(p) => this.updateField(e, this.parseSelectValue(e.key, p.target.value))}>
            ${(o = e.options) == null ? void 0 : o.map((p) => d`<option value=${p.value}>${this.optionLabel(p.value, p.label, i)}</option>`)}
          </select>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    }
    if (e.type === "number")
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${s}</label>
          <input
            id=${n}
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
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${s}</label>
          <textarea id=${n} .value=${pi(r ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, xe(c.target.value))}></textarea>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), p = this.jsonDrafts[e.key] ?? c, u = this.jsonErrors[e.key] ?? this.validateJson(p), l = p !== c;
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${s}</label>
          <textarea
            id=${n}
            class="yaml"
            spellcheck="false"
            aria-invalid=${u ? "true" : "false"}
            aria-describedby=${`${n}-status`}
            .value=${p}
            @input=${(b) => this.updateJsonDraft(e, b.target.value)}
            @keydown=${(b) => this.handleJsonKeydown(b, e)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${n}-status`} class="json-status ${u ? "error" : ""}" role="status" aria-live="polite">
              ${u ?? (l ? a.jsonValid : `${a.configKey}: ${e.key}`)}
            </span>
            <div class="json-actions">
              <button type="button" class="action-button" ?disabled=${!l} @click=${() => this.resetJsonDraft(e.key)}>${a.reset}</button>
              <button type="button" class="action-button primary" ?disabled=${!l || !!u} @click=${() => this.applyJsonDraft(e)}>${a.apply}</button>
            </div>
          </div>
        </div>
      `;
    }
    return d`
      <div class="field">
        <label class="field-label" for=${n}>${s}</label>
        <input
          id=${n}
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
      return !i || typeof i != "object" || Array.isArray(i) ? E[t].jsonObject : void 0;
    } catch (i) {
      const a = i instanceof Error ? i.message : String(i);
      return `${E[t].jsonInvalid}: ${a}`;
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
    const i = ie(t), r = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
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
    for (const s of a.slice(0, -1)) {
      const o = r[s];
      if (o && typeof o == "object" && !Array.isArray(o)) {
        r = o;
        continue;
      }
      if (i === void 0 || i === "") return;
      r[s] = {}, r = r[s];
    }
    const n = a[a.length - 1];
    i === void 0 || i === "" ? delete r[n] : r[n] = i;
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
S.styles = li;
C([
  ve({ attribute: !1 })
], S.prototype, "hass", 2);
C([
  g()
], S.prototype, "config", 2);
C([
  g()
], S.prototype, "activeSection", 2);
C([
  g()
], S.prototype, "areaSearch", 2);
C([
  g()
], S.prototype, "entitySearch", 2);
C([
  g()
], S.prototype, "labelSearch", 2);
C([
  g()
], S.prototype, "registryLabels", 2);
C([
  g()
], S.prototype, "labelRegistryStatus", 2);
C([
  g()
], S.prototype, "jsonDrafts", 2);
C([
  g()
], S.prototype, "jsonErrors", 2);
C([
  g()
], S.prototype, "draggedAreaId", 2);
C([
  g()
], S.prototype, "dragOverAreaId", 2);
S = C([
  Oe(mt)
], S);
const Pi = ge`
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
ge`
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
const vt = (e) => `${Zt}:${e}:expanded`, Li = (e) => {
  try {
    const t = localStorage.getItem(vt(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, Ri = (e, t) => {
  try {
    localStorage.setItem(vt(e), JSON.stringify(t));
  } catch {
  }
}, yt = (e) => {
  const [t, i] = e.split(".");
  return { domain: t, service: i };
}, ji = async (e, t, i) => {
  const a = i.service_mapping[t.domain];
  if (!a) throw new Error(`No turn-off service configured for ${t.domain}`);
  const r = yt(a);
  await e.callService(r.domain, r.service, void 0, { entity_id: t.entityId });
}, nt = async (e, t, i) => {
  const a = /* @__PURE__ */ new Map();
  for (const r of $e(t, i)) {
    const n = i.service_mapping[r.domain];
    if (!n) continue;
    const s = a.get(n) ?? [];
    s.push(r.entityId), a.set(n, s);
  }
  await Promise.all(
    [...a.entries()].map(([r, n]) => {
      const s = yt(r);
      return e.callService(s.domain, s.service, void 0, { entity_id: n });
    })
  );
}, zi = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var Mi = Object.defineProperty, Fi = Object.getOwnPropertyDescriptor, ye = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Fi(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && Mi(t, i, r), r;
};
let X = class extends B {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(mt);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      di(e), this.config = ie(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? Li(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = je(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return d`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return h;
    const e = gt(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = je(this.hass, this.config), a = t.reduce((n, s) => n + s.entities.length, 0), r = t.length;
    return d`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(t, a, r) : h}
          ${t.length ? d`<div class="sections">${t.map((n) => this.renderArea(n))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug ? d`<div class="debug">${JSON.stringify(i.slice(0, 80), null, 2)}</div>` : h}
        </div>
      </ha-card>
    `;
  }
  renderHeader(e, t, i) {
    if (!this.config) return h;
    const a = this.config.title || y(this.config, this.hass, "title"), r = [
      this.config.show_total_count ? `${t} ${y(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${i} ${y(this.config, this.hass, "active_areas")}` : ""
    ].filter(Boolean).join(" · ");
    return d`
      <div class="header">
        <div class="title">
          <div>${a}</div>
          ${r ? d`<div class="subtitle">${r}</div>` : h}
        </div>
        ${this.config.show_global_turn_off ? d`
              <button
                class="icon-button danger"
                title=${y(this.config, this.hass, "turn_off_all")}
                aria-label=${y(this.config, this.hass, "turn_off_all")}
                @click=${(n) => this.turnOffGlobal(n, e)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : h}
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return h;
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), a = $e(e.entities, this.config), r = this.config.areas[e.id] ?? this.config.areas[e.name], n = (r == null ? void 0 : r.allow_turn_off) !== !1 && a.length > 0, s = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, o = e.entities.length - s.length;
    return d`
      <section class="area-section ${t ? "expanded" : ""}" style=${r != null && r.accent_color ? `--abec-accent:${r.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${`${y(this.config, this.hass, t ? "collapse_area" : "expand_area")}: ${e.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(e)}
          >
            ${this.config.show_area_icons ? d`<span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : h}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${e.name}</span>
                <span class="count">${e.entities.length} ${y(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !t && i ? d`<span class="preview">${i}</span>` : h}
              ${this.config.show_domain_chips ? this.renderDomainChips(e) : h}
              ${this.config.show_area_ids ? d`<span class="preview">${e.id}</span>` : h}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off ? d`
                  <button
                    class="icon-button danger"
                    ?disabled=${!n}
                    title=${y(this.config, this.hass, "turn_off_area")}
                    aria-label=${y(this.config, this.hass, "turn_off_area")}
                    @click=${(c) => this.turnOffArea(c, e)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                ` : h}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${t ? d`
              <div class="entities">
                ${s.map((c) => this.renderEntity(c))}
                ${o > 0 ? d`<div class="secondary">${o} ${y(this.config, this.hass, "show_more")}</div>` : h}
              </div>
            ` : h}
      </section>
    `;
  }
  renderDomainChips(e) {
    return this.config ? d`
      <div class="chips">
        ${Object.entries(e.domainCounts).map(([t, i]) => {
      var r;
      const a = ((r = this.config) == null ? void 0 : r.domain_chip_mode) ?? "icons";
      return d`
            <span class="chip" title=${rt(this.config, this.hass, t)}>
              ${a !== "text" ? d`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : h}
              ${a !== "icons" ? d`<span>${i} ${rt(this.config, this.hass, t)}</span>` : d`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : h;
  }
  renderEntity(e) {
    if (!this.config) return h;
    const t = this.config.show_entity_secondary_info ? _i(e, this.config) : "";
    return d`
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
          ${this.config.show_entity_icons ? d`<span class="icon-bubble entity-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : h}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${e.name}</span>
              ${e.protected ? d`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${y(this.config, this.hass, "protected")}</span>` : h}
            </span>
            ${t ? d`<span class="secondary">${t}</span>` : h}
          </span>
        </button>
        ${this.config.show_entity_turn_off ? d`
              <button
                class="icon-button danger"
                ?disabled=${!e.controllable}
                title=${e.disabledReason ?? y(this.config, this.hass, "turn_off_entity")}
                aria-label=${y(this.config, this.hass, "turn_off_entity")}
                @click=${(i) => this.turnOffEntity(i, e)}
              >
                <ha-icon icon=${e.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            ` : h}
      </div>
    `;
  }
  renderEmpty() {
    return !this.config || !this.config.show_empty ? h : d`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || y(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || y(this.config, this.hass, "empty_subtitle")}</div>
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
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && Ri(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(y(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await ji(this.hass, t, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = $e(t.entities, this.config);
    if (!i.length) return;
    const a = this.config.areas[t.id] ?? this.config.areas[t.name], r = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((o) => this.config.dangerous_domains.includes(o.domain)), n = (a == null ? void 0 : a.confirm_turn_off) ?? r, s = `${y(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${y(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(n && !window.confirm(s)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await zi(this.hass, t.id) : await nt(this.hass, i, this.config);
      } catch (o) {
        this.reportError(o);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = $e(t.flatMap((r) => r.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((r) => this.config.dangerous_domains.includes(r.domain))) && !window.confirm(y(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await nt(this.hass, i, this.config);
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
X.styles = Pi;
ye([
  ve({ attribute: !1 })
], X.prototype, "hass", 2);
ye([
  g()
], X.prototype, "config", 2);
ye([
  g()
], X.prototype, "expanded", 2);
ye([
  g()
], X.prototype, "error", 2);
X = ye([
  Oe(Qt)
], X);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.2.0 ${ne(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const xt = (e, t) => {
  const i = e.allEntities.filter((a) => a.available && a.active && !a.protected);
  return t === "lights" ? i.filter((a) => a.domain === "light") : t === "switches" ? i.filter((a) => a.domain === "switch" && a.section === "lights_switches") : t === "climate" ? i.filter((a) => a.section === "climate") : t === "floor_heating" ? i.filter((a) => a.section === "floor_heating") : t === "covers" ? i.filter((a) => {
    if (a.domain !== "cover") return !1;
    const r = a.entity.attributes.supported_features;
    return typeof r != "number" || (r & 2) !== 0;
  }) : i.filter((a) => a.domain === "media_player");
}, Hi = (e, t) => {
  if (e === "covers" && t === "cover") return { domain: "cover", service: "close_cover" };
  if (t === "light") return { domain: "light", service: "turn_off" };
  if (t === "switch") return { domain: "switch", service: "turn_off" };
  if (t === "climate") return { domain: "climate", service: "turn_off" };
  if (t === "fan") return { domain: "fan", service: "turn_off" };
  if (t === "media_player") return { domain: "media_player", service: "turn_off" };
  if (t === "input_boolean") return { domain: "input_boolean", service: "turn_off" };
  if (t === "water_heater") return { domain: "water_heater", service: "turn_off" };
}, Bi = async (e, t, i) => {
  const a = xt(t, i), r = /* @__PURE__ */ new Map(), n = [];
  for (const c of a) {
    const p = Hi(i, c.domain);
    if (!p) {
      n.push(c.entityId);
      continue;
    }
    const u = `${p.domain}.${p.service}`, l = r.get(u) ?? { ...p, entityIds: [] };
    l.entityIds.push(c.entityId), r.set(u, l);
  }
  if (n.length > 0)
    throw new Error(`Unsupported entities for the ${i} area action: ${n.join(", ")}.`);
  const s = await Promise.allSettled(
    [...r.values()].map((c) => e.callService(c.domain, c.service, void 0, { entity_id: c.entityIds }))
  ), o = s.filter((c) => c.status === "rejected");
  if (o.length) throw new Error(`${o.length} of ${s.length} area actions failed.`);
}, ee = (e, t, i, a) => {
  const r = t.split(".")[0] ?? "homeassistant";
  return e.callService(r, i, a, { entity_id: t });
}, W = "custom:area-bubble-overview-card", ze = "area-bubble-overview-card", wt = "area-bubble-overview-card-editor", Ui = "area-bubble-overview-card", j = ["climate", "floor_heating", "covers", "lights_switches", "media"], $t = ["lights", "climate", "floor_heating", "switches", "covers", "media"], kt = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, St = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, At = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  show_shadows: !0,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "rgba(255,255,255,0.075)",
  active_color: "var(--state-active-color, #ffc107)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)"
}, Ji = {
  type: W,
  language: "auto",
  rtl: "auto",
  show_header: !0,
  show_floor_header: !0,
  show_temperature: !0,
  show_occupancy: !0,
  show_quick_actions: !0,
  show_empty_sections: !1,
  default_expanded: !1,
  remember_expanded_state: !0,
  section_order: j,
  quick_actions: $t,
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
  style: At,
  debug: !1
}, U = (e) => !!e && typeof e == "object" && !Array.isArray(e), I = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], Et = (e) => {
  const t = new Set(j), i = I(e).filter((a) => t.has(a));
  return [.../* @__PURE__ */ new Set([...i, ...j])];
}, Me = (e) => {
  if (!U(e)) return {};
  const t = {};
  for (const i of j) {
    const a = I(e[i]);
    a.length && (t[i] = a);
  }
  return t;
}, Ct = (e) => {
  if (!U(e)) return {};
  const t = {};
  for (const i of j)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, Vi = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(I(e).filter((i) => t.has(i)))];
}, qi = (e) => {
  if (!U(e)) return {};
  const t = {};
  for (const [i, a] of Object.entries(e))
    U(a) && (t[i] = {
      ...typeof a.name == "string" ? { name: a.name } : {},
      ...typeof a.icon == "string" ? { icon: a.icon } : {},
      ...typeof a.hidden == "boolean" ? { hidden: a.hidden } : {},
      ...typeof a.default_expanded == "boolean" ? { default_expanded: a.default_expanded } : {},
      ...typeof a.temperature_entity == "string" ? { temperature_entity: a.temperature_entity } : {},
      occupancy_entities: I(a.occupancy_entities),
      ...Array.isArray(a.section_order) ? { section_order: Et(a.section_order) } : {},
      section_titles: Ct(a.section_titles),
      entity_order: Me(a.entity_order),
      include_entities: Me(a.include_entities),
      exclude_entities: I(a.exclude_entities)
    });
  return t;
}, Ki = (e) => {
  if (!U(e)) return {};
  const t = new Set(j), i = {};
  for (const [a, r] of Object.entries(e))
    U(r) && (i[a] = {
      ...typeof r.name == "string" ? { name: r.name } : {},
      ...typeof r.icon == "string" ? { icon: r.icon } : {},
      ...typeof r.section == "string" && t.has(r.section) ? { section: r.section } : {},
      ...typeof r.hidden == "boolean" ? { hidden: r.hidden } : {},
      ...typeof r.protected == "boolean" ? { protected: r.protected } : {}
    });
  return i;
}, de = (e) => {
  const t = { ...Ji, ...e }, i = Ct(e.section_titles);
  return {
    ...t,
    type: W,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    section_order: Et(e.section_order),
    section_titles: Object.fromEntries(
      j.map((a) => [a, typeof i[a] == "string" ? i[a] : ""])
    ),
    quick_actions: Vi(e.quick_actions ?? t.quick_actions),
    area_order: I(e.area_order),
    floor_heating_labels: I(t.floor_heating_labels),
    floor_heating_entities: I(t.floor_heating_entities),
    occupancy_device_classes: I(t.occupancy_device_classes),
    include_entities: Me(e.include_entities),
    exclude_entities: I(t.exclude_entities),
    protected_labels: I(t.protected_labels),
    protected_entities: I(t.protected_entities),
    area_overrides: qi(e.area_overrides),
    entity_overrides: Ki(e.entity_overrides),
    style: { ...At, ...U(e.style) ? e.style : {} }
  };
}, Gi = (e) => {
  if (!U(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== W) throw new Error(`Card type must be ${W}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, Wi = {
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
}, Yi = {
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
}, Xi = {
  he: {
    lights: "כיבוי תאורה",
    climate: "כיבוי מיזוג",
    floor_heating: "כיבוי חימום רצפתי",
    switches: "כיבוי מפסקים",
    covers: "סגירת תריסים",
    media: "כיבוי מוזיקה"
  },
  en: {
    lights: "Turn off lights",
    climate: "Turn off climate",
    floor_heating: "Turn off floor heating",
    switches: "Turn off switches",
    covers: "Close covers",
    media: "Turn off music"
  }
}, R = (e, t) => {
  var a;
  if (t.language === "he" || t.language === "en") return t.language;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Qi = (e, t) => typeof t.rtl == "boolean" ? t.rtl : R(e, t) === "he" || document.documentElement.dir === "rtl", M = (e, t, i) => Wi[R(e, t)][i], Zi = (e, t, i, a) => a || t.section_titles[i] || Yi[R(e, t)][i], ea = (e, t, i) => Xi[R(e, t)][i], fe = (e) => e.split(".")[0] ?? "", st = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, ta = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(a.area_id ?? a.id ?? i, a);
  return t;
}, ia = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), ke = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (a == null ? void 0 : a.area_id) ?? void 0;
}, aa = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []])];
}, ra = (e, t, i, a) => {
  var s, o, c;
  const r = e.entity_overrides[a];
  if (r != null && r.section) return r.section;
  const n = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const p of e.section_order)
    if ((o = (s = n == null ? void 0 : n.include_entities) == null ? void 0 : s[p]) != null && o.includes(a) || (c = e.include_entities[p]) != null && c.includes(a)) return p;
}, na = (e, t, i, a, r, n) => {
  const s = ra(e, t, i, a);
  if (s) return s;
  if (e.floor_heating_entities.includes(a) || n.some((o) => e.floor_heating_labels.includes(o)))
    return "floor_heating";
  if (r === "climate" || r === "fan") return "climate";
  if (r === "cover") return "covers";
  if (r === "light" || r === "switch") return "lights_switches";
  if (r === "media_player") return "media";
}, sa = (e, t = fe(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, oa = (e, t, i) => {
  var a;
  return i || ((a = e == null ? void 0 : e.formatEntityName) == null ? void 0 : a.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, ca = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), ot = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, Pe = (e) => {
  if (!e) return {};
  const t = st(e.attributes.current_temperature), i = st(e.state), a = t ?? i, r = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: a, unit: r };
}, ct = (e) => {
  if (!e.length) return;
  const t = [...e].sort((a, r) => a - r), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, la = (e, t, i, a, r) => {
  var p, u;
  const n = r.area_overrides[t] ?? r.area_overrides[(i == null ? void 0 : i.name) ?? ""], s = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((l) => !!l))];
  for (const l of s) {
    const b = Pe(e == null ? void 0 : e.states[l]);
    if (b.value !== void 0) return { temperature: b.value, unit: b.unit };
  }
  const o = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => !!l).filter((l) => fe(l.entity_id) === "sensor" && l.attributes.device_class === "temperature").map(Pe).filter((l) => l.value !== void 0);
  if (o.length) return { temperature: ct(o.map((l) => l.value)), unit: (p = o.find((l) => l.unit)) == null ? void 0 : p.unit };
  const c = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => l !== void 0 && fe(l.entity_id) === "climate").map(Pe).filter((l) => l.value !== void 0);
  return { temperature: ct(c.map((l) => l.value)), unit: (u = c.find((l) => l.unit)) == null ? void 0 : u.unit };
}, da = (e, t, i, a, r) => {
  var c;
  const n = ((c = r.area_overrides[t] ?? r.area_overrides[i ?? ""]) == null ? void 0 : c.occupancy_entities) ?? [], s = n.length ? n : a.filter((p) => {
    const u = e == null ? void 0 : e.states[p];
    return fe(p) === "binary_sensor" && r.occupancy_device_classes.includes(String((u == null ? void 0 : u.attributes.device_class) ?? ""));
  });
  if (!s.length) return { occupancy: "none", entities: [] };
  const o = s.map((p) => {
    var u;
    return String(((u = e == null ? void 0 : e.states[p]) == null ? void 0 : u.state) ?? "unknown").toLowerCase();
  });
  return o.some((p) => p === "on") ? { occupancy: "occupied", entities: s } : o.every((p) => p === "off") ? { occupancy: "vacant", entities: s } : { occupancy: "unknown", entities: s };
}, pa = (e, t, i, a, r) => {
  var x, v, w, A, se;
  const n = t.area_overrides[i] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""];
  if (n != null && n.hidden) return;
  const s = Object.values((n == null ? void 0 : n.include_entities) ?? {}).flat(), o = [.../* @__PURE__ */ new Set([...r, ...s])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(n == null ? void 0 : n.exclude_entities) ?? []]), p = [];
  for (const f of o) {
    const $ = e == null ? void 0 : e.states[f];
    if (!$ || c.has(f)) continue;
    const _ = (x = e == null ? void 0 : e.entities) == null ? void 0 : x[f], T = _ != null && _.device_id ? (v = e == null ? void 0 : e.devices) == null ? void 0 : v[_.device_id] : void 0, k = t.entity_overrides[f];
    if (k != null && k.hidden || _ != null && _.hidden || _ != null && _.hidden_by || _ != null && _.disabled_by || T != null && T.disabled_by || (_ == null ? void 0 : _.entity_category) === "config" || (_ == null ? void 0 : _.entity_category) === "diagnostic") continue;
    const V = fe(f), Z = aa(e, f), Ve = na(t, i, a == null ? void 0 : a.name, f, V, Z);
    Ve && p.push({
      entity: $,
      entityId: f,
      domain: V,
      name: oa(e, $, k == null ? void 0 : k.name),
      icon: ca($, V, k == null ? void 0 : k.icon),
      areaId: i,
      section: Ve,
      labels: Z,
      available: !["unavailable", "unknown"].includes($.state),
      active: sa($, V),
      protected: (k == null ? void 0 : k.protected) === !0 || t.protected_entities.includes(f) || Z.some((Ot) => t.protected_labels.includes(Ot))
    });
  }
  const l = ((w = n == null ? void 0 : n.section_order) != null && w.length ? n.section_order : t.section_order).map((f) => {
    var _;
    const $ = p.filter((T) => T.section === f).sort(
      (T, k) => {
        var V, Z;
        return ot((V = n == null ? void 0 : n.entity_order) == null ? void 0 : V[f], T.entityId) - ot((Z = n == null ? void 0 : n.entity_order) == null ? void 0 : Z[f], k.entityId) || T.name.localeCompare(k.name);
      }
    );
    return {
      id: f,
      title: Zi(e, t, f, (_ = n == null ? void 0 : n.section_titles) == null ? void 0 : _[f]),
      icon: kt[f],
      entities: $,
      activeCount: $.filter((T) => T.active).length
    };
  }).filter((f) => t.show_empty_sections || f.entities.length > 0), b = la(e, i, a, r, t), m = da(e, i, a == null ? void 0 : a.name, r, t);
  return {
    id: i,
    name: (n == null ? void 0 : n.name) ?? (a == null ? void 0 : a.name) ?? i,
    icon: (n == null ? void 0 : n.icon) ?? (a == null ? void 0 : a.icon) ?? "mdi:floor-plan",
    floorId: (a == null ? void 0 : a.floor_id) ?? void 0,
    sections: l,
    allEntities: p,
    temperature: b.temperature,
    temperatureUnit: b.unit ?? ((se = (A = e == null ? void 0 : e.config) == null ? void 0 : A.unit_system) == null ? void 0 : se.temperature) ?? "°C",
    occupancy: m.occupancy,
    occupancyEntities: m.entities
  };
}, ua = (e, t, i) => {
  if (t.area) {
    const a = [...i.entries()].find(([r, n]) => r === t.area || n.name === t.area);
    return a ? { ids: [a[0]], targetName: a[1].name, targetIcon: a[1].icon ?? "mdi:floor-plan", kind: "area", warnings: [] } : { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
  }
  if (t.floor) {
    const a = ia(e).find((n) => n.id === t.floor || n.name === t.floor);
    if (!a) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const r = [...i.entries()].filter(([, n]) => n.floor_id === a.id).map(([n]) => n);
    return { ids: r, targetName: a.name, targetIcon: a.icon ?? "mdi:home-floor-0", kind: "floor", warnings: r.length ? [] : [`Floor has no areas: ${a.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, Fe = (e, t) => {
  const i = ta(e), a = ua(e, t, i), r = /* @__PURE__ */ new Map();
  for (const o of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const c = ke(e, o);
    if (!c) continue;
    const p = r.get(c) ?? [];
    p.push(o), r.set(c, p);
  }
  const n = (o, c) => {
    const p = t.area_order.findIndex((u) => u === o || u === c);
    return p < 0 ? Number.MAX_SAFE_INTEGER : p;
  };
  return {
    areas: a.ids.map((o) => pa(e, t, o, i.get(o), r.get(o) ?? [])).filter((o) => !!o).sort((o, c) => n(o.id, o.name) - n(c.id, c.name) || o.name.localeCompare(c.name)),
    targetName: t.title || a.targetName,
    targetIcon: a.targetIcon,
    targetKind: a.kind,
    warnings: a.warnings
  };
};
var ha = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, J = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ba(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && ha(t, i, r), r;
};
let P = class extends B {
  constructor() {
    super(...arguments), this.config = { type: W }, this.targetMode = "area", this.activeAreaId = "", this.entitySearch = "", this.candidateEntityId = "", this.candidateSection = "floor_heating";
  }
  setConfig(e) {
    this.config = { ...e, type: W }, this.targetMode = e.floor ? "floor" : "area", e.area && (this.activeAreaId = e.area);
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.floors !== this.hass.floors || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : t.states !== this.hass.states;
  }
  render() {
    const e = de(this.config), t = R(this.hass, e), i = typeof e.rtl == "boolean" ? e.rtl : t === "he";
    this.setAttribute("dir", i ? "rtl" : "ltr"), this.style.setProperty("--overview-editor-direction", i ? "rtl" : "ltr");
    const a = Fe(this.hass, e), r = this.targetAreas(e), n = this.entityMapByArea();
    return r.length && !r.some((s) => s.id === this.activeAreaId) && queueMicrotask(() => this.activeAreaId = r[0].id), d`
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
        ${this.renderAreas(e, r, n, t)}
        ${this.renderEntities(e, a, r, t)}
        ${this.renderAppearance(e, t)}
        ${this.renderAdvanced(e, t)}
      </div>
    `;
  }
  renderTarget(e, t) {
    const i = this.areaOptions(), a = this.floorOptions(), r = this.targetMode === "area" ? this.areaIdFor(e.area) : this.floorIdFor(e.floor);
    return d`
      <details open>
        ${this.summary("mdi:map-marker-radius", this.l("יעד", "Target", t), this.l("בחרו חדר יחיד או קומה שלמה", "Choose one room or a complete floor", t))}
        <div class="panel">
          <div class="segmented">
            <button type="button" class="segment ${this.targetMode === "area" ? "active" : ""}" @click=${() => this.targetMode = "area"}>${this.l("אזור", "Area", t)}</button>
            <button type="button" class="segment ${this.targetMode === "floor" ? "active" : ""}" @click=${() => this.targetMode = "floor"}>${this.l("קומה", "Floor", t)}</button>
          </div>
          <div class="field">
            <label>${this.targetMode === "area" ? this.l("אזור להצגה", "Area to show", t) : this.l("קומה להצגה", "Floor to show", t)}</label>
            <select .value=${r} @change=${(n) => this.setTarget(n.target.value)}>
              <option value="" ?selected=${!r}>${this.l("בחרו...", "Choose...", t)}</option>
              ${(this.targetMode === "area" ? i : a).map((n) => d`<option value=${n.id} ?selected=${n.id === r}>${n.name}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${this.l("כותרת מותאמת (רשות)", "Custom title (optional)", t)}</label>
            <input type="text" .value=${e.title} @change=${(n) => this.commitKey("title", n.target.value)} />
          </div>
          ${this.targetMode === "floor" && !a.length ? d`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", t)}</div>` : h}
        </div>
      </details>
    `;
  }
  renderSummarySettings(e, t) {
    const i = [
      ["show_header", this.l("הצג כותרת", "Show header", t), this.l("כותרת קומה או כותרת מותאמת", "Floor or custom card heading", t), e.show_header],
      ["show_temperature", this.l("הצג טמפרטורה", "Show temperature", t), this.l("חיישן מועדף, חיישני טמפרטורה או מזגן", "Preferred sensor, temperature sensors, or climate", t), e.show_temperature],
      ["show_occupancy", this.l("הצג נוכחות", "Show occupancy", t), this.l("מאוכלס, ריק או לא ידוע", "Occupied, vacant, or unknown", t), e.show_occupancy],
      ["show_quick_actions", this.l("הצג פעולות מהירות", "Show quick actions", t), this.l("כיבוי ישירות מהכרטיס הסגור", "Turn devices off without opening the area", t), e.show_quick_actions],
      ["default_expanded", this.l("פתוח כברירת מחדל", "Expanded by default", t), "", e.default_expanded],
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", t), "", e.remember_expanded_state],
      ["show_empty_sections", this.l("הצג סעיפים ריקים", "Show empty sections", t), "", e.show_empty_sections]
    ];
    return d`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", t), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", t))}
        <div class="panel"><div class="settings-list">${i.map(([a, r, n, s]) => this.booleanRow(r, n, s, (o) => this.commitKey(a, o)))}</div></div>
      </details>
    `;
  }
  renderSections(e, t) {
    return d`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", t), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", t))}
        <div class="panel">
          <div class="hint">${this.l("ישויות חדשות מצטרפות אוטומטית בסוף הסעיף, כך שהסידור הידני נשאר יציב.", "New entities are appended automatically, so your manual order remains stable.", t)}</div>
          <div class="order-list">
            ${e.section_order.map((i, a) => d`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${kt[i]}></ha-icon></span>
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
            ${[...e.quick_actions, ...$t.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      const a = e.quick_actions.includes(i), r = e.quick_actions.indexOf(i);
      return d`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${St[i]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(i, t)}</div></div>
                  <div class="area-actions">
                    ${a ? this.orderButtons(r, e.quick_actions.length, () => this.moveQuickAction(i, -1), () => this.moveQuickAction(i, 1)) : h}
                    ${this.switchControl(a, (n) => this.toggleQuickAction(i, n), this.quickName(i, t))}
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
    return d`
      <details>
        ${this.summary("mdi:floor-plan", this.l("אזורים בקומה", "Areas", a), this.l("סדר, כותרת, אייקון וחיישנים מועדפים", "Order, title, icon, and preferred sensors", a))}
        <div class="panel">
          ${t.length ? d`<div class="order-list">${t.map((r, n) => this.renderAreaEditor(r, n, t.length, e, i.get(r.id) ?? [], a))}</div>` : d`<div class="empty">${this.l("בחרו יעד כדי לערוך אזורים", "Choose a target to edit its areas", a)}</div>`}
        </div>
      </details>
    `;
  }
  renderAreaEditor(e, t, i, a, r, n) {
    const s = a.area_overrides[e.id] ?? a.area_overrides[e.name] ?? {}, o = this.activeAreaId === e.id, c = r.filter(
      (u) => u.entity_id.startsWith("climate.") || u.entity_id.startsWith("sensor.") && u.attributes.device_class === "temperature"
    ), p = r.filter((u) => u.entity_id.startsWith("binary_sensor."));
    return d`
      <div class="area-card ${s.hidden ? "hidden" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${s.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${o ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${s.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, a), () => this.moveArea(e.id, 1, a))}
            ${this.switchControl(!s.hidden, (u) => this.updateAreaOverride(e.id, { hidden: !u }), this.l("הצג אזור", "Show area", n))}
          </div>
        </div>
        ${o ? d`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", n)}</label><input type="text" .value=${s.name ?? ""} placeholder=${e.name} @change=${(u) => this.updateAreaOverride(e.id, { name: u.target.value || void 0 })} /></div>
                <div class="field"><label>${this.l("אייקון", "Icon", n)}</label><input type="text" .value=${s.icon ?? ""} placeholder=${e.icon} @change=${(u) => this.updateAreaOverride(e.id, { icon: u.target.value || void 0 })} /></div>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", n)}</label>
                <select .value=${s.temperature_entity ?? ""} @change=${(u) => this.updateAreaOverride(e.id, { temperature_entity: u.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", n)}</option>
                  ${c.map((u) => d`<option value=${u.entity_id}>${this.entityName(u)}</option>`)}
                </select>
              </div>
              ${p.length ? d`<div class="field"><label>${this.l("חיישני נוכחות (ריק = אוטומטי)", "Occupancy sensors (empty = automatic)", n)}</label><div class="entity-flags">${p.map((u) => {
      var b;
      const l = ((b = s.occupancy_entities) == null ? void 0 : b.includes(u.entity_id)) ?? !1;
      return d`<label class="check-label"><input type="checkbox" .checked=${l} @change=${(m) => this.toggleAreaList(e.id, "occupancy_entities", u.entity_id, m.target.checked)} />${this.entityName(u)}</label>`;
    })}</div></div>` : h}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", n)}</div></div>${this.switchControl(s.default_expanded ?? a.default_expanded, (u) => this.updateAreaOverride(e.id, { default_expanded: u }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", n)}</div>
              <div class="inline-fields">
                ${a.section_order.map((u) => {
      var l;
      return d`<div class="field"><label>${this.sectionDefaultName(u, n)}</label><input type="text" .value=${((l = s.section_titles) == null ? void 0 : l[u]) ?? ""} placeholder=${a.section_titles[u] || this.sectionDefaultName(u, n)} @change=${(b) => this.setAreaSectionTitle(e.id, u, b.target.value)} /></div>`;
    })}
              </div>
            ` : h}
      </div>
    `;
  }
  renderEntities(e, t, i, a) {
    var u;
    const r = this.activeAreaId || ((u = i[0]) == null ? void 0 : u.id) || "", n = t.areas.find((l) => l.id === r), s = new Map(((n == null ? void 0 : n.allEntities) ?? []).map((l) => [l.entityId, l])), o = this.entitiesForEditor(r, s, e), c = this.unclassifiedCandidates(r, s), p = o.filter((l) => `${l.name} ${l.entityId} ${l.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return d`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", a), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", a))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${r} @change=${(l) => this.activeAreaId = l.target.value}>${i.map((l) => d`<option value=${l.id}>${l.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", a)} .value=${this.entitySearch} @input=${(l) => this.entitySearch = l.target.value} />
          </div>
          <div class="hint">${this.l("שינוי סעיף הוא הדרך המומלצת לזהות חימום רצפתי או לתקן גילוי אוטומטי.", "Change a section to identify floor heating or correct automatic discovery.", a)}</div>
          ${c.length ? d`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", a)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", a)}</label>
                      <select .value=${this.candidateEntityId} @change=${(l) => this.candidateEntityId = l.target.value}>
                        <option value="">${this.l("בחרו...", "Choose...", a)}</option>
                        ${c.map((l) => d`<option value=${l.entity_id}>${this.entityName(l)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", a)}</label>
                      <select .value=${this.candidateSection} @change=${(l) => this.candidateSection = l.target.value}>
                        ${j.map((l) => d`<option value=${l}>${this.sectionDefaultName(l, a)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", a)}
                  </button>
                </div>
              ` : h}
          <div class="entity-list">
            ${p.length ? p.map((l) => {
      const b = e.entity_overrides[l.entityId] ?? {}, m = o.filter((v) => v.section === l.section), x = m.findIndex((v) => v.entityId === l.entityId);
      return d`
                    <div class="entity-item ${l.active ? "active" : ""}">
                      <span class="order-icon"><ha-icon icon=${b.icon ?? l.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${b.name || l.name}</div><div class="meta">${l.entityId}</div></div>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", a)}</label><input type="text" .value=${b.name ?? ""} placeholder=${l.name} @change=${(v) => this.updateEntityOverride(l.entityId, { name: v.target.value || void 0 })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", a)}</label><select .value=${b.section ?? l.section} @change=${(v) => this.updateEntityOverride(l.entityId, { section: v.target.value })}>${j.map((v) => d`<option value=${v}>${this.sectionDefaultName(v, a)}</option>`)}</select></div>
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${b.protected ?? l.protected} @change=${(v) => this.updateEntityOverride(l.entityId, { protected: v.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", a)}</label>
                        ${this.orderButtons(x, m.length, () => this.moveEntity(r, l.section, l.entityId, -1, m.map((v) => v.entityId)), () => this.moveEntity(r, l.section, l.entityId, 1, m.map((v) => v.entityId)))}
                      </div>
                    </div>
                  `;
    }) : d`<div class="empty">${this.l("אין רכיבים להצגה באזור זה", "No devices to show in this area", a)}</div>`}
          </div>
        </div>
      </details>
    `;
  }
  renderAppearance(e, t) {
    return d`
      <details>
        ${this.summary("mdi:palette-outline", this.l("מראה ושפה", "Appearance and language", t), this.l("צבעים, מרווחים ו-RTL", "Colors, spacing, and RTL", t))}
        <div class="panel">
          <div class="inline-fields">
            ${this.numberField(this.l("עיגול פינות", "Corner radius", t), e.style.border_radius, 4, 40, (i) => this.setStyle("border_radius", i))}
            ${this.numberField(this.l("טשטוש זכוכית", "Glass blur", t), e.style.blur, 0, 40, (i) => this.setStyle("blur", i))}
            ${this.numberField(this.l("גובה שורה", "Row height", t), e.style.row_height, 44, 84, (i) => this.setStyle("row_height", i))}
            ${this.numberField(this.l("מרווח סעיפים", "Section gap", t), e.style.section_gap, 4, 30, (i) => this.setStyle("section_gap", i))}
            <div class="field"><label>${this.l("צבע הדגשה", "Accent color", t)}</label><input type="text" .value=${e.style.accent_color} @change=${(i) => this.setStyle("accent_color", i.target.value)} /></div>
            <div class="field"><label>${this.l("צבע פעיל", "Active color", t)}</label><input type="text" .value=${e.style.active_color} @change=${(i) => this.setStyle("active_color", i.target.value)} /></div>
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
    return d`
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
    return d`<summary><ha-icon icon=${e}></ha-icon><span><span class="summary-title">${t}</span><span class="summary-subtitle">${i}</span></span><ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon></summary>`;
  }
  booleanRow(e, t, i, a) {
    return d`<div class="setting-row"><div class="setting-main"><div class="setting-title">${e}</div>${t ? d`<div class="meta">${t}</div>` : h}</div>${this.switchControl(i, a, e)}</div>`;
  }
  switchControl(e, t, i) {
    return d`<label class="switch" title=${i}><input type="checkbox" .checked=${e} aria-label=${i} @change=${(a) => t(a.target.checked)} /><span></span></label>`;
  }
  orderButtons(e, t, i, a) {
    return d`<div class="order-controls"><button class="icon-button" type="button" ?disabled=${e <= 0} @click=${i} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="icon-button" type="button" ?disabled=${e < 0 || e >= t - 1} @click=${a} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;
  }
  numberField(e, t, i, a, r) {
    return d`<div class="field"><label>${e}</label><input type="number" min=${i} max=${a} .value=${String(t)} @change=${(n) => r(Number(n.target.value))} /></div>`;
  }
  listField(e, t, i) {
    return d`<div class="field"><label>${e}</label><textarea .value=${t.join(`
`)} @change=${(a) => i(this.splitList(a.target.value))}></textarea></div>`;
  }
  areaOptions() {
    var e;
    return Object.entries(((e = this.hass) == null ? void 0 : e.areas) ?? {}).map(([t, i]) => ({ id: i.area_id ?? i.id ?? t, name: i.name, icon: i.icon ?? "mdi:floor-plan", floorId: i.floor_id ?? void 0 })).sort((t, i) => t.name.localeCompare(i.name));
  }
  floorOptions() {
    var e;
    return Object.entries(((e = this.hass) == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ id: i.floor_id ?? i.id ?? t, name: i.name, level: i.level ?? Number.MAX_SAFE_INTEGER })).sort((t, i) => t.level - i.level || t.name.localeCompare(i.name));
  }
  targetAreas(e) {
    const t = this.areaOptions();
    let i = t;
    if (e.area && (i = t.filter((a) => a.id === e.area || a.name === e.area)), e.floor) {
      const a = this.floorIdFor(e.floor);
      i = t.filter((r) => r.floorId === a);
    }
    return i.sort((a, r) => {
      const n = e.area_order.findIndex((o) => o === a.id || o === a.name), s = e.area_order.findIndex((o) => o === r.id || o === r.name);
      return (n < 0 ? Number.MAX_SAFE_INTEGER : n) - (s < 0 ? Number.MAX_SAFE_INTEGER : s) || a.name.localeCompare(r.name);
    });
  }
  entityMapByArea() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const i of Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {})) {
      const a = ke(this.hass, i.entity_id);
      if (!a) continue;
      const r = e.get(a) ?? [];
      r.push(i), e.set(a, r);
    }
    return e;
  }
  entitiesForEditor(e, t, i) {
    var r, n, s;
    const a = [...t.values()];
    for (const o of Object.values(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      if (ke(this.hass, o.entity_id) !== e || t.has(o.entity_id)) continue;
      const c = (s = (n = this.hass) == null ? void 0 : n.entities) == null ? void 0 : s[o.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const p = i.entity_overrides[o.entity_id];
      if (!(p != null && p.section)) continue;
      const u = o.entity_id.split(".")[0] ?? "";
      a.push({
        entity: o,
        entityId: o.entity_id,
        domain: u,
        name: p.name ?? this.entityName(o),
        icon: p.icon ?? String(o.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: p.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(o.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(o.state),
        protected: p.protected === !0
      });
    }
    return a;
  }
  unclassifiedCandidates(e, t) {
    var a;
    const i = /* @__PURE__ */ new Set(["input_boolean", "water_heater"]);
    return Object.values(((a = this.hass) == null ? void 0 : a.states) ?? {}).filter((r) => {
      var s, o, c, p;
      if (ke(this.hass, r.entity_id) !== e || t.has(r.entity_id) || (o = (s = this.config.entity_overrides) == null ? void 0 : s[r.entity_id]) != null && o.section) return !1;
      const n = (p = (c = this.hass) == null ? void 0 : c.entities) == null ? void 0 : p[r.entity_id];
      return n != null && n.hidden || n != null && n.hidden_by || n != null && n.disabled_by || n != null && n.entity_category ? !1 : i.has(r.entity_id.split(".")[0] ?? "");
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
    const i = [...de(this.config).section_order];
    this.moveValue(i, e, t), this.commitKey("section_order", i);
  }
  toggleQuickAction(e, t) {
    const i = [...de(this.config).quick_actions], a = t ? [...i.filter((r) => r !== e), e] : i.filter((r) => r !== e);
    this.commitKey("quick_actions", a);
  }
  moveQuickAction(e, t) {
    const i = [...de(this.config).quick_actions];
    this.moveValue(i, e, t), this.commitKey("quick_actions", i);
  }
  moveArea(e, t, i) {
    const a = this.targetAreas(i).map((r) => r.id);
    this.moveValue(a, e, t), this.commitKey("area_order", a);
  }
  updateAreaOverride(e, t) {
    var n;
    const i = { ...this.config.area_overrides ?? {} }, a = (n = this.areaOptions().find((s) => s.id === e)) == null ? void 0 : n.name, r = this.currentAreaOverride(e);
    a && a !== e && delete i[a], i[e] = { ...r, ...t }, this.commit({ ...this.config, area_overrides: i });
  }
  toggleAreaList(e, t, i, a) {
    const n = [...this.currentAreaOverride(e)[t] ?? []].filter((s) => s !== i);
    a && n.push(i), this.updateAreaOverride(e, { [t]: n });
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
  moveEntity(e, t, i, a, r) {
    var c;
    const n = this.currentAreaOverride(e), s = ((c = n.entity_order) == null ? void 0 : c[t]) ?? [], o = [...s, ...r.filter((p) => !s.includes(p))];
    this.moveValue(o, i, a), this.updateAreaOverride(e, { entity_order: { ...n.entity_order ?? {}, [t]: o } });
  }
  currentAreaOverride(e) {
    var a, r, n;
    const t = (a = this.areaOptions().find((s) => s.id === e)) == null ? void 0 : a.name;
    return { ...(t && t !== e ? (r = this.config.area_overrides) == null ? void 0 : r[t] : void 0) ?? {}, ...((n = this.config.area_overrides) == null ? void 0 : n[e]) ?? {} };
  }
  setStyle(e, t) {
    this.commit({ ...this.config, style: { ...this.config.style ?? {}, [e]: t } });
  }
  commitKey(e, t) {
    const i = { ...this.config };
    t === "" || t === void 0 ? delete i[e] : i[e] = t, this.commit(i);
  }
  commit(e) {
    this.config = { ...e, type: W }, this.dispatchEvent(new CustomEvent("config-changed", { bubbles: !0, composed: !0, detail: { config: this.config } }));
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
P.styles = ge`
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
    .area-card.hidden { opacity: .62; }
    .area-line { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; }
    .area-actions { display: flex; align-items: center; gap: 4px; }
    .entity-toolbar { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-block: 4px; background: var(--card-background-color); }
    .entity-list { display: grid; gap: 8px; max-height: 560px; overflow: auto; padding-inline-end: 2px; }
    .entity-item { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 9px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--secondary-background-color); }
    .entity-item.active { border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color)); }
    .entity-fields { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .entity-flags { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; }
    .check-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
    .empty { padding: 18px; color: var(--secondary-text-color); text-align: center; }
    .status { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; padding: 0 8px; border-radius: 999px; background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent); color: var(--success-color, #4caf50); font-size: 11px; font-weight: 700; }
    @media (max-width: 560px) {
      .inline-fields, .entity-toolbar, .entity-fields { grid-template-columns: 1fr; }
      .order-item { grid-template-columns: auto minmax(0, 1fr); }
      .order-controls { grid-column: 1 / -1; }
      .icon-button { flex: 1; width: auto; }
    }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `;
J([
  ve({ attribute: !1 })
], P.prototype, "hass", 2);
J([
  g()
], P.prototype, "config", 2);
J([
  g()
], P.prototype, "targetMode", 2);
J([
  g()
], P.prototype, "activeAreaId", 2);
J([
  g()
], P.prototype, "entitySearch", 2);
J([
  g()
], P.prototype, "candidateEntityId", 2);
J([
  g()
], P.prototype, "candidateSection", 2);
P = J([
  Oe(wt)
], P);
const ma = ge`
  :host {
    display: block;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --aboc-radius: var(--area-bubble-overview-border-radius, 26px);
    --aboc-blur: var(--area-bubble-overview-blur, 18px);
    --aboc-gap: var(--area-bubble-overview-gap, 12px);
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffc107));
    --aboc-row-bg: var(--area-bubble-overview-row-bg, rgba(255, 255, 255, 0.075));
    --aboc-shadow: var(--area-bubble-overview-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
  }

  * {
    box-sizing: border-box;
  }

  ha-card {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent);
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
    padding: 14px;
  }

  .overview-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
  }

  .overview-heading .heading-main {
    min-width: 0;
    flex: 1;
  }

  .overview-heading h2 {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 700;
  }

  .overview-heading .subtitle,
  .secondary,
  .state-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.35;
  }

  .areas {
    display: grid;
    gap: var(--aboc-gap);
  }

  .area-panel {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: var(--aboc-radius);
    background: color-mix(in srgb, var(--secondary-background-color) 68%, transparent);
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  .area-panel.expanded {
    border-color: color-mix(in srgb, var(--aboc-accent) 42%, var(--divider-color));
    background: color-mix(in srgb, var(--secondary-background-color) 84%, transparent);
  }

  .area-summary {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    padding: 9px;
  }

  .area-toggle {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
    min-height: 54px;
    padding: 2px;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 10px);
    background: transparent;
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .area-toggle:hover,
  .entity-row:hover,
  .control-button:hover:not([disabled]),
  .quick-action:hover:not([disabled]) {
    background-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
  }

  .area-toggle:focus-visible,
  .entity-row:focus-visible,
  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--aboc-accent);
    outline-offset: 2px;
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.22), transparent 45%),
      color-mix(in srgb, var(--aboc-accent) 16%, transparent);
    color: var(--aboc-accent);
  }

  .icon-bubble.small {
    width: 40px;
    height: 40px;
  }

  .icon-bubble ha-icon {
    --mdc-icon-size: 24px;
  }

  .area-main,
  .entity-main {
    min-width: 0;
  }

  .area-name,
  .entity-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
  }

  .area-name {
    font-size: 16px;
  }

  .summary-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 5px;
  }

  .summary-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    color: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 600;
  }

  .summary-chip.occupied {
    background: color-mix(in srgb, var(--success-color, #4caf50) 18%, transparent);
    color: var(--success-color, #4caf50);
  }

  .summary-chip ha-icon {
    --mdc-icon-size: 14px;
  }

  .temperature {
    min-width: max-content;
    padding: 7px 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-accent) 15%, transparent);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 700;
  }

  .chevron {
    display: inline-grid;
    place-items: center;
    width: 36px;
    height: 36px;
    transition: transform 160ms ease;
  }

  .expanded .chevron {
    transform: rotate(180deg);
  }

  .quick-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
  }

  .quick-action,
  .control-button {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    color: var(--secondary-text-color);
    font: inherit;
    cursor: pointer;
    transition: transform 120ms ease, color 120ms ease, background-color 120ms ease;
  }

  .quick-action.active,
  .control-button.active {
    background: color-mix(in srgb, var(--aboc-active) 20%, transparent);
    color: var(--aboc-active);
  }

  .quick-action[disabled],
  .control-button[disabled] {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .quick-action:active:not([disabled]),
  .control-button:active:not([disabled]) {
    transform: scale(0.94);
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
    border: 2px solid var(--ha-card-background, var(--card-background-color));
    border-radius: 999px;
    background: var(--aboc-active);
    color: #111;
    font-size: 9px;
    font-weight: 800;
  }

  .expanded-content {
    display: grid;
    gap: 12px;
    padding: 0 10px 10px;
    animation: overview-expand 160ms ease both;
  }

  .device-section {
    display: grid;
    gap: 8px;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    padding: 0 4px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.02em;
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-count {
    margin-inline-start: auto;
    font-variant-numeric: tabular-nums;
  }

  .entity-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: var(--aboc-row-height);
    padding: 8px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 56%, transparent);
    border-radius: calc(var(--aboc-radius) - 10px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.05), transparent),
      var(--aboc-row-bg);
    color: inherit;
    text-align: start;
  }

  .entity-lead {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 40px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 12px);
    background: transparent;
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .entity-row.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-active) 20%, transparent);
    color: var(--aboc-active);
  }

  .entity-row.unavailable {
    opacity: 0.58;
  }

  .entity-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .wide-row { grid-template-columns: minmax(110px, 1fr) auto; }

  .climate-controls,
  .media-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .temperature-stepper {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
  }

  .temperature-stepper button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .temperature-stepper span {
    min-width: 64px;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  select {
    max-width: 140px;
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 12px;
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

  @media (max-width: 560px) {
    .root { padding: 10px; }
    .area-summary { grid-template-columns: 1fr; }
    .quick-actions { justify-content: flex-start; padding-inline: 4px; }
    .area-toggle { grid-template-columns: auto minmax(0, 1fr) auto; }
    .area-toggle .temperature { grid-column: 2; justify-self: start; }
    .area-toggle .chevron { grid-column: 3; grid-row: 1 / span 2; }
    .entity-row,
    .wide-row { grid-template-columns: 1fr; }
    .entity-controls,
    .climate-controls,
    .media-controls { grid-column: 1 / -1; justify-content: stretch; }
    .entity-controls > *,
    .climate-controls > *,
    .media-controls > * { flex: 1 1 auto; }
    .control-button { flex: 0 0 40px; }
    select { max-width: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .expanded-content { animation: none; }
    .chevron,
    .quick-action,
    .control-button { transition: none; }
  }
`;
var fa = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, Q = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ga(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (a ? s(t, i, r) : s(r)) || r);
  return a && r && fa(t, i, r), r;
};
const D = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
};
let z = class extends B {
  constructor() {
    super(...arguments), this.expanded = {}, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.storageId = "overview";
  }
  static getConfigElement() {
    return document.createElement(wt);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      Gi(e), this.config = de(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = Fe(this.hass, this.config);
    return Math.max(
      2,
      e.areas.reduce(
        (t, i) => t + 2 + (this.isExpanded(i) ? i.sections.reduce((a, r) => a + r.entities.length, 0) : 0),
        e.targetKind === "floor" ? 1 : 0
      )
    );
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return d`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return h;
    const e = Qi(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = Fe(this.hass, this.config);
    return d`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t)}
          ${t.targetKind === "none" ? this.renderEmpty(M(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : t.areas.length ? d`<div class="areas">${t.areas.map((i) => this.renderArea(i))}</div>` : this.renderEmpty(M(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
          ${t.warnings.length && t.targetKind !== "none" ? d`<div class="warning">${t.warnings.join(" · ")}</div>` : h}
          ${this.config.debug ? d`<pre class="debug">${JSON.stringify(t, null, 2)}</pre>` : h}
        </div>
      </ha-card>
    `;
  }
  renderOverallHeader(e) {
    var i;
    return !((i = this.config) != null && i.show_header) || !(e.targetKind === "floor" ? this.config.show_floor_header : !!this.config.title) || !e.targetName ? h : d`
      <div class="overview-heading">
        <span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span>
        <div class="heading-main">
          <h2>${e.targetName}</h2>
          ${e.targetKind === "floor" ? d`<div class="subtitle">${e.areas.length} ${R(this.hass, this.config) === "he" ? "אזורים" : "areas"}</div>` : h}
        </div>
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return h;
    const t = this.isExpanded(e), i = e.allEntities.filter((a) => a.active).length;
    return d`
      <section class="area-panel ${t ? "expanded" : ""}">
        <div class="area-summary">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${M(this.hass, this.config, t ? "collapse" : "expand")}
            @click=${() => this.toggleArea(e)}
          >
            <span class="icon-bubble"><ha-icon icon=${e.icon}></ha-icon></span>
            <span class="area-main">
              <span class="area-name">${e.name}</span>
              <span class="summary-chips">
                ${i ? d`<span class="summary-chip"><ha-icon icon="mdi:power-plug"></ha-icon>${i}</span>` : h}
                ${this.renderOccupancy(e)}
              </span>
            </span>
            ${this.config.show_temperature && e.temperature !== void 0 ? d`<span class="temperature">${this.formatTemperature(e.temperature, e.temperatureUnit)}</span>` : h}
            <span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </button>
          ${this.config.show_quick_actions ? this.renderQuickActions(e) : h}
        </div>
        ${t ? d`<div class="expanded-content">${e.sections.map((a) => this.renderSection(a))}</div>` : h}
      </section>
    `;
  }
  renderOccupancy(e) {
    var a;
    if (!((a = this.config) != null && a.show_occupancy) || e.occupancy === "none") return h;
    const t = e.occupancy === "occupied", i = t ? "mdi:account-check" : e.occupancy === "vacant" ? "mdi:account-off-outline" : "mdi:account-question-outline";
    return d`
      <span class="summary-chip ${t ? "occupied" : ""}">
        <ha-icon icon=${i}></ha-icon>
        ${M(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown")}
      </span>
    `;
  }
  renderQuickActions(e) {
    return this.config ? d`
      <div class="quick-actions" aria-label=${R(this.hass, this.config) === "he" ? "פעולות מהירות" : "Quick actions"}>
        ${this.config.quick_actions.map((t) => {
      const i = xt(e, t), a = `${e.id}:${t}`, r = this.pendingActions.has(a), n = ea(this.hass, this.config, t);
      return d`
            <button
              class="quick-action ${i.length ? "active" : ""}"
              type="button"
              title=${n}
              aria-label=${n}
              ?disabled=${!i.length || r}
              @click=${(s) => this.handleQuickAction(s, e, t)}
            >
              <ha-icon icon=${r ? "mdi:loading" : St[t]}></ha-icon>
              ${i.length ? d`<span class="count-badge">${i.length}</span>` : h}
            </button>
          `;
    })}
      </div>
    ` : h;
  }
  renderSection(e) {
    return d`
      <div class="device-section">
        <div class="section-heading">
          <ha-icon icon=${e.icon}></ha-icon>
          <span>${e.title}</span>
          <span class="section-count">${e.activeCount}/${e.entities.length}</span>
        </div>
        ${e.entities.length ? e.entities.map((t) => this.renderEntity(t)) : d`<div class="secondary">${this.config && R(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div>`}
      </div>
    `;
  }
  renderEntity(e) {
    return e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : this.renderToggle(e);
  }
  renderEntityLead(e) {
    return d`
      <button class="entity-lead" type="button" @click=${() => this.moreInfo(e)}>
        <span class="icon-bubble small"><ha-icon icon=${e.icon}></ha-icon></span>
        <span class="entity-main">
          <span class="entity-name">${e.name}</span>
          <span class="state-text">${this.entitySecondary(e)}</span>
        </span>
      </button>
    `;
  }
  renderToggle(e) {
    const t = this.pendingEntities.has(e.entityId);
    return d`
      <div class="entity-row ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}">
        ${this.renderEntityLead(e)}
        <span class="entity-controls">
          <button
            class="control-button ${e.active ? "active" : ""}"
            type="button"
            title=${e.active ? M(this.hass, this.config, "turn_off") : M(this.hass, this.config, "on")}
            ?disabled=${!e.available || t}
            @click=${(i) => this.toggleEntity(i, e)}
          ><ha-icon icon=${t ? "mdi:loading" : e.active ? "mdi:power" : "mdi:power-off"}></ha-icon></button>
        </span>
      </div>
    `;
  }
  renderClimate(e) {
    const t = D(e, "temperature"), i = D(e, "current_temperature"), a = D(e, "target_temp_step") ?? 0.5, r = Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], n = Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], s = this.pendingEntities.has(e.entityId);
    return d`
      <div class="entity-row wide-row ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}">
        ${this.renderEntityLead(e)}
        <div class="climate-controls" @click=${(o) => o.stopPropagation()}>
          <button
            class="control-button ${e.active ? "active" : ""}"
            type="button"
            ?disabled=${!e.available || s}
            @click=${(o) => this.toggleEntity(o, e)}
          ><ha-icon icon="mdi:power"></ha-icon></button>
          ${t !== void 0 ? d`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${s} @click=${() => this.setClimateTemperature(e, t - a)} aria-label="Decrease temperature">−</button>
                  <span>${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>
                  <button type="button" ?disabled=${s} @click=${() => this.setClimateTemperature(e, t + a)} aria-label="Increase temperature">+</button>
                </span>
              ` : i !== void 0 ? d`<span class="temperature">${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>` : h}
          ${r.length ? d`<select .value=${e.entity.state} ?disabled=${s} @change=${(o) => this.setClimateMode(e, o)} aria-label="HVAC mode">
                ${r.map((o) => d`<option value=${o} ?selected=${o === e.entity.state}>${o.replace(/_/g, " ")}</option>`)}
              </select>` : h}
          ${n.length ? d`<select .value=${String(e.entity.attributes.fan_mode ?? "")} ?disabled=${s} @change=${(o) => this.setFanMode(e, o)} aria-label="Fan mode">
                ${n.map((o) => d`<option value=${o} ?selected=${o === String(e.entity.attributes.fan_mode ?? "")}>${o.replace(/_/g, " ")}</option>`)}
              </select>` : h}
        </div>
      </div>
    `;
  }
  renderCover(e) {
    const t = this.pendingEntities.has(e.entityId), i = D(e, "supported_features"), a = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 }
    ].filter(({ feature: r }) => i === void 0 || (i & r) !== 0);
    return d`
      <div class="entity-row ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}">
        ${this.renderEntityLead(e)}
        <span class="entity-controls">
          ${a.map(({ service: r, icon: n }) => d`
            <button
              class="control-button"
              type="button"
              ?disabled=${!e.available || t}
              @click=${(s) => this.runEntityService(s, e, r)}
              aria-label=${r.replace("_cover", "")}
            ><ha-icon icon=${n}></ha-icon></button>
          `)}
        </span>
      </div>
    `;
  }
  renderMedia(e) {
    const t = this.pendingEntities.has(e.entityId), i = e.entity.state === "playing", a = D(e, "volume_level");
    return d`
      <div class="entity-row wide-row ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}">
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${a !== void 0 ? d`
                <button class="control-button" type="button" ?disabled=${t} @click=${(r) => this.setMediaVolume(r, e, a - 0.05)} aria-label="Volume down"><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(a * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t} @click=${(r) => this.setMediaVolume(r, e, a + 0.05)} aria-label="Volume up"><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : h}
          <button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(r) => this.runEntityService(r, e, i ? "media_pause" : "media_play")} aria-label=${i ? "Pause" : "Play"}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>
          <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(r) => this.runEntityService(r, e, e.active ? "turn_off" : "turn_on")} aria-label="Power"><ha-icon icon="mdi:power"></ha-icon></button>
        </div>
      </div>
    `;
  }
  entitySecondary(e) {
    var t, i;
    if (!e.available) return M(this.hass, this.config, "unavailable");
    if (e.domain === "climate") {
      const a = D(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const a = D(e, "current_position");
      return a !== void 0 ? `${e.entity.state} · ${Math.round(a)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const a = D(e, "brightness");
      return a !== void 0 && e.active ? `${M(this.hass, this.config, "on")} · ${Math.round(a / 255 * 100)}%` : e.entity.state;
    }
    return e.domain === "media_player" ? String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state) : ((i = (t = this.hass) == null ? void 0 : t.formatEntityState) == null ? void 0 : i.call(t, e.entity)) ?? e.entity.state;
  }
  areaTemperatureUnit(e) {
    var t, i, a;
    return String(e.entity.attributes.temperature_unit ?? ((a = (i = (t = this.hass) == null ? void 0 : t.config) == null ? void 0 : i.unit_system) == null ? void 0 : a.temperature) ?? "°C");
  }
  formatTemperature(e, t = "°C") {
    const i = this.config && R(this.hass, this.config) === "he" ? "he-IL" : void 0;
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: 1 }).format(e)} ${t}`;
  }
  renderEmpty(e, t) {
    return d`<div class="empty"><ha-icon icon=${t}></ha-icon><span>${e}</span></div>`;
  }
  isExpanded(e) {
    var i, a, r;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? ((r = this.config) == null ? void 0 : r.default_expanded) ?? !1;
  }
  toggleArea(e) {
    var t;
    this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, (t = this.config) != null && t.remember_expanded_state && this.writeExpanded();
  }
  async handleQuickAction(e, t, i) {
    if (e.stopPropagation(), !this.hass) return;
    const a = `${t.id}:${i}`;
    if (!this.pendingActions.has(a)) {
      this.pendingActions = /* @__PURE__ */ new Set([...this.pendingActions, a]);
      try {
        await Bi(this.hass, t, i);
      } catch (r) {
        this.reportError(r);
      } finally {
        const r = new Set(this.pendingActions);
        r.delete(a), this.pendingActions = r;
      }
    }
  }
  toggleEntity(e, t) {
    e.stopPropagation();
    const i = t.active ? "turn_off" : "turn_on";
    this.performEntityCall(t, () => ee(this.hass, t.entityId, i));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => ee(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = D(e, "min_temp") ?? -100, a = D(e, "max_temp") ?? 100, r = Math.min(a, Math.max(i, t));
    this.performEntityCall(e, () => ee(this.hass, e.entityId, "set_temperature", { temperature: r }));
  }
  setClimateMode(e, t) {
    t.stopPropagation();
    const i = t.target.value;
    this.performEntityCall(e, () => ee(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i }));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = t.target.value;
    this.performEntityCall(e, () => ee(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => ee(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
  }
  async performEntityCall(e, t) {
    if (!(!this.hass || this.pendingEntities.has(e.entityId))) {
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
    return `${Ui}:${this.storageId}:expanded`;
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
  applyStyleVariables() {
    if (!this.config) return;
    const e = this.config.style;
    this.style.setProperty("--area-bubble-overview-border-radius", `${e.border_radius}px`), this.style.setProperty("--area-bubble-overview-blur", `${e.blur}px`), this.style.setProperty("--area-bubble-overview-gap", `${e.section_gap}px`), this.style.setProperty("--area-bubble-overview-row-height", `${e.row_height}px`), this.style.setProperty("--area-bubble-overview-accent", e.accent_color), this.style.setProperty("--area-bubble-overview-active", e.active_color), this.style.setProperty("--area-bubble-overview-row-bg", e.row_background), this.style.setProperty(
      "--area-bubble-overview-shadow",
      e.show_shadows ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none"
    );
  }
};
z.styles = ma;
Q([
  ve({ attribute: !1 })
], z.prototype, "hass", 2);
Q([
  g()
], z.prototype, "config", 2);
Q([
  g()
], z.prototype, "expanded", 2);
Q([
  g()
], z.prototype, "pendingActions", 2);
Q([
  g()
], z.prototype, "pendingEntities", 2);
Q([
  g()
], z.prototype, "error", 2);
z = Q([
  Oe(ze)
], z);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === ze) || window.customCards.push({
  type: ze,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

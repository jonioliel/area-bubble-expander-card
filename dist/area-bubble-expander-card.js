/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = globalThis, Je = Se.ShadowRoot && (Se.ShadyCSS === void 0 || Se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ve = Symbol(), Ye = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== Ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Je && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = Ye.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && Ye.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Mt = (e) => new bt(typeof e == "string" ? e : e + "", void 0, Ve), xe = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, r, n) => a + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new bt(i, e, Ve);
}, zt = (e, t) => {
  if (Je) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), r = Se.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = i.cssText, e.appendChild(a);
  }
}, Xe = Je ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return Mt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: jt, defineProperty: Ft, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Ht, getOwnPropertySymbols: Bt, getPrototypeOf: qt } = Object, q = globalThis, Qe = q.trustedTypes, Jt = Qe ? Qe.emptyScript : "", Pe = q.reactiveElementPolyfillSupport, me = (e, t) => e, Oe = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Jt : null;
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
} }, Ge = (e, t) => !jt(e, t), Ze = { attribute: !0, type: String, converter: Oe, reflect: !1, useDefault: !1, hasChanged: Ge };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), q.litPropertyMetadata ?? (q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let re = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Ze) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(t, a, i);
      r !== void 0 && Ft(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: r, set: n } = Ut(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const s = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, s, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ze;
  }
  static _$Ei() {
    if (this.hasOwnProperty(me("elementProperties"))) return;
    const t = qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(me("properties"))) {
      const i = this.properties, a = [...Ht(i), ...Bt(i)];
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
      for (const r of a) i.unshift(Xe(r));
    } else t !== void 0 && i.push(Xe(t));
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
    return zt(t, this.constructor.elementStyles), t;
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
      const o = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : Oe).toAttribute(i, a.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const s = a.getPropertyOptions(r), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((n = s.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? s.converter : Oe;
      this._$Em = r;
      const p = c.fromAttribute(i, s.type);
      this[r] = p ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, r = !1, n) {
    var o;
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (n = this[t]), a ?? (a = s.getPropertyOptions(t)), !((a.hasChanged ?? Ge)(n, i) || a.useDefault && a.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(s._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: r, wrapped: n }, o) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: s } = o, c = this[n];
        s !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
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
re.elementStyles = [], re.shadowRootOptions = { mode: "open" }, re[me("elementProperties")] = /* @__PURE__ */ new Map(), re[me("finalized")] = /* @__PURE__ */ new Map(), Pe == null || Pe({ ReactiveElement: re }), (q.reactiveElementVersions ?? (q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = globalThis, et = (e) => e, Te = ge.trustedTypes, tt = Te ? Te.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, mt = "$lit$", H = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + H, Vt = `<${gt}>`, ee = document, ve = () => ee.createComment(""), _e = (e) => e === null || typeof e != "object" && typeof e != "function", Ke = Array.isArray, Gt = (e) => Ke(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", De = `[ 	
\f\r]`, pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, at = />/g, K = RegExp(`>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, nt = /"/g, ft = /^(?:script|style|textarea|title)$/i, Kt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = Kt(1), oe = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), X = ee.createTreeWalker(ee, 129);
function vt(e, t) {
  if (!Ke(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Wt = (e, t) => {
  const i = e.length - 1, a = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = pe;
  for (let s = 0; s < i; s++) {
    const c = e[s];
    let p, u, l = -1, b = 0;
    for (; b < c.length && (o.lastIndex = b, u = o.exec(c), u !== null); ) b = o.lastIndex, o === pe ? u[1] === "!--" ? o = it : u[1] !== void 0 ? o = at : u[2] !== void 0 ? (ft.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = K) : u[3] !== void 0 && (o = K) : o === K ? u[0] === ">" ? (o = r ?? pe, l = -1) : u[1] === void 0 ? l = -2 : (l = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? K : u[3] === '"' ? nt : rt) : o === nt || o === rt ? o = K : o === it || o === at ? o = pe : (o = K, r = void 0);
    const m = o === K && e[s + 1].startsWith("/>") ? " " : "";
    n += o === pe ? c + Vt : l >= 0 ? (a.push(p), c.slice(0, l) + mt + c.slice(l) + H + m) : c + H + (l === -2 ? s : m);
  }
  return [vt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class ye {
  constructor({ strings: t, _$litType$: i }, a) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const s = t.length - 1, c = this.parts, [p, u] = Wt(t, i);
    if (this.el = ye.createElement(p, a), X.currentNode = this.el.content, i === 2 || i === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = X.nextNode()) !== null && c.length < s; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(mt)) {
          const b = u[o++], m = r.getAttribute(l).split(H), x = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: n, name: x[2], strings: m, ctor: x[1] === "." ? Xt : x[1] === "?" ? Qt : x[1] === "@" ? Zt : Ne }), r.removeAttribute(l);
        } else l.startsWith(H) && (c.push({ type: 6, index: n }), r.removeAttribute(l));
        if (ft.test(r.tagName)) {
          const l = r.textContent.split(H), b = l.length - 1;
          if (b > 0) {
            r.textContent = Te ? Te.emptyScript : "";
            for (let m = 0; m < b; m++) r.append(l[m], ve()), X.nextNode(), c.push({ type: 2, index: ++n });
            r.append(l[b], ve());
          }
        }
      } else if (r.nodeType === 8) if (r.data === gt) c.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(H, l + 1)) !== -1; ) c.push({ type: 7, index: n }), l += H.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const a = ee.createElement("template");
    return a.innerHTML = t, a;
  }
}
function se(e, t, i = e, a) {
  var o, s;
  if (t === oe) return t;
  let r = a !== void 0 ? (o = i._$Co) == null ? void 0 : o[a] : i._$Cl;
  const n = _e(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((s = r == null ? void 0 : r._$AO) == null || s.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = r : i._$Cl = r), r !== void 0 && (t = se(e, r._$AS(e, t.values), r, a)), t;
}
class Yt {
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
    const { el: { content: i }, parts: a } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? ee).importNode(i, !0);
    X.currentNode = r;
    let n = X.nextNode(), o = 0, s = 0, c = a[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let p;
        c.type === 2 ? p = new we(n, n.nextSibling, this, t) : c.type === 1 ? p = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (p = new ei(n, this, t)), this._$AV.push(p), c = a[++s];
      }
      o !== (c == null ? void 0 : c.index) && (n = X.nextNode(), o++);
    }
    return X.currentNode = ee, r;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class we {
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
    t = se(this, t, i), _e(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Gt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && _e(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ee.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = ye.createElement(vt(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const o = new Yt(r, this), s = o.u(this.options);
      o.p(i), this.T(s), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = ot.get(t.strings);
    return i === void 0 && ot.set(t.strings, i = new ye(t)), i;
  }
  k(t) {
    Ke(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, r = 0;
    for (const n of t) r === i.length ? i.push(a = new we(this.O(ve()), this.O(ve()), this, this.options)) : a = i[r], a._$AI(n), r++;
    r < i.length && (this._$AR(a && a._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = et(t).nextSibling;
      et(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Ne {
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
    let o = !1;
    if (n === void 0) t = se(this, t, i, 0), o = !_e(t) || t !== this._$AH && t !== oe, o && (this._$AH = t);
    else {
      const s = t;
      let c, p;
      for (t = n[0], c = 0; c < n.length - 1; c++) p = se(this, s[a + c], i, c), p === oe && (p = this._$AH[c]), o || (o = !_e(p) || p !== this._$AH[c]), p === h ? t = h : t !== h && (t += (p ?? "") + n[c + 1]), this._$AH[c] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Xt extends Ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Qt extends Ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Zt extends Ne {
  constructor(t, i, a, r, n) {
    super(t, i, a, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = se(this, t, i, 0) ?? h) === oe) return;
    const a = this._$AH, r = t === h && a !== h || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, n = t !== h && (a === h || r);
    r && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ei {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    se(this, t);
  }
}
const Le = ge.litHtmlPolyfillSupport;
Le == null || Le(ye, we), (ge.litHtmlVersions ?? (ge.litHtmlVersions = [])).push("3.3.3");
const ti = (e, t, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = r = new we(t.insertBefore(ve(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class J extends re {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ti(i, this.renderRoot, this.renderOptions);
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
    return oe;
  }
}
var ht;
J._$litElement$ = !0, J.finalized = !0, (ht = Q.litElementHydrateSupport) == null || ht.call(Q, { LitElement: J });
const Me = Q.litElementPolyfillSupport;
Me == null || Me({ LitElement: J });
(Q.litElementVersions ?? (Q.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ii = { attribute: !0, type: String, converter: Oe, reflect: !1, hasChanged: Ge }, ai = (e = ii, t, i) => {
  const { kind: a, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), a === "accessor") {
    const { name: o } = i;
    return { set(s) {
      const c = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(o, c, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(o, void 0, e, s), s;
    } };
  }
  if (a === "setter") {
    const { name: o } = i;
    return function(s) {
      const c = this[o];
      t.call(this, s), this.requestUpdate(o, c, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function $e(e) {
  return (t, i) => typeof i == "object" ? ai(e, t, i) : ((a, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, a), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(e) {
  return $e({ ...e, state: !0, attribute: !1 });
}
const ri = "custom:area-bubble-expander-card", ni = "area-bubble-expander-card", _t = "area-bubble-expander-card-editor", oi = "area-bubble-expander-card", si = ["light", "switch", "fan", "climate", "media_player"], ci = [
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
], li = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, di = {
  climate: ["off", "unavailable", "unknown"]
}, pi = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), ui = ["always_on", "critical", "infrastructure", "no_turn_off"], hi = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], bi = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, yt = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, je = {
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
}, mi = {
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
}, ue = {
  type: ri,
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
  domains: si,
  exclude_domains: ci,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: li,
  inactive_states: di,
  paused_media_players_active: !0,
  protected_labels: ui,
  protected_entities: hi,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: bi,
  domain_icons: yt,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: je,
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
}, gi = xe`
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
`, I = (e) => Array.isArray(e) ? [...e] : [], M = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, ne = (e) => {
  const t = M(e.style), i = typeof t.preset == "string" ? t.preset : je.preset, a = mi[i] ?? {}, r = { ...je, ...a, ...t }, n = {
    ...ue,
    ...e,
    style: r
  };
  return {
    ...n,
    type: "custom:area-bubble-expander-card",
    title: n.title ?? "",
    empty_title: n.empty_title ?? "",
    empty_subtitle: n.empty_subtitle ?? "",
    include_entities: I(n.include_entities),
    exclude_entities: I(n.exclude_entities),
    include_areas: I(n.include_areas),
    exclude_areas: I(n.exclude_areas),
    exclude_labels: I(n.exclude_labels),
    exclude_entity_category: I(n.exclude_entity_category),
    exclude_by_regex: I(n.exclude_by_regex),
    active_states: { ...ue.active_states ?? {}, ...M(e.active_states) },
    inactive_states: { ...ue.inactive_states ?? {}, ...M(e.inactive_states) },
    protected_entities: I(n.protected_entities),
    disable_turn_off_for_domains: I(n.disable_turn_off_for_domains),
    dangerous_domains: I(n.dangerous_domains),
    service_mapping: { ...ue.service_mapping ?? {}, ...M(e.service_mapping) },
    custom_area_order: I(n.custom_area_order),
    custom_entity_order: I(n.custom_entity_order),
    areas: { ...M(n.areas) },
    entity_overrides: { ...M(n.entity_overrides) },
    labels: { ...M(n.labels) },
    domain_labels: { ...M(n.domain_labels) },
    domain_icons: { ...ue.domain_icons ?? {}, ...M(n.domain_icons) },
    style: r
  };
}, fi = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, Ae = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), vi = (e) => Array.isArray(e) ? e.join(`
`) : "", st = {
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
}, _i = {
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
}, ce = (e, t) => {
  var a;
  if (t === "he" || t === "en") return t;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, xt = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = ce(e, t.language), a = document.documentElement.dir;
  return i === "he" || a === "rtl";
}, y = (e, t, i, a = {}) => {
  const r = ce(t, e.language);
  let o = e.labels[i] ?? st[r][i] ?? st.en[i] ?? i;
  for (const [s, c] of Object.entries(a))
    o = o.replace(new RegExp(`\\{${s}\\}`, "g"), String(c));
  return o;
}, ct = (e, t, i) => {
  const a = ce(t, e.language);
  return e.domain_labels[i] ?? _i[a][i] ?? i.replace(/_/g, " ");
}, yi = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const r = a.area_id ?? a.id ?? i;
    t.set(r, a);
  }
  return t;
}, Fe = (e, t, i) => {
  var l, b;
  const a = yi(e), r = (l = e == null ? void 0 : e.entities) == null ? void 0 : l[i], n = r != null && r.device_id ? (b = e == null ? void 0 : e.devices) == null ? void 0 : b[r.device_id] : void 0, o = (r == null ? void 0 : r.area_id) ?? (n == null ? void 0 : n.area_id) ?? "no_area", s = o ? a.get(o) : void 0, c = t.areas[o] ?? t.areas[(s == null ? void 0 : s.name) ?? ""], p = (s == null ? void 0 : s.name) ?? y(t, e, "no_area"), u = (c == null ? void 0 : c.name) ?? p;
  return {
    id: o || "no_area",
    name: u,
    icon: (c == null ? void 0 : c.icon) ?? (s == null ? void 0 : s.icon) ?? (o === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, xi = (e, t, i) => {
  const a = i.areas[e] ?? i.areas[t];
  return a != null && a.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, he = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, wi = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), $i = (e, t, i, a) => {
  if (e.state === "unavailable") return y(i, a, "not_available");
  if (t === "light" && i.show_brightness) {
    const r = he(e, "brightness");
    if (r !== void 0) return `${Math.round(r / 255 * 100)}%`;
  }
  if (t === "fan") {
    const r = he(e, "percentage");
    if (r !== void 0) return `${r}%`;
  }
  if (t === "climate") {
    const r = String(e.attributes.hvac_action ?? e.state), n = he(e, "current_temperature"), o = he(e, "temperature");
    return i.show_temperature && (n !== void 0 || o !== void 0) ? [r, n !== void 0 ? `${n}°` : "", o !== void 0 ? `→ ${o}°` : ""].filter(Boolean).join(" ") : r;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const r = he(e, "current_position");
    return r !== void 0 ? `${r}%` : e.state;
  }
  return String(e.state);
}, ki = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const a = Math.round(i / 60);
  return a < 24 ? `${a}h` : `${Math.round(a / 24)}d`;
}, Ai = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(y(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(ki(e.entity)), i.filter(Boolean).join(" · ");
}, Si = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), Ei = (e, t, i) => {
  var o, s;
  const a = String(e.state ?? "").toLowerCase();
  if (pi.has(a) || t === "media_player" && !i.paused_media_players_active && a === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (Si.has(c)) return !0;
  }
  const r = (o = i.inactive_states[t]) == null ? void 0 : o.map((c) => c.toLowerCase());
  if (r != null && r.includes(a)) return !1;
  const n = (s = i.active_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  return n != null && n.length ? n.includes(a) : r != null && r.length ? !0 : a === "on";
}, Ci = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []];
}, Oi = (e, t, i) => {
  const a = i.entity_overrides[e];
  return a != null && a.protected || i.protected_entities.includes(e) ? !0 : t.some((r) => i.protected_labels.includes(r));
}, wt = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return y(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, Ti = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, Ee = (e, t) => e.filter((i) => !wt(i, t)), Ie = (e, t, i) => {
  const a = e.indexOf(t);
  if (a >= 0) return a;
  if (i) {
    const r = e.indexOf(i);
    if (r >= 0) return r;
  }
  return Number.MAX_SAFE_INTEGER;
}, Ii = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.area_sort === "count_asc" ? i.sort((a, r) => a.entities.length - r.entities.length || a.name.localeCompare(r.name)) : t.area_sort === "custom" ? i.sort(
    (a, r) => Ie(t.custom_area_order, a.id, a.name) - Ie(t.custom_area_order, r.id, r.name) || a.name.localeCompare(r.name)
  ) : i.sort((a, r) => r.entities.length - a.entities.length || a.name.localeCompare(r.name));
}, Ni = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((a, r) => a.name.localeCompare(r.name)) : t.entity_sort === "state" ? i.sort((a, r) => a.entity.state.localeCompare(r.entity.state) || a.name.localeCompare(r.name)) : t.entity_sort === "last_changed" ? i.sort((a, r) => new Date(r.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((a, r) => Ie(t.custom_entity_order, a.entityId) - Ie(t.custom_entity_order, r.entityId)) : i.sort((a, r) => a.domain.localeCompare(r.domain) || a.name.localeCompare(r.name));
}, Ri = (e) => e.split(".")[0] ?? "", Pi = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), Di = (e, t) => t.some((i) => i.test(e)), Ue = (e, t) => {
  var p;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), a = [], r = Pi(t.exclude_by_regex), n = new Set(t.domains), o = new Set(t.exclude_domains), s = new Set(t.include_entities);
  for (const u of Object.values(e.states)) {
    const l = u.entity_id, b = Ri(l), m = (p = e.entities) == null ? void 0 : p[l], x = t.entity_overrides[l], _ = Ci(e, l), $ = [];
    x != null && x.hidden && $.push("hidden by entity override"), t.exclude_entities.includes(l) && $.push("excluded entity"), t.exclude_unavailable && u.state === "unavailable" && $.push("unavailable"), t.exclude_hidden_entities && (m != null && m.hidden_by || m != null && m.hidden) && $.push("hidden entity"), m != null && m.disabled_by && $.push("disabled entity"), m != null && m.entity_category && t.exclude_entity_category.includes(m.entity_category) && $.push("excluded entity category"), o.has(b) && $.push("excluded domain"), !n.has(b) && !s.has(l) && $.push("domain not included"), _.some((v) => t.exclude_labels.includes(v)) && $.push("excluded label"), Di(l, r) && $.push("excluded by regex");
    const C = Fe(e, t, l);
    if (xi(C.id, C.name, t) || $.push("excluded area"), Ei(u, b, t) || $.push("inactive state"), $.length) {
      a.push({ entity_id: l, reasons: $ });
      continue;
    }
    const de = Oi(l, _, t), g = {
      entity: u,
      entityId: l,
      domain: b,
      name: wi(u, x == null ? void 0 : x.name),
      icon: (x == null ? void 0 : x.icon) ?? String(u.attributes.icon ?? t.domain_icons[b] ?? yt[b] ?? "mdi:toggle-switch-outline"),
      areaId: C.id,
      areaName: C.name,
      areaIcon: C.icon,
      labels: _,
      category: m == null ? void 0 : m.entity_category,
      hidden: !!(m != null && m.hidden_by || m != null && m.hidden),
      active: !0,
      protected: de,
      controllable: !0,
      secondary: $i(u, b, t, e),
      skipReasons: []
    };
    if (g.disabledReason = wt(g, t), g.controllable = !g.disabledReason, !Ti(g, t)) {
      a.push({ entity_id: l, reasons: ["protected hidden"] });
      continue;
    }
    const k = i.get(C.id) ?? {
      id: C.id,
      name: C.name,
      icon: C.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    k.entities.push(g), k.domainCounts[b] = (k.domainCounts[b] ?? 0) + 1, de && (k.protectedCount += 1), i.set(C.id, k);
  }
  const c = [...i.values()].map((u) => ({ ...u, entities: Ni(u.entities, t) }));
  return { groups: Ii(c, t), skipped: a };
};
var Li = Object.defineProperty, Mi = Object.getOwnPropertyDescriptor, T = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Mi(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && Li(t, i, r), r;
};
const R = [
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
], zi = [
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
], ji = {
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
}, Fi = {
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
let S = class extends J {
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
    const e = ne(this.config), t = ce(this.hass, e.language), i = xt(this.hass, e), a = R.find((n) => n.id === this.activeSection) ?? R[0], r = zi.filter((n) => n.section === this.activeSection);
    return d`
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
            ${R.map((n) => d`<option value=${n.id}>${n.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${O[t].chooseSection} aria-orientation="vertical">
            ${R.map(
      (n, o) => d`
                <button
                  type="button"
                  id=${`abec-editor-tab-${o}`}
                  class="section-tab"
                  role="tab"
                  aria-selected=${this.activeSection === n.id ? "true" : "false"}
                  aria-controls="abec-editor-panel"
                  tabindex=${this.activeSection === n.id ? "0" : "-1"}
                  @click=${() => this.selectSection(n.id)}
                  @keydown=${(s) => this.navigateSections(s, o)}
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
            aria-labelledby=${`abec-editor-tab-${Math.max(0, R.findIndex((n) => n.id === a.id))}`}
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
          ${this.activeSection === "Debug" ? d`<div class="field"><label class="field-label" for="abec-resulting-config">${O[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : h}
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
    const t = this.editorLanguage(e), i = O[t], a = this.areaOptions(e), r = a.filter((n) => this.matchesSearch(`${n.name} ${n.id}`, this.areaSearch));
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
    const t = this.editorLanguage(e), i = O[t], a = this.entityOptions(e), r = a.filter(
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
    const t = this.editorLanguage(e), i = O[t], a = this.labelOptions(), r = a.filter((n) => this.matchesSearch(`${n.id} ${n.name}`, this.labelSearch));
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
    const t = this.editorLanguage(e), i = O[t], a = this.orderedAreaOptions(e);
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
                @dragover=${(o) => this.dragAreaOver(o, r.id)}
                @drop=${(o) => this.dropArea(o, r.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${i.drag}
                  aria-hidden="true"
                  @dragstart=${(o) => this.startAreaDrag(o, r.id)}
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
    const t = this.editorLanguage(e), i = O[t], { groups: a } = Ue(this.hass, e), r = a.reduce((o, s) => o + s.entities.length, 0), n = a.length;
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
    const t = Object.entries(((a = this.hass) == null ? void 0 : a.areas) ?? {}).map(([n, o]) => ({
      id: o.area_id ?? o.id ?? n,
      name: o.name,
      icon: o.icon ?? "mdi:floor-plan"
    })), i = /* @__PURE__ */ new Map();
    for (const n of Object.keys(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      const o = Fe(this.hass, e, n);
      i.set(o.id, { id: o.id, name: o.name, icon: o.icon });
    }
    return [...t, ...i.values()].filter((n, o, s) => s.findIndex((c) => c.id === n.id) === o).sort((n, o) => n.name.localeCompare(o.name));
  }
  orderedAreaOptions(e) {
    const t = this.areaOptions(e), i = e.custom_area_order;
    return t.sort((a, r) => {
      const n = this.orderIndex(i, a.id, a.name), o = this.orderIndex(i, r.id, r.name);
      return n - o || a.name.localeCompare(r.name);
    });
  }
  entityOptions(e) {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).map((i) => {
      const a = i.entity_id.split(".")[0] ?? "", r = Fe(this.hass, e, i.entity_id);
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
    const t = JSON.stringify(e.domains), i = JSON.stringify(e.exclude_domains), a = JSON.stringify(e.exclude_entities), r = JSON.stringify(e.exclude_areas), n = JSON.stringify(e.exclude_labels), o = JSON.stringify(e.active_states), s = JSON.stringify(e.inactive_states);
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
          {% set active_states = ${o} %}
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
          {% set exclude_labels = ${n} %}
          {% set active_states = ${o} %}
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
    var a, r, n, o;
    const t = (r = (a = this.hass) == null ? void 0 : a.entities) == null ? void 0 : r[e], i = t != null && t.device_id ? (o = (n = this.hass) == null ? void 0 : n.devices) == null ? void 0 : o[t.device_id] : void 0;
    return [.../* @__PURE__ */ new Set([...(t == null ? void 0 : t.labels) ?? [], ...(i == null ? void 0 : i.labels) ?? []])];
  }
  editorLanguage(e = ne(this.config)) {
    return ce(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? ji[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? Fi[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    R.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % R.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + R.length) % R.length), e.key === "Home" && (i = 0), e.key === "End" && (i = R.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(R[i].id), this.updateComplete.then(() => {
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
    const i = ne(this.config), a = this.orderedAreaOptions(i).map((s) => s.id), r = a.indexOf(e), n = r + t;
    if (r < 0 || n < 0 || n >= a.length) return;
    const o = [...a];
    [o[r], o[n]] = [o[n], o[r]], this.updateKeys({ area_sort: "custom", custom_area_order: o });
  }
  enableCustomAreaOrder(e) {
    const t = Ae(this.readPath("custom_area_order"));
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
    const a = this.orderedAreaOptions(ne(this.config)).map((p) => p.id), r = a.indexOf(i), n = a.indexOf(t);
    if (r < 0 || n < 0) return;
    const o = [...a];
    o.splice(r, 1);
    const s = o.indexOf(t) + (r < n ? 1 : 0);
    o.splice(s, 0, i), this.updateKeys({ area_sort: "custom", custom_area_order: o });
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
    const r = Ae(this.readPath(e)), n = a.some((c) => r.includes(c)), o = n ? r.filter((c) => !a.includes(c)) : [...r.filter((c) => !a.includes(c)), t], s = { [e]: o };
    !n && i && (s[i] = Ae(this.readPath(i)).filter((c) => !a.includes(c))), this.updateKeys(s);
  }
  renderField(e, t) {
    var s;
    const i = this.editorLanguage(t), a = O[i], r = this.readPath(e.key), n = this.fieldId(e.key), o = this.fieldLabel(e, i);
    if (e.type === "boolean")
      return d`
        <div class="row">
          <div class="row-text">
            <label class="row-label" for=${n}>${o}</label>
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
          <label class="field-label" for=${n}>${o}</label>
          <select id=${n} .value=${c} @change=${(p) => this.updateField(e, this.parseSelectValue(e.key, p.target.value))}>
            ${(s = e.options) == null ? void 0 : s.map((p) => d`<option value=${p.value}>${this.optionLabel(p.value, p.label, i)}</option>`)}
          </select>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    }
    if (e.type === "number")
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${o}</label>
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
          <label class="field-label" for=${n}>${o}</label>
          <textarea id=${n} .value=${vi(r ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, Ae(c.target.value))}></textarea>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), p = this.jsonDrafts[e.key] ?? c, u = this.jsonErrors[e.key] ?? this.validateJson(p), l = p !== c;
      return d`
        <div class="field">
          <label class="field-label" for=${n}>${o}</label>
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
        <label class="field-label" for=${n}>${o}</label>
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
    const i = ne(t), r = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
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
    for (const o of a.slice(0, -1)) {
      const s = r[o];
      if (s && typeof s == "object" && !Array.isArray(s)) {
        r = s;
        continue;
      }
      if (i === void 0 || i === "") return;
      r[o] = {}, r = r[o];
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
S.styles = gi;
T([
  $e({ attribute: !1 })
], S.prototype, "hass", 2);
T([
  f()
], S.prototype, "config", 2);
T([
  f()
], S.prototype, "activeSection", 2);
T([
  f()
], S.prototype, "areaSearch", 2);
T([
  f()
], S.prototype, "entitySearch", 2);
T([
  f()
], S.prototype, "labelSearch", 2);
T([
  f()
], S.prototype, "registryLabels", 2);
T([
  f()
], S.prototype, "labelRegistryStatus", 2);
T([
  f()
], S.prototype, "jsonDrafts", 2);
T([
  f()
], S.prototype, "jsonErrors", 2);
T([
  f()
], S.prototype, "draggedAreaId", 2);
T([
  f()
], S.prototype, "dragOverAreaId", 2);
S = T([
  Re(_t)
], S);
const Ui = xe`
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
xe`
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
const $t = (e) => `${oi}:${e}:expanded`, Hi = (e) => {
  try {
    const t = localStorage.getItem($t(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, Bi = (e, t) => {
  try {
    localStorage.setItem($t(e), JSON.stringify(t));
  } catch {
  }
}, kt = (e) => {
  const [t, i] = e.split(".");
  return { domain: t, service: i };
}, qi = async (e, t, i) => {
  const a = i.service_mapping[t.domain];
  if (!a) throw new Error(`No turn-off service configured for ${t.domain}`);
  const r = kt(a);
  await e.callService(r.domain, r.service, void 0, { entity_id: t.entityId });
}, lt = async (e, t, i) => {
  const a = /* @__PURE__ */ new Map();
  for (const r of Ee(t, i)) {
    const n = i.service_mapping[r.domain];
    if (!n) continue;
    const o = a.get(n) ?? [];
    o.push(r.entityId), a.set(n, o);
  }
  await Promise.all(
    [...a.entries()].map(([r, n]) => {
      const o = kt(r);
      return e.callService(o.domain, o.service, void 0, { entity_id: n });
    })
  );
}, Ji = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var Vi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, ke = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? Gi(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && Vi(t, i, r), r;
};
let te = class extends J {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(_t);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      fi(e), this.config = ne(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? Hi(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = Ue(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return d`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return h;
    const e = xt(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = Ue(this.hass, this.config), a = t.reduce((n, o) => n + o.entities.length, 0), r = t.length;
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
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), a = Ee(e.entities, this.config), r = this.config.areas[e.id] ?? this.config.areas[e.name], n = (r == null ? void 0 : r.allow_turn_off) !== !1 && a.length > 0, o = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, s = e.entities.length - o.length;
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
                ${o.map((c) => this.renderEntity(c))}
                ${s > 0 ? d`<div class="secondary">${s} ${y(this.config, this.hass, "show_more")}</div>` : h}
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
            <span class="chip" title=${ct(this.config, this.hass, t)}>
              ${a !== "text" ? d`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : h}
              ${a !== "icons" ? d`<span>${i} ${ct(this.config, this.hass, t)}</span>` : d`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : h;
  }
  renderEntity(e) {
    if (!this.config) return h;
    const t = this.config.show_entity_secondary_info ? Ai(e, this.config) : "";
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
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && Bi(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(y(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await qi(this.hass, t, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ee(t.entities, this.config);
    if (!i.length) return;
    const a = this.config.areas[t.id] ?? this.config.areas[t.name], r = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((s) => this.config.dangerous_domains.includes(s.domain)), n = (a == null ? void 0 : a.confirm_turn_off) ?? r, o = `${y(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${y(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(n && !window.confirm(o)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await Ji(this.hass, t.id) : await lt(this.hass, i, this.config);
      } catch (s) {
        this.reportError(s);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ee(t.flatMap((r) => r.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((r) => this.config.dangerous_domains.includes(r.domain))) && !window.confirm(y(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await lt(this.hass, i, this.config);
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
te.styles = Ui;
ke([
  $e({ attribute: !1 })
], te.prototype, "hass", 2);
ke([
  f()
], te.prototype, "config", 2);
ke([
  f()
], te.prototype, "expanded", 2);
ke([
  f()
], te.prototype, "error", 2);
te = ke([
  Re(ni)
], te);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.2.2 ${ce(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const Z = "custom:area-bubble-overview-card", He = "area-bubble-overview-card", At = "area-bubble-overview-card-editor", Ki = "area-bubble-overview-card", Y = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256
}, fe = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16384
}, St = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8
}, j = ["climate", "floor_heating", "covers", "lights_switches", "media"], Et = ["lights", "climate", "floor_heating", "switches", "covers", "media"], Ct = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, Ot = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, Tt = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  show_shadows: !0,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "rgba(74,74,74,0.88)",
  active_color: "var(--state-active-color, #ffd54f)",
  active_surface: "rgba(174, 215, 219, 0.94)",
  climate_surface: "rgba(139, 181, 255, 0.94)",
  control_surface: "rgba(11, 28, 58, 0.94)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)"
}, Wi = {
  type: Z,
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
  quick_actions: Et,
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
  style: Tt,
  debug: !1
}, D = (e, t) => {
  const i = e.attributes.supported_features;
  return typeof i != "number" || (i & t) !== 0;
}, It = (e) => Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], B = (e, t) => {
  if (e.domain === "climate") {
    const i = t ? Y.TURN_ON : Y.TURN_OFF;
    if (D(e.entity, i)) return { service: t ? "turn_on" : "turn_off" };
    const a = It(e);
    if (!t && a.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const r = a.find((n) => n !== "off");
    return t && r ? { service: "set_hvac_mode", data: { hvac_mode: r } } : void 0;
  }
  if (e.domain === "media_player") {
    const i = t ? fe.TURN_ON : fe.TURN_OFF;
    return D(e.entity, i) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  }
  if (e.domain === "water_heater")
    return D(e.entity, St.ON_OFF) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  if (["light", "switch", "fan", "input_boolean"].includes(e.domain))
    return { service: t ? "turn_on" : "turn_off" };
}, Nt = (e, t) => {
  const i = e.allEntities.filter((r) => r.available && r.powered && !r.protected), a = (r) => !["climate", "media_player", "water_heater"].includes(r.domain) || B(r, !1) !== void 0;
  return t === "lights" ? i.filter((r) => r.domain === "light") : t === "switches" ? i.filter((r) => r.domain === "switch" && r.section === "lights_switches") : t === "climate" ? i.filter((r) => r.section === "climate" && a(r)) : t === "floor_heating" ? i.filter((r) => r.section === "floor_heating" && a(r)) : t === "covers" ? i.filter((r) => {
    if (r.domain !== "cover") return !1;
    const n = r.entity.attributes.supported_features;
    return typeof n != "number" || (n & 2) !== 0;
  }) : i.filter((r) => r.domain === "media_player" && B(r, !1) !== void 0);
}, Yi = (e, t) => {
  if (e === "covers" && t.domain === "cover") return { domain: "cover", service: "close_cover" };
  const i = B(t, !1);
  return i ? { domain: t.domain, ...i } : void 0;
}, Xi = async (e, t, i) => {
  const a = Nt(t, i), r = /* @__PURE__ */ new Map(), n = [];
  for (const c of a) {
    const p = Yi(i, c);
    if (!p) {
      n.push(c.entityId);
      continue;
    }
    const u = `${p.domain}.${p.service}:${JSON.stringify(p.data ?? {})}`, l = r.get(u) ?? { ...p, entityIds: [] };
    l.entityIds.push(c.entityId), r.set(u, l);
  }
  if (n.length > 0)
    throw new Error(`Unsupported entities for the ${i} area action: ${n.join(", ")}.`);
  const o = await Promise.allSettled(
    [...r.values()].map((c) => e.callService(c.domain, c.service, c.data, { entity_id: c.entityIds }))
  ), s = o.filter((c) => c.status === "rejected");
  if (s.length) throw new Error(`${s.length} of ${o.length} area actions failed.`);
}, W = (e, t, i, a) => {
  const r = t.split(".")[0] ?? "homeassistant";
  return e.callService(r, i, a, { entity_id: t });
}, V = (e) => !!e && typeof e == "object" && !Array.isArray(e), N = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], Rt = (e) => {
  const t = new Set(j), i = N(e).filter((a) => t.has(a));
  return [.../* @__PURE__ */ new Set([...i, ...j])];
}, Be = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const i of j) {
    const a = N(e[i]);
    a.length && (t[i] = a);
  }
  return t;
}, Pt = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const i of j)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, Qi = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(N(e).filter((i) => t.has(i)))];
}, Zi = (e) => {
  if (!V(e)) return {};
  const t = {};
  for (const [i, a] of Object.entries(e))
    V(a) && (t[i] = {
      ...typeof a.name == "string" ? { name: a.name } : {},
      ...typeof a.icon == "string" ? { icon: a.icon } : {},
      ...typeof a.hidden == "boolean" ? { hidden: a.hidden } : {},
      ...typeof a.default_expanded == "boolean" ? { default_expanded: a.default_expanded } : {},
      ...typeof a.temperature_entity == "string" ? { temperature_entity: a.temperature_entity } : {},
      occupancy_entities: N(a.occupancy_entities),
      ...Array.isArray(a.section_order) ? { section_order: Rt(a.section_order) } : {},
      section_titles: Pt(a.section_titles),
      entity_order: Be(a.entity_order),
      include_entities: Be(a.include_entities),
      exclude_entities: N(a.exclude_entities)
    });
  return t;
}, ea = (e) => {
  if (!V(e)) return {};
  const t = new Set(j), i = {};
  for (const [a, r] of Object.entries(e))
    V(r) && (i[a] = {
      ...typeof r.name == "string" ? { name: r.name } : {},
      ...typeof r.icon == "string" ? { icon: r.icon } : {},
      ...typeof r.section == "string" && t.has(r.section) ? { section: r.section } : {},
      ...typeof r.hidden == "boolean" ? { hidden: r.hidden } : {},
      ...typeof r.protected == "boolean" ? { protected: r.protected } : {}
    });
  return i;
}, be = (e) => {
  const t = { ...Wi, ...e }, i = Pt(e.section_titles);
  return {
    ...t,
    type: Z,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    section_order: Rt(e.section_order),
    section_titles: Object.fromEntries(
      j.map((a) => [a, typeof i[a] == "string" ? i[a] : ""])
    ),
    quick_actions: Qi(e.quick_actions ?? t.quick_actions),
    area_order: N(e.area_order),
    floor_heating_labels: N(t.floor_heating_labels),
    floor_heating_entities: N(t.floor_heating_entities),
    occupancy_device_classes: N(t.occupancy_device_classes),
    include_entities: Be(e.include_entities),
    exclude_entities: N(t.exclude_entities),
    protected_labels: N(t.protected_labels),
    protected_entities: N(t.protected_entities),
    area_overrides: Zi(e.area_overrides),
    entity_overrides: ea(e.entity_overrides),
    style: { ...Tt, ...V(e.style) ? e.style : {} }
  };
}, ta = (e) => {
  if (!V(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== Z) throw new Error(`Card type must be ${Z}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, ia = {
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
}, aa = {
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
}, ra = {
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
}, z = (e, t) => {
  var a;
  if (t.language === "he" || t.language === "en") return t.language;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, na = (e, t) => typeof t.rtl == "boolean" ? t.rtl : z(e, t) === "he" || document.documentElement.dir === "rtl", E = (e, t, i) => ia[z(e, t)][i], oa = (e, t, i, a) => a || t.section_titles[i] || aa[z(e, t)][i], sa = (e, t, i) => ra[z(e, t)][i], le = (e) => e.split(".")[0] ?? "", dt = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, ca = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(a.area_id ?? a.id ?? i, a);
  return t;
}, la = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), Ce = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (a == null ? void 0 : a.area_id) ?? void 0;
}, da = (e, t) => {
  var r, n;
  const i = (r = e == null ? void 0 : e.entities) == null ? void 0 : r[t], a = i != null && i.device_id ? (n = e == null ? void 0 : e.devices) == null ? void 0 : n[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []])];
}, pa = (e, t, i, a) => {
  var o, s, c;
  const r = e.entity_overrides[a];
  if (r != null && r.section) return r.section;
  const n = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const p of e.section_order)
    if ((s = (o = n == null ? void 0 : n.include_entities) == null ? void 0 : o[p]) != null && s.includes(a) || (c = e.include_entities[p]) != null && c.includes(a)) return p;
}, ua = (e, t, i, a, r, n) => {
  const o = pa(e, t, i, a);
  if (o) return o;
  if (e.floor_heating_entities.includes(a) || n.some((s) => e.floor_heating_labels.includes(s)))
    return "floor_heating";
  if (r === "climate" || r === "fan") return "climate";
  if (r === "cover") return "covers";
  if (r === "light" || r === "switch") return "lights_switches";
  if (r === "media_player") return "media";
}, ha = (e, t = le(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, Dt = (e, t = le(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable"].includes(i) ? !1 : t === "media_player" ? !["off", "standby"].includes(i) : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : i === "on";
}, ba = (e, t, i) => {
  var a;
  return i || ((a = e == null ? void 0 : e.formatEntityName) == null ? void 0 : a.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, ma = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), pt = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, ze = (e) => {
  if (!e) return {};
  const t = dt(e.attributes.current_temperature), i = dt(e.state), a = t ?? i, r = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: a, unit: r };
}, ut = (e) => {
  if (!e.length) return;
  const t = [...e].sort((a, r) => a - r), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, ga = (e, t, i, a, r) => {
  var p, u;
  const n = r.area_overrides[t] ?? r.area_overrides[(i == null ? void 0 : i.name) ?? ""], o = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((l) => !!l))];
  for (const l of o) {
    const b = ze(e == null ? void 0 : e.states[l]);
    if (b.value !== void 0) return { temperature: b.value, unit: b.unit };
  }
  const s = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => !!l).filter((l) => le(l.entity_id) === "sensor" && l.attributes.device_class === "temperature").map(ze).filter((l) => l.value !== void 0);
  if (s.length) return { temperature: ut(s.map((l) => l.value)), unit: (p = s.find((l) => l.unit)) == null ? void 0 : p.unit };
  const c = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => l !== void 0 && le(l.entity_id) === "climate").map(ze).filter((l) => l.value !== void 0);
  return { temperature: ut(c.map((l) => l.value)), unit: (u = c.find((l) => l.unit)) == null ? void 0 : u.unit };
}, fa = (e, t, i, a, r) => {
  var c;
  const n = ((c = r.area_overrides[t] ?? r.area_overrides[i ?? ""]) == null ? void 0 : c.occupancy_entities) ?? [], o = n.length ? n : a.filter((p) => {
    const u = e == null ? void 0 : e.states[p];
    return le(p) === "binary_sensor" && r.occupancy_device_classes.includes(String((u == null ? void 0 : u.attributes.device_class) ?? ""));
  });
  if (!o.length) return { occupancy: "none", entities: [] };
  const s = o.map((p) => {
    var u;
    return String(((u = e == null ? void 0 : e.states[p]) == null ? void 0 : u.state) ?? "unknown").toLowerCase();
  });
  return s.some((p) => p === "on") ? { occupancy: "occupied", entities: o } : s.every((p) => p === "off") ? { occupancy: "vacant", entities: o } : { occupancy: "unknown", entities: o };
}, va = (e, t, i, a, r) => {
  var x, _, $, C, de;
  const n = t.area_overrides[i] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""];
  if (n != null && n.hidden) return;
  const o = Object.values((n == null ? void 0 : n.include_entities) ?? {}).flat(), s = [.../* @__PURE__ */ new Set([...r, ...o])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(n == null ? void 0 : n.exclude_entities) ?? []]), p = [];
  for (const g of s) {
    const k = e == null ? void 0 : e.states[g];
    if (!k || c.has(g)) continue;
    const v = (x = e == null ? void 0 : e.entities) == null ? void 0 : x[g], P = v != null && v.device_id ? (_ = e == null ? void 0 : e.devices) == null ? void 0 : _[v.device_id] : void 0, A = t.entity_overrides[g];
    if (A != null && A.hidden || v != null && v.hidden || v != null && v.hidden_by || v != null && v.disabled_by || P != null && P.disabled_by || (v == null ? void 0 : v.entity_category) === "config" || (v == null ? void 0 : v.entity_category) === "diagnostic") continue;
    const U = le(g), ae = da(e, g), We = ua(t, i, a == null ? void 0 : a.name, g, U, ae);
    We && p.push({
      entity: k,
      entityId: g,
      domain: U,
      name: ba(e, k, A == null ? void 0 : A.name),
      icon: ma(k, U, A == null ? void 0 : A.icon),
      areaId: i,
      section: We,
      labels: ae,
      available: !["unavailable", "unknown"].includes(k.state),
      active: ha(k, U),
      powered: Dt(k, U),
      protected: (A == null ? void 0 : A.protected) === !0 || t.protected_entities.includes(g) || ae.some((Lt) => t.protected_labels.includes(Lt))
    });
  }
  const l = (($ = n == null ? void 0 : n.section_order) != null && $.length ? n.section_order : t.section_order).map((g) => {
    var v;
    const k = p.filter((P) => P.section === g).sort(
      (P, A) => {
        var U, ae;
        return pt((U = n == null ? void 0 : n.entity_order) == null ? void 0 : U[g], P.entityId) - pt((ae = n == null ? void 0 : n.entity_order) == null ? void 0 : ae[g], A.entityId) || P.name.localeCompare(A.name);
      }
    );
    return {
      id: g,
      title: oa(e, t, g, (v = n == null ? void 0 : n.section_titles) == null ? void 0 : v[g]),
      icon: Ct[g],
      entities: k,
      activeCount: k.filter((P) => P.powered).length
    };
  }).filter((g) => t.show_empty_sections || g.entities.length > 0), b = ga(e, i, a, r, t), m = fa(e, i, a == null ? void 0 : a.name, r, t);
  return {
    id: i,
    name: (n == null ? void 0 : n.name) ?? (a == null ? void 0 : a.name) ?? i,
    icon: (n == null ? void 0 : n.icon) ?? (a == null ? void 0 : a.icon) ?? "mdi:floor-plan",
    floorId: (a == null ? void 0 : a.floor_id) ?? void 0,
    sections: l,
    allEntities: p,
    temperature: b.temperature,
    temperatureUnit: b.unit ?? ((de = (C = e == null ? void 0 : e.config) == null ? void 0 : C.unit_system) == null ? void 0 : de.temperature) ?? "°C",
    occupancy: m.occupancy,
    occupancyEntities: m.entities
  };
}, _a = (e, t, i) => {
  if (t.area) {
    const a = [...i.entries()].find(([r, n]) => r === t.area || n.name === t.area);
    return a ? { ids: [a[0]], targetName: a[1].name, targetIcon: a[1].icon ?? "mdi:floor-plan", kind: "area", warnings: [] } : { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
  }
  if (t.floor) {
    const a = la(e).find((n) => n.id === t.floor || n.name === t.floor);
    if (!a) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const r = [...i.entries()].filter(([, n]) => n.floor_id === a.id).map(([n]) => n);
    return { ids: r, targetName: a.name, targetIcon: a.icon ?? "mdi:home-floor-0", kind: "floor", warnings: r.length ? [] : [`Floor has no areas: ${a.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, qe = (e, t) => {
  const i = ca(e), a = _a(e, t, i), r = /* @__PURE__ */ new Map();
  for (const s of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const c = Ce(e, s);
    if (!c) continue;
    const p = r.get(c) ?? [];
    p.push(s), r.set(c, p);
  }
  const n = (s, c) => {
    const p = t.area_order.findIndex((u) => u === s || u === c);
    return p < 0 ? Number.MAX_SAFE_INTEGER : p;
  };
  return {
    areas: a.ids.map((s) => va(e, t, s, i.get(s), r.get(s) ?? [])).filter((s) => !!s).sort((s, c) => n(s.id, s.name) - n(c.id, c.name) || s.name.localeCompare(c.name)),
    targetName: t.title || a.targetName,
    targetIcon: a.targetIcon,
    targetKind: a.kind,
    warnings: a.warnings
  };
};
var ya = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, G = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? xa(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && ya(t, i, r), r;
};
let L = class extends J {
  constructor() {
    super(...arguments), this.config = { type: Z }, this.targetMode = "area", this.activeAreaId = "", this.entitySearch = "", this.candidateEntityId = "", this.candidateSection = "floor_heating";
  }
  setConfig(e) {
    this.config = { ...e, type: Z }, this.targetMode = e.floor ? "floor" : "area", e.area && (this.activeAreaId = e.area);
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.floors !== this.hass.floors || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : t.states !== this.hass.states;
  }
  render() {
    const e = be(this.config), t = z(this.hass, e), i = typeof e.rtl == "boolean" ? e.rtl : t === "he";
    this.setAttribute("dir", i ? "rtl" : "ltr"), this.style.setProperty("--overview-editor-direction", i ? "rtl" : "ltr");
    const a = qe(this.hass, e), r = this.targetAreas(e), n = this.entityMapByArea();
    return r.length && !r.some((o) => o.id === this.activeAreaId) && queueMicrotask(() => this.activeAreaId = r[0].id), d`
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
        <div class="panel"><div class="settings-list">${i.map(([a, r, n, o]) => this.booleanRow(r, n, o, (s) => this.commitKey(a, s)))}</div></div>
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
                <span class="order-icon"><ha-icon icon=${Ct[i]}></ha-icon></span>
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
            ${[...e.quick_actions, ...Et.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      const a = e.quick_actions.includes(i), r = e.quick_actions.indexOf(i);
      return d`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${Ot[i]}></ha-icon></span>
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
    const o = a.area_overrides[e.id] ?? a.area_overrides[e.name] ?? {}, s = this.activeAreaId === e.id, c = r.filter(
      (u) => u.entity_id.startsWith("climate.") || u.entity_id.startsWith("sensor.") && u.attributes.device_class === "temperature"
    ), p = r.filter((u) => u.entity_id.startsWith("binary_sensor."));
    return d`
      <div class="area-card ${o.hidden ? "hidden" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${o.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${s ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${o.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, a), () => this.moveArea(e.id, 1, a))}
            ${this.switchControl(!o.hidden, (u) => this.updateAreaOverride(e.id, { hidden: !u }), this.l("הצג אזור", "Show area", n))}
          </div>
        </div>
        ${s ? d`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", n)}</label><input type="text" .value=${o.name ?? ""} placeholder=${e.name} @change=${(u) => this.updateAreaOverride(e.id, { name: u.target.value || void 0 })} /></div>
                <div class="field"><label>${this.l("אייקון", "Icon", n)}</label><input type="text" .value=${o.icon ?? ""} placeholder=${e.icon} @change=${(u) => this.updateAreaOverride(e.id, { icon: u.target.value || void 0 })} /></div>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", n)}</label>
                <select .value=${o.temperature_entity ?? ""} @change=${(u) => this.updateAreaOverride(e.id, { temperature_entity: u.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", n)}</option>
                  ${c.map((u) => d`<option value=${u.entity_id}>${this.entityName(u)}</option>`)}
                </select>
              </div>
              ${p.length ? d`<div class="field"><label>${this.l("חיישני נוכחות (ריק = אוטומטי)", "Occupancy sensors (empty = automatic)", n)}</label><div class="entity-flags">${p.map((u) => {
      var b;
      const l = ((b = o.occupancy_entities) == null ? void 0 : b.includes(u.entity_id)) ?? !1;
      return d`<label class="check-label"><input type="checkbox" .checked=${l} @change=${(m) => this.toggleAreaList(e.id, "occupancy_entities", u.entity_id, m.target.checked)} />${this.entityName(u)}</label>`;
    })}</div></div>` : h}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", n)}</div></div>${this.switchControl(o.default_expanded ?? a.default_expanded, (u) => this.updateAreaOverride(e.id, { default_expanded: u }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", n)}</div>
              <div class="inline-fields">
                ${a.section_order.map((u) => {
      var l;
      return d`<div class="field"><label>${this.sectionDefaultName(u, n)}</label><input type="text" .value=${((l = o.section_titles) == null ? void 0 : l[u]) ?? ""} placeholder=${a.section_titles[u] || this.sectionDefaultName(u, n)} @change=${(b) => this.setAreaSectionTitle(e.id, u, b.target.value)} /></div>`;
    })}
              </div>
            ` : h}
      </div>
    `;
  }
  renderEntities(e, t, i, a) {
    var u;
    const r = this.activeAreaId || ((u = i[0]) == null ? void 0 : u.id) || "", n = t.areas.find((l) => l.id === r), o = new Map(((n == null ? void 0 : n.allEntities) ?? []).map((l) => [l.entityId, l])), s = this.entitiesForEditor(r, o, e), c = this.unclassifiedCandidates(r, o), p = s.filter((l) => `${l.name} ${l.entityId} ${l.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
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
      const b = e.entity_overrides[l.entityId] ?? {}, m = s.filter((_) => _.section === l.section), x = m.findIndex((_) => _.entityId === l.entityId);
      return d`
                    <div class="entity-item ${l.active ? "active" : ""}">
                      <span class="order-icon"><ha-icon icon=${b.icon ?? l.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${b.name || l.name}</div><div class="meta">${l.entityId}</div></div>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", a)}</label><input type="text" .value=${b.name ?? ""} placeholder=${l.name} @change=${(_) => this.updateEntityOverride(l.entityId, { name: _.target.value || void 0 })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", a)}</label><select .value=${b.section ?? l.section} @change=${(_) => this.updateEntityOverride(l.entityId, { section: _.target.value })}>${j.map((_) => d`<option value=${_}>${this.sectionDefaultName(_, a)}</option>`)}</select></div>
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${b.protected ?? l.protected} @change=${(_) => this.updateEntityOverride(l.entityId, { protected: _.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", a)}</label>
                        ${this.orderButtons(x, m.length, () => this.moveEntity(r, l.section, l.entityId, -1, m.map((_) => _.entityId)), () => this.moveEntity(r, l.section, l.entityId, 1, m.map((_) => _.entityId)))}
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
            <div class="field"><label>${this.l("רקע אריח פעיל", "Active tile surface", t)}</label><input type="text" .value=${e.style.active_surface} @change=${(i) => this.setStyle("active_surface", i.target.value)} /></div>
            <div class="field"><label>${this.l("רקע מזגן פעיל", "Active climate surface", t)}</label><input type="text" .value=${e.style.climate_surface} @change=${(i) => this.setStyle("climate_surface", i.target.value)} /></div>
            <div class="field"><label>${this.l("רקע פקדי גלולה", "Pill control surface", t)}</label><input type="text" .value=${e.style.control_surface} @change=${(i) => this.setStyle("control_surface", i.target.value)} /></div>
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
      const n = e.area_order.findIndex((s) => s === a.id || s === a.name), o = e.area_order.findIndex((s) => s === r.id || s === r.name);
      return (n < 0 ? Number.MAX_SAFE_INTEGER : n) - (o < 0 ? Number.MAX_SAFE_INTEGER : o) || a.name.localeCompare(r.name);
    });
  }
  entityMapByArea() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const i of Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {})) {
      const a = Ce(this.hass, i.entity_id);
      if (!a) continue;
      const r = e.get(a) ?? [];
      r.push(i), e.set(a, r);
    }
    return e;
  }
  entitiesForEditor(e, t, i) {
    var r, n, o;
    const a = [...t.values()];
    for (const s of Object.values(((r = this.hass) == null ? void 0 : r.states) ?? {})) {
      if (Ce(this.hass, s.entity_id) !== e || t.has(s.entity_id)) continue;
      const c = (o = (n = this.hass) == null ? void 0 : n.entities) == null ? void 0 : o[s.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const p = i.entity_overrides[s.entity_id];
      if (!(p != null && p.section)) continue;
      const u = s.entity_id.split(".")[0] ?? "";
      a.push({
        entity: s,
        entityId: s.entity_id,
        domain: u,
        name: p.name ?? this.entityName(s),
        icon: p.icon ?? String(s.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: p.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(s.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(s.state),
        powered: Dt(s, u),
        protected: p.protected === !0
      });
    }
    return a;
  }
  unclassifiedCandidates(e, t) {
    var a;
    const i = /* @__PURE__ */ new Set(["input_boolean", "water_heater"]);
    return Object.values(((a = this.hass) == null ? void 0 : a.states) ?? {}).filter((r) => {
      var o, s, c, p;
      if (Ce(this.hass, r.entity_id) !== e || t.has(r.entity_id) || (s = (o = this.config.entity_overrides) == null ? void 0 : o[r.entity_id]) != null && s.section) return !1;
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
    const i = [...be(this.config).section_order];
    this.moveValue(i, e, t), this.commitKey("section_order", i);
  }
  toggleQuickAction(e, t) {
    const i = [...be(this.config).quick_actions], a = t ? [...i.filter((r) => r !== e), e] : i.filter((r) => r !== e);
    this.commitKey("quick_actions", a);
  }
  moveQuickAction(e, t) {
    const i = [...be(this.config).quick_actions];
    this.moveValue(i, e, t), this.commitKey("quick_actions", i);
  }
  moveArea(e, t, i) {
    const a = this.targetAreas(i).map((r) => r.id);
    this.moveValue(a, e, t), this.commitKey("area_order", a);
  }
  updateAreaOverride(e, t) {
    var n;
    const i = { ...this.config.area_overrides ?? {} }, a = (n = this.areaOptions().find((o) => o.id === e)) == null ? void 0 : n.name, r = this.currentAreaOverride(e);
    a && a !== e && delete i[a], i[e] = { ...r, ...t }, this.commit({ ...this.config, area_overrides: i });
  }
  toggleAreaList(e, t, i, a) {
    const n = [...this.currentAreaOverride(e)[t] ?? []].filter((o) => o !== i);
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
    const n = this.currentAreaOverride(e), o = ((c = n.entity_order) == null ? void 0 : c[t]) ?? [], s = [...o, ...r.filter((p) => !o.includes(p))];
    this.moveValue(s, i, a), this.updateAreaOverride(e, { entity_order: { ...n.entity_order ?? {}, [t]: s } });
  }
  currentAreaOverride(e) {
    var a, r, n;
    const t = (a = this.areaOptions().find((o) => o.id === e)) == null ? void 0 : a.name;
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
    this.config = { ...e, type: Z }, this.dispatchEvent(new CustomEvent("config-changed", { bubbles: !0, composed: !0, detail: { config: this.config } }));
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
L.styles = xe`
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
G([
  $e({ attribute: !1 })
], L.prototype, "hass", 2);
G([
  f()
], L.prototype, "config", 2);
G([
  f()
], L.prototype, "targetMode", 2);
G([
  f()
], L.prototype, "activeAreaId", 2);
G([
  f()
], L.prototype, "entitySearch", 2);
G([
  f()
], L.prototype, "candidateEntityId", 2);
G([
  f()
], L.prototype, "candidateSection", 2);
L = G([
  Re(At)
], L);
const wa = xe`
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
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffd54f));
    --aboc-active-surface: var(--area-bubble-overview-active-surface, rgba(174, 215, 219, 0.94));
    --aboc-climate-surface: var(--area-bubble-overview-climate-surface, rgba(139, 181, 255, 0.94));
    --aboc-control-surface: var(--area-bubble-overview-control-surface, rgba(11, 28, 58, 0.94));
    --aboc-climate: var(--area-bubble-overview-climate-color, var(--state-climate-cool-color, #2196f3));
    --aboc-cover: var(--area-bubble-overview-cover-color, var(--state-cover-active-color, #00bcd4));
    --aboc-media: var(--area-bubble-overview-media-color, var(--state-media-player-active-color, #9c27b0));
    --aboc-row-bg: var(--area-bubble-overview-row-bg, rgba(74, 74, 74, 0.88));
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
    direction: ltr;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
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

  .area-panel {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
    border-radius: calc(var(--aboc-radius) + 4px);
    background: color-mix(in srgb, var(--secondary-background-color) 76%, transparent);
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  .area-panel.expanded {
    background: color-mix(in srgb, var(--secondary-background-color) 88%, transparent);
  }

  .area-panel.expanded.has-active {
    border-color: color-mix(in srgb, var(--aboc-accent) 46%, var(--divider-color));
  }

  .area-panel.expanded.all-off {
    border-color: color-mix(in srgb, var(--divider-color) 82%, transparent);
  }

  .area-summary {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }

  .area-summary-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    min-height: 60px;
    padding: 5px 8px 5px 5px;
    border: 2px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .area-panel.has-active .area-summary-pill {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color));
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .area-summary-pill.dense-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    grid-template-areas:
      "area-toggle occupancy area-temperature"
      "quick-actions quick-actions quick-actions";
    border-radius: calc(var(--aboc-radius) - 2px);
  }

  .area-summary-pill.dense-actions .area-toggle {
    grid-area: area-toggle;
    width: 100%;
  }

  .area-summary-pill.dense-actions .area-statuses {
    display: contents;
  }

  .area-summary-pill.dense-actions .occupancy {
    grid-area: occupancy;
  }

  .area-summary-pill.dense-actions .area-temperature {
    grid-area: area-temperature;
  }

  .area-summary-pill.dense-actions .quick-actions {
    grid-area: quick-actions;
    justify-self: stretch;
    justify-content: flex-end;
    width: 100%;
    max-width: none;
    overflow: visible;
    flex-wrap: wrap;
  }

  .area-toggle {
    direction: ltr;
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
    font-size: 17px;
    font-weight: 780;
  }

  .active-summary {
    display: block;
    margin-top: 1px;
    color: color-mix(in srgb, var(--aboc-dark-text) 72%, transparent);
    font-weight: 650;
  }

  .area-statuses {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    min-width: 0;
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

  .expanded .chevron {
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

  .area-panel.has-active .area-icon {
    background: color-mix(in srgb, var(--aboc-control-surface) 72%, transparent);
    color: var(--aboc-light-text);
  }

  .area-panel.all-off .area-icon {
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
    direction: ltr;
    display: flex;
    align-items: center;
    gap: 5px;
    width: max-content;
    flex: 0 0 auto;
    max-width: clamp(44px, 24cqi, 142px);
    overflow: visible;
  }

  .quick-action {
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
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
  }

  .expanded-content {
    display: grid;
    gap: 13px;
    padding: 0 9px 10px;
    animation: overview-expand 170ms ease both;
  }

  .device-section {
    display: grid;
    gap: 7px;
    min-width: 0;
  }

  .section-heading {
    direction: ltr;
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
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-heading > span:not(.section-count) {
    direction: var(--aboc-direction, ltr);
    text-align: start;
  }

  .section-count {
    margin-inline-start: auto;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
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

  .entity-lead {
    direction: ltr;
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
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(88px, 1fr) 44px auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .climate-mode-button,
  .control-button {
    border: 0;
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .climate-mode-button ha-icon,
  .control-button ha-icon {
    --mdc-icon-size: 23px;
  }

  .climate-secondary {
    direction: ltr;
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

  .select-pill {
    direction: ltr;
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr) 22px;
    align-items: center;
    gap: 5px;
    min-width: 0;
    min-height: 44px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .select-pill > ha-icon {
    --mdc-icon-size: 21px;
  }

  .select-pill select {
    width: 100%;
    min-width: 0;
    height: 42px;
    padding: 0;
    border: 0;
    outline: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    text-align: center;
    font-size: 13px;
    font-weight: 680;
    cursor: pointer;
  }

  .select-pill select option {
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .select-chevron {
    pointer-events: none;
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
  .expand-button:hover,
  .entity-lead:hover,
  .quick-action:hover:not([disabled]),
  .control-button:hover:not([disabled]),
  .climate-mode-button:hover:not([disabled]),
  .cover-control:hover:not([disabled]),
  .temperature-stepper button:hover:not([disabled]),
  .thermostat-power:hover:not([disabled]) {
    filter: brightness(1.1);
  }

  .toggle-tile:hover:not([disabled]) {
    transform: translateY(-1px);
  }

  .quick-action:active:not([disabled]),
  .control-button:active:not([disabled]),
  .climate-mode-button:active:not([disabled]),
  .cover-control:active:not([disabled]),
  .temperature-stepper button:active:not([disabled]),
  .thermostat-power:active:not([disabled]),
  .toggle-tile:active:not([disabled]) {
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
    }

    .area-toggle {
      min-width: 98px;
      flex-basis: 112px;
    }

    .active-summary {
      display: none;
    }

    .area-summary-pill:not(.dense-actions):not(.responsive-actions) .quick-actions {
      max-width: 93px;
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

  @container overview-card (max-width: 380px) {
    .area-summary-pill.responsive-actions {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      grid-template-areas:
        "area-toggle occupancy area-temperature"
        "quick-actions quick-actions quick-actions";
      border-radius: calc(var(--aboc-radius) - 2px);
    }

    .area-summary-pill.responsive-actions .area-toggle {
      grid-area: area-toggle;
      width: 100%;
    }

    .area-summary-pill.responsive-actions .area-statuses {
      display: contents;
    }

    .area-summary-pill.responsive-actions .occupancy {
      grid-area: occupancy;
    }

    .area-summary-pill.responsive-actions .area-temperature {
      grid-area: area-temperature;
    }

    .area-summary-pill.responsive-actions .quick-actions {
      grid-area: quick-actions;
      justify-self: stretch;
      justify-content: flex-end;
      width: 100%;
      max-width: none;
      overflow: visible;
      flex-wrap: wrap;
    }
  }

  @container overview-card (max-width: 360px) {
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
      font-size: 15px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill .summary-chip {
      width: 40px;
      height: 40px;
      flex-basis: 40px;
    }

    .area-summary-pill .area-icon {
      width: 44px;
      height: 44px;
    }

    .area-summary-pill:not(.dense-actions):not(.responsive-actions) .quick-actions {
      max-width: 93px;
    }

    .area-statuses .occupancy {
      display: none;
    }
  }

  @container overview-card (max-width: 340px) {
    .area-summary-pill {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        "area-toggle area-temperature"
        "quick-actions quick-actions";
    }

    .area-toggle {
      grid-area: area-toggle;
      width: 100%;
    }

    .area-statuses {
      display: contents;
    }

    .area-temperature {
      grid-area: area-temperature;
    }

    .quick-actions {
      grid-area: quick-actions;
      justify-self: stretch;
      justify-content: flex-end;
      width: 100%;
      max-width: 100%;
      flex-basis: auto;
      overflow: visible;
      flex-wrap: wrap;
    }

    .climate-primary {
      grid-template-columns: minmax(0, 1fr) 44px;
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

  @media (prefers-reduced-motion: reduce) {
    .expanded-content,
    ha-icon[icon="mdi:loading"] {
      animation: none;
    }

    .chevron,
    .quick-action,
    .control-button,
    .climate-mode-button,
    .toggle-tile {
      transition: none;
    }
  }
`;
var $a = Object.defineProperty, ka = Object.getOwnPropertyDescriptor, ie = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ka(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && $a(t, i, r), r;
};
const w = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
};
let F = class extends J {
  constructor() {
    super(...arguments), this.expanded = {}, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.storageId = "overview";
  }
  static getConfigElement() {
    return document.createElement(At);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      ta(e), this.config = be(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = qe(this.hass, this.config);
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
    const e = na(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = qe(this.hass, this.config);
    return d`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t)}
          ${t.targetKind === "none" ? this.renderEmpty(E(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : t.areas.length ? d`<div class="areas">${t.areas.map((i) => this.renderArea(i))}</div>` : this.renderEmpty(E(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
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
          ${e.targetKind === "floor" ? d`<div class="subtitle">${e.areas.length} ${z(this.hass, this.config) === "he" ? "אזורים" : "areas"}</div>` : h}
        </div>
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return h;
    const t = this.isExpanded(e), i = e.allEntities.filter((u) => u.powered).length, a = this.config.show_quick_actions ? this.config.quick_actions.map((u) => ({ action: u, entities: Nt(e, u) })).filter((u) => u.entities.length > 0) : [], r = this.config.show_occupancy && e.occupancy !== "none", n = this.config.show_temperature && e.temperature !== void 0, o = a.length >= 3 || a.length >= 2 && r && n, s = a.length >= 2 && n || a.length >= 1 && r && n, c = `overview-area-${e.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`, p = `${E(this.hass, this.config, t ? "collapse" : "expand")}: ${e.name}`;
    return d`
      <section
        class="area-panel ${i ? "has-active" : "all-off"} ${t ? "expanded" : ""}"
        data-powered=${i ? "true" : "false"}
      >
        <header class="area-summary">
          <div class="area-summary-pill ${o ? "dense-actions" : ""} ${s ? "responsive-actions" : ""}">
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${t}
              aria-controls=${c}
              aria-label=${p}
              @click=${() => this.toggleArea(e)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name">${e.name}</span>
                ${i ? d`<span class="active-summary">${i} ${this.localText("פעילים", "active")}</span>` : h}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(e)}
              ${a.length ? this.renderQuickActions(e, a) : h}
              ${n ? d`<span class="temperature area-temperature">${this.formatTemperature(e.temperature, e.temperatureUnit)}</span>` : h}
            </div>
          </div>
          <button
            class="expand-button"
            type="button"
            aria-expanded=${t}
            aria-controls=${c}
            aria-label=${p}
            @click=${() => this.toggleArea(e)}
          ><span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span></button>
        </header>
        ${t ? d`<div class="expanded-content" id=${c}>${e.sections.map((u) => this.renderSection(u, e.id))}</div>` : h}
      </section>
    `;
  }
  renderOccupancy(e) {
    var r;
    if (!((r = this.config) != null && r.show_occupancy) || e.occupancy === "none") return h;
    const t = e.occupancy === "occupied", i = t ? "mdi:account-check" : e.occupancy === "vacant" ? "mdi:account-off-outline" : "mdi:account-question-outline", a = E(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown");
    return d`
      <span class="summary-chip occupancy ${t ? "occupied" : ""}" title=${a} aria-label=${a}>
        <ha-icon icon=${i}></ha-icon>
        <span class="occupancy-label">${a}</span>
      </span>
    `;
  }
  renderQuickActions(e, t) {
    return this.config ? d`
      <div class="quick-actions" role="group" aria-label=${`${this.localText("פעולות מהירות", "Quick actions")}: ${e.name}`}>
        ${t.map(({ action: i, entities: a }) => {
      const r = `${e.id}:${i}`, n = this.pendingActions.has(r), s = `${sa(this.hass, this.config, i)}: ${e.name} (${a.length})`;
      return d`
            <button
              class="quick-action active"
              type="button"
              title=${s}
              aria-label=${s}
              aria-busy=${n}
              ?disabled=${n}
              @click=${(c) => this.handleQuickAction(c, e, i)}
            >
              <ha-icon icon=${n ? "mdi:loading" : Ot[i]}></ha-icon>
              ${a.length ? d`<span class="count-badge">${a.length}</span>` : h}
            </button>
          `;
    })}
      </div>
    ` : h;
  }
  renderSection(e, t) {
    const i = `overview-section-${e.id}-${t.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    return d`
      <section class="device-section section-${e.id}" aria-labelledby=${i}>
        <h3 class="section-heading" id=${i}>
          <ha-icon icon=${e.icon}></ha-icon>
          <span>${e.title}</span>
          <span class="section-count">${e.activeCount}/${e.entities.length}</span>
        </h3>
        <div class="section-entities">
          ${e.entities.length ? e.entities.map((a) => this.renderEntity(a, e.id)) : d`<div class="secondary section-empty">${this.config && z(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div>`}
        </div>
      </section>
    `;
  }
  renderEntity(e, t) {
    return t === "floor_heating" ? this.renderFloorHeating(e) : e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : this.renderToggle(e);
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
    const t = this.pendingEntities.has(e.entityId), i = B(e, !e.powered);
    return d`
      <button
        class="toggle-tile entity-card ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${e.powered}
        aria-busy=${t}
        title=${e.active ? E(this.hass, this.config, "turn_off") : E(this.hass, this.config, "on")}
        ?disabled=${!e.available || t || !i}
        @click=${(a) => this.toggleEntity(a, e)}
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
    const t = w(e, "current_temperature"), i = w(e, "target_temp_step") ?? 0.5, a = D(e.entity, Y.TARGET_TEMPERATURE) ? w(e, "temperature") : void 0, r = D(e.entity, Y.TARGET_TEMPERATURE_RANGE) ? w(e, "target_temp_low") : void 0, n = D(e.entity, Y.TARGET_TEMPERATURE_RANGE) ? w(e, "target_temp_high") : void 0, o = r !== void 0 && n !== void 0, s = It(e), c = D(e.entity, Y.FAN_MODE) && Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], p = this.pendingEntities.has(e.entityId), u = this.climateModeIcon(e), l = B(e, !e.powered);
    return d`
      <article class="climate-card entity-card full-span mode-${e.entity.state} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${p}>
        <div class="climate-primary">
          ${this.renderEntityLead(e)}
          <button
            class="climate-mode-button ${e.active ? "active" : ""}"
            type="button"
            ?disabled=${!e.available || p || !l}
            aria-pressed=${e.powered}
            aria-label=${`${e.powered ? E(this.hass, this.config, "turn_off") : E(this.hass, this.config, "on")}: ${e.name}`}
            @click=${(b) => this.toggleEntity(b, e)}
          ><ha-icon icon=${p ? "mdi:loading" : u}></ha-icon></button>
          ${!o && a !== void 0 ? d`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${p || !e.available} @click=${() => this.setClimateTemperature(e, a - i)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                  <span>${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>
                  <button type="button" ?disabled=${p || !e.available} @click=${() => this.setClimateTemperature(e, a + i)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
                </span>
              ` : t !== void 0 ? d`<span class="temperature current-temperature">${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>` : h}
        </div>
        ${o ? this.renderClimateRange(e, r, n, i, p) : h}
        ${s.length || c.length ? d`<div class="climate-secondary" @click=${(b) => b.stopPropagation()}>
          ${s.length ? d`<label class="select-pill">
                <ha-icon icon=${u}></ha-icon>
                <select .value=${e.entity.state} ?disabled=${p || !e.available} @change=${(b) => this.setClimateMode(e, b)} aria-label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${e.name}`}>
                  ${s.map((b) => d`<option value=${b} ?selected=${b === e.entity.state}>${b.replace(/_/g, " ")}</option>`)}
                </select>
                <ha-icon class="select-chevron" icon="mdi:chevron-down"></ha-icon>
              </label>` : h}
          ${c.length ? d`<label class="select-pill">
                <ha-icon icon="mdi:fan"></ha-icon>
                <select .value=${String(e.entity.attributes.fan_mode ?? "")} ?disabled=${p || !e.available} @change=${(b) => this.setFanMode(e, b)} aria-label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${e.name}`}>
                  ${c.map((b) => d`<option value=${b} ?selected=${b === String(e.entity.attributes.fan_mode ?? "")}>${b.replace(/_/g, " ")}</option>`)}
                </select>
                <ha-icon class="select-chevron" icon="mdi:chevron-down"></ha-icon>
              </label>` : h}
          </div>` : h}
      </article>
    `;
  }
  renderClimateRange(e, t, i, a, r) {
    return d`
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
    const t = e.domain === "water_heater" ? St.TARGET_TEMPERATURE : Y.TARGET_TEMPERATURE, i = D(e.entity, t) ? w(e, "temperature") : void 0, a = w(e, "current_temperature");
    if (i === void 0 && a === void 0) return this.renderToggle(e);
    const r = w(e, "target_temp_step") ?? 0.5, n = this.pendingEntities.has(e.entityId), o = B(e, !e.powered);
    return d`
      <article class="thermostat-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${n}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(e)}
          ${i !== void 0 ? d`<span class="temperature-stepper">
                <button type="button" ?disabled=${n || !e.available} @click=${() => this.setClimateTemperature(e, i - r)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                <span>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
                <button type="button" ?disabled=${n || !e.available} @click=${() => this.setClimateTemperature(e, i + r)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
              </span>` : d`<span class="temperature current-temperature">${this.formatTemperature(a, this.areaTemperatureUnit(e))}</span>`}
        </div>
        <button
          class="thermostat-power ${e.powered ? "active" : ""}"
          type="button"
          aria-pressed=${e.powered}
          aria-label=${`${e.powered ? E(this.hass, this.config, "turn_off") : E(this.hass, this.config, "on")}: ${e.name}`}
          ?disabled=${n || !e.available || !o}
          @click=${(s) => this.toggleEntity(s, e)}
        ><ha-icon icon=${n ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderCover(e) {
    const t = this.pendingEntities.has(e.entityId), i = w(e, "supported_features"), a = w(e, "current_position"), r = e.entity.state, n = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 }
    ].filter(({ feature: s }) => i === void 0 || (i & s) !== 0), o = (s) => s === "open_cover" ? r === "open" || a !== void 0 && a >= 100 : s === "close_cover" ? r === "closed" || a !== void 0 && a <= 0 : s === "stop_cover" && !["opening", "closing"].includes(r);
    return d`
      <article class="cover-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${e.name}`}>
          ${n.map(({ service: s, icon: c }) => d`
            <button
              class="cover-control"
              type="button"
              ?disabled=${!e.available || t || o(s)}
              @click=${(p) => this.runEntityService(p, e, s)}
              aria-label=${`${this.coverServiceLabel(s)}: ${e.name}`}
            ><ha-icon icon=${c}></ha-icon></button>
          `)}
        </span>
      </article>
    `;
  }
  renderMedia(e) {
    const t = this.pendingEntities.has(e.entityId), i = e.entity.state === "playing", a = w(e, "volume_level"), r = a !== void 0 && D(e.entity, fe.VOLUME_SET), n = D(e.entity, i ? fe.PAUSE : fe.PLAY), o = B(e, !e.powered);
    return d`
      <article class="media-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${r ? d`
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${e.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(a * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${e.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : h}
          ${n ? d`<button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(s) => this.runEntityService(s, e, i ? "media_pause" : "media_play")} aria-label=${`${this.localText(i ? "השהיה" : "ניגון", i ? "Pause" : "Play")}: ${e.name}`}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>` : h}
          ${o ? d`<button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.toggleEntity(s, e)} aria-label=${`${e.powered ? E(this.hass, this.config, "turn_off") : E(this.hass, this.config, "on")}: ${e.name}`}><ha-icon icon="mdi:power"></ha-icon></button>` : h}
        </div>
      </article>
    `;
  }
  entitySecondary(e) {
    var t, i;
    if (!e.available) return E(this.hass, this.config, "unavailable");
    if (e.domain === "climate") {
      const a = w(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const a = w(e, "current_position");
      return a !== void 0 ? `${e.entity.state} · ${Math.round(a)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const a = w(e, "brightness");
      return a !== void 0 && e.active ? `${E(this.hass, this.config, "on")} · ${Math.round(a / 255 * 100)}%` : e.entity.state;
    }
    if (e.domain === "media_player")
      return String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state);
    if (e.section === "floor_heating") {
      const a = w(e, "current_temperature");
      return [e.entity.state, a !== void 0 ? this.formatTemperature(a, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    return ((i = (t = this.hass) == null ? void 0 : t.formatEntityState) == null ? void 0 : i.call(t, e.entity)) ?? e.entity.state;
  }
  climateModeIcon(e) {
    const t = e.entity.state;
    return t === "cool" ? "mdi:snowflake" : t === "heat" ? "mdi:fire" : t === "dry" ? "mdi:water-percent" : t === "fan_only" ? "mdi:fan" : t === "heat_cool" || t === "auto" ? "mdi:autorenew" : "mdi:power";
  }
  coverServiceLabel(e) {
    return e === "open_cover" ? this.localText("פתיחה", "Open") : e === "stop_cover" ? this.localText("עצירה", "Stop") : this.localText("סגירה", "Close");
  }
  localText(e, t) {
    return this.config && z(this.hass, this.config) === "he" ? e : t;
  }
  areaTemperatureUnit(e) {
    var t, i, a;
    return String(e.entity.attributes.temperature_unit ?? ((a = (i = (t = this.hass) == null ? void 0 : t.config) == null ? void 0 : i.unit_system) == null ? void 0 : a.temperature) ?? "°C");
  }
  formatTemperature(e, t = "°C") {
    const i = this.config && z(this.hass, this.config) === "he" ? "he-IL" : void 0;
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
        await Xi(this.hass, t, i);
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
    const i = B(t, !t.powered);
    i && this.performEntityCall(t, () => W(this.hass, t.entityId, i.service, i.data));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => W(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = w(e, "min_temp") ?? -100, a = w(e, "max_temp") ?? 100, r = Math.min(a, Math.max(i, t));
    this.performEntityCall(e, () => W(this.hass, e.entityId, "set_temperature", { temperature: r }));
  }
  setClimateRange(e, t, i, a) {
    const r = w(e, "min_temp") ?? -100, n = w(e, "max_temp") ?? 100, o = a === "low" ? Math.min(i, Math.max(r, t)) : t, s = a === "high" ? Math.max(o, Math.min(n, i)) : i;
    this.performEntityCall(e, () => W(this.hass, e.entityId, "set_temperature", {
      target_temp_low: o,
      target_temp_high: s
    }));
  }
  setClimateMode(e, t) {
    t.stopPropagation();
    const i = t.target.value;
    this.performEntityCall(e, () => W(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i }));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = t.target.value;
    this.performEntityCall(e, () => W(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => W(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
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
    return `${Ki}:${this.storageId}:expanded`;
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
    this.style.setProperty("--area-bubble-overview-border-radius", `${e.border_radius}px`), this.style.setProperty("--area-bubble-overview-blur", `${e.blur}px`), this.style.setProperty("--area-bubble-overview-gap", `${e.section_gap}px`), this.style.setProperty("--area-bubble-overview-row-height", `${e.row_height}px`), this.style.setProperty("--area-bubble-overview-accent", e.accent_color), this.style.setProperty("--area-bubble-overview-active", e.active_color), this.style.setProperty("--area-bubble-overview-row-bg", e.row_background), this.style.setProperty("--area-bubble-overview-active-surface", e.active_surface), this.style.setProperty("--area-bubble-overview-climate-surface", e.climate_surface), this.style.setProperty("--area-bubble-overview-control-surface", e.control_surface), this.style.setProperty("--area-bubble-overview-climate-color", e.climate_color), this.style.setProperty("--area-bubble-overview-cover-color", e.cover_color), this.style.setProperty("--area-bubble-overview-media-color", e.media_color), this.style.setProperty(
      "--area-bubble-overview-shadow",
      e.show_shadows ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none"
    );
  }
};
F.styles = wa;
ie([
  $e({ attribute: !1 })
], F.prototype, "hass", 2);
ie([
  f()
], F.prototype, "config", 2);
ie([
  f()
], F.prototype, "expanded", 2);
ie([
  f()
], F.prototype, "pendingActions", 2);
ie([
  f()
], F.prototype, "pendingEntities", 2);
ie([
  f()
], F.prototype, "error", 2);
F = ie([
  Re(He)
], F);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === He) || window.customCards.push({
  type: He,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

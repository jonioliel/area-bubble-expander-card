/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis, ut = Me.ShadowRoot && (Me.ShadyCSS === void 0 || Me.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ht = Symbol(), kt = /* @__PURE__ */ new WeakMap();
let Vt = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== ht) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ut && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = kt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && kt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const vi = (e) => new Vt(typeof e == "string" ? e : e + "", void 0, ht), Te = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, o, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[r + 1], e[0]);
  return new Vt(i, e, ht);
}, _i = (e, t) => {
  if (ut) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), o = Me.litNonce;
    o !== void 0 && a.setAttribute("nonce", o), a.textContent = i.cssText, e.appendChild(a);
  }
}, St = ut ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return vi(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yi, defineProperty: xi, getOwnPropertyDescriptor: $i, getOwnPropertyNames: wi, getOwnPropertySymbols: ki, getPrototypeOf: Si } = Object, X = globalThis, At = X.trustedTypes, Ai = At ? At.emptyScript : "", Je = X.reactiveElementPolyfillSupport, $e = (e, t) => e, Le = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ai : null;
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
} }, bt = (e, t) => !yi(e, t), Et = { attribute: !0, type: String, converter: Le, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), X.litPropertyMetadata ?? (X.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let pe = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Et) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), o = this.getPropertyDescriptor(t, a, i);
      o !== void 0 && xi(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: o, set: r } = $i(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Et;
  }
  static _$Ei() {
    if (this.hasOwnProperty($e("elementProperties"))) return;
    const t = Si(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty($e("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($e("properties"))) {
      const i = this.properties, a = [...wi(i), ...ki(i)];
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
      for (const o of a) i.unshift(St(o));
    } else t !== void 0 && i.push(St(t));
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
    return _i(t, this.constructor.elementStyles), t;
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
      const n = (((r = a.converter) == null ? void 0 : r.toAttribute) !== void 0 ? a.converter : Le).toAttribute(i, a.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, n;
    const a = this.constructor, o = a._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const s = a.getPropertyOptions(o), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((r = s.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? s.converter : Le;
      this._$Em = o;
      const u = c.fromAttribute(i, s.type);
      this[o] = u ?? ((n = this._$Ej) == null ? void 0 : n.get(o)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, o = !1, r) {
    var n;
    if (t !== void 0) {
      const s = this.constructor;
      if (o === !1 && (r = this[t]), a ?? (a = s.getPropertyOptions(t)), !((a.hasChanged ?? bt)(r, i) || a.useDefault && a.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(s._$Eu(t, a)))) return;
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
pe.elementStyles = [], pe.shadowRootOptions = { mode: "open" }, pe[$e("elementProperties")] = /* @__PURE__ */ new Map(), pe[$e("finalized")] = /* @__PURE__ */ new Map(), Je == null || Je({ ReactiveElement: pe }), (X.reactiveElementVersions ?? (X.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = globalThis, Ct = (e) => e, je = we.trustedTypes, Tt = je ? je.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Gt = "$lit$", Y = `lit$${Math.random().toFixed(9).slice(2)}$`, Kt = "?" + Y, Ei = `<${Kt}>`, se = document, Ae = () => se.createComment(""), Ee = (e) => e === null || typeof e != "object" && typeof e != "function", mt = Array.isArray, Ci = (e) => mt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Qe = `[ 	
\f\r]`, ge = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pt = /-->/g, It = />/g, ie = RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ot = /'/g, zt = /"/g, Jt = /^(?:script|style|textarea|title)$/i, Ti = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = Ti(1), he = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Ft = /* @__PURE__ */ new WeakMap(), oe = se.createTreeWalker(se, 129);
function Qt(e, t) {
  if (!mt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Tt !== void 0 ? Tt.createHTML(t) : t;
}
const Pi = (e, t) => {
  const i = e.length - 1, a = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = ge;
  for (let s = 0; s < i; s++) {
    const c = e[s];
    let u, b, f = -1, l = 0;
    for (; l < c.length && (n.lastIndex = l, b = n.exec(c), b !== null); ) l = n.lastIndex, n === ge ? b[1] === "!--" ? n = Pt : b[1] !== void 0 ? n = It : b[2] !== void 0 ? (Jt.test(b[2]) && (o = RegExp("</" + b[2], "g")), n = ie) : b[3] !== void 0 && (n = ie) : n === ie ? b[0] === ">" ? (n = o ?? ge, f = -1) : b[1] === void 0 ? f = -2 : (f = n.lastIndex - b[2].length, u = b[1], n = b[3] === void 0 ? ie : b[3] === '"' ? zt : Ot) : n === zt || n === Ot ? n = ie : n === Pt || n === It ? n = ge : (n = ie, o = void 0);
    const g = n === ie && e[s + 1].startsWith("/>") ? " " : "";
    r += n === ge ? c + Ei : f >= 0 ? (a.push(u), c.slice(0, f) + Gt + c.slice(f) + Y + g) : c + Y + (f === -2 ? s : g);
  }
  return [Qt(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class Ce {
  constructor({ strings: t, _$litType$: i }, a) {
    let o;
    this.parts = [];
    let r = 0, n = 0;
    const s = t.length - 1, c = this.parts, [u, b] = Pi(t, i);
    if (this.el = Ce.createElement(u, a), oe.currentNode = this.el.content, i === 2 || i === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (o = oe.nextNode()) !== null && c.length < s; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const f of o.getAttributeNames()) if (f.endsWith(Gt)) {
          const l = b[n++], g = o.getAttribute(f).split(Y), v = /([.?@])?(.*)/.exec(l);
          c.push({ type: 1, index: r, name: v[2], strings: g, ctor: v[1] === "." ? Oi : v[1] === "?" ? zi : v[1] === "@" ? Fi : Ge }), o.removeAttribute(f);
        } else f.startsWith(Y) && (c.push({ type: 6, index: r }), o.removeAttribute(f));
        if (Jt.test(o.tagName)) {
          const f = o.textContent.split(Y), l = f.length - 1;
          if (l > 0) {
            o.textContent = je ? je.emptyScript : "";
            for (let g = 0; g < l; g++) o.append(f[g], Ae()), oe.nextNode(), c.push({ type: 2, index: ++r });
            o.append(f[l], Ae());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Kt) c.push({ type: 2, index: r });
      else {
        let f = -1;
        for (; (f = o.data.indexOf(Y, f + 1)) !== -1; ) c.push({ type: 7, index: r }), f += Y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const a = se.createElement("template");
    return a.innerHTML = t, a;
  }
}
function be(e, t, i = e, a) {
  var n, s;
  if (t === he) return t;
  let o = a !== void 0 ? (n = i._$Co) == null ? void 0 : n[a] : i._$Cl;
  const r = Ee(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== r && ((s = o == null ? void 0 : o._$AO) == null || s.call(o, !1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = o : i._$Cl = o), o !== void 0 && (t = be(e, o._$AS(e, t.values), o, a)), t;
}
class Ii {
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
    const { el: { content: i }, parts: a } = this._$AD, o = ((t == null ? void 0 : t.creationScope) ?? se).importNode(i, !0);
    oe.currentNode = o;
    let r = oe.nextNode(), n = 0, s = 0, c = a[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let u;
        c.type === 2 ? u = new Pe(r, r.nextSibling, this, t) : c.type === 1 ? u = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (u = new qi(r, this, t)), this._$AV.push(u), c = a[++s];
      }
      n !== (c == null ? void 0 : c.index) && (r = oe.nextNode(), n++);
    }
    return oe.currentNode = se, o;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class Pe {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, a, o) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    t = be(this, t, i), Ee(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== he && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ci(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && Ee(this._$AH) ? this._$AA.nextSibling.data = t : this.T(se.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: a } = t, o = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = Ce.createElement(Qt(a.h, a.h[0]), this.options)), a);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === o) this._$AH.p(i);
    else {
      const n = new Ii(o, this), s = n.u(this.options);
      n.p(i), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = Ft.get(t.strings);
    return i === void 0 && Ft.set(t.strings, i = new Ce(t)), i;
  }
  k(t) {
    mt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, o = 0;
    for (const r of t) o === i.length ? i.push(a = new Pe(this.O(Ae()), this.O(Ae()), this, this.options)) : a = i[o], a._$AI(r), o++;
    o < i.length && (this._$AR(a && a._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); t !== this._$AB; ) {
      const o = Ct(t).nextSibling;
      Ct(t).remove(), t = o;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Ge {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, o, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(t, i = this, a, o) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = be(this, t, i, 0), n = !Ee(t) || t !== this._$AH && t !== he, n && (this._$AH = t);
    else {
      const s = t;
      let c, u;
      for (t = r[0], c = 0; c < r.length - 1; c++) u = be(this, s[a + c], i, c), u === he && (u = this._$AH[c]), n || (n = !Ee(u) || u !== this._$AH[c]), u === h ? t = h : t !== h && (t += (u ?? "") + r[c + 1]), this._$AH[c] = u;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Oi extends Ge {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class zi extends Ge {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Fi extends Ge {
  constructor(t, i, a, o, r) {
    super(t, i, a, o, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = be(this, t, i, 0) ?? h) === he) return;
    const a = this._$AH, o = t === h && a !== h || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, r = t !== h && (a === h || o);
    o && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qi {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    be(this, t);
  }
}
const We = we.litHtmlPolyfillSupport;
We == null || We(Ce, Pe), (we.litHtmlVersions ?? (we.litHtmlVersions = [])).push("3.3.3");
const Ni = (e, t, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? t;
  let o = a._$litPart$;
  if (o === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = o = new Pe(t.insertBefore(Ae(), r), r, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis;
class Z extends pe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ni(i, this.renderRoot, this.renderOptions);
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
    return he;
  }
}
var Bt;
Z._$litElement$ = !0, Z.finalized = !0, (Bt = re.litElementHydrateSupport) == null || Bt.call(re, { LitElement: Z });
const Ye = re.litElementPolyfillSupport;
Ye == null || Ye({ LitElement: Z });
(re.litElementVersions ?? (re.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ke = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mi = { attribute: !0, type: String, converter: Le, reflect: !1, hasChanged: bt }, Ri = (e = Mi, t, i) => {
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
function Ie(e) {
  return (t, i) => typeof i == "object" ? Ri(e, t, i) : ((a, o, r) => {
    const n = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, a), n ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(e) {
  return Ie({ ...e, state: !0, attribute: !1 });
}
const Di = "custom:area-bubble-expander-card", Li = "area-bubble-expander-card", Wt = "area-bubble-expander-card-editor", ji = "area-bubble-expander-card", Hi = ["light", "switch", "fan", "climate", "media_player"], Ui = [
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
], Bi = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, Vi = {
  climate: ["off", "unavailable", "unknown"]
}, Gi = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), Ki = ["always_on", "critical", "infrastructure", "no_turn_off"], Ji = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], Qi = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, Yt = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, it = {
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
}, Wi = {
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
}, ve = {
  type: Di,
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
  domains: Hi,
  exclude_domains: Ui,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: Bi,
  inactive_states: Vi,
  paused_media_players_active: !0,
  protected_labels: Ki,
  protected_entities: Ji,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: Qi,
  domain_icons: Yt,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: it,
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
}, Yi = Te`
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
`, D = (e) => Array.isArray(e) ? [...e] : [], J = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, ue = (e) => {
  const t = J(e.style), i = typeof t.preset == "string" ? t.preset : it.preset, a = Wi[i] ?? {}, o = { ...it, ...a, ...t }, r = {
    ...ve,
    ...e,
    style: o
  };
  return {
    ...r,
    type: "custom:area-bubble-expander-card",
    title: r.title ?? "",
    empty_title: r.empty_title ?? "",
    empty_subtitle: r.empty_subtitle ?? "",
    include_entities: D(r.include_entities),
    exclude_entities: D(r.exclude_entities),
    include_areas: D(r.include_areas),
    exclude_areas: D(r.exclude_areas),
    exclude_labels: D(r.exclude_labels),
    exclude_entity_category: D(r.exclude_entity_category),
    exclude_by_regex: D(r.exclude_by_regex),
    active_states: { ...ve.active_states ?? {}, ...J(e.active_states) },
    inactive_states: { ...ve.inactive_states ?? {}, ...J(e.inactive_states) },
    protected_entities: D(r.protected_entities),
    disable_turn_off_for_domains: D(r.disable_turn_off_for_domains),
    dangerous_domains: D(r.dangerous_domains),
    service_mapping: { ...ve.service_mapping ?? {}, ...J(e.service_mapping) },
    custom_area_order: D(r.custom_area_order),
    custom_entity_order: D(r.custom_entity_order),
    areas: { ...J(r.areas) },
    entity_overrides: { ...J(r.entity_overrides) },
    labels: { ...J(r.labels) },
    domain_labels: { ...J(r.domain_labels) },
    domain_icons: { ...ve.domain_icons ?? {}, ...J(r.domain_icons) },
    style: o
  };
}, Xi = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, Fe = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), Zi = (e) => Array.isArray(e) ? e.join(`
`) : "", qt = {
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
}, ea = {
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
}, me = (e, t) => {
  var a;
  if (t === "he" || t === "en") return t;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Xt = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = me(e, t.language), a = document.documentElement.dir;
  return i === "he" || a === "rtl";
}, C = (e, t, i, a = {}) => {
  const o = me(t, e.language);
  let n = e.labels[i] ?? qt[o][i] ?? qt.en[i] ?? i;
  for (const [s, c] of Object.entries(a))
    n = n.replace(new RegExp(`\\{${s}\\}`, "g"), String(c));
  return n;
}, Nt = (e, t, i) => {
  const a = me(t, e.language);
  return e.domain_labels[i] ?? ea[a][i] ?? i.replace(/_/g, " ");
}, ta = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const o = a.area_id ?? a.id ?? i;
    t.set(o, a);
  }
  return t;
}, at = (e, t, i) => {
  var f, l;
  const a = ta(e), o = (f = e == null ? void 0 : e.entities) == null ? void 0 : f[i], r = o != null && o.device_id ? (l = e == null ? void 0 : e.devices) == null ? void 0 : l[o.device_id] : void 0, n = (o == null ? void 0 : o.area_id) ?? (r == null ? void 0 : r.area_id) ?? "no_area", s = n ? a.get(n) : void 0, c = t.areas[n] ?? t.areas[(s == null ? void 0 : s.name) ?? ""], u = (s == null ? void 0 : s.name) ?? C(t, e, "no_area"), b = (c == null ? void 0 : c.name) ?? u;
  return {
    id: n || "no_area",
    name: b,
    icon: (c == null ? void 0 : c.icon) ?? (s == null ? void 0 : s.icon) ?? (n === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, ia = (e, t, i) => {
  const a = i.areas[e] ?? i.areas[t];
  return a != null && a.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, _e = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, aa = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), oa = (e, t, i, a) => {
  if (e.state === "unavailable") return C(i, a, "not_available");
  if (t === "light" && i.show_brightness) {
    const o = _e(e, "brightness");
    if (o !== void 0) return `${Math.round(o / 255 * 100)}%`;
  }
  if (t === "fan") {
    const o = _e(e, "percentage");
    if (o !== void 0) return `${o}%`;
  }
  if (t === "climate") {
    const o = String(e.attributes.hvac_action ?? e.state), r = _e(e, "current_temperature"), n = _e(e, "temperature");
    return i.show_temperature && (r !== void 0 || n !== void 0) ? [o, r !== void 0 ? `${r}°` : "", n !== void 0 ? `→ ${n}°` : ""].filter(Boolean).join(" ") : o;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const o = _e(e, "current_position");
    return o !== void 0 ? `${o}%` : e.state;
  }
  return String(e.state);
}, ra = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const a = Math.round(i / 60);
  return a < 24 ? `${a}h` : `${Math.round(a / 24)}d`;
}, na = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(C(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(ra(e.entity)), i.filter(Boolean).join(" · ");
}, sa = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), ca = (e, t, i) => {
  var n, s;
  const a = String(e.state ?? "").toLowerCase();
  if (Gi.has(a) || t === "media_player" && !i.paused_media_players_active && a === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (sa.has(c)) return !0;
  }
  const o = (n = i.inactive_states[t]) == null ? void 0 : n.map((c) => c.toLowerCase());
  if (o != null && o.includes(a)) return !1;
  const r = (s = i.active_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  return r != null && r.length ? r.includes(a) : o != null && o.length ? !0 : a === "on";
}, la = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []];
}, da = (e, t, i) => {
  const a = i.entity_overrides[e];
  return a != null && a.protected || i.protected_entities.includes(e) ? !0 : t.some((o) => i.protected_labels.includes(o));
}, Zt = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return C(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, pa = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, Re = (e, t) => e.filter((i) => !Zt(i, t)), He = (e, t, i) => {
  const a = e.indexOf(t);
  if (a >= 0) return a;
  if (i) {
    const o = e.indexOf(i);
    if (o >= 0) return o;
  }
  return Number.MAX_SAFE_INTEGER;
}, ua = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((a, o) => a.name.localeCompare(o.name)) : t.area_sort === "count_asc" ? i.sort((a, o) => a.entities.length - o.entities.length || a.name.localeCompare(o.name)) : t.area_sort === "custom" ? i.sort(
    (a, o) => He(t.custom_area_order, a.id, a.name) - He(t.custom_area_order, o.id, o.name) || a.name.localeCompare(o.name)
  ) : i.sort((a, o) => o.entities.length - a.entities.length || a.name.localeCompare(o.name));
}, ha = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((a, o) => a.name.localeCompare(o.name)) : t.entity_sort === "state" ? i.sort((a, o) => a.entity.state.localeCompare(o.entity.state) || a.name.localeCompare(o.name)) : t.entity_sort === "last_changed" ? i.sort((a, o) => new Date(o.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((a, o) => He(t.custom_entity_order, a.entityId) - He(t.custom_entity_order, o.entityId)) : i.sort((a, o) => a.domain.localeCompare(o.domain) || a.name.localeCompare(o.name));
}, ba = (e) => e.split(".")[0] ?? "", ma = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), fa = (e, t) => t.some((i) => i.test(e)), ot = (e, t) => {
  var u;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), a = [], o = ma(t.exclude_by_regex), r = new Set(t.domains), n = new Set(t.exclude_domains), s = new Set(t.include_entities);
  for (const b of Object.values(e.states)) {
    const f = b.entity_id, l = ba(f), g = (u = e.entities) == null ? void 0 : u[f], v = t.entity_overrides[f], k = la(e, f), d = [];
    v != null && v.hidden && d.push("hidden by entity override"), t.exclude_entities.includes(f) && d.push("excluded entity"), t.exclude_unavailable && b.state === "unavailable" && d.push("unavailable"), t.exclude_hidden_entities && (g != null && g.hidden_by || g != null && g.hidden) && d.push("hidden entity"), g != null && g.disabled_by && d.push("disabled entity"), g != null && g.entity_category && t.exclude_entity_category.includes(g.entity_category) && d.push("excluded entity category"), n.has(l) && d.push("excluded domain"), !r.has(l) && !s.has(f) && d.push("domain not included"), k.some((x) => t.exclude_labels.includes(x)) && d.push("excluded label"), fa(f, o) && d.push("excluded by regex");
    const m = at(e, t, f);
    if (ia(m.id, m.name, t) || d.push("excluded area"), ca(b, l, t) || d.push("inactive state"), d.length) {
      a.push({ entity_id: f, reasons: d });
      continue;
    }
    const y = da(f, k, t), _ = {
      entity: b,
      entityId: f,
      domain: l,
      name: aa(b, v == null ? void 0 : v.name),
      icon: (v == null ? void 0 : v.icon) ?? String(b.attributes.icon ?? t.domain_icons[l] ?? Yt[l] ?? "mdi:toggle-switch-outline"),
      areaId: m.id,
      areaName: m.name,
      areaIcon: m.icon,
      labels: k,
      category: g == null ? void 0 : g.entity_category,
      hidden: !!(g != null && g.hidden_by || g != null && g.hidden),
      active: !0,
      protected: y,
      controllable: !0,
      secondary: oa(b, l, t, e),
      skipReasons: []
    };
    if (_.disabledReason = Zt(_, t), _.controllable = !_.disabledReason, !pa(_, t)) {
      a.push({ entity_id: f, reasons: ["protected hidden"] });
      continue;
    }
    const $ = i.get(m.id) ?? {
      id: m.id,
      name: m.name,
      icon: m.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    $.entities.push(_), $.domainCounts[l] = ($.domainCounts[l] ?? 0) + 1, y && ($.protectedCount += 1), i.set(m.id, $);
  }
  const c = [...i.values()].map((b) => ({ ...b, entities: ha(b.entities, t) }));
  return { groups: ua(c, t), skipped: a };
};
var ga = Object.defineProperty, va = Object.getOwnPropertyDescriptor, R = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? va(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && ga(t, i, o), o;
};
const U = [
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
], _a = [
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
], ya = {
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
}, xa = {
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
}, M = {
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
let z = class extends Z {
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
    const e = ue(this.config), t = me(this.hass, e.language), i = Xt(this.hass, e), a = U.find((r) => r.id === this.activeSection) ?? U[0], o = _a.filter((r) => r.section === this.activeSection);
    return p`
      <div class="editor" dir=${i ? "rtl" : "ltr"} lang=${t}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${M[t].title}</div>
            <div class="editor-subtitle">${M[t].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${M[t].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${U.map((r) => p`<option value=${r.id}>${r.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${M[t].chooseSection} aria-orientation="vertical">
            ${U.map(
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
            aria-labelledby=${`abec-editor-tab-${Math.max(0, U.findIndex((r) => r.id === a.id))}`}
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
            ${o.map((r) => this.renderField(r, e))}
          ${this.activeSection === "Debug" ? p`<div class="field"><label class="field-label" for="abec-resulting-config">${M[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : h}
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
    const t = this.editorLanguage(e), i = M[t], a = this.areaOptions(e), o = a.filter((r) => this.matchesSearch(`${r.name} ${r.id}`, this.areaSearch));
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
    const t = this.editorLanguage(e), i = M[t], a = this.entityOptions(e), o = a.filter(
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
    const t = this.editorLanguage(e), i = M[t], a = this.labelOptions(), o = a.filter((r) => this.matchesSearch(`${r.id} ${r.name}`, this.labelSearch));
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
            ` : h}
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
    const t = this.editorLanguage(e), i = M[t], a = this.orderedAreaOptions(e);
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
    const t = this.editorLanguage(e), i = M[t], { groups: a } = ot(this.hass, e), o = a.reduce((n, s) => n + s.entities.length, 0), r = a.length;
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
      const n = at(this.hass, e, r);
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
      const a = i.entity_id.split(".")[0] ?? "", o = at(this.hass, e, i.entity_id);
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
  editorLanguage(e = ue(this.config)) {
    return me(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? ya[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? xa[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    U.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % U.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + U.length) % U.length), e.key === "Home" && (i = 0), e.key === "End" && (i = U.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(U[i].id), this.updateComplete.then(() => {
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
    const i = ue(this.config), a = this.orderedAreaOptions(i).map((s) => s.id), o = a.indexOf(e), r = o + t;
    if (o < 0 || r < 0 || r >= a.length) return;
    const n = [...a];
    [n[o], n[r]] = [n[r], n[o]], this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  enableCustomAreaOrder(e) {
    const t = Fe(this.readPath("custom_area_order"));
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
    const a = this.orderedAreaOptions(ue(this.config)).map((u) => u.id), o = a.indexOf(i), r = a.indexOf(t);
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
    const o = Fe(this.readPath(e)), r = a.some((c) => o.includes(c)), n = r ? o.filter((c) => !a.includes(c)) : [...o.filter((c) => !a.includes(c)), t], s = { [e]: n };
    !r && i && (s[i] = Fe(this.readPath(i)).filter((c) => !a.includes(c))), this.updateKeys(s);
  }
  renderField(e, t) {
    var s;
    const i = this.editorLanguage(t), a = M[i], o = this.readPath(e.key), r = this.fieldId(e.key), n = this.fieldLabel(e, i);
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
          <textarea id=${r} .value=${Zi(o ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, Fe(c.target.value))}></textarea>
          <span class="field-helper">${a.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), u = this.jsonDrafts[e.key] ?? c, b = this.jsonErrors[e.key] ?? this.validateJson(u), f = u !== c;
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <textarea
            id=${r}
            class="yaml"
            spellcheck="false"
            aria-invalid=${b ? "true" : "false"}
            aria-describedby=${`${r}-status`}
            .value=${u}
            @input=${(l) => this.updateJsonDraft(e, l.target.value)}
            @keydown=${(l) => this.handleJsonKeydown(l, e)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${r}-status`} class="json-status ${b ? "error" : ""}" role="status" aria-live="polite">
              ${b ?? (f ? a.jsonValid : `${a.configKey}: ${e.key}`)}
            </span>
            <div class="json-actions">
              <button type="button" class="action-button" ?disabled=${!f} @click=${() => this.resetJsonDraft(e.key)}>${a.reset}</button>
              <button type="button" class="action-button primary" ?disabled=${!f || !!b} @click=${() => this.applyJsonDraft(e)}>${a.apply}</button>
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
      return !i || typeof i != "object" || Array.isArray(i) ? M[t].jsonObject : void 0;
    } catch (i) {
      const a = i instanceof Error ? i.message : String(i);
      return `${M[t].jsonInvalid}: ${a}`;
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
    const i = ue(t), o = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
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
z.styles = Yi;
R([
  Ie({ attribute: !1 })
], z.prototype, "hass", 2);
R([
  A()
], z.prototype, "config", 2);
R([
  A()
], z.prototype, "activeSection", 2);
R([
  A()
], z.prototype, "areaSearch", 2);
R([
  A()
], z.prototype, "entitySearch", 2);
R([
  A()
], z.prototype, "labelSearch", 2);
R([
  A()
], z.prototype, "registryLabels", 2);
R([
  A()
], z.prototype, "labelRegistryStatus", 2);
R([
  A()
], z.prototype, "jsonDrafts", 2);
R([
  A()
], z.prototype, "jsonErrors", 2);
R([
  A()
], z.prototype, "draggedAreaId", 2);
R([
  A()
], z.prototype, "dragOverAreaId", 2);
z = R([
  Ke(Wt)
], z);
const $a = Te`
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
Te`
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
const ei = (e) => `${ji}:${e}:expanded`, wa = (e) => {
  try {
    const t = localStorage.getItem(ei(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, ka = (e, t) => {
  try {
    localStorage.setItem(ei(e), JSON.stringify(t));
  } catch {
  }
}, ti = (e) => {
  const [t, i] = e.split(".");
  return { domain: t, service: i };
}, Sa = async (e, t, i) => {
  const a = i.service_mapping[t.domain];
  if (!a) throw new Error(`No turn-off service configured for ${t.domain}`);
  const o = ti(a);
  await e.callService(o.domain, o.service, void 0, { entity_id: t.entityId });
}, Mt = async (e, t, i) => {
  const a = /* @__PURE__ */ new Map();
  for (const o of Re(t, i)) {
    const r = i.service_mapping[o.domain];
    if (!r) continue;
    const n = a.get(r) ?? [];
    n.push(o.entityId), a.set(r, n);
  }
  await Promise.all(
    [...a.entries()].map(([o, r]) => {
      const n = ti(o);
      return e.callService(n.domain, n.service, void 0, { entity_id: r });
    })
  );
}, Aa = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var Ea = Object.defineProperty, Ca = Object.getOwnPropertyDescriptor, Oe = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? Ca(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && Ea(t, i, o), o;
};
let ce = class extends Z {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(Wt);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      Xi(e), this.config = ue(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? wa(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = ot(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return p`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return h;
    const e = Xt(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = ot(this.hass, this.config), a = t.reduce((r, n) => r + n.entities.length, 0), o = t.length;
    return p`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(t, a, o) : h}
          ${t.length ? p`<div class="sections">${t.map((r) => this.renderArea(r))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug ? p`<div class="debug">${JSON.stringify(i.slice(0, 80), null, 2)}</div>` : h}
        </div>
      </ha-card>
    `;
  }
  renderHeader(e, t, i) {
    if (!this.config) return h;
    const a = this.config.title || C(this.config, this.hass, "title"), o = [
      this.config.show_total_count ? `${t} ${C(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${i} ${C(this.config, this.hass, "active_areas")}` : ""
    ].filter(Boolean).join(" · ");
    return p`
      <div class="header">
        <div class="title">
          <div>${a}</div>
          ${o ? p`<div class="subtitle">${o}</div>` : h}
        </div>
        ${this.config.show_global_turn_off ? p`
              <button
                class="icon-button danger"
                title=${C(this.config, this.hass, "turn_off_all")}
                aria-label=${C(this.config, this.hass, "turn_off_all")}
                @click=${(r) => this.turnOffGlobal(r, e)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : h}
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return h;
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), a = Re(e.entities, this.config), o = this.config.areas[e.id] ?? this.config.areas[e.name], r = (o == null ? void 0 : o.allow_turn_off) !== !1 && a.length > 0, n = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, s = e.entities.length - n.length;
    return p`
      <section class="area-section ${t ? "expanded" : ""}" style=${o != null && o.accent_color ? `--abec-accent:${o.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${`${C(this.config, this.hass, t ? "collapse_area" : "expand_area")}: ${e.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(e)}
          >
            ${this.config.show_area_icons ? p`<span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : h}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${e.name}</span>
                <span class="count">${e.entities.length} ${C(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !t && i ? p`<span class="preview">${i}</span>` : h}
              ${this.config.show_domain_chips ? this.renderDomainChips(e) : h}
              ${this.config.show_area_ids ? p`<span class="preview">${e.id}</span>` : h}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off ? p`
                  <button
                    class="icon-button danger"
                    ?disabled=${!r}
                    title=${C(this.config, this.hass, "turn_off_area")}
                    aria-label=${C(this.config, this.hass, "turn_off_area")}
                    @click=${(c) => this.turnOffArea(c, e)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                ` : h}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${t ? p`
              <div class="entities">
                ${n.map((c) => this.renderEntity(c))}
                ${s > 0 ? p`<div class="secondary">${s} ${C(this.config, this.hass, "show_more")}</div>` : h}
              </div>
            ` : h}
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
            <span class="chip" title=${Nt(this.config, this.hass, t)}>
              ${a !== "text" ? p`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : h}
              ${a !== "icons" ? p`<span>${i} ${Nt(this.config, this.hass, t)}</span>` : p`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : h;
  }
  renderEntity(e) {
    if (!this.config) return h;
    const t = this.config.show_entity_secondary_info ? na(e, this.config) : "";
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
          ${this.config.show_entity_icons ? p`<span class="icon-bubble entity-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : h}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${e.name}</span>
              ${e.protected ? p`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${C(this.config, this.hass, "protected")}</span>` : h}
            </span>
            ${t ? p`<span class="secondary">${t}</span>` : h}
          </span>
        </button>
        ${this.config.show_entity_turn_off ? p`
              <button
                class="icon-button danger"
                ?disabled=${!e.controllable}
                title=${e.disabledReason ?? C(this.config, this.hass, "turn_off_entity")}
                aria-label=${C(this.config, this.hass, "turn_off_entity")}
                @click=${(i) => this.turnOffEntity(i, e)}
              >
                <ha-icon icon=${e.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            ` : h}
      </div>
    `;
  }
  renderEmpty() {
    return !this.config || !this.config.show_empty ? h : p`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || C(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || C(this.config, this.hass, "empty_subtitle")}</div>
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
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && ka(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(C(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await Sa(this.hass, t, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Re(t.entities, this.config);
    if (!i.length) return;
    const a = this.config.areas[t.id] ?? this.config.areas[t.name], o = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((s) => this.config.dangerous_domains.includes(s.domain)), r = (a == null ? void 0 : a.confirm_turn_off) ?? o, n = `${C(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${C(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(r && !window.confirm(n)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await Aa(this.hass, t.id) : await Mt(this.hass, i, this.config);
      } catch (s) {
        this.reportError(s);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Re(t.flatMap((o) => o.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((o) => this.config.dangerous_domains.includes(o.domain))) && !window.confirm(C(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await Mt(this.hass, i, this.config);
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
ce.styles = $a;
Oe([
  Ie({ attribute: !1 })
], ce.prototype, "hass", 2);
Oe([
  A()
], ce.prototype, "config", 2);
Oe([
  A()
], ce.prototype, "expanded", 2);
Oe([
  A()
], ce.prototype, "error", 2);
ce = Oe([
  Ke(Li)
], ce);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.15.1 ${me(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const ne = "custom:area-bubble-overview-card", rt = "area-bubble-overview-card", ii = "area-bubble-overview-card-editor", Rt = "area-bubble-overview-card", nt = "__area_bubble_auto_fans__", st = "__area_bubble_auto_floor_heating_controls__", ae = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256
}, ke = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16384
}, ai = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8
}, B = ["climate", "floor_heating", "covers", "lights_switches", "media"], oi = ["lights", "climate", "floor_heating", "switches", "covers", "media"], ri = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, ct = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, Ue = {
  on: "mdi:power",
  off: "mdi:power-off",
  open: "mdi:window-shutter-open",
  close: "mdi:window-shutter"
}, Be = {
  classic: {},
  elegant: {
    border_radius: 26,
    blur: 20,
    show_shadows: !0,
    shadow_intensity: 0.18,
    card_transparent: !1,
    card_background: "linear-gradient(145deg, rgba(249,251,253,0.98) 0%, rgba(232,238,246,0.97) 55%, rgba(219,229,241,0.95) 100%)",
    row_background: "rgba(242,245,249,0.96)",
    active_surface: "linear-gradient(135deg, #dce8f3 0%, #c1d4e6 100%)",
    entity_active_surface: "#d2e1ee",
    area_frame_color: "#526b86",
    active_color: "#d8a62c",
    accent_color: "#55799f",
    control_surface: "#182a43",
    climate_surface: "linear-gradient(135deg, #bfd7f3 0%, #a9c6ea 100%)",
    climate_color: "#2f6fa7",
    cover_color: "#397f8c",
    media_color: "#725e91",
    temperature_off_surface: "linear-gradient(135deg, #182a43 0%, #243d5b 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #2f6fa7 0%, #438cc0 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #a9573e 0%, #c97658 100%)",
    temperature_active_surface: "linear-gradient(135deg, #62547f 0%, #7c6c9e 100%)",
    occupancy_active_color: "#b9e8cf",
    occupancy_vacant_color: "#f4f6f8",
    occupancy_unknown_color: "#f3cc78",
    primary_text_color: "#172033",
    secondary_text_color: "#526174",
    active_text_color: "#172033",
    control_text_color: "#f8fafc"
  },
  light: {
    border_radius: 28,
    blur: 16,
    show_shadows: !0,
    shadow_intensity: 0.12,
    card_transparent: !1,
    card_background: "linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(240,248,253,0.98) 58%, rgba(227,241,249,0.96) 100%)",
    row_background: "rgba(248,251,253,0.98)",
    active_surface: "linear-gradient(135deg, #dff5fb 0%, #c8eaf4 100%)",
    entity_active_surface: "#d6eef5",
    area_frame_color: "#5b8fa3",
    active_color: "#e6ad25",
    accent_color: "#2d8db5",
    control_surface: "#12324a",
    climate_surface: "linear-gradient(135deg, #cde8ff 0%, #afd8f5 100%)",
    climate_color: "#2482b4",
    cover_color: "#238fa0",
    media_color: "#7c64a8",
    temperature_off_surface: "linear-gradient(135deg, #12324a 0%, #1b4b66 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #2789bd 0%, #46a6d2 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #ce6545 0%, #e48a64 100%)",
    temperature_active_surface: "linear-gradient(135deg, #7365ad 0%, #9185c7 100%)",
    occupancy_active_color: "#aeeac6",
    occupancy_vacant_color: "#ffffff",
    occupancy_unknown_color: "#f6c968",
    primary_text_color: "#10233c",
    secondary_text_color: "#53677c",
    active_text_color: "#10233c",
    control_text_color: "#ffffff"
  },
  dark: {
    border_radius: 24,
    blur: 24,
    show_shadows: !0,
    shadow_intensity: 0.34,
    card_transparent: !1,
    card_background: "linear-gradient(145deg, rgba(12,20,34,0.98) 0%, rgba(23,34,51,0.97) 56%, rgba(31,44,63,0.96) 100%)",
    row_background: "rgba(34,47,65,0.96)",
    active_surface: "linear-gradient(135deg, #1f5360 0%, #2c4768 100%)",
    entity_active_surface: "#285264",
    area_frame_color: "#65a9bd",
    active_color: "#f0bd4f",
    accent_color: "#70b7cf",
    control_surface: "#080f1d",
    climate_surface: "linear-gradient(135deg, #244f78 0%, #355f8d 100%)",
    climate_color: "#69b8e6",
    cover_color: "#62c5cf",
    media_color: "#b39ae5",
    temperature_off_surface: "linear-gradient(135deg, #080f1d 0%, #17253b 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #1f6597 0%, #2f82b2 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #934b3e 0%, #b7634f 100%)",
    temperature_active_surface: "linear-gradient(135deg, #574a7e 0%, #7664a2 100%)",
    occupancy_active_color: "#8ee0b1",
    occupancy_vacant_color: "#d3dde8",
    occupancy_unknown_color: "#f0c66b",
    primary_text_color: "#f1f5f9",
    secondary_text_color: "#aebdcd",
    active_text_color: "#f3fbff",
    control_text_color: "#f8fafc"
  },
  modern: {
    border_radius: 22,
    blur: 18,
    show_shadows: !0,
    shadow_intensity: 0.16,
    card_transparent: !1,
    card_background: "linear-gradient(145deg, rgba(250,249,245,0.99) 0%, rgba(237,242,236,0.97) 55%, rgba(225,234,228,0.96) 100%)",
    row_background: "rgba(244,246,241,0.97)",
    active_surface: "linear-gradient(135deg, #d9e9e1 0%, #bfd7cc 100%)",
    entity_active_surface: "#cfe2d9",
    area_frame_color: "#5c7b72",
    active_color: "#d6a43a",
    accent_color: "#557f73",
    control_surface: "#263b37",
    climate_surface: "linear-gradient(135deg, #c9e2df 0%, #afcfcc 100%)",
    climate_color: "#3b7d83",
    cover_color: "#4a8990",
    media_color: "#806a8f",
    temperature_off_surface: "linear-gradient(135deg, #263b37 0%, #36534c 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #3c7e91 0%, #5599a8 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #a85e45 0%, #c47a5d 100%)",
    temperature_active_surface: "linear-gradient(135deg, #6c5d7c 0%, #89749a 100%)",
    occupancy_active_color: "#a8e0bd",
    occupancy_vacant_color: "#f2f1eb",
    occupancy_unknown_color: "#e8bd67",
    primary_text_color: "#183029",
    secondary_text_color: "#5a6d65",
    active_text_color: "#183029",
    control_text_color: "#f7faf8"
  }
}, q = {
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
  primary_text_color: "var(--primary-text-color)",
  secondary_text_color: "var(--secondary-text-color)",
  active_text_color: "#111827",
  control_text_color: "#f4f3ec",
  active_color: "var(--state-active-color, #ffd54f)",
  active_surface: "rgba(174, 215, 219, 0.94)",
  entity_active_surface: "rgba(174, 215, 219, 0.94)",
  area_frame_color: "",
  area_frame_width: 2,
  entity_frame_color: "",
  entity_frame_width: 1,
  climate_tag_gap: 0,
  link_section_frame_color: !1,
  section_frame_brightness: 12,
  climate_surface: "rgba(139, 181, 255, 0.94)",
  control_surface: "rgba(11, 28, 58, 0.94)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)",
  temperature_off_surface: "rgba(11, 28, 58, 0.94)",
  temperature_cool_surface: "rgba(34, 113, 196, 0.96)",
  temperature_heat_surface: "rgba(198, 83, 47, 0.96)",
  temperature_active_surface: "rgba(91, 86, 168, 0.96)",
  occupancy_active_color: "#b8f5c2",
  occupancy_vacant_color: "#f4f3ec",
  occupancy_unknown_color: "#ffcc80",
  quick_action_size: 38,
  quick_action_icon_size: 20,
  section_action_size: 44,
  section_action_icon_size: 22,
  category_gap: 12
}, Xe = {
  type: ne,
  target_icon: "",
  language: "auto",
  rtl: "auto",
  theme_preset: "classic",
  show_header: !0,
  show_floor_header: !0,
  show_temperature: !0,
  show_occupancy: !0,
  show_quick_actions: !0,
  show_area_expand_button: !0,
  show_floor_expand_button: !0,
  area_open_mode: "expander",
  quick_actions_position: "opposite",
  climate_tag_position: "left",
  show_fan_tag: !0,
  entity_state_language: "auto",
  light_tile_shape: "rectangle",
  light_icon_position: "start",
  light_show_state: !0,
  show_empty_sections: !1,
  default_expanded: !1,
  floor_default_expanded: !0,
  remember_expanded_state: !0,
  section_order: B,
  section_styles: {},
  section_action_mode: "dual",
  section_action_presentation: "icon",
  climate_mode_presentation: "both",
  section_action_icons: Ue,
  quick_actions: oi,
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
  style: q,
  debug: !1
}, L = (e, t) => {
  const i = e.attributes.supported_features;
  return typeof i != "number" || (i & t) !== 0;
}, ni = (e) => Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], Ta = /* @__PURE__ */ new Set(["onoff", "unknown"]), Pa = (e) => {
  if (e.domain !== "light") return !1;
  const t = Array.isArray(e.entity.attributes.supported_color_modes) ? e.entity.attributes.supported_color_modes.map(String) : [], i = typeof e.entity.attributes.color_mode == "string" ? [e.entity.attributes.color_mode] : [];
  return [...t, ...i].some((a) => !Ta.has(a)) || typeof e.entity.attributes.brightness == "number";
}, Dt = (e) => {
  if (!e.powered) return 0;
  const t = e.entity.attributes.brightness;
  return typeof t != "number" || !Number.isFinite(t) ? 100 : Math.min(100, Math.max(0, Math.round(t / 255 * 100)));
}, ye = (e) => e.powered && e.domain !== "cover" && e.ignoreActivity !== !0, Q = (e, t) => {
  if (e.domain === "climate") {
    const i = t ? ae.TURN_ON : ae.TURN_OFF;
    if (L(e.entity, i)) return { service: t ? "turn_on" : "turn_off" };
    const a = ni(e);
    if (!t && a.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const o = a.find((r) => r !== "off");
    return t && o ? { service: "set_hvac_mode", data: { hvac_mode: o } } : void 0;
  }
  if (e.domain === "media_player") {
    const i = t ? ke.TURN_ON : ke.TURN_OFF;
    return L(e.entity, i) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  }
  if (e.domain === "water_heater")
    return L(e.entity, ai.ON_OFF) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  if (["light", "switch", "fan", "input_boolean"].includes(e.domain))
    return { service: t ? "turn_on" : "turn_off" };
}, si = 2, ci = 1, li = (e, t) => t === "lights" ? e.domain === "light" : t === "switches" ? e.domain === "switch" && e.section === "lights_switches" : t === "climate" ? e.section === "climate" : t === "floor_heating" ? e.section === "floor_heating" : t === "covers" ? e.domain === "cover" : e.domain === "media_player", Se = (e, t) => e.allEntities.filter((i) => li(i, t)), Ia = (e, t) => t.map((i) => ({ action: i, entities: Se(e, i) })).filter(({ entities: i }) => i.some((a) => a.powered && a.ignoreActivity !== !0)), lt = (e, t, i) => {
  if (li(t, e)) {
    if (e === "covers") {
      const a = i ? ci : si;
      return t.domain !== "cover" || !L(t.entity, a) ? void 0 : { service: i ? "open_cover" : "close_cover" };
    }
    return Q(t, i);
  }
}, ft = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const { entity: i, service: a } of e) {
    const o = `${a.domain}.${a.service}:${JSON.stringify(a.data ?? {})}`, r = t.get(o) ?? { ...a, entityIds: [] };
    r.entityIds.push(i.entityId), t.set(o, r);
  }
  return [...t.values()];
}, gt = async (e, t, i) => {
  const a = await Promise.allSettled(
    t.map((r) => e.callService(r.domain, r.service, r.data, { entity_id: r.entityIds }))
  ), o = a.filter((r) => r.status === "rejected");
  if (o.length) throw new Error(`${o.length} of ${a.length} ${i} failed.`);
}, di = (e, t, i) => {
  const a = [];
  for (const o of Se(e, t)) {
    if (!o.available || o.protected || o.powered === i) continue;
    const r = lt(t, o, i);
    r && a.push({ entity: o, service: { domain: o.domain, ...r } });
  }
  return a;
}, Ze = (e, t, i) => di(e, t, i).map(({ entity: a }) => a), Oa = async (e, t, i, a) => {
  const o = di(t, i, a);
  await gt(e, ft(o), "area actions");
}, pi = (e, t) => {
  const i = [];
  for (const a of e.allEntities) {
    if (a.domain === "cover" || !a.available || a.protected || a.powered === t) continue;
    const o = Q(a, t);
    o && i.push({ entity: a, service: { domain: a.domain, ...o } });
  }
  return i;
}, qe = (e, t = !1) => pi(e, t).map(({ entity: i }) => i), Lt = async (e, t, i) => {
  await gt(e, ft(pi(t, i)), "room actions");
}, za = (e, t, i) => {
  if (e.id === "covers") {
    const o = i ? ci : si;
    return t.domain !== "cover" || !L(t.entity, o) ? void 0 : { domain: "cover", service: i ? "open_cover" : "close_cover" };
  }
  const a = Q(t, i);
  return a ? { domain: t.domain, ...a } : void 0;
}, ui = (e, t) => {
  const i = [];
  for (const a of e.entities) {
    if (!a.available || a.protected || a.powered === t) continue;
    const o = za(e, a, t);
    o && i.push({ entity: a, service: o });
  }
  return i;
}, et = (e, t = !1) => ui(e, t).map(({ entity: i }) => i), Fa = async (e, t, i) => {
  const a = ui(t, i);
  await gt(e, ft(a), "section actions");
}, G = (e, t, i, a) => {
  const o = t.split(".")[0] ?? "homeassistant";
  return e.callService(o, i, a, { entity_id: t });
}, H = (e) => !!e && typeof e == "object" && !Array.isArray(e), j = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], hi = (e) => {
  const t = new Set(B), i = j(e).filter((a) => t.has(a));
  return [.../* @__PURE__ */ new Set([...i, ...B])];
}, dt = (e) => {
  if (!H(e)) return {};
  const t = {};
  for (const i of B) {
    const a = j(e[i]);
    a.length && (t[i] = a);
  }
  return t;
}, bi = (e) => {
  if (!H(e)) return {};
  const t = {};
  for (const i of B)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, mi = (e) => {
  if (!H(e)) return {};
  const t = {};
  for (const i of B) {
    const a = e[i];
    if (!H(a)) continue;
    const o = typeof a.background == "string" ? a.background.trim() : "", r = typeof a.border_color == "string" ? a.border_color.trim() : "", n = typeof a.border_width == "number" && Number.isFinite(a.border_width) ? Math.min(8, Math.max(0, a.border_width)) : void 0, s = /* @__PURE__ */ new Set(["solid", "dashed", "dotted"]), c = typeof a.border_style == "string" && s.has(a.border_style) ? a.border_style : void 0, u = typeof a.columns == "number" && Number.isFinite(a.columns) ? Math.min(i === "covers" ? 2 : 3, Math.max(1, Math.round(a.columns))) : void 0, b = typeof a.entity_height == "number" && Number.isFinite(a.entity_height) ? Math.min(140, Math.max(44, a.entity_height)) : void 0, f = /* @__PURE__ */ new Set(["icon", "text", "both"]), l = typeof a.action_presentation == "string" && f.has(a.action_presentation) ? a.action_presentation : void 0;
    t[i] = {
      ...o ? { background: o } : {},
      ...r ? { border_color: r } : {},
      ...n !== void 0 ? { border_width: n } : {},
      ...c ? { border_style: c } : {},
      ...typeof a.show_border == "boolean" ? { show_border: a.show_border } : {},
      ...u !== void 0 ? { columns: u } : {},
      ...b !== void 0 ? { entity_height: b } : {},
      ...l ? { action_presentation: l } : {}
    };
  }
  return t;
}, qa = (e) => {
  const t = H(e) ? e : {};
  return Object.fromEntries(
    Object.keys(Ue).map((i) => {
      const a = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, a || Ue[i]];
    })
  );
}, Na = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(j(e).filter((i) => t.has(i)))];
}, Ma = (e) => {
  const t = H(e) ? e : {};
  return Object.fromEntries(
    Object.keys(ct).map((i) => {
      const a = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, a || ct[i]];
    })
  );
}, Ra = (e) => {
  if (!H(e)) return {};
  const t = {};
  for (const [i, a] of Object.entries(e))
    H(a) && (t[i] = {
      ...typeof a.name == "string" && a.name.trim() ? { name: a.name.trim() } : {},
      ...typeof a.icon == "string" && a.icon.trim() ? { icon: a.icon.trim() } : {},
      ...typeof a.parent_area == "string" && a.parent_area.trim() ? { parent_area: a.parent_area.trim() } : {},
      ...typeof a.show_when_parent_collapsed == "boolean" ? { show_when_parent_collapsed: a.show_when_parent_collapsed } : {},
      ...typeof a.hidden == "boolean" ? { hidden: a.hidden } : {},
      ...typeof a.default_expanded == "boolean" ? { default_expanded: a.default_expanded } : {},
      ...a.open_mode === "expander" || a.open_mode === "popup" ? { open_mode: a.open_mode } : {},
      ...typeof a.temperature_entity == "string" && a.temperature_entity.trim() ? { temperature_entity: a.temperature_entity.trim() } : {},
      ...typeof a.occupancy_count_entity == "string" && a.occupancy_count_entity.trim() ? { occupancy_count_entity: a.occupancy_count_entity.trim() } : {},
      occupancy_entities: j(a.occupancy_entities),
      ...Array.isArray(a.section_order) ? { section_order: hi(a.section_order) } : {},
      section_titles: bi(a.section_titles),
      section_styles: mi(a.section_styles),
      entity_order: dt(a.entity_order),
      include_entities: dt(a.include_entities),
      exclude_entities: j(a.exclude_entities)
    });
  return t;
}, Da = (e) => {
  if (!H(e)) return {};
  const t = new Set(B), i = {}, a = /* @__PURE__ */ new Set(["rectangle", "square"]), o = /* @__PURE__ */ new Set(["start", "left", "right", "center"]), r = /* @__PURE__ */ new Set(["auto", "he", "en"]);
  for (const [n, s] of Object.entries(e))
    H(s) && (i[n] = {
      ...typeof s.name == "string" && s.name.trim() ? { name: s.name.trim() } : {},
      ...typeof s.icon == "string" && s.icon.trim() ? { icon: s.icon.trim() } : {},
      ...typeof s.section == "string" && t.has(s.section) ? { section: s.section } : {},
      ...typeof s.group == "string" && s.group.trim() ? { group: s.group.trim() } : {},
      ...typeof s.hidden == "boolean" ? { hidden: s.hidden } : {},
      ...typeof s.protected == "boolean" ? { protected: s.protected } : {},
      ...typeof s.ignore_activity == "boolean" ? { ignore_activity: s.ignore_activity } : {},
      ...typeof s.tile_shape == "string" && a.has(s.tile_shape) ? { tile_shape: s.tile_shape } : {},
      ...typeof s.icon_position == "string" && o.has(s.icon_position) ? { icon_position: s.icon_position } : {},
      ...typeof s.show_state == "boolean" ? { show_state: s.show_state } : {},
      ...typeof s.state_language == "string" && r.has(s.state_language) ? { state_language: s.state_language } : {}
    });
  return i;
}, xe = (e) => {
  const t = { ...Xe, ...e }, i = bi(e.section_titles), a = H(e.style) ? e.style : {}, r = (/* @__PURE__ */ new Set(["classic", "elegant", "light", "dark", "modern"])).has(e.theme_preset) ? e.theme_preset : "classic", n = { ...Be[r], ...a }, s = n.area_name_size, c = typeof s == "number" && Number.isFinite(s) ? Math.min(24, Math.max(11, s)) : q.area_name_size, u = typeof n.card_background == "string" && n.card_background.trim() ? n.card_background.trim() : q.card_background, b = typeof n.card_transparent == "boolean" ? n.card_transparent : q.card_transparent, f = (m) => {
    const y = n[m];
    return typeof y == "string" && y.trim() || q[m];
  }, l = (m, y, _) => {
    const $ = n[m];
    return typeof $ == "number" && Number.isFinite($) ? Math.min(_, Math.max(y, $)) : q[m];
  }, g = /* @__PURE__ */ new Set(["auto", "he", "en"]), v = /* @__PURE__ */ new Set(["rectangle", "square"]), k = /* @__PURE__ */ new Set(["start", "left", "right", "center"]), d = /* @__PURE__ */ new Set(["icon", "text", "both"]);
  return {
    ...t,
    type: ne,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    target_icon: typeof e.target_icon == "string" ? e.target_icon.trim() : "",
    theme_preset: r,
    show_area_expand_button: typeof e.show_area_expand_button == "boolean" ? e.show_area_expand_button : Xe.show_area_expand_button,
    show_floor_expand_button: typeof e.show_floor_expand_button == "boolean" ? e.show_floor_expand_button : Xe.show_floor_expand_button,
    area_open_mode: e.area_open_mode === "popup" ? "popup" : "expander",
    quick_actions_position: e.quick_actions_position === "near_name" ? "near_name" : "opposite",
    climate_tag_position: ["left", "right", "top", "bottom"].includes(String(e.climate_tag_position)) ? e.climate_tag_position : "left",
    show_fan_tag: typeof e.show_fan_tag == "boolean" ? e.show_fan_tag : !0,
    entity_state_language: g.has(e.entity_state_language) ? e.entity_state_language : "auto",
    light_tile_shape: v.has(e.light_tile_shape) ? e.light_tile_shape : "rectangle",
    light_icon_position: k.has(e.light_icon_position) ? e.light_icon_position : "start",
    light_show_state: typeof e.light_show_state == "boolean" ? e.light_show_state : !0,
    section_order: hi(e.section_order),
    section_titles: Object.fromEntries(
      B.map((m) => [m, typeof i[m] == "string" ? i[m] : ""])
    ),
    section_styles: Object.fromEntries(
      B.map((m) => [m, mi(e.section_styles)[m] ?? {}])
    ),
    section_action_mode: e.section_action_mode === "toggle" ? "toggle" : "dual",
    section_action_presentation: d.has(e.section_action_presentation) ? e.section_action_presentation : "icon",
    climate_mode_presentation: d.has(e.climate_mode_presentation) ? e.climate_mode_presentation : "both",
    section_action_icons: qa(e.section_action_icons),
    quick_actions: Na(e.quick_actions ?? t.quick_actions),
    quick_action_icons: Ma(e.quick_action_icons),
    area_order: j(e.area_order),
    floor_heating_labels: j(t.floor_heating_labels),
    floor_heating_entities: j(t.floor_heating_entities),
    occupancy_device_classes: j(t.occupancy_device_classes),
    include_entities: dt(e.include_entities),
    exclude_entities: j(t.exclude_entities),
    protected_labels: j(t.protected_labels),
    protected_entities: j(t.protected_entities),
    area_overrides: Ra(e.area_overrides),
    entity_overrides: Da(e.entity_overrides),
    style: {
      ...q,
      ...Be[r],
      ...a,
      area_name_size: c,
      card_background: u,
      card_transparent: b,
      primary_text_color: f("primary_text_color"),
      secondary_text_color: f("secondary_text_color"),
      active_text_color: f("active_text_color"),
      control_text_color: f("control_text_color"),
      entity_active_surface: f("entity_active_surface"),
      area_frame_color: f("area_frame_color"),
      area_frame_width: typeof n.area_frame_width == "number" && Number.isFinite(n.area_frame_width) ? Math.min(8, Math.max(0, n.area_frame_width)) : q.area_frame_width,
      entity_frame_color: f("entity_frame_color"),
      entity_frame_width: typeof n.entity_frame_width == "number" && Number.isFinite(n.entity_frame_width) ? Math.min(6, Math.max(0, n.entity_frame_width)) : q.entity_frame_width,
      climate_tag_gap: typeof n.climate_tag_gap == "number" && Number.isFinite(n.climate_tag_gap) ? Math.min(20, Math.max(0, n.climate_tag_gap)) : q.climate_tag_gap,
      link_section_frame_color: typeof n.link_section_frame_color == "boolean" ? n.link_section_frame_color : q.link_section_frame_color,
      section_frame_brightness: typeof n.section_frame_brightness == "number" && Number.isFinite(n.section_frame_brightness) ? Math.min(100, Math.max(-100, n.section_frame_brightness)) : q.section_frame_brightness,
      occupancy_active_color: f("occupancy_active_color"),
      occupancy_vacant_color: f("occupancy_vacant_color"),
      occupancy_unknown_color: f("occupancy_unknown_color"),
      quick_action_size: l("quick_action_size", 28, 52),
      quick_action_icon_size: l("quick_action_icon_size", 14, 34),
      section_action_size: l("section_action_size", 36, 56),
      section_action_icon_size: l("section_action_icon_size", 16, 36),
      category_gap: l("category_gap", 0, 40)
    }
  };
}, La = (e) => {
  if (!H(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== ne) throw new Error(`Card type must be ${ne}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, ja = {
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
}, Ha = {
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
}, Ua = {
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
}, W = (e, t) => {
  var a;
  if (t.language === "he" || t.language === "en") return t.language;
  const i = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Ba = (e, t) => typeof t.rtl == "boolean" ? t.rtl : W(e, t) === "he" || document.documentElement.dir === "rtl", F = (e, t, i) => ja[W(e, t)][i], Va = (e, t, i, a) => a || t.section_titles[i] || Ha[W(e, t)][i], jt = (e, t, i) => Ua[W(e, t)][i], fe = (e) => e.split(".")[0] ?? "", pt = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, Ga = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, a] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(a.area_id ?? a.id ?? i, a);
  return t;
}, Ka = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), De = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (a == null ? void 0 : a.area_id) ?? void 0;
}, Ja = (e, t) => {
  var o, r;
  const i = (o = e == null ? void 0 : e.entities) == null ? void 0 : o[t], a = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(a == null ? void 0 : a.labels) ?? []])];
}, Qa = (e, t, i, a) => {
  var n, s, c;
  const o = e.entity_overrides[a];
  if (o != null && o.section) return o.section;
  const r = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const u of e.section_order)
    if ((s = (n = r == null ? void 0 : r.include_entities) == null ? void 0 : n[u]) != null && s.includes(a) || (c = e.include_entities[u]) != null && c.includes(a)) return u;
}, Wa = (e, t, i, a, o, r, n) => {
  const s = Qa(e, t, i, a);
  if (s) return s;
  const c = `${a} ${r} ${n.join(" ")}`.toLocaleLowerCase(), u = /(?:under[\s_-]*floor|floor[\s_-]*heating|חימום\s*(?:תת[\s_-]*)?רצפתי)/u.test(c), b = /(?:^|[\s._-])(?:fan|blower|מאוורר(?:ים)?)(?:$|[\s._-])/u.test(c);
  if (e.floor_heating_entities.includes(a) || n.some((f) => e.floor_heating_labels.includes(f)) || u)
    return "floor_heating";
  if (["switch", "input_boolean"].includes(o) && b || o === "climate" || o === "fan") return "climate";
  if (o === "cover") return "covers";
  if (o === "light" || o === "switch") return "lights_switches";
  if (o === "media_player") return "media";
}, Ya = (e, t, i, a, o) => {
  const r = `${i} ${a} ${o.join(" ")}`.toLocaleLowerCase(), n = /(?:^|[\s._-])(?:fan|blower|מאוורר(?:ים)?)(?:$|[\s._-])/u.test(r);
  if (e === "climate" && (t === "fan" || n)) return nt;
  if (e === "floor_heating" && ["switch", "input_boolean"].includes(t)) return st;
}, Xa = (e, t = fe(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, fi = (e, t = fe(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return ["", "unknown", "unavailable"].includes(i) ? !1 : t === "media_player" ? !["off", "standby"].includes(i) : t === "climate" || t === "water_heater" ? i !== "off" : t === "cover" ? ["open", "opening", "closing"].includes(i) : i === "on";
}, Za = (e) => {
  const t = e.filter((o) => o.domain === "climate" && o.section === "climate" && o.available);
  if (!t.length) return "none";
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const r = String(o.entity.attributes.hvac_action ?? "").toLowerCase(), n = String(o.entity.state ?? "").toLowerCase();
    r === "heating" ? i.add("heat") : r === "cooling" ? i.add("cool") : ["drying", "fan"].includes(r) ? i.add("active") : r === "off" ? i.add("off") : n === "heat" ? i.add("heat") : n === "cool" ? i.add("cool") : n === "off" ? i.add("off") : i.add("active");
  }
  const a = [...i].filter((o) => o !== "off");
  return a.length ? new Set(a).size > 1 || i.has("active") ? "active" : i.has("heat") ? "heat" : i.has("cool") ? "cool" : "active" : "off";
}, eo = (e, t, i) => {
  var a;
  return i || ((a = e == null ? void 0 : e.formatEntityName) == null ? void 0 : a.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, to = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), Ht = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, tt = (e) => {
  if (!e) return {};
  const t = pt(e.attributes.current_temperature), i = pt(e.state), a = t ?? i, o = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: a, unit: o };
}, Ut = (e) => {
  if (!e.length) return;
  const t = [...e].sort((a, o) => a - o), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, io = (e, t, i, a, o, r) => {
  var b, f;
  const n = o.area_overrides[t] ?? o.area_overrides[(i == null ? void 0 : i.name) ?? ""], s = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((l) => !!l).filter((l) => !r.has(l)))];
  for (const l of s) {
    const g = tt(e == null ? void 0 : e.states[l]);
    if (g.value !== void 0) return { temperature: g.value, unit: g.unit };
  }
  const c = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => !!l).filter((l) => fe(l.entity_id) === "sensor" && l.attributes.device_class === "temperature").map(tt).filter((l) => l.value !== void 0);
  if (c.length) return { temperature: Ut(c.map((l) => l.value)), unit: (b = c.find((l) => l.unit)) == null ? void 0 : b.unit };
  const u = a.map((l) => e == null ? void 0 : e.states[l]).filter((l) => l !== void 0 && fe(l.entity_id) === "climate").map(tt).filter((l) => l.value !== void 0);
  return { temperature: Ut(u.map((l) => l.value)), unit: (f = u.find((l) => l.unit)) == null ? void 0 : f.unit };
}, ao = (e, t, i, a, o, r) => {
  const n = o.area_overrides[t] ?? o.area_overrides[i ?? ""], s = n == null ? void 0 : n.occupancy_count_entity;
  if (s && !r.has(s)) {
    const v = e == null ? void 0 : e.states[s];
    if (v) {
      const k = pt(v.state);
      if (k !== void 0) {
        const d = Math.max(0, Math.round(k));
        return { occupancy: d > 0 ? "occupied" : "vacant", count: d, countSource: "entity", entities: [s] };
      }
      return { occupancy: "unknown", countSource: "entity", entities: [s] };
    }
  }
  const c = ((n == null ? void 0 : n.occupancy_entities) ?? []).filter((v) => !r.has(v)), u = c.length ? c : a.filter((v) => {
    const k = e == null ? void 0 : e.states[v];
    return fe(v) === "binary_sensor" && o.occupancy_device_classes.includes(String((k == null ? void 0 : k.attributes.device_class) ?? ""));
  });
  if (!u.length) return { occupancy: "none", countSource: "none", entities: [] };
  const b = u.map((v) => {
    var k;
    return String(((k = e == null ? void 0 : e.states[v]) == null ? void 0 : k.state) ?? "unknown").toLowerCase();
  }), f = /* @__PURE__ */ new Set(["on", "home", "occupied", "present", "detected"]), l = /* @__PURE__ */ new Set(["off", "not_home", "away", "vacant", "clear"]), g = b.filter((v) => f.has(v)).length;
  return g > 0 ? { occupancy: "occupied", count: g, countSource: "sensors", entities: u } : b.every((v) => l.has(v)) ? { occupancy: "vacant", count: 0, countSource: "sensors", entities: u } : { occupancy: "unknown", countSource: "sensors", entities: u };
}, oo = (e, t, i, a, o) => {
  var k, d, m, y, _, $;
  const r = t.area_overrides[i] ?? t.area_overrides[(a == null ? void 0 : a.name) ?? ""];
  if (r != null && r.hidden) return;
  const n = Object.values((r == null ? void 0 : r.include_entities) ?? {}).flat(), s = [.../* @__PURE__ */ new Set([...o, ...n])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(r == null ? void 0 : r.exclude_entities) ?? []]);
  for (const [x, P] of Object.entries(t.entity_overrides))
    P.hidden === !0 && c.add(x);
  for (const x of s)
    ((k = t.entity_overrides[x]) == null ? void 0 : k.hidden) === !0 && c.add(x);
  const u = s.filter((x) => !c.has(x)), b = [];
  for (const x of s) {
    const P = e == null ? void 0 : e.states[x];
    if (!P || c.has(x)) continue;
    const S = (d = e == null ? void 0 : e.entities) == null ? void 0 : d[x], O = S != null && S.device_id ? (m = e == null ? void 0 : e.devices) == null ? void 0 : m[S.device_id] : void 0, E = t.entity_overrides[x];
    if (E != null && E.hidden || S != null && S.hidden || S != null && S.hidden_by || S != null && S.disabled_by || O != null && O.disabled_by || (S == null ? void 0 : S.entity_category) === "config" || (S == null ? void 0 : S.entity_category) === "diagnostic") continue;
    const w = fe(x), V = Ja(e, x), le = eo(e, P, E == null ? void 0 : E.name), de = Wa(t, i, a == null ? void 0 : a.name, x, w, le, V);
    de && b.push({
      entity: P,
      entityId: x,
      domain: w,
      name: le,
      icon: to(P, w, E == null ? void 0 : E.icon),
      areaId: i,
      section: de,
      labels: V,
      available: !["unavailable", "unknown"].includes(P.state),
      active: Xa(P, w),
      powered: fi(P, w),
      protected: (E == null ? void 0 : E.protected) === !0 || t.protected_entities.includes(x) || V.some((ze) => t.protected_labels.includes(ze)),
      ignoreActivity: (E == null ? void 0 : E.ignore_activity) === !0,
      group: (E == null ? void 0 : E.group) ?? Ya(de, w, x, le, V)
    });
  }
  const l = ((y = r == null ? void 0 : r.section_order) != null && y.length ? r.section_order : t.section_order).map((x) => {
    var S;
    const P = b.filter((O) => O.section === x).sort(
      (O, E) => {
        var w, V;
        return Ht((w = r == null ? void 0 : r.entity_order) == null ? void 0 : w[x], O.entityId) - Ht((V = r == null ? void 0 : r.entity_order) == null ? void 0 : V[x], E.entityId) || O.name.localeCompare(E.name);
      }
    );
    return {
      id: x,
      title: Va(e, t, x, (S = r == null ? void 0 : r.section_titles) == null ? void 0 : S[x]),
      icon: ri[x],
      entities: P,
      activeCount: P.filter((O) => O.powered).length
    };
  }).filter((x) => t.show_empty_sections || x.entities.length > 0), g = io(e, i, a, u, t, c), v = ao(e, i, a == null ? void 0 : a.name, u, t, c);
  return {
    id: i,
    name: (r == null ? void 0 : r.name) ?? (a == null ? void 0 : a.name) ?? i,
    icon: (r == null ? void 0 : r.icon) ?? (a == null ? void 0 : a.icon) ?? "mdi:floor-plan",
    floorId: (a == null ? void 0 : a.floor_id) ?? void 0,
    parentAreaId: r == null ? void 0 : r.parent_area,
    showWhenParentCollapsed: (r == null ? void 0 : r.show_when_parent_collapsed) === !0,
    sections: l,
    allEntities: b,
    temperature: g.temperature,
    temperatureUnit: g.unit ?? (($ = (_ = e == null ? void 0 : e.config) == null ? void 0 : _.unit_system) == null ? void 0 : $.temperature) ?? "°C",
    temperatureMode: Za(b.filter((x) => x.ignoreActivity !== !0)),
    occupancy: v.occupancy,
    occupancyCount: v.count,
    occupancyCountSource: v.countSource,
    occupancyEntities: v.entities
  };
}, ro = (e, t, i) => {
  if (t.area) {
    const a = [...i.entries()].find(([r, n]) => r === t.area || n.name === t.area);
    if (!a) return { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
    const o = t.area_overrides[a[0]] ?? t.area_overrides[a[1].name];
    return { ids: [a[0]], targetName: a[1].name, targetIcon: t.target_icon || (o == null ? void 0 : o.icon) || a[1].icon || "mdi:floor-plan", kind: "area", warnings: [] };
  }
  if (t.floor) {
    const a = Ka(e).find((r) => r.id === t.floor || r.name === t.floor);
    if (!a) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const o = [...i.entries()].filter(([, r]) => r.floor_id === a.id).map(([r]) => r);
    return { ids: o, targetName: a.name, targetIcon: t.target_icon || a.icon || "mdi:home-floor-0", kind: "floor", warnings: o.length ? [] : [`Floor has no areas: ${a.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, Ve = (e, t) => {
  var k;
  const i = Ga(e), a = ro(e, t, i), o = /* @__PURE__ */ new Map();
  for (const d of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const m = De(e, d);
    if (!m) continue;
    const y = o.get(m) ?? [];
    y.push(d), o.set(m, y);
  }
  const r = (d, m) => {
    const y = t.area_order.findIndex((_) => _ === d || _ === m);
    return y < 0 ? Number.MAX_SAFE_INTEGER : y;
  }, n = a.ids.map((d) => oo(e, t, d, i.get(d), o.get(d) ?? [])).filter((d) => !!d).sort((d, m) => r(d.id, d.name) - r(m.id, m.name) || d.name.localeCompare(m.name)), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = (d, m) => {
    if (!d) return;
    const y = c.get(d) ?? /* @__PURE__ */ new Set();
    y.add(m), c.set(d, y);
  };
  for (const d of n) {
    s.set(d.id, d.id), u(d.name, d.id);
    const m = (k = i.get(d.id)) == null ? void 0 : k.name;
    u(m, d.id);
  }
  for (const [d, m] of c)
    m.size === 1 && !s.has(d) && s.set(d, [...m][0]);
  const b = n.map((d) => {
    const m = d.parentAreaId ? s.get(d.parentAreaId) : void 0;
    return { ...d, parentAreaId: m && m !== d.id ? m : void 0 };
  }), f = new Map(b.filter((d) => d.parentAreaId).map((d) => [d.id, d.parentAreaId])), l = /* @__PURE__ */ new Set();
  for (const d of b) {
    const m = [], y = /* @__PURE__ */ new Map();
    let _ = d.id;
    for (; _; ) {
      const $ = y.get(_);
      if ($ !== void 0) {
        for (const x of m.slice($)) l.add(x);
        break;
      }
      y.set(_, m.length), m.push(_), _ = f.get(_);
    }
  }
  const g = b.map((d) => l.has(d.id) ? { ...d, parentAreaId: void 0 } : d), v = l.size ? [`Area parent cycle ignored: ${[...l].join(", ")}`] : [];
  return {
    areas: g,
    targetName: t.title || a.targetName,
    targetIcon: a.targetIcon,
    targetKind: a.kind,
    warnings: [...a.warnings, ...v]
  };
}, gi = (e) => {
  const t = new Map(e.map((n) => [n.id, n])), i = /* @__PURE__ */ new Map();
  for (const n of e)
    n.parentAreaId && n.parentAreaId !== n.id && t.has(n.parentAreaId) && i.set(n.id, n.parentAreaId);
  const a = /* @__PURE__ */ new Set();
  for (const n of e) {
    const s = [], c = /* @__PURE__ */ new Map();
    let u = n.id;
    for (; u; ) {
      const b = c.get(u);
      if (b !== void 0) {
        for (const f of s.slice(b)) a.add(f);
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
}, no = (e, t) => {
  const { roots: i, children: a } = gi(e), o = [], r = /* @__PURE__ */ new Set(), n = (s) => {
    if (r.has(s.id)) return;
    r.add(s.id), o.push(s);
    const c = t(s);
    for (const u of a.get(s.id) ?? [])
      (c || u.showWhenParentCollapsed) && n(u);
  };
  for (const s of i) n(s);
  return o;
};
var so = Object.defineProperty, co = Object.getOwnPropertyDescriptor, ee = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? co(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && so(t, i, o), o;
};
let K = class extends Z {
  constructor() {
    super(...arguments), this.config = { type: ne }, this.targetMode = "area", this.activeAreaId = "", this.entitySearch = "", this.candidateEntityId = "", this.candidateSection = "floor_heating";
  }
  setConfig(e) {
    const t = { ...e, type: ne };
    typeof e.show_area_expand_button != "boolean" && delete t.show_area_expand_button, typeof e.show_floor_expand_button != "boolean" && delete t.show_floor_expand_button, e.area_open_mode !== "expander" && e.area_open_mode !== "popup" && delete t.area_open_mode, ["classic", "elegant", "light", "dark", "modern"].includes(String(e.theme_preset)) || delete t.theme_preset, this.config = t, this.targetMode = e.floor ? "floor" : "area", e.area && (this.activeAreaId = e.area);
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.floors !== this.hass.floors || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : t.states !== this.hass.states;
  }
  render() {
    const e = xe(this.config), t = W(this.hass, e), i = typeof e.rtl == "boolean" ? e.rtl : t === "he";
    this.setAttribute("dir", i ? "rtl" : "ltr"), this.style.setProperty("--overview-editor-direction", i ? "rtl" : "ltr");
    const a = Ve(this.hass, e), o = this.targetAreas(e), r = this.entityMapByArea();
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
          ${this.targetMode === "floor" && !a.length ? p`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", t)}</div>` : h}
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
      ["show_floor_expand_button", this.l("הצג חץ פתיחה בכותרת הקומה", "Show floor expand button", t), this.l("גם ללא החץ, לחיצה על כותרת הקומה פותחת ומכווצת אותה", "The floor header remains clickable when the arrow is hidden", t), e.show_floor_expand_button],
      ["default_expanded", this.l("פתוח כברירת מחדל", "Expanded by default", t), "", e.default_expanded],
      ["floor_default_expanded", this.l("פתח קומה כברירת מחדל", "Floor expanded by default", t), this.l("חל רק כאשר היעד הוא קומה", "Used only when the target is a floor", t), e.floor_default_expanded],
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", t), this.l("שומר בנפרד את מצב הקומה ואת מצב כל אזור", "Remembers the floor and each area separately", t), e.remember_expanded_state],
      ["show_empty_sections", this.l("הצג סעיפים ריקים", "Show empty sections", t), "", e.show_empty_sections]
    ];
    return p`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", t), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", t))}
        <div class="panel">
          <div class="field">
            <label>${this.l("אופן פתיחת חדר", "Room opening mode", t)}</label>
            <select .value=${e.area_open_mode} @change=${(a) => this.commitKey("area_open_mode", a.target.value)}>
              <option value="expander">Expander</option>
              <option value="popup">Popup</option>
            </select>
            <div class="hint">${this.l("Popup פותח את תוכן החדר בחלון עם כפתור סגירה עליון. ניתן לבחור מצב אחר לכל חדר.", "Popup opens the room content in a modal with a top close button. Each room can override this setting.", t)}</div>
          </div>
          <div class="settings-list">${i.map(([a, o, r, n]) => this.booleanRow(o, r, n, (s) => this.commitKey(a, s)))}</div>
        </div>
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
            <div class="field">
              <label>${this.l("תצוגת כפתורי הקטגוריה", "Category button appearance", t)}</label>
              <select .value=${e.section_action_presentation} @change=${(i) => this.commitKey("section_action_presentation", i.target.value)}>
                <option value="icon">${this.l("אייקון בלבד", "Icon only", t)}</option>
                <option value="text">${this.l("טקסט בלבד", "Text only", t)}</option>
                <option value="both">${this.l("אייקון וטקסט", "Icon and text", t)}</option>
              </select>
            </div>
            <div class="field">
              <label>${this.l("תצוגת מצב המזגן והמאוורר", "Climate and fan mode display", t)}</label>
              <select .value=${e.climate_mode_presentation} @change=${(i) => this.commitKey("climate_mode_presentation", i.target.value)}>
                <option value="icon">${this.l("אייקון בלבד", "Icon only", t)}</option>
                <option value="text">${this.l("טקסט בלבד", "Text only", t)}</option>
                <option value="both">${this.l("אייקון וטקסט", "Icon and text", t)}</option>
              </select>
            </div>
          </div>
          <div class="inline-fields">
            ${["on", "off", "open", "close"].map((i) => {
      var a;
      return this.iconField(
        this.sectionActionIconName(i, t),
        typeof ((a = this.config.section_action_icons) == null ? void 0 : a[i]) == "string" ? this.config.section_action_icons[i] : "",
        Ue[i],
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
                <span class="order-icon"><ha-icon icon=${ri[i]}></ha-icon></span>
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
                  ${i === "lights_switches" || i === "covers" ? this.numberField(
        i === "covers" ? this.l("מספר תריסים בשורה", "Covers per row", t) : this.l("מספר אריחי תאורה בשורה", "Light tiles per row", t),
        e.section_styles[i].columns ?? (i === "covers" ? 1 : 2),
        1,
        i === "covers" ? 2 : 3,
        (c) => this.setGlobalSectionStyle(i, { columns: Math.round(c) })
      ) : h}
                  <div class="inline-fields">
                    ${this.numberField(
        this.l("גובה ציוד בקטגוריה", "Device tile height", t),
        e.section_styles[i].entity_height ?? (i === "climate" ? 108 : i === "floor_heating" ? 92 : 56),
        44,
        140,
        (c) => this.setGlobalSectionStyle(i, { entity_height: c })
      )}
                    <div class="field">
                      <label>${this.l("תצוגת כפתורי פעולה", "Action button appearance", t)}</label>
                      <select .value=${e.section_styles[i].action_presentation ?? ""} @change=${(c) => this.setGlobalSectionStyle(i, { action_presentation: c.target.value || void 0 })}>
                        <option value="">${this.l("לפי ההגדרה הכללית", "Use global setting", t)}</option>
                        <option value="icon">${this.l("אייקון בלבד", "Icon only", t)}</option>
                        <option value="text">${this.l("טקסט בלבד", "Text only", t)}</option>
                        <option value="both">${this.l("אייקון וטקסט", "Icon and text", t)}</option>
                      </select>
                    </div>
                  </div>
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
                  <div class="inline-fields">
                    ${this.numberField(
        this.l("עובי המסגרת", "Frame thickness", t),
        e.section_styles[i].border_width ?? 1,
        0,
        8,
        (c) => this.setGlobalSectionStyle(i, { border_width: c })
      )}
                    <div class="field">
                      <label>${this.l("סגנון המסגרת", "Frame style", t)}</label>
                      <select .value=${e.section_styles[i].border_style ?? "solid"} @change=${(c) => this.setGlobalSectionStyle(i, { border_style: c.target.value })}>
                        <option value="solid">${this.l("רציף", "Solid", t)}</option>
                        <option value="dashed">${this.l("מקווקו", "Dashed", t)}</option>
                        <option value="dotted">${this.l("מנוקד", "Dotted", t)}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            `;
    })}
          </div>
          <div class="setting-title">${this.l("פעולות מהירות", "Quick actions", t)}</div>
          <div class="order-list">
            ${[...e.quick_actions, ...oi.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      var s;
      const a = e.quick_actions.includes(i), o = e.quick_actions.indexOf(i), r = (s = this.config.quick_action_icons) == null ? void 0 : s[i], n = typeof r == "string" ? r : "";
      return p`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${e.quick_action_icons[i]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(i, t)}</div></div>
                  <div class="area-actions">
                    ${a ? this.orderButtons(o, e.quick_actions.length, () => this.moveQuickAction(i, -1), () => this.moveQuickAction(i, 1)) : h}
                    ${this.switchControl(a, (c) => this.toggleQuickAction(i, c), this.quickName(i, t))}
                  </div>
                  <div class="quick-action-icon-field">
                    ${this.iconField(
        `${this.l("אייקון פעולה", "Action icon", t)} · ${this.quickName(i, t)}`,
        n,
        ct[i],
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
    var v, k;
    const n = a.area_overrides[e.id] ?? a.area_overrides[e.name] ?? {}, s = this.activeAreaId === e.id, c = o.filter(
      (d) => d.entity_id.startsWith("climate.") || d.entity_id.startsWith("sensor.") && d.attributes.device_class === "temperature"
    ), u = o.filter((d) => {
      const m = d.entity_id.split(".")[0];
      return m === "binary_sensor" || m === "person" || m === "device_tracker";
    }), b = o.filter((d) => {
      const m = d.entity_id.split(".")[0];
      return ["sensor", "input_number", "counter"].includes(m ?? "") && (Number.isFinite(Number(d.state)) || d.entity_id === n.occupancy_count_entity);
    }), f = this.targetAreas(a).filter((d) => {
      const m = a.area_overrides[d.id] ?? a.area_overrides[d.name];
      return d.id !== e.id && (m == null ? void 0 : m.hidden) !== !0 && !this.wouldCreateAreaCycle(e.id, d.id, a);
    }), l = n.parent_area ? ((v = this.areaOptions().find((d) => d.id === n.parent_area || d.name === n.parent_area)) == null ? void 0 : v.id) ?? "" : "", g = ((k = this.areaOptions().find((d) => d.id === l)) == null ? void 0 : k.name) ?? l;
    return p`
      <div class="area-card ${n.hidden ? "hidden" : ""} ${l ? "child" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${n.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${s ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${n.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, a), () => this.moveArea(e.id, 1, a))}
            ${this.switchControl(!n.hidden, (d) => this.updateAreaOverride(e.id, { hidden: !d }), this.l("הצג אזור", "Show area", r))}
          </div>
        </div>
        ${s ? p`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", r)}</label><input type="text" .value=${n.name ?? ""} placeholder=${e.name} @change=${(d) => this.updateAreaOverride(e.id, { name: d.target.value || void 0 })} /></div>
                ${this.iconField(this.l("אייקון האזור", "Area icon", r), n.icon ?? "", e.icon, r, (d) => this.updateAreaOverride(e.id, { icon: d || void 0 }))}
              </div>
              <div class="field">
                <label>${this.l("תת־אזור של", "Parent area", r)}</label>
                <select .value=${l} @change=${(d) => this.updateAreaOverride(e.id, { parent_area: d.target.value || void 0 })}>
                  <option value="">${this.l("ללא אזור אב", "No parent area", r)}</option>
                  ${f.map((d) => p`<option value=${d.id}>${d.name}</option>`)}
                </select>
                <div class="hint">${this.l("הקשר הוא חזותי בלבד; המצב והפעולות של כל אזור נשארים עצמאיים.", "Nesting is visual only; every area's state and actions remain independent.", r)}</div>
              </div>
              ${l ? this.booleanRow(
      this.l("הצג כשהאזור הראשי מכווץ", "Show when parent is collapsed", r),
      this.l(
        `כבוי כברירת מחדל. כשהאפשרות פעילה, תת־האזור נשאר גלוי בתוך ${g} גם כשהוא מכווץ. החצים בשורת האזור קובעים את הסדר רק בין תתי־אזורים של אותו אזור אב.`,
        `Off by default. When enabled, this child remains visible inside ${g} while the parent is collapsed. The arrows in the area row order only children of the same parent.`,
        r
      ),
      n.show_when_parent_collapsed ?? !1,
      (d) => this.updateAreaOverride(e.id, { show_when_parent_collapsed: d })
    ) : h}
              <div class="field">
                <label>${this.l("אופן פתיחת חדר זה", "Opening mode for this room", r)}</label>
                <select .value=${n.open_mode ?? ""} @change=${(d) => this.updateAreaOverride(e.id, { open_mode: d.target.value || void 0 })}>
                  <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", r)}</option>
                  <option value="expander">Expander</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", r)}</label>
                <select .value=${n.temperature_entity ?? ""} @change=${(d) => this.updateAreaOverride(e.id, { temperature_entity: d.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", r)}</option>
                  ${c.map((d) => p`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור ספירת נוכחים", "Occupancy count source", r)}</label>
                <select .value=${n.occupancy_count_entity ?? ""} @change=${(d) => this.updateAreaOverride(e.id, { occupancy_count_entity: d.target.value || void 0 })}>
                  <option value="">${this.l("ספירת חיישני נוכחות פעילים", "Count active presence sensors", r)}</option>
                  ${b.map((d) => p`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                </select>
                <div class="hint">${this.l("בחרו חיישן מספרי כדי להציג מספר אנשים אמיתי; אחרת יוצג מספר חיישני הנוכחות הפעילים.", "Choose a numeric sensor for a true people count; otherwise the card shows the number of active presence sensors.", r)}</div>
              </div>
              ${u.length ? p`<div class="field"><label>${this.l("מקורות נוכחות (ריק = אוטומטי)", "Presence sources (empty = automatic)", r)}</label><div class="entity-flags">${u.map((d) => {
      var y;
      const m = ((y = n.occupancy_entities) == null ? void 0 : y.includes(d.entity_id)) ?? !1;
      return p`<label class="check-label"><input type="checkbox" .checked=${m} @change=${(_) => this.toggleAreaList(e.id, "occupancy_entities", d.entity_id, _.target.checked)} />${this.entityName(d)}</label>`;
    })}</div></div>` : h}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", r)}</div></div>${this.switchControl(n.default_expanded ?? a.default_expanded, (d) => this.updateAreaOverride(e.id, { default_expanded: d }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", r)}</div>
              <div class="inline-fields">
                ${a.section_order.map((d) => {
      var m;
      return p`<div class="field"><label>${this.sectionDefaultName(d, r)}</label><input type="text" .value=${((m = n.section_titles) == null ? void 0 : m[d]) ?? ""} placeholder=${a.section_titles[d] || this.sectionDefaultName(d, r)} @change=${(y) => this.setAreaSectionTitle(e.id, d, y.target.value)} /></div>`;
    })}
              </div>
              <div class="setting-title">${this.l("מראה קטגוריות בחדר", "Room category appearance", r)}</div>
              <div class="order-list">
                ${a.section_order.map((d) => {
      var _;
      const m = a.section_styles[d], y = ((_ = n.section_styles) == null ? void 0 : _[d]) ?? {};
      return p`
                    <div class="area-card">
                      <div class="setting-title">${this.sectionDefaultName(d, r)}</div>
                      ${this.booleanRow(
        this.l("הצג מסגרת בחדר זה", "Show frame in this room", r),
        "",
        y.show_border ?? m.show_border ?? !1,
        ($) => this.setAreaSectionStyle(e.id, d, { show_border: $ })
      )}
                      ${d === "lights_switches" || d === "covers" ? p`<div class="field">
                            <label>${d === "covers" ? this.l("מספר תריסים בשורה בחדר זה", "Covers per row in this room", r) : this.l("מספר תאורות בשורה בחדר זה", "Light tiles per row in this room", r)}</label>
                            <select .value=${y.columns === void 0 ? "" : String(y.columns)} @change=${($) => {
        const x = $.target.value;
        this.setAreaSectionStyle(e.id, d, { columns: x ? Number(x) : void 0 });
      }}>
                              <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", r)}</option>
                              <option value="1">1</option><option value="2">2</option>${d === "lights_switches" ? p`<option value="3">3</option>` : h}
                            </select>
                          </div>` : h}
                      <div class="inline-fields">
                        <div class="field">
                          <label>${this.l("גובה ציוד בחדר זה", "Device tile height in this room", r)}</label>
                          <input type="number" min="44" max="140" .value=${y.entity_height === void 0 ? "" : String(y.entity_height)} placeholder=${String(m.entity_height ?? (d === "climate" ? 108 : d === "floor_heating" ? 92 : 56))} @change=${($) => {
        const x = $.target.value;
        this.setAreaSectionStyle(e.id, d, { entity_height: x === "" ? void 0 : Number(x) });
      }} />
                        </div>
                        <div class="field">
                          <label>${this.l("תצוגת כפתורי פעולה בחדר זה", "Action appearance in this room", r)}</label>
                          <select .value=${y.action_presentation ?? ""} @change=${($) => this.setAreaSectionStyle(e.id, d, { action_presentation: $.target.value || void 0 })}>
                            <option value="">${this.l("לפי הגדרת הקטגוריה", "Use category setting", r)}</option>
                            <option value="icon">${this.l("אייקון בלבד", "Icon only", r)}</option>
                            <option value="text">${this.l("טקסט בלבד", "Text only", r)}</option>
                            <option value="both">${this.l("אייקון וטקסט", "Icon and text", r)}</option>
                          </select>
                        </div>
                      </div>
                      <div class="inline-fields">
                        ${this.valueColorField(
        this.l("רקע בחדר זה", "Background in this room", r),
        y.background ?? m.background ?? "transparent",
        "#ffffff",
        !!y.background,
        r,
        ($) => this.setAreaSectionStyle(e.id, d, { background: $ || void 0 })
      )}
                        ${this.valueColorField(
        this.l("צבע מסגרת בחדר זה", "Frame color in this room", r),
        y.border_color ?? m.border_color ?? "var(--divider-color)",
        "#888888",
        !!y.border_color,
        r,
        ($) => this.setAreaSectionStyle(e.id, d, { border_color: $ || void 0 })
      )}
                      </div>
                      <div class="inline-fields">
                        <div class="field">
                          <label>${this.l("עובי מסגרת בחדר זה", "Frame thickness in this room", r)}</label>
                          <input
                            type="number"
                            min="0"
                            max="8"
                            .value=${y.border_width === void 0 ? "" : String(y.border_width)}
                            placeholder=${String(m.border_width ?? 1)}
                            @change=${($) => {
        const x = $.target.value;
        this.setAreaSectionStyle(e.id, d, { border_width: x === "" ? void 0 : Number(x) });
      }}
                          />
                        </div>
                        <div class="field">
                          <label>${this.l("סגנון מסגרת בחדר זה", "Frame style in this room", r)}</label>
                          <select .value=${y.border_style ?? ""} @change=${($) => this.setAreaSectionStyle(e.id, d, { border_style: $.target.value || void 0 })}>
                            <option value="">${this.l("כמו ההגדרה הכללית", "Use global style", r)}</option>
                            <option value="solid">${this.l("רציף", "Solid", r)}</option>
                            <option value="dashed">${this.l("מקווקו", "Dashed", r)}</option>
                            <option value="dotted">${this.l("מנוקד", "Dotted", r)}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  `;
    })}
              </div>
            ` : h}
      </div>
    `;
  }
  renderEntities(e, t, i, a) {
    var f;
    const o = this.activeAreaId || ((f = i[0]) == null ? void 0 : f.id) || "", r = t.areas.find((l) => l.id === o), n = Ve(this.hass, this.configForEntityEditor(e, o)).areas.find((l) => l.id === o), s = new Map(((n == null ? void 0 : n.allEntities) ?? (r == null ? void 0 : r.allEntities) ?? []).map((l) => [l.entityId, l])), c = this.entitiesForEditor(o, s, e), u = this.unclassifiedCandidates(o, s), b = c.filter((l) => `${l.name} ${l.entityId} ${l.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return p`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", a), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", a))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${o} @change=${(l) => this.activeAreaId = l.target.value}>${i.map((l) => p`<option value=${l.id}>${l.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", a)} .value=${this.entitySearch} @input=${(l) => this.entitySearch = l.target.value} />
          </div>
          <div class="hint">${this.l("לכל רכיב יש כפתור הסתרה מלא. רכיב מוסתר נשאר כאן לשחזור, אך אינו מוצג ואינו משפיע על צבע, מונים או פעולות האזור. מאווררים וחימום רצפתי ממופים אוטומטית לפי שם ותוויות; בחירת הסעיף הידנית כאן תמיד גוברת על הזיהוי.", "Every device has a complete hide control. Hidden devices remain here for restore, but do not appear or affect area color, counts, or actions. Fans and floor heating are mapped automatically by name and labels; the manual section choice here always takes precedence.", a)}</div>
          ${u.length ? p`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", a)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", a)}</label>
                      <select .value=${this.candidateEntityId} @change=${(l) => this.candidateEntityId = l.target.value}>
                        <option value="">${this.l("בחרו...", "Choose...", a)}</option>
                        ${u.map((l) => p`<option value=${l.entity_id}>${this.entityName(l)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", a)}</label>
                      <select .value=${this.candidateSection} @change=${(l) => this.candidateSection = l.target.value}>
                        ${B.map((l) => p`<option value=${l}>${this.sectionDefaultName(l, a)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", a)}
                  </button>
                </div>
              ` : h}
          <div class="entity-list">
            ${b.length ? b.map((l) => {
      const g = e.entity_overrides[l.entityId] ?? {}, v = c.filter((_) => _.section === l.section), k = v.findIndex((_) => _.entityId === l.entityId), d = this.isEntityExcluded(o, l.entityId, e), m = this.isEntityGloballyExcluded(l.entityId, e), y = m ? this.l("מוסתר גלובלית — ניתן לשנות במתקדם", "Globally hidden — change it in Advanced", a) : d ? this.l("החזר רכיב לאזור", "Restore device to area", a) : this.l("הסתר רכיב לחלוטין מהאזור", "Hide device completely from area", a);
      return p`
                    <div class="entity-item ${!d && l.active ? "active" : ""} ${d ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${g.icon ?? l.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${g.name || l.name}</div><div class="meta">${l.entityId}${d ? ` · ${m ? this.l("מוסתר גלובלית", "globally hidden", a) : this.l("מוסר מהאזור", "removed from area", a)}` : ""}</div></div>
                      <button
                        class="visibility-button ${d ? "restore" : ""}"
                        type="button"
                        title=${y}
                        aria-label=${`${y}: ${l.name}`}
                        ?disabled=${m}
                        @click=${() => this.setEntityVisible(o, l.entityId, d)}
                      ><ha-icon icon=${d ? "mdi:restore" : "mdi:eye-off-outline"}></ha-icon></button>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", a)}</label><input type="text" .value=${g.name ?? ""} placeholder=${l.name} @change=${(_) => this.updateEntityOverride(l.entityId, { name: _.target.value || void 0 })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", a)}</label><select .value=${g.section ?? l.section} @change=${(_) => this.updateEntityOverride(l.entityId, { section: _.target.value })}>${B.map((_) => p`<option value=${_}>${this.sectionDefaultName(_, a)}</option>`)}</select></div>
                        <div class="field"><label>${this.l("תת־קבוצה בתוך החדר", "Sub-group inside room", a)}</label><input type="text" .value=${g.group ?? l.group ?? ""} placeholder=${this.l("לדוגמה: מקלחת", "Example: Shower", a)} @change=${(_) => this.updateEntityOverride(l.entityId, { group: _.target.value.trim() || void 0 })} /><div class="hint">${this.l("רכיבים עם אותו שם קבוצה יוצגו יחד בתוך הקטגוריה.", "Devices with the same group name are shown together inside the category.", a)}</div></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", a), g.icon ?? "", l.icon, a, (_) => this.updateEntityOverride(l.entityId, { icon: _ || void 0 }))}
                        ${l.section === "lights_switches" ? p`
                          <div class="field"><label>${this.l("צורת האריח", "Tile shape", a)}</label><select .value=${g.tile_shape ?? ""} @change=${(_) => this.updateEntityOverride(l.entityId, { tile_shape: _.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", a)}</option><option value="rectangle">${this.l("מלבן", "Rectangle", a)}</option><option value="square">${this.l("ריבוע", "Square", a)}</option></select></div>
                          <div class="field"><label>${this.l("מיקום האייקון", "Icon position", a)}</label><select .value=${g.icon_position ?? ""} @change=${(_) => this.updateEntityOverride(l.entityId, { icon_position: _.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", a)}</option><option value="start">${this.l("תחילת השורה לפי השפה", "Language start", a)}</option><option value="right">${this.l("ימין", "Right", a)}</option><option value="left">${this.l("שמאל", "Left", a)}</option><option value="center">${this.l("מרכז", "Center", a)}</option></select></div>
                          <div class="field"><label>${this.l("הצגת מידע", "State information", a)}</label><select .value=${g.show_state === void 0 ? "" : String(g.show_state)} @change=${(_) => {
        const $ = _.target.value;
        this.updateEntityOverride(l.entityId, { show_state: $ === "" ? void 0 : $ === "true" });
      }}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", a)}</option><option value="true">${this.l("הצג", "Show", a)}</option><option value="false">${this.l("הסתר", "Hide", a)}</option></select></div>
                          <div class="field"><label>${this.l("שפת מצב הרכיב", "Device state language", a)}</label><select .value=${g.state_language ?? ""} @change=${(_) => this.updateEntityOverride(l.entityId, { state_language: _.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", a)}</option><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
                        ` : h}
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${g.protected ?? l.protected} @change=${(_) => this.updateEntityOverride(l.entityId, { protected: _.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", a)}</label>
                        <label class="check-label" title=${this.l("הרכיב נשאר גלוי וניתן לשליטה, אך לא ישפיע על צבע החדר, מצב הקומה או תגי הפעולה המהירה.", "The device stays visible and controllable, but does not affect room color, floor state, or quick-action badges.", a)}><input type="checkbox" .checked=${g.ignore_activity ?? l.ignoreActivity ?? !1} @change=${(_) => this.updateEntityOverride(l.entityId, { ignore_activity: _.target.checked })} />${this.l("אל תשפיע על מצב החדר והקומה", "Ignore in room and floor activity", a)}</label>
                        ${this.orderButtons(k, v.length, () => this.moveEntity(o, l.section, l.entityId, -1, v.map((_) => _.entityId)), () => this.moveEntity(o, l.section, l.entityId, 1, v.map((_) => _.entityId)))}
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
          <div class="setting-title">${this.l("ערכת עיצוב", "Design theme", t)}</div>
          <div class="theme-preset-grid" role="radiogroup" aria-label=${this.l("בחירת ערכת עיצוב", "Choose design theme", t)}>
            ${[
      ["classic", this.l("קלאסי", "Classic", t), this.l("המראה המקורי, משתלב עם ערכת Home Assistant", "Original look that follows the Home Assistant theme", t)],
      ["elegant", this.l("אלגנטי · ספיר", "Elegant · Sapphire", t), this.l("כחול מעושן, מתכת עדינה וניגודיות רגועה", "Muted blue, subtle metallic depth, calm contrast", t)],
      ["light", this.l("מואר · שמיים", "Luminous · Sky", t), this.l("לבן נקי, תכלת רך ותחושה אוורירית", "Clean white, soft sky blue, airy finish", t)],
      ["dark", this.l("כהה · חצות", "Dark · Midnight", t), this.l("גרפיט עמוק, טורקיז מרוסן וקריאות גבוהה", "Deep graphite, restrained teal, high readability", t)],
      ["modern", this.l("עכשווי · מרווה", "Modern · Sage", t), this.l("גוונים טבעיים, חמים ומינימליסטיים", "Natural, warm, minimalist tones", t)]
    ].map(([i, a, o]) => {
      const r = { ...q, ...Be[i] };
      return p`<button
                class="theme-preset ${e.theme_preset === i ? "selected" : ""}"
                type="button"
                role="radio"
                aria-checked=${e.theme_preset === i}
                style=${`--theme-card:${r.card_background};--theme-active:${r.active_surface};--theme-control:${r.control_surface};--theme-accent:${r.accent_color};--theme-frame:${r.area_frame_color || "var(--divider-color)"}`}
                @click=${() => this.applyThemePreset(i)}
              ><span class="theme-preset-preview"><span class="theme-preset-swatches"><i></i><i></i><i></i></span></span><span class="theme-preset-copy"><strong>${a}</strong><span>${o}</span></span></button>`;
    })}
          </div>
          <div class="hint">${this.l("בחירת ערכה מחליפה את צבעי הערכה בלבד. לאחר מכן ניתן להתאים כל צבע ידנית.", "Choosing a theme replaces theme colors only; every color can still be fine-tuned below.", t)}</div>
          <div class="inline-fields">
            <div class="field"><label>${this.l("מיקום פעולות מהירות בחדר", "Room quick-actions position", t)}</label><select .value=${e.quick_actions_position} @change=${(i) => this.commitKey("quick_actions_position", i.target.value)}><option value="opposite">${this.l("בצד הנגדי לשם", "Opposite the room name", t)}</option><option value="near_name">${this.l("צמוד לשם החדר", "Next to the room name", t)}</option></select></div>
            <div class="field"><label>${this.l("מיקום תגי מזגן ומאוורר", "Climate and fan tag position", t)}</label><select .value=${e.climate_tag_position} @change=${(i) => this.commitKey("climate_tag_position", i.target.value)}><option value="left">${this.l("משמאל לטמפרטורה", "Left of temperature", t)}</option><option value="right">${this.l("מימין לטמפרטורה", "Right of temperature", t)}</option><option value="top">${this.l("מעל הטמפרטורה", "Above temperature", t)}</option><option value="bottom">${this.l("מתחת לטמפרטורה", "Below temperature", t)}</option></select></div>
            <div class="field"><label>${this.l("שפת מצב דלוק/כבוי", "On/off state language", t)}</label><select .value=${e.entity_state_language} @change=${(i) => this.commitKey("entity_state_language", i.target.value)}><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
            <div class="field"><label>${this.l("צורת אריחי תאורה", "Light tile shape", t)}</label><select .value=${e.light_tile_shape} @change=${(i) => this.commitKey("light_tile_shape", i.target.value)}><option value="rectangle">${this.l("מלבנים", "Rectangles", t)}</option><option value="square">${this.l("ריבועים", "Squares", t)}</option></select></div>
            <div class="field"><label>${this.l("מיקום אייקון תאורה", "Light icon position", t)}</label><select .value=${e.light_icon_position} @change=${(i) => this.commitKey("light_icon_position", i.target.value)}><option value="start">${this.l("תחילת השורה לפי השפה", "Language start", t)}</option><option value="right">${this.l("ימין", "Right", t)}</option><option value="left">${this.l("שמאל", "Left", t)}</option><option value="center">${this.l("מרכז", "Center", t)}</option></select></div>
          </div>
          ${this.booleanRow(this.l("הצג תג מאוורר פעיל", "Show active fan tag", t), this.l("מאוורר נשאר בתוך קטגוריית המיזוג ופותח את אותו חלון שליטה.", "Fans remain in the climate category and open the same control popup.", t), e.show_fan_tag, (i) => this.commitKey("show_fan_tag", i))}
          ${this.booleanRow(this.l("הצג מידע באריחי תאורה", "Show state on light tiles", t), this.l("ניתן לדרוס הגדרה זו לכל רכיב בנפרד.", "Can be overridden for each device.", t), e.light_show_state, (i) => this.commitKey("light_show_state", i))}
          ${this.booleanRow(this.l("קשר צבע מסגרות קטגוריה למסגרת החדר", "Link category frames to room frame", t), this.l("קטגוריה ללא צבע פרטי תקבל גוון בהיר או כהה מצבע מסגרת החדר.", "A category without its own color receives a lighter or darker shade of the room frame.", t), e.style.link_section_frame_color, (i) => this.setStyle("link_section_frame_color", i))}
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
            ${this.numberField(this.l("עובי מסגרת החדר", "Room frame thickness", t), e.style.area_frame_width, 0, 8, (i) => this.setStyle("area_frame_width", i))}
            ${this.numberField(this.l("עובי מסגרת הציוד", "Device frame thickness", t), e.style.entity_frame_width, 0, 6, (i) => this.setStyle("entity_frame_width", i))}
            ${this.numberField(this.l("מרחק תג מהטמפרטורה", "Tag distance from temperature", t), e.style.climate_tag_gap, 0, 20, (i) => this.setStyle("climate_tag_gap", i))}
            ${this.numberField(this.l("הפרש בהירות מסגרת קטגוריה", "Category frame brightness difference", t), e.style.section_frame_brightness, -100, 100, (i) => this.setStyle("section_frame_brightness", i))}
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
            <div class="state-preview-item on" style=${`--preview-surface: ${e.style.active_surface}`}>${this.l("חדר פעיל", "Active room", t)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${e.style.entity_active_surface}`}>${this.l("רכיב דלוק", "Active device", t)}</div>
          </div>
          <div class="inline-fields">
            ${this.colorField(this.l("רקע הכרטיס", "Card background", t), "card_background", e.style.card_background, "#ffffff", t)}
            ${this.colorField(this.l("רקע כבוי", "OFF surface", t), "row_background", e.style.row_background, "#e7e7e7", t)}
            ${this.colorField(this.l("רקע חדר או קומה פעילים", "Active room or floor surface", t), "active_surface", e.style.active_surface, "#aed7db", t)}
            ${this.colorField(this.l("רקע רכיב דלוק", "Active device surface", t), "entity_active_surface", e.style.entity_active_surface, "#aed7db", t)}
            ${this.colorField(this.l("צבע מסגרת החדר", "Room frame color", t), "area_frame_color", e.style.area_frame_color || "var(--divider-color)", "#607086", t)}
            ${this.colorField(this.l("צבע מסגרת הציוד", "Device frame color", t), "entity_frame_color", e.style.entity_frame_color || "var(--divider-color)", "#8a96a8", t)}
            ${this.colorField(this.l("צבע תג פעיל", "Active count badge", t), "active_color", e.style.active_color, "#ffd54f", t)}
            ${this.colorField(this.l("צבע נוכחות פעילה", "Occupied presence color", t), "occupancy_active_color", e.style.occupancy_active_color, "#b8f5c2", t)}
            ${this.colorField(this.l("צבע חדר ריק", "Vacant presence color", t), "occupancy_vacant_color", e.style.occupancy_vacant_color, "#f4f3ec", t)}
            ${this.colorField(this.l("צבע נוכחות לא ידועה", "Unknown presence color", t), "occupancy_unknown_color", e.style.occupancy_unknown_color, "#ffcc80", t)}
            ${this.colorField(this.l("צבע הדגשה", "Accent color", t), "accent_color", e.style.accent_color, "#03a9f4", t)}
            ${this.colorField(this.l("צבע טקסט ראשי", "Primary text color", t), "primary_text_color", e.style.primary_text_color, "#172033", t)}
            ${this.colorField(this.l("צבע טקסט משני", "Secondary text color", t), "secondary_text_color", e.style.secondary_text_color, "#526174", t)}
            ${this.colorField(this.l("טקסט על רקע פעיל", "Text on active surfaces", t), "active_text_color", e.style.active_text_color, "#172033", t)}
            ${this.colorField(this.l("טקסט על כפתורי שליטה", "Text on control pills", t), "control_text_color", e.style.control_text_color, "#f8fafc", t)}
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
    return p`<div class="setting-row"><div class="setting-main"><div class="setting-title">${e}</div>${t ? p`<div class="meta">${t}</div>` : h}</div>${this.switchControl(i, a, e)}</div>`;
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
        <div class="hint">${this.l("החיפוש נמצא בתוך בורר האייקונים.", "Search is built into the icon picker.", a)}</div>
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
      const a = De(this.hass, i.entity_id);
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
      if (De(this.hass, s.entity_id) !== e || t.has(s.entity_id)) continue;
      const c = (n = (r = this.hass) == null ? void 0 : r.entities) == null ? void 0 : n[s.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const u = i.entity_overrides[s.entity_id];
      if (!(u != null && u.section)) continue;
      const b = s.entity_id.split(".")[0] ?? "";
      a.push({
        entity: s,
        entityId: s.entity_id,
        domain: b,
        name: u.name ?? this.entityName(s),
        icon: u.icon ?? String(s.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: u.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(s.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(s.state),
        powered: fi(s, b),
        protected: u.protected === !0,
        ignoreActivity: u.ignore_activity === !0,
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
      if (De(this.hass, o.entity_id) !== e || t.has(o.entity_id) || (s = (n = this.config.entity_overrides) == null ? void 0 : n[o.entity_id]) != null && s.section) return !1;
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
    const i = [...xe(this.config).section_order];
    this.moveValue(i, e, t), this.commitKey("section_order", i);
  }
  toggleQuickAction(e, t) {
    const i = [...xe(this.config).quick_actions], a = t ? [...i.filter((o) => o !== e), e] : i.filter((o) => o !== e);
    this.commitKey("quick_actions", a);
  }
  moveQuickAction(e, t) {
    const i = [...xe(this.config).quick_actions];
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
    const a = this.targetAreas(i), o = this.normalizedParentId(e, i), r = a.filter((f) => this.normalizedParentId(f.id, i) === o).map((f) => f.id), n = r.indexOf(e), s = r[n + t];
    if (n < 0 || !s) return;
    const c = a.map((f) => f.id), u = c.indexOf(e), b = c.indexOf(s);
    [c[u], c[b]] = [c[b], c[u]], this.commitKey("area_order", c);
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
  applyThemePreset(e) {
    const t = { ...this.config.style ?? {} }, i = new Set(
      Object.values(Be).flatMap((a) => Object.keys(a))
    );
    for (const a of i) delete t[a];
    this.commit({
      ...this.config,
      theme_preset: e,
      style: Object.keys(t).length ? t : void 0
    });
  }
  commitKey(e, t) {
    const i = { ...this.config };
    t === "" || t === void 0 ? delete i[e] : i[e] = t, this.commit(i);
  }
  commit(e) {
    this.config = { ...e, type: ne }, this.dispatchEvent(new CustomEvent("config-changed", { bubbles: !0, composed: !0, detail: { config: this.config } }));
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
K.styles = Te`
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
    .theme-preset-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .theme-preset {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      min-height: 74px;
      padding: 10px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 14px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      text-align: start;
      cursor: pointer;
    }
    .theme-preset.selected { border-color: var(--primary-color); box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 18%, transparent); }
    .theme-preset-preview { display: grid; place-items: center; width: 58px; height: 52px; border: 1px solid var(--theme-frame); border-radius: 13px; background: var(--theme-card); box-shadow: 0 6px 14px rgba(0,0,0,0.12); }
    .theme-preset-swatches { display: flex; gap: 4px; }
    .theme-preset-swatches i { display: block; width: 13px; height: 13px; border-radius: 999px; background: var(--theme-active); }
    .theme-preset-swatches i:nth-child(2) { background: var(--theme-control); }
    .theme-preset-swatches i:nth-child(3) { background: var(--theme-accent); }
    .theme-preset-copy { min-width: 0; }
    .theme-preset-copy strong, .theme-preset-copy span { display: block; }
    .theme-preset-copy strong { margin-bottom: 3px; font-size: 13px; }
    .theme-preset-copy span { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
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
      .inline-fields, .entity-toolbar, .entity-fields, .state-preview, .theme-preset-grid { grid-template-columns: 1fr; }
      .icon-picker-row, .color-control { grid-template-columns: auto minmax(0, 1fr); }
      .icon-picker-row .reset-button, .color-control .reset-button { grid-column: 1 / -1; }
      .order-item { grid-template-columns: auto minmax(0, 1fr); }
      .order-controls { grid-column: 1 / -1; }
      .icon-button { flex: 1; width: auto; }
    }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `;
ee([
  Ie({ attribute: !1 })
], K.prototype, "hass", 2);
ee([
  A()
], K.prototype, "config", 2);
ee([
  A()
], K.prototype, "targetMode", 2);
ee([
  A()
], K.prototype, "activeAreaId", 2);
ee([
  A()
], K.prototype, "entitySearch", 2);
ee([
  A()
], K.prototype, "candidateEntityId", 2);
ee([
  A()
], K.prototype, "candidateSection", 2);
K = ee([
  Ke(ii)
], K);
const lo = Te`
  :host {
    display: block;
    container-name: overview-card;
    container-type: inline-size;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    color: var(--aboc-primary-text);
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
    --aboc-entity-active-surface: var(--area-bubble-overview-entity-active-surface, rgba(174, 215, 219, 0.94));
    --aboc-area-frame-width: var(--area-bubble-overview-area-frame-width, 2px);
    --aboc-entity-frame-width: var(--area-bubble-overview-entity-frame-width, 1px);
    --aboc-entity-frame-color: var(
      --area-bubble-overview-entity-frame-color,
      color-mix(in srgb, var(--aboc-area-frame-color) 44%, var(--divider-color))
    );
    --aboc-climate-surface: var(--area-bubble-overview-climate-surface, rgba(139, 181, 255, 0.94));
    --aboc-control-surface: var(--area-bubble-overview-control-surface, rgba(11, 28, 58, 0.94));
    --aboc-climate: var(--area-bubble-overview-climate-color, var(--state-climate-cool-color, #2196f3));
    --aboc-cover: var(--area-bubble-overview-cover-color, var(--state-cover-active-color, #00bcd4));
    --aboc-media: var(--area-bubble-overview-media-color, var(--state-media-player-active-color, #9c27b0));
    --aboc-temperature-off: var(--area-bubble-overview-temperature-off-surface, rgba(11, 28, 58, 0.94));
    --aboc-temperature-cool: var(--area-bubble-overview-temperature-cool-surface, rgba(34, 113, 196, 0.96));
    --aboc-temperature-heat: var(--area-bubble-overview-temperature-heat-surface, rgba(198, 83, 47, 0.96));
    --aboc-temperature-active: var(--area-bubble-overview-temperature-active-surface, rgba(91, 86, 168, 0.96));
    --aboc-occupancy-active: var(--area-bubble-overview-occupancy-active-color, #b8f5c2);
    --aboc-occupancy-vacant: var(--area-bubble-overview-occupancy-vacant-color, #f4f3ec);
    --aboc-occupancy-unknown: var(--area-bubble-overview-occupancy-unknown-color, #ffcc80);
    --aboc-row-bg: var(
      --area-bubble-overview-row-bg,
      color-mix(in srgb, var(--secondary-background-color) 78%, transparent)
    );
    --aboc-card-bg: var(--area-bubble-overview-card-bg, transparent);
    --aboc-card-border: var(--area-bubble-overview-card-border, transparent);
    --aboc-shadow: var(--area-bubble-overview-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
    --aboc-primary-text: var(--area-bubble-overview-primary-text, var(--primary-text-color));
    --aboc-secondary-text: var(--area-bubble-overview-secondary-text, var(--secondary-text-color));
    --aboc-dark-text: var(--area-bubble-overview-active-text, #111827);
    --aboc-light-text: var(--area-bubble-overview-control-text, #f4f3ec);
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
    color: var(--aboc-primary-text);
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

  .floor-toggle.without-floor-expand-button {
    grid-template-columns: auto minmax(0, 1fr);
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
    background: color-mix(in srgb, var(--aboc-primary-text) 8%, transparent);
    transition: transform 160ms ease;
  }

  .floor-chevron.expanded {
    transform: rotate(180deg);
  }

  .floor-active-badge,
  .floor-climate-badge {
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

  .floor-active-badge ha-icon,
  .floor-climate-badge ha-icon {
    --mdc-icon-size: 19px;
  }

  .floor-climate-badge {
    background: var(--aboc-temperature-active);
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
    color: var(--aboc-secondary-text);
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
    --aboc-area-frame-color: var(
      --area-bubble-overview-area-frame-color,
      color-mix(in srgb, var(--divider-color, rgba(127, 127, 127, 0.45)) 72%, transparent)
    );
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .area-panel.expanded {
    overflow: hidden;
    border: var(--aboc-area-frame-width) solid var(--aboc-area-frame-color);
    border-radius: calc(var(--aboc-radius) + 4px);
    background: var(--aboc-row-bg);
  }

  .area-panel.has-active {
    --aboc-area-frame-color: var(
      --area-bubble-overview-area-frame-color,
      color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color, rgba(127, 127, 127, 0.45)))
    );
  }

  .area-panel.expanded.has-active {
    background: var(--aboc-active-surface);
  }

  .area-panel.expanded > .area-summary {
    width: calc(100% + var(--aboc-area-frame-width) + var(--aboc-area-frame-width));
    margin-block: calc(0px - var(--aboc-area-frame-width)) 0;
    margin-inline: calc(0px - var(--aboc-area-frame-width));
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
    border: var(--aboc-area-frame-width) solid var(--aboc-area-frame-color);
    overflow: hidden;
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--aboc-primary-text);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
    cursor: pointer;
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

  .area-summary-pill.has-statuses .area-toggle {
    min-width: 72px;
    max-width: min(42%, 168px);
    flex: 0 1 auto;
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
    justify-content: flex-start;
    gap: 5px;
    min-width: 0;
    flex: 1 1 0;
    overflow: hidden;
  }

  .area-summary-pill.quick-actions-opposite .area-statuses {
    justify-content: flex-end;
  }

  .area-summary-pill.quick-actions-near_name .area-statuses {
    justify-content: flex-start;
  }

  .area-summary-pill.climate-tag-top,
  .area-summary-pill.climate-tag-bottom {
    min-height: 86px;
    border-radius: calc(var(--aboc-radius) - 4px);
  }

  .area-summary-pill.climate-tag-top .area-statuses,
  .area-summary-pill.climate-tag-bottom .area-statuses {
    min-height: 72px;
    overflow-y: visible;
  }

  .expand-button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-primary-text) 8%, transparent);
    color: var(--aboc-primary-text);
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
    background: color-mix(in srgb, var(--aboc-primary-text) 9%, transparent);
    color: var(--aboc-accent);
  }

  .area-panel.has-active > .area-summary .area-icon {
    background: color-mix(in srgb, var(--aboc-control-surface) 72%, transparent);
    color: var(--aboc-light-text);
  }

  .area-panel.all-off > .area-summary .area-icon {
    background: color-mix(in srgb, var(--aboc-primary-text) 9%, transparent);
    color: var(--aboc-secondary-text);
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
    color: var(--aboc-occupancy-active);
  }

  .summary-chip.occupancy {
    grid-template-columns: auto auto;
    width: auto;
    min-width: 44px;
    padding-inline: 9px;
    font-variant-numeric: tabular-nums;
  }

  .summary-chip.occupancy.vacant {
    color: var(--aboc-occupancy-vacant);
  }

  .summary-chip.occupancy.unknown {
    color: var(--aboc-occupancy-unknown);
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
    color: var(--aboc-primary-text);
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

  .area-detail-popup {
    grid-template-rows: auto minmax(0, 1fr);
  }

  .area-detail-dialog.has-active .area-detail-popup {
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .area-detail-dialog.all-off .area-detail-popup {
    background: var(--aboc-row-bg);
  }

  .area-detail-content {
    display: grid;
    align-content: start;
    gap: var(--aboc-section-gap);
    min-height: 0;
    padding: 12px 12px max(16px, env(safe-area-inset-bottom));
    overflow: auto;
    overscroll-behavior: contain;
  }

  .area-detail-header {
    background: color-mix(in srgb, currentColor 4%, transparent);
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
    color: var(--aboc-secondary-text);
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
    background: color-mix(in srgb, var(--aboc-primary-text) 9%, transparent);
    color: var(--aboc-primary-text);
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
    background: var(--aboc-entity-active-surface);
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

  .temperature-summary {
    direction: ltr;
    display: inline-flex;
    align-items: center;
    gap: var(--aboc-temperature-tag-gap, 0px);
    min-width: max-content;
    flex: 0 0 auto;
  }

  .temperature-summary.tag-position-left { flex-direction: row-reverse; }
  .temperature-summary.tag-position-right { flex-direction: row; }
  .temperature-summary.tag-position-top { flex-direction: column-reverse; }
  .temperature-summary.tag-position-bottom { flex-direction: column; }

  .temperature-tags {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .temperature-status-tag {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-inline-start: 0;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-temperature-active);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .temperature-status-tag::before {
    content: "";
    position: absolute;
    inset: -9px;
    border-radius: inherit;
  }

  .temperature-status-tag ha-icon {
    --mdc-icon-size: 15px;
  }

  .temperature-status-tag.temperature-off {
    background: var(--aboc-temperature-off);
  }

  .temperature-status-tag.temperature-cool {
    background: var(--aboc-temperature-cool);
  }

  .temperature-status-tag.temperature-heat {
    background: var(--aboc-temperature-heat);
  }

  .temperature-status-tag.temperature-fan-tag {
    background: var(--aboc-entity-active-surface);
    color: var(--aboc-dark-text);
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
    padding: 9px 9px 10px;
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
    border-width: var(--aboc-section-border-width, 1px);
    border-style: var(--aboc-section-border-style, solid);
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
    color: var(--aboc-secondary-text);
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

  .section-on-button.presentation-text,
  .section-off-button.presentation-text,
  .section-toggle-button.presentation-text,
  .section-on-button.presentation-both,
  .section-off-button.presentation-both,
  .section-toggle-button.presentation-both {
    display: inline-flex;
    width: auto;
    min-width: var(--aboc-section-action-size);
    flex-basis: auto;
    gap: 6px;
    padding-inline: 12px;
  }

  .section-action-label {
    font-size: 12px;
    font-weight: 760;
    line-height: 1;
    white-space: nowrap;
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
  .section-floor_heating .section-entities,
  .section-covers .section-entities {
    grid-template-columns: repeat(var(--aboc-section-columns, 2), minmax(0, 1fr));
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
    color: var(--aboc-secondary-text);
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
    border: var(--aboc-entity-frame-width) solid var(--aboc-entity-frame-color);
    border-radius: calc(var(--aboc-radius) - 2px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.055), transparent),
      var(--aboc-row-bg);
    color: var(--aboc-primary-text);
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
    min-height: var(--aboc-section-entity-height, max(56px, var(--aboc-row-height)));
    padding: 4px 9px;
    text-align: start;
    cursor: pointer;
    transition: transform 120ms ease, background-color 140ms ease, color 140ms ease;
  }

  .toggle-tile.tile-icon-start {
    direction: var(--aboc-direction, ltr);
  }

  .toggle-tile.tile-icon-right {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .toggle-tile.tile-icon-right > .icon-bubble {
    grid-column: 2;
    grid-row: 1;
  }

  .toggle-tile.tile-icon-right > .entity-main {
    grid-column: 1;
    grid-row: 1;
  }

  .toggle-tile.tile-icon-center {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    align-content: center;
    text-align: center;
  }

  .toggle-tile.tile-icon-center > .entity-main {
    text-align: center;
  }

  .toggle-tile.tile-shape-square {
    aspect-ratio: 1;
    min-height: 0;
    align-content: center;
  }

  .toggle-tile.compact-auxiliary {
    min-height: min(56px, var(--aboc-section-entity-height, 56px));
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
    background: var(--aboc-entity-active-surface);
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
    min-height: var(--aboc-section-entity-height, 108px);
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

  .climate-mode-control {
    position: relative;
    min-width: 0;
  }

  .climate-mode-value {
    position: absolute;
    inset-block-start: 50%;
    inset-inline: 42px 30px;
    overflow: hidden;
    color: var(--aboc-primary-text);
    font-size: 12px;
    font-weight: 720;
    line-height: 1;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    transform: translateY(-50%);
  }

  .climate-card.active .climate-mode-value {
    color: var(--aboc-dark-text);
  }

  .climate-mode-control.presentation-text .climate-mode-value {
    inset-inline-start: 12px;
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
    min-height: max(92px, var(--aboc-section-entity-height, var(--aboc-row-height)));
    padding: 8px 10px;
  }

  .section-lights_switches .light-card {
    grid-column: 1 / -1;
  }

  .light-card.tile-icon-left .entity-lead,
  .light-card.tile-icon-right .entity-lead {
    direction: ltr;
  }

  .light-card.tile-icon-right .entity-lead {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .light-card.tile-icon-right .entity-lead .icon-bubble {
    grid-column: 2;
    grid-row: 1;
  }

  .light-card.tile-icon-right .entity-lead .entity-main {
    grid-column: 1;
    grid-row: 1;
  }

  .light-card.tile-icon-center .entity-lead {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .light-card.tile-icon-center .entity-lead .entity-main {
    text-align: center;
  }

  .light-card.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 62%, transparent);
    background: var(--aboc-entity-active-surface);
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
    background: color-mix(in srgb, var(--aboc-entity-active-surface) 74%, var(--aboc-row-bg));
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
    min-height: var(--aboc-section-entity-height, max(56px, var(--aboc-row-height)));
    padding: 4px 8px;
  }

  .cover-card.active {
    border-color: color-mix(in srgb, var(--aboc-cover) 42%, var(--divider-color));
  }

  .section-covers.columns-2 .cover-card {
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    gap: 2px;
    min-height: max(92px, var(--aboc-section-entity-height, 92px));
  }

  .section-covers.columns-2 .cover-controls {
    justify-content: center;
  }

  .section-lights_switches.columns-3 .toggle-tile {
    gap: 5px;
    padding-inline: 6px;
  }

  .section-lights_switches.columns-3 .entity-name {
    font-size: 13px;
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
    color: var(--aboc-primary-text);
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
  .floor-climate-badge:hover:not([disabled]),
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
  .floor-climate-badge:active:not([disabled]),
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
    color: var(--aboc-secondary-text);
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
    color: var(--aboc-secondary-text);
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

    .area-summary-pill.has-statuses .area-toggle,
    .area-summary-pill.has-statuses.compact-statuses .area-toggle {
      min-width: 68px;
      max-width: 96px;
      flex: 0 1 auto;
      gap: 5px;
    }

    .area-summary-pill.no-statuses .area-toggle {
      max-width: none;
      flex: 1 1 auto;
    }

    .area-statuses {
      gap: 3px;
      max-width: none;
      flex: 1 1 0;
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
      gap: 3px;
    }

    .area-summary-pill.compact-statuses .quick-action {
      width: min(var(--aboc-quick-action-size), 34px);
      height: min(var(--aboc-quick-action-size), 34px);
      flex-basis: min(var(--aboc-quick-action-size), 34px);
    }

    .area-summary-pill.compact-statuses .quick-action ha-icon {
      --mdc-icon-size: min(var(--aboc-quick-action-icon-size), 18px);
    }

    .area-summary-pill.compact-statuses .quick-action::before {
      inset: 0;
    }

    .area-summary-pill.compact-statuses .occupancy {
      min-width: 42px;
      width: auto;
      height: 38px;
      padding-inline: 4px;
      gap: 2px;
    }

    .area-summary-pill.compact-statuses .occupancy ha-icon {
      --mdc-icon-size: 18px;
    }

    .area-summary-pill.compact-statuses .occupancy-count {
      font-size: 12px;
    }

    .area-summary-pill.compact-statuses .temperature-status-tag {
      width: 22px;
      height: 22px;
      margin-inline-start: 0;
    }

    .area-summary-pill.compact-statuses .temperature-status-tag ha-icon {
      --mdc-icon-size: 13px;
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
      padding-inline: 7px;
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
    .floor-summary-pill {
      gap: 4px;
      padding: 4px;
    }

    .floor-toggle {
      grid-template-columns: 34px minmax(0, 1fr) 34px;
      gap: 4px;
      min-height: 52px;
      padding: 0;
    }

    .floor-toggle .icon-bubble.small,
    .floor-chevron {
      width: 34px;
      height: 34px;
    }

    .floor-toggle .icon-bubble ha-icon,
    .floor-chevron ha-icon {
      --mdc-icon-size: 21px;
    }

    .floor-title {
      font-size: 16px;
    }

    .floor-toggle .subtitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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
      gap: 4px;
    }

    .area-summary-pill.has-statuses .area-toggle {
      min-width: 64px;
      max-width: 82px;
      flex: 0 1 auto;
    }

    .area-summary-pill.no-statuses .area-toggle {
      min-width: 112px;
      max-width: none;
      flex: 1 1 auto;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill.compact-statuses .area-icon {
      width: 36px;
      height: 36px;
    }

    .area-summary-pill .occupancy,
    .area-summary-pill.compact-statuses .occupancy {
      min-width: 34px;
      width: auto;
      height: 36px;
      min-height: 36px;
      flex-basis: auto;
      padding-inline: 2px;
      gap: 1px;
    }

    .area-summary-pill .occupancy ha-icon {
      --mdc-icon-size: 16px;
    }

    .area-summary-pill .occupancy-count {
      font-size: 10px;
    }

    .area-summary-pill .area-temperature,
    .area-summary-pill.compact-statuses .area-temperature {
      padding-inline: 4px;
      font-size: 11px;
    }

    .area-summary-pill.compact-statuses .quick-action {
      width: min(var(--aboc-quick-action-size), 30px);
      height: min(var(--aboc-quick-action-size), 30px);
      flex-basis: min(var(--aboc-quick-action-size), 30px);
    }

    .area-summary-pill.compact-statuses .quick-action ha-icon {
      --mdc-icon-size: min(var(--aboc-quick-action-icon-size), 16px);
    }

    .area-summary-pill.compact-statuses .temperature-status-tag {
      width: 18px;
      height: 18px;
    }

    .area-summary-pill.compact-statuses .temperature-status-tag ha-icon {
      --mdc-icon-size: 11px;
    }

    .area-statuses {
      display: flex;
      min-width: 0;
      max-width: none;
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

    .area-summary.without-expand-button .area-summary-pill.has-statuses .area-toggle {
      min-width: 64px;
      max-width: 82px;
      flex: 0 1 auto;
    }

    .area-summary.without-expand-button .area-statuses {
      max-width: none;
      flex: 1 1 0;
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
    .media-card {
      grid-template-columns: minmax(0, 1fr);
    }

    .thermostat-primary .temperature-stepper {
      width: 100%;
    }

    .media-controls {
      justify-content: stretch;
    }

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

    .area-detail-content {
      padding: 10px 8px max(14px, env(safe-area-inset-bottom));
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
var po = Object.defineProperty, uo = Object.getOwnPropertyDescriptor, N = (e, t, i, a) => {
  for (var o = a > 1 ? void 0 : a ? uo(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (a ? n(t, i, o) : n(o)) || o);
  return a && o && po(t, i, o), o;
};
const T = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, Ne = "__overview_floor__";
let I = class extends Z {
  constructor() {
    super(...arguments), this.expanded = {}, this.floorExpanded = !0, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingSections = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.floorPopupOpen = !1, this.pendingFloor = !1, this.pendingFloorRooms = /* @__PURE__ */ new Set(), this.storageId = "overview", this.suppressClickUntil = 0, this.restoreQuickPopupFocus = !0, this.restoreAreaPopupFocus = !0;
  }
  connectedCallback() {
    super.connectedCallback(), this.durationTimer ?? (this.durationTimer = window.setInterval(() => this.requestUpdate(), 6e4));
  }
  static getConfigElement() {
    return document.createElement(ii);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    this.resetQuickPopup(), this.resetFloorPopup(), this.resetAreaPopup();
    try {
      La(e), this.config = xe(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.floorExpanded = this.config.remember_expanded_state ? this.readFloorExpanded() ?? this.config.floor_default_expanded : this.config.floor_default_expanded, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = Ve(this.hass, this.config);
    if (e.targetKind === "floor" && this.config.show_header && this.config.show_floor_header && !this.floorExpanded) return 2;
    const t = no(e.areas, (i) => this.isExpanded(i));
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
    super.disconnectedCallback(), this.cancelHold(), this.resetQuickPopup(), this.resetFloorPopup(), this.resetAreaPopup(), this.durationTimer !== void 0 && window.clearInterval(this.durationTimer), this.durationTimer = void 0;
  }
  render() {
    if (this.error) return p`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return h;
    const e = Ba(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = Ve(this.hass, this.config), i = `overview-floor-${this.storageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`, a = t.targetKind === "floor" && this.config.show_header && this.config.show_floor_header;
    return p`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t, i)}
          ${t.targetKind === "none" ? this.renderEmpty(F(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : p`
                <div id=${i} ?hidden=${a && !this.floorExpanded}>
                  ${t.areas.length ? this.renderAreaHierarchy(t.areas) : this.renderEmpty(F(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
                </div>
              `}
          ${t.warnings.length && t.targetKind !== "none" ? p`<div class="warning">${t.warnings.join(" · ")}</div>` : h}
          ${this.config.debug ? p`<pre class="debug">${JSON.stringify(t, null, 2)}</pre>` : h}
        </div>
      </ha-card>
      ${this.renderQuickActionPopup(t)}
      ${this.renderFloorPopup(t)}
      ${this.renderAreaPopup(t)}
    `;
  }
  renderOverallHeader(e, t) {
    var a, o;
    if (!((a = this.config) != null && a.show_header) || !(e.targetKind === "floor" ? this.config.show_floor_header : !!this.config.title) || !e.targetName) return h;
    if (e.targetKind === "floor") {
      const r = e.areas.filter((l) => l.allEntities.some(ye)), n = this.floorQuickArea(e), s = Se(n, "climate").filter((l) => l.powered && l.ignoreActivity !== !0), c = this.quickActionPending(Ne, "climate") || s.some((l) => this.pendingEntities.has(l.entityId)), u = e.areas.filter((l) => l.occupancy === "occupied").length, b = [
        `${e.areas.length} ${this.localText("אזורים", "areas")}`,
        r.length ? `${r.length} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && u ? `${u} ${this.localText("מאוכלסים", "occupied")}` : ""
      ].filter(Boolean).join(" · "), f = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${e.targetName}`;
      return p`
        <div class="overview-heading floor-heading ${r.length ? "has-active" : "all-off"}" data-powered=${r.length ? "true" : "false"}>
          <div class="floor-summary-pill">
            <button class="floor-toggle ${this.config.show_floor_expand_button ? "" : "without-floor-expand-button"}" type="button" aria-expanded=${this.floorExpanded} aria-controls=${t} aria-label=${f} @click=${() => this.toggleFloor()}>
              <span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span>
              <span class="heading-main"><span class="floor-title">${e.targetName}</span><span class="subtitle">${b}</span></span>
              ${this.config.show_floor_expand_button ? p`<span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>` : h}
            </button>
            ${s.length ? p`<button
                  class="floor-climate-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${((o = this.quickPopup) == null ? void 0 : o.areaId) === Ne && this.quickPopup.action === "climate"}
                  aria-busy=${c}
                  aria-label=${`${this.localText("פתיחת המזגנים הפעילים בקומה", "Open active floor climate controls")}: ${s.length}`}
                  ?disabled=${c}
                  @click=${(l) => this.openQuickActionPopup(l, n, "climate")}
                ><ha-icon icon=${this.config.quick_action_icons.climate}></ha-icon><span>${s.length}</span></button>` : h}
            ${r.length ? p`<button
                  class="floor-active-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${this.floorPopupOpen}
                  aria-label=${`${this.localText("פתיחת חדרים פעילים", "Open active rooms")}: ${r.length}`}
                  @click=${(l) => this.openFloorPopup(l)}
                ><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><span>${r.length}</span></button>` : h}
          </div>
        </div>
      `;
    }
    return p`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span><div class="heading-main"><h2>${e.targetName}</h2></div></div>`;
  }
  renderAreaHierarchy(e) {
    const { roots: t, children: i } = gi(e), a = /* @__PURE__ */ new Set(), o = (r) => {
      if (a.has(r.id)) return h;
      a.add(r.id);
      const n = i.get(r.id) ?? [], c = this.isExpanded(r) ? n : n.filter((b) => b.showWhenParentCollapsed), u = c.length ? p`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${r.name}`}>${c.map(o)}</div>` : h;
      return p`
        <div class="area-tree-node">
          ${this.renderArea(r, u)}
        </div>
      `;
    };
    return p`<div class="areas">${t.map(o)}</div>`;
  }
  renderArea(e, t = h) {
    if (!this.config) return h;
    const a = this.areaOpenMode(e) === "popup", o = a && this.areaPopupId === e.id, r = !a && this.isExpanded(e), n = e.allEntities.filter(ye).length, s = this.config.show_quick_actions ? Ia(e, this.config.quick_actions) : [], c = this.config.show_occupancy && e.occupancy !== "none", u = this.config.show_temperature && e.temperature !== void 0, b = u ? s.find(({ action: w }) => w === "climate") : void 0, f = b ? s.filter(({ action: w }) => w !== "climate") : s, l = (b == null ? void 0 : b.entities.filter((w) => w.domain === "climate" && w.powered && w.ignoreActivity !== !0).length) ?? 0, g = (b == null ? void 0 : b.entities.filter((w) => w.domain === "fan" && w.powered && w.ignoreActivity !== !0).length) ?? 0, v = (b == null ? void 0 : b.entities.filter((w) => w.domain === "climate").length) ?? 0, k = (b == null ? void 0 : b.entities.filter((w) => w.domain === "fan").length) ?? 0, d = c || f.length > 0 || u, m = u ? this.formatTemperature(e.temperature, e.temperatureUnit) : "", y = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active")
    }[e.temperatureMode], _ = Math.min(8, f.length + Number(c) + Number(u) * 2), $ = _ >= 5, x = e.id.replace(/[^a-zA-Z0-9_-]/g, "-"), P = `overview-area-${x}`, S = `overview-area-popup-${x}`, O = `overview-area-name-${x}`, E = a ? `${this.localText("פתיחת חדר בחלון", "Open room in dialog")}: ${e.name}` : `${F(this.hass, this.config, r ? "collapse" : "expand")}: ${e.name}`;
    return p`
      <section
        class="area-panel ${n ? "has-active" : "all-off"} ${r ? "expanded" : ""}"
        data-powered=${n ? "true" : "false"}
        aria-labelledby=${O}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div
            class="area-summary-pill quick-actions-${this.config.quick_actions_position} climate-tag-${this.config.climate_tag_position} summary-load-${_} ${$ ? "compact-statuses" : ""} ${d ? "has-statuses" : "no-statuses"}"
            tabindex="-1"
            @click=${(w) => this.handleAreaSummaryClick(w, e)}
          >
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${a ? o : r}
              aria-haspopup=${a ? "dialog" : h}
              aria-controls=${a ? S : P}
              aria-label=${E}
              @click=${(w) => this.activateArea(w, e)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name" id=${O}>${e.name}</span>
                ${n ? p`<span class="active-summary">${n} ${this.localText("פעילים", "active")}</span>` : h}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(e)}
              ${f.length ? this.renderQuickActions(e, f) : h}
              ${u || b ? p`<span
                    class="temperature-summary tag-position-${this.config.climate_tag_position}"
                    style=${`--aboc-temperature-tag-gap:${this.config.style.climate_tag_gap}px`}
                  >
                    ${u ? p`<span class="temperature area-temperature temperature-${e.temperatureMode}" title=${`${m} · ${y}`} aria-label=${`${m} · ${y}`}>${m}</span>` : h}
                    <span class="temperature-tags">
                      ${b && l > 0 ? this.renderTemperatureStatusTag(e, this.config.quick_action_icons.climate, l, v, "climate") : h}
                      ${b && this.config.show_fan_tag && g > 0 ? this.renderTemperatureStatusTag(e, "mdi:fan", g, k, "fan") : h}
                    </span>
                  </span>` : h}
            </div>
          </div>
          ${this.config.show_area_expand_button ? p`<button
                class="expand-button"
                type="button"
                aria-expanded=${a ? o : r}
                aria-haspopup=${a ? "dialog" : h}
                aria-controls=${a ? S : P}
                aria-label=${E}
                @click=${(w) => this.activateArea(w, e)}
              ><span class="chevron ${a ? "popup-mode" : ""}" aria-hidden="true"><ha-icon icon=${a ? "mdi:open-in-new" : "mdi:chevron-down"}></ha-icon></span></button>` : h}
        </header>
        <div class="area-disclosure" id=${P} ?hidden=${!r}>
          <div class="expanded-content">${e.sections.map((w) => this.renderSection(w, e))}</div>
          ${r ? t : h}
        </div>
        ${r ? h : t}
      </section>
    `;
  }
  renderTemperatureStatusTag(e, t, i, a, o) {
    var s;
    if (!this.config) return h;
    const r = this.quickActionPending(e.id, "climate"), n = o === "fan" ? this.localText("מאוורר פעיל", "Active fan") : this.localText("מיזוג אוויר פעיל", "Active climate");
    return p`<button
      class="temperature-status-tag temperature-${o}-tag temperature-${e.temperatureMode}"
      type="button"
      title=${`${n}: ${i}/${a}`}
      aria-label=${`${this.localText("פתיחת מיזוג אוויר", "Open climate controls")}: ${e.name} · ${n} (${i}/${a})`}
      aria-haspopup="dialog"
      aria-expanded=${((s = this.quickPopup) == null ? void 0 : s.areaId) === e.id && this.quickPopup.action === "climate"}
      aria-busy=${r}
      ?disabled=${r}
      @click=${(c) => this.openQuickActionPopup(c, e, "climate")}
    ><ha-icon icon=${t}></ha-icon></button>`;
  }
  renderOccupancy(e) {
    var n;
    if (!((n = this.config) != null && n.show_occupancy) || e.occupancy === "none") return h;
    const t = e.occupancy === "occupied", i = e.occupancyCount === void 0 ? "?" : e.occupancyCount > 9 ? "9+" : String(e.occupancyCount), a = t ? "mdi:account-multiple" : e.occupancy === "vacant" ? "mdi:account-multiple-outline" : "mdi:account-question-outline", o = F(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown"), r = e.occupancyCount === void 0 ? o : e.occupancyCountSource === "entity" ? `${e.name}: ${e.occupancyCount} ${this.localText("נוכחים", "occupants")}` : `${e.name}: ${e.occupancyCount} ${this.localText("חיישני נוכחות פעילים", "active presence sensors")}`;
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
      const o = a.filter((b) => b.powered).length, r = this.quickActionPending(e.id, i) || a.some((b) => this.pendingEntities.has(b.entityId)), n = jt(this.hass, this.config, i), s = `${this.localText("פתיחת", "Open")} ${n}: ${e.name} (${o}/${a.length})`, c = ((u = this.quickPopup) == null ? void 0 : u.areaId) === e.id && this.quickPopup.action === i;
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
              @click=${(b) => this.openQuickActionPopup(b, e, i)}
            >
              <ha-icon icon=${r ? "mdi:loading" : this.config.quick_action_icons[i]}></ha-icon>
              ${o ? p`<span class="count-badge">${o}</span>` : h}
            </button>
          `;
    })}
      </div>
    ` : h;
  }
  renderSection(e, t) {
    var de, ze, vt, _t, yt, xt, $t, wt;
    const i = t.id, a = `overview-section-${e.id}-${i.replace(/[^a-zA-Z0-9_-]/g, "-")}`, o = et(e, !0), r = et(e, !1), n = this.pendingSections.has(`${i}:${e.id}:on`), s = this.pendingSections.has(`${i}:${e.id}:off`), c = n || s || e.entities.some((te) => this.pendingEntities.has(te.entityId)), u = e.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on"), b = e.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off"), f = `${u}: ${e.title} (${o.length})`, l = `${b}: ${e.title} (${r.length})`, g = ((de = this.config) == null ? void 0 : de.area_overrides[t.id]) ?? ((ze = this.config) == null ? void 0 : ze.area_overrides[t.name]), v = { ...((vt = this.config) == null ? void 0 : vt.section_styles[e.id]) ?? {}, ...((_t = g == null ? void 0 : g.section_styles) == null ? void 0 : _t[e.id]) ?? {} }, k = ((yt = this.config) == null ? void 0 : yt.style.section_frame_brightness) ?? 12, m = `color-mix(in srgb, var(--aboc-area-frame-color) ${Math.max(0, 100 - Math.abs(k))}%, ${k >= 0 ? "white" : "black"})`, y = (xt = this.config) != null && xt.style.link_section_frame_color ? m : "color-mix(in srgb, var(--divider-color) 58%, transparent)", _ = v.columns ?? (e.id === "lights_switches" || e.id === "floor_heating" ? 2 : 1), $ = e.id === "covers" ? Math.min(2, _) : _, x = e.id === "climate" ? 108 : e.id === "floor_heating" ? 92 : 56, P = v.entity_height ?? x, S = v.action_presentation ?? (($t = this.config) == null ? void 0 : $t.section_action_presentation) ?? "icon", O = [
      `--aboc-section-background:${v.background || "transparent"}`,
      `--aboc-section-border-color:${v.border_color || y}`,
      `--aboc-section-border-width:${v.border_width ?? 1}px`,
      `--aboc-section-border-style:${v.border_style ?? "solid"}`,
      `--aboc-section-columns:${$}`,
      `--aboc-section-entity-height:${P}px`
    ].join(";"), E = r.length === 0, w = E ? o : r, V = E ? n : s, le = E ? f : l;
    return p`
      <section class="device-section section-${e.id} columns-${$} ${v.show_border ? "section-framed" : ""}" style=${O} aria-labelledby=${a}>
        <h3 class="section-heading" id=${a}>
          <span class="section-heading-main"><ha-icon icon=${e.icon}></ha-icon><span class="section-title" title=${e.title}>${e.title}</span><span class="section-count">${e.activeCount}/${e.entities.length}</span></span>
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${e.title}`}>
            ${((wt = this.config) == null ? void 0 : wt.section_action_mode) === "toggle" ? p`<button
                  class="section-toggle-button presentation-${S} ${E ? "turn-on" : "turn-off"}"
                  type="button"
                  title=${le}
                  aria-label=${le}
                  aria-busy=${V}
                  ?disabled=${c || w.length === 0}
                  @click=${(te) => this.handleSectionAction(te, e, i, E)}
                >${this.renderSectionActionContent(e.id, E, V, S)}</button>` : p`
                  <button
                    class="section-on-button presentation-${S}"
                    type="button"
                    title=${f}
                    aria-label=${f}
                    aria-busy=${n}
                    ?disabled=${c || o.length === 0}
                    @click=${(te) => this.handleSectionAction(te, e, i, !0)}
                  >${this.renderSectionActionContent(e.id, !0, n, S)}</button>
                  <button
                    class="section-off-button presentation-${S}"
                    type="button"
                    title=${l}
                    aria-label=${l}
                    aria-busy=${s}
                    ?disabled=${c || r.length === 0}
                    @click=${(te) => this.handleSectionAction(te, e, i, !1)}
                  >${this.renderSectionActionContent(e.id, !1, s, S)}</button>
                `}
          </span>
        </h3>
        ${this.renderSectionEntities(e)}
      </section>
    `;
  }
  renderSectionEntities(e) {
    if (!e.entities.length)
      return p`<div class="section-entities"><div class="secondary section-empty">${this.config && W(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div></div>`;
    const t = e.entities.filter((a) => !a.group), i = /* @__PURE__ */ new Map();
    for (const a of e.entities) {
      if (!a.group) continue;
      const o = i.get(a.group) ?? [];
      o.push(a), i.set(a.group, o);
    }
    return p`
      ${t.length ? p`<div class="section-entities">${t.map((a) => this.renderEntity(a, e.id))}</div>` : h}
      ${[...i.entries()].map(([a, o]) => {
      const r = this.subgroupTitle(a);
      return p`
          <section class="entity-subgroup" aria-label=${r}>
            <div class="entity-subgroup-heading"><ha-icon icon=${this.subgroupIcon(a)}></ha-icon><span>${r}</span><small>${o.filter((n) => n.powered).length}/${o.length}</small></div>
            <div class="section-entities">${o.map((n) => this.renderEntity(n, e.id))}</div>
          </section>
        `;
    })}
    `;
  }
  subgroupTitle(e) {
    return e === nt ? this.localText("מאווררים", "Fans") : e === st ? this.localText("בקרי חימום", "Heating controls") : e;
  }
  subgroupIcon(e) {
    return e === nt ? "mdi:fan" : e === st ? "mdi:radiator" : "mdi:folder-home-outline";
  }
  sectionActionIcon(e, t) {
    return this.config ? e === "covers" ? t ? this.config.section_action_icons.open : this.config.section_action_icons.close : t ? this.config.section_action_icons.on : this.config.section_action_icons.off : t ? "mdi:play-circle-outline" : "mdi:stop-circle-outline";
  }
  renderSectionActionContent(e, t, i, a) {
    const o = i ? "mdi:loading" : this.sectionActionIcon(e, t), r = e === "covers" ? t ? this.localText("פתח", "Open") : this.localText("סגור", "Close") : t ? this.localText("הדלק", "On") : this.localText("כבה", "Off");
    return p`
      ${a !== "text" ? p`<ha-icon icon=${o}></ha-icon>` : h}
      ${a !== "icon" ? p`<span class="section-action-label">${i ? this.localText("מבצע…", "Working…") : r}</span>` : h}
    `;
  }
  renderQuickActionPopup(e) {
    if (!this.config || !this.quickPopup) return h;
    const t = this.quickPopup.areaId === Ne && e.targetKind === "floor" ? this.floorQuickArea(e) : e.areas.find((m) => {
      var y;
      return m.id === ((y = this.quickPopup) == null ? void 0 : y.areaId);
    });
    if (!t)
      return queueMicrotask(() => this.resetQuickPopup()), h;
    const i = this.quickPopup.action, a = Se(t, i);
    if (!a.length)
      return queueMicrotask(() => this.resetQuickPopup()), h;
    const o = jt(this.hass, this.config, i), r = a.filter((m) => m.powered).length, n = Ze(t, i, !0), s = Ze(t, i, !1), c = this.pendingActions.has(`${t.id}:${i}:on`), u = this.pendingActions.has(`${t.id}:${i}:off`), b = c || u, f = a.some((m) => this.pendingEntities.has(m.entityId)), l = b || f, v = `overview-quick-popup-title-${`${t.id}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "-")}`, k = i === "covers" ? this.localText("פתיחת הכל", "Open all") : this.localText("הפעלת הכל", "Turn all on"), d = i === "covers" ? this.localText("סגירת הכל", "Close all") : this.localText("כיבוי הכל", "Turn all off");
    return p`
      <dialog
        class="quick-action-dialog area-quick-action-dialog"
        aria-modal="true"
        aria-labelledby=${v}
        @cancel=${(m) => this.handleQuickPopupCancel(m)}
        @close=${() => this.handleQuickPopupClosed()}
        @click=${(m) => this.handleQuickPopupBackdrop(m)}
        @keydown=${(m) => this.handleQuickPopupKeydown(m)}
      >
        <section class="quick-popup" aria-busy=${l}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${this.config.quick_action_icons[i]}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${v}>${o} · ${t.name}</span>
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
              aria-label=${`${k}: ${o} (${n.length})`}
              aria-busy=${c}
              ?disabled=${l || n.length === 0}
              @click=${(m) => this.handleQuickPopupGroupAction(m, t, i, !0)}
            ><ha-icon icon=${c ? "mdi:loading" : i === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${k}</span><small>${n.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${d}: ${o} (${s.length})`}
              aria-busy=${u}
              ?disabled=${l || s.length === 0}
              @click=${(m) => this.handleQuickPopupGroupAction(m, t, i, !1)}
            ><ha-icon icon=${u ? "mdi:loading" : i === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon><span>${d}</span><small>${s.length}</small></button>
          </div>
          <div class="quick-popup-list" role="list" aria-label=${o}>
            ${a.map((m) => this.renderQuickPopupEntity(m, i, b))}
          </div>
        </section>
      </dialog>
    `;
  }
  renderFloorPopup(e) {
    if (!this.config || !this.floorPopupOpen || e.targetKind !== "floor") return h;
    const t = e.areas.filter((o) => o.allEntities.some(ye));
    if (!t.length)
      return queueMicrotask(() => this.resetFloorPopup()), h;
    const i = t.flatMap((o) => qe(o, !1)), a = "overview-floor-popup-title";
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
      const r = qe(o, !1), n = this.pendingFloor || this.pendingFloorRooms.has(o.id) || r.some((s) => this.pendingEntities.has(s.entityId));
      return p`
                <article class="floor-room-row" role="listitem">
                  <span class="icon-bubble small"><ha-icon icon=${o.icon}></ha-icon></span>
                  <span class="floor-room-main"><strong>${o.name}</strong><small>${o.allEntities.filter(ye).length} ${this.localText("פעילים", "active")}</small></span>
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
  renderAreaPopup(e) {
    if (!this.config || !this.areaPopupId) return h;
    const t = e.areas.find((n) => n.id === this.areaPopupId);
    if (!t || this.areaOpenMode(t) !== "popup")
      return queueMicrotask(() => this.resetAreaPopup()), h;
    const i = t.allEntities.filter(ye).length, o = `overview-area-popup-${t.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`, r = `${o}-title`;
    return p`
      <dialog
        id=${o}
        class="quick-action-dialog area-detail-dialog ${i ? "has-active" : "all-off"}"
        aria-modal="true"
        aria-labelledby=${r}
        @cancel=${(n) => {
      n.preventDefault(), this.closeAreaPopup();
    }}
        @close=${() => this.handleAreaPopupClosed()}
        @click=${(n) => {
      n.target === n.currentTarget && this.closeAreaPopup();
    }}
      >
        <section class="quick-popup area-detail-popup">
          <header class="quick-popup-header area-detail-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${t.icon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${r}>${t.name}</span>
              <span class="quick-popup-summary">${i ? `${i} ${this.localText("פעילים", "active")}` : this.localText("הכול כבוי", "All off")}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${`${this.localText("סגירת חדר", "Close room")}: ${t.name}`} @click=${() => this.closeAreaPopup()}><ha-icon icon="mdi:close"></ha-icon></button>
          </header>
          <div class="area-detail-content">${t.sections.map((n) => this.renderSection(n, t))}</div>
        </section>
      </dialog>
    `;
  }
  floorQuickArea(e) {
    const t = /* @__PURE__ */ new Map();
    for (const i of e.areas)
      for (const a of i.allEntities) t.set(a.entityId, a);
    return {
      id: Ne,
      name: e.targetName,
      icon: e.targetIcon,
      showWhenParentCollapsed: !1,
      sections: [],
      allEntities: [...t.values()],
      temperatureMode: "none",
      occupancy: "none",
      occupancyCountSource: "none",
      occupancyEntities: []
    };
  }
  renderQuickPopupEntity(e, t, i) {
    const a = this.entityBusy(e), o = !e.powered, r = lt(t, e, o), n = !e.available || a || i || !r, s = t === "covers" ? o ? this.localText("פתיחה", "Open") : this.localText("סגירה", "Close") : o ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off"), c = e.available ? r ? "" : this.localText("אין פעולת שליטה נתמכת", "No supported control action") : F(this.hass, this.config, "unavailable");
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
    return t === "floor_heating" ? this.renderFloorHeating(e) : e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : Pa(e) ? this.renderLight(e) : this.renderToggle(e);
  }
  renderEntityLead(e) {
    const t = this.entityPresentation(e);
    return p`
      <button
        class="entity-lead hold-target"
        type="button"
        title=${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}
        @pointerdown=${(i) => this.startHold(i, e)}
        @pointermove=${(i) => this.moveHold(i)}
        @pointerup=${(i) => this.finishHold(i)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(i) => this.handleMoreInfoClick(i, e)}
      >
        <span class="icon-bubble small"><ha-icon icon=${e.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${e.name}</span>
            ${t.showState ? p`<span class="state-text">${this.entitySecondary(e)}</span>` : h}
          </span>
      </button>
    `;
  }
  renderToggle(e) {
    const t = this.entityBusy(e), i = Q(e, !e.powered), a = !e.available || t || !i, o = this.entityPresentation(e), r = this.isCompactAuxiliary(e);
    return p`
      <button
        class="toggle-tile entity-card hold-target tile-shape-${o.shape} tile-icon-${o.iconPosition} ${r ? "compact-auxiliary" : ""} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${e.powered}
        aria-busy=${t}
        aria-disabled=${a}
        aria-label=${`${e.name}: ${this.entitySecondary(e)}. ${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}`}
        title=${`${e.active ? F(this.hass, this.config, "turn_off") : F(this.hass, this.config, "on")} · ${this.localText("לחיצה ארוכה לפרטים", "hold for details")}`}
        @pointerdown=${(n) => this.startHold(n, e)}
        @pointermove=${(n) => this.moveHold(n)}
        @pointerup=${(n) => this.finishHold(n)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(n) => this.handleToggleClick(n, e)}
      >
        <span class="icon-bubble small"><ha-icon icon=${t ? "mdi:loading" : e.icon}></ha-icon></span>
        <span class="entity-main">
          <span class="entity-name">${e.name}</span>
          ${o.showState ? p`<span class="state-text">${this.entitySecondary(e)}</span>` : h}
        </span>
      </button>
    `;
  }
  renderClimate(e) {
    var g;
    const t = T(e, "current_temperature"), i = T(e, "target_temp_step") ?? 0.5, a = L(e.entity, ae.TARGET_TEMPERATURE) ? T(e, "temperature") : void 0, o = L(e.entity, ae.TARGET_TEMPERATURE_RANGE) ? T(e, "target_temp_low") : void 0, r = L(e.entity, ae.TARGET_TEMPERATURE_RANGE) ? T(e, "target_temp_high") : void 0, n = o !== void 0 && r !== void 0, s = ni(e), c = L(e.entity, ae.FAN_MODE) && Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], u = this.entityBusy(e), b = this.climateModeIcon(e.entity.state), f = ((g = this.config) == null ? void 0 : g.climate_mode_presentation) ?? "both", l = String(e.entity.attributes.fan_mode ?? "");
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
              ` : t !== void 0 ? p`<span class="temperature current-temperature">${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>` : h}
        </div>
        ${n ? this.renderClimateRange(e, o, r, i, u) : h}
        ${s.length || c.length ? p`<div class="climate-secondary" @click=${(v) => v.stopPropagation()}>
          ${s.length ? p`<div class="climate-mode-control presentation-${f}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${e.name}`}
                .value=${e.entity.state}
                .disabled=${u || !e.available}
                .options=${s.map((v) => ({ value: v, label: this.climateModeLabel(v), icon: this.climateModeIcon(v) }))}
                @wa-select=${(v) => this.setClimateMode(e, v)}
              >${f !== "text" ? p`<ha-icon slot="icon" icon=${b}></ha-icon>` : h}</ha-control-select-menu>
              ${f !== "icon" ? p`<span class="climate-mode-value">${this.climateModeLabel(e.entity.state)}</span>` : h}
              </div>` : h}
          ${c.length ? p`<div class="climate-mode-control presentation-${f}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${e.name}`}
                .value=${l}
                .disabled=${u || !e.available}
                .options=${c.map((v) => ({ value: v, label: this.modeLabel(v), icon: "mdi:fan" }))}
                @wa-select=${(v) => this.setFanMode(e, v)}
              >${f !== "text" ? p`<ha-icon slot="icon" icon="mdi:fan"></ha-icon>` : h}</ha-control-select-menu>
              ${f !== "icon" ? p`<span class="climate-mode-value">${l ? this.modeLabel(l) : this.localText("לא ידוע", "Unknown")}</span>` : h}
              </div>` : h}
          </div>` : h}
      </article>
    `;
  }
  renderLight(e) {
    var n;
    const t = this.entityBusy(e), i = Dt(e), a = Q(e, !e.powered), o = `${this.localText("בהירות", "Brightness")}: ${e.name}`, r = this.entityPresentation(e);
    return p`
      <article class="light-card entity-card tile-shape-${r.shape} tile-icon-${r.iconPosition} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        <div class="light-primary">
          ${this.renderEntityLead(e)}
          <button
            class="light-power ${e.powered ? "active" : ""}"
            type="button"
            aria-pressed=${e.powered}
            aria-label=${`${e.powered ? F(this.hass, this.config, "turn_off") : F(this.hass, this.config, "on")}: ${e.name}`}
            ?disabled=${t || !e.available || !a}
            @click=${(s) => this.toggleEntity(s, e)}
          ><ha-icon icon=${t ? "mdi:loading" : "mdi:power"}></ha-icon></button>
        </div>
        <div class="brightness-control" @click=${(s) => s.stopPropagation()}>
          <ha-control-slider
            class="brightness-slider"
            .value=${i}
            .min=${0}
            .max=${100}
            .step=${1}
            .disabled=${t || !e.available}
            .locale=${(n = this.hass) == null ? void 0 : n.locale}
            .label=${o}
            unit="%"
            show-handle
            tooltip-mode="interaction"
            @value-changed=${(s) => this.setLightBrightness(e, s)}
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
    const t = e.domain === "water_heater" ? ai.TARGET_TEMPERATURE : ae.TARGET_TEMPERATURE, i = L(e.entity, t) ? T(e, "temperature") : void 0, a = T(e, "current_temperature");
    if (i === void 0 && a === void 0) return this.renderToggle(e);
    const o = T(e, "target_temp_step") ?? 0.5, r = this.entityBusy(e), n = Q(e, !e.powered);
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
          aria-label=${`${e.powered ? F(this.hass, this.config, "turn_off") : F(this.hass, this.config, "on")}: ${e.name}`}
          ?disabled=${r || !e.available || !n}
          @click=${(s) => this.toggleEntity(s, e)}
        ><ha-icon icon=${r ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderCover(e) {
    const t = this.entityBusy(e), i = T(e, "supported_features"), a = T(e, "current_position"), o = e.entity.state, r = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 }
    ].filter(({ feature: s }) => i === void 0 || (i & s) !== 0), n = (s) => s === "open_cover" ? o === "open" || a !== void 0 && a >= 100 : s === "close_cover" ? o === "closed" || a !== void 0 && a <= 0 : s === "stop_cover" && !["opening", "closing"].includes(o);
    return p`
      <article class="cover-card entity-card ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
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
    const t = this.entityBusy(e), i = e.entity.state === "playing", a = T(e, "volume_level"), o = a !== void 0 && L(e.entity, ke.VOLUME_SET), r = L(e.entity, i ? ke.PAUSE : ke.PLAY), n = Q(e, !e.powered);
    return p`
      <article class="media-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${o ? p`
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${e.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(a * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, a + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${e.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : h}
          ${r ? p`<button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(s) => this.runEntityService(s, e, i ? "media_pause" : "media_play")} aria-label=${`${this.localText(i ? "השהיה" : "ניגון", i ? "Pause" : "Play")}: ${e.name}`}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>` : h}
          ${n ? p`<button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.toggleEntity(s, e)} aria-label=${`${e.powered ? F(this.hass, this.config, "turn_off") : F(this.hass, this.config, "on")}: ${e.name}`}><ha-icon icon="mdi:power"></ha-icon></button>` : h}
        </div>
      </article>
    `;
  }
  entitySecondary(e) {
    var a, o;
    if (!e.available) return F(this.hass, this.config, "unavailable");
    const t = String(e.entity.state).toLowerCase(), i = t === "on" || t === "off" ? this.binaryStateLabel(t, e) : void 0;
    if (this.isCompactAuxiliary(e)) {
      const r = e.powered ? this.elapsedSince(e.entity.last_changed) : void 0;
      return [i ?? e.entity.state, r].filter(Boolean).join(" · ");
    }
    if (e.domain === "climate") {
      const r = T(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), r !== void 0 ? this.formatTemperature(r, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const r = T(e, "current_position");
      return r !== void 0 ? `${e.entity.state} · ${Math.round(r)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const r = T(e, "brightness");
      return r !== void 0 && e.active ? `${i ?? e.entity.state} · ${Math.round(r / 255 * 100)}%` : i ?? e.entity.state;
    }
    if (e.domain === "media_player")
      return String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state);
    if (e.section === "floor_heating") {
      const r = T(e, "current_temperature");
      return [i ?? e.entity.state, r !== void 0 ? this.formatTemperature(r, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    return i ?? ((o = (a = this.hass) == null ? void 0 : a.formatEntityState) == null ? void 0 : o.call(a, e.entity)) ?? e.entity.state;
  }
  isCompactAuxiliary(e) {
    return e.domain === "fan" || e.section === "climate" && ["switch", "input_boolean"].includes(e.domain) || e.section === "floor_heating" && ["switch", "input_boolean"].includes(e.domain);
  }
  elapsedSince(e) {
    const t = Date.parse(e);
    if (!Number.isFinite(t)) return;
    const i = Math.max(0, Math.floor((Date.now() - t) / 6e4));
    if (i < 1) return this.localText("פחות מדקה", "less than a minute");
    const a = Math.floor(i / 1440), o = Math.floor(i % 1440 / 60), r = i % 60;
    return a > 0 ? this.localText(`${a} י׳ ${o} ש׳`, `${a}d ${o}h`) : o > 0 ? this.localText(`${o} ש׳ ${r} דק׳`, `${o}h ${r}m`) : this.localText(`${r} דק׳`, `${r}m`);
  }
  entityPresentation(e) {
    var a, o, r, n;
    const t = (a = this.config) == null ? void 0 : a.entity_overrides[e.entityId], i = e.section === "lights_switches";
    return {
      shape: (t == null ? void 0 : t.tile_shape) ?? (i ? (o = this.config) == null ? void 0 : o.light_tile_shape : "rectangle") ?? "rectangle",
      iconPosition: (t == null ? void 0 : t.icon_position) ?? (i ? (r = this.config) == null ? void 0 : r.light_icon_position : "start") ?? "start",
      showState: (t == null ? void 0 : t.show_state) ?? (i ? (n = this.config) == null ? void 0 : n.light_show_state : !0) ?? !0
    };
  }
  binaryStateLabel(e, t) {
    var o, r, n;
    const i = ((r = (o = this.config) == null ? void 0 : o.entity_overrides[t.entityId]) == null ? void 0 : r.state_language) ?? ((n = this.config) == null ? void 0 : n.entity_state_language) ?? "auto";
    return (i === "auto" ? this.config && W(this.hass, this.config) === "he" ? "he" : "en" : i) === "he" ? e === "on" ? "דלוק" : "כבוי" : e === "on" ? "On" : "Off";
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
    return this.config && W(this.hass, this.config) === "he" ? e : t;
  }
  areaTemperatureUnit(e) {
    var t, i, a;
    return String(e.entity.attributes.temperature_unit ?? ((a = (i = (t = this.hass) == null ? void 0 : t.config) == null ? void 0 : i.unit_system) == null ? void 0 : a.temperature) ?? "°C");
  }
  formatTemperature(e, t = "°C") {
    const i = this.config && W(this.hass, this.config) === "he" ? "he-IL" : void 0;
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: 1 }).format(e)} ${t}`;
  }
  renderEmpty(e, t) {
    return p`<div class="empty"><ha-icon icon=${t}></ha-icon><span>${e}</span></div>`;
  }
  isExpanded(e) {
    var i, a, o;
    if (this.areaOpenMode(e) === "popup") return !1;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? ((o = this.config) == null ? void 0 : o.default_expanded) ?? !1;
  }
  areaOpenMode(e) {
    var i, a, o;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return (t == null ? void 0 : t.open_mode) ?? ((o = this.config) == null ? void 0 : o.area_open_mode) ?? "expander";
  }
  activateArea(e, t) {
    this.areaOpenMode(t) === "popup" ? this.openAreaPopup(e, t) : this.toggleArea(t);
  }
  handleAreaSummaryClick(e, t) {
    const i = e.target;
    i != null && i.closest("button, a, input, select, textarea, [role='button']") || this.activateArea(e, t);
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
      if (!t.available || this.entityBusy(t) || !Q(t, !t.powered)) {
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
    e.stopPropagation(), this.resetQuickPopup(), this.resetAreaPopup(), this.floorPopupTrigger = e.currentTarget, this.floorPopupOpen = !0, this.updateComplete.then(() => {
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
  openAreaPopup(e, t) {
    e.stopPropagation(), this.resetQuickPopup(), this.resetFloorPopup(), this.areaPopupTrigger = e.currentTarget, this.areaPopupMoreInfo = void 0, this.restoreAreaPopupFocus = !0, this.areaPopupId = t.id, this.updateComplete.then(() => {
      const i = this.renderRoot.querySelector(".area-detail-dialog");
      !i || i.open || !i.isConnected || (typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", ""));
    });
  }
  closeAreaPopup(e = !0, t) {
    this.restoreAreaPopupFocus = e, this.areaPopupMoreInfo = t;
    const i = this.renderRoot.querySelector(".area-detail-dialog");
    i != null && i.open && typeof i.close == "function" ? i.close() : this.handleAreaPopupClosed();
  }
  handleAreaPopupClosed() {
    const e = this.areaPopupMoreInfo, t = this.restoreAreaPopupFocus, i = this.areaPopupTrigger;
    this.areaPopupId = void 0, this.areaPopupTrigger = void 0, this.areaPopupMoreInfo = void 0, this.restoreAreaPopupFocus = !0, this.updateComplete.then(() => {
      e ? this.moreInfo(e) : t && (i != null && i.isConnected) && i.focus();
    });
  }
  resetAreaPopup() {
    var t;
    const e = (t = this.renderRoot) == null ? void 0 : t.querySelector(".area-detail-dialog");
    e != null && e.open && typeof e.close == "function" && e.close(), this.areaPopupId = void 0, this.areaPopupTrigger = void 0, this.areaPopupMoreInfo = void 0, this.restoreAreaPopupFocus = !0;
  }
  async handleFloorRoomOff(e, t) {
    if (e.stopPropagation(), !this.hass || this.pendingFloor || this.pendingFloorRooms.has(t.id)) return;
    const i = qe(t, !1);
    if (!(!i.length || i.some((a) => this.pendingEntities.has(a.entityId)))) {
      this.pendingFloorRooms = /* @__PURE__ */ new Set([...this.pendingFloorRooms, t.id]), this.lockPendingEntities(i);
      try {
        await Lt(this.hass, t, !1);
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
    const i = t.flatMap((a) => qe(a, !1));
    if (!(!i.length || i.some((a) => this.pendingEntities.has(a.entityId)))) {
      this.pendingFloor = !0, this.lockPendingEntities(i);
      try {
        const a = await Promise.allSettled(t.map((r) => Lt(this.hass, r, !1))), o = a.filter((r) => r.status === "rejected");
        if (o.length) throw new Error(`${o.length} of ${a.length} room actions failed.`);
      } catch (a) {
        this.reportError(a);
      } finally {
        this.pendingFloor = !1, this.unlockPendingEntities(i);
      }
    }
  }
  openQuickActionPopup(e, t, i) {
    e.stopPropagation(), this.resetFloorPopup(), this.resetAreaPopup(), this.quickPopupTrigger = e.currentTarget, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0, this.quickPopup = { areaId: t.id, action: i }, this.updateComplete.then(() => {
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
    this.quickPopup ? this.closeQuickActionPopup(!1, e) : this.areaPopupId ? this.closeAreaPopup(!1, e) : this.moreInfo(e);
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
    const o = `${t.id}:${i}:${a ? "on" : "off"}`, r = Se(t, i), n = Ze(t, i, a);
    if (!(this.quickActionPending(t.id, i) || r.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingActions = /* @__PURE__ */ new Set([...this.pendingActions, o]), this.lockPendingEntities(n);
      try {
        await Oa(this.hass, t, i, a);
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
    const a = lt(i, t, !t.powered);
    !this.hass || !t.available || this.entityBusy(t) || this.quickPopup && this.quickActionPending(this.quickPopup.areaId, i) || !a || this.performEntityCall(t, () => G(this.hass, t.entityId, a.service, a.data));
  }
  async handleSectionAction(e, t, i, a) {
    if (e.stopPropagation(), !this.hass) return;
    const o = `${i}:${t.id}:${a ? "on" : "off"}`, r = `${i}:${t.id}:${a ? "off" : "on"}`, n = et(t, a);
    if (!(this.pendingSections.has(o) || this.pendingSections.has(r) || t.entities.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingSections = /* @__PURE__ */ new Set([...this.pendingSections, o]), this.lockPendingEntities(n);
      try {
        await Fa(this.hass, t, a);
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
    const i = Q(t, !t.powered);
    i && this.performEntityCall(t, () => G(this.hass, t.entityId, i.service, i.data));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => G(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = T(e, "min_temp") ?? -100, a = T(e, "max_temp") ?? 100, o = Math.min(a, Math.max(i, t));
    this.performEntityCall(e, () => G(this.hass, e.entityId, "set_temperature", { temperature: o }));
  }
  setClimateRange(e, t, i, a) {
    const o = T(e, "min_temp") ?? -100, r = T(e, "max_temp") ?? 100, n = a === "low" ? Math.min(i, Math.max(o, t)) : t, s = a === "high" ? Math.max(n, Math.min(r, i)) : i;
    this.performEntityCall(e, () => G(this.hass, e.entityId, "set_temperature", {
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
    !i || i === e.entity.state || this.performEntityCall(e, () => G(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i }));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === String(e.entity.attributes.fan_mode ?? "") || this.performEntityCall(e, () => G(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setLightBrightness(e, t) {
    var o;
    t.stopPropagation();
    const i = (o = t.detail) == null ? void 0 : o.value;
    if (typeof i != "number" || !Number.isFinite(i)) return;
    const a = Math.min(100, Math.max(0, Math.round(i)));
    a !== Dt(e) && this.performEntityCall(e, () => a === 0 ? G(this.hass, e.entityId, "turn_off") : G(this.hass, e.entityId, "turn_on", { brightness_pct: a }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => G(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
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
    return `${Rt}:${this.storageId}:expanded`;
  }
  floorStorageKey() {
    return `${Rt}:${this.storageId}:floor-expanded`;
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
    ), this.style.setProperty("--area-bubble-overview-primary-text", e.primary_text_color), this.style.setProperty("--area-bubble-overview-secondary-text", e.secondary_text_color), this.style.setProperty("--area-bubble-overview-active-text", e.active_text_color), this.style.setProperty("--area-bubble-overview-control-text", e.control_text_color), this.style.setProperty(
      "--area-bubble-overview-card-border",
      e.card_transparent ? "transparent" : "color-mix(in srgb, var(--divider-color) 58%, transparent)"
    ), this.style.setProperty("--area-bubble-overview-active-surface", e.active_surface), this.style.setProperty("--area-bubble-overview-entity-active-surface", e.entity_active_surface), this.style.setProperty("--area-bubble-overview-area-frame-width", `${e.area_frame_width}px`), e.area_frame_color ? this.style.setProperty("--area-bubble-overview-area-frame-color", e.area_frame_color) : this.style.removeProperty("--area-bubble-overview-area-frame-color"), this.style.setProperty("--area-bubble-overview-entity-frame-width", `${e.entity_frame_width}px`), e.entity_frame_color ? this.style.setProperty("--area-bubble-overview-entity-frame-color", e.entity_frame_color) : this.style.removeProperty("--area-bubble-overview-entity-frame-color"), this.style.setProperty("--area-bubble-overview-climate-surface", e.climate_surface), this.style.setProperty("--area-bubble-overview-control-surface", e.control_surface), this.style.setProperty("--area-bubble-overview-climate-color", e.climate_color), this.style.setProperty("--area-bubble-overview-cover-color", e.cover_color), this.style.setProperty("--area-bubble-overview-media-color", e.media_color), this.style.setProperty("--area-bubble-overview-temperature-off-surface", e.temperature_off_surface), this.style.setProperty("--area-bubble-overview-temperature-cool-surface", e.temperature_cool_surface), this.style.setProperty("--area-bubble-overview-temperature-heat-surface", e.temperature_heat_surface), this.style.setProperty("--area-bubble-overview-temperature-active-surface", e.temperature_active_surface), this.style.setProperty("--area-bubble-overview-occupancy-active-color", e.occupancy_active_color), this.style.setProperty("--area-bubble-overview-occupancy-vacant-color", e.occupancy_vacant_color), this.style.setProperty("--area-bubble-overview-occupancy-unknown-color", e.occupancy_unknown_color), this.style.setProperty(
      "--area-bubble-overview-shadow",
      e.show_shadows && !e.card_transparent ? `0 12px 30px rgba(0,0,0,${e.shadow_intensity})` : "none"
    );
  }
};
I.styles = lo;
N([
  Ie({ attribute: !1 })
], I.prototype, "hass", 2);
N([
  A()
], I.prototype, "config", 2);
N([
  A()
], I.prototype, "expanded", 2);
N([
  A()
], I.prototype, "floorExpanded", 2);
N([
  A()
], I.prototype, "pendingActions", 2);
N([
  A()
], I.prototype, "pendingSections", 2);
N([
  A()
], I.prototype, "pendingEntities", 2);
N([
  A()
], I.prototype, "quickPopup", 2);
N([
  A()
], I.prototype, "areaPopupId", 2);
N([
  A()
], I.prototype, "floorPopupOpen", 2);
N([
  A()
], I.prototype, "pendingFloor", 2);
N([
  A()
], I.prototype, "pendingFloorRooms", 2);
N([
  A()
], I.prototype, "error", 2);
I = N([
  Ke(rt)
], I);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === rt) || window.customCards.push({
  type: rt,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

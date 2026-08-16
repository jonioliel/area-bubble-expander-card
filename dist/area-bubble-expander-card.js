/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = globalThis, Pt = We.ShadowRoot && (We.ShadyCSS === void 0 || We.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, It = Symbol(), Gt = /* @__PURE__ */ new WeakMap();
let vi = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== It) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Pt && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = Gt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Gt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Bi = (e) => new vi(typeof e == "string" ? e : e + "", void 0, It), Re = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, a, r) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[r + 1], e[0]);
  return new vi(i, e, It);
}, Vi = (e, t) => {
  if (Pt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), a = We.litNonce;
    a !== void 0 && o.setAttribute("nonce", a), o.textContent = i.cssText, e.appendChild(o);
  }
}, Kt = Pt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return Bi(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gi, defineProperty: Ki, getOwnPropertyDescriptor: Ji, getOwnPropertyNames: Qi, getOwnPropertySymbols: Wi, getPrototypeOf: Yi } = Object, ae = globalThis, Jt = ae.trustedTypes, Xi = Jt ? Jt.emptyScript : "", lt = ae.reactiveElementPolyfillSupport, Ie = (e, t) => e, Ze = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Xi : null;
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
} }, Ot = (e, t) => !Gi(e, t), Qt = { attribute: !0, type: String, converter: Ze, reflect: !1, useDefault: !1, hasChanged: Ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ae.litPropertyMetadata ?? (ae.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ye = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Qt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), a = this.getPropertyDescriptor(t, o, i);
      a !== void 0 && Ki(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: a, set: r } = Ji(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: a, set(n) {
      const s = a == null ? void 0 : a.call(this);
      r == null || r.call(this, n), this.requestUpdate(t, s, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Qt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ie("elementProperties"))) return;
    const t = Yi(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
      const i = this.properties, o = [...Qi(i), ...Wi(i)];
      for (const a of o) this.createProperty(a, i[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [o, a] of i) this.elementProperties.set(o, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const a = this._$Eu(i, o);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const a of o) i.unshift(Kt(a));
    } else t !== void 0 && i.push(Kt(t));
    return i;
  }
  static _$Eu(t, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const o of i.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Vi(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var o;
      return (o = i.hostConnected) == null ? void 0 : o.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var o;
      return (o = i.hostDisconnected) == null ? void 0 : o.call(i);
    });
  }
  attributeChangedCallback(t, i, o) {
    this._$AK(t, o);
  }
  _$ET(t, i) {
    var r;
    const o = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, o);
    if (a !== void 0 && o.reflect === !0) {
      const n = (((r = o.converter) == null ? void 0 : r.toAttribute) !== void 0 ? o.converter : Ze).toAttribute(i, o.type);
      this._$Em = t, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, n;
    const o = this.constructor, a = o._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const s = o.getPropertyOptions(a), c = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((r = s.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? s.converter : Ze;
      this._$Em = a;
      const l = c.fromAttribute(i, s.type);
      this[a] = l ?? ((n = this._$Ej) == null ? void 0 : n.get(a)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, a = !1, r) {
    var n;
    if (t !== void 0) {
      const s = this.constructor;
      if (a === !1 && (r = this[t]), o ?? (o = s.getPropertyOptions(t)), !((o.hasChanged ?? Ot)(r, i) || o.useDefault && o.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(s._$Eu(t, o)))) return;
      this.C(t, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: o, reflect: a, wrapped: r }, n) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (i = void 0), this._$AL.set(t, i)), a === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var o;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, n] of a) {
        const { wrapped: s } = n, c = this[r];
        s !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (o = this._$EO) == null || o.forEach((a) => {
        var r;
        return (r = a.hostUpdate) == null ? void 0 : r.call(a);
      }), this.update(i)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((o) => {
      var a;
      return (a = o.hostUpdated) == null ? void 0 : a.call(o);
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
ye.elementStyles = [], ye.shadowRootOptions = { mode: "open" }, ye[Ie("elementProperties")] = /* @__PURE__ */ new Map(), ye[Ie("finalized")] = /* @__PURE__ */ new Map(), lt == null || lt({ ReactiveElement: ye }), (ae.reactiveElementVersions ?? (ae.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = globalThis, Wt = (e) => e, et = Oe.trustedTypes, Yt = et ? et.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, _i = "$lit$", ie = `lit$${Math.random().toFixed(9).slice(2)}$`, yi = "?" + ie, Zi = `<${yi}>`, fe = document, Fe = () => fe.createComment(""), Ne = (e) => e === null || typeof e != "object" && typeof e != "function", zt = Array.isArray, eo = (e) => zt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", dt = `[ 	
\f\r]`, Ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Xt = /-->/g, Zt = />/g, ce = RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ei = /'/g, ti = /"/g, xi = /^(?:script|style|textarea|title)$/i, to = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = to(1), we = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), ii = /* @__PURE__ */ new WeakMap(), ue = fe.createTreeWalker(fe, 129);
function $i(e, t) {
  if (!zt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Yt !== void 0 ? Yt.createHTML(t) : t;
}
const io = (e, t) => {
  const i = e.length - 1, o = [];
  let a, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = Ee;
  for (let s = 0; s < i; s++) {
    const c = e[s];
    let l, u, b = -1, d = 0;
    for (; d < c.length && (n.lastIndex = d, u = n.exec(c), u !== null); ) d = n.lastIndex, n === Ee ? u[1] === "!--" ? n = Xt : u[1] !== void 0 ? n = Zt : u[2] !== void 0 ? (xi.test(u[2]) && (a = RegExp("</" + u[2], "g")), n = ce) : u[3] !== void 0 && (n = ce) : n === ce ? u[0] === ">" ? (n = a ?? Ee, b = -1) : u[1] === void 0 ? b = -2 : (b = n.lastIndex - u[2].length, l = u[1], n = u[3] === void 0 ? ce : u[3] === '"' ? ti : ei) : n === ti || n === ei ? n = ce : n === Xt || n === Zt ? n = Ee : (n = ce, a = void 0);
    const g = n === ce && e[s + 1].startsWith("/>") ? " " : "";
    r += n === Ee ? c + Zi : b >= 0 ? (o.push(l), c.slice(0, b) + _i + c.slice(b) + ie + g) : c + ie + (b === -2 ? s : g);
  }
  return [$i(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class qe {
  constructor({ strings: t, _$litType$: i }, o) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const s = t.length - 1, c = this.parts, [l, u] = io(t, i);
    if (this.el = qe.createElement(l, o), ue.currentNode = this.el.content, i === 2 || i === 3) {
      const b = this.el.content.firstChild;
      b.replaceWith(...b.childNodes);
    }
    for (; (a = ue.nextNode()) !== null && c.length < s; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const b of a.getAttributeNames()) if (b.endsWith(_i)) {
          const d = u[n++], g = a.getAttribute(b).split(ie), _ = /([.?@])?(.*)/.exec(d);
          c.push({ type: 1, index: r, name: _[2], strings: g, ctor: _[1] === "." ? ao : _[1] === "?" ? ro : _[1] === "@" ? no : rt }), a.removeAttribute(b);
        } else b.startsWith(ie) && (c.push({ type: 6, index: r }), a.removeAttribute(b));
        if (xi.test(a.tagName)) {
          const b = a.textContent.split(ie), d = b.length - 1;
          if (d > 0) {
            a.textContent = et ? et.emptyScript : "";
            for (let g = 0; g < d; g++) a.append(b[g], Fe()), ue.nextNode(), c.push({ type: 2, index: ++r });
            a.append(b[d], Fe());
          }
        }
      } else if (a.nodeType === 8) if (a.data === yi) c.push({ type: 2, index: r });
      else {
        let b = -1;
        for (; (b = a.data.indexOf(ie, b + 1)) !== -1; ) c.push({ type: 7, index: r }), b += ie.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const o = fe.createElement("template");
    return o.innerHTML = t, o;
  }
}
function ke(e, t, i = e, o) {
  var n, s;
  if (t === we) return t;
  let a = o !== void 0 ? (n = i._$Co) == null ? void 0 : n[o] : i._$Cl;
  const r = Ne(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== r && ((s = a == null ? void 0 : a._$AO) == null || s.call(a, !1), r === void 0 ? a = void 0 : (a = new r(e), a._$AT(e, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = a : i._$Cl = a), a !== void 0 && (t = ke(e, a._$AS(e, t.values), a, o)), t;
}
class oo {
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
    const { el: { content: i }, parts: o } = this._$AD, a = ((t == null ? void 0 : t.creationScope) ?? fe).importNode(i, !0);
    ue.currentNode = a;
    let r = ue.nextNode(), n = 0, s = 0, c = o[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let l;
        c.type === 2 ? l = new De(r, r.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (l = new so(r, this, t)), this._$AV.push(l), c = o[++s];
      }
      n !== (c == null ? void 0 : c.index) && (r = ue.nextNode(), n++);
    }
    return ue.currentNode = fe, a;
  }
  p(t) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, i), i += o.strings.length - 2) : o._$AI(t[i])), i++;
  }
}
class De {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, o, a) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = o, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    t = ke(this, t, i), Ne(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== we && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : eo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && Ne(this._$AH) ? this._$AA.nextSibling.data = t : this.T(fe.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: o } = t, a = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = qe.createElement($i(o.h, o.h[0]), this.options)), o);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === a) this._$AH.p(i);
    else {
      const n = new oo(a, this), s = n.u(this.options);
      n.p(i), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = ii.get(t.strings);
    return i === void 0 && ii.set(t.strings, i = new qe(t)), i;
  }
  k(t) {
    zt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, a = 0;
    for (const r of t) a === i.length ? i.push(o = new De(this.O(Fe()), this.O(Fe()), this, this.options)) : o = i[a], o._$AI(r), a++;
    a < i.length && (this._$AR(o && o._$AB.nextSibling, a), i.length = a);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); t !== this._$AB; ) {
      const a = Wt(t).nextSibling;
      Wt(t).remove(), t = a;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class rt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, o, a, r) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = i, this._$AM = a, this.options = r, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = m;
  }
  _$AI(t, i = this, o, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = ke(this, t, i, 0), n = !Ne(t) || t !== this._$AH && t !== we, n && (this._$AH = t);
    else {
      const s = t;
      let c, l;
      for (t = r[0], c = 0; c < r.length - 1; c++) l = ke(this, s[o + c], i, c), l === we && (l = this._$AH[c]), n || (n = !Ne(l) || l !== this._$AH[c]), l === m ? t = m : t !== m && (t += (l ?? "") + r[c + 1]), this._$AH[c] = l;
    }
    n && !a && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ao extends rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class ro extends rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class no extends rt {
  constructor(t, i, o, a, r) {
    super(t, i, o, a, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = ke(this, t, i, 0) ?? m) === we) return;
    const o = this._$AH, a = t === m && o !== m || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, r = t !== m && (o === m || a);
    a && this.element.removeEventListener(this.name, this, o), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class so {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ke(this, t);
  }
}
const pt = Oe.litHtmlPolyfillSupport;
pt == null || pt(qe, De), (Oe.litHtmlVersions ?? (Oe.litHtmlVersions = [])).push("3.3.3");
const co = (e, t, i) => {
  const o = (i == null ? void 0 : i.renderBefore) ?? t;
  let a = o._$litPart$;
  if (a === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    o._$litPart$ = a = new De(t.insertBefore(Fe(), r), r, void 0, i ?? {});
  }
  return a._$AI(e), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis;
class re extends ye {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = co(i, this.renderRoot, this.renderOptions);
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
    return we;
  }
}
var gi;
re._$litElement$ = !0, re.finalized = !0, (gi = he.litElementHydrateSupport) == null || gi.call(he, { LitElement: re });
const ut = he.litElementPolyfillSupport;
ut == null || ut({ LitElement: re });
(he.litElementVersions ?? (he.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lo = { attribute: !0, type: String, converter: Ze, reflect: !1, hasChanged: Ot }, po = (e = lo, t, i) => {
  const { kind: o, metadata: a } = i;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), o === "accessor") {
    const { name: n } = i;
    return { set(s) {
      const c = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(n, c, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(n, void 0, e, s), s;
    } };
  }
  if (o === "setter") {
    const { name: n } = i;
    return function(s) {
      const c = this[n];
      t.call(this, s), this.requestUpdate(n, c, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Le(e) {
  return (t, i) => typeof i == "object" ? po(e, t, i) : ((o, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, o), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(e) {
  return Le({ ...e, state: !0, attribute: !1 });
}
const uo = "custom:area-bubble-expander-card", ho = "area-bubble-expander-card", wi = "area-bubble-expander-card-editor", mo = "area-bubble-expander-card", bo = ["light", "switch", "fan", "climate", "media_player"], fo = [
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
], go = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"]
}, vo = {
  climate: ["off", "unavailable", "unknown"]
}, _o = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]), yo = ["always_on", "critical", "infrastructure", "no_turn_off"], xo = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve"
], $o = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off"
}, ki = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline"
}, gt = {
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
}, wo = {
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
}, Ce = {
  type: uo,
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
  domains: bo,
  exclude_domains: fo,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: !0,
  exclude_unavailable: !0,
  active_states: go,
  inactive_states: vo,
  paused_media_players_active: !0,
  protected_labels: yo,
  protected_entities: xo,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: $o,
  domain_icons: ki,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: gt,
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
}, ko = Re`
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
`, H = (e) => Array.isArray(e) ? [...e] : [], Y = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, xe = (e) => {
  const t = Y(e.style), i = typeof t.preset == "string" ? t.preset : gt.preset, o = wo[i] ?? {}, a = { ...gt, ...o, ...t }, r = {
    ...Ce,
    ...e,
    style: a
  };
  return {
    ...r,
    type: "custom:area-bubble-expander-card",
    title: r.title ?? "",
    empty_title: r.empty_title ?? "",
    empty_subtitle: r.empty_subtitle ?? "",
    include_entities: H(r.include_entities),
    exclude_entities: H(r.exclude_entities),
    include_areas: H(r.include_areas),
    exclude_areas: H(r.exclude_areas),
    exclude_labels: H(r.exclude_labels),
    exclude_entity_category: H(r.exclude_entity_category),
    exclude_by_regex: H(r.exclude_by_regex),
    active_states: { ...Ce.active_states ?? {}, ...Y(e.active_states) },
    inactive_states: { ...Ce.inactive_states ?? {}, ...Y(e.inactive_states) },
    protected_entities: H(r.protected_entities),
    disable_turn_off_for_domains: H(r.disable_turn_off_for_domains),
    dangerous_domains: H(r.dangerous_domains),
    service_mapping: { ...Ce.service_mapping ?? {}, ...Y(e.service_mapping) },
    custom_area_order: H(r.custom_area_order),
    custom_entity_order: H(r.custom_entity_order),
    areas: { ...Y(r.areas) },
    entity_overrides: { ...Y(r.entity_overrides) },
    labels: { ...Y(r.labels) },
    domain_labels: { ...Y(r.domain_labels) },
    domain_icons: { ...Ce.domain_icons ?? {}, ...Y(r.domain_icons) },
    style: a
  };
}, So = (e) => {
  if (!e || typeof e != "object")
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  if (e.type && e.type !== "custom:area-bubble-expander-card")
    throw new Error("Card type must be custom:area-bubble-expander-card.");
}, Be = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : typeof e != "string" ? [] : e.split(/[\n,]/).map((t) => t.trim()).filter(Boolean), Ao = (e) => Array.isArray(e) ? e.join(`
`) : "", oi = {
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
}, Eo = {
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
}, Se = (e, t) => {
  var o;
  if (t === "he" || t === "en") return t;
  const i = ((o = e == null ? void 0 : e.locale) == null ? void 0 : o.language) ?? (e == null ? void 0 : e.language) ?? (typeof document < "u" ? document.documentElement.lang : "en");
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, Si = (e, t) => {
  if (typeof t.rtl == "boolean") return t.rtl;
  const i = Se(e, t.language), o = typeof document < "u" ? document.documentElement.dir : "";
  return i === "he" || o === "rtl";
}, I = (e, t, i, o = {}) => {
  const a = Se(t, e.language);
  let n = e.labels[i] ?? oi[a][i] ?? oi.en[i] ?? i;
  for (const [s, c] of Object.entries(o))
    n = n.replace(new RegExp(`\\{${s}\\}`, "g"), String(c));
  return n;
}, ai = (e, t, i) => {
  const o = Se(t, e.language);
  return e.domain_labels[i] ?? Eo[o][i] ?? i.replace(/_/g, " ");
}, Co = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries((e == null ? void 0 : e.areas) ?? {})) {
    const a = o.area_id ?? o.id ?? i;
    t.set(a, o);
  }
  return t;
}, vt = (e, t, i) => {
  var b, d;
  const o = Co(e), a = (b = e == null ? void 0 : e.entities) == null ? void 0 : b[i], r = a != null && a.device_id ? (d = e == null ? void 0 : e.devices) == null ? void 0 : d[a.device_id] : void 0, n = (a == null ? void 0 : a.area_id) ?? (r == null ? void 0 : r.area_id) ?? "no_area", s = n ? o.get(n) : void 0, c = t.areas[n] ?? t.areas[(s == null ? void 0 : s.name) ?? ""], l = (s == null ? void 0 : s.name) ?? I(t, e, "no_area"), u = (c == null ? void 0 : c.name) ?? l;
  return {
    id: n || "no_area",
    name: u,
    icon: (c == null ? void 0 : c.icon) ?? (s == null ? void 0 : s.icon) ?? (n === "no_area" ? "mdi:home-question" : "mdi:floor-plan")
  };
}, To = (e, t, i) => {
  const o = i.areas[e] ?? i.areas[t];
  return o != null && o.hidden || i.include_areas.length && !i.include_areas.includes(e) && !i.include_areas.includes(t) ? !1 : !i.exclude_areas.includes(e) && !i.exclude_areas.includes(t);
}, Te = (e, t) => {
  const i = e.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, Po = (e, t) => t ?? String(e.attributes.friendly_name ?? e.entity_id), Io = (e, t, i, o) => {
  if (e.state === "unavailable") return I(i, o, "not_available");
  if (t === "light" && i.show_brightness) {
    const a = Te(e, "brightness");
    if (a !== void 0) return `${Math.round(a / 255 * 100)}%`;
  }
  if (t === "fan") {
    const a = Te(e, "percentage");
    if (a !== void 0) return `${a}%`;
  }
  if (t === "climate") {
    const a = String(e.attributes.hvac_action ?? e.state), r = Te(e, "current_temperature"), n = Te(e, "temperature");
    return i.show_temperature && (r !== void 0 || n !== void 0) ? [a, r !== void 0 ? `${r}°` : "", n !== void 0 ? `→ ${n}°` : ""].filter(Boolean).join(" ") : a;
  }
  if (t === "media_player" && i.show_media_title)
    return String(e.attributes.media_title ?? e.attributes.source ?? e.state);
  if (t === "cover") {
    const a = Te(e, "current_position");
    return a !== void 0 ? `${a}%` : e.state;
  }
  return String(e.state);
}, Oo = (e) => {
  const t = new Date(e.last_changed).getTime();
  if (!Number.isFinite(t)) return "";
  const i = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (i < 1) return "now";
  if (i < 60) return `${i}m`;
  const o = Math.round(i / 60);
  return o < 24 ? `${o}h` : `${Math.round(o / 24)}d`;
}, zo = (e, t) => {
  const i = [e.secondary];
  return e.protected && i.push(I(t, void 0, "protected")), t.show_entity_ids && i.push(e.entityId), t.show_last_changed && i.push(Oo(e.entity)), i.filter(Boolean).join(" · ");
}, Mo = /* @__PURE__ */ new Set(["cooling", "heating", "drying", "fan"]), Fo = (e, t, i) => {
  var n, s;
  const o = String(e.state ?? "").toLowerCase();
  if (_o.has(o) || t === "media_player" && !i.paused_media_players_active && o === "paused")
    return !1;
  if (t === "climate") {
    const c = String(e.attributes.hvac_action ?? "").toLowerCase();
    if (Mo.has(c)) return !0;
  }
  const a = (n = i.inactive_states[t]) == null ? void 0 : n.map((c) => c.toLowerCase());
  if (a != null && a.includes(o)) return !1;
  const r = (s = i.active_states[t]) == null ? void 0 : s.map((c) => c.toLowerCase());
  return r != null && r.length ? r.includes(o) : a != null && a.length ? !0 : o === "on";
}, No = (e, t) => {
  var a, r;
  const i = (a = e == null ? void 0 : e.entities) == null ? void 0 : a[t], o = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [...(i == null ? void 0 : i.labels) ?? [], ...(o == null ? void 0 : o.labels) ?? []];
}, qo = (e, t, i) => {
  const o = i.entity_overrides[e];
  return o != null && o.protected || i.protected_entities.includes(e) ? !0 : t.some((a) => i.protected_labels.includes(a));
}, Ai = (e, t) => {
  const i = t.entity_overrides[e.entityId];
  if ((i == null ? void 0 : i.allow_turn_off) === !1) return "Entity override disabled turn-off";
  if (e.protected) return I(t, void 0, "locked_by_safety");
  if (t.disable_turn_off_for_domains.includes(e.domain)) return "Domain disabled for turn-off";
  if (!t.service_mapping[e.domain]) return "Unsupported turn-off service";
  if (t.safety_mode === "strict" && e.domain === "switch") return "Strict safety mode protects switches";
}, Ro = (e, t) => {
  var i;
  return !e.protected || (i = t.entity_overrides[e.entityId]) != null && i.show_disabled ? !0 : t.protected_entity_behavior !== "hide";
}, Ye = (e, t) => e.filter((i) => !Ai(i, t)), tt = (e, t, i) => {
  const o = e.indexOf(t);
  if (o >= 0) return o;
  if (i) {
    const a = e.indexOf(i);
    if (a >= 0) return a;
  }
  return Number.MAX_SAFE_INTEGER;
}, Do = (e, t) => {
  const i = [...e];
  return t.area_sort === "original" ? i : t.area_sort === "name" ? i.sort((o, a) => o.name.localeCompare(a.name)) : t.area_sort === "count_asc" ? i.sort((o, a) => o.entities.length - a.entities.length || o.name.localeCompare(a.name)) : t.area_sort === "custom" ? i.sort(
    (o, a) => tt(t.custom_area_order, o.id, o.name) - tt(t.custom_area_order, a.id, a.name) || o.name.localeCompare(a.name)
  ) : i.sort((o, a) => a.entities.length - o.entities.length || o.name.localeCompare(a.name));
}, Lo = (e, t) => {
  const i = [...e];
  return t.entity_sort === "name" ? i.sort((o, a) => o.name.localeCompare(a.name)) : t.entity_sort === "state" ? i.sort((o, a) => o.entity.state.localeCompare(a.entity.state) || o.name.localeCompare(a.name)) : t.entity_sort === "last_changed" ? i.sort((o, a) => new Date(a.entity.last_changed).getTime() - new Date(o.entity.last_changed).getTime()) : t.entity_sort === "custom" ? i.sort((o, a) => tt(t.custom_entity_order, o.entityId) - tt(t.custom_entity_order, a.entityId)) : i.sort((o, a) => o.domain.localeCompare(a.domain) || o.name.localeCompare(a.name));
}, jo = (e) => e.split(".")[0] ?? "", Ho = (e) => e.flatMap((t) => {
  try {
    return [new RegExp(t)];
  } catch {
    return [];
  }
}), Uo = (e, t) => t.some((i) => i.test(e)), _t = (e, t) => {
  var l;
  if (!(e != null && e.states)) return { groups: [], skipped: [] };
  const i = /* @__PURE__ */ new Map(), o = [], a = Ho(t.exclude_by_regex), r = new Set(t.domains), n = new Set(t.exclude_domains), s = new Set(t.include_entities);
  for (const u of Object.values(e.states)) {
    const b = u.entity_id, d = jo(b), g = (l = e.entities) == null ? void 0 : l[b], _ = t.entity_overrides[b], $ = No(e, b), f = [];
    _ != null && _.hidden && f.push("hidden by entity override"), t.exclude_entities.includes(b) && f.push("excluded entity"), t.exclude_unavailable && u.state === "unavailable" && f.push("unavailable"), t.exclude_hidden_entities && (g != null && g.hidden_by || g != null && g.hidden) && f.push("hidden entity"), g != null && g.disabled_by && f.push("disabled entity"), g != null && g.entity_category && t.exclude_entity_category.includes(g.entity_category) && f.push("excluded entity category"), n.has(d) && f.push("excluded domain"), !r.has(d) && !s.has(b) && f.push("domain not included"), $.some((v) => t.exclude_labels.includes(v)) && f.push("excluded label"), Uo(b, a) && f.push("excluded by regex");
    const x = vt(e, t, b);
    if (To(x.id, x.name, t) || f.push("excluded area"), Fo(u, d, t) || f.push("inactive state"), f.length) {
      o.push({ entity_id: b, reasons: f });
      continue;
    }
    const w = qo(b, $, t), y = {
      entity: u,
      entityId: b,
      domain: d,
      name: Po(u, _ == null ? void 0 : _.name),
      icon: (_ == null ? void 0 : _.icon) ?? String(u.attributes.icon ?? t.domain_icons[d] ?? ki[d] ?? "mdi:toggle-switch-outline"),
      areaId: x.id,
      areaName: x.name,
      areaIcon: x.icon,
      labels: $,
      category: g == null ? void 0 : g.entity_category,
      hidden: !!(g != null && g.hidden_by || g != null && g.hidden),
      active: !0,
      protected: w,
      controllable: !0,
      secondary: Io(u, d, t, e),
      skipReasons: []
    };
    if (y.disabledReason = Ai(y, t), y.controllable = !y.disabledReason, !Ro(y, t)) {
      o.push({ entity_id: b, reasons: ["protected hidden"] });
      continue;
    }
    const h = i.get(x.id) ?? {
      id: x.id,
      name: x.name,
      icon: x.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0
    };
    h.entities.push(y), h.domainCounts[d] = (h.domainCounts[d] ?? 0) + 1, w && (h.protectedCount += 1), i.set(x.id, h);
  }
  const c = [...i.values()].map((u) => ({ ...u, entities: Lo(u.entities, t) }));
  return { groups: Do(c, t), skipped: o };
};
var Bo = Object.defineProperty, Vo = Object.getOwnPropertyDescriptor, j = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Vo(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && Bo(t, i, a), a;
};
const B = [
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
], Go = [
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
], Ko = {
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
}, Jo = {
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
}, R = {
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
let z = class extends re {
  constructor() {
    super(...arguments), this.config = { type: "custom:area-bubble-expander-card" }, this.activeSection = "General", this.areaSearch = "", this.entitySearch = "", this.labelSearch = "", this.registryLabels = [], this.labelRegistryStatus = "idle", this.jsonDrafts = {}, this.jsonErrors = {}, this.jsonDraftBaselines = {};
  }
  setConfig(e) {
    const t = this.cloneConfig(e);
    for (const i of Object.keys(this.jsonDrafts)) {
      const o = this.jsonCommittedText(i, t);
      this.jsonDraftBaselines[i] !== o && this.clearJsonDraft(i);
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
    const e = xe(this.config), t = Se(this.hass, e.language), i = Si(this.hass, e), o = B.find((r) => r.id === this.activeSection) ?? B[0], a = Go.filter((r) => r.section === this.activeSection);
    return p`
      <div class="editor" dir=${i ? "rtl" : "ltr"} lang=${t}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${R[t].title}</div>
            <div class="editor-subtitle">${R[t].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${R[t].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${B.map((r) => p`<option value=${r.id}>${r.title[t]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${R[t].chooseSection} aria-orientation="vertical">
            ${B.map(
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
            aria-labelledby=${`abec-editor-tab-${Math.max(0, B.findIndex((r) => r.id === o.id))}`}
          >
            <div class="section-heading">
              <ha-icon icon=${o.icon}></ha-icon>
              <div>
                <div class="section-title">${o.title[t]}</div>
                <div class="section-description">${o.description[t]}</div>
              </div>
            </div>

          ${this.activeSection === "Areas" ? this.renderAreaPicker(e) : m}
          ${this.activeSection === "Areas" ? this.renderAreaOrder(e) : m}
          ${this.activeSection === "Entities" ? this.renderEntityPicker(e) : m}
          ${this.activeSection === "Entities" ? this.renderLabelPicker(e) : m}
          ${this.activeSection === "Badge" ? this.renderBadgeTemplates(e) : m}
            ${a.map((r) => this.renderField(r, e))}
          ${this.activeSection === "Debug" ? p`<div class="field"><label class="field-label" for="abec-resulting-config">${R[t].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>` : m}
          </section>
        </div>
      </div>
    `;
  }
  async loadLabelRegistry() {
    var i, o;
    const e = (o = (i = this.hass) == null ? void 0 : i.callWS) == null ? void 0 : o.bind(this.hass);
    if (this.labelRegistryStatus !== "idle" || !e) return;
    this.labelRegistryStatus = "loading";
    const t = this.hass;
    this.labelRegistryHass = t;
    try {
      const a = await e({
        type: "config/label_registry/list"
      });
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = Array.isArray(a) ? a : [], this.labelRegistryStatus = "loaded";
    } catch {
      if (this.labelRegistryHass !== t) return;
      this.registryLabels = [], this.labelRegistryStatus = "failed";
    }
  }
  retryLabelRegistry() {
    this.labelRegistryHass = void 0, this.labelRegistryStatus = "idle", this.loadLabelRegistry();
  }
  renderAreaPicker(e) {
    const t = this.editorLanguage(e), i = R[t], o = this.areaOptions(e), a = o.filter((r) => this.matchesSearch(`${r.name} ${r.id}`, this.areaSearch));
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.areasFromHa}</strong>
            <span>${a.length} / ${o.length}</span>
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
          ${a.length ? a.map(
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
    const t = this.editorLanguage(e), i = R[t], o = this.entityOptions(e), a = o.filter(
      (r) => this.matchesSearch(`${r.name} ${r.entityId} ${r.domain} ${r.areaName} ${r.labels}`, this.entitySearch)
    );
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.entitiesFromHa}</strong>
            <span>${a.length} / ${o.length}</span>
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
          ${a.length ? a.map(
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
    const t = this.editorLanguage(e), i = R[t], o = this.labelOptions(), a = o.filter((r) => this.matchesSearch(`${r.id} ${r.name}`, this.labelSearch));
    return p`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${i.labelsFromHa}</strong>
            <span>${a.length} / ${o.length}</span>
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
            ` : m}
        <div class="picker-list compact-picker">
          ${a.length ? a.map(
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
    const t = this.editorLanguage(e), i = R[t], o = this.orderedAreaOptions(e);
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
            @click=${() => this.enableCustomAreaOrder(o)}
          >
            ${i.customOrder}
          </button>
        </div>
        <div class="picker-list compact-picker">
          ${o.map(
      (a, r) => p`
              <div
                class="picker-item order-item ${this.draggedAreaId === a.id ? "dragging" : ""} ${this.dragOverAreaId === a.id ? "drag-over" : ""}"
                @dragover=${(n) => this.dragAreaOver(n, a.id)}
                @drop=${(n) => this.dropArea(n, a.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${i.drag}
                  aria-hidden="true"
                  @dragstart=${(n) => this.startAreaDrag(n, a.id)}
                  @dragend=${this.endAreaDrag}
                ><ha-icon icon="mdi:drag-vertical"></ha-icon></span>
                <ha-icon icon=${a.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${a.name}</div>
                  <div class="picker-meta">${a.id}</div>
                </div>
                <div class="order-actions">
                  <button type="button" class="icon-action" title=${i.moveUp} aria-label=${`${i.moveUp}: ${a.name}`} ?disabled=${r === 0} @click=${() => this.moveArea(a.id, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button type="button" class="icon-action" title=${i.moveDown} aria-label=${`${i.moveDown}: ${a.name}`} ?disabled=${r === o.length - 1} @click=${() => this.moveArea(a.id, 1)}>
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
    const t = this.editorLanguage(e), i = R[t], { groups: o } = _t(this.hass, e), a = o.reduce((n, s) => n + s.entities.length, 0), r = o.length;
    return p`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${i.badgeHelper}</strong>
            <span>${a} ${i.activeNow} · ${r} ${i.activeAreas}</span>
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
    var o, a;
    const t = Object.entries(((o = this.hass) == null ? void 0 : o.areas) ?? {}).map(([r, n]) => ({
      id: n.area_id ?? n.id ?? r,
      name: n.name,
      icon: n.icon ?? "mdi:floor-plan"
    })), i = /* @__PURE__ */ new Map();
    for (const r of Object.keys(((a = this.hass) == null ? void 0 : a.states) ?? {})) {
      const n = vt(this.hass, e, r);
      i.set(n.id, { id: n.id, name: n.name, icon: n.icon });
    }
    return [...t, ...i.values()].filter((r, n, s) => s.findIndex((c) => c.id === r.id) === n).sort((r, n) => r.name.localeCompare(n.name));
  }
  orderedAreaOptions(e) {
    const t = this.areaOptions(e), i = e.custom_area_order;
    return t.sort((o, a) => {
      const r = this.orderIndex(i, o.id, o.name), n = this.orderIndex(i, a.id, a.name);
      return r - n || o.name.localeCompare(a.name);
    });
  }
  entityOptions(e) {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).map((i) => {
      const o = i.entity_id.split(".")[0] ?? "", a = vt(this.hass, e, i.entity_id);
      return {
        entityId: i.entity_id,
        domain: o,
        areaName: a.name,
        name: String(i.attributes.friendly_name ?? i.entity_id),
        icon: String(i.attributes.icon ?? e.domain_icons[o] ?? "mdi:toggle-switch-outline"),
        labels: this.labelsForEntity(i.entity_id).join(" ")
      };
    }).sort((i, o) => i.areaName.localeCompare(o.areaName) || i.name.localeCompare(o.name));
  }
  labelOptions() {
    var t, i;
    const e = /* @__PURE__ */ new Map();
    for (const o of this.registryLabels) {
      const a = o.label_id ?? o.id;
      a && e.set(a, {
        id: a,
        name: o.name ?? a,
        icon: o.icon ?? "mdi:label-outline"
      });
    }
    for (const [o, a] of Object.entries(((t = this.hass) == null ? void 0 : t.labels) ?? {})) {
      const r = a.label_id ?? o;
      e.has(r) || e.set(r, {
        id: r,
        name: a.name ?? r,
        icon: a.icon ?? "mdi:label-outline"
      });
    }
    for (const o of Object.keys(((i = this.hass) == null ? void 0 : i.states) ?? {}))
      for (const a of this.labelsForEntity(o))
        e.has(a) || e.set(a, { id: a, name: a, icon: "mdi:label-outline" });
    return [...e.values()].sort((o, a) => o.name.localeCompare(a.name));
  }
  templateSensorYaml(e) {
    const t = JSON.stringify(e.domains), i = JSON.stringify(e.exclude_domains), o = JSON.stringify(e.exclude_entities), a = JSON.stringify(e.exclude_areas), r = JSON.stringify(e.exclude_labels), n = JSON.stringify(e.active_states), s = JSON.stringify(e.inactive_states);
    return `template:
  - sensor:
      - name: Area Bubble Active Entities
        unique_id: area_bubble_active_entities
        icon: mdi:power-plug
        state: >
          {% set domains = ${t} %}
          {% set exclude_domains = ${i} %}
          {% set exclude_entities = ${o} %}
          {% set exclude_areas = ${a} %}
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
          {% set exclude_entities = ${o} %}
          {% set exclude_areas = ${a} %}
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
    var o, a, r, n;
    const t = (a = (o = this.hass) == null ? void 0 : o.entities) == null ? void 0 : a[e], i = t != null && t.device_id ? (n = (r = this.hass) == null ? void 0 : r.devices) == null ? void 0 : n[t.device_id] : void 0;
    return [.../* @__PURE__ */ new Set([...(t == null ? void 0 : t.labels) ?? [], ...(i == null ? void 0 : i.labels) ?? []])];
  }
  editorLanguage(e = xe(this.config)) {
    return Se(this.hass, e.language);
  }
  fieldLabel(e, t) {
    return t === "he" ? Ko[e.key] ?? e.label : e.label;
  }
  optionLabel(e, t, i) {
    return i === "he" ? Jo[e] ?? t : t;
  }
  fieldId(e) {
    return `abec-field-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }
  selectSection(e) {
    B.some((t) => t.id === e) && (this.activeSection = e);
  }
  changeSectionFromSelect(e) {
    this.selectSection(e.target.value);
  }
  navigateSections(e, t) {
    let i;
    (e.key === "ArrowDown" || e.key === "ArrowRight") && (i = (t + 1) % B.length), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (i = (t - 1 + B.length) % B.length), e.key === "Home" && (i = 0), e.key === "End" && (i = B.length - 1), i !== void 0 && (e.preventDefault(), this.selectSection(B[i].id), this.updateComplete.then(() => {
      var o;
      return (o = this.renderRoot.querySelector(`#abec-editor-tab-${i}`)) == null ? void 0 : o.focus();
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
    const i = xe(this.config), o = this.orderedAreaOptions(i).map((s) => s.id), a = o.indexOf(e), r = a + t;
    if (a < 0 || r < 0 || r >= o.length) return;
    const n = [...o];
    [n[a], n[r]] = [n[r], n[a]], this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  enableCustomAreaOrder(e) {
    const t = Be(this.readPath("custom_area_order"));
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
    const o = this.orderedAreaOptions(xe(this.config)).map((l) => l.id), a = o.indexOf(i), r = o.indexOf(t);
    if (a < 0 || r < 0) return;
    const n = [...o];
    n.splice(a, 1);
    const s = n.indexOf(t) + (a < r ? 1 : 0);
    n.splice(s, 0, i), this.updateKeys({ area_sort: "custom", custom_area_order: n });
  }
  endAreaDrag() {
    this.draggedAreaId = void 0, this.dragOverAreaId = void 0;
  }
  orderIndex(e, t, i) {
    const o = e.indexOf(t);
    if (o >= 0) return o;
    if (i) {
      const a = e.indexOf(i);
      if (a >= 0) return a;
    }
    return Number.MAX_SAFE_INTEGER;
  }
  toggleListValue(e, t, i, o = [t]) {
    const a = Be(this.readPath(e)), r = o.some((c) => a.includes(c)), n = r ? a.filter((c) => !o.includes(c)) : [...a.filter((c) => !o.includes(c)), t], s = { [e]: n };
    !r && i && (s[i] = Be(this.readPath(i)).filter((c) => !o.includes(c))), this.updateKeys(s);
  }
  renderField(e, t) {
    var s;
    const i = this.editorLanguage(t), o = R[i], a = this.readPath(e.key), r = this.fieldId(e.key), n = this.fieldLabel(e, i);
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
            .checked=${!!(a ?? this.readResolvedPath(t, e.key))}
            @change=${(c) => this.updateField(e, c.target.checked)}
          />
        </div>
      `;
    if (e.type === "select") {
      const c = this.stringifySelectValue(a ?? this.readResolvedPath(t, e.key));
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <select id=${r} .value=${c} @change=${(l) => this.updateField(e, this.parseSelectValue(e.key, l.target.value))}>
            ${(s = e.options) == null ? void 0 : s.map((l) => p`<option value=${l.value}>${this.optionLabel(l.value, l.label, i)}</option>`)}
          </select>
          <span class="field-helper">${o.configKey}: <code>${e.key}</code></span>
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
            .value=${String(a ?? this.readResolvedPath(t, e.key) ?? "")}
            @change=${(c) => this.updateNumberField(e, c.target)}
          />
          <span class="field-helper">${o.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "multi-text")
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <textarea id=${r} .value=${Ao(a ?? this.readResolvedPath(t, e.key))} @change=${(c) => this.updateField(e, Be(c.target.value))}></textarea>
          <span class="field-helper">${o.configKey}: <code>${e.key}</code></span>
        </div>
      `;
    if (e.type === "textarea") {
      const c = this.jsonCommittedText(e.key), l = this.jsonDrafts[e.key] ?? c, u = this.jsonErrors[e.key] ?? this.validateJson(l), b = l !== c;
      return p`
        <div class="field">
          <label class="field-label" for=${r}>${n}</label>
          <textarea
            id=${r}
            class="yaml"
            spellcheck="false"
            aria-invalid=${u ? "true" : "false"}
            aria-describedby=${`${r}-status`}
            .value=${l}
            @input=${(d) => this.updateJsonDraft(e, d.target.value)}
            @keydown=${(d) => this.handleJsonKeydown(d, e)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${r}-status`} class="json-status ${u ? "error" : ""}" role="status" aria-live="polite">
              ${u ?? (b ? o.jsonValid : `${o.configKey}: ${e.key}`)}
            </span>
            <div class="json-actions">
              <button type="button" class="action-button" ?disabled=${!b} @click=${() => this.resetJsonDraft(e.key)}>${o.reset}</button>
              <button type="button" class="action-button primary" ?disabled=${!b || !!u} @click=${() => this.applyJsonDraft(e)}>${o.apply}</button>
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
          .value=${String(a ?? this.readResolvedPath(t, e.key) ?? "")}
          @change=${(c) => this.updateField(e, c.target.value)}
        />
        <span class="field-helper">${o.configKey}: <code>${e.key}</code></span>
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
    const o = e.min ?? -1 / 0, a = e.max ?? 1 / 0;
    this.updateField(e, Math.min(a, Math.max(o, i)));
  }
  updateJsonDraft(e, t) {
    e.key in this.jsonDraftBaselines || (this.jsonDraftBaselines[e.key] = this.jsonCommittedText(e.key));
    const i = this.validateJson(t);
    this.jsonDrafts = { ...this.jsonDrafts, [e.key]: t };
    const o = { ...this.jsonErrors };
    i ? o[e.key] = i : delete o[e.key], this.jsonErrors = o;
  }
  validateJson(e) {
    if (!e.trim()) return;
    const t = this.editorLanguage();
    try {
      const i = JSON.parse(e);
      return !i || typeof i != "object" || Array.isArray(i) ? R[t].jsonObject : void 0;
    } catch (i) {
      const o = i instanceof Error ? i.message : String(i);
      return `${R[t].jsonInvalid}: ${o}`;
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
    const o = t.trim() ? JSON.parse(t) : void 0;
    this.clearJsonDraft(e.key), this.updateField(e, o);
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
    const i = xe(t), a = this.readResolvedPath(t, e) ?? this.readResolvedPath(i, e);
    return this.textareaValue(a);
  }
  updateField(e, t) {
    this.updateKey(e.key, t);
  }
  updateKey(e, t) {
    this.updateKeys({ [e]: t });
  }
  updateKeys(e) {
    const t = this.cloneConfig(this.config);
    for (const [i, o] of Object.entries(e)) this.writePath(t, i, o);
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
    return t.split(".").reduce((i, o) => {
      if (i && typeof i == "object") return i[o];
    }, e);
  }
  writePath(e, t, i) {
    const o = t.split(".");
    let a = e;
    for (const n of o.slice(0, -1)) {
      const s = a[n];
      if (s && typeof s == "object" && !Array.isArray(s)) {
        a = s;
        continue;
      }
      if (i === void 0 || i === "") return;
      a[n] = {}, a = a[n];
    }
    const r = o[o.length - 1];
    i === void 0 || i === "" ? delete a[r] : a[r] = i;
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
z.styles = ko;
j([
  Le({ attribute: !1 })
], z.prototype, "hass", 2);
j([
  C()
], z.prototype, "config", 2);
j([
  C()
], z.prototype, "activeSection", 2);
j([
  C()
], z.prototype, "areaSearch", 2);
j([
  C()
], z.prototype, "entitySearch", 2);
j([
  C()
], z.prototype, "labelSearch", 2);
j([
  C()
], z.prototype, "registryLabels", 2);
j([
  C()
], z.prototype, "labelRegistryStatus", 2);
j([
  C()
], z.prototype, "jsonDrafts", 2);
j([
  C()
], z.prototype, "jsonErrors", 2);
j([
  C()
], z.prototype, "draggedAreaId", 2);
j([
  C()
], z.prototype, "dragOverAreaId", 2);
z = j([
  nt(wi)
], z);
const Qo = Re`
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
Re`
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
const Ei = (e) => `${mo}:${e}:expanded`, Wo = (e) => {
  try {
    const t = localStorage.getItem(Ei(e));
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}, Yo = (e, t) => {
  try {
    localStorage.setItem(Ei(e), JSON.stringify(t));
  } catch {
  }
}, Ci = (e) => {
  const t = e.split("."), [i, o] = t;
  if (t.length !== 2 || !(i != null && i.trim()) || !(o != null && o.trim()))
    throw new Error(`Invalid service mapping: ${e}`);
  return { domain: i, service: o };
}, Xo = async (e, t, i) => {
  const o = i.service_mapping[t.domain];
  if (!o) throw new Error(`No turn-off service configured for ${t.domain}`);
  const a = Ci(o);
  await e.callService(a.domain, a.service, void 0, { entity_id: t.entityId });
}, ri = async (e, t, i) => {
  const o = /* @__PURE__ */ new Map();
  for (const r of Ye(t, i)) {
    const n = i.service_mapping[r.domain];
    if (!n) continue;
    const s = o.get(n) ?? [];
    s.push(r.entityId), o.set(n, s);
  }
  const a = [...o.entries()].map(([r, n]) => ({
    service: Ci(r),
    entityIds: n
  }));
  await Promise.all(a.map(({ service: r, entityIds: n }) => e.callService(r.domain, r.service, void 0, { entity_id: n })));
}, Zo = async (e, t) => {
  await e.callService("homeassistant", "turn_off", void 0, { area_id: t });
};
var ea = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, je = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? ta(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && ea(t, i, a), a;
};
let ge = class extends re {
  constructor() {
    super(...arguments), this.expanded = {}, this.cardId = Math.random().toString(36).slice(2);
  }
  static getConfigElement() {
    return document.createElement(wi);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    try {
      So(e), this.config = xe(e), this.cardId = e.id || this.stableCardId(e), this.expanded = this.config.remember_expanded_state ? Wo(this.cardId) : {}, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.hass || !this.config) return 3;
    const { groups: e } = _t(this.hass, this.config);
    return Math.max(2, 1 + e.reduce((t, i) => t + (this.isExpanded(i) ? i.entities.length : 1), 0));
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (this.error) return p`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return m;
    const e = Si(this.hass, this.config);
    this.style.setProperty("--abec-direction", e ? "rtl" : "ltr"), this.setAttribute("dir", e ? "rtl" : "ltr"), this.toggleAttribute("animations-disabled", !this.config.enable_animations), this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion), this.toggleAttribute("compact", this.config.style.compact), this.applyStyleVars();
    const { groups: t, skipped: i } = _t(this.hass, this.config), o = t.reduce((r, n) => r + n.entities.length, 0), a = t.length;
    return p`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(t, o, a) : m}
          ${t.length ? p`<div class="sections">${t.map((r) => this.renderArea(r))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug ? p`<div class="debug">${JSON.stringify(i.slice(0, 80), null, 2)}</div>` : m}
        </div>
      </ha-card>
    `;
  }
  renderHeader(e, t, i) {
    if (!this.config) return m;
    const o = this.config.title || I(this.config, this.hass, "title"), a = [
      this.config.show_total_count ? `${t} ${I(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${i} ${I(this.config, this.hass, "active_areas")}` : ""
    ].filter(Boolean).join(" · ");
    return p`
      <div class="header">
        <div class="title">
          <div>${o}</div>
          ${a ? p`<div class="subtitle">${a}</div>` : m}
        </div>
        ${this.config.show_global_turn_off ? p`
              <button
                class="icon-button danger"
                title=${I(this.config, this.hass, "turn_off_all")}
                aria-label=${I(this.config, this.hass, "turn_off_all")}
                @click=${(r) => this.turnOffGlobal(r, e)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : m}
      </div>
    `;
  }
  renderArea(e) {
    if (!this.config) return m;
    const t = this.isExpanded(e), i = e.entities.slice(0, this.config.preview_entity_count).map((c) => c.name).join(" · "), o = Ye(e.entities, this.config), a = this.config.areas[e.id] ?? this.config.areas[e.name], r = (a == null ? void 0 : a.allow_turn_off) !== !1 && o.length > 0, n = this.config.max_entities_per_area > 0 ? e.entities.slice(0, this.config.max_entities_per_area) : e.entities, s = e.entities.length - n.length;
    return p`
      <section class="area-section ${t ? "expanded" : ""}" style=${a != null && a.accent_color ? `--abec-accent:${a.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${t}
            aria-label=${`${I(this.config, this.hass, t ? "collapse_area" : "expand_area")}: ${e.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(e)}
          >
            ${this.config.show_area_icons ? p`<span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : m}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${e.name}</span>
                <span class="count">${e.entities.length} ${I(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !t && i ? p`<span class="preview">${i}</span>` : m}
              ${this.config.show_domain_chips ? this.renderDomainChips(e) : m}
              ${this.config.show_area_ids ? p`<span class="preview">${e.id}</span>` : m}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off ? p`
                  <button
                    class="icon-button danger"
                    ?disabled=${!r}
                    title=${I(this.config, this.hass, "turn_off_area")}
                    aria-label=${I(this.config, this.hass, "turn_off_area")}
                    @click=${(c) => this.turnOffArea(c, e)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                ` : m}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${t ? p`
              <div class="entities">
                ${n.map((c) => this.renderEntity(c))}
                ${s > 0 ? p`<div class="secondary">${s} ${I(this.config, this.hass, "show_more")}</div>` : m}
              </div>
            ` : m}
      </section>
    `;
  }
  renderDomainChips(e) {
    return this.config ? p`
      <div class="chips">
        ${Object.entries(e.domainCounts).map(([t, i]) => {
      var a;
      const o = ((a = this.config) == null ? void 0 : a.domain_chip_mode) ?? "icons";
      return p`
            <span class="chip" title=${ai(this.config, this.hass, t)}>
              ${o !== "text" ? p`<ha-icon icon=${this.config.domain_icons[t] ?? "mdi:circle"}></ha-icon>` : m}
              ${o !== "icons" ? p`<span>${i} ${ai(this.config, this.hass, t)}</span>` : p`<span>${i}</span>`}
            </span>
          `;
    })}
      </div>
    ` : m;
  }
  renderEntity(e) {
    if (!this.config) return m;
    const t = this.config.show_entity_secondary_info ? zo(e, this.config) : "";
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
          ${this.config.show_entity_icons ? p`<span class="icon-bubble entity-icon"><ha-icon icon=${e.icon}></ha-icon></span>` : m}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${e.name}</span>
              ${e.protected ? p`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${I(this.config, this.hass, "protected")}</span>` : m}
            </span>
            ${t ? p`<span class="secondary">${t}</span>` : m}
          </span>
        </button>
        ${this.config.show_entity_turn_off ? p`
              <button
                class="icon-button danger"
                ?disabled=${!e.controllable}
                title=${e.disabledReason ?? I(this.config, this.hass, "turn_off_entity")}
                aria-label=${I(this.config, this.hass, "turn_off_entity")}
                @click=${(i) => this.turnOffEntity(i, e)}
              >
                <ha-icon icon=${e.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            ` : m}
      </div>
    `;
  }
  renderEmpty() {
    return !this.config || !this.config.show_empty ? m : p`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || I(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || I(this.config, this.hass, "empty_subtitle")}</div>
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
    (t = this.config) != null && t.expand_on_header_tap && (this.expanded = { ...this.expanded, [e.id]: !this.isExpanded(e) }, this.config.remember_expanded_state && Yo(this.cardId, this.expanded));
  }
  handleHoldAction(e, t) {
    var i;
    e.preventDefault(), this.handleAction(t, ((i = this.config) == null ? void 0 : i.hold_action) ?? { action: "none" });
  }
  async turnOffEntity(e, t) {
    if (e.stopPropagation(), !(!this.hass || !this.config || !t.controllable || (this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(t.domain)) && !window.confirm(I(this.config, this.hass, "confirm_entity_turn_off", { entity: t.name }))))
      try {
        await Xo(this.hass, t, this.config);
      } catch (o) {
        this.reportError(o);
      }
  }
  async turnOffArea(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ye(t.entities, this.config);
    if (!i.length) return;
    const o = this.config.areas[t.id] ?? this.config.areas[t.name], a = this.config.confirm_area_turn_off || this.config.area_turn_off_mode === "homeassistant_area" || i.some((s) => this.config.dangerous_domains.includes(s.domain)), r = (o == null ? void 0 : o.confirm_turn_off) ?? a, n = `${I(this.config, this.hass, "confirm_area_turn_off", { area: t.name, count: i.length })}
${I(
      this.config,
      this.hass,
      "protected_will_remain"
    )}`;
    if (!(r && !window.confirm(n)))
      try {
        this.config.area_turn_off_mode === "homeassistant_area" ? await Zo(this.hass, t.id) : await ri(this.hass, i, this.config);
      } catch (s) {
        this.reportError(s);
      }
  }
  async turnOffGlobal(e, t) {
    if (e.stopPropagation(), !this.hass || !this.config) return;
    const i = Ye(t.flatMap((a) => a.entities), this.config);
    if (!(!i.length || (this.config.confirm_global_turn_off || i.some((a) => this.config.dangerous_domains.includes(a.domain))) && !window.confirm(I(this.config, this.hass, "confirm_global_turn_off"))))
      try {
        await ri(this.hass, i, this.config);
      } catch (a) {
        this.reportError(a);
      }
  }
  handleAction(e, t) {
    if (this.hass && t.action !== "none") {
      if (t.action === "more-info") {
        this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: !0, composed: !0, detail: { entityId: e.entityId } }));
        return;
      }
      if (t.action === "toggle") {
        this.hass.callService("homeassistant", "toggle", void 0, { entity_id: e.entityId }).catch((i) => this.reportError(i));
        return;
      }
      if (t.action === "turn-off") {
        this.turnOffEntity(new Event("click"), e);
        return;
      }
      if (t.action === "navigate" && history.pushState(null, "", t.navigation_path), t.action === "url" && window.open(t.url_path, "_blank", "noopener"), t.action === "call-service") {
        const i = t.service.split("."), [o, a] = i;
        if (i.length !== 2 || !o || !a) {
          this.reportError(new Error(`Invalid action service: ${t.service}`));
          return;
        }
        this.hass.callService(o, a, t.service_data, t.target ?? { entity_id: e.entityId }).catch((r) => this.reportError(r));
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
    for (let o = 0; o < t.length; o += 1)
      i ^= t.charCodeAt(o), i = Math.imul(i, 16777619);
    return `card-${(i >>> 0).toString(36)}`;
  }
};
ge.styles = Qo;
je([
  Le({ attribute: !1 })
], ge.prototype, "hass", 2);
je([
  C()
], ge.prototype, "config", 2);
je([
  C()
], ge.prototype, "expanded", 2);
je([
  C()
], ge.prototype, "error", 2);
ge = je([
  nt(ho)
], ge);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === "area-bubble-expander-card") || window.customCards.push({
  type: "area-bubble-expander-card",
  name: "Area Bubble Expander Card",
  description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card"
});
console.info(
  `%c AREA-BUBBLE-CARDS %c 0.20.5 ${Se(void 0, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;"
);
const me = "custom:area-bubble-overview-card", yt = "area-bubble-overview-card", Ti = "area-bubble-overview-card-editor", ni = "area-bubble-overview-card", oe = "__area_bubble_auto_fans__", J = "__area_bubble_auto_floor_heating_controls__", be = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256
}, ze = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16384
}, Pi = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8
}, ht = {
  OPEN: 1,
  CLOSE: 2,
  STOP: 8
}, G = ["climate", "floor_heating", "covers", "lights_switches", "media"], Ii = ["lights", "climate", "floor_heating", "switches", "covers", "media"], xt = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle"
}, $t = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music"
}, it = {
  on: "mdi:power",
  off: "mdi:power-off",
  open: "mdi:window-shutter-open",
  close: "mdi:window-shutter"
}, P = (e, t, i) => {
  const o = (n) => [1, 3, 5].map((s) => Number.parseInt(n.slice(s, s + 2), 16)), a = o(e), r = o(t);
  return `#${a.map((n, s) => Math.round(n * i + r[s] * (1 - i)).toString(16).padStart(2, "0")).join("")}`;
}, U = (e, t, i = 135) => `linear-gradient(${i}deg, ${e} 0%, ${t} 100%)`, ee = (e, t) => {
  const i = t === "dark", o = i ? P(e.deep, "#070e1a", 0.12) : P(e.deep, "#0a1424", 0.18), a = i ? P(e.accent, "#132034", 0.2) : P(e.accent, "#ffffff", 0.1), r = i ? P(e.accent, "#18273d", 0.28) : P(e.accent, "#ffffff", 0.2), n = i ? P(e.accent, "#060d18", 0.67) : P(e.accent, "#ffffff", 0.5);
  return {
    border_radius: i ? 24 : 26,
    blur: i ? 24 : 18,
    show_shadows: !0,
    shadow_intensity: i ? 0.32 : 0.15,
    card_transparent: !1,
    card_background: i ? U(P(e.accent, "#080f1d", 0.07), P(e.secondary, "#17243a", 0.13), 145) : U(P(e.accent, "#ffffff", 0.04), P(e.secondary, "#edf2f7", 0.1), 145),
    row_background: i ? P(e.accent, "#17243a", 0.11) : P(e.accent, "#ffffff", 0.065),
    active_surface: U(a, r),
    entity_active_surface: n,
    area_frame_color: i ? P(e.accent, "#ffffff", 0.74) : P(e.deep, "#334155", 0.72),
    active_color: i ? "#f5c451" : "#e4ad2f",
    accent_color: i ? P(e.accent, "#ffffff", 0.78) : e.deep,
    control_surface: o,
    climate_surface: i ? U(P("#2f83bd", "#17243a", 0.38), P(e.accent, "#1b2c44", 0.32)) : U(P("#4aa8db", "#ffffff", 0.3), P(e.accent, "#ffffff", 0.24)),
    climate_color: i ? "#78c9ef" : "#1d719e",
    cover_color: i ? P(e.secondary, "#ffffff", 0.72) : P(e.secondary, "#1f5164", 0.68),
    media_color: i ? P(e.secondary, "#ffffff", 0.72) : e.secondary,
    temperature_off_surface: U(o, P(e.deep, "#17243a", 0.18)),
    temperature_cool_surface: i ? U("#1d5e8e", "#2f7fad") : U("#2f73ac", "#4797c5"),
    temperature_heat_surface: i ? U("#8f4639", "#b4614d") : U("#aa543d", "#ce785a"),
    temperature_active_surface: i ? U(P(e.secondary, "#2b2440", 0.55), P(e.secondary, "#4a3c64", 0.64)) : U(P(e.secondary, "#ffffff", 0.68), P(e.secondary, "#ffffff", 0.82)),
    occupancy_active_color: i ? "#91e7b7" : "#a7efc8",
    occupancy_vacant_color: i ? "#e2e8f0" : "#f4f7fb",
    occupancy_unknown_color: i ? "#f5cf78" : "#f4cd72",
    primary_text_color: i ? "#f3f7fb" : "#172033",
    secondary_text_color: i ? "#b6c4d4" : "#536174",
    active_text_color: i ? "#f7fbff" : "#172033",
    control_text_color: "#f8fafc"
  };
}, te = {
  classic: { accent: "#5b7c9c", deep: "#2b4968", secondary: "#7a668f" },
  elegant: { accent: "#55799f", deep: "#304e70", secondary: "#725e91" },
  light: { accent: "#2d8db5", deep: "#176b91", secondary: "#7c64a8" },
  dark: { accent: "#4f8da3", deep: "#315d71", secondary: "#7768a3" },
  modern: { accent: "#557f73", deep: "#365e54", secondary: "#806a8f" },
  ocean: { accent: "#0ea5c6", deep: "#076d8a", secondary: "#2f7fb0" },
  emerald: { accent: "#20a66a", deep: "#146a48", secondary: "#318f82" },
  violet: { accent: "#8067d8", deep: "#5541a8", secondary: "#a45896" },
  coral: { accent: "#df705b", deep: "#9f493d", secondary: "#a85d75" },
  amber: { accent: "#d69b27", deep: "#8f620e", secondary: "#a36e48" },
  rose: { accent: "#d65f89", deep: "#963c61", secondary: "#9365a9" }
}, Mt = [
  "classic",
  "elegant",
  "light",
  "dark",
  "modern",
  "ocean",
  "emerald",
  "violet",
  "coral",
  "amber",
  "rose"
], wt = {
  classic: {},
  elegant: {
    border_radius: 26,
    blur: 20,
    show_shadows: !0,
    shadow_intensity: 0.18,
    card_transparent: !1,
    card_background: "linear-gradient(145deg, rgba(249,251,253,0.98) 0%, rgba(232,238,246,0.97) 55%, rgba(219,229,241,0.95) 100%)",
    row_background: "rgba(242,245,249,0.96)",
    active_surface: "linear-gradient(135deg, #edf3f8 0%, #dbe7f0 100%)",
    entity_active_surface: "#8fb7d2",
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
    active_surface: "linear-gradient(135deg, #eefbfe 0%, #d8f0f7 100%)",
    entity_active_surface: "#73c7df",
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
    active_surface: "linear-gradient(135deg, #263e50 0%, #315066 100%)",
    entity_active_surface: "#1c667b",
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
    active_surface: "linear-gradient(135deg, #ebf3ef 0%, #d7e5de 100%)",
    entity_active_surface: "#8cb9aa",
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
  },
  ocean: ee(te.ocean, "light"),
  emerald: ee(te.emerald, "light"),
  violet: ee(te.violet, "light"),
  coral: ee(te.coral, "light"),
  amber: ee(te.amber, "light"),
  rose: ee(te.rose, "light")
}, ia = Object.fromEntries(
  Mt.map((e) => [e, {
    light: ee(te[e], "light"),
    dark: ee(te[e], "dark")
  }])
), Oi = (e, t) => t === "recommended" ? wt[e] : ia[e][t], q = {
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
  entity_active_surface: "#7fb8c1",
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
}, Ve = {
  type: me,
  target_icon: "",
  language: "auto",
  rtl: "auto",
  theme_preset: "classic",
  theme_mode: "recommended",
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
  strip_area_name_from_entity_names: !0,
  entity_state_language: "auto",
  light_tile_shape: "rectangle",
  light_icon_position: "start",
  light_show_state: !0,
  entity_card_size: "medium",
  subgroup_titles: {},
  fan_display_mode: "subgroup",
  heating_controls_display_mode: "subgroup",
  show_empty_sections: !1,
  default_expanded: !1,
  floor_default_expanded: !0,
  remember_expanded_state: !0,
  section_order: G,
  section_styles: {},
  section_action_mode: "dual",
  section_action_presentation: "icon",
  climate_mode_presentation: "both",
  section_action_icons: it,
  quick_actions: Ii,
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
}, V = (e, t) => {
  const i = e.attributes.supported_features;
  return typeof i != "number" || (i & t) !== 0;
}, zi = (e) => Array.isArray(e.entity.attributes.hvac_modes) ? e.entity.attributes.hvac_modes.map(String) : [], $e = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, si = (e) => ({
  temperature: V(e.entity, be.TARGET_TEMPERATURE) ? $e(e, "temperature") : void 0,
  low: V(e.entity, be.TARGET_TEMPERATURE_RANGE) ? $e(e, "target_temp_low") : void 0,
  high: V(e.entity, be.TARGET_TEMPERATURE_RANGE) ? $e(e, "target_temp_high") : void 0
}), Ge = (e, t) => {
  const i = $e(e, "target_temp_step");
  return i !== void 0 && i > 0 ? i : t.toUpperCase().includes("F") ? 1 : 0.5;
}, oa = (e) => {
  var i;
  const t = String(e).toLowerCase();
  return t.includes("e-") ? Math.min(6, Number(t.split("e-")[1]) || 0) : Math.min(6, ((i = t.split(".")[1]) == null ? void 0 : i.length) ?? 0);
}, mt = (e, t, i) => {
  const o = $e(e, "min_temp") ?? -100, a = $e(e, "max_temp") ?? 100, r = Math.min(a, Math.max(o, t));
  return Number(r.toFixed(oa(i)));
}, ci = (e) => `${e.temperature ?? ""}|${e.low ?? ""}|${e.high ?? ""}`, aa = /* @__PURE__ */ new Set(["onoff", "unknown"]), ra = (e) => {
  if (e.domain !== "light") return !1;
  const t = Array.isArray(e.entity.attributes.supported_color_modes) ? e.entity.attributes.supported_color_modes.map(String) : [], i = typeof e.entity.attributes.color_mode == "string" ? [e.entity.attributes.color_mode] : [];
  return [...t, ...i].some((o) => !aa.has(o)) || typeof e.entity.attributes.brightness == "number";
}, li = (e) => {
  if (!e.powered) return 0;
  const t = e.entity.attributes.brightness;
  return typeof t != "number" || !Number.isFinite(t) ? 100 : Math.min(100, Math.max(0, Math.round(t / 255 * 100)));
}, Me = (e) => {
  const t = e.attributes.current_position;
  if (typeof t == "number" && Number.isFinite(t)) return Math.min(100, Math.max(0, t));
  if (typeof t == "string" && t.trim() && Number.isFinite(Number(t)))
    return Math.min(100, Math.max(0, Number(t)));
}, Mi = (e) => {
  const t = String(e.state ?? "").toLowerCase();
  if (["", "unknown", "unavailable"].includes(t)) return !1;
  if (["opening", "closing"].includes(t)) return !0;
  const i = Me(e);
  return i !== void 0 ? i > 0 : t === "open";
}, kt = (e, t, i, o = !1) => {
  const a = t.toLowerCase();
  return e === "stop_cover" ? !["opening", "closing"].includes(a) : a === "opening" ? e === "open_cover" : a === "closing" ? e === "close_cover" : o ? !1 : e === "open_cover" ? i !== void 0 ? i >= 100 : a === "open" : i !== void 0 ? i <= 0 : a === "closed";
}, Fi = (e, t) => e.domain === "cover" && !kt(
  t ? "open_cover" : "close_cover",
  e.entity.state,
  Me(e.entity),
  e.entity.attributes.assumed_state === !0
), ot = (e, t) => {
  const i = t === "open_cover" ? ht.OPEN : t === "close_cover" ? ht.CLOSE : ht.STOP;
  return V(e, i);
}, le = (e) => e.powered && e.domain !== "cover" && e.ignoreActivity !== !0, X = (e, t) => {
  if (e.domain === "climate") {
    const i = t ? be.TURN_ON : be.TURN_OFF;
    if (V(e.entity, i)) return { service: t ? "turn_on" : "turn_off" };
    const o = zi(e);
    if (!t && o.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const a = o.find((r) => r !== "off");
    return t && a ? { service: "set_hvac_mode", data: { hvac_mode: a } } : void 0;
  }
  if (e.domain === "media_player") {
    const i = t ? ze.TURN_ON : ze.TURN_OFF;
    return V(e.entity, i) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  }
  if (e.domain === "water_heater")
    return V(e.entity, Pi.ON_OFF) ? { service: t ? "turn_on" : "turn_off" } : void 0;
  if (["light", "switch", "fan", "input_boolean"].includes(e.domain))
    return { service: t ? "turn_on" : "turn_off" };
}, Ni = (e, t) => t === "lights" ? e.domain === "light" : t === "switches" ? e.domain === "switch" && e.section === "lights_switches" : t === "climate" ? e.domain === "climate" : t === "fans" ? e.section === "climate" && (e.domain === "fan" || e.group === oe) : t === "heating_controls" ? e.section === "floor_heating" && e.group === J : t === "floor_heating" ? e.section === "floor_heating" : t === "covers" ? e.domain === "cover" : e.domain === "media_player", pe = (e, t) => e.allEntities.filter((i) => Ni(i, t)), na = (e, t) => t.map((i) => ({ action: i, entities: pe(e, i) })).filter(({ entities: i }) => i.some((o) => o.powered && o.ignoreActivity !== !0)), St = (e, t, i) => {
  if (Ni(t, e)) {
    if (e === "covers") {
      const o = i ? "open_cover" : "close_cover";
      return t.domain !== "cover" || !ot(t.entity, o) ? void 0 : { service: o };
    }
    return X(t, i);
  }
}, Ft = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const { entity: i, service: o } of e) {
    const a = `${o.domain}.${o.service}:${JSON.stringify(o.data ?? {})}`, r = t.get(a) ?? { ...o, entityIds: [] };
    r.entityIds.push(i.entityId), t.set(a, r);
  }
  return [...t.values()];
}, Nt = async (e, t, i) => {
  const o = await Promise.allSettled(
    t.map((r) => e.callService(r.domain, r.service, r.data, { entity_id: r.entityIds }))
  ), a = o.filter((r) => r.status === "rejected");
  if (a.length) throw new Error(`${a.length} of ${o.length} ${i} failed.`);
}, qi = (e, t, i) => {
  const o = [];
  for (const a of pe(e, t)) {
    if (!a.available || a.protected || !(t === "covers" ? Fi(a, i) : a.powered !== i)) continue;
    const n = St(t, a, i);
    n && o.push({ entity: a, service: { domain: a.domain, ...n } });
  }
  return o;
}, Ke = (e, t, i) => qi(e, t, i).map(({ entity: o }) => o), sa = async (e, t, i, o) => {
  const a = qi(t, i, o);
  await Nt(e, Ft(a), "area actions");
}, Ri = (e, t) => {
  const i = [];
  for (const o of e.allEntities) {
    if (o.domain === "cover" || !o.available || o.protected || o.powered === t) continue;
    const a = X(o, t);
    a && i.push({ entity: o, service: { domain: o.domain, ...a } });
  }
  return i;
}, Je = (e, t = !1) => Ri(e, t).map(({ entity: i }) => i), di = async (e, t, i) => {
  await Nt(e, Ft(Ri(t, i)), "room actions");
}, ca = (e, t, i) => {
  if (e.id === "covers") {
    const a = i ? "open_cover" : "close_cover";
    return t.domain !== "cover" || !ot(t.entity, a) ? void 0 : { domain: "cover", service: a };
  }
  const o = X(t, i);
  return o ? { domain: t.domain, ...o } : void 0;
}, Di = (e, t) => {
  const i = [];
  for (const o of e.entities) {
    if (!o.available || o.protected || !(e.id === "covers" ? Fi(o, t) : o.powered !== t)) continue;
    const r = ca(e, o, t);
    r && i.push({ entity: o, service: r });
  }
  return i;
}, bt = (e, t = !1) => Di(e, t).map(({ entity: i }) => i), la = async (e, t, i) => {
  const o = Di(t, i);
  await Nt(e, Ft(o), "section actions");
}, K = (e, t, i, o) => {
  const a = t.split(".")[0] ?? "homeassistant";
  return e.callService(a, i, o, { entity_id: t });
}, L = (e) => !!e && typeof e == "object" && !Array.isArray(e), D = (e) => Array.isArray(e) ? e.map(String).map((t) => t.trim()).filter(Boolean) : [], Li = (e) => {
  const t = new Set(G), i = D(e).filter((o) => t.has(o));
  return [.../* @__PURE__ */ new Set([...i, ...G])];
}, At = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of G) {
    const o = D(e[i]);
    o.length && (t[i] = o);
  }
  return t;
}, ji = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of G)
    typeof e[i] == "string" && (t[i] = e[i]);
  return t;
}, Et = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of ["fans", "heating_controls"])
    typeof e[i] == "string" && e[i].trim() && (t[i] = e[i].trim());
  return t;
}, Hi = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const i of G) {
    const o = e[i];
    if (!L(o)) continue;
    const a = typeof o.background == "string" ? o.background.trim() : "", r = typeof o.border_color == "string" ? o.border_color.trim() : "", n = typeof o.border_width == "number" && Number.isFinite(o.border_width) ? Math.min(8, Math.max(0, o.border_width)) : void 0, s = /* @__PURE__ */ new Set(["solid", "dashed", "dotted"]), c = typeof o.border_style == "string" && s.has(o.border_style) ? o.border_style : void 0, l = typeof o.columns == "number" && Number.isFinite(o.columns) ? Math.min(i === "covers" ? 2 : 3, Math.max(1, Math.round(o.columns))) : void 0, u = typeof o.entity_height == "number" && Number.isFinite(o.entity_height) ? Math.min(140, Math.max(44, o.entity_height)) : void 0, b = /* @__PURE__ */ new Set(["icon", "text", "both"]), d = typeof o.action_presentation == "string" && b.has(o.action_presentation) ? o.action_presentation : void 0;
    t[i] = {
      ...a ? { background: a } : {},
      ...r ? { border_color: r } : {},
      ...n !== void 0 ? { border_width: n } : {},
      ...c ? { border_style: c } : {},
      ...typeof o.show_border == "boolean" ? { show_border: o.show_border } : {},
      ...l !== void 0 ? { columns: l } : {},
      ...u !== void 0 ? { entity_height: u } : {},
      ...d ? { action_presentation: d } : {}
    };
  }
  return t;
}, da = (e) => {
  const t = L(e) ? e : {};
  return Object.fromEntries(
    Object.keys(it).map((i) => {
      const o = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, o || it[i]];
    })
  );
}, pa = (e) => {
  const t = /* @__PURE__ */ new Set(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(D(e).filter((i) => t.has(i)))];
}, ua = (e) => {
  const t = L(e) ? e : {};
  return Object.fromEntries(
    Object.keys($t).map((i) => {
      const o = typeof t[i] == "string" ? t[i].trim() : "";
      return [i, o || $t[i]];
    })
  );
}, ha = (e) => {
  if (!L(e)) return {};
  const t = {};
  for (const [i, o] of Object.entries(e)) {
    if (!L(o)) continue;
    const a = /* @__PURE__ */ new Set(["compact", "medium", "wide"]);
    t[i] = {
      ...typeof o.name == "string" && o.name.trim() ? { name: o.name.trim() } : {},
      ...typeof o.icon == "string" && o.icon.trim() ? { icon: o.icon.trim() } : {},
      ...typeof o.parent_area == "string" && o.parent_area.trim() ? { parent_area: o.parent_area.trim() } : {},
      ...typeof o.show_when_parent_collapsed == "boolean" ? { show_when_parent_collapsed: o.show_when_parent_collapsed } : {},
      ...typeof o.hidden == "boolean" ? { hidden: o.hidden } : {},
      ...typeof o.default_expanded == "boolean" ? { default_expanded: o.default_expanded } : {},
      ...o.open_mode === "expander" || o.open_mode === "popup" ? { open_mode: o.open_mode } : {},
      ...typeof o.temperature_entity == "string" && o.temperature_entity.trim() ? { temperature_entity: o.temperature_entity.trim() } : {},
      ...typeof o.occupancy_count_entity == "string" && o.occupancy_count_entity.trim() ? { occupancy_count_entity: o.occupancy_count_entity.trim() } : {},
      occupancy_entities: D(o.occupancy_entities),
      ...Array.isArray(o.section_order) ? { section_order: Li(o.section_order) } : {},
      ...Array.isArray(o.subarea_order) ? { subarea_order: D(o.subarea_order) } : {},
      subgroup_titles: Et(o.subgroup_titles),
      ...o.fan_display_mode === "subgroup" || o.fan_display_mode === "button" ? { fan_display_mode: o.fan_display_mode } : {},
      ...o.heating_controls_display_mode === "subgroup" || o.heating_controls_display_mode === "button" ? { heating_controls_display_mode: o.heating_controls_display_mode } : {},
      ...typeof o.entity_card_size == "string" && a.has(o.entity_card_size) ? { entity_card_size: o.entity_card_size } : {},
      section_titles: ji(o.section_titles),
      section_styles: Hi(o.section_styles),
      entity_order: At(o.entity_order),
      include_entities: At(o.include_entities),
      exclude_entities: D(o.exclude_entities)
    };
  }
  return t;
}, ma = (e) => {
  if (!L(e)) return {};
  const t = new Set(G), i = {}, o = /* @__PURE__ */ new Set(["rectangle", "square"]), a = /* @__PURE__ */ new Set(["start", "left", "right", "center"]), r = /* @__PURE__ */ new Set(["auto", "he", "en"]);
  for (const [n, s] of Object.entries(e))
    L(s) && (i[n] = {
      ...typeof s.name == "string" && s.name.trim() ? { name: s.name.trim() } : {},
      ...typeof s.strip_area_name == "boolean" ? { strip_area_name: s.strip_area_name } : {},
      ...typeof s.icon == "string" && s.icon.trim() ? { icon: s.icon.trim() } : {},
      ...typeof s.section == "string" && t.has(s.section) ? { section: s.section } : {},
      ...typeof s.group == "string" && s.group.trim() ? { group: s.group.trim() } : {},
      ...typeof s.hidden == "boolean" ? { hidden: s.hidden } : {},
      ...typeof s.protected == "boolean" ? { protected: s.protected } : {},
      ...typeof s.ignore_activity == "boolean" ? { ignore_activity: s.ignore_activity } : {},
      ...typeof s.tile_shape == "string" && o.has(s.tile_shape) ? { tile_shape: s.tile_shape } : {},
      ...typeof s.icon_position == "string" && a.has(s.icon_position) ? { icon_position: s.icon_position } : {},
      ...typeof s.show_state == "boolean" ? { show_state: s.show_state } : {},
      ...typeof s.state_language == "string" && r.has(s.state_language) ? { state_language: s.state_language } : {}
    });
  return i;
}, Pe = (e) => {
  const t = { ...Ve, ...e }, i = ji(e.section_titles), o = L(e.style) ? e.style : {}, r = new Set(Mt).has(e.theme_preset) ? e.theme_preset : "classic", s = (/* @__PURE__ */ new Set(["recommended", "light", "dark"])).has(e.theme_mode) ? e.theme_mode : "recommended", c = Oi(r, s), l = { ...c, ...o }, u = l.area_name_size, b = typeof u == "number" && Number.isFinite(u) ? Math.min(24, Math.max(11, u)) : q.area_name_size, d = typeof l.card_background == "string" && l.card_background.trim() ? l.card_background.trim() : q.card_background, g = typeof l.card_transparent == "boolean" ? l.card_transparent : q.card_transparent, _ = (v) => {
    const k = l[v];
    return typeof k == "string" && k.trim() || q[v];
  }, $ = (v, k, A) => {
    const E = l[v];
    return typeof E == "number" && Number.isFinite(E) ? Math.min(A, Math.max(k, E)) : q[v];
  }, f = /* @__PURE__ */ new Set(["auto", "he", "en"]), x = /* @__PURE__ */ new Set(["rectangle", "square"]), w = /* @__PURE__ */ new Set(["start", "left", "right", "center"]), y = /* @__PURE__ */ new Set(["icon", "text", "both"]), h = /* @__PURE__ */ new Set(["compact", "medium", "wide"]);
  return {
    ...t,
    type: me,
    id: typeof e.id == "string" ? e.id : "",
    area: typeof e.area == "string" && e.area ? e.area : void 0,
    floor: typeof e.floor == "string" && e.floor ? e.floor : void 0,
    title: typeof e.title == "string" ? e.title : "",
    target_icon: typeof e.target_icon == "string" ? e.target_icon.trim() : "",
    theme_preset: r,
    theme_mode: s,
    show_area_expand_button: typeof e.show_area_expand_button == "boolean" ? e.show_area_expand_button : Ve.show_area_expand_button,
    show_floor_expand_button: typeof e.show_floor_expand_button == "boolean" ? e.show_floor_expand_button : Ve.show_floor_expand_button,
    area_open_mode: e.area_open_mode === "popup" ? "popup" : "expander",
    quick_actions_position: e.quick_actions_position === "near_name" ? "near_name" : "opposite",
    climate_tag_position: ["left", "right", "top", "bottom"].includes(String(e.climate_tag_position)) ? e.climate_tag_position : "left",
    show_fan_tag: typeof e.show_fan_tag == "boolean" ? e.show_fan_tag : !0,
    strip_area_name_from_entity_names: typeof e.strip_area_name_from_entity_names == "boolean" ? e.strip_area_name_from_entity_names : Ve.strip_area_name_from_entity_names,
    entity_state_language: f.has(e.entity_state_language) ? e.entity_state_language : "auto",
    light_tile_shape: x.has(e.light_tile_shape) ? e.light_tile_shape : "rectangle",
    light_icon_position: w.has(e.light_icon_position) ? e.light_icon_position : "start",
    light_show_state: typeof e.light_show_state == "boolean" ? e.light_show_state : !0,
    entity_card_size: h.has(e.entity_card_size) ? e.entity_card_size : "medium",
    fan_display_mode: e.fan_display_mode === "button" ? "button" : "subgroup",
    heating_controls_display_mode: e.heating_controls_display_mode === "button" ? "button" : "subgroup",
    section_order: Li(e.section_order),
    section_titles: Object.fromEntries(
      G.map((v) => [v, typeof i[v] == "string" ? i[v] : ""])
    ),
    section_styles: Object.fromEntries(
      G.map((v) => [v, Hi(e.section_styles)[v] ?? {}])
    ),
    section_action_mode: e.section_action_mode === "toggle" ? "toggle" : "dual",
    section_action_presentation: y.has(e.section_action_presentation) ? e.section_action_presentation : "icon",
    climate_mode_presentation: y.has(e.climate_mode_presentation) ? e.climate_mode_presentation : "both",
    section_action_icons: da(e.section_action_icons),
    subgroup_titles: {
      fans: Et(e.subgroup_titles).fans ?? "",
      heating_controls: Et(e.subgroup_titles).heating_controls ?? ""
    },
    quick_actions: pa(e.quick_actions ?? t.quick_actions),
    quick_action_icons: ua(e.quick_action_icons),
    area_order: D(e.area_order),
    floor_heating_labels: D(t.floor_heating_labels),
    floor_heating_entities: D(t.floor_heating_entities),
    occupancy_device_classes: D(t.occupancy_device_classes),
    include_entities: At(e.include_entities),
    exclude_entities: D(t.exclude_entities),
    protected_labels: D(t.protected_labels),
    protected_entities: D(t.protected_entities),
    area_overrides: ha(e.area_overrides),
    entity_overrides: ma(e.entity_overrides),
    style: {
      ...q,
      ...c,
      ...o,
      area_name_size: b,
      card_background: d,
      card_transparent: g,
      primary_text_color: _("primary_text_color"),
      secondary_text_color: _("secondary_text_color"),
      active_text_color: _("active_text_color"),
      control_text_color: _("control_text_color"),
      entity_active_surface: _("entity_active_surface"),
      area_frame_color: _("area_frame_color"),
      area_frame_width: typeof l.area_frame_width == "number" && Number.isFinite(l.area_frame_width) ? Math.min(8, Math.max(0, l.area_frame_width)) : q.area_frame_width,
      entity_frame_color: _("entity_frame_color"),
      entity_frame_width: typeof l.entity_frame_width == "number" && Number.isFinite(l.entity_frame_width) ? Math.min(6, Math.max(0, l.entity_frame_width)) : q.entity_frame_width,
      climate_tag_gap: typeof l.climate_tag_gap == "number" && Number.isFinite(l.climate_tag_gap) ? Math.min(20, Math.max(0, l.climate_tag_gap)) : q.climate_tag_gap,
      link_section_frame_color: typeof l.link_section_frame_color == "boolean" ? l.link_section_frame_color : q.link_section_frame_color,
      section_frame_brightness: typeof l.section_frame_brightness == "number" && Number.isFinite(l.section_frame_brightness) ? Math.min(100, Math.max(-100, l.section_frame_brightness)) : q.section_frame_brightness,
      occupancy_active_color: _("occupancy_active_color"),
      occupancy_vacant_color: _("occupancy_vacant_color"),
      occupancy_unknown_color: _("occupancy_unknown_color"),
      quick_action_size: $("quick_action_size", 28, 52),
      quick_action_icon_size: $("quick_action_icon_size", 14, 34),
      section_action_size: $("section_action_size", 36, 56),
      section_action_icon_size: $("section_action_icon_size", 16, 36),
      category_gap: $("category_gap", 0, 40)
    }
  };
}, ba = (e) => {
  if (!L(e)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (e.type && e.type !== me) throw new Error(`Card type must be ${me}.`);
  if (e.area && e.floor) throw new Error("Choose either an area or a floor, not both.");
  if (e.section_order && new Set(e.section_order).size !== e.section_order.length)
    throw new Error("section_order cannot contain duplicates.");
}, fa = {
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
}, ga = {
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
}, va = {
  he: {
    lights: "תאורה",
    climate: "מיזוג אוויר",
    floor_heating: "חימום רצפתי",
    switches: "מפסקים",
    covers: "תריסים",
    media: "מוזיקה",
    fans: "מאווררים",
    heating_controls: "בקרי חימום"
  },
  en: {
    lights: "Lights",
    climate: "Climate",
    floor_heating: "Floor heating",
    switches: "Switches",
    covers: "Covers",
    media: "Music",
    fans: "Fans",
    heating_controls: "Heating controls"
  }
}, Z = (e, t) => {
  var o;
  if (t.language === "he" || t.language === "en") return t.language;
  const i = ((o = e == null ? void 0 : e.locale) == null ? void 0 : o.language) ?? (e == null ? void 0 : e.language) ?? document.documentElement.lang;
  return i != null && i.toLowerCase().startsWith("he") ? "he" : "en";
}, _a = (e, t) => typeof t.rtl == "boolean" ? t.rtl : Z(e, t) === "he" || document.documentElement.dir === "rtl", N = (e, t, i) => fa[Z(e, t)][i], ya = (e, t, i, o) => o || t.section_titles[i] || ga[Z(e, t)][i], pi = (e, t, i) => va[Z(e, t)][i], Ae = (e) => e.split(".")[0] ?? "", Ct = (e) => typeof e == "number" && Number.isFinite(e) ? e : typeof e == "string" && e.trim() && Number.isFinite(Number(e)) ? Number(e) : void 0, xa = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries((e == null ? void 0 : e.areas) ?? {})) t.set(o.area_id ?? o.id ?? i, o);
  return t;
}, $a = (e) => Object.entries((e == null ? void 0 : e.floors) ?? {}).map(([t, i]) => ({ ...i, id: i.floor_id ?? i.id ?? t })), Xe = (e, t) => {
  var a, r;
  const i = (a = e == null ? void 0 : e.entities) == null ? void 0 : a[t], o = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return (i == null ? void 0 : i.area_id) ?? (o == null ? void 0 : o.area_id) ?? void 0;
}, wa = (e, t) => {
  var a, r;
  const i = (a = e == null ? void 0 : e.entities) == null ? void 0 : a[t], o = i != null && i.device_id ? (r = e == null ? void 0 : e.devices) == null ? void 0 : r[i.device_id] : void 0;
  return [.../* @__PURE__ */ new Set([...(i == null ? void 0 : i.labels) ?? [], ...(o == null ? void 0 : o.labels) ?? []])];
}, ka = (e, t, i, o) => {
  var n, s, c;
  const a = e.entity_overrides[o];
  if (a != null && a.section) return a.section;
  const r = e.area_overrides[t] ?? e.area_overrides[i ?? ""];
  for (const l of e.section_order)
    if ((s = (n = r == null ? void 0 : r.include_entities) == null ? void 0 : n[l]) != null && s.includes(o) || (c = e.include_entities[l]) != null && c.includes(o)) return l;
}, Sa = (e, t, i, o, a, r, n) => {
  const s = ka(e, t, i, o);
  if (s) return s;
  const c = `${o} ${r} ${n.join(" ")}`.toLocaleLowerCase(), l = /(?:under[\s_-]*floor|floor[\s_-]*heating|חימום\s*(?:תת[\s_-]*)?רצפתי)/u.test(c), u = /(?:^|[\s._-])(?:fan|blower|מאוורר(?:ים)?)(?:$|[\s._-])/u.test(c);
  if (e.floor_heating_entities.includes(o) || n.some((b) => e.floor_heating_labels.includes(b)) || l)
    return "floor_heating";
  if (["switch", "input_boolean"].includes(a) && u || a === "climate" || a === "fan") return "climate";
  if (a === "cover") return "covers";
  if (a === "light" || a === "switch") return "lights_switches";
  if (a === "media_player") return "media";
}, Aa = (e, t, i, o, a) => {
  const r = `${i} ${o} ${a.join(" ")}`.toLocaleLowerCase(), n = /(?:^|[\s._-])(?:fan|blower|מאוורר(?:ים)?)(?:$|[\s._-])/u.test(r);
  if (e === "climate" && (t === "fan" || n)) return oe;
  if (e === "floor_heating" && ["switch", "input_boolean"].includes(t)) return J;
}, Ea = (e, t = Ae(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return t === "cover" ? Mi(e) : ["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(i) ? !1 : t === "climate" || t === "water_heater" ? i !== "off" : t === "media_player" ? ["on", "playing", "paused", "buffering"].includes(i) : i === "on";
}, Ui = (e, t = Ae(e.entity_id)) => {
  const i = String(e.state ?? "").toLowerCase();
  return t === "cover" ? Mi(e) : ["", "unknown", "unavailable"].includes(i) ? !1 : t === "media_player" ? !["off", "standby"].includes(i) : t === "climate" || t === "water_heater" ? i !== "off" : i === "on";
}, Ca = (e) => {
  const t = e.filter((a) => a.domain === "climate" && a.section === "climate" && a.available);
  if (!t.length) return "none";
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const r = String(a.entity.attributes.hvac_action ?? "").toLowerCase(), n = String(a.entity.state ?? "").toLowerCase();
    r === "heating" ? i.add("heat") : r === "cooling" ? i.add("cool") : ["drying", "fan"].includes(r) ? i.add("active") : r === "off" ? i.add("off") : n === "heat" ? i.add("heat") : n === "cool" ? i.add("cool") : n === "off" ? i.add("off") : i.add("active");
  }
  const o = [...i].filter((a) => a !== "off");
  return o.length ? new Set(o).size > 1 || i.has("active") ? "active" : i.has("heat") ? "heat" : i.has("cool") ? "cool" : "active" : "off";
}, Ta = (e, t, i) => {
  var o;
  return i || ((o = e == null ? void 0 : e.formatEntityName) == null ? void 0 : o.call(e, t)) || String(t.attributes.friendly_name ?? t.entity_id);
}, Pa = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Ia = (e, t) => {
  let i = e.trim();
  const o = [...new Set(t.map((a) => a == null ? void 0 : a.trim()).filter((a) => !!a))].sort((a, r) => r.length - a.length);
  for (const a of o) {
    const r = Pa(a).replace(/\s+/g, "\\s+"), n = "[\\s._\\-–—·|/\\\\]";
    i = i.replace(new RegExp(`(?:^|${n})${r}(?=$|${n})`, "giu"), " ");
  }
  return i = i.replace(/^[\s._\-–—·|/\\]+|[\s._\-–—·|/\\]+$/gu, "").replace(/\s{2,}/g, " "), i || e.trim();
}, Oa = (e, t, i) => i || (typeof e.attributes.icon == "string" ? e.attributes.icon : {
  climate: "mdi:air-conditioner",
  fan: "mdi:fan",
  cover: "mdi:window-shutter",
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  media_player: "mdi:speaker"
}[t] ?? "mdi:circle-outline"), ui = (e, t) => {
  const i = (e == null ? void 0 : e.indexOf(t)) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}, ft = (e) => {
  if (!e) return {};
  const t = Ct(e.attributes.current_temperature), i = Ct(e.state), o = t ?? i, a = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return { value: o, unit: a };
}, hi = (e) => {
  if (!e.length) return;
  const t = [...e].sort((o, a) => o - a), i = Math.floor(t.length / 2);
  return t.length % 2 ? t[i] : (t[i - 1] + t[i]) / 2;
}, za = (e, t, i, o, a, r) => {
  var u, b;
  const n = a.area_overrides[t] ?? a.area_overrides[(i == null ? void 0 : i.name) ?? ""], s = [...new Set([n == null ? void 0 : n.temperature_entity, i == null ? void 0 : i.temperature_entity_id].filter((d) => !!d).filter((d) => !r.has(d)))];
  for (const d of s) {
    const g = ft(e == null ? void 0 : e.states[d]);
    if (g.value !== void 0) return { temperature: g.value, unit: g.unit };
  }
  const c = o.map((d) => e == null ? void 0 : e.states[d]).filter((d) => !!d).filter((d) => Ae(d.entity_id) === "sensor" && d.attributes.device_class === "temperature").map(ft).filter((d) => d.value !== void 0);
  if (c.length) return { temperature: hi(c.map((d) => d.value)), unit: (u = c.find((d) => d.unit)) == null ? void 0 : u.unit };
  const l = o.map((d) => e == null ? void 0 : e.states[d]).filter((d) => d !== void 0 && Ae(d.entity_id) === "climate").map(ft).filter((d) => d.value !== void 0);
  return { temperature: hi(l.map((d) => d.value)), unit: (b = l.find((d) => d.unit)) == null ? void 0 : b.unit };
}, Ma = (e, t, i, o, a, r) => {
  const n = a.area_overrides[t] ?? a.area_overrides[i ?? ""], s = n == null ? void 0 : n.occupancy_count_entity;
  if (s && !r.has(s)) {
    const _ = e == null ? void 0 : e.states[s];
    if (_) {
      const $ = Ct(_.state);
      if ($ !== void 0) {
        const f = Math.max(0, Math.round($));
        return { occupancy: f > 0 ? "occupied" : "vacant", count: f, countSource: "entity", entities: [s] };
      }
      return { occupancy: "unknown", countSource: "entity", entities: [s] };
    }
  }
  const c = ((n == null ? void 0 : n.occupancy_entities) ?? []).filter((_) => !r.has(_)), l = c.length ? c : o.filter((_) => {
    const $ = e == null ? void 0 : e.states[_];
    return Ae(_) === "binary_sensor" && a.occupancy_device_classes.includes(String(($ == null ? void 0 : $.attributes.device_class) ?? ""));
  });
  if (!l.length) return { occupancy: "none", countSource: "none", entities: [] };
  const u = l.map((_) => {
    var $;
    return String((($ = e == null ? void 0 : e.states[_]) == null ? void 0 : $.state) ?? "unknown").toLowerCase();
  }), b = /* @__PURE__ */ new Set(["on", "home", "occupied", "present", "detected"]), d = /* @__PURE__ */ new Set(["off", "not_home", "away", "vacant", "clear"]), g = u.filter((_) => b.has(_)).length;
  return g > 0 ? { occupancy: "occupied", count: g, countSource: "sensors", entities: l } : u.every((_) => d.has(_)) ? { occupancy: "vacant", count: 0, countSource: "sensors", entities: l } : { occupancy: "unknown", countSource: "sensors", entities: l };
}, Fa = (e, t, i, o, a) => {
  var $, f, x, w, y, h;
  const r = t.area_overrides[i] ?? t.area_overrides[(o == null ? void 0 : o.name) ?? ""];
  if (r != null && r.hidden) return;
  const n = Object.values((r == null ? void 0 : r.include_entities) ?? {}).flat(), s = [.../* @__PURE__ */ new Set([...a, ...n])], c = /* @__PURE__ */ new Set([...t.exclude_entities, ...(r == null ? void 0 : r.exclude_entities) ?? []]);
  for (const [v, k] of Object.entries(t.entity_overrides))
    k.hidden === !0 && c.add(v);
  for (const v of s)
    (($ = t.entity_overrides[v]) == null ? void 0 : $.hidden) === !0 && c.add(v);
  const l = s.filter((v) => !c.has(v)), u = [];
  for (const v of s) {
    const k = e == null ? void 0 : e.states[v];
    if (!k || c.has(v)) continue;
    const A = (f = e == null ? void 0 : e.entities) == null ? void 0 : f[v], E = A != null && A.device_id ? (x = e == null ? void 0 : e.devices) == null ? void 0 : x[A.device_id] : void 0, S = t.entity_overrides[v];
    if (S != null && S.hidden || A != null && A.hidden || A != null && A.hidden_by || A != null && A.disabled_by || E != null && E.disabled_by || (A == null ? void 0 : A.entity_category) === "config" || (A == null ? void 0 : A.entity_category) === "diagnostic") continue;
    const F = Ae(v), T = wa(e, v), ve = Ta(e, k, S == null ? void 0 : S.name), st = (S == null ? void 0 : S.strip_area_name) ?? t.strip_area_name_from_entity_names ? Ia(ve, [r == null ? void 0 : r.name, o == null ? void 0 : o.name]) : ve, _e = Sa(t, i, o == null ? void 0 : o.name, v, F, ve, T);
    _e && u.push({
      entity: k,
      entityId: v,
      domain: F,
      name: st,
      icon: Oa(k, F, S == null ? void 0 : S.icon),
      areaId: i,
      section: _e,
      labels: T,
      available: !["unavailable", "unknown"].includes(k.state),
      active: Ea(k, F),
      powered: Ui(k, F),
      protected: (S == null ? void 0 : S.protected) === !0 || t.protected_entities.includes(v) || T.some((He) => t.protected_labels.includes(He)),
      ignoreActivity: (S == null ? void 0 : S.ignore_activity) === !0,
      group: (S == null ? void 0 : S.group) ?? Aa(_e, F, v, ve, T)
    });
  }
  const d = ((w = r == null ? void 0 : r.section_order) != null && w.length ? r.section_order : t.section_order).map((v) => {
    var A;
    const k = u.filter((E) => E.section === v).sort(
      (E, S) => {
        var F, T;
        return ui((F = r == null ? void 0 : r.entity_order) == null ? void 0 : F[v], E.entityId) - ui((T = r == null ? void 0 : r.entity_order) == null ? void 0 : T[v], S.entityId) || E.name.localeCompare(S.name);
      }
    );
    return {
      id: v,
      title: ya(e, t, v, (A = r == null ? void 0 : r.section_titles) == null ? void 0 : A[v]),
      icon: xt[v],
      entities: k,
      activeCount: k.filter((E) => E.powered).length
    };
  }).filter((v) => t.show_empty_sections || v.entities.length > 0), g = za(e, i, o, l, t, c), _ = Ma(e, i, o == null ? void 0 : o.name, l, t, c);
  return {
    id: i,
    name: (r == null ? void 0 : r.name) ?? (o == null ? void 0 : o.name) ?? i,
    icon: (r == null ? void 0 : r.icon) ?? (o == null ? void 0 : o.icon) ?? "mdi:floor-plan",
    floorId: (o == null ? void 0 : o.floor_id) ?? void 0,
    parentAreaId: r == null ? void 0 : r.parent_area,
    showWhenParentCollapsed: (r == null ? void 0 : r.show_when_parent_collapsed) === !0,
    sections: d,
    allEntities: u,
    temperature: g.temperature,
    temperatureUnit: g.unit ?? ((h = (y = e == null ? void 0 : e.config) == null ? void 0 : y.unit_system) == null ? void 0 : h.temperature) ?? "°C",
    temperatureMode: Ca(u.filter((v) => v.ignoreActivity !== !0)),
    occupancy: _.occupancy,
    occupancyCount: _.count,
    occupancyCountSource: _.countSource,
    occupancyEntities: _.entities
  };
}, Na = (e, t, i) => {
  if (t.area) {
    const o = [...i.entries()].find(([c, l]) => c === t.area || l.name === t.area);
    if (!o) return { ids: [], targetName: t.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${t.area}`] };
    const a = t.area_overrides[o[0]] ?? t.area_overrides[o[1].name], r = [o[0]], n = new Set(r);
    let s = !0;
    for (; s; ) {
      s = !1;
      for (const [c, l] of i) {
        if (n.has(c)) continue;
        const u = t.area_overrides[c] ?? t.area_overrides[l.name], b = u == null ? void 0 : u.parent_area;
        !b || !r.some((g) => {
          const _ = i.get(g);
          if (!_) return !1;
          const $ = t.area_overrides[g] ?? t.area_overrides[_.name];
          return b === g || b === _.name || b === ($ == null ? void 0 : $.name);
        }) || (n.add(c), r.push(c), s = !0);
      }
    }
    return { ids: r, targetName: o[1].name, targetIcon: t.target_icon || (a == null ? void 0 : a.icon) || o[1].icon || "mdi:floor-plan", kind: "area", warnings: [] };
  }
  if (t.floor) {
    const o = $a(e).find((r) => r.id === t.floor || r.name === t.floor);
    if (!o) return { ids: [], targetName: t.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${t.floor}`] };
    const a = [...i.entries()].filter(([, r]) => r.floor_id === o.id).map(([r]) => r);
    return { ids: a, targetName: o.name, targetIcon: t.target_icon || o.icon || "mdi:home-floor-0", kind: "floor", warnings: a.length ? [] : [`Floor has no areas: ${o.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
}, at = (e, t) => {
  var $;
  const i = xa(e), o = Na(e, t, i), a = /* @__PURE__ */ new Map();
  for (const f of Object.keys((e == null ? void 0 : e.states) ?? {})) {
    const x = Xe(e, f);
    if (!x) continue;
    const w = a.get(x) ?? [];
    w.push(f), a.set(x, w);
  }
  const r = (f, x) => {
    const w = t.area_order.findIndex((y) => y === f || y === x);
    return w < 0 ? Number.MAX_SAFE_INTEGER : w;
  }, n = o.ids.map((f) => Fa(e, t, f, i.get(f), a.get(f) ?? [])).filter((f) => !!f).sort((f, x) => r(f.id, f.name) - r(x.id, x.name) || f.name.localeCompare(x.name)), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = (f, x) => {
    if (!f) return;
    const w = c.get(f) ?? /* @__PURE__ */ new Set();
    w.add(x), c.set(f, w);
  };
  for (const f of n) {
    s.set(f.id, f.id), l(f.name, f.id);
    const x = ($ = i.get(f.id)) == null ? void 0 : $.name;
    l(x, f.id);
  }
  for (const [f, x] of c)
    x.size === 1 && !s.has(f) && s.set(f, [...x][0]);
  const u = n.map((f) => {
    const x = f.parentAreaId ? s.get(f.parentAreaId) : void 0;
    return { ...f, parentAreaId: x && x !== f.id ? x : void 0 };
  }), b = new Map(u.filter((f) => f.parentAreaId).map((f) => [f.id, f.parentAreaId])), d = /* @__PURE__ */ new Set();
  for (const f of u) {
    const x = [], w = /* @__PURE__ */ new Map();
    let y = f.id;
    for (; y; ) {
      const h = w.get(y);
      if (h !== void 0) {
        for (const v of x.slice(h)) d.add(v);
        break;
      }
      w.set(y, x.length), x.push(y), y = b.get(y);
    }
  }
  const g = u.map((f) => d.has(f.id) ? { ...f, parentAreaId: void 0 } : f), _ = d.size ? [`Area parent cycle ignored: ${[...d].join(", ")}`] : [];
  return {
    areas: g,
    targetName: t.title || o.targetName,
    targetIcon: o.targetIcon,
    targetKind: o.kind,
    warnings: [...o.warnings, ..._]
  };
}, Tt = (e) => {
  const t = new Map(e.map((n) => [n.id, n])), i = /* @__PURE__ */ new Map();
  for (const n of e)
    n.parentAreaId && n.parentAreaId !== n.id && t.has(n.parentAreaId) && i.set(n.id, n.parentAreaId);
  const o = /* @__PURE__ */ new Set();
  for (const n of e) {
    const s = [], c = /* @__PURE__ */ new Map();
    let l = n.id;
    for (; l; ) {
      const u = c.get(l);
      if (u !== void 0) {
        for (const b of s.slice(u)) o.add(b);
        break;
      }
      c.set(l, s.length), s.push(l), l = i.get(l);
    }
  }
  const a = /* @__PURE__ */ new Map(), r = [];
  for (const n of e) {
    const s = o.has(n.id) ? void 0 : i.get(n.id);
    if (!s) {
      r.push(n);
      continue;
    }
    const c = a.get(s) ?? [];
    c.push(n), a.set(s, c);
  }
  return { roots: r, children: a };
}, qa = (e, t) => {
  const { roots: i, children: o } = Tt(e), a = [], r = /* @__PURE__ */ new Set(), n = (s) => {
    if (r.has(s.id)) return;
    r.add(s.id), a.push(s);
    const c = t(s);
    for (const l of o.get(s.id) ?? [])
      (c || l.showWhenParentCollapsed) && n(l);
  };
  for (const s of i) n(s);
  return a;
}, mi = (e) => e === oe || e === J, bi = (e, t) => ({
  ...e,
  entities: t,
  activeCount: t.filter((i) => i.powered).length
}), fi = (e, t) => e.filter((i) => t || i.entities.length > 0), Ra = (e, t = [], i = !1) => {
  const o = [];
  for (const s of e.sections)
    for (const c of s.entities)
      !c.group || mi(c.group) || o.includes(c.group) || o.push(c.group);
  const a = [
    ...t.filter((s, c) => o.includes(s) && t.indexOf(s) === c),
    ...o.filter((s) => !t.includes(s))
  ], r = fi(
    e.sections.map((s) => bi(
      s,
      s.entities.filter((c) => !c.group || mi(c.group))
    )),
    i
  ), n = a.map((s) => {
    const c = fi(
      e.sections.map((l) => bi(
        l,
        l.entities.filter((u) => u.group === s).map((u) => ({ ...u, group: void 0 }))
      )),
      i
    );
    return { name: s, sections: c, entities: c.flatMap((l) => l.entities) };
  });
  return { generalSections: r, subareas: n };
};
var Da = Object.defineProperty, La = Object.getOwnPropertyDescriptor, ne = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? La(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && Da(t, i, a), a;
};
let Q = class extends re {
  constructor() {
    super(...arguments), this.config = { type: me }, this.targetMode = "area", this.activeAreaId = "", this.entitySearch = "", this.candidateEntityId = "", this.candidateSection = "floor_heating";
  }
  setConfig(e) {
    const t = { ...e, type: me };
    typeof e.show_area_expand_button != "boolean" && delete t.show_area_expand_button, typeof e.show_floor_expand_button != "boolean" && delete t.show_floor_expand_button, e.area_open_mode !== "expander" && e.area_open_mode !== "popup" && delete t.area_open_mode, e.fan_display_mode !== "subgroup" && e.fan_display_mode !== "button" && delete t.fan_display_mode, e.heating_controls_display_mode !== "subgroup" && e.heating_controls_display_mode !== "button" && delete t.heating_controls_display_mode, Mt.includes(e.theme_preset) || delete t.theme_preset, ["recommended", "light", "dark"].includes(String(e.theme_mode)) || delete t.theme_mode, this.config = t, this.targetMode = e.floor ? "floor" : "area", e.area && (this.activeAreaId = e.area);
  }
  shouldUpdate(e) {
    if (e.size !== 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || t.areas !== this.hass.areas || t.floors !== this.hass.floors || t.entities !== this.hass.entities || t.devices !== this.hass.devices || t.labels !== this.hass.labels ? !0 : t.states !== this.hass.states;
  }
  render() {
    const e = Pe(this.config), t = Z(this.hass, e), i = typeof e.rtl == "boolean" ? e.rtl : t === "he";
    this.setAttribute("dir", i ? "rtl" : "ltr"), this.style.setProperty("--overview-editor-direction", i ? "rtl" : "ltr");
    const o = at(this.hass, e), a = this.targetAreas(e), r = this.entityMapByArea();
    return a.length && !a.some((n) => n.id === this.activeAreaId) && queueMicrotask(() => this.activeAreaId = a[0].id), p`
      <div class="editor">
        <div class="intro">
          <span class="intro-icon"><ha-icon icon="mdi:home-analytics"></ha-icon></span>
          <div>
            <strong>${this.l("סקירת אזור וקומה", "Area and floor overview", t)}</strong>
            <span>${this.l("הגדירו ברירות מחדל גלובליות, ופתחו עריכה פרטנית רק במקום שבו נדרשת חריגה", "Set global defaults first, then open private overrides only where an exception is needed", t)}</span>
          </div>
        </div>
        ${this.renderTarget(e, t)}
        ${this.renderSummarySettings(e, t)}
        ${this.renderSections(e, t)}
        ${this.renderAreas(e, a, r, t)}
        ${this.renderEntities(e, o, a, t)}
        ${this.renderAppearance(e, t)}
        ${this.renderAdvanced(e, t)}
      </div>
    `;
  }
  renderTarget(e, t) {
    var s;
    const i = this.areaOptions(), o = this.floorOptions(), a = this.targetMode === "area" ? this.areaIdFor(e.area) : this.floorIdFor(e.floor), n = ((s = (this.targetMode === "area" ? i : o).find((c) => c.id === a)) == null ? void 0 : s.icon) ?? (this.targetMode === "floor" ? "mdi:home-floor-0" : "mdi:floor-plan");
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
            <select .value=${a} @change=${(c) => this.setTarget(c.target.value)}>
              <option value="" ?selected=${!a}>${this.l("בחרו...", "Choose...", t)}</option>
              ${(this.targetMode === "area" ? i : o).map((c) => p`<option value=${c.id} ?selected=${c.id === a}>${c.name}</option>`)}
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
          ${this.targetMode === "floor" && !o.length ? p`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", t)}</div>` : m}
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
      ["strip_area_name_from_entity_names", this.l("הסר את שם החדר משמות הרכיבים", "Remove room name from device names", t), this.l("לדוגמה: ‘אורי ספוטים’ יוצג כ‘ספוטים’. ניתן לשנות לכל רכיב בנפרד.", "For example, ‘Kids spots’ becomes ‘spots’. Each device can override this.", t), e.strip_area_name_from_entity_names],
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
            <select .value=${e.area_open_mode} @change=${(o) => this.commitKey("area_open_mode", o.target.value)}>
              <option value="expander">Expander</option>
              <option value="popup">Popup</option>
            </select>
            <div class="hint">${this.l("Popup פותח את תוכן החדר בחלון עם כפתור סגירה עליון. ניתן לבחור מצב אחר לכל חדר.", "Popup opens the room content in a modal with a top close button. Each room can override this setting.", t)}</div>
          </div>
          <div class="settings-list">${i.map(([o, a, r, n]) => this.booleanRow(a, r, n, (s) => this.commitKey(o, s)))}</div>
        </div>
      </details>
    `;
  }
  renderSections(e, t) {
    return p`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", t), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", t))}
        <div class="panel">
          <div class="hint">${this.l("אלו ברירות המחדל הגלובליות לכל החדרים. ישויות חדשות מצטרפות אוטומטית בסוף הסעיף; חריגות לחדר או לקטגוריה נמצאות תחת עריכה פרטנית באזור.", "These are the global defaults for every room. New entities are appended automatically; room and category exceptions are available under the area's private editor.", t)}</div>
          <div class="field">
            <label>${this.l("כפתורי שליטה בכותרת קטגוריה", "Category header controls", t)}</label>
            <select .value=${e.section_action_mode} @change=${(i) => this.commitKey("section_action_mode", i.target.value)}>
              <option value="toggle">${this.l("כפתור אחד — החלפת מצב", "One smart toggle button", t)}</option>
              <option value="dual">${this.l("שני כפתורים — הדלקה וכיבוי", "Two buttons — on and off", t)}</option>
            </select>
          </div>
          <div class="inline-fields">
            <div class="field">
              <label>${this.l("גודל כרטיסי הציוד", "Device card size", t)}</label>
              <select .value=${e.entity_card_size} @change=${(i) => this.commitKey("entity_card_size", i.target.value)}>
                <option value="compact">${this.l("מצומצם", "Compact", t)}</option>
                <option value="medium">${this.l("בינוני", "Medium", t)}</option>
                <option value="wide">${this.l("רחב", "Wide", t)}</option>
              </select>
              <div class="hint">${this.l("משנה יחד את הגובה, הרווחים, הטקסט והאייקונים. גובה ידני בקטגוריה ממשיך לגבור.", "Adjusts height, spacing, text, and icons together. A manual category height still takes priority.", t)}</div>
            </div>
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
            <div class="field">
              <label>${this.l("תצוגת מאווררים בתוך אקלים", "Fans inside Climate", t)}</label>
              <select .value=${e.fan_display_mode} @change=${(i) => this.commitKey("fan_display_mode", i.target.value)}>
                <option value="subgroup">${this.l("תת־קטגוריה מלאה", "Full sub-category", t)}</option>
                <option value="button">${this.l("כפתור אובלי קומפקטי", "Compact oval button", t)}</option>
              </select>
              <div class="hint">${this.l("הכפתור הקומפקטי מופיע בין כותרת אקלים לבין פעולות ההדלקה והכיבוי ופותח חלון שליטה מלא.", "The compact button sits between the Climate title and its group controls, and opens the full fan popup.", t)}</div>
            </div>
            <div class="field">
              <label>${this.l("תצוגת בקרי חימום רצפתי", "Floor-heating controls display", t)}</label>
              <select .value=${e.heating_controls_display_mode} @change=${(i) => this.commitKey("heating_controls_display_mode", i.target.value)}>
                <option value="subgroup">${this.l("תת־קטגוריה מלאה", "Full sub-category", t)}</option>
                <option value="button">${this.l("כפתור אובלי קומפקטי", "Compact oval button", t)}</option>
              </select>
              <div class="hint">${this.l("הכפתור הקומפקטי מופיע בכותרת חימום רצפתי ופותח חלון נפרד לבקרי ולממסרי החימום.", "The compact button appears in the Floor-heating heading and opens a separate popup for heating controls and relays.", t)}</div>
            </div>
            <div class="field"><label>${this.l("שם תת־קטגוריית מאווררים", "Fans sub-category name", t)}</label><input type="text" .value=${e.subgroup_titles.fans} placeholder=${this.l("מאווררים", "Fans", t)} @change=${(i) => this.setGlobalSubgroupTitle("fans", i.target.value)} /></div>
            <div class="field"><label>${this.l("שם בקרי חימום / כפתור", "Heating-controls / button label", t)}</label><input type="text" .value=${e.subgroup_titles.heating_controls} placeholder=${e.heating_controls_display_mode === "button" ? this.l("מפסק", "Switch", t) : this.l("בקרי חימום", "Heating controls", t)} @change=${(i) => this.setGlobalSubgroupTitle("heating_controls", i.target.value)} /><div class="hint">${this.l("השם משמש גם לכפתור האובלי. השאירו ריק לברירת המחדל הקצרה מפסק.", "This label also applies to the oval button. Leave it empty for the short Switch default.", t)}</div></div>
          </div>
          <div class="inline-fields">
            ${["on", "off", "open", "close"].map((i) => {
      var o;
      return this.iconField(
        this.sectionActionIconName(i, t),
        typeof ((o = this.config.section_action_icons) == null ? void 0 : o[i]) == "string" ? this.config.section_action_icons[i] : "",
        it[i],
        t,
        (a) => this.setSectionActionIcon(i, a)
      );
    })}
          </div>
          <div class="order-list">
            ${e.section_order.map((i, o) => {
      var a, r, n, s;
      return p`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${xt[i]}></ha-icon></span>
                <div class="order-main field">
                  <label>${this.sectionDefaultName(i, t)}</label>
                  <input type="text" .value=${e.section_titles[i]} placeholder=${this.sectionDefaultName(i, t)} @change=${(c) => this.setSectionTitle(i, c.target.value)} />
                </div>
                ${this.orderButtons(o, e.section_order.length, () => this.moveSection(i, -1), () => this.moveSection(i, 1))}
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
      ) : m}
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
        !!((r = (a = this.config.section_styles) == null ? void 0 : a[i]) != null && r.background),
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
            ${[...e.quick_actions, ...Ii.filter((i) => !e.quick_actions.includes(i))].map((i) => {
      var s;
      const o = e.quick_actions.includes(i), a = e.quick_actions.indexOf(i), r = (s = this.config.quick_action_icons) == null ? void 0 : s[i], n = typeof r == "string" ? r : "";
      return p`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${e.quick_action_icons[i]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(i, t)}</div></div>
                  <div class="area-actions">
                    ${o ? this.orderButtons(a, e.quick_actions.length, () => this.moveQuickAction(i, -1), () => this.moveQuickAction(i, 1)) : m}
                    ${this.switchControl(o, (c) => this.toggleQuickAction(i, c), this.quickName(i, t))}
                  </div>
                  <div class="quick-action-icon-field">
                    ${this.iconField(
        `${this.l("אייקון פעולה", "Action icon", t)} · ${this.quickName(i, t)}`,
        n,
        $t[i],
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
  renderAreas(e, t, i, o) {
    return p`
      <details>
        ${this.summary("mdi:floor-plan", this.l("אזורים בקומה", "Areas", o), this.l("סדר, כותרת, אייקון וחיישנים מועדפים", "Order, title, icon, and preferred sensors", o))}
        <div class="panel">
          ${t.length ? p`<div class="order-list">${t.map((a) => {
      const r = this.normalizedParentId(a.id, e), n = t.filter((s) => this.normalizedParentId(s.id, e) === r);
      return this.renderAreaEditor(a, n.findIndex((s) => s.id === a.id), n.length, e, i.get(a.id) ?? [], o);
    })}</div>` : p`<div class="empty">${this.l("בחרו יעד כדי לערוך אזורים", "Choose a target to edit its areas", o)}</div>`}
        </div>
      </details>
    `;
  }
  renderAreaEditor(e, t, i, o, a, r) {
    var f, x, w, y;
    const n = o.area_overrides[e.id] ?? o.area_overrides[e.name] ?? {}, s = this.activeAreaId === e.id, c = a.filter(
      (h) => h.entity_id.startsWith("climate.") || h.entity_id.startsWith("sensor.") && h.attributes.device_class === "temperature"
    ), l = a.filter((h) => {
      const v = h.entity_id.split(".")[0];
      return v === "binary_sensor" || v === "person" || v === "device_tracker";
    }), u = a.filter((h) => {
      const v = h.entity_id.split(".")[0];
      return ["sensor", "input_number", "counter"].includes(v ?? "") && (Number.isFinite(Number(h.state)) || h.entity_id === n.occupancy_count_entity);
    }), b = this.targetAreas(o).filter((h) => {
      const v = o.area_overrides[h.id] ?? o.area_overrides[h.name];
      return h.id !== e.id && (v == null ? void 0 : v.hidden) !== !0 && !this.wouldCreateAreaCycle(e.id, h.id, o);
    }), d = n.parent_area ? ((f = this.areaOptions().find((h) => h.id === n.parent_area || h.name === n.parent_area)) == null ? void 0 : f.id) ?? "" : "", g = ((x = this.areaOptions().find((h) => h.id === d)) == null ? void 0 : x.name) ?? d, _ = [...new Set(a.map((h) => {
      var v;
      return (v = o.entity_overrides[h.entity_id]) == null ? void 0 : v.group;
    }).filter((h) => !!h && h !== oe && h !== J))], $ = [
      ...(n.subarea_order ?? []).filter((h) => _.includes(h)),
      ..._.filter((h) => !(n.subarea_order ?? []).includes(h))
    ];
    return p`
      <div class="area-card ${n.hidden ? "hidden" : ""} ${d ? "child" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${n.icon ?? e.icon}></ha-icon></span>
          <button type="button" class="segment ${s ? "active" : ""}" @click=${() => this.activeAreaId = e.id}>
            ${n.name || e.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(t, i, () => this.moveArea(e.id, -1, o), () => this.moveArea(e.id, 1, o))}
            ${this.switchControl(!n.hidden, (h) => this.updateAreaOverride(e.id, { hidden: !h }), this.l("הצג אזור", "Show area", r))}
          </div>
        </div>
        ${s ? p`
              <details class="override-details area-override-details">
                ${this.summary(
      "mdi:pencil-outline",
      this.l("עריכה פרטנית של החדר", "Edit this room", r),
      this.l("חריגות מההגדרות הגלובליות", "Overrides to global settings", r)
    )}
                <div class="override-panel">
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", r)}</label><input type="text" .value=${n.name ?? ""} placeholder=${e.name} @change=${(h) => this.updateAreaOverride(e.id, { name: h.target.value || void 0 })} /></div>
                ${this.iconField(this.l("אייקון האזור", "Area icon", r), n.icon ?? "", e.icon, r, (h) => this.updateAreaOverride(e.id, { icon: h || void 0 }))}
              </div>
              <div class="field">
                <label>${this.l("תת־אזור של", "Parent area", r)}</label>
                <select .value=${d} @change=${(h) => this.updateAreaOverride(e.id, { parent_area: h.target.value || void 0 })}>
                  <option value="">${this.l("ללא אזור אב", "No parent area", r)}</option>
                  ${b.map((h) => p`<option value=${h.id}>${h.name}</option>`)}
                </select>
                <div class="hint">${this.l("הקשר הוא חזותי בלבד; המצב והפעולות של כל אזור נשארים עצמאיים.", "Nesting is visual only; every area's state and actions remain independent.", r)}</div>
              </div>
              ${d ? this.booleanRow(
      this.l("הצג כשהאזור הראשי מכווץ", "Show when parent is collapsed", r),
      this.l(
        `כבוי כברירת מחדל. כשהאפשרות פעילה, תת־האזור נשאר גלוי בתוך ${g} גם כשהוא מכווץ. החצים בשורת האזור קובעים את הסדר רק בין תתי־אזורים של אותו אזור אב.`,
        `Off by default. When enabled, this child remains visible inside ${g} while the parent is collapsed. The arrows in the area row order only children of the same parent.`,
        r
      ),
      n.show_when_parent_collapsed ?? !1,
      (h) => this.updateAreaOverride(e.id, { show_when_parent_collapsed: h })
    ) : m}
              <div class="field">
                <label>${this.l("אופן פתיחת חדר זה", "Opening mode for this room", r)}</label>
                <select .value=${n.open_mode ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { open_mode: h.target.value || void 0 })}>
                  <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", r)}</option>
                  <option value="expander">Expander</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", r)}</label>
                <select .value=${n.temperature_entity ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { temperature_entity: h.target.value || void 0 })}>
                  <option value="">${this.l("אוטומטי", "Automatic", r)}</option>
                  ${c.map((h) => p`<option value=${h.entity_id}>${this.entityName(h)}</option>`)}
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור ספירת נוכחים", "Occupancy count source", r)}</label>
                <select .value=${n.occupancy_count_entity ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { occupancy_count_entity: h.target.value || void 0 })}>
                  <option value="">${this.l("ספירת חיישני נוכחות פעילים", "Count active presence sensors", r)}</option>
                  ${u.map((h) => p`<option value=${h.entity_id}>${this.entityName(h)}</option>`)}
                </select>
                <div class="hint">${this.l("בחרו חיישן מספרי כדי להציג מספר אנשים אמיתי; אחרת יוצג מספר חיישני הנוכחות הפעילים.", "Choose a numeric sensor for a true people count; otherwise the card shows the number of active presence sensors.", r)}</div>
              </div>
              ${l.length ? p`<div class="field"><label>${this.l("מקורות נוכחות (ריק = אוטומטי)", "Presence sources (empty = automatic)", r)}</label><div class="entity-flags">${l.map((h) => {
      var k;
      const v = ((k = n.occupancy_entities) == null ? void 0 : k.includes(h.entity_id)) ?? !1;
      return p`<label class="check-label"><input type="checkbox" .checked=${v} @change=${(A) => this.toggleAreaList(e.id, "occupancy_entities", h.entity_id, A.target.checked)} />${this.entityName(h)}</label>`;
    })}</div></div>` : m}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", r)}</div></div>${this.switchControl(n.default_expanded ?? o.default_expanded, (h) => this.updateAreaOverride(e.id, { default_expanded: h }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", r)}</div>
              <div class="inline-fields">
                ${o.section_order.map((h) => {
      var v;
      return p`<div class="field"><label>${this.sectionDefaultName(h, r)}</label><input type="text" .value=${((v = n.section_titles) == null ? void 0 : v[h]) ?? ""} placeholder=${o.section_titles[h] || this.sectionDefaultName(h, r)} @change=${(k) => this.setAreaSectionTitle(e.id, h, k.target.value)} /></div>`;
    })}
              </div>
              ${$.length ? p`
                    <div class="setting-title">${this.l("סדר תתי־אזורים בתוך החדר", "Room sub-area order", r)}</div>
                    <div class="hint">${this.l("הקטגוריות של החדר הכללי מוצגות ראשונות. לאחריהן כל תת־אזור מופיע פעם אחת ובתוכו הקטגוריות שלו.", "General room categories are shown first. Each sub-area then appears once with its own category sections.", r)}</div>
                    <div class="order-list">
                      ${$.map((h, v) => p`
                        <div class="order-row">
                          <span class="order-icon"><ha-icon icon="mdi:home-floor-1"></ha-icon></span>
                          <span class="order-main"><span class="order-title">${h}</span></span>
                          ${this.orderButtons(
      v,
      $.length,
      () => this.moveRoomSubarea(e.id, h, -1, $),
      () => this.moveRoomSubarea(e.id, h, 1, $)
    )}
                        </div>
                      `)}
                    </div>
                  ` : m}
              <div class="setting-title">${this.l("מראה קטגוריות בחדר", "Room category appearance", r)}</div>
              <div class="inline-fields">
                <div class="field">
                  <label>${this.l("גודל כרטיסי ציוד בחדר", "Device card size in this room", r)}</label>
                  <select .value=${n.entity_card_size ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { entity_card_size: h.target.value || void 0 })}>
                    <option value="">${this.l("לפי ההגדרה הכללית", "Use global setting", r)}</option>
                    <option value="compact">${this.l("מצומצם", "Compact", r)}</option>
                    <option value="medium">${this.l("בינוני", "Medium", r)}</option>
                    <option value="wide">${this.l("רחב", "Wide", r)}</option>
                  </select>
                </div>
                <div class="field">
                  <label>${this.l("תצוגת מאווררים בחדר", "Fan display in this room", r)}</label>
                  <select .value=${n.fan_display_mode ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { fan_display_mode: h.target.value || void 0 })}>
                    <option value="">${this.l("לפי ההגדרה הכללית", "Use global setting", r)}</option>
                    <option value="subgroup">${this.l("תת־קטגוריה מלאה", "Full sub-category", r)}</option>
                    <option value="button">${this.l("כפתור אובלי קומפקטי", "Compact oval button", r)}</option>
                  </select>
                </div>
                <div class="field">
                  <label>${this.l("תצוגת בקרי חימום בחדר", "Heating-controls display in this room", r)}</label>
                  <select .value=${n.heating_controls_display_mode ?? ""} @change=${(h) => this.updateAreaOverride(e.id, { heating_controls_display_mode: h.target.value || void 0 })}>
                    <option value="">${this.l("לפי ההגדרה הכללית", "Use global setting", r)}</option>
                    <option value="subgroup">${this.l("תת־קטגוריה מלאה", "Full sub-category", r)}</option>
                    <option value="button">${this.l("כפתור אובלי קומפקטי", "Compact oval button", r)}</option>
                  </select>
                </div>
                <div class="field"><label>${this.l("שם מאווררים בחדר", "Fans name in this room", r)}</label><input type="text" .value=${((w = n.subgroup_titles) == null ? void 0 : w.fans) ?? ""} placeholder=${o.subgroup_titles.fans || this.l("מאווררים", "Fans", r)} @change=${(h) => this.setAreaSubgroupTitle(e.id, "fans", h.target.value)} /></div>
                <div class="field"><label>${this.l("כיתוב בקרי חימום / כפתור בחדר", "Heating-controls / button label in this room", r)}</label><input type="text" .value=${((y = n.subgroup_titles) == null ? void 0 : y.heating_controls) ?? ""} placeholder=${o.subgroup_titles.heating_controls || (n.heating_controls_display_mode === "button" || !n.heating_controls_display_mode && o.heating_controls_display_mode === "button" ? this.l("מפסק", "Switch", r) : this.l("בקרי חימום", "Heating controls", r))} @change=${(h) => this.setAreaSubgroupTitle(e.id, "heating_controls", h.target.value)} /></div>
              </div>
              <div class="order-list">
                ${o.section_order.map((h) => {
      var A;
      const v = o.section_styles[h], k = ((A = n.section_styles) == null ? void 0 : A[h]) ?? {};
      return p`
                    <details class="override-details category-override-details">
                      ${this.summary(
        xt[h],
        this.sectionDefaultName(h, r),
        this.l("עריכה פרטנית בחדר זה", "Room-specific category overrides", r)
      )}
                      <div class="override-panel">
                      ${this.booleanRow(
        this.l("הצג מסגרת בחדר זה", "Show frame in this room", r),
        "",
        k.show_border ?? v.show_border ?? !1,
        (E) => this.setAreaSectionStyle(e.id, h, { show_border: E })
      )}
                      ${h === "lights_switches" || h === "covers" ? p`<div class="field">
                            <label>${h === "covers" ? this.l("מספר תריסים בשורה בחדר זה", "Covers per row in this room", r) : this.l("מספר תאורות בשורה בחדר זה", "Light tiles per row in this room", r)}</label>
                            <select .value=${k.columns === void 0 ? "" : String(k.columns)} @change=${(E) => {
        const S = E.target.value;
        this.setAreaSectionStyle(e.id, h, { columns: S ? Number(S) : void 0 });
      }}>
                              <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", r)}</option>
                              <option value="1">1</option><option value="2">2</option>${h === "lights_switches" ? p`<option value="3">3</option>` : m}
                            </select>
                          </div>` : m}
                      <div class="inline-fields">
                        <div class="field">
                          <label>${this.l("גובה ציוד בחדר זה", "Device tile height in this room", r)}</label>
                          <input type="number" min="44" max="140" .value=${k.entity_height === void 0 ? "" : String(k.entity_height)} placeholder=${String(v.entity_height ?? (h === "climate" ? 108 : h === "floor_heating" ? 92 : 56))} @change=${(E) => {
        const S = E.target.value;
        this.setAreaSectionStyle(e.id, h, { entity_height: S === "" ? void 0 : Number(S) });
      }} />
                        </div>
                        <div class="field">
                          <label>${this.l("תצוגת כפתורי פעולה בחדר זה", "Action appearance in this room", r)}</label>
                          <select .value=${k.action_presentation ?? ""} @change=${(E) => this.setAreaSectionStyle(e.id, h, { action_presentation: E.target.value || void 0 })}>
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
        k.background ?? v.background ?? "transparent",
        "#ffffff",
        !!k.background,
        r,
        (E) => this.setAreaSectionStyle(e.id, h, { background: E || void 0 })
      )}
                        ${this.valueColorField(
        this.l("צבע מסגרת בחדר זה", "Frame color in this room", r),
        k.border_color ?? v.border_color ?? "var(--divider-color)",
        "#888888",
        !!k.border_color,
        r,
        (E) => this.setAreaSectionStyle(e.id, h, { border_color: E || void 0 })
      )}
                      </div>
                      <div class="inline-fields">
                        <div class="field">
                          <label>${this.l("עובי מסגרת בחדר זה", "Frame thickness in this room", r)}</label>
                          <input
                            type="number"
                            min="0"
                            max="8"
                            .value=${k.border_width === void 0 ? "" : String(k.border_width)}
                            placeholder=${String(v.border_width ?? 1)}
                            @change=${(E) => {
        const S = E.target.value;
        this.setAreaSectionStyle(e.id, h, { border_width: S === "" ? void 0 : Number(S) });
      }}
                          />
                        </div>
                        <div class="field">
                          <label>${this.l("סגנון מסגרת בחדר זה", "Frame style in this room", r)}</label>
                          <select .value=${k.border_style ?? ""} @change=${(E) => this.setAreaSectionStyle(e.id, h, { border_style: E.target.value || void 0 })}>
                            <option value="">${this.l("כמו ההגדרה הכללית", "Use global style", r)}</option>
                            <option value="solid">${this.l("רציף", "Solid", r)}</option>
                            <option value="dashed">${this.l("מקווקו", "Dashed", r)}</option>
                            <option value="dotted">${this.l("מנוקד", "Dotted", r)}</option>
                          </select>
                        </div>
                      </div>
                      </div>
                    </details>
                  `;
    })}
              </div>
                </div>
              </details>
            ` : m}
      </div>
    `;
  }
  renderEntities(e, t, i, o) {
    var b;
    const a = this.activeAreaId || ((b = i[0]) == null ? void 0 : b.id) || "", r = t.areas.find((d) => d.id === a), n = at(this.hass, this.configForEntityEditor(e, a)).areas.find((d) => d.id === a), s = new Map(((n == null ? void 0 : n.allEntities) ?? (r == null ? void 0 : r.allEntities) ?? []).map((d) => [d.entityId, d])), c = this.entitiesForEditor(a, s, e), l = this.unclassifiedCandidates(a, s), u = c.filter((d) => `${d.name} ${d.entityId} ${d.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return p`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", o), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", o))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${a} @change=${(d) => this.activeAreaId = d.target.value}>${i.map((d) => p`<option value=${d.id}>${d.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", o)} .value=${this.entitySearch} @input=${(d) => this.entitySearch = d.target.value} />
          </div>
          <div class="hint">${this.l("הסתרה ושחזור נשארים זמינים מיד. לשינוי שם, שיוך, אייקון, הגנה או מראה פתחו עריכה פרטנית ברכיב. רכיב מוסתר אינו מוצג ואינו משפיע על צבע, מונים או פעולות האזור.", "Hide and restore stay immediately available. Open Device overrides only to change its name, section, icon, protection, or appearance. Hidden devices do not appear or affect area color, counts, or actions.", o)}</div>
          ${l.length ? p`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", o)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", o)}</label>
                      <select .value=${this.candidateEntityId} @change=${(d) => this.candidateEntityId = d.target.value}>
                        <option value="">${this.l("בחרו...", "Choose...", o)}</option>
                        ${l.map((d) => p`<option value=${d.entity_id}>${this.entityName(d)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", o)}</label>
                      <select .value=${this.candidateSection} @change=${(d) => this.candidateSection = d.target.value}>
                        ${G.map((d) => p`<option value=${d}>${this.sectionDefaultName(d, o)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", o)}
                  </button>
                </div>
              ` : m}
          <div class="entity-list">
            ${u.length ? u.map((d) => {
      const g = e.entity_overrides[d.entityId] ?? {}, _ = c.filter((y) => y.section === d.section), $ = _.findIndex((y) => y.entityId === d.entityId), f = this.isEntityExcluded(a, d.entityId, e), x = this.isEntityGloballyExcluded(d.entityId, e), w = x ? this.l("מוסתר גלובלית — ניתן לשנות במתקדם", "Globally hidden — change it in Advanced", o) : f ? this.l("החזר רכיב לאזור", "Restore device to area", o) : this.l("הסתר רכיב לחלוטין מהאזור", "Hide device completely from area", o);
      return p`
                    <div class="entity-item ${!f && d.active ? "active" : ""} ${f ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${g.icon ?? d.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${g.name || d.name}</div><div class="meta">${d.entityId}${f ? ` · ${x ? this.l("מוסתר גלובלית", "globally hidden", o) : this.l("מוסר מהאזור", "removed from area", o)}` : ""}</div></div>
                      <button
                        class="visibility-button ${f ? "restore" : ""}"
                        type="button"
                        title=${w}
                        aria-label=${`${w}: ${d.name}`}
                       ?disabled=${x}
                       @click=${() => this.setEntityVisible(a, d.entityId, f)}
                       ><ha-icon icon=${f ? "mdi:restore" : "mdi:eye-off-outline"}></ha-icon></button>
                       <details class="override-details entity-override-details">
                         ${this.summary(
        "mdi:tune-variant",
        this.l("עריכה פרטנית", "Device overrides", o),
        this.l("שם, שיוך, אייקון, הגנה ומראה", "Name, section, icon, safety, and appearance", o)
      )}
                         <div class="override-panel">
                       <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", o)}</label><input type="text" .value=${g.name ?? ""} placeholder=${d.name} @change=${(y) => this.updateEntityOverride(d.entityId, { name: y.target.value || void 0 })} /></div>
                        <div class="field">
                          <label>${this.l("הסרת שם החדר", "Remove room name", o)}</label>
                          <select .value=${g.strip_area_name === void 0 ? "" : String(g.strip_area_name)} @change=${(y) => {
        const h = y.target.value;
        this.updateEntityOverride(d.entityId, { strip_area_name: h === "" ? void 0 : h === "true" });
      }}>
                            <option value="">${this.l("לפי ההגדרה הכללית", "Use global setting", o)}</option>
                            <option value="true">${this.l("הסר", "Remove", o)}</option>
                            <option value="false">${this.l("השאר", "Keep", o)}</option>
                          </select>
                        </div>
                        <div class="field"><label>${this.l("סעיף", "Section", o)}</label><select .value=${g.section ?? d.section} @change=${(y) => this.updateEntityOverride(d.entityId, { section: y.target.value })}>${G.map((y) => p`<option value=${y}>${this.sectionDefaultName(y, o)}</option>`)}</select></div>
                        <div class="field"><label>${this.l("תת־אזור בתוך החדר", "Sub-area inside room", o)}</label><input type="text" .value=${g.group ?? d.group ?? ""} placeholder=${this.l("לדוגמה: מקלחת", "Example: Shower", o)} @change=${(y) => this.updateEntityOverride(d.entityId, { group: y.target.value.trim() || void 0 })} /><div class="hint">${this.l("רכיבים עם אותו שם יוצגו תחת תת־אזור אחד, ובתוכו יחולקו לפי קטגוריה.", "Devices with the same name are shown under one sub-area, divided into its category sections.", o)}</div></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", o), g.icon ?? "", d.icon, o, (y) => this.updateEntityOverride(d.entityId, { icon: y || void 0 }))}
                        ${d.section === "lights_switches" ? p`
                          <div class="field"><label>${this.l("צורת האריח", "Tile shape", o)}</label><select .value=${g.tile_shape ?? ""} @change=${(y) => this.updateEntityOverride(d.entityId, { tile_shape: y.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", o)}</option><option value="rectangle">${this.l("מלבן", "Rectangle", o)}</option><option value="square">${this.l("ריבוע", "Square", o)}</option></select></div>
                          <div class="field"><label>${this.l("מיקום האייקון", "Icon position", o)}</label><select .value=${g.icon_position ?? ""} @change=${(y) => this.updateEntityOverride(d.entityId, { icon_position: y.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", o)}</option><option value="start">${this.l("תחילת השורה לפי השפה", "Language start", o)}</option><option value="right">${this.l("ימין", "Right", o)}</option><option value="left">${this.l("שמאל", "Left", o)}</option><option value="center">${this.l("מרכז", "Center", o)}</option></select></div>
                          <div class="field"><label>${this.l("הצגת מידע", "State information", o)}</label><select .value=${g.show_state === void 0 ? "" : String(g.show_state)} @change=${(y) => {
        const h = y.target.value;
        this.updateEntityOverride(d.entityId, { show_state: h === "" ? void 0 : h === "true" });
      }}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", o)}</option><option value="true">${this.l("הצג", "Show", o)}</option><option value="false">${this.l("הסתר", "Hide", o)}</option></select></div>
                          <div class="field"><label>${this.l("שפת מצב הרכיב", "Device state language", o)}</label><select .value=${g.state_language ?? ""} @change=${(y) => this.updateEntityOverride(d.entityId, { state_language: y.target.value || void 0 })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", o)}</option><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
                        ` : m}
                      </div>
                       <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${g.protected ?? d.protected} @change=${(y) => this.updateEntityOverride(d.entityId, { protected: y.target.checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", o)}</label>
                        <label class="check-label" title=${this.l("הרכיב נשאר גלוי וניתן לשליטה, אך לא ישפיע על צבע החדר, מצב הקומה או תגי הפעולה המהירה.", "The device stays visible and controllable, but does not affect room color, floor state, or quick-action badges.", o)}><input type="checkbox" .checked=${g.ignore_activity ?? d.ignoreActivity ?? !1} @change=${(y) => this.updateEntityOverride(d.entityId, { ignore_activity: y.target.checked })} />${this.l("אל תשפיע על מצב החדר והקומה", "Ignore in room and floor activity", o)}</label>
                         ${this.orderButtons($, _.length, () => this.moveEntity(a, d.section, d.entityId, -1, _.map((y) => y.entityId)), () => this.moveEntity(a, d.section, d.entityId, 1, _.map((y) => y.entityId)))}
                       </div>
                         </div>
                       </details>
                     </div>
                  `;
    }) : p`<div class="empty">${this.l("אין רכיבים להצגה באזור זה", "No devices to show in this area", o)}</div>`}
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
          <div class="theme-mode-switch" role="radiogroup" aria-label=${this.l("גרסת צבע", "Theme color mode", t)}>
            ${["recommended", "light", "dark"].map((i) => p`<button
              class=${e.theme_mode === i ? "selected" : ""}
              type="button"
              role="radio"
              aria-checked=${e.theme_mode === i}
              @click=${() => this.applyThemeMode(i)}
            >${i === "recommended" ? this.l("מומלץ", "Recommended", t) : i === "light" ? this.l("בהיר", "Light", t) : this.l("כהה", "Dark", t)}</button>`)}
          </div>
          <div class="theme-preset-grid" role="radiogroup" aria-label=${this.l("בחירת ערכת עיצוב", "Choose design theme", t)}>
            ${[
      ["classic", this.l("קלאסי", "Classic", t), this.l("המראה המקורי, משתלב עם ערכת Home Assistant", "Original look that follows the Home Assistant theme", t)],
      ["elegant", this.l("אלגנטי · ספיר", "Elegant · Sapphire", t), this.l("כחול מעושן, מתכת עדינה וניגודיות רגועה", "Muted blue, subtle metallic depth, calm contrast", t)],
      ["light", this.l("מואר · שמיים", "Luminous · Sky", t), this.l("לבן נקי, תכלת רך ותחושה אוורירית", "Clean white, soft sky blue, airy finish", t)],
      ["dark", this.l("כהה · חצות", "Dark · Midnight", t), this.l("גרפיט עמוק, טורקיז מרוסן וקריאות גבוהה", "Deep graphite, restrained teal, high readability", t)],
      ["modern", this.l("עכשווי · מרווה", "Modern · Sage", t), this.l("גוונים טבעיים, חמים ומינימליסטיים", "Natural, warm, minimalist tones", t)],
      ["ocean", this.l("אוקיינוס · אזור", "Ocean · Azure", t), this.l("כחול חי, טורקיז נקי ועומק ימי", "Vivid blue, clean turquoise, ocean depth", t)],
      ["emerald", this.l("בוטני · אמרלד", "Botanical · Emerald", t), this.l("ירוק עשיר, איזון טבעי וניגוד רגוע", "Rich green, natural balance, calm contrast", t)],
      ["violet", this.l("אטלייה · אמטיסט", "Atelier · Amethyst", t), this.l("סגול מעודן, עומק יצירתי וגימור אלגנטי", "Refined violet, creative depth, elegant finish", t)],
      ["coral", this.l("טרקוטה · קורל", "Terracotta · Coral", t), this.l("כתום רך, חמימות מרוסנת ואופי מודרני", "Soft coral, restrained warmth, modern character", t)],
      ["amber", this.l("זהוב · ענבר", "Golden · Amber", t), this.l("זהב עמוק, חום מדויק ונוכחות מתונה", "Deep gold, precise warmth, understated presence", t)],
      ["rose", this.l("רוזה · פרי יער", "Rose · Berry", t), this.l("רוזה עשיר, סגול עדין ואלגנטיות רכה", "Rich rose, subtle violet, soft sophistication", t)]
    ].map(([i, o, a]) => {
      const r = { ...q, ...Oi(i, e.theme_mode) };
      return p`<button
                class="theme-preset ${e.theme_preset === i ? "selected" : ""}"
                type="button"
                role="radio"
                aria-checked=${e.theme_preset === i}
                style=${`--theme-card:${r.card_background};--theme-active:${r.active_surface};--theme-control:${r.control_surface};--theme-entity:${r.entity_active_surface};--theme-accent:${r.accent_color};--theme-frame:${r.area_frame_color || "var(--divider-color)"}`}
                @click=${() => this.applyThemePreset(i)}
              ><span class="theme-preset-preview"><span class="theme-preset-swatches"><i></i><i></i><i></i><i></i></span></span><span class="theme-preset-copy"><strong>${o}</strong><span>${a}</span></span></button>`;
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
  booleanRow(e, t, i, o) {
    return p`<div class="setting-row"><div class="setting-main"><div class="setting-title">${e}</div>${t ? p`<div class="meta">${t}</div>` : m}</div>${this.switchControl(i, o, e)}</div>`;
  }
  switchControl(e, t, i) {
    return p`<label class="switch" title=${i}><input type="checkbox" .checked=${e} aria-label=${i} @change=${(o) => t(o.target.checked)} /><span></span></label>`;
  }
  orderButtons(e, t, i, o) {
    return p`<div class="order-controls"><button class="icon-button" type="button" ?disabled=${e <= 0} @click=${i} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="icon-button" type="button" ?disabled=${e < 0 || e >= t - 1} @click=${o} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;
  }
  numberField(e, t, i, o, a) {
    return p`<div class="field"><label>${e}</label><input type="number" min=${i} max=${o} .value=${String(t)} @change=${(r) => a(Number(r.target.value))} /></div>`;
  }
  listField(e, t, i) {
    return p`<div class="field"><label>${e}</label><textarea .value=${t.join(`
`)} @change=${(o) => i(this.splitList(o.target.value))}></textarea></div>`;
  }
  iconField(e, t, i, o, a) {
    const r = t.trim() || i || "mdi:circle-outline";
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="icon-picker-row">
          <span class="icon-preview"><ha-icon icon=${r}></ha-icon></span>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${t}
            @value-changed=${(n) => a(this.controlValue(n))}
          ></ha-icon-picker>
          <button class="reset-button" type="button" ?disabled=${!t} @click=${() => a("")}>${this.l("איפוס", "Reset", o)}</button>
        </div>
        <div class="hint">${this.l("החיפוש נמצא בתוך בורר האייקונים.", "Search is built into the icon picker.", o)}</div>
      </div>
    `;
  }
  colorField(e, t, i, o, a) {
    var n;
    const r = ((n = this.config.style) == null ? void 0 : n[t]) !== void 0;
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(i, o)} aria-label=${e} @input=${(s) => this.setStyle(t, s.target.value)} />
          <input type="text" .value=${i} aria-label=${`${e} CSS`} @change=${(s) => this.setStyle(t, s.target.value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!r} @click=${() => this.setStyle(t, void 0)}>${this.l("איפוס", "Reset", a)}</button>
        </div>
      </div>
    `;
  }
  valueColorField(e, t, i, o, a, r) {
    return p`
      <div class="field">
        <label>${e}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(t, i)} aria-label=${e} @input=${(n) => r(n.target.value)} />
          <input type="text" .value=${t} aria-label=${`${e} CSS`} @change=${(n) => r(n.target.value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!o} @click=${() => r("")}>${this.l("איפוס", "Reset", a)}</button>
        </div>
      </div>
    `;
  }
  pickerColor(e, t) {
    var a;
    const i = (a = e.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) == null ? void 0 : a[1];
    if (i) return i.length === 3 ? `#${[...i].map((r) => `${r}${r}`).join("")}` : `#${i}`;
    const o = e.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    return o ? `#${o.slice(1, 4).map((r) => Math.max(0, Math.min(255, Math.round(Number(r)))).toString(16).padStart(2, "0")).join("")}` : t;
  }
  controlValue(e) {
    const t = e.detail, i = e.currentTarget, o = (t == null ? void 0 : t.value) ?? i.value;
    return typeof o == "string" ? o.trim() : "";
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
    if (e.area && (i = t.filter((o) => o.id === e.area || o.name === e.area)), e.floor) {
      const o = this.floorIdFor(e.floor);
      i = t.filter((a) => a.floorId === o);
    }
    return i.sort((o, a) => {
      const r = e.area_order.findIndex((s) => s === o.id || s === o.name), n = e.area_order.findIndex((s) => s === a.id || s === a.name);
      return (r < 0 ? Number.MAX_SAFE_INTEGER : r) - (n < 0 ? Number.MAX_SAFE_INTEGER : n) || o.name.localeCompare(a.name);
    });
  }
  entityMapByArea() {
    var t;
    const e = /* @__PURE__ */ new Map();
    for (const i of Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {})) {
      const o = Xe(this.hass, i.entity_id);
      if (!o) continue;
      const a = e.get(o) ?? [];
      a.push(i), e.set(o, a);
    }
    return e;
  }
  entitiesForEditor(e, t, i) {
    var a, r, n;
    const o = [...t.values()];
    for (const s of Object.values(((a = this.hass) == null ? void 0 : a.states) ?? {})) {
      if (Xe(this.hass, s.entity_id) !== e || t.has(s.entity_id)) continue;
      const c = (n = (r = this.hass) == null ? void 0 : r.entities) == null ? void 0 : n[s.entity_id];
      if (c != null && c.hidden || c != null && c.hidden_by || c != null && c.disabled_by || (c == null ? void 0 : c.entity_category) === "config" || (c == null ? void 0 : c.entity_category) === "diagnostic") continue;
      const l = i.entity_overrides[s.entity_id];
      if (!(l != null && l.section)) continue;
      const u = s.entity_id.split(".")[0] ?? "";
      o.push({
        entity: s,
        entityId: s.entity_id,
        domain: u,
        name: l.name ?? this.entityName(s),
        icon: l.icon ?? String(s.attributes.icon ?? "mdi:circle-outline"),
        areaId: e,
        section: l.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(s.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(s.state),
        powered: Ui(s, u),
        protected: l.protected === !0,
        ignoreActivity: l.ignore_activity === !0,
        group: l.group
      });
    }
    return o;
  }
  unclassifiedCandidates(e, t) {
    var o;
    const i = /* @__PURE__ */ new Set(["input_boolean", "water_heater"]);
    return Object.values(((o = this.hass) == null ? void 0 : o.states) ?? {}).filter((a) => {
      var n, s, c, l;
      if (Xe(this.hass, a.entity_id) !== e || t.has(a.entity_id) || (s = (n = this.config.entity_overrides) == null ? void 0 : n[a.entity_id]) != null && s.section) return !1;
      const r = (l = (c = this.hass) == null ? void 0 : c.entities) == null ? void 0 : l[a.entity_id];
      return r != null && r.hidden || r != null && r.hidden_by || r != null && r.disabled_by || r != null && r.entity_category ? !1 : i.has(a.entity_id.split(".")[0] ?? "");
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
  setGlobalSubgroupTitle(e, t) {
    const i = { ...this.config.subgroup_titles ?? {} }, o = t.trim();
    o ? i[e] = o : delete i[e], this.commit({ ...this.config, subgroup_titles: i });
  }
  moveSection(e, t) {
    const i = [...Pe(this.config).section_order];
    this.moveValue(i, e, t), this.commitKey("section_order", i);
  }
  toggleQuickAction(e, t) {
    const i = [...Pe(this.config).quick_actions], o = t ? [...i.filter((a) => a !== e), e] : i.filter((a) => a !== e);
    this.commitKey("quick_actions", o);
  }
  moveQuickAction(e, t) {
    const i = [...Pe(this.config).quick_actions];
    this.moveValue(i, e, t), this.commitKey("quick_actions", i);
  }
  setQuickActionIcon(e, t) {
    const i = this.config.quick_action_icons, o = i && typeof i == "object" && !Array.isArray(i) ? { ...i } : {}, a = t.trim();
    a ? o[e] = a : delete o[e], this.commit({ ...this.config, quick_action_icons: o });
  }
  setSectionActionIcon(e, t) {
    const i = { ...this.config.section_action_icons ?? {} }, o = t.trim();
    o ? i[e] = o : delete i[e], this.commit({ ...this.config, section_action_icons: i });
  }
  cleanSectionStyle(e) {
    return Object.fromEntries(Object.entries(e).filter(([, t]) => t !== void 0 && t !== ""));
  }
  setGlobalSectionStyle(e, t) {
    const i = { ...this.config.section_styles ?? {} }, o = this.cleanSectionStyle({ ...i[e] ?? {}, ...t });
    Object.keys(o).length ? i[e] = o : delete i[e], this.commit({ ...this.config, section_styles: i });
  }
  normalizedParentId(e, t) {
    var n;
    const i = this.targetAreas(t), o = i.find((s) => s.id === e), a = t.area_overrides[e] ?? t.area_overrides[(o == null ? void 0 : o.name) ?? ""], r = a == null ? void 0 : a.parent_area;
    if (r)
      return (n = i.find((s) => s.id === r || s.name === r)) == null ? void 0 : n.id;
  }
  wouldCreateAreaCycle(e, t, i) {
    const o = /* @__PURE__ */ new Set();
    let a = t;
    for (; a && !o.has(a); ) {
      if (a === e) return !0;
      o.add(a), a = this.normalizedParentId(a, i);
    }
    return !1;
  }
  moveArea(e, t, i) {
    const o = this.targetAreas(i), a = this.normalizedParentId(e, i), r = o.filter((b) => this.normalizedParentId(b.id, i) === a).map((b) => b.id), n = r.indexOf(e), s = r[n + t];
    if (n < 0 || !s) return;
    const c = o.map((b) => b.id), l = c.indexOf(e), u = c.indexOf(s);
    [c[l], c[u]] = [c[u], c[l]], this.commitKey("area_order", c);
  }
  moveRoomSubarea(e, t, i, o) {
    const a = this.currentAreaOverride(e), r = [
      ...(a.subarea_order ?? []).filter((n) => o.includes(n)),
      ...o.filter((n) => !(a.subarea_order ?? []).includes(n))
    ];
    this.moveValue(r, t, i), this.updateAreaOverride(e, { subarea_order: r });
  }
  updateAreaOverride(e, t) {
    var r;
    const i = { ...this.config.area_overrides ?? {} }, o = (r = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : r.name, a = this.currentAreaOverride(e);
    o && o !== e && delete i[o], i[e] = { ...a, ...t }, this.commit({ ...this.config, area_overrides: i });
  }
  toggleAreaList(e, t, i, o) {
    const r = [...this.currentAreaOverride(e)[t] ?? []].filter((n) => n !== i);
    o && r.push(i), this.updateAreaOverride(e, { [t]: r });
  }
  setAreaSectionTitle(e, t, i) {
    const o = this.currentAreaOverride(e);
    this.updateAreaOverride(e, { section_titles: { ...o.section_titles ?? {}, [t]: i || void 0 } });
  }
  setAreaSubgroupTitle(e, t, i) {
    const a = { ...this.currentAreaOverride(e).subgroup_titles ?? {} }, r = i.trim();
    r ? a[t] = r : delete a[t], this.updateAreaOverride(e, { subgroup_titles: a });
  }
  setAreaSectionStyle(e, t, i) {
    const a = { ...this.currentAreaOverride(e).section_styles ?? {} }, r = this.cleanSectionStyle({ ...a[t] ?? {}, ...i });
    Object.keys(r).length ? a[t] = r : delete a[t], this.updateAreaOverride(e, { section_styles: a });
  }
  updateEntityOverride(e, t) {
    var o;
    const i = ((o = this.config.entity_overrides) == null ? void 0 : o[e]) ?? {};
    this.commit({ ...this.config, entity_overrides: { ...this.config.entity_overrides ?? {}, [e]: { ...i, ...t } } });
  }
  configForEntityEditor(e, t) {
    var o;
    if (!t) return e;
    const i = e.area_overrides[t] ?? e.area_overrides[((o = this.areaOptions().find((a) => a.id === t)) == null ? void 0 : o.name) ?? ""] ?? {};
    return {
      ...e,
      exclude_entities: [],
      area_overrides: {
        ...e.area_overrides,
        [t]: { ...i, hidden: !1, exclude_entities: [] }
      },
      entity_overrides: Object.fromEntries(
        Object.entries(e.entity_overrides).map(([a, r]) => [a, { ...r, hidden: !1 }])
      )
    };
  }
  isEntityExcluded(e, t, i) {
    var a, r, n;
    const o = i.area_overrides[e] ?? i.area_overrides[((a = this.areaOptions().find((s) => s.id === e)) == null ? void 0 : a.name) ?? ""] ?? {};
    return i.exclude_entities.includes(t) || !!((r = o.exclude_entities) != null && r.includes(t)) || ((n = i.entity_overrides[t]) == null ? void 0 : n.hidden) === !0;
  }
  isEntityGloballyExcluded(e, t) {
    var i;
    return t.exclude_entities.includes(e) || ((i = t.entity_overrides[e]) == null ? void 0 : i.hidden) === !0;
  }
  setEntityVisible(e, t, i) {
    var c;
    const o = { ...this.config.area_overrides ?? {} }, a = (c = this.areaOptions().find((l) => l.id === e)) == null ? void 0 : c.name, r = this.currentAreaOverride(e), n = [...r.exclude_entities ?? []].filter((l) => l !== t);
    i || n.push(t);
    const s = { ...r, exclude_entities: n };
    a && a !== e && delete o[a], o[e] = s, this.commit({ ...this.config, area_overrides: o });
  }
  moveEntity(e, t, i, o, a) {
    var c;
    const r = this.currentAreaOverride(e), n = ((c = r.entity_order) == null ? void 0 : c[t]) ?? [], s = [...n, ...a.filter((l) => !n.includes(l))];
    this.moveValue(s, i, o), this.updateAreaOverride(e, { entity_order: { ...r.entity_order ?? {}, [t]: s } });
  }
  currentAreaOverride(e) {
    var o, a, r;
    const t = (o = this.areaOptions().find((n) => n.id === e)) == null ? void 0 : o.name;
    return { ...(t && t !== e ? (a = this.config.area_overrides) == null ? void 0 : a[t] : void 0) ?? {}, ...((r = this.config.area_overrides) == null ? void 0 : r[e]) ?? {} };
  }
  setStyle(e, t) {
    const i = { ...this.config.style ?? {} };
    t === void 0 || t === "" ? delete i[e] : i[e] = t, this.commit({ ...this.config, style: i });
  }
  applyThemePreset(e) {
    const t = { ...this.config.style ?? {} }, i = new Set(
      Object.values(wt).flatMap((o) => Object.keys(o))
    );
    for (const o of i) delete t[o];
    this.commit({
      ...this.config,
      theme_preset: e,
      style: Object.keys(t).length ? t : void 0
    });
  }
  applyThemeMode(e) {
    const t = { ...this.config.style ?? {} }, i = new Set(
      Object.values(wt).flatMap((o) => Object.keys(o))
    );
    for (const o of i) delete t[o];
    this.commit({
      ...this.config,
      theme_mode: e,
      style: Object.keys(t).length ? t : void 0
    });
  }
  commitKey(e, t) {
    const i = { ...this.config };
    t === "" || t === void 0 ? delete i[e] : i[e] = t, this.commit(i);
  }
  commit(e) {
    this.config = { ...e, type: me }, this.dispatchEvent(new CustomEvent("config-changed", { bubbles: !0, composed: !0, detail: { config: this.config } }));
  }
  moveValue(e, t, i) {
    const o = e.indexOf(t), a = o + i;
    o < 0 || a < 0 || a >= e.length || ([e[o], e[a]] = [e[a], e[o]]);
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
Q.styles = Re`
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
    .theme-preset-swatches i:nth-child(3) { background: var(--theme-entity); }
    .theme-preset-swatches i:nth-child(4) { background: var(--theme-accent); }
    .theme-preset-copy { min-width: 0; }
    .theme-preset-copy strong, .theme-preset-copy span { display: block; }
    .theme-preset-copy strong { margin-bottom: 3px; font-size: 13px; }
    .theme-preset-copy span { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
    .theme-mode-switch { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin-bottom: 10px; padding: 4px; border-radius: 12px; background: var(--secondary-background-color); }
    .theme-mode-switch button { min-height: 38px; border: 1px solid transparent; border-radius: 9px; background: transparent; color: var(--primary-text-color); font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
    .theme-mode-switch button.selected { border-color: color-mix(in srgb, var(--primary-color) 55%, transparent); background: var(--card-background-color); color: var(--primary-color); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
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
    .override-details { grid-column: 1 / -1; width: 100%; border-color: color-mix(in srgb, var(--primary-color) 28%, var(--divider-color)); background: color-mix(in srgb, var(--secondary-background-color) 66%, transparent); }
    .override-details > summary { min-height: 48px; padding: 8px 10px; }
    .override-details > summary .summary-title { font-size: 13px; }
    .override-details > summary .summary-subtitle { font-size: 11px; }
    .override-details > .override-panel { display: grid; gap: 10px; padding: 0 10px 10px; }
    .area-override-details { margin-top: 8px; }
    .category-override-details { background: var(--card-background-color); }
    .entity-override-details { margin-top: 2px; }
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
ne([
  Le({ attribute: !1 })
], Q.prototype, "hass", 2);
ne([
  C()
], Q.prototype, "config", 2);
ne([
  C()
], Q.prototype, "targetMode", 2);
ne([
  C()
], Q.prototype, "activeAreaId", 2);
ne([
  C()
], Q.prototype, "entitySearch", 2);
ne([
  C()
], Q.prototype, "candidateEntityId", 2);
ne([
  C()
], Q.prototype, "candidateSection", 2);
Q = ne([
  nt(Ti)
], Q);
const ja = Re`
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
    --aboc-entity-active-surface: var(--area-bubble-overview-entity-active-surface, #7fb8c1);
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
    width: max-content;
    min-width: 72px;
    max-width: min(46%, 180px);
    flex: 0 0 auto;
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

  .area-popup-subareas {
    display: grid;
    gap: var(--aboc-section-gap);
    min-width: 0;
    margin-block-start: 4px;
  }

  .area-popup-subarea {
    display: grid;
    gap: var(--aboc-section-gap);
    min-width: 0;
    padding: 9px;
    border: var(--aboc-area-frame-width) solid var(
      --aboc-area-frame-color,
      var(--area-bubble-overview-area-frame-color, color-mix(in srgb, var(--divider-color) 72%, transparent))
    );
    border-radius: calc(var(--aboc-radius) - 4px);
    background: color-mix(in srgb, var(--aboc-row-bg) 72%, transparent);
  }

  .area-popup-subarea.has-active {
    --aboc-area-frame-color: var(--area-bubble-overview-area-frame-active-color, var(--aboc-accent));
    background: color-mix(in srgb, var(--aboc-active-surface) 82%, transparent);
  }

  .area-popup-subarea-toggle {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 40px;
    align-items: center;
    gap: 9px;
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 2px;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .area-popup-subarea-heading {
    display: grid;
    min-width: 0;
  }

  .area-popup-subarea-heading strong {
    overflow: hidden;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .area-popup-subarea-heading small {
    color: var(--aboc-secondary-text);
    font-size: 12px;
  }

  .area-popup-subarea-chevron {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-control-surface) 10%, transparent);
    transition: transform 180ms ease;
  }

  .area-popup-subarea.expanded > .area-popup-subarea-toggle .area-popup-subarea-chevron {
    transform: rotate(180deg);
  }

  .area-popup-subarea-toggle:focus-visible {
    outline: 2px solid var(--aboc-accent);
    outline-offset: 2px;
  }

  .area-popup-subarea-disclosure {
    display: grid;
    gap: var(--aboc-section-gap);
    min-width: 0;
  }

  .area-popup-subarea-disclosure[hidden] {
    display: none;
  }

  .area-popup-subarea-content {
    display: grid;
    gap: var(--aboc-section-gap);
    min-width: 0;
  }

  .area-popup-subareas .area-popup-subareas {
    margin-block-start: 0;
    margin-inline-start: 12px;
    padding-inline-start: 7px;
    border-inline-start: 1px solid color-mix(in srgb, var(--aboc-accent) 40%, transparent);
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

  .quick-popup-cover-entity {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .quick-popup-cover-controls {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 44px;
    gap: 4px;
    direction: ltr;
  }

  .quick-popup-cover-control {
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

  .room-subarea {
    display: grid;
    gap: 8px;
    min-width: 0;
    padding: 8px;
    border: 1px solid color-mix(in srgb, var(--aboc-area-frame-color) 56%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: color-mix(in srgb, var(--aboc-row-bg) 66%, transparent);
  }

  .room-subarea.has-active {
    border-color: color-mix(in srgb, var(--aboc-accent) 52%, var(--aboc-area-frame-color));
    background: color-mix(in srgb, var(--aboc-active-surface) 38%, transparent);
  }

  .room-subarea-heading {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 9px;
    min-height: 44px;
    padding-inline: 3px 6px;
    color: var(--aboc-primary-text);
  }

  .room-subarea-icon {
    width: 36px;
    height: 36px;
    color: var(--aboc-accent);
    background: color-mix(in srgb, var(--aboc-accent) 13%, var(--aboc-row-bg));
  }

  .room-subarea-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 780;
    text-align: start;
  }

  .room-subarea-count {
    color: var(--aboc-secondary-text);
    font-size: 12px;
    font-weight: 700;
  }

  .room-subarea-sections {
    display: grid;
    gap: var(--aboc-section-gap);
    min-width: 0;
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

  .device-section.entity-size-compact {
    --aboc-entity-icon-size: 34px;
    --aboc-entity-icon-glyph-size: 20px;
    --aboc-entity-font-size: 13px;
    --aboc-entity-gap: 5px;
    --aboc-entity-padding-inline: 6px;
    --aboc-cover-grid-min-height: 76px;
  }

  .device-section.entity-size-medium {
    --aboc-entity-icon-size: 44px;
    --aboc-entity-icon-glyph-size: 25px;
    --aboc-entity-font-size: 15px;
    --aboc-entity-gap: 9px;
    --aboc-entity-padding-inline: 9px;
    --aboc-cover-grid-min-height: 92px;
  }

  .device-section.entity-size-wide {
    --aboc-entity-icon-size: 50px;
    --aboc-entity-icon-glyph-size: 28px;
    --aboc-entity-font-size: 16px;
    --aboc-entity-gap: 11px;
    --aboc-entity-padding-inline: 13px;
    --aboc-cover-grid-min-height: 108px;
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

  .section-heading.has-compact-subgroup-button {
    grid-template-columns: minmax(0, 1fr) minmax(0, auto) auto;
  }

  .section-compact-subgroup-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: auto;
    max-width: min(126px, 34cqi);
    min-width: 0;
    min-height: 44px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--aboc-accent) 48%, var(--divider-color));
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-row-bg) 78%, var(--aboc-accent) 22%);
    color: var(--aboc-primary-text);
    box-shadow: inset 0 1px 0 color-mix(in srgb, white 24%, transparent);
    cursor: pointer;
    transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }

  .section-compact-subgroup-button.inactive {
    background: color-mix(in srgb, var(--aboc-row-bg) 84%, var(--aboc-accent) 16%);
  }

  .section-compact-subgroup-button.active {
    border-color: color-mix(in srgb, var(--success-color, #4caf50) 72%, var(--aboc-accent));
    background: color-mix(in srgb, var(--aboc-entity-active-surface) 62%, var(--success-color, #4caf50) 38%);
    box-shadow: inset 0 1px 0 color-mix(in srgb, white 34%, transparent), 0 2px 8px color-mix(in srgb, var(--success-color, #4caf50) 22%, transparent);
  }

  .section-compact-subgroup-button span {
    min-width: 0;
    overflow: hidden;
    font-size: clamp(10px, 2.8cqi, 12px);
    font-weight: 760;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-compact-subgroup-button small {
    flex: 0 0 auto;
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  .section-compact-subgroup-button ha-icon {
    flex: 0 0 auto;
    color: currentColor;
    --mdc-icon-size: 18px;
  }

  .section-compact-subgroup-button:focus-visible {
    outline: 2px solid var(--aboc-accent);
    outline-offset: 2px;
  }

  .section-compact-subgroup-button:disabled {
    cursor: wait;
    opacity: 0.58;
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

  .device-section .icon-bubble.small {
    width: var(--aboc-entity-icon-size, 44px);
    height: var(--aboc-entity-icon-size, 44px);
  }

  .device-section .icon-bubble.small ha-icon {
    --mdc-icon-size: var(--aboc-entity-icon-glyph-size, 25px);
  }

  .entity-lead {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--aboc-entity-gap, 9px);
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
    font-size: var(--aboc-entity-font-size, 15px);
    font-weight: 720;
    line-height: 1.22;
    overflow-wrap: break-word;
    word-break: normal;
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
    gap: var(--aboc-entity-gap, 9px);
    width: 100%;
    min-height: var(--aboc-section-entity-height, max(56px, var(--aboc-row-height)));
    padding: 4px var(--aboc-entity-padding-inline, 9px);
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
    min-height: max(var(--aboc-section-entity-height, var(--aboc-row-height)), var(--aboc-row-height));
    padding: 8px var(--aboc-entity-padding-inline, 10px);
  }

  .light-card.dimmer-on {
    grid-template-columns: minmax(168px, 1.15fr) minmax(112px, 0.85fr);
    align-items: center;
  }

  .light-card.dimmer-off {
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
  }

  .section-lights_switches .light-card {
    grid-column: 1 / -1;
  }

  /* Redistribute a lone final switch after complete three-column rows or a
     full-width dimmer instead of leaving two empty columns beside it. */
  .section-lights_switches.columns-3 .section-entities > .toggle-tile:last-child:nth-child(3n + 1),
  .section-lights_switches.columns-3 .section-entities > .light-card:nth-last-child(2) + .toggle-tile:last-child {
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
    grid-template-columns: minmax(52px, 1fr) 34px;
    align-items: center;
    gap: 4px;
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
    gap: var(--aboc-entity-gap, 8px);
    min-height: var(--aboc-section-entity-height, max(56px, var(--aboc-row-height)));
    padding: 4px var(--aboc-entity-padding-inline, 8px);
  }

  .cover-card.active {
    border-color: color-mix(in srgb, var(--aboc-cover) 42%, var(--divider-color));
  }

  .section-covers.columns-2 .cover-card {
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    gap: 2px;
    min-height: max(var(--aboc-cover-grid-min-height, 92px), var(--aboc-section-entity-height, 92px));
  }

  .section-covers.columns-2 .cover-controls {
    justify-content: center;
  }

  .section-covers.columns-2 .section-entities > .cover-card:only-child {
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1fr) auto;
    align-content: initial;
    gap: var(--aboc-entity-gap, 8px);
    min-height: var(--aboc-section-entity-height, max(56px, var(--aboc-row-height)));
  }

  .section-covers.columns-2 .section-entities > .cover-card:only-child .cover-controls {
    justify-content: flex-end;
  }

  .section-lights_switches.columns-3 .toggle-tile {
    --aboc-entity-icon-size: 32px;
    --aboc-entity-icon-glyph-size: 18px;
    --aboc-entity-font-size: 12.5px;
    gap: 4px;
    padding-inline: 5px;
  }

  .section-lights_switches.columns-3 .entity-name {
    overflow-wrap: break-word;
    word-break: normal;
    -webkit-line-clamp: 3;
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
  .quick-popup-cover-control:hover:not([disabled]),
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
  .quick-popup-cover-control:active:not([disabled]),
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
      width: max-content;
      min-width: 68px;
      max-width: min(50%, 180px);
      flex: 0 0 auto;
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
      width: max-content;
      min-width: 64px;
      max-width: 52%;
      flex: 0 0 auto;
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
      width: max-content;
      min-width: 64px;
      max-width: min(58%, 180px);
      flex: 0 0 auto;
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

    .light-card.dimmer-on {
      grid-template-columns: minmax(156px, 1fr) minmax(72px, 0.45fr);
    }

    .light-card.dimmer-on .light-primary {
      grid-template-columns: minmax(0, 1fr) 40px;
      gap: 4px;
    }

    .light-card.dimmer-on .entity-lead {
      gap: 4px;
    }

    .light-card.dimmer-on .entity-name {
      overflow-wrap: normal;
      font-size: min(var(--aboc-entity-font-size, 15px), 13px);
      -webkit-line-clamp: 2;
    }

    .light-card.dimmer-on .brightness-control {
      grid-template-columns: minmax(0, 1fr);
    }

    .light-card.dimmer-on .brightness-value {
      display: none;
    }

    .light-card.dimmer-on .icon-bubble.small {
      width: 36px;
      height: 36px;
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
    .quick-popup-cover-control,
    .control-button,
    .toggle-tile,
    .hold-target {
      transition: none;
    }
  }
`;
var Ha = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, M = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Ua(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && Ha(t, i, a), a;
};
const de = (e, t) => {
  const i = e.entity.attributes[t];
  return typeof i == "number" && Number.isFinite(i) ? i : void 0;
}, Qe = "__overview_floor__";
let O = class extends re {
  constructor() {
    super(...arguments), this.expanded = {}, this.floorExpanded = !0, this.pendingActions = /* @__PURE__ */ new Set(), this.pendingSections = /* @__PURE__ */ new Set(), this.pendingEntities = /* @__PURE__ */ new Set(), this.floorPopupOpen = !1, this.pendingFloor = !1, this.pendingFloorRooms = /* @__PURE__ */ new Set(), this.optimisticClimateTargets = {}, this.storageId = "overview", this.suppressClickUntil = 0, this.restoreQuickPopupFocus = !0, this.restoreAreaPopupFocus = !0, this.climateTargetTimers = /* @__PURE__ */ new Map();
  }
  connectedCallback() {
    super.connectedCallback(), this.durationTimer ?? (this.durationTimer = window.setInterval(() => this.requestUpdate(), 6e4));
  }
  static getConfigElement() {
    return document.createElement(Ti);
  }
  static getStubConfig() {
    return { language: "auto", rtl: "auto" };
  }
  setConfig(e) {
    this.resetQuickPopup(), this.resetFloorPopup(), this.resetAreaPopup(), this.resetClimateTargets();
    try {
      ba(e), this.config = Pe(e), this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`, this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {}, this.floorExpanded = this.config.remember_expanded_state ? this.readFloorExpanded() ?? this.config.floor_default_expanded : this.config.floor_default_expanded, this.error = void 0;
    } catch (t) {
      this.error = t instanceof Error ? t.message : String(t);
    }
  }
  getCardSize() {
    if (!this.config) return 3;
    const e = at(this.hass, this.config);
    if (e.targetKind === "floor" && this.config.show_header && this.config.show_floor_header && !this.floorExpanded) return 2;
    const t = qa(e.areas, (i) => this.isExpanded(i));
    return Math.max(
      2,
      t.reduce(
        (i, o) => i + 2 + (this.isExpanded(o) ? o.sections.reduce((a, r) => a + r.entities.length, 0) : 0),
        e.targetKind === "floor" ? 1 : 0
      )
    );
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.cancelHold(), this.resetQuickPopup(), this.resetFloorPopup(), this.resetAreaPopup(), this.resetClimateTargets(), this.durationTimer !== void 0 && window.clearInterval(this.durationTimer), this.durationTimer = void 0;
  }
  render() {
    if (this.error) return p`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return m;
    const e = _a(this.hass, this.config);
    this.setAttribute("dir", e ? "rtl" : "ltr"), this.style.setProperty("--aboc-direction", e ? "rtl" : "ltr"), this.applyStyleVariables();
    const t = at(this.hass, this.config), i = `overview-floor-${this.storageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`, o = t.targetKind === "floor" && this.config.show_header && this.config.show_floor_header;
    return p`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(t, i)}
          ${t.targetKind === "none" ? this.renderEmpty(N(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline") : p`
                <div id=${i} ?hidden=${o && !this.floorExpanded}>
                  ${t.areas.length ? this.renderAreaHierarchy(t.areas) : this.renderEmpty(N(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
                </div>
              `}
          ${t.warnings.length && t.targetKind !== "none" ? p`<div class="warning">${t.warnings.join(" · ")}</div>` : m}
          ${this.config.debug ? p`<pre class="debug">${JSON.stringify(t, null, 2)}</pre>` : m}
        </div>
      </ha-card>
      ${this.renderQuickActionPopup(t)}
      ${this.renderFloorPopup(t)}
      ${this.renderAreaPopup(t)}
    `;
  }
  renderOverallHeader(e, t) {
    var o, a;
    if (!((o = this.config) != null && o.show_header) || !(e.targetKind === "floor" ? this.config.show_floor_header : !!this.config.title) || !e.targetName) return m;
    if (e.targetKind === "floor") {
      const r = e.areas.filter((d) => d.allEntities.some(le)), n = this.floorQuickArea(e), s = pe(n, "climate").filter((d) => d.powered && d.ignoreActivity !== !0), c = this.quickActionPending(Qe, "climate") || s.some((d) => this.pendingEntities.has(d.entityId)), l = e.areas.filter((d) => d.occupancy === "occupied").length, u = [
        `${e.areas.length} ${this.localText("אזורים", "areas")}`,
        r.length ? `${r.length} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && l ? `${l} ${this.localText("מאוכלסים", "occupied")}` : ""
      ].filter(Boolean).join(" · "), b = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${e.targetName}`;
      return p`
        <div class="overview-heading floor-heading ${r.length ? "has-active" : "all-off"}" data-powered=${r.length ? "true" : "false"}>
          <div class="floor-summary-pill">
            <button class="floor-toggle ${this.config.show_floor_expand_button ? "" : "without-floor-expand-button"}" type="button" aria-expanded=${this.floorExpanded} aria-controls=${t} aria-label=${b} @click=${() => this.toggleFloor()}>
              <span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span>
              <span class="heading-main"><span class="floor-title">${e.targetName}</span><span class="subtitle">${u}</span></span>
              ${this.config.show_floor_expand_button ? p`<span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>` : m}
            </button>
            ${s.length ? p`<button
                  class="floor-climate-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${((a = this.quickPopup) == null ? void 0 : a.areaId) === Qe && this.quickPopup.action === "climate"}
                  aria-busy=${c}
                  aria-label=${`${this.localText("פתיחת המזגנים הפעילים בקומה", "Open active floor climate controls")}: ${s.length}`}
                  ?disabled=${c}
                  @click=${(d) => this.openQuickActionPopup(d, n, "climate")}
                ><ha-icon icon=${this.config.quick_action_icons.climate}></ha-icon><span>${s.length}</span></button>` : m}
            ${r.length ? p`<button
                  class="floor-active-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${this.floorPopupOpen}
                  aria-label=${`${this.localText("פתיחת חדרים פעילים", "Open active rooms")}: ${r.length}`}
                  @click=${(d) => this.openFloorPopup(d)}
                ><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><span>${r.length}</span></button>` : m}
          </div>
        </div>
      `;
    }
    return p`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${e.targetIcon}></ha-icon></span><div class="heading-main"><h2>${e.targetName}</h2></div></div>`;
  }
  renderAreaHierarchy(e) {
    const { roots: t, children: i } = Tt(e), o = /* @__PURE__ */ new Set(), a = (r) => {
      if (o.has(r.id)) return m;
      o.add(r.id);
      const n = i.get(r.id) ?? [], s = this.isExpanded(r), l = this.areaOpenMode(r) === "popup" && this.areaPopupId === r.id ? [] : s ? n : n.filter((b) => b.showWhenParentCollapsed), u = l.length ? p`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${r.name}`}>${l.map(a)}</div>` : m;
      return p`
        <div class="area-tree-node">
          ${this.renderArea(r, u)}
        </div>
      `;
    };
    return p`<div class="areas">${t.map(a)}</div>`;
  }
  renderArea(e, t = m) {
    if (!this.config) return m;
    const o = this.areaOpenMode(e) === "popup", a = o && this.areaPopupId === e.id, r = !o && this.isExpanded(e), n = e.allEntities.filter(le).length, s = this.config.show_quick_actions ? na(e, this.config.quick_actions) : [], c = this.config.show_occupancy && e.occupancy !== "none", l = this.config.show_temperature && e.temperature !== void 0, u = l ? s.find(({ action: T }) => T === "climate") : void 0, b = u ? s.filter(({ action: T }) => T !== "climate") : s, d = pe(e, "fans"), g = (u == null ? void 0 : u.entities.filter((T) => T.powered && T.ignoreActivity !== !0).length) ?? 0, _ = d.filter((T) => T.powered && T.ignoreActivity !== !0).length, $ = (u == null ? void 0 : u.entities.length) ?? 0, f = d.length, x = c || b.length > 0 || l || _ > 0, w = l ? this.formatTemperature(e.temperature, e.temperatureUnit) : "", y = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active")
    }[e.temperatureMode], h = Math.min(8, b.length + Number(c) + Number(l) * 2 + +(!l && _ > 0)), v = h >= 5, k = e.id.replace(/[^a-zA-Z0-9_-]/g, "-"), A = `overview-area-${k}`, E = `overview-area-popup-${k}`, S = `overview-area-name-${k}`, F = o ? `${this.localText("פתיחת חדר בחלון", "Open room in dialog")}: ${e.name}` : `${N(this.hass, this.config, r ? "collapse" : "expand")}: ${e.name}`;
    return p`
      <section
        class="area-panel ${n ? "has-active" : "all-off"} ${r ? "expanded" : ""}"
        data-powered=${n ? "true" : "false"}
        aria-labelledby=${S}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div
            class="area-summary-pill quick-actions-${this.config.quick_actions_position} climate-tag-${this.config.climate_tag_position} summary-load-${h} ${v ? "compact-statuses" : ""} ${x ? "has-statuses" : "no-statuses"}"
            tabindex="-1"
            @click=${(T) => this.handleAreaSummaryClick(T, e)}
          >
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${o ? a : r}
              aria-haspopup=${o ? "dialog" : m}
              aria-controls=${o ? E : A}
              aria-label=${F}
              @click=${(T) => this.activateArea(T, e)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name" id=${S}>${e.name}</span>
                ${n ? p`<span class="active-summary">${n} ${this.localText("פעילים", "active")}</span>` : m}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(e)}
              ${b.length ? this.renderQuickActions(e, b) : m}
              ${l || u || _ > 0 ? p`<span
                    class="temperature-summary tag-position-${this.config.climate_tag_position}"
                    style=${`--aboc-temperature-tag-gap:${this.config.style.climate_tag_gap}px`}
                  >
                    ${l ? p`<span class="temperature area-temperature temperature-${e.temperatureMode}" title=${`${w} · ${y}`} aria-label=${`${w} · ${y}`}>${w}</span>` : m}
                    <span class="temperature-tags">
                      ${u && g > 0 ? this.renderTemperatureStatusTag(e, this.config.quick_action_icons.climate, g, $, "climate") : m}
                      ${this.config.show_fan_tag && _ > 0 ? this.renderTemperatureStatusTag(e, "mdi:fan", _, f, "fan") : m}
                    </span>
                  </span>` : m}
            </div>
          </div>
          ${this.config.show_area_expand_button ? p`<button
                class="expand-button"
                type="button"
                aria-expanded=${o ? a : r}
                aria-haspopup=${o ? "dialog" : m}
                aria-controls=${o ? E : A}
                aria-label=${F}
                @click=${(T) => this.activateArea(T, e)}
              ><span class="chevron ${o ? "popup-mode" : ""}" aria-hidden="true"><ha-icon icon=${o ? "mdi:open-in-new" : "mdi:chevron-down"}></ha-icon></span></button>` : m}
        </header>
        <div class="area-disclosure" id=${A} ?hidden=${!r}>
          <div class="expanded-content">${this.renderAreaContent(e)}</div>
          ${r ? t : m}
        </div>
        ${r ? m : t}
      </section>
    `;
  }
  renderTemperatureStatusTag(e, t, i, o, a) {
    var l;
    if (!this.config) return m;
    const r = a === "fan" ? "fans" : "climate", n = this.quickActionPending(e.id, r), s = a === "fan" ? this.localText("מאוורר פעיל", "Active fan") : this.localText("מיזוג אוויר פעיל", "Active climate"), c = a === "fan" ? this.localText("פתיחת בקרת מאווררים", "Open fan controls") : this.localText("פתיחת מיזוג אוויר", "Open climate controls");
    return p`<button
      class="temperature-status-tag temperature-${a}-tag temperature-${e.temperatureMode}"
      type="button"
      title=${`${s}: ${i}/${o}`}
      aria-label=${`${c}: ${e.name} · ${s} (${i}/${o})`}
      aria-haspopup="dialog"
      aria-expanded=${((l = this.quickPopup) == null ? void 0 : l.areaId) === e.id && this.quickPopup.action === r}
      aria-busy=${n}
      ?disabled=${n}
      @click=${(u) => this.openQuickActionPopup(u, e, r)}
    ><ha-icon icon=${t}></ha-icon></button>`;
  }
  renderOccupancy(e) {
    var n;
    if (!((n = this.config) != null && n.show_occupancy) || e.occupancy === "none") return m;
    const t = e.occupancy === "occupied", i = e.occupancyCount === void 0 ? "?" : e.occupancyCount > 9 ? "9+" : String(e.occupancyCount), o = t ? "mdi:account-multiple" : e.occupancy === "vacant" ? "mdi:account-multiple-outline" : "mdi:account-question-outline", a = N(this.hass, this.config, e.occupancy === "occupied" ? "occupied" : e.occupancy === "vacant" ? "vacant" : "unknown"), r = e.occupancyCount === void 0 ? a : e.occupancyCountSource === "entity" ? `${e.name}: ${e.occupancyCount} ${this.localText("נוכחים", "occupants")}` : `${e.name}: ${e.occupancyCount} ${this.localText("חיישני נוכחות פעילים", "active presence sensors")}`;
    return p`
      <span class="summary-chip occupancy ${t ? "occupied" : e.occupancy === "unknown" ? "unknown" : "vacant"}" title=${r} aria-label=${r}>
        <ha-icon icon=${o}></ha-icon>
        <span class="occupancy-count" aria-hidden="true">${i}</span>
        <span class="occupancy-label">${r}</span>
      </span>
    `;
  }
  renderQuickActions(e, t) {
    return this.config ? p`
      <div class="quick-actions" role="group" aria-label=${`${this.localText("פעולות מהירות", "Quick actions")}: ${e.name}`}>
        ${t.map(({ action: i, entities: o }) => {
      var l;
      const a = o.filter((u) => u.powered).length, r = this.quickActionPending(e.id, i) || o.some((u) => this.pendingEntities.has(u.entityId)), n = pi(this.hass, this.config, i), s = `${this.localText("פתיחת", "Open")} ${n}: ${e.name} (${a}/${o.length})`, c = ((l = this.quickPopup) == null ? void 0 : l.areaId) === e.id && this.quickPopup.action === i;
      return p`
            <button
              class="quick-action ${a ? "active" : "inactive"}"
              type="button"
              title=${s}
              aria-label=${s}
              aria-haspopup="dialog"
              aria-expanded=${c}
              aria-busy=${r}
              ?disabled=${r}
              @click=${(u) => this.openQuickActionPopup(u, e, i)}
            >
              <ha-icon icon=${r ? "mdi:loading" : this.config.quick_action_icons[i]}></ha-icon>
              ${a ? p`<span class="count-badge">${a}</span>` : m}
            </button>
          `;
    })}
      </div>
    ` : m;
  }
  renderAreaContent(e) {
    if (!this.config) return m;
    const t = this.config.area_overrides[e.id] ?? this.config.area_overrides[e.name], i = Ra(e, t == null ? void 0 : t.subarea_order, this.config.show_empty_sections);
    return p`
      ${i.generalSections.map((o) => this.renderSection(o, e))}
      ${i.subareas.map((o, a) => {
      const r = o.entities.filter(le).length, n = `overview-room-subarea-${e.id}-${a}`.replace(/[^a-zA-Z0-9_-]/g, "-");
      return p`
          <section class="room-subarea ${r ? "has-active" : "all-off"}" aria-labelledby=${n}>
            <header class="room-subarea-heading" id=${n}>
              <span class="icon-bubble room-subarea-icon"><ha-icon icon="mdi:home-floor-1"></ha-icon></span>
              <span class="room-subarea-title">${o.name}</span>
              <span class="room-subarea-count">${r}/${o.entities.length}</span>
            </header>
            <div class="room-subarea-sections">
              ${o.sections.map((s) => this.renderSection(s, e, `subarea-${a}`))}
            </div>
          </section>
        `;
    })}
    `;
  }
  renderSection(e, t, i = "general") {
    var qt, Rt, Dt, Lt, jt, Ht, Ut, Bt, Vt;
    const o = t.id, a = i === "general" ? o : `${o}:${i}`, r = `overview-section-${e.id}-${o}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "-"), n = bt(e, !0), s = bt(e, !1), c = this.pendingSections.has(`${a}:${e.id}:on`), l = this.pendingSections.has(`${a}:${e.id}:off`), u = c || l || e.entities.some((W) => this.pendingEntities.has(W.entityId)), b = e.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on"), d = e.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off"), g = `${b}: ${e.title} (${n.length})`, _ = `${d}: ${e.title} (${s.length})`, $ = ((qt = this.config) == null ? void 0 : qt.area_overrides[t.id]) ?? ((Rt = this.config) == null ? void 0 : Rt.area_overrides[t.name]), f = { ...((Dt = this.config) == null ? void 0 : Dt.section_styles[e.id]) ?? {}, ...((Lt = $ == null ? void 0 : $.section_styles) == null ? void 0 : Lt[e.id]) ?? {} }, x = ((jt = this.config) == null ? void 0 : jt.style.section_frame_brightness) ?? 12, y = `color-mix(in srgb, var(--aboc-area-frame-color) ${Math.max(0, 100 - Math.abs(x))}%, ${x >= 0 ? "white" : "black"})`, h = (Ht = this.config) != null && Ht.style.link_section_frame_color ? y : "color-mix(in srgb, var(--divider-color) 58%, transparent)", v = f.columns ?? (e.id === "lights_switches" || e.id === "floor_heating" ? 2 : 1), k = e.id === "covers" ? Math.min(2, v) : v, A = ($ == null ? void 0 : $.entity_card_size) ?? ((Ut = this.config) == null ? void 0 : Ut.entity_card_size) ?? "medium", S = {
      compact: e.id === "climate" ? 96 : e.id === "floor_heating" ? 80 : 48,
      medium: e.id === "climate" ? 108 : e.id === "floor_heating" ? 92 : 56,
      wide: e.id === "climate" ? 120 : e.id === "floor_heating" ? 108 : 68
    }[A], F = f.entity_height ?? S, T = f.action_presentation ?? ((Bt = this.config) == null ? void 0 : Bt.section_action_presentation) ?? "icon", ve = [
      `--aboc-section-background:${f.background || "transparent"}`,
      `--aboc-section-border-color:${f.border_color || h}`,
      `--aboc-section-border-width:${f.border_width ?? 1}px`,
      `--aboc-section-border-style:${f.border_style ?? "solid"}`,
      `--aboc-section-columns:${k}`,
      `--aboc-section-entity-height:${F}px`
    ].join(";"), se = s.length === 0, st = se ? n : s, _e = se ? c : l, He = se ? g : _, Ue = e.id === "climate" && this.fanDisplayMode(t) === "button" ? oe : e.id === "floor_heating" && this.heatingControlsDisplayMode(t) === "button" ? J : void 0, ct = Ue ? e.entities.filter((W) => W.group === Ue) : [];
    return p`
      <section class="device-section section-${e.id} columns-${k} entity-size-${A} ${f.show_border ? "section-framed" : ""}" style=${ve} aria-labelledby=${r}>
        <h3 class="section-heading ${ct.length ? "has-compact-subgroup-button" : ""}" id=${r}>
          <span class="section-heading-main"><ha-icon icon=${e.icon}></ha-icon><span class="section-title" title=${e.title}>${e.title}</span><span class="section-count">${e.activeCount}/${e.entities.length}</span></span>
          ${Ue && ct.length ? this.renderAutomaticSubgroupButton(t, Ue, ct) : m}
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${e.title}`}>
            ${((Vt = this.config) == null ? void 0 : Vt.section_action_mode) === "toggle" ? p`<button
                  class="section-toggle-button presentation-${T} ${se ? "turn-on" : "turn-off"}"
                  type="button"
                  title=${He}
                  aria-label=${He}
                  aria-busy=${_e}
                  ?disabled=${u || st.length === 0}
                  @click=${(W) => this.handleSectionAction(W, e, a, se)}
                >${this.renderSectionActionContent(e.id, se, _e, T)}</button>` : p`
                  <button
                    class="section-on-button presentation-${T}"
                    type="button"
                    title=${g}
                    aria-label=${g}
                    aria-busy=${c}
                    ?disabled=${u || n.length === 0}
                    @click=${(W) => this.handleSectionAction(W, e, a, !0)}
                  >${this.renderSectionActionContent(e.id, !0, c, T)}</button>
                  <button
                    class="section-off-button presentation-${T}"
                    type="button"
                    title=${_}
                    aria-label=${_}
                    aria-busy=${l}
                    ?disabled=${u || s.length === 0}
                    @click=${(W) => this.handleSectionAction(W, e, a, !1)}
                  >${this.renderSectionActionContent(e.id, !1, l, T)}</button>
                `}
          </span>
        </h3>
        ${this.renderSectionEntities(e, t, k)}
      </section>
    `;
  }
  renderSectionEntities(e, t, i) {
    if (!e.entities.length)
      return p`<div class="section-entities"><div class="secondary section-empty">${this.config && Z(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div></div>`;
    const o = e.id === "climate" && this.fanDisplayMode(t) === "button" ? oe : e.id === "floor_heating" && this.heatingControlsDisplayMode(t) === "button" ? J : void 0, a = (s, c = !1) => `--aboc-section-columns:${c ? 1 : Math.max(1, Math.min(i, s))}`, r = e.entities.filter((s) => !s.group), n = /* @__PURE__ */ new Map();
    for (const s of e.entities) {
      if (!s.group || s.group === o) continue;
      const c = n.get(s.group) ?? [];
      c.push(s), n.set(s.group, c);
    }
    return p`
      ${r.length ? p`<div class="section-entities" style=${a(r.length)}>${r.map((s) => this.renderEntity(s, e.id))}</div>` : m}
      ${[...n.entries()].map(([s, c]) => {
      const l = this.subgroupTitle(s, t), u = s === J;
      return p`
          <section class="entity-subgroup ${u ? "automatic-heating-controls" : ""}" aria-label=${l}>
            <div class="entity-subgroup-heading"><ha-icon icon=${this.subgroupIcon(s)}></ha-icon><span>${l}</span><small>${c.filter((b) => b.powered).length}/${c.length}</small></div>
            <div class="section-entities" style=${a(c.length, u)}>${c.map((b) => this.renderEntity(b, e.id))}</div>
          </section>
        `;
    })}
    `;
  }
  renderAutomaticSubgroupButton(e, t, i) {
    const o = i.filter((d) => d.powered).length, a = t === J, r = a ? "heating_controls" : "fans", n = a ? "mdi:radiator" : "mdi:fan", s = this.subgroupTitle(t, e, !0), c = this.quickActionPending(e.id, r) || i.some((d) => this.pendingEntities.has(d.entityId)), l = o === 0, u = Ke(e, r, l), b = `${a ? this.localText(l ? "הדלקת מפסק חימום" : "כיבוי מפסק חימום", l ? "Turn heating switch on" : "Turn heating switch off") : this.localText(l ? "הדלקת מאוורר" : "כיבוי מאוורר", l ? "Turn fan on" : "Turn fan off")}: ${e.name} · ${o}/${i.length}`;
    return p`
      <button
        class="section-compact-subgroup-button ${a ? "section-heating-controls-button" : "section-fan-button"} ${o ? "active" : "inactive"}"
        type="button"
        title=${b}
        aria-label=${b}
        aria-pressed=${o > 0}
        aria-busy=${c}
        ?disabled=${c || u.length === 0}
        @click=${(d) => this.handleCompactSubgroupToggle(d, e, r)}
      ><ha-icon icon=${c ? "mdi:loading" : n}></ha-icon><span>${s}</span><small>${o}/${i.length}</small></button>
    `;
  }
  fanDisplayMode(e) {
    var i, o, a;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((o = this.config) == null ? void 0 : o.area_overrides[e.name]);
    return (t == null ? void 0 : t.fan_display_mode) ?? ((a = this.config) == null ? void 0 : a.fan_display_mode) ?? "subgroup";
  }
  heatingControlsDisplayMode(e) {
    var i, o, a;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((o = this.config) == null ? void 0 : o.area_overrides[e.name]);
    return (t == null ? void 0 : t.heating_controls_display_mode) ?? ((a = this.config) == null ? void 0 : a.heating_controls_display_mode) ?? "subgroup";
  }
  subgroupTitle(e, t, i = !1) {
    var n, s, c, l;
    const o = e === oe ? "fans" : e === J ? "heating_controls" : void 0;
    if (!o) return e;
    const a = ((n = this.config) == null ? void 0 : n.area_overrides[t.id]) ?? ((s = this.config) == null ? void 0 : s.area_overrides[t.name]), r = ((c = a == null ? void 0 : a.subgroup_titles) == null ? void 0 : c[o]) || ((l = this.config) == null ? void 0 : l.subgroup_titles[o]);
    return r || (o === "fans" ? i ? this.localText("מאוורר", "Fan") : this.localText("מאווררים", "Fans") : o === "heating_controls" ? i ? this.localText("מפסק", "Switch") : this.localText("בקרי חימום", "Heating controls") : e);
  }
  subgroupIcon(e) {
    return e === oe ? "mdi:fan" : e === J ? "mdi:radiator" : "mdi:folder-home-outline";
  }
  sectionActionIcon(e, t) {
    return this.config ? e === "covers" ? t ? this.config.section_action_icons.open : this.config.section_action_icons.close : t ? this.config.section_action_icons.on : this.config.section_action_icons.off : t ? "mdi:play-circle-outline" : "mdi:stop-circle-outline";
  }
  renderSectionActionContent(e, t, i, o) {
    const a = i ? "mdi:loading" : this.sectionActionIcon(e, t), r = e === "covers" ? t ? this.localText("פתח", "Open") : this.localText("סגור", "Close") : t ? this.localText("הדלק", "On") : this.localText("כבה", "Off");
    return p`
      ${o !== "text" ? p`<ha-icon icon=${a}></ha-icon>` : m}
      ${o !== "icon" ? p`<span class="section-action-label">${i ? this.localText("מבצע…", "Working…") : r}</span>` : m}
    `;
  }
  renderQuickActionPopup(e) {
    if (!this.config || !this.quickPopup) return m;
    const t = this.quickPopup.areaId === Qe && e.targetKind === "floor" ? this.floorQuickArea(e) : e.areas.find((w) => {
      var y;
      return w.id === ((y = this.quickPopup) == null ? void 0 : y.areaId);
    });
    if (!t)
      return queueMicrotask(() => this.resetQuickPopup()), m;
    const i = this.quickPopup.action, o = pe(t, i);
    if (!o.length)
      return queueMicrotask(() => this.resetQuickPopup()), m;
    const a = pi(this.hass, this.config, i), r = o.filter((w) => w.powered).length, n = Ke(t, i, !0), s = Ke(t, i, !1), c = this.pendingActions.has(`${t.id}:${i}:on`), l = this.pendingActions.has(`${t.id}:${i}:off`), u = c || l, b = o.some((w) => this.pendingEntities.has(w.entityId)), d = u || b, _ = `overview-quick-popup-title-${`${t.id}-${i}`.replace(/[^a-zA-Z0-9_-]/g, "-")}`, $ = i === "covers" ? this.localText("פתיחת הכל", "Open all") : this.localText("הפעלת הכל", "Turn all on"), f = i === "covers" ? this.localText("סגירת הכל", "Close all") : this.localText("כיבוי הכל", "Turn all off"), x = i === "fans" ? "mdi:fan" : i === "heating_controls" ? "mdi:radiator" : this.config.quick_action_icons[i];
    return p`
      <dialog
        class="quick-action-dialog area-quick-action-dialog"
        aria-modal="true"
        aria-labelledby=${_}
        @cancel=${(w) => this.handleQuickPopupCancel(w)}
        @close=${() => this.handleQuickPopupClosed()}
        @click=${(w) => this.handleQuickPopupBackdrop(w)}
        @keydown=${(w) => this.handleQuickPopupKeydown(w)}
      >
        <section class="quick-popup" aria-busy=${d}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${x}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${_}>${a} · ${t.name}</span>
              <span class="quick-popup-summary">${r} ${this.localText("דלוקים מתוך", "on of")} ${o.length}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeQuickActionPopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="quick-popup-group-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${a}`}>
            <button
              class="quick-popup-group-button turn-on"
              type="button"
              aria-label=${`${$}: ${a} (${n.length})`}
              aria-busy=${c}
              ?disabled=${d || n.length === 0}
              @click=${(w) => this.handleQuickActionGroupAction(w, t, i, !0)}
            ><ha-icon icon=${c ? "mdi:loading" : i === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${$}</span><small>${n.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${f}: ${a} (${s.length})`}
              aria-busy=${l}
              ?disabled=${d || s.length === 0}
              @click=${(w) => this.handleQuickActionGroupAction(w, t, i, !1)}
            ><ha-icon icon=${l ? "mdi:loading" : i === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon><span>${f}</span><small>${s.length}</small></button>
          </div>
          <div class="quick-popup-list" role="list" aria-label=${a}>
            ${o.map((w) => this.renderQuickPopupEntity(w, i, u))}
          </div>
        </section>
      </dialog>
    `;
  }
  renderFloorPopup(e) {
    if (!this.config || !this.floorPopupOpen || e.targetKind !== "floor") return m;
    const t = e.areas.filter((a) => a.allEntities.some(le));
    if (!t.length)
      return queueMicrotask(() => this.resetFloorPopup()), m;
    const i = t.flatMap((a) => Je(a, !1)), o = "overview-floor-popup-title";
    return p`
      <dialog
        class="quick-action-dialog floor-action-dialog"
        aria-modal="true"
        aria-labelledby=${o}
        @cancel=${(a) => {
      a.preventDefault(), this.closeFloorPopup();
    }}
        @close=${() => this.handleFloorPopupClosed()}
        @click=${(a) => {
      a.target === a.currentTarget && this.closeFloorPopup();
    }}
      >
        <section class="quick-popup floor-popup" aria-busy=${this.pendingFloor || this.pendingFloorRooms.size > 0}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${e.targetIcon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${o}>${this.localText("חדרים פעילים", "Active rooms")} · ${e.targetName}</span>
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
            @click=${(a) => this.handleFloorAllOff(a, t)}
          ><ha-icon icon=${this.pendingFloor ? "mdi:loading" : this.config.section_action_icons.off}></ha-icon><span>${this.localText("כיבוי כל החדרים", "Turn off all rooms")}</span><small>${i.length}</small></button>
          <div class="floor-room-list" role="list">
            ${t.map((a) => {
      const r = Je(a, !1), n = this.pendingFloor || this.pendingFloorRooms.has(a.id) || r.some((s) => this.pendingEntities.has(s.entityId));
      return p`
                <article class="floor-room-row" role="listitem">
                  <span class="icon-bubble small"><ha-icon icon=${a.icon}></ha-icon></span>
                  <span class="floor-room-main"><strong>${a.name}</strong><small>${a.allEntities.filter(le).length} ${this.localText("פעילים", "active")}</small></span>
                  <button
                    class="floor-room-off"
                    type="button"
                    aria-label=${`${this.localText("כיבוי חדר", "Turn off room")}: ${a.name} (${r.length})`}
                    aria-busy=${this.pendingFloorRooms.has(a.id)}
                    ?disabled=${n || r.length === 0}
                    @click=${(s) => this.handleFloorRoomOff(s, a)}
                  ><ha-icon icon=${this.pendingFloorRooms.has(a.id) ? "mdi:loading" : this.config.section_action_icons.off}></ha-icon></button>
                </article>
              `;
    })}
          </div>
        </section>
      </dialog>
    `;
  }
  renderAreaPopup(e) {
    if (!this.config || !this.areaPopupId) return m;
    const t = e.areas.find((n) => n.id === this.areaPopupId);
    if (!t || this.areaOpenMode(t) !== "popup")
      return queueMicrotask(() => this.resetAreaPopup()), m;
    const i = t.allEntities.filter(le).length, a = `overview-area-popup-${t.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`, r = `${a}-title`;
    return p`
      <dialog
        id=${a}
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
          <div class="area-detail-content">
            ${this.renderAreaContent(t)}
            ${this.renderAreaPopupSubareas(t, e.areas)}
          </div>
        </section>
      </dialog>
    `;
  }
  /** Renders the full configured Area subtree inside a parent Area dialog. */
  renderAreaPopupSubareas(e, t) {
    const { children: i } = Tt(t), o = /* @__PURE__ */ new Set([e.id]), a = (r) => {
      const n = (i.get(r.id) ?? []).filter((s) => !o.has(s.id));
      if (!n.length) return m;
      for (const s of n) o.add(s.id);
      return p`
        <div class="area-popup-subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${r.name}`}>
          ${n.map((s) => {
        const c = s.allEntities.filter(le).length, u = `area-popup-subarea-${s.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`, b = `${u}-content`, d = this.isPopupSubareaExpanded(s);
        return p`
              <section class="area-popup-subarea ${c ? "has-active" : "all-off"} ${d ? "expanded" : "collapsed"}" aria-labelledby=${u}>
                <button
                  class="area-popup-subarea-toggle"
                  type="button"
                  aria-expanded=${d}
                  aria-controls=${b}
                  aria-label=${`${d ? this.localText("כיווץ תת־אזור", "Collapse sub-area") : this.localText("פתיחת תת־אזור", "Expand sub-area")}: ${s.name}`}
                  @click=${(g) => this.togglePopupSubarea(g, s)}
                >
                  <span class="icon-bubble small"><ha-icon icon=${s.icon}></ha-icon></span>
                  <span class="area-popup-subarea-heading">
                    <strong id=${u}>${s.name}</strong>
                    <small>${c ? `${c} ${this.localText("פעילים", "active")}` : this.localText("הכול כבוי", "All off")}</small>
                  </span>
                  <ha-icon class="area-popup-subarea-chevron" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
                </button>
                <div class="area-popup-subarea-disclosure" id=${b} ?hidden=${!d}>
                  <div class="area-popup-subarea-content">${this.renderAreaContent(s)}</div>
                  ${a(s)}
                </div>
              </section>
            `;
      })}
        </div>
      `;
    };
    return a(e);
  }
  floorQuickArea(e) {
    const t = /* @__PURE__ */ new Map();
    for (const i of e.areas)
      for (const o of i.allEntities) t.set(o.entityId, o);
    return {
      id: Qe,
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
    if (t === "covers") return this.renderQuickPopupCoverEntity(e, i);
    const o = this.entityBusy(e), a = !e.powered, r = St(t, e, a), n = !e.available || o || i || !r, s = a ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off"), c = e.available ? r ? "" : this.localText("אין פעולת שליטה נתמכת", "No supported control action") : N(this.hass, this.config, "unavailable");
    return p`
      <article class="quick-popup-entity ${e.powered ? "active" : "inactive"} ${e.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(l) => this.startHold(l, e)}
          @pointermove=${(l) => this.moveHold(l)}
          @pointerup=${(l) => this.finishHold(l)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(l) => this.handleMoreInfoClick(l, e)}
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
          aria-busy=${o}
          aria-label=${c || `${s}: ${e.name}`}
          title=${c || `${s}: ${e.name}`}
          ?disabled=${n}
          @click=${(l) => this.handleQuickPopupEntityAction(l, e, t)}
        ><ha-icon icon=${o ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderQuickPopupCoverEntity(e, t) {
    const i = this.entityBusy(e), o = Me(e.entity), a = e.entity.attributes.assumed_state === !0, n = [
      { service: "open_cover", icon: "mdi:arrow-up" },
      { service: "stop_cover", icon: "mdi:stop" },
      { service: "close_cover", icon: "mdi:arrow-down" }
    ].filter(({ service: s }) => ot(e.entity, s));
    return p`
      <article class="quick-popup-entity quick-popup-cover-entity ${e.powered ? "active" : "inactive"} ${e.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(s) => this.startHold(s, e)}
          @pointermove=${(s) => this.moveHold(s)}
          @pointerup=${(s) => this.finishHold(s)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(s) => this.handleMoreInfoClick(s, e)}
        >
          <span class="icon-bubble small"><ha-icon icon=${e.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${e.name}</span>
            <span class="state-text">${this.entitySecondary(e)}${e.protected ? ` · ${this.localText("מוגן מקבוצה", "group protected")}` : ""}</span>
          </span>
        </button>
        <span class="quick-popup-cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${e.name}`}>
          ${n.map(({ service: s, icon: c }) => {
      const l = !e.available || i || t || kt(
        s,
        e.entity.state,
        o,
        a
      );
      return p`<button
              class="quick-popup-cover-control"
              type="button"
              aria-busy=${i}
              aria-label=${`${this.coverServiceLabel(s)}: ${e.name}`}
              title=${`${this.coverServiceLabel(s)}: ${e.name}`}
              ?disabled=${l}
              @click=${(u) => this.runEntityService(u, e, s)}
            ><ha-icon icon=${i ? "mdi:loading" : c}></ha-icon></button>`;
    })}
        </span>
      </article>
    `;
  }
  renderEntity(e, t) {
    return t === "floor_heating" ? this.renderFloorHeating(e) : e.domain === "climate" ? this.renderClimate(e) : e.domain === "cover" ? this.renderCover(e) : e.domain === "media_player" ? this.renderMedia(e) : ra(e) ? this.renderLight(e) : this.renderToggle(e);
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
            ${t.showState ? p`<span class="state-text">${this.entitySecondary(e)}</span>` : m}
          </span>
      </button>
    `;
  }
  renderToggle(e) {
    const t = this.entityBusy(e), i = X(e, !e.powered), o = !e.available || t || !i, a = this.entityPresentation(e), r = this.isCompactAuxiliary(e);
    return p`
      <button
        class="toggle-tile entity-card hold-target tile-shape-${a.shape} tile-icon-${a.iconPosition} ${r ? "compact-auxiliary" : ""} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${e.powered}
        aria-busy=${t}
        aria-disabled=${o}
        aria-label=${`${e.name}: ${this.entitySecondary(e)}. ${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}`}
        title=${`${e.active ? N(this.hass, this.config, "turn_off") : N(this.hass, this.config, "on")} · ${this.localText("לחיצה ארוכה לפרטים", "hold for details")}`}
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
          ${a.showState ? p`<span class="state-text">${this.entitySecondary(e)}</span>` : m}
        </span>
      </button>
    `;
  }
  renderClimate(e) {
    var $;
    const t = de(e, "current_temperature"), i = this.areaTemperatureUnit(e), o = Ge(e, i), a = this.displayedClimateTargets(e), r = a.temperature, n = a.low, s = a.high, c = r === void 0 && n !== void 0 && s !== void 0, l = zi(e), u = V(e.entity, be.FAN_MODE) && Array.isArray(e.entity.attributes.fan_modes) ? e.entity.attributes.fan_modes.map(String) : [], b = this.entityBusy(e), d = this.climateModeIcon(e.entity.state), g = (($ = this.config) == null ? void 0 : $.climate_mode_presentation) ?? "both", _ = String(e.entity.attributes.fan_mode ?? "");
    return p`
      <article class="climate-card entity-card full-span mode-${e.entity.state} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${b}>
        <div class="climate-primary">
          ${this.renderEntityLead(e)}
          ${!c && r !== void 0 ? p`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${b || !e.available} @click=${() => this.setClimateTemperature(e, r - o)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                  <span>${this.formatTemperature(r, i)}</span>
                  <button type="button" ?disabled=${b || !e.available} @click=${() => this.setClimateTemperature(e, r + o)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
                </span>
              ` : t !== void 0 ? p`<span class="temperature current-temperature">${this.formatTemperature(t, i)}</span>` : m}
        </div>
        ${c ? this.renderClimateRange(e, n, s, o, b) : m}
        ${l.length || u.length ? p`<div class="climate-secondary" @click=${(f) => f.stopPropagation()}>
          ${l.length ? p`<div class="climate-mode-control presentation-${g}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${e.name}`}
                .value=${e.entity.state}
                .disabled=${b || !e.available}
                .options=${l.map((f) => ({ value: f, label: this.climateModeLabel(f), icon: this.climateModeIcon(f) }))}
                @wa-select=${(f) => this.setClimateMode(e, f)}
              >${g !== "text" ? p`<ha-icon slot="icon" icon=${d}></ha-icon>` : m}</ha-control-select-menu>
              ${g !== "icon" ? p`<span class="climate-mode-value">${this.climateModeLabel(e.entity.state)}</span>` : m}
              </div>` : m}
          ${u.length ? p`<div class="climate-mode-control presentation-${g}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${e.name}`}
                .value=${_}
                .disabled=${b || !e.available}
                .options=${u.map((f) => ({ value: f, label: this.modeLabel(f), icon: "mdi:fan" }))}
                @wa-select=${(f) => this.setFanMode(e, f)}
              >${g !== "text" ? p`<ha-icon slot="icon" icon="mdi:fan"></ha-icon>` : m}</ha-control-select-menu>
              ${g !== "icon" ? p`<span class="climate-mode-value">${_ ? this.modeLabel(_) : this.localText("לא ידוע", "Unknown")}</span>` : m}
              </div>` : m}
          </div>` : m}
      </article>
    `;
  }
  renderLight(e) {
    var n;
    const t = this.entityBusy(e), i = li(e), o = X(e, !e.powered), a = `${this.localText("בהירות", "Brightness")}: ${e.name}`, r = this.entityPresentation(e);
    return p`
      <article class="light-card dimmer-card ${e.powered ? "dimmer-on" : "dimmer-off"} entity-card tile-shape-${r.shape} tile-icon-${r.iconPosition} ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        <div class="light-primary">
          ${this.renderEntityLead(e)}
          <button
            class="light-power ${e.powered ? "active" : ""}"
            type="button"
            aria-pressed=${e.powered}
            aria-label=${`${e.powered ? N(this.hass, this.config, "turn_off") : N(this.hass, this.config, "on")}: ${e.name}`}
            ?disabled=${t || !e.available || !o}
            @click=${(s) => this.toggleEntity(s, e)}
          ><ha-icon icon=${t ? "mdi:loading" : "mdi:power"}></ha-icon></button>
        </div>
        ${e.powered ? p`<div class="brightness-control" @click=${(s) => s.stopPropagation()}>
          <ha-control-slider
            class="brightness-slider"
            .value=${i}
            .min=${0}
            .max=${100}
            .step=${1}
            .disabled=${t || !e.available}
            .locale=${(n = this.hass) == null ? void 0 : n.locale}
            .label=${a}
            unit="%"
            show-handle
            tooltip-mode="interaction"
            @value-changed=${(s) => this.setLightBrightness(e, s)}
          ></ha-control-slider>
          <span class="brightness-value" aria-hidden="true">${i}%</span>
        </div>` : m}
      </article>
    `;
  }
  renderClimateRange(e, t, i, o, a) {
    return p`
      <div class="temperature-range" role="group" aria-label=${`${this.localText("טווח טמפרטורה", "Temperature range")}: ${e.name}`}>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${a || !e.available} @click=${() => this.setClimateRange(e, t - o, i, "low")} aria-label=${`${this.localText("הורדת סף תחתון", "Decrease low target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("נמוך", "Low")}</small>${this.formatTemperature(t, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${a || !e.available} @click=${() => this.setClimateRange(e, t + o, i, "low")} aria-label=${`${this.localText("העלאת סף תחתון", "Increase low target")}: ${e.name}`}>+</button>
        </span>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${a || !e.available} @click=${() => this.setClimateRange(e, t, i - o, "high")} aria-label=${`${this.localText("הורדת סף עליון", "Decrease high target")}: ${e.name}`}>−</button>
          <span><small>${this.localText("גבוה", "High")}</small>${this.formatTemperature(i, this.areaTemperatureUnit(e))}</span>
          <button type="button" ?disabled=${a || !e.available} @click=${() => this.setClimateRange(e, t, i + o, "high")} aria-label=${`${this.localText("העלאת סף עליון", "Increase high target")}: ${e.name}`}>+</button>
        </span>
      </div>
    `;
  }
  renderFloorHeating(e) {
    const t = e.domain === "water_heater" ? Pi.TARGET_TEMPERATURE : be.TARGET_TEMPERATURE, i = this.areaTemperatureUnit(e), o = e.domain === "climate" ? this.displayedClimateTargets(e) : void 0, a = (o == null ? void 0 : o.temperature) ?? (V(e.entity, t) ? de(e, "temperature") : void 0), r = o == null ? void 0 : o.low, n = o == null ? void 0 : o.high, s = a === void 0 && r !== void 0 && n !== void 0, c = de(e, "current_temperature");
    if (a === void 0 && c === void 0 && !s) return this.renderToggle(e);
    const l = Ge(e, i), u = this.entityBusy(e), b = X(e, !e.powered);
    return p`
      <article class="thermostat-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${u}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(e)}
          ${a !== void 0 ? p`<span class="temperature-stepper">
                <button type="button" ?disabled=${u || !e.available} @click=${() => this.setClimateTemperature(e, a - l)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${e.name}`}>−</button>
                <span>${this.formatTemperature(a, i)}</span>
                <button type="button" ?disabled=${u || !e.available} @click=${() => this.setClimateTemperature(e, a + l)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${e.name}`}>+</button>
              </span>` : c !== void 0 ? p`<span class="temperature current-temperature">${this.formatTemperature(c, i)}</span>` : m}
        </div>
        ${s ? this.renderClimateRange(e, r, n, l, u) : m}
        <button
          class="thermostat-power ${e.powered ? "active" : ""}"
          type="button"
          aria-pressed=${e.powered}
          aria-label=${`${e.powered ? N(this.hass, this.config, "turn_off") : N(this.hass, this.config, "on")}: ${e.name}`}
          ?disabled=${u || !e.available || !b}
          @click=${(d) => this.toggleEntity(d, e)}
        ><ha-icon icon=${u ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }
  renderCover(e) {
    const t = this.entityBusy(e), i = Me(e.entity), o = e.entity.state, a = e.entity.attributes.assumed_state === !0, r = [
      { service: "open_cover", icon: "mdi:arrow-up" },
      { service: "stop_cover", icon: "mdi:stop" },
      { service: "close_cover", icon: "mdi:arrow-down" }
    ].filter(({ service: n }) => ot(e.entity, n));
    return p`
      <article class="cover-card entity-card ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${e.name}`}>
          ${r.map(({ service: n, icon: s }) => p`
            <button
              class="cover-control"
              type="button"
              ?disabled=${!e.available || t || kt(n, o, i, a)}
              @click=${(c) => this.runEntityService(c, e, n)}
              aria-label=${`${this.coverServiceLabel(n)}: ${e.name}`}
            ><ha-icon icon=${s}></ha-icon></button>
          `)}
        </span>
      </article>
    `;
  }
  renderMedia(e) {
    const t = this.entityBusy(e), i = e.entity.state === "playing", o = de(e, "volume_level"), a = o !== void 0 && V(e.entity, ze.VOLUME_SET), r = V(e.entity, i ? ze.PAUSE : ze.PLAY), n = X(e, !e.powered);
    return p`
      <article class="media-card entity-card full-span ${e.active ? "active" : ""} ${e.available ? "" : "unavailable"}" aria-busy=${t}>
        ${this.renderEntityLead(e)}
        <div class="media-controls">
          ${a ? p`
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, o - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${e.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(o * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.setMediaVolume(s, e, o + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${e.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              ` : m}
          ${r ? p`<button class="control-button ${i ? "active" : ""}" type="button" ?disabled=${t || !e.available} @click=${(s) => this.runEntityService(s, e, i ? "media_pause" : "media_play")} aria-label=${`${this.localText(i ? "השהיה" : "ניגון", i ? "Pause" : "Play")}: ${e.name}`}><ha-icon icon=${i ? "mdi:pause" : "mdi:play"}></ha-icon></button>` : m}
          ${n ? p`<button class="control-button" type="button" ?disabled=${t || !e.available} @click=${(s) => this.toggleEntity(s, e)} aria-label=${`${e.powered ? N(this.hass, this.config, "turn_off") : N(this.hass, this.config, "on")}: ${e.name}`}><ha-icon icon="mdi:power"></ha-icon></button>` : m}
        </div>
      </article>
    `;
  }
  entitySecondary(e) {
    var o, a;
    if (!e.available) return N(this.hass, this.config, "unavailable");
    const t = String(e.entity.state).toLowerCase(), i = t === "on" || t === "off" ? this.binaryStateLabel(t, e) : void 0;
    if (this.isCompactAuxiliary(e)) {
      const r = e.powered ? this.elapsedSince(e.entity.last_changed) : void 0;
      return [i ?? e.entity.state, r].filter(Boolean).join(" · ");
    }
    if (e.domain === "climate") {
      const r = de(e, "current_temperature");
      return [String(e.entity.attributes.hvac_action ?? e.entity.state).replace(/_/g, " "), r !== void 0 ? this.formatTemperature(r, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    if (e.domain === "cover") {
      const r = Me(e.entity);
      return r !== void 0 ? `${e.entity.state} · ${Math.round(r)}%` : e.entity.state;
    }
    if (e.domain === "light") {
      const r = de(e, "brightness");
      return r !== void 0 && e.active ? `${i ?? e.entity.state} · ${Math.round(r / 255 * 100)}%` : i ?? e.entity.state;
    }
    if (e.domain === "media_player")
      return String(e.entity.attributes.media_title ?? e.entity.attributes.source ?? e.entity.state);
    if (e.section === "floor_heating") {
      const r = de(e, "current_temperature");
      return [i ?? e.entity.state, r !== void 0 ? this.formatTemperature(r, this.areaTemperatureUnit(e)) : ""].filter(Boolean).join(" · ");
    }
    return i ?? ((a = (o = this.hass) == null ? void 0 : o.formatEntityState) == null ? void 0 : a.call(o, e.entity)) ?? e.entity.state;
  }
  isCompactAuxiliary(e) {
    return e.domain === "fan" || e.section === "climate" && ["switch", "input_boolean"].includes(e.domain) || e.section === "floor_heating" && ["switch", "input_boolean"].includes(e.domain);
  }
  elapsedSince(e) {
    const t = Date.parse(e);
    if (!Number.isFinite(t)) return;
    const i = Math.max(0, Math.floor((Date.now() - t) / 6e4));
    if (i < 1) return this.localText("פחות מדקה", "less than a minute");
    const o = Math.floor(i / 1440), a = Math.floor(i % 1440 / 60), r = i % 60;
    return o > 0 ? this.localText(`${o} י׳ ${a} ש׳`, `${o}d ${a}h`) : a > 0 ? this.localText(`${a} ש׳ ${r} דק׳`, `${a}h ${r}m`) : this.localText(`${r} דק׳`, `${r}m`);
  }
  entityPresentation(e) {
    var o, a, r, n;
    const t = (o = this.config) == null ? void 0 : o.entity_overrides[e.entityId], i = e.section === "lights_switches";
    return {
      shape: (t == null ? void 0 : t.tile_shape) ?? (i ? (a = this.config) == null ? void 0 : a.light_tile_shape : "rectangle") ?? "rectangle",
      iconPosition: (t == null ? void 0 : t.icon_position) ?? (i ? (r = this.config) == null ? void 0 : r.light_icon_position : "start") ?? "start",
      showState: (t == null ? void 0 : t.show_state) ?? (i ? (n = this.config) == null ? void 0 : n.light_show_state : !0) ?? !0
    };
  }
  binaryStateLabel(e, t) {
    var a, r, n;
    const i = ((r = (a = this.config) == null ? void 0 : a.entity_overrides[t.entityId]) == null ? void 0 : r.state_language) ?? ((n = this.config) == null ? void 0 : n.entity_state_language) ?? "auto";
    return (i === "auto" ? this.config && Z(this.hass, this.config) === "he" ? "he" : "en" : i) === "he" ? e === "on" ? "דלוק" : "כבוי" : e === "on" ? "On" : "Off";
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
    return this.config && Z(this.hass, this.config) === "he" ? e : t;
  }
  areaTemperatureUnit(e) {
    var t, i, o;
    return String(e.entity.attributes.temperature_unit ?? ((o = (i = (t = this.hass) == null ? void 0 : t.config) == null ? void 0 : i.unit_system) == null ? void 0 : o.temperature) ?? "°C");
  }
  formatTemperature(e, t = "°C") {
    const i = this.config && Z(this.hass, this.config) === "he" ? "he-IL" : void 0;
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: 1 }).format(e)} ${t}`;
  }
  renderEmpty(e, t) {
    return p`<div class="empty"><ha-icon icon=${t}></ha-icon><span>${e}</span></div>`;
  }
  isExpanded(e) {
    var i, o, a;
    if (this.areaOpenMode(e) === "popup") return !1;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((o = this.config) == null ? void 0 : o.area_overrides[e.name]);
    return this.expanded[e.id] ?? (t == null ? void 0 : t.default_expanded) ?? ((a = this.config) == null ? void 0 : a.default_expanded) ?? !1;
  }
  isPopupSubareaExpanded(e) {
    var o, a;
    const t = `popup-subarea:${e.id}`, i = ((o = this.config) == null ? void 0 : o.area_overrides[e.id]) ?? ((a = this.config) == null ? void 0 : a.area_overrides[e.name]);
    return this.expanded[t] ?? (i == null ? void 0 : i.default_expanded) ?? !0;
  }
  togglePopupSubarea(e, t) {
    var o;
    e.stopPropagation();
    const i = `popup-subarea:${t.id}`;
    this.expanded = { ...this.expanded, [i]: !this.isPopupSubareaExpanded(t) }, (o = this.config) != null && o.remember_expanded_state && this.writeExpanded();
  }
  areaOpenMode(e) {
    var i, o, a;
    const t = ((i = this.config) == null ? void 0 : i.area_overrides[e.id]) ?? ((o = this.config) == null ? void 0 : o.area_overrides[e.name]);
    return (t == null ? void 0 : t.open_mode) ?? ((a = this.config) == null ? void 0 : a.area_open_mode) ?? "expander";
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
      var i, o;
      if (this.holdEntityId === t.entityId) {
        this.holdTimer = void 0, this.suppressClickEntityId = t.entityId, this.suppressClickUntil = Date.now() + 1500, (i = this.holdTarget) == null || i.classList.remove("holding"), this.showMoreInfo(t);
        try {
          (o = navigator.vibrate) == null || o.call(navigator, 18);
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
      if (!t.available || this.entityBusy(t) || !X(t, !t.powered)) {
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
    const i = Je(t, !1);
    if (!(!i.length || i.some((o) => this.pendingEntities.has(o.entityId)))) {
      this.pendingFloorRooms = /* @__PURE__ */ new Set([...this.pendingFloorRooms, t.id]), this.lockPendingEntities(i);
      try {
        await di(this.hass, t, !1);
      } catch (o) {
        this.reportError(o);
      } finally {
        const o = new Set(this.pendingFloorRooms);
        o.delete(t.id), this.pendingFloorRooms = o, this.unlockPendingEntities(i);
      }
    }
  }
  async handleFloorAllOff(e, t) {
    if (e.stopPropagation(), !this.hass || this.pendingFloor || this.pendingFloorRooms.size) return;
    const i = t.flatMap((o) => Je(o, !1));
    if (!(!i.length || i.some((o) => this.pendingEntities.has(o.entityId)))) {
      this.pendingFloor = !0, this.lockPendingEntities(i);
      try {
        const o = await Promise.allSettled(t.map((r) => di(this.hass, r, !1))), a = o.filter((r) => r.status === "rejected");
        if (a.length) throw new Error(`${a.length} of ${o.length} room actions failed.`);
      } catch (o) {
        this.reportError(o);
      } finally {
        this.pendingFloor = !1, this.unlockPendingEntities(i);
      }
    }
  }
  openQuickActionPopup(e, t, i) {
    e.stopPropagation(), this.resetFloorPopup(), this.resetAreaPopup(), this.quickPopupTrigger = e.currentTarget, this.quickPopupMoreInfo = void 0, this.restoreQuickPopupFocus = !0, this.quickPopup = { areaId: t.id, action: i }, this.updateComplete.then(() => {
      const o = this.renderRoot.querySelector(".area-quick-action-dialog");
      !o || o.open || !o.isConnected || (typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", ""));
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
  handleCompactSubgroupToggle(e, t, i) {
    const o = !pe(t, i).some((a) => a.powered);
    this.handleQuickActionGroupAction(e, t, i, o);
  }
  async handleQuickActionGroupAction(e, t, i, o) {
    if (e.stopPropagation(), !this.hass) return;
    const a = `${t.id}:${i}:${o ? "on" : "off"}`, r = pe(t, i), n = Ke(t, i, o);
    if (!(this.quickActionPending(t.id, i) || r.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingActions = /* @__PURE__ */ new Set([...this.pendingActions, a]), this.lockPendingEntities(n);
      try {
        await sa(this.hass, t, i, o);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingActions);
        s.delete(a), this.pendingActions = s, this.unlockPendingEntities(n);
      }
    }
  }
  handleQuickPopupEntityAction(e, t, i) {
    e.stopPropagation();
    const o = St(i, t, !t.powered);
    !this.hass || !t.available || this.entityBusy(t) || this.quickPopup && this.quickActionPending(this.quickPopup.areaId, i) || !o || this.performEntityCall(t, () => K(this.hass, t.entityId, o.service, o.data));
  }
  async handleSectionAction(e, t, i, o) {
    if (e.stopPropagation(), !this.hass) return;
    const a = `${i}:${t.id}:${o ? "on" : "off"}`, r = `${i}:${t.id}:${o ? "off" : "on"}`, n = bt(t, o);
    if (!(this.pendingSections.has(a) || this.pendingSections.has(r) || t.entities.some((s) => this.pendingEntities.has(s.entityId)) || n.length === 0)) {
      this.pendingSections = /* @__PURE__ */ new Set([...this.pendingSections, a]), this.lockPendingEntities(n);
      try {
        await la(this.hass, t, o);
      } catch (s) {
        this.reportError(s);
      } finally {
        const s = new Set(this.pendingSections);
        s.delete(a), this.pendingSections = s, this.unlockPendingEntities(n);
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
  displayedClimateTargets(e) {
    const t = si(e), i = this.optimisticClimateTargets[e.entityId];
    return i ? i.expiresAt <= Date.now() || i.baseline !== ci(t) ? (queueMicrotask(() => {
      this.optimisticClimateTargets[e.entityId] === i && this.clearClimateTarget(e.entityId);
    }), t) : {
      temperature: i.temperature,
      low: i.low,
      high: i.high
    } : t;
  }
  setOptimisticClimateTargets(e, t) {
    const i = Date.now() + 8e3, o = this.climateTargetTimers.get(e.entityId);
    o !== void 0 && window.clearTimeout(o), this.optimisticClimateTargets = {
      ...this.optimisticClimateTargets,
      [e.entityId]: {
        ...t,
        baseline: ci(si(e)),
        expiresAt: i
      }
    };
    const a = window.setTimeout(() => {
      const r = this.optimisticClimateTargets[e.entityId];
      (r == null ? void 0 : r.expiresAt) === i && this.clearClimateTarget(e.entityId);
    }, 8050);
    this.climateTargetTimers.set(e.entityId, a);
  }
  clearClimateTarget(e) {
    const t = this.climateTargetTimers.get(e);
    if (t !== void 0 && window.clearTimeout(t), this.climateTargetTimers.delete(e), !(e in this.optimisticClimateTargets)) return;
    const i = { ...this.optimisticClimateTargets };
    delete i[e], this.optimisticClimateTargets = i;
  }
  resetClimateTargets() {
    for (const e of this.climateTargetTimers.values()) window.clearTimeout(e);
    this.climateTargetTimers.clear(), this.optimisticClimateTargets = {};
  }
  toggleEntity(e, t) {
    e.stopPropagation();
    const i = X(t, !t.powered);
    i && (t.domain === "climate" && this.clearClimateTarget(t.entityId), this.performEntityCall(t, () => K(this.hass, t.entityId, i.service, i.data)));
  }
  runEntityService(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => K(this.hass, t.entityId, i));
  }
  setClimateTemperature(e, t) {
    const i = this.displayedClimateTargets(e), o = Ge(e, this.areaTemperatureUnit(e)), a = mt(e, t, o);
    if (i.temperature === a) return;
    const r = { ...i, temperature: a };
    this.setOptimisticClimateTargets(e, r), this.performEntityCall(e, () => K(this.hass, e.entityId, "set_temperature", { temperature: a })).then((n) => {
      n || this.clearClimateTarget(e.entityId);
    });
  }
  setClimateRange(e, t, i, o) {
    const a = this.displayedClimateTargets(e), r = Ge(e, this.areaTemperatureUnit(e));
    let n = mt(e, t, r), s = mt(e, i, r);
    if (o === "low" && n > s && (n = s), o === "high" && s < n && (s = n), a.low === n && a.high === s) return;
    const c = { ...a, low: n, high: s };
    this.setOptimisticClimateTargets(e, c), this.performEntityCall(e, () => K(this.hass, e.entityId, "set_temperature", {
      target_temp_low: n,
      target_temp_high: s
    })).then((l) => {
      l || this.clearClimateTarget(e.entityId);
    });
  }
  menuValue(e) {
    var o;
    const t = e.detail, i = (t == null ? void 0 : t.value) ?? ((o = t == null ? void 0 : t.item) == null ? void 0 : o.value);
    return typeof i == "string" && i ? i : void 0;
  }
  setClimateMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === e.entity.state || (this.clearClimateTarget(e.entityId), this.performEntityCall(e, () => K(this.hass, e.entityId, "set_hvac_mode", { hvac_mode: i })));
  }
  setFanMode(e, t) {
    t.stopPropagation();
    const i = this.menuValue(t);
    !i || i === String(e.entity.attributes.fan_mode ?? "") || this.performEntityCall(e, () => K(this.hass, e.entityId, "set_fan_mode", { fan_mode: i }));
  }
  setLightBrightness(e, t) {
    var a;
    t.stopPropagation();
    const i = (a = t.detail) == null ? void 0 : a.value;
    if (typeof i != "number" || !Number.isFinite(i)) return;
    const o = Math.min(100, Math.max(0, Math.round(i)));
    o !== li(e) && this.performEntityCall(e, () => o === 0 ? K(this.hass, e.entityId, "turn_off") : K(this.hass, e.entityId, "turn_on", { brightness_pct: o }));
  }
  setMediaVolume(e, t, i) {
    e.stopPropagation(), this.performEntityCall(t, () => K(this.hass, t.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, i)) }));
  }
  async performEntityCall(e, t) {
    if (!this.hass || this.entityBusy(e)) return !1;
    this.pendingEntities = /* @__PURE__ */ new Set([...this.pendingEntities, e.entityId]);
    try {
      return await t(), !0;
    } catch (i) {
      return this.reportError(i), !1;
    } finally {
      const i = new Set(this.pendingEntities);
      i.delete(e.entityId), this.pendingEntities = i;
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
    return `${ni}:${this.storageId}:expanded`;
  }
  floorStorageKey() {
    return `${ni}:${this.storageId}:floor-expanded`;
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
O.styles = ja;
M([
  Le({ attribute: !1 })
], O.prototype, "hass", 2);
M([
  C()
], O.prototype, "config", 2);
M([
  C()
], O.prototype, "expanded", 2);
M([
  C()
], O.prototype, "floorExpanded", 2);
M([
  C()
], O.prototype, "pendingActions", 2);
M([
  C()
], O.prototype, "pendingSections", 2);
M([
  C()
], O.prototype, "pendingEntities", 2);
M([
  C()
], O.prototype, "quickPopup", 2);
M([
  C()
], O.prototype, "areaPopupId", 2);
M([
  C()
], O.prototype, "floorPopupOpen", 2);
M([
  C()
], O.prototype, "pendingFloor", 2);
M([
  C()
], O.prototype, "pendingFloorRooms", 2);
M([
  C()
], O.prototype, "optimisticClimateTargets", 2);
M([
  C()
], O.prototype, "error", 2);
O = M([
  nt(yt)
], O);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === yt) || window.customCards.push({
  type: yt,
  name: "Area Bubble Overview Card",
  description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card"
});

"use strict";
(self.webpackChunkkrubin = self.webpackChunkkrubin || []).push([
  [179],
  {
    654: () => {
      function X(e) {
        return "function" == typeof e;
      }
      function $r(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const ri = $r(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          },
      );
      function Vr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class nt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (X(r))
              try {
                r();
              } catch (i) {
                t = i instanceof ri ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  pd(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof ri ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new ri(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) pd(t);
            else {
              if (t instanceof nt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t,
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && Vr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && Vr(n, t), t instanceof nt && t._removeParent(this);
        }
      }
      nt.EMPTY = (() => {
        const e = new nt();
        return (e.closed = !0), e;
      })();
      const fd = nt.EMPTY;
      function hd(e) {
        return (
          e instanceof nt ||
          (e && "closed" in e && X(e.remove) && X(e.add) && X(e.unsubscribe))
        );
      }
      function pd(e) {
        X(e) ? e() : e.unsubscribe();
      }
      const yn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        oi = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = oi;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = oi;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function gd(e) {
        oi.setTimeout(() => {
          const { onUnhandledError: t } = yn;
          if (!t) throw e;
          t(e);
        });
      }
      function md() {}
      const bw = ha("C", void 0, void 0);
      function ha(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let vn = null;
      function ii(e) {
        if (yn.useDeprecatedSynchronousErrorHandling) {
          const t = !vn;
          if ((t && (vn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = vn;
            if (((vn = null), n)) throw r;
          }
        } else e();
      }
      class pa extends nt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), hd(t) && t.add(this))
              : (this.destination = Ow);
        }
        static create(t, n, r) {
          return new Hr(t, n, r);
        }
        next(t) {
          this.isStopped
            ? ma(
                (function Tw(e) {
                  return ha("N", e, void 0);
                })(t),
                this,
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? ma(
                (function Mw(e) {
                  return ha("E", void 0, e);
                })(t),
                this,
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? ma(bw, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const Nw = Function.prototype.bind;
      function ga(e, t) {
        return Nw.call(e, t);
      }
      class Rw {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              si(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              si(r);
            }
          else si(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              si(n);
            }
        }
      }
      class Hr extends pa {
        constructor(t, n, r) {
          let o;
          if ((super(), X(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && yn.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && ga(t.next, i),
                  error: t.error && ga(t.error, i),
                  complete: t.complete && ga(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new Rw(o);
        }
      }
      function si(e) {
        yn.useDeprecatedSynchronousErrorHandling
          ? (function Aw(e) {
              yn.useDeprecatedSynchronousErrorHandling &&
                vn &&
                ((vn.errorThrown = !0), (vn.error = e));
            })(e)
          : gd(e);
      }
      function ma(e, t) {
        const { onStoppedNotification: n } = yn;
        n && oi.setTimeout(() => n(e, t));
      }
      const Ow = {
          closed: !0,
          next: md,
          error: function xw(e) {
            throw e;
          },
          complete: md,
        },
        ya =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function nn(e) {
        return e;
      }
      function yd(e) {
        return 0 === e.length
          ? nn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, o) => o(r), n);
            };
      }
      let ge = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function Lw(e) {
              return (
                (e && e instanceof pa) ||
                ((function Fw(e) {
                  return e && X(e.next) && X(e.error) && X(e.complete);
                })(e) &&
                  hd(e))
              );
            })(n)
              ? n
              : new Hr(n, r, o);
            return (
              ii(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i),
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = vd(r))((o, i) => {
              const s = new Hr({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ya]() {
            return this;
          }
          pipe(...n) {
            return yd(n)(this);
          }
          toPromise(n) {
            return new (n = vd(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i),
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function vd(e) {
        var t;
        return null !== (t = e ?? yn.Promise) && void 0 !== t ? t : Promise;
      }
      const kw = $r(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          },
      );
      let jt = (() => {
        class e extends ge {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Dd(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new kw();
          }
          next(n) {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ii(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? fd
              : ((this.currentObservers = null),
                i.push(n),
                new nt(() => {
                  (this.currentObservers = null), Vr(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ge();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Dd(t, n)), e;
      })();
      class Dd extends jt {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : fd;
        }
      }
      class rt extends jt {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function wd(e) {
        return X(e?.lift);
      }
      function Ce(e) {
        return (t) => {
          if (wd(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Ee(e, t, n, r, o) {
        return new jw(e, t, n, r, o);
      }
      class jw extends pa {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function ee(e, t) {
        return Ce((n, r) => {
          let o = 0;
          n.subscribe(
            Ee(r, (i) => {
              r.next(e.call(t, i, o++));
            }),
          );
        });
      }
      function rn(e) {
        return this instanceof rn ? ((this.v = e), this) : new rn(e);
      }
      function Id(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Ca(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const Sd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function bd(e) {
        return X(e?.then);
      }
      function Md(e) {
        return X(e[ya]);
      }
      function Td(e) {
        return Symbol.asyncIterator && X(e?.[Symbol.asyncIterator]);
      }
      function Ad(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
        );
      }
      const Nd = (function sC() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Rd(e) {
        return X(e?.[Nd]);
      }
      function xd(e) {
        return (function _d(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(e, t || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function u(f) {
                f.value instanceof rn
                  ? Promise.resolve(f.value.v).then(l, c)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function l(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield rn(n.read());
              if (o) return yield rn(void 0);
              yield yield rn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Od(e) {
        return X(e?.getReader);
      }
      function dt(e) {
        if (e instanceof ge) return e;
        if (null != e) {
          if (Md(e))
            return (function aC(e) {
              return new ge((t) => {
                const n = e[ya]();
                if (X(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable",
                );
              });
            })(e);
          if (Sd(e))
            return (function uC(e) {
              return new ge((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (bd(e))
            return (function lC(e) {
              return new ge((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n),
                ).then(null, gd);
              });
            })(e);
          if (Td(e)) return Pd(e);
          if (Rd(e))
            return (function cC(e) {
              return new ge((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Od(e))
            return (function dC(e) {
              return Pd(xd(e));
            })(e);
        }
        throw Ad(e);
      }
      function Pd(e) {
        return new ge((t) => {
          (function fC(e, t) {
            var n, r, o, i;
            return (function Cd(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Id(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function $t(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Ie(e, t, n = 1 / 0) {
        return X(t)
          ? Ie((r, o) => ee((i, s) => t(r, i, o, s))(dt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Ce((r, o) =>
              (function hC(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let v = !1;
                    dt(n(g, c++)).subscribe(
                      Ee(
                        t,
                        (D) => {
                          o?.(D), i ? h(D) : t.next(D);
                        },
                        () => {
                          v = !0;
                        },
                        void 0,
                        () => {
                          if (v)
                            try {
                              for (l--; u.length && l < r; ) {
                                const D = u.shift();
                                s ? $t(t, s, () => p(D)) : p(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        },
                      ),
                    );
                  };
                return (
                  e.subscribe(
                    Ee(t, h, () => {
                      (d = !0), f();
                    }),
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n),
            ));
      }
      function Vn(e = 1 / 0) {
        return Ie(nn, e);
      }
      const Et = new ge((e) => e.complete());
      function Ea(e) {
        return e[e.length - 1];
      }
      function Br(e) {
        return (function gC(e) {
          return e && X(e.schedule);
        })(Ea(e))
          ? e.pop()
          : void 0;
      }
      function Fd(e, t = 0) {
        return Ce((n, r) => {
          n.subscribe(
            Ee(
              r,
              (o) => $t(r, e, () => r.next(o), t),
              () => $t(r, e, () => r.complete(), t),
              (o) => $t(r, e, () => r.error(o), t),
            ),
          );
        });
      }
      function Ld(e, t = 0) {
        return Ce((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function kd(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ge((n) => {
          $t(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            $t(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0,
            );
          });
        });
      }
      function Se(e, t) {
        return t
          ? (function _C(e, t) {
              if (null != e) {
                if (Md(e))
                  return (function vC(e, t) {
                    return dt(e).pipe(Ld(t), Fd(t));
                  })(e, t);
                if (Sd(e))
                  return (function wC(e, t) {
                    return new ge((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (bd(e))
                  return (function DC(e, t) {
                    return dt(e).pipe(Ld(t), Fd(t));
                  })(e, t);
                if (Td(e)) return kd(e, t);
                if (Rd(e))
                  return (function CC(e, t) {
                    return new ge((n) => {
                      let r;
                      return (
                        $t(n, t, () => {
                          (r = e[Nd]()),
                            $t(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0,
                            );
                        }),
                        () => X(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Od(e))
                  return (function EC(e, t) {
                    return kd(xd(e), t);
                  })(e, t);
              }
              throw Ad(e);
            })(e, t)
          : dt(e);
      }
      function O(...e) {
        return Se(e, Br(e));
      }
      function jd(e = {}) {
        const {
          connector: t = () => new jt(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = e;
        return (i) => {
          let s,
            a,
            u,
            l = 0,
            c = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = u = void 0), (c = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Ce((g, v) => {
            l++, !d && !c && f();
            const D = (u = u ?? t());
            v.add(() => {
              l--, 0 === l && !d && !c && (a = _a(p, o));
            }),
              D.subscribe(v),
              !s &&
                l > 0 &&
                ((s = new Hr({
                  next: (m) => D.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = _a(h, n, m)), D.error(m);
                  },
                  complete: () => {
                    (c = !0), f(), (a = _a(h, r)), D.complete();
                  },
                })),
                dt(g).subscribe(s));
          })(i);
        };
      }
      function _a(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new Hr({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return dt(t(...n)).subscribe(r);
      }
      function _t(e, t) {
        return Ce((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Ee(
              r,
              (u) => {
                o?.unsubscribe();
                let l = 0;
                const c = i++;
                dt(e(u, c)).subscribe(
                  (o = Ee(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (o = null), a();
                    },
                  )),
                );
              },
              () => {
                (s = !0), a();
              },
            ),
          );
        });
      }
      function bC(e, t) {
        return e === t;
      }
      function Y(e) {
        for (let t in e) if (e[t] === Y) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function me(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(me).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Ia(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const MC = Y({ __forward_ref__: Y });
      function Sa(e) {
        return (
          (e.__forward_ref__ = Sa),
          (e.toString = function () {
            return me(this());
          }),
          e
        );
      }
      function P(e) {
        return ba(e) ? e() : e;
      }
      function ba(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(MC) &&
          e.__forward_ref__ === Sa
        );
      }
      function Ma(e) {
        return e && !!e.ɵproviders;
      }
      class w extends Error {
        constructor(t, n) {
          super(
            (function ui(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n),
          ),
            (this.code = t);
        }
      }
      function Q(e) {
        return "function" == typeof e
          ? e.name || e.toString()
          : "object" == typeof e && null != e && "function" == typeof e.type
          ? e.type.name || e.type.toString()
          : (function F(e) {
              return "string" == typeof e ? e : null == e ? "" : String(e);
            })(e);
      }
      function li(e, t) {
        throw new w(-201, !1);
      }
      function ot(e, t) {
        null == e &&
          (function q(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`),
            );
          })(t, e, null, "!=");
      }
      function R(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function on(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ci(e) {
        return Vd(e, di) || Vd(e, Bd);
      }
      function Vd(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Hd(e) {
        return e && (e.hasOwnProperty(Ta) || e.hasOwnProperty(FC))
          ? e[Ta]
          : null;
      }
      const di = Y({ ɵprov: Y }),
        Ta = Y({ ɵinj: Y }),
        Bd = Y({ ngInjectableDef: Y }),
        FC = Y({ ngInjectorDef: Y });
      var b = (() => (
        ((b = b || {})[(b.Default = 0)] = "Default"),
        (b[(b.Host = 1)] = "Host"),
        (b[(b.Self = 2)] = "Self"),
        (b[(b.SkipSelf = 4)] = "SkipSelf"),
        (b[(b.Optional = 8)] = "Optional"),
        b
      ))();
      let Aa;
      function Ve(e) {
        const t = Aa;
        return (Aa = e), t;
      }
      function zd(e, t, n) {
        const r = ci(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & b.Optional
          ? null
          : void 0 !== t
          ? t
          : void li(me(e));
      }
      const J = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        Ur = {},
        Na = "__NG_DI_FLAG__",
        fi = "ngTempTokenPath",
        kC = /\n/gm,
        Gd = "__source";
      let Hn;
      function sn(e) {
        const t = Hn;
        return (Hn = e), t;
      }
      function VC(e, t = b.Default) {
        if (void 0 === Hn) throw new w(-203, !1);
        return null === Hn
          ? zd(e, void 0, t)
          : Hn.get(e, t & b.Optional ? null : void 0, t);
      }
      function T(e, t = b.Default) {
        return (
          (function Ud() {
            return Aa;
          })() || VC
        )(P(e), t);
      }
      function _(e, t = b.Default) {
        return T(e, hi(t));
      }
      function hi(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Ra(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = P(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new w(900, !1);
            let o,
              i = b.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = HC(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(T(o, i));
          } else t.push(T(r));
        }
        return t;
      }
      function zr(e, t) {
        return (e[Na] = t), (e.prototype[Na] = t), e;
      }
      function HC(e) {
        return e[Na];
      }
      function Vt(e) {
        return { toString: e }.toString();
      }
      var It = (() => (
          ((It = It || {})[(It.OnPush = 0)] = "OnPush"),
          (It[(It.Default = 1)] = "Default"),
          It
        ))(),
        Qe = (() => {
          return (
            ((e = Qe || (Qe = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Qe
          );
          var e;
        })();
      const St = {},
        W = [],
        pi = Y({ ɵcmp: Y }),
        xa = Y({ ɵdir: Y }),
        Oa = Y({ ɵpipe: Y }),
        qd = Y({ ɵmod: Y }),
        Ht = Y({ ɵfac: Y }),
        Gr = Y({ __NG_ELEMENT_ID__: Y }),
        Zd = Y({ __NG_ENV_ID__: Y });
      function Qd(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      function Pa(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Kd(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Yd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Kd(e) {
        return 64 === e.charCodeAt(0);
      }
      function Wr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Xd(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Xd(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      const Jd = "ng-template";
      function zC(e, t, n) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (n && "class" === i && -1 !== Qd(s.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function ef(e) {
        return 4 === e.type && e.value !== Jd;
      }
      function GC(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Jd);
      }
      function WC(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function QC(e) {
            for (let t = 0; t < e.length; t++) if (Yd(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !GC(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (ft(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!zC(e.attrs, l, n)) {
                    if (ft(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = qC(8 & r ? "class" : u, o, ef(e), n);
                if (-1 === d) {
                  if (ft(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Qd(h, l, 0)) || (2 & r && l !== f)) {
                    if (ft(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !ft(r) && !ft(u)) return !1;
            if (s && ft(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return ft(r) || s;
      }
      function ft(e) {
        return 0 == (1 & e);
      }
      function qC(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function YC(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function tf(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (WC(e, t[r], n)) return !0;
        return !1;
      }
      function nf(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function XC(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !ft(s) && ((t += nf(i, o)), (o = "")),
              (r = s),
              (i = i || !ft(r));
          n++;
        }
        return "" !== o && (t += nf(i, o)), t;
      }
      function Fa(e) {
        return Vt(() => {
          const t = sf(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === It.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || Qe.Emulated,
              styles: e.styles || W,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          af(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = gi(r, !1)),
            (n.pipeDefs = gi(r, !0)),
            (n.id = (function sE(e) {
              let t = 0;
              const n = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(n)),
            n
          );
        });
      }
      function nE(e) {
        return Z(e) || Me(e);
      }
      function rE(e) {
        return null !== e;
      }
      function wn(e) {
        return Vt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || W,
          declarations: e.declarations || W,
          imports: e.imports || W,
          exports: e.exports || W,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function rf(e, t) {
        if (null == e) return St;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      function Oe(e) {
        return Vt(() => {
          const t = sf(e);
          return af(t), t;
        });
      }
      function Z(e) {
        return e[pi] || null;
      }
      function Me(e) {
        return e[xa] || null;
      }
      function Be(e) {
        return e[Oa] || null;
      }
      function Ye(e, t) {
        const n = e[qd] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${me(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function sf(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          inputTransforms: null,
          inputConfig: e.inputs || St,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || W,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: rf(e.inputs, t),
          outputs: rf(e.outputs),
        };
      }
      function af(e) {
        e.features?.forEach((t) => t(e));
      }
      function gi(e, t) {
        if (!e) return null;
        const n = t ? Be : nE;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(rE);
      }
      const ye = 0,
        E = 1,
        k = 2,
        re = 3,
        ht = 4,
        qr = 5,
        Te = 6,
        Un = 7,
        ue = 8,
        zn = 9,
        Cn = 10,
        j = 11,
        Zr = 12,
        uf = 13,
        Gn = 14,
        le = 15,
        Qr = 16,
        Wn = 17,
        bt = 18,
        Yr = 19,
        lf = 20,
        an = 21,
        Bt = 22,
        mi = 23,
        yi = 24,
        U = 25,
        La = 1,
        cf = 2,
        Mt = 7,
        qn = 9,
        Ae = 11;
      function Ke(e) {
        return Array.isArray(e) && "object" == typeof e[La];
      }
      function Ue(e) {
        return Array.isArray(e) && !0 === e[La];
      }
      function ka(e) {
        return 0 != (4 & e.flags);
      }
      function En(e) {
        return e.componentOffset > -1;
      }
      function pt(e) {
        return !!e.template;
      }
      function ja(e) {
        return 0 != (512 & e[k]);
      }
      function _n(e, t) {
        return e.hasOwnProperty(Ht) ? e[Ht] : null;
      }
      let fE =
          J.WeakRef ??
          class dE {
            constructor(t) {
              this.ref = t;
            }
            deref() {
              return this.ref;
            }
          },
        pE = 0,
        Tt = null,
        wi = !1;
      function _e(e) {
        const t = Tt;
        return (Tt = e), t;
      }
      class gf {
        constructor() {
          (this.id = pE++),
            (this.ref = (function hE(e) {
              return new fE(e);
            })(this)),
            (this.producers = new Map()),
            (this.consumers = new Map()),
            (this.trackingVersion = 0),
            (this.valueVersion = 0);
        }
        consumerPollProducersForChange() {
          for (const [t, n] of this.producers) {
            const r = n.producerNode.deref();
            if (null != r && n.atTrackingVersion === this.trackingVersion) {
              if (r.producerPollStatus(n.seenValueVersion)) return !0;
            } else this.producers.delete(t), r?.consumers.delete(this.id);
          }
          return !1;
        }
        producerMayHaveChanged() {
          const t = wi;
          wi = !0;
          try {
            for (const [n, r] of this.consumers) {
              const o = r.consumerNode.deref();
              null != o && o.trackingVersion === r.atTrackingVersion
                ? o.onConsumerDependencyMayHaveChanged()
                : (this.consumers.delete(n), o?.producers.delete(this.id));
            }
          } finally {
            wi = t;
          }
        }
        producerAccessed() {
          if (wi) throw new Error("");
          if (null === Tt) return;
          let t = Tt.producers.get(this.id);
          void 0 === t
            ? ((t = {
                consumerNode: Tt.ref,
                producerNode: this.ref,
                seenValueVersion: this.valueVersion,
                atTrackingVersion: Tt.trackingVersion,
              }),
              Tt.producers.set(this.id, t),
              this.consumers.set(Tt.id, t))
            : ((t.seenValueVersion = this.valueVersion),
              (t.atTrackingVersion = Tt.trackingVersion));
        }
        get hasProducers() {
          return this.producers.size > 0;
        }
        get producerUpdatesAllowed() {
          return !1 !== Tt?.consumerAllowSignalWrites;
        }
        producerPollStatus(t) {
          return (
            this.valueVersion !== t ||
            (this.onProducerUpdateValueVersion(), this.valueVersion !== t)
          );
        }
      }
      let mf = null;
      const vf = () => {};
      class vE extends gf {
        constructor(t, n, r) {
          super(),
            (this.watch = t),
            (this.schedule = n),
            (this.dirty = !1),
            (this.cleanupFn = vf),
            (this.registerOnCleanup = (o) => {
              this.cleanupFn = o;
            }),
            (this.consumerAllowSignalWrites = r);
        }
        notify() {
          this.dirty || this.schedule(this), (this.dirty = !0);
        }
        onConsumerDependencyMayHaveChanged() {
          this.notify();
        }
        onProducerUpdateValueVersion() {}
        run() {
          if (
            ((this.dirty = !1),
            0 !== this.trackingVersion &&
              !this.consumerPollProducersForChange())
          )
            return;
          const t = _e(this);
          this.trackingVersion++;
          try {
            this.cleanupFn(),
              (this.cleanupFn = vf),
              this.watch(this.registerOnCleanup);
          } finally {
            _e(t);
          }
        }
        cleanup() {
          this.cleanupFn();
        }
      }
      class DE {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function In() {
        return Df;
      }
      function Df(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = CE), wE;
      }
      function wE() {
        const e = Cf(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === St) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function CE(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            Cf(e) ||
            (function EE(e, t) {
              return (e[wf] = t);
            })(e, { previous: St, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new DE(u && u.currentValue, t, a === St)), (e[r] = t);
      }
      In.ngInherit = !0;
      const wf = "__ngSimpleChanges__";
      function Cf(e) {
        return e[wf] || null;
      }
      const At = function (e, t, n) {};
      function ne(e) {
        for (; Array.isArray(e); ) e = e[ye];
        return e;
      }
      function ze(e, t) {
        return ne(t[e.index]);
      }
      function Xe(e, t) {
        const n = t[e];
        return Ke(n) ? n : n[ye];
      }
      function un(e, t) {
        return null == t ? null : e[t];
      }
      function Sf(e) {
        e[Wn] = 0;
      }
      function AE(e) {
        1024 & e[k] || ((e[k] |= 1024), Mf(e, 1));
      }
      function bf(e) {
        1024 & e[k] && ((e[k] &= -1025), Mf(e, -1));
      }
      function Mf(e, t) {
        let n = e[re];
        if (null === n) return;
        n[qr] += t;
        let r = n;
        for (
          n = n[re];
          null !== n && ((1 === t && 1 === r[qr]) || (-1 === t && 0 === r[qr]));

        )
          (n[qr] += t), (r = n), (n = n[re]);
      }
      const x = {
        lFrame: jf(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Nf() {
        return x.bindingsEnabled;
      }
      function y() {
        return x.lFrame.lView;
      }
      function G() {
        return x.lFrame.tView;
      }
      function be() {
        let e = Rf();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Rf() {
        return x.lFrame.currentTNode;
      }
      function Nt(e, t) {
        const n = x.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function za() {
        return x.lFrame.isParent;
      }
      function UE(e, t) {
        const n = x.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Wa(t);
      }
      function Wa(e) {
        x.lFrame.currentDirectiveIndex = e;
      }
      function Za(e) {
        x.lFrame.currentQueryIndex = e;
      }
      function GE(e) {
        const t = e[E];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[Te] : null;
      }
      function Lf(e, t, n) {
        if (n & b.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & b.Host ||
              ((o = GE(i)), null === o || ((i = i[Gn]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (x.lFrame = kf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Qa(e) {
        const t = kf(),
          n = e[E];
        (x.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function kf() {
        const e = x.lFrame,
          t = null === e ? null : e.child;
        return null === t ? jf(e) : t;
      }
      function jf(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function $f() {
        const e = x.lFrame;
        return (
          (x.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Vf = $f;
      function Ya() {
        const e = $f();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Sn(e) {
        x.lFrame.selectedIndex = e;
      }
      let Bf = !0;
      function Ii() {
        return Bf;
      }
      function ln(e) {
        Bf = e;
      }
      function Si(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks ??= []).push(-n, s),
            a &&
              ((e.contentHooks ??= []).push(n, a),
              (e.contentCheckHooks ??= []).push(n, a)),
            u && (e.viewHooks ??= []).push(-n, u),
            l &&
              ((e.viewHooks ??= []).push(n, l),
              (e.viewCheckHooks ??= []).push(n, l)),
            null != c && (e.destroyHooks ??= []).push(n, c);
        }
      }
      function bi(e, t, n) {
        Uf(e, t, 3, n);
      }
      function Mi(e, t, n, r) {
        (3 & e[k]) === n && Uf(e, t, n, r);
      }
      function Ka(e, t) {
        let n = e[k];
        (3 & n) === t && ((n &= 8191), (n += 1), (e[k] = n));
      }
      function Uf(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[Wn] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[Wn] += 65536),
              (a < i || -1 == i) &&
                (JE(e, n, t, u), (e[Wn] = (4294901760 & e[Wn]) + u + 2)),
              u++;
      }
      function zf(e, t) {
        At(4, e, t);
        const n = _e(null);
        try {
          t.call(e);
        } finally {
          _e(n), At(5, e, t);
        }
      }
      function JE(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        o
          ? e[k] >> 13 < e[Wn] >> 16 &&
            (3 & e[k]) === t &&
            ((e[k] += 8192), zf(a, i))
          : zf(a, i);
      }
      const Kn = -1;
      class Jr {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Gf(e) {
        return e !== Kn;
      }
      function Ti(e) {
        return 32767 & e;
      }
      function Ai(e, t) {
        let n = (function r_(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[Gn]), n--;
        return r;
      }
      let Ja = !0;
      function Ni(e) {
        const t = Ja;
        return (Ja = e), t;
      }
      const Wf = 255,
        qf = 5;
      let o_ = 0;
      const Rt = {};
      function Ri(e, t) {
        const n = Zf(e, t);
        if (-1 !== n) return n;
        const r = t[E];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          eu(r.data, e),
          eu(t, null),
          eu(r.blueprint, null));
        const o = tu(e, t),
          i = e.injectorIndex;
        if (Gf(o)) {
          const s = Ti(o),
            a = Ai(o, t),
            u = a[E].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function eu(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Zf(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function tu(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = nh(o)), null === r)) return Kn;
          if ((n++, (o = o[Gn]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Kn;
      }
      function nu(e, t, n) {
        !(function i_(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Gr) && (r = n[Gr]),
            null == r && (r = n[Gr] = o_++);
          const o = r & Wf;
          t.data[e + (o >> qf)] |= 1 << o;
        })(e, t, n);
      }
      function Qf(e, t, n) {
        if (n & b.Optional || void 0 !== e) return e;
        li();
      }
      function Yf(e, t, n, r) {
        if (
          (n & b.Optional && void 0 === r && (r = null),
          !(n & (b.Self | b.Host)))
        ) {
          const o = e[zn],
            i = Ve(void 0);
          try {
            return o ? o.get(t, r, n & b.Optional) : zd(t, r, n & b.Optional);
          } finally {
            Ve(i);
          }
        }
        return Qf(r, 0, n);
      }
      function Kf(e, t, n, r = b.Default, o) {
        if (null !== e) {
          if (2048 & t[k] && !(r & b.Self)) {
            const s = (function c_(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 2048 & s[k] && !(512 & s[k]);

              ) {
                const a = Xf(i, s, n, r | b.Self, Rt);
                if (a !== Rt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[lf];
                  if (l) {
                    const c = l.get(n, Rt, r);
                    if (c !== Rt) return c;
                  }
                  (u = nh(s)), (s = s[Gn]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, Rt);
            if (s !== Rt) return s;
          }
          const i = Xf(e, t, n, r, Rt);
          if (i !== Rt) return i;
        }
        return Yf(t, n, r, o);
      }
      function Xf(e, t, n, r, o) {
        const i = (function u_(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Gr) ? e[Gr] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & Wf : l_) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Lf(t, e, r)) return r & b.Host ? Qf(o, 0, r) : Yf(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & b.Optional) return s;
            li();
          } finally {
            Vf();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Zf(e, t),
            u = Kn,
            l = r & b.Host ? t[le][Te] : null;
          for (
            (-1 === a || r & b.SkipSelf) &&
            ((u = -1 === a ? tu(e, t) : t[a + 8]),
            u !== Kn && eh(r, !1)
              ? ((s = t[E]), (a = Ti(u)), (t = Ai(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[E];
            if (Jf(i, a, c.data)) {
              const d = a_(a, t, n, s, r, l);
              if (d !== Rt) return d;
            }
            (u = t[a + 8]),
              u !== Kn && eh(r, t[E].data[a + 8] === l) && Jf(i, a, t)
                ? ((s = c), (a = Ti(u)), (t = Ai(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function a_(e, t, n, r, o, i) {
        const s = t[E],
          a = s.data[e + 8],
          c = (function xi(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && pt(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? En(a) && Ja : r != s && 0 != (3 & a.type),
            o & b.Host && i === a,
          );
        return null !== c ? bn(t, s, c, a) : Rt;
      }
      function bn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function e_(e) {
            return e instanceof Jr;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function TC(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new w(
                -200,
                `Circular dependency in DI detected for ${e}${n}`,
              );
            })(Q(i[n]));
          const a = Ni(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? Ve(s.injectImpl) : null;
          Lf(e, r, b.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function XE(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Df(t);
                    (n.preOrderHooks ??= []).push(e, s),
                      (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (n.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks ??= []).push(e, i),
                      (n.preOrderCheckHooks ??= []).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && Ve(u), Ni(a), (s.resolving = !1), Vf();
          }
        }
        return o;
      }
      function Jf(e, t, n) {
        return !!(n[t + (e >> qf)] & (1 << e));
      }
      function eh(e, t) {
        return !(e & b.Self || (e & b.Host && t));
      }
      class Xn {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Kf(this._tNode, this._lView, t, hi(r), n);
        }
      }
      function l_() {
        return new Xn(be(), y());
      }
      function ru(e) {
        return ba(e)
          ? () => {
              const t = ru(P(e));
              return t && t();
            }
          : _n(e);
      }
      function nh(e) {
        const t = e[E],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[Te] : null;
      }
      const er = "__parameters__";
      function nr(e, t, n) {
        return Vt(() => {
          const r = (function ou(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(er)
                ? u[er]
                : Object.defineProperty(u, er, { value: [] })[er];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      function no(e, t) {
        e.forEach((n) => (Array.isArray(n) ? no(n, t) : t(n)));
      }
      function oh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Pi(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      const Li = zr(nr("Optional"), 8),
        ki = zr(nr("SkipSelf"), 4);
      function Bi(e) {
        return 128 == (128 & e.flags);
      }
      var Ge = (() => (
        ((Ge = Ge || {})[(Ge.Important = 1)] = "Important"),
        (Ge[(Ge.DashCase = 2)] = "DashCase"),
        Ge
      ))();
      const cu = new Map();
      let $_ = 0;
      const fu = "__ngContext__";
      function Ne(e, t) {
        Ke(t)
          ? ((e[fu] = t[Yr]),
            (function H_(e) {
              cu.set(e[Yr], e);
            })(t))
          : (e[fu] = t);
      }
      let hu;
      function pu(e, t) {
        return hu(e, t);
      }
      function so(e) {
        const t = e[re];
        return Ue(t) ? t[re] : t;
      }
      function Sh(e) {
        return Mh(e[Zr]);
      }
      function bh(e) {
        return Mh(e[ht]);
      }
      function Mh(e) {
        for (; null !== e && !Ue(e); ) e = e[ht];
        return e;
      }
      function sr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Ue(r) ? (i = r) : Ke(r) && ((s = !0), (r = r[ye]));
          const a = ne(r);
          0 === e && null !== n
            ? null == o
              ? xh(t, n, a)
              : Mn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Mn(t, n, a, o || null, !0)
            : 2 === e
            ? (function Zi(e, t, n) {
                const r = Wi(e, t);
                r &&
                  (function sI(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function lI(e, t, n, r, o) {
                const i = n[Mt];
                i !== ne(n) && sr(t, e, r, i, o);
                for (let a = Ae; a < n.length; a++) {
                  const u = n[a];
                  uo(u[E], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function Gi(e, t, n) {
        return e.createElement(t, n);
      }
      function Ah(e, t) {
        const n = e[qn],
          r = n.indexOf(t);
        bf(t), n.splice(r, 1);
      }
      function mu(e, t) {
        if (e.length <= Ae) return;
        const n = Ae + t,
          r = e[n];
        if (r) {
          const o = r[Qr];
          null !== o && o !== e && Ah(o, r), t > 0 && (e[n - 1][ht] = r[ht]);
          const i = Pi(e, Ae + t);
          !(function X_(e, t) {
            uo(e, t, t[j], 2, null, null), (t[ye] = null), (t[Te] = null);
          })(r[E], r);
          const s = i[bt];
          null !== s && s.detachView(i[E]),
            (r[re] = null),
            (r[ht] = null),
            (r[k] &= -129);
        }
        return r;
      }
      function Nh(e, t) {
        if (!(256 & t[k])) {
          const n = t[j];
          t[mi]?.destroy(),
            t[yi]?.destroy(),
            n.destroyNode && uo(e, t, n, 3, null, null),
            (function tI(e) {
              let t = e[Zr];
              if (!t) return yu(e[E], e);
              for (; t; ) {
                let n = null;
                if (Ke(t)) n = t[Zr];
                else {
                  const r = t[Ae];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[ht] && t !== e; )
                    Ke(t) && yu(t[E], t), (t = t[re]);
                  null === t && (t = e), Ke(t) && yu(t[E], t), (n = t && t[ht]);
                }
                t = n;
              }
            })(t);
        }
      }
      function yu(e, t) {
        if (!(256 & t[k])) {
          (t[k] &= -129),
            (t[k] |= 256),
            (function iI(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof Jr)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        At(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          At(5, a, u);
                        }
                      }
                    else {
                      At(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        At(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function oI(e, t) {
              const n = e.cleanup,
                r = t[Un];
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else n[i].call(r[n[i + 1]]);
              null !== r && (t[Un] = null);
              const o = t[an];
              if (null !== o) {
                t[an] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, t),
            1 === t[E].type && t[j].destroy();
          const n = t[Qr];
          if (null !== n && Ue(t[re])) {
            n !== t[re] && Ah(n, t);
            const r = t[bt];
            null !== r && r.detachView(e);
          }
          !(function B_(e) {
            cu.delete(e[Yr]);
          })(t);
        }
      }
      function vu(e, t, n) {
        return (function Rh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[ye];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === Qe.None || i === Qe.Emulated) return null;
            }
            return ze(r, n);
          }
        })(e, t.parent, n);
      }
      function Mn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function xh(e, t, n) {
        e.appendChild(t, n);
      }
      function Oh(e, t, n, r, o) {
        null !== r ? Mn(e, t, n, r, o) : xh(e, t, n);
      }
      function Wi(e, t) {
        return e.parentNode(t);
      }
      let Du,
        _u,
        Lh = function Fh(e, t, n) {
          return 40 & e.type ? ze(e, n) : null;
        };
      function qi(e, t, n, r) {
        const o = vu(e, r, t),
          i = t[j],
          a = (function Ph(e, t, n) {
            return Lh(e, t, n);
          })(r.parent || t[Te], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) Oh(i, o, n[u], a, !1);
          else Oh(i, o, n, a, !1);
        void 0 !== Du && Du(i, r, t, n, o);
      }
      function ao(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return ze(t, e);
          if (4 & n) return wu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return ao(e, r);
            {
              const o = e[t.index];
              return Ue(o) ? wu(-1, o) : ne(o);
            }
          }
          if (32 & n) return pu(t, e)() || ne(e[t.index]);
          {
            const r = jh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ao(so(e[le]), r)
              : ao(e, t.next);
          }
        }
        return null;
      }
      function jh(e, t) {
        return null !== t ? e[le][Te].projection[t.projection] : null;
      }
      function wu(e, t) {
        const n = Ae + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[E].firstChild;
          if (null !== o) return ao(r, o);
        }
        return t[Mt];
      }
      function Cu(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ne(ne(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) Cu(e, t, n.child, r, o, i, !1), sr(t, e, o, a, i);
            else if (32 & u) {
              const l = pu(n, r);
              let c;
              for (; (c = l()); ) sr(t, e, o, c, i);
              sr(t, e, o, a, i);
            } else 16 & u ? Vh(e, t, r, n, o, i) : sr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function uo(e, t, n, r, o, i) {
        Cu(n, r, e.firstChild, t, o, i, !1);
      }
      function Vh(e, t, n, r, o, i) {
        const s = n[le],
          u = s[Te].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) sr(t, e, o, u[l], i);
        else {
          let l = u;
          const c = s[re];
          Bi(r) && (l.flags |= 128), Cu(e, t, l, c, o, i, !0);
        }
      }
      function Hh(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Bh(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Pa(e, t, r),
          null !== o && Hh(e, t, o),
          null !== i &&
            (function dI(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class I {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = R({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const po = new I("ENVIRONMENT_INITIALIZER"),
        np = new I("INJECTOR", -1),
        rp = new I("INJECTOR_DEF_TYPES");
      class op {
        get(t, n = Ur) {
          if (n === Ur) {
            const r = new Error(`NullInjectorError: No provider for ${me(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function jI(...e) {
        return { ɵproviders: sp(0, e), ɵfromNgModule: !0 };
      }
      function sp(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          no(t, (i) => {
            const s = i;
            Au(s, n, [], r) && ((o ||= []), o.push(s));
          }),
          void 0 !== o && ap(o, n),
          n
        );
      }
      function ap(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          Nu(o, (i) => {
            t.push(i);
          });
        }
      }
      function Au(e, t, n, r) {
        if (!(e = P(e))) return !1;
        let o = null,
          i = Hd(e);
        const s = !i && Z(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = Hd(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Au(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                no(i.imports, (c) => {
                  Au(c, t, n, r) && ((l ||= []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && ap(l, t);
            }
            if (!a) {
              const l = _n(o) || (() => new o());
              t.push(
                { provide: o, useFactory: l, deps: W },
                { provide: rp, useValue: o, multi: !0 },
                { provide: po, useValue: () => T(o), multi: !0 },
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              Nu(u, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Nu(e, t) {
        for (let n of e)
          Ma(n) && (n = n.ɵproviders), Array.isArray(n) ? Nu(n, t) : t(n);
      }
      const $I = Y({ provide: String, useValue: Y });
      function Ru(e) {
        return null !== e && "object" == typeof e && $I in e;
      }
      function Tn(e) {
        return "function" == typeof e;
      }
      const xu = new I("Set Injector scope."),
        Xi = {},
        HI = {};
      let Ou;
      function Ji() {
        return void 0 === Ou && (Ou = new op()), Ou;
      }
      class Wt {}
      class Pu extends Wt {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Lu(t, (s) => this.processProvider(s)),
            this.records.set(np, ur(void 0, this)),
            o.has("environment") && this.records.set(Wt, ur(void 0, this));
          const i = this.records.get(xu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(rp.multi, W, b.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of t) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = sn(this),
            r = Ve(void 0);
          try {
            return t();
          } finally {
            sn(n), Ve(r);
          }
        }
        get(t, n = Ur, r = b.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(Zd)))
            return t[Zd](this);
          r = hi(r);
          const o = sn(this),
            i = Ve(void 0);
          try {
            if (!(r & b.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function WI(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof I)
                    );
                  })(t) && ci(t);
                (a = u && this.injectableDefInScope(u) ? ur(Fu(t), Xi) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & b.Self ? Ji() : this.parent).get(
              t,
              (n = r & b.Optional && n === Ur ? null : n),
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[fi] = s[fi] || []).unshift(me(t)), o)) throw s;
              return (function BC(e, t, n, r) {
                const o = e[fi];
                throw (
                  (t[Gd] && o.unshift(t[Gd]),
                  (e.message = (function UC(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = me(t);
                    if (Array.isArray(t)) o = t.map(me).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a
                                ? JSON.stringify(a)
                                : me(a)),
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      kC,
                      "\n  ",
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[fi] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Ve(i), sn(o);
          }
        }
        resolveInjectorInitializers() {
          const t = sn(this),
            n = Ve(void 0);
          try {
            const r = this.get(po.multi, W, b.Self);
            for (const o of r) o();
          } finally {
            sn(t), Ve(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(me(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new w(205, !1);
        }
        processProvider(t) {
          let n = Tn((t = P(t))) ? t : P(t && t.provide);
          const r = (function UI(e) {
            return Ru(e)
              ? ur(void 0, e.useValue)
              : ur(
                  (function cp(e, t, n) {
                    let r;
                    if (Tn(e)) {
                      const o = P(e);
                      return _n(o) || Fu(o);
                    }
                    if (Ru(e)) r = () => P(e.useValue);
                    else if (
                      (function lp(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...Ra(e.deps || []));
                    else if (
                      (function up(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => T(P(e.useExisting));
                    else {
                      const o = P(e && (e.useClass || e.provide));
                      if (
                        !(function zI(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return _n(o) || Fu(o);
                      r = () => new o(...Ra(e.deps));
                    }
                    return r;
                  })(e),
                  Xi,
                );
          })(t);
          if (Tn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = ur(void 0, Xi, !0)),
              (o.factory = () => Ra(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === Xi && ((n.value = HI), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function GI(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = P(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          const n = this._onDestroyHooks.indexOf(t);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function Fu(e) {
        const t = ci(e),
          n = null !== t ? t.factory : _n(e);
        if (null !== n) return n;
        if (e instanceof I) throw new w(204, !1);
        if (e instanceof Function)
          return (function BI(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function ro(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new w(204, !1))
              );
            const n = (function PC(e) {
              return (e && (e[di] || e[Bd])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new w(204, !1);
      }
      function ur(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Lu(e, t) {
        for (const n of e)
          Array.isArray(n) ? Lu(n, t) : n && Ma(n) ? Lu(n.ɵproviders, t) : t(n);
      }
      const es = new I("AppId", { providedIn: "root", factory: () => qI }),
        qI = "ng",
        dp = new I("Platform Initializer"),
        lr = new I("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        fp = new I("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function lo() {
              if (void 0 !== _u) return _u;
              if (typeof document < "u") return document;
              throw new w(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let pp = (e, t) => null;
      function gp(e, t) {
        return pp(e, t);
      }
      class nS {}
      class vp {}
      class oS {
        resolveComponentFactory(t) {
          throw (function rS(e) {
            const t = Error(`No component factory found for ${me(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let is = (() => {
        class e {}
        return (e.NULL = new oS()), e;
      })();
      function iS() {
        return cr(be(), y());
      }
      function cr(e, t) {
        return new dn(ze(e, t));
      }
      let dn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = iS), e;
      })();
      class wp {}
      let uS = (() => {
        class e {}
        return (
          (e.ɵprov = R({ token: e, providedIn: "root", factory: () => null })),
          e
        );
      })();
      class as {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const lS = new as("16.1.5"),
        qu = {};
      function vo(e) {
        for (; e; ) {
          e[k] |= 64;
          const t = so(e);
          if (ja(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Zu(e) {
        return e.ngOriginalError;
      }
      class An {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Zu(t);
          for (; n && Zu(n); ) n = Zu(n);
          return n || null;
        }
      }
      const _p = new I("", { providedIn: "root", factory: () => !1 });
      function qt(e) {
        return e instanceof Function ? e() : e;
      }
      class Tp extends gf {
        constructor() {
          super(...arguments),
            (this.consumerAllowSignalWrites = !1),
            (this._lView = null);
        }
        set lView(t) {
          this._lView = t;
        }
        onConsumerDependencyMayHaveChanged() {
          vo(this._lView);
        }
        onProducerUpdateValueVersion() {}
        get hasReadASignal() {
          return this.hasProducers;
        }
        runInContext(t, n, r) {
          const o = _e(this);
          this.trackingVersion++;
          try {
            t(n, r);
          } finally {
            _e(o);
          }
        }
        destroy() {
          this.trackingVersion++;
        }
      }
      let ls = null;
      function Ap() {
        return (ls ??= new Tp()), ls;
      }
      function Np(e, t) {
        return e[t] ?? Ap();
      }
      function Rp(e, t) {
        const n = Ap();
        n.hasReadASignal && ((e[t] = ls), (n.lView = e), (ls = new Tp()));
      }
      const $ = {};
      function Lp(e, t = null, n = null, r) {
        const o = kp(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function kp(e, t = null, n = null, r, o = new Set()) {
        const i = [n || W, jI(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : me(e))),
          new Pu(i, t || Ji(), r || null, o)
        );
      }
      let Zt = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Lp({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Lp({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Ur),
          (e.NULL = new op()),
          (e.ɵprov = R({ token: e, providedIn: "any", factory: () => T(np) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function A(e, t = b.Default) {
        const n = y();
        return null === n ? T(e, t) : Kf(be(), n, P(e), t);
      }
      function cs(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[ye] = o),
          (d[k] = 140 | r),
          (null !== l || (e && 2048 & e[k])) && (d[k] |= 2048),
          Sf(d),
          (d[re] = d[Gn] = e),
          (d[ue] = n),
          (d[Cn] = s || (e && e[Cn])),
          (d[j] = a || (e && e[j])),
          (d[zn] = u || (e && e[zn]) || null),
          (d[Te] = i),
          (d[Yr] = (function V_() {
            return $_++;
          })()),
          (d[Bt] = c),
          (d[lf] = l),
          (d[le] = 2 == t.type ? e[le] : d),
          d
        );
      }
      function fr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Qu(e, t, n, r, o) {
            const i = Rf(),
              s = za(),
              u = (e.data[t] = (function RS(e, t, n, r, o, i) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function Qn() {
                    return null !== x.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: o,
                    attrs: i,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && ((i.next = u), (u.prev = i))),
              u
            );
          })(e, t, n, r, o)),
            (function BE() {
              return x.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Xr() {
            const e = x.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Nt(i, !0), i;
      }
      function Do(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function $p(e, t, n, r, o) {
        const i = Np(t, mi),
          s = (function Fe() {
            return x.lFrame.selectedIndex;
          })(),
          a = 2 & r;
        try {
          if (
            (Sn(-1),
            a &&
              t.length > U &&
              (function xp(e, t, n, r) {
                if (!r)
                  if (3 == (3 & t[k])) {
                    const i = e.preOrderCheckHooks;
                    null !== i && bi(t, i, n);
                  } else {
                    const i = e.preOrderHooks;
                    null !== i && Mi(t, i, 0, n);
                  }
                Sn(n);
              })(e, t, U, !1),
            At(a ? 2 : 0, o),
            a)
          )
            i.runInContext(n, r, o);
          else {
            const l = _e(null);
            try {
              n(r, o);
            } finally {
              _e(l);
            }
          }
        } finally {
          a && null === t[mi] && Rp(t, mi), Sn(s), At(a ? 3 : 1, o);
        }
      }
      function Yu(e, t, n) {
        if (ka(t)) {
          const r = _e(null);
          try {
            const i = t.directiveEnd;
            for (let s = t.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            _e(r);
          }
        }
      }
      function Vp(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Ju(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id,
            ))
          : t;
      }
      function Ju(e, t, n, r, o, i, s, a, u, l, c) {
        const d = U + r,
          f = d + o,
          h = (function SS(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : $);
            return n;
          })(d, f),
          p = "function" == typeof l ? l() : l;
        return (h[E] = {
          type: e,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let Hp = (e) => null;
      function Bp(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Up(n, t, o, i)
              : r.hasOwnProperty(o) && Up(n, t, r[o], i);
          }
        return n;
      }
      function Up(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function zp(e, t, n, r, o, i) {
        for (let l = 0; l < r.length; l++) nu(Ri(n, t), e, r[l].type);
        !(function US(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          u = Do(e, t, r.length, null);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          (n.mergedAttrs = Wr(n.mergedAttrs, c.hostAttrs)),
            zS(e, n, t, u, c),
            BS(u, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            u++;
        }
        !(function xS(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let u = null,
            l = null;
          for (let c = t.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (u = Bp(d.inputs, c, u, f ? f.inputs : null)),
              (l = Bp(d.outputs, c, l, p));
            const g = null === u || null === s || ef(t) ? null : qS(u, c, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (t.flags |= 8),
            u.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = u),
            (t.outputs = l);
        })(e, n, i);
      }
      function Gp(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function zE() {
            return x.lFrame.currentDirectiveIndex;
          })();
        try {
          Sn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              l = t[a];
            Wa(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                $S(u, l);
          }
        } finally {
          Sn(-1), Wa(s);
        }
      }
      function $S(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function tl(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function BS(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          pt(t) && (n[""] = e);
        }
      }
      function zS(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = _n(o.type)),
          s = new Jr(i, pt(o), A);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function LS(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function kS(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, Do(e, n, o.hostVars, $), o);
      }
      function WS(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s)
          for (let a = 0; a < s.length; ) Wp(r, n, s[a++], s[a++], s[a++]);
      }
      function Wp(e, t, n, r, o) {
        const i = _e(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)),
            null !== e.setInput ? e.setInput(t, o, n, r) : (t[r] = o);
        } finally {
          _e(i);
        }
      }
      function qS(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function Zp(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Za(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function ds(e, t) {
        return e[Zr] ? (e[uf][ht] = t) : (e[Zr] = t), (e[uf] = t), t;
      }
      function rl(e, t, n) {
        Za(0);
        const r = _e(null);
        try {
          t(e, n);
        } finally {
          _e(r);
        }
      }
      function ol(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++];
          Wp(e.data[s], t[s], r, a, o);
        }
      }
      function ZS(e, t) {
        const n = Xe(t, e),
          r = n[E];
        !(function QS(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n);
        const o = n[ye];
        null !== o && null === n[Bt] && (n[Bt] = gp(o, n[zn])), il(r, n, n[ue]);
      }
      function il(e, t, n) {
        Qa(t);
        try {
          const r = e.viewQuery;
          null !== r && rl(1, r, n);
          const o = e.template;
          null !== o && $p(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Zp(e, t),
            e.staticViewQueries && rl(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function YS(e, t) {
              for (let n = 0; n < t.length; n++) ZS(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[k] &= -5), Ya();
        }
      }
      let Jp = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = new vE(
                n,
                (l) => {
                  this.all.has(l) && this.queue.set(l, i);
                },
                o,
              );
            let a;
            this.all.add(s), s.notify();
            const u = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(u)), { destroy: u };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (
          (e.ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          })),
          e
        );
      })();
      function fs(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Ia(o, a))
              : 2 == i && (r = Ia(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function wo(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(ne(i)), Ue(i))) {
            for (let a = Ae; a < i.length; a++) {
              const u = i[a],
                l = u[E].firstChild;
              null !== l && wo(u[E], u, l, r);
            }
            i[Mt] !== i[ye] && r.push(i[Mt]);
          }
          const s = n.type;
          if (8 & s) wo(e, t, n.child, r);
          else if (32 & s) {
            const a = pu(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = jh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = so(t[le]);
              wo(u[E], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      function hs(e, t, n, r = !0) {
        const o = t[Cn].rendererFactory;
        o.begin && o.begin();
        try {
          eg(e, t, e.template, n);
        } catch (s) {
          throw (
            (r &&
              (function Xp(e, t) {
                const n = e[zn],
                  r = n ? n.get(An, null) : null;
                r && r.handleError(t);
              })(t, s),
            s)
          );
        } finally {
          o.end && o.end(), t[Cn].effectManager?.flush();
        }
      }
      function eg(e, t, n, r) {
        const o = t[k];
        if (256 != (256 & o)) {
          t[Cn].effectManager?.flush(), Qa(t);
          try {
            Sf(t),
              (function Of(e) {
                return (x.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && $p(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && bi(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && Mi(t, l, 0, null), Ka(t, 0);
            }
            if (
              ((function tb(e) {
                for (let t = Sh(e); null !== t; t = bh(t)) {
                  if (!t[cf]) continue;
                  const n = t[qn];
                  for (let r = 0; r < n.length; r++) {
                    AE(n[r]);
                  }
                }
              })(t),
              tg(t, 2),
              null !== e.contentQueries && Zp(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && bi(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && Mi(t, l, 1), Ka(t, 1);
            }
            !(function IS(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = Np(t, yi);
              try {
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (i < 0) Sn(~i);
                  else {
                    const s = i,
                      a = n[++o],
                      u = n[++o];
                    UE(a, s), r.runInContext(u, 2, t[s]);
                  }
                }
              } finally {
                null === t[yi] && Rp(t, yi), Sn(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && rg(t, a, 0);
            const u = e.viewQuery;
            if ((null !== u && rl(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && bi(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && Mi(t, l, 2), Ka(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[k] &= -73),
              bf(t);
          } finally {
            Ya();
          }
        }
      }
      function tg(e, t) {
        for (let n = Sh(e); null !== n; n = bh(n))
          for (let r = Ae; r < n.length; r++) ng(n[r], t);
      }
      function nb(e, t, n) {
        ng(Xe(t, e), n);
      }
      function ng(e, t) {
        if (
          !(function ME(e) {
            return 128 == (128 & e[k]);
          })(e)
        )
          return;
        const n = e[E];
        if ((80 & e[k] && 0 === t) || 1024 & e[k] || 2 === t)
          eg(n, e, n.template, e[ue]);
        else if (e[qr] > 0) {
          tg(e, 1);
          const o = e[E].components;
          null !== o && rg(e, o, 1);
        }
      }
      function rg(e, t, n) {
        for (let r = 0; r < t.length; r++) nb(e, t[r], n);
      }
      class Co {
        get rootNodes() {
          const t = this._lView,
            n = t[E];
          return wo(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ue];
        }
        set context(t) {
          this._lView[ue] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[k]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[re];
            if (Ue(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (mu(t, r), Pi(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Nh(this._lView[E], this._lView);
        }
        onDestroy(t) {
          !(function Tf(e, t) {
            if (256 == (256 & e[k])) throw new w(911, !1);
            null === e[an] && (e[an] = []), e[an].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          vo(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[k] &= -129;
        }
        reattach() {
          this._lView[k] |= 128;
        }
        detectChanges() {
          hs(this._lView[E], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new w(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function eI(e, t) {
              uo(e, t, t[j], 2, null, null);
            })(this._lView[E], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new w(902, !1);
          this._appRef = t;
        }
      }
      class rb extends Co {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          hs(t[E], t, t[ue], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class og extends is {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = Z(t);
          return new Eo(n, this.ngModule);
        }
      }
      function ig(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class ib {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = hi(r);
          const o = this.injector.get(t, qu, r);
          return o !== qu || n === qu ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Eo extends vp {
        get inputs() {
          const t = this.componentDef,
            n = t.inputTransforms,
            r = ig(t.inputs);
          if (null !== n)
            for (const o of r)
              n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
          return r;
        }
        get outputs() {
          return ig(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function JC(e) {
              return e.map(XC).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Wt ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new ib(t, i) : t,
            a = s.get(wp, null);
          if (null === a) throw new w(407, !1);
          const c = {
              rendererFactory: a,
              sanitizer: s.get(uS, null),
              effectManager: s.get(Jp, null),
            },
            d = a.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            h = r
              ? (function bS(e, t, n, r) {
                  const i = r.get(_p, !1) || n === Qe.ShadowDom,
                    s = e.selectRootElement(t, i);
                  return (
                    (function MS(e) {
                      Hp(e);
                    })(s),
                    s
                  );
                })(d, r, this.componentDef.encapsulation, s)
              : Gi(
                  d,
                  f,
                  (function ob(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(f),
                ),
            v = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528,
            D = Ju(0, null, null, 1, 0, null, null, null, null, null, null),
            m = cs(null, D, null, v, null, null, c, d, s, null, null);
          let S, L;
          Qa(m);
          try {
            const H = this.componentDef;
            let xe,
              fa = null;
            H.findHostDirectiveDefs
              ? ((xe = []),
                (fa = new Map()),
                H.findHostDirectiveDefs(H, xe, fa),
                xe.push(H))
              : (xe = [H]);
            const g1 = (function ab(e, t) {
                const n = e[E],
                  r = U;
                return (e[r] = t), fr(n, r, 2, "#host", null);
              })(m, h),
              m1 = (function ub(e, t, n, r, o, i, s) {
                const a = o[E];
                !(function lb(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Wr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (fs(t, t.mergedAttrs, !0), null !== n && Bh(r, n, t));
                })(r, e, t, s);
                let u = null;
                null !== t && (u = gp(t, o[zn]));
                const l = i.rendererFactory.createRenderer(t, n);
                let c = 16;
                n.signals ? (c = 4096) : n.onPush && (c = 64);
                const d = cs(
                  o,
                  Vp(n),
                  null,
                  c,
                  o[e.index],
                  e,
                  i,
                  l,
                  null,
                  null,
                  u,
                );
                return (
                  a.firstCreatePass && tl(a, e, r.length - 1),
                  ds(o, d),
                  (o[e.index] = d)
                );
              })(g1, h, H, xe, m, c, d);
            (L = (function If(e, t) {
              return e.data[t];
            })(D, U)),
              h &&
                (function db(e, t, n, r) {
                  if (r) Pa(e, n, ["ng-version", lS.full]);
                  else {
                    const { attrs: o, classes: i } = (function eE(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!ft(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && Pa(e, n, o),
                      i && i.length > 0 && Hh(e, n, i.join(" "));
                  }
                })(d, H, h, r),
              void 0 !== n &&
                (function fb(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(L, this.ngContentSelectors, n),
              (S = (function cb(e, t, n, r, o, i) {
                const s = be(),
                  a = o[E],
                  u = ze(s, o);
                zp(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Ne(bn(o, a, s.directiveStart + c, s), o);
                Gp(a, o, s), u && Ne(u, o);
                const l = bn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ue] = o[ue] = l), null !== i))
                  for (const c of i) c(l, t);
                return Yu(a, s, e), l;
              })(m1, H, xe, fa, m, [hb])),
              il(D, m, null);
          } finally {
            Ya();
          }
          return new sb(this.componentType, S, cr(L, m), m, L);
        }
      }
      class sb extends nS {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new rb(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), n))
            )
              return;
            const i = this._rootLView;
            ol(i[E], i, o, t, n),
              this.previousInputValues.set(t, n),
              vo(Xe(this._tNode.index, i));
          }
        }
        get injector() {
          return new Xn(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function hb() {
        const e = be();
        Si(y()[E], e);
      }
      function hl(e, t, n, r, o) {
        const s = o ? "class" : "style";
        ol(e, n, t.inputs[s], s, r);
      }
      function ws(e, t, n, r) {
        const o = y(),
          i = G(),
          s = U + e,
          a = o[j],
          u = i.firstCreatePass
            ? (function Zb(e, t, n, r, o, i) {
                const s = t.consts,
                  u = fr(t, e, 2, r, un(s, o));
                return (
                  (function el(e, t, n, r) {
                    if (Nf()) {
                      const o = null === r ? null : { "": -1 },
                        i = (function VS(e, t) {
                          const n = e.directiveRegistry;
                          let r = null,
                            o = null;
                          if (n)
                            for (let i = 0; i < n.length; i++) {
                              const s = n[i];
                              if (tf(t, s.selectors, !1))
                                if ((r || (r = []), pt(s)))
                                  if (null !== s.findHostDirectiveDefs) {
                                    const a = [];
                                    (o = o || new Map()),
                                      s.findHostDirectiveDefs(s, a, o),
                                      r.unshift(...a, s),
                                      tl(e, t, a.length);
                                  } else r.unshift(s), tl(e, t, 0);
                                else
                                  (o = o || new Map()),
                                    s.findHostDirectiveDefs?.(s, r, o),
                                    r.push(s);
                            }
                          return null === r ? null : [r, o];
                        })(e, n);
                      let s, a;
                      null === i ? (s = a = null) : ([s, a] = i),
                        null !== s && zp(e, t, n, s, o, a),
                        o &&
                          (function HS(e, t, n) {
                            if (t) {
                              const r = (e.localNames = []);
                              for (let o = 0; o < t.length; o += 2) {
                                const i = n[t[o + 1]];
                                if (null == i) throw new w(-301, !1);
                                r.push(t[o], i);
                              }
                            }
                          })(n, r, o);
                    }
                    n.mergedAttrs = Wr(n.mergedAttrs, n.attrs);
                  })(t, n, u, un(s, i)),
                  null !== u.attrs && fs(u, u.attrs, !1),
                  null !== u.mergedAttrs && fs(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          l = Mg(i, o, u, a, t, e);
        o[s] = l;
        const c = (function Di(e) {
          return 1 == (1 & e.flags);
        })(u);
        return (
          Nt(u, !0),
          Bh(a, l, u),
          32 != (32 & u.flags) && Ii() && qi(i, o, l, u),
          0 ===
            (function RE() {
              return x.lFrame.elementDepthCount;
            })() && Ne(l, o),
          (function xE() {
            x.lFrame.elementDepthCount++;
          })(),
          c &&
            ((function Ku(e, t, n) {
              Nf() &&
                ((function jS(e, t, n, r) {
                  const o = n.directiveStart,
                    i = n.directiveEnd;
                  En(n) &&
                    (function GS(e, t, n) {
                      const r = ze(t, e),
                        o = Vp(n);
                      let s = 16;
                      n.signals ? (s = 4096) : n.onPush && (s = 64);
                      const a = ds(
                        e,
                        cs(
                          e,
                          o,
                          null,
                          s,
                          r,
                          t,
                          null,
                          e[Cn].rendererFactory.createRenderer(r, n),
                          null,
                          null,
                          null,
                        ),
                      );
                      e[t.index] = a;
                    })(t, n, e.data[o + n.componentOffset]),
                    e.firstCreatePass || Ri(n, t),
                    Ne(r, t);
                  const s = n.initialInputs;
                  for (let a = o; a < i; a++) {
                    const u = e.data[a],
                      l = bn(t, e, a, n);
                    Ne(l, t),
                      null !== s && WS(0, a - o, l, u, 0, s),
                      pt(u) && (Xe(n.index, t)[ue] = bn(t, e, a, n));
                  }
                })(e, t, n, ze(n, t)),
                64 == (64 & n.flags) && Gp(e, t, n));
            })(i, o, u),
            Yu(i, u, o)),
          null !== r &&
            (function Xu(e, t, n = ze) {
              const r = t.localNames;
              if (null !== r) {
                let o = t.index + 1;
                for (let i = 0; i < r.length; i += 2) {
                  const s = r[i + 1],
                    a = -1 === s ? n(t, e) : e[s];
                  e[o++] = a;
                }
              }
            })(o, u),
          ws
        );
      }
      function Cs() {
        let e = be();
        za()
          ? (function Ga() {
              x.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Nt(e, !1));
        const t = e;
        (function PE(e) {
          return x.skipHydrationRootTNode === e;
        })(t) &&
          (function jE() {
            x.skipHydrationRootTNode = null;
          })(),
          (function OE() {
            x.lFrame.elementDepthCount--;
          })();
        const n = G();
        return (
          n.firstCreatePass && (Si(n, e), ka(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function t_(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            hl(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function n_(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            hl(n, t, y(), t.stylesWithoutHost, !1),
          Cs
        );
      }
      function pl(e, t, n, r) {
        return ws(e, t, n, r), Cs(), pl;
      }
      let Mg = (e, t, n, r, o, i) => (
        ln(!0),
        Gi(
          r,
          o,
          (function Hf() {
            return x.lFrame.currentNamespace;
          })(),
        )
      );
      function Es(e) {
        return !!e && "function" == typeof e.then;
      }
      function Ng(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      let sm = (e, t, n, r, o) => (
        ln(!0),
        (function zi(e, t) {
          return e.createText(t);
        })(t[j], r)
      );
      const Ir = "en-US";
      let Am = Ir;
      class Sr {}
      class ty {}
      class Nl extends Sr {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new og(this));
          const o = Ye(t);
          (this._bootstrapComponents = qt(o.bootstrap)),
            (this._r3Injector = kp(
              t,
              n,
              [
                { provide: Sr, useValue: this },
                { provide: is, useValue: this.componentFactoryResolver },
                ...r,
              ],
              me(t),
              new Set(["environment"]),
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class Rl extends ty {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Nl(this.moduleType, t, []);
        }
      }
      class ny extends Sr {
        constructor(t) {
          super(),
            (this.componentFactoryResolver = new og(this)),
            (this.instance = null);
          const n = new Pu(
            [
              ...t.providers,
              { provide: Sr, useValue: this },
              { provide: is, useValue: this.componentFactoryResolver },
            ],
            t.parent || Ji(),
            t.debugName,
            new Set(["environment"]),
          );
          (this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function xl(e, t, n = null) {
        return new ny({
          providers: e,
          parent: t,
          debugName: n,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let X0 = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
              const r = sp(0, n.type),
                o =
                  r.length > 0
                    ? xl([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n, o);
            }
            return this.cachedInjectors.get(n);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = R({
            token: e,
            providedIn: "environment",
            factory: () => new e(T(Wt)),
          })),
          e
        );
      })();
      function ry(e) {
        e.getStandaloneInjector = (t) =>
          t.get(X0).getOrCreateStandaloneInjector(e);
      }
      function Pl(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const ke = class IT extends jt {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = Pl(i)), o && (o = Pl(o)), s && (s = Pl(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof nt && t.add(a), a;
        }
      };
      let yt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = FT), e;
      })();
      function FT() {
        return (function wy(e, t) {
          let n;
          const r = t[e.index];
          return (
            Ue(r)
              ? (n = r)
              : ((n = (function qp(e, t, n, r) {
                  return [e, !0, !1, t, null, 0, r, n, null, null, null];
                })(r, t, null, e)),
                (t[e.index] = n),
                ds(t, n)),
            Cy(n, t, e, r),
            new vy(n, e, t)
          );
        })(be(), y());
      }
      const LT = yt,
        vy = class extends LT {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return cr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Xn(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = tu(this._hostTNode, this._hostLView);
            if (Gf(t)) {
              const n = Ai(t, this._hostLView),
                r = Ti(t);
              return new Xn(n[E].data[r + 8], n);
            }
            return new Xn(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Dy(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - Ae;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const a = t.createEmbeddedViewImpl(n || {}, i, null);
            return this.insertImpl(a, o, false), a;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function to(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const u = s ? t : new Eo(Z(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const v = (s ? l : this.parentInjector).get(Wt, null);
              v && (i = v);
            }
            Z(u.componentType ?? {});
            const h = u.create(l, o, null, i);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(t, n) {
            return this.insertImpl(t, n, !1);
          }
          insertImpl(t, n, r) {
            const o = t._lView,
              i = o[E];
            if (
              (function TE(e) {
                return Ue(e[re]);
              })(o)
            ) {
              const u = this.indexOf(t);
              if (-1 !== u) this.detach(u);
              else {
                const l = o[re],
                  c = new vy(l, l[Te], l[re]);
                c.detach(c.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            if (
              ((function nI(e, t, n, r) {
                const o = Ae + r,
                  i = n.length;
                r > 0 && (n[o - 1][ht] = t),
                  r < i - Ae
                    ? ((t[ht] = n[o]), oh(n, Ae + r, t))
                    : (n.push(t), (t[ht] = null)),
                  (t[re] = n);
                const s = t[Qr];
                null !== s &&
                  n !== s &&
                  (function rI(e, t) {
                    const n = e[qn];
                    t[le] !== t[re][re][le] && (e[cf] = !0),
                      null === n ? (e[qn] = [t]) : n.push(t);
                  })(s, t);
                const a = t[bt];
                null !== a && a.insertView(e), (t[k] |= 128);
              })(i, o, a, s),
              !r)
            ) {
              const u = wu(s, a),
                l = o[j],
                c = Wi(l, a[Mt]);
              null !== c &&
                (function J_(e, t, n, r, o, i) {
                  (r[ye] = o), (r[Te] = t), uo(e, r, n, 1, o, i);
                })(i, a[Te], l, o, c, u);
            }
            return t.attachToViewContainerRef(), oh(kl(a), s, t), t;
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Dy(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = mu(this._lContainer, n);
            r && (Pi(kl(this._lContainer), n), Nh(r[E], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = mu(this._lContainer, n);
            return r && null != Pi(kl(this._lContainer), n) ? new Co(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Dy(e) {
        return e[8];
      }
      function kl(e) {
        return e[8] || (e[8] = []);
      }
      let Cy = function Ey(e, t, n, r) {
        if (e[Mt]) return;
        let o;
        (o =
          8 & n.type
            ? ne(r)
            : (function kT(e, t) {
                const n = e[j],
                  r = n.createComment(""),
                  o = ze(t, e);
                return (
                  Mn(
                    n,
                    Wi(n, o),
                    r,
                    (function aI(e, t) {
                      return e.nextSibling(t);
                    })(n, o),
                    !1,
                  ),
                  r
                );
              })(t, n)),
          (e[Mt] = o);
      };
      const Zl = new I("Application Initializer");
      let Ql = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = _(Zl, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const o of this.appInits) {
                const i = o();
                if (Es(i)) n.push(i);
                else if (Ng(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch((o) => {
                  this.reject(o);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        qy = (() => {
          class e {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })();
      const Kt = new I("LocaleId", {
        providedIn: "root",
        factory: () =>
          _(Kt, b.Optional | b.SkipSelf) ||
          (function pA() {
            return (typeof $localize < "u" && $localize.locale) || Ir;
          })(),
      });
      let Zy = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new rt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class mA {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Qy = (() => {
        class e {
          compileModuleSync(n) {
            return new Rl(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = qt(Ye(n).declarations).reduce((s, a) => {
                const u = Z(a);
                return u && s.push(new Eo(u)), s;
              }, []);
            return new mA(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Xy(...e) {}
      class ie {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ke(!1)),
            (this.onMicrotaskEmpty = new ke(!1)),
            (this.onStable = new ke(!1)),
            (this.onError = new ke(!1)),
            typeof Zone > "u")
          )
            throw new w(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function DA() {
              const e = "function" == typeof J.requestAnimationFrame;
              let t = J[e ? "requestAnimationFrame" : "setTimeout"],
                n = J[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && t && n) {
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
                const o = n[Zone.__symbol__("OriginalDelegate")];
                o && (n = o);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: n,
              };
            })().nativeRequestAnimationFrame),
            (function EA(e) {
              const t = () => {
                !(function CA(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(J, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Kl(e),
                                (e.isCheckStableRunning = !0),
                                Yl(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {},
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Kl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Jy(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      ev(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return Jy(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), ev(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Kl(e),
                          Yl(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ie.isInAngularZone()) throw new w(909, !1);
        }
        static assertNotInAngularZone() {
          if (ie.isInAngularZone()) throw new w(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, wA, Xy, Xy);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const wA = {};
      function Yl(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Kl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Jy(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function ev(e) {
        e._nesting--, Yl(e);
      }
      class _A {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ke()),
            (this.onMicrotaskEmpty = new ke()),
            (this.onStable = new ke()),
            (this.onError = new ke());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const tv = new I("", { providedIn: "root", factory: nv });
      function nv() {
        const e = _(ie);
        let t = !0;
        return (function IC(...e) {
          const t = Br(e),
            n = (function yC(e, t) {
              return "number" == typeof Ea(e) ? e.pop() : t;
            })(e, 1 / 0),
            r = e;
          return r.length ? (1 === r.length ? dt(r[0]) : Vn(n)(Se(r, t))) : Et;
        })(
          new ge((o) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(t), o.complete();
              });
          }),
          new ge((o) => {
            let i;
            e.runOutsideAngular(() => {
              i = e.onStable.subscribe(() => {
                ie.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !t &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((t = !0), o.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              ie.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(jd()),
        );
      }
      const rv = new I(""),
        Rs = new I("");
      let ec,
        Xl = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                ec ||
                  ((function IA(e) {
                    ec = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ie.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1),
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i,
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(ie), T(Jl), T(Rs));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Jl = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return ec?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        hn = null;
      const ov = new I("AllowMultipleToken"),
        tc = new I("PlatformDestroyListeners"),
        nc = new I("appBootstrapListener");
      class sv {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function uv(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new I(r);
        return (i = []) => {
          let s = rc();
          if (!s || s.injector.get(ov, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function MA(e) {
                  if (hn && !hn.get(ov, !1)) throw new w(400, !1);
                  (function iv() {
                    !(function mE(e) {
                      mf = e;
                    })(() => {
                      throw new w(600, !1);
                    });
                  })(),
                    (hn = e);
                  const t = e.get(cv);
                  (function av(e) {
                    e.get(dp, null)?.forEach((n) => n());
                  })(e);
                })(
                  (function lv(e = [], t) {
                    return Zt.create({
                      name: t,
                      providers: [
                        { provide: xu, useValue: "platform" },
                        { provide: tc, useValue: new Set([() => (hn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r),
                );
          }
          return (function AA(e) {
            const t = rc();
            if (!t) throw new w(401, !1);
            return t;
          })();
        };
      }
      function rc() {
        return hn?.get(cv) ?? null;
      }
      let cv = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function NA(e = "zone.js", t) {
              return "noop" === e ? new _A() : "zone.js" === e ? new ie(t) : e;
            })(
              r?.ngZone,
              (function dv(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              }),
            );
            return o.run(() => {
              const i = (function K0(e, t, n) {
                  return new Nl(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function mv(e) {
                    return [
                      { provide: ie, useFactory: e },
                      {
                        provide: po,
                        multi: !0,
                        useFactory: () => {
                          const t = _(xA, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: gv, useFactory: RA },
                      { provide: tv, useFactory: nv },
                    ];
                  })(() => o),
                ),
                s = i.injector.get(An, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (u) => {
                      s.handleError(u);
                    },
                  });
                  i.onDestroy(() => {
                    xs(this._modules, i), a.unsubscribe();
                  });
                }),
                (function fv(e, t, n) {
                  try {
                    const r = n();
                    return Es(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(Ql);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Nm(e) {
                          ot(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Am = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(Kt, Ir) || Ir),
                        this._moduleDoBootstrap(i),
                        i
                      ),
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = hv({}, r);
            return (function SA(e, t, n) {
              const r = new Rl(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Tr);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new w(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new w(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(tc, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(Zt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function hv(e, t) {
        return Array.isArray(t) ? t.reduce(hv, e) : { ...e, ...t };
      }
      let Tr = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = _(gv)),
              (this.zoneIsStable = _(tv)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = _(Zy).hasPendingTasks.pipe(
                _t((n) => (n ? O(!1) : this.zoneIsStable)),
                (function SC(e, t = nn) {
                  return (
                    (e = e ?? bC),
                    Ce((n, r) => {
                      let o,
                        i = !0;
                      n.subscribe(
                        Ee(r, (s) => {
                          const a = t(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        }),
                      );
                    })
                  );
                })(),
                jd(),
              )),
              (this._injector = _(Wt));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof vp;
            if (!this._injector.get(Ql).done)
              throw (
                (!o &&
                  (function Bn(e) {
                    const t = Z(e) || Me(e) || Be(e);
                    return null !== t && t.standalone;
                  })(n),
                new w(405, !1))
              );
            let s;
            (s = o ? n : this._injector.get(is).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function bA(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Sr),
              l = s.create(Zt.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(rv, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  xs(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new w(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            xs(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(nc, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => xs(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new w(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function xs(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const gv = new I("", {
        providedIn: "root",
        factory: () => _(An).handleError.bind(void 0),
      });
      function RA() {
        const e = _(ie),
          t = _(An);
        return (n) => e.runOutsideAngular(() => t.handleError(n));
      }
      let xA = (() => {
        class e {
          constructor() {
            (this.zone = _(ie)), (this.applicationRef = _(Tr));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      let oc = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = PA), e;
      })();
      function PA(e) {
        return (function FA(e, t, n) {
          if (En(e) && !n) {
            const r = Xe(e.index, t);
            return new Co(r, r);
          }
          return 47 & e.type ? new Co(t[le], t) : null;
        })(be(), y(), 16 == (16 & e));
      }
      const ZA = uv(null, "core", []);
      let QA = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(Tr));
            }),
            (e.ɵmod = wn({ type: e })),
            (e.ɵinj = on({})),
            e
          );
        })(),
        fc = null;
      function Ar() {
        return fc;
      }
      class aN {}
      const at = new I("DocumentToken");
      let hc = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return _(lN);
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const uN = new I("Location Initialized");
      let lN = (() => {
        class e extends hc {
          constructor() {
            super(),
              (this._doc = _(at)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Ar().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Ar().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Ar().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, o) {
            this._history.pushState(n, r, o);
          }
          replaceState(n, r, o) {
            this._history.replaceState(n, r, o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function pc(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function xv(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function Xt(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Pn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return _(Pv);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Ov = new I("appBaseHref");
      let Pv = (() => {
          class e extends Pn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  _(at).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return pc(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  Xt(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Xt(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Xt(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(hc), T(Ov, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        cN = (() => {
          class e extends Pn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = pc(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Xt(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Xt(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(hc), T(Ov, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        gc = (() => {
          class e {
            constructor(n) {
              (this._subject = new ke()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function hN(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, n] = e.split(/\/\/[^\/]+/);
                  return n;
                }
                return e;
              })(xv(Fv(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + Xt(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function fN(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const n = t.substring(e.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : t;
                })(this._basePath, Fv(n)),
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Xt(r)),
                  o,
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Xt(r)),
                  o,
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = Xt),
            (e.joinWithSlash = pc),
            (e.stripTrailingSlash = xv),
            (e.ɵfac = function (n) {
              return new (n || e)(T(Pn));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return (function dN() {
                  return new gc(T(Pn));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function Fv(e) {
        return e.replace(/\/index.html$/, "");
      }
      let MR = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = wn({ type: e })),
          (e.ɵinj = on({})),
          e
        );
      })();
      function Kv(e) {
        return "server" === e;
      }
      let RR = (() => {
        class e {}
        return (
          (e.ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new xR(T(at), window),
          })),
          e
        );
      })();
      class xR {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function OR(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              Xv(this.window.history) ||
              Xv(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function Xv(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class rx extends aN {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class xc extends rx {
        static makeCurrent() {
          !(function sN(e) {
            fc || (fc = e);
          })(new xc());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function ox() {
            return (
              (Vo = Vo || document.querySelector("base")),
              Vo ? Vo.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function ix(e) {
                (Zs = Zs || document.createElement("a")),
                  Zs.setAttribute("href", e);
                const t = Zs.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          Vo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function YN(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Zs,
        Vo = null,
        ax = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const Oc = new I("EventManagerPlugins");
      let rD = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(n))), !r))
              throw new w(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(Oc), T(ie));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class oD {
        constructor(t) {
          this._doc = t;
        }
      }
      const Pc = "ng-app-id";
      let iD = (() => {
        class e {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = Kv(i)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${Pc}="${this.appId}"]`,
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const o = this.styleRef;
            if (o.has(n)) {
              const i = o.get(n);
              return (i.usage += r), i.usage;
            }
            return o.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === n)
              return o.delete(r), i.removeAttribute(Pc), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(Pc, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const o = this.getStyleElement(n, r);
            n.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(at), T(es), T(fp, 8), T(lr));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Fc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Lc = /%COMP%/g,
        dx = new I("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function aD(e, t) {
        return t.map((n) => n.replace(Lc, e));
      }
      let uD = (() => {
        class e {
          constructor(n, r, o, i, s, a, u, l = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestroy = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = u),
              (this.nonce = l),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = Kv(a)),
              (this.defaultRenderer = new kc(n, s, u, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === Qe.ShadowDom &&
              (r = { ...r, encapsulation: Qe.Emulated });
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof cD
                ? o.applyToHost(n)
                : o instanceof jc && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                u = this.eventManager,
                l = this.sharedStylesHost,
                c = this.removeStylesOnCompDestroy,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case Qe.Emulated:
                  i = new cD(u, l, r, this.appId, c, s, a, d);
                  break;
                case Qe.ShadowDom:
                  return new gx(u, l, n, r, s, a, this.nonce, d);
                default:
                  i = new jc(u, l, r, c, s, a, d);
              }
              o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(
              T(rD),
              T(iD),
              T(es),
              T(dx),
              T(at),
              T(lr),
              T(ie),
              T(fp),
            );
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class kc {
        constructor(t, n, r, o) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? this.doc.createElementNS(Fc[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (lD(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (lD(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!r) throw new w(-5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Fc[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = Fc[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (Ge.DashCase | Ge.Important)
            ? t.style.setProperty(n, r, o & Ge.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & Ge.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if (
            "string" == typeof t &&
            !(t = Ar().getGlobalEventTarget(this.doc, t))
          )
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(
            t,
            n,
            this.decoratePreventDefault(r),
          );
        }
        decoratePreventDefault(t) {
          return (n) => {
            if ("__ngUnwrap__" === n) return t;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => t(n))
                : t(n)) && n.preventDefault();
          };
        }
      }
      function lD(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class gx extends kc {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, u),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const l = aD(o.id, o.styles);
          for (const c of l) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = c),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t)),
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class jc extends kc {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = u ? aD(u, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class cD extends jc {
        constructor(t, n, r, o, i, s, a, u) {
          const l = o + "-" + r.id;
          super(t, n, r, i, s, a, u, l),
            (this.contentAttr = (function fx(e) {
              return "_ngcontent-%COMP%".replace(Lc, e);
            })(l)),
            (this.hostAttr = (function hx(e) {
              return "_nghost-%COMP%".replace(Lc, e);
            })(l));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let mx = (() => {
        class e extends oD {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(at));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const dD = ["alt", "control", "meta", "shift"],
        yx = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        vx = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let Dx = (() => {
        class e extends oD {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Ar().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              dD.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = yx[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                dD.forEach((s) => {
                  s !== o && (0, vx[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(at));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const _x = uv(ZA, "browser", [
          { provide: lr, useValue: "browser" },
          {
            provide: dp,
            useValue: function wx() {
              xc.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: at,
            useFactory: function Ex() {
              return (
                (function gI(e) {
                  _u = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Ix = new I(""),
        pD = [
          {
            provide: Rs,
            useClass: class sx {
              addToWindow(t) {
                (J.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i) throw new w(5103, !1);
                  return i;
                }),
                  (J.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (J.getAllAngularRootElements = () => t.getAllRootElements()),
                  J.frameworkStabilizers || (J.frameworkStabilizers = []),
                  J.frameworkStabilizers.push((r) => {
                    const o = J.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach((u) => {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Ar().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: rv, useClass: Xl, deps: [ie, Jl, Rs] },
          { provide: Xl, useClass: Xl, deps: [ie, Jl, Rs] },
        ],
        gD = [
          { provide: xu, useValue: "root" },
          {
            provide: An,
            useFactory: function Cx() {
              return new An();
            },
            deps: [],
          },
          { provide: Oc, useClass: mx, multi: !0, deps: [at, ie, lr] },
          { provide: Oc, useClass: Dx, multi: !0, deps: [at] },
          uD,
          iD,
          rD,
          { provide: wp, useExisting: uD },
          { provide: class PR {}, useClass: ax, deps: [] },
          [],
        ];
      let Sx = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [{ provide: es, useValue: n.appId }],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(Ix, 12));
            }),
            (e.ɵmod = wn({ type: e })),
            (e.ɵinj = on({ providers: [...gD, ...pD], imports: [MR, QA] })),
            e
          );
        })(),
        mD = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(at));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function Mx() {
                        return new mD(T(at));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      typeof window < "u" && window;
      const { isArray: Ox } = Array,
        { getPrototypeOf: Px, prototype: Fx, keys: Lx } = Object;
      const { isArray: $x } = Array;
      function Vc(...e) {
        const t = Br(e),
          n = (function mC(e) {
            return X(Ea(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: o } = (function kx(e) {
            if (1 === e.length) {
              const t = e[0];
              if (Ox(t)) return { args: t, keys: null };
              if (
                (function jx(e) {
                  return e && "object" == typeof e && Px(e) === Fx;
                })(t)
              ) {
                const n = Lx(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return Se([], t);
        const i = new ge(
          (function Ux(e, t, n = nn) {
            return (r) => {
              wD(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    wD(
                      t,
                      () => {
                        const l = Se(e[u], t);
                        let c = !1;
                        l.subscribe(
                          Ee(
                            r,
                            (d) => {
                              (i[u] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            },
                          ),
                        );
                      },
                      r,
                    );
                },
                r,
              );
            };
          })(
            r,
            t,
            o
              ? (s) =>
                  (function Bx(e, t) {
                    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
                  })(o, s)
              : nn,
          ),
        );
        return n
          ? i.pipe(
              (function Hx(e) {
                return ee((t) =>
                  (function Vx(e, t) {
                    return $x(t) ? e(...t) : e(t);
                  })(e, t),
                );
              })(n),
            )
          : i;
      }
      function wD(e, t, n) {
        e ? $t(n, e, t) : t();
      }
      const Qs = $r(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          },
      );
      function Hc(...e) {
        return (function zx() {
          return Vn(1);
        })()(Se(e, Br(e)));
      }
      function CD(e) {
        return new ge((t) => {
          dt(e()).subscribe(t);
        });
      }
      function Ho(e, t) {
        const n = X(e) ? e : () => e,
          r = (o) => o.error(n());
        return new ge(t ? (o) => t.schedule(r, 0, o) : r);
      }
      function Bc() {
        return Ce((e, t) => {
          let n = null;
          e._refCount++;
          const r = Ee(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class ED extends ge {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            wd(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new nt();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Ee(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown(),
                ),
              ),
            ),
              t.closed && ((this._connection = null), (t = nt.EMPTY));
          }
          return t;
        }
        refCount() {
          return Bc()(this);
        }
      }
      function Nr(e) {
        return e <= 0
          ? () => Et
          : Ce((t, n) => {
              let r = 0;
              t.subscribe(
                Ee(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                }),
              );
            });
      }
      function gn(e, t) {
        return Ce((n, r) => {
          let o = 0;
          n.subscribe(Ee(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function Ys(e) {
        return Ce((t, n) => {
          let r = !1;
          t.subscribe(
            Ee(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              },
            ),
          );
        });
      }
      function _D(e = Wx) {
        return Ce((t, n) => {
          let r = !1;
          t.subscribe(
            Ee(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e())),
            ),
          );
        });
      }
      function Wx() {
        return new Qs();
      }
      function Fn(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? gn((o, i) => e(o, i, r)) : nn,
            Nr(1),
            n ? Ys(t) : _D(() => new Qs()),
          );
      }
      function Bo(e, t) {
        return X(t) ? Ie(e, t, 1) : Ie(e, 1);
      }
      function $e(e, t, n) {
        const r = X(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Ce((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Ee(
                  i,
                  (u) => {
                    var l;
                    null === (l = r.next) || void 0 === l || l.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var l;
                    (a = !1),
                      null === (l = r.error) || void 0 === l || l.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, l;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (l = r.finalize) || void 0 === l || l.call(r);
                  },
                ),
              );
            })
          : nn;
      }
      function Ln(e) {
        return Ce((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            Ee(n, void 0, void 0, (s) => {
              (i = dt(e(s, Ln(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            }),
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function Uc(e) {
        return e <= 0
          ? () => Et
          : Ce((t, n) => {
              let r = [];
              t.subscribe(
                Ee(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  },
                ),
              );
            });
      }
      function zc(e) {
        return Ce((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const V = "primary",
        Uo = Symbol("RouteTitle");
      class Kx {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Rr(e) {
        return new Kx(e);
      }
      function Xx(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function Lt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !ID(e[o], t[o]))) return !1;
        return !0;
      }
      function ID(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function SD(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function mn(e) {
        return (function xx(e) {
          return !!e && (e instanceof ge || (X(e.lift) && X(e.subscribe)));
        })(e)
          ? e
          : Es(e)
          ? Se(Promise.resolve(e))
          : O(e);
      }
      const eO = {
          exact: function TD(e, t, n) {
            if (
              !kn(e.segments, t.segments) ||
              !Ks(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !TD(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: AD,
        },
        bD = {
          exact: function tO(e, t) {
            return Lt(e, t);
          },
          subset: function nO(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => ID(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function MD(e, t, n) {
        return (
          eO[n.paths](e.root, t.root, n.matrixParams) &&
          bD[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function AD(e, t, n) {
        return ND(e, t, t.segments, n);
      }
      function ND(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!kn(o, n) || t.hasChildren() || !Ks(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!kn(e.segments, n) || !Ks(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !AD(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(kn(e.segments, o) && Ks(e.segments, o, r) && e.children[V]) &&
            ND(e.children[V], t, i, r)
          );
        }
      }
      function Ks(e, t, n) {
        return t.every((r, o) => bD[n](e[o].parameters, r.parameters));
      }
      class xr {
        constructor(t = new K([], {}), n = {}, r = null) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Rr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return iO.serialize(this);
        }
      }
      class K {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Xs(this);
        }
      }
      class zo {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Rr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return OD(this);
        }
      }
      function kn(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let Go = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return new Gc();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class Gc {
        parse(t) {
          const n = new mO(t);
          return new xr(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment(),
          );
        }
        serialize(t) {
          const n = `/${Wo(t.root, !0)}`,
            r = (function uO(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${Js(n)}=${Js(o)}`).join("&")
                    : `${Js(n)}=${Js(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function sO(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const iO = new Gc();
      function Xs(e) {
        return e.segments.map((t) => OD(t)).join("/");
      }
      function Wo(e, t) {
        if (!e.hasChildren()) return Xs(e);
        if (t) {
          const n = e.children[V] ? Wo(e.children[V], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([o, i]) => {
              o !== V && r.push(`${o}:${Wo(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function oO(e, t) {
            let n = [];
            return (
              Object.entries(e.children).forEach(([r, o]) => {
                r === V && (n = n.concat(t(o, r)));
              }),
              Object.entries(e.children).forEach(([r, o]) => {
                r !== V && (n = n.concat(t(o, r)));
              }),
              n
            );
          })(e, (r, o) =>
            o === V ? [Wo(e.children[V], !1)] : [`${o}:${Wo(r, !1)}`],
          );
          return 1 === Object.keys(e.children).length && null != e.children[V]
            ? `${Xs(e)}/${n[0]}`
            : `${Xs(e)}/(${n.join("//")})`;
        }
      }
      function RD(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Js(e) {
        return RD(e).replace(/%3B/gi, ";");
      }
      function Wc(e) {
        return RD(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ea(e) {
        return decodeURIComponent(e);
      }
      function xD(e) {
        return ea(e.replace(/\+/g, "%20"));
      }
      function OD(e) {
        return `${Wc(e.path)}${(function aO(e) {
          return Object.keys(e)
            .map((t) => `;${Wc(t)}=${Wc(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const lO = /^[^\/()?;#]+/;
      function qc(e) {
        const t = e.match(lO);
        return t ? t[0] : "";
      }
      const cO = /^[^\/()?;=#]+/,
        fO = /^[^=?&#]+/,
        pO = /^[^&#]+/;
      class mO {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new K([], {})
              : new K([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[V] = new K(t, n)),
            r
          );
        }
        parseSegment() {
          const t = qc(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new w(4009, !1);
          return this.capture(t), new zo(ea(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = (function dO(e) {
            const t = e.match(cO);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = qc(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[ea(n)] = ea(r);
        }
        parseQueryParam(t) {
          const n = (function hO(e) {
            const t = e.match(fO);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function gO(e) {
              const t = e.match(pO);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = xD(n),
            i = xD(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = qc(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new w(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = V);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[V] : new K([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new w(4011, !1);
        }
      }
      function PD(e) {
        return e.segments.length > 0 ? new K([], { [V]: e }) : e;
      }
      function FD(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = FD(e.children[r]);
          if (r === V && 0 === i.segments.length && i.hasChildren())
            for (const [s, a] of Object.entries(i.children)) t[s] = a;
          else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function yO(e) {
          if (1 === e.numberOfChildren && e.children[V]) {
            const t = e.children[V];
            return new K(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new K(e.segments, t));
      }
      function jn(e) {
        return e instanceof xr;
      }
      function LD(e) {
        let t;
        const o = PD(
          (function n(i) {
            const s = {};
            for (const u of i.children) {
              const l = n(u);
              s[u.outlet] = l;
            }
            const a = new K(i.url, s);
            return i === e && (t = a), a;
          })(e.root),
        );
        return t ?? o;
      }
      function kD(e, t, n, r) {
        let o = e;
        for (; o.parent; ) o = o.parent;
        if (0 === t.length) return Zc(o, o, o, n, r);
        const i = (function DO(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new $D(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Object.entries(i.outlets).forEach(([u, l]) => {
                    a[u] = "string" == typeof l ? l.split("/") : l;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new $D(n, t, r);
        })(t);
        if (i.toRoot()) return Zc(o, o, new K([], {}), n, r);
        const s = (function wO(e, t, n) {
            if (e.isAbsolute) return new na(t, !0, 0);
            if (!n) return new na(t, !1, NaN);
            if (null === n.parent) return new na(n, !0, 0);
            const r = ta(e.commands[0]) ? 0 : 1;
            return (function CO(e, t, n) {
              let r = e,
                o = t,
                i = n;
              for (; i > o; ) {
                if (((i -= o), (r = r.parent), !r)) throw new w(4005, !1);
                o = r.segments.length;
              }
              return new na(r, !1, o - i);
            })(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
          })(i, o, e),
          a = s.processChildren
            ? Zo(s.segmentGroup, s.index, i.commands)
            : VD(s.segmentGroup, s.index, i.commands);
        return Zc(o, s.segmentGroup, a, n, r);
      }
      function ta(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function qo(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Zc(e, t, n, r, o) {
        let s,
          i = {};
        r &&
          Object.entries(r).forEach(([u, l]) => {
            i[u] = Array.isArray(l) ? l.map((c) => `${c}`) : `${l}`;
          }),
          (s = e === t ? n : jD(e, t, n));
        const a = PD(FD(s));
        return new xr(a, i, o);
      }
      function jD(e, t, n) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([o, i]) => {
            r[o] = i === t ? n : jD(i, t, n);
          }),
          new K(e.segments, r)
        );
      }
      class $D {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && ta(r[0]))
          )
            throw new w(4003, !1);
          const o = r.find(qo);
          if (o && o !== SD(r)) throw new w(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class na {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function VD(e, t, n) {
        if (
          (e || (e = new K([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Zo(e, t, n);
        const r = (function _O(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (qo(a)) break;
              const u = `${a}`,
                l = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && l && "object" == typeof l && void 0 === l.outlets) {
                if (!BD(u, l, s)) return i;
                r += 2;
              } else {
                if (!BD(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new K(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[V] = new K(e.segments.slice(r.pathIndex), e.children)),
            Zo(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new K(e.segments, {})
          : r.match && !e.hasChildren()
          ? Qc(e, t, n)
          : r.match
          ? Zo(e, 0, o)
          : Qc(e, t, n);
      }
      function Zo(e, t, n) {
        if (0 === n.length) return new K(e.segments, {});
        {
          const r = (function EO(e) {
              return qo(e[0]) ? e[0].outlets : { [V]: e };
            })(n),
            o = {};
          if (
            !r[V] &&
            e.children[V] &&
            1 === e.numberOfChildren &&
            0 === e.children[V].segments.length
          ) {
            const i = Zo(e.children[V], t, n);
            return new K(e.segments, i.children);
          }
          return (
            Object.entries(r).forEach(([i, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (o[i] = VD(e.children[i], t, s));
            }),
            Object.entries(e.children).forEach(([i, s]) => {
              void 0 === r[i] && (o[i] = s);
            }),
            new K(e.segments, o)
          );
        }
      }
      function Qc(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (qo(i)) {
            const u = IO(i.outlets);
            return new K(r, u);
          }
          if (0 === o && ta(n[0])) {
            r.push(new zo(e.segments[t].path, HD(n[0]))), o++;
            continue;
          }
          const s = qo(i) ? i.outlets[V] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && ta(a)
            ? (r.push(new zo(s, HD(a))), (o += 2))
            : (r.push(new zo(s, {})), o++);
        }
        return new K(r, {});
      }
      function IO(e) {
        const t = {};
        return (
          Object.entries(e).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (t[n] = Qc(new K([], {}), 0, r));
          }),
          t
        );
      }
      function HD(e) {
        const t = {};
        return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
      }
      function BD(e, t, n) {
        return e == n.path && Lt(t, n.parameters);
      }
      const Qo = "imperative";
      class kt {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class Yc extends kt {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class $n extends kt {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class ra extends kt {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Yo extends kt {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class Kc extends kt {
        constructor(t, n, r, o) {
          super(t, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class SO extends kt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class bO extends kt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class MO extends kt {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class TO extends kt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class AO extends kt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class NO {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class RO {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class xO {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class OO {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class PO {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class FO {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class UD {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class LO {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new Ko()),
            (this.attachRef = null);
        }
      }
      let Ko = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new LO()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class zD {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Xc(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Xc(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = Jc(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return Jc(t, this._root).map((n) => n.value);
        }
      }
      function Xc(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Xc(e, n);
          if (r) return r;
        }
        return null;
      }
      function Jc(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = Jc(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class en {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Or(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class GD extends zD {
        constructor(t, n) {
          super(t), (this.snapshot = n), ed(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function WD(e, t) {
        const n = (function kO(e, t) {
            const s = new oa([], {}, {}, "", {}, V, t, null, {});
            return new ZD("", new en(s, []));
          })(0, t),
          r = new rt([new zo("", {})]),
          o = new rt({}),
          i = new rt({}),
          s = new rt({}),
          a = new rt(""),
          u = new Pr(r, o, s, a, i, V, t, n.root);
        return (u.snapshot = n.root), new GD(new en(u, []), n);
      }
      class Pr {
        constructor(t, n, r, o, i, s, a, u) {
          (this.urlSubject = t),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = u),
            (this.title =
              this.dataSubject?.pipe(ee((l) => l[Uo])) ?? O(void 0)),
            (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(ee((t) => Rr(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(ee((t) => Rr(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function qD(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function jO(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} },
          );
        })(n.slice(r));
      }
      class oa {
        get title() {
          return this.data?.[Uo];
        }
        constructor(t, n, r, o, i, s, a, u, l) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = u),
            (this._resolve = l);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Rr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Rr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class ZD extends zD {
        constructor(t, n) {
          super(n), (this.url = t), ed(this, n);
        }
        toString() {
          return QD(this._root);
        }
      }
      function ed(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => ed(e, n));
      }
      function QD(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(QD).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function td(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Lt(t.queryParams, n.queryParams) ||
              e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            Lt(t.params, n.params) || e.paramsSubject.next(n.params),
            (function Jx(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Lt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.urlSubject.next(n.url),
            Lt(t.data, n.data) || e.dataSubject.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function nd(e, t) {
        const n =
          Lt(e.params, t.params) &&
          (function rO(e, t) {
            return (
              kn(e, t) && e.every((n, r) => Lt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || nd(e.parent, t.parent))
        );
      }
      let YD = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = V),
              (this.activateEvents = new ke()),
              (this.deactivateEvents = new ke()),
              (this.attachEvents = new ke()),
              (this.detachEvents = new ke()),
              (this.parentContexts = _(Ko)),
              (this.location = _(yt)),
              (this.changeDetector = _(oc)),
              (this.environmentInjector = _(Wt)),
              (this.inputBinder = _(ia, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: o } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new w(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new w(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new w(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new w(4013, !1);
            this._activatedRoute = n;
            const o = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new $O(n, a, o.injector);
            (this.activated = o.createComponent(s, {
              index: o.length,
              injector: u,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = Oe({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [In],
          })),
          e
        );
      })();
      class $O {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === Pr
            ? this.route
            : t === Ko
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      const ia = new I("");
      let KD = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              o = Vc([r.queryParams, r.params, r.data])
                .pipe(
                  _t(
                    ([i, s, a], u) => (
                      (a = { ...i, ...s, ...a }),
                      0 === u ? O(a) : Promise.resolve(a)
                    ),
                  ),
                )
                .subscribe((i) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function iN(e) {
                    const t = Z(e);
                    if (!t) return null;
                    const n = new Eo(t);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return t.standalone;
                      },
                      get isSignal() {
                        return t.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      n.activatedComponentRef.setInput(a, i[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Xo(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function HO(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Xo(e, r, o);
              return Xo(e, r);
            });
          })(e, t, n);
          return new en(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Xo(e, a))),
                s
              );
            }
          }
          const r = (function BO(e) {
              return new Pr(
                new rt(e.url),
                new rt(e.params),
                new rt(e.queryParams),
                new rt(e.fragment),
                new rt(e.data),
                e.outlet,
                e.component,
                e,
              );
            })(t.value),
            o = t.children.map((i) => Xo(e, i));
          return new en(r, o);
        }
      }
      const rd = "ngNavigationCancelingError";
      function XD(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = jn(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          o = JD(!1, 0, t);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function JD(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[rd] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function ew(e) {
        return tw(e) && jn(e.url);
      }
      function tw(e) {
        return e && e[rd];
      }
      let nw = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Fa({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [ry],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && pl(0, "router-outlet");
            },
            dependencies: [YD],
            encapsulation: 2,
          })),
          e
        );
      })();
      function od(e) {
        const t = e.children && e.children.map(od),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== V &&
            (n.component = nw),
          n
        );
      }
      function Ct(e) {
        return e.outlet || V;
      }
      function Jo(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class QO {
        constructor(t, n, r, o, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o),
            (this.inputBindingEnabled = i);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            td(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = Or(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Object.values(o).forEach((i) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = Or(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = Or(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = Or(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new FO(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new OO(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((td(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                td(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Jo(o.snapshot);
              (s.attachRef = null),
                (s.route = o),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class rw {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class sa {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function YO(e, t, n) {
        const r = e._root;
        return ei(r, t ? t._root : null, n, [r.value]);
      }
      function Fr(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function OC(e) {
              return null !== ci(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function ei(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] },
      ) {
        const i = Or(t);
        return (
          e.children.forEach((s) => {
            (function XO(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] },
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function JO(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !kn(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !kn(e.url, t.url) || !Lt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !nd(e, t) || !Lt(e.queryParams, t.queryParams);
                    default:
                      return !nd(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new rw(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  ei(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new sa(a.outlet.component, s));
              } else
                s && ti(t, a, o),
                  o.canActivateChecks.push(new rw(r)),
                  ei(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Object.entries(i).forEach(([s, a]) => ti(a, n.getContext(s), o)),
          o
        );
      }
      function ti(e, t, n) {
        const r = Or(e),
          o = e.value;
        Object.entries(r).forEach(([i, s]) => {
          ti(s, o.component ? (t ? t.children.getContext(i) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new sa(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o,
            ),
          );
      }
      function ni(e) {
        return "function" == typeof e;
      }
      function ow(e) {
        return e instanceof Qs || "EmptyError" === e?.name;
      }
      const aa = Symbol("INITIAL_VALUE");
      function Lr() {
        return _t((e) =>
          Vc(
            e.map((t) =>
              t.pipe(
                Nr(1),
                (function Gx(...e) {
                  const t = Br(e);
                  return Ce((n, r) => {
                    (t ? Hc(e, n, t) : Hc(e, n)).subscribe(r);
                  });
                })(aa),
              ),
            ),
          ).pipe(
            ee((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === aa) return aa;
                  if (!1 === n || n instanceof xr) return n;
                }
              return !0;
            }),
            gn((t) => t !== aa),
            Nr(1),
          ),
        );
      }
      function iw(e) {
        return (function Pw(...e) {
          return yd(e);
        })(
          $e((t) => {
            if (jn(t)) throw XD(0, t);
          }),
          ee((t) => !0 === t),
        );
      }
      class ua {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class sw {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function kr(e) {
        return Ho(new ua(e));
      }
      function aw(e) {
        return Ho(new sw(e));
      }
      class DP {
        constructor(t, n) {
          (this.urlSerializer = t), (this.urlTree = n);
        }
        noMatchError(t) {
          return new w(4002, !1);
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return O(r);
            if (o.numberOfChildren > 1 || !o.children[V])
              return Ho(new w(4e3, !1));
            o = o.children[V];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r,
          );
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new xr(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment,
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Object.entries(t).forEach(([o, i]) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = n[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, u]) => {
              s[a] = this.createSegmentGroup(t, u, r, o);
            }),
            new K(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r),
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new w(4001, !1);
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      const id = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function wP(e, t, n, r, o) {
        const i = sd(e, t, n);
        return i.matched
          ? ((r = (function UO(e, t) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = xl(e.providers, t, `Route: ${e.path}`)),
                e._injector ?? t
              );
            })(t, r)),
            (function mP(e, t, n, r) {
              const o = t.canMatch;
              return o && 0 !== o.length
                ? O(
                    o.map((s) => {
                      const a = Fr(s, e);
                      return mn(
                        (function iP(e) {
                          return e && ni(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n)),
                      );
                    }),
                  ).pipe(Lr(), iw())
                : O(!0);
            })(r, t, n).pipe(ee((s) => (!0 === s ? i : { ...id }))))
          : O(i);
      }
      function sd(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...id }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || Xx)(n, e, t);
        if (!o) return { ...id };
        const i = {};
        Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
          i[a] = u.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function uw(e, t, n, r) {
        return n.length > 0 &&
          (function _P(e, t, n) {
            return n.some((r) => la(e, t, r) && Ct(r) !== V);
          })(e, n, r)
          ? {
              segmentGroup: new K(t, EP(r, new K(n, e.children))),
              slicedSegments: [],
            }
          : 0 === n.length &&
            (function IP(e, t, n) {
              return n.some((r) => la(e, t, r));
            })(e, n, r)
          ? {
              segmentGroup: new K(e.segments, CP(e, 0, n, r, e.children)),
              slicedSegments: n,
            }
          : { segmentGroup: new K(e.segments, e.children), slicedSegments: n };
      }
      function CP(e, t, n, r, o) {
        const i = {};
        for (const s of r)
          if (la(e, n, s) && !o[Ct(s)]) {
            const a = new K([], {});
            i[Ct(s)] = a;
          }
        return { ...o, ...i };
      }
      function EP(e, t) {
        const n = {};
        n[V] = t;
        for (const r of e)
          if ("" === r.path && Ct(r) !== V) {
            const o = new K([], {});
            n[Ct(r)] = o;
          }
        return n;
      }
      function la(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      class TP {
        constructor(t, n, r, o, i, s, a) {
          (this.injector = t),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = o),
            (this.urlTree = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new DP(this.urlSerializer, this.urlTree));
        }
        noMatchError(t) {
          return new w(4002, !1);
        }
        recognize() {
          const t = uw(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            V,
          ).pipe(
            Ln((n) => {
              if (n instanceof sw)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = n.urlTree),
                  this.match(n.urlTree)
                );
              throw n instanceof ua ? this.noMatchError(n) : n;
            }),
            ee((n) => {
              const r = new oa(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  V,
                  this.rootComponentType,
                  null,
                  {},
                ),
                o = new en(r, n),
                i = new ZD("", o),
                s = (function vO(e, t, n = null, r = null) {
                  return kD(LD(e), t, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (i.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(i._root),
                { state: i, tree: s }
              );
            }),
          );
        }
        match(t) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t.root,
            V,
          ).pipe(
            Ln((r) => {
              throw r instanceof ua ? this.noMatchError(r) : r;
            }),
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = qD(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, o, !0);
        }
        processChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return Se(o).pipe(
            Bo((i) => {
              const s = r.children[i],
                a = (function qO(e, t) {
                  const n = e.filter((r) => Ct(r) === t);
                  return n.push(...e.filter((r) => Ct(r) !== t)), n;
                })(n, i);
              return this.processSegmentGroup(t, a, s, i);
            }),
            (function Zx(e, t) {
              return Ce(
                (function qx(e, t, n, r, o) {
                  return (i, s) => {
                    let a = n,
                      u = t,
                      l = 0;
                    i.subscribe(
                      Ee(
                        s,
                        (c) => {
                          const d = l++;
                          (u = a ? e(u, c, d) : ((a = !0), c)), r && s.next(u);
                        },
                        o &&
                          (() => {
                            a && s.next(u), s.complete();
                          }),
                      ),
                    );
                  };
                })(e, t, arguments.length >= 2, !0),
              );
            })((i, s) => (i.push(...s), i)),
            Ys(null),
            (function Qx(e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? gn((o, i) => e(o, i, r)) : nn,
                  Uc(1),
                  n ? Ys(t) : _D(() => new Qs()),
                );
            })(),
            Ie((i) => {
              if (null === i) return kr(r);
              const s = lw(i);
              return (
                (function AP(e) {
                  e.sort((t, n) =>
                    t.value.outlet === V
                      ? -1
                      : n.value.outlet === V
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet),
                  );
                })(s),
                O(s)
              );
            }),
          );
        }
        processSegment(t, n, r, o, i, s) {
          return Se(n).pipe(
            Bo((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? t,
                n,
                a,
                r,
                o,
                i,
                s,
              ).pipe(
                Ln((u) => {
                  if (u instanceof ua) return O(null);
                  throw u;
                }),
              ),
            ),
            Fn((a) => !!a),
            Ln((a) => {
              if (ow(a))
                return (function bP(e, t, n) {
                  return 0 === t.length && !e.children[n];
                })(r, o, i)
                  ? O([])
                  : kr(r);
              throw a;
            }),
          );
        }
        processSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return (function SP(e, t, n, r) {
            return (
              !!(Ct(e) === r || (r !== V && la(t, n, e))) &&
              ("**" === e.path || sd(t, e, n).matched)
            );
          })(r, o, i, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s)
              : kr(o)
            : kr(o);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s,
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {},
          );
          return r.redirectTo.startsWith("/")
            ? aw(i)
            : this.applyRedirects.lineralizeSegments(r, i).pipe(
                Ie((s) => {
                  const a = new K(s, {});
                  return this.processSegment(t, n, a, s, o, !1);
                }),
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: l,
            positionalParamSegments: c,
          } = sd(n, o, i);
          if (!a) return kr(n);
          const d = this.applyRedirects.applyRedirectCommands(
            u,
            o.redirectTo,
            c,
          );
          return o.redirectTo.startsWith("/")
            ? aw(d)
            : this.applyRedirects
                .lineralizeSegments(o, d)
                .pipe(
                  Ie((f) => this.processSegment(t, r, n, f.concat(l), s, !1)),
                );
        }
        matchSegmentAgainstRoute(t, n, r, o, i, s) {
          let a;
          if ("**" === r.path) {
            const u = o.length > 0 ? SD(o).parameters : {};
            (a = O({
              snapshot: new oa(
                o,
                u,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                cw(r),
                Ct(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                dw(r),
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = wP(n, r, o, t).pipe(
              ee(
                ({
                  matched: u,
                  consumedSegments: l,
                  remainingSegments: c,
                  parameters: d,
                }) =>
                  u
                    ? {
                        snapshot: new oa(
                          l,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          cw(r),
                          Ct(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          dw(r),
                        ),
                        consumedSegments: l,
                        remainingSegments: c,
                      }
                    : null,
              ),
            );
          return a.pipe(
            _t((u) =>
              null === u
                ? kr(n)
                : this.getChildConfig((t = r._injector ?? t), r, o).pipe(
                    _t(({ routes: l }) => {
                      const c = r._loadedInjector ?? t,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = u,
                        { segmentGroup: p, slicedSegments: g } = uw(n, f, h, l);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(c, l, p).pipe(
                          ee((D) => (null === D ? null : [new en(d, D)])),
                        );
                      if (0 === l.length && 0 === g.length)
                        return O([new en(d, [])]);
                      const v = Ct(r) === i;
                      return this.processSegment(
                        c,
                        l,
                        p,
                        g,
                        v ? V : i,
                        !0,
                      ).pipe(ee((D) => [new en(d, D)]));
                    }),
                  ),
            ),
          );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? O({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? O({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function gP(e, t, n, r) {
                  const o = t.canLoad;
                  return void 0 === o || 0 === o.length
                    ? O(!0)
                    : O(
                        o.map((s) => {
                          const a = Fr(s, e);
                          return mn(
                            (function tP(e) {
                              return e && ni(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n)),
                          );
                        }),
                      ).pipe(Lr(), iw());
                })(t, n, r).pipe(
                  Ie((o) =>
                    o
                      ? this.configLoader.loadChildren(t, n).pipe(
                          $e((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          }),
                        )
                      : (function vP(e) {
                          return Ho(JD(!1, 3));
                        })(),
                  ),
                )
            : O({ routes: [], injector: t });
        }
      }
      function NP(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path;
      }
      function lw(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!NP(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = lw(r.children);
          t.push(new en(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function cw(e) {
        return e.data || {};
      }
      function dw(e) {
        return e.resolve || {};
      }
      function fw(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function ad(e) {
        return _t((t) => {
          const n = e(t);
          return n ? Se(n).pipe(ee(() => t)) : O(t);
        });
      }
      const jr = new I("ROUTES");
      let ud = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = _(Qy));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return O(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = mn(n.loadComponent()).pipe(
                ee(hw),
                $e((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                zc(() => {
                  this.componentLoaders.delete(n);
                }),
              ),
              o = new ED(r, () => new jt()).pipe(Bc());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return O({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                ee((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let u, l;
                  return (
                    Array.isArray(a)
                      ? (l = a)
                      : ((u = a.create(n).injector),
                        (l = u.get(jr, [], b.Self | b.Optional).flat())),
                    { routes: l.map(od), injector: u }
                  );
                }),
                zc(() => {
                  this.childrenLoaders.delete(r);
                }),
              ),
              s = new ED(i, () => new jt()).pipe(Bc());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return mn(n()).pipe(
              ee(hw),
              Ie((r) =>
                r instanceof ty || Array.isArray(r)
                  ? O(r)
                  : Se(this.compiler.compileModuleAsync(r)),
              ),
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function hw(e) {
        return (function kP(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let ca = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new jt()),
              (this.configLoader = _(ud)),
              (this.environmentInjector = _(Wt)),
              (this.urlSerializer = _(Go)),
              (this.rootContexts = _(Ko)),
              (this.inputBindingEnabled = null !== _(ia, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => O(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new RO(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new NO(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new rt({
                id: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(
                  n.currentUrlTree,
                ),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Qo,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                gn((r) => 0 !== r.id),
                ee((r) => ({
                  ...r,
                  extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl),
                })),
                _t((r) => {
                  let o = !1,
                    i = !1;
                  return O(r).pipe(
                    $e((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    _t((s) => {
                      const a = n.browserUrlTree.toString(),
                        u =
                          !n.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== n.currentUrlTree.toString();
                      if (
                        !u &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const c = "";
                        return (
                          this.events.next(
                            new Yo(s.id, n.serializeUrl(r.rawUrl), c, 0),
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          Et
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          pw(s.source) && (n.browserUrlTree = s.extractedUrl),
                          O(s).pipe(
                            _t((c) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Yc(
                                    c.id,
                                    this.urlSerializer.serialize(
                                      c.extractedUrl,
                                    ),
                                    c.source,
                                    c.restoredState,
                                  ),
                                ),
                                d !== this.transitions?.getValue()
                                  ? Et
                                  : Promise.resolve(c)
                              );
                            }),
                            (function RP(e, t, n, r, o, i) {
                              return Ie((s) =>
                                (function MP(
                                  e,
                                  t,
                                  n,
                                  r,
                                  o,
                                  i,
                                  s = "emptyOnly",
                                ) {
                                  return new TP(
                                    e,
                                    t,
                                    n,
                                    r,
                                    o,
                                    s,
                                    i,
                                  ).recognize();
                                })(e, t, n, r, s.extractedUrl, o, i).pipe(
                                  ee(({ state: a, tree: u }) => ({
                                    ...s,
                                    targetSnapshot: a,
                                    urlAfterRedirects: u,
                                  })),
                                ),
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy,
                            ),
                            $e((c) => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                (r.urlAfterRedirects = c.urlAfterRedirects),
                                (this.currentNavigation = {
                                  ...this.currentNavigation,
                                  finalUrl: c.urlAfterRedirects,
                                }),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(
                                    c.urlAfterRedirects,
                                    c.rawUrl,
                                  );
                                  n.setBrowserUrl(f, c);
                                }
                                n.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new SO(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(
                                  c.urlAfterRedirects,
                                ),
                                c.targetSnapshot,
                              );
                              this.events.next(d);
                            }),
                          )
                        );
                      if (
                        u &&
                        n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)
                      ) {
                        const {
                            id: c,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: p,
                          } = s,
                          g = new Yc(c, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const v = WD(0, this.rootComponentType).snapshot;
                        return O(
                          (r = {
                            ...s,
                            targetSnapshot: v,
                            urlAfterRedirects: d,
                            extras: {
                              ...p,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          }),
                        );
                      }
                      {
                        const c = "";
                        return (
                          this.events.next(
                            new Yo(s.id, n.serializeUrl(r.extractedUrl), c, 1),
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          Et
                        );
                      }
                    }),
                    $e((s) => {
                      const a = new bO(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                      );
                      this.events.next(a);
                    }),
                    ee(
                      (s) =>
                        (r = {
                          ...s,
                          guards: YO(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts,
                          ),
                        }),
                    ),
                    (function aP(e, t) {
                      return Ie((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === i.length
                          ? O({ ...n, guardsResult: !0 })
                          : (function uP(e, t, n, r) {
                              return Se(e).pipe(
                                Ie((o) =>
                                  (function pP(e, t, n, r, o) {
                                    const i =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? O(
                                          i.map((a) => {
                                            const u = Jo(t) ?? o,
                                              l = Fr(a, u);
                                            return mn(
                                              (function oP(e) {
                                                return e && ni(e.canDeactivate);
                                              })(l)
                                                ? l.canDeactivate(e, t, n, r)
                                                : u.runInContext(() =>
                                                    l(e, t, n, r),
                                                  ),
                                            ).pipe(Fn());
                                          }),
                                        ).pipe(Lr())
                                      : O(!0);
                                  })(o.component, o.route, n, t, r),
                                ),
                                Fn((o) => !0 !== o, !0),
                              );
                            })(s, r, o, e).pipe(
                              Ie((a) =>
                                a &&
                                (function eP(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function lP(e, t, n, r) {
                                      return Se(t).pipe(
                                        Bo((o) =>
                                          Hc(
                                            (function dP(e, t) {
                                              return (
                                                null !== e && t && t(new xO(e)),
                                                O(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function cP(e, t) {
                                              return (
                                                null !== e && t && t(new PO(e)),
                                                O(!0)
                                              );
                                            })(o.route, r),
                                            (function hP(e, t, n) {
                                              const r = t[t.length - 1],
                                                i = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function KO(e) {
                                                      const t = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: e, guards: t }
                                                        : null;
                                                    })(s),
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    CD(() =>
                                                      O(
                                                        s.guards.map((u) => {
                                                          const l =
                                                              Jo(s.node) ?? n,
                                                            c = Fr(u, l);
                                                          return mn(
                                                            (function rP(e) {
                                                              return (
                                                                e &&
                                                                ni(
                                                                  e.canActivateChild,
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  r,
                                                                  e,
                                                                )
                                                              : l.runInContext(
                                                                  () => c(r, e),
                                                                ),
                                                          ).pipe(Fn());
                                                        }),
                                                      ).pipe(Lr()),
                                                    ),
                                                  );
                                              return O(i).pipe(Lr());
                                            })(e, o.path, n),
                                            (function fP(e, t, n) {
                                              const r = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return O(!0);
                                              const o = r.map((i) =>
                                                CD(() => {
                                                  const s = Jo(t) ?? n,
                                                    a = Fr(i, s);
                                                  return mn(
                                                    (function nP(e) {
                                                      return (
                                                        e && ni(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : s.runInContext(() =>
                                                          a(t, e),
                                                        ),
                                                  ).pipe(Fn());
                                                }),
                                              );
                                              return O(o).pipe(Lr());
                                            })(e, o.route, n),
                                          ),
                                        ),
                                        Fn((o) => !0 !== o, !0),
                                      );
                                    })(r, i, e, t)
                                  : O(a),
                              ),
                              ee((a) => ({ ...n, guardsResult: a })),
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    $e((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), jn(s.guardsResult))
                      )
                        throw XD(0, s.guardsResult);
                      const a = new MO(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult,
                      );
                      this.events.next(a);
                    }),
                    gn(
                      (s) =>
                        !!s.guardsResult ||
                        (n.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1),
                    ),
                    ad((s) => {
                      if (s.guards.canActivateChecks.length)
                        return O(s).pipe(
                          $e((a) => {
                            const u = new TO(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot,
                            );
                            this.events.next(u);
                          }),
                          _t((a) => {
                            let u = !1;
                            return O(a).pipe(
                              (function xP(e, t) {
                                return Ie((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = n;
                                  if (!o.length) return O(n);
                                  let i = 0;
                                  return Se(o).pipe(
                                    Bo((s) =>
                                      (function OP(e, t, n, r) {
                                        const o = e.routeConfig,
                                          i = e._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !fw(o) &&
                                            (i[Uo] = o.title),
                                          (function PP(e, t, n, r) {
                                            const o = (function FP(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e,
                                                ),
                                              ];
                                            })(e);
                                            if (0 === o.length) return O({});
                                            const i = {};
                                            return Se(o).pipe(
                                              Ie((s) =>
                                                (function LP(e, t, n, r) {
                                                  const o = Jo(t) ?? r,
                                                    i = Fr(e, o);
                                                  return mn(
                                                    i.resolve
                                                      ? i.resolve(t, n)
                                                      : o.runInContext(() =>
                                                          i(t, n),
                                                        ),
                                                  );
                                                })(e[s], t, n, r).pipe(
                                                  Fn(),
                                                  $e((a) => {
                                                    i[s] = a;
                                                  }),
                                                ),
                                              ),
                                              Uc(1),
                                              (function Yx(e) {
                                                return ee(() => e);
                                              })(i),
                                              Ln((s) => (ow(s) ? Et : Ho(s))),
                                            );
                                          })(i, e, t, r).pipe(
                                            ee(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = qD(e, n).resolve),
                                                o &&
                                                  fw(o) &&
                                                  (e.data[Uo] = o.title),
                                                null
                                              ),
                                            ),
                                          )
                                        );
                                      })(s.route, r, e, t),
                                    ),
                                    $e(() => i++),
                                    Uc(1),
                                    Ie((s) => (i === o.length ? O(n) : Et)),
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector,
                              ),
                              $e({
                                next: () => (u = !0),
                                complete: () => {
                                  u ||
                                    (n.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              }),
                            );
                          }),
                          $e((a) => {
                            const u = new AO(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot,
                            );
                            this.events.next(u);
                          }),
                        );
                    }),
                    ad((s) => {
                      const a = (u) => {
                        const l = [];
                        u.routeConfig?.loadComponent &&
                          !u.routeConfig._loadedComponent &&
                          l.push(
                            this.configLoader.loadComponent(u.routeConfig).pipe(
                              $e((c) => {
                                u.component = c;
                              }),
                              ee(() => {}),
                            ),
                          );
                        for (const c of u.children) l.push(...a(c));
                        return l;
                      };
                      return Vc(a(s.targetSnapshot.root)).pipe(Ys(), Nr(1));
                    }),
                    ad(() => this.afterPreactivation()),
                    ee((s) => {
                      const a = (function VO(e, t, n) {
                        const r = Xo(e, t._root, n ? n._root : void 0);
                        return new GD(r, t);
                      })(
                        n.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState,
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    $e((s) => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl,
                        )),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((e, t, n, r) =>
                      ee(
                        (o) => (
                          new QO(
                            t,
                            o.targetRouterState,
                            o.currentRouterState,
                            n,
                            r,
                          ).activate(e),
                          o
                        ),
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (s) => this.events.next(s),
                      this.inputBindingEnabled,
                    ),
                    Nr(1),
                    $e({
                      next: (s) => {
                        (o = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new $n(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree),
                            ),
                          ),
                          n.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot,
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        o = !0;
                      },
                    }),
                    zc(() => {
                      o || i || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Ln((s) => {
                      if (((i = !0), tw(s))) {
                        ew(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new ra(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode,
                        );
                        if ((this.events.next(a), ew(s))) {
                          const u = n.urlHandlingStrategy.merge(
                              s.url,
                              n.rawUrlTree,
                            ),
                            l = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === n.urlUpdateStrategy || pw(r.source),
                            };
                          n.scheduleNavigation(u, Qo, null, l, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new Kc(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0,
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (u) {
                          r.reject(u);
                        }
                      }
                      return Et;
                    }),
                  );
                }),
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new ra(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              o,
            );
            this.events.next(i), n.resolve(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function pw(e) {
        return e !== Qo;
      }
      let gw = (() => {
          class e {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === V));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Uo];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return _(jP);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        jP = (() => {
          class e extends gw {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(mD));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        $P = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return _(HP);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class VP {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      }
      let HP = (() => {
        class e extends VP {}
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (
                t ||
                (t = (function th(e) {
                  return Vt(() => {
                    const t = e.prototype.constructor,
                      n = t[Ht] || ru(t),
                      r = Object.prototype;
                    let o = Object.getPrototypeOf(e.prototype).constructor;
                    for (; o && o !== r; ) {
                      const i = o[Ht] || ru(o);
                      if (i && i !== n) return i;
                      o = Object.getPrototypeOf(o);
                    }
                    return (i) => new i();
                  });
                })(e))
              )(r || e);
            };
          })()),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const da = new I("", { providedIn: "root", factory: () => ({}) });
      let BP = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return _(UP);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        UP = (() => {
          class e {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      var tt = (() => (
        ((tt = tt || {})[(tt.COMPLETE = 0)] = "COMPLETE"),
        (tt[(tt.FAILED = 1)] = "FAILED"),
        (tt[(tt.REDIRECTING = 2)] = "REDIRECTING"),
        tt
      ))();
      function mw(e, t) {
        e.events
          .pipe(
            gn(
              (n) =>
                n instanceof $n ||
                n instanceof ra ||
                n instanceof Kc ||
                n instanceof Yo,
            ),
            ee((n) =>
              n instanceof $n || n instanceof Yo
                ? tt.COMPLETE
                : n instanceof ra && (0 === n.code || 1 === n.code)
                ? tt.REDIRECTING
                : tt.FAILED,
            ),
            gn((n) => n !== tt.REDIRECTING),
            Nr(1),
          )
          .subscribe(() => {
            t();
          });
      }
      function zP(e) {
        throw e;
      }
      function GP(e, t, n) {
        return t.parse("/");
      }
      const WP = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        qP = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let ct = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            if ("computed" === this.canceledNavigationResolution)
              return this.location.getState()?.ɵrouterPageId;
          }
          get events() {
            return this.navigationTransitions.events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = _(qy)),
              (this.isNgZoneEnabled = !1),
              (this.options = _(da, { optional: !0 }) || {}),
              (this.pendingTasks = _(Zy)),
              (this.errorHandler = this.options.errorHandler || zP),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || GP),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = _(BP)),
              (this.routeReuseStrategy = _($P)),
              (this.titleStrategy = _(gw)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = _(jr, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = _(ca)),
              (this.urlSerializer = _(Go)),
              (this.location = _(gc)),
              (this.componentInputBindingEnabled = !!_(ia, { optional: !0 })),
              (this.isNgZoneEnabled =
                _(ie) instanceof ie && ie.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new xr()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = WD(0, null)),
              this.navigationTransitions.setupNavigations(this).subscribe(
                (n) => {
                  (this.lastSuccessfulId = n.id),
                    (this.currentPageId = this.browserPageId ?? 0);
                },
                (n) => {
                  this.console.warn(`Unhandled Navigation Error: ${n}`);
                },
              );
          }
          resetRootComponentType(n) {
            (this.routerState.root.component = n),
              (this.navigationTransitions.rootComponentType = n);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const n = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Qo, n);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(n.url, r, n.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(n, r, o) {
            const i = { replaceUrl: !0 },
              s = o?.navigationId ? o : null;
            if (o) {
              const u = { ...o };
              delete u.navigationId,
                delete u.ɵrouterPageId,
                0 !== Object.keys(u).length && (i.state = u);
            }
            const a = this.parseUrl(n);
            this.scheduleNavigation(a, r, s, i);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(n) {
            (this.config = n.map(od)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              l = u ? this.currentUrlTree.fragment : s;
            let d,
              c = null;
            switch (a) {
              case "merge":
                c = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                c = this.currentUrlTree.queryParams;
                break;
              default:
                c = i || null;
            }
            null !== c && (c = this.removeEmptyProps(c));
            try {
              d = LD(o ? o.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                (d = this.currentUrlTree.root);
            }
            return kD(d, n, c, l ?? null);
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = jn(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, Qo, null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function ZP(e) {
                for (let t = 0; t < e.length; t++)
                  if (null == e[t]) throw new w(4008, !1);
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (((o = !0 === r ? { ...WP } : !1 === r ? { ...qP } : r), jn(n)))
              return MD(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return MD(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          scheduleNavigation(n, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, l;
            s
              ? ((a = s.resolve), (u = s.reject), (l = s.promise))
              : (l = new Promise((d, f) => {
                  (a = d), (u = f);
                }));
            const c = this.pendingTasks.add();
            return (
              mw(this, () => {
                queueMicrotask(() => this.pendingTasks.remove(c));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: u,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              l.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
              const s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId),
              };
              this.location.replaceState(o, "", s);
            } else {
              const i = {
                ...r.extras.state,
                ...this.generateNgRouterState(
                  r.id,
                  (this.browserPageId ?? 0) + 1,
                ),
              };
              this.location.go(o, "", i);
            }
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i =
                this.currentPageId - (this.browserPageId ?? this.currentPageId);
              0 !== i
                ? this.location.historyGo(i)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl,
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId,
              ),
            );
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class yw {}
      let KP = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                gn((n) => n instanceof $n),
                Bo(() => this.preload()),
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = xl(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return Se(o).pipe(Vn());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : O(null);
              const i = o.pipe(
                Ie((s) =>
                  null === s
                    ? O(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes)),
                ),
              );
              return r.loadComponent && !r._loadedComponent
                ? Se([i, this.loader.loadComponent(r)]).pipe(Vn())
                : i;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(ct), T(Qy), T(Wt), T(yw), T(ud));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const cd = new I("");
      let vw = (() => {
        class e {
          constructor(n, r, o, i, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Yc
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof $n
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment,
                  ))
                : n instanceof Yo &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment,
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof UD &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new UD(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r,
                    ),
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            !(function jp() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function tn(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function ww() {
        const e = _(Zt);
        return (t) => {
          const n = e.get(Tr);
          if (t !== n.components[0]) return;
          const r = e.get(ct),
            o = e.get(Cw);
          1 === e.get(dd) && r.initialNavigation(),
            e.get(Ew, null, b.Optional)?.setUpPreloading(),
            e.get(cd, null, b.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const Cw = new I("", { factory: () => new jt() }),
        dd = new I("", { providedIn: "root", factory: () => 1 }),
        Ew = new I("");
      function t1(e) {
        return tn(0, [
          { provide: Ew, useExisting: KP },
          { provide: yw, useExisting: e },
        ]);
      }
      const _w = new I("ROUTER_FORROOT_GUARD"),
        r1 = [
          gc,
          { provide: Go, useClass: Gc },
          ct,
          Ko,
          {
            provide: Pr,
            useFactory: function Dw(e) {
              return e.routerState.root;
            },
            deps: [ct],
          },
          ud,
          [],
        ];
      function o1() {
        return new sv("Router", ct);
      }
      let Iw = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                r1,
                [],
                { provide: jr, multi: !0, useValue: n },
                {
                  provide: _w,
                  useFactory: u1,
                  deps: [[ct, new Li(), new ki()]],
                },
                { provide: da, useValue: r || {} },
                r?.useHash
                  ? { provide: Pn, useClass: cN }
                  : { provide: Pn, useClass: Pv },
                {
                  provide: cd,
                  useFactory: () => {
                    const e = _(RR),
                      t = _(ie),
                      n = _(da),
                      r = _(ca),
                      o = _(Go);
                    return (
                      n.scrollOffset && e.setOffset(n.scrollOffset),
                      new vw(o, r, e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? t1(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: sv, multi: !0, useFactory: o1 },
                r?.initialNavigation ? l1(r) : [],
                r?.bindToComponentInputs
                  ? tn(8, [KD, { provide: ia, useExisting: KD }]).ɵproviders
                  : [],
                [
                  { provide: Sw, useFactory: ww },
                  { provide: nc, multi: !0, useExisting: Sw },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: e,
              providers: [{ provide: jr, multi: !0, useValue: n }],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(_w, 8));
          }),
          (e.ɵmod = wn({ type: e })),
          (e.ɵinj = on({})),
          e
        );
      })();
      function u1(e) {
        return "guarded";
      }
      function l1(e) {
        return [
          "disabled" === e.initialNavigation
            ? tn(3, [
                {
                  provide: Zl,
                  multi: !0,
                  useFactory: () => {
                    const t = _(ct);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: dd, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? tn(2, [
                { provide: dd, useValue: 0 },
                {
                  provide: Zl,
                  multi: !0,
                  deps: [Zt],
                  useFactory: (t) => {
                    const n = t.get(uN, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const o = t.get(ct),
                              i = t.get(Cw);
                            mw(o, () => {
                              r(!0);
                            }),
                              (t.get(ca).afterPreactivation = () => (
                                r(!0), i.closed ? O(void 0) : i
                              )),
                              o.initialNavigation();
                          }),
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const Sw = new I(""),
        d1 = [];
      let f1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = wn({ type: e })),
            (e.ɵinj = on({ imports: [Iw.forRoot(d1), Iw] })),
            e
          );
        })(),
        h1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Fa({
              type: e,
              selectors: [["app-root"]],
              decls: 2,
              vars: 0,
              template: function (n, r) {
                1 & n &&
                  (ws(0, "h1"),
                  (function im(e, t = "") {
                    const n = y(),
                      r = G(),
                      o = e + U,
                      i = r.firstCreatePass ? fr(r, o, 1, t, null) : r.data[o],
                      s = sm(r, n, i, t, e);
                    (n[o] = s), Ii() && qi(r, n, s, i), Nt(i, !1);
                  })(
                    1,
                    "\u05e7\u05e8\u05e0\u05d9 \u05e8\u05d5\u05d1\u05d9\u05df",
                  ),
                  Cs());
              },
            })),
            e
          );
        })(),
        p1 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = wn({ type: e, bootstrap: [h1] })),
            (e.ɵinj = on({ imports: [Sx, f1] })),
            e
          );
        })();
      _x()
        .bootstrapModule(p1)
        .catch((e) => console.error(e));
    },
  },
  (X) => {
    X((X.s = 654));
  },
]);

/**
* Muuri v0.9.3
* https://muuri.dev/
* Copyright (c) 2015-present, Haltu Oy
* Released under the MIT license
* https://github.com/haltu/muuri/blob/master/LICENSE.md
* @license MIT
*
* Muuri Packer
* Copyright (c) 2016-present, Niklas Rämö <inramo@gmail.com>
* @license MIT
*
* Muuri Ticker / Muuri Emitter / Muuri Dragger
* Copyright (c) 2018-present, Niklas Rämö <inramo@gmail.com>
* @license MIT
*
* Muuri AutoScroller
* Copyright (c) 2019-present, Niklas Rämö <inramo@gmail.com>
* @license MIT
*/
!function(t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Muuri = e()
}(this, (function() {
  "use strict";
  var t = {}
    , e = "function" == typeof Map ? new Map : null
    , i = "ontouchstart"in window
    , s = !!window.PointerEvent
    , n = !!window.navigator.msPointerEnabled;
  function r() {
      this._events = {},
      this._queue = [],
      this._counter = 0,
      this._clearOnEmit = !1
  }
  r.prototype.on = function(t, e) {
      if (!this._events || !t || !e)
          return this;
      var i = this._events[t];
      return i || (i = this._events[t] = []),
      i.push(e),
      this
  }
  ,
  r.prototype.off = function(t, e) {
      if (!this._events || !t || !e)
          return this;
      var i, s = this._events[t];
      if (!s || !s.length)
          return this;
      for (; -1 !== (i = s.indexOf(e)); )
          s.splice(i, 1);
      return this
  }
  ,
  r.prototype.clear = function(t) {
      if (!this._events || !t)
          return this;
      var e = this._events[t];
      return e && (e.length = 0,
      delete this._events[t]),
      this
  }
  ,
  r.prototype.emit = function(t) {
      if (!this._events || !t)
          return this._clearOnEmit = !1,
          this;
      var e = this._events[t];
      if (!e || !e.length)
          return this._clearOnEmit = !1,
          this;
      var i, s = this._queue, n = s.length, r = arguments.length - 1;
      r > 3 && ((i = []).push.apply(i, arguments),
      i.shift()),
      s.push.apply(s, e),
      this._clearOnEmit && (e.length = 0,
      this._clearOnEmit = !1),
      ++this._counter;
      for (var o = n, h = s.length; o < h; o++)
          if (0 === r ? s[o]() : 1 === r ? s[o](arguments[1]) : 2 === r ? s[o](arguments[1], arguments[2]) : 3 === r ? s[o](arguments[1], arguments[2], arguments[3]) : s[o].apply(null, i),
          !this._events)
              return this;
      return --this._counter,
      this._counter || (s.length = 0),
      this
  }
  ,
  r.prototype.burst = function() {
      return this._events ? (this._clearOnEmit = !0,
      this.emit.apply(this, arguments),
      this) : this
  }
  ,
  r.prototype.countListeners = function(t) {
      if (!this._events)
          return 0;
      var e = this._events[t];
      return e ? e.length : 0
  }
  ,
  r.prototype.destroy = function() {
      return this._events ? (this._queue.length = this._counter = 0,
      this._events = null,
      this) : this
  }
  ;
  var o = s ? "pointerout" : n ? "MSPointerOut" : "";
  function h(t) {
      o && (this._dragger = t,
      this._timeout = null,
      this._outEvent = null,
      this._isActive = !1,
      this._addBehaviour = this._addBehaviour.bind(this),
      this._removeBehaviour = this._removeBehaviour.bind(this),
      this._onTimeout = this._onTimeout.bind(this),
      this._resetData = this._resetData.bind(this),
      this._onStart = this._onStart.bind(this),
      this._onOut = this._onOut.bind(this),
      this._dragger.on("start", this._onStart))
  }
  h.prototype._addBehaviour = function() {
      this._isActive || (this._isActive = !0,
      this._dragger.on("move", this._resetData),
      this._dragger.on("cancel", this._removeBehaviour),
      this._dragger.on("end", this._removeBehaviour),
      window.addEventListener(o, this._onOut))
  }
  ,
  h.prototype._removeBehaviour = function() {
      this._isActive && (this._dragger.off("move", this._resetData),
      this._dragger.off("cancel", this._removeBehaviour),
      this._dragger.off("end", this._removeBehaviour),
      window.removeEventListener(o, this._onOut),
      this._resetData(),
      this._isActive = !1)
  }
  ,
  h.prototype._resetData = function() {
      window.clearTimeout(this._timeout),
      this._timeout = null,
      this._outEvent = null
  }
  ,
  h.prototype._onStart = function(t) {
      "mouse" !== t.pointerType && this._addBehaviour()
  }
  ,
  h.prototype._onOut = function(t) {
      this._dragger._getTrackedTouch(t) && (this._resetData(),
      this._outEvent = t,
      this._timeout = window.setTimeout(this._onTimeout, 100))
  }
  ,
  h.prototype._onTimeout = function() {
      var t = this._outEvent;
      this._resetData(),
      this._dragger.isActive() && this._dragger._onCancel(t)
  }
  ,
  h.prototype.destroy = function() {
      o && (this._dragger.off("start", this._onStart),
      this._removeBehaviour())
  }
  ;
  var a = ["", "webkit", "moz", "ms", "o", "Webkit", "Moz", "MS", "O"]
    , l = {};
  function _(t, e) {
      var i = l[e] || "";
      if (i)
          return i;
      for (var s = e[0].toUpperCase() + e.slice(1), n = 0; n < a.length; ) {
          if ((i = a[n] ? a[n] + s : e)in t)
              return l[e] = i,
              i;
          ++n
      }
      return ""
  }
  function d() {
      var t = !1;
      try {
          var e = Object.defineProperty({}, "passive", {
              get: function() {
                  t = !0
              }
          });
          window.addEventListener("testPassive", null, e),
          window.removeEventListener("testPassive", null, e)
      } catch (t) {}
      return t
  }
  var u = window.navigator.userAgent.toLowerCase()
    , c = u.indexOf("edge") > -1
    , f = u.indexOf("trident") > -1
    , p = u.indexOf("firefox") > -1
    , m = u.indexOf("android") > -1
    , g = !!d() && {
      passive: !0
  }
    , v = _(document.documentElement.style, "touchAction");
  function y(t, e) {
      this._element = t,
      this._emitter = new r,
      this._isDestroyed = !1,
      this._cssProps = {},
      this._touchAction = "",
      this._isActive = !1,
      this._pointerId = null,
      this._startTime = 0,
      this._startX = 0,
      this._startY = 0,
      this._currentX = 0,
      this._currentY = 0,
      this._onStart = this._onStart.bind(this),
      this._onMove = this._onMove.bind(this),
      this._onCancel = this._onCancel.bind(this),
      this._onEnd = this._onEnd.bind(this),
      this._edgeHack = null,
      (c || f) && (s || n) && (this._edgeHack = new h(this)),
      this.setCssProps(e),
      this._touchAction || this.setTouchAction("auto"),
      t.addEventListener("dragstart", y._preventDefault, !1),
      t.addEventListener(y._inputEvents.start, this._onStart, g)
  }
  y._pointerEvents = {
      start: "pointerdown",
      move: "pointermove",
      cancel: "pointercancel",
      end: "pointerup"
  },
  y._msPointerEvents = {
      start: "MSPointerDown",
      move: "MSPointerMove",
      cancel: "MSPointerCancel",
      end: "MSPointerUp"
  },
  y._touchEvents = {
      start: "touchstart",
      move: "touchmove",
      cancel: "touchcancel",
      end: "touchend"
  },
  y._mouseEvents = {
      start: "mousedown",
      move: "mousemove",
      cancel: "",
      end: "mouseup"
  },
  y._inputEvents = i ? y._touchEvents : s ? y._pointerEvents : n ? y._msPointerEvents : y._mouseEvents,
  y._emitter = new r,
  y._emitterEvents = {
      start: "start",
      move: "move",
      end: "end",
      cancel: "cancel"
  },
  y._activeInstances = [],
  y._preventDefault = function(t) {
      t.preventDefault && !1 !== t.cancelable && t.preventDefault()
  }
  ,
  y._activateInstance = function(t) {
      y._activeInstances.indexOf(t) > -1 || (y._activeInstances.push(t),
      y._emitter.on(y._emitterEvents.move, t._onMove),
      y._emitter.on(y._emitterEvents.cancel, t._onCancel),
      y._emitter.on(y._emitterEvents.end, t._onEnd),
      1 === y._activeInstances.length && y._bindListeners())
  }
  ,
  y._deactivateInstance = function(t) {
      var e = y._activeInstances.indexOf(t);
      -1 !== e && (y._activeInstances.splice(e, 1),
      y._emitter.off(y._emitterEvents.move, t._onMove),
      y._emitter.off(y._emitterEvents.cancel, t._onCancel),
      y._emitter.off(y._emitterEvents.end, t._onEnd),
      y._activeInstances.length || y._unbindListeners())
  }
  ,
  y._bindListeners = function() {
      window.addEventListener(y._inputEvents.move, y._onMove, g),
      window.addEventListener(y._inputEvents.end, y._onEnd, g),
      y._inputEvents.cancel && window.addEventListener(y._inputEvents.cancel, y._onCancel, g)
  }
  ,
  y._unbindListeners = function() {
      window.removeEventListener(y._inputEvents.move, y._onMove, g),
      window.removeEventListener(y._inputEvents.end, y._onEnd, g),
      y._inputEvents.cancel && window.removeEventListener(y._inputEvents.cancel, y._onCancel, g)
  }
  ,
  y._getEventPointerId = function(t) {
      return "number" == typeof t.pointerId ? t.pointerId : t.changedTouches ? t.changedTouches[0] ? t.changedTouches[0].identifier : null : 1
  }
  ,
  y._getTouchById = function(t, e) {
      if ("number" == typeof t.pointerId)
          return t.pointerId === e ? t : null;
      if (t.changedTouches) {
          for (var i = 0; i < t.changedTouches.length; i++)
              if (t.changedTouches[i].identifier === e)
                  return t.changedTouches[i];
          return null
      }
      return t
  }
  ,
  y._onMove = function(t) {
      y._emitter.emit(y._emitterEvents.move, t)
  }
  ,
  y._onCancel = function(t) {
      y._emitter.emit(y._emitterEvents.cancel, t)
  }
  ,
  y._onEnd = function(t) {
      y._emitter.emit(y._emitterEvents.end, t)
  }
  ,
  y.prototype._reset = function() {
      this._pointerId = null,
      this._startTime = 0,
      this._startX = 0,
      this._startY = 0,
      this._currentX = 0,
      this._currentY = 0,
      this._isActive = !1,
      y._deactivateInstance(this)
  }
  ,
  y.prototype._createEvent = function(t, e) {
      var i = this._getTrackedTouch(e);
      return {
          type: t,
          srcEvent: e,
          distance: this.getDistance(),
          deltaX: this.getDeltaX(),
          deltaY: this.getDeltaY(),
          deltaTime: t === y._emitterEvents.start ? 0 : this.getDeltaTime(),
          isFirst: t === y._emitterEvents.start,
          isFinal: t === y._emitterEvents.end || t === y._emitterEvents.cancel,
          pointerType: e.pointerType || (e.touches ? "touch" : "mouse"),
          identifier: this._pointerId,
          screenX: i.screenX,
          screenY: i.screenY,
          clientX: i.clientX,
          clientY: i.clientY,
          pageX: i.pageX,
          pageY: i.pageY,
          target: i.target
      }
  }
  ,
  y.prototype._emit = function(t, e) {
      this._emitter.emit(t, this._createEvent(t, e))
  }
  ,
  y.prototype._getTrackedTouch = function(t) {
      return null === this._pointerId ? null : y._getTouchById(t, this._pointerId)
  }
  ,
  y.prototype._onStart = function(t) {
      if (!this._isDestroyed && null === this._pointerId && (this._pointerId = y._getEventPointerId(t),
      null !== this._pointerId)) {
          var e = this._getTrackedTouch(t);
          this._startX = this._currentX = e.clientX,
          this._startY = this._currentY = e.clientY,
          this._startTime = Date.now(),
          this._isActive = !0,
          this._emit(y._emitterEvents.start, t),
          this._isActive && y._activateInstance(this)
      }
  }
  ,
  y.prototype._onMove = function(t) {
      var e = this._getTrackedTouch(t);
      e && (this._currentX = e.clientX,
      this._currentY = e.clientY,
      this._emit(y._emitterEvents.move, t))
  }
  ,
  y.prototype._onCancel = function(t) {
      this._getTrackedTouch(t) && (this._emit(y._emitterEvents.cancel, t),
      this._reset())
  }
  ,
  y.prototype._onEnd = function(t) {
      this._getTrackedTouch(t) && (this._emit(y._emitterEvents.end, t),
      this._reset())
  }
  ,
  y.prototype.isActive = function() {
      return this._isActive
  }
  ,
  y.prototype.setTouchAction = function(t) {
      this._touchAction = t,
      v && (this._cssProps[v] = "",
      this._element.style[v] = t),
      i && (this._element.removeEventListener(y._touchEvents.start, y._preventDefault, !0),
      (this._element.style[v] !== t || p && m) && this._element.addEventListener(y._touchEvents.start, y._preventDefault, !0))
  }
  ,
  y.prototype.setCssProps = function(t) {
      if (t) {
          var e, i, s = this._cssProps, n = this._element;
          for (e in s)
              n.style[e] = s[e],
              delete s[e];
          for (e in t)
              t[e] && ("touchAction" !== e ? (i = _(n.style, e)) && (s[i] = "",
              n.style[i] = t[e]) : this.setTouchAction(t[e]))
      }
  }
  ,
  y.prototype.getDeltaX = function() {
      return this._currentX - this._startX
  }
  ,
  y.prototype.getDeltaY = function() {
      return this._currentY - this._startY
  }
  ,
  y.prototype.getDistance = function() {
      var t = this.getDeltaX()
        , e = this.getDeltaY();
      return Math.sqrt(t * t + e * e)
  }
  ,
  y.prototype.getDeltaTime = function() {
      return this._startTime ? Date.now() - this._startTime : 0
  }
  ,
  y.prototype.on = function(t, e) {
      this._emitter.on(t, e)
  }
  ,
  y.prototype.off = function(t, e) {
      this._emitter.off(t, e)
  }
  ,
  y.prototype.destroy = function() {
      if (!this._isDestroyed) {
          var t = this._element;
          for (var e in this._edgeHack && this._edgeHack.destroy(),
          this._reset(),
          this._emitter.destroy(),
          t.removeEventListener(y._inputEvents.start, this._onStart, g),
          t.removeEventListener("dragstart", y._preventDefault, !1),
          t.removeEventListener(y._touchEvents.start, y._preventDefault, !0),
          this._cssProps)
              t.style[e] = this._cssProps[e],
              delete this._cssProps[e];
          this._element = null,
          this._isDestroyed = !0
      }
  }
  ;
  var S = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
      return this.setTimeout((function() {
          t(Date.now())
      }
      ), 16.666666666666668)
  }
  ).bind(window);
  function w(t) {
      this._nextStep = null,
      this._lanes = [],
      this._stepQueue = [],
      this._stepCallbacks = {},
      this._step = this._step.bind(this);
      for (var e = 0; e < t; e++)
          this._lanes.push(new D)
  }
  function D() {
      this.queue = [],
      this.indices = {},
      this.callbacks = {}
  }
  w.prototype._step = function(t) {
      var e, i, s, n, r, o, h = this._lanes, a = this._stepQueue, l = this._stepCallbacks;
      for (this._nextStep = null,
      e = 0; e < h.length; e++) {
          for (n = h[e].queue,
          r = h[e].callbacks,
          o = h[e].indices,
          i = 0; i < n.length; i++)
              (s = n[i]) && (a.push(s),
              l[s] = r[s],
              delete r[s],
              delete o[s]);
          n.length = 0
      }
      for (e = 0; e < a.length; e++)
          l[s = a[e]] && l[s](t),
          delete l[s];
      a.length = 0
  }
  ,
  w.prototype.add = function(t, e, i) {
      this._lanes[t].add(e, i),
      this._nextStep || (this._nextStep = S(this._step))
  }
  ,
  w.prototype.remove = function(t, e) {
      this._lanes[t].remove(e)
  }
  ,
  D.prototype.add = function(t, e) {
      var i = this.indices[t];
      void 0 !== i && (this.queue[i] = void 0),
      this.queue.push(t),
      this.callbacks[t] = e,
      this.indices[t] = this.queue.length - 1
  }
  ,
  D.prototype.remove = function(t) {
      var e = this.indices[t];
      void 0 !== e && (this.queue[e] = void 0,
      delete this.callbacks[t],
      delete this.indices[t])
  }
  ;
  var b = new w(3);
  function A(t) {
      b.remove(0, "layoutRead" + t),
      b.remove(2, "layoutWrite" + t)
  }
  function E(t) {
      b.remove(0, "visibilityRead" + t),
      b.remove(2, "visibilityWrite" + t)
  }
  function T(t) {
      b.remove(0, "dragStartRead" + t),
      b.remove(2, "dragStartWrite" + t)
  }
  function x(t) {
      b.remove(0, "dragMoveRead" + t),
      b.remove(2, "dragMoveWrite" + t)
  }
  function R(t) {
      b.remove(0, "dragScrollRead" + t),
      b.remove(2, "dragScrollWrite" + t)
  }
  function k(t, e) {
      b.add(1, "dragSortRead" + t, e)
  }
  function L(t) {
      b.remove(0, "placeholderLayoutRead" + t),
      b.remove(2, "placeholderLayoutWrite" + t)
  }
  function I(t, e) {
      b.add(0, "autoScrollRead", t),
      b.add(2, "autoScrollWrite", e)
  }
  function C(t) {
      return "function" == typeof t
  }
  var M, X = "function" == typeof WeakMap, P = X ? new WeakMap : null, Y = !0, q = function() {
      Y ? (M = window.clearInterval(M),
      P = X ? new WeakMap : null) : Y = !0
  };
  function O(t, e) {
      var i = P && P.get(t);
      return i || (i = window.getComputedStyle(t, null),
      P && P.set(t, i)),
      P && (M ? Y = !1 : M = window.setInterval(q, 3e3)),
      i.getPropertyValue(e)
  }
  function H(t, e) {
      return parseFloat(O(t, e)) || 0
  }
  var G, W = document.documentElement, B = document.body, N = {
      value: 0,
      offset: 0
  };
  function F(t) {
      return t === window || t === W || t === B ? window : t
  }
  function z(t) {
      return t === window ? t.pageXOffset : t.scrollLeft
  }
  function V(t) {
      return t === window ? t.pageYOffset : t.scrollTop
  }
  function j(t) {
      return t === window ? W.scrollWidth - W.clientWidth : t.scrollWidth - t.clientWidth
  }
  function Q(t) {
      return t === window ? W.scrollHeight - W.clientHeight : t.scrollHeight - t.clientHeight
  }
  function U(t, e) {
      if (e = e || {},
      t === window)
          e.width = W.clientWidth,
          e.height = W.clientHeight,
          e.left = 0,
          e.right = e.width,
          e.top = 0,
          e.bottom = e.height;
      else {
          var i = t.getBoundingClientRect()
            , s = t.clientLeft || H(t, "border-left-width")
            , n = t.clientTop || H(t, "border-top-width");
          e.width = t.clientWidth,
          e.height = t.clientHeight,
          e.left = i.left + s,
          e.right = e.left + e.width,
          e.top = i.top + n,
          e.bottom = e.top + e.height
      }
      return e
  }
  function Z(t) {
      return t._drag._getGrid()._settings.dragAutoScroll
  }
  function J(t) {
      t._drag && t._drag._prepareScroll()
  }
  function $(t) {
      if (t._drag && t._isActive) {
          var e = t._drag;
          e._scrollDiffX = e._scrollDiffY = 0,
          t._setTranslate(e._left, e._top)
      }
  }
  function K(t, e, i, s) {
      return N.value = Math.min(s / 2, t),
      N.offset = Math.max(0, i + 2 * N.value + s * e - s) / 2,
      N
  }
  function tt() {
      this.reset()
  }
  function et() {
      this.element = null,
      this.requestX = null,
      this.requestY = null,
      this.scrollLeft = 0,
      this.scrollTop = 0
  }
  function it(t, e) {
      this.pool = [],
      this.createItem = t,
      this.releaseItem = e
  }
  function st(t, e) {
      var i = function(t, e) {
          return function(t, e) {
              return !(t.left + t.width <= e.left || e.left + e.width <= t.left || t.top + t.height <= e.top || e.top + e.height <= t.top)
          }(t, e) ? (Math.min(t.left + t.width, e.left + e.width) - Math.max(t.left, e.left)) * (Math.min(t.top + t.height, e.top + e.height) - Math.max(t.top, e.top)) : 0
      }(t, e);
      return i ? i / (Math.min(t.width, e.width) * Math.min(t.height, e.height)) * 100 : 0
  }
  tt.prototype.reset = function() {
      this.isActive && this.onStop(),
      this.item = null,
      this.element = null,
      this.isActive = !1,
      this.isEnding = !1,
      this.direction = null,
      this.value = null,
      this.maxValue = 0,
      this.threshold = 0,
      this.distance = 0,
      this.speed = 0,
      this.duration = 0,
      this.action = null
  }
  ,
  tt.prototype.hasReachedEnd = function() {
      return 4 & this.direction ? this.value >= this.maxValue : this.value <= 0
  }
  ,
  tt.prototype.computeCurrentScrollValue = function() {
      return null === this.value ? 1 & this.direction ? z(this.element) : V(this.element) : Math.max(0, Math.min(this.value, this.maxValue))
  }
  ,
  tt.prototype.computeNextScrollValue = function(t) {
      var e = this.speed * (t / 1e3)
        , i = 4 & this.direction ? this.value + e : this.value - e;
      return Math.max(0, Math.min(i, this.maxValue))
  }
  ,
  tt.prototype.computeSpeed = (G = {
      direction: null,
      threshold: 0,
      distance: 0,
      value: 0,
      maxValue: 0,
      deltaTime: 0,
      duration: 0,
      isEnding: !1
  },
  function(t) {
      var e = this.item
        , i = Z(e).speed;
      return C(i) ? (G.direction = this.direction,
      G.threshold = this.threshold,
      G.distance = this.distance,
      G.value = this.value,
      G.maxValue = this.maxValue,
      G.duration = this.duration,
      G.speed = this.speed,
      G.deltaTime = t,
      G.isEnding = this.isEnding,
      i(e, this.element, G)) : i
  }
  ),
  tt.prototype.tick = function(t) {
      return this.isActive || (this.isActive = !0,
      this.onStart()),
      this.value = this.computeCurrentScrollValue(),
      this.speed = this.computeSpeed(t),
      this.value = this.computeNextScrollValue(t),
      this.duration += t,
      this.value
  }
  ,
  tt.prototype.onStart = function() {
      var t = this.item
        , e = Z(t).onStart;
      C(e) && e(t, this.element, this.direction)
  }
  ,
  tt.prototype.onStop = function() {
      var t = this.item
        , e = Z(t).onStop;
      C(e) && e(t, this.element, this.direction),
      t._drag && t._drag.sort()
  }
  ,
  et.prototype.reset = function() {
      this.requestX && (this.requestX.action = null),
      this.requestY && (this.requestY.action = null),
      this.element = null,
      this.requestX = null,
      this.requestY = null,
      this.scrollLeft = 0,
      this.scrollTop = 0
  }
  ,
  et.prototype.addRequest = function(t) {
      1 & t.direction ? (this.removeRequest(this.requestX),
      this.requestX = t) : (this.removeRequest(this.requestY),
      this.requestY = t),
      t.action = this
  }
  ,
  et.prototype.removeRequest = function(t) {
      t && (this.requestX === t ? (this.requestX = null,
      t.action = null) : this.requestY === t && (this.requestY = null,
      t.action = null))
  }
  ,
  et.prototype.computeScrollValues = function() {
      this.scrollLeft = this.requestX ? this.requestX.value : z(this.element),
      this.scrollTop = this.requestY ? this.requestY.value : V(this.element)
  }
  ,
  et.prototype.scroll = function() {
      var t = this.element;
      t && (t.scrollTo ? t.scrollTo(this.scrollLeft, this.scrollTop) : (t.scrollLeft = this.scrollLeft,
      t.scrollTop = this.scrollTop))
  }
  ,
  it.prototype.pick = function() {
      return this.pool.pop() || this.createItem()
  }
  ,
  it.prototype.release = function(t) {
      this.releaseItem(t),
      -1 === this.pool.indexOf(t) && this.pool.push(t)
  }
  ,
  it.prototype.reset = function() {
      this.pool.length = 0
  }
  ;
  var nt = {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
  }
    , rt = {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
  };
  function ot() {
      this._isDestroyed = !1,
      this._isTicking = !1,
      this._tickTime = 0,
      this._tickDeltaTime = 0,
      this._items = [],
      this._actions = [],
      this._requests = {},
      this._requests[1] = {},
      this._requests[2] = {},
      this._requestOverlapCheck = {},
      this._dragPositions = {},
      this._dragDirections = {},
      this._overlapCheckInterval = 150,
      this._requestPool = new it((function() {
          return new tt
      }
      ),(function(t) {
          t.reset()
      }
      )),
      this._actionPool = new it((function() {
          return new et
      }
      ),(function(t) {
          t.reset()
      }
      )),
      this._readTick = this._readTick.bind(this),
      this._writeTick = this._writeTick.bind(this)
  }
  ot.AXIS_X = 1,
  ot.AXIS_Y = 2,
  ot.FORWARD = 4,
  ot.BACKWARD = 8,
  ot.LEFT = 9,
  ot.RIGHT = 5,
  ot.UP = 10,
  ot.DOWN = 6,
  ot.smoothSpeed = function(t, e, i) {
      return function(s, n, r) {
          var o = 0;
          if (!r.isEnding)
              if (r.threshold > 0) {
                  var h = r.threshold - Math.max(0, r.distance);
                  o = t / r.threshold * h
              } else
                  o = t;
          var a = r.speed
            , l = o;
          return a === o ? l : a < o ? (l = a + e * (r.deltaTime / 1e3),
          Math.min(o, l)) : (l = a - i * (r.deltaTime / 1e3),
          Math.max(o, l))
      }
  }
  ,
  ot.pointerHandle = function(t) {
      var e = {
          left: 0,
          top: 0,
          width: 0,
          height: 0
      }
        , i = t || 1;
      return function(t, s, n, r, o, h, a) {
          return e.left = h - .5 * i,
          e.top = a - .5 * i,
          e.width = i,
          e.height = i,
          e
      }
  }
  ,
  ot.prototype._readTick = function(t) {
      this._isDestroyed || (t && this._tickTime ? (this._tickDeltaTime = t - this._tickTime,
      this._tickTime = t,
      this._updateRequests(),
      this._updateActions()) : (this._tickTime = t,
      this._tickDeltaTime = 0))
  }
  ,
  ot.prototype._writeTick = function() {
      this._isDestroyed || (this._applyActions(),
      I(this._readTick, this._writeTick))
  }
  ,
  ot.prototype._startTicking = function() {
      this._isTicking = !0,
      I(this._readTick, this._writeTick)
  }
  ,
  ot.prototype._stopTicking = function() {
      this._isTicking = !1,
      this._tickTime = 0,
      this._tickDeltaTime = 0,
      b.remove(0, "autoScrollRead"),
      b.remove(2, "autoScrollWrite")
  }
  ,
  ot.prototype._getItemHandleRect = function(t, e, i) {
      var s = t._drag;
      if (e) {
          var n = s._dragMoveEvent || s._dragStartEvent
            , r = e(t, s._clientX, s._clientY, t._width, t._height, n.clientX, n.clientY);
          i.left = r.left,
          i.top = r.top,
          i.width = r.width,
          i.height = r.height
      } else
          i.left = s._clientX,
          i.top = s._clientY,
          i.width = t._width,
          i.height = t._height;
      return i.right = i.left + i.width,
      i.bottom = i.top + i.height,
      i
  }
  ,
  ot.prototype._requestItemScroll = function(t, e, i, s, n, r, o) {
      var h = this._requests[e]
        , a = h[t._id];
      a ? a.element === i && a.direction === s || a.reset() : a = this._requestPool.pick(),
      a.item = t,
      a.element = i,
      a.direction = s,
      a.threshold = n,
      a.distance = r,
      a.maxValue = o,
      h[t._id] = a
  }
  ,
  ot.prototype._cancelItemScroll = function(t, e) {
      var i = this._requests[e]
        , s = i[t._id];
      s && (s.action && s.action.removeRequest(s),
      this._requestPool.release(s),
      delete i[t._id])
  }
  ,
  ot.prototype._checkItemOverlap = function(t, e, i) {
      var s = Z(t)
        , n = C(s.targets) ? s.targets(t) : s.targets
        , r = s.threshold
        , o = s.safeZone;
      if (!n || !n.length)
          return e && this._cancelItemScroll(t, 1),
          void (i && this._cancelItemScroll(t, 2));
      var h = this._dragDirections[t._id]
        , a = h[0]
        , l = h[1];
      if (!a && !l)
          return e && this._cancelItemScroll(t, 1),
          void (i && this._cancelItemScroll(t, 2));
      for (var _ = this._getItemHandleRect(t, s.handle, nt), d = rt, u = null, c = null, f = !0, p = !0, m = 0, g = 0, v = null, y = null, S = 0, w = 0, D = 0, b = null, A = -1 / 0, E = 0, T = 0, x = null, R = 0, k = 0, L = null, I = -1 / 0, M = 0, X = 0, P = null, Y = 0, q = 0, O = 0; O < n.length; O++)
          u = n[O],
          f = e && a && 2 !== u.axis,
          p = i && l && 1 !== u.axis,
          g = u.priority || 0,
          (!f || g < A) && (!p || g < I) || (c = F(u.element || u),
          w = f ? j(c) : -1,
          D = p ? Q(c) : -1,
          (w || D) && ((m = st(_, d = U(c, d))) <= 0 || (f && g >= A && w > 0 && (g > A || m > T) && (y = null,
          v = K("number" == typeof u.threshold ? u.threshold : r, o, _.width, d.width),
          5 === a ? (S = d.right + v.offset - _.right) <= v.value && z(c) < w && (y = 5) : 9 === a && (S = _.left - (d.left - v.offset)) <= v.value && z(c) > 0 && (y = 9),
          null !== y && (b = c,
          A = g,
          E = v.value,
          T = m,
          x = y,
          R = S,
          k = w)),
          p && g >= I && D > 0 && (g > I || m > X) && (y = null,
          v = K("number" == typeof u.threshold ? u.threshold : r, o, _.height, d.height),
          6 === l ? (S = d.bottom + v.offset - _.bottom) <= v.value && V(c) < D && (y = 6) : 10 === l && (S = _.top - (d.top - v.offset)) <= v.value && V(c) > 0 && (y = 10),
          null !== y && (L = c,
          I = g,
          M = v.value,
          X = m,
          P = y,
          Y = S,
          q = D)))));
      e && (b ? this._requestItemScroll(t, 1, b, x, E, R, k) : this._cancelItemScroll(t, 1)),
      i && (L ? this._requestItemScroll(t, 2, L, P, M, Y, q) : this._cancelItemScroll(t, 2))
  }
  ,
  ot.prototype._updateScrollRequest = function(t) {
      for (var e = t.item, i = Z(e), s = C(i.targets) ? i.targets(e) : i.targets, n = s && s.length || 0, r = i.threshold, o = i.safeZone, h = this._getItemHandleRect(e, i.handle, nt), a = rt, l = null, _ = null, d = !1, u = null, c = null, f = null, p = null, m = null, g = 0; g < n; g++)
          if ((_ = F((l = s[g]).element || l)) === t.element) {
              if (d = !!(1 & t.direction)) {
                  if (2 === l.axis)
                      continue
              } else if (1 === l.axis)
                  continue;
              if ((p = d ? j(_) : Q(_)) <= 0)
                  break;
              if (st(h, a = U(_, a)) <= 0)
                  break;
              if (u = K("number" == typeof l.threshold ? l.threshold : r, o, d ? h.width : h.height, d ? a.width : a.height),
              (c = 9 === t.direction ? h.left - (a.left - u.offset) : 5 === t.direction ? a.right + u.offset - h.right : 10 === t.direction ? h.top - (a.top - u.offset) : a.bottom + u.offset - h.bottom) > u.value)
                  break;
              if (f = d ? z(_) : V(_),
              m = 4 & t.direction ? f >= p : f <= 0)
                  break;
              return t.maxValue = p,
              t.threshold = u.value,
              t.distance = c,
              t.isEnding = !1,
              !0
          }
      return !0 === i.smoothStop && t.speed > 0 ? (null === m && (m = t.hasReachedEnd()),
      t.isEnding = !m) : t.isEnding = !1,
      t.isEnding
  }
  ,
  ot.prototype._updateRequests = function() {
      for (var t, e, i, s, n, r, o, h = this._items, a = this._requests[1], l = this._requests[2], _ = 0; _ < h.length; _++)
          t = h[_],
          n = (s = this._requestOverlapCheck[t._id]) > 0 && this._tickTime - s > this._overlapCheckInterval,
          r = !0,
          (e = a[t._id]) && e.isActive && (r = !this._updateScrollRequest(e)) && (n = !0,
          this._cancelItemScroll(t, 1)),
          o = !0,
          (i = l[t._id]) && i.isActive && (o = !this._updateScrollRequest(i)) && (n = !0,
          this._cancelItemScroll(t, 2)),
          n && (this._requestOverlapCheck[t._id] = 0,
          this._checkItemOverlap(t, r, o))
  }
  ,
  ot.prototype._requestAction = function(t, e) {
      for (var i = this._actions, s = 1 === e, n = null, r = 0; r < i.length; r++) {
          if (n = i[r],
          t.element === n.element) {
              if (s ? n.requestX : n.requestY)
                  return void this._cancelItemScroll(t.item, e);
              break
          }
          n = null
      }
      n || (n = this._actionPool.pick()),
      n.element = t.element,
      n.addRequest(t),
      t.tick(this._tickDeltaTime),
      i.push(n)
  }
  ,
  ot.prototype._updateActions = function() {
      var t, e, i, s, n = this._items, r = this._requests, o = this._actions;
      for (s = 0; s < n.length; s++)
          t = n[s]._id,
          e = r[1][t],
          i = r[2][t],
          e && this._requestAction(e, 1),
          i && this._requestAction(i, 2);
      for (s = 0; s < o.length; s++)
          o[s].computeScrollValues()
  }
  ,
  ot.prototype._applyActions = function() {
      var t, e = this._actions, i = this._items;
      if (e.length) {
          for (t = 0; t < e.length; t++)
              e[t].scroll(),
              this._actionPool.release(e[t]);
          for (e.length = 0,
          t = 0; t < i.length; t++)
              J(i[t]);
          for (t = 0; t < i.length; t++)
              $(i[t])
      }
  }
  ,
  ot.prototype._updateDragDirection = function(t) {
      var e = this._dragPositions[t._id]
        , i = this._dragDirections[t._id]
        , s = t._drag._left
        , n = t._drag._top;
      if (e.length) {
          var r = e[0]
            , o = e[1];
          i[0] = s > r ? 5 : s < r ? 9 : i[0] || 0,
          i[1] = n > o ? 6 : n < o ? 10 : i[1] || 0
      }
      e[0] = s,
      e[1] = n
  }
  ,
  ot.prototype.addItem = function(t) {
      this._isDestroyed || -1 === this._items.indexOf(t) && (this._items.push(t),
      this._requestOverlapCheck[t._id] = this._tickTime,
      this._dragDirections[t._id] = [0, 0],
      this._dragPositions[t._id] = [],
      this._isTicking || this._startTicking())
  }
  ,
  ot.prototype.updateItem = function(t) {
      this._isDestroyed || this._dragDirections[t._id] && (this._updateDragDirection(t),
      this._requestOverlapCheck[t._id] || (this._requestOverlapCheck[t._id] = this._tickTime))
  }
  ,
  ot.prototype.removeItem = function(t) {
      if (!this._isDestroyed) {
          var e = this._items.indexOf(t);
          if (-1 !== e) {
              var i = t._id;
              this._requests[1][i] && (this._cancelItemScroll(t, 1),
              delete this._requests[1][i]),
              this._requests[2][i] && (this._cancelItemScroll(t, 2),
              delete this._requests[2][i]),
              delete this._requestOverlapCheck[i],
              delete this._dragPositions[i],
              delete this._dragDirections[i],
              this._items.splice(e, 1),
              this._isTicking && !this._items.length && this._stopTicking()
          }
      }
  }
  ,
  ot.prototype.isItemScrollingX = function(t) {
      var e = this._requests[1][t._id];
      return !(!e || !e.isActive)
  }
  ,
  ot.prototype.isItemScrollingY = function(t) {
      var e = this._requests[2][t._id];
      return !(!e || !e.isActive)
  }
  ,
  ot.prototype.isItemScrolling = function(t) {
      return this.isItemScrollingX(t) || this.isItemScrollingY(t)
  }
  ,
  ot.prototype.destroy = function() {
      if (!this._isDestroyed) {
          for (var t = this._items.slice(0), e = 0; e < t.length; e++)
              this.removeItem(t[e]);
          this._actions.length = 0,
          this._requestPool.reset(),
          this._actionPool.reset(),
          this._isDestroyed = !0
      }
  }
  ;
  var ht = window.Element.prototype
    , at = ht.matches || ht.matchesSelector || ht.webkitMatchesSelector || ht.mozMatchesSelector || ht.msMatchesSelector || ht.oMatchesSelector || function() {
      return !1
  }
  ;
  function lt(t, e) {
      return at.call(t, e)
  }
  function _t(t, e) {
      e && (t.classList ? t.classList.add(e) : lt(t, "." + e) || (t.className += " " + e))
  }
  var dt = [];
  function ut(t, e, i) {
      var s = "number" == typeof i ? i : -1;
      s < 0 && (s = t.length - s + 1),
      t.splice.apply(t, dt.concat(s, 0, e)),
      dt.length = 0
  }
  function ct(t, e, i) {
      var s = Math.max(0, t.length - 1 + (i || 0));
      return e > s ? s : e < 0 ? Math.max(s + e + 1, 0) : e
  }
  function ft(t, e, i) {
      if (!(t.length < 2)) {
          var s = ct(t, e)
            , n = ct(t, i);
          s !== n && t.splice(n, 0, t.splice(s, 1)[0])
      }
  }
  function pt(t, e, i) {
      if (!(t.length < 2)) {
          var s, n = ct(t, e), r = ct(t, i);
          n !== r && (s = t[n],
          t[n] = t[r],
          t[r] = s)
      }
  }
  var mt = _(document.documentElement.style, "transform") || "transform"
    , gt = /([A-Z])/g
    , vt = /^(webkit-|moz-|ms-|o-)/
    , yt = /^(-m-s-)/;
  function St(t) {
      var e = t.replace(gt, "-$1").toLowerCase();
      return e = (e = e.replace(vt, "-$1")).replace(yt, "-ms-")
  }
  var wt = St(mt);
  function Dt(t) {
      var e = O(t, wt);
      if (!e || "none" === e)
          return !1;
      var i = O(t, "display");
      return "inline" !== i && "none" !== i
  }
  function bt(t) {
      for (var e = document, i = t || e; i && i !== e && "static" === O(i, "position") && !Dt(i); )
          i = i.parentElement || e;
      return i
  }
  var At = {}
    , Et = {}
    , Tt = {};
  function xt(t, e) {
      var i, s = e || {};
      return s.left = 0,
      s.top = 0,
      t === document ? s : (s.left = window.pageXOffset || 0,
      s.top = window.pageYOffset || 0,
      t.self === window.self || (i = t.getBoundingClientRect(),
      s.left += i.left,
      s.top += i.top,
      s.left += H(t, "border-left-width"),
      s.top += H(t, "border-top-width")),
      s)
  }
  function Rt(t, e, i) {
      return Tt.left = 0,
      Tt.top = 0,
      t === e || i && (t = bt(t)) === (e = bt(e)) || (xt(t, At),
      xt(e, Et),
      Tt.left = Et.left - At.left,
      Tt.top = Et.top - At.top),
      Tt
  }
  function kt(t) {
      return "auto" === t || "scroll" === t || "overlay" === t
  }
  function Lt(t) {
      return kt(O(t, "overflow")) || kt(O(t, "overflow-x")) || kt(O(t, "overflow-y"))
  }
  function It(t, e) {
      for (e = e || []; t && t !== document; )
          t.getRootNode && t instanceof DocumentFragment ? t = t.getRootNode().host : (Lt(t) && e.push(t),
          t = t.parentNode);
      return e.push(window),
      e
  }
  var Ct = {}
    , Mt = /^matrix3d/
    , Xt = /([^,]*,){4}/
    , Pt = /([^,]*,){12}/
    , Yt = /[^,]*,/;
  function qt(t) {
      Ct.x = 0,
      Ct.y = 0;
      var e = O(t, wt);
      if (!e || "none" === e)
          return Ct;
      var i = Mt.test(e)
        , s = e.replace(i ? Pt : Xt, "")
        , n = s.replace(Yt, "");
      return Ct.x = parseFloat(s) || 0,
      Ct.y = parseFloat(n) || 0,
      Ct
  }
  function Ot(t, e) {
      e && (t.classList ? t.classList.remove(e) : lt(t, "." + e) && (t.className = (" " + t.className + " ").replace(" " + e + " ", " ").trim()))
  }
  var Ht, Gt, Wt, Bt, Nt = /^(iPad|iPhone|iPod)/.test(window.navigator.platform) || /^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1, Ft = !!d() && {
      passive: !0
  };
  function zt(t) {
      var e = t._element
        , i = t.getGrid()
        , s = i._settings;
      this._item = t,
      this._gridId = i._id,
      this._isDestroyed = !1,
      this._isMigrating = !1,
      this._startPredicate = C(s.dragStartPredicate) ? s.dragStartPredicate : zt.defaultStartPredicate,
      this._startPredicateState = 0,
      this._startPredicateResult = void 0,
      this._isSortNeeded = !1,
      this._sortTimer = void 0,
      this._blockedSortIndex = null,
      this._sortX1 = 0,
      this._sortX2 = 0,
      this._sortY1 = 0,
      this._sortY2 = 0,
      this._reset(),
      this._preStartCheck = this._preStartCheck.bind(this),
      this._preEndCheck = this._preEndCheck.bind(this),
      this._onScroll = this._onScroll.bind(this),
      this._prepareStart = this._prepareStart.bind(this),
      this._applyStart = this._applyStart.bind(this),
      this._prepareMove = this._prepareMove.bind(this),
      this._applyMove = this._applyMove.bind(this),
      this._prepareScroll = this._prepareScroll.bind(this),
      this._applyScroll = this._applyScroll.bind(this),
      this._handleSort = this._handleSort.bind(this),
      this._handleSortDelayed = this._handleSortDelayed.bind(this),
      this._handle = s.dragHandle && e.querySelector(s.dragHandle) || e,
      this._dragger = new y(this._handle,s.dragCssProps),
      this._dragger.on("start", this._preStartCheck),
      this._dragger.on("move", this._preStartCheck),
      this._dragger.on("cancel", this._preEndCheck),
      this._dragger.on("end", this._preEndCheck)
  }
  function Vt(t, e) {
      var i, s, n = {};
      if (Array.isArray(e))
          for (s = 0; s < e.length; s++)
              n[i = e[s]] = O(t, St(i));
      else
          for (i in e)
              n[i] = O(t, St(i));
      return n
  }
  zt.autoScroller = new ot,
  zt.defaultStartPredicate = function(t, e, i) {
      var s = t._drag;
      if (e.isFirst && e.srcEvent.button)
          return !1;
      if (!Nt && e.isFirst && !0 === e.srcEvent.isTrusted && !1 === e.srcEvent.defaultPrevented && !1 === e.srcEvent.cancelable)
          return !1;
      if (!e.isFinal) {
          var n = s._startPredicateData;
          if (!n) {
              var r = i || s._getGrid()._settings.dragStartPredicate || {};
              s._startPredicateData = n = {
                  distance: Math.max(r.distance, 0) || 0,
                  delay: Math.max(r.delay, 0) || 0
              }
          }
          return n.delay && (n.event = e,
          n.delayTimer || (n.delayTimer = window.setTimeout((function() {
              n.delay = 0,
              s._resolveStartPredicate(n.event) && (s._forceResolveStartPredicate(n.event),
              s._resetStartPredicate())
          }
          ), n.delay))),
          s._resolveStartPredicate(e)
      }
      s._finishStartPredicate(e)
  }
  ,
  zt.defaultSortPredicate = (Ht = {},
  Gt = {},
  Wt = {},
  Bt = [],
  function(t, e) {
      var i = t._drag
        , s = i._getGrid()
        , n = e && "number" == typeof e.threshold ? e.threshold : 50
        , r = e && "swap" === e.action ? "swap" : "move"
        , o = e && "swap" === e.migrateAction ? "swap" : "move";
      n = Math.min(Math.max(n, 1), 100),
      Ht.width = t._width,
      Ht.height = t._height,
      Ht.left = i._clientX,
      Ht.top = i._clientY;
      var h = function(t, e, i) {
          var s, n, r, o, h, a, l, _, d, u, c = null, f = e._settings.dragSort, p = -1;
          if (!0 === f ? (Bt[0] = e,
          n = Bt) : C(f) && (n = f.call(e, t)),
          !n || !Array.isArray(n) || !n.length)
              return c;
          for (u = 0; u < n.length; u++)
              if (!(r = n[u])._isDestroyed) {
                  for (r._updateBoundingRect(),
                  a = Math.max(0, r._left),
                  l = Math.max(0, r._top),
                  _ = Math.min(window.innerWidth, r._right),
                  d = Math.min(window.innerHeight, r._bottom),
                  o = r._element.parentNode; o && o !== document && o !== document.documentElement && o !== document.body; )
                      if (o.getRootNode && o instanceof DocumentFragment)
                          o = o.getRootNode().host;
                      else {
                          if ("visible" !== O(o, "overflow") && (h = o.getBoundingClientRect(),
                          a = Math.max(a, h.left),
                          l = Math.max(l, h.top),
                          _ = Math.min(_, h.right),
                          d = Math.min(d, h.bottom)),
                          "fixed" === O(o, "position"))
                              break;
                          o = o.parentNode
                      }
                  a >= _ || l >= d || (Gt.left = a,
                  Gt.top = l,
                  Gt.width = _ - a,
                  Gt.height = d - l,
                  (s = st(Ht, Gt)) > i && s > p && (p = s,
                  c = r))
              }
          return Bt.length = 0,
          c
      }(t, s, n);
      if (!h)
          return null;
      var a, l, _, d = t.getGrid() !== h, u = 0, c = 0, f = 0, p = -1, m = !1;
      for (h === s ? (Ht.left = i._gridX + t._marginLeft,
      Ht.top = i._gridY + t._marginTop) : (h._updateBorders(1, 0, 1, 0),
      u = h._left + h._borderLeft,
      c = h._top + h._borderTop),
      _ = 0; _ < h._items.length; _++)
          (a = h._items[_])._isActive && a !== t && (m = !0,
          Gt.width = a._width,
          Gt.height = a._height,
          Gt.left = a._left + a._marginLeft + u,
          Gt.top = a._top + a._marginTop + c,
          (l = st(Ht, Gt)) > f && (p = _,
          f = l));
      return d && f < n && (p = m ? p : 0,
      f = n),
      f >= n ? (Wt.grid = h,
      Wt.index = p,
      Wt.action = d ? o : r,
      Wt) : null
  }
  ),
  zt.prototype.stop = function() {
      if (this._isActive)
          if (this._isMigrating)
              this._finishMigration();
          else {
              zt.autoScroller.removeItem(this._item);
              var t = this._item._id;
              if (T(t),
              x(t),
              R(t),
              this._cancelSort(),
              this._isStarted) {
                  this._unbindScrollListeners();
                  var e = item._element
                    , i = this._getGrid()
                    , s = i._settings.itemDraggingClass;
                  e.parentNode !== i._element && (i._element.appendChild(e),
                  item._setTranslate(this._gridX, this._gridY),
                  s && e.clientWidth),
                  Ot(e, s)
              }
              this._reset()
          }
  }
  ,
  zt.prototype.sort = function(t) {
      var e = this._item;
      this._isActive && e._isActive && this._dragMoveEvent && (!0 === t ? this._handleSort() : k(e._id, this._handleSort))
  }
  ,
  zt.prototype.destroy = function() {
      this._isDestroyed || (this.stop(),
      this._dragger.destroy(),
      zt.autoScroller.removeItem(this._item),
      this._isDestroyed = !0)
  }
  ,
  zt.prototype._getGrid = function() {
      return t[this._gridId] || null
  }
  ,
  zt.prototype._reset = function() {
      this._isActive = !1,
      this._isStarted = !1,
      this._container = null,
      this._containingBlock = null,
      this._dragStartEvent = null,
      this._dragMoveEvent = null,
      this._dragPrevMoveEvent = null,
      this._scrollEvent = null,
      this._scrollers = [],
      this._left = 0,
      this._top = 0,
      this._gridX = 0,
      this._gridY = 0,
      this._clientX = 0,
      this._clientY = 0,
      this._scrollDiffX = 0,
      this._scrollDiffY = 0,
      this._moveDiffX = 0,
      this._moveDiffY = 0,
      this._containerDiffX = 0,
      this._containerDiffY = 0
  }
  ,
  zt.prototype._bindScrollListeners = function() {
      var t, e, i = this._getGrid()._element, s = this._container, n = this._scrollers;
      if (n.length = 0,
      It(this._item._element.parentNode, n),
      s !== i)
          for (It(i, t = []),
          e = 0; e < t.length; e++)
              n.indexOf(t[e]) < 0 && n.push(t[e]);
      for (e = 0; e < n.length; e++)
          n[e].addEventListener("scroll", this._onScroll, Ft)
  }
  ,
  zt.prototype._unbindScrollListeners = function() {
      var t, e = this._scrollers;
      for (t = 0; t < e.length; t++)
          e[t].removeEventListener("scroll", this._onScroll, Ft);
      e.length = 0
  }
  ,
  zt.prototype._resolveStartPredicate = function(t) {
      var e = this._startPredicateData;
      if (!(t.distance < e.distance || e.delay))
          return this._resetStartPredicate(),
          !0
  }
  ,
  zt.prototype._forceResolveStartPredicate = function(t) {
      this._isDestroyed || 1 !== this._startPredicateState || (this._startPredicateState = 2,
      this._onStart(t))
  }
  ,
  zt.prototype._finishStartPredicate = function(t) {
      var e = this._item._element
        , i = Math.abs(t.deltaX) < 2 && Math.abs(t.deltaY) < 2 && t.deltaTime < 200;
      this._resetStartPredicate(),
      i && function(t) {
          if ("a" !== t.tagName.toLowerCase())
              return;
          var e = t.getAttribute("href");
          if (!e)
              return;
          var i = t.getAttribute("target");
          i && "_self" !== i ? window.open(e, i) : window.location.href = e
      }(e)
  }
  ,
  zt.prototype._resetHeuristics = function(t, e) {
      this._blockedSortIndex = null,
      this._sortX1 = this._sortX2 = t,
      this._sortY1 = this._sortY2 = e
  }
  ,
  zt.prototype._checkHeuristics = function(t, e) {
      var i = this._getGrid()._settings.dragSortHeuristics
        , s = i.minDragDistance;
      if (s <= 0)
          return this._blockedSortIndex = null,
          !0;
      var n = t - this._sortX2
        , r = e - this._sortY2
        , o = s > 3 && i.minBounceBackAngle > 0;
      if (o || (this._blockedSortIndex = null),
      Math.abs(n) > s || Math.abs(r) > s) {
          if (o) {
              var h = Math.atan2(n, r)
                , a = Math.atan2(this._sortX2 - this._sortX1, this._sortY2 - this._sortY1)
                , l = Math.atan2(Math.sin(h - a), Math.cos(h - a));
              Math.abs(l) > i.minBounceBackAngle && (this._blockedSortIndex = null)
          }
          return this._sortX1 = this._sortX2,
          this._sortY1 = this._sortY2,
          this._sortX2 = t,
          this._sortY2 = e,
          !0
      }
      return !1
  }
  ,
  zt.prototype._resetStartPredicate = function() {
      var t = this._startPredicateData;
      t && (t.delayTimer && (t.delayTimer = window.clearTimeout(t.delayTimer)),
      this._startPredicateData = null)
  }
  ,
  zt.prototype._handleSort = function() {
      if (this._isActive) {
          var t = this._getGrid()._settings;
          if (!t.dragSort || !t.dragAutoScroll.sortDuringScroll && zt.autoScroller.isItemScrolling(this._item))
              return this._sortX1 = this._sortX2 = this._gridX,
              this._sortY1 = this._sortY2 = this._gridY,
              this._isSortNeeded = !0,
              void (void 0 !== this._sortTimer && (this._sortTimer = window.clearTimeout(this._sortTimer)));
          var e = this._checkHeuristics(this._gridX, this._gridY);
          if (this._isSortNeeded || e) {
              var i = t.dragSortHeuristics.sortInterval;
              i <= 0 || this._isSortNeeded ? (this._isSortNeeded = !1,
              void 0 !== this._sortTimer && (this._sortTimer = window.clearTimeout(this._sortTimer)),
              this._checkOverlap()) : void 0 === this._sortTimer && (this._sortTimer = window.setTimeout(this._handleSortDelayed, i))
          }
      }
  }
  ,
  zt.prototype._handleSortDelayed = function() {
      this._isSortNeeded = !0,
      this._sortTimer = void 0,
      k(this._item._id, this._handleSort)
  }
  ,
  zt.prototype._cancelSort = function() {
      var t;
      this._isSortNeeded = !1,
      void 0 !== this._sortTimer && (this._sortTimer = window.clearTimeout(this._sortTimer)),
      t = this._item._id,
      b.remove(1, "dragSortRead" + t)
  }
  ,
  zt.prototype._finishSort = function() {
      var t = this._getGrid()._settings.dragSort && (this._isSortNeeded || void 0 !== this._sortTimer);
      this._cancelSort(),
      t && this._checkOverlap()
  }
  ,
  zt.prototype._checkOverlap = function() {
      if (this._isActive) {
          var t, e, i, s, n, r, o, h, a = this._item, l = this._getGrid()._settings;
          (t = C(l.dragSortPredicate) ? l.dragSortPredicate(a, this._dragMoveEvent) : zt.defaultSortPredicate(a, l.dragSortPredicate)) && "number" == typeof t.index && (o = "swap" === t.action ? "swap" : "move",
          h = (e = a.getGrid()) !== (s = t.grid || e),
          i = e._items.indexOf(a),
          n = ct(s._items, t.index, h && "move" === o ? 1 : 0),
          (h || n !== this._blockedSortIndex) && (h ? (this._blockedSortIndex = null,
          r = s._items[n],
          e._hasListeners("beforeSend") && e._emit("beforeSend", {
              item: a,
              fromGrid: e,
              fromIndex: i,
              toGrid: s,
              toIndex: n
          }),
          s._hasListeners("beforeReceive") && s._emit("beforeReceive", {
              item: a,
              fromGrid: e,
              fromIndex: i,
              toGrid: s,
              toIndex: n
          }),
          a._gridId = s._id,
          this._isMigrating = a._gridId !== this._gridId,
          e._items.splice(i, 1),
          ut(s._items, a, n),
          a._sortData = null,
          e._hasListeners("send") && e._emit("send", {
              item: a,
              fromGrid: e,
              fromIndex: i,
              toGrid: s,
              toIndex: n
          }),
          s._hasListeners("receive") && s._emit("receive", {
              item: a,
              fromGrid: e,
              fromIndex: i,
              toGrid: s,
              toIndex: n
          }),
          "swap" === o && r && r.isActive() && s._items.indexOf(r) > -1 && s.send(r, e, i, {
              appendTo: this._container || document.body,
              layoutSender: !1,
              layoutReceiver: !1
          }),
          e.layout(),
          s.layout()) : i !== n && (this._blockedSortIndex = i,
          ("swap" === o ? pt : ft)(e._items, i, n),
          e._hasListeners("move") && e._emit("move", {
              item: a,
              fromIndex: i,
              toIndex: n,
              action: o
          }),
          e.layout())))
      }
  }
  ,
  zt.prototype._finishMigration = function() {
      var t, e, i = this._item, s = i._dragRelease, n = i._element, r = i._isActive, o = i.getGrid(), h = o._element, a = o._settings, l = a.dragContainer || h, _ = this._getGrid()._settings, d = n.parentNode, u = r ? _.itemVisibleClass : _.itemHiddenClass, c = r ? a.itemVisibleClass : a.itemHiddenClass;
      this._isMigrating = !1,
      this.destroy(),
      _.itemClass !== a.itemClass && (Ot(n, _.itemClass),
      _t(n, a.itemClass)),
      u !== c && (Ot(n, u),
      _t(n, c)),
      l !== d && (l.appendChild(n),
      e = Rt(d, l, !0),
      (t = qt(n)).x -= e.left,
      t.y -= e.top),
      i._refreshDimensions(),
      e = Rt(l, h, !0),
      s._containerDiffX = e.left,
      s._containerDiffY = e.top,
      i._drag = a.dragEnabled ? new zt(i) : null,
      l !== d && i._setTranslate(t.x, t.y),
      i._visibility.setStyles(r ? a.visibleStyles : a.hiddenStyles),
      s.start()
  }
  ,
  zt.prototype._preStartCheck = function(t) {
      0 === this._startPredicateState && (this._startPredicateState = 1),
      1 === this._startPredicateState ? (this._startPredicateResult = this._startPredicate(this._item, t),
      !0 === this._startPredicateResult ? (this._startPredicateState = 2,
      this._onStart(t)) : !1 === this._startPredicateResult && (this._resetStartPredicate(t),
      this._dragger._reset(),
      this._startPredicateState = 0)) : 2 === this._startPredicateState && this._isActive && this._onMove(t)
  }
  ,
  zt.prototype._preEndCheck = function(t) {
      var e = 2 === this._startPredicateState;
      this._startPredicate(this._item, t),
      this._startPredicateState = 0,
      e && this._isActive && (this._isStarted ? this._onEnd(t) : this.stop())
  }
  ,
  zt.prototype._onStart = function(t) {
      var e, i, s, n = this._item;
      n._isActive && (this._isActive = !0,
      this._dragStartEvent = t,
      zt.autoScroller.addItem(n),
      e = n._id,
      i = this._prepareStart,
      s = this._applyStart,
      b.add(0, "dragStartRead" + e, i),
      b.add(2, "dragStartWrite" + e, s))
  }
  ,
  zt.prototype._prepareStart = function() {
      if (this._isActive) {
          var t = this._item;
          if (t._isActive) {
              var e = t._element
                , i = this._getGrid()
                , s = i._settings
                , n = i._element
                , r = s.dragContainer || n
                , o = bt(r)
                , h = qt(e)
                , a = e.getBoundingClientRect()
                , l = r !== n;
              if (this._container = r,
              this._containingBlock = o,
              this._clientX = a.left,
              this._clientY = a.top,
              this._left = this._gridX = h.x,
              this._top = this._gridY = h.y,
              this._scrollDiffX = this._scrollDiffY = 0,
              this._moveDiffX = this._moveDiffY = 0,
              this._resetHeuristics(this._gridX, this._gridY),
              l) {
                  var _ = Rt(o, n);
                  this._containerDiffX = _.left,
                  this._containerDiffY = _.top
              }
          }
      }
  }
  ,
  zt.prototype._applyStart = function() {
      if (this._isActive) {
          var t = this._item;
          if (t._isActive) {
              var e = this._getGrid()
                , i = t._element
                , s = t._dragRelease
                , n = t._migrate
                , r = this._container !== e._element;
              t.isPositioning() && t._layout.stop(!0, this._left, this._top),
              n._isActive && (this._left -= n._containerDiffX,
              this._top -= n._containerDiffY,
              this._gridX -= n._containerDiffX,
              this._gridY -= n._containerDiffY,
              n.stop(!0, this._left, this._top)),
              t.isReleasing() && s._reset(),
              e._settings.dragPlaceholder.enabled && t._dragPlaceholder.create(),
              this._isStarted = !0,
              e._emit("dragInit", t, this._dragStartEvent),
              r && (i.parentNode === this._container ? (this._gridX -= this._containerDiffX,
              this._gridY -= this._containerDiffY) : (this._left += this._containerDiffX,
              this._top += this._containerDiffY,
              this._container.appendChild(i),
              t._setTranslate(this._left, this._top))),
              _t(i, e._settings.itemDraggingClass),
              this._bindScrollListeners(),
              e._emit("dragStart", t, this._dragStartEvent)
          }
      }
  }
  ,
  zt.prototype._onMove = function(t) {
      var e, i, s, n = this._item;
      n._isActive ? (this._dragMoveEvent = t,
      e = n._id,
      i = this._prepareMove,
      s = this._applyMove,
      b.add(0, "dragMoveRead" + e, i),
      b.add(2, "dragMoveWrite" + e, s),
      k(n._id, this._handleSort)) : this.stop()
  }
  ,
  zt.prototype._prepareMove = function() {
      if (this._isActive && this._item._isActive) {
          var t = this._getGrid()._settings.dragAxis
            , e = this._dragMoveEvent
            , i = this._dragPrevMoveEvent || this._dragStartEvent || e;
          if ("y" !== t) {
              var s = e.clientX - i.clientX;
              this._left = this._left - this._moveDiffX + s,
              this._gridX = this._gridX - this._moveDiffX + s,
              this._clientX = this._clientX - this._moveDiffX + s,
              this._moveDiffX = s
          }
          if ("x" !== t) {
              var n = e.clientY - i.clientY;
              this._top = this._top - this._moveDiffY + n,
              this._gridY = this._gridY - this._moveDiffY + n,
              this._clientY = this._clientY - this._moveDiffY + n,
              this._moveDiffY = n
          }
          this._dragPrevMoveEvent = e
      }
  }
  ,
  zt.prototype._applyMove = function() {
      if (this._isActive) {
          var t = this._item;
          t._isActive && (this._moveDiffX = this._moveDiffY = 0,
          t._setTranslate(this._left, this._top),
          this._getGrid()._emit("dragMove", t, this._dragMoveEvent),
          zt.autoScroller.updateItem(t))
      }
  }
  ,
  zt.prototype._onScroll = function(t) {
      var e, i, s, n = this._item;
      n._isActive ? (this._scrollEvent = t,
      e = n._id,
      i = this._prepareScroll,
      s = this._applyScroll,
      b.add(0, "dragScrollRead" + e, i),
      b.add(2, "dragScrollWrite" + e, s),
      k(n._id, this._handleSort)) : this.stop()
  }
  ,
  zt.prototype._prepareScroll = function() {
      if (this._isActive) {
          var t = this._item;
          if (t._isActive) {
              var e = t._element
                , i = this._getGrid()
                , s = i._element
                , n = i._settings.dragAxis
                , r = "y" !== n
                , o = "x" !== n
                , h = e.getBoundingClientRect();
              if (this._container !== s) {
                  var a = Rt(this._containingBlock, s);
                  this._containerDiffX = a.left,
                  this._containerDiffY = a.top
              }
              if (r) {
                  var l = this._clientX - this._moveDiffX - this._scrollDiffX - h.left;
                  this._left = this._left - this._scrollDiffX + l,
                  this._scrollDiffX = l
              }
              if (o) {
                  var _ = this._clientY - this._moveDiffY - this._scrollDiffY - h.top;
                  this._top = this._top - this._scrollDiffY + _,
                  this._scrollDiffY = _
              }
              this._gridX = this._left - this._containerDiffX,
              this._gridY = this._top - this._containerDiffY
          }
      }
  }
  ,
  zt.prototype._applyScroll = function() {
      if (this._isActive) {
          var t = this._item;
          t._isActive && (this._scrollDiffX = this._scrollDiffY = 0,
          t._setTranslate(this._left, this._top),
          this._getGrid()._emit("dragScroll", t, this._scrollEvent))
      }
  }
  ,
  zt.prototype._onEnd = function(t) {
      var e = this._item
        , i = e._element
        , s = this._getGrid()
        , n = s._settings
        , r = e._dragRelease;
      e._isActive ? (T(e._id),
      x(e._id),
      R(e._id),
      this._finishSort(),
      this._unbindScrollListeners(),
      r._containerDiffX = this._containerDiffX,
      r._containerDiffY = this._containerDiffY,
      this._reset(),
      Ot(i, n.itemDraggingClass),
      zt.autoScroller.removeItem(e),
      s._emit("dragEnd", e, t),
      this._isMigrating ? this._finishMigration() : r.start()) : this.stop()
  }
  ;
  var jt = /^(webkit|moz|ms|o|Webkit|Moz|MS|O)(?=[A-Z])/
    , Qt = {};
  function Ut(t) {
      var e = Qt[t];
      return e || ((e = t.replace(jt, "")) !== t && (e = e[0].toLowerCase() + e.slice(1)),
      Qt[t] = e,
      e)
  }
  function Zt(t, e) {
      for (var i in e)
          t.style[i] = e[i]
  }
  var Jt, $t, Kt = !(!Element || !C(Element.prototype.animate)), te = !!(Element && (Jt = Element.prototype.animate,
  $t = window.Symbol,
  Jt && C($t) && C($t.toString) && $t(Jt).toString().indexOf("[native code]") > -1));
  function ee(t) {
      this._element = t,
      this._animation = null,
      this._duration = 0,
      this._easing = "",
      this._callback = null,
      this._props = [],
      this._values = [],
      this._isDestroyed = !1,
      this._onFinish = this._onFinish.bind(this)
  }
  function ie(t, e) {
      var i = {};
      for (var s in t)
          i[e ? s : Ut(s)] = t[s];
      return i
  }
  function se(t, e) {
      return "translateX(" + t + "px) translateY(" + e + "px)"
  }
  function ne(t) {
      this._item = t,
      this._animation = new ee,
      this._element = null,
      this._className = "",
      this._didMigrate = !1,
      this._resetAfterLayout = !1,
      this._left = 0,
      this._top = 0,
      this._transX = 0,
      this._transY = 0,
      this._nextTransX = 0,
      this._nextTransY = 0,
      this._setupAnimation = this._setupAnimation.bind(this),
      this._startAnimation = this._startAnimation.bind(this),
      this._updateDimensions = this._updateDimensions.bind(this),
      this._onLayoutStart = this._onLayoutStart.bind(this),
      this._onLayoutEnd = this._onLayoutEnd.bind(this),
      this._onReleaseEnd = this._onReleaseEnd.bind(this),
      this._onMigrate = this._onMigrate.bind(this),
      this._onHide = this._onHide.bind(this)
  }
  function re(t) {
      this._item = t,
      this._isActive = !1,
      this._isDestroyed = !1,
      this._isPositioningStarted = !1,
      this._containerDiffX = 0,
      this._containerDiffY = 0
  }
  ee.prototype.start = function(t, e, i) {
      if (!this._isDestroyed) {
          var s = this._element
            , n = i || {};
          if (!Kt)
              return Zt(s, e),
              this._callback = C(n.onFinish) ? n.onFinish : null,
              void this._onFinish();
          var r, o, h, a = this._animation, l = this._props, _ = this._values, d = n.duration || 300, u = n.easing || "ease", c = !1;
          if (a && (o = 0,
          d === this._duration && u === this._easing || (c = !0),
          !c)) {
              for (r in e)
                  if (++o,
                  -1 === (h = l.indexOf(r)) || e[r] !== _[h]) {
                      c = !0;
                      break
                  }
              o !== l.length && (c = !0)
          }
          if (c && a.cancel(),
          this._callback = C(n.onFinish) ? n.onFinish : null,
          !a || c) {
              for (r in l.length = _.length = 0,
              e)
                  l.push(r),
                  _.push(e[r]);
              this._duration = d,
              this._easing = u,
              this._animation = s.animate([ie(t, te), ie(e, te)], {
                  duration: d,
                  easing: u
              }),
              this._animation.onfinish = this._onFinish,
              Zt(s, e)
          }
      }
  }
  ,
  ee.prototype.stop = function() {
      !this._isDestroyed && this._animation && (this._animation.cancel(),
      this._animation = this._callback = null,
      this._props.length = this._values.length = 0)
  }
  ,
  ee.prototype.getCurrentStyles = function() {
      return Vt(element, currentProps)
  }
  ,
  ee.prototype.isAnimating = function() {
      return !!this._animation
  }
  ,
  ee.prototype.destroy = function() {
      this._isDestroyed || (this.stop(),
      this._element = null,
      this._isDestroyed = !0)
  }
  ,
  ee.prototype._onFinish = function() {
      var t = this._callback;
      this._animation = this._callback = null,
      this._props.length = this._values.length = 0,
      t && t()
  }
  ,
  ne.prototype._updateDimensions = function() {
      this.isActive() && Zt(this._element, {
          width: this._item._width + "px",
          height: this._item._height + "px"
      })
  }
  ,
  ne.prototype._onLayoutStart = function(t, e) {
      var i = this._item;
      if (-1 !== t.indexOf(i)) {
          var s = i._left
            , n = i._top
            , r = this._left
            , o = this._top;
          if (this._left = s,
          this._top = n,
          e || this._didMigrate || r !== s || o !== n) {
              var h, a, l, _ = s + i._marginLeft, d = n + i._marginTop, u = i.getGrid();
              if (!(!e && u._settings.layoutDuration > 0) || this._didMigrate)
                  return L(i._id),
                  this._element.style[mt] = se(_, d),
                  this._animation.stop(),
                  void (this._didMigrate && (u.getElement().appendChild(this._element),
                  this._didMigrate = !1));
              this._nextTransX = _,
              this._nextTransY = d,
              h = i._id,
              a = this._setupAnimation,
              l = this._startAnimation,
              b.add(0, "placeholderLayoutRead" + h, a),
              b.add(2, "placeholderLayoutWrite" + h, l)
          }
      } else
          this.reset()
  }
  ,
  ne.prototype._setupAnimation = function() {
      if (this.isActive()) {
          var t = qt(this._element);
          this._transX = t.x,
          this._transY = t.y
      }
  }
  ,
  ne.prototype._startAnimation = function() {
      if (this.isActive()) {
          var t = this._animation
            , e = this._transX
            , i = this._transY
            , s = this._nextTransX
            , n = this._nextTransY;
          if (e !== s || i !== n) {
              var r = this._item.getGrid()._settings
                , o = {}
                , h = {};
              o[mt] = se(e, i),
              h[mt] = se(s, n),
              t.start(o, h, {
                  duration: r.layoutDuration,
                  easing: r.layoutEasing,
                  onFinish: this._onLayoutEnd
              })
          } else
              t.isAnimating() && (this._element.style[mt] = se(s, n),
              t.stop())
      }
  }
  ,
  ne.prototype._onLayoutEnd = function() {
      this._resetAfterLayout && this.reset()
  }
  ,
  ne.prototype._onReleaseEnd = function(t) {
      if (t._id === this._item._id) {
          if (!this._animation.isAnimating())
              return void this.reset();
          this._resetAfterLayout = !0
      }
  }
  ,
  ne.prototype._onMigrate = function(t) {
      if (t.item === this._item) {
          var e = this._item.getGrid()
            , i = t.toGrid;
          e.off("dragReleaseEnd", this._onReleaseEnd),
          e.off("layoutStart", this._onLayoutStart),
          e.off("beforeSend", this._onMigrate),
          e.off("hideStart", this._onHide),
          i.on("dragReleaseEnd", this._onReleaseEnd),
          i.on("layoutStart", this._onLayoutStart),
          i.on("beforeSend", this._onMigrate),
          i.on("hideStart", this._onHide),
          this._didMigrate = !0
      }
  }
  ,
  ne.prototype._onHide = function(t) {
      t.indexOf(this._item) > -1 && this.reset()
  }
  ,
  ne.prototype.create = function() {
      if (this.isActive())
          this._resetAfterLayout = !1;
      else {
          var t, e = this._item, i = e.getGrid(), s = i._settings, n = this._animation;
          this._left = e._left,
          this._top = e._top,
          t = C(s.dragPlaceholder.createElement) ? s.dragPlaceholder.createElement(e) : document.createElement("div"),
          this._element = t,
          n._element = t,
          this._className = s.itemPlaceholderClass || "",
          this._className && _t(t, this._className),
          Zt(t, {
              position: "absolute",
              left: "0px",
              top: "0px",
              width: e._width + "px",
              height: e._height + "px"
          }),
          t.style[mt] = se(e._left + e._marginLeft, e._top + e._marginTop),
          i.on("layoutStart", this._onLayoutStart),
          i.on("dragReleaseEnd", this._onReleaseEnd),
          i.on("beforeSend", this._onMigrate),
          i.on("hideStart", this._onHide),
          C(s.dragPlaceholder.onCreate) && s.dragPlaceholder.onCreate(e, t),
          i.getElement().appendChild(t)
      }
  }
  ,
  ne.prototype.reset = function() {
      if (this.isActive()) {
          var t, e = this._element, i = this._item, s = i.getGrid(), n = s._settings, r = this._animation;
          this._resetAfterLayout = !1,
          L(i._id),
          t = i._id,
          b.remove(2, "placeholderResizeWrite" + t),
          r.stop(),
          r._element = null,
          s.off("dragReleaseEnd", this._onReleaseEnd),
          s.off("layoutStart", this._onLayoutStart),
          s.off("beforeSend", this._onMigrate),
          s.off("hideStart", this._onHide),
          this._className && (Ot(e, this._className),
          this._className = ""),
          e.parentNode.removeChild(e),
          this._element = null,
          C(n.dragPlaceholder.onRemove) && n.dragPlaceholder.onRemove(i, e)
      }
  }
  ,
  ne.prototype.isActive = function() {
      return !!this._element
  }
  ,
  ne.prototype.getElement = function() {
      return this._element
  }
  ,
  ne.prototype.updateDimensions = function() {
      var t, e;
      this.isActive() && (t = this._item._id,
      e = this._updateDimensions,
      b.add(2, "placeholderResizeWrite" + t, e))
  }
  ,
  ne.prototype.destroy = function() {
      this.reset(),
      this._animation.destroy(),
      this._item = this._animation = null
  }
  ,
  re.prototype.start = function() {
      if (!this._isDestroyed && !this._isActive) {
          var t = this._item
            , e = t.getGrid()
            , i = e._settings;
          this._isActive = !0,
          _t(t._element, i.itemReleasingClass),
          i.dragRelease.useDragContainer || this._placeToGrid(),
          e._emit("dragReleaseStart", t),
          e._nextLayoutData || t._layout.start(!1)
      }
  }
  ,
  re.prototype.stop = function(t, e, i) {
      if (!this._isDestroyed && this._isActive) {
          var s = this._item
            , n = s.getGrid();
          t || void 0 !== e && void 0 !== i || (e = s._left,
          i = s._top);
          var r = this._placeToGrid(e, i);
          this._reset(r),
          t || n._emit("dragReleaseEnd", s)
      }
  }
  ,
  re.prototype.isJustReleased = function() {
      return this._isActive && !1 === this._isPositioningStarted
  }
  ,
  re.prototype.destroy = function() {
      this._isDestroyed || (this.stop(!0),
      this._item = null,
      this._isDestroyed = !0)
  }
  ,
  re.prototype._placeToGrid = function(t, e) {
      if (!this._isDestroyed) {
          var i = this._item
            , s = i._element
            , n = i.getGrid()._element
            , r = !1;
          if (s.parentNode !== n) {
              if (void 0 === t || void 0 === e) {
                  var o = qt(s);
                  t = o.x - this._containerDiffX,
                  e = o.y - this._containerDiffY
              }
              n.appendChild(s),
              i._setTranslate(t, e),
              r = !0
          }
          return this._containerDiffX = 0,
          this._containerDiffY = 0,
          r
      }
  }
  ,
  re.prototype._reset = function(t) {
      if (!this._isDestroyed) {
          var e = this._item
            , i = e.getGrid()._settings.itemReleasingClass;
          this._isActive = !1,
          this._isPositioningStarted = !1,
          this._containerDiffX = 0,
          this._containerDiffY = 0,
          i && (t && e._element.clientWidth,
          Ot(e._element, i))
      }
  }
  ;
  function oe(t) {
      var e = t._element
        , i = e.style;
      this._item = t,
      this._isActive = !1,
      this._isDestroyed = !1,
      this._isInterrupted = !1,
      this._currentStyles = {},
      this._targetStyles = {},
      this._nextLeft = 0,
      this._nextTop = 0,
      this._offsetLeft = 0,
      this._offsetTop = 0,
      this._skipNextAnimation = !1,
      this._animOptions = {
          onFinish: this._finish.bind(this),
          duration: 0,
          easing: 0
      },
      i.left = "0px",
      i.top = "0px",
      t._setTranslate(0, 0),
      this._animation = new ee(e),
      this._queue = "layout-" + t._id,
      this._setupAnimation = this._setupAnimation.bind(this),
      this._startAnimation = this._startAnimation.bind(this)
  }
  function he(t) {
      this._item = t,
      this._isActive = !1,
      this._isDestroyed = !1,
      this._container = !1,
      this._containerDiffX = 0,
      this._containerDiffY = 0
  }
  function ae(t) {
      var e = t._isActive
        , i = t._element
        , s = i.children[0]
        , n = t.getGrid()._settings;
      if (!s)
          throw new Error("No valid child element found within item element.");
      this._item = t,
      this._isDestroyed = !1,
      this._isHidden = !e,
      this._isHiding = !1,
      this._isShowing = !1,
      this._childElement = s,
      this._currentStyleProps = [],
      this._animation = new ee(s),
      this._queue = "visibility-" + t._id,
      this._finishShow = this._finishShow.bind(this),
      this._finishHide = this._finishHide.bind(this),
      i.style.display = e ? "" : "none",
      _t(i, e ? n.itemVisibleClass : n.itemHiddenClass),
      this.setStyles(e ? n.visibleStyles : n.hiddenStyles)
  }
  oe.prototype.start = function(t, e) {
      if (!this._isDestroyed) {
          var i, s, n, r = this._item, o = r._dragRelease, h = r.getGrid()._settings, a = this._isActive, l = o.isJustReleased(), _ = l ? h.dragRelease.duration : h.layoutDuration, d = l ? h.dragRelease.easing : h.layoutEasing, u = !t && !this._skipNextAnimation && _ > 0;
          if (a && (A(r._id),
          r._emitter.burst(this._queue, !0, r)),
          l && (o._isPositioningStarted = !0),
          C(e) && r._emitter.on(this._queue, e),
          this._skipNextAnimation = !1,
          !u)
              return this._updateOffsets(),
              r._setTranslate(this._nextLeft, this._nextTop),
              this._animation.stop(),
              void this._finish();
          this._animation.isAnimating() && (this._animation._animation.onfinish = null),
          this._isActive = !0,
          this._animOptions.easing = d,
          this._animOptions.duration = _,
          this._isInterrupted = a,
          i = r._id,
          s = this._setupAnimation,
          n = this._startAnimation,
          b.add(0, "layoutRead" + i, s),
          b.add(2, "layoutWrite" + i, n)
      }
  }
  ,
  oe.prototype.stop = function(t, e, i) {
      if (!this._isDestroyed && this._isActive) {
          var s = this._item;
          if (A(s._id),
          this._animation.isAnimating()) {
              if (void 0 === e || void 0 === i) {
                  var n = qt(s._element);
                  e = n.x,
                  i = n.y
              }
              s._setTranslate(e, i),
              this._animation.stop()
          }
          Ot(s._element, s.getGrid()._settings.itemPositioningClass),
          this._isActive = !1,
          t && s._emitter.burst(this._queue, !0, s)
      }
  }
  ,
  oe.prototype.destroy = function() {
      if (!this._isDestroyed) {
          var t = this._item._element.style;
          this.stop(!0, 0, 0),
          this._item._emitter.clear(this._queue),
          this._animation.destroy(),
          t[mt] = "",
          t.left = "",
          t.top = "",
          this._item = null,
          this._currentStyles = null,
          this._targetStyles = null,
          this._animOptions = null,
          this._isDestroyed = !0
      }
  }
  ,
  oe.prototype._updateOffsets = function() {
      if (!this._isDestroyed) {
          var t = this._item
            , e = t._migrate
            , i = t._dragRelease;
          this._offsetLeft = i._isActive ? i._containerDiffX : e._isActive ? e._containerDiffX : 0,
          this._offsetTop = i._isActive ? i._containerDiffY : e._isActive ? e._containerDiffY : 0,
          this._nextLeft = this._item._left + this._offsetLeft,
          this._nextTop = this._item._top + this._offsetTop
      }
  }
  ,
  oe.prototype._finish = function() {
      if (!this._isDestroyed) {
          var t = this._item
            , e = t._migrate
            , i = t._dragRelease;
          t._tX = this._nextLeft,
          t._tY = this._nextTop,
          this._isActive && (this._isActive = !1,
          Ot(t._element, t.getGrid()._settings.itemPositioningClass)),
          i._isActive && i.stop(),
          e._isActive && e.stop(),
          t._emitter.burst(this._queue, !1, t)
      }
  }
  ,
  oe.prototype._setupAnimation = function() {
      var t = this._item;
      if (void 0 === t._tX || void 0 === t._tY) {
          var e = qt(t._element);
          t._tX = e.x,
          t._tY = e.y
      }
  }
  ,
  oe.prototype._startAnimation = function() {
      var t = this._item
        , e = t.getGrid()._settings
        , i = this._animOptions.duration <= 0;
      this._updateOffsets();
      var s = Math.abs(t._left - (t._tX - this._offsetLeft))
        , n = Math.abs(t._top - (t._tY - this._offsetTop));
      if (i || s < 2 && n < 2)
          return (s || n || this._isInterrupted) && t._setTranslate(this._nextLeft, this._nextTop),
          this._animation.stop(),
          void this._finish();
      this._isInterrupted || _t(t._element, e.itemPositioningClass),
      this._currentStyles[mt] = se(t._tX, t._tY),
      this._targetStyles[mt] = se(this._nextLeft, this._nextTop),
      t._tX = t._tY = void 0,
      this._animation.start(this._currentStyles, this._targetStyles, this._animOptions)
  }
  ,
  he.prototype.start = function(t, e, i) {
      if (!this._isDestroyed) {
          var s, n, r, o, h, a, l, _, d, u, c = this._item, f = c._element, p = c.isActive(), m = c.isVisible(), g = c.getGrid(), v = g._settings, y = t._settings, S = t._element, w = t._items, D = g._items.indexOf(c), b = i || document.body;
          if ("number" == typeof e)
              s = ct(w, e, 1);
          else {
              if (!(n = t.getItem(e)))
                  return;
              s = w.indexOf(n)
          }
          (c.isPositioning() || this._isActive || c.isReleasing()) && (l = (a = qt(f)).x,
          _ = a.y),
          c.isPositioning() && c._layout.stop(!0, l, _),
          this._isActive && (l -= this._containerDiffX,
          _ -= this._containerDiffY,
          this.stop(!0, l, _)),
          c.isReleasing() && (l -= c._dragRelease._containerDiffX,
          _ -= c._dragRelease._containerDiffY,
          c._dragRelease.stop(!0, l, _)),
          c._visibility.stop(!0),
          c._drag && c._drag.destroy(),
          g._hasListeners("beforeSend") && g._emit("beforeSend", {
              item: c,
              fromGrid: g,
              fromIndex: D,
              toGrid: t,
              toIndex: s
          }),
          t._hasListeners("beforeReceive") && t._emit("beforeReceive", {
              item: c,
              fromGrid: g,
              fromIndex: D,
              toGrid: t,
              toIndex: s
          }),
          v.itemClass !== y.itemClass && (Ot(f, v.itemClass),
          _t(f, y.itemClass)),
          (d = m ? v.itemVisibleClass : v.itemHiddenClass) !== (u = m ? y.itemVisibleClass : y.itemHiddenClass) && (Ot(f, d),
          _t(f, u)),
          g._items.splice(D, 1),
          ut(w, c, s),
          c._gridId = t._id,
          p ? b !== (r = f.parentNode) && (b.appendChild(f),
          o = Rt(b, r, !0),
          a || (l = (a = qt(f)).x,
          _ = a.y),
          c._setTranslate(l + o.left, _ + o.top)) : S.appendChild(f),
          c._visibility.setStyles(m ? y.visibleStyles : y.hiddenStyles),
          p && (h = Rt(b, S, !0)),
          c._refreshDimensions(),
          c._sortData = null,
          c._drag = y.dragEnabled ? new zt(c) : null,
          p ? (this._isActive = !0,
          this._container = b,
          this._containerDiffX = h.left,
          this._containerDiffY = h.top) : (this._isActive = !1,
          this._container = null,
          this._containerDiffX = 0,
          this._containerDiffY = 0),
          g._hasListeners("send") && g._emit("send", {
              item: c,
              fromGrid: g,
              fromIndex: D,
              toGrid: t,
              toIndex: s
          }),
          t._hasListeners("receive") && t._emit("receive", {
              item: c,
              fromGrid: g,
              fromIndex: D,
              toGrid: t,
              toIndex: s
          })
      }
  }
  ,
  he.prototype.stop = function(t, e, i) {
      if (!this._isDestroyed && this._isActive) {
          var s, n = this._item, r = n._element, o = n.getGrid()._element;
          this._container !== o && (void 0 !== e && void 0 !== i || (t ? (e = (s = qt(r)).x - this._containerDiffX,
          i = s.y - this._containerDiffY) : (e = n._left,
          i = n._top)),
          o.appendChild(r),
          n._setTranslate(e, i)),
          this._isActive = !1,
          this._container = null,
          this._containerDiffX = 0,
          this._containerDiffY = 0
      }
  }
  ,
  he.prototype.destroy = function() {
      this._isDestroyed || (this.stop(!0),
      this._item = null,
      this._isDestroyed = !0)
  }
  ,
  ae.prototype.show = function(t, e) {
      if (!this._isDestroyed) {
          var i = this._item
            , s = i._element
            , n = C(e) ? e : null
            , r = i.getGrid()._settings;
          this._isShowing || this._isHidden ? !this._isShowing || t ? (this._isShowing || (i._emitter.burst(this._queue, !0, i),
          Ot(s, r.itemHiddenClass),
          _t(s, r.itemVisibleClass),
          this._isHiding || (s.style.display = "")),
          n && i._emitter.on(this._queue, n),
          this._isShowing = !0,
          this._isHiding = this._isHidden = !1,
          this._startAnimation(!0, t, this._finishShow)) : n && i._emitter.on(this._queue, n) : n && n(!1, i)
      }
  }
  ,
  ae.prototype.hide = function(t, e) {
      if (!this._isDestroyed) {
          var i = this._item
            , s = i._element
            , n = C(e) ? e : null
            , r = i.getGrid()._settings;
          this._isHiding || !this._isHidden ? !this._isHiding || t ? (this._isHiding || (i._emitter.burst(this._queue, !0, i),
          _t(s, r.itemHiddenClass),
          Ot(s, r.itemVisibleClass)),
          n && i._emitter.on(this._queue, n),
          this._isHidden = this._isHiding = !0,
          this._isShowing = !1,
          this._startAnimation(!1, t, this._finishHide)) : n && i._emitter.on(this._queue, n) : n && n(!1, i)
      }
  }
  ,
  ae.prototype.stop = function(t) {
      if (!this._isDestroyed && (this._isHiding || this._isShowing)) {
          var e = this._item;
          E(e._id),
          this._animation.stop(),
          t && e._emitter.burst(this._queue, !0, e)
      }
  }
  ,
  ae.prototype.setStyles = function(t) {
      var e = this._childElement
        , i = this._currentStyleProps;
      for (var s in this._removeCurrentStyles(),
      t)
          i.push(s),
          e.style[s] = t[s]
  }
  ,
  ae.prototype.destroy = function() {
      if (!this._isDestroyed) {
          var t = this._item
            , e = t._element
            , i = t.getGrid()._settings;
          this.stop(!0),
          t._emitter.clear(this._queue),
          this._animation.destroy(),
          this._removeCurrentStyles(),
          Ot(e, i.itemVisibleClass),
          Ot(e, i.itemHiddenClass),
          e.style.display = "",
          this._isHiding = this._isShowing = !1,
          this._isDestroyed = this._isHidden = !0
      }
  }
  ,
  ae.prototype._startAnimation = function(t, e, i) {
      if (!this._isDestroyed) {
          var s, n = this._item, r = this._animation, o = this._childElement, h = n.getGrid()._settings, a = t ? h.visibleStyles : h.hiddenStyles, l = t ? h.showDuration : h.hideDuration, _ = t ? h.showEasing : h.hideEasing, d = e || l <= 0;
          if (a) {
              if (E(n._id),
              d)
                  return Zt(o, a),
                  r.stop(),
                  void (i && i());
              var u, c, f;
              r.isAnimating() && (r._animation.onfinish = null),
              u = n._id,
              c = function() {
                  s = Vt(o, a)
              }
              ,
              f = function() {
                  r.start(s, a, {
                      duration: l,
                      easing: _,
                      onFinish: i
                  })
              }
              ,
              b.add(0, "visibilityRead" + u, c),
              b.add(2, "visibilityWrite" + u, f)
          } else
              i && i()
      }
  }
  ,
  ae.prototype._finishShow = function() {
      this._isHidden || (this._isShowing = !1,
      this._item._emitter.burst(this._queue, !1, this._item))
  }
  ,
  ae.prototype._finishHide = function() {
      if (this._isHidden) {
          var t = this._item;
          this._isHiding = !1,
          t._layout.stop(!0, 0, 0),
          t._element.style.display = "none",
          t._emitter.burst(this._queue, !1, t)
      }
  }
  ,
  ae.prototype._removeCurrentStyles = function() {
      for (var t = this._childElement, e = this._currentStyleProps, i = 0; i < e.length; i++)
          t.style[e[i]] = "";
      e.length = 0
  }
  ;
  var le = 0;
  function _e() {
      return ++le
  }
  function de(t, i, s) {
      var n = t._settings;
      if (e) {
          if (e.has(i))
              throw new Error("You can only create one Muuri Item per element!");
          e.set(i, this)
      }
      this._id = _e(),
      this._gridId = t._id,
      this._element = i,
      this._isDestroyed = !1,
      this._left = 0,
      this._top = 0,
      this._width = 0,
      this._height = 0,
      this._marginLeft = 0,
      this._marginRight = 0,
      this._marginTop = 0,
      this._marginBottom = 0,
      this._tX = void 0,
      this._tY = void 0,
      this._sortData = null,
      this._emitter = new r,
      i.parentNode !== t._element && t._element.appendChild(i),
      _t(i, n.itemClass),
      "boolean" != typeof s && (s = "none" !== O(i, "display")),
      this._isActive = s,
      this._visibility = new ae(this),
      this._layout = new oe(this),
      this._migrate = new he(this),
      this._drag = n.dragEnabled ? new zt(this) : null,
      this._dragRelease = new re(this),
      this._dragPlaceholder = new ne(this)
  }
  function ue(t) {
      var e, i, s, n, r, o = .001;
      function h(t) {
          return ((1e3 * t + .5 << 0) / 10 << 0) / 100
      }
      function a() {
          this.currentRects = [],
          this.nextRects = [],
          this.rectTarget = {},
          this.rectStore = [],
          this.slotSizes = [],
          this.rectId = 0,
          this.slotIndex = -1,
          this.slotData = {
              left: 0,
              top: 0,
              width: 0,
              height: 0
          },
          this.sortRectsLeftTop = this.sortRectsLeftTop.bind(this),
          this.sortRectsTopLeft = this.sortRectsTopLeft.bind(this)
      }
      if (a.prototype.computeLayout = function(t, e) {
          var i, s, n, r, o, a, l = t.items, _ = t.slots, d = !!(1 & e), u = !!(2 & e), c = !!(4 & e), f = !!(8 & e), p = !!(16 & e), m = "number" == typeof l[0];
          if (!l.length)
              return t;
          for (s = m ? 2 : 1,
          i = 0; i < l.length; i += s)
              m ? (r = l[i],
              o = l[i + 1]) : (r = (n = l[i])._width + n._marginLeft + n._marginRight,
              o = n._height + n._marginTop + n._marginBottom),
              p && (r = h(r),
              o = h(o)),
              a = this.computeNextSlot(t, r, o, d, u),
              u ? a.left + a.width > t.width && (t.width = a.left + a.width) : a.top + a.height > t.height && (t.height = a.top + a.height),
              _[++this.slotIndex] = a.left,
              _[++this.slotIndex] = a.top,
              (c || f) && this.slotSizes.push(a.width, a.height);
          if (c)
              for (i = 0; i < _.length; i += 2)
                  _[i] = t.width - (_[i] + this.slotSizes[i]);
          if (f)
              for (i = 1; i < _.length; i += 2)
                  _[i] = t.height - (_[i] + this.slotSizes[i]);
          return this.slotSizes.length = 0,
          this.currentRects.length = 0,
          this.nextRects.length = 0,
          this.rectId = 0,
          this.slotIndex = -1,
          t
      }
      ,
      a.prototype.computeNextSlot = function(t, e, i, s, n) {
          var r, h, a, l, _, d = this.slotData, u = this.currentRects, c = this.nextRects, f = !1;
          for (c.length = 0,
          d.left = null,
          d.top = null,
          d.width = e,
          d.height = i,
          l = 0; l < u.length; l++)
              if ((h = u[l]) && (r = this.getRect(h),
              d.width <= r.width + o && d.height <= r.height + o)) {
                  d.left = r.left,
                  d.top = r.top;
                  break
              }
          if (null === d.left && (n ? (d.left = t.width,
          d.top = 0) : (d.left = 0,
          d.top = t.height),
          s || (f = !0)),
          !n && d.top + d.height > t.height + o && (d.left > .5 && c.push(this.addRect(0, t.height, d.left, 1 / 0)),
          d.left + d.width < t.width - .5 && c.push(this.addRect(d.left + d.width, t.height, t.width - d.left - d.width, 1 / 0)),
          t.height = d.top + d.height),
          n && d.left + d.width > t.width + o && (d.top > .5 && c.push(this.addRect(t.width, 0, 1 / 0, d.top)),
          d.top + d.height < t.height - .5 && c.push(this.addRect(t.width, d.top + d.height, 1 / 0, t.height - d.top - d.height)),
          t.width = d.left + d.width),
          !f)
              for (s && (l = 0); l < u.length; l++)
                  if (h = u[l])
                      for (r = this.getRect(h),
                      a = this.splitRect(r, d),
                      _ = 0; _ < a.length; _++)
                          h = a[_],
                          r = this.getRect(h),
                          (n ? r.left + o < t.width - o : r.top + o < t.height - o) && c.push(h);
          return c.length > 1 && this.purgeRects(c).sort(n ? this.sortRectsLeftTop : this.sortRectsTopLeft),
          this.currentRects = c,
          this.nextRects = u,
          d
      }
      ,
      a.prototype.addRect = function(t, e, i, s) {
          var n = ++this.rectId;
          return this.rectStore[n] = t || 0,
          this.rectStore[++this.rectId] = e || 0,
          this.rectStore[++this.rectId] = i || 0,
          this.rectStore[++this.rectId] = s || 0,
          n
      }
      ,
      a.prototype.getRect = function(t, e) {
          return e || (e = this.rectTarget),
          e.left = this.rectStore[t] || 0,
          e.top = this.rectStore[++t] || 0,
          e.width = this.rectStore[++t] || 0,
          e.height = this.rectStore[++t] || 0,
          e
      }
      ,
      a.prototype.splitRect = (e = [],
      i = 0,
      s = 0,
      function(t, n) {
          return e.length = 0,
          t.left + t.width <= n.left + o || n.left + n.width <= t.left + o || t.top + t.height <= n.top + o || n.top + n.height <= t.top + o ? (e.push(this.addRect(t.left, t.top, t.width, t.height)),
          e) : ((i = n.left - t.left) >= .5 && e.push(this.addRect(t.left, t.top, i, t.height)),
          (i = t.left + t.width - (n.left + n.width)) >= .5 && e.push(this.addRect(n.left + n.width, t.top, i, t.height)),
          (s = n.top - t.top) >= .5 && e.push(this.addRect(t.left, t.top, t.width, s)),
          (s = t.top + t.height - (n.top + n.height)) >= .5 && e.push(this.addRect(t.left, n.top + n.height, t.width, s)),
          e)
      }
      ),
      a.prototype.isRectAWithinRectB = function(t, e) {
          return t.left + o >= e.left && t.top + o >= e.top && t.left + t.width - o <= e.left + e.width && t.top + t.height - o <= e.top + e.height
      }
      ,
      a.prototype.purgeRects = (n = {},
      r = {},
      function(t) {
          for (var e, i = t.length; i--; )
              if (e = t.length,
              t[i])
                  for (this.getRect(t[i], n); e--; )
                      if (t[e] && i !== e && (this.getRect(t[e], r),
                      this.isRectAWithinRectB(n, r))) {
                          t[i] = 0;
                          break
                      }
          return t
      }
      ),
      a.prototype.sortRectsTopLeft = function() {
          var t = {}
            , e = {};
          return function(i, s) {
              return this.getRect(i, t),
              this.getRect(s, e),
              t.top < e.top && t.top + o < e.top ? -1 : t.top > e.top && t.top - o > e.top ? 1 : t.left < e.left && t.left + o < e.left ? -1 : t.left > e.left && t.left - o > e.left ? 1 : 0
          }
      }(),
      a.prototype.sortRectsLeftTop = function() {
          var t = {}
            , e = {};
          return function(i, s) {
              return this.getRect(i, t),
              this.getRect(s, e),
              t.left < e.left && t.left + o < e.left ? -1 : t.left > e.left && t.left - o < e.left ? 1 : t.top < e.top && t.top + o < e.top ? -1 : t.top > e.top && t.top - o > e.top ? 1 : 0
          }
      }(),
      t) {
          var l = new a;
          self.onmessage = function(t) {
              var e = new Float32Array(t.data)
                , i = e.subarray(4, e.length)
                , s = new Float32Array(i.length)
                , n = e[3]
                , r = {
                  items: i,
                  slots: s,
                  width: e[1],
                  height: e[2]
              };
              l.computeLayout(r, n),
              e[1] = r.width,
              e[2] = r.height,
              e.set(r.slots, 4),
              postMessage(e.buffer, [e.buffer])
          }
      }
      return a
  }
  de.prototype.getGrid = function() {
      return t[this._gridId]
  }
  ,
  de.prototype.getElement = function() {
      return this._element
  }
  ,
  de.prototype.getWidth = function() {
      return this._width
  }
  ,
  de.prototype.getHeight = function() {
      return this._height
  }
  ,
  de.prototype.getMargin = function() {
      return {
          left: this._marginLeft,
          right: this._marginRight,
          top: this._marginTop,
          bottom: this._marginBottom
      }
  }
  ,
  de.prototype.getPosition = function() {
      return {
          left: this._left,
          top: this._top
      }
  }
  ,
  de.prototype.isActive = function() {
      return this._isActive
  }
  ,
  de.prototype.isVisible = function() {
      return !!this._visibility && !this._visibility._isHidden
  }
  ,
  de.prototype.isShowing = function() {
      return !(!this._visibility || !this._visibility._isShowing)
  }
  ,
  de.prototype.isHiding = function() {
      return !(!this._visibility || !this._visibility._isHiding)
  }
  ,
  de.prototype.isPositioning = function() {
      return !(!this._layout || !this._layout._isActive)
  }
  ,
  de.prototype.isDragging = function() {
      return !(!this._drag || !this._drag._isActive)
  }
  ,
  de.prototype.isReleasing = function() {
      return !(!this._dragRelease || !this._dragRelease._isActive)
  }
  ,
  de.prototype.isDestroyed = function() {
      return this._isDestroyed
  }
  ,
  de.prototype._refreshDimensions = function(t) {
      if (!(this._isDestroyed || !0 !== t && this._visibility._isHidden)) {
          var e = this._element
            , i = this._dragPlaceholder
            , s = e.getBoundingClientRect();
          this._width = s.width,
          this._height = s.height,
          this._marginLeft = Math.max(0, H(e, "margin-left")),
          this._marginRight = Math.max(0, H(e, "margin-right")),
          this._marginTop = Math.max(0, H(e, "margin-top")),
          this._marginBottom = Math.max(0, H(e, "margin-bottom")),
          i && i.updateDimensions()
      }
  }
  ,
  de.prototype._refreshSortData = function() {
      if (!this._isDestroyed) {
          var t, e = this._sortData = {}, i = this.getGrid()._settings.sortData;
          for (t in i)
              e[t] = i[t](this, this._element)
      }
  }
  ,
  de.prototype._addToLayout = function(t, e) {
      !0 !== this._isActive && (this._isActive = !0,
      this._left = t || 0,
      this._top = e || 0)
  }
  ,
  de.prototype._removeFromLayout = function() {
      !1 !== this._isActive && (this._isActive = !1,
      this._left = 0,
      this._top = 0)
  }
  ,
  de.prototype._canSkipLayout = function(t, e) {
      return this._left === t && this._top === e && !this._migrate._isActive && !this._layout._skipNextAnimation && !this._dragRelease.isJustReleased()
  }
  ,
  de.prototype._setTranslate = function(t, e) {
      return (this._tX !== t || this._tY !== e) && (this._tX = t,
      this._tY = e,
      this._element.style[mt] = se(t, e),
      !0)
  }
  ,
  de.prototype._destroy = function(t) {
      if (!this._isDestroyed) {
          var i = this._element
            , s = this.getGrid()._settings;
          this._dragPlaceholder.destroy(),
          this._dragRelease.destroy(),
          this._migrate.destroy(),
          this._layout.destroy(),
          this._visibility.destroy(),
          this._drag && this._drag.destroy(),
          this._emitter.destroy(),
          Ot(i, s.itemClass),
          t && i.parentNode.removeChild(i),
          e && e.delete(i),
          this._isActive = !1,
          this._isDestroyed = !0
      }
  }
  ;
  var ce = ue()
    , fe = null
    , pe = [];
  function me(t, e) {
      if (this._options = 0,
      this._processor = null,
      this._layoutQueue = [],
      this._layouts = {},
      this._layoutCallbacks = {},
      this._layoutWorkers = {},
      this._layoutWorkerData = {},
      this._workers = [],
      this._onWorkerMessage = this._onWorkerMessage.bind(this),
      this.setOptions(e),
      (t = "number" == typeof t ? Math.max(0, t) : 0) && window.Worker && window.URL && window.Blob)
          try {
              this._workers = function(t, e) {
                  var i = [];
                  if (t > 0) {
                      fe || (fe = URL.createObjectURL(new Blob(["(" + ue.toString() + ")(true)"],{
                          type: "application/javascript"
                      })));
                      for (var s, n = 0; n < t; n++)
                          s = new Worker(fe),
                          e && (s.onmessage = e),
                          i.push(s),
                          pe.push(s)
                  }
                  return i
              }(t, this._onWorkerMessage)
          } catch (t) {
              this._processor = new ce
          }
      else
          this._processor = new ce
  }
  me.prototype._sendToWorker = function() {
      if (this._layoutQueue.length && this._workers.length) {
          var t = this._layoutQueue.shift()
            , e = this._workers.pop()
            , i = this._layoutWorkerData[t];
          delete this._layoutWorkerData[t],
          this._layoutWorkers[t] = e,
          e.postMessage(i.buffer, [i.buffer])
      }
  }
  ,
  me.prototype._onWorkerMessage = function(t) {
      var e = new Float32Array(t.data)
        , i = e[0]
        , s = this._layouts[i]
        , n = this._layoutCallbacks[i]
        , r = this._layoutWorkers[i];
      s && delete this._layoutCallbacks[i],
      n && delete this._layoutCallbacks[i],
      r && delete this._layoutWorkers[i],
      s && n && (s.width = e[1],
      s.height = e[2],
      s.slots = e.subarray(4, e.length),
      this._finalizeLayout(s),
      n(s)),
      r && (this._workers.push(r),
      this._sendToWorker())
  }
  ,
  me.prototype._finalizeLayout = function(t) {
      var e = t._grid
        , i = 2 & t._settings
        , s = "border-box" === e._boxSizing;
      return delete t._grid,
      delete t._settings,
      t.styles = {},
      i ? t.styles.width = (s ? t.width + e._borderLeft + e._borderRight : t.width) + "px" : t.styles.height = (s ? t.height + e._borderTop + e._borderBottom : t.height) + "px",
      t
  }
  ,
  me.prototype.setOptions = function(t) {
      var e, i, s, n, r;
      t && (e = "boolean" == typeof t.fillGaps ? t.fillGaps ? 1 : 0 : 1 & this._options,
      i = "boolean" == typeof t.horizontal ? t.horizontal ? 2 : 0 : 2 & this._options,
      s = "boolean" == typeof t.alignRight ? t.alignRight ? 4 : 0 : 4 & this._options,
      n = "boolean" == typeof t.alignBottom ? t.alignBottom ? 8 : 0 : 8 & this._options,
      r = "boolean" == typeof t.rounding ? t.rounding ? 16 : 0 : 16 & this._options,
      this._options = e | i | s | n | r)
  }
  ,
  me.prototype.createLayout = function(t, e, i, s, n, r) {
      if (this._layouts[e])
          throw new Error("A layout with the provided id is currently being processed.");
      var o = 2 & this._options
        , h = {
          id: e,
          items: i,
          slots: null,
          width: o ? 0 : s,
          height: o ? n : 0,
          _grid: t,
          _settings: this._options
      };
      if (!i.length)
          return h.slots = [],
          this._finalizeLayout(h),
          void r(h);
      if (this._processor)
          return h.slots = window.Float32Array ? new Float32Array(2 * i.length) : new Array(2 * i.length),
          this._processor.computeLayout(h, h._settings),
          this._finalizeLayout(h),
          void r(h);
      var a, l, _, d = new Float32Array(4 + 2 * i.length);
      for (d[0] = e,
      d[1] = h.width,
      d[2] = h.height,
      d[3] = h._settings,
      a = 0,
      l = 3; a < i.length; a++)
          _ = i[a],
          d[++l] = _._width + _._marginLeft + _._marginRight,
          d[++l] = _._height + _._marginTop + _._marginBottom;
      return this._layoutQueue.push(e),
      this._layouts[e] = h,
      this._layoutCallbacks[e] = r,
      this._layoutWorkerData[e] = d,
      this._sendToWorker(),
      this.cancelLayout.bind(this, e)
  }
  ,
  me.prototype.cancelLayout = function(t) {
      if (this._layouts[t] && (delete this._layouts[t],
      delete this._layoutCallbacks[t],
      this._layoutWorkerData[t])) {
          delete this._layoutWorkerData[t];
          var e = this._layoutQueue.indexOf(t);
          e > -1 && this._layoutQueue.splice(e, 1)
      }
  }
  ,
  me.prototype.destroy = function() {
      for (var t in this._layoutWorkers)
          this._workers.push(this._layoutWorkers[t]);
      !function(t) {
          for (var e, i, s = 0; s < t.length; s++)
              (e = t[s]).onmessage = null,
              e.onerror = null,
              e.onmessageerror = null,
              e.terminate(),
              (i = pe.indexOf(e)) > -1 && pe.splice(i, 1);
          fe && !pe.length && (URL.revokeObjectURL(fe),
          fe = null)
      }(this._workers),
      this._workers.length = 0,
      this._layoutQueue.length = 0,
      this._layouts = {},
      this._layoutCallbacks = {},
      this._layoutWorkers = {},
      this._layoutWorkerData = {}
  }
  ;
  var ge = 0;
  function ve(t, e) {
      var i = ++ge
        , s = 0
        , n = 0
        , r = !1
        , o = function(e) {
          r || (n && (s -= e - n),
          n = e,
          s > 0 ? function(t, e) {
              b.add(0, "debounceRead" + t, e)
          }(i, o) : (s = n = 0,
          t()))
      };
      return function(h) {
          if (!r) {
              if (!(e <= 0))
                  return !0 === h ? (r = !0,
                  s = n = 0,
                  o = void 0,
                  void function(t) {
                      b.remove(0, "debounceRead" + t)
                  }(i)) : void (s <= 0 ? (s = e,
                  o(0)) : s = e);
              !0 !== h && t()
          }
      }
  }
  function ye(t) {
      var e = Object.prototype.toString.call(t);
      return "[object HTMLCollection]" === e || "[object NodeList]" === e
  }
  var Se = Object.prototype.toString;
  function we(t) {
      return "object" == typeof t && "[object Object]" === Se.call(t)
  }
  function De() {}
  var be, Ae = 0;
  function Ee(e, i) {
      if ("string" == typeof e && (e = document.querySelector(e)),
      !(e.getRootNode ? e.getRootNode({
          composed: !0
      }) === document : document.body.contains(e)) || e === document.documentElement)
          throw new Error("Container element must be an existing DOM element.");
      var s = function(t, e) {
          var i = Te({}, t);
          e && (i = Te(i, e));
          e && e.visibleStyles ? i.visibleStyles = e.visibleStyles : t && t.visibleStyles && (i.visibleStyles = t.visibleStyles);
          e && e.hiddenStyles ? i.hiddenStyles = e.hiddenStyles : t && t.hiddenStyles && (i.hiddenStyles = t.hiddenStyles);
          return i
      }(Ee.defaultOptions, i);
      s.visibleStyles = xe(s.visibleStyles),
      s.hiddenStyles = xe(s.hiddenStyles),
      C(s.dragSort) || (s.dragSort = !!s.dragSort),
      this._id = _e(),
      this._element = e,
      this._settings = s,
      this._isDestroyed = !1,
      this._items = [],
      this._layout = {
          id: 0,
          items: [],
          slots: []
      },
      this._isLayoutFinished = !0,
      this._nextLayoutData = null,
      this._emitter = new r,
      this._onLayoutDataReceived = this._onLayoutDataReceived.bind(this),
      t[this._id] = this,
      _t(e, s.containerClass),
      function(t, e) {
          "number" != typeof e && (e = !0 === e ? 0 : -1);
          e >= 0 && (t._resizeHandler = ve((function() {
              t.refreshItems().layout()
          }
          ), e),
          window.addEventListener("resize", t._resizeHandler))
      }(this, s.layoutOnResize),
      this.add(function(t, e) {
          if ("*" === e)
              return t.children;
          if ("string" == typeof e) {
              for (var i = [], s = t.children, n = 0; n < s.length; n++)
                  lt(s[n], e) && i.push(s[n]);
              return i
          }
          if (Array.isArray(e) || ye(e))
              return e;
          return []
      }(e, s.items), {
          layout: !1
      }),
      s.layoutOnInit && this.layout(!0)
  }
  function Te(t, e) {
      var i, s, n, r = Object.keys(e), o = r.length;
      for (n = 0; n < o; n++)
          i = we(e[s = r[n]]),
          we(t[s]) && i ? t[s] = Te(Te({}, t[s]), e[s]) : i ? t[s] = Te({}, e[s]) : Array.isArray(e[s]) ? t[s] = e[s].slice(0) : t[s] = e[s];
      return t
  }
  function xe(t) {
      var e, i, s = {}, n = document.documentElement.style;
      for (e in t)
          t[e] && (i = _(n, e)) && (s[i] = t[e]);
      return s
  }
  function Re(t) {
      for (var e = {}, i = 0; i < t.length; i++)
          e[t[i]._id] = i;
      return e
  }
  function ke(t, e, i) {
      return t[e._id] - t[i._id]
  }
  return Ee.Item = de,
  Ee.ItemLayout = oe,
  Ee.ItemVisibility = ae,
  Ee.ItemMigrate = he,
  Ee.ItemDrag = zt,
  Ee.ItemDragRelease = re,
  Ee.ItemDragPlaceholder = ne,
  Ee.Emitter = r,
  Ee.Animator = ee,
  Ee.Dragger = y,
  Ee.Packer = me,
  Ee.AutoScroller = ot,
  Ee.defaultPacker = new me(2),
  Ee.defaultOptions = {
      items: "*",
      showDuration: 300,
      showEasing: "ease",
      hideDuration: 300,
      hideEasing: "ease",
      visibleStyles: {
          opacity: "1",
          transform: "scale(1)"
      },
      hiddenStyles: {
          opacity: "0",
          transform: "scale(0.5)"
      },
      layout: {
          fillGaps: !1,
          horizontal: !1,
          alignRight: !1,
          alignBottom: !1,
          rounding: !1
      },
      layoutOnResize: 150,
      layoutOnInit: !0,
      layoutDuration: 300,
      layoutEasing: "ease",
      sortData: null,
      dragEnabled: !1,
      dragContainer: null,
      dragHandle: null,
      dragStartPredicate: {
          distance: 0,
          delay: 0
      },
      dragAxis: "xy",
      dragSort: !0,
      dragSortHeuristics: {
          sortInterval: 100,
          minDragDistance: 10,
          minBounceBackAngle: 1
      },
      dragSortPredicate: {
          threshold: 50,
          action: "move",
          migrateAction: "move"
      },
      dragRelease: {
          duration: 300,
          easing: "ease",
          useDragContainer: !0
      },
      dragCssProps: {
          touchAction: "none",
          userSelect: "none",
          userDrag: "none",
          tapHighlightColor: "rgba(0, 0, 0, 0)",
          touchCallout: "none",
          contentZooming: "none"
      },
      dragPlaceholder: {
          enabled: !1,
          createElement: null,
          onCreate: null,
          onRemove: null
      },
      dragAutoScroll: {
          targets: [],
          handle: null,
          threshold: 50,
          safeZone: .2,
          speed: ot.smoothSpeed(1e3, 2e3, 2500),
          sortDuringScroll: !0,
          smoothStop: !1,
          onStart: null,
          onStop: null
      },
      containerClass: "muuri",
      itemClass: "muuri-item",
      itemVisibleClass: "muuri-item-shown",
      itemHiddenClass: "muuri-item-hidden",
      itemPositioningClass: "muuri-item-positioning",
      itemDraggingClass: "muuri-item-dragging",
      itemReleasingClass: "muuri-item-releasing",
      itemPlaceholderClass: "muuri-item-placeholder"
  },
  Ee.prototype.on = function(t, e) {
      return this._emitter.on(t, e),
      this
  }
  ,
  Ee.prototype.off = function(t, e) {
      return this._emitter.off(t, e),
      this
  }
  ,
  Ee.prototype.getElement = function() {
      return this._element
  }
  ,
  Ee.prototype.getItem = function(t) {
      if (this._isDestroyed || !t && 0 !== t)
          return null;
      if ("number" == typeof t)
          return this._items[t > -1 ? t : this._items.length + t] || null;
      if (t instanceof de)
          return t._gridId === this._id ? t : null;
      if (e) {
          var i = e.get(t);
          return i && i._gridId === this._id ? i : null
      }
      for (var s = 0; s < this._items.length; s++)
          if (this._items[s]._element === t)
              return this._items[s];
      return null
  }
  ,
  Ee.prototype.getItems = function(t) {
      if (this._isDestroyed || void 0 === t)
          return this._items.slice(0);
      var e, i, s = [];
      if (Array.isArray(t) || ye(t))
          for (e = 0; e < t.length; e++)
              (i = this.getItem(t[e])) && s.push(i);
      else
          (i = this.getItem(t)) && s.push(i);
      return s
  }
  ,
  Ee.prototype.refreshItems = function(t, e) {
      if (this._isDestroyed)
          return this;
      var i, s, n, r, o = t || this._items;
      if (!0 === e)
          for (r = [],
          i = 0; i < o.length; i++)
              (s = o[i]).isVisible() || s.isHiding() || ((n = s.getElement().style).visibility = "hidden",
              n.display = "",
              r.push(n));
      for (i = 0; i < o.length; i++)
          o[i]._refreshDimensions(e);
      if (!0 === e) {
          for (i = 0; i < r.length; i++)
              (n = r[i]).visibility = "",
              n.display = "none";
          r.length = 0
      }
      return this
  }
  ,
  Ee.prototype.refreshSortData = function(t) {
      if (this._isDestroyed)
          return this;
      for (var e = t || this._items, i = 0; i < e.length; i++)
          e[i]._refreshSortData();
      return this
  }
  ,
  Ee.prototype.synchronize = function() {
      if (this._isDestroyed)
          return this;
      var t, e, i = this._items;
      if (!i.length)
          return this;
      for (var s = 0; s < i.length; s++)
          (e = i[s]._element).parentNode === this._element && (t = t || document.createDocumentFragment()).appendChild(e);
      return t ? (this._element.appendChild(t),
      this._emit("synchronize"),
      this) : this
  }
  ,
  Ee.prototype.layout = function(t, e) {
      if (this._isDestroyed)
          return this;
      var i = this._nextLayoutData;
      i && C(i.cancel) && i.cancel();
      var s = Ae = Ae % 16777216 + 1;
      this._nextLayoutData = {
          id: s,
          instant: t,
          onFinish: e,
          cancel: null
      };
      for (var n = this._items, r = [], o = 0; o < n.length; o++)
          n[o]._isActive && r.push(n[o]);
      this._refreshDimensions();
      var h, a = this._width - this._borderLeft - this._borderRight, l = this._height - this._borderTop - this._borderBottom, _ = this._settings.layout;
      return C(_) ? h = _(this, s, r, a, l, this._onLayoutDataReceived) : (Ee.defaultPacker.setOptions(_),
      h = Ee.defaultPacker.createLayout(this, s, r, a, l, this._onLayoutDataReceived)),
      C(h) && this._nextLayoutData && this._nextLayoutData.id === s && (this._nextLayoutData.cancel = h),
      this
  }
  ,
  Ee.prototype.add = function(t, e) {
      if (this._isDestroyed || !t)
          return [];
      var i, s = ye(i = t) ? Array.prototype.slice.call(i) : Array.prototype.concat(i);
      if (!s.length)
          return s;
      var n, r, o, h, a = e || {}, l = a.layout ? a.layout : void 0 === a.layout, _ = this._items, d = !1;
      for (h = 0; h < s.length; h++)
          (r = s[h]).parentNode !== this._element && (n = n || document.createDocumentFragment()).appendChild(r);
      for (n && this._element.appendChild(n),
      h = 0; h < s.length; h++)
          r = s[h],
          (o = s[h] = new de(this,r,a.active))._isActive && (d = !0,
          o._layout._skipNextAnimation = !0);
      for (h = 0; h < s.length; h++)
          (o = s[h])._refreshDimensions(),
          o._refreshSortData();
      return ut(_, s, a.index),
      this._hasListeners("add") && this._emit("add", s.slice(0)),
      d && l && this.layout("instant" === l, C(l) ? l : void 0),
      s
  }
  ,
  Ee.prototype.remove = function(t, e) {
      if (this._isDestroyed || !t.length)
          return [];
      var i, s, n, r = e || {}, o = r.layout ? r.layout : void 0 === r.layout, h = !1, a = this.getItems(), l = [], _ = [];
      for (n = 0; n < t.length; n++)
          (s = t[n])._isDestroyed || -1 !== (i = this._items.indexOf(s)) && (s._isActive && (h = !0),
          l.push(s),
          _.push(a.indexOf(s)),
          s._destroy(r.removeElements),
          this._items.splice(i, 1));
      return this._hasListeners("remove") && this._emit("remove", l.slice(0), _),
      h && o && this.layout("instant" === o, C(o) ? o : void 0),
      l
  }
  ,
  Ee.prototype.show = function(t, e) {
      return !this._isDestroyed && t.length && this._setItemsVisibility(t, !0, e),
      this
  }
  ,
  Ee.prototype.hide = function(t, e) {
      return !this._isDestroyed && t.length && this._setItemsVisibility(t, !1, e),
      this
  }
  ,
  Ee.prototype.filter = function(t, e) {
      if (this._isDestroyed || !this._items.length)
          return this;
      var i, s, n = [], r = [], o = "string" == typeof t, h = C(t), a = e || {}, l = !0 === a.instant, _ = a.syncWithLayout, d = a.layout ? a.layout : void 0 === a.layout, u = C(a.onFinish) ? a.onFinish : null, c = -1, f = De;
      if (u && (f = function() {
          ++c && u(n.slice(0), r.slice(0))
      }
      ),
      h || o)
          for (s = 0; s < this._items.length; s++)
              i = this._items[s],
              (h ? t(i) : lt(i._element, t)) ? n.push(i) : r.push(i);
      return n.length ? this.show(n, {
          instant: l,
          syncWithLayout: _,
          onFinish: f,
          layout: !1
      }) : f(),
      r.length ? this.hide(r, {
          instant: l,
          syncWithLayout: _,
          onFinish: f,
          layout: !1
      }) : f(),
      (n.length || r.length) && (this._hasListeners("filter") && this._emit("filter", n.slice(0), r.slice(0)),
      d && this.layout("instant" === d, C(d) ? d : void 0)),
      this
  }
  ,
  Ee.prototype.sort = function() {
      var t, e, i, s;
      function n(n, r) {
          for (var o, h, a, l, _ = 0, d = 0; d < t.length; d++)
              if (o = t[d][0],
              h = t[d][1],
              a = (n._sortData ? n : n._refreshSortData())._sortData[o],
              l = (r._sortData ? r : r._refreshSortData())._sortData[o],
              _ = "desc" === h || !h && e ? l < a ? -1 : l > a ? 1 : 0 : a < l ? -1 : a > l ? 1 : 0)
                  return _;
          return _ || (s || (s = Re(i)),
          _ = e ? ke(s, r, n) : ke(s, n, r)),
          _
      }
      function r(n, r) {
          var o = e ? -t(n, r) : t(n, r);
          return o || (s || (s = Re(i)),
          o = e ? ke(s, r, n) : ke(s, n, r)),
          o
      }
      return function(o, h) {
          if (this._isDestroyed || this._items.length < 2)
              return this;
          var a = this._items
            , l = h || {}
            , _ = l.layout ? l.layout : void 0 === l.layout;
          if (e = !!l.descending,
          i = a.slice(0),
          s = null,
          C(o))
              t = o,
              a.sort(r);
          else if ("string" == typeof o)
              t = o.trim().split(" ").filter((function(t) {
                  return t
              }
              )).map((function(t) {
                  return t.split(":")
              }
              )),
              a.sort(n);
          else {
              if (!Array.isArray(o))
                  throw t = e = i = s = null,
                  new Error("Invalid comparer argument provided.");
              a.length = 0,
              a.push.apply(a, o)
          }
          return this._hasListeners("sort") && this._emit("sort", a.slice(0), i),
          _ && this.layout("instant" === _, C(_) ? _ : void 0),
          t = e = i = s = null,
          this
      }
  }(),
  Ee.prototype.move = function(t, e, i) {
      if (this._isDestroyed || this._items.length < 2)
          return this;
      var s, n, r = this._items, o = i || {}, h = o.layout ? o.layout : void 0 === o.layout, a = "swap" === o.action, l = a ? "swap" : "move", _ = this.getItem(t), d = this.getItem(e);
      return _ && d && _ !== d && (s = r.indexOf(_),
      n = r.indexOf(d),
      a ? pt(r, s, n) : ft(r, s, n),
      this._hasListeners("move") && this._emit("move", {
          item: _,
          fromIndex: s,
          toIndex: n,
          action: l
      }),
      h && this.layout("instant" === h, C(h) ? h : void 0)),
      this
  }
  ,
  Ee.prototype.send = function(t, e, i, s) {
      if (this._isDestroyed || e._isDestroyed || this === e)
          return this;
      if (!(t = this.getItem(t)))
          return this;
      var n = s || {}
        , r = n.appendTo || document.body
        , o = n.layoutSender ? n.layoutSender : void 0 === n.layoutSender
        , h = n.layoutReceiver ? n.layoutReceiver : void 0 === n.layoutReceiver;
      return t._migrate.start(e, i, r),
      t._migrate._isActive && t._isActive && (o && this.layout("instant" === o, C(o) ? o : void 0),
      h && e.layout("instant" === h, C(h) ? h : void 0)),
      this
  }
  ,
  Ee.prototype.destroy = function(e) {
      if (this._isDestroyed)
          return this;
      var i, s, n, r = this._element, o = this._items.slice(0), h = this._layout && this._layout.styles || {};
      for ((n = this)._resizeHandler && (n._resizeHandler(!0),
      window.removeEventListener("resize", n._resizeHandler),
      n._resizeHandler = null),
      i = 0; i < o.length; i++)
          o[i]._destroy(e);
      for (s in this._items.length = 0,
      Ot(r, this._settings.containerClass),
      h)
          r.style[s] = "";
      return this._emit("destroy"),
      this._emitter.destroy(),
      delete t[this._id],
      this._isDestroyed = !0,
      this
  }
  ,
  Ee.prototype._emit = function() {
      this._isDestroyed || this._emitter.emit.apply(this._emitter, arguments)
  }
  ,
  Ee.prototype._hasListeners = function(t) {
      return !this._isDestroyed && this._emitter.countListeners(t) > 0
  }
  ,
  Ee.prototype._updateBoundingRect = function() {
      var t = this._element.getBoundingClientRect();
      this._width = t.width,
      this._height = t.height,
      this._left = t.left,
      this._top = t.top,
      this._right = t.right,
      this._bottom = t.bottom
  }
  ,
  Ee.prototype._updateBorders = function(t, e, i, s) {
      var n = this._element;
      t && (this._borderLeft = H(n, "border-left-width")),
      e && (this._borderRight = H(n, "border-right-width")),
      i && (this._borderTop = H(n, "border-top-width")),
      s && (this._borderBottom = H(n, "border-bottom-width"))
  }
  ,
  Ee.prototype._refreshDimensions = function() {
      this._updateBoundingRect(),
      this._updateBorders(1, 1, 1, 1),
      this._boxSizing = O(this._element, "box-sizing")
  }
  ,
  Ee.prototype._onLayoutDataReceived = (be = [],
  function(t) {
      if (!this._isDestroyed && this._nextLayoutData && this._nextLayoutData.id === t.id) {
          var e, i, s, n, r = this, o = this._nextLayoutData.instant, h = this._nextLayoutData.onFinish, a = t.items.length, l = a;
          for (this._nextLayoutData = null,
          !this._isLayoutFinished && this._hasListeners("layoutAbort") && this._emit("layoutAbort", this._layout.items.slice(0)),
          this._layout = t,
          be.length = 0,
          n = 0; n < a; n++)
              (e = t.items[n]) ? (i = t.slots[2 * n],
              s = t.slots[2 * n + 1],
              e._canSkipLayout(i, s) ? --l : (e._left = i,
              e._top = s,
              e.isActive() && !e.isDragging() ? be.push(e) : --l)) : --l;
          if (t.styles && Zt(this._element, t.styles),
          !this._hasListeners("layoutStart") || (this._emit("layoutStart", t.items.slice(0), !0 === o),
          this._layout.id === t.id)) {
              var _ = function() {
                  if (!(--l > 0)) {
                      var e = r._layout.id !== t.id
                        , i = C(o) ? o : h;
                      e || (r._isLayoutFinished = !0),
                      C(i) && i(t.items.slice(0), e),
                      !e && r._hasListeners("layoutEnd") && r._emit("layoutEnd", t.items.slice(0))
                  }
              };
              if (!be.length)
                  return _(),
                  this;
              for (this._isLayoutFinished = !1,
              n = 0; n < be.length && this._layout.id === t.id; n++)
                  be[n]._layout.start(!0 === o, _);
              return this._layout.id === t.id && (be.length = 0),
              this
          }
      }
  }
  ),
  Ee.prototype._setItemsVisibility = function(t, e, i) {
      var s, n, r = this, o = t.slice(0), h = i || {}, a = !0 === h.instant, l = h.onFinish, _ = h.layout ? h.layout : void 0 === h.layout, d = o.length, u = e ? "showStart" : "hideStart", c = e ? "showEnd" : "hideEnd", f = e ? "show" : "hide", p = !1, m = [], g = [];
      if (d) {
          for (n = 0; n < o.length; n++)
              s = o[n],
              (e && !s._isActive || !e && s._isActive) && (p = !0),
              s._layout._skipNextAnimation = !(!e || s._isActive),
              e && s._visibility._isHidden && g.push(s),
              e ? s._addToLayout() : s._removeFromLayout();
          g.length && (this.refreshItems(g, !0),
          g.length = 0),
          p && !1 !== h.syncWithLayout ? this.on("layoutStart", v) : v(),
          p && _ && this.layout("instant" === _, C(_) ? _ : void 0)
      } else
          C(l) && l(o);
      function v() {
          for (p && !1 !== h.syncWithLayout && r.off("layoutStart", v),
          r._hasListeners(u) && r._emit(u, o.slice(0)),
          n = 0; n < o.length; n++)
              o[n]._gridId === r._id ? o[n]._visibility[f](a, (function(t, e) {
                  t || m.push(e),
                  --d < 1 && (C(l) && l(m.slice(0)),
                  r._hasListeners(c) && r._emit(c, m.slice(0)))
              }
              )) : --d < 1 && (C(l) && l(m.slice(0)),
              r._hasListeners(c) && r._emit(c, m.slice(0)))
      }
  }
  ,
  Ee
}
));

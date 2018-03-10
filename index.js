(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MithrilRange = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
///////////////////////////////////////////////
// Mithril Range
// (c) 2017 by Mike Linkovich
// https://github.com/spacejack/mithril-range
// License: MIT
///////////////////////////////////////////////
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Script or module?
    var m = typeof window === 'object' && typeof window['m'] === 'function'
        ? window['m']
        : require('mithril');
    var NONE = 0;
    var MOUSE = 1;
    var TOUCH = 2;
    // So we aren't triggered by echoed mouse events (some mobile browsers)
    var DEVICE_DELAY = 350;
    /** Clamp number to range */
    function clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
    var isIOS = !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
    // This is some unbelievable stone-age nonsense.
    // Workaround for webkit bug where event.preventDefault
    // within touchmove handler fails to prevent scrolling.
    var iOSHackApplied = false;
    function applyIOSHack() {
        // Only apply this hack if iOS, haven't yet applied it,
        // and only if a component is actually created
        if (!isIOS || iOSHackApplied)
            return;
        window.addEventListener('touchmove', function () { });
        iOSHackApplied = true;
    }
    function quant(val, min, max, step) {
        if (max - min <= 0)
            return min;
        if (step <= 0)
            return clamp(val, min, max);
        var steps = Math.ceil((max - min) / step);
        var v = min + Math.round(steps * (val - min) / (max - min)) * step;
        return clamp(v, min, max);
    }
    /** Range Component */
    function MithrilRange() {
        var elHit;
        var elBar;
        var elBar0;
        var elBar1;
        var elHandle;
        var rcBar;
        var device = NONE;
        var pressed = false;
        // Attrs we need to cache
        var min = 0;
        var max = 10;
        var value = 0;
        var startValue = 0;
        var step = 1;
        var orientation = 'horizontal';
        var onchange;
        var ondrag;
        // Event handlers
        function onMouseDown(e) {
            if (device === TOUCH)
                return;
            device = MOUSE;
            if (e.button !== 0)
                return;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            onPress(e.clientX, e.clientY);
        }
        function onMouseMove(e) {
            e.preventDefault();
            onMove(e.clientX, e.clientY);
        }
        function onMouseUp(e) {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            onRelease(e.clientX, e.clientY);
        }
        function onTouchStart(e) {
            if (device === MOUSE)
                return;
            elHit.addEventListener('touchmove', onTouchMove);
            elHit.addEventListener('touchend', onTouchEnd);
            var t = e.changedTouches[0];
            onPress(t.clientX, t.clientY);
        }
        function onTouchMove(e) {
            e.preventDefault();
            var t = e.changedTouches[0];
            onMove(t.clientX, t.clientY);
        }
        function onTouchEnd(e) {
            elHit.removeEventListener('touchmove', onTouchMove);
            elHit.removeEventListener('touchend', onTouchEnd);
            var t = e.changedTouches[0];
            onRelease(t.clientX, t.clientY);
        }
        function onKeyDown(e) {
            var k = e.keyCode;
            var newVal;
            if (k === 33) {
                e.preventDefault();
                var s = Math.max((max - min) / 10, step);
                if (s <= 0)
                    s = 1;
                newVal = quant(value + s, min, max, step);
            }
            else if (k === 34) {
                e.preventDefault();
                var s = Math.max((max - min) / 10, step);
                if (s <= 0)
                    s = 1;
                newVal = quant(value - s, min, max, step);
            }
            else if (k === 35) {
                e.preventDefault();
                newVal = max;
            }
            else if (k === 36) {
                e.preventDefault();
                newVal = min;
            }
            else if (k === 37 || k === 40) {
                e.preventDefault();
                var s = step > 0 ? step : (max - min) / 10;
                newVal = Math.max(value - s, min);
            }
            else if (k === 38 || k === 39) {
                e.preventDefault();
                var s = step > 0 ? step : (max - min) / 10;
                newVal = Math.min(value + s, max);
            }
            if (typeof newVal !== 'number' || newVal === value) {
                return; // no change to make
            }
            value = newVal;
            setStyles(value);
            if (onchange && onchange(value) !== false) {
                m.redraw();
            }
        }
        // App handlers
        function onPress(x, y) {
            startValue = value;
            pressed = true;
            rcBar = elBar.getBoundingClientRect();
            var val = moveHandle(x, y);
            if (val !== value) {
                value = val;
                if (ondrag && ondrag(value) !== false) {
                    m.redraw();
                }
            }
        }
        function onMove(x, y) {
            if (!pressed)
                return;
            var val = moveHandle(x, y);
            if (val !== value) {
                value = val;
                if (ondrag && ondrag(value) !== false) {
                    m.redraw();
                }
            }
        }
        function onRelease(x, y) {
            if (!pressed)
                return;
            pressed = false;
            value = moveHandle(x, y);
            if (value !== startValue) {
                if (onchange && onchange(value) !== false) {
                    m.redraw();
                }
            }
            setTimeout(function () {
                if (!pressed)
                    device = NONE;
            }, DEVICE_DELAY);
        }
        function moveHandle(x, y) {
            var barLength, delta;
            if (orientation === 'vertical') {
                barLength = rcBar.bottom - rcBar.top;
                delta = rcBar.bottom - y;
            }
            else {
                barLength = rcBar.right - rcBar.left;
                delta = x - rcBar.left;
            }
            delta = clamp(delta, 0, barLength);
            var val = quant((delta / barLength) * (max - min) + min, min, max, step);
            setStyles(val);
            return val;
        }
        /** Compute handle position style */
        function positionStyle(val) {
            var s = (val - min) / (max - min);
            if (orientation === 'vertical')
                s = 1.0 - s;
            return String(100 * s) + '%';
        }
        /** Set styles for movable parts */
        function setStyles(value) {
            var ps = positionStyle(value);
            var rps = positionStyle(max - value + min);
            if (orientation === 'vertical') {
                elHandle.style.top = ps;
                elBar0.style.height = ps;
                elBar1.style.height = rps;
            }
            else {
                elHandle.style.left = ps;
                elBar0.style.width = rps;
                elBar1.style.width = ps;
            }
        }
        /** Some attrs need to be cached (and updated) so that they are current in event handlers */
        function updateAttrs(attrs) {
            min = attrs.min;
            max = attrs.max;
            step = (typeof attrs.step === 'number' && !Number.isNaN(attrs.step))
                ? clamp(attrs.step, 0, max - min) : 1;
            orientation = attrs.orientation === 'vertical' ? 'vertical' : 'horizontal';
            onchange = attrs.onchange;
            ondrag = attrs.ondrag;
            if (typeof attrs.value === 'number') {
                value = clamp(attrs.value, min, max);
            }
        }
        /** Return mithril component hooks object */
        return {
            oncreate: function (_a) {
                var attrs = _a.attrs, dom = _a.dom;
                applyIOSHack();
                updateAttrs(attrs);
                elHit = dom;
                elBar = elHit.querySelector('.mithril-range-bar');
                elBar0 = elBar.querySelector('.mithril-range-bar-0');
                elBar1 = elBar.querySelector('.mithril-range-bar-1');
                elHandle = elBar.querySelector('.mithril-range-handle');
                elHit.addEventListener('mousedown', onMouseDown);
                elHit.addEventListener('touchstart', onTouchStart);
                elHit.addEventListener('keydown', onKeyDown);
            },
            onremove: function () {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                elHit.removeEventListener('mousedown', onMouseDown);
                elHit.removeEventListener('touchstart', onTouchStart);
                elHit.removeEventListener('touchmove', onTouchMove);
                elHit.removeEventListener('touchend', onTouchEnd);
                elHit.removeEventListener('keydown', onKeyDown);
            },
            view: function (_a) {
                var attrs = _a.attrs, children = _a.children;
                updateAttrs(attrs);
                value = quant(value, min, max, step);
                var a = {
                    class: 'mithril-range' + (attrs.class != null ? ' ' + attrs.class : ''),
                    tabIndex: '0',
                    role: 'slider',
                    'aria-valuemin': String(min),
                    'aria-valuemax': String(max),
                    'aria-valuenow': String(value),
                    'aria-orientation': orientation
                };
                if (attrs.id)
                    a.id = attrs.id;
                if (attrs.ariaLabelledby)
                    a['aria-labelledby'] = attrs.ariaLabelledby;
                if (attrs.disabled) {
                    a.style = { pointerEvents: 'none' };
                    a['aria-disabled'] = 'true';
                }
                var ps = positionStyle(value);
                var rps = positionStyle(max - value + min);
                var handleStyle, bar0Style, bar1Style;
                if (orientation === 'vertical') {
                    handleStyle = { top: ps };
                    bar0Style = { height: ps };
                    bar1Style = { height: rps };
                }
                else {
                    handleStyle = { left: ps };
                    bar0Style = { width: rps };
                    bar1Style = { width: ps };
                }
                return m('div', a, m('div', { class: 'mithril-range-bar' }, m('div', {
                    class: 'mithril-range-bar-0',
                    style: bar0Style
                }), m('div', {
                    class: 'mithril-range-bar-1',
                    style: bar1Style
                }), m('div', {
                    class: 'mithril-range-handle',
                    style: handleStyle
                }, children)), !!attrs.name && m('input', {
                    type: 'hidden',
                    name: attrs.name,
                    value: String(value)
                }));
            }
        };
    }
    (function (MithrilRange) {
        /** Given an input value, quantize it to the step size */
        MithrilRange.quantize = quant;
    })(MithrilRange || (MithrilRange = {}));
    exports.default = MithrilRange;
});

},{"mithril":"mithril"}]},{},[1])(1)
});
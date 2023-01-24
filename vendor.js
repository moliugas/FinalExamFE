// jQuery Mask Plugin v1.13.3
// github.com/igorescobar/jQuery-Mask-Plugin
(function (b) {
    "function" === typeof define && define.amd ? define(["jquery"], b) : "object" === typeof exports ? module.exports = b(require("jquery")) : b(jQuery || Zepto)
})(function (b) {
    var y = function (a, d, e) {
        a = b(a);
        var g = this,
            k = a.val(),
            l;
        d = "function" === typeof d ? d(a.val(), void 0, a, e) : d;
        var c = {
            invalid: [],
            getCaret: function () {
                try {
                    var q, v = 0,
                        b = a.get(0),
                        f = document.selection,
                        c = b.selectionStart;
                    if (f && -1 === navigator.appVersion.indexOf("MSIE 10")) q = f.createRange(), q.moveStart("character", a.is("input") ? -a.val().length : -a.text().length),
                        v = q.text.length;
                    else if (c || "0" === c) v = c;
                    return v
                } catch (d) { }
            },
            setCaret: function (q) {
                try {
                    if (a.is(":focus")) {
                        var b, c = a.get(0);
                        c.setSelectionRange ? c.setSelectionRange(q, q) : c.createTextRange && (b = c.createTextRange(), b.collapse(!0), b.moveEnd("character", q), b.moveStart("character", q), b.select())
                    }
                } catch (f) { }
            },
            events: function () {
                a.on("input.mask keyup.mask", c.behaviour).on("paste.mask drop.mask", function () {
                    setTimeout(function () {
                        a.keydown().keyup()
                    }, 100)
                }).on("change.mask", function () {
                    a.data("changed", !0)
                }).on("blur.mask",
                    function () {
                        k === a.val() || a.data("changed") || a.triggerHandler("change");
                        a.data("changed", !1)
                    }).on("blur.mask", function () {
                        k = a.val()
                    }).on("focus.mask", function (a) {
                        !0 === e.selectOnFocus && b(a.target).select()
                    }).on("focusout.mask", function () {
                        e.clearIfNotMatch && !l.test(c.val()) && c.val("")
                    })
            },
            getRegexMask: function () {
                for (var a = [], b, c, f, e, h = 0; h < d.length; h++)(b = g.translation[d.charAt(h)]) ? (c = b.pattern.toString().replace(/.{1}$|^.{1}/g, ""), f = b.optional, (b = b.recursive) ? (a.push(d.charAt(h)), e = {
                    digit: d.charAt(h),
                    pattern: c
                }) : a.push(f || b ? c + "?" : c)) : a.push(d.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                a = a.join("");
                e && (a = a.replace(RegExp("(" + e.digit + "(.*" + e.digit + ")?)"), "($1)?").replace(RegExp(e.digit, "g"), e.pattern));
                return RegExp(a)
            },
            destroyEvents: function () {
                a.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))
            },
            val: function (b) {
                var c = a.is("input") ? "val" : "text";
                if (0 < arguments.length) {
                    if (a[c]() !== b) a[c](b);
                    c = a
                } else c = a[c]();
                return c
            },
            getMCharsBeforeCount: function (a, b) {
                for (var c =
                    0, f = 0, e = d.length; f < e && f < a; f++) g.translation[d.charAt(f)] || (a = b ? a + 1 : a, c++);
                return c
            },
            caretPos: function (a, b, e, f) {
                return g.translation[d.charAt(Math.min(a - 1, d.length - 1))] ? Math.min(a + e - b - f, e) : c.caretPos(a + 1, b, e, f)
            },
            behaviour: function (a) {
                a = a || window.event;
                c.invalid = [];
                var e = a.keyCode || a.which;
                if (-1 === b.inArray(e, g.byPassKeys)) {
                    var d = c.getCaret(),
                        f = c.val().length,
                        n = d < f,
                        h = c.getMasked(),
                        k = h.length,
                        m = c.getMCharsBeforeCount(k - 1) - c.getMCharsBeforeCount(f - 1);
                    c.val(h);
                    !n || 65 === e && a.ctrlKey || (8 !== e && 46 !== e && (d =
                        c.caretPos(d, f, k, m)), c.setCaret(d));
                    return c.callbacks(a)
                }
            },
            getMasked: function (a) {
                var b = [],
                    k = c.val(),
                    f = 0,
                    n = d.length,
                    h = 0,
                    l = k.length,
                    m = 1,
                    p = "push",
                    t = -1,
                    s, w;
                e.reverse ? (p = "unshift", m = -1, s = 0, f = n - 1, h = l - 1, w = function () {
                    return -1 < f && -1 < h
                }) : (s = n - 1, w = function () {
                    return f < n && h < l
                });
                for (; w();) {
                    var x = d.charAt(f),
                        u = k.charAt(h),
                        r = g.translation[x];
                    if (r) u.match(r.pattern) ? (b[p](u), r.recursive && (-1 === t ? t = f : f === s && (f = t - m), s === t && (f -= m)), f += m) : r.optional ? (f += m, h -= m) : r.fallback ? (b[p](r.fallback), f += m, h -= m) : c.invalid.push({
                        p: h,
                        v: u,
                        e: r.pattern
                    }), h += m;
                    else {
                        if (!a) b[p](x);
                        u === x && (h += m);
                        f += m
                    }
                }
                a = d.charAt(s);
                n !== l + 1 || g.translation[a] || b.push(a);
                return b.join("")
            },
            callbacks: function (b) {
                var g = c.val(),
                    l = g !== k,
                    f = [g, b, a, e],
                    n = function (a, b, c) {
                        "function" === typeof e[a] && b && e[a].apply(this, c)
                    };
                n("onChange", !0 === l, f);
                n("onKeyPress", !0 === l, f);
                n("onComplete", g.length === d.length, f);
                n("onInvalid", 0 < c.invalid.length, [g, b, a, c.invalid, e])
            }
        };
        g.mask = d;
        g.options = e;
        g.remove = function () {
            var b = c.getCaret();
            c.destroyEvents();
            c.val(g.getCleanVal());
            c.setCaret(b -
                c.getMCharsBeforeCount(b));
            return a
        };
        g.getCleanVal = function () {
            return c.getMasked(!0)
        };
        g.init = function (d) {
            d = d || !1;
            e = e || {};
            g.byPassKeys = b.jMaskGlobals.byPassKeys;
            g.translation = b.jMaskGlobals.translation;
            g.translation = b.extend({}, g.translation, e.translation);
            g = b.extend(!0, {}, g, e);
            l = c.getRegexMask();
            !1 === d ? (e.placeholder && a.attr("placeholder", e.placeholder), !1 === "oninput" in b("input")[0] && "on" === a.attr("autocomplete") && a.attr("autocomplete", "off"), c.destroyEvents(), c.events(), d = c.getCaret(), c.val(c.getMasked()),
                c.setCaret(d + c.getMCharsBeforeCount(d, !0))) : (c.events(), c.val(c.getMasked()))
        };
        g.init(!a.is("input"))
    };
    b.maskWatchers = {};
    var A = function () {
        var a = b(this),
            d = {},
            e = a.attr("data-mask");
        a.attr("data-mask-reverse") && (d.reverse = !0);
        a.attr("data-mask-clearifnotmatch") && (d.clearIfNotMatch = !0);
        "true" === a.attr("data-mask-selectonfocus") && (d.selectOnFocus = !0);
        if (z(a, e, d)) return a.data("mask", new y(this, e, d))
    },
        z = function (a, d, e) {
            e = e || {};
            var g = b(a).data("mask"),
                k = JSON.stringify;
            a = b(a).val() || b(a).text();
            try {
                return "function" ===
                    typeof d && (d = d(a)), "object" !== typeof g || k(g.options) !== k(e) || g.mask !== d
            } catch (l) { }
        };
    b.fn.mask = function (a, d) {
        d = d || {};
        var e = this.selector,
            g = b.jMaskGlobals,
            k = b.jMaskGlobals.watchInterval,
            l = function () {
                if (z(this, a, d)) return b(this).data("mask", new y(this, a, d))
            };
        b(this).each(l);
        e && "" !== e && g.watchInputs && (clearInterval(b.maskWatchers[e]), b.maskWatchers[e] = setInterval(function () {
            b(document).find(e).each(l)
        }, k));
        return this
    };
    b.fn.unmask = function () {
        clearInterval(b.maskWatchers[this.selector]);
        delete b.maskWatchers[this.selector];
        return this.each(function () {
            var a = b(this).data("mask");
            a && a.remove().removeData("mask")
        })
    };
    b.fn.cleanVal = function () {
        return this.data("mask").getCleanVal()
    };
    b.applyDataMask = function (a) {
        a = a || b.jMaskGlobals.maskElements;
        (a instanceof b ? a : b(a)).filter(b.jMaskGlobals.dataMaskAttr).each(A)
    };
    var p = {
        maskElements: "input,td,span,div",
        dataMaskAttr: "*[data-mask]",
        dataMask: !0,
        watchInterval: 300,
        watchInputs: !0,
        watchDataMask: !1,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            0: {
                pattern: /\d/
            },
            9: {
                pattern: /\d/,
                optional: !0
            },
            "#": {
                pattern: /\d/,
                recursive: !0
            },
            A: {
                pattern: /[a-zA-Z0-9]/
            },
            S: {
                pattern: /[a-zA-Z]/
            }
        }
    };
    b.jMaskGlobals = b.jMaskGlobals || {};
    p = b.jMaskGlobals = b.extend(!0, {}, p, b.jMaskGlobals);
    p.dataMask && b.applyDataMask();
    setInterval(function () {
        b.jMaskGlobals.watchDataMask && b.applyDataMask()
    }, p.watchInterval)
});

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
! function (e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("undefined" != typeof jQuery ? jQuery : window.Zepto)
}(function (e) {
    "use strict";

    function t(t) {
        var r = t.data;
        t.isDefaultPrevented() || (t.preventDefault(), e(t.target).ajaxSubmit(r))
    }

    function r(t) {
        var r = t.target,
            a = e(r);
        if (!a.is("[type=submit],[type=image]")) {
            var n = a.closest("[type=submit]");
            if (0 === n.length) return;
            r = n[0]
        }
        var i = this;
        if (i.clk = r, "image" == r.type)
            if (void 0 !== t.offsetX) i.clk_x = t.offsetX, i.clk_y = t.offsetY;
            else if ("function" == typeof e.fn.offset) {
                var o = a.offset();
                i.clk_x = t.pageX - o.left, i.clk_y = t.pageY - o.top
            } else i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop;
        setTimeout(function () {
            i.clk = i.clk_x = i.clk_y = null
        }, 100)
    }

    function a() {
        if (e.fn.ajaxSubmit.debug) {
            var t = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t)
        }
    }
    var n = {};
    n.fileapi = void 0 !== e("<input type='file'/>").get(0).files, n.formdata = void 0 !== window.FormData;
    var i = !!e.fn.prop;
    e.fn.attr2 = function () {
        if (!i) return this.attr.apply(this, arguments);
        var e = this.prop.apply(this, arguments);
        return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments)
    }, e.fn.ajaxSubmit = function (t) {
        function r(r) {
            var a, n, i = e.param(r, t.traditional).split("&"),
                o = i.length,
                s = [];
            for (a = 0; o > a; a++) i[a] = i[a].replace(/\+/g, " "), n = i[a].split("="), s.push([decodeURIComponent(n[0]), decodeURIComponent(n[1])]);
            return s
        }

        function o(a) {
            for (var n = new FormData, i = 0; i < a.length; i++) n.append(a[i].name, a[i].value);
            if (t.extraData) {
                var o = r(t.extraData);
                for (i = 0; i < o.length; i++) o[i] && n.append(o[i][0], o[i][1])
            }
            t.data = null;
            var s = e.extend(!0, {}, e.ajaxSettings, t, {
                contentType: !1,
                processData: !1,
                cache: !1,
                type: u || "POST"
            });
            t.uploadProgress && (s.xhr = function () {
                var r = e.ajaxSettings.xhr();
                return r.upload && r.upload.addEventListener("progress", function (e) {
                    var r = 0,
                        a = e.loaded || e.position,
                        n = e.total;
                    e.lengthComputable && (r = Math.ceil(a / n * 100)), t.uploadProgress(e, a, n, r)
                }, !1), r
            }), s.data = null;
            var c = s.beforeSend;
            return s.beforeSend = function (e, r) {
                r.data = t.formData ? t.formData : n, c && c.call(this, e, r)
            }, e.ajax(s)
        }

        function s(r) {
            function n(e) {
                var t = null;
                try {
                    e.contentWindow && (t = e.contentWindow.document)
                } catch (r) {
                    a("cannot get iframe.contentWindow document: " + r)
                }
                if (t) return t;
                try {
                    t = e.contentDocument ? e.contentDocument : e.document
                } catch (r) {
                    a("cannot get iframe.contentDocument: " + r), t = e.document
                }
                return t
            }

            function o() {
                function t() {
                    try {
                        var e = n(g).readyState;
                        a("state = " + e), e && "uninitialized" == e.toLowerCase() && setTimeout(t, 50)
                    } catch (r) {
                        a("Server abort: ", r, " (", r.name, ")"), s(k), j && clearTimeout(j), j = void 0
                    }
                }
                var r = f.attr2("target"),
                    i = f.attr2("action"),
                    o = "multipart/form-data",
                    c = f.attr("enctype") || f.attr("encoding") || o;
                w.setAttribute("target", p), (!u || /post/i.test(u)) && w.setAttribute("method", "POST"), i != m.url && w.setAttribute("action", m.url), m.skipEncodingOverride || u && !/post/i.test(u) || f.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                }), m.timeout && (j = setTimeout(function () {
                    T = !0, s(D)
                }, m.timeout));
                var l = [];
                try {
                    if (m.extraData)
                        for (var d in m.extraData) m.extraData.hasOwnProperty(d) && l.push(e.isPlainObject(m.extraData[d]) && m.extraData[d].hasOwnProperty("name") && m.extraData[d].hasOwnProperty("value") ? e('<input type="hidden" name="' + m.extraData[d].name + '">').val(m.extraData[d].value).appendTo(w)[0] : e('<input type="hidden" name="' + d + '">').val(m.extraData[d]).appendTo(w)[0]);
                    m.iframeTarget || v.appendTo("body"), g.attachEvent ? g.attachEvent("onload", s) : g.addEventListener("load", s, !1), setTimeout(t, 15);
                    try {
                        w.submit()
                    } catch (h) {
                        var x = document.createElement("form").submit;
                        x.apply(w)
                    }
                } finally {
                    w.setAttribute("action", i), w.setAttribute("enctype", c), r ? w.setAttribute("target", r) : f.removeAttr("target"), e(l).remove()
                }
            }

            function s(t) {
                if (!x.aborted && !F) {
                    if (M = n(g), M || (a("cannot access response document"), t = k), t === D && x) return x.abort("timeout"), void S.reject(x, "timeout");
                    if (t == k && x) return x.abort("server abort"), void S.reject(x, "error", "server abort");
                    if (M && M.location.href != m.iframeSrc || T) {
                        g.detachEvent ? g.detachEvent("onload", s) : g.removeEventListener("load", s, !1);
                        var r, i = "success";
                        try {
                            if (T) throw "timeout";
                            var o = "xml" == m.dataType || M.XMLDocument || e.isXMLDoc(M);
                            if (a("isXml=" + o), !o && window.opera && (null === M.body || !M.body.innerHTML) && --O) return a("requeing onLoad callback, DOM not available"), void setTimeout(s, 250);
                            var u = M.body ? M.body : M.documentElement;
                            x.responseText = u ? u.innerHTML : null, x.responseXML = M.XMLDocument ? M.XMLDocument : M, o && (m.dataType = "xml"), x.getResponseHeader = function (e) {
                                var t = {
                                    "content-type": m.dataType
                                };
                                return t[e.toLowerCase()]
                            }, u && (x.status = Number(u.getAttribute("status")) || x.status, x.statusText = u.getAttribute("statusText") || x.statusText);
                            var c = (m.dataType || "").toLowerCase(),
                                l = /(json|script|text)/.test(c);
                            if (l || m.textarea) {
                                var f = M.getElementsByTagName("textarea")[0];
                                if (f) x.responseText = f.value, x.status = Number(f.getAttribute("status")) || x.status, x.statusText = f.getAttribute("statusText") || x.statusText;
                                else if (l) {
                                    var p = M.getElementsByTagName("pre")[0],
                                        h = M.getElementsByTagName("body")[0];
                                    p ? x.responseText = p.textContent ? p.textContent : p.innerText : h && (x.responseText = h.textContent ? h.textContent : h.innerText)
                                }
                            } else "xml" == c && !x.responseXML && x.responseText && (x.responseXML = X(x.responseText));
                            try {
                                E = _(x, c, m)
                            } catch (y) {
                                i = "parsererror", x.error = r = y || i
                            }
                        } catch (y) {
                            a("error caught: ", y), i = "error", x.error = r = y || i
                        }
                        x.aborted && (a("upload aborted"), i = null), x.status && (i = x.status >= 200 && x.status < 300 || 304 === x.status ? "success" : "error"), "success" === i ? (m.success && m.success.call(m.context, E, "success", x), S.resolve(x.responseText, "success", x), d && e.event.trigger("ajaxSuccess", [x, m])) : i && (void 0 === r && (r = x.statusText), m.error && m.error.call(m.context, x, i, r), S.reject(x, "error", r), d && e.event.trigger("ajaxError", [x, m, r])), d && e.event.trigger("ajaxComplete", [x, m]), d && !--e.active && e.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, x, i), F = !0, m.timeout && clearTimeout(j), setTimeout(function () {
                            m.iframeTarget ? v.attr("src", m.iframeSrc) : v.remove(), x.responseXML = null
                        }, 100)
                    }
                }
            }
            var c, l, m, d, p, v, g, x, y, b, T, j, w = f[0],
                S = e.Deferred();
            if (S.abort = function (e) {
                x.abort(e)
            }, r)
                for (l = 0; l < h.length; l++) c = e(h[l]), i ? c.prop("disabled", !1) : c.removeAttr("disabled");
            if (m = e.extend(!0, {}, e.ajaxSettings, t), m.context = m.context || m, p = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (v = e(m.iframeTarget), b = v.attr2("name"), b ? p = b : v.attr2("name", p)) : (v = e('<iframe name="' + p + '" src="' + m.iframeSrc + '" />'), v.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            })), g = v[0], x = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function () { },
                getResponseHeader: function () { },
                setRequestHeader: function () { },
                abort: function (t) {
                    var r = "timeout" === t ? "timeout" : "aborted";
                    a("aborting upload... " + r), this.aborted = 1;
                    try {
                        g.contentWindow.document.execCommand && g.contentWindow.document.execCommand("Stop")
                    } catch (n) { }
                    v.attr("src", m.iframeSrc), x.error = r, m.error && m.error.call(m.context, x, r, t), d && e.event.trigger("ajaxError", [x, m, r]), m.complete && m.complete.call(m.context, x, r)
                }
            }, d = m.global, d && 0 === e.active++ && e.event.trigger("ajaxStart"), d && e.event.trigger("ajaxSend", [x, m]), m.beforeSend && m.beforeSend.call(m.context, x, m) === !1) return m.global && e.active--, S.reject(), S;
            if (x.aborted) return S.reject(), S;
            y = w.clk, y && (b = y.name, b && !y.disabled && (m.extraData = m.extraData || {}, m.extraData[b] = y.value, "image" == y.type && (m.extraData[b + ".x"] = w.clk_x, m.extraData[b + ".y"] = w.clk_y)));
            var D = 1,
                k = 2,
                A = e("meta[name=csrf-token]").attr("content"),
                L = e("meta[name=csrf-param]").attr("content");
            L && A && (m.extraData = m.extraData || {}, m.extraData[L] = A), m.forceSync ? o() : setTimeout(o, 10);
            var E, M, F, O = 50,
                X = e.parseXML || function (e, t) {
                    return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null
                },
                C = e.parseJSON || function (e) {
                    return window.eval("(" + e + ")")
                },
                _ = function (t, r, a) {
                    var n = t.getResponseHeader("content-type") || "",
                        i = "xml" === r || !r && n.indexOf("xml") >= 0,
                        o = i ? t.responseXML : t.responseText;
                    return i && "parsererror" === o.documentElement.nodeName && e.error && e.error("parsererror"), a && a.dataFilter && (o = a.dataFilter(o, r)), "string" == typeof o && ("json" === r || !r && n.indexOf("json") >= 0 ? o = C(o) : ("script" === r || !r && n.indexOf("javascript") >= 0) && e.globalEval(o)), o
                };
            return S
        }
        if (!this.length) return a("ajaxSubmit: skipping submit process - no element selected"), this;
        var u, c, l, f = this;
        "function" == typeof t ? t = {
            success: t
        } : void 0 === t && (t = {}), u = t.type || this.attr2("method"), c = t.url || this.attr2("action"), l = "string" == typeof c ? e.trim(c) : "", l = l || window.location.href || "", l && (l = (l.match(/^([^#]+)/) || [])[1]), t = e.extend(!0, {
            url: l,
            success: e.ajaxSettings.success,
            type: u || e.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, t);
        var m = {};
        if (this.trigger("form-pre-serialize", [this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
        if (t.beforeSerialize && t.beforeSerialize(this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
        var d = t.traditional;
        void 0 === d && (d = e.ajaxSettings.traditional);
        var p, h = [],
            v = this.formToArray(t.semantic, h);
        if (t.data && (t.extraData = t.data, p = e.param(t.data, d)), t.beforeSubmit && t.beforeSubmit(v, this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
        if (this.trigger("form-submit-validate", [v, this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
        var g = e.param(v, d);
        p && (g = g ? g + "&" + p : p), "GET" == t.type.toUpperCase() ? (t.url += (t.url.indexOf("?") >= 0 ? "&" : "?") + g, t.data = null) : t.data = g;
        var x = [];
        if (t.resetForm && x.push(function () {
            f.resetForm()
        }), t.clearForm && x.push(function () {
            f.clearForm(t.includeHidden)
        }), !t.dataType && t.target) {
            var y = t.success || function () { };
            x.push(function (r) {
                var a = t.replaceTarget ? "replaceWith" : "html";
                e(t.target)[a](r).each(y, arguments)
            })
        } else t.success && x.push(t.success);
        if (t.success = function (e, r, a) {
            for (var n = t.context || this, i = 0, o = x.length; o > i; i++) x[i].apply(n, [e, r, a || f, f])
        }, t.error) {
            var b = t.error;
            t.error = function (e, r, a) {
                var n = t.context || this;
                b.apply(n, [e, r, a, f])
            }
        }
        if (t.complete) {
            var T = t.complete;
            t.complete = function (e, r) {
                var a = t.context || this;
                T.apply(a, [e, r, f])
            }
        }
        var j = e("input[type=file]:enabled", this).filter(function () {
            return "" !== e(this).val()
        }),
            w = j.length > 0,
            S = "multipart/form-data",
            D = f.attr("enctype") == S || f.attr("encoding") == S,
            k = n.fileapi && n.formdata;
        a("fileAPI :" + k);
        var A, L = (w || D) && !k;
        t.iframe !== !1 && (t.iframe || L) ? t.closeKeepAlive ? e.get(t.closeKeepAlive, function () {
            A = s(v)
        }) : A = s(v) : A = (w || D) && k ? o(v) : e.ajax(t), f.removeData("jqxhr").data("jqxhr", A);
        for (var E = 0; E < h.length; E++) h[E] = null;
        return this.trigger("form-submit-notify", [this, t]), this
    }, e.fn.ajaxForm = function (n) {
        if (n = n || {}, n.delegation = n.delegation && e.isFunction(e.fn.on), !n.delegation && 0 === this.length) {
            var i = {
                s: this.selector,
                c: this.context
            };
            return !e.isReady && i.s ? (a("DOM not ready, queuing ajaxForm"), e(function () {
                e(i.s, i.c).ajaxForm(n)
            }), this) : (a("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this)
        }
        return n.delegation ? (e(document).off("submit.form-plugin", this.selector, t).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, n, t).on("click.form-plugin", this.selector, n, r), this) : this.ajaxFormUnbind().bind("submit.form-plugin", n, t).bind("click.form-plugin", n, r)
    }, e.fn.ajaxFormUnbind = function () {
        return this.unbind("submit.form-plugin click.form-plugin")
    }, e.fn.formToArray = function (t, r) {
        var a = [];
        if (0 === this.length) return a;
        var i, o = this[0],
            s = this.attr("id"),
            u = t ? o.getElementsByTagName("*") : o.elements;
        if (u && !/MSIE [678]/.test(navigator.userAgent) && (u = e(u).get()), s && (i = e(':input[form="' + s + '"]').get(), i.length && (u = (u || []).concat(i))), !u || !u.length) return a;
        var c, l, f, m, d, p, h;
        for (c = 0, p = u.length; p > c; c++)
            if (d = u[c], f = d.name, f && !d.disabled)
                if (t && o.clk && "image" == d.type) o.clk == d && (a.push({
                    name: f,
                    value: e(d).val(),
                    type: d.type
                }), a.push({
                    name: f + ".x",
                    value: o.clk_x
                }, {
                    name: f + ".y",
                    value: o.clk_y
                }));
                else if (m = e.fieldValue(d, !0), m && m.constructor == Array)
                    for (r && r.push(d), l = 0, h = m.length; h > l; l++) a.push({
                        name: f,
                        value: m[l]
                    });
                else if (n.fileapi && "file" == d.type) {
                    r && r.push(d);
                    var v = d.files;
                    if (v.length)
                        for (l = 0; l < v.length; l++) a.push({
                            name: f,
                            value: v[l],
                            type: d.type
                        });
                    else a.push({
                        name: f,
                        value: "",
                        type: d.type
                    })
                } else null !== m && "undefined" != typeof m && (r && r.push(d), a.push({
                    name: f,
                    value: m,
                    type: d.type,
                    required: d.required
                }));
        if (!t && o.clk) {
            var g = e(o.clk),
                x = g[0];
            f = x.name, f && !x.disabled && "image" == x.type && (a.push({
                name: f,
                value: g.val()
            }), a.push({
                name: f + ".x",
                value: o.clk_x
            }, {
                name: f + ".y",
                value: o.clk_y
            }))
        }
        return a
    }, e.fn.formSerialize = function (t) {
        return e.param(this.formToArray(t))
    }, e.fn.fieldSerialize = function (t) {
        var r = [];
        return this.each(function () {
            var a = this.name;
            if (a) {
                var n = e.fieldValue(this, t);
                if (n && n.constructor == Array)
                    for (var i = 0, o = n.length; o > i; i++) r.push({
                        name: a,
                        value: n[i]
                    });
                else null !== n && "undefined" != typeof n && r.push({
                    name: this.name,
                    value: n
                })
            }
        }), e.param(r)
    }, e.fn.fieldValue = function (t) {
        for (var r = [], a = 0, n = this.length; n > a; a++) {
            var i = this[a],
                o = e.fieldValue(i, t);
            null === o || "undefined" == typeof o || o.constructor == Array && !o.length || (o.constructor == Array ? e.merge(r, o) : r.push(o))
        }
        return r
    }, e.fieldValue = function (t, r) {
        var a = t.name,
            n = t.type,
            i = t.tagName.toLowerCase();
        if (void 0 === r && (r = !0), r && (!a || t.disabled || "reset" == n || "button" == n || ("checkbox" == n || "radio" == n) && !t.checked || ("submit" == n || "image" == n) && t.form && t.form.clk != t || "select" == i && -1 == t.selectedIndex)) return null;
        if ("select" == i) {
            var o = t.selectedIndex;
            if (0 > o) return null;
            for (var s = [], u = t.options, c = "select-one" == n, l = c ? o + 1 : u.length, f = c ? o : 0; l > f; f++) {
                var m = u[f];
                if (m.selected) {
                    var d = m.value;
                    if (d || (d = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), c) return d;
                    s.push(d)
                }
            }
            return s
        }
        return e(t).val()
    }, e.fn.clearForm = function (t) {
        return this.each(function () {
            e("input,select,textarea", this).clearFields(t)
        })
    }, e.fn.clearFields = e.fn.clearInputs = function (t) {
        var r = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var a = this.type,
                n = this.tagName.toLowerCase();
            r.test(a) || "textarea" == n ? this.value = "" : "checkbox" == a || "radio" == a ? this.checked = !1 : "select" == n ? this.selectedIndex = -1 : "file" == a ? /MSIE/.test(navigator.userAgent) ? e(this).replaceWith(e(this).clone(!0)) : e(this).val("") : t && (t === !0 && /hidden/.test(a) || "string" == typeof t && e(this).is(t)) && (this.value = "")
        })
    }, e.fn.resetForm = function () {
        return this.each(function () {
            ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
        })
    }, e.fn.enable = function (e) {
        return void 0 === e && (e = !0), this.each(function () {
            this.disabled = !e
        })
    }, e.fn.selected = function (t) {
        return void 0 === t && (t = !0), this.each(function () {
            var r = this.type;
            if ("checkbox" == r || "radio" == r) this.checked = t;
            else if ("option" == this.tagName.toLowerCase()) {
                var a = e(this).parent("select");
                t && a[0] && "select-one" == a[0].type && a.find("option").selected(!1), this.selected = t
            }
        })
    }, e.fn.ajaxSubmit.debug = !1
});
! function (deparam) {
    if ("function" == typeof require && "object" == typeof exports && "object" == typeof module) {
        try {
            var jquery = require("jquery")
        } catch (e) { }
        module.exports = deparam(jquery)
    } else if ("function" == typeof define && define.amd) define(["jquery"], function (e) {
        return deparam(e)
    });
    else {
        var global;
        try {
            global = eval("this")
        } catch (e) {
            global = window
        }
        global.deparam = deparam(global.jQuery)
    }
}(function (e) {
    var t = function (e, t) {
        var r = {},
            o = {
                true: !0,
                false: !1,
                null: null
            };
        return e ? (e.replace(/\+/g, " ").split("&").forEach(function (e) {
            var a, l = e.split("="),
                n = decodeURIComponent(l[0]),
                i = r,
                p = 0,
                c = n.split("]["),
                u = c.length - 1;
            if (/\[/.test(c[0]) && /\]$/.test(c[u]) ? (c[u] = c[u].replace(/\]$/, ""), c = c.shift().split("[").concat(c), u = c.length - 1) : u = 0, 2 === l.length)
                if (a = decodeURIComponent(l[1]), t && (a = a && !isNaN(a) && +a + "" === a ? +a : "undefined" === a ? void 0 : void 0 !== o[a] ? o[a] : a), u)
                    for (; p <= u; p++) n = "" === c[p] ? i.length : c[p], i = i[n] = p < u ? i[n] || (c[p + 1] && isNaN(c[p + 1]) ? {} : []) : a;
                else "[object Array]" === Object.prototype.toString.call(r[n]) ? r[n].push(a) : !{}.hasOwnProperty.call(r, n) ? r[n] = a : r[n] = [r[n], a];
            else n && (r[n] = t ? void 0 : "")
        }), r) : r
    };
    return e && (e.prototype.deparam = e.deparam = t), t
});
/*
 *  Bootstrap TouchSpin - v3.0.1
 *  A mobile and touch friendly input spinner component for Bootstrap 3.
 *  http://www.virtuosoft.eu/code/bootstrap-touchspin/
 *
 *  Made by István Ujj-Mészáros
 *  Under Apache License v2.0 License
 */
! function (a) {
    "use strict";

    function b(a, b) {
        return a + ".touchspin_" + b
    }

    function c(c, d) {
        return a.map(c, function (a) {
            return b(a, d)
        })
    }
    var d = 0;
    a.fn.TouchSpin = function (b) {
        if ("destroy" === b) return void this.each(function () {
            var b = a(this),
                d = b.data();
            a(document).off(c(["mouseup", "touchend", "touchcancel", "mousemove", "touchmove", "scroll", "scrollstart"], d.spinnerid).join(" "))
        });
        var e = {
            min: 0,
            max: 100,
            initval: "",
            step: 1,
            decimals: 0,
            stepinterval: 100,
            forcestepdivisibility: "round",
            stepintervaldelay: 500,
            verticalbuttons: !1,
            verticalupclass: "glyphicon glyphicon-chevron-up",
            verticaldownclass: "glyphicon glyphicon-chevron-down",
            prefix: "",
            postfix: "",
            prefix_extraclass: "",
            postfix_extraclass: "",
            booster: !0,
            boostat: 10,
            maxboostedstep: !1,
            mousewheel: !0,
            buttondown_class: "btn btn-default",
            buttonup_class: "btn btn-default",
            buttondown_txt: "-",
            buttonup_txt: "+"
        },
            f = {
                min: "min",
                max: "max",
                initval: "init-val",
                step: "step",
                decimals: "decimals",
                stepinterval: "step-interval",
                verticalbuttons: "vertical-buttons",
                verticalupclass: "vertical-up-class",
                verticaldownclass: "vertical-down-class",
                forcestepdivisibility: "force-step-divisibility",
                stepintervaldelay: "step-interval-delay",
                prefix: "prefix",
                postfix: "postfix",
                prefix_extraclass: "prefix-extra-class",
                postfix_extraclass: "postfix-extra-class",
                booster: "booster",
                boostat: "boostat",
                maxboostedstep: "max-boosted-step",
                mousewheel: "mouse-wheel",
                buttondown_class: "button-down-class",
                buttonup_class: "button-up-class",
                buttondown_txt: "button-down-txt",
                buttonup_txt: "button-up-txt"
            };
        return this.each(function () {
            function g() {
                if (!J.data("alreadyinitialized")) {
                    if (J.data("alreadyinitialized", !0), d += 1, J.data("spinnerid", d), !J.is("input")) return void console.log("Must be an input.");
                    j(), h(), u(), m(), p(), q(), r(), s(), D.input.css("display", "block")
                }
            }

            function h() {
                "" !== B.initval && "" === J.val() && J.val(B.initval)
            }

            function i(a) {
                l(a), u();
                var b = D.input.val();
                "" !== b && (b = Number(D.input.val()), D.input.val(b.toFixed(B.decimals)))
            }

            function j() {
                B = a.extend({}, e, K, k(), b)
            }

            function k() {
                var b = {};
                return a.each(f, function (a, c) {
                    var d = "bts-" + c;
                    J.is("[data-" + d + "]") && (b[a] = J.data(d))
                }), b
            }

            function l(b) {
                B = a.extend({}, B, b)
            }

            function m() {
                var a = J.val(),
                    b = J.parent();
                "" !== a && (a = Number(a).toFixed(B.decimals)), J.data("initvalue", a).val(a), J.addClass("form-control"), b.hasClass("input-group") ? n(b) : o()
            }

            function n(b) {
                b.addClass("bootstrap-touchspin");
                var c, d, e = J.prev(),
                    f = J.next(),
                    g = '<span class="input-group-addon bootstrap-touchspin-prefix">' + B.prefix + "</span>",
                    h = '<span class="input-group-addon bootstrap-touchspin-postfix">' + B.postfix + "</span>";
                e.hasClass("input-group-btn") ? (c = '<button class="' + B.buttondown_class + ' bootstrap-touchspin-down" type="button">' + B.buttondown_txt + "</button>", e.append(c)) : (c = '<span class="input-group-btn"><button class="' + B.buttondown_class + ' bootstrap-touchspin-down" type="button">' + B.buttondown_txt + "</button></span>", a(c).insertBefore(J)), f.hasClass("input-group-btn") ? (d = '<button class="' + B.buttonup_class + ' bootstrap-touchspin-up" type="button">' + B.buttonup_txt + "</button>", f.prepend(d)) : (d = '<span class="input-group-btn"><button class="' + B.buttonup_class + ' bootstrap-touchspin-up" type="button">' + B.buttonup_txt + "</button></span>", a(d).insertAfter(J)), a(g).insertBefore(J), a(h).insertAfter(J), C = b
            }

            function o() {
                var b;
                b = B.verticalbuttons ? '<div class="input-group bootstrap-touchspin"><span class="input-group-addon bootstrap-touchspin-prefix">' + B.prefix + '</span><span class="input-group-addon bootstrap-touchspin-postfix">' + B.postfix + '</span><span class="input-group-btn-vertical"><button class="' + B.buttondown_class + ' bootstrap-touchspin-up" type="button"><i class="' + B.verticalupclass + '"></i></button><button class="' + B.buttonup_class + ' bootstrap-touchspin-down" type="button"><i class="' + B.verticaldownclass + '"></i></button></span></div>' : '<div class="input-group bootstrap-touchspin"><span class="input-group-btn"><button class="' + B.buttondown_class + ' bootstrap-touchspin-down" type="button">' + B.buttondown_txt + '</button></span><span class="input-group-addon bootstrap-touchspin-prefix">' + B.prefix + '</span><span class="input-group-addon bootstrap-touchspin-postfix">' + B.postfix + '</span><span class="input-group-btn"><button class="' + B.buttonup_class + ' bootstrap-touchspin-up" type="button">' + B.buttonup_txt + "</button></span></div>", C = a(b).insertBefore(J), a(".bootstrap-touchspin-prefix", C).after(J), J.hasClass("input-sm") ? C.addClass("input-group-sm") : J.hasClass("input-lg") && C.addClass("input-group-lg")
            }

            function p() {
                D = {
                    down: a(".bootstrap-touchspin-down", C),
                    up: a(".bootstrap-touchspin-up", C),
                    input: a("input", C),
                    prefix: a(".bootstrap-touchspin-prefix", C).addClass(B.prefix_extraclass),
                    postfix: a(".bootstrap-touchspin-postfix", C).addClass(B.postfix_extraclass)
                }
            }

            function q() {
                "" === B.prefix && D.prefix.hide(), "" === B.postfix && D.postfix.hide()
            }

            function r() {
                J.on("keydown", function (a) {
                    var b = a.keyCode || a.which;
                    38 === b ? ("up" !== M && (w(), z()), a.preventDefault()) : 40 === b && ("down" !== M && (x(), y()), a.preventDefault())
                }), J.on("keyup", function (a) {
                    var b = a.keyCode || a.which;
                    38 === b ? A() : 40 === b && A()
                }), J.on("blur", function () {
                    u()
                }), D.down.on("keydown", function (a) {
                    var b = a.keyCode || a.which;
                    (32 === b || 13 === b) && ("down" !== M && (x(), y()), a.preventDefault())
                }), D.down.on("keyup", function (a) {
                    var b = a.keyCode || a.which;
                    (32 === b || 13 === b) && A()
                }), D.up.on("keydown", function (a) {
                    var b = a.keyCode || a.which;
                    (32 === b || 13 === b) && ("up" !== M && (w(), z()), a.preventDefault())
                }), D.up.on("keyup", function (a) {
                    var b = a.keyCode || a.which;
                    (32 === b || 13 === b) && A()
                }), D.down.on("mousedown.touchspin", function (a) {
                    D.down.off("touchstart.touchspin"), J.is(":disabled") || (x(), y(), a.preventDefault(), a.stopPropagation())
                }), D.down.on("touchstart.touchspin", function (a) {
                    D.down.off("mousedown.touchspin"), J.is(":disabled") || (x(), y(), a.preventDefault(), a.stopPropagation())
                }), D.up.on("mousedown.touchspin", function (a) {
                    D.up.off("touchstart.touchspin"), J.is(":disabled") || (w(), z(), a.preventDefault(), a.stopPropagation())
                }), D.up.on("touchstart.touchspin", function (a) {
                    D.up.off("mousedown.touchspin"), J.is(":disabled") || (w(), z(), a.preventDefault(), a.stopPropagation())
                }), D.up.on("mouseout touchleave touchend touchcancel", function (a) {
                    M && (a.stopPropagation(), A())
                }), D.down.on("mouseout touchleave touchend touchcancel", function (a) {
                    M && (a.stopPropagation(), A())
                }), D.down.on("mousemove touchmove", function (a) {
                    M && (a.stopPropagation(), a.preventDefault())
                }), D.up.on("mousemove touchmove", function (a) {
                    M && (a.stopPropagation(), a.preventDefault())
                }), a(document).on(c(["mouseup", "touchend", "touchcancel"], d).join(" "), function (a) {
                    M && (a.preventDefault(), A())
                }), a(document).on(c(["mousemove", "touchmove", "scroll", "scrollstart"], d).join(" "), function (a) {
                    M && (a.preventDefault(), A())
                }), J.on("mousewheel DOMMouseScroll", function (a) {
                    if (B.mousewheel && J.is(":focus")) {
                        var b = a.originalEvent.wheelDelta || -a.originalEvent.deltaY || -a.originalEvent.detail;
                        a.stopPropagation(), a.preventDefault(), 0 > b ? x() : w()
                    }
                })
            }

            function s() {
                J.on("touchspin.uponce", function () {
                    A(), w()
                }), J.on("touchspin.downonce", function () {
                    A(), x()
                }), J.on("touchspin.startupspin", function () {
                    z()
                }), J.on("touchspin.startdownspin", function () {
                    y()
                }), J.on("touchspin.stopspin", function () {
                    A()
                }), J.on("touchspin.updatesettings", function (a, b) {
                    i(b)
                })
            }

            function t(a) {
                switch (B.forcestepdivisibility) {
                    case "round":
                        return (Math.round(a / B.step) * B.step).toFixed(B.decimals);
                    case "floor":
                        return (Math.floor(a / B.step) * B.step).toFixed(B.decimals);
                    case "ceil":
                        return (Math.ceil(a / B.step) * B.step).toFixed(B.decimals);
                    default:
                        return a
                }
            }

            function u() {
                var a, b, c;
                a = J.val(), "" !== a && (B.decimals > 0 && "." === a || (b = parseFloat(a), isNaN(b) && (b = 0), c = b, b.toString() !== a && (c = b), b < B.min && (c = B.min), b > B.max && (c = B.max), c = t(c), Number(a).toString() !== c.toString() && (J.val(c), J.trigger("change"))))
            }

            function v() {
                if (B.booster) {
                    var a = Math.pow(2, Math.floor(L / B.boostat)) * B.step;
                    return B.maxboostedstep && a > B.maxboostedstep && (a = B.maxboostedstep, E = Math.round(E / a) * a), Math.max(B.step, a)
                }
                return B.step
            }

            function w() {
                u(), E = parseFloat(D.input.val()), isNaN(E) && (E = 0);
                var a = E,
                    b = v();
                E += b, E > B.max && (E = B.max, J.trigger("touchspin.on.max"), A()), D.input.val(Number(E).toFixed(B.decimals)), a !== E && J.trigger("change")
            }

            function x() {
                u(), E = parseFloat(D.input.val()), isNaN(E) && (E = 0);
                var a = E,
                    b = v();
                E -= b, E < B.min && (E = B.min, J.trigger("touchspin.on.min"), A()), D.input.val(E.toFixed(B.decimals)), a !== E && J.trigger("change")
            }

            function y() {
                A(), L = 0, M = "down", J.trigger("touchspin.on.startspin"), J.trigger("touchspin.on.startdownspin"), H = setTimeout(function () {
                    F = setInterval(function () {
                        L++, x()
                    }, B.stepinterval)
                }, B.stepintervaldelay)
            }

            function z() {
                A(), L = 0, M = "up", J.trigger("touchspin.on.startspin"), J.trigger("touchspin.on.startupspin"), I = setTimeout(function () {
                    G = setInterval(function () {
                        L++, w()
                    }, B.stepinterval)
                }, B.stepintervaldelay)
            }

            function A() {
                switch (clearTimeout(H), clearTimeout(I), clearInterval(F), clearInterval(G), M) {
                    case "up":
                        J.trigger("touchspin.on.stopupspin"), J.trigger("touchspin.on.stopspin");
                        break;
                    case "down":
                        J.trigger("touchspin.on.stopdownspin"), J.trigger("touchspin.on.stopspin")
                }
                L = 0, M = !1
            }
            var B, C, D, E, F, G, H, I, J = a(this),
                K = J.data(),
                L = 0,
                M = !1;
            g()
        })
    }
}(jQuery);
/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 4.2.0
 *
 * File input styled for Bootstrap 3.0 that utilizes HTML5 File Input's advanced 
 * features including the FileReader API. 
 * 
 * The plugin drastically enhances the HTML file input to preview multiple files on the client before
 * upload. In addition it provides the ability to preview content of images, text, videos, audio, html, 
 * flash and other objects. It also offers the ability to upload and delete files using AJAX, and add 
 * files in batches (i.e. preview, append, or remove before upload).
 * 
 * Author: Kartik Visweswaran
 * Copyright: 2015, Kartik Visweswaran, Krajee.com
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
! function (e) {
    "use strict";
    e.fn.fileinputLocales = {}, String.prototype.repl = function (e, i) {
        return this.split(e).join(i)
    };
    var i = function (e) {
        var i, t = document.createElement("div");
        return t.innerHTML = "<!--[if IE " + e + "]><i></i><![endif]-->", i = 1 === t.getElementsByTagName("i").length, document.body.appendChild(t), t.parentNode.removeChild(t), i
    },
        t = {
            data: {},
            init: function (e) {
                var i = e.initialPreview,
                    a = e.id;
                i.length > 0 && !z(i) && (i = i.split(e.initialPreviewDelimiter)), t.data[a] = {
                    content: i,
                    config: e.initialPreviewConfig,
                    tags: e.initialPreviewThumbTags,
                    delimiter: e.initialPreviewDelimiter,
                    template: e.previewGenericTemplate,
                    msg: function (i) {
                        return e.getMsgSelected(i)
                    },
                    initId: e.previewInitId,
                    footer: e.getLayoutTemplate("footer"),
                    isDelete: e.initialPreviewShowDelete,
                    caption: e.initialCaption,
                    actions: function (i, t, a, n, r) {
                        return e.renderFileActions(i, t, a, n, r)
                    }
                }
            },
            fetch: function (e) {
                return t.data[e].content.filter(function (e) {
                    return null !== e
                })
            },
            count: function (e, i) {
                return t.data[e] && t.data[e].content ? i ? t.data[e].content.length : t.fetch(e).length : 0
            },
            get: function (e, i, a) {
                var n, r = "init_" + i,
                    l = t.data[e],
                    o = l.initId + "-" + r;
                return a = void 0 === a ? !0 : a, null === l.content[i] ? "" : (n = l.template.repl("{previewId}", o).repl("{frameClass}", " file-preview-initial").repl("{fileindex}", r).repl("{content}", l.content[i]).repl("{footer}", t.footer(e, i, a)), l.tags.length && l.tags[i] && (n = _(n, l.tags[i])), n)
            },
            add: function (i, a, n, r, l) {
                var o, s = e.extend(!0, {}, t.data[i]);
                return z(a) || (a = a.split(s.delimiter)), l ? (o = s.content.push(a) - 1, s.config[o] = n, s.tags[o] = r) : (o = a.length, s.content = a, s.config = n, s.tags = r), t.data[i] = s, o
            },
            set: function (i, a, n, r, l) {
                var o, s = e.extend(!0, {}, t.data[i]);
                if (z(a) || (a = a.split(s.delimiter)), l) {
                    for (o = 0; o < a.length; o++) s.content.push(a[o]);
                    for (o = 0; o < n.length; o++) s.config.push(n[o]);
                    for (o = 0; o < r.length; o++) s.tags.push(r[o])
                } else s.content = a, s.config = n, s.tags = r;
                t.data[i] = s
            },
            unset: function (e, i) {
                var a = t.count(e);
                if (a) {
                    if (1 === a) return t.data[e].content = [], void (t.data[e].config = []);
                    t.data[e].content[i] = null, t.data[e].config[i] = null
                }
            },
            out: function (e) {
                var i, a = "",
                    n = t.data[e],
                    r = t.count(e, !0);
                if (0 === r) return {
                    content: "",
                    caption: ""
                };
                for (var l = 0; r > l; l++) a += t.get(e, l);
                return i = n.msg(t.count(e)), {
                    content: a,
                    caption: i
                }
            },
            footer: function (e, i, a) {
                var n = t.data[e];
                if (a = void 0 === a ? !0 : a, 0 === n.config.length || R(n.config[i])) return "";
                var r = n.config[i],
                    l = M("caption", r) ? r.caption : "",
                    o = M("width", r) ? r.width : "auto",
                    s = M("url", r) ? r.url : !1,
                    d = M("key", r) ? r.key : null,
                    c = s === !1 && a,
                    p = n.isDelete ? n.actions(!1, !0, c, s, d) : "",
                    u = n.footer.repl("{actions}", p);
                return u.repl("{caption}", l).repl("{width}", o).repl("{indicator}", "").repl("{indicatorTitle}", "")
            }
        },
        a = function (e, i) {
            return i = i || 0, "number" == typeof e ? e : ("string" == typeof e && (e = parseFloat(e)), isNaN(e) ? i : e)
        },
        n = function () {
            return window.File && window.FileReader
        },
        r = function () {
            var e = document.createElement("div");
            return !i(9) && (void 0 !== e.draggable || void 0 !== e.ondragstart && void 0 !== e.ondrop)
        },
        l = function () {
            return n && window.FormData
        },
        o = function (e, i) {
            e.removeClass(i).addClass(i)
        },
        s = 'style="width:{width};height:{height};"',
        d = '      <param name="controller" value="true" />\n      <param name="allowFullScreen" value="true" />\n      <param name="allowScriptAccess" value="always" />\n      <param name="autoPlay" value="false" />\n      <param name="autoStart" value="false" />\n      <param name="quality" value="high" />\n',
        c = '<div class="file-preview-other">\n       {previewFileIcon}\n   </div>',
        p = {
            removeIcon: '<i class="glyphicon glyphicon-trash text-danger"></i>',
            removeClass: "btn btn-xs btn-default",
            removeTitle: "Remove file",
            uploadIcon: '<i class="glyphicon glyphicon-upload text-info"></i>',
            uploadClass: "btn btn-xs btn-default",
            uploadTitle: "Upload file",
            indicatorNew: '<i class="glyphicon glyphicon-hand-down text-warning"></i>',
            indicatorSuccess: '<i class="glyphicon glyphicon-ok-sign file-icon-large text-success"></i>',
            indicatorError: '<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',
            indicatorLoading: '<i class="glyphicon glyphicon-hand-up text-muted"></i>',
            indicatorNewTitle: "Not uploaded yet",
            indicatorSuccessTitle: "Uploaded",
            indicatorErrorTitle: "Upload Error",
            indicatorLoadingTitle: "Uploading ..."
        },
        u = '{preview}\n<div class="kv-upload-progress hide"></div>\n<div class="input-group {class}">\n   {caption}\n   <div class="input-group-btn">\n       {remove}\n       {cancel}\n       {upload}\n       {browse}\n   </div>\n</div>',
        f = '{preview}\n<div class="kv-upload-progress hide"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n',
        v = '<div class="file-preview {class}">\n    <div class="close fileinput-remove">&times;</div>\n    <div class="{dropClass}">\n    <div class="file-preview-thumbnails">\n    </div>\n    <div class="clearfix"></div>    <div class="file-preview-status text-center text-success"></div>\n    <div class="kv-fileinput-error"></div>\n    </div>\n</div>',
        h = '<span class="glyphicon glyphicon-file kv-caption-icon"></span>',
        m = '<div tabindex="-1" class="form-control file-caption {class}">\n   <span class="file-caption-ellipsis">&hellip;</span>\n   <div class="file-caption-name"></div>\n</div>',
        g = '<div id="{id}" class="modal fade">\n  <div class="modal-dialog modal-lg">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h3 class="modal-title">Detailed Preview <small>{title}</small></h3>\n      </div>\n      <div class="modal-body">\n        <textarea class="form-control" style="font-family:Monaco,Consolas,monospace; height: {height}px;" readonly>{body}</textarea>\n      </div>\n    </div>\n  </div>\n</div>',
        w = '<div class="progress">\n    <div class="{class}" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n        {percent}%\n     </div>\n</div>',
        b = '<div class="file-thumbnail-footer">\n    <div class="file-caption-name">{caption}</div>\n    {actions}\n</div>',
        x = '<div class="file-actions">\n    <div class="file-footer-buttons">\n        {upload}{delete}{other}    </div>\n    <div class="file-upload-indicator" tabindex="-1" title="{indicatorTitle}">{indicator}</div>\n    <div class="clearfix"></div>\n</div>',
        C = '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}>{removeIcon}</button>\n',
        y = '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">   {uploadIcon}\n</button>\n',
        T = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   {content}\n   {footer}\n</div>\n',
        E = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n    <object data="{data}" type="{type}" width="{width}" height="{height}">\n       ' + c + "\n    </object>\n   {footer}\n</div>",
        F = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   <img src="{data}" class="file-preview-image" title="{caption}" alt="{caption}" ' + s + ">\n   {footer}\n</div>\n",
        k = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   <div class="file-preview-text" title="{caption}" ' + s + ">\n       {data}\n   </div>\n   {footer}\n</div>",
        $ = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + s + '>\n   <video width="{width}" height="{height}" controls>\n       <source src="{data}" type="{type}">\n       ' + c + "\n   </video>\n   {footer}\n</div>\n",
        I = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + s + '>\n   <audio controls>\n       <source src="{data}" type="{type}">\n       ' + c + "\n   </audio>\n   {footer}\n</div>",
        D = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + s + '>\n   <object type="application/x-shockwave-flash" width="{width}" height="{height}" data="{data}">\n' + d + "       " + c + "\n   </object>\n   {footer}\n</div>\n",
        P = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + s + '>\n   <object data="{data}" type="{type}" width="{width}" height="{height}">\n       <param name="movie" value="{caption}" />\n' + d + "         " + c + "\n   </object>\n   {footer}\n</div>",
        S = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + s + ">\n   " + c + "\n   {footer}\n</div>",
        U = {
            main1: u,
            main2: f,
            preview: v,
            icon: h,
            caption: m,
            modal: g,
            progress: w,
            footer: b,
            actions: x,
            actionDelete: C,
            actionUpload: y
        },
        j = {
            generic: T,
            html: E,
            image: F,
            text: k,
            video: $,
            audio: I,
            flash: D,
            object: P,
            other: S
        },
        A = ["image", "html", "text", "video", "audio", "flash", "object"],
        L = {
            image: {
                width: "auto",
                height: "160px"
            },
            html: {
                width: "213px",
                height: "160px"
            },
            text: {
                width: "160px",
                height: "160px"
            },
            video: {
                width: "213px",
                height: "160px"
            },
            audio: {
                width: "213px",
                height: "80px"
            },
            flash: {
                width: "213px",
                height: "160px"
            },
            object: {
                width: "160px",
                height: "160px"
            },
            other: {
                width: "160px",
                height: "160px"
            }
        },
        O = {
            image: function (e, i) {
                return void 0 !== e ? e.match("image.*") : i.match(/\.(gif|png|jpe?g)$/i)
            },
            html: function (e, i) {
                return void 0 !== e ? "text/html" === e : i.match(/\.(htm|html)$/i)
            },
            text: function (e, i) {
                return void 0 !== e && e.match("text.*") || i.match(/\.(txt|md|csv|nfo|php|ini)$/i)
            },
            video: function (e, i) {
                return void 0 !== e && e.match(/\.video\/(ogg|mp4|webm)$/i) || i.match(/\.(og?|mp4|webm)$/i)
            },
            audio: function (e, i) {
                return void 0 !== e && e.match(/\.audio\/(ogg|mp3|wav)$/i) || i.match(/\.(ogg|mp3|wav)$/i)
            },
            flash: function (e, i) {
                return void 0 !== e && "application/x-shockwave-flash" === e || i.match(/\.(swf)$/i)
            },
            object: function () {
                return !0
            },
            other: function () {
                return !0
            }
        },
        R = function (i, t) {
            return null === i || void 0 === i || 0 === i.length || t && "" === e.trim(i)
        },
        z = function (e) {
            return Array.isArray(e) || "[object Array]" === Object.prototype.toString.call(e)
        },
        M = function (e, i) {
            return "object" == typeof i && e in i
        },
        B = function (i, t, a) {
            return R(i) || R(i[t]) ? a : e(i[t])
        },
        N = function () {
            return Math.round((new Date).getTime() + 100 * Math.random())
        },
        Z = function (e) {
            return String(e).repl("&", "&amp;").repl('"', "&quot;").repl("'", "&#39;").repl("<", "&lt;").repl(">", "&gt;")
        },
        _ = function (i, t) {
            var a = i;
            return t = t || {}, e.each(t, function (e, i) {
                "function" == typeof i && (i = i()), a = a.repl(e, i)
            }), a
        },
        q = window.URL || window.webkitURL,
        H = function (t, a) {
            var r = this;
            r.$element = e(t), r.validate() && (n() || i(9) ? (r.init(a), r.listen()) : r.$element.removeClass("file-loading"))
        };
    H.prototype = {
        constructor: H,
        validate: function () {
            var e, i = this;
            return "file" === i.$element.attr("type") ? !0 : (e = '<div class="help-block alert alert-warning"><h4>Invalid Input Type</h4>You must set an input <code>type = file</code> for <b>bootstrap-fileinput</b> plugin to initialize.</div>', i.$element.after(e), !1)
        },
        init: function (n) {
            var s, d = this,
                c = d.$element;
            e.each(n, function (e, i) {
                d[e] = "maxFileCount" === e || "maxFileSize" === e ? a(i) : i
            }), d.fileInputCleared = !1, d.fileBatchCompleted = !0, R(d.allowedPreviewTypes) && (d.allowedPreviewTypes = A), d.uploadFileAttr = R(c.attr("name")) ? "file_data" : c.attr("name"), d.reader = null, d.formdata = {}, d.isIE9 = i(9), d.isIE10 = i(10), d.filestack = [], d.ajaxRequests = [], d.isError = !1, d.ajaxAborted = !1, d.dropZoneEnabled = r() && d.dropZoneEnabled, d.isDisabled = d.$element.attr("disabled") || d.$element.attr("readonly"), d.isUploadable = l && !R(d.uploadUrl), d.slug = "function" == typeof n.slugCallback ? n.slugCallback : d.slugDefault, d.mainTemplate = d.getLayoutTemplate(d.showCaption ? "main1" : "main2"), d.captionTemplate = d.getLayoutTemplate("caption"), d.previewGenericTemplate = d.getPreviewTemplate("generic"), R(d.$element.attr("id")) && d.$element.attr("id", N()), void 0 === d.$container ? d.$container = d.createContainer() : d.refreshContainer(), d.$progress = d.$container.find(".kv-upload-progress"), d.$btnUpload = d.$container.find(".kv-fileinput-upload"), d.$captionContainer = B(n, "elCaptionContainer", d.$container.find(".file-caption")), d.$caption = B(n, "elCaptionText", d.$container.find(".file-caption-name")), d.$previewContainer = B(n, "elPreviewContainer", d.$container.find(".file-preview")), d.$preview = B(n, "elPreviewImage", d.$container.find(".file-preview-thumbnails")), d.$previewStatus = B(n, "elPreviewStatus", d.$container.find(".file-preview-status")), d.$errorContainer = B(n, "elErrorContainer", d.$previewContainer.find(".kv-fileinput-error")), R(d.msgErrorClass) || o(d.$errorContainer, d.msgErrorClass), d.$errorContainer.hide(), d.fileActionSettings = e.extend(p, n.fileActionSettings), d.previewInitId = "preview-" + N(), d.id = d.$element.attr("id"), t.init(d), d.initPreview(!0), d.initPreviewDeletes(), d.options = n, d.setFileDropZoneTitle(), d.uploadCount = 0, d.uploadPercent = 0, d.$element.removeClass("file-loading"), s = d.getLayoutTemplate("progress"), d.progressTemplate = s.replace("{class}", d.progressClass), d.progressCompleteTemplate = s.replace("{class}", d.progressCompleteClass), d.setEllipsis()
        },
        parseError: function (i, t, a) {
            var n = this,
                r = e.trim(t + ""),
                l = "." === r.slice(-1) ? "" : ".",
                o = e(i.responseText).text();
            return n.showAjaxErrorDetails ? (o = e.trim(o.replace(/\n\s*\n/g, "\n")), o = o.length > 0 ? "<pre>" + o + "</pre>" : "", r += l + o) : r += l, a ? "<b>" + a + ": </b>" + i : r
        },
        raise: function (i, t) {
            var a = this,
                n = e.Event(i),
                r = !1;
            if (void 0 !== t ? a.$element.trigger(n, t) : a.$element.trigger(n), n.result && (r = !0), r) switch (i) {
                case "filebatchuploadcomplete":
                case "filebatchuploadsuccess":
                case "fileuploaded":
                case "fileclear":
                case "filecleared":
                case "filereset":
                case "fileerror":
                case "filefoldererror":
                case "fileuploaderror":
                case "filebatchuploaderror":
                case "filedeleteerror":
                case "filecustomerror":
                    break;
                default:
                    a.ajaxAborted = r
            }
        },
        getLayoutTemplate: function (e) {
            var i = this,
                t = M(e, i.layoutTemplates) ? i.layoutTemplates[e] : U[e];
            return R(i.customLayoutTags) ? t : _(t, i.customLayoutTags)
        },
        getPreviewTemplate: function (e) {
            var i = this,
                t = M(e, i.previewTemplates) ? i.previewTemplates[e] : j[e];
            return t = t.repl("{previewFileIcon}", i.previewFileIcon), R(i.customPreviewTags) ? t : _(t, i.customPreviewTags)
        },
        getOutData: function (e, i, t) {
            var a = this;
            return e = e || {}, i = i || {}, t = t || a.filestack.slice(0) || {}, {
                form: a.formdata,
                files: t,
                extra: a.getExtraData(),
                response: i,
                reader: a.reader,
                jqXHR: e
            }
        },
        setEllipsis: function () {
            var e = this,
                i = e.$captionContainer,
                t = e.$caption,
                a = t.clone().css("height", "auto").hide();
            i.parent().before(a), i.removeClass("kv-has-ellipsis"), a.outerWidth() > t.outerWidth() && i.addClass("kv-has-ellipsis"), a.remove()
        },
        listen: function () {
            var i = this,
                t = i.$element,
                a = i.$captionContainer,
                n = i.$btnFile,
                r = t.closest("form");
            t.on("change", e.proxy(i.change, i)), e(window).on("resize", function () {
                i.setEllipsis()
            }), n.off("click").on("click", function () {
                i.raise("filebrowse"), i.isError && !i.isUploadable && i.clear(), a.focus()
            }), r.off("reset").on("reset", e.proxy(i.reset, i)), i.$container.off("click").on("click", ".fileinput-remove:not([disabled])", e.proxy(i.clear, i)).on("click", ".fileinput-cancel", e.proxy(i.cancel, i)), i.isUploadable && i.dropZoneEnabled && i.showPreview && i.initDragDrop(), i.isUploadable || r.on("submit", e.proxy(i.submitForm, i)), i.$container.find(".kv-fileinput-upload").off("click").on("click", function (t) {
                i.isUploadable && (t.preventDefault(), !e(this).hasClass("disabled") && R(e(this).attr("disabled")) && i.upload())
            })
        },
        submitForm: function () {
            var e = this,
                i = e.$element,
                t = i.get(0).files;
            return t && t.length < e.minFileCount && e.minFileCount > 0 ? (e.noFilesError({}), !1) : !e.abort({})
        },
        abort: function (i) {
            var t, a = this;
            return a.ajaxAborted && "object" == typeof a.ajaxAborted && void 0 !== a.ajaxAborted.message ? (t = void 0 !== a.ajaxAborted.data ? a.getOutData({}, a.ajaxAborted.data) : a.getOutData(), t = e.extend(t, i), a.showUploadError(a.ajaxAborted.message, t, "filecustomerror"), !0) : !1
        },
        noFilesError: function (e) {
            var i = this,
                t = i.minFileCount > 1 ? i.filePlural : i.fileSingle,
                a = i.msgFilesTooLess.repl("{n}", i.minFileCount).repl("{files}", t),
                n = i.$errorContainer;
            n.html(a), i.isError = !0, i.updateFileDetails(0), n.fadeIn(800), i.raise("fileerror", [e]), i.clearFileInput(), o(i.$container, "has-error")
        },
        setProgress: function (e) {
            var i = this,
                t = Math.min(e, 100),
                a = 100 > t ? i.progressTemplate : i.progressCompleteTemplate;
            i.$progress.html(a.repl("{percent}", t))
        },
        upload: function () {
            var i, t, a, n = this,
                r = n.getFileStack().length,
                l = {},
                o = !e.isEmptyObject(n.getExtraData());
            if (r < n.minFileCount && n.minFileCount > 0) return void n.noFilesError(l);
            if (n.isUploadable && !n.isDisabled && (0 !== r || o)) {
                if (n.resetUpload(), n.$progress.removeClass("hide"), n.uploadCount = 0, n.uploadPercent = 0, n.lock(), n.setProgress(0), 0 === r && o) return void n.uploadExtraOnly();
                if (a = n.filestack.length, n.hasInitData = !1, n.uploadAsync && n.showPreview)
                    for (t = n.getOutData(), n.raise("filebatchpreupload", [t]), n.fileBatchCompleted = !1, n.uploadCache = {
                        content: [],
                        config: [],
                        tags: [],
                        append: !0
                    }, i = 0; a > i; i += 1) void 0 !== n.filestack[i] && n.uploadSingle(i, n.filestack, !0);
                else n.uploadBatch()
            }
        },
        lock: function () {
            var e = this;
            e.resetErrors(), e.disable(), e.showRemove && o(e.$container.find(".fileinput-remove"), "hide"), e.showCancel && e.$container.find(".fileinput-cancel").removeClass("hide"), e.raise("filelock", [e.filestack, e.getExtraData()])
        },
        unlock: function (e) {
            var i = this;
            void 0 === e && (e = !0), i.enable(), i.showCancel && o(i.$container.find(".fileinput-cancel"), "hide"), i.showRemove && i.$container.find(".fileinput-remove").removeClass("hide"), e && i.resetFileStack(), i.raise("fileunlock", [i.filestack, i.getExtraData()])
        },
        resetFileStack: function () {
            var i = this,
                t = 0,
                a = [];
            i.getThumbs().each(function () {
                var n = e(this),
                    r = n.attr("data-fileindex"),
                    l = i.filestack[r]; - 1 !== r && (void 0 !== l ? (a[t] = l, n.attr({
                        id: i.previewInitId + "-" + t,
                        "data-fileindex": t
                    }), t += 1) : n.attr({
                        id: "uploaded-" + N(),
                        "data-fileindex": "-1"
                    }))
            }), i.filestack = a
        },
        refresh: function (i) {
            var t, a = this,
                n = a.$element,
                r = arguments.length ? e.extend(a.options, i) : a.options;
            n.off(), a.init(r), t = a.$container.find(".file-drop-zone"), t.off("dragenter dragover drop"), e(document).off("dragenter dragover drop"), a.listen(), a.setFileDropZoneTitle()
        },
        initDragDrop: function () {
            var i = this,
                t = i.$container.find(".file-drop-zone");
            t.off("dragenter dragover drop"), e(document).off("dragenter dragover drop"), t.on("dragenter dragover", function (t) {
                t.stopPropagation(), t.preventDefault(), i.isDisabled || o(e(this), "highlighted")
            }), t.on("dragleave", function (t) {
                t.stopPropagation(), t.preventDefault(), i.isDisabled || e(this).removeClass("highlighted")
            }), t.on("drop", function (t) {
                t.preventDefault(), i.isDisabled || (i.change(t, "dragdrop"), e(this).removeClass("highlighted"))
            }), e(document).on("dragenter dragover drop", function (e) {
                e.stopPropagation(), e.preventDefault()
            })
        },
        setFileDropZoneTitle: function () {
            var e = this,
                i = e.$container.find(".file-drop-zone");
            i.find("." + e.dropZoneTitleClass).remove(), e.isUploadable && e.showPreview && 0 !== i.length && !(e.getFileStack().length > 0) && e.dropZoneEnabled && (0 === i.find(".file-preview-frame").length && i.prepend('<div class="' + e.dropZoneTitleClass + '">' + e.dropZoneTitle + "</div>"), e.$container.removeClass("file-input-new"), o(e.$container, "file-input-ajax-new"))
        },
        initFileActions: function () {
            var i = this;
            i.$preview.find(".kv-file-remove").each(function () {
                var a, n, r = e(this),
                    l = r.closest(".file-preview-frame"),
                    o = l.attr("data-fileindex");
                r.off("click").on("click", function () {
                    l.fadeOut("slow", function () {
                        i.filestack[o] = void 0, i.clearObjects(l), l.remove();
                        var e = i.getFileStack(),
                            r = e.length,
                            s = t.count(i.id);
                        i.clearFileInput(), 0 === r && 0 === s ? i.reset() : (a = s + r, n = a > 1 ? i.getMsgSelected(a) : e[0].name, i.setCaption(n))
                    })
                })
            }), i.$preview.find(".kv-file-upload").each(function () {
                var t = e(this);
                t.off("click").on("click", function () {
                    var e = t.closest(".file-preview-frame"),
                        a = e.attr("data-fileindex");
                    i.uploadSingle(a, i.filestack, !1)
                })
            })
        },
        getMsgSelected: function (e) {
            var i = this,
                t = 1 === e ? i.fileSingle : i.filePlural;
            return i.msgSelected.repl("{n}", e).repl("{files}", t)
        },
        renderFileFooter: function (e, i) {
            var t, a, n = this,
                r = n.fileActionSettings,
                l = n.getLayoutTemplate("footer");
            return n.isUploadable ? (t = l.repl("{actions}", n.renderFileActions(!0, !0, !1, !1, !1)), a = t.repl("{caption}", e).repl("{width}", i).repl("{indicator}", r.indicatorNew).repl("{indicatorTitle}", r.indicatorNewTitle)) : a = l.repl("{actions}", "").repl("{caption}", e).repl("{width}", i).repl("{indicator}", "").repl("{indicatorTitle}", ""), a = _(a, n.previewThumbTags)
        },
        renderFileActions: function (e, i, t, a, n) {
            if (!e && !i) return "";
            var r = this,
                l = a === !1 ? "" : ' data-url="' + a + '"',
                o = n === !1 ? "" : ' data-key="' + n + '"',
                s = r.getLayoutTemplate("actionDelete"),
                d = "",
                c = r.getLayoutTemplate("actions"),
                p = r.otherActionButtons.repl("{dataKey}", o),
                u = r.fileActionSettings,
                f = t ? u.removeClass + " disabled" : u.removeClass;
            return s = s.repl("{removeClass}", f).repl("{removeIcon}", u.removeIcon).repl("{removeTitle}", u.removeTitle).repl("{dataUrl}", l).repl("{dataKey}", o), e && (d = r.getLayoutTemplate("actionUpload").repl("{uploadClass}", u.uploadClass).repl("{uploadIcon}", u.uploadIcon).repl("{uploadTitle}", u.uploadTitle)), c.repl("{delete}", s).repl("{upload}", d).repl("{other}", p)
        },
        initPreview: function (e) {
            var i, a = this,
                n = a.initialCaption || "";
            return t.count(a.id) ? (i = t.out(a.id), n = e && a.initialCaption ? a.initialCaption : i.caption, a.$preview.html(i.content), a.setCaption(n), void (R(i.content) || a.$container.removeClass("file-input-new"))) : (a.$preview.html(""), void (e ? a.setCaption(n) : a.initCaption()))
        },
        initPreviewDeletes: function () {
            var i = this,
                a = i.deleteExtraData || {},
                n = function () {
                    0 === i.$preview.find(".kv-file-remove").length && (i.reset(), i.initialCaption = "")
                };
            i.$preview.find(".kv-file-remove").each(function () {
                var r = e(this),
                    l = r.data("url") || i.deleteUrl,
                    s = r.data("key");
                if (!R(l) && void 0 !== s) {
                    var d, c, p, u, f = r.closest(".file-preview-frame"),
                        v = t.data[i.id],
                        h = f.data("fileindex");
                    h = parseInt(h.replace("init_", "")), p = R(v.config) && R(v.config[h]) ? null : v.config[h], u = R(p) || R(p.extra) ? a : p.extra, "function" == typeof u && (u = u()), c = {
                        id: r.attr("id"),
                        key: s,
                        extra: u
                    }, d = e.extend({
                        url: l,
                        type: "DELETE",
                        dataType: "json",
                        data: e.extend({
                            key: s
                        }, u),
                        beforeSend: function (e) {
                            i.ajaxAborted = !1, i.raise("filepredelete", [s, e, u]), i.ajaxAborted ? e.abort() : (o(f, "file-uploading"), o(r, "disabled"))
                        },
                        success: function (e, a, l) {
                            var o, d;
                            return void 0 !== e && void 0 !== e.error ? (c.jqXHR = l, c.response = e, i.showError(e.error, c, "filedeleteerror"), f.removeClass("file-uploading"), r.removeClass("disabled"), void n()) : (t.unset(i.id, h), o = t.count(i.id), d = o > 0 ? i.getMsgSelected(o) : "", i.raise("filedeleted", [s, l, u]), i.setCaption(d), f.removeClass("file-uploading").addClass("file-deleted"), void f.fadeOut("slow", function () {
                                i.clearObjects(f), f.remove(), n(), o || 0 !== i.getFileStack().length || (i.setCaption(""), i.reset())
                            }))
                        },
                        error: function (e, t, a) {
                            var r = i.parseError(e, a);
                            c.jqXHR = e, c.response = {}, i.showError(r, c, "filedeleteerror"), f.removeClass("file-uploading"), n()
                        }
                    }, i.ajaxDeleteSettings), r.off("click").on("click", function () {
                        e.ajax(d)
                    })
                }
            })
        },
        clearObjects: function (i) {
            i.find("video audio").each(function () {
                this.pause(), e(this).remove()
            }), i.find("img object div").each(function () {
                e(this).remove()
            })
        },
        clearFileInput: function () {
            var i, t, a, n = this,
                r = n.$element;
            R(r.val()) || (n.isIE9 || n.isIE10 ? (i = r.closest("form"), t = e(document.createElement("form")), a = e(document.createElement("div")), r.before(a), i.length ? i.after(t) : a.after(t), t.append(r).trigger("reset"), a.before(r).remove(), t.remove()) : r.val(""), n.fileInputCleared = !0)
        },
        resetUpload: function () {
            var e = this;
            e.uploadCache = {
                content: [],
                config: [],
                tags: [],
                append: !0
            }, e.uploadCount = 0, e.uploadPercent = 0, e.$btnUpload.removeAttr("disabled"), e.setProgress(0), o(e.$progress, "hide"), e.resetErrors(!1), e.ajaxAborted = !1, e.ajaxRequests = []
        },
        cancel: function () {
            var i, t = this,
                a = t.ajaxRequests,
                n = a.length;
            if (n > 0)
                for (i = 0; n > i; i += 1) a[i].abort();
            t.getThumbs().each(function () {
                var i = e(this),
                    a = i.attr("data-fileindex");
                i.removeClass("file-uploading"), void 0 !== t.filestack[a] && (i.find(".kv-file-upload").removeClass("disabled").removeAttr("disabled"), i.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")), t.unlock()
            })
        },
        clear: function () {
            var i, a = this;
            a.$btnUpload.removeAttr("disabled"), a.resetUpload(), a.filestack = [], a.clearFileInput(), a.resetErrors(!0), a.raise("fileclear"), !a.overwriteInitial && t.count(a.id) ? (a.showFileIcon(), a.resetPreview(), a.setEllipsis(), a.initPreviewDeletes(), a.$container.removeClass("file-input-new")) : (a.getThumbs().each(function () {
                a.clearObjects(e(this))
            }), a.$preview.html(""), i = !a.overwriteInitial && a.initialCaption.length > 0 ? a.initialCaption : "", a.setCaption(i), a.setEllipsis(), a.$caption.attr("title", ""), o(a.$container, "file-input-new")), 0 === a.$container.find(".file-preview-frame").length && (a.initCaption() || a.$captionContainer.find(".kv-caption-icon").hide(), a.setEllipsis()), a.hideFileIcon(), a.raise("filecleared"), a.$captionContainer.focus(), a.setFileDropZoneTitle()
        },
        resetPreview: function () {
            var e, i = this;
            t.count(i.id) ? (e = t.out(i.id), i.$preview.html(e.content), i.setCaption(e.caption)) : (i.$preview.html(""), i.initCaption())
        },
        reset: function () {
            var e = this;
            e.clear(), e.resetPreview(), e.setEllipsis(), e.$container.find(".fileinput-filename").text(""), e.raise("filereset"), e.initialPreview.length > 0 && e.$container.removeClass("file-input-new"), e.setFileDropZoneTitle(), e.filestack = [], e.formdata = {}
        },
        disable: function () {
            var e = this;
            e.isDisabled = !0, e.raise("filedisabled"), e.$element.attr("disabled", "disabled"), e.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled"), e.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").attr("disabled", !0), e.initDragDrop()
        },
        enable: function () {
            var e = this;
            e.isDisabled = !1, e.raise("fileenabled"), e.$element.removeAttr("disabled"), e.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled"), e.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").removeAttr("disabled"), e.initDragDrop()
        },
        getThumbs: function (e) {
            return e = e || "", this.$preview.find(".file-preview-frame:not(.file-preview-initial)" + e)
        },
        getExtraData: function () {
            var e = this,
                i = e.uploadExtraData;
            return "function" == typeof e.uploadExtraData && (i = e.uploadExtraData()), i
        },
        uploadExtra: function () {
            var i = this,
                t = i.getExtraData();
            0 !== t.length && e.each(t, function (e, t) {
                i.formdata.append(e, t)
            })
        },
        initXhr: function (e, i) {
            var t = this;
            return e.upload && e.upload.addEventListener("progress", function (e) {
                var a = 0,
                    n = e.loaded || e.position,
                    r = e.total;
                e.lengthComputable && (a = Math.ceil(n / r * i)), t.uploadPercent = Math.max(a, t.uploadPercent), t.setProgress(t.uploadPercent)
            }, !1), e
        },
        ajaxSubmit: function (i, t, a, n) {
            var r, l = this;
            l.uploadExtra(), r = e.extend({
                xhr: function () {
                    var i = e.ajaxSettings.xhr();
                    return l.initXhr(i, 98)
                },
                url: l.uploadUrl,
                type: "POST",
                dataType: "json",
                data: l.formdata,
                cache: !1,
                processData: !1,
                contentType: !1,
                beforeSend: i,
                success: t,
                complete: a,
                error: n
            }, l.ajaxSettings), l.ajaxRequests.push(e.ajax(r))
        },
        initUploadSuccess: function (i, a, n) {
            var r, l, o, s, d, c, p, u = this;
            "object" != typeof i || e.isEmptyObject(i) || void 0 !== i.initialPreview && i.initialPreview.length > 0 && (u.hasInitData = !0, d = i.initialPreview || [], c = i.initialPreviewConfig || [], p = i.initialPreviewThumbTags || [], r = void 0 === i.append || i.append ? !0 : !1, u.overwriteInitial = !1, void 0 === a || n ? n ? (u.uploadCache.content.push(d[0]), u.uploadCache.config.push(c[0]), u.uploadCache.tags.push(p[0]), u.uploadCache.append = r) : (t.set(u.id, d, c, p, r), u.initPreview(), u.initPreviewDeletes()) : (o = t.add(u.id, d, c[0], p[0], r), l = t.get(u.id, o, !1), s = e(l).hide(), a.after(s).fadeOut("slow", function () {
                s.fadeIn("slow").css("display:inline-block"), u.initPreviewDeletes(), u.clearFileInput()
            })))
        },
        uploadSingle: function (i, a, n) {
            var r, l, s, d, c, p, u, f, v, h, m = this,
                g = m.getFileStack().length,
                w = new FormData,
                b = m.previewInitId + "-" + i,
                x = e("#" + b + ":not(.file-preview-initial)"),
                C = x.find(".kv-file-upload"),
                y = x.find(".kv-file-remove"),
                T = x.find(".file-upload-indicator"),
                E = m.fileActionSettings,
                F = m.filestack.length > 0 || !e.isEmptyObject(m.uploadExtraData),
                k = {
                    id: b,
                    index: i
                };
            m.formdata = w, 0 === g || !F || C.hasClass("disabled") || m.abort(k) || (s = function () {
                var e = m.getThumbs(".file-uploading");
                e.length > 0 || m.fileBatchCompleted || (m.fileBatchCompleted = !0, setTimeout(function () {
                    t.set(m.id, m.uploadCache.content, m.uploadCache.config, m.uploadCache.tags, m.uploadCache.append), m.hasInitData && (m.initPreview(), m.initPreviewDeletes()), m.setProgress(100), m.unlock(), m.clearFileInput(), m.raise("filebatchuploadcomplete", [m.filestack, m.getExtraData()])
                }, 100))
            }, d = function (e, i) {
                T.html(E[e]), T.attr("title", E[i])
            }, c = function () {
                !n || 0 === g || m.uploadPercent >= 100 || (m.uploadCount += 1, l = 80 + Math.ceil(20 * m.uploadCount / g), m.uploadPercent = Math.max(l, m.uploadPercent), m.setProgress(m.uploadPercent), m.initPreviewDeletes())
            }, p = function () {
                C.removeAttr("disabled"), y.removeAttr("disabled"), x.removeClass("file-uploading")
            }, u = function (t) {
                r = m.getOutData(t), d("indicatorLoading", "indicatorLoadingTitle"), o(x, "file-uploading"), C.attr("disabled", !0), y.attr("disabled", !0), n || m.lock(), m.raise("filepreupload", [r, b, i]), k = e.extend(k, r), m.abort(k) && (t.abort(), m.setProgress(100))
            }, f = function (t, a, l) {
                r = m.getOutData(l, t), k = e.extend(k, r), setTimeout(function () {
                    void 0 === t.error ? (d("indicatorSuccess", "indicatorSuccessTitle"), C.hide(), y.hide(), m.filestack[i] = void 0, m.raise("fileuploaded", [r, b, i]), m.initUploadSuccess(t, x, n), n || m.resetFileStack()) : (d("indicatorError", "indicatorErrorTitle"), m.showUploadError(t.error, k))
                }, 100)
            }, v = function () {
                setTimeout(function () {
                    c(), p(), n ? s() : m.unlock(!1)
                }, 100)
            }, h = function (t, r, l) {
                var o = m.parseError(t, l, n ? a[i].name : null);
                d("indicatorError", "indicatorErrorTitle"), k = e.extend(k, m.getOutData(t)), m.showUploadError(o, k)
            }, w.append(m.uploadFileAttr, a[i]), w.append("file_id", i), m.ajaxSubmit(u, f, v, h))
        },
        uploadBatch: function () {
            var i, t, a, n, r, l, s, d, c = this,
                p = c.filestack,
                u = p.length,
                f = c.filestack.length > 0 || !e.isEmptyObject(c.uploadExtraData),
                v = {};
            c.formdata = new FormData, 0 !== u && f && !c.abort(v) && (i = c.fileActionSettings, t = function (t, a, n) {
                var r = e("#" + c.previewInitId + "-" + t).find(".file-upload-indicator");
                r.html(i[a]), r.attr("title", i[n])
            }, n = function (i) {
                var t = e("#" + c.previewInitId + "-" + i + ":not(.file-preview-initial)"),
                    a = t.find(".kv-file-upload"),
                    n = t.find(".kv-file-delete");
                t.removeClass("file-uploading"), a.removeAttr("disabled"), n.removeAttr("disabled")
            }, a = function () {
                e.each(p, function (e) {
                    c.filestack[e] = void 0
                }), c.clearFileInput()
            }, r = function (i) {
                c.lock();
                var t = c.getOutData(i);
                c.showPreview && c.getThumbs().each(function () {
                    var i = e(this),
                        t = i.find(".kv-file-upload"),
                        a = i.find(".kv-file-remove");
                    o(i, "file-uploading"), t.attr("disabled", !0), a.attr("disabled", !0)
                }), c.raise("filebatchpreupload", [t]), c.abort(t) && i.abort()
            }, l = function (i, r, l) {
                var o = c.getOutData(l, i),
                    s = c.getThumbs(),
                    d = R(i.errorkeys) ? [] : i.errorkeys;
                void 0 === i.error || R(i.error) ? (c.raise("filebatchuploadsuccess", [o]), a(), c.showPreview ? (s.find(".kv-file-upload").hide(), s.find(".kv-file-remove").hide(), s.each(function () {
                    var i = e(this),
                        a = i.attr("data-fileindex");
                    t(a, "indicatorSuccess", "indicatorSuccessTitle"), n(a)
                }), c.initUploadSuccess(i)) : c.reset()) : (c.showPreview && (s.each(function () {
                    var i = e(this),
                        a = parseInt(i.attr("data-fileindex"), 10);
                    return n(a), 0 === d.length ? void t(a, "indicatorError", "indicatorErrorTitle") : void (-1 !== e.inArray(a, d) ? t(a, "indicatorError", "indicatorErrorTitle") : (i.find(".kv-file-upload").hide(), i.find(".kv-file-remove").hide(), t(a, "indicatorSuccess", "indicatorSuccessTitle"), c.filestack[a] = void 0))
                }), c.initUploadSuccess(i)), c.showUploadError(i.error, o, "filebatchuploaderror"))
            }, s = function () {
                c.setProgress(100), c.unlock(), c.raise("filebatchuploadcomplete", [c.filestack, c.getExtraData()]), c.clearFileInput()
            }, d = function (i, a, n) {
                var r = c.getOutData(i),
                    l = c.parseError(i, n);
                c.showUploadError(l, r, "filebatchuploaderror"), c.uploadFileCount = u - 1, c.showPreview && (c.getThumbs().each(function () {
                    var i = e(this),
                        a = i.attr("data-fileindex");
                    i.removeClass("file-uploading"), void 0 !== c.filestack[a] && t(a, "indicatorError", "indicatorErrorTitle")
                }), c.getThumbs().removeClass("file-uploading"), c.getThumbs(" .kv-file-upload").removeAttr("disabled"), c.getThumbs(" .kv-file-delete").removeAttr("disabled"))
            }, e.each(p, function (e, i) {
                R(p[e]) || c.formdata.append(c.uploadFileAttr, i)
            }), c.ajaxSubmit(r, l, s, d))
        },
        uploadExtraOnly: function () {
            var e, i, t, a, n = this,
                r = {};
            n.formdata = new FormData, n.abort(r) || (e = function (e) {
                n.lock();
                var i = n.getOutData(e);
                n.raise("filebatchpreupload", [i]), n.setProgress(50), r.data = i, r.xhr = e, n.abort(r) && (e.abort(), n.setProgress(100))
            }, i = function (e, i, t) {
                var a = n.getOutData(t, e);
                void 0 === e.error || R(e.error) ? (n.raise("filebatchuploadsuccess", [a]), n.clearFileInput(), n.initUploadSuccess(e)) : n.showUploadError(e.error, a, "filebatchuploaderror")
            }, t = function () {
                n.setProgress(100), n.unlock(), n.raise("filebatchuploadcomplete", [n.filestack, n.getExtraData()]), n.clearFileInput()
            }, a = function (e, i, t) {
                var a = n.getOutData(e),
                    l = n.parseError(e, t);
                r.data = a, n.showUploadError(l, a, "filebatchuploaderror")
            }, n.ajaxSubmit(e, i, t, a))
        },
        hideFileIcon: function () {
            this.overwriteInitial && this.$captionContainer.find(".kv-caption-icon").hide()
        },
        showFileIcon: function () {
            this.$captionContainer.find(".kv-caption-icon").show()
        },
        resetErrors: function (e) {
            var i = this,
                t = i.$errorContainer;
            i.isError = !1, i.$container.removeClass("has-error"), t.html(""), e ? t.fadeOut("slow") : t.hide()
        },
        showFolderError: function (e) {
            var i = this,
                t = i.$errorContainer;
            e && (t.html(i.msgFoldersNotAllowed.repl("{n}", e)), t.fadeIn(800), o(i.$container, "has-error"), i.raise("filefoldererror", [e]))
        },
        showUploadError: function (e, i, t) {
            var a = this,
                n = a.$errorContainer,
                r = t || "fileuploaderror";
            return 0 === n.find("ul").length ? n.html("<ul><li>" + e + "</li></ul>") : n.find("ul").append("<li>" + e + "</li>"), n.fadeIn(800), a.raise(r, [i]), o(a.$container, "has-error"), !0
        },
        showError: function (e, i, t) {
            var a = this,
                n = a.$errorContainer,
                r = t || "fileerror";
            return i = i || {}, i.reader = a.reader, n.html(e), n.fadeIn(800), a.raise(r, [i]), a.isUploadable || a.clearFileInput(), o(a.$container, "has-error"), a.$btnUpload.attr("disabled", !0), !0
        },
        errorHandler: function (e, i) {
            var t = this,
                a = e.target.error;
            switch (a.code) {
                case a.NOT_FOUND_ERR:
                    t.showError(t.msgFileNotFound.repl("{name}", i));
                    break;
                case a.SECURITY_ERR:
                    t.showError(t.msgFileSecured.repl("{name}", i));
                    break;
                case a.NOT_READABLE_ERR:
                    t.showError(t.msgFileNotReadable.repl("{name}", i));
                    break;
                case a.ABORT_ERR:
                    t.showError(t.msgFilePreviewAborted.repl("{name}", i));
                    break;
                default:
                    t.showError(t.msgFilePreviewError.repl("{name}", i))
            }
        },
        parseFileType: function (e) {
            var i, t, a, n, r = this;
            for (n = 0; n < A.length; n += 1)
                if (a = A[n], i = M(a, r.fileTypeSettings) ? r.fileTypeSettings[a] : O[a], t = i(e.type, e.name) ? a : "", !R(t)) return t;
            return "other"
        },
        previewDefault: function (i, t, a) {
            if (this.showPreview) {
                var n = this,
                    r = q.createObjectURL(i),
                    l = e("#" + t),
                    o = n.previewSettings.other,
                    s = n.renderFileFooter(i.name, o.width),
                    d = n.getPreviewTemplate("other"),
                    c = t.slice(t.lastIndexOf("-") + 1),
                    p = "";
                a === !0 && (p = " btn disabled", s += '<div class="file-other-error text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i></div>'), n.$preview.append("\n" + d.repl("{previewId}", t).repl("{frameClass}", p).repl("{fileindex}", c).repl("{caption}", n.slug(i.name)).repl("{width}", o.width).repl("{height}", o.height).repl("{type}", i.type).repl("{data}", r).repl("{footer}", s)), l.on("load", function () {
                    q.revokeObjectURL(l.attr("data"))
                })
            }
        },
        previewFile: function (e, i, t, a) {
            if (this.showPreview) {
                var n, r, l, o, s = this,
                    d = s.parseFileType(e),
                    c = s.slug(e.name),
                    p = s.allowedPreviewTypes,
                    u = s.allowedPreviewMimeTypes,
                    f = s.getPreviewTemplate(d),
                    v = M(d, s.previewSettings) ? s.previewSettings[d] : L[d],
                    h = parseInt(s.wrapTextLength, 10),
                    m = s.wrapIndicator,
                    g = p.indexOf(d) >= 0,
                    w = R(u) || !R(u) && -1 !== u.indexOf(e.type),
                    b = s.renderFileFooter(c, v.width),
                    x = "",
                    C = t.slice(t.lastIndexOf("-") + 1);
                g && w ? ("text" === d ? (r = Z(i.target.result), q.revokeObjectURL(a), r.length > h && (l = "text-" + N(), o = .75 * window.innerHeight, x = s.getLayoutTemplate("modal").repl("{id}", l).repl("{title}", c).repl("{height}", o).repl("{body}", r), m = m.repl("{title}", c).repl("{dialog}", "$('#" + l + "').modal('show')"), r = r.substring(0, h - 1) + m), n = f.repl("{previewId}", t).repl("{caption}", c).repl("{frameClass}", "").repl("{type}", e.type).repl("{width}", v.width).repl("{height}", v.height).repl("{data}", r).repl("{footer}", b).repl("{fileindex}", C) + x) : n = f.repl("{previewId}", t).repl("{caption}", c).repl("{frameClass}", "").repl("{type}", e.type).repl("{data}", a).repl("{width}", v.width).repl("{height}", v.height).repl("{footer}", b).repl("{fileindex}", C), s.$preview.append("\n" + n), s.autoSizeImage(t)) : s.previewDefault(e, t)
            }
        },
        slugDefault: function (e) {
            return R(e) ? "" : e.split(/(\\|\/)/g).pop().replace(/[^\w\u00C0-\u017F\-.\\\/ ]+/g, "")
        },
        getFileStack: function () {
            var e = this;
            return e.filestack.filter(function (e) {
                return void 0 !== e
            })
        },
        readFiles: function (i) {
            function t(e) {
                if (R(n.attr("multiple")) && (u = 1), e >= u) return a.isUploadable && a.filestack.length > 0 ? a.raise("filebatchselected", [a.getFileStack()]) : a.raise("filebatchselected", [i]), o.removeClass("loading"), void s.html("");
                var m, g, w, b, x, C, y = v + e,
                    T = p + "-" + y,
                    E = i[e],
                    F = a.slug(E.name),
                    k = (E.size || 0) / 1e3,
                    $ = "",
                    I = q.createObjectURL(E),
                    D = 0,
                    P = a.allowedFileTypes,
                    S = R(P) ? "" : P.join(", "),
                    U = a.allowedFileExtensions,
                    j = R(U) ? "" : U.join(", ");
                if (R(U) || ($ = new RegExp("\\.(" + U.join("|") + ")$", "i")), k = k.toFixed(2), a.maxFileSize > 0 && k > a.maxFileSize) return b = a.msgSizeTooLarge.repl("{name}", F).repl("{size}", k).repl("{maxSize}", a.maxFileSize), void (a.isError = h(b, E, T, e));
                if (!R(P) && z(P)) {
                    for (w = 0; w < P.length; w += 1) x = P[w], g = f[x], C = void 0 !== g && g(E.type, F), D += R(C) ? 0 : C.length;
                    if (0 === D) return b = a.msgInvalidFileType.repl("{name}", F).repl("{types}", S), void (a.isError = h(b, E, T, e))
                }
                return 0 !== D || R(U) || !z(U) || R($) || (C = F.match($), D += R(C) ? 0 : C.length, 0 !== D) ? a.showPreview ? (r.length > 0 && void 0 !== FileReader ? (s.html(d.repl("{index}", e + 1).repl("{files}", u)), o.addClass("loading"), l.onerror = function (e) {
                    a.errorHandler(e, F)
                }, l.onload = function (e) {
                    a.previewFile(E, e, T, I), a.initFileActions()
                }, l.onloadend = function () {
                    b = c.repl("{index}", e + 1).repl("{files}", u).repl("{percent}", 50).repl("{name}", F), setTimeout(function () {
                        s.html(b), q.revokeObjectURL(I)
                    }, 100), setTimeout(function () {
                        t(e + 1), a.updateFileDetails(u)
                    }, 100), a.raise("fileloaded", [E, T, e, l])
                }, l.onprogress = function (i) {
                    if (i.lengthComputable) {
                        var t = i.loaded / i.total * 100,
                            a = Math.ceil(t);
                        b = c.repl("{index}", e + 1).repl("{files}", u).repl("{percent}", a).repl("{name}", F), setTimeout(function () {
                            s.html(b)
                        }, 100)
                    }
                }, m = M("text", f) ? f.text : O.text, m(E.type, F) ? l.readAsText(E, a.textEncoding) : l.readAsArrayBuffer(E)) : (a.previewDefault(E, T), setTimeout(function () {
                    t(e + 1), a.updateFileDetails(u)
                }, 100), a.raise("fileloaded", [E, T, e, l])), void a.filestack.push(E)) : (a.filestack.push(E), setTimeout(t(e + 1), 100), void a.raise("fileloaded", [E, T, e, l])) : (b = a.msgInvalidFileExtension.repl("{name}", F).repl("{extensions}", j), void (a.isError = h(b, E, T, e)))
            }
            this.reader = new FileReader;
            var a = this,
                n = a.$element,
                r = a.$preview,
                l = a.reader,
                o = a.$previewContainer,
                s = a.$previewStatus,
                d = a.msgLoading,
                c = a.msgProgress,
                p = a.previewInitId,
                u = i.length,
                f = a.fileTypeSettings,
                v = a.filestack.length,
                h = function (t, n, r, l) {
                    var o = e.extend(a.getOutData({}, {}, i), {
                        id: r,
                        index: l
                    }),
                        s = {
                            id: r,
                            index: l,
                            file: n,
                            files: i
                        };
                    return a.previewDefault(n, r, !0), a.isUploadable ? a.showUploadError(t, o) : a.showError(t, s)
                };
            t(0), a.updateFileDetails(u, !1)
        },
        updateFileDetails: function (e) {
            var i = this,
                a = i.$element,
                n = i.getFileStack(),
                r = a.val() || n.length && n[0].name || "",
                l = i.slug(r),
                o = i.isUploadable ? n.length : e,
                s = t.count(i.id) + o,
                d = o > 1 ? i.getMsgSelected(s) : l;
            i.isError ? (i.$previewContainer.removeClass("loading"), i.$previewStatus.html(""), i.$captionContainer.find(".kv-caption-icon").hide()) : i.showFileIcon(), i.setCaption(d, i.isError), i.$container.removeClass("file-input-new file-input-ajax-new"), 1 === arguments.length && i.raise("fileselect", [e, l]), t.count(i.id) && i.initPreviewDeletes()
        },
        change: function (i) {
            var a = this,
                n = a.$element;
            if (!a.isUploadable && R(n.val()) && a.fileInputCleared) return void (a.fileInputCleared = !1);
            a.fileInputCleared = !1;
            var r, l, o, s, d = a.$preview,
                c = arguments.length > 1,
                p = c ? i.originalEvent.dataTransfer.files : n.get(0).files,
                u = R(n.attr("multiple")),
                f = 0,
                v = 0,
                h = a.filestack.length,
                m = a.isUploadable,
                g = function (i, t, n, r) {
                    var l = e.extend(a.getOutData({}, {}, p), {
                        id: n,
                        index: r
                    }),
                        o = {
                            id: n,
                            index: r,
                            file: t,
                            files: p
                        };
                    return a.isUploadable ? a.showUploadError(i, l) : a.showError(i, o)
                };
            if (a.reader = null, a.resetUpload(), a.hideFileIcon(), a.isUploadable && a.$container.find(".file-drop-zone ." + a.dropZoneTitleClass).remove(), c)
                for (r = []; p[f];) s = p[f], s.type || s.size % 4096 !== 0 ? r.push(s) : v++, f++;
            else r = void 0 === i.target.files ? i.target && i.target.value ? [{
                name: i.target.value.replace(/^.+\\/, "")
            }] : [] : i.target.files;
            if (R(r) || 0 === r.length) return m || a.clear(), a.showFolderError(v), void a.raise("fileselectnone");
            if (a.resetErrors(), !m || u && h > 0) {
                if (!a.overwriteInitial && t.count(a.id)) {
                    var w = t.out(a.id);
                    d.html(w.content), a.setCaption(w.caption), a.initPreviewDeletes()
                } else d.html("");
                u && h > 0 && (a.filestack = [])
            }
            return o = a.isUploadable ? a.getFileStack().length + r.length : r.length, a.maxFileCount > 0 && o > a.maxFileCount ? (l = a.msgFilesTooMany.repl("{m}", a.maxFileCount).repl("{n}", o), a.isError = g(l, null, null, null), a.$captionContainer.find(".kv-caption-icon").hide(), a.$caption.html(a.msgValidationError), a.setEllipsis(), void a.$container.removeClass("file-input-new file-input-ajax-new")) : (a.isIE9 ? a.updateFileDetails(1) : a.readFiles(r), void a.showFolderError(v))
        },
        autoSizeImage: function (e) {
            var i, t, a, n = this,
                r = n.$preview,
                l = r.find("#" + e),
                o = l.find("img");
            o.length && o.on("load", function () {
                i = l.width(), t = r.width(), i > t && (o.css("width", "100%"), l.css("width", "97%")), a = o.closest(".file-preview-frame").find(".file-caption-name"), a.length && (a.width(o.width()), a.attr("title", a.text())), n.raise("fileimageloaded", e)
            })
        },
        initCaption: function () {
            var e = this,
                i = e.initialCaption || "";
            return e.overwriteInitial || R(i) ? (e.$caption.html(""), !1) : (e.setCaption(i), !0)
        },
        setCaption: function (i, t) {
            var a, n, r = this,
                l = t || !1;
            if (l) a = e("<div>" + r.msgValidationError + "</div>").text(), n = '<span class="' + r.msgValidationErrorClass + '">' + r.msgValidationErrorIcon + a + "</span>";
            else {
                if (R(i) || 0 === r.$caption.length) return;
                a = e("<div>" + i + "</div>").text(), n = r.getLayoutTemplate("icon") + a
            }
            r.$caption.html(n), r.$caption.attr("title", a), r.$captionContainer.find(".file-caption-ellipsis").attr("title", a), r.setEllipsis()
        },
        initBrowse: function (e) {
            var i = this;
            i.$btnFile = e.find(".btn-file"), i.$btnFile.append(i.$element)
        },
        createContainer: function () {
            var i = this,
                t = e(document.createElement("span")).attr({
                    "class": "file-input file-input-new"
                }).html(i.renderMain());
            return i.$element.before(t), i.initBrowse(t), t
        },
        refreshContainer: function () {
            var e = this,
                i = e.$container;
            i.before(e.$element), i.html(e.renderMain()), e.initBrowse(i)
        },
        renderMain: function () {
            var e = this,
                i = e.isUploadable && e.dropZoneEnabled ? " file-drop-zone" : "",
                t = e.showPreview ? e.getLayoutTemplate("preview").repl("{class}", e.previewClass).repl("{dropClass}", i) : "",
                a = e.isDisabled ? e.captionClass + " file-caption-disabled" : e.captionClass,
                n = e.captionTemplate.repl("{class}", a + " kv-fileinput-caption");
            return e.mainTemplate.repl("{class}", e.mainClass).repl("{preview}", t).repl("{caption}", n).repl("{upload}", e.renderUpload()).repl("{remove}", e.renderRemove()).repl("{cancel}", e.renderCancel()).repl("{browse}", e.renderBrowse())
        },
        renderBrowse: function () {
            var e = this,
                i = e.browseClass + " btn-file",
                t = "";
            return e.isDisabled && (t = " disabled "), '<div class="' + i + '"' + t + "> " + e.browseIcon + e.browseLabel + " </div>"
        },
        renderRemove: function () {
            var e = this,
                i = e.removeClass + " fileinput-remove fileinput-remove-button",
                t = "";
            return e.showRemove ? (e.isDisabled && (t = " disabled "), '<button type="button" title="' + e.removeTitle + '" class="' + i + '"' + t + ">" + e.removeIcon + e.removeLabel + "</button>") : ""
        },
        renderCancel: function () {
            var e = this,
                i = e.cancelClass + " fileinput-cancel fileinput-cancel-button";
            return e.showCancel ? '<button type="button" title="' + e.cancelTitle + '" class="hide ' + i + '">' + e.cancelIcon + e.cancelLabel + "</button>" : ""
        },
        renderUpload: function () {
            var e = this,
                i = e.uploadClass + " kv-fileinput-upload fileinput-upload-button",
                t = "",
                a = "";
            return e.showUpload ? (e.isDisabled && (a = " disabled "), t = !e.isUploadable || e.isDisabled ? '<button type="submit" title="' + e.uploadTitle + '"class="' + i + '"' + a + ">" + e.uploadIcon + e.uploadLabel + "</button>" : '<a href="' + e.uploadUrl + '" title="' + e.uploadTitle + '" class="' + i + '"' + a + ">" + e.uploadIcon + e.uploadLabel + "</a>") : ""
        }
    }, e.fn.fileinput = function (t) {
        if (n() || i(9)) {
            var a = Array.apply(null, arguments);
            return a.shift(), this.each(function () {
                var i, n = e(this),
                    r = n.data("fileinput"),
                    l = "object" == typeof t && t,
                    o = l.language || n.data("language") || "en";
                r || (i = e.extend({}, e.fn.fileinput.defaults), "en" === o || R(e.fn.fileinputLocales[o]) || (i = e.extend(i, e.fn.fileinputLocales[o])), r = new H(this, e.extend(i, l, n.data())), n.data("fileinput", r)), "string" == typeof t && r[t].apply(r, a)
            })
        }
    }, e.fn.fileinput.defaults = {
        language: "en",
        showCaption: !0,
        showPreview: !0,
        showRemove: !0,
        showUpload: !0,
        showCancel: !0,
        mainClass: "",
        previewClass: "",
        captionClass: "",
        mainTemplate: null,
        initialCaption: "",
        initialPreview: [],
        initialPreviewDelimiter: "*$$*",
        initialPreviewConfig: [],
        initialPreviewThumbTags: [],
        previewThumbTags: {},
        initialPreviewShowDelete: !0,
        deleteUrl: "",
        deleteExtraData: {},
        overwriteInitial: !0,
        layoutTemplates: U,
        previewTemplates: j,
        allowedPreviewTypes: A,
        allowedPreviewMimeTypes: null,
        allowedFileTypes: null,
        allowedFileExtensions: null,
        customLayoutTags: {},
        customPreviewTags: {},
        previewSettings: L,
        fileTypeSettings: O,
        previewFileIcon: '<i class="glyphicon glyphicon-file"></i>',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i> &nbsp;',
        browseClass: "btn btn-primary",
        removeIcon: '<i class="glyphicon glyphicon-trash"></i> ',
        removeClass: "btn btn-default",
        cancelIcon: '<i class="glyphicon glyphicon-ban-circle"></i> ',
        cancelClass: "btn btn-default",
        uploadIcon: '<i class="glyphicon glyphicon-upload"></i> ',
        uploadClass: "btn btn-default",
        uploadUrl: null,
        uploadAsync: !0,
        uploadExtraData: {},
        maxFileSize: 0,
        minFileCount: 0,
        maxFileCount: 0,
        msgValidationErrorClass: "text-danger",
        msgValidationErrorIcon: '<i class="glyphicon glyphicon-exclamation-sign"></i> ',
        msgErrorClass: "file-error-message",
        progressClass: "progress-bar progress-bar-success progress-bar-striped active",
        progressCompleteClass: "progress-bar progress-bar-success",
        previewFileType: "image",
        wrapTextLength: 250,
        wrapIndicator: ' <span class="wrap-indicator" title="{title}" onclick="{dialog}">[&hellip;]</span>',
        elCaptionContainer: null,
        elCaptionText: null,
        elPreviewContainer: null,
        elPreviewImage: null,
        elPreviewStatus: null,
        elErrorContainer: null,
        slugCallback: null,
        dropZoneEnabled: !0,
        dropZoneTitleClass: "file-drop-zone-title",
        fileActionSettings: {},
        otherActionButtons: "",
        textEncoding: "UTF-8",
        ajaxSettings: {},
        ajaxDeleteSettings: {},
        showAjaxErrorDetails: !0
    }, e.fn.fileinputLocales.en = {
        fileSingle: "file",
        filePlural: "files",
        browseLabel: "Browse &hellip;",
        removeLabel: "Remove",
        removeTitle: "Clear selected files",
        cancelLabel: "Cancel",
        cancelTitle: "Abort ongoing upload",
        uploadLabel: "Upload",
        uploadTitle: "Upload selected files",
        msgSizeTooLarge: 'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>. Please retry your upload!',
        msgFilesTooLess: "You must select at least <b>{n}</b> {files} to upload. Please retry your upload!",
        msgFilesTooMany: "Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>. Please retry your upload!",
        msgFileNotFound: 'File "{name}" not found!',
        msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
        msgValidationError: "File Upload Error",
        msgLoading: "Loading file {index} of {files} &hellip;",
        msgProgress: "Loading file {index} of {files} - {name} - {percent}% completed.",
        msgSelected: "{n} {files} selected",
        msgFoldersNotAllowed: "Drag & drop files only! {n} folder(s) dropped were skipped.",
        dropZoneTitle: "Drag & drop files here &hellip;"
    }, e.extend(e.fn.fileinput.defaults, e.fn.fileinputLocales.en), e.fn.fileinput.Constructor = H, e(document).ready(function () {
        var i = e("input.file[type=file]");
        i.length && i.fileinput()
    })
}(window.jQuery);
// node_modules/posthog-js/dist/module.no-external.js
function e(e2, t2, i2, r2, s2, n2, o2) {
  try {
    var a2 = e2[n2](o2), l2 = a2.value;
  } catch (e3) {
    return void i2(e3);
  }
  a2.done ? t2(l2) : Promise.resolve(l2).then(r2, s2);
}
function t(t2) {
  return function() {
    var i2 = this, r2 = arguments;
    return new Promise((function(s2, n2) {
      var o2 = t2.apply(i2, r2);
      function a2(t3) {
        e(o2, s2, n2, a2, l2, "next", t3);
      }
      function l2(t3) {
        e(o2, s2, n2, a2, l2, "throw", t3);
      }
      a2(void 0);
    }));
  };
}
function i() {
  return i = Object.assign ? Object.assign.bind() : function(e2) {
    for (var t2 = 1; arguments.length > t2; t2++) {
      var i2 = arguments[t2];
      for (var r2 in i2) ({}).hasOwnProperty.call(i2, r2) && (e2[r2] = i2[r2]);
    }
    return e2;
  }, i.apply(null, arguments);
}
function r(e2, t2) {
  if (null == e2) return {};
  var i2 = {};
  for (var r2 in e2) if ({}.hasOwnProperty.call(e2, r2)) {
    if (-1 !== t2.indexOf(r2)) continue;
    i2[r2] = e2[r2];
  }
  return i2;
}
var s = "1.376.0";
var n = { DEBUG: false, LIB_VERSION: s, LIB_NAME: "web", JS_SDK_VERSION: s };
var o = "$people_distinct_id";
var a = "$device_id";
var l = "__alias";
var u = "__timers";
var c = "$autocapture_disabled_server_side";
var d = "$heatmaps_enabled_server_side";
var _ = "$exception_capture_enabled_server_side";
var h = "$error_tracking_suppression_rules";
var p = "$error_tracking_capture_extension_exceptions";
var g = "$web_vitals_enabled_server_side";
var v = "$dead_clicks_enabled_server_side";
var f = "$product_tours_enabled_server_side";
var m = "$web_vitals_allowed_metrics";
var y = "$session_recording_remote_config";
var b = "$replay_override_sampling";
var w = "$replay_override_linked_flag";
var E = "$replay_override_url_trigger";
var S = "$replay_override_event_trigger";
var x = "$sesid";
var k = "$session_is_sampled";
var I = "$enabled_feature_flags";
var P = "$active_feature_flags";
var C = "$early_access_features";
var T = "$feature_flag_details";
var R = "$feature_flag_payloads";
var F = "$feature_flag_request_id";
var L = "$override_feature_flags";
var O = "$override_feature_flag_payloads";
var M = "$stored_person_properties";
var A = "$stored_group_properties";
var D = "$surveys";
var N = "$surveys_activated";
var U = "ph_product_tours";
var q = "$flag_call_reported";
var z = "$flag_call_reported_session_id";
var B = "$feature_flag_errors";
var H = "$feature_flag_evaluated_at";
var j = "$user_state";
var V = "$client_session_props";
var W = "$capture_rate_limit";
var G = "$initial_campaign_params";
var Y = "$initial_referrer_info";
var K = "$initial_person_info";
var J = "$epp";
var X = "__POSTHOG_TOOLBAR__";
var Q = "$posthog_cookieless";
var Z = "$sdk_debug_extensions_init_method";
var ee = "$sdk_debug_extensions_init_time_ms";
var te = "$sdk_debug_recording_script_not_loaded";
var ie = "PostHog loadExternalDependency extension not found.";
var re = "on_reject";
var se = "always";
var ne = "anonymous";
var oe = "identified";
var ae = "identified_only";
var le = "visibilitychange";
var ue = "beforeunload";
var ce = "$pageview";
var de = "$pageleave";
var _e = "$identify";
var he = "$groupidentify";
var pe = "undefined" != typeof window ? window : void 0;
var ge = "undefined" != typeof globalThis ? globalThis : pe;
"undefined" == typeof self && (ge.self = ge), "undefined" == typeof File && (ge.File = function() {
});
var ve;
var fe = null == ge ? void 0 : ge.navigator;
var me = null == ge ? void 0 : ge.document;
var ye = null == ge ? void 0 : ge.location;
var be = null == ge ? void 0 : ge.fetch;
var we = null != ge && ge.XMLHttpRequest && "withCredentials" in new ge.XMLHttpRequest() ? ge.XMLHttpRequest : void 0;
var Ee = null == ge ? void 0 : ge.AbortController;
var Se = null == ge ? void 0 : ge.CompressionStream;
var xe = null == fe ? void 0 : fe.userAgent;
var ke = null != pe ? pe : {};
var Ie = (function(e2) {
  return e2.GZipJS = "gzip-js", e2.Base64 = "base64", e2;
})({});
var Pe = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"];
var Ce = "NativeGzipValidationError";
var Te = (e2) => e2.length >= 2 && 31 === e2[0] && 139 === e2[1];
var Re = (e2) => !(!e2 || "object" != typeof e2) && "NotReadableError" === ("name" in e2 ? String(e2.name) : "");
var Fe = (e2) => {
  var t2 = new Error("Native gzip produced invalid output: " + e2);
  throw t2.name = Ce, t2;
};
var Le = (function() {
  var e2 = t((function* (e3, t2) {
    18 > e3.size && Fe("too-short");
    var i2 = new Uint8Array(yield e3.slice(0, 10).arrayBuffer());
    Te(i2) && 8 === i2[2] || Fe("invalid-header");
    var r2 = new DataView(yield e3.slice(e3.size - 8).arrayBuffer());
    r2.getUint32(0, true) !== ((e4) => {
      for (var t3 = (() => {
        if (ve) return ve;
        ve = [];
        for (var e5 = 0; 256 > e5; e5++) {
          for (var t4 = e5, i4 = 0; 8 > i4; i4++) t4 = 1 & t4 ? 3988292384 ^ t4 >>> 1 : t4 >>> 1;
          ve[e5] = t4 >>> 0;
        }
        return ve;
      })(), i3 = 4294967295, r3 = 0; e4.length > r3; r3++) i3 = t3[255 & (i3 ^ e4[r3])] ^ i3 >>> 8;
      return (4294967295 ^ i3) >>> 0;
    })(t2) && Fe("invalid-crc");
    var s2 = t2.length >>> 0;
    r2.getUint32(4, true) !== s2 && Fe("invalid-size");
  }));
  return function(t2, i2) {
    return e2.apply(this, arguments);
  };
})();
function $e() {
  return $e = t((function* (e2, i2, r2) {
    void 0 === i2 && (i2 = true);
    try {
      var s2 = new TextEncoder().encode(e2), n2 = new CompressionStream("gzip"), o2 = n2.writable.getWriter(), a2 = o2.write(s2).then((() => o2.close())).catch((function() {
        var e3 = t((function* (e4) {
          try {
            yield o2.abort(e4);
          } catch (e5) {
          }
          throw e4;
        }));
        return function(t2) {
          return e3.apply(this, arguments);
        };
      })()), l2 = new Response(n2.readable).blob(), [u2] = yield Promise.all([l2, a2]);
      return yield Le(u2, s2), u2;
    } catch (e3) {
      if (null != r2 && r2.rethrow) throw e3;
      return i2 && console.error("Failed to gzip compress data", e3), null;
    }
  })), $e.apply(this, arguments);
}
var Oe = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"];
var Me = function(e2, t2) {
  if (void 0 === t2 && (t2 = []), !e2) return false;
  var i2 = e2.toLowerCase();
  return Oe.concat(t2).some(((e3) => {
    var t3 = e3.toLowerCase();
    return -1 !== i2.indexOf(t3);
  }));
};
function Ae(e2, t2) {
  return -1 !== e2.indexOf(t2);
}
var De = function(e2) {
  return e2.trim();
};
var Ne = function(e2) {
  return e2.replace(/^\$/, "");
};
var Ue = Object.prototype;
var qe = Ue.hasOwnProperty;
var ze = Ue.toString;
var Be = Array.isArray || function(e2) {
  return "[object Array]" === ze.call(e2);
};
var He = (e2) => "function" == typeof e2;
var je = (e2) => e2 === Object(e2) && !Be(e2);
var Ve = (e2) => {
  if (je(e2)) {
    for (var t2 in e2) if (qe.call(e2, t2)) return false;
    return true;
  }
  return false;
};
var We = (e2) => void 0 === e2;
var Ge = (e2) => "[object String]" == ze.call(e2);
var Ye = (e2) => Ge(e2) && 0 === e2.trim().length;
var Ke = (e2) => null === e2;
var Je = (e2) => We(e2) || Ke(e2);
var Xe = (e2) => "[object Number]" == ze.call(e2) && e2 == e2;
var Qe = (e2) => Xe(e2) && e2 > 0;
var Ze = (e2) => "[object Boolean]" === ze.call(e2);
var et = (e2) => e2 instanceof FormData;
var tt = (e2) => Ae(Pe, e2);
function it(e2) {
  return null === e2 || "object" != typeof e2;
}
function rt(e2, t2) {
  return {}.toString.call(e2) === "[object " + t2 + "]";
}
function st(e2) {
  return "undefined" != typeof Event && (function(e3, t2) {
    try {
      return e3 instanceof t2;
    } catch (e4) {
      return false;
    }
  })(e2, Event);
}
var nt = [true, "true", 1, "1", "yes"];
var ot = (e2) => Ae(nt, e2);
var at = [false, "false", 0, "0", "no"];
function lt(e2, t2, i2, r2, s2) {
  return t2 > i2 && (r2.warn("min cannot be greater than max."), t2 = i2), Xe(e2) ? e2 > i2 ? (r2.warn(" cannot be  greater than max: " + i2 + ". Using max value instead."), i2) : t2 > e2 ? (r2.warn(" cannot be less than min: " + t2 + ". Using min value instead."), t2) : e2 : (r2.warn(" must be a number. using max or fallback. max: " + i2 + ", fallback: " + s2), lt(s2 || i2, t2, i2, r2));
}
var ut = class {
  constructor(e2) {
    this._buckets = {}, this._onBucketRateLimited = e2._onBucketRateLimited, this._bucketSize = lt(e2.bucketSize, 0, 100, e2._logger), this._refillRate = lt(e2.refillRate, 0, this._bucketSize, e2._logger), this._refillInterval = lt(e2.refillInterval, 0, 864e5, e2._logger);
  }
  _applyRefill(e2, t2) {
    var i2 = Math.floor((t2 - e2.lastAccess) / this._refillInterval);
    i2 > 0 && (e2.tokens = Math.min(e2.tokens + i2 * this._refillRate, this._bucketSize), e2.lastAccess = e2.lastAccess + i2 * this._refillInterval);
  }
  consumeRateLimit(e2) {
    var t2, i2 = Date.now(), r2 = String(e2), s2 = this._buckets[r2];
    return s2 ? this._applyRefill(s2, i2) : this._buckets[r2] = s2 = { tokens: this._bucketSize, lastAccess: i2 }, 0 === s2.tokens || (s2.tokens--, 0 === s2.tokens && (null == (t2 = this._onBucketRateLimited) || t2.call(this, e2)), 0 === s2.tokens);
  }
  stop() {
    this._buckets = {};
  }
};
var ct;
var dt;
var _t;
var ht = "Mobile";
var pt = "iOS";
var gt = "Android";
var vt = "Tablet";
var ft = gt + " " + vt;
var mt = "iPad";
var yt = "Apple";
var bt = yt + " Watch";
var wt = "Safari";
var Et = "BlackBerry";
var St = "Samsung";
var xt = St + "Browser";
var kt = St + " Internet";
var It = "Chrome";
var Pt = It + " OS";
var Ct = It + " " + pt;
var Tt = "Internet Explorer";
var Rt = Tt + " " + ht;
var Ft = "Opera";
var Lt = Ft + " Mini";
var $t = "Edge";
var Ot = "Microsoft " + $t;
var Mt = "Firefox";
var At = Mt + " " + pt;
var Dt = "Nintendo";
var Nt = "PlayStation";
var Ut = "Xbox";
var qt = gt + " " + ht;
var zt = ht + " " + wt;
var Bt = "Windows";
var Ht = Bt + " Phone";
var jt = "Nokia";
var Vt = "Ouya";
var Wt = "Generic";
var Gt = Wt + " " + ht.toLowerCase();
var Yt = Wt + " " + vt.toLowerCase();
var Kt = "Konqueror";
var Jt = "Oculus Browser";
var Xt = "(\\d+(\\.\\d+)?)";
var Qt = new RegExp("Version/" + Xt);
var Zt = new RegExp(Ut, "i");
var ei = new RegExp(Nt + " \\w+", "i");
var ti = new RegExp(Dt + " \\w+", "i");
var ii = new RegExp(Et + "|PlayBook|BB10", "i");
var ri = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" };
var si = function(e2, t2) {
  return t2 = t2 || "", Ae(e2, " OPR/") && Ae(e2, "Mini") ? Lt : Ae(e2, " OPR/") ? Ft : ii.test(e2) ? Et : Ae(e2, "IE" + ht) || Ae(e2, "WPDesktop") ? Rt : Ae(e2, "OculusBrowser") ? Jt : Ae(e2, xt) ? kt : Ae(e2, $t) || Ae(e2, "Edg/") ? Ot : Ae(e2, "FBIOS") ? "Facebook " + ht : Ae(e2, "UCWEB") || Ae(e2, "UCBrowser") ? "UC Browser" : Ae(e2, "CriOS") ? Ct : Ae(e2, "CrMo") || Ae(e2, It) ? It : Ae(e2, gt) && Ae(e2, wt) ? qt : Ae(e2, "FxiOS") ? At : Ae(e2.toLowerCase(), Kt.toLowerCase()) ? Kt : ((e3, t3) => t3 && Ae(t3, yt) || (function(e4) {
    return Ae(e4, wt) && !Ae(e4, It) && !Ae(e4, gt);
  })(e3))(e2, t2) ? Ae(e2, ht) ? zt : wt : Ae(e2, Mt) ? Mt : Ae(e2, "MSIE") || Ae(e2, "Trident/") ? Tt : Ae(e2, "Gecko") ? Mt : "";
};
var ni = { [Rt]: [new RegExp("rv:" + Xt)], [Ot]: [new RegExp($t + "?\\/" + Xt)], [It]: [new RegExp("(" + It + "|CrMo)\\/" + Xt)], [Ct]: [new RegExp("CriOS\\/" + Xt)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + Xt)], [wt]: [Qt], [zt]: [Qt], [Ft]: [new RegExp("(Opera|OPR)\\/" + Xt)], [Mt]: [new RegExp(Mt + "\\/" + Xt)], [At]: [new RegExp("FxiOS\\/" + Xt)], [Kt]: [new RegExp("Konqueror[:/]?" + Xt, "i")], [Et]: [new RegExp(Et + " " + Xt), Qt], [qt]: [new RegExp("android\\s" + Xt, "i")], [kt]: [new RegExp(xt + "\\/" + Xt)], [Jt]: [new RegExp("OculusBrowser\\/" + Xt)], [Tt]: [new RegExp("(rv:|MSIE )" + Xt)], Mozilla: [new RegExp("rv:" + Xt)] };
var oi = function(e2, t2) {
  var i2 = si(e2, t2), r2 = ni[i2];
  if (We(r2)) return null;
  for (var s2 = 0; r2.length > s2; s2++) {
    var n2 = e2.match(r2[s2]);
    if (n2) return parseFloat(n2[n2.length - 2]);
  }
  return null;
};
var ai = [[new RegExp(Ut + "; " + Ut + " (.*?)[);]", "i"), (e2) => [Ut, e2 && e2[1] || ""]], [new RegExp(Dt, "i"), [Dt, ""]], [new RegExp(Nt, "i"), [Nt, ""]], [ii, [Et, ""]], [new RegExp(Bt, "i"), (e2, t2) => {
  if (/Phone/.test(t2) || /WPDesktop/.test(t2)) return [Ht, ""];
  if (new RegExp(ht).test(t2) && !/IEMobile\b/.test(t2)) return [Bt + " " + ht, ""];
  var i2 = /Windows NT ([0-9.]+)/i.exec(t2);
  if (i2 && i2[1]) {
    var r2 = ri[i2[1]] || "";
    return /arm/i.test(t2) && (r2 = "RT"), [Bt, r2];
  }
  return [Bt, ""];
}], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, (e2) => e2 && e2[3] ? [pt, [e2[3], e2[4], e2[5] || "0"].join(".")] : [pt, ""]], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, (e2) => {
  var t2 = "";
  return e2 && e2.length >= 3 && (t2 = We(e2[2]) ? e2[3] : e2[2]), ["watchOS", t2];
}], [new RegExp("(" + gt + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + gt + ")", "i"), (e2) => e2 && e2[2] ? [gt, [e2[2], e2[3], e2[4] || "0"].join(".")] : [gt, ""]], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, (e2) => {
  var t2 = ["Mac OS X", ""];
  return e2 && e2[1] && (t2[1] = [e2[1], e2[2], e2[3] || "0"].join(".")), t2;
}], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [Pt, ""]], [/Linux|debian/i, ["Linux", ""]]];
var li = function(e2) {
  return ti.test(e2) ? Dt : ei.test(e2) ? Nt : Zt.test(e2) ? Ut : new RegExp(Vt, "i").test(e2) ? Vt : new RegExp("(" + Ht + "|WPDesktop)", "i").test(e2) ? Ht : /iPad/.test(e2) ? mt : /iPod/.test(e2) ? "iPod Touch" : /iPhone/.test(e2) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(e2) ? bt : ii.test(e2) ? Et : /(kobo)\s(ereader|touch)/i.test(e2) ? "Kobo" : new RegExp(jt, "i").test(e2) ? jt : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(e2) || /(kf[a-z]+)( bui|\)).+silk\//i.test(e2) ? "Kindle Fire" : /(Android|ZTE)/i.test(e2) ? new RegExp(ht).test(e2) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(e2) || /pixel[\daxl ]{1,6}/i.test(e2) && !/pixel c/i.test(e2) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(e2) || /lmy47v/i.test(e2) && !/QTAQZ3/i.test(e2) ? gt : ft : new RegExp("(pda|" + ht + ")", "i").test(e2) ? Gt : new RegExp(vt, "i").test(e2) && !new RegExp(vt + " pc", "i").test(e2) ? Yt : "";
};
var ui = (e2) => e2 instanceof Error;
var ci = { trace: { text: "TRACE", number: 1 }, debug: { text: "DEBUG", number: 5 }, info: { text: "INFO", number: 9 }, warn: { text: "WARN", number: 13 }, error: { text: "ERROR", number: 17 }, fatal: { text: "FATAL", number: 21 } };
var di = ci.info;
function _i(e2) {
  if (Ze(e2)) return { boolValue: e2 };
  if ("number" == typeof e2) return Number.isFinite(e2) ? Number.isInteger(e2) ? { intValue: e2 } : { doubleValue: e2 } : { stringValue: String(e2) };
  if ("string" == typeof e2) return { stringValue: e2 };
  if (Be(e2)) return { arrayValue: { values: e2.map(((e3) => _i(e3))) } };
  try {
    return { stringValue: JSON.stringify(e2) };
  } catch (t2) {
    return { stringValue: String(e2) };
  }
}
function hi(e2) {
  var t2 = [];
  for (var i2 in e2) {
    var r2 = e2[i2];
    Ke(r2) || We(r2) || t2.push({ key: i2, value: _i(r2) });
  }
  return t2;
}
function pi(e2) {
  var t2 = globalThis._posthogChunkIds;
  if (t2) {
    var i2 = Object.keys(t2);
    return _t && i2.length === dt || (dt = i2.length, _t = i2.reduce(((i3, r2) => {
      ct || (ct = {});
      var s2 = ct[r2];
      if (s2) i3[s2[0]] = s2[1];
      else for (var n2 = e2(r2), o2 = n2.length - 1; o2 >= 0; o2--) {
        var a2 = n2[o2], l2 = null == a2 ? void 0 : a2.filename, u2 = t2[r2];
        if (l2 && u2) {
          i3[l2] = u2, ct[r2] = [l2, u2];
          break;
        }
      }
      return i3;
    }), {})), _t;
  }
}
var gi = class {
  constructor(e2, t2, i2) {
    void 0 === i2 && (i2 = []), this.coercers = e2, this.stackParser = t2, this.modifiers = i2;
  }
  buildFromUnknown(e2, t2) {
    void 0 === t2 && (t2 = {});
    var i2 = t2 && t2.mechanism || { handled: true, type: "generic" }, r2 = this.buildCoercingContext(i2, t2, 0).apply(e2), s2 = this.buildParsingContext(t2), n2 = this.parseStacktrace(r2, s2);
    return { $exception_list: this.convertToExceptionList(n2, i2), $exception_level: "error" };
  }
  modifyFrames(e2) {
    var i2 = this;
    return t((function* () {
      for (var t2 of e2) t2.stacktrace && t2.stacktrace.frames && Be(t2.stacktrace.frames) && (t2.stacktrace.frames = yield i2.applyModifiers(t2.stacktrace.frames));
      return e2;
    }))();
  }
  coerceFallback(e2) {
    var t2;
    return { type: "Error", value: "Unknown error", stack: null == (t2 = e2.syntheticException) ? void 0 : t2.stack, synthetic: true };
  }
  parseStacktrace(e2, t2) {
    var r2, s2;
    return null != e2.cause && (r2 = this.parseStacktrace(e2.cause, t2)), "" != e2.stack && null != e2.stack && (s2 = this.applyChunkIds(this.stackParser(e2.stack, e2.synthetic ? t2.skipFirstLines : 0), t2.chunkIdMap)), i({}, e2, { cause: r2, stack: s2 });
  }
  applyChunkIds(e2, t2) {
    return e2.map(((e3) => (e3.filename && t2 && (e3.chunk_id = t2[e3.filename]), e3)));
  }
  applyCoercers(e2, t2) {
    for (var i2 of this.coercers) if (i2.match(e2)) return i2.coerce(e2, t2);
    return this.coerceFallback(t2);
  }
  applyModifiers(e2) {
    var i2 = this;
    return t((function* () {
      var t2 = e2;
      for (var r2 of i2.modifiers) t2 = yield r2(t2);
      return t2;
    }))();
  }
  convertToExceptionList(e2, t2) {
    var r2, s2, n2, o2 = { type: e2.type, value: e2.value, mechanism: { type: null !== (r2 = t2.type) && void 0 !== r2 ? r2 : "generic", handled: null === (s2 = t2.handled) || void 0 === s2 || s2, synthetic: null !== (n2 = e2.synthetic) && void 0 !== n2 && n2 } };
    e2.stack && (o2.stacktrace = { type: "raw", frames: e2.stack });
    var a2 = [o2];
    return null != e2.cause && a2.push(...this.convertToExceptionList(e2.cause, i({}, t2, { handled: true }))), a2;
  }
  buildParsingContext(e2) {
    var t2;
    return { chunkIdMap: pi(this.stackParser), skipFirstLines: null !== (t2 = e2.skipFirstLines) && void 0 !== t2 ? t2 : 1 };
  }
  buildCoercingContext(e2, t2, r2) {
    void 0 === r2 && (r2 = 0);
    var s2 = (i2, r3) => {
      if (4 >= r3) {
        var s3 = this.buildCoercingContext(e2, t2, r3);
        return this.applyCoercers(i2, s3);
      }
    };
    return i({}, t2, { syntheticException: 0 == r2 ? t2.syntheticException : void 0, mechanism: e2, apply: (e3) => s2(e3, r2), next: (e3) => s2(e3, r2 + 1) });
  }
};
var vi = "?";
function fi(e2, t2, i2, r2, s2) {
  var n2 = { platform: e2, filename: t2, function: "<anonymous>" === i2 ? vi : i2, in_app: true };
  return We(r2) || (n2.lineno = r2), We(s2) || (n2.colno = s2), n2;
}
var mi = (e2, t2) => {
  var i2 = -1 !== e2.indexOf("safari-extension"), r2 = -1 !== e2.indexOf("safari-web-extension");
  return i2 || r2 ? [-1 !== e2.indexOf("@") ? e2.split("@")[0] : vi, i2 ? "safari-extension:" + t2 : "safari-web-extension:" + t2] : [e2, t2];
};
var yi = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
var bi = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var wi = /\((\S*)(?::(\d+))(?::(\d+))\)/;
var Ei = (e2, t2) => {
  var i2 = yi.exec(e2);
  if (i2) {
    var [, r2, s2, n2] = i2;
    return fi(t2, r2, vi, +s2, +n2);
  }
  var o2 = bi.exec(e2);
  if (o2) {
    if (o2[2] && 0 === o2[2].indexOf("eval")) {
      var a2 = wi.exec(o2[2]);
      a2 && (o2[2] = a2[1], o2[3] = a2[2], o2[4] = a2[3]);
    }
    var [l2, u2] = mi(o2[1] || vi, o2[2]);
    return fi(t2, u2, l2, o2[3] ? +o2[3] : void 0, o2[4] ? +o2[4] : void 0);
  }
};
var Si = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var xi = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
var ki = (e2, t2) => {
  var i2 = Si.exec(e2);
  if (i2) {
    if (i2[3] && i2[3].indexOf(" > eval") > -1) {
      var r2 = xi.exec(i2[3]);
      r2 && (i2[1] = i2[1] || "eval", i2[3] = r2[1], i2[4] = r2[2], i2[5] = "");
    }
    var s2 = i2[3], n2 = i2[1] || vi;
    return [n2, s2] = mi(n2, s2), fi(t2, s2, n2, i2[4] ? +i2[4] : void 0, i2[5] ? +i2[5] : void 0);
  }
};
var Ii = /\(error: (.*)\)/;
var Pi = class {
  match(e2) {
    return this.isDOMException(e2) || this.isDOMError(e2);
  }
  coerce(e2, t2) {
    var i2 = Ge(e2.stack);
    return { type: this.getType(e2), value: this.getValue(e2), stack: i2 ? e2.stack : void 0, cause: e2.cause ? t2.next(e2.cause) : void 0, synthetic: false };
  }
  getType(e2) {
    return this.isDOMError(e2) ? "DOMError" : "DOMException";
  }
  getValue(e2) {
    var t2 = e2.name || (this.isDOMError(e2) ? "DOMError" : "DOMException");
    return e2.message ? t2 + ": " + e2.message : t2;
  }
  isDOMException(e2) {
    return rt(e2, "DOMException");
  }
  isDOMError(e2) {
    return rt(e2, "DOMError");
  }
};
var Ci = class {
  match(e2) {
    return ((e3) => e3 instanceof Error)(e2);
  }
  coerce(e2, t2) {
    return { type: this.getType(e2), value: this.getMessage(e2, t2), stack: this.getStack(e2), cause: e2.cause ? t2.next(e2.cause) : void 0, synthetic: false };
  }
  getType(e2) {
    return e2.name || e2.constructor.name;
  }
  getMessage(e2, t2) {
    var i2 = e2.message;
    return String(i2.error && "string" == typeof i2.error.message ? i2.error.message : i2);
  }
  getStack(e2) {
    return e2.stacktrace || e2.stack || void 0;
  }
};
var Ti = class {
  constructor() {
  }
  match(e2) {
    return rt(e2, "ErrorEvent") && null != e2.error;
  }
  coerce(e2, t2) {
    var i2;
    return t2.apply(e2.error) || { type: "ErrorEvent", value: e2.message, stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
};
var Ri = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
var Fi = class {
  match(e2) {
    return "string" == typeof e2;
  }
  coerce(e2, t2) {
    var i2, [r2, s2] = this.getInfos(e2);
    return { type: null != r2 ? r2 : "Error", value: null != s2 ? s2 : e2, stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
  getInfos(e2) {
    var t2 = "Error", i2 = e2, r2 = e2.match(Ri);
    return r2 && (t2 = r2[1], i2 = r2[2]), [t2, i2];
  }
};
var Li = ["fatal", "error", "warning", "log", "info", "debug"];
function $i(e2, t2) {
  void 0 === t2 && (t2 = 40);
  var i2 = Object.keys(e2);
  if (i2.sort(), !i2.length) return "[object has no keys]";
  for (var r2 = i2.length; r2 > 0; r2--) {
    var s2 = i2.slice(0, r2).join(", ");
    if (t2 >= s2.length) return r2 === i2.length ? s2 : s2.length > t2 ? s2.slice(0, t2) + "..." : s2;
  }
  return "";
}
var Oi = class {
  match(e2) {
    return "object" == typeof e2 && null !== e2;
  }
  coerce(e2, t2) {
    var i2, r2 = this.getErrorPropertyFromObject(e2);
    return r2 ? t2.apply(r2) : { type: this.getType(e2), value: this.getValue(e2), stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, level: this.isSeverityLevel(e2.level) ? e2.level : "error", synthetic: true };
  }
  getType(e2) {
    return st(e2) ? e2.constructor.name : "Error";
  }
  getValue(e2) {
    if ("name" in e2 && "string" == typeof e2.name) {
      var t2 = "'" + e2.name + "' captured as exception";
      return "message" in e2 && "string" == typeof e2.message && (t2 += " with message: '" + e2.message + "'"), t2;
    }
    if ("message" in e2 && "string" == typeof e2.message) return e2.message;
    var i2 = this.getObjectClassName(e2);
    return (i2 && "Object" !== i2 ? "'" + i2 + "'" : "Object") + " captured as exception with keys: " + $i(e2);
  }
  isSeverityLevel(e2) {
    return Ge(e2) && !Ye(e2) && Li.indexOf(e2) >= 0;
  }
  getErrorPropertyFromObject(e2) {
    for (var t2 in e2) if ({}.hasOwnProperty.call(e2, t2)) {
      var i2 = e2[t2];
      if (ui(i2)) return i2;
    }
  }
  getObjectClassName(e2) {
    try {
      var t2 = Object.getPrototypeOf(e2);
      return t2 ? t2.constructor.name : void 0;
    } catch (e3) {
      return;
    }
  }
};
var Mi = class {
  match(e2) {
    return st(e2);
  }
  coerce(e2, t2) {
    var i2, r2 = e2.constructor.name;
    return { type: r2, value: r2 + " captured as exception with keys: " + $i(e2), stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
};
var Ai = class {
  match(e2) {
    return it(e2);
  }
  coerce(e2, t2) {
    var i2;
    return { type: "Error", value: "Primitive value captured as exception: " + String(e2), stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
};
var Di = class {
  match(e2) {
    return rt(e2, "PromiseRejectionEvent") || this.isCustomEventWrappingRejection(e2);
  }
  isCustomEventWrappingRejection(e2) {
    if (!st(e2)) return false;
    try {
      var t2 = e2.detail;
      return null != t2 && "object" == typeof t2 && "reason" in t2;
    } catch (e3) {
      return false;
    }
  }
  coerce(e2, t2) {
    var i2, r2 = this.getUnhandledRejectionReason(e2);
    return it(r2) ? { type: "UnhandledRejection", value: "Non-Error promise rejection captured with value: " + String(r2), stack: null == (i2 = t2.syntheticException) ? void 0 : i2.stack, synthetic: true } : t2.apply(r2);
  }
  getUnhandledRejectionReason(e2) {
    try {
      if ("reason" in e2) return e2.reason;
      if ("detail" in e2 && null != e2.detail && "object" == typeof e2.detail && "reason" in e2.detail) return e2.detail.reason;
    } catch (e3) {
    }
    return e2;
  }
};
var Ni = "$message";
var Ui = "$timestamp";
var qi = /* @__PURE__ */ new Set([Ni, Ui]);
var zi = { enabled: true, max_bytes: 32768 };
function Bi(e2) {
  var t2;
  return e2 ? { enabled: null !== (t2 = e2.enabled) && void 0 !== t2 ? t2 : zi.enabled, max_bytes: ji(e2.max_bytes, zi.max_bytes) } : i({}, zi);
}
var Hi = class {
  constructor(e2) {
    this._entries = [], this._totalBytes = 0, this._config = Bi(e2);
  }
  setConfig(e2) {
    this._config = Bi(e2), this._trimToMaxBytes();
  }
  add(e2) {
    var t2 = (function(e3) {
      var t3 = (function(e4) {
        var t4 = /* @__PURE__ */ new WeakSet();
        try {
          return JSON.stringify(e4, ((e5, i4) => {
            if ("bigint" == typeof i4) return i4.toString();
            if ("function" != typeof i4 && "symbol" != typeof i4) {
              if (i4 instanceof Date) return i4.toISOString();
              if (i4 instanceof Error) return { name: i4.name, message: i4.message, stack: i4.stack };
              if (i4 && "object" == typeof i4) {
                if (t4.has(i4)) return "[Circular]";
                t4.add(i4);
              }
              return i4;
            }
          }));
        } catch (e5) {
          return;
        }
      })(e3);
      if (t3) try {
        var i3 = JSON.parse(t3);
        if (!je(i3)) return;
        var r2 = i3, s2 = r2[Ni], n2 = r2[Ui];
        if (!Ge(s2) || 0 === s2.trim().length) return;
        if (!Ge(n2) && !Xe(n2)) return;
        return { step: r2, json: t3 };
      } catch (e4) {
        return;
      }
    })(e2);
    if (t2) {
      var i2 = (function(e3) {
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(e3).length;
        for (var t3 = encodeURIComponent(e3), i3 = 0, r2 = 0; t3.length > r2; r2++) "%" === t3[r2] ? (i3 += 1, r2 += 2) : i3 += 1;
        return i3;
      })(t2.json);
      i2 > this._config.max_bytes || (this._entries.push({ step: t2.step, bytes: i2 }), this._totalBytes += i2, this._trimToMaxBytes());
    }
  }
  getAttachable() {
    return this._entries.map(((e2) => e2.step));
  }
  clear() {
    this._entries = [], this._totalBytes = 0;
  }
  size() {
    return this._entries.length;
  }
  _trimToMaxBytes() {
    for (; this._totalBytes > this._config.max_bytes && this._entries.length > 0; ) {
      var e2 = this._entries.shift();
      e2 && (this._totalBytes -= e2.bytes);
    }
  }
};
function ji(e2, t2) {
  if (!Xe(e2) || e2 === 1 / 0 || e2 === -1 / 0) return t2;
  var i2 = Math.floor(e2);
  return 0 > i2 ? t2 : i2;
}
var Vi = function(e2, t2) {
  var { debugEnabled: i2 } = void 0 === t2 ? {} : t2, r2 = { _log(t3) {
    if (pe && (n.DEBUG || ke.POSTHOG_DEBUG || i2) && !We(pe.console) && pe.console) {
      for (var r3 = ("__rrweb_original__" in pe.console[t3]) ? pe.console[t3].__rrweb_original__ : pe.console[t3], s2 = arguments.length, o2 = new Array(s2 > 1 ? s2 - 1 : 0), a2 = 1; s2 > a2; a2++) o2[a2 - 1] = arguments[a2];
      r3(e2, ...o2);
    }
  }, debug() {
    for (var e3 = arguments.length, t3 = new Array(e3), i3 = 0; e3 > i3; i3++) t3[i3] = arguments[i3];
    r2._log("debug", ...t3);
  }, info() {
    for (var e3 = arguments.length, t3 = new Array(e3), i3 = 0; e3 > i3; i3++) t3[i3] = arguments[i3];
    r2._log("log", ...t3);
  }, warn() {
    for (var e3 = arguments.length, t3 = new Array(e3), i3 = 0; e3 > i3; i3++) t3[i3] = arguments[i3];
    r2._log("warn", ...t3);
  }, error() {
    for (var e3 = arguments.length, t3 = new Array(e3), i3 = 0; e3 > i3; i3++) t3[i3] = arguments[i3];
    r2._log("error", ...t3);
  }, critical() {
    for (var t3 = arguments.length, i3 = new Array(t3), r3 = 0; t3 > r3; r3++) i3[r3] = arguments[r3];
    console.error(e2, ...i3);
  }, uninitializedWarning(e3) {
    r2.error("You must initialize PostHog before calling " + e3);
  }, createLogger: (t3, i3) => Vi(e2 + " " + t3, i3) };
  return r2;
};
var Wi = Vi("[PostHog.js]");
var Gi = Wi.createLogger;
function Yi(e2, t2) {
  Be(e2) && e2.forEach(t2);
}
function Ki(e2, t2) {
  if (!Je(e2)) if (Be(e2)) e2.forEach(t2);
  else if (et(e2)) e2.forEach(((e3, i3) => t2(e3, i3)));
  else for (var i2 in e2) qe.call(e2, i2) && t2(e2[i2], i2);
}
var Ji = function(e2) {
  for (var t2 = arguments.length, i2 = new Array(t2 > 1 ? t2 - 1 : 0), r2 = 1; t2 > r2; r2++) i2[r2 - 1] = arguments[r2];
  for (var s2 of i2) for (var n2 in s2) void 0 !== s2[n2] && (e2[n2] = s2[n2]);
  return e2;
};
function Xi(e2) {
  for (var t2 = Object.keys(e2), i2 = t2.length, r2 = new Array(i2); i2--; ) r2[i2] = [t2[i2], e2[t2[i2]]];
  return r2;
}
var Qi = function(e2) {
  try {
    return e2();
  } catch (e3) {
    return;
  }
};
var Zi = function(e2) {
  return function() {
    try {
      for (var t2 = arguments.length, i2 = new Array(t2), r2 = 0; t2 > r2; r2++) i2[r2] = arguments[r2];
      return e2.apply(this, i2);
    } catch (e3) {
      Wi.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), Wi.critical(e3);
    }
  };
};
var er = function(e2) {
  var t2 = {};
  return Ki(e2, (function(e3, i2) {
    (Ge(e3) && e3.length > 0 || Xe(e3)) && (t2[i2] = e3);
  })), t2;
};
var tr = ["herokuapp.com", "vercel.app", "netlify.app"];
function ir(e2) {
  var t2 = null == e2 ? void 0 : e2.hostname;
  if (!Ge(t2)) return false;
  var i2 = t2.split(".").slice(-2).join(".");
  for (var r2 of tr) if (i2 === r2) return false;
  return true;
}
function rr(e2, t2, i2, r2) {
  var { capture: s2 = false, passive: n2 = true } = null != r2 ? r2 : {};
  null == e2 || e2.addEventListener(t2, i2, { capture: s2, passive: n2 });
}
function sr(e2) {
  return "ph_toolbar_internal" === e2.name;
}
Math.trunc || (Math.trunc = function(e2) {
  return 0 > e2 ? Math.ceil(e2) : Math.floor(e2);
}), Number.isInteger || (Number.isInteger = function(e2) {
  return Xe(e2) && isFinite(e2) && Math.floor(e2) === e2;
});
var nr = class _nr {
  constructor(e2) {
    if (this.bytes = e2, 16 !== e2.length) throw new TypeError("not 128-bit length");
  }
  static fromFieldsV7(e2, t2, i2, r2) {
    if (!Number.isInteger(e2) || !Number.isInteger(t2) || !Number.isInteger(i2) || !Number.isInteger(r2) || 0 > e2 || 0 > t2 || 0 > i2 || 0 > r2 || e2 > 281474976710655 || t2 > 4095 || i2 > 1073741823 || r2 > 4294967295) throw new RangeError("invalid field value");
    var s2 = new Uint8Array(16);
    return s2[0] = e2 / Math.pow(2, 40), s2[1] = e2 / Math.pow(2, 32), s2[2] = e2 / Math.pow(2, 24), s2[3] = e2 / Math.pow(2, 16), s2[4] = e2 / Math.pow(2, 8), s2[5] = e2, s2[6] = 112 | t2 >>> 8, s2[7] = t2, s2[8] = 128 | i2 >>> 24, s2[9] = i2 >>> 16, s2[10] = i2 >>> 8, s2[11] = i2, s2[12] = r2 >>> 24, s2[13] = r2 >>> 16, s2[14] = r2 >>> 8, s2[15] = r2, new _nr(s2);
  }
  toString() {
    for (var e2 = "", t2 = 0; this.bytes.length > t2; t2++) e2 = e2 + (this.bytes[t2] >>> 4).toString(16) + (15 & this.bytes[t2]).toString(16), 3 !== t2 && 5 !== t2 && 7 !== t2 && 9 !== t2 || (e2 += "-");
    if (36 !== e2.length) throw new Error("Invalid UUIDv7 was generated");
    return e2;
  }
  clone() {
    return new _nr(this.bytes.slice(0));
  }
  equals(e2) {
    return 0 === this.compareTo(e2);
  }
  compareTo(e2) {
    for (var t2 = 0; 16 > t2; t2++) {
      var i2 = this.bytes[t2] - e2.bytes[t2];
      if (0 !== i2) return Math.sign(i2);
    }
    return 0;
  }
};
var or = class {
  constructor() {
    this._timestamp = 0, this._counter = 0, this._random = new ur();
  }
  generate() {
    var e2 = this.generateOrAbort();
    if (We(e2)) {
      this._timestamp = 0;
      var t2 = this.generateOrAbort();
      if (We(t2)) throw new Error("Could not generate UUID after timestamp reset");
      return t2;
    }
    return e2;
  }
  generateOrAbort() {
    var e2 = Date.now();
    if (e2 > this._timestamp) this._timestamp = e2, this._resetCounter();
    else {
      if (this._timestamp >= e2 + 1e4) return;
      this._counter++, this._counter > 4398046511103 && (this._timestamp++, this._resetCounter());
    }
    return nr.fromFieldsV7(this._timestamp, Math.trunc(this._counter / Math.pow(2, 30)), this._counter & Math.pow(2, 30) - 1, this._random.nextUint32());
  }
  _resetCounter() {
    this._counter = 1024 * this._random.nextUint32() + (1023 & this._random.nextUint32());
  }
};
var ar;
var lr = (e2) => {
  if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
  for (var t2 = 0; e2.length > t2; t2++) e2[t2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
  return e2;
};
pe && !We(pe.crypto) && crypto.getRandomValues && (lr = (e2) => crypto.getRandomValues(e2));
var ur = class {
  constructor() {
    this._buffer = new Uint32Array(8), this._cursor = 1 / 0;
  }
  nextUint32() {
    return this._buffer.length > this._cursor || (lr(this._buffer), this._cursor = 0), this._buffer[this._cursor++];
  }
};
var cr = () => dr().toString();
var dr = () => (ar || (ar = new or())).generate();
var _r = "";
var hr = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
var pr = { _is_supported: () => !!me, _error(e2) {
  Wi.error("cookieStore error: " + e2);
}, _get(e2) {
  if (me) {
    try {
      for (var t2 = e2 + "=", i2 = me.cookie.split(";").filter(((e3) => e3.length)), r2 = 0; i2.length > r2; r2++) {
        for (var s2 = i2[r2]; " " == s2.charAt(0); ) s2 = s2.substring(1, s2.length);
        if (0 === s2.indexOf(t2)) return decodeURIComponent(s2.substring(t2.length, s2.length));
      }
    } catch (e3) {
    }
    return null;
  }
}, _parse(e2) {
  var t2;
  try {
    t2 = JSON.parse(pr._get(e2)) || {};
  } catch (e3) {
  }
  return t2;
}, _set(e2, t2, i2, r2, s2) {
  if (me) try {
    var n2 = "", o2 = "", a2 = (function(e3, t3) {
      if (t3) {
        var i3 = (function(e4, t4) {
          if (void 0 === t4 && (t4 = me), _r) return _r;
          if (!t4) return "";
          if (["localhost", "127.0.0.1"].includes(e4)) return "";
          for (var i4 = e4.split("."), r4 = Math.min(i4.length, 8), s3 = "dmn_chk_" + cr(); !_r && r4--; ) {
            var n3 = i4.slice(r4).join("."), o3 = s3 + "=1;domain=." + n3 + ";path=/";
            t4.cookie = o3 + ";max-age=3", t4.cookie.includes(s3) && (t4.cookie = o3 + ";max-age=0", _r = n3);
          }
          return _r;
        })(e3);
        if (!i3) {
          var r3 = ((e4) => {
            var t4 = e4.match(hr);
            return t4 ? t4[0] : "";
          })(e3);
          r3 !== i3 && Wi.info("Warning: cookie subdomain discovery mismatch", r3, i3), i3 = r3;
        }
        return i3 ? "; domain=." + i3 : "";
      }
      return "";
    })(me.location.hostname, r2);
    if (i2) {
      var l2 = /* @__PURE__ */ new Date();
      l2.setTime(l2.getTime() + 864e5 * i2), n2 = "; expires=" + l2.toUTCString();
    }
    s2 && (o2 = "; secure");
    var u2 = e2 + "=" + encodeURIComponent(JSON.stringify(t2)) + n2 + "; SameSite=Lax; path=/" + a2 + o2;
    return u2.length > 3686.4 && Wi.warn("cookieStore warning: large cookie, len=" + u2.length), me.cookie = u2, u2;
  } catch (e3) {
    return;
  }
}, _remove(e2, t2) {
  if (null != me && me.cookie) try {
    pr._set(e2, "", -1, t2);
  } catch (e3) {
    return;
  }
} };
var gr = null;
var vr = { _is_supported() {
  if (!Ke(gr)) return gr;
  var e2 = true;
  if (We(pe)) e2 = false;
  else try {
    var t2 = "__mplssupport__";
    vr._set(t2, "xyz"), '"xyz"' !== vr._get(t2) && (e2 = false), vr._remove(t2);
  } catch (t3) {
    e2 = false;
  }
  return e2 || Wi.error("localStorage unsupported; falling back to cookie store"), gr = e2, e2;
}, _error(e2) {
  Wi.error("localStorage error: " + e2);
}, _get(e2) {
  try {
    return null == pe ? void 0 : pe.localStorage.getItem(e2);
  } catch (e3) {
    vr._error(e3);
  }
  return null;
}, _parse(e2) {
  try {
    return JSON.parse(vr._get(e2)) || {};
  } catch (e3) {
  }
  return null;
}, _set(e2, t2) {
  try {
    null == pe || pe.localStorage.setItem(e2, JSON.stringify(t2));
  } catch (e3) {
    vr._error(e3);
  }
}, _remove(e2) {
  try {
    null == pe || pe.localStorage.removeItem(e2);
  } catch (e3) {
    vr._error(e3);
  }
} };
var fr = [a, "distinct_id", x, k, J, K, j];
var mr = {};
var yr = { _is_supported: () => true, _error(e2) {
  Wi.error("memoryStorage error: " + e2);
}, _get: (e2) => mr[e2] || null, _parse: (e2) => mr[e2] || null, _set(e2, t2) {
  mr[e2] = t2;
}, _remove(e2) {
  delete mr[e2];
} };
var br = null;
var wr = { _is_supported() {
  if (!Ke(br)) return br;
  if (br = true, We(pe)) br = false;
  else try {
    var e2 = "__support__";
    wr._set(e2, "xyz"), '"xyz"' !== wr._get(e2) && (br = false), wr._remove(e2);
  } catch (e3) {
    br = false;
  }
  return br;
}, _error(e2) {
  Wi.error("sessionStorage error: ", e2);
}, _get(e2) {
  try {
    return null == pe ? void 0 : pe.sessionStorage.getItem(e2);
  } catch (e3) {
    wr._error(e3);
  }
  return null;
}, _parse(e2) {
  try {
    return JSON.parse(wr._get(e2)) || null;
  } catch (e3) {
  }
  return null;
}, _set(e2, t2) {
  try {
    null == pe || pe.sessionStorage.setItem(e2, JSON.stringify(t2));
  } catch (e3) {
    wr._error(e3);
  }
}, _remove(e2) {
  try {
    null == pe || pe.sessionStorage.removeItem(e2);
  } catch (e3) {
    wr._error(e3);
  }
} };
var Er = class {
  constructor(e2) {
    this._instance = e2;
  }
  get _config() {
    return this._instance.config;
  }
  get consent() {
    return this._getDnt() ? 0 : this._storedConsent;
  }
  isOptedOut() {
    return this._config.cookieless_mode === se || this.isRejected() || -1 === this.consent && this._config.cookieless_mode === re;
  }
  isOptedIn() {
    return !this.isOptedOut();
  }
  isExplicitlyOptedOut() {
    return 0 === this.consent;
  }
  isRejected() {
    return 0 === this.consent || -1 === this.consent && this._config.opt_out_capturing_by_default;
  }
  optInOut(e2) {
    this._storage._set(this._storageKey, e2 ? 1 : 0, this._config.cookie_expiration, this._config.cross_subdomain_cookie, this._config.secure_cookie);
  }
  reset() {
    this._storage._remove(this._storageKey, this._config.cross_subdomain_cookie);
  }
  get _storageKey() {
    var { token: e2, opt_out_capturing_cookie_prefix: t2, consent_persistence_name: i2 } = this._instance.config;
    return i2 || (t2 ? t2 + e2 : "__ph_opt_in_out_" + e2);
  }
  get _storedConsent() {
    var e2 = this._storage._get(this._storageKey);
    return ot(e2) ? 1 : Ae(at, e2) ? 0 : -1;
  }
  get _storage() {
    var e2 = this._config.opt_out_capturing_persistence_type, t2 = "localStorage" === e2 ? vr : pr;
    if (!this._persistentStore || this._persistentStore !== t2) {
      this._persistentStore = t2;
      var i2 = "localStorage" === e2 ? pr : vr;
      i2._get(this._storageKey) && (this._persistentStore._get(this._storageKey) || this.optInOut(ot(i2._get(this._storageKey))), i2._remove(this._storageKey, this._config.cross_subdomain_cookie));
    }
    return this._persistentStore;
  }
  _getDnt() {
    return !!this._config.respect_dnt && [null == fe ? void 0 : fe.doNotTrack, null == fe ? void 0 : fe.msDoNotTrack, ke.doNotTrack].some(((e2) => ot(e2)));
  }
};
var Sr = Gi("[Dead Clicks]");
var xr = () => true;
var kr = (e2) => {
  var t2, i2 = !(null == (t2 = e2.instance.persistence) || !t2.get_property(v)), r2 = e2.instance.config.capture_dead_clicks;
  return Ze(r2) ? r2 : !!je(r2) || i2;
};
var Ir = class {
  get lazyLoadedDeadClicksAutocapture() {
    return this._lazyLoadedDeadClicksAutocapture;
  }
  constructor(e2, t2, i2) {
    this.instance = e2, this.isEnabled = t2, this.onCapture = i2, this.startIfEnabledOrStop();
  }
  onRemoteConfig(e2) {
    "captureDeadClicks" in e2 && (this.instance.persistence && this.instance.persistence.register({ [v]: e2.captureDeadClicks }), this.startIfEnabledOrStop());
  }
  startIfEnabledOrStop() {
    this.isEnabled(this) ? this._loadScript((() => {
      this._start();
    })) : this.stop();
  }
  _loadScript(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.initDeadClicksAutocapture && e2(), null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this.instance, "dead-clicks-autocapture", ((t3) => {
      t3 ? Sr.error("failed to load script", t3) : e2();
    }));
  }
  _start() {
    var e2;
    if (me) {
      if (!this._lazyLoadedDeadClicksAutocapture && null != (e2 = ke.__PosthogExtensions__) && e2.initDeadClicksAutocapture) {
        var t2 = je(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
        t2.__onCapture = this.onCapture, this._lazyLoadedDeadClicksAutocapture = ke.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, t2), this._lazyLoadedDeadClicksAutocapture.start(me), Sr.info("starting...");
      }
    } else Sr.error("`document` not found. Cannot start.");
  }
  stop() {
    this._lazyLoadedDeadClicksAutocapture && (this._lazyLoadedDeadClicksAutocapture.stop(), this._lazyLoadedDeadClicksAutocapture = void 0, Sr.info("stopping..."));
  }
};
var Pr = Gi("[SegmentIntegration]");
var Cr = "posthog-js";
function Tr(e2, t2) {
  var { organization: r2, projectId: s2, prefix: n2, severityAllowList: o2 = ["error"], sendExceptionsToPostHog: a2 = true } = void 0 === t2 ? {} : t2;
  return (t3) => {
    var l2, u2, c2, d2, _2;
    if ("*" !== o2 && !o2.includes(t3.level) || !e2.__loaded) return t3;
    t3.tags || (t3.tags = {});
    var h2 = e2.requestRouter.endpointFor("ui", "/project/" + e2.config.token + "/person/" + e2.get_distinct_id());
    t3.tags["PostHog Person URL"] = h2, e2.sessionRecordingStarted() && (t3.tags["PostHog Recording URL"] = e2.get_session_replay_url({ withTimestamp: true }));
    var p2, g2 = (null == (l2 = t3.exception) ? void 0 : l2.values) || [], v2 = g2.map(((e3) => i({}, e3, { stacktrace: e3.stacktrace ? i({}, e3.stacktrace, { type: "raw", frames: (e3.stacktrace.frames || []).map(((e4) => i({}, e4, { platform: "web:javascript" }))) }) : void 0 }))), f2 = { $exception_message: (null == (u2 = g2[0]) ? void 0 : u2.value) || t3.message, $exception_type: null == (c2 = g2[0]) ? void 0 : c2.type, $exception_level: t3.level, $exception_list: v2, $sentry_event_id: t3.event_id, $sentry_exception: t3.exception, $sentry_exception_message: (null == (d2 = g2[0]) ? void 0 : d2.value) || t3.message, $sentry_exception_type: null == (_2 = g2[0]) ? void 0 : _2.type, $sentry_tags: t3.tags };
    return r2 && s2 && (f2.$sentry_url = (n2 || "https://sentry.io/organizations/") + r2 + "/issues/?project=" + s2 + "&query=" + t3.event_id), a2 && (null == (p2 = e2.exceptions) || p2.sendExceptionEvent(f2)), t3;
  };
}
var Rr = class {
  constructor(e2, t2, i2, r2, s2, n2) {
    this.name = Cr, this.setupOnce = function(o2) {
      o2(Tr(e2, { organization: t2, projectId: i2, prefix: r2, severityAllowList: s2, sendExceptionsToPostHog: null == n2 || n2 }));
    };
  }
};
var Fr = class {
  constructor(e2) {
    this._onSessionIdChange = (e3, t2, i2) => {
      i2 && (i2.noSessionId || i2.activityTimeout || i2.sessionPastMaximumLength) && (Wi.info("[PageViewManager] Session rotated, clearing pageview state", { sessionId: e3, changeReason: i2 }), this._currentPageview = void 0, this._instance.scrollManager.resetContext());
    }, this._instance = e2, this._setupSessionRotationHandler();
  }
  _setupSessionRotationHandler() {
    var e2;
    this._unsubscribeSessionId = null == (e2 = this._instance.sessionManager) ? void 0 : e2.onSessionId(this._onSessionIdChange);
  }
  destroy() {
    var e2;
    null == (e2 = this._unsubscribeSessionId) || e2.call(this), this._unsubscribeSessionId = void 0;
  }
  doPageView(e2, t2) {
    var i2, r2 = this._previousPageViewProperties(e2, t2);
    return this._currentPageview = { pathname: null !== (i2 = null == pe ? void 0 : pe.location.pathname) && void 0 !== i2 ? i2 : "", pageViewId: t2, timestamp: e2 }, this._instance.scrollManager.resetContext(), r2;
  }
  doPageLeave(e2) {
    var t2;
    return this._previousPageViewProperties(e2, null == (t2 = this._currentPageview) ? void 0 : t2.pageViewId);
  }
  doEvent() {
    var e2;
    return { $pageview_id: null == (e2 = this._currentPageview) ? void 0 : e2.pageViewId };
  }
  _previousPageViewProperties(e2, t2) {
    var i2 = this._currentPageview;
    if (!i2) return { $pageview_id: t2 };
    var r2 = { $pageview_id: t2, $prev_pageview_id: i2.pageViewId }, s2 = this._instance.scrollManager.getContext();
    if (s2 && !this._instance.config.disable_scroll_properties) {
      var { maxScrollHeight: n2, lastScrollY: o2, maxScrollY: a2, maxContentHeight: l2, lastContentY: u2, maxContentY: c2 } = s2;
      if (!(We(n2) || We(o2) || We(a2) || We(l2) || We(u2) || We(c2))) {
        n2 = Math.ceil(n2), o2 = Math.ceil(o2), a2 = Math.ceil(a2), l2 = Math.ceil(l2), u2 = Math.ceil(u2), c2 = Math.ceil(c2);
        var d2 = n2 > 1 ? lt(o2 / n2, 0, 1, Wi) : 1, _2 = n2 > 1 ? lt(a2 / n2, 0, 1, Wi) : 1, h2 = l2 > 1 ? lt(u2 / l2, 0, 1, Wi) : 1, p2 = l2 > 1 ? lt(c2 / l2, 0, 1, Wi) : 1;
        r2 = Ji(r2, { $prev_pageview_last_scroll: o2, $prev_pageview_last_scroll_percentage: d2, $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: _2, $prev_pageview_last_content: u2, $prev_pageview_last_content_percentage: h2, $prev_pageview_max_content: c2, $prev_pageview_max_content_percentage: p2 });
      }
    }
    return i2.pathname && (r2.$prev_pageview_pathname = i2.pathname), i2.timestamp && (r2.$prev_pageview_duration = (e2.getTime() - i2.timestamp.getTime()) / 1e3), r2;
  }
};
var Lr = { [o]: { exposure: "hidden" }, [l]: { exposure: "hidden" }, __cmpns: { exposure: "hidden" }, [u]: { exposure: "hidden" }, [c]: { exposure: "event" }, [d]: { exposure: "hidden" }, [_]: { exposure: "event" }, [h]: { exposure: "hidden" }, [p]: { exposure: "event" }, [g]: { exposure: "event" }, [v]: { exposure: "event" }, [f]: { exposure: "hidden" }, [m]: { exposure: "event" }, [y]: { exposure: "hidden" }, $session_recording_enabled_server_side: { exposure: "hidden" }, [x]: { exposure: "hidden" }, [k]: { exposure: "event" }, $session_past_minimum_duration: { exposure: "event" }, $session_recording_url_trigger_activated_session: { exposure: "event" }, $session_recording_event_trigger_activated_session: { exposure: "event" }, $debug_first_full_snapshot_timestamp: { exposure: "event" }, [I]: { exposure: "derived", shouldSkipFromEventProperties: (e2, t2) => t2(), transformToEventProperties(e2) {
  if (!je(e2)) return {};
  for (var t2 = {}, i2 = Object.keys(e2), r2 = 0; i2.length > r2; r2++) t2["$feature/" + i2[r2]] = e2[i2[r2]];
  return t2;
} }, [P]: { exposure: "event" }, [C]: { exposure: "hidden" }, [T]: { exposure: "hidden" }, [R]: { exposure: "event" }, [F]: { exposure: "event" }, [L]: { exposure: "event" }, [O]: { exposure: "hidden" }, [M]: { exposure: "hidden" }, [A]: { exposure: "hidden" }, [D]: { exposure: "hidden" }, [N]: { exposure: "event" }, [U]: { exposure: "hidden" }, $product_tours_activated: { exposure: "hidden" }, $conversations_widget_session_id: { exposure: "event" }, $conversations_ticket_id: { exposure: "event" }, $conversations_widget_state: { exposure: "event" }, $conversations_user_traits: { exposure: "event" }, [q]: { exposure: "hidden" }, [z]: { exposure: "hidden" }, [B]: { exposure: "hidden" }, [H]: { exposure: "hidden" }, [j]: { exposure: "hidden" }, [V]: { exposure: "hidden" }, [W]: { exposure: "hidden" }, [G]: { exposure: "hidden" }, [Y]: { exposure: "hidden" }, [K]: { exposure: "hidden" }, [J]: { exposure: "hidden" }, [b]: { exposure: "event" }, [w]: { exposure: "event" }, [E]: { exposure: "event" }, [S]: { exposure: "event" }, [Z]: { exposure: "event" }, [ee]: { exposure: "event" }, [te]: { exposure: "event" }, $sdk_debug_replay_event_trigger_status: { exposure: "event" }, $sdk_debug_replay_linked_flag_trigger_status: { exposure: "event" }, $sdk_debug_replay_matched_recording_trigger_groups: { exposure: "event" }, $sdk_debug_replay_remote_trigger_matching_config: { exposure: "event" }, $sdk_debug_replay_trigger_groups_count: { exposure: "event" }, $sdk_debug_replay_url_trigger_status: { exposure: "event" }, $session_recording_start_reason: { exposure: "event" } };
var $r = [["$posthog_sr_group_event_trigger_", { exposure: "hidden" }], ["$posthog_sr_group_url_trigger_", { exposure: "hidden" }], ["$posthog_sr_group_sampling_", { exposure: "hidden" }]];
var Or = (e2) => {
  var t2 = null == me ? void 0 : me.createElement("a");
  return We(t2) ? null : (t2.href = e2, t2);
};
var Mr = function(e2, t2) {
  for (var i2, r2 = ((e2.split("#")[0] || "").split(/\?(.*)/)[1] || "").replace(/^\?+/g, "").split("&"), s2 = 0; r2.length > s2; s2++) {
    var n2 = r2[s2].split("=");
    if (n2[0] === t2) {
      i2 = n2;
      break;
    }
  }
  if (!Be(i2) || 2 > i2.length) return "";
  var o2 = i2[1];
  try {
    o2 = decodeURIComponent(o2);
  } catch (e3) {
    Wi.error("Skipping decoding for malformed query param: " + o2);
  }
  return o2.replace(/\+/g, " ");
};
var Ar = function(e2, t2, i2) {
  if (!e2 || !t2 || !t2.length) return e2;
  for (var r2 = e2.split("#"), s2 = r2[1], n2 = (r2[0] || "").split("?"), o2 = n2[1], a2 = n2[0], l2 = (o2 || "").split("&"), u2 = [], c2 = 0; l2.length > c2; c2++) {
    var d2 = l2[c2].split("=");
    Be(d2) && (t2.includes(d2[0]) ? u2.push(d2[0] + "=" + i2) : u2.push(l2[c2]));
  }
  var _2 = a2;
  return null != o2 && (_2 += "?" + u2.join("&")), null != s2 && (_2 += "#" + s2), _2;
};
var Dr = function(e2, t2) {
  var i2 = e2.match(new RegExp(t2 + "=([^&]*)"));
  return i2 ? i2[1] : null;
};
var Nr = "https?://(.*)";
var Ur = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "irclid", "_kx"];
var qr = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid", ...Ur];
var zr = "<masked>";
var Br = ["li_fat_id"];
function Hr(e2, t2, i2) {
  if (!me) return {};
  var r2, s2 = t2 ? [...Ur, ...i2 || []] : [], n2 = jr(Ar(me.URL, s2, zr), e2), o2 = (r2 = {}, Ki(Br, (function(e3) {
    var t3 = pr._get(e3);
    r2[e3] = t3 || null;
  })), r2);
  return Ji(o2, n2);
}
function jr(e2, t2) {
  var i2 = qr.concat(t2 || []), r2 = {};
  return Ki(i2, (function(t3) {
    var i3 = Mr(e2, t3);
    r2[t3] = i3 || null;
  })), r2;
}
function Vr(e2) {
  var t2 = (function(e3) {
    return e3 ? 0 === e3.search(Nr + "google.([^/?]*)") ? "google" : 0 === e3.search(Nr + "bing.com") ? "bing" : 0 === e3.search(Nr + "yahoo.com") ? "yahoo" : 0 === e3.search(Nr + "duckduckgo.com") ? "duckduckgo" : null : null;
  })(e2), i2 = "yahoo" != t2 ? "q" : "p", r2 = {};
  if (!Ke(t2)) {
    r2.$search_engine = t2;
    var s2 = me ? Mr(me.referrer, i2) : "";
    s2.length && (r2.ph_keyword = s2);
  }
  return r2;
}
function Wr() {
  return navigator.language || navigator.userLanguage;
}
var Gr = "$direct";
function Yr() {
  return (null == me ? void 0 : me.referrer) || Gr;
}
function Kr(e2, t2) {
  var i2 = e2 ? [...Ur, ...t2 || []] : [], r2 = null == ye ? void 0 : ye.href.substring(0, 1e3);
  return { r: Yr().substring(0, 1e3), u: r2 ? Ar(r2, i2, zr) : void 0 };
}
function Jr(e2) {
  var t2, { r: i2, u: r2 } = e2, s2 = { $referrer: i2, $referring_domain: null == i2 ? void 0 : i2 == Gr ? Gr : null == (t2 = Or(i2)) ? void 0 : t2.host };
  if (r2) {
    s2.$current_url = r2;
    var n2 = Or(r2);
    s2.$host = null == n2 ? void 0 : n2.host, s2.$pathname = null == n2 ? void 0 : n2.pathname;
    var o2 = jr(r2);
    Ji(s2, o2);
  }
  if (i2) {
    var a2 = Vr(i2);
    Ji(s2, a2);
  }
  return s2;
}
function Xr() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e2) {
    return;
  }
}
function Qr() {
  try {
    return (/* @__PURE__ */ new Date()).getTimezoneOffset();
  } catch (e2) {
    return;
  }
}
var Zr = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
var es = class {
  constructor(e2, t2) {
    this._config = e2, this.props = {}, this._campaign_params_saved = false, this._name = ((e3) => {
      var t3 = "";
      return e3.token && (t3 = e3.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), e3.persistence_name ? "ph_" + e3.persistence_name : "ph_" + t3 + "_posthog";
    })(e2), this._storage = this._buildStorage(e2), this.load(), e2.debug && Wi.info("Persistence loaded", e2.persistence, i({}, this.props)), this.update_config(e2, e2, t2), this.save();
  }
  isDisabled() {
    return !!this._disabled;
  }
  _buildStorage(e2) {
    -1 === Zr.indexOf(e2.persistence.toLowerCase()) && (Wi.critical("Unknown persistence type " + e2.persistence + "; falling back to localStorage+cookie"), e2.persistence = "localStorage+cookie");
    var t2 = (function(e3) {
      void 0 === e3 && (e3 = []);
      var t3 = [...fr, ...e3];
      return i({}, vr, { _parse(e4) {
        try {
          var t4 = {};
          try {
            t4 = pr._parse(e4) || {};
          } catch (e5) {
          }
          var i2 = Ji(t4, JSON.parse(vr._get(e4) || "{}"));
          return vr._set(e4, i2), i2;
        } catch (e5) {
        }
        return null;
      }, _set(e4, i2, r3, s2, n2, o2) {
        try {
          vr._set(e4, i2, void 0, void 0, o2);
          var a2 = {};
          t3.forEach(((e5) => {
            i2[e5] && (a2[e5] = i2[e5]);
          })), Object.keys(a2).length && pr._set(e4, a2, r3, s2, n2, o2);
        } catch (e5) {
          vr._error(e5);
        }
      }, _remove(e4, t4) {
        try {
          null == pe || pe.localStorage.removeItem(e4), pr._remove(e4, t4);
        } catch (e5) {
          vr._error(e5);
        }
      } });
    })(e2.cookie_persisted_properties || []), r2 = e2.persistence.toLowerCase();
    return "localstorage" === r2 && vr._is_supported() ? vr : "localstorage+cookie" === r2 && t2._is_supported() ? t2 : "sessionstorage" === r2 && wr._is_supported() ? wr : "memory" === r2 ? yr : "cookie" === r2 ? pr : t2._is_supported() ? t2 : pr;
  }
  _isFeatureFlagCacheStale(e2) {
    var t2 = null != e2 ? e2 : this._config.feature_flag_cache_ttl_ms;
    if (!t2 || 0 >= t2) return false;
    var i2 = this.props[H];
    return !i2 || "number" != typeof i2 || Date.now() - i2 > t2;
  }
  properties() {
    var e2 = {};
    return Ki(this.props, ((t2, i2) => {
      var r2 = ((e3) => {
        var t3 = Lr[e3];
        if (t3) return t3;
        for (var [i3, r3] of $r) if (0 === e3.indexOf(i3)) return r3;
      })(i2);
      if ("derived" === (null == r2 ? void 0 : r2.exposure)) {
        if (null != r2.shouldSkipFromEventProperties && r2.shouldSkipFromEventProperties(t2, i2 === I ? () => this._isFeatureFlagCacheStale() : () => false)) return;
        r2.transformToEventProperties && Ji(e2, r2.transformToEventProperties(t2));
      } else r2 && "event" !== r2.exposure || (e2[i2] = t2);
    })), e2;
  }
  load() {
    if (!this._disabled) {
      var e2 = this._storage._parse(this._name);
      e2 && (this.props = Ji({}, e2));
    }
  }
  save() {
    this._disabled || this._storage._set(this._name, this.props, this._expire_days, this._cross_subdomain, this._secure, this._config.debug);
  }
  remove() {
    this._storage._remove(this._name, false), this._storage._remove(this._name, true);
  }
  clear() {
    this.remove(), this.props = {};
  }
  register_once(e2, t2, i2) {
    if (je(e2)) {
      We(t2) && (t2 = "None"), this._expire_days = We(i2) ? this._default_expiry : i2;
      var r2 = false;
      if (Ki(e2, ((e3, i3) => {
        this.props.hasOwnProperty(i3) && this.props[i3] !== t2 || (this._setProp(i3, e3), r2 = true);
      })), r2) return this.save(), true;
    }
    return false;
  }
  register(e2, t2) {
    if (je(e2)) {
      this._expire_days = We(t2) ? this._default_expiry : t2;
      var i2 = false;
      if (Ki(e2, ((t3, r2) => {
        e2.hasOwnProperty(r2) && this.props[r2] !== t3 && (this._setProp(r2, t3), i2 = true);
      })), i2) return this.save(), true;
    }
    return false;
  }
  unregister(e2) {
    e2 in this.props && (this._deleteProp(e2), this.save());
  }
  update_campaign_params() {
    if (!this._campaign_params_saved) {
      var e2 = Hr(this._config.custom_campaign_params, this._config.mask_personal_data_properties, this._config.custom_personal_data_properties);
      Ve(er(e2)) || this.register(e2), this._campaign_params_saved = true;
    }
  }
  update_search_keyword() {
    var e2;
    this.register((e2 = null == me ? void 0 : me.referrer) ? Vr(e2) : {});
  }
  update_referrer_info() {
    var e2;
    this.register_once({ $referrer: Yr(), $referring_domain: null != me && me.referrer && (null == (e2 = Or(me.referrer)) ? void 0 : e2.host) || Gr }, void 0);
  }
  set_initial_person_info() {
    this.props[G] || this.props[Y] || this.register_once({ [K]: Kr(this._config.mask_personal_data_properties, this._config.custom_personal_data_properties) }, void 0);
  }
  get_initial_props() {
    var e2 = {};
    Ki([Y, G], ((t3) => {
      var i3 = this.props[t3];
      i3 && Ki(i3, (function(t4, i4) {
        e2["$initial_" + Ne(i4)] = t4;
      }));
    }));
    var t2, i2, r2 = this.props[K];
    if (r2) {
      var s2 = (t2 = Jr(r2), i2 = {}, Ki(t2, (function(e3, t3) {
        i2["$initial_" + Ne(t3)] = e3;
      })), i2);
      Ji(e2, s2);
    }
    return e2;
  }
  safe_merge(e2) {
    return Ki(this.props, (function(t2, i2) {
      i2 in e2 || (e2[i2] = t2);
    })), e2;
  }
  update_config(e2, t2, i2) {
    if (this._default_expiry = this._expire_days = e2.cookie_expiration, this.set_disabled(e2.disable_persistence || !!i2), this.set_cross_subdomain(e2.cross_subdomain_cookie), this.set_secure(e2.secure_cookie), e2.persistence !== t2.persistence || !((e3, t3) => {
      if (e3.length !== t3.length) return false;
      var i3 = [...e3].sort(), r3 = [...t3].sort();
      return i3.every(((e4, t4) => e4 === r3[t4]));
    })(e2.cookie_persisted_properties || [], t2.cookie_persisted_properties || [])) {
      var r2 = this._buildStorage(e2), s2 = this.props;
      this.clear(), this._storage = r2, this.props = s2, this.save();
    }
  }
  set_disabled(e2) {
    this._disabled = e2, this._disabled ? this.remove() : this.save();
  }
  set_cross_subdomain(e2) {
    e2 !== this._cross_subdomain && (this._cross_subdomain = e2, this.remove(), this.save());
  }
  set_secure(e2) {
    e2 !== this._secure && (this._secure = e2, this.remove(), this.save());
  }
  set_event_timer(e2, t2) {
    var i2 = this.props[u] || {};
    i2[e2] = t2, this._setProp(u, i2), this.save();
  }
  remove_event_timer(e2) {
    var t2 = this.props[u] || {}, i2 = t2[e2];
    return We(i2) || (delete t2[e2], this._setProp(u, t2), this.save()), i2;
  }
  get_property(e2) {
    return this.props[e2];
  }
  set_property(e2, t2) {
    this._setProp(e2, t2), this.save();
  }
  _setProp(e2, t2) {
    this.props[e2] = t2;
  }
  _deleteProp(e2) {
    delete this.props[e2];
  }
};
var ts = { Activation: "events", Cancellation: "cancelEvents" };
var ns = { Popover: "popover", API: "api", Widget: "widget", ExternalSurvey: "external_survey" };
var us = { SHOWN: "survey shown", DISMISSED: "survey dismissed", SENT: "survey sent", ABANDONED: "survey abandoned" };
var cs = { SURVEY_ID: "$survey_id", SURVEY_NAME: "$survey_name", SURVEY_RESPONSE: "$survey_response", SURVEY_ITERATION: "$survey_iteration", SURVEY_ITERATION_START_DATE: "$survey_iteration_start_date", SURVEY_PARTIALLY_COMPLETED: "$survey_partially_completed", SURVEY_SUBMISSION_ID: "$survey_submission_id", SURVEY_QUESTIONS: "$survey_questions", SURVEY_COMPLETED: "$survey_completed", PRODUCT_TOUR_ID: "$product_tour_id", SURVEY_LAST_SEEN_DATE: "$survey_last_seen_date", SURVEY_LANGUAGE: "$survey_language" };
var ds = { Popover: "popover", Inline: "inline" };
var hs = { SHOWN: "product tour shown", DISMISSED: "product tour dismissed", COMPLETED: "product tour completed", STEP_SHOWN: "product tour step shown", STEP_COMPLETED: "product tour step completed", BUTTON_CLICKED: "product tour button clicked", STEP_SELECTOR_FAILED: "product tour step selector failed", BANNER_CONTAINER_SELECTOR_FAILED: "product tour banner container selector failed", BANNER_ACTION_CLICKED: "product tour banner action clicked" };
var ps = { TOUR_ID: "$product_tour_id", TOUR_NAME: "$product_tour_name", TOUR_ITERATION: "$product_tour_iteration", TOUR_RENDER_REASON: "$product_tour_render_reason", TOUR_STEP_ID: "$product_tour_step_id", TOUR_STEP_ORDER: "$product_tour_step_order", TOUR_STEP_TYPE: "$product_tour_step_type", TOUR_DISMISS_REASON: "$product_tour_dismiss_reason", TOUR_BUTTON_TEXT: "$product_tour_button_text", TOUR_BUTTON_ACTION: "$product_tour_button_action", TOUR_BUTTON_LINK: "$product_tour_button_link", TOUR_BUTTON_TOUR_ID: "$product_tour_button_tour_id", TOUR_STEPS_COUNT: "$product_tour_steps_count", TOUR_STEP_SELECTOR: "$product_tour_step_selector", TOUR_STEP_SELECTOR_FOUND: "$product_tour_step_selector_found", TOUR_STEP_ELEMENT_TAG: "$product_tour_step_element_tag", TOUR_STEP_ELEMENT_ID: "$product_tour_step_element_id", TOUR_STEP_ELEMENT_CLASSES: "$product_tour_step_element_classes", TOUR_STEP_ELEMENT_TEXT: "$product_tour_step_element_text", TOUR_ERROR: "$product_tour_error", TOUR_MATCHES_COUNT: "$product_tour_matches_count", TOUR_FAILURE_PHASE: "$product_tour_failure_phase", TOUR_WAITED_FOR_ELEMENT: "$product_tour_waited_for_element", TOUR_WAIT_DURATION_MS: "$product_tour_wait_duration_ms", TOUR_BANNER_SELECTOR: "$product_tour_banner_selector", TOUR_LINKED_SURVEY_ID: "$product_tour_linked_survey_id", USE_MANUAL_SELECTOR: "$use_manual_selector", INFERENCE_DATA_PRESENT: "$inference_data_present", TOUR_LAST_SEEN_DATE: "$product_tour_last_seen_date", TOUR_TYPE: "$product_tour_type" };
var gs = Gi("[RateLimiter]");
var vs = class {
  constructor(e2) {
    this.serverLimits = {}, this.lastEventRateLimited = false, this.checkForLimiting = (e3) => {
      var t2 = e3.text;
      if (t2 && t2.length) try {
        (JSON.parse(t2).quota_limited || []).forEach(((e4) => {
          gs.info((e4 || "events") + " is quota limited."), this.serverLimits[e4] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
        }));
      } catch (e4) {
        return void gs.warn('could not rate limit - continuing. Error: "' + (null == e4 ? void 0 : e4.message) + '"', { text: t2 });
      }
    }, this.instance = e2, this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
  }
  get captureEventsPerSecond() {
    var e2;
    return (null == (e2 = this.instance.config.rate_limiting) ? void 0 : e2.events_per_second) || 10;
  }
  get captureEventsBurstLimit() {
    var e2;
    return Math.max((null == (e2 = this.instance.config.rate_limiting) ? void 0 : e2.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond);
  }
  clientRateLimitContext(e2) {
    var t2, i2, r2;
    void 0 === e2 && (e2 = false);
    var { captureEventsBurstLimit: s2, captureEventsPerSecond: n2 } = this, o2 = (/* @__PURE__ */ new Date()).getTime(), a2 = null !== (t2 = null == (i2 = this.instance.persistence) ? void 0 : i2.get_property(W)) && void 0 !== t2 ? t2 : { tokens: s2, last: o2 };
    a2.tokens += (o2 - a2.last) / 1e3 * n2, a2.last = o2, a2.tokens > s2 && (a2.tokens = s2);
    var l2 = 1 > a2.tokens;
    return l2 || e2 || (a2.tokens = Math.max(0, a2.tokens - 1)), !l2 || this.lastEventRateLimited || e2 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to " + n2 + " events per second and " + s2 + " events burst limit." }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = l2, null == (r2 = this.instance.persistence) || r2.set_property(W, a2), { isRateLimited: l2, remainingTokens: a2.tokens };
  }
  isServerRateLimited(e2) {
    var t2 = this.serverLimits[e2 || "events"] || false;
    return false !== t2 && (/* @__PURE__ */ new Date()).getTime() < t2;
  }
};
var fs = Gi("[RemoteConfig]");
var ms = class {
  constructor(e2) {
    this._instance = e2;
  }
  get remoteConfig() {
    var e2;
    return null == (e2 = ke._POSTHOG_REMOTE_CONFIG) || null == (e2 = e2[this._instance.config.token]) ? void 0 : e2.config;
  }
  _loadRemoteConfigJs(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.loadExternalDependency ? null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "remote-config", (() => e2(this.remoteConfig))) : e2();
  }
  _loadRemoteConfigJSON(e2) {
    this._instance._send_request({ method: "GET", url: this._instance.requestRouter.endpointFor("assets", "/array/" + this._instance.config.token + "/config"), callback(t2) {
      e2(t2.json);
    } });
  }
  load() {
    try {
      if (this.remoteConfig) return fs.info("Using preloaded remote config", this.remoteConfig), this._onRemoteConfig(this.remoteConfig), void this._startRefreshInterval();
      if (this._instance._shouldDisableFlags()) return void fs.warn("Remote config is disabled. Falling back to local config.");
      this._loadRemoteConfigJs(((e2) => {
        if (!e2) return fs.info("No config found after loading remote JS config. Falling back to JSON."), void this._loadRemoteConfigJSON(((e3) => {
          this._onRemoteConfig(e3), this._startRefreshInterval();
        }));
        this._onRemoteConfig(e2), this._startRefreshInterval();
      }));
    } catch (e2) {
      fs.error("Error loading remote config", e2);
    }
  }
  stop() {
    this._refreshInterval && (clearInterval(this._refreshInterval), this._refreshInterval = void 0);
  }
  refresh() {
    !this._instance._shouldDisableFlags() && me && "hidden" !== me.visibilityState && this._instance.reloadFeatureFlags();
  }
  _startRefreshInterval() {
    var e2;
    if (!this._refreshInterval) {
      var t2 = null !== (e2 = this._instance.config.remote_config_refresh_interval_ms) && void 0 !== e2 ? e2 : 3e5;
      0 !== t2 && (this._refreshInterval = setInterval((() => {
        this.refresh();
      }), t2));
    }
  }
  _onRemoteConfig(e2) {
    var t2;
    e2 || fs.error("Failed to fetch remote config from PostHog."), this._instance._onRemoteConfig(null != e2 ? e2 : {}), false !== (null == e2 ? void 0 : e2.hasFeatureFlags) && (this._instance.config.advanced_disable_feature_flags_on_first_load || null == (t2 = this._instance.featureFlags) || t2.ensureFlagsLoaded());
  }
};
var bs = { GZipJS: "gzip-js", Base64: "base64" };
var ws = Uint8Array;
var Es = Uint16Array;
var Ss = Uint32Array;
var xs = new ws([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
var ks = new ws([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
var Is = new ws([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var Ps = function(e2, t2) {
  for (var i2 = new Es(31), r2 = 0; 31 > r2; ++r2) i2[r2] = t2 += 1 << e2[r2 - 1];
  var s2 = new Ss(i2[30]);
  for (r2 = 1; 30 > r2; ++r2) for (var n2 = i2[r2]; i2[r2 + 1] > n2; ++n2) s2[n2] = n2 - i2[r2] << 5 | r2;
  return [i2, s2];
};
var Cs = Ps(xs, 2);
var Ts = Cs[1];
Cs[0][28] = 258, Ts[258] = 28;
for (Rs = Ps(ks, 0)[1], Fs = new Es(32768), Ls = 0; 32768 > Ls; ++Ls) {
  $s = (43690 & Ls) >>> 1 | (21845 & Ls) << 1;
  Fs[Ls] = ((65280 & ($s = (61680 & ($s = (52428 & $s) >>> 2 | (13107 & $s) << 2)) >>> 4 | (3855 & $s) << 4)) >>> 8 | (255 & $s) << 8) >>> 1;
}
var $s;
var Rs;
var Fs;
var Ls;
var Os = function(e2, t2, i2) {
  for (var r2 = e2.length, s2 = 0, n2 = new Es(t2); r2 > s2; ++s2) ++n2[e2[s2] - 1];
  var o2, a2 = new Es(t2);
  for (s2 = 0; t2 > s2; ++s2) a2[s2] = a2[s2 - 1] + n2[s2 - 1] << 1;
  if (i2) {
    o2 = new Es(1 << t2);
    var l2 = 15 - t2;
    for (s2 = 0; r2 > s2; ++s2) if (e2[s2]) for (var u2 = s2 << 4 | e2[s2], c2 = t2 - e2[s2], d2 = a2[e2[s2] - 1]++ << c2, _2 = d2 | (1 << c2) - 1; _2 >= d2; ++d2) o2[Fs[d2] >>> l2] = u2;
  } else for (o2 = new Es(r2), s2 = 0; r2 > s2; ++s2) o2[s2] = Fs[a2[e2[s2] - 1]++] >>> 15 - e2[s2];
  return o2;
};
var Ms = new ws(288);
for (Ls = 0; 144 > Ls; ++Ls) Ms[Ls] = 8;
for (Ls = 144; 256 > Ls; ++Ls) Ms[Ls] = 9;
for (Ls = 256; 280 > Ls; ++Ls) Ms[Ls] = 7;
for (Ls = 280; 288 > Ls; ++Ls) Ms[Ls] = 8;
var As = new ws(32);
for (Ls = 0; 32 > Ls; ++Ls) As[Ls] = 5;
var Ds = Os(Ms, 9, 0);
var Ns = Os(As, 5, 0);
var Us = function(e2) {
  return (e2 / 8 >> 0) + (7 & e2 && 1);
};
var qs = function(e2, t2, i2) {
  (null == i2 || i2 > e2.length) && (i2 = e2.length);
  var r2 = new (e2 instanceof Es ? Es : e2 instanceof Ss ? Ss : ws)(i2 - t2);
  return r2.set(e2.subarray(t2, i2)), r2;
};
var zs = function(e2, t2, i2) {
  var r2 = t2 / 8 >> 0;
  e2[r2] |= i2 <<= 7 & t2, e2[r2 + 1] |= i2 >>> 8;
};
var Bs = function(e2, t2, i2) {
  var r2 = t2 / 8 >> 0;
  e2[r2] |= i2 <<= 7 & t2, e2[r2 + 1] |= i2 >>> 8, e2[r2 + 2] |= i2 >>> 16;
};
var Hs = function(e2, t2) {
  for (var i2 = [], r2 = 0; e2.length > r2; ++r2) e2[r2] && i2.push({ s: r2, f: e2[r2] });
  var s2 = i2.length, n2 = i2.slice();
  if (!s2) return [new ws(0), 0];
  if (1 == s2) {
    var o2 = new ws(i2[0].s + 1);
    return o2[i2[0].s] = 1, [o2, 1];
  }
  i2.sort((function(e3, t3) {
    return e3.f - t3.f;
  })), i2.push({ s: -1, f: 25001 });
  var a2 = i2[0], l2 = i2[1], u2 = 0, c2 = 1, d2 = 2;
  for (i2[0] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 }; c2 != s2 - 1; ) a2 = i2[i2[d2].f > i2[u2].f ? u2++ : d2++], l2 = i2[u2 != c2 && i2[d2].f > i2[u2].f ? u2++ : d2++], i2[c2++] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 };
  var _2 = n2[0].s;
  for (r2 = 1; s2 > r2; ++r2) n2[r2].s > _2 && (_2 = n2[r2].s);
  var h2 = new Es(_2 + 1), p2 = js(i2[c2 - 1], h2, 0);
  if (p2 > t2) {
    r2 = 0;
    var g2 = 0, v2 = p2 - t2, f2 = 1 << v2;
    for (n2.sort((function(e3, t3) {
      return h2[t3.s] - h2[e3.s] || e3.f - t3.f;
    })); s2 > r2; ++r2) {
      var m2 = n2[r2].s;
      if (t2 >= h2[m2]) break;
      g2 += f2 - (1 << p2 - h2[m2]), h2[m2] = t2;
    }
    for (g2 >>>= v2; g2 > 0; ) {
      var y2 = n2[r2].s;
      t2 > h2[y2] ? g2 -= 1 << t2 - h2[y2]++ - 1 : ++r2;
    }
    for (; r2 >= 0 && g2; --r2) {
      var b2 = n2[r2].s;
      h2[b2] == t2 && (--h2[b2], ++g2);
    }
    p2 = t2;
  }
  return [new ws(h2), p2];
};
var js = function(e2, t2, i2) {
  return -1 == e2.s ? Math.max(js(e2.l, t2, i2 + 1), js(e2.r, t2, i2 + 1)) : t2[e2.s] = i2;
};
var Vs = function(e2) {
  for (var t2 = e2.length; t2 && !e2[--t2]; ) ;
  for (var i2 = new Es(++t2), r2 = 0, s2 = e2[0], n2 = 1, o2 = function(e3) {
    i2[r2++] = e3;
  }, a2 = 1; t2 >= a2; ++a2) if (e2[a2] == s2 && a2 != t2) ++n2;
  else {
    if (!s2 && n2 > 2) {
      for (; n2 > 138; n2 -= 138) o2(32754);
      n2 > 2 && (o2(n2 > 10 ? n2 - 11 << 5 | 28690 : n2 - 3 << 5 | 12305), n2 = 0);
    } else if (n2 > 3) {
      for (o2(s2), --n2; n2 > 6; n2 -= 6) o2(8304);
      n2 > 2 && (o2(n2 - 3 << 5 | 8208), n2 = 0);
    }
    for (; n2--; ) o2(s2);
    n2 = 1, s2 = e2[a2];
  }
  return [i2.subarray(0, r2), t2];
};
var Ws = function(e2, t2) {
  for (var i2 = 0, r2 = 0; t2.length > r2; ++r2) i2 += e2[r2] * t2[r2];
  return i2;
};
var Gs = function(e2, t2, i2) {
  var r2 = i2.length, s2 = Us(t2 + 2);
  e2[s2] = 255 & r2, e2[s2 + 1] = r2 >>> 8, e2[s2 + 2] = 255 ^ e2[s2], e2[s2 + 3] = 255 ^ e2[s2 + 1];
  for (var n2 = 0; r2 > n2; ++n2) e2[s2 + n2 + 4] = i2[n2];
  return 8 * (s2 + 4 + r2);
};
var Ys = function(e2, t2, i2, r2, s2, n2, o2, a2, l2, u2, c2) {
  zs(t2, c2++, i2), ++s2[256];
  for (var d2 = Hs(s2, 15), _2 = d2[0], h2 = d2[1], p2 = Hs(n2, 15), g2 = p2[0], v2 = p2[1], f2 = Vs(_2), m2 = f2[0], y2 = f2[1], b2 = Vs(g2), w2 = b2[0], E2 = b2[1], S2 = new Es(19), x2 = 0; m2.length > x2; ++x2) S2[31 & m2[x2]]++;
  for (x2 = 0; w2.length > x2; ++x2) S2[31 & w2[x2]]++;
  for (var k2 = Hs(S2, 7), I2 = k2[0], P2 = k2[1], C2 = 19; C2 > 4 && !I2[Is[C2 - 1]]; --C2) ;
  var T2, R2, F2, L2, O2 = u2 + 5 << 3, M2 = Ws(s2, Ms) + Ws(n2, As) + o2, A2 = Ws(s2, _2) + Ws(n2, g2) + o2 + 14 + 3 * C2 + Ws(S2, I2) + (2 * S2[16] + 3 * S2[17] + 7 * S2[18]);
  if (M2 >= O2 && A2 >= O2) return Gs(t2, c2, e2.subarray(l2, l2 + u2));
  if (zs(t2, c2, 1 + (M2 > A2)), c2 += 2, M2 > A2) {
    T2 = Os(_2, h2, 0), R2 = _2, F2 = Os(g2, v2, 0), L2 = g2;
    var D2 = Os(I2, P2, 0);
    for (zs(t2, c2, y2 - 257), zs(t2, c2 + 5, E2 - 1), zs(t2, c2 + 10, C2 - 4), c2 += 14, x2 = 0; C2 > x2; ++x2) zs(t2, c2 + 3 * x2, I2[Is[x2]]);
    c2 += 3 * C2;
    for (var N2 = [m2, w2], U2 = 0; 2 > U2; ++U2) {
      var q2 = N2[U2];
      for (x2 = 0; q2.length > x2; ++x2) zs(t2, c2, D2[z2 = 31 & q2[x2]]), c2 += I2[z2], z2 > 15 && (zs(t2, c2, q2[x2] >>> 5 & 127), c2 += q2[x2] >>> 12);
    }
  } else T2 = Ds, R2 = Ms, F2 = Ns, L2 = As;
  for (x2 = 0; a2 > x2; ++x2) if (r2[x2] > 255) {
    var z2;
    Bs(t2, c2, T2[257 + (z2 = r2[x2] >>> 18 & 31)]), c2 += R2[z2 + 257], z2 > 7 && (zs(t2, c2, r2[x2] >>> 23 & 31), c2 += xs[z2]);
    var B2 = 31 & r2[x2];
    Bs(t2, c2, F2[B2]), c2 += L2[B2], B2 > 3 && (Bs(t2, c2, r2[x2] >>> 5 & 8191), c2 += ks[B2]);
  } else Bs(t2, c2, T2[r2[x2]]), c2 += R2[r2[x2]];
  return Bs(t2, c2, T2[256]), c2 + R2[256];
};
var Ks = new Ss([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var Js = (function() {
  for (var e2 = new Ss(256), t2 = 0; 256 > t2; ++t2) {
    for (var i2 = t2, r2 = 9; --r2; ) i2 = (1 & i2 && 3988292384) ^ i2 >>> 1;
    e2[t2] = i2;
  }
  return e2;
})();
var Xs = function(e2, t2, i2) {
  for (; i2; ++t2) e2[t2] = i2, i2 >>>= 8;
};
function Qs(e2, t2) {
  void 0 === t2 && (t2 = {});
  var i2 = /* @__PURE__ */ (function() {
    var e3 = 4294967295;
    return { p(t3) {
      for (var i3 = e3, r3 = 0; t3.length > r3; ++r3) i3 = Js[255 & i3 ^ t3[r3]] ^ i3 >>> 8;
      e3 = i3;
    }, d() {
      return 4294967295 ^ e3;
    } };
  })(), r2 = e2.length;
  i2.p(e2);
  var s2, n2, o2, a2, l2, u2 = (a2 = 10 + ((s2 = t2).filename && s2.filename.length + 1 || 0), l2 = 8, (function(e3, t3, i3, r3, s3, n3) {
    var o3 = e3.length, a3 = new ws(r3 + o3 + 5 * (1 + Math.floor(o3 / 7e3)) + s3), l3 = a3.subarray(r3, a3.length - s3), u3 = 0;
    if (!t3 || 8 > o3) for (var c3 = 0; o3 >= c3; c3 += 65535) {
      var d2 = c3 + 65535;
      o3 > d2 ? u3 = Gs(l3, u3, e3.subarray(c3, d2)) : (l3[c3] = true, u3 = Gs(l3, u3, e3.subarray(c3, o3)));
    }
    else {
      for (var _2 = Ks[t3 - 1], h2 = _2 >>> 13, p2 = 8191 & _2, g2 = (1 << i3) - 1, v2 = new Es(32768), f2 = new Es(g2 + 1), m2 = Math.ceil(i3 / 3), y2 = 2 * m2, b2 = function(t4) {
        return (e3[t4] ^ e3[t4 + 1] << m2 ^ e3[t4 + 2] << y2) & g2;
      }, w2 = new Ss(25e3), E2 = new Es(288), S2 = new Es(32), x2 = 0, k2 = 0, I2 = (c3 = 0, 0), P2 = 0, C2 = 0; o3 > c3; ++c3) {
        var T2 = b2(c3), R2 = 32767 & c3, F2 = f2[T2];
        if (v2[R2] = F2, f2[T2] = R2, c3 >= P2) {
          var L2 = o3 - c3;
          if ((x2 > 7e3 || I2 > 24576) && L2 > 423) {
            u3 = Ys(e3, l3, 0, w2, E2, S2, k2, I2, C2, c3 - C2, u3), I2 = x2 = k2 = 0, C2 = c3;
            for (var O2 = 0; 286 > O2; ++O2) E2[O2] = 0;
            for (O2 = 0; 30 > O2; ++O2) S2[O2] = 0;
          }
          var M2 = 2, A2 = 0, D2 = p2, N2 = R2 - F2 & 32767;
          if (L2 > 2 && T2 == b2(c3 - N2)) for (var U2 = Math.min(h2, L2) - 1, q2 = Math.min(32767, c3), z2 = Math.min(258, L2); q2 >= N2 && --D2 && R2 != F2; ) {
            if (e3[c3 + M2] == e3[c3 + M2 - N2]) {
              for (var B2 = 0; z2 > B2 && e3[c3 + B2] == e3[c3 + B2 - N2]; ++B2) ;
              if (B2 > M2) {
                if (M2 = B2, A2 = N2, B2 > U2) break;
                var H2 = Math.min(N2, B2 - 2), j2 = 0;
                for (O2 = 0; H2 > O2; ++O2) {
                  var V2 = c3 - N2 + O2 + 32768 & 32767, W2 = V2 - v2[V2] + 32768 & 32767;
                  W2 > j2 && (j2 = W2, F2 = V2);
                }
              }
            }
            N2 += (R2 = F2) - (F2 = v2[R2]) + 32768 & 32767;
          }
          if (A2) {
            w2[I2++] = 268435456 | Ts[M2] << 18 | Rs[A2];
            var G2 = 31 & Ts[M2], Y2 = 31 & Rs[A2];
            k2 += xs[G2] + ks[Y2], ++E2[257 + G2], ++S2[Y2], P2 = c3 + M2, ++x2;
          } else w2[I2++] = e3[c3], ++E2[e3[c3]];
        }
      }
      u3 = Ys(e3, l3, true, w2, E2, S2, k2, I2, C2, c3 - C2, u3);
    }
    return qs(a3, 0, r3 + Us(u3) + s3);
  })(n2 = e2, null == (o2 = t2).level ? 6 : o2.level, null == o2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(n2.length)))) : 12 + o2.mem, a2, l2)), c2 = u2.length;
  return (function(e3, t3) {
    var i3 = t3.filename;
    if (e3[0] = 31, e3[1] = 139, e3[2] = 8, e3[8] = 2 > t3.level ? 4 : 9 == t3.level ? 2 : 0, e3[9] = 3, 0 != t3.mtime && Xs(e3, 4, Math.floor(new Date(t3.mtime || Date.now()) / 1e3)), i3) {
      e3[3] = 8;
      for (var r3 = 0; i3.length >= r3; ++r3) e3[r3 + 10] = i3.charCodeAt(r3);
    }
  })(u2, t2), Xs(u2, c2 - 8, i2.d()), Xs(u2, c2 - 4, r2), u2;
}
var Zs = !!we || !!be;
var en = "text/plain";
var tn = false;
var rn = (e2, t2) => {
  var [i2, r2] = e2.split("#"), [s2, n2] = i2.split("?");
  if (!n2) return e2;
  var o2 = n2.split("&").filter(((e3) => e3.split("=")[0] !== t2)).join("&");
  return s2 + (o2 ? "?" + o2 : "") + (r2 ? "#" + r2 : "");
};
var sn = function(e2, t2, r2) {
  var s2;
  void 0 === r2 && (r2 = true);
  var [n2, o2] = e2.split("?"), a2 = i({}, t2), l2 = null !== (s2 = null == o2 ? void 0 : o2.split("&").map(((e3) => {
    var t3, [i2, s3] = e3.split("="), n3 = r2 && null !== (t3 = a2[i2]) && void 0 !== t3 ? t3 : s3;
    return delete a2[i2], i2 + "=" + n3;
  }))) && void 0 !== s2 ? s2 : [], u2 = (function(e3, t3) {
    var i2, r3;
    void 0 === t3 && (t3 = "&");
    var s3 = [];
    return Ki(e3, (function(e4, t4) {
      We(e4) || We(t4) || "undefined" === t4 || (i2 = encodeURIComponent(((e5) => e5 instanceof File)(e4) ? e4.name : e4.toString()), r3 = encodeURIComponent(t4), s3[s3.length] = r3 + "=" + i2);
    })), s3.join(t3);
  })(a2);
  return u2 && l2.push(u2), n2 + "?" + l2.join("&");
};
var nn = (e2, t2) => JSON.stringify(e2, ((e3, t3) => "bigint" == typeof t3 ? t3.toString() : t3), t2);
var on = (e2) => {
  if (e2._encodedBody) return e2._encodedBody;
  var { data: t2, compression: i2 } = e2;
  if (t2) {
    if (i2 === bs.GZipJS) {
      var r2 = Qs((function(e3, t3) {
        var i3 = e3.length;
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(e3);
        for (var r3 = new ws(e3.length + (e3.length >>> 1)), s3 = 0, n3 = function(e4) {
          r3[s3++] = e4;
        }, o3 = 0; i3 > o3; ++o3) {
          if (s3 + 5 > r3.length) {
            var a2 = new ws(s3 + 8 + (i3 - o3 << 1));
            a2.set(r3), r3 = a2;
          }
          var l2 = e3.charCodeAt(o3);
          128 > l2 ? n3(l2) : 2048 > l2 ? (n3(192 | l2 >>> 6), n3(128 | 63 & l2)) : l2 > 55295 && 57344 > l2 ? (n3(240 | (l2 = 65536 + (1047552 & l2) | 1023 & e3.charCodeAt(++o3)) >>> 18), n3(128 | l2 >>> 12 & 63), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2)) : (n3(224 | l2 >>> 12), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2));
        }
        return qs(r3, 0, s3);
      })(nn(t2)), { mtime: 0 });
      return { contentType: en, body: r2.buffer.slice(r2.byteOffset, r2.byteOffset + r2.byteLength), estimatedSize: r2.byteLength };
    }
    if (i2 === bs.Base64) {
      var s2 = (function(e3) {
        return e3 ? btoa(encodeURIComponent(e3).replace(/%([0-9A-F]{2})/g, ((e4, t3) => String.fromCharCode(parseInt(t3, 16))))) : e3;
      })(nn(t2)), n2 = ((e3) => "data=" + encodeURIComponent("string" == typeof e3 ? e3 : nn(e3)))(s2);
      return { contentType: "application/x-www-form-urlencoded", body: n2, estimatedSize: new Blob([n2]).size };
    }
    var o2 = nn(t2);
    return { contentType: "application/json", body: o2, estimatedSize: new Blob([o2]).size };
  }
};
var an = (e2) => {
  var t2, r2, s2, n2 = on(e2);
  return !n2 || (r2 = e2.compression, s2 = Mr(e2.url, "compression"), r2 !== Ie.GZipJS && s2 !== Ie.GZipJS && "gzip" !== s2) || ((t2 = n2.body) instanceof ArrayBuffer ? Te(new Uint8Array(t2)) : ArrayBuffer.isView(t2) && Te(new Uint8Array(t2.buffer, t2.byteOffset, t2.byteLength))) ? { url: e2.url, encodedBody: n2 } : (tn = true, { url: rn(e2.url, "compression"), encodedBody: on(i({}, e2, { compression: void 0, _encodedBody: void 0 })) });
};
var ln = (function() {
  var e2 = t((function* (e3) {
    var t2 = nn(e3.data), r2 = yield (function(e4, t3, i2) {
      return $e.apply(this, arguments);
    })(t2, n.DEBUG, { rethrow: true });
    if (!r2) return e3;
    var s2 = yield r2.arrayBuffer();
    return i({}, e3, { _encodedBody: { contentType: en, body: s2, estimatedSize: s2.byteLength } });
  }));
  return function(t2) {
    return e2.apply(this, arguments);
  };
})();
var un = (e2, t2) => sn(e2, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: n.JS_SDK_VERSION, compression: t2 });
var cn = [];
be && cn.push({ transport: "fetch", method(e2) {
  var t2, { url: r2, encodedBody: s2 } = an(e2), { contentType: n2, body: o2, estimatedSize: a2 } = null != s2 ? s2 : {}, l2 = new Headers();
  Ki(e2.headers, (function(e3, t3) {
    l2.append(t3, e3);
  })), n2 && l2.append("Content-Type", n2);
  var u2 = null;
  if (Ee) {
    var c2 = new Ee();
    u2 = { signal: c2.signal, timeout: setTimeout((() => c2.abort()), e2.timeout) };
  }
  be(r2, i({ method: (null == e2 ? void 0 : e2.method) || "GET", headers: l2, keepalive: "POST" === e2.method && 52428.8 > (a2 || 0), body: o2, signal: null == (t2 = u2) ? void 0 : t2.signal }, e2.fetchOptions)).then(((t3) => t3.text().then(((i2) => {
    var r3 = { statusCode: t3.status, text: i2 };
    if (200 === t3.status) try {
      r3.json = JSON.parse(i2);
    } catch (e3) {
      Wi.error(e3);
    }
    null == e2.callback || e2.callback(r3);
  })))).catch(((t3) => {
    Wi.error(t3), null == e2.callback || e2.callback({ statusCode: 0, error: t3 });
  })).finally((() => u2 ? clearTimeout(u2.timeout) : null));
} }), we && cn.push({ transport: "XHR", method(e2) {
  var t2 = new we(), { url: i2, encodedBody: r2 } = an(e2);
  t2.open(e2.method || "GET", i2, true);
  var { contentType: s2, body: n2 } = null != r2 ? r2 : {};
  Ki(e2.headers, (function(e3, i3) {
    t2.setRequestHeader(i3, e3);
  })), s2 && t2.setRequestHeader("Content-Type", s2), e2.timeout && (t2.timeout = e2.timeout), e2.disableXHRCredentials || (t2.withCredentials = true), t2.onreadystatechange = () => {
    if (4 === t2.readyState) {
      var i3 = { statusCode: t2.status, text: t2.responseText };
      if (200 === t2.status) try {
        i3.json = JSON.parse(t2.responseText);
      } catch (e3) {
      }
      null == e2.callback || e2.callback(i3);
    }
  }, t2.send(n2);
} }), null != fe && fe.sendBeacon && cn.push({ transport: "sendBeacon", method(e2) {
  try {
    var { url: t2, encodedBody: i2 } = an(e2), r2 = sn(t2, { beacon: "1" }), { contentType: s2, body: n2 } = null != i2 ? i2 : {};
    if (!n2) return;
    var o2 = n2 instanceof Blob ? n2 : new Blob([n2], { type: s2 });
    fe.sendBeacon(r2, o2);
  } catch (e3) {
  }
} });
var dn = 3e3;
var _n = class {
  constructor(e2, t2) {
    this._isPaused = true, this._queue = [], this._flushTimeoutMs = lt((null == t2 ? void 0 : t2.flush_interval_ms) || dn, 250, 5e3, Wi.createLogger("flush interval"), dn), this._sendRequest = e2;
  }
  enqueue(e2) {
    this._queue.push(e2), this._flushTimeout || this._setFlushTimeout();
  }
  unload() {
    this._clearFlushTimeout();
    var e2 = this._queue.length > 0 ? this._formatQueue() : {}, t2 = Object.values(e2);
    [...t2.filter(((e3) => 0 === e3.url.indexOf("/e"))), ...t2.filter(((e3) => 0 !== e3.url.indexOf("/e")))].map(((e3) => {
      this._sendRequest(i({}, e3, { transport: "sendBeacon" }));
    }));
  }
  enable() {
    this._isPaused = false, this._setFlushTimeout();
  }
  _setFlushTimeout() {
    var e2 = this;
    this._isPaused || (this._flushTimeout = setTimeout((() => {
      if (this._clearFlushTimeout(), this._queue.length > 0) {
        var t2 = this._formatQueue(), i2 = function() {
          var i3 = t2[r2], s2 = (/* @__PURE__ */ new Date()).getTime();
          i3.data && Be(i3.data) && Ki(i3.data, ((e3) => {
            e3.offset = Math.abs(e3.timestamp - s2), delete e3.timestamp;
          })), e2._sendRequest(i3);
        };
        for (var r2 in t2) i2();
      }
    }), this._flushTimeoutMs));
  }
  _clearFlushTimeout() {
    clearTimeout(this._flushTimeout), this._flushTimeout = void 0;
  }
  _formatQueue() {
    var e2 = {};
    return Ki(this._queue, ((t2) => {
      var r2, s2 = t2, n2 = (s2 ? s2.batchKey : null) || s2.url;
      We(e2[n2]) && (e2[n2] = i({}, s2, { data: [] })), null == (r2 = e2[n2].data) || r2.push(s2.data);
    })), this._queue = [], e2;
  }
};
var hn = ["retriesPerformedSoFar"];
var pn = class {
  constructor(e2) {
    this._isPolling = false, this._pollIntervalMs = 3e3, this._queue = [], this._instance = e2, this._queue = [], this._areWeOnline = true, !We(pe) && "onLine" in pe.navigator && (this._areWeOnline = pe.navigator.onLine, this._onlineListener = () => {
      this._areWeOnline = true, this._flush();
    }, this._offlineListener = () => {
      this._areWeOnline = false;
    }, rr(pe, "online", this._onlineListener), rr(pe, "offline", this._offlineListener));
  }
  get length() {
    return this._queue.length;
  }
  retriableRequest(e2) {
    var { retriesPerformedSoFar: t2 } = e2, s2 = r(e2, hn);
    Qe(t2) && (s2.url = sn(s2.url, { retry_count: t2 })), this._instance._send_request(i({}, s2, { callback: (e3) => {
      200 === e3.statusCode || e3.statusCode >= 400 && 500 > e3.statusCode || (null != t2 ? t2 : 0) >= 10 ? null == s2.callback || s2.callback(e3) : this._enqueue(i({ retriesPerformedSoFar: t2 }, s2));
    } }));
  }
  _enqueue(e2) {
    var t2 = e2.retriesPerformedSoFar || 0;
    e2.retriesPerformedSoFar = t2 + 1;
    var i2 = (function(e3) {
      var t3 = 3e3 * Math.pow(2, e3), i3 = t3 / 2, r3 = Math.min(18e5, t3), s3 = Math.random() - 0.5;
      return Math.ceil(r3 + s3 * (r3 - i3));
    })(t2), r2 = Date.now() + i2;
    this._queue.push({ retryAt: r2, requestOptions: e2 });
    var s2 = "Enqueued failed request for retry in " + i2;
    navigator.onLine || (s2 += " (Browser is offline)"), Wi.warn(s2), this._isPolling || (this._isPolling = true, this._poll());
  }
  _poll() {
    if (this._poller && clearTimeout(this._poller), 0 === this._queue.length) return this._isPolling = false, void (this._poller = void 0);
    this._poller = setTimeout((() => {
      this._areWeOnline && this._queue.length > 0 && this._flush(), this._poll();
    }), this._pollIntervalMs);
  }
  _flush() {
    var e2 = Date.now(), t2 = [], i2 = this._queue.filter(((i3) => e2 > i3.retryAt || (t2.push(i3), false)));
    if (this._queue = t2, i2.length > 0) for (var { requestOptions: r2 } of i2) this.retriableRequest(r2);
  }
  unload() {
    for (var { requestOptions: e2 } of (this._poller && (clearTimeout(this._poller), this._poller = void 0), this._isPolling = false, We(pe) || (this._onlineListener && (pe.removeEventListener("online", this._onlineListener), this._onlineListener = void 0), this._offlineListener && (pe.removeEventListener("offline", this._offlineListener), this._offlineListener = void 0)), this._queue)) try {
      this._instance._send_request(i({}, e2, { transport: "sendBeacon" }));
    } catch (e3) {
      Wi.error(e3);
    }
    this._queue = [];
  }
};
var gn = class {
  constructor(e2) {
    this._updateScrollData = () => {
      var e3, t2, i2, r2;
      this._context || (this._context = {});
      var s2 = this.scrollElement(), n2 = this.scrollY(), o2 = s2 ? Math.max(0, s2.scrollHeight - s2.clientHeight) : 0, a2 = n2 + ((null == s2 ? void 0 : s2.clientHeight) || 0), l2 = (null == s2 ? void 0 : s2.scrollHeight) || 0;
      this._context.lastScrollY = Math.ceil(n2), this._context.maxScrollY = Math.max(n2, null !== (e3 = this._context.maxScrollY) && void 0 !== e3 ? e3 : 0), this._context.maxScrollHeight = Math.max(o2, null !== (t2 = this._context.maxScrollHeight) && void 0 !== t2 ? t2 : 0), this._context.lastContentY = a2, this._context.maxContentY = Math.max(a2, null !== (i2 = this._context.maxContentY) && void 0 !== i2 ? i2 : 0), this._context.maxContentHeight = Math.max(l2, null !== (r2 = this._context.maxContentHeight) && void 0 !== r2 ? r2 : 0);
    }, this._instance = e2;
  }
  get _scrollRoot() {
    return this._instance.config.scroll_root_selector;
  }
  getContext() {
    return this._context;
  }
  resetContext() {
    var e2 = this._context;
    return setTimeout(this._updateScrollData, 0), e2;
  }
  startMeasuringScrollPosition() {
    rr(pe, "scroll", this._updateScrollData, { capture: true }), rr(pe, "scrollend", this._updateScrollData, { capture: true }), rr(pe, "resize", this._updateScrollData);
  }
  scrollElement() {
    if (!this._scrollRoot) return null == pe ? void 0 : pe.document.documentElement;
    var e2 = Be(this._scrollRoot) ? this._scrollRoot : [this._scrollRoot];
    for (var t2 of e2) {
      var i2 = null == pe ? void 0 : pe.document.querySelector(t2);
      if (i2) return i2;
    }
  }
  scrollY() {
    if (this._scrollRoot) {
      var e2 = this.scrollElement();
      return e2 && e2.scrollTop || 0;
    }
    return pe && (pe.scrollY || pe.pageYOffset || pe.document.documentElement.scrollTop) || 0;
  }
  scrollX() {
    if (this._scrollRoot) {
      var e2 = this.scrollElement();
      return e2 && e2.scrollLeft || 0;
    }
    return pe && (pe.scrollX || pe.pageXOffset || pe.document.documentElement.scrollLeft) || 0;
  }
};
var vn = (e2) => Kr(null == e2 ? void 0 : e2.config.mask_personal_data_properties, null == e2 ? void 0 : e2.config.custom_personal_data_properties);
var fn = class {
  constructor(e2, t2, i2, r2) {
    this._onSessionIdCallback = (e3) => {
      var t3 = this._getStored();
      if (!t3 || t3.sessionId !== e3) {
        var i3 = { sessionId: e3, props: this._sessionSourceParamGenerator(this._instance) };
        this._persistence.register({ [V]: i3 });
      }
    }, this._instance = e2, this._sessionIdManager = t2, this._persistence = i2, this._sessionSourceParamGenerator = r2 || vn, this._sessionIdManager.onSessionId(this._onSessionIdCallback);
  }
  _getStored() {
    return this._persistence.props[V];
  }
  getSetOnceProps() {
    var e2, t2 = null == (e2 = this._getStored()) ? void 0 : e2.props;
    return t2 ? "r" in t2 ? Jr(t2) : { $referring_domain: t2.referringDomain, $pathname: t2.initialPathName, utm_source: t2.utm_source, utm_campaign: t2.utm_campaign, utm_medium: t2.utm_medium, utm_content: t2.utm_content, utm_term: t2.utm_term } : {};
  }
  getSessionProps() {
    var e2 = {};
    return Ki(er(this.getSetOnceProps()), ((t2, i2) => {
      "$current_url" === i2 && (i2 = "url"), e2["$session_entry_" + Ne(i2)] = t2;
    })), e2;
  }
};
var mn = class {
  constructor() {
    this._events = {};
  }
  on(e2, t2) {
    return this._events[e2] || (this._events[e2] = []), this._events[e2].push(t2), () => {
      this._events[e2] = this._events[e2].filter(((e3) => e3 !== t2));
    };
  }
  emit(e2, t2) {
    for (var i2 of this._events[e2] || []) i2(t2);
    for (var r2 of this._events["*"] || []) r2(e2, t2);
  }
};
var yn = Gi("[SessionId]");
var bn = class {
  on(e2, t2) {
    return this._eventEmitter.on(e2, t2);
  }
  constructor(e2, t2, i2) {
    var r2;
    if (this._sessionIdChangedHandlers = [], this._beforeUnloadListener = void 0, this._eventEmitter = new mn(), this._sessionHasBeenIdleTooLong = (e3, t3) => !(!Qe(e3) || !Qe(t3)) && Math.abs(e3 - t3) > this.sessionTimeoutMs, !e2.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
    if (e2.config.cookieless_mode === se) throw new Error('SessionIdManager cannot be used with cookieless_mode="always"');
    this._config = e2.config, this._persistence = e2.persistence, this._windowId = void 0, this._sessionId = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this._sessionIdGenerator = t2 || cr, this._windowIdGenerator = i2 || cr;
    var s2 = this._config.persistence_name || this._config.token;
    if (this._sessionTimeoutMs = 1e3 * lt(this._config.session_idle_timeout_seconds || 1800, 60, 36e3, yn.createLogger("session_idle_timeout_seconds"), 1800), e2.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this._resetIdleTimer(), this._window_id_storage_key = "ph_" + s2 + "_window_id", this._primary_window_exists_storage_key = "ph_" + s2 + "_primary_window_exists", this._canUseSessionStorage()) {
      var n2 = wr._parse(this._window_id_storage_key), o2 = wr._parse(this._primary_window_exists_storage_key);
      n2 && !o2 ? this._windowId = n2 : wr._remove(this._window_id_storage_key), wr._set(this._primary_window_exists_storage_key, true);
    }
    if (null != (r2 = this._config.bootstrap) && r2.sessionID) try {
      var a2 = ((e3) => {
        var t3 = this._config.bootstrap.sessionID.replace(/-/g, "");
        if (32 !== t3.length) throw new Error("Not a valid UUID");
        if ("7" !== t3[12]) throw new Error("Not a UUIDv7");
        return parseInt(t3.substring(0, 12), 16);
      })();
      this._setSessionId(this._config.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), a2);
    } catch (e3) {
      yn.error("Invalid sessionID in bootstrap", e3);
    }
    this._listenToReloadWindow();
  }
  get sessionTimeoutMs() {
    return this._sessionTimeoutMs;
  }
  onSessionId(e2) {
    return We(this._sessionIdChangedHandlers) && (this._sessionIdChangedHandlers = []), this._sessionIdChangedHandlers.push(e2), this._sessionId && e2(this._sessionId, this._windowId), () => {
      this._sessionIdChangedHandlers = this._sessionIdChangedHandlers.filter(((t2) => t2 !== e2));
    };
  }
  _canUseSessionStorage() {
    return "memory" !== this._config.persistence && !this._persistence._disabled && wr._is_supported();
  }
  _setWindowId(e2) {
    e2 !== this._windowId && (this._windowId = e2, this._canUseSessionStorage() && wr._set(this._window_id_storage_key, e2));
  }
  _getWindowId() {
    return this._windowId ? this._windowId : this._canUseSessionStorage() ? wr._parse(this._window_id_storage_key) : null;
  }
  _setSessionId(e2, t2, i2) {
    e2 === this._sessionId && t2 === this._sessionActivityTimestamp && i2 === this._sessionStartTimestamp || (this._sessionStartTimestamp = i2, this._sessionActivityTimestamp = t2, this._sessionId = e2, this._persistence.register({ [x]: [t2, e2, i2] }));
  }
  _getSessionId() {
    var e2 = this._persistence.props[x];
    return Be(e2) && 2 === e2.length && e2.push(e2[0]), e2 || [0, null, 0];
  }
  resetSessionId() {
    this._setSessionId(null, null, null);
  }
  destroy() {
    clearTimeout(this._enforceIdleTimeout), this._enforceIdleTimeout = void 0, this._beforeUnloadListener && pe && (pe.removeEventListener(ue, this._beforeUnloadListener, { capture: false }), this._beforeUnloadListener = void 0), this._sessionIdChangedHandlers = [];
  }
  _listenToReloadWindow() {
    this._beforeUnloadListener = () => {
      this._canUseSessionStorage() && wr._remove(this._primary_window_exists_storage_key);
    }, rr(pe, ue, this._beforeUnloadListener, { capture: false });
  }
  checkAndGetSessionAndWindowId(e2, t2) {
    if (void 0 === e2 && (e2 = false), void 0 === t2 && (t2 = null), this._config.cookieless_mode === se) throw new Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
    var i2 = t2 || (/* @__PURE__ */ new Date()).getTime(), [r2, s2, n2] = this._getSessionId(), o2 = this._getWindowId(), a2 = Qe(n2) && Math.abs(i2 - n2) > 864e5, l2 = false, u2 = !s2, c2 = !u2 && !e2 && this._sessionHasBeenIdleTooLong(i2, r2);
    u2 || c2 || a2 ? (s2 = this._sessionIdGenerator(), o2 = this._windowIdGenerator(), yn.info("new session ID generated", { sessionId: s2, windowId: o2, changeReason: { noSessionId: u2, activityTimeout: c2, sessionPastMaximumLength: a2 } }), n2 = i2, l2 = true) : o2 || (o2 = this._windowIdGenerator(), l2 = true);
    var d2 = Qe(r2) && e2 && !a2 ? r2 : i2, _2 = Qe(n2) ? n2 : (/* @__PURE__ */ new Date()).getTime();
    return this._setWindowId(o2), this._setSessionId(s2, d2, _2), e2 || this._resetIdleTimer(), l2 && this._sessionIdChangedHandlers.forEach(((e3) => e3(s2, o2, l2 ? { noSessionId: u2, activityTimeout: c2, sessionPastMaximumLength: a2 } : void 0))), { sessionId: s2, windowId: o2, sessionStartTimestamp: _2, changeReason: l2 ? { noSessionId: u2, activityTimeout: c2, sessionPastMaximumLength: a2 } : void 0, lastActivityTimestamp: r2 };
  }
  _resetIdleTimer() {
    clearTimeout(this._enforceIdleTimeout), this._enforceIdleTimeout = setTimeout((() => {
      var [e2] = this._getSessionId();
      if (this._sessionHasBeenIdleTooLong((/* @__PURE__ */ new Date()).getTime(), e2)) {
        var t2 = this._sessionId;
        this.resetSessionId(), this._eventEmitter.emit("forcedIdleReset", { idleSessionId: t2 });
      }
    }), 1.1 * this.sessionTimeoutMs);
  }
};
var wn = function(e2, t2) {
  if (!e2) return false;
  var i2 = e2.userAgent;
  if (i2 && Me(i2, t2)) return true;
  try {
    var r2 = null == e2 ? void 0 : e2.userAgentData;
    if (null != r2 && r2.brands && r2.brands.some(((e3) => Me(null == e3 ? void 0 : e3.brand, t2)))) return true;
  } catch (e3) {
  }
  return !!e2.webdriver;
};
var En = function(e2, t2) {
  if (!(function(e3) {
    try {
      new RegExp(e3);
    } catch (e4) {
      return false;
    }
    return true;
  })(t2)) return false;
  try {
    return new RegExp(t2).test(e2);
  } catch (e3) {
    return false;
  }
};
function Sn(e2, t2, i2) {
  return nn({ distinct_id: e2, userPropertiesToSet: t2, userPropertiesToSetOnce: i2 });
}
var xn = { exact: (e2, t2) => t2.some(((t3) => e2.some(((e3) => t3 === e3)))), is_not: (e2, t2) => t2.every(((t3) => e2.every(((e3) => t3 !== e3)))), regex: (e2, t2) => t2.some(((t3) => e2.some(((e3) => En(t3, e3))))), not_regex: (e2, t2) => t2.every(((t3) => e2.every(((e3) => !En(t3, e3))))), icontains: (e2, t2) => t2.map(kn).some(((t3) => e2.map(kn).some(((e3) => t3.includes(e3))))), not_icontains: (e2, t2) => t2.map(kn).every(((t3) => e2.map(kn).every(((e3) => !t3.includes(e3))))), gt: (e2, t2) => t2.some(((t3) => {
  var i2 = parseFloat(t3);
  return !isNaN(i2) && e2.some(((e3) => i2 > parseFloat(e3)));
})), lt: (e2, t2) => t2.some(((t3) => {
  var i2 = parseFloat(t3);
  return !isNaN(i2) && e2.some(((e3) => i2 < parseFloat(e3)));
})) };
var kn = (e2) => e2.toLowerCase();
function In(e2, t2) {
  return !e2 || Object.entries(e2).every(((e3) => {
    var [i2, r2] = e3, s2 = null == t2 ? void 0 : t2[i2];
    if (We(s2) || Ke(s2)) return false;
    var n2 = [String(s2)], o2 = xn[r2.operator];
    return !!o2 && o2(r2.values, n2);
  }));
}
var Pn = "custom";
var Cn = "i.posthog.com";
var Tn = /^\/static\//;
var Rn = class {
  constructor(e2) {
    this._regionCache = {}, this.instance = e2;
  }
  get apiHost() {
    var e2 = this.instance.config.api_host.trim().replace(/\/$/, "");
    return "https://app.posthog.com" === e2 ? "https://us.i.posthog.com" : e2;
  }
  get flagsApiHost() {
    var e2 = this.instance.config.flags_api_host;
    return e2 ? e2.trim().replace(/\/$/, "") : this.apiHost;
  }
  get uiHost() {
    var e2, t2 = null == (e2 = this.instance.config.ui_host) ? void 0 : e2.replace(/\/$/, "");
    return t2 || (t2 = this.apiHost.replace("." + Cn, ".posthog.com")), "https://app.posthog.com" === t2 ? "https://us.posthog.com" : t2;
  }
  get region() {
    return this._regionCache[this.apiHost] || (this._regionCache[this.apiHost] = /https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "us" : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "eu" : Pn), this._regionCache[this.apiHost];
  }
  _staticAssetHostOverride(e2) {
    var t2 = this.instance.config.__preview_external_dependency_versioned_paths;
    if ("string" == typeof t2 && Tn.test(e2)) return t2.trim().replace(/\/$/, "") || void 0;
  }
  endpointFor(e2, t2) {
    if (void 0 === t2 && (t2 = ""), t2 && (t2 = "/" === t2[0] ? t2 : "/" + t2), "ui" === e2) return this.uiHost + t2;
    if ("flags" === e2) return this.flagsApiHost + t2;
    if ("assets" === e2) {
      var i2 = this._staticAssetHostOverride(t2);
      if (i2) return "" + i2 + t2;
    }
    if (this.region === Pn) return this.apiHost + t2;
    var r2 = Cn + t2;
    switch (e2) {
      case "assets":
        return "https://" + this.region + "-assets." + r2;
      case "api":
        return "https://" + this.region + "." + r2;
    }
  }
};
var Fn = Gi("[Surveys]");
var Ln = "seenSurvey_";
var $n = [ns.Popover, ns.Widget, ns.API];
var On = { ignoreConditions: false, ignoreDelay: false, displayType: ds.Popover };
var Mn = Gi("[PostHog ExternalIntegrations]");
var An = { intercom: "intercom-integration", crispChat: "crisp-chat-integration" };
var Dn = class {
  constructor(e2) {
    this._instance = e2;
  }
  _loadScript(e2, t2) {
    var i2;
    null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, e2, ((e3) => {
      if (e3) return Mn.error("failed to load script", e3);
      t2();
    }));
  }
  startIfEnabledOrStop() {
    var e2 = this, t2 = function(t3) {
      var i3, s3, n2;
      !r2 || null != (i3 = ke.__PosthogExtensions__) && null != (i3 = i3.integrations) && i3[t3] || e2._loadScript(An[t3], (() => {
        var i4;
        null == (i4 = ke.__PosthogExtensions__) || null == (i4 = i4.integrations) || null == (i4 = i4[t3]) || i4.start(e2._instance);
      })), !r2 && null != (s3 = ke.__PosthogExtensions__) && null != (s3 = s3.integrations) && s3[t3] && (null == (n2 = ke.__PosthogExtensions__) || null == (n2 = n2.integrations) || null == (n2 = n2[t3]) || n2.stop());
    };
    for (var [i2, r2] of Object.entries(null !== (s2 = this._instance.config.integrations) && void 0 !== s2 ? s2 : {})) {
      var s2;
      t2(i2);
    }
  }
};
var Nn;
var Un = {};
var qn = 0;
var zn = () => {
};
var Bn = 'Consent opt in/out is not valid with cookieless_mode="always" and will be ignored';
var Hn = "Surveys module not available";
var jn = "sanitize_properties is deprecated. Use before_send instead";
var Vn = "Invalid value for property_denylist config: ";
var Wn = "posthog";
var Gn = !Zs && -1 === (null == xe ? void 0 : xe.indexOf("MSIE")) && -1 === (null == xe ? void 0 : xe.indexOf("Mozilla"));
var Yn = (e2) => {
  var t2;
  return i({ api_host: "https://us.i.posthog.com", flags_api_host: null, ui_host: null, token: "", autocapture: true, cross_subdomain_cookie: ir(null == me ? void 0 : me.location), persistence: "localStorage+cookie", persistence_name: "", cookie_persisted_properties: [], loaded: zn, save_campaign_params: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageleave: "if_capture_pageview", defaults: null != e2 ? e2 : "unset", __preview_deferred_init_extensions: false, __preview_external_dependency_versioned_paths: false, debug: ye && Ge(null == ye ? void 0 : ye.search) && -1 !== ye.search.indexOf("__posthog_debug=true") || false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, disable_surveys_automatic_display: false, disable_conversations: false, disable_product_tours: false, disable_external_dependency_loading: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == pe || null == (t2 = pe.location) ? void 0 : t2.protocol), ip: false, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", consent_persistence_name: null, opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, request_batching: true, properties_string_max_length: 65535, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_flags: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_only_evaluate_survey_feature_flags: false, advanced_feature_flags_dedup_per_session: false, advanced_enable_surveys: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, surveys_request_timeout_ms: 1e4, on_request_error(e3) {
    Wi.error("Bad HTTP status: " + e3.statusCode + " " + e3.text);
  }, get_device_id: (e3) => e3, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: ae, before_send: void 0, request_queue_config: { flush_interval_ms: dn }, error_tracking: {}, _onCapture: zn, __preview_eager_load_replay: false }, ((e3) => ({ rageclick: !e3 || "2025-11-30" > e3 || { content_ignorelist: true }, capture_pageview: !e3 || "2025-05-24" > e3 || "history_change", session_recording: e3 && e3 >= "2025-11-30" ? { strictMinimumDuration: true } : {}, external_scripts_inject_target: e3 && e3 >= "2026-01-30" ? "head" : "body", internal_or_test_user_hostname: e3 && e3 >= "2026-01-30" ? /^(localhost|127\.0\.0\.1)$/ : void 0 }))(e2));
};
var Kn = [["process_person", "person_profiles"], ["xhr_headers", "request_headers"], ["cookie_name", "persistence_name"], ["disable_cookie", "disable_persistence"], ["store_google", "save_campaign_params"], ["verbose", "debug"]];
var Jn = (e2) => {
  var t2 = {};
  for (var [i2, r2] of Kn) We(e2[i2]) || (t2[r2] = e2[i2]);
  var s2 = Ji({}, t2, e2);
  return Be(e2.property_blacklist) && (We(e2.property_denylist) ? s2.property_denylist = e2.property_blacklist : Be(e2.property_denylist) ? s2.property_denylist = [...e2.property_blacklist, ...e2.property_denylist] : Wi.error(Vn + e2.property_denylist)), s2;
};
var Xn = class {
  constructor() {
    this.__forceAllowLocalhost = false;
  }
  get _forceAllowLocalhost() {
    return this.__forceAllowLocalhost;
  }
  set _forceAllowLocalhost(e2) {
    Wi.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = e2;
  }
};
var Qn = class _Qn {
  _replaceExtension(e2, t2) {
    if (e2) {
      var i2 = this._extensions.indexOf(e2);
      -1 !== i2 && this._extensions.splice(i2, 1);
    }
    return this._extensions.push(t2), null == t2.initialize || t2.initialize(), t2;
  }
  _inCookielessMode() {
    return this.config.cookieless_mode === se || this.config.cookieless_mode === re && this.consent.isRejected();
  }
  get decideEndpointWasHit() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this.featureFlags) ? void 0 : t2.hasLoadedFlags) && void 0 !== e2 && e2;
  }
  get flagsEndpointWasHit() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this.featureFlags) ? void 0 : t2.hasLoadedFlags) && void 0 !== e2 && e2;
  }
  constructor() {
    var e2;
    this.webPerformance = new Xn(), this._personProcessingSetOncePropertiesSent = false, this.version = n.LIB_VERSION, this._internalEventEmitter = new mn(), this._extensions = [], this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = Yn(), this.SentryIntegration = Rr, this.sentryIntegration = (e3) => (function(e4, t3) {
      var i2 = Tr(e4, t3);
      return { name: Cr, processEvent: (e5) => i2(e5) };
    })(this, e3), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this._initialPageviewCaptured = false, this._visibilityStateListener = null, this._initialPersonProfilesConfig = null, this._cachedPersonProperties = null, this.scrollManager = new gn(this), this.pageViewManager = new Fr(this), this.rateLimiter = new vs(this), this.requestRouter = new Rn(this), this.consent = new Er(this), this.externalIntegrations = new Dn(this);
    var t2 = null !== (e2 = _Qn.__defaultExtensionClasses) && void 0 !== e2 ? e2 : {};
    this.featureFlags = t2.featureFlags && new t2.featureFlags(this), this.toolbar = t2.toolbar && new t2.toolbar(this), this.surveys = t2.surveys && new t2.surveys(this), this.conversations = t2.conversations && new t2.conversations(this), this.logs = t2.logs && new t2.logs(this), this.experiments = t2.experiments && new t2.experiments(this), this.exceptions = t2.exceptions && new t2.exceptions(this), this.people = { set: (e3, t3, i2) => {
      var r2 = Ge(e3) ? { [e3]: t3 } : e3;
      this.setPersonProperties(r2), null == i2 || i2({});
    }, set_once: (e3, t3, i2) => {
      var r2 = Ge(e3) ? { [e3]: t3 } : e3;
      this.setPersonProperties(void 0, r2), null == i2 || i2({});
    } }, this.on("eventCaptured", ((e3) => Wi.info('send "' + (null == e3 ? void 0 : e3.event) + '"', e3)));
  }
  init(e2, t2, i2) {
    if (i2 && i2 !== Wn) {
      var r2, s2 = null !== (r2 = Un[i2]) && void 0 !== r2 ? r2 : new _Qn();
      return s2._init(e2, t2, i2), Un[i2] = s2, Un[Wn][i2] = s2, s2;
    }
    return this._init(e2, t2, i2);
  }
  _init(e2, t2, r2) {
    var s2, o2;
    if (void 0 === t2 && (t2 = {}), We(e2) || Ye(e2)) return Wi.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
    if (this.__loaded) return console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
    this.__loaded = true, this.config = {}, t2.debug = this._checkLocalStorageForDebug(t2.debug), this._originalUserConfig = t2, this._triggered_notifs = [], t2.person_profiles ? this._initialPersonProfilesConfig = t2.person_profiles : t2.process_person && (this._initialPersonProfilesConfig = t2.process_person), this.set_config(Ji({}, Yn(t2.defaults), Jn(t2), { name: r2, token: e2 })), this.config.on_xhr_error && Wi.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = t2.disable_compression ? void 0 : bs.GZipJS;
    var a2 = this._is_persistence_disabled();
    this.persistence = new es(this.config, a2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new es(i({}, this.config, { persistence: "sessionStorage" }), a2);
    var l2 = i({}, this.persistence.props), u2 = i({}, this.sessionPersistence.props);
    this.register({ $initialization_time: (/* @__PURE__ */ new Date()).toISOString() }), this._requestQueue = new _n(((e3) => this._send_retriable_request(e3)), this.config.request_queue_config), this._retryQueue = new pn(this), this.__request_queue = [];
    var c2 = this._inCookielessMode();
    if (c2 || (this.sessionManager = new bn(this), this.sessionPropsManager = new fn(this, this.sessionManager, this.persistence)), this.config.__preview_deferred_init_extensions ? (Wi.info("Deferring extension initialization to improve startup performance"), setTimeout((() => {
      this._initExtensions(c2);
    }), 0)) : (Wi.info("Initializing extensions synchronously"), this._initExtensions(c2)), n.DEBUG = n.DEBUG || this.config.debug, n.DEBUG && Wi.info("Starting in debug mode", { this: this, config: t2, thisC: i({}, this.config), p: l2, s: u2 }), !this.config.identity_distinct_id || null != (s2 = t2.bootstrap) && s2.distinctID || (t2.bootstrap = i({}, t2.bootstrap, { distinctID: this.config.identity_distinct_id, isIdentifiedID: true })), void 0 !== (null == (o2 = t2.bootstrap) ? void 0 : o2.distinctID)) {
      var d2 = t2.bootstrap.distinctID, _2 = this.get_distinct_id(), h2 = this.persistence.get_property(j);
      if (t2.bootstrap.isIdentifiedID && null != _2 && _2 !== d2 && h2 === ne) this.identify(d2);
      else if (t2.bootstrap.isIdentifiedID && null != _2 && _2 !== d2 && h2 === oe) Wi.warn("Bootstrap distinctID differs from an already-identified user. The existing identity is preserved. Call reset() before reinitializing if you intend to switch users.");
      else {
        var p2 = this.config.get_device_id(cr()), g2 = t2.bootstrap.isIdentifiedID ? p2 : d2;
        this.persistence.set_property(j, t2.bootstrap.isIdentifiedID ? oe : ne), this.register({ distinct_id: d2, $device_id: g2 });
      }
    }
    if (c2) this.register_once({ distinct_id: Q, $device_id: null }, "");
    else if (!this.get_distinct_id()) {
      var v2 = this.config.get_device_id(cr());
      this.register_once({ distinct_id: v2, $device_id: v2 }, ""), this.persistence.set_property(j, ne);
    }
    return rr(pe, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), { passive: false }), t2.segment ? (function(e3, t3) {
      var i2 = e3.config.segment;
      if (!i2) return t3();
      !(function(e4, t4) {
        var i3 = e4.config.segment;
        if (!i3) return t4();
        var r3 = (i4) => {
          var r4 = () => i4.anonymousId() || cr();
          e4.config.get_device_id = r4, i4.id() && (e4.register({ distinct_id: i4.id(), $device_id: r4() }), e4.persistence.set_property(j, oe)), t4();
        }, s3 = i3.user();
        "then" in s3 && He(s3.then) ? s3.then(r3) : r3(s3);
      })(e3, (() => {
        i2.register(((e4) => {
          Promise && Promise.resolve || Pr.warn("This browser does not have Promise support, and can not use the segment integration");
          var t4 = (t5, i3) => {
            if (!i3) return t5;
            t5.event.userId || t5.event.anonymousId === e4.get_distinct_id() || (Pr.info("No userId set, resetting PostHog"), e4.reset()), t5.event.userId && t5.event.userId !== e4.get_distinct_id() && (Pr.info("UserId set, identifying with PostHog"), e4.identify(t5.event.userId));
            var r3 = e4.calculateEventProperties(i3, t5.event.properties);
            return t5.event.properties = Object.assign({}, r3, t5.event.properties), t5;
          };
          return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (e5) => t4(e5, e5.event.event), page: (e5) => t4(e5, ce), identify: (e5) => t4(e5, _e), screen: (e5) => t4(e5, "$screen") };
        })(e3)).then((() => {
          t3();
        }));
      }));
    })(this, (() => this._loaded())) : this._loaded(), He(this.config._onCapture) && this.config._onCapture !== zn && (Wi.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", ((e3) => this.config._onCapture(e3.event, e3)))), this.config.ip && Wi.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this;
  }
  _initExtensions(e2) {
    var t2, r2, s2, n2, o2, a2, l2, u2 = performance.now(), c2 = i({}, _Qn.__defaultExtensionClasses, this.config.__extensionClasses), d2 = [];
    c2.featureFlags && this._extensions.push(this.featureFlags = null !== (t2 = this.featureFlags) && void 0 !== t2 ? t2 : new c2.featureFlags(this)), c2.exceptions && this._extensions.push(this.exceptions = null !== (r2 = this.exceptions) && void 0 !== r2 ? r2 : new c2.exceptions(this)), c2.historyAutocapture && this._extensions.push(this.historyAutocapture = new c2.historyAutocapture(this)), c2.tracingHeaders && this._extensions.push(new c2.tracingHeaders(this)), c2.siteApps && this._extensions.push(this.siteApps = new c2.siteApps(this)), c2.sessionRecording && !e2 && this._extensions.push(this.sessionRecording = new c2.sessionRecording(this)), this.config.disable_scroll_properties || d2.push((() => {
      this.scrollManager.startMeasuringScrollPosition();
    })), c2.autocapture && this._extensions.push(this.autocapture = new c2.autocapture(this)), c2.surveys && this._extensions.push(this.surveys = null !== (s2 = this.surveys) && void 0 !== s2 ? s2 : new c2.surveys(this)), c2.logs && this._extensions.push(this.logs = null !== (n2 = this.logs) && void 0 !== n2 ? n2 : new c2.logs(this)), c2.conversations && this._extensions.push(this.conversations = null !== (o2 = this.conversations) && void 0 !== o2 ? o2 : new c2.conversations(this)), c2.productTours && this._extensions.push(this.productTours = new c2.productTours(this)), c2.heatmaps && this._extensions.push(this.heatmaps = new c2.heatmaps(this)), c2.webVitalsAutocapture && this._extensions.push(this.webVitalsAutocapture = new c2.webVitalsAutocapture(this)), c2.exceptionObserver && this._extensions.push(this.exceptionObserver = new c2.exceptionObserver(this)), c2.deadClicksAutocapture && this._extensions.push(this.deadClicksAutocapture = new c2.deadClicksAutocapture(this, kr)), c2.toolbar && this._extensions.push(this.toolbar = null !== (a2 = this.toolbar) && void 0 !== a2 ? a2 : new c2.toolbar(this)), c2.experiments && this._extensions.push(this.experiments = null !== (l2 = this.experiments) && void 0 !== l2 ? l2 : new c2.experiments(this)), this._extensions.forEach(((e3) => {
      e3.initialize && d2.push((() => {
        null == e3.initialize || e3.initialize();
      }));
    })), d2.push((() => {
      if (this._pendingRemoteConfig) {
        var e3 = this._pendingRemoteConfig;
        this._pendingRemoteConfig = void 0, this._onRemoteConfig(e3);
      }
    })), this._processInitTaskQueue(d2, u2);
  }
  _processInitTaskQueue(e2, t2) {
    for (; e2.length > 0; ) {
      if (this.config.__preview_deferred_init_extensions && performance.now() - t2 >= 30 && e2.length > 0) return void setTimeout((() => {
        this._processInitTaskQueue(e2, t2);
      }), 0);
      var i2 = e2.shift();
      if (i2) try {
        i2();
      } catch (e3) {
        Wi.error("Error initializing extension:", e3);
      }
    }
    var r2 = Math.round(performance.now() - t2);
    this.register_for_session({ [Z]: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous", [ee]: r2 }), this.config.__preview_deferred_init_extensions && Wi.info("PostHog extensions initialized (" + r2 + "ms)");
  }
  _onRemoteConfig(e2) {
    var t2;
    if (!me || !me.body) return Wi.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout((() => {
      this._onRemoteConfig(e2);
    }), 500);
    this.config.__preview_deferred_init_extensions && (this._pendingRemoteConfig = e2), this._lastRemoteConfig = e2, this.compression = void 0, e2.supportedCompression && !this.config.disable_compression && (this.compression = Ae(e2.supportedCompression, bs.GZipJS) ? bs.GZipJS : Ae(e2.supportedCompression, bs.Base64) ? bs.Base64 : void 0), null != (t2 = e2.analytics) && t2.endpoint && (this.analyticsDefaultEndpoint = e2.analytics.endpoint), this.set_config({ person_profiles: this._initialPersonProfilesConfig ? this._initialPersonProfilesConfig : ae }), this._extensions.forEach(((t3) => null == t3.onRemoteConfig ? void 0 : t3.onRemoteConfig(e2)));
  }
  _loaded() {
    try {
      this.config.loaded(this);
    } catch (e3) {
      Wi.critical("`loaded` function failed", e3);
    }
    if (this._start_queue_if_opted_in(), this.config.internal_or_test_user_hostname && null != ye && ye.hostname) {
      var e2 = ye.hostname, t2 = this.config.internal_or_test_user_hostname;
      ("string" == typeof t2 ? e2 === t2 : t2.test(e2)) && this.setInternalOrTestUser();
    }
    this.config.capture_pageview && setTimeout((() => {
      (this.consent.isOptedIn() || this._inCookielessMode()) && this._captureInitialPageview();
    }), 1), this._remoteConfigLoader = new ms(this), this._remoteConfigLoader.load();
  }
  _start_queue_if_opted_in() {
    var e2;
    this.is_capturing() && this.config.request_batching && (null == (e2 = this._requestQueue) || e2.enable());
  }
  _dom_loaded() {
    this.is_capturing() && Yi(this.__request_queue, ((e2) => this._send_retriable_request(e2))), this.__request_queue = [], this._start_queue_if_opted_in();
  }
  _handle_unload() {
    var e2, t2, i2, r2;
    null == (e2 = this.surveys) || e2.handlePageUnload(), this.config.request_batching ? (this._shouldCapturePageleave() && this.capture(de), null == (t2 = this.logs) || t2.flushLogs("sendBeacon"), null == (i2 = this._requestQueue) || i2.unload(), null == (r2 = this._retryQueue) || r2.unload()) : this._shouldCapturePageleave() && this.capture(de, null, { transport: "sendBeacon" });
  }
  _send_request(e2) {
    this.__loaded && (Gn ? this.__request_queue.push(e2) : this.rateLimiter.isServerRateLimited(e2.batchKey) || (e2.transport = e2.transport || this.config.api_transport, e2.url = sn(e2.url, { ip: this.config.ip ? 1 : 0 }), e2.headers = i({}, this.config.request_headers, e2.headers), e2.compression = "best-available" === e2.compression ? this.compression : e2.compression, e2.disableXHRCredentials = this.config.__preview_disable_xhr_credentials, this.config.__preview_disable_beacon && (e2.disableTransport = ["sendBeacon"]), e2.fetchOptions = e2.fetchOptions || this.config.fetch_options, ((e3) => {
      var t2, r2, s2, n2 = i({}, e3);
      n2.timeout = n2.timeout || 6e4, n2.url = un(n2.url, n2.compression);
      var o2 = null !== (t2 = n2.transport) && void 0 !== t2 ? t2 : "fetch", a2 = cn.filter(((e4) => !n2.disableTransport || !e4.transport || !n2.disableTransport.includes(e4.transport))), l2 = null !== (r2 = null == (s2 = (function(e4, t3) {
        for (var i2 = 0; e4.length > i2; i2++) if (e4[i2].transport === o2) return e4[i2];
      })(a2)) ? void 0 : s2.method) && void 0 !== r2 ? r2 : a2[0].method;
      if (!l2) throw new Error("No available transport method");
      "sendBeacon" !== o2 && n2.data && n2.compression === bs.GZipJS && Se && !tn ? ln(n2).then(((e4) => {
        l2(e4);
      })).catch(((t3) => {
        if (Re(t3)) return tn = true, void l2(i({}, n2, { compression: void 0, url: un(e3.url, void 0) }));
        ((e4) => {
          if (!e4 || "object" != typeof e4) return false;
          var t4 = "name" in e4 ? String(e4.name) : "";
          return Re(e4) || t4 === Ce;
        })(t3) && (tn = true), l2(n2);
      })) : l2(n2);
    })(i({}, e2, { callback: (t2) => {
      var i2, r2;
      this.rateLimiter.checkForLimiting(t2), 400 > t2.statusCode || null == (i2 = (r2 = this.config).on_request_error) || i2.call(r2, t2), null == e2.callback || e2.callback(t2);
    } }))));
  }
  _send_retriable_request(e2) {
    this._retryQueue ? this._retryQueue.retriableRequest(e2) : this._send_request(e2);
  }
  _execute_array(e2) {
    qn++;
    try {
      var t2, i2 = [], r2 = [], s2 = [];
      Yi(e2, ((e3) => {
        if (e3) if (Be(t2 = e3[0])) s2.push(e3);
        else if (He(e3)) try {
          e3.call(this);
        } catch (t3) {
          Wi.error("Error executing queued PostHog call", e3, t3);
        }
        else Be(e3) && "alias" === t2 ? i2.push(e3) : Be(e3) && -1 !== t2.indexOf("capture") && He(this[t2]) ? s2.push(e3) : r2.push(e3);
      }));
      var n2 = function(e3, t3) {
        Yi(e3, (function(e4) {
          try {
            if (Be(e4[0])) {
              var i3 = t3;
              Ki(e4, (function(e5) {
                i3 = i3[e5[0]].apply(i3, e5.slice(1));
              }));
            } else t3[e4[0]].apply(t3, e4.slice(1));
          } catch (t4) {
            Wi.error("Error executing queued PostHog call", e4, t4);
          }
        }));
      };
      n2(i2, this), n2(r2, this), n2(s2, this);
    } finally {
      qn--;
    }
  }
  push(e2) {
    if (qn > 0 && Be(e2) && Ge(e2[0])) {
      var t2 = _Qn.prototype[e2[0]];
      He(t2) && t2.apply(this, e2.slice(1));
    } else this._execute_array([e2]);
  }
  capture(e2, t2, r2) {
    var s2, n2, o2, a2, l2;
    if (this.__loaded && this.persistence && this.sessionPersistence && this._requestQueue) {
      if (this.is_capturing()) if (!We(e2) && Ge(e2)) {
        var u2 = !this.config.opt_out_useragent_filter && this._is_bot();
        if (!u2 || this.config.__preview_capture_bot_pageviews) {
          var c2 = null != r2 && r2.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
          if (null == c2 || !c2.isRateLimited) {
            null != t2 && t2.$current_url && !Ge(null == t2 ? void 0 : t2.$current_url) && (Wi.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == t2 || delete t2.$current_url), "$exception" !== e2 || null != r2 && r2._originatedFromCaptureException || Wi.warn("Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically."), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
            var d2 = /* @__PURE__ */ new Date(), _2 = (null == r2 ? void 0 : r2.timestamp) || d2, h2 = (null == r2 ? void 0 : r2.uuid) || cr(), p2 = { uuid: h2, event: e2, properties: this.calculateEventProperties(e2, t2 || {}, _2, h2) };
            e2 === ce && this.config.__preview_capture_bot_pageviews && u2 && (p2.event = "$bot_pageview", p2.properties.$browser_type = "bot"), c2 && (p2.properties.$lib_rate_limit_remaining_tokens = c2.remainingTokens), (null == r2 ? void 0 : r2.$set) && (p2.$set = null == r2 ? void 0 : r2.$set);
            var g2, v2, f2, m2 = this._calculate_set_once_properties(null == r2 ? void 0 : r2.$set_once, e2 !== he, e2 === _e);
            if (m2 && (p2.$set_once = m2), null != r2 && r2._noTruncate || (n2 = this.config.properties_string_max_length, o2 = p2, a2 = (e3) => Ge(e3) ? e3.slice(0, n2) : e3, l2 = /* @__PURE__ */ new Set(), p2 = (function e3(t3, i2) {
              return t3 !== Object(t3) ? a2 ? a2(t3) : t3 : l2.has(t3) ? void 0 : (l2.add(t3), Be(t3) ? (r3 = [], Yi(t3, ((t4) => {
                r3.push(e3(t4));
              }))) : (r3 = {}, Ki(t3, ((t4, i3) => {
                l2.has(t4) || (r3[i3] = e3(t4, i3));
              }))), r3);
              var r3;
            })(o2)), p2.timestamp = _2, We(null == r2 ? void 0 : r2.timestamp) || (p2.properties.$event_time_override_provided = true, p2.properties.$event_time_override_system_time = d2), e2 === us.DISMISSED || e2 === us.SENT) {
              var y2 = null == t2 ? void 0 : t2[cs.SURVEY_ID], b2 = null == t2 ? void 0 : t2[cs.SURVEY_ITERATION];
              ((e3) => {
                try {
                  var t3 = ((e4) => ((e5, t4) => {
                    var i2 = "" + Ln + t4.id;
                    return t4.current_iteration && t4.current_iteration > 0 && (i2 = "" + Ln + t4.id + "_" + t4.current_iteration), i2;
                  })(0, e4))(e3);
                  if (localStorage.getItem(t3)) return;
                  localStorage.setItem(t3, "true");
                } catch (e4) {
                  Fn.error("Failed to persist survey seen state", e4);
                }
              })({ id: y2, current_iteration: b2 }), p2.$set = i({}, p2.$set, { [(g2 = { id: y2, current_iteration: b2 }, v2 = e2 === us.SENT ? "responded" : "dismissed", f2 = "$survey_" + v2 + "/" + g2.id, g2.current_iteration && g2.current_iteration > 0 && (f2 = "$survey_" + v2 + "/" + g2.id + "/" + g2.current_iteration), f2)]: true });
            } else e2 === us.SHOWN && (p2.$set = i({}, p2.$set, { [cs.SURVEY_LAST_SEEN_DATE]: (/* @__PURE__ */ new Date()).toISOString() }));
            if (e2 === hs.SHOWN) {
              var w2 = null == t2 ? void 0 : t2[ps.TOUR_TYPE];
              w2 && (p2.$set = i({}, p2.$set, { [ps.TOUR_LAST_SEEN_DATE + "/" + w2]: (/* @__PURE__ */ new Date()).toISOString() }));
            }
            var E2 = i({}, p2.properties.$set, p2.$set);
            if (Ve(E2) || this.setPersonPropertiesForFlags(E2), !Je(this.config.before_send)) {
              var S2 = this._runBeforeSend(p2);
              if (!S2) return;
              p2 = S2;
            }
            this._internalEventEmitter.emit("eventCaptured", p2);
            var x2 = { method: "POST", url: null !== (s2 = null == r2 ? void 0 : r2._url) && void 0 !== s2 ? s2 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: p2, compression: "best-available", batchKey: null == r2 ? void 0 : r2._batchKey, transport: null == r2 ? void 0 : r2.transport };
            return !this.config.request_batching || r2 && (null == r2 || !r2._batchKey) || null != r2 && r2.send_instantly ? this._send_retriable_request(x2) : this._requestQueue.enqueue(x2), p2;
          }
          Wi.critical("This capture call is ignored due to client rate limiting.");
        }
      } else Wi.error("No event name provided to posthog.capture");
    } else Wi.uninitializedWarning("posthog.capture");
  }
  _addCaptureHook(e2) {
    return this.on("eventCaptured", ((t2) => e2(t2.event, t2)));
  }
  calculateEventProperties(e2, t2, r2, s2, o2) {
    if (r2 = r2 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return t2;
    var a2 = o2 ? void 0 : this.persistence.remove_event_timer(e2), l2 = i({}, t2);
    if (l2.token = this.config.token, l2.$config_defaults = this.config.defaults, this._inCookielessMode() && (l2.$cookieless_mode = true), "$snapshot" === e2) {
      var u2 = i({}, this.persistence.properties(), this.sessionPersistence.properties());
      return l2.distinct_id = u2.distinct_id, (!Ge(l2.distinct_id) && !Xe(l2.distinct_id) || Ye(l2.distinct_id)) && Wi.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), l2;
    }
    var c2, d2 = (function(e3, t3) {
      var i2, r3, s3, o3;
      if (!xe) return {};
      var a3, l3, u3, c3, d3, _3, h3, p3, g3 = e3 ? [...Ur, ...t3 || []] : [], [v3, f3] = (function(e4) {
        for (var t4 = 0; ai.length > t4; t4++) {
          var [i3, r4] = ai[t4], s4 = i3.exec(e4), n2 = s4 && (He(r4) ? r4(s4, e4) : r4);
          if (n2) return n2;
        }
        return ["", ""];
      })(xe);
      return Ji(er({ $os: v3, $os_version: f3, $browser: si(xe, navigator.vendor), $device: li(xe), $device_type: (l3 = xe, u3 = { userAgentDataPlatform: null == (i2 = navigator) || null == (i2 = i2.userAgentData) ? void 0 : i2.platform, maxTouchPoints: null == (r3 = navigator) ? void 0 : r3.maxTouchPoints, screenWidth: null == pe || null == (s3 = pe.screen) ? void 0 : s3.width, screenHeight: null == pe || null == (o3 = pe.screen) ? void 0 : o3.height, devicePixelRatio: null == pe ? void 0 : pe.devicePixelRatio }, p3 = li(l3), p3 === mt || p3 === ft || "Kobo" === p3 || "Kindle Fire" === p3 || p3 === Yt ? vt : p3 === Dt || p3 === Ut || p3 === Nt || p3 === Vt ? "Console" : p3 === bt ? "Wearable" : p3 ? ht : "Android" === (null == u3 ? void 0 : u3.userAgentDataPlatform) && (null !== (c3 = null == u3 ? void 0 : u3.maxTouchPoints) && void 0 !== c3 ? c3 : 0) > 0 ? 600 > Math.min(null !== (d3 = null == u3 ? void 0 : u3.screenWidth) && void 0 !== d3 ? d3 : 0, null !== (_3 = null == u3 ? void 0 : u3.screenHeight) && void 0 !== _3 ? _3 : 0) / (null !== (h3 = null == u3 ? void 0 : u3.devicePixelRatio) && void 0 !== h3 ? h3 : 1) ? ht : vt : "Desktop"), $timezone: Xr(), $timezone_offset: Qr() }), { $current_url: Ar(null == ye ? void 0 : ye.href, g3, zr), $host: null == ye ? void 0 : ye.host, $pathname: null == ye ? void 0 : ye.pathname, $raw_user_agent: xe.length > 1e3 ? xe.substring(0, 997) + "..." : xe, $browser_version: oi(xe, navigator.vendor), $browser_language: Wr(), $browser_language_prefix: (a3 = Wr(), "string" == typeof a3 ? a3.split("-")[0] : void 0), $screen_height: null == pe ? void 0 : pe.screen.height, $screen_width: null == pe ? void 0 : pe.screen.width, $viewport_height: null == pe ? void 0 : pe.innerHeight, $viewport_width: null == pe ? void 0 : pe.innerWidth, $lib: n.LIB_NAME, $lib_version: n.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
    })(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties);
    if (this.sessionManager) {
      var { sessionId: _2, windowId: h2 } = this.sessionManager.checkAndGetSessionAndWindowId(o2, r2.getTime());
      l2.$session_id = _2, l2.$window_id = h2;
    }
    this.sessionPropsManager && Ji(l2, this.sessionPropsManager.getSessionProps());
    try {
      var p2;
      this.sessionRecording && Ji(l2, this.sessionRecording.sdkDebugProperties), l2.$sdk_debug_retry_queue_size = null == (p2 = this._retryQueue) ? void 0 : p2.length;
    } catch (e3) {
      l2.$sdk_debug_error_capturing_properties = String(e3);
    }
    if (this.requestRouter.region === Pn && (l2.$lib_custom_api_host = this.config.api_host), c2 = e2 !== ce || o2 ? e2 !== de || o2 ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(r2) : this.pageViewManager.doPageView(r2, s2), l2 = Ji(l2, c2), e2 === ce && me && (l2.title = me.title), !We(a2)) {
      var g2 = r2.getTime() - a2;
      l2.$duration = parseFloat((g2 / 1e3).toFixed(3));
    }
    xe && this.config.opt_out_useragent_filter && (l2.$browser_type = this._is_bot() ? "bot" : "browser"), (l2 = Ji({}, d2, this.persistence.properties(), this.sessionPersistence.properties(), l2)).$is_identified = this._isIdentified(), Be(this.config.property_denylist) ? Ki(this.config.property_denylist, (function(e3) {
      delete l2[e3];
    })) : Wi.error(Vn + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
    var v2 = this.config.sanitize_properties;
    v2 && (Wi.error(jn), l2 = v2(l2, e2));
    var f2 = this._hasPersonProcessing();
    return l2.$process_person_profile = f2, f2 && !o2 && this._requirePersonProcessing("_calculate_event_properties"), l2;
  }
  _calculate_set_once_properties(e2, t2, i2) {
    var r2;
    if (void 0 === t2 && (t2 = true), void 0 === i2 && (i2 = false), !this.persistence || !this._hasPersonProcessing()) return e2;
    if (this._personProcessingSetOncePropertiesSent && !i2) return e2;
    var s2 = this.persistence.get_initial_props(), n2 = null == (r2 = this.sessionPropsManager) ? void 0 : r2.getSetOnceProps(), o2 = Ji({}, s2, n2 || {}, e2 || {}), a2 = this.config.sanitize_properties;
    return a2 && (Wi.error(jn), o2 = a2(o2, "$set_once")), t2 && (this._personProcessingSetOncePropertiesSent = true), Ve(o2) ? void 0 : o2;
  }
  register(e2, t2) {
    var i2;
    null == (i2 = this.persistence) || i2.register(e2, t2);
  }
  register_once(e2, t2, i2) {
    var r2;
    null == (r2 = this.persistence) || r2.register_once(e2, t2, i2);
  }
  register_for_session(e2) {
    var t2;
    null == (t2 = this.sessionPersistence) || t2.register(e2);
  }
  unregister(e2) {
    var t2;
    null == (t2 = this.persistence) || t2.unregister(e2);
  }
  unregister_for_session(e2) {
    var t2;
    null == (t2 = this.sessionPersistence) || t2.unregister(e2);
  }
  _register_single(e2, t2) {
    this.register({ [e2]: t2 });
  }
  getFeatureFlag(e2, t2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.getFeatureFlag(e2, t2);
  }
  getFeatureFlagPayload(e2) {
    var t2;
    return null == (t2 = this.featureFlags) ? void 0 : t2.getFeatureFlagPayload(e2);
  }
  getFeatureFlagResult(e2, t2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.getFeatureFlagResult(e2, t2);
  }
  isFeatureEnabled(e2, t2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.isFeatureEnabled(e2, t2);
  }
  reloadFeatureFlags() {
    var e2;
    null == (e2 = this.featureFlags) || e2.reloadFeatureFlags();
  }
  updateFlags(e2, t2, i2) {
    var r2;
    null == (r2 = this.featureFlags) || r2.updateFlags(e2, t2, i2);
  }
  updateEarlyAccessFeatureEnrollment(e2, t2, i2) {
    var r2;
    null == (r2 = this.featureFlags) || r2.updateEarlyAccessFeatureEnrollment(e2, t2, i2);
  }
  getEarlyAccessFeatures(e2, t2, i2) {
    var r2;
    return void 0 === t2 && (t2 = false), null == (r2 = this.featureFlags) ? void 0 : r2.getEarlyAccessFeatures(e2, t2, i2);
  }
  on(e2, t2) {
    return this._internalEventEmitter.on(e2, t2);
  }
  onFeatureFlags(e2) {
    return this.featureFlags ? this.featureFlags.onFeatureFlags(e2) : (e2([], {}, { errorsLoading: true }), () => {
    });
  }
  onSurveysLoaded(e2) {
    return this.surveys ? this.surveys.onSurveysLoaded(e2) : (e2([], { isLoaded: false, error: Hn }), () => {
    });
  }
  onSessionId(e2) {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.sessionManager) ? void 0 : i2.onSessionId(e2)) && void 0 !== t2 ? t2 : () => {
    };
  }
  getSurveys(e2, t2) {
    void 0 === t2 && (t2 = false), this.surveys ? this.surveys.getSurveys(e2, t2) : e2([], { isLoaded: false, error: Hn });
  }
  getActiveMatchingSurveys(e2, t2) {
    void 0 === t2 && (t2 = false), this.surveys ? this.surveys.getActiveMatchingSurveys(e2, t2) : e2([], { isLoaded: false, error: Hn });
  }
  renderSurvey(e2, t2) {
    var i2;
    null == (i2 = this.surveys) || i2.renderSurvey(e2, t2);
  }
  displaySurvey(e2, t2) {
    var i2;
    void 0 === t2 && (t2 = On), null == (i2 = this.surveys) || i2.displaySurvey(e2, t2);
  }
  cancelPendingSurvey(e2) {
    var t2;
    null == (t2 = this.surveys) || t2.cancelPendingSurvey(e2);
  }
  canRenderSurvey(e2) {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.surveys) ? void 0 : i2.canRenderSurvey(e2)) && void 0 !== t2 ? t2 : { visible: false, disabledReason: Hn };
  }
  canRenderSurveyAsync(e2, t2) {
    var i2, r2;
    return void 0 === t2 && (t2 = false), null !== (i2 = null == (r2 = this.surveys) ? void 0 : r2.canRenderSurveyAsync(e2, t2)) && void 0 !== i2 ? i2 : Promise.resolve({ visible: false, disabledReason: Hn });
  }
  _validateIdentifyId(e2) {
    return !e2 || Ye(e2) ? (Wi.critical("Unique user id has not been set in posthog.identify"), false) : e2 === Q ? (Wi.critical('The string "' + e2 + '" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.'), false) : !["distinct_id", "distinctid"].includes(e2.toLowerCase()) && !["undefined", "null"].includes(e2.toLowerCase()) || (Wi.critical('The string "' + e2 + '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.'), false);
  }
  identify(e2, t2, i2) {
    if (!this.__loaded || !this.persistence) return Wi.uninitializedWarning("posthog.identify");
    if (Xe(e2) && (e2 = e2.toString(), Wi.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), this._validateIdentifyId(e2) && this._requirePersonProcessing("posthog.identify")) {
      var r2 = this.get_distinct_id();
      this.register({ $user_id: e2 }), this.get_property(a) || this.register_once({ $had_persisted_distinct_id: true, $device_id: r2 }, ""), e2 !== r2 && e2 !== this.get_property(l) && (this.unregister(l), this.register({ distinct_id: e2 }));
      var s2, n2 = (this.persistence.get_property(j) || ne) === ne;
      e2 !== r2 && n2 ? (this.persistence.set_property(j, oe), this.setPersonPropertiesForFlags({ $set: t2 || {}, $set_once: i2 || {} }, false), this.capture(_e, { distinct_id: e2, $anon_distinct_id: r2 }, { $set: t2 || {}, $set_once: i2 || {} }), this._cachedPersonProperties = Sn(e2, t2, i2), null == (s2 = this.featureFlags) || s2.setAnonymousDistinctId(r2)) : (t2 || i2) && this.setPersonProperties(t2, i2), e2 !== r2 && (this.reloadFeatureFlags(), this.unregister(q));
    }
  }
  setPersonProperties(e2, t2) {
    if ((e2 || t2) && this._requirePersonProcessing("posthog.setPersonProperties")) {
      var i2 = Sn(this.get_distinct_id(), e2, t2);
      this._cachedPersonProperties !== i2 ? (this.setPersonPropertiesForFlags({ $set: e2 || {}, $set_once: t2 || {} }, true), this.capture("$set", { $set: e2 || {}, $set_once: t2 || {} }), this._cachedPersonProperties = i2) : Wi.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.");
    }
  }
  group(e2, t2, r2) {
    if (e2 && t2) {
      var s2 = this.getGroups(), n2 = s2[e2] !== t2;
      if (n2 && this.resetGroupPropertiesForFlags(e2), this.register({ $groups: i({}, s2, { [e2]: t2 }) }), n2 || r2) {
        var o2 = { $group_type: e2, $group_key: t2 };
        r2 && (o2.$group_set = r2), this.capture(he, o2);
      }
      r2 && this.setGroupPropertiesForFlags({ [e2]: r2 }), n2 && !r2 && this.reloadFeatureFlags();
    } else Wi.error("posthog.group requires a group type and group key");
  }
  resetGroups() {
    this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
  }
  setPersonPropertiesForFlags(e2, t2) {
    var i2;
    void 0 === t2 && (t2 = true), null == (i2 = this.featureFlags) || i2.setPersonPropertiesForFlags(e2, t2);
  }
  resetPersonPropertiesForFlags() {
    var e2;
    null == (e2 = this.featureFlags) || e2.resetPersonPropertiesForFlags();
  }
  setGroupPropertiesForFlags(e2, t2) {
    var i2;
    void 0 === t2 && (t2 = true), this._requirePersonProcessing("posthog.setGroupPropertiesForFlags") && (null == (i2 = this.featureFlags) || i2.setGroupPropertiesForFlags(e2, t2));
  }
  resetGroupPropertiesForFlags(e2) {
    var t2;
    null == (t2 = this.featureFlags) || t2.resetGroupPropertiesForFlags(e2);
  }
  reset(e2) {
    var t2, i2, r2, s2, n2, o2, l2, u2;
    if (Wi.info("reset"), !this.__loaded) return Wi.uninitializedWarning("posthog.reset");
    var c2, d2 = this.get_property(a), _2 = this.get_property(y);
    if (this.consent.reset(), null == (t2 = this.persistence) || t2.clear(), null == (i2 = this.sessionPersistence) || i2.clear(), We(_2) || null == (c2 = this.persistence) || c2.register({ [y]: _2 }), null == (r2 = this.surveys) || r2.reset(), null == (s2 = this._remoteConfigLoader) || s2.stop(), null == (n2 = this.featureFlags) || n2.reset(), null == (o2 = this.conversations) || o2.reset(), null == (l2 = this.persistence) || l2.set_property(j, ne), null == (u2 = this.sessionManager) || u2.resetSessionId(), this._cachedPersonProperties = null, this.config.cookieless_mode === se) this.register_once({ distinct_id: Q, $device_id: null }, "");
    else {
      var h2 = this.config.get_device_id(cr());
      this.register_once({ distinct_id: h2, $device_id: e2 ? h2 : d2 }, "");
    }
    this.register({ $last_posthog_reset: (/* @__PURE__ */ new Date()).toISOString() }, 1), delete this.config.identity_distinct_id, delete this.config.identity_hash, this.reloadFeatureFlags();
  }
  setIdentity(e2, t2) {
    var i2;
    this.config.identity_distinct_id = e2, this.config.identity_hash = t2, this.alias(e2), null == (i2 = this.conversations) || i2._onIdentityChanged();
  }
  clearIdentity() {
    var e2;
    delete this.config.identity_distinct_id, delete this.config.identity_hash, null == (e2 = this.conversations) || e2._onIdentityCleared();
  }
  get_distinct_id() {
    return this.get_property("distinct_id");
  }
  getGroups() {
    return this.get_property("$groups") || {};
  }
  get_session_id() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this.sessionManager) ? void 0 : t2.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== e2 ? e2 : "";
  }
  get_session_replay_url(e2) {
    if (!this.sessionManager) return "";
    var { sessionId: t2, sessionStartTimestamp: i2 } = this.sessionManager.checkAndGetSessionAndWindowId(true), r2 = this.requestRouter.endpointFor("ui", "/project/" + this.config.token + "/replay/" + t2);
    if (null != e2 && e2.withTimestamp && i2) {
      var s2, n2 = null !== (s2 = e2.timestampLookBack) && void 0 !== s2 ? s2 : 10;
      if (!i2) return r2;
      r2 += "?t=" + Math.max(Math.floor(((/* @__PURE__ */ new Date()).getTime() - i2) / 1e3) - n2, 0);
    }
    return r2;
  }
  alias(e2, t2) {
    return e2 === this.get_property(o) ? (Wi.critical("Attempting to create alias for existing People user - aborting."), -2) : this._requirePersonProcessing("posthog.alias") ? (We(t2) && (t2 = this.get_distinct_id()), e2 !== t2 ? (this._register_single(l, e2), this.capture("$create_alias", { alias: e2, distinct_id: t2 })) : (Wi.warn("alias matches current distinct_id - skipping api call."), this.identify(e2), -1)) : void 0;
  }
  set_config(e2) {
    var t2 = i({}, this.config);
    if (je(e2)) {
      var r2, s2, o2, a2, l2, u2, c2, d2, _2, h2;
      Ji(this.config, Jn(e2));
      var p2 = this._is_persistence_disabled();
      null == (r2 = this.persistence) || r2.update_config(this.config, t2, p2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new es(i({}, this.config, { persistence: "sessionStorage" }), p2);
      var g2 = this._checkLocalStorageForDebug(this.config.debug);
      Ze(g2) && (this.config.debug = g2), Ze(this.config.debug) && (this.config.debug ? (n.DEBUG = true, vr._is_supported() && vr._set("ph_debug", true), Wi.info("set_config", { config: e2, oldConfig: t2, newConfig: i({}, this.config) })) : (n.DEBUG = false, vr._is_supported() && vr._remove("ph_debug"))), null == (s2 = this.exceptionObserver) || s2.onConfigChange(), null == (o2 = this.exceptions) || o2.onConfigChange(), null == (a2 = this.sessionRecording) || a2.startIfEnabledOrStop(), null == (l2 = this.autocapture) || l2.startIfEnabled(), null == (u2 = this.heatmaps) || u2.startIfEnabled(), null == (c2 = this.exceptionObserver) || c2.startIfEnabledOrStop(), null == (d2 = this.deadClicksAutocapture) || d2.startIfEnabledOrStop(), null == (_2 = this.surveys) || _2.loadIfEnabled(), this._sync_opt_out_with_persistence(), null == (h2 = this.externalIntegrations) || h2.startIfEnabledOrStop();
    }
  }
  _overrideSDKInfo(e2, t2) {
    n.LIB_NAME = e2, n.LIB_VERSION = t2;
  }
  startSessionRecording(e2) {
    var t2, i2, r2, s2, n2, o2 = true === e2, a2 = { sampling: o2 || !(null == e2 || !e2.sampling), linked_flag: o2 || !(null == e2 || !e2.linked_flag), url_trigger: o2 || !(null == e2 || !e2.url_trigger), event_trigger: o2 || !(null == e2 || !e2.event_trigger) };
    Object.values(a2).some(Boolean) && (null == (t2 = this.sessionManager) || t2.checkAndGetSessionAndWindowId(), a2.sampling && (null == (i2 = this.sessionRecording) || i2.overrideSampling()), a2.linked_flag && (null == (r2 = this.sessionRecording) || r2.overrideLinkedFlag()), a2.url_trigger && (null == (s2 = this.sessionRecording) || s2.overrideTrigger("url")), a2.event_trigger && (null == (n2 = this.sessionRecording) || n2.overrideTrigger("event")));
    this.set_config({ disable_session_recording: false });
  }
  stopSessionRecording() {
    this.set_config({ disable_session_recording: true });
  }
  sessionRecordingStarted() {
    var e2;
    return !(null == (e2 = this.sessionRecording) || !e2.started);
  }
  captureException(e2, t2) {
    if (this.exceptions) {
      var r2 = new Error("PostHog syntheticException"), s2 = this.exceptions.buildProperties(e2, { handled: true, syntheticException: r2 });
      return this.exceptions.sendExceptionEvent(i({}, s2, t2));
    }
  }
  addExceptionStep(e2, t2) {
    var i2;
    null == (i2 = this.exceptions) || i2.addExceptionStep(e2, t2);
  }
  captureLog(e2) {
    var t2;
    null == (t2 = this.logs) || t2.captureLog(e2);
  }
  get logger() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this.logs) ? void 0 : t2.logger) && void 0 !== e2 ? e2 : _Qn._noopLogger;
  }
  startExceptionAutocapture(e2) {
    this.set_config({ capture_exceptions: null == e2 || e2 });
  }
  stopExceptionAutocapture() {
    this.set_config({ capture_exceptions: false });
  }
  loadToolbar(e2) {
    var t2, i2;
    return null !== (t2 = null == (i2 = this.toolbar) ? void 0 : i2.loadToolbar(e2)) && void 0 !== t2 && t2;
  }
  get_property(e2) {
    var t2;
    return null == (t2 = this.persistence) ? void 0 : t2.props[e2];
  }
  getSessionProperty(e2) {
    var t2;
    return null == (t2 = this.sessionPersistence) ? void 0 : t2.props[e2];
  }
  toString() {
    var e2, t2 = null !== (e2 = this.config.name) && void 0 !== e2 ? e2 : Wn;
    return t2 !== Wn && (t2 = Wn + "." + t2), t2;
  }
  _isIdentified() {
    var e2, t2;
    return (null == (e2 = this.persistence) ? void 0 : e2.get_property(j)) === oe || (null == (t2 = this.sessionPersistence) ? void 0 : t2.get_property(j)) === oe;
  }
  _hasPersonProcessing() {
    var e2, t2;
    return !("never" === this.config.person_profiles || this.config.person_profiles === ae && !this._isIdentified() && Ve(this.getGroups()) && (null == (e2 = this.persistence) || null == (e2 = e2.props) || !e2[l]) && (null == (t2 = this.persistence) || null == (t2 = t2.props) || !t2[J]));
  }
  _shouldCapturePageleave() {
    return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && (true === this.config.capture_pageview || "history_change" === this.config.capture_pageview);
  }
  createPersonProfile() {
    this._hasPersonProcessing() || this._requirePersonProcessing("posthog.createPersonProfile") && this.setPersonProperties({}, {});
  }
  setInternalOrTestUser() {
    this._requirePersonProcessing("posthog.setInternalOrTestUser") && this.setPersonProperties({ $internal_or_test_user: true });
  }
  _requirePersonProcessing(e2) {
    return "never" === this.config.person_profiles ? (Wi.error(e2 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this._register_single(J, true), true);
  }
  _is_persistence_disabled() {
    if ("always" === this.config.cookieless_mode) return true;
    var e2 = this.consent.isOptedOut();
    return this.config.disable_persistence || e2 && !(!this.config.opt_out_persistence_by_default && this.config.cookieless_mode !== re);
  }
  _sync_opt_out_with_persistence() {
    var e2, t2, i2, r2, s2 = this._is_persistence_disabled();
    return (null == (e2 = this.persistence) ? void 0 : e2._disabled) !== s2 && (null == (i2 = this.persistence) || i2.set_disabled(s2)), (null == (t2 = this.sessionPersistence) ? void 0 : t2._disabled) !== s2 && (null == (r2 = this.sessionPersistence) || r2.set_disabled(s2)), s2;
  }
  opt_in_capturing(e2) {
    var t2;
    if (this.config.cookieless_mode !== se) {
      if (this._inCookielessMode()) {
        var i2, r2, s2, n2, o2;
        this.reset(true), null == (i2 = this.sessionManager) || i2.destroy(), null == (r2 = this.pageViewManager) || r2.destroy(), this.sessionManager = new bn(this), this.pageViewManager = new Fr(this), this.persistence && (this.sessionPropsManager = new fn(this, this.sessionManager, this.persistence));
        var a2, l2 = null !== (s2 = null == (n2 = this.config.__extensionClasses) ? void 0 : n2.sessionRecording) && void 0 !== s2 ? s2 : null == (o2 = _Qn.__defaultExtensionClasses) ? void 0 : o2.sessionRecording;
        l2 && (this.sessionRecording = this._replaceExtension(this.sessionRecording, new l2(this)), this._lastRemoteConfig && (null == (a2 = this.sessionRecording) || null == a2.onRemoteConfig || a2.onRemoteConfig(this._lastRemoteConfig)));
      }
      var u2, c2;
      this.consent.optInOut(true), this._sync_opt_out_with_persistence(), this._start_queue_if_opted_in(), null == (t2 = this.sessionRecording) || t2.startIfEnabledOrStop(), this.config.cookieless_mode == re && (null == (u2 = this.surveys) || u2.loadIfEnabled()), (We(null == e2 ? void 0 : e2.captureEventName) || null != e2 && e2.captureEventName) && this.capture(null !== (c2 = null == e2 ? void 0 : e2.captureEventName) && void 0 !== c2 ? c2 : "$opt_in", null == e2 ? void 0 : e2.captureProperties, { send_instantly: true }), this.config.capture_pageview && this._captureInitialPageview();
    } else Wi.warn(Bn);
  }
  opt_out_capturing() {
    var e2, t2, i2;
    this.config.cookieless_mode !== se ? (this.config.cookieless_mode === re && this.consent.isOptedIn() && this.reset(true), this.consent.optInOut(false), this._sync_opt_out_with_persistence(), this.config.cookieless_mode === re && (this.register({ distinct_id: Q, $device_id: null }), null == (e2 = this.sessionRecording) || e2.stopRecording(), this.sessionRecording = void 0, null == (t2 = this.sessionManager) || t2.destroy(), null == (i2 = this.pageViewManager) || i2.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, this._captureInitialPageview())) : Wi.warn(Bn);
  }
  has_opted_in_capturing() {
    return this.consent.isOptedIn();
  }
  has_opted_out_capturing() {
    return this.consent.isOptedOut();
  }
  get_explicit_consent_status() {
    var e2 = this.consent.consent;
    return 1 === e2 ? "granted" : 0 === e2 ? "denied" : "pending";
  }
  is_capturing() {
    return this.config.cookieless_mode === se || (this.config.cookieless_mode === re ? this.consent.isRejected() || this.consent.isOptedIn() : !this.has_opted_out_capturing());
  }
  clear_opt_in_out_capturing() {
    this.consent.reset(), this._sync_opt_out_with_persistence();
  }
  _is_bot() {
    return fe ? wn(fe, this.config.custom_blocked_useragents) : void 0;
  }
  _captureInitialPageview() {
    me && ("visible" === me.visibilityState ? this._initialPageviewCaptured || (this._initialPageviewCaptured = true, this.capture(ce, { title: me.title }, { send_instantly: true }), this._visibilityStateListener && (me.removeEventListener(le, this._visibilityStateListener), this._visibilityStateListener = null)) : this._visibilityStateListener || (this._visibilityStateListener = this._captureInitialPageview.bind(this), rr(me, le, this._visibilityStateListener)));
  }
  debug(e2) {
    false === e2 ? (null == pe || pe.console.log("You've disabled debug mode."), this.set_config({ debug: false })) : (null == pe || pe.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({ debug: true }));
  }
  _shouldDisableFlags() {
    var e2, t2, i2, r2, s2, n2, o2 = this._originalUserConfig || {};
    return "advanced_disable_flags" in o2 ? !!o2.advanced_disable_flags : false !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : true === this.config.advanced_disable_decide ? (Wi.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), true) : (i2 = "advanced_disable_decide", false, r2 = Wi, s2 = (t2 = "advanced_disable_flags") in (e2 = o2) && !Je(e2[t2]), n2 = i2 in e2 && !Je(e2[i2]), s2 ? e2[t2] : !!n2 && (r2 && r2.warn("Config field '" + i2 + "' is deprecated. Please use '" + t2 + "' instead. The old field will be removed in a future major version."), e2[i2]));
  }
  _runBeforeSend(e2) {
    if (Je(this.config.before_send)) return e2;
    var t2 = Be(this.config.before_send) ? this.config.before_send : [this.config.before_send], i2 = e2;
    for (var r2 of t2) {
      if (i2 = r2(i2), Je(i2)) {
        var s2 = "Event '" + e2.event + "' was rejected in beforeSend function";
        return tt(e2.event) ? Wi.warn(s2 + ". This can cause unexpected behavior.") : Wi.info(s2), null;
      }
      i2.properties && !Ve(i2.properties) || Wi.warn("Event '" + e2.event + "' has no properties after beforeSend function, this is likely an error.");
    }
    return i2;
  }
  getPageViewId() {
    var e2;
    return null == (e2 = this.pageViewManager._currentPageview) ? void 0 : e2.pageViewId;
  }
  captureTraceFeedback(e2, t2) {
    this.capture("$ai_feedback", { $ai_trace_id: String(e2), $ai_feedback_text: t2 });
  }
  captureTraceMetric(e2, t2, i2) {
    this.capture("$ai_metric", { $ai_trace_id: String(e2), $ai_metric_name: t2, $ai_metric_value: String(i2) });
  }
  _checkLocalStorageForDebug(e2) {
    var t2 = Ze(e2) && !e2, i2 = vr._is_supported() && "true" === vr._get("ph_debug");
    return !t2 && (!!i2 || e2);
  }
};
Qn.__defaultExtensionClasses = {}, Qn._noopLogger = { trace: Nn = () => {
}, debug: Nn, info: Nn, warn: Nn, error: Nn, fatal: Nn }, (function(e2, t2) {
  for (var i2 = 0; t2.length > i2; i2++) e2.prototype[t2[i2]] = Zi(e2.prototype[t2[i2]]);
})(Qn, ["identify"]);
var Zn = 1;
var eo = 3;
var to = 11;
function io(e2) {
  return e2 instanceof Element && (e2.id === X || !(null == e2.closest || !e2.closest(".toolbar-global-fade-container")));
}
function ro(e2) {
  return !!e2 && e2.nodeType === Zn;
}
function so(e2, t2) {
  return !!e2 && !!e2.tagName && e2.tagName.toLowerCase() === t2.toLowerCase();
}
function no(e2) {
  return !!e2 && e2.nodeType === eo;
}
function oo(e2) {
  return !!e2 && e2.nodeType === to && ro(e2.host);
}
function ao(e2) {
  return e2 ? De(e2).split(/\s+/) : [];
}
function lo(e2) {
  var t2 = null == pe ? void 0 : pe.location.href;
  return !!(t2 && e2 && e2.some(((e3) => t2.match(e3))));
}
function uo(e2) {
  var t2 = "";
  switch (typeof e2.className) {
    case "string":
      t2 = e2.className;
      break;
    case "object":
      t2 = (e2.className && "baseVal" in e2.className ? e2.className.baseVal : null) || e2.getAttribute("class") || "";
      break;
    default:
      t2 = "";
  }
  return ao(t2);
}
function co(e2) {
  return Je(e2) ? null : De(e2).split(/(\s+)/).filter(((e3) => To(e3))).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
}
function _o(e2) {
  var t2 = "";
  return wo(e2) && !Eo(e2) && e2.childNodes && e2.childNodes.length && Ki(e2.childNodes, (function(e3) {
    var i2;
    no(e3) && e3.textContent && (t2 += null !== (i2 = co(e3.textContent)) && void 0 !== i2 ? i2 : "");
  })), De(t2);
}
function ho(e2) {
  return We(e2.target) ? e2.srcElement || null : null != (t2 = e2.target) && t2.shadowRoot ? e2.composedPath()[0] || null : e2.target || null;
  var t2;
}
var po = ["a", "button", "form", "input", "select", "textarea", "label"];
function go(e2, t2) {
  if (We(t2)) return true;
  var i2, r2 = function(e3) {
    if (t2.some(((t3) => e3.matches(t3)))) return { v: true };
  };
  for (var s2 of e2) if (i2 = r2(s2)) return i2.v;
  return false;
}
function vo(e2) {
  var t2 = e2.parentNode;
  return !(!t2 || !ro(t2)) && t2;
}
var fo = ["next", "previous", "prev", ">", "<"];
var mo = [".ph-no-rageclick", ".ph-no-capture"];
var yo = (e2) => !e2 || so(e2, "html") || !ro(e2);
var bo = (e2, t2) => {
  if (!pe || yo(e2)) return { parentIsUsefulElement: false, targetElementList: [] };
  for (var i2 = false, r2 = [e2], s2 = e2; s2.parentNode && !so(s2, "body"); ) if (oo(s2.parentNode)) r2.push(s2.parentNode.host), s2 = s2.parentNode.host;
  else {
    var n2 = vo(s2);
    if (!n2) break;
    if (t2 || po.indexOf(n2.tagName.toLowerCase()) > -1) i2 = true;
    else {
      var o2 = pe.getComputedStyle(n2);
      o2 && "pointer" === o2.getPropertyValue("cursor") && (i2 = true);
    }
    r2.push(n2), s2 = n2;
  }
  return { parentIsUsefulElement: i2, targetElementList: r2 };
};
function wo(e2) {
  for (var t2 = e2; t2.parentNode && !so(t2, "body"); t2 = t2.parentNode) {
    var i2 = uo(t2);
    if (Ae(i2, "ph-sensitive") || Ae(i2, "ph-no-capture")) return false;
  }
  if (Ae(uo(e2), "ph-include")) return true;
  var r2 = e2.type || "";
  if (Ge(r2)) switch (r2.toLowerCase()) {
    case "hidden":
    case "password":
      return false;
  }
  var s2 = e2.name || e2.id || "";
  return !Ge(s2) || !/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s2.replace(/[^a-zA-Z0-9]/g, ""));
}
function Eo(e2) {
  return !!(so(e2, "input") && !["button", "checkbox", "submit", "reset"].includes(e2.type) || so(e2, "select") || so(e2, "textarea") || "true" === e2.getAttribute("contenteditable"));
}
var So = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
var xo = new RegExp("^(?:" + So + ")$");
var ko = new RegExp(So);
var Io = "\\d{3}-?\\d{2}-?\\d{4}";
var Po = new RegExp("^(" + Io + ")$");
var Co = new RegExp("(" + Io + ")");
function To(e2, t2) {
  if (void 0 === t2 && (t2 = true), Je(e2)) return false;
  if (Ge(e2)) {
    if (e2 = De(e2), (t2 ? xo : ko).test((e2 || "").replace(/[- ]/g, ""))) return false;
    if ((t2 ? Po : Co).test(e2)) return false;
  }
  return true;
}
function Ro(e2) {
  var t2 = _o(e2);
  return To(t2 = (t2 + " " + Fo(e2)).trim()) ? t2 : "";
}
function Fo(e2) {
  var t2 = "";
  return e2 && e2.childNodes && e2.childNodes.length && Ki(e2.childNodes, (function(e3) {
    var i2;
    if (e3 && "span" === (null == (i2 = e3.tagName) ? void 0 : i2.toLowerCase())) try {
      var r2 = _o(e3);
      t2 = (t2 + " " + r2).trim(), e3.childNodes && e3.childNodes.length && (t2 = (t2 + " " + Fo(e3)).trim());
    } catch (e4) {
      Wi.error("[AutoCapture]", e4);
    }
  })), t2;
}
function Lo(e2) {
  return e2.replace(/"|\\"/g, '\\"');
}
function $o(e2) {
  var t2 = e2.attr__class;
  return t2 ? Be(t2) ? t2 : ao(t2) : void 0;
}
var Oo = class {
  constructor(e2) {
    this.disabled = false === e2;
    var t2 = je(e2) ? e2 : {};
    this.thresholdPx = t2.threshold_px || 30, this.timeoutMs = t2.timeout_ms || 1e3, this.clickCount = t2.click_count || 3, this.clicks = [];
  }
  isRageClick(e2, t2, i2) {
    if (this.disabled) return false;
    var r2 = this.clicks[this.clicks.length - 1];
    if (r2 && Math.abs(e2 - r2.x) + Math.abs(t2 - r2.y) < this.thresholdPx && this.timeoutMs > i2 - r2.timestamp) {
      if (this.clicks.push({ x: e2, y: t2, timestamp: i2 }), this.clicks.length === this.clickCount) return true;
    } else this.clicks = [{ x: e2, y: t2, timestamp: i2 }];
    return false;
  }
};
var Mo = "$copy_autocapture";
var Ao = Gi("[AutoCapture]");
function Do(e2, t2) {
  return t2.length > e2 ? t2.slice(0, e2) + "..." : t2;
}
function No(e2) {
  if (e2.previousElementSibling) return e2.previousElementSibling;
  var t2 = e2;
  do {
    t2 = t2.previousSibling;
  } while (t2 && !ro(t2));
  return t2;
}
function Uo(e2, t2) {
  var r2, s2, { e: n2, maskAllElementAttributes: o2, maskAllText: a2, elementAttributeIgnoreList: l2, elementsChainAsString: u2 } = t2;
  if (!ro(e2)) return { props: {} };
  for (var c2 = [e2], d2 = e2; d2.parentNode && !so(d2, "body"); ) if (oo(d2.parentNode)) c2.push(d2.parentNode.host), d2 = d2.parentNode.host;
  else {
    if (!ro(d2.parentNode)) break;
    c2.push(d2.parentNode), d2 = d2.parentNode;
  }
  var _2, h2, p2 = [], g2 = {}, v2 = false, f2 = false;
  if (Ki(c2, ((e3) => {
    var t3 = wo(e3);
    if (so(e3, "a")) {
      var i2 = e3.getAttribute("href");
      v2 = t3 && !!i2 && To(i2) && i2;
    }
    Ae(uo(e3), "ph-no-capture") && (f2 = true), p2.push((function(e4, t4, i3, r4) {
      var s3 = e4.tagName.toLowerCase(), n3 = { tag_name: s3 };
      po.indexOf(s3) > -1 && !i3 && (n3.$el_text = "a" === s3.toLowerCase() || "button" === s3.toLowerCase() ? Do(1024, Ro(e4)) : Do(1024, _o(e4)));
      var o3 = uo(e4);
      o3.length > 0 && (n3.classes = o3.filter((function(e5) {
        return "" !== e5;
      }))), Ki(e4.attributes, (function(i4) {
        var s4;
        if ((!Eo(e4) || -1 !== ["name", "id", "class", "aria-label"].indexOf(i4.name)) && (null == r4 || !r4.includes(i4.name)) && !t4 && To(i4.value) && (!Ge(s4 = i4.name) || "_ngcontent" !== s4.substring(0, 10) && "_nghost" !== s4.substring(0, 7))) {
          var o4 = i4.value;
          "class" === i4.name && (o4 = ao(o4).join(" ")), n3["attr__" + i4.name] = Do(1024, o4);
        }
      }));
      for (var a3 = 1, l3 = 1, u3 = e4; u3 = No(u3); ) a3++, u3.tagName === e4.tagName && l3++;
      return n3.nth_child = a3, n3.nth_of_type = l3, n3;
    })(e3, o2, a2, l2));
    var r3 = (function(e4) {
      if (!wo(e4)) return {};
      var t4 = {};
      return Ki(e4.attributes, (function(e5) {
        if (e5.name && 0 === e5.name.indexOf("data-ph-capture-attribute")) {
          var i3 = e5.name.replace("data-ph-capture-attribute-", ""), r4 = e5.value;
          i3 && r4 && To(r4) && (t4[i3] = r4);
        }
      })), t4;
    })(e3);
    Ji(g2, r3);
  })), f2) return { props: {}, explicitNoCapture: f2 };
  if (a2 || (p2[0].$el_text = so(e2, "a") || so(e2, "button") ? Ro(e2) : _o(e2)), v2) {
    var m2, y2;
    p2[0].attr__href = v2;
    var b2 = null == (m2 = Or(v2)) ? void 0 : m2.host, w2 = null == pe || null == (y2 = pe.location) ? void 0 : y2.host;
    b2 && w2 && b2 !== w2 && (_2 = v2);
  }
  return { props: Ji({ $event_type: n2.type, $ce_version: 1 }, u2 ? {} : { $elements: p2 }, { $elements_chain: (h2 = p2, (function(e3) {
    return e3.map(((e4) => {
      var t3, r3, s3 = "";
      if (e4.tag_name && (s3 += e4.tag_name), e4.attr_class) for (var n3 of (e4.attr_class.sort(), e4.attr_class)) s3 += "." + n3.replace(/"/g, "");
      var o3 = i({}, e4.text ? { text: e4.text } : {}, { "nth-child": null !== (t3 = e4.nth_child) && void 0 !== t3 ? t3 : 0, "nth-of-type": null !== (r3 = e4.nth_of_type) && void 0 !== r3 ? r3 : 0 }, e4.href ? { href: e4.href } : {}, e4.attr_id ? { attr_id: e4.attr_id } : {}, e4.attributes), a3 = {};
      return Xi(o3).sort(((e5, t4) => {
        var [i2] = e5, [r4] = t4;
        return i2.localeCompare(r4);
      })).forEach(((e5) => {
        var [t4, i2] = e5;
        return a3[Lo(t4.toString())] = Lo(i2.toString());
      })), (s3 += ":") + Xi(a3).map(((e5) => {
        var [t4, i2] = e5;
        return t4 + '="' + i2 + '"';
      })).join("");
    })).join(";");
  })((function(e3) {
    return e3.map(((e4) => {
      var t3, i2, r3 = { text: null == (t3 = e4.$el_text) ? void 0 : t3.slice(0, 400), tag_name: e4.tag_name, href: null == (i2 = e4.attr__href) ? void 0 : i2.slice(0, 2048), attr_class: $o(e4), attr_id: e4.attr__id, nth_child: e4.nth_child, nth_of_type: e4.nth_of_type, attributes: {} };
      return Xi(e4).filter(((e5) => {
        var [t4] = e5;
        return 0 === t4.indexOf("attr__");
      })).forEach(((e5) => {
        var [t4, i3] = e5;
        return r3.attributes[t4] = i3;
      })), r3;
    }));
  })(h2))) }, null != (r2 = p2[0]) && r2.$el_text ? { $el_text: null == (s2 = p2[0]) ? void 0 : s2.$el_text } : {}, _2 && "click" === n2.type ? { $external_click_url: _2 } : {}, g2) };
}
var qo = Gi("[ExceptionAutocapture]");
function zo(e2, t2, i2) {
  try {
    if (!(t2 in e2)) return () => {
    };
    var r2 = e2[t2], s2 = i2(r2);
    return He(s2) && (s2.prototype = s2.prototype || {}, Object.defineProperties(s2, { __posthog_wrapped__: { enumerable: false, value: true } })), e2[t2] = s2, () => {
      e2[t2] = r2;
    };
  } catch (e3) {
    return () => {
    };
  }
}
var Bo = Gi("[TracingHeaders]");
var Ho = Gi("[Web Vitals]");
var jo = 9e5;
var Vo = "disabled";
var Wo = "lazy_loading";
var Go = "awaiting_config";
var Yo = "missing_config";
Gi("[SessionRecording]"), Gi("[SessionRecording]");
var Ko = "[SessionRecording]";
var Jo = Gi(Ko);
var Xo = Gi("[Heatmaps]");
function Qo(e2) {
  return je(e2) && "clientX" in e2 && "clientY" in e2 && Xe(e2.clientX) && Xe(e2.clientY);
}
var Zo = Gi("[Product Tours]");
var ea = ["$set_once", "$set"];
var ta = Gi("[SiteApps]");
var ia = "Error while initializing PostHog app with config id ";
function ra(e2, t2, i2) {
  if (Je(e2)) return false;
  switch (i2) {
    case "exact":
      return e2 === t2;
    case "contains":
      var r2 = t2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/_/g, ".").replace(/%/g, ".*");
      return new RegExp(r2, "i").test(e2);
    case "regex":
      try {
        return new RegExp(t2).test(e2);
      } catch (e3) {
        return false;
      }
    default:
      return false;
  }
}
var sa = class {
  constructor(e2) {
    this._debugEventEmitter = new mn(), this._checkStep = (e3, t2) => this._checkStepEvent(e3, t2) && this._checkStepUrl(e3, t2) && this._checkStepElement(e3, t2) && this._checkStepProperties(e3, t2), this._checkStepEvent = (e3, t2) => null == t2 || !t2.event || (null == e3 ? void 0 : e3.event) === (null == t2 ? void 0 : t2.event), this._instance = e2, this._actionEvents = /* @__PURE__ */ new Set(), this._actionRegistry = /* @__PURE__ */ new Set();
  }
  init() {
    var e2, t2;
    We(null == (e2 = this._instance) ? void 0 : e2._addCaptureHook) || (null == (t2 = this._instance) || t2._addCaptureHook(((e3, t3) => {
      this.on(e3, t3);
    })));
  }
  register(e2) {
    var t2, i2;
    if (!We(null == (t2 = this._instance) ? void 0 : t2._addCaptureHook) && (e2.forEach(((e3) => {
      var t3, i3;
      null == (t3 = this._actionRegistry) || t3.add(e3), null == (i3 = e3.steps) || i3.forEach(((e4) => {
        var t4;
        null == (t4 = this._actionEvents) || t4.add((null == e4 ? void 0 : e4.event) || "");
      }));
    })), null != (i2 = this._instance) && i2.autocapture)) {
      var r2, s2 = /* @__PURE__ */ new Set();
      e2.forEach(((e3) => {
        var t3;
        null == (t3 = e3.steps) || t3.forEach(((e4) => {
          null != e4 && e4.selector && s2.add(null == e4 ? void 0 : e4.selector);
        }));
      })), null == (r2 = this._instance) || r2.autocapture.setElementSelectors(s2);
    }
  }
  on(e2, t2) {
    var i2;
    null != t2 && 0 != e2.length && (this._actionEvents.has(e2) || this._actionEvents.has(null == t2 ? void 0 : t2.event)) && this._actionRegistry && (null == (i2 = this._actionRegistry) ? void 0 : i2.size) > 0 && this._actionRegistry.forEach(((e3) => {
      this._checkAction(t2, e3) && this._debugEventEmitter.emit("actionCaptured", e3.name);
    }));
  }
  _addActionHook(e2) {
    this.onAction("actionCaptured", ((t2) => e2(t2)));
  }
  _checkAction(e2, t2) {
    if (null == (null == t2 ? void 0 : t2.steps)) return false;
    for (var i2 of t2.steps) if (this._checkStep(e2, i2)) return true;
    return false;
  }
  onAction(e2, t2) {
    return this._debugEventEmitter.on(e2, t2);
  }
  _checkStepUrl(e2, t2) {
    if (null != t2 && t2.url) {
      var i2, r2 = null == e2 || null == (i2 = e2.properties) ? void 0 : i2.$current_url;
      if (!r2 || "string" != typeof r2) return false;
      if (!ra(r2, t2.url, t2.url_matching || "contains")) return false;
    }
    return true;
  }
  _checkStepElement(e2, t2) {
    return !!this._checkStepHref(e2, t2) && !!this._checkStepText(e2, t2) && !!this._checkStepSelector(e2, t2);
  }
  _checkStepHref(e2, t2) {
    var i2;
    if (null == t2 || !t2.href) return true;
    var r2 = this._getElementsList(e2);
    if (r2.length > 0) return r2.some(((e3) => ra(e3.href, t2.href, t2.href_matching || "exact")));
    var s2, n2 = (null == e2 || null == (i2 = e2.properties) ? void 0 : i2.$elements_chain) || "";
    return !!n2 && ra((s2 = n2.match(/(?::|")href="(.*?)"/)) ? s2[1] : "", t2.href, t2.href_matching || "exact");
  }
  _checkStepText(e2, t2) {
    var i2;
    if (null == t2 || !t2.text) return true;
    var r2 = this._getElementsList(e2);
    if (r2.length > 0) return r2.some(((e3) => ra(e3.text, t2.text, t2.text_matching || "exact") || ra(e3.$el_text, t2.text, t2.text_matching || "exact")));
    var s2, n2, o2, a2 = (null == e2 || null == (i2 = e2.properties) ? void 0 : i2.$elements_chain) || "";
    return !!a2 && (s2 = (function(e3) {
      for (var t3, i3 = [], r3 = /(?::|")text="(.*?)"/g; !Je(t3 = r3.exec(e3)); ) i3.includes(t3[1]) || i3.push(t3[1]);
      return i3;
    })(a2), n2 = t2.text, o2 = t2.text_matching || "exact", s2.some(((e3) => ra(e3, n2, o2))));
  }
  _checkStepSelector(e2, t2) {
    var i2, r2;
    if (null == t2 || !t2.selector) return true;
    var s2 = null == e2 || null == (i2 = e2.properties) ? void 0 : i2.$element_selectors;
    if (null != s2 && s2.includes(t2.selector)) return true;
    var n2 = (null == e2 || null == (r2 = e2.properties) ? void 0 : r2.$elements_chain) || "";
    if (t2.selector_regex && n2) try {
      return new RegExp(t2.selector_regex).test(n2);
    } catch (e3) {
      return false;
    }
    return false;
  }
  _getElementsList(e2) {
    var t2;
    return null == (null == e2 || null == (t2 = e2.properties) ? void 0 : t2.$elements) ? [] : null == e2 ? void 0 : e2.properties.$elements;
  }
  _checkStepProperties(e2, t2) {
    return null == t2 || !t2.properties || 0 === t2.properties.length || In(t2.properties.reduce(((e3, t3) => {
      var i2 = Be(t3.value) ? t3.value.map(String) : null != t3.value ? [String(t3.value)] : [];
      return e3[t3.key] = { values: i2, operator: t3.operator || "exact" }, e3;
    }), {}), null == e2 ? void 0 : e2.properties);
  }
};
var na = class {
  constructor(e2) {
    this._instance = e2, this._eventToItems = /* @__PURE__ */ new Map(), this._cancelEventToItems = /* @__PURE__ */ new Map(), this._actionToItems = /* @__PURE__ */ new Map();
  }
  _doesEventMatchFilter(e2, t2) {
    return !!e2 && In(e2.propertyFilters, null == t2 ? void 0 : t2.properties);
  }
  _buildEventToItemMap(e2, t2) {
    var i2 = /* @__PURE__ */ new Map();
    return e2.forEach(((e3) => {
      var r2;
      null == (r2 = e3.conditions) || null == (r2 = r2[t2]) || null == (r2 = r2.values) || r2.forEach(((t3) => {
        if (null != t3 && t3.name) {
          var r3 = i2.get(t3.name) || [];
          r3.push(e3.id), i2.set(t3.name, r3);
        }
      }));
    })), i2;
  }
  _getMatchingItems(e2, t2, i2) {
    var r2 = (i2 === ts.Activation ? this._eventToItems : this._cancelEventToItems).get(e2), s2 = [];
    return this._getItems(((e3) => {
      s2 = e3.filter(((e4) => null == r2 ? void 0 : r2.includes(e4.id)));
    })), s2.filter(((r3) => {
      var s3, n2 = null == (s3 = r3.conditions) || null == (s3 = s3[i2]) || null == (s3 = s3.values) ? void 0 : s3.find(((t3) => t3.name === e2));
      return this._doesEventMatchFilter(n2, t2);
    }));
  }
  register(e2) {
    var t2;
    We(null == (t2 = this._instance) ? void 0 : t2._addCaptureHook) || (this._setupEventBasedItems(e2), this._setupActionBasedItems(e2));
  }
  _setupActionBasedItems(e2) {
    var t2 = e2.filter(((e3) => {
      var t3, i2;
      return (null == (t3 = e3.conditions) ? void 0 : t3.actions) && (null == (i2 = e3.conditions) || null == (i2 = i2.actions) || null == (i2 = i2.values) ? void 0 : i2.length) > 0;
    }));
    0 !== t2.length && (null == this._actionMatcher && (this._actionMatcher = new sa(this._instance), this._actionMatcher.init(), this._actionMatcher._addActionHook(((e3) => {
      this.onAction(e3);
    }))), t2.forEach(((e3) => {
      var t3, i2, r2, s2, n2;
      e3.conditions && null != (t3 = e3.conditions) && t3.actions && null != (i2 = e3.conditions) && null != (i2 = i2.actions) && i2.values && (null == (r2 = e3.conditions) || null == (r2 = r2.actions) || null == (r2 = r2.values) ? void 0 : r2.length) > 0 && (null == (s2 = this._actionMatcher) || s2.register(e3.conditions.actions.values), null == (n2 = e3.conditions) || null == (n2 = n2.actions) || null == (n2 = n2.values) || n2.forEach(((t4) => {
        if (t4 && t4.name) {
          var i3 = this._actionToItems.get(t4.name);
          i3 && i3.push(e3.id), this._actionToItems.set(t4.name, i3 || [e3.id]);
        }
      })));
    })));
  }
  _setupEventBasedItems(e2) {
    var t2, i2 = e2.filter(((e3) => {
      var t3, i3;
      return (null == (t3 = e3.conditions) ? void 0 : t3.events) && (null == (i3 = e3.conditions) || null == (i3 = i3.events) || null == (i3 = i3.values) ? void 0 : i3.length) > 0;
    })), r2 = e2.filter(((e3) => {
      var t3, i3;
      return (null == (t3 = e3.conditions) ? void 0 : t3.cancelEvents) && (null == (i3 = e3.conditions) || null == (i3 = i3.cancelEvents) || null == (i3 = i3.values) ? void 0 : i3.length) > 0;
    }));
    0 === i2.length && 0 === r2.length || (null == (t2 = this._instance) || t2._addCaptureHook(((e3, t3) => {
      this.onEvent(e3, t3);
    })), this._eventToItems = this._buildEventToItemMap(e2, ts.Activation), this._cancelEventToItems = this._buildEventToItemMap(e2, ts.Cancellation));
  }
  onEvent(e2, t2) {
    var i2, r2 = this._getLogger(), s2 = this._getActivatedKey(), n2 = this._getShownEventName(), o2 = (null == (i2 = this._instance) || null == (i2 = i2.persistence) ? void 0 : i2.props[s2]) || [];
    if (n2 === e2 && t2 && o2.length > 0) {
      var a2, l2;
      r2.info("event matched, removing item from activated items", { event: e2, eventPayload: t2, existingActivatedItems: o2 });
      var u2 = (null == t2 || null == (a2 = t2.properties) ? void 0 : a2.$survey_id) || (null == t2 || null == (l2 = t2.properties) ? void 0 : l2.$product_tour_id);
      if (u2) {
        var c2 = o2.indexOf(u2);
        0 > c2 || (o2.splice(c2, 1), this._updateActivatedItems(o2));
      }
    } else {
      if (this._cancelEventToItems.has(e2)) {
        var d2 = this._getMatchingItems(e2, t2, ts.Cancellation);
        d2.length > 0 && (r2.info("cancel event matched, cancelling items", { event: e2, itemsToCancel: d2.map(((e3) => e3.id)) }), d2.forEach(((e3) => {
          var t3 = o2.indexOf(e3.id);
          0 > t3 || o2.splice(t3, 1), this._cancelPendingItem(e3.id);
        })), this._updateActivatedItems(o2));
      }
      if (this._eventToItems.has(e2)) {
        r2.info("event name matched", { event: e2, eventPayload: t2, items: this._eventToItems.get(e2) });
        var _2 = this._getMatchingItems(e2, t2, ts.Activation);
        this._updateActivatedItems(o2.concat(_2.map(((e3) => e3.id)) || []));
      }
    }
  }
  onAction(e2) {
    var t2, i2 = this._getActivatedKey(), r2 = (null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.props[i2]) || [];
    this._actionToItems.has(e2) && this._updateActivatedItems(r2.concat(this._actionToItems.get(e2) || []));
  }
  _updateActivatedItems(e2) {
    var t2 = this._getLogger(), i2 = [...new Set(e2)].filter(((e3) => !this._isItemPermanentlyIneligible(e3)));
    t2.info("updating activated items", { activatedItems: i2 }), this._setActivatedItems(i2);
  }
  getActivatedIds() {
    var e2, t2 = this._getActivatedKey();
    return (null == (e2 = this._instance) || null == (e2 = e2.persistence) ? void 0 : e2.props[t2]) || [];
  }
  getEventToItemsMap() {
    return this._eventToItems;
  }
  _getActionMatcher() {
    return this._actionMatcher;
  }
};
var oa = class extends na {
  constructor(e2) {
    super(e2);
  }
  _getActivatedKey() {
    return N;
  }
  _getShownEventName() {
    return us.SHOWN;
  }
  _getItems(e2) {
    var t2;
    null == (t2 = this._instance) || t2.getSurveys(e2);
  }
  _cancelPendingItem(e2) {
    var t2;
    null == (t2 = this._instance) || t2.cancelPendingSurvey(e2);
  }
  _getLogger() {
    return Fn;
  }
  _setActivatedItems(e2) {
    var t2;
    null == (t2 = this._instance) || null == (t2 = t2.persistence) || t2.register({ [N]: e2 });
  }
  _isItemPermanentlyIneligible() {
    return false;
  }
  getSurveys() {
    return this.getActivatedIds();
  }
  getEventToSurveys() {
    return this.getEventToItemsMap();
  }
};
var aa = "SDK is not enabled or survey functionality is not yet loaded";
var la = "Disabled. Not loading surveys.";
var ua = null != pe && pe.location ? Dr(pe.location.hash, "__posthog") || Dr(location.hash, "state") : null;
var ca = "_postHogToolbarParams";
var da = Gi("[Toolbar]");
var _a = Gi("[FeatureFlags]");
var ha = Gi("[FeatureFlags]", { debugEnabled: true });
var pa = `" failed. Feature flags didn't load in time.`;
var ga = (e2) => {
  for (var t2 = {}, i2 = 0; e2.length > i2; i2++) t2[e2[i2]] = true;
  return t2;
};
var va = (e2) => {
  var t2 = {};
  for (var [i2, r2] of Xi(e2 || {})) r2 && (t2[i2] = r2);
  return t2;
};
var fa = Gi("[Error tracking]");
var ma = "Refusing to render web experiment since the viewer is a likely bot";
var ya = { icontains: (e2, t2) => !!pe && t2.href.toLowerCase().indexOf(e2.toLowerCase()) > -1, not_icontains: (e2, t2) => !!pe && -1 === t2.href.toLowerCase().indexOf(e2.toLowerCase()), regex: (e2, t2) => !!pe && En(t2.href, e2), not_regex: (e2, t2) => !!pe && !En(t2.href, e2), exact: (e2, t2) => t2.href === e2, is_not: (e2, t2) => t2.href !== e2 };
var ba = class _ba {
  get _config() {
    return this._instance.config;
  }
  constructor(e2) {
    var t2 = this;
    this.getWebExperimentsAndEvaluateDisplayLogic = function(e3) {
      void 0 === e3 && (e3 = false), t2.getWebExperiments(((e4) => {
        _ba._logInfo("retrieved web experiments from the server"), t2._flagToExperiments = /* @__PURE__ */ new Map(), e4.forEach(((e5) => {
          if (e5.feature_flag_key) {
            var i2;
            t2._flagToExperiments && (_ba._logInfo("setting flag key ", e5.feature_flag_key, " to web experiment ", e5), null == (i2 = t2._flagToExperiments) || i2.set(e5.feature_flag_key, e5));
            var r2 = t2._instance.getFeatureFlag(e5.feature_flag_key);
            Ge(r2) && e5.variants[r2] && t2._applyTransforms(e5.name, r2, e5.variants[r2].transforms);
          } else if (e5.variants) for (var s2 in e5.variants) {
            var n2 = e5.variants[s2];
            _ba._matchesTestVariant(n2) && t2._applyTransforms(e5.name, s2, n2.transforms);
          }
        }));
      }), e3);
    }, this._instance = e2, this._instance.onFeatureFlags(((e3) => {
      this.onFeatureFlags(e3);
    }));
  }
  initialize() {
  }
  onFeatureFlags(e2) {
    if (this._is_bot()) _ba._logInfo(ma);
    else if (!this._config.disable_web_experiments) {
      if (Je(this._flagToExperiments)) return this._flagToExperiments = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
      _ba._logInfo("applying feature flags", e2), e2.forEach(((e3) => {
        var t2;
        if (this._flagToExperiments && null != (t2 = this._flagToExperiments) && t2.has(e3)) {
          var i2, r2 = this._instance.getFeatureFlag(e3), s2 = null == (i2 = this._flagToExperiments) ? void 0 : i2.get(e3);
          r2 && null != s2 && s2.variants[r2] && this._applyTransforms(s2.name, r2, s2.variants[r2].transforms);
        }
      }));
    }
  }
  previewWebExperiment() {
    var e2 = _ba.getWindowLocation();
    if (null != e2 && e2.search) {
      var t2 = Mr(null == e2 ? void 0 : e2.search, "__experiment_id"), i2 = Mr(null == e2 ? void 0 : e2.search, "__experiment_variant");
      t2 && i2 && (_ba._logInfo("previewing web experiments " + t2 + " && " + i2), this.getWebExperiments(((e3) => {
        this._showPreviewWebExperiment(parseInt(t2), i2, e3);
      }), false, true));
    }
  }
  loadIfEnabled() {
    this._config.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
  }
  getWebExperiments(e2, t2, i2) {
    if (this._config.disable_web_experiments && !i2) return e2([]);
    var r2 = this._instance.get_property("$web_experiments");
    if (r2 && !t2) return e2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=" + this._config.token), method: "GET", callback: (t3) => e2(200 === t3.statusCode && t3.json && t3.json.experiments || []) });
  }
  _showPreviewWebExperiment(e2, t2, i2) {
    var r2 = i2.filter(((t3) => t3.id === e2));
    r2 && r2.length > 0 && (_ba._logInfo("Previewing web experiment [" + r2[0].name + "] with variant [" + t2 + "]"), this._applyTransforms(r2[0].name, t2, r2[0].variants[t2].transforms));
  }
  static _matchesTestVariant(e2) {
    return !Je(e2.conditions) && _ba._matchUrlConditions(e2) && _ba._matchUTMConditions(e2);
  }
  static _matchUrlConditions(e2) {
    var t2;
    if (Je(e2.conditions) || Je(null == (t2 = e2.conditions) ? void 0 : t2.url)) return true;
    var i2, r2, s2, n2 = _ba.getWindowLocation();
    return !!n2 && (null == (i2 = e2.conditions) || !i2.url || ya[null !== (r2 = null == (s2 = e2.conditions) ? void 0 : s2.urlMatchType) && void 0 !== r2 ? r2 : "icontains"](e2.conditions.url, n2));
  }
  static getWindowLocation() {
    return null == pe ? void 0 : pe.location;
  }
  static _matchUTMConditions(e2) {
    var t2;
    if (Je(e2.conditions) || Je(null == (t2 = e2.conditions) ? void 0 : t2.utm)) return true;
    var i2 = Hr();
    if (i2.utm_source) {
      var r2, s2, n2, o2, a2, l2, u2, c2, d2 = null == (r2 = e2.conditions) || null == (r2 = r2.utm) || !r2.utm_campaign || (null == (s2 = e2.conditions) || null == (s2 = s2.utm) ? void 0 : s2.utm_campaign) == i2.utm_campaign, _2 = null == (n2 = e2.conditions) || null == (n2 = n2.utm) || !n2.utm_source || (null == (o2 = e2.conditions) || null == (o2 = o2.utm) ? void 0 : o2.utm_source) == i2.utm_source, h2 = null == (a2 = e2.conditions) || null == (a2 = a2.utm) || !a2.utm_medium || (null == (l2 = e2.conditions) || null == (l2 = l2.utm) ? void 0 : l2.utm_medium) == i2.utm_medium, p2 = null == (u2 = e2.conditions) || null == (u2 = u2.utm) || !u2.utm_term || (null == (c2 = e2.conditions) || null == (c2 = c2.utm) ? void 0 : c2.utm_term) == i2.utm_term;
      return d2 && h2 && p2 && _2;
    }
    return false;
  }
  static _logInfo(e2) {
    for (var t2 = arguments.length, i2 = new Array(t2 > 1 ? t2 - 1 : 0), r2 = 1; t2 > r2; r2++) i2[r2 - 1] = arguments[r2];
    Wi.info("[WebExperiments] " + e2, i2);
  }
  _applyTransforms(e2, t2, i2) {
    this._is_bot() ? _ba._logInfo(ma) : "control" !== t2 ? i2.forEach(((i3) => {
      if (i3.selector) {
        var r2;
        _ba._logInfo("applying transform of variant " + t2 + " for experiment " + e2 + " ", i3);
        var s2 = null == (r2 = document) ? void 0 : r2.querySelectorAll(i3.selector);
        null == s2 || s2.forEach(((e3) => {
          var t3 = e3;
          i3.html && (t3.innerHTML = i3.html), i3.css && t3.setAttribute("style", i3.css);
        }));
      }
    })) : _ba._logInfo("Control variants leave the page unmodified.");
  }
  _is_bot() {
    return fe && this._instance ? wn(fe, this._config.custom_blocked_useragents) : void 0;
  }
};
var wa = Gi("[Conversations]");
var Ea = "Conversations not available yet.";
var Sa = { featureFlags: class {
  constructor(e2) {
    this._override_warning = false, this._hasLoadedFlags = false, this._requestInFlight = false, this._reloadingDisabled = false, this._additionalReloadRequested = false, this._flagsLoadedFromRemote = false, this._hasLoggedDeprecationWarning = false, this._staleCacheRefreshTriggered = false, this._instance = e2, this.featureFlagEventHandlers = [];
  }
  get _config() {
    return this._instance.config;
  }
  get _persistence() {
    return this._instance.persistence;
  }
  _prop(e2) {
    return this._instance.get_property(e2);
  }
  _isCacheStale() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this._persistence) ? void 0 : t2._isFeatureFlagCacheStale(this._config.feature_flag_cache_ttl_ms)) && void 0 !== e2 && e2;
  }
  _checkAndTriggerStaleRefresh() {
    return !!this._isCacheStale() && (this._staleCacheRefreshTriggered || this._requestInFlight || (this._staleCacheRefreshTriggered = true, _a.warn("Feature flag cache is stale, triggering refresh..."), this.reloadFeatureFlags()), true);
  }
  _getValidEvaluationEnvironments() {
    var e2, t2 = null !== (e2 = this._config.evaluation_contexts) && void 0 !== e2 ? e2 : this._config.evaluation_environments;
    return !this._config.evaluation_environments || this._config.evaluation_contexts || this._hasLoggedDeprecationWarning || (_a.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this._hasLoggedDeprecationWarning = true), null != t2 && t2.length ? t2.filter(((e3) => {
      var t3 = e3 && "string" == typeof e3 && e3.trim().length > 0;
      return t3 || _a.error("Invalid evaluation context found:", e3, "Expected non-empty string"), t3;
    })) : [];
  }
  _shouldIncludeEvaluationEnvironments() {
    return this._getValidEvaluationEnvironments().length > 0;
  }
  _getValidFlagKeys() {
    var e2 = this._config.flag_keys;
    if (!We(e2)) {
      if (Be(e2)) return e2.filter(((e3) => {
        var t2 = e3 && "string" == typeof e3 && e3.trim().length > 0;
        return t2 || _a.error("Invalid flag key found:", e3, "Expected non-empty string"), t2;
      }));
      _a.error("Invalid flag_keys found:", e2, "Expected array of non-empty strings");
    }
  }
  initialize() {
    var e2, t2, { config: i2 } = this._instance, r2 = null !== (e2 = null == (t2 = i2.bootstrap) ? void 0 : t2.featureFlags) && void 0 !== e2 ? e2 : {};
    if (Object.keys(r2).length) {
      var s2, n2, o2 = null !== (s2 = null == (n2 = i2.bootstrap) ? void 0 : n2.featureFlagPayloads) && void 0 !== s2 ? s2 : {}, a2 = Object.keys(r2).filter(((e3) => !!r2[e3])).reduce(((e3, t3) => (e3[t3] = r2[t3] || false, e3)), {}), l2 = Object.keys(o2).filter(((e3) => a2[e3])).reduce(((e3, t3) => (o2[t3] && (e3[t3] = o2[t3]), e3)), {});
      this.receivedFeatureFlags({ featureFlags: a2, featureFlagPayloads: l2 });
    }
  }
  updateFlags(e2, t2, r2) {
    var s2 = null != r2 && r2.merge ? this.getFlagVariants() : {}, n2 = null != r2 && r2.merge ? this.getFlagPayloads() : {}, o2 = i({}, s2, e2), a2 = i({}, n2, t2), l2 = {};
    for (var [u2, c2] of Object.entries(o2)) {
      var d2 = "string" == typeof c2;
      l2[u2] = { key: u2, enabled: !!d2 || Boolean(c2), variant: d2 ? c2 : void 0, reason: void 0, metadata: We(null == a2 ? void 0 : a2[u2]) ? void 0 : { id: 0, version: void 0, description: void 0, payload: a2[u2] } };
    }
    this.receivedFeatureFlags({ flags: l2 });
  }
  get hasLoadedFlags() {
    return this._hasLoadedFlags;
  }
  getFlags() {
    return Object.keys(this.getFlagVariants());
  }
  getFlagsWithDetails() {
    var e2 = this._prop(T), t2 = this._prop(L), r2 = this._prop(O);
    if (!r2 && !t2) return e2 || {};
    var s2 = Ji({}, e2 || {}), n2 = [.../* @__PURE__ */ new Set([...Object.keys(r2 || {}), ...Object.keys(t2 || {})])];
    for (var o2 of n2) {
      var a2, l2, u2 = s2[o2], c2 = null == t2 ? void 0 : t2[o2], d2 = We(c2) ? null !== (a2 = null == u2 ? void 0 : u2.enabled) && void 0 !== a2 && a2 : !!c2, _2 = We(c2) ? u2.variant : "string" == typeof c2 ? c2 : void 0, h2 = null == r2 ? void 0 : r2[o2], p2 = i({}, u2, { enabled: d2, variant: d2 ? null != _2 ? _2 : null == u2 ? void 0 : u2.variant : void 0 });
      d2 !== (null == u2 ? void 0 : u2.enabled) && (p2.original_enabled = null == u2 ? void 0 : u2.enabled), _2 !== (null == u2 ? void 0 : u2.variant) && (p2.original_variant = null == u2 ? void 0 : u2.variant), h2 && (p2.metadata = i({}, null == u2 ? void 0 : u2.metadata, { payload: h2, original_payload: null == u2 || null == (l2 = u2.metadata) ? void 0 : l2.payload })), s2[o2] = p2;
    }
    return this._override_warning || (_a.warn(" Overriding feature flag details!", { flagDetails: e2, overriddenPayloads: r2, finalDetails: s2 }), this._override_warning = true), s2;
  }
  getFlagVariants() {
    var e2 = this._prop(I), t2 = this._prop(L);
    if (!t2) return e2 || {};
    for (var i2 = Ji({}, e2), r2 = Object.keys(t2), s2 = 0; r2.length > s2; s2++) i2[r2[s2]] = t2[r2[s2]];
    return this._override_warning || (_a.warn(" Overriding feature flags!", { enabledFlags: e2, overriddenFlags: t2, finalFlags: i2 }), this._override_warning = true), i2;
  }
  getFlagPayloads() {
    var e2 = this._prop(R), t2 = this._prop(O);
    if (!t2) return e2 || {};
    for (var i2 = Ji({}, e2 || {}), r2 = Object.keys(t2), s2 = 0; r2.length > s2; s2++) i2[r2[s2]] = t2[r2[s2]];
    return this._override_warning || (_a.warn(" Overriding feature flag payloads!", { flagPayloads: e2, overriddenPayloads: t2, finalPayloads: i2 }), this._override_warning = true), i2;
  }
  reloadFeatureFlags() {
    this._reloadingDisabled || this._config.advanced_disable_feature_flags || this._reloadDebouncer || (this._instance._internalEventEmitter.emit("featureFlagsReloading", true), this._reloadDebouncer = setTimeout((() => {
      this._callFlagsEndpoint();
    }), 5));
  }
  _clearDebouncer() {
    clearTimeout(this._reloadDebouncer), this._reloadDebouncer = void 0;
  }
  ensureFlagsLoaded() {
    this._hasLoadedFlags || this._requestInFlight || this._reloadDebouncer || this.reloadFeatureFlags();
  }
  setAnonymousDistinctId(e2) {
    this.$anon_distinct_id = e2;
  }
  setReloadingPaused(e2) {
    this._reloadingDisabled = e2;
  }
  _callFlagsEndpoint(e2) {
    var t2;
    if (this._clearDebouncer(), !this._instance._shouldDisableFlags()) if (this._requestInFlight) this._additionalReloadRequested = true;
    else {
      var r2 = this._config.token, s2 = this._prop(a), n2 = { token: r2, distinct_id: this._instance.get_distinct_id(), groups: this._instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: i({}, (null == (t2 = this._persistence) ? void 0 : t2.get_initial_props()) || {}, this._prop(M) || {}), group_properties: this._prop(A), timezone: Xr() };
      Ke(s2) || We(s2) || (n2.$device_id = s2), (null != e2 && e2.disableFlags || this._config.advanced_disable_feature_flags) && (n2.disable_flags = true), this._shouldIncludeEvaluationEnvironments() && (n2.evaluation_contexts = this._getValidEvaluationEnvironments());
      var o2 = this._getValidFlagKeys();
      We(o2) || (n2.flag_keys = o2);
      var l2 = !!this._config.advanced_only_evaluate_survey_feature_flags, u2 = this._instance.requestRouter.endpointFor("flags", "/flags/?v=2" + (this._config.advanced_only_evaluate_survey_feature_flags ? "&only_evaluate_survey_feature_flags=true" : ""));
      this._requestInFlight = true, this._instance._send_request({ method: "POST", url: u2, data: n2, compression: this._config.disable_compression ? void 0 : bs.Base64, timeout: this._config.feature_flag_request_timeout_ms, callback: (e3) => {
        var t3, i2, r3, s3 = true;
        if (200 === e3.statusCode && (this._additionalReloadRequested || (this.$anon_distinct_id = void 0), s3 = false), this._requestInFlight = false, !n2.disable_flags || this._additionalReloadRequested) {
          this._flagsLoadedFromRemote = !s3;
          var o3 = [];
          e3.error ? e3.error instanceof Error ? o3.push("AbortError" === e3.error.name ? "timeout" : "connection_error") : o3.push("unknown_error") : 200 !== e3.statusCode && o3.push("api_error_" + e3.statusCode), null != (t3 = e3.json) && t3.errorsWhileComputingFlags && o3.push("errors_while_computing_flags");
          var a2, u3 = !(null == (i2 = e3.json) || null == (i2 = i2.quotaLimited) || !i2.includes("feature_flags"));
          if (u3 && o3.push("quota_limited"), null == (r3 = this._persistence) || r3.register({ [B]: o3 }), u3) _a.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.");
          else n2.disable_flags || this.receivedFeatureFlags(null !== (a2 = e3.json) && void 0 !== a2 ? a2 : {}, s3, { partialResponse: l2 }), this._additionalReloadRequested && (this._additionalReloadRequested = false, this._callFlagsEndpoint());
        }
      } });
    }
  }
  getFeatureFlag(e2, t2) {
    var i2;
    if (void 0 === t2 && (t2 = {}), !t2.fresh || this._flagsLoadedFromRemote) if (this._hasLoadedFlags || this.getFlags() && this.getFlags().length > 0) {
      if (!this._checkAndTriggerStaleRefresh()) {
        var r2 = this.getFeatureFlagResult(e2, t2);
        return null !== (i2 = null == r2 ? void 0 : r2.variant) && void 0 !== i2 ? i2 : null == r2 ? void 0 : r2.enabled;
      }
    } else _a.warn('getFeatureFlag for key "' + e2 + pa);
  }
  getFeatureFlagDetails(e2) {
    return this.getFlagsWithDetails()[e2];
  }
  getFeatureFlagPayload(e2) {
    var t2 = this.getFeatureFlagResult(e2, { send_event: false });
    return null == t2 ? void 0 : t2.payload;
  }
  getFeatureFlagResult(e2, t2) {
    if (void 0 === t2 && (t2 = {}), !t2.fresh || this._flagsLoadedFromRemote) if (this._hasLoadedFlags || this.getFlags() && this.getFlags().length > 0) {
      if (!this._checkAndTriggerStaleRefresh()) {
        var i2 = this.getFlagVariants(), r2 = e2 in i2, s2 = i2[e2], n2 = this.getFlagPayloads()[e2], o2 = String(s2), a2 = this._prop(F) || void 0, l2 = this._prop(H) || void 0, u2 = this._prop(q) || {};
        if (this._config.advanced_feature_flags_dedup_per_session) {
          var c2, d2 = this._instance.get_session_id(), _2 = this._prop(z);
          d2 && d2 !== _2 && (u2 = {}, null == (c2 = this._persistence) || c2.register({ [q]: u2, [z]: d2 }));
        }
        if ((t2.send_event || !("send_event" in t2)) && (!(e2 in u2) || !u2[e2].includes(o2))) {
          var h2, p2, g2, v2, f2, m2, y2, b2, w2, E2;
          Be(u2[e2]) ? u2[e2].push(o2) : u2[e2] = [o2], null == (h2 = this._persistence) || h2.register({ [q]: u2 });
          var S2 = this.getFeatureFlagDetails(e2), x2 = [...null !== (p2 = this._prop(B)) && void 0 !== p2 ? p2 : []];
          We(s2) && x2.push("flag_missing");
          var k2 = { $feature_flag: e2, $feature_flag_response: s2, $feature_flag_payload: n2 || null, $feature_flag_request_id: a2, $feature_flag_evaluated_at: l2, $feature_flag_bootstrapped_response: (null == (g2 = this._config.bootstrap) || null == (g2 = g2.featureFlags) ? void 0 : g2[e2]) || null, $feature_flag_bootstrapped_payload: (null == (v2 = this._config.bootstrap) || null == (v2 = v2.featureFlagPayloads) ? void 0 : v2[e2]) || null, $used_bootstrap_value: !this._flagsLoadedFromRemote };
          We(null == S2 || null == (f2 = S2.metadata) ? void 0 : f2.version) || (k2.$feature_flag_version = S2.metadata.version);
          var I2, P2 = null !== (m2 = null == S2 || null == (y2 = S2.reason) ? void 0 : y2.description) && void 0 !== m2 ? m2 : null == S2 || null == (b2 = S2.reason) ? void 0 : b2.code;
          P2 && (k2.$feature_flag_reason = P2), null != S2 && null != (w2 = S2.metadata) && w2.id && (k2.$feature_flag_id = S2.metadata.id), We(null == S2 ? void 0 : S2.original_variant) && We(null == S2 ? void 0 : S2.original_enabled) || (k2.$feature_flag_original_response = We(S2.original_variant) ? S2.original_enabled : S2.original_variant), null != S2 && null != (E2 = S2.metadata) && E2.original_payload && (k2.$feature_flag_original_payload = null == S2 || null == (I2 = S2.metadata) ? void 0 : I2.original_payload), x2.length && (k2.$feature_flag_error = x2.join(",")), this._instance.capture("$feature_flag_called", k2);
        }
        if (r2) {
          var C2 = n2;
          if (!We(n2)) try {
            C2 = JSON.parse(n2);
          } catch (e3) {
          }
          return { key: e2, enabled: !!s2, variant: "string" == typeof s2 ? s2 : void 0, payload: C2 };
        }
      }
    } else _a.warn('getFeatureFlagResult for key "' + e2 + pa);
  }
  getRemoteConfigPayload(e2, t2) {
    var i2 = this._config.token, r2 = { distinct_id: this._instance.get_distinct_id(), token: i2 };
    this._shouldIncludeEvaluationEnvironments() && (r2.evaluation_contexts = this._getValidEvaluationEnvironments());
    var s2 = this._getValidFlagKeys();
    We(s2) || (r2.flag_keys = s2), this._instance._send_request({ method: "POST", url: this._instance.requestRouter.endpointFor("flags", "/flags/?v=2"), data: r2, compression: this._config.disable_compression ? void 0 : bs.Base64, timeout: this._config.feature_flag_request_timeout_ms, callback(i3) {
      var r3, s3 = null == (r3 = i3.json) ? void 0 : r3.featureFlagPayloads;
      t2((null == s3 ? void 0 : s3[e2]) || void 0);
    } });
  }
  isFeatureEnabled(e2, t2) {
    if (void 0 === t2 && (t2 = {}), !t2.fresh || this._flagsLoadedFromRemote) {
      if (this._hasLoadedFlags || this.getFlags() && this.getFlags().length > 0) {
        var i2 = this.getFeatureFlag(e2, t2);
        return We(i2) ? void 0 : !!i2;
      }
      _a.warn('isFeatureEnabled for key "' + e2 + pa);
    }
  }
  addFeatureFlagsHandler(e2) {
    this.featureFlagEventHandlers.push(e2);
  }
  removeFeatureFlagsHandler(e2) {
    this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(((t2) => t2 !== e2));
  }
  receivedFeatureFlags(e2, t2, r2) {
    if (this._persistence) {
      this._hasLoadedFlags = true;
      var s2 = this.getFlagVariants(), n2 = this.getFlagPayloads(), o2 = this.getFlagsWithDetails();
      !(function(e3, t3, r3, s3, n3, o3) {
        void 0 === r3 && (r3 = {}), void 0 === s3 && (s3 = {}), void 0 === n3 && (n3 = {});
        var a2 = ((e4) => {
          var t4 = e4.flags;
          return t4 ? (e4.featureFlags = Object.fromEntries(Object.keys(t4).map(((e5) => {
            var i2;
            return [e5, null !== (i2 = t4[e5].variant) && void 0 !== i2 ? i2 : t4[e5].enabled];
          }))), e4.featureFlagPayloads = Object.fromEntries(Object.keys(t4).filter(((e5) => t4[e5].enabled)).filter(((e5) => {
            var i2;
            return null == (i2 = t4[e5].metadata) ? void 0 : i2.payload;
          })).map(((e5) => {
            var i2;
            return [e5, null == (i2 = t4[e5].metadata) ? void 0 : i2.payload];
          })))) : _a.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), e4;
        })(e3), l2 = a2.flags, u2 = a2.featureFlags, c2 = a2.featureFlagPayloads;
        if (u2) {
          var d2 = e3.requestId, _2 = e3.evaluatedAt;
          if (Be(u2)) {
            _a.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
            var h2 = {};
            if (u2) for (var p2 = 0; u2.length > p2; p2++) h2[u2[p2]] = true;
            t3 && t3.register({ [P]: u2, [I]: h2 });
          } else {
            var g2 = u2, v2 = c2, f2 = l2;
            if (null != o3 && o3.partialResponse) g2 = i({}, r3, g2), v2 = i({}, s3, v2), f2 = i({}, n3, f2);
            else if (e3.errorsWhileComputingFlags) if (l2) {
              var m2 = new Set(Object.keys(l2).filter(((e4) => {
                var t4;
                return !(null != (t4 = l2[e4]) && t4.failed);
              })));
              g2 = i({}, r3, Object.fromEntries(Object.entries(g2).filter(((e4) => {
                var [t4] = e4;
                return m2.has(t4);
              })))), v2 = i({}, s3, Object.fromEntries(Object.entries(v2 || {}).filter(((e4) => {
                var [t4] = e4;
                return m2.has(t4);
              })))), f2 = i({}, n3, Object.fromEntries(Object.entries(f2 || {}).filter(((e4) => {
                var [t4] = e4;
                return m2.has(t4);
              }))));
            } else g2 = i({}, r3, g2), v2 = i({}, s3, v2), f2 = i({}, n3, f2);
            t3 && t3.register(i({ [P]: Object.keys(va(g2)), [I]: g2 || {}, [R]: v2 || {}, [T]: f2 || {} }, d2 ? { [F]: d2 } : {}, _2 ? { [H]: _2 } : {}));
          }
        }
      })(e2, this._persistence, s2, n2, o2, r2), t2 || (this._staleCacheRefreshTriggered = false), this._fireFeatureFlagsCallbacks(t2);
    }
  }
  override(e2, t2) {
    void 0 === t2 && (t2 = false), _a.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({ flags: e2, suppressWarning: t2 });
  }
  overrideFeatureFlags(e2) {
    if (!this._instance.__loaded || !this._persistence) return _a.uninitializedWarning("posthog.featureFlags.overrideFeatureFlags");
    if (false === e2) return this._persistence.unregister(L), this._persistence.unregister(O), this._fireFeatureFlagsCallbacks(), ha.info("All overrides cleared");
    if (Be(e2)) {
      var t2 = ga(e2);
      return this._persistence.register({ [L]: t2 }), this._fireFeatureFlagsCallbacks(), ha.info("Flag overrides set", { flags: e2 });
    }
    if (e2 && "object" == typeof e2 && ("flags" in e2 || "payloads" in e2)) {
      var i2, r2 = e2;
      if (this._override_warning = Boolean(null !== (i2 = r2.suppressWarning) && void 0 !== i2 && i2), "flags" in r2) {
        if (false === r2.flags) this._persistence.unregister(L), ha.info("Flag overrides cleared");
        else if (r2.flags) {
          if (Be(r2.flags)) {
            var s2 = ga(r2.flags);
            this._persistence.register({ [L]: s2 });
          } else this._persistence.register({ [L]: r2.flags });
          ha.info("Flag overrides set", { flags: r2.flags });
        }
      }
      return "payloads" in r2 && (false === r2.payloads ? (this._persistence.unregister(O), ha.info("Payload overrides cleared")) : r2.payloads && (this._persistence.register({ [O]: r2.payloads }), ha.info("Payload overrides set", { payloads: r2.payloads }))), void this._fireFeatureFlagsCallbacks();
    }
    if (e2 && "object" == typeof e2) return this._persistence.register({ [L]: e2 }), this._fireFeatureFlagsCallbacks(), ha.info("Flag overrides set", { flags: e2 });
    _a.warn("Invalid overrideOptions provided to overrideFeatureFlags", { overrideOptions: e2 });
  }
  onFeatureFlags(e2) {
    if (this.addFeatureFlagsHandler(e2), this._hasLoadedFlags) {
      var { flags: t2, flagVariants: i2 } = this._prepareFeatureFlagsForCallbacks();
      e2(t2, i2);
    }
    return () => this.removeFeatureFlagsHandler(e2);
  }
  updateEarlyAccessFeatureEnrollment(e2, t2, r2) {
    var s2, n2 = (this._prop(C) || []).find(((t3) => t3.flagKey === e2)), o2 = { ["$feature_enrollment/" + e2]: t2 }, a2 = { $feature_flag: e2, $feature_enrollment: t2, $set: o2 };
    n2 && (a2.$early_access_feature_name = n2.name), r2 && (a2.$feature_enrollment_stage = r2), this._instance.capture("$feature_enrollment_update", a2), this.setPersonPropertiesForFlags(o2, false);
    var l2 = i({}, this.getFlagVariants(), { [e2]: t2 });
    null == (s2 = this._persistence) || s2.register({ [P]: Object.keys(va(l2)), [I]: l2 }), this._fireFeatureFlagsCallbacks();
  }
  getEarlyAccessFeatures(e2, t2, i2) {
    void 0 === t2 && (t2 = false);
    var r2 = this._prop(C), s2 = i2 ? "&" + i2.map(((e3) => "stage=" + e3)).join("&") : "";
    if (r2 && !t2) return e2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=" + this._config.token + s2), method: "GET", callback: (t3) => {
      var i3, r3;
      if (t3.json) {
        var s3 = t3.json.earlyAccessFeatures;
        return null == (i3 = this._persistence) || i3.unregister(C), null == (r3 = this._persistence) || r3.register({ [C]: s3 }), e2(s3);
      }
    } });
  }
  _prepareFeatureFlagsForCallbacks() {
    var e2 = this.getFlags(), t2 = this.getFlagVariants();
    return { flags: e2.filter(((e3) => t2[e3])), flagVariants: Object.keys(t2).filter(((e3) => t2[e3])).reduce(((e3, i2) => (e3[i2] = t2[i2], e3)), {}) };
  }
  _fireFeatureFlagsCallbacks(e2) {
    var { flags: t2, flagVariants: i2 } = this._prepareFeatureFlagsForCallbacks();
    this.featureFlagEventHandlers.forEach(((r2) => r2(t2, i2, { errorsLoading: e2 })));
  }
  setPersonPropertiesForFlags(e2, t2) {
    void 0 === t2 && (t2 = true);
    var r2 = this._prop(M) || {}, s2 = (null == e2 ? void 0 : e2.$set) || (null != e2 && e2.$set_once ? {} : e2), n2 = null == e2 ? void 0 : e2.$set_once, o2 = {};
    if (n2) for (var a2 in n2) ({}).hasOwnProperty.call(n2, a2) && (a2 in r2 || (o2[a2] = n2[a2]));
    this._instance.register({ [M]: i({}, r2, o2, s2) }), t2 && this._instance.reloadFeatureFlags();
  }
  resetPersonPropertiesForFlags() {
    this._instance.unregister(M);
  }
  setGroupPropertiesForFlags(e2, t2) {
    void 0 === t2 && (t2 = true);
    var r2 = this._prop(A) || {};
    0 !== Object.keys(r2).length && Object.keys(r2).forEach(((t3) => {
      r2[t3] = i({}, r2[t3], e2[t3]), delete e2[t3];
    })), this._instance.register({ [A]: i({}, r2, e2) }), t2 && this._instance.reloadFeatureFlags();
  }
  resetGroupPropertiesForFlags(e2) {
    if (e2) {
      var t2 = this._prop(A) || {};
      this._instance.register({ [A]: i({}, t2, { [e2]: {} }) });
    } else this._instance.unregister(A);
  }
  reset() {
    this._hasLoadedFlags = false, this._requestInFlight = false, this._reloadingDisabled = false, this._additionalReloadRequested = false, this._flagsLoadedFromRemote = false, this.$anon_distinct_id = void 0, this._clearDebouncer(), this._override_warning = false;
  }
} };
var xa = { sessionRecording: class {
  get _config() {
    return this._instance.config;
  }
  get _persistence() {
    return this._instance.persistence;
  }
  get started() {
    var e2;
    return !(null == (e2 = this._lazyLoadedSessionRecording) || !e2.isStarted);
  }
  get status() {
    var e2, t2;
    return this._recordingStatus === Go || this._recordingStatus === Yo ? this._recordingStatus : null !== (e2 = null == (t2 = this._lazyLoadedSessionRecording) ? void 0 : t2.status) && void 0 !== e2 ? e2 : this._recordingStatus;
  }
  constructor(e2) {
    if (this._forceAllowLocalhostNetworkCapture = false, this._recordingStatus = Vo, this._persistFlagsOnSessionListener = void 0, this._instance = e2, !this._instance.sessionManager) throw Jo.error("started without valid sessionManager"), new Error(Ko + " started without valid sessionManager. This is a bug.");
    if (this._config.cookieless_mode === se) throw new Error(Ko + ' cannot be used with cookieless_mode="always"');
  }
  initialize() {
    this.startIfEnabledOrStop();
  }
  get _isRecordingEnabled() {
    var e2, t2 = !(null == (e2 = this._instance.get_property(y)) || !e2.enabled), i2 = !this._config.disable_session_recording, r2 = this._config.disable_session_recording || this._instance.consent.isOptedOut();
    return pe && t2 && i2 && !r2;
  }
  startIfEnabledOrStop(e2) {
    var t2;
    if (!this._isRecordingEnabled || null == (t2 = this._lazyLoadedSessionRecording) || !t2.isStarted) {
      var i2 = !We(Object.assign) && !We(Array.from);
      this._isRecordingEnabled && i2 ? (this._lazyLoadAndStart(e2), Jo.info("starting")) : (this._recordingStatus = Vo, this.stopRecording());
    }
  }
  _lazyLoadAndStart(e2) {
    var t2, i2, r2;
    this._isRecordingEnabled && (this._recordingStatus !== Go && this._recordingStatus !== Yo && (this._recordingStatus = Wo), null != ke && null != (t2 = ke.__PosthogExtensions__) && null != (t2 = t2.rrweb) && t2.record && null != (i2 = ke.__PosthogExtensions__) && i2.initSessionRecording ? this._onScriptLoaded(e2) : null == (r2 = ke.__PosthogExtensions__) || null == r2.loadExternalDependency || r2.loadExternalDependency(this._instance, this._scriptName, ((t3) => {
      if (t3) return Jo.error("could not load recorder", t3);
      this._onScriptLoaded(e2);
    })));
  }
  stopRecording() {
    var e2, t2;
    null == (e2 = this._persistFlagsOnSessionListener) || e2.call(this), this._persistFlagsOnSessionListener = void 0, null == (t2 = this._lazyLoadedSessionRecording) || t2.stop();
  }
  _discardRecording() {
    var e2, t2;
    null == (e2 = this._persistFlagsOnSessionListener) || e2.call(this), this._persistFlagsOnSessionListener = void 0, null == (t2 = this._lazyLoadedSessionRecording) || t2.discard();
  }
  _resetSampling() {
    var e2;
    null == (e2 = this._persistence) || e2.unregister(k);
  }
  _validateSampleRate(e2, t2) {
    if (Je(e2)) return null;
    var i2, r2 = Xe(e2) ? e2 : parseFloat(e2);
    return "number" != typeof (i2 = r2) || !Number.isFinite(i2) || 0 > i2 || i2 > 1 ? (Jo.warn(t2 + " must be between 0 and 1. Ignoring invalid value:", e2), null) : r2;
  }
  _persistRemoteConfig(e2) {
    if (this._persistence) {
      var t2, r2, s2 = this._persistence, n2 = () => {
        var t3, r3 = false === e2.sessionRecording ? void 0 : e2.sessionRecording, n3 = this._validateSampleRate(null == (t3 = this._config.session_recording) ? void 0 : t3.sampleRate, "session_recording.sampleRate"), o2 = this._validateSampleRate(null == r3 ? void 0 : r3.sampleRate, "remote config sampleRate"), a2 = null != n3 ? n3 : o2;
        Je(a2) && this._resetSampling();
        var l2 = null == r3 ? void 0 : r3.minimumDurationMilliseconds;
        s2.register({ [y]: i({ cache_timestamp: Date.now(), enabled: !!r3 }, r3, { networkPayloadCapture: i({ capturePerformance: e2.capturePerformance }, null == r3 ? void 0 : r3.networkPayloadCapture), canvasRecording: { enabled: null == r3 ? void 0 : r3.recordCanvas, fps: null == r3 ? void 0 : r3.canvasFps, quality: null == r3 ? void 0 : r3.canvasQuality }, sampleRate: a2, minimumDurationMilliseconds: We(l2) ? null : l2, endpoint: null == r3 ? void 0 : r3.endpoint, triggerMatchType: null == r3 ? void 0 : r3.triggerMatchType, masking: null == r3 ? void 0 : r3.masking, urlTriggers: null == r3 ? void 0 : r3.urlTriggers, version: null == r3 ? void 0 : r3.version, triggerGroups: null == r3 ? void 0 : r3.triggerGroups }) });
      };
      n2(), null == (t2 = this._persistFlagsOnSessionListener) || t2.call(this), this._persistFlagsOnSessionListener = null == (r2 = this._instance.sessionManager) ? void 0 : r2.onSessionId(n2);
    }
  }
  onRemoteConfig(e2) {
    return "sessionRecording" in e2 ? false === e2.sessionRecording ? (this._persistRemoteConfig(e2), void this._discardRecording()) : (this._persistRemoteConfig(e2), void this.startIfEnabledOrStop()) : (this._recordingStatus === Go && (this._recordingStatus = Yo, Jo.warn("config refresh failed, recording will not start until page reload")), void this.startIfEnabledOrStop());
  }
  log(e2, t2) {
    var i2;
    void 0 === t2 && (t2 = "log"), null != (i2 = this._lazyLoadedSessionRecording) && i2.log ? this._lazyLoadedSessionRecording.log(e2, t2) : Jo.warn("log called before recorder was ready");
  }
  get _scriptName() {
    var e2, t2, i2 = null == (e2 = this._instance) || null == (e2 = e2.persistence) ? void 0 : e2.get_property(y);
    return (null == i2 || null == (t2 = i2.scriptConfig) ? void 0 : t2.script) || "lazy-recorder";
  }
  _isRemoteConfigFresh() {
    var e2, t2, i2 = this._instance.get_property(y);
    if (!i2) return false;
    try {
      t2 = "object" == typeof i2 ? i2 : JSON.parse(i2);
    } catch (e3) {
      return Jo.warn("persisted remote config for session recording is invalid and will be ignored", e3), false;
    }
    var r2 = null !== (e2 = t2.cache_timestamp) && void 0 !== e2 ? e2 : Date.now();
    return 36e5 >= Date.now() - r2;
  }
  _onScriptLoaded(e2) {
    var t2, i2;
    if (null == (t2 = ke.__PosthogExtensions__) || !t2.initSessionRecording) return Jo.warn("Called on script loaded before session recording is available. This can be caused by adblockers."), void this._instance.register_for_session({ [te]: true });
    if (this._lazyLoadedSessionRecording || (this._lazyLoadedSessionRecording = null == (i2 = ke.__PosthogExtensions__) ? void 0 : i2.initSessionRecording(this._instance), this._lazyLoadedSessionRecording._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture), !this._isRemoteConfigFresh()) {
      if (this._recordingStatus === Yo || this._recordingStatus === Go) return;
      return this._recordingStatus = Go, Jo.info("persisted remote config is stale, requesting fresh config before starting"), void new ms(this._instance).load();
    }
    this._recordingStatus = Wo, this._lazyLoadedSessionRecording.start(e2);
  }
  onRRwebEmit(e2) {
    var t2;
    null == (t2 = this._lazyLoadedSessionRecording) || null == t2.onRRwebEmit || t2.onRRwebEmit(e2);
  }
  overrideLinkedFlag() {
    var e2, t2;
    this._lazyLoadedSessionRecording || null == (t2 = this._persistence) || t2.register({ [w]: true }), null == (e2 = this._lazyLoadedSessionRecording) || e2.overrideLinkedFlag();
  }
  overrideSampling() {
    var e2, t2;
    this._lazyLoadedSessionRecording || null == (t2 = this._persistence) || t2.register({ [b]: true }), null == (e2 = this._lazyLoadedSessionRecording) || e2.overrideSampling();
  }
  overrideTrigger(e2) {
    var t2, i2;
    this._lazyLoadedSessionRecording || null == (i2 = this._persistence) || i2.register({ ["url" === e2 ? E : S]: true }), null == (t2 = this._lazyLoadedSessionRecording) || t2.overrideTrigger(e2);
  }
  get sdkDebugProperties() {
    var e2;
    return (null == (e2 = this._lazyLoadedSessionRecording) ? void 0 : e2.sdkDebugProperties) || { $recording_status: this.status };
  }
  tryAddCustomEvent(e2, t2) {
    var i2;
    return !(null == (i2 = this._lazyLoadedSessionRecording) || !i2.tryAddCustomEvent(e2, t2));
  }
} };
var ka = { autocapture: class {
  constructor(e2) {
    this._initialized = false, this._isDisabledServerSide = null, this._elementsChainAsString = false, this.instance = e2, this.rageclicks = new Oo(e2.config.rageclick), this._elementSelectors = null;
  }
  initialize() {
    this.startIfEnabled();
  }
  get _config() {
    var e2, t2, i2 = je(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
    return i2.url_allowlist = null == (e2 = i2.url_allowlist) ? void 0 : e2.map(((e3) => new RegExp(e3))), i2.url_ignorelist = null == (t2 = i2.url_ignorelist) ? void 0 : t2.map(((e3) => new RegExp(e3))), i2;
  }
  _addDomEventHandlers() {
    if (this.isBrowserSupported()) {
      if (pe && me) {
        var e2 = (e3) => {
          e3 = e3 || (null == pe ? void 0 : pe.event);
          try {
            this._captureEvent(e3);
          } catch (e4) {
            Ao.error("Failed to capture event", e4);
          }
        };
        if (rr(me, "submit", e2, { capture: true }), rr(me, "change", e2, { capture: true }), rr(me, "click", e2, { capture: true }), this._config.capture_copied_text) {
          var t2 = (e3) => {
            e3 = e3 || (null == pe ? void 0 : pe.event);
            try {
              this._captureEvent(e3, Mo);
            } catch (e4) {
              Ao.error("Failed to capture copy/cut event", e4);
            }
          };
          rr(me, "copy", t2, { capture: true }), rr(me, "cut", t2, { capture: true });
        }
      }
    } else Ao.info("Disabling Automatic Event Collection because this browser is not supported");
  }
  startIfEnabled() {
    this.isEnabled && !this._initialized && (this._addDomEventHandlers(), this._initialized = true);
  }
  onRemoteConfig(e2) {
    e2.elementsChainAsString && (this._elementsChainAsString = e2.elementsChainAsString), this.instance.persistence && this.instance.persistence.register({ [c]: !!e2.autocapture_opt_out }), this._isDisabledServerSide = !!e2.autocapture_opt_out, this.startIfEnabled();
  }
  setElementSelectors(e2) {
    this._elementSelectors = e2;
  }
  getElementSelectors(e2) {
    var t2, i2 = [];
    return null == (t2 = this._elementSelectors) || t2.forEach(((t3) => {
      var r2 = null == me ? void 0 : me.querySelectorAll(t3);
      null == r2 || r2.forEach(((r3) => {
        e2 === r3 && i2.push(t3);
      }));
    })), i2;
  }
  get isEnabled() {
    var e2, t2, i2 = null == (e2 = this.instance.persistence) ? void 0 : e2.props[c];
    if (Ke(this._isDisabledServerSide) && !Ze(i2) && !this.instance._shouldDisableFlags()) return false;
    var r2 = null !== (t2 = this._isDisabledServerSide) && void 0 !== t2 ? t2 : !!i2;
    return !!this.instance.config.autocapture && !r2;
  }
  _captureEvent(e2, t2) {
    if (void 0 === t2 && (t2 = "$autocapture"), this.isEnabled) {
      var i2, r2 = ho(e2);
      no(r2) && (r2 = r2.parentNode || null), "$autocapture" === t2 && "click" === e2.type && e2 instanceof MouseEvent && this.instance.config.rageclick && null != (i2 = this.rageclicks) && i2.isRageClick(e2.clientX, e2.clientY, e2.timeStamp || (/* @__PURE__ */ new Date()).getTime()) && (function(e3, t3) {
        if (!pe || yo(e3)) return false;
        var i3, r3, s3;
        if (Ze(t3) ? (i3 = !!t3 && mo, r3 = void 0) : (i3 = null !== (s3 = null == t3 ? void 0 : t3.css_selector_ignorelist) && void 0 !== s3 ? s3 : mo, r3 = null == t3 ? void 0 : t3.content_ignorelist), false === i3) return false;
        var { targetElementList: n3 } = bo(e3, false);
        return !(function(e4, t4) {
          if (false === e4 || We(e4)) return false;
          var i4;
          if (true === e4) i4 = fo;
          else {
            if (!Be(e4)) return false;
            if (e4.length > 10) return Wi.error("[PostHog] content_ignorelist array cannot exceed 10 items. Use css_selector_ignorelist for more complex matching."), false;
            i4 = e4.map(((e5) => e5.toLowerCase()));
          }
          return t4.some(((e5) => {
            var { safeText: t5, ariaLabel: r4 } = e5;
            return i4.some(((e6) => t5.includes(e6) || r4.includes(e6)));
          }));
        })(r3, n3.map(((e4) => {
          var t4;
          return { safeText: _o(e4).toLowerCase(), ariaLabel: (null == (t4 = e4.getAttribute("aria-label")) ? void 0 : t4.toLowerCase().trim()) || "" };
        }))) && !go(n3, i3);
      })(r2, this.instance.config.rageclick) && this._captureEvent(e2, "$rageclick");
      var s2 = t2 === Mo;
      if (r2 && (function(e3, t3, i3, r3, s3) {
        var n3, o3, a3, l3;
        if (void 0 === i3 && (i3 = void 0), !pe || yo(e3)) return false;
        if (null != (n3 = i3) && n3.url_allowlist && !lo(i3.url_allowlist)) return false;
        if (null != (o3 = i3) && o3.url_ignorelist && lo(i3.url_ignorelist)) return false;
        if (null != (a3 = i3) && a3.dom_event_allowlist) {
          var u3 = i3.dom_event_allowlist;
          if (u3 && !u3.some(((e4) => t3.type === e4))) return false;
        }
        var { parentIsUsefulElement: c3, targetElementList: d2 } = bo(e3, r3);
        if (!(function(e4, t4) {
          var i4 = null == t4 ? void 0 : t4.element_allowlist;
          if (We(i4)) return true;
          var r4, s4 = function(e5) {
            if (i4.some(((t5) => e5.tagName.toLowerCase() === t5))) return { v: true };
          };
          for (var n4 of e4) if (r4 = s4(n4)) return r4.v;
          return false;
        })(d2, i3)) return false;
        if (!go(d2, null == (l3 = i3) ? void 0 : l3.css_selector_allowlist)) return false;
        var _2 = pe.getComputedStyle(e3);
        if (_2 && "pointer" === _2.getPropertyValue("cursor") && "click" === t3.type) return true;
        var h2 = e3.tagName.toLowerCase();
        switch (h2) {
          case "html":
            return false;
          case "form":
            return (s3 || ["submit"]).indexOf(t3.type) >= 0;
          case "input":
          case "select":
          case "textarea":
            return (s3 || ["change", "click"]).indexOf(t3.type) >= 0;
          default:
            return c3 ? (s3 || ["click"]).indexOf(t3.type) >= 0 : (s3 || ["click"]).indexOf(t3.type) >= 0 && (po.indexOf(h2) > -1 || "true" === e3.getAttribute("contenteditable"));
        }
      })(r2, e2, this._config, s2, s2 ? ["copy", "cut"] : void 0)) {
        var { props: n2, explicitNoCapture: o2 } = Uo(r2, { e: e2, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this._config.element_attribute_ignorelist, elementsChainAsString: this._elementsChainAsString });
        if (o2) return false;
        var a2 = this.getElementSelectors(r2);
        if (a2 && a2.length > 0 && (n2.$element_selectors = a2), t2 === Mo) {
          var l2, u2 = co(null == pe || null == (l2 = pe.getSelection()) ? void 0 : l2.toString()), c2 = e2.type || "clipboard";
          if (!u2) return false;
          n2.$selected_content = u2, n2.$copy_type = c2;
        }
        return this.instance.capture(t2, n2), true;
      }
    }
  }
  isBrowserSupported() {
    return He(null == me ? void 0 : me.querySelectorAll);
  }
}, historyAutocapture: class {
  constructor(e2) {
    var t2;
    this._instance = e2, this._lastPathname = (null == pe || null == (t2 = pe.location) ? void 0 : t2.pathname) || "";
  }
  initialize() {
    this.startIfEnabled();
  }
  get isEnabled() {
    return "history_change" === this._instance.config.capture_pageview;
  }
  startIfEnabled() {
    this.isEnabled && (Wi.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges());
  }
  stop() {
    this._popstateListener && this._popstateListener(), this._popstateListener = void 0, Wi.info("History API monitoring stopped");
  }
  monitorHistoryChanges() {
    var e2, t2;
    if (pe && pe.history) {
      var i2 = this;
      null != (e2 = pe.history.pushState) && e2.__posthog_wrapped__ || zo(pe.history, "pushState", ((e3) => function(t3, r2, s2) {
        e3.call(this, t3, r2, s2), i2._capturePageview("pushState");
      })), null != (t2 = pe.history.replaceState) && t2.__posthog_wrapped__ || zo(pe.history, "replaceState", ((e3) => function(t3, r2, s2) {
        e3.call(this, t3, r2, s2), i2._capturePageview("replaceState");
      })), this._setupPopstateListener();
    }
  }
  _capturePageview(e2) {
    try {
      var t2, i2 = null == pe || null == (t2 = pe.location) ? void 0 : t2.pathname;
      if (!i2) return;
      i2 !== this._lastPathname && this.isEnabled && this._instance.capture(ce, { navigation_type: e2 }), this._lastPathname = i2;
    } catch (t3) {
      Wi.error("Error capturing " + e2 + " pageview", t3);
    }
  }
  _setupPopstateListener() {
    if (!this._popstateListener) {
      var e2 = () => {
        this._capturePageview("popstate");
      };
      rr(pe, "popstate", e2), this._popstateListener = () => {
        pe && pe.removeEventListener("popstate", e2);
      };
    }
  }
}, heatmaps: class {
  get _config() {
    return this.instance.config;
  }
  constructor(e2) {
    var t2;
    this._enabledServerSide = false, this._initialized = false, this._flushInterval = null, this.instance = e2, this._enabledServerSide = !(null == (t2 = this.instance.persistence) || !t2.props[d]), this.rageclicks = new Oo(e2.config.rageclick);
  }
  initialize() {
    this.startIfEnabled();
  }
  get flushIntervalMilliseconds() {
    var e2 = 5e3;
    return je(this._config.capture_heatmaps) && this._config.capture_heatmaps.flush_interval_milliseconds && (e2 = this._config.capture_heatmaps.flush_interval_milliseconds), e2;
  }
  get isEnabled() {
    return Je(this._config.capture_heatmaps) ? Je(this._config.enable_heatmaps) ? this._enabledServerSide : this._config.enable_heatmaps : false !== this._config.capture_heatmaps;
  }
  startIfEnabled() {
    if (this.isEnabled) {
      if (this._initialized) return;
      Xo.info("starting..."), this._setupListeners(), this._onVisibilityChange();
    } else {
      var e2;
      clearInterval(null !== (e2 = this._flushInterval) && void 0 !== e2 ? e2 : void 0), this._removeListeners(), this.getAndClearBuffer();
    }
  }
  onRemoteConfig(e2) {
    if ("heatmaps" in e2) {
      var t2 = !!e2.heatmaps;
      this.instance.persistence && this.instance.persistence.register({ [d]: t2 }), this._enabledServerSide = t2, this.startIfEnabled();
    }
  }
  getAndClearBuffer() {
    var e2 = this._buffer;
    return this._buffer = void 0, e2;
  }
  _onDeadClick(e2) {
    this._onClick(e2.originalEvent, "deadclick");
  }
  _onVisibilityChange() {
    this._flushInterval && clearInterval(this._flushInterval), this._flushInterval = "visible" === (null == me ? void 0 : me.visibilityState) ? setInterval(this._flush.bind(this), this.flushIntervalMilliseconds) : null;
  }
  _setupListeners() {
    pe && me && (this._flushHandler = this._flush.bind(this), rr(pe, ue, this._flushHandler), this._onClickHandler = (e2) => this._onClick(e2 || (null == pe ? void 0 : pe.event)), rr(me, "click", this._onClickHandler, { capture: true }), this._onMouseMoveHandler = (e2) => this._onMouseMove(e2 || (null == pe ? void 0 : pe.event)), rr(me, "mousemove", this._onMouseMoveHandler, { capture: true }), this._deadClicksCapture = new Ir(this.instance, xr, this._onDeadClick.bind(this)), this._deadClicksCapture.startIfEnabledOrStop(), this._onVisibilityChange_handler = this._onVisibilityChange.bind(this), rr(me, le, this._onVisibilityChange_handler), this._initialized = true);
  }
  _removeListeners() {
    var e2;
    pe && me && (this._flushHandler && pe.removeEventListener(ue, this._flushHandler), this._onClickHandler && me.removeEventListener("click", this._onClickHandler, { capture: true }), this._onMouseMoveHandler && me.removeEventListener("mousemove", this._onMouseMoveHandler, { capture: true }), this._onVisibilityChange_handler && me.removeEventListener(le, this._onVisibilityChange_handler), clearTimeout(this._mouseMoveTimeout), null == (e2 = this._deadClicksCapture) || e2.stop(), this._initialized = false);
  }
  _getProperties(e2, t2) {
    var i2 = this.instance.scrollManager.scrollY(), r2 = this.instance.scrollManager.scrollX(), s2 = this.instance.scrollManager.scrollElement(), n2 = (function(e3, t3, i3) {
      for (var r3 = e3; r3 && ro(r3) && !so(r3, "body"); ) {
        if (r3 === i3) return false;
        if (Ae(t3, null == pe ? void 0 : pe.getComputedStyle(r3).position)) return true;
        r3 = vo(r3);
      }
      return false;
    })(ho(e2), ["fixed", "sticky"], s2);
    return { x: e2.clientX + (n2 ? 0 : r2), y: e2.clientY + (n2 ? 0 : i2), target_fixed: n2, type: t2 };
  }
  _onClick(e2, t2) {
    var r2;
    if (void 0 === t2 && (t2 = "click"), !io(e2.target) && Qo(e2)) {
      var s2 = this._getProperties(e2, t2);
      null != (r2 = this.rageclicks) && r2.isRageClick(e2.clientX, e2.clientY, (/* @__PURE__ */ new Date()).getTime()) && this._capture(i({}, s2, { type: "rageclick" })), this._capture(s2);
    }
  }
  _onMouseMove(e2) {
    !io(e2.target) && Qo(e2) && (clearTimeout(this._mouseMoveTimeout), this._mouseMoveTimeout = setTimeout((() => {
      this._capture(this._getProperties(e2, "mousemove"));
    }), 500));
  }
  _capture(e2) {
    if (pe) {
      var t2 = pe.location.href, i2 = this._config.custom_personal_data_properties, r2 = this._config.mask_personal_data_properties ? [...Ur, ...i2 || []] : [], s2 = Ar(t2, r2, zr);
      this._buffer = this._buffer || {}, this._buffer[s2] || (this._buffer[s2] = []), this._buffer[s2].push(e2);
    }
  }
  _flush() {
    this._buffer && !Ve(this._buffer) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
  }
}, deadClicksAutocapture: Ir, webVitalsAutocapture: class {
  constructor(e2) {
    var t2;
    this._enabledServerSide = false, this._initialized = false, this._buffer = { url: void 0, metrics: [], firstMetricTimestamp: void 0 }, this._flushToCapture = () => {
      clearTimeout(this._delayedFlushTimer), 0 !== this._buffer.metrics.length && (this._instance.capture("$web_vitals", this._buffer.metrics.reduce(((e3, t3) => i({}, e3, { ["$web_vitals_" + t3.name + "_event"]: i({}, t3), ["$web_vitals_" + t3.name + "_value"]: t3.value })), {})), this._buffer = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
    }, this._addToBuffer = (e3) => {
      var t3;
      this._buffer = this._buffer || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
      var r2 = this._currentURL();
      if (!We(r2)) if (Je(null == e3 ? void 0 : e3.name) || Je(null == e3 ? void 0 : e3.value)) Ho.error("Invalid metric received", e3);
      else if (!this._maxAllowedValue || this._maxAllowedValue > e3.value) {
        this._buffer.url !== r2 && (this._flushToCapture(), this._delayedFlushTimer = setTimeout(this._flushToCapture, this.flushToCaptureTimeoutMs)), We(this._buffer.url) && (this._buffer.url = r2), this._buffer.firstMetricTimestamp = We(this._buffer.firstMetricTimestamp) ? Date.now() : this._buffer.firstMetricTimestamp, e3.attribution && e3.attribution.interactionTargetElement && (e3.attribution.interactionTargetElement = void 0);
        var s2 = null == (t3 = this._instance.sessionManager) ? void 0 : t3.checkAndGetSessionAndWindowId(true), n2 = i({}, e3, { $current_url: r2, timestamp: Date.now() });
        We(s2) || (n2.$session_id = s2.sessionId, n2.$window_id = s2.windowId), this._buffer.metrics.push(n2), this._buffer.metrics.length === this.allowedMetrics.length && this._flushToCapture();
      } else Ho.error("Ignoring metric with value >= " + this._maxAllowedValue, e3);
    }, this._startCapturing = () => {
      if (!this._initialized) {
        var e3, t3, i2, r2, s2 = ke.__PosthogExtensions__;
        We(s2) || We(s2.postHogWebVitalsCallbacks) || ({ onLCP: e3, onCLS: t3, onFCP: i2, onINP: r2 } = s2.postHogWebVitalsCallbacks), e3 && t3 && i2 && r2 ? (this.allowedMetrics.indexOf("LCP") > -1 && e3(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && t3(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && i2(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r2(this._addToBuffer.bind(this)), this._initialized = true) : Ho.error("web vitals callbacks not loaded - not starting");
      }
    }, this._instance = e2, this._enabledServerSide = !(null == (t2 = this._instance.persistence) || !t2.props[g]), this.startIfEnabled();
  }
  get _perfConfig() {
    return this._instance.config.capture_performance;
  }
  get allowedMetrics() {
    var e2, t2, i2 = je(this._perfConfig) ? null == (e2 = this._perfConfig) ? void 0 : e2.web_vitals_allowed_metrics : void 0;
    return Je(i2) ? (null == (t2 = this._instance.persistence) ? void 0 : t2.props[m]) || ["CLS", "FCP", "INP", "LCP"] : i2;
  }
  get flushToCaptureTimeoutMs() {
    return (je(this._perfConfig) ? this._perfConfig.web_vitals_delayed_flush_ms : void 0) || 5e3;
  }
  get useAttribution() {
    var e2 = je(this._perfConfig) ? this._perfConfig.web_vitals_attribution : void 0;
    return null != e2 && e2;
  }
  get _maxAllowedValue() {
    var e2 = je(this._perfConfig) && Xe(this._perfConfig.__web_vitals_max_value) ? this._perfConfig.__web_vitals_max_value : jo;
    return e2 > 0 && 6e4 >= e2 ? jo : e2;
  }
  get isEnabled() {
    var e2 = null == ye ? void 0 : ye.protocol;
    if ("http:" !== e2 && "https:" !== e2) return Ho.info("Web Vitals are disabled on non-http/https protocols"), false;
    var t2 = je(this._perfConfig) ? this._perfConfig.web_vitals : Ze(this._perfConfig) ? this._perfConfig : void 0;
    return Ze(t2) ? t2 : this._enabledServerSide;
  }
  startIfEnabled() {
    this.isEnabled && !this._initialized && (Ho.info("enabled, starting..."), this._loadScript(this._startCapturing));
  }
  onRemoteConfig(e2) {
    if ("capturePerformance" in e2) {
      var t2 = je(e2.capturePerformance) && !!e2.capturePerformance.web_vitals, i2 = je(e2.capturePerformance) ? e2.capturePerformance.web_vitals_allowed_metrics : void 0;
      this._instance.persistence && (this._instance.persistence.register({ [g]: t2 }), this._instance.persistence.register({ [m]: i2 })), this._enabledServerSide = t2, this.startIfEnabled();
    }
  }
  _loadScript(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.postHogWebVitalsCallbacks ? e2() : null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, this.useAttribution ? "web-vitals-with-attribution" : "web-vitals", ((t3) => {
      t3 ? Ho.error("failed to load script", t3) : e2();
    }));
  }
  _currentURL() {
    var e2 = pe ? pe.location.href : void 0;
    if (e2) {
      var t2 = this._instance.config.custom_personal_data_properties, i2 = this._instance.config.mask_personal_data_properties ? [...Ur, ...t2 || []] : [];
      return Ar(e2, i2, zr);
    }
    Ho.error("Could not determine current URL");
  }
} };
var Ia = { exceptionObserver: class {
  constructor(e2) {
    var t2, i2, r2;
    this._startCapturing = () => {
      var e3;
      if (pe && this.isEnabled && null != (e3 = ke.__PosthogExtensions__) && e3.errorWrappingFunctions) {
        var t3 = ke.__PosthogExtensions__.errorWrappingFunctions.wrapOnError, i3 = ke.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection, r3 = ke.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
        try {
          !this._unwrapOnError && this._config.capture_unhandled_errors && (this._unwrapOnError = t3(this.captureException.bind(this))), !this._unwrapUnhandledRejection && this._config.capture_unhandled_rejections && (this._unwrapUnhandledRejection = i3(this.captureException.bind(this))), !this._unwrapConsoleError && this._config.capture_console_errors && (this._unwrapConsoleError = r3(this.captureException.bind(this)));
        } catch (e4) {
          qo.error("failed to start", e4), this._stopCapturing();
        }
      }
    }, this._instance = e2, this._remoteEnabled = !(null == (t2 = this._instance.persistence) || !t2.props[_]), this._rateLimiter = new ut({ refillRate: null !== (i2 = this._instance.config.error_tracking.__exceptionRateLimiterRefillRate) && void 0 !== i2 ? i2 : 1, bucketSize: null !== (r2 = this._instance.config.error_tracking.__exceptionRateLimiterBucketSize) && void 0 !== r2 ? r2 : 10, refillInterval: 1e4, _logger: qo }), this._config = this._requiredConfig(), this.startIfEnabledOrStop();
  }
  _requiredConfig() {
    var e2 = this._instance.config.capture_exceptions, t2 = { capture_unhandled_errors: false, capture_unhandled_rejections: false, capture_console_errors: false };
    return je(e2) ? t2 = i({}, t2, e2) : (We(e2) ? this._remoteEnabled : e2) && (t2 = i({}, t2, { capture_unhandled_errors: true, capture_unhandled_rejections: true })), t2;
  }
  get isEnabled() {
    return this._config.capture_console_errors || this._config.capture_unhandled_errors || this._config.capture_unhandled_rejections;
  }
  startIfEnabledOrStop() {
    this.isEnabled ? (qo.info("enabled"), this._stopCapturing(), this._loadScript(this._startCapturing)) : this._stopCapturing();
  }
  _loadScript(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.errorWrappingFunctions && e2(), null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "exception-autocapture", ((t3) => {
      if (t3) return qo.error("failed to load script", t3);
      e2();
    }));
  }
  _stopCapturing() {
    var e2, t2, i2;
    null == (e2 = this._unwrapOnError) || e2.call(this), this._unwrapOnError = void 0, null == (t2 = this._unwrapUnhandledRejection) || t2.call(this), this._unwrapUnhandledRejection = void 0, null == (i2 = this._unwrapConsoleError) || i2.call(this), this._unwrapConsoleError = void 0;
  }
  onRemoteConfig(e2) {
    "autocaptureExceptions" in e2 && (this._remoteEnabled = !!e2.autocaptureExceptions || false, this._instance.persistence && this._instance.persistence.register({ [_]: this._remoteEnabled }), this._config = this._requiredConfig(), this.startIfEnabledOrStop());
  }
  onConfigChange() {
    this._config = this._requiredConfig();
  }
  captureException(e2) {
    var t2, i2, r2, s2 = null !== (t2 = null == e2 || null == (i2 = e2.$exception_list) || null == (i2 = i2[0]) ? void 0 : i2.type) && void 0 !== t2 ? t2 : "Exception";
    this._rateLimiter.consumeRateLimit(s2) ? qo.info("Skipping exception capture because of client rate limiting.", { exception: s2 }) : null == (r2 = this._instance.exceptions) || r2.sendExceptionEvent(e2);
  }
}, exceptions: class {
  constructor(e2) {
    var t2, r2;
    this._suppressionRules = [], this._errorPropertiesBuilder = new gi([new Pi(), new Di(), new Ti(), new Ci(), new Mi(), new Oi(), new Fi(), new Ai()], (function(e3) {
      for (var t3 = arguments.length, r3 = new Array(t3 > 1 ? t3 - 1 : 0), s2 = 1; t3 > s2; s2++) r3[s2 - 1] = arguments[s2];
      return function(t4, s3) {
        void 0 === s3 && (s3 = 0);
        for (var n2 = [], o2 = t4.split("\n"), a2 = s3; o2.length > a2; a2++) {
          var l2 = o2[a2];
          if (1024 >= l2.length) {
            var u2 = Ii.test(l2) ? l2.replace(Ii, "$1") : l2;
            if (!u2.match(/\S*Error: /)) {
              for (var c2 of r3) {
                var d2 = c2(u2, e3);
                if (d2) {
                  n2.push(d2);
                  break;
                }
              }
              if (n2.length >= 50) break;
            }
          }
        }
        return (function(e4) {
          if (!e4.length) return [];
          var t5 = Array.from(e4);
          return t5.reverse(), t5.slice(0, 50).map(((e5) => {
            return i({}, e5, { filename: e5.filename || (r4 = t5, r4[r4.length - 1] || {}).filename, function: e5.function || vi });
            var r4;
          }));
        })(n2);
      };
    })("web:javascript", Ei, ki)), this._instance = e2, this._suppressionRules = null !== (t2 = null == (r2 = this._instance.persistence) ? void 0 : r2.get_property(h)) && void 0 !== t2 ? t2 : [], this._exceptionStepsConfig = Bi(this._getExceptionStepsConfig()), this._exceptionStepsBuffer = new Hi(this._exceptionStepsConfig);
  }
  onConfigChange() {
    this._exceptionStepsConfig = Bi(this._getExceptionStepsConfig()), this._exceptionStepsBuffer.setConfig(this._exceptionStepsConfig);
  }
  onRemoteConfig(e2) {
    var t2, i2, r2;
    if ("errorTracking" in e2) {
      var s2 = null !== (t2 = null == (i2 = e2.errorTracking) ? void 0 : i2.suppressionRules) && void 0 !== t2 ? t2 : [], n2 = null == (r2 = e2.errorTracking) ? void 0 : r2.captureExtensionExceptions;
      this._suppressionRules = s2, this._instance.persistence && this._instance.persistence.register({ [h]: this._suppressionRules, [p]: n2 });
    }
  }
  get _captureExtensionExceptions() {
    var e2, t2 = !!this._instance.get_property(p), i2 = this._instance.config.error_tracking.captureExtensionExceptions;
    return null !== (e2 = null != i2 ? i2 : t2) && void 0 !== e2 && e2;
  }
  buildProperties(e2, t2) {
    return this._errorPropertiesBuilder.buildFromUnknown(e2, { syntheticException: null == t2 ? void 0 : t2.syntheticException, mechanism: { handled: null == t2 ? void 0 : t2.handled } });
  }
  addExceptionStep(e2, t2) {
    if (this._exceptionStepsConfig.enabled) try {
      if (!Ge(e2) || 0 === e2.trim().length) return void fa.warn("Ignoring exception step because message must be a non-empty string");
      var r2 = this._coerceExceptionStepProperties(t2), { sanitizedProperties: s2, droppedKeys: n2 } = (function(e3) {
        if (!e3) return { sanitizedProperties: {}, droppedKeys: [] };
        var t3 = [];
        return { sanitizedProperties: Object.keys(e3).reduce(((i2, r3) => qi.has(r3) ? (t3.push(r3), i2) : (i2[r3] = e3[r3], i2)), {}), droppedKeys: t3 };
      })(r2);
      n2.length > 0 && fa.warn("Ignoring reserved exception step fields", { droppedKeys: n2 }), this._exceptionStepsBuffer.add(i({ [Ni]: e2, [Ui]: (/* @__PURE__ */ new Date()).toISOString() }, s2));
    } catch (e3) {
      fa.error("Failed to add exception step. Ignoring breadcrumb.", e3);
    }
  }
  sendExceptionEvent(e2) {
    try {
      var t2 = e2.$exception_list;
      if (this._isExceptionList(t2)) {
        if (this._matchesSuppressionRule(t2)) return this._addDroppedExceptionStep("Exception dropped: matched a suppression rule"), void fa.info("Skipping exception capture because a suppression rule matched");
        if (!this._captureExtensionExceptions && this._isExtensionException(t2)) return this._addDroppedExceptionStep("Exception dropped: thrown by a browser extension"), void fa.info("Skipping exception capture because it was thrown by an extension");
        if (!this._instance.config.error_tracking.__capturePostHogExceptions && this._isPostHogException(t2)) return this._addDroppedExceptionStep("Exception dropped: thrown by the PostHog SDK"), void fa.info("Skipping exception capture because it was thrown by the PostHog SDK");
      }
      var i2 = this._exceptionStepsConfig.enabled && Je(e2.$exception_steps) ? this._addBufferedExceptionSteps(e2) : e2;
      try {
        var r2 = this._instance.capture("$exception", i2, { _noTruncate: true, _batchKey: "exceptionEvent", _originatedFromCaptureException: true });
        return r2 && this._exceptionStepsBuffer.clear(), r2;
      } catch (e3) {
        return fa.error("Failed to capture exception event. Dropping this exception.", e3), void this._exceptionStepsBuffer.clear();
      }
    } catch (e3) {
      return void fa.error("Failed to process exception event. Ignoring this exception.", e3);
    }
  }
  _addBufferedExceptionSteps(e2) {
    try {
      var t2 = this._exceptionStepsBuffer.getAttachable();
      return 0 === t2.length ? e2 : i({}, e2, { $exception_steps: t2 });
    } catch (t3) {
      return fa.error("Failed to read buffered exception steps. Capturing exception without steps.", t3), e2;
    }
  }
  _addDroppedExceptionStep(e2) {
    this._exceptionStepsConfig.enabled && this._exceptionStepsBuffer.add({ [Ni]: e2, [Ui]: (/* @__PURE__ */ new Date()).toISOString() });
  }
  _coerceExceptionStepProperties(e2) {
    return je(e2) ? i({}, e2) : {};
  }
  _getExceptionStepsConfig() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this._instance.config.error_tracking) ? void 0 : t2.exception_steps) && void 0 !== e2 ? e2 : {};
  }
  _matchesSuppressionRule(e2) {
    if (0 === e2.length) return false;
    var t2 = e2.reduce(((e3, t3) => {
      var { type: i2, value: r2 } = t3;
      return Ge(i2) && i2.length > 0 && e3.$exception_types.push(i2), Ge(r2) && r2.length > 0 && e3.$exception_values.push(r2), e3;
    }), { $exception_types: [], $exception_values: [] });
    return this._suppressionRules.some(((e3) => {
      var i2 = e3.values.map(((e4) => {
        var i3, r2 = xn[e4.operator], s2 = Be(e4.value) ? e4.value : [e4.value], n2 = null !== (i3 = t2[e4.key]) && void 0 !== i3 ? i3 : [];
        return s2.length > 0 && r2(s2, n2);
      }));
      return "OR" === e3.type ? i2.some(Boolean) : i2.every(Boolean);
    }));
  }
  _isExtensionException(e2) {
    return e2.flatMap(((e3) => {
      var t2, i2;
      return null !== (t2 = null == (i2 = e3.stacktrace) ? void 0 : i2.frames) && void 0 !== t2 ? t2 : [];
    })).some(((e3) => e3.filename && e3.filename.startsWith("chrome-extension://")));
  }
  _isPostHogException(e2) {
    if (e2.length > 0) {
      var t2, i2, r2, s2, n2 = null !== (t2 = null == (i2 = e2[0].stacktrace) ? void 0 : i2.frames) && void 0 !== t2 ? t2 : [], o2 = n2[n2.length - 1];
      return null !== (r2 = null == o2 || null == (s2 = o2.filename) ? void 0 : s2.includes("posthog.com/static")) && void 0 !== r2 && r2;
    }
    return false;
  }
  _isExceptionList(e2) {
    return !Je(e2) && Be(e2);
  }
} };
var Pa = i({ productTours: class {
  get _persistence() {
    return this._instance.persistence;
  }
  constructor(e2) {
    this._productTourManager = null, this._cachedTours = null, this._instance = e2;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(e2) {
    "productTours" in e2 && (this._persistence && this._persistence.register({ [f]: !!e2.productTours }), this.loadIfEnabled());
  }
  loadIfEnabled() {
    var e2, t2;
    this._productTourManager || (e2 = this._instance).config.disable_product_tours || null == (t2 = e2.persistence) || !t2.get_property(f) || this._loadScript((() => this._startProductTours()));
  }
  _loadScript(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.generateProductTours ? e2() : null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "product-tours", ((t3) => {
      t3 ? Zo.error("Could not load product tours script", t3) : e2();
    }));
  }
  _startProductTours() {
    var e2;
    !this._productTourManager && null != (e2 = ke.__PosthogExtensions__) && e2.generateProductTours && (this._productTourManager = ke.__PosthogExtensions__.generateProductTours(this._instance, true));
  }
  getProductTours(e2, t2) {
    if (void 0 === t2 && (t2 = false), !Be(this._cachedTours) || t2) {
      var i2 = this._persistence;
      if (i2) {
        var r2 = i2.props[U];
        if (Be(r2) && !t2) return this._cachedTours = r2, void e2(r2, { isLoaded: true });
      }
      this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/product_tours/?token=" + this._instance.config.token), method: "GET", callback: (t3) => {
        var r3 = t3.statusCode;
        if (200 !== r3 || !t3.json) {
          var s2 = "Product Tours API could not be loaded, status: " + r3;
          return Zo.error(s2), void e2([], { isLoaded: false, error: s2 });
        }
        var n2 = Be(t3.json.product_tours) ? t3.json.product_tours : [];
        this._cachedTours = n2, i2 && i2.register({ [U]: n2 }), e2(n2, { isLoaded: true });
      } });
    } else e2(this._cachedTours, { isLoaded: true });
  }
  getActiveProductTours(e2) {
    Je(this._productTourManager) ? e2([], { isLoaded: false, error: "Product tours not loaded" }) : this._productTourManager.getActiveProductTours(e2);
  }
  showProductTour(e2) {
    var t2;
    null == (t2 = this._productTourManager) || t2.showTourById(e2);
  }
  previewTour(e2) {
    this._productTourManager ? this._productTourManager.previewTour(e2) : this._loadScript((() => {
      var t2;
      this._startProductTours(), null == (t2 = this._productTourManager) || t2.previewTour(e2);
    }));
  }
  dismissProductTour() {
    var e2;
    null == (e2 = this._productTourManager) || e2.dismissTour("user_clicked_skip");
  }
  nextStep() {
    var e2;
    null == (e2 = this._productTourManager) || e2.nextStep();
  }
  previousStep() {
    var e2;
    null == (e2 = this._productTourManager) || e2.previousStep();
  }
  clearCache() {
    var e2;
    this._cachedTours = null, null == (e2 = this._persistence) || e2.unregister(U);
  }
  resetTour(e2) {
    var t2;
    null == (t2 = this._productTourManager) || t2.resetTour(e2);
  }
  resetAllTours() {
    var e2;
    null == (e2 = this._productTourManager) || e2.resetAllTours();
  }
  cancelPendingTour(e2) {
    var t2;
    null == (t2 = this._productTourManager) || t2.cancelPendingTour(e2);
  }
} }, Sa);
var Ca = { siteApps: class {
  constructor(e2) {
    this._instance = e2, this._bufferedInvocations = [], this.apps = {};
  }
  get isEnabled() {
    return !!this._instance.config.opt_in_site_apps;
  }
  _eventCollector(e2, t2) {
    if (t2) {
      var i2 = this.globalsForEvent(t2);
      this._bufferedInvocations.push(i2), this._bufferedInvocations.length > 1e3 && (this._bufferedInvocations = this._bufferedInvocations.slice(10));
    }
  }
  get siteAppLoaders() {
    var e2;
    return null == (e2 = ke._POSTHOG_REMOTE_CONFIG) || null == (e2 = e2[this._instance.config.token]) ? void 0 : e2.siteApps;
  }
  initialize() {
    if (this.isEnabled) {
      var e2 = this._instance._addCaptureHook(this._eventCollector.bind(this));
      this._stopBuffering = () => {
        e2(), this._bufferedInvocations = [], this._stopBuffering = void 0;
      };
    }
  }
  globalsForEvent(e2) {
    var t2, s2, n2, o2, a2, l2, u2;
    if (!e2) throw new Error("Event payload is required");
    var c2 = {}, d2 = this._instance.get_property("$groups") || [], _2 = this._instance.get_property("$stored_group_properties") || {};
    for (var [h2, p2] of Object.entries(_2)) c2[h2] = { id: d2[h2], type: h2, properties: p2 };
    var { $set_once: g2, $set: v2 } = e2;
    return { event: i({}, r(e2, ea), { properties: i({}, e2.properties, v2 ? { $set: i({}, null !== (t2 = null == (s2 = e2.properties) ? void 0 : s2.$set) && void 0 !== t2 ? t2 : {}, v2) } : {}, g2 ? { $set_once: i({}, null !== (n2 = null == (o2 = e2.properties) ? void 0 : o2.$set_once) && void 0 !== n2 ? n2 : {}, g2) } : {}), elements_chain: null !== (a2 = null == (l2 = e2.properties) ? void 0 : l2.$elements_chain) && void 0 !== a2 ? a2 : "", distinct_id: null == (u2 = e2.properties) ? void 0 : u2.distinct_id }), person: { properties: this._instance.get_property("$stored_person_properties") }, groups: c2 };
  }
  setupSiteApp(e2) {
    var t2 = this.apps[e2.id], i2 = () => {
      var i3;
      !t2.errored && this._bufferedInvocations.length && (ta.info("Processing " + this._bufferedInvocations.length + " events for site app with id " + e2.id), this._bufferedInvocations.forEach(((e3) => null == t2.processEvent ? void 0 : t2.processEvent(e3))), t2.processedBuffer = true), Object.values(this.apps).every(((e3) => e3.processedBuffer || e3.errored)) && (null == (i3 = this._stopBuffering) || i3.call(this));
    }, r2 = false, s2 = (s3) => {
      t2.errored = !s3, t2.loaded = true, ta.info("Site app with id " + e2.id + " " + (s3 ? "loaded" : "errored")), r2 && i2();
    };
    try {
      var { processEvent: n2 } = e2.init({ posthog: this._instance, callback(e3) {
        s2(e3);
      } });
      n2 && (t2.processEvent = n2), r2 = true;
    } catch (t3) {
      ta.error(ia + e2.id, t3), s2(false);
    }
    if (r2 && t2.loaded) try {
      i2();
    } catch (i3) {
      ta.error("Error while processing buffered events PostHog app with config id " + e2.id, i3), t2.errored = true;
    }
  }
  _setupSiteApps() {
    var e2 = this.siteAppLoaders || [];
    for (var t2 of e2) this.apps[t2.id] = { id: t2.id, loaded: false, errored: false, processedBuffer: false };
    for (var i2 of e2) this.setupSiteApp(i2);
  }
  _onCapturedEvent(e2) {
    if (0 !== Object.keys(this.apps).length) {
      var t2 = this.globalsForEvent(e2);
      for (var i2 of Object.values(this.apps)) try {
        null == i2.processEvent || i2.processEvent(t2);
      } catch (t3) {
        ta.error("Error while processing event " + e2.event + " for site app " + i2.id, t3);
      }
    }
  }
  onRemoteConfig(e2) {
    var t2, i2, r2, s2 = this;
    if (null != (t2 = this.siteAppLoaders) && t2.length) return this.isEnabled ? (this._setupSiteApps(), void this._instance.on("eventCaptured", ((e3) => this._onCapturedEvent(e3)))) : void ta.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
    if (null == (i2 = this._stopBuffering) || i2.call(this), null != (r2 = e2.siteApps) && r2.length) if (this.isEnabled) {
      var n2 = function(e3) {
        var t3;
        ke["__$$ph_site_app_" + e3] = s2._instance, null == (t3 = ke.__PosthogExtensions__) || null == t3.loadSiteApp || t3.loadSiteApp(s2._instance, a2, ((t4) => {
          if (t4) return ta.error(ia + e3, t4);
        }));
      };
      for (var { id: o2, url: a2 } of e2.siteApps) n2(o2);
    } else ta.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
  }
} };
var Ta = { tracingHeaders: class {
  constructor(e2) {
    this._restoreXHRPatch = void 0, this._restoreFetchPatch = void 0, this._startCapturing = () => {
      var e3, t2, i2 = this._getConfiguredHostnames() || [];
      We(this._restoreXHRPatch) && (null == (e3 = ke.__PosthogExtensions__) || null == (e3 = e3.tracingHeadersPatchFns) || e3._patchXHR(i2, this._instance.get_distinct_id(), this._instance.sessionManager)), We(this._restoreFetchPatch) && (null == (t2 = ke.__PosthogExtensions__) || null == (t2 = t2.tracingHeadersPatchFns) || t2._patchFetch(i2, this._instance.get_distinct_id(), this._instance.sessionManager));
    }, this._instance = e2;
  }
  initialize() {
    this.startIfEnabledOrStop();
  }
  _loadScript(e2) {
    var t2, i2;
    null != (t2 = ke.__PosthogExtensions__) && t2.tracingHeadersPatchFns && e2(), null == (i2 = ke.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "tracing-headers", ((t3) => {
      if (t3) return Bo.error("failed to load script", t3);
      e2();
    }));
  }
  _getConfiguredHostnames() {
    var e2;
    return null !== (e2 = this._instance.config.addTracingHeaders) && void 0 !== e2 ? e2 : this._instance.config.__add_tracing_headers;
  }
  startIfEnabledOrStop() {
    var e2, t2;
    this._getConfiguredHostnames() ? this._loadScript(this._startCapturing) : (null == (e2 = this._restoreXHRPatch) || e2.call(this), null == (t2 = this._restoreFetchPatch) || t2.call(this), this._restoreXHRPatch = void 0, this._restoreFetchPatch = void 0);
  }
} };
var Ra = i({ surveys: class {
  get _config() {
    return this._instance.config;
  }
  constructor(e2) {
    this._isSurveysEnabled = void 0, this._surveyManager = null, this._isInitializingSurveys = false, this._surveyCallbacks = [], this._getSurveysInFlightPromise = null, this._instance = e2, this._surveyEventReceiver = null;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(e2) {
    if (!this._config.disable_surveys) {
      var t2 = e2.surveys;
      if (Je(t2)) return Fn.warn("Flags not loaded yet. Not loading surveys.");
      var i2 = Be(t2);
      this._isSurveysEnabled = i2 ? t2.length > 0 : t2, Fn.info("flags response received, isSurveysEnabled: " + this._isSurveysEnabled), this.loadIfEnabled();
    }
  }
  reset() {
    localStorage.removeItem("lastSeenSurveyDate");
    for (var e2 = [], t2 = 0; t2 < localStorage.length; t2++) {
      var i2 = localStorage.key(t2);
      (null != i2 && i2.startsWith(Ln) || null != i2 && i2.startsWith("inProgressSurvey_")) && e2.push(i2);
    }
    e2.forEach(((e3) => localStorage.removeItem(e3)));
  }
  loadIfEnabled() {
    if (!this._surveyManager) if (this._isInitializingSurveys) Fn.info("Already initializing surveys, skipping...");
    else if (this._config.disable_surveys) Fn.info(la);
    else if (this._config.cookieless_mode && this._instance.consent.isOptedOut()) Fn.info("Not loading surveys in cookieless mode without consent.");
    else {
      var e2 = null == ke ? void 0 : ke.__PosthogExtensions__;
      if (e2) {
        if (!We(this._isSurveysEnabled) || this._config.advanced_enable_surveys) {
          var t2 = this._isSurveysEnabled || this._config.advanced_enable_surveys;
          this._isInitializingSurveys = true;
          try {
            var i2 = e2.generateSurveys;
            if (i2) return void this._completeSurveyInitialization(i2, t2);
            var r2 = e2.loadExternalDependency;
            if (!r2) return void this._handleSurveyLoadError(ie);
            r2(this._instance, "surveys", ((i3) => {
              i3 || !e2.generateSurveys ? this._handleSurveyLoadError("Could not load surveys script", i3) : this._completeSurveyInitialization(e2.generateSurveys, t2);
            }));
          } catch (e3) {
            throw this._handleSurveyLoadError("Error initializing surveys", e3), e3;
          } finally {
            this._isInitializingSurveys = false;
          }
        }
      } else Fn.error("PostHog Extensions not found.");
    }
  }
  _completeSurveyInitialization(e2, t2) {
    this._surveyManager = e2(this._instance, t2), this._surveyEventReceiver = new oa(this._instance), Fn.info("Surveys loaded successfully"), this._notifySurveyCallbacks({ isLoaded: true });
  }
  _handleSurveyLoadError(e2, t2) {
    Fn.error(e2, t2), this._notifySurveyCallbacks({ isLoaded: false, error: e2 });
  }
  onSurveysLoaded(e2) {
    return this._surveyCallbacks.push(e2), this._surveyManager && this._notifySurveyCallbacks({ isLoaded: true }), () => {
      this._surveyCallbacks = this._surveyCallbacks.filter(((t2) => t2 !== e2));
    };
  }
  getSurveys(e2, t2) {
    if (void 0 === t2 && (t2 = false), this._config.disable_surveys) return Fn.info(la), e2([]);
    var i2, r2 = this._instance.get_property(D);
    if (r2 && !t2) return e2(r2, { isLoaded: true });
    "undefined" != typeof Promise && this._getSurveysInFlightPromise ? this._getSurveysInFlightPromise.then(((t3) => {
      var { surveys: i3, context: r3 } = t3;
      return e2(i3, r3);
    })) : ("undefined" != typeof Promise && (this._getSurveysInFlightPromise = new Promise(((e3) => {
      i2 = e3;
    }))), this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/surveys/?token=" + this._config.token), method: "GET", timeout: this._config.surveys_request_timeout_ms, callback: (t3) => {
      var r3;
      this._getSurveysInFlightPromise = null;
      var s2 = t3.statusCode;
      if (200 !== s2 || !t3.json) {
        var n2 = "Surveys API could not be loaded, status: " + s2;
        Fn.error(n2);
        var o2 = { isLoaded: false, error: n2 };
        return e2([], o2), void (null == i2 || i2({ surveys: [], context: o2 }));
      }
      var a2, l2 = t3.json.surveys || [], u2 = l2.filter(((e3) => (function(e4) {
        return !(!e4.start_date || e4.end_date);
      })(e3) && ((function(e4) {
        var t4;
        return !(null == (t4 = e4.conditions) || null == (t4 = t4.events) || null == (t4 = t4.values) || !t4.length);
      })(e3) || (function(e4) {
        var t4;
        return !(null == (t4 = e4.conditions) || null == (t4 = t4.actions) || null == (t4 = t4.values) || !t4.length);
      })(e3))));
      u2.length > 0 && (null == (a2 = this._surveyEventReceiver) || a2.register(u2)), null == (r3 = this._instance.persistence) || r3.register({ [D]: l2 });
      var c2 = { isLoaded: true };
      e2(l2, c2), null == i2 || i2({ surveys: l2, context: c2 });
    } }));
  }
  _notifySurveyCallbacks(e2) {
    for (var t2 of this._surveyCallbacks) try {
      if (!e2.isLoaded) return t2([], e2);
      this.getSurveys(t2);
    } catch (e3) {
      Fn.error("Error in survey callback", e3);
    }
  }
  getActiveMatchingSurveys(e2, t2) {
    if (void 0 === t2 && (t2 = false), !Je(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(e2, t2);
    Fn.warn("init was not called");
  }
  _getSurveyById(e2) {
    var t2 = null;
    return this.getSurveys(((i2) => {
      var r2;
      t2 = null !== (r2 = i2.find(((t3) => t3.id === e2))) && void 0 !== r2 ? r2 : null;
    })), t2;
  }
  _checkSurveyEligibility(e2) {
    if (Je(this._surveyManager)) return { eligible: false, reason: aa };
    var t2 = "string" == typeof e2 ? this._getSurveyById(e2) : e2;
    return t2 ? this._surveyManager.checkSurveyEligibility(t2) : { eligible: false, reason: "Survey not found" };
  }
  canRenderSurvey(e2) {
    if (Je(this._surveyManager)) return Fn.warn("init was not called"), { visible: false, disabledReason: aa };
    var t2 = this._checkSurveyEligibility(e2);
    return { visible: t2.eligible, disabledReason: t2.reason };
  }
  canRenderSurveyAsync(e2, t2) {
    return Je(this._surveyManager) ? (Fn.warn("init was not called"), Promise.resolve({ visible: false, disabledReason: aa })) : new Promise(((i2) => {
      this.getSurveys(((t3) => {
        var r2, s2 = null !== (r2 = t3.find(((t4) => t4.id === e2))) && void 0 !== r2 ? r2 : null;
        if (s2) {
          var n2 = this._checkSurveyEligibility(s2);
          i2({ visible: n2.eligible, disabledReason: n2.reason });
        } else i2({ visible: false, disabledReason: "Survey not found" });
      }), t2);
    }));
  }
  renderSurvey(e2, t2, i2) {
    var r2;
    if (Je(this._surveyManager)) Fn.warn("init was not called");
    else {
      var s2 = "string" == typeof e2 ? this._getSurveyById(e2) : e2;
      if (null != s2 && s2.id) if ($n.includes(s2.type)) {
        var n2 = null == me ? void 0 : me.querySelector(t2);
        if (n2) return null != (r2 = s2.appearance) && r2.surveyPopupDelaySeconds ? (Fn.info("Rendering survey " + s2.id + " with delay of " + s2.appearance.surveyPopupDelaySeconds + " seconds"), void setTimeout((() => {
          var e3, t3;
          Fn.info("Rendering survey " + s2.id + " with delay of " + (null == (e3 = s2.appearance) ? void 0 : e3.surveyPopupDelaySeconds) + " seconds"), null == (t3 = this._surveyManager) || t3.renderSurvey(s2, n2, i2), Fn.info("Survey " + s2.id + " rendered");
        }), 1e3 * s2.appearance.surveyPopupDelaySeconds)) : void this._surveyManager.renderSurvey(s2, n2, i2);
        Fn.warn("Survey element not found");
      } else Fn.warn("Surveys of type " + s2.type + " cannot be rendered in the app");
      else Fn.warn("Survey not found");
    }
  }
  displaySurvey(e2, t2) {
    var r2;
    if (Je(this._surveyManager)) Fn.warn("init was not called");
    else {
      var s2 = this._getSurveyById(e2);
      if (s2) {
        var n2 = s2;
        if (null != (r2 = s2.appearance) && r2.surveyPopupDelaySeconds && t2.ignoreDelay && (n2 = i({}, s2, { appearance: i({}, s2.appearance, { surveyPopupDelaySeconds: 0 }) })), t2.displayType !== ds.Popover && t2.initialResponses && Fn.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), false === t2.ignoreConditions) {
          var o2 = this.canRenderSurvey(s2);
          if (!o2.visible) return void Fn.warn("Survey is not eligible to be displayed: ", o2.disabledReason);
        }
        t2.displayType !== ds.Inline ? this._surveyManager.handlePopoverSurvey(n2, t2) : this.renderSurvey(n2, t2.selector, t2.properties);
      } else Fn.warn("Survey not found");
    }
  }
  cancelPendingSurvey(e2) {
    Je(this._surveyManager) ? Fn.warn("init was not called") : this._surveyManager.cancelSurvey(e2);
  }
  handlePageUnload() {
    var e2;
    null == (e2 = this._surveyManager) || e2.handlePageUnload();
  }
} }, Sa);
var Fa = { toolbar: class {
  constructor(e2) {
    this.instance = e2;
  }
  _setToolbarState(e2) {
    ke.ph_toolbar_state = e2;
  }
  _getToolbarState() {
    var e2;
    return null !== (e2 = ke.ph_toolbar_state) && void 0 !== e2 ? e2 : 0;
  }
  initialize() {
    return this.maybeLoadToolbar();
  }
  maybeLoadToolbar(e2, t2, i2) {
    if (void 0 === e2 && (e2 = void 0), void 0 === t2 && (t2 = void 0), void 0 === i2 && (i2 = void 0), sr(this.instance.config)) return false;
    if (!pe || !me) return false;
    e2 = null != e2 ? e2 : pe.location, i2 = null != i2 ? i2 : pe.history;
    try {
      if (!t2) {
        try {
          pe.localStorage.setItem("test", "test"), pe.localStorage.removeItem("test");
        } catch (e3) {
          return false;
        }
        t2 = null == pe ? void 0 : pe.localStorage;
      }
      var r2, s2 = ua || Dr(e2.hash, "__posthog") || Dr(e2.hash, "state"), n2 = s2 ? Qi((() => JSON.parse(atob(decodeURIComponent(s2))))) || Qi((() => JSON.parse(decodeURIComponent(s2)))) : null;
      return n2 && "ph_authorize" === n2.action ? ((r2 = n2).source = "url", r2 && Object.keys(r2).length > 0 && (n2.desiredHash ? e2.hash = n2.desiredHash : i2 ? i2.replaceState(i2.state, "", e2.pathname + e2.search) : e2.hash = "")) : ((r2 = JSON.parse(t2.getItem(ca) || "{}")).source = "localstorage", delete r2.userIntent), !(!r2.token || this.instance.config.token !== r2.token || (this.loadToolbar(r2), 0));
    } catch (e3) {
      return false;
    }
  }
  _callLoadToolbar(e2) {
    var t2 = ke.ph_load_toolbar || ke.ph_load_editor;
    !Je(t2) && He(t2) ? t2(e2, this.instance) : da.warn("No toolbar load function found");
  }
  loadToolbar(e2) {
    var t2 = !(null == me || !me.getElementById(X));
    if (!pe || t2) return false;
    var r2 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, s2 = i({ token: this.instance.config.token }, e2, { apiURL: this.instance.requestRouter.endpointFor("ui") }, r2 ? { instrument: false } : {});
    if (pe.localStorage.setItem(ca, JSON.stringify(i({}, s2, { source: void 0 }))), 2 === this._getToolbarState()) this._callLoadToolbar(s2);
    else if (0 === this._getToolbarState()) {
      var n2;
      this._setToolbarState(1), null == (n2 = ke.__PosthogExtensions__) || null == n2.loadExternalDependency || n2.loadExternalDependency(this.instance, "toolbar", ((e3) => {
        if (e3) return da.error("[Toolbar] Failed to load", e3), void this._setToolbarState(0);
        this._setToolbarState(2), this._callLoadToolbar(s2);
      })), rr(pe, "turbolinks:load", (() => {
        this._setToolbarState(0), this.loadToolbar(s2);
      }));
    }
    return true;
  }
  _loadEditor(e2) {
    return this.loadToolbar(e2);
  }
  maybeLoadEditor(e2, t2, i2) {
    return void 0 === e2 && (e2 = void 0), void 0 === t2 && (t2 = void 0), void 0 === i2 && (i2 = void 0), this.maybeLoadToolbar(e2, t2, i2);
  }
} };
var La = i({ experiments: ba }, Sa);
var $a = { conversations: class {
  constructor(e2) {
    this._isConversationsEnabled = void 0, this._conversationsManager = null, this._isInitializing = false, this._remoteConfig = null, this._instance = e2;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(e2) {
    if (!this._instance.config.disable_conversations) {
      var t2 = e2.conversations;
      Je(t2) || (Ze(t2) ? this._isConversationsEnabled = t2 : (this._isConversationsEnabled = t2.enabled, this._remoteConfig = t2), this.loadIfEnabled());
    }
  }
  reset() {
    var e2;
    null == (e2 = this._conversationsManager) || e2.reset(), this._conversationsManager = null, this._isConversationsEnabled = void 0, this._remoteConfig = null;
  }
  loadIfEnabled() {
    if (!(this._conversationsManager || this._isInitializing || this._instance.config.disable_conversations || sr(this._instance.config) || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut())) {
      var e2 = null == ke ? void 0 : ke.__PosthogExtensions__;
      if (e2 && !We(this._isConversationsEnabled) && this._isConversationsEnabled) if (this._remoteConfig && this._remoteConfig.token) {
        this._isInitializing = true;
        try {
          var t2 = e2.initConversations;
          if (t2) return this._completeInitialization(t2), void (this._isInitializing = false);
          var i2 = e2.loadExternalDependency;
          if (!i2) return void this._handleLoadError(ie);
          i2(this._instance, "conversations", ((t3) => {
            t3 || !e2.initConversations ? this._handleLoadError("Could not load conversations script", t3) : this._completeInitialization(e2.initConversations), this._isInitializing = false;
          }));
        } catch (e3) {
          this._handleLoadError("Error initializing conversations", e3), this._isInitializing = false;
        }
      } else wa.error("Conversations enabled but missing token in remote config.");
    }
  }
  _completeInitialization(e2) {
    if (this._remoteConfig) try {
      this._conversationsManager = e2(this._remoteConfig, this._instance), wa.info("Conversations loaded successfully");
    } catch (e3) {
      this._handleLoadError("Error completing conversations initialization", e3);
    }
    else wa.error("Cannot complete initialization: remote config is null");
  }
  _handleLoadError(e2, t2) {
    wa.error(e2, t2), this._conversationsManager = null, this._isInitializing = false;
  }
  show() {
    this._conversationsManager ? this._conversationsManager.show() : wa.warn("Conversations not loaded yet.");
  }
  hide() {
    this._conversationsManager && this._conversationsManager.hide();
  }
  isAvailable() {
    return true === this._isConversationsEnabled && !Ke(this._conversationsManager);
  }
  isVisible() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this._conversationsManager) ? void 0 : t2.isVisible()) && void 0 !== e2 && e2;
  }
  sendMessage(e2, i2, r2) {
    var s2 = this;
    return t((function* () {
      return s2._conversationsManager ? s2._conversationsManager.sendMessage(e2, i2, r2) : (wa.warn(Ea), null);
    }))();
  }
  getMessages(e2, i2) {
    var r2 = this;
    return t((function* () {
      return r2._conversationsManager ? r2._conversationsManager.getMessages(e2, i2) : (wa.warn(Ea), null);
    }))();
  }
  markAsRead(e2) {
    var i2 = this;
    return t((function* () {
      return i2._conversationsManager ? i2._conversationsManager.markAsRead(e2) : (wa.warn(Ea), null);
    }))();
  }
  getTickets(e2) {
    var i2 = this;
    return t((function* () {
      return i2._conversationsManager ? i2._conversationsManager.getTickets(e2) : (wa.warn(Ea), null);
    }))();
  }
  requestRestoreLink(e2) {
    var i2 = this;
    return t((function* () {
      return i2._conversationsManager ? i2._conversationsManager.requestRestoreLink(e2) : (wa.warn(Ea), null);
    }))();
  }
  restoreFromToken(e2) {
    var i2 = this;
    return t((function* () {
      return i2._conversationsManager ? i2._conversationsManager.restoreFromToken(e2) : (wa.warn(Ea), null);
    }))();
  }
  restoreFromUrlToken() {
    var e2 = this;
    return t((function* () {
      return e2._conversationsManager ? e2._conversationsManager.restoreFromUrlToken() : (wa.warn(Ea), null);
    }))();
  }
  getCurrentTicketId() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this._conversationsManager) ? void 0 : t2.getCurrentTicketId()) && void 0 !== e2 ? e2 : null;
  }
  getWidgetSessionId() {
    var e2, t2;
    return null !== (e2 = null == (t2 = this._conversationsManager) ? void 0 : t2.getWidgetSessionId()) && void 0 !== e2 ? e2 : null;
  }
  _onIdentityChanged() {
    var e2;
    null == (e2 = this._conversationsManager) || e2.setIdentity();
  }
  _onIdentityCleared() {
    var e2;
    null == (e2 = this._conversationsManager) || e2.clearIdentity();
  }
} };
var Oa = { logs: class {
  constructor(e2) {
    var t2;
    this._isLogsEnabled = false, this._isLoaded = false, this._logger = Gi("[logs]"), this._logBuffer = [], this._intervalLogCount = 0, this._intervalWindowStart = 0, this._droppedWarned = false, this._instance = e2, this._instance && null != (t2 = this._instance.config.logs) && t2.captureConsoleLogs && (this._isLogsEnabled = true);
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(e2) {
    var t2, i2 = null == (t2 = e2.logs) ? void 0 : t2.captureConsoleLogs;
    !Je(i2) && i2 && (this._isLogsEnabled = true, this.loadIfEnabled());
  }
  reset() {
    this._logBuffer = [], this._flushTimeout && (clearTimeout(this._flushTimeout), this._flushTimeout = void 0), this._intervalLogCount = 0, this._intervalWindowStart = 0, this._droppedWarned = false;
  }
  loadIfEnabled() {
    if (this._isLogsEnabled && !this._isLoaded) {
      var e2 = null == ke ? void 0 : ke.__PosthogExtensions__;
      if (e2) {
        var t2 = e2.loadExternalDependency;
        t2 ? t2(this._instance, "logs", ((t3) => {
          var i2;
          t3 || null == (i2 = e2.logs) || !i2.initializeLogs ? this._logger.error("Could not load logs script", t3) : (e2.logs.initializeLogs(this._instance), this._isLoaded = true);
        })) : this._logger.error(ie);
      } else this._logger.error("PostHog Extensions not found.");
    }
  }
  captureLog(e2) {
    var t2, r2, s2, n2, o2, a2;
    if (this._instance.is_capturing()) if (e2 && e2.body) {
      var l2 = null !== (t2 = null == (r2 = this._instance.config.logs) ? void 0 : r2.flushIntervalMs) && void 0 !== t2 ? t2 : 3e3, u2 = null !== (s2 = null == (n2 = this._instance.config.logs) ? void 0 : n2.maxLogsPerInterval) && void 0 !== s2 ? s2 : 1e3, c2 = Date.now();
      if (l2 > c2 - this._intervalWindowStart || (this._intervalWindowStart = c2, this._intervalLogCount = 0, this._droppedWarned = false), u2 > this._intervalLogCount) {
        this._intervalLogCount++;
        var d2 = (function(e3, t3) {
          var r3 = e3.level || "info", { text: s3, number: n3 } = ci[r3] || di, o3 = String(Date.now()) + "000000", a3 = {};
          t3.distinctId && (a3.posthogDistinctId = t3.distinctId), t3.sessionId && (a3.sessionId = t3.sessionId), t3.currentUrl && (a3["url.full"] = t3.currentUrl), t3.screenName && (a3["screen.name"] = t3.screenName), t3.appState && (a3["app.state"] = t3.appState), t3.activeFeatureFlags && t3.activeFeatureFlags.length > 0 && (a3.feature_flags = t3.activeFeatureFlags);
          var l3 = i({}, a3, e3.attributes || {}), u3 = { timeUnixNano: o3, observedTimeUnixNano: o3, severityNumber: n3, severityText: s3, body: { stringValue: e3.body }, attributes: hi(l3) };
          return e3.trace_id && (u3.traceId = e3.trace_id), e3.span_id && (u3.spanId = e3.span_id), We(e3.trace_flags) || (u3.flags = e3.trace_flags), u3;
        })(e2, this._getSdkContext());
        this._logBuffer.push({ record: d2 }), (null !== (o2 = null == (a2 = this._instance.config.logs) ? void 0 : a2.maxBufferSize) && void 0 !== o2 ? o2 : 100) > this._logBuffer.length ? this._scheduleFlush() : this.flushLogs();
      } else this._droppedWarned || (this._logger.warn("captureLog dropping logs: exceeded " + u2 + " logs per " + l2 + "ms"), this._droppedWarned = true);
    } else this._logger.warn("captureLog requires a body");
  }
  get logger() {
    return this._logger_instance || (this._logger_instance = { trace: (e2, t2) => this.captureLog({ body: e2, level: "trace", attributes: t2 }), debug: (e2, t2) => this.captureLog({ body: e2, level: "debug", attributes: t2 }), info: (e2, t2) => this.captureLog({ body: e2, level: "info", attributes: t2 }), warn: (e2, t2) => this.captureLog({ body: e2, level: "warn", attributes: t2 }), error: (e2, t2) => this.captureLog({ body: e2, level: "error", attributes: t2 }), fatal: (e2, t2) => this.captureLog({ body: e2, level: "fatal", attributes: t2 }) }), this._logger_instance;
  }
  flushLogs(e2) {
    if (this._flushTimeout && (clearTimeout(this._flushTimeout), this._flushTimeout = void 0), 0 !== this._logBuffer.length) {
      var t2 = this._logBuffer;
      this._logBuffer = [];
      var r2 = this._instance.config.logs, s2 = i({ "service.name": (null == r2 ? void 0 : r2.serviceName) || "unknown_service" }, (null == r2 ? void 0 : r2.environment) && { "deployment.environment": r2.environment }, (null == r2 ? void 0 : r2.serviceVersion) && { "service.version": r2.serviceVersion }, null == r2 ? void 0 : r2.resourceAttributes), o2 = (function(e3, t3, i2, r3) {
        return { resourceLogs: [{ resource: { attributes: hi(t3) }, scopeLogs: [{ scope: { name: i2, version: r3 }, logRecords: e3 }] }] };
      })(t2.map(((e3) => e3.record)), s2, n.LIB_NAME, n.LIB_VERSION), a2 = this._instance.requestRouter.endpointFor("api", "/i/v1/logs") + "?token=" + encodeURIComponent(this._instance.config.token);
      this._instance._send_retriable_request({ method: "POST", url: a2, data: o2, compression: "best-available", batchKey: "logs", transport: e2 });
    }
  }
  _scheduleFlush() {
    var e2, t2;
    this._flushTimeout || (this._flushTimeout = setTimeout((() => {
      this._flushTimeout = void 0, this.flushLogs();
    }), null !== (e2 = null == (t2 = this._instance.config.logs) ? void 0 : t2.flushIntervalMs) && void 0 !== e2 ? e2 : 3e3));
  }
  _getSdkContext() {
    var e2, t2 = {};
    if (t2.distinctId = this._instance.get_distinct_id(), this._instance.sessionManager) {
      var { sessionId: i2 } = this._instance.sessionManager.checkAndGetSessionAndWindowId(true);
      t2.sessionId = i2;
    }
    if (null != ke && null != (e2 = ke.location) && e2.href && (t2.currentUrl = ke.location.href), this._instance.featureFlags) {
      var r2 = this._instance.featureFlags.getFlags();
      r2 && r2.length > 0 && (t2.activeFeatureFlags = r2);
    }
    return t2;
  }
} };
var Ma = i({}, Sa, xa, ka, Ia, Pa, Ca, Ra, Ta, Fa, La, $a, Oa);
Qn.__defaultExtensionClasses = i({}, Ma);
var Aa;
var Da = (Aa = Un[Wn] = new Qn(), (function() {
  function e2() {
    e2.done || (e2.done = true, Gn = false, Ki(Un, (function(e3) {
      e3._dom_loaded();
    })));
  }
  null != me && me.addEventListener ? "complete" === me.readyState ? e2() : rr(me, "DOMContentLoaded", e2, { capture: false }) : pe && Wi.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized");
})(), Aa);

// shared/analytics.js
var POSTHOG_KEY = "phc_yvN9tWkUbZfrArYb2KHwCszRay38fLH3bzEcp9wf4iFa";
var POSTHOG_HOST = "https://us.i.posthog.com";
var DISTINCT_ID_KEY = "posthog_distinct_id";
async function getDistinctId() {
  const stored = await chrome.storage.local.get(DISTINCT_ID_KEY);
  if (stored[DISTINCT_ID_KEY]) return stored[DISTINCT_ID_KEY];
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ [DISTINCT_ID_KEY]: id });
  return id;
}
async function initPostHog(context) {
  const distinctId = await getDistinctId();
  const isBg = context === "background";
  const posthog = new Qn();
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    bootstrap: { distinctID: distinctId },
    disable_external_dependency_loading: true,
    persistence: isBg ? "memory" : "localStorage",
    capture_pageview: !isBg,
    autocapture: !isBg,
    disable_session_recording: isBg,
    disable_surveys: isBg
  });
  return posthog;
}
export {
  getDistinctId,
  initPostHog
};

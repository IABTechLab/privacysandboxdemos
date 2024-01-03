/* prebid.js v7.54.0
Updated: 2023-06-19
Modules: fpdModule, ixBidAdapter, fledgeForGpt, topicsFpdModule */

if (!window.pbjs || !window.pbjs.libLoaded) {
 (function(){
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Renderer.js":
/*!*************************!*\
  !*** ./src/Renderer.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Renderer": function() { return /* binding */ Renderer; },
/* harmony export */   "executeRenderer": function() { return /* binding */ executeRenderer; },
/* harmony export */   "isRendererRequired": function() { return /* binding */ isRendererRequired; }
/* harmony export */ });
/* harmony import */ var _adloader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adloader.js */ "./src/adloader.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");




var pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
var moduleCode = 'outstream';

/**
 * @typedef {object} Renderer
 *
 * A Renderer stores some functions which are used to render a particular Bid.
 * These are used in Outstream Video Bids, returned on the Bid by the adapter, and will
 * be used to render that bid unless the Publisher overrides them.
 */

function Renderer(options) {
  var _this = this;
  var url = options.url,
    config = options.config,
    id = options.id,
    callback = options.callback,
    loaded = options.loaded,
    adUnitCode = options.adUnitCode,
    renderNow = options.renderNow;
  this.url = url;
  this.config = config;
  this.handlers = {};
  this.id = id;
  this.renderNow = renderNow;

  // a renderer may push to the command queue to delay rendering until the
  // render function is loaded by loadExternalScript, at which point the the command
  // queue will be processed
  this.loaded = loaded;
  this.cmd = [];
  this.push = function (func) {
    if (typeof func !== 'function') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Commands given to Renderer.push must be wrapped in a function');
      return;
    }
    _this.loaded ? func.call() : _this.cmd.push(func);
  };

  // bidders may override this with the `callback` property given to `install`
  this.callback = callback || function () {
    _this.loaded = true;
    _this.process();
  };

  // use a function, not an arrow, in order to be able to pass "arguments" through
  this.render = function () {
    var _this2 = this;
    var renderArgs = arguments;
    var runRender = function runRender() {
      if (_this2._render) {
        _this2._render.apply(_this2, renderArgs);
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("No render function was provided, please use .setRender on the renderer");
      }
    };
    if (isRendererPreferredFromAdUnit(adUnitCode)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("External Js not loaded by Renderer since renderer url and callback is already defined on adUnit ".concat(adUnitCode));
      runRender();
    } else if (renderNow) {
      runRender();
    } else {
      // we expect to load a renderer url once only so cache the request to load script
      this.cmd.unshift(runRender); // should render run first ?
      (0,_adloader_js__WEBPACK_IMPORTED_MODULE_2__.loadExternalScript)(url, moduleCode, this.callback, this.documentContext);
    }
  }.bind(this); // bind the function to this object to avoid 'this' errors
}

Renderer.install = function (_ref) {
  var url = _ref.url,
    config = _ref.config,
    id = _ref.id,
    callback = _ref.callback,
    loaded = _ref.loaded,
    adUnitCode = _ref.adUnitCode,
    renderNow = _ref.renderNow;
  return new Renderer({
    url: url,
    config: config,
    id: id,
    callback: callback,
    loaded: loaded,
    adUnitCode: adUnitCode,
    renderNow: renderNow
  });
};
Renderer.prototype.getConfig = function () {
  return this.config;
};
Renderer.prototype.setRender = function (fn) {
  this._render = fn;
};
Renderer.prototype.setEventHandlers = function (handlers) {
  this.handlers = handlers;
};
Renderer.prototype.handleVideoEvent = function (_ref2) {
  var id = _ref2.id,
    eventName = _ref2.eventName;
  if (typeof this.handlers[eventName] === 'function') {
    this.handlers[eventName]();
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Prebid Renderer event for id ".concat(id, " type ").concat(eventName));
};

/*
 * Calls functions that were pushed to the command queue before the
 * renderer was loaded by `loadExternalScript`
 */
Renderer.prototype.process = function () {
  while (this.cmd.length > 0) {
    try {
      this.cmd.shift().call();
    } catch (error) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error processing Renderer command: ', error);
    }
  }
};

/**
 * Checks whether creative rendering should be done by Renderer or not.
 * @param {Object} renderer Renderer object installed by adapter
 * @returns {Boolean}
 */
function isRendererRequired(renderer) {
  return !!(renderer && (renderer.url || renderer.renderNow));
}

/**
 * Render the bid returned by the adapter
 * @param {Object} renderer Renderer object installed by adapter
 * @param {Object} bid Bid response
 * @param {Document} doc context document of bid
 */
function executeRenderer(renderer, bid, doc) {
  var docContext = null;
  if (renderer.config && renderer.config.documentResolver) {
    docContext = renderer.config.documentResolver(bid, document, doc); // a user provided callback, which should return a Document, and expect the parameters; bid, sourceDocument, renderDocument
  }

  if (!docContext) {
    docContext = document;
  }
  renderer.documentContext = docContext;
  renderer.render(bid, renderer.documentContext);
}
function isRendererPreferredFromAdUnit(adUnitCode) {
  var adUnits = pbjsInstance.adUnits;
  var adUnit = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.find)(adUnits, function (adUnit) {
    return adUnit.code === adUnitCode;
  });
  if (!adUnit) {
    return false;
  }

  // renderer defined at adUnit level
  var adUnitRenderer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(adUnit, 'renderer');
  var hasValidAdUnitRenderer = !!(adUnitRenderer && adUnitRenderer.url && adUnitRenderer.render);

  // renderer defined at adUnit.mediaTypes level
  var mediaTypeRenderer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"])(adUnit, 'mediaTypes.video.renderer');
  var hasValidMediaTypeRenderer = !!(mediaTypeRenderer && mediaTypeRenderer.url && mediaTypeRenderer.render);
  return !!(hasValidAdUnitRenderer && !(adUnitRenderer.backupOnly === true) || hasValidMediaTypeRenderer && !(mediaTypeRenderer.backupOnly === true));
}

/***/ }),

/***/ "./src/activities/activities.js":
/*!**************************************!*\
  !*** ./src/activities/activities.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTIVITY_ACCESS_DEVICE": function() { return /* binding */ ACTIVITY_ACCESS_DEVICE; },
/* harmony export */   "ACTIVITY_FETCH_BIDS": function() { return /* binding */ ACTIVITY_FETCH_BIDS; },
/* harmony export */   "ACTIVITY_REPORT_ANALYTICS": function() { return /* binding */ ACTIVITY_REPORT_ANALYTICS; },
/* harmony export */   "ACTIVITY_SYNC_USER": function() { return /* binding */ ACTIVITY_SYNC_USER; },
/* harmony export */   "ACTIVITY_TRANSMIT_EIDS": function() { return /* binding */ ACTIVITY_TRANSMIT_EIDS; },
/* harmony export */   "ACTIVITY_TRANSMIT_PRECISE_GEO": function() { return /* binding */ ACTIVITY_TRANSMIT_PRECISE_GEO; },
/* harmony export */   "ACTIVITY_TRANSMIT_UFPD": function() { return /* binding */ ACTIVITY_TRANSMIT_UFPD; }
/* harmony export */ });
/* unused harmony exports ACTIVITY_ENRICH_UFPD, ACTIVITY_ENRICH_EIDS */
/**
 * Activity (that are relevant for privacy) definitions
 *
 * ref. https://docs.google.com/document/d/1dRxFUFmhh2jGanzGZvfkK_6jtHPpHXWD7Qsi6KEugeE
 * & https://github.com/prebid/Prebid.js/issues/9546
 */

/**
 * accessDevice: some component wants to read or write to localStorage or cookies.
 */
var ACTIVITY_ACCESS_DEVICE = 'accessDevice';
/**
 * syncUser: A bid adapter wants to run a user sync.
 */
var ACTIVITY_SYNC_USER = 'syncUser';
/**
 * enrichUfpd: some component wants to add user first-party data to bid requests.
 */
var ACTIVITY_ENRICH_UFPD = 'enrichUfpd';
/**
 * enrichEids: some component wants to add user IDs to bid requests.
 */
var ACTIVITY_ENRICH_EIDS = 'enrichEids';
/**
 * fetchBid: a bidder wants to bid.
 */
var ACTIVITY_FETCH_BIDS = 'fetchBids';

/**
 * reportAnalytics: some component wants to phone home with analytics data.
 */
var ACTIVITY_REPORT_ANALYTICS = 'reportAnalytics';

/**
 * some component wants access to (and send along) user IDs
 */
var ACTIVITY_TRANSMIT_EIDS = 'transmitEids';

/**
 * transmitUfpd: some component wants access to (and send along) user FPD
 */
var ACTIVITY_TRANSMIT_UFPD = 'transmitUfpd';

/**
 * transmitPreciseGeo: some component wants access to (and send along) geolocation info
 */
var ACTIVITY_TRANSMIT_PRECISE_GEO = 'transmitPreciseGeo';

/***/ }),

/***/ "./src/activities/activityParams.js":
/*!******************************************!*\
  !*** ./src/activities/activityParams.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "activityParams": function() { return /* binding */ activityParams; }
/* harmony export */ });
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./params.js */ "./src/activities/params.js");



/**
 * Utility function for building common activity parameters - broken out to its own
 * file to avoid circular imports.
 */
var activityParams = (0,_params_js__WEBPACK_IMPORTED_MODULE_0__.activityParamsBuilder)(function (alias) {
  return _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].resolveAlias(alias);
});

/***/ }),

/***/ "./src/activities/modules.js":
/*!***********************************!*\
  !*** ./src/activities/modules.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MODULE_TYPE_ANALYTICS": function() { return /* binding */ MODULE_TYPE_ANALYTICS; },
/* harmony export */   "MODULE_TYPE_BIDDER": function() { return /* binding */ MODULE_TYPE_BIDDER; },
/* harmony export */   "MODULE_TYPE_PREBID": function() { return /* binding */ MODULE_TYPE_PREBID; }
/* harmony export */ });
/* unused harmony exports MODULE_TYPE_UID, MODULE_TYPE_RTD */
var MODULE_TYPE_PREBID = 'prebid';
var MODULE_TYPE_BIDDER = 'bidder';
var MODULE_TYPE_UID = 'userId';
var MODULE_TYPE_RTD = 'rtd';
var MODULE_TYPE_ANALYTICS = 'analytics';

/***/ }),

/***/ "./src/activities/params.js":
/*!**********************************!*\
  !*** ./src/activities/params.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTIVITY_PARAM_ADAPTER_CODE": function() { return /* binding */ ACTIVITY_PARAM_ADAPTER_CODE; },
/* harmony export */   "ACTIVITY_PARAM_ANL_CONFIG": function() { return /* binding */ ACTIVITY_PARAM_ANL_CONFIG; },
/* harmony export */   "ACTIVITY_PARAM_COMPONENT": function() { return /* binding */ ACTIVITY_PARAM_COMPONENT; },
/* harmony export */   "ACTIVITY_PARAM_COMPONENT_NAME": function() { return /* binding */ ACTIVITY_PARAM_COMPONENT_NAME; },
/* harmony export */   "ACTIVITY_PARAM_COMPONENT_TYPE": function() { return /* binding */ ACTIVITY_PARAM_COMPONENT_TYPE; },
/* harmony export */   "ACTIVITY_PARAM_S2S_NAME": function() { return /* binding */ ACTIVITY_PARAM_S2S_NAME; },
/* harmony export */   "ACTIVITY_PARAM_STORAGE_TYPE": function() { return /* binding */ ACTIVITY_PARAM_STORAGE_TYPE; },
/* harmony export */   "ACTIVITY_PARAM_SYNC_TYPE": function() { return /* binding */ ACTIVITY_PARAM_SYNC_TYPE; },
/* harmony export */   "ACTIVITY_PARAM_SYNC_URL": function() { return /* binding */ ACTIVITY_PARAM_SYNC_URL; },
/* harmony export */   "activityParamsBuilder": function() { return /* binding */ activityParamsBuilder; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules.js */ "./src/activities/modules.js");



/**
 * Component ID - who is trying to perform the activity?
 * Relevant for all activities.
 */
var ACTIVITY_PARAM_COMPONENT = 'component';
var ACTIVITY_PARAM_COMPONENT_TYPE = ACTIVITY_PARAM_COMPONENT + 'Type';
var ACTIVITY_PARAM_COMPONENT_NAME = ACTIVITY_PARAM_COMPONENT + 'Name';

/**
 * Code of the bid adapter that `componentName` is an alias of.
 * May be the same as the component name.
 *
 * relevant for all activities, but only when componentType is 'bidder'.
 */
var ACTIVITY_PARAM_ADAPTER_CODE = 'adapterCode';

/**
 * Storage type - either 'html5' or 'cookie'.
 * Relevant for: accessDevice
 */
var ACTIVITY_PARAM_STORAGE_TYPE = 'storageType';

/**
 * s2sConfig[].configName, used to identify a particular s2s instance
 * relevant for: fetchBids, but only when component is 'prebid.pbsBidAdapter'
 */
var ACTIVITY_PARAM_S2S_NAME = 'configName';
/**
 * user sync type - 'iframe' or 'pixel'
 * relevant for: syncUser
 */
var ACTIVITY_PARAM_SYNC_TYPE = 'syncType';
/**
 * user sync URL
 * relevant for: syncUser
 */
var ACTIVITY_PARAM_SYNC_URL = 'syncUrl';
/**
 * @private
 * configuration options for analytics adapter - the argument passed to `enableAnalytics`.
 * relevant for: reportAnalytics
 */
var ACTIVITY_PARAM_ANL_CONFIG = '_config';
function activityParamsBuilder(resolveAlias) {
  return function activityParams(moduleType, moduleName, params) {
    var _defaults;
    var defaults = (_defaults = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_defaults, ACTIVITY_PARAM_COMPONENT_TYPE, moduleType), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_defaults, ACTIVITY_PARAM_COMPONENT_NAME, moduleName), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_defaults, ACTIVITY_PARAM_COMPONENT, "".concat(moduleType, ".").concat(moduleName)), _defaults);
    if (moduleType === _modules_js__WEBPACK_IMPORTED_MODULE_1__.MODULE_TYPE_BIDDER) {
      defaults[ACTIVITY_PARAM_ADAPTER_CODE] = resolveAlias(moduleName);
    }
    return Object.assign(defaults, params);
  };
}

/***/ }),

/***/ "./src/activities/redactor.js":
/*!************************************!*\
  !*** ./src/activities/redactor.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "redactor": function() { return /* binding */ redactor; }
/* harmony export */ });
/* unused harmony exports ORTB_UFPD_PATHS, ORTB_EIDS_PATHS, ORTB_GEO_PATHS, redactRule, objectTransformer, isData, appliesWhenActivityDenied, ortb2TransmitRules, redactorFactory */
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _rules_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities.js */ "./src/activities/activities.js");


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var ORTB_UFPD_PATHS = ['user.data', 'user.ext.data'];
var ORTB_EIDS_PATHS = ['user.eids', 'user.ext.eids'];
var ORTB_GEO_PATHS = ['user.geo.lat', 'user.geo.lon', 'device.geo.lat', 'device.geo.lon'];

/**
 * @typedef TransformationRuleDef
 * @property {name}
 * @property {Array[string]} paths dot-separated list of paths that this rule applies to.
 * @property {function(*): boolean} applies a predicate that should return true if this rule applies
 * (and the transformation defined herein should be applied). The arguments are those passed to the transformation function.
 * @property {name} a name for the rule; used to debounce calls to `applies` (and avoid excessive logging):
 * if a rule with the same name was already found to apply (or not), this one will (or won't) as well.
 */

/**
 * @typedef RedactRuleDef A rule that removes, or replaces, values from an object (modifications are done in-place).
 * @augments TransformationRuleDef
 * @property {function(*): *} get? substitution functions for values that should be redacted;
 *  takes in the original (unredacted) value as an input, and returns a substitute to use in the redacted
 *  version. If it returns undefined, or this option is omitted, protected paths will be removed
 *  from the redacted object.
 */

/**
 * @param {RedactRuleDef} ruleDef
 * @return {TransformationRule}
 */
function redactRule(ruleDef) {
  return Object.assign({
    get: function get() {},
    run: function run(root, path, object, property, applies) {
      var val = object && object[property];
      if (isData(val) && applies()) {
        var repl = this.get(val);
        if (repl === undefined) {
          delete object[property];
        } else {
          object[property] = repl;
        }
      }
    }
  }, ruleDef);
}

/**
 * @typedef TransformationRule
 * @augments TransformationRuleDef
 * @property {function} run rule logic - see `redactRule` for an example.
 */

/**
 * @typedef {Function} TransformationFunction
 * @param object object to transform
 * @param ...args arguments to pass down to rule's `apply` methods.
 */

/**
 * Return a transformation function that will apply the given rules to an object.
 *
 * @param {Array[TransformationRule]} rules
 * @return {TransformationFunction}
 */
function objectTransformer(rules) {
  rules.forEach(function (rule) {
    rule.paths = rule.paths.map(function (path) {
      var parts = path.split('.');
      var tail = parts.pop();
      return [parts.length > 0 ? parts.join('.') : null, tail];
    });
  });
  return function applyTransform(session, obj) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var result = [];
    rules.forEach(function (rule) {
      if (session[rule.name] === false) return;
      var _iterator = _createForOfIteratorHelper(rule.paths),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_step.value, 2),
            head = _step$value[0],
            tail = _step$value[1];
          var parent = head == null ? obj : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"])(obj, head);
          result.push(rule.run(obj, head, parent, tail, function () {
            if (!session.hasOwnProperty(rule.name)) {
              session[rule.name] = !!rule.applies.apply(rule, args);
            }
            return session[rule.name];
          }));
          if (session[rule.name] === false) return;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    return result.filter(function (el) {
      return el != null;
    });
  };
}
function isData(val) {
  return val != null && ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(val) !== 'object' || Object.keys(val).length > 0);
}
function appliesWhenActivityDenied(activity) {
  var isAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _rules_js__WEBPACK_IMPORTED_MODULE_3__.isActivityAllowed;
  return function applies(params) {
    return !isAllowed(activity, params);
  };
}
function bidRequestTransmitRules() {
  var isAllowed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _rules_js__WEBPACK_IMPORTED_MODULE_3__.isActivityAllowed;
  return [{
    name: _activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_EIDS,
    paths: ['userId', 'userIdAsEids'],
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_EIDS, isAllowed)
  }].map(redactRule);
}
function ortb2TransmitRules() {
  var isAllowed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _rules_js__WEBPACK_IMPORTED_MODULE_3__.isActivityAllowed;
  return [{
    name: _activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_UFPD,
    paths: ORTB_UFPD_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_UFPD, isAllowed)
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_EIDS,
    paths: ORTB_EIDS_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_EIDS, isAllowed)
  }, {
    name: _activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_PRECISE_GEO,
    paths: ORTB_GEO_PATHS,
    applies: appliesWhenActivityDenied(_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_TRANSMIT_PRECISE_GEO, isAllowed),
    get: function get(val) {
      return Math.round((val + Number.EPSILON) * 100) / 100;
    }
  }].map(redactRule);
}
function redactorFactory() {
  var isAllowed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _rules_js__WEBPACK_IMPORTED_MODULE_3__.isActivityAllowed;
  var redactOrtb2 = objectTransformer(ortb2TransmitRules(isAllowed));
  var redactBidRequest = objectTransformer(bidRequestTransmitRules(isAllowed));
  return function redactor(params) {
    var session = {};
    return {
      ortb2: function ortb2(obj) {
        redactOrtb2(session, obj, params);
        return obj;
      },
      bidRequest: function bidRequest(obj) {
        redactBidRequest(session, obj, params);
        return obj;
      }
    };
  };
}

/**
 * Returns an object that can redact other privacy-sensitive objects according
 * to activity rules.
 *
 * @param {{}} params activity parameters to use for activity checks
 * @return {{ortb2: function({}): {}, bidRequest: function({}): {}}} methods
 *  that can redact disallowed data from ORTB2 and/or bid request objects.
 */
var redactor = redactorFactory();

/***/ }),

/***/ "./src/activities/rules.js":
/*!*********************************!*\
  !*** ./src/activities/rules.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isActivityAllowed": function() { return /* binding */ isActivityAllowed; },
/* harmony export */   "registerActivityControl": function() { return /* binding */ registerActivityControl; }
/* harmony export */ });
/* unused harmony export ruleRegistry */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./params.js */ "./src/activities/params.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


function ruleRegistry() {
  var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.prefixLog)('Activity control:');
  var registry = {};
  function getRules(activity) {
    return registry[activity] = registry[activity] || [];
  }
  function runRule(activity, name, rule, params) {
    var res;
    try {
      res = rule(params);
    } catch (e) {
      logger.logError("Exception in rule ".concat(name, " for '").concat(activity, "'"), e);
      res = {
        allow: false,
        reason: e
      };
    }
    return res && Object.assign({
      activity: activity,
      name: name,
      component: params[_params_js__WEBPACK_IMPORTED_MODULE_1__.ACTIVITY_PARAM_COMPONENT]
    }, res);
  }
  var dupes = {};
  var DEDUPE_INTERVAL = 1000;
  function logResult(_ref) {
    var activity = _ref.activity,
      name = _ref.name,
      allow = _ref.allow,
      reason = _ref.reason,
      component = _ref.component;
    var msg = "".concat(name, " ").concat(allow ? 'allowed' : 'denied', " '").concat(activity, "' for '").concat(component, "'").concat(reason ? ':' : '');
    var deduping = dupes.hasOwnProperty(msg);
    if (deduping) {
      clearTimeout(dupes[msg]);
    }
    dupes[msg] = setTimeout(function () {
      return delete dupes[msg];
    }, DEDUPE_INTERVAL);
    if (!deduping) {
      var parts = [msg];
      reason && parts.push(reason);
      (allow ? logger.logInfo : logger.logWarn).apply(logger, parts);
    }
  }
  return [
  /**
   * Register an activity control rule.
   *
   * @param {string} activity activity name - set is defined in `activities.js`
   * @param {string} ruleName a name for this rule; used for logging.
   * @param {function({}): {allow: boolean, reason?: string}} rule definition function. Takes in activity
   *        parameters as a single map; MAY return an object {allow, reason}, where allow is true/false,
   *        and reason is an optional message used for logging.
   *
   *        {allow: true} will allow this activity AS LONG AS no other rules with same or higher priority return {allow: false};
   *        {allow: false} will deny this activity AS LONG AS no other rules with higher priority return {allow: true};
   *        returning null/undefined has no effect - the decision is left to other rules.
   *        If no rule returns an allow value, the default is to allow the activity.
   *
   * @param {number} priority rule priority; lower number means higher priority
   * @returns {function(void): void} a function that unregisters the rule when called.
   */
  function registerActivityControl(activity, ruleName, rule) {
    var priority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var rules = getRules(activity);
    var pos = rules.findIndex(function (_ref2) {
      var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref2, 1),
        itemPriority = _ref3[0];
      return priority < itemPriority;
    });
    var entry = [priority, ruleName, rule];
    rules.splice(pos < 0 ? rules.length : pos, 0, entry);
    return function () {
      var idx = rules.indexOf(entry);
      if (idx >= 0) rules.splice(idx, 1);
    };
  },
  /**
   * Test whether an activity is allowed.
   *
   * @param {string} activity activity name
   * @param {{}} params activity parameters; should be generated through the `activityParams` utility.
   * @return {boolean} true for allow, false for deny.
   */
  function isActivityAllowed(activity, params) {
    var lastPriority, foundAllow;
    var _iterator = _createForOfIteratorHelper(getRules(activity)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_step.value, 3),
          priority = _step$value[0],
          name = _step$value[1],
          rule = _step$value[2];
        if (lastPriority !== priority && foundAllow) break;
        lastPriority = priority;
        var ruleResult = runRule(activity, name, rule, params);
        if (ruleResult) {
          if (!ruleResult.allow) {
            logResult(ruleResult);
            return false;
          } else {
            foundAllow = ruleResult;
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    foundAllow && logResult(foundAllow);
    return true;
  }];
}
var _ruleRegistry = ruleRegistry(),
  _ruleRegistry2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ruleRegistry, 2),
  registerActivityControl = _ruleRegistry2[0],
  isActivityAllowed = _ruleRegistry2[1];


/***/ }),

/***/ "./src/adRendering.js":
/*!****************************!*\
  !*** ./src/adRendering.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "emitAdRenderFail": function() { return /* binding */ emitAdRenderFail; },
/* harmony export */   "emitAdRenderSucceeded": function() { return /* binding */ emitAdRenderSucceeded; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");



var _CONSTANTS$EVENTS = _constants_json__WEBPACK_IMPORTED_MODULE_0__.EVENTS,
  AD_RENDER_FAILED = _CONSTANTS$EVENTS.AD_RENDER_FAILED,
  AD_RENDER_SUCCEEDED = _CONSTANTS$EVENTS.AD_RENDER_SUCCEEDED;

/**
 * Emit the AD_RENDER_FAILED event.
 *
 * @param reason one of the values in CONSTANTS.AD_RENDER_FAILED_REASON
 * @param message failure description
 * @param bid? bid response object that failed to render
 * @param id? adId that failed to render
 */
function emitAdRenderFail(_ref) {
  var reason = _ref.reason,
    message = _ref.message,
    bid = _ref.bid,
    id = _ref.id;
  var data = {
    reason: reason,
    message: message
  };
  if (bid) data.bid = bid;
  if (id) data.adId = id;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(message);
  _events_js__WEBPACK_IMPORTED_MODULE_2__.emit(AD_RENDER_FAILED, data);
}

/**
 * Emit the AD_RENDER_SUCCEEDED event.
 * (Note: Invocation of this function indicates that the render function did not generate an error, it does not guarantee that tracking for this event has occurred yet.)
 * @param doc document object that was used to `.write` the ad. Should be `null` if unavailable (e.g. for documents in
 * a cross-origin frame).
 * @param bid bid response object for the ad that was rendered
 * @param id adId that was rendered.
 */
function emitAdRenderSucceeded(_ref2) {
  var doc = _ref2.doc,
    bid = _ref2.bid,
    id = _ref2.id;
  var data = {
    doc: doc
  };
  if (bid) data.bid = bid;
  if (id) data.adId = id;
  _events_js__WEBPACK_IMPORTED_MODULE_2__.emit(AD_RENDER_SUCCEEDED, data);
}

/***/ }),

/***/ "./src/adUnits.js":
/*!************************!*\
  !*** ./src/adUnits.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adunitCounter": function() { return /* binding */ adunitCounter; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");

var adUnits = {};
function ensureAdUnit(adunit, bidderCode) {
  var adUnit = adUnits[adunit] = adUnits[adunit] || {
    bidders: {}
  };
  if (bidderCode) {
    return adUnit.bidders[bidderCode] = adUnit.bidders[bidderCode] || {};
  }
  return adUnit;
}
function incrementAdUnitCount(adunit, counter, bidderCode) {
  var adUnit = ensureAdUnit(adunit, bidderCode);
  adUnit[counter] = (adUnit[counter] || 0) + 1;
  return adUnit[counter];
}

/**
 * Increments and returns current Adunit counter
 * @param {string} adunit id
 * @returns {number} current adunit count
 */
function incrementRequestsCounter(adunit) {
  return incrementAdUnitCount(adunit, 'requestsCounter');
}

/**
 * Increments and returns current Adunit requests counter for a bidder
 * @param {string} adunit id
 * @param {string} bidderCode code
 * @returns {number} current adunit bidder requests count
 */
function incrementBidderRequestsCounter(adunit, bidderCode) {
  return incrementAdUnitCount(adunit, 'requestsCounter', bidderCode);
}

/**
 * Increments and returns current Adunit wins counter for a bidder
 * @param {string} adunit id
 * @param {string} bidderCode code
 * @returns {number} current adunit bidder requests count
 */
function incrementBidderWinsCounter(adunit, bidderCode) {
  return incrementAdUnitCount(adunit, 'winsCounter', bidderCode);
}

/**
 * Returns current Adunit counter
 * @param {string} adunit id
 * @returns {number} current adunit count
 */
function getRequestsCounter(adunit) {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(adUnits, "".concat(adunit, ".requestsCounter")) || 0;
}

/**
 * Returns current Adunit requests counter for a specific bidder code
 * @param {string} adunit id
 * @param {string} bidder code
 * @returns {number} current adunit bidder requests count
 */
function getBidderRequestsCounter(adunit, bidder) {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(adUnits, "".concat(adunit, ".bidders.").concat(bidder, ".requestsCounter")) || 0;
}

/**
 * Returns current Adunit requests counter for a specific bidder code
 * @param {string} adunit id
 * @param {string} bidder code
 * @returns {number} current adunit bidder requests count
 */
function getBidderWinsCounter(adunit, bidder) {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(adUnits, "".concat(adunit, ".bidders.").concat(bidder, ".winsCounter")) || 0;
}

/**
 * A module which counts how many times an adunit was called
 * @module adunitCounter
 */
var adunitCounter = {
  incrementRequestsCounter: incrementRequestsCounter,
  incrementBidderRequestsCounter: incrementBidderRequestsCounter,
  incrementBidderWinsCounter: incrementBidderWinsCounter,
  getRequestsCounter: getRequestsCounter,
  getBidderRequestsCounter: getBidderRequestsCounter,
  getBidderWinsCounter: getBidderWinsCounter
};


/***/ }),

/***/ "./src/adapter.js":
/*!************************!*\
  !*** ./src/adapter.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Adapter; }
/* harmony export */ });
function Adapter(code) {
  var bidderCode = code;
  function setBidderCode(code) {
    bidderCode = code;
  }
  function getBidderCode() {
    return bidderCode;
  }
  function callBids() {}
  return {
    callBids: callBids,
    setBidderCode: setBidderCode,
    getBidderCode: getBidderCode
  };
}

/***/ }),

/***/ "./src/adapterManager.js":
/*!*******************************!*\
  !*** ./src/adapterManager.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gdprDataHandler": function() { return /* binding */ gdprDataHandler; },
/* harmony export */   "getS2SBidderSet": function() { return /* binding */ getS2SBidderSet; },
/* harmony export */   "gppDataHandler": function() { return /* binding */ gppDataHandler; },
/* harmony export */   "uspDataHandler": function() { return /* binding */ uspDataHandler; }
/* harmony export */ });
/* unused harmony exports PARTITIONS, dep, _filterBidsForAdUnit, filterBidsForAdUnit, coppaDataHandler, setupAdUnitMediaTypes, _partitionBidders, partitionBidders */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _sizeMapping_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sizeMapping.js */ "./src/sizeMapping.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _ajax_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ajax.js */ "./src/ajax.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _adUnits_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./adUnits.js */ "./src/adUnits.js");
/* harmony import */ var _refererDetection_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./refererDetection.js */ "./src/refererDetection.js");
/* harmony import */ var _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./consentHandler.js */ "./src/consentHandler.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_redactor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./activities/redactor.js */ "./src/activities/redactor.js");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/** @module adaptermanger */





















var PBS_ADAPTER_NAME = 'pbsBidAdapter';
var PARTITIONS = {
  CLIENT: 'client',
  SERVER: 'server'
};
var dep = {
  isAllowed: _activities_rules_js__WEBPACK_IMPORTED_MODULE_1__.isActivityAllowed,
  redact: _activities_redactor_js__WEBPACK_IMPORTED_MODULE_2__.redactor
};
var adapterManager = {};
var _bidderRegistry = adapterManager.bidderRegistry = {};
var _aliasRegistry = adapterManager.aliasRegistry = {};
var _s2sConfigs = [];
_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('s2sConfig', function (config) {
  if (config && config.s2sConfig) {
    _s2sConfigs = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(config.s2sConfig) ? config.s2sConfig : [config.s2sConfig];
  }
});
var _analyticsRegistry = {};
var activityParams = (0,_activities_params_js__WEBPACK_IMPORTED_MODULE_5__.activityParamsBuilder)(function (alias) {
  return adapterManager.resolveAlias(alias);
});

/**
 * @typedef {object} LabelDescriptor
 * @property {boolean} labelAll describes whether or not this object expects all labels to match, or any label to match
 * @property {Array<string>} labels the labels listed on the bidder or adUnit
 * @property {Array<string>} activeLabels the labels specified as being active by requestBids
 */

function getBids(_ref) {
  var bidderCode = _ref.bidderCode,
    auctionId = _ref.auctionId,
    bidderRequestId = _ref.bidderRequestId,
    adUnits = _ref.adUnits,
    src = _ref.src,
    metrics = _ref.metrics;
  return adUnits.reduce(function (result, adUnit) {
    var bids = adUnit.bids.filter(function (bid) {
      return bid.bidder === bidderCode;
    });
    if (bidderCode == null && bids.length === 0 && adUnit.s2sBid != null) {
      bids.push({
        bidder: null
      });
    }
    result.push(bids.reduce(function (bids, bid) {
      bid = Object.assign({}, bid, {
        ortb2Imp: (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, adUnit.ortb2Imp, bid.ortb2Imp)
      }, (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getDefinedParams)(adUnit, ['nativeParams', 'nativeOrtbRequest', 'mediaType', 'renderer']));
      var mediaTypes = bid.mediaTypes == null ? adUnit.mediaTypes : bid.mediaTypes;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isValidMediaTypes)(mediaTypes)) {
        bid = Object.assign({}, bid, {
          mediaTypes: mediaTypes
        });
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("mediaTypes is not correctly configured for adunit ".concat(adUnit.code));
      }
      bids.push(Object.assign({}, bid, {
        adUnitCode: adUnit.code,
        transactionId: adUnit.transactionId,
        sizes: (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(mediaTypes, 'banner.sizes') || (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(mediaTypes, 'video.playerSize') || [],
        bidId: bid.bid_id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUniqueIdentifierStr)(),
        bidderRequestId: bidderRequestId,
        auctionId: auctionId,
        src: src,
        metrics: metrics,
        bidRequestsCount: _adUnits_js__WEBPACK_IMPORTED_MODULE_7__.adunitCounter.getRequestsCounter(adUnit.code),
        bidderRequestsCount: _adUnits_js__WEBPACK_IMPORTED_MODULE_7__.adunitCounter.getBidderRequestsCounter(adUnit.code, bid.bidder),
        bidderWinsCount: _adUnits_js__WEBPACK_IMPORTED_MODULE_7__.adunitCounter.getBidderWinsCounter(adUnit.code, bid.bidder)
      }));
      return bids;
    }, []));
    return result;
  }, []).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_4__.flatten, []).filter(function (val) {
    return val !== '';
  });
}
var hookedGetBids = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', getBids, 'getBids');

/**
 * Filter an adUnit's  bids for building client and/or server requests
 *
 * @param bids an array of bids as defined in an adUnit
 * @param s2sConfig null if the adUnit is being routed to a client adapter; otherwise the s2s adapter's config
 * @returns the subset of `bids` that are pertinent for the given `s2sConfig`
 */
function _filterBidsForAdUnit(bids, s2sConfig) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$getS2SBidders = _ref2.getS2SBidders,
    getS2SBidders = _ref2$getS2SBidders === void 0 ? getS2SBidderSet : _ref2$getS2SBidders;
  if (s2sConfig == null) {
    return bids;
  } else {
    var serverBidders = getS2SBidders(s2sConfig);
    return bids.filter(function (bid) {
      return serverBidders.has(bid.bidder);
    });
  }
}
var filterBidsForAdUnit = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', _filterBidsForAdUnit, 'filterBidsForAdUnit');
function getAdUnitCopyForPrebidServer(adUnits, s2sConfig) {
  var adUnitsCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnits);
  var hasModuleBids = false;
  adUnitsCopy.forEach(function (adUnit) {
    // filter out client side bids
    var s2sBids = adUnit.bids.filter(function (b) {
      var _b$params;
      return b.module === PBS_ADAPTER_NAME && ((_b$params = b.params) === null || _b$params === void 0 ? void 0 : _b$params.configName) === s2sConfig.configName;
    });
    if (s2sBids.length === 1) {
      adUnit.s2sBid = s2sBids[0];
      hasModuleBids = true;
      adUnit.ortb2Imp = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, adUnit.s2sBid.ortb2Imp, adUnit.ortb2Imp);
    } else if (s2sBids.length > 1) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('Multiple "module" bids for the same s2s configuration; all will be ignored', s2sBids);
    }
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, s2sConfig).map(function (bid) {
      bid.bid_id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUniqueIdentifierStr)();
      return bid;
    });
  });

  // don't send empty requests
  adUnitsCopy = adUnitsCopy.filter(function (adUnit) {
    return adUnit.bids.length !== 0 || adUnit.s2sBid != null;
  });
  return {
    adUnits: adUnitsCopy,
    hasModuleBids: hasModuleBids
  };
}
function getAdUnitCopyForClientAdapters(adUnits) {
  var adUnitsClientCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnits);
  adUnitsClientCopy.forEach(function (adUnit) {
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, null);
  });

  // don't send empty requests
  adUnitsClientCopy = adUnitsClientCopy.filter(function (adUnit) {
    return adUnit.bids.length !== 0;
  });
  return adUnitsClientCopy;
}
var gdprDataHandler = new _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GdprConsentHandler();
var uspDataHandler = new _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.UspConsentHandler();
var gppDataHandler = new _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GppConsentHandler();
var coppaDataHandler = {
  getCoppa: function getCoppa() {
    return !!_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('coppa');
  }
};

/**
 * Filter and/or modify media types for ad units based on the given labels.
 *
 * This should return adUnits that are active for the given labels, modified to have their `mediaTypes`
 * conform to size mapping configuration. If different bids for the same adUnit should use different `mediaTypes`,
 * they should be exposed under `adUnit.bids[].mediaTypes`.
 */
var setupAdUnitMediaTypes = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (adUnits, labels) {
  return (0,_sizeMapping_js__WEBPACK_IMPORTED_MODULE_10__.processAdUnitsForLabels)(adUnits, labels);
}, 'setupAdUnitMediaTypes');

/**
 * @param {{}|Array<{}>} s2sConfigs
 * @returns {Set<String>} a set of all the bidder codes that should be routed through the S2S adapter(s)
 *                        as defined in `s2sConfigs`
 */
function getS2SBidderSet(s2sConfigs) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(s2sConfigs)) s2sConfigs = [s2sConfigs];
  // `null` represents the "no bid bidder" - when an ad unit is meant only for S2S adapters, like stored impressions
  var serverBidders = new Set([null]);
  s2sConfigs.filter(function (s2s) {
    return s2s && s2s.enabled;
  }).flatMap(function (s2s) {
    return s2s.bidders;
  }).forEach(function (bidder) {
    return serverBidders.add(bidder);
  });
  return serverBidders;
}

/**
 * @returns {{[PARTITIONS.CLIENT]: Array<String>, [PARTITIONS.SERVER]: Array<String>}}
 *           All the bidder codes in the given `adUnits`, divided in two arrays -
 *           those that should be routed to client, and server adapters (according to the configuration in `s2sConfigs`).
 */
function _partitionBidders(adUnits, s2sConfigs) {
  var _getBidderCodes$reduc;
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref3$getS2SBidders = _ref3.getS2SBidders,
    getS2SBidders = _ref3$getS2SBidders === void 0 ? getS2SBidderSet : _ref3$getS2SBidders;
  var serverBidders = getS2SBidders(s2sConfigs);
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getBidderCodes)(adUnits).reduce(function (memo, bidder) {
    var partition = serverBidders.has(bidder) ? PARTITIONS.SERVER : PARTITIONS.CLIENT;
    memo[partition].push(bidder);
    return memo;
  }, (_getBidderCodes$reduc = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_getBidderCodes$reduc, PARTITIONS.CLIENT, []), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_getBidderCodes$reduc, PARTITIONS.SERVER, []), _getBidderCodes$reduc));
}
var partitionBidders = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', _partitionBidders, 'partitionBidders');
adapterManager.makeBidRequests = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (adUnits, auctionStart, auctionId, cbTimeout, labels) {
  var ortb2Fragments = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var auctionMetrics = arguments.length > 6 ? arguments[6] : undefined;
  auctionMetrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_11__.useMetrics)(auctionMetrics);
  /**
   * emit and pass adunits for external modification
   * @see {@link https://github.com/prebid/Prebid.js/issues/4149|Issue}
   */
  _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_13__.EVENTS.BEFORE_REQUEST_BIDS, adUnits);
  if (true) {
    (0,_native_js__WEBPACK_IMPORTED_MODULE_14__.decorateAdUnitsWithNativeParams)(adUnits);
  }

  // filter out bidders that cannot participate in the auction
  adUnits.forEach(function (au) {
    return au.bids = au.bids.filter(function (bid) {
      return !bid.bidder || dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_15__.ACTIVITY_FETCH_BIDS, activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_BIDDER, bid.bidder));
    });
  });
  adUnits = setupAdUnitMediaTypes(adUnits, labels);
  var _partitionBidders2 = partitionBidders(adUnits, _s2sConfigs),
    clientBidders = _partitionBidders2[PARTITIONS.CLIENT],
    serverBidders = _partitionBidders2[PARTITIONS.SERVER];
  if (_config_js__WEBPACK_IMPORTED_MODULE_3__.config.getConfig('bidderSequence') === _config_js__WEBPACK_IMPORTED_MODULE_3__.RANDOM) {
    clientBidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.shuffle)(clientBidders);
  }
  var refererInfo = (0,_refererDetection_js__WEBPACK_IMPORTED_MODULE_17__.getRefererInfo)();
  var bidRequests = [];
  var ortb2 = ortb2Fragments.global || {};
  var bidderOrtb2 = ortb2Fragments.bidder || {};
  function addOrtb2(bidderRequest) {
    var redact = dep.redact(activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_BIDDER, bidderRequest.bidderCode));
    var fpd = Object.freeze(redact.ortb2((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, ortb2, bidderOrtb2[bidderRequest.bidderCode])));
    bidderRequest.ortb2 = fpd;
    bidderRequest.bids = bidderRequest.bids.map(function (bid) {
      bid.ortb2 = fpd;
      return redact.bidRequest(bid);
    });
    return bidderRequest;
  }
  function isS2SAllowed(s2sConfig) {
    return dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_15__.ACTIVITY_FETCH_BIDS, activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_PREBID, PBS_ADAPTER_NAME, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _activities_params_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_PARAM_S2S_NAME, s2sConfig.configName)));
  }
  _s2sConfigs.forEach(function (s2sConfig) {
    if (s2sConfig && s2sConfig.enabled && isS2SAllowed(s2sConfig)) {
      var _getAdUnitCopyForPreb = getAdUnitCopyForPrebidServer(adUnits, s2sConfig),
        adUnitsS2SCopy = _getAdUnitCopyForPreb.adUnits,
        hasModuleBids = _getAdUnitCopyForPreb.hasModuleBids;

      // uniquePbsTid is so we know which server to send which bids to during the callBids function
      var uniquePbsTid = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.generateUUID)();
      (serverBidders.length === 0 && hasModuleBids ? [null] : serverBidders).forEach(function (bidderCode) {
        var bidderRequestId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUniqueIdentifierStr)();
        var metrics = auctionMetrics.fork();
        var bidderRequest = addOrtb2({
          bidderCode: bidderCode,
          auctionId: auctionId,
          bidderRequestId: bidderRequestId,
          uniquePbsTid: uniquePbsTid,
          bids: hookedGetBids({
            bidderCode: bidderCode,
            auctionId: auctionId,
            bidderRequestId: bidderRequestId,
            'adUnits': (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnitsS2SCopy),
            src: _constants_json__WEBPACK_IMPORTED_MODULE_13__.S2S.SRC,
            metrics: metrics
          }),
          auctionStart: auctionStart,
          timeout: s2sConfig.timeout,
          src: _constants_json__WEBPACK_IMPORTED_MODULE_13__.S2S.SRC,
          refererInfo: refererInfo,
          metrics: metrics
        });
        if (bidderRequest.bids.length !== 0) {
          bidRequests.push(bidderRequest);
        }
      });

      // update the s2sAdUnits object and remove all bids that didn't pass sizeConfig/label checks from getBids()
      // this is to keep consistency and only allow bids/adunits that passed the checks to go to pbs
      adUnitsS2SCopy.forEach(function (adUnitCopy) {
        var validBids = adUnitCopy.bids.filter(function (adUnitBid) {
          return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.find)(bidRequests, function (request) {
            return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.find)(request.bids, function (reqBid) {
              return reqBid.bidId === adUnitBid.bid_id;
            });
          });
        });
        adUnitCopy.bids = validBids;
      });
      bidRequests.forEach(function (request) {
        if (request.adUnitsS2SCopy === undefined) {
          request.adUnitsS2SCopy = adUnitsS2SCopy.filter(function (au) {
            return au.bids.length > 0 || au.s2sBid != null;
          });
        }
      });
    }
  });

  // client adapters
  var adUnitsClientCopy = getAdUnitCopyForClientAdapters(adUnits);
  clientBidders.forEach(function (bidderCode) {
    var bidderRequestId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUniqueIdentifierStr)();
    var metrics = auctionMetrics.fork();
    var bidderRequest = addOrtb2({
      bidderCode: bidderCode,
      auctionId: auctionId,
      bidderRequestId: bidderRequestId,
      bids: hookedGetBids({
        bidderCode: bidderCode,
        auctionId: auctionId,
        bidderRequestId: bidderRequestId,
        'adUnits': (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnitsClientCopy),
        labels: labels,
        src: 'client',
        metrics: metrics
      }),
      auctionStart: auctionStart,
      timeout: cbTimeout,
      refererInfo: refererInfo,
      metrics: metrics
    });
    var adapter = _bidderRegistry[bidderCode];
    if (!adapter) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("Trying to make a request for bidder that does not exist: ".concat(bidderCode));
    }
    if (adapter && bidderRequest.bids && bidderRequest.bids.length !== 0) {
      bidRequests.push(bidderRequest);
    }
  });
  bidRequests.forEach(function (bidRequest) {
    if (gdprDataHandler.getConsentData()) {
      bidRequest['gdprConsent'] = gdprDataHandler.getConsentData();
    }
    if (uspDataHandler.getConsentData()) {
      bidRequest['uspConsent'] = uspDataHandler.getConsentData();
    }
    if (gppDataHandler.getConsentData()) {
      bidRequest['gppConsent'] = gppDataHandler.getConsentData();
    }
  });
  return bidRequests;
}, 'makeBidRequests');
adapterManager.callBids = function (adUnits, bidRequests, addBidResponse, doneCb, requestCallbacks, requestBidsTimeout, onTimelyResponse) {
  var ortb2Fragments = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
  if (!bidRequests.length) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('callBids executed with no bidRequests.  Were they filtered by labels or sizing?');
    return;
  }
  var _bidRequests$reduce = bidRequests.reduce(function (partitions, bidRequest) {
      partitions[Number(typeof bidRequest.src !== 'undefined' && bidRequest.src === _constants_json__WEBPACK_IMPORTED_MODULE_13__.S2S.SRC)].push(bidRequest);
      return partitions;
    }, [[], []]),
    _bidRequests$reduce2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_19__["default"])(_bidRequests$reduce, 2),
    clientBidRequests = _bidRequests$reduce2[0],
    serverBidRequests = _bidRequests$reduce2[1];
  var uniqueServerBidRequests = [];
  serverBidRequests.forEach(function (serverBidRequest) {
    var index = -1;
    for (var i = 0; i < uniqueServerBidRequests.length; ++i) {
      if (serverBidRequest.uniquePbsTid === uniqueServerBidRequests[i].uniquePbsTid) {
        index = i;
        break;
      }
    }
    if (index <= -1) {
      uniqueServerBidRequests.push(serverBidRequest);
    }
  });
  var counter = 0;
  _s2sConfigs.forEach(function (s2sConfig) {
    if (s2sConfig && uniqueServerBidRequests[counter] && getS2SBidderSet(s2sConfig).has(uniqueServerBidRequests[counter].bidderCode)) {
      // s2s should get the same client side timeout as other client side requests.
      var s2sAjax = (0,_ajax_js__WEBPACK_IMPORTED_MODULE_20__.ajaxBuilder)(requestBidsTimeout, requestCallbacks ? {
        request: requestCallbacks.request.bind(null, 's2s'),
        done: requestCallbacks.done
      } : undefined);
      var adaptersServerSide = s2sConfig.bidders;
      var s2sAdapter = _bidderRegistry[s2sConfig.adapter];
      var uniquePbsTid = uniqueServerBidRequests[counter].uniquePbsTid;
      var adUnitsS2SCopy = uniqueServerBidRequests[counter].adUnitsS2SCopy;
      var uniqueServerRequests = serverBidRequests.filter(function (serverBidRequest) {
        return serverBidRequest.uniquePbsTid === uniquePbsTid;
      });
      if (s2sAdapter) {
        var s2sBidRequest = {
          'ad_units': adUnitsS2SCopy,
          s2sConfig: s2sConfig,
          ortb2Fragments: ortb2Fragments
        };
        if (s2sBidRequest.ad_units.length) {
          var doneCbs = uniqueServerRequests.map(function (bidRequest) {
            bidRequest.start = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.timestamp)();
            return doneCb.bind(bidRequest);
          });
          var bidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getBidderCodes)(s2sBidRequest.ad_units).filter(function (bidder) {
            return adaptersServerSide.includes(bidder);
          });
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)("CALLING S2S HEADER BIDDERS ==== ".concat(bidders.length > 0 ? bidders.join(', ') : 'No bidder specified, using "ortb2Imp" definition(s) only'));

          // fire BID_REQUESTED event for each s2s bidRequest
          uniqueServerRequests.forEach(function (bidRequest) {
            // add the new sourceTid
            _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_13__.EVENTS.BID_REQUESTED, _objectSpread(_objectSpread({}, bidRequest), {}, {
              tid: bidRequest.auctionId
            }));
          });

          // make bid requests
          s2sAdapter.callBids(s2sBidRequest, serverBidRequests, addBidResponse, function () {
            return doneCbs.forEach(function (done) {
              return done();
            });
          }, s2sAjax);
        }
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('missing ' + s2sConfig.adapter);
      }
      counter++;
    }
  });

  // handle client adapter requests
  clientBidRequests.forEach(function (bidRequest) {
    bidRequest.start = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.timestamp)();
    // TODO : Do we check for bid in pool from here and skip calling adapter again ?
    var adapter = _bidderRegistry[bidRequest.bidderCode];
    _config_js__WEBPACK_IMPORTED_MODULE_3__.config.runWithBidder(bidRequest.bidderCode, function () {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)("CALLING BIDDER");
      _events_js__WEBPACK_IMPORTED_MODULE_12__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_13__.EVENTS.BID_REQUESTED, bidRequest);
    });
    var ajax = (0,_ajax_js__WEBPACK_IMPORTED_MODULE_20__.ajaxBuilder)(requestBidsTimeout, requestCallbacks ? {
      request: requestCallbacks.request.bind(null, bidRequest.bidderCode),
      done: requestCallbacks.done
    } : undefined);
    var adapterDone = doneCb.bind(bidRequest);
    try {
      _config_js__WEBPACK_IMPORTED_MODULE_3__.config.runWithBidder(bidRequest.bidderCode, _utils_js__WEBPACK_IMPORTED_MODULE_4__.bind.call(adapter.callBids, adapter, bidRequest, addBidResponse, adapterDone, ajax, onTimelyResponse, _config_js__WEBPACK_IMPORTED_MODULE_3__.config.callbackWithBidder(bidRequest.bidderCode)));
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("".concat(bidRequest.bidderCode, " Bid Adapter emitted an uncaught error when parsing their bidRequest"), {
        e: e,
        bidRequest: bidRequest
      });
      adapterDone();
    }
  });
};
function getSupportedMediaTypes(bidderCode) {
  var supportedMediaTypes = [];
  if ( true && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(adapterManager.videoAdapters, bidderCode)) supportedMediaTypes.push('video');
  if ( true && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(_native_js__WEBPACK_IMPORTED_MODULE_14__.nativeAdapters, bidderCode)) supportedMediaTypes.push('native');
  return supportedMediaTypes;
}
adapterManager.videoAdapters = []; // added by adapterLoader for now

adapterManager.registerBidAdapter = function (bidAdapter, bidderCode) {
  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref4$supportedMediaT = _ref4.supportedMediaTypes,
    supportedMediaTypes = _ref4$supportedMediaT === void 0 ? [] : _ref4$supportedMediaT;
  if (bidAdapter && bidderCode) {
    if (typeof bidAdapter.callBids === 'function') {
      var _bidAdapter$getSpec;
      _bidderRegistry[bidderCode] = bidAdapter;
      _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GDPR_GVLIDS.register(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_BIDDER, bidderCode, (_bidAdapter$getSpec = bidAdapter.getSpec) === null || _bidAdapter$getSpec === void 0 ? void 0 : _bidAdapter$getSpec.call(bidAdapter).gvlid);
      if ( true && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(supportedMediaTypes, 'video')) {
        adapterManager.videoAdapters.push(bidderCode);
      }
      if ( true && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(supportedMediaTypes, 'native')) {
        _native_js__WEBPACK_IMPORTED_MODULE_14__.nativeAdapters.push(bidderCode);
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Bidder adaptor error for bidder code: ' + bidderCode + 'bidder must implement a callBids() function');
    }
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('bidAdapter or bidderCode not specified');
  }
};
adapterManager.aliasBidAdapter = function (bidderCode, alias, options) {
  var existingAlias = _bidderRegistry[alias];
  if (typeof existingAlias === 'undefined') {
    var bidAdapter = _bidderRegistry[bidderCode];
    if (typeof bidAdapter === 'undefined') {
      // check if alias is part of s2sConfig and allow them to register if so (as base bidder may be s2s-only)
      var nonS2SAlias = [];
      _s2sConfigs.forEach(function (s2sConfig) {
        if (s2sConfig.bidders && s2sConfig.bidders.length) {
          var s2sBidders = s2sConfig && s2sConfig.bidders;
          if (!(s2sConfig && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(s2sBidders, alias))) {
            nonS2SAlias.push(bidderCode);
          } else {
            _aliasRegistry[alias] = bidderCode;
          }
        }
      });
      nonS2SAlias.forEach(function (bidderCode) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('bidderCode "' + bidderCode + '" is not an existing bidder.', 'adapterManager.aliasBidAdapter');
      });
    } else {
      try {
        var newAdapter;
        var supportedMediaTypes = getSupportedMediaTypes(bidderCode);
        // Have kept old code to support backward compatibilitiy.
        // Remove this if loop when all adapters are supporting bidderFactory. i.e When Prebid.js is 1.0
        if (bidAdapter.constructor.prototype != Object.prototype) {
          newAdapter = new bidAdapter.constructor();
          newAdapter.setBidderCode(alias);
        } else {
          var spec = bidAdapter.getSpec();
          var gvlid = options && options.gvlid;
          var skipPbsAliasing = options && options.skipPbsAliasing;
          newAdapter = (0,_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_21__.newBidder)(Object.assign({}, spec, {
            code: alias,
            gvlid: gvlid,
            skipPbsAliasing: skipPbsAliasing
          }));
          _aliasRegistry[alias] = bidderCode;
        }
        adapterManager.registerBidAdapter(newAdapter, alias, {
          supportedMediaTypes: supportedMediaTypes
        });
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(bidderCode + ' bidder does not currently support aliasing.', 'adapterManager.aliasBidAdapter');
      }
    }
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)('alias name "' + alias + '" has been already specified.');
  }
};
adapterManager.resolveAlias = function (alias) {
  var code = alias;
  var visited;
  while (_aliasRegistry[code] && (!visited || !visited.has(code))) {
    code = _aliasRegistry[code];
    (visited = visited || new Set()).add(code);
  }
  return code;
};
adapterManager.registerAnalyticsAdapter = function (_ref5) {
  var adapter = _ref5.adapter,
    code = _ref5.code,
    gvlid = _ref5.gvlid;
  if (adapter && code) {
    if (typeof adapter.enableAnalytics === 'function') {
      adapter.code = code;
      _analyticsRegistry[code] = {
        adapter: adapter,
        gvlid: gvlid
      };
      _consentHandler_js__WEBPACK_IMPORTED_MODULE_9__.GDPR_GVLIDS.register(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_ANALYTICS, code, gvlid);
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("Prebid Error: Analytics adaptor error for analytics \"".concat(code, "\"\n        analytics adapter must implement an enableAnalytics() function"));
    }
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Prebid Error: analyticsAdapter or analyticsCode not specified');
  }
};
adapterManager.enableAnalytics = function (config) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(config)) {
    config = [config];
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__._each)(config, function (adapterConfig) {
    var entry = _analyticsRegistry[adapterConfig.provider];
    if (entry && entry.adapter) {
      if (dep.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_15__.ACTIVITY_REPORT_ANALYTICS, activityParams(_activities_modules_js__WEBPACK_IMPORTED_MODULE_16__.MODULE_TYPE_ANALYTICS, adapterConfig.provider, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _activities_params_js__WEBPACK_IMPORTED_MODULE_5__.ACTIVITY_PARAM_ANL_CONFIG, adapterConfig)))) {
        entry.adapter.enableAnalytics(adapterConfig);
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("Prebid Error: no analytics adapter found in registry for '".concat(adapterConfig.provider, "'."));
    }
  });
};
adapterManager.getBidAdapter = function (bidder) {
  return _bidderRegistry[bidder];
};
adapterManager.getAnalyticsAdapter = function (code) {
  return _analyticsRegistry[code];
};
function getBidderMethod(bidder, method) {
  var adapter = _bidderRegistry[bidder];
  var spec = (adapter === null || adapter === void 0 ? void 0 : adapter.getSpec) && adapter.getSpec();
  if (spec && spec[method] && typeof spec[method] === 'function') {
    return [spec, spec[method]];
  }
}
function invokeBidderMethod(bidder, method, spec, fn) {
  try {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking ".concat(bidder, ".").concat(method));
    for (var _len = arguments.length, params = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      params[_key - 4] = arguments[_key];
    }
    _config_js__WEBPACK_IMPORTED_MODULE_3__.config.runWithBidder(bidder, fn.bind.apply(fn, [spec].concat(params)));
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("Error calling ".concat(method, " of ").concat(bidder));
  }
}
function tryCallBidderMethod(bidder, method, param) {
  var target = getBidderMethod(bidder, method);
  if (target != null) {
    invokeBidderMethod.apply(void 0, [bidder, method].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_22__["default"])(target), [param]));
  }
}
adapterManager.callTimedOutBidders = function (adUnits, timedOutBidders, cbTimeout) {
  timedOutBidders = timedOutBidders.map(function (timedOutBidder) {
    // Adding user configured params & timeout to timeout event data
    timedOutBidder.params = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUserConfiguredParams)(adUnits, timedOutBidder.adUnitCode, timedOutBidder.bidder);
    timedOutBidder.timeout = cbTimeout;
    return timedOutBidder;
  });
  timedOutBidders = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.groupBy)(timedOutBidders, 'bidder');
  Object.keys(timedOutBidders).forEach(function (bidder) {
    tryCallBidderMethod(bidder, 'onTimeout', timedOutBidders[bidder]);
  });
};
adapterManager.callBidWonBidder = function (bidder, bid, adUnits) {
  // Adding user configured params to bidWon event data
  bid.params = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.getUserConfiguredParams)(adUnits, bid.adUnitCode, bid.bidder);
  _adUnits_js__WEBPACK_IMPORTED_MODULE_7__.adunitCounter.incrementBidderWinsCounter(bid.adUnitCode, bid.bidder);
  tryCallBidderMethod(bidder, 'onBidWon', bid);
};
adapterManager.callBidBillableBidder = function (bid) {
  tryCallBidderMethod(bid.bidder, 'onBidBillable', bid);
};
adapterManager.callSetTargetingBidder = function (bidder, bid) {
  tryCallBidderMethod(bidder, 'onSetTargeting', bid);
};
adapterManager.callBidViewableBidder = function (bidder, bid) {
  tryCallBidderMethod(bidder, 'onBidViewable', bid);
};
adapterManager.callBidderError = function (bidder, error, bidderRequest) {
  var param = {
    error: error,
    bidderRequest: bidderRequest
  };
  tryCallBidderMethod(bidder, 'onBidderError', param);
};
function resolveAlias(alias) {
  var seen = new Set();
  while (_aliasRegistry.hasOwnProperty(alias) && !seen.has(alias)) {
    seen.add(alias);
    alias = _aliasRegistry[alias];
  }
  return alias;
}
/**
 * Ask every adapter to delete PII.
 * See https://github.com/prebid/Prebid.js/issues/9081
 */
adapterManager.callDataDeletionRequest = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  var method = 'onDataDeletionRequest';
  Object.keys(_bidderRegistry).filter(function (bidder) {
    return !_aliasRegistry.hasOwnProperty(bidder);
  }).forEach(function (bidder) {
    var target = getBidderMethod(bidder, method);
    if (target != null) {
      var bidderRequests = _auctionManager_js__WEBPACK_IMPORTED_MODULE_23__.auctionManager.getBidsRequested().filter(function (br) {
        return resolveAlias(br.bidderCode) === bidder;
      });
      invokeBidderMethod.apply(void 0, [bidder, method].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_22__["default"])(target), [bidderRequests], args));
    }
  });
  Object.entries(_analyticsRegistry).forEach(function (_ref6) {
    var _entry$adapter;
    var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_19__["default"])(_ref6, 2),
      name = _ref7[0],
      entry = _ref7[1];
    var fn = entry === null || entry === void 0 ? void 0 : (_entry$adapter = entry.adapter) === null || _entry$adapter === void 0 ? void 0 : _entry$adapter[method];
    if (typeof fn === 'function') {
      try {
        fn.apply(entry.adapter, args);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("error calling ".concat(method, " of ").concat(name), e);
      }
    }
  });
});
/* harmony default export */ __webpack_exports__["default"] = (adapterManager);

/***/ }),

/***/ "./src/adapters/bidderFactory.js":
/*!***************************************!*\
  !*** ./src/adapters/bidderFactory.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newBidder": function() { return /* binding */ newBidder; },
/* harmony export */   "registerBidder": function() { return /* binding */ registerBidder; }
/* harmony export */ });
/* unused harmony exports storage, processBidderRequests, registerSyncInner, addComponentAuction, preloadBidderMappingFile, getIabSubCategory, isValid */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _adapter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapter.js */ "./src/adapter.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../userSync.js */ "./src/userSync.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../native.js */ "./src/native.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../video.js */ "./src/video.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants.json */ "./src/constants.json");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../events.js */ "./src/events.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _ajax_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../ajax.js */ "./src/ajax.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/perfMetrics.js */ "./src/utils/perfMetrics.js");




















var storage = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_0__.getCoreStorageManager)('bidderFactory');

/**
 * This file aims to support Adapters during the Prebid 0.x -> 1.x transition.
 *
 * Prebid 1.x and Prebid 0.x will be in separate branches--perhaps for a long time.
 * This function defines an API for adapter construction which is compatible with both versions.
 * Adapters which use it can maintain their code in master, and only this file will need to change
 * in the 1.x branch.
 *
 * Typical usage looks something like:
 *
 * const adapter = registerBidder({
 *   code: 'myBidderCode',
 *   aliases: ['alias1', 'alias2'],
 *   supportedMediaTypes: ['video', 'native'],
 *   isBidRequestValid: function(paramsObject) { return true/false },
 *   buildRequests: function(bidRequests, bidderRequest) { return some ServerRequest(s) },
 *   interpretResponse: function(oneServerResponse) { return some Bids, or throw an error. }
 * });
 *
 * @see BidderSpec for the full API and more thorough descriptions.
 *
 */

/**
 * @typedef {object} BidderSpec An object containing the adapter-specific functions needed to
 * make a Bidder.
 *
 * @property {string} code A code which will be used to uniquely identify this bidder. This should be the same
 *   one as is used in the call to registerBidAdapter
 * @property {string[]} [aliases] A list of aliases which should also resolve to this bidder.
 * @property {MediaType[]} [supportedMediaTypes]: A list of Media Types which the adapter supports.
 * @property {function(object): boolean} isBidRequestValid Determines whether or not the given bid has all the params
 *   needed to make a valid request.
 * @property {function(BidRequest[], bidderRequest): ServerRequest|ServerRequest[]} buildRequests Build the request to the Server
 *   which requests Bids for the given array of Requests. Each BidRequest in the argument array is guaranteed to have
 *   passed the isBidRequestValid() test.
 * @property {function(ServerResponse, BidRequest): Bid[]} interpretResponse Given a successful response from the Server,
 *   interpret it and return the Bid objects. This function will be run inside a try/catch.
 *   If it throws any errors, your bids will be discarded.
 * @property {function(SyncOptions, ServerResponse[]): UserSync[]} [getUserSyncs] Given an array of all the responses
 *   from the server, determine which user syncs should occur. The argument array will contain every element
 *   which has been sent through to interpretResponse. The order of syncs in this array matters. The most
 *   important ones should come first, since publishers may limit how many are dropped on their page.
 * @property {function(object): object} transformBidParams Updates bid params before creating bid request
 }}
 */

/**
 * @typedef {object} BidRequest
 *
 * @property {string} bidId A string which uniquely identifies this BidRequest in the current Auction.
 * @property {object} params Any bidder-specific params which the publisher used in their bid request.
 */

/**
 * @typedef {object} BidderAuctionResponse An object encapsulating an adapter response for current Auction
 *
 * @property {Array<Bid>} bids Contextual bids returned by this adapter, if any
 * @property {object|null} fledgeAuctionConfigs Optional FLEDGE response, as a map of impid -> auction_config
 */

/**
 * @typedef {object} ServerRequest
 *
 * @property {('GET'|'POST')} method The type of request which this is.
 * @property {string} url The endpoint for the request. For example, "//bids.example.com".
 * @property {string|object} data Data to be sent in the request.
 * @property {object} options Content-Type set in the header of the bid request, overrides default 'text/plain'.
 *   If this is a GET request, they'll become query params. If it's a POST request, they'll be added to the body.
 *   Strings will be added as-is. Objects will be unpacked into query params based on key/value mappings, or
 *   JSON-serialized into the Request body.
 */

/**
 * @typedef {object} ServerResponse
 *
 * @property {*} body The response body. If this is legal JSON, then it will be parsed. Otherwise it'll be a
 *   string with the body's content.
 * @property {{get: function(string): string} headers The response headers.
 *   Call this like `ServerResponse.headers.get("Content-Type")`
 */

/**
 * @typedef {object} Bid
 *
 * @property {string} requestId The specific BidRequest which this bid is aimed at.
 *   This should match the BidRequest.bidId which this Bid targets.
 * @property {string} ad A URL which can be used to load this ad, if it's chosen by the publisher.
 * @property {string} currency The currency code for the cpm value
 * @property {number} cpm The bid price, in US cents per thousand impressions.
 * @property {number} ttl Time-to-live - how long (in seconds) Prebid can use this bid.
 * @property {boolean} netRevenue Boolean defining whether the bid is Net or Gross.  The default is true (Net).
 * @property {number} height The height of the ad, in pixels.
 * @property {number} width The width of the ad, in pixels.
 *
 * @property {object} [native] Object for storing native creative assets
 * @property {object} [video] Object for storing video response data
 * @property {object} [meta] Object for storing bid meta data
 * @property {string} [meta.primaryCatId] The IAB primary category ID
 * @property [Renderer] renderer A Renderer which can be used as a default for this bid,
 *   if the publisher doesn't override it. This is only relevant for Outstream Video bids.
 */

/**
 * @typedef {Object} SyncOptions
 *
 * An object containing information about usersyncs which the adapter should obey.
 *
 * @property {boolean} iframeEnabled True if iframe usersyncs are allowed, and false otherwise
 * @property {boolean} pixelEnabled True if image usersyncs are allowed, and false otherwise
 */

/**
 * TODO: Move this to the UserSync module after that PR is merged.
 *
 * @typedef {object} UserSync
 *
 * @property {('image'|'iframe')} type The type of user sync to be done.
 * @property {string} url The URL which makes the sync happen.
 */

// common params for all mediaTypes
var COMMON_BID_RESPONSE_KEYS = ['cpm', 'ttl', 'creativeId', 'netRevenue', 'currency'];
var DEFAULT_REFRESHIN_DAYS = 1;

/**
 * Register a bidder with prebid, using the given spec.
 *
 * If possible, Adapter modules should use this function instead of adapterManager.registerBidAdapter().
 *
 * @param {BidderSpec} spec An object containing the bare-bones functions we need to make a Bidder.
 */
function registerBidder(spec) {
  var mediaTypes = Array.isArray(spec.supportedMediaTypes) ? {
    supportedMediaTypes: spec.supportedMediaTypes
  } : undefined;
  function putBidder(spec) {
    var bidder = newBidder(spec);
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].registerBidAdapter(bidder, spec.code, mediaTypes);
  }
  putBidder(spec);
  if (Array.isArray(spec.aliases)) {
    spec.aliases.forEach(function (alias) {
      var aliasCode = alias;
      var gvlid;
      var skipPbsAliasing;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(alias)) {
        aliasCode = alias.code;
        gvlid = alias.gvlid;
        skipPbsAliasing = alias.skipPbsAliasing;
      }
      _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].aliasRegistry[aliasCode] = spec.code;
      putBidder(Object.assign({}, spec, {
        code: aliasCode,
        gvlid: gvlid,
        skipPbsAliasing: skipPbsAliasing
      }));
    });
  }
}

/**
 * Make a new bidder from the given spec. This is exported mainly for testing.
 * Adapters will probably find it more convenient to use registerBidder instead.
 *
 * @param {BidderSpec} spec
 */
function newBidder(spec) {
  return Object.assign(new _adapter_js__WEBPACK_IMPORTED_MODULE_3__["default"](spec.code), {
    getSpec: function getSpec() {
      return Object.freeze(Object.assign({}, spec));
    },
    registerSyncs: registerSyncs,
    callBids: function callBids(bidderRequest, addBidResponse, done, ajax, onTimelyResponse, configEnabledCallback) {
      if (!Array.isArray(bidderRequest.bids)) {
        return;
      }
      var adUnitCodesHandled = {};
      function addBidWithCode(adUnitCode, bid) {
        var metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__.useMetrics)(bid.metrics);
        metrics.checkpoint('addBidResponse');
        adUnitCodesHandled[adUnitCode] = true;
        if (metrics.measureTime('addBidResponse.validate', function () {
          return isValid(adUnitCode, bid);
        })) {
          addBidResponse(adUnitCode, bid);
        } else {
          addBidResponse.reject(adUnitCode, bid, _constants_json__WEBPACK_IMPORTED_MODULE_5__.REJECTION_REASON.INVALID);
        }
      }

      // After all the responses have come back, call done() and
      // register any required usersync pixels.
      var responses = [];
      function afterAllResponses() {
        done();
        _config_js__WEBPACK_IMPORTED_MODULE_6__.config.runWithBidder(spec.code, function () {
          _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_5__.EVENTS.BIDDER_DONE, bidderRequest);
          registerSyncs(responses, bidderRequest.gdprConsent, bidderRequest.uspConsent, bidderRequest.gppConsent);
        });
      }
      var validBidRequests = adapterMetrics(bidderRequest).measureTime('validate', function () {
        return bidderRequest.bids.filter(filterAndWarn);
      });
      if (validBidRequests.length === 0) {
        afterAllResponses();
        return;
      }
      var bidRequestMap = {};
      validBidRequests.forEach(function (bid) {
        bidRequestMap[bid.bidId] = bid;
        // Delete this once we are 1.0
        if (!bid.adUnitCode) {
          bid.adUnitCode = bid.placementCode;
        }
      });
      processBidderRequests(spec, validBidRequests, bidderRequest, ajax, configEnabledCallback, {
        onRequest: function onRequest(requestObject) {
          return _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_5__.EVENTS.BEFORE_BIDDER_HTTP, bidderRequest, requestObject);
        },
        onResponse: function onResponse(resp) {
          onTimelyResponse(spec.code);
          responses.push(resp);
        },
        /** Process eventual BidderAuctionResponse.fledgeAuctionConfig field in response.
         * @param {Array<FledgeAuctionConfig>} fledgeAuctionConfigs
         */
        onFledgeAuctionConfigs: function onFledgeAuctionConfigs(fledgeAuctionConfigs) {
          fledgeAuctionConfigs.forEach(function (fledgeAuctionConfig) {
            var bidRequest = bidRequestMap[fledgeAuctionConfig.bidId];
            if (bidRequest) {
              addComponentAuction(bidRequest.adUnitCode, fledgeAuctionConfig.config);
            } else {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)('Received fledge auction configuration for an unknown bidId', fledgeAuctionConfig);
            }
          });
        },
        // If the server responds with an error, there's not much we can do beside logging.
        onError: function onError(errorMessage, error) {
          onTimelyResponse(spec.code);
          _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].callBidderError(spec.code, error, bidderRequest);
          _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_5__.EVENTS.BIDDER_ERROR, {
            error: error,
            bidderRequest: bidderRequest
          });
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Server call for ".concat(spec.code, " failed: ").concat(errorMessage, " ").concat(error.status, ". Continuing without bids."));
        },
        onBid: function onBid(bid) {
          var bidRequest = bidRequestMap[bid.requestId];
          if (bidRequest) {
            bid.adapterCode = bidRequest.bidder;
            if (isInvalidAlternateBidder(bid.bidderCode, bidRequest.bidder)) {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("".concat(bid.bidderCode, " is not a registered partner or known bidder of ").concat(bidRequest.bidder, ", hence continuing without bid. If you wish to support this bidder, please mark allowAlternateBidderCodes as true in bidderSettings."));
              addBidResponse.reject(bidRequest.adUnitCode, bid, _constants_json__WEBPACK_IMPORTED_MODULE_5__.REJECTION_REASON.BIDDER_DISALLOWED);
              return;
            }
            // creating a copy of original values as cpm and currency are modified later
            bid.originalCpm = bid.cpm;
            bid.originalCurrency = bid.currency;
            bid.meta = bid.meta || Object.assign({}, bid[bidRequest.bidder]);
            var prebidBid = Object.assign((0,_bidfactory_js__WEBPACK_IMPORTED_MODULE_8__.createBid)(_constants_json__WEBPACK_IMPORTED_MODULE_5__.STATUS.GOOD, bidRequest), bid);
            addBidWithCode(bidRequest.adUnitCode, prebidBid);
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Bidder ".concat(spec.code, " made bid for unknown request ID: ").concat(bid.requestId, ". Ignoring."));
            addBidResponse.reject(null, bid, _constants_json__WEBPACK_IMPORTED_MODULE_5__.REJECTION_REASON.INVALID_REQUEST_ID);
          }
        },
        onCompletion: afterAllResponses
      });
    }
  });
  function isInvalidAlternateBidder(responseBidder, requestBidder) {
    var allowAlternateBidderCodes = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_9__.bidderSettings.get(requestBidder, 'allowAlternateBidderCodes') || false;
    var alternateBiddersList = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_9__.bidderSettings.get(requestBidder, 'allowedAlternateBidderCodes');
    if (!!responseBidder && !!requestBidder && requestBidder !== responseBidder) {
      alternateBiddersList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isArray)(alternateBiddersList) ? alternateBiddersList.map(function (val) {
        return val.trim().toLowerCase();
      }).filter(function (val) {
        return !!val;
      }).filter(_utils_js__WEBPACK_IMPORTED_MODULE_2__.uniques) : alternateBiddersList;
      if (!allowAlternateBidderCodes || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isArray)(alternateBiddersList) && alternateBiddersList[0] !== '*' && !alternateBiddersList.includes(responseBidder)) {
        return true;
      }
    }
    return false;
  }
  function registerSyncs(responses, gdprConsent, uspConsent, gppConsent) {
    registerSyncInner(spec, responses, gdprConsent, uspConsent, gppConsent);
  }
  function filterAndWarn(bid) {
    if (!spec.isBidRequestValid(bid)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Invalid bid sent to bidder ".concat(spec.code, ": ").concat(JSON.stringify(bid)));
      return false;
    }
    return true;
  }
}

/**
 * Run a set of bid requests - that entails converting them to HTTP requests, sending
 * them over the network, and parsing the responses.
 *
 * @param spec bid adapter spec
 * @param bids bid requests to run
 * @param bidderRequest the bid request object that `bids` is connected to
 * @param ajax ajax method to use
 * @param wrapCallback {function(callback)} a function used to wrap every callback (for the purpose of `config.currentBidder`)
 * @param onRequest {function({})} invoked once for each HTTP request built by the adapter - with the raw request
 * @param onResponse {function({})} invoked once on each successful HTTP response - with the raw response
 * @param onError {function(String, {})} invoked once for each HTTP error - with status code and response
 * @param onBid {function({})} invoked once for each bid in the response - with the bid as returned by interpretResponse
 * @param onCompletion {function()} invoked once when all bid requests have been processed
 */
var processBidderRequests = (0,_hook_js__WEBPACK_IMPORTED_MODULE_10__.hook)('sync', function (spec, bids, bidderRequest, ajax, wrapCallback, _ref) {
  var onRequest = _ref.onRequest,
    onResponse = _ref.onResponse,
    onFledgeAuctionConfigs = _ref.onFledgeAuctionConfigs,
    onError = _ref.onError,
    onBid = _ref.onBid,
    onCompletion = _ref.onCompletion;
  var metrics = adapterMetrics(bidderRequest);
  onCompletion = metrics.startTiming('total').stopBefore(onCompletion);
  var requests = metrics.measureTime('buildRequests', function () {
    return spec.buildRequests(bids, bidderRequest);
  });
  if (!requests || requests.length === 0) {
    onCompletion();
    return;
  }
  if (!Array.isArray(requests)) {
    requests = [requests];
  }
  var requestDone = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.delayExecution)(onCompletion, requests.length);
  requests.forEach(function (request) {
    var requestMetrics = metrics.fork();
    function addBid(bid) {
      if (bid != null) bid.metrics = requestMetrics.fork().renameWith();
      onBid(bid);
    }
    // If the server responds successfully, use the adapter code to unpack the Bids from it.
    // If the adapter code fails, no bids should be added. After all the bids have been added,
    // make sure to call the `requestDone` function so that we're one step closer to calling onCompletion().
    var onSuccess = wrapCallback(function (response, responseObj) {
      networkDone();
      try {
        response = JSON.parse(response);
      } catch (e) {/* response might not be JSON... that's ok. */}

      // Make response headers available for #1742. These are lazy-loaded because most adapters won't need them.
      response = {
        body: response,
        headers: headerParser(responseObj)
      };
      onResponse(response);
      try {
        response = requestMetrics.measureTime('interpretResponse', function () {
          return spec.interpretResponse(response, request);
        });
      } catch (err) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Bidder ".concat(spec.code, " failed to interpret the server's response. Continuing without bids"), null, err);
        requestDone();
        return;
      }
      var bids;
      // Extract additional data from a structured {BidderAuctionResponse} response
      if (response && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isArray)(response.fledgeAuctionConfigs)) {
        onFledgeAuctionConfigs(response.fledgeAuctionConfigs);
        bids = response.bids;
      } else {
        bids = response;
      }
      if (bids) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isArray)(bids)) {
          bids.forEach(addBid);
        } else {
          addBid(bids);
        }
      }
      requestDone();
      function headerParser(xmlHttpResponse) {
        return {
          get: responseObj.getResponseHeader.bind(responseObj)
        };
      }
    });
    var onFailure = wrapCallback(function (errorMessage, error) {
      networkDone();
      onError(errorMessage, error);
      requestDone();
    });
    onRequest(request);
    var networkDone = requestMetrics.startTiming('net');
    switch (request.method) {
      case 'GET':
        ajax("".concat(request.url).concat(formatGetParameters(request.data)), {
          success: onSuccess,
          error: onFailure
        }, undefined, Object.assign({
          method: 'GET',
          withCredentials: true
        }, request.options));
        break;
      case 'POST':
        ajax(request.url, {
          success: onSuccess,
          error: onFailure
        }, typeof request.data === 'string' ? request.data : JSON.stringify(request.data), Object.assign({
          method: 'POST',
          contentType: 'text/plain',
          withCredentials: true
        }, request.options));
        break;
      default:
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Skipping invalid request from ".concat(spec.code, ". Request type ").concat(request.type, " must be GET or POST"));
        requestDone();
    }
    function formatGetParameters(data) {
      if (data) {
        return "?".concat((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_11__["default"])(data) === 'object' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseQueryStringParameters)(data) : data);
      }
      return '';
    }
  });
}, 'processBidderRequests');
var registerSyncInner = (0,_hook_js__WEBPACK_IMPORTED_MODULE_10__.hook)('async', function (spec, responses, gdprConsent, uspConsent, gppConsent) {
  var aliasSyncEnabled = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('userSync.aliasSyncEnabled');
  if (spec.getUserSyncs && (aliasSyncEnabled || !_adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].aliasRegistry[spec.code])) {
    var filterConfig = _config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('userSync.filterSettings');
    var syncs = spec.getUserSyncs({
      iframeEnabled: !!(filterConfig && (filterConfig.iframe || filterConfig.all)),
      pixelEnabled: !!(filterConfig && (filterConfig.image || filterConfig.all))
    }, responses, gdprConsent, uspConsent, gppConsent);
    if (syncs) {
      if (!Array.isArray(syncs)) {
        syncs = [syncs];
      }
      syncs.forEach(function (sync) {
        _userSync_js__WEBPACK_IMPORTED_MODULE_12__.userSync.registerSync(sync.type, spec.code, sync.url);
      });
      _userSync_js__WEBPACK_IMPORTED_MODULE_12__.userSync.bidderDone(spec.code);
    }
  }
}, 'registerSyncs');
var addComponentAuction = (0,_hook_js__WEBPACK_IMPORTED_MODULE_10__.hook)('sync', function (adUnitCode, fledgeAuctionConfig) {}, 'addComponentAuction');
function preloadBidderMappingFile(fn, adUnits) {
  if (true) {
    if (!_config_js__WEBPACK_IMPORTED_MODULE_6__.config.getConfig('adpod.brandCategoryExclusion')) {
      return fn.call(this, adUnits);
    }
    var adPodBidders = adUnits.filter(function (adUnit) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_13__["default"])(adUnit, 'mediaTypes.video.context') === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_14__.ADPOD;
    }).map(function (adUnit) {
      return adUnit.bids.map(function (bid) {
        return bid.bidder;
      });
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_2__.flatten, []).filter(_utils_js__WEBPACK_IMPORTED_MODULE_2__.uniques);
    adPodBidders.forEach(function (bidder) {
      var bidderSpec = _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].getBidAdapter(bidder);
      if (bidderSpec.getSpec().getMappingFileInfo) {
        var info = bidderSpec.getSpec().getMappingFileInfo();
        var refreshInDays = info.refreshInDays ? info.refreshInDays : DEFAULT_REFRESHIN_DAYS;
        var key = info.localStorageKey ? info.localStorageKey : bidderSpec.getSpec().code;
        var mappingData = storage.getDataFromLocalStorage(key);
        try {
          mappingData = mappingData ? JSON.parse(mappingData) : undefined;
          if (!mappingData || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)() > mappingData.lastUpdated + refreshInDays * 24 * 60 * 60 * 1000) {
            (0,_ajax_js__WEBPACK_IMPORTED_MODULE_15__.ajax)(info.url, {
              success: function success(response) {
                try {
                  response = JSON.parse(response);
                  var mapping = {
                    lastUpdated: (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.timestamp)(),
                    mapping: response.mapping
                  };
                  storage.setDataInLocalStorage(key, JSON.stringify(mapping));
                } catch (error) {
                  (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Failed to parse ".concat(bidder, " bidder translation mapping file"));
                }
              },
              error: function error() {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Failed to load ".concat(bidder, " bidder translation file"));
              }
            });
          }
        } catch (error) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Failed to parse ".concat(bidder, " bidder translation mapping file"));
        }
      }
    });
    fn.call(this, adUnits);
  } else {}
}
(0,_hook_js__WEBPACK_IMPORTED_MODULE_10__.getHook)('checkAdUnitSetup').before(preloadBidderMappingFile);

/**
 * Reads the data stored in localstorage and returns iab subcategory
 * @param {string} bidderCode bidderCode
 * @param {string} category bidders category
 */
function getIabSubCategory(bidderCode, category) {
  var bidderSpec = _adapterManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].getBidAdapter(bidderCode);
  if (bidderSpec.getSpec().getMappingFileInfo) {
    var info = bidderSpec.getSpec().getMappingFileInfo();
    var key = info.localStorageKey ? info.localStorageKey : bidderSpec.getBidderCode();
    var data = storage.getDataFromLocalStorage(key);
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Failed to parse ".concat(bidderCode, " mapping data stored in local storage"));
      }
      return data.mapping[category] ? data.mapping[category] : null;
    }
  }
}

// check that the bid has a width and height set
function validBidSize(adUnitCode, bid) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$index = _ref2.index,
    index = _ref2$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_16__.auctionManager.index : _ref2$index;
  if ((bid.width || parseInt(bid.width, 10) === 0) && (bid.height || parseInt(bid.height, 10) === 0)) {
    bid.width = parseInt(bid.width, 10);
    bid.height = parseInt(bid.height, 10);
    return true;
  }
  var bidRequest = index.getBidRequest(bid);
  var mediaTypes = index.getMediaTypes(bid);
  var sizes = bidRequest && bidRequest.sizes || mediaTypes && mediaTypes.banner && mediaTypes.banner.sizes;
  var parsedSizes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseSizesInput)(sizes);

  // if a banner impression has one valid size, we assign that size to any bid
  // response that does not explicitly set width or height
  if (parsedSizes.length === 1) {
    var _parsedSizes$0$split = parsedSizes[0].split('x'),
      _parsedSizes$0$split2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_17__["default"])(_parsedSizes$0$split, 2),
      width = _parsedSizes$0$split2[0],
      height = _parsedSizes$0$split2[1];
    bid.width = parseInt(width, 10);
    bid.height = parseInt(height, 10);
    return true;
  }
  return false;
}

// Validate the arguments sent to us by the adapter. If this returns false, the bid should be totally ignored.
function isValid(adUnitCode, bid) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref3$index = _ref3.index,
    index = _ref3$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_16__.auctionManager.index : _ref3$index;
  function hasValidKeys() {
    var bidKeys = Object.keys(bid);
    return COMMON_BID_RESPONSE_KEYS.every(function (key) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)(bidKeys, key) && !(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_18__.includes)([undefined, null], bid[key]);
    });
  }
  function errorMessage(msg) {
    return "Invalid bid from ".concat(bid.bidderCode, ". Ignoring bid: ").concat(msg);
  }
  if (!adUnitCode) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)('No adUnitCode was supplied to addBidResponse.');
    return false;
  }
  if (!bid) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)("Some adapter tried to add an undefined bid for ".concat(adUnitCode, "."));
    return false;
  }
  if (!hasValidKeys()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(errorMessage("Bidder ".concat(bid.bidderCode, " is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params.")));
    return false;
  }
  if ( true && bid.mediaType === 'native' && !(0,_native_js__WEBPACK_IMPORTED_MODULE_19__.nativeBidIsValid)(bid, {
    index: index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(errorMessage('Native bid missing some required properties.'));
    return false;
  }
  if ( true && bid.mediaType === 'video' && !(0,_video_js__WEBPACK_IMPORTED_MODULE_20__.isValidVideoBid)(bid, {
    index: index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(errorMessage("Video bid does not have required vastUrl or renderer property"));
    return false;
  }
  if (bid.mediaType === 'banner' && !validBidSize(adUnitCode, bid, {
    index: index
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)(errorMessage("Banner bids require a width and height"));
    return false;
  }
  return true;
}
function adapterMetrics(bidderRequest) {
  return (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__.useMetrics)(bidderRequest.metrics).renameWith(function (n) {
    return ["adapter.client.".concat(n), "adapters.client.".concat(bidderRequest.bidderCode, ".").concat(n)];
  });
}

/***/ }),

/***/ "./src/adloader.js":
/*!*************************!*\
  !*** ./src/adloader.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadExternalScript": function() { return /* binding */ loadExternalScript; }
/* harmony export */ });
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");


var _requestCache = new WeakMap();
// The below list contains modules or vendors whom Prebid allows to load external JS.
var _approvedLoadExternalJSList = ['debugging', 'adloox', 'criteo', 'outstream', 'adagio', 'spotx', 'browsi', 'brandmetrics', 'justtag', 'tncId', 'akamaidap', 'ftrackId', 'inskin', 'hadron', 'medianet', 'improvedigital', 'aaxBlockmeter', 'confiant', 'arcspan', 'airgrid', 'clean.io'];

/**
 * Loads external javascript. Can only be used if external JS is approved by Prebid. See https://github.com/prebid/prebid-js-external-js-template#policy
 * Each unique URL will be loaded at most 1 time.
 * @param {string} url the url to load
 * @param {string} moduleCode bidderCode or module code of the module requesting this resource
 * @param {function} [callback] callback function to be called after the script is loaded
 * @param {Document} [doc] the context document, in which the script will be loaded, defaults to loaded document
 * @param {object} an object of attributes to be added to the script with setAttribute by [key] and [value]; Only the attributes passed in the first request of a url will be added.
 */
function loadExternalScript(url, moduleCode, callback, doc, attributes) {
  if (!moduleCode || !url) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('cannot load external script without url and moduleCode');
    return;
  }
  if (!(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.includes)(_approvedLoadExternalJSList, moduleCode)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)("".concat(moduleCode, " not whitelisted for loading external JavaScript"));
    return;
  }
  if (!doc) {
    doc = document; // provide a "valid" key for the WeakMap
  }
  // only load each asset once
  var storedCachedObject = getCacheObject(doc, url);
  if (storedCachedObject) {
    if (callback && typeof callback === 'function') {
      if (storedCachedObject.loaded) {
        // invokeCallbacks immediately
        callback();
      } else {
        // queue the callback
        storedCachedObject.callbacks.push(callback);
      }
    }
    return storedCachedObject.tag;
  }
  var cachedDocObj = _requestCache.get(doc) || {};
  var cacheObject = {
    loaded: false,
    tag: null,
    callbacks: []
  };
  cachedDocObj[url] = cacheObject;
  _requestCache.set(doc, cachedDocObj);
  if (callback && typeof callback === 'function') {
    cacheObject.callbacks.push(callback);
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)("module ".concat(moduleCode, " is loading external JavaScript"));
  return requestResource(url, function () {
    cacheObject.loaded = true;
    try {
      for (var i = 0; i < cacheObject.callbacks.length; i++) {
        cacheObject.callbacks[i]();
      }
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Error executing callback', 'adloader.js:loadExternalScript', e);
    }
  }, doc, attributes);
  function requestResource(tagSrc, callback, doc, attributes) {
    if (!doc) {
      doc = document;
    }
    var jptScript = doc.createElement('script');
    jptScript.type = 'text/javascript';
    jptScript.async = true;
    var cacheObject = getCacheObject(doc, url);
    if (cacheObject) {
      cacheObject.tag = jptScript;
    }
    if (jptScript.readyState) {
      jptScript.onreadystatechange = function () {
        if (jptScript.readyState === 'loaded' || jptScript.readyState === 'complete') {
          jptScript.onreadystatechange = null;
          callback();
        }
      };
    } else {
      jptScript.onload = function () {
        callback();
      };
    }
    jptScript.src = tagSrc;
    if (attributes) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.setScriptAttributes)(jptScript, attributes);
    }

    // add the new script tag to the page
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.insertElement)(jptScript, doc);
    return jptScript;
  }
  function getCacheObject(doc, url) {
    var cachedDocObj = _requestCache.get(doc);
    if (cachedDocObj && cachedDocObj[url]) {
      return cachedDocObj[url];
    }
    return null; // return new cache object?
  }
}

;

/***/ }),

/***/ "./src/ajax.js":
/*!*********************!*\
  !*** ./src/ajax.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ajax": function() { return /* binding */ ajax; },
/* harmony export */   "ajaxBuilder": function() { return /* binding */ ajaxBuilder; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");



var XHR_DONE = 4;

/**
 * Simple IE9+ and cross-browser ajax request function
 * Note: x-domain requests in IE9 do not support the use of cookies
 *
 * @param url string url
 * @param callback {object | function} callback
 * @param data mixed data
 * @param options object
 */
var ajax = ajaxBuilder();
function ajaxBuilder() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    request = _ref.request,
    done = _ref.done;
  return function (url, callback, data) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    try {
      var x;
      var method = options.method || (data ? 'POST' : 'GET');
      var parser = document.createElement('a');
      parser.href = url;
      var callbacks = (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(callback) === 'object' && callback !== null ? callback : {
        success: function success() {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('xhr success');
        },
        error: function error(e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('xhr error', null, e);
        }
      };
      if (typeof callback === 'function') {
        callbacks.success = callback;
      }
      x = new window.XMLHttpRequest();
      x.onreadystatechange = function () {
        if (x.readyState === XHR_DONE) {
          if (typeof done === 'function') {
            done(parser.origin);
          }
          var status = x.status;
          if (status >= 200 && status < 300 || status === 304) {
            callbacks.success(x.responseText, x);
          } else {
            callbacks.error(x.statusText, x);
          }
        }
      };

      // Disabled timeout temporarily to avoid xhr failed requests. https://github.com/prebid/Prebid.js/issues/2648
      if (!_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('disableAjaxTimeout')) {
        x.ontimeout = function () {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('  xhr timeout after ', x.timeout, 'ms');
        };
      }
      if (method === 'GET' && data) {
        var urlInfo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseUrl)(url, options);
        Object.assign(urlInfo.search, data);
        url = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.buildUrl)(urlInfo);
      }
      x.open(method, url, true);
      // IE needs timeout to be set after open - see #1410
      // Disabled timeout temporarily to avoid xhr failed requests. https://github.com/prebid/Prebid.js/issues/2648
      if (!_config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('disableAjaxTimeout')) {
        x.timeout = timeout;
      }
      if (options.withCredentials) {
        x.withCredentials = true;
      }
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__._each)(options.customHeaders, function (value, header) {
        x.setRequestHeader(header, value);
      });
      if (options.preflight) {
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      x.setRequestHeader('Content-Type', options.contentType || 'text/plain');
      if (typeof request === 'function') {
        request(parser.origin);
      }
      if (method === 'POST' && data) {
        x.send(data);
      } else {
        x.send();
      }
    } catch (error) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('xhr construction', error);
      (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(callback) === 'object' && callback !== null && callback.error(error);
    }
  };
}

/***/ }),

/***/ "./src/auction.js":
/*!************************!*\
  !*** ./src/auction.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AUCTION_COMPLETED": function() { return /* binding */ AUCTION_COMPLETED; },
/* harmony export */   "getStandardBidderSettings": function() { return /* binding */ getStandardBidderSettings; },
/* harmony export */   "newAuction": function() { return /* binding */ newAuction; }
/* harmony export */ });
/* unused harmony exports AUCTION_STARTED, AUCTION_IN_PROGRESS, resetAuctionState, addBidResponse, addBidderRequests, bidsBackCallback, auctionCallbacks, doCallbacksIfTimedout, addBidToAuction, batchingCache, callPrebidCache, getMediaTypeGranularity, getPriceGranularity, getPriceByGranularity, getAdvertiserDomain, getPrimaryCatId, getKeyValueTargetingPairs, adjustBids */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _videoCache_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./videoCache.js */ "./src/videoCache.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userSync.js */ "./src/userSync.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./video.js */ "./src/video.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _utils_cpm_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./utils/cpm.js */ "./src/utils/cpm.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");


/**
 * Module for auction instances.
 *
 * In Prebid 0.x, $$PREBID_GLOBAL$$ had _bidsRequested and _bidsReceived as public properties.
 * Starting 1.0, Prebid will support concurrent auctions. Each auction instance will store private properties, bidsRequested and bidsReceived.
 *
 * AuctionManager will create instance of auction and will store all the auctions.
 *
 */

/**
  * @typedef {Object} AdUnit An object containing the adUnit configuration.
  *
  * @property {string} code A code which will be used to uniquely identify this bidder. This should be the same
  *   one as is used in the call to registerBidAdapter
  * @property {Array.<size>} sizes A list of size for adUnit.
  * @property {object} params Any bidder-specific params which the publisher used in their bid request.
  *   This is guaranteed to have passed the spec.areParamsValid() test.
  */

/**
 * @typedef {Array.<number>} size
 */

/**
 * @typedef {Array.<string>} AdUnitCode
 */

/**
 * @typedef {Object} BidderRequest
 *
 * @property {string} bidderCode - adUnit bidder
 * @property {number} auctionId - random UUID
 * @property {string} bidderRequestId - random string, unique key set on all bidRequest.bids[]
 * @property {Array.<Bid>} bids
 * @property {number} auctionStart - Date.now() at auction start
 * @property {number} timeout - callback timeout
 * @property {refererInfo} refererInfo - referer info object
 * @property {string} [tid] - random UUID (used for s2s)
 * @property {string} [src] - s2s or client (used for s2s)
 */

/**
 * @typedef {Object} BidReceived
 * //TODO add all properties
 */

/**
 * @typedef {Object} Auction
 *
 * @property {function(): string} getAuctionStatus - returns the auction status which can be any one of 'started', 'in progress' or 'completed'
 * @property {function(): AdUnit[]} getAdUnits - return the adUnits for this auction instance
 * @property {function(): AdUnitCode[]} getAdUnitCodes - return the adUnitCodes for this auction instance
 * @property {function(): BidRequest[]} getBidRequests - get all bid requests for this auction instance
 * @property {function(): BidReceived[]} getBidsReceived - get all bid received for this auction instance
 * @property {function(): void} startAuctionTimer - sets the bidsBackHandler callback and starts the timer for auction
 * @property {function(): void} callBids - sends requests to all adapters for bids
 */






















var syncUsers = _userSync_js__WEBPACK_IMPORTED_MODULE_0__.userSync.syncUsers;
var AUCTION_STARTED = 'started';
var AUCTION_IN_PROGRESS = 'inProgress';
var AUCTION_COMPLETED = 'completed';

// register event for bid adjustment
_events_js__WEBPACK_IMPORTED_MODULE_1__.on(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BID_ADJUSTMENT, function (bid) {
  adjustBids(bid);
});
var MAX_REQUESTS_PER_ORIGIN = 4;
var outstandingRequests = {};
var sourceInfo = {};
var queuedCalls = [];
var pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_3__.getGlobal)();

/**
 * Clear global state for tests
 */
function resetAuctionState() {
  queuedCalls.length = 0;
  [outstandingRequests, sourceInfo].forEach(function (ob) {
    return Object.keys(ob).forEach(function (k) {
      delete ob[k];
    });
  });
}

/**
  * Creates new auction instance
  *
  * @param {Object} requestConfig
  * @param {AdUnit} requestConfig.adUnits
  * @param {AdUnitCode} requestConfig.adUnitCodes
  * @param {function():void} requestConfig.callback
  * @param {number} requestConfig.cbTimeout
  * @param {Array.<string>} requestConfig.labels
  * @param {string} requestConfig.auctionId
  * @param {{global: {}, bidder: {}}} ortb2Fragments first party data, separated into global
  *    (from getConfig('ortb2') + requestBids({ortb2})) and bidder (a map from bidderCode to ortb2)
  * @returns {Auction} auction instance
  */
function newAuction(_ref) {
  var adUnits = _ref.adUnits,
    adUnitCodes = _ref.adUnitCodes,
    callback = _ref.callback,
    cbTimeout = _ref.cbTimeout,
    labels = _ref.labels,
    auctionId = _ref.auctionId,
    ortb2Fragments = _ref.ortb2Fragments,
    metrics = _ref.metrics;
  metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__.useMetrics)(metrics);
  var _adUnits = adUnits;
  var _labels = labels;
  var _adUnitCodes = adUnitCodes;
  var _auctionId = auctionId || (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.generateUUID)();
  var _timeout = cbTimeout;
  var _timelyBidders = new Set();
  var _bidsRejected = [];
  var _callback = callback;
  var _bidderRequests = [];
  var _bidsReceived = [];
  var _noBids = [];
  var _winningBids = [];
  var _auctionStart;
  var _auctionEnd;
  var _timer;
  var _auctionStatus;
  var _nonBids = [];
  function addBidRequests(bidderRequests) {
    _bidderRequests = _bidderRequests.concat(bidderRequests);
  }
  function addBidReceived(bidsReceived) {
    _bidsReceived = _bidsReceived.concat(bidsReceived);
  }
  function addBidRejected(bidsRejected) {
    _bidsRejected = _bidsRejected.concat(bidsRejected);
  }
  function addNoBid(noBid) {
    _noBids = _noBids.concat(noBid);
  }
  function addNonBids(seatnonbids) {
    _nonBids = _nonBids.concat(seatnonbids);
  }
  function getProperties() {
    return {
      auctionId: _auctionId,
      timestamp: _auctionStart,
      auctionEnd: _auctionEnd,
      auctionStatus: _auctionStatus,
      adUnits: _adUnits,
      adUnitCodes: _adUnitCodes,
      labels: _labels,
      bidderRequests: _bidderRequests,
      noBids: _noBids,
      bidsReceived: _bidsReceived,
      bidsRejected: _bidsRejected,
      winningBids: _winningBids,
      timeout: _timeout,
      metrics: metrics,
      seatNonBids: _nonBids
    };
  }
  function startAuctionTimer() {
    var timedOut = true;
    var timeoutCallback = executeCallback.bind(null, timedOut);
    var timer = setTimeout(timeoutCallback, _timeout);
    _timer = timer;
  }
  function executeCallback(timedOut, cleartimer) {
    // clear timer when done calls executeCallback
    if (cleartimer) {
      clearTimeout(_timer);
    }
    if (_auctionEnd === undefined) {
      var timedOutBidders = [];
      if (timedOut) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logMessage)("Auction ".concat(_auctionId, " timedOut"));
        timedOutBidders = getTimedOutBids(_bidderRequests, _timelyBidders);
        if (timedOutBidders.length) {
          _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BID_TIMEOUT, timedOutBidders);
        }
      }
      _auctionStatus = AUCTION_COMPLETED;
      _auctionEnd = Date.now();
      metrics.checkpoint('auctionEnd');
      metrics.timeBetween('requestBids', 'auctionEnd', 'requestBids.total');
      metrics.timeBetween('callBids', 'auctionEnd', 'requestBids.callBids');
      _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AUCTION_END, getProperties());
      bidsBackCallback(_adUnits, function () {
        try {
          if (_callback != null) {
            var _adUnitCodes2 = _adUnitCodes;
            var bids = _bidsReceived.filter(_utils_js__WEBPACK_IMPORTED_MODULE_5__.bind.call(_utils_js__WEBPACK_IMPORTED_MODULE_5__.adUnitsFilter, this, _adUnitCodes2)).reduce(groupByPlacement, {});
            _callback.apply(pbjsInstance, [bids, timedOut, _auctionId]);
            _callback = null;
          }
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)('Error executing bidsBackHandler', null, e);
        } finally {
          // Calling timed out bidders
          if (timedOutBidders.length) {
            _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].callTimedOutBidders(adUnits, timedOutBidders, _timeout);
          }
          // Only automatically sync if the publisher has not chosen to "enableOverride"
          var userSyncConfig = _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('userSync') || {};
          if (!userSyncConfig.enableOverride) {
            // Delay the auto sync by the config delay
            syncUsers(userSyncConfig.syncDelay);
          }
        }
      });
    }
  }
  function auctionDone() {
    _config_js__WEBPACK_IMPORTED_MODULE_7__.config.resetBidder();
    // when all bidders have called done callback atleast once it means auction is complete
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)("Bids Received for Auction with id: ".concat(_auctionId), _bidsReceived);
    _auctionStatus = AUCTION_COMPLETED;
    executeCallback(false, true);
  }
  function onTimelyResponse(bidderCode) {
    _timelyBidders.add(bidderCode);
  }
  function callBids() {
    _auctionStatus = AUCTION_STARTED;
    _auctionStart = Date.now();
    var bidRequests = metrics.measureTime('requestBids.makeRequests', function () {
      return _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].makeBidRequests(_adUnits, _auctionStart, _auctionId, _timeout, _labels, ortb2Fragments, metrics);
    });
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)("Bids Requested for Auction with id: ".concat(_auctionId), bidRequests);
    metrics.checkpoint('callBids');
    if (bidRequests.length < 1) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)('No valid bid requests returned for auction');
      auctionDone();
    } else {
      addBidderRequests.call({
        dispatch: addBidderRequestsCallback,
        context: this
      }, bidRequests);
    }
  }

  /**
   * callback executed after addBidderRequests completes
   * @param {BidRequest[]} bidRequests
   */
  function addBidderRequestsCallback(bidRequests) {
    var _this = this;
    bidRequests.forEach(function (bidRequest) {
      addBidRequests(bidRequest);
    });
    var requests = {};
    var call = {
      bidRequests: bidRequests,
      run: function run() {
        startAuctionTimer();
        _auctionStatus = AUCTION_IN_PROGRESS;
        _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AUCTION_INIT, getProperties());
        var callbacks = auctionCallbacks(auctionDone, _this);
        _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].callBids(_adUnits, bidRequests, callbacks.addBidResponse, callbacks.adapterDone, {
          request: function request(source, origin) {
            increment(outstandingRequests, origin);
            increment(requests, source);
            if (!sourceInfo[source]) {
              sourceInfo[source] = {
                SRA: true,
                origin: origin
              };
            }
            if (requests[source] > 1) {
              sourceInfo[source].SRA = false;
            }
          },
          done: function done(origin) {
            outstandingRequests[origin]--;
            if (queuedCalls[0]) {
              if (runIfOriginHasCapacity(queuedCalls[0])) {
                queuedCalls.shift();
              }
            }
          }
        }, _timeout, onTimelyResponse, ortb2Fragments);
      }
    };
    if (!runIfOriginHasCapacity(call)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)('queueing auction due to limited endpoint capacity');
      queuedCalls.push(call);
    }
    function runIfOriginHasCapacity(call) {
      var hasCapacity = true;
      var maxRequests = _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('maxRequestsPerOrigin') || MAX_REQUESTS_PER_ORIGIN;
      call.bidRequests.some(function (bidRequest) {
        var requests = 1;
        var source = typeof bidRequest.src !== 'undefined' && bidRequest.src === _constants_json__WEBPACK_IMPORTED_MODULE_2__.S2S.SRC ? 's2s' : bidRequest.bidderCode;
        // if we have no previous info on this source just let them through
        if (sourceInfo[source]) {
          if (sourceInfo[source].SRA === false) {
            // some bidders might use more than the MAX_REQUESTS_PER_ORIGIN in a single auction.  In those cases
            // set their request count to MAX_REQUESTS_PER_ORIGIN so the auction isn't permanently queued waiting
            // for capacity for that bidder
            requests = Math.min(bidRequest.bids.length, maxRequests);
          }
          if (outstandingRequests[sourceInfo[source].origin] + requests > maxRequests) {
            hasCapacity = false;
          }
        }
        // return only used for terminating this .some() iteration early if it is determined we don't have capacity
        return !hasCapacity;
      });
      if (hasCapacity) {
        call.run();
      }
      return hasCapacity;
    }
    function increment(obj, prop) {
      if (typeof obj[prop] === 'undefined') {
        obj[prop] = 1;
      } else {
        obj[prop]++;
      }
    }
  }
  function addWinningBid(winningBid) {
    var winningAd = adUnits.find(function (adUnit) {
      return adUnit.transactionId === winningBid.transactionId;
    });
    _winningBids = _winningBids.concat(winningBid);
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].callBidWonBidder(winningBid.adapterCode || winningBid.bidder, winningBid, adUnits);
    if (winningAd && !winningAd.deferBilling) _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].callBidBillableBidder(winningBid);
  }
  function setBidTargeting(bid) {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_6__["default"].callSetTargetingBidder(bid.adapterCode || bid.bidder, bid);
  }
  _events_js__WEBPACK_IMPORTED_MODULE_1__.on(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.SEAT_NON_BID, function (event) {
    if (event.auctionId === _auctionId) {
      addNonBids(event.seatnonbid);
    }
  });
  return {
    addBidReceived: addBidReceived,
    addBidRejected: addBidRejected,
    addNoBid: addNoBid,
    executeCallback: executeCallback,
    callBids: callBids,
    addWinningBid: addWinningBid,
    setBidTargeting: setBidTargeting,
    getWinningBids: function getWinningBids() {
      return _winningBids;
    },
    getAuctionStart: function getAuctionStart() {
      return _auctionStart;
    },
    getTimeout: function getTimeout() {
      return _timeout;
    },
    getAuctionId: function getAuctionId() {
      return _auctionId;
    },
    getAuctionStatus: function getAuctionStatus() {
      return _auctionStatus;
    },
    getAdUnits: function getAdUnits() {
      return _adUnits;
    },
    getAdUnitCodes: function getAdUnitCodes() {
      return _adUnitCodes;
    },
    getBidRequests: function getBidRequests() {
      return _bidderRequests;
    },
    getBidsReceived: function getBidsReceived() {
      return _bidsReceived;
    },
    getNoBids: function getNoBids() {
      return _noBids;
    },
    getNonBids: function getNonBids() {
      return _nonBids;
    },
    getFPD: function getFPD() {
      return ortb2Fragments;
    },
    getMetrics: function getMetrics() {
      return metrics;
    }
  };
}

/**
 * Hook into this to intercept bids before they are added to an auction.
 *
 * @param adUnitCode
 * @param bid
 * @param {function(String)} reject: a function that, when called, rejects `bid` with the given reason.
 */
var addBidResponse = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (adUnitCode, bid, reject) {
  this.dispatch.call(null, adUnitCode, bid);
}, 'addBidResponse');
var addBidderRequests = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (bidderRequests) {
  this.dispatch.call(this.context, bidderRequests);
}, 'addBidderRequests');
var bidsBackCallback = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (adUnits, callback) {
  if (callback) {
    callback();
  }
}, 'bidsBackCallback');
function auctionCallbacks(auctionDone, auctionInstance) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$index = _ref2.index,
    index = _ref2$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref2$index;
  var outstandingBidsAdded = 0;
  var allAdapterCalledDone = false;
  var bidderRequestsDone = new Set();
  var bidResponseMap = {};
  var ready = {};
  function waitFor(requestId, result) {
    if (ready[requestId] == null) {
      ready[requestId] = _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.GreedyPromise.resolve();
    }
    ready[requestId] = ready[requestId].then(function () {
      return _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.GreedyPromise.resolve(result).catch(function () {});
    });
  }
  function guard(bidderRequest, fn) {
    var timeout = bidderRequest.timeout;
    if (timeout == null || timeout > auctionInstance.getTimeout()) {
      timeout = auctionInstance.getTimeout();
    }
    var timeRemaining = auctionInstance.getAuctionStart() + timeout - Date.now();
    var wait = ready[bidderRequest.bidderRequestId];
    var orphanWait = ready['']; // also wait for "orphan" responses that are not associated with any request
    if ((wait != null || orphanWait != null) && timeRemaining > 0) {
      _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.GreedyPromise.race([_utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.GreedyPromise.timeout(timeRemaining), _utils_promise_js__WEBPACK_IMPORTED_MODULE_10__.GreedyPromise.resolve(orphanWait).then(function () {
        return wait;
      })]).then(fn);
    } else {
      fn();
    }
  }
  function afterBidAdded() {
    outstandingBidsAdded--;
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  function handleBidResponse(adUnitCode, bid, handler) {
    bidResponseMap[bid.requestId] = true;
    addCommonResponseProperties(bid, adUnitCode);
    outstandingBidsAdded++;
    return handler(afterBidAdded);
  }
  function acceptBidResponse(adUnitCode, bid) {
    handleBidResponse(adUnitCode, bid, function (done) {
      var bidResponse = getPreparedBidForAuction(bid);
      if ( true && bidResponse.mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__.VIDEO) {
        tryAddVideoBid(auctionInstance, bidResponse, done);
      } else {
        if ( true && bidResponse.native != null && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_12__["default"])(bidResponse.native) === 'object') {
          // NOTE: augment bidResponse.native even if bidResponse.mediaType !== NATIVE; it's possible
          // to treat banner responses as native
          addLegacyFieldsIfNeeded(bidResponse);
        }
        addBidToAuction(auctionInstance, bidResponse);
        done();
      }
    });
  }
  function rejectBidResponse(adUnitCode, bid, reason) {
    return handleBidResponse(adUnitCode, bid, function (done) {
      var _bid$getIdentifiers;
      // return a "NO_BID" replacement that the caller can decide to continue with
      // TODO: remove this in v8; see https://github.com/prebid/Prebid.js/issues/8956
      var noBid = (0,_bidfactory_js__WEBPACK_IMPORTED_MODULE_13__.createBid)(_constants_json__WEBPACK_IMPORTED_MODULE_2__.STATUS.NO_BID, (_bid$getIdentifiers = bid.getIdentifiers) === null || _bid$getIdentifiers === void 0 ? void 0 : _bid$getIdentifiers.call(bid));
      Object.assign(noBid, Object.fromEntries(Object.entries(bid).filter(function (_ref3) {
        var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_14__["default"])(_ref3, 1),
          k = _ref4[0];
        return !noBid.hasOwnProperty(k) && !['ad', 'adUrl', 'vastXml', 'vastUrl', 'native'].includes(k);
      })));
      noBid.status = _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.BID_REJECTED;
      noBid.cpm = 0;
      bid.rejectionReason = reason;
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)("Bid from ".concat(bid.bidder || 'unknown bidder', " was rejected: ").concat(reason), bid);
      _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BID_REJECTED, bid);
      auctionInstance.addBidRejected(bid);
      done();
      return noBid;
    });
  }
  function _adapterDone() {
    var bidderRequest = this;
    var bidderRequests = auctionInstance.getBidRequests();
    var auctionOptionsConfig = _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('auctionOptions');
    bidderRequestsDone.add(bidderRequest);
    if (auctionOptionsConfig && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isEmpty)(auctionOptionsConfig)) {
      var secondaryBidders = auctionOptionsConfig.secondaryBidders;
      if (secondaryBidders && !bidderRequests.every(function (bidder) {
        return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.includes)(secondaryBidders, bidder.bidderCode);
      })) {
        bidderRequests = bidderRequests.filter(function (request) {
          return !(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.includes)(secondaryBidders, request.bidderCode);
        });
      }
    }
    allAdapterCalledDone = bidderRequests.every(function (bidderRequest) {
      return bidderRequestsDone.has(bidderRequest);
    });
    bidderRequest.bids.forEach(function (bid) {
      if (!bidResponseMap[bid.bidId]) {
        auctionInstance.addNoBid(bid);
        _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.NO_BID, bid);
      }
    });
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  return {
    addBidResponse: function () {
      function addBid(adUnitCode, bid) {
        var bidderRequest = index.getBidderRequest(bid);
        waitFor(bidderRequest && bidderRequest.bidderRequestId || '', addBidResponse.call({
          dispatch: acceptBidResponse
        }, adUnitCode, bid, function () {
          var rejection;
          return function (reason) {
            if (rejection == null) {
              rejection = rejectBidResponse(adUnitCode, bid, reason);
            }
            return rejection;
          };
        }()));
      }
      addBid.reject = rejectBidResponse;
      return addBid;
    }(),
    adapterDone: function adapterDone() {
      guard(this, _adapterDone.bind(this));
    }
  };
}
function doCallbacksIfTimedout(auctionInstance, bidResponse) {
  if (bidResponse.timeToRespond > auctionInstance.getTimeout() + _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('timeoutBuffer')) {
    auctionInstance.executeCallback(true);
  }
}

// Add a bid to the auction.
function addBidToAuction(auctionInstance, bidResponse) {
  setupBidTargeting(bidResponse);
  (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_4__.useMetrics)(bidResponse.metrics).timeSince('addBidResponse', 'addBidResponse.total');
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BID_RESPONSE, bidResponse);
  auctionInstance.addBidReceived(bidResponse);
  doCallbacksIfTimedout(auctionInstance, bidResponse);
}

// Video bids may fail if the cache is down, or there's trouble on the network.
function tryAddVideoBid(auctionInstance, bidResponse, afterBidAdded) {
  var _ref5 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
    _ref5$index = _ref5.index,
    index = _ref5$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref5$index;
  var addBid = true;
  var videoMediaType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_16__["default"])(index.getMediaTypes({
    requestId: bidResponse.originalRequestId || bidResponse.requestId,
    transactionId: bidResponse.transactionId
  }), 'video');
  var context = videoMediaType && (0,_utils_js__WEBPACK_IMPORTED_MODULE_16__["default"])(videoMediaType, 'context');
  var useCacheKey = videoMediaType && (0,_utils_js__WEBPACK_IMPORTED_MODULE_16__["default"])(videoMediaType, 'useCacheKey');
  if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('cache.url') && (useCacheKey || context !== _video_js__WEBPACK_IMPORTED_MODULE_17__.OUTSTREAM)) {
    if (!bidResponse.videoCacheKey || _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('cache.ignoreBidderCacheKey')) {
      addBid = false;
      callPrebidCache(auctionInstance, bidResponse, afterBidAdded, videoMediaType);
    } else if (!bidResponse.vastUrl) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)('videoCacheKey specified but not required vastUrl for video bid');
      addBid = false;
    }
  }
  if (addBid) {
    addBidToAuction(auctionInstance, bidResponse);
    afterBidAdded();
  }
}

// Native bid response might be in ortb2 format - adds legacy field for backward compatibility
var addLegacyFieldsIfNeeded = function addLegacyFieldsIfNeeded(bidResponse) {
  var _auctionManager$index, _bidResponse$native;
  var nativeOrtbRequest = (_auctionManager$index = _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index.getAdUnit(bidResponse)) === null || _auctionManager$index === void 0 ? void 0 : _auctionManager$index.nativeOrtbRequest;
  var nativeOrtbResponse = (_bidResponse$native = bidResponse.native) === null || _bidResponse$native === void 0 ? void 0 : _bidResponse$native.ortb;
  if (nativeOrtbRequest && nativeOrtbResponse) {
    var legacyResponse = (0,_native_js__WEBPACK_IMPORTED_MODULE_18__.toLegacyResponse)(nativeOrtbResponse, nativeOrtbRequest);
    Object.assign(bidResponse.native, legacyResponse);
  }
};
var _storeInCache = function _storeInCache(batch) {
  (0,_videoCache_js__WEBPACK_IMPORTED_MODULE_19__.store)(batch.map(function (entry) {
    return entry.bidResponse;
  }), function (error, cacheIds) {
    cacheIds.forEach(function (cacheId, i) {
      var _batch$i = batch[i],
        auctionInstance = _batch$i.auctionInstance,
        bidResponse = _batch$i.bidResponse,
        afterBidAdded = _batch$i.afterBidAdded;
      if (error) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)("Failed to save to the video cache: ".concat(error, ". Video bid must be discarded."));
        doCallbacksIfTimedout(auctionInstance, bidResponse);
      } else {
        if (cacheId.uuid === '') {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)("Supplied video cache key was already in use by Prebid Cache; caching attempt was rejected. Video bid must be discarded.");
          doCallbacksIfTimedout(auctionInstance, bidResponse);
        } else {
          bidResponse.videoCacheKey = cacheId.uuid;
          if (!bidResponse.vastUrl) {
            bidResponse.vastUrl = (0,_videoCache_js__WEBPACK_IMPORTED_MODULE_19__.getCacheUrl)(bidResponse.videoCacheKey);
          }
          addBidToAuction(auctionInstance, bidResponse);
          afterBidAdded();
        }
      }
    });
  });
};
var storeInCache =  true ? _storeInCache : 0;
var batchSize, batchTimeout;
_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('cache', function (cacheConfig) {
  batchSize = typeof cacheConfig.cache.batchSize === 'number' && cacheConfig.cache.batchSize > 0 ? cacheConfig.cache.batchSize : 1;
  batchTimeout = typeof cacheConfig.cache.batchTimeout === 'number' && cacheConfig.cache.batchTimeout > 0 ? cacheConfig.cache.batchTimeout : 0;
});
var batchingCache = function batchingCache() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : setTimeout;
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : storeInCache;
  var batches = [[]];
  var debouncing = false;
  var noTimeout = function noTimeout(cb) {
    return cb();
  };
  return function (auctionInstance, bidResponse, afterBidAdded) {
    var batchFunc = batchTimeout > 0 ? timeout : noTimeout;
    if (batches[batches.length - 1].length >= batchSize) {
      batches.push([]);
    }
    batches[batches.length - 1].push({
      auctionInstance: auctionInstance,
      bidResponse: bidResponse,
      afterBidAdded: afterBidAdded
    });
    if (!debouncing) {
      debouncing = true;
      batchFunc(function () {
        batches.forEach(cache);
        batches = [[]];
        debouncing = false;
      }, batchTimeout);
    }
  };
};
var batchAndStore = batchingCache();
var callPrebidCache = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (auctionInstance, bidResponse, afterBidAdded, videoMediaType) {
  batchAndStore(auctionInstance, bidResponse, afterBidAdded);
}, 'callPrebidCache');

/**
 * Augment `bidResponse` with properties that are common across all bids - including rejected bids.
 *
 */
function addCommonResponseProperties(bidResponse, adUnitCode) {
  var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref6$index = _ref6.index,
    index = _ref6$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref6$index;
  var bidderRequest = index.getBidderRequest(bidResponse);
  var adUnit = index.getAdUnit(bidResponse);
  var start = bidderRequest && bidderRequest.start || bidResponse.requestTimestamp;
  Object.assign(bidResponse, {
    responseTimestamp: bidResponse.responseTimestamp || (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.timestamp)(),
    requestTimestamp: bidResponse.requestTimestamp || start,
    cpm: parseFloat(bidResponse.cpm) || 0,
    bidder: bidResponse.bidder || bidResponse.bidderCode,
    adUnitCode: adUnitCode
  });
  if ((adUnit === null || adUnit === void 0 ? void 0 : adUnit.ttlBuffer) != null) {
    bidResponse.ttlBuffer = adUnit.ttlBuffer;
  }
  bidResponse.timeToRespond = bidResponse.responseTimestamp - bidResponse.requestTimestamp;
}

/**
 * Add additional bid response properties that are universal for all _accepted_ bids.
 */
function getPreparedBidForAuction(bid) {
  var _index$getBidRequest;
  var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref7$index = _ref7.index,
    index = _ref7$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref7$index;
  // Let listeners know that now is the time to adjust the bid, if they want to.
  //
  // CAREFUL: Publishers rely on certain bid properties to be available (like cpm),
  // but others to not be set yet (like priceStrings). See #1372 and #1389.
  _events_js__WEBPACK_IMPORTED_MODULE_1__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.BID_ADJUSTMENT, bid);

  // a publisher-defined renderer can be used to render bids
  var bidRenderer = ((_index$getBidRequest = index.getBidRequest(bid)) === null || _index$getBidRequest === void 0 ? void 0 : _index$getBidRequest.renderer) || index.getAdUnit(bid).renderer;

  // a publisher can also define a renderer for a mediaType
  var bidObjectMediaType = bid.mediaType;
  var mediaTypes = index.getMediaTypes(bid);
  var bidMediaType = mediaTypes && mediaTypes[bidObjectMediaType];
  var mediaTypeRenderer = bidMediaType && bidMediaType.renderer;
  var renderer = null;

  // the renderer for the mediaType takes precendence
  if (mediaTypeRenderer && mediaTypeRenderer.url && mediaTypeRenderer.render && !(mediaTypeRenderer.backupOnly === true && bid.renderer)) {
    renderer = mediaTypeRenderer;
  } else if (bidRenderer && bidRenderer.url && bidRenderer.render && !(bidRenderer.backupOnly === true && bid.renderer)) {
    renderer = bidRenderer;
  }
  if (renderer) {
    // be aware, an adapter could already have installed the bidder, in which case this overwrite's the existing adapter
    bid.renderer = _Renderer_js__WEBPACK_IMPORTED_MODULE_20__.Renderer.install({
      url: renderer.url,
      config: renderer.options
    }); // rename options to config, to make it consistent?
    bid.renderer.setRender(renderer.render);
  }

  // Use the config value 'mediaTypeGranularity' if it has been defined for mediaType, else use 'customPriceBucket'
  var mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, mediaTypes, _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('mediaTypePriceGranularity'));
  var priceStringsObj = (0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_21__.getPriceBucketString)(bid.cpm, (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_12__["default"])(mediaTypeGranularity) === 'object' ? mediaTypeGranularity : _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('customPriceBucket'), _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('currency.granularityMultiplier'));
  bid.pbLg = priceStringsObj.low;
  bid.pbMg = priceStringsObj.med;
  bid.pbHg = priceStringsObj.high;
  bid.pbAg = priceStringsObj.auto;
  bid.pbDg = priceStringsObj.dense;
  bid.pbCg = priceStringsObj.custom;
  return bid;
}
function setupBidTargeting(bidObject) {
  var keyValues;
  var cpmCheck = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.get(bidObject.bidderCode, 'allowZeroCpmBids') === true ? bidObject.cpm >= 0 : bidObject.cpm > 0;
  if (bidObject.bidderCode && (cpmCheck || bidObject.dealId)) {
    keyValues = getKeyValueTargetingPairs(bidObject.bidderCode, bidObject);
  }

  // use any targeting provided as defaults, otherwise just set from getKeyValueTargetingPairs
  bidObject.adserverTargeting = Object.assign(bidObject.adserverTargeting || {}, keyValues);
}

/**
 * @param {MediaType} mediaType
 * @param mediaTypes media types map from adUnit
 * @param {MediaTypePriceGranularity} [mediaTypePriceGranularity]
 * @returns {(Object|string|undefined)}
 */
function getMediaTypeGranularity(mediaType, mediaTypes, mediaTypePriceGranularity) {
  if (mediaType && mediaTypePriceGranularity) {
    if ( true && mediaType === _mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__.VIDEO) {
      var context = (0,_utils_js__WEBPACK_IMPORTED_MODULE_16__["default"])(mediaTypes, "".concat(_mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__.VIDEO, ".context"), 'instream');
      if (mediaTypePriceGranularity["".concat(_mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__.VIDEO, "-").concat(context)]) {
        return mediaTypePriceGranularity["".concat(_mediaTypes_js__WEBPACK_IMPORTED_MODULE_11__.VIDEO, "-").concat(context)];
      }
    }
    return mediaTypePriceGranularity[mediaType];
  }
}

/**
 * This function returns the price granularity defined. It can be either publisher defined or default value
 * @param bid bid response object
 * @param index
 * @returns {string} granularity
 */
var getPriceGranularity = function getPriceGranularity(bid) {
  var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref8$index = _ref8.index,
    index = _ref8$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref8$index;
  // Use the config value 'mediaTypeGranularity' if it has been set for mediaType, else use 'priceGranularity'
  var mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, index.getMediaTypes(bid), _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('mediaTypePriceGranularity'));
  var granularity = typeof bid.mediaType === 'string' && mediaTypeGranularity ? typeof mediaTypeGranularity === 'string' ? mediaTypeGranularity : 'custom' : _config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('priceGranularity');
  return granularity;
};

/**
 * This function returns a function to get bid price by price granularity
 * @param {string} granularity
 * @returns {function}
 */
var getPriceByGranularity = function getPriceByGranularity(granularity) {
  return function (bid) {
    var bidGranularity = granularity || getPriceGranularity(bid);
    if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.AUTO) {
      return bid.pbAg;
    } else if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.DENSE) {
      return bid.pbDg;
    } else if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.LOW) {
      return bid.pbLg;
    } else if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.MEDIUM) {
      return bid.pbMg;
    } else if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.HIGH) {
      return bid.pbHg;
    } else if (bidGranularity === _constants_json__WEBPACK_IMPORTED_MODULE_2__.GRANULARITY_OPTIONS.CUSTOM) {
      return bid.pbCg;
    }
  };
};

/**
 * This function returns a function to get first advertiser domain from bid response meta
 * @returns {function}
 */
var getAdvertiserDomain = function getAdvertiserDomain() {
  return function (bid) {
    return bid.meta && bid.meta.advertiserDomains && bid.meta.advertiserDomains.length > 0 ? [bid.meta.advertiserDomains].flat()[0] : '';
  };
};

/**
 * This function returns a function to get the primary category id from bid response meta
 * @returns {function}
 */
var getPrimaryCatId = function getPrimaryCatId() {
  return function (bid) {
    return bid.meta && bid.meta.primaryCatId ? bid.meta.primaryCatId : '';
  };
};

// factory for key value objs
function createKeyVal(key, value) {
  return {
    key: key,
    val: typeof value === 'function' ? function (bidResponse, bidReq) {
      return value(bidResponse, bidReq);
    } : function (bidResponse) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.getValue)(bidResponse, value);
    }
  };
}
function defaultAdserverTargeting() {
  var TARGETING_KEYS = _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS;
  return [createKeyVal(TARGETING_KEYS.BIDDER, 'bidderCode'), createKeyVal(TARGETING_KEYS.AD_ID, 'adId'), createKeyVal(TARGETING_KEYS.PRICE_BUCKET, getPriceByGranularity()), createKeyVal(TARGETING_KEYS.SIZE, 'size'), createKeyVal(TARGETING_KEYS.DEAL, 'dealId'), createKeyVal(TARGETING_KEYS.SOURCE, 'source'), createKeyVal(TARGETING_KEYS.FORMAT, 'mediaType'), createKeyVal(TARGETING_KEYS.ADOMAIN, getAdvertiserDomain()), createKeyVal(TARGETING_KEYS.ACAT, getPrimaryCatId())];
}

/**
 * @param {string} mediaType
 * @param {string} bidderCode
 * @param {BidRequest} bidReq
 * @returns {*}
 */
function getStandardBidderSettings(mediaType, bidderCode) {
  var TARGETING_KEYS = _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS;
  var standardSettings = Object.assign({}, _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.settingsFor(null));
  if (!standardSettings[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING]) {
    standardSettings[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING] = defaultAdserverTargeting();
  }
  if ( true && mediaType === 'video') {
    var adserverTargeting = standardSettings[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING].slice();
    standardSettings[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING] = adserverTargeting;

    // Adding hb_uuid + hb_cache_id
    [TARGETING_KEYS.UUID, TARGETING_KEYS.CACHE_ID].forEach(function (targetingKeyVal) {
      if (typeof (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.find)(adserverTargeting, function (kvPair) {
        return kvPair.key === targetingKeyVal;
      }) === 'undefined') {
        adserverTargeting.push(createKeyVal(targetingKeyVal, 'videoCacheKey'));
      }
    });

    // Adding hb_cache_host
    if (_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('cache.url') && (!bidderCode || _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.get(bidderCode, 'sendStandardTargeting') !== false)) {
      var urlInfo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.parseUrl)(_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('cache.url'));
      if (typeof (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.find)(adserverTargeting, function (targetingKeyVal) {
        return targetingKeyVal.key === TARGETING_KEYS.CACHE_HOST;
      }) === 'undefined') {
        adserverTargeting.push(createKeyVal(TARGETING_KEYS.CACHE_HOST, function (bidResponse) {
          return (0,_utils_js__WEBPACK_IMPORTED_MODULE_16__["default"])(bidResponse, "adserverTargeting.".concat(TARGETING_KEYS.CACHE_HOST)) ? bidResponse.adserverTargeting[TARGETING_KEYS.CACHE_HOST] : urlInfo.hostname;
        }));
      }
    }
  }
  return standardSettings;
}
function getKeyValueTargetingPairs(bidderCode, custBidObj) {
  var _ref9 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref9$index = _ref9.index,
    index = _ref9$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_9__.auctionManager.index : _ref9$index;
  if (!custBidObj) {
    return {};
  }
  var bidRequest = index.getBidRequest(custBidObj);
  var keyValues = {};

  // 1) set the keys from "standard" setting or from prebid defaults
  // initialize default if not set
  var standardSettings = getStandardBidderSettings(custBidObj.mediaType, bidderCode);
  setKeys(keyValues, standardSettings, custBidObj, bidRequest);

  // 2) set keys from specific bidder setting override if they exist
  if (bidderCode && _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.getOwn(bidderCode, _constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING)) {
    setKeys(keyValues, _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.ownSettingsFor(bidderCode), custBidObj, bidRequest);
    custBidObj.sendStandardTargeting = _bidderSettings_js__WEBPACK_IMPORTED_MODULE_22__.bidderSettings.get(bidderCode, 'sendStandardTargeting');
  }

  // set native key value targeting
  if ( true && custBidObj['native']) {
    keyValues = Object.assign({}, keyValues, (0,_native_js__WEBPACK_IMPORTED_MODULE_18__.getNativeTargeting)(custBidObj));
  }
  return keyValues;
}
function setKeys(keyValues, bidderSettings, custBidObj, bidReq) {
  var targeting = bidderSettings[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING];
  custBidObj.size = custBidObj.getSize();
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__._each)(targeting, function (kvPair) {
    var key = kvPair.key;
    var value = kvPair.val;
    if (keyValues[key]) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logWarn)('The key: ' + key + ' is being overwritten');
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isFn)(value)) {
      try {
        value = value(custBidObj, bidReq);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logError)('bidmanager', 'ERROR', e);
      }
    }
    if ((typeof bidderSettings.suppressEmptyKeys !== 'undefined' && bidderSettings.suppressEmptyKeys === true || key === _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS.DEAL || key === _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS.ACAT) && (
    // hb_deal & hb_acat are suppressed automatically if not set

    (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.isEmptyStr)(value) || value === null || value === undefined)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.logInfo)("suppressing empty key '" + key + "' from adserver targeting");
    } else {
      keyValues[key] = value;
    }
  });
  return keyValues;
}
function adjustBids(bid) {
  var bidPriceAdjusted = (0,_utils_cpm_js__WEBPACK_IMPORTED_MODULE_23__.adjustCpm)(bid.cpm, bid);
  if (bidPriceAdjusted >= 0) {
    bid.cpm = bidPriceAdjusted;
  }
}

/**
 * groupByPlacement is a reduce function that converts an array of Bid objects
 * to an object with placement codes as keys, with each key representing an object
 * with an array of `Bid` objects for that placement
 * @returns {*} as { [adUnitCode]: { bids: [Bid, Bid, Bid] } }
 */
function groupByPlacement(bidsByPlacement, bid) {
  if (!bidsByPlacement[bid.adUnitCode]) {
    bidsByPlacement[bid.adUnitCode] = {
      bids: []
    };
  }
  bidsByPlacement[bid.adUnitCode].bids.push(bid);
  return bidsByPlacement;
}

/**
 * Returns a list of bids that we haven't received a response yet where the bidder did not call done
 * @param {BidRequest[]} bidderRequests List of bids requested for auction instance
 * @param {Set} timelyBidders Set of bidders which responded in time
 *
 * @typedef {Object} TimedOutBid
 * @property {string} bidId The id representing the bid
 * @property {string} bidder The string name of the bidder
 * @property {string} adUnitCode The code used to uniquely identify the ad unit on the publisher's page
 * @property {string} auctionId The id representing the auction
 *
 * @return {Array<TimedOutBid>} List of bids that Prebid hasn't received a response for
 */
function getTimedOutBids(bidderRequests, timelyBidders) {
  var timedOutBids = bidderRequests.map(function (bid) {
    return (bid.bids || []).filter(function (bid) {
      return !timelyBidders.has(bid.bidder);
    });
  }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_5__.flatten, []);
  return timedOutBids;
}

/***/ }),

/***/ "./src/auctionIndex.js":
/*!*****************************!*\
  !*** ./src/auctionIndex.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuctionIndex": function() { return /* binding */ AuctionIndex; }
/* harmony export */ });
/**
 * Retrieves request-related bid data.
 * All methods are designed to work with Bid (response) objects returned by bid adapters.
 */
function AuctionIndex(getAuctions) {
  Object.assign(this, {
    /**
     * @param auctionId
     * @returns {*} Auction instance for `auctionId`
     */
    getAuction: function getAuction(_ref) {
      var auctionId = _ref.auctionId;
      if (auctionId != null) {
        return getAuctions().find(function (auction) {
          return auction.getAuctionId() === auctionId;
        });
      }
    },
    /**
     * NOTE: you should prefer {@link #getMediaTypes} for looking up bid media types.
     * @param transactionId
     * @returns adUnit object for `transactionId`
     */
    getAdUnit: function getAdUnit(_ref2) {
      var transactionId = _ref2.transactionId;
      if (transactionId != null) {
        return getAuctions().flatMap(function (a) {
          return a.getAdUnits();
        }).find(function (au) {
          return au.transactionId === transactionId;
        });
      }
    },
    /**
     * @param transactionId
     * @param requestId?
     * @returns {*} mediaTypes object from bidRequest (through requestId) falling back to the adUnit (through transactionId).
     *
     * The bidRequest is given precedence because its mediaTypes can differ from the adUnit's (if bidder-specific labels are in use).
     * Bids that have no associated request do not have labels either, and use the adUnit's mediaTypes.
     */
    getMediaTypes: function getMediaTypes(_ref3) {
      var transactionId = _ref3.transactionId,
        requestId = _ref3.requestId;
      if (requestId != null) {
        var req = this.getBidRequest({
          requestId: requestId
        });
        if (req != null && (transactionId == null || req.transactionId === transactionId)) {
          return req.mediaTypes;
        }
      } else if (transactionId != null) {
        var au = this.getAdUnit({
          transactionId: transactionId
        });
        if (au != null) {
          return au.mediaTypes;
        }
      }
    },
    /**
     * @param requestId?
     * @param bidderRequestId?
     * @returns {*} bidderRequest that matches both requestId and bidderRequestId (if either or both are provided).
     *
     * NOTE: Bid responses are not guaranteed to have a corresponding request.
     */
    getBidderRequest: function getBidderRequest(_ref4) {
      var requestId = _ref4.requestId,
        bidderRequestId = _ref4.bidderRequestId;
      if (requestId != null || bidderRequestId != null) {
        var bers = getAuctions().flatMap(function (a) {
          return a.getBidRequests();
        });
        if (bidderRequestId != null) {
          bers = bers.filter(function (ber) {
            return ber.bidderRequestId === bidderRequestId;
          });
        }
        if (requestId == null) {
          return bers[0];
        } else {
          return bers.find(function (ber) {
            return ber.bids && ber.bids.find(function (br) {
              return br.bidId === requestId;
            }) != null;
          });
        }
      }
    },
    /**
     * @param requestId
     * @returns {*} bidRequest object for requestId
     *
     * NOTE: Bid responses are not guaranteed to have a corresponding request.
     */
    getBidRequest: function getBidRequest(_ref5) {
      var requestId = _ref5.requestId;
      if (requestId != null) {
        return getAuctions().flatMap(function (a) {
          return a.getBidRequests();
        }).flatMap(function (ber) {
          return ber.bids;
        }).find(function (br) {
          return br && br.bidId === requestId;
        });
      }
    }
  });
}

/***/ }),

/***/ "./src/auctionManager.js":
/*!*******************************!*\
  !*** ./src/auctionManager.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "auctionManager": function() { return /* binding */ auctionManager; }
/* harmony export */ });
/* unused harmony export newAuctionManager */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _auction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auction.js */ "./src/auction.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _auctionIndex_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auctionIndex.js */ "./src/auctionIndex.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/**
 * AuctionManager modules is responsible for creating auction instances.
 * This module is the gateway for Prebid core to access auctions.
 * It stores all created instances of auction and can be used to get consolidated values from auction.
 */

/**
 * @typedef {Object} AuctionManager
 *
 * @property {function(): Array} getBidsRequested - returns consolidated bid requests
 * @property {function(): Array} getBidsReceived - returns consolidated bid received
 * @property {function(): Array} getAllBidsForAdUnitCode - returns consolidated bid received for a given adUnit
 * @property {function(): Array} getAdUnits - returns consolidated adUnits
 * @property {function(): Array} getAdUnitCodes - returns consolidated adUnitCodes
 * @property {function(): Object} createAuction - creates auction instance and stores it for future reference
 * @property {function(): Object} findBidByAdId - find bid received by adId. This function will be called by $$PREBID_GLOBAL$$.renderAd
 * @property {function(): Object} getStandardBidderAdServerTargeting - returns standard bidder targeting for all the adapters. Refer http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.bidderSettings for more details
 * @property {function(Object): void} addWinningBid - add a winning bid to an auction based on auctionId
 * @property {function(): void} clearAllAuctions - clear all auctions for testing
 */








/**
 * Creates new instance of auctionManager. There will only be one instance of auctionManager but
 * a factory is created to assist in testing.
 *
 * @returns {AuctionManager} auctionManagerInstance
 */
function newAuctionManager() {
  var _auctions = [];
  var auctionManager = {};
  auctionManager.addWinningBid = function (bid) {
    var metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_0__.useMetrics)(bid.metrics);
    metrics.checkpoint('bidWon');
    metrics.timeBetween('auctionEnd', 'bidWon', 'render.pending');
    metrics.timeBetween('requestBids', 'bidWon', 'render.e2e');
    var auction = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.find)(_auctions, function (auction) {
      return auction.getAuctionId() === bid.auctionId;
    });
    if (auction) {
      bid.status = _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.RENDERED;
      auction.addWinningBid(bid);
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logWarn)("Auction not found when adding winning bid");
    }
  };
  auctionManager.getAllWinningBids = function () {
    return _auctions.map(function (auction) {
      return auction.getWinningBids();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []);
  };
  auctionManager.getBidsRequested = function () {
    return _auctions.map(function (auction) {
      return auction.getBidRequests();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []);
  };
  auctionManager.getNoBids = function () {
    return _auctions.map(function (auction) {
      return auction.getNoBids();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []);
  };
  auctionManager.getBidsReceived = function () {
    return _auctions.map(function (auction) {
      if (auction.getAuctionStatus() === _auction_js__WEBPACK_IMPORTED_MODULE_4__.AUCTION_COMPLETED) {
        return auction.getBidsReceived();
      }
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []).filter(function (bid) {
      return bid;
    });
  };
  auctionManager.getAllBidsForAdUnitCode = function (adUnitCode) {
    return _auctions.map(function (auction) {
      return auction.getBidsReceived();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []).filter(function (bid) {
      return bid && bid.adUnitCode === adUnitCode;
    });
  };
  auctionManager.getAdUnits = function () {
    return _auctions.map(function (auction) {
      return auction.getAdUnits();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []);
  };
  auctionManager.getAdUnitCodes = function () {
    return _auctions.map(function (auction) {
      return auction.getAdUnitCodes();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []).filter(_utils_js__WEBPACK_IMPORTED_MODULE_3__.uniques);
  };
  auctionManager.createAuction = function (opts) {
    var auction = (0,_auction_js__WEBPACK_IMPORTED_MODULE_4__.newAuction)(opts);
    _addAuction(auction);
    return auction;
  };
  auctionManager.findBidByAdId = function (adId) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.find)(_auctions.map(function (auction) {
      return auction.getBidsReceived();
    }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten, []), function (bid) {
      return bid.adId === adId;
    });
  };
  auctionManager.getStandardBidderAdServerTargeting = function () {
    return (0,_auction_js__WEBPACK_IMPORTED_MODULE_4__.getStandardBidderSettings)()[_constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING];
  };
  auctionManager.setStatusForBids = function (adId, status) {
    var bid = auctionManager.findBidByAdId(adId);
    if (bid) bid.status = status;
    if (bid && status === _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.BID_TARGETING_SET) {
      var auction = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.find)(_auctions, function (auction) {
        return auction.getAuctionId() === bid.auctionId;
      });
      if (auction) auction.setBidTargeting(bid);
    }
  };
  auctionManager.getLastAuctionId = function () {
    return _auctions.length && _auctions[_auctions.length - 1].getAuctionId();
  };
  auctionManager.clearAllAuctions = function () {
    _auctions.length = 0;
  };
  function _addAuction(auction) {
    _auctions.push(auction);
  }
  auctionManager.index = new _auctionIndex_js__WEBPACK_IMPORTED_MODULE_5__.AuctionIndex(function () {
    return _auctions;
  });
  return auctionManager;
}
var auctionManager = newAuctionManager();

/***/ }),

/***/ "./src/bidderSettings.js":
/*!*******************************!*\
  !*** ./src/bidderSettings.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bidderSettings": function() { return /* binding */ bidderSettings; }
/* harmony export */ });
/* unused harmony export ScopedSettings */
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");


function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }



var _resolveScope = /*#__PURE__*/new WeakSet();
var ScopedSettings = /*#__PURE__*/function () {
  function ScopedSettings(getSettings, defaultScope) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ScopedSettings);
    _classPrivateMethodInitSpec(this, _resolveScope);
    this.getSettings = getSettings;
    this.defaultScope = defaultScope;
  }

  /**
   * Get setting value at `path` under the given scope, falling back to the default scope if needed.
   * If `scope` is `null`, get the setting's default value.
   * @param scope {String|null}
   * @param path {String}
   * @returns {*}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ScopedSettings, [{
    key: "get",
    value: function get(scope, path) {
      var value = this.getOwn(scope, path);
      if (typeof value === 'undefined') {
        value = this.getOwn(null, path);
      }
      return value;
    }

    /**
     * Get the setting value at `path` *without* falling back to the default value.
     * @param scope {String}
     * @param path {String}
     * @returns {*}
     */
  }, {
    key: "getOwn",
    value: function getOwn(scope, path) {
      scope = _classPrivateMethodGet(this, _resolveScope, _resolveScope2).call(this, scope);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.getSettings(), "".concat(scope, ".").concat(path));
    }

    /**
     * @returns {string[]} all existing scopes except the default one.
     */
  }, {
    key: "getScopes",
    value: function getScopes() {
      var _this = this;
      return Object.keys(this.getSettings()).filter(function (scope) {
        return scope !== _this.defaultScope;
      });
    }

    /**
     * @returns all settings in the given scope, merged with the settings for the default scope.
     */
  }, {
    key: "settingsFor",
    value: function settingsFor(scope) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.mergeDeep)({}, this.ownSettingsFor(null), this.ownSettingsFor(scope));
    }

    /**
     * @returns all settings in the given scope, *without* any of the default settings.
     */
  }, {
    key: "ownSettingsFor",
    value: function ownSettingsFor(scope) {
      scope = _classPrivateMethodGet(this, _resolveScope, _resolveScope2).call(this, scope);
      return this.getSettings()[scope] || {};
    }
  }]);
  return ScopedSettings;
}();
function _resolveScope2(scope) {
  if (scope == null) {
    return this.defaultScope;
  } else {
    return scope;
  }
}
var bidderSettings = new ScopedSettings(function () {
  return (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__.getGlobal)().bidderSettings || {};
}, _constants_json__WEBPACK_IMPORTED_MODULE_5__.JSON_MAPPING.BD_SETTING_STANDARD);

/***/ }),

/***/ "./src/bidfactory.js":
/*!***************************!*\
  !*** ./src/bidfactory.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createBid": function() { return /* binding */ createBid; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");


/**
 Required paramaters
 bidderCode,
 height,
 width,
 statusCode
 Optional paramaters
 adId,
 cpm,
 ad,
 adUrl,
 dealId,
 priceKeyString;
 */
function Bid(statusCode) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$src = _ref.src,
    src = _ref$src === void 0 ? 'client' : _ref$src,
    _ref$bidder = _ref.bidder,
    bidder = _ref$bidder === void 0 ? '' : _ref$bidder,
    bidId = _ref.bidId,
    transactionId = _ref.transactionId,
    auctionId = _ref.auctionId;
  var _bidSrc = src;
  var _statusCode = statusCode || 0;
  this.bidderCode = bidder;
  this.width = 0;
  this.height = 0;
  this.statusMessage = _getStatus();
  this.adId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getUniqueIdentifierStr)();
  this.requestId = bidId;
  this.transactionId = transactionId;
  this.auctionId = auctionId;
  this.mediaType = 'banner';
  this.source = _bidSrc;
  function _getStatus() {
    switch (_statusCode) {
      case 0:
        return 'Pending';
      case 1:
        return 'Bid available';
      case 2:
        return 'Bid returned empty or error response';
      case 3:
        return 'Bid timed out';
    }
  }
  this.getStatusCode = function () {
    return _statusCode;
  };

  // returns the size of the bid creative. Concatenation of width and height by ‘x’.
  this.getSize = function () {
    return this.width + 'x' + this.height;
  };
  this.getIdentifiers = function () {
    return {
      src: this.source,
      bidder: this.bidderCode,
      bidId: this.requestId,
      transactionId: this.transactionId,
      auctionId: this.auctionId
    };
  };
}

// Bid factory function.
function createBid(statusCode, identifiers) {
  return new Bid(statusCode, identifiers);
}

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RANDOM": function() { return /* binding */ RANDOM; },
/* harmony export */   "config": function() { return /* binding */ config; }
/* harmony export */ });
/* unused harmony export newConfig */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cpmBucketManager.js */ "./src/cpmBucketManager.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/*
 * Module for getting and setting Prebid configuration.
*/

/**
 * @typedef {Object} MediaTypePriceGranularity
 *
 * @property {(string|Object)} [banner]
 * @property {(string|Object)} [native]
 * @property {(string|Object)} [video]
 * @property {(string|Object)} [video-instream]
 * @property {(string|Object)} [video-outstream]
 */





var DEFAULT_DEBUG = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)(_constants_json__WEBPACK_IMPORTED_MODULE_2__.DEBUG_MODE).toUpperCase() === 'TRUE';
var DEFAULT_BIDDER_TIMEOUT = 3000;
var DEFAULT_ENABLE_SEND_ALL_BIDS = true;
var DEFAULT_DISABLE_AJAX_TIMEOUT = false;
var DEFAULT_BID_CACHE = false;
var DEFAULT_DEVICE_ACCESS = true;
var DEFAULT_MAX_NESTED_IFRAMES = 10;
var DEFAULT_TIMEOUTBUFFER = 400;
var RANDOM = 'random';
var FIXED = 'fixed';
var VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;
var DEFAULT_BIDDER_SEQUENCE = RANDOM;
var GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};
var ALL_TOPICS = '*';

/**
 * @typedef {object} PrebidConfig
 *
 * @property {string} cache.url Set a url if we should use prebid-cache to store video bids before adding
 *   bids to the auction. **NOTE** This must be set if you want to use the dfpAdServerVideo module.
 */

function newConfig() {
  var listeners = [];
  var defaults;
  var config;
  var bidderConfig;
  var currBidder = null;
  function resetConfig() {
    defaults = {};
    function getProp(name) {
      return props[name].val;
    }
    function setProp(name, val) {
      props[name].val = val;
    }
    var props = {
      publisherDomain: {
        set: function set(val) {
          if (val != null) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('publisherDomain is deprecated and has no effect since v7 - use pageUrl instead');
          }
          setProp('publisherDomain', val);
        }
      },
      priceGranularity: {
        val: GRANULARITY_OPTIONS.MEDIUM,
        set: function set(val) {
          if (validatePriceGranularity(val)) {
            if (typeof val === 'string') {
              setProp('priceGranularity', hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM);
            } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
              setProp('customPriceBucket', val);
              setProp('priceGranularity', GRANULARITY_OPTIONS.CUSTOM);
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)('Using custom price granularity');
            }
          }
        }
      },
      customPriceBucket: {
        val: {},
        set: function set() {}
      },
      mediaTypePriceGranularity: {
        val: {},
        set: function set(val) {
          val != null && setProp('mediaTypePriceGranularity', Object.keys(val).reduce(function (aggregate, item) {
            if (validatePriceGranularity(val[item])) {
              if (typeof val === 'string') {
                aggregate[item] = hasGranularity(val[item]) ? val[item] : getProp('priceGranularity');
              } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
                aggregate[item] = val[item];
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Using custom price granularity for ".concat(item));
              }
            } else {
              (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Invalid price granularity for media type: ".concat(item));
            }
            return aggregate;
          }, {}));
        }
      },
      bidderSequence: {
        val: DEFAULT_BIDDER_SEQUENCE,
        set: function set(val) {
          if (VALID_ORDERS[val]) {
            setProp('bidderSequence', val);
          } else {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Invalid order: ".concat(val, ". Bidder Sequence was not set."));
          }
        }
      },
      auctionOptions: {
        val: {},
        set: function set(val) {
          if (validateauctionOptions(val)) {
            setProp('auctionOptions', val);
          }
        }
      }
    };
    var newConfig = {
      // `debug` is equivalent to legacy `pbjs.logging` property
      debug: DEFAULT_DEBUG,
      bidderTimeout: DEFAULT_BIDDER_TIMEOUT,
      enableSendAllBids: DEFAULT_ENABLE_SEND_ALL_BIDS,
      useBidCache: DEFAULT_BID_CACHE,
      /**
       * deviceAccess set to false will disable setCookie, getCookie, hasLocalStorage
       * @type {boolean}
       */
      deviceAccess: DEFAULT_DEVICE_ACCESS,
      // timeout buffer to adjust for bidder CDN latency
      timeoutBuffer: DEFAULT_TIMEOUTBUFFER,
      disableAjaxTimeout: DEFAULT_DISABLE_AJAX_TIMEOUT,
      // default max nested iframes for referer detection
      maxNestedIframes: DEFAULT_MAX_NESTED_IFRAMES
    };
    Object.defineProperties(newConfig, Object.fromEntries(Object.entries(props).map(function (_ref) {
      var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, 2),
        k = _ref2[0],
        def = _ref2[1];
      return [k, Object.assign({
        get: getProp.bind(null, k),
        set: setProp.bind(null, k),
        enumerable: true
      }, def)];
    })));
    if (config) {
      callSubscribers(Object.keys(config).reduce(function (memo, topic) {
        if (config[topic] !== newConfig[topic]) {
          memo[topic] = newConfig[topic] || {};
        }
        return memo;
      }, {}));
    }
    config = newConfig;
    bidderConfig = {};
    function hasGranularity(val) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.find)(Object.keys(GRANULARITY_OPTIONS), function (option) {
        return val === GRANULARITY_OPTIONS[option];
      });
    }
    function validatePriceGranularity(val) {
      if (!val) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Prebid Error: no value passed to `setPriceGranularity()`');
        return false;
      }
      if (typeof val === 'string') {
        if (!hasGranularity(val)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.');
        }
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
        if (!(0,_cpmBucketManager_js__WEBPACK_IMPORTED_MODULE_5__.isValidPriceConfig)(val)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Invalid custom price value passed to `setPriceGranularity()`');
          return false;
        }
      }
      return true;
    }
    function validateauctionOptions(val) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(val)) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Auction Options must be an object');
        return false;
      }
      for (var _i = 0, _Object$keys = Object.keys(val); _i < _Object$keys.length; _i++) {
        var k = _Object$keys[_i];
        if (k !== 'secondaryBidders' && k !== 'suppressStaleRender') {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options given an incorrect param: ".concat(k));
          return false;
        }
        if (k === 'secondaryBidders') {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be of type Array"));
            return false;
          } else if (!val[k].every(_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be only string"));
            return false;
          }
        } else if (k === 'suppressStaleRender') {
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(val[k])) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Auction Options ".concat(k, " must be of type boolean"));
            return false;
          }
        }
      }
      return true;
    }
  }

  /**
   * Returns base config with bidder overrides (if there is currently a bidder)
   * @private
   */
  function _getConfig() {
    if (currBidder && bidderConfig && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(bidderConfig[currBidder])) {
      var currBidderConfig = bidderConfig[currBidder];
      var configTopicSet = new Set(Object.keys(config).concat(Object.keys(currBidderConfig)));
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.arrayFrom)(configTopicSet).reduce(function (memo, topic) {
        if (typeof currBidderConfig[topic] === 'undefined') {
          memo[topic] = config[topic];
        } else if (typeof config[topic] === 'undefined') {
          memo[topic] = currBidderConfig[topic];
        } else {
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(currBidderConfig[topic])) {
            memo[topic] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)({}, config[topic], currBidderConfig[topic]);
          } else {
            memo[topic] = currBidderConfig[topic];
          }
        }
        return memo;
      }, {});
    }
    return Object.assign({}, config);
  }
  function _getRestrictedConfig() {
    // This causes reading 'ortb2' to throw an error; with prebid 7, that will almost
    // always be the incorrect way to access FPD configuration (https://github.com/prebid/Prebid.js/issues/7651)
    // code that needs the ortb2 config should explicitly use `getAnyConfig`
    // TODO: this is meant as a temporary tripwire to catch inadvertent use of `getConfig('ortb')` as we transition.
    // It should be removed once the risk of that happening is low enough.
    var conf = _getConfig();
    Object.defineProperty(conf, 'ortb2', {
      get: function get() {
        throw new Error('invalid access to \'orbt2\' config - use request parameters instead');
      }
    });
    return conf;
  }
  var _map = [_getConfig, _getRestrictedConfig].map(function (accessor) {
      /*
       * Returns configuration object if called without parameters,
       * or single configuration property if given a string matching a configuration
       * property name.  Allows deep access e.g. getConfig('currency.adServerCurrency')
       *
       * If called with callback parameter, or a string and a callback parameter,
       * subscribes to configuration updates. See `subscribe` function for usage.
       */
      return function getConfig() {
        if (arguments.length <= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'function') {
          var option = arguments.length <= 0 ? undefined : arguments[0];
          return option ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(accessor(), option) : _getConfig();
        }
        return subscribe.apply(void 0, arguments);
      };
    }),
    _map2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_map, 2),
    getAnyConfig = _map2[0],
    getConfig = _map2[1];
  var _map3 = [getConfig, getAnyConfig].map(function (wrapee) {
      /*
       * Like getConfig, except that it returns a deepClone of the result.
       */
      return function readConfig() {
        var res = wrapee.apply(void 0, arguments);
        if (res && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(res) === 'object') {
          res = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(res);
        }
        return res;
      };
    }),
    _map4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_map3, 2),
    readConfig = _map4[0],
    readAnyConfig = _map4[1];

  /**
   * Internal API for modules (such as prebid-server) that might need access to all bidder config
   */
  function getBidderConfig() {
    return bidderConfig;
  }

  /*
   * Sets configuration given an object containing key-value pairs and calls
   * listeners that were added by the `subscribe` function
   */
  function setConfig(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(options)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('setConfig options must be an object');
      return;
    }
    var topics = Object.keys(options);
    var topicalConfig = {};
    topics.forEach(function (topic) {
      var option = options[topic];
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(defaults[topic]) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(option)) {
        option = Object.assign({}, defaults[topic], option);
      }
      try {
        topicalConfig[topic] = config[topic] = option;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Cannot set config for property ".concat(topic, " : "), e);
      }
    });
    callSubscribers(topicalConfig);
  }

  /**
   * Sets configuration defaults which setConfig values can be applied on top of
   * @param {object} options
   */
  function setDefaults(options) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(defaults)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('defaults must be an object');
      return;
    }
    Object.assign(defaults, options);
    // Add default values to config as well
    Object.assign(config, options);
  }

  /*
   * Adds a function to a set of listeners that are invoked whenever `setConfig`
   * is called. The subscribed function will be passed the options object that
   * was used in the `setConfig` call. Topics can be subscribed to to only get
   * updates when specific properties are updated by passing a topic string as
   * the first parameter.
   *
   * If `options.init` is true, the listener will be immediately called with the current options.
   *
   * Returns an `unsubscribe` function for removing the subscriber from the
   * set of listeners
   *
   * Example use:
   * // subscribe to all configuration changes
   * subscribe((config) => console.log('config set:', config));
   *
   * // subscribe to only 'logging' changes
   * subscribe('logging', (config) => console.log('logging set:', config));
   *
   * // unsubscribe
   * const unsubscribe = subscribe(...);
   * unsubscribe(); // no longer listening
   *
   */
  function subscribe(topic, listener) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = listener;
    if (typeof topic !== 'string') {
      // first param should be callback function in this case,
      // meaning it gets called for any config change
      callback = topic;
      topic = ALL_TOPICS;
      options = listener || {};
    }
    if (typeof callback !== 'function') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('listener must be a function');
      return;
    }
    var nl = {
      topic: topic,
      callback: callback
    };
    listeners.push(nl);
    if (options.init) {
      if (topic === ALL_TOPICS) {
        callback(getConfig());
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback((0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, topic, getConfig(topic)));
      }
    }

    // save and call this function to remove the listener
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(nl), 1);
    };
  }

  /*
   * Calls listeners that were added by the `subscribe` function
   */
  function callSubscribers(options) {
    var TOPICS = Object.keys(options);

    // call subscribers of a specific topic, passing only that configuration
    listeners.filter(function (listener) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(TOPICS, listener.topic);
    }).forEach(function (listener) {
      listener.callback((0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, listener.topic, options[listener.topic]));
    });

    // call subscribers that didn't give a topic, passing everything that was set
    listeners.filter(function (listener) {
      return listener.topic === ALL_TOPICS;
    }).forEach(function (listener) {
      return listener.callback(options);
    });
  }
  function setBidderConfig(config) {
    var mergeFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    try {
      check(config);
      config.bidders.forEach(function (bidder) {
        if (!bidderConfig[bidder]) {
          bidderConfig[bidder] = {};
        }
        Object.keys(config.config).forEach(function (topic) {
          var option = config.config[topic];
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(option)) {
            var func = mergeFlag ? _utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep : Object.assign;
            bidderConfig[bidder][topic] = func({}, bidderConfig[bidder][topic] || {}, option);
          } else {
            bidderConfig[bidder][topic] = option;
          }
        });
      });
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(e);
    }
    function check(obj) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj)) {
        throw 'setBidderConfig bidder options must be an object';
      }
      if (!(Array.isArray(obj.bidders) && obj.bidders.length)) {
        throw 'setBidderConfig bidder options must contain a bidders list with at least 1 bidder';
      }
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj.config)) {
        throw 'setBidderConfig bidder options must contain a config object';
      }
    }
  }
  function mergeConfig(obj) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(obj)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('mergeConfig input must be an object');
      return;
    }
    var mergedConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeDeep)(_getConfig(), obj);
    setConfig(_objectSpread({}, mergedConfig));
    return mergedConfig;
  }
  function mergeBidderConfig(obj) {
    return setBidderConfig(obj, true);
  }

  /**
   * Internal functions for core to execute some synchronous code while having an active bidder set.
   */
  function runWithBidder(bidder, fn) {
    currBidder = bidder;
    try {
      return fn();
    } finally {
      resetBidder();
    }
  }
  function callbackWithBidder(bidder) {
    return function (cb) {
      return function () {
        if (typeof cb === 'function') {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return runWithBidder(bidder, _utils_js__WEBPACK_IMPORTED_MODULE_1__.bind.call.apply(_utils_js__WEBPACK_IMPORTED_MODULE_1__.bind, [cb, this].concat(args)));
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('config.callbackWithBidder callback is not a function');
        }
      };
    };
  }
  function getCurrentBidder() {
    return currBidder;
  }
  function resetBidder() {
    currBidder = null;
  }
  resetConfig();
  return {
    getCurrentBidder: getCurrentBidder,
    resetBidder: resetBidder,
    getConfig: getConfig,
    getAnyConfig: getAnyConfig,
    readConfig: readConfig,
    readAnyConfig: readAnyConfig,
    setConfig: setConfig,
    mergeConfig: mergeConfig,
    setDefaults: setDefaults,
    resetConfig: resetConfig,
    runWithBidder: runWithBidder,
    callbackWithBidder: callbackWithBidder,
    setBidderConfig: setBidderConfig,
    getBidderConfig: getBidderConfig,
    mergeBidderConfig: mergeBidderConfig
  };
}
var config = newConfig();

/***/ }),

/***/ "./src/consentHandler.js":
/*!*******************************!*\
  !*** ./src/consentHandler.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GDPR_GVLIDS": function() { return /* binding */ GDPR_GVLIDS; },
/* harmony export */   "GdprConsentHandler": function() { return /* binding */ GdprConsentHandler; },
/* harmony export */   "GppConsentHandler": function() { return /* binding */ GppConsentHandler; },
/* harmony export */   "UspConsentHandler": function() { return /* binding */ UspConsentHandler; }
/* harmony export */ });
/* unused harmony exports VENDORLESS_GVLID, ConsentHandler, gvlidRegistry */
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldGet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldSet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }



/**
 * Placeholder gvlid for when vendor consent is not required. When this value is used as gvlid, the gdpr
 * enforcement module will take it to mean "vendor consent was given".
 *
 * see https://github.com/prebid/Prebid.js/issues/8161
 */
var VENDORLESS_GVLID = Object.freeze({});
var _enabled = /*#__PURE__*/new WeakMap();
var _data = /*#__PURE__*/new WeakMap();
var _defer = /*#__PURE__*/new WeakMap();
var _ready = /*#__PURE__*/new WeakMap();
var _resolve = /*#__PURE__*/new WeakSet();
var ConsentHandler = /*#__PURE__*/function () {
  function ConsentHandler() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ConsentHandler);
    _classPrivateMethodInitSpec(this, _resolve);
    _classPrivateFieldInitSpec(this, _enabled, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _data, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _defer, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _ready, {
      writable: true,
      value: void 0
    });
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "generatedTime", void 0);
    this.reset();
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(ConsentHandler, [{
    key: "reset",
    value:
    /**
     * reset this handler (mainly for tests)
     */
    function reset() {
      (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _defer, (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.defer)());
      (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _enabled, false);
      (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _data, null);
      (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _ready, false);
      this.generatedTime = null;
    }

    /**
     * Enable this consent handler. This should be called by the relevant consent management module
     * on initialization.
     */
  }, {
    key: "enable",
    value: function enable() {
      (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _enabled, true);
    }

    /**
     * @returns {boolean} true if the related consent management module is enabled.
     */
  }, {
    key: "enabled",
    get: function get() {
      return (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _enabled);
    }

    /**
     * @returns {boolean} true if consent data has been resolved (it may be `null` if the resolution failed).
     */
  }, {
    key: "ready",
    get: function get() {
      return (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _ready);
    }

    /**
     * @returns a promise than resolves to the consent data, or null if no consent data is available
     */
  }, {
    key: "promise",
    get: function get() {
      if ((0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _ready)) {
        return _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.GreedyPromise.resolve((0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _data));
      }
      if (!(0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _enabled)) {
        _classPrivateMethodGet(this, _resolve, _resolve2).call(this, null);
      }
      return (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _defer).promise;
    }
  }, {
    key: "setConsentData",
    value: function setConsentData(data) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.timestamp)();
      this.generatedTime = time;
      _classPrivateMethodGet(this, _resolve, _resolve2).call(this, data);
    }
  }, {
    key: "getConsentData",
    value: function getConsentData() {
      return (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _data);
    }
  }]);
  return ConsentHandler;
}();
function _resolve2(data) {
  (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _ready, true);
  (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_5__["default"])(this, _data, data);
  (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_7__["default"])(this, _defer).resolve(data);
}
var UspConsentHandler = /*#__PURE__*/function (_ConsentHandler) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_9__["default"])(UspConsentHandler, _ConsentHandler);
  var _super = _createSuper(UspConsentHandler);
  function UspConsentHandler() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, UspConsentHandler);
    return _super.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(UspConsentHandler, [{
    key: "getConsentMeta",
    value: function getConsentMeta() {
      var consentData = this.getConsentData();
      if (consentData && this.generatedTime) {
        return {
          usp: consentData,
          generatedAt: this.generatedTime
        };
      }
    }
  }]);
  return UspConsentHandler;
}(ConsentHandler);
var GdprConsentHandler = /*#__PURE__*/function (_ConsentHandler2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_9__["default"])(GdprConsentHandler, _ConsentHandler2);
  var _super2 = _createSuper(GdprConsentHandler);
  function GdprConsentHandler() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, GdprConsentHandler);
    return _super2.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(GdprConsentHandler, [{
    key: "getConsentMeta",
    value: function getConsentMeta() {
      var consentData = this.getConsentData();
      if (consentData && consentData.vendorData && this.generatedTime) {
        return {
          gdprApplies: consentData.gdprApplies,
          consentStringSize: (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.isStr)(consentData.vendorData.tcString) ? consentData.vendorData.tcString.length : 0,
          generatedAt: this.generatedTime,
          apiVersion: consentData.apiVersion
        };
      }
    }
  }]);
  return GdprConsentHandler;
}(ConsentHandler);
var GppConsentHandler = /*#__PURE__*/function (_ConsentHandler3) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_9__["default"])(GppConsentHandler, _ConsentHandler3);
  var _super3 = _createSuper(GppConsentHandler);
  function GppConsentHandler() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, GppConsentHandler);
    return _super3.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(GppConsentHandler, [{
    key: "getConsentMeta",
    value: function getConsentMeta() {
      var consentData = this.getConsentData();
      if (consentData && this.generatedTime) {
        return {
          generatedAt: this.generatedTime
        };
      }
    }
  }]);
  return GppConsentHandler;
}(ConsentHandler);
function gvlidRegistry() {
  var registry = {};
  var flat = {};
  var none = {};
  return {
    /**
     * Register a module's GVL ID.
     * @param {string} moduleType defined in `activities/modules.js`
     * @param {string} moduleName
     * @param {number} gvlid
     */
    register: function register(moduleType, moduleName, gvlid) {
      if (gvlid) {
        (registry[moduleName] = registry[moduleName] || {})[moduleType] = gvlid;
        if (flat.hasOwnProperty(moduleName)) {
          if (flat[moduleName] !== gvlid) flat[moduleName] = none;
        } else {
          flat[moduleName] = gvlid;
        }
      }
    },
    /**
     * Get a module's GVL ID(s).
     *
     * @param {string} moduleName
     * @return {{modules: {[moduleType]: number}, gvlid?: number}} an object where:
     *   `modules` is a map from module type to that module's GVL ID;
     *   `gvlid` is the single GVL ID for this family of modules (only defined
     *   if all modules with this name declared the same ID).
     */
    get: function get(moduleName) {
      var result = {
        modules: registry[moduleName] || {}
      };
      if (flat.hasOwnProperty(moduleName) && flat[moduleName] !== none) {
        result.gvlid = flat[moduleName];
      }
      return result;
    }
  };
}
var GDPR_GVLIDS = gvlidRegistry();

/***/ }),

/***/ "./src/cpmBucketManager.js":
/*!*********************************!*\
  !*** ./src/cpmBucketManager.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPriceBucketString": function() { return /* binding */ getPriceBucketString; },
/* harmony export */   "isValidPriceConfig": function() { return /* binding */ isValidPriceConfig; }
/* harmony export */ });
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ "./src/config.js");



var _defaultPrecision = 2;
var _lgPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.5
  }]
};
var _mgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.1
  }]
};
var _hgPriceConfig = {
  'buckets': [{
    'max': 20,
    'increment': 0.01
  }]
};
var _densePriceConfig = {
  'buckets': [{
    'max': 3,
    'increment': 0.01
  }, {
    'max': 8,
    'increment': 0.05
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
var _autoPriceConfig = {
  'buckets': [{
    'max': 5,
    'increment': 0.05
  }, {
    'max': 10,
    'increment': 0.1
  }, {
    'max': 20,
    'increment': 0.5
  }]
};
function getPriceBucketString(cpm, customConfig) {
  var granularityMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var cpmFloat = parseFloat(cpm);
  if (isNaN(cpmFloat)) {
    cpmFloat = '';
  }
  return {
    low: cpmFloat === '' ? '' : getCpmStringValue(cpm, _lgPriceConfig, granularityMultiplier),
    med: cpmFloat === '' ? '' : getCpmStringValue(cpm, _mgPriceConfig, granularityMultiplier),
    high: cpmFloat === '' ? '' : getCpmStringValue(cpm, _hgPriceConfig, granularityMultiplier),
    auto: cpmFloat === '' ? '' : getCpmStringValue(cpm, _autoPriceConfig, granularityMultiplier),
    dense: cpmFloat === '' ? '' : getCpmStringValue(cpm, _densePriceConfig, granularityMultiplier),
    custom: cpmFloat === '' ? '' : getCpmStringValue(cpm, customConfig, granularityMultiplier)
  };
}
function getCpmStringValue(cpm, config, granularityMultiplier) {
  var cpmStr = '';
  if (!isValidPriceConfig(config)) {
    return cpmStr;
  }
  var cap = config.buckets.reduce(function (prev, curr) {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    'max': 0
  });
  var bucketFloor = 0;
  var bucket = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_0__.find)(config.buckets, function (bucket) {
    if (cpm > cap.max * granularityMultiplier) {
      // cpm exceeds cap, just return the cap.
      var precision = bucket.precision;
      if (typeof precision === 'undefined') {
        precision = _defaultPrecision;
      }
      cpmStr = (bucket.max * granularityMultiplier).toFixed(precision);
    } else if (cpm <= bucket.max * granularityMultiplier && cpm >= bucketFloor * granularityMultiplier) {
      bucket.min = bucketFloor;
      return bucket;
    } else {
      bucketFloor = bucket.max;
    }
  });
  if (bucket) {
    cpmStr = getCpmTarget(cpm, bucket, granularityMultiplier);
  }
  return cpmStr;
}
function isValidPriceConfig(config) {
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(config) || !config.buckets || !Array.isArray(config.buckets)) {
    return false;
  }
  var isValid = true;
  config.buckets.forEach(function (bucket) {
    if (!bucket.max || !bucket.increment) {
      isValid = false;
    }
  });
  return isValid;
}
function getCpmTarget(cpm, bucket, granularityMultiplier) {
  var precision = typeof bucket.precision !== 'undefined' ? bucket.precision : _defaultPrecision;
  var increment = bucket.increment * granularityMultiplier;
  var bucketMin = bucket.min * granularityMultiplier;
  var roundingFunction = Math.floor;
  var customRoundingFunction = _config_js__WEBPACK_IMPORTED_MODULE_2__.config.getConfig('cpmRoundingFunction');
  if (typeof customRoundingFunction === 'function') {
    roundingFunction = customRoundingFunction;
  }

  // start increments at the bucket min and then add bucket min back to arrive at the correct rounding
  // note - we're padding the values to avoid using decimals in the math prior to flooring
  // this is done as JS can return values slightly below the expected mark which would skew the price bucket target
  //   (eg 4.01 / 0.01 = 400.99999999999994)
  // min precison should be 2 to move decimal place over.
  var pow = Math.pow(10, precision + 2);
  var cpmToRound = (cpm * pow - bucketMin * pow) / (increment * pow);
  var cpmTarget;
  var invalidRounding;
  // It is likely that we will be passed {cpmRoundingFunction: roundingFunction()}
  // rather than the expected {cpmRoundingFunction: roundingFunction}. Default back to floor in that case
  try {
    cpmTarget = roundingFunction(cpmToRound) * increment + bucketMin;
  } catch (err) {
    invalidRounding = true;
  }
  if (invalidRounding || typeof cpmTarget !== 'number') {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Invalid rounding function passed in config');
    cpmTarget = Math.floor(cpmToRound) * increment + bucketMin;
  }
  // force to 10 decimal places to deal with imprecise decimal/binary conversions
  //    (for example 0.1 * 3 = 0.30000000000000004)

  cpmTarget = Number(cpmTarget.toFixed(10));
  return cpmTarget.toFixed(precision);
}


/***/ }),

/***/ "./src/debugging.js":
/*!**************************!*\
  !*** ./src/debugging.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadSession": function() { return /* binding */ loadSession; }
/* harmony export */ });
/* unused harmony exports DEBUG_KEY, debuggingModuleLoader, debuggingControls, reset */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _adloader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adloader.js */ "./src/adloader.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");







var DEBUG_KEY = "__pbjs_debugging__";
function isDebuggingInstalled() {
  return (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)().installedModules.includes('debugging');
}
function loadScript(url) {
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise(function (resolve) {
    (0,_adloader_js__WEBPACK_IMPORTED_MODULE_2__.loadExternalScript)(url, 'debugging', resolve);
  });
}
function debuggingModuleLoader() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$alreadyInstalled = _ref.alreadyInstalled,
    alreadyInstalled = _ref$alreadyInstalled === void 0 ? isDebuggingInstalled : _ref$alreadyInstalled,
    _ref$script = _ref.script,
    script = _ref$script === void 0 ? loadScript : _ref$script;
  var loading = null;
  return function () {
    if (loading == null) {
      loading = new _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise(function (resolve, reject) {
        // run this in a 0-delay timeout to give installedModules time to be populated
        setTimeout(function () {
          if (alreadyInstalled()) {
            resolve();
          } else {
            var url = "/build/dev/debugging-standalone.js";
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logMessage)("Debugging module not installed, loading it from \"".concat(url, "\"..."));
            (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)()._installDebugging = true;
            script(url).then(function () {
              (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)()._installDebugging({
                DEBUG_KEY: DEBUG_KEY,
                hook: _hook_js__WEBPACK_IMPORTED_MODULE_4__.hook,
                config: _config_js__WEBPACK_IMPORTED_MODULE_5__.config,
                createBid: _bidfactory_js__WEBPACK_IMPORTED_MODULE_6__.createBid,
                logger: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.prefixLog)('DEBUG:')
              });
            }).then(resolve, reject);
          }
        });
      });
    }
    return loading;
  };
}
function debuggingControls() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref2$load = _ref2.load,
    load = _ref2$load === void 0 ? debuggingModuleLoader() : _ref2$load,
    _ref2$hook = _ref2.hook,
    hook = _ref2$hook === void 0 ? (0,_hook_js__WEBPACK_IMPORTED_MODULE_4__.getHook)('requestBids') : _ref2$hook;
  var promise = null;
  var enabled = false;
  function waitForDebugging(next) {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return (promise || _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise.resolve()).then(function () {
      return next.apply(_this, args);
    });
  }
  function enable() {
    if (!enabled) {
      promise = load();
      // set debugging to high priority so that it has the opportunity to mess with most things
      hook.before(waitForDebugging, 99);
      enabled = true;
    }
  }
  function disable() {
    hook.getHooks({
      hook: waitForDebugging
    }).remove();
    enabled = false;
  }
  function reset() {
    promise = null;
    disable();
  }
  return {
    enable: enable,
    disable: disable,
    reset: reset
  };
}
var ctl = debuggingControls();
var reset = ctl.reset;
function loadSession() {
  var storage = null;
  try {
    storage = window.sessionStorage;
  } catch (e) {}
  if (storage !== null) {
    var debugging = ctl;
    var _config = null;
    try {
      _config = storage.getItem(DEBUG_KEY);
    } catch (e) {}
    if (_config !== null) {
      // just make sure the module runs; it will take care of parsing the config (and disabling itself if necessary)
      debugging.enable();
    }
  }
}
_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('debugging', function (_ref3) {
  var debugging = _ref3.debugging;
  debugging !== null && debugging !== void 0 && debugging.enabled ? ctl.enable() : ctl.disable();
});

/***/ }),

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "emit": function() { return /* binding */ emit; },
/* harmony export */   "getEvents": function() { return /* binding */ getEvents; },
/* harmony export */   "off": function() { return /* binding */ off; },
/* harmony export */   "on": function() { return /* binding */ on; }
/* harmony export */ });
/* unused harmony exports get, addEvents, clearEvents */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/**
 * events.js
 */


var slice = Array.prototype.slice;
var push = Array.prototype.push;

// define entire events
// var allEvents = ['bidRequested','bidResponse','bidWon','bidTimeout'];
var allEvents = _utils_js__WEBPACK_IMPORTED_MODULE_0__._map(_constants_json__WEBPACK_IMPORTED_MODULE_1__.EVENTS, function (v) {
  return v;
});
var idPaths = _constants_json__WEBPACK_IMPORTED_MODULE_1__.EVENT_ID_PATHS;

// keep a record of all events fired
var eventsFired = [];
var _public = function () {
  var _handlers = {};
  var _public = {};

  /**
   *
   * @param {String} eventString  The name of the event.
   * @param {Array} args  The payload emitted with the event.
   * @private
   */
  function _dispatch(eventString, args) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logMessage('Emitting event for: ' + eventString);
    var eventPayload = args[0] || {};
    var idPath = idPaths[eventString];
    var key = eventPayload[idPath];
    var event = _handlers[eventString] || {
      que: []
    };
    var eventKeys = _utils_js__WEBPACK_IMPORTED_MODULE_0__._map(event, function (v, k) {
      return k;
    });
    var callbacks = [];

    // record the event:
    eventsFired.push({
      eventType: eventString,
      args: eventPayload,
      id: key,
      elapsedTime: _utils_js__WEBPACK_IMPORTED_MODULE_0__.getPerformanceNow()
    });

    /** Push each specific callback to the `callbacks` array.
     * If the `event` map has a key that matches the value of the
     * event payload id path, e.g. `eventPayload[idPath]`, then apply
     * each function in the `que` array as an argument to push to the
     * `callbacks` array
     * */
    if (key && _utils_js__WEBPACK_IMPORTED_MODULE_0__.contains(eventKeys, key)) {
      push.apply(callbacks, event[key].que);
    }

    /** Push each general callback to the `callbacks` array. */
    push.apply(callbacks, event.que);

    /** call each of the callbacks */
    _utils_js__WEBPACK_IMPORTED_MODULE_0__._each(callbacks, function (fn) {
      if (!fn) return;
      try {
        fn.apply(null, args);
      } catch (e) {
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError('Error executing handler:', 'events.js', e);
      }
    });
  }
  function _checkAvailableEvent(event) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.contains(allEvents, event);
  }
  _public.on = function (eventString, handler, id) {
    // check whether available event or not
    if (_checkAvailableEvent(eventString)) {
      var event = _handlers[eventString] || {
        que: []
      };
      if (id) {
        event[id] = event[id] || {
          que: []
        };
        event[id].que.push(handler);
      } else {
        event.que.push(handler);
      }
      _handlers[eventString] = event;
    } else {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError('Wrong event name : ' + eventString + ' Valid event names :' + allEvents);
    }
  };
  _public.emit = function (event) {
    var args = slice.call(arguments, 1);
    _dispatch(event, args);
  };
  _public.off = function (eventString, handler, id) {
    var event = _handlers[eventString];
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event) || _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event.que) && _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id])) {
      return;
    }
    if (id && (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id]) || _utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty(event[id].que))) {
      return;
    }
    if (id) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__._each(event[id].que, function (_handler) {
        var que = event[id].que;
        if (_handler === handler) {
          que.splice(que.indexOf(_handler), 1);
        }
      });
    } else {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__._each(event.que, function (_handler) {
        var que = event.que;
        if (_handler === handler) {
          que.splice(que.indexOf(_handler), 1);
        }
      });
    }
    _handlers[eventString] = event;
  };
  _public.get = function () {
    return _handlers;
  };
  _public.addEvents = function (events) {
    allEvents = allEvents.concat(events);
  };

  /**
   * This method can return a copy of all the events fired
   * @return {Array} array of events fired
   */
  _public.getEvents = function () {
    var arrayCopy = [];
    _utils_js__WEBPACK_IMPORTED_MODULE_0__._each(eventsFired, function (value) {
      var newProp = Object.assign({}, value);
      arrayCopy.push(newProp);
    });
    return arrayCopy;
  };
  return _public;
}();
_utils_js__WEBPACK_IMPORTED_MODULE_0__._setEventEmitter(_public.emit.bind(_public));
var on = _public.on,
  off = _public.off,
  get = _public.get,
  getEvents = _public.getEvents,
  emit = _public.emit,
  addEvents = _public.addEvents;

function clearEvents() {
  eventsFired.length = 0;
}

/***/ }),

/***/ "./src/fpd/enrichment.js":
/*!*******************************!*\
  !*** ./src/fpd/enrichment.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enrichFPD": function() { return /* binding */ enrichFPD; }
/* harmony export */ });
/* unused harmony export dep */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hook.js */ "./src/hook.js");
/* harmony import */ var _refererDetection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../refererDetection.js */ "./src/refererDetection.js");
/* harmony import */ var _rootDomain_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rootDomain.js */ "./src/fpd/rootDomain.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _sua_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sua.js */ "./src/fpd/sua.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _oneClient_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./oneClient.js */ "./src/fpd/oneClient.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }








var dep = {
  getRefererInfo: _refererDetection_js__WEBPACK_IMPORTED_MODULE_0__.getRefererInfo,
  findRootDomain: _rootDomain_js__WEBPACK_IMPORTED_MODULE_1__.findRootDomain,
  getWindowTop: _utils_js__WEBPACK_IMPORTED_MODULE_2__.getWindowTop,
  getWindowSelf: _utils_js__WEBPACK_IMPORTED_MODULE_2__.getWindowSelf,
  getHighEntropySUA: _sua_js__WEBPACK_IMPORTED_MODULE_3__.getHighEntropySUA,
  getLowEntropySUA: _sua_js__WEBPACK_IMPORTED_MODULE_3__.getLowEntropySUA
};
var oneClient = (0,_oneClient_js__WEBPACK_IMPORTED_MODULE_4__.clientSectionChecker)('FPD');

/**
 * Enrich an ortb2 object with first party data.
 * @param {Promise[{}]} fpd: a promise to an ortb2 object.
 * @returns: {Promise[{}]}: a promise to an enriched ortb2 object.
 */
var enrichFPD = (0,_hook_js__WEBPACK_IMPORTED_MODULE_5__.hook)('sync', function (fpd) {
  return _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.GreedyPromise.all([fpd, getSUA().catch(function () {
    return null;
  })]).then(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_ref, 2),
      ortb2 = _ref2[0],
      sua = _ref2[1];
    var ri = dep.getRefererInfo();
    mergeLegacySetConfigs(ortb2);
    Object.entries(ENRICHMENTS).forEach(function (_ref3) {
      var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_ref3, 2),
        section = _ref4[0],
        getEnrichments = _ref4[1];
      var data = getEnrichments(ortb2, ri);
      if (data && Object.keys(data).length > 0) {
        ortb2[section] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeDeep)({}, data, ortb2[section]);
      }
    });
    if (sua) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.dset)(ortb2, 'device.sua', Object.assign({}, sua, ortb2.device.sua));
    }
    ortb2 = oneClient(ortb2);
    var _iterator = _createForOfIteratorHelper(_oneClient_js__WEBPACK_IMPORTED_MODULE_4__.CLIENT_SECTIONS),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var section = _step.value;
        if ((0,_oneClient_js__WEBPACK_IMPORTED_MODULE_4__.hasSection)(ortb2, section)) {
          ortb2[section] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeDeep)({}, clientEnrichment(ortb2, ri), ortb2[section]);
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return ortb2;
  });
});
function mergeLegacySetConfigs(ortb2) {
  // merge in values from "legacy" setConfig({app, site, device})
  // TODO: deprecate these eventually
  ['app', 'site', 'device'].forEach(function (prop) {
    var cfg = _config_js__WEBPACK_IMPORTED_MODULE_9__.config.getConfig(prop);
    if (cfg != null) {
      ortb2[prop] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeDeep)({}, cfg, ortb2[prop]);
    }
  });
}
function winFallback(fn) {
  try {
    return fn(dep.getWindowTop());
  } catch (e) {
    return fn(dep.getWindowSelf());
  }
}
function getSUA() {
  var hints = _config_js__WEBPACK_IMPORTED_MODULE_9__.config.getConfig('firstPartyData.uaHints');
  return !Array.isArray(hints) || hints.length === 0 ? _utils_promise_js__WEBPACK_IMPORTED_MODULE_6__.GreedyPromise.resolve(dep.getLowEntropySUA()) : dep.getHighEntropySUA(hints);
}
function removeUndef(obj) {
  return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getDefinedParams)(obj, Object.keys(obj));
}
var ENRICHMENTS = {
  site: function site(ortb2, ri) {
    if (_oneClient_js__WEBPACK_IMPORTED_MODULE_4__.CLIENT_SECTIONS.filter(function (p) {
      return p !== 'site';
    }).some(_oneClient_js__WEBPACK_IMPORTED_MODULE_4__.hasSection.bind(null, ortb2))) {
      // do not enrich site if dooh or app are set
      return;
    }
    return removeUndef({
      page: ri.page,
      ref: ri.ref
    });
  },
  device: function device() {
    return winFallback(function (win) {
      var w = win.innerWidth || win.document.documentElement.clientWidth || win.document.body.clientWidth;
      var h = win.innerHeight || win.document.documentElement.clientHeight || win.document.body.clientHeight;
      return {
        w: w,
        h: h,
        dnt: (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getDNT)() ? 1 : 0,
        ua: win.navigator.userAgent,
        language: win.navigator.language.split('-').shift()
      };
    });
  },
  regs: function regs() {
    var regs = {};
    if (winFallback(function (win) {
      return win.navigator.globalPrivacyControl;
    })) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.dset)(regs, 'ext.gpc', 1);
    }
    var coppa = _config_js__WEBPACK_IMPORTED_MODULE_9__.config.getConfig('coppa');
    if (typeof coppa === 'boolean') {
      regs.coppa = coppa ? 1 : 0;
    }
    return regs;
  }
};

// Enrichment of properties common across dooh, app and site - will be dropped into whatever
// section is appropriate
function clientEnrichment(ortb2, ri) {
  var _winFallback, _winFallback$content, _winFallback$content$;
  var domain = (0,_refererDetection_js__WEBPACK_IMPORTED_MODULE_0__.parseDomain)(ri.page, {
    noLeadingWww: true
  });
  var keywords = (_winFallback = winFallback(function (win) {
    return win.document.querySelector('meta[name=\'keywords\']');
  })) === null || _winFallback === void 0 ? void 0 : (_winFallback$content = _winFallback.content) === null || _winFallback$content === void 0 ? void 0 : (_winFallback$content$ = _winFallback$content.replace) === null || _winFallback$content$ === void 0 ? void 0 : _winFallback$content$.call(_winFallback$content, /\s/g, '');
  return removeUndef({
    domain: domain,
    keywords: keywords,
    publisher: removeUndef({
      domain: dep.findRootDomain(domain)
    })
  });
}

/***/ }),

/***/ "./src/fpd/oneClient.js":
/*!******************************!*\
  !*** ./src/fpd/oneClient.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CLIENT_SECTIONS": function() { return /* binding */ CLIENT_SECTIONS; },
/* harmony export */   "clientSectionChecker": function() { return /* binding */ clientSectionChecker; },
/* harmony export */   "hasSection": function() { return /* binding */ hasSection; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");


// mutually exclusive ORTB sections in order of priority - 'dooh' beats 'app' & 'site' and 'app' beats 'site';
// if one is set, the others will be removed
var CLIENT_SECTIONS = ['dooh', 'app', 'site'];
function clientSectionChecker(logPrefix) {
  return function onlyOneClientSection(ortb2) {
    CLIENT_SECTIONS.reduce(function (found, section) {
      if (hasSection(ortb2, section)) {
        if (found != null) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)("".concat(logPrefix, " specifies both '").concat(found, "' and '").concat(section, "'; dropping the latter."));
          delete ortb2[section];
        } else {
          found = section;
        }
      }
      return found;
    }, null);
    return ortb2;
  };
}
function hasSection(ortb2, section) {
  return ortb2[section] != null && Object.keys(ortb2[section]).length > 0;
}

/***/ }),

/***/ "./src/fpd/rootDomain.js":
/*!*******************************!*\
  !*** ./src/fpd/rootDomain.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findRootDomain": function() { return /* binding */ findRootDomain; }
/* harmony export */ });
/* unused harmony export coreStorage */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storageManager.js */ "./src/storageManager.js");


var coreStorage = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_0__.getCoreStorageManager)('fpdEnrichment');

/**
 * Find the root domain by testing for the topmost domain that will allow setting cookies.
 */

var findRootDomain = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.memoize)(function findRootDomain() {
  var fullDomain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.host;
  if (!coreStorage.cookiesAreEnabled()) {
    return fullDomain;
  }
  var domainParts = fullDomain.split('.');
  if (domainParts.length === 2) {
    return fullDomain;
  }
  var rootDomain;
  var continueSearching;
  var startIndex = -2;
  var TEST_COOKIE_NAME = "_rdc".concat(Date.now());
  var TEST_COOKIE_VALUE = 'writeable';
  do {
    rootDomain = domainParts.slice(startIndex).join('.');
    var expirationDate = new Date((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.timestamp)() + 10 * 1000).toUTCString();

    // Write a test cookie
    coreStorage.setCookie(TEST_COOKIE_NAME, TEST_COOKIE_VALUE, expirationDate, 'Lax', rootDomain, undefined);

    // See if the write was successful
    var value = coreStorage.getCookie(TEST_COOKIE_NAME, undefined);
    if (value === TEST_COOKIE_VALUE) {
      continueSearching = false;
      // Delete our test cookie
      coreStorage.setCookie(TEST_COOKIE_NAME, '', 'Thu, 01 Jan 1970 00:00:01 GMT', undefined, rootDomain, undefined);
    } else {
      startIndex += -1;
      continueSearching = Math.abs(startIndex) <= domainParts.length;
    }
  } while (continueSearching);
  return rootDomain;
});

/***/ }),

/***/ "./src/fpd/sua.js":
/*!************************!*\
  !*** ./src/fpd/sua.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getHighEntropySUA": function() { return /* binding */ getHighEntropySUA; },
/* harmony export */   "getLowEntropySUA": function() { return /* binding */ getLowEntropySUA; }
/* harmony export */ });
/* unused harmony exports SUA_SOURCE_UNKNOWN, SUA_SOURCE_LOW_ENTROPY, SUA_SOURCE_HIGH_ENTROPY, SUA_SOURCE_UA_HEADER, HIGH_ENTROPY_HINTS, lowEntropySUAAccessor, highEntropySUAAccessor, uaDataToSUA */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/promise.js */ "./src/utils/promise.js");


var SUA_SOURCE_UNKNOWN = 0;
var SUA_SOURCE_LOW_ENTROPY = 1;
var SUA_SOURCE_HIGH_ENTROPY = 2;
var SUA_SOURCE_UA_HEADER = 3;

// "high entropy" (i.e. privacy-sensitive) fields that can be requested from the navigator.
var HIGH_ENTROPY_HINTS = ['architecture', 'bitness', 'model', 'platformVersion', 'fullVersionList'];

/**
 * Returns low entropy UA client hints encoded as an ortb2.6 device.sua object; or null if no UA client hints are available.
 */
var getLowEntropySUA = lowEntropySUAAccessor();

/**
 * Returns a promise to high entropy UA client hints encoded as an ortb2.6 device.sua object, or null if no UA client hints are available.
 *
 * Note that the return value is a promise because the underlying browser API returns a promise; this
 * seems to plan for additional controls (such as alerts / permission request prompts to the user); it's unclear
 * at the moment if this means that asking for more hints would result in slower / more expensive calls.
 *
 * @param {Array[String]} hints hints to request, defaults to all (HIGH_ENTROPY_HINTS).
 */
var getHighEntropySUA = highEntropySUAAccessor();
function lowEntropySUAAccessor() {
  var _window$navigator;
  var uaData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_window$navigator = window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgentData;
  var sua = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(uaData) ? null : Object.freeze(uaDataToSUA(SUA_SOURCE_LOW_ENTROPY, uaData));
  return function () {
    return sua;
  };
}
function highEntropySUAAccessor() {
  var _window$navigator2;
  var uaData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_window$navigator2 = window.navigator) === null || _window$navigator2 === void 0 ? void 0 : _window$navigator2.userAgentData;
  var cache = {};
  var keys = new WeakMap();
  return function () {
    var hints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : HIGH_ENTROPY_HINTS;
    if (!keys.has(hints)) {
      var sorted = Array.from(hints);
      sorted.sort();
      keys.set(hints, sorted.join('|'));
    }
    var key = keys.get(hints);
    if (!cache.hasOwnProperty(key)) {
      try {
        cache[key] = uaData.getHighEntropyValues(hints).then(function (result) {
          return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(result) ? null : Object.freeze(uaDataToSUA(SUA_SOURCE_HIGH_ENTROPY, result));
        }).catch(function () {
          return null;
        });
      } catch (e) {
        cache[key] = _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise.resolve(null);
      }
    }
    return cache[key];
  };
}

/**
 * Convert a User Agent client hints object to an ORTB 2.6 device.sua fragment
 * https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf
 *
 * @param source source of the UAData object (0 to 3)
 * @param uaData https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/
 * @return {{}}
 */
function uaDataToSUA(source, uaData) {
  function toBrandVersion(brand, version) {
    var bv = {
      brand: brand
    };
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr)(version) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmptyStr)(version)) {
      bv.version = version.split('.');
    }
    return bv;
  }
  var sua = {
    source: source
  };
  if (uaData.platform) {
    sua.platform = toBrandVersion(uaData.platform, uaData.platformVersion);
  }
  if (uaData.fullVersionList || uaData.brands) {
    sua.browsers = (uaData.fullVersionList || uaData.brands).map(function (_ref) {
      var brand = _ref.brand,
        version = _ref.version;
      return toBrandVersion(brand, version);
    });
  }
  if (uaData.hasOwnProperty('mobile')) {
    sua.mobile = uaData.mobile ? 1 : 0;
  }
  ['model', 'bitness', 'architecture'].forEach(function (prop) {
    var value = uaData[prop];
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isStr)(value)) {
      sua[prop] = value;
    }
  });
  return sua;
}

/***/ }),

/***/ "./src/hook.js":
/*!*********************!*\
  !*** ./src/hook.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getHook": function() { return /* binding */ getHook; },
/* harmony export */   "hook": function() { return /* binding */ hook; },
/* harmony export */   "module": function() { return /* binding */ module; },
/* harmony export */   "submodule": function() { return /* binding */ submodule; },
/* harmony export */   "wrapHook": function() { return /* binding */ wrapHook; }
/* harmony export */ });
/* unused harmony exports ready, setupBeforeHookFnOnce */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fun-hooks/no-eval/index.js */ "./node_modules/fun-hooks/no-eval/index.js");
/* harmony import */ var fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");



var hook = fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default()({
  ready: (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().SYNC) | (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().ASYNC) | (fun_hooks_no_eval_index_js__WEBPACK_IMPORTED_MODULE_0___default().QUEUE)
});
var readyCtl = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.defer)();
hook.ready = function () {
  var ready = hook.ready;
  return function () {
    try {
      return ready.apply(hook, arguments);
    } finally {
      readyCtl.resolve();
    }
  };
}();

/**
 * A promise that resolves when hooks are ready.
 * @type {Promise}
 */
var ready = readyCtl.promise;
var getHook = hook.get;
function setupBeforeHookFnOnce(baseFn, hookFn) {
  var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 15;
  var result = baseFn.getHooks({
    hook: hookFn
  });
  if (result.length === 0) {
    baseFn.before(hookFn, priority);
  }
}
var submoduleInstallMap = {};
function module(name, install) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref$postInstallAllow = _ref.postInstallAllowed,
    postInstallAllowed = _ref$postInstallAllow === void 0 ? false : _ref$postInstallAllow;
  hook('async', function (submodules) {
    submodules.forEach(function (args) {
      return install.apply(void 0, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__["default"])(args));
    });
    if (postInstallAllowed) submoduleInstallMap[name] = install;
  }, name)([]); // will be queued until hook.ready() called in pbjs.processQueue();
}

function submodule(name) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  var install = submoduleInstallMap[name];
  if (install) return install.apply(void 0, args);
  getHook(name).before(function (next, modules) {
    modules.push(args);
    next(modules);
  });
}

/**
 * Copy hook methods (.before, .after, etc) from a given hook to a given wrapper object.
 */
function wrapHook(hook, wrapper) {
  Object.defineProperties(wrapper, Object.fromEntries(['before', 'after', 'getHooks', 'removeAll'].map(function (m) {
    return [m, {
      get: function get() {
        return hook[m];
      }
    }];
  })));
  return wrapper;
}

/***/ }),

/***/ "./src/mediaTypes.js":
/*!***************************!*\
  !*** ./src/mediaTypes.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ADPOD": function() { return /* binding */ ADPOD; },
/* harmony export */   "BANNER": function() { return /* binding */ BANNER; },
/* harmony export */   "NATIVE": function() { return /* binding */ NATIVE; },
/* harmony export */   "VIDEO": function() { return /* binding */ VIDEO; }
/* harmony export */ });
/**
 * This file contains the valid Media Types in Prebid.
 *
 * All adapters are assumed to support banner ads. Other media types are specified by Adapters when they
 * register themselves with prebid-core.
 */

/**
 * @typedef {('native'|'video'|'banner')} MediaType
 * @typedef {('adpod')} VideoContext
 */

/** @type MediaType */
var NATIVE = 'native';
/** @type MediaType */
var VIDEO = 'video';
/** @type MediaType */
var BANNER = 'banner';
/** @type VideoContext */
var ADPOD = 'adpod';

/***/ }),

/***/ "./src/native.js":
/*!***********************!*\
  !*** ./src/native.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NATIVE_TARGETING_KEYS": function() { return /* binding */ NATIVE_TARGETING_KEYS; },
/* harmony export */   "decorateAdUnitsWithNativeParams": function() { return /* binding */ decorateAdUnitsWithNativeParams; },
/* harmony export */   "fireNativeTrackers": function() { return /* binding */ fireNativeTrackers; },
/* harmony export */   "getAllAssetsMessage": function() { return /* binding */ getAllAssetsMessage; },
/* harmony export */   "getAssetMessage": function() { return /* binding */ getAssetMessage; },
/* harmony export */   "getNativeTargeting": function() { return /* binding */ getNativeTargeting; },
/* harmony export */   "nativeAdapters": function() { return /* binding */ nativeAdapters; },
/* harmony export */   "nativeBidIsValid": function() { return /* binding */ nativeBidIsValid; },
/* harmony export */   "toLegacyResponse": function() { return /* binding */ toLegacyResponse; }
/* harmony export */ });
/* unused harmony exports IMAGE, processNativeAdUnitParams, isOpenRTBBidRequestValid, nativeAdUnit, nativeBidder, hasNonNativeBidder, isNativeOpenRTBBidValid, fireImpressionTrackers, fireClickTrackers, toOrtbNativeRequest, fromOrtbNativeRequest, convertOrtbRequestToProprietaryNative, legacyPropertiesToOrtbNative, toOrtbNativeResponse */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }





var nativeAdapters = [];
var NATIVE_TARGETING_KEYS = Object.keys(_constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS).map(function (key) {
  return _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS[key];
});
var IMAGE = {
  ortb: {
    ver: '1.2',
    assets: [{
      required: 1,
      id: 1,
      img: {
        type: 3,
        wmin: 100,
        hmin: 100
      }
    }, {
      required: 1,
      id: 2,
      title: {
        len: 140
      }
    }, {
      required: 1,
      id: 3,
      data: {
        type: 1
      }
    }, {
      required: 0,
      id: 4,
      data: {
        type: 2
      }
    }, {
      required: 0,
      id: 5,
      img: {
        type: 1,
        wmin: 20,
        hmin: 20
      }
    }]
  },
  image: {
    required: true
  },
  title: {
    required: true
  },
  sponsoredBy: {
    required: true
  },
  clickUrl: {
    required: true
  },
  body: {
    required: false
  },
  icon: {
    required: false
  }
};
var SUPPORTED_TYPES = {
  image: IMAGE
};
var NATIVE_ASSET_TYPES = _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_ASSET_TYPES,
  NATIVE_IMAGE_TYPES = _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_IMAGE_TYPES,
  PREBID_NATIVE_DATA_KEYS_TO_ORTB = _constants_json__WEBPACK_IMPORTED_MODULE_1__.PREBID_NATIVE_DATA_KEYS_TO_ORTB,
  NATIVE_KEYS_THAT_ARE_NOT_ASSETS = _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS_THAT_ARE_NOT_ASSETS,
  NATIVE_KEYS = _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS;

// inverse native maps useful for converting to legacy
var PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE = inverse(PREBID_NATIVE_DATA_KEYS_TO_ORTB);
var NATIVE_ASSET_TYPES_INVERSE = inverse(NATIVE_ASSET_TYPES);
var TRACKER_METHODS = {
  img: 1,
  js: 2,
  1: 'img',
  2: 'js'
};
var TRACKER_EVENTS = {
  impression: 1,
  'viewable-mrc50': 2,
  'viewable-mrc100': 3,
  'viewable-video50': 4
};

/**
 * Recieves nativeParams from an adUnit. If the params were not of type 'type',
 * passes them on directly. If they were of type 'type', translate
 * them into the predefined specific asset requests for that type of native ad.
 */
function processNativeAdUnitParams(params) {
  if (params && params.type && typeIsSupported(params.type)) {
    params = SUPPORTED_TYPES[params.type];
  }
  if (params && params.ortb && !isOpenRTBBidRequestValid(params.ortb)) {
    return;
  }
  return params;
}
function decorateAdUnitsWithNativeParams(adUnits) {
  adUnits.forEach(function (adUnit) {
    var nativeParams = adUnit.nativeParams || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, 'mediaTypes.native');
    if (nativeParams) {
      adUnit.nativeParams = processNativeAdUnitParams(nativeParams);
    }
    if (adUnit.nativeParams) {
      adUnit.nativeOrtbRequest = adUnit.nativeParams.ortb || toOrtbNativeRequest(adUnit.nativeParams);
    }
  });
}
function isOpenRTBBidRequestValid(ortb) {
  var assets = ortb.assets;
  if (!Array.isArray(assets) || assets.length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("assets in mediaTypes.native.ortb is not an array, or it's empty. Assets: ", assets);
    return false;
  }

  // validate that ids exist, that they are unique and that they are numbers
  var ids = assets.map(function (asset) {
    return asset.id;
  });
  if (assets.length !== new Set(ids).size || ids.some(function (id) {
    return id !== parseInt(id, 10);
  })) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("each asset object must have 'id' property, it must be unique and it must be an integer");
    return false;
  }
  if (ortb.hasOwnProperty('eventtrackers') && !Array.isArray(ortb.eventtrackers)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('ortb.eventtrackers is not an array. Eventtrackers: ', ortb.eventtrackers);
    return false;
  }
  return assets.every(function (asset) {
    return isOpenRTBAssetValid(asset);
  });
}
function isOpenRTBAssetValid(asset) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(asset)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("asset must be an object. Provided asset: ", asset);
    return false;
  }
  if (asset.img) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.img.w) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.img.wmin)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("for img asset there must be 'w' or 'wmin' property");
      return false;
    }
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.img.h) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.img.hmin)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("for img asset there must be 'h' or 'hmin' property");
      return false;
    }
  } else if (asset.title) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.title.len)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("for title asset there must be 'len' property defined");
      return false;
    }
  } else if (asset.data) {
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.data.type)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("for data asset 'type' property must be a number");
      return false;
    }
  } else if (asset.video) {
    if (!Array.isArray(asset.video.mimes) || !Array.isArray(asset.video.protocols) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.video.minduration) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isNumber)(asset.video.maxduration)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('video asset is not properly configured');
      return false;
    }
  }
  return true;
}

/**
 * Check if the native type specified in the adUnit is supported by Prebid.
 */
function typeIsSupported(type) {
  if (!(type && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(Object.keys(SUPPORTED_TYPES), type))) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("".concat(type, " nativeParam is not supported"));
    return false;
  }
  return true;
}

/**
 * Helper functions for working with native-enabled adUnits
 * TODO: abstract this and the video helper functions into general
 * adunit validation helper functions
 */
var nativeAdUnit = function nativeAdUnit(adUnit) {
  var mediaType = adUnit.mediaType === 'native';
  var mediaTypes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, 'mediaTypes.native');
  return mediaType || mediaTypes;
};
var nativeBidder = function nativeBidder(bid) {
  return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(nativeAdapters, bid.bidder);
};
var hasNonNativeBidder = function hasNonNativeBidder(adUnit) {
  return adUnit.bids.filter(function (bid) {
    return !nativeBidder(bid);
  }).length;
};

/**
 * Validate that the native assets on this bid contain all assets that were
 * marked as required in the adUnit configuration.
 * @param {Bid} bid Native bid to validate
 * @param {BidRequest[]} bidRequests All bid requests for an auction
 * @return {Boolean} If object is valid
 */
function nativeBidIsValid(bid) {
  var _bid$native;
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$index = _ref.index,
    index = _ref$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.index : _ref$index;
  var adUnit = index.getAdUnit(bid);
  if (!adUnit) {
    return false;
  }
  var ortbRequest = adUnit.nativeOrtbRequest;
  var ortbResponse = ((_bid$native = bid.native) === null || _bid$native === void 0 ? void 0 : _bid$native.ortb) || toOrtbNativeResponse(bid.native, ortbRequest);
  return isNativeOpenRTBBidValid(ortbResponse, ortbRequest);
}
function isNativeOpenRTBBidValid(bidORTB, bidRequestORTB) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bidORTB, 'link.url')) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("native response doesn't have 'link' property. Ortb response: ", bidORTB);
    return false;
  }
  var requiredAssetIds = bidRequestORTB.assets.filter(function (asset) {
    return asset.required === 1;
  }).map(function (a) {
    return a.id;
  });
  var returnedAssetIds = bidORTB.assets.map(function (asset) {
    return asset.id;
  });
  var match = requiredAssetIds.every(function (assetId) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(returnedAssetIds, assetId);
  });
  if (!match) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("didn't receive a bid with all required assets. Required ids: ".concat(requiredAssetIds, ", but received ids in response: ").concat(returnedAssetIds));
  }
  return match;
}

/*
 * Native responses may have associated impression or click trackers.
 * This retrieves the appropriate tracker urls for the given ad object and
 * fires them. As a native creatives may be in a cross-origin frame, it may be
 * necessary to invoke this function via postMessage. secureCreatives is
 * configured to fire this function when it receives a `message` of 'Prebid Native'
 * and an `adId` with the value of the `bid.adId`. When a message is posted with
 * these parameters, impression trackers are fired. To fire click trackers, the
 * message should contain an `action` set to 'click'.
 *
 * // Native creative template example usage
 * <a href="%%CLICK_URL_UNESC%%%%PATTERN:hb_native_linkurl%%"
 *    target="_blank"
 *    onclick="fireTrackers('click')">
 *    %%PATTERN:hb_native_title%%
 * </a>
 *
 * <script>
 *   function fireTrackers(action) {
 *     var message = {message: 'Prebid Native', adId: '%%PATTERN:hb_adid%%'};
 *     if (action === 'click') {message.action = 'click';} // fires click trackers
 *     window.parent.postMessage(JSON.stringify(message), '*');
 *   }
 *   fireTrackers(); // fires impressions when creative is loaded
 * </script>
 */
function fireNativeTrackers(message, bidResponse) {
  var nativeResponse = bidResponse.native.ortb || legacyPropertiesToOrtbNative(bidResponse.native);
  if (message.action === 'click') {
    fireClickTrackers(nativeResponse, message === null || message === void 0 ? void 0 : message.assetId);
  } else {
    fireImpressionTrackers(nativeResponse);
  }
  return message.action;
}
function fireImpressionTrackers(nativeResponse) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref2$runMarkup = _ref2.runMarkup,
    runMarkup = _ref2$runMarkup === void 0 ? function (mkup) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.insertHtmlIntoIframe)(mkup);
    } : _ref2$runMarkup,
    _ref2$fetchURL = _ref2.fetchURL,
    fetchURL = _ref2$fetchURL === void 0 ? _utils_js__WEBPACK_IMPORTED_MODULE_3__.triggerPixel : _ref2$fetchURL;
  var impTrackers = (nativeResponse.eventtrackers || []).filter(function (tracker) {
    return tracker.event === TRACKER_EVENTS.impression;
  });
  var _impTrackers$reduce = impTrackers.reduce(function (tally, tracker) {
      if (TRACKER_METHODS.hasOwnProperty(tracker.method)) {
        tally[TRACKER_METHODS[tracker.method]].push(tracker.url);
      }
      return tally;
    }, {
      img: [],
      js: []
    }),
    img = _impTrackers$reduce.img,
    js = _impTrackers$reduce.js;
  if (nativeResponse.imptrackers) {
    img = img.concat(nativeResponse.imptrackers);
  }
  img.forEach(function (url) {
    return fetchURL(url);
  });
  js = js.map(function (url) {
    return "<script async src=\"".concat(url, "\"></script>");
  });
  if (nativeResponse.jstracker) {
    // jstracker is already HTML markup
    js = js.concat([nativeResponse.jstracker]);
  }
  if (js.length) {
    runMarkup(js.join('\n'));
  }
}
function fireClickTrackers(nativeResponse) {
  var assetId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref3$fetchURL = _ref3.fetchURL,
    fetchURL = _ref3$fetchURL === void 0 ? _utils_js__WEBPACK_IMPORTED_MODULE_3__.triggerPixel : _ref3$fetchURL;
  // legacy click tracker
  if (!assetId) {
    var _nativeResponse$link;
    (((_nativeResponse$link = nativeResponse.link) === null || _nativeResponse$link === void 0 ? void 0 : _nativeResponse$link.clicktrackers) || []).forEach(function (url) {
      return fetchURL(url);
    });
  } else {
    var _nativeResponse$link2;
    // ortb click tracker. This will try to call the clicktracker associated with the asset;
    // will fallback to the link if none is found.
    var assetIdLinkMap = (nativeResponse.assets || []).filter(function (a) {
      return a.link;
    }).reduce(function (map, asset) {
      map[asset.id] = asset.link;
      return map;
    }, {});
    var masterClickTrackers = ((_nativeResponse$link2 = nativeResponse.link) === null || _nativeResponse$link2 === void 0 ? void 0 : _nativeResponse$link2.clicktrackers) || [];
    var assetLink = assetIdLinkMap[assetId];
    var clickTrackers = masterClickTrackers;
    if (assetLink) {
      clickTrackers = assetLink.clicktrackers || [];
    }
    clickTrackers.forEach(function (url) {
      return fetchURL(url);
    });
  }
}

/**
 * Gets native targeting key-value pairs
 * @param {Object} bid
 * @return {Object} targeting
 */
function getNativeTargeting(bid) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref4$index = _ref4.index,
    index = _ref4$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.index : _ref4$index;
  var keyValues = {};
  var adUnit = index.getAdUnit(bid);
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, 'nativeParams.rendererUrl')) {
    bid['native']['rendererUrl'] = getAssetValue(adUnit.nativeParams['rendererUrl']);
  } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, 'nativeParams.adTemplate')) {
    bid['native']['adTemplate'] = getAssetValue(adUnit.nativeParams['adTemplate']);
  }
  var globalSendTargetingKeys = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, "nativeParams.sendTargetingKeys") !== false;
  var nativeKeys = getNativeKeys(adUnit);
  var flatBidNativeKeys = _objectSpread(_objectSpread({}, bid.native), bid.native.ext);
  delete flatBidNativeKeys.ext;
  Object.keys(flatBidNativeKeys).forEach(function (asset) {
    var key = nativeKeys[asset];
    var value = getAssetValue(bid.native[asset]) || getAssetValue((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(bid, "native.ext.".concat(asset)));
    if (asset === 'adTemplate' || !key || !value) {
      return;
    }
    var sendPlaceholder = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, "nativeParams.".concat(asset, ".sendId"));
    if (typeof sendPlaceholder !== 'boolean') {
      sendPlaceholder = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, "nativeParams.ext.".concat(asset, ".sendId"));
    }
    if (sendPlaceholder) {
      var placeholder = "".concat(key, ":").concat(bid.adId);
      value = placeholder;
    }
    var assetSendTargetingKeys = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, "nativeParams.".concat(asset, ".sendTargetingKeys"));
    if (typeof assetSendTargetingKeys !== 'boolean') {
      assetSendTargetingKeys = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, "nativeParams.ext.".concat(asset, ".sendTargetingKeys"));
    }
    var sendTargeting = typeof assetSendTargetingKeys === 'boolean' ? assetSendTargetingKeys : globalSendTargetingKeys;
    if (sendTargeting) {
      keyValues[key] = value;
    }
  });
  return keyValues;
}
function assetsMessage(data, adObject, keys) {
  var _adUnit$mediaTypes, _adUnit$mediaTypes$na;
  var _ref5 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
    _ref5$index = _ref5.index,
    index = _ref5$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.index : _ref5$index;
  var message = {
    message: 'assetResponse',
    adId: data.adId
  };
  var adUnit = index.getAdUnit(adObject);
  var nativeResp = adObject.native;
  if (adObject.native.ortb) {
    message.ortb = adObject.native.ortb;
  } else if ((_adUnit$mediaTypes = adUnit.mediaTypes) !== null && _adUnit$mediaTypes !== void 0 && (_adUnit$mediaTypes$na = _adUnit$mediaTypes.native) !== null && _adUnit$mediaTypes$na !== void 0 && _adUnit$mediaTypes$na.ortb) {
    message.ortb = toOrtbNativeResponse(adObject.native, adUnit.nativeOrtbRequest);
  }
  message.assets = [];
  (keys == null ? Object.keys(nativeResp) : keys).forEach(function (key) {
    if (key === 'adTemplate' && nativeResp[key]) {
      message.adTemplate = getAssetValue(nativeResp[key]);
    } else if (key === 'rendererUrl' && nativeResp[key]) {
      message.rendererUrl = getAssetValue(nativeResp[key]);
    } else if (key === 'ext') {
      Object.keys(nativeResp[key]).forEach(function (extKey) {
        if (nativeResp[key][extKey]) {
          var value = getAssetValue(nativeResp[key][extKey]);
          message.assets.push({
            key: extKey,
            value: value
          });
        }
      });
    } else if (nativeResp[key] && _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS.hasOwnProperty(key)) {
      var value = getAssetValue(nativeResp[key]);
      message.assets.push({
        key: key,
        value: value
      });
    }
  });
  return message;
}

/**
 * Constructs a message object containing asset values for each of the
 * requested data keys.
 */
function getAssetMessage(data, adObject) {
  var keys = data.assets.map(function (k) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getKeyByValue)(_constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS, k);
  });
  return assetsMessage(data, adObject, keys);
}
function getAllAssetsMessage(data, adObject) {
  return assetsMessage(data, adObject, null);
}

/**
 * Native assets can be a string or an object with a url prop. Returns the value
 * appropriate for sending in adserver targeting or placeholder replacement.
 */
function getAssetValue(value) {
  return (value === null || value === void 0 ? void 0 : value.url) || value;
}
function getNativeKeys(adUnit) {
  var extraNativeKeys = {};
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(adUnit, 'nativeParams.ext')) {
    Object.keys(adUnit.nativeParams.ext).forEach(function (extKey) {
      extraNativeKeys[extKey] = "hb_native_".concat(extKey);
    });
  }
  return _objectSpread(_objectSpread({}, _constants_json__WEBPACK_IMPORTED_MODULE_1__.NATIVE_KEYS), extraNativeKeys);
}

/**
 * converts Prebid legacy native assets request to OpenRTB format
 * @param {object} legacyNativeAssets an object that describes a native bid request in Prebid proprietary format
 * @returns an OpenRTB format of the same bid request
 */
function toOrtbNativeRequest(legacyNativeAssets) {
  if (!legacyNativeAssets && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isPlainObject)(legacyNativeAssets)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('Native assets object is empty or not an object: ', legacyNativeAssets);
    return;
  }
  var ortb = {
    ver: '1.2',
    assets: []
  };
  for (var key in legacyNativeAssets) {
    // skip conversion for non-asset keys
    if (NATIVE_KEYS_THAT_ARE_NOT_ASSETS.includes(key)) continue;
    if (!NATIVE_KEYS.hasOwnProperty(key)) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("Unrecognized native asset code: ".concat(key, ". Asset will be ignored."));
      continue;
    }
    var asset = legacyNativeAssets[key];
    var required = 0;
    if (asset.required && (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isBoolean)(asset.required)) {
      required = Number(asset.required);
    }
    var ortbAsset = {
      id: ortb.assets.length,
      required: required
    };
    // data cases
    if (key in PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
      ortbAsset.data = {
        type: NATIVE_ASSET_TYPES[PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]]
      };
      if (asset.len) {
        ortbAsset.data.len = asset.len;
      }
      // icon or image case
    } else if (key === 'icon' || key === 'image') {
      ortbAsset.img = {
        type: key === 'icon' ? NATIVE_IMAGE_TYPES.ICON : NATIVE_IMAGE_TYPES.MAIN
      };
      // if min_width and min_height are defined in aspect_ratio, they are preferred
      if (asset.aspect_ratios) {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(asset.aspect_ratios)) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("image.aspect_ratios was passed, but it's not a an array:", asset.aspect_ratios);
        } else if (!asset.aspect_ratios.length) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)("image.aspect_ratios was passed, but it's empty:", asset.aspect_ratios);
        } else {
          var _asset$aspect_ratios$ = asset.aspect_ratios[0],
            minWidth = _asset$aspect_ratios$.min_width,
            minHeight = _asset$aspect_ratios$.min_height;
          if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isInteger)(minWidth) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isInteger)(minHeight)) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('image.aspect_ratios min_width or min_height are invalid: ', minWidth, minHeight);
          } else {
            ortbAsset.img.wmin = minWidth;
            ortbAsset.img.hmin = minHeight;
          }
          var aspectRatios = asset.aspect_ratios.filter(function (ar) {
            return ar.ratio_width && ar.ratio_height;
          }).map(function (ratio) {
            return "".concat(ratio.ratio_width, ":").concat(ratio.ratio_height);
          });
          if (aspectRatios.length > 0) {
            ortbAsset.img.ext = {
              aspectratios: aspectRatios
            };
          }
        }
      }

      // if asset.sizes exist, by OpenRTB spec we should remove wmin and hmin
      if (asset.sizes) {
        if (asset.sizes.length !== 2 || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isInteger)(asset.sizes[0]) || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isInteger)(asset.sizes[1])) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.logError)('image.sizes was passed, but its value is not an array of integers:', asset.sizes);
        } else {
          ortbAsset.img.w = asset.sizes[0];
          ortbAsset.img.h = asset.sizes[1];
          delete ortbAsset.img.hmin;
          delete ortbAsset.img.wmin;
        }
      }
      // title case
    } else if (key === 'title') {
      ortbAsset.title = {
        // in openRTB, len is required for titles, while in legacy prebid was not.
        // for this reason, if len is missing in legacy prebid, we're adding a default value of 140.
        len: asset.len || 140
      };
      // all extensions to the native bid request are passed as is
    } else if (key === 'ext') {
      ortbAsset.ext = asset;
      // in `ext` case, required field is not needed
      delete ortbAsset.required;
    }
    ortb.assets.push(ortbAsset);
  }
  return ortb;
}

/**
 * Greatest common divisor between two positive integers
 * https://en.wikipedia.org/wiki/Euclidean_algorithm
 */
function gcd(a, b) {
  while (a && b && a !== b) {
    if (a > b) {
      a = a - b;
    } else {
      b = b - a;
    }
  }
  return a || b;
}

/**
 * This function converts an OpenRTB native request object to Prebid proprietary
 * format. The purpose of this function is to help adapters to handle the
 * transition phase where publishers may be using OpenRTB objects but the
 *  bidder does not yet support it.
 * @param {object} openRTBRequest an OpenRTB v1.2 request object
 * @returns a Prebid legacy native format request
 */
function fromOrtbNativeRequest(openRTBRequest) {
  if (!isOpenRTBBidRequestValid(openRTBRequest)) {
    return;
  }
  var oldNativeObject = {};
  var _iterator = _createForOfIteratorHelper(openRTBRequest.assets),
    _step;
  try {
    var _loop = function _loop() {
      var asset = _step.value;
      if (asset.title) {
        var title = {
          required: asset.required ? Boolean(asset.required) : false,
          len: asset.title.len
        };
        oldNativeObject.title = title;
      } else if (asset.img) {
        var image = {
          required: asset.required ? Boolean(asset.required) : false
        };
        if (asset.img.w && asset.img.h) {
          image.sizes = [asset.img.w, asset.img.h];
        } else if (asset.img.wmin && asset.img.hmin) {
          var scale = gcd(asset.img.wmin, asset.img.hmin);
          image.aspect_ratios = [{
            min_width: asset.img.wmin,
            min_height: asset.img.hmin,
            ratio_width: asset.img.wmin / scale,
            ratio_height: asset.img.hmin / scale
          }];
        }
        if (asset.img.type === NATIVE_IMAGE_TYPES.MAIN) {
          oldNativeObject.image = image;
        } else {
          oldNativeObject.icon = image;
        }
      } else if (asset.data) {
        var assetType = Object.keys(NATIVE_ASSET_TYPES).find(function (k) {
          return NATIVE_ASSET_TYPES[k] === asset.data.type;
        });
        var prebidAssetName = Object.keys(PREBID_NATIVE_DATA_KEYS_TO_ORTB).find(function (k) {
          return PREBID_NATIVE_DATA_KEYS_TO_ORTB[k] === assetType;
        });
        oldNativeObject[prebidAssetName] = {
          required: asset.required ? Boolean(asset.required) : false
        };
        if (asset.data.len) {
          oldNativeObject[prebidAssetName].len = asset.data.len;
        }
      }
      // video was not supported by old prebid assets
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return oldNativeObject;
}

/**
 * Converts an OpenRTB request to a proprietary Prebid.js format.
 * The proprietary Prebid format has many limitations and will be dropped in
 * the future; adapters are encouraged to stop using it in favour of OpenRTB format.
 * IMPLEMENTATION DETAILS: This function returns the same exact object if no
 * conversion is needed. If a conversion is needed (meaning, at least one
 * bidRequest contains a native.ortb definition), it will return a copy.
 *
 * @param {BidRequest[]} bidRequests an array of valid bid requests
 * @returns an array of valid bid requests where the openRTB bids are converted to proprietary format.
 */
function convertOrtbRequestToProprietaryNative(bidRequests) {
  if (true) {
    if (!bidRequests || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(bidRequests)) return bidRequests;
    // check if a conversion is needed
    if (!bidRequests.some(function (bidRequest) {
      var _NATIVE;
      return (_NATIVE = ((bidRequest === null || bidRequest === void 0 ? void 0 : bidRequest.mediaTypes) || {})[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE]) === null || _NATIVE === void 0 ? void 0 : _NATIVE.ortb;
    })) {
      return bidRequests;
    }
    var bidRequestsCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.deepClone)(bidRequests);
    // convert Native ORTB definition to old-style prebid native definition
    var _iterator2 = _createForOfIteratorHelper(bidRequestsCopy),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var bidRequest = _step2.value;
        if (bidRequest.mediaTypes && bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE] && bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE].ortb) {
          bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE] = Object.assign((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.pick)(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE], NATIVE_KEYS_THAT_ARE_NOT_ASSETS), fromOrtbNativeRequest(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE].ortb));
          bidRequest.nativeParams = processNativeAdUnitParams(bidRequest.mediaTypes[_mediaTypes_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE]);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return bidRequestsCopy;
  }
  return bidRequests;
}

/**
 * convert PBJS proprietary native properties that are *not* assets to the ORTB native format.
 *
 * @param legacyNative `bidResponse.native` object as returned by adapters
 */
function legacyPropertiesToOrtbNative(legacyNative) {
  var response = {
    link: {},
    eventtrackers: []
  };
  Object.entries(legacyNative).forEach(function (_ref6) {
    var _ref7 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__["default"])(_ref6, 2),
      key = _ref7[0],
      value = _ref7[1];
    switch (key) {
      case 'clickUrl':
        response.link.url = value;
        break;
      case 'clickTrackers':
        response.link.clicktrackers = Array.isArray(value) ? value : [value];
        break;
      case 'impressionTrackers':
        (Array.isArray(value) ? value : [value]).forEach(function (url) {
          response.eventtrackers.push({
            event: TRACKER_EVENTS.impression,
            method: TRACKER_METHODS.img,
            url: url
          });
        });
        break;
      case 'javascriptTrackers':
        // jstracker is deprecated, but we need to use it here since 'javascriptTrackers' is markup, not an url
        // TODO: at the time of writing this, core expected javascriptTrackers to be a string (despite the name),
        // but many adapters are passing an array. It's possible that some of them are, in fact, passing URLs and not markup
        // in general, native trackers seem to be neglected and/or broken
        response.jstracker = Array.isArray(value) ? value.join('') : value;
        break;
    }
  });
  return response;
}
function toOrtbNativeResponse(legacyResponse, ortbRequest) {
  var ortbResponse = _objectSpread(_objectSpread({}, legacyPropertiesToOrtbNative(legacyResponse)), {}, {
    assets: []
  });
  function useRequestAsset(predicate, fn) {
    var asset = ortbRequest.assets.find(predicate);
    if (asset != null) {
      asset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.deepClone)(asset);
      fn(asset);
      ortbResponse.assets.push(asset);
    }
  }
  Object.keys(legacyResponse).filter(function (key) {
    return !!legacyResponse[key];
  }).forEach(function (key) {
    var value = getAssetValue(legacyResponse[key]);
    switch (key) {
      // process titles
      case 'title':
        useRequestAsset(function (asset) {
          return asset.title != null;
        }, function (titleAsset) {
          titleAsset.title = {
            text: value
          };
        });
        break;
      case 'image':
      case 'icon':
        var imageType = key === 'image' ? NATIVE_IMAGE_TYPES.MAIN : NATIVE_IMAGE_TYPES.ICON;
        useRequestAsset(function (asset) {
          return asset.img != null && asset.img.type === imageType;
        }, function (imageAsset) {
          imageAsset.img = {
            url: value
          };
        });
        break;
      default:
        if (key in PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
          useRequestAsset(function (asset) {
            return asset.data != null && asset.data.type === NATIVE_ASSET_TYPES[PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]];
          }, function (dataAsset) {
            dataAsset.data = {
              value: value
            };
          });
        }
        break;
    }
  });
  return ortbResponse;
}

/**
 * Generates a legacy response from an ortb response. Useful during the transition period.
 * @param {*} ortbResponse a standard ortb response object
 * @param {*} ortbRequest the ortb request, useful to match ids.
 * @returns an object containing the response in legacy native format: { title: "this is a title", image: ... }
 */
function toLegacyResponse(ortbResponse, ortbRequest) {
  var legacyResponse = {};
  var requestAssets = (ortbRequest === null || ortbRequest === void 0 ? void 0 : ortbRequest.assets) || [];
  legacyResponse.clickUrl = ortbResponse.link.url;
  legacyResponse.privacyLink = ortbResponse.privacy;
  var _iterator3 = _createForOfIteratorHelper((ortbResponse === null || ortbResponse === void 0 ? void 0 : ortbResponse.assets) || []),
    _step3;
  try {
    var _loop2 = function _loop2() {
      var asset = _step3.value;
      var requestAsset = requestAssets.find(function (reqAsset) {
        return asset.id === reqAsset.id;
      });
      if (asset.title) {
        legacyResponse.title = asset.title.text;
      } else if (asset.img) {
        legacyResponse[requestAsset.img.type === NATIVE_IMAGE_TYPES.MAIN ? 'image' : 'icon'] = {
          url: asset.img.url,
          width: asset.img.w,
          height: asset.img.h
        };
      } else if (asset.data) {
        legacyResponse[PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE[NATIVE_ASSET_TYPES_INVERSE[requestAsset.data.type]]] = asset.data.value;
      }
    };
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _loop2();
    }

    // Handle trackers
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  legacyResponse.impressionTrackers = [];
  var jsTrackers = [];
  if (ortbRequest !== null && ortbRequest !== void 0 && ortbRequest.imptrackers) {
    var _legacyResponse$impre;
    (_legacyResponse$impre = legacyResponse.impressionTrackers).push.apply(_legacyResponse$impre, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__["default"])(ortbRequest.imptrackers));
  }
  var _iterator4 = _createForOfIteratorHelper((ortbResponse === null || ortbResponse === void 0 ? void 0 : ortbResponse.eventtrackers) || []),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var eventTracker = _step4.value;
      if (eventTracker.event === TRACKER_EVENTS.impression && eventTracker.method === TRACKER_METHODS.img) {
        legacyResponse.impressionTrackers.push(eventTracker.url);
      }
      if (eventTracker.event === TRACKER_EVENTS.impression && eventTracker.method === TRACKER_METHODS.js) {
        jsTrackers.push(eventTracker.url);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  jsTrackers = jsTrackers.map(function (url) {
    return "<script async src=\"".concat(url, "\"></script>");
  });
  if (ortbResponse !== null && ortbResponse !== void 0 && ortbResponse.jstracker) {
    jsTrackers.push(ortbResponse.jstracker);
  }
  if (jsTrackers.length) {
    legacyResponse.javascriptTrackers = jsTrackers.join('\n');
  }
  return legacyResponse;
}

/**
 * Inverts key-values of an object.
 */
function inverse(obj) {
  var retobj = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}

/***/ }),

/***/ "./src/polyfill.js":
/*!*************************!*\
  !*** ./src/polyfill.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayFrom": function() { return /* binding */ arrayFrom; },
/* harmony export */   "find": function() { return /* binding */ find; },
/* harmony export */   "includes": function() { return /* binding */ includes; }
/* harmony export */ });
/* unused harmony export findIndex */
// These stubs are here to help transition away from core-js polyfills for browsers we are no longer supporting.
// You should not need these for new code; use stock JS instead!

function includes(target, elem, start) {
  return target && target.includes(elem, start) || false;
}
function arrayFrom() {
  return Array.from.apply(Array, arguments);
}
function find(arr, pred, thisArg) {
  return arr && arr.find(pred, thisArg);
}
function findIndex(arr, pred, thisArg) {
  return arr && arr.findIndex(pred, thisArg);
}

/***/ }),

/***/ "./src/prebidGlobal.js":
/*!*****************************!*\
  !*** ./src/prebidGlobal.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobal": function() { return /* binding */ getGlobal; },
/* harmony export */   "registerModule": function() { return /* binding */ registerModule; }
/* harmony export */ });
// if $$PREBID_GLOBAL$$ already exists in global document scope, use it, if not, create the object
// global defination should happen BEFORE imports to avoid global undefined errors.
/* global $$DEFINE_PREBID_GLOBAL$$ */
var scope =  false ? 0 : window;
var global = scope.pbjs = scope.pbjs || {};
global.cmd = global.cmd || [];
global.que = global.que || [];

// create a pbjs global pointer
if (scope === window) {
  scope._pbjsGlobals = scope._pbjsGlobals || [];
  scope._pbjsGlobals.push("pbjs");
}
function getGlobal() {
  return global;
}
function registerModule(name) {
  global.installedModules.push(name);
}

/***/ }),

/***/ "./src/refererDetection.js":
/*!*********************************!*\
  !*** ./src/refererDetection.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRefererInfo": function() { return /* binding */ getRefererInfo; },
/* harmony export */   "parseDomain": function() { return /* binding */ parseDomain; }
/* harmony export */ });
/* unused harmony exports ensureProtocol, detectReferer, cacheWithLocation */
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/**
 * The referer detection module attempts to gather referer information from the current page that prebid.js resides in.
 * The information that it tries to collect includes:
 * The detected top url in the nav bar,
 * Whether it was able to reach the top most window (if for example it was embedded in several iframes),
 * The number of iframes it was embedded in if applicable (by default max ten iframes),
 * A list of the domains of each embedded window if applicable.
 * Canonical URL which refers to an HTML link element, with the attribute of rel="canonical", found in the <head> element of your webpage
 */




/**
 * Prepend a URL with the page's protocol (http/https), if necessary.
 */
function ensureProtocol(url) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  if (!url) return url;
  if (/\w+:\/\//.exec(url)) {
    // url already has protocol
    return url;
  }
  var windowProto = win.location.protocol;
  try {
    windowProto = win.top.location.protocol;
  } catch (e) {}
  if (/^\/\//.exec(url)) {
    // url uses relative protocol ("//example.com")
    return windowProto + url;
  } else {
    return "".concat(windowProto, "//").concat(url);
  }
}

/**
 * Extract the domain portion from a URL.
 * @param url
 * @param noLeadingWww: if true, remove 'www.' appearing at the beginning of the domain.
 * @param noPort: if true, do not include the ':[port]' portion
 */
function parseDomain(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$noLeadingWww = _ref.noLeadingWww,
    noLeadingWww = _ref$noLeadingWww === void 0 ? false : _ref$noLeadingWww,
    _ref$noPort = _ref.noPort,
    noPort = _ref$noPort === void 0 ? false : _ref$noPort;
  try {
    url = new URL(ensureProtocol(url));
  } catch (e) {
    return;
  }
  url = noPort ? url.hostname : url.host;
  if (noLeadingWww && url.startsWith('www.')) {
    url = url.substring(4);
  }
  return url;
}

/**
 * This function returns canonical URL which refers to an HTML link element, with the attribute of rel="canonical", found in the <head> element of your webpage
 *
 * @param {Object} doc document
 * @returns {string|null}
 */
function getCanonicalUrl(doc) {
  try {
    var element = doc.querySelector("link[rel='canonical']");
    if (element !== null) {
      return element.href;
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

/**
 * @param {Window} win Window
 * @returns {Function}
 */
function detectReferer(win) {
  /**
   * This function would return a read-only array of hostnames for all the parent frames.
   * win.location.ancestorOrigins is only supported in webkit browsers. For non-webkit browsers it will return undefined.
   *
   * @param {Window} win Window object
   * @returns {(undefined|Array)} Ancestor origins or undefined
   */
  function getAncestorOrigins(win) {
    try {
      if (!win.location.ancestorOrigins) {
        return;
      }
      return win.location.ancestorOrigins;
    } catch (e) {
      // Ignore error
    }
  }

  // TODO: the meaning of "reachedTop" seems to be intentionally ambiguous - best to leave them out of
  // the typedef for now. (for example, unit tests enforce that "reachedTop" should be false in some situations where we
  // happily provide a location for the top).

  /**
   * @typedef {Object} refererInfo
   * @property {string|null} location the browser's location, or null if not available (due to cross-origin restrictions)
   * @property {string|null} canonicalUrl the site's canonical URL as set by the publisher, through setConfig({pageUrl}) or <link rel="canonical" />
   * @property {string|null} page the best candidate for the current page URL: `canonicalUrl`, falling back to `location`
   * @property {string|null} domain the domain portion of `page`
   * @property {string|null} ref the referrer (document.referrer) to the current page, or null if not available (due to cross-origin restrictions)
   * @property {string} topmostLocation of the top-most frame for which we could guess the location. Outside of cross-origin scenarios, this is equivalent to `location`.
   * @property {number} numIframes number of steps between window.self and window.top
   * @property {Array[string|null]} stack our best guess at the location for each frame, in the direction top -> self.
   */

  /**
   * Walk up the windows to get the origin stack and best available referrer, canonical URL, etc.
   *
   * @returns {refererInfo}
   */
  function refererInfo() {
    var stack = [];
    var ancestors = getAncestorOrigins(win);
    var maxNestedIframes = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('maxNestedIframes');
    var currentWindow;
    var bestLocation;
    var bestCanonicalUrl;
    var reachedTop = false;
    var level = 0;
    var valuesFromAmp = false;
    var inAmpFrame = false;
    var hasTopLocation = false;
    do {
      var previousWindow = currentWindow;
      var wasInAmpFrame = inAmpFrame;
      var currentLocation = void 0;
      var crossOrigin = false;
      var foundLocation = null;
      inAmpFrame = false;
      currentWindow = currentWindow ? currentWindow.parent : win;
      try {
        currentLocation = currentWindow.location.href || null;
      } catch (e) {
        crossOrigin = true;
      }
      if (crossOrigin) {
        if (wasInAmpFrame) {
          var context = previousWindow.context;
          try {
            foundLocation = context.sourceUrl;
            bestLocation = foundLocation;
            hasTopLocation = true;
            valuesFromAmp = true;
            if (currentWindow === win.top) {
              reachedTop = true;
            }
            if (context.canonicalUrl) {
              bestCanonicalUrl = context.canonicalUrl;
            }
          } catch (e) {/* Do nothing */}
        } else {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Trying to access cross domain iframe. Continuing without referrer and location');
          try {
            // the referrer to an iframe is the parent window
            var referrer = previousWindow.document.referrer;
            if (referrer) {
              foundLocation = referrer;
              if (currentWindow === win.top) {
                reachedTop = true;
              }
            }
          } catch (e) {/* Do nothing */}
          if (!foundLocation && ancestors && ancestors[level - 1]) {
            foundLocation = ancestors[level - 1];
            if (currentWindow === win.top) {
              hasTopLocation = true;
            }
          }
          if (foundLocation && !valuesFromAmp) {
            bestLocation = foundLocation;
          }
        }
      } else {
        if (currentLocation) {
          foundLocation = currentLocation;
          bestLocation = foundLocation;
          valuesFromAmp = false;
          if (currentWindow === win.top) {
            reachedTop = true;
            var _canonicalUrl = getCanonicalUrl(currentWindow.document);
            if (_canonicalUrl) {
              bestCanonicalUrl = _canonicalUrl;
            }
          }
        }
        if (currentWindow.context && currentWindow.context.sourceUrl) {
          inAmpFrame = true;
        }
      }
      stack.push(foundLocation);
      level++;
    } while (currentWindow !== win.top && level < maxNestedIframes);
    stack.reverse();
    var ref;
    try {
      ref = win.top.document.referrer;
    } catch (e) {}
    var location = reachedTop || hasTopLocation ? bestLocation : null;
    var canonicalUrl = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('pageUrl') || bestCanonicalUrl || null;
    var page = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('pageUrl') || location || ensureProtocol(canonicalUrl, win);
    if (location && location.indexOf('?') > -1 && page.indexOf('?') === -1) {
      page = "".concat(page).concat(location.substring(location.indexOf('?')));
    }
    return {
      reachedTop: reachedTop,
      isAmp: valuesFromAmp,
      numIframes: level - 1,
      stack: stack,
      topmostLocation: bestLocation || null,
      location: location,
      canonicalUrl: canonicalUrl,
      page: page,
      domain: parseDomain(page) || null,
      ref: ref || null,
      // TODO: the "legacy" refererInfo object is provided here, for now, to accomodate
      // adapters that decided to just send it verbatim to their backend.
      legacy: {
        reachedTop: reachedTop,
        isAmp: valuesFromAmp,
        numIframes: level - 1,
        stack: stack,
        referer: bestLocation || null,
        canonicalUrl: canonicalUrl
      }
    };
  }
  return refererInfo;
}

// cache result of fn (= referer info) as long as:
// - we are the top window
// - canonical URL tag and window location have not changed
function cacheWithLocation(fn) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  if (win.top !== win) return fn;
  var canonical, href, value;
  return function () {
    var newCanonical = getCanonicalUrl(win.document);
    var newHref = win.location.href;
    if (canonical !== newCanonical || newHref !== href) {
      canonical = newCanonical;
      href = newHref;
      value = fn();
    }
    return value;
  };
}

/**
 * @type {function(): refererInfo}
 */
var getRefererInfo = cacheWithLocation(detectReferer(window));

/***/ }),

/***/ "./src/secureCreatives.js":
/*!********************************!*\
  !*** ./src/secureCreatives.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "listenMessagesFromCreative": function() { return /* binding */ listenMessagesFromCreative; }
/* harmony export */ });
/* unused harmony exports getReplier, receiveMessage, _sendAdToCreative */
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");
/* Secure Creatives
  Provides support for rendering creatives into cross domain iframes such as SafeFrame to prevent
   access to a publisher page from creative payloads.
 */










var BID_WON = _constants_json__WEBPACK_IMPORTED_MODULE_0__.EVENTS.BID_WON;
var STALE_RENDER = _constants_json__WEBPACK_IMPORTED_MODULE_0__.EVENTS.STALE_RENDER;
var WON_AD_IDS = new WeakSet();
var HANDLER_MAP = {
  'Prebid Request': handleRenderRequest,
  'Prebid Event': handleEventRequest
};
if (true) {
  Object.assign(HANDLER_MAP, {
    'Prebid Native': handleNativeRequest
  });
}
function listenMessagesFromCreative() {
  window.addEventListener('message', receiveMessage, false);
}
function getReplier(ev) {
  if (ev.origin == null && ev.ports.length === 0) {
    return function () {
      var msg = 'Cannot post message to a frame with null origin. Please update creatives to use MessageChannel, see https://github.com/prebid/Prebid.js/issues/7870';
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(msg);
      throw new Error(msg);
    };
  } else if (ev.ports.length > 0) {
    return function (message) {
      ev.ports[0].postMessage(JSON.stringify(message));
    };
  } else {
    return function (message) {
      ev.source.postMessage(JSON.stringify(message), ev.origin);
    };
  }
}
function receiveMessage(ev) {
  var key = ev.message ? 'message' : 'data';
  var data = {};
  try {
    data = JSON.parse(ev[key]);
  } catch (e) {
    return;
  }
  if (data && data.adId && data.message) {
    var adObject = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.find)(_auctionManager_js__WEBPACK_IMPORTED_MODULE_3__.auctionManager.getBidsReceived(), function (bid) {
      return bid.adId === data.adId;
    });
    if (HANDLER_MAP.hasOwnProperty(data.message)) {
      HANDLER_MAP[data.message](getReplier(ev), data, adObject);
    }
  }
}
function handleRenderRequest(reply, data, adObject) {
  if (adObject == null) {
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_4__.emitAdRenderFail)({
      reason: _constants_json__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.CANNOT_FIND_AD,
      message: "Cannot find ad for cross-origin render request: '".concat(data.adId, "'"),
      id: data.adId
    });
    return;
  }
  if (adObject.status === _constants_json__WEBPACK_IMPORTED_MODULE_0__.BID_STATUS.RENDERED) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Ad id ".concat(adObject.adId, " has been rendered before"));
    _events_js__WEBPACK_IMPORTED_MODULE_5__.emit(STALE_RENDER, adObject);
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config_js__WEBPACK_IMPORTED_MODULE_7__.config.getConfig('auctionOptions'), 'suppressStaleRender')) {
      return;
    }
  }
  try {
    _sendAdToCreative(adObject, reply);
  } catch (e) {
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_4__.emitAdRenderFail)({
      reason: _constants_json__WEBPACK_IMPORTED_MODULE_0__.AD_RENDER_FAILED_REASON.EXCEPTION,
      message: e.message,
      id: data.adId,
      bid: adObject
    });
    return;
  }

  // save winning bids
  _auctionManager_js__WEBPACK_IMPORTED_MODULE_3__.auctionManager.addWinningBid(adObject);
  _events_js__WEBPACK_IMPORTED_MODULE_5__.emit(BID_WON, adObject);
}
function handleNativeRequest(reply, data, adObject) {
  // handle this script from native template in an ad server
  // window.parent.postMessage(JSON.stringify({
  //   message: 'Prebid Native',
  //   adId: '%%PATTERN:hb_adid%%'
  // }), '*');
  if (adObject == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)("Cannot find ad for x-origin event request: '".concat(data.adId, "'"));
    return;
  }
  if (!WON_AD_IDS.has(adObject)) {
    WON_AD_IDS.add(adObject);
    _auctionManager_js__WEBPACK_IMPORTED_MODULE_3__.auctionManager.addWinningBid(adObject);
    _events_js__WEBPACK_IMPORTED_MODULE_5__.emit(BID_WON, adObject);
  }
  switch (data.action) {
    case 'assetRequest':
      reply((0,_native_js__WEBPACK_IMPORTED_MODULE_8__.getAssetMessage)(data, adObject));
      break;
    case 'allAssetRequest':
      reply((0,_native_js__WEBPACK_IMPORTED_MODULE_8__.getAllAssetsMessage)(data, adObject));
      break;
    case 'resizeNativeHeight':
      adObject.height = data.height;
      adObject.width = data.width;
      resizeRemoteCreative(adObject);
      break;
    default:
      (0,_native_js__WEBPACK_IMPORTED_MODULE_8__.fireNativeTrackers)(data, adObject);
  }
}
function handleEventRequest(reply, data, adObject) {
  if (adObject == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)("Cannot find ad '".concat(data.adId, "' for x-origin event request"));
    return;
  }
  if (adObject.status !== _constants_json__WEBPACK_IMPORTED_MODULE_0__.BID_STATUS.RENDERED) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Received x-origin event request without corresponding render request for ad '".concat(data.adId, "'"));
    return;
  }
  switch (data.event) {
    case _constants_json__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_FAILED:
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_4__.emitAdRenderFail)({
        bid: adObject,
        id: data.adId,
        reason: data.info.reason,
        message: data.info.message
      });
      break;
    case _constants_json__WEBPACK_IMPORTED_MODULE_0__.EVENTS.AD_RENDER_SUCCEEDED:
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_4__.emitAdRenderSucceeded)({
        doc: null,
        bid: adObject,
        id: data.adId
      });
      break;
    default:
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)("Received x-origin event request for unsupported event: '".concat(data.event, "' (adId: '").concat(data.adId, "')"));
  }
}
function _sendAdToCreative(adObject, reply) {
  var adId = adObject.adId,
    ad = adObject.ad,
    adUrl = adObject.adUrl,
    width = adObject.width,
    height = adObject.height,
    renderer = adObject.renderer,
    cpm = adObject.cpm,
    originalCpm = adObject.originalCpm;
  // rendering for outstream safeframe
  if ((0,_Renderer_js__WEBPACK_IMPORTED_MODULE_9__.isRendererRequired)(renderer)) {
    (0,_Renderer_js__WEBPACK_IMPORTED_MODULE_9__.executeRenderer)(renderer, adObject);
  } else if (adId) {
    resizeRemoteCreative(adObject);
    reply({
      message: 'Prebid Response',
      ad: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.replaceAuctionPrice)(ad, originalCpm || cpm),
      adUrl: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.replaceAuctionPrice)(adUrl, originalCpm || cpm),
      adId: adId,
      width: width,
      height: height
    });
  }
}
function resizeRemoteCreative(_ref) {
  var adId = _ref.adId,
    adUnitCode = _ref.adUnitCode,
    width = _ref.width,
    height = _ref.height;
  // resize both container div + iframe
  ['div', 'iframe'].forEach(function (elmType) {
    // not select element that gets removed after dfp render
    var element = getElementByAdUnit(elmType + ':not([style*="display: none"])');
    if (element) {
      var elementStyle = element.style;
      elementStyle.width = width ? width + 'px' : '100%';
      elementStyle.height = height + 'px';
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Unable to locate matching page element for adUnitCode ".concat(adUnitCode, ".  Can't resize it to ad's dimensions.  Please review setup."));
    }
  });
  function getElementByAdUnit(elmType) {
    var id = getElementIdBasedOnAdServer(adId, adUnitCode);
    var parentDivEle = document.getElementById(id);
    return parentDivEle && parentDivEle.querySelector(elmType);
  }
  function getElementIdBasedOnAdServer(adId, adUnitCode) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isGptPubadsDefined)()) {
      return getDfpElementId(adId);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isApnGetTagDefined)()) {
      return getAstElementId(adUnitCode);
    } else {
      return adUnitCode;
    }
  }
  function getDfpElementId(adId) {
    var slot = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.find)(window.googletag.pubads().getSlots(), function (slot) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.find)(slot.getTargetingKeys(), function (key) {
        return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_2__.includes)(slot.getTargeting(key), adId);
      });
    });
    return slot ? slot.getSlotElementId() : null;
  }
  function getAstElementId(adUnitCode) {
    var astTag = window.apntag.getTag(adUnitCode);
    return astTag && astTag.targetId;
  }
}

/***/ }),

/***/ "./src/sizeMapping.js":
/*!****************************!*\
  !*** ./src/sizeMapping.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processAdUnitsForLabels": function() { return /* binding */ processAdUnitsForLabels; }
/* harmony export */ });
/* unused harmony exports setSizeConfig, getLabels, sizeSupported, resolveStatus */
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");





var sizeConfig = [];

/**
 * @typedef {object} SizeConfig
 *
 * @property {string} [mediaQuery] A CSS media query string that will to be interpreted by window.matchMedia.  If the
 *  media query matches then the this config will be active and sizesSupported will filter bid and adUnit sizes.  If
 *  this property is not present then this SizeConfig will only be active if triggered manually by a call to
 *  pbjs.setConfig({labels:['label']) specifying one of the labels present on this SizeConfig.
 * @property {Array<Array>} sizesSupported The sizes to be accepted if this SizeConfig is enabled.
 * @property {Array<string>} labels The active labels to match this SizeConfig to an adUnits and/or bidders.
 */

/**
 *
 * @param {Array<SizeConfig>} config
 */
function setSizeConfig(config) {
  sizeConfig = config;
}
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('sizeConfig', function (config) {
  return setSizeConfig(config.sizeConfig);
});

/**
 * Returns object describing the status of labels on the adUnit or bidder along with labels passed into requestBids
 * @param bidOrAdUnit the bidder or adUnit to get label info on
 * @param activeLabels the labels passed to requestBids
 * @returns {LabelDescriptor}
 */
function getLabels(bidOrAdUnit, activeLabels) {
  if (bidOrAdUnit.labelAll) {
    return {
      labelAll: true,
      labels: bidOrAdUnit.labelAll,
      activeLabels: activeLabels
    };
  }
  return {
    labelAll: false,
    labels: bidOrAdUnit.labelAny,
    activeLabels: activeLabels
  };
}

/**
 * Determines whether a single size is valid given configured sizes
 * @param {Array} size [width, height]
 * @param {Array<SizeConfig>} configs
 * @returns {boolean}
 */
function sizeSupported(size) {
  var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sizeConfig;
  var maps = evaluateSizeConfig(configs);
  if (!maps.shouldFilter) {
    return true;
  }
  return !!maps.sizesSupported[size];
}

/**
 * Resolves the unique set of the union of all sizes and labels that are active from a SizeConfig.mediaQuery match
 * @param {Array<string>} labels Labels specified on adUnit or bidder
 * @param {boolean} labelAll if true, all labels must match to be enabled
 * @param {Array<string>} activeLabels Labels passed in through requestBids
 * @param {object} mediaTypes A mediaTypes object describing the various media types (banner, video, native)
 * @param {Array<Array<number>>} sizes Sizes specified on adUnit (deprecated)
 * @param {Array<SizeConfig>} configs
 * @returns {{labels: Array<string>, sizes: Array<Array<number>>}}
 */
function resolveStatus() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$labels = _ref.labels,
    labels = _ref$labels === void 0 ? [] : _ref$labels,
    _ref$labelAll = _ref.labelAll,
    labelAll = _ref$labelAll === void 0 ? false : _ref$labelAll,
    _ref$activeLabels = _ref.activeLabels,
    activeLabels = _ref$activeLabels === void 0 ? [] : _ref$activeLabels;
  var mediaTypes = arguments.length > 1 ? arguments[1] : undefined;
  var sizes = arguments.length > 2 ? arguments[2] : undefined;
  var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : sizeConfig;
  var maps = evaluateSizeConfig(configs);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(mediaTypes)) {
    // add support for deprecated adUnit.sizes by creating correct banner mediaTypes if they don't already exist
    if (sizes) {
      mediaTypes = {
        banner: {
          sizes: sizes
        }
      };
    } else {
      mediaTypes = {};
    }
  }
  var oldSizes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mediaTypes, 'banner.sizes');
  if (maps.shouldFilter && oldSizes) {
    mediaTypes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(mediaTypes);
    mediaTypes.banner.sizes = oldSizes.filter(function (size) {
      return maps.sizesSupported[size];
    });
  }
  var results = {
    active: !mediaTypes.hasOwnProperty(_mediaTypes_js__WEBPACK_IMPORTED_MODULE_3__.BANNER) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mediaTypes, 'banner.sizes.length') > 0 && (labels.length === 0 || !labelAll && (labels.some(function (label) {
      return maps.labels[label];
    }) || labels.some(function (label) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(activeLabels, label);
    })) || labelAll && labels.reduce(function (result, label) {
      return !result ? result : maps.labels[label] || (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_4__.includes)(activeLabels, label);
    }, true)),
    mediaTypes: mediaTypes
  };
  if (oldSizes && oldSizes.length !== mediaTypes.banner.sizes.length) {
    results.filterResults = {
      before: oldSizes,
      after: mediaTypes.banner.sizes
    };
  }
  return results;
}
function evaluateSizeConfig(configs) {
  return configs.reduce(function (results, config) {
    if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_5__["default"])(config) === 'object' && typeof config.mediaQuery === 'string' && config.mediaQuery.length > 0) {
      var ruleMatch = false;
      try {
        ruleMatch = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getWindowTop)().matchMedia(config.mediaQuery).matches;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('Unfriendly iFrame blocks sizeConfig from being correctly evaluated');
        ruleMatch = matchMedia(config.mediaQuery).matches;
      }
      if (ruleMatch) {
        if (Array.isArray(config.sizesSupported)) {
          results.shouldFilter = true;
        }
        ['labels', 'sizesSupported'].forEach(function (type) {
          return (config[type] || []).forEach(function (thing) {
            return results[type][thing] = true;
          });
        });
      }
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)('sizeConfig rule missing required property "mediaQuery"');
    }
    return results;
  }, {
    labels: {},
    sizesSupported: {},
    shouldFilter: false
  });
}
function processAdUnitsForLabels(adUnits, activeLabels) {
  return adUnits.reduce(function (adUnits, adUnit) {
    var _resolveStatus = resolveStatus(getLabels(adUnit, activeLabels), adUnit.mediaTypes, adUnit.sizes),
      active = _resolveStatus.active,
      mediaTypes = _resolveStatus.mediaTypes,
      filterResults = _resolveStatus.filterResults;
    if (!active) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Size mapping disabled adUnit \"".concat(adUnit.code, "\""));
    } else {
      if (filterResults) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Size mapping filtered adUnit \"".concat(adUnit.code, "\" banner sizes from "), filterResults.before, 'to ', filterResults.after);
      }
      adUnit.mediaTypes = mediaTypes;
      adUnit.bids = adUnit.bids.reduce(function (bids, bid) {
        var _resolveStatus2 = resolveStatus(getLabels(bid, activeLabels), adUnit.mediaTypes),
          active = _resolveStatus2.active,
          mediaTypes = _resolveStatus2.mediaTypes,
          filterResults = _resolveStatus2.filterResults;
        if (!active) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Size mapping deactivated adUnit \"".concat(adUnit.code, "\" bidder \"").concat(bid.bidder, "\""));
        } else {
          if (filterResults) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Size mapping filtered adUnit \"".concat(adUnit.code, "\" bidder \"").concat(bid.bidder, "\" banner sizes from "), filterResults.before, 'to ', filterResults.after);
            bid.mediaTypes = mediaTypes;
          }
          bids.push(bid);
        }
        return bids;
      }, []);
      adUnits.push(adUnit);
    }
    return adUnits;
  }, []);
}

/***/ }),

/***/ "./src/storageManager.js":
/*!*******************************!*\
  !*** ./src/storageManager.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCoreStorageManager": function() { return /* binding */ getCoreStorageManager; },
/* harmony export */   "getStorageManager": function() { return /* binding */ getStorageManager; },
/* harmony export */   "storageCallbacks": function() { return /* binding */ storageCallbacks; }
/* harmony export */ });
/* unused harmony exports STORAGE_TYPE_LOCALSTORAGE, STORAGE_TYPE_COOKIES, newStorageManager, deviceAccessRule, storageAllowedRule, resetData */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");










var STORAGE_TYPE_LOCALSTORAGE = 'html5';
var STORAGE_TYPE_COOKIES = 'cookie';
var storageCallbacks = [];

/*
 *  Storage manager constructor. Consumers should prefer one of `getStorageManager` or `getCoreStorageManager`.
 */
function newStorageManager() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    moduleName = _ref.moduleName,
    moduleType = _ref.moduleType;
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref2$isAllowed = _ref2.isAllowed,
    isAllowed = _ref2$isAllowed === void 0 ? _activities_rules_js__WEBPACK_IMPORTED_MODULE_0__.isActivityAllowed : _ref2$isAllowed;
  function isValid(cb, storageType) {
    var mod = moduleName;
    var curBidder = _config_js__WEBPACK_IMPORTED_MODULE_1__.config.getCurrentBidder();
    if (curBidder && moduleType === _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER && _adapterManager_js__WEBPACK_IMPORTED_MODULE_3__["default"].aliasRegistry[curBidder] === moduleName) {
      mod = curBidder;
    }
    var result = {
      valid: isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_ACCESS_DEVICE, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_5__.activityParams)(moduleType, mod, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])({}, _activities_params_js__WEBPACK_IMPORTED_MODULE_7__.ACTIVITY_PARAM_STORAGE_TYPE, storageType)))
    };
    return cb(result);
  }
  function schedule(operation, storageType, done) {
    if (done && typeof done === 'function') {
      storageCallbacks.push(function () {
        var result = isValid(operation, storageType);
        done(result);
      });
    } else {
      return isValid(operation, storageType);
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {string} [expires='']
   * @param {string} [sameSite='/']
   * @param {string} [domain] domain (e.g., 'example.com' or 'subdomain.example.com').
   * If not specified, defaults to the host portion of the current document location.
   * If a domain is specified, subdomains are always included.
   * Domain must match the domain of the JavaScript origin. Setting cookies to foreign domains will be silently ignored.
   */
  var setCookie = function setCookie(key, value, expires, sameSite, domain, done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        var domainPortion = domain && domain !== '' ? " ;domain=".concat(encodeURIComponent(domain)) : '';
        var expiresPortion = expires && expires !== '' ? " ;expires=".concat(expires) : '';
        var isNone = sameSite != null && sameSite.toLowerCase() == 'none';
        var secure = isNone ? '; Secure' : '';
        document.cookie = "".concat(key, "=").concat(encodeURIComponent(value)).concat(expiresPortion, "; path=/").concat(domainPortion).concat(sameSite ? "; SameSite=".concat(sameSite) : '').concat(secure);
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };

  /**
   * @param {string} name
   * @returns {(string|null)}
   */
  var getCookie = function getCookie(name, done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        var m = window.document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]*)\\s*(;|$)');
        return m ? decodeURIComponent(m[2]) : null;
      }
      return null;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };

  /**
   * @returns {boolean}
   */
  var localStorageIsEnabled = function localStorageIsEnabled(done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        try {
          localStorage.setItem('prebid.cookieTest', '1');
          return localStorage.getItem('prebid.cookieTest') === '1';
        } catch (error) {} finally {
          try {
            localStorage.removeItem('prebid.cookieTest');
          } catch (error) {}
        }
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };

  /**
   * @returns {boolean}
   */
  var cookiesAreEnabled = function cookiesAreEnabled(done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.checkCookieSupport)();
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };

  /**
   * @param {string} key
   * @param {string} value
   */
  var setDataInLocalStorage = function setDataInLocalStorage(key, value, done) {
    var cb = function cb(result) {
      if (result && result.valid && hasLocalStorage()) {
        window.localStorage.setItem(key, value);
      }
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };

  /**
   * @param {string} key
   * @returns {(string|null)}
   */
  var getDataFromLocalStorage = function getDataFromLocalStorage(key, done) {
    var cb = function cb(result) {
      if (result && result.valid && hasLocalStorage()) {
        return window.localStorage.getItem(key);
      }
      return null;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };

  /**
   * @param {string} key
   */
  var removeDataFromLocalStorage = function removeDataFromLocalStorage(key, done) {
    var cb = function cb(result) {
      if (result && result.valid && hasLocalStorage()) {
        window.localStorage.removeItem(key);
      }
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };

  /**
   * @returns {boolean}
   */
  var hasLocalStorage = function hasLocalStorage(done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        try {
          return !!window.localStorage;
        } catch (e) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.logError)('Local storage api disabled');
        }
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };

  /**
   * Returns all cookie values from the jar whose names contain the `keyLike`
   * Needs to exist in `utils.js` as it follows the StorageHandler interface defined in live-connect-js. If that module were to be removed, this function can go as well.
   * @param {string} keyLike
   * @return {[]}
   */
  var findSimilarCookies = function findSimilarCookies(keyLike, done) {
    var cb = function cb(result) {
      if (result && result.valid) {
        var all = [];
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.hasDeviceAccess)()) {
          var cookies = document.cookie.split(';');
          while (cookies.length) {
            var cookie = cookies.pop();
            var separatorIndex = cookie.indexOf('=');
            separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;
            var cookieName = decodeURIComponent(cookie.slice(0, separatorIndex).replace(/^\s+/, ''));
            if (cookieName.indexOf(keyLike) >= 0) {
              all.push(decodeURIComponent(cookie.slice(separatorIndex + 1)));
            }
          }
        }
        return all;
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };
  return {
    setCookie: setCookie,
    getCookie: getCookie,
    localStorageIsEnabled: localStorageIsEnabled,
    cookiesAreEnabled: cookiesAreEnabled,
    setDataInLocalStorage: setDataInLocalStorage,
    getDataFromLocalStorage: getDataFromLocalStorage,
    removeDataFromLocalStorage: removeDataFromLocalStorage,
    hasLocalStorage: hasLocalStorage,
    findSimilarCookies: findSimilarCookies
  };
}

/**
 * Get a storage manager for a particular module.
 *
 * Either bidderCode or a combination of moduleType + moduleName must be provided. The former is a shorthand
 *  for `{moduleType: 'bidder', moduleName: bidderCode}`.
 *
 */
function getStorageManager() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    moduleType = _ref3.moduleType,
    moduleName = _ref3.moduleName,
    bidderCode = _ref3.bidderCode;
  function err() {
    throw new Error("Invalid invocation for getStorageManager: must set either bidderCode, or moduleType + moduleName");
  }
  if (bidderCode) {
    if (moduleType && moduleType !== _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER || moduleName) err();
    moduleType = _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER;
    moduleName = bidderCode;
  } else if (!moduleName || !moduleType) {
    err();
  }
  return newStorageManager({
    moduleType: moduleType,
    moduleName: moduleName
  });
}

/**
 * Get a storage manager for "core" (vendorless, or first-party) modules. Shorthand for `getStorageManager({moduleName, moduleType: 'core'})`.
 *
 * @param {string} moduleName Module name
 */
function getCoreStorageManager(moduleName) {
  return newStorageManager({
    moduleName: moduleName,
    moduleType: _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_PREBID
  });
}

/**
 * Block all access to storage when deviceAccess = false
 */
function deviceAccessRule() {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_8__.hasDeviceAccess)()) {
    return {
      allow: false
    };
  }
}
(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_0__.registerActivityControl)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_ACCESS_DEVICE, 'deviceAccess config', deviceAccessRule);

/**
 * By default, deny bidders accessDevice unless they enable it through bidderSettings
 *
 * // TODO: for backwards compat, the check is done on the adapter - rather than bidder's code.
 */
function storageAllowedRule(params) {
  var bs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bidderSettings_js__WEBPACK_IMPORTED_MODULE_9__.bidderSettings;
  if (params[_activities_params_js__WEBPACK_IMPORTED_MODULE_7__.ACTIVITY_PARAM_COMPONENT_TYPE] !== _activities_modules_js__WEBPACK_IMPORTED_MODULE_2__.MODULE_TYPE_BIDDER) return;
  var allow = bs.get(params[_activities_params_js__WEBPACK_IMPORTED_MODULE_7__.ACTIVITY_PARAM_ADAPTER_CODE], 'storageAllowed');
  if (!allow || allow === true) {
    allow = !!allow;
  } else {
    var storageType = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_7__.ACTIVITY_PARAM_STORAGE_TYPE];
    allow = Array.isArray(allow) ? allow.some(function (e) {
      return e === storageType;
    }) : allow === storageType;
  }
  if (!allow) {
    return {
      allow: allow
    };
  }
}
(0,_activities_rules_js__WEBPACK_IMPORTED_MODULE_0__.registerActivityControl)(_activities_activities_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_ACCESS_DEVICE, 'bidderSettings.*.storageAllowed', storageAllowedRule);
function resetData() {
  storageCallbacks = [];
}

/***/ }),

/***/ "./src/targeting.js":
/*!**************************!*\
  !*** ./src/targeting.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBidUsable": function() { return /* binding */ isBidUsable; },
/* harmony export */   "targeting": function() { return /* binding */ targeting; }
/* harmony export */ });
/* unused harmony exports TARGETING_KEYS, filters, getHighestCpmBidsFromBidPool, sortByDealAndPriceBucketOrCpm, newTargeting */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./native.js */ "./src/native.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");











var pbTargetingKeys = [];
var MAX_DFP_KEYLENGTH = 20;
var DEFAULT_TTL_BUFFER = 1;
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('ttlBuffer', function (cfg) {
  if (typeof cfg.ttlBuffer === 'number') {
    DEFAULT_TTL_BUFFER = cfg.ttlBuffer;
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Invalid value for ttlBuffer', cfg.ttlBuffer);
  }
});
var CFG_ALLOW_TARGETING_KEYS = "targetingControls.allowTargetingKeys";
var CFG_ADD_TARGETING_KEYS = "targetingControls.addTargetingKeys";
var TARGETING_KEY_CONFIGURATION_ERROR_MSG = "Only one of \"".concat(CFG_ALLOW_TARGETING_KEYS, "\" or \"").concat(CFG_ADD_TARGETING_KEYS, "\" can be set");
var TARGETING_KEYS = Object.keys(_constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS).map(function (key) {
  return _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS[key];
});

// return unexpired bids
var isBidNotExpired = function isBidNotExpired(bid) {
  return bid.responseTimestamp + (bid.ttl - (bid.hasOwnProperty('ttlBuffer') ? bid.ttlBuffer : DEFAULT_TTL_BUFFER)) * 1000 > (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.timestamp)();
};

// return bids whose status is not set. Winning bids can only have a status of `rendered`.
var isUnusedBid = function isUnusedBid(bid) {
  return bid && (bid.status && !(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)([_constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.RENDERED], bid.status) || !bid.status);
};
var filters = {
  isActualBid: function isActualBid(bid) {
    return bid.getStatusCode() === _constants_json__WEBPACK_IMPORTED_MODULE_2__.STATUS.GOOD;
  },
  isBidNotExpired: isBidNotExpired,
  isUnusedBid: isUnusedBid
};
function isBidUsable(bid) {
  return !Object.values(filters).some(function (predicate) {
    return !predicate(bid);
  });
}

// If two bids are found for same adUnitCode, we will use the highest one to take part in auction
// This can happen in case of concurrent auctions
// If adUnitBidLimit is set above 0 return top N number of bids
var getHighestCpmBidsFromBidPool = (0,_hook_js__WEBPACK_IMPORTED_MODULE_4__.hook)('sync', function (bidsReceived, highestCpmCallback) {
  var adUnitBidLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var hasModified = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!hasModified) {
    var bids = [];
    var dealPrioritization = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('sendBidsControl.dealPrioritization');
    // bucket by adUnitcode
    var buckets = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.groupBy)(bidsReceived, 'adUnitCode');
    // filter top bid for each bucket by bidder
    Object.keys(buckets).forEach(function (bucketKey) {
      var bucketBids = [];
      var bidsByBidder = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.groupBy)(buckets[bucketKey], 'bidderCode');
      Object.keys(bidsByBidder).forEach(function (key) {
        return bucketBids.push(bidsByBidder[key].reduce(highestCpmCallback));
      });
      // if adUnitBidLimit is set, pass top N number bids
      if (adUnitBidLimit > 0) {
        bucketBids = dealPrioritization ? bucketBids.sort(sortByDealAndPriceBucketOrCpm(true)) : bucketBids.sort(function (a, b) {
          return b.cpm - a.cpm;
        });
        bids.push.apply(bids, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_5__["default"])(bucketBids.slice(0, adUnitBidLimit)));
      } else {
        bids.push.apply(bids, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_5__["default"])(bucketBids));
      }
    });
    return bids;
  }
  return bidsReceived;
});

/**
* A descending sort function that will sort the list of objects based on the following two dimensions:
*  - bids with a deal are sorted before bids w/o a deal
*  - then sort bids in each grouping based on the hb_pb value
* eg: the following list of bids would be sorted like:
*  [{
*    "hb_adid": "vwx",
*    "hb_pb": "28",
*    "hb_deal": "7747"
*  }, {
*    "hb_adid": "jkl",
*    "hb_pb": "10",
*    "hb_deal": "9234"
*  }, {
*    "hb_adid": "stu",
*    "hb_pb": "50"
*  }, {
*    "hb_adid": "def",
*    "hb_pb": "2"
*  }]
*/
function sortByDealAndPriceBucketOrCpm() {
  var useCpm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (a, b) {
    if (a.adserverTargeting.hb_deal !== undefined && b.adserverTargeting.hb_deal === undefined) {
      return -1;
    }
    if (a.adserverTargeting.hb_deal === undefined && b.adserverTargeting.hb_deal !== undefined) {
      return 1;
    }

    // assuming both values either have a deal or don't have a deal - sort by the hb_pb param
    if (useCpm) {
      return b.cpm - a.cpm;
    }
    return b.adserverTargeting.hb_pb - a.adserverTargeting.hb_pb;
  };
}

/**
 * @typedef {Object.<string,string>} targeting
 * @property {string} targeting_key
 */

/**
 * @typedef {Object.<string,Object.<string,string[]>[]>[]} targetingArray
 */

function newTargeting(auctionManager) {
  var targeting = {};
  var latestAuctionForAdUnit = {};
  targeting.setLatestAuctionForAdUnit = function (adUnitCode, auctionId) {
    latestAuctionForAdUnit[adUnitCode] = auctionId;
  };
  targeting.resetPresetTargeting = function (adUnitCode, customSlotMatching) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isGptPubadsDefined)()) {
      var adUnitCodes = getAdUnitCodes(adUnitCode);
      var adUnits = auctionManager.getAdUnits().filter(function (adUnit) {
        return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(adUnitCodes, adUnit.code);
      });
      var unsetKeys = pbTargetingKeys.reduce(function (reducer, key) {
        reducer[key] = null;
        return reducer;
      }, {});
      window.googletag.pubads().getSlots().forEach(function (slot) {
        var customSlotMatchingFunc = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFn)(customSlotMatching) && customSlotMatching(slot);
        // reset only registered adunits
        adUnits.forEach(function (unit) {
          if (unit.code === slot.getAdUnitPath() || unit.code === slot.getSlotElementId() || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFn)(customSlotMatchingFunc) && customSlotMatchingFunc(unit.code)) {
            slot.updateTargetingFromMap(unsetKeys);
          }
        });
      });
    }
  };
  targeting.resetPresetTargetingAST = function (adUnitCode) {
    var adUnitCodes = getAdUnitCodes(adUnitCode);
    adUnitCodes.forEach(function (unit) {
      var astTag = window.apntag.getTag(unit);
      if (astTag && astTag.keywords) {
        var currentKeywords = Object.keys(astTag.keywords);
        var newKeywords = {};
        currentKeywords.forEach(function (key) {
          if (!(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(pbTargetingKeys, key.toLowerCase())) {
            newKeywords[key] = astTag.keywords[key];
          }
        });
        window.apntag.modifyTag(unit, {
          keywords: newKeywords
        });
      }
    });
  };

  /**
   * checks if bid has targeting set and belongs based on matching ad unit codes
   * @return {boolean} true or false
   */
  function bidShouldBeAddedToTargeting(bid, adUnitCodes) {
    return bid.adserverTargeting && adUnitCodes && ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(adUnitCodes) && (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(adUnitCodes, bid.adUnitCode) || typeof adUnitCodes === 'string' && bid.adUnitCode === adUnitCodes);
  }
  ;

  /**
   * Returns targeting for any bids which have deals if alwaysIncludeDeals === true
   */
  function getDealBids(adUnitCodes, bidsReceived) {
    if (_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('targetingControls.alwaysIncludeDeals') === true) {
      var standardKeys =  true ? TARGETING_KEYS.concat(_native_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE_TARGETING_KEYS) : 0;

      // we only want the top bid from bidders who have multiple entries per ad unit code
      var bids = getHighestCpmBidsFromBidPool(bidsReceived, _utils_js__WEBPACK_IMPORTED_MODULE_1__.getHighestCpm);

      // populate targeting keys for the remaining bids if they have a dealId
      return bids.map(function (bid) {
        if (bid.dealId && bidShouldBeAddedToTargeting(bid, adUnitCodes)) {
          return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, bid.adUnitCode, getTargetingMap(bid, standardKeys.filter(function (key) {
            return typeof bid.adserverTargeting[key] !== 'undefined';
          })));
        }
      }).filter(function (bid) {
        return bid;
      }); // removes empty elements in array
    }

    return [];
  }
  ;

  /**
   * Returns filtered ad server targeting for custom and allowed keys.
   * @param {targetingArray} targeting
   * @param {string[]} allowedKeys
   * @return {targetingArray} filtered targeting
   */
  function getAllowedTargetingKeyValues(targeting, allowedKeys) {
    var defaultKeyring = Object.assign({}, _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS, _constants_json__WEBPACK_IMPORTED_MODULE_2__.NATIVE_KEYS);
    var defaultKeys = Object.keys(defaultKeyring);
    var keyDispositions = {};
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("allowTargetingKeys - allowed keys [ ".concat(allowedKeys.map(function (k) {
      return defaultKeyring[k];
    }).join(', '), " ]"));
    targeting.map(function (adUnit) {
      var adUnitCode = Object.keys(adUnit)[0];
      var keyring = adUnit[adUnitCode];
      var keys = keyring.filter(function (kvPair) {
        var key = Object.keys(kvPair)[0];
        // check if key is in default keys, if not, it's custom, we won't remove it.
        var isCustom = defaultKeys.filter(function (defaultKey) {
          return key.indexOf(defaultKeyring[defaultKey]) === 0;
        }).length === 0;
        // check if key explicitly allowed, if not, we'll remove it.
        var found = isCustom || (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.find)(allowedKeys, function (allowedKey) {
          var allowedKeyName = defaultKeyring[allowedKey];
          // we're looking to see if the key exactly starts with one of our default keys.
          // (which hopefully means it's not custom)
          var found = key.indexOf(allowedKeyName) === 0;
          return found;
        });
        keyDispositions[key] = !found;
        return found;
      });
      adUnit[adUnitCode] = keys;
    });
    var removedKeys = Object.keys(keyDispositions).filter(function (d) {
      return keyDispositions[d];
    });
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("allowTargetingKeys - removed keys [ ".concat(removedKeys.join(', '), " ]"));
    // remove any empty targeting objects, as they're unnecessary.
    var filteredTargeting = targeting.filter(function (adUnit) {
      var adUnitCode = Object.keys(adUnit)[0];
      var keyring = adUnit[adUnitCode];
      return keyring.length > 0;
    });
    return filteredTargeting;
  }

  /**
   * Returns all ad server targeting for all ad units.
   * @param {string=} adUnitCode
   * @return {Object.<string,targeting>} targeting
   */
  targeting.getAllTargeting = function (adUnitCode) {
    var bidsReceived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBidsReceived();
    var adUnitCodes = getAdUnitCodes(adUnitCode);

    // Get targeting for the winning bid. Add targeting for any bids that have
    // `alwaysUseBid=true`. If sending all bids is enabled, add targeting for losing bids.
    var targeting = getWinningBidTargeting(adUnitCodes, bidsReceived).concat(getCustomBidTargeting(adUnitCodes, bidsReceived)).concat(_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('enableSendAllBids') ? getBidLandscapeTargeting(adUnitCodes, bidsReceived) : getDealBids(adUnitCodes, bidsReceived)).concat(getAdUnitTargeting(adUnitCodes));

    // store a reference of the targeting keys
    targeting.map(function (adUnitCode) {
      Object.keys(adUnitCode).map(function (key) {
        adUnitCode[key].map(function (targetKey) {
          if (pbTargetingKeys.indexOf(Object.keys(targetKey)[0]) === -1) {
            pbTargetingKeys = Object.keys(targetKey).concat(pbTargetingKeys);
          }
        });
      });
    });
    var defaultKeys = Object.keys(Object.assign({}, _constants_json__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_TARGETING_KEYS, _constants_json__WEBPACK_IMPORTED_MODULE_2__.NATIVE_KEYS));
    var allowedKeys = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(CFG_ALLOW_TARGETING_KEYS);
    var addedKeys = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig(CFG_ADD_TARGETING_KEYS);
    if (addedKeys != null && allowedKeys != null) {
      throw new Error(TARGETING_KEY_CONFIGURATION_ERROR_MSG);
    } else if (addedKeys != null) {
      allowedKeys = defaultKeys.concat(addedKeys);
    } else {
      allowedKeys = allowedKeys || defaultKeys;
    }
    if (Array.isArray(allowedKeys) && allowedKeys.length > 0) {
      targeting = getAllowedTargetingKeyValues(targeting, allowedKeys);
    }
    targeting = flattenTargeting(targeting);
    var auctionKeysThreshold = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('targetingControls.auctionKeyMaxChars');
    if (auctionKeysThreshold) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("Detected 'targetingControls.auctionKeyMaxChars' was active for this auction; set with a limit of ".concat(auctionKeysThreshold, " characters.  Running checks on auction keys..."));
      targeting = filterTargetingKeys(targeting, auctionKeysThreshold);
    }

    // make sure at least there is a entry per adUnit code in the targetingSet so receivers of SET_TARGETING call's can know what ad units are being invoked
    adUnitCodes.forEach(function (code) {
      if (!targeting[code]) {
        targeting[code] = {};
      }
    });
    return targeting;
  };

  // warn about conflicting configuration
  _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('targetingControls', function (config) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_8__["default"])(config, CFG_ALLOW_TARGETING_KEYS) != null && (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__["default"])(config, CFG_ADD_TARGETING_KEYS) != null) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)(TARGETING_KEY_CONFIGURATION_ERROR_MSG);
    }
  });

  // create an encoded string variant based on the keypairs of the provided object
  //  - note this will encode the characters between the keys (ie = and &)
  function convertKeysToQueryForm(keyMap) {
    return Object.keys(keyMap).reduce(function (queryString, key) {
      var encodedKeyPair = "".concat(key, "%3d").concat(encodeURIComponent(keyMap[key]), "%26");
      return queryString += encodedKeyPair;
    }, '');
  }
  function filterTargetingKeys(targeting, auctionKeysThreshold) {
    // read each targeting.adUnit object and sort the adUnits into a list of adUnitCodes based on priorization setting (eg CPM)
    var targetingCopy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(targeting);
    var targetingMap = Object.keys(targetingCopy).map(function (adUnitCode) {
      return {
        adUnitCode: adUnitCode,
        adserverTargeting: targetingCopy[adUnitCode]
      };
    }).sort(sortByDealAndPriceBucketOrCpm());

    // iterate through the targeting based on above list and transform the keys into the query-equivalent and count characters
    return targetingMap.reduce(function (accMap, currMap, index, arr) {
      var adUnitQueryString = convertKeysToQueryForm(currMap.adserverTargeting);

      // for the last adUnit - trim last encoded ampersand from the converted query string
      if (index + 1 === arr.length) {
        adUnitQueryString = adUnitQueryString.slice(0, -3);
      }

      // if under running threshold add to result
      var code = currMap.adUnitCode;
      var querySize = adUnitQueryString.length;
      if (querySize <= auctionKeysThreshold) {
        auctionKeysThreshold -= querySize;
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logInfo)("AdUnit '".concat(code, "' auction keys comprised of ").concat(querySize, " characters.  Deducted from running threshold; new limit is ").concat(auctionKeysThreshold), targetingCopy[code]);
        accMap[code] = targetingCopy[code];
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("The following keys for adUnitCode '".concat(code, "' exceeded the current limit of the 'auctionKeyMaxChars' setting.\nThe key-set size was ").concat(querySize, ", the current allotted amount was ").concat(auctionKeysThreshold, ".\n"), targetingCopy[code]);
      }
      if (index + 1 === arr.length && Object.keys(accMap).length === 0) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('No auction targeting keys were permitted due to the setting in setConfig(targetingControls.auctionKeyMaxChars).  Please review setup and consider adjusting.');
      }
      return accMap;
    }, {});
  }

  /**
   * Converts targeting array and flattens to make it easily iteratable
   * e.g: Sample input to this function
   * ```
   * [
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder": ["appnexusAst"]}]
   *    },
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder_appnexusAs": ["appnexusAst", "other"]}]
   *    }
   * ]
   * ```
   * Resulting array
   * ```
   * {
   *  "div-gpt-ad-1460505748561-0": {
   *    "hb_bidder": "appnexusAst",
   *    "hb_bidder_appnexusAs": "appnexusAst,other"
   *  }
   * }
   * ```
   *
   * @param {targetingArray}  targeting
   * @return {Object.<string,targeting>}  targeting
   */
  function flattenTargeting(targeting) {
    var targetingObj = targeting.map(function (targeting) {
      return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, Object.keys(targeting)[0], targeting[Object.keys(targeting)[0]].map(function (target) {
        return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, Object.keys(target)[0], target[Object.keys(target)[0]].join(','));
      }).reduce(function (p, c) {
        return Object.assign(c, p);
      }, {}));
    }).reduce(function (accumulator, targeting) {
      var key = Object.keys(targeting)[0];
      accumulator[key] = Object.assign({}, accumulator[key], targeting[key]);
      return accumulator;
    }, {});
    return targetingObj;
  }

  /**
   * Sets targeting for DFP
   * @param {Object.<string,Object.<string,string>>} targetingConfig
   */
  targeting.setTargetingForGPT = function (targetingConfig, customSlotMatching) {
    window.googletag.pubads().getSlots().forEach(function (slot) {
      Object.keys(targetingConfig).filter(customSlotMatching ? customSlotMatching(slot) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isAdUnitCodeMatchingSlot)(slot)).forEach(function (targetId) {
        Object.keys(targetingConfig[targetId]).forEach(function (key) {
          var value = targetingConfig[targetId][key];
          if (typeof value === 'string' && value.indexOf(',') !== -1) {
            // due to the check the array will be formed only if string has ',' else plain string will be assigned as value
            value = value.split(',');
          }
          targetingConfig[targetId][key] = value;
        });
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Attempting to set targeting-map for slot: ".concat(slot.getSlotElementId(), " with targeting-map:"), targetingConfig[targetId]);
        slot.updateTargetingFromMap(targetingConfig[targetId]);
      });
    });
  };

  /**
   * normlizes input to a `adUnit.code` array
   * @param  {(string|string[])} adUnitCode [description]
   * @return {string[]}     AdUnit code array
   */
  function getAdUnitCodes(adUnitCode) {
    if (typeof adUnitCode === 'string') {
      return [adUnitCode];
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(adUnitCode)) {
      return adUnitCode;
    }
    return auctionManager.getAdUnitCodes() || [];
  }
  function getBidsReceived() {
    var bidsReceived = auctionManager.getBidsReceived();
    if (!_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('useBidCache')) {
      // don't use bid cache (i.e. filter out bids not in the latest auction)
      bidsReceived = bidsReceived.filter(function (bid) {
        return latestAuctionForAdUnit[bid.adUnitCode] === bid.auctionId;
      });
    } else {
      // if custom bid cache filter function exists, run for each bid from
      // previous auctions. If it returns true, include bid in bid pool
      var filterFunction = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('bidCacheFilterFunction');
      if (typeof filterFunction === 'function') {
        bidsReceived = bidsReceived.filter(function (bid) {
          return latestAuctionForAdUnit[bid.adUnitCode] === bid.auctionId || !!filterFunction(bid);
        });
      }
    }
    bidsReceived = bidsReceived.filter(function (bid) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__["default"])(bid, 'video.context') !== _mediaTypes_js__WEBPACK_IMPORTED_MODULE_9__.ADPOD;
    }).filter(isBidUsable);
    return getHighestCpmBidsFromBidPool(bidsReceived, _utils_js__WEBPACK_IMPORTED_MODULE_1__.getOldestHighestCpmBid);
  }

  /**
   * Returns top bids for a given adUnit or set of adUnits.
   * @param  {(string|string[])} adUnitCode adUnitCode or array of adUnitCodes
   * @return {[type]}            [description]
   */
  targeting.getWinningBids = function (adUnitCode) {
    var bidsReceived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBidsReceived();
    var adUnitCodes = getAdUnitCodes(adUnitCode);
    return bidsReceived.filter(function (bid) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(adUnitCodes, bid.adUnitCode);
    }).filter(function (bid) {
      return _bidderSettings_js__WEBPACK_IMPORTED_MODULE_10__.bidderSettings.get(bid.bidderCode, 'allowZeroCpmBids') === true ? bid.cpm >= 0 : bid.cpm > 0;
    }).map(function (bid) {
      return bid.adUnitCode;
    }).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques).map(function (adUnitCode) {
      return bidsReceived.filter(function (bid) {
        return bid.adUnitCode === adUnitCode ? bid : null;
      }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_1__.getHighestCpm);
    });
  };

  /**
   * @param  {(string|string[])} adUnitCode adUnitCode or array of adUnitCodes
   * Sets targeting for AST
   */
  targeting.setTargetingForAst = function (adUnitCodes) {
    var astTargeting = targeting.getAllTargeting(adUnitCodes);
    try {
      targeting.resetPresetTargetingAST(adUnitCodes);
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('unable to reset targeting for AST' + e);
    }
    Object.keys(astTargeting).forEach(function (targetId) {
      return Object.keys(astTargeting[targetId]).forEach(function (key) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Attempting to set targeting for targetId: ".concat(targetId, " key: ").concat(key, " value: ").concat(astTargeting[targetId][key]));
        // setKeywords supports string and array as value
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(astTargeting[targetId][key]) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(astTargeting[targetId][key])) {
          var keywordsObj = {};
          var regex = /pt[0-9]/;
          if (key.search(regex) < 0) {
            keywordsObj[key.toUpperCase()] = astTargeting[targetId][key];
          } else {
            // pt${n} keys should not be uppercased
            keywordsObj[key] = astTargeting[targetId][key];
          }
          window.apntag.setKeywords(targetId, keywordsObj, {
            overrideKeyValue: true
          });
        }
      });
    });
  };

  /**
   * Get targeting key value pairs for winning bid.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   winning bids targeting
   */
  function getWinningBidTargeting(adUnitCodes, bidsReceived) {
    var winners = targeting.getWinningBids(adUnitCodes, bidsReceived);
    var standardKeys = getStandardKeys();
    winners = winners.map(function (winner) {
      return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, winner.adUnitCode, Object.keys(winner.adserverTargeting).filter(function (key) {
        return typeof winner.sendStandardTargeting === 'undefined' || winner.sendStandardTargeting || standardKeys.indexOf(key) === -1;
      }).reduce(function (acc, key) {
        var targetingValue = [winner.adserverTargeting[key]];
        var targeting = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key.substring(0, MAX_DFP_KEYLENGTH), targetingValue);
        if (key === _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS.DEAL) {
          var bidderCodeTargetingKey = "".concat(key, "_").concat(winner.bidderCode).substring(0, MAX_DFP_KEYLENGTH);
          var bidderCodeTargeting = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, bidderCodeTargetingKey, targetingValue);
          return [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_5__["default"])(acc), [targeting, bidderCodeTargeting]);
        }
        return [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_5__["default"])(acc), [targeting]);
      }, []));
    });
    return winners;
  }
  function getStandardKeys() {
    return auctionManager.getStandardBidderAdServerTargeting() // in case using a custom standard key set
    .map(function (targeting) {
      return targeting.key;
    }).concat(TARGETING_KEYS).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques); // standard keys defined in the library.
  }

  /**
   * Merge custom adserverTargeting with same key name for same adUnitCode.
   * e.g: Appnexus defining custom keyvalue pair foo:bar and Rubicon defining custom keyvalue pair foo:baz will be merged to foo: ['bar','baz']
   *
   * @param {Object[]} acc Accumulator for reducer. It will store updated bidResponse objects
   * @param {Object} bid BidResponse
   * @param {number} index current index
   * @param {Array} arr original array
   */
  function mergeAdServerTargeting(acc, bid, index, arr) {
    function concatTargetingValue(key) {
      return function (currentBidElement) {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(currentBidElement.adserverTargeting[key])) {
          currentBidElement.adserverTargeting[key] = [currentBidElement.adserverTargeting[key]];
        }
        currentBidElement.adserverTargeting[key] = currentBidElement.adserverTargeting[key].concat(bid.adserverTargeting[key]).filter(_utils_js__WEBPACK_IMPORTED_MODULE_1__.uniques);
        delete bid.adserverTargeting[key];
      };
    }
    function hasSameAdunitCodeAndKey(key) {
      return function (currentBidElement) {
        return currentBidElement.adUnitCode === bid.adUnitCode && currentBidElement.adserverTargeting[key];
      };
    }
    Object.keys(bid.adserverTargeting).filter(getCustomKeys()).forEach(function (key) {
      if (acc.length) {
        acc.filter(hasSameAdunitCodeAndKey(key)).forEach(concatTargetingValue(key));
      }
    });
    acc.push(bid);
    return acc;
  }
  function getCustomKeys() {
    var standardKeys = getStandardKeys();
    if (true) {
      standardKeys = standardKeys.concat(_native_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE_TARGETING_KEYS);
    }
    return function (key) {
      return standardKeys.indexOf(key) === -1;
    };
  }
  function truncateCustomKeys(bid) {
    return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, bid.adUnitCode, Object.keys(bid.adserverTargeting)
    // Get only the non-standard keys of the losing bids, since we
    // don't want to override the standard keys of the winning bid.
    .filter(getCustomKeys()).map(function (key) {
      return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key.substring(0, MAX_DFP_KEYLENGTH), [bid.adserverTargeting[key]]);
    }));
  }

  /**
   * Get custom targeting key value pairs for bids.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   bids with custom targeting defined in bidderSettings
   */
  function getCustomBidTargeting(adUnitCodes, bidsReceived) {
    return bidsReceived.filter(function (bid) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(adUnitCodes, bid.adUnitCode);
    }).map(function (bid) {
      return Object.assign({}, bid);
    }).reduce(mergeAdServerTargeting, []).map(truncateCustomKeys).filter(function (bid) {
      return bid;
    }); // removes empty elements in array;
  }

  /**
   * Get targeting key value pairs for non-winning bids.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   all non-winning bids targeting
   */
  function getBidLandscapeTargeting(adUnitCodes, bidsReceived) {
    var standardKeys =  true ? TARGETING_KEYS.concat(_native_js__WEBPACK_IMPORTED_MODULE_6__.NATIVE_TARGETING_KEYS) : 0;
    var adUnitBidLimit = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('sendBidsControl.bidLimit');
    var bids = getHighestCpmBidsFromBidPool(bidsReceived, _utils_js__WEBPACK_IMPORTED_MODULE_1__.getHighestCpm, adUnitBidLimit);
    var allowSendAllBidsTargetingKeys = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('targetingControls.allowSendAllBidsTargetingKeys');
    var allowedSendAllBidTargeting = allowSendAllBidsTargetingKeys ? allowSendAllBidsTargetingKeys.map(function (key) {
      return _constants_json__WEBPACK_IMPORTED_MODULE_2__.TARGETING_KEYS[key];
    }) : standardKeys;

    // populate targeting keys for the remaining bids
    return bids.map(function (bid) {
      if (bidShouldBeAddedToTargeting(bid, adUnitCodes)) {
        return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, bid.adUnitCode, getTargetingMap(bid, standardKeys.filter(function (key) {
          return typeof bid.adserverTargeting[key] !== 'undefined' && allowedSendAllBidTargeting.indexOf(key) !== -1;
        })));
      }
    }).filter(function (bid) {
      return bid;
    }); // removes empty elements in array
  }

  function getTargetingMap(bid, keys) {
    return keys.map(function (key) {
      return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, "".concat(key, "_").concat(bid.bidderCode).substring(0, MAX_DFP_KEYLENGTH), [bid.adserverTargeting[key]]);
    });
  }
  function getAdUnitTargeting(adUnitCodes) {
    function getTargetingObj(adUnit) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_8__["default"])(adUnit, _constants_json__WEBPACK_IMPORTED_MODULE_2__.JSON_MAPPING.ADSERVER_TARGETING);
    }
    function getTargetingValues(adUnit) {
      var aut = getTargetingObj(adUnit);
      return Object.keys(aut).map(function (key) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(aut[key])) aut[key] = aut[key].split(',').map(function (s) {
          return s.trim();
        });
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(aut[key])) aut[key] = [aut[key]];
        return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, aut[key]);
      });
    }
    return auctionManager.getAdUnits().filter(function (adUnit) {
      return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_3__.includes)(adUnitCodes, adUnit.code) && getTargetingObj(adUnit);
    }).map(function (adUnit) {
      return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, adUnit.code, getTargetingValues(adUnit));
    });
  }
  targeting.isApntagDefined = function () {
    if (window.apntag && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFn)(window.apntag.setKeywords)) {
      return true;
    }
  };
  return targeting;
}
var targeting = newTargeting(_auctionManager_js__WEBPACK_IMPORTED_MODULE_11__.auctionManager);

/***/ }),

/***/ "./src/userSync.js":
/*!*************************!*\
  !*** ./src/userSync.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "userSync": function() { return /* binding */ userSync; }
/* harmony export */ });
/* unused harmony exports USERSYNC_DEFAULT_CONFIG, newUserSync */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _activities_rules_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./activities/rules.js */ "./src/activities/rules.js");
/* harmony import */ var _activities_activities_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./activities/activities.js */ "./src/activities/activities.js");
/* harmony import */ var _activities_params_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./activities/params.js */ "./src/activities/params.js");
/* harmony import */ var _activities_modules_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./activities/modules.js */ "./src/activities/modules.js");
/* harmony import */ var _activities_activityParams_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./activities/activityParams.js */ "./src/activities/activityParams.js");











var USERSYNC_DEFAULT_CONFIG = {
  syncEnabled: true,
  filterSettings: {
    image: {
      bidders: '*',
      filter: 'include'
    }
  },
  syncsPerBidder: 5,
  syncDelay: 3000,
  auctionDelay: 0
};

// Set userSync default values
_config_js__WEBPACK_IMPORTED_MODULE_0__.config.setDefaults({
  'userSync': (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepClone)(USERSYNC_DEFAULT_CONFIG)
});
var storage = (0,_storageManager_js__WEBPACK_IMPORTED_MODULE_2__.getCoreStorageManager)('usersync');

/**
 * Factory function which creates a new UserSyncPool.
 *
 * @param {} deps Configuration options and dependencies which the
 *   UserSync object needs in order to behave properly.
 */
function newUserSync(deps) {
  var publicApi = {};
  // A queue of user syncs for each adapter
  // Let getDefaultQueue() set the defaults
  var queue = getDefaultQueue();

  // Whether or not user syncs have been trigger on this page load for a specific bidder
  var hasFiredBidder = new Set();
  // How many bids for each adapter
  var numAdapterBids = {};

  // for now - default both to false in case filterSettings config is absent/misconfigured
  var permittedPixels = {
    image: true,
    iframe: false
  };

  // Use what is in config by default
  var usConfig = deps.config;
  // Update if it's (re)set
  _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('userSync', function (conf) {
    // Added this logic for https://github.com/prebid/Prebid.js/issues/4864
    // if userSync.filterSettings does not contain image/all configs, merge in default image config to ensure image pixels are fired
    if (conf.userSync) {
      var fs = conf.userSync.filterSettings;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(fs)) {
        if (!fs.image && !fs.all) {
          conf.userSync.filterSettings.image = {
            bidders: '*',
            filter: 'include'
          };
        }
      }
    }
    usConfig = Object.assign(usConfig, conf.userSync);
  });
  deps.regRule(_activities_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_SYNC_USER, 'userSync config', function (params) {
    if (!usConfig.syncEnabled) {
      return {
        allow: false,
        reason: 'syncs are disabled'
      };
    }
    if (params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_TYPE] === _activities_modules_js__WEBPACK_IMPORTED_MODULE_5__.MODULE_TYPE_BIDDER) {
      var syncType = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_SYNC_TYPE];
      var bidder = params[_activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_COMPONENT_NAME];
      if (!publicApi.canBidderRegisterSync(syncType, bidder)) {
        return {
          allow: false,
          reason: "".concat(syncType, " syncs are not enabled for ").concat(bidder)
        };
      }
    }
  });

  /**
   * @function getDefaultQueue
   * @summary Returns the default empty queue
   * @private
   * @return {object} A queue with no syncs
   */
  function getDefaultQueue() {
    return {
      image: [],
      iframe: []
    };
  }

  /**
   * @function fireSyncs
   * @summary Trigger all user syncs in the queue
   * @private
   */
  function fireSyncs() {
    if (!usConfig.syncEnabled || !deps.browserSupportsCookies) {
      return;
    }
    try {
      // Iframe syncs
      loadIframes();
      // Image pixels
      fireImagePixels();
    } catch (e) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logError)('Error firing user syncs', e);
    }
    // Reset the user sync queue
    queue = getDefaultQueue();
  }
  function forEachFire(queue, fn) {
    // Randomize the order of the pixels before firing
    // This is to avoid giving any bidder who has registered multiple syncs
    // any preferential treatment and balancing them out
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.shuffle)(queue).forEach(fn);
  }

  /**
   * @function fireImagePixels
   * @summary Loops through user sync pixels and fires each one
   * @private
   */
  function fireImagePixels() {
    if (!permittedPixels.image) {
      return;
    }
    forEachFire(queue.image, function (sync) {
      var _sync = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__["default"])(sync, 2),
        bidderName = _sync[0],
        trackingPixelUrl = _sync[1];
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Invoking image pixel user sync for bidder: ".concat(bidderName));
      // Create image object and add the src url
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.triggerPixel)(trackingPixelUrl);
    });
  }

  /**
   * @function loadIframes
   * @summary Loops through iframe syncs and loads an iframe element into the page
   * @private
   */
  function loadIframes() {
    if (!permittedPixels.iframe) {
      return;
    }
    forEachFire(queue.iframe, function (sync) {
      var _sync2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__["default"])(sync, 2),
        bidderName = _sync2[0],
        iframeUrl = _sync2[1];
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("Invoking iframe user sync for bidder: ".concat(bidderName));
      // Insert iframe into DOM
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.insertUserSyncIframe)(iframeUrl);
      // for a bidder, if iframe sync is present then remove image pixel
      removeImagePixelsForBidder(queue, bidderName);
    });
  }
  function removeImagePixelsForBidder(queue, iframeSyncBidderName) {
    queue.image = queue.image.filter(function (imageSync) {
      var imageSyncBidderName = imageSync[0];
      return imageSyncBidderName !== iframeSyncBidderName;
    });
  }

  /**
   * @function incrementAdapterBids
   * @summary Increment the count of user syncs queue for the adapter
   * @private
   * @params {object} numAdapterBids The object contain counts for all adapters
   * @params {string} bidder The name of the bidder adding a sync
   * @returns {object} The updated version of numAdapterBids
   */
  function incrementAdapterBids(numAdapterBids, bidder) {
    if (!numAdapterBids[bidder]) {
      numAdapterBids[bidder] = 1;
    } else {
      numAdapterBids[bidder] += 1;
    }
    return numAdapterBids;
  }

  /**
   * @function registerSync
   * @summary Add sync for this bidder to a queue to be fired later
   * @public
   * @params {string} type The type of the sync including image, iframe
   * @params {string} bidder The name of the adapter. e.g. "rubicon"
   * @params {string} url Either the pixel url or iframe url depending on the type
    * @example <caption>Using Image Sync</caption>
   * // registerSync(type, adapter, pixelUrl)
   * userSync.registerSync('image', 'rubicon', 'http://example.com/pixel')
   */
  publicApi.registerSync = function (type, bidder, url) {
    var _activityParams;
    if (hasFiredBidder.has(bidder)) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logMessage)("already fired syncs for \"".concat(bidder, "\", ignoring registerSync call"));
    }
    if (!usConfig.syncEnabled || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(queue[type])) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("User sync type \"".concat(type, "\" not supported"));
    }
    if (!bidder) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Bidder is required for registering sync");
    }
    if (usConfig.syncsPerBidder !== 0 && Number(numAdapterBids[bidder]) >= usConfig.syncsPerBidder) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Number of user syncs exceeded for \"".concat(bidder, "\""));
    }
    if (deps.isAllowed(_activities_activities_js__WEBPACK_IMPORTED_MODULE_3__.ACTIVITY_SYNC_USER, (0,_activities_activityParams_js__WEBPACK_IMPORTED_MODULE_7__.activityParams)(_activities_modules_js__WEBPACK_IMPORTED_MODULE_5__.MODULE_TYPE_BIDDER, bidder, (_activityParams = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_activityParams, _activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_SYNC_TYPE, type), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_activityParams, _activities_params_js__WEBPACK_IMPORTED_MODULE_4__.ACTIVITY_PARAM_SYNC_URL, url), _activityParams)))) {
      // the bidder's pixel has passed all checks and is allowed to register
      queue[type].push([bidder, url]);
      numAdapterBids = incrementAdapterBids(numAdapterBids, bidder);
    }
  };

  /**
   * Mark a bidder as done with its user syncs - no more will be accepted from them in this session.
   * @param {string} bidderCode
   */
  publicApi.bidderDone = hasFiredBidder.add.bind(hasFiredBidder);

  /**
   * @function shouldBidderBeBlocked
   * @summary Check filterSettings logic to determine if the bidder should be prevented from registering their userSync tracker
   * @private
   * @param {string} type The type of the sync; either image or iframe
   * @param {string} bidder The name of the adapter. e.g. "rubicon"
   * @returns {boolean} true => bidder is not allowed to register; false => bidder can register
    */
  function shouldBidderBeBlocked(type, bidder) {
    var filterConfig = usConfig.filterSettings;

    // apply the filter check if the config object is there (eg filterSettings.iframe exists) and if the config object is properly setup
    if (isFilterConfigValid(filterConfig, type)) {
      permittedPixels[type] = true;
      var activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
      var biddersToFilter = activeConfig.bidders === '*' ? [bidder] : activeConfig.bidders;
      var filterType = activeConfig.filter || 'include'; // set default if undefined

      // return true if the bidder is either: not part of the include (ie outside the whitelist) or part of the exclude (ie inside the blacklist)
      var checkForFiltering = {
        'include': function include(bidders, bidder) {
          return !(0,_polyfill_js__WEBPACK_IMPORTED_MODULE_9__.includes)(bidders, bidder);
        },
        'exclude': function exclude(bidders, bidder) {
          return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_9__.includes)(bidders, bidder);
        }
      };
      return checkForFiltering[filterType](biddersToFilter, bidder);
    }
    return !permittedPixels[type];
  }

  /**
   * @function isFilterConfigValid
   * @summary Check if the filterSettings object in the userSync config is setup properly
   * @private
   * @param {object} filterConfig sub-config object taken from filterSettings
   * @param {string} type The type of the sync; either image or iframe
   * @returns {boolean} true => config is setup correctly, false => setup incorrectly or filterConfig[type] is not present
   */
  function isFilterConfigValid(filterConfig, type) {
    if (filterConfig.all && filterConfig[type]) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Detected presence of the \"filterSettings.all\" and \"filterSettings.".concat(type, "\" in userSync config.  You cannot mix \"all\" with \"iframe/image\" configs; they are mutually exclusive."));
      return false;
    }
    var activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
    var activeConfigName = filterConfig.all ? 'all' : type;

    // if current pixel type isn't part of the config's logic, skip rest of the config checks...
    // we return false to skip subsequent filter checks in shouldBidderBeBlocked() function
    if (!activeConfig) {
      return false;
    }
    var filterField = activeConfig.filter;
    var biddersField = activeConfig.bidders;
    if (filterField && filterField !== 'include' && filterField !== 'exclude') {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("UserSync \"filterSettings.".concat(activeConfigName, ".filter\" setting '").concat(filterField, "' is not a valid option; use either 'include' or 'exclude'."));
      return false;
    }
    if (biddersField !== '*' && !(Array.isArray(biddersField) && biddersField.length > 0 && biddersField.every(function (bidderInList) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isStr)(bidderInList) && bidderInList !== '*';
    }))) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.logWarn)("Detected an invalid setup in userSync \"filterSettings.".concat(activeConfigName, ".bidders\"; use either '*' (to represent all bidders) or an array of bidders."));
      return false;
    }
    return true;
  }

  /**
   * @function syncUsers
   * @summary Trigger all the user syncs based on publisher-defined timeout
   * @public
   * @params {int} timeout The delay in ms before syncing data - default 0
   */
  publicApi.syncUsers = function () {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (timeout) {
      return setTimeout(fireSyncs, Number(timeout));
    }
    fireSyncs();
  };

  /**
   * @function triggerUserSyncs
   * @summary A `syncUsers` wrapper for determining if enableOverride has been turned on
   * @public
   */
  publicApi.triggerUserSyncs = function () {
    if (usConfig.enableOverride) {
      publicApi.syncUsers();
    }
  };
  publicApi.canBidderRegisterSync = function (type, bidder) {
    if (usConfig.filterSettings) {
      if (shouldBidderBeBlocked(type, bidder)) {
        return false;
      }
    }
    return true;
  };
  return publicApi;
}
var userSync = newUserSync(Object.defineProperties({
  config: _config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('userSync'),
  isAllowed: _activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.isActivityAllowed,
  regRule: _activities_rules_js__WEBPACK_IMPORTED_MODULE_10__.registerActivityControl
}, {
  browserSupportsCookies: {
    get: function get() {
      // call storage lazily to give time for consent data to be available
      return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isSafariBrowser)() && storage.cookiesAreEnabled();
    }
  }
}));

/**
 * @typedef {Object} UserSyncConfig
 *
 * @property {boolean} enableOverride
 * @property {boolean} syncEnabled
 * @property {int} syncsPerBidder
 * @property {string[]} enabledBidders
 * @property {Object} filterSettings
 */

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_each": function() { return /* binding */ _each; },
/* harmony export */   "_map": function() { return /* binding */ _map; },
/* harmony export */   "_setEventEmitter": function() { return /* binding */ _setEventEmitter; },
/* harmony export */   "adUnitsFilter": function() { return /* binding */ adUnitsFilter; },
/* harmony export */   "bind": function() { return /* binding */ bind; },
/* harmony export */   "buildUrl": function() { return /* binding */ buildUrl; },
/* harmony export */   "callBurl": function() { return /* binding */ callBurl; },
/* harmony export */   "checkCookieSupport": function() { return /* binding */ checkCookieSupport; },
/* harmony export */   "contains": function() { return /* binding */ contains; },
/* harmony export */   "convertTypes": function() { return /* binding */ convertTypes; },
/* harmony export */   "createInvisibleIframe": function() { return /* binding */ createInvisibleIframe; },
/* harmony export */   "deepClone": function() { return /* binding */ deepClone; },
/* harmony export */   "delayExecution": function() { return /* binding */ delayExecution; },
/* harmony export */   "flatten": function() { return /* binding */ flatten; },
/* harmony export */   "generateUUID": function() { return /* binding */ generateUUID; },
/* harmony export */   "getBidderCodes": function() { return /* binding */ getBidderCodes; },
/* harmony export */   "getDNT": function() { return /* binding */ getDNT; },
/* harmony export */   "getDefinedParams": function() { return /* binding */ getDefinedParams; },
/* harmony export */   "getGptSlotForAdUnitCode": function() { return /* binding */ getGptSlotForAdUnitCode; },
/* harmony export */   "getGptSlotInfoForAdUnitCode": function() { return /* binding */ getGptSlotInfoForAdUnitCode; },
/* harmony export */   "getHighestCpm": function() { return /* binding */ getHighestCpm; },
/* harmony export */   "getKeyByValue": function() { return /* binding */ getKeyByValue; },
/* harmony export */   "getOldestHighestCpmBid": function() { return /* binding */ getOldestHighestCpmBid; },
/* harmony export */   "getParameterByName": function() { return /* binding */ getParameterByName; },
/* harmony export */   "getPerformanceNow": function() { return /* binding */ getPerformanceNow; },
/* harmony export */   "getUniqueIdentifierStr": function() { return /* binding */ getUniqueIdentifierStr; },
/* harmony export */   "getUserConfiguredParams": function() { return /* binding */ getUserConfiguredParams; },
/* harmony export */   "getValue": function() { return /* binding */ getValue; },
/* harmony export */   "getWindowSelf": function() { return /* binding */ getWindowSelf; },
/* harmony export */   "getWindowTop": function() { return /* binding */ getWindowTop; },
/* harmony export */   "groupBy": function() { return /* binding */ groupBy; },
/* harmony export */   "hasDeviceAccess": function() { return /* binding */ hasDeviceAccess; },
/* harmony export */   "inIframe": function() { return /* binding */ inIframe; },
/* harmony export */   "insertElement": function() { return /* binding */ insertElement; },
/* harmony export */   "insertHtmlIntoIframe": function() { return /* binding */ insertHtmlIntoIframe; },
/* harmony export */   "insertUserSyncIframe": function() { return /* binding */ insertUserSyncIframe; },
/* harmony export */   "isAdUnitCodeMatchingSlot": function() { return /* binding */ isAdUnitCodeMatchingSlot; },
/* harmony export */   "isApnGetTagDefined": function() { return /* binding */ isApnGetTagDefined; },
/* harmony export */   "isArray": function() { return /* binding */ isArray; },
/* harmony export */   "isArrayOfNums": function() { return /* binding */ isArrayOfNums; },
/* harmony export */   "isBoolean": function() { return /* binding */ isBoolean; },
/* harmony export */   "isEmpty": function() { return /* binding */ isEmpty; },
/* harmony export */   "isEmptyStr": function() { return /* binding */ isEmptyStr; },
/* harmony export */   "isFn": function() { return /* binding */ isFn; },
/* harmony export */   "isGptPubadsDefined": function() { return /* binding */ isGptPubadsDefined; },
/* harmony export */   "isInteger": function() { return /* binding */ isInteger; },
/* harmony export */   "isNumber": function() { return /* binding */ isNumber; },
/* harmony export */   "isPlainObject": function() { return /* binding */ isPlainObject; },
/* harmony export */   "isSafariBrowser": function() { return /* binding */ isSafariBrowser; },
/* harmony export */   "isStr": function() { return /* binding */ isStr; },
/* harmony export */   "isValidMediaTypes": function() { return /* binding */ isValidMediaTypes; },
/* harmony export */   "logError": function() { return /* binding */ logError; },
/* harmony export */   "logInfo": function() { return /* binding */ logInfo; },
/* harmony export */   "logMessage": function() { return /* binding */ logMessage; },
/* harmony export */   "logWarn": function() { return /* binding */ logWarn; },
/* harmony export */   "memoize": function() { return /* binding */ memoize; },
/* harmony export */   "mergeDeep": function() { return /* binding */ mergeDeep; },
/* harmony export */   "parseQueryStringParameters": function() { return /* binding */ parseQueryStringParameters; },
/* harmony export */   "parseSizesInput": function() { return /* binding */ parseSizesInput; },
/* harmony export */   "parseUrl": function() { return /* binding */ parseUrl; },
/* harmony export */   "pick": function() { return /* binding */ pick; },
/* harmony export */   "prefixLog": function() { return /* binding */ prefixLog; },
/* harmony export */   "replaceAuctionPrice": function() { return /* binding */ replaceAuctionPrice; },
/* harmony export */   "replaceClickThrough": function() { return /* binding */ replaceClickThrough; },
/* harmony export */   "safeJSONParse": function() { return /* binding */ safeJSONParse; },
/* harmony export */   "setScriptAttributes": function() { return /* binding */ setScriptAttributes; },
/* harmony export */   "shuffle": function() { return /* binding */ shuffle; },
/* harmony export */   "timestamp": function() { return /* binding */ timestamp; },
/* harmony export */   "transformAdServerTargetingObj": function() { return /* binding */ transformAdServerTargetingObj; },
/* harmony export */   "triggerPixel": function() { return /* binding */ triggerPixel; },
/* harmony export */   "uniques": function() { return /* binding */ uniques; },
/* harmony export */   "unsupportedBidderMessage": function() { return /* binding */ unsupportedBidderMessage; }
/* harmony export */ });
/* unused harmony exports internal, getPrebidInternal, getBidIdParameter, tryAppendQueryString, getAdUnitSizes, parseGPTSingleSizeArray, parseGPTSingleSizeArrayToRtbSize, getWindowLocation, hasConsoleLogger, debugTurnedOn, isA, hasOwn, waitForElementToLoad, createTrackPixelHtml, createTrackPixelIframeHtml, getValueString, getBidRequest, getKeys, getLatestHighestCpmBid, isSlotMatchingAdUnitCode, convertCamelToUnderscore, cleanObj, transformBidderParamKeywords, fill, chunk, getMinValueFromArray, getMaxValueFromArray, compareOn, parseQS, formatQS, deepEqual, cyrb53Hash, getWindowFromDocument, escapeUnsafeChars */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var just_clone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! just-clone */ "./node_modules/just-clone/index.js");
/* harmony import */ var just_clone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(just_clone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");












var tArr = 'Array';
var tStr = 'String';
var tFn = 'Function';
var tNumb = 'Number';
var tObject = 'Object';
var tBoolean = 'Boolean';
var toString = Object.prototype.toString;
var consoleExists = Boolean(window.console);
var consoleLogExists = Boolean(consoleExists && window.console.log);
var consoleInfoExists = Boolean(consoleExists && window.console.info);
var consoleWarnExists = Boolean(consoleExists && window.console.warn);
var consoleErrorExists = Boolean(consoleExists && window.console.error);
var eventEmitter;
var pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
function _setEventEmitter(emitFn) {
  // called from events.js - this hoop is to avoid circular imports
  eventEmitter = emitFn;
}
function emitEvent() {
  if (eventEmitter != null) {
    eventEmitter.apply(void 0, arguments);
  }
}

// this allows stubbing of utility functions that are used internally by other utility functions
var internal = {
  checkCookieSupport: checkCookieSupport,
  createTrackPixelIframeHtml: createTrackPixelIframeHtml,
  getWindowSelf: getWindowSelf,
  getWindowTop: getWindowTop,
  getWindowLocation: getWindowLocation,
  insertUserSyncIframe: insertUserSyncIframe,
  insertElement: insertElement,
  isFn: isFn,
  triggerPixel: triggerPixel,
  logError: logError,
  logWarn: logWarn,
  logMessage: logMessage,
  logInfo: logInfo,
  parseQS: parseQS,
  formatQS: formatQS,
  deepEqual: deepEqual
};
var prebidInternal = {};
/**
 * Returns object that is used as internal prebid namespace
 */
function getPrebidInternal() {
  return prebidInternal;
}
var uniqueRef = {};
var bind = function (a, b) {
  return b;
}.bind(null, 1, uniqueRef)() === uniqueRef ? Function.prototype.bind : function (bind) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  return function () {
    return self.apply(bind, args.concat(Array.prototype.slice.call(arguments)));
  };
};

/* utility method to get incremental integer starting from 1 */
var getIncrementalInteger = function () {
  var count = 0;
  return function () {
    count++;
    return count;
  };
}();

// generate a random string (to be used as a dynamic JSONP callback)
function getUniqueIdentifierStr() {
  return getIncrementalInteger() + Math.random().toString(16).substr(2);
}

/**
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 * https://gist.github.com/jed/982883 via node-uuid
 */
function generateUUID(placeholder) {
  return placeholder ? (placeholder ^ _getRandomData() >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

/**
 * Returns random data using the Crypto API if available and Math.random if not
 * Method is from https://gist.github.com/jed/982883 like generateUUID, direct link https://gist.github.com/jed/982883#gistcomment-45104
 */
function _getRandomData() {
  if (window && window.crypto && window.crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0] % 16;
  } else {
    return Math.random() * 16;
  }
}
function getBidIdParameter(key, paramsObj) {
  if (paramsObj && paramsObj[key]) {
    return paramsObj[key];
  }
  return '';
}
function tryAppendQueryString(existingUrl, key, value) {
  if (value) {
    return existingUrl + key + '=' + encodeURIComponent(value) + '&';
  }
  return existingUrl;
}

// parse a query string object passed in bid params
// bid params should be an object such as {key: "value", key1 : "value1"}
// aliases to formatQS
function parseQueryStringParameters(queryObj) {
  var result = '';
  for (var k in queryObj) {
    if (queryObj.hasOwnProperty(k)) {
      result += k + '=' + encodeURIComponent(queryObj[k]) + '&';
    }
  }
  result = result.replace(/&$/, '');
  return result;
}

// transform an AdServer targeting bids into a query string to send to the adserver
function transformAdServerTargetingObj(targeting) {
  // we expect to receive targeting for a single slot at a time
  if (targeting && Object.getOwnPropertyNames(targeting).length > 0) {
    return getKeys(targeting).map(function (key) {
      return "".concat(key, "=").concat(encodeURIComponent(getValue(targeting, key)));
    }).join('&');
  } else {
    return '';
  }
}

/**
 * Read an adUnit object and return the sizes used in an [[728, 90]] format (even if they had [728, 90] defined)
 * Preference is given to the `adUnit.mediaTypes.banner.sizes` object over the `adUnit.sizes`
 * @param {object} adUnit one adUnit object from the normal list of adUnits
 * @returns {Array.<number[]>} array of arrays containing numeric sizes
 */
function getAdUnitSizes(adUnit) {
  if (!adUnit) {
    return;
  }
  var sizes = [];
  if (adUnit.mediaTypes && adUnit.mediaTypes.banner && Array.isArray(adUnit.mediaTypes.banner.sizes)) {
    var bannerSizes = adUnit.mediaTypes.banner.sizes;
    if (Array.isArray(bannerSizes[0])) {
      sizes = bannerSizes;
    } else {
      sizes.push(bannerSizes);
    }
    // TODO - remove this else block when we're ready to deprecate adUnit.sizes for bidders
  } else if (Array.isArray(adUnit.sizes)) {
    if (Array.isArray(adUnit.sizes[0])) {
      sizes = adUnit.sizes;
    } else {
      sizes.push(adUnit.sizes);
    }
  }
  return sizes;
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of sizes `["300x250"]` or '['300x250', '970x90']'
 * @param  {(Array.<number[]>|Array.<number>)} sizeObj Input array or double array [300,250] or [[300,250], [728,90]]
 * @return {Array.<string>}  Array of strings like `["300x250"]` or `["300x250", "728x90"]`
 */
function parseSizesInput(sizeObj) {
  var parsedSizes = [];

  // if a string for now we can assume it is a single size, like "300x250"
  if (typeof sizeObj === 'string') {
    // multiple sizes will be comma-separated
    var sizes = sizeObj.split(',');

    // regular expression to match strigns like 300x250
    // start of line, at least 1 number, an "x" , then at least 1 number, and the then end of the line
    var sizeRegex = /^(\d)+x(\d)+$/i;
    if (sizes) {
      for (var curSizePos in sizes) {
        if (hasOwn(sizes, curSizePos) && sizes[curSizePos].match(sizeRegex)) {
          parsedSizes.push(sizes[curSizePos]);
        }
      }
    }
  } else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(sizeObj) === 'object') {
    var sizeArrayLength = sizeObj.length;

    // don't process empty array
    if (sizeArrayLength > 0) {
      // if we are a 2 item array of 2 numbers, we must be a SingleSize array
      if (sizeArrayLength === 2 && typeof sizeObj[0] === 'number' && typeof sizeObj[1] === 'number') {
        parsedSizes.push(parseGPTSingleSizeArray(sizeObj));
      } else {
        // otherwise, we must be a MultiSize array
        for (var i = 0; i < sizeArrayLength; i++) {
          parsedSizes.push(parseGPTSingleSizeArray(sizeObj[i]));
        }
      }
    }
  }
  return parsedSizes;
}

// Parse a GPT style single size array, (i.e [300, 250])
// into an AppNexus style string, (i.e. 300x250)
function parseGPTSingleSizeArray(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return singleSize[0] + 'x' + singleSize[1];
  }
}

// Parse a GPT style single size array, (i.e [300, 250])
// into OpenRTB-compatible (imp.banner.w/h, imp.banner.format.w/h, imp.video.w/h) object(i.e. {w:300, h:250})
function parseGPTSingleSizeArrayToRtbSize(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return {
      w: singleSize[0],
      h: singleSize[1]
    };
  }
}
function isValidGPTSingleSize(singleSize) {
  // if we aren't exactly 2 items in this array, it is invalid
  return isArray(singleSize) && singleSize.length === 2 && !isNaN(singleSize[0]) && !isNaN(singleSize[1]);
}
function getWindowTop() {
  return window.top;
}
function getWindowSelf() {
  return window.self;
}
function getWindowLocation() {
  return window.location;
}

/**
 * Wrappers to console.(log | info | warn | error). Takes N arguments, the same as the native methods
 */
function logMessage() {
  if (debugTurnedOn() && consoleLogExists) {
    // eslint-disable-next-line no-console
    console.log.apply(console, decorateLog(arguments, 'MESSAGE:'));
  }
}
function logInfo() {
  if (debugTurnedOn() && consoleInfoExists) {
    // eslint-disable-next-line no-console
    console.info.apply(console, decorateLog(arguments, 'INFO:'));
  }
}
function logWarn() {
  if (debugTurnedOn() && consoleWarnExists) {
    // eslint-disable-next-line no-console
    console.warn.apply(console, decorateLog(arguments, 'WARNING:'));
  }
  emitEvent(_constants_json__WEBPACK_IMPORTED_MODULE_3__.EVENTS.AUCTION_DEBUG, {
    type: 'WARNING',
    arguments: arguments
  });
}
function logError() {
  if (debugTurnedOn() && consoleErrorExists) {
    // eslint-disable-next-line no-console
    console.error.apply(console, decorateLog(arguments, 'ERROR:'));
  }
  emitEvent(_constants_json__WEBPACK_IMPORTED_MODULE_3__.EVENTS.AUCTION_DEBUG, {
    type: 'ERROR',
    arguments: arguments
  });
}
function prefixLog(prefix) {
  function decorate(fn) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      fn.apply(void 0, [prefix].concat(args));
    };
  }
  return {
    logError: decorate(logError),
    logWarn: decorate(logWarn),
    logMessage: decorate(logMessage),
    logInfo: decorate(logInfo)
  };
}
function decorateLog(args, prefix) {
  args = [].slice.call(args);
  var bidder = _config_js__WEBPACK_IMPORTED_MODULE_4__.config.getCurrentBidder();
  prefix && args.unshift(prefix);
  if (bidder) {
    args.unshift(label('#aaa'));
  }
  args.unshift(label('#3b88c3'));
  args.unshift('%cPrebid' + (bidder ? "%c".concat(bidder) : ''));
  return args;
  function label(color) {
    return "display: inline-block; color: #fff; background: ".concat(color, "; padding: 1px 4px; border-radius: 3px;");
  }
}
function hasConsoleLogger() {
  return consoleLogExists;
}
function debugTurnedOn() {
  return !!_config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('debug');
}
function createInvisibleIframe() {
  var f = document.createElement('iframe');
  f.id = getUniqueIdentifierStr();
  f.height = 0;
  f.width = 0;
  f.border = '0px';
  f.hspace = '0';
  f.vspace = '0';
  f.marginWidth = '0';
  f.marginHeight = '0';
  f.style.border = '0';
  f.scrolling = 'no';
  f.frameBorder = '0';
  f.src = 'about:blank';
  f.style.display = 'none';
  return f;
}

/*
 *   Check if a given parameter name exists in query string
 *   and if it does return the value
 */
function getParameterByName(name) {
  return parseQS(getWindowLocation().search)[name] || '';
}

/**
 * Return if the object is of the
 * given type.
 * @param {*} object to test
 * @param {String} _t type string (e.g., Array)
 * @return {Boolean} if object is of type _t
 */
function isA(object, _t) {
  return toString.call(object) === '[object ' + _t + ']';
}
function isFn(object) {
  return isA(object, tFn);
}
function isStr(object) {
  return isA(object, tStr);
}
function isArray(object) {
  return isA(object, tArr);
}
function isNumber(object) {
  return isA(object, tNumb);
}
function isPlainObject(object) {
  return isA(object, tObject);
}
function isBoolean(object) {
  return isA(object, tBoolean);
}

/**
 * Return if the object is "empty";
 * this includes falsey, no keys, or no items at indices
 * @param {*} object object to test
 * @return {Boolean} if object is empty
 */
function isEmpty(object) {
  if (!object) return true;
  if (isArray(object) || isStr(object)) {
    return !(object.length > 0);
  }
  for (var k in object) {
    if (hasOwnProperty.call(object, k)) return false;
  }
  return true;
}

/**
 * Return if string is empty, null, or undefined
 * @param str string to test
 * @returns {boolean} if string is empty
 */
function isEmptyStr(str) {
  return isStr(str) && (!str || str.length === 0);
}

/**
 * Iterate object with the function
 * falls back to es5 `forEach`
 * @param {Array|Object} object
 * @param {Function(value, key, object)} fn
 */
function _each(object, fn) {
  if (isEmpty(object)) return;
  if (isFn(object.forEach)) return object.forEach(fn, this);
  var k = 0;
  var l = object.length;
  if (l > 0) {
    for (; k < l; k++) {
      fn(object[k], k, object);
    }
  } else {
    for (k in object) {
      if (hasOwnProperty.call(object, k)) fn.call(this, object[k], k);
    }
  }
}
function contains(a, obj) {
  if (isEmpty(a)) {
    return false;
  }
  if (isFn(a.indexOf)) {
    return a.indexOf(obj) !== -1;
  }
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * Map an array or object into another array
 * given a function
 * @param {Array|Object} object
 * @param {Function(value, key, object)} callback
 * @return {Array}
 */
function _map(object, callback) {
  if (isEmpty(object)) return [];
  if (isFn(object.map)) return object.map(callback);
  var output = [];
  _each(object, function (value, key) {
    output.push(callback(value, key, object));
  });
  return output;
}
function hasOwn(objectToCheck, propertyToCheckFor) {
  if (objectToCheck.hasOwnProperty) {
    return objectToCheck.hasOwnProperty(propertyToCheckFor);
  } else {
    return typeof objectToCheck[propertyToCheckFor] !== 'undefined' && objectToCheck.constructor.prototype[propertyToCheckFor] !== objectToCheck[propertyToCheckFor];
  }
}
;

/*
* Inserts an element(elm) as targets child, by default as first child
* @param {HTMLElement} elm
* @param {HTMLElement} [doc]
* @param {HTMLElement} [target]
* @param {Boolean} [asLastChildChild]
* @return {HTML Element}
*/
function insertElement(elm, doc, target, asLastChildChild) {
  doc = doc || document;
  var parentEl;
  if (target) {
    parentEl = doc.getElementsByTagName(target);
  } else {
    parentEl = doc.getElementsByTagName('head');
  }
  try {
    parentEl = parentEl.length ? parentEl : doc.getElementsByTagName('body');
    if (parentEl.length) {
      parentEl = parentEl[0];
      var insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
      return parentEl.insertBefore(elm, insertBeforeEl);
    }
  } catch (e) {}
}

/**
 * Returns a promise that completes when the given element triggers a 'load' or 'error' DOM event, or when
 * `timeout` milliseconds have elapsed.
 *
 * @param {HTMLElement} element
 * @param {Number} [timeout]
 * @returns {Promise}
 */
function waitForElementToLoad(element, timeout) {
  var timer = null;
  return new _utils_promise_js__WEBPACK_IMPORTED_MODULE_5__.GreedyPromise(function (resolve) {
    var onLoad = function onLoad() {
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onLoad);
      if (timer != null) {
        window.clearTimeout(timer);
      }
      resolve();
    };
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onLoad);
    if (timeout != null) {
      timer = window.setTimeout(onLoad, timeout);
    }
  });
}

/**
 * Inserts an image pixel with the specified `url` for cookie sync
 * @param {string} url URL string of the image pixel to load
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the image to load before calling `done`
 */
function triggerPixel(url, done, timeout) {
  var img = new Image();
  if (done && internal.isFn(done)) {
    waitForElementToLoad(img, timeout).then(done);
  }
  img.src = url;
}
function callBurl(_ref) {
  var source = _ref.source,
    burl = _ref.burl;
  if (source === _constants_json__WEBPACK_IMPORTED_MODULE_3__.S2S.SRC && burl) {
    internal.triggerPixel(burl);
  }
}

/**
 * Inserts an empty iframe with the specified `html`, primarily used for tracking purposes
 * (though could be for other purposes)
 * @param {string} htmlCode snippet of HTML code used for tracking purposes
 */
function insertHtmlIntoIframe(htmlCode) {
  if (!htmlCode) {
    return;
  }
  var iframe = document.createElement('iframe');
  iframe.id = getUniqueIdentifierStr();
  iframe.width = 0;
  iframe.height = 0;
  iframe.hspace = '0';
  iframe.vspace = '0';
  iframe.marginWidth = '0';
  iframe.marginHeight = '0';
  iframe.style.display = 'none';
  iframe.style.height = '0px';
  iframe.style.width = '0px';
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  iframe.allowtransparency = 'true';
  internal.insertElement(iframe, document, 'body');
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(htmlCode);
  iframe.contentWindow.document.close();
}

/**
 * Inserts empty iframe with the specified `url` for cookie sync
 * @param  {string} url URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {function} [done] an optional exit callback, used when this usersync pixel is added during an async process
 * @param  {Number} [timeout] an optional timeout in milliseconds for the iframe to load before calling `done`
 */
function insertUserSyncIframe(url, done, timeout) {
  var iframeHtml = internal.createTrackPixelIframeHtml(url, false, 'allow-scripts allow-same-origin');
  var div = document.createElement('div');
  div.innerHTML = iframeHtml;
  var iframe = div.firstChild;
  if (done && internal.isFn(done)) {
    waitForElementToLoad(iframe, timeout).then(done);
  }
  internal.insertElement(iframe, document, 'html', true);
}

/**
 * Creates a snippet of HTML that retrieves the specified `url`
 * @param  {string} url URL to be requested
 * @return {string}     HTML snippet that contains the img src = set to `url`
 */
function createTrackPixelHtml(url) {
  if (!url) {
    return '';
  }
  var escapedUrl = encodeURI(url);
  var img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
}
;

/**
 * Creates a snippet of Iframe HTML that retrieves the specified `url`
 * @param  {string} url plain URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {string} sandbox string if provided the sandbox attribute will be included with the given value
 * @return {string}     HTML snippet that contains the iframe src = set to `url`
 */
function createTrackPixelIframeHtml(url) {
  var encodeUri = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var sandbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (!url) {
    return '';
  }
  if (encodeUri) {
    url = encodeURI(url);
  }
  if (sandbox) {
    sandbox = "sandbox=\"".concat(sandbox, "\"");
  }
  return "<iframe ".concat(sandbox, " id=\"").concat(getUniqueIdentifierStr(), "\"\n      frameborder=\"0\"\n      allowtransparency=\"true\"\n      marginheight=\"0\" marginwidth=\"0\"\n      width=\"0\" hspace=\"0\" vspace=\"0\" height=\"0\"\n      style=\"height:0px;width:0px;display:none;\"\n      scrolling=\"no\"\n      src=\"").concat(url, "\">\n    </iframe>");
}
function getValueString(param, val, defaultValue) {
  if (val === undefined || val === null) {
    return defaultValue;
  }
  if (isStr(val)) {
    return val;
  }
  if (isNumber(val)) {
    return val.toString();
  }
  internal.logWarn('Unsuported type for param: ' + param + ' required type: String');
}
function uniques(value, index, arry) {
  return arry.indexOf(value) === index;
}
function flatten(a, b) {
  return a.concat(b);
}
function getBidRequest(id, bidderRequests) {
  if (!id) {
    return;
  }
  var bidRequest;
  bidderRequests.some(function (bidderRequest) {
    var result = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.find)(bidderRequest.bids, function (bid) {
      return ['bidId', 'adId', 'bid_id'].some(function (type) {
        return bid[type] === id;
      });
    });
    if (result) {
      bidRequest = result;
    }
    return result;
  });
  return bidRequest;
}
function getKeys(obj) {
  return Object.keys(obj);
}
function getValue(obj, key) {
  return obj[key];
}

/**
 * Get the key of an object for a given value
 */
function getKeyByValue(obj, value) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] === value) {
        return prop;
      }
    }
  }
}
function getBidderCodes() {
  var adUnits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pbjsInstance.adUnits;
  // this could memoize adUnits
  return adUnits.map(function (unit) {
    return unit.bids.map(function (bid) {
      return bid.bidder;
    }).reduce(flatten, []);
  }).reduce(flatten, []).filter(function (bidder) {
    return typeof bidder !== 'undefined';
  }).filter(uniques);
}
function isGptPubadsDefined() {
  if (window.googletag && isFn(window.googletag.pubads) && isFn(window.googletag.pubads().getSlots)) {
    return true;
  }
}
function isApnGetTagDefined() {
  if (window.apntag && isFn(window.apntag.getTag)) {
    return true;
  }
}

// This function will get highest cpm value bid, in case of tie it will return the bid with lowest timeToRespond
var getHighestCpm = getHighestCpmCallback('timeToRespond', function (previous, current) {
  return previous > current;
});

// This function will get the oldest hightest cpm value bid, in case of tie it will return the bid which came in first
// Use case for tie: https://github.com/prebid/Prebid.js/issues/2448
var getOldestHighestCpmBid = getHighestCpmCallback('responseTimestamp', function (previous, current) {
  return previous > current;
});

// This function will get the latest hightest cpm value bid, in case of tie it will return the bid which came in last
// Use case for tie: https://github.com/prebid/Prebid.js/issues/2539
var getLatestHighestCpmBid = getHighestCpmCallback('responseTimestamp', function (previous, current) {
  return previous < current;
});
function getHighestCpmCallback(useTieBreakerProperty, tieBreakerCallback) {
  return function (previous, current) {
    if (previous.cpm === current.cpm) {
      return tieBreakerCallback(previous[useTieBreakerProperty], current[useTieBreakerProperty]) ? current : previous;
    }
    return previous.cpm < current.cpm ? current : previous;
  };
}

/**
 * Fisher–Yates shuffle
 * http://stackoverflow.com/a/6274398
 * https://bost.ocks.org/mike/shuffle/
 * istanbul ignore next
 */
function shuffle(array) {
  var counter = array.length;

  // while there are elements in the array
  while (counter > 0) {
    // pick a random index
    var index = Math.floor(Math.random() * counter);

    // decrease counter by 1
    counter--;

    // and swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function adUnitsFilter(filter, bid) {
  return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.includes)(filter, bid && bid.adUnitCode);
}
function deepClone(obj) {
  return just_clone__WEBPACK_IMPORTED_MODULE_0___default()(obj);
}
function inIframe() {
  try {
    return internal.getWindowSelf() !== internal.getWindowTop();
  } catch (e) {
    return true;
  }
}
function isSafariBrowser() {
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function replaceAuctionPrice(str, cpm) {
  if (!str) return;
  return str.replace(/\$\{AUCTION_PRICE\}/g, cpm);
}
function replaceClickThrough(str, clicktag) {
  if (!str || !clicktag || typeof clicktag !== 'string') return;
  return str.replace(/\${CLICKTHROUGH}/g, clicktag);
}
function timestamp() {
  return new Date().getTime();
}

/**
 * The returned value represents the time elapsed since the time origin. @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 * @returns {number}
 */
function getPerformanceNow() {
  return window.performance && window.performance.now && window.performance.now() || 0;
}

/**
 * When the deviceAccess flag config option is false, no cookies should be read or set
 * @returns {boolean}
 */
function hasDeviceAccess() {
  return _config_js__WEBPACK_IMPORTED_MODULE_4__.config.getConfig('deviceAccess') !== false;
}

/**
 * @returns {(boolean|undefined)}
 */
function checkCookieSupport() {
  if (window.navigator.cookieEnabled || !!document.cookie.length) {
    return true;
  }
}

/**
 * Given a function, return a function which only executes the original after
 * it's been called numRequiredCalls times.
 *
 * Note that the arguments from the previous calls will *not* be forwarded to the original function.
 * Only the final call's arguments matter.
 *
 * @param {function} func The function which should be executed, once the returned function has been executed
 *   numRequiredCalls times.
 * @param {int} numRequiredCalls The number of times which the returned function needs to be called before
 *   func is.
 */
function delayExecution(func, numRequiredCalls) {
  if (numRequiredCalls < 1) {
    throw new Error("numRequiredCalls must be a positive number. Got ".concat(numRequiredCalls));
  }
  var numCalls = 0;
  return function () {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(this, arguments);
    }
  };
}

/**
 * https://stackoverflow.com/a/34890276/428704
 * @export
 * @param {array} xs
 * @param {string} key
 * @returns {Object} {${key_value}: ${groupByArray}, key_value: {groupByArray}}
 */
function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * Build an object consisting of only defined parameters to avoid creating an
 * object with defined keys and undefined values.
 * @param {Object} object The object to pick defined params out of
 * @param {string[]} params An array of strings representing properties to look for in the object
 * @returns {Object} An object containing all the specified values that are defined
 */
function getDefinedParams(object, params) {
  return params.filter(function (param) {
    return object[param];
  }).reduce(function (bid, param) {
    return Object.assign(bid, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, param, object[param]));
  }, {});
}

/**
 * @typedef {Object} MediaTypes
 * @property {Object} banner banner configuration
 * @property {Object} native native configuration
 * @property {Object} video video configuration
 */

/**
 * Validates an adunit's `mediaTypes` parameter
 * @param {MediaTypes} mediaTypes mediaTypes parameter to validate
 * @return {boolean} If object is valid
 */
function isValidMediaTypes(mediaTypes) {
  var SUPPORTED_MEDIA_TYPES = ['banner', 'native', 'video'];
  var SUPPORTED_STREAM_TYPES = ['instream', 'outstream', 'adpod'];
  var types = Object.keys(mediaTypes);
  if (!types.every(function (type) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.includes)(SUPPORTED_MEDIA_TYPES, type);
  })) {
    return false;
  }
  if ( true && mediaTypes.video && mediaTypes.video.context) {
    return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.includes)(SUPPORTED_STREAM_TYPES, mediaTypes.video.context);
  }
  return true;
}

/**
 * Returns user configured bidder params from adunit
 * @param {Object} adUnits
 * @param {string} adUnitCode code
 * @param {string} bidder code
 * @return {Array} user configured param for the given bidder adunit configuration
 */
function getUserConfiguredParams(adUnits, adUnitCode, bidder) {
  return adUnits.filter(function (adUnit) {
    return adUnit.code === adUnitCode;
  }).map(function (adUnit) {
    return adUnit.bids;
  }).reduce(flatten, []).filter(function (bidderData) {
    return bidderData.bidder === bidder;
  }).map(function (bidderData) {
    return bidderData.params || {};
  });
}

/**
 * Returns Do Not Track state
 */
function getDNT() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.doNotTrack === 'yes';
}
var compareCodeAndSlot = function compareCodeAndSlot(slot, adUnitCode) {
  return slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;
};

/**
 * Returns filter function to match adUnitCode in slot
 * @param {Object} slot GoogleTag slot
 * @return {function} filter function
 */
function isAdUnitCodeMatchingSlot(slot) {
  return function (adUnitCode) {
    return compareCodeAndSlot(slot, adUnitCode);
  };
}

/**
 * Returns filter function to match adUnitCode in slot
 * @param {string} adUnitCode AdUnit code
 * @return {function} filter function
 */
function isSlotMatchingAdUnitCode(adUnitCode) {
  return function (slot) {
    return compareCodeAndSlot(slot, adUnitCode);
  };
}

/**
 * @summary Uses the adUnit's code in order to find a matching gpt slot object on the page
 */
function getGptSlotForAdUnitCode(adUnitCode) {
  var matchingSlot;
  if (isGptPubadsDefined()) {
    // find the first matching gpt slot on the page
    matchingSlot = (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.find)(window.googletag.pubads().getSlots(), isSlotMatchingAdUnitCode(adUnitCode));
  }
  return matchingSlot;
}
;

/**
 * @summary Uses the adUnit's code in order to find a matching gptSlot on the page
 */
function getGptSlotInfoForAdUnitCode(adUnitCode) {
  var matchingSlot = getGptSlotForAdUnitCode(adUnitCode);
  if (matchingSlot) {
    return {
      gptSlot: matchingSlot.getAdUnitPath(),
      divId: matchingSlot.getSlotElementId()
    };
  }
  return {};
}
;

/**
 * Constructs warning message for when unsupported bidders are dropped from an adunit
 * @param {Object} adUnit ad unit from which the bidder is being dropped
 * @param {string} bidder bidder code that is not compatible with the adUnit
 * @return {string} warning message to display when condition is met
 */
function unsupportedBidderMessage(adUnit, bidder) {
  var mediaType = Object.keys(adUnit.mediaTypes || {
    'banner': 'banner'
  }).join(', ');
  return "\n    ".concat(adUnit.code, " is a ").concat(mediaType, " ad unit\n    containing bidders that don't support ").concat(mediaType, ": ").concat(bidder, ".\n    This bidder won't fetch demand.\n  ");
}

/**
 * Checks input is integer or not
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value
 */
function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
}

/**
 * Converts a string value in camel-case to underscore eg 'placementId' becomes 'placement_id'
 * @param {string} value string value to convert
 */
function convertCamelToUnderscore(value) {
  return value.replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
    return '_' + y.toLowerCase();
  }).replace(/^_/, '');
}

/**
 * Returns a new object with undefined properties removed from given object
 * @param obj the object to clean
 */
function cleanObj(obj) {
  return Object.keys(obj).reduce(function (newObj, key) {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}

/**
 * Create a new object with selected properties.  Also allows property renaming and transform functions.
 * @param obj the original object
 * @param properties An array of desired properties
 */
function pick(obj, properties) {
  if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj) !== 'object') {
    return {};
  }
  return properties.reduce(function (newObj, prop, i) {
    if (typeof prop === 'function') {
      return newObj;
    }
    var newProp = prop;
    var match = prop.match(/^(.+?)\sas\s(.+?)$/i);
    if (match) {
      prop = match[1];
      newProp = match[2];
    }
    var value = obj[prop];
    if (typeof properties[i + 1] === 'function') {
      value = properties[i + 1](value, newObj);
    }
    if (typeof value !== 'undefined') {
      newObj[newProp] = value;
    }
    return newObj;
  }, {});
}

/**
 * Converts an object of arrays (either strings or numbers) into an array of objects containing key and value properties
 * normally read from bidder params
 * eg { foo: ['bar', 'baz'], fizz: ['buzz'] }
 * becomes [{ key: 'foo', value: ['bar', 'baz']}, {key: 'fizz', value: ['buzz']}]
 * @param {Object} keywords object of arrays representing keyvalue pairs
 * @param {string} paramName name of parent object (eg 'keywords') containing keyword data, used in error handling
 */
function transformBidderParamKeywords(keywords) {
  var paramName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'keywords';
  var arrs = [];
  _each(keywords, function (v, k) {
    if (isArray(v)) {
      var values = [];
      _each(v, function (val) {
        val = getValueString(paramName + '.' + k, val);
        if (val || val === '') {
          values.push(val);
        }
      });
      v = values;
    } else {
      v = getValueString(paramName + '.' + k, v);
      if (isStr(v)) {
        v = [v];
      } else {
        return;
      } // unsuported types - don't send a key
    }

    arrs.push({
      key: k,
      value: v
    });
  });
  return arrs;
}

/**
 * Try to convert a value to a type.
 * If it can't be done, the value will be returned.
 *
 * @param {string} typeToConvert The target type. e.g. "string", "number", etc.
 * @param {*} value The value to be converted into typeToConvert.
 */
function tryConvertType(typeToConvert, value) {
  if (typeToConvert === 'string') {
    return value && value.toString();
  } else if (typeToConvert === 'number') {
    return Number(value);
  } else {
    return value;
  }
}
function convertTypes(types, params) {
  Object.keys(types).forEach(function (key) {
    if (params[key]) {
      if (isFn(types[key])) {
        params[key] = types[key](params[key]);
      } else {
        params[key] = tryConvertType(types[key], params[key]);
      }

      // don't send invalid values
      if (isNaN(params[key])) {
        delete params.key;
      }
    }
  });
  return params;
}
function isArrayOfNums(val, size) {
  return isArray(val) && (size ? val.length === size : true) && val.every(function (v) {
    return isInteger(v);
  });
}

/**
 * Creates an array of n length and fills each item with the given value
 */
function fill(value, length) {
  var newArray = [];
  for (var i = 0; i < length; i++) {
    var valueToPush = isPlainObject(value) ? deepClone(value) : value;
    newArray.push(valueToPush);
  }
  return newArray;
}

/**
 * http://npm.im/chunk
 * Returns an array with *size* chunks from given array
 *
 * Example:
 * ['a', 'b', 'c', 'd', 'e'] chunked by 2 =>
 * [['a', 'b'], ['c', 'd'], ['e']]
 */
function chunk(array, size) {
  var newArray = [];
  for (var i = 0; i < Math.ceil(array.length / size); i++) {
    var start = i * size;
    var end = start + size;
    newArray.push(array.slice(start, end));
  }
  return newArray;
}
function getMinValueFromArray(array) {
  return Math.min.apply(Math, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__["default"])(array));
}
function getMaxValueFromArray(array) {
  return Math.max.apply(Math, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__["default"])(array));
}

/**
 * This function will create compare function to sort on object property
 * @param {string} property
 * @returns {function} compare function to be used in sorting
 */
function compareOn(property) {
  return function compare(a, b) {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    return 0;
  };
}
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, '').split('&').reduce(function (acc, criteria) {
    var _criteria$split = criteria.split('='),
      _criteria$split2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_9__["default"])(_criteria$split, 2),
      k = _criteria$split2[0],
      v = _criteria$split2[1];
    if (/\[\]$/.test(k)) {
      k = k.replace('[]', '');
      acc[k] = acc[k] || [];
      acc[k].push(v);
    } else {
      acc[k] = v || '';
    }
    return acc;
  }, {});
}
function formatQS(query) {
  return Object.keys(query).map(function (k) {
    return Array.isArray(query[k]) ? query[k].map(function (v) {
      return "".concat(k, "[]=").concat(v);
    }).join('&') : "".concat(k, "=").concat(query[k]);
  }).join('&');
}
function parseUrl(url, options) {
  var parsed = document.createElement('a');
  if (options && 'noDecodeWholeURL' in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  // in window.location 'search' is string, not object
  var qsAsString = options && 'decodeSearchAsString' in options && options.decodeSearchAsString;
  return {
    href: parsed.href,
    protocol: (parsed.protocol || '').replace(/:$/, ''),
    hostname: parsed.hostname,
    port: +parsed.port,
    pathname: parsed.pathname.replace(/^(?!\/)/, '/'),
    search: qsAsString ? parsed.search : internal.parseQS(parsed.search || ''),
    hash: (parsed.hash || '').replace(/^#/, ''),
    host: parsed.host || window.location.host
  };
}
function buildUrl(obj) {
  return (obj.protocol || 'http') + '://' + (obj.host || obj.hostname + (obj.port ? ":".concat(obj.port) : '')) + (obj.pathname || '') + (obj.search ? "?".concat(internal.formatQS(obj.search || '')) : '') + (obj.hash ? "#".concat(obj.hash) : '');
}

/**
 * This function deeply compares two objects checking for their equivalence.
 * @param {Object} obj1
 * @param {Object} obj2
 * @param checkTypes {boolean} if set, two objects with identical properties but different constructors will *not*
 * be considered equivalent.
 * @returns {boolean}
 */
function deepEqual(obj1, obj2) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$checkTypes = _ref2.checkTypes,
    checkTypes = _ref2$checkTypes === void 0 ? false : _ref2$checkTypes;
  if (obj1 === obj2) return true;else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj1) === 'object' && obj1 !== null && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__["default"])(obj2) === 'object' && obj2 !== null && (!checkTypes || obj1.constructor === obj2.constructor)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    for (var prop in obj1) {
      if (obj2.hasOwnProperty(prop)) {
        if (!deepEqual(obj1[prop], obj2[prop], {
          checkTypes: checkTypes
        })) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
function mergeDeep(target) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }
  if (!sources.length) return target;
  var source = sources.shift();
  if (isPlainObject(target) && isPlainObject(source)) {
    var _loop = function _loop(key) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, {}));
        mergeDeep(target[key], source[key]);
      } else if (isArray(source[key])) {
        if (!target[key]) {
          Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_8__["default"])(source[key])));
        } else if (isArray(target[key])) {
          source[key].forEach(function (obj) {
            var addItFlag = 1;
            for (var i = 0; i < target[key].length; i++) {
              if (deepEqual(target[key][i], obj)) {
                addItFlag = 0;
                break;
              }
            }
            if (addItFlag) {
              target[key].push(obj);
            }
          });
        }
      } else {
        Object.assign(target, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])({}, key, source[key]));
      }
    };
    for (var key in source) {
      _loop(key);
    }
  }
  return mergeDeep.apply(void 0, [target].concat(sources));
}

/**
 * returns a hash of a string using a fast algorithm
 * source: https://stackoverflow.com/a/52171480/845390
 * @param str
 * @param seed (optional)
 * @returns {string}
 */
function cyrb53Hash(str) {
  var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // IE doesn't support imul
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill
  var imul = function imul(opA, opB) {
    if (isFn(Math.imul)) {
      return Math.imul(opA, opB);
    } else {
      opB |= 0; // ensure that opB is an integer. opA will automatically be coerced.
      // floating points give us 53 bits of precision to work with plus 1 sign bit
      // automatically handled for our convienence:
      // 1. 0x003fffff /*opA & 0x000fffff*/ * 0x7fffffff /*opB*/ = 0x1fffff7fc00001
      //    0x1fffff7fc00001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      var result = (opA & 0x003fffff) * opB;
      // 2. We can remove an integer coersion from the statement above because:
      //    0x1fffff7fc00001 + 0xffc00000 = 0x1fffffff800001
      //    0x1fffffff800001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
      if (opA & 0xffc00000) result += (opA & 0xffc00000) * opB | 0;
      return result | 0;
    }
  };
  var h1 = 0xdeadbeef ^ seed;
  var h2 = 0x41c6ce57 ^ seed;
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = imul(h1 ^ ch, 2654435761);
    h2 = imul(h2 ^ ch, 1597334677);
  }
  h1 = imul(h1 ^ h1 >>> 16, 2246822507) ^ imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = imul(h2 ^ h2 >>> 16, 2246822507) ^ imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
}

/**
 * returns a window object, which holds the provided document or null
 * @param {Document} doc
 * @returns {Window}
 */
function getWindowFromDocument(doc) {
  return doc ? doc.defaultView : null;
}

/**
 * returns the result of `JSON.parse(data)`, or undefined if that throws an error.
 * @param data
 * @returns {any}
 */
function safeJSONParse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {}
}

/**
 * Returns a memoized version of `fn`.
 *
 * @param fn
 * @param key cache key generator, invoked with the same arguments passed to `fn`.
 *        By default, the first argument is used as key.
 * @return {function(): any}
 */
function memoize(fn) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (arg) {
    return arg;
  };
  var cache = new Map();
  var memoized = function memoized() {
    var cacheKey = key.apply(this, arguments);
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, fn.apply(this, arguments));
    }
    return cache.get(cacheKey);
  };
  memoized.clear = cache.clear.bind(cache);
  return memoized;
}

/**
 * Sets dataset attributes on a script
 * @param {Script} script
 * @param {object} attributes
 */
function setScriptAttributes(script, attributes) {
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      script.setAttribute(key, attributes[key]);
    }
  }
}

/**
 * Encode a string for inclusion in HTML.
 * See https://pragmaticwebsecurity.com/articles/spasecurity/json-stringify-xss.html and
 * https://codeql.github.com/codeql-query-help/javascript/js-bad-code-sanitization/
 * @return {string}
 */
var escapeUnsafeChars = function () {
  var escapes = {
    '<': "\\u003C",
    '>': "\\u003E",
    '/': "\\u002F",
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return function (str) {
    return str.replace(/[<>\b\f\n\r\t\0\u2028\u2029\\]/g, function (x) {
      return escapes[x];
    });
  };
}();

/***/ }),

/***/ "./src/utils/cpm.js":
/*!**************************!*\
  !*** ./src/utils/cpm.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adjustCpm": function() { return /* binding */ adjustCpm; }
/* harmony export */ });
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../bidderSettings.js */ "./src/bidderSettings.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");



function adjustCpm(cpm, bidResponse, bidRequest) {
  var _bidRequest;
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
    _ref$index = _ref.index,
    index = _ref$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__.auctionManager.index : _ref$index,
    _ref$bs = _ref.bs,
    bs = _ref$bs === void 0 ? _bidderSettings_js__WEBPACK_IMPORTED_MODULE_1__.bidderSettings : _ref$bs;
  bidRequest = bidRequest || index.getBidRequest(bidResponse);
  var adapterCode = bidResponse === null || bidResponse === void 0 ? void 0 : bidResponse.adapterCode;
  var bidderCode = (bidResponse === null || bidResponse === void 0 ? void 0 : bidResponse.bidderCode) || ((_bidRequest = bidRequest) === null || _bidRequest === void 0 ? void 0 : _bidRequest.bidder);
  var adjustAlternateBids = bs.get(bidResponse === null || bidResponse === void 0 ? void 0 : bidResponse.adapterCode, 'adjustAlternateBids');
  var bidCpmAdjustment = bs.getOwn(bidderCode, 'bidCpmAdjustment') || bs.get(adjustAlternateBids ? adapterCode : bidderCode, 'bidCpmAdjustment');
  if (bidCpmAdjustment && typeof bidCpmAdjustment === 'function') {
    try {
      return bidCpmAdjustment(cpm, Object.assign({}, bidResponse), bidRequest);
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)('Error during bid adjustment', e);
    }
  }
  return cpm;
}

/***/ }),

/***/ "./src/utils/perfMetrics.js":
/*!**********************************!*\
  !*** ./src/utils/perfMetrics.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newMetrics": function() { return /* binding */ newMetrics; },
/* harmony export */   "timedAuctionHook": function() { return /* binding */ timedAuctionHook; },
/* harmony export */   "useMetrics": function() { return /* binding */ useMetrics; }
/* harmony export */ });
/* unused harmony exports CONFIG_TOGGLE, metricsFactory, hookTimer, timedBidResponseHook */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CONFIG_TOGGLE = 'performanceMetrics';
var getTime = window.performance && window.performance.now ? function () {
  return window.performance.now();
} : function () {
  return Date.now();
};
var NODES = new WeakMap();
function metricsFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$now = _ref.now,
    now = _ref$now === void 0 ? getTime : _ref$now,
    _ref$mkNode = _ref.mkNode,
    mkNode = _ref$mkNode === void 0 ? makeNode : _ref$mkNode,
    _ref$mkTimer = _ref.mkTimer,
    mkTimer = _ref$mkTimer === void 0 ? makeTimer : _ref$mkTimer,
    _ref$mkRenamer = _ref.mkRenamer,
    mkRenamer = _ref$mkRenamer === void 0 ? function (rename) {
      return rename;
    } : _ref$mkRenamer,
    _ref$nodes = _ref.nodes,
    nodes = _ref$nodes === void 0 ? NODES : _ref$nodes;
  return function newMetrics() {
    function makeMetrics(self) {
      var rename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (n) {
        return {
          forEach: function forEach(fn) {
            fn(n);
          }
        };
      };
      rename = mkRenamer(rename);
      function accessor(slot) {
        return function (name) {
          return self.dfWalk({
            visit: function visit(edge, node) {
              var obj = node[slot];
              if (obj.hasOwnProperty(name)) {
                return obj[name];
              }
            }
          });
        };
      }
      var getTimestamp = accessor('timestamps');

      /**
       * Register a metric.
       *
       * @param name metric name
       * @param value metric valiue
       */
      function setMetric(name, value) {
        var names = rename(name);
        self.dfWalk({
          follow: function follow(inEdge, outEdge) {
            return outEdge.propagate && (!inEdge || !inEdge.stopPropagation);
          },
          visit: function visit(edge, node) {
            names.forEach(function (name) {
              if (edge == null) {
                node.metrics[name] = value;
              } else {
                if (!node.groups.hasOwnProperty(name)) {
                  node.groups[name] = [];
                }
                node.groups[name].push(value);
              }
            });
          }
        });
      }

      /**
       * Mark the current time as a checkpoint with the given name, to be referenced later
       * by `timeSince` or `timeBetween`.
       *
       * @param name checkpoint name
       */
      function checkpoint(name) {
        self.timestamps[name] = now();
      }

      /**
       * Get the tame passed since `checkpoint`, and optionally save it as a metric.
       *
       * @param checkpoint checkpoint name
       * @param metric? metric name
       * @return {number} time between now and `checkpoint`
       */
      function timeSince(checkpoint, metric) {
        var ts = getTimestamp(checkpoint);
        var elapsed = ts != null ? now() - ts : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }

      /**
       * Get the time passed between `startCheckpoint` and `endCheckpoint`, optionally saving it as a metric.
       *
       * @param startCheckpoint begin checkpoint
       * @param endCheckpoint end checkpoint
       * @param metric? metric name
       * @return {number} time passed between `startCheckpoint` and `endCheckpoint`
       */
      function timeBetween(startCheckpoint, endCheckpoint, metric) {
        var start = getTimestamp(startCheckpoint);
        var end = getTimestamp(endCheckpoint);
        var elapsed = start != null && end != null ? end - start : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }

      /**
       * A function that, when called, stops a time measure and saves it as a metric.
       *
       * @typedef {function(): void} MetricsTimer
       * @template {function} F
       * @property {function(F): F} stopBefore returns a wrapper around the given function that begins by
       *   stopping this time measure.
       * @property {function(F): F} stopAfter returns a wrapper around the given function that ends by
       *   stopping this time measure.
       */

      /**
       * Start measuring a time metric with the given name.
       *
       * @param name metric name
       * @return {MetricsTimer}
       */
      function startTiming(name) {
        return mkTimer(now, function (val) {
          return setMetric(name, val);
        });
      }

      /**
       * Run fn and measure the time spent in it.
       *
       * @template T
       * @param name the name to use for the measured time metric
       * @param {function(): T} fn
       * @return {T} the return value of `fn`
       */
      function measureTime(name, fn) {
        return startTiming(name).stopAfter(fn)();
      }

      /**
       * @typedef {function: T} HookFn
       * @property {function(T): void} bail
       *
       * @template T
       * @typedef {T: HookFn} TimedHookFn
       * @property {function(): void} stopTiming
       * @property {T} untimed
       */

      /**
       * Convenience method for measuring time spent in a `.before` or `.after` hook.
       *
       * @template T
       * @param name metric name
       * @param {HookFn} next the hook's `next` (first) argument
       * @param {function(TimedHookFn): T} fn a function that will be run immediately; it takes `next`,
       *    where both `next` and `next.bail` automatically
       *    call `stopTiming` before continuing with the original hook.
       * @return {T} fn's return value
       */
      function measureHookTime(name, next, fn) {
        var stopTiming = startTiming(name);
        return fn(function (orig) {
          var next = stopTiming.stopBefore(orig);
          next.bail = orig.bail && stopTiming.stopBefore(orig.bail);
          next.stopTiming = stopTiming;
          next.untimed = orig;
          return next;
        }(next));
      }

      /**
       * Get all registered metrics.
       * @return {{}}
       */
      function getMetrics() {
        var result = {};
        self.dfWalk({
          visit: function visit(edge, node) {
            result = Object.assign({}, !edge || edge.includeGroups ? node.groups : null, node.metrics, result);
          }
        });
        return result;
      }

      /**
       * Create and return a new metrics object that starts as a view on all metrics registered here,
       * and - by default - also propagates all new metrics here.
       *
       * Propagated metrics are grouped together, and intended for repeated operations. For example, with the following:
       *
       * ```
       * const metrics = newMetrics();
       * const requests = metrics.measureTime('buildRequests', buildRequests)
       * requests.forEach((req) => {
       *   const requestMetrics = metrics.fork();
       *   requestMetrics.measureTime('processRequest', () => processRequest(req);
       * })
       * ```
       *
       * if `buildRequests` takes 10ms and returns 3 objects, which respectively take 100, 200, and 300ms in `processRequest`, then
       * the final `metrics.getMetrics()` would be:
       *
       * ```
       * {
       *    buildRequests: 10,
       *    processRequest: [100, 200, 300]
       * }
       * ```
       *
       * while the inner `requestMetrics.getMetrics()` would be:
       *
       * ```
       * {
       *   buildRequests: 10,
       *   processRequest: 100 // or 200 for the 2nd loop, etc
       * }
       * ```
       *
       *
       * @param propagate if false, the forked metrics will not be propagated here
       * @param stopPropagation if true, propagation from the new metrics is stopped here - instead of
       *   continuing up the chain (if for example these metrics were themselves created through `.fork()`)
       * @param includeGroups if true, the forked metrics will also replicate metrics that were propagated
       *   here from elsewhere. For example:
       *   ```
       *   const metrics = newMetrics();
       *   const op1 = metrics.fork();
       *   const withoutGroups = metrics.fork();
       *   const withGroups = metrics.fork({includeGroups: true});
       *   op1.setMetric('foo', 'bar');
       *   withoutGroups.getMetrics() // {}
       *   withGroups.getMetrics() // {foo: ['bar']}
       *   ```
       */
      function fork() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$propagate = _ref2.propagate,
          propagate = _ref2$propagate === void 0 ? true : _ref2$propagate,
          _ref2$stopPropagation = _ref2.stopPropagation,
          stopPropagation = _ref2$stopPropagation === void 0 ? false : _ref2$stopPropagation,
          _ref2$includeGroups = _ref2.includeGroups,
          includeGroups = _ref2$includeGroups === void 0 ? false : _ref2$includeGroups;
        return makeMetrics(mkNode([[self, {
          propagate: propagate,
          stopPropagation: stopPropagation,
          includeGroups: includeGroups
        }]]), rename);
      }

      /**
       * Join `otherMetrics` with these; all metrics from `otherMetrics` will (by default) be propagated here,
       * and all metrics from here will be included in `otherMetrics`.
       *
       * `propagate`, `stopPropagation` and `includeGroups` have the same semantics as in `.fork()`.
       */
      function join(otherMetrics) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$propagate = _ref3.propagate,
          propagate = _ref3$propagate === void 0 ? true : _ref3$propagate,
          _ref3$stopPropagation = _ref3.stopPropagation,
          stopPropagation = _ref3$stopPropagation === void 0 ? false : _ref3$stopPropagation,
          _ref3$includeGroups = _ref3.includeGroups,
          includeGroups = _ref3$includeGroups === void 0 ? false : _ref3$includeGroups;
        var other = nodes.get(otherMetrics);
        if (other != null) {
          other.addParent(self, {
            propagate: propagate,
            stopPropagation: stopPropagation,
            includeGroups: includeGroups
          });
        }
      }

      /**
       * return a version of these metrics where all new metrics are renamed according to `renameFn`.
       *
       * @param {function(String): Array[String]} renameFn
       */
      function renameWith(renameFn) {
        return makeMetrics(self, renameFn);
      }

      /**
       * Create a new metrics object that uses the same propagation and renaming rules as this one.
       */
      function newMetrics() {
        return makeMetrics(self.newSibling(), rename);
      }
      var metrics = {
        startTiming: startTiming,
        measureTime: measureTime,
        measureHookTime: measureHookTime,
        checkpoint: checkpoint,
        timeSince: timeSince,
        timeBetween: timeBetween,
        setMetric: setMetric,
        getMetrics: getMetrics,
        fork: fork,
        join: join,
        newMetrics: newMetrics,
        renameWith: renameWith,
        toJSON: function toJSON() {
          return getMetrics();
        }
      };
      nodes.set(metrics, self);
      return metrics;
    }
    return makeMetrics(mkNode([]));
  };
}
function wrapFn(fn, before, after) {
  return function () {
    before && before();
    try {
      return fn.apply(this, arguments);
    } finally {
      after && after();
    }
  };
}
function makeTimer(now, cb) {
  var start = now();
  var done = false;
  function stopTiming() {
    if (!done) {
      // eslint-disable-next-line standard/no-callback-literal
      cb(now() - start);
      done = true;
    }
  }
  stopTiming.stopBefore = function (fn) {
    return wrapFn(fn, stopTiming);
  };
  stopTiming.stopAfter = function (fn) {
    return wrapFn(fn, null, stopTiming);
  };
  return stopTiming;
}
function makeNode(parents) {
  return {
    metrics: {},
    timestamps: {},
    groups: {},
    addParent: function addParent(node, edge) {
      parents.push([node, edge]);
    },
    newSibling: function newSibling() {
      return makeNode(parents.slice());
    },
    dfWalk: function dfWalk() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        visit = _ref4.visit,
        _ref4$follow = _ref4.follow,
        follow = _ref4$follow === void 0 ? function () {
          return true;
        } : _ref4$follow,
        _ref4$visited = _ref4.visited,
        visited = _ref4$visited === void 0 ? new Set() : _ref4$visited,
        inEdge = _ref4.inEdge;
      var res;
      if (!visited.has(this)) {
        visited.add(this);
        res = visit(inEdge, this);
        if (res != null) return res;
        var _iterator = _createForOfIteratorHelper(parents),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_step.value, 2),
              parent = _step$value[0],
              outEdge = _step$value[1];
            if (follow(inEdge, outEdge)) {
              res = parent.dfWalk({
                visit: visit,
                follow: follow,
                visited: visited,
                inEdge: outEdge
              });
              if (res != null) return res;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  };
}
var nullMetrics = function () {
  var nop = function nop() {};
  var empty = function empty() {
    return {};
  };
  var none = {
    forEach: nop
  };
  var nullTimer = function nullTimer() {
    return null;
  };
  nullTimer.stopBefore = function (fn) {
    return fn;
  };
  nullTimer.stopAfter = function (fn) {
    return fn;
  };
  var nullNode = Object.defineProperties({
    dfWalk: nop,
    newSibling: function newSibling() {
      return nullNode;
    },
    addParent: nop
  }, Object.fromEntries(['metrics', 'timestamps', 'groups'].map(function (prop) {
    return [prop, {
      get: empty
    }];
  })));
  return metricsFactory({
    now: function now() {
      return 0;
    },
    mkNode: function mkNode() {
      return nullNode;
    },
    mkRenamer: function mkRenamer() {
      return function () {
        return none;
      };
    },
    mkTimer: function mkTimer() {
      return nullTimer;
    },
    nodes: {
      get: nop,
      set: nop
    }
  })();
}();
var enabled = true;
_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig(CONFIG_TOGGLE, function (cfg) {
  enabled = !!cfg[CONFIG_TOGGLE];
});

/**
 * convenience fallback function for metrics that may be undefined, especially during tests.
 */
function useMetrics(metrics) {
  return enabled && metrics || nullMetrics;
}
var newMetrics = function () {
  var makeMetrics = metricsFactory();
  return function () {
    return enabled ? makeMetrics() : nullMetrics;
  };
}();
function hookTimer(prefix, getMetrics) {
  return function (name, hookFn) {
    return function (next) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var that = this;
      return useMetrics(getMetrics.apply(that, args)).measureHookTime(prefix + name, next, function (next) {
        return hookFn.call.apply(hookFn, [that, next].concat(args));
      });
    };
  };
}
var timedAuctionHook = hookTimer('requestBids.', function (req) {
  return req.metrics;
});
var timedBidResponseHook = hookTimer('addBidResponse.', function (_, bid) {
  return bid.metrics;
});

/***/ }),

/***/ "./src/utils/promise.js":
/*!******************************!*\
  !*** ./src/utils/promise.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GreedyPromise": function() { return /* binding */ GreedyPromise; },
/* harmony export */   "defer": function() { return /* binding */ defer; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldGet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js");
/* harmony import */ var _babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldSet */ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js");





function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }
function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }
var SUCCESS = 0;
var FAIL = 1;

/**
 * A version of Promise that runs callbacks synchronously when it can (i.e. after it's been fulfilled or rejected).
 */
var _result = /*#__PURE__*/new WeakMap();
var _callbacks = /*#__PURE__*/new WeakMap();
var GreedyPromise = /*#__PURE__*/function () {
  function GreedyPromise(resolver) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, GreedyPromise);
    _classPrivateFieldInitSpec(this, _result, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _callbacks, {
      writable: true,
      value: void 0
    });
    if (typeof resolver !== 'function') {
      throw new Error('resolver not a function');
    }
    var result = [];
    var callbacks = [];
    var _map = [SUCCESS, FAIL].map(function (type) {
        return function (value) {
          if (type === SUCCESS && typeof (value === null || value === void 0 ? void 0 : value.then) === 'function') {
            value.then(resolve, reject);
          } else if (!result.length) {
            result.push(type, value);
            while (callbacks.length) {
              callbacks.shift()();
            }
          }
        };
      }),
      _map2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_map, 2),
      resolve = _map2[0],
      reject = _map2[1];
    try {
      resolver(resolve, reject);
    } catch (e) {
      reject(e);
    }
    (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__["default"])(this, _result, result);
    (0,_babel_runtime_helpers_classPrivateFieldSet__WEBPACK_IMPORTED_MODULE_2__["default"])(this, _callbacks, callbacks);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(GreedyPromise, [{
    key: "then",
    value: function then(onSuccess, onError) {
      var _this = this;
      var result = (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__["default"])(this, _result);
      return new this.constructor(function (resolve, reject) {
        var continuation = function continuation() {
          var value = result[1];
          var _ref = result[0] === SUCCESS ? [onSuccess, resolve] : [onError, reject],
            _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, 2),
            handler = _ref2[0],
            resolveFn = _ref2[1];
          if (typeof handler === 'function') {
            try {
              value = handler(value);
            } catch (e) {
              reject(e);
              return;
            }
            resolveFn = resolve;
          }
          resolveFn(value);
        };
        result.length ? continuation() : (0,_babel_runtime_helpers_classPrivateFieldGet__WEBPACK_IMPORTED_MODULE_4__["default"])(_this, _callbacks).push(continuation);
      });
    }
  }, {
    key: "catch",
    value: function _catch(onError) {
      return this.then(null, onError);
    }
  }, {
    key: "finally",
    value: function _finally(onFinally) {
      var _this2 = this;
      var val;
      return this.then(function (v) {
        val = v;
        return onFinally();
      }, function (e) {
        val = _this2.constructor.reject(e);
        return onFinally();
      }).then(function () {
        return val;
      });
    }
  }], [{
    key: "timeout",
    value:
    /**
     * Convenience wrapper for setTimeout; takes care of returning an already fulfilled GreedyPromise when the delay is zero.
     *
     * @param {Number} delayMs delay in milliseconds
     * @returns {GreedyPromise} a promise that resolves (to undefined) in `delayMs` milliseconds
     */
    function timeout() {
      var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return new GreedyPromise(function (resolve) {
        delayMs === 0 ? resolve() : setTimeout(resolve, delayMs);
      });
    }
  }, {
    key: "race",
    value: function race(promises) {
      var _this3 = this;
      return new this(function (resolve, reject) {
        _classStaticPrivateMethodGet(_this3, GreedyPromise, _collect).call(_this3, promises, function (success, result) {
          return success ? resolve(result) : reject(result);
        });
      });
    }
  }, {
    key: "all",
    value: function all(promises) {
      var _this4 = this;
      return new this(function (resolve, reject) {
        var res = [];
        _classStaticPrivateMethodGet(_this4, GreedyPromise, _collect).call(_this4, promises, function (success, val, i) {
          return success ? res[i] = val : reject(val);
        }, function () {
          return resolve(res);
        });
      });
    }
  }, {
    key: "allSettled",
    value: function allSettled(promises) {
      var _this5 = this;
      return new this(function (resolve) {
        var res = [];
        _classStaticPrivateMethodGet(_this5, GreedyPromise, _collect).call(_this5, promises, function (success, val, i) {
          return res[i] = success ? {
            status: 'fulfilled',
            value: val
          } : {
            status: 'rejected',
            reason: val
          };
        }, function () {
          return resolve(res);
        });
      });
    }
  }, {
    key: "resolve",
    value: function resolve(value) {
      return new this(function (resolve) {
        return resolve(value);
      });
    }
  }, {
    key: "reject",
    value: function reject(error) {
      return new this(function (resolve, reject) {
        return reject(error);
      });
    }
  }]);
  return GreedyPromise;
}();

/**
 * @returns a {promise, resolve, reject} trio where `promise` is resolved by calling `resolve` or `reject`.
 */
function _collect(promises, collector, done) {
  var _this6 = this;
  var cnt = promises.length;
  function clt() {
    collector.apply(this, arguments);
    if (--cnt <= 0 && done) done();
  }
  promises.length === 0 && done ? done() : promises.forEach(function (p, i) {
    return _this6.resolve(p).then(function (val) {
      return clt(true, val, i);
    }, function (err) {
      return clt(false, err, i);
    });
  });
}
function defer() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref3$promiseFactory = _ref3.promiseFactory,
    promiseFactory = _ref3$promiseFactory === void 0 ? function (resolver) {
      return new GreedyPromise(resolver);
    } : _ref3$promiseFactory;
  function invoker(delegate) {
    return function (val) {
      return delegate(val);
    };
  }
  var resolveFn, rejectFn;
  return {
    promise: promiseFactory(function (resolve, reject) {
      resolveFn = resolve;
      rejectFn = reject;
    }),
    resolve: invoker(resolveFn),
    reject: invoker(rejectFn)
  };
}

/***/ }),

/***/ "./src/video.js":
/*!**********************!*\
  !*** ./src/video.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INSTREAM": function() { return /* binding */ INSTREAM; },
/* harmony export */   "OUTSTREAM": function() { return /* binding */ OUTSTREAM; },
/* harmony export */   "isValidVideoBid": function() { return /* binding */ isValidVideoBid; }
/* harmony export */ });
/* unused harmony exports videoAdUnit, videoBidder, hasNonVideoBidder, checkVideoBidSetup */
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");






var VIDEO_MEDIA_TYPE = 'video';
var OUTSTREAM = 'outstream';
var INSTREAM = 'instream';

/**
 * Helper functions for working with video-enabled adUnits
 */
var videoAdUnit = function videoAdUnit(adUnit) {
  var mediaType = adUnit.mediaType === VIDEO_MEDIA_TYPE;
  var mediaTypes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(adUnit, 'mediaTypes.video');
  return mediaType || mediaTypes;
};
var videoBidder = function videoBidder(bid) {
  return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_1__.includes)(_adapterManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].videoAdapters, bid.bidder);
};
var hasNonVideoBidder = function hasNonVideoBidder(adUnit) {
  return adUnit.bids.filter(function (bid) {
    return !videoBidder(bid);
  }).length;
};

/**
 * @typedef {object} VideoBid
 * @property {string} adId id of the bid
 */

/**
 * Validate that the assets required for video context are present on the bid
 * @param {VideoBid} bid Video bid to validate
 * @param index
 * @return {Boolean} If object is valid
 */
function isValidVideoBid(bid) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$index = _ref.index,
    index = _ref$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_3__.auctionManager.index : _ref$index;
  var videoMediaType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(index.getMediaTypes(bid), 'video');
  var context = videoMediaType && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(videoMediaType, 'context');
  var useCacheKey = videoMediaType && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"])(videoMediaType, 'useCacheKey');
  var adUnit = index.getAdUnit(bid);

  // if context not defined assume default 'instream' for video bids
  // instream bids require a vast url or vast xml content
  return checkVideoBidSetup(bid, adUnit, videoMediaType, context, useCacheKey);
}
var checkVideoBidSetup = (0,_hook_js__WEBPACK_IMPORTED_MODULE_4__.hook)('sync', function (bid, adUnit, videoMediaType, context, useCacheKey) {
  if (videoMediaType && (useCacheKey || context !== OUTSTREAM)) {
    // xml-only video bids require a prebid cache url
    if (!_src_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('cache.url') && bid.vastXml && !bid.vastUrl) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.logError)("\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling prebid cache with pbjs.setConfig({ cache: {url: \"...\"} });\n      ");
      return false;
    }
    return !!(bid.vastUrl || bid.vastXml);
  }

  // outstream bids require a renderer on the bid or pub-defined on adunit
  if (context === OUTSTREAM && !useCacheKey) {
    return !!(bid.renderer || adUnit && adUnit.renderer || videoMediaType.renderer);
  }
  return true;
}, 'checkVideoBidSetup');

/***/ }),

/***/ "./src/videoCache.js":
/*!***************************!*\
  !*** ./src/videoCache.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCacheUrl": function() { return /* binding */ getCacheUrl; },
/* harmony export */   "store": function() { return /* binding */ store; }
/* harmony export */ });
/* harmony import */ var _ajax_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ajax.js */ "./src/ajax.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/**
 * This module interacts with the server used to cache video ad content to be restored later.
 * At a high level, the expected workflow goes like this:
 *
 *   - Request video ads from Bidders
 *   - Generate IDs for each valid bid, and cache the key/value pair on the server.
 *   - Return these IDs so that publishers can use them to fetch the bids later.
 *
 * This trickery helps integrate with ad servers, which set character limits on request params.
 */





/**
 * Might be useful to be configurable in the future
 * Depending on publisher needs
 */
var ttlBufferInSeconds = 15;

/**
 * @typedef {object} CacheableUrlBid
 * @property {string} vastUrl A URL which loads some valid VAST XML.
 */

/**
 * @typedef {object} CacheablePayloadBid
 * @property {string} vastXml Some VAST XML which loads an ad in a video player.
 */

/**
 * A CacheableBid describes the types which the videoCache can store.
 *
 * @typedef {CacheableUrlBid|CacheablePayloadBid} CacheableBid
 */

/**
 * Function which wraps a URI that serves VAST XML, so that it can be loaded.
 *
 * @param {string} uri The URI where the VAST content can be found.
 * @param {string} impUrl An impression tracker URL for the delivery of the video ad
 * @return A VAST URL which loads XML from the given URI.
 */
function wrapURI(uri, impUrl) {
  // Technically, this is vulnerable to cross-script injection by sketchy vastUrl bids.
  // We could make sure it's a valid URI... but since we're loading VAST XML from the
  // URL they provide anyway, that's probably not a big deal.
  var vastImp = impUrl ? "<![CDATA[".concat(impUrl, "]]>") : "";
  return "<VAST version=\"3.0\">\n    <Ad>\n      <Wrapper>\n        <AdSystem>prebid.org wrapper</AdSystem>\n        <VASTAdTagURI><![CDATA[".concat(uri, "]]></VASTAdTagURI>\n        <Impression>").concat(vastImp, "</Impression>\n        <Creatives></Creatives>\n      </Wrapper>\n    </Ad>\n  </VAST>");
}

/**
 * Wraps a bid in the format expected by the prebid-server endpoints, or returns null if
 * the bid can't be converted cleanly.
 *
 * @param {CacheableBid} bid
 * @param index
 */
function toStorageRequest(bid) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$index = _ref.index,
    index = _ref$index === void 0 ? _auctionManager_js__WEBPACK_IMPORTED_MODULE_0__.auctionManager.index : _ref$index;
  var vastValue = bid.vastXml ? bid.vastXml : wrapURI(bid.vastUrl, bid.vastImpUrl);
  var auction = index.getAuction(bid);
  var ttlWithBuffer = Number(bid.ttl) + ttlBufferInSeconds;
  var payload = {
    type: 'xml',
    value: vastValue,
    ttlseconds: ttlWithBuffer
  };
  if (_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.vasttrack')) {
    payload.bidder = bid.bidder;
    payload.bidid = bid.requestId;
    payload.aid = bid.auctionId;
  }
  if (auction != null) {
    payload.timestamp = auction.getAuctionStart();
  }
  if (typeof bid.customCacheKey === 'string' && bid.customCacheKey !== '') {
    payload.key = bid.customCacheKey;
  }
  return payload;
}

/**
 * A function which should be called with the results of the storage operation.
 *
 * @callback videoCacheStoreCallback
 *
 * @param {Error} [error] The error, if one occurred.
 * @param {?string[]} uuids An array of unique IDs. The array will have one element for each bid we were asked
 *   to store. It may include null elements if some of the bids were malformed, or an error occurred.
 *   Each non-null element in this array is a valid input into the retrieve function, which will fetch
 *   some VAST XML which can be used to render this bid's ad.
 */

/**
 * A function which bridges the APIs between the videoCacheStoreCallback and our ajax function's API.
 *
 * @param {videoCacheStoreCallback} done A callback to the "store" function.
 * @return {Function} A callback which interprets the cache server's responses, and makes up the right
 *   arguments for our callback.
 */
function shimStorageCallback(done) {
  return {
    success: function success(responseBody) {
      var ids;
      try {
        ids = JSON.parse(responseBody).responses;
      } catch (e) {
        done(e, []);
        return;
      }
      if (ids) {
        done(null, ids);
      } else {
        done(new Error("The cache server didn't respond with a responses property."), []);
      }
    },
    error: function error(statusText, responseBody) {
      done(new Error("Error storing video ad in the cache: ".concat(statusText, ": ").concat(JSON.stringify(responseBody))), []);
    }
  };
}

/**
 * If the given bid is for a Video ad, generate a unique ID and cache it somewhere server-side.
 *
 * @param {CacheableBid[]} bids A list of bid objects which should be cached.
 * @param {videoCacheStoreCallback} [done] An optional callback which should be executed after
 * the data has been stored in the cache.
 */
function store(bids, done) {
  var getAjax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ajax_js__WEBPACK_IMPORTED_MODULE_2__.ajaxBuilder;
  var requestData = {
    puts: bids.map(toStorageRequest)
  };
  var ajax = getAjax(_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.timeout'));
  ajax(_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.url'), shimStorageCallback(done), JSON.stringify(requestData), {
    contentType: 'text/plain',
    withCredentials: true
  });
}
function getCacheUrl(id) {
  return "".concat(_config_js__WEBPACK_IMPORTED_MODULE_1__.config.getConfig('cache.url'), "?uuid=").concat(id);
}

/***/ }),

/***/ "./node_modules/dlv/index.js":
/*!***********************************!*\
  !*** ./node_modules/dlv/index.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ dlv; }
/* harmony export */ });
function dlv(obj, key, def, p, undef) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : undef;
	}
	return obj === undef ? def : obj;
}


/***/ }),

/***/ "./node_modules/fun-hooks/no-eval/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fun-hooks/no-eval/index.js ***!
  \*************************************************/
/***/ (function(module) {

/*
* @license MIT
* Fun Hooks v0.9.10
* (c) @snapwich
*/
create.SYNC = 1;
create.ASYNC = 2;
create.QUEUE = 4;

var packageName = "fun-hooks";

function hasProxy() {
  return !!(typeof Proxy === "function" && Proxy.revocable);
}

var defaults = Object.freeze({
  useProxy: true,
  ready: 0
});

var hookableMap = new WeakMap();

// detect incorrectly implemented reduce and if found use polyfill
// https://github.com/prebid/Prebid.js/issues/3576
// polyfill from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
var reduce =
  [1]
    .reduce(function(a, b, c) {
      return [a, b, c];
    }, 2)
    .toString() === "2,1,0"
    ? Array.prototype.reduce
    : function(callback, initial) {
        var o = Object(this);
        var len = o.length >>> 0;
        var k = 0;
        var value;
        if (initial) {
          value = initial;
        } else {
          while (k < len && !(k in o)) {
            k++;
          }
          value = o[k++];
        }
        while (k < len) {
          if (k in o) {
            value = callback(value, o[k], k, o);
          }
          k++;
        }
        return value;
      };

function rest(args, skip) {
  return Array.prototype.slice.call(args, skip);
}

var assign =
  Object.assign ||
  function assign(target) {
    return reduce.call(
      rest(arguments, 1),
      function(target, obj) {
        if (obj) {
          Object.keys(obj).forEach(function(prop) {
            target[prop] = obj[prop];
          });
        }
        return target;
      },
      target
    );
  };

function runAll(queue) {
  var queued;
  // eslint-disable-next-line no-cond-assign
  while ((queued = queue.shift())) {
    queued();
  }
}

function create(config) {
  var hooks = {};
  var postReady = [];

  config = assign({}, defaults, config);

  function dispatch(arg1, arg2) {
    if (typeof arg1 === "function") {
      return hookFn.call(null, "sync", arg1, arg2);
    } else if (typeof arg1 === "string" && typeof arg2 === "function") {
      return hookFn.apply(null, arguments);
    } else if (typeof arg1 === "object") {
      return hookObj.apply(null, arguments);
    }
  }

  var ready;
  if (config.ready) {
    dispatch.ready = function() {
      ready = true;
      runAll(postReady);
    };
  } else {
    ready = true;
  }

  function hookObj(obj, props, objName) {
    var walk = true;
    if (typeof props === "undefined") {
      props = Object.getOwnPropertyNames(obj);
      walk = false;
    }
    var objHooks = {};
    var doNotHook = ["constructor"];
    do {
      props = props.filter(function(prop) {
        return (
          typeof obj[prop] === "function" &&
          !(doNotHook.indexOf(prop) !== -1) &&
          !prop.match(/^_/)
        );
      });
      props.forEach(function(prop) {
        var parts = prop.split(":");
        var name = parts[0];
        var type = parts[1] || "sync";
        if (!objHooks[name]) {
          var fn = obj[name];
          objHooks[name] = obj[name] = hookFn(
            type,
            fn,
            objName ? [objName, name] : undefined
          );
        }
      });
      obj = Object.getPrototypeOf(obj);
    } while (walk && obj);
    return objHooks;
  }

  /**
   * Navigates a string path to return a hookable function.  If not found, creates a placeholder for hooks.
   * @param {(Array<string> | string)} path
   */
  function get(path) {
    var parts = Array.isArray(path) ? path : path.split(".");
    return reduce.call(
      parts,
      function(memo, part, i) {
        var item = memo[part];
        var installed = false;
        if (item) {
          return item;
        } else if (i === parts.length - 1) {
          if (!ready) {
            postReady.push(function() {
              if (!installed) {
                // eslint-disable-next-line no-console
                console.warn(
                  packageName +
                    ": referenced '" +
                    path +
                    "' but it was never created"
                );
              }
            });
          }
          return (memo[part] = newHookable(function(fn) {
            memo[part] = fn;
            installed = true;
          }));
        }
        return (memo[part] = {});
      },
      hooks
    );
  }

  function newHookable(onInstall) {
    var before = [];
    var after = [];
    var generateTrap = function() {};

    var api = {
      before: function(hook, priority) {
        return add.call(this, before, "before", hook, priority);
      },
      after: function(hook, priority) {
        return add.call(this, after, "after", hook, priority);
      },
      getHooks: function(match) {
        var hooks = before.concat(after);
        if (typeof match === "object") {
          hooks = hooks.filter(function(entry) {
            return Object.keys(match).every(function(prop) {
              return entry[prop] === match[prop];
            });
          });
        }
        try {
          assign(hooks, {
            remove: function() {
              hooks.forEach(function(entry) {
                entry.remove();
              });
              return this;
            }
          });
        } catch (e) {
          console.error(
            "error adding `remove` to array, did you modify Array.prototype?"
          );
        }
        return hooks;
      },
      removeAll: function() {
        return this.getHooks().remove();
      }
    };

    var meta = {
      install: function(type, fn, generate) {
        this.type = type;
        generateTrap = generate;
        generate(before, after);
        onInstall && onInstall(fn);
      }
    };

    // store meta data related to hookable. use `api.after` since `api` reference is not available on our proxy.
    hookableMap.set(api.after, meta);

    return api;

    function add(store, type, hook, priority) {
      var entry = {
        hook: hook,
        type: type,
        priority: priority || 10,
        remove: function() {
          var index = store.indexOf(entry);
          if (index !== -1) {
            store.splice(index, 1);
            generateTrap(before, after);
          }
        }
      };
      store.push(entry);
      store.sort(function(a, b) {
        return b.priority - a.priority;
      });
      generateTrap(before, after);
      return this;
    }
  }

  function hookFn(type, fn, name) {
    // check if function has already been wrapped
    var meta = fn.after && hookableMap.get(fn.after);
    if (meta) {
      if (meta.type !== type) {
        throw packageName + ": recreated hookable with different type";
      } else {
        return fn;
      }
    }

    var hookable = name ? get(name) : newHookable();

    var trap;
    var hookedFn;
    var handlers = {
      get: function(target, prop) {
        return hookable[prop] || Reflect.get.apply(Reflect, arguments);
      }
    };

    if (!ready) {
      postReady.push(setTrap);
    }

    if (config.useProxy && hasProxy()) {
      hookedFn = new Proxy(fn, handlers);
    } else {
      hookedFn = function() {
        return handlers.apply
          ? handlers.apply(fn, this, rest(arguments))
          : fn.apply(this, arguments);
      };
      assign(hookedFn, hookable);
    }

    hookableMap.get(hookedFn.after).install(type, hookedFn, generateTrap);

    return hookedFn;

    // eslint-disable-next-line no-redeclare
    function generateTrap(before, after) {
      var order = [];
      var targetIndex;
      if (before.length || after.length) {
        before.forEach(addToOrder);
        // placeholder for target function wrapper
        targetIndex = order.push(undefined) - 1;
        after.forEach(addToOrder);
        trap = function(target, thisArg, args) {
          var curr = 0;
          var result;
          var callback =
            type === "async" &&
            typeof args[args.length - 1] === "function" &&
            args.pop();
          function bail(value) {
            if (type === "sync") {
              result = value;
            } else if (callback) {
              callback.apply(null, arguments);
            }
          }
          function next(value) {
            if (order[curr]) {
              var args = rest(arguments);
              next.bail = bail;
              args.unshift(next);
              return order[curr++].apply(thisArg, args);
            }
            if (type === "sync") {
              result = value;
            } else if (callback) {
              callback.apply(null, arguments);
            }
          }
          order[targetIndex] = function() {
            var args = rest(arguments, 1);
            if (type === "async" && callback) {
              delete next.bail;
              args.push(next);
            }
            var result = target.apply(thisArg, args);
            if (type === "sync") {
              next(result);
            }
          };
          next.apply(null, args);
          return result;
        };
      } else {
        trap = undefined;
      }
      setTrap();

      function addToOrder(entry) {
        order.push(entry.hook);
      }
    }

    function setTrap() {
      if (
        ready ||
        (type === "sync" && !(config.ready & create.SYNC)) ||
        (type === "async" && !(config.ready & create.ASYNC))
      ) {
        handlers.apply = trap;
      } else if (type === "sync" || !(config.ready & create.QUEUE)) {
        handlers.apply = function() {
          throw packageName + ": hooked function not ready";
        };
      } else {
        handlers.apply = function() {
          var args = arguments;
          postReady.push(function() {
            hookedFn.apply(args[1], args[2]);
          });
        };
      }
    }
  }

  dispatch.get = get;
  return dispatch;
}

/* global module */
module.exports = create;


/***/ }),

/***/ "./node_modules/just-clone/index.js":
/*!******************************************!*\
  !*** ./node_modules/just-clone/index.js ***!
  \******************************************/
/***/ (function(module) {

module.exports = clone;

/*
  Identical to `just-extend(true, {}, obj1)`

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}  
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // include prototype properties
    var value = obj[key];
    if (value && typeof value == 'object') {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classApplyDescriptorGet; }
/* harmony export */ });
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classApplyDescriptorSet; }
/* harmony export */ });
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classExtractFieldDescriptor; }
/* harmony export */ });
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classPrivateFieldGet.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classPrivateFieldGet; }
/* harmony export */ });
/* harmony import */ var _classApplyDescriptorGet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classApplyDescriptorGet.js */ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorGet.js");
/* harmony import */ var _classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classExtractFieldDescriptor.js */ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js");


function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = (0,_classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(receiver, privateMap, "get");
  return (0,_classApplyDescriptorGet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(receiver, descriptor);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classPrivateFieldSet.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classPrivateFieldSet; }
/* harmony export */ });
/* harmony import */ var _classApplyDescriptorSet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classApplyDescriptorSet.js */ "./node_modules/@babel/runtime/helpers/esm/classApplyDescriptorSet.js");
/* harmony import */ var _classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classExtractFieldDescriptor.js */ "./node_modules/@babel/runtime/helpers/esm/classExtractFieldDescriptor.js");


function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = (0,_classExtractFieldDescriptor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(receiver, privateMap, "set");
  (0,_classApplyDescriptorSet_js__WEBPACK_IMPORTED_MODULE_1__["default"])(receiver, descriptor, value);
  return value;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _getPrototypeOf; }
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _possibleConstructorReturn; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/dset/dist/index.mjs":
/*!******************************************!*\
  !*** ./node_modules/dset/dist/index.mjs ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dset": function() { return /* binding */ dset; }
/* harmony export */ });
function dset(obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	while (i < l) {
		k = keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
		t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
	}
}


/***/ }),

/***/ "./src/constants.json":
/*!****************************!*\
  !*** ./src/constants.json ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"JSON_MAPPING":{"ADSERVER_TARGETING":"adserverTargeting","BD_SETTING_STANDARD":"standard"},"DEBUG_MODE":"pbjs_debug","STATUS":{"GOOD":1,"NO_BID":2},"EVENTS":{"AUCTION_INIT":"auctionInit","AUCTION_END":"auctionEnd","BID_ADJUSTMENT":"bidAdjustment","BID_TIMEOUT":"bidTimeout","BID_REQUESTED":"bidRequested","BID_RESPONSE":"bidResponse","BID_REJECTED":"bidRejected","NO_BID":"noBid","SEAT_NON_BID":"seatNonBid","BID_WON":"bidWon","BIDDER_DONE":"bidderDone","BIDDER_ERROR":"bidderError","SET_TARGETING":"setTargeting","BEFORE_REQUEST_BIDS":"beforeRequestBids","BEFORE_BIDDER_HTTP":"beforeBidderHttp","REQUEST_BIDS":"requestBids","ADD_AD_UNITS":"addAdUnits","AD_RENDER_FAILED":"adRenderFailed","AD_RENDER_SUCCEEDED":"adRenderSucceeded","TCF2_ENFORCEMENT":"tcf2Enforcement","AUCTION_DEBUG":"auctionDebug","BID_VIEWABLE":"bidViewable","STALE_RENDER":"staleRender","BILLABLE_EVENT":"billableEvent"},"AD_RENDER_FAILED_REASON":{"PREVENT_WRITING_ON_MAIN_DOCUMENT":"preventWritingOnMainDocument","NO_AD":"noAd","EXCEPTION":"exception","CANNOT_FIND_AD":"cannotFindAd","MISSING_DOC_OR_ADID":"missingDocOrAdid"},"EVENT_ID_PATHS":{"bidWon":"adUnitCode"},"GRANULARITY_OPTIONS":{"LOW":"low","MEDIUM":"medium","HIGH":"high","AUTO":"auto","DENSE":"dense","CUSTOM":"custom"},"TARGETING_KEYS":{"BIDDER":"hb_bidder","AD_ID":"hb_adid","PRICE_BUCKET":"hb_pb","SIZE":"hb_size","DEAL":"hb_deal","SOURCE":"hb_source","FORMAT":"hb_format","UUID":"hb_uuid","CACHE_ID":"hb_cache_id","CACHE_HOST":"hb_cache_host","ADOMAIN":"hb_adomain","ACAT":"hb_acat"},"DEFAULT_TARGETING_KEYS":{"BIDDER":"hb_bidder","AD_ID":"hb_adid","PRICE_BUCKET":"hb_pb","SIZE":"hb_size","DEAL":"hb_deal","FORMAT":"hb_format","UUID":"hb_uuid","CACHE_HOST":"hb_cache_host"},"NATIVE_KEYS":{"title":"hb_native_title","body":"hb_native_body","body2":"hb_native_body2","privacyLink":"hb_native_privacy","privacyIcon":"hb_native_privicon","sponsoredBy":"hb_native_brand","image":"hb_native_image","icon":"hb_native_icon","clickUrl":"hb_native_linkurl","displayUrl":"hb_native_displayurl","cta":"hb_native_cta","rating":"hb_native_rating","address":"hb_native_address","downloads":"hb_native_downloads","likes":"hb_native_likes","phone":"hb_native_phone","price":"hb_native_price","salePrice":"hb_native_saleprice","rendererUrl":"hb_renderer_url","adTemplate":"hb_adTemplate"},"S2S":{"SRC":"s2s"},"BID_STATUS":{"BID_TARGETING_SET":"targetingSet","RENDERED":"rendered","BID_REJECTED":"bidRejected"},"REJECTION_REASON":{"INVALID":"Bid has missing or invalid properties","INVALID_REQUEST_ID":"Invalid request ID","BIDDER_DISALLOWED":"Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes"},"PREBID_NATIVE_DATA_KEYS_TO_ORTB":{"body":"desc","body2":"desc2","sponsoredBy":"sponsored","cta":"ctatext","rating":"rating","address":"address","downloads":"downloads","likes":"likes","phone":"phone","price":"price","salePrice":"saleprice","displayUrl":"displayurl"},"NATIVE_ASSET_TYPES":{"sponsored":1,"desc":2,"rating":3,"likes":4,"downloads":5,"price":6,"saleprice":7,"phone":8,"address":9,"desc2":10,"displayurl":11,"ctatext":12},"NATIVE_IMAGE_TYPES":{"ICON":1,"MAIN":3},"NATIVE_KEYS_THAT_ARE_NOT_ASSETS":["privacyLink","clickUrl","sendTargetingKeys","adTemplate","rendererUrl","type"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"prebid-core": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["pbjsChunk"] = self["pbjsChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!***********************!*\
  !*** ./src/prebid.js ***!
  \***********************/
/* unused harmony exports adUnitSetupChecks, checkAdUnitSetup, startAuction, executeCallbacks */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _secureCreatives_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./secureCreatives.js */ "./src/secureCreatives.js");
/* harmony import */ var _userSync_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./userSync.js */ "./src/userSync.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
/* harmony import */ var _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auctionManager.js */ "./src/auctionManager.js");
/* harmony import */ var _targeting_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./targeting.js */ "./src/targeting.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hook.js */ "./src/hook.js");
/* harmony import */ var _debugging_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./debugging.js */ "./src/debugging.js");
/* harmony import */ var _polyfill_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _adUnits_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./adUnits.js */ "./src/adUnits.js");
/* harmony import */ var _Renderer_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Renderer.js */ "./src/Renderer.js");
/* harmony import */ var _bidfactory_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./bidfactory.js */ "./src/bidfactory.js");
/* harmony import */ var _storageManager_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _adRendering_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./adRendering.js */ "./src/adRendering.js");
/* harmony import */ var _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./adapterManager.js */ "./src/adapterManager.js");
/* harmony import */ var _constants_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.json */ "./src/constants.json");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./utils/perfMetrics.js */ "./src/utils/perfMetrics.js");
/* harmony import */ var _utils_promise_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./fpd/enrichment.js */ "./src/fpd/enrichment.js");


/** @module pbjs */






















var pbjsInstance = (0,_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
var triggerUserSyncs = _userSync_js__WEBPACK_IMPORTED_MODULE_1__.userSync.triggerUserSyncs;

/* private variables */
var _CONSTANTS$EVENTS = _constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS,
  ADD_AD_UNITS = _CONSTANTS$EVENTS.ADD_AD_UNITS,
  BID_WON = _CONSTANTS$EVENTS.BID_WON,
  REQUEST_BIDS = _CONSTANTS$EVENTS.REQUEST_BIDS,
  SET_TARGETING = _CONSTANTS$EVENTS.SET_TARGETING,
  STALE_RENDER = _CONSTANTS$EVENTS.STALE_RENDER;
var _CONSTANTS$AD_RENDER_ = _constants_json__WEBPACK_IMPORTED_MODULE_2__.AD_RENDER_FAILED_REASON,
  PREVENT_WRITING_ON_MAIN_DOCUMENT = _CONSTANTS$AD_RENDER_.PREVENT_WRITING_ON_MAIN_DOCUMENT,
  NO_AD = _CONSTANTS$AD_RENDER_.NO_AD,
  EXCEPTION = _CONSTANTS$AD_RENDER_.EXCEPTION,
  CANNOT_FIND_AD = _CONSTANTS$AD_RENDER_.CANNOT_FIND_AD,
  MISSING_DOC_OR_ADID = _CONSTANTS$AD_RENDER_.MISSING_DOC_OR_ADID;
var eventValidators = {
  bidWon: checkDefinedPlacement
};

// initialize existing debugging sessions if present
(0,_debugging_js__WEBPACK_IMPORTED_MODULE_3__.loadSession)();

/* Public vars */
pbjsInstance.bidderSettings = pbjsInstance.bidderSettings || {};

// let the world know we are loaded
pbjsInstance.libLoaded = true;

// version auto generated from build
pbjsInstance.version = "v7.54.0";
(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Prebid.js v7.54.0 loaded");
pbjsInstance.installedModules = pbjsInstance.installedModules || [];

// create adUnit array
pbjsInstance.adUnits = pbjsInstance.adUnits || [];

// Allow publishers who enable user sync override to trigger their sync
pbjsInstance.triggerUserSyncs = triggerUserSyncs;
function checkDefinedPlacement(id) {
  var adUnitCodes = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getBidsRequested().map(function (bidSet) {
    return bidSet.bids.map(function (bid) {
      return bid.adUnitCode;
    });
  }).reduce(_utils_js__WEBPACK_IMPORTED_MODULE_4__.flatten).filter(_utils_js__WEBPACK_IMPORTED_MODULE_4__.uniques);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.contains)(adUnitCodes, id)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('The "' + id + '" placement is not defined.');
    return;
  }
  return true;
}
function setRenderSize(doc, width, height) {
  if (doc.defaultView && doc.defaultView.frameElement) {
    doc.defaultView.frameElement.width = width;
    doc.defaultView.frameElement.height = height;
  }
}
function validateSizes(sizes, targLength) {
  var cleanSizes = [];
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(sizes) && (targLength ? sizes.length === targLength : sizes.length > 0)) {
    // check if an array of arrays or array of numbers
    if (sizes.every(function (sz) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArrayOfNums)(sz, 2);
    })) {
      cleanSizes = sizes;
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArrayOfNums)(sizes, 2)) {
      cleanSizes.push(sizes);
    }
  }
  return cleanSizes;
}
function validateBannerMediaType(adUnit) {
  var validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  var banner = validatedAdUnit.mediaTypes.banner;
  var bannerSizes = validateSizes(banner.sizes);
  if (bannerSizes.length > 0) {
    banner.sizes = bannerSizes;
    // Deprecation Warning: This property will be deprecated in next release in favor of adUnit.mediaTypes.banner.sizes
    validatedAdUnit.sizes = bannerSizes;
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Detected a mediaTypes.banner object without a proper sizes field.  Please ensure the sizes are listed like: [[300, 250], ...].  Removing invalid mediaTypes.banner object from request.');
    delete validatedAdUnit.mediaTypes.banner;
  }
  return validatedAdUnit;
}
function validateVideoMediaType(adUnit) {
  var validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  var video = validatedAdUnit.mediaTypes.video;
  if (video.playerSize) {
    var tarPlayerSizeLen = typeof video.playerSize[0] === 'number' ? 2 : 1;
    var videoSizes = validateSizes(video.playerSize, tarPlayerSizeLen);
    if (videoSizes.length > 0) {
      if (tarPlayerSizeLen === 2) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)('Transforming video.playerSize from [640,480] to [[640,480]] so it\'s in the proper format.');
      }
      video.playerSize = videoSizes;
      // Deprecation Warning: This property will be deprecated in next release in favor of adUnit.mediaTypes.video.playerSize
      validatedAdUnit.sizes = videoSizes;
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Detected incorrect configuration of mediaTypes.video.playerSize.  Please specify only one set of dimensions in a format like: [[640, 480]]. Removing invalid mediaTypes.video.playerSize property from request.');
      delete validatedAdUnit.mediaTypes.video.playerSize;
    }
  }
  return validatedAdUnit;
}
function validateNativeMediaType(adUnit) {
  var validatedAdUnit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(adUnit);
  var native = validatedAdUnit.mediaTypes.native;
  // if native assets are specified in OpenRTB format, remove legacy assets and print a warn.
  if (native.ortb) {
    var legacyNativeKeys = Object.keys(_constants_json__WEBPACK_IMPORTED_MODULE_2__.NATIVE_KEYS).filter(function (key) {
      return _constants_json__WEBPACK_IMPORTED_MODULE_2__.NATIVE_KEYS[key].includes('hb_native_');
    });
    var nativeKeys = Object.keys(native);
    var intersection = nativeKeys.filter(function (nativeKey) {
      return legacyNativeKeys.includes(nativeKey);
    });
    if (intersection.length > 0) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("when using native OpenRTB format, you cannot use legacy native properties. Deleting ".concat(intersection, " keys from request."));
      intersection.forEach(function (legacyKey) {
        return delete validatedAdUnit.mediaTypes.native[legacyKey];
      });
    }
  }
  if (native.image && native.image.sizes && !Array.isArray(native.image.sizes)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Please use an array of sizes for native.image.sizes field.  Removing invalid mediaTypes.native.image.sizes property from request.');
    delete validatedAdUnit.mediaTypes.native.image.sizes;
  }
  if (native.image && native.image.aspect_ratios && !Array.isArray(native.image.aspect_ratios)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Please use an array of sizes for native.image.aspect_ratios field.  Removing invalid mediaTypes.native.image.aspect_ratios property from request.');
    delete validatedAdUnit.mediaTypes.native.image.aspect_ratios;
  }
  if (native.icon && native.icon.sizes && !Array.isArray(native.icon.sizes)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Please use an array of sizes for native.icon.sizes field.  Removing invalid mediaTypes.native.icon.sizes property from request.');
    delete validatedAdUnit.mediaTypes.native.icon.sizes;
  }
  return validatedAdUnit;
}
function validateAdUnitPos(adUnit, mediaType) {
  var pos = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(adUnit, "mediaTypes.".concat(mediaType, ".pos"));
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isNumber)(pos) || isNaN(pos) || !isFinite(pos)) {
    var warning = "Value of property 'pos' on ad unit ".concat(adUnit.code, " should be of type: Number");
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)(warning);
    _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(_constants_json__WEBPACK_IMPORTED_MODULE_2__.EVENTS.AUCTION_DEBUG, {
      type: 'WARNING',
      arguments: warning
    });
    delete adUnit.mediaTypes[mediaType].pos;
  }
  return adUnit;
}
function validateAdUnit(adUnit) {
  var msg = function msg(_msg) {
    return "adUnit.code '".concat(adUnit.code, "' ").concat(_msg);
  };
  var mediaTypes = adUnit.mediaTypes;
  var bids = adUnit.bids;
  if (bids != null && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(bids)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(msg("defines 'adUnit.bids' that is not an array. Removing adUnit from auction"));
    return null;
  }
  if (bids == null && adUnit.ortb2Imp == null) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(msg("has no 'adUnit.bids' and no 'adUnit.ortb2Imp'. Removing adUnit from auction"));
    return null;
  }
  if (!mediaTypes || Object.keys(mediaTypes).length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(msg("does not define a 'mediaTypes' object.  This is a required field for the auction, so this adUnit has been removed."));
    return null;
  }
  if (adUnit.ortb2Imp != null && (bids == null || bids.length === 0)) {
    adUnit.bids = [{
      bidder: null
    }]; // the 'null' bidder is treated as an s2s-only placeholder by adapterManager
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)(msg("defines 'adUnit.ortb2Imp' with no 'adUnit.bids'; it will be seen only by S2S adapters"));
  }
  return adUnit;
}
var adUnitSetupChecks = {
  validateAdUnit: validateAdUnit,
  validateBannerMediaType: validateBannerMediaType,
  validateSizes: validateSizes
};
if (true) {
  Object.assign(adUnitSetupChecks, {
    validateNativeMediaType: validateNativeMediaType
  });
}
if (true) {
  Object.assign(adUnitSetupChecks, {
    validateVideoMediaType: validateVideoMediaType
  });
}
var checkAdUnitSetup = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('sync', function (adUnits) {
  var validatedAdUnits = [];
  adUnits.forEach(function (adUnit) {
    adUnit = validateAdUnit(adUnit);
    if (adUnit == null) return;
    var mediaTypes = adUnit.mediaTypes;
    var validatedBanner, validatedVideo, validatedNative;
    if (mediaTypes.banner) {
      validatedBanner = validateBannerMediaType(adUnit);
      if (mediaTypes.banner.hasOwnProperty('pos')) validatedBanner = validateAdUnitPos(validatedBanner, 'banner');
    }
    if ( true && mediaTypes.video) {
      validatedVideo = validatedBanner ? validateVideoMediaType(validatedBanner) : validateVideoMediaType(adUnit);
      if (mediaTypes.video.hasOwnProperty('pos')) validatedVideo = validateAdUnitPos(validatedVideo, 'video');
    }
    if ( true && mediaTypes.native) {
      validatedNative = validatedVideo ? validateNativeMediaType(validatedVideo) : validatedBanner ? validateNativeMediaType(validatedBanner) : validateNativeMediaType(adUnit);
    }
    var validatedAdUnit = Object.assign({}, validatedBanner, validatedVideo, validatedNative);
    validatedAdUnits.push(validatedAdUnit);
  });
  return validatedAdUnits;
}, 'checkAdUnitSetup');

/// ///////////////////////////////
//                              //
//    Start Public APIs         //
//                              //
/// ///////////////////////////////

/**
 * This function returns the query string targeting parameters available at this moment for a given ad unit. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.
 * @param  {string} [adunitCode] adUnitCode to get the bid responses for
 * @alias module:pbjs.getAdserverTargetingForAdUnitCodeStr
 * @return {Array}  returnObj return bids array
 */
pbjsInstance.getAdserverTargetingForAdUnitCodeStr = function (adunitCode) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getAdserverTargetingForAdUnitCodeStr", arguments);

  // call to retrieve bids array
  if (adunitCode) {
    var res = pbjsInstance.getAdserverTargetingForAdUnitCode(adunitCode);
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.transformAdServerTargetingObj)(res);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)('Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode');
  }
};

/**
 * This function returns the query string targeting parameters available at this moment for a given ad unit. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.
 * @param adUnitCode {string} adUnitCode to get the bid responses for
 * @alias module:pbjs.getHighestUnusedBidResponseForAdUnitCode
 * @returns {Object}  returnObj return bid
 */
pbjsInstance.getHighestUnusedBidResponseForAdUnitCode = function (adunitCode) {
  if (adunitCode) {
    var bid = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getAllBidsForAdUnitCode(adunitCode).filter(_targeting_js__WEBPACK_IMPORTED_MODULE_9__.isBidUsable);
    return bid.length ? bid.reduce(_utils_js__WEBPACK_IMPORTED_MODULE_4__.getHighestCpm) : {};
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)('Need to call getHighestUnusedBidResponseForAdUnitCode with adunitCode');
  }
};

/**
 * This function returns the query string targeting parameters available at this moment for a given ad unit. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.
 * @param adUnitCode {string} adUnitCode to get the bid responses for
 * @alias module:pbjs.getAdserverTargetingForAdUnitCode
 * @returns {Object}  returnObj return bids
 */
pbjsInstance.getAdserverTargetingForAdUnitCode = function (adUnitCode) {
  return pbjsInstance.getAdserverTargeting(adUnitCode)[adUnitCode];
};

/**
 * returns all ad server targeting for all ad units
 * @return {Object} Map of adUnitCodes and targeting values []
 * @alias module:pbjs.getAdserverTargeting
 */

pbjsInstance.getAdserverTargeting = function (adUnitCode) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getAdserverTargeting", arguments);
  return _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.getAllTargeting(adUnitCode);
};

/**
 * returns all consent data
 * @return {Object} Map of consent types and data
 * @alias module:pbjs.getConsentData
 */
function getConsentMetadata() {
  return {
    gdpr: _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__.gdprDataHandler.getConsentMeta(),
    usp: _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__.uspDataHandler.getConsentMeta(),
    gpp: _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__.gppDataHandler.getConsentMeta(),
    coppa: !!_config_js__WEBPACK_IMPORTED_MODULE_11__.config.getConfig('coppa')
  };
}
pbjsInstance.getConsentMetadata = function () {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getConsentMetadata");
  return getConsentMetadata();
};
function getBids(type) {
  var responses = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager[type]().filter(_utils_js__WEBPACK_IMPORTED_MODULE_4__.bind.call(_utils_js__WEBPACK_IMPORTED_MODULE_4__.adUnitsFilter, this, _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getAdUnitCodes()));

  // find the last auction id to get responses for most recent auction only
  var currentAuctionId = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getLastAuctionId();
  return responses.map(function (bid) {
    return bid.adUnitCode;
  }).filter(_utils_js__WEBPACK_IMPORTED_MODULE_4__.uniques).map(function (adUnitCode) {
    return responses.filter(function (bid) {
      return bid.auctionId === currentAuctionId && bid.adUnitCode === adUnitCode;
    });
  }).filter(function (bids) {
    return bids && bids[0] && bids[0].adUnitCode;
  }).map(function (bids) {
    return (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_12__["default"])({}, bids[0].adUnitCode, {
      bids: bids
    });
  }).reduce(function (a, b) {
    return Object.assign(a, b);
  }, {});
}

/**
 * This function returns the bids requests involved in an auction but not bid on
 * @alias module:pbjs.getNoBids
 * @return {Object}            map | object that contains the bidRequests
 */

pbjsInstance.getNoBids = function () {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getNoBids", arguments);
  return getBids('getNoBids');
};

/**
 * This function returns the bids requests involved in an auction but not bid on or the specified adUnitCode
 * @param  {string} adUnitCode adUnitCode
 * @alias module:pbjs.getNoBidsForAdUnitCode
 * @return {Object}           bidResponse object
 */

pbjsInstance.getNoBidsForAdUnitCode = function (adUnitCode) {
  var bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getNoBids().filter(function (bid) {
    return bid.adUnitCode === adUnitCode;
  });
  return {
    bids: bids
  };
};

/**
 * This function returns the bid responses at the given moment.
 * @alias module:pbjs.getBidResponses
 * @return {Object}            map | object that contains the bidResponses
 */

pbjsInstance.getBidResponses = function () {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getBidResponses", arguments);
  return getBids('getBidsReceived');
};

/**
 * Returns bidResponses for the specified adUnitCode
 * @param  {string} adUnitCode adUnitCode
 * @alias module:pbjs.getBidResponsesForAdUnitCode
 * @return {Object}            bidResponse object
 */

pbjsInstance.getBidResponsesForAdUnitCode = function (adUnitCode) {
  var bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getBidsReceived().filter(function (bid) {
    return bid.adUnitCode === adUnitCode;
  });
  return {
    bids: bids
  };
};

/**
 * Set query string targeting on one or more GPT ad units.
 * @param {(string|string[])} adUnit a single `adUnit.code` or multiple.
 * @param {function(object)} customSlotMatching gets a GoogleTag slot and returns a filter function for adUnitCode, so you can decide to match on either eg. return slot => { return adUnitCode => { return slot.getSlotElementId() === 'myFavoriteDivId'; } };
 * @alias module:pbjs.setTargetingForGPTAsync
 */
pbjsInstance.setTargetingForGPTAsync = function (adUnit, customSlotMatching) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.setTargetingForGPTAsync", arguments);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isGptPubadsDefined)()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('window.googletag is not defined on the page');
    return;
  }

  // get our ad unit codes
  var targetingSet = _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.getAllTargeting(adUnit);

  // first reset any old targeting
  _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.resetPresetTargeting(adUnit, customSlotMatching);

  // now set new targeting keys
  _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.setTargetingForGPT(targetingSet, customSlotMatching);
  Object.keys(targetingSet).forEach(function (adUnitCode) {
    Object.keys(targetingSet[adUnitCode]).forEach(function (targetingKey) {
      if (targetingKey === 'hb_adid') {
        _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.setStatusForBids(targetingSet[adUnitCode][targetingKey], _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.BID_TARGETING_SET);
      }
    });
  });

  // emit event
  _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(SET_TARGETING, targetingSet);
};

/**
 * Set query string targeting on all AST (AppNexus Seller Tag) ad units. Note that this function has to be called after all ad units on page are defined. For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server](http://prebid.org/dev-docs/examples/use-prebid-with-appnexus-ad-server.html).
 * @param  {(string|string[])} adUnitCode adUnitCode or array of adUnitCodes
 * @alias module:pbjs.setTargetingForAst
 */
pbjsInstance.setTargetingForAst = function (adUnitCodes) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.setTargetingForAn", arguments);
  if (!_targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.isApntagDefined()) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('window.apntag is not defined on the page');
    return;
  }
  _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.setTargetingForAst(adUnitCodes);

  // emit event
  _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(SET_TARGETING, _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.getAllTargeting());
};

/**
 * This function will check for presence of given node in given parent. If not present - will inject it.
 * @param {Node} node node, whose existance is in question
 * @param {Document} doc document element do look in
 * @param {string} tagName tag name to look in
 */
function reinjectNodeIfRemoved(node, doc, tagName) {
  var injectionNode = doc.querySelector(tagName);
  if (!node.parentNode || node.parentNode !== injectionNode) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.insertElement)(node, doc, tagName);
  }
}

/**
 * This function will render the ad (based on params) in the given iframe document passed through.
 * Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously
 * @param  {Document} doc document
 * @param  {string} id bid id to locate the ad
 * @alias module:pbjs.renderAd
 */
pbjsInstance.renderAd = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (doc, id, options) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.renderAd", arguments);
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)('Calling renderAd with adId :' + id);
  if (!id) {
    var message = "Error trying to write ad Id :".concat(id, " to the page. Missing adId");
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
      reason: MISSING_DOC_OR_ADID,
      message: message,
      id: id
    });
    return;
  }
  try {
    // lookup ad by ad Id
    var bid = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.findBidByAdId(id);
    if (!bid) {
      var _message = "Error trying to write ad. Cannot find ad by given id : ".concat(id);
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
        reason: CANNOT_FIND_AD,
        message: _message,
        id: id
      });
      return;
    }
    if (bid.status === _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.RENDERED) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("Ad id ".concat(bid.adId, " has been rendered before"));
      _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(STALE_RENDER, bid);
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config_js__WEBPACK_IMPORTED_MODULE_11__.config.getConfig('auctionOptions'), 'suppressStaleRender')) {
        return;
      }
    }

    // replace macros according to openRTB with price paid = bid.cpm
    bid.ad = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.replaceAuctionPrice)(bid.ad, bid.originalCpm || bid.cpm);
    bid.adUrl = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.replaceAuctionPrice)(bid.adUrl, bid.originalCpm || bid.cpm);
    // replacing clickthrough if submitted
    if (options && options.clickThrough) {
      var clickThrough = options.clickThrough;
      bid.ad = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.replaceClickThrough)(bid.ad, clickThrough);
      bid.adUrl = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.replaceClickThrough)(bid.adUrl, clickThrough);
    }

    // save winning bids
    _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.addWinningBid(bid);

    // emit 'bid won' event here
    _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(BID_WON, bid);
    var height = bid.height,
      width = bid.width,
      ad = bid.ad,
      mediaType = bid.mediaType,
      adUrl = bid.adUrl,
      renderer = bid.renderer;

    // video module
    if (true) {
      var adUnitCode = bid.adUnitCode;
      var adUnit = pbjsInstance.adUnits.filter(function (adUnit) {
        return adUnit.code === adUnitCode;
      });
      var videoModule = pbjsInstance.videoModule;
      if (adUnit.video && videoModule) {
        videoModule.renderBid(adUnit.video.divId, bid);
        return;
      }
    }
    if (!doc) {
      var _message2 = "Error trying to write ad Id :".concat(id, " to the page. Missing document");
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
        reason: MISSING_DOC_OR_ADID,
        message: _message2,
        id: id
      });
      return;
    }
    var creativeComment = document.createComment("Creative ".concat(bid.creativeId, " served by ").concat(bid.bidder, " Prebid.js Header Bidding"));
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.insertElement)(creativeComment, doc, 'html');
    if ((0,_Renderer_js__WEBPACK_IMPORTED_MODULE_14__.isRendererRequired)(renderer)) {
      (0,_Renderer_js__WEBPACK_IMPORTED_MODULE_14__.executeRenderer)(renderer, bid, doc);
      reinjectNodeIfRemoved(creativeComment, doc, 'html');
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderSucceeded)({
        doc: doc,
        bid: bid,
        id: id
      });
    } else if (doc === document && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.inIframe)() || mediaType === 'video') {
      var _message3 = "Error trying to write ad. Ad render call ad id ".concat(id, " was prevented from writing to the main document.");
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
        reason: PREVENT_WRITING_ON_MAIN_DOCUMENT,
        message: _message3,
        bid: bid,
        id: id
      });
    } else if (ad) {
      doc.write(ad);
      doc.close();
      setRenderSize(doc, width, height);
      reinjectNodeIfRemoved(creativeComment, doc, 'html');
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.callBurl)(bid);
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderSucceeded)({
        doc: doc,
        bid: bid,
        id: id
      });
    } else if (adUrl) {
      var iframe = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.createInvisibleIframe)();
      iframe.height = height;
      iframe.width = width;
      iframe.style.display = 'inline';
      iframe.style.overflow = 'hidden';
      iframe.src = adUrl;
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.insertElement)(iframe, doc, 'body');
      setRenderSize(doc, width, height);
      reinjectNodeIfRemoved(creativeComment, doc, 'html');
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.callBurl)(bid);
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderSucceeded)({
        doc: doc,
        bid: bid,
        id: id
      });
    } else {
      var _message4 = "Error trying to write ad. No ad for bid response id: ".concat(id);
      (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
        reason: NO_AD,
        message: _message4,
        bid: bid,
        id: id
      });
    }
  } catch (e) {
    var _message5 = "Error trying to write ad Id :".concat(id, " to the page:").concat(e.message);
    (0,_adRendering_js__WEBPACK_IMPORTED_MODULE_13__.emitAdRenderFail)({
      reason: EXCEPTION,
      message: _message5,
      id: id
    });
  }
});

/**
 * Remove adUnit from the $$PREBID_GLOBAL$$ configuration, if there are no addUnitCode(s) it will remove all
 * @param  {string| Array} adUnitCode the adUnitCode(s) to remove
 * @alias module:pbjs.removeAdUnit
 */
pbjsInstance.removeAdUnit = function (adUnitCode) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.removeAdUnit", arguments);
  if (!adUnitCode) {
    pbjsInstance.adUnits = [];
    return;
  }
  var adUnitCodes;
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(adUnitCode)) {
    adUnitCodes = adUnitCode;
  } else {
    adUnitCodes = [adUnitCode];
  }
  adUnitCodes.forEach(function (adUnitCode) {
    for (var i = pbjsInstance.adUnits.length - 1; i >= 0; i--) {
      if (pbjsInstance.adUnits[i].code === adUnitCode) {
        pbjsInstance.adUnits.splice(i, 1);
      }
    }
  });
};

/**
 * @param {Object} requestOptions
 * @param {function} requestOptions.bidsBackHandler
 * @param {number} requestOptions.timeout
 * @param {Array} requestOptions.adUnits
 * @param {Array} requestOptions.adUnitCodes
 * @param {Array} requestOptions.labels
 * @param {String} requestOptions.auctionId
 * @alias module:pbjs.requestBids
 */
pbjsInstance.requestBids = function () {
  var delegate = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      bidsBackHandler = _ref2.bidsBackHandler,
      timeout = _ref2.timeout,
      adUnits = _ref2.adUnits,
      adUnitCodes = _ref2.adUnitCodes,
      labels = _ref2.labels,
      auctionId = _ref2.auctionId,
      ttlBuffer = _ref2.ttlBuffer,
      ortb2 = _ref2.ortb2,
      metrics = _ref2.metrics,
      defer = _ref2.defer;
    _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(REQUEST_BIDS);
    var cbTimeout = timeout || _config_js__WEBPACK_IMPORTED_MODULE_11__.config.getConfig('bidderTimeout');
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.requestBids", arguments);
    if (adUnitCodes && adUnitCodes.length) {
      // if specific adUnitCodes supplied filter adUnits for those codes
      adUnits = adUnits.filter(function (unit) {
        return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.includes)(adUnitCodes, unit.code);
      });
    } else {
      // otherwise derive adUnitCodes from adUnits
      adUnitCodes = adUnits && adUnits.map(function (unit) {
        return unit.code;
      });
    }
    var ortb2Fragments = {
      global: (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, _config_js__WEBPACK_IMPORTED_MODULE_11__.config.getAnyConfig('ortb2') || {}, ortb2 || {}),
      bidder: Object.fromEntries(Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_11__.config.getBidderConfig()).map(function (_ref3) {
        var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_16__["default"])(_ref3, 2),
          bidder = _ref4[0],
          cfg = _ref4[1];
        return [bidder, cfg.ortb2];
      }).filter(function (_ref5) {
        var _ref6 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_16__["default"])(_ref5, 2),
          _ = _ref6[0],
          ortb2 = _ref6[1];
        return ortb2 != null;
      }))
    };
    return (0,_fpd_enrichment_js__WEBPACK_IMPORTED_MODULE_17__.enrichFPD)(_utils_promise_js__WEBPACK_IMPORTED_MODULE_18__.GreedyPromise.resolve(ortb2Fragments.global)).then(function (global) {
      ortb2Fragments.global = global;
      return startAuction({
        bidsBackHandler: bidsBackHandler,
        timeout: cbTimeout,
        adUnits: adUnits,
        adUnitCodes: adUnitCodes,
        labels: labels,
        auctionId: auctionId,
        ttlBuffer: ttlBuffer,
        ortb2Fragments: ortb2Fragments,
        metrics: metrics,
        defer: defer
      });
    });
  }, 'requestBids');
  return (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.wrapHook)(delegate, function requestBids() {
    var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // unlike the main body of `delegate`, this runs before any other hook has a chance to;
    // it's also not restricted in its return value in the way `async` hooks are.

    // if the request does not specify adUnits, clone the global adUnit array;
    // otherwise, if the caller goes on to use addAdUnits/removeAdUnits, any asynchronous logic
    // in any hook might see their effects.
    var adUnits = req.adUnits || pbjsInstance.adUnits;
    req.adUnits = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(adUnits) ? adUnits.slice() : [adUnits];
    req.metrics = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_19__.newMetrics)();
    req.metrics.checkpoint('requestBids');
    req.defer = (0,_utils_promise_js__WEBPACK_IMPORTED_MODULE_18__.defer)({
      promiseFactory: function promiseFactory(r) {
        return new Promise(r);
      }
    });
    delegate.call(this, req);
    return req.defer.promise;
  });
}();
var startAuction = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function () {
  var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    bidsBackHandler = _ref7.bidsBackHandler,
    cbTimeout = _ref7.timeout,
    adUnits = _ref7.adUnits,
    ttlBuffer = _ref7.ttlBuffer,
    adUnitCodes = _ref7.adUnitCodes,
    labels = _ref7.labels,
    auctionId = _ref7.auctionId,
    ortb2Fragments = _ref7.ortb2Fragments,
    metrics = _ref7.metrics,
    defer = _ref7.defer;
  var s2sBidders = (0,_adapterManager_js__WEBPACK_IMPORTED_MODULE_10__.getS2SBidderSet)(_config_js__WEBPACK_IMPORTED_MODULE_11__.config.getConfig('s2sConfig') || []);
  adUnits = (0,_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_19__.useMetrics)(metrics).measureTime('requestBids.validate', function () {
    return checkAdUnitSetup(adUnits);
  });
  function auctionDone(bids, timedOut, auctionId) {
    if (typeof bidsBackHandler === 'function') {
      try {
        bidsBackHandler(bids, timedOut, auctionId);
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error executing bidsBackHandler', null, e);
      }
    }
    defer.resolve({
      bids: bids,
      timedOut: timedOut,
      auctionId: auctionId
    });
  }

  /*
   * for a given adunit which supports a set of mediaTypes
   * and a given bidder which supports a set of mediaTypes
   * a bidder is eligible to participate on the adunit
   * if it supports at least one of the mediaTypes on the adunit
   */
  adUnits.forEach(function (adUnit) {
    var _adUnit$ortb2Imp, _adUnit$ortb2Imp$ext;
    // get the adunit's mediaTypes, defaulting to banner if mediaTypes isn't present
    var adUnitMediaTypes = Object.keys(adUnit.mediaTypes || {
      'banner': 'banner'
    });

    // get the bidder's mediaTypes
    var allBidders = adUnit.bids.map(function (bid) {
      return bid.bidder;
    });
    var bidderRegistry = _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].bidderRegistry;
    var bidders = allBidders.filter(function (bidder) {
      return !s2sBidders.has(bidder);
    });
    var tid = ((_adUnit$ortb2Imp = adUnit.ortb2Imp) === null || _adUnit$ortb2Imp === void 0 ? void 0 : (_adUnit$ortb2Imp$ext = _adUnit$ortb2Imp.ext) === null || _adUnit$ortb2Imp$ext === void 0 ? void 0 : _adUnit$ortb2Imp$ext.tid) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.generateUUID)();
    adUnit.transactionId = tid;
    if (ttlBuffer != null && !adUnit.hasOwnProperty('ttlBuffer')) {
      adUnit.ttlBuffer = ttlBuffer;
    }
    // Populate ortb2Imp.ext.tid with transactionId. Specifying a transaction ID per item in the ortb impression array, lets multiple transaction IDs be transmitted in a single bid request.
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_20__.dset)(adUnit, 'ortb2Imp.ext.tid', tid);
    bidders.forEach(function (bidder) {
      var adapter = bidderRegistry[bidder];
      var spec = adapter && adapter.getSpec && adapter.getSpec();
      // banner is default if not specified in spec
      var bidderMediaTypes = spec && spec.supportedMediaTypes || ['banner'];

      // check if the bidder's mediaTypes are not in the adUnit's mediaTypes
      var bidderEligible = adUnitMediaTypes.some(function (type) {
        return (0,_polyfill_js__WEBPACK_IMPORTED_MODULE_15__.includes)(bidderMediaTypes, type);
      });
      if (!bidderEligible) {
        // drop the bidder from the ad unit if it's not compatible
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.unsupportedBidderMessage)(adUnit, bidder));
        adUnit.bids = adUnit.bids.filter(function (bid) {
          return bid.bidder !== bidder;
        });
      } else {
        _adUnits_js__WEBPACK_IMPORTED_MODULE_21__.adunitCounter.incrementBidderRequestsCounter(adUnit.code, bidder);
      }
    });
    _adUnits_js__WEBPACK_IMPORTED_MODULE_21__.adunitCounter.incrementRequestsCounter(adUnit.code);
  });
  if (!adUnits || adUnits.length === 0) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logMessage)('No adUnits configured. No bids requested.');
    auctionDone();
  } else {
    var auction = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.createAuction({
      adUnits: adUnits,
      adUnitCodes: adUnitCodes,
      callback: auctionDone,
      cbTimeout: cbTimeout,
      labels: labels,
      auctionId: auctionId,
      ortb2Fragments: ortb2Fragments,
      metrics: metrics
    });
    var adUnitsLen = adUnits.length;
    if (adUnitsLen > 15) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Current auction ".concat(auction.getAuctionId(), " contains ").concat(adUnitsLen, " adUnits."), adUnits);
    }
    adUnitCodes.forEach(function (code) {
      return _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.setLatestAuctionForAdUnit(code, auction.getAuctionId());
    });
    auction.callBids();
  }
}, 'startAuction');
function executeCallbacks(fn, reqBidsConfigObj) {
  runAll(_storageManager_js__WEBPACK_IMPORTED_MODULE_22__.storageCallbacks);
  runAll(enableAnalyticsCallbacks);
  fn.call(this, reqBidsConfigObj);
  function runAll(queue) {
    var queued;
    while (queued = queue.shift()) {
      queued();
    }
  }
}

// This hook will execute all storage callbacks which were registered before gdpr enforcement hook was added. Some bidders, user id modules use storage functions when module is parsed but gdpr enforcement hook is not added at that stage as setConfig callbacks are yet to be called. Hence for such calls we execute all the stored callbacks just before requestBids. At this hook point we will know for sure that gdprEnforcement module is added or not
pbjsInstance.requestBids.before(executeCallbacks, 49);

/**
 *
 * Add adunit(s)
 * @param {Array|Object} adUnitArr Array of adUnits or single adUnit Object.
 * @alias module:pbjs.addAdUnits
 */
pbjsInstance.addAdUnits = function (adUnitArr) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.addAdUnits", arguments);
  pbjsInstance.adUnits.push.apply(pbjsInstance.adUnits, (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(adUnitArr) ? adUnitArr : [adUnitArr]);
  // emit event
  _events_js__WEBPACK_IMPORTED_MODULE_7__.emit(ADD_AD_UNITS);
};

/**
 * @param {string} event the name of the event
 * @param {Function} handler a callback to set on event
 * @param {string} id an identifier in the context of the event
 * @alias module:pbjs.onEvent
 *
 * This API call allows you to register a callback to handle a Prebid.js event.
 * An optional `id` parameter provides more finely-grained event callback registration.
 * This makes it possible to register callback events for a specific item in the
 * event context. For example, `bidWon` events will accept an `id` for ad unit code.
 * `bidWon` callbacks registered with an ad unit code id will be called when a bid
 * for that ad unit code wins the auction. Without an `id` this method registers the
 * callback for every `bidWon` event.
 *
 * Currently `bidWon` is the only event that accepts an `id` parameter.
 */
pbjsInstance.onEvent = function (event, handler, id) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.onEvent", arguments);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(handler)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('The event handler provided is not a function and was not set on event "' + event + '".');
    return;
  }
  if (id && !eventValidators[event].call(null, id)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('The id provided is not valid for event "' + event + '" and no handler was set.');
    return;
  }
  _events_js__WEBPACK_IMPORTED_MODULE_7__.on(event, handler, id);
};

/**
 * @param {string} event the name of the event
 * @param {Function} handler a callback to remove from the event
 * @param {string} id an identifier in the context of the event (see `$$PREBID_GLOBAL$$.onEvent`)
 * @alias module:pbjs.offEvent
 */
pbjsInstance.offEvent = function (event, handler, id) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.offEvent", arguments);
  if (id && !eventValidators[event].call(null, id)) {
    return;
  }
  _events_js__WEBPACK_IMPORTED_MODULE_7__.off(event, handler, id);
};

/**
 * Return a copy of all events emitted
 *
 * @alias module:pbjs.getEvents
 */
pbjsInstance.getEvents = function () {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.getEvents");
  return _events_js__WEBPACK_IMPORTED_MODULE_7__.getEvents();
};

/*
 * Wrapper to register bidderAdapter externally (adapterManager.registerBidAdapter())
 * @param  {Function} bidderAdaptor [description]
 * @param  {string} bidderCode [description]
 * @alias module:pbjs.registerBidAdapter
 */
pbjsInstance.registerBidAdapter = function (bidderAdaptor, bidderCode) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.registerBidAdapter", arguments);
  try {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].registerBidAdapter(bidderAdaptor(), bidderCode);
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error registering bidder adapter : ' + e.message);
  }
};

/**
 * Wrapper to register analyticsAdapter externally (adapterManager.registerAnalyticsAdapter())
 * @param  {Object} options [description]
 * @alias module:pbjs.registerAnalyticsAdapter
 */
pbjsInstance.registerAnalyticsAdapter = function (options) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.registerAnalyticsAdapter", arguments);
  try {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].registerAnalyticsAdapter(options);
  } catch (e) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error registering analytics adapter : ' + e.message);
  }
};

/**
 * Wrapper to bidfactory.createBid()
 * @param  {string} statusCode [description]
 * @alias module:pbjs.createBid
 * @return {Object} bidResponse [description]
 */
pbjsInstance.createBid = function (statusCode) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.createBid", arguments);
  return (0,_bidfactory_js__WEBPACK_IMPORTED_MODULE_23__.createBid)(statusCode);
};

/**
 * Enable sending analytics data to the analytics provider of your
 * choice.
 *
 * For usage, see [Integrate with the Prebid Analytics
 * API](http://prebid.org/dev-docs/integrate-with-the-prebid-analytics-api.html).
 *
 * For a list of analytics adapters, see [Analytics for
 * Prebid](http://prebid.org/overview/analytics.html).
 * @param  {Object} config
 * @param {string} config.provider The name of the provider, e.g., `"ga"` for Google Analytics.
 * @param {Object} config.options The options for this particular analytics adapter.  This will likely vary between adapters.
 * @alias module:pbjs.enableAnalytics
 */

// Stores 'enableAnalytics' callbacks for later execution.
var enableAnalyticsCallbacks = [];
var enableAnalyticsCb = (0,_hook_js__WEBPACK_IMPORTED_MODULE_8__.hook)('async', function (config) {
  if (config && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(config)) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.enableAnalytics for: ", config);
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].enableAnalytics(config);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("pbjs.enableAnalytics should be called with option {}");
  }
}, 'enableAnalyticsCb');
pbjsInstance.enableAnalytics = function (config) {
  enableAnalyticsCallbacks.push(enableAnalyticsCb.bind(this, config));
};

/**
 * @alias module:pbjs.aliasBidder
 */
pbjsInstance.aliasBidder = function (bidderCode, alias, options) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logInfo)("Invoking pbjs.aliasBidder", arguments);
  if (bidderCode && alias) {
    _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].aliasBidAdapter(bidderCode, alias, options);
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('bidderCode and alias must be passed as arguments', "pbjs.aliasBidder");
  }
};

/**
 * @alias module:pbjs.aliasRegistry
 */
pbjsInstance.aliasRegistry = _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].aliasRegistry;
_config_js__WEBPACK_IMPORTED_MODULE_11__.config.getConfig('aliasRegistry', function (config) {
  if (config.aliasRegistry === 'private') delete pbjsInstance.aliasRegistry;
});

/**
 * The bid response object returned by an external bidder adapter during the auction.
 * @typedef {Object} AdapterBidResponse
 * @property {string} pbAg Auto granularity price bucket; CPM <= 5 ? increment = 0.05 : CPM > 5 && CPM <= 10 ? increment = 0.10 : CPM > 10 && CPM <= 20 ? increment = 0.50 : CPM > 20 ? priceCap = 20.00.  Example: `"0.80"`.
 * @property {string} pbCg Custom price bucket.  For example setup, see {@link setPriceGranularity}.  Example: `"0.84"`.
 * @property {string} pbDg Dense granularity price bucket; CPM <= 3 ? increment = 0.01 : CPM > 3 && CPM <= 8 ? increment = 0.05 : CPM > 8 && CPM <= 20 ? increment = 0.50 : CPM > 20? priceCap = 20.00.  Example: `"0.84"`.
 * @property {string} pbLg Low granularity price bucket; $0.50 increment, capped at $5, floored to two decimal places.  Example: `"0.50"`.
 * @property {string} pbMg Medium granularity price bucket; $0.10 increment, capped at $20, floored to two decimal places.  Example: `"0.80"`.
 * @property {string} pbHg High granularity price bucket; $0.01 increment, capped at $20, floored to two decimal places.  Example: `"0.84"`.
 *
 * @property {string} bidder The string name of the bidder.  This *may* be the same as the `bidderCode`.  For For a list of all bidders and their codes, see [Bidders' Params](http://prebid.org/dev-docs/bidders.html).
 * @property {string} bidderCode The unique string that identifies this bidder.  For a list of all bidders and their codes, see [Bidders' Params](http://prebid.org/dev-docs/bidders.html).
 *
 * @property {string} requestId The [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) representing the bid request.
 * @property {number} requestTimestamp The time at which the bid request was sent out, expressed in milliseconds.
 * @property {number} responseTimestamp The time at which the bid response was received, expressed in milliseconds.
 * @property {number} timeToRespond How long it took for the bidder to respond with this bid, expressed in milliseconds.
 *
 * @property {string} size The size of the ad creative, expressed in `"AxB"` format, where A and B are numbers of pixels.  Example: `"320x50"`.
 * @property {string} width The width of the ad creative in pixels.  Example: `"320"`.
 * @property {string} height The height of the ad creative in pixels.  Example: `"50"`.
 *
 * @property {string} ad The actual ad creative content, often HTML with CSS, JavaScript, and/or links to additional content.  Example: `"<div id='beacon_-YQbipJtdxmMCgEPHExLhmqzEm' style='position: absolute; left: 0px; top: 0px; visibility: hidden;'><img src='http://aplus-...'/></div><iframe src=\"http://aax-us-east.amazon-adsystem.com/e/is/8dcfcd..." width=\"728\" height=\"90\" frameborder=\"0\" ...></iframe>",`.
 * @property {number} ad_id The ad ID of the creative, as understood by the bidder's system.  Used by the line item's [creative in the ad server](http://prebid.org/adops/send-all-bids-adops.html#step-3-add-a-creative).
 * @property {string} adUnitCode The code used to uniquely identify the ad unit on the publisher's page.
 *
 * @property {string} statusMessage The status of the bid.  Allowed values: `"Bid available"` or `"Bid returned empty or error response"`.
 * @property {number} cpm The exact bid price from the bidder, expressed to the thousandths place.  Example: `"0.849"`.
 *
 * @property {Object} adserverTargeting An object whose values represent the ad server's targeting on the bid.
 * @property {string} adserverTargeting.hb_adid The ad ID of the creative, as understood by the ad server.
 * @property {string} adserverTargeting.hb_pb The price paid to show the creative, as logged in the ad server.
 * @property {string} adserverTargeting.hb_bidder The winning bidder whose ad creative will be served by the ad server.
 */

/**
 * Get all of the bids that have been rendered.  Useful for [troubleshooting your integration](http://prebid.org/dev-docs/prebid-troubleshooting-guide.html).
 * @return {Array<AdapterBidResponse>} A list of bids that have been rendered.
 */
pbjsInstance.getAllWinningBids = function () {
  return _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getAllWinningBids();
};

/**
 * Get all of the bids that have won their respective auctions.
 * @return {Array<AdapterBidResponse>} A list of bids that have won their respective auctions.
 */
pbjsInstance.getAllPrebidWinningBids = function () {
  return _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getBidsReceived().filter(function (bid) {
    return bid.status === _constants_json__WEBPACK_IMPORTED_MODULE_2__.BID_STATUS.BID_TARGETING_SET;
  });
};

/**
 * Get array of highest cpm bids for all adUnits, or highest cpm bid
 * object for the given adUnit
 * @param {string} adUnitCode - optional ad unit code
 * @alias module:pbjs.getHighestCpmBids
 * @return {Array} array containing highest cpm bid object(s)
 */
pbjsInstance.getHighestCpmBids = function (adUnitCode) {
  return _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.getWinningBids(adUnitCode);
};
if (true) {
  /**
   * Mark the winning bid as used, should only be used in conjunction with video
   * @typedef {Object} MarkBidRequest
   * @property {string} adUnitCode The ad unit code
   * @property {string} adId The id representing the ad we want to mark
   *
   * @alias module:pbjs.markWinningBidAsUsed
   */
  pbjsInstance.markWinningBidAsUsed = function (markBidRequest) {
    var bids = fetchReceivedBids(markBidRequest, 'Improper use of markWinningBidAsUsed. It needs an adUnitCode or an adId to function.');
    if (bids.length > 0) {
      _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.addWinningBid(bids[0]);
    }
  };
}
var fetchReceivedBids = function fetchReceivedBids(bidRequest, warningMessage) {
  var bids = [];
  if (bidRequest.adUnitCode && bidRequest.adId) {
    bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getBidsReceived().filter(function (bid) {
      return bid.adId === bidRequest.adId && bid.adUnitCode === bidRequest.adUnitCode;
    });
  } else if (bidRequest.adUnitCode) {
    bids = _targeting_js__WEBPACK_IMPORTED_MODULE_9__.targeting.getWinningBids(bidRequest.adUnitCode);
  } else if (bidRequest.adId) {
    bids = _auctionManager_js__WEBPACK_IMPORTED_MODULE_5__.auctionManager.getBidsReceived().filter(function (bid) {
      return bid.adId === bidRequest.adId;
    });
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)(warningMessage);
  }
  return bids;
};

/**
 * Get Prebid config options
 * @param {Object} options
 * @alias module:pbjs.getConfig
 */
pbjsInstance.getConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.getAnyConfig;
pbjsInstance.readConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.readAnyConfig;
pbjsInstance.mergeConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.mergeConfig;
pbjsInstance.mergeBidderConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.mergeBidderConfig;

/**
 * Set Prebid config options.
 * See https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html
 *
 * @param {Object} options Global Prebid configuration object. Must be JSON - no JavaScript functions are allowed.
 */
pbjsInstance.setConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.setConfig;
pbjsInstance.setBidderConfig = _config_js__WEBPACK_IMPORTED_MODULE_11__.config.setBidderConfig;
pbjsInstance.que.push(function () {
  return (0,_secureCreatives_js__WEBPACK_IMPORTED_MODULE_24__.listenMessagesFromCreative)();
});

/**
 * This queue lets users load Prebid asynchronously, but run functions the same way regardless of whether it gets loaded
 * before or after their script executes. For example, given the code:
 *
 * <script src="url/to/Prebid.js" async></script>
 * <script>
 *   var pbjs = pbjs || {};
 *   pbjs.cmd = pbjs.cmd || [];
 *   pbjs.cmd.push(functionToExecuteOncePrebidLoads);
 * </script>
 *
 * If the page's script runs before prebid loads, then their function gets added to the queue, and executed
 * by prebid once it's done loading. If it runs after prebid loads, then this monkey-patch causes their
 * function to execute immediately.
 *
 * @memberof pbjs
 * @param  {function} command A function which takes no arguments. This is guaranteed to run exactly once, and only after
 *                            the Prebid script has been fully loaded.
 * @alias module:pbjs.cmd.push
 */
pbjsInstance.cmd.push = function (command) {
  if (typeof command === 'function') {
    try {
      command.call();
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error processing command :', e.message, e.stack);
    }
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("Commands written into pbjs.cmd.push must be wrapped in a function");
  }
};
pbjsInstance.que.push = pbjsInstance.cmd.push;
function processQueue(queue) {
  queue.forEach(function (cmd) {
    if (typeof cmd.called === 'undefined') {
      try {
        cmd.call();
        cmd.called = true;
      } catch (e) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error processing command :', 'prebid.js', e);
      }
    }
  });
}

/**
 * @alias module:pbjs.processQueue
 */
pbjsInstance.processQueue = function () {
  _hook_js__WEBPACK_IMPORTED_MODULE_8__.hook.ready();
  processQueue(pbjsInstance.que);
  processQueue(pbjsInstance.cmd);
};

/**
 * @alias module:pbjs.triggerBilling
 */
pbjsInstance.triggerBilling = function (winningBid) {
  var bids = fetchReceivedBids(winningBid, 'Improper use of triggerBilling. It requires a bid with at least an adUnitCode or an adId to function.');
  var triggerBillingBid = bids.find(function (bid) {
    return bid.requestId === winningBid.requestId;
  }) || bids[0];
  if (bids.length > 0 && triggerBillingBid) {
    try {
      _adapterManager_js__WEBPACK_IMPORTED_MODULE_10__["default"].callBidBillableBidder(triggerBillingBid);
    } catch (e) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('Error when triggering billing :', e);
    }
  } else {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('The bid provided to triggerBilling did not match any bids received.');
  }
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (pbjsInstance);
}();
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ })()
;

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["fledgeForGpt"],{

/***/ "./modules/fledgeForGpt.js":
/*!*********************************!*\
  !*** ./modules/fledgeForGpt.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports isEnabled, init, addComponentAuctionHook, markForFledge, setImpExtAe, parseExtPrebidFledge, setResponseFledgeConfigs */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/pbjsORTB.js */ "./src/pbjsORTB.js");

/**
 * Fledge modules is responsible for registering fledged auction configs into the GPT slot;
 * GPT is resposible to run the fledge auction.
 */




var MODULE = 'fledgeForGpt';
var isEnabled = false;
_src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('fledgeForGpt', function (config) {
  return init(config.fledgeForGpt);
});

/**
  * Module init.
  */
function init(cfg) {
  if (cfg && cfg.enabled === true) {
    if (!isEnabled) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('addComponentAuction').before(addComponentAuctionHook);
      isEnabled = true;
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)("".concat(MODULE, " enabled (browser ").concat(isFledgeSupported() ? 'supports' : 'does NOT support', " fledge)"), cfg);
  } else {
    if (isEnabled) {
      (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('addComponentAuction').getHooks({
        hook: addComponentAuctionHook
      }).remove();
      isEnabled = false;
    }
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)("".concat(MODULE, " disabled"), cfg);
  }
}
function addComponentAuctionHook(next, adUnitCode, componentAuctionConfig) {
  var seller = componentAuctionConfig.seller;
  var gptSlot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.getGptSlotForAdUnitCode)(adUnitCode);
  if (gptSlot && gptSlot.setConfig) {
    gptSlot.setConfig({
      componentAuction: [{
        configKey: seller,
        auctionConfig: componentAuctionConfig
      }]
    });
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logInfo)(MODULE, "register component auction config for: ".concat(adUnitCode, " x ").concat(seller, ": ").concat(gptSlot.getAdUnitPath()), componentAuctionConfig);
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)(MODULE, "unable to register component auction config for: ".concat(adUnitCode, " x ").concat(seller, "."));
  }
  next(adUnitCode, componentAuctionConfig);
}
function isFledgeSupported() {
  return 'runAdAuction' in navigator && 'joinAdInterestGroup' in navigator;
}
function markForFledge(next, bidderRequests) {
  if (isFledgeSupported()) {
    bidderRequests.forEach(function (req) {
      req.fledgeEnabled = _src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.runWithBidder(req.bidderCode, function () {
        return _src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('fledgeEnabled');
      });
    });
  }
  next(bidderRequests);
}
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_1__.getHook)('makeBidRequests').after(markForFledge);
function setImpExtAe(imp, bidRequest, context) {
  if (!context.bidderRequest.fledgeEnabled) {
    var _imp$ext;
    (_imp$ext = imp.ext) === null || _imp$ext === void 0 ? true : delete _imp$ext.ae;
  }
}
(0,_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.registerOrtbProcessor)({
  type: _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.IMP,
  name: 'impExtAe',
  fn: setImpExtAe
});

// to make it easier to share code between the PBS adapter and adapters whose backend is PBS, break up
// fledge response processing in two steps: first aggregate all the auction configs by their imp...

function parseExtPrebidFledge(response, ortbResponse, context) {
  var _ortbResponse$ext, _ortbResponse$ext$pre, _ortbResponse$ext$pre2;
  (((_ortbResponse$ext = ortbResponse.ext) === null || _ortbResponse$ext === void 0 ? void 0 : (_ortbResponse$ext$pre = _ortbResponse$ext.prebid) === null || _ortbResponse$ext$pre === void 0 ? void 0 : (_ortbResponse$ext$pre2 = _ortbResponse$ext$pre.fledge) === null || _ortbResponse$ext$pre2 === void 0 ? void 0 : _ortbResponse$ext$pre2.auctionconfigs) || []).forEach(function (cfg) {
    var _impCtx$imp, _impCtx$imp$ext;
    var impCtx = context.impContext[cfg.impid];
    if (!(impCtx !== null && impCtx !== void 0 && (_impCtx$imp = impCtx.imp) !== null && _impCtx$imp !== void 0 && (_impCtx$imp$ext = _impCtx$imp.ext) !== null && _impCtx$imp$ext !== void 0 && _impCtx$imp$ext.ae)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logWarn)('Received fledge auction configuration for an impression that was not in the request or did not ask for it', cfg, impCtx === null || impCtx === void 0 ? void 0 : impCtx.imp);
    } else {
      impCtx.fledgeConfigs = impCtx.fledgeConfigs || [];
      impCtx.fledgeConfigs.push(cfg);
    }
  });
}
(0,_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.registerOrtbProcessor)({
  type: _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.RESPONSE,
  name: 'extPrebidFledge',
  fn: parseExtPrebidFledge,
  dialects: [_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.PBS]
});

// ...then, make them available in the adapter's response. This is the client side version, for which the
// interpretResponse api is {fledgeAuctionConfigs: [{bidId, config}]}

function setResponseFledgeConfigs(response, ortbResponse, context) {
  var configs = Object.values(context.impContext).flatMap(function (impCtx) {
    return (impCtx.fledgeConfigs || []).map(function (cfg) {
      return {
        bidId: impCtx.bidRequest.bidId,
        config: cfg.config
      };
    });
  });
  if (configs.length > 0) {
    response.fledgeAuctionConfigs = configs;
  }
}
(0,_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.registerOrtbProcessor)({
  type: _src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.RESPONSE,
  name: 'fledgeAuctionConfigs',
  priority: -1,
  fn: setResponseFledgeConfigs,
  dialects: [_src_pbjsORTB_js__WEBPACK_IMPORTED_MODULE_3__.PBS]
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_4__.registerModule)('fledgeForGpt');

/***/ }),

/***/ "./src/pbjsORTB.js":
/*!*************************!*\
  !*** ./src/pbjsORTB.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IMP": function() { return /* binding */ IMP; },
/* harmony export */   "PBS": function() { return /* binding */ PBS; },
/* harmony export */   "RESPONSE": function() { return /* binding */ RESPONSE; },
/* harmony export */   "registerOrtbProcessor": function() { return /* binding */ registerOrtbProcessor; }
/* harmony export */ });
/* unused harmony exports PROCESSOR_TYPES, PROCESSOR_DIALECTS, REQUEST, BID_RESPONSE, DEFAULT, processorRegistry, getProcessors */
var PROCESSOR_TYPES = ['request', 'imp', 'bidResponse', 'response'];
var PROCESSOR_DIALECTS = ['default', 'pbs'];
var REQUEST = PROCESSOR_TYPES[0],
  IMP = PROCESSOR_TYPES[1],
  BID_RESPONSE = PROCESSOR_TYPES[2],
  RESPONSE = PROCESSOR_TYPES[3];

var DEFAULT = PROCESSOR_DIALECTS[0],
  PBS = PROCESSOR_DIALECTS[1];

var types = new Set(PROCESSOR_TYPES);
function processorRegistry() {
  var processors = {};
  return {
    registerOrtbProcessor: function registerOrtbProcessor(_ref) {
      var type = _ref.type,
        name = _ref.name,
        fn = _ref.fn,
        _ref$priority = _ref.priority,
        priority = _ref$priority === void 0 ? 0 : _ref$priority,
        _ref$dialects = _ref.dialects,
        dialects = _ref$dialects === void 0 ? [DEFAULT] : _ref$dialects;
      if (!types.has(type)) {
        throw new Error("ORTB processor type must be one of: ".concat(PROCESSOR_TYPES.join(', ')));
      }
      dialects.forEach(function (dialect) {
        if (!processors.hasOwnProperty(dialect)) {
          processors[dialect] = {};
        }
        if (!processors[dialect].hasOwnProperty(type)) {
          processors[dialect][type] = {};
        }
        processors[dialect][type][name] = {
          priority: priority,
          fn: fn
        };
      });
    },
    getProcessors: function getProcessors(dialect) {
      return processors[dialect] || {};
    }
  };
}
var _processorRegistry = processorRegistry(),
  registerOrtbProcessor = _processorRegistry.registerOrtbProcessor,
  getProcessors = _processorRegistry.getProcessors;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./modules/fledgeForGpt.js"));
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["fpdModule"],{

/***/ "./modules/fpdModule/index.js":
/*!************************************!*\
  !*** ./modules/fpdModule/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports registerSubmodules, reset, processFpd, startAuctionHook */
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/config.js */ "./src/config.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/utils/perfMetrics.js */ "./src/utils/perfMetrics.js");

/**
 * This module sets default values and validates ortb2 first part data
 * @module modules/firstPartyData
 */





var submodules = [];
function registerSubmodules(submodule) {
  submodules.push(submodule);
}
function reset() {
  submodules.length = 0;
}
function processFpd() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$global = _ref.global,
    global = _ref$global === void 0 ? {} : _ref$global,
    _ref$bidder = _ref.bidder,
    bidder = _ref$bidder === void 0 ? {} : _ref$bidder;
  var modConf = _src_config_js__WEBPACK_IMPORTED_MODULE_0__.config.getConfig('firstPartyData') || {};
  var result = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise.resolve({
    global: global,
    bidder: bidder
  });
  submodules.sort(function (a, b) {
    return (a.queue || 1) - (b.queue || 1);
  }).forEach(function (submodule) {
    result = result.then(function (_ref2) {
      var global = _ref2.global,
        bidder = _ref2.bidder;
      return _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_1__.GreedyPromise.resolve(submodule.processFpd(modConf, {
        global: global,
        bidder: bidder
      })).catch(function (err) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.logError)("Error in FPD module ".concat(submodule.name), err);
        return {};
      }).then(function (result) {
        return {
          global: result.global || global,
          bidder: result.bidder || bidder
        };
      });
    });
  });
  return result;
}
var startAuctionHook = (0,_src_utils_perfMetrics_js__WEBPACK_IMPORTED_MODULE_3__.timedAuctionHook)('fpd', function startAuctionHook(fn, req) {
  var _this = this;
  processFpd(req.ortb2Fragments).then(function (ortb2Fragments) {
    Object.assign(req.ortb2Fragments, ortb2Fragments);
    fn.call(_this, req);
  });
});
function setupHook() {
  (0,_src_hook_js__WEBPACK_IMPORTED_MODULE_4__.getHook)('startAuction').before(startAuctionHook, 10);
}
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_4__.module)('firstPartyData', registerSubmodules);

// Runs setupHook on initial load
setupHook();
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_5__.registerModule)('fpdModule');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./modules/fpdModule/index.js"));
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["ixBidAdapter"],{

/***/ "./modules/ixBidAdapter.js":
/*!*********************************!*\
  !*** ./modules/ixBidAdapter.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports ERROR_CODES, LOCAL_STORAGE_FEATURE_TOGGLES_KEY, storage, FEATURE_TOGGLES, spec */
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dlv/index.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/utils.js */ "./node_modules/dset/dist/index.mjs");
/* harmony import */ var _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/mediaTypes.js */ "./src/mediaTypes.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_constants_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../src/constants.json */ "./src/constants.json");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_events_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../src/events.js */ "./src/events.js");
/* harmony import */ var _src_polyfill_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../src/adapters/bidderFactory.js */ "./src/adapters/bidderFactory.js");
/* harmony import */ var _src_video_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/video.js */ "./src/video.js");
/* harmony import */ var _src_Renderer_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../src/Renderer.js */ "./src/Renderer.js");




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }











var BIDDER_CODE = 'ix';
var ALIAS_BIDDER_CODE = 'roundel';
var GLOBAL_VENDOR_ID = 10;
var SECURE_BID_URL = 'https://htlb.casalemedia.com/openrtb/pbjs';
var SUPPORTED_AD_TYPES = [_src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE];
var BANNER_ENDPOINT_VERSION = 7.2;
var VIDEO_ENDPOINT_VERSION = 8.1;
var CENT_TO_DOLLAR_FACTOR = 100;
var BANNER_TIME_TO_LIVE = 300;
var VIDEO_TIME_TO_LIVE = 3600; // 1hr
var NATIVE_TIME_TO_LIVE = 3600; // Since native can have video, use ttl same as video
var NET_REVENUE = true;
var MAX_REQUEST_LIMIT = 4;
var OUTSTREAM_MINIMUM_PLAYER_SIZE = [144, 144];
var PRICE_TO_DOLLAR_FACTOR = {
  JPY: 1
};
var IFRAME_USER_SYNC_URL = 'https://js-sec.indexww.com/um/ixmatch.html';
var FLOOR_SOURCE = {
  PBJS: 'p',
  IX: 'x'
};
var IMG_USER_SYNC_URL = 'https://dsum.casalemedia.com/pbusermatch?origin=prebid';
var ERROR_CODES = {
  BID_SIZE_INVALID_FORMAT: 1,
  BID_SIZE_NOT_INCLUDED: 2,
  PROPERTY_NOT_INCLUDED: 3,
  SITE_ID_INVALID_VALUE: 4,
  BID_FLOOR_INVALID_FORMAT: 5,
  IX_FPD_EXCEEDS_MAX_SIZE: 6,
  EXCEEDS_MAX_SIZE: 7,
  PB_FPD_EXCEEDS_MAX_SIZE: 8,
  VIDEO_DURATION_INVALID: 9
};
var FIRST_PARTY_DATA = {
  SITE: ['id', 'name', 'domain', 'cat', 'sectioncat', 'pagecat', 'page', 'ref', 'search', 'mobile', 'privacypolicy', 'publisher', 'content', 'keywords', 'ext'],
  USER: ['id', 'buyeruid', 'yob', 'gender', 'keywords', 'customdata', 'geo', 'data', 'ext']
};
var SOURCE_RTI_MAPPING = {
  'liveramp.com': 'idl',
  'netid.de': 'NETID',
  'neustar.biz': 'fabrickId',
  'zeotap.com': 'zeotapIdPlus',
  'uidapi.com': 'UID2',
  'adserver.org': 'TDID',
  'id5-sync.com': '',
  // ID5 Universal ID, configured as id5Id
  'crwdcntrl.net': '',
  // Lotame Panorama ID, lotamePanoramaId
  'epsilon.com': '',
  // Publisher Link, publinkId
  'audigent.com': '',
  // Hadron ID from Audigent, hadronId
  'pubcid.org': '',
  // SharedID, pubcid
  'trustpid.com': '',
  // Trustpid
  'intimatemerger.com': ''
};
var PROVIDERS = ['britepoolid', 'lipbid', 'criteoId', 'merkleId', 'parrableId', 'connectid', 'tapadId', 'quantcastId', 'pubProvidedId'];
var REQUIRED_VIDEO_PARAMS = ['mimes', 'minduration', 'maxduration']; // note: protocol/protocols is also reqd
var VIDEO_PARAMS_ALLOW_LIST = ['mimes', 'minduration', 'maxduration', 'protocols', 'protocol', 'startdelay', 'placement', 'linearity', 'skip', 'skipmin', 'skipafter', 'sequence', 'battr', 'maxextended', 'minbitrate', 'maxbitrate', 'boxingallowed', 'playbackmethod', 'playbackend', 'delivery', 'pos', 'companionad', 'api', 'companiontype', 'ext', 'playerSize', 'w', 'h', 'plcmt'];
var LOCAL_STORAGE_KEY = 'ixdiag';
var LOCAL_STORAGE_FEATURE_TOGGLES_KEY = "".concat(BIDDER_CODE, "_features");
var hasRegisteredHandler = false;
var storage = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_2__.getStorageManager)({
  bidderCode: BIDDER_CODE
});
var FEATURE_TOGGLES = {
  // Update with list of CFTs to be requested from Exchange
  REQUESTED_FEATURE_TOGGLES: [],
  featureToggles: {},
  isFeatureEnabled: function isFeatureEnabled(ft) {
    return (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(this.featureToggles, "features.".concat(ft, ".activated"), false);
  },
  getFeatureToggles: function getFeatureToggles() {
    if (storage.localStorageIsEnabled()) {
      var parsedToggles = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.safeJSONParse)(storage.getDataFromLocalStorage(LOCAL_STORAGE_FEATURE_TOGGLES_KEY));
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(parsedToggles, 'expiry') && parsedToggles.expiry >= new Date().getTime()) {
        this.featureToggles = parsedToggles;
      } else {
        this.clearFeatureToggles();
      }
    }
  },
  setFeatureToggles: function setFeatureToggles(serverResponse) {
    var responseBody = serverResponse.body;
    var expiryTime = new Date();
    var toggles = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(responseBody, 'ext.features');
    if (toggles) {
      this.featureToggles = {
        expiry: expiryTime.setHours(expiryTime.getHours() + 1),
        features: toggles
      };
      if (storage.localStorageIsEnabled()) {
        storage.setDataInLocalStorage(LOCAL_STORAGE_FEATURE_TOGGLES_KEY, JSON.stringify(this.featureToggles));
      }
    }
  },
  clearFeatureToggles: function clearFeatureToggles() {
    this.featureToggles = {};
    if (storage.localStorageIsEnabled()) {
      storage.removeDataFromLocalStorage(LOCAL_STORAGE_FEATURE_TOGGLES_KEY);
    }
  }
};
var siteID = 0;
var gdprConsent = '';
var usPrivacy = '';
var defaultVideoPlacement = false;

// Possible values for bidResponse.seatBid[].bid[].mtype which indicates the type of the creative markup so that it can properly be associated with the right sub-object of the BidRequest.Imp.
var MEDIA_TYPES = {
  Banner: 1,
  Video: 2,
  Audio: 3,
  Native: 4
};

/**
 * Transform valid bid request config object to banner impression object that will be sent to ad server.
 *
 * @param  {object} bid A valid bid request config object
 * @return {object}     A impression object that will be sent to ad server.
 */
function bidToBannerImp(bid) {
  var imp = bidToImp(bid, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER);
  imp.banner = {};
  var impSize = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'params.size');
  if (impSize) {
    imp.banner.w = impSize[0];
    imp.banner.h = impSize[1];
  }
  imp.banner.topframe = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.inIframe)() ? 0 : 1;
  _applyFloor(bid, imp, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER);
  return imp;
}

/**
 * Transform valid bid request config object to video impression object that will be sent to ad server.
 *
 * @param  {object} bid A valid bid request config object.
 * @return {object}     A impression object that will be sent to ad server.
 */
function bidToVideoImp(bid) {
  var imp = bidToImp(bid, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO);
  var videoAdUnitRef = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video');
  var videoParamRef = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'params.video');
  var videoParamErrors = checkVideoParams(videoAdUnitRef, videoParamRef);
  if (videoParamErrors.length) {
    return {};
  }
  imp.video = videoParamRef ? (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(bid.params.video) : {};
  // populate imp level transactionId
  imp.ext.tid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'ortb2Imp.ext.tid');

  // AdUnit-Specific First Party Data
  addAdUnitFPD(imp, bid);

  // copy all video properties to imp object
  for (var adUnitProperty in videoAdUnitRef) {
    if (VIDEO_PARAMS_ALLOW_LIST.indexOf(adUnitProperty) !== -1 && !imp.video.hasOwnProperty(adUnitProperty)) {
      imp.video[adUnitProperty] = videoAdUnitRef[adUnitProperty];
    }
  }
  if (imp.video.minduration > imp.video.maxduration) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("IX Bid Adapter: video minduration [".concat(imp.video.minduration, "] cannot be greater than video maxduration [").concat(imp.video.maxduration, "]"), {
      bidder: BIDDER_CODE,
      code: ERROR_CODES.VIDEO_DURATION_INVALID
    });
    return {};
  }
  var context = videoParamRef && videoParamRef.context || videoAdUnitRef && videoAdUnitRef.context;
  verifyVideoPlcmt(imp);

  // if placement not already defined, pick one based on `context`
  if (context && !imp.video.hasOwnProperty('placement')) {
    if (context === _src_video_js__WEBPACK_IMPORTED_MODULE_5__.INSTREAM) {
      imp.video.placement = 1;
    } else if (context === _src_video_js__WEBPACK_IMPORTED_MODULE_5__.OUTSTREAM) {
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(videoParamRef, 'playerConfig.floatOnScroll')) {
        imp.video.placement = 5;
      } else {
        imp.video.placement = 3;
        defaultVideoPlacement = true;
      }
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("IX Bid Adapter: Video context '".concat(context, "' is not supported"));
    }
  }
  if (!(imp.video.w && imp.video.h)) {
    // Getting impression Size
    var impSize = getFirstSize((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(imp, 'video.playerSize')) || getFirstSize((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'params.size'));
    if (impSize) {
      imp.video.w = impSize[0];
      imp.video.h = impSize[1];
    } else {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('IX Bid Adapter: Video size is missing in [mediaTypes.video]');
      return {};
    }
  }
  _applyFloor(bid, imp, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO);
  return imp;
}
function verifyVideoPlcmt(imp) {
  if (imp.video.hasOwnProperty('plcmt') && (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isInteger)(imp.video.plcmt) || imp.video.plcmt < 1 || imp.video.plcmt > 4)) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("IX Bid Adapter: video.plcmt [".concat(imp.video.plcmt, "] must be an integer between 1-4 inclusive"));
    delete imp.video.plcmt;
  }
}

/**
 * Transform valid bid request config object to native impression object that will be sent to ad server.
 *
 * @param  {object} bid A valid bid request config object.
 * @return {object}     A impression object that will be sent to ad server.
 */
function bidToNativeImp(bid) {
  var imp = bidToImp(bid, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE);
  var request = bid.nativeOrtbRequest;
  request.eventtrackers = [{
    event: 1,
    methods: [1, 2]
  }];
  request.privacy = 1;
  imp.native = {
    request: JSON.stringify(request),
    ver: '1.2'
  };

  // populate imp level transactionId
  imp.ext.tid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'ortb2Imp.ext.tid');

  // AdUnit-Specific First Party Data
  addAdUnitFPD(imp, bid);
  _applyFloor(bid, imp, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE);
  return imp;
}

/**
 * Converts an incoming PBJS bid to an IX Impression
 * @param {object} bid   PBJS bid object
 * @returns {object}     IX impression object
 */
function bidToImp(bid, mediaType) {
  var imp = {};
  imp.id = bid.bidId;
  imp.ext = {};
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, "params.".concat(mediaType, ".siteId")) && !isNaN(Number(bid.params[mediaType].siteId))) {
    switch (mediaType) {
      case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER:
        imp.ext.siteID = bid.params.banner.siteId.toString();
        break;
      case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO:
        imp.ext.siteID = bid.params.video.siteId.toString();
        break;
      case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE:
        imp.ext.siteID = bid.params.native.siteId.toString();
        break;
    }
  } else {
    imp.ext.siteID = bid.params.siteId.toString();
  }

  // populate imp level sid
  if (bid.params.hasOwnProperty('id') && (typeof bid.params.id === 'string' || typeof bid.params.id === 'number')) {
    imp.ext.sid = String(bid.params.id);
  }
  return imp;
}

/**
 * Gets priceFloors floors and IX adapter floors,
 * Validates and sets the higher one on the impression
 * @param  {object}    bid bid object
 * @param  {object}    imp impression object
 * @param  {string}    mediaType the impression ad type, one of the SUPPORTED_AD_TYPES
 */
function _applyFloor(bid, imp, mediaType) {
  var adapterFloor = null;
  var moduleFloor = null;
  if (bid.params.bidFloor && bid.params.bidFloorCur) {
    adapterFloor = {
      floor: bid.params.bidFloor,
      currency: bid.params.bidFloorCur
    };
  }
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFn)(bid.getFloor)) {
    var _mediaType = '*';
    var _size = '*';
    if (mediaType && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.contains)(SUPPORTED_AD_TYPES, mediaType)) {
      var _imp$mediaType = imp[mediaType],
        width = _imp$mediaType.w,
        height = _imp$mediaType.h;
      _mediaType = mediaType;
      _size = [width, height];
    }
    try {
      moduleFloor = bid.getFloor({
        mediaType: _mediaType,
        size: _size
      });
    } catch (err) {
      // continue with no module floors
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('priceFloors module call getFloor failed, error : ', err);
    }
  }

  // Prioritize module floor over bidder.param floor
  if (moduleFloor) {
    imp.bidfloor = moduleFloor.floor;
    imp.bidfloorcur = moduleFloor.currency;
    imp.ext.fl = FLOOR_SOURCE.PBJS;
  } else if (adapterFloor) {
    imp.bidfloor = adapterFloor.floor;
    imp.bidfloorcur = adapterFloor.currency;
    imp.ext.fl = FLOOR_SOURCE.IX;
  }
}

/**
 * Parses a raw bid for the relevant information.
 *
 * @param  {object} rawBid   The bid to be parsed.
 * @param  {string} currency Global currency in bid response.
 * @return {object} bid      The parsed bid.
 */
function parseBid(rawBid, currency, bidRequest) {
  var bid = {};
  var isValidExpiry = !!((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'exp') && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isInteger)(rawBid.exp));
  var dealID = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'dealid') || (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'ext.dealid');
  if (PRICE_TO_DOLLAR_FACTOR.hasOwnProperty(currency)) {
    bid.cpm = rawBid.price / PRICE_TO_DOLLAR_FACTOR[currency];
  } else {
    bid.cpm = rawBid.price / CENT_TO_DOLLAR_FACTOR;
  }
  bid.requestId = rawBid.impid;
  if (dealID) {
    bid.dealId = dealID;
  }
  bid.netRevenue = NET_REVENUE;
  bid.currency = currency;
  bid.creativeId = rawBid.hasOwnProperty('crid') ? rawBid.crid : '-';
  // If mtype = video is passed and vastURl is not set, set vastxml
  if (rawBid.mtype == MEDIA_TYPES.Video && (rawBid.ext && !rawBid.ext.vasturl || !rawBid.ext)) {
    bid.vastXml = rawBid.adm;
  } else if (rawBid.ext && rawBid.ext.vasturl) {
    bid.vastUrl = rawBid.ext.vasturl;
  }
  var parsedAdm = null;
  // Detect whether the adm is (probably) JSON
  if (typeof rawBid.adm === 'string' && rawBid.adm[0] === '{' && rawBid.adm[rawBid.adm.length - 1] === '}') {
    try {
      parsedAdm = JSON.parse(rawBid.adm);
    } catch (err) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('adm looks like JSON but failed to parse: ', err);
    }
  }

  // in the event of a video
  if (rawBid.ext && rawBid.ext.vasturl || rawBid.mtype == MEDIA_TYPES.Video) {
    bid.width = bidRequest.video.w;
    bid.height = bidRequest.video.h;
    bid.mediaType = _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO;
    bid.mediaTypes = bidRequest.mediaTypes;
    bid.ttl = isValidExpiry ? rawBid.exp : VIDEO_TIME_TO_LIVE;
  } else if (parsedAdm && parsedAdm.native) {
    bid.native = {
      ortb: parsedAdm.native
    };
    bid.width = rawBid.w ? rawBid.w : 1;
    bid.height = rawBid.h ? rawBid.h : 1;
    bid.mediaType = _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE;
    bid.ttl = isValidExpiry ? rawBid.exp : NATIVE_TIME_TO_LIVE;
  } else {
    bid.ad = rawBid.adm;
    bid.width = rawBid.w;
    bid.height = rawBid.h;
    bid.mediaType = _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER;
    bid.ttl = isValidExpiry ? rawBid.exp : BANNER_TIME_TO_LIVE;
  }
  bid.meta = {};
  bid.meta.networkId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'ext.dspid');
  bid.meta.brandId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'ext.advbrandid');
  bid.meta.brandName = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(rawBid, 'ext.advbrand');
  if (rawBid.adomain && rawBid.adomain.length > 0) {
    bid.meta.advertiserDomains = rawBid.adomain;
  }
  return bid;
}

/**
 * Determines whether or not the given object is valid size format.
 *
 * @param  {*}       size The object to be validated.
 * @return {boolean}      True if this is a valid size format, and false otherwise.
 */
function isValidSize(size) {
  return Array.isArray(size) && size.length === 2 && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isInteger)(size[0]) && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isInteger)(size[1]);
}

/**
 * Determines whether or not the given size object is an element of the size
 * array.
 *
 * @param  {array}  sizeArray The size array.
 * @param  {object} size      The size object.
 * @return {boolean}          True if the size object is an element of the size array, and false
 *                            otherwise.
 */
function includesSize() {
  var sizeArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (isValidSize(sizeArray)) {
    return sizeArray[0] === size[0] && sizeArray[1] === size[1];
  }
  for (var i = 0; i < sizeArray.length; i++) {
    if (sizeArray[i][0] === size[0] && sizeArray[i][1] === size[1]) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if all required video params are present
 * @param {object} mediaTypeVideoRef Ad unit level mediaTypes object
 * @param {object} paramsVideoRef    IX bidder params level video object
 * @returns {string[]}               Are the required video params available
 */
function checkVideoParams(mediaTypeVideoRef, paramsVideoRef) {
  var errorList = [];
  if (!mediaTypeVideoRef) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('IX Bid Adapter: mediaTypes.video is the preferred location for video params in ad unit');
  }
  var _iterator = _createForOfIteratorHelper(REQUIRED_VIDEO_PARAMS),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var property = _step.value;
      var propInMediaType = mediaTypeVideoRef && mediaTypeVideoRef.hasOwnProperty(property);
      var propInVideoRef = paramsVideoRef && paramsVideoRef.hasOwnProperty(property);
      if (!propInMediaType && !propInVideoRef) {
        errorList.push("IX Bid Adapter: ".concat(property, " is not included in either the adunit or params level"));
      }
    }

    // check protocols/protocol
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var protocolMediaType = mediaTypeVideoRef && mediaTypeVideoRef.hasOwnProperty('protocol');
  var protocolsMediaType = mediaTypeVideoRef && mediaTypeVideoRef.hasOwnProperty('protocols');
  var protocolVideoRef = paramsVideoRef && paramsVideoRef.hasOwnProperty('protocol');
  var protocolsVideoRef = paramsVideoRef && paramsVideoRef.hasOwnProperty('protocols');
  if (!(protocolMediaType || protocolsMediaType || protocolVideoRef || protocolsVideoRef)) {
    errorList.push('IX Bid Adapter: protocol/protcols is not included in either the adunit or params level');
  }
  return errorList;
}

/**
 * Get One size from Size Array
 * [[250,350]] -> [250, 350]
 * [250, 350]  -> [250, 350]
 * @param {array} sizes array of sizes
 */
function getFirstSize() {
  var sizes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (isValidSize(sizes)) {
    return sizes;
  } else if (isValidSize(sizes[0])) {
    return sizes[0];
  }
  return false;
}

/**
 * Determines whether or not the given bidFloor parameters are valid.
 *
 * @param  {number}  bidFloor    The bidFloor parameter inside bid request config.
 * @param  {number}  bidFloorCur The bidFloorCur parameter inside bid request config.
 * @return {bool}                True if this is a valid bidFloor parameters format, and false
 *                               otherwise.
 */
function isValidBidFloorParams(bidFloor, bidFloorCur) {
  var curRegex = /^[A-Z]{3}$/;
  return Boolean(typeof bidFloor === 'number' && typeof bidFloorCur === 'string' && bidFloorCur.match(curRegex));
}
function nativeMediaTypeValid(bid) {
  var nativeMediaTypes = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.native');
  if (nativeMediaTypes === undefined) {
    return true;
  }
  return bid.nativeOrtbRequest && Array.isArray(bid.nativeOrtbRequest.assets) && bid.nativeOrtbRequest.assets.length > 0;
}

/**
 * Get bid request object with the associated id.
 *
 * @param  {*}      id          Id of the impression.
 * @param  {array}  impressions List of impressions sent in the request.
 * @return {object}             The impression with the associated id.
 */
function getBidRequest(id, impressions, validBidRequests) {
  if (!id) {
    return;
  }
  var bidRequest = _objectSpread(_objectSpread({}, (0,_src_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.find)(validBidRequests, function (bid) {
    return bid.bidId === id;
  })), (0,_src_polyfill_js__WEBPACK_IMPORTED_MODULE_6__.find)(impressions, function (imp) {
    return imp.id === id;
  }));
  return bidRequest;
}

/**
 * From the userIdAsEids array, filter for the ones our adserver can use, and modify them
 * for our purposes, e.g. add rtiPartner
 * @param {array} allEids userIdAsEids passed in by prebid
 * @return {object} contains toSend (eids to send to the adserver) and seenSources (used to filter
 *                  identity info from IX Library)
 */
function getEidInfo(allEids) {
  var toSend = [];
  var seenSources = {};
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(allEids)) {
    var _iterator2 = _createForOfIteratorHelper(allEids),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var eid = _step2.value;
        if (SOURCE_RTI_MAPPING.hasOwnProperty(eid.source) && (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(eid, 'uids.0')) {
          seenSources[eid.source] = true;
          if (SOURCE_RTI_MAPPING[eid.source] != '') {
            eid.uids[0].ext = {
              rtiPartner: SOURCE_RTI_MAPPING[eid.source]
            };
          }
          delete eid.uids[0].atype;
          toSend.push(eid);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  return {
    toSend: toSend,
    seenSources: seenSources
  };
}

/**
 * Builds a request object to be sent to the ad server based on bid requests.
 *
 * @param  {array}  validBidRequests A list of valid bid request config objects.
 * @param  {object} bidderRequest    An object containing other info like gdprConsent.
 * @param  {object} impressions      An object containing a list of impression objects describing the bids for each transactionId
 * @param  {array}  version          Endpoint version denoting banner, video or native.
 * @return {array}                   List of objects describing the request to the server.
 *
 */
function buildRequest(validBidRequests, bidderRequest, impressions, version) {
  // Always use secure HTTPS protocol.
  var baseUrl = SECURE_BID_URL;
  // Get ids from Prebid User ID Modules
  var eidInfo = getEidInfo((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequests, '0.userIdAsEids'));
  var userEids = eidInfo.toSend;

  // RTI ids will be included in the bid request if the function getIdentityInfo() is loaded
  // and if the data for the partner exist
  if (window.headertag && typeof window.headertag.getIdentityInfo === 'function') {
    addRTI(userEids, eidInfo);
  }

  // If `roundel` alias bidder, only send requests if liveramp ids exist.
  if (bidderRequest && bidderRequest.bidderCode === ALIAS_BIDDER_CODE && !eidInfo.seenSources['liveramp.com']) {
    return [];
  }
  var requests = [];
  var r = createRequest(validBidRequests);

  // Add FTs to be requested from Exchange
  r = addRequestedFeatureToggles(r, FEATURE_TOGGLES.REQUESTED_FEATURE_TOGGLES);

  // getting ixdiags for adunits of the video, outstream & multi format (MF) style
  var ixdiag = buildIXDiag(validBidRequests);
  for (var key in ixdiag) {
    r.ext.ixdiag[key] = ixdiag[key];
  }
  r = enrichRequest(r, bidderRequest, impressions, validBidRequests, userEids);
  r = applyRegulations(r, bidderRequest);
  var payload = {};
  siteID = validBidRequests[0].params.siteId;
  payload.s = siteID;
  var transactionIds = Object.keys(impressions);
  var isFpdAdded = false;
  for (var adUnitIndex = 0; adUnitIndex < transactionIds.length; adUnitIndex++) {
    if (requests.length >= MAX_REQUEST_LIMIT) {
      break;
    }
    r = addImpressions(impressions, transactionIds, r, adUnitIndex);
    var fpd = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'ortb2') || {};
    var site = _objectSpread({}, fpd.site || fpd.context);

    // update page URL with IX FPD KVs if they exist
    site.page = getIxFirstPartyDataPageUrl(bidderRequest);
    var user = _objectSpread({}, fpd.user);
    if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(fpd) && !isFpdAdded) {
      r = addFPD(bidderRequest, r, fpd, site, user);
      r.site = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, r.site, site);
      r.user = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.mergeDeep)({}, r.user, user);
      isFpdAdded = true;
    }

    // add identifiers info to ixDiag
    r = addIdentifiersInfo(impressions, r, transactionIds, adUnitIndex, payload, baseUrl);
    var isLastAdUnit = adUnitIndex === transactionIds.length - 1;
    if (isLastAdUnit) {
      requests.push({
        method: 'POST',
        url: baseUrl + '?s=' + siteID,
        data: (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(r),
        option: {
          contentType: 'text/plain'
        },
        validBidRequests: validBidRequests
      });
      r.imp = [];
      isFpdAdded = false;
    }
  }
  return requests;
}

/**
 * addRTI adds RTI info of the partner to retrieved user IDs from prebid ID module.
 *
 * @param {array} userEids userEids info retrieved from prebid
 * @param {array} eidInfo eidInfo info from prebid
 */
function addRTI(userEids, eidInfo) {
  var identityInfo = window.headertag.getIdentityInfo();
  if (identityInfo && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(identityInfo) === 'object') {
    for (var partnerName in identityInfo) {
      if (identityInfo.hasOwnProperty(partnerName)) {
        var response = identityInfo[partnerName];
        if (!response.responsePending && response.data && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(response.data) === 'object' && Object.keys(response.data).length && !eidInfo.seenSources[response.data.source]) {
          userEids.push(response.data);
        }
      }
    }
  }
}

/**
 * createRequest creates the base request object
 * @param  {array}  validBidRequests A list of valid bid request config objects.
 * @return {object}                  Object describing the request to the server.
 */
function createRequest(validBidRequests) {
  var r = {};
  // Since bidderRequestId are the same for different bid request, just use the first one.
  r.id = validBidRequests[0].bidderRequestId.toString();
  r.site = {};
  r.ext = {};
  r.ext.source = 'prebid';
  r.ext.ixdiag = {};
  r.ext.ixdiag.ls = storage.localStorageIsEnabled();
  r.imp = [];
  r.at = 1;
  return r;
}

/**
 * Adds requested feature toggles to the provided request object to be sent to Exchange.
 * @param {object} r - The request object to add feature toggles to.
 * @param {Array} requestedFeatureToggles - The list of feature toggles to add.
 * @returns {object} The updated request object with the added feature toggles.
 */
function addRequestedFeatureToggles(r, requestedFeatureToggles) {
  if (requestedFeatureToggles.length > 0) {
    r.ext.features = {};
    // Loop through each feature toggle and add it to the features object.
    // Add current activation status as well.
    requestedFeatureToggles.forEach(function (toggle) {
      r.ext.features[toggle] = {
        activated: FEATURE_TOGGLES.isFeatureEnabled(toggle)
      };
    });
  }
  return r;
}

/**
 * enrichRequest adds userSync configs, source, and referer info to request and ixDiag objects.
 *
 * @param  {object} r                Base reuqest object.
 * @param  {object} bidderRequest    An object containing other info like gdprConsent.
 * @param  {array}  impressions      A list of impressions to be added to the request.
 * @param  {array}  validBidRequests A list of valid bid request config objects.
 * @param  {array}  userEids         User ID info retrieved from Prebid ID module.
 * @return {object}                  Enriched object describing the request to the server.
 */
function enrichRequest(r, bidderRequest, impressions, validBidRequests, userEids) {
  var tmax = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'timeout');
  if (tmax) {
    r.ext.ixdiag.tmax = tmax;
  }
  if (_src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('userSync')) {
    r.ext.ixdiag.syncsPerBidder = _src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('userSync').syncsPerBidder;
  }

  // Get cached errors stored in LocalStorage
  var cachedErrors = getCachedErrors();
  if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(cachedErrors)) {
    r.ext.ixdiag.err = cachedErrors;
  }

  // Add number of available imps to ixDiag.
  r.ext.ixdiag.imps = Object.keys(impressions).length;

  // set source.tid to auctionId for outgoing request to Exchange.
  r.source = {
    tid: validBidRequests[0].auctionId
  };

  // if an schain is provided, send it along
  if (validBidRequests[0].schain) {
    r.source.ext = {};
    r.source.ext.schain = validBidRequests[0].schain;
  }
  if (userEids.length > 0) {
    r.user = {};
    r.user.eids = userEids;
  }
  if (document.referrer && document.referrer !== '') {
    r.site.ref = document.referrer;
  }
  return r;
}

/**
 * applyRegulations applies regulation info such as GDPR and GPP to the reqeust obejct.
 *
 * @param  {object}  r                Base reuqest object.
 * @param  {object}  bidderRequest    An object containing other info like gdprConsent.
 * @return {object}                   Object enriched with regulation info describing the request to the server.
 */
function applyRegulations(r, bidderRequest) {
  // Apply GDPR information to the request if GDPR is enabled.
  if (bidderRequest) {
    if (bidderRequest.gdprConsent) {
      gdprConsent = bidderRequest.gdprConsent;
      if (gdprConsent.hasOwnProperty('gdprApplies')) {
        r.regs = {
          ext: {
            gdpr: gdprConsent.gdprApplies ? 1 : 0
          }
        };
      }
      if (gdprConsent.hasOwnProperty('consentString')) {
        r.user = r.user || {};
        r.user.ext = {
          consent: gdprConsent.consentString || ''
        };
        if (gdprConsent.hasOwnProperty('addtlConsent') && gdprConsent.addtlConsent) {
          r.user.ext.consented_providers_settings = {
            addtl_consent: gdprConsent.addtlConsent
          };
        }
      }
    }
    if (bidderRequest.uspConsent) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.ext.us_privacy', bidderRequest.uspConsent);
      usPrivacy = bidderRequest.uspConsent;
    }
    var pageUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'refererInfo.page');
    if (pageUrl) {
      r.site.page = pageUrl;
    }
    if (bidderRequest.gppConsent) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.gpp', bidderRequest.gppConsent.gppString);
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.gpp_sid', bidderRequest.gppConsent.applicableSections);
    }
  }
  if (_src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('coppa')) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.coppa', 1);
  }
  return r;
}

/**
 * addImpressions adds impressions to request object
 *
 * @param  {array}  impressions        List of impressions to be added to the request.
 * @param  {array}  transactionIds     List of transaction Ids.
 * @param  {object} r                  Reuqest object.
 * @param  {int}    adUnitIndex        Index of the current add unit
 * @return {object}                    Reqyest object with added impressions describing the request to the server.
 */
function addImpressions(impressions, transactionIds, r, adUnitIndex) {
  var adUnitImpressions = impressions[transactionIds[adUnitIndex]];
  var _adUnitImpressions$mi = adUnitImpressions.missingImps,
    missingBannerImpressions = _adUnitImpressions$mi === void 0 ? [] : _adUnitImpressions$mi,
    _adUnitImpressions$ix = adUnitImpressions.ixImps,
    ixImps = _adUnitImpressions$ix === void 0 ? [] : _adUnitImpressions$ix;
  var sourceImpressions = {
    ixImps: ixImps,
    missingBannerImpressions: missingBannerImpressions
  };
  var impressionObjects = Object.keys(sourceImpressions).map(function (key) {
    return sourceImpressions[key];
  }).filter(function (item) {
    return Array.isArray(item);
  }).reduce(function (acc, curr) {
    return acc.concat.apply(acc, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__["default"])(curr));
  }, []);
  var gpid = impressions[transactionIds[adUnitIndex]].gpid;
  var dfpAdUnitCode = impressions[transactionIds[adUnitIndex]].dfp_ad_unit_code;
  var tid = impressions[transactionIds[adUnitIndex]].tid;
  var sid = impressions[transactionIds[adUnitIndex]].sid;
  if (impressionObjects.length && _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER in impressionObjects[0]) {
    var _impressionObjects$ = impressionObjects[0],
      id = _impressionObjects$.id,
      topframe = _impressionObjects$.banner.topframe;
    var _bannerImpression = {
      id: id,
      banner: {
        topframe: topframe,
        format: impressionObjects.map(function (_ref) {
          var _ref$banner = _ref.banner,
            w = _ref$banner.w,
            h = _ref$banner.h,
            ext = _ref.ext;
          return {
            w: w,
            h: h,
            ext: ext
          };
        })
      }
    };
    for (var i = 0; i < _bannerImpression.banner.format.length; i++) {
      // We add sid in imp.ext.sid therefore, remove from banner.format[].ext
      if (_bannerImpression.banner.format[i].ext != null && _bannerImpression.banner.format[i].ext.sid != null) {
        delete _bannerImpression.banner.format[i].ext.sid;
      }

      // add floor per size
      if ('bidfloor' in impressionObjects[i]) {
        _bannerImpression.banner.format[i].ext.bidfloor = impressionObjects[i].bidfloor;
      }
    }
    var position = impressions[transactionIds[adUnitIndex]].pos;
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isInteger)(position)) {
      _bannerImpression.banner.pos = position;
    }
    if (dfpAdUnitCode || gpid || tid || sid) {
      _bannerImpression.ext = {};
      _bannerImpression.ext.dfp_ad_unit_code = dfpAdUnitCode;
      _bannerImpression.ext.gpid = gpid;
      _bannerImpression.ext.tid = tid;
      _bannerImpression.ext.sid = sid;
    }
	  //RDG
	if (1 || bidderRequest.fledgeEnabled) {
	      _bannerImpression.ext.ae = 1;
	}
	  //RDG
    if ('bidfloor' in impressionObjects[0]) {
      _bannerImpression.bidfloor = impressionObjects[0].bidfloor;
    }
    if ('bidfloorcur' in impressionObjects[0]) {
      _bannerImpression.bidfloorcur = impressionObjects[0].bidfloorcur;
    }
    var adUnitFPD = impressions[transactionIds[adUnitIndex]].adUnitFPD;
    if (adUnitFPD) {
      _bannerImpression.ext.data = adUnitFPD;
    }
    r.imp.push(_bannerImpression);
  } else {
    var _r$imp;
    // set imp.ext.gpid to resolved gpid for each imp
    impressionObjects.forEach(function (imp) {
      return (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(imp, 'ext.gpid', gpid);
    });
    (_r$imp = r.imp).push.apply(_r$imp, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__["default"])(impressionObjects));
  }
  return r;
}

/**
This function retrieves the page URL and appends first party data query parameters
to it without adding duplicate query parameters. Returns original referer URL if no IX FPD exists.
@param {Object} bidderRequest - The bidder request object containing information about the bid and the page.
@returns {string} - The modified page URL with first party data query parameters appended.
*/
function getIxFirstPartyDataPageUrl(bidderRequest) {
  // Parse additional runtime configs.
  var bidderCode = bidderRequest && bidderRequest.bidderCode || 'ix';
  var otherIxConfig = _src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig(bidderCode);
  var pageUrl = '';
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'ortb2.site.page')) {
    pageUrl = bidderRequest.ortb2.site.page;
  } else {
    pageUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'refererInfo.page');
  }
  if (otherIxConfig) {
    // Append firstPartyData to r.site.page if firstPartyData exists.
    if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(otherIxConfig.firstPartyData) === 'object') {
      var firstPartyData = otherIxConfig.firstPartyData;
      return appendIXQueryParams(bidderRequest, pageUrl, firstPartyData);
    }
  }
  return pageUrl;
}

/**
This function appends the provided query parameters to the given URL without adding duplicate query parameters.
@param {Object} bidderRequest - The bidder request object containing information about the bid and the page to be used as fallback in case url is not valid.
@param {string} url - The base URL to which query parameters will be appended.
@param {Object} params - An object containing key-value pairs of query parameters to append.
@returns {string} - The modified URL with the provided query parameters appended.
*/
function appendIXQueryParams(bidderRequest, url, params) {
  var urlObj;
  try {
    urlObj = new URL(url);
  } catch (error) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("IX Bid Adapter: Invalid URL set in ortb2.site.page: ".concat(url, ". Using referer URL instead."));
    urlObj = new URL((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bidderRequest, 'refererInfo.page'));
  }
  var searchParams = new URLSearchParams(urlObj.search);

  // Loop through the provided query parameters and append them
  for (var _i = 0, _Object$entries = Object.entries(params); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_11__["default"])(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    if (!searchParams.has(key)) {
      searchParams.append(key, value);
    }
  }

  // Construct the final URL with the updated query parameters
  urlObj.search = searchParams.toString();
  return urlObj.toString();
}

/**
 * addFPD adds ortb2 first party data to request object.
 *
 * @param  {object} bidderRequest     An object containing other info like gdprConsent.
 * @param  {object} r                 Reuqest object.
 * @param  {object} fpd               ortb2 first party data.
 * @param  {object} site              First party site data.
 * @param  {object} user              First party user data.
 * @return {object}                   Reqyest object with added FPD describing the request to the server.
 */
function addFPD(bidderRequest, r, fpd, site, user) {
  r.ext.ixdiag.fpd = true;
  Object.keys(site).forEach(function (key) {
    if (FIRST_PARTY_DATA.SITE.indexOf(key) === -1) {
      delete site[key];
    }
  });
  Object.keys(user).forEach(function (key) {
    if (FIRST_PARTY_DATA.USER.indexOf(key) === -1) {
      delete user[key];
    }
  });
  if (fpd.device) {
    var sua = _objectSpread({}, fpd.device.sua);
    if (!(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(sua)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'device.sua', sua);
    }
  }
  if (fpd.hasOwnProperty('regs') && !bidderRequest.gppConsent) {
    if (fpd.regs.hasOwnProperty('gpp') && typeof fpd.regs.gpp == 'string') {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.gpp', fpd.regs.gpp);
    }
    if (fpd.regs.hasOwnProperty('gpp_sid') && Array.isArray(fpd.regs.gpp_sid)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(r, 'regs.gpp_sid', fpd.regs.gpp_sid);
    }
  }
  return r;
}

/**
 * Adds First-Party Data (FPD) from the bid object to the imp object.
 *
 * @param {Object} imp - The imp object, representing an impression in the OpenRTB format.
 * @param {Object} bid - The bid object, containing information about the bid request.
 */
function addAdUnitFPD(imp, bid) {
  var adUnitFPD = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'ortb2Imp.ext.data');
  if (adUnitFPD) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_9__.dset)(imp, 'ext.data', adUnitFPD);
  }
}

/**
 * addIdentifiersInfo adds indentifier info to ixDaig.
 *
 * @param  {array}  impressions        List of impressions to be added to the request.
 * @param  {object} r                  Reuqest object.
 * @param  {array}  transactionIds     List of transaction Ids.
 * @param  {int}    adUnitIndex        Index of the current add unit
 * @param  {object} payload            Request payload object.
 * @param  {string} baseUrl            Base exchagne URL.
 * @return {object}                    Reqyest object with added indentigfier info to ixDiag.
 */
function addIdentifiersInfo(impressions, r, transactionIds, adUnitIndex, payload, baseUrl) {
  var pbaAdSlot = impressions[transactionIds[adUnitIndex]].pbadslot;
  var tagId = impressions[transactionIds[adUnitIndex]].tagId;
  var adUnitCode = impressions[transactionIds[adUnitIndex]].adUnitCode;
  var divId = impressions[transactionIds[adUnitIndex]].divId;
  if (pbaAdSlot || tagId || adUnitCode || divId) {
    r.ext.ixdiag.pbadslot = pbaAdSlot;
    r.ext.ixdiag.tagid = tagId;
    r.ext.ixdiag.adunitcode = adUnitCode;
    r.ext.ixdiag.divId = divId;
  }
  return r;
}

/**
 * Return an object of user IDs stored by Prebid User ID module
 *
 * @returns {array} ID providers that are present in userIds
 */
function _getUserIds(bidRequest) {
  var userIds = bidRequest.userId || {};
  return PROVIDERS.filter(function (provider) {
    return userIds[provider];
  });
}

/**
 * Calculates IX diagnostics values and packages them into an object
 *
 * @param {array} validBidRequests  The valid bid requests from prebid
 * @return {Object} IX diag values for ad units
 */
function buildIXDiag(validBidRequests) {
  var adUnitMap = validBidRequests.map(function (bidRequest) {
    return bidRequest.transactionId;
  }).filter(function (value, index, arr) {
    return arr.indexOf(value) === index;
  });
  var ixdiag = {
    mfu: 0,
    bu: 0,
    iu: 0,
    nu: 0,
    ou: 0,
    allu: 0,
    ren: false,
    version: "7.54.0",
    userIds: _getUserIds(validBidRequests[0]),
    url: window.location.href.split('?')[0],
    vpd: defaultVideoPlacement
  };

  // create ad unit map and collect the required diag properties
  var _loop = function _loop(i) {
    bid = validBidRequests.filter(function (bidRequest) {
      return bidRequest.transactionId === adUnitMap[i];
    })[0];
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes')) {
      if (Object.keys(bid.mediaTypes).length > 1) {
        ixdiag.mfu++;
      }
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.native')) {
        ixdiag.nu++;
      }
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.banner')) {
        ixdiag.bu++;
      }
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.context') === 'outstream') {
        ixdiag.ou++;
        if (isIndexRendererPreferred(bid)) {
          ixdiag.ren = true;
        }
      }
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.context') === 'instream') {
        ixdiag.iu++;
      }
      ixdiag.allu++;
    }
  };
  for (var i = 0; i < adUnitMap.length; i++) {
    var bid;
    _loop(i);
  }
  return ixdiag;
}

/**
 *
 * @param  {array}   bannerSizeList list of banner sizes
 * @param  {array}   bannerSize the size to be removed
 * @return {boolean} true if successfully removed, false if not found
 */

function removeFromSizes(bannerSizeList, bannerSize) {
  if (!bannerSize) return;
  for (var i = 0; i < bannerSizeList.length; i++) {
    var size = bannerSizeList[i];
    if (bannerSize[0] === size[0] && bannerSize[1] === size[1]) {
      bannerSizeList.splice(i, 1);
      break;
    }
  }
}

/**
 * Creates IX Native impressions based on validBidRequests
 * @param {object}  validBidRequest valid request provided by prebid
 * @param {object}  nativeImps reference to created native impressions
 */
function createNativeImps(validBidRequest, nativeImps) {
  var imp = bidToNativeImp(validBidRequest);
  if (Object.keys(imp).length != 0) {
    nativeImps[validBidRequest.transactionId] = {};
    nativeImps[validBidRequest.transactionId].ixImps = [];
    nativeImps[validBidRequest.transactionId].ixImps.push(imp);
    nativeImps[validBidRequest.transactionId].gpid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.gpid');
    nativeImps[validBidRequest.transactionId].dfp_ad_unit_code = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.adserver.adslot');
    nativeImps[validBidRequest.transactionId].pbadslot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.pbadslot');
    nativeImps[validBidRequest.transactionId].tagId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'params.tagId');
    var adUnitCode = validBidRequest.adUnitCode;
    var divId = document.getElementById(adUnitCode) ? adUnitCode : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.getGptSlotInfoForAdUnitCode)(adUnitCode).divId;
    nativeImps[validBidRequest.transactionId].adUnitCode = adUnitCode;
    nativeImps[validBidRequest.transactionId].divId = divId;
  }
}

/**
 * Creates IX Video impressions based on validBidRequests
 * @param {object}  validBidRequest valid request provided by prebid
 * @param {object}  videoImps reference to created video impressions
 */
function createVideoImps(validBidRequest, videoImps) {
  var imp = bidToVideoImp(validBidRequest);
  if (Object.keys(imp).length != 0) {
    videoImps[validBidRequest.transactionId] = {};
    videoImps[validBidRequest.transactionId].ixImps = [];
    videoImps[validBidRequest.transactionId].ixImps.push(imp);
    videoImps[validBidRequest.transactionId].gpid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.gpid');
    videoImps[validBidRequest.transactionId].dfp_ad_unit_code = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.adserver.adslot');
    videoImps[validBidRequest.transactionId].pbadslot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.pbadslot');
    videoImps[validBidRequest.transactionId].tagId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'params.tagId');
    var adUnitCode = validBidRequest.adUnitCode;
    var divId = document.getElementById(adUnitCode) ? adUnitCode : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.getGptSlotInfoForAdUnitCode)(adUnitCode).divId;
    videoImps[validBidRequest.transactionId].adUnitCode = adUnitCode;
    videoImps[validBidRequest.transactionId].divId = divId;
  }
}

/**
 * Creates IX banner impressions based on validBidRequests
 * @param {object}  validBidRequest valid request provided by prebid
 * @param {object}  missingBannerSizes reference to missing banner config sizes
 * @param {object}  bannerImps reference to created banner impressions
 */
function createBannerImps(validBidRequest, missingBannerSizes, bannerImps) {
  var imp = bidToBannerImp(validBidRequest);
  var bannerSizeDefined = includesSize((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'mediaTypes.banner.sizes'), (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'params.size'));
  if (!bannerImps.hasOwnProperty(validBidRequest.transactionId)) {
    bannerImps[validBidRequest.transactionId] = {};
  }
  bannerImps[validBidRequest.transactionId].gpid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.gpid');
  bannerImps[validBidRequest.transactionId].dfp_ad_unit_code = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.adserver.adslot');
  bannerImps[validBidRequest.transactionId].tid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.tid');
  bannerImps[validBidRequest.transactionId].pbadslot = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data.pbadslot');
  bannerImps[validBidRequest.transactionId].tagId = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'params.tagId');
  bannerImps[validBidRequest.transactionId].pos = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'mediaTypes.banner.pos');

  // AdUnit-Specific First Party Data
  var adUnitFPD = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'ortb2Imp.ext.data');
  if (adUnitFPD) {
    bannerImps[validBidRequest.transactionId].adUnitFPD = adUnitFPD;
  }
  var sid = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'params.id');
  if (sid && (typeof sid === 'string' || typeof sid === 'number')) {
    bannerImps[validBidRequest.transactionId].sid = String(sid);
  }
  var adUnitCode = validBidRequest.adUnitCode;
  var divId = document.getElementById(adUnitCode) ? adUnitCode : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.getGptSlotInfoForAdUnitCode)(adUnitCode).divId;
  bannerImps[validBidRequest.transactionId].adUnitCode = adUnitCode;
  bannerImps[validBidRequest.transactionId].divId = divId;

  // Create IX imps from params.size
  if (bannerSizeDefined) {
    if (!bannerImps[validBidRequest.transactionId].hasOwnProperty('ixImps')) {
      bannerImps[validBidRequest.transactionId].ixImps = [];
    }
    bannerImps[validBidRequest.transactionId].ixImps.push(imp);
  }
  updateMissingSizes(validBidRequest, missingBannerSizes, imp);
}

/**
 * Updates the Object to track missing banner sizes.
 *
 * @param {object} validBidRequest    The bid request for an ad unit's with a configured size.
 * @param {object} missingBannerSizes The object containing missing banner sizes
 * @param {object} imp                The impression for the bidrequest
 */
function updateMissingSizes(validBidRequest, missingBannerSizes, imp) {
  var transactionID = validBidRequest.transactionId;
  if (missingBannerSizes.hasOwnProperty(transactionID)) {
    var currentSizeList = [];
    if (missingBannerSizes[transactionID].hasOwnProperty('missingSizes')) {
      currentSizeList = missingBannerSizes[transactionID].missingSizes;
    }
    removeFromSizes(currentSizeList, validBidRequest.params.size);
    missingBannerSizes[transactionID].missingSizes = currentSizeList;
  } else {
    // New Ad Unit
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'mediaTypes.banner.sizes')) {
      var sizeList = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(validBidRequest.mediaTypes.banner.sizes);
      removeFromSizes(sizeList, validBidRequest.params.size);
      var newAdUnitEntry = {
        'missingSizes': sizeList,
        'impression': imp
      };
      missingBannerSizes[transactionID] = newAdUnitEntry;
    }
  }
}

/**
 * @param  {object} bid      ValidBidRequest object, used to adjust floor
 * @param  {object} imp      Impression object to be modified
 * @param  {array}  newSize  The new size to be applied
 * @return {object} newImp   Updated impression object
 */
function createMissingBannerImp(bid, imp, newSize) {
  var newImp = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.deepClone)(imp);
  newImp.banner.w = newSize[0];
  newImp.banner.h = newSize[1];
  _applyFloor(bid, newImp, _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER);
  return newImp;
}

/**
 * @typedef {Array[message: string, err: Object<bidder: string, code: number>]} ErrorData
 * @property {string} message - The error message.
 * @property {object} err - The error object.
 * @property {string} err.bidder - The bidder of the error.
 * @property {string} err.code - The error code.
 */

/**
 * Error Event handler that receives type and arguments in a data object.
 *
 * @param {ErrorData} data
 */
function storeErrorEventData(data) {
  if (!storage.localStorageIsEnabled()) {
    return;
  }
  var currentStorage;
  try {
    currentStorage = JSON.parse(storage.getDataFromLocalStorage(LOCAL_STORAGE_KEY) || '{}');
  } catch (e) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('ix can not read ixdiag from localStorage.');
  }
  var todayDate = new Date();
  Object.keys(currentStorage).map(function (errorDate) {
    var date = new Date(errorDate);
    if (date.setDate(date.getDate() + 7) - todayDate < 0) {
      delete currentStorage[errorDate];
    }
  });
  if (data.type === 'ERROR' && data.arguments && data.arguments[1] && data.arguments[1].bidder === BIDDER_CODE) {
    var todayString = todayDate.toISOString().slice(0, 10);
    var errorCode = data.arguments[1].code;
    if (errorCode) {
      currentStorage[todayString] = currentStorage[todayString] || {};
      if (!Number(currentStorage[todayString][errorCode])) {
        currentStorage[todayString][errorCode] = 0;
      }
      currentStorage[todayString][errorCode]++;
    }
    ;
  }
  storage.setDataInLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(currentStorage));
}

/**
 * Event handler for storing data into local storage. It will only store data if
 * local storage premissions are avaliable
 */
function localStorageHandler(data) {
  if (data.type === 'ERROR' && data.arguments && data.arguments[1] && data.arguments[1].bidder === BIDDER_CODE) {
    storeErrorEventData(data);
  }
}

/**
 * Get ixdiag stored in LocalStorage and format to be added to request payload
 *
 * @returns {Object} Object with error codes and counts
 */
function getCachedErrors() {
  if (!storage.localStorageIsEnabled()) {
    return;
  }
  var errors = {};
  var currentStorage;
  try {
    currentStorage = JSON.parse(storage.getDataFromLocalStorage(LOCAL_STORAGE_KEY) || '{}');
  } catch (e) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('ix can not read ixdiag from localStorage.');
    return null;
  }
  Object.keys(currentStorage).forEach(function (date) {
    Object.keys(currentStorage[date]).forEach(function (code) {
      if (typeof currentStorage[date][code] === 'number') {
        errors[code] = errors[code] ? errors[code] + currentStorage[date][code] : currentStorage[date][code];
      }
    });
  });
  return errors;
}

/**
 *
 * Initialize IX Outstream Renderer
 * @param {Object} bid
 */
function outstreamRenderer(bid) {
  bid.renderer.push(function () {
    var adUnitCode = bid.adUnitCode;
    var divId = document.getElementById(adUnitCode) ? adUnitCode : (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.getGptSlotInfoForAdUnitCode)(adUnitCode).divId;
    if (!divId) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("IX Bid Adapter: adUnitCode: ".concat(divId, " not found on page."));
      return;
    }
    window.createIXPlayer(divId, bid);
  });
}

/**
 * Create Outstream Renderer
 * @param {string} id
 * @returns {Renderer}
 */
function createRenderer(id, renderUrl) {
  var renderer = _src_Renderer_js__WEBPACK_IMPORTED_MODULE_12__.Renderer.install({
    id: id,
    url: renderUrl,
    loaded: false
  });
  try {
    renderer.setRender(outstreamRenderer);
  } catch (err) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('Prebid Error calling setRender on renderer', err);
    return null;
  }
  if (!renderUrl) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('Outstream renderer URL not found');
    return null;
  }
  return renderer;
}

/**
 * Returns whether our renderer could potentially be used.
 * @param {*} bid bid object
 */
function isIndexRendererPreferred(bid) {
  if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.context') !== 'outstream') {
    return false;
  }

  // ad unit renderer could be on the adUnit.mediaTypes.video level or adUnit level
  var renderer = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.renderer');
  if (!renderer) {
    renderer = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'renderer');
  }
  var isValid = !!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_7__["default"])(renderer) === 'object' && renderer.url && renderer.render);

  // if renderer on the adunit is not valid or it's only a backup, our renderer may be used
  return !isValid || renderer.backupOnly;
}
var spec = {
  code: BIDDER_CODE,
  gvlid: GLOBAL_VENDOR_ID,
  aliases: [{
    code: ALIAS_BIDDER_CODE,
    gvlid: GLOBAL_VENDOR_ID,
    skipPbsAliasing: false
  }],
  supportedMediaTypes: SUPPORTED_AD_TYPES,
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param  {object}  bid The bid to validate.
   * @return {boolean}     True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function isBidRequestValid(bid) {
    if (!hasRegisteredHandler) {
      _src_events_js__WEBPACK_IMPORTED_MODULE_13__.on(_src_constants_json__WEBPACK_IMPORTED_MODULE_14__.EVENTS.AUCTION_DEBUG, localStorageHandler);
      _src_events_js__WEBPACK_IMPORTED_MODULE_13__.on(_src_constants_json__WEBPACK_IMPORTED_MODULE_14__.EVENTS.AD_RENDER_FAILED, localStorageHandler);
      hasRegisteredHandler = true;
    }
    var paramsVideoRef = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'params.video');
    var paramsSize = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'params.size');
    var mediaTypeBannerSizes = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.banner.sizes');
    var mediaTypeVideoRef = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video');
    var mediaTypeVideoPlayerSize = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.playerSize');
    var hasBidFloor = bid.params.hasOwnProperty('bidFloor');
    var hasBidFloorCur = bid.params.hasOwnProperty('bidFloorCur');
    if (bid.hasOwnProperty('mediaType') && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.contains)(SUPPORTED_AD_TYPES, bid.mediaType)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)('IX Bid Adapter: media type is not supported.');
      return false;
    }
    if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.banner') && !mediaTypeBannerSizes) {
      return false;
    }
    if (paramsSize) {
      // since there is an ix bidder level size, make sure its valid
      var ixSize = getFirstSize(paramsSize);
      if (!ixSize) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('IX Bid Adapter: size has invalid format.', {
          bidder: BIDDER_CODE,
          code: ERROR_CODES.BID_SIZE_INVALID_FORMAT
        });
        return false;
      }
      // check if the ix bidder level size, is present in ad unit level
      if (!includesSize(bid.sizes, ixSize) && !includesSize(mediaTypeVideoPlayerSize, ixSize) && !includesSize(mediaTypeBannerSizes, ixSize)) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('IX Bid Adapter: bid size is not included in ad unit sizes or player size.', {
          bidder: BIDDER_CODE,
          code: ERROR_CODES.BID_SIZE_NOT_INCLUDED
        });
        return false;
      }
    }
    if (typeof bid.params.siteId !== 'string' && typeof bid.params.siteId !== 'number') {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('IX Bid Adapter: siteId must be string or number type.', {
        bidder: BIDDER_CODE,
        code: ERROR_CODES.SITE_ID_INVALID_VALUE
      });
      return false;
    }
    if (typeof bid.params.siteId !== 'string' && isNaN(Number(bid.params.siteId))) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('IX Bid Adapter: siteId must valid value', {
        bidder: BIDDER_CODE,
        code: ERROR_CODES.SITE_ID_INVALID_VALUE
      });
      return false;
    }
    if (hasBidFloor || hasBidFloorCur) {
      if (!(hasBidFloor && hasBidFloorCur && isValidBidFloorParams(bid.params.bidFloor, bid.params.bidFloorCur))) {
        (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('IX Bid Adapter: bidFloor / bidFloorCur parameter has invalid format.', {
          bidder: BIDDER_CODE,
          code: ERROR_CODES.BID_FLOOR_INVALID_FORMAT
        });
        return false;
      }
    }
    if (mediaTypeVideoRef && paramsVideoRef) {
      var videoImp = bidToVideoImp(bid).video;
      var errorList = checkVideoParams(mediaTypeVideoRef, paramsVideoRef);
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(bid, 'mediaTypes.video.context') === _src_video_js__WEBPACK_IMPORTED_MODULE_5__.OUTSTREAM && isIndexRendererPreferred(bid) && videoImp) {
        var outstreamPlayerSize = [(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(videoImp, 'w'), (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(videoImp, 'h')];
        var _isValidSize = outstreamPlayerSize[0] >= OUTSTREAM_MINIMUM_PLAYER_SIZE[0] && outstreamPlayerSize[1] >= OUTSTREAM_MINIMUM_PLAYER_SIZE[1];
        if (!_isValidSize) {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)("IX Bid Adapter: ".concat(outstreamPlayerSize, " is an invalid size for IX outstream renderer"));
          return false;
        }
      }
      if (errorList.length) {
        errorList.forEach(function (err) {
          (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)(err, {
            bidder: BIDDER_CODE,
            code: ERROR_CODES.PROPERTY_NOT_INCLUDED
          });
        });
        return false;
      }
    }
    return nativeMediaTypeValid(bid);
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param  {array}  validBidRequests A list of valid bid request config objects.
   * @param  {object} bidderRequest    A object contains bids and other info like gdprConsent.
   * @return {object}                  Info describing the request to the server.
   */
  buildRequests: function buildRequests(validBidRequests, bidderRequest) {
    var reqs = []; // Stores banner + video requests
    var bannerImps = {}; // Stores created banner impressions
    var videoImps = {}; // Stores created video impressions
    var nativeImps = {}; // Stores created native impressions
    var missingBannerSizes = {}; // To capture the missing sizes i.e not configured for ix
    FEATURE_TOGGLES.getFeatureToggles();

    // Step 1: Create impresssions from IX params
    validBidRequests.forEach(function (validBidRequest) {
      var adUnitMediaTypes = Object.keys((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(validBidRequest, 'mediaTypes', {}));
      for (var type in adUnitMediaTypes) {
        switch (adUnitMediaTypes[type]) {
          case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.BANNER:
            createBannerImps(validBidRequest, missingBannerSizes, bannerImps);
            break;
          case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO:
            createVideoImps(validBidRequest, videoImps);
            break;
          case _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.NATIVE:
            createNativeImps(validBidRequest, nativeImps);
            break;
          default:
            (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logWarn)("IX Bid Adapter: ad unit mediaTypes ".concat(type, " is not supported"));
        }
      }
    });

    // Step 2: Update banner impressions with missing sizes
    for (var transactionId in missingBannerSizes) {
      if (missingBannerSizes.hasOwnProperty(transactionId)) {
        var missingSizes = missingBannerSizes[transactionId].missingSizes;
        if (!bannerImps.hasOwnProperty(transactionId)) {
          bannerImps[transactionId] = {};
        }
        if (!bannerImps[transactionId].hasOwnProperty('missingImps')) {
          bannerImps[transactionId].missingImps = [];
          bannerImps[transactionId].missingCount = 0;
        }
        var origImp = missingBannerSizes[transactionId].impression;
        for (var i = 0; i < missingSizes.length; i++) {
          var newImp = createMissingBannerImp(validBidRequests[0], origImp, missingSizes[i]);
          bannerImps[transactionId].missingImps.push(newImp);
          bannerImps[transactionId].missingCount++;
        }
      }
    }

    // Step 4: Build banner, video & native requests
    if (Object.keys(bannerImps).length > 0) {
      reqs.push.apply(reqs, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__["default"])(buildRequest(validBidRequests, bidderRequest, bannerImps, BANNER_ENDPOINT_VERSION)));
    }
    if (Object.keys(videoImps).length > 0) {
      reqs.push.apply(reqs, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__["default"])(buildRequest(validBidRequests, bidderRequest, videoImps, VIDEO_ENDPOINT_VERSION)));
    }
    if (Object.keys(nativeImps).length > 0) {
      reqs.push.apply(reqs, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__["default"])(buildRequest(validBidRequests, bidderRequest, nativeImps)));
    }
    return reqs;
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param  {object} serverResponse A successful response from the server.
   * @param  {object} bidderRequest  The bid request sent to the server.
   * @return {array}                 An array of bids which were nested inside the server.
   */
  interpretResponse: function interpretResponse(serverResponse, bidderRequest) {
    var bids = [];
    var bid = null;
    if (!serverResponse.hasOwnProperty('body') || !serverResponse.body.hasOwnProperty('seatbid')) {
      FEATURE_TOGGLES.setFeatureToggles(serverResponse);
      return bids;
    }
    var responseBody = serverResponse.body;
    var seatbid = responseBody.seatbid;
    for (var i = 0; i < seatbid.length; i++) {
      if (!seatbid[i].hasOwnProperty('bid')) {
        continue;
      }

      // Transform rawBid in bid response to the format that will be accepted by prebid.
      var innerBids = seatbid[i].bid;
      var requestBid = bidderRequest.data;
      for (var j = 0; j < innerBids.length; j++) {
        var bidRequest = getBidRequest(innerBids[j].impid, requestBid.imp, bidderRequest.validBidRequests);
        bid = parseBid(innerBids[j], responseBody.cur, bidRequest);
        if (bid.mediaType === _src_mediaTypes_js__WEBPACK_IMPORTED_MODULE_1__.VIDEO && isIndexRendererPreferred(bidRequest)) {
          var renderUrl = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(responseBody, 'ext.videoplayerurl');
          bid.renderer = createRenderer(innerBids[j].bidId, renderUrl);
          if (!bid.renderer) {
            continue;
          }
        }
        bids.push(bid);
      }
      if ((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(requestBid, 'ext.ixdiag.err')) {
        if (storage.localStorageIsEnabled()) {
          try {
            storage.removeDataFromLocalStorage(LOCAL_STORAGE_KEY);
          } catch (e) {
            (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.logError)('ix can not clear ixdiag from localStorage.');
          }
        }
      }
    }
    FEATURE_TOGGLES.setFeatureToggles(serverResponse);
	  
	  //RDG
	var fledgeAuctionConfigs = [{
		bidId: bidderRequest.validBidRequests[0].bidId,
		config: {
			seller: seller,
			decisionLogicUrl: `${seller}/ssp/decision-logic.js`,
			interestGroupBuyers: [
				buyer1
			],
      trustedScoringSignalsUrl: `${seller}/ssp/kv.json`,
			sellerSignals: { seller_signals: 'seller_signals_pbjs' },
			perBuyerSignals: {
				[`${buyer1}`] : {
					per_buyer_signals: 'per_buyer_signals_pbjs',
				},
			},
		}
	}];
	if (fledgeAuctionConfigs) {
		return {bids, fledgeAuctionConfigs};
	} else {
		return bids;
	}
	  //RDG
    return bids;
  },
  /**
   * Covert bid param types for S2S
   * @param {Object} params bid params
   * @param {Boolean} isOpenRtb boolean to check openrtb2 protocol
   * @return {Object} params bid params
   */
  transformBidParams: function transformBidParams(params, isOpenRtb) {
    return (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_4__.convertTypes)({
      'siteID': 'number'
    }, params);
  },
  /**
   * Determine which user syncs should occur
   * @param {object} syncOptions
   * @param {array} serverResponses
   * @returns {array} User sync pixels
   */
  getUserSyncs: function getUserSyncs(syncOptions, serverResponses) {
    var syncs = [];
    var publisherSyncsPerBidderOverride = null;
    if (serverResponses.length > 0) {
      publisherSyncsPerBidderOverride = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"])(serverResponses[0], 'body.ext.publishersyncsperbidderoverride');
    }
    if (publisherSyncsPerBidderOverride !== undefined && publisherSyncsPerBidderOverride == 0) {
      return [];
    }
    if (syncOptions.iframeEnabled) {
      syncs.push({
        type: 'iframe',
        url: IFRAME_USER_SYNC_URL
      });
    } else {
      var publisherSyncsPerBidder = null;
      if (_src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('userSync')) {
        publisherSyncsPerBidder = _src_config_js__WEBPACK_IMPORTED_MODULE_8__.config.getConfig('userSync').syncsPerBidder;
      }
      if (publisherSyncsPerBidder === 0) {
        publisherSyncsPerBidder = publisherSyncsPerBidderOverride;
      }
      if (publisherSyncsPerBidderOverride && (publisherSyncsPerBidder === 0 || publisherSyncsPerBidder)) {
        publisherSyncsPerBidder = publisherSyncsPerBidderOverride > publisherSyncsPerBidder ? publisherSyncsPerBidder : publisherSyncsPerBidderOverride;
      } else {
        publisherSyncsPerBidder = 1;
      }
      for (var i = 0; i < publisherSyncsPerBidder; i++) {
        syncs.push({
          type: 'image',
          url: buildImgSyncUrl(publisherSyncsPerBidder, i)
        });
      }
    }
    return syncs;
  }
};

/**
   * Build img user sync url
   * @param {int} syncsPerBidder number of syncs Per Bidder
   * @param {int} index index to pass
   * @returns {string} img user sync url
   */
function buildImgSyncUrl(syncsPerBidder, index) {
  var consentString = '';
  var gdprApplies = '0';
  if (gdprConsent && gdprConsent.hasOwnProperty('gdprApplies')) {
    gdprApplies = gdprConsent.gdprApplies ? '1' : '0';
  }
  if (gdprConsent && gdprConsent.hasOwnProperty('consentString')) {
    consentString = gdprConsent.consentString || '';
  }
  return IMG_USER_SYNC_URL + '&site_id=' + siteID.toString() + '&p=' + syncsPerBidder.toString() + '&i=' + index.toString() + '&gdpr=' + gdprApplies + '&gdpr_consent=' + consentString + '&us_privacy=' + (usPrivacy || '');
}
(0,_src_adapters_bidderFactory_js__WEBPACK_IMPORTED_MODULE_15__.registerBidder)(spec);
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_16__.registerModule)('ixBidAdapter');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./modules/ixBidAdapter.js"));
/******/ }
]);

"use strict";
(self["pbjsChunk"] = self["pbjsChunk"] || []).push([["topicsFpdModule"],{

/***/ "./modules/topicsFpdModule.js":
/*!************************************!*\
  !*** ./modules/topicsFpdModule.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports coreStorage, topicStorageName, lastUpdated, getTopicsData, getTopics, processFpd, getCachedTopics, receiveMessage, storeInLocalStorage, hasGDPRConsent */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/prebidGlobal.js */ "./src/prebidGlobal.js");
/* harmony import */ var _src_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/utils.js */ "./src/utils.js");
/* harmony import */ var _src_refererDetection_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/refererDetection.js */ "./src/refererDetection.js");
/* harmony import */ var _src_hook_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/hook.js */ "./src/hook.js");
/* harmony import */ var _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/utils/promise.js */ "./src/utils/promise.js");
/* harmony import */ var _src_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/config.js */ "./src/config.js");
/* harmony import */ var _src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/storageManager.js */ "./src/storageManager.js");
/* harmony import */ var _src_polyfill_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/polyfill.js */ "./src/polyfill.js");
/* harmony import */ var _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/adapterManager.js */ "./src/adapterManager.js");












var MODULE_NAME = 'topicsFpd';
var DEFAULT_EXPIRATION_DAYS = 21;
var TCF_REQUIRED_PURPOSES = ['1', '2', '3', '4'];
var HAS_GDPR_CONSENT = true;
var LOAD_TOPICS_INITIALISE = false;
var HAS_DEVICE_ACCESS = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasDeviceAccess)();
var bidderIframeList = {
  maxTopicCaller: 1,
  bidders: [{
    bidder: 'pubmatic',
    iframeURL: 'https://ads.pubmatic.com/AdServer/js/topics/topics_frame.html'
  }]
};
var coreStorage = (0,_src_storageManager_js__WEBPACK_IMPORTED_MODULE_1__.getCoreStorageManager)(MODULE_NAME);
var topicStorageName = 'prebid:topics';
var lastUpdated = 'lastUpdated';
var iframeLoadedURL = [];
var TAXONOMIES = {
  // map from topic taxonomyVersion to IAB segment taxonomy
  '1': 600,
  '2': 601,
  '3': 602,
  '4': 603
};
function partitionBy(field, items) {
  return items.reduce(function (partitions, item) {
    var key = item[field];
    if (!partitions.hasOwnProperty(key)) partitions[key] = [];
    partitions[key].push(item);
    return partitions;
  }, {});
}

/**
 * function to get list of loaded Iframes calling Topics API
 */
function getLoadedIframeURL() {
  return iframeLoadedURL;
}

/**
 * function to set/push iframe in the list which is loaded to called topics API.
 */
function setLoadedIframeURL(url) {
  return iframeLoadedURL.push(url);
}
function getTopicsData(name, topics) {
  var taxonomies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TAXONOMIES;
  return Object.entries(partitionBy('taxonomyVersion', topics)).filter(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, 1),
      taxonomyVersion = _ref2[0];
    if (!taxonomies.hasOwnProperty(taxonomyVersion)) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)("Unrecognized taxonomyVersion from Topics API: \"".concat(taxonomyVersion, "\"; topic will be ignored"));
      return false;
    }
    return true;
  }).flatMap(function (_ref3) {
    var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref3, 2),
      taxonomyVersion = _ref4[0],
      topics = _ref4[1];
    return Object.entries(partitionBy('modelVersion', topics)).map(function (_ref5) {
      var _ref6 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref5, 2),
        modelVersion = _ref6[0],
        topics = _ref6[1];
      var datum = {
        ext: {
          segtax: taxonomies[taxonomyVersion],
          segclass: modelVersion
        },
        segment: topics.map(function (topic) {
          return {
            id: topic.topic.toString()
          };
        })
      };
      if (name != null) {
        datum.name = name;
      }
      return datum;
    });
  });
}
function getTopics() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var topics = null;
  try {
    if ('browsingTopics' in doc && doc.featurePolicy.allowsFeature('browsing-topics')) {
      topics = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise.resolve(doc.browsingTopics());
    }
  } catch (e) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logError)('Could not call topics API', e);
  }
  if (topics == null) {
    topics = _src_utils_promise_js__WEBPACK_IMPORTED_MODULE_3__.GreedyPromise.resolve([]);
  }
  return topics;
}
var topicsData = getTopics().then(function (topics) {
  return getTopicsData((0,_src_refererDetection_js__WEBPACK_IMPORTED_MODULE_4__.getRefererInfo)().domain, topics);
});
function processFpd(config, _ref7) {
  var global = _ref7.global;
  var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref8$data = _ref8.data,
    data = _ref8$data === void 0 ? topicsData : _ref8$data;
  if (!LOAD_TOPICS_INITIALISE) {
    loadTopicsForBidders();
    LOAD_TOPICS_INITIALISE = true;
  }
  return data.then(function (data) {
    data = [].concat(data, getCachedTopics()); // Add cached data in FPD data.
    if (data.length) {
      (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.mergeDeep)(global, {
        user: {
          data: data
        }
      });
    }
    return {
      global: global
    };
  });
}

/**
 * function to fetch the cached topic data from storage for bidders and return it
 */
function getCachedTopics() {
  var cachedTopicData = [];
  if (!HAS_GDPR_CONSENT || !HAS_DEVICE_ACCESS) {
    return cachedTopicData;
  }
  var topics = _src_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('userSync.topics') || bidderIframeList;
  var bidderList = topics.bidders || [];
  var storedSegments = new Map((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.safeJSONParse)(coreStorage.getDataFromLocalStorage(topicStorageName)));
  storedSegments && storedSegments.forEach(function (value, cachedBidder) {
    // Check bidder exist in config for cached bidder data and then only retrieve the cached data
    var bidderConfigObj = bidderList.find(function (_ref9) {
      var bidder = _ref9.bidder;
      return cachedBidder == bidder;
    });
    if (bidderConfigObj) {
      if (!isCachedDataExpired(value[lastUpdated], (bidderConfigObj === null || bidderConfigObj === void 0 ? void 0 : bidderConfigObj.expiry) || DEFAULT_EXPIRATION_DAYS)) {
        Object.keys(value).forEach(function (segData) {
          segData != lastUpdated && cachedTopicData.push(value[segData]);
        });
      } else {
        // delete the specific bidder map from the store and store the updated maps
        storedSegments.delete(cachedBidder);
        coreStorage.setDataInLocalStorage(topicStorageName, JSON.stringify((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(storedSegments)));
      }
    }
  });
  return cachedTopicData;
}

/**
 * Recieve messages from iframe loaded for bidders to fetch topic
 * @param {MessageEvent} evt
 */
function receiveMessage(evt) {
  if (evt && evt.data) {
    try {
      var data = (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.safeJSONParse)(evt.data);
      if ((0,_src_polyfill_js__WEBPACK_IMPORTED_MODULE_7__.includes)(getLoadedIframeURL(), evt.origin) && data && data.segment && !(0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(data.segment.topics)) {
        var _data$segment = data.segment,
          domain = _data$segment.domain,
          topics = _data$segment.topics,
          bidder = _data$segment.bidder;
        var iframeTopicsData = getTopicsData(domain, topics)[0];
        iframeTopicsData && storeInLocalStorage(bidder, iframeTopicsData);
      }
    } catch (err) {}
  }
}

/**
Function to store Topics data recieved from iframe in storage(name: "prebid:topics")
* @param {Topics} topics
*/
function storeInLocalStorage(bidder, topics) {
  var storedSegments = new Map((0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.safeJSONParse)(coreStorage.getDataFromLocalStorage(topicStorageName)));
  if (storedSegments.has(bidder)) {
    storedSegments.get(bidder)[topics['ext']['segclass']] = topics;
    storedSegments.get(bidder)[lastUpdated] = new Date().getTime();
    storedSegments.set(bidder, storedSegments.get(bidder));
  } else {
    var _storedSegments$set;
    storedSegments.set(bidder, (_storedSegments$set = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_storedSegments$set, topics.ext.segclass, topics), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_storedSegments$set, lastUpdated, new Date().getTime()), _storedSegments$set));
  }
  coreStorage.setDataInLocalStorage(topicStorageName, JSON.stringify((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(storedSegments)));
}
function isCachedDataExpired(storedTime, cacheTime) {
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  var currentTime = new Date().getTime();
  var daysDifference = Math.ceil((currentTime - storedTime) / _MS_PER_DAY);
  return daysDifference > cacheTime;
}

/**
* Function to get random bidders based on count passed with array of bidders
**/
function getRandomBidders(arr, count) {
  return (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(arr).sort(function () {
    return 0.5 - Math.random();
  }).slice(0, count);
}

/**
 * function to add listener for message receiving from IFRAME
 */
function listenMessagesFromTopicIframe() {
  window.addEventListener('message', receiveMessage, false);
}
function checkTCFv2(vendorData) {
  var requiredPurposes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TCF_REQUIRED_PURPOSES;
  var gdprApplies = vendorData.gdprApplies,
    purpose = vendorData.purpose;
  if (!gdprApplies || !purpose) {
    return true;
  }
  return requiredPurposes.map(function (purposeNo) {
    var purposeConsent = purpose.consents ? purpose.consents[purposeNo] : false;
    if (purposeConsent) {
      return true;
    }
    return false;
  }).reduce(function (a, b) {
    return a && b;
  }, true);
}
function hasGDPRConsent() {
  // Check for GDPR consent for purpose 1,2,3,4 and return false if consent has not been given
  var gdprConsent = _src_adapterManager_js__WEBPACK_IMPORTED_MODULE_9__.gdprDataHandler.getConsentData();
  var hasGdpr = gdprConsent && typeof gdprConsent.gdprApplies === 'boolean' && gdprConsent.gdprApplies ? 1 : 0;
  var gdprConsentString = hasGdpr ? gdprConsent.consentString : '';
  if (hasGdpr) {
    if (!gdprConsentString || gdprConsentString === '' || !gdprConsent.vendorData) {
      return false;
    }
    return checkTCFv2(gdprConsent.vendorData);
  }
  return true;
}

/**
 * function to load the iframes of the bidder to load the topics data
 */
function loadTopicsForBidders() {
  HAS_GDPR_CONSENT = hasGDPRConsent();
  if (!HAS_GDPR_CONSENT || !HAS_DEVICE_ACCESS) {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logInfo)('Topics Module : Consent string is required to fetch the topics from third party domains.');
    return;
  }
  var topics = _src_config_js__WEBPACK_IMPORTED_MODULE_5__.config.getConfig('userSync.topics') || bidderIframeList;
  if (topics) {
    listenMessagesFromTopicIframe();
    var randomBidders = getRandomBidders(topics.bidders || [], topics.maxTopicCaller || 1);
    randomBidders && randomBidders.forEach(function (_ref10) {
      var bidder = _ref10.bidder,
        iframeURL = _ref10.iframeURL;
      if (bidder && iframeURL) {
        var ifrm = document.createElement('iframe');
        ifrm.name = 'ifrm_'.concat(bidder);
        ifrm.src = ''.concat(iframeURL, '?bidder=').concat(bidder);
        ifrm.style.display = 'none';
        setLoadedIframeURL(new URL(iframeURL).origin);
        iframeURL && window.document.documentElement.appendChild(ifrm);
      }
    });
  } else {
    (0,_src_utils_js__WEBPACK_IMPORTED_MODULE_0__.logWarn)("Topics config not defined under userSync Object");
  }
}
(0,_src_hook_js__WEBPACK_IMPORTED_MODULE_10__.submodule)('firstPartyData', {
  name: 'topics',
  queue: 1,
  processFpd: processFpd
});
(0,_src_prebidGlobal_js__WEBPACK_IMPORTED_MODULE_11__.registerModule)('topicsFpdModule');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./modules/topicsFpdModule.js"));
/******/ }
]);

})()
 
   pbjs.processQueue();
 
} else {
 try {
  if(window.pbjs.getConfig('debug')) {
    console.warn('Attempted to load a copy of Prebid.js that clashes with the existing \'pbjs\' instance. Load aborted.');
  }
 } catch (e) {}
}

//# sourceMappingURL=prebid.js.map

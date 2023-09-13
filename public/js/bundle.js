// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
"use strict";

var _login = require("./login");
var _logOut = require("./logOut");
var _logOutUser = require("./logOutUser");
var _resetPass = require("./resetPass");
var _createUser = require("./createUser");
var _debitCredit = require("./debitCredit");
var _creditDebitSettle = require("./creditDebitSettle");
var _editUser = require("./editUser");
var _createRole = require("./createRole");
var _updateRoleByaxios = require("./updateRoleByaxios");
var _deleteRole = require("./deleteRole");
var _updatePASSWORD = require("./updatePASSWORD");
var _userStatus = require("./userStatus");
var _updateRow = require("./updateRow");
var _updatePromotion = require("./updatePromotion");
var _createPromotion = require("./createPromotion");
var _deletePormotion = require("./deletePormotion");
var _betLimit2 = require("./betLimit");
var _createHorizontalMenu = require("./createHorizontalMenu");
var _updateHorizonatlMenu = require("./updateHorizonatlMenu");
var _createBanner = require("./createBanner");
var _updateBanner = require("./updateBanner");
var _createpage = require("./createpage");
var _addImage = require("./addImage");
var _editSliderInImage = require("./editSliderInImage");
var _updateSlider = require("./updateSlider");
var _addSlider = require("./addSlider");
var _userLogin = require("./userLogin");
var _kyc = require("./kyc");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; } // import { betLockStatus } from "./batLockStatus";
// import { betLockStatus } from "./betLock";
// import { func } from "joi";

// console.log(document.querySelector('.loginForm'))
// console.log(document.getElementById('uname').textContent)
// if(document.querySelector('.loginForm')){
//     document.querySelector('.loginForm').addEventListener('submit', e =>{
//     e.preventDefault();
//     console.log("WORKING")
//     const email = document.getElementById('uname').value;
//     const password = document.getElementById('password').value;
//     // console.log(email)
//     login(email, password);
// })};
var _window$location = window.location,
  host = _window$location.host,
  hostname = _window$location.hostname,
  href = _window$location.href,
  origin = _window$location.origin,
  pathname = _window$location.pathname,
  port = _window$location.port,
  protocol = _window$location.protocol,
  search = _window$location.search;
$(document).ready(function () {
  var linkColor = document.querySelectorAll('.nav_link');
  var operationPathnameArr = ['/admin/houseManagement', '/admin/whiteLableAnalysis', '/admin/commissionMarkets', '/admin/settlement', '/admin/settlementHistory', '/admin/commissionReport', '/admin/gameanalysis', '/admin/Notification', '/admin/betmoniter', '/admin/onlineUsers', '/admin/alertbet', '/admin/betlimit', '/admin/voidbet'];
  var reportsPathnameArr = ['/admin/gamereport', '/admin/useracount', '/admin/reports', '/admin/userhistoryreport', '/admin/plreport'];
  var cmsPathnameArr = ['/admin/cms', '/admin/pageManager', '/admin/gameRules'];
  function colorLink() {
    if (linkColor) {
      linkColor.forEach(function (l) {
        return l.classList.remove('active');
      });
      $("a[href='" + pathname + "'").addClass('active');
      if (operationPathnameArr.includes(pathname) || reportsPathnameArr.includes(pathname) || cmsPathnameArr.includes(pathname)) {
        $("a[href='" + pathname + "'").parent().parent().siblings('a').addClass('active');
        $("a[href='" + pathname + "'").parent().parent().addClass('open');
      }
      console.log(pathname);
      if (pathname == '/admin/catalogcontrol/compitations' || pathname == '/admin/catalogcontrol/compitations/events') {
        $("a[href='" + '/admin/catalogcontrol' + "'").addClass('active');
      } else if (pathname == '/admin/riskAnalysis') {
        $("a[href='" + '/admin/liveMarket' + "'").addClass('active');
      } else if (pathname == '/admin/userdetails') {
        $("a[href='" + '/admin/userManagement' + "'").addClass('active');
      } else if (pathname == '/admin/settlementIn') {
        $("a[href='" + '/admin/settlement' + "'").addClass('active');
        $("a[href='" + '/admin/settlement' + "'").parent().parent().siblings('a').addClass('active');
        $("a[href='" + '/admin/settlement' + "'").parent().parent().addClass('open');
      }
      // this.classList.add('active')
    }
  }

  colorLink();
  $('input:checked').parents('.switch').addClass("on");
});
$(document).on("submit", ".loginFormAdmin", function (e) {
  e.preventDefault();
  // console.log("Working")
  var email = document.getElementById('uname').value;
  var password = document.getElementById('password').value;
  //     // console.log(email)
  (0, _login.login)(email, password);
});
$(document).on('click', ".logOut", function (e) {
  e.preventDefault();
  // console.log('Working')
  // console.log(this)
  (0, _logOut.logout)();
});
$(document).on('click', ".logOutUser", function (e) {
  e.preventDefault();
  // console.log('Working')
  // console.log(this)
  (0, _logOutUser.logoutUser)();
});

// if(document.querySelector("ResetFORM")){
//     document.querySelector("ResetFORM").addEventListener("submit", e => {
//         e.preventDefault();
//         // const oldPassword = document.getElementById("opsw").value;
//         const newPass = document.getElementById("npsw").value;
//         const confirmPassword = document.getElementById("cpsw").value

//         reset(newPass, confirmPassword)
//     })
// };

$('#Add-User').submit(function (e) {
  e.preventDefault();
  var form = document.getElementById('Add-User');
  var data = new FormData(form);
  var formDataObj = Object.fromEntries(data.entries());
  console.log(formDataObj);
  if (formDataObj.whiteLabel == "") {
    formDataObj.whiteLabel = document.getElementById("whiteLabel").value;
  }
  (0, _createUser.createUser)(formDataObj);
});
$(document).on('click', '.updateBetLimit', function (e) {
  var rowId = $(this).parent().parent().parent().attr('id');
  $('.rowId').attr('data-rowid', rowId);
  var modleName = $(this).data('bs-target');
  var form = $(modleName).find('.form-data');
  var betLimit = $(this).parent().data('details');
  form.find('input[name = "min_stake"]').val(betLimit.min_stake);
  form.find('input[name = "max_stake"]').val(betLimit.max_stake);
  form.find('input[name = "max_profit"]').val(betLimit.max_profit);
  form.find('input[name = "max_odd"]').val(betLimit.max_odd);
  form.find('input[name = "delay"]').val(betLimit.delay);
  form.find('input[name = "type"]').val(betLimit.type);
  form.find('input[name = "id"]').val(betLimit._id);
});
$(document).on('submit', '.passReset-form', function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  var formDataObj = Object.fromEntries(fd.entries());
  var id = form.id;
  formDataObj.id = id;
  // console.log(formDataObj)
  (0, _resetPass.reset)(formDataObj);
});
$(document).on('submit', '#edit-form', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
    var form, fd, formDataObj, rowId, user, currentUser;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          form = $(this)[0];
          fd = new FormData(form);
          formDataObj = Object.fromEntries(fd.entries()); // console.log(formDataObj);
          rowId = $('.rowId').attr('data-rowid');
          _context.next = 7;
          return (0, _editUser.editUser)(formDataObj);
        case 7:
          user = _context.sent;
          // console.log(user)
          currentUser = $('#currentUserDetails').data('currentuser'); // console.log(user)
          (0, _updateRow.updateRow)(user, rowId, currentUser);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// $(document).on('submit', ".myloginmodl-form-dv", function(e){
//     e.preventDefault()
//     let form = $(this)[0];
//     let fd = new FormData(form);
//     let data = Object.fromEntries(fd.entries());
//     socket.emit('Login', data);
//     })

$(document).on('submit', '.form-betLimit', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
    var form, fd, data, res, _betLimit, rowId;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          e.preventDefault();
          form = $(this)[0];
          fd = new FormData(form);
          data = Object.fromEntries(fd.entries()); // console.log(data)
          _context2.next = 6;
          return (0, _betLimit2.betLimit)(data);
        case 6:
          res = _context2.sent;
          if (res) {
            _betLimit = res;
            rowId = $('.rowId').attr('data-rowid');
            $('#' + rowId).html("\n            <td class=\"btn-filter\">".concat(_betLimit.type, "</td>\n            <td><input type=\"text\" class=\"form-datas\" value='").concat(_betLimit.min_stake, "'></td>\n            <td><input type=\"text\" class=\"form-datas\" value='").concat(_betLimit.max_stake, "'></td>\n            <td><input type=\"text\" class=\"form-datas\" value='").concat(_betLimit.max_profit, "'></td>\n            <td><input type=\"text\" class=\"form-datas\" value='").concat(_betLimit.max_odd, "'></td>\n            <td><input type=\"text\" class=\"form-datas\" value='").concat(_betLimit.delay, "'></td>\n            <td data-details='").concat(JSON.stringify(_betLimit), "'><button type=\"button\" data-bs-toggle=\"modal\" data-bs-target=\"#myModal2\"class=\"updateBetLimit\">Update</button></td>"));
            alert("updated SuccessFully");
          }
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
$(document).on('submit', '.acc-form', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(e) {
    var form, id, fd, formDataObj, user, trElements;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          e.preventDefault();
          form = $(this)[0];
          id = form.id;
          fd = new FormData(form);
          formDataObj = Object.fromEntries(fd.entries());
          formDataObj.id = id;
          console.log(formDataObj);
          // const url = window.location.href
          // const id = url.split("=")[1]
          // formDataObj.id = id
          // console.log(formDataObj)
          // let rowId = $('.rowId').attr('data-rowid')
          _context3.next = 9;
          return (0, _debitCredit.debitCredit)(formDataObj);
        case 9:
          user = _context3.sent;
          trElements = document.querySelectorAll('tr.trtable'); // console.log(trElements)
          // console.log(user)
          trElements.forEach(function (trElement) {
            if (trElement.getAttribute('data-id') === user.id) {
              console.log(trElement, 4545445454);
            }
          });
          // console.log(rowId)
          // let currentUser = $('#currentUserDetails').data('currentuser')
          // updateRow(user,rowId,currentUser)
          // console.log(user)
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
$(document).on('submit', '.Settlement-form', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(e) {
    var form, id, fd, formDataObj;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          e.preventDefault();
          form = $(this)[0];
          id = form.id;
          fd = new FormData(form);
          formDataObj = Object.fromEntries(fd.entries());
          formDataObj.id = id;
          console.log(formDataObj);
          // const url = window.location.href
          // const id = url.split("=")[1]
          // formDataObj.id = id
          // console.log(formDataObj)
          // let rowId = $('.rowId').attr('data-rowid')
          (0, _creditDebitSettle.creditDebitSettle)(formDataObj);
          // const user = await creditDebitSettle(formDataObj)
          // var trElements = document.querySelectorAll('tr.trtable');
          // // console.log(trElements)
          // // console.log(user)
          // trElements.forEach(function(trElement) {
          //     if (trElement.getAttribute('data-id') === user.id) {
          //         console.log(trElement, 4545445454)
          //     }
          // })
          // console.log(rowId)
          // let currentUser = $('#currentUserDetails').data('currentuser')
          // updateRow(user,rowId,currentUser)
          // console.log(user)
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4, this);
  }));
  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());

// $('.edit-form').submit(function(e){
//     e.preventDefault();
//     let form = $(this)[0];
//     let fd = new FormData(form)
//     const formDataObj = Object.fromEntries(fd.entries())
//     editUser(formDataObj)
// });

// $(document).on('click','.betLockStatus',function(e) {
//     e.preventDefault();
//     const data = $(this).data('myval')
//     betLockStatus(data)
// })

$('.createRole-form1').submit(function (e) {
  e.preventDefault();
  var authorization = [];
  var authCheck = document.querySelectorAll("input[name='authorization']:checked");
  for (var i = 0; i < authCheck.length; i++) {
    authorization.push(authCheck[i].value);
  }
  var roleAuthorization = [];
  var checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
  for (var _i = 0; _i < checkboxes.length; _i++) {
    roleAuthorization.push(checkboxes[_i].value);
  }
  var roleName = $('#roleName').val();
  var data = {
    authorization: authorization,
    userAuthorization: roleAuthorization,
    roleName: roleName,
    name: roleName
  };
  console.log(data);
  (0, _createRole.createRole)(data);
});

// $('#searchUser').keyup(function(){
//     let data = $(this).val()
//     searchUser(data)
// })

// if(document.querySelector(".updateRole")){
//     document.querySelector(".updateRole").addEventListener('submit', e => {
//         e.preventDefault()
//     let roleName = document.getElementById("mySelect").value
//     let role_level = document.getElementById("role_level").value
//     let authorization = [];
//     let roleAuthorization = [];
//     let authCheck = document.querySelectorAll("input[name='authorization']:checked");
//     for (let i = 0 ; i < authCheck.length; i++) {
//         roleAuthorization.push(authCheck[i].value)
//     }
//     let checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
//     for (let i = 0 ; i < checkboxes.length; i++) {
//         authorization.push(checkboxes[i].value)
//     }
//     let data = {
//         authorization,
//         userAuthorization:roleAuthorization,
//         roleName,
//         role_level
//     }
//     // console.log(data)
//     updateRole(data)
//     })
// };

if (document.querySelector('.ChangeFORM')) {
  document.querySelector('.ChangeFORM').addEventListener('submit', function (e) {
    e.preventDefault();
    // console.log("working")   
    var form = document.getElementById('changePass-form');
    var data = new FormData(form);
    var formDataObj = Object.fromEntries(data.entries());
    // console.log(formDataObj)
    (0, _updatePASSWORD.updatePassword)(formDataObj);
  });
}
;

// console.log("abc")
// if(document.querySelector('#whitelabel')){
//     let x = document.getElementById('whitelabel').value
//         console.log(x, "123456789")
//         document.getElementById('for_new_whitelabel').textContent = x
//     document.querySelector('#whitelabel').addEventListener("onchange", function(){
//         // let x = document.getElementById('whitelabel').value
//         // console.log(x)
//     })
// }
$('#whitelabel').on('change', function () {
  var whitLable = $(this).find(":selected").val();
  // let x = document.getElementById('whitelabel').value
  // console.log(x)
  document.getElementById('for_new_whitelabel').value = whitLable;
});

// $('document').ready(function(){
//     var urlParams = new URLSearchParams(window.location.search);

//     // Get value of single parameter
//     var page = urlParams.get('page');   // alert(page)

//     $('.pageLink').attr('data-page',page)

// })

$(document).on('click', '.open_popup', function () {
  $(this).parent(".popup_main").children(".popup_body").addClass("popup_body_show");
  var rowId = $(this).parent().parent().parent().attr('id');
  // console.log(rowId)
  $('.rowId').attr('data-rowid', rowId);
});
$(document).on('click', '.popup_close', function () {
  $(".popup_body").removeClass("popup_body_show");
});
$(document).on('click', '.popup_back', function () {
  $(".popup_body").removeClass("popup_body_show");
});
$(document).on('submit', '.userStatus', function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  var id = form.id;
  var formDataObj = Object.fromEntries(fd.entries());
  formDataObj.id = id;
  var rowId = $('.rowId').attr('data-rowid');
  console.log(formDataObj, "WORKING1212121");
  // var trElement = document.querySelector(`tr[data-id="${id}"]`);
  // let rowId = trElement.id
  // console.log(rowId)
  // console.log(formDataObj)
  (0, _userStatus.userStatus)(formDataObj, rowId);
});
$(document).on('click', '.Withdraw', function () {
  var rowId = $(this).parent().parent().attr('id');
  $('.rowId').attr('data-rowid', rowId);
  var modleName = $(this).data('bs-target');
  var form = $(modleName).find('.form-data');
  var userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss');
  var me = $('#meDatails').data('me');
  form.find('input[name = "fromUser"]').attr('value', me.userName);
  form.find('input[name = "toUser"]').attr('value', userData.userName);
  form.find('input[name = "fuBalance"]').attr('value', me.balance);
  form.find('input[name = "tuBalance"]').attr('value', userData.balance);
  form.find('input[name = "clintPL"]').attr('value', userData.clientPL);
  form.find('input[name = "id"]').attr('value', userData._id);
});

// $(document).on('click','.CreaditChange',function(){
//     let rowId = $(this).parent().parent().attr('id')
//         $('.rowId').attr('data-rowid',rowId)
//     let modleName = $(this).data('bs-target')
//     let form = $(modleName).find('.form-data')
//     let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
//     let me = $('#meDatails').data('me')
//     form.find('input[name = "credit"]').attr('value',userData.creditReference)
//     form.find('input[name = "newCreadit"]').attr('value','0')
// })

// $(document).on('click','.UserDetails',function(){
//     // let rowId = $(this).parent().parent().attr('id')
//         // $('.rowId').attr('data-rowid',rowId)
//     let modleName = $(this).data('bs-target')
//     let form = $(modleName).find('.form-data')
//     let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
//     let me = $('#meDatails').data('me')
//     // console.log(userData)
//     form.find('input[name = "name"]').attr('value',userData.name)
//     form.find('input[name = "userName"]').attr('value',userData.userName)
//     form.find('input[name = "id"]').attr('value',userData._id)
//     form.find('input[name = "exposureLimit"]').attr('value',userData.exposureLimit)
//     form.find('select option[value="'+userData.role._id+'"]').attr('selected','selected')
//     let rowId = $(this).parent().parent().attr('id')
//     // console.log(rowId)
//     $('.rowId').attr('data-rowid',rowId)
// });

$(document).on('click', '.RoleDetails', function () {
  console.log("Working");
  var modleName = $(this).data('bs-target');
  var roledata = $(this).parent().parent('td').siblings('.getRoleForPopUP').data('bs-dismiss');
  console.log(roledata);
  var form = $(modleName).find('.UpdateRole-form');
  // let x = form.find('input[id="check"]').length
  // console.log(x)
  // for(let i = 0; i < x ; i++){
  //     document.getElementsByClassName(`${i}`).checked = false
  // }
  form.attr('id', roledata._id);
  form.find('input:checkbox').removeAttr('checked');
  // console.log(roledata, 45654654654)
  form.find('input[name = "name"]').attr('value', roledata.name);
  // console.log(roledata.authorization)
  for (var i = 0; i < roledata.authorization.length; i++) {
    form.find("input[value = \"".concat(roledata.authorization[i], "\"]")).attr("checked", "checked");
  }
  for (var _i2 = 0; _i2 < roledata.userAuthorization.length; _i2++) {
    form.find("input[value = \"".concat(roledata.userAuthorization[_i2], "\"]")).attr("checked", "checked");
  }
  // document.getElementById("role_controller").innerHTML = `
  //         <label for="level"> <h3>Role Level </h3></label><br>
  //         <input type="number" name="level" placeholder='${roledata.role_level}' id='role_level'>`
});

$(document).on("submit", ".UpdateRole-form", function (e) {
  e.preventDefault();
  var id = $(this).attr("id");
  var roleName = document.getElementById("mySelect").value;
  var authorization = [];
  var roleAuthorization = [];
  var authCheck = document.querySelectorAll("input[name='authorization']:checked");
  for (var i = 0; i < authCheck.length; i++) {
    roleAuthorization.push(authCheck[i].value);
  }
  var checkboxes = document.querySelectorAll("input[name='userAuthorization']:checked");
  for (var _i3 = 0; _i3 < checkboxes.length; _i3++) {
    authorization.push(checkboxes[_i3].value);
  }
  var data = {
    id: id,
    authorization: authorization,
    userAuthorization: roleAuthorization,
    roleName: roleName
  };
  console.log(data);
  (0, _updateRoleByaxios.updateRole)(data);
});
$(document).on('click', '.deleteRole', function (e) {
  var roledata = $(this).parent().parent('td').siblings('.getRoleForPopUP').data('bs-dismiss');
  if (confirm('do you want to delete this role')) {
    (0, _deleteRole.deleteRole)({
      "id": roledata._id
    });
  }
});
$(document).on('submit', ".form-data1", function (e) {
  e.preventDefault();
  var id = $('.form-data1').attr('id');
  var check = document.getElementById('check');
  var form = new FormData();
  form.append('Id', id);
  form.append('position', document.getElementById('name').value);
  form.append("link", document.getElementById('link').value);
  if (check.checked == true) {
    form.append('status', "on");
  } else {
    form.append('status', "off");
  }
  form.append('image', document.getElementById('file').files[0]);
  // console.log(form)
  (0, _updatePromotion.updatePromotion)(form);
});
$(document).on('submit', '.form-data2', function (e) {
  e.preventDefault();
  var form = new FormData();
  form.append('position', document.getElementById('name1').value);
  form.append('link', document.getElementById('url1').value);
  form.append('image', document.getElementById('file1').files[0]);
  (0, _createPromotion.createPromotion)(form);
});
$(document).on('click', ".Delete", function () {
  var data = {};
  data.id = $(this).attr('id');
  (0, _deletePormotion.deletePromotion)(data);
});
$(document).on('submit', '.form-data22', function (e) {
  e.preventDefault();
  var form = new FormData();
  form.append('menuName', document.getElementById('menuName').value);
  form.append('url', document.getElementById('url').value);
  form.append('page', document.getElementById('page').value);
  form.append('Icon', document.getElementById('Icon').files[0]);
  (0, _createHorizontalMenu.createHorizontalMenu)(form);
});
$(document).on('submit', ".form-data23", function (e) {
  e.preventDefault();
  var id = $('.form-data23').attr('id');
  var form = $(this)[0];
  var fd = new FormData(form);
  fd.append('id', id);
  var data = Object.fromEntries(fd.entries());
  console.log(data);
  // form.append('image',document.getElementById('file').files[0])
  // console.log(form)
  (0, _updateHorizonatlMenu.updateHorizontalMenu)(fd);
});
$(document).on('submit', ".form-data24", function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  // console.log(fd)
  (0, _createBanner.createBanner)(fd);
});
$(document).on("submit", ".form-data25", function (e) {
  e.preventDefault();
  var id = $(this).attr('id');
  var form = $(this)[0];
  var fd = new FormData(form);
  fd.append('id', id);
  (0, _updateBanner.updateBanner)(fd);
});
$(document).on('submit', ".uploadEJS", function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  (0, _createpage.createPage)(fd);
});
$(document).on('submit', ".form-data26", function (e) {
  e.preventDefault();
  var id = $(this).attr('id');
  var form = $(this)[0];
  var fd = new FormData(form);
  fd.append('id', id);
  (0, _addImage.addImage)(fd);
});
$(document).on('submit', ".editImageSportForm", function (e) {
  e.preventDefault();
  var id = $(this).attr('id');
  var form = $(this)[0];
  var fd = new FormData(form);
  fd.append('id', id);
  (0, _editSliderInImage.editSliderInImage)(fd);
});
$(document).on('submit', ".slider-form", function (e) {
  e.preventDefault();
  var id = $(this).attr("id");
  var form = $(this)[0];
  var fd = new FormData(form);
  fd.append('id', id);
  (0, _updateSlider.updateSlider)(fd);
});
$(document).on('submit', ".addSlider-form", function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  (0, _addSlider.createSlider)(fd);
});
$(document).on('submit', ".myloginmodl-form-dv", function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  var data = Object.fromEntries(fd.entries());
  (0, _userLogin.userLogin)(data);
});
$(document).on("click", ".myloginmodl-demo-loginbtnn", function (e) {
  e.preventDefault();
  console.log("WORKING");
  (0, _userLogin.userLogin)({
    data: "Demo"
  });
});
$(document).on('submit', ".kycForm", function (e) {
  e.preventDefault();
  var form = $(this)[0];
  var fd = new FormData(form);
  var data = Object.fromEntries(fd.entries());
  // console.log(data)
  (0, _kyc.KYC)(fd);
});
},{}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60471" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map
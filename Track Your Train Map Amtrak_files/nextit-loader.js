(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 825);
/******/ })
/************************************************************************/
/******/ ({

/***/ 825:
/***/ (function(module, exports, __webpack_require__) {

(function () {
  var AlmeUiVersion = "1.33.3"; // get script reference

  var scriptTags = document.getElementsByTagName('script');
  var url = '';

  for (var i = 0; i < scriptTags.length; i++) {
    var src = scriptTags[i].getAttribute('src', -1); // Use indexOf for IE 11 support
    // eslint-disable-next-line @typescript-eslint/prefer-includes

    if (src > '' && src.toLowerCase().indexOf('nextit-script-manager.js') > -1) {
      url = src;
      break;
    }
  }

  var baseUrl = url.substr(0, url.toLowerCase().lastIndexOf('/'));

  (function loadBundle() {
    var scriptTag = document.createElement('script');
    scriptTag.id = "nit-bundle";
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('language', 'javascript');
    scriptTag.setAttribute('async', 'true');
    scriptTag.setAttribute('src', baseUrl + '/nextit-bundle.js?' + AlmeUiVersion);
    var parent = document.getElementsByTagName('head')[0];
    if (parent) parent.appendChild(scriptTag);
  })();
})();

/***/ })

/******/ });
});
//# sourceMappingURL=nextit-loader.js.map
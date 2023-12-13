(self["webpackChunk"] = self["webpackChunk"] || []).push([["user"],{

/***/ "./assets/js/menu.js":
/*!***************************!*\
  !*** ./assets/js/menu.js ***!
  \***************************/
/***/ (() => {

/*le bouton icon va permuter nav et navresponsive au click */
function myFunction() {
  var x = document.getElementById("navbar");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}

/***/ }),

/***/ "./assets/js/price-input.js":
/*!**********************************!*\
  !*** ./assets/js/price-input.js ***!
  \**********************************/
/***/ (() => {

"use strict";


console.log("coucous inputpricejs");
document.addEventListener('DOMContentLoaded', function () {
  //pour vider l'input, pas de saisie automatique
  var modifiedPriceInput = document.getElementById('calendar_modifiedPrice');
  modifiedPriceInput.addEventListener('change', function () {
    if (modifiedPriceInput.value === '') {
      modifiedPriceInput.defaultValue = '';
    }
  });
  var form = document.querySelector('form');
  form.addEventListener('submit', function () {
    if (modifiedPriceInput.value === modifiedPriceInput.defaultValue) {
      modifiedPriceInput.value = '';
    }
  });
});

/***/ }),

/***/ "./assets/js/searchphone.js":
/*!**********************************!*\
  !*** ./assets/js/searchphone.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


__webpack_require__(/*! core-js/modules/es.string.trim.js */ "./node_modules/core-js/modules/es.string.trim.js");
__webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__(/*! core-js/modules/es.promise.js */ "./node_modules/core-js/modules/es.promise.js");
__webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
__webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
console.log("coucou searchphonejs");
var inputPhone = document.querySelector('#user-search-phone');
var resultsPhone = document.querySelector('#result-phone');
inputPhone.addEventListener('input', function () {
  searchByPhone();
});
function searchByPhone() {
  var searchTerm = inputPhone.value.trim();
  if (searchTerm === '') {
    resultsPhone.innerHTML = '';
    return;
  }
  fetch("/searchphone/".concat(searchTerm)).then(function (response) {
    return response.json();
  }).then(function (users) {
    resultsPhone.innerHTML = '';
    users.forEach(function (user) {
      var div = document.createElement('div');
      var email = user.email;
      div.classList.add('container');
      div.innerHTML = "\n                    <h2>".concat(user.email, "</h2>\n                    <a href=\"purchase/user/").concat(user.id, "\">Voir d\xE9tail client</a>\n                ");
      resultsPhone.append(div);
    });
  });
}

/***/ }),

/***/ "./assets/js/searchuser.js":
/*!*********************************!*\
  !*** ./assets/js/searchuser.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


__webpack_require__(/*! core-js/modules/es.string.trim.js */ "./node_modules/core-js/modules/es.string.trim.js");
__webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__(/*! core-js/modules/es.promise.js */ "./node_modules/core-js/modules/es.promise.js");
__webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
__webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
console.log("coucous searchjs");
var input = document.querySelector('#user-search-email');
var results = document.querySelector('#result-email');
input.addEventListener('input', function () {
  searchUser();
});
function searchUser() {
  var searchTerm = input.value.trim();
  if (searchTerm === '') {
    results.innerHTML = '';
    return;
  }
  fetch("/search/".concat(searchTerm)).then(function (response) {
    return response.json();
  }).then(function (users) {
    results.innerHTML = '';
    users.forEach(function (user) {
      var div = document.createElement('div');
      var email = user.email;
      //   let fullName = user.fullName;

      div.classList.add('container');
      div.innerHTML = "\n                    <h2>".concat(user.fullName, "</h2>\n                    <a href=\"purchase/user/").concat(user.id, "\">Voir d\xE9tails client</a>\n                ");
      results.append(div);
    });
  });
}

/***/ }),

/***/ "./assets/js/searchusername.js":
/*!*************************************!*\
  !*** ./assets/js/searchusername.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


__webpack_require__(/*! core-js/modules/es.string.trim.js */ "./node_modules/core-js/modules/es.string.trim.js");
__webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__(/*! core-js/modules/es.promise.js */ "./node_modules/core-js/modules/es.promise.js");
__webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
__webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
console.log("coucou searchnamejs");
var inputName = document.querySelector('#user-search-name');
var resultsName = document.querySelector('#result-name');
inputName.addEventListener('input', function () {
  searchByName();
});
function searchByName() {
  var searchTerm = inputName.value.trim();
  if (searchTerm === '') {
    resultsName.innerHTML = '';
    return;
  }
  fetch("/searchname/".concat(searchTerm)).then(function (response) {
    return response.json();
  }).then(function (users) {
    resultsName.innerHTML = '';
    users.forEach(function (user) {
      var div = document.createElement('div');
      var email = user.email;
      div.classList.add('container');
      div.innerHTML = "\n                    <h2>".concat(user.email, "</h2>\n                    <a href=\"purchase/user/").concat(user.id, "\">Voir d\xE9tail client</a>\n                ");
      resultsName.append(div);
    });
  });
}

/***/ }),

/***/ "./assets/user.js":
/*!************************!*\
  !*** ./assets/user.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/app.css */ "./assets/styles/app.css");
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/style.css */ "./assets/styles/style.css");
/* harmony import */ var _js_searchphone_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/searchphone.js */ "./assets/js/searchphone.js");
/* harmony import */ var _js_searchphone_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_js_searchphone_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _js_searchuser_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/searchuser.js */ "./assets/js/searchuser.js");
/* harmony import */ var _js_searchuser_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_js_searchuser_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _js_searchusername_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/searchusername.js */ "./assets/js/searchusername.js");
/* harmony import */ var _js_searchusername_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_js_searchusername_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _js_menu_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./js/menu.js */ "./assets/js/menu.js");
/* harmony import */ var _js_menu_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_js_menu_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _js_price_input_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./js/price-input.js */ "./assets/js/price-input.js");
/* harmony import */ var _js_price_input_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_js_price_input_js__WEBPACK_IMPORTED_MODULE_6__);
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)








/***/ }),

/***/ "./assets/styles/app.css":
/*!*******************************!*\
  !*** ./assets/styles/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/styles/style.css":
/*!*********************************!*\
  !*** ./assets/styles/style.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_core-js_internals_a-constructor_js-node_modules_core-js_internals_array--0b3311","vendors-node_modules_core-js_modules_es_array_concat_js-node_modules_core-js_modules_es_array-e643a4","assets_styles_app_css-assets_styles_style_css"], () => (__webpack_exec__("./assets/user.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBQUMsSUFBSSxFQUFJO01BQ2xCLElBQUlDLEdBQUcsR0FBRzFCLFFBQVEsQ0FBQzJCLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDdkMsSUFBSUMsS0FBSyxHQUFHSCxJQUFJLENBQUNHLEtBQUs7TUFDdEJGLEdBQUcsQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDO01BQzlCSixHQUFHLENBQUNULFNBQVMsZ0NBQUFFLE1BQUEsQ0FDSE0sSUFBSSxDQUFDRyxLQUFLLHlEQUFBVCxNQUFBLENBQ1NNLElBQUksQ0FBQ00sRUFBRSxtREFDbkM7TUFDRE8sV0FBVyxDQUFDTixNQUFNLENBQUNOLEdBQUcsQ0FBQztJQUMzQixDQUFDLENBQUM7RUFDTixDQUFDLENBQUM7QUFDVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUMwQjtBQUNFO0FBQ0M7QUFDRDtBQUNJO0FBQ1Y7Ozs7Ozs7Ozs7Ozs7QUNkdEI7Ozs7Ozs7Ozs7Ozs7QUNBQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9qcy9tZW51LmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9wcmljZS1pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvc2VhcmNocGhvbmUuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3NlYXJjaHVzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3NlYXJjaHVzZXJuYW1lLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy91c2VyLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9zdHlsZXMvYXBwLmNzcz8zZmJhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zdHlsZXMvc3R5bGUuY3NzPzI1MzgiXSwic291cmNlc0NvbnRlbnQiOlsiLypsZSBib3V0b24gaWNvbiB2YSBwZXJtdXRlciBuYXYgZXQgbmF2cmVzcG9uc2l2ZSBhdSBjbGljayAqL1xyXG5mdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xyXG4gdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdmJhclwiKTtcclxuIGlmICh4LmNsYXNzTmFtZSA9PT0gXCJuYXZcIikge1xyXG4gICAgIHguY2xhc3NOYW1lICs9IFwiIHJlc3BvbnNpdmVcIjtcclxuXHJcbiB9IGVsc2Uge1xyXG4gICAgIHguY2xhc3NOYW1lID0gXCJuYXZcIjtcclxuIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnNvbGUubG9nKFwiY291Y291cyBpbnB1dHByaWNlanNcIik7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIC8vcG91ciB2aWRlciBsJ2lucHV0LCBwYXMgZGUgc2Fpc2llIGF1dG9tYXRpcXVlXHJcbiAgICB2YXIgbW9kaWZpZWRQcmljZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbGVuZGFyX21vZGlmaWVkUHJpY2UnKTtcclxuXHJcbiAgICBtb2RpZmllZFByaWNlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKG1vZGlmaWVkUHJpY2VJbnB1dC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRQcmljZUlucHV0LmRlZmF1bHRWYWx1ZSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybScpO1xyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKG1vZGlmaWVkUHJpY2VJbnB1dC52YWx1ZSA9PT0gbW9kaWZpZWRQcmljZUlucHV0LmRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICBtb2RpZmllZFByaWNlSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnNvbGUubG9nKFwiY291Y291IHNlYXJjaHBob25lanNcIik7XHJcblxyXG5sZXQgaW5wdXRQaG9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VyLXNlYXJjaC1waG9uZScpO1xyXG5sZXQgcmVzdWx0c1Bob25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3VsdC1waG9uZScpO1xyXG5cclxuaW5wdXRQaG9uZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgc2VhcmNoQnlQaG9uZSgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNlYXJjaEJ5UGhvbmUoKSB7XHJcbiAgICBsZXQgc2VhcmNoVGVybSA9IGlucHV0UGhvbmUudmFsdWUudHJpbSgpO1xyXG4gICAgaWYgKHNlYXJjaFRlcm0gPT09ICcnKSB7XHJcbiAgICAgICAgcmVzdWx0c1Bob25lLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChgL3NlYXJjaHBob25lLyR7c2VhcmNoVGVybX1gKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdHNQaG9uZS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgdXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IHVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxoMj4ke3VzZXIuZW1haWx9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwicHVyY2hhc2UvdXNlci8ke3VzZXIuaWR9XCI+Vm9pciBkw6l0YWlsIGNsaWVudDwvYT5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzUGhvbmUuYXBwZW5kKGRpdik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc29sZS5sb2coXCJjb3Vjb3VzIHNlYXJjaGpzXCIpO1xyXG5cclxubGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VzZXItc2VhcmNoLWVtYWlsJyk7XHJcbmxldCByZXN1bHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3VsdC1lbWFpbCcpO1xyXG5cclxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgIHNlYXJjaFVzZXIoKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hVc2VyKCkge1xyXG4gICAgbGV0IHNlYXJjaFRlcm0gPSBpbnB1dC52YWx1ZS50cmltKCk7XHJcbiAgICBpZiAoc2VhcmNoVGVybSA9PT0gJycpIHtcclxuICAgICAgICByZXN1bHRzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGZldGNoKGAvc2VhcmNoLyR7c2VhcmNoVGVybX1gKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSB1c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgLy8gICBsZXQgZnVsbE5hbWUgPSB1c2VyLmZ1bGxOYW1lO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGgyPiR7dXNlci5mdWxsTmFtZX08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJwdXJjaGFzZS91c2VyLyR7dXNlci5pZH1cIj5Wb2lyIGTDqXRhaWxzIGNsaWVudDwvYT5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLmFwcGVuZChkaXYpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zb2xlLmxvZyhcImNvdWNvdSBzZWFyY2huYW1lanNcIik7XHJcblxyXG5sZXQgaW5wdXROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VzZXItc2VhcmNoLW5hbWUnKTtcclxubGV0IHJlc3VsdHNOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3VsdC1uYW1lJyk7XHJcblxyXG5pbnB1dE5hbWUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgIHNlYXJjaEJ5TmFtZSgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNlYXJjaEJ5TmFtZSgpIHtcclxuICAgIGxldCBzZWFyY2hUZXJtID0gaW5wdXROYW1lLnZhbHVlLnRyaW0oKTtcclxuICAgIGlmIChzZWFyY2hUZXJtID09PSAnJykge1xyXG4gICAgICAgIHJlc3VsdHNOYW1lLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChgL3NlYXJjaG5hbWUvJHtzZWFyY2hUZXJtfWApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgIC50aGVuKHVzZXJzID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0c05hbWUuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW1haWwgPSB1c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgICAgICAgICA8aDI+JHt1c2VyLmVtYWlsfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInB1cmNoYXNlL3VzZXIvJHt1c2VyLmlkfVwiPlZvaXIgZMOpdGFpbCBjbGllbnQ8L2E+XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0c05hbWUuYXBwZW5kKGRpdik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG59XHJcbiIsIlxyXG4vKlxyXG4gKiBXZWxjb21lIHRvIHlvdXIgYXBwJ3MgbWFpbiBKYXZhU2NyaXB0IGZpbGUhXHJcbiAqXHJcbiAqIFdlIHJlY29tbWVuZCBpbmNsdWRpbmcgdGhlIGJ1aWx0IHZlcnNpb24gb2YgdGhpcyBKYXZhU2NyaXB0IGZpbGVcclxuICogKGFuZCBpdHMgQ1NTIGZpbGUpIGluIHlvdXIgYmFzZSBsYXlvdXQgKGJhc2UuaHRtbC50d2lnKS5cclxuICovXHJcblxyXG4vLyBhbnkgQ1NTIHlvdSBpbXBvcnQgd2lsbCBvdXRwdXQgaW50byBhIHNpbmdsZSBjc3MgZmlsZSAoYXBwLmNzcyBpbiB0aGlzIGNhc2UpXHJcbmltcG9ydCAnLi9zdHlsZXMvYXBwLmNzcyc7XHJcbmltcG9ydCAnLi9zdHlsZXMvc3R5bGUuY3NzJztcclxuaW1wb3J0ICcuL2pzL3NlYXJjaHBob25lLmpzJztcclxuaW1wb3J0ICcuL2pzL3NlYXJjaHVzZXIuanMnO1xyXG5pbXBvcnQgJy4vanMvc2VhcmNodXNlcm5hbWUuanMnO1xyXG5pbXBvcnQgJy4vanMvbWVudS5qcyc7XHJcbmltcG9ydCAnLi9qcy9wcmljZS1pbnB1dC5qcyc7XHJcblxyXG5cclxuXHJcblxyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOlsibXlGdW5jdGlvbiIsIngiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NOYW1lIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb2RpZmllZFByaWNlSW5wdXQiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsImZvcm0iLCJxdWVyeVNlbGVjdG9yIiwicmVxdWlyZSIsImlucHV0UGhvbmUiLCJyZXN1bHRzUGhvbmUiLCJzZWFyY2hCeVBob25lIiwic2VhcmNoVGVybSIsInRyaW0iLCJpbm5lckhUTUwiLCJmZXRjaCIsImNvbmNhdCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJ1c2VycyIsImZvckVhY2giLCJ1c2VyIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsImVtYWlsIiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJhcHBlbmQiLCJpbnB1dCIsInJlc3VsdHMiLCJzZWFyY2hVc2VyIiwiZnVsbE5hbWUiLCJpbnB1dE5hbWUiLCJyZXN1bHRzTmFtZSIsInNlYXJjaEJ5TmFtZSJdLCJzb3VyY2VSb290IjoiIn0=
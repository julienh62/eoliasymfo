"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["actioncable"],{

/***/ "./node_modules/@rails/actioncable/src/adapters.js":
/*!*********************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/adapters.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  logger: self.console,
  WebSocket: self.WebSocket
});


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/connection.js":
/*!***********************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/connection.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _adapters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adapters */ "./node_modules/@rails/actioncable/src/adapters.js");
/* harmony import */ var _connection_monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection_monitor */ "./node_modules/@rails/actioncable/src/connection_monitor.js");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./internal */ "./node_modules/@rails/actioncable/src/internal.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ "./node_modules/@rails/actioncable/src/logger.js");





// Encapsulate the cable connection held by the consumer. This is an internal class not intended for direct user manipulation.

const {message_types, protocols} = _internal__WEBPACK_IMPORTED_MODULE_2__["default"]
const supportedProtocols = protocols.slice(0, protocols.length - 1)

const indexOf = [].indexOf

class Connection {
  constructor(consumer) {
    this.open = this.open.bind(this)
    this.consumer = consumer
    this.subscriptions = this.consumer.subscriptions
    this.monitor = new _connection_monitor__WEBPACK_IMPORTED_MODULE_1__["default"](this)
    this.disconnected = true
  }

  send(data) {
    if (this.isOpen()) {
      this.webSocket.send(JSON.stringify(data))
      return true
    } else {
      return false
    }
  }

  open() {
    if (this.isActive()) {
      _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`)
      return false
    } else {
      const socketProtocols = [...protocols, ...this.consumer.subprotocols || []]
      _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`)
      if (this.webSocket) { this.uninstallEventHandlers() }
      this.webSocket = new _adapters__WEBPACK_IMPORTED_MODULE_0__["default"].WebSocket(this.consumer.url, socketProtocols)
      this.installEventHandlers()
      this.monitor.start()
      return true
    }
  }

  close({allowReconnect} = {allowReconnect: true}) {
    if (!allowReconnect) { this.monitor.stop() }
    // Avoid closing websockets in a "connecting" state due to Safari 15.1+ bug. See: https://github.com/rails/rails/issues/43835#issuecomment-1002288478
    if (this.isOpen()) {
      return this.webSocket.close()
    }
  }

  reopen() {
    _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`Reopening WebSocket, current state is ${this.getState()}`)
    if (this.isActive()) {
      try {
        return this.close()
      } catch (error) {
        _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log("Failed to reopen WebSocket", error)
      }
      finally {
        _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`)
        setTimeout(this.open, this.constructor.reopenDelay)
      }
    } else {
      return this.open()
    }
  }

  getProtocol() {
    if (this.webSocket) {
      return this.webSocket.protocol
    }
  }

  isOpen() {
    return this.isState("open")
  }

  isActive() {
    return this.isState("open", "connecting")
  }

  triedToReconnect() {
    return this.monitor.reconnectAttempts > 0
  }

  // Private

  isProtocolSupported() {
    return indexOf.call(supportedProtocols, this.getProtocol()) >= 0
  }

  isState(...states) {
    return indexOf.call(states, this.getState()) >= 0
  }

  getState() {
    if (this.webSocket) {
      for (let state in _adapters__WEBPACK_IMPORTED_MODULE_0__["default"].WebSocket) {
        if (_adapters__WEBPACK_IMPORTED_MODULE_0__["default"].WebSocket[state] === this.webSocket.readyState) {
          return state.toLowerCase()
        }
      }
    }
    return null
  }

  installEventHandlers() {
    for (let eventName in this.events) {
      const handler = this.events[eventName].bind(this)
      this.webSocket[`on${eventName}`] = handler
    }
  }

  uninstallEventHandlers() {
    for (let eventName in this.events) {
      this.webSocket[`on${eventName}`] = function() {}
    }
  }

}

Connection.reopenDelay = 500

Connection.prototype.events = {
  message(event) {
    if (!this.isProtocolSupported()) { return }
    const {identifier, message, reason, reconnect, type} = JSON.parse(event.data)
    switch (type) {
      case message_types.welcome:
        if (this.triedToReconnect()) {
          this.reconnectAttempted = true
        }
        this.monitor.recordConnect()
        return this.subscriptions.reload()
      case message_types.disconnect:
        _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`Disconnecting. Reason: ${reason}`)
        return this.close({allowReconnect: reconnect})
      case message_types.ping:
        return this.monitor.recordPing()
      case message_types.confirmation:
        this.subscriptions.confirmSubscription(identifier)
        if (this.reconnectAttempted) {
          this.reconnectAttempted = false
          return this.subscriptions.notify(identifier, "connected", {reconnected: true})
        } else {
          return this.subscriptions.notify(identifier, "connected", {reconnected: false})
        }
      case message_types.rejection:
        return this.subscriptions.reject(identifier)
      default:
        return this.subscriptions.notify(identifier, "received", message)
    }
  },

  open() {
    _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`)
    this.disconnected = false
    if (!this.isProtocolSupported()) {
      _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log("Protocol is unsupported. Stopping monitor and disconnecting.")
      return this.close({allowReconnect: false})
    }
  },

  close(event) {
    _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log("WebSocket onclose event")
    if (this.disconnected) { return }
    this.disconnected = true
    this.monitor.recordDisconnect()
    return this.subscriptions.notifyAll("disconnected", {willAttemptReconnect: this.monitor.isRunning()})
  },

  error() {
    _logger__WEBPACK_IMPORTED_MODULE_3__["default"].log("WebSocket onerror event")
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Connection);


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/connection_monitor.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/connection_monitor.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./node_modules/@rails/actioncable/src/logger.js");


// Responsible for ensuring the cable connection is in good health by validating the heartbeat pings sent from the server, and attempting
// revival reconnections if things go astray. Internal class, not intended for direct user manipulation.

const now = () => new Date().getTime()

const secondsSince = time => (now() - time) / 1000

class ConnectionMonitor {
  constructor(connection) {
    this.visibilityDidChange = this.visibilityDidChange.bind(this)
    this.connection = connection
    this.reconnectAttempts = 0
  }

  start() {
    if (!this.isRunning()) {
      this.startedAt = now()
      delete this.stoppedAt
      this.startPolling()
      addEventListener("visibilitychange", this.visibilityDidChange)
      _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`)
    }
  }

  stop() {
    if (this.isRunning()) {
      this.stoppedAt = now()
      this.stopPolling()
      removeEventListener("visibilitychange", this.visibilityDidChange)
      _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log("ConnectionMonitor stopped")
    }
  }

  isRunning() {
    return this.startedAt && !this.stoppedAt
  }

  recordPing() {
    this.pingedAt = now()
  }

  recordConnect() {
    this.reconnectAttempts = 0
    this.recordPing()
    delete this.disconnectedAt
    _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log("ConnectionMonitor recorded connect")
  }

  recordDisconnect() {
    this.disconnectedAt = now()
    _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log("ConnectionMonitor recorded disconnect")
  }

  // Private

  startPolling() {
    this.stopPolling()
    this.poll()
  }

  stopPolling() {
    clearTimeout(this.pollTimeout)
  }

  poll() {
    this.pollTimeout = setTimeout(() => {
      this.reconnectIfStale()
      this.poll()
    }
    , this.getPollInterval())
  }

  getPollInterval() {
    const { staleThreshold, reconnectionBackoffRate } = this.constructor
    const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10))
    const jitterMax = this.reconnectAttempts === 0 ? 1.0 : reconnectionBackoffRate
    const jitter = jitterMax * Math.random()
    return staleThreshold * 1000 * backoff * (1 + jitter)
  }

  reconnectIfStale() {
    if (this.connectionIsStale()) {
      _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`)
      this.reconnectAttempts++
      if (this.disconnectedRecently()) {
        _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`)
      } else {
        _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log("ConnectionMonitor reopening")
        this.connection.reopen()
      }
    }
  }

  get refreshedAt() {
    return this.pingedAt ? this.pingedAt : this.startedAt
  }

  connectionIsStale() {
    return secondsSince(this.refreshedAt) > this.constructor.staleThreshold
  }

  disconnectedRecently() {
    return this.disconnectedAt && (secondsSince(this.disconnectedAt) < this.constructor.staleThreshold)
  }

  visibilityDidChange() {
    if (document.visibilityState === "visible") {
      setTimeout(() => {
        if (this.connectionIsStale() || !this.connection.isOpen()) {
          _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`)
          this.connection.reopen()
        }
      }
      , 200)
    }
  }

}

ConnectionMonitor.staleThreshold = 6 // Server::Connections::BEAT_INTERVAL * 2 (missed two pings)
ConnectionMonitor.reconnectionBackoffRate = 0.15

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConnectionMonitor);


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/consumer.js":
/*!*********************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/consumer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWebSocketURL: () => (/* binding */ createWebSocketURL),
/* harmony export */   "default": () => (/* binding */ Consumer)
/* harmony export */ });
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connection */ "./node_modules/@rails/actioncable/src/connection.js");
/* harmony import */ var _subscriptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptions */ "./node_modules/@rails/actioncable/src/subscriptions.js");



// The ActionCable.Consumer establishes the connection to a server-side Ruby Connection object. Once established,
// the ActionCable.ConnectionMonitor will ensure that its properly maintained through heartbeats and checking for stale updates.
// The Consumer instance is also the gateway to establishing subscriptions to desired channels through the #createSubscription
// method.
//
// The following example shows how this can be set up:
//
//   App = {}
//   App.cable = ActionCable.createConsumer("ws://example.com/accounts/1")
//   App.appearance = App.cable.subscriptions.create("AppearanceChannel")
//
// For more details on how you'd configure an actual channel subscription, see ActionCable.Subscription.
//
// When a consumer is created, it automatically connects with the server.
//
// To disconnect from the server, call
//
//   App.cable.disconnect()
//
// and to restart the connection:
//
//   App.cable.connect()
//
// Any channel subscriptions which existed prior to disconnecting will
// automatically resubscribe.

class Consumer {
  constructor(url) {
    this._url = url
    this.subscriptions = new _subscriptions__WEBPACK_IMPORTED_MODULE_1__["default"](this)
    this.connection = new _connection__WEBPACK_IMPORTED_MODULE_0__["default"](this)
    this.subprotocols = []
  }

  get url() {
    return createWebSocketURL(this._url)
  }

  send(data) {
    return this.connection.send(data)
  }

  connect() {
    return this.connection.open()
  }

  disconnect() {
    return this.connection.close({allowReconnect: false})
  }

  ensureActiveConnection() {
    if (!this.connection.isActive()) {
      return this.connection.open()
    }
  }

  addSubProtocol(subprotocol) {
    this.subprotocols = [...this.subprotocols, subprotocol]
  }
}

function createWebSocketURL(url) {
  if (typeof url === "function") {
    url = url()
  }

  if (url && !/^wss?:/i.test(url)) {
    const a = document.createElement("a")
    a.href = url
    // Fix populating Location properties in IE. Otherwise, protocol will be blank.
    a.href = a.href
    a.protocol = a.protocol.replace("http", "ws")
    return a.href
  } else {
    return url
  }
}


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Connection: () => (/* reexport safe */ _connection__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ConnectionMonitor: () => (/* reexport safe */ _connection_monitor__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   Consumer: () => (/* reexport safe */ _consumer__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   INTERNAL: () => (/* reexport safe */ _internal__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Subscription: () => (/* reexport safe */ _subscription__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   SubscriptionGuarantor: () => (/* reexport safe */ _subscription_guarantor__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   Subscriptions: () => (/* reexport safe */ _subscriptions__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   adapters: () => (/* reexport safe */ _adapters__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   createConsumer: () => (/* binding */ createConsumer),
/* harmony export */   createWebSocketURL: () => (/* reexport safe */ _consumer__WEBPACK_IMPORTED_MODULE_2__.createWebSocketURL),
/* harmony export */   getConfig: () => (/* binding */ getConfig),
/* harmony export */   logger: () => (/* reexport safe */ _logger__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connection */ "./node_modules/@rails/actioncable/src/connection.js");
/* harmony import */ var _connection_monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection_monitor */ "./node_modules/@rails/actioncable/src/connection_monitor.js");
/* harmony import */ var _consumer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consumer */ "./node_modules/@rails/actioncable/src/consumer.js");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./internal */ "./node_modules/@rails/actioncable/src/internal.js");
/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./subscription */ "./node_modules/@rails/actioncable/src/subscription.js");
/* harmony import */ var _subscriptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subscriptions */ "./node_modules/@rails/actioncable/src/subscriptions.js");
/* harmony import */ var _subscription_guarantor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./subscription_guarantor */ "./node_modules/@rails/actioncable/src/subscription_guarantor.js");
/* harmony import */ var _adapters__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./adapters */ "./node_modules/@rails/actioncable/src/adapters.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./logger */ "./node_modules/@rails/actioncable/src/logger.js");












function createConsumer(url = getConfig("url") || _internal__WEBPACK_IMPORTED_MODULE_3__["default"].default_mount_path) {
  return new _consumer__WEBPACK_IMPORTED_MODULE_2__["default"](url)
}

function getConfig(name) {
  const element = document.head.querySelector(`meta[name='action-cable-${name}']`)
  if (element) {
    return element.getAttribute("content")
  }
}


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/internal.js":
/*!*********************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/internal.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "message_types": {
    "welcome": "welcome",
    "disconnect": "disconnect",
    "ping": "ping",
    "confirmation": "confirm_subscription",
    "rejection": "reject_subscription"
  },
  "disconnect_reasons": {
    "unauthorized": "unauthorized",
    "invalid_request": "invalid_request",
    "server_restart": "server_restart",
    "remote": "remote"
  },
  "default_mount_path": "/cable",
  "protocols": [
    "actioncable-v1-json",
    "actioncable-unsupported"
  ]
});


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/logger.js":
/*!*******************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/logger.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _adapters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adapters */ "./node_modules/@rails/actioncable/src/adapters.js");


// The logger is disabled by default. You can enable it with:
//
//   ActionCable.logger.enabled = true
//
//   Example:
//
//   import * as ActionCable from '@rails/actioncable'
//
//   ActionCable.logger.enabled = true
//   ActionCable.logger.log('Connection Established.')
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  log(...messages) {
    if (this.enabled) {
      messages.push(Date.now())
      _adapters__WEBPACK_IMPORTED_MODULE_0__["default"].logger.log("[ActionCable]", ...messages)
    }
  },
});


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/subscription.js":
/*!*************************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/subscription.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Subscription)
/* harmony export */ });
// A new subscription is created through the ActionCable.Subscriptions instance available on the consumer.
// It provides a number of callbacks and a method for calling remote procedure calls on the corresponding
// Channel instance on the server side.
//
// An example demonstrates the basic functionality:
//
//   App.appearance = App.cable.subscriptions.create("AppearanceChannel", {
//     connected() {
//       // Called once the subscription has been successfully completed
//     },
//
//     disconnected({ willAttemptReconnect: boolean }) {
//       // Called when the client has disconnected with the server.
//       // The object will have an `willAttemptReconnect` property which
//       // says whether the client has the intention of attempting
//       // to reconnect.
//     },
//
//     appear() {
//       this.perform('appear', {appearing_on: this.appearingOn()})
//     },
//
//     away() {
//       this.perform('away')
//     },
//
//     appearingOn() {
//       $('main').data('appearing-on')
//     }
//   })
//
// The methods #appear and #away forward their intent to the remote AppearanceChannel instance on the server
// by calling the `perform` method with the first parameter being the action (which maps to AppearanceChannel#appear/away).
// The second parameter is a hash that'll get JSON encoded and made available on the server in the data parameter.
//
// This is how the server component would look:
//
//   class AppearanceChannel < ApplicationActionCable::Channel
//     def subscribed
//       current_user.appear
//     end
//
//     def unsubscribed
//       current_user.disappear
//     end
//
//     def appear(data)
//       current_user.appear on: data['appearing_on']
//     end
//
//     def away
//       current_user.away
//     end
//   end
//
// The "AppearanceChannel" name is automatically mapped between the client-side subscription creation and the server-side Ruby class name.
// The AppearanceChannel#appear/away public methods are exposed automatically to client-side invocation through the perform method.

const extend = function(object, properties) {
  if (properties != null) {
    for (let key in properties) {
      const value = properties[key]
      object[key] = value
    }
  }
  return object
}

class Subscription {
  constructor(consumer, params = {}, mixin) {
    this.consumer = consumer
    this.identifier = JSON.stringify(params)
    extend(this, mixin)
  }

  // Perform a channel action with the optional data passed as an attribute
  perform(action, data = {}) {
    data.action = action
    return this.send(data)
  }

  send(data) {
    return this.consumer.send({command: "message", identifier: this.identifier, data: JSON.stringify(data)})
  }

  unsubscribe() {
    return this.consumer.subscriptions.remove(this)
  }
}


/***/ }),

/***/ "./node_modules/@rails/actioncable/src/subscription_guarantor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/subscription_guarantor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./node_modules/@rails/actioncable/src/logger.js");


// Responsible for ensuring channel subscribe command is confirmed, retrying until confirmation is received.
// Internal class, not intended for direct user manipulation.

class SubscriptionGuarantor {
  constructor(subscriptions) {
    this.subscriptions = subscriptions
    this.pendingSubscriptions = []
  }

  guarantee(subscription) {
    if(this.pendingSubscriptions.indexOf(subscription) == -1){ 
      _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`)
      this.pendingSubscriptions.push(subscription) 
    }
    else {
      _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`)
    }
    this.startGuaranteeing()
  }

  forget(subscription) {
    _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`SubscriptionGuarantor forgetting ${subscription.identifier}`)
    this.pendingSubscriptions = (this.pendingSubscriptions.filter((s) => s !== subscription))
  }

  startGuaranteeing() {
    this.stopGuaranteeing()
    this.retrySubscribing()
  }
  
  stopGuaranteeing() {
    clearTimeout(this.retryTimeout)
  }

  retrySubscribing() {
    this.retryTimeout = setTimeout(() => {
      if (this.subscriptions && typeof(this.subscriptions.subscribe) === "function") {
        this.pendingSubscriptions.map((subscription) => {
          _logger__WEBPACK_IMPORTED_MODULE_0__["default"].log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`)
          this.subscriptions.subscribe(subscription)
        })
      }
    }
    , 500)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SubscriptionGuarantor);

/***/ }),

/***/ "./node_modules/@rails/actioncable/src/subscriptions.js":
/*!**************************************************************!*\
  !*** ./node_modules/@rails/actioncable/src/subscriptions.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Subscriptions)
/* harmony export */ });
/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscription */ "./node_modules/@rails/actioncable/src/subscription.js");
/* harmony import */ var _subscription_guarantor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscription_guarantor */ "./node_modules/@rails/actioncable/src/subscription_guarantor.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "./node_modules/@rails/actioncable/src/logger.js");




// Collection class for creating (and internally managing) channel subscriptions.
// The only method intended to be triggered by the user is ActionCable.Subscriptions#create,
// and it should be called through the consumer like so:
//
//   App = {}
//   App.cable = ActionCable.createConsumer("ws://example.com/accounts/1")
//   App.appearance = App.cable.subscriptions.create("AppearanceChannel")
//
// For more details on how you'd configure an actual channel subscription, see ActionCable.Subscription.

class Subscriptions {
  constructor(consumer) {
    this.consumer = consumer
    this.guarantor = new _subscription_guarantor__WEBPACK_IMPORTED_MODULE_1__["default"](this)
    this.subscriptions = []
  }

  create(channelName, mixin) {
    const channel = channelName
    const params = typeof channel === "object" ? channel : {channel}
    const subscription = new _subscription__WEBPACK_IMPORTED_MODULE_0__["default"](this.consumer, params, mixin)
    return this.add(subscription)
  }

  // Private

  add(subscription) {
    this.subscriptions.push(subscription)
    this.consumer.ensureActiveConnection()
    this.notify(subscription, "initialized")
    this.subscribe(subscription)
    return subscription
  }

  remove(subscription) {
    this.forget(subscription)
    if (!this.findAll(subscription.identifier).length) {
      this.sendCommand(subscription, "unsubscribe")
    }
    return subscription
  }

  reject(identifier) {
    return this.findAll(identifier).map((subscription) => {
      this.forget(subscription)
      this.notify(subscription, "rejected")
      return subscription
    })
  }

  forget(subscription) {
    this.guarantor.forget(subscription)
    this.subscriptions = (this.subscriptions.filter((s) => s !== subscription))
    return subscription
  }

  findAll(identifier) {
    return this.subscriptions.filter((s) => s.identifier === identifier)
  }

  reload() {
    return this.subscriptions.map((subscription) =>
      this.subscribe(subscription))
  }

  notifyAll(callbackName, ...args) {
    return this.subscriptions.map((subscription) =>
      this.notify(subscription, callbackName, ...args))
  }

  notify(subscription, callbackName, ...args) {
    let subscriptions
    if (typeof subscription === "string") {
      subscriptions = this.findAll(subscription)
    } else {
      subscriptions = [subscription]
    }

    return subscriptions.map((subscription) =>
      (typeof subscription[callbackName] === "function" ? subscription[callbackName](...args) : undefined))
  }

  subscribe(subscription) {
    if (this.sendCommand(subscription, "subscribe")) {
      this.guarantor.guarantee(subscription)
    }
  }

  confirmSubscription(identifier) {
    _logger__WEBPACK_IMPORTED_MODULE_2__["default"].log(`Subscription confirmed ${identifier}`)
    this.findAll(identifier).map((subscription) =>
      this.guarantor.forget(subscription))
  }

  sendCommand(subscription, command) {
    const {identifier} = subscription
    return this.consumer.send({command, identifier})
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QStCLG9CQUFvQjtBQUNuRDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvYWRhcHRlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvY29ubmVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHJhaWxzL2FjdGlvbmNhYmxlL3NyYy9jb25uZWN0aW9uX21vbml0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvY29uc3VtZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0ByYWlscy9hY3Rpb25jYWJsZS9zcmMvbG9nZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AcmFpbHMvYWN0aW9uY2FibGUvc3JjL3N1YnNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHJhaWxzL2FjdGlvbmNhYmxlL3NyYy9zdWJzY3JpcHRpb25fZ3VhcmFudG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AcmFpbHMvYWN0aW9uY2FibGUvc3JjL3N1YnNjcmlwdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dnZXI6IHNlbGYuY29uc29sZSxcbiAgV2ViU29ja2V0OiBzZWxmLldlYlNvY2tldFxufVxuIiwiaW1wb3J0IGFkYXB0ZXJzIGZyb20gXCIuL2FkYXB0ZXJzXCJcbmltcG9ydCBDb25uZWN0aW9uTW9uaXRvciBmcm9tIFwiLi9jb25uZWN0aW9uX21vbml0b3JcIlxuaW1wb3J0IElOVEVSTkFMIGZyb20gXCIuL2ludGVybmFsXCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcblxuLy8gRW5jYXBzdWxhdGUgdGhlIGNhYmxlIGNvbm5lY3Rpb24gaGVsZCBieSB0aGUgY29uc3VtZXIuIFRoaXMgaXMgYW4gaW50ZXJuYWwgY2xhc3Mgbm90IGludGVuZGVkIGZvciBkaXJlY3QgdXNlciBtYW5pcHVsYXRpb24uXG5cbmNvbnN0IHttZXNzYWdlX3R5cGVzLCBwcm90b2NvbHN9ID0gSU5URVJOQUxcbmNvbnN0IHN1cHBvcnRlZFByb3RvY29scyA9IHByb3RvY29scy5zbGljZSgwLCBwcm90b2NvbHMubGVuZ3RoIC0gMSlcblxuY29uc3QgaW5kZXhPZiA9IFtdLmluZGV4T2ZcblxuY2xhc3MgQ29ubmVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGNvbnN1bWVyKSB7XG4gICAgdGhpcy5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcylcbiAgICB0aGlzLmNvbnN1bWVyID0gY29uc3VtZXJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB0aGlzLmNvbnN1bWVyLnN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLm1vbml0b3IgPSBuZXcgQ29ubmVjdGlvbk1vbml0b3IodGhpcylcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZCA9IHRydWVcbiAgfVxuXG4gIHNlbmQoZGF0YSkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLndlYlNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb3BlbigpIHtcbiAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICBsb2dnZXIubG9nKGBBdHRlbXB0ZWQgdG8gb3BlbiBXZWJTb2NrZXQsIGJ1dCBleGlzdGluZyBzb2NrZXQgaXMgJHt0aGlzLmdldFN0YXRlKCl9YClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzb2NrZXRQcm90b2NvbHMgPSBbLi4ucHJvdG9jb2xzLCAuLi50aGlzLmNvbnN1bWVyLnN1YnByb3RvY29scyB8fCBbXV1cbiAgICAgIGxvZ2dlci5sb2coYE9wZW5pbmcgV2ViU29ja2V0LCBjdXJyZW50IHN0YXRlIGlzICR7dGhpcy5nZXRTdGF0ZSgpfSwgc3VicHJvdG9jb2xzOiAke3NvY2tldFByb3RvY29sc31gKVxuICAgICAgaWYgKHRoaXMud2ViU29ja2V0KSB7IHRoaXMudW5pbnN0YWxsRXZlbnRIYW5kbGVycygpIH1cbiAgICAgIHRoaXMud2ViU29ja2V0ID0gbmV3IGFkYXB0ZXJzLldlYlNvY2tldCh0aGlzLmNvbnN1bWVyLnVybCwgc29ja2V0UHJvdG9jb2xzKVxuICAgICAgdGhpcy5pbnN0YWxsRXZlbnRIYW5kbGVycygpXG4gICAgICB0aGlzLm1vbml0b3Iuc3RhcnQoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBjbG9zZSh7YWxsb3dSZWNvbm5lY3R9ID0ge2FsbG93UmVjb25uZWN0OiB0cnVlfSkge1xuICAgIGlmICghYWxsb3dSZWNvbm5lY3QpIHsgdGhpcy5tb25pdG9yLnN0b3AoKSB9XG4gICAgLy8gQXZvaWQgY2xvc2luZyB3ZWJzb2NrZXRzIGluIGEgXCJjb25uZWN0aW5nXCIgc3RhdGUgZHVlIHRvIFNhZmFyaSAxNS4xKyBidWcuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL3JhaWxzL3JhaWxzL2lzc3Vlcy80MzgzNSNpc3N1ZWNvbW1lbnQtMTAwMjI4ODQ3OFxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy53ZWJTb2NrZXQuY2xvc2UoKVxuICAgIH1cbiAgfVxuXG4gIHJlb3BlbigpIHtcbiAgICBsb2dnZXIubG9nKGBSZW9wZW5pbmcgV2ViU29ja2V0LCBjdXJyZW50IHN0YXRlIGlzICR7dGhpcy5nZXRTdGF0ZSgpfWApXG4gICAgaWYgKHRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIkZhaWxlZCB0byByZW9wZW4gV2ViU29ja2V0XCIsIGVycm9yKVxuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIGxvZ2dlci5sb2coYFJlb3BlbmluZyBXZWJTb2NrZXQgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLnJlb3BlbkRlbGF5fW1zYClcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLm9wZW4sIHRoaXMuY29uc3RydWN0b3IucmVvcGVuRGVsYXkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4oKVxuICAgIH1cbiAgfVxuXG4gIGdldFByb3RvY29sKCkge1xuICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgcmV0dXJuIHRoaXMud2ViU29ja2V0LnByb3RvY29sXG4gICAgfVxuICB9XG5cbiAgaXNPcGVuKCkge1xuICAgIHJldHVybiB0aGlzLmlzU3RhdGUoXCJvcGVuXCIpXG4gIH1cblxuICBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1N0YXRlKFwib3BlblwiLCBcImNvbm5lY3RpbmdcIilcbiAgfVxuXG4gIHRyaWVkVG9SZWNvbm5lY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9uaXRvci5yZWNvbm5lY3RBdHRlbXB0cyA+IDBcbiAgfVxuXG4gIC8vIFByaXZhdGVcblxuICBpc1Byb3RvY29sU3VwcG9ydGVkKCkge1xuICAgIHJldHVybiBpbmRleE9mLmNhbGwoc3VwcG9ydGVkUHJvdG9jb2xzLCB0aGlzLmdldFByb3RvY29sKCkpID49IDBcbiAgfVxuXG4gIGlzU3RhdGUoLi4uc3RhdGVzKSB7XG4gICAgcmV0dXJuIGluZGV4T2YuY2FsbChzdGF0ZXMsIHRoaXMuZ2V0U3RhdGUoKSkgPj0gMFxuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgaWYgKHRoaXMud2ViU29ja2V0KSB7XG4gICAgICBmb3IgKGxldCBzdGF0ZSBpbiBhZGFwdGVycy5XZWJTb2NrZXQpIHtcbiAgICAgICAgaWYgKGFkYXB0ZXJzLldlYlNvY2tldFtzdGF0ZV0gPT09IHRoaXMud2ViU29ja2V0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUudG9Mb3dlckNhc2UoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBpbnN0YWxsRXZlbnRIYW5kbGVycygpIHtcbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmJpbmQodGhpcylcbiAgICAgIHRoaXMud2ViU29ja2V0W2BvbiR7ZXZlbnROYW1lfWBdID0gaGFuZGxlclxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbEV2ZW50SGFuZGxlcnMoKSB7XG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICB0aGlzLndlYlNvY2tldFtgb24ke2V2ZW50TmFtZX1gXSA9IGZ1bmN0aW9uKCkge31cbiAgICB9XG4gIH1cblxufVxuXG5Db25uZWN0aW9uLnJlb3BlbkRlbGF5ID0gNTAwXG5cbkNvbm5lY3Rpb24ucHJvdG90eXBlLmV2ZW50cyA9IHtcbiAgbWVzc2FnZShldmVudCkge1xuICAgIGlmICghdGhpcy5pc1Byb3RvY29sU3VwcG9ydGVkKCkpIHsgcmV0dXJuIH1cbiAgICBjb25zdCB7aWRlbnRpZmllciwgbWVzc2FnZSwgcmVhc29uLCByZWNvbm5lY3QsIHR5cGV9ID0gSlNPTi5wYXJzZShldmVudC5kYXRhKVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBtZXNzYWdlX3R5cGVzLndlbGNvbWU6XG4gICAgICAgIGlmICh0aGlzLnRyaWVkVG9SZWNvbm5lY3QoKSkge1xuICAgICAgICAgIHRoaXMucmVjb25uZWN0QXR0ZW1wdGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9uaXRvci5yZWNvcmRDb25uZWN0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucy5yZWxvYWQoKVxuICAgICAgY2FzZSBtZXNzYWdlX3R5cGVzLmRpc2Nvbm5lY3Q6XG4gICAgICAgIGxvZ2dlci5sb2coYERpc2Nvbm5lY3RpbmcuIFJlYXNvbjogJHtyZWFzb259YClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2Uoe2FsbG93UmVjb25uZWN0OiByZWNvbm5lY3R9KVxuICAgICAgY2FzZSBtZXNzYWdlX3R5cGVzLnBpbmc6XG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IucmVjb3JkUGluZygpXG4gICAgICBjYXNlIG1lc3NhZ2VfdHlwZXMuY29uZmlybWF0aW9uOlxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuY29uZmlybVN1YnNjcmlwdGlvbihpZGVudGlmaWVyKVxuICAgICAgICBpZiAodGhpcy5yZWNvbm5lY3RBdHRlbXB0ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlY29ubmVjdEF0dGVtcHRlZCA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucy5ub3RpZnkoaWRlbnRpZmllciwgXCJjb25uZWN0ZWRcIiwge3JlY29ubmVjdGVkOiB0cnVlfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLm5vdGlmeShpZGVudGlmaWVyLCBcImNvbm5lY3RlZFwiLCB7cmVjb25uZWN0ZWQ6IGZhbHNlfSlcbiAgICAgICAgfVxuICAgICAgY2FzZSBtZXNzYWdlX3R5cGVzLnJlamVjdGlvbjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucy5yZWplY3QoaWRlbnRpZmllcilcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubm90aWZ5KGlkZW50aWZpZXIsIFwicmVjZWl2ZWRcIiwgbWVzc2FnZSlcbiAgICB9XG4gIH0sXG5cbiAgb3BlbigpIHtcbiAgICBsb2dnZXIubG9nKGBXZWJTb2NrZXQgb25vcGVuIGV2ZW50LCB1c2luZyAnJHt0aGlzLmdldFByb3RvY29sKCl9JyBzdWJwcm90b2NvbGApXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgIGlmICghdGhpcy5pc1Byb3RvY29sU3VwcG9ydGVkKCkpIHtcbiAgICAgIGxvZ2dlci5sb2coXCJQcm90b2NvbCBpcyB1bnN1cHBvcnRlZC4gU3RvcHBpbmcgbW9uaXRvciBhbmQgZGlzY29ubmVjdGluZy5cIilcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlKHthbGxvd1JlY29ubmVjdDogZmFsc2V9KVxuICAgIH1cbiAgfSxcblxuICBjbG9zZShldmVudCkge1xuICAgIGxvZ2dlci5sb2coXCJXZWJTb2NrZXQgb25jbG9zZSBldmVudFwiKVxuICAgIGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkgeyByZXR1cm4gfVxuICAgIHRoaXMuZGlzY29ubmVjdGVkID0gdHJ1ZVxuICAgIHRoaXMubW9uaXRvci5yZWNvcmREaXNjb25uZWN0KClcbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLm5vdGlmeUFsbChcImRpc2Nvbm5lY3RlZFwiLCB7d2lsbEF0dGVtcHRSZWNvbm5lY3Q6IHRoaXMubW9uaXRvci5pc1J1bm5pbmcoKX0pXG4gIH0sXG5cbiAgZXJyb3IoKSB7XG4gICAgbG9nZ2VyLmxvZyhcIldlYlNvY2tldCBvbmVycm9yIGV2ZW50XCIpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdGlvblxuIiwiaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIlxuXG4vLyBSZXNwb25zaWJsZSBmb3IgZW5zdXJpbmcgdGhlIGNhYmxlIGNvbm5lY3Rpb24gaXMgaW4gZ29vZCBoZWFsdGggYnkgdmFsaWRhdGluZyB0aGUgaGVhcnRiZWF0IHBpbmdzIHNlbnQgZnJvbSB0aGUgc2VydmVyLCBhbmQgYXR0ZW1wdGluZ1xuLy8gcmV2aXZhbCByZWNvbm5lY3Rpb25zIGlmIHRoaW5ncyBnbyBhc3RyYXkuIEludGVybmFsIGNsYXNzLCBub3QgaW50ZW5kZWQgZm9yIGRpcmVjdCB1c2VyIG1hbmlwdWxhdGlvbi5cblxuY29uc3Qgbm93ID0gKCkgPT4gbmV3IERhdGUoKS5nZXRUaW1lKClcblxuY29uc3Qgc2Vjb25kc1NpbmNlID0gdGltZSA9PiAobm93KCkgLSB0aW1lKSAvIDEwMDBcblxuY2xhc3MgQ29ubmVjdGlvbk1vbml0b3Ige1xuICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uKSB7XG4gICAgdGhpcy52aXNpYmlsaXR5RGlkQ2hhbmdlID0gdGhpcy52aXNpYmlsaXR5RGlkQ2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uXG4gICAgdGhpcy5yZWNvbm5lY3RBdHRlbXB0cyA9IDBcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgdGhpcy5zdGFydGVkQXQgPSBub3coKVxuICAgICAgZGVsZXRlIHRoaXMuc3RvcHBlZEF0XG4gICAgICB0aGlzLnN0YXJ0UG9sbGluZygpXG4gICAgICBhZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCB0aGlzLnZpc2liaWxpdHlEaWRDaGFuZ2UpXG4gICAgICBsb2dnZXIubG9nKGBDb25uZWN0aW9uTW9uaXRvciBzdGFydGVkLiBzdGFsZSB0aHJlc2hvbGQgPSAke3RoaXMuY29uc3RydWN0b3Iuc3RhbGVUaHJlc2hvbGR9IHNgKVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHRoaXMuc3RvcHBlZEF0ID0gbm93KClcbiAgICAgIHRoaXMuc3RvcFBvbGxpbmcoKVxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgdGhpcy52aXNpYmlsaXR5RGlkQ2hhbmdlKVxuICAgICAgbG9nZ2VyLmxvZyhcIkNvbm5lY3Rpb25Nb25pdG9yIHN0b3BwZWRcIilcbiAgICB9XG4gIH1cblxuICBpc1J1bm5pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRlZEF0ICYmICF0aGlzLnN0b3BwZWRBdFxuICB9XG5cbiAgcmVjb3JkUGluZygpIHtcbiAgICB0aGlzLnBpbmdlZEF0ID0gbm93KClcbiAgfVxuXG4gIHJlY29yZENvbm5lY3QoKSB7XG4gICAgdGhpcy5yZWNvbm5lY3RBdHRlbXB0cyA9IDBcbiAgICB0aGlzLnJlY29yZFBpbmcoKVxuICAgIGRlbGV0ZSB0aGlzLmRpc2Nvbm5lY3RlZEF0XG4gICAgbG9nZ2VyLmxvZyhcIkNvbm5lY3Rpb25Nb25pdG9yIHJlY29yZGVkIGNvbm5lY3RcIilcbiAgfVxuXG4gIHJlY29yZERpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5kaXNjb25uZWN0ZWRBdCA9IG5vdygpXG4gICAgbG9nZ2VyLmxvZyhcIkNvbm5lY3Rpb25Nb25pdG9yIHJlY29yZGVkIGRpc2Nvbm5lY3RcIilcbiAgfVxuXG4gIC8vIFByaXZhdGVcblxuICBzdGFydFBvbGxpbmcoKSB7XG4gICAgdGhpcy5zdG9wUG9sbGluZygpXG4gICAgdGhpcy5wb2xsKClcbiAgfVxuXG4gIHN0b3BQb2xsaW5nKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnBvbGxUaW1lb3V0KVxuICB9XG5cbiAgcG9sbCgpIHtcbiAgICB0aGlzLnBvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnJlY29ubmVjdElmU3RhbGUoKVxuICAgICAgdGhpcy5wb2xsKClcbiAgICB9XG4gICAgLCB0aGlzLmdldFBvbGxJbnRlcnZhbCgpKVxuICB9XG5cbiAgZ2V0UG9sbEludGVydmFsKCkge1xuICAgIGNvbnN0IHsgc3RhbGVUaHJlc2hvbGQsIHJlY29ubmVjdGlvbkJhY2tvZmZSYXRlIH0gPSB0aGlzLmNvbnN0cnVjdG9yXG4gICAgY29uc3QgYmFja29mZiA9IE1hdGgucG93KDEgKyByZWNvbm5lY3Rpb25CYWNrb2ZmUmF0ZSwgTWF0aC5taW4odGhpcy5yZWNvbm5lY3RBdHRlbXB0cywgMTApKVxuICAgIGNvbnN0IGppdHRlck1heCA9IHRoaXMucmVjb25uZWN0QXR0ZW1wdHMgPT09IDAgPyAxLjAgOiByZWNvbm5lY3Rpb25CYWNrb2ZmUmF0ZVxuICAgIGNvbnN0IGppdHRlciA9IGppdHRlck1heCAqIE1hdGgucmFuZG9tKClcbiAgICByZXR1cm4gc3RhbGVUaHJlc2hvbGQgKiAxMDAwICogYmFja29mZiAqICgxICsgaml0dGVyKVxuICB9XG5cbiAgcmVjb25uZWN0SWZTdGFsZSgpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uSXNTdGFsZSgpKSB7XG4gICAgICBsb2dnZXIubG9nKGBDb25uZWN0aW9uTW9uaXRvciBkZXRlY3RlZCBzdGFsZSBjb25uZWN0aW9uLiByZWNvbm5lY3RBdHRlbXB0cyA9ICR7dGhpcy5yZWNvbm5lY3RBdHRlbXB0c30sIHRpbWUgc3RhbGUgPSAke3NlY29uZHNTaW5jZSh0aGlzLnJlZnJlc2hlZEF0KX0gcywgc3RhbGUgdGhyZXNob2xkID0gJHt0aGlzLmNvbnN0cnVjdG9yLnN0YWxlVGhyZXNob2xkfSBzYClcbiAgICAgIHRoaXMucmVjb25uZWN0QXR0ZW1wdHMrK1xuICAgICAgaWYgKHRoaXMuZGlzY29ubmVjdGVkUmVjZW50bHkoKSkge1xuICAgICAgICBsb2dnZXIubG9nKGBDb25uZWN0aW9uTW9uaXRvciBza2lwcGluZyByZW9wZW5pbmcgcmVjZW50IGRpc2Nvbm5lY3QuIHRpbWUgZGlzY29ubmVjdGVkID0gJHtzZWNvbmRzU2luY2UodGhpcy5kaXNjb25uZWN0ZWRBdCl9IHNgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VyLmxvZyhcIkNvbm5lY3Rpb25Nb25pdG9yIHJlb3BlbmluZ1wiKVxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ucmVvcGVuKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgcmVmcmVzaGVkQXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGluZ2VkQXQgPyB0aGlzLnBpbmdlZEF0IDogdGhpcy5zdGFydGVkQXRcbiAgfVxuXG4gIGNvbm5lY3Rpb25Jc1N0YWxlKCkge1xuICAgIHJldHVybiBzZWNvbmRzU2luY2UodGhpcy5yZWZyZXNoZWRBdCkgPiB0aGlzLmNvbnN0cnVjdG9yLnN0YWxlVGhyZXNob2xkXG4gIH1cblxuICBkaXNjb25uZWN0ZWRSZWNlbnRseSgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjb25uZWN0ZWRBdCAmJiAoc2Vjb25kc1NpbmNlKHRoaXMuZGlzY29ubmVjdGVkQXQpIDwgdGhpcy5jb25zdHJ1Y3Rvci5zdGFsZVRocmVzaG9sZClcbiAgfVxuXG4gIHZpc2liaWxpdHlEaWRDaGFuZ2UoKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uSXNTdGFsZSgpIHx8ICF0aGlzLmNvbm5lY3Rpb24uaXNPcGVuKCkpIHtcbiAgICAgICAgICBsb2dnZXIubG9nKGBDb25uZWN0aW9uTW9uaXRvciByZW9wZW5pbmcgc3RhbGUgY29ubmVjdGlvbiBvbiB2aXNpYmlsaXR5Y2hhbmdlLiB2aXNpYmlsaXR5U3RhdGUgPSAke2RvY3VtZW50LnZpc2liaWxpdHlTdGF0ZX1gKVxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5yZW9wZW4oKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAsIDIwMClcbiAgICB9XG4gIH1cblxufVxuXG5Db25uZWN0aW9uTW9uaXRvci5zdGFsZVRocmVzaG9sZCA9IDYgLy8gU2VydmVyOjpDb25uZWN0aW9uczo6QkVBVF9JTlRFUlZBTCAqIDIgKG1pc3NlZCB0d28gcGluZ3MpXG5Db25uZWN0aW9uTW9uaXRvci5yZWNvbm5lY3Rpb25CYWNrb2ZmUmF0ZSA9IDAuMTVcblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdGlvbk1vbml0b3JcbiIsImltcG9ydCBDb25uZWN0aW9uIGZyb20gXCIuL2Nvbm5lY3Rpb25cIlxuaW1wb3J0IFN1YnNjcmlwdGlvbnMgZnJvbSBcIi4vc3Vic2NyaXB0aW9uc1wiXG5cbi8vIFRoZSBBY3Rpb25DYWJsZS5Db25zdW1lciBlc3RhYmxpc2hlcyB0aGUgY29ubmVjdGlvbiB0byBhIHNlcnZlci1zaWRlIFJ1YnkgQ29ubmVjdGlvbiBvYmplY3QuIE9uY2UgZXN0YWJsaXNoZWQsXG4vLyB0aGUgQWN0aW9uQ2FibGUuQ29ubmVjdGlvbk1vbml0b3Igd2lsbCBlbnN1cmUgdGhhdCBpdHMgcHJvcGVybHkgbWFpbnRhaW5lZCB0aHJvdWdoIGhlYXJ0YmVhdHMgYW5kIGNoZWNraW5nIGZvciBzdGFsZSB1cGRhdGVzLlxuLy8gVGhlIENvbnN1bWVyIGluc3RhbmNlIGlzIGFsc28gdGhlIGdhdGV3YXkgdG8gZXN0YWJsaXNoaW5nIHN1YnNjcmlwdGlvbnMgdG8gZGVzaXJlZCBjaGFubmVscyB0aHJvdWdoIHRoZSAjY3JlYXRlU3Vic2NyaXB0aW9uXG4vLyBtZXRob2QuXG4vL1xuLy8gVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0aGlzIGNhbiBiZSBzZXQgdXA6XG4vL1xuLy8gICBBcHAgPSB7fVxuLy8gICBBcHAuY2FibGUgPSBBY3Rpb25DYWJsZS5jcmVhdGVDb25zdW1lcihcIndzOi8vZXhhbXBsZS5jb20vYWNjb3VudHMvMVwiKVxuLy8gICBBcHAuYXBwZWFyYW5jZSA9IEFwcC5jYWJsZS5zdWJzY3JpcHRpb25zLmNyZWF0ZShcIkFwcGVhcmFuY2VDaGFubmVsXCIpXG4vL1xuLy8gRm9yIG1vcmUgZGV0YWlscyBvbiBob3cgeW91J2QgY29uZmlndXJlIGFuIGFjdHVhbCBjaGFubmVsIHN1YnNjcmlwdGlvbiwgc2VlIEFjdGlvbkNhYmxlLlN1YnNjcmlwdGlvbi5cbi8vXG4vLyBXaGVuIGEgY29uc3VtZXIgaXMgY3JlYXRlZCwgaXQgYXV0b21hdGljYWxseSBjb25uZWN0cyB3aXRoIHRoZSBzZXJ2ZXIuXG4vL1xuLy8gVG8gZGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIsIGNhbGxcbi8vXG4vLyAgIEFwcC5jYWJsZS5kaXNjb25uZWN0KClcbi8vXG4vLyBhbmQgdG8gcmVzdGFydCB0aGUgY29ubmVjdGlvbjpcbi8vXG4vLyAgIEFwcC5jYWJsZS5jb25uZWN0KClcbi8vXG4vLyBBbnkgY2hhbm5lbCBzdWJzY3JpcHRpb25zIHdoaWNoIGV4aXN0ZWQgcHJpb3IgdG8gZGlzY29ubmVjdGluZyB3aWxsXG4vLyBhdXRvbWF0aWNhbGx5IHJlc3Vic2NyaWJlLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zdW1lciB7XG4gIGNvbnN0cnVjdG9yKHVybCkge1xuICAgIHRoaXMuX3VybCA9IHVybFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb25zKHRoaXMpXG4gICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24odGhpcylcbiAgICB0aGlzLnN1YnByb3RvY29scyA9IFtdXG4gIH1cblxuICBnZXQgdXJsKCkge1xuICAgIHJldHVybiBjcmVhdGVXZWJTb2NrZXRVUkwodGhpcy5fdXJsKVxuICB9XG5cbiAgc2VuZChkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKGRhdGEpXG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ub3BlbigpXG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uY2xvc2Uoe2FsbG93UmVjb25uZWN0OiBmYWxzZX0pXG4gIH1cblxuICBlbnN1cmVBY3RpdmVDb25uZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5jb25uZWN0aW9uLmlzQWN0aXZlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ub3BlbigpXG4gICAgfVxuICB9XG5cbiAgYWRkU3ViUHJvdG9jb2woc3VicHJvdG9jb2wpIHtcbiAgICB0aGlzLnN1YnByb3RvY29scyA9IFsuLi50aGlzLnN1YnByb3RvY29scywgc3VicHJvdG9jb2xdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlYlNvY2tldFVSTCh1cmwpIHtcbiAgaWYgKHR5cGVvZiB1cmwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHVybCA9IHVybCgpXG4gIH1cblxuICBpZiAodXJsICYmICEvXndzcz86L2kudGVzdCh1cmwpKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgYS5ocmVmID0gdXJsXG4gICAgLy8gRml4IHBvcHVsYXRpbmcgTG9jYXRpb24gcHJvcGVydGllcyBpbiBJRS4gT3RoZXJ3aXNlLCBwcm90b2NvbCB3aWxsIGJlIGJsYW5rLlxuICAgIGEuaHJlZiA9IGEuaHJlZlxuICAgIGEucHJvdG9jb2wgPSBhLnByb3RvY29sLnJlcGxhY2UoXCJodHRwXCIsIFwid3NcIilcbiAgICByZXR1cm4gYS5ocmVmXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVybFxuICB9XG59XG4iLCJpbXBvcnQgQ29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCJcbmltcG9ydCBDb25uZWN0aW9uTW9uaXRvciBmcm9tIFwiLi9jb25uZWN0aW9uX21vbml0b3JcIlxuaW1wb3J0IENvbnN1bWVyLCB7IGNyZWF0ZVdlYlNvY2tldFVSTCB9IGZyb20gXCIuL2NvbnN1bWVyXCJcbmltcG9ydCBJTlRFUk5BTCBmcm9tIFwiLi9pbnRlcm5hbFwiXG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gXCIuL3N1YnNjcmlwdGlvblwiXG5pbXBvcnQgU3Vic2NyaXB0aW9ucyBmcm9tIFwiLi9zdWJzY3JpcHRpb25zXCJcbmltcG9ydCBTdWJzY3JpcHRpb25HdWFyYW50b3IgZnJvbSBcIi4vc3Vic2NyaXB0aW9uX2d1YXJhbnRvclwiXG5pbXBvcnQgYWRhcHRlcnMgZnJvbSBcIi4vYWRhcHRlcnNcIlxuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIlxuXG5leHBvcnQge1xuICBDb25uZWN0aW9uLFxuICBDb25uZWN0aW9uTW9uaXRvcixcbiAgQ29uc3VtZXIsXG4gIElOVEVSTkFMLFxuICBTdWJzY3JpcHRpb24sXG4gIFN1YnNjcmlwdGlvbnMsXG4gIFN1YnNjcmlwdGlvbkd1YXJhbnRvcixcbiAgYWRhcHRlcnMsXG4gIGNyZWF0ZVdlYlNvY2tldFVSTCxcbiAgbG9nZ2VyLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uc3VtZXIodXJsID0gZ2V0Q29uZmlnKFwidXJsXCIpIHx8IElOVEVSTkFMLmRlZmF1bHRfbW91bnRfcGF0aCkge1xuICByZXR1cm4gbmV3IENvbnN1bWVyKHVybClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZyhuYW1lKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoYG1ldGFbbmFtZT0nYWN0aW9uLWNhYmxlLSR7bmFtZX0nXWApXG4gIGlmIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIFwibWVzc2FnZV90eXBlc1wiOiB7XG4gICAgXCJ3ZWxjb21lXCI6IFwid2VsY29tZVwiLFxuICAgIFwiZGlzY29ubmVjdFwiOiBcImRpc2Nvbm5lY3RcIixcbiAgICBcInBpbmdcIjogXCJwaW5nXCIsXG4gICAgXCJjb25maXJtYXRpb25cIjogXCJjb25maXJtX3N1YnNjcmlwdGlvblwiLFxuICAgIFwicmVqZWN0aW9uXCI6IFwicmVqZWN0X3N1YnNjcmlwdGlvblwiXG4gIH0sXG4gIFwiZGlzY29ubmVjdF9yZWFzb25zXCI6IHtcbiAgICBcInVuYXV0aG9yaXplZFwiOiBcInVuYXV0aG9yaXplZFwiLFxuICAgIFwiaW52YWxpZF9yZXF1ZXN0XCI6IFwiaW52YWxpZF9yZXF1ZXN0XCIsXG4gICAgXCJzZXJ2ZXJfcmVzdGFydFwiOiBcInNlcnZlcl9yZXN0YXJ0XCIsXG4gICAgXCJyZW1vdGVcIjogXCJyZW1vdGVcIlxuICB9LFxuICBcImRlZmF1bHRfbW91bnRfcGF0aFwiOiBcIi9jYWJsZVwiLFxuICBcInByb3RvY29sc1wiOiBbXG4gICAgXCJhY3Rpb25jYWJsZS12MS1qc29uXCIsXG4gICAgXCJhY3Rpb25jYWJsZS11bnN1cHBvcnRlZFwiXG4gIF1cbn1cbiIsImltcG9ydCBhZGFwdGVycyBmcm9tIFwiLi9hZGFwdGVyc1wiXG5cbi8vIFRoZSBsb2dnZXIgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdC4gWW91IGNhbiBlbmFibGUgaXQgd2l0aDpcbi8vXG4vLyAgIEFjdGlvbkNhYmxlLmxvZ2dlci5lbmFibGVkID0gdHJ1ZVxuLy9cbi8vICAgRXhhbXBsZTpcbi8vXG4vLyAgIGltcG9ydCAqIGFzIEFjdGlvbkNhYmxlIGZyb20gJ0ByYWlscy9hY3Rpb25jYWJsZSdcbi8vXG4vLyAgIEFjdGlvbkNhYmxlLmxvZ2dlci5lbmFibGVkID0gdHJ1ZVxuLy8gICBBY3Rpb25DYWJsZS5sb2dnZXIubG9nKCdDb25uZWN0aW9uIEVzdGFibGlzaGVkLicpXG4vL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGxvZyguLi5tZXNzYWdlcykge1xuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goRGF0ZS5ub3coKSlcbiAgICAgIGFkYXB0ZXJzLmxvZ2dlci5sb2coXCJbQWN0aW9uQ2FibGVdXCIsIC4uLm1lc3NhZ2VzKVxuICAgIH1cbiAgfSxcbn1cbiIsIi8vIEEgbmV3IHN1YnNjcmlwdGlvbiBpcyBjcmVhdGVkIHRocm91Z2ggdGhlIEFjdGlvbkNhYmxlLlN1YnNjcmlwdGlvbnMgaW5zdGFuY2UgYXZhaWxhYmxlIG9uIHRoZSBjb25zdW1lci5cbi8vIEl0IHByb3ZpZGVzIGEgbnVtYmVyIG9mIGNhbGxiYWNrcyBhbmQgYSBtZXRob2QgZm9yIGNhbGxpbmcgcmVtb3RlIHByb2NlZHVyZSBjYWxscyBvbiB0aGUgY29ycmVzcG9uZGluZ1xuLy8gQ2hhbm5lbCBpbnN0YW5jZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4vL1xuLy8gQW4gZXhhbXBsZSBkZW1vbnN0cmF0ZXMgdGhlIGJhc2ljIGZ1bmN0aW9uYWxpdHk6XG4vL1xuLy8gICBBcHAuYXBwZWFyYW5jZSA9IEFwcC5jYWJsZS5zdWJzY3JpcHRpb25zLmNyZWF0ZShcIkFwcGVhcmFuY2VDaGFubmVsXCIsIHtcbi8vICAgICBjb25uZWN0ZWQoKSB7XG4vLyAgICAgICAvLyBDYWxsZWQgb25jZSB0aGUgc3Vic2NyaXB0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjb21wbGV0ZWRcbi8vICAgICB9LFxuLy9cbi8vICAgICBkaXNjb25uZWN0ZWQoeyB3aWxsQXR0ZW1wdFJlY29ubmVjdDogYm9vbGVhbiB9KSB7XG4vLyAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGhhcyBkaXNjb25uZWN0ZWQgd2l0aCB0aGUgc2VydmVyLlxuLy8gICAgICAgLy8gVGhlIG9iamVjdCB3aWxsIGhhdmUgYW4gYHdpbGxBdHRlbXB0UmVjb25uZWN0YCBwcm9wZXJ0eSB3aGljaFxuLy8gICAgICAgLy8gc2F5cyB3aGV0aGVyIHRoZSBjbGllbnQgaGFzIHRoZSBpbnRlbnRpb24gb2YgYXR0ZW1wdGluZ1xuLy8gICAgICAgLy8gdG8gcmVjb25uZWN0LlxuLy8gICAgIH0sXG4vL1xuLy8gICAgIGFwcGVhcigpIHtcbi8vICAgICAgIHRoaXMucGVyZm9ybSgnYXBwZWFyJywge2FwcGVhcmluZ19vbjogdGhpcy5hcHBlYXJpbmdPbigpfSlcbi8vICAgICB9LFxuLy9cbi8vICAgICBhd2F5KCkge1xuLy8gICAgICAgdGhpcy5wZXJmb3JtKCdhd2F5Jylcbi8vICAgICB9LFxuLy9cbi8vICAgICBhcHBlYXJpbmdPbigpIHtcbi8vICAgICAgICQoJ21haW4nKS5kYXRhKCdhcHBlYXJpbmctb24nKVxuLy8gICAgIH1cbi8vICAgfSlcbi8vXG4vLyBUaGUgbWV0aG9kcyAjYXBwZWFyIGFuZCAjYXdheSBmb3J3YXJkIHRoZWlyIGludGVudCB0byB0aGUgcmVtb3RlIEFwcGVhcmFuY2VDaGFubmVsIGluc3RhbmNlIG9uIHRoZSBzZXJ2ZXJcbi8vIGJ5IGNhbGxpbmcgdGhlIGBwZXJmb3JtYCBtZXRob2Qgd2l0aCB0aGUgZmlyc3QgcGFyYW1ldGVyIGJlaW5nIHRoZSBhY3Rpb24gKHdoaWNoIG1hcHMgdG8gQXBwZWFyYW5jZUNoYW5uZWwjYXBwZWFyL2F3YXkpLlxuLy8gVGhlIHNlY29uZCBwYXJhbWV0ZXIgaXMgYSBoYXNoIHRoYXQnbGwgZ2V0IEpTT04gZW5jb2RlZCBhbmQgbWFkZSBhdmFpbGFibGUgb24gdGhlIHNlcnZlciBpbiB0aGUgZGF0YSBwYXJhbWV0ZXIuXG4vL1xuLy8gVGhpcyBpcyBob3cgdGhlIHNlcnZlciBjb21wb25lbnQgd291bGQgbG9vazpcbi8vXG4vLyAgIGNsYXNzIEFwcGVhcmFuY2VDaGFubmVsIDwgQXBwbGljYXRpb25BY3Rpb25DYWJsZTo6Q2hhbm5lbFxuLy8gICAgIGRlZiBzdWJzY3JpYmVkXG4vLyAgICAgICBjdXJyZW50X3VzZXIuYXBwZWFyXG4vLyAgICAgZW5kXG4vL1xuLy8gICAgIGRlZiB1bnN1YnNjcmliZWRcbi8vICAgICAgIGN1cnJlbnRfdXNlci5kaXNhcHBlYXJcbi8vICAgICBlbmRcbi8vXG4vLyAgICAgZGVmIGFwcGVhcihkYXRhKVxuLy8gICAgICAgY3VycmVudF91c2VyLmFwcGVhciBvbjogZGF0YVsnYXBwZWFyaW5nX29uJ11cbi8vICAgICBlbmRcbi8vXG4vLyAgICAgZGVmIGF3YXlcbi8vICAgICAgIGN1cnJlbnRfdXNlci5hd2F5XG4vLyAgICAgZW5kXG4vLyAgIGVuZFxuLy9cbi8vIFRoZSBcIkFwcGVhcmFuY2VDaGFubmVsXCIgbmFtZSBpcyBhdXRvbWF0aWNhbGx5IG1hcHBlZCBiZXR3ZWVuIHRoZSBjbGllbnQtc2lkZSBzdWJzY3JpcHRpb24gY3JlYXRpb24gYW5kIHRoZSBzZXJ2ZXItc2lkZSBSdWJ5IGNsYXNzIG5hbWUuXG4vLyBUaGUgQXBwZWFyYW5jZUNoYW5uZWwjYXBwZWFyL2F3YXkgcHVibGljIG1ldGhvZHMgYXJlIGV4cG9zZWQgYXV0b21hdGljYWxseSB0byBjbGllbnQtc2lkZSBpbnZvY2F0aW9uIHRocm91Z2ggdGhlIHBlcmZvcm0gbWV0aG9kLlxuXG5jb25zdCBleHRlbmQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnRpZXMpIHtcbiAgaWYgKHByb3BlcnRpZXMgIT0gbnVsbCkge1xuICAgIGZvciAobGV0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb3BlcnRpZXNba2V5XVxuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGNvbnN1bWVyLCBwYXJhbXMgPSB7fSwgbWl4aW4pIHtcbiAgICB0aGlzLmNvbnN1bWVyID0gY29uc3VtZXJcbiAgICB0aGlzLmlkZW50aWZpZXIgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMpXG4gICAgZXh0ZW5kKHRoaXMsIG1peGluKVxuICB9XG5cbiAgLy8gUGVyZm9ybSBhIGNoYW5uZWwgYWN0aW9uIHdpdGggdGhlIG9wdGlvbmFsIGRhdGEgcGFzc2VkIGFzIGFuIGF0dHJpYnV0ZVxuICBwZXJmb3JtKGFjdGlvbiwgZGF0YSA9IHt9KSB7XG4gICAgZGF0YS5hY3Rpb24gPSBhY3Rpb25cbiAgICByZXR1cm4gdGhpcy5zZW5kKGRhdGEpXG4gIH1cblxuICBzZW5kKGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdW1lci5zZW5kKHtjb21tYW5kOiBcIm1lc3NhZ2VcIiwgaWRlbnRpZmllcjogdGhpcy5pZGVudGlmaWVyLCBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pXG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdW1lci5zdWJzY3JpcHRpb25zLnJlbW92ZSh0aGlzKVxuICB9XG59XG4iLCJpbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5cbi8vIFJlc3BvbnNpYmxlIGZvciBlbnN1cmluZyBjaGFubmVsIHN1YnNjcmliZSBjb21tYW5kIGlzIGNvbmZpcm1lZCwgcmV0cnlpbmcgdW50aWwgY29uZmlybWF0aW9uIGlzIHJlY2VpdmVkLlxuLy8gSW50ZXJuYWwgY2xhc3MsIG5vdCBpbnRlbmRlZCBmb3IgZGlyZWN0IHVzZXIgbWFuaXB1bGF0aW9uLlxuXG5jbGFzcyBTdWJzY3JpcHRpb25HdWFyYW50b3Ige1xuICBjb25zdHJ1Y3RvcihzdWJzY3JpcHRpb25zKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gc3Vic2NyaXB0aW9uc1xuICAgIHRoaXMucGVuZGluZ1N1YnNjcmlwdGlvbnMgPSBbXVxuICB9XG5cbiAgZ3VhcmFudGVlKHN1YnNjcmlwdGlvbikge1xuICAgIGlmKHRoaXMucGVuZGluZ1N1YnNjcmlwdGlvbnMuaW5kZXhPZihzdWJzY3JpcHRpb24pID09IC0xKXsgXG4gICAgICBsb2dnZXIubG9nKGBTdWJzY3JpcHRpb25HdWFyYW50b3IgZ3VhcmFudGVlaW5nICR7c3Vic2NyaXB0aW9uLmlkZW50aWZpZXJ9YClcbiAgICAgIHRoaXMucGVuZGluZ1N1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pIFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ2dlci5sb2coYFN1YnNjcmlwdGlvbkd1YXJhbnRvciBhbHJlYWR5IGd1YXJhbnRlZWluZyAke3N1YnNjcmlwdGlvbi5pZGVudGlmaWVyfWApXG4gICAgfVxuICAgIHRoaXMuc3RhcnRHdWFyYW50ZWVpbmcoKVxuICB9XG5cbiAgZm9yZ2V0KHN1YnNjcmlwdGlvbikge1xuICAgIGxvZ2dlci5sb2coYFN1YnNjcmlwdGlvbkd1YXJhbnRvciBmb3JnZXR0aW5nICR7c3Vic2NyaXB0aW9uLmlkZW50aWZpZXJ9YClcbiAgICB0aGlzLnBlbmRpbmdTdWJzY3JpcHRpb25zID0gKHRoaXMucGVuZGluZ1N1YnNjcmlwdGlvbnMuZmlsdGVyKChzKSA9PiBzICE9PSBzdWJzY3JpcHRpb24pKVxuICB9XG5cbiAgc3RhcnRHdWFyYW50ZWVpbmcoKSB7XG4gICAgdGhpcy5zdG9wR3VhcmFudGVlaW5nKClcbiAgICB0aGlzLnJldHJ5U3Vic2NyaWJpbmcoKVxuICB9XG4gIFxuICBzdG9wR3VhcmFudGVlaW5nKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJldHJ5VGltZW91dClcbiAgfVxuXG4gIHJldHJ5U3Vic2NyaWJpbmcoKSB7XG4gICAgdGhpcy5yZXRyeVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMgJiYgdHlwZW9mKHRoaXMuc3Vic2NyaXB0aW9ucy5zdWJzY3JpYmUpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nU3Vic2NyaXB0aW9ucy5tYXAoKHN1YnNjcmlwdGlvbikgPT4ge1xuICAgICAgICAgIGxvZ2dlci5sb2coYFN1YnNjcmlwdGlvbkd1YXJhbnRvciByZXN1YnNjcmliaW5nICR7c3Vic2NyaXB0aW9uLmlkZW50aWZpZXJ9YClcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuc3Vic2NyaWJlKHN1YnNjcmlwdGlvbilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgLCA1MDApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3Vic2NyaXB0aW9uR3VhcmFudG9yIiwiaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi9zdWJzY3JpcHRpb25cIlxuaW1wb3J0IFN1YnNjcmlwdGlvbkd1YXJhbnRvciBmcm9tIFwiLi9zdWJzY3JpcHRpb25fZ3VhcmFudG9yXCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcblxuLy8gQ29sbGVjdGlvbiBjbGFzcyBmb3IgY3JlYXRpbmcgKGFuZCBpbnRlcm5hbGx5IG1hbmFnaW5nKSBjaGFubmVsIHN1YnNjcmlwdGlvbnMuXG4vLyBUaGUgb25seSBtZXRob2QgaW50ZW5kZWQgdG8gYmUgdHJpZ2dlcmVkIGJ5IHRoZSB1c2VyIGlzIEFjdGlvbkNhYmxlLlN1YnNjcmlwdGlvbnMjY3JlYXRlLFxuLy8gYW5kIGl0IHNob3VsZCBiZSBjYWxsZWQgdGhyb3VnaCB0aGUgY29uc3VtZXIgbGlrZSBzbzpcbi8vXG4vLyAgIEFwcCA9IHt9XG4vLyAgIEFwcC5jYWJsZSA9IEFjdGlvbkNhYmxlLmNyZWF0ZUNvbnN1bWVyKFwid3M6Ly9leGFtcGxlLmNvbS9hY2NvdW50cy8xXCIpXG4vLyAgIEFwcC5hcHBlYXJhbmNlID0gQXBwLmNhYmxlLnN1YnNjcmlwdGlvbnMuY3JlYXRlKFwiQXBwZWFyYW5jZUNoYW5uZWxcIilcbi8vXG4vLyBGb3IgbW9yZSBkZXRhaWxzIG9uIGhvdyB5b3UnZCBjb25maWd1cmUgYW4gYWN0dWFsIGNoYW5uZWwgc3Vic2NyaXB0aW9uLCBzZWUgQWN0aW9uQ2FibGUuU3Vic2NyaXB0aW9uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJzY3JpcHRpb25zIHtcbiAgY29uc3RydWN0b3IoY29uc3VtZXIpIHtcbiAgICB0aGlzLmNvbnN1bWVyID0gY29uc3VtZXJcbiAgICB0aGlzLmd1YXJhbnRvciA9IG5ldyBTdWJzY3JpcHRpb25HdWFyYW50b3IodGhpcylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXVxuICB9XG5cbiAgY3JlYXRlKGNoYW5uZWxOYW1lLCBtaXhpbikge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBjaGFubmVsTmFtZVxuICAgIGNvbnN0IHBhcmFtcyA9IHR5cGVvZiBjaGFubmVsID09PSBcIm9iamVjdFwiID8gY2hhbm5lbCA6IHtjaGFubmVsfVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcy5jb25zdW1lciwgcGFyYW1zLCBtaXhpbilcbiAgICByZXR1cm4gdGhpcy5hZGQoc3Vic2NyaXB0aW9uKVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIGFkZChzdWJzY3JpcHRpb24pIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pXG4gICAgdGhpcy5jb25zdW1lci5lbnN1cmVBY3RpdmVDb25uZWN0aW9uKClcbiAgICB0aGlzLm5vdGlmeShzdWJzY3JpcHRpb24sIFwiaW5pdGlhbGl6ZWRcIilcbiAgICB0aGlzLnN1YnNjcmliZShzdWJzY3JpcHRpb24pXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvblxuICB9XG5cbiAgcmVtb3ZlKHN1YnNjcmlwdGlvbikge1xuICAgIHRoaXMuZm9yZ2V0KHN1YnNjcmlwdGlvbilcbiAgICBpZiAoIXRoaXMuZmluZEFsbChzdWJzY3JpcHRpb24uaWRlbnRpZmllcikubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbmRDb21tYW5kKHN1YnNjcmlwdGlvbiwgXCJ1bnN1YnNjcmliZVwiKVxuICAgIH1cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uXG4gIH1cblxuICByZWplY3QoaWRlbnRpZmllcikge1xuICAgIHJldHVybiB0aGlzLmZpbmRBbGwoaWRlbnRpZmllcikubWFwKChzdWJzY3JpcHRpb24pID0+IHtcbiAgICAgIHRoaXMuZm9yZ2V0KHN1YnNjcmlwdGlvbilcbiAgICAgIHRoaXMubm90aWZ5KHN1YnNjcmlwdGlvbiwgXCJyZWplY3RlZFwiKVxuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvblxuICAgIH0pXG4gIH1cblxuICBmb3JnZXQoc3Vic2NyaXB0aW9uKSB7XG4gICAgdGhpcy5ndWFyYW50b3IuZm9yZ2V0KHN1YnNjcmlwdGlvbilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSAodGhpcy5zdWJzY3JpcHRpb25zLmZpbHRlcigocykgPT4gcyAhPT0gc3Vic2NyaXB0aW9uKSlcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uXG4gIH1cblxuICBmaW5kQWxsKGlkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmZpbHRlcigocykgPT4gcy5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKVxuICB9XG5cbiAgcmVsb2FkKCkge1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubWFwKChzdWJzY3JpcHRpb24pID0+XG4gICAgICB0aGlzLnN1YnNjcmliZShzdWJzY3JpcHRpb24pKVxuICB9XG5cbiAgbm90aWZ5QWxsKGNhbGxiYWNrTmFtZSwgLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubWFwKChzdWJzY3JpcHRpb24pID0+XG4gICAgICB0aGlzLm5vdGlmeShzdWJzY3JpcHRpb24sIGNhbGxiYWNrTmFtZSwgLi4uYXJncykpXG4gIH1cblxuICBub3RpZnkoc3Vic2NyaXB0aW9uLCBjYWxsYmFja05hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uc1xuICAgIGlmICh0eXBlb2Ygc3Vic2NyaXB0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBzdWJzY3JpcHRpb25zID0gdGhpcy5maW5kQWxsKHN1YnNjcmlwdGlvbilcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaXB0aW9ucyA9IFtzdWJzY3JpcHRpb25dXG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbnMubWFwKChzdWJzY3JpcHRpb24pID0+XG4gICAgICAodHlwZW9mIHN1YnNjcmlwdGlvbltjYWxsYmFja05hbWVdID09PSBcImZ1bmN0aW9uXCIgPyBzdWJzY3JpcHRpb25bY2FsbGJhY2tOYW1lXSguLi5hcmdzKSA6IHVuZGVmaW5lZCkpXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaXB0aW9uKSB7XG4gICAgaWYgKHRoaXMuc2VuZENvbW1hbmQoc3Vic2NyaXB0aW9uLCBcInN1YnNjcmliZVwiKSkge1xuICAgICAgdGhpcy5ndWFyYW50b3IuZ3VhcmFudGVlKHN1YnNjcmlwdGlvbilcbiAgICB9XG4gIH1cblxuICBjb25maXJtU3Vic2NyaXB0aW9uKGlkZW50aWZpZXIpIHtcbiAgICBsb2dnZXIubG9nKGBTdWJzY3JpcHRpb24gY29uZmlybWVkICR7aWRlbnRpZmllcn1gKVxuICAgIHRoaXMuZmluZEFsbChpZGVudGlmaWVyKS5tYXAoKHN1YnNjcmlwdGlvbikgPT5cbiAgICAgIHRoaXMuZ3VhcmFudG9yLmZvcmdldChzdWJzY3JpcHRpb24pKVxuICB9XG5cbiAgc2VuZENvbW1hbmQoc3Vic2NyaXB0aW9uLCBjb21tYW5kKSB7XG4gICAgY29uc3Qge2lkZW50aWZpZXJ9ID0gc3Vic2NyaXB0aW9uXG4gICAgcmV0dXJuIHRoaXMuY29uc3VtZXIuc2VuZCh7Y29tbWFuZCwgaWRlbnRpZmllcn0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
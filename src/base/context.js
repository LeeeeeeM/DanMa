let context = {
  canvas: null
}

const IN_BROWSER = typeof window !== 'undefined'

function toNumber (str) {
  return Number(str.replace(/[^\d]/g, ''))
}

function setContext (cxt) {
  context = cxt
}

function getContext () {
  return context
}

const API = {
  document: {}
}

API.document.createElement = IN_BROWSER
  ? window.document.createElement.bind(window.document)
  : function () {
    return context.canvas
  }

API.document.getElementById = IN_BROWSER
  ? window.document.getElementById.bind(window.document)
  : function () {
    return {
      offsetHeight: toNumber(context.canvas._finalStyleCache['height']),
      offsetWidth: toNumber(context.canvas._finalStyleCache['width']),
      style: {},
      appendChild () {

      }
    }
  }

API.devicePixelRatio = IN_BROWSER ? window.devicePixelRatio : 1

export default API

export {
  setContext,
  getContext
}

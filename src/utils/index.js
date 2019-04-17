let context
if (typeof window !== 'undefined') {
  context = window
} else if (typeof global !== 'undefined') {
  context = global
}

const requestAnimationFrame = context.requestAnimationFrame || function (fn) {
  return setTimeout(fn, 16)
}

const cancelAnimationFrame = context.cancelAnimationFrame || function (id) {
  return clearTimeout(id)
}

function setFont (size) {
  return size + 'px sans-serif'
}

export {
  requestAnimationFrame,
  cancelAnimationFrame,
  setFont
}

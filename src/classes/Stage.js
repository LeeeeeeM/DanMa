import api from '../base/context'
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/index'

export default class Stage {
  constructor (el, lines = 10) {
    // Web DOM环境下用于挂载
    this.parent = el && el.nodeType === 1 ? el : api.document.getElementById(el)
    this.parent.style.position = this.parent.style.position || 'relative'

    // 获取canvas环境
    this.layer = api.document.createElement('canvas')
    this.context = this.layer.getContext('2d')

    this.dpr = api.devicePixelRatio || 1

    // 设置舞台高度
    this.stageHeight = this.parent.offsetHeight * this.dpr
    this.stageWidth = this.parent.offsetWidth * this.dpr

    this.lines = lines
    this.lineHeight = Math.max(this.stageHeight / lines, 12)

    // Web DOM环境下设置样式
    this.layer.width = this.parent.offsetWidth * this.dpr
    this.layer.height = this.parent.offsetHeight * this.dpr
    this.layer.style.width = this.parent.offsetWidth + 'px'
    this.layer.style.height = this.parent.offsetHeight + 'px'
    this.layer.style.display = 'block'
    this.layer.style.position = 'absolute'
    this.layer.style.left = 0
    this.layer.style.top = 0
    this.layer.style.zIndex = 10000

    this.pool = null
    this.paintTimer = null
    this._isRunning = false
  }

  $mount () {
    this.parent.appendChild(this.layer)
    return this
  }

  $connect (pool) {
    this.pool = pool
    return this
  }

  clear () {
    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight)
  }

  paint () {
    this.clear()
    this._isRunning = false
    this.paintTimer = null
    if (this.pool.isEmpty()) return
    this._isRunning = true
    const list = this.pool.getDms()
    for (let len = list.length, i = len - 1; i >= 0; i--) {
      list[i].move()
      this.context.font = list[i].font
      this.context.textAlign = 'start'
      this.context.textBaseline = 'top'
      this.context.fillStyle = list[i].color
      this.context.fillText(list[i].text, list[i].x, list[i].y)
      if (list[i].x + list[i].textWidth < -this.stageWidth) {
        this.pool.removeDm(i)
      }
    }
    this.paintTimer = requestAnimationFrame(this.paint.bind(this))
  }

  pause () {
    this.paintTimer && cancelAnimationFrame(this.paintTimer)
    this.paintTimer = null
  }

  hasStoped () {
    return !this._isRunning && !this.paintTimer
  }
}

import { setFont } from '../utils/index'
import addToPool from '../base/base-pool'

class Shoot {
  constructor (x, y, text, font, color) {
    this.x = x
    this.y = y
    this.text = text || '测试'
    this.font = setFont(font)
    this.color = color
    this.textWidth = 0
    this.speed = 0
  }

  setV (ctx) {
    this.textWidth = ctx.measureText(this.text).width
    this.speed = Math.pow(this.textWidth, 1 / 3)
  }

  move () {
    this.x = this.x - this.speed
  }

  dispose () {
    this.textWidth = 0
    this.speed = 0
  }
}

export default addToPool(Shoot)

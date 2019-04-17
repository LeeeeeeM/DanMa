import Stage from './classes/Stage'
import Pool from './classes/Pool'
import { setContext } from './base/context'

export default class DanMa {
  constructor (el, lines) {
    this.stage = new Stage(el, lines)
    this.pool = new Pool()
    this._init()
  }

  $pause () {
    this.stage.pause()
  }

  $start () {
    this.stage.paint()
  }

  _init () {
    this.stage.$mount().$connect(this.pool)
  }

  $receive (options) {
    this.pool.pushDm(options, this.stage)
    if (!this.stage.hasStoped()) return
    this.stage.paint()
  }
}

DanMa.setOptions = setContext

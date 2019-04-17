import Shoot from './Shoot'

export default class Pool {
  constructor () {
    this._data = []
    this._index = 0
  }

  pushDm (dm, stage) {
    this._index++
    if (this._index >= stage.lines) {
      this._index = 0
    }
    const shoot = Shoot.getPooler(stage.stageWidth, stage.lineHeight * this._index, dm.text, stage.lineHeight, dm.color)
    shoot.setV(stage.context)
    this._data.push(shoot)
  }

  removeDm (index) {
    Shoot.release(this._data[index])
    this._data.splice(index, 1)
  }

  clearDms () {
    this._data = []
  }

  getDms () {
    return this._data
  }

  isEmpty () {
    return this._data.length === 0
  }
}

    (function(s) {console.log(s)})('### App Framework ### Start: 0.1.1 Build 20190417');
    
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.DanMa = factory());
}(this, (function () { 'use strict';

  var context = {
    canvas: null
  };

  var IN_BROWSER = typeof window !== 'undefined';

  function toNumber (str) {
    return Number(str.replace(/[^\d]/g, ''))
  }

  function setContext (cxt) {
    context = cxt;
  }

  var API = {
    document: {}
  };

  API.document.createElement = IN_BROWSER
    ? window.document.createElement.bind(window.document)
    : function () {
      return context.canvas
    };

  API.document.getElementById = IN_BROWSER
    ? window.document.getElementById.bind(window.document)
    : function () {
      return {
        offsetHeight: toNumber(context.canvas._finalStyleCache['height']),
        offsetWidth: toNumber(context.canvas._finalStyleCache['width']),
        style: {},
        appendChild: function appendChild () {

        }
      }
    };

  API.devicePixelRatio = IN_BROWSER ? window.devicePixelRatio : 1;

  var context$1;
  if (typeof window !== 'undefined') {
    context$1 = window;
  } else if (typeof global !== 'undefined') {
    context$1 = global;
  }

  var requestAnimationFrame = context$1.requestAnimationFrame || function (fn) {
    return setTimeout(fn, 16)
  };

  var cancelAnimationFrame = context$1.cancelAnimationFrame || function (id) {
    return clearTimeout(id)
  };

  function setFont (size) {
    return size + 'px sans-serif'
  }

  var Stage = function Stage (el, lines) {
    if ( lines === void 0 ) lines = 10;

    // Web DOM环境下用于挂载
    this.parent = el && el.nodeType === 1 ? el : API.document.getElementById(el);
    this.parent.style.position = this.parent.style.position || 'relative';

    // 获取canvas环境
    this.layer = API.document.createElement('canvas');
    this.context = this.layer.getContext('2d');

    this.dpr = API.devicePixelRatio || 1;

    // 设置舞台高度
    this.stageHeight = this.parent.offsetHeight * this.dpr;
    this.stageWidth = this.parent.offsetWidth * this.dpr;

    this.lines = lines;
    this.lineHeight = Math.max(this.stageHeight / lines, 12);

    // Web DOM环境下设置样式
    this.layer.width = this.parent.offsetWidth * this.dpr;
    this.layer.height = this.parent.offsetHeight * this.dpr;
    this.layer.style.width = this.parent.offsetWidth + 'px';
    this.layer.style.height = this.parent.offsetHeight + 'px';
    this.layer.style.display = 'block';
    this.layer.style.position = 'absolute';
    this.layer.style.left = 0;
    this.layer.style.top = 0;
    this.layer.style.zIndex = 10000;

    this.pool = null;
    this.paintTimer = null;
    this._isRunning = false;
  };

  Stage.prototype.$mount = function $mount () {
    this.parent.appendChild(this.layer);
    return this
  };

  Stage.prototype.$connect = function $connect (pool) {
    this.pool = pool;
    return this
  };

  Stage.prototype.clear = function clear () {
    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
  };

  Stage.prototype.paint = function paint () {
    this.clear();
    this._isRunning = false;
    if (this.pool.isEmpty()) { return }
    this._isRunning = true;
    var list = this.pool.getDms();
    for (var len = list.length, i = len - 1; i >= 0; i--) {
      list[i].move();
      this.context.font = list[i].font;
      this.context.textAlign = 'start';
      this.context.textBaseline = 'top';
      this.context.fillStyle = list[i].color;
      this.context.fillText(list[i].text, list[i].x, list[i].y);
      if (list[i].x + list[i].textWidth < -this.stageWidth) {
        this.pool.removeDm(i);
      }
    }
    this.paintTimer = requestAnimationFrame(this.paint.bind(this));
  };

  Stage.prototype.pause = function pause () {
    this.paintTimer && cancelAnimationFrame(this.paintTimer);
    this.paintTimer = null;
  };

  Stage.prototype.hasStoped = function hasStoped () {
    return !this._isRunning && !this.paintTimer
  };

  var DEFAULT_POOL_SIZE = 10;

  function pooler () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.apply(instance, args);
      return instance
    } else {
      return new (Function.prototype.bind.apply( Klass, [ null ].concat( args) ))
    }
  }

  function releaser (instance) {
    var Klass = this;
    if (!(instance instanceof Klass)) {
      console.warn((instance + " 不是 " + Klass + "的实例"));
      return
    }

    instance.dispose && instance.dispose();

    if (Klass.instancePool.length < Klass.poolSize) {
      Klass.instancePool.push(instance);
    }
  }

  function addPoolingTo (ctor, size) {
    var Klass = ctor;
    Klass.instancePool = [];
    Klass.poolSize = DEFAULT_POOL_SIZE;
    Klass.getPooler = pooler;
    Klass.release = releaser;
    return Klass
  }

  var Shoot = function Shoot (x, y, text, font, color) {
    this.x = x;
    this.y = y;
    this.text = text || '测试';
    this.font = setFont(font);
    this.color = color;
    this.textWidth = 0;
    this.speed = 0;
  };

  Shoot.prototype.setV = function setV (ctx) {
    this.textWidth = ctx.measureText(this.text).width;
    this.speed = Math.pow(this.textWidth, 1 / 3);
  };

  Shoot.prototype.move = function move () {
    this.x = this.x - this.speed;
  };

  Shoot.prototype.dispose = function dispose () {
    this.textWidth = 0;
    this.speed = 0;
  };

  var Shoot$1 = addPoolingTo(Shoot);

  var Pool = function Pool () {
    this._data = [];
    this._index = 0;
  };

  Pool.prototype.pushDm = function pushDm (dm, stage) {
    this._index++;
    if (this._index >= stage.lines) {
      this._index = 0;
    }
    var shoot = Shoot$1.getPooler(stage.stageWidth, stage.lineHeight * this._index, dm.text, stage.lineHeight, dm.color);
    shoot.setV(stage.context);
    this._data.push(shoot);
  };

  Pool.prototype.removeDm = function removeDm (index) {
    Shoot$1.release(this._data[index]);
    this._data.splice(index, 1);
  };

  Pool.prototype.clearDms = function clearDms () {
    this._data = [];
  };

  Pool.prototype.getDms = function getDms () {
    return this._data
  };

  Pool.prototype.isEmpty = function isEmpty () {
    return this._data.length === 0
  };

  var DanMa = function DanMa (el, lines) {
    this.stage = new Stage(el, lines);
    this.pool = new Pool();
    this._init();
  };

  DanMa.prototype.$pause = function $pause () {
    this.stage.pause();
  };

  DanMa.prototype.$start = function $start () {
    this.stage.paint();
  };

  DanMa.prototype._init = function _init () {
    this.stage.$mount().$connect(this.pool);
  };

  DanMa.prototype.$receive = function $receive (options) {
    this.pool.pushDm(options, this.stage);
    if (!this.stage.hasStoped()) { return }
    this.stage.paint();
  };

  DanMa.setOptions = setContext;

  return DanMa;

})));
//# sourceMappingURL=index.js.map

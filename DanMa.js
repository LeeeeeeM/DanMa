(function(window) {
    var DanMa = function(el, name, lines) {
        this.stage = new Stage(el, name, lines);
        this.pool = new Pool(this.stage);
        this._data = this.pool._data;
        this.rid = null;
        this._isRunning = false;
        this.__init();
        this.__start();
    }

    DanMa.version = 'v0.0.1';

    DanMa.Dom = window.document;

    DanMa.prototype = {
        __render: function() {
            this.stage.clear();
            this._isRunning = false;
            if (!this.pool.check()) {
            	return;
            }
            this._isRunning = true;
            for (var i = 0; i < this._data.length; i++) {
                this._data[i].draw();
            }
            this.rid = _RAF(this.__render.bind(this));
        },
        __init: function() {
        	this.stage.parent.appendChild(this.stage.layer);
        	return this;
        },
        __pause: function() {
        	_CAF(this.rid);
        },
        __start: function() {
        	this.__render();
        },
        emit(data) {
        	this.pool.push({
        		text: data.text || '默认数据',
        		color: data.color || '#f00'
        	});
        	if (!this._isRunning) {
        		this.__render();
        	}
        }
    };

    var Pool = function(stage) {
    	this.stage = stage;
    	this.index = 0;
        this._data = [];
        this.context = this.stage.context;
    }

    var font = function(size, family) {
    	return size + 'px ' + family || 'sans-serif';
    }

    Pool.prototype = {
        push: function(dm) {
        	var stage = this.stage;
        	this.index++;
        	if (this.index >= stage.lines - 1) {
        		this.index = 0;
        	}
        	var newDm = new Shoot(stage.context, stage.stageWidth, stage.lineHeight * this.index, dm.text, font(stage.lineHeight), dm.color);
        	this._data.push(newDm);
        },
        removeItem: function(index) {
        	this._data.splice(index, 1);
        },
        check: function() {
        	if (!this._data.length) {
        		_CAF(this.rid);
        		return false;
        	}
        	for(var i = 0; i< this._data.length; i++) {
        		if (this.getItem(i).x + this.getItem(i).textWidth < - this.stage.stageWidth) {
        			this.removeItem(i);
        		}
        	}
        	return true;
        },
        clear: function() {
        	this._data = [];
        },
        getItem: function(index) {
        	return this._data[index];
        }
    }

    var Shoot = function(ctx, x, y, text, font, color, speed) {
        this.ctx = ctx;
        this.text = text || '测试';
        this.font = font;
        this.color = color;
        this.textWidth = this.ctx.measureText(this.text).width;
        this.speed = Math.pow(this.textWidth, 1 / 3);
        this.y = y;
        this.x = x;
    }

    Shoot.prototype = {
        draw: function() {
            this.x = this.x - this.speed;
            this.ctx.font = this.font;
            this.ctx.textAlign = 'start';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = this.color;
            this.ctx.fillText(this.text, this.x, this.y);
        }
    }


    var Stage = function(el, id, lines, backColor) {
        this.parent = el && el.nodeType === 1 ? el : DanMa.Dom.getElementById(el);
        this.parent.style.position = this.parent.style.position || 'relative';

        this.layer = DanMa.Dom.createElement('canvas');
        this.id = this.layer.id = id;
        this.dpr = window.devicePixelRatio || 1;
        
        this.context = this.layer.getContext('2d');
        this.layer.width = this.stageWidth = this.parent.offsetWidth * this.dpr;
        this.layer.height = this.stageHeight = this.parent.offsetHeight * this.dpr;
        this.lineHeight = Math.max(this.stageHeight / lines, 12);
        this.lines = lines;

        this.layer.style.width = this.parent.offsetWidth + 'px';
        this.layer.style.height = this.parent.offsetHeight + 'px';
        this.layer.style.display = 'block';
        this.layer.style.backgroundColor = backColor || 'transparent';
        this.layer.style.position = 'absolute';
        this.layer.style.left = 0;
        this.layer.style.top = 0;
        this.layer.style.zIndex = 10000;
    }

    Stage.prototype = {
        clear: function() {
            this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
        }
    }

    var _RAF = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(fn) {
        	return setTimeout(fn, 16);
        };

    var _CAF = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(id) {
        	clearTimeout(id);
        };

   	window.DanMa = DanMa;
})(window);
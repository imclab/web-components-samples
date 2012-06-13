var knob = (function() {
  var mousemove = function(e) {
    var offset = this.previous - e.y;
    if (e.shiftKey) {
      offset = offset < 0 ? -this.step : offset > 0 ? +this.step : 0;
    } else {
      var valueRange = Math.abs(this.min) + Math.abs(this.max);
      offset = Math.floor(valueRange * offset / 100);
    }
    this.update(this.value + offset);
    this.previous = e.y;
  };
  var mouseup = function(e) {
    this.previous = null;
    this.val.style.display = 'none';
    if (handlers.move) {
	window.removeEventListener('mousemove', handlers.move, true);
	handlers.move = null;
    }
    if (handlers.up) {
	window.removeEventListener('mouseup', handlers.up, true);
	handlers.up = null;
    }
  };
  var handlers = {
      move: null,
      up: null
  };

  var knob = function(elem) {
    var STYLE = 
      '.overlay {'+
        'position: relative;'+
        'display:block;'+
        'background-color:transparent;'+
        'box-shadow:5px 5px 5px 0 #777;'+
        'width: ##swd_width##px;'+
        'height: ##swd_height##px;'+
        'border-radius: ##swd_border-radius##px;'+
      '}'+
      '.knob_theme {'+
        'background-color:#999;'+
        'box-shadow:inset -5px -5px 20px 0 #333, inset 5px 5px 20px 0 #ccc;'+
      '}'+
      '.knob {'+
        'position:relative;'+
        'top:1px;'+
        'left:1px;'+
        'border:1px solid #777;'+
        'width: ##knob_width##px;'+
        'height: ##knob_height##px;'+
        'border-radius: ##knob_border-radius##px;'+
      '}'+
      '.indicator {'+
        'position:relative;'+
        'width:5px;'+
        'background-color:gray;'+
        'border-bottom-left-radius:2px;'+
        'border-bottom-right-radius:2px;'+
        'box-shadow:inset 1px 1px 2px 1px #555;'+
        'height: ##ind_height##px;'+
        'top: -1px;'+
        'left: ##ind_left##px;'+
        '-webkit-transform-origin; 3px ##ind_transform-origin##px;'+
      '}'+
      '.value {'+
        'display: none;'+
        'position: absolute;'+
        'border: 1px solid black;'+
        'background-color: #eee;'+
        'opacity: 0.5;'+
        'margin: 0;'+
        'padding: 1px 2px;'+
        'right: -5px;'+
        'top: -10px;'+
        'font-family: arial, sans serif;'+
        'font-size: 10px;'+
        'height: 10px;'+
      '}';
    var TEMPLATE =
      '<style scoped>##style##</style>'+
      '<div class="overlay">'+
        '<div class="knob knob_theme">'+
          '<div class="indicator"></div>'+
        '</div>'+
        '<div class="value"></div>'+
      '</div>';
    this.value = 0;
    this.max = 127;
    this.maxAngle = 120;
    this.min = 0;
    this.minAngle = -120;
    this.step = 1;
    this.previous = null;
    this.callback = null;

    var diameter = 40;
    var theme = 'knob_theme';

    var opt = {};
    opt.diameter = parseInt(elem.dataset.diameter != undefined ? elem.dataset.diameter : 40);
    opt.min = parseInt(elem.dataset.min != undefined ? elem.dataset.min : 0);
    opt.max = parseInt(elem.dataset.max != undefined ? elem.dataset.max : 127);
    opt.minAngle = parseInt(elem.dataset.minAngle != undefined ? elem.dataset.minAngle : -120);
    opt.maxAngle = parseInt(elem.dataset.maxAngle != undefined ? elem.dataset.maxAngle : 120);
    opt.step = parseInt(elem.dataset.step || 1);
    opt.theme = elem.dataset.theme || 'knob_theme';

    /*
     * diameter: diameter of knob
     * default: default value
     * min: minimum value
     * max: maximum value
     * step: amount of value step
     * minAngle: knob angle on minimum value
     * maxAngle: knob angle on maximum value
     * theme: css class name to use as knob theme
     */
    if (typeof opt.diameter == 'number' && opt.diameter >= 30 && opt.diameter <= 100) {
      diameter = opt.diameter;
    }
    if (typeof opt.min == 'number' && typeof opt.max == 'number' && opt.min < opt.max) {
      this.min = Math.floor(opt.min);
      this.max = Math.floor(opt.max);
    }
    if (typeof opt.default == 'number' && opt.default >= opt.min && opt.default <= opt.max) {
      this.value = Math.floor(opt.default);
    } else {
      this.value = this.min;
    }
    if (typeof opt.step == 'number' && opt.step <= (Math.abs(this.min) + Math.abs(this.max))) {
      this.step = Math.floor(opt.step);
    }
    if (typeof opt.minAngle == 'number' && typeof opt.maxAngle == 'number' &&
        opt.minAngle >= -180 && opt.maxAngle < 360 && opt.minAngle < opt.maxAngle) {
      this.maxAngle = Math.floor(opt.maxAngle);
      this.minAngle = Math.floor(opt.minAngle);
    }

    var root = new WebKitShadowRoot(elem);

    var html = TEMPLATE.replace(/##style##/, STYLE)
               .replace(/##swd_width##/, Math.floor(diameter))
               .replace(/##swd_height##/, Math.floor(diameter))
               .replace(/##swd_border-radius##/, Math.floor(diameter / 2))
               .replace(/##knob_width##/, Math.floor(diameter - 2))
               .replace(/##knob_height##/, Math.floor(diameter - 2))
               .replace(/##knob_border-radius##/, Math.floor(diameter / 2))
               .replace(/##ind_height##/, Math.floor(diameter * 0.375))
               .replace(/##ind_left##/, Math.floor(((diameter - 2) / 2) - 3))
               .replace(/##ind_transform-origin##/, Math.floor(diameter / 2));
    root.innerHTML = html;
    root.host.position = 'relative';

    this.val = root.querySelector('.value');
    this.knob = root.querySelector('.knob');

    this.update(this.value);
    var that = this;
    root.querySelector('.overlay').addEventListener('mousedown', function(e) {
      that.val.style.display = 'block';
      that.previous = e.y;
      handlers.move = mousemove.bind(that);
      handlers.up = mouseup.bind(that);
      window.addEventListener('mousemove', handlers.move, true);
      window.addEventListener('mouseup', handlers.up, true);
      e.preventDefault();
    });
  };
  knob.prototype = {
    update: function(value) {
      this.value = value < this.min ? this.min : value > this.max ? this.max : value;
      this.val.innerHTML = this.value;
      if (this.callback != null) this.callback(this.value);

      var amount = this.value - this.min;
      var valueRange = Math.abs(this.min) + Math.abs(this.max);
      var angleRange = Math.abs(this.minAngle) + Math.abs(this.maxAngle);
      var deg = Math.floor(amount / valueRange * angleRange );
      this.knob.style.webkitTransform = 'rotate('+(this.minAngle+deg)+'deg)';
    },
    bind: function(func) {
      if (typeof func == 'function') this.callback = func;
    },
    bindInput: function(elem) {
      if (elem.value) {
        this.callback = function(value) {
          elem.value = value;
        }
      }
    },
    unbind: function() {
      this.callback = null;
    }
  };

  return function(elem) {
    return new knob(elem);
  };
})();
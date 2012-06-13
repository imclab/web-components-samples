var Button = function(dom) {
  var STYLE =
	'div.button {'+
	  'position: relative;'+
	  'background-color: #D14836;'+
	  'background-image: -webkit-linear-gradient(top,#DD4B39,#D14836);'+
	  'border: 1px solid transparent;'+
	  'border-radius: 2px;'+
	  'display: inline-block;'+
	  'font-family: arial, sans-serif;'+
	  'font-weight: bold;'+
	  'font-size: 11px;'+
	  'border: 1px solid gray;'+
	  'margin: 0;'+
	  'padding: 0 8px;'+
	  'text-align: center;'+
	  'color: white;'+
	  'width: 97px;'+
	  'cursor: pointer;'+
	  'line-height: 27px;'+
	'}'+
	'div.button:hover {'+
	  'background-color: #C53727;'+
	  'background-image: -webkit-linear-gradient(top,#DD4B39,#C53727);'+
	  'border-color: #B0281A;'+
	'}'+
	'div.bubble {'+
	  'position: absolute;'+
	  'background-color: black;'+
	  'border: 1px solid #333;'+
	  'border-radius: 4px;'+
	  'width: 100px;'+
	  'top: 32px;'+
	  'left: 7px;'+
	  'text-align: center;'+
	  'display: none;'+
	'}'+
	'div.arrow {'+
	  'position: absolute;'+
	  'border: solid 5px black;'+
	  'border-color: transparent;'+
	  'border-bottom-color: black;'+
	  'line-height: 14px;'+
	  'top: 23px;'+
	  'left: 52px;'+
	  'width: 0;'+
	  'height: 0;'+
	  'display: none;'+
	'}';
  var TEMPLATE = '<style scoped>##style##</style>'+
	'<div class="button">'+
	  '<content select="span"></content>'+
	  '<div class="bubble">##text##</div>'+
	  '<div class="arrow"></div>'+
	'</div>';
  this.root = new WebKitShadowRoot(dom);
  this.root.innerHTML = TEMPLATE.replace(/##style##/g, STYLE).replace(/##text##/g, dom.title);
  this.root.host.addEventListener('click', this.onClick.bind(this));

  this.arrow = this.root.querySelector('div.arrow');
  this.bubble = this.root.querySelector('div.bubble');

  this.root.querySelector('div.button').addEventListener('mouseover', this.hover.bind(this));
  this.root.querySelector('div.button').addEventListener('mouseout', this.unhover.bind(this));
};
Button.prototype = {
  onClick: function(e) {
  	alert('clicked!');
  },
  hover: function(e) {
  	this.arrow.style.display = 'block';
  	this.bubble.style.display = 'block';
  },
  unhover: function(e) {
  	this.arrow.style.display = 'none';
  	this.bubble.style.display = 'none';
  }
};
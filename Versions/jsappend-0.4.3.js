/*
 * jsAppend v0.4.3 Beta
 * Authors:
 *     Grammatopoulos Athanasios - Vasileios
 *     Grammatopoulos Apostolos
 * License : The MIT License (MIT)
 */

(function(){
	// jsAppend :)
	var jsAppend;

	// If js supports apply
	if(Function.apply){
		jsAppend = function(){
			return jsAppend.core.apply(jsAppend, arguments);
		};
	}
	// For older js versions
	else{
		jsAppend = function(){
			switch(arguments.lenght){
				case 0:
					return jsAppend.core();
				case 2:
					return jsAppend.core(arguments[0], arguments[0]);
				default:
					return jsAppend.core(arguments[0]);
			}
		};
	}

	// Version
	jsAppend.version = "v0.4.2 Beta";

	// Redirect action
	jsAppend.core = function(x){
		// If no parameters return this
		if(x == undefined || !x){
			return this;
		}
		
		// If it is string
		else if(typeof x == "string"){
			// Trim code
			x = x.replace(/\s+/g, " ")
			// Trim space after action indicator
			.replace(/\*\s+/g, "*").replace(/#\s+/g, "#").replace(/\.\s+/g, ".")
			// Trim spaces inside selector
			.replace(/(\s+\[|\[\s+)/g, "[").replace(/\s+\]/g, "]")
			// Trim start-end spaces
			.replace(/^\s+|\s+$/g, "");

			// If body
			if(x == "body")
				return this.createJsAppendElement(document.body);
			
			// If *, Create a new Element
			else if(x[0] == "*"){
				return this.createJsAppendElement(x.substr(1));
			}

			// Get an element from the string path given
			else{
				// If reference element was given
				if(arguments.length > 1){
					var y = this.core(arguments[1]);
					if(y.jsAppendElement || y.jsAppendDocument)
						return this.resolveStringPath(x, y);
				}
				// Get element
				return this.resolveStringPath(x);
			}
		}

		// If it is jsAppendElement or jsAppendDocument
		else if(x.jsAppendElement || x.jsAppendDocument){
			return x;
		}

		// If it is HTML element
		else if(x.tagName && x.nodeName && x.ownerDocument && x.removeAttribute){	
			return this.createJsAppendElement(x);
		}
		
		// Given parameter can not be handled
		throw new Error("javascript library error\njsAppend: unknown parameters");
	};

	// Resolve string path
	jsAppend.resolveStringPath = function(x, y){

		// Split string path into string doms
		var doms = x.split(' ');

		// Set the head of the dom tree
		var path;
		// If there is a reference node
		if(y && y.jsAppendElement){
			path = y.element;
		}
		// Else start from document
		else{
			path = document;
		}

		// For now this is not a collection of elements
		var collection = false;

		// Start moving into the dom
		for(var i in doms){

			// If empty dom got to next
			if(doms[i] == "" || doms[i] == null)
				continue;

			// Check if path
			if(path == null){
				return null;
			}

			// If dom is based on its id
			if(doms[i][0] == "#"){

				// Try to enter path
				if(path.getElementById( doms[i].substr(1) )){
					path = path.getElementById( doms[i].substr(1) );
				}
				// Path dont exist
				else{
					path = null;
				}

			}

			// If dom is based on its className
			else if(doms[i][0] == "."){

				// If an element number is given
				if(doms[i].match(/\[\d+\]$/i)){
					// Get class name
					var className = doms[i].substr(1).replace(/\[\d+\]$/i,"").replace(/\./g," ");
					// Get element number
					var elementNumber = doms[i].match(/\[(\d+)\]$/i)[1];
					// Try to enter path
					if(path.getElementsByClassName(className) && path.getElementsByClassName(className)[elementNumber]){
						path = path.getElementsByClassName(className)[elementNumber];
					}
					// Path dont exist
					else{
						path = null;
					}
				}

				// If we deal with a collection
				else{
					// Get class name
					var className = doms[i].substr(1).replace(/\./g," ");
					//Try to enter path
					if(path.getElementsByClassName( className ) ){
						path = path.getElementsByClassName( className );
						collection = true;
					//Path dont exist
					}else{
						path = null;
					}
				}
			}
			
			// If dom is based on a tagName
			else{

				// If an element number is given
				if(doms[i].match(/\[\d+\]$/i)){
					// Get tag name
					var tagName = doms[i].replace(/\[\d+\]$/i,"");
					// Get element number
					var elementNumber = doms[i].match(/\[(\d+)\]$/i)[1];
					// Try to enter path
					if(path.getElementsByTagName(tagName) && path.getElementsByTagName(tagName)[elementNumber]){
						path = path.getElementsByTagName(tagName)[elementNumber];
					}
					// Path dont exist
					else{
						path = null;
					}
				}

				// If we deal with a collection
				else{
					// Try to enter path
					if(path.getElementsByTagName( doms[i] ) ){
						path = path.getElementsByTagName( doms[i] );
						collection = true;
					}
					//Path dont exist
					else{
						path=null;
					}
				}

			}

			// End of while
		}

		// If element exist convert it to jsAppend element
		if(path!=null && !collection){
			return this.createJsAppendElement(path);
		}
		// Return collection
		else if (collection){
			return this.createJsAppendElementCollection(path);
		}
		// Return anything else
		else{
			return path;
		}

	};

	// Create a new jsAppendElement
	jsAppend.createJsAppendElement = function(x){
		
		// If parameter is a type
		if(typeof x == "string"){
			// Create a jsAppend element
			return new this.JsAppendElement( document.createElement(x) );
		}

		// If parameter is an element
		else if(x && x.tagName && x.nodeName && x.ownerDocument && x.removeAttribute){
			// Create a jsAppend element
			return new this.JsAppendElement(x);
		}

		// Else error
		else {
			throw new Error("javascript library error\njsAppend: element can not be handled");
		}

	};

	// The JsAppendElement object
	jsAppend.JsAppendElement = (function(){
		// The object
		function JsAppendElement(element){
			// Save element
			this[0] = element;
			this.element = element;
			return this;
		};

		// The HTML element varible
		JsAppendElement.prototype[0] = null;
		JsAppendElement.prototype.element = null;
		// Fast return the HTML element
		JsAppendElement.prototype.DOM = function(){
			return this.element;
		}

		// Save jsAppend
		JsAppendElement.prototype.jsAppend = jsAppend;

		// JsAppendElement identify varible
		JsAppendElement.prototype.jsAppendElement = true;
		
		//Main HTML element attributes

		// The id attribute
		JsAppendElement.prototype.id = function(id){
			// return element's id
			if(id == undefined)
				return this.element.id;
			// set element's id
			this.element.id = id;
			return this;
		};

		// The class attribute
		JsAppendElement.prototype.class = function(className){
			//return element's class
			if(className == undefined)
				return this.element.className;
			//set element's class
			this.element.className = className;
			return this;
		};
		JsAppendElement.prototype.addClass = function(className){
			if(className && typeof className == "string" && className.replace(/^\s+|\s+$/g,"").length > 0){
				// Trim className
				className = className.replace(/^\s+|\s+$/g,"").replace(/\s+/g," ");
				if(this.element.className.split(" ").indexOf(className) >= 0)
					return;
				// If there isnt any other class
				if(this.element.className.length == 0){
					this.element.className = className;
				}
				// If there is
				else{
					this.element.className += " " + className;
				}
			}
			return this;
		};
		JsAppendElement.prototype.delClass = function(className){
			if(className && typeof className == "string" && className.replace(/^\s+|\s+$/g,"").length > 0){
				className = className.replace(/^\s+|\s+$/g,"").replace(/\s+/g," ");
				if(className.match(/\s/g)){
					className = className.split(" ");
					for(var i in className){
						this.delClass( className[i] );	
					}
				}else{
					this.element.className = this.element.className.replace(className,"").replace(/^\s+|\s+$/g,"").replace(/\s+/g," ");
				}
			}
			return this;
		};
		
		// The name attribute
		JsAppendElement.prototype.name = function(name){
			// return element's name
			if(name == undefined)
				return this.element.name;
			// set element's name
			this.element.name = name;
			return this;
		};

		// The src attribute
		JsAppendElement.prototype.src = function(src){
			// return element's src
			if(src == undefined)
				return this.element.src;
			// set element's src
			this.element.src = src;
			return this;
		};

		//The href attribute
		JsAppendElement.prototype.href = function(href){
			// return element's href
			if(href == undefined)
				return this.element.href;
			// set element's href
			this.element.href=href;
			return this;
		};

		// The title attribute
		JsAppendElement.prototype.title = function(title){
			// return element's title
			if(title==undefined)
				return this.element.title;
			// set element's title
			this.element.title=title;
			return this;
		};

		// The alt attribute
		JsAppendElement.prototype.alt = function(alt){
			//return element's alt
			if(alt == undefined)
				return this.element.alt;
			// set element's alt
			this.element.alt=alt;
			return this;
		};

		// The style attribute
		JsAppendElement.prototype.style = function(style){
			// return element's style
			if(style == undefined)
				return this.element.style;
			// set element's style
			this.element.setAttribute('style', style);
			return this;
		};
		JsAppendElement.prototype.addStyle = function(style){
			if(style && typeof style == "string" && style.replace(/^\s+|\s+$/g,"").length > 0){
				style=style.replace(/^\s+|\s+$/g,"").replace(/\s+/g," ");
				// If there isnt any other style
				if(this.element.getAttribute('style') == null){
					this.element.setAttribute('style', style);
				}
				// If there is
				else{
					var style = this.element.getAttribute('style') + style;
					this.element.setAttribute('style', style);
				}
			}
			return this;
		};

		// The type attribute
		JsAppendElement.prototype.type = function(type){
			// return element's type
			if(type == undefined)
				return this.element.type;
			// set element's type
			this.element.type = type;
			return this;
		};

		// The value attribute
		JsAppendElement.prototype.value = function(value){
			// return element's value
			if(value == undefined)
				return this.element.value;
			// set element's value
			this.element.value = value;
			return this;
		};

		// Main HTML element methods
		// CSS - Style return
		JsAppendElement.prototype.css = function(css){
			if(css == undefined)
				return this.style(css);
			return this.addStyle(css);
		};

		// The innerHTML
		JsAppendElement.prototype.html = function(innerHTML){
			// return element's innerHTML
			if(innerHTML == undefined)
				return this.element.innerHTML;
			// set element's innerHTML
			this.element.innerHTML = innerHTML;
			return this;
		};

		JsAppendElement.prototype.addHtml = function(innerHTML){
			// set element's innerHTML
			this.element.innerHTML += innerHTML;
			return this;
		};

		// The textContent
		JsAppendElement.prototype.text = function(textContent){
			// return element's textContent
			if(textContent == undefined)
				return this.element.textContent;
			// set element's textContent
			this.element.textContent = textContent;
			return this;
		};

		// The add textnode
		JsAppendElement.prototype.addText = function(text){
			// add a text on element
			this.element.appendChild(document.createTextNode(text));
			return this;
		};

		// The setAttribute - getAttribute - removeAttribute
		JsAppendElement.prototype.attr = JsAppendElement.prototype.setAttr = function(name, value){
			// return element's attribute
			if(value == undefined)
				return this.element.getAttribute(name);
			// set element's attribute
			this.element.setAttribute(name, value);
			return this;
		}
		JsAppendElement.prototype.getAttr = function(name){
			// return element's attribute
			return this.element.getAttribute(name);
		}
		JsAppendElement.prototype.delAttr = function(name){
			// remove element's attribute
			this.element.removeAttribute(name);
			return this;
		}

		// Data
		JsAppendElement.prototype.data = function(name, value){
			// return element's data
			if(value == undefined)
				return this.element.getAttribute("data-" + name);
			// set element's data
			this.element.setAttribute("data-" + name, value);
			return this;
		};
		JsAppendElement.prototype.delData = function(name){
			// Remove element's data
			this.element.removeAttribute("data-" + name);
			return this;
		};

		// Main element events	
		// Event to be added
		JsAppendElement.prototype.addEvent = function(theEvent, toTrigger, phase){
			if(toTrigger != undefined){
				if(phase == undefined || (phase != false && phase != true))
					phase = false;
				this.element.addEventListener(theEvent, toTrigger, phase);
			}
			return this;
		}

		// The onClick event
		JsAppendElement.prototype.click = function(toTrigger){
			return this.addEvent('click', toTrigger, false);
		};
		
		// The onMouseOver event
		JsAppendElement.prototype.mouseover = function(toTrigger){
			return this.addEvent('mouseover', toTrigger, false);
		};
		// The onMouseOut event
		JsAppendElement.prototype.mouseout = function(toTrigger){
			return this.addEvent('mouseout', toTrigger, false);
		};

		// Main element DOM positioning methods	
		// Position the element as an appendChild of an element
		JsAppendElement.prototype.appendTo = function(element){
			// if element is given
			if(element){
				// Position the element
				this.jsAppend.core(element).element.appendChild(this.element);
			}
			return this;
		};
		
		// Position the element as the first child of an element
		JsAppendElement.prototype.prependTo = function(element){
			// if element is given
			if(element){
				// Position the element
				var parent = this.jsAppend.core(element).element;
				parent.insertBefore(this.element, parent.firstChild);
			}
			return this;
		};
			
		// Return parentNode
		JsAppendElement.prototype.parent = function(){
			return this.jsAppend.core(this.element.parentNode);
		};

		// Position the element before an element
		JsAppendElement.prototype.beforeFrom = function(element){
			// if element is given
			if(element){
				// Find element
				var element = this.jsAppend.core(element).element;
				// Position the element
				element.parentNode.insertBefore(this.element, element); 
			}
			return this;
		};

		// Position the element after an element
		JsAppendElement.prototype.afterFrom = function(element){
			// if element is given
			if(element){
				// Find element
				var element = this.jsAppend.core(element).element;
				// Position the element
				element.parentNode.insertBefore(this.element, element.nextSibling); 
			}
			return this;
		};
		
		JsAppendElement.prototype.next = function(){
			var element = this.element;
			do{
				element = element.nextSibling;
			}while(element != null && element.nodeType != 1);
			return (element != null) ? this.jsAppend.core(element) : null;
		};
		
		// Remove element
		JsAppendElement.prototype.remove = function(){
			if(this.element && this.element.parentNode)
				this.element.parentNode.removeChild(this.element);
		};
		
		// Add a child element
		JsAppendElement.prototype.append = JsAppendElement.prototype.addChild = function(elements){
			// if element is given
			if(elements){
				// If many childs to be added
				if(elements instanceof Array){
					// For each child
					for (var i = 0; i < elements.length; i++){
						// Add child
						this.element.appendChild(this.jsAppend.core(elements[i]).element);
					}
				}else{
					// Add child
					this.element.appendChild(this.jsAppend.core(elements).element);
				}
			}
			return this;
		};
		
		// Add a child element as first child element
		JsAppendElement.prototype.prepend = function(element){
			// if element is given
			if(elements){
				// If many childs to be added
				if(elements instanceof Array){
					// For each child
					for (var i = element.length - 1; i >= 0; i--){
						// Add child
						this.element.insertBefore(this.jsAppend.core(elements[i]).element, this.element.firstChild);
					}
				}else{
					// Add child
					this.element.insertBefore(this.jsAppend.core(elements).element, this.element.firstChild);
				}
			}
			return this;
		};

		// Element display methods
		// Hide element
		JsAppendElement.prototype.hide = function(){
			if(this.element.style.display == "none")
				return;

			this.data("display-state", this.element.style.display);
			this.element.style.display = "none";
			return this;
		};

		// Show element
		JsAppendElement.prototype.show = function(){
			if(this.element.style.display != "none")
				return;

			var value = this.data("display-state");
			this.delData("display-state");
			this.element.style.display = (value)?value:"";
			return this;
		};
		JsAppendElement.prototype.showBlock = function(){
			this.element.style.display = "block";
			return this;
		};
		JsAppendElement.prototype.showInline = function(){
			this.element.style.display = "inline";
			return this;
		};

		// Fade in-out Functions
		// Cross Action functions
		JsAppendElement.prototype._fade = null;

		// Initialize fade object
		JsAppendElement.prototype._fadeInit = function(){
			// If fade object exists
			if(this._fade)
				// Return
				return;

			// Initialize fade object
			this._fade = {
				timeout : null,
				check : function(){
					if(this.timeout != null)
						clearTimeout(this.timeout);
				}
			};
		};

		// Translate fade speed
		JsAppendElement.prototype._fadeSpeed = function(speed){
			// Parse speed
			switch(speed){
				// If speed is a keyword
				case "slow" :return 750;
				case "mid" : return 500;
				case "fast" : return 250;

				// Speed is not a keyword
				default :
					// Spped is not a number
					if(isNaN(speed))
						return 500;
					// Speed is a number
					return speed;
			}
		};

		// FadeIn
		JsAppendElement.prototype.fadeIn = function(speed, callback){
			this._fadeInit();
			this._fade.check();
			var obj = this;
			this._fade.timeout = setTimeout(function(){
				obj.fadeInStart(speed, callback);
			}, 0);
			return this;
		};
		JsAppendElement.prototype.fadeInStart = function(speed, callback){
			this._fadeInit();
			this._fade.check();
			if(this._fade.anim && this._fade.anim.interval)
				clearInterval(this._fade.anim.interval);

			if(callback == undefined)
				callback = function(){};

			if(this.element.style.display != "none" && (this.element.style.opacity == 1 || this.element.style.opacity == "")){
				callback.call(this);
				return;
			}
			this.element.style.opacity = 0;
			this.show();

			var e = this;
			if(this._fade.anim)
				this._fade.anim.stop();
			this._fade.anim = jsAppend.animate(
				function(x){ if(!e.element)return; e.element.style.opacity = x; }
			, 0, 1, this._fadeSpeed(speed),
				function(){ if(!e.element)return; e.element.style.opacity = 1; callback.call(e); }
			);
			return this;
		};
				
		// FadeOut
		JsAppendElement.prototype.fadeOut = function(speed, callback){
			this._fadeInit();
			this._fade.check();
			var obj = this;
			this._fade.timeout = setTimeout(function(){
				obj.fadeOutStart(speed, callback);
			}, 0);
			return this;
		};
		JsAppendElement.prototype.fadeOutStart = function(speed, callback){
			this._fadeInit();
			this._fade.check()
			if(this._fade.anim && this._fade.anim.interval)
				clearInterval(this._fade.anim.interval);

			if(callback == undefined)
				callback = function(){};

			if(this.element.style.opacity == 0 && this.element.style.opacity != ""){
				callback.call(e);
				return;
			}
			this.element.style.opacity = 1;

			var e = this;
			if(this._fade.anim)
				this._fade.anim.stop();
			this._fade.anim = jsAppend.animate(
				function(x){ if(!e.element)return; e.element.style.opacity = x; }
			, 1, 0, this._fadeSpeed(speed),
				function(){ if(!e.element)return; e.hide(); e.element.style.opacity = 1; callback.call(e); }
			);
			return this;
		};

		// Stop Animation
		JsAppendElement.prototype.stop = function(){
			if(this._fade && this._fade.anim)
				this._fade.anim.stop();
		};

		return JsAppendElement;
	})();

	// Create a new jsAppendElementCollection
	jsAppend.createJsAppendElementCollection = function(x){
		
		// If parameter exist
		if(x){

			// Add properties
			x.each = function(callback){
				// For each element
				for (var i = 0; i < this.length; i++) {
					setTimeout((function(item, n){
						return function(){
							callback.apply(item, [n]);
						}
					})(this[i], i), 0);
				}
				return this;
			}
			
			return x;
		}

		// Else error
		else {
			throw new Error("javascript library error\njsAppend: collection can not be handled");
		}

	};

	// Animation Functions
	// Main Class
	jsAppend.animate = function(stepCallback, from, to , time, callback){
		if(stepCallback == undefined) return;
		if(callback == undefined) callback = function(){};
		// New Animation
		return new this.Animate( stepCallback, from, to , time, callback);
	};
	// Animate Class
	jsAppend.Animate = (function(){
		// Constructor
		var Animate = function(stepCallback, from, to , time, callback){
			// On step Callback
			this.stepCallback = stepCallback;
			// On end Callback
			this.callback = callback;

			// Define Step value
			this.step = (to - from) / time * this.frames;
			// Current value
			this.value = from;
			// Start value
			this.from = from;
			// Stop value
			this.to = to;

			var anim = this;
			this.interval = setInterval(function(){
				anim.onStep();
			}, this.frames);
		};

		// Frames
		Animate.prototype.frames = 60;

		// Step Action
		Animate.prototype.onStep = function(){
			if((this.value >= this.to && this.from < this.to) || (this.value <= this.to && this.from > this.to)){
				this.onEnd();
			}
			else{
				this.stepCallback(this.value);
				this.value += this.step;
			}
		};
		Animate.prototype.onEnd = function(){
			clearInterval(this.interval);
			this.stepCallback(this.to);
			this.callback();
		}

		// Stop animation
		Animate.prototype.stop = function(){
			clearInterval(this.interval);
		};

		return Animate;
	})();

	// Other functions
	// Generate random number
	jsAppend.rand = function(from,to,step){
		// Given parameter can not be handled
		if(from == undefined || isNaN(from) || (to != undefined && isNaN(to) || (step != undefined && isNaN(step))) )
			throw new Error("javascript library error\njsAppend: rand() unknown parameters");

		//if some parameters are missing use default
		if(!to){
			to = from;
			from = 0;
		}
		//if no step is given use default
		if(!step) step = 1;

		//Random from one number
		if(step > to - from)
			return from;

		//Sent the random
		return (Math.floor(Math.random() * ((to / step) + 1)) * step) + from;
	};

	// Trim a string
	jsAppend.trim = function(str){
		return str.replace(/\s+/g," ").replace(/^\s+|\s+$/g,"");
	};

	// Page document functions
	jsAppend.page = {
		// Return page width
		width : function(){
			if(document && document.body && document.body.clientWidth)
				return document.body.clientWidth;
			else if(document && document.documentElement && document.documentElement.clientWidth)
				return document.documentElement.clientWidth;
			else if(window && window.innerWidth)
				return window.innerWidth;
			else
				return 0;
		},
		// Return page height
		height : function(){
			if(document && document.body && document.body.clientHeight)
				return document.body.clientHeight;
			else if(document && document.documentElement && document.documentElement.clientHeight)
				return document.documentElement.clientHeight;
			else if(window && window.innerHeight)
				return window.innerWidth;
			else
				return 0;
		}
	};

	// Store conflicts
	var conflicts = {
		jA : undefined,
		jsAppend : undefined,
		$ : undefined
	};
	// Get conflicts
	var refreshConflicts = function(){
		if(window.jA != undefined && window.jA != jsAppend)
			conflicts.jA = window.jA;
		if(window.jsAppend != undefined && window.jsAppend != jsAppend)
			conflicts.jsAppend = window.jsAppend;
		if(window.$ != undefined && window.$ != jsAppend)
			conflicts.$ = window.$;
	};
	jsAppend.noConflict = function(avoid){
		// Try not to conflict with other libs
		if(avoid === true){
			if(conflicts.jA != undefined)
				window.jA = conflicts.jA;
			if(conflicts.$ != undefined)
				window.$ = conflicts.$;
		}
		// Override 
		else if(avoid === false){
			refreshConflicts();
			window.jA = window.jsAppend = window.$ = jsAppend;
		}
		// Return conflicts
		return conflicts;
	};

	// Save Conflicts
	refreshConflicts();

	// Override "jA" and "jsAppend"
	window.jA = window.jsAppend = jsAppend;
	// Override "$" if it is undefined
	if(window.$ == undefined)
		window.$ = jsAppend;
})();

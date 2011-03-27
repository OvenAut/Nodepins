/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				script = document.createElement( "script" );

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						// We have to add a catch block for
						// IE prior to 8 or else the finally
						// block will never get executed
						catch (e) {
							throw e;
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var lastIndex = arguments.length,
			deferred = lastIndex <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( lastIndex > 1 ) {
			var array = slice.call( arguments, 0 ),
				count = lastIndex,
				iCallback = function( index ) {
					return function( value ) {
						array[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
						if ( !( --count ) ) {
							deferred.resolveWith( promise, array );
						}
					};
				};
			while( ( lastIndex-- ) ) {
				object = array[ lastIndex ];
				if ( object && jQuery.isFunction( object.promise ) ) {
					object.promise().then( iCallback(lastIndex), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( promise, array );
			}
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		noCloneEvent: true,
		noCloneChecked: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	input.checked = true;
	jQuery.support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	var _scriptEval = null;
	jQuery.support.scriptEval = function() {
		if ( _scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				_scriptEval = true;
				delete window[ id ];
			} else {
				_scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return _scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery._data( elem, "handle" );

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, "events");

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent !== document && !parent.parentNode ) {
			return;
		}
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			},
			teardown: function() {
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ),
			length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		var pos = POS.test( selectors ) ?
			jQuery( selectors, context || this.context ) : null;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique(ret) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes(src, dest) {
	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	var nodeName = dest.nodeName.toLowerCase();

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	dest.clearAttributes();

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	dest.mergeAttributes(src);

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );
	
	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		// Return the cloned set
		return clone;
},
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, "<$1></$2>");

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// Make sure that NaN and null values aren't set. See: #7116
			if ( typeof value === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
}

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /(?:^file|^widget|\-extension):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rucHeaders = /(^|\-)([a-z])/g,
	rucHeadersFunc = function( _, $1, $2 ) {
		return $1 + $2.toUpperCase();
	},
	rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from document.location if document.domain has been set
try {
	ajaxLocation = document.location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() );

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

//Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
} );

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		crossDomain: null,
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						requestHeaders[ name.toLowerCase().replace( rucHeaders, rucHeadersFunc ) ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( !s.crossDomain ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			requestHeaders[ "Content-Type" ] = s.contentType;
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				requestHeaders[ "If-Modified-Since" ] = jQuery.lastModified[ ifModifiedKey ];
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				requestHeaders[ "If-None-Match" ] = jQuery.etag[ ifModifiedKey ];
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		requestHeaders.Accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
			s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
			s.accepts[ "*" ];

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// If we see an array here, it is empty and should be treated as an empty
		// object
		if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			for ( var name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|()\?\?()/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var dataIsString = ( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonpCallback ||
		originalSettings.jsonp != null ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				dataIsString && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2",
			cleanUp = function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( previous ) ) {
					window[ jsonpCallback ]( responseContainer[ 0 ] );
				}
			};

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( dataIsString ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Install cleanUp function
		jqXHR.then( cleanUp, cleanUp );

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
} );




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
} );




var // #5280: next active xhr id and list of active xhrs' callbacks
	xhrId = jQuery.now(),
	xhrCallbacks,

	// XHR used to determine supports properties
	testXHR;

// #5280: Internet Explorer will keep connections alive if we don't abort on unload
function xhrOnUnloadAbort() {
	jQuery( window ).unload(function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Test if we can create an xhr object
testXHR = jQuery.ajaxSettings.xhr();
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
testXHR = undefined;

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// Requested-With header
					// Not set for crossDomain requests with no content
					// (see why at http://trac.dojotoolkit.org/ticket/9486)
					// Won't change header if already provided
					if ( !( s.crossDomain && !s.hasContent ) && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									delete xhrCallbacks[ handle ];
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						// Create the active xhrs callbacks list if needed
						// and attach the unload handler
						if ( !xhrCallbacks ) {
							xhrCallbacks = {};
							xhrOnUnloadAbort();
						}
						// Add to list of active xhrs callbacks
						handle = xhrId++;
						xhr.onreadystatechange = xhrCallbacks[ handle ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery._data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
					jQuery._data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur();

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || ( jQuery.cssNumber[ name ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;

		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


window.jQuery = window.$ = jQuery;
})(window);/*
 * Raphaël 2.0.0 - JavaScript Vector Library
 *
 * Copyright (c) 2011 Dmitry Baranovskiy (http://raphaeljs.com)
 * Copyright (c) 2011 Sencha Labs (http://sencha.com)
 * Licensed under the MIT (http://raphaeljs.com/license.html) license.
 */
(function () {
    /*\
     * Raphael
     [ method ]
     **
     * Creates a canvas object on which to draw.
     * You must do this first, as all future calls to drawing methods
     * from this instance will be bound to this canvas.
     > Parameters
     **
     - container (HTMLElement|string) DOM element or its ID which is going to be a parent for drawing surface
     - width (number)
     - height (number)
     * or
     - x (number)
     - y (number)
     - width (number)
     - height (number)
     * or
     - all (array) (first 3 or 4 elements in the array are equal to [containerID, width, height] or [x, y, width, height]. The rest are element descriptions in format {type: type, <attributes>})
     * or
     - onReadyCallback (function) function that is going to be called on DOM ready event. You can also subscribe to this event via Eve’s “DOMLoad” event. In this case method returns `undefined`.
     = (object) @Paper
     > Usage
     | // Each of the following examples create a canvas
     | // that is 320px wide by 200px high.
     | // Canvas is created at the viewport’s 10,50 coordinate.
     | var paper = Raphael(10, 50, 320, 200);
     | // Canvas is created at the top left corner of the #notepad element
     | // (or its top right corner in dir="rtl" elements)
     | var paper = Raphael(document.getElementById("notepad"), 320, 200);
     | // Same as above
     | var paper = Raphael("notepad", 320, 200);
     | // Image dump
     | var set = Raphael(["notepad", 320, 200, {
     |     type: "rect",
     |     x: 10,
     |     y: 10,
     |     width: 25,
     |     height: 25,
     |     stroke: "#f00"
     | }, {
     |     type: "text",
     |     x: 30,
     |     y: 40,
     |     text: "Dump"
     | }]);
    \*/
    function R(first) {
        if (R.is(first, "function")) {
            return eve.on("DOMload", first);
        } else if (R.is(first, array)) {
            var a = first,
                cnv = create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set(),
                i = 0,
                ii = a.length,
                j;
            for (; i < ii; i++) {
                j = a[i] || {};
                elements[has](j.type) && res.push(cnv[j.type]().attr(j));
            }
            return res;
        }
        return create[apply](R, arguments);
    }
    R.version = "2.0.0";
    var separator = /[, ]+/,
        elements = {circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1},
        formatrg = /\{(\d+)\}/g,
        proto = "prototype",
        has = "hasOwnProperty",
        g = {
            doc: document,
            win: window
        },
        oldRaphael = {
            was: Object.prototype[has].call(g.win, "Raphael"),
            is: g.win.Raphael
        },
        Paper = function () {},
        paperproto,
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in g.doc,
        E = "",
        S = " ",
        Str = String,
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend".split(S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        lowerCase = Str.prototype.toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        pow = math.pow,
        PI = math.PI,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object.prototype.toString,
        paper = {},
        push = "push",
        ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1},
        bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        ms = " progid:DXImageTransform.Microsoft",
        upperCase = Str.prototype.toUpperCase,
        availableAttrs = {"arrow-end": "none", "arrow-start": "none", blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rx: 0, ry: 0, src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", transform: "", width: 0, x: 0, y: 0},
        availableAnimAttrs = {blur: nu, "clip-rect": "csv", cx: nu, cy: nu, fill: "colour", "fill-opacity": nu, "font-size": nu, height: nu, opacity: nu, path: "path", r: nu, rx: nu, ry: nu, stroke: "colour", "stroke-opacity": nu, "stroke-width": nu, transform: "transform", width: nu, x: nu, y: nu},
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1},
        p2s = /,?([achlmqrstvxz]),?/gi,
        pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
        radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        sortByKey = function (a, b) {
            return a.key - b.key;
        },
        sortByNumber = function (a, b) {
            return a - b;
        },
        fun = function () {},
        pipe = function (x) {
            return x;
        },
        rectPath = function (x, y, w, h, r) {
            if (r) {
                return [["M", x + r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, -r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, -r, -r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, -r], ["z"]];
            }
            return [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        },
        ellipsePath = function (x, y, rx, ry) {
            if (ry == null) {
                ry = rx;
            }
            return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
        },
        getPath = {
            path: function (el) {
                return el.attr("path");
            },
            circle: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.r);
            },
            ellipse: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.rx, a.ry);
            },
            rect: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height, a.r);
            },
            image: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height);
            },
            text: function (el) {
                var bbox = el._getBBox();
                return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
            }
        },
        mapPath = function (path, matrix) {
            if (!matrix) {
                return path;
            }
            var x, y, i, j, pathi;
            path = path2curve(path);
            for (i = 0, ii = path.length; i < ii; i++) {
                pathi = path[i];
                for (j = 1, jj = pathi.length; j < jj; j += 2) {
                    x = matrix.x(pathi[j], pathi[j + 1]);
                    y = matrix.y(pathi[j], pathi[j + 1]);
                    pathi[j] = x;
                    pathi[j + 1] = y;
                }
            }
            return path;
        };

    /*\
     * Raphael.type
     [ property (string) ]
     **
     * Can be “SVG”, “VML” or empty, depending on browser support.
    \*/
    R.type = (g.win.SVGAngle || g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = g.doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return R.type = E;
        }
        d = null;
    }
    /*\
     * Raphael.svg
     [ property (boolean) ]
     **
     * `true` if browser supports SVG.
    \*/
    /*\
     * Raphael.vml
     [ property (boolean) ]
     **
     * `true` if browser supports VML.
    \*/
    R.svg = !(R.vml = R.type == "VML");
    paperproto = Paper.prototype = R.prototype;
    /*\
     * Paper.customAttributes
     [ property (object) ]
     **
     * If you have a set of attributes that you would like to represent
     * as a function of some number you can do it easily with custom attributes:
     > Usage
     | paper.customAttributes.hue = function (num) {
     |     num = num % 1;
     |     return {fill: "hsb(" + num + ", .75, 1)"};
     | };
     | // Custom attribute “hue” will change fill
     | // to be given hue with fixed saturation and brightness.
     | // Now you can use it like this:
     | var c = paper.circle(10, 10, 10).attr({hue: .45});
     | // or even like this:
     | c.animate({hue: 1}, 1e3);
     | 
     | // You could also create custom attribute
     | // with multiple parameters:
     | paper.customAttributes.hsb = function (h, s, b) {
     |     return {fill: "hsb(" + [h, s, b].join(",") + ")"};
     | };
     | c.attr({hsb: ".5 .8 1"});
     | c.animate({hsb: "1 0 .5"}, 1e3);
    \*/
    paperproto.customAttributes = {};
    R._id = 0;
    R._oid = 0;
    /*\
     * Raphael.fn
     [ property (object) ]
     **
     * You can add your own method to the canvas. For example if you want to draw a pie chart,
     * you can create your own pie chart function and ship it as a Raphaël plugin. To do this
     * you need to extend the `Raphael.fn` object. Please note that you can create your own namespaces
     * inside the `fn` object — methods will be run in the context of canvas anyway. You should alter
     * the `fn` object before a Raphaël instance is created, otherwise it will take no effect.
     > Usage
     | Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
     |     return this.path( ... );
     | };
     | // or create namespace
     | Raphael.fn.mystuff = {
     |     arrow: function () {…},
     |     star: function () {…},
     |     // etc…
     | };
     | var paper = Raphael(10, 10, 630, 480);
     | // then use it
     | paper.arrow(10, 10, 30, 30, 5).attr({fill: "#f00"});
     | paper.mystuff.arrow();
     | paper.mystuff.star();
    \*/
    R.fn = {};
    /*\
     * Raphael.is
     [ method ]
     **
     * Handfull replacement for `typeof` operator.
     > Parameters
     - o (…) any object or primitive
     - type (string) name of the type, i.e. “string”, “function”, “number”, etc.
     = (boolean) is given value is of given type
    \*/
    R.is = function (o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        return  (type == "null" && o === null) ||
                (type == typeof o) ||
                (type == "object" && o === Object(o)) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                objectToString.call(o).slice(8, -1).toLowerCase() == type;
    };
    /*\
     * Raphael.angle
     [ method ]
     **
     * Returns angle between two or three points
     > Parameters
     - x1 (number) x coord of first point
     - y1 (number) y coord of first point
     - x2 (number) x coord of second point
     - y2 (number) y coord of second point
     - x3 (number) #optional x coord of third point
     - y3 (number) #optional y coord of third point
     = (number) angle in degrees.
    \*/
    R.angle = function (x1, y1, x2, y2, x3, y3) {
        if (x3 == null) {
            var x = x1 - x2,
                y = y1 - y2;
            if (!x && !y) {
                return 0;
            }
            return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
        } else {
            return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
        }
    };
    /*\
     * Raphael.rad
     [ method ]
     **
     * Transform angle to radians
     > Parameters
     - deg (number) angle in degrees
     = (number) angle in radians.
    \*/
    R.rad = function (deg) {
        return deg % 360 * PI / 180;
    };
    /*\
     * Raphael.deg
     [ method ]
     **
     * Transform angle to degrees
     > Parameters
     - deg (number) angle in radians
     = (number) angle in degrees.
    \*/
    R.deg = function (rad) {
        return rad * 180 / PI % 360;
    };
    /*\
     * Raphael.snapTo
     [ method ]
     **
     * Snaps given value to given grid.
     > Parameters
     - values (array|number) given array of values or step of the grid
     - value (number) value to adjust
     - tolerance (number) #optional tolerance for snapping. Default is `10`.
     = (number) adjusted value.
    \*/
    R.snapTo = function (values, value, tolerance) {
        tolerance = R.is(tolerance, "finite") ? tolerance : 10;
        if (R.is(values, array)) {
            var i = values.length;
            while (i--) if (abs(values[i] - value) <= tolerance) {
                return values[i];
            }
        } else {
            values = +values;
            var rem = value % values;
            if (rem < tolerance) {
                return value - rem;
            }
            if (rem > values - tolerance) {
                return value - rem + values;
            }
        }
        return value;
    };
    
    var createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        var r = math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });

    /*\
     * Raphael.setWindow
     [ method ]
     **
     * Used when you need to draw in `&lt;iframe>`. Switched window to the iframe one.
     > Parameters
     - newwin (window) new window object
    \*/
    R.setWindow = function (newwin) {
        eve("setWindow", R, g.win, newwin);
        g.win = newwin;
        g.doc = g.win.document;
        if (initWin) {
            initWin(g.win);
        }
    };
    // colour utilities
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            var bod;
            try {
                var docum = new ActiveXObject("htmlfile");
                docum.write("<body>");
                docum.close();
                bod = docum.body;
            } catch(e) {
                bod = createPopup().document.body;
            }
            var range = bod.createTextRange();
            toHex = cacher(function (color) {
                try {
                    bod.style.color = Str(color).replace(trim, E);
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value.toString(16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = g.doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            g.doc.body.appendChild(i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return g.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    },
    hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    hsltoString = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    },
    prepareRGB = function (r, g, b) {
        if (g == null && R.is(r, "object") && "r" in r && "g" in r && "b" in r) {
            b = r.b;
            g = r.g;
            r = r.r;
        }
        if (g == null && R.is(r, string)) {
            var clr = R.getRGB(r);
            r = clr.r;
            g = clr.g;
            b = clr.b;
        }
        if (r > 1 || g > 1 || b > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }
        
        return [r, g, b];
    },
    packageRGB = function (r, g, b, o) {
        r *= 255;
        g *= 255;
        b *= 255;
        var rgb = {
            r: r,
            g: g,
            b: b,
            hex: R.rgb(r, g, b),
            toString: rgbtoString
        };
        R.is(o, "finite") && (rgb.opacity = o);
        return rgb;
    };
    /*\
     * Raphael.hsb2rgb
     [ method ]
     **
     * Converts HSB values to RGB object.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - v (number) value or brightness
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue,
     o     hex (string) color in HTML/CSS format: #••••••
     o }
    \*/
    R.hsb2rgb = function (h, s, v, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "b" in h) {
            v = h.b;
            s = h.s;
            h = h.h;
            o = h.o;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = v * s;
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = v - C;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    /*\
     * Raphael.hsl2rgb
     [ method ]
     **
     * Converts HSL values to RGB object.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - l (number) luminosity
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue,
     o     hex (string) color in HTML/CSS format: #••••••
     o }
    \*/
    R.hsl2rgb = function (h, s, l, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "l" in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        if (h > 1 || s > 1 || l > 1) {
            h /= 360;
            s /= 100;
            l /= 100;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = 2 * s * (l < .5 ? l : 1 - l);
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = l - C / 2;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    /*\
     * Raphael.rgb2hsb
     [ method ]
     **
     * Converts RGB values to HSB object.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (object) HSB object in format:
     o {
     o     h (number) hue
     o     s (number) saturation
     o     b (number) brightness
     o }
    \*/
    R.rgb2hsb = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];

        var H, S, V, C;
        V = mmax(r, g, b);
        C = V - mmin(r, g, b);
        H = (C == 0 ? null :
             V == r ? (g - b) / C :
             V == g ? (b - r) / C + 2 :
                      (r - g) / C + 4);
        H = (H % 6) * 60;
        S = C == 0 ? 0 : C / V;
        return {h: H, s: S, b: V, toString: hsbtoString};
    };
    /*\
     * Raphael.rgb2hsl
     [ method ]
     **
     * Converts RGB values to HSL object.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (object) HSL object in format:
     o {
     o     h (number) hue
     o     s (number) saturation
     o     l (number) luminosity
     o }
    \*/
    R.rgb2hsl = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];

        var H, S, L, M, m, C;
        M = mmax(r, g, b);
        m = mmin(r, g, b);
        C = M - m;
        H = (C == 0 ? null :
             M == r ? (g - b) / C :
             M == g ? (b - r) / C + 2 :
                      (r - g) / C + 4);
        H = (H % 6) * 60;
        L = (M + m) / 2;
        S = (C == 0 ? 0 :
             L < .5 ? C / (2 * L) :
                      C / (2 - 2 * L));
        return {h: H, s: S, l: L, toString: hsltoString};
    };
    R._path2string = function () {
        return this.join(",").replace(p2s, "$1");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array.prototype.slice.call(arguments, 0),
                args = arg.join("\u2400"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count.length >= 1e3 && delete cache[count.shift()];
            count.push(args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }

    function preload(src, f) {
        var img = g.doc.createElement("img");
        img.style.cssText = "position:absolute;left:-9999em;top-9999em";
        img.onload = function () {
            f.call(this);
            this.onload = null;
            g.doc.body.removeChild(this);
        };
        img.onerror = function () {
            g.doc.body.removeChild(this);
        };
        g.doc.body.appendChild(img);
        img.src = src;
    }

    /*\
     * Raphael.getRGB
     [ method ]
     **
     * Parses colour string as RGB object
     > Parameters
     - colour (string) colour string in one of formats:
     # <ul>
     #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
     #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
     #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
     #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
     #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
     #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
     #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
     #     <li>hsl(•••, •••, •••) — same as hsb</li>
     #     <li>hsl(•••%, •••%, •••%) — same as hsb</li>
     # </ul>
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue
     o     hex (string) color in HTML/CSS format: #••••••,
     o     error (boolean) true if string can’t be parsed
     o }
    \*/
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            values,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                values = rgb[4].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            }
            if (rgb[5]) {
                values = rgb[5].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsb2rgb(red, green, blue, opacity);
            }
            if (rgb[6]) {
                values = rgb[6].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsl2rgb(red, green, blue, opacity);
            }
            rgb = {r: red, g: green, b: blue};
            rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
            R.is(opacity, "finite") && (rgb.opacity = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }, R);
    /*\
     * Raphael.hsb
     [ method ]
     **
     * Converts HSB values to hex representation of the colour.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - b (number) value or brightness
     = (string) hex representation of the colour.
    \*/
    R.hsb = cacher(function (h, s, b) {
        return R.hsb2rgb(h, s, b).hex;
    });
    /*\
     * Raphael.hsl
     [ method ]
     **
     * Converts HSL values to hex representation of the colour.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - l (number) luminosity
     = (string) hex representation of the colour.
    \*/
    R.hsl = cacher(function (h, s, l) {
        return R.hsl2rgb(h, s, l).hex;
    });
    /*\
     * Raphael.rgb
     [ method ]
     **
     * Converts RGB values to hex representation of the colour.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (string) hex representation of the colour.
    \*/
    R.rgb = cacher(function (r, g, b) {
        return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
    });
    /*\
     * Raphael.getColor
     [ method ]
     **
     * On each call returns next colour in the spectrum. To reset it back to red call @Raphael.getColor.reset
     > Parameters
     - value (number) #optional brightness, default is `0.75`
     = (string) hex representation of the colour.
    \*/
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    /*\
     * Raphael.getColor.reset
     [ method ]
     **
     * Resets spectrum position for @Raphael.getColor back to red.
    \*/
    R.getColor.reset = function () {
        delete this.start;
    };

    /*\
     * Raphael.parsePathString
     [ method ]
     **
     * Utility method
     **
     * Parses given path string into an array of arrays of path segments.
     > Parameters
     - pathString (string|array) path string or array of segments (in the last case it will be returned straight away)
     = (array) array of segments.
    \*/
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data.length) {
            Str(pathString).replace(pathCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                while (params.length >= paramCounts[name]) {
                    data.push([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data.toString = R._path2string;
        return data;
    });
    /*\
     * Raphael.parseTransformString
     [ method ]
     **
     * Utility method
     **
     * Parses given path string into an array of transformations.
     > Parameters
     - TString (string|array) transform string or array of transformations (in the last case it will be returned straight away)
     = (array) array of transformations.
    \*/
    R.parseTransformString = cacher(function (TString) {
        if (!TString) {
            return null;
        }
        var paramCounts = {r: 3, s: 4, t: 2, m: 6},
            data = [];
        if (R.is(TString, array) && R.is(TString[0], array)) { // rough assumption
            data = pathClone(TString);
        }
        if (!data.length) {
            Str(TString).replace(tCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                data.push([name][concat](params));
            });
        }
        data.toString = R._path2string;
        return data;
    });
    /*\
     * Raphael.findDotsAtSegment
     [ method ]
     **
     * Utility method
     **
     * Find dot coordinates on the given cubic bezier curve at the given t.
     > Parameters
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     - t (number) position on the curve (0..1)
     = (object) point information in format:
     o {
     o     x: (number) x coordinate of the point
     o     y: (number) y coordinate of the point
     o     m: {
     o         x: (number) x coordinate of the left anchor
     o         y: (number) y coordinate of the left anchor
     o     }
     o     n: {
     o         x: (number) x coordinate of the right anchor
     o         y: (number) y coordinate of the right anchor
     o     }
     o     start: {
     o         x: (number) x coordinate of the start of the curve
     o         y: (number) y coordinate of the start of the curve
     o     }
     o     end: {
     o         x: (number) x coordinate of the end of the curve
     o         y: (number) y coordinate of the end of the curve
     o     }
     o     alpha: (number) angle of the curve derivative at the point
     o }
    \*/
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            x = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
            ax = (1 - t) * p1x + t * c1x,
            ay = (1 - t) * p1y + t * c1y,
            cx = (1 - t) * c2x + t * p2x,
            cy = (1 - t) * c2y + t * p2y,
            alpha = (90 - math.atan2(mx - nx, my - ny) * 180 / PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray.length; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i].length; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res.toString = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res.push(["M", x, y]);
            }
            for (var i = start, ii = pathArray.length; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i].length;
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray.length; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = res[i][res[i].length - 2];
                        my = res[i][res[i].length - 1];
                    default:
                        x = res[i][res[i].length - 2];
                        y = res[i][res[i].length - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(9));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res).join().split(",");
                var newres = [];
                for (var i = 0, ii = res.length; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i].length > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi.length) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                };
            for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg.length,
                    seg2len = p2 && seg2.length;
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient.length; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots.push(dot);
            }
            for (i = 1, ii = dots.length - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function (x, y, w, h) {
            var container;
            container = h == null && !R.is(x, "object") ? g.doc.getElementById(x) : x;
            if (container == null) {
                return;
            }
            if (container.tagName) {
                if (y == null) {
                    return {
                        container: container,
                        width: container.style.pixelWidth || container.offsetWidth,
                        height: container.style.pixelHeight || container.offsetHeight
                    };
                } else {
                    return {container: container, width: y, height: w};
                }
            }
            return {container: 1, x: x, y: y, width: w, height: h};
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add[has](prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f[apply](that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            plugins.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
        tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        },
        extractTransform = function (el, tstr) {
            if (tstr == null) {
                return el._.transform;
            }
            tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
            var tdata = R.parseTransformString(tstr),
                deg = 0,
                dx = 0,
                dy = 0,
                sx = 1,
                sy = 1,
                _ = el._,
                m = new Matrix;
            _.transform = tdata || [];
            if (tdata) {
                for (var i = 0, ii = tdata.length; i < ii; i++) {
                    var t = tdata[i],
                        tlen = t.length,
                        bb;
                    t[0] = Str(t[0]).toLowerCase();
                    if (t[0] == "t" && tlen == 3) {
                        m.translate(t[1], t[2]);
                    } else if (t[0] == "r") {
                        if (tlen == 2) {
                            bb = bb || el.getBBox(1);
                            m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            deg += t[1];
                        } else if (tlen == 4) {
                            m.rotate(t[1], t[2], t[3]);
                            deg += t[1];
                        }
                    } else if (t[0] == "s") {
                        if (tlen == 2 || tlen == 3) {
                            bb = bb || el.getBBox(1);
                            m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            sx *= t[1];
                            sy *= t[tlen - 1];
                        } else if (tlen == 5) {
                            m.scale(t[1], t[2], t[3], t[4]);
                            sx *= t[1];
                            sy *= t[2];
                        }
                    } else if (t[0] == "m" && tlen == 7) {
                        m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                    }
                    _.dirtyT = 1;
                    el.matrix = m;
                }
            }

            el.matrix = m;

            _.sx = sx;
            _.sy = sy;
            _.deg = deg;
            _.dx = dx = m.m[0][2];
            _.dy = dy = m.m[1][2];

            if (sx == 1 && sy == 1 && !deg && _.bbox) {
                _.bbox.x += +dx;
                _.bbox.y += +dy;
            } else {
                _.dirtyT = 1;
            }
        },
        getEmpty = function (item) {
            switch (item[0]) {
                case "t": return ["t", 0, 0];
                case "m": return ["m", 1, 0, 0, 1, 0, 0];
                case "r": if (item.length == 4) {
                    return ["r", 0, item[2], item[3]];
                } else {
                    return ["r", 0];
                }
                case "s": if (item.length == 5) {
                    return ["s", 1, 1, item[3], item[4]];
                } else if (item.length == 3) {
                    return ["s", 1, 1];
                } else {
                    return ["s", 1];
                }
            }
        },
        equaliseTransform = function (t1, t2) {
            t1 = R.parseTransformString(t1) || [];
            t2 = R.parseTransformString(t2) || [];
            var maxlength = mmax(t1.length, t2.length),
                from = [],
                to = [],
                i = 0, j, jj,
                tt1, tt2;
            for (; i < maxlength; i++) {
                tt1 = t1[i] || getEmpty(t2[i]);
                tt2 = t2[i] || getEmpty(tt1);
                if (    (tt1[0] != tt2[0]) ||
                        (tt1[0] == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3])) ||
                        (tt1[0] == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4]))
                    ) {
                    return;
                }
                from[i] = [];
                to[i] = [];
                for (j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++) {
                    j in tt1 && (from[i][j] = tt1[j]);
                    j in tt2 && (to[i][j] = tt2[j]);
                }
            }
            return {
                from: from,
                to: to
            };
        };
    /*\
     * Raphael.pathToRelative
     [ method ]
     **
     * Utility method
     **
     * Converts path to relative form
     > Parameters
     - pathString (string|array) path string or array of segments
     = (array) array of segments.
    \*/
    R.pathToRelative = pathToRelative;
    /*\
     * Raphael.path2curve
     [ method ]
     **
     * Utility method
     **
     * Converts path to a new path where all segments are cubic bezier curves.
     > Parameters
     - pathString (string|array) path string or array of segments
     = (array) array of segments.
    \*/
    R.path2curve = path2curve;
    // Matrix
    // var m = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
    function Matrix(a, b, c, d, e, f) {
        if (a != null) {
            this.m = [[a, c, e], [b, d, f], [0, 0, 1]];
        } else {
            this.m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
    }
    var matrixproto = Matrix.prototype;
    matrixproto.add = function (a, b, c, d, e, f) {
        var out = [[], [], []],
            matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
            x, y, z, res;

        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                res = 0;
                for (z = 0; z < 3; z++) {
                    res += this.m[x][z] * matrix[z][y];
                }
                out[x][y] = res;
            }
        }
        this.m = out;
    };
    matrixproto.invert = function () {
        var a = this.m[0][0],
            b = this.m[1][0],
            c = this.m[0][1],
            d = this.m[1][1],
            e = this.m[0][2],
            f = this.m[1][2],
            x = a * d - b * c;
        return new Matrix(d / x, -b / x, -c / x, a / x, (c * f - d * e) / x, (b * e - a * f) / x);
    };
    matrixproto.clone = function () {
        var a = this.m[0][0],
            b = this.m[1][0],
            c = this.m[0][1],
            d = this.m[1][1],
            e = this.m[0][2],
            f = this.m[1][2];
        return new Matrix(a, b, c, d, e, f);
    };
    matrixproto.translate = function (x, y) {
        this.add(1, 0, 0, 1, x, y);
    };
    matrixproto.scale = function (x, y, cx, cy) {
        y == null && (y = x);
        this.add(1, 0, 0, 1, cx, cy);
        this.add(x, 0, 0, y, 0, 0);
        this.add(1, 0, 0, 1, -cx, -cy);
    };
    matrixproto.rotate = function (a, x, y) {
        a = R.rad(a);
        var cos = +math.cos(a).toFixed(9),
            sin = +math.sin(a).toFixed(9);
        this.add(cos, sin, -sin, cos, x, y);
        this.add(1, 0, 0, 1, -x, -y);
    };
    matrixproto.x = function (x, y) {
        return x * this.m[0][0] + y * this.m[0][1] + this.m[0][2];
    };
    matrixproto.y = function (x, y) {
        return x * this.m[1][0] + y * this.m[1][1] + this.m[1][2];
    };
    matrixproto.get = function (i, j) {
        return +this.m[i][j].toFixed(4);
    };
    matrixproto.toString = function () {
        return R.svg ?
            "matrix(" + [this.get(0, 0), this.get(1, 0), this.get(0, 1), this.get(1, 1), this.get(0, 2), this.get(1, 2)].join() + ")" :
            [this.get(0, 0), this.get(0, 1), this.get(1, 0), this.get(1, 1), 0, 0].join();
    };
    matrixproto.toFilter = function () {
        return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0, 0) +
            ", M12=" + this.get(0, 1) + ", M21=" + this.get(1, 0) + ", M22=" + this.get(1, 1) +
            ", Dx=" + this.get(0, 2) + ", Dy=" + this.get(1, 2) + ", sizingmedthod='auto expand')";
    };
    matrixproto.offset = function () {
        return [this.m[0][2].toFixed(4), this.m[1][2].toFixed(4)];
    };

    R.Matrix = Matrix;

    // SVG
    if (R.svg) {
        var xlink = "http://www.w3.org/1999/xlink",
            markers = {
                block: "M5,0 0,2.5 5,5z",
                classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
                diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
                open: "M6,1 1,3.5 6,6",
                oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
            },
            markerCounter = {};
        R.toString = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
        };
        var $ = function (el, attr) {
            if (attr) {
                if (typeof el == "string") {
                    el = $(el);
                }
                for (var key in attr) if (attr[has](key)) {
                    if (key.substring(0, 6) == "xlink:") {
                        el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
                    } else {
                        el[setAttribute](key, Str(attr[key]));
                    }
                }
            } else {
                el = g.doc.createElementNS("http://www.w3.org/2000/svg", el);
                el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
            }
            return el;
        },
        thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas.appendChild(el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        },
        gradients = {},
        rgGrad = /^url\(#(.*)\)$/,
        removeGradientFill = function (node, paper) {
            var oid = node.getAttribute(fillString);
            oid = oid && oid.match(rgGrad);
            if (oid && !--gradients[oid[1]]) {
                delete gradients[oid[1]];
                paper.defs.removeChild(g.doc.getElementById(oid[1]));
            }
        },
        addGradientFill = function (element, gradient) {
            var type = "linear",
                id = element.id + gradient,
                fx = .5, fy = .5,
                o = element.node,
                SVG = element.paper,
                s = o.style,
                el = g.doc.getElementById(id);
            if (!el) {
                gradient = Str(gradient).replace(radial_gradient, function (all, _fx, _fy) {
                    type = "radial";
                    if (_fx && _fy) {
                        fx = toFloat(_fx);
                        fy = toFloat(_fy);
                        var dir = ((fy > .5) * 2 - 1);
                        pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                            (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                            fy != .5 &&
                            (fy = fy.toFixed(5) - 1e-5 * dir);
                    }
                    return E;
                });
                gradient = gradient.split(/\s*\-\s*/);
                if (type == "linear") {
                    var angle = gradient.shift();
                    angle = -toFloat(angle);
                    if (isNaN(angle)) {
                        return null;
                    }
                    var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))],
                        max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
                    vector[2] *= max;
                    vector[3] *= max;
                    if (vector[2] < 0) {
                        vector[0] = -vector[2];
                        vector[2] = 0;
                    }
                    if (vector[3] < 0) {
                        vector[1] = -vector[3];
                        vector[3] = 0;
                    }
                }
                var dots = parseDots(gradient);
                if (!dots) {
                    return null;
                }
                if (element.gradient) {
                    SVG.defs.removeChild(element.gradient);
                    delete element.gradient;
                }

                el = $(type + "Gradient", {id: id});
                element.gradient = el;
                $(el, type == "radial" ? {
                    fx: fx,
                    fy: fy
                } : {
                    x1: vector[0],
                    y1: vector[1],
                    x2: vector[2],
                    y2: vector[3],
                    gradientTransform: element.matrix.invert()
                });
                SVG.defs.appendChild(el);
                for (var i = 0, ii = dots.length; i < ii; i++) {
                    el.appendChild($("stop", {
                        offset: dots[i].offset ? dots[i].offset : i ? "100%" : "0%",
                        "stop-color": dots[i].color || "#fff"
                    }));
                }
            }
            $(o, {
                fill: "url(#" + id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        },
        updatePosition = function (o) {
            var bbox = o.getBBox(1);
            $(o.pattern, {patternTransform: o.matrix.invert() + " translate(" + bbox.x + "," + bbox.y + ")"});
        },
        addArrow = function (o, value, isEnd) {
            if (o.type == "path") {
                var values = Str(value).toLowerCase().split("-"),
                    p = o.paper,
                    se = isEnd ? "end" : "start",
                    node = o.node,
                    attrs = o.attrs,
                    stroke = attrs["stroke-width"],
                    i = values.length,
                    type = "classic",
                    from,
                    to,
                    dx,
                    refX,
                    attr,
                    w = 3,
                    h = 3,
                    t = 5;
                while (i--) {
                    switch (values[i]) {
                        case "block":
                        case "classic":
                        case "oval":
                        case "diamond":
                        case "open":
                        case "none":
                            type = values[i];
                            break;
                        case "wide": h = 5; break;
                        case "narrow": h = 2; break;
                        case "long": w = 5; break;
                        case "short": w = 2; break;
                    }
                }
                if (type == "open") {
                    w += 2;
                    h += 2;
                    t += 2;
                    dx = 1;
                    refX = isEnd ? 4 : 1;
                    attr = {
                        fill: "none",
                        stroke: attrs.stroke
                    };
                } else {
                    refX = dx = w / 2;
                    attr = {
                        fill: attrs.stroke,
                        stroke: "none"
                    };
                }
                if (o._.arrows) {
                    if (isEnd) {
                        o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
                        o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
                    } else {
                        o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
                        o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
                    }
                } else {
                    o._.arrows = {};
                }
                if (type != "none") {
                    var pathId = "raphael-marker-" + type,
                        markerId = "raphael-marker-" + se + type + w + h;
                    if (!g.doc.getElementById(pathId)) {
                        p.defs.appendChild($($("path"), {
                            "stroke-linecap": "round",
                            d: markers[type],
                            id: pathId
                        }));
                        markerCounter[pathId] = 1;
                    } else {
                        markerCounter[pathId]++;
                    }
                    var marker = g.doc.getElementById(markerId),
                        use;
                    if (!marker) {
                        marker = $($("marker"), {
                            id: markerId,
                            markerHeight: h,
                            markerWidth: w,
                            orient: "auto",
                            refX: refX,
                            refY: h / 2
                        });
                        use = $($("use"), {
                            "xlink:href": "#" + pathId,
                            transform: (isEnd ? " rotate(180 " + w / 2 + " " + h / 2 + ") " : S) + "scale(" + w / t + "," + h / t + ")",
                            "stroke-width": 1 / ((w / t + h / t) / 2)
                        });
                        marker.appendChild(use);
                        p.defs.appendChild(marker);
                        markerCounter[markerId] = 1;
                    } else {
                        markerCounter[markerId]++;
                        use = marker.getElementsByTagName("use")[0];
                    }
                    $(use, attr);
                    var delta = dx * (type != "diamond" && type != "oval");
                    if (isEnd) {
                        from = o._.arrows.startdx * stroke || 0;
                        to = R.getTotalLength(attrs.path) - delta * stroke;
                    } else {
                        from = delta * stroke;
                        to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                    }
                    attr = {};
                    attr["marker-" + se] = "url(#" + markerId + ")";
                    if (to || from) {
                        attr.d = Raphael.getSubpath(attrs.path, from, to);
                    }
                    $(node, attr);
                    o._.arrows[se + "Path"] = pathId;
                    o._.arrows[se + "Marker"] = markerId;
                    o._.arrows[se + "dx"] = delta;
                    o._.arrows[se + "Type"] = type;
                    o._.arrows[se + "String"] = value;
                } else {
                    if (isEnd) {
                        from = o._.arrows.startdx * stroke || 0;
                        to = R.getTotalLength(attrs.path) - from;
                    } else {
                        from = 0;
                        to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                    }
                    o._.arrows[se + "Path"] && $(node, {d: Raphael.getSubpath(attrs.path, from, to)});
                    delete o._.arrows[se + "Path"];
                    delete o._.arrows[se + "Marker"];
                    delete o._.arrows[se + "dx"];
                    delete o._.arrows[se + "Type"];
                    delete o._.arrows[se + "String"];
                }
                for (attr in markerCounter) if (markerCounter[has](attr) && !markerCounter[attr]) {
                    var item = g.doc.getElementById(attr);
                    item && item.parentNode.removeChild(item);
                }
            }
        },
        setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                addDashes = function (o, value) {
                    value = dasharray[lowerCase.call(value)];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [],
                            i = value.length;
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes.join(",")});
                    }
                };
            for (var att in params) {
                if (params[has](att)) {
                    if (!availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                        case "blur":
                            o.blur(value);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var pn = node.parentNode;
                            if (lowerCase.call(pn.tagName) != "a") {
                                var hl = $("a");
                                pn.insertBefore(hl, node);
                                hl.appendChild(node);
                                pn = hl;
                            }
                            if (att == "target" && value == "blank") {
                                pn.setAttributeNS(xlink, "show", "new");
                            } else {
                                pn.setAttributeNS(xlink, att, value);
                            }
                            break;
                        case "cursor":
                            node.style.cursor = value;
                            break;
                        case "transform":
                            o.transform(value);
                            break;
                        case "arrow-start":
                            addArrow(o, value);
                            break;
                        case "arrow-end":
                            addArrow(o, value, 1);
                            break;
                        case "clip-rect":
                            var rect = Str(value).split(separator);
                            if (rect.length == 4) {
                                o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                                var el = $("clipPath"),
                                    rc = $("rect");
                                el.id = createUUID();
                                $(rc, {
                                    x: rect[0],
                                    y: rect[1],
                                    width: rect[2],
                                    height: rect[3]
                                });
                                el.appendChild(rc);
                                o.paper.defs.appendChild(el);
                                $(node, {"clip-path": "url(#" + el.id + ")"});
                                o.clip = rc;
                            }
                            if (!value) {
                                var clip = g.doc.getElementById(node.getAttribute("clip-path").replace(/(^url\(#|\)$)/g, E));
                                clip && clip.parentNode.removeChild(clip);
                                $(node, {"clip-path": E});
                                delete o.clip;
                            }
                        break;
                        case "path":
                            if (o.type == "path") {
                                $(node, {d: value ? attrs.path = pathToAbsolute(value) : "M0,0"});
                                o._.dirty = 1;
                                if (o._.arrows) {
                                    "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                    "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                                }
                            }
                            break;
                        case "width":
                            node[setAttribute](att, value);
                            o._.dirty = 1;
                            if (attrs.fx) {
                                att = "x";
                                value = attrs.x;
                            } else {
                                break;
                            }
                        case "x":
                            if (attrs.fx) {
                                value = -attrs.x - (attrs.width || 0);
                            }
                        case "rx":
                            if (att == "rx" && o.type == "rect") {
                                break;
                            }
                        case "cx":
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            o._.dirty = 1;
                            break;
                        case "height":
                            node[setAttribute](att, value);
                            o._.dirty = 1;
                            if (attrs.fy) {
                                att = "y";
                                value = attrs.y;
                            } else {
                                break;
                            }
                        case "y":
                            if (attrs.fy) {
                                value = -attrs.y - (attrs.height || 0);
                            }
                        case "ry":
                            if (att == "ry" && o.type == "rect") {
                                break;
                            }
                        case "cy":
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            o._.dirty = 1;
                            break;
                        case "r":
                            if (o.type == "rect") {
                                $(node, {rx: value, ry: value});
                            } else {
                                node[setAttribute](att, value);
                            }
                            o._.dirty = 1;
                            break;
                        case "src":
                            if (o.type == "image") {
                                node.setAttributeNS(xlink, "href", value);
                            }
                            break;
                        case "stroke-width":
                            if (o._.sx != 1 || o._.sy != 1) {
                                value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
                            }
                            if (o.paper._vbSize) {
                                value *= o.paper._vbSize;
                            }
                            node[setAttribute](att, value);
                            if (attrs["stroke-dasharray"]) {
                                addDashes(o, attrs["stroke-dasharray"]);
                            }
                            if (o._.arrows) {
                                "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                            }
                            break;
                        case "stroke-dasharray":
                            addDashes(o, value);
                            break;
                        case fillString:
                            var isURL = Str(value).match(ISURL);
                            if (isURL) {
                                el = $("pattern");
                                var ig = $("image");
                                el.id = createUUID();
                                $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                $(ig, {x: 0, y: 0, "xlink:href": isURL[1]});
                                el.appendChild(ig);

                                (function (el) {
                                    preload(isURL[1], function () {
                                        var w = this.offsetWidth,
                                            h = this.offsetHeight;
                                        $(el, {width: w, height: h});
                                        $(ig, {width: w, height: h});
                                        o.paper.safari();
                                    });
                                })(el);
                                o.paper.defs.appendChild(el);
                                node.style.fill = "url(#" + el.id + ")";
                                $(node, {fill: "url(#" + el.id + ")"});
                                o.pattern = el;
                                o.pattern && updatePosition(o);
                                break;
                            }
                            var clr = R.getRGB(value);
                            if (!clr.error) {
                                delete params.gradient;
                                delete attrs.gradient;
                                !R.is(attrs.opacity, "undefined") &&
                                    R.is(params.opacity, "undefined") &&
                                    $(node, {opacity: attrs.opacity});
                                !R.is(attrs["fill-opacity"], "undefined") &&
                                    R.is(params["fill-opacity"], "undefined") &&
                                    $(node, {"fill-opacity": attrs["fill-opacity"]});
                            } else if ((o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value)) {
                                if ("opacity" in attrs || "fill-opacity" in attrs) {
                                    var gradient = g.doc.getElementById(node.getAttribute(fillString).replace(/^url\(#|\)$/g, E));
                                    if (gradient) {
                                        var stops = gradient.getElementsByTagName("stop");
                                        $(stops[stops.length - 1], {"stop-opacity": ("opacity" in attrs ? attrs.opacity : 1) * ("fill-opacity" in attrs ? attrs["fill-opacity"] : 1)});
                                    }
                                }
                                attrs.gradient = value;
                                attrs.fill = "none";
                                break;
                            }
                            clr[has]("opacity") && $(node, {"fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                        case "stroke":
                            clr = R.getRGB(value);
                            node[setAttribute](att, clr.hex);
                            att == "stroke" && clr[has]("opacity") && $(node, {"stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                            if (att == "stroke" && o._.arrows) {
                                "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                            }
                            break;
                        case "gradient":
                            (o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value);
                            break;
                        case "opacity":
                            if (attrs.gradient && !attrs[has]("stroke-opacity")) {
                                $(node, {"stroke-opacity": value > 1 ? value / 100 : value});
                            }
                            // fall
                        case "fill-opacity":
                            if (attrs.gradient) {
                                gradient = g.doc.getElementById(node.getAttribute(fillString).replace(/^url\(#|\)$/g, E));
                                if (gradient) {
                                    stops = gradient.getElementsByTagName("stop");
                                    $(stops[stops.length - 1], {"stop-opacity": value});
                                }
                                break;
                            }
                        default:
                            att == "font-size" && (value = toInt(value, 10) + "px");
                            var cssrule = att.replace(/(\-.)/g, function (w) {
                                return upperCase.call(w.substring(1));
                            });
                            node.style[cssrule] = value;
                            o._.dirty = 1;
                            node[setAttribute](att, value);
                            break;
                    }
                }
            }

            tuneText(o, params);
        },
        leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
 
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = Str(params.text).split("\n"),
                    tspans = [],
                    tspan;
                for (var i = 0, ii = texts.length; i < ii; i++) if (texts[i]) {
                    tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan.appendChild(g.doc.createTextNode(texts[i]));
                    node.appendChild(tspan);
                    tspans[i] = tspan;
                }
            } else {
                tspans = node.getElementsByTagName("tspan");
                for (i = 0, ii = tspans.length; i < ii; i++) {
                    i && $(tspans[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            el._.dirty = 1;
            var bb = el._getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && R.is(dif, "finite") && $(tspans[0], {dy: a.y + dif});
        },
        Element = function (node, svg) {
            var X = 0,
                Y = 0;
            /*\
             * Element.node
             [ property (object) ]
             **
             * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
             > Usage
             | // draw a circle at coordinate 10,10 with radius of 10
             | var c = paper.circle(10, 10, 10);
             | c.node.onclick = function () {
             |     c.attr("fill", "red");
             | };
            \*/
            this[0] = this.node = node;
            /*\
             * Element.raphael
             [ property (object) ]
             **
             * Internal reference to @Raphael object. In case it is not available.
             > Usage
             | Raphael.el.red = function () {
             |     var hsb = this.paper.raphael.rgb2hsb(this.attr("fill"));
             |     hsb.h = 1;
             |     this.attr({fill: this.paper.raphael.hsb2rgb(hsb).hex});
             | }
            \*/
            node.raphael = true;
            /*\
             * Element.id
             [ property (number) ]
             **
             * Unique id of the element. Especially usesful when you want to listen to events of the element, 
             * because all events are fired in format `<module>.<action>.<id>`. Also useful for @Paper.getById method.
            \*/
            this.id = R._oid++;
            node.raphaelid = this.id;
            this.matrix = new Matrix;
            this.realPath = null;
            /*\
             * Element.paper
             [ property (object) ]
             **
             * Internal reference to “paper” where object drawn. Mainly for use in plugins and element extensions.
             > Usage
             | Raphael.el.cross = function () {
             |     this.attr({fill: "red"});
             |     this.paper.path("M10,10L50,50M50,10L10,50")
             |         .attr({stroke: "red"});
             | }
            \*/
            this.paper = svg;
            this.attrs = this.attrs || {};
            this._ = {
                transform: [],
                sx: 1,
                sy: 1,
                deg: 0,
                dx: 0,
                dy: 0,
                dirty: 1
            };
            !svg.bottom && (svg.bottom = this);
            /*\
             * Element.prev
             [ property (object) ]
             **
             * Reference to the previous element in the hierarchy.
            \*/
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            /*\
             * Element.next
             [ property (object) ]
             **
             * Reference to the next element in the hierarchy.
            \*/
            this.next = null;
        },
        elproto = Element.prototype;
        /*\
         * Element.rotate
         [ method ]
         **
         * Adds rotation by given angle around given point to the list of
         * transformations of the element.
         > Parameters
         - deg (number) angle in degrees
         - cx (number) #optional x coordinate of the centre of rotation
         - cy (number) #optional y coordinate of the centre of rotation
         * If cx & cy aren’t specified centre of the shape is used as a point of rotation.
         = (object) @Element
        \*/
        elproto.rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            deg = Str(deg).split(separator);
            if (deg.length - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            (cy == null) && (cx = cy);
            if (cx == null || cy == null) {
                var bbox = this.getBBox(1);
                cx = bbox.x + bbox.width / 2;
                cy = bbox.y + bbox.height / 2;
            }
            this.transform(this._.transform.concat([["r", deg, cx, cy]]));
            return this;
        };
        /*\
         * Element.scale
         [ method ]
         **
         * Adds scale by given amount relative to given point to the list of
         * transformations of the element.
         > Parameters
         - sx (number) horisontal scale amount
         - sy (number) vertical scale amount
         - cx (number) #optional x coordinate of the centre of scale
         - cy (number) #optional y coordinate of the centre of scale
         * If cx & cy aren’t specified centre of the shape is used instead.
         = (object) @Element
        \*/
        elproto.scale = function (sx, sy, cx, cy) {
            if (this.removed) {
                return this;
            }
            sx = Str(sx).split(separator);
            if (sx.length - 1) {
                sy = toFloat(sx[1]);
                cx = toFloat(sx[2]);
                cy = toFloat(sx[3]);
            }
            sx = toFloat(sx[0]);
            (sy == null) && (sy = sx);
            (cy == null) && (cx = cy);
            if (cx == null || cy == null) {
                var bbox = this.getBBox(1);
            }
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
            return this;
        };
        /*\
         * Element.translate
         [ method ]
         **
         * Adds translation by given amount to the list of transformations of the element.
         > Parameters
         - dx (number) horisontal shift
         - dy (number) vertical shift
         = (object) @Element
        \*/
        elproto.translate = function (dx, dy) {
            if (this.removed) {
                return this;
            }
            dx = Str(dx).split(separator);
            if (dx.length - 1) {
                dy = toFloat(dx[1]);
            }
            dx = toFloat(dx[0]) || 0;
            dy = +dy || 0;
            this.transform(this._.transform.concat([["t", dx, dy]]));
            return this;
        };
        /*\
         * Element.transform
         [ method ]
         **
         * Adds transformation to the element which is separate to other attributes,
         * i.e. translation doesn’t change `x` or `y` of the rectange. The format
         * of transformation string is similar to the path string syntax:
         | "t100,100r30,100,100s2,2,100,100r45s1.5"
         * Each letter is a command. There are four commands: `t` is for translate, `r` is for rotate, `s` is for
         * scale and `m` is for matrix.
         *
         * So, the example line above could be read like “translate by 100, 100; rotate 30° around 100, 100; scale twice around 100, 100;
         * rotate 45° around centre; scale 1.5 times relative to centre”. As you can see rotate and scale commands have origin
         * coordinates as optional parameters, the default is the centre point of the element.
         * Matrix accepts six parameters.
         > Usage
         | var el = paper.rect(10, 20, 300, 200);
         | // translate 100, 100, rotate 45°, translate -100, 0
         | el.transform("t100,100r45t-100,0");
         | // if you want you can append or prepend transformations
         | el.transform("...t50,50");
         | el.transform("s2...");
         | // or even wrap
         | el.transform("t50,50...t-50-50");
         | // to reset transformation call method with empty string
         | el.transform("");
         | // to get current value call it without parameters
         | console.log(el.transform());
         > Parameters
         - tstr (string) #optional transformation string
         * If tstr isn’t specified
         = (string) current transformation string
         * else
         = (object) @Element
        \*/
        elproto.transform = function (tstr) {
            var _ = this._;
            if (!tstr) {
                return _.transform;
            }
            extractTransform(this, tstr);

            this.clip && $(this.clip, {transform: this.matrix.invert()});
            // this.gradient && $(this.gradient, {gradientTransform: this.matrix.invert()});
            this.pattern && updatePosition(this);
            this.node && $(this.node, {transform: this.matrix});
            
            if (_.sx != 1 || _.sy != 1) {
                var sw = this.attrs[has]("stroke-width") ? this.attrs["stroke-width"] : 1;
                this.attr({"stroke-width": sw});
            }

            return this;
        };
        /*\
         * Element.hide
         [ method ]
         **
         * Makes element invisible. See @Element.show.
         = (object) @Element
        \*/
        elproto.hide = function () {
            !this.removed && this.paper.safari(this.node.style.display = "none");
            return this;
        };
        /*\
         * Element.show
         [ method ]
         **
         * Makes element visible. See @Element.hide.
         = (object) @Element
        \*/
        elproto.show = function () {
            !this.removed && this.paper.safari(this.node.style.display = "");
            return this;
        };
        /*\
         * Element.remove
         [ method ]
         **
         * Removes element form the paper.
        \*/
        elproto.remove = function () {
            if (this.removed) {
                return;
            }
            eve.unbind("*.*." + this.id);
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        elproto._getBBox = function () {
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            hide && this.hide();
            return bbox;
        };
        /*\
         * Element.attr
         [ method ]
         **
         * Sets the attributes of the element.
         > Parameters
         - attrName (string) attribute’s name
         - value (string) value
         * or
         - params (object) object of name/value pairs
         * or
         - attrName (string) attribute’s name
         * or
         - attrNames (array) in this case method returns array of current values for given attribute names
         = (object) @Element if attrsName & value or params are passed in.
         = (...) value of the attribute if only attrsName is passed in.
         = (array) array of values of the attribute if attrsNames is passed in.
         = (object) object of attributes if nothing is passed in.
         > Possible parameters
         # <p>Please refer to the <a href="http://www.w3.org/TR/SVG/" title="The W3C Recommendation for the SVG language describes these properties in detail.">SVG specification</a> for an explanation of these parameters.</p>
         o arrow-end (string) arrowhead on the end of the path. The format for string is `<type>[-<width>[-<length>]]`. Possible types: `classic`, `block`, `open`, `oval`, `diamond`, `none`, width: `wide`, `narrow`, `midium`, length: `long`, `short`, `midium`.
         o clip-rect (string) comma or space separated values: x, y, width and height
         o cursor (string) CSS type of the cursor
         o cx (number)
         o cy (number)
         o fill (string) colour, gradient or image
         o fill-opacity (number)
         o font (string)
         o font-family (string)
         o font-size (number) font size in pixels
         o font-weight (string)
         o height (number)
         o href (string) URL, if specified element behaves as hyperlink
         o opacity (number)
         o path (string) SVG path string format
         o r (number)
         o rx (number)
         o ry (number)
         o src (string) image URL, only works for @Element.image element
         o stroke (string) stroke colour
         o stroke-dasharray (string) [“”, “`-`”, “`.`”, “`-.`”, “`-..`”, “`. `”, “`- `”, “`--`”, “`- .`”, “`--.`”, “`--..`”]
         o stroke-linecap (string) [“`butt`”, “`square`”, “`round`”]
         o stroke-linejoin (string) [“`bevel`”, “`round`”, “`miter`”]
         o stroke-miterlimit (number)
         o stroke-opacity (number)
         o stroke-width (number) stroke width in pixels, default is '1'
         o target (string) used with href
         o text (string) contents of the text element. Use `\n` for multiline text
         o text-anchor (string) [“`start`”, “`middle`”, “`end`”], default is “`middle`”
         o title (string) will create tooltip with a given text
         o transform (string) see @Element.transform
         o width (number)
         o x (number)
         o y (number)
         > Gradients
         * Linear gradient format: “`‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`90-#fff-#000`” – 90°
         * gradient from white to black or “`0-#fff-#f00:20-#000`” – 0° gradient from white via red (at 20%) to black.
         *
         * radial gradient: “`r[(‹fx›, ‹fy›)]‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`r#fff-#000`” –
         * gradient from white to black or “`r(0.25, 0.75)#fff-#000`” – gradient from white to black with focus point
         * at 0.25, 0.75. Focus point coordinates are in 0..1 range. Radial gradients can only be applied to circles and ellipses.
         > Path String
         # <p>Please refer to <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path’s data attribute’s format are described in the SVG specification.">SVG documentation regarding path string</a>. Raphaël fully supports it.</p>
         > Colour Parsing
         # <ul>
         #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
         #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
         #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
         #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
         #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
         #     <li>rgba(•••, •••, •••, •••) — red, green and blue channels’ values: (“<code>rgba(200,&nbsp;100,&nbsp;0, .5)</code>”)</li>
         #     <li>rgba(•••%, •••%, •••%, •••%) — same as above, but in %: (“<code>rgba(100%,&nbsp;175%,&nbsp;0%, 50%)</code>”)</li>
         #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
         #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
         #     <li>hsba(•••, •••, •••, •••) — same as above, but with opacity</li>
         #     <li>hsl(•••, •••, •••) — almost the same as hsb, see <a href="http://en.wikipedia.org/wiki/HSL_and_HSV" title="HSL and HSV - Wikipedia, the free encyclopedia">Wikipedia page</a></li>
         #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
         #     <li>hsla(•••, •••, •••) — same as above, but with opacity</li>
         #     <li>Optionally for hsb and hsl you could specify hue as a degree: “<code>hsl(240deg,&nbsp;1,&nbsp;.5)</code>” or, if you want to go fancy, “<code>hsl(240°,&nbsp;1,&nbsp;.5)</code>”</li>
         # </ul>
        \*/
        elproto.attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                res.transform = this._.transform;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                if (name == "transform") {
                    return this._.transform;
                }
                if (name in this.attrs) {
                    return this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    return this.paper.customAttributes[name].def;
                } else {
                    return availableAttrs[name];
                }
            }
            if (value == null && R.is(name, array)) {
                var values = {};
                for (var j = 0, jj = name.length; j < jj; j++) {
                    values[name[j]] = this.attr(name[j]);
                }
                return values;
            }
            if (value != null) {
                var params = {};
                params[name] = value;
            } else if (name != null && R.is(name, "object")) {
                params = name;
            }
            for (var key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                var par = this.paper.customAttributes[key].apply(this, [][concat](params[key]));
                this.attrs[key] = params[key];
                for (var subkey in par) if (par[has](subkey)) {
                    params[subkey] = par[subkey];
                }
            }
            setFillAndStroke(this, params);
            return this;
        };
        /*\
         * Element.toFront
         [ method ]
         **
         * Moves the element so it is the closest to the viewer’s eyes, on top of other elements.
         = (object) @Element
        \*/
        elproto.toFront = function () {
            if (this.removed) {
                return this;
            }
            this.node.parentNode.appendChild(this.node);
            var svg = this.paper;
            svg.top != this && tofront(this, svg);
            return this;
        };
        /*\
         * Element.toBack
         [ method ]
         **
         * Moves the element so it is the furthest from the viewer’s eyes, behind other elements.
         = (object) @Element
        \*/
        elproto.toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
                var svg = this.paper;
            }
            return this;
        };
        /*\
         * Element.insertAfter
         [ method ]
         **
         * Inserts current object after the given one.
         = (object) @Element
        \*/
        elproto.insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[element.length - 1].node;
            if (node.nextSibling) {
                node.parentNode.insertBefore(this.node, node.nextSibling);
            } else {
                node.parentNode.appendChild(this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        /*\
         * Element.insertBefore
         [ method ]
         **
         * Inserts current object before the given one.
         = (object) @Element
        \*/
        elproto.insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[0].node;
            node.parentNode.insertBefore(this.node, node);
            insertbefore(this, element, this.paper);
            return this;
        };
        elproto.blur = function (size) {
            // Experimental. No Safari support. Use it on your own risk.
            var t = this;
            if (+size !== 0) {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                t.attrs.blur = size;
                fltr.id = createUUID();
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                t.paper.defs.appendChild(fltr);
                t._blur = fltr;
                $(t.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (t._blur) {
                    t._blur.parentNode.removeChild(t._blur);
                    delete t._blur;
                    delete t.attrs.blur;
                }
                t.node.removeAttribute("filter");
            }
        };
        var theCircle = function (svg, x, y, r) {
            var el = $("circle");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        },
        theRect = function (svg, x, y, w, h, r) {
            var el = $("rect");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        },
        theEllipse = function (svg, x, y, rx, ry) {
            var el = $("ellipse");
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        },
        theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(xlink, "href", src);
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        },
        theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas.appendChild(el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        },
        setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas[setAttribute]("width", this.width);
            this.canvas[setAttribute]("height", this.height);
            if (this._viewBox) {
                this.setViewBox.apply(this, this._viewBox);
            }
            return this;
        },
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg"),
                css = "overflow:hidden;";
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                height: height,
                version: 1.1,
                width: width,
                xmlns: "http://www.w3.org/2000/svg"
            });
            if (container == 1) {
                cnvs.style.cssText = css + "position:absolute;left:" + x + "px;top:" + y + "px";
                g.doc.body.appendChild(cnvs);
            } else {
                cnvs.style.cssText = css;
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container.appendChild(cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            plugins.call(container, container, R.fn);
            container.clear();
            return container;
        },
        setViewBox = function (x, y, w, h, fit) {
            eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
            var size = mmax(w / this.width, h / this.height),
                top = this.top,
                aspectRatio = fit ? "meet" : "xMinYMin",
                vb,
                sw;
            if (x == null) {
                if (this._vbSize) {
                    size = 1;
                }
                delete this._vbSize;
                vb = "0 0 " + this.width + S + this.height;
            } else {
                this._vbSize = size;
                vb = x + S + y + S + w + S + h;
            }
            $(this.canvas, {
                viewBox: vb,
                preserveAspectRatio: aspectRatio
            });
            while (size && top) {
                sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
                top.attr({"stroke-width": sw});
                top._.dirty = 1;
                top._.dirtyT = 1;
                top = top.prev;
            }
            this._viewBox = [x, y, w, h, !!fit];
            return this;
        };
        /*\
         * Paper.clear
         [ method ]
         **
         * Clears the paper, i.e. removes all the elements.
        \*/
        paperproto.clear = function () {
            eve("clear", this);
            var c = this.canvas;
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
            this.bottom = this.top = null;
            (this.desc = $("desc")).appendChild(g.doc.createTextNode("Created with Rapha\xebl " + R.version));
            c.appendChild(this.desc);
            c.appendChild(this.defs = $("defs"));
        };
        /*\
         * Paper.remove
         [ method ]
         **
         * Removes the paper from the DOM.
        \*/
        paperproto.remove = function () {
            eve("remove", this);
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
        };
    }

    // VML
    if (R.vml) {
        var map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
            bites = /([clmz]),?([^clmz]*)/gi,
            blurregexp = / progid:\S+Blur\([^\)]+\)/g,
            val = /-?[^,\s-]+/g,
            cssDot = "position:absolute;left:0;top:0;width:1px;height:1px",
            zoom = 21600,
            pathTypes = {path: 1, rect: 1},
            ovalTypes = {circle: 1, ellipse: 1},
            path2vml = function (path) {
                var total =  /[ahqstv]/ig,
                    command = pathToAbsolute;
                Str(path).match(total) && (command = path2curve);
                total = /[clmz]/g;
                if (command == pathToAbsolute && !Str(path).match(total)) {
                    var res = Str(path).replace(bites, function (all, command, args) {
                        var vals = [],
                            isMove = lowerCase.call(command) == "m",
                            res = map[command];
                        args.replace(val, function (value) {
                            if (isMove && vals.length == 2) {
                                res += vals + map[command == "m" ? "l" : "L"];
                                vals = [];
                            }
                            vals.push(round(value * zoom));
                        });
                        return res + vals;
                    });
                    return res;
                }
                var pa = command(path), p, r;
                res = [];
                for (var i = 0, ii = pa.length; i < ii; i++) {
                    p = pa[i];
                    r = lowerCase.call(pa[i][0]);
                    r == "z" && (r = "x");
                    for (var j = 1, jj = p.length; j < jj; j++) {
                        r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                    }
                    res.push(r);
                }
                return res.join(S);
            },
            compensation = function (deg, dx, dy) {
                var m = new Matrix;
                m.rotate(-deg, .5, .5);
                return {
                    dx: m.x(dx, dy),
                    dy: m.y(dx, dy)
                };
            },
            setCoords = function (p) {
                var _ = p._,
                    sx = _.sx,
                    sy = _.sy,
                    deg = _.deg,
                    dx = _.dx,
                    dy = _.dy,
                    fillpos = _.fillpos,
                    o = p.node,
                    s = o.style,
                    y = 1,
                    m = p.matrix,
                    flip = "",
                    dxdy,
                    kx = zoom / sx,
                    ky = zoom / sy;
                s.visibility = "hidden";
                o.coordsize = abs(kx) + S + abs(ky);
                s.rotation = deg * (sx * sy < 0 ? -1 : 1);
                if (deg) {
                    var c = compensation(deg, dx, dy);
                    dx = c.dx;
                    dy = c.dy;
                }
                sx < 0 && (flip += "x");
                sy < 0 && (flip += " y") && (y = -1);
                s.flip = flip;
                o.coordorigin = (dx * -kx) + S + (dy * -ky);
                if (fillpos || _.fillsize) {
                    var fill = o.getElementsByTagName(fillString);
                    fill = fill && fill[0];
                    o.removeChild(fill);
                    if (fillpos) {
                        c = compensation(deg, m.x(fillpos[0], fillpos[1]), m.y(fillpos[0], fillpos[1]));
                        fill.position = c.dx * y + S + c.dy * y;
                    }
                    if (_.fillsize) {
                        fill.size = _.fillsize[0] * abs(sx) + S + _.fillsize[1] * abs(sy);
                    }
                    o.appendChild(fill);
                }
                s.visibility = "visible";
            };
        R.toString = function () {
            return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
        };
        addArrow = function (o, value, isEnd) {
            var values = Str(value).toLowerCase().split("-"),
                se = isEnd ? "end" : "start",
                i = values.length,
                type = "classic",
                w = "medium",
                h = "medium";
            while (i--) {
                switch (values[i]) {
                    case "block":
                    case "classic":
                    case "oval":
                    case "diamond":
                    case "open":
                    case "none":
                        type = values[i];
                        break;
                    case "wide":
                    case "narrow": h = values[i]; break;
                    case "long":
                    case "short": w = values[i]; break;
                }
            }
            var stroke = o.node.getElementsByTagName("stroke")[0];
            stroke[se + "arrow"] = type;
            stroke[se + "arrowlength"] = w;
            stroke[se + "arrowwidth"] = h;
        };
        setFillAndStroke = function (o, params) {
            o.paper.canvas.style.display = "none";
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                newpath = pathTypes[o.type] && (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.cx != a.cx || params.cy != a.cy || params.rx != a.rx || params.ry != a.ry || params.r != a.r),
                isOval = ovalTypes[o.type] && (a.cx != params.cx || a.cy != params.cy || a.r != params.r || a.rx != params.rx || a.ry != params.ry),
                res = o;


            for (var par in params) if (params[has](par)) {
                a[par] = params[par];
            }
            if (newpath) {
                a.path = getPath[o.type](o);
                o._.dirty = 1;
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            params.cursor && (s.cursor = params.cursor);
            "blur" in params && o.blur(params.blur);
            "transform" in params && o.transform(params.transform);
            if (params.path && o.type == "path" || newpath) {
                node.path = path2vml(a.path);
            }
            if (isOval) {
                var cx = a.cx,
                    cy = a.cy,
                    rx = a.rx || a.r || 0,
                    ry = a.ry || a.r || 0;
                node.path = R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", round((cx - rx) * zoom), round((cy - ry) * zoom), round((cx + rx) * zoom), round((cy + ry) * zoom), round(cx * zoom));
            }
            if ("clip-rect" in params) {
                var rect = Str(params["clip-rect"]).split(separator);
                if (rect.length == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || g.doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div.appendChild(group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = E);
                }
            }
            if (o.textpath) {
                var textpathStyle = o.textpath.style;
                params.font && (textpathStyle.font = params.font);
                params["font-family"] && (textpathStyle.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, E) + '"');
                params["font-size"] && (textpathStyle.fontSize = params["font-size"]);
                params["font-weight"] && (textpathStyle.fontWeight = params["font-weight"]);
                params["font-style"] && (textpathStyle.fontStyle = params["font-style"]);
            }
            if ("arrow-start" in params) {
                addArrow(res, params["arrow-start"]);
            }
            if ("arrow-end" in params) {
                addArrow(res, params["arrow-end"], 1);
            }
            if (params.opacity != null || 
                params["stroke-width"] != null ||
                params.fill != null ||
                params.src != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                var fill = node.getElementsByTagName(fillString),
                    newfill = false;
                fill = fill && fill[0];
                !fill && (newfill = fill = createNode(fillString));
                if (o.type == "image" && params.src) {
                    fill.src = params.src;
                }
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                    opacity = mmin(mmax(opacity, 0), 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none" || params.fill === null) {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(ISURL);
                    if (isURL) {
                        fill.parentNode == node && node.removeChild(fill);
                        fill.rotate = true;
                        fill.src = isURL[1];
                        fill.type = "tile";
                        var bbox = o.getBBox(1);
                        fill.position = bbox.x + S + bbox.y;
                        o._.fillpos = [bbox.x, bbox.y];

                        preload(isURL[1], function () {
                            o._.fillsize = [this.offsetWidth, this.offsetHeight];
                        });
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = E;
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill, fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                            fill.rotate = false;
                        }
                    }
                }
                node.appendChild(fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || params.stroke === null || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                var strokeColor = R.getRGB(params.stroke);
                stroke.on && params.stroke && (stroke.color = strokeColor.hex);
                opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
                var width = (toFloat(params["stroke-width"]) || 1) * .75;
                opacity = mmin(mmax(opacity, 0), 1);
                params["stroke-width"] == null && (width = a["stroke-width"]);
                params["stroke-width"] && (stroke.weight = width);
                width && width < 1 && (opacity *= width) && (stroke.weight = 1);
                stroke.opacity = opacity;
                
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
                }
                newstroke && node.appendChild(stroke);
            }
            if (res.type == "text") {
                res.paper.canvas.style.display = E;
                var span = res.paper.span,
                    m = 100,
                    fontSize = a.font && a.font.match(/\d+(?:\.\d*)?(?=px)/);
                s = span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                fontSize = toFloat(fontSize ? fontSize[0] : a["font-size"]);
                s.fontSize = fontSize * m + "px";
                res.textpath.string && (span.innerHTML = Str(res.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                var brect = span.getBoundingClientRect();
                res.W = a.w = (brect.right - brect.left) / m;
                res.H = a.h = (brect.bottom - brect.top) / m;
                res.paper.canvas.style.display = "none";
                res.X = a.x;
                res.Y = a.y + res.H / 2;

                ("x" in params || "y" in params) && (res.path.v = R.format("m{0},{1}l{2},{1}", round(a.x * zoom), round(a.y * zoom), round(a.x * zoom) + 1));
                var dirtyattrs = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
                for (var d = 0, dd = dirtyattrs.length; d < dd; d++) if (dirtyattrs[d] in params) {
                    res._.dirty = 1;
                    break;
                }
                
                // text-anchor emulation
                switch (a["text-anchor"]) {
                    case "start":
                        res.textpath.style["v-text-align"] = "left";
                        res.bbx = res.W / 2;
                    break;
                    case "end":
                        res.textpath.style["v-text-align"] = "right";
                        res.bbx = -res.W / 2;
                    break;
                    default:
                        res.textpath.style["v-text-align"] = "center";
                        res.bbx = 0;
                    break;
                }
                res.textpath.style["v-text-kern"] = true;
            }
            res.paper.canvas.style.display = E;
        };
        addGradientFill = function (o, gradient, fill) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = Str(gradient).replace(radial_gradient, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = toFloat(fx);
                    fy = toFloat(fy);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                    fxfy = fx + S + fy;
                }
                return E;
            });
            gradient = gradient.split(/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            if (dots.length) {
                o.removeChild(fill);
                fill.on = true;
                fill.method = "none";
                fill.color = dots[0].color;
                fill.color2 = dots[dots.length - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots.length; i < ii; i++) {
                    dots[i].offset && clrs.push(dots[i].offset + S + dots[i].color);
                }
                fill.colors && (fill.colors.value = clrs.length ? clrs.join() : "0% " + fill.color);
                if (type == "radial") {
                    fill.type = "gradientTitle";
                    fill.focus = "100%";
                    fill.focussize = "0 0";
                    fill.focusposition = fxfy;
                    fill.angle = 0;
                } else {
                    // fill.rotate= true;
                    fill.type = "gradient";
                    fill.angle = (270 - angle) % 360;
                }
                o.appendChild(fill);
                // alert(fill.outerHTML);
            }
            return 1;
        };
        Element = function (node, vml) {
            this[0] = this.node = node;
            node.raphael = true;
            this.id = R._oid++;
            node.raphaelid = this.id;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.paper = vml;
            this.matrix = new Matrix;
            this._ = {
                transform: [],
                sx: 1,
                sy: 1,
                dx: 0,
                dy: 0,
                deg: 0,
                dirty: 1,
                dirtyT: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
        elproto = Element.prototype;
        elproto.transform = function (tstr) {
            if (tstr == null) {
                return this._.transform;
            }
            extractTransform(this, tstr);
            var matrix = this.matrix.clone(),
                skew = this.skew;
            matrix.translate(-.5, -.5);
            if (this.type == "image") {
                if (Str(tstr).indexOf("m") + 1) {
                    this.node.style.filter = matrix.toFilter();
                    var bb = this.getBBox(),
                        bbt = this.getBBox(1),
                        im = matrix.invert(),
                        dx = im.x(bb.x, bb.y) - im.x(bbt.x, bbt.y),
                        dy = im.y(bb.x, bb.y) - im.y(bbt.x, bbt.y);
                    // skew.offset = dx + S + dy;
                    // this.node.getElementsByTagName(fillString)[0].position = skew.offset;
                } else {
                    this.node.style.filter = E;
                    setCoords(this);
                }
            } else {
                    // o = this.node,
                    // _ = this._,
                    // fillpos = _.fillpos,
                    // deg,
                    // matrix = this.matrix;
                    // fill = o.getElementsByTagName(fillString)[0],
                    // angle = fill.angle;

                this.node.style.filter = E;
                skew.matrix = matrix;
                skew.offset = matrix.offset();
                
                // if (0&&angle) {
                //     angle = R.rad(270 - angle);
                //     var dx = 100 * math.cos(angle),
                //         dy = 100 * math.sin(angle),
                //         zx = matrix.x(0, 0),
                //         zy = matrix.y(0, 0),
                //         mx = matrix.x(dx, dy),
                //         my = matrix.y(dx, dy);
                //     angle = R.angle(zx, zy, mx, my);
                //     fill.angle = (270 - angle) % 360;
                // }
            }
            return this;
        };
        elproto.rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                return;
            }
            deg = Str(deg).split(separator);
            if (deg.length - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            (cy == null) && (cx = cy);
            if (cx == null || cy == null) {
                var bbox = this.getBBox(1);
                cx = bbox.x + bbox.width / 2;
                cy = bbox.y + bbox.height / 2;
            }
            this._.dirtyT = 1;
            this.transform(this._.transform.concat([["r", deg, cx, cy]]));
            return this;
        };
        elproto.translate = function (dx, dy) {
            if (this.removed) {
                return this;
            }
            dx = Str(dx).split(separator);
            if (dx.length - 1) {
                dy = toFloat(dx[1]);
            }
            dx = toFloat(dx[0]) || 0;
            dy = +dy || 0;
            if (this._.bbox) {
                this._.bbox.x += dx;
                this._.bbox.y += dy;
            }
            this.transform(this._.transform.concat([["t", dx, dy]]));
            return this;
        };
        elproto.scale = function (sx, sy, cx, cy) {
            if (this.removed) {
                return this;
            }
            sx = Str(sx).split(separator);
            if (sx.length - 1) {
                sy = toFloat(sx[1]);
                cx = toFloat(sx[2]);
                cy = toFloat(sx[3]);
                isNaN(cx) && (cx = null);
                isNaN(cy) && (cy = null);
            }
            sx = toFloat(sx[0]);
            (sy == null) && (sy = sx);
            (cy == null) && (cx = cy);
            if (cx == null || cy == null) {
                var bbox = this.getBBox(1);
            }
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            
            this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
            this._.dirtyT = 1;
            return this;
        };
        elproto.hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this;
        };
        elproto.show = function () {
            !this.removed && (this.node.style.display = E);
            return this;
        };
        elproto._getBBox = function () {
            if (this.removed) {
                return {};
            }
            if (this.type == "text") {
                return {
                    x: this.X + (this.bbx || 0) - this.W / 2,
                    y: this.Y - this.H,
                    width: this.W,
                    height: this.H
                };
            } else {
                return pathDimensions(this.attrs.path);
            }
        };
        elproto.remove = function () {
            if (this.removed) {
                return;
            }
            eve.unbind("*.*." + this.id);
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        elproto.attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, "string")) {
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                if (name in this.attrs) {
                    return this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    return this.paper.customAttributes[name].def;
                } else {
                    return availableAttrs[name];
                }
            }
            if (this.attrs && value == null && R.is(name, array)) {
                var ii, values = {};
                for (i = 0, ii = name.length; i < ii; i++) {
                    values[name[i]] = this.attr(name[i]);
                }
                return values;
            }
            var params;
            if (value != null) {
                params = {};
                params[name] = value;
            }
            value == null && R.is(name, "object") && (params = name);
            for (var key in params) {
                eve("attr." + key + "." + this.id, this, params[key]);
            }
            if (params) {
                for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                    var par = this.paper.customAttributes[key].apply(this, [][concat](params[key]));
                    this.attrs[key] = params[key];
                    for (var subkey in par) if (par[has](subkey)) {
                        params[subkey] = par[subkey];
                    }
                }
                // this.paper.canvas.style.display = "none";
                if (params.text && this.type == "text") {
                    this.textpath.string = params.text;
                }
                setFillAndStroke(this, params);
                // this.paper.canvas.style.display = E;
            }
            return this;
        };
        elproto.toFront = function () {
            !this.removed && this.node.parentNode.appendChild(this.node);
            this.paper.top != this && tofront(this, this.paper);
            return this;
        };
        elproto.toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
            }
            return this;
        };
        elproto.insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[element.length - 1];
            }
            if (element.node.nextSibling) {
                element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
            } else {
                element.node.parentNode.appendChild(this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        elproto.insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[0];
            }
            element.node.parentNode.insertBefore(this.node, element.node);
            insertbefore(this, element, this.paper);
            return this;
        };
        elproto.blur = function (size) {
            var s = this.node.runtimeStyle,
                f = s.filter;
            f = f.replace(blurregexp, E);
            if (+size !== 0) {
                this.attrs.blur = size;
                s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
                delete this.attrs.blur;
            }
        };

        thePath = function (pathString, vml) {
            var el = createNode("shape");
            el.style.cssText = cssDot;
            el.coordsize = zoom + S + zoom;
            el.coordorigin = vml.coordorigin;
            var p = new Element(el, vml),
                attr = {fill: "none", stroke: "#000"};
            pathString && (attr.path = pathString);
            p.type = "path";
            p.path = [];
            p.Path = E;
            setFillAndStroke(p, attr);
            vml.canvas.appendChild(el);
            var skew = createNode("skew");
            skew.on = true;
            el.appendChild(skew);
            p.skew = skew;
            p.transform(E);
            return p;
        };
        theRect = function (vml, x, y, w, h, r) {
            var path = rectPath(x, y, w, h, r),
                res = vml.path(path),
                a = res.attrs;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.r = r;
            a.path = path;
            res.type = "rect";
            return res;
        };
        theEllipse = function (vml, x, y, rx, ry) {
            var res = vml.path(),
                a = res.attrs;
            res.X = x - rx;
            res.Y = y - ry;
            res.W = rx * 2;
            res.H = ry * 2;
            res.type = "ellipse";
            setFillAndStroke(res, {
                cx: x,
                cy: y,
                rx: rx,
                ry: ry
            });
            return res;
        };
        theCircle = function (vml, x, y, r) {
            var res = vml.path(),
                a = res.attrs;
            res.X = x - r;
            res.Y = y - r;
            res.W = res.H = r * 2;
            res.type = "circle";
            setFillAndStroke(res, {
                cx: x,
                cy: y,
                r: r
            });
            return res;
        };
        theImage = function (vml, src, x, y, w, h) {
            var path = rectPath(x, y, w, h),
                res = vml.path(path).attr({stroke: "none"}),
                a = res.attrs,
                node = res.node,
                fill = node.getElementsByTagName(fillString)[0];
            a.src = src;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.path = path;
            res.type = "image";
            fill.parentNode == node && node.removeChild(fill);
            fill.rotate = true;
            fill.src = src;
            fill.type = "tile";
            res._.fillpos = [x, y];
            res._.fillsize = [w, h];
            node.appendChild(fill);
            setCoords(res);
            return res;
        };
        theText = function (vml, x, y, text) {
            var el = createNode("shape"),
                path = createNode("path"),
                o = createNode("textpath");
            x = x || 0;
            y = y || 0;
            text = text || "";
            path.v = R.format("m{0},{1}l{2},{1}", round(x * zoom), round(y * zoom), round(x * zoom) + 1);
            path.textpathok = true;
            o.string = Str(text);
            o.on = true;
            el.style.cssText = "position:absolute;left:0;top:0;width:1;height:1";
            el.coordsize = zoom + S + zoom;
            el.coordorigin = "0 0";
            var p = new Element(el, vml),
                attr = {fill: "#000", stroke: "none", font: availableAttrs.font, text: text};
            p.shape = el;
            p.path = path;
            p.textpath = o;
            p.type = "text";
            p.attrs.text = Str(text);
            p.attrs.x = x;
            p.attrs.y = y;
            p.attrs.w = 1;
            p.attrs.h = 1;
            setFillAndStroke(p, attr);
            el.appendChild(o);
            el.appendChild(path);
            vml.canvas.appendChild(el);
            var skew = createNode("skew");
            skew.on = true;
            el.appendChild(skew);
            p.skew = skew;
            p.transform(E);
            return p;
        };
        setSize = function (width, height) {
            var cs = this.canvas.style;
            this.width = width;
            this.height = height;
            width == +width && (width += "px");
            height == +height && (height += "px");
            cs.width = width;
            cs.height = height;
            cs.clip = "rect(0 " + width + " " + height + " 0)";
            if (this._viewBox) {
                setViewBox.apply(this, this._viewBox);
            }
            return this;
        };
        setViewBox = function (x, y, w, h, fit) {
            eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
            var width = this.width,
                height = this.height,
                size = 1e3 * mmax(w / width, h / height),
                H, W;
            if (fit) {
                H = height / h;
                W = width / w;
                if (w * H < width) {
                    x -= (width - w * H) / 2 / H;
                }
                if (h * W < height) {
                    y -= (height - h * W) / 2 / W;
                }
            }
            this._viewBox = [x, y, w, h, !!fit];
            this.forEach(function (el) {
                el.transform("...");
            });
            return this;
        };
        var createNode,
            initWin = function (win) {
                var doc = win.document;
                doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
                try {
                    !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                    createNode = function (tagName) {
                        return doc.createElement('<rvml:' + tagName + ' class="rvml">');
                    };
                } catch (e) {
                    createNode = function (tagName) {
                        return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                    };
                }
            };
        initWin(g.win);
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = g.doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            res.width = width;
            res.height = height;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.coordsize = zoom * 1e3 + S + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = g.doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
            c.appendChild(res.span);
            cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                g.doc.body.appendChild(c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container.appendChild(c);
                }
            }
            plugins.call(res, res, R.fn);
            return res;
        };
        paperproto.clear = function () {
            eve("clear", this);
            this.canvas.innerHTML = E;
            this.span = g.doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas.appendChild(this.span);
            this.bottom = this.top = null;
        };
        paperproto.remove = function () {
            eve("remove", this);
            this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
            return true;
        };
    }
 
    // WebKit rendering bug workaround method
    var version = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    if ((navigator.vendor == "Apple Computer, Inc.") && (version && version[1] < 4 || navigator.platform.slice(0, 2) == "iP") ||
        (navigator.vendor == "Google Inc." && version && version[1] < 8)) {
        /*\
         * Paper.safari
         [ method ]
         **
         * There is an inconvenient rendering bug in Safari (WebKit):
         * sometimes the rendering should be forced.
         * This method should help with dealing with this bug.
        \*/
        paperproto.safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
            setTimeout(function () {rect.remove();});
        };
    } else {
        paperproto.safari = fun;
    }
 
    // Events
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (g.doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
                var f = function (e) {
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (g.doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || g.win.event;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })(),
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
            scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            var node = dragi.el.node,
                o,
                next = node.nextSibling,
                parent = node.parentNode,
                display = node.style.display;
            g.win.opera && parent.removeChild(node);
            node.style.display = "none";
            o = dragi.el.paper.getElementByPoint(x, y);
            node.style.display = display;
            g.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            o && eve("drag.over." + dragi.el.id, dragi.el, o);
            x += scrollX;
            y += scrollY;
            eve("drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        R.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            eve("drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
        }
        drag = [];
    };
    for (var i = events.length; i--;) {
        (function (eventName) {
            R[eventName] = Element.prototype[eventName] = function (fn, scope) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || g.doc, eventName, fn, scope || this)});
                }
                return this;
            };
            R["un" + eventName] = Element.prototype["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events.length;
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    /*\
     * Element.hover
     [ method ]
     **
     * Adds event handlers for hover for the element.
     > Parameters
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     - icontext (object) #optional context for hover in handler
     - ocontext (object) #optional context for hover out handler
     = (object) @Element
    \*/
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    /*\
     * Element.unhover
     [ method ]
     **
     * Removes event handlers for hover for the element.
     > Parameters
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     = (object) @Element
    \*/
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    /*\
     * Element.drag
     [ method ]
     **
     * Adds event handlers for drag of the element.
     > Parameters
     - onmove (function) handler for moving
     - onstart (function) handler for drag start
     - onend (function) handler for drag end
     - mcontext (object) #optional context for moving handler
     - scontext (object) #optional context for drag start handler
     - econtext (object) #optional context for drag end handler
     * Additionaly following `drag` events will be triggered: `drag.start.<id>` on start, 
     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element will be dragged over another element 
     * `drag.over.<id>` will be fired as well.
     *
     * Start event and start handler will be called in specified context or in context of the element with following parameters:
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * Move event and move handler will be called in specified context or in context of the element with following parameters:
     o dx (number) shift by x from the start point
     o dy (number) shift by y from the start point
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * End event and end handler will be called in specified context or in context of the element with following parameters:
     o event (object) DOM event object
     = (object) @Element
    \*/
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        function start(e) {
            (e.originalEvent || e).preventDefault();
            var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;
            this._drag.x = e.clientX + scrollX;
            this._drag.y = e.clientY + scrollY;
            this._drag.id = e.identifier;
            !drag.length && R.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: this, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
            onstart && eve.on("drag.start." + this.id, onstart);
            onmove && eve.on("drag.move." + this.id, onmove);
            onend && eve.on("drag.end." + this.id, onend);
            eve("drag.start." + this.id, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
        }
        this._drag = {};
        this.mousedown(start);
        return this;
    };
    /*\
     * Element.onDragOver
     [ method ]
     **
     * Shortcut for assigning event handler for `drag.over.<id>` event, where id is id of the element (see @Element.id).
     > Parameters
     - f (function) handler for event
    \*/
    elproto.onDragOver = function (f) {
        f ? eve.on("drag.over." + this.id, f) : eve.unbind("drag.over." + this.id);
    };
    /*\
     * Element.undrag
     [ method ]
     **
     * Removes all drag event handlers from given element.
    \*/
    elproto.undrag = function () {
        var i = drag.length;
        while (i--) if (drag[i].el == this) {
            R.unmousedown(drag[i].start);
            drag.splice(i++, 1);
            eve.unbind("drag.*." + this.id);
        }
        !drag.length && R.unmousemove(dragMove).unmouseup(dragUp);
    };
    /*\
     * Paper.circle
     [ method ]
     **
     * Draws a circle.
     **
     > Parameters
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - r (number) radius
     = (object) Raphaël element object with type “circle”
     **
     > Usage
     | var c = paper.circle(50, 50, 40);
    \*/
    paperproto.circle = function (x, y, r) {
        return theCircle(this, x || 0, y || 0, r || 0);
    };
    /*\
     * Paper.rect
     [ method ]
     *
     * Draws a rectangle.
     **
     > Parameters
     **
     - x (number) x coordinate of the top left corner
     - y (number) y coordinate of the top left corner
     - width (number) width
     - height (number) height
     - r (number) #optional radius for rounded corners, default is 0
     = (object) Raphaël element object with type “rect”
     **
     > Usage
     | // regular rectangle
     | var c = paper.rect(10, 10, 50, 50);
     | // rectangle with rounded corners
     | var c = paper.rect(40, 40, 50, 50, 10);
    \*/
    paperproto.rect = function (x, y, w, h, r) {
        return theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    };
    /*\
     * Paper.ellipse
     [ method ]
     **
     * Draws an ellipse.
     **
     > Parameters
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - rx (number) horizontal radius
     - ry (number) vertical radius
     = (object) Raphaël element object with type “ellipse”
     **
     > Usage
     | var c = paper.ellipse(50, 50, 40, 20);
    \*/
    paperproto.ellipse = function (x, y, rx, ry) {
        return theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    /*\
     * Paper.path
     [ method ]
     **
     * Creates a path element by given path data string.
     **
     > Parameters
     **
     - pathString (string) path data in SVG path string format.
     = (object) Raphaël element object with type “ellipse”
     # Details of a path's data attribute's format are described in the <a href="http://www.w3.org/TR/SVG/paths.html#PathData">SVG specification</a>.
     **
     > Usage
     | var c = paper.path("M10 10L90 90");
     | // draw a diagonal line:
     | // move to 10,10, line to 90,90
    \*/
    paperproto.path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        return thePath(R.format[apply](R, arguments), this);
    };
    /*\
     * Paper.image
     [ method ]
     **
     * Embeds an image into the surface.
     **
     > Parameters
     **
     - src (string) URI of the source image
     - x (number) x coordinate position
     - y (number) y coordinate position
     - width (number) width of the image
     - height (number) height of the image
     = (object) Raphaël element object with type “image”
     **
     > Usage
     | var c = paper.image("apple.png", 10, 10, 80, 80);
    \*/
    paperproto.image = function (src, x, y, w, h) {
        return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    /*\
     * Paper.text
     [ method ]
     **
     * Draws a text string. If you need line breaks, put “\n” in the string.
     **
     > Parameters
     **
     - x (number) x coordinate position
     - y (number) y coordinate position
     - text (string) The text string to draw
     = (object) Raphaël element object with type “text”
     **
     > Usage
     | var t = paper.text(50, 50, "Raphaël\nkicks\nbutt!");
    \*/
    paperproto.text = function (x, y, text) {
        return theText(this, x || 0, y || 0, Str(text));
    };
    /*\
     * Paper.set
     [ method ]
     **
     * Creates array-like object to keep and operate several elements at once.
     * Warning: it doesn’t create any elements for itself in the page, it just groups existing elements.
     * Sets act as pseudo elements — all methods available to an element can be used on a set.
     = (object) array-like object that represents set of elements
     **
     > Usage
     | var st = paper.set();
     | st.push(
     |     paper.circle(10, 10, 5),
     |     paper.circle(30, 10, 5)
     | );
     | st.attr({fill: "red"});
    \*/
    paperproto.set = function (itemsArray) {
        arguments.length > 1 && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
        return new Set(itemsArray);
    };
    /*\
     * Paper.setSize
     [ method ]
     **
     * If you need to change dimensions of the canvas call this method
     **
     > Parameters
     **
     - width (number) new width of the canvas
     - height (number) new height of the canvas
     > Usage
     | var st = paper.set();
     | st.push(
     |     paper.circle(10, 10, 5),
     |     paper.circle(30, 10, 5)
     | );
     | st.attr({fill: "red"});
    \*/
    paperproto.setSize = setSize;
    /*\
     * Paper.setViewBox
     [ method ]
     **
     * Sets the view box of the paper. Practically it gives you ability to zoom and pan whole paper surface by 
     * specifying new boundaries.
     **
     > Parameters
     **
     x, y, w, h, fit
     - x (number) new x position, default is `0`
     - y (number) new y position, default is `0`
     - w (number) new width of the canvas
     - h (number) new height of the canvas
     - fit (boolean) `true` if you want graphics to fit into new boundary box
    \*/
    paperproto.setViewBox = setViewBox;
    /*\
     * Paper.top
     [ property ]
     **
     * Points to the topmost element on the paper
    \*/
    /*\
     * Paper.bottom
     [ property ]
     **
     * Points to the bottom element on the paper
    \*/
    paperproto.top = paperproto.bottom = null;
    /*\
     * Paper.raphael
     [ property ]
     **
     * Points to the @Raphael object/function
    \*/
    paperproto.raphael = R;
    var getOffset = function (elem) {
        var box = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,
            clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
            top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
            left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
        return {
            y: top,
            x: left
        };
    };
    /*\
     * Paper.getElementByPoint
     [ method ]
     **
     * Returns you topmost element under given point.
     **
     = (object) Raphaël element object
     > Parameters
     **
     - x (number) x coordinate from the top left corner of the window
     - y (number) y coordinate from the top left corner of the window
     > Usage
     | paper.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
    \*/
    paperproto.getElementByPoint = function (x, y) {
        var paper = this,
            svg = paper.canvas,
            target = g.doc.elementFromPoint(x, y);
        if (g.win.opera && target.tagName == "svg") {
            var so = getOffset(svg),
                sr = svg.createSVGRect();
            sr.x = x - so.x;
            sr.y = y - so.y;
            sr.width = sr.height = 1;
            var hits = svg.getIntersectionList(sr, null);
            if (hits.length) {
                target = hits[hits.length - 1];
            }
        }
        if (!target) {
            return null;
        }
        while (target.parentNode && target != svg.parentNode && !target.raphael) {
            target = target.parentNode;
        }
        target == paper.canvas.parentNode && (target = svg);
        target = target && target.raphael ? paper.getById(target.raphaelid) : null;
        return target;
    };
    /*\
     * Paper.getById
     [ method ]
     **
     * Returns you element by its internal ID.
     **
     > Parameters
     **
     - id (number) id
     = (object) Raphaël element object
    \*/
    paperproto.getById = function (id) {
        var bot = this.bottom;
        while (bot) {
            if (bot.id == id) {
                return bot;
            }
            bot = bot.next;
        }
        return null;
    };
    /*\
     * Paper.forEach
     [ method ]
     **
     * Executes given function for each element on the paper
     *
     * If callback function returns `false` it will stop loop running.
     **
     > Parameters
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Paper object
    \*/
    paperproto.forEach = function (callback, thisArg) {
        var bot = this.bottom;
        while (bot) {
            if (callback.call(thisArg, bot) === false) {
                return this;
            }
            bot = bot.next;
        }
        return this;
    };
    function x_y() {
        return this.x + S + this.y;
    }
    function x_y_w_h() {
        return this.x + S + this.y + S + this.width + "\xd7" + this.height;
    }
    /*\
     * Element.getBBox
     [ method ]
     **
     * Return bounding box for a given element
     **
     > Parameters
     **
     - isWithoutTransform (boolean) flag, `true` if you want to have bounding box before transformations. Default is `false`.
     = (object) Bounding box object:
     o {
     o     x: (number) top left corner x
     o     y: (number) top left corner y
     o     width: (number) width
     o     height: (number) height
     o }
    \*/
    elproto.getBBox = function (isWithoutTransform) {
        if (this.removed) {
            return {};
        }
        var _ = this._;
        if (isWithoutTransform) {
            if (_.dirty || !_.bboxwt) {
                this.realPath = getPath[this.type](this);
                _.bboxwt = pathDimensions(this.realPath);
                _.bboxwt.toString = x_y_w_h;
                _.dirty = 0;
            }
            return _.bboxwt;
        }
        if (_.dirty || _.dirtyT || !_.bbox) {
            if (_.dirty || !this.realPath) {
                _.bboxwt = 0;
                this.realPath = getPath[this.type](this);
            }
            _.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
            _.bbox.toString = x_y_w_h;
            _.dirty = _.dirtyT = 0;
        }
        return _.bbox;
    };
    /*\
     * Element.clone
     [ method ]
     **
     = (object) clone of a given element
     **
    \*/
    elproto.clone = function () {
        if (this.removed) {
            return null;
        }
        var attr = this.attr();
        delete attr.scale;
        delete attr.translation;
        return this.paper[this.type]().attr(attr);
    };
    /*\
     * Element.glow
     [ method ]
     **
     * Return set of elements that create glow-like effect around given element. See @Paper.set.
     *
     * Note: Glow is not connected to the element. If you change element attributes it won’t adjust itself.
     **
     = (object) @Paper.set of elements that represents glow
    \*/
    elproto.glow = function (glow) {
        if (this.type == "text") {
            return null;
        }
        glow = glow || {};
        var s = {
            width: glow.width || 10,
            fill: glow.fill || false,
            opacity: glow.opacity || .5,
            offsetx: glow.offsetx || 0,
            offsety: glow.offsety || 0,
            color: glow.color || "#000"
        },
            c = s.width / 2,
            r = this.paper,
            out = r.set(),
            path = this.realPath || getPath[this.type](this);
        path = this.matrix ? mapPath(path, this.matrix) : path;
        for (var i = 1; i < c + 1; i++) {
            out.push(r.path(path).attr({stroke: s.color, fill: s.fill ? s.color : "none", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": +(s.width / c * i).toFixed(3), opacity: +(s.opacity / c).toFixed(3)}));
        }
        return out.insertBefore(this).translate(s.offsetx, s.offsety);
    };
    var curveslengths = {},
    getPointAtSegmentLength = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            precision = 100,
            name = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y].join(),
            cache = curveslengths[name],
            old, dot;
        !cache && (curveslengths[name] = cache = {data: []});
        cache.timer && clearTimeout(cache.timer);
        cache.timer = setTimeout(function () {delete curveslengths[name];}, 2e3);
        if (length != null && !cache.precision) {
            var total = getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            cache.precision = ~~total * 10;
            cache.data = [];
        }
        precision = cache.precision || precision;
        for (var i = 0; i < precision + 1; i++) {
            if (cache.data[i * precision]) {
                dot = cache.data[i * precision];
            } else {
                dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i / precision);
                cache.data[i * precision] = dot;
            }
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (length != null && len >= length) {
                return dot;
            }
            old = dot;
        }
        if (length == null) {
            return len;
        }
    },
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[1], p[2], p[3], p[4], p[5], p[6], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    };
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    /*\
     * Raphael.getTotalLength
     [ method ]
     **
     * Returns length of the given path in pixels.
     **
     > Parameters
     **
     - path (string) SVG path string.
     **
     = (number) length.
    \*/
    R.getTotalLength = getTotalLength;
    /*\
     * Raphael.getPointAtLength
     [ method ]
     **
     * Return coordinates of the point located at the given length on the given path.
     **
     > Parameters
     **
     - path (string) SVG path string
     - length (number)
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate
     o     y: (number) y coordinate
     o     alpha: (number) angle of derivative
     o }
    \*/
    R.getPointAtLength = getPointAtLength;
    /*\
     * Raphael.getSubpath
     [ method ]
     **
     * Return subpath of a given path from given length to given length.
     **
     > Parameters
     **
     - path (string) SVG path string
     - from (number) position of the start of the segment
     - to (number) position of the end of the segment
     **
     = (string) pathstring for the segment
    \*/
    R.getSubpath = function (path, from, to) {
        if (abs(this.getTotalLength(path) - to) < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    /*\
     * Element.getTotalLength
     [ method ]
     **
     * Returns length of the path in pixels. Only works for element of “path” type.
     = (number) length.
    \*/
    elproto.getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    /*\
     * Element.getPointAtLength
     [ method ]
     **
     * Return coordinates of the point located at the given length on the given path. Only works for element of “path” type.
     **
     > Parameters
     **
     - length (number)
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate
     o     y: (number) y coordinate
     o     alpha: (number) angle of derivative
     o }
    \*/
    elproto.getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        return getPointAtLength(this.attrs.path, length);
    };
    /*\
     * Element.getSubpath
     [ method ]
     **
     * Return subpath of a given element from given length to given length. Only works for element of “path” type.
     **
     > Parameters
     **
     - from (number) position of the start of the segment
     - to (number) position of the end of the segment
     **
     = (string) pathstring for the segment
    \*/
    elproto.getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        return R.getSubpath(this.attrs.path, from, to);
    };
    /*\
     * Raphael.easing_formulas
     [ property ]
     **
     * Object that contains easing formulas for animation. You could extend it with your own. By default it has following list of easing:
     # <ul>
     #     <li>“linear”</li>
     #     <li>“&lt;” or “easeIn” or “ease-in”</li>
     #     <li>“>” or “easeOut” or “ease-out”</li>
     #     <li>“&lt;>” or “easeInOut” or “ease-in-out”</li>
     #     <li>“backIn” or “back-in”</li>
     #     <li>“backOut” or “back-out”</li>
     #     <li>“elastic”</li>
     #     <li>“bounce”</li>
     # </ul>
     # <p>See also <a href="http://raphaeljs.com/easing.html">Easing demo</a>.</p>
    \*/
    var ef = R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 1.7);
        },
        ">": function (n) {
            return pow(n, .48);
        },
        "<>": function (n) {
            var q = .48 - n / 1.04,
                Q = math.sqrt(.1734 + q * q),
                x = Q - q,
                X = pow(abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = pow(abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + .5;
            return (1 - t) * 3 * t * t + t * t * t;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == !!n) {
                return n;
            }
            return pow(2, -10 * n) * math.sin((n - .075) * (2 * PI) / .3) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };
    ef.easeIn = ef["ease-in"] = ef["<"];
    ef.easeOut = ef["ease-out"] = ef[">"];
    ef.easeInOut = ef["ease-in-out"] = ef["<>"];
    ef["back-in"] = ef.backIn;
    ef["back-out"] = ef.backOut;

    var animationElements = [],
        requestAnimFrame = window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                           function (callback) {
                               setTimeout(callback, 16);
                           },
        animation = function () {
            var Now = +new Date,
                l = 0;
            for (; l < animationElements.length; l++) {
                var e = animationElements[l];
                if (e.el.removed || e.paused) {
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    that = e.el,
                    set = {},
                    now;
                if (e.initstatus) {
                    time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
                    e.status = e.initstatus;
                    delete e.initstatus;
                    e.stop && animationElements.splice(l--, 1);
                } else {
                    e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
                }
                if (time < 0) {
                    continue;
                }
                if (time < ms) {
                    var pos = easing(time / ms);
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ].join(",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr].length; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i].join(S);
                                }
                                now = now.join(S);
                                break;
                            case "transform":
                                if (diff[attr].real) {
                                    now = [];
                                    for (i = 0, ii = from[attr].length; i < ii; i++) {
                                        now[i] = [from[attr][i][0]];
                                        for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                            now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
                                        }
                                    }
                                } else {
                                    var get = function (i) {
                                        return +from[attr][i] + pos * ms * diff[attr][i];
                                    };
                                    // now = [["r", get(2), 0, 0], ["t", get(3), get(4)], ["s", get(0), get(1), 0, 0]];
                                    now = [["m", get(0), get(1), get(2), get(3), get(4), get(5)]];
                                }
                                break;
                            case "csv":
                                if (attr == "clip-rect") {
                                    now = [];
                                    i = 4;
                                    while (i--) {
                                        now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                    }
                                }
                                break;
                            default:
                                var from2 = [].concat(from[attr]);
                                now = [];
                                i = that.paper.customAttributes[attr].length;
                                while (i--) {
                                    now[i] = +from2[i] + pos * ms * diff[attr][i];
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    (function (id, that, anim) {
                        setTimeout(function () {
                            eve("anim.frame." + id, that, anim);
                        });
                    })(that.id, that, e.anim);
                } else {
                    (function(f, el, a) {
                        setTimeout(function() {
                            eve("anim.finish." + el.id, el, a);
                            R.is(f, "function") && f.call(el);
                        });
                    })(e.callback, that, e.anim);
                    if (--e.repeat) {
                        that.attr(e.origin);
                        e.start = Now;
                    } else {
                        that.attr(to);
                        animationElements.splice(l--, 1);
                    }
                    if (e.next && !e.stop) {
                        runAnimation(e.anim, e.el, e.next, null, e.totalOrigin);
                    }
                }
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements.length && requestAnimFrame(animation);
        },
        upto255 = function (color) {
            return mmax(mmin(color, 255), 0);
        };
    /*\
     * Element.animateWith
     [ method ]
     **
     * Acts similar to @Element.animate, but ensure that given animation runs in sync with another given element.
     **
     > Parameters
     **
     - params (object) final attributes for the element, see also @Element.attr
     - ms (number) number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept on of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     * or
     - animation (object) animation object, see @Raphael.animation
     **
     = (object) original element
    \*/
    elproto.animateWith = function (element, params, ms, easing, callback) {
        for (var i = 0, ii = animationElements.length; i < ii; i++) {
            if (animationElements[i].el.id == element.id) {
                params.start = animationElements[i].timestamp;
                break;
            }
        }
        return this.animate(params, ms, easing, callback);
    };
    function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
        var cx = 3 * p1x,
            bx = 3 * (p2x - p1x) - cx,
            ax = 1 - cx - bx,
            cy = 3 * p1y,
            by = 3 * (p2y - p1y) - cy,
            ay = 1 - cy - by;
        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }
        function solve(x, epsilon) {
            var t = solveCurveX(x, epsilon);
            return ((ay * t + by) * t + cy) * t;
        }
        function solveCurveX(x, epsilon) {
            var t0, t1, t2, x2, d2, i;
            for(t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < epsilon) {
                    return t2;
                }
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            t0 = 0;
            t1 = 1;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                } else {
                    t1 = t2;
                }
                t2 = (t1 - t0) / 2 + t0;
            }
            return t2;
        }
        return solve(t, 1 / (200 * duration));
    }
    elproto.onAnimation = function (f) {
        f ? eve.on("anim.frame." + this.id, f) : eve.unbind("anim.frame." + this.id);
        return this;
    };
    function Animation(anim, ms) {
        var percents = [];
        this.anim = anim;
        this.ms = ms;
        this.times = 1;
        if (this.anim) {
            for (var attr in this.anim) if (this.anim[has](attr)) {
                percents.push(+attr);
            }
            percents.sort(sortByNumber);
        }
        this.top = percents[percents.length - 1];
        this.percents = percents;
    }
    /*\
     * Animation.delay
     [ method ]
     **
     * Creates a copy of existing animation object with given delay.
     **
     > Parameters
     **
     - delay (number) number of ms to pass between animation start and actual animation
     **
     = (object) new altered Animation object
    \*/
    Animation.prototype.delay = function (delay) {
        var a = new Animation(this.anim, this.ms);
        a.times = this.times;
        a.del = +delay || 0;
        return a;
    };
    /*\
     * Animation.repeat
     [ method ]
     **
     * Creates a copy of existing animation object with given repetition.
     **
     > Parameters
     **
     - repeat (number) number iterations of animation. For infinite animation pass `Infinity`
     **
     = (object) new altered Animation object
    \*/
    Animation.prototype.repeat = function (times) { 
        var a = new Animation(this.anim, this.ms);
        a.del = this.del;
        a.times = math.floor(mmax(times, 0)) || 1;
        return a;
    };
    function runAnimation(anim, element, percent, status, totalOrigin) {
        percent = toFloat(percent);
        var params,
            isInAnim,
            isInAnimSet,
            percents = [],
            next,
            prev,
            timestamp,
            ms = anim.ms,
            from = {},
            to = {},
            diff = {};
        if (status) {
            for (i = 0, ii = animationElements.length; i < ii; i++) {
                var e = animationElements[i];
                if (e.el.id == element.id && e.anim == anim) {
                    if (e.percent != percent) {
                        animationElements.splice(i, 1);
                        isInAnimSet = 1;
                    } else {
                        isInAnim = e;
                    }
                    element.attr(e.totalOrigin);
                    break;
                }
            }
        } else {
            status = 0 / 0;
        }
        for (var i = 0, ii = anim.percents.length; i < ii; i++) {
            if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
                percent = anim.percents[i];
                prev = anim.percents[i - 1] || 0;
                ms = ms / anim.top * (percent - prev);
                next = anim.percents[i + 1];
                params = anim.anim[percent];
                break;
            } else if (status) {
                element.attr(anim.anim[anim.percents[i]]);
            }
        }
        if (!params) {
            return;
        }
        if (!isInAnim) {
            for (attr in params) if (params[has](attr)) {
                if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                    from[attr] = element.attr(attr);
                    (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                    to[attr] = params[attr];
                    switch (availableAnimAttrs[attr]) {
                        case nu:
                            diff[attr] = (to[attr] - from[attr]) / ms;
                            break;
                        case "colour":
                            from[attr] = R.getRGB(from[attr]);
                            var toColour = R.getRGB(to[attr]);
                            diff[attr] = {
                                r: (toColour.r - from[attr].r) / ms,
                                g: (toColour.g - from[attr].g) / ms,
                                b: (toColour.b - from[attr].b) / ms
                            };
                            break;
                        case "path":
                            var pathes = path2curve(from[attr], to[attr]),
                                toPath = pathes[1];
                            from[attr] = pathes[0];
                            diff[attr] = [];
                            for (i = 0, ii = from[attr].length; i < ii; i++) {
                                diff[attr][i] = [0];
                                for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                    diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                                }
                            }
                            break;
                        case "transform":
                            var _ = element._,
                                eq = equaliseTransform(_[attr], to[attr]);
                            if (eq) {
                                from[attr] = eq.from;
                                to[attr] = eq.to;
                                diff[attr] = [];
                                diff[attr].real = true;
                                for (i = 0, ii = from[attr].length; i < ii; i++) {
                                    diff[attr][i] = [from[attr][i][0]];
                                    for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                        diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                                    }
                                }
                            } else {
                                var m = (element.matrix || new Matrix).m,
                                    to2 = {_:{transform: _.transform}, getBBox: function () { return element.getBBox(); }};
                                from[attr] = [
                                    m[0][0],
                                    m[1][0],
                                    m[0][1],
                                    m[1][1],
                                    m[0][2],
                                    m[1][2]
                                ];
                                extractTransform(to2, to[attr]);
                                to[attr] = to2._.transform;
                                diff[attr] = [
                                    (to2.matrix.m[0][0] - m[0][0]) / ms,
                                    (to2.matrix.m[1][0] - m[1][0]) / ms,
                                    (to2.matrix.m[0][1] - m[0][1]) / ms,
                                    (to2.matrix.m[1][1] - m[1][1]) / ms,
                                    (to2.matrix.m[0][2] - m[0][2]) / ms,
                                    (to2.matrix.m[1][2] - m[1][2]) / ms
                                ];
                                // from[attr] = [_.sx, _.sy, _.deg, _.dx, _.dy];
                                // var to2 = {_:{}, getBBox: function () { return element.getBBox(); }};
                                // extractTransform(to2, to[attr]);
                                // diff[attr] = [
                                //     (to2._.sx - _.sx) / ms,
                                //     (to2._.sy - _.sy) / ms,
                                //     (to2._.deg - _.deg) / ms,
                                //     (to2._.dx - _.dx) / ms,
                                //     (to2._.dy - _.dy) / ms
                                // ];
                            }
                            break;
                        case "csv":
                            var values = Str(params[attr]).split(separator),
                                from2 = Str(from[attr]).split(separator);
                            if (attr == "clip-rect") {
                                from[attr] = from2;
                                diff[attr] = [];
                                i = from2.length;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            }
                            to[attr] = values;
                            break;
                        default:
                            values = [].concat(params[attr]);
                            from2 = [].concat(from[attr]);
                            diff[attr] = [];
                            i = element.paper.customAttributes[attr].length;
                            while (i--) {
                                diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                            }
                            break;
                    }
                }
            }
            var easing = params.easing,
                easyeasy = R.easing_formulas[easing];
            if (!easyeasy) {
                easyeasy = Str(easing).match(bezierrg);
                if (easyeasy && easyeasy.length == 5) {
                    var curve = easyeasy;
                    easyeasy = function (t) {
                        return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
                    };
                } else {
                    easyeasy = pipe;
                }
            }
            timestamp = params.start || anim.start || +new Date;
            e = {
                anim: anim,
                percent: percent,
                timestamp: timestamp,
                start: timestamp + (anim.del || 0),
                status: 0,
                initstatus: status || 0,
                stop: false,
                ms: ms,
                easing: easyeasy,
                from: from,
                diff: diff,
                to: to,
                el: element,
                callback: params.callback,
                prev: prev,
                next: next,
                repeat: anim.times,
                origin: element.attr(),
                totalOrigin: totalOrigin
            };
            animationElements.push(e);
            if (status && !isInAnim) {
                e.stop = true;
                e.start = new Date - ms * status;
                if (animationElements.length == 1) {
                    return animation();
                }
            }
            animationElements.length == 1 && requestAnimFrame(animation);
        } else {
            isInAnim.initstatus = status;
            isInAnim.start = new Date - isInAnim.ms * status;
        }
        eve("anim.start." + element.id, element, anim);
    }
    /*\
     * Raphael.animation
     [ method ]
     **
     * Creates an animation object that can be passed to the @Element.animate or @Element.animateWith methods.
     * See also @Animation.delay and @Animation.repeat methods.
     **
     > Parameters
     **
     - params (object) final attributes for the element, see also @Element.attr
     - ms (number) number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     **
     = (object) @Animation
    \*/
    R.animation = function (params, ms, easing, callback) {
        if (R.is(easing, "function") || !easing) {
            callback = callback || easing || null;
            easing = null;
        }
        params = Object(params);
        ms = +ms || 0;
        var p = {},
            json,
            attr;
        for (attr in params) if (params[has](attr) && toFloat(attr) != attr) {
            json = true;
            p[attr] = params[attr];
        }
        if (!json) {
            return new Animation(params, ms);
        } else {
            easing && (p.easing = easing);
            callback && (p.callback = callback);
            return new Animation({100: p}, ms);
        }
    };
    /*\
     * Element.animate
     [ method ]
     **
     * Creates and starts animation for given element.
     **
     > Parameters
     **
     - params (object) final attributes for the element, see also @Element.attr
     - ms (number) number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     * or
     - animation (object) animation object, see @Raphael.animation
     **
     = (object) original element
    \*/
    elproto.animate = function (params, ms, easing, callback) {
        var element = this;
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        var anim = params instanceof Animation ? params : R.animation(params, ms, easing, callback);
        runAnimation(anim, element, anim.percents[0], null, element.attr());
        return element;
    };
    /*\
     * Element.setTime
     [ method ]
     **
     * Sets the status of animation of the element in milliseconds. Similar to @Element.status method.
     **
     > Parameters
     **
     - anim (object) animation object
     - value (number) number of milliseconds from the beginning of the animation
     **
     = (object) original element if `value` is specified
     * Note, that during animation following events are triggered:
     *
     * On each animation frame event `anim.frame.<id>`, on start `anim.start.<id>` and on end `anim.finish.<id>`.
    \*/
    elproto.setTime = function (anim, value) {
        if (anim && value != null) {
            this.status(anim, mmin(value, anim.ms) / anim.ms);
        }
        return this;
    };
    /*\
     * Element.status
     [ method ]
     **
     * Gets or sets the status of animation of the element.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     - value (number) #optional 0 – 1. If specified, method works like a setter and sets the status of a given animation to the value. This will cause animation to jump to the given position.
     **
     = (number) status
     * or
     = (array) status if `anim` is not specified. Array of objects in format:
     o {
     o     anim: (object) animation object
     o     status: (number) status
     o }
     * or
     = (object) original element if `value` is specified
    \*/
    elproto.status = function (anim, value) {
        var out = [],
            i = 0,
            len,
            e;
        if (value != null) {
            runAnimation(anim, this, -1, mmin(value, 1));
            return this;
        } else {
            len = animationElements.length;
            for (; i < len; i++) {
                e = animationElements[i];
                if (e.el.id == this.id && (!anim || e.anim == anim)) {
                    if (anim) {
                        return e.status;
                    }
                    out.push({anim: e.anim, status: e.status});
                }
            }
            if (anim) {
                return 0;
            }
            return out;
        }
    };
    /*\
     * Element.pause
     [ method ]
     **
     * Stops animation of the element with ability to resume it later on.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
    elproto.pause = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.pause." + this.id, this, animationElements[i].anim) !== false) {
                animationElements[i].paused = true;
            }
        }
        return this;
    };
    /*\
     * Element.resume
     [ method ]
     **
     * Resumes animation if it was paused with @Element.pause method.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
    elproto.resume = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            var e = animationElements[i];
            if (eve("anim.resume." + this.id, this, e.anim) !== false) {
                delete e.paused;
                this.status(e.anim, e.status);
            }
        }
        return this;
    };
    /*\
     * Element.stop
     [ method ]
     **
     * Stops animation of the element.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
    elproto.stop = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.stop." + this.id, this, animationElements[i].anim) !== false) {
                animationElements.splice(i--, 1);
            }
        }
        return this;
    };
    elproto.toString = function () {
        return "Rapha\xebl\u2019s object";
    };

    // Set
    var Set = function (items) {
        this.items = [];
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    },
    setproto = Set.prototype;
    /*\
     * Set.push
     [ method ]
     **
     * Adds each argument to the current set.
     = (object) original element
    \*/
    setproto.push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    /*\
     * Set.pop
     [ method ]
     **
     * Removes last element and returns it.
     = (object) element
    \*/
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    /*\
     * Set.forEach
     [ method ]
     **
     * Executes given function for each element in the set.
     *
     * If function returns `false` it will stop loop running.
     **
     > Parameters
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Set object
    \*/
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i]) === false) {
                return this;
            }
        }
        return this;
    };
    for (var method in elproto) if (elproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname][apply](el, arg);
                });
            };
        })(method);
    }
    setproto.attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name.length; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    setproto.animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items.length,
            i = len,
            item,
            set = this,
            collector;
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        var anim = params instanceof Animation ? params : R.animation(params, ms, easing, collector);
        item = this.items[--i].animate(anim);
        while (i--) {
            this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim);
        }
        return this;
    };
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    setproto.getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            w.push(box.x + box.width);
            h.push(box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Rapha\xebl\u2018s set";
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family].push(fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    paperproto.getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font.length; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    paperproto.print = function (x, y, string, font, size, origin, letter_spacing) {
        origin = origin || "middle"; // baseline|middle
        letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
        var out = this.set(),
            letters = Str(string).split(E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters.length; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + (font.w * letter_spacing) : 0;
                curr && curr.d && out.push(this.path(curr.d).attr({fill: "#000", stroke: "none", transform: [["t", shift, 0]]}));
            }
            out.scale(scale, scale, top, height).translate(x - top, y - height);
        }
        return out;
    };

    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.ninja = function () {
        oldRaphael.was ? (g.win.Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    /*\
     * Raphael.el
     [ property (object) ]
     **
     * You can add your own method to elements. This is usefull when you want to hack default functionality or
     * want to wrap some common transformation or attributes in one method. In difference to canvas methods,
     * you can redefine element method at any time. Expending element methods wouldn’t affect set.
     > Usage
     | Raphael.el.red = function () {
     |     this.attr({fill: "#f00"});
     | };
     | // then use it
     | paper.circle(100, 100, 20).red();
    \*/
    R.el = elproto;
    R.st = setproto;
    // Firefox <3.6 fix: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
    (function (doc, loaded, f) {
        if (doc.readyState == null && doc.addEventListener){
            doc.addEventListener(loaded, f = function () {
                doc.removeEventListener(loaded, f, false);
                doc.readyState = "complete";
            }, false);
            doc.readyState = "loading";
        }
        function isLoaded() {
            (/in/).test(doc.readyState) ? setTimeout(isLoaded, 9) : eve("DOMload");
        }
        isLoaded();
    })(document, "DOMContentLoaded");

    oldRaphael.was ? (g.win.Raphael = R) : (Raphael = R);

    /*
     * Eve 0.2.1 - JavaScript Events Library
     *
     * Copyright (c) 2010 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
     * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
     */

    var eve = R.eve = (function () {
        var version = "0.2.1",
            has = "hasOwnProperty",
            separator = /[\.\/]/,
            wildcard = "*",
            events = {n: {}},
            eve = function (name, scope) {
                var e = events,
                    args = Array.prototype.slice.call(arguments, 2),
                    listeners = eve.listeners(name),
                    errors = [];
                for (var i = 0, ii = listeners.length; i < ii; i++) {
                    try {
                        listeners[i].apply(scope, args);
                    } catch (ex) {
                        errors.push({error: ex && ex.message || ex, func: listeners[i]});
                    }
                }
                if (errors.length) {
                    return errors;
                }
            };
        eve.listeners = function (name) {
            var names = name.split(separator),
                e = events,
                item,
                items,
                k,
                i,
                ii,
                j,
                jj,
                nes,
                es = [e],
                out = [];
            for (i = 0, ii = names.length; i < ii; i++) {
                nes = [];
                for (j = 0, jj = es.length; j < jj; j++) {
                    e = es[j].n;
                    items = [e[names[i]], e[wildcard]];
                    k = 2;
                    while (k--) {
                        item = items[k];
                        if (item) {
                            nes.push(item);
                            out = out.concat(item.f || []);
                        }
                    }
                }
                es = nes;
            }
            return out;
        };
        eve.on = function (name, f) {
            var names = name.split(separator),
                e = events;
            for (var i = 0, ii = names.length; i < ii; i++) {
                e = e.n;
                !e[names[i]] && (e[names[i]] = {n: {}});
                e = e[names[i]];
            }
            e.f = e.f || [];
            for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                return false;
            }
            e.f.push(f);
        };
        eve.unbind = function (name, f) {
            var names = name.split(separator),
                e,
                key,
                splice,
                cur = [events];
            for (var i = 0, ii = names.length; i < ii; i++) {
                for (var j = 0; j < cur.length; j += splice.length - 2) {
                    splice = [j, 1];
                    e = cur[j].n;
                    if (names[i] != wildcard) {
                        if (e[names[i]]) {
                            splice.push(e[names[i]]);
                        }
                    } else {
                        for (key in e) if (e[has](key)) {
                            splice.push(e[key]);
                        }
                    }
                    cur.splice.apply(cur, splice);
                }
            }
            for (i = 0, ii = cur.length; i < ii; i++) {
                e = cur[i];
                while (e.n) {
                    if (f) {
                        if (e.f) {
                            for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                                e.f.splice(i, 1);
                                break;
                            }
                            !e.f.length && delete e.f;
                        }
                        for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                            var funcs = e.n[key].f;
                            for (i = 0, ii = funcs.length; i < ii; i++) if (funcs[i] == f) {
                                funcs.splice(i, 1);
                                break;
                            }
                            !funcs.length && delete e.n[key].f;
                        }
                    } else {
                        delete e.f;
                        for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                            delete e.n[key].f;
                        }
                    }
                    e = e.n;
                }
            }
            return true;
        };
        eve.version = version;
        eve.toString = function () {
            return "You are running Eve " + version;
        };
        return eve;
    })();
})();var aut = {};

aut.b = {path: 'm629.35706,98.46873l-2.26416,2.25526l-2.1803,2.17171l-0.83868,-1.00232l-3.68976,1.33644l1.00629,2.83994l-0.16772,2.67287l-1.00629,1.33643l-1.84491,-1.33643l-3.35431,-2.33878l-2.8512,0l-2.68359,2.33878l-2.01257,2.83997l-3.52209,2.00462l-3.18665,1.33648l-2.51581,1.33643l-0.16766,3.6752l-0.6709,2.00465l-2.51575,1.33644l-2.18036,1.00233l0,2.83994l-1.67719,1.5035l-2.34808,1.8376l-1.67719,-1.67053l-3.18658,-2.00467l-2.01263,0.66824l-4.19299,0.83524l-2.34802,2.00467l-1.17401,1.67056l-2.34808,3.34106l0.50317,2.6729l0.50311,3.17407l-1.50946,2.50583l0,2.33878l-2.1803,-0.33411l-2.01263,1.83759l0,3.8423l0.6709,2.83994l0.50317,1.50346l1.50946,2.33882l1.84479,1.50348l2.85126,2.83995l1.17401,1.50351l0.16772,1.83757l-1.50946,1.83763l0,2.00467l-0.67084,1.8376l-1.67719,1.33641l-0.33545,2.00464l0.16772,3.34111l2.68353,2.6729l-1.00635,2.67288l-2.34802,2.6729l-2.68353,2.17174l-2.8512,2.5058l-3.18658,0.33415l-3.85754,0.33412l0.16766,0.16704l-2.34802,3.84224l-2.51581,3.50818l-1.84491,-3.67525l-1.67719,0l0,1.33647l-0.16766,2.17169l-1.3418,0.8353l1.17407,3.6752l1.50946,3.67523l1.00629,2.83992l1.67719,3.67522l0.67084,3.84227l0.16779,3.17406l1.34174,2.33876l1.50946,2.00465l0.16766,1.83763l0,2.83989l-1.00629,3.84227l0.50317,3.00703l2.68347,2.83989l2.8512,1.83762l-0.16772,3.34111l-1.67712,2.50584l-1.84491,3.34108l-1.84491,3.00697l-1.34174,2.6729l-1.17401,0.16705l-2.51581,2.00464l0.33545,4.34344l1.17401,1.67053l1.84491,1.67056l0,2.00464l0,0.26065l1.84436,-1.26297l3.18665,-2.50583l3.18665,-0.8353l3.18665,-4.84457l1.67719,-2.17175l0.67084,-2.67282l3.01892,-0.33412l0.67096,-1.50351l0.6709,-2.17174l1.67731,-1.67053l0.67084,-2.00467l0.33539,-2.00465l1.17407,1.00235l1.34174,0l2.8512,-1.1694l2.18036,0.66821l2.01263,-1.16937l2.51575,1.50349l1.50946,-1.16939l1.34174,0.33409l3.18665,-0.16705l0.83856,-0.83528l-0.83856,-1.16937l-2.34808,-0.66823l-2.8512,0l0.50317,-1.83762l4.19293,-1.8376l1.17407,-2.33876l-2.51581,0l-1.84491,-3.17406l1.50952,-1.67056l1.34174,-1.50348l1.00629,-0.66823l0.83856,-1.8376l-1.17401,-1.50351l-2.18036,0.16707l-3.01892,2.17171l-0.83856,-3.00699l1.00629,-1.33644l-1.00629,-1.83762l-1.34174,0l-1.17401,-2.50581l1.17401,-1.83762l0.16772,-5.01164l-0.16772,-3.17406l1.34174,-2.33879l-0.16772,-4.17638l-2.34802,-0.50114l0.50311,-4.67755l-1.00629,-3.17406l0.83856,-1.67056l1.50946,0l2.34808,2.33876l2.01257,-2.33876l3.8576,-0.16704l5.53467,-5.17871l2.01257,-2.50586l-0.83856,-2.17169l-0.6709,-2.50583l2.34808,-1.00235l1.84491,-1.50348l-0.16791,-2.8399l-3.68982,-2.33875l-0.33545,-4.67758l-3.35431,-2.83992l-2.85126,1.16936l-6.54102,-2.5058l-2.34802,0.83528l-5.87012,-2.33879l1.67719,-2.50583l2.1803,0l1.67719,-2.83989l4.02533,-2.17175l-1.17395,-3.007l0.8385,-1.83757l3.68982,0l2.68341,-1.33649l2.68353,2.00468l2.8512,-0.16705l0.50311,1.16937l1.50952,0l1.34167,0.8353l1.00635,2.67288l2.1803,1.16936l6.20563,1.67059l2.01263,-5.84694l2.01263,3.17406l11.9079,-3.50816l4.86383,-0.16704l-2.01263,-3.34111l0.16772,-5.01164l-1.84485,-2.00467l-0.16772,-1.50348l0.83856,-1.83763l-1.00629,-1.83762l-4.19293,-3.00699l0,-1.0023l3.85748,-0.83531l2.8512,-3.34109l-0.33545,-5.1787l0.83862,-2.83994l-0.6709,-1.8376l3.85754,-5.51279l-1.3418,-1.67059l-4.86377,-0.16703l-0.83862,-3.84227l-0.16772,-3.84229l-0.50311,-2.50582l-0.91272,-1.1189',
name: "Burgenland",
big: 'm388.15115,7.62967l-4.34497,4.32793l-4.18405,4.16752l-1.60944,-1.92347l-7.08072,2.56466l1.93109,5.44992l-0.32187,5.12928l-1.93109,2.56466l-3.54041,-2.56466l-6.43701,-4.48819l-5.4715,0l-5.14987,4.48819l-3.86215,5.44995l-6.75897,3.84691l-6.11523,2.56475l-4.82788,2.56462l-0.32175,7.05278l-1.28748,3.84694l-4.82776,2.56469l-4.18417,1.92347l0,5.44992l-3.21854,2.88523l-4.50601,3.5264l-3.21857,-3.20579l-6.11511,-3.847l-3.86227,1.28237l-8.04645,1.60284l-4.50589,3.847l-2.25296,3.20584l-4.50601,6.41154l0.96561,5.12937l0.96548,6.09111l-2.8967,4.80873l0,4.48819l-4.18402,-0.64119l-3.86227,3.52639l0,7.37345l1.28745,5.44989l0.96561,2.88518l2.89667,4.48824l3.54019,2.88521l5.47162,5.44992l2.25296,2.88527l0.32187,3.52632l-2.8967,3.52646l0,3.847l-1.28735,3.52638l-3.21854,2.56461l-0.64374,3.84694l0.32187,6.41165l5.14975,5.12935l-1.93121,5.12932l-4.50589,5.12933l-5.14975,4.16759l-5.4715,4.80867l-6.11514,0.64127l-7.40268,0.64116l0.32175,0.32059l-4.50591,7.37331l-4.82788,6.73225l-3.54042,-7.05284l-3.21855,0l0,2.56474l-0.32175,4.16753l-2.57494,1.60289l2.25307,7.05284l2.89668,7.05284l1.93109,5.44983l3.21855,7.05284l1.28734,7.37337l0.32199,6.09105l2.57481,4.48816l2.89668,3.847l0.32175,3.52641l0,5.44983l-1.93108,7.37338l0.96561,5.77051l5.14963,5.44983l5.47151,3.52643l-0.32187,6.41162l-3.21844,4.80881l-3.54042,6.41162l-3.54041,5.77042l-2.57483,5.1293l-2.25294,0.32059l-4.82788,3.84692l0.64372,8.33517l2.25296,3.20572l3.54042,3.20584l0,3.84695l0,0.50018l3.53935,-2.42368l6.11525,-4.80865l6.11523,-1.60315l6.1152,-9.29663l3.21869,-4.16766l1.28735,-5.12924l5.79337,-0.6412l1.2876,-2.88528l1.28745,-4.16763l3.21902,-3.20578l1.28735,-3.84698l0.64362,-3.84689l2.25308,1.92352l2.5748,0l5.4715,-2.24411l4.18417,1.28232l3.86227,-2.24405l4.82776,2.88522l2.8967,-2.24411l2.5748,0.64114l6.11523,-0.32059l1.60922,-1.60287l-1.60922,-2.24411l-4.50601,-1.28232l-5.4715,0l0.96561,-3.52643l8.04633,-3.5264l2.25305,-4.4881l-4.82788,0l-3.54041,-6.09113l2.89679,-3.20584l2.57483,-2.88519l1.93106,-1.28232l1.60922,-3.52643l-2.25293,-2.88527l-4.18417,0.32065l-5.79337,4.16753l-1.60922,-5.77048l1.93109,-2.56464l-1.93109,-3.52641l-2.5748,0l-2.25296,-4.80873l2.25296,-3.52643l0.32187,-9.61742l-0.32187,-6.09109l2.5748,-4.48816l-0.32187,-8.01457l-4.50589,-0.96175l0.96548,-8.9763l-1.93109,-6.09105l1.60922,-3.20584l2.8967,0l4.50601,4.4881l3.86215,-4.4881l7.40283,-0.32059l10.62112,-9.93802l3.86218,-4.80879l-1.60922,-4.16751l-1.28748,-4.80875l4.5058,-1.92352l3.54041,-2.88521l-0.3222,-5.4498l-7.08084,-4.48813l-0.64374,-8.97638l-6.43698,-5.44986l-5.47174,2.24405l-12.55234,-4.8087l-4.50589,1.60292l-11.26489,-4.48819l3.21863,-4.80873l4.18408,0l3.21857,-5.44981l7.72467,-4.16763l-2.25284,-5.77047l1.6091,-3.52634l7.08084,0l5.14954,-2.56474l5.14975,3.847l5.4715,-0.32058l0.96548,2.24405l2.89679,0l2.57458,1.60298l1.93134,5.12929l4.18402,2.24404l11.90872,3.20588l3.86227,-11.22039l3.86218,6.09107l22.85147,-6.7322l9.3338,-0.32055l-3.86218,-6.41166l0.32175,-9.61744l-3.54028,-3.84697l-0.32175,-2.88521l1.6091,-3.52645l-1.93109,-3.52645l-8.04633,-5.77047l0,-1.92341l7.40259,-1.60298l5.4715,-6.4116l-0.64374,-9.93805l1.60934,-5.44989l-1.28748,-3.52639l7.40271,-10.57917l-2.57492,-3.20587l-9.33368,-0.32055l-1.60934,-7.37336l-0.32187,-7.37345l-0.96548,-4.80871l-1.75153,-2.14718'
};

aut.oo = {path: 'm279.74167,141.32516l0,-2.33879l-0.80771,-1.99875l0.13681,-0.34001l-2.1803,-2.00465l-4.19296,-2.50584l-1.67719,-3.67523l-1.17407,-4.34341l1.67722,-0.83529l2.34805,0.33411l-0.16769,-2.00467l1.17401,-1.67053l2.68347,-1.33643l0.33542,-2.17173l0,-2.17171l2.01263,-1.16938l3.01895,0l2.68347,-0.5012l2.18033,-0.50115l0.83862,-1.50347l1.67719,-2.83997l0.67087,-1.67054l2.18033,-0.33412l2.51578,0l1.34174,-0.83526l1.00632,-1.00233l1.84494,-0.16705l1.67715,-1.50351l2.8512,-1.33644l6.54102,-0.16705l2.01263,-0.66823l3.68976,-2.67286l2.51578,-2.83994l2.34808,-2.50584l1.67722,-2.00468l0.50311,-2.00462l0.6709,-1.67056l0.50311,-1.67055l0,-2.50581l-0.16769,-2.33877l0,-2.00468l0.50317,-2.00465l1.67715,-2.50583l-1.17401,-3.007l-0.83862,-2.33877l0,-1.83759l1.67725,-1.33646l2.34799,-1.00234l2.51578,-0.66821l2.18045,1.50349l1.34174,1.33643l2.0126,-0.66819l1.17395,-0.16705l1.50946,1.16938l2.6835,0.16705l0.67087,1.33643l1.00638,1.1694l2.51578,1.50349l1.50949,0.66824l1.17404,-1.50349l0.33542,-4.17638l2.1803,-0.3341l2.68353,-2.50585l0,-2.67288l2.01251,-2.33876l-1.84488,-8.1857l1.34183,-2.00466l-3.52206,-2.83993l1.50943,-1.83762l0.6709,-1.67057l0.67084,-2.67287l2.18036,0.3341l2.34805,0.16708l6.54102,5.34575l3.35437,0.33413l2.34805,3.50815l2.34805,1.50349l0,2.00465l-2.51578,1.16939l0,1.50349l1.67719,1.50349l0.16769,1.33646l3.01895,1.67054l10.23074,0.16705l2.68347,1.50349l2.51581,0.16708l2.18036,0.3341l2.18036,0.66823l2.51581,1.67055l2.51572,-2.67287l1.84488,-2.17171l2.01263,0.16705l1.50952,-3.3411l0,-3.67522l3.35431,-0.83528l2.0126,2.33877l2.18036,1.00234l2.18033,1.00233l1.67722,-1.67056l1.67719,-1.33645l1.50943,0.83529l0.5032,2.00467l2.68347,0l0.83856,2.67288l2.51581,0.16703l0.16769,-0.16703l0,1.83761l2.85123,0l2.8512,0.50114l3.35437,1.33643l3.01892,1.00234l3.68979,0.33411l3.18668,2.00467l-0.50317,1.83762l-1.67719,0.16705l-1.50943,2.17171l-0.5032,1.50349l0.5032,1.67057l3.85751,3.00696l1.67715,0.66825l0.16776,4.17638l2.01254,0l0,1.16938l0.16776,3.17402l-0.16776,1.67057l1.3418,2.17171l0.33542,2.50584l-0.16769,3.84225l0.16769,3.34109l0.50314,5.34578l-1.17398,-0.66823l-1.50946,-0.66821l-1.34174,-1.16936l-1.84494,0.16704l-1.50946,0.16705l-1.67722,1.16938l-2.18042,2.33878l-1.67706,2.17171l-1.67728,0.66824l-2.01251,0.50114l-1.84491,0.50119l-2.01263,0.50114l-3.01892,0.8353l-3.35434,-1.00233l-1.17404,-0.83529l-1.84491,-2.00466l-2.01263,-2.17168l-0.50311,-1.33646l-2.34808,-0.16705l-3.01895,-0.33411l-3.35434,2.67287l-0.33542,3.007l0.33542,3.50816l-0.83859,3.34111l1.67722,3.17406l-0.6709,1.16938l-0.83856,2.33878l-1.50949,3.17405l0.6709,2.50581l3.35437,2.67287l1.84491,1.50351l1.84491,1.50349l1.84491,0.33411l1.67722,1.00233l1.34174,1.33644l2.51581,2.00464l2.6835,0.83531l2.01257,0.83524l1.84488,0l2.68353,1.16937l3.01892,2.50586l0.50311,2.67288l-1.34177,1.00232l0,2.33879l-1.17404,2.5058l-0.83856,1.50351l0,2.00464l1.17398,3.17407l-0.50308,3.00699l-1.84488,1.67053l-2.68353,3.17406l-3.01889,1.33647l-4.52838,1.67055l-2.18033,0.83525l-4.19299,1.67056l0.16772,1.67055l-1.17404,1.67059l-2.68344,0.16704l-1.84494,0l-1.17401,1.00232l-2.18036,3.34111l-0.67084,1.67053c0,0 -1.67728,0.50121 -2.34805,0.50121c-0.6709,0 -2.18036,0 -2.18036,0l-5.19925,-0.66823l-1.84488,-1.16939l-2.01263,-2.33879l-1.34177,0l-2.34805,0.50116l-1.17404,1.83763l-2.1803,0.16704l-2.68353,0.33415l-1.00632,2.33876l-1.34174,-0.16711l0.16763,-2.17165l-0.33542,-1.67059l-2.85123,-2.50581l-2.8512,-2.5058l-0.33542,0l-3.18665,0.83525l-1.17404,-1.1694l-0.83859,0.16705l-3.01892,-0.33411l-1.3418,-0.33409l-3.01886,-2.17172l-2.68353,2.00467l-3.85751,2.17174l-5.53467,3.34108l-0.33545,0.83528l-0.16769,3.00699l0,2.67288l0,2.33876l0.33542,2.17174l1.00632,1.83763l1.84488,1.50345l1.67728,2.00467l0.67087,1.83763l0,2.67288l-0.50317,0.50113l-2.18033,1.50354l-0.50311,1.50345l-0.50317,1.83763l-2.18036,-0.50116l-3.85751,-0.50113l-3.35437,-0.83531l0.16772,0l-3.01889,-2.00464l-2.68353,-2.17172l-3.52206,-2.17171l-0.16772,-2.83995l1.00632,-3.00699l1.50946,-2.67288l-0.33542,-2.67288l-1.17404,-1.16936l1.67715,-5.17874l1.50952,-4.67755l-0.33548,-2.17171l-1.17404,-0.50113l-2.8512,-0.33415l-3.35437,-2.00464l-2.0126,-1.67056l0,-0.66821l7.21185,0l1.00632,-1.00232l-0.16769,-1.50351l-4.36069,-2.00467l-6.03784,-0.50113l-2.8512,0.16704l-4.19299,0l-1.67712,-3.17407l-2.01257,-6.34807l-1.3418,-5.17874l1.17398,-4.00928l4.19296,0.16704l2.18033,0.16705l0,-2.17172l-1.34174,-2.00467l-3.35437,-0.6682l-3.35434,0.50113l-2.18036,2.00468l-5.5347,0.16704l-5.70242,-0.83531l-3.68979,-3.34108l-1.67719,-1.67053l-3.18665,0.16705l-2.6835,0.8353l-1.84491,0.16702l-0.67084,1.67055l-1.00632,2.83995l-4.87344,1.30067',
name: "Oberösterreich",
big: 'm155.61099,212.17784l0,-4.67145l-1.6133,-3.99217l0.27327,-0.67915l-4.35484,-4.00404l-8.37488,-5.00505l-3.34995,-7.34077l-2.34505,-8.67538l3.35001,-1.66838l4.68991,0.66739l-0.33495,-4.00406l2.34492,-3.33665l5.35988,-2.66936l0.66995,-4.33775l0,-4.33768l4.01996,-2.33566l6.02994,0l5.35986,-1.0011l4.35492,-1.00096l1.67503,-3.00296l3.34995,-5.67244l1.33997,-3.3367l4.3549,-0.66736l5.02492,0l2.67993,-1.6683l2.00998,-2.00201l3.68503,-0.33366l3.34988,-3.00307l5.69487,-2.66936l13.06479,-0.33366l4.01996,-1.33469l7.36978,-5.33866l5.02492,-5.67241l4.68999,-5.00508l3.35001,-4.00408l1.0049,-4.00393l1.34003,-3.33672l1.0049,-3.33669l0,-5.00502l-0.33495,-4.67136l0,-4.00408l1.00502,-4.00402l3.34988,-5.00505l-2.34492,-6.00608l-1.67503,-4.67135l0,-3.67033l3.35007,-2.66942l4.68979,-2.00203l5.02492,-1.33467l4.35516,3.00299l2.67999,2.66936l4.01984,-1.33463l2.34482,-0.33366l3.01492,2.33569l5.35992,0.33367l1.33997,2.66932l2.01016,2.33572l5.02493,3.00303l3.01498,1.33472l2.345,-3.00303l0.66995,-8.34174l4.35486,-0.66733l5.35999,-5.00511l0,-5.33868l4.01965,-4.67136l-3.68491,-16.34981l2.68018,-4.00405l-7.03482,-5.67238l3.01486,-3.67039l1.34003,-3.33672l1.3399,-5.33869l4.35498,0.6673l4.68991,0.33373l13.06479,10.6774l6.69989,0.66736l4.68991,7.00708l4.68991,3.00299l0,4.00402l-5.0249,2.33569l0,3.00303l3.34995,3.00303l0.33493,2.66939l6.02994,3.33666l20.43445,0.33367l5.35986,3.00302l5.02499,0.33373l4.35504,0.6673l4.35495,1.33469l5.02499,3.33672l5.02478,-5.33871l3.68491,-4.33769l4.01996,0.33366l3.01508,-6.67338l0,-7.34074l6.69977,-1.66839l4.01984,4.67138l4.35501,2.00206l4.35492,2.002l3.35001,-3.33672l3.34995,-2.66936l3.01489,1.66839l1.00507,4.00405l5.35986,0l1.67493,5.33868l5.02499,0.33364l0.33493,-0.33364l0,3.67039l5.69495,0l5.69485,1.00097l6.69989,2.66933l6.02991,2.00203l7.36984,0.66733l6.36493,4.00408l-1.005,3.67039l-3.34995,0.33363l-3.01489,4.33772l-1.00507,3.00302l1.00507,3.33672l7.70486,6.00599l3.34988,1.33475l0.33505,8.34174l4.01981,0l0,2.33569l0.33505,6.33965l-0.33505,3.33675l2.68005,4.33769l0.66995,5.00505l-0.33496,7.67438l0.33496,6.67335l1.00494,10.67749l-2.34485,-1.33472l-3.01495,-1.33464l-2.67993,-2.33566l-3.68503,0.33366l-3.01492,0.33366l-3.35007,2.33566l-4.3551,4.67142l-3.34964,4.33769l-3.35019,1.33469l-4.01965,1.00098l-3.68497,1.00105l-4.01996,1.00096l-6.02988,1.6684l-6.69983,-2.00203l-2.345,-1.66835l-3.68494,-4.00406l-4.01996,-4.33763l-1.00491,-2.66939l-4.68997,-0.33366l-6.02994,-0.66733l-6.69983,5.33868l-0.66995,6.00607l0.66995,7.00705l-1.67499,6.67345l3.35001,6.33971l-1.34003,2.33569l-1.6749,4.67142l-3.01501,6.33971l1.34003,5.00499l6.69989,5.33871l3.68497,3.00307l3.68497,3.00305l3.68494,0.66733l3.35007,2.002l2.67993,2.66939l5.02499,4.00398l5.35992,1.6684l4.01984,1.66827l3.68491,0l5.35999,2.33566l6.02988,5.0051l1.00482,5.33873l-2.67999,2.00198l0,4.67139l-2.34497,5.00505l-1.67493,3.00305l0,4.00394l2.34488,6.33977l-1.00479,6.00612l-3.68494,3.33665l-5.35992,6.33972l-6.02985,2.66937l-9.0448,3.33673l-4.35492,1.66827l-8.37494,3.33676l0.33502,3.33667l-2.345,3.33679l-5.3598,0.33365l-3.685,0l-2.34494,2.00201l-4.35495,6.67337l-1.3399,3.33667c0,0 -3.35019,1.0011 -4.68994,1.0011c-1.34003,0 -4.35495,0 -4.35495,0l-10.3848,-1.33472l-3.68488,-2.33566l-4.01999,-4.67145l-2.67999,0l-4.68991,1.00101l-2.34497,3.67044l-4.35486,0.33362l-5.35999,0.66739l-2.00998,4.67139l-2.67993,-0.3338l0.33475,-4.33759l-0.66995,-3.33679l-5.69492,-5.00497l-5.69489,-5.005l-0.66995,0l-6.36487,1.66833l-2.345,-2.33572l-1.67499,0.33368l-6.02988,-0.66742l-2.68005,-0.66727l-6.02975,-4.33771l-5.35999,4.00406l-7.70486,4.33777l-11.05472,6.67331l-0.67001,1.6684l-0.33496,6.00598l0,5.33878l0,4.67133l0.66995,4.3378l2.00998,3.67038l3.68491,3.00293l3.35019,4.00406l1.33997,3.67038l0,5.33878l-1.00504,1.00089l-4.35489,3.00317l-1.00491,3.00287l-1.005,3.67044l-4.35498,-1.00101l-7.70486,-1.00092l-6.69989,-1.66846l0.33502,0l-6.02982,-4.004l-5.36002,-4.33771l-7.03482,-4.33768l-0.33502,-5.67236l2.00998,-6.0061l3.01495,-5.33865l-0.66995,-5.33881l-2.345,-2.33557l3.34988,-10.34384l3.01508,-9.34277l-0.67007,-4.33765l-2.345,-1.00101l-5.69485,-0.66739l-6.69991,-4.004l-4.0199,-3.3367l0,-1.33469l14.40468,0l2.00998,-2.00198l-0.33493,-3.00305l-8.70987,-4.00406l-12.05977,-1.00093l-5.69487,0.3336l-8.37494,0l-3.34982,-6.33971l-4.01984,-12.67943l-2.68005,-10.34383l2.34486,-8.008l8.37486,0.33368l4.3549,0.33366l0,-4.33778l-2.67993,-4.004l-6.69989,-1.33466l-6.69983,1.00093l-4.35497,4.00412l-11.05481,0.3336l-11.3898,-1.66846l-7.36986,-6.67331l-3.34995,-3.33665l-6.36488,0.33366l-5.35992,1.66838l-3.68497,0.3336l-1.3399,3.33667l-2.00998,5.67244l-9.73402,2.59795' 
};
aut.k = {path: 'm265.29065,252.69498l1.67722,-1.33644l0.50311,-2.5058l4.19299,2.00461l2.34802,1.50354l2.6835,1.67052l4.02527,0.50119l4.86377,0.66821l3.3544,0l3.68979,2.00467l3.68979,2.00467l3.68982,2.17169l4.02524,-0.83527l3.01889,0l3.52209,0.33411l4.02524,-1.50351l2.51581,-0.50116l0.67084,-2.33878l1.67719,-3.34111l3.68979,-1.00229l2.6835,1.00229l3.01895,1.67056l3.68976,0.33411l3.68979,0.16705l2.68353,0l3.52209,1.16939l1.67719,0.66824l4.02521,-0.16705l3.01892,0l1.84491,1.16937l2.0126,2.00467l2.18036,1.83759l2.68347,1.16937l3.68982,2.67291l0.50317,-0.16705l2.18033,3.50818l2.34805,1.67053l1.84491,0.83527l3.68979,-1.67053l1.00632,-2.33881l2.68347,-2.33878l2.34808,-1.16937l1.17401,-2.17172l1.17401,-2.33878l2.01263,-1.83759l2.51575,-1.00232l2.6835,-1.67059l2.68353,-1.33644l2.01257,-1.00232l2.18033,-0.33409l1.17401,0l1.50946,-0.50119l1.50943,-0.33409l1.00638,1.67056l1.17404,2.00464l2.18036,0.50119l2.34796,-0.16705l3.35437,-0.33414l1.00638,-0.33411l1.34174,3.17406l1.17404,0.66821l2.18033,0l2.18036,-1.1694l1.67712,-1.50348l1.67722,-1.16939l1.34174,0l1.50946,-0.50114l4.19296,-0.16705l1.50943,-0.83528l1.50949,0l2.0126,0.50114l1.50949,0l2.01254,-0.6682l1.84494,0l2.51581,-0.16708l2.34799,-0.33411l1.84491,-0.16704l2.18039,0l1.67706,-0.50114l3.01895,-1.1694l2.01263,-0.66823l2.0126,2.00468l2.68347,1.33644l1.67719,2.00464l1.84491,3.00699l1.84494,2.50583l2.51572,3.17404l1.34174,2.00467l0.16772,3.00699l-1.50946,2.67288l-0.6709,2.17169l0.5032,2.67291l1.00629,1.83755l1.17404,1.33646l1.00629,3.00702l0,4.00934l0.50317,3.84225l0.33542,1.3364l2.18036,0.83536l2.85123,2.33875l2.28885,1.31625l-0.6116,0.52133l-5.87021,1.33649l-1.84494,3.67517l-1.00632,1.6705l-3.35428,-3.50812l-2.01263,2.84l-4.86386,0.5011l-3.68979,13.19739l-6.87637,1.50351l-1.84488,4.51047l-2.18036,0.33414l-1.50949,2.50583l-6.37323,1.83755l0,4.34348l-1.50952,2.5058l-4.86383,-4.5105l-1.50946,1.50354l-2.34799,-1.00235l-2.01263,-1.33643l-2.01263,-2.17172l-6.20554,1.33646l-3.3544,1.16937l-2.34805,-1.16937l-5.36697,0.83527l-5.70242,0.83533l-3.68982,-5.34573l-5.53467,-0.66827l-5.03156,0.33414l-6.20557,-4.17636l-5.70245,0.16702l-4.02521,2.33881l-7.37961,-0.66821l-8.72134,-3.17404l-2.85123,1.67053l-2.68347,-2.5058l-2.68353,0.66818l-2.51572,-2.00464l-4.69614,1.50351l-3.01895,-2.0047l-7.37955,2.83997l-6.70874,0.33411l-7.21191,-3.6752l-7.715,-0.50116l-9.22452,-0.50116l-8.55365,0.16705l-7.21185,-3.84225l-1.67722,-0.83533l-5.19925,0.16705l-3.50409,-0.21808l0.52411,0.27322l0.46414,-1.72568c0,0 1.34183,-3.00702 2.18045,-3.50821c0.83844,-0.50116 1.17392,-4.17636 1.17392,-4.17636l0.16769,-4.34338l2.8512,0.16702l3.52209,0.16705l3.18661,-1.83762l3.68982,-2.17169l2.68353,2.33875l2.8512,0.33414l-0.67087,-3.84225l-2.51581,-2.5058l-2.68347,-3.67526l-3.01895,-2.5058l-2.51575,-2.83994l-0.33542,-3.67523l-1.34174,-3.6752l-3.18668,-0.50116l-1.17404,-2.84l-2.01263,-2.5058l0.83862,-3.17407l1.67715,-4.5105l-5.19922,-1.50348l-5.367,-1.16937l-1.00632,-4.00932',
name: "Kärnten",
big: 'm4.29089,54.517l4.95919,-3.95159l1.48761,-7.40914l12.39785,5.92723l6.94265,4.44566l7.93458,4.93938l11.90193,1.48193l14.3812,1.97578l9.9183,0l10.90997,5.92741l10.90998,5.92741l10.91007,6.42126l11.90184,-2.46972l8.92625,0l10.41415,0.9879l11.90182,-4.44559l7.43874,-1.48183l1.98355,-6.91531l4.95911,-9.879l10.90996,-2.96357l7.9346,2.96357l8.92642,4.93947l10.9099,0.98799l10.91,0.49394l7.93465,0l10.41417,3.4576l4.95909,1.97587l11.90175,-0.49393l8.92635,0l5.45502,3.4576l5.95087,5.92741l6.4469,5.43338l7.93451,3.4576l10.91006,7.90327l1.48776,-0.49393l6.44684,10.37299l6.94272,4.93944l5.45502,2.46971l10.90997,-4.93942l2.97549,-6.91541l7.93451,-6.91528l6.94281,-3.45761l3.47131,-6.42136l3.47134,-6.91529l5.95093,-5.43337l7.43857,-2.96368l7.93457,-4.93961l7.93469,-3.95159l5.95078,-2.96366l6.44681,-0.98784l3.47134,0l4.46317,-1.48193l4.46307,-0.98784l2.97568,4.93952l3.47141,5.92738l6.4469,1.48182l6.94244,-0.49394l9.91821,-0.98788l2.97568,-0.98788l3.96722,9.385l3.47144,1.97578l6.44678,0l6.4469,-3.4577l4.95889,-4.44548l4.95923,-3.4576l3.96725,0l4.46317,-1.48184l12.39774,-0.49394l4.46313,-2.46977l4.46329,0l5.95084,1.48178l4.46326,0l5.95068,-1.97572l5.45514,0l7.43872,-0.49403l6.94257,-0.98788l5.45502,-0.4939l6.44702,0l4.95868,-1.48178l8.92639,-3.45769l5.95093,-1.97581l5.95093,5.92744l7.93445,3.95159l4.95911,5.92731l5.45508,8.89107l5.45514,7.40925l7.43842,9.38503l3.96729,5.9274l0.49591,8.89107l-4.4632,7.90318l-1.9837,6.42126l1.48785,7.90327l2.97546,5.43329l3.47137,3.95164l2.9754,8.89116l0,11.85481l1.48779,11.36079l0.99176,3.95146l6.44684,2.46997l8.43054,6.91522l6.7677,3.89191l-1.80829,1.54147l-17.35712,3.95172l-5.45514,10.86676l-2.97546,4.93933l-9.91797,-10.3728l-5.95099,8.39731l-14.38135,1.48163l-10.9101,39.02209l-20.33197,4.44559l-5.45496,13.33655l-6.44684,0.98798l-4.46326,7.40924l-18.84442,5.43329l0,12.8428l-4.46341,7.40915l-14.38138,-13.33664l-4.46317,4.44565l-6.94254,-2.96375l-5.95096,-3.95154l-5.95099,-6.42136l-18.34851,3.95163l-9.9183,3.45761l-6.94272,-3.45761l-15.86911,2.46973l-16.86093,2.46988l-10.91006,-15.80618l-16.3649,-1.97595l-14.87735,0.98798l-18.34863,-12.34866l-16.86102,0.49384l-11.90173,6.91541l-21.82004,-1.97577l-25.78729,-9.38501l-8.43051,4.93942l-7.93452,-7.40918l-7.93465,1.97571l-7.43849,-5.92734l-13.88553,4.44562l-8.92648,-5.92749l-21.81985,8.39719l-19.83641,0.98788l-21.3242,-10.86682l-22.81173,-1.48187l-27.27507,-1.48181l-25.29146,0.49393l-21.32402,-11.36075l-4.9592,-2.46994l-15.37315,0.49396l-10.3609,-0.64481l1.54968,0.80786l1.37238,-5.10251c0,0 3.96751,-8.89113 6.44715,-10.37306c2.4791,-1.48181 3.47105,-12.34866 3.47105,-12.34866l0.49575,-12.84253l8.43043,0.49385l10.41413,0.49394l9.4222,-5.43347l10.91008,-6.42126l7.93467,6.91522l8.43042,0.98798l-1.98362,-11.36079l-7.43874,-7.40915l-7.93451,-10.86703l-8.92644,-7.40915l-7.43856,-8.39713l-0.99176,-10.86694l-3.96725,-10.86682l-9.42236,-1.48184l-3.47142,-8.39731l-5.95096,-7.40915l2.47964,-9.38511l4.95901,-13.33665l-15.37306,-4.4455l-15.86917,-3.4576l-2.97548,-11.85478'
};

aut.no = {path: 'm448.95261,1.125l-0.33719,2.84418l-1.00101,2.6763l1.84396,7.6825l-0.50577,2.50834l-0.66382,2.66578l0.32663,2.17252l-0.15802,2.00457l-1.01154,3.18006l0.67435,2.1725l1.16956,2.17252l-1.00098,2.1725l-1.01154,0l-1.84396,-1.00754l-4.36227,-0.6717l-4.85748,0l-0.84293,6.1817l-5.1947,5.52049l-1.18015,4.50245l0.33716,5.84583l-1.16956,4.00919l0.15805,-0.15744l0,1.83667l2.8555,0l2.85547,0.49327l3.35074,1.34338l3.02411,0.99705l3.6879,0.33585l3.18213,2.00457l-0.50577,1.83667l-1.67535,0.16792l-1.50677,2.17252l-0.50577,1.50082l0.50577,1.66874l3.85651,3.01212l1.67535,0.67168l0.16855,4.17709l2.01257,0l0,1.16498l0.16858,3.16954l-0.16858,1.67924l1.33817,2.16199l0.33716,2.50837l-0.16855,3.84126l0.16855,3.34795l0.5058,5.34207l-1.16959,-0.6717l-1.51733,-0.66119l-1.33817,-1.17548l-1.84396,0.16793l-1.50677,0.16792l-1.67526,1.17545l-2.18112,2.32995l-1.68591,2.1725l-1.67535,0.67168l-2.01254,0.50378l-1.84393,0.49328l-2.01257,0.50376l-3.01355,0.83962l-3.36124,-1.00755l-1.16959,-0.82912l-1.84396,-2.00459l-2.01257,-2.1725l-0.50577,-1.3434l-2.34967,-0.15743l-3.01355,-0.33584l-3.3613,2.66579l-0.3266,3.01212l0.3266,3.50539l-0.83237,3.33748l1.67535,3.18006l-0.67438,1.16496l-0.8324,2.34042l-1.5173,3.18005l0.67435,2.49786l3.35074,2.67628l1.85449,1.50081l1.8439,1.51132l1.84399,0.32535l1.67526,1.00754l1.33826,1.3329l2.51831,2.00459l2.68692,0.83963l2.01251,0.82912l1.84387,0l2.67639,1.17546l3.02408,2.50836l0.50577,2.66579l-1.34866,1.00754l0,2.34042l-1.16962,2.49785l-0.84299,1.51132l0,2.00458l1.18024,3.16957l-0.569,2.90718l0.73755,1.26991l1.84387,1.50081l2.01254,-1.66876l4.6889,0.16792l1.85446,0.33583l1.33823,0.66121l2.68689,2.34041c0,0 1.16428,0.16881 2.17059,0.33586c1.00629,0.16704 2.18112,-0.82913 2.18112,-0.82913l1.68591,-3.85173l2.01254,-0.49329l3.01355,-0.33586l2.01257,1.16496l1.67532,-0.49326l2.8555,-1.51132l3.18213,-1.33289l3.52985,-0.83961l1.3382,-3.84125l1.00101,-0.66121l1.68588,-1.83667l2.18115,0.49329l2.67636,-0.66119l1.50674,-1.51131l1.68591,-0.32536c0,0 1.50235,0 2.67636,0c1.17404,0 3.36127,3.16957 3.36127,3.16957l2.01251,2.50835c0,0 3.01703,0.33583 3.68793,0.33583c0.6709,0 3.35074,0.99707 3.35074,0.99707l2.3497,2.84419l3.51935,-0.50375l3.6879,0l1.51727,3.33746l2.01251,0.33585l2.67645,0.33583l3.02405,0l1.50677,4.17709l2.34973,5.67793l2.01251,-3.67332l3.51935,0.16792l1.18011,4.345l-0.33716,3.33749l3.51929,-0.33586l2.18115,1.83664l1.50671,2.34045l1.18018,2.50835l3.35071,0l3.85651,0l0.84296,1.16496l1.16962,0.67169l3.19263,-0.16792l2.01257,-2.00458l0.3266,5.17415l1.85449,1.84714l2.67639,2.49786l3.85645,-0.33583l3.19275,-0.32536l2.84491,-2.50835l2.68695,-2.1725l2.34967,-2.67627l1.00098,-2.6658l-2.67633,-2.67627l-0.16858,-3.33746l0.33716,-2.00461l1.67535,-1.34338l0.66382,-1.83667l0,-2.00458l1.51733,-1.83667l-0.16858,-1.83665l-1.18018,-1.50081l-2.84491,-2.84419l-1.84393,-1.50084l-1.51733,-2.34041l-0.49524,-1.50082l-0.67438,-2.84421l0,-3.84125l2.01257,-1.83667l2.18109,0.33586l0,-2.34044l1.50677,-2.50835l-0.50574,-3.16957l-0.49524,-2.67628l2.34973,-3.33746l1.16962,-1.66875l2.34973,-2.00458l4.19366,-0.83961l2.01251,-0.67171l3.18213,2.00458l1.67542,1.66875l2.34967,-1.83664l1.67535,-1.50082l0,-2.83369l2.18115,-1.00755l2.51831,-1.33289l0.67438,-2.00459l0.16858,-3.68384l2.50781,-1.33287l3.19263,-1.33292l3.51929,-2.00457l2.01257,-2.84422l2.68689,-2.34044l2.84497,0l3.36127,2.34044l1.84387,1.34339l1.00104,-1.34339l0.16864,-2.66578l-1.00104,-2.84422l3.68793,-1.33289l0.83234,0.99704l2.18115,-2.17249l2.2655,-2.25648l-0.06323,-0.11549l-1.19067,-1.46931l-1.50677,0l-2.01251,-0.6717l-2.18115,-2.32994l-1.84399,-0.33584l-1.01154,-3.51589l-0.67432,-2.49786l-1.00098,-2.67628l0,-3.84125l-2.51837,-0.67171l-0.67438,-0.99704l-1.84387,-2.34045l-0.66388,-3.01212l-4.36224,-2.32994l-1.01154,-3.01212l1.18005,-1.50082l-0.16852,-8.52212l2.01251,-4.34502l2.01257,-3.67332l2.34979,-4.00917l-1.67554,-4.68087l0,-2.49785l-0.84308,-2.84424l-2.85547,-9.02588l-2.50769,-3.00162l-3.52997,2.0046l-4.85742,0l-2.34973,-2.67629l-3.68793,-0.50377l-0.50574,1.51131l-1.67535,0.82914l-0.67438,-2.17253l0,-2.8337l-2.51831,-2.34043l-3.51935,1.66873l-6.20618,-3.33748l-2.51831,1.66875l-3.35071,-0.83961l-2.68689,7.52505l-3.68793,2.66578l-1.50677,-1.33287l-1.50677,0l-1.34869,2.00457l-1.16968,-1.16496l-0.8429,0l-5.53186,0.49326l-6.03766,-1.16496l-1.67529,1.33287l-3.68793,0l-11.58002,-6.5175l-1.67535,-2.66578l-9.38837,-4.8488l-4.53088,0l-0.33716,1.17546l-0.8324,1.66873l-6.03754,-0.50377l-0.84305,-1.16496l-2.01248,-1.34338l-2.85553,-1.50084l-4.18314,-0.50377l-4.86804,-0.99703l-3.18213,-4.34502l-4.02509,0l-6.54346,-3.18006l-3.02405,1.17546l-2.67636,-1.83665l-1.18011,5.17413l-3.85651,-0.16793l-2.51834,2.00459l-2.50775,-0.32536l1.67538,-3.01211l-2.18115,-3.33748l-5.86902,0l-1.34872,-1.34339l-6.03763,-0.33584l-0.00003,0.00003l0.00006,0.00008l0.00006,0.00002l0.00006,0.00005zm121.50064,74.7469c0.02258,-0.00241 0.05127,0.00203 0.07373,0c0.31122,0.1852 0.64276,0.33514 0.93781,0.54575c0.75586,0.23146 0.65991,0.92751 0.67438,1.56378c0.51611,0.74469 0.17371,1.71261 0.27399,2.56084c1.20551,0.84225 2.40417,1.69147 3.58252,2.57132c0.15656,0.22611 0.31171,0.27055 0.44257,0.22041c0.29272,-0.12489 0.48737,-0.75959 0.42145,-1.09151c0.01855,-0.56211 -0.37238,-1.30164 -0.15808,-1.7422c1.05487,-0.12222 2.08405,0.22945 2.97137,0.77665c0.85425,0.30913 0.20367,0.978 -0.02094,1.49031c-0.59369,0.66944 0.3764,0.84496 0.34778,1.50082c0.66974,0.21635 0.83899,0.95444 1.64374,0.86061c0.56879,-0.05495 1.11615,-0.3506 1.72803,-0.09443c-0.11127,1.06509 -0.56696,2.05239 -0.77972,3.09609c0.76361,-0.04176 0.78326,0.59798 1.42242,0.56674c-0.35651,0.85797 -0.50171,1.77365 -0.6322,2.68678c0.09216,0.7426 -0.24872,1.3772 -0.56897,2.02557c-0.36719,0.54276 -0.51019,1.12508 -0.27393,1.7527c0.30212,0.64651 0.23743,1.29108 -0.04218,1.93111c0.34045,0.44291 -0.30957,0.99677 -0.13696,1.61626c0.13226,0.7409 1.31165,0.25085 0.93781,-0.36733c0.17615,0.0132 0.29297,0.04353 0.35822,0.09443c0,0.00127 0.00891,0.00888 0.01013,0.01015c0,0.00127 0.00891,0.0089 0.01019,0.01016c0.00378,0.00253 0.00757,0.00761 0.01013,0.01015c0,0.00127 0.00891,0.00888 0.01019,0.01015c0.00378,0.00254 0.00885,0.00762 0.01013,0.01016c0,0.00127 0,0.00887 0,0.01015c0.14026,0.2791 -0.47229,0.85107 -0.23181,1.28042c0.01349,0.02296 0.034,0.0514 0.05267,0.07349c0.05139,0.05864 0.12592,0.11715 0.22131,0.16792c-0.00006,0.00254 -0.00006,0.00888 0,0.01015c0.00757,0.12903 0.12323,0.40536 0.27393,0.57722c0.06549,0.0726 0.14636,0.13005 0.22125,0.14693c0.021,0.00381 0.05255,0.00254 0.07379,0c0.09845,-0.01611 0.20679,-0.0985 0.29498,-0.30434c0.03235,0.11499 0.07971,0.20391 0.1264,0.26237c0.01526,0.01789 0.03632,0.03947 0.05267,0.05242c0.01422,0.01015 0.03748,0.02424 0.05267,0.03147c0.00507,0.00254 0.01587,0.00889 0.02094,0.01015c0.01019,0.0038 0.03094,0.00888 0.04218,0.01015c0.01141,0.00253 0.0307,-0.00067 0.04211,0c0.01447,0.00033 0.0376,0.00127 0.05267,0c0.21307,-0.02322 0.48535,-0.20927 0.80078,-0.36733c0.76154,-0.12733 0.79041,0.87464 0.37933,1.25942c0.48059,0.38239 0.64319,1.22519 0.3161,1.66875c0.14648,0.49789 0.14465,0.79539 0.04218,0.95506c-0.00635,0.00761 -0.01483,0.02411 -0.021,0.03148c-0.00378,0.00507 -0.01648,0.0165 -0.02087,0.02094c-0.01147,0.01015 -0.02936,0.02272 -0.04218,0.03148c-0.00763,0.00507 -0.02325,0.01662 -0.03174,0.02094c-0.51324,0.25138 -1.89545,-0.67487 -2.64478,-0.76614c-1.35907,-0.22478 -1.85193,-1.75336 -3.03461,-2.29845c-0.60193,-0.60241 -1.39612,-0.22198 -2.06519,0.02095c-0.62073,-0.20128 -0.93964,-0.25027 -1.43304,0.23088c-0.30048,-0.15252 -0.51105,-0.20687 -0.67438,-0.17842c-0.03784,0.00762 -0.08246,0.02628 -0.11584,0.04202c-0.01526,0.00761 -0.03851,0.02247 -0.05267,0.03147c-0.1756,0.11652 -0.30573,0.35777 -0.48474,0.66121c-0.58038,0.37278 -0.76202,1.00284 -1.32764,1.34338c-0.63257,1.00031 -1.70538,0.82336 -2.81329,0.81862c-0.59882,0.24034 0.17212,1.19934 -0.02094,1.73174c0.06305,0.34248 0.20209,0.65427 0.2002,0.82912c-0.00031,0.00887 -0.00891,0.02386 -0.01019,0.03146c0,0.00507 0,0.01638 0,0.02095c0,0.00507 -0.00891,0.01675 -0.01019,0.02094c0,0.00253 0,0.00887 0,0.01015c0,0.00254 -0.00885,0.00889 -0.01013,0.01015c-0.00757,0.01015 -0.02014,0.02398 -0.03174,0.03146c-0.00378,0.00101 -0.00885,0.0089 -0.01013,0.01016c-0.01752,0.00761 -0.04858,0.00761 -0.07373,0.01015c-0.10797,0.00636 -0.2923,-0.02995 -0.56897,-0.13644c-0.67499,-0.64787 -0.8634,0.47798 -1.59106,0.12592c-0.08734,0.19373 -0.17395,0.30666 -0.25287,0.35683c-0.00763,0.0051 -0.02362,0.0174 -0.03174,0.02094c-0.00763,0.00254 -0.02362,0.0089 -0.03174,0.01015c-0.01141,0.00253 -0.03131,-0.00027 -0.04218,0c-0.00757,-0.00014 -0.02356,0.00101 -0.03168,0c-0.00763,-0.00127 -0.02362,-0.00761 -0.03174,-0.01015c-0.01013,-0.0038 -0.03131,-0.00507 -0.04211,-0.01015c-0.00763,-0.00381 -0.02325,-0.01624 -0.03174,-0.02094c-0.18787,-0.11411 -0.39484,-0.40775 -0.67438,-0.56675c-0.86176,-0.06295 -1.49469,-0.80933 -2.38135,-0.66119c-0.93628,-0.29948 -2.01288,-0.29883 -2.82391,-0.8816c-0.83929,-0.3845 -1.80627,-0.48248 -2.66577,-0.8606c-0.03094,0.02055 -0.06689,0.0462 -0.09479,0.07349c-0.32416,0.32608 -0.44928,1.07327 -0.67438,1.5323c-0.02057,0.12952 -0.0575,0.22617 -0.09479,0.28338c-0.01715,0.02449 -0.04382,0.04861 -0.06323,0.06295c-0.00378,0.00127 -0.00891,0.00888 -0.01013,0.01015c-0.00385,0.00253 -0.01648,0.0089 -0.02094,0.01015c-0.00513,0.00253 -0.01654,0.00888 -0.021,0.01015c-0.00507,0.00127 -0.01611,-0.00127 -0.02087,0c-0.00513,0.00101 -0.01611,0.01015 -0.021,0.01015c-0.08032,0.01143 -0.1748,-0.00634 -0.25287,0.01016c-0.00507,0.00098 -0.01648,-0.00127 -0.02094,0c-0.00525,0.00127 -0.01654,0.00888 -0.02112,0.01015c-0.00385,0.00253 -0.01691,0.00762 -0.02094,0.01015c-0.00385,0.00127 -0.00891,0.00888 -0.01019,0.01015c-0.01685,0.0127 -0.03784,0.0325 -0.05267,0.05243c-0.05304,0.07665 -0.09174,0.21359 -0.10535,0.45129c-0.01141,0.15149 -0.05902,0.24313 -0.11578,0.28336c-0.02301,0.01409 -0.05609,0.02018 -0.08435,0.02095c-0.29816,-0.00507 -0.85187,-0.66124 -1.09583,-0.8606c0.07123,-0.38107 -0.01813,-0.57864 -0.18964,-0.68221c-0.22858,-0.13152 -0.6012,-0.12552 -0.94836,-0.2099c-0.01483,0.01015 -0.03748,0.02335 -0.05267,0.03149c-0.00507,0.00253 -0.01581,0.00761 -0.02094,0.01015c-0.63348,0.27451 -1.53253,-1.21774 -2.46564,-0.33585c-0.94171,0.83849 -2.46515,-0.28724 -3.45605,0.70319c-0.52057,0.27885 -1.14758,0.73035 -1.66486,0.34634c0.3042,-0.63754 1.07648,-0.50251 1.62268,-0.76616c0.34534,-0.07552 0.60907,-0.21732 0.73761,-0.40932c0.00885,-0.01472 0.02356,-0.03719 0.03174,-0.05241c0.02252,-0.0462 0.0448,-0.10572 0.05267,-0.15743c0.01746,-0.13535 -0.01855,-0.29173 -0.11591,-0.46178c-0.57239,0.0957 -1.14966,0.14007 -1.71753,0.26237c0.00635,-0.6414 -0.74072,-0.99183 -0.84296,-1.64775c-0.12543,-0.12798 -0.18951,-0.23653 -0.21075,-0.31486c-0.00378,-0.00889 -0.00885,-0.02335 -0.01013,-0.03148c-0.00018,-0.00254 0.00012,-0.00888 0,-0.01015c-0.00006,-0.00256 -0.00006,-0.0089 0,-0.01016c0.00006,-0.00253 -0.00018,-0.00889 0,-0.01015c0.00018,-0.00127 -0.00024,-0.00887 0,-0.01015c0.00031,-0.00127 0.01013,-0.00889 0.01013,-0.01016c0,-0.00127 0,-0.00887 0,-0.01015c0,-0.00127 0,-0.00889 0,-0.01015c0.00378,-0.00507 0.00763,-0.0165 0.01019,-0.02094c0,-0.00127 0.00885,-0.00888 0.01013,-0.01015c0.1828,-0.24205 1.14392,-0.14162 1.38037,-0.49327c0.00507,-0.0089 0.01648,-0.02259 0.02094,-0.03148c0.00378,-0.00507 0.00885,-0.01637 0.01013,-0.02094c0.00378,-0.00507 0.00885,-0.01611 0.01013,-0.02094c0.00385,-0.00761 -0.00378,-0.02386 0,-0.03148c0,-0.00761 0.00891,-0.02336 0.01019,-0.03147c0,-0.00509 -0.00031,-0.01536 0,-0.02094c-0.71808,-0.05952 -1.42804,-0.14618 -2.13898,-0.26239c-0.12921,0.06651 -0.24219,0.09798 -0.32666,0.10497c-0.02667,0.00127 -0.0614,0.00381 -0.08429,0c-0.00507,-0.00101 -0.01611,0.00127 -0.02094,0c-0.00507,-0.00127 -0.01648,-0.00889 -0.02094,-0.01015c-0.00385,-0.00127 -0.01685,-0.00888 -0.02094,-0.01015c-0.00385,-0.00101 -0.00891,0.00098 -0.01013,0c-0.00385,-0.00101 -0.00891,-0.0089 -0.01019,-0.01016c-0.00378,-0.00253 -0.01727,-0.00761 -0.02094,-0.01015c-0.00378,-0.00127 -0.00891,-0.0089 -0.01013,-0.01015c-0.00385,-0.00127 -0.00891,-0.00888 -0.01019,-0.01015c-0.00378,-0.00381 -0.00763,-0.00762 -0.01013,-0.01016c-0.25555,-0.2867 -0.06842,-1.24268 -0.43207,-1.71072c-0.07092,-0.08847 -0.16516,-0.165 -0.28442,-0.20992c-0.54071,-0.04264 -0.77679,-0.13978 -0.84302,-0.27288c-0.1181,-0.2731 0.42786,-0.7075 0.45313,-1.19643c0.29004,-0.38795 0.85602,-0.75227 1.08527,-1.19646c0.46613,-0.27518 0.38605,-1.04173 0.49524,-1.55329c0.22522,-0.59425 0.54822,-1.07923 -0.04211,-1.55329c0.2337,-0.23694 0.50366,-0.45956 0.60059,-0.6507c0.00763,-0.01485 0.01617,-0.03796 0.02094,-0.05244c0.00378,-0.01447 0.00891,-0.0382 0.01019,-0.05241c0,-0.01143 0,-0.03084 0,-0.04201c-0.00385,-0.02221 -0.01147,-0.05203 -0.02094,-0.07349c-0.00891,-0.01865 -0.02631,-0.04493 -0.04218,-0.06296c-0.00507,-0.00507 -0.01587,-0.01598 -0.02094,-0.02094c-0.07294,-0.06562 -0.19537,-0.13187 -0.37927,-0.18893c-0.01898,0.01141 -0.04443,0.02322 -0.06323,0.03147c-0.01141,0.00381 -0.03137,0.00761 -0.04218,0.01015c-0.00763,0.00254 -0.02362,0.00888 -0.03168,0.01015c-0.00763,0.00127 -0.02362,0.0089 -0.0318,0.01016c-0.01013,0.00127 -0.03131,-0.00025 -0.04211,0c-0.50067,0.00127 -0.95081,-0.99244 -0.62164,-1.33289c0.00378,-0.00127 0.00891,-0.0089 0.01013,-0.01015c0.00385,-0.00127 0.00891,-0.00888 0.01019,-0.01015c0.00378,-0.00381 0.01685,-0.00761 0.02094,-0.01015c0.00378,-0.00127 0.00885,-0.00887 0.01013,-0.01015c0.00378,-0.00254 0.01654,-0.00761 0.021,-0.01015c0.00507,-0.00254 0.01611,-0.00762 0.02087,-0.01016c0.01996,-0.00887 0.05066,-0.02512 0.07379,-0.03147c0.02625,-0.00635 0.06421,-0.00761 0.09479,-0.01015c0.02765,-0.00127 0.06372,-0.00253 0.09485,0c0,-0.02018 -0.00641,-0.04518 -0.01019,-0.06295c0,-0.00507 -0.00891,-0.01612 -0.01019,-0.02094c-0.00378,-0.00507 -0.00885,-0.01637 -0.01013,-0.02094c-0.00378,-0.00509 -0.00757,-0.01662 -0.01013,-0.02094c-0.20923,-0.3447 -1.1698,-0.14191 -1.38037,-0.18891c-0.00757,-0.00254 -0.01611,-0.00761 -0.02094,-0.01015c0,-0.00034 -0.01019,0.00066 -0.01019,0c0,-0.00069 0,-0.01016 0,-0.01016c-0.00012,-0.00066 0.00012,-0.01015 0,-0.01015c0.00012,-0.00067 -0.00018,-0.01015 0,-0.01015c0,-0.00127 0,-0.00889 0,-0.01015c0.03241,-0.04721 0.15063,-0.13329 0.37939,-0.26237c0.2887,-0.40841 0.77289,-0.44987 0.93774,-0.62971c0,-0.00127 0.00885,-0.00888 0.01013,-0.01015c0.00635,-0.00762 0.01611,-0.02336 0.021,-0.03148c0.00378,-0.00381 0.00885,-0.01663 0.01013,-0.02094c0,-0.00255 0,-0.0089 0,-0.01016c0,-0.00507 0.00885,-0.01625 0.01013,-0.02094c0,-0.00761 0,-0.02386 0,-0.03147c0,-0.00762 0.00031,-0.02323 0,-0.03148c0,-0.01396 0.00378,-0.03719 0,-0.05241c-0.80096,-0.53921 -0.60834,-1.58029 -0.41095,-2.36143c0.12207,-0.61485 0.55359,-1.07349 0.76917,-1.67923c0.16901,-0.20499 0.23358,-0.68623 0.37939,-0.92358c0.026,-0.04061 0.06281,-0.08237 0.09479,-0.10496c0.0199,-0.01295 0.05078,-0.02728 0.07373,-0.03148c0.0202,-0.00253 0.05078,0.00507 0.07373,0.01015c0.07367,0.01929 0.16785,0.07475 0.27399,0.1889c0.9093,0.42686 1.55725,1.16029 2.22327,1.88914c0.29474,0.00761 0.51868,0.12424 0.64276,0.29385c0.16302,0.23238 0.15552,0.57433 -0.06323,0.92358c0.29761,0.73042 1.0119,0.59409 1.53839,0.37782c0.21326,0.05724 0.31769,-0.00381 0.37933,-0.10497c0.09265,-0.16383 0.08209,-0.45535 0.16858,-0.62971c0.00763,-0.0155 0.02118,-0.03896 0.03174,-0.05241c0.01141,-0.01295 0.02893,-0.03146 0.04211,-0.04202c0.06525,-0.0481 0.1615,-0.06422 0.3056,-0.03148c0.44745,-0.37302 0.64227,-0.75806 0.8429,-1.22794c-0.20605,-0.01865 -0.32117,-0.04315 -0.36877,-0.07349c-0.00378,-0.00127 -0.00891,-0.00888 -0.01013,-0.01015c-0.00385,-0.00255 -0.00891,-0.00762 -0.01019,-0.01015c0,-0.00127 0,-0.00887 0,-0.01015c0,-0.00127 -0.00012,-0.00888 0,-0.01015c0,-0.00127 0,-0.0089 0,-0.01015c0.00385,-0.00507 0.01453,-0.01523 0.021,-0.02094c0.00378,-0.00127 0.00885,-0.00889 0.01013,-0.01015c0.0127,-0.00888 0.03479,-0.02259 0.05267,-0.03148c0.23669,-0.11295 0.86084,-0.23669 1.07477,-0.25189c0.9693,0.11701 0.82788,-0.5787 1.54889,-0.92358c0.17297,-0.14017 0.23663,-0.24612 0.23181,-0.32536c-0.00378,-0.03275 -0.02765,-0.06904 -0.05267,-0.09443c-0.1521,-0.14201 -0.59259,-0.18917 -0.71649,-0.31487c-0.00378,-0.00381 -0.00763,-0.01675 -0.01013,-0.02094c0,-0.00254 -0.00891,-0.00888 -0.01019,-0.01016c-0.00366,-0.00507 -0.00885,-0.01624 -0.01013,-0.02094c0,-0.00761 0,-0.02361 0,-0.03149c0.00647,-0.0349 0.0368,-0.07893 0.08429,-0.1259c0.26355,-0.47892 0.87793,-0.74438 1.43298,-0.68219c0.64233,0.56284 1.6134,-0.32536 1.92828,-0.76614c0.44312,0.16718 0.81635,0.16127 1.06421,-0.06295c0.01855,-0.01727 0.0462,-0.04316 0.06317,-0.06295c0.06244,-0.07475 0.1167,-0.17216 0.15808,-0.28339c0.3772,-0.3512 1.6828,-0.43665 1.16956,-1.0705c-0.0788,-0.09177 -0.11371,-0.16766 -0.11578,-0.22041c0,-0.00127 0,-0.00889 0,-0.01016c0.00006,-0.00127 0.01013,-0.00887 0.01013,-0.01015c0.00024,-0.00127 0,-0.00888 0,-0.01015c0,-0.00127 0,-0.0089 0,-0.01015c0,-0.00254 0.00885,-0.00888 0.01013,-0.01015c0,-0.00101 0,-0.0089 0,-0.01015c0.00885,-0.01141 0.02765,-0.02386 0.04211,-0.03146c0.24921,-0.11334 1.15094,0.24485 1.10632,0.77663c-0.00378,0.01791 -0.00629,0.04469 -0.01013,0.06295c-0.00378,0.01524 -0.01587,0.03694 -0.02094,0.05244c0.6106,-0.13519 1.17499,0.65382 1.69641,0.32536c-0.14288,-0.28334 -0.14075,-0.64548 0.06323,-0.85011c0.13586,-0.13033 0.36395,-0.20563 0.68494,-0.14693c0.15668,-0.01511 0.23865,-0.06358 0.27393,-0.13644c0.12836,-0.30466 -0.52759,-1.00105 -0.27393,-1.35387c-0.04333,-0.18694 -0.01141,-0.30943 0.05267,-0.38834c0.16077,-0.18063 0.54254,-0.13783 0.71649,-0.20988c0.04596,-0.02082 0.07788,-0.05801 0.08423,-0.10497c0.00385,-0.0575 -0.02765,-0.14597 -0.10529,-0.26237c-0.20697,-0.41779 -0.01019,-0.99426 -0.36877,-1.45884c-0.08392,-0.24168 -0.03564,-0.40659 0.07373,-0.52477c0.24463,-0.25262 0.78339,-0.32355 0.91675,-0.61922c0.02399,-0.02885 0.0509,-0.04694 0.07373,-0.06298c0.01141,-0.00723 0.03094,-0.01659 0.04211,-0.021c0.01141,-0.00368 0.03113,-0.00938 0.04211,-0.01054c0.00763,-0.00034 0.02368,-0.00101 0.03174,0c0.01141,0.00204 0.03137,0.00648 0.04218,0.01054c0.0293,0.01257 0.06537,0.03719 0.09479,0.06298c0.23627,0.21436 0.49591,0.7803 0.97992,0.64021c0.39423,-0.62691 1.21332,-0.80325 1.91772,-0.8711l-0.00159,-0.00629l0.00006,-0.00005l0.00006,0.00005l0.00006,-0.00001z',
name: "Niederösterreich",
big: 'm195.57417,5.55957l-0.58627,4.94528l-1.74049,4.65338l3.20618,13.35784l-0.87941,4.36136l-1.15421,4.6351l0.56793,3.77743l-0.27477,3.48541l-1.75879,5.5293l1.17252,3.7774l2.03354,3.77744l-1.74043,3.77741l-1.75879,0l-3.20616,-1.75185l-7.58485,-1.16792l-8.44589,0l-1.46562,10.74835l-9.03221,9.59869l-2.05197,7.82856l0.58623,10.16438l-2.03354,6.97092l0.2748,-0.27374l0,3.19348l4.96497,0l4.9649,0.85767l5.82607,2.33578l5.25812,1.7336l6.41229,0.58397l5.53288,3.48544l-0.87939,3.19346l-2.91301,0.29198l-2.61987,3.77746l-0.87941,2.60951l0.87941,2.9015l6.70544,5.23729l2.91299,1.16786l0.29306,7.26286l3.49934,0l0,2.02559l0.29311,5.511l-0.29311,2.91977l2.32672,3.75912l0.58623,4.3614l-0.29306,6.67892l0.29306,5.82123l0.87944,9.28845l-2.0336,-1.16792l-2.63824,-1.14964l-2.32671,-2.04384l-3.20618,0.29199l-2.61989,0.29195l-2.91278,2.04382l-3.7924,4.05115l-2.93135,3.77742l-2.91301,1.16789l-3.49928,0.87592l-3.20612,0.85767l-3.49933,0.87593l-5.23978,1.45987l-5.8443,-1.75185l-2.0336,-1.44165l-3.20618,-3.48546l-3.49933,-3.7774l-0.87939,-2.33582l-4.08546,-0.27373l-5.23978,-0.58391l-5.84441,4.6351l-0.56787,5.23727l0.56787,6.09497l-1.44727,5.80296l2.91301,5.52934l-1.17258,2.02553l-1.44733,4.06938l-2.63818,5.52928l1.1725,4.34312l5.82607,4.65334l3.22447,2.60948l3.20607,2.62784l3.20621,0.5657l2.9128,1.75183l2.32693,2.31755l4.37868,3.48547l4.67184,1.4599l3.49918,1.44159l3.20601,0l4.65353,2.04384l5.25809,4.36139l0.87939,4.63507l-2.34492,1.75186l0,4.06937l-2.03371,4.34314l-1.46573,2.62772l0,3.48544l2.05212,5.51108l-0.98929,5.05484l1.28239,2.20804l3.20596,2.60953l3.49928,-2.90158l8.15277,0.29199l3.22441,0.58389l2.32683,1.14969l4.6718,4.06934c0,0 2.02437,0.29355 3.77409,0.58398c1.74966,0.29044 3.79239,-1.44162 3.79239,-1.44162l2.93137,-6.69714l3.49928,-0.85767l5.23976,-0.58401l3.49934,2.02554l2.91295,-0.85764l4.96495,-2.62781l5.5329,-2.31754l6.13747,-1.4599l2.32677,-6.67886l1.74049,-1.14969l2.9313,-3.19348l3.79245,0.8577l4.65349,-1.14966l2.61981,-2.62775l2.93137,-0.56567c0,0 2.61221,0 4.6535,0c2.04135,0 5.84436,5.51102 5.84436,5.51102l3.49924,4.36133c0,0 5.24582,0.58395 6.41232,0.58395c1.16653,0 5.82605,1.73364 5.82605,1.73364l4.08551,4.94531l6.11923,-0.87595l6.41229,0l2.63812,5.80298l3.49924,0.58395l4.65366,0.58395l5.258,0l2.6199,7.26285l4.08557,9.87241l3.49921,-6.3869l6.11923,0.29193l2.05191,7.55481l-0.58624,5.80304l6.11914,-0.58401l3.79245,3.19351l2.61978,4.06937l2.052,4.36139l5.82599,0l6.70547,0l1.46567,2.02557l2.03366,1.16791l5.55112,-0.29199l3.49936,-3.48544l0.56787,8.99652l3.22446,3.21167l4.65353,4.34308l6.70535,-0.58389l5.55136,-0.5657l4.94653,-4.36136l4.67191,-3.7774l4.08548,-4.65332l1.74042,-4.63519l-4.65344,-4.65332l-0.29309,-5.80298l0.58621,-3.48547l2.91299,-2.33575l1.15421,-3.19351l0,-3.48544l2.63824,-3.19342l-0.29309,-3.19351l-2.05203,-2.60947l-4.94653,-4.94528l-3.20612,-2.60959l-2.63824,-4.0694l-0.86111,-2.60953l-1.17255,-4.94534l0,-6.67889l3.49933,-3.19348l3.79236,0.58392l0,-4.06937l2.61987,-4.36133l-0.87933,-5.51108l-0.86111,-4.65334l4.08557,-5.80296l2.03366,-2.90155l4.08557,-3.48543l7.29169,-1.45984l3.49921,-1.16795l5.5329,3.48549l2.91312,2.90149l4.08545,-3.19344l2.91299,-2.60954l0,-4.92702l3.79245,-1.75189l4.37869,-2.31755l1.17255,-3.48543l0.29312,-6.40523l4.36041,-2.31754l5.55115,-2.3176l6.11911,-3.48543l3.49936,-4.94533l4.67178,-4.06941l4.94666,0l5.84436,4.06941l3.20599,2.33578l1.74054,-2.33578l0.29324,-4.6351l-1.74054,-4.94533l6.41232,-2.31757l1.4472,1.7336l3.79245,-3.77739l3.93912,-3.92343l-0.10992,-0.20079l-2.07028,-2.55475l-2.61987,0l-3.49924,-1.16792l-3.79245,-4.05115l-3.20624,-0.58395l-1.75879,-6.1132l-1.17245,-4.34309l-1.74042,-4.65335l0,-6.67896l-4.37881,-1.16789l-1.17255,-1.7336l-3.20602,-4.06943l-1.1543,-5.23727l-7.58481,-4.05118l-1.75879,-5.23728l2.05182,-2.60954l-0.29303,-14.81771l3.49924,-7.55484l3.49933,-6.38695l4.08569,-6.97089l-2.91333,-8.13879l0,-4.34312l-1.466,-4.94539l-4.9649,-15.69363l-4.3602,-5.21902l-6.1377,3.48546l-8.44577,0l-4.08557,-4.65335l-6.41235,-0.87592l-0.87933,2.62777l-2.91299,1.44167l-1.17258,-3.77746l0,-4.92707l-4.37866,-4.06938l-6.11923,2.90149l-10.79092,-5.803l-4.37866,2.90151l-5.82599,-1.45987l-4.67181,13.08409l-6.41232,4.6351l-2.6199,-2.31751l-2.61987,0l-2.34491,3.4854l-2.03387,-2.02556l-1.46558,0l-9.61844,0.85767l-10.49792,-2.02556l-2.91287,2.31751l-6.41235,0l-20.13458,-11.33222l-2.91302,-4.63511l-16.32388,-8.43079l-7.87802,0l-0.58624,2.04382l-1.4473,2.90149l-10.49765,-0.87592l-1.46588,-2.02556l-3.49911,-2.33576l-4.96503,-2.60959l-7.27344,-0.87592l-8.46423,-1.73356l-5.5329,-7.55484l-6.99857,0l-11.37733,-5.5293l-5.25803,2.04382l-4.65349,-3.19343l-2.05191,8.99643l-6.70544,-0.29198l-4.37874,3.48546l-4.36032,-0.56572l2.91306,-5.23728l-3.79245,-5.803l-10.20468,0l-2.34508,-2.33579l-10.49785,-0.58395l-0.00005,0.00005l0.00009,0.00013l0.00011,0.00005l0.00011,0.00008l0.00011,0.00005zm211.25768,129.96521c0.03925,-0.0042 0.08914,0.00352 0.12817,0c0.54114,0.32201 1.11761,0.58272 1.63062,0.9489c1.31424,0.40245 1.1474,1.61269 1.17255,2.71901c0.8974,1.29482 0.30203,2.97778 0.47641,4.45262c2.09604,1.46446 4.18021,2.94101 6.22906,4.47086c0.27219,0.39313 0.54196,0.47041 0.7695,0.38324c0.50897,-0.21716 0.84738,-1.32076 0.73279,-1.89786c0.03226,-0.97734 -0.64746,-2.2632 -0.27487,-3.02922c1.83414,-0.21252 3.6236,0.39894 5.16644,1.3504c1.48532,0.53746 0.35413,1.70047 -0.03641,2.59123c-1.03226,1.16399 0.65448,1.46918 0.60471,2.60953c1.16449,0.37619 1.45877,1.65952 2.85803,1.49638c0.98895,-0.09554 1.94067,-0.6096 3.00458,-0.1642c-0.19348,1.85191 -0.98578,3.56857 -1.35574,5.3833c1.32773,-0.07262 1.36191,1.03972 2.47324,0.98541c-0.61987,1.49179 -0.87234,3.08391 -1.09924,4.67162c0.16025,1.29118 -0.43246,2.39458 -0.98929,3.52194c-0.63843,0.94368 -0.88708,1.95621 -0.47629,3.04745c0.52533,1.12411 0.41281,2.24487 -0.07333,3.35771c0.59198,0.77008 -0.53827,1.73311 -0.23813,2.81024c0.22995,1.28824 2.28061,0.43617 1.63058,-0.6387c0.30627,0.02298 0.5094,0.07568 0.62283,0.1642c0,0.0022 0.0155,0.01544 0.01764,0.01764c0,0.0022 0.01547,0.0155 0.0177,0.01767c0.00659,0.00441 0.01318,0.01324 0.01764,0.01764c0,0.00221 0.01547,0.01544 0.0177,0.01767c0.00659,0.00441 0.01541,0.01324 0.01764,0.01767c0,0.00221 0,0.01543 0,0.01762c0.24387,0.48528 -0.8212,1.4798 -0.40308,2.22632c0.02347,0.03993 0.05911,0.08936 0.09158,0.12781c0.08936,0.10193 0.21893,0.20367 0.38483,0.29195c-0.00012,0.00443 -0.00012,0.01544 0,0.01767c0.01315,0.22435 0.21426,0.70479 0.47626,1.00362c0.11389,0.12624 0.25449,0.22612 0.3847,0.25546c0.03653,0.00664 0.09137,0.00443 0.12833,0c0.17117,-0.02798 0.35953,-0.17125 0.51288,-0.52916c0.05624,0.19994 0.13861,0.35455 0.21979,0.45618c0.02652,0.03111 0.06314,0.06866 0.09158,0.09116c0.02472,0.01764 0.06516,0.04213 0.09158,0.0547c0.00882,0.00444 0.02759,0.01547 0.03641,0.01767c0.01773,0.00661 0.0538,0.01544 0.07333,0.01765c0.01984,0.00438 0.05338,-0.00117 0.07321,0c0.02518,0.00055 0.06537,0.0022 0.09158,0c0.37048,-0.04039 0.8439,-0.36388 1.39236,-0.63872c1.3241,-0.22137 1.3743,1.52078 0.65955,2.18982c0.83563,0.66487 1.11835,2.13028 0.54962,2.90152c0.2547,0.86571 0.25153,1.38298 0.07333,1.6606c-0.01102,0.01324 -0.02579,0.04192 -0.0365,0.05473c-0.00659,0.0088 -0.02866,0.0287 -0.03629,0.03642c-0.01996,0.01764 -0.05106,0.03951 -0.07333,0.05473c-0.01328,0.0088 -0.04044,0.02887 -0.05521,0.03641c-0.8924,0.43707 -3.29568,-1.17342 -4.59857,-1.33212c-2.36304,-0.39085 -3.22,-3.04863 -5.27637,-3.99643c-1.0466,-1.04741 -2.42749,-0.38594 -3.59082,0.03645c-1.07928,-0.34999 -1.63379,-0.43515 -2.49167,0.40141c-0.52246,-0.26517 -0.88858,-0.35968 -1.17258,-0.31023c-0.0658,0.01328 -0.14337,0.04572 -0.20142,0.0731c-0.02655,0.01321 -0.06699,0.03905 -0.09158,0.0547c-0.30533,0.20259 -0.53159,0.62207 -0.84283,1.14967c-1.00916,0.64815 -1.32498,1.74367 -2.30841,2.33578c-1.09988,1.73927 -2.96524,1.43161 -4.8916,1.42337c-1.04117,0.41788 0.29929,2.08533 -0.03638,3.01103c0.10962,0.59547 0.35135,1.13762 0.34808,1.4416c-0.00055,0.01544 -0.0155,0.0415 -0.01773,0.05472c0,0.00883 0,0.02849 0,0.03642c0,0.00883 -0.0155,0.02913 -0.01773,0.03642c0,0.00438 0,0.0154 0,0.01762c0,0.00443 -0.01538,0.01546 -0.01761,0.01767c-0.01315,0.01764 -0.03503,0.0417 -0.05518,0.0547c-0.00659,0.00175 -0.01541,0.01547 -0.01764,0.01767c-0.03046,0.01321 -0.08447,0.01321 -0.12817,0.01761c-0.18774,0.01109 -0.50824,-0.05205 -0.98929,-0.23721c-1.17365,-1.12648 -1.50125,0.83109 -2.76645,0.21893c-0.15186,0.33687 -0.30246,0.53323 -0.43967,0.62047c-0.01328,0.00885 -0.04108,0.03021 -0.05521,0.03636c-0.01324,0.00444 -0.04105,0.0155 -0.05518,0.01767c-0.01984,0.00441 -0.05444,-0.00047 -0.07333,0c-0.01315,-0.00026 -0.04095,0.00175 -0.05508,0c-0.01324,-0.0022 -0.04108,-0.01323 -0.05518,-0.01767c-0.01761,-0.00658 -0.05444,-0.0088 -0.07321,-0.01764c-0.01328,-0.00661 -0.04044,-0.02823 -0.05521,-0.03639c-0.32663,-0.19841 -0.68652,-0.70897 -1.17255,-0.98544c-1.49838,-0.10945 -2.59888,-1.40718 -4.14053,-1.14963c-1.62796,-0.52072 -3.49988,-0.51958 -4.91006,-1.53288c-1.45932,-0.66852 -3.14063,-0.8389 -4.63507,-1.49634c-0.0538,0.03574 -0.1163,0.08034 -0.16479,0.12776c-0.56363,0.567 -0.78119,1.86615 -1.17258,2.66428c-0.03577,0.2252 -0.09998,0.39326 -0.16483,0.49271c-0.02982,0.04262 -0.07617,0.08456 -0.10992,0.10947c-0.00659,0.00223 -0.0155,0.01544 -0.01761,0.01767c-0.00671,0.00438 -0.02866,0.01547 -0.03641,0.01762c-0.00891,0.00439 -0.02878,0.01544 -0.03653,0.01767c-0.00879,0.0022 -0.02802,-0.00223 -0.03629,0c-0.00891,0.00175 -0.02802,0.01764 -0.0365,0.01764c-0.13965,0.01987 -0.30396,-0.01102 -0.43967,0.01767c-0.00882,0.00169 -0.02866,-0.0022 -0.03641,0c-0.00925,0.0022 -0.02875,0.01544 -0.03683,0.01764c-0.00668,0.00441 -0.02939,0.01328 -0.03638,0.01765c-0.00671,0.0022 -0.0155,0.01543 -0.01773,0.01764c-0.0293,0.02206 -0.0658,0.0565 -0.09158,0.09119c-0.09222,0.13327 -0.15952,0.37135 -0.18317,0.78465c-0.01974,0.2634 -0.10263,0.42274 -0.20123,0.49268c-0.04001,0.02452 -0.0975,0.03511 -0.14667,0.03644c-0.51849,-0.00882 -1.48126,-1.1497 -1.90546,-1.49635c0.12387,-0.66257 -0.03149,-1.00609 -0.32971,-1.18617c-0.39743,-0.2287 -1.04532,-0.21825 -1.64896,-0.36496c-0.02579,0.01764 -0.06516,0.04059 -0.09158,0.05475c-0.00882,0.00441 -0.0275,0.01321 -0.03641,0.01765c-1.10147,0.47728 -2.66467,-2.11734 -4.28708,-0.58398c-1.63739,1.45793 -4.28625,-0.49942 -6.00919,1.22269c-0.90512,0.48485 -1.99533,1.26988 -2.89474,0.60217c0.52893,-1.10852 1.8717,-0.87372 2.82141,-1.33212c0.60046,-0.13133 1.05902,-0.37788 1.2825,-0.71172c0.01541,-0.02557 0.04099,-0.06467 0.05521,-0.09114c0.03915,-0.08031 0.07788,-0.18381 0.09158,-0.27371c0.03033,-0.23534 -0.03226,-0.50723 -0.20154,-0.80292c-0.99524,0.16641 -1.99896,0.24353 -2.98633,0.45621c0.01105,-1.11523 -1.28793,-1.72455 -1.46567,-2.86501c-0.21811,-0.22255 -0.32953,-0.41129 -0.36646,-0.54747c-0.00659,-0.01547 -0.01538,-0.04059 -0.01761,-0.05473c-0.00034,-0.00441 0.00018,-0.01544 0,-0.01764c-0.00012,-0.00446 -0.00012,-0.01547 0,-0.01767c0.00009,-0.00441 -0.00034,-0.01544 0,-0.01765c0.00031,-0.0022 -0.00043,-0.01541 0,-0.01764c0.00052,-0.0022 0.01761,-0.01547 0.01761,-0.01767c0,-0.00223 0,-0.01544 0,-0.01767c0,-0.00217 0,-0.01544 0,-0.01761c0.00656,-0.00883 0.01324,-0.02872 0.01773,-0.03644c0,-0.0022 0.01538,-0.01544 0.01761,-0.01764c0.31784,-0.42085 1.98898,-0.24626 2.40009,-0.85767c0.00882,-0.01547 0.02866,-0.03929 0.03641,-0.05473c0.00659,-0.0088 0.01538,-0.02847 0.01761,-0.03642c0.00659,-0.00882 0.01541,-0.028 0.01764,-0.03641c0.00668,-0.01324 -0.00659,-0.04149 0,-0.05473c0,-0.01321 0.01547,-0.04062 0.0177,-0.0547c0,-0.00887 -0.00052,-0.02672 0,-0.03641c-1.24854,-0.10352 -2.48297,-0.2542 -3.71912,-0.45622c-0.22467,0.11562 -0.42108,0.17033 -0.56796,0.18248c-0.04639,0.00223 -0.10675,0.00664 -0.14658,0c-0.00879,-0.00175 -0.02802,0.00223 -0.03638,0c-0.00882,-0.00218 -0.02866,-0.01544 -0.03641,-0.01762c-0.00668,-0.00223 -0.0293,-0.01543 -0.03641,-0.01767c-0.00668,-0.00174 -0.0155,0.00171 -0.01761,0c-0.00668,-0.00174 -0.0155,-0.01546 -0.01773,-0.01764c-0.00656,-0.00443 -0.03003,-0.01323 -0.03641,-0.01767c-0.00656,-0.0022 -0.01547,-0.01546 -0.01761,-0.01764c-0.00668,-0.0022 -0.0155,-0.01544 -0.01773,-0.01764c-0.00656,-0.00664 -0.01324,-0.01328 -0.01761,-0.01767c-0.44434,-0.49849 -0.11896,-2.16072 -0.75125,-2.97447c-0.12332,-0.15385 -0.28717,-0.28691 -0.49454,-0.36502c-0.94016,-0.07413 -1.35065,-0.24303 -1.46579,-0.47446c-0.20535,-0.47487 0.74393,-1.23016 0.78787,-2.08029c0.5043,-0.67453 1.4884,-1.30798 1.88699,-2.08032c0.81046,-0.47847 0.67123,-1.81129 0.86108,-2.70076c0.3916,-1.03325 0.95322,-1.87651 -0.07321,-2.70078c0.40634,-0.41197 0.87573,-0.79903 1.04425,-1.13139c0.01328,-0.0258 0.02814,-0.06601 0.03641,-0.09119c0.00656,-0.02515 0.0155,-0.06642 0.01773,-0.09109c0,-0.0199 0,-0.05365 0,-0.07307c-0.00671,-0.0386 -0.01996,-0.09047 -0.03641,-0.12778c-0.0155,-0.03241 -0.04575,-0.07811 -0.07333,-0.10947c-0.00882,-0.0088 -0.02759,-0.0278 -0.03641,-0.03639c-0.12683,-0.11412 -0.33969,-0.22928 -0.65945,-0.32851c-0.03299,0.01982 -0.07727,0.04037 -0.10995,0.0547c-0.01984,0.00664 -0.05453,0.01324 -0.07333,0.01767c-0.01324,0.00441 -0.04105,0.01544 -0.05505,0.01762c-0.01328,0.00223 -0.04108,0.01549 -0.0553,0.01768c-0.01761,0.00221 -0.05444,-0.00044 -0.07324,0c-0.87051,0.00221 -1.6532,-1.7256 -1.08087,-2.31757c0.00659,-0.0022 0.0155,-0.01546 0.01764,-0.01764c0.00668,-0.0022 0.01547,-0.01544 0.0177,-0.01764c0.00659,-0.00664 0.0293,-0.01324 0.03641,-0.01767c0.00659,-0.00218 0.01538,-0.0154 0.01761,-0.01762c0.00659,-0.00443 0.02878,-0.01323 0.03653,-0.01767c0.00879,-0.00439 0.02802,-0.01323 0.03629,-0.01767c0.0347,-0.01541 0.08807,-0.04367 0.1283,-0.0547c0.04562,-0.01103 0.11163,-0.01321 0.16483,-0.01764c0.04807,-0.00221 0.11078,-0.00441 0.16492,0c0,-0.03511 -0.01114,-0.07857 -0.01773,-0.10944c0,-0.00885 -0.0155,-0.02805 -0.01773,-0.03644c-0.00656,-0.0088 -0.01538,-0.02846 -0.01761,-0.03639c-0.00659,-0.00887 -0.01315,-0.0289 -0.01761,-0.03644c-0.3638,-0.59933 -2.034,-0.24673 -2.40012,-0.32845c-0.01315,-0.00441 -0.02802,-0.01324 -0.03641,-0.01764c0,-0.00061 -0.0177,0.00113 -0.0177,0c0,-0.00122 0,-0.01767 0,-0.01767c-0.00021,-0.00114 0.00021,-0.01765 0,-0.01765c0.00021,-0.00116 -0.00034,-0.01767 0,-0.01767c0,-0.00217 0,-0.01544 0,-0.01761c0.05634,-0.08209 0.2619,-0.23178 0.65967,-0.45624c0.50195,-0.7101 1.34384,-0.78218 1.63049,-1.09488c0,-0.0022 0.01538,-0.01544 0.01761,-0.01764c0.01102,-0.01324 0.02802,-0.04062 0.0365,-0.05473c0.00659,-0.00664 0.01538,-0.02892 0.01761,-0.03641c0,-0.00446 0,-0.01549 0,-0.01767c0,-0.0088 0.01541,-0.02827 0.01764,-0.03639c0,-0.01324 0,-0.04149 0,-0.05473c0,-0.01324 0.00052,-0.04041 0,-0.05473c0,-0.02428 0.00656,-0.06465 0,-0.09114c-1.39267,-0.93752 -1.05774,-2.74771 -0.71454,-4.10591c0.21225,-1.06906 0.96252,-1.86652 1.33737,-2.91971c0.29385,-0.35645 0.40613,-1.19318 0.65967,-1.6059c0.0452,-0.0706 0.10919,-0.14319 0.16479,-0.18248c0.03461,-0.02252 0.08832,-0.04744 0.1282,-0.05473c0.03513,-0.00441 0.08829,0.0088 0.1282,0.01764c0.12808,0.03354 0.29184,0.12997 0.47638,0.32846c1.58105,0.74217 2.70767,2.01741 3.86569,3.2847c0.51245,0.01323 0.90182,0.216 1.11758,0.51093c0.28345,0.40404 0.27042,0.99863 -0.10995,1.60588c0.51749,1.27 1.75943,1.03296 2.67487,0.65692c0.37079,0.09952 0.55237,-0.00662 0.65958,-0.1825c0.16107,-0.2849 0.14273,-0.79175 0.29309,-1.09491c0.01328,-0.02696 0.03683,-0.06773 0.05521,-0.09114c0.01984,-0.02249 0.05029,-0.0547 0.07321,-0.07306c0.11346,-0.08363 0.28082,-0.11168 0.53137,-0.05473c0.77798,-0.64859 1.11673,-1.31807 1.46558,-2.13506c-0.35828,-0.03246 -0.55844,-0.07504 -0.6412,-0.12778c-0.00659,-0.00221 -0.0155,-0.01547 -0.01761,-0.01765c-0.00668,-0.00446 -0.0155,-0.01326 -0.01773,-0.01765c0,-0.00221 0,-0.01543 0,-0.01765c0,-0.0022 -0.00021,-0.01544 0,-0.01764c0,-0.00223 0,-0.01549 0,-0.01767c0.00668,-0.00879 0.02527,-0.02646 0.0365,-0.03641c0.00659,-0.0022 0.01538,-0.01544 0.01761,-0.01764c0.02209,-0.01544 0.06052,-0.03929 0.09158,-0.05473c0.41156,-0.19638 1.4968,-0.41151 1.86874,-0.43797c1.68536,0.20345 1.43948,-1.00621 2.69312,-1.60583c0.30075,-0.24374 0.41144,-0.42795 0.40308,-0.56573c-0.00659,-0.05693 -0.0481,-0.12004 -0.09158,-0.1642c-0.26447,-0.24692 -1.03036,-0.3289 -1.24582,-0.54745c-0.00656,-0.00664 -0.01324,-0.02914 -0.01761,-0.03641c0,-0.00443 -0.0155,-0.01544 -0.01773,-0.01767c-0.00626,-0.0088 -0.01538,-0.02823 -0.01749,-0.03641c0,-0.01326 0,-0.04106 0,-0.05475c0.01123,-0.0607 0.06387,-0.13725 0.14655,-0.21893c0.45825,-0.8327 1.52649,-1.29427 2.49149,-1.18616c1.11685,0.97865 2.80527,-0.56569 3.35278,-1.33209c0.77045,0.29068 1.4194,0.28041 1.85037,-0.10944c0.03226,-0.03004 0.08032,-0.07506 0.10983,-0.10947c0.10855,-0.12997 0.20291,-0.29936 0.27487,-0.49274c0.65582,-0.61064 2.92593,-0.75922 2.03354,-1.86134c-0.13699,-0.15955 -0.19772,-0.29149 -0.2012,-0.38321c0,-0.0022 0,-0.01547 0,-0.01767c0,-0.0022 0.01749,-0.01544 0.01749,-0.01764c0.00043,-0.00223 0,-0.01544 0,-0.01767c0,-0.00221 0,-0.01547 0,-0.01765c0,-0.00439 0.01541,-0.01544 0.01764,-0.01764c0,-0.00175 0,-0.01547 0,-0.01764c0.01538,-0.01985 0.04807,-0.04149 0.07321,-0.0547c0.43332,-0.19708 2.00119,0.42574 1.92361,1.35034c-0.00659,0.03114 -0.01093,0.07771 -0.01761,0.10947c-0.00659,0.02647 -0.02762,0.06421 -0.03641,0.09116c1.06168,-0.23506 2.043,1.13684 2.94962,0.56573c-0.24844,-0.49266 -0.24472,-1.12231 0.10992,-1.4781c0.23624,-0.22662 0.63284,-0.35756 1.19095,-0.25549c0.2724,-0.02626 0.41495,-0.11055 0.47629,-0.23721c0.22318,-0.52972 -0.91736,-1.74057 -0.47629,-2.35405c-0.07535,-0.32503 -0.01987,-0.53799 0.09158,-0.67522c0.27951,-0.31407 0.94333,-0.23965 1.24579,-0.3649c0.0799,-0.03622 0.13541,-0.10088 0.14645,-0.18254c0.00668,-0.09996 -0.0481,-0.25378 -0.18307,-0.45619c-0.35986,-0.72643 -0.01773,-1.72874 -0.6412,-2.53653c-0.1459,-0.42023 -0.06198,-0.70694 0.1282,-0.91243c0.42535,-0.43924 1.36209,-0.56256 1.59399,-1.07668c0.04169,-0.05014 0.0885,-0.08162 0.12817,-0.1095c0.01987,-0.01257 0.0538,-0.02884 0.07324,-0.03653c0.01984,-0.00638 0.05411,-0.0163 0.07321,-0.01831c0.01328,-0.00058 0.0412,-0.00175 0.05521,0c0.01984,0.00356 0.05453,0.01128 0.07333,0.01831c0.05093,0.02188 0.11365,0.06468 0.16479,0.10951c0.4108,0.37271 0.86227,1.35675 1.70383,1.11316c0.68546,-1.09003 2.10965,-1.39664 3.33441,-1.51462l-0.00275,-0.01094l0.00009,-0.00008l0.00012,0.00008l0.00009,0l0.00012,-0.00002z'
};

aut.st = {path:
'm435.04041,160.3419l0.79065,1.36401l1.84491,1.50348l2.0126,-1.67053l4.69611,0.16705l1.84491,0.33408l1.34174,0.66824l2.6835,2.33879c0,0 1.17404,0.16704 2.18033,0.33408c1.00632,0.16705 2.18033,-0.8353 2.18033,-0.8353l1.67728,-3.84224l2.01254,-0.50117l3.01892,-0.33411l2.01263,1.16939l1.67719,-0.50114l2.85123,-1.50352l3.18671,-1.33644l3.52203,-0.83527l1.3418,-3.84225l1.00632,-0.66823l1.67722,-1.83762l2.1803,0.50116l2.68347,-0.6682l1.50946,-1.50352l1.67722,-0.33409c0,0 1.50946,0 2.68347,0c1.17404,0 3.35434,3.17407 3.35434,3.17407l2.01263,2.5058c0,0 3.01892,0.33409 3.68982,0.33409c0.6709,0 3.35437,1.00235 3.35437,1.00235l2.34802,2.83995l3.52209,-0.50119l3.68979,0l1.5094,3.34111l2.01263,0.33414l2.68347,0.33412l3.01892,0l1.50946,4.17639l2.34808,5.67986l2.01263,-3.67522l3.52203,0.1671l1.17401,4.3434l-0.33545,3.34108l3.52209,-0.33409l2.18036,1.83763l1.50946,2.33876l1.17401,2.5058l3.35437,0l3.85754,0l0.83856,1.1694l1.17407,0.66817l3.18665,-0.16704l2.01257,-2.00464l0.33545,5.17871l1.84491,1.83762l2.8512,2.67288l-2.34802,3.84224l-2.51581,3.50818l-1.84491,-3.67522l-1.67719,0l0,1.33646l-0.16772,2.17169l-1.34174,0.83528l1.17407,3.6752l1.50946,3.67525l1.00629,2.83992l1.67719,3.6752l0.67084,3.8423l0.16772,3.17406l1.3418,2.33876l1.50946,2.00464l0.16766,1.83763l0,2.83989l-1.00629,3.8423l0.50317,3.007l2.68347,2.8399l2.85126,1.83763l-0.16779,3.34108l-1.67712,2.50584l-1.84497,3.34108l-1.84485,3.00699l-1.34174,2.6729l-1.17407,0.16704l-2.51575,2.00467l0.33545,4.34344l1.17401,1.67056l1.84491,1.67056l0,2.00464l-0.83862,0.8353l-2.68347,0.66821l1.34174,2.17172l0,4.84457l0.50317,4.34338l1.50946,2.33881l2.01263,0.33414l0.33539,2.00464l1.50952,1.33646l0,4.34344l-1.50952,0l-3.52203,-4.51047l-1.67719,0.66815l-9.22449,-3.67517l-5.03156,1.33646l-3.52209,2.50583l-2.8512,0.66821l-1.67737,0l-2.01245,-1.1694l-2.34802,0l-1.00635,3.00702l-0.50311,1.16937l-2.68353,-1.00232l-4.69611,2.00464l0,2.17172l0,2.50586l-2.68347,2.17169l-3.8576,0.50113l-2.18036,-2.00464l-1.67722,-1.67056l-3.18661,0l-8.38593,1.16937l-7.04413,0.66821l-3.52209,-1.33643l-6.54105,1.16934l0.61172,-0.52136l-2.28885,-1.31625l-2.85126,-2.33875l-2.18036,-0.83533l-0.33542,-1.33643l-0.50314,-3.84225l0,-4.00931l-1.00632,-3.00699l-1.17404,-1.33643l-1.00632,-1.83765l-0.50314,-2.67291l0.67093,-2.17169l1.50943,-2.67288l-0.16772,-3.00702l-1.34171,-2.00464l-2.51581,-3.17401l-1.84491,-2.50589l-1.84491,-3.00693l-1.67719,-2.00467l-2.68347,-1.33644l-2.0126,-2.00467l-2.0126,0.66823l-3.01895,1.1694l-1.67722,0.50113l-2.18033,0l-1.84491,0.16704l-2.34802,0.33412l-2.51581,0.16707l-1.84491,0l-2.01254,0.66824l-1.50949,0l-2.0126,-0.50116l-1.50946,0l-1.50946,0.8353l-4.19296,0.16704l-1.50946,0.50116l-1.34177,0l-1.67719,1.1694l-1.67722,1.50345l-2.1803,1.16937l-2.18036,0l-1.17401,-0.66818l-1.3418,-3.17406l-1.00635,0.33409l-3.35437,0.33415l-2.34799,0.16704l-2.18036,-0.50119l-1.17401,-2.00465l-1.00635,-1.67055l-1.50946,0.33411l-1.50949,0.50119l-1.17401,0l-2.18033,0.33411l-2.01254,1.00233l-2.6835,1.33643l-2.6835,1.67058l-2.51578,1.00232l-2.01263,1.83762l-1.17398,2.33881l-1.17401,2.17169l-2.34805,1.16937l-2.68347,2.33881l-1.00632,2.33881l-3.68985,1.67053l-1.84485,-0.8353l-2.34805,-1.67053l-2.18036,-3.50815l-0.50317,0.16705l2.01263,-0.83533l1.84494,-2.00467l-0.16772,-2.67288l1.34174,-2.50583l1.34174,-2.6729l1.67715,-2.33876l-0.67087,-4.17636l0.83862,-2.33881l3.68979,-2.50581l1.00632,-1.50348l-0.16772,-2.17171l-3.18665,-0.83531l-1.34174,-0.83525l-2.18036,-4.51047l-1.67725,-3.34108l-1.84491,-3.00703l-2.18033,-4.51048l-2.34799,0.16705l-0.50317,1.83762l-0.67084,1.1694l-3.68982,-1.00232l-1.50943,1.33643l-1.00641,1.00232l-3.85742,-2.33875l-2.68353,-1.83763l-1.34177,-0.66821l-2.01257,-6.68221l-1.84488,-4.67754l-1.00635,-3.67523l1.17398,-5.01166l0.33545,-1.00233l-0.16766,0l3.35437,0.8353l3.85748,0.50114l2.18036,0.50119l0.50308,-1.83763l0.50314,-1.50346l2.18033,-1.50351l0.50317,-0.50113l0,-2.67288l-0.67087,-1.83762l-1.67719,-2.00468l-1.84491,-1.50348l-1.00632,-1.83763l-0.33542,-2.17174l0,-2.33876l0,-2.67287l0.16769,-3.007l0.33542,-0.83525l5.5347,-3.34111l3.85751,-2.17171l2.68353,-2.00467l3.01892,2.17174l1.34177,0.33409l3.01892,0.33409l0.83856,-0.16702l1.17401,1.16937l3.18668,-0.83525l0.33542,0l2.85126,2.5058l2.8512,2.50583l0.33539,1.67056l-0.16769,2.17168l1.34177,0.16708l1.00626,-2.33878l2.68353,-0.33414l2.18036,-0.16705l1.17404,-1.83762l2.34805,-0.50114l1.34171,0l2.01263,2.33876l1.84488,1.1694l5.19931,0.66823c0,0 1.50943,0 2.18036,0c0.67084,0 2.34802,-0.50119 2.34802,-0.50119l0.67084,-1.67053l2.18039,-3.34111l1.17401,-1.00233l1.84494,0l2.68347,-0.16704l1.17401,-1.67059l-0.16769,-1.67052l4.19293,-1.67056l2.18036,-0.83527l4.52841,-1.67056l3.01892,-1.33641l2.68341,-3.17406l1.84491,-1.67056',
name: "Steiermark",
big: 'm282.30536,31.44484l1.72849,2.98195l4.03326,3.28685l4.39987,-3.65205l10.26645,0.3652l4.03326,0.73034l2.93326,1.46089l5.86658,5.11298c0,0 2.56665,0.36517 4.76654,0.73034c2.19998,0.3652 4.76657,-1.82609 4.76657,-1.82609l3.66678,-8.39976l4.39975,-1.09565l6.59985,-0.73041l4.39993,2.55647l3.6666,-1.09558l6.23325,-3.28695l6.96674,-2.92167l7.69965,-1.82603l2.93347,-8.39979l2.19995,-1.46086l3.66666,-4.01732l4.76651,1.09562l5.86649,-1.46079l3.29993,-3.28695l3.66666,-0.73038c0,0 3.29993,0 5.86652,0c2.56665,0 7.33313,6.93903 7.33313,6.93903l4.39993,5.47808c0,0 6.59985,0.73038 8.06653,0.73038c1.46671,0 7.33322,2.1913 7.33322,2.1913l5.13315,6.20859l7.69986,-1.09568l8.06647,0l3.29974,7.3042l4.39993,0.73048l5.86649,0.73044l6.59985,0l3.29993,9.13026l5.1333,12.41708l4.39993,-8.03461l7.69974,0.36531l2.56659,9.49537l-0.73337,7.30414l7.69989,-0.73038l4.7666,4.01736l3.29993,5.11291l2.56659,5.47808l7.33316,0l8.43323,0l1.83325,2.5565l2.56671,1.46072l6.96649,-0.36517l4.39984,-4.38247l0.73334,11.3215l4.03326,4.01732l6.23315,5.84335l-5.13312,8.39976l-5.5,7.66944l-4.03326,-8.03461l-3.66656,0l0,2.92171l-0.3667,4.74767l-2.93323,1.82606l2.56671,8.03458l3.29993,8.03468l2.19989,6.20853l3.66656,8.03458l1.46661,8.39989l0.36664,6.93896l2.93341,5.11295l3.29993,4.38246l0.36652,4.01733l0,6.20848l-2.19989,8.39992l1.10004,6.57376l5.86646,6.2085l6.23334,4.0174l-0.36682,7.30411l-3.66644,5.47821l-4.03345,7.30411l-4.03308,6.57376l-2.93329,5.84335l-2.56671,0.3652l-5.49982,4.38252l0.73334,9.49547l2.56659,3.65213l4.03326,3.65213l0,4.38245l-1.83337,1.82611l-5.86652,1.46082l2.93329,4.74774l0,10.591l1.09998,9.49527l3.29993,5.11307l4.39996,0.7305l0.73322,4.38245l3.30005,2.92172l0,9.49545l-3.30005,0l-7.69971,-9.8606l-3.66663,1.4606l-20.1662,-8.03442l-10.99982,2.92169l-7.69986,5.47815l-6.23318,1.46082l-3.66699,0l-4.39954,-2.55649l-5.13315,0l-2.20004,6.57382l-1.09988,2.55643l-5.86664,-2.19122l-10.26645,4.38248l0,4.74771l0,5.47821l-5.86649,4.74768l-8.43341,1.09555l-4.76663,-4.38248l-3.66666,-3.6521l-6.96646,0l-18.33298,2.55643l-15.3996,1.46075l-7.69989,-2.92163l-14.29977,2.55637l1.33734,-1.1398l-5.00381,-2.87753l-6.23331,-5.11285l-4.76666,-1.82617l-0.73328,-2.92163l-1.09988,-8.39981l0,-8.76498l-2.20004,-6.57376l-2.56659,-2.92163l-2.20004,-4.0174l-1.09988,-5.84341l1.46677,-4.74768l3.29987,-5.84335l-0.36667,-6.57382l-2.9332,-4.38248l-5.50003,-6.93889l-4.03326,-5.47829l-4.03326,-6.57362l-3.6666,-4.38254l-5.86652,-2.92171l-4.39987,-4.38252l-4.39981,1.46095l-6.59991,2.55644l-3.66666,1.09554l-4.76663,0l-4.03326,0.36522l-5.13309,0.73041l-5.50003,0.3652l-4.03326,0l-4.39969,1.46089l-3.29999,0l-4.39987,-1.09555l-3.29993,0l-3.29993,1.82602l-9.16647,0.36528l-3.29993,1.09561l-2.93333,0l-3.6666,2.55643l-3.66673,3.28679l-4.76648,2.55644l-4.76662,0l-2.56657,-1.46075l-2.93338,-6.93898l-2.20004,0.73035l-7.33319,0.73055l-5.13309,0.36514l-4.76662,-1.09569l-2.56659,-4.38252l-2.20003,-3.65205l-3.29993,0.73041l-3.29999,1.09569l-2.56657,0l-4.76656,0.73041l-4.39975,2.19122l-5.86656,2.92172l-5.86656,3.65211l-5.49991,2.19122l-4.39993,4.01733l-2.56645,5.11301l-2.56657,4.74768l-5.13322,2.55643l-5.8665,5.11301l-2.19997,5.11301l-8.06662,3.65204l-4.03313,-1.82608l-5.13322,-3.65204l-4.76662,-7.6694l-1.10002,0.3652l4.39995,-1.82614l4.03334,-4.38254l-0.36668,-5.84335l2.93326,-5.47815l2.93324,-5.84334l3.66653,-5.11288l-1.46663,-9.13026l1.83337,-5.11301l8.06647,-5.47815l2.19998,-3.28677l-0.36668,-4.74774l-6.96652,-1.8261l-2.93324,-1.82602l-4.76662,-9.86061l-3.66673,-7.30411l-4.03326,-6.5739l-4.76662,-9.86061l-5.13303,0.36522l-1.10002,4.01732l-1.46656,2.5565l-8.06654,-2.19124l-3.29986,2.92165l-2.20017,2.19124l-8.43295,-5.11288l-5.86664,-4.01738l-2.93332,-1.46075l-4.39981,-14.60841l-4.0332,-10.22585l-2.20004,-8.03465l2.56651,-10.95629l0.73335,-2.19127l-0.36654,0l7.33319,1.8261l8.43308,1.09558l4.76662,1.09568l1.09982,-4.01736l1.09988,-3.28681l4.76656,-3.28692l1.10001,-1.09555l0,-5.84335l-1.46662,-4.01733l-3.6666,-4.38256l-4.03327,-3.28685l-2.19997,-4.01736l-0.73328,-4.74777l0,-5.11291l0,-5.84332l0.36661,-6.5738l0.73328,-1.82599l12.09975,-7.30421l8.43314,-4.7477l5.86664,-4.38253l6.59985,4.74777l2.93332,0.73038l6.59984,0.73038l1.83324,-0.36514l2.56657,2.55644l6.9666,-1.82599l0.73328,0l6.23331,5.47808l6.23317,5.47814l0.73322,3.65212l-0.36661,4.74763l2.93332,0.36527l2.19991,-5.11294l5.86658,-0.73051l4.76662,-0.36517l2.56664,-4.01736l5.13322,-1.09555l2.93318,0l4.39995,5.11291l4.0332,2.55647l11.36653,1.46088c0,0 3.29985,0 4.76662,0c1.46655,0 5.13315,-1.09568 5.13315,-1.09568l1.46657,-3.65205l4.76668,-7.30421l2.56657,-2.19126l4.03334,0l5.8665,-0.36517l2.56657,-3.65219l-0.36661,-3.65202l9.16643,-3.65212l4.76662,-1.82603l9.89984,-3.65212l6.59985,-2.92161l5.86636,-6.939l4.03326,-3.65212'
};

aut.w = {path:
'm570.52826,75.92385c-0.71869,0.06346 -1.5824,0.22605 -1.98932,0.87319c-0.70416,0.20377 -0.92004,-1.07565 -1.30518,-0.61434c-0.19617,0.43499 -1.26117,0.36562 -0.99298,1.13895c0.35907,0.46458 0.16925,1.04456 0.37622,1.46235c0.4978,0.74501 -0.96436,0.04454 -0.7514,0.96478c-0.31824,0.4428 0.79883,1.41553 -0.00378,1.4929c-0.82166,-0.15025 -0.98743,0.51682 -0.74994,0.98782c-0.52142,0.32848 -1.0777,-0.45766 -1.68829,-0.32246c0.27094,-0.79565 -1.61517,-1.26717 -1.02155,-0.57607c0.51324,0.63383 -0.79614,0.7201 -1.17334,1.07133c-0.20386,0.54745 -0.67682,0.64021 -1.28674,0.4101c-0.31488,0.44079 -1.28564,1.32329 -1.92792,0.76044c-0.55518,-0.06219 -1.17261,0.20784 -1.43597,0.68678c-0.46759,0.46329 1.33582,0.25533 0.48431,0.94543c-0.72101,0.34488 -0.57751,1.04419 -1.54688,0.92722c-0.36023,0.02563 -1.86646,0.33817 -0.76746,0.43792c-0.20074,0.46989 -0.39294,0.84856 -0.84039,1.22157c-0.76849,-0.17474 -0.15491,1.06998 -0.93481,0.86069c-0.52649,0.21626 -1.23157,0.36097 -1.52911,-0.36942c0.38361,-0.61242 0.11938,-1.20152 -0.57922,-1.21889c-0.66602,-0.72886 -1.3208,-1.46161 -2.2301,-1.88847c-0.61749,-0.66393 -0.60461,0.5033 -0.89697,0.85787c-0.21564,0.60574 -0.64014,1.0665 -0.76227,1.68137c-0.19739,0.78112 -0.39642,1.82473 0.4046,2.36395c0.08514,0.39185 -0.61371,0.30917 -0.987,0.8372c-1.27295,0.71853 1.01422,-0.11082 1.0722,0.62468c-0.99414,-0.06066 -0.21326,1.79974 0.47205,1.37697c0.90564,0.28078 0.29889,0.668 -0.16858,1.14188c0.59039,0.47404 0.27075,0.96297 0.04559,1.55724c-0.10931,0.51154 -0.02563,1.28109 -0.49182,1.55627c-0.22937,0.44421 -0.79962,0.80173 -1.08966,1.18969c-0.03809,0.73631 -1.25818,1.34335 0.38953,1.47337c0.98517,0.37077 0.07996,2.49763 1.26117,1.88926c0.71094,0.11613 1.42627,0.20061 2.14429,0.26015c-0.03717,0.72272 -2.13403,0.18737 -1.24255,1.09742c0.10229,0.65591 0.84467,1.01514 0.83801,1.65652c0.56787,-0.12236 1.14722,-0.17303 1.7196,-0.26868c0.31934,0.55814 -0.03503,0.93771 -0.70471,1.08411c-0.5462,0.26363 -1.31769,0.12553 -1.62183,0.76305c0.51721,0.38401 1.14435,-0.06803 1.66486,-0.3469c0.99097,-0.99039 2.51495,0.13544 3.45667,-0.70303c0.97101,-0.91775 1.89874,0.74367 2.53564,0.30076c0.61713,0.15004 1.30896,-0.00381 1.14325,0.88351c0.33221,0.27148 1.22534,1.40618 1.28864,0.56313c0.05975,-1.04916 0.60687,-0.10242 0.73773,-0.93139c0.24628,-0.5022 0.37402,-1.35014 0.77222,-1.61324c0.8595,0.37814 1.82996,0.47684 2.66931,0.86136c0.81104,0.58277 1.89044,0.58556 2.82672,0.88504c0.8866,-0.14812 1.51257,0.59211 2.37433,0.65504c0.52612,0.29929 0.78546,1.08282 1.17108,0.22777c0.72772,0.35205 0.91974,-0.77884 1.59467,-0.13097c1.07324,0.41306 0.64648,-0.12724 0.5163,-0.8343c0.19324,-0.53239 -0.58423,-1.49129 0.01447,-1.73161c1.10791,0.00507 2.18243,0.17533 2.81494,-0.82497c0.56561,-0.34055 0.74878,-0.97135 1.32916,-1.34415c0.36963,-0.62643 0.51422,-0.96935 1.3324,-0.55399c0.49347,-0.48114 0.80878,-0.43309 1.42938,-0.23183c0.66913,-0.24298 1.46625,-0.61958 2.06824,-0.01725c1.18274,0.5451 1.66687,2.0676 3.026,2.29239c1.05975,0.12914 3.38617,1.94246 2.72833,-0.29371c0.32709,-0.44355 0.15729,-1.27911 -0.3233,-1.66151c0.41095,-0.3848 0.38989,-1.38668 -0.37164,-1.25935c-0.57666,0.28902 -1.01184,0.66844 -1.19708,-0.01714c-0.34619,0.82477 -0.86133,-0.15163 -0.86102,-0.4147c-1.01758,-0.54158 0.73663,-1.59637 -0.45001,-1.68501c0.3739,0.61816 -0.81177,1.11032 -0.94403,0.36942c-0.17267,-0.61948 0.47528,-1.16914 0.13483,-1.61206c0.2796,-0.64005 0.35046,-1.28239 0.04822,-1.92891c-0.23627,-0.62762 -0.09875,-1.20982 0.26849,-1.75257c0.32025,-0.64835 0.66876,-1.28944 0.57672,-2.03203c0.13043,-0.91313 0.26727,-1.82468 0.62384,-2.68266c-0.63928,0.03123 -0.65253,-0.61269 -1.4162,-0.57095c0.21283,-1.04369 0.66425,-2.02469 0.77557,-3.08978c-0.61194,-0.25615 -1.15784,0.03896 -1.72668,0.09393c-0.80475,0.0938 -0.9754,-0.65007 -1.64514,-0.86642c0.02869,-0.65585 -0.93726,-0.83205 -0.34357,-1.5015c0.22479,-0.51231 0.87659,-1.17892 0.02222,-1.48808c-0.88733,-0.5472 -1.92102,-0.89408 -2.97589,-0.7719c-0.21429,0.44057 0.17841,1.17381 0.15997,1.73595c0.09595,0.48278 -0.35168,1.61214 -0.86554,0.87006c-1.17834,-0.87984 -2.37836,-1.73017 -3.58392,-2.57243c-0.10028,-0.84824 0.2464,-1.80775 -0.26978,-2.55242c-0.01447,-0.63628 0.07538,-1.33449 -0.68042,-1.56595c-0.29504,-0.21061 -0.62677,-0.3647 -0.93799,-0.5499l0.00043,0.00014l-0.00006,0l-0.00006,-0.00002l-0.00006,-0.00002z',
name: "Wien" ,
bigold: 'm364.19107,3.30388c-7.58643,0.66973 -16.70367,2.3861 -20.99908,9.21743c-7.43311,2.15094 -9.71191,-11.35484 -13.77734,-6.48503c-2.07071,4.5918 -13.31281,3.85925 -10.48184,12.02263c3.79031,4.90396 1.78662,11.02625 3.97137,15.43637c5.25476,7.86411 -10.17969,0.47033 -7.93176,10.18417c-3.35928,4.67427 8.43237,14.9422 -0.03995,15.75883c-8.67334,-1.5859 -10.42322,5.45578 -7.91629,10.42739c-5.50412,3.46753 -11.3761,-4.83083 -17.82153,-3.40374c2.85999,-8.39887 -17.04965,-13.37627 -10.78336,-6.08106c5.41779,6.69055 -8.40399,7.60157 -12.38565,11.30877c-2.15192,5.77921 -7.14447,6.7582 -13.58279,4.32925c-3.32385,4.65269 -13.57117,13.96837 -20.35095,8.02711c-5.86038,-0.65652 -12.37794,2.19379 -15.15804,7.24947c-4.93584,4.89043 14.10077,2.69535 5.11238,9.97993c-7.6109,3.64052 -6.09619,11.02238 -16.32869,9.78762c-3.80257,0.2706 -19.70216,3.56997 -8.10121,4.62273c-2.11903,4.96001 -4.14789,8.95714 -8.87112,12.89468c-8.11215,-1.84427 -1.63519,11.29491 -9.86783,9.08566c-5.55759,2.2827 -13.00034,3.81029 -16.1412,-3.89984c4.0493,-6.46474 1.26021,-12.68302 -6.11426,-12.86632c-7.0304,-7.69402 -13.94226,-15.42863 -23.54079,-19.93475c-6.5182,-7.00818 -6.38226,5.31276 -9.46838,9.05572c-2.27625,6.39418 -6.75723,11.25787 -8.04644,17.74837c-2.08361,8.24553 -4.18462,19.2618 4.27095,24.9537c0.89877,4.13629 -6.47826,3.26361 -10.41869,8.83763c-13.43716,7.58449 10.70605,-1.17003 11.31811,6.5939c-10.49407,-0.64041 -2.25112,18.99796 4.98289,14.53534c9.55986,2.9637 3.15504,7.05103 -1.77951,12.05356c6.23215,5.00381 2.85803,10.16484 0.48128,16.4379c-1.15391,5.40005 -0.2706,13.52318 -5.19163,16.42792c-2.42121,4.68909 -8.44075,8.46298 -11.50237,12.55836c-0.40204,7.77229 -13.28124,14.18033 4.11181,15.55264c10.39936,3.91403 0.84401,26.36502 13.31281,19.94281c7.50462,1.22607 15.0556,2.11777 22.63494,2.74625c-0.39238,7.62897 -22.5267,1.97797 -13.1163,11.58453c1.07982,6.92346 8.91621,10.7157 8.84599,17.48584c5.9944,-1.29147 12.10994,-1.82657 18.15202,-2.83615c3.37088,5.89166 -0.36983,9.89844 -7.43889,11.44376c-5.76569,2.78299 -13.90942,1.32529 -17.11987,8.05481c5.45966,4.0535 12.07965,-0.71805 17.5741,-3.66177c10.46057,-10.45444 26.54765,1.42966 36.4883,-7.42117c10.24989,-9.68774 20.04298,7.84995 26.76607,3.17471c6.51434,1.58395 13.81729,-0.04028 12.06805,9.32629c3.50684,2.86578 12.93462,14.84363 13.60274,5.94415c0.63075,-11.07455 6.40611,-1.08078 7.78745,-9.83142c2.59969,-5.30115 3.94817,-14.25186 8.15144,-17.02936c9.07281,3.99167 19.31689,5.03348 28.17706,9.09244c8.56122,6.15195 19.95538,6.18124 29.83868,9.34244c9.35886,-1.56335 15.96658,6.25049 25.06323,6.91443c5.55371,3.15958 8.29126,11.43021 12.36185,2.40445c7.68176,3.71625 9.70868,-8.22134 16.83316,-1.38229c11.32907,4.36017 6.82425,-1.34332 5.44998,-8.80704c2.03979,-5.61975 -6.16705,-15.74173 0.15271,-18.27859c11.69501,0.05347 23.0376,1.85071 29.71429,-8.70847c5.97058,-3.59476 7.90405,-10.25342 14.03055,-14.18869c3.90176,-6.61261 5.42807,-10.23251 14.0647,-5.84784c5.20901,-5.07889 8.53738,-4.5715 15.08844,-2.4473c7.06326,-2.56491 15.4776,-6.54013 21.83215,-0.18204c12.48492,5.75409 17.59537,21.82541 31.94226,24.1983c11.18665,1.36331 35.74414,20.50461 28.80011,-3.10028c3.4527,-4.68234 1.66028,-13.50223 -3.41278,-17.53867c4.33789,-4.06219 4.11566,-14.63779 -3.9231,-13.29379c-6.08716,3.05099 -10.68024,7.05618 -12.63562,-0.18106c-3.65439,8.70651 -9.09213,-1.6004 -9.08893,-4.37726c-10.74146,-5.71704 7.77585,-16.85121 -4.75027,-17.78702c3.94687,6.52528 -8.56897,11.72046 -9.96512,3.89952c-1.82269,-6.53915 5.01703,-12.34123 1.42322,-17.0168c2.95145,-6.75627 3.69946,-13.5367 0.50897,-20.36127c-2.49402,-6.62515 -1.04245,-12.77097 2.8342,-18.49992c3.38055,-6.84421 7.05942,-13.61143 6.08783,-21.4501c1.37683,-9.6391 2.82132,-19.26114 6.58521,-28.31783c-6.7482,0.32956 -6.888,-6.46762 -14.94928,-6.02693c2.24661,-11.01723 7.01172,-21.37247 8.18689,-32.61552c-6.45956,-2.70406 -12.22202,0.41106 -18.22675,0.99155c-8.49487,0.98994 -10.29626,-6.86225 -17.366,-9.14591c0.30283,-6.92314 -9.89359,-8.78319 -3.62665,-15.84968c2.37289,-5.4081 9.25317,-12.44463 0.2345,-15.70825c-9.36658,-5.77599 -20.27814,-9.43777 -31.41327,-8.14792c-2.26208,4.65043 1.88324,12.39052 1.68866,18.32436c1.01282,5.09628 -3.71234,17.01775 -9.13657,9.18425c-12.43851,-9.28734 -25.10577,-18.26348 -37.83163,-27.15426c-1.05856,-8.95391 2.60098,-19.08236 -2.84772,-26.94325c-0.15271,-6.71632 0.79568,-14.08659 -7.18246,-16.53004c-3.11447,-2.2231 -6.61615,-3.84959 -9.90134,-5.80466l0.00452,0.00161l-0.00064,0l-0.00064,-0.00032l-0.00067,-0.00032l-0.00064,0.00032z'
,
big: 'm126.13187,166.37399l2.60612,0.39709l2.21611,-0.94444l4.34521,0.61346l-2.36455,5.21332l-0.10237,2.944l1.61113,3.89549l0.80051,2.09523l3.42189,2.0511l4.41385,2.82697l5.41591,3.30841l-7.97491,7.49803l5.37488,4.48602l-2.94887,9.46519l-3.78336,12.52675l-0.82913,2.91537l-11.81346,13.24303l-1.5201,1.85657l-0.37054,6.47043l-5.65646,3.6098l6.40784,4.08482l5.97681,3.91978l1.76678,3.60709l2.95212,7.19156l0.31528,7.67743l4.41173,-1.30032l3.4884,0.13757l9.10097,1.98019l4.90631,1.2247l-0.23254,2.49533l-2.95293,1.21127l-2.6165,-0.10248l-4.13422,5.88095l5.18335,5.80273l4.58179,6.37204l3.50595,3.82257l-1.34914,1.12778l0.21391,2.21747l-0.46182,0.72028l6.74263,-1.35693l12.30208,-2.16898l-0.49747,1.75076l-1.35963,1.41898l-0.47725,1.1601l1.85901,0.9577l1.15759,0.19421l-0.55896,3.51514l-12.78362,3.47733l-8.80827,2.15817l-1.0583,1.13837l0.40547,0.89838l-2.08102,1.24628l-0.17615,0.8768l2.6799,2.46295l0.96629,1.51349l2.21591,-0.94421l11.85344,-6.01859l7.11517,-3.70126l2.50188,-0.78497l3.78917,-0.14575l2.93781,-0.76886l4.33466,0.90643l5.63336,1.25449l1.44838,0.20505l7.29646,-4.72372l3.56503,-2.07187l3.92973,0.00818l13.0426,5.81891l1.76485,-0.52066l2.78725,-0.62582l1.27251,1.08173l10.83508,2.34158l0.05824,2.50882l-1.0054,3.793l3.27119,2.19327l5.24028,4.18414l2.2847,1.27066l4.75578,1.36496l0.77856,-9.84387l5.4928,1.10062l5.95947,-20.69675l9.39157,1.99365l18.43631,5.5896l7.23419,5.44397l8.08853,1.79129l6.51004,1.14102l10.40399,2.17709l8.34317,2.83539l12.8392,3.30728l5.76331,1.69958l3.11261,6.75504l4.83752,-0.98737l-1.18506,-3.58524l6.83618,0.12143l2.19061,-0.2077l3.77734,-3.97913l14.38763,4.84241l-0.19421,-2.80838l-0.74457,-3.71472l-1.30304,-8.60028l-0.6286,-2.82449l-1.39734,-1.67798l0.31293,-8.978l4.68591,-0.84702l7.13269,-0.01355l4.40265,-1.0062l0.43976,-0.12949l4.25696,-1.01163l3.80914,-0.73654l1.62671,-0.67166l0.77698,-1.44333l0.48285,-1.30829l4.18146,-3.07809l-0.2536,-1.04135l3.89551,-3.23718l0.33185,-1.16544l4.93945,-3.93326l0.04047,-1.17624l4.05463,-3.52591l0.04047,-1.17883l2.53052,-1.66721l0.72565,-4.10049l4.34064,0.76071l6.62823,1.88297l3.7525,-3.24261l-0.10529,-1.18158l1.93158,-1.1044l-0.1106,-1.03619l0.43707,0.017l5.36035,4.92926l16.33185,-5.10678l12.10999,7.55081l10.86102,10.00845l5.36298,4.78305l3.95215,3.54486l2.55469,1.86951l29.06506,9.69281l3.03223,0.7095l0.55298,-7.49417l0.25903,-7.50778l0.76611,-5.27667l-0.10522,-5.31177l-3.70935,-6.33688l1.51886,-1.85599l0.33716,-1.31116l1.10339,-2.46326l-3.55286,-6.62585l-5.82434,0.06552l-2.18518,0.06158l-4.78571,3.64349l-2.88916,-4.82999l-5.49255,-1.10065l1.80475,2.5766l-1.06561,1.28488l-4.55371,-2.98016l-4.1059,-11.65863l0.74725,-0.56032l3.07806,-0.61591l0.82288,-2.76814l-3.67163,-7.36659l-7.211,2.2216l4.02228,5.75955l-4.22723,0.12816l-0.55579,-0.75887l-3.63379,-0.14299l-0.52332,-1.64204l4.61572,1.21368l-3.92786,-4.28209l-1.4082,-1.38181l1.11151,-2.60944l0.90912,-5.27049l3.86304,1.92099l1.0899,-2.0208l-4.43768,-2.09129l3.86853,-15.02892l-5.83521,-12.16931l8.18488,-21.93474l1.55115,-2.73952l1.6969,-15.26228l0.44781,-4.55185l5.44659,-18.50513l-5.30096,-2.41933l-0.15375,-3.98611l-9.16681,-0.06607l4.27319,-18.25645l3.70935,-14.59377l-8.80536,-2.11581l-7.97437,3.37106l-9.35297,-3.16845l-1.99902,-1.11064l-0.3938,-1.19482l-0.98193,-1.07076l-0.25635,-1.04185l-6.63904,-1.58784l-0.53949,-1.20049l1.57544,-3.47546l-8.4223,-4.75359l9.1264,-19.68651l-19.40997,-11.08214l-6.67151,-0.70491l-6.38,-0.69334l-4.07355,-0.01321l1.92346,15.84712l0.98193,5.19764l-1.07635,5.85377l-1.35687,5.54729l-7.03033,-2.92944l-36.48096,-26.64141l-2.15277,-30.15425l-0.6637,-10.19657l-15.72864,-8.13663l-4.18958,-0.90198l-4.08997,0.42856l-3.07318,0.46856l-6.20203,2.55635l-3.39941,1.48754l-2.18323,4.18852l-8.30243,-4.01185l-0.04803,-2.80242l0.87701,-0.11287l-0.33881,-2.81391l-4.40131,1.00588l1.12683,1.07618l-2.62164,0.04417l0.30298,3.84427l-4.19464,-0.75482l-1.66534,1.85064l-2.42792,2.85235l-0.55383,3.36831l-0.53333,2.77958l1.68982,5.81498l1.5755,4.92618l1.97552,5.9738l0.24976,1.18885l-6.67084,-0.7049l-3.53024,9.44196l3.23239,7.4969l-0.76563,5.27618l-11.87634,2.48053l0.21933,2.07237l3.1485,5.72504l-3.99072,1.75864l-3.13663,-1.89188l-1.16272,-0.0456l-10.11343,-2.16706l-5.28964,-11.11617l-1.29813,-0.3461l-6.22281,3.14552l2.84772,6.00806l-7.59186,4.85966l-0.75726,0.85464l-1.4538,-0.05718l-6.94708,7.24387l-7.65259,-1.77512l-5.90936,6.69491l-9.72142,3.30199l-4.98,-3.29121l-10.44762,3.27367l-4.851,5.55698l-1.37962,2.00953l2.72546,1.13925l3.35382,-0.16293l0.24438,1.33589l3.10564,2.77538l-4.79951,4.08594l-0.04102,1.17728l-5.2408,4.21571l-7.08472,2.81641l-3.46251,-0.87324l-10.15254,3.1377l-1.90485,0.36742l5.64819,0.81199l1.33618,3.44256l-3.85611,2.0589l0.10927,1.03616l-2.78215,0.48046l-0.23199,2.49645l0.53009,1.49454l-3.1601,2.97121l-3.21297,0.3154l-2.35724,9.19351l-5.79897,-0.67093l-3.36838,0.60481l-7.3855,3.09914l-3.5062,-3.82292l-1.33539,-3.44279l5.00453,-9.97372l-11.35033,-4.27879l-1.37637,-2.26553l-2.53445,-2.45817l0.05096,-1.4716l-1.55792,-1.24092l-12.15018,-6.3741l-6.87158,-7.49315l-3.22647,4.88471l-0.00298,4.27424l0.72165,0.1759l-0.2989,4.4102l-3.2796,2.22913l0.69093,1.05911l-5.38113,4.06248l-0.48213,1.30785l-1.49957,1.26709l-0.05119,1.47186l-0.74211,0.41329l-1.84457,7.0024l-0.6039,17.36891l6.8336,4.39673l0.39511,1.19424l-0.46164,0.71867l-0.64284,1.74352l-2.58051,-1.13301l-1.63983,1.11443l-1.22939,1.86765l-1.30815,-0.05154l-5.55719,4.94002l-2.56308,2.55284l4.22546,-0.12869l-0.00006,0l0.00017,0z'};

aut.s = {path: 'm265.06274,252.77248l1.67719,-1.33644l0.50317,-2.5058l4.19296,2.00464l2.34805,1.50351l2.68347,1.67055l4.02521,0.50117l4.86383,0.6682l3.3544,0l3.68979,2.00465l3.68976,2.00467l3.68985,2.17172l4.02524,-0.8353l3.01895,0l3.52203,0.33411l4.02524,-1.50348l2.51581,-0.50119l0.67087,-2.33875l1.67719,-3.34114l3.68976,-1.00229l2.6835,1.00229l3.01895,1.67058l3.68979,0.33409l3.68979,0.16704l2.6835,0l3.52209,1.16943l1.67719,0.66821l4.02521,-0.16705l3.01892,0l1.84491,1.1694l2.01263,2.00467l2.18033,1.83759l2.6835,1.1694l3.68979,2.67288l2.01263,-0.8353l1.84491,-2.00464l-0.16772,-2.67291l1.34171,-2.5058l1.34174,-2.67294l1.67719,-2.33876l-0.67081,-4.17636l0.83856,-2.33881l3.68979,-2.50581l1.00632,-1.50348l-0.16763,-2.17171l-3.18674,-0.83531l-1.34174,-0.83525l-2.1803,-4.5105l-1.67722,-3.34108l-1.84488,-3.007l-2.18036,-4.5105l-2.34805,0.16704l-0.50317,1.83763l-0.67087,1.1694l-3.68979,-1.00235l-1.50946,1.33643l-1.00632,1.00235l-3.85751,-2.33878l-2.68353,-1.83763l-1.34174,-0.6682l-2.0126,-6.68222l-1.84488,-4.67754l-1.00632,-3.67523l1.17404,-5.01166l0.33542,-1.00235l-3.01892,-2.00465l-2.6835,-2.17171l-3.52209,-2.17169l-0.16772,-2.83998l1.00641,-3.00699l1.50946,-2.67288l-0.33548,-2.67284l-1.17398,-1.1694l1.67719,-5.17871l1.50949,-4.67754l-0.33548,-2.17172l-1.17401,-0.50116l-2.85123,-0.33414l-3.35431,-2.00462l-2.01263,-1.67058l0,-0.66821l7.21185,0l1.00632,-1.0023l-0.16772,-1.50351l-4.36066,-2.00467l-6.03787,-0.50113l-2.8512,0.16704l-4.19293,0l-1.67722,-3.17406l-2.0126,-6.34808l-1.34177,-5.17871l1.17407,-4.00931l4.19287,0.16704l2.18042,0.16705l0,-2.17174l-1.34183,-2.00467l-3.3544,-0.6682l-3.35437,0.50113l-2.18036,2.00467l-5.53467,0.16704l-5.70245,-0.83527l-3.68976,-3.34111l-1.67706,-1.67053l-3.18677,0.16705l-2.6835,0.8353l-1.84491,0.16705l-0.67087,1.67052l-1.00632,2.83995l-4.87341,1.30066l-0.15811,-0.29834l1.17404,1.50348l1.17401,1.33647l2.68347,1.00232l3.85754,5.67987l4.19293,6.68222l-3.01889,6.3481l-2.51581,2.83989l0.16772,3.67523l-1.67719,3.50818l1.17401,1.67053l5.70245,0l2.51578,-2.17172l3.68979,3.6752l1.34174,3.34111l2.01263,3.67525l-2.18033,2.33876l-0.16772,4.34341l-1.67722,0l-0.67087,1.67058l1.50949,1.67053l-1.50949,2.17174l-0.16769,1.83763c0,0 1.00629,2.00464 1.84488,2.00464c0.83862,0 -0.33542,2.83992 -0.33542,2.83992l-2.18036,0.83528l-1.17398,2.67287l-1.84491,-2.33876l-2.34808,1.50352l-6.37332,-3.8423l-0.16769,-1.50346l-4.02521,-3.50815l-2.6835,0l-2.18036,-4.51048l1.17404,-3.67523l2.18033,-0.33411l-1.17401,-2.33876l-4.19293,-2.00468l0.16769,-2.67285l-2.85123,-1.50348l-1.67715,0.50113l-3.52209,-0.16704l-2.6835,1.33644l-2.8512,-0.16705c0,0 -1.59335,3.80052 -2.8512,4.8446l-0.16776,-0.33412l1.00632,3.84227l2.6835,1.67058l3.01892,1.33641l0.33542,3.67523l0,2.5058l1.67722,2.00465l1.34174,1.83762l-2.34805,3.84225l-1.50946,2.00467l-0.67087,2.83998l-0.83859,2.83989l-1.84488,2.50581l-2.18036,1.00235l-3.35434,0l-4.52841,4.3434l0.16769,2.50583l-7.71503,3.00699l-4.19295,-2.83995l-1.84489,0.66821l-3.01895,2.67288l-4.86382,2.17171l-3.6898,2.00467l-4.69609,-0.33409l-2.18033,1.1694l1.00632,4.00928l-1.17407,2.17172l0.16777,4.8446l0.33539,3.84229l2.51579,1.00233l1.34172,1.50348l0.16777,4.00934l0,3.67522l0.03563,-0.24503l2.31239,-0.50674l4.19292,-0.91882l2.00917,1.50003l0.17119,0.17056l4.69612,-1.1694l3.85751,-2.6729l1.17404,-2.00464l1.0063,-2.83995l3.85751,-1.00232l3.01894,0.66823l3.01891,-2.6729l2.51579,1.50351l2.18031,0.50114l3.18665,0l4.02524,2.83995l1.34177,1.50349',
name: "Salzburg",
big: 'm241.31274,301.10049l4.17722,-3.32849l1.2532,-6.24094l10.44296,4.99274l5.84805,3.74466l6.68344,4.16068l10.02515,1.2482l12.11383,1.66425l8.35446,0l9.18979,4.99274l9.1897,4.99283l9.18991,5.40887l10.02524,-2.08038l7.51898,0l8.77197,0.83212l10.02524,-3.74457l6.26584,-1.24826l1.67087,-5.82486l4.17719,-8.32138l9.1897,-2.49637l6.68353,2.49637l7.51898,4.16068l9.18976,0.83206l9.18979,0.41605l6.6835,0l8.77213,2.9126l4.17719,1.66425l10.02518,-0.41605l7.51889,0l4.59494,2.91251l5.01263,4.9928l5.43033,4.57669l6.68353,2.91251l9.18973,6.65707l5.0127,-2.08038l4.59491,-4.99274l-0.41772,-6.65717l3.34161,-6.24091l3.34174,-6.65732l4.17719,-5.82486l-1.67072,-10.40161l2.08856,-5.82504l9.18976,-6.24091l2.50635,-3.74457l-0.41754,-5.40887l-7.93689,-2.08047l-3.34167,-2.08023l-5.43024,-11.23383l-4.17731,-8.32124l-4.59485,-7.48926l-5.43036,-11.23383l-5.84808,0.41606l-1.25317,4.57675l-1.6709,2.91251l-9.18973,-2.49644l-3.75946,3.32849l-2.50635,2.49646l-9.60748,-5.82495l-6.68359,-4.57675l-3.34174,-1.66425l-5.01257,-16.64272l-4.59485,-11.64981l-2.50632,-9.15352l2.92404,-12.48201l0.83539,-2.49652l-7.51889,-4.99274l-6.68353,-5.40881l-8.77209,-5.4088l-0.41776,-7.07329l2.50665,-7.4892l3.75937,-6.65706l-0.83554,-6.65695l-2.92383,-2.91252l4.17719,-12.89807l3.75952,-11.64985l-0.83554,-5.40887l-2.92398,-1.24819l-7.10126,-0.8322l-8.35422,-4.99271l-5.01266,-4.16073l0,-1.66425l17.96179,0l2.50635,-2.49633l-0.41776,-3.74464l-10.86063,-4.99282l-15.0379,-1.24811l-7.10117,0.41602l-10.4429,0l-4.17725,-7.90529l-5.0126,-15.81051l-3.3418,-12.89804l2.92416,-9.9856l10.44266,0.41606l5.43054,0.41602l0,-5.40892l-3.34195,-4.99282l-8.35446,-1.66421l-8.35437,1.24811l-5.43039,4.99282l-13.78461,0.41603l-14.20251,-2.08031l-9.1897,-8.32135l-4.17688,-4.16062l-7.93695,0.41606l-6.68353,2.08039l-4.59491,0.41606l-1.67087,4.16058l-2.50632,7.07317l-12.1377,3.23942l-0.3938,-0.74304l2.92404,3.74456l2.92401,3.32861l6.68344,2.49637l9.60757,14.14626l10.4429,16.64271l-7.51883,15.81054l-6.26587,7.07302l0.41772,9.15351l-4.17719,8.73746l2.92398,4.16062l14.20251,0l6.26578,-5.40888l9.18979,9.15343l3.34171,8.32136l5.01266,9.15356l-5.43033,5.82491l-0.41772,10.81769l-4.17728,0l-1.67084,4.16077l3.75952,4.16054l-3.75952,5.40897l-0.41766,4.57675c0,0 2.50626,4.99275 4.59485,4.99275c2.08865,0 -0.83539,7.07312 -0.83539,7.07312l-5.43039,2.08031l-2.92392,6.65707l-4.59494,-5.82486l-5.84811,3.74463l-15.87335,-9.56966l-0.41766,-3.74448l-10.02518,-8.73738l-6.6835,0l-5.43039,-11.23383l2.92404,-9.15352l5.43033,-0.83212l-2.92398,-5.82486l-10.4429,-4.99286l0.41766,-6.65696l-7.10126,-3.7446l-4.17712,1.24812l-8.77209,-0.41603l-6.68353,3.32854l-7.10117,-0.41602c0,0 -3.96841,9.46552 -7.1012,12.06588l-0.41779,-0.83214l2.50632,9.56958l6.6835,4.16071l7.51892,3.32841l0.83539,9.15359l0,6.24084l4.17728,4.99283l3.34171,4.57675l-5.84805,9.5695l-3.75943,4.99281l-1.67087,7.07321l-2.08859,7.07306l-4.59485,6.24092l-5.43039,2.49652l-8.35431,0l-11.27844,10.81761l0.41766,6.24101l-19.21501,7.4892l-10.44293,-7.07321l-4.59489,1.66425l-7.51898,6.65715l-12.1138,5.4088l-9.1898,4.99283l-11.69606,-0.83212l-5.43031,2.91258l2.50632,9.98549l-2.92413,5.40887l0.41785,12.06595l0.83531,9.56958l6.26582,2.49637l3.34169,3.74457l0.41785,9.98563l0,9.15353l0.08873,-0.61035l5.75925,-1.26202l10.44286,-2.28842l5.00403,3.73599l0.42636,0.4248l11.69614,-2.91251l9.60751,-6.65717l2.92406,-4.99274l2.50629,-7.07312l9.60751,-2.49637l7.51895,1.66425l7.51886,-6.65707l6.26582,3.74463l5.43028,1.24811l7.93663,0l10.02524,7.07312l3.3418,3.74457'
};

aut.t = {path: 'm230.81476,174.89842l-3.02408,2.34042l-3.51932,2.00458l2.18114,5.34209l0.33716,5.84583l-3.69841,0.83961l-9.55696,-1.16496l-1.16959,0.82913l-2.18112,-0.82913l-12.58104,3.33746l-0.67435,2.67628l-5.53186,-1.00755l-8.89311,0.83963l-3.01355,-1.17545l-3.85649,3.34795l0,4.50244l-2.34972,2.67627l-5.53186,0.67169l-5.03662,-1.17546l-4.36226,5.35257l2.01253,0.49327l-0.49522,2.50835l-4.86804,-0.16791l-3.85649,3.51587l-0.50577,2.00459l-2.51831,2.00458l-2.84494,-0.50377l1.84396,-3.01213l-1.67538,-1.3329l-2.34972,0.50377l-3.51933,0.99707l-4.02507,4.34503l-4.86803,-0.50377l-3.6879,1.00754l-3.85651,-2.1725l1.67538,-2.34044l-5.86903,-7.51454l-3.52985,0.33583l-1.00101,-1.83665l3.68791,-2.50838l-3.01357,-2.67625l-5.86903,2.34042l-3.36126,0l-0.66383,-2.1725l-3.36127,0.16791l-2.34972,-2.84419l-4.68891,0.16791l-2.6869,-1.50078l-2.6869,2.50836l-0.16859,2.00458l-4.52031,0l-3.52985,-2.34041l0.67436,-2.1725l-0.16859,-1.50081l-4.53085,1.33289l2.18113,2.67628l-1.67535,2.50835l1.18011,2.162l-1.01154,2.00458l3.02408,1.67923l0.83241,6.50702l-3.6879,4.51295l-0.33717,2.50835l-1.67537,-0.16791l-2.34972,2.50835l0.84295,1.16499l-4.86803,6.18167l-2.34972,0l-2.34972,2.34041l-3.6879,1.50081l-2.51832,-0.50377l-2.6553,0.82913l-0.02107,0.17838l1.16961,4.0092l1.34871,3.67331l0.49524,3.34799l-0.66383,3.50543l-1.84395,3.67328l-2.34972,3.5054l-0.84295,2.50833l0.50578,2.84424l-1.67537,3.16959l-0.33718,1.50076l0.83242,3.18008l0.16859,2.83365l-1.33819,3.18005l-3.02408,2.34045l0.33718,4.00922l2.8555,1.66867l-0.15805,4.77536l3.84595,0.06296l3.02407,-2.32993l3.51932,-1.00757l0.16858,-3.33749l1.001,-3.5159l4.53086,0.83963l1.33817,-0.50375l-0.49522,-2.00458l2.01254,-1.66876l1.84396,-5.0062l1.33819,0.15741l1.50677,-0.49326l3.85648,2.49783l0.50578,2.17252l4.36224,3.5159l-2.01254,5.17413l0.50578,1.83667l3.35072,2.34039l5.70044,0.33588l5.03663,-2.50833l4.69944,0.16791l2.50777,2.50833l3.85648,0.99707l0.50578,2.00458l-2.34972,3.01212l2.18111,0.50378l2.51833,-1.17545l1.67535,2.00455l3.68791,0.33585l2.51831,1.66876l6.3748,-1.50082l5.19468,1.16498l1.01154,-3.67331l3.18213,-2.83371l0,-4.84879l2.18115,-2.17255l-0.50578,-4.345l6.71199,-7.8504l6.20622,-0.50378l6.54338,-2.17252l3.85651,0.67172l2.18112,1.50079l3.35074,-0.8291l3.68791,-4.84879l2.01253,0l2.85547,2.50827l6.37483,-2.67627l8.55591,2.50836l1.84396,1.83667l3.18216,0l0.33716,-2.17255l5.03665,-0.50375l9.89412,-5.67792l9.72551,-2.50836l2.68689,-3.00162l1.84395,-0.4093l0,-3.43196l-0.16858,-4.00917l-1.34871,-1.50079l-2.50778,-1.00754l-0.33716,-3.84126l-0.16861,-4.84879l1.1696,-2.17253l-1.00099,-4.00917l2.18112,-1.16496l4.68889,0.33586l3.69844,-2.00458l4.85748,-2.1725l3.02411,-2.67627l1.84395,-0.66119l4.19366,2.83371l7.713,-3.00165l-0.16859,-2.50836l4.53085,-4.34502l3.35072,0l2.18112,-0.99707l1.84396,-2.50833l0.84293,-2.84421l0.66385,-2.83368l1.5173,-2.00462l2.3392,-3.85173l-1.3382,-1.83664l-1.67538,-2.00461l0,-2.49786l-0.33716,-3.68381l-3.01355,-1.3329l-2.68689,-1.66875l-0.92725,-3.53691l-2.09689,-0.64021l-2.50777,1.83667l-5.20523,-4.34499l-1.67535,-3.67336l-5.70044,1.50082l-3.36127,-0.99704l-5.86902,2.00458l-1.33821,-3.18007l1.84396,-2.49785l-0.83241,-1.17546l0,0.00003l0.00002,0.00003l0.00005,0.00002l0.00002,0.00003zm26.74258,11.1669l0.08426,0.03148l-0.16858,-0.33585l0.08426,0.30437l0.00006,0zm-34.96135,71.78728l4.42549,-0.94107l2.12845,-0.43732l2.04414,1.61975l-2.06523,-1.6687l-3.12944,0.68216l-3.40344,0.74518l0.00003,0zm8.5981,0.24136l0.62166,0.50378l-3.01353,5.84583l-5.37381,1.33289l0,6.1817l2.51831,3.67328l0.33717,2.50839l5.02611,3.16953l3.52986,-0.32532l1.16957,1.16495l2.8555,5.18466l-1.34872,6.50702l3.36125,1.34338c0,0 2.67987,-0.33502 3.35074,-0.16791c0.00253,0.00064 0.00761,-0.00101 0.01016,0c0.01015,0.00378 0.0311,0.01367 0.04213,0.0209c0.6954,0.49945 2.12845,6.8219 2.12845,6.8219l3.68791,2.17252l11.73805,5.35257l4.02509,0.49326l4.36227,-0.08389l0.70596,0.6402l0.47415,-1.72119c0,-0.00003 1.33139,-2.98676 2.17059,-3.5054c0.83859,-0.50119 1.18011,-4.17709 1.18011,-4.17709l0.16861,-4.345l2.84494,0.168l3.52985,0.16794l3.18216,-1.8367l3.68793,-2.17258l2.68689,2.34042l2.8555,0.32535l-0.67438,-3.84125l-2.51831,-2.49783l-2.68692,-3.68384l-3.01352,-2.49786l-2.51834,-2.84421l-0.33716,-3.67331l-1.3382,-3.67334l-3.18213,-0.50372l-1.18011,-2.84427l-2.01254,-2.49774l0.84293,-3.18005l1.67538,-4.51294l-5.2052,-1.50082l-5.36328,-1.16495l-1.00101,-4.00923l-1.34872,-1.51131l-4.02509,-2.83371l-3.18213,0l-2.18112,-0.50377l-2.51831,-1.50082l-3.01355,2.66577l-3.02408,-0.66118l-3.85652,0.99704l-1.00099,2.84421l-1.18013,2.00459l-3.85649,2.67625l-4.69945,1.16501l-0.11589,0l0.00041,0l-0.00003,-0.00003l0.00002,-0.00003l0,-0.00003zm-179.66414,33.51123l-0.16859,0l0.15806,0.3988l0.01054,-0.3988l-0.00001,0z',
name: "Tirol",
big: 'm464.53119,5.33999l-7.36508,5.70006l-8.57126,4.88211l5.31213,13.01056l0.82114,14.23741l-9.00742,2.04487l-23.27582,-2.83725l-2.84848,2.01934l-5.3121,-2.01934l-30.6409,8.12833l-1.64236,6.51805l-13.47275,-2.45388l-21.65903,2.04491l-7.33945,-2.86278l-9.39243,8.15387l0,10.96562l-5.72269,6.51801l-13.47275,1.63589l-12.2666,-2.86281l-10.62421,13.03609l4.90146,1.20135l-1.20612,6.10903l-11.85602,-0.40894l-9.39243,8.56284l-1.23178,4.88215l-6.1333,4.88212l-6.9288,-1.22692l4.49094,-7.33599l-4.08035,-3.24626l-5.72272,1.22692l-8.57127,2.42834l-9.80298,10.58225l-11.856,-1.22692l-8.98181,2.45384l-9.39247,-5.29108l4.08037,-5.7001l-14.29393,-18.30154l-8.59688,0.81791l-2.43796,-4.47314l8.98184,-6.10912l-7.33948,-6.51797l-14.29393,5.70006l-8.18629,0l-1.61676,-5.29108l-8.18631,0.40894l-5.72269,-6.92699l-11.41977,0.40894l-6.54391,-3.65511l-6.54389,6.10907l-0.41059,4.88212l-11.00914,0l-8.59689,-5.70003l1.6424,-5.29109l-0.41061,-3.65519l-11.0348,3.24622l5.3121,6.51805l-4.0803,6.10903l2.87415,5.26552l-2.4636,4.88212l7.36509,4.08974l2.02733,15.84773l-8.9818,10.99123l-0.82118,6.10903l-4.08034,-0.40894l-5.72269,6.10903l2.05299,2.83733l-11.85602,15.05536l-5.72269,0l-5.72271,5.69998l-8.98181,3.65523l-6.13333,-1.22688l-6.46694,2.01927l-0.05131,0.43449l2.84856,9.76431l3.28476,8.94627l1.20615,8.15398l-1.61675,8.53743l-4.4909,8.94621l-5.72271,8.53734l-2.05299,6.10899l1.23182,6.92709l-4.08033,7.71948l-0.8212,3.65508l2.02734,7.74504l0.4106,6.90131l-3.25914,7.74498l-7.36509,5.70013l0.8212,9.76437l6.95452,4.06403l-0.38493,11.63031l9.36675,0.15332l7.36506,-5.6745l8.57125,-2.45392l0.41057,-8.12842l2.43792,-8.5629l11.03485,2.04489l3.25907,-1.22687l-1.20609,-4.88211l4.90149,-4.06424l4.49094,-12.19252l3.25913,0.38338l3.66971,-1.20132l9.3924,6.08344l1.23183,5.29114l10.62415,8.5629l-4.90151,12.60153l1.23183,4.47318l8.16063,5.69998l13.88332,0.81802l12.26662,-6.10901l11.4454,0.40894l6.10762,6.10901l9.39241,2.42834l1.2318,4.88211l-5.72269,7.33597l5.31204,1.22696l6.13336,-2.86279l4.08028,4.88205l8.98184,0.81793l6.13332,4.06424l15.52571,-3.65521l12.65155,2.83728l2.46358,-8.94629l7.75003,-6.90146l0,-11.80911l5.31215,-5.2912l-1.23183,-10.58218l16.34694,-19.11952l15.11516,-1.22696l15.93628,-5.29112l9.39246,1.63596l5.3121,3.65517l8.16064,-2.01927l8.98187,-11.80913l4.90146,0l6.95444,6.10884l15.52582,-6.51808l20.83777,6.10909l4.49094,4.47318l7.75009,0l0.82114,-5.2912l12.26669,-1.22688l24.09695,-13.82848l23.68631,-6.10907l6.54388,-7.31039l4.49091,-0.99684l0,-8.35844l-0.41058,-9.76431l-3.28476,-3.65508l-6.10767,-2.45384l-0.82114,-9.35536l-0.41064,-11.80914l2.84854,-5.29112l-2.4379,-9.76431l5.3121,-2.8372l11.41971,0.81795l9.00748,-4.88211l11.83032,-5.29109l7.36514,-6.51801l4.49091,-1.61033l10.21362,6.90145l18.78485,-7.31046l-0.41058,-6.10907l11.03479,-10.58221l8.16064,0l5.31207,-2.42835l4.49097,-6.10899l2.05292,-6.92702l1.61682,-6.90138l3.69531,-4.88223l5.69714,-9.38082l-3.25916,-4.47311l-4.08038,-4.88219l0,-6.08351l-0.82117,-8.97185l-7.33942,-3.24626l-6.54388,-4.06421l-2.2583,-8.61409l-5.10699,-1.55923l-6.1076,4.47318l-12.67728,-10.58214l-4.08023,-8.94639l-13.88336,3.65519l-8.18631,-2.42827l-14.29391,4.88212l-3.25919,-7.745l4.49094,-6.08347l-2.02731,-2.86281l0,0.00007l0.00006,0.00007l0.00012,0.00007l0.00003,0.00007l0,0.00004zm65.1311,27.19679l0.2052,0.07667l-0.41052,-0.81795l0.2052,0.74128l0.00012,0zm-85.14777,174.83669l10.7782,-2.29196l5.18381,-1.06508l4.97849,3.94489l-5.02985,-4.0641l-7.6217,1.66139l-8.289,1.81487l0.00006,0zm20.94052,0.58784l1.51404,1.22696l-7.33942,14.2374l-13.0878,3.24623l0,15.05542l6.1333,8.94621l0.82117,6.10915l12.241,7.71933l8.59692,-0.7923l2.84848,2.83719l6.9545,12.62717l-3.28479,15.84775l8.18628,3.27176c0,0 6.52676,-0.81592 8.16068,-0.40894c0.00616,0.00159 0.01852,-0.00244 0.02475,0c0.02469,0.00922 0.07571,0.03333 0.1026,0.05093c1.69363,1.2164 5.18381,16.61462 5.18381,16.61462l8.98184,5.29111l28.5878,13.0361l9.80304,1.20132l10.62427,-0.20435l1.71936,1.5592l1.15479,-4.19193c0,-0.00009 3.24255,-7.2742 5.28644,-8.53735c2.04236,-1.22064 2.87415,-10.17325 2.87415,-10.17325l0.41064,-10.58215l6.92877,0.40915l8.59692,0.40909l7.75006,-4.47327l8.98193,-5.29135l6.54382,5.70007l6.95453,0.79239l-1.6424,-9.35532l-6.1333,-6.0834l-6.54401,-8.97195l-7.33936,-6.0835l-6.13336,-6.927l-0.82117,-8.94629l-3.25916,-8.94637l-7.75,-1.22681l-2.87415,-6.92717l-4.90149,-6.08313l2.05292,-7.74496l4.08038,-10.9912l-12.67719,-3.65523l-13.06219,-2.8372l-2.43793,-9.76445l-3.28479,-3.68073l-9.80304,-6.90146l-7.75006,0l-5.31201,-1.22696l-6.13336,-3.65523l-7.33942,6.49245l-7.36511,-1.61026l-9.39249,2.42821l-2.4379,6.92709l-2.87418,4.88211l-9.39243,6.51793l-11.44543,2.83736l-0.28223,0l0.00098,0l-0.00006,0l0.00003,-0.00006l0,-0.00008l0,-0.00008zm-437.56895,81.61604l-0.4106,0l0.38496,0.97125l0.02567,-0.97125l-0.00003,0z'
};

aut.v = {path: 'm51.53009,292.07324l0.16771,-5.17871l-2.8512,-1.67056l-0.33544,-4.00931l3.01892,-2.33881l1.34174,-3.17401l-0.16771,-2.83994l-0.83859,-3.17407l0.33543,-1.50345l1.67718,-3.17407l-0.50315,-2.83994l0.83858,-2.5058l2.34807,-3.50818l1.84489,-3.67528l0.67087,-3.50815l-0.50315,-3.34111l-1.34176,-3.50728l-1.18677,-3.94844l-0.03595,-0.09694l0,-1.83763l1.17402,-1.50346l2.18034,-0.50121l0.67087,-1.67053l-0.67087,-2.83994l2.01262,-3.67523l-0.83858,-2.67287l-3.6898,-1.00233l-2.18033,2.83992l-3.18665,-0.50114l-1.84491,2.00468l-0.33544,-4.84462l-1.8449,-1.50349l2.85121,-1.83762l-0.50314,-3.17404l-1.34175,-1.83762l-2.51577,-0.83528l0,-2.50583l-1.34174,0l-2.34806,1.67055l-0.83858,-1.16939l0,-2.83992l-2.68351,-1.83763l-1.00631,-2.50583l-3.85752,1.83763l-1.84489,-2.33879l-2.01263,1.67053l-3.35436,-2.00465l0.16772,-3.174l-1.50947,-1.83763l-3.68981,0.16704l-1.50945,3.50816l-2.01263,3.67519l-9.05677,0.50122l-3.68981,-0.33411l-1.17403,3.84224l0.8386,1.67052l2.51577,3.007l4.69611,1.50348l-1.00631,4.00935l2.51577,3.00699l0,2.83994l-2.85121,1.00232l-2.34805,0.33412l-2.18034,5.01167l-2.51578,3.00696l-2.34805,4.00932l3.01894,2.83994l-1.17403,1.83763l2.34806,2.67285l-0.33544,4.67754l1.50947,1.50352l2.34805,2.83992l0.50316,2.17171l0.16771,3.17404l-1.67718,4.5105l3.01893,0.50116l2.85121,-0.66821l6.70873,3.34109l2.68349,0l3.18665,1.83762l3.68981,0.16705l2.18033,3.34109l-1.34175,2.50583l0,1.50348l0.16773,3.34113l2.01262,0.33411l2.01262,3.17404l3.68979,-0.33414l1.6772,1.33649l1.84489,0l3.6898,3.17401l0.16771,1.50351l2.68349,0.16705l2.3684,1.69925',
name: "Vorarlberg",
big: 'm389.52005,331.07324l0.57666,-17.80646l-9.80356,-5.74408l-1.15338,-13.78558l10.38025,-8.04175l4.61343,-10.91351l-0.57666,-9.7648l-2.88339,-10.91373l1.15332,-5.16946l5.76685,-10.91371l-1.73004,-9.76483l2.88336,-8.61594l8.07361,-12.0625l6.34344,-12.63713l2.30673,-12.06239l-1.73001,-11.48802l-4.61353,-12.05946l-4.08057,-13.57625l-0.12363,-0.33337l0,-6.31845l4.03674,-5.16956l7.49689,-1.7234l2.3067,-5.74396l-2.3067,-9.76472l6.92017,-12.6369l-2.88339,-9.19043l-12.68698,-3.44637l-7.49683,9.76472l-10.95697,-1.72308l-6.34354,6.89285l-1.15338,-16.65768l-6.34351,-5.16966l9.80359,-6.31845l-1.72998,-10.91362l-4.61349,-6.31845l-8.65018,-2.87208l0,-8.61598l-4.61346,0l-8.07355,5.74401l-2.88336,-4.02082l0,-9.76477l-9.22699,-6.3185l-3.46008,-8.61604l-13.26367,6.31851l-6.34348,-8.04169l-6.92023,5.74395l-11.5336,-6.8928l0.57666,-10.91346l-5.19016,-6.31851l-12.68704,0.57434l-5.19006,12.06246l-6.92023,12.63675l-31.14078,1.7234l-12.68703,-1.14879l-4.03679,13.21114l2.88344,5.7439l8.65022,10.33928l16.14709,5.16956l-3.4601,13.7857l8.65022,10.33922l0,9.76482l-9.80359,3.44648l-8.07353,1.14879l-7.49689,17.23218l-8.65024,10.33912l-8.07353,13.78548l10.38031,9.76494l-4.03677,6.31856l8.07356,9.19032l-1.15338,16.08318l5.19016,5.16977l8.07353,9.76472l1.73006,7.46713l0.57666,10.91362l-5.76682,15.50888l10.38028,1.72319l9.8036,-2.29759l23.06726,11.48802l9.22693,0l10.95694,6.31844l12.68704,0.5744l7.49686,11.48801l-4.61346,8.61606l0,5.16956l0.57672,11.4881l6.92017,1.1488l6.9202,10.9136l12.68698,-1.1489l5.76685,4.59537l6.34348,0l12.68701,10.91351l0.57666,5.16968l9.2269,0.5744l8.14349,5.84268'
};

var socketSvg = {};

socketSvg.connected = 'M25.06,13.719c-0.944-5.172-5.461-9.094-10.903-9.094v4c3.917,0.006,7.085,3.176,7.094,7.094c-0.009,3.917-3.177,7.085-7.094,7.093v4.002c5.442-0.004,9.959-3.926,10.903-9.096h4.69v-3.999H25.06zM20.375,15.719c0-3.435-2.784-6.219-6.219-6.219c-2.733,0-5.05,1.766-5.884,4.218H1.438v4.001h6.834c0.833,2.452,3.15,4.219,5.884,4.219C17.591,21.938,20.375,19.153,20.375,15.719z';
socketSvg.disconnected = 'M9.219,9.5c-2.733,0-5.05,1.766-5.884,4.218H1.438v4.001h1.897c0.833,2.452,3.15,4.219,5.884,4.219c3.435,0,6.219-2.784,6.219-6.219S12.653,9.5,9.219,9.5zM27.685,13.719c-0.944-5.172-5.461-9.094-10.903-9.094v4c3.917,0.006,7.085,3.176,7.094,7.094c-0.009,3.917-3.177,7.085-7.094,7.093v4.002c5.442-0.004,9.959-3.926,10.903-9.096h2.065v-3.999H27.685z';

var html5Svg = {};

html5Svg.connectivity = 'm26.78053,20.75007l4.00973,0l0,-9.62758l-4.51756,-4.51756l-2.83537,2.83537l3.3432,3.3432l0,7.96655l0,0zm4.02031,2.01015l-5.84002,0l-8.14641,0l-3.3432,-3.3432l1.41769,-1.41769l2.76132,2.76132l5.68132,0l-5.59669,-5.60727l1.42827,-1.42827l5.59669,5.59669l0,-5.68133l-2.75074,-2.75074l1.40711,-1.40711l-6.9509,-6.98264l-6.85568,0l0,0l-7.10959,0l3.99915,3.99915l0,0.01058l0.02116,0l8.27337,0l2.93059,2.93059l-4.2848,4.2848l-2.93059,-2.93059l0,-2.27465l-4.00972,0l0,3.93567l6.94032,6.94032l-2.82479,2.82479l4.51756,4.51756l6.85569,0l12.81208,0l0,0l-3.99914,-3.97799l0,0z';


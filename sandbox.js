/*
 * interface must be dependable
 * determine which parts of the framework a module can access
 * translate module requests into core actions
 */

SJA.sandbox = {
	create: function (core, module_selector) {
		
		//module's container element
		//var module_container = core.dom.query('#'+module_selector);
		
		return {
			find: function (selector) {
				return core.dom.query(selector);
			},
			
			//el can be a single DOM element, collection of DOM elements, or a CSS selector
			addEvent: function (el, type, fn) {
				console.log('addEvent called')
				core.dom.bind(el, type, fn);
			},
			
			removeEvent: function (element, type, fn) {
				console.log('removeEvent called')
				core.dom.unbind(element, type, fn);
			},
			
			//evt is an object literal containing the event type and data associated w/ the event
			publish: function (evt) {
				console.log('Publication on topic: '+evt.type)
				core.triggerEvent(evt);
			},
			
			//evts is an object containing topics and functions that the module is listening to
			//subscribe method returns a subscription identifier that can be used for unsubscribing functions in the destroy
			subscribe: function (topic, cb) {
				return core.registerEvents(topic, cb);
			},
			
			unsubscribe: function (topic, index) {
				core.unregisterEvents(topic, index);
			}
		};
	}
};
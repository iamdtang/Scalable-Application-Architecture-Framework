/*
 * interface must be dependable
 * determine which parts of the framework a module can access
 * translate module requests into core actions
 */

var Sandbox = {
	create: function (core, module_selector) {
		
		//module's container element
		//var module_container = core.dom.query('#'+module_selector);
		
		return {
			find: function (selector) {
				return core.dom.query(selector);
			},
			
			addEvent: function (element, type, fn) {
				console.log('addEvent called')
				core.dom.bind(element, type, fn);
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
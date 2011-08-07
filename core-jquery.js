/*
 * manages lifecycle of each module. tells a module when it should initialize and when it should shutdown
 * enable inter-module communication. loose coupling between related modules
 * detect, trap, and report errors
 */

var CORE = (function () {
	//topicList is an array of array's containing subscriptions for all topics
	var moduleData = {}, moduleInstances = {}, topicList = [];
		
	return {
		create_module: function (moduleId, creator) {
			var tmp;
			if (typeof moduleId === 'string' && typeof creator === 'function') {			
				//ensures that a valid module is being created (i.e. it has init and destroy methods)
				tmp = creator(Sandbox.create(this, moduleId));
				if (typeof tmp.init === 'function' && typeof tmp.destroy === 'function') {
					moduleData[moduleId] = creator;
					console.log(moduleId + ' created');
				}
			}
			else {
				throw new Error('moduleId and creator function are of the wrong type');
			}
		},
		
		start: function (moduleId) {
			if (moduleData[moduleId]) {
				if ( !(moduleInstances[moduleId]) ) {
					moduleInstances[moduleId] = moduleData[moduleId](Sandbox.create(this, moduleId));
				}
				
				moduleInstances[moduleId].init();
			}
			else {
				throw new Error(moduleId+' module does not exist.');
			}
		},
		
		startAll: function () {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},
		
		stop: function (moduleId) {
			if (typeof moduleId === 'string') {
				if (moduleInstances[moduleId]) {
					moduleInstances[moduleId].destroy();
				}
				else {
					throw new Error(moduleId+' module has not been created.');
				}
			}
		},
		
		stopAll: function () {
			for (var moduleId in moduleInstances) {
				if (moduleInstances.hasOwnProperty(moduleId)) {
					this.stop(moduleId);
				}
			}
		},
		
		triggerEvent: function (evt) {
			var len = null;
			if (typeof evt === 'object') {
				if (typeof evt.type === 'string') {
					//check if the topic exists. if it doesnt, return from the function
					if (topicList[evt.type] === undefined) {
						console.log('No subscriptions to topic: '+evt.type);
						return;
					}
					else {
						len = topicList[evt.type].length;
						for (var i=0; i<len; i++) {
							//invoke fn for specified topic, passing it the data property of the evt object
							topicList[evt.type][i](evt.data);
						}
					}
				}
			}
			else {
				throw new Error('evt is not an object');
			}
		},
		
		registerEvents: function (topic, cb) {
			if (typeof topic === 'string' && typeof cb === 'function') {
				if ( !(topicList[topic]) ) {
					topicList[topic] = [];
				}
				topicList[topic].push(cb);

				//return current index so that it can be used for unsubscribing
				return (topicList[topic].length - 1);
			}
			else {
				throw new Error('Topic and callback are of the wrong type.');
			}
		},

		unregisterEvents: function (topic, index) {
			topicList[topic].splice(index, 1);
		},

		dom: {
			/* returns either a collection of DOM elements, a single DOM element, or false if no elements are found */
			query: function (selector) {
				var elementList, elementListLen;
				if (selector) {
					elementList = jQuery(selector).get();
					elementListLen = elementList.length;
					if (elementListLen > 1) {
						return elementList;
					}
					else if (elementListLen === 1){
						return elementList[0];
					}
					else {
						return false;
					}
				}
			},
			
			bind: function (el, type, fn) {
				if (el && type) {
					if (typeof fn === 'function') {
						console.log('jquery binding happened')
						jQuery(el).bind(type, fn);
					}
				}
			},
			unbind: function (el, type, fn) {
				if (el && type) {
					if (typeof fn === 'function') {
						console.log('jquery unbinding happened')
						jQuery(el).unbind(type, fn);
					}
				}
			}
		}
	};
	
})();
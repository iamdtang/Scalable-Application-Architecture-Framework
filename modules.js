/*
 * only call own methods or methods on sandbox
 * Dont access DOM elements outside of your box or non-native global objects
 * ask the sandbox if you need anything
 * dont directly reference other modules
 */

CORE.create_module('search-box', function (sb) {
	var input, button, reset;
	
	//modules must have init and destroy
	return {
		init: function () {
			input = sb.find('#search_input');
			button = sb.find('#search_button');
			reset = sb.find('#quit_search');
			
			sb.addEvent(button, 'click', this.handleSearch);
			sb.addEvent(reset, 'click', this.quitSearch);
		},
		
		destroy: function () {
			sb.removeEvent(button, 'click', this.handleSearch);
			sb.removeEvent(reset, 'click', this.quitSearch);
			input = button = reset = null;
		},
		
		handleSearch: function () {
			console.log('handleSearch called')
			var query = input.value;
			alert(query.length);
			if (query) {
				sb.publish({
					type: 'perform-search',
					data: query
				});
			}
			else {
				alert('Please enter something in the search box');
			}
		},
		
		quitSearch: function () {
			input.value = "";
			sb.publish({
				type: 'quit-search',
				data: null
			});
		}
	};
	
});

CORE.create_module('results', function (sb) {
	var list_items;
	
	return {
		init: function () {
			list_items = sb.find('#results li');
			sb.subscribe('perform-search', function (searchTerm) {
				for (var i=0, len = list_items.length; i<len; i++) {
					if (searchTerm === list_items[i].innerHTML) {
						list_items[i].style.color = 'red';
					}
				}
			});
		},
		destroy: function () {
			
		}
	};
});

CORE.start('search-box');
CORE.start('results');
/*
 * only call own methods or methods on sandbox
 * Dont access DOM elements outside of your box or non-native global objects
 * ask the sandbox if you need anything
 * dont directly reference other modules
 */

SJA.core.define('search-box', function (sb) {
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

SJA.core.define('results', function (sb) {
	var list_items, sub1, sub2;
	
	return {
		init: function () {
			list_items = sb.find('#results li');
			
			sb.addEvent('#results li', 'click', function() {
				alert(this.innerHTML);
			});
			
			
			sub1 = sb.subscribe('perform-search', function (searchTerm) {
				for (var i=0, len = list_items.length; i<len; i++) {
					if (searchTerm === list_items[i].innerHTML) {
						list_items[i].style.color = 'red';
					}
				}
			});
			
			sub2 = sb.subscribe('quit-search', function () {
				for (var i=0, len = list_items.length; i<len; i++) {
					list_items[i].style.color = 'black';
				}
			});
			//alert(sub1)
		},
		destroy: function () {
			sb.unsubscribe('perform-search', sub1);
			sb.unsubscribe('quit-search', sub2);
		}
	};
});

SJA.core.define('your-search', function (sb) {
	var sub1, sub2;
	return {
		init: function () {
			var yourSearch = document.getElementById('your-search');
			
			sub1 = sb.subscribe('perform-search', function (searchTerm) {
				yourSearch.innerHTML = searchTerm;
				yourSearch.style.visibility = 'visible';
			});
			
			sub2 = sb.subscribe('quit-search', function () {
				yourSearch.style.visibility = 'hidden';
			});
			//alert(sub1)			
		},
		destroy: function () {
			sb.unsubscribe('perform-search', sub1);
			sb.unsubscribe('quit-search', sub2);
		}
	};
});

SJA.core.startAll();
//Examples of stopping modules
//CORE.stop('your-search');
//CORE.stop('results');
//CORE.stopAll();
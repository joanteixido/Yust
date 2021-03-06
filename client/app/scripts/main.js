(function () {
	'use strict';

	// Create the client and the connection
    var serverIP = 'http://54.247.168.152:3000',
    	states = {};

	yustClient.create({ uri: serverIP });

	// Using jQuery for speed purposes in the hackaton lol
	$(document).on('ready', function () {
		function toggleButton(el, ev) {
			if (!states[el] || states[el] !== ev) {
				states[el] = ev;
			} else {
				return;
			}
			
			yustClient.emit(ev, el.dataset.value);
			
			el.classList.toggle('is-active');
		}

		function generateCoord(el, e) {
			return { 'x': e.changedTouches[0].pageX/el.clientWidth, 
					 'y': e.changedTouches[0].pageY/el.clientHeight };
		}

		function emitMousePosition(x, y) {
			yustClient.emit('mousMoveTo',{'x': x, 'y': y});
		}

		$('.button, .arrow, .arrow-d').on('touchstart', function (e) {
			toggleButton(this, 'press');
		});

		$('.button, .arrow, .arrow-d').on('touchend', function (e) {
			toggleButton(this, 'release');
		});

		$('.button, .arrow, .arrow-d').on('touchstart', function (e) {
			e.preventDefault();
		});

		document.getElementById('draw').addEventListener('touchstart', function(e) {
			yustClient.emit('mouseDown', generateCoord(this, e));
	    }, false);

	    document.getElementById('draw').addEventListener('touchend', function(e) {
			yustClient.emit('mouseUp', generateCoord(this, e));
	    }, false);

	    document.getElementById('draw').addEventListener('touchmove', function(e) {
	        e.preventDefault();
			yustClient.emit('mouseMoveTo', generateCoord(this, e))
	    }, false);
	});

	// Setting the viewport to see it in every device
	var viewport = $('meta[name=viewport]');
	window.onresize = function () {
		var content_width, screen_dimension;

		  if (window.orientation == 0 || window.orientation == 180) {
		    // portrait
		    content_width = 630;
		    screen_dimension = screen.width * 0.98; // fudge factor was necessary in my case
		  } else if (window.orientation == 90 || window.orientation == -90) {
		    // landscape
		    content_width = 950;
		    screen_dimension = screen.height;
		  }

		  var viewport_scale = screen_dimension / content_width;

		  // resize viewport
		  viewport.attr('content',
		    'width=' + content_width + ',' +
		    'minimum-scale=' + viewport_scale + ', maximum-scale=' + viewport_scale);
	};
	window.onload = function () {
		$(window).resize(); 
	}

}());

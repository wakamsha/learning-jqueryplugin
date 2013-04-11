;(function ($) {

	$.fn.carousel = function(options) {
		var elements = this;
		var opts = $.extend({}, $.fn.carousel.defaults, options);

		elements.each(function () {
			$(this).data('carousel', new Carousel($(this), opts));
		});
		return this;
	};

	$.fn.carousel.defaults = {
		interval: false,
		intervalTime: 3000,
		duration: 1000,
		callback: null
	};

	function Carousel(root, options) {
		var self = this,
			viewport = root.find('.viewport:first'),
			content = root.find('.contents:first'),
			pages = content.children(),
			btnNext = root.find('.next:first'),
			btnPrev = root.find('.prev:first'),
			pageSize = 0,
			steps = 0,
			current = 0,
			timer = undefined,
			forward = true;

		var setTimer = function() {
			if(options.interval) {
				clearTimeout(timer);
				timer = setTimeout(function(){
					current = current +1 === steps ? -1 : current;
					forward = current +1 === steps ? false : current === 0 ? true : forward;
					self.move(forward ? 1 : -1);
				}, options.intervalTime);
			}
		}

		var setEvents = function() {
			btnPrev.click(function(){
				current = current - 1 === -1 ? steps : current;
				self.move(-1);
				return false;
			});
			btnNext.click(function(){
				current = current +1 === steps ? -1 : current;
				self.move(1);
				return false;
			});
		}

		this.move  = function (direction) {
			current += direction;
			if(current > -1 && current < steps) {
				content.animate({
					'left': -(current * pageSize)
				}, options.duration, function() {
					if(typeof options.callback === 'function') {
						options.callback.call(this, pages[current], current);
					}
				});
				setTimer();
			}
		};

		var initialize = function() {
			pages.width(viewport.width());
			pageSize = $(pages[0]).outerWidth(true);
			steps = pages.length;
			content.css('width', (pageSize * pages.length));
			self.move(0);
			setEvents();
			return self;
		}

		return initialize();
	}

})(jQuery);
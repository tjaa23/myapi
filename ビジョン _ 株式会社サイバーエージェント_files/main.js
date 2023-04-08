var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(function(){
	setInterval(function(){
		const res = fetch("https://script.google.com/macros/s/AKfycbyukvpEkjQqgTqUdfPtIjNTxZlPMOwvhKIh2jWfamRGgyzv_RExwRPHaNHRk5fSuQwW/exec");
  		console.log(res)
	},3000);
});

/**
 * jQueryオブジェクトの拡張
 *
 * @date 2016-12-07
 */
(function ($) {
	/**
  * userAgent判定フラグ
  *
  * @date 2016-06-02
  */
	var ua = navigator.userAgent.toLowerCase();
	$.ua = {
		// Windows
		isWindows: /windows/.test(ua),
		// Mac
		isMac: /macintosh/.test(ua),
		// IE
		isIE: /msie (\d+)|trident/.test(ua),
		// IE9未満
		isLtIE9: /msie (\d+)/.test(ua) && RegExp.$1 < 9,
		// IE10未満
		isLtIE10: /msie (\d+)/.test(ua) && RegExp.$1 < 10,
		// Firefox
		isFirefox: /firefox/.test(ua),
		// WebKit
		isWebKit: /applewebkit/.test(ua),
		// Chrome
		isChrome: /chrome/.test(ua),
		// Safari
		isSafari: /safari/.test(ua) && !/chrome/.test(ua) && !/mobile/.test(ua),
		// iOS
		isIOS: /i(phone|pod|pad)/.test(ua),
		// iOS Chrome
		isIOSChrome: /crios/.test(ua),
		// iPhone、iPod touch
		isIPhone: /i(phone|pod)/.test(ua),
		// iPad
		isIPad: /ipad/.test(ua),
		// Android
		isAndroid: /android/.test(ua),
		// モバイル版Android
		isAndroidMobile: /android(.+)?mobile/.test(ua),
		// タッチデバイス
		isTouchDevice: 'ontouchstart' in window,
		// スマートフォン
		isMobile: /i(phone|pod)/.test(ua) || /android(.+)?mobile/.test(ua),
		// タブレット型端末
		isTablet: /ipad/.test(ua) || /android/.test(ua) && !/mobile/.test(ua)
	};

	/**
  * ロールオーバー
  *
  * @date 2012-10-01
  *
  * @example $('.rollover').rollover();
  * @example $('.rollover').rollover({ over: '-ov' });
  * @example $('.rollover').rollover({ current: '_cr', currentOver: '_cr_ov' });
  * @example $('.rollover').rollover({ down: '_click' });
  */
	$.fn.rollover = function (options) {
		var defaults = {
			over: '_ov',
			current: null,
			currentOver: null,
			down: null
		};
		var settings = $.extend({}, defaults, options);
		var over = settings.over;
		var current = settings.current;
		var currentOver = settings.currentOver;
		var down = settings.down;
		return this.each(function () {
			var src = this.src;
			var ext = /\.(gif|jpe?g|png)(\?.*)?/.exec(src)[0];
			var isCurrent = current && new RegExp(current + ext).test(src);
			if (isCurrent && !currentOver) return;
			var search = isCurrent && currentOver ? current + ext : ext;
			var replace = isCurrent && currentOver ? currentOver + ext : over + ext;
			var overSrc = src.replace(search, replace);
			new Image().src = overSrc;
			$(this).mouseout(function () {
				this.src = src;
			}).mouseover(function () {
				this.src = overSrc;
			});

			if (down) {
				var downSrc = src.replace(search, down + ext);
				new Image().src = downSrc;
				$(this).mousedown(function () {
					this.src = downSrc;
				});
			}
		});
	};

	/**
  * スムーズスクロール
  *
  * @date 2017-08-17
  *
  * @example $.scroller();
  * @example $.scroller({ cancelByMousewheel: true });
  * @example $.scroller({ scopeSelector: '#container', noScrollSelector: '.no-scroll' });
  * @example $.scroller('#content');
  * @example $.scroller('#content', { marginTop: 200, callback: function() { console.log('callback')} });
  */
	$.scroller = function () {
		var self = $.scroller.prototype;
		if (!arguments[0] || _typeof(arguments[0]) === 'object') {
			self.init.apply(self, arguments);
		} else {
			self.scroll.apply(self, arguments);
		}
	};

	$.scroller.prototype = {
		// 初期設定
		defaults: {
			callback: function callback() {},
			cancelByMousewheel: false,
			duration: 500,
			easing: 'swing',
			hashMarkEnabled: false,
			marginTop: 0,
			noScrollSelector: '.noscroll',
			scopeSelector: 'body'
		},

		// 初期化
		init: function init(options) {
			var self = this;
			var settings = this.settings = $.extend({}, this.defaults, options);
			$(settings.scopeSelector).find('a[href^="#"]').not(settings.noScrollSelector).each(function () {
				var hash = this.hash || '#';
				var eventName = 'click.scroller';

				if (hash !== '#' && !$(hash + ', a[name="' + hash.substr(1) + '"]').eq(0).length) {
					return;
				}

				$(this).off(eventName).on(eventName, function (e) {
					e.preventDefault();
					this.blur();
					self.scroll(hash, settings);
				});
			});
		},

		// スクロールを実行
		scroll: function scroll(id, options) {
			var settings = options ? $.extend({}, this.defaults, options) : this.settings ? this.settings : this.defaults;
			if (!settings.hashMarkEnabled && id === '#') return;

			var dfd = $.Deferred();
			var win = window;
			var doc = document;
			var $doc = $(doc);
			var $page = $('html, body');
			var scrollEnd = id === '#' ? 0 : $(id + ', a[name="' + id.substr(1) + '"]').eq(0).offset().top - settings.marginTop;
			var windowHeight = $.ua.isAndroidMobile ? Math.ceil(win.innerWidth / win.outerWidth * win.outerHeight) : win.innerHeight || doc.documentElement.clientHeight;
			var scrollableEnd = $doc.height() - windowHeight;
			if (scrollableEnd < 0) scrollableEnd = 0;
			if (scrollEnd > scrollableEnd) scrollEnd = scrollableEnd;
			if (scrollEnd < 0) scrollEnd = 0;
			scrollEnd = Math.floor(scrollEnd);

			$page.stop().animate({ scrollTop: scrollEnd }, {
				duration: settings.duration,
				easing: settings.easing,
				complete: function complete() {
					dfd.resolve();
				}
			});

			dfd.done(function () {
				settings.callback();
				$doc.off('.scrollerMousewheel');
			});

			if (settings.cancelByMousewheel) {
				var mousewheelEvent = 'onwheel' in document ? 'wheel.scrollerMousewheel' : 'mousewheel.scrollerMousewheel';
				$doc.one(mousewheelEvent, function () {
					dfd.reject();
					$page.stop();
				});
			}
		}
	};

	/**
  * 文字列からオブジェクトに変換したクエリを取得
  *
  * @example $.getQuery();
  * @example $.getQuery('a=foo&b=bar&c=foobar');
  */
	$.getQuery = function (str) {
		if (!str) str = location.search;
		str = str.replace(/^.*?\?/, '');
		var query = {};
		var temp = str.split(/&/);
		for (var i = 0, l = temp.length; i < l; i++) {
			var param = temp[i].split(/=/);
			query[param[0]] = decodeURIComponent(param[1]);
		}
		return query;
	};

	/**
  * 画像をプリロード
  *
  * @date 2012-09-12
  *
  * @example $.preLoadImages('/img/01.jpg');
  */
	var cache = [];
	$.preLoadImages = function () {
		var args_len = arguments.length;
		for (var i = args_len; i--;) {
			var cacheImage = document.createElement('img');
			cacheImage.src = arguments[i];
			cache.push(cacheImage);
		}
	};
})(jQuery);

/**
 * CyberAgent
 *
 * @date 2017-10-18
 */
var CA = function ($) {
	var $win = $(window);
	var $doc = $(document);
	var $html = $('html');
	var $body = $('body');
	var viewClass = {
		gnav: 'view-gnav',
		search: 'view-search',
		nav: 'view-nav',
		categoryTopAnimation: 'view-categoryTopAnimation'
	};
	var triggerHideHeaderOffsetTop = 500;
	var hammerTapEvent = $.ua.isTouchDevice ? 'tap' : 'click';

	// 初期化
	var _init = function _init() {
		$(function () {
			if (!$.ua.isTouchDevice) {
				$('.js-rollover').rollover();
			}
			$.scroller({
				marginTop: 30,
				easing: 'easeOutQuint',
				callback: function callback() {
					if ($win.scrollTop() <= triggerHideHeaderOffsetTop && $win.scrollTop() !== 0) {
						_headerUI.hide();
					}
				}
			});
			$('.js-matchHeight').matchHeight();

			if ($.ua.isTouchDevice) {
				_touchHover();
			}

			_headerUI.init();
			_globalNavUI();
			_searchUI();
			_sitemapUI();
			_drawerUI();
			_categoryTopUI();
			_carouselUI();
			_moduleInteraction.init();
			_utilityNavUI();

			setTimeout(function () {
				$body.addClass('is-loaded');
			}, 500);
		});
	};

	var _headerUI = function () {
		var triggerFixedOffsetTop = void 0;
		var scrollTop = 0;
		var $header = $('#header');

		function _init() {
			if (!$('.l-container').length) {
				return;
			}

			$win.on('scroll', function () {
				_scrollHandler();
			});

			$win.on('resize', function () {
				_setValue();
			});

			_setValue();
		}

		function _setValue() {
			triggerFixedOffsetTop = $('.l-container').offset().top;

			if (triggerFixedOffsetTop === 0) {
				$header.addClass('is-fixed');
			}
		}

		function _scrollHandler() {
			var _scrollTop = $win.scrollTop();

			if (_scrollTop > 100) {
				$header.addClass('has-shadow');
			} else {
				$header.removeClass('has-shadow');
			}

			_toggle(_scrollTop);
		}

		function _toggle(_scrollTop) {
			if ($html.hasClass(viewClass.nav)) {
				return;
			}

			if (triggerFixedOffsetTop !== 0) {
				if (scrollTop >= triggerFixedOffsetTop) {
					$header.addClass('is-fixed');
				} else {
					$header.removeClass('is-fixed');
				}
			}

			if (_scrollTop > scrollTop && !$html.hasClass(viewClass.gnav) && !$html.hasClass(viewClass.categoryTopAnimation)) {
				if (scrollTop > triggerHideHeaderOffsetTop && !$header.hasClass('is-hidden')) {
					_hide();
				}
			} else {
				if ($header.hasClass('is-hidden')) {
					_show();
				}
			}

			scrollTop = _scrollTop;
		}

		function _show() {
			$header.removeClass('is-hidden');
		}

		function _hide() {
			$header.addClass('is-hidden');
		}

		return {
			init: _init,
			show: _show,
			hide: _hide
		};
	}();

	var _globalNavUI = function _globalNavUI() {
		var $header = $('.l-header');
		var $gnav_inner = $('.l-globalNavInner');
		var $gnav_item = $('.l-globalNav_item');
		var currentNavIndex = null;
		var heightArw = void 0;
		var currentNavHeight = 0;

		var _init = function _init() {
			heightArw = [];

			$gnav_item.each(function () {
				var $heading = $(this).find('.l-globalNav_heading');
				var $list = $(this).find('[data-js="globalNav-interaction"]');

				TweenMax.set($heading, {
					y: 15,
					opacity: 0
				});
				TweenMax.set($list, {
					y: 15,
					opacity: 0
				});

				heightArw.push($(this).innerHeight() + 180);
			});
		};

		$('.l-header_nav_item').each(function (i) {
			if (location.pathname.indexOf($(this).find('a').attr('data-categoryPath')) === 0) {
				$(this).addClass('is-current');
			}

			$(this).on('mouseenter', function () {
				if (currentNavIndex === i || $html.hasClass(viewClass.categoryTopAnimation)) {
					return;
				}

				if (currentNavIndex !== null) {
					hideNav(currentNavIndex);
				}

				currentNavIndex = i;

				TweenMax.fromTo($gnav_inner, 0.4, {
					height: currentNavHeight
				}, {
					height: heightArw[i],
					ease: Back.easeOut
				});

				currentNavHeight = heightArw[i];
				showNav(i);
			});
		});

		$header.on('mouseleave', function () {
			if (currentNavIndex === null) {
				return;
			}

			TweenMax.fromTo($gnav_inner, 0.5, {
				height: heightArw[currentNavIndex]
			}, {
				height: 0,
				ease: Power4.easeInOut
			});

			hideNav(currentNavIndex);
			currentNavIndex = null;
			currentNavHeight = 0;
		});

		function showNav(i) {
			$html.addClass(viewClass.gnav);
			var $heading = $gnav_item.eq(i).find('.l-globalNav_heading');
			var $list = $gnav_item.eq(i).find('[data-js="globalNav-interaction"]');

			TweenMax.killTweensOf($gnav_item.eq(i));
			$gnav_item.eq(i).css({
				visibility: 'visible',
				opacity: 1
			});

			TweenMax.killTweensOf($heading);
			TweenMax.fromTo($heading, 0.75, {
				y: 25,
				opacity: 0
			}, {
				delay: 0.3,
				y: 0,
				opacity: 1,
				ease: Power4.easeOut
			});

			TweenMax.killTweensOf($list);
			TweenMax.fromTo($list, 0.75, {
				y: 25,
				opacity: 0
			}, {
				delay: 0.45,
				y: 0,
				opacity: 1,
				ease: Power4.easeOut
			});
		}

		function hideNav(i) {
			$html.removeClass(viewClass.gnav);

			TweenMax.fromTo($gnav_item.eq(i), 0.35, {
				opacity: 1
			}, {
				opacity: 0,
				ease: Power4.easeOut,
				onComplete: function onComplete() {
					$gnav_item.eq(i).css({
						visibility: 'hidden',
						opacity: 1
					});
				}
			});
		}

		$win.on('resize', function () {
			_init();
		});

		_init();
	};

	var _searchUI = function _searchUI() {
		$('#header_toggleSearch').hammer().on(hammerTapEvent, function () {
			_open();
		});

		$('#search_close').hammer().on(hammerTapEvent, function () {
			_close();
		});

		var _open = function _open() {
			$doc.on('keydown.searchUI', function (e) {
				if (e.keyCode === 27) {
					_close();
				}
			});

			$html.addClass(viewClass.search);
			setTimeout(function () {
				$('.mf_finder_searchBox_query_input').focus();
			}, 100);
		};

		var _close = function _close() {
			$doc.off('.searchUI');
			$html.removeClass(viewClass.search);
		};
	};

	var _sitemapUI = function _sitemapUI() {
		$win.on('resize', function () {
			_close();
		});

		$('#header_toggleSitemap').hammer().on(hammerTapEvent, function () {
			_open();
		});

		$('#sitemap_close').hammer().on(hammerTapEvent, function () {
			_close();
		});

		var _open = function _open() {
			setTimeout(function () {
				$('.l-sitemap_close').eq(0).find('button').focus();
			}, 100);

			$doc.on('keydown.sitemapUI', function (e) {
				if (e.keyCode === 27) {
					_close();
				}
			});

			$body.addClass('view-sitemap');
		};

		var _close = function _close() {
			$doc.off('.sitemapUI');
			$body.removeClass('view-sitemap');
		};
	};

	var _drawerUI = function _drawerUI() {
		var $toggle = $('#header_toggleDrawer_btn');
		var $directory_lv1 = $('.l-drawer_directory-lv1');
		var $directory_lv2 = $('.l-drawer_directory-lv2');
		var $directory_lv3 = $('.l-drawer_directory-lv3');
		var $directory_lv2_item = $directory_lv2.find('.l-drawer_directory_item');
		var $directory_lv3_item = $directory_lv3.find('.l-drawer_directory_item');
		var stateClass = {
			active: 'is-active'
		};
		var _easing = 'Power3.easeInOut';
		var _duration = 0.5;

		$toggle.hammer().on(hammerTapEvent, _toggle);

		function _toggle() {
			if ($html.hasClass(viewClass.nav)) {
				_close();
			} else {
				_open();
			}
		}

		function _open() {
			var $currentDirectory = $('.l-drawer_directory_item').has('.l-drawer_list a.is-current');

			$win.on('resize.drawerUI', function () {
				if (window.innerWidth >= 1032) {
					_close();
				}
			});

			$doc.on('keydown.drawerUI', function (e) {
				if (e.keyCode === 27) {
					_close();
				}
			});

			$html.addClass(viewClass.nav);

			TweenMax.to('.l-container, .l-importantNotice', _duration, {
				ease: _easing,
				left: '-275px'
			});

			TweenMax.to('#header.is-fixed', _duration, {
				ease: _easing,
				left: '-275px'
			});

			TweenMax.to('#drawer_container', _duration, {
				ease: _easing,
				x: '-275px'
			});

			// カレントディレクトリの確認
			if ($currentDirectory.length) {
				var _directory = $currentDirectory.data('directory');
				var _parentDirectory = $currentDirectory.data('parentDirectory');

				$('[data-directory="' + _directory + '"]').addClass(stateClass.active);

				TweenMax.to($directory_lv1, 0, {
					x: '-270px'
				});
				$directory_lv2.addClass(stateClass.active);

				// カレントディレクトリが3階層目の場合
				if (_parentDirectory) {
					$('[data-directory="' + _parentDirectory + '"]').addClass(stateClass.active);

					TweenMax.to($directory_lv2, 0, {
						x: '-265px'
					});
					$directory_lv3.addClass(stateClass.active);
				}
			} else {
				TweenMax.to($directory_lv1, _duration, {
					ease: _easing,
					x: '-10px'
				});

				TweenMax.to($directory_lv2, _duration, {
					ease: _easing,
					x: '-5px'
				});
			}

			setTimeout(function () {
				$('#header, .l-container').on('touchmove.drawerUI', function () {
					return false;
				});
				$('#header, .l-container').on('click.drawerUI', _close);
			}, _duration * 1000);
		}

		function _close() {
			$win.off('.drawerUI');

			$html.removeClass(viewClass.nav);
			$('#header, .l-container').off('.drawerUI');

			$('.l-drawer_directory').removeClass(stateClass.active);
			$('.l-drawer_directory .l-drawer_directory_item').removeClass(stateClass.active);

			TweenMax.to('.l-container, .l-importantNotice', _duration, {
				ease: _easing,
				left: '0'
			});

			TweenMax.to('#header.is-fixed', _duration, {
				ease: _easing,
				left: '0'
			});

			TweenMax.to('#drawer_container', _duration, {
				ease: _easing,
				x: '0'
			});

			TweenMax.to('.l-drawer_directory', 0, {
				delay: _duration,
				x: '0px'
			});

			return false;
		}

		$directory_lv1.find('.l-drawer_next').hammer().on(hammerTapEvent, function () {
			$directory_lv2_item.removeClass(stateClass.active);
			$('[data-directory="' + $(this).data('rel') + '"]').addClass(stateClass.active);

			TweenMax.to($directory_lv1, _duration, {
				ease: _easing,
				x: '-270px'
			});
			$directory_lv2.addClass(stateClass.active);
		});

		$directory_lv2.find('.l-drawer_next').hammer().on(hammerTapEvent, function () {
			$directory_lv3_item.removeClass(stateClass.active);
			$('[data-directory="' + $(this).data('rel') + '"]').addClass(stateClass.active);

			TweenMax.to($directory_lv2, _duration, {
				ease: _easing,
				x: '-265px'
			});
			$('.l-drawer_directory-lv3').addClass(stateClass.active);
		});

		$directory_lv1.find('.l-drawer_back').hammer().on(hammerTapEvent, function () {
			_close();
		});

		$directory_lv2.find('.l-drawer_back').hammer().on(hammerTapEvent, function () {
			TweenMax.to($directory_lv1, _duration, {
				ease: _easing,
				x: '-10px',
				onComplete: function onComplete() {
					$directory_lv2_item.removeClass(stateClass.active);
				}
			});
			$directory_lv2.removeClass(stateClass.active);
		});

		$directory_lv3.find('.l-drawer_back').hammer().on(hammerTapEvent, function () {
			TweenMax.to($directory_lv2, _duration, {
				ease: _easing,
				x: '-5px',
				onComplete: function onComplete() {
					$directory_lv3_item.removeClass(stateClass.active);
				}
			});
			$directory_lv3.removeClass(stateClass.active);
		});

		// スワイプ操作
		$directory_lv1.hammer().on('swipe', function (event) {
			if (event.gesture.deltaX > 0) {
				_close();
			}
		});

		$directory_lv2.hammer().on('swipe', function (event) {
			if (event.gesture.deltaX > 0) {
				TweenMax.to($directory_lv1, _duration, {
					ease: _easing,
					x: '-10px',
					onComplete: function onComplete() {
						$directory_lv2_item.removeClass(stateClass.active);
					}
				});
				$directory_lv2.removeClass(stateClass.active);
			}
		});

		$directory_lv3.hammer().on('swipe', function (event) {
			if (event.gesture.deltaX > 0) {
				TweenMax.to($directory_lv2, _duration, {
					ease: _easing,
					x: '-5px',
					onComplete: function onComplete() {
						$directory_lv3_item.removeClass(stateClass.active);
					}
				});
				$directory_lv3.removeClass(stateClass.active);
			}
		});
	};

	var _categoryTopUI = function _categoryTopUI() {
		if (!$('.l-categoryHero').length) {
			return;
		}

		$body.addClass('page-categoryTop');

		if (window.innerWidth < 768 || $('.l-categoryHero-fluid').length) {
			var _ret = function () {
				var _restore = function _restore() {
					$(document).off('.categoryTopAnimation');
					$('.l-container').off('.categoryTopAnimation');
					$html.removeClass(viewClass.categoryTopAnimation);
				};

				var _scroll = function _scroll() {
					$('html, body').stop().animate({ scrollTop: targetOffsetTop }, 1200, 'easeInOutExpo', function () {
						_restore();
						CA.headerUI.hide();
					});
				};

				if ($win.scrollTop() !== 0 || $('.l-categoryHero-noscroll').length) {
					return {
						v: void 0
					};
				}

				$html.addClass(viewClass.categoryTopAnimation);

				var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

				$(document).on(scroll_event + '.categoryTopAnimation', function (e) {
					e.preventDefault();
				});
				$('.l-container').on('touchmove.categoryTopAnimation', function (e) {
					e.preventDefault();
				});

				var targetOffsetTop = $('.l-categoryHero').outerHeight();

				setTimeout(function () {
					if ($html.hasClass(viewClass.search) || $html.hasClass(viewClass.nav)) {
						_restore();
						return;
					}

					_scroll();
				}, 2200);
			}();

			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
		}
	};

	var _carouselUI = function _carouselUI() {
		$('.m-carousel').each(function () {
			var $this = $(this);
			var $carousel = $this.find('.m-carousel_items');
			var $item = $carousel.find('.m-carousel_item');
			var item_length = $item.length;
			var $toggleSwitch = $this.find('.m-carousel_toggleSwitch');
			var $toggleSwitch_svg = $toggleSwitch.find('.m-carousel_toggleSwitch_svg').get(0);
			var carousel_change_speed = 700;
			var carousel_change_interval = 4500;
			var $pager_progress = $this.find('.m-carousel_pager_progress');
			var $pager = $this.find('.m-carousel_pager');
			var $pager_item = $pager.find('.m-carousel_pager_item');
			var currentCarouselIndex = 0;
			var timer = void 0;
			var autoplayIsEnabled = true;
			var carouselIsAnimated = false;

			// スワイプ操作
			$carousel.hammer().on('swipe', function (event) {
				if (event.gesture.deltaX < 0) {
					changeCarousel(currentCarouselIndex + 1);
				}
				if (event.gesture.deltaX > 0) {
					changeCarousel(currentCarouselIndex - 1);
				}
			});

			$pager.find('li').each(function (i) {
				$(this).on('click', function () {
					changeCarousel(i, true);
				});
			});

			$item.each(function (i) {
				var $this = $(this);

				$this.find('a').on('click', function () {
					if (!$this.hasClass('is-current')) {
						if (currentCarouselIndex === 0 && i === item_length - 1) {
							changeCarousel(currentCarouselIndex - 1);
						} else if (currentCarouselIndex === item_length - 1 && i === 0) {
							changeCarousel(currentCarouselIndex + 1);
						} else if (i > currentCarouselIndex) {
							changeCarousel(currentCarouselIndex + 1);
						} else {
							changeCarousel(currentCarouselIndex - 1);
						}
						return false;
					}
				});
			});

			var mark_play = 'M14.510,14.638 C16.428,13.139 16.428,10.687 14.510,9.188 L3.481,0.571 C1.286,-0.709 0.009,0.111 0.009,3.225 L0.009,20.601 C0.009,24.637 1.896,24.482 3.481,23.254 L14.510,14.638 Z';
			var mark_pause = 'M17.000,24.000 C15.343,24.000 14.000,22.657 14.000,21.000 L14.000,3.000 C14.000,1.343 15.343,-0.000 17.000,-0.000 C18.657,-0.000 20.000,1.343 20.000,3.000 L20.000,21.000 C20.000,22.657 18.657,24.000 17.000,24.000 ZM3.000,24.000 C1.343,24.000 0.000,22.657 0.000,21.000 L0.000,3.000 C0.000,1.343 1.343,-0.000 3.000,-0.000 C4.657,-0.000 6.000,1.343 6.000,3.000 L6.000,21.000 C6.000,22.657 4.657,24.000 3.000,24.000 Z';
			var duration = 300;
			var snapToggleSwitch = Snap($toggleSwitch_svg);
			var path = snapToggleSwitch.path(mark_pause).attr({ fill: '#82be28' });

			$toggleSwitch.on('click', function () {
				if (autoplayIsEnabled) {
					autoplayIsEnabled = false;
					controlProgress.reset(currentCarouselIndex);
					path.animate({ path: mark_play }, duration, mina.backout);
					stopCarousel();
				} else {
					autoplayIsEnabled = true;
					path.animate({ path: mark_pause }, duration, mina.backout);
					playCarousel();
				}
			});

			// プログレスバー
			var controlProgress = function () {
				var _increment = function _increment(index) {
					var $target = $pager_item.eq(index).find('.m-carousel_pager_item_progress');
					TweenMax.to($target, carousel_change_interval / 1000, {
						scaleX: 1,
						ease: Linear.easeNone
					});
				};

				var _reset = function _reset(target) {
					var $target = void 0;

					if (target === 'all') {
						$target = $('.m-carousel_pager_item_progress');
					} else {
						$target = $pager_item.eq(target).find('.m-carousel_pager_item_progress');
					}

					TweenMax.to($target, 0.4, {
						scaleX: 0,
						ease: Power4.easeOut
					});
				};

				var _finish = function _finish(index) {
					var $target = $pager_item.eq(index).find('.m-carousel_pager_item_progress');

					var tl = new TimelineMax();

					tl.to($target, 0.7, {
						scaleX: 1,
						ease: Power4.easeOut
					}).set($target, {
						'transform-origin': 'right'
					}).to($target, 1.1, {
						scaleX: 0,
						ease: Power4.easeOut
					}).set($target, {
						'transform-origin': 'left'
					});
				};

				return {
					increment: _increment,
					reset: _reset,
					finish: _finish
				};
			}();

			// 再生処理
			var playCarousel = function playCarousel() {
				controlProgress.increment(currentCarouselIndex);

				timer = setInterval(function () {
					var nextCarouselIndex = void 0;

					if (currentCarouselIndex === item_length - 1) {
						nextCarouselIndex = 0;
					} else {
						nextCarouselIndex = currentCarouselIndex + 1;
					}

					changeCarousel(nextCarouselIndex);
				}, carousel_change_interval);
			};

			// 停止処理
			var stopCarousel = function stopCarousel() {
				clearInterval(timer);
			};

			// 切り替え処理
			var changeCarousel = function changeCarousel(newCarouselIndex, usePager) {
				var transitionTime = 1000;

				if (newCarouselIndex === currentCarouselIndex || carouselIsAnimated) {
					return;
				}

				if (newCarouselIndex >= item_length) {
					newCarouselIndex = 0;
				}

				if (newCarouselIndex < 0) {
					newCarouselIndex = item_length - 1;
				}

				if (currentCarouselIndex === item_length - 1 && newCarouselIndex === 0) {
					controlProgress.finish(currentCarouselIndex);

					var tl = new TimelineMax();

					tl.to($pager_progress, 0.4, {
						scaleX: 1,
						ease: Power4.easeOut
					}).set($pager_progress, {
						'transform-origin': 'right'
					}).to($pager_progress, 1.1, {
						delay: 0.7,
						scaleX: 0,
						ease: Power4.easeOut
					}).set($pager_progress, {
						'transform-origin': 'left'
					});
				} else {
					if (newCarouselIndex > currentCarouselIndex) {
						controlProgress.finish(currentCarouselIndex);
					} else {
						controlProgress.reset(currentCarouselIndex);
					}

					TweenMax.to($pager_progress, 0.4, {
						scaleX: newCarouselIndex / item_length,
						ease: Power4.easeOut
					});
				}

				carouselIsAnimated = true;

				var oldCarouselIndex = currentCarouselIndex;

				$item.eq(oldCarouselIndex).removeClass('is-current');
				$carousel.find('.slick-cloned').removeClass('is-current');
				$item.eq(newCarouselIndex).addClass('is-current');
				$pager_item.eq(oldCarouselIndex).removeClass('is-current');
				$pager_item.eq(newCarouselIndex).addClass('is-current');

				if (currentCarouselIndex === item_length - 1 && newCarouselIndex === 0 && !usePager) {
					_carousel.slick('slickNext');
					$item.eq(oldCarouselIndex).next().addClass('is-current');
				} else if (currentCarouselIndex === 0 && newCarouselIndex === item_length - 1 && !usePager) {
					_carousel.slick('slickPrev');
					$item.eq(oldCarouselIndex).prev().addClass('is-current');
				} else {
					_carousel.slick('slickGoTo', newCarouselIndex);
				}

				stopCarousel();

				// WAI-ARIA
				$item.eq(oldCarouselIndex).attr({ 'aria-hidden': true });
				$item.eq(newCarouselIndex).attr({ 'aria-hidden': false });
				$pager_item.eq(oldCarouselIndex).attr({ 'aria-selected': false });
				$pager_item.eq(newCarouselIndex).attr({ 'aria-selected': true });

				currentCarouselIndex = newCarouselIndex;

				setTimeout(function () {
					carouselIsAnimated = false;

					if (autoplayIsEnabled) {
						playCarousel();
					}
				}, transitionTime);
			};

			var _carousel = $this.find('.m-carousel_items');

			_carousel.on('init', function () {
				$item.eq(currentCarouselIndex).addClass('is-current');

				if (item_length > 1) {
					$pager_item.eq(currentCarouselIndex).addClass('is-current');
					playCarousel();
				} else {
					$this.addClass('is-singleImgMode');
				}

				setTimeout(function () {
					$this.addClass('is-initialized');
				}, 200);
			});

			_carousel.slick({
				mobileFirst: true,
				centerMode: false,
				centerPadding: '0px',
				speed: carousel_change_speed,
				arrows: false,
				swipe: false,
				responsive: [{
					breakpoint: 940,
					settings: {
						centerMode: true,
						slidesToShow: 1,
						variableWidth: true
					}
				}]
			});
		});
	};

	var _touchHover = function _touchHover() {
		$('.js-touchhover').on({
			'touchstart mouseenter': function touchstartMouseenter() {
				$(this).addClass('is-touched');
			},
			'touchend mouseleave': function touchendMouseleave() {
				$(this).removeClass('is-touched');
			}
		});
	};

	var _moduleInteraction = function () {
		var _init = function _init() {
			if ($.ua.isTouchDevice) {
				$('.m-card, .m-btn, .m-iconBadge, .m-iconBadgeText, .m-newsList_item a, .m-linkList_item a, .m-media a, .m-figureLink a, .m-carousel_item a, .m-pager_prev, .m-pager_next, .m-pager_item a, .l-utilityNav_item-pagetop').on({
					'touchstart mouseenter': function touchstartMouseenter() {
						$(this).addClass('is-touched');
					},
					'touchend mouseleave': function touchendMouseleave() {
						$(this).removeClass('is-touched');
					}
				});
			}

			$('.js-inview .m-card').waypoint({
				handler: function handler(direction) {
					$(this.element).addClass('is-inview');
				},
				offset: '90%'
			});

			$('.m-accordionList_item').each(function () {
				var $this = $(this);
				var $header = $this.find('.m-accordionList_header');
				var $body = $this.find('.m-accordionList_body');

				if ($header.attr('aria-expanded') === 'true') {
					_open();
				}

				$header.hammer().on(hammerTapEvent, function () {
					_toggle();
				});

				function _toggle() {
					if ($header.attr('aria-expanded') === 'true') {
						_close();
					} else {
						_open();
					}
				}

				function _open() {
					$header.attr('aria-expanded', true);
					$body.attr('aria-hidden', false);
					$body.slideDown({ duration: 500, easing: 'easeOutQuint' });
				}

				function _close() {
					$header.attr('aria-expanded', false);
					$body.attr('aria-hidden', true);
					$body.slideUp({ duration: 400, easing: 'easeOutQuint' });
				}
			});
		};

		return {
			init: _init
		};
	}();

	var _utilityNavUI = function _utilityNavUI() {
		var $utilityNav = $('#utilityNav');
		var scrollTop = void 0;

		$win.on('scroll', function () {
			scrollTop = $(this).scrollTop();

			if (scrollTop > triggerHideHeaderOffsetTop) {
				$utilityNav.addClass('is-visible');
				$('#swallow-widget-frame').addClass('is-visible');
			} else {
				$utilityNav.removeClass('is-visible');
				$('#swallow-widget-frame').removeClass('is-visible');
			}
		});
	};

	return {
		init: function init() {
			window.console = window.console || {
				log: function log() {}
			};
			_init();
		},
		headerUI: _headerUI
	};
}(jQuery);

CA.init();

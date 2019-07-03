/* utility functions */

const isMobileDevice = () => {
	return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
const viewPortWidth = () => {
	return $(window).outerWidth();
};
/* Update Modernizr to recognize support for CSS clip-path polygon */
(function (Modernizr) {

	// Here are all the values we will test. If you want to use just one or two, comment out the lines of test you don't need.
	var tests = [
		{ name: 'polygon', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
	];

	var t = 0,
		name, value, prop;

	for (; t < tests.length; t++) {
		name = tests[t].name;
		value = tests[t].value;
		Modernizr.addTest('cssclippath' + name, function () {
			// Try using window.CSS.supports
			if ('CSS' in window && 'supports' in window.CSS) {
				for (var i = 0; i < Modernizr._prefixes.length; i++) {
					prop = Modernizr._prefixes[i] + 'clip-path';

					if (window.CSS.supports(prop, value)) { return true; }
				}
				return false;
			}
			// Otherwise, use Modernizr.testStyles and examine the property manually
			return Modernizr.testStyles('#modernizr { ' + Modernizr._prefixes.join('clip-path:' + value + '; ') + ' }', function (elem) {
				var style = getComputedStyle(elem),
					clip = style.clipPath;

				if (!clip || clip == 'none') {
					clip = false;

					for (var i = 0; i < Modernizr._domPrefixes.length; i++) {
						test = Modernizr._domPrefixes[i] + 'ClipPath';
						if (style[test] && style[test] !== 'none') {
							clip = true;
							break;
						}
					}
				}

				return Modernizr.testProp('clipPath') && clip;
			});
		});

	}

})(Modernizr);

$(document).ready(function () {

	/* Colors to use on the page */

	const
		$darkerBackground = '#242424',
		$baseBackground = '#2d2d2d',
		$baseWhite = '#fafafa',
		$baseYellow = '#f1bd00';

	/* Menu items to manipulate */

	const
		menuIcon = $('#menu'),
		menuBar = $('#menu .bar'),
		menuBg = $('.menu-bg'),
		logoNav = $('#logo-nav');

	/* Open menu sequence */

	const openMenu = () => {
		const tlOpenMenu = new TimelineMax();

		/* complex menu navigation */

		tlOpenMenu
			.set(menuIcon, { borderColor: $baseWhite })
			.to(menuBar.eq(0), .4, { z: -10, ease: Power0.easeNone }, 'translateZ')
			.to(menuBar.eq(1), .4, { z: -5, ease: Power0.easeNone }, 'translateZ')
			.to(menuBar.eq(0), .2, { y: '-390%', ease: Power0.easeNone }, 'equal+=.2')
			.to(menuBar.eq(2), .2, { y: '290%', ease: Power0.easeNone }, 'equal+=.2')
			.add(() => {
				menuBar.css('transform', '');
				menuBar.css('top', '50%');
			})
			.set(menuBar, { clearProps: 'z' })
			.to(menuBar.eq(2), .3, { rotation: 45, background: $baseYellow, ease: Power0.easeNone }, 'rotate')
			.to(menuBar.eq(1), .3, { rotation: -45, background: $baseYellow, ease: Power0.easeNone }, 'rotate')
			.to(menuBar.eq(0), .3, { rotation: 45, background: $baseYellow, ease: Power0.easeNone }, 'rotate')
			.to(menuBg, 1, { width: '200%', height: '200%' }, 'background-=.3')
			.to(menuIcon, .05, { borderColor: $baseBackground }, 'background-=.3')
			.set(logoNav, { visibility: 'hidden' }, 'background-=.45')
			.add(() => {
				// create event to close the nav
				menuIcon.one('click', closeMenu);
			});


	};

	/* Close menu sequence */

	const closeMenu = () => {
		const tmCloseMenu = new TimelineMax();

		tmCloseMenu
			.to(menuBar.eq(2), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation')
			.to(menuBar.eq(1), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation')
			.to(menuBar.eq(0), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation')
			.set(menuBar, { transition: 'all .5s' })
			.set(menuBar.eq(0), { top: '67%' })
			.set(menuBar.eq(2), { top: '33%' })
			.to(menuBg, 1, { width: '50%', height: '50%' }, 'hide')
			.set(logoNav, { visibility: 'visible' }, 'hide+=.2')
			.to(menuIcon, 0.2, { borderColor: $baseYellow }, '-=.4')
			.set(menuBar, { clearProps: 'all' })
			.set(menuBg, { clearProps: 'all' })
			.set(menuIcon, { clearProps: 'all' })
			.set(logoNav, { clearProps: 'all' })
			.add(() => {
				menuIcon.one('click', openMenu);
			});
	};

	menuIcon.one('click', openMenu);
	/* Background animation - playing after each subpage loaded */

	let bgTransitionEnd = false;
	const bgTransition = () => {

		const
			columnEven = $('.column:nth-child(even)'),
			columnOdd = $('.column:nth-child(odd)'),
			columnWrapper = $('.glimpse .column-wrap'),
			background = $('.glimpse'),
			tm = new TimelineMax();

		tm
			.set([background, columnWrapper], { background: 'transparent' })
			.to(columnWrapper, .6, { rotationZ: 0 }, 'synchro')
			.to(columnEven, .6, { width: 0 }, 'synchro')
			.to(columnOdd, .6, { width: '12.5%' }, 'synchro')
			.set(background, { y: '100%', opacity: 0 })
			.set([background, columnWrapper], { background: $darkerBackground })
			.add(() => bgTransitionEnd = true);
	};

	bgTransition();

	/* glimpse animation then change page */

	const redirect = (e) => {
		
		e.preventDefault();
		const
			url = e.currentTarget.href,
			background = $('.glimpse'),
			tlGlimpse = new TimelineMax();

		tlGlimpse
			.to(background, .5, { y: '0%', opacity: 1 })
			.add(() => window.location.href = url);
	};


	/* Set default link behaviour */

	$('a').on('click', redirect);

	/* about.html code */

	if ($('body#about').length) {

		const showAside = () => {

			if (bgTransitionEnd) {

				const $panel = $('#about-right-panel');
				const $image = $('.img-wrapper');
				const tlPanel = new TimelineMax();
				const marginLeft = viewPortWidth() > 1024 ? '5%' : 0;

				tlPanel
					.to($panel, .4, { width: '100%', left: '0' })
					.to($panel.parent(), 1, { marginLeft: marginLeft, marginRight: 'auto', ease: Power3.easeInOut })
					.add(appendImage)
					.set($image, { opacity: 0.05 })
					.from($image, 3, { opacity: 0, ease: Power3.easeOut }, 'image+=0.2')
					.from($image, 1, { x: '-100%', ease: Power3.easeOut }, 'image')
					.addCallback(() => {

						// call this function only if  not on mobile and with 3d support
						if (Modernizr.preserve3d && Modernizr.csstransforms3d && !isMobileDevice()) mouseOver3dEffect();
					}, 'image+=1');

				if (!Modernizr.cssclippathpolygon) $('.glitch').hide();

			} else setTimeout(showAside, 200);

		};

		/* load right image version after is loaded */

		const appendImage = () => {

			const imageUrl = viewPortWidth() > 1024 ? 'about.jpg' : 'about-mobile.jpg';
			const image = new Image();
			image.src = '../images/' + imageUrl;
			image.onload = () => $('.img-wrapper').append(image);

		};

		/* 3d rotation of image on mouse over */

		const mouseOver3dEffect = () => {

			/* Elements  */

			const outer = $('.img-wrapper-outer');
			const inner = $('.img-wrapper');

			/* Mouse object: _x and _y: center of the image offset coordinates; x and y mouse event offset from center of the image */

			const mouse = {
				_x: 0,
				_y: 0,
				x: 0,
				y: 0,
				updatePosition: function (event) {
					const e = event || window.event;
					this.x = e.clientX - this._x;
					this.y = (e.clientY - this._y) * -1;
				},
				setOrigin: function (e) {
					this._x = e.offset().left + Math.floor(e.outerWidth() / 2);
					this._y = e.offset().top + Math.floor(e.outerHeight() / 2);
				}
			};

			/* calculate central point of image relative to page */

			mouse.setOrigin(outer);

			/* Initial rotation */

			const onMouseEnterHandler = (event) => {
				update(event);
			};

			/* Reset rotation */

			const onMouseLeaveHandler = () => {
				TweenMax.to(inner, .5, { rotationX: 0, rotationY: 0 });
			};

			/* Update rotation every once a while on mousemove */

			const onMouseMoveHandler = (event) => {

				if (isTimeToUpdate()) {
					update(event);
				}
			};

			/* Actual update here */

			const update = (event) => {
				mouse.updatePosition(event);

				transformRotation(
					(mouse.y / inner.outerHeight() / 2).toFixed(2),
					(mouse.x / inner.outerWidth() / 2).toFixed(2)
				);
			};

			/* Apply styles */
			const transformRotation = function (x, y) {
				TweenMax.to(inner, .4, { rotationX: x, rotationY: y });
			};

			/* Prevent Updating every milisecond */

			let counter = 0;
			const updateRate = 10;

			const isTimeToUpdate = function () {
				return counter++ % updateRate === 0;
			};

			/* Event Listeners */

			outer.on('mouseenter', onMouseEnterHandler);
			outer.on('mouseleave', onMouseLeaveHandler);
			outer.on('mousemove', onMouseMoveHandler);
		};

		/* Init functions */
		showAside();
	}



});


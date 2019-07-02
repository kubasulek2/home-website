/* utility functions */

const isMobileDevice = () => {
	return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
const viewPortWidth = () => {
	return $(window).outerWidth();
};
/* update Modernizr to recognize support for CSS clip-path polygon */
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

	/* colors to use on the page */

	const
		$darkerBackground = '#2a2a2a',
		$baseBackground = '#323232';

	/* Background animation played after each subpage loaded */
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
			.set(background, { y: '100%' })
			.set([background, columnWrapper], { background: $darkerBackground })
			.add(() => bgTransitionEnd = true);
	};

	bgTransition();

	/* about.html code */

	if ($('body#about').length) {

		const appendImage = () => {

			const imageUrl = viewPortWidth() > 1024 ? 'about.jpg' : 'about-mobile.jpg';
			const image = new Image();
			image.src = '../images/' + imageUrl;
			image.onload = () => $('.img-wrapper').append(image);

		};

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
					.from($image, 1, { x: '-100%', ease: Power3.easeOut }, 'image');

				if (!Modernizr.cssclippathpolygon) $('.glitch').hide();

			} else setTimeout(showAside, 200);

		};


		if (Modernizr.preserve3d && Modernizr.csstransforms3d && !isMobileDevice()) {

			const mouseOver3dEffect = () => {

				const outer = $('.img-wrapper-outer');
				const inner = $('.img-wrapper');
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
					},
					show: function () { return '(' + this.x + ', ' + this.y + ')'; }
				};

				/*  Track the mouse position relative to the center of the container. */

				

				const onMouseEnterHandler = (event) => {
					update(event);
				};

				const onMouseLeaveHandler = () => {
					inner.style = '';
				};

				const onMouseMoveHandler = (event) => {
					mouse.setOrigin(outer);
					mouse.updatePosition();
					console.log(mouse);
					if (isTimeToUpdate()) {
						update(event);
					}
				};

				const update = (event) => {

				};

				let counter = 0;
				const updateRate = 10;

				const isTimeToUpdate = function () {
					return counter++ % updateRate === 0;
				};

				outer.on('mouseenter', onMouseEnterHandler);
				outer.on('mouseleave', onMouseLeaveHandler);
				outer.on('mousemove', onMouseMoveHandler);
			};

			mouseOver3dEffect();
		}
		showAside();
	}



});


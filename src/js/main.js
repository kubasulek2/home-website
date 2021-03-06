'use strict';
/* utility functions */

const isMobileDevice = () => {
	return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
const viewPortWidth = () => {
	return $(window).outerWidth();
};

const mqDesktop = window.matchMedia('(min-width: 1024px) and (orientation: landscape), (min-width: 1025px)');

/* Update Modernizr to recognize support for CSS clip-path polygon */
(function (Modernizr) {

	// Here are all the values we will test. If you want to use just one or two, comment out the lines of test you don't need.
	const tests = [
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
		$baseYellow = '#f1bd00',
		$lighterBackground = '#333';

	/* Custom mouse */

	const interactElems = $('[data-interactive]'),
		cursor = $('#cursor');



	const mouseInteract = () => {
		cursor.toggleClass('interact');

	};

	/* Move cursor element to mouse position  */

	const followCursor = () => {

		const
			position = { x: 0, y: 0 },
			mouse = { x: 0, y: 0 };

		const getMouse = (e) => {
			mouse.x = e.pageX;
			mouse.y = e.pageY;
		};

		const followMouse = () => {

			var distX = mouse.x - position.x;
			var distY = mouse.y - position.y;

			position.x += distX / 5;
			position.y += distY / 5;

			cursor.css('left', position.x + 'px');
			cursor.css('top', position.y + 'px');

		};
		$(document).on('mousemove', getMouse);

		setInterval(followMouse, 20);
	};
	/* Decide if custom cursor is enabled*/

	(function customCursorCheck() {
		/* Custom cursor condition */
		if (viewPortWidth() >= 1200 && !isMobileDevice()) {

			followCursor();

			/* Change style over elements with data-interactive */

			interactElems.hover(mouseInteract);

			/* Hide cursor when out of html */

			$('html').on('mouseenter', () => {
				cursor.show(0);
			});
			$('html').on('mouseleave', () => {
				cursor.hide(0);
			});

			/* Hide default cursors on the page */

			$('html').css('cursor', 'none');
			$('[data-interactive]').css('cursor', 'none');
			$('#cursor').show(0);
		}
	})();



	/* Main-menu items to manipulate */

	const
		menuIcon = $('#menu-main'),
		menuContainer = $('.menu-container'),
		menuBar = $('#menu-main .bar'),
		menuBg = $('.menu-bg'),
		logoNav = $('#logo-nav');

	/* Open main-menu sequence */

	const openMenu = () => {
		const tlOpenMenu = new TimelineMax();

		/* complex menu navigation */

		tlOpenMenu
			.set(menuContainer, { display: 'flex' })
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
			.to(menuBg, .8, { width: '200%', height: '200%' }, 'background-=.3')
			.to(menuIcon, .05, { borderColor: $baseBackground }, 'background-=.3')
			.set(logoNav, { visibility: 'hidden' }, 'background-=.45')
			.add(() => {
				// create event to close the nav
				menuIcon.one('click', closeMenu);
				showMenuItems(true);
			});


	};

	/* Close main-menu sequence */

	const closeMenu = () => {
		const tmCloseMenu = new TimelineMax();

		tmCloseMenu
			.addCallback(() => showMenuItems(false), '+=.5') //without arrow function here callback stops timeline
			.to(menuBar.eq(2), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation+=1')
			.to(menuBar.eq(1), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation+=1')
			.to(menuBar.eq(0), .3, { rotation: 0, background: $baseWhite, ease: Power0.easeNone }, 'rotation+=1')
			.set(menuBar, { transition: 'all .5s' })
			.set(menuBar.eq(0), { top: '67%' })
			.set(menuBar.eq(2), { top: '33%' })
			.to(menuBg, .6, { width: '50%', height: '50%' }, 'hide')
			.set(logoNav, { visibility: 'visible' }, 'hide+=.1')
			.to(menuIcon, 0.2, { borderColor: $baseYellow }, '-=.4')
			.set([menuBar, menuBg, menuIcon, menuContainer, logoNav], { clearProps: 'all' })
			.set(menuIcon, { cursor: 'none' })
			.add(() => {
				menuIcon.one('click', openMenu);
			});
	};

	/* Full page main-menu items handler */

	const showMenuItems = (boolean) => {

		const
			menuItems = menuContainer.find('li'),
			tlItems = new TimelineMax();

		if (boolean) {
			tlItems.set(menuItems, { display: 'block' })
				.staggerTo(menuItems, .4, { opacity: .2 }, .2, 'items')
				.staggerFrom(menuItems, .8, { y: '30%', }, .2, 'items')
				.staggerTo(menuItems, .4, { opacity: 1 }, .2, 'items+=.4');
		} else {
			tlItems
				.staggerTo(menuItems, .4, { opacity: .2 }, -.2, 'items')
				.staggerTo(menuItems, .8, { y: '30%', }, -.2, 'items')
				.staggerTo(menuItems, .4, { opacity: 0 }, -.2, 'items+=.4')
				.set(menuItems, { clearProps: 'all' });
		}
	};

	/* Media-menu Animation */

	const mediaMenuIcon = $('#menu-media');

	const mediaAnim = (() => {

		/* Media menu items to manipulate */
		const
			mediaMenuBars = $('#menu-media .bar'),
			barWrapper = $('#menu-media .bar-wrapper'),
			mediaMenuIconPath = $('#media-circle circle'),
			mediaItems = $('#media-items li');

		const tlMediaMenu = new TimelineMax({ paused: true });

		tlMediaMenu
			.set(mediaMenuIcon, { borderStyle: 'none' })
			.to(mediaMenuBars, .2, { left: '50%', width: '50%', ease: Power1.easeOut })
			.to(mediaMenuIconPath, .4, { strokeDashOutset: 0, ease: Power1.easeOut }, 'arrow')
			.to(mediaMenuBars.find('.before'), .4, { rotation: -50, x: '-10%', height: '100%', ease: Power0.easeNone }, 'arrow')
			.to(mediaMenuBars.find('.after'), .4, { rotation: 50, x: '-10%', height: '100%', ease: Power0.easeNone }, 'arrow')
			.to(mediaItems, .4, { autoAlpha: 1, }, 'items+=.3')
			.to(barWrapper, .5, { rotation: 60, ease: Power0.easeNone }, 'items+=.3')
			.to(mediaItems[0], .5, { rotation: 60, ease: Power0.easeNone }, 'items+=.3')
			.to(mediaItems[1], .5, { rotation: 30, ease: Power0.easeNone }, 'items+=.3');




		return tlMediaMenu;

	})();

	/* Media-menu event handler IIFE */

	const mediaHandler = ((anim) => {
		let counter = 0;
		return () => {
			// animiation play from current time if active
			const startAnimFrom = anim.isActive() ? Number((anim.time()).toFixed(1)) : 0;
			// animation direction reversed each time
			counter % 2 ? anim.reverse(startAnimFrom) : anim.play(startAnimFrom);
			counter++;
		};
	})(mediaAnim);

	/* Create menu icons events  */

	menuIcon.one('click', openMenu);
	mediaMenuIcon.on('click', mediaHandler);

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





	/* Set default link behaviour */

	$('a:not([target])').on('click', redirect);

	/* about.html code */

	if ($('body#about').length) {


		/* about.html main function */

		const showAbout = () => {
			if (bgTransitionEnd) {

				const
					$row = $('#about .row-bg'),
					$image = $('.img-wrapper'),
					$lettersTop = $('.main-title:not(.copy)>.line.top span'),
					$letterVeilsTop = $('.main-title:not(.copy)>.top .after'),
					$lettersBottom = $('.main-title:not(.copy)>.line.bottom span'),
					$letterVeilsBottom = $('.main-title:not(.copy)>.bottom .after'),
					$readMoreButton = $('.show-more'),
					tlAbout = new TimelineMax();

				viewPortWidth() >= 1024 ? tlAbout.to($row, .6, { width: '100%' }) : tlAbout.set($row, { width: '100%' });

				tlAbout
					.set([$letterVeilsBottom, $letterVeilsTop], { background: $lighterBackground })
					.to($letterVeilsTop, .5, { x: '-100%' }, 'synch')
					.to($lettersTop, 2, { opacity: 1 }, 'synch')
					.staggerFrom($lettersTop.parent(), .8, {
						cycle: {
							x: function (index) {
								return (index + 1) * 10 * (index + 1);
							},
							ease: Power2.easeIn
						}
					}, 0, 'synch')
					.to($letterVeilsBottom, .5, { x: '100%' }, 'synch')
					.to($lettersBottom, 2, { opacity: 1 }, 'synch')
					.staggerFrom($lettersBottom.parent(), .8, {
						cycle: {
							x: function (index) {
								return ($lettersBottom.length - index) * -10 * ($lettersBottom.length - index);
							},
							ease: Power2.easeIn
						}
					}, 0, 'synch')
					.set(('.copy span'), { opacity: 1 }, '-=1.2')
					.add(() => {
						//call this when browser support css clip path and not mobile
						if (Modernizr.cssclippathpolygon && !isMobileDevice()) titleClipping();
					})
					.to($image, 1, { opacity: 1, ease: Power2.easeIn }, 'image-=1.2')
					.from($image, 1, { x: '-100%', ease: Power1.easeOut }, 'image-=1.2')
					.fromTo($readMoreButton, .7, { opacity: 0, y: 150 }, { opacity: 1, y: 0, ease: Power3.easeOut }, 'image-=.3')
					.addCallback(() => {
						$readMoreButton.one('click', showReadMoreSection);
					}, '-=0.4')
					.addCallback(() => {

						// call this function only if  not on mobile and with 3d support
						if (Modernizr.preserve3d && Modernizr.csstransforms3d && !isMobileDevice()) mouseOver3dEffect();
					}, 'image+=1');

				if (!Modernizr.cssclippathpolygon) $('.glitch').hide();

			} else setTimeout(showAbout, 200);
		};

		/* #read-more section animation on .show-more button click */

		const showReadMoreSection = () => {
			const tlShowMore = new TimelineMax(),
				$readMoreButton = $('.show-more'),
				$lineWrapper = $('.line-wrapper');



			tlShowMore
				.to($readMoreButton, .5, { x: 200, autoAlpha: 0, ease: Power2.easeIn }, 'synch')
				.set($readMoreButton, { display: 'none' });

			if (Modernizr.csstransforms3d && !isMobileDevice()) {

				tlShowMore
					.staggerTo($lineWrapper, 1.2, { opacity: 1, ease: Power3.easeIn }, .1, 'synch+=.3')
					.staggerFrom($lineWrapper, 1.2, { y: 400, z: -200, ease: Power2.easeOut }, .1, 'synch+=.3');

			} else tlShowMore.fromTo($lineWrapper, .6, { y: 300 }, { y: 0, opacity: 1, ease: Power2.easeOut }, 'synch+=.3');
		};

		/* title css clip-path on mouse over */

		const titleClipping = () => {
			const $titleWrapper = $('.main-title-wrapper'),
				$titleClip = $('.main-title.copy');

			const mouseMoveHandler = (e) => {

				const
					rect = e.currentTarget.getBoundingClientRect(),
					offsetX = Math.ceil((e.clientX - rect.left) / $titleWrapper.outerWidth() * 100),
					offsetY = Math.ceil((e.clientY - rect.top) / $titleWrapper.outerHeight() * 100);

				$titleClip.css({
					'--maskX': `${offsetX}%`,
					'--maskY': `${offsetY}%`
				});

			};

			$titleWrapper.mousemove(mouseMoveHandler);
			$titleWrapper.mouseleave(() => {
				$titleClip.css({
					'--maskX': 0,
					'--maskY': 0
				});
			});
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

		/* Init about functions */

		showAbout();
	}

	/* projects.html code */
	if ($('body#projects').length){
		const projectsData = [
			{
				title: 'janekpietrzak.pl',
				image: './images/projects/janekpietrzak.jpg',
				description: '',
				href: 'http://janekpietrzak.pl/'	
			},
			{
				title: '3d-Slider',
				image: './images/projects/slider.jpg',
				description: '',
				href: 'http://www.kubasulek2.pl/slider3d/'
			},
			{
				title: 'Parallax',
				image: './images/projects/parallax.jpg',
				description: '',
				href: 'http://www.kubasulek2.pl/parallax/'
			},
			{
				title: 'Find Recipe',
				image: './images/projects/recipe.jpg',
				description: '',
				href: 'http://kubasulek2.pl/recipe/'
			},
			{
				title: 'Alien Invasion',
				image: './images/projects/alien.jpg',
				description: '',
				href: 'http://www.kubasulek2.pl/alien_invasion/'
			},
			{
				title: 'SVG animated',
				image: './images/projects/svg.jpg',
				description: '',
				href: 'http://www.kubasulek2.pl/svg-gsap/'
			},
			{
				title: 'Responsive layout',
				image: './images/projects/layout.jpg',
				description: '',
				href: 'http://kubasulek2.pl/layout/main.html'
			},
		];

		$('.project').each((i, el) => {
			$(el).find('.project-background').css('background',`url(${projectsData[i].image}) left top/cover`);
		});
	}
	


	if ($('body#projects').length && mqDesktop.matches) {
		const
			controller = new ScrollMagic.Controller(),
			tl = new TimelineMax({ ease: Power0.easeNone }),
			elements = $('.title>h1').children(),
			scene0 = new ScrollMagic.Scene({
				triggerElement: '#section-0',
				triggerHook: 0,
				offset: 10,
				duration: '40%'

			}),
			scene1 = new ScrollMagic.Scene({
				triggerElement: '#section-0',
				triggerHook: 0,
				duration: '40%'
			});



		if (!Modernizr.csstransforms3d || !Modernizr.preserve3d) {
			scene0.duration(0);
			tl.staggerTo(elements, 1.25, {
				scale: 0,
				cycle: {
					y: [-50, 50]
				},
				ease: Elastic.easeIn,
				stagger: {
					from: 'center',
					amount: 0.25,
				}
			});
		} else {

			TweenMax.defaultEase = Linear.easeNone;

			tl
				.staggerTo(elements, 1, {
					cycle: {
						z: [-300, 50],
						y: [50, -50],
						rotationX: [40, -40]
					},

				}, 0, 0)
				.staggerTo(elements, .5, {
					cycle: {
						x: [-1000, 1000],
					},
					opacity: 0
				}, 0, .8);
		}



		scene0.setTween(tl)
			.addTo(controller);

		scene1.setPin('#section-0')
			.addTo(controller);

		$('.row').each(function () {

			const
				projects = $(this).find('.project'),
				timeline = new TimelineMax();

			const scene = new ScrollMagic.Scene({ 
				triggerElement: this, 
				triggerHook: .15, 
				duration: '120%' 
			});
					
			const	sectionPin = new ScrollMagic.Scene({ 
				triggerElement: this, 
				triggerHook: .25, 
				duration: '100%' 
			});

			timeline.staggerFrom(projects, 1, { cycle:{x: [-200,200]}, opacity: 0, scale: .5 },0)
				.add(() => projects.toggleClass('clickable'))
				.to(projects, 2, { x: 0 })
				.add(() => projects.toggleClass('clickable'))
				.staggerTo(projects, 1, { x: 200, y: -100, opacity: 0, scale: .5 },0);

			scene
				.setTween(timeline)
				.addTo(controller);


			sectionPin
				.setPin(this)
				.addTo(controller);
		});


		mqDesktop.addListener(() => {
			window.location.reload();
		});
	}
	/* init common functions */
	bgTransition();
});


$(() => {
	const glimpse = $('.glimpse'),
	      logo = $('.logo'),
	      loader = $('.loader'),
	      dots = $('#logo-bottom span'),
	      tlIntro = new TimelineMax(),
	      tlLoader = new TimelineMax(),
	      tlDots = new TimelineMax({ repeat: -1, repeatDelay: .3 });

	const loadingAnimation = () => {
		tlLoader.staggerFrom(loader, 1, { opacity: 0, y: -100, ease: Bounce.easeOut, repeat: -1, repeatDelay: .4 }, .1);
	};

	const glimpseAnimation = () => {
		tlIntro.to(glimpse, 0.5, {
			y: '-100%',
			onComplete: logoAnimation
		}).set(glimpse, { y: '100%' });
	};

	const pageReady = () => {
		$(window).on('load', quitIntro);
	};

	const quitIntro = () => {

		setTimeout(() => {
			tlLoader.kill();
			TweenMax.to(loader, 1, {
				opacity: 0,
				onComplete: function () {
					loader.hide();
					glimpseAnimation();
				}
			});
		}, 1300);
	};

	const logoAnimation = () => {
		const waves = $('.wave'),
		      svgAnimation = $('#svg-animation'),
		      logoBottom = $('#logo-bottom'),
		      tlTyping = new TimelineMax();

		waves.addClass('animate');
		svgAnimation.addClass('animate');
		tlTyping.to(logoBottom, .25, { borderRightColor: '#323232', yoyo: true, repeat: -1 }).add(() => logoBottom.addClass('animate')).addCallback(() => {
			tlIntro.to(glimpse, .5, { y: '0%' });
			//.set(glimpse,{y: '100%'});
		}, 'end+=5').addCallback(() => tlTyping.kill(), 'end+=5');
	};

	loadingAnimation();
	pageReady();
});
//# sourceMappingURL=main.js.map

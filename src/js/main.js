$(() => {
	const
		glimpse = $('.glimpse'),
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
		tlIntro
			.to(glimpse, 0.5, {
				y: '-100%',
				onComplete: logoAnimation
			})
			.set(glimpse, { y: '100%' });
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
	
	};

	loadingAnimation();
	pageReady();




});
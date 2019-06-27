$(() => {

	/* variables, animations Timelines */
	const
		glimpse = $('.glimpse'),
		loader = $('.loader'),
		tlIntro = new TimelineMax(),
		tlLoader = new TimelineMax();

	/* first Animation */

	const introAnimation = () => {

		tlLoader.staggerFrom(loader, 1, { opacity: 0, y: -100, ease: Bounce.easeOut, repeat: -1, repeatDelay: .4 }, .1);
	};

	/* window loaded check and call quit introAnimation */

	const pageReady = () => {
		$(window).on('load', quitIntro);
	};

	/* quit IntroAnimation and call glimpseAnimation */

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

	/* glimpseAnimation  - onComplete: logoAnimation*/

	const glimpseAnimation = () => {

		tlIntro
			.to(glimpse, 0.5, {
				y: '-100%',
				onComplete: logoAnimation
			})
			.set(glimpse, { y: '100%' });
	};

	/* logoAnimation - last part, then page redirect */

	const logoAnimation = () => {
		const
			waves = $('.wave'),
			svgAnimation = $('#svg-animation'),
			logoBottom = $('.logo-bottom').not('not-visible'),
			tlTyping = new TimelineMax({ paused: true });

		tlTyping
			.addCallback(() => logoBottom.addClass('animate'), '+=2.5')
			.staggerTo($('.logo-bottom > span'), 0, { display: 'inline' }, .15, 'typing+=1.2')
			.staggerTo($('.logo-bottom>b>span'), 0, { display: 'inline' }, .15, '+=1.5')
			.addCallback(() => tlIntro.to(glimpse, .5, { y: '0%' }), '+=2')
			.addCallback(() => window.location.replace('about.html'), '+=.5');

		if (Modernizr.svgclippaths) {
			waves.addClass('animate');
			svgAnimation.addClass('animate');
			tlTyping.play();
		} else {
			logoBottom.addClass('animate');
			tlTyping.play().seek('typing');
		}
	};

	/* call initial Functions */

	introAnimation();

	/* !!!!!!!!!!!!!!!!!!! sometime after hard reload wont trigger, check it later (maybe just browserSync or liveServer issue? ) */
	pageReady();




});
$(() => {
	const glimpse = $('.glimpse'),
	      loader = $('.loader'),
	      tlIntro = new TimelineMax(),
	      tlLoader = new TimelineMax();

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
		tlTyping.addCallback(() => logoBottom.addClass('animate'), '+=4').staggerTo($('#logo-bottom > span'), 0, { display: 'inline' }, .15, '+=1.5').staggerTo($('#logo-bottom>b>span'), 0, { display: 'inline' }, .15, '+=1.5');
		// .addCallback(() => logoBottom.addClass('animate'),'+=1.5').addCallback(() => {
		// 	tlIntro
		// 		.to(glimpse, .5, {y: '0%'});
		// },'end+=5')
		// .addCallback(() => tlTyping.kill(),'end+=5');
	};

	loadingAnimation();
	pageReady();
});
//# sourceMappingURL=main.js.map

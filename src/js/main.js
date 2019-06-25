$(() => {
	const
		glimpse = $('.glimpse'),
		logo = $('.logo'),
		loader = $('.loader'),
		tlIntro = new TimelineMax(),
		tlLoad = new TimelineMax(),
		tlDots = new TimelineMax();
		
	const loadingAnimation = () => {
		tlLoad.staggerFrom(loader, 1, { opacity: 0, y: -100, ease: Bounce.easeOut, repeat: -1, repeatDelay: .2 }, .1);
	};
	const glimpseAnimation = () => {
		tlIntro.to(glimpse, 0.5, { y: '-100%' })
			.set(glimpse, { y: '100%' });
	};

	const introVidReady = () => {
		
		const introVid = document.querySelector('.bg-vid video');
		introVid.readyState === 4 ? quitIntro() : setTimeout(() => introVidReady(), 2000);
	};
	const quitIntro = () => {
		tlLoad.kill();
		TweenMax.to(loader, 1, { opacity: 0, onComplete: glimpseAnimation });
	};
	loadingAnimation();
	introVidReady();


	
	
});
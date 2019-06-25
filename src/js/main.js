$(() => {
	const
		glimpse = $('.glimpse'),
		logo = $('.logo'),
		loader = $('.loader'),
		tlIntro = new TimelineMax(),
		tlLoad = new TimelineMax(),
		myFunc = () => {
			console.log('aaa');

		};


	tlLoad.staggerFrom(loader, 1, { opacity: 0, y: -100, ease: Bounce.easeOut, repeat: -1, repeatDelay: .2 }, .1);
	$(window).on('load', function () {
		setTimeout(() => {


			tlLoad.kill();
			TweenMax.to(loader, 1, { opacity: 0, onComplete: myFunc });

		}, 1800);

	});






});
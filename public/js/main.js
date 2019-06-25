$(() => {
	const glimpse = $('.glimpse'),
	      logo = $('.logo'),
	      tlIntro = new TimelineMax();

	tlIntro.to(glimpse, .3, { y: '-100%' }, 1).set(glimpse, { y: '100%' });
});
//# sourceMappingURL=main.js.map

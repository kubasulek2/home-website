$(() => {

	/* Media query for smaller screens*/

	const mqMobile = window.matchMedia('(max-width: 1023px)');

	/* Main condition: either swiper mode or 3d slider*/

	if (!Modernizr.csstransforms3d || !Modernizr.preserve3d || mqMobile.matches) {

		/* Swiper */

		const swiper = new Swiper('.swiper-container', {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		});
	} else {

		/* 3d-slider */

		$('#skills-content').addClass('_3d');
	}
});
//# sourceMappingURL=skills.js.map

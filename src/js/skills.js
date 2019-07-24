$(() => {
	
	/* Media query for smaller screens*/
	
	const mqMobile = window.matchMedia('(max-width: 1023px)');
	
	/* Main condition: either swiper mode or 3d slider*/
	
	if (!Modernizr.csstransforms3d || !Modernizr.preserve3d || mqMobile.matches) {

		/* Swiper */

		const swiper = new Swiper('.swiper-container', {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});

	} else{
		
		/* 3d-slider */

		$('#skills-content').addClass('_3d');
		$('.swiper-slide').click(function () {
			console.log(this);
		})
	}

	/* reload page on matchmedia to change site logic */

	mqMobile.addListener(() => {
		window.location.reload();
	})
});
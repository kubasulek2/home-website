'use strict';

/* Create symbols for emulate private class members */

const
	_rotationSpeed = Symbol('rotationSpeed'),
	_clickedId = Symbol('clickedId'),
	_easing = Symbol('easing'),
	_speedMeasure = Symbol('speedMeasure'),
	_motionData = Symbol('motionData'),
	_dynamicContent = Symbol('dynamicContent'),
	_calculateEntryValues = Symbol('calculateEntryValues'),
	_computeEasing = Symbol('computeEasing'),
	_computeRotatingTime = Symbol('_computeRotatingTime'),
	_applyEasing = Symbol('applyEasing'),
	_computeAvgSpeed = Symbol('computeAvgSpeed'),
	_getTargetAngle = Symbol('getTargetAngle'),
	_shouldChangeDirection = Symbol('shouldChangeDirection'),
	_restoreAnimation = Symbol('restoreAnimation'),
	_accelerate = Symbol('accelerate');
/* Htlm element class */

class HtmlElement {
	constructor(element) {
		this.element = element;
	}
	copy() {
		return this.element.clone();
	}
	remove() {
		this.element.remove();
	}
	append(parent) {
		this.element.append(parent);
	}
}

class Slider extends HtmlElement {
	constructor(element, speed = .7) {
		super(element);

		this.baseSpeed = speed > 1 ? 1 : speed;
		this.faces = this.element.children('.swiper-slide');

		this[_rotationSpeed] = speed > 1 ? 1 : speed;
		this[_clickedId] = '';
		this[_easing] = [];
		this[_speedMeasure] = {
			start: undefined,
			stop: undefined,
			lastMeasuredAngle: undefined,
			speedArr: [],
			avgSpeed: undefined
		};
		this[_motionData] = {
			isAboutToStop: false,
			angleWhenClicked: undefined,
			currentAngle: 0,
			targetAngle: undefined,
			move: true
		};
	}
}

$(() => {

	/* Create outside object to store and update click data */
	const clickData = {};


	/* Skills Animation IFFE */



	/* Skills animation event handler IIFE */

	const skillsHandler = (() => {
		let counter = 0;
		const tlSkills = new TimelineMax({ paused: true });

		return (e) => {

			// check if e exist
			e = e || window.event;

			// variables

			const
				slide = $(e.currentTarget),
				techLists = slide.find('.techs li'),
				skillsLists = Modernizr.svgclippaths ? slide.find('.svg-clipped') : slide.find('.svg-fallback'),
				icon = slide.find('.icon-wrapper'),
				buttons = $('.swiper-button-prev,.swiper-button-next');


			if ($('#skills-content._3d').length > 0) {
				//3d layout
				tlSkills.to(slide, 1, { scale: 1 }, 'firstStage');
			} else {
				//swiper layout
				tlSkills.to(buttons, 1, { autoAlpha: 0 }, 'firstStage');
			}

			tlSkills
				.to(icon, 1, { opacity: .05 }, 'firstStage')
				.set(icon, { 'filter': 'grayscale(90%)' })
				.staggerFromTo(techLists, .5, { scale: .3, opacity: 0 }, {
					scale: 1,
					opacity: 1,
					cycle: {
						ease: (i) => Back.easeOut.config(i * 3)
					}
				}, .1, 'secondStage');

			/* Here looping through techlists to create stagger efect for any given list length */

			skillsLists.each((i, e) => {
				
				tlSkills
					.set(e,{opacity: 1})
					.staggerFromTo($(e).find('.star'), 1, { opacity: 0 }, { opacity: 1, ease: Bounce.easeOut }, .1);
			});

			/* Determining current progress of animation */

			const startAnimFrom = tlSkills.isActive() ? Number((tlSkills.time()).toFixed(1)) : 0;

			// animation direction reversed each time

			counter % 2 ? tlSkills.reverse(startAnimFrom) : tlSkills.play(startAnimFrom);
			counter++;
		};
	})();

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

	} else {
		/* 3d-slider */

		$('#skills-content').addClass('_3d');

		/* If in 3d mode reload page on matchmedia to change on flat */

		mqMobile.addListener(() => {
			window.location.reload();
		});
	}

	$('.swiper-slide')
		.off()
		.on('click', (e) => skillsHandler(e));


});
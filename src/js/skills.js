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
	/* Media query for smaller screens*/

	const mqMobile = window.matchMedia('(max-width: 1023px)');
	let swiper;

	/* Main condition: either swiper mode or 3d slider*/

	if (!Modernizr.csstransforms3d || !Modernizr.preserve3d || mqMobile.matches) {

		/* Swiper */

		swiper = new Swiper('.swiper-container', {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
		swiper.allowTouchMove = false;

	} else {
		/* 3d-slider */

		$('#skills-content').addClass('_3d');

		/* If in 3d mode reload page on matchmedia to change on flat */

		mqMobile.addListener(() => {
			window.location.reload();
		});
	}


	const skillsHandler = (el) => {
		
		let counter = 0;
		
		// variables 1

		const 
			tlSkills = new TimelineMax({ paused: true }),
			slide = $(el),
			techLists = slide.find('.techs li'),
			skillsLists = Modernizr.svgclippaths ? slide.find('.svg-clipped') : slide.find('.svg-fallback'),
			icon = slide.find('.icon-wrapper'),
			buttons = $('.swiper-button-prev,.swiper-button-next');

		if ($('#skills-content._3d').length > 0) {
			//3d layout
			tlSkills.fromTo(slide, 1,{scale: .8}, { scale: 1 }, 'firstStage');
		} else {
			//swiper layout
			tlSkills.fromTo(buttons, 1, { autoAlpha: 1 },{ autoAlpha: 0 }, 'firstStage');
		}

		tlSkills
			.fromTo(icon, 1, { opacity: 1, 'filter': 'grayscale(0%)' }, { opacity: .05, 'filter': 'grayscale(90%)' }, 'firstStage')
			.staggerFromTo(techLists, .5, { scale: .3, opacity: 0 }, {
				scale: 1,
				opacity: 1,
				cycle: {
					ease: (i) => Back.easeOut.config(i * 3)
				}
			}, .1, 'secondStage');
			
		/* Here looping through techlists to create stagger efect for any given list length */

		$(skillsLists.get().reverse()).each((ind, e) => {
			const stars = $(e).find('.star'),
				cycle = ind % 2 ? -.1 : .1;
				
			tlSkills
				.set(e, { opacity: 1 }, `synch+=${ind * .4}`)
				.staggerFromTo(stars, .4, {
					y: -800, opacity: 0
				}, { y: 0, opacity: 1, ease: Bounce.easeOut }, cycle, `synch+=${ind * .4}`);

		});
				
		/* Last Part of animation only if svg-clipPath is supported */
		if (Modernizr.svgclippaths){
				
				
			tlSkills.fromTo(skillsLists.find('#stars-background'), .7, { width: '0%' }, { 
				width: (i,e) => `${Number($(e).parent().parent().data('level')) * 20}%`, ease: Power0.easeNone });
		}

		/* return an event handling function */

		return () => {
			
			/* Determining current progress of animation */

			let startAnimFrom = tlSkills.isActive() ? Number((tlSkills.time()).toFixed(1)) : 0;

			/* Skip part of animation  if reversed */

			counter % 2 && (startAnimFrom > tlSkills.getLabelTime('synch') || startAnimFrom === 0) ? startAnimFrom = tlSkills.getLabelTime('synch') : null; 
			
			// animation direction reversed each time

			counter % 2 ? tlSkills.reverse(startAnimFrom) : tlSkills.play();
			counter++;
			
		};
	};

	/* create right handlers for each slide */
	const 
		frontHandler = skillsHandler($('.swiper-slide.front')),
		front2Handler = skillsHandler($('.swiper-slide.front-2')),
		rightHandler = skillsHandler($('.swiper-slide.right')),
		right2Handler = skillsHandler($('.swiper-slide.right-2')),
		backHandler = skillsHandler($('.swiper-slide.back')),
		back2Handler = skillsHandler($('.swiper-slide.back-2')),
		leftHandler = skillsHandler($('.swiper-slide.left'));

	/* attach handlers to slides */

	$('.swiper-slide.front')
		.off()
		.on('click', () => frontHandler());

	$('.swiper-slide.front-2')
		.off()
		.on('click', () => front2Handler());
			
	$('.swiper-slide.right')
		.off()
		.on('click', () => rightHandler());	
	
	$('.swiper-slide.right-2')
		.off()
		.on('click', () => right2Handler());	
	
	$('.swiper-slide.back')
		.off()
		.on('click', () => backHandler());	
	
	$('.swiper-slide.back-2')
		.off()
		.on('click', () => back2Handler());	
	
	$('.swiper-slide.left')
		.off()
		.on('click', () => leftHandler());	


});
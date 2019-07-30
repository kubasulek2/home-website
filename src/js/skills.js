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
	_restoreRotation = Symbol('restoreRotation'),
	_updateContent = Symbol('updateContent'),
	_accelerate = Symbol('accelerate'),
	_animationData = Symbol('animationData'),
	_createAnimation = Symbol('createAnimation');

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
		this.slides = this.element.children('.swiper-slide');

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
			move: true,
			turnEvenOdd: 'odd'
		};
		this[_dynamicContent] = {
			content: 1,
			willUpdate: true
		};
		this[_animationData] = {
			slide: '',
			counters: [0,0,0,0,0,0,0],
			animations: []
			
		};
	}
	animateElement() {

		if (!this[_speedMeasure].avgSpeed) this[_calculateEntryValues]();

		if (this[_motionData].move) {

			let rotationSpeed = this[_computeRotatingTime]();

			this[_computeAvgSpeed](rotationSpeed);
			this[_updateContent]();

			if (this[_easing].length !== 0) this[_applyEasing]();

			if (this[_easing].length === 0 && this[_rotationSpeed] < this.baseSpeed) this[_accelerate]();


			this[_motionData].currentAngle -= this[_rotationSpeed];

			this[_motionData].currentAngle <= -360
				? this[_motionData].turnEvenOdd === 'odd'
					? this[_motionData].turnEvenOdd = 'even'
					: this[_motionData].turnEvenOdd = 'odd'
				: null;


			this[_motionData].currentAngle = this[_motionData].currentAngle <= -360 ? 0 : this[_motionData].currentAngle;



			this.element.css('transform', `rotateY(${this[_motionData].currentAngle}deg)`);

			// targetAngle is set in click event, so after click event rotation will stop

			if (Math.round(this[_motionData].currentAngle) === this[_motionData].targetAngle) {
				this[_motionData].move = false;
				this.element.css('transform', `rotateY(${this[_motionData].targetAngle}deg)`);
			}

			window.requestAnimationFrame(() => this.animateElement());
		}
		else {
			this.animateSlide();
		}
	}

	animateSlide() {
		
		// set active slide
		this[_animationData].slide = this.slides.filter((i, el) => $(el).attr('id') === this[_clickedId]);
		
		// find index of active slide in all slides array
		const 
			index = this.slides.index(this[_animationData].slide),
			counter = this[_animationData].counters[index];

		// if counter for active slide is 0, create animation for this slide.

		counter === 0 ? this[_animationData].animations[index] = this[_createAnimation]() : null;
		
		/* Determining current progress of animation */
		
		let 
			animation = this[_animationData].animations[index],
			startAnimFrom = animation.isActive() ? Number((animation.time()).toFixed(1)) : 0;

		/* Skip part of animation  if reversed */

		counter % 2 && (startAnimFrom > animation.getLabelTime('synch') || startAnimFrom === 0) ? startAnimFrom = animation.getLabelTime('synch') : null;

		// animation direction reversed each time

		counter % 2 ? animation.reverse(startAnimFrom) : animation.play();
		
		this[_animationData].counters[index] = this[_animationData].counters[index] + 1;
		

	}

	faceClickEvent() {

		this.slides.on('click', (e) => {

			if (!this[_motionData].isAboutToStop) {

				let target = e.currentTarget;
				e.stopPropagation();
				this[_getTargetAngle](e);
				this[_clickedId] = target.id;

				let direction = this[_shouldChangeDirection]();

				this[_motionData].isAboutToStop = true;
				this[_easing] = this[_computeEasing](direction);
				this[_motionData].angleWhenClicked = this[_motionData].currentAngle;


				$('body')
					.one('click', () => {
						this[_restoreRotation]();
					});
			}
		});
	}

	[_calculateEntryValues]() {
		this[_speedMeasure].avgSpeed = (30 / (this.baseSpeed * 60));
	}

	[_computeRotatingTime]() {

		let currentAngle = Math.abs(Math.floor(this[_motionData].currentAngle));
		let rotationTime;
		let flag = !(currentAngle % 31);

		// return if current angle haven't change from last measurement
		if (this[_speedMeasure].lastMeasuredAngle === currentAngle) {
			return null;
		}


		this[_speedMeasure].lastMeasuredAngle = currentAngle;


		if (this[_speedMeasure].measureAngle === currentAngle) {
			this[_speedMeasure].stop = new Date();
			rotationTime = (this[_speedMeasure].stop - this[_speedMeasure].start) / 1000;
			return rotationTime;
		}
		//every 31 degrees start time, and angle, at which speed will be measured, are set
		if (flag) {
			this[_speedMeasure].measureAngle = this[_motionData].currentAngle === 360 ? 30 : currentAngle + 30;
			this[_speedMeasure].start = new Date();
		}
		return null;
	}

	[_computeEasing](direction) {
		let distance = Math.abs(Math.abs(this[_motionData].targetAngle) - Math.abs(this[_motionData].currentAngle));

		let steps = distance < 20 ? 5 : 10;
		let threshold, delay, speed, speedChange, startEase, slowAngles, easing = [];
		let baseSpeed = this[_rotationSpeed];

		switch (true) {
		case distance <= 10:
			delay = 0;
			break;
		case distance <= 20:
			delay = 3;
			break;
		case distance <= 30:
			delay = 8;
			break;
		case distance <= 40:
			delay = 15;
			break;
		case distance <= 50:
			delay = 24;
			break;
		case distance <= 60:
			delay = 32;
			break;
		case distance <= 70:
			delay = 40;
			break;
		case distance <= 80:
			delay = 50;
			break;
		case distance <= 90:
			delay = 60;
			break;

		}

		threshold = (distance - delay) / steps;
		speedChange = baseSpeed / steps;
		speed = baseSpeed;
		startEase = direction === 'forth' ? this[_motionData].currentAngle - delay : this[_motionData].currentAngle + delay;
		slowAngles = startEase;

		threshold = direction === 'forth' ? -threshold : threshold;


		for (let i = 1; i < steps; i++) {
			slowAngles += threshold;
			speed -= speedChange;

			if (speed > 0) speed = speed < 0.1 ? 0.1 : speed;
			else speed = speed > -0.1 ? -0.1 : speed;

			easing[i - 1] = [];

			easing[i - 1].push(Math.round(slowAngles));
			easing[i - 1].push(parseFloat(speed.toFixed(2)));
		}
		return easing;

	}

	[_applyEasing]() {

		this[_easing].forEach(value => {
			if (Math.round(this[_motionData].currentAngle) === value[0])
				this[_rotationSpeed] = value[1];
		});
	}

	[_computeAvgSpeed](arg) {

		if (arg === null) return;

		this[_speedMeasure].speedArr.push(arg);

		if (this[_speedMeasure].speedArr.length > 4) {
			this[_speedMeasure].speedArr.shift();

		}
		this[_speedMeasure].avgSpeed = this[_speedMeasure].speedArr.reduce((a, b) => a + b, 0) / this[_speedMeasure].speedArr.length;

	}

	[_getTargetAngle](e) {

		const targetId = $(e.currentTarget).data('angle');

		switch (targetId) {
		case 'front':
			this[_motionData].targetAngle = 0;
			break;
		case 'right':
			this[_motionData].targetAngle = -90;
			break;
		case 'back':
			this[_motionData].targetAngle = -180;
			break;
		case 'left':
			this[_motionData].targetAngle = -270;
			break;
		}
	}

	[_shouldChangeDirection]() {
		let direction = 'forth';
		if (this[_motionData].targetAngle === 0) {
			//if clicked in front plane, which set target angle to 0 , must have special check, cause current angle is always lesser than 0

			this[_rotationSpeed] = this[_motionData].currentAngle < -180 ? this[_rotationSpeed] : - this[_rotationSpeed];

			direction = this[_motionData].currentAngle < -180 ? 'forth' : 'back';

		} else if (this[_motionData].currentAngle < this[_motionData].targetAngle) {
			//all the other cases
			this[_rotationSpeed] = -this[_rotationSpeed];
			direction = 'back';
		}
		return direction;
	}

	[_restoreRotation]() {
		this[_motionData].isAboutToStop = false;
		this[_easing] = [];
		this[_motionData].targetAngle = undefined;
		this[_clickedId] = '';
		this[_rotationSpeed] = this[_rotationSpeed] < 0 ? -this[_rotationSpeed] : this[_rotationSpeed];
		
		if (!this[_motionData].move) {	
			this[_motionData].move = true;
			this.animateElement();
		}
		

	}

	[_accelerate]() {
		this[_rotationSpeed] = parseFloat((this[_rotationSpeed] + 0.005).toFixed(3));
	}

	[_updateContent]() {

		if (this[_motionData].turnEvenOdd === 'odd') {

			if (this[_motionData].currentAngle < -265 && this[_motionData].currentAngle > -270 && this[_dynamicContent].willUpdate) {

				this[_dynamicContent].willUpdate = false;
				this.slides.eq(0).hide();
				this.slides.eq(1).hide();
				this.slides.eq(2).hide();
				this.slides.eq(4).show();
				this.slides.eq(5).show();
				this.slides.eq(6).show();

			}
		} else {
			if (this[_motionData].currentAngle < -265 && this[_motionData].currentAngle > -270 && this[_dynamicContent].willUpdate) {

				this[_dynamicContent].willUpdate = false;
				this.slides.eq(0).show();
				this.slides.eq(1).show();
				this.slides.eq(2).show();
				this.slides.eq(4).hide();
				this.slides.eq(5).hide();
				this.slides.eq(6).hide();
			}
		}

		if (this[_motionData].currentAngle < -350 && this[_motionData].currentAngle > -355 && !this[_dynamicContent].willUpdate) {

			this[_dynamicContent].willUpdate = true;
		}
	}

	[_createAnimation]() {


		// variables 1

		const
			tlSkills = new TimelineMax({ paused: true }),
			slide = this[_animationData].slide,
			techLists = slide.find('.techs li'),
			skillsLists = Modernizr.svgclippaths ? slide.find('.svg-clipped') : slide.find('.svg-fallback'),
			icon = slide.find('.icon-wrapper'),
			buttons = $('.swiper-button-prev,.swiper-button-next'),
			inProgress = slide.find('.inProgress');

		if ($('#skills-content._3d').length > 0) {
			//3d layout
			tlSkills.fromTo(slide, 1, { scale: .8 }, { scale: 1 }, 'firstStage');
		} else {
			//swiper layout
			tlSkills.fromTo(buttons, 1, { autoAlpha: 1 }, { autoAlpha: 0 }, 'firstStage');
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

		/* inProgress li's have separate animation */

		if (inProgress.length > 0) {
			inProgress.each((ind, e) => {
				const loaders = $(e).find('.loader');

				tlSkills
					.set(e, { opacity: 1 }, 'synch')
					.staggerFromTo(loaders, 1, {
						cycle: {
							opacity: [0, 1]
						}
					}, {
						cycle: {
							opacity: [1, 0]
						},
						repeat: -1
					}, .2, 'synch');
			});

			
		}

		/* Last Part of animation only if svg-clipPath is supported */
		if (Modernizr.svgclippaths) {


			tlSkills.fromTo(skillsLists.find('#stars-background'), .7, { width: '0%' }, {
				width: (i, e) => `${Number($(e).parent().parent().data('level')) * 20}%`, ease: Power0.easeNone
			});
		}

		/* return animation */
		return tlSkills;
	}
}

$(() => {

	const mqMobile = window.matchMedia('(max-width: 1023px)'),
		slider3d = new Slider($('.swiper-wrapper'), .6);

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

		slider3d.animateElement();
		slider3d.faceClickEvent();




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
			buttons = $('.swiper-button-prev,.swiper-button-next'),
			inProgress = slide.find('.inProgress');

		if ($('#skills-content._3d').length > 0) {
			//3d layout
			tlSkills.fromTo(slide, 1, { scale: .8 }, { scale: 1 }, 'firstStage');
		} else {
			//swiper layout
			tlSkills.fromTo(buttons, 1, { autoAlpha: 1 }, { autoAlpha: 0 }, 'firstStage');
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

		/* inProgress li's have separate animation */

		if (inProgress.length > 0) {
			inProgress.each((ind, e) => {
				const loaders = $(e).find('.loader');

				tlSkills
					.set(e, { opacity: 1 }, 'synch')
					.staggerFromTo(loaders, 1, {
						cycle: {
							opacity: [0, 1]
						}
					}, {
						cycle: {
							opacity: [1, 0]
						},
						repeat: -1
					}, .2, 'synch');
			});
		}

		/* Last Part of animation only if svg-clipPath is supported */
		if (Modernizr.svgclippaths) {


			tlSkills.fromTo(skillsLists.find('#stars-background'), .7, { width: '0%' }, {
				width: (i, e) => `${Number($(e).parent().parent().data('level')) * 20}%`, ease: Power0.easeNone
			});
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

	/* $('.swiper-slide.front')
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
 */
	/* stop propagation on back-face */

	$('.back-face').on('click', (event) => {
		event.stopPropagation();
	});



});
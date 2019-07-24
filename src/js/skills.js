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
	/* Skills animation event handler IIFE */

	const skillsHandler = (() => {
		let counter = 0;
		return (e) => {
			// check if e exist
			e = e || window.event;

			const tlSkills = new TimelineMax({ paused: true });
			tlSkills.add(() => {
				console.log(e.currentTarget);

			});

			// animiation play from current time if active
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

		$('.swiper-slide').on('click', (e) => {
			skillsHandler(e);
		});



		/* If in 3d mode reload page on matchmedia to change on flat */

		mqMobile.addListener(() => {
			window.location.reload();
		});

	}
});
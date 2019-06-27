/* utility functions */

const isMobileDevice = () => {
	return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};
const viewPortWidth = () => {
	return $(window).outerWidth();
};

$(document).ready(function () {

	/* colors to use on the page */

	const $darkerBackground = '#2a2a2a',
	      $baseBackground = '#323232';

	/* Background animation played after each subpage loaded */

	const bgTransition = () => {

		const columnEven = $('.column:nth-child(even)'),
		      columnOdd = $('.column:nth-child(odd)'),
		      columnWrapper = $('.glimpse .column-wrap'),
		      background = $('.glimpse'),
		      tm = new TimelineMax();

		tm.set([background, columnWrapper], { background: 'transparent' }).to(columnWrapper, .6, { rotationZ: 0 }, 'synchro').to(columnEven, .6, { width: 0 }, 'synchro').to(columnOdd, .6, { width: '12.5%' }, 'synchro').set(background, { y: '100%' }).set([background, columnWrapper], { background: $darkerBackground });
	};

	bgTransition();

	/* about.html code */

	if ($('body#about').length) {
		viewPortWidth();
	}
});
//# sourceMappingURL=main.js.map

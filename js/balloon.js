$(function () {

	// controller
	var balloon = new BalloonController($('body'));

	// button
	$('#disable').click(function(event) {
		balloon.toggleEnable();
	});

	// form
	$('#form-submit').click(function(event) {
		balloon.setMin($('#form-min').val());
		balloon.setMax($('#form-max').val());
		balloon.storeSettingsToLocalStorage();
	});

});
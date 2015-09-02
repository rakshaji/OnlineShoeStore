/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

$(document).ready(function() {
	// clear the form fields
	$("input[name='username']").val('');
	$("input[name='password']").val('');

	// bring focus to the username input field
	$("input[name='username']").focus();

	// add listener to the reset button
	$("button[name='reset']").on('click', function() {
		// bring focus to the username input field
		$("div#login p").text("All fields are required.");
		$("div#login p").removeClass("ui-state-error");
		$("div#login p").removeClass("ui-state-success");
		$("input[name='username']").focus();
	});
});

/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #3								  ###
#################################################
 */

var alphaOnlyPattern = new RegExp(/^[a-zA-Z\s]+$/);
$(document)
		.ready(
				function() {
					
					initAccordions();
					initSelectMenus();

					addValidationOnDeliveryDetails('#shipping_adr_div');
					addValidationOnDeliveryDetails('#billing_adr_div');
					addValidationOnPaymentMethod();

					$('#duplicate_div').hide();
					$('#success_div').hide();
					$('#right_wrapper2').hide();
					$('#left_wrapper2').hide();
					initPageContentByCartSize();

					addClickListeners();

					updateTotal();
					
					loadCartSummary();
					
					// default on load settings
					$('#shipping_adr_div input[name="firstname"]').focus();
					$('input[id="is_address_same"]').prop('checked', true);
					
				});

function loadCartSummary() {
	// load order summary with cart items
	var cartArray = cart.getCartArray();
	$('#final_cart').append('<div><p id="checkout_header" >Your cart ('+cart.size()+
			' item(s)):<a id="edit_cart" href="/jadrn036/servlet/Dispatcher?request_type=cart">Edit</a></p></div>');
	for(i=0; i < cartArray.length; i++) {
		$('#final_cart')
			.append('<div id="checkout_cart_item" >'+
						'<img id="product_mini_image" src="/~jadrn036/proj1/tabs/_p_images/'+cartArray[i].image+'" />'+
						'<div id="checkout_cart_info_div" >'+
							'<p><span id="checkout_cart_info" >Manufacturer: </span>'+cartArray[i].model+'</p>'+
							'<p><span id="checkout_cart_info" >Quantity: </span>'+cartArray[i].quantity+'</p>'+
							'<p><span id="checkout_cart_info" >Price: </span>$'+cartArray[i].price+'</p>'+
							'<p><span id="checkout_cart_info" >Sub-total: </span>$'+cartArray[i].subtotal+'</p>'+
						'</div>'+
					'</div>');
		$("div#checkout_cart_item:last img#product_mini_image").click(function() {
			var imageURL = $(this).attr('src');
			var imageName = getImageName(imageURL);
			var sku = $.trim(imageName.substring(0, imageName
					.indexOf('.')));
			sku = sku.toUpperCase();

			var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&sku='
					+ sku;
			$('form#search_form').attr('action', url);
			$('form#search_form').submit();
		});
	}
}

function addClickListeners() {
	$('a#is_address_same').click(function() {
		if ($("input:checked").length == 0) {
			$('#duplicate_div').show();
		} else {
			// hide errors
			$('#duplicate_div').hide();
			$('div#duplicate_div .ui-state-error')
				.each(function() {
					$(this).removeClass('ui-state-error');
					$(this).text("");
					$(this).hide();
				});
			// clean fields
			$('#duplicate_div #state').find('option:first').attr('selected', 'selected');
			$('#duplicate_div #state').selectmenu( "refresh" );
			
			$('#duplicate_div input[type="text"]').each(function() {
				$(this).val("");
			});
		}
	});
	
	$('[name="order_btn"]').click(function() {
		if (!checkIfAllFormComplete(true, true, true)) {
			$('#right_error_div')
					.text("Your order cannot be placed. Please complete delivery details and payment information.");
			$('#right_error_div').addClass(
					'ui-state-error').show();
			return false;
		}

		$.get('http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=order',
						handleOrder);

	});
} 

function initSelectMenus(){
	$("#card_type").selectmenu();
	$("#expires_mon").selectmenu().selectmenu("menuWidget")
			.addClass("overflow_select");
	$("#expires_yr").selectmenu().selectmenu("menuWidget")
			.addClass("overflow_select");
	$("#shipping_adr_div #state").selectmenu().selectmenu(
			"menuWidget").addClass("overflow_select");
	$("#billing_adr_div #state").selectmenu().selectmenu(
			"menuWidget").addClass("overflow_select");
}

function initAccordions() {
	$("#accordion").accordion({
		heightStyle : "content",
		collapsible : true
	});
	
	$( "#accordion" ).on( "accordionactivate", function( event, ui ) {
		var active = $( "#accordion" ).accordion( "option", "active" );
		if(active == 2){
			if (checkIfAllFormComplete(false, true, true)) {
				hideSummaryError();
			} else {
				showSummaryError();
			}
			
			// Show shipping address
			var addr = getAddressString('div#shipping_adr_div');
			$('#final_shipping_address').empty();
			$('#final_shipping_address')
				.append('<p id="checkout_header" >Shipping Address:<a id="edit_address">Edit</a></p><p id="checkout_header_dtl" > '+addr+'</p>');
			
			// Show billing address
			if ($("input:checked").length == 0) {
				addr = getAddressString('div#billing_adr_div');;
			}
			
			$('#final_billing_address').empty();
			$('#final_billing_address')
				.append('<p id="checkout_header" >Billing Address:<a id="edit_address">Edit</a></p><p id="checkout_header_dtl" >'+addr+'</p>');
			
			$('a#edit_address').click( function(){ 
					$( "#accordion" ).accordion( "option", "active", 0);
			});
		} else {
			hideSummaryError();
		}
	} );
}

function showSummaryError() {
	$('#summary_error_div').text("Please provide complete shipping and billing address.");
	$('#summary_error_div').addClass('ui-state-error');
	$('#summary_error_div').show();
}

function hideSummaryError(){
	$('#summary_error_div').text('');
	$('#summary_error_div').removeClass('ui-state-error');
	$('#summary_error_div').show();
}

function getAddressString(addrDiv){
	var addr = "";
	addr += $(addrDiv + ' input[name="firstname"]').val().trim() + " ";
	addr += $(addrDiv + ' input[name="lastname"]').val().trim() + ", <br>";
	addr += $(addrDiv + ' input[name="address1"]').val().trim() + ", <br>";
	addr += $(addrDiv + ' input[name="address2"]').val().trim() === "" ? "" : 
				$(addrDiv + ' input[name="address2"]').val().trim() + ", <br>";
	addr += $(addrDiv + ' input[name="city"]').val().trim() + ", ";
	addr += $(addrDiv + ' #state-button').text()  === "State" ? ", <br>" : $(addrDiv + ' #state-button').text() + ", <br>";
	addr += $(addrDiv + ' input[name="zip_code"]').val().trim() + ", ";
	addr += "United States, <br>";
	addr += "Phone: "+$(addrDiv + ' input[name="phone"]').val().trim() + "<br>";
	
	return addr;
}

function handleOrder(response) {
	if (response === "Error") {
		$('#right_error_div').text("");
		$('#right_error_div').text(
				"Oops! there was some server error. Please retry.");
		$('#right_error_div').addClass('ui-state-error').show();
		return;
	}
	cart.removeAll();
	updateCartDisplay();
	$('#success_div').text("Your order was placed successfully. Thank you for shopping with us!");
	$('#success_div').addClass('ui-state-success').show();
	$('#right_wrapper2').remove();
	$('#left_wrapper2').remove();
}

function checkIfAllFormComplete(isPaymentSectionToCheck, isShippingSectionToCheck, isBillingSectionToCheck) {
	var isComplete = true;
	if(isPaymentSectionToCheck){
		$('#pay_method_div' + ' #card_type-button').blur();
		$('#pay_method_div' + ' #expires_yr-button').blur();
		$('#pay_method_div' + ' #expires_mon-button').blur();
		$('#pay_method_div input[type="text"]').each(function() {
			$(this).blur();
		});
		
		if ($('div#right_wrapper2 #pay_method_div .ui-state-error').length > 0) {
			isComplete = false;
		}
	}

	if(isShippingSectionToCheck){
		$('#shipping_adr_div' + ' #state-button').blur();
		$('#shipping_adr_div input[type="text"]:not(.address2)').each(function() {
			$(this).blur();
		});
		
		if ($('div#right_wrapper2 #shipping_adr_div .ui-state-error').length > 0) {
			isComplete = false;
		}
	}

	if(isBillingSectionToCheck){
		if ($("input:checked").length == 0) {
			$('#duplicate_div' + ' #state-button').blur();
			$('#duplicate_div input[type="text"]:not(.address2)').each(function() {
				$(this).blur();
			});
		}
		
		if ($('div#right_wrapper2 #duplicate_div .ui-state-error').length > 0) {
			isComplete = false;
		}
	}

	return isComplete;
}

function addValidationOnPaymentMethod() {
	var divId = "#pay_method_div";

	$(divId + ' input[name="name_on_card"]').blur(function() {
		var eleObj = $(this);
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please enter a valid Name.");
		} else if (!alphaOnlyPattern.test(eleObj.val().trim())) {
			showValdationError(eleObj, "Only alphabets are allowed.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' #card_type-button').blur(function() {
		var eleObj = $(divId + ' select');
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please select a valid Card Type.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' #expires_yr-button').blur(function() {
		var eleObj = $(divId + ' select');
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please select a valid Month.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' #expires_mon-button').blur(function() {
		var eleObj = $(divId + ' select');
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please select a valid Year.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' input[name="card_num"]').blur(
			function() {
				var eleObj = $(this);
				if (eleObj.val().trim() === "") {
					showValdationError(eleObj,
							"Please select a valid Card Number.");
				} else if (eleObj.val().trim().length < 19) {
					showValdationError(eleObj,
							"Please enter a valid 16 digit Card Number.");
				} else {
					hideValidationError(eleObj);
				}
			});

	$(divId + ' input[name="card_num"]').keydown(
			function(e) {
				checkIfNumber(e);

				if ($(this).val().length == 4 || $(this).val().length == 9
						|| $(this).val().length == 14) {
					$(this).val($(this).val() + "-");
				}
			});

	allowNumbersOnly($('[name="secure_code"]'));

	$(divId + ' [name="secure_code"]').blur(
			function() {
				var eleObj = $(this);
				if (eleObj.val().trim() === "") {
					showValdationError(eleObj,
							"Please select a valid Security code.");
				} else if (eleObj.val().trim().length < 3) {
					showValdationError(eleObj,
							"Please enter a valid 3 digit Security code.");
				} else {
					hideValidationError(eleObj);
				}
			});
}

function allowNumbersOnly(eleObj) {
	eleObj.keydown(function(e) {
		checkIfNumber(e);
	});
}

function checkIfNumber(e) {
	// Allow: backspace, delete, tab, escape and enter
	if ($.inArray(e.keyCode, [ 46, 8, 9, 27, 13 ]) !== -1 ||
	// Allow: Ctrl+A
	(e.keyCode == 65 && e.ctrlKey === true) ||
	// Allow: home, end, left, right, down, up
	(e.keyCode >= 35 && e.keyCode <= 40)) {
		// let it happen, don't do anything
		return;
	}
	// Ensure that it is a number and stop the keypress
	if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57))
			&& (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
	}
}

function addValidationOnDeliveryDetails(divId) {
	$(divId + ' input[name="firstname"]').blur(function() {
		var eleObj = $(this);
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please enter a valid First name.");
		} else if (!alphaOnlyPattern.test(eleObj.val().trim())) {
			showValdationError(eleObj, "Only alphabets are allowed.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' input[name="lastname"]').blur(function() {
		var eleObj = $(this);
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please enter a valid Last name.");
		} else if (!alphaOnlyPattern.test(eleObj.val().trim())) {
			showValdationError(eleObj, "Only alphabets are allowed.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' input[name="address1"]').blur(function() {
		var eleObj = $(this);
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please enter a valid Street Address.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' input[name="city"]').blur(function() {
		var eleObj = $(this);
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please enter a valid City/Town.");
		} else if (!alphaOnlyPattern.test(eleObj.val().trim())) {
			showValdationError(eleObj, "Only alphabets are allowed.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' #state-button').blur(function() {
		var eleObj = $(divId + ' select');
		if (eleObj.val().trim() === "") {
			showValdationError(eleObj, "Please select a valid State.");
		} else {
			hideValidationError(eleObj);
		}
	});

	$(divId + ' input[name="zip_code"]')
			.blur(
					function() {
						var eleObj = $(this);
						if (eleObj.val().trim() === "") {
							showValdationError(eleObj,
									"Please enter a valid Zip code.");
						} else if (eleObj.val().trim().length < 5) {
							showValdationError(eleObj,
									"Please enter a valid 5 digit Zip code.");
						} else {
							hideValidationError(eleObj);
						}
					});

	allowNumbersOnly($(divId + ' [name="zip_code"]'));

	$(divId + ' input[name="phone"]').blur(
			function() {
				var eleObj = $(this);
				if (eleObj.val().trim() === "") {
					showValdationError(eleObj,
							"Please enter a valid phone number.");
				} else if (eleObj.val().trim().length < 12) {
					showValdationError(eleObj,
							"Please enter a valid 10 digit Phone number.");
				} else {
					hideValidationError(eleObj);
				}
			});

	$(divId + ' input[name="phone"]').keydown(
			function(e) {
				checkIfNumber(e);

				if ($(this).val().length == 3 || $(this).val().length == 7) {
					$(this).val($(this).val() + "-");
				}
			});

}

function showValdationError(eleObj, msg) {
	hideValidationError(eleObj);
	eleObj.parent().parent().find('#error_div').text(msg);
	eleObj.parent().parent().find('#error_div').addClass('ui-state-error');
	eleObj.parent().parent().find('#error_div').show();
}

function hideValidationError(eleObj) {
	eleObj.parent().parent().find('#error_div').removeClass('ui-state-error');
	eleObj.parent().parent().find('#error_div').text("");
	eleObj.parent().parent().find('#error_div').hide();
	eleObj.parent().parent().find('#error_div').show();
}

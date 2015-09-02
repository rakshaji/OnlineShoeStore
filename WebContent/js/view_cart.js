/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #3								  ###
#################################################
 */

$(document)
		.ready(
				function() {
					$('#right_wrapper2').hide();
					$('#left_wrapper2').hide();
					
					initPageContentByCartSize();
					
					initQuantitySpinner();
					
					addListenerToImages();
					
					addListenerToButtons();

					updateQuantity();
					
					// update subtotal for all items
					$('div#view_cart_item').each(function() {
						updateSubtotalOnload($(this));
					});
					
				});

function addListenerToButtons() {
	
	$("button[name='deleteall']").click(function(){
		cart.removeAll();
		updateCartDisplay();
		updateTotal();
		
		initPageContentByCartSize();
	});
	
	jQuery.each($("button[name='delete']"), function() {
		$(this).click(function() {
			var sku = $(this).parent().parent().parent().find('.sku').text();
			sku = getSKU(sku);
			
			$(this).parent().parent().parent().parent().remove();
			cart.remove(sku);
			updateCartDisplay();
			updateTotal();
			
			initPageContentByCartSize();
		});
	});
	
	$('.checkout_btn')
	.click(
			function() {
				var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=checkout';
				$('form#search_form').attr('action',
						url);
				$('form#search_form').submit();
			});

	$('.continue_btn')
	.click(
		function() {
			var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product';
			$('form#search_form').attr('action',
					url);
			$('form#search_form').submit();
		});
}

function addListenerToImages() {
	jQuery.each($("img#product_medium_image"), function() {
		$(this).click(function() {
			var sku = $(this).parent().find('.sku').text();
			sku = getSKU(sku);
			
			var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&sku='+sku;
			$('form#search_form').attr('action',
					url);
			$('form#search_form').submit();
		});
	});
}

function initQuantitySpinner(){
	// add listener to handle value overflow $(function() {
	jQuery.each($("input[id='spinner']"), function() {
		var parent = $(this).closest('#view_cart_item');
		
		$(this).spinner({
			spin : function(event, ui) {
				var maxVal = $(this).attr("name");
				if (ui.value > maxVal) {
					$(this).spinner("value", 1);
					updateSubtotal(parent);
					return false;
				} else if (ui.value < 1) {
					$(this).spinner("value", maxVal);
					updateSubtotal(parent);
					return false;
				}
				$(this).spinner("value", ui.value);
				updateSubtotal(parent);
			}
		});
	});
	
}

function updateQuantity() {
	jQuery.each($("input[id='spinner']"), function() {
		var parent = $(this).closest('#view_cart_item');
		var sku = parent.find('.sku').text();
		sku = getSKU(sku);
		var quantity = cart.getQuantity(sku);
		var on_hand = $(this).attr("name");
		if(on_hand < quantity){
			quantity = on_hand;
			cart.setQuantity({sku:sku, quantity:quantity});
			updateCartDisplay();
		}
		
		var spinner = $(this).closest('#view_cart_item').find('#spinner')
			.spinner();
		spinner.spinner("value", parseInt(quantity));
	});
	
}

function getSKU(sku) {
	sku = $.trim(sku.substring(sku.lastIndexOf('-')-3, 
			sku.lastIndexOf('-')+4));
	return sku;
}

function updateSubtotal(parent) {
	var sku = parent.find('.sku').text();
	sku = getSKU(sku);
	
	var subtotalObj = parent.find('#item_price_total');
	var qty = parent.find('#spinner');
	qty = qty.spinner("value");
	cart.setQuantity({sku: sku, quantity: parseInt(qty) });
	
	updateCartDisplay();
	
	var subtotal = cart.getSubtotal(sku);
	subtotalObj.html("$"+subtotal);
	
	updateTotal();
}


function updateSubtotalOnload(parent) {
	var sku = parent.find('.sku').text();
	sku = getSKU(sku);
	
	var subtotalObj = parent.find('#item_price_total');
	var subtotal = cart.getSubtotal(sku);
	subtotalObj.html("$"+subtotal);
	
	updateTotal();
}

function updateTotal() {
	$('.total').html("$"+cart.getTotal());
	$('.totalAfterTax').html("$"+cart.getTotalAfterTax());
	$('.salesTax').html("$"+cart.getTaxAmount());
}

function initPageContentByCartSize() {
	if(cart.size() > 0){
		$('#right_wrapper2').show();
		$('#left_wrapper2').show();
	} else {
		$('#success_div').text("There are no products in your shopping cart.");
		$('#success_div').addClass('ui-state-error').show();
		$('#right_wrapper2').remove();
		$('#left_wrapper2').remove();
	}
}
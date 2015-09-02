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
					addCssToLeftCriteriaDivs();

					addClickListenerToAllProducts();

					changeStatusColorOnLoad();

					addClickListenerToAddToCartButton();

					addMouseInOutListenerToProduct();

					// by default hide the add to cart button and message divs for all products
					$(".addToCartHover").hide();
					$("#msg_div").hide();
					
				});

function addMouseInOutListenerToProduct() {
	// show add to cart button on hover
	$(".product_wrapper").on("mouseenter", function() {
		$(this).find("#add_to_cart_btn").show();
	}).on("mouseleave", function() {
		$(this).find("#add_to_cart_btn").hide();
	});
}

function addCssToLeftCriteriaDivs() {
	// add css to the left selection list divs
	$(".portlet")
			.addClass(
					"ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
			.find(".portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend(
					"<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

	// add collapse and reopen functionality to plus mius icons
	$(".portlet-toggle")
			.click(
					function() {
						var icon = $(this);
						icon
								.toggleClass("ui-icon-minusthick ui-icon-plusthick");
						icon.closest(".portlet").find(
								".portlet-content").toggle();
					});

	// remove +/- buttons for 'Your selection' section on left 
	$("div#user_selection_div .portlet-header span").remove();
}

function changeStatusColorOnLoad() {
	// update color depending on availiablity status in all
	// products page
	$('.product_detail_status').each(function() {
		var quantity = $(this).attr("id");
		var parent = $(this).parent().parent();

		$(this).removeClass('product_detail_status');
		updateStatusColor($(this), quantity, parent);

	});

	// update color depending on availiablity status in an
	// individual product page
	$('.detail_status').each(function() {
		var quantity = $(this).attr("id");
		var parent = $(this).parent();
		$(this).css("margin-left", "5%");
		updateStatusColor($(this), quantity, parent);
	});
}

function addClickListenerToAddToCartButton() {
	// add click listener to each add to cart button of each
	// product in product detail page 
	$(".add_to_cart_btn_div").click(
			function() {
				var sku = $(this).attr("name");
				var imageName = $("#product_full_image").attr(
						"src");
				var model = $(this).parent().find(
						'[name="model"]').text();
				var price = $('#dtl_price').text();
				price = $.trim(price);
				price = (price.charAt(0) === '$') ? price.substr(1)
						: price;
				var parent = $(this).parent();
				
				checkQuantityFromDatabase(parent, sku, model, 1, imageName, price);
				return false;
			});
	
	// add click listener to each add to cart button of each
	// product in multi-product page
	jQuery.each($(".product_wrapper"), function() {
		var sku = $(this).attr("id");
		var parent = $(this);

		$(this).find("#add_to_cart_btn").click(
				function() {
					var imageName = parent.find(
							"#product_image").attr("src");
					var model = parent.find('#product_model')
							.text().split(":")[1];
					var price = parent.find(
							'.product_detail_price').text()
							.split(":")[1];
					price = $.trim(price);
					price = (price.charAt(0) === '$') ? price
							.substr(1) : price;
					checkQuantityFromDatabase(parent, sku, model, 1, imageName, price);
					
					return false;
				});
	});
}

function checkQuantityFromDatabase(parent, sku, model, quantity, imageName, price) {
	// check if quantity is sufficient for the request
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=check_onhand&sku='+sku+'&quantity='+(parseInt(cart.getQuantity(sku))+1),
			function(response){
		var msg = "Item added to cart.";
		if(response.trim() === "Insufficient quantity"){
			msg = "Item cannot be added. You have requested more than the quantity available in stock.";
			showErrorConfirmation(parent.find('#msg_div'), msg, true);
		}
		if(response.trim() === "Error"){
			msg = "Item cannot be added due to server error. Please retry.";
			showErrorConfirmation(parent.find('#msg_div'), msg, true);
		}
		if(response.trim() === "OK"){
			addToCart(sku, $.trim(model), quantity, imageName, $.trim(price));
			showSuccessConfirmation(parent.find('#msg_div'), msg, true);
		}
		
		return false;
	});
}

function showSuccessConfirmation(eleObj, msg, enableEffect) {
	eleObj.removeClass("ui-state-error");
	eleObj.addClass("ui-state-success");
	eleObj.text(msg);
	eleObj.show("clip", {}, 500, function() {
		setTimeout(function() {
			if(enableEffect){
				eleObj.removeAttr("style").fadeOut();
			} else {
				eleObj.removeAttr("style");
			}
		}, 1000);
	});
}

function showErrorConfirmation(eleObj, msg, enableEffect) {
	eleObj.removeClass("ui-state-success");
	eleObj.addClass("ui-state-error");
	eleObj.text(msg);
	eleObj.show("clip", {}, 500, function() {
		setTimeout(function() {
			if(enableEffect){
				eleObj.removeAttr("style").fadeOut();
			} else {
				eleObj.removeAttr("style");
			}
		}, 4000);
	});
}

function addToCart(sku, model, quantity, imageName, price) {
	var item = {
		sku : $.trim(sku),
		model : $.trim(model),
		quantity : parseInt($.trim(quantity)),
		image : $.trim(getImageName(imageName)),
		price : parseFloat($.trim(price)),
		subtotal : parseFloat($.trim(quantity)) * parseFloat($.trim(price))
	};
	cart.add(item);

	updateCartDisplay();
}

function getImageName(url) {
	var index = url.lastIndexOf("/") + 1;
	var filename = url.substr(index);
	return filename;
}

function updateStatusColor(element, quantity, parent) {
	if (quantity === "null") {
		parent.find('#add_to_cart_btn').prop('disabled', true);

		element.addClass('product_detail_status_orange');
	} else if (quantity === "0") {
		parent.find('#add_to_cart_btn').prop('disabled', true);

		element.addClass('product_detail_status_red');
	} else {
		element.addClass('product_detail_status_green');
	}
}

function addClickListenerToAllProducts() {
	$('.product_wrapper')
			.click(
					function() {
						var product = $(this);
						var id = product.attr("id");

						var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&sku='
								+ id;
						$('form#search_form').attr('action', url);
						$('form#search_form').submit();
					});
}
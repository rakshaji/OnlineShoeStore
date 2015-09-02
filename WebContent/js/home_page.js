/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #3								  ###
#################################################
 */

var requested_category;
var requested_vendor;
var requested_price;
var requested_sort;
var cart = new shopping_cart("jadrn036");

$(document).ready(function() {
	requested_category = $('[name="category"]').val();
	requested_vendor = $('[name="vendor"]').val();
	requested_price = $('[name="price"]').val();
	requested_sort = $('[name="sort"]').val();

	initMenuItems();

	initSubMenuItems();

	initSearch();

	initPriceCriteria();

	initSorting();

	// by default focus on search
	$('#search_input').focus();

});

function initSorting() {
	$('#sort_filter_combo').change(function() {
		if (getSortCriteria() === "") {
			return;
		}

		fetchProductsUponUserSelection();
	});

	if (requested_sort != "null") {
		$('#sort_filter_combo').val(requested_sort);
	}
}

function loadShoppingCart() {
	// show cart item count
	updateCartDisplay();

	jQuery.each($("div#mini_cart_item"), function() {
								$(this).click(function() {
								var imageURL = $(this).find(
										"#product_mini_image")
										.attr('src');
								var imageName = getImageName(imageURL);
								var sku = $.trim(imageName
										.substring(0, imageName
												.indexOf('.')));
								sku = sku.toUpperCase();

								var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&sku='
										+ sku;
								$('form#search_form').attr(
										'action', url);
								$('form#search_form').submit();
							});
	});
}

function initSearch() {
	$('#search_btn')
			.click(
					function() {
						var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&search='
								+ $('#search_input').val();

						$('form#search_form').attr('action', url);
						$('form#search_form').submit();
					});
}

function initPriceCriteria() {
	$('#go').on('click', function(event) {
		if (getPriceCriteria() === "") {
			return;
		}

		fetchProductsUponUserSelection();
	});

	if (requested_price != "null" && requested_price != undefined) {
		updateUserSelection("price");
	}
}

function initSubMenuItems() {
	// load vendors
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/FetchVendorList',
			handleVendor);

	// load categories
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/FetchCategoryList',
			handleCategory);

	loadShoppingCart();
}

function initMenuItems() {
	// default hide submenu-items section
	$('#shoes_categories').hide();
	$('#shopping_cart_items').hide();

	$('#shoes_menu').hover(function() {
		$('#shoes_categories').show();
	}, function() {
		$('#shoes_categories').hide();
	});

	// add hover effects and behaviour on menu items
	$('#shoes_categories').hover(function() {
		$('#shoes_categories').show();
		$('#shoes_menu').addClass('menu_item_red');
	}, function() {
		$('#shoes_categories').hide();
		$('#shoes_menu').removeClass('menu_item_red');
	});

	$('#shopping_cart').hover(function() {
		$('#shopping_cart_items').show();
	}, function() {
		$('#shopping_cart_items').hide();
	});

	$('#shopping_cart_items').hover(function() {
		$('#shopping_cart_items').show();
		$('#shopping_cart').addClass('menu_item_red');
	}, function() {
		$('#shopping_cart_items').hide();
		$('#shopping_cart').removeClass('menu_item_red');
	});

	// add listeners to shopping cart menu and view cart button
	$('#shopping_cart')
			.click(
					function() {
						var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=cart';

						$('form#search_form').attr('action', url);
						$('form#search_form').submit();
					});

	$('#view_cart_btn')
			.click(
					function() {
						var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=cart';

						$('form#search_form').attr('action', url);
						$('form#search_form').submit();
					});

}

function updateCartDisplay() {
	// rebuild cart items in shopping cart
	var cartArray = cart.getCartArray();
	$('#all_cart_items').empty();
	for (i = 0; i < cartArray.length; i++) {
		$('#all_cart_items')
				.append(
						'<div id="mini_cart_item" >'
								+ '<img id="product_mini_image" src="/~jadrn036/proj1/tabs/_p_images/'
								+ cartArray[i].image + '" />'
								+ '<div id="prod_info" >'
								+ '<p id="mini_detail_label" >Manufacturer:'
								+ cartArray[i].model + '</p>'
								+ '<p id="mini_detail_label" >Quantity:'
								+ cartArray[i].quantity + '</p>' + '</div>'
								+ '</div>');
		$("div#mini_cart_item:last")
				.click(
						function() {
							var imageURL = $(this).find("#product_mini_image")
									.attr('src');
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
	// update the cart item count
	$('#count').text(cart.size());

	// add effects
	var options = {};
	$("#count").effect("bounce", options, 500, callback);
	$("#shopping_cart").effect("highlight", {
		backgroundColor : "#aa0000"
	}, 500, callback);
}

function callback() {

};

function handleVendor(response) {
	var items = response.split('||');

	var shopByVendorHandle = $('div#sub-menu_shop_by_vendor');
	populateSubMenuItems(items, shopByVendorHandle, 'vendor');

	var filterVendorHandle = $('div#brands_options_div ul#checkbox');
	populateFilterListItems(items, filterVendorHandle, 'vendor');
}

function handleCategory(response) {
	var items = response.split('||');

	var shopByCategoryHandle = $('div#sub-menu_shop_by_category');
	populateSubMenuItems(items, shopByCategoryHandle, 'category');

	var filterCategoryHandle = $('div#category_options_div ul#checkbox');
	populateFilterListItems(items, filterCategoryHandle, 'category');
}

function populateSubMenuItems(items, eleObj, type) {
	for (i = 0; i < items.length; i++) {
		var pairs = items[i].split('=');
		eleObj.find('p:last').after('<p></p>');
		eleObj.find('p:last').append(
				'<label class="sub-menu_item" id="' + type + '_' + pairs[0]
						+ '">' + pairs[1] + '</label>');
		eleObj.find('p:last label').on('click', function(event) {
			submenuClickListener(event);
		});
	}
}

function populateFilterListItems(items, eleObj, type) {
	var selections;
	if (type === 'category') {
		selections = (requested_category != "null" && requested_category != undefined) ? requested_category
				.split(',')
				: "";
	} else {
		selections = (requested_vendor != "null" && requested_vendor != undefined) ? requested_vendor
				.split(',')
				: "";
	}

	// categories or vendor list "id=name" pair eg. 1=Nike
	for (var i = 0; i < items.length; i++) {
		var pairs = items[i].split('=');
		var key = pairs[0];
		var value = pairs[1];

		// unchecked
		eleObj.append('<li class="checkbox_item"><input type="checkbox" id="'
				+ type + '_' + key + '_' + value + '"><a class="list-item">'
				+ value + '</a></li>');

		eleObj.find('li:last').on('click', function(event) {
			checkboxClickListener(event);
		});
	}

	if (selections.length > 0) {
		for (var cnt = 0; cnt < selections.length; cnt++) {
			var selectedValue = selections[cnt];

			for (var i = 0; i < items.length; i++) {
				var pairs = items[i].split('=');
				var key = pairs[0];
				var value = pairs[1];

				if (key === selectedValue) {
					var newId = type + '_' + key + '_' + value;
					markCheckbox(newId, true);

					updateUserSelection(newId);
					break;
				}
			}
		}
	}
}

function checkboxClickListener(event) {
	var eleObj = event.target;
	var id = eleObj.getAttribute('id');
	updateUserSelection(id);
	fetchProductsUponUserSelection();
}

function updateUserSelection(checkedElementId) {
	var id = checkedElementId;
	if (id != null) {

		var value;
		if (checkedElementId === "price") {
			var data = (requested_price != "null" && requested_price != undefined) ? requested_price
					.split(',')
					: "";
			var min = data[0];
			var max = data[1];
			value = "Price Range: " + min;

			if (data[1] === "10000") {
				value += " & above";
			} else {
				value += " to " + max;
			}

		} else {
			var data = id.split('_');
			value = data[2];// selected product or brand name
		}

		if ($('span[id="' + id + '"]').length) {
			// if exist, delete from list
			deleteFromUserSelectionList(id);
			markCheckbox(id, false);
		} else {
			// else add to the list
			addToUserSelectionList(value, id);
		}
	}
}

function markCheckbox(id, flag) {
	var checkbox = $('input[id="' + id + '"]');
	if (checkbox.length)
		checkbox.prop('checked', flag);
}

function deleteFromUserSelectionList(id) {
	$('span[id="' + id + '"]').parent().parent().remove();
	if (id === "price") {
		$('[name="price"]').attr("value", "");
		requested_price = "";
	}
}

function addToUserSelectionList(value, id) {
	$('div#user_selection_div ul#checkbox')
			.append(
					'<li class="user_selection_item"><div class="selected-item">'
							+ value
							+ '<span class="ui-icon ui-icon-closethick delete-selected-item" id="'
							+ id + '"></span></div></li>');

	$('div#user_selection_div span:last').on('click', function(event) {
		checkboxClickListener(event);
	});
}

function fetchProductsUponUserSelection() {
	// find user selections
	var catStr = "&category=";
	var venStr = "&vendor=";
	var checkboxes = $("input:checked");
	for (var cnt = 0; cnt < checkboxes.length; cnt++) {
		var id = checkboxes[cnt].getAttribute('id');
		var data = id.split('_');
		if (data[0] === 'category') {
			catStr = catStr + data[1] + ",";
		} else {
			venStr = venStr + data[1] + ",";
		}
	}

	var priceStr = getPriceCriteria();
	var sortStr = getSortCriteria();

	// remove last comma
	var lastCommaIndex = catStr.lastIndexOf(",");
	catStr = (lastCommaIndex != -1) ? catStr.substring(0, lastCommaIndex) : "";

	lastCommaIndex = venStr.lastIndexOf(",");
	venStr = (lastCommaIndex != -1) ? venStr.substring(0, lastCommaIndex) : "";

	// fetch only the products
	var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product'
			+ catStr + venStr + priceStr + sortStr;

	$('form#search_form').attr('action', url);
	$('form#search_form').submit();

}

function getSortCriteria() {
	var val = $('#sort_filter_combo').val();
	var sortStr = "&sort=";

	if (val === "") {
		sortStr = "";
	} else {
		sortStr += val;
	}

	return sortStr;
}

function getPriceCriteria() {
	var priceStr = "&price=";
	var min = $('#minimumAmount').val();
	var max = $('#maximumAmount').val();

	if (min === "" && max === "") {
		if (requested_price != "null" && requested_price != "") {
			priceStr += requested_price;
		} else {
			priceStr = "";
		}
	} else {
		if (min === "") {
			priceStr += "0," + max;
		}
		if (max === "") {
			priceStr += min + ",10000";
		} else {
			priceStr += min + "," + max;
		}
	}
	return priceStr;
}

function submenuClickListener(event) {
	var eleObj = event.target;
	var id = eleObj.getAttribute('id');

	var url = 'http://jadran.sdsu.edu/jadrn036/servlet/Dispatcher?request_type=product&';

	var data = id.split('_');
	url = url + data[0] + "=" + data[1];

	$('form#search_form').attr('action', url);
	$('form#search_form').submit();
}

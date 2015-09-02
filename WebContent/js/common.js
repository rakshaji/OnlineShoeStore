/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/
$(document).ready( function() {
	
	// load vendors
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/GetVendorList',
					handleVendor);

	// load categories
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/GetCategoryList',
					handleCategory);

	// load on hand stock
	$.get('http://jadran.sdsu.edu/jadrn036/servlet/FetchAvailableStock',
			function(response){
				handleLoadOnHandStock(response, 1);
				handleLoadOnHandStock(response, 2);
			}
	);

	addValidation(1);
	addValidation(2);

	addListeners(1);
	addListeners(2);

});

function clearTableFilter(tabNumber) {
	$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr").removeClass('hide');
	$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr").removeClass('click_highlight');
	$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr").removeAttr("id");
}

function isSearchError(tabNumber) {
	var isError = $('div#tabs-'+tabNumber+' #search_msg').hasClass("ui-state-error");

	return isError;
}

function handleHistoryData(response, tabNumber) {
	$('div#tabs-'+tabNumber+' #history tbody').text("");

	if (response.trim() === "Error") {
		// no records
		return;
	}

	var items = response.split('||');
	for (i = 0; i < items.length; i++) {
		var itemPairs = items[i].split(',');
		$('div#tabs-'+tabNumber+' #history tbody').append("<tr></tr>");

		for (j = 0; j < itemPairs.length; j++) {
			var pairs = itemPairs[j].split('=');
			$('div#tabs-'+tabNumber+' #history tr:last').append(
					'<td id="' + pairs[0] + '">' + pairs[1] + '</td>');
		}
	}
}
function populateOptions(items, handle, firstOptionText) {
	handle.append($('<option value="0">'+firstOptionText+'</option>'));
	for(i=0; i < items.length; i++) {
		var pairs = items[i].split('=');     
		handle.append($('<option value='+pairs[0]+'>'+pairs[1]+'</option>'));  
	}
}

function showRestockConfirmation(msg, tabNumber) {
	$('div#tabs-'+tabNumber+' #restock_msg').removeClass("ui-state-error");
	$('div#tabs-'+tabNumber+' #restock_msg').addClass("ui-state-success");
	$('div#tabs-'+tabNumber+' #restock_msg').text(msg);
}

function handleVendor(response) {
	var items = response.split('||');
	var firstOptionText = 'Select';

	var vendorHandle = $('div#tabs-1 form#search_form').find('[name="vendor"]');
	populateOptions(items, vendorHandle, firstOptionText);
	
	vendorHandle = $('div#tabs-2 form#search_form').find('[name="vendor"]');
	populateOptions(items, vendorHandle, firstOptionText);
}

function handleCategory(response) {
	var items = response.split('||');
	var firstOptionText = 'Select';
	
	var categoryHandle = $('div#tabs-1 form#search_form').find('[name="category"]');
	populateOptions(items, categoryHandle, firstOptionText);
	
	categoryHandle = $('div#tabs-2 form#search_form').find('[name="category"]');
	populateOptions(items, categoryHandle, firstOptionText);
}

function clearSearchError(tabNumber) {
	$('div#tabs-'+tabNumber+' #search_msg').removeClass("ui-state-error");
	$('div#tabs-'+tabNumber+' #search_msg').text("Find a product by using Search");
}

function showSearchError(msg, tabNumber) {
	$('div#tabs-'+tabNumber+' #search_msg').addClass("ui-state-error");
	$('div#tabs-'+tabNumber+' #search_msg').text(msg);
}

function clearRestockError(tabNumber) {
	$('div#tabs-'+tabNumber+' #restock_msg').removeClass("ui-state-success");
	$('div#tabs-'+tabNumber+' #restock_msg').removeClass("ui-state-error");
	$('div#tabs-'+tabNumber+' #restock_msg').text("All fields are required.");
}

function showRestockError(msg, tabNumber) {
	$('div#tabs-'+tabNumber+' #restock_msg').removeClass("ui-state-success");
	$('div#tabs-'+tabNumber+' #restock_msg').addClass("ui-state-error");
	$('div#tabs-'+tabNumber+' #restock_msg').text(msg);
}


function handleSearchData(response, sku, isRowClicked, tabNumber) {
	if (response.trim() === "Error") {
		showSearchError("No results found for given criteria.", tabNumber);
		return;
	}

	clearRestockError(tabNumber);

	var url = "";
	if(tabNumber == 1) {
		// fetch history
		url = "http://jadran.sdsu.edu/jadrn036/servlet/FetchRestockHistory";
		url += "?sku=" + sku;
	} else {
		// fetch history
		url = "http://jadran.sdsu.edu/jadrn036/servlet/FetchStockOutHistory";
		url += "?sku=" + sku;
	}
	
	var req = new HttpRequest(url, function(response) {
		// on session timeout, load the page sent through callback
		if(response.match(/<?xml/g)){
			document.open();
			document.write(response);
			document.close();
			return;
		}
		
		handleHistoryData(response, tabNumber);
	});
	req.send();
	
	var items = response.split('||');

	if (items.length == 1) {
		$('div#tabs-'+tabNumber+' form#restock_form table#details').find("td#sku").text(sku);

		var itemPairs = items[0].split(',');
		for (j = 0; j < itemPairs.length; j++) {
			var pairs = itemPairs[j].split('=');

			// populate UI
			if (pairs[0] === "image") {
				$('div#tabs-'+tabNumber+' form#restock_form table#details').find("td#" + pairs[0]).text("");
				$('div#tabs-'+tabNumber+' form#restock_form table#details').find("td#" + pairs[0]).append(
						'<img id="product_image" src="'
								+ "/~jadrn036/proj1/tabs/_p_images/" + pairs[1]
								+ '" />');
			} else {
				$('div#tabs-'+tabNumber+' form#restock_form table#details').find("td#" + pairs[0]).text(pairs[1]);
			}
		}

		if(isRowClicked){
			$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr td#sku").each(function() {
				if ($(this).text() === sku) {
					$(this).parent().attr("id", "selected");
				} else {
					$(this).parent().removeAttr("id");
				}
			});	
		} else {
			clearTableFilter(tabNumber);
			$('div#tabs-'+tabNumber+' h3#dynamic_header').text("Filtered Stock");

			$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr td#sku").each(function() {
				if ($(this).text() === sku) {
					$(this).parent().removeClass('hide');
					$(this).parent().addClass('click_highlight');
					$(this).parent().attr("id", "selected");
				} else {
					$(this).parent().addClass('hide');
					$(this).parent().removeAttr("id");
				}
			});	
		}
	} else {
		clearTableFilter(tabNumber);
		$('div#tabs-'+tabNumber+' h3#dynamic_header').text("Filtered Stock");

		for (i = 0; i < items.length; i++) {
			var itemPairs = items[i].split(',');

			var skuPair = itemPairs[0].split('=');
			$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr td#sku").each(
					function() {
						if ($(this).text() === skuPair[1]) {
							$(this).parent().attr("id", "selected");
						}
					});
		}

		$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find("tr").not('#selected')
				.addClass('hide');
	}
}

function searchProduct(tabNumber) {
	clearSearchError(tabNumber);

	var sku = $('div#tabs-'+tabNumber+' form#search_form').find('[name="sku"]').val();
	var category = $('div#tabs-'+tabNumber+' form#search_form').find('[name="category"]').val();
	var vendor = $('div#tabs-'+tabNumber+' form#search_form').find('[name="vendor"]').val();
	var manufacturer = $('div#tabs-'+tabNumber+' form#search_form').find('[name="manufacturer"]').val();

	if (category === "0") {
		category = "";
	}
	if (vendor === "0") {
		vendor = "";
	}

	sendFetchProductRequest(sku, category, vendor, manufacturer, false, tabNumber);
}

function sendFetchProductRequest(sku, category, vendor, manufacturer, isRowClicked, tabNumber) {
	var url = "http://jadran.sdsu.edu/jadrn036/servlet/SearchProduct";
	url += "?category=" + category + "&sku=" + sku + "&vendor=" + vendor
			+ "&manufacturer=" + manufacturer;

	var req = new HttpRequest(url, function(response) {
		// on session timeout, load the page sent through callback
		if(response.match(/<?xml/g)){
			document.open();
			document.write(response);
			document.close();
			return;
		}
		
		handleSearchData(response, sku, isRowClicked, tabNumber);
	});
	req.send();
}


function sendInventoryData(tabNumber) {
	var sku = $('div#tabs-'+tabNumber+' form#restock_form table#details').find('td#sku').text();
	var date = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_date"]').val();
	var quantity = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_quantity"]').val();
	quantity = parseInt(quantity);

	if (date === "" || quantity === "") {
		showRestockError("All fields are required.", tabNumber);
		return;
	}
	var url = "";

	if(tabNumber == 1){
		url = "http://jadran.sdsu.edu/jadrn036/servlet/InventoryIn";
		url += "?sku=" + sku + "&date=" + date + "&quantity=" + quantity;
		
		var req = new HttpRequest(url, function(response){
			// on session timeout, load the page sent through callback
			if(response.match(/<?xml/g)){
				document.open();
				document.write(response);
				document.close();
				return;
			}
			
			handleSaveData(response, 1);
		});
		req.send();
	} else {
		url = "http://jadran.sdsu.edu/jadrn036/servlet/InventoryOut";
		url += "?sku=" + sku + "&date=" + date + "&quantity=" + quantity;
		
		var req = new HttpRequest(url, function(response){
				// on session timeout, load the page sent through callback
				if(response.match(/<?xml/g)){
					document.open();
					document.write(response);
					document.close();
					return;
				}
				handleSaveData(response, 2); 
			});
		req.send();
	}
}


function addValidation(tabNumber) {
	var sku = $('div#tabs-'+tabNumber+' form#search_form').find('[name="sku"]');
	var manufacturer = $('div#tabs-'+tabNumber+' form#search_form').find('[name="manufacturer"]');
	var category = $('div#tabs-'+tabNumber+' form#search_form').find('[name="category"]');
	var vendor = $('div#tabs-'+tabNumber+' form#search_form').find('[name="vendor"]');
	
	var quantity =  $('div#tabs-'+tabNumber+' form#restock_form [name="restock_quantity"]');
	var date = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_date"]');
	
	date.on('blur', function(){
		if(date.val().trim() === ""){
			return;
		}
		if(!isDate(date.val())){
			showRestockError("Please enter date in format MM/DD/YYYY.", tabNumber);
			return;
		}
	});
	
	date.on('focus', function(){
		clearRestockError(tabNumber);
	});
	
	quantity.on('focus', function(){
		clearRestockError(tabNumber);
	});
	
	quantity.on('blur', function(){
		var value = quantity.val();
		if(value != "" && parseInt(value) == 0){
			showRestockError("Quantity should be greater than zero.", tabNumber);
		}
	});
	
	// validate SKU#
	sku.on('blur',function() {
		if (isValidSKUFormat(sku)) {
			clearSearchError(tabNumber);
		} else {
			showSearchError("Please enter SKU in format: ABC-123", tabNumber);
		}

	});
	
	// Source : http://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
	quantity.keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function addListeners(tabNumber){
	var sku = $('div#tabs-'+tabNumber+' form#search_form').find('[name="sku"]');
	var manufacturer = $('div#tabs-'+tabNumber+' form#search_form').find('[name="manufacturer"]');
	var category = $('div#tabs-'+tabNumber+' form#search_form').find('[name="category"]');
	var vendor = $('div#tabs-'+tabNumber+' form#search_form').find('[name="vendor"]');
	var quantity =  $('div#tabs-'+tabNumber+' form#restock_form [name="restock_quantity"]');
	var searchBtn = $('div#tabs-'+tabNumber+' form#search_form [name="search"]');
	var searchResetBtn = $('div#tabs-'+tabNumber+' form#search_form [name="search_reset"]');
	var resetBtn = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_reset"]');
	
	var saveBtn = $('div#tabs-'+tabNumber+' form#restock_form [name="restock"]');
	
	var progress = $('#busyDiv');
	var logout = $('form#welcome_form #logout');

	logout.on('click', function() {
		$('form#welcome_form').submit();
	});

	searchBtn.on('click', function() {
		if (sku.val() === "" && category.val() == 0
				&& vendor.val() == 0
				&& manufacturer.val() === "") {
			showSearchError("Please enter a search criteria.", tabNumber);
			return;
		}

		if (!isValidSKUFormat(sku)) {
			showSearchError('Please enter SKU in format: ABC-123', tabNumber);
			return;
		}

		searchProduct(tabNumber);
	});
	
	sku.keypress(function(e){
        if(e.which == 13){//Enter key pressed
        	searchBtn.click();
        }
    });
	
	manufacturer.keypress(function(e){
        if(e.which == 13){//Enter key pressed
        	searchBtn.click();
        }
    });

	searchResetBtn.on('click', function() {
		clearSearchError(tabNumber);
		clearTableFilter(tabNumber);
		$('div#tabs-'+tabNumber+' h3#dynamic_header').text("All Stocks");
		sku.focus();
	});

	// add click listener to the reset button
	resetBtn.on('click', function() {
		clearRestockError(tabNumber);
		
		// move focus to the first field
		$('div#tabs-'+tabNumber+' form#restock_form [name="restock_quantity"]').focus();
	});

	// add click listener to the save button
	saveBtn.on('click', function() {
		var skuToRestock = $('div#tabs-'+tabNumber+' form#restock_form table#details').find(
				"td#sku").text();
		if (skuToRestock === "") {
			showRestockError("Please select a product.", tabNumber);
			return;
		}
		
		var value = quantity.val();
		if(value != "" && parseInt(value) == 0){
			showRestockError("Quantity should be greater than zero.", tabNumber);
			return;
		}

		clearRestockError(tabNumber);
		sendInventoryData(tabNumber);
		return true;
	});

	// reset the page on load
	searchResetBtn.click();
	
	resetBtn.click();

	// move focus to the first field
	sku.focus();
	
}

function updateAvailableStock(sku, quantity, tabNumber) {
	
	$('div#tabs-1 [name="stock_available"] tbody tr td#sku').each(function(){
		
		if($(this).html() === sku) {
			var old_quantity = $(this).next().html();
			var new_quantity;
			
			if(tabNumber == 1){
				new_quantity = parseInt(old_quantity) + parseInt(quantity);
			}else{
				new_quantity = parseInt(old_quantity) - parseInt(quantity);
			}
			
			$(this).next().html(""+new_quantity);
			return false;
		}
	});
	
	$('div#tabs-2 [name="stock_available"] tbody tr td#sku').each(function(){
		
		if($(this).html() === sku) {
			var old_quantity = $(this).next().html();
			var new_quantity;
			
			if(tabNumber == 1){
				new_quantity = parseInt(old_quantity) + parseInt(quantity);
			}else{
				new_quantity = parseInt(old_quantity) - parseInt(quantity);
			}
			
			$(this).next().html(""+new_quantity);
			return false;
		}
	});
}


function handleSaveData(response, tabNumber) {
	if (response === "Error") {
		showRestockError("Failed to save data. Please check the data and retry.", tabNumber)
		return;
	}
	if (response === "Insufficient quantity") {
		showRestockError("Not enough stock available for this operation.", tabNumber)
		return;
	}

	var sku = $('div#tabs-'+tabNumber+' form#restock_form table#details').find('td#sku').text();
	var date = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_date"]').val();
	var quantity = $('div#tabs-'+tabNumber+' form#restock_form [name="restock_quantity"]').val();
	quantity = parseInt(quantity);

	$('div#tabs-'+tabNumber+'  #history tr:last').after('<tr></tr>');
	$('div#tabs-'+tabNumber+'  #history tr:last').append('<td id="sku">' + sku + '</td>');
	$('div#tabs-'+tabNumber+'  #history tr:last').append('<td id="quantity">' + quantity + '</td>');
	$('div#tabs-'+tabNumber+'  #history tr:last').append('<td id="date">' + date + '</td>');

	updateAvailableStock(sku, quantity, tabNumber);
	
	// reset the page
	$('div#tabs-'+tabNumber+' form#restock_form [name="restock_reset"]').click();

	showRestockConfirmation(response, tabNumber);
}

function handleLoadOnHandStock(response, tabNumber) {
	var items = response.split('||');
	
	for (i = 0; i < items.length; i++) {
		var itemPairs = items[i].split(',');
		$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').append("<tr></tr>");

		for (j = 0; j < itemPairs.length; j++) {
			var pairs = itemPairs[j].split('=');
			$('div#tabs-'+tabNumber+' [name="stock_available"] tr:last').append(
					'<td id="' + pairs[0] + '">' + pairs[1] + '</td>');
		}
	}

	$('div#tabs-'+tabNumber+' [name="stock_available"] tbody tr').on(
			'click',
			function() {
				$('div#tabs-'+tabNumber+' [name="stock_available"] tbody').find('tr').removeClass(
						'click_highlight');
				$(this).addClass('click_highlight');
				sendFetchProductRequest($(this).find('td#sku').html(), "", "", "", true, tabNumber);
			});

	$('div#tabs-'+tabNumber+' [name="stock_available"] tbody tr').hover(function() {
			$(this).addClass('highlight');
		}, function() {
			$(this).removeClass('highlight');
	});
}

/* Source: http://www.jquerybyexample.net/2011/12/validate-date-using-jquery.html */
function isDate(txtDate) {
	var currVal = txtDate;
	if (currVal == '')
		return false;
	// Declare Regex
	var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	var dtArray = currVal.match(rxDatePattern); // is format OK?
	if (dtArray == null)
		return false;
	// Checks for mm/dd/yyyy format.
	dtMonth = dtArray[1];
	dtDay = dtArray[3];
	dtYear = dtArray[5];
	if (dtMonth < 1 || dtMonth > 12)
		return false;
	else if (dtDay < 1 || dtDay > 31)
		return false;
	else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11)
			&& dtDay == 31)
		return false;
	else if (dtMonth == 2) {
		var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
		if (dtDay > 29 || (dtDay == 29 && !isleap))
			return false;
	}
	return true;
}

function isValidSKUFormat(sku) {
	if (sku.val() === "") {
		return true;
	}
	// check for SKU# format
	var pattern = /^[A-Z]{3}-[0-9]{3}$/;
	if (!pattern.test(sku.val())) {
		return false;
	}

	return true;
}
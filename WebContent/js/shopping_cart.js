/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #3								  ###
#################################################
 */

function shopping_cart(owner) {
	this.owner = $.trim(owner);
	this.productArray = new Array();

	// ////////////////////////////////////////////////////////////////////////
	// Do not use the following two methods; they are private to this class
	this.getCookieValues = function() { // PRIVATE METHOD
		var raw_string = document.cookie;
		var arr = null; 
		if (raw_string == undefined)
			return;
		var tmp = raw_string.split(";");
		var myValue = null;
		for (var i = 0; i < tmp.length; i++){
			if (tmp[i].indexOf(owner) != -1){
				myValue = tmp[i].split("=");
			}
		}

		if (!myValue)
			return;

		arr = myValue[1];
		arr = $.parseJSON(arr);
		if (arr === "") {
			this.productArray = new Array();
			return;
		}
		this.productArray = $.parseJSON(arr);
	}

	this.writeCookie = function() { // PRIVATE METHOD
		var toWrite = this.owner + "=";
		toWrite += JSON.stringify(JSON.stringify(this.productArray));
		if(!(window.mozInnerScreenX == null)){
			toWrite += "; path=/" + this.owner + "/";
		} else {
			toWrite += "; path=/" + this.owner + "/";
		}
		document.cookie = toWrite;
	}
	// ////////////////////////////////////////////////////////////////////////

	this.add = function(obj) {
		obj.sku = $.trim(obj.sku);
		obj.quantity = $.trim(obj.quantity);

		this.getCookieValues();
		var found = false;
		for (i = 0; i < this.productArray.length; i++) {
			if (this.productArray[i].sku == obj.sku) {
				this.productArray[i].quantity = parseInt(obj.quantity, 10)
						+ parseInt(this.productArray[i].quantity, 10);
				this.productArray[i].subtotal = parseFloat(this.productArray[i].quantity)
						* parseFloat(this.productArray[i].price);
				found = true;
			}
		}
		if (!found) {
			this.productArray.push(obj);
		}
		this.writeCookie();
	}

	this.setQuantity = function(obj) {
		obj.sku = $.trim(obj.sku);
		var found = false;
		if (obj.sku == "")
			return;
		obj.quantity = $.trim(obj.quantity);
		this.getCookieValues();

		for (i = 0; i < this.productArray.length; i++) {
			if (this.productArray[i].sku == obj.sku) {
				this.productArray[i].quantity = parseInt(obj.quantity, 10);
				this.productArray[i].subtotal = parseFloat(this.productArray[i].quantity)
						* parseFloat(this.productArray[i].price);
				found = true;
			}
		}
		if (found)
			this.writeCookie();
	}

	this.remove = function(sku) {
		sku = $.trim(sku);
		var index = -1;
		this.getCookieValues();
		for (i = 0; i < this.productArray.length; i++)
			if (this.productArray[i].sku == sku)
				index = i;
		if (index != -1) {
			this.productArray.splice(index, 1);
		}
		this.writeCookie();
	}

	this.removeAll = function() {
		this.getCookieValues();
		this.productArray.splice(0, this.productArray.length);
		this.writeCookie();
	}

	this.size = function() {
		this.getCookieValues();
		var count = 0;
		for (i = 0; i < this.productArray.length; i++)
			count += parseInt(this.productArray[i].quantity, 10);
		return count;
	}

	this.getCartArray = function() {
		this.getCookieValues();
		var returnArray = new Array();
		for (i = 0; i < this.productArray.length; i++) {
			returnArray[i] = new Object();
			returnArray[i] = this.productArray[i];
		}
		return returnArray;
	}

	this.getQuantity = function(sku) {
		this.getCookieValues();
		sku = $.trim(sku);

		var qty = 0;
		for (i = 0; i < this.productArray.length; i++) {
			if (this.productArray[i].sku == sku) {
				qty = this.productArray[i].quantity;
				break;
			}
		}
		return qty;
	}

	this.getPrice = function(sku) {
		this.getCookieValues();
		sku = $.trim(sku);

		var price = 0;
		for (i = 0; i < this.productArray.length; i++) {
			if (this.productArray[i].sku == sku) {
				price = this.productArray[i].price;
				break;
			}
		}
		return price;
	}

	this.getSubtotal = function(sku) {
		this.getCookieValues();
		sku = $.trim(sku);

		var subtotal = 0;
		for (i = 0; i < this.productArray.length; i++) {
			if (this.productArray[i].sku == sku) {
				subtotal = this.productArray[i].subtotal;
				break;
			}
		}
		return subtotal.toFixed(2);
	}

	this.getTotal = function() {
		this.getCookieValues();
		var total = 0.0;
		for (i = 0; i < this.productArray.length; i++)
			total += parseFloat(this.productArray[i].subtotal, 10);
		return total.toFixed(2);
	}
	
	this.getTotalAfterTax = function() {
		this.getCookieValues();
		var total = parseFloat(this.getTotal());
		total += (5.0 + parseFloat(this.getTaxAmount()));
		return total.toFixed(2);
	}
	
	this.getTaxAmount = function() {
		this.getCookieValues();
		var total = this.getTotal();
		total = (parseFloat(total) + 5.0) * (0.08);
		return total.toFixed(2);
	}
}

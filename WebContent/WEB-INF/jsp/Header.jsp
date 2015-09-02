<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<!--    
	  Singhania, Raksha    Account:  jadrn036
	  CS645, Spring 2015
	  Project #3
-->

<head>
<meta charset="utf-8">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache, no-store">
<meta http-equiv="Expires" CONTENT="-1">
<title>Women's Shoes Store</title>

<script type="text/javascript"
	src="/jadrn036/css/jquery-ui-custom/external/jquery/jquery.js"></script>
<script type="text/javascript"
	src="/jadrn036/css/jquery-ui-custom/jquery-ui.js"></script>
<script type="text/javascript"
	src="/jadrn036/css/jquery-ui-custom/jquery-ui.min.js"></script>
<script type="text/javascript" src="/jadrn036/js/ajax_get_lib.js"></script>
<script type="text/javascript" src="/jadrn036/js/shopping_cart.js"></script>
<script type="text/javascript" src="/jadrn036/js/home_page.js"></script>
<script type="text/javascript" src="/jadrn036/js/all_products_page.js"></script>
<script type="text/javascript" src="/jadrn036/js/view_cart.js"></script>
<script type="text/javascript" src="/jadrn036/js/checkout.js"></script>

<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.min.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.theme.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.theme.min.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.structure.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.structure.min.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.structure.css">
<link rel="stylesheet"
	href="/jadrn036/css/jquery-ui-custom/jquery-ui.min.css">
<link rel="stylesheet" href="/jadrn036/css2/home_page.css">
<link rel="stylesheet" href="/jadrn036/css2/all_products_page.css">
</head>
<body>
	<!-- Header starts -->
	<div id="header">
		<div id="logo_wrapper">
			<div id="div_logo">
				<a href="http://jadran.sdsu.edu/jadrn036/proj3.html"> <img
					id="logo_pic" src="/jadrn036/app_images/logo_small.png"></a>
			</div>
		</div>
		<div id="bar_wrapper">
			<div class="menu">
				<div id="menu-1">
					<a class="menu_item"
						href="http://jadran.sdsu.edu/jadrn036/proj3.html">Home</a>
				</div>
				<div id="menu-2">
					<a id="shoes_menu" class="menu_item"
						href="/jadrn036/servlet/Dispatcher?request_type=product">Shoes</a>
				</div>
			</div>
			<div id="shopping_cart_search">
				<div id="search_store">
					<form id="search_form" method="post"
						action="/jadrn036/servlet/Dispatcher?request_type=product" accept-charset="utf-8">
						<fieldset>
							<input type="text" name="search" id="search_input"
								placeholder="Search by brand, category or manufacturer"
								class="text ui-widget-content ui-corner-left" />

							<button type="button" id="search_btn" class="ui-widget-header ui-corner-right">
								<span class="ui-button-icon-primary ui-icon ui-icon-search "></span>
							</button>
						</fieldset>
					</form>
				</div>
				<div id="menu-4">
					<a id="shopping_cart" class="cart_menu"><img id="cart_pic"
						src="/jadrn036/app_images/Cart-128.png" /></a>
				</div>
				<div id="cart_item_count">
					<div id="count">0</div>
				</div>
			</div>
		</div>
		<div id="shoes_categories" class="categories">
			<div id="sub-menu_shop_by_category" class="sub-menu_column">
				<p class="sub-menu_item_header">SHOP BY CATEGORY</p>
			</div>
			<div id="sub-menu_shop_by_vendor" class="sub-menu_column">
				<p class="sub-menu_item_header">SHOP BY BRAND</p>
			</div>
		</div>
		<div id="shopping_cart_items">
			<div class="shopping_cart_items_wrapper">
				<div id="all_cart_items"></div>
				<div id="view_cart_div">
					<button type="button" id="view_cart_btn"
						class="ui-widget-header ui-corner-all">VIEW
						CART</button>
				</div>
			</div>
		</div>
	</div>
	<!-- Header ends -->
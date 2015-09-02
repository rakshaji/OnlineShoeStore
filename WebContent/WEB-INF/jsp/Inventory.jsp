<?xml version="1.0" encoding="utf-8"?>
<%@page import="helpers.AuthHelper, java.text.SimpleDateFormat,
java.util.Date" %>

<% 
if(!AuthHelper.isValidSession(request)){
	AuthHelper.logoutAsSessionExpired(request, response);
	return;
} 
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@page import="java.util.Vector"%>
<%@page import="helpers.DBHelper"%>
<%@page import="java.text.SimpleDateFormat"%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<!--    
	  Singhania, Raksha    Account:  jadrn036
	  CS645, Spring 2015
	  Project #2
-->

<head>
<meta charset="utf-8">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache, no-store">
    <meta http-equiv="Expires" CONTENT="-1">	
	<title>Stock Management</title> <script type="text/javascript"
		src="/jadrn036/css/jquery-ui/external/jquery/jquery.js"></script>
	<script type="text/javascript"
		src="/jadrn036/css/jquery-ui/jquery-ui.js"></script>
	<script type="text/javascript"
		src="/jadrn036/css/jquery-ui/jquery-ui.min.js"></script>

	<script type="text/javascript" src="/jadrn036/js/tab.js"></script>
	<script type="text/javascript" src="/jadrn036/js/ajax_get_lib.js"></script>
	<script type="text/javascript" src="/jadrn036/js/common.js"></script>

	<link rel="stylesheet" href="/jadrn036/css/jquery-ui/jquery-ui.css">
<link rel="stylesheet" href="/jadrn036/css/jquery-ui/jquery-ui.min.css">
	<link rel="stylesheet"
		href="/jadrn036/css/jquery-ui/jquery-ui.theme.css">
		<link rel="stylesheet"
			href="/jadrn036/css/jquery-ui/jquery-ui.theme.min.css">
			<link rel="stylesheet"
				href="/jadrn036/css/jquery-ui/jquery-ui.structure.css">
				<link rel="stylesheet"
					href="/jadrn036/css/jquery-ui/jquery-ui.structure.min.css">
					<link rel="stylesheet"
						href="/jadrn036/css/jquery-ui/jquery-ui.structure.css">
						<link rel="stylesheet"
							href="/jadrn036/css/jquery-ui/jquery-ui.min.css">

							<link rel="stylesheet" href="/jadrn036/css2/tab.css">
</head>
<body>
	<p align="left" id="store_pic"><img src="/jadrn036/app_images/logo_small.png" /></p>
	<form id="welcome_form" method="post" action="/jadrn036/servlet/Logout" accept-charset="utf-8">
		<p class="welcome">
			Welcome <%=session.getAttribute("username") %> | 
			<span class="link" id="logout">Logout</span>
		</p>
		<input class="hide" type="submit" />
	</form>
	<div id="tabs">
		<ul>
			<li><a href="#tabs-1"><span>Restock/Customer Returns</span></a></li>
			<li><a href="#tabs-2"><span>Sold/Defective Stock</span></a></li>
		</ul>
		<div id="tabs-1">
			<div id="wrapper">
				<div id="left">
					<div class="search_toggler">
						<div id="search_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Search</h3>
							<p id="search_msg" class="validateTips">Find a product by using Search</p>
							<form id="search_form">
								<fieldset>
									<label>SKU</label> <input type="text" name="sku" id="sku"
										placeholder="ABC-123"
										class="text ui-widget-content ui-corner-all"> <label>Category</label>
										<select name="category" id="category"
										class="ui-widget-content ui-corner-all">
									</select> <label>Vendor</label> <select name="vendor" id="vendor"
										class="ui-widget-content ui-corner-all">
									</select> <label>Company#</label> <input type="text"
										name="manufacturer" id="manufacturer"
										class="text ui-widget-content ui-corner-all"> 
											<button type="button" id="button" name="search"
												class="ui-widget-content ui-corner-all">Search</button>
											<button type="reset" id="button" name="search_reset"
												class="ui-widget-content ui-corner-all">Clear</button>
								</fieldset>
							</form>
							</div>
						  </div>
						  <div class="available_stock_toggler ">
						  <div id="available_stock_effect" class="ui-widget-content ui-corner-all">
							<h3 id="dynamic_header" class="ui-widget-header">All Stocks</h3>
							<div id="search-contain" class="ui-widget">
								<table name="stock_available" id="stock_available" class="ui-widget ui-widget-content">
									<thead>
										<tr class="ui-widget-header ">
											<th>SKU</th>
											<th>Available</th>
											<th>Last Modified</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div id="middle">
					<div class="details_toggler">
						<div id="details_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Product Details</h3>
							<form id="restock_form">
								<div id="detail-contain" class="ui-widget">
									<table id="details" class="ui-widget ui-widget-content">
										<!-- <thead>
								      <tr class="ui-widget-header ">
								        <th colspan="2">Product Details</th>
								      </tr>
								    </thead> -->
										<tbody>
											<tr>
												<td>SKU</td>
												<td id="sku"></td>
											</tr>
											<tr>
												<td>Category</td>
												<td id="category"></td>
											</tr>
											<tr>
												<td>Vendor</td>
												<td id="vendor"></td>
											</tr>
											<tr>
												<td>Company#</td>
												<td id="manufacturer"></td>
											</tr>
											<tr>
												<td>Image</td>
												<td id="image"></td>
											</tr>
										</tbody>
									</table>
								</div>
								<h3 class="ui-widget-header">Add Stock</h3>
								<p id="restock_msg" class="validateTips">All fields are required.</p>
								<fieldset>
									<!-- <legend>Restock</legend> -->
									<label>Date*</label> 
									<% SimpleDateFormat dateFormat =new SimpleDateFormat("MM/dd/yyyy"); %>
									<input type="text" id="datepicker1"
										name="restock_date" id="restock_input" placeholder="MM/DD/YYYY"
										class="text ui-widget-content ui-corner-all" value="<%=dateFormat.format(new Date())  %>"></input> <label>Quantity*</label>
									<input type="text" name="restock_quantity" id="restock_input"
										class="text ui-widget-content ui-corner-all"> </input>
									<button type="button" id="button" name="restock"
										class="ui-widget-content ui-corner-all">Add</button>
									<button type="reset" id="button" name="restock_reset"
										class="ui-widget-content ui-corner-all">Clear</button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
				<div id="right">
					<div class="history_toggler">
						<div id="history_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Restock History</h3>
							<div id="history-contain" class="ui-widget">
								<table id="history" class="ui-widget ui-widget-content">
									<thead>
										<tr class="ui-widget-header ">
											<th>SKU</th>
											<th>Quantity</th>
											<th>Restocked On</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="tabs-2">
			<div id="wrapper">
				<div id="left">
					<div class="search_toggler">
						<div id="search_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Search</h3>
							<p id="search_msg" class="validateTips">Find a product by using Search</p>
							<form id="search_form">
								<fieldset>
									<label>SKU</label> <input type="text" name="sku" id="sku"
										placeholder="ABC-123"
										class="text ui-widget-content ui-corner-all"> <label>Category</label>
										<select name="category" id="category"
										class="ui-widget-content ui-corner-all">
									</select> <label>Vendor</label> <select name="vendor" id="vendor"
										class="ui-widget-content ui-corner-all">
									</select> <label>Company#</label> <input type="text"
										name="manufacturer" id="manufacturer"
										class="text ui-widget-content ui-corner-all"> 
											<button type="button" id="button" name="search"
												class="ui-widget-content ui-corner-all">Search</button>
											<button type="reset" id="button" name="search_reset"
												class="ui-widget-content ui-corner-all">Clear</button>
								</fieldset>
							</form>
							</div>
						  </div>
						  <div class="available_stock_toggler">
						  <div id="available_stock_effect" class="ui-widget-content ui-corner-all">
							<h3 id="dynamic_header" class="ui-widget-header">All Stocks</h3>
							<div id="search-contain" class="ui-widget">
								<table name="stock_available" id="stock_available" class="ui-widget ui-widget-content">
									<thead>
										<tr class="ui-widget-header ">
											<th>SKU</th>
											<th>Available</th>
											<th>Last Modified</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div id="middle">
					<div class="details_toggler">
						<div id="details_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Product Details</h3>
							<form id="restock_form">
								<div id="detail-contain" class="ui-widget">
									<table id="details" class="ui-widget ui-widget-content">
										<!-- <thead>
								      <tr class="ui-widget-header ">
								        <th colspan="2">Product Details</th>
								      </tr>
								    </thead> -->
										<tbody>
											<tr>
												<td>SKU</td>
												<td id="sku"></td>
											</tr>
											<tr>
												<td>Category</td>
												<td id="category"></td>
											</tr>
											<tr>
												<td>Vendor</td>
												<td id="vendor"></td>
											</tr>
											<tr>
												<td>Company#</td>
												<td id="manufacturer"></td>
											</tr>
											<tr>
												<td>Image</td>
												<td id="image"></td>
											</tr>
										</tbody>
									</table>
								</div>
								<h3 class="ui-widget-header">Remove Stock</h3>
								<p id="restock_msg" class="validateTips">All fields are required.</p>
								<fieldset>
									<!-- <legend>Restock</legend> -->
									<label>Date*</label> <input type="text" id="datepicker2"
										name="restock_date" id="restock_input" placeholder="MM/DD/YYYY"
										class="text ui-widget-content ui-corner-all" value="<%=dateFormat.format(new Date())  %>"></input> <label>Quantity*</label>
									<input type="text" name="restock_quantity" id="restock_input"
										class="text ui-widget-content ui-corner-all"> </input>
									<button type="button" id="button" name="restock"
										class="ui-widget-content ui-corner-all">Remove</button>
									<button type="reset" id="button" name="restock_reset"
										class="ui-widget-content ui-corner-all">Clear</button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
				<div id="right">
					<div class="history_toggler">
						<div id="history_effect" class="ui-widget-content ui-corner-all">
							<h3 class="ui-widget-header">Sold/Defective History</h3>
							<div id="history-contain" class="ui-widget">
								<table id="history" class="ui-widget ui-widget-content">
									<thead>
										<tr class="ui-widget-header ">
											<th>SKU</th>
											<th>Quantity</th>
											<th>Restocked On</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>


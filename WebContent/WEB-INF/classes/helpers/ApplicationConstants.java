/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

package helpers;

public interface ApplicationConstants {
	// paths
	String PAGE_FILTERED_PRODUCTS = "/WEB-INF/jsp/FilteredView.jsp";
	String PAGE_RELOGIN = "/WEB-INF/jsp/ReLogin.jsp";
	String PAGE_INVENTORY_RECEIVED = "/WEB-INF/jsp/Inventory.jsp";
	String PAGE_FETCH_PRODUCTS = "/servlet/FetchProducts";
	String PAGE_DISPATCH_SERVLET = "/servlet/DispatchServlet";
	String PAGE_LOGIN_SERVLET = "/servlet/Login";
	String PAGE_PRODUCTS_DIV = "/WEB-INF/jsp/ProductsView.jsp";
	String PAGE_PRODUCT_DETAIL = "/WEB-INF/jsp/ProductDetail.jsp";
	String PAGE_VIEW_CART = "/WEB-INF/jsp/ViewCart.jsp";
	String PAGE_CHECKOUT = "/WEB-INF/jsp/Checkout.jsp";
	String COOKIE_PATH = "/jadrn036/";

	// attributes
	String ATTR_USERNAME = "username";
	String ATTR_SUCCESS_MSG = "success";
	String ATTR_ERROR_MSG = "error";
	String ATTR_PRODUCTS = "products";
	
	// messages
	String MSG_INCORRECT_CREDENTIALS_ERROR = "Please enter correct username and/or password.";
	String MSG_LOGOUT_SUCCESS = "You logged out successfully.";
	String MSG_FAILURE = "Error";
	String MSG_DATA_SAVE_SUCCESS = "Your data is saved successfully.";
	String MSG_QUANTITY_GREATER = "Insufficient quantity";
	String MSG_SESSION_EXPIRED = "Your session expired. Please re-login.";
	String MSG_OK = "OK";
	
	// parameters
	String PARAM_PASSWORD = "password";
	String PARAM_SKU = "sku";
	String PARAM_DATE = "date";
	String PARAM_QUANTITY = "quantity";
	String PARAM_CATEGORY = "category";
	String PARAM_VENDOR = "vendor";
	String PARAM_MANUFACTURER = "manufacturer";
	String PARAM_IMAGE = "image";
	String PARAM_DESCRIPTION = "description";
	String PARAM_FEATURES = "features";
	String PARAM_USERNAME = "username";
	String PARAM_PRICE = "price";
	String PARAM_SORT_ORDER = "sort";
	String PARAM_SEARCH = "search";
	
	// status messages
	String STATUS_COMING_SOON = "Coming soon";
	String STATUS_IN_STOCK = "In Stock";
	String STATUS_ON_THE_WAY = "More on the way";
	
	// other utility
	String DATA_SEPARATOR = "_!_";
	String ROW_SEPARATOR = "_!!!_";
	String COOKIE_CART = "jadrn036";
	
	// reqyest types
	String REQ_TYPE = "request_type";
	String REQ_TYPE_CHECKBOX = "checkbox";
	String REQUEST_TYPE = "request_type";
	String REQ_TYPE_CART = "cart";
	String REQ_TYPE_PRODUCT = "product";
	String REQ_TYPE_CHECKOUT = "checkout";
	String REQ_TYPE_ORDER = "order";
	String REQ_TYPE_CHECK_ONHAND = "check_onhand";
	
	// switch cases
	int CASE_SKU = 0;
	int CASE_CATEGORY = 1;
	int CASE_VENDOR = 2;
	int CASE_MANUFACTURER = 3;
	int CASE_IMAGE = 4;
	int CASE_QUANTITY = 5;
	int CASE_PRICE = 6;
	int CASE_DESCRIPTION = 7;
	int CASE_FEATURES = 8;
}

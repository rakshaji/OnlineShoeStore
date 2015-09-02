/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #3								  ###
#################################################
 */

import helpers.AppHelper;
import helpers.ApplicationConstants;
import helpers.Product;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Dispatcher extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private RequestDispatcher dispatcher = null;
	private String toDo = "";

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		String requestType = request
				.getParameter(ApplicationConstants.REQUEST_TYPE);

		
		if (AppHelper.isNullOrBlank(requestType)) {
			return;
		}

		// add cookie on the very first server request
		// rest of the time just fetch it.
		if (AppHelper.isNullOrBlank(AppHelper.getCookieValue(
				ApplicationConstants.COOKIE_CART, request))) {

			// Create cookie
			Cookie cartCookie = new Cookie(ApplicationConstants.COOKIE_CART,
					null);
			cartCookie.setPath(ApplicationConstants.COOKIE_PATH);

			// Set expiry date after 24 Hrs - 365 days for both the cookies.
			cartCookie.setMaxAge(60 * 60 * 24 * 365);

			// Add both the cookies in the response header.
			response.addCookie(cartCookie);
		}

		// act according to request type
		if (requestType.equals(ApplicationConstants.REQ_TYPE_CART)) {
			String products = AppHelper.fetchProductFromDatabase(request);
			request.setAttribute(ApplicationConstants.ATTR_PRODUCTS, products);
			toDo = ApplicationConstants.PAGE_VIEW_CART;
		} 
		else if (requestType.equals(ApplicationConstants.REQ_TYPE_PRODUCT)) {
			String products = AppHelper.fetchProductFromDatabase(request);
			request.setAttribute(ApplicationConstants.ATTR_PRODUCTS, products);

			toDo = ApplicationConstants.PAGE_FILTERED_PRODUCTS;

			String sku = request.getParameter(ApplicationConstants.PARAM_SKU);
			if (!AppHelper.isNullOrBlank(sku)) {
				toDo = ApplicationConstants.PAGE_PRODUCT_DETAIL;
			}
		} 
		else if (requestType.equals(ApplicationConstants.REQ_TYPE_CHECKOUT)) {
			toDo = ApplicationConstants.PAGE_CHECKOUT;
		} 
		else if (requestType.equals(ApplicationConstants.REQ_TYPE_CHECK_ONHAND)) {
			String sku = request.getParameter(ApplicationConstants.PARAM_SKU);
			String quantity = request
					.getParameter(ApplicationConstants.PARAM_QUANTITY);

			String msg = AppHelper.checkQuantityInDatabase(sku, quantity);
			returnResult(response, msg);
			return;
		} 
		else if (requestType.equals(ApplicationConstants.REQ_TYPE_ORDER)) {
			ArrayList<Product> products = AppHelper.getCartProducts(request);
			for (Product product : products) {
				String msg = AppHelper.updateInventoryOutInDatabase(
						product.getSku(), AppHelper.getCurrentDateString(), product.getOrderQuantity());
				if (msg.equals(ApplicationConstants.MSG_FAILURE)) {
					returnResult(response, msg);
					return;
				}
			}
			toDo = ApplicationConstants.PAGE_CHECKOUT;
		}

		dispatcher = request.getRequestDispatcher(toDo);
		dispatcher.forward(request, response);
	}

	private void returnResult(HttpServletResponse response, String msg)
			throws IOException {
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.println(msg);
		out.close();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}
}

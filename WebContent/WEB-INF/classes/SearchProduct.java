/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

import helpers.ApplicationConstants;
import helpers.AuthHelper;
import helpers.DBHelper;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SearchProduct
 */
public class SearchProduct extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		// validate session
		if(!AuthHelper.isValidSession(request)){
			AuthHelper.logoutAsSessionExpired(request, response);
			return;
		}
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		String sku = request.getParameter(ApplicationConstants.PARAM_SKU);
		String category = request.getParameter(ApplicationConstants.PARAM_CATEGORY);
		String vendor = request.getParameter(ApplicationConstants.PARAM_VENDOR);
		String manufacturer = request.getParameter(ApplicationConstants.PARAM_MANUFACTURER);

		// construct a WHERE clause for the query
		boolean isAnyCriteria = false;
		String whereClause = "";
		if (!sku.equals("")) {
			isAnyCriteria = true;
			whereClause += "sku='" + sku + "'";
			if (!category.equals("") || !vendor.equals("")
					|| !manufacturer.equals("")) {
				whereClause += " AND ";
			}
		} else if (!category.equals("")) {
			isAnyCriteria = true;
			whereClause += "catID=" + category;
			if (!vendor.equals("") || !manufacturer.equals("")) {
				whereClause += " AND ";
			}
		} else if (!vendor.equals("")) {
			isAnyCriteria = true;
			whereClause += "venID=" + vendor;
			if (!manufacturer.equals("")) {
				whereClause += " AND ";
			}
			;
		} else if (!manufacturer.equals("")) {
			isAnyCriteria = true;
			whereClause += "vendorModel=" + manufacturer;
		}

		// if true
		if (isAnyCriteria) {
			whereClause = " WHERE " + whereClause;
		}

		// search data with constructed where clause
		String query = "SELECT c.name AS 'category', v.name AS 'vendor', p.vendorModel AS 'manufacturer', p.image, p.sku FROM product AS p INNER JOIN category AS c ON p.catID = c.categoryID INNER JOIN vendor AS v ON p.venID = v.vendorID"
				+ whereClause;
		Vector<String[]> result = DBHelper.doQuery(query);

		if (result.size() > 0) {
			String answer = "";
			for (int i = 0; result != null && i < result.size(); i++) {
				String[] data = result.elementAt(i);
				category = data.length > 0 ? data[0] : "";
				vendor = data.length > 1 ? data[1] : "";
				String model = data.length > 2 ? data[2] : "";
				String image = data.length > 3 ? data[3] : "";
				sku = data.length > 4 ? data[4] : "";

				answer += "sku=" + sku;
				answer += ",category=" + category;
				answer += ",vendor=" + vendor;
				answer += ",manufacturer=" + model;
				answer += ",image=" + image;
				answer += "||";
			}
			answer = answer.substring(0, answer.length() - 2);
			out.println(answer);
		} else {
			out.println(ApplicationConstants.MSG_FAILURE);
		}
		
		out.close();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

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
 * Servlet implementation class InventoryIn
 */
public class InventoryIn extends HttpServlet {
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
		String dateStr = request.getParameter(ApplicationConstants.PARAM_DATE);
		String quantity = request.getParameter(ApplicationConstants.PARAM_QUANTITY);
		String msg = ApplicationConstants.MSG_FAILURE;

		if (sku != null && !sku.equals("")) {
			// update activity history for the product
			String query = "INSERT INTO merchandise_in VALUES(null, '" + sku
					+ "', STR_TO_DATE('" + dateStr + "', '%m/%d/%Y'), "
					+ quantity + ")";
			int result = DBHelper.doUpdate(query);

			if (result > 0) {
				query = "SELECT on_hand_quantity FROM on_hand WHERE skuID='"
						+ sku + "'";
				Vector<String[]> resultData = DBHelper.doQuery(query);
				String oldQuanity = "0";

				if (resultData.size() == 1) {
					String[] data = resultData.elementAt(0);
					oldQuanity = data[0];
				}

				// update table with new added quantity
				query = "REPLACE INTO on_hand SET skuID='" + sku
						+ "', on_hand_quantity=" + oldQuanity + "+" + quantity
						+ " , last_date_modified=STR_TO_DATE('" + dateStr
						+ "', '%m/%d/%Y') ";
				result = DBHelper.doUpdate(query);

				if (result > 0) {
					msg = ApplicationConstants.MSG_DATA_SAVE_SUCCESS;
				}
			}
		}
		out.println(msg);
		out.close();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

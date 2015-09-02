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
 * Servlet implementation class InventoryOut
 */
public class InventoryOut extends HttpServlet {
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
		String newQuantity = request.getParameter(ApplicationConstants.PARAM_QUANTITY);

		if (sku != null && !sku.equals("")) {
			String msg = ApplicationConstants.MSG_FAILURE;

			String query = "SELECT on_hand_quantity FROM on_hand WHERE skuID='"
					+ sku + "'";

			Vector<String[]> resultData = DBHelper.doQuery(query);

			String oldQuanity = "0";

			if (resultData.size() == 1) {
				String[] data = resultData.elementAt(0);
				oldQuanity = data[0];
			}

			// check if on hand quantity for the product is enough for this operation, if no send error 
			if (Integer.valueOf(oldQuanity) >= Integer.valueOf(newQuantity)) {
				
				// update the on hand table with new substracted quanity
				query = "REPLACE INTO on_hand SET skuID='" + sku
						+ "', on_hand_quantity=" + oldQuanity + "-"
						+ newQuantity + " , last_date_modified=STR_TO_DATE('"
						+ dateStr + "', '%m/%d/%Y')";
				int result = DBHelper.doUpdate(query);

				// also update the activity history 
				if (result > 0) {
					query = "INSERT INTO merchandise_out VALUES(null, '" + sku
							+ "', STR_TO_DATE('" + dateStr + "', '%m/%d/%Y'), "
							+ newQuantity + ")";
					result = DBHelper.doUpdate(query);

					if (result > 0) {
						msg = ApplicationConstants.MSG_DATA_SAVE_SUCCESS;
					}
				}
			} else {
				msg = ApplicationConstants.MSG_QUANTITY_GREATER;
			}
			out.print(msg);
		}
		out.close();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

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
 * Servlet implementation class FetchStockOutHistory
 */
public class FetchStockOutHistory extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// validate session
		if(!AuthHelper.isValidSession(request)){
			AuthHelper.logoutAsSessionExpired(request, response);
			return;
		} 
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		String sku = request.getParameter(ApplicationConstants.PARAM_SKU);
		
		if(sku == null || sku.equals("")){
			out.println("Error");
			return;
		}
		
		String query = "SELECT skuID, quantity, DATE_FORMAT(date ,'%m/%d/%Y') FROM merchandise_out WHERE skuID = '"+sku+"'";
		Vector<String[]> result = DBHelper.doQuery(query);

		if (result.size() > 0) {
			String answer = "";
			for (int i = 0; result != null && i < result.size(); i++) {
				String[] data = result.elementAt(i);
				String skuId = data.length > 0 ? data[0] : ""; 
				String quantity = data.length > 1 ? data[1] : ""; 
				String date = data.length > 2 ? data[2] : ""; 
				
				answer += "sku=" + skuId;
				answer += ",quantity=" + quantity;
				answer += ",date=" + date;
				answer += "||";
			}
			answer = answer.substring(0, answer.length() - 2);
			out.println(answer);
		} else {
			out.println(ApplicationConstants.MSG_FAILURE);
		}
		out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

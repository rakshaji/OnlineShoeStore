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
 * Servlet implementation class GetVendorList
 */
public class GetVendorList extends HttpServlet {
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
		String query = "SELECT vendor.vendorID, vendor.name from vendor";
		Vector<String[]> result = DBHelper.doQuery(query);

		if (result.size() > 0) {
			String answer = "";
			for (int i = 0; result != null && i < result.size(); i++) {
				String[] data = result.elementAt(i);
				String vendorID = data.length > 0 ? data[0] : ""; // id column
				String vendorName = data.length > 1 ? data[1] : ""; // name
																	// column
				answer += vendorID + "=" + vendorName;
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

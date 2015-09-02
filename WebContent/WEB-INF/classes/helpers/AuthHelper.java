/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

package helpers;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AuthHelper {

	/**
	 * Checks if there is a session
	 * 
	 * @param request
	 * @return true, if session exist else false
	 */
	public static boolean isValidSession(HttpServletRequest request) {

		HttpSession session = request.getSession(false);
		if (session == null)
			return false;

		Object user = session.getAttribute("username");

		if (user == null)
			return false;

		return true;
	}

	/**
	 * Checks if there is a session or saerches for 'username' attribute in
	 * session if not found, logs out user notifying that session has expired.
	 * 
	 * @param request
	 * @param response
	 */
	public static void logoutAsSessionExpired(HttpServletRequest request,
			HttpServletResponse response) {

		request.getServletContext().removeAttribute(ApplicationConstants.ATTR_SUCCESS_MSG);
		request.getServletContext().setAttribute(ApplicationConstants.ATTR_ERROR_MSG,
				ApplicationConstants.MSG_SESSION_EXPIRED);
		try {
			RequestDispatcher dispatcher;
			dispatcher = request
					.getRequestDispatcher(ApplicationConstants.PAGE_RELOGIN);
			dispatcher.forward(request, response);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}
}

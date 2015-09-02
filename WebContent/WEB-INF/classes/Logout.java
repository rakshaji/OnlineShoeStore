/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

import helpers.ApplicationConstants;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class Logout extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(ApplicationConstants.ATTR_USERNAME);
			session.invalidate();
			
			request.getServletContext().removeAttribute(ApplicationConstants.ATTR_ERROR_MSG);
			request.getServletContext().setAttribute(ApplicationConstants.ATTR_SUCCESS_MSG, 
					ApplicationConstants.MSG_LOGOUT_SUCCESS);
		}
		
		response.sendRedirect(request.getServletContext().getContextPath() + ApplicationConstants.PAGE_LOGIN_SERVLET);
	}
}

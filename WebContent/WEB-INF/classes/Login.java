/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

import helpers.ApplicationConstants;
import helpers.AuthHelper;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import sdsu.PasswordUtilities;

public class Login extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	private RequestDispatcher dispatcher = null;
	private String toDo = "";

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		String username = request.getParameter(ApplicationConstants.PARAM_USERNAME);
		String password = request.getParameter(ApplicationConstants.PARAM_PASSWORD);
		
		HttpSession session = request.getSession(false);
		
		// check for logout
		if(username == null && session == null){
			dispatcher = request
					.getRequestDispatcher(ApplicationConstants.PAGE_RELOGIN);
			dispatcher.forward(request, response);
			return;
		}
		
		// check for expired session 
		if(session != null){
			if(session.getAttribute(ApplicationConstants.ATTR_USERNAME) == null) {
				AuthHelper.logoutAsSessionExpired(request, response);
				return;
			}
		} 

		// login user with new session
		boolean isValid = (username != null) ? PasswordUtilities.isValidLogin(username, password) : false;
		
		if (isValid) {
			session = request.getSession(true);
	        session.setMaxInactiveInterval(30*60);// 30 mins
			session.setAttribute("username", username);
			
			toDo = ApplicationConstants.PAGE_DISPATCH_SERVLET;
			response.sendRedirect(request.getServletContext().getContextPath() + toDo);
			return;
		} else {
			toDo = ApplicationConstants.PAGE_RELOGIN;
			request.getServletContext().removeAttribute(ApplicationConstants.ATTR_SUCCESS_MSG);
			request.getServletContext().setAttribute(ApplicationConstants.ATTR_ERROR_MSG, 
					ApplicationConstants.MSG_INCORRECT_CREDENTIALS_ERROR);
		}

		dispatcher = request.getRequestDispatcher(toDo);
		dispatcher.forward(request, response);
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}
}

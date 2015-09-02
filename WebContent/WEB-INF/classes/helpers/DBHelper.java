/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
 */

package helpers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Vector;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;

public class DBHelper implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(DBHelper.class);

	// This method is for queries that return a result set. The returned
	// vector holds the results.
	public static Vector<String[]> doQuery(String s) {
		String user = "jadrn036";
		String password = "drawer";
		String database = "jadrn036";
		String connectionURL = "jdbc:mysql://opatija:3306/" + database
				+ "?user=" + user + "&password=" + password;

		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;
		Vector<String[]> v = new Vector<String[]>();

		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection(connectionURL);
			statement = connection.createStatement();
			resultSet = statement.executeQuery(s);

			ResultSetMetaData md = resultSet.getMetaData();
			int numCols = md.getColumnCount();

			while (resultSet.next()) {
				String[] tmp = new String[numCols];
				for (int i = 0; i < numCols; i++)
					tmp[i] = resultSet.getString(i + 1); // resultSet getString
															// is 1 based
				v.add(tmp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (resultSet != null)
					resultSet.close();

				if (statement != null)
					statement.close();

				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return v;
	}

	// This method is appropriate for DB operations that do not return a result
	// set, but rather the number of affected rows. This includes INSERT and
	// UPDATE
	public static int doUpdate(String s) {
		String user = "jadrn036";
		String password = "drawer";
		String database = "jadrn036";
		String connectionURL = "jdbc:mysql://opatija:3306/" + database
				+ "?user=" + user + "&password=" + password;

		Connection connection = null;
		Statement statement = null;
		int result = -1;
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection(connectionURL);
			statement = connection.createStatement();
			result = statement.executeUpdate(s);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (statement != null)
					statement.close();

				if (connection != null)
					connection.close();
			} catch (SQLException e) {
			}
		}
		return result;
	}

	public static String getQueryResultTable(Vector<String[]> v) {
		StringBuffer toReturn = new StringBuffer();
		toReturn.append("<table>");
		for (int i = 0; i < v.size(); i++) {
			String[] tmp = v.elementAt(i);
			toReturn.append("<tr>");

			for (int j = 0; j < tmp.length; j++)
				toReturn.append("<td>" + tmp[j] + "</td>");

			toReturn.append("</tr>");
		}
		toReturn.append("</table>");
		return toReturn.toString();
	}

}

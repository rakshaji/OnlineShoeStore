package helpers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AppHelper {

	final static Log log = LogFactory.getLog(AppHelper.class);

	public static boolean isNullOrBlank(String string) {
		boolean isNullOrBlank = false;

		if (string == null)
			isNullOrBlank = true;
		else if (string.equals(""))
			isNullOrBlank = true;

		return isNullOrBlank;
	}

	public static String checkQuantityInDatabase(String sku, String newQuantity) {
		String msg = ApplicationConstants.MSG_FAILURE;
		if (!isNullOrBlank(sku)) {
			String query = "SELECT on_hand_quantity FROM on_hand WHERE skuID='"
					+ sku + "'";

			Vector<String[]> resultData = DBHelper.doQuery(query);

			String oldQuanity = "0";

			if (resultData.size() == 1) {
				String[] data = resultData.elementAt(0);
				oldQuanity = data[0];
			}

			// check if on hand quantity for the product is enough for this
			// operation, if no send error
			if (Integer.valueOf(oldQuanity) >= Integer.valueOf(newQuantity)) {
				msg = ApplicationConstants.MSG_OK;
			} else {
				msg = ApplicationConstants.MSG_QUANTITY_GREATER;
			}
		}
		return msg;
	}
	
	public static String updateInventoryOutInDatabase(String sku,
			String dateStr, String newQuantity) {
		String msg = ApplicationConstants.MSG_FAILURE;
		if (!isNullOrBlank(sku)) {
			String query = "SELECT on_hand_quantity FROM on_hand WHERE skuID='"
					+ sku + "'";

			Vector<String[]> resultData = DBHelper.doQuery(query);

			String oldQuanity = "0";

			if (resultData.size() == 1) {
				String[] data = resultData.elementAt(0);
				oldQuanity = data[0];
			}

			// check if on hand quantity for the product is enough for this
			// operation, if no send error
			if (Integer.valueOf(oldQuanity) >= Integer.valueOf(newQuantity)) {

				// update the on hand table with new substracted quanity
				query = "REPLACE INTO on_hand SET skuID='" + sku
						+ "', on_hand_quantity=" + oldQuanity + "-"
						+ newQuantity + " , last_date_modified=STR_TO_DATE('"
						+ dateStr + "', '%m-%d-%Y')";
				int result = DBHelper.doUpdate(query);

				// also update the activity history
				if (result > 0) {
					query = "INSERT INTO merchandise_out VALUES(null, '" + sku
							+ "', STR_TO_DATE('" + dateStr + "', '%m-%d-%Y'), "
							+ newQuantity + ")";
					result = DBHelper.doUpdate(query);

					if (result > 0) {
						msg = ApplicationConstants.MSG_DATA_SAVE_SUCCESS;
					}
				}
			} else {
				msg = ApplicationConstants.MSG_QUANTITY_GREATER;
			}
		}
		return msg;
	}

	public static ArrayList<Product> getProducts(HttpServletRequest request) {
		ArrayList<Product> productsMap = null;

		String allProductsString = (String) request
				.getAttribute(ApplicationConstants.ATTR_PRODUCTS);

		if (allProductsString == null
				|| (allProductsString != null && allProductsString
						.equals(ApplicationConstants.MSG_FAILURE))) {
			return null;
		}

		String[] productsArr = allProductsString
				.split(ApplicationConstants.ROW_SEPARATOR);

		for (int i = 0; productsArr != null && i < productsArr.length; i++) {
			if (productsMap == null) {
				productsMap = new ArrayList<Product>();
			}

			String[] productDetails = productsArr[i]
					.split(ApplicationConstants.DATA_SEPARATOR);
			Product product = new Product();
			for (int j = 0; productDetails != null && j < productDetails.length; j++) {
				String[] dataPair = productDetails[j].split("=");

				String data = null;
				if (dataPair.length == 2) {
					data = dataPair[1];
				}
				switch (j) {
				case ApplicationConstants.CASE_SKU:
					product.setSku(data);
					break;
				case ApplicationConstants.CASE_CATEGORY:
					product.setCategory(data);
					break;
				case ApplicationConstants.CASE_VENDOR:
					product.setVendor(data);
					break;
				case ApplicationConstants.CASE_MANUFACTURER:
					product.setManufacturer(data);
					break;
				case ApplicationConstants.CASE_IMAGE:
					product.setImage(data);
					break;
				case ApplicationConstants.CASE_QUANTITY:
					product.setOnHandQuantity(data);
					String availabilityStatus = ApplicationConstants.STATUS_COMING_SOON;
					if (!AppHelper.isNullOrBlank(data)) {
						if (Float.parseFloat(data) > 0f) {
							availabilityStatus = ApplicationConstants.STATUS_IN_STOCK;
						} else if (Float.parseFloat(data) == 0f) {
							availabilityStatus = ApplicationConstants.STATUS_ON_THE_WAY;
						}
					}
					product.setAvailabilityStatus(availabilityStatus);
					break;
				case ApplicationConstants.CASE_PRICE:
					product.setPrice(data);
					break;
				case ApplicationConstants.CASE_DESCRIPTION:
					product.setDescription(data);
					break;
				case ApplicationConstants.CASE_FEATURES:
					product.setFeatures(data);
					break;
				default:
					break;
				}
			}
			productsMap.add(product);
		}

		return productsMap;
	}

	public static String fetchProductFromDatabase(HttpServletRequest request) {
		String sku = request.getParameter(ApplicationConstants.PARAM_SKU);
		String category = request
				.getParameter(ApplicationConstants.PARAM_CATEGORY);
		String vendor = request.getParameter(ApplicationConstants.PARAM_VENDOR);
		String manufacturer = request
				.getParameter(ApplicationConstants.PARAM_MANUFACTURER);
		String priceMinMax = request
				.getParameter(ApplicationConstants.PARAM_PRICE);
		String sortOrder = request
				.getParameter(ApplicationConstants.PARAM_SORT_ORDER);
		String search = request.getParameter(ApplicationConstants.PARAM_SEARCH);
		String requestType = request
				.getParameter(ApplicationConstants.REQ_TYPE);
		String answer = "";

		// construct a WHERE clause for the query
		boolean isAnyCriteria = false;
		String whereClause = "";
		if (!AppHelper.isNullOrBlank(requestType)
				&& requestType.equals(ApplicationConstants.REQ_TYPE_CART)) {
			String allSku = getCartSKUs(request);
			if (!AppHelper.isNullOrBlank(allSku)) {
				whereClause += "p.sku IN (" + allSku + ")";
				isAnyCriteria = true;
			} else {
				return answer;
			}
		} else if (!AppHelper.isNullOrBlank(search)) {
			isAnyCriteria = true;
			String likeCriteria = " LIKE '%" + search + "%'";
			whereClause += "p.vendorModel" + likeCriteria + "OR c.name"
					+ likeCriteria + "OR v.name" + likeCriteria;
		} else {

			if (!AppHelper.isNullOrBlank(sku)) {
				isAnyCriteria = true;
				whereClause += "p.sku='" + sku + "'";
				if (!AppHelper.isNullOrBlank(category)
						|| !AppHelper.isNullOrBlank(vendor)
						|| !AppHelper.isNullOrBlank(manufacturer)
						|| !AppHelper.isNullOrBlank(priceMinMax)) {
					whereClause += " AND ";
				}
			}
			if (!AppHelper.isNullOrBlank(category)) {
				isAnyCriteria = true;

				whereClause += "p.catID IN (" + category + ")";

				if (!AppHelper.isNullOrBlank(vendor)
						|| !AppHelper.isNullOrBlank(manufacturer)
						|| !AppHelper.isNullOrBlank(priceMinMax)) {
					whereClause += " AND ";
				}
			}
			if (!AppHelper.isNullOrBlank(vendor)) {
				isAnyCriteria = true;

				whereClause += "p.venID IN (" + vendor + ")";

				if (!AppHelper.isNullOrBlank(manufacturer)
						|| !AppHelper.isNullOrBlank(priceMinMax)) {
					whereClause += " AND ";
				}
			}
			if (!AppHelper.isNullOrBlank(manufacturer)) {
				isAnyCriteria = true;
				whereClause += "p.vendorModel=" + manufacturer;

				if (!AppHelper.isNullOrBlank(priceMinMax)) {
					whereClause += " AND ";
				}
			}
			if (!AppHelper.isNullOrBlank(priceMinMax)) {
				isAnyCriteria = true;

				String[] array = priceMinMax.split(",");
				if (array.length > 0) {
					whereClause += "(p.retail BETWEEN " + array[0] + " AND "
							+ array[1] + ")";
				}
			}
		}

		// if true
		if (isAnyCriteria) {
			whereClause = " WHERE " + whereClause;
		}

		if (!AppHelper.isNullOrBlank(sortOrder)) {
			whereClause += " ORDER BY p.retail " + sortOrder;
		}

		// search data with constructed where clause
		String query = "SELECT c.name AS 'category', "
				+ "v.name AS 'vendor', p.vendorModel AS 'manufacturer', "
				+ "p.image, p.sku, "
				+ "IFNULL(oh.on_hand_quantity, '') AS 'quantity', "
				+ "p.retail AS 'price', p.description, p.features FROM product AS p "
				+ "INNER JOIN category AS c ON p.catID = c.categoryID "
				+ "INNER JOIN vendor AS v ON p.venID = v.vendorID "
				+ "LEFT JOIN on_hand AS oh ON p.sku = oh.skuID " + whereClause;

		Vector<String[]> result = DBHelper.doQuery(query);
		if (result.size() > 0) {
			for (int i = 0; result != null && i < result.size(); i++) {
				String[] data = result.elementAt(i);
				String categoryID = data.length > 0 ? data[0] : "";
				String vendorID = data.length > 1 ? data[1] : "";
				String model = data.length > 2 ? data[2] : "";
				String image = data.length > 3 ? data[3] : "";
				String skuID = data.length > 4 ? data[4] : "";
				String quantity = data.length > 5 ? data[5] : "";
				String price = data.length > 6 ? data[6] : "";
				String description = data.length > 7 ? data[7] : "";
				String features = data.length > 8 ? data[8] : "";

				answer += ApplicationConstants.PARAM_SKU + "=" + skuID
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_CATEGORY + "="
						+ categoryID + ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_VENDOR + "=" + vendorID
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_MANUFACTURER + "=" + model
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_IMAGE + "=" + image
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_QUANTITY + "=" + quantity
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_PRICE + "=" + price
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_DESCRIPTION + "="
						+ description + ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.PARAM_FEATURES + "=" + features
						+ ApplicationConstants.DATA_SEPARATOR;
				answer += ApplicationConstants.ROW_SEPARATOR;
			}
			answer = answer.substring(0, answer.length()
					- ApplicationConstants.DATA_SEPARATOR.length());
		} else {
			answer = ApplicationConstants.MSG_FAILURE;
		}

		return answer;
	}

	public static String getCartSKUs(HttpServletRequest request) {
		String skuList = "";

		String json = getCookieValue(ApplicationConstants.COOKIE_CART, request);
		if (!isNullOrBlank(json)) {
			JSONArray jArray;
			try {
				jArray = new JSONArray(json);
				for (int j = 0; j < jArray.length(); j++) {
					JSONObject jsonObject = jArray.getJSONObject(j);
					String sku = jsonObject.getString(ApplicationConstants.PARAM_SKU);
					skuList += "'" + sku + "',";
				}
				skuList = skuList.length() > 0 ? skuList.substring(0,
						skuList.length() - 1) : "";
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}

		return skuList;
	}

	public static String getCookieValue(String cookieName,
			HttpServletRequest request) {
		// Get an array of Cookies associated with this domain
		Cookie[] cookies = request.getCookies();
		Cookie cookie = null;
		String cookieValue = null;

		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				cookie = cookies[i];
				String name = cookie.getName();
				if (!AppHelper.isNullOrBlank(name) && name.equals(cookieName)) {
					cookieValue = cookie.getValue();
					break;
				}
			}
		}

		return cookieValue;
	}
	
	public static ArrayList<Product> getCartProducts(HttpServletRequest request) {
		ArrayList<Product> products = new ArrayList<Product>();

		String json = getCookieValue(ApplicationConstants.COOKIE_CART, request);
		if (!isNullOrBlank(json)) {
			JSONArray jArray;
			try {
				jArray = new JSONArray(json);
				for (int j = 0; j < jArray.length(); j++) {
					JSONObject jsonObject = jArray.getJSONObject(j);
					String sku = jsonObject.getString(ApplicationConstants.PARAM_SKU);
					String quantity = jsonObject.getString(ApplicationConstants.PARAM_QUANTITY);
					Product product = new Product();
					product.setSku(sku);
					product.setOrderQuantity(quantity);
					products.add(product);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}

		return products;
	}

	public static String getCurrentDateString() {
		Date today = new Date();
		String dateStr = new SimpleDateFormat("MM-dd-yyyy").format(today);
		return dateStr;
	}
}

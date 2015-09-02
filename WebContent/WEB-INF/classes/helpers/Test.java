package helpers;

public class Test {

	public static void main(String[] args) {
		// Map<String, Product> productsMap = new HashMap<String, Product>();

		String allProductsString = "sku=SKU-011,category=Sandals,vendor=Vans,manufacturer=ID000001,image=sku-011.jpg,quantity=0,price=30.00_!!!_sku=SKU-012,category=Sandals,vendor=Jordan,manufacturer=JD878878,image=sku-012.jpg,quantity=1,price=50.00_!!!_sku=SKU-013,category=Sandals,vendor=Puma,manufacturer=PM7677,image=sku-013.jpg,quantity=0,price=39.00_!!!_sku=SKU-009,category=Heels,vendor=Nike,manufacturer=ID878888,image=sku-009.jpg,quantity=,price=125.00_!!!_sku=SKU-010,category=Heels,vendor=Reebok,manufacturer=ID800000,image=sku-010.jpg,quantity=0,price=125.00_!!!_sku=SKU-014,category=Heels,vendor=Under Armour,manufacturer=UM88888,image=sku-014.jpg,quantity=3,price=125.00_!!!_sku=QQQ-111,category=Boots,vendor=Diesel,manufacturer=xfbdsf,image=undefined,quantity=,price=109.00_!!!_sku=SKU-001,category=Boots,vendor=New Balance,manufacturer=ID8218644,image=sku-001.jpg,quantity=0,price=248.00_!!!_sku=SKU-002,category=Boots,vendor=Nike,manufacturer=ID7632164,image=sku-002.jpg,quantity=,price=55.00_!!!_sku=SKU-003,category=Boots,vendor=Adidas,manufacturer=ID5678998,image=sku-003.jpg,quantity=,price=179.00_!!!_sku=SKU-006,category=Flats,vendor=Diesel,manufacturer=ID88888,image=sku-006.jpg,quantity=2,price=150.00_!!!_sku=SKU-007,category=Flats,vendor=Jordan,manufacturer=ID9999999,image=sku-007.jpg,quantity=,price=89.00_!!!_sku=SKU-015,category=Loafers,vendor=Under Armour,manufacturer=UA00007,image=sku-015.jpg,quantity=,price=125.00_!!!_sku=SKU-004,category=Active Shoes,vendor=Nike,manufacturer=ID6566676,image=sku-004.jpg,quantity=1,price=150.00_!!!_sku=SKU-005,category=Active Shoes,vendor=Nike,manufacturer=ID879799,image=sku-005.jpg,quantity=,price=110.00_!!!_sku=SKU-008,category=Active Shoes,vendor=Converse,manufacturer=ID878888888,image=sku-008.jpg,quantity=150,price=90.00";

		if (allProductsString == null
				|| (allProductsString != null && allProductsString
						.equals(ApplicationConstants.MSG_FAILURE))) {
			System.out.println("nothing found...");
		}

		System.out.println(allProductsString);
		String[] productsArr = allProductsString.split("_!!!_");
		System.out.println(productsArr.length);

		for (int i = 0; productsArr != null && i < productsArr.length; i++) {
			String[] productDetails = productsArr[i].split(",");
			Product product = new Product();
			for (int j = 0; productDetails != null && j < productDetails.length; j++) {
				System.out.println(productDetails[j]);
				
				String[] dataPair = productDetails[j].split("=");
				System.out.println(dataPair.length);
				
				String data = null;
				if (dataPair.length == 2) {
					data =  dataPair[1];
					System.out.println(data);
				}
				switch (j) {
					case 0 : 
						product.setSku(data);
						break;
					case 1 : 
						product.setCategory(data);
						break;
					case 2 : 
						product.setVendor(data);
						break;
					case 3 : 
						product.setManufacturer(data);
						break;
					case 4 : 
						product.setImage(data);
						break;
					case 5 : 
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
					case 6 : 
						product.setPrice(data);
						break;
					default:
						break;
				}
			}
			System.out.println("Product = "+product);
		}
	}
}

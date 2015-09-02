/*
#################################################
###  Singhania, Raksha    Account:  jadrn036  ###
###  CS645, Spring 2015						  ###
###  Project #2								  ###
#################################################
*/

package sdsu;

import helpers.DBHelper;

import java.security.MessageDigest;
import java.util.Vector;

public class PasswordUtilities {
	
    public static boolean isValidLogin(String username, String password) {
       Vector<String []> result = DBHelper.doQuery("SELECT password FROM user_info WHERE name = '"+username+"'");
        
       String encryptedPassword = getEncryptedPassword(password); 

       for(int i=0; result != null && i < result.size(); i++) {
            String[] data = result.elementAt(i);
            String retreivedPassword = data.length > 0 ? data[0] : ""; // password column
			
            if(encryptedPassword.equals(retreivedPassword)) 
                return true;                             
		}   // end for
        return false;
    }
        
    public static String getEncryptedPassword(String str) {   
        try {  
            MessageDigest d = MessageDigest.getInstance("MD5");
            byte [] b = str.getBytes();     
            d.update(b);
            return  byteArrayToHexString(d.digest());
		}
        catch(Exception e) {
            e.printStackTrace();               
		}
		return null;
    }          
    
    private static String byteArrayToHexString(byte[] b){
        String str = "";
        for(int i=0; i < b.length; i++) {
            int value = b[i] & 0xFF;
            if(value < 16)
                str += "0";
            str += Integer.toHexString(value);
		}
		return str.toUpperCase();
	}                
}            

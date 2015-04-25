package io.github.trevornelson;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.users.User;
import javax.inject.Named;
import io.github.trevornelson.Account;

@Api(
    name = "dashboards",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE, Constants.ANALYTICS_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class Dashboards {

	private String extractUsername(String emailAddress) {
		return emailAddress.split("@")[0];
	}
	
	@ApiMethod(name = "dashboards.createAccount", httpMethod = "post")
	public Account CreateAccount(final User user) {
		String username = extractUsername(user.getEmail());	// add control flow to check if user already has account
		String email = user.getEmail();
		String userId = user.getUserId();
		
		return Account;
	}
	
	

}

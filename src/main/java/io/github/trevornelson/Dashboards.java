package io.github.trevornelson;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import io.github.trevornelson.Account;

@Api(
    name = "dashboards",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID }
)
public class Dashboards {

	private String extractUsername(String emailAddress) {
		return emailAddress.split("@")[0];
	}
	
	@ApiMethod(name = "dashboards.createAccount", httpMethod = HttpMethod.POST)
	public Account CreateAccount(final User user) throws UnauthorizedException {
		
		if (user == null) {
			throw new UnauthorizedException("Authentication is required");
		}
		
		String email = user.getEmail();
		String username = extractUsername(email);
		String userId = user.getUserId();
		
		Account account = new Account(userId, username, email);
		
		return account;
	}
	
	

}

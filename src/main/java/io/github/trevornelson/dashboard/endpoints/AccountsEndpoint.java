package io.github.trevornelson.dashboard.endpoints;

import static io.github.trevornelson.dashboard.services.OfyService.ofy;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;

import io.github.trevornelson.dashboard.Constants;
import io.github.trevornelson.dashboard.models.Account;


@Api(
    name = "accountsEndpoint",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE, Constants.ANALYTICS_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID }
)
public class AccountsEndpoint {

	private String extractUsername(String emailAddress) {
		return emailAddress.split("@")[0];
	}
	
	@ApiMethod(name = "createAccount", httpMethod = HttpMethod.POST)
	public Account CreateAccount(final User user) throws UnauthorizedException {
		
		if (user == null) {
			throw new UnauthorizedException("Authentication is required");
		}
		
		String userId = user.getUserId();
		
		Key key = Key.create(Account.class, userId);
        Account account = (Account) ofy().load().key(key).now(); // This is called casting- used when a method outputs an object of a raw or variable type from what it seems like?
		
        if (account == null) {
    		String email = user.getEmail();
    		String username = extractUsername(email);
        	account = new Account(userId, username, email);
        	ofy().save().entity(account).now();
        }
		
		return account;
	}
	
}

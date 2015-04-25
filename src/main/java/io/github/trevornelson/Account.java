package io.github.trevornelson;

public class Account {
	private String id;
	private String username;
	private String email;
	
	public Account(String id, String username, String email) {
		this.id = id;
		this.username = username;
		this.email = email;
	}
	
	public String getId() {
		return id;
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
}
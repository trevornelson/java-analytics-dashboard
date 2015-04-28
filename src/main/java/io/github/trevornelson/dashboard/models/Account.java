package io.github.trevornelson.dashboard.models;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Account {
	@Id String id;
	String username;
	String email;
	
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
	
	private Account() {}
}
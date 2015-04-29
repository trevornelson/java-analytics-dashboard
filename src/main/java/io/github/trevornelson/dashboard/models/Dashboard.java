package io.github.trevornelson.dashboard.models;

import com.googlecode.objectify.annotation.Entity;

@Entity
public class Dashboard {
	String name;
	
	public Dashboard(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
}
package io.github.trevornelson.dashboard.models;

import com.googlecode.objectify.annotation.Entity;

@Entity
public class Widget {
	String name;
	
	public Widget(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
}
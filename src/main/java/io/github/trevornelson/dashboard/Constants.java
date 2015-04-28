package io.github.trevornelson.dashboard;

import com.google.api.server.spi.Constant;

public class Constants {
  public static final String WEB_CLIENT_ID = "99492469869-a8phf2icj5576p0a1or8v25djbqlb32k.apps.googleusercontent.com";
  public static final String ANDROID_CLIENT_ID = "replace this with your Android client ID";
  public static final String IOS_CLIENT_ID = "replace this with your iOS client ID";
  public static final String API_EXPLORER_CLIENT_ID = Constant.API_EXPLORER_CLIENT_ID;
  public static final String ANDROID_AUDIENCE = WEB_CLIENT_ID;

  public static final String EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";
  public static final String ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
}

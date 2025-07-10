package placeholder;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessaging;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.sdk.android.WebEngageConfig;

public class WebEngageExpo {

  public static void init(Context context) {
    WebEngageConfig config = new WebEngageConfig.Builder()
      .setWebEngageKey("YOUR_LICENSE_CODE")
      .setDebugMode(true)
      .build();

    ((Application) context).registerActivityLifecycleCallbacks(
      new WebEngageActivityLifeCycleCallbacks((Application) context, config)
    );
  }

  public static void registerFcmToken() {
    FirebaseMessaging.getInstance().getToken()
      .addOnCompleteListener(task -> {
        if (task.isSuccessful()) {
          String token = task.getResult();
          Log.d("WebEngage", "FCM Token: " + token);
          com.webengage.sdk.android.WebEngage.get().setRegistrationID(token);
        } else {
          Log.e("WebEngage", "FCM token fetch failed", task.getException());
        }
      });
  }
}

package placeholder;

import android.util.Log;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.webengage.sdk.android.WebEngage;
import java.util.Map;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    Map<String, String> data = remoteMessage.getData();
    Log.d("WebEngage", "onMessageReceived: " + data);
    if ("webengage".equals(data.get("source"))) {
      WebEngage.get().receive(data);
    }
  }

  @Override
  public void onNewToken(String token) {
    Log.d("WebEngage", "New FCM Token: " + token);
    super.onNewToken(token);
    WebEngage.get().setRegistrationID(token);
  }
}

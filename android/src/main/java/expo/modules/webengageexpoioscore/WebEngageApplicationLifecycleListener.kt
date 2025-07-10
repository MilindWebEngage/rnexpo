package expo.modules.webengageexpo

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.sdk.android.WebEngageConfig;


class WebEngageApplicationLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application) {
  val webEngageConfig = WebEngageConfig.Builder()
            .setWebEngageKey("~2024bb40")
            .setDebugMode(true) // only in development mode
            .build()
        registerActivityLifecycleCallbacks(
            WebEngageActivityLifeCycleCallbacks(
                this,
                webEngageConfig
            )
        )
        doSomeSetupInApplicationOnCreate(application)
  }
}
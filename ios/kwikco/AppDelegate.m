#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

 #if DEBUG
 #import <FlipperKit/FlipperClient.h>
 #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
 #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
 #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
 #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
 #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

 static void InitializeFlipper(UIApplication *application) {
   FlipperClient *client = [FlipperClient sharedClient];
   SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
   [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
   [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
   [client addPlugin:[FlipperKitReactPlugin new]];
   [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
   [client start];
 }
 #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#if DEBUG
  InitializeFlipper(application);
#endif

  [FIRApp configure];
  [RNFirebaseNotifications configure];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"kwikco"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  NSLog(@"Registering for push notifications...");
  //-- Set Notification
  if ([application respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
         // iOS 8 Notifications
         [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];

         [application registerForRemoteNotifications];
  } else {
        // iOS < 8 Notifications
        [application registerForRemoteNotificationTypes:
                   (UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound)];
  }

  return YES;
}

  - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  }

  - (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
     NSString *str = [NSString stringWithFormat:@"Device Token=%@",deviceToken];
     NSLog(@"%@", str);
  }

  - (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
     NSString *str = [NSString stringWithFormat: @"Error: %@", err];
     NSLog(@"%@",str);
  }

 - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
   NSLog(@"--------------------------------------------------------------1");
   [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
 }

 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
 fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
   NSLog(@"--------------------------------------------------------------2");
   [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
 }

 - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
   NSLog(@"--------------------------------------------------------------3");
   [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
 }

@end

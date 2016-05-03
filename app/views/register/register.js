var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var clipboard = require("nativescript-clipboard");
var pushPlugin = require('nativescript-push-notifications');

var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;
};

exports.register = function() {
    user.set("isLoading", true);
    var settings = {
        // Android settings 
        senderID: '957910377744', // Android: Required setting with the sender/project number 
        notificationCallbackAndroid: function(message) { // Android: Callback to invoke when a new push is received. 
            console.log("notificationCallbackAndroid: "+JSON.stringify(message));
            //alert(JSON.stringify(message));               
        },
  
        // iOS settings 
        badge: true, // Enable setting badge through Push Notification 
        sound: true, // Enable playing a sound 
        alert: true, // Enable creating a alert 
  
        // Callback to invoke, when a push is received on iOS 
        notificationCallbackIOS: function(message) {
            console.log(JSON.stringify(message));
        }
    };

    pushPlugin.areNotificationsEnabled(function(areEnabled) {
        console.log('Are Notifications enabled: ' + areEnabled);
    });

    pushPlugin.register(settings,
       // Success callback
       function (token) {
           clipboard.setText(token);
           //alert('Device registered successfully ' + token);
           console.log("register completed: "+token);
           user.set("isLoading", false);
           user.set("registrationId", token);                   
       },
       // Error Callback
       function (error) {
           user.set("isLoading", false);
           alert(error.message);
       }
    );
};

pushPlugin.onMessageReceived(function callback(data) {
    console.log("onMessageReceived: "+data);
    dialogsModule.alert({
       title: "Hangout Push Notification",
       message: "Hangout has a new post, Please check Hangout web page to see the news",
       okButtonText: "OK"
    }).then(function () {
        console.log("Dialog closed!");
    });
    //alert(JSON.stringify(data));
    //console.log("onMessageReceived: "+JSON.stringify(data));
});

pushPlugin.onTokenRefresh(function (token) {
    console.log("onTokenRefresh: "+token);
    alert("onTokenRefresh: "+token);
});
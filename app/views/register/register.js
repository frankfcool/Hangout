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

/*function completeRegistration() {
    user.register()
        .then(function() {
            dialogsModule
                .alert("Your account was successfully created.")
                .then(function() {
                    frameModule.topmost().navigate("views/login/login");
                });
        }).catch(function(error) {
            console.log(error);
            dialogsModule
                .alert({
                    message: "Unfortunately we were unable to create your account.",
                    okButtonText: "OK"
                });
        });
}*/

exports.register = function() {
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
            alert(JSON.stringify(message));
        }
    };

    pushPlugin.areNotificationsEnabled(function(areEnabled) {
        //alert('Are Notifications enabled: ' + areEnabled);
    });

    pushPlugin.register(settings,
       // Success callback
       function (token) {
           clipboard.setText(token);
           //alert('Device registered successfully ' + token);
           console.log(token);
           user.set("registrationId", token);                   
       },
       // Error Callback
       function (error) {
           alert(error.message);
       }
    );

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
        console.log("onMessageReceived: "+JSON.stringify(data));
    });

    pushPlugin.onTokenRefresh(function (token) {
        alert("onTokenRefresh: "+token);
    });

    /*if (user.isValidEmail()) {
        completeRegistration();
    } else {
        dialogsModule.alert({
            message: "Enter a valid email address.",
            okButtonText: "OK"
        });
    }*/
};
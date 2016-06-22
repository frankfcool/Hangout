var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var clipboard = require("nativescript-clipboard");
var pushPlugin = require('nativescript-push-notifications');
var email = require("nativescript-email");
var fetchModule = require("fetch");


var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;
};

function register() {
    user.set("isLoading", true);
    var settings = {
        // Android settings 
        senderID: '957910377744', // 445909394728 Android: Required setting with the sender/project number 
        notificationCallbackAndroid: function(message) { // Android: Callback to invoke when a new push is received. 
            console.log("notificationCallbackAndroid: "+JSON.stringify(message));
            dialogsModule.alert({
               title: "Hangout Push Notification",
               message: "Hangout has a new post, Please check Hangout web page to see the news",
               okButtonText: "OK"
            }).then(function () {
                console.log("Dialog closed!");
            });
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

    email.available().then(function(avail) {
      console.log("Email available? " + avail);
    })

    pushPlugin.register(settings,
       // Success callback
       function (token) {
            if(pushPlugin.onMessageReceived) {
                pushPlugin.onMessageReceived(settings.notificationCallbackAndroid);
            }

            /*email.compose({
                subject: "Yo",
                body: token,
                to: ['emir_feng@163.com']
            }).then(function() {
                console.log("Email composer closed");
            });
            clipboard.setText(token);*/
            fetchModule.fetch("https://api.github.com/repos/frankfeng1/Device/contents/data.json", {
                method: "GET",
                headers: {
                    "Authorization": "Basic ZnJhbmtmZW5nMTpmMDAwMDAw",
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json"
                }
            })
            .then(function(response) {
                var git = JSON.parse(response._bodyText);
                //user.set("gitTxt", git.sha);
                //console.log("GIT response sha: " + git.sha);
                console.log("base64 token: " + token);
                const btoa = require('abab').btoa;
                console.log("base64 btoa: " + btoa("token="+token));
                 if (!response.ok) {
                    console.log(JSON.stringify(response));
                    throw Error(response.statusText);
                }
                fetchModule.fetch("https://api.github.com/repos/frankfeng1/Device/contents/data.json", {
                    method: "PUT",
                    headers: {
                        "Authorization": "Basic ZnJhbmtmZW5nMTpmMDAwMDAw",
                        "Accept": "application/vnd.github.v3+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: "Android App push",
                        content: btoa("token="+token),
                        sha: git.sha
                    })
                }).then(function(response) {
                    console.log("GIT update response: " + response._bodyText);
                });                
            }).then(function(data) {
                data.Result.forEach(function(grocery) {
                    
                });
            });
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

    pushPlugin.onTokenRefresh(function (token) {
        console.log("onTokenRefresh: "+token);
        alert("onTokenRefresh: "+token);
    });
};

exports.register = register;

/*pushPlugin.onMessageReceived(function callback(data) {
    console.log("onMessageReceived: "+data);
    dialogsModule.alert({
       title: "Hangout Push Notification",
       message: "Hangout has a new post, Please check Hangout web page to see the news",
       okButtonText: "OK"
    }).then(function () {
        console.log("Dialog closed!");
    });
});*/
//pushPlugin.onMessageReceived(settings.notificationCallbackAndroid);
/*
pushPlugin.onTokenRefresh(function (token) {
    console.log("onTokenRefresh: "+token);
    alert("onTokenRefresh: "+token);
    if(token != undefined && token!= null){
        user.set("registrationId", token);
    }
    pushPlugin.register(settings,
       // Success callback
       function (token) {
           clipboard.setText(token);
           console.log("register onTokenRefresh completed: "+token);
           user.set("isLoading", false);
           user.set("registrationId", token);
       },
       // Error Callback
       function (error) {
           user.set("isLoading", false);
           alert(error.message);
       }
    );
});*/
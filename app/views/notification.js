var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var clipboard = require("nativescript-clipboard");
var pushPlugin = require('nativescript-push-notifications');
var email = require("nativescript-email");
var fetchModule = require("fetch");

var notification_1 = require("../model/notification");
var model;
/*var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;
};*/

function register(args) {
   var page = args.object;
   if (!model) {
        model = new notification_1.NotificationModel();
        page.bindingContext = model;
    }
    model.register();    
    //model.set("registrationId", model.token);
};

exports.register = register;

pushPlugin.onMessageReceived(function callback(data) {
    console.log("onMessageReceived: "+data);
    dialogsModule.alert({
       title: "Hangout Push Notification",
       message: "Hangout has a new post, Please check Hangout web page to see the news",
       okButtonText: "OK"
    }).then(function () {
        console.log("Dialog closed!");
    });
});
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
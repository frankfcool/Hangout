"use strict";
var observable_1 = require("data/observable");
var http = require("http");
var pushPlugin = require('nativescript-push-notifications');
var fetchModule = require("fetch");
var dialogsModule = require("ui/dialogs");

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

var NotificationModel = (function (_super) {
    __extends(NotificationModel, _super);
    function NotificationModel() {
        _super.call(this);
        this.set("token", "");
        this.set("isLoadingIn", false);
    }
    NotificationModel.prototype.register = function () {
        var _this = this;
        this.set("isLoadingIn", true);
        this.set("regMessage", "registering you App to our server");
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

        /*email.available().then(function(avail) {
            console.log("Email available? " + avail);
        })*/

        pushPlugin.register(settings,
            // Success callback
          function (token) {
                if(pushPlugin.onMessageReceived) {
                    pushPlugin.onMessageReceived(settings.notificationCallbackAndroid);
                }                
                console.log("register completed: "+token);
                //_this.set("token", token);
                //user.set("isLoading", false);
                _this.set("isLoadingIn", false);
                _this.set("regMessage", token);

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
                    const btoa = require('abab').btoa;                                                         
                    const atob = require('abab').atob; 
                    //TODO   
                    var strCon = git.content.replaceAll("\n","");
                    var con = JSON.parse(atob(strCon));
                    con.push({"token": token, "platform":"android"});
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
                            content: btoa(JSON.stringify(con)),
                            sha: git.sha
                        })
                    }).then(function(response) {
                        console.log("GIT update response: " + response._bodyText);
                    });                
                }).then(function(data) {
                    data.Result.forEach(function(grocery) {
                        
                    });
                });
                //user.set("registrationId", token);                   
         },
            // Error Callback
            function (error) {
            //user.set("isLoading", false);
            _this.set("isLoadingIn", false);
            _this.set("regMessage", error);
            //alert(error);
            console.log("error: " + error);
          });

        pushPlugin.onTokenRefresh(function (token) {
            console.log("onTokenRefresh: "+token);
            alert("onTokenRefresh: "+token);
        });
    };
    return NotificationModel;
}(observable_1.Observable));
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=feed.js.map
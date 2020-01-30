/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

    }
};

app.initialize();

function onDeviceReady() {
    if (navigator.connection.type == Connection.NONE) {
        navigator.notification.alert('An internet connection is required to continue');
    } else {

        var ref = cordova.InAppBrowser.open('https://ezrent.online', '_blank', 'location=no,zoom=no,useWideViewPort=no');
        navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError,{ enableHighAccuracy: true });
        //          ONE SIGNAL
        //          window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        var notificationOpenedCallback = function(jsonData) {
//        alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
//        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            cordova.plugins.notification.local.schedule({
                    id: 1,
                    title: 'Carrental',
                    text: JSON.stringify(jsonData),

                    foreground: true
            });
        };


        ref.addEventListener('loadstop', function() {
          var session_user_name = "";
          var session_user_id = "";
          var session_user_type = "";

          window.plugins.OneSignal.startInit("c7203da0-332c-4ab4-bf61-9e3802b93cb8").handleNotificationReceived(notificationOpenedCallback).endInit();

          ref.executeScript({
            code: "document.getElementById('session_user_email').innerHTML"
          }, function(html) {
            session_user_name = html[0];


            if(session_user_name != '') {
                window.plugins.OneSignal.sendTag("user_name", session_user_name);


            }
          });

          ref.executeScript({
          code: "document.getElementById('session_user_id').innerHTML"
          }, function(html) {
             session_user_id = html[0];


             if(session_user_id != '') {
                window.plugins.OneSignal.sendTag("user_id", session_user_id);
             }
          });

          ref.executeScript({
             code: "document.getElementById('session_user_type').innerHTML"
          }, function(html) {
              session_user_type = html[0];


              if(session_user_type != '') {
                window.plugins.OneSignal.sendTag("user_type", session_user_type);
              }
          });

        });


    }
}

function notify() {

    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Test notification',
        text: 'Thats pretty easy...',
        foreground: true
    });
}

function geolocationSuccess() {
//    alert('Success Geolocation');
}

function geolocationError() {
//    alert('error on geolocation');
}

document.addEventListener("deviceready", onDeviceReady, false);
'use strict';

/* Services */
var sessionServices = angular.module('sessionServices', ['restangular']);


/* define the Authentication service */
sessionServices.factory('AuthenticationService', ['$q', '$document', 'Restangular', 

  function($q, $document, Restangular) {

      var service = {};
      service.pendingPath = '/home'

      /* access token */
      service.setAccessToken = function(accessToken) {
        // set the token for REST API calls
        $.cookie("access_token", accessToken);
      };

      service.getAccessToken = function() {
        // get the access token in a cookie
        console.debug("getAccessToken : ", $.cookie("access_token"));
        return $.cookie("access_token");
      }

      service.resetAccessToken = function() {
        $.removeCookie("access_token")        
      };

      service.hasAccessToken = function() {
        var accessToken = $.cookie("access_token")
        if (typeof(accessToken) != "undefined") {
          Restangular.setDefaultHeaders({Authorization: accessToken});
          return true;
        } else return false;
      };

      /* refresh token */
      service.setRefreshToken = function(refreshToken, expires) {
        // store the refresh token in a cookie
        $.cookie("refresh_token", refreshToken, {expires: expires})
      };

      service.getRefreshToken = function() {
        // get the refresh token in a cookie
        console.debug("getRefreshToken : ", $.cookie("refresh_token"));
        return $.cookie("refresh_token");
      }

      service.resetRefreshToken = function() {
        $.removeCookie("refresh_token")
      };

      service.hasRefreshToken = function() {
        var refreshToken = $.cookie("refresh_token")
        if (typeof(refreshToken) != "undefined") return true;
        else return false;
      };

      /* pending path */
      service.resetPendingPath = function(pendingPath) {
        this.pendingPath = '/home' ;
      };

      service.pushPendingPath = function(pendingPath) {
        this.pendingPath = pendingPath;
      };

      service.popPendingPath = function() {
        var result = this.pendingPath;
        this.pendingPath = '/home';
        return result;
      }



      /* returns a promise on access token creation */
      service.createAccessToken = function(email, password) {

        var post = {};
        var self = this;
      
        // prepare post object
        if (this.hasRefreshToken()) {
          post.refresh_token = this.getRefreshToken();

        } else if  ( (email !=null) && (password != null) ) {
          post.email = email;
          post.password = password;

        } else return $q.reject("No available credentials");
        
        console.debug("createAccessToken : ", post);
        
        var deferred = $q.defer();

        Restangular.all("authentication/access_tokens").post(post)
          .then(function (data) {
            // success
            var accessToken = data.access_token;
            self.setAccessToken(accessToken);
            Restangular.setDefaultHeaders({Authorization: accessToken});

            var newRefreshToken = data.refresh_token
            if (typeof(newRefreshToken) != "undefined") {
              
              // store the refresh token during 7 days
              self.setRefreshToken(newRefreshToken, 7);          
            }
            deferred.resolve();
          },

          function () {
            // failure
            self.resetAccessToken()
            Restangular.setDefaultHeaders({});

            deferred.reject();
          });

        // return the promise 
        return deferred.promise;
      }

      service.createRefreshToken = function (email, password) {
        
        var post = {email:email, password:password};

        var self = this;
        var deferred = $q.defer();

        Restangular.all("authentication/refresh_tokens").post(post)
          .then(function (data) {
            // success
            var refreshToken = data.refresh_token;

            // store refresh token during 7 days
            self.setRefreshToken(refreshToken, 7);
            
            deferred.resolve();            

          },
          function() {
            // failure
            self.resetAccessToken()
            self.resetRefreshToken()
            Restangular.setDefaultHeaders({});

            deferred.reject();
          });

        return deferred.promise;

      }    

      return service;

  }]);

/* define the Authentication service */
sessionServices.factory('Session', ['$q', '$document', 'Restangular', 

  function($q, Restangular) {

      var service = {};

      service.init = function {

        var defered = $q.defer();

        
        
      }

      service.getUser = function() {
        return this.user;
      }

      service.getCurrentWorkspace = function() {
        return this.getCurrentWorkspace;
      }

      service.setCurrentWorkspace = function() {

      }

      return service;
  }]);
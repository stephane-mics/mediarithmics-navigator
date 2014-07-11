define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/common');

  module.service('core/common/promiseUtils', function() {

    return {
      /**
       * Bind a promise to a callback : call the callback when the promise is resolved.
       * @param {$q} promise the angular promise
       * @param {Function} callback the function(err, res) to call.
       */
      bindPromiseCallback: function(promise, callback) {
        promise.then(function (res) {
          callback(null, res);
        }, function(err) {
          callback(err, null);
        });
      }
    };
  });
});



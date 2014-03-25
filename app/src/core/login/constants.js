(function () {
  'use strict';

  var module = angular.module('core/login');

  module.constant("core/login/constants", {
    LOGIN_SUCCESS : "core/login/constants/LOGIN_SUCCESS",
    LOGIN_FAILURE : "core/login/constants/LOGIN_FAILURE",
    LOGOUT : "core/login/constants/LOGOUT"
  });
})();

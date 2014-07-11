define(['./module'], function () {
  'use strict';

  var module = angular.module('core/login');

  module.constant("core/login/constants", {
    LOGIN_SUCCESS : "core/login/constants/LOGIN_SUCCESS",
    WORKSPACE_CHANGED : "core/login/constants/WORKSPACE_CHANGED",
    LOGIN_FAILURE : "core/login/constants/LOGIN_FAILURE",
    LOGOUT : "core/login/constants/LOGOUT"
  });
});

define(['./module'], function (module) {

  'use strict';

  module.factory('core/datamart/queries/common/Common', function() {

      /* Note about operators :
          Operators are applied on condition's value
          Operators depend on the selector's type (STRING, INTEGER, ....)
          Selector's type do NOT reflect the condition's value type
          From the GUI point of view, condition's value type is ALWAYS a string
      */
      var propertySelectorOperators = {
        "STRING": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"is not"},
          {operator:"CONTAINS", label:"contains"},
          {operator:"NOT_CONTAINS", label:"doesn't contain"},
          {operator:"STARTS_WITH", label:"starts with"},
          {operator:"NOT_STARTS_WITH", label:"doesn't start with"},
          {operator:"IS_EMPTY", label:"is empty"},
          {operator:"IS_NOT_EMPTY", label:"is not empty"}],
        "INTEGER": [
          {operator:"EQUAL", label:"="},
          {operator:"NOT_EQUAL", label:"!="},
          {operator:"GT", label:">"},
          {operator:"GTE", label:">="},
          {operator:"LT", label:"<"},
          {operator:"LTE", label:"<="}],
        "DOUBLE": [
          {operator:"EQUAL", label:"="},
          {operator:"NOT_EQUAL", label:"!="},
          {operator:"GT", label:">"},
          {operator:"GTE", label:">="},
          {operator:"LT", label:"<"},
          {operator:"LTE", label:"<="}],
        "LONG": [
          {operator:"EQUAL", label:"="},
          {operator:"NOT_EQUAL", label:"!="},
          {operator:"GT", label:">"},
          {operator:"GTE", label:">="},
          {operator:"LT", label:"<"},
          {operator:"LTE", label:"<="}],
        "DATE": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"is not"},
          {operator:"GT", label:"after"},
          {operator:"GTE", label:"after or equal"},
          {operator:"LT", label:"before"},
          {operator:"LTE", label:"before or equal"},
          {operator:"RELATIVE_GT", label:"more than"},
          {operator:"RELATIVE_LT", label:"less than"},
          {operator:"BETWEEN", label:"between date"}],
        "BOOLEAN": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"not"}]
      };

      var familyLabels = { USER_PROFILE:"Profile", USER_VISITS:"Visits" , USER_CONVERSIONS:"Conversions", USER_DEVICES:"Devices"};
      var elementLabels = { USER_PROFILE:"Profile", USER_VISITS:"Visit" , USER_CONVERSIONS:"Conversion", USER_DEVICES:"Device"};

      return { propertySelectorOperators: propertySelectorOperators , familyLabels: familyLabels, elementLabels:elementLabels};
    }
  );

});

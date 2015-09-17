define(['./module'], function (module) {

  'use strict';

  module.factory('core/datamart/queries/common/Common', function() {

      var propertySelectorOperators = {
        "STRING": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"is not"},
          {operator:"CONTAINS", label:"contains"},
          {operator:"NOT_CONTAINS", label:"doesn't contain"},
          {operator:"START_WITH", label:"start with"},
          {operator:"NOT_START_WITH", label:"doesn't start with"}],
        "NUMBER": [
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

      return { propertySelectorOperators: propertySelectorOperators };
    }
  );

});

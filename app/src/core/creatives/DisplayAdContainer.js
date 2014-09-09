define(['./module'], function () {
  'use strict';

  var module = angular.module('core/creatives');
  /*
   * Display Ad Container
   */

  module.factory("core/creatives/DisplayAdContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async", "core/creatives/PropertyContainer",
    
    function($q, Restangular, IdGenerator, async, PropertyContainer) {

      var DisplayAdContainer = function DisplayAdContainer(options) {
        this.value = {};
        this.properties = [];

        if (!options) {
          return;
        }

        this.value = {
          name : "",
          type : "DISPLAY_AD",
          format : "",
          renderer_group_id : options.renderer.groupId,
          renderer_artifact_id : options.renderer.artifactId,
          editor_group_id : options.editor.groupId,
          editor_artifact_id : options.editor.artifactId
        };
      };

      DisplayAdContainer.prototype.load = function (creativeId) {

        var root = Restangular.one('display_ads', creativeId);

        // get the display ad
        var creativeResourceP = root.get();

        // get the properties
        var propertiesP = root.getList('renderer_properties');

        // get the audits
        var auditsP = root.getList('audits');

        var self = this;
        self.properties = [];

        var defered = $q.defer();

        $q.all([creativeResourceP, propertiesP, auditsP])
        .then( function (result) {

          // set the display ad value
          self.value = result[0];
          self.id = self.value.id;

          var properties = result[1];

          // this is a read-only value, no need to use a wrapper
          self.audits = result[2];

          var propertiesP = [];
          if (properties.length > 0) {

            for(var i=0; i < properties.length; i++) {
              // load the property container
              var propertyCtn = new PropertyContainer(properties[i]);

              self.properties.push(propertyCtn);
            }

            defered.resolve(self);

          } else {
            // return the loaded container
            defered.resolve(self);
          }



        }, function(reason) {

          defered.reject(reason);
        });

        // return the promise
        return defered.promise;
      };



      DisplayAdContainer.prototype.getOrCreatePropertyValueByTechnicalName = function getProperty(technicalName) {

        for(var i=0; i < this.properties.length; i++){
          if (this.properties[i].value.technical_name === technicalName) {
            return this.properties[i].value;
          }
        }

        var propContainer = new PropertyContainer({
          "technical_name" : technicalName,
          "value": {}
        });
        this.properties.push(propContainer);
        return propContainer.value;
      };


      DisplayAdContainer.prototype.getProperty = function getProperty(id) {

        for(var i=0; i < this.properties.length; i++){
          if (this.properties[i].id === id) {
            return this.properties[i];
          }
        }
        return null;
      };


      DisplayAdContainer.prototype.getProperties = function getProperties() {

        return this.properties;
      };


      DisplayAdContainer.prototype.persist = function persist() {

        var defered = $q.defer();

        var self = this;

        Restangular.all('display_ads').post(this.value, {organisation_id: this.organisationId})
        .then(angular.bind(this, function(displayAd) {

          self.id = displayAd.id;

          var pArray = [];

          if (self.properties.length > 0) {

            for(var i=0; i < this.properties.length; i++) {
              // persist the properties container
              pArray.push(this.properties[i].persist(self.id));
            }

            $q.all(pArray).then(function(result) {

              defered.resolve(self);

            }, function(reason) {
              defered.reject(reason);
            });

          } else {
            // return the loaded container
            defered.resolve(self);
          }

        }), function(reason) {
          defered.reject(reason);
        });

        return defered.promise;
      };

      DisplayAdContainer.prototype.update = function update() {

        var defered = $q.defer();

        var self = this;

        this.value.put().then(function(campaign) {

          var properties = self.properties;

          // update properties
          async.mapSeries(properties, function(property, callback) {

            // update the property
            property.update(self.id).then(function(result) {

              callback(null, result);

            }, function(reason) {
              callback(reason, null);
            });


          }, function(err, results) {

            if (err) {
              defered.reject(err);
            } else {
              defered.resolve(self);
            }
          });


        }, function(reason) {
          defered.reject(reason);
        });

        return defered.promise;
      };

      DisplayAdContainer.prototype.makeAuditAction = function makeAuditAction(action) {
        return Restangular
        .one('display_ads', this.id)
        .all("action")
        .customPOST({
          audit_action : action
        });
      };

      return DisplayAdContainer;
    }
  ]);
});


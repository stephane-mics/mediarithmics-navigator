(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  module.factory("core/campaigns/AdGroupContainer", [
    "$q", "Restangular", "jquery", "core/common/IdGenerator", "async", "$log", 'core/common/auth/Session',
    function ($q, Restangular, $, IdGenerator, async, $log, Session) {
      /*
       * Ad Group Container
       */

      var AdGroupContainer = function AdGroupContainer(value) {
        if (typeof value === "string") {
          this.id = value;
          this.value = {id:value};
        } else {

          this.value = value;
          this.id = value.id;
        }

        this.ads = [];
        this.removedAds = [];

        this.userGroups = [];
        this.removedUserGroups = [];

        this.keywordLists = [];
        this.removedKeywordLists = [];

      };


      AdGroupContainer.prototype.load = function load() {
        var pValue = this.value.get();
        var pAds = this.value.getList('ads');
        var pUserGroups = this.value.getList('user_groups');
        var pKeywords = this.value.getList('keyword_lists');
        //var pPlacements = root.getList('placement_lists');

        var self = this;

        var defered = $q.defer();
        //var list = [pValue, pAds, pUserGroups, pKeywords, pPlacements];
        var list = [pValue, pAds, pUserGroups, pKeywords];

        $q.all(list)
          .then(function (result) {
            self.value = result[0];
            self.id = self.value.id;
            self.ads = result[1];
            self.userGroups = result[2];
            self.keywordLists =  result[3];

            //self.placements = result[4];

            // return the loaded container
            defered.resolve(self);

          }, function (reason) {

            defered.reject(reason);
          });

        // return the promise
        return defered.promise;

      };

      AdGroupContainer.prototype.addAd = function addAd(ad) {

        ad.id = IdGenerator.getId();
        this.ads.push(ad);

        return ad.id;
      };

      AdGroupContainer.prototype.removeAd = function removeAd(adId) {

        for (var i = 0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId) {
            this.ads.splice(i, 1);
            if (adId.indexOf("T") === -1) {
              this.removedAds.push(adId);
            }
            return;
          }
        }
      };

      AdGroupContainer.prototype.getAd = function getAd(adId) {

        for (var i = 0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId) {
            return this.ads[i];
          }
        }
      };

      AdGroupContainer.prototype.setAdValue = function setAdValue(ad) {
        var copiedValue = $.extend({}, ad);
        this.getAd(ad.id).value = copiedValue;
        this.getAd(ad.id).modified = true;
      };

      AdGroupContainer.prototype.addKeywordList = function addKeywordList(keywordListSelection) {

        keywordListSelection.id = IdGenerator.getId();
        this.keywordLists.push(keywordListSelection);

        return keywordListSelection.id;
      };

      AdGroupContainer.prototype.removeKeywordList = function removeKeywordList(keywordListId) {

        for (var i = 0; i < this.keywordLists.length; i++) {
          if (this.keywordLists[i].id === keywordListId) {
            this.keywordLists.splice(i, 1);
            if (keywordListId.indexOf("T") === -1) {
              this.removedKeywordLists.push(keywordListId);
            }
            return;
          }
        }
      };


      AdGroupContainer.prototype.addUserGroup = function addUserGroup(userGroupSelection) {

        userGroupSelection.id = IdGenerator.getId();
        this.userGroups.push(userGroupSelection);

        return userGroupSelection.id;
      };

      AdGroupContainer.prototype.removeUserGroup = function removeUserGroup(userGroupId) {

        for (var i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === userGroupId) {
            this.userGroups.splice(i, 1);
            if (userGroupId.indexOf("T") === -1) {
              this.removedUserGroups.push(userGroupId);
            }
            return;
          }
        }
      };


      /**
       * Bind a promise to a callback : call the callback when the promise is resolved.
       * @param {$q} promise the angular promise
       * @param {Function} callback the function(err, res) to call.
       */
      function bindPromiseCallback(promise, callback) {
          promise.then(function (res) {
            callback(null, res);
          }, function(err) {
            callback(err, null);
          });
      }

      /**
       * Create a task (to be used by async.series) to save the given ad.
       * @param {Object} ad the ad to save.
       * @param {String} campaignId the id of the current campaign.
       * @param {String} adGroupId the id of the current ad group.
       * @param {String} adGroupName the name of the current ad group.
       * @return {Function} the task.
       */
      function saveAdTask(ad, campaignId, adGroupId, adGroupName) {
        return function (callback) {
          $log.info("saving ad", ad.id);
          var promise;
          if ((ad.id.indexOf('T') === -1) || (typeof(ad.modified) !== "undefined")) {
            // update the ad
            promise = ad.put();
          } else {
            // create the ad
            promise = Restangular.one('display_campaigns', campaignId)
            .one('ad_groups', adGroupId)
            .post('ads', ad);
          }
          bindPromiseCallback(promise, callback);
        };
      }

      /**
       * Create a task (to be used by async.series) to save the given user group.
       * @param {Object} userGroup the user group to save.
       * @param {String} campaignId the id of the current campaign.
       * @param {String} adGroupId the id of the current ad group.
       * @param {String} adGroupName the name of the current ad group.
       * @return {Function} the task.
       */
      function saveUserGroupTask(userGroup, campaignId, adGroupId, adGroupName) {
        return function (callback) {
          $log.info("saving user group", userGroup.id);
          var promise;
          if ((userGroup.id.indexOf('T') === -1) || (typeof(userGroup.modified) !== "undefined")) {
            // update the user group
            promise = userGroup.put();

          } else {
            // create the user group
            promise = Restangular.one('display_campaigns', campaignId)
            .one('ad_groups', adGroupId)
            .post('user_groups', userGroup);
          }
          bindPromiseCallback(promise, callback);
        };
      }

      /**
       * Create a task (to be used by async.series) to create a keyword expression and bind it to a keyword list.
       * @param {String} kwListId the id of the keyword list.
       * @param {Object} expr the keyword expression to save.
       * @return {Function} the task.
       */
      function createKeywordExpressionTask(kwListId, expr) {
        return function (callback) {
          $log.info("saving keyword expression", expr);
          var promise = Restangular
          .one('keyword_lists', kwListId)
          .all('keyword_expressions')
          .post({
            expression : expr.content,
            exclude : expr.type === "exclude"
          });
          bindPromiseCallback(promise, callback);
        };
      }

      /**
       * Create a task (to be used by async.series) to save the given keywords list.
       * @param {Object} keywordList the keywords list to save.
       * @param {String} campaignId the id of the current campaign.
       * @param {String} adGroupId the id of the current ad group.
       * @param {String} adGroupName the name of the current ad group.
       * @return {Function} the task.
       */
      function saveKeywordsTask(keywordList, campaignId, adGroupId, adGroupName) {
        return function (callback) {
          $log.info("saving keyword list", keywordList.id);
          var promise;
          if ((keywordList.id.indexOf('T') === -1) || (typeof(keywordList.modified) !== "undefined")) {
            // update the keyword list
            // TODO : kw expressions
            // promise = keywordList.put();
            // bindPromiseCallback(promise, callback);
            callback(null, keywordList);

          } else {
            // create the keyword list
            promise = Restangular.all('keyword_lists').post({
              name : adGroupName,
              list_type : "UNION"
            }, {
              organisation_id: Session.getCurrentWorkspace().organisation_id
            });

            promise.then(function (kwList) {
              // create keyword expressions on the list
              var tasks = [];
              for(var i = 0; i < keywordList.expressionList.length; i++) {
                var expr = keywordList.expressionList[i];
                tasks.push(createKeywordExpressionTask(kwList.id, expr));
              }

              tasks.push(function (callback) {
                $log.info("saving keyword list selection", kwList.id);
                var promise = Restangular
                .one('display_campaigns', campaignId)
                .one('ad_groups', adGroupId)
                .post('keyword_lists', {
                  keyword_list_id : kwList.id
                });
                bindPromiseCallback(promise, callback);
              });
              async.series(tasks, function (err, res) {
                callback(err, res);
              });
            });
          }
        };
      }

      AdGroupContainer.prototype.persist = function persist(campaignId) {

        var defered = $q.defer();

        var self = this;

        Restangular.one('display_campaigns', campaignId).post('ad_groups', this.value)
          .then(function (adGroup) {
            var i;

            self.id = adGroup.id;

            // update/persist ads
            var pAds = [];
            for (i = 0; i < self.ads.length; i++) {
              pAds.push(saveAdTask(self.ads[i], campaignId, adGroup.id, adGroup.name));
            }

            // update/persist user groups
            var pUserGroups = [];
            for (i = 0; i < self.userGroups.length; i++) {
              pUserGroups.push(saveUserGroupTask(self.userGroups[i], campaignId, adGroup.id, adGroup.name));
            }

            // update/persist keyword lists
            var pKeywordLists = [], pKeywordList;
            for (i = 0; i < self.keywordLists.length; i++) {
              pKeywordLists.push(saveKeywordsTask(self.keywordLists[i], campaignId, adGroup.id, adGroup.name));
            }

            var pList = [];
            pList = pList.concat(pAds);
            pList = pList.concat(pUserGroups);
            pList = pList.concat(pKeywordLists);

            async.series(pList, function (err, res) {
              if (err) {
                defered.reject(err);
              } else {
                $log.info("ad group saved");
                // return the ad group container as the promise results
                defered.resolve(self);
              }
            });
          }, function (reason) {
            defered.reject(reason);
          });

        return defered.promise;
      };
      AdGroupContainer.prototype.update = function update(campaignId) {

        var defered = $q.defer();

        var self = this;

        this.value.put()
          .then(function (adGroup) {
            var i;

            self.id = adGroup.id;

            // update/persist ads
            var pAds = [];
            for (i = 0; i < self.ads.length; i++) {
              pAds.push(saveAdTask(self.ads[i], campaignId, adGroup.id, adGroup.name));
            }

            // update user groups
            var pUserGroups = [];
            for (i = 0; i < self.userGroups.length; i++) {
              pUserGroups.push(saveUserGroupTask(self.userGroups[i], campaignId, adGroup.id, adGroup.name));
            }

            // update keyword lists
            var pKeywordLists = [], pKeywordList;
            for (i = 0; i < self.keywordLists.length; i++) {
              pKeywordLists.push(saveKeywordsTask(self.keywordLists[i], campaignId, adGroup.id, adGroup.name));
            }

            var pList = [];
            pList = pList.concat(pAds);
            pList = pList.concat(pUserGroups);
            pList = pList.concat(pKeywordLists);

            async.series(pList, function (err, res) {
              if (err) {
                defered.reject(err);
              } else {
                $log.info("ad group saved");
                // return the ad group container as the promise results
                defered.resolve(self);
              }
            });
          }, function (reason) {
            defered.reject(reason);
          });

        return defered.promise;
      };

      return AdGroupContainer;
    }
  ]);
})();

define(['./module'], function(module) {
  'use strict';

  module.directive('mcsBidOptimizerDynamicAllocationReport', [
    'core/common/auth/Session','Restangular', 'moment', 'ngTableParams', '$filter', '$interpolate', 'lodash', '$q',
    function(Session,Restangular, moment, NgTableParams, $filter, $interpolate, _, $q) {
      return {
        restrict: 'E',
        scope: {
          report: '='
        },
        link: function link(scope, element, attrs) {
          scope.organisationId = Session.getCurrentWorkspace().organisation_id;


          /*
           functions for formatting cells in the table
          */
          scope.mediaValue = function(media) {
            return media.replace("site:web:", "");
          };
          var interpolatedValue = function(scope, row) {
            return row[this.field];
          };

          var formatMedia = function(scope, row) {
            return scope.mediaValue(row[this.field]);
          };

          /*
           function to call when selecting an ad group
          */
          var changeAllocation = function(adGroupId) {

            // the campaign value of the ad group
            scope.selectedCampaign = scope.campaigns[scope.report.$allocation_tables[adGroupId].$campaign_id];

            // values of the allocation table of adGroupId
            scope.allocationsData = scope.report.$allocation_tables[adGroupId].$allocations.map(function(allocation) {
              allocation.$allocation_id.WEIGHTED_CONVERSIONS = allocation.$weighted_conversions;
              allocation.$allocation_id.RATIO_TO_SPEND = allocation.$ratio_to_spend;
              return allocation.$allocation_id;
            });

            // values of ignored contexts of adGroupId
            scope.ignoredContextsData = scope.report.$allocation_tables[adGroupId].$ignored_contexts.map(function(allocation) {
              allocation.$allocation_id.WEIGHTED_CONVERSIONS = allocation.$weighted_conversions;
              allocation.$allocation_id.RATIO_TO_SPEND = allocation.$ratio_to_spend;
              return allocation.$allocation_id;
            });

            // list of display networks of the allocation table
            var uniqueDisplayNetworksIds = _.union(_.uniq(scope.allocationsData.map(function(display){
              return display.DISPLAY_NETWORK_ID;
            })),
            _.uniq(scope.ignoredContextsData.map(function(context){
              return context.DISPLAY_NETWORK_ID;
            })));

            $q.all(uniqueDisplayNetworksIds.map(function(displayId){
              return Restangular.one("display_networks" , displayId).get({"organisation_id": scope.organisationId})
                 .then(function(d){
                    return d;
                 },
                 function(e){
                    return {id :displayId, name: "Undefined display network "+displayId};
                 }
                 );
            })).then(function(res){

               //used only to filter display networks by name
               scope.uniqueDisplayNetworksIdsFilter = res.map(function(val){
                 return {id : val.name, title: val.name};
               });

               //to access display network name by id
               scope.uniqueDisplayNetworksObj = {};
               res.map(function(val){
                 scope.uniqueDisplayNetworksObj[val.id] = val.name;
               });

               // adding display network name in allocations and ignored contexts
               scope.allocationsData = scope.allocationsData.map(function(allocation){
                 allocation.DISPLAY_NETWORK_NAME = scope.uniqueDisplayNetworksObj[allocation.DISPLAY_NETWORK_ID];
                 return allocation;
               });
               scope.ignoredContextsData = scope.ignoredContextsData.map(function(context){
                 context.DISPLAY_NETWORK_NAME = scope.uniqueDisplayNetworksObj[context.DISPLAY_NETWORK_ID];
                 return context;
               });

               //enable selecting all display networks
               scope.uniqueDisplayNetworksIdsFilter.unshift({
                 id: "",
                 title: "All"
               });

                scope.cols = [{
                  field: "DISPLAY_NETWORK_NAME",
                  title: "Display Network",
                  filter: {
                    DISPLAY_NETWORK_NAME: "select"
                  },
                  filterData: scope.uniqueDisplayNetworksIdsFilter,
                  show: true,
                  sortable: "'DISPLAY_NETWORK_NAME'",
                  getValue: interpolatedValue
                }, {
                  field: "MEDIA_ID",
                  title: "Media",
                  filter: {
                    MEDIA_ID: "text"
                  },
                  show: true,
                  sortable: "'MEDIA_ID'",
                  getValue: formatMedia
                }, {
                  field: "WEIGHTED_CONVERSIONS",
                  title: "Weighted Conversions",
                  show: true,
                  sortable: "'WEIGHTED_CONVERSIONS'",
                  getValue: interpolatedValue
                }, {
                  field: "RATIO_TO_SPEND",
                  title: "Percent Of Daily Budget",
                  show: true,
                  sortable: "'RATIO_TO_SPEND'",
                  getValue: $interpolate("{{ row.RATIO_TO_SPEND * 100 | number:5}}%")
                }];

                scope.allocationsTable = new NgTableParams({
                  count: 10
                }, {
                  data: scope.allocationsData
                });

                scope.ignoredContexts = new NgTableParams({
                  count: 10
                }, {
                  data: scope.ignoredContextsData
                });

                scope.allocationsTable.settings.counts = [];
                scope.ignoredContexts.settings.counts = [];

               scope.tableReady = true;

            });
          };

          scope.reloadAllocations = function() {
            changeAllocation(scope.selectedAdGroup.id);
          };

          scope.refreshAdGroups = function() {
            //to select only ad group for the selected campaign
            scope.adGroupsForCampaign = _.filter(scope.ad_groups, function(o) {
              return o.campaignId === scope.selectedCampaignId;
            });
          };

          scope.$watch('report', function(newVal) {
            if (newVal) {

              scope.report = newVal;

              scope.ad_groups = scope.report.$allocation_tables.map(function(all_table,i) {
                return {
                  id: i,
                  adGroupId: all_table.$ad_group_id,
                  campaignId: all_table.$campaign_id
                };
              });

              $q.all(_.flatten(scope.ad_groups.map(function(adg) {
                return [Restangular.one("display_campaigns", adg.campaignId).get(),
                  Restangular.one("display_campaigns", adg.campaignId).one("ad_groups", adg.adGroupId).get()
                ];
              }))).then(function(res) {

                function setAdGroupName(result) {
                  _.find(scope.ad_groups, function(adg) {
                    return adg.adGroupId === result.id;
                  }).name = result.name;
                }

                scope.campaigns = {};
                for (var i = 0; i < res.length; i++) {

                  switch (res[i].route) {
                    case "ad_groups":
                      setAdGroupName(res[i]);
                      break;
                    case "display_campaigns":
                      scope.campaigns[res[i].id] = res[i];
                      break;

                  }
                }

                // the fist time, show the first allocation table
                scope.selectedAdGroup = scope.ad_groups[0];
                scope.selectedCampaignId = scope.ad_groups[0].campaignId;

                scope.refreshAdGroups();
                changeAllocation(scope.selectedAdGroup.id);

              });
            }
          }, true);

        },

        templateUrl: 'src/core/bidOptimizer/reports/view.report.dynamic-allocation.html'
      };

    }
  ]);

});
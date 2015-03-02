define(['./module'], function () {

    'use strict';


    var module = angular.module('core/scenarios');

    // TODO retreive and use angular.module('keywords') instead ?

    module.controller('core/scenarios/WorkflowController', [
        '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state','core/campaigns/CampaignPluginService',
        function ($scope, $log, Restangular, Session, _, $stateParams, $location, $state, CampaignPluginService) {

            $scope.zoomlevel = 100;
            $scope.pos_x = 0;
            $scope.pos_y = 0;
            $scope.targetEndpointStyle = {
                endpoint: "Dot",
                paintStyle: {strokeStyle: "#00AB67", fillStyle: "#00AB67", radius: 1, lineWidth: 3},
                hoverPaintStyle: {fillStyle: "#007848", strokeStyle: "#007848"},
                maxConnections: -1,
                dropOptions: {
                    hoverClass: "hover",
                    activeClass: "active"
                },
                isTarget: true
            };
            $scope.sourceEndpointStyle = {
                endpoint: "Dot",
                paintStyle: {strokeStyle: "#00AB67", fillStyle: "transparent", radius: 7, lineWidth: 3 },
                isSource: true,
                connector: ["StateMachine", {
                    stub: [30, 30],
                    gap: 20,
                    cornerRadius: 0,
                    curviness: 0,
                    alwaysRespectStubs: true
                }],
                connectorStyle: {
                    lineWidth: 1,
                    strokeStyle: "#61B7CF",
                    joinstyle: "round",
                    outlineColor: "white",
                    outlineWidth: 0
                },
                hoverPaintStyle: { lineWidth: 1,  strokeStyle: "#216477",  outlineWidth: 0 },
                connectorHoverStyle: {
                    lineWidth: 1,
                    strokeStyle: "#007848"
                },
                dragOptions: {}
            };
            $scope.getTemplate = function (state) {
                //resolve a template to use
                if (typeof state.template === 'undefined')
                    return "/src/core/scenarios/partials/defaultState.html";
                if (state.template == 'fancyObject')
                    return "/src/core/scenarios/partials/secondaryState.html";
                return "/src/core/scenarios/partials/defaultState.html";
            };

            $scope.$watch("$parent.nodes", function (nodes) {
                if (typeof nodes !== "undefined") {
                    console.log(nodes)
                    var workflow = $scope.$eval("$parent.workflow");
                    var previousNode = null;
                    for(var i = 0; i < nodes.length ; i++) {
                        var node = nodes[i];
                        $scope.stateObjects.push({
                            "id": node.id,
                            "sources": [
                                {
                                    "uuid": "src-" + node.id
                                }
                            ],
                            "targets": [{
                                "uuid": "target-" + node.id
                            }
                            ],
                            "x": 0,
                            "y": (i + 1) * 100
                        });


                    }
                    for(var i = 0; i < nodes.length ; i++) {
                        var node = nodes[i];
                        if(previousNode != null) {
                            $scope.stateConnections.push({sourceUUID:"src-" + previousNode.id, targetUUID:"target-" + node.id})
                        } else {
                            $scope.stateConnections.push({sourceUUID:"start", targetUUID:"target-" + node.id})
                        }
                        previousNode = node;
                    }
                    $scope.stateConnections.push({sourceUUID:"src-" + previousNode.id, targetUUID:"end" })
                }
            })

            $scope.stateObjects = [
                {
                    "name": "Start",
                    "template": "fancyObject",
                    "sources": [
                        {
                            "uuid": "start"
                        }
                    ],
                    "targets": [],
                    "x": 0,
                    "y": 0
                },

                {
                    "name": "End",
                    "template": "fancyObject",
                    "targets": [
                        {
                            "uuid": "end"
                        }
                    ],
                    "sources": [],
                    "x": 0,
                    "y": 300
                }
            ];
            $scope.newState = function () {
                $scope.stateObjects.push({
                    'name': 'New State',
                    'sources': [
                        {uuid: getNextUUID()},
                        {uuid: getNextUUID()},
                    ],
                    'targets': [
                        {uuid: getNextUUID()},
                        {uuid: getNextUUID()}
                    ],
                    'x': 10,
                    'y': 10
                });
            };
            $scope.stateConnections = [
//        { targetUUID:8, sourceUUID:2 },
//        { targetUUID:7, sourceUUID:9 },
//        { targetUUID:4, sourceUUID:12 }
            ];
            $scope.removeConnection = function (index) {
                $scope.stateConnections.splice(index, 1);
            }
            $scope.setActiveConnection = function (index) {
                if (typeof $scope.activeConnection !== 'undefined' && $scope.activeConnection.index == index) {
                    $scope.activeConnection = undefined;
                    return;
                }
                $scope.activeConnection = {
                    index: index,
                    connection: $scope.stateConnections[index]
                };
            };



            $scope.showCampaign = function (campaign, $event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }

                CampaignPluginService.getCampaignTemplate(campaign.template_group_id, campaign.template_artifact_id).then(function (template) {
                    var location = template.editor.edit_path.replace(/{id}/g, campaign.id).replace(/{organisation_id}/, campaign.organisation_id);
                    $location.path(location);
                });
            };



            var instance = jsPlumb.instance;
            $scope.onConnection = function (instance, connection, targetUUID, sourceUUID) {
                // still need a scope $apply
                // console.log('onConnection in controller');
                $scope.stateConnections.push({
                    'targetUUID': targetUUID,
                    'sourceUUID': sourceUUID,
                    'conn': connection
                });
                $scope.$apply();
            }
        }

    ]);
});


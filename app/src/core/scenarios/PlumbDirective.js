define(['./module', 'jsplumb', 'jquery'], function (module, jsPlumb, $) {
  'use strict';

  /**
   * JS PLUMB CANVAS
   */
  module.directive('jsPlumbCanvas', function ($log) {
    var jsPlumbZoomCanvas = function (instance, zoom, el, transformOrigin) {
      transformOrigin = transformOrigin || [0, 0];
      var p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
      for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
      }
      el.style.transform = s;
      el.style.transformOrigin = oString;
      instance.setZoom(zoom);
    };
    var def = {
      restrict: 'E',
      scope: {
        onConnection: '=onConnection',
        zoom: '=',
        x: '=',
        y: '='
      },
      controller: function ($scope) {
        this.scope = $scope;
      },
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function (scope, element, attr) {
        var instance = jsPlumb.getInstance({

          ConnectionOverlays: [
            ["Arrow", {
              location: 1,
              id: "arrow",
              length: 14,
              foldback: 0.8
            }]

          ]

        });
        scope.jsPlumbInstance = instance;
        instance.bind("connectionDrag", function (connection, originalEvent) {
          $log.debug("connectionDrag " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
          $log.debug("connectionDrag", connection, originalEvent);
        });
        instance.bind("connectionMoved", function (params) {
          $log.debug("connection " + params.connection.id + " was moved");
        });
        instance.bind("connection", function (info, origEvent) {
          if (typeof origEvent !== 'undefined' && origEvent.type === 'mouseup') {
            $log.debug("[connection] event in jsPlumbCanvas Directive [DRAG & DROP]", info, origEvent);
            var targetUUID = $(info.target).attr('uuid');
            var sourceUUID = $(info.source).attr('uuid');
            scope.onConnection(instance, info.connection, targetUUID, sourceUUID);
          }
        });
        $(element).css({
          minWidth: '1000px',
          minHeight: '1000px',
          display: 'block'
        });//.draggable({
//          stop: function(event, ui) {
//            var position = $(this).position();
//            scope1.x = position.left;
//            scope.y = position.top;
//            scope.$parent.$apply();
//          }
//        });
        instance.setContainer($(element));
        var zoom = (typeof scope.zoom === 'undefined') ? 1 : scope.zoom / 100;
        jsPlumbZoomCanvas(instance, zoom, $(element)[0]);
        scope.$watch('zoom', function (newVal, oldVal) {
          jsPlumbZoomCanvas(instance, newVal / 100, $(element)[0]);
        });
        // scope.$watch('x', function(newVal, oldVal){
        // $(element).css('left', newVal);
        // });
        // scope.$watch('y', function(newVal, oldVal){
        // $(element).css('top', newVal);
        // });
      }
    };
    return def;
  });

  /**
   * JS PLUMB OBJECT
   */
  module.directive('jsPlumbObject', function () {
    var def = {
      restrict: 'E',
      require: '^jsPlumbCanvas',
      scope: {
        stateObject: '=stateObject'
      },
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function (scope, element, attrs, jsPlumbCanvas) {
        var instance = jsPlumbCanvas.scope.jsPlumbInstance;
        //$log.debug(instance);
        instance.draggable(element, {
          grid: [20, 20],
          drag: function (event, ui) {
            scope.stateObject.x = ui.position.left;
            scope.stateObject.y = ui.position.top;
            scope.$apply();
          }
        });
      }
    };
    return def;
  });

  /**
   * JS PLUMB ENDPOINT
   */
  module.directive('jsPlumbEndpoint', function ($log) {
    var def = {
      restrict: 'E',
      require: '^jsPlumbCanvas',
      scope: {
        settings: '=settings'
      },
      link: function (scope, element, attrs, jsPlumbCanvas) {
        var instance = jsPlumbCanvas.scope.jsPlumbInstance;
        var options = {
          anchor: attrs.anchor,
          uuid: attrs.uuid
        };
        $log.debug('Rigging up endpoint');
        $(element).addClass('_jsPlumb_endpoint');
        $(element).addClass('endpoint_' + attrs.anchor);
        instance.addEndpoint(element, scope.settings, options);
      }
    };
    return def;
  });

  /**
   * JS PLUMB CONNECTION
   */
  module.directive('jsPlumbConnection', function ($timeout, $log) {
    var def = {
      restrict: 'E',
      require: '^jsPlumbCanvas',
      scope: {
        ngClick: '&ngClick',
        ngModel: '=ngModel'
      },
      link: function (scope, element, attrs, jsPlumbCanvas) {
        var instance = jsPlumbCanvas.scope.jsPlumbInstance;
        //we delay the connections by just a small bit for loading
        //$log.debug('[directive][jsPlumbConnection] ', scope, attrs);
        $timeout(function () {
          if (typeof scope.ngModel.conn === 'undefined') {
            scope.ngModel.conn = instance.connect({
              uuids: [
                scope.ngModel.sourceUUID, scope.ngModel.targetUUID
              ],
              overlays: [
                ["Label", {label: "", id: "label"}]
              ], editable: true
            });
          }
          var connection = scope.ngModel.conn;
          $log.debug('[---------][directive][jsPlumbConnection] ', connection);
          connection.bind("click", function (conn, originalEvent) {
            scope.ngClick();
            scope.$apply();
          });
          connection.bind("mouseenter", function (conn, originalEvent) {
            scope.ngModel.mouseover = true;
            scope.$apply();
          });
          connection.bind("mouseleave", function (conn, originalEvent) {
            scope.ngModel.mouseover = false;
            scope.$apply();
          });
          // not really using this... but if we wanted to... we could fix it :)
          var overlay = connection.getOverlay("label");
          if (overlay) {
            $log.debug('[getOverlay][label]', connection.getOverlay("label"));
            $(element).appendTo(overlay.canvas);
          }
        }, 300);
        scope.$on('$destroy', function () {
          $log.debug('got destroy call');
          instance.detach(scope.ngModel.conn);
        });
      }
    };
    return def;
  });
});
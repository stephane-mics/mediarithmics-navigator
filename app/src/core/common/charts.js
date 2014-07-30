/* global nv */
define(['./module', 'nv.d3', 'nvd3-templates/doubleLineChart', 'd3'], function (m, nv, ignore, d3) {

  'use strict';


  function initializeMargin(scope, attrs){
    var margin = (scope.$eval(attrs.margin) || {left: 50, top: 50, bottom: 50, right: 50});
    if (typeof(margin) !== 'object') {
      // we were passed a vanilla int, convert to full margin object
      margin = {left: margin, top: margin, bottom: margin, right: margin};
    }
    scope.margin = margin;
  }

  function checkElementID(scope, attrs, element, chart, data) {
    var dataAttributeChartID; //randomly generated if id attribute doesn't exist
    if(!attrs.id){
      dataAttributeChartID = 'chartid' + Math.floor(Math.random()*1000000001);
      angular.element(element).attr('data-chartid', dataAttributeChartID );
      //if an id is not supplied, create a random id.
      if(d3.select('[data-chartid=' + dataAttributeChartID + '] svg').empty()) {
        d3.select('[data-chartid=' + dataAttributeChartID + ']').append('svg')
        .attr('height', scope.height)
        .attr('width', scope.width)
        .datum(data)
        .transition().duration((attrs.transitionduration === undefined ? 250 : (+attrs.transitionduration)))
        .call(chart);
      } else {
        d3.select('[data-chartid=' + dataAttributeChartID + '] svg')
        .attr('height', scope.height)
        .attr('width', scope.width)
        .datum(data)
        .transition().duration((attrs.transitionduration === undefined ? 250 : (+attrs.transitionduration)))
        .call(chart);
      }
    } else {
      if(angular.isArray(data) && data.length === 0){
        d3.select('#' + attrs.id + ' svg').remove();
      }
      if(d3.select('#' + attrs.id + ' svg').empty()) {
        d3.select('#' + attrs.id)
        .append('svg');
      }
      d3.select('#' + attrs.id + ' svg')
      .attr('height', scope.height)
      .attr('width', scope.width)
      .datum(data)
      .transition().duration((attrs.transitionduration === undefined ? 250 : (+attrs.transitionduration)))
      .call(chart);
    }
  }




  angular.module('core/common').directive('nvd3DoubleLineChart', [function(){
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        width: '@',
        height: '@',
        id: '@',
        showlegend: '@',
        tooltips: '@',
        showxaxis: '@',
        showyaxis: '@',
        rightalignyaxis: '@',
        defaultstate: '@',
        nodata: '@',
        margin: '&',
        tooltipcontent: '&',
        color: '&',
        x: '&',
        y: '&',
        isArea: '@',
        interactive: '@',
        clipedge: '@',
        clipvoronoi: '@',
        interpolate: '@',

        callback: '&',

        useinteractiveguideline: '@',
        //xaxis
        xaxisorient: '&',
        xaxisticks: '@',
        xaxistickvalues: '&xaxistickvalues',
        xaxisticksubdivide: '&',
        xaxisticksize: '&',
        xaxistickpadding: '&',
        xaxistickformat: '&',
        //angularjs specific
        objectequality: '@', //$watch(watchExpression, listener, objectEquality)

        //d3.js specific
        transitionduration: '@'

      },
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
        $scope.d3Call = function(data, chart){
          checkElementID($scope, $attrs, $element, chart, data);
        };
      }],
      link: function(scope, element, attrs){
        scope.$watch('data', function(data){
          if(data){
            //if the chart exists on the scope, do not call addGraph again, update data and call the chart.
            if(scope.chart){
              return scope.d3Call(data, scope.chart);
            }
            nv.addGraph({
              generate: function(){
                initializeMargin(scope, attrs);
                var chart = nv.models.doubleLineChart()
                //                                        .width(scope.width)
                //                                        .height(scope.height)
                //                                        .margin(scope.margin)
                //                                        .x(attrs.x === undefined ? function(d){ return d[0]; } : scope.x())
                //                                        .y(attrs.y === undefined ? function(d){ return d[1]; } : scope.y())
                //                                        .forceX(attrs.forcex === undefined ? [] : scope.$eval(attrs.forcex)) // List of numbers to Force into the X scale (ie. 0, or a max / min, etc.)
                //                                        .forceY(attrs.forcey === undefined ? [0] : scope.$eval(attrs.forcey)) // List of numbers to Force into the Y scale
                .showLegend(attrs.showlegend === undefined ? false : (attrs.showlegend === 'true'))
                .tooltips(true)
                .showXAxis(true)
                .showYAxis(true)
                //                                        .rightAlignYAxis(attrs.rightalignyaxis === undefined ? false : (attrs.rightalignyaxis === 'true'))
                .noData(attrs.nodata === undefined ? 'No Data Available.' : scope.nodata)
                //                                        .interactive(attrs.interactive === undefined ? false : (attrs.interactive === 'true'))
                //                                        .clipEdge(attrs.clipedge === undefined ? false : (attrs.clipedge === 'true'))
                //                                        .clipVoronoi(attrs.clipvoronoi === undefined ? false : (attrs.clipvoronoi === 'true'))
                //                                        .interpolate(attrs.interpolate === undefined ? 'linear' : attrs.interpolate)
                .color(attrs.color === undefined ? nv.utils.defaultColor() : scope.color());
                //                                        .isArea(attrs.isarea === undefined ? function(d) { return d.area; } : function(){ return (attrs.isarea === 'true'); });

                if (chart.useInteractiveGuideline) {
                  chart.useInteractiveGuideline(true);
                }

                if(attrs.tooltipcontent){
                  chart.tooltipContent(scope.tooltipcontent());
                }
                if (attrs.xaxistickformat) {
                  chart.xAxis.tickFormat(scope.xaxistickformat());
                }

                scope.d3Call(data, chart);
                nv.utils.windowResize(chart.update);
                scope.chart = chart;
                return chart;
              },
              callback: attrs.callback === undefined ? null : scope.callback()
            });
          }
        }, (attrs.objectequality === undefined ? false : (attrs.objectequality === 'true')));
      }
    };


  }]);

});

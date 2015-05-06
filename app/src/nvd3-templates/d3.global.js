/* global d3 */
/*jshint -W020 */
// workaround for nvd3 using global d3
define(["d3"], function (d3) {
  "use strict";
  window.d3 = d3;
  return d3;
});

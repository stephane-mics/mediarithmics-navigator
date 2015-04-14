define(['./module'], function (module) {
  'use strict';

  /**
   * VIDEO AD SERVICE
   */

  module.factory('core/creatives/plugins/video-ad/VideoAdService', [
    '$q', '$sce', 'Restangular', 'core/common/IdGenerator', 'core/creatives/plugins/video-ad/VideoAdContainer', '$log', 'core/common/auth/Session',
    function ($q, $sce, Restangular, IdGenerator, VideoAdContainer, $log, Session) {
      var service = {};

      service.reset = function () {
        this.videoAdCtn = null;
      };

      service.getVideoAdValue = function () {
        $log.debug("> getVideoAdValue, ctn=", this.videoAdCtn);
        return this.videoAdCtn.value;
      };

      service.getProperties = function () {
        $log.debug("> getProperties, ctn=", this.videoAdCtn);
        return this.videoAdCtn.properties;
      };

      service.getAdServingUrl = function () {
        for (var i in this.videoAdCtn.properties) {
          if (this.videoAdCtn.properties[i].value.technical_name == "ad_serving_url") {
            return this.videoAdCtn.properties[i].value.value.url
          }
        }
        return "Unknown";
      };

      service.setVideoPlayerConfig = function (url, type) {
        return {
          sources: [
            {src: $sce.trustAsResourceUrl(url), type: "video/" + type }
          ],
          theme: "bower_components/videogular-themes-default/videogular.css",
          plugins: {
            ads: {
              companion: "companionAd",
              companionSize: [728, 90],
              network: "6062",
              unitPath: "iab_vast_samples",
              adTagUrl: url,
              skipButton: "<div class='skipButton'>Skip ad</div>"
            }
          }
        }
      };

      service.getAudits = function () {
        return this.videoAdCtn.audits;
      };

      // initEditVideoAd : returns a promise on the video ad container
      service.initEditVideoAd = function (creativeId) {
        var ctn = new VideoAdContainer(null);
        this.videoAdCtn = ctn;
        return ctn.load(creativeId);
      };

      // initEditVideoAd : returns a promise on the video ad container
      service.initCreateVideoAd = function (options) {
        var ctn = new VideoAdContainer(options);
        ctn.organisationId = Session.getCurrentWorkspace().organisation_id;
        return (this.videoAdCtn = ctn);
      };

      // Save the video ad
      service.save = function () {
        if (this.videoAdCtn.id.indexOf('T') === -1) {
          return this.videoAdCtn.update();
        } else {
          return this.videoAdCtn.persist();
        }
      };

      service.makeAuditAction = function (action) {
        return this.videoAdCtn.makeAuditAction(action);
      };

      return service;
    }
  ]);
});

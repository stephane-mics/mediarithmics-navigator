(function(){

  'use strict';

  angular.module('core/common')
  .directive('micsPlUpload', [
    '$log', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', "jquery", "plupload",
    function ($log, Session, AuthenticationService, $, plupload) {
      return {
        restrict: 'A',
        scope: {

        },
        link: function (scope, iElement, iAttrs) {


          $('#'+iAttrs.id+' .browse-button').attr("id", iAttrs.id+"-browse-button");
          $('#'+iAttrs.id+' .drop-target').attr("id", iAttrs.id+"-drop-target");

          var uploadUrl = "http://127.0.0.1:9004/public/"+ "v1/asset_files?organisation_id="+Session.getCurrentWorkspace().organisation_id;

          var options = {
            runtimes : 'html5,flash,html4',
            browse_button : iAttrs.id+"-browse-button",
            drop_element : iAttrs.id+"-drop-target",
            multi_selection: true,
            max_file_size : "200kb",
            url : uploadUrl,
            flash_swf_url : 'bower_components/plupload/Moxie.swf',
            filters : {
              mime_types: [
                {title : "Image files", extensions : "jpg,png"},
                {title : "Flash files", extensions : "swf"}
              ]
            },
            headers: {
              Authorization: AuthenticationService.getAccessToken()
            }
          };

          $log.log('plupload options :', options);

          var uploader = new plupload.Uploader(options);
          var rootId = iAttrs.id;

          uploader.bind('Error', function(up, err) {
            $log.info('Error :', err);
          });


          uploader.bind('PostInit', function(up, params) {
            $log.info('Post init called, params :', params);
          });

          uploader.bind('Init', function(up, params) {

            if (uploader.features.dragdrop) {

              $log.log("dragdrop ok !");
              $log.log("rootId =", rootId);

              $('#'+rootId+' .upload-debug').html("");

              var target = $('#'+iAttrs.id+' .drop-target');

              target.ondragover = function(event) {
                event.dataTransfer.dropEffect = "copy";
              };

              target.ondragenter = function() {
                this.className = "dragover";
              };

              target.ondragleave = function() {
                this.className = "";
              };

              target.ondrop = function() {
                this.className = "";
              };
            }

          });

          uploader.init();

          // post init binding

          uploader.bind('FilesAdded', function(up, files) {

            $log.debug("files :", files);
            up.start();
          });


          uploader.bind('FileUploaded', function(up, file, response) {

            var responseObj = $.parseJSON(response.response);
            $log.debug("response :", responseObj);
          });
        }
      };
    }
  ]);
})();

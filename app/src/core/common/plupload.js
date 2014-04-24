(function(){

  'use strict';

  angular.module('core/common')
  .directive('micsPlUpload', [
    '$log', 'core/configuration', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', "jquery", "plupload",
    function ($log, configuration, Session, AuthenticationService, $, plupload) {
      return {
        scope: {
          uploadedFiles: '='
        },
        link: function (scope, iElement, iAttrs) {

          scope.uploadError = null;

          $('#'+iAttrs.id+' .browse-button').attr("id", iAttrs.id+"-browse-button");
          $('#'+iAttrs.id+' .drop-target').attr("id", iAttrs.id+"-drop-target");

          var uploadUrl = configuration.ADS_UPLOAD_URL + "?organisation_id="+Session.getCurrentWorkspace().organisation_id;

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
                {title : "Image files", extensions : "jpg,jpeg,png,gif"},
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
            scope.uploadError = err.message;
            scope.$apply();
            $log.warn('Error :', err);
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
            scope.uploadError = null;
            scope.$apply();

            $log.debug("files :", files);
            up.start();
          });


          uploader.bind('FileUploaded', function(up, file, response) {
            var responseObj = $.parseJSON(response.response);
            if (responseObj.status === "ok" && responseObj.data && scope.uploadedFiles) {
              scope.$apply(function () {
                scope.uploadedFiles.push(responseObj.data);
              });
            }
          });

          // XXX fixme
          // the layout around the upload button can change : added rows in a table, a loaded image push the content, etc.
          // I can think of a better way to keep the invisible <input type="file"> right above the upload button.
          // Just binding it on the FileUploaded event is not enough : in my use case, the new file add an image and once
          // the image is loaded it takes more space and pushes the browse button (but not the invisible input).
          // A interval is a bit overkill but it works.
          var refreshInterval = setInterval(function () {
            $log.debug("refreshing plupload");
            uploader.refresh();
          }, 500);


          scope.$on('$destroy', function() {
            $log.debug("stopping plupload refresh");
            clearInterval(refreshInterval);
          });
        }
      };
    }
  ]);
})();

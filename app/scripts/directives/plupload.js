'use strict';

angular.module('plupload', [])
	.directive('micsPlUpload', ['$log', function ($log) {
		return {
			restrict: 'A',
			scope: {

			},
			link: function (scope, iElement, iAttrs) {


				$('#'+iAttrs.id+' .browse-button').attr("id", iAttrs.id+"-browse-button");
				$('#'+iAttrs.id+' .drop-target').attr("id", iAttrs.id+"-drop-target");

				var options = {
						runtimes : 'html5,flash,html4',
						browse_button : iAttrs.id+"-browse-button",
						drop_element : iAttrs.id+"-drop-target",
						multi_selection: true,						
						max_file_size : "200kb",
						url : "/upload",
						flash_swf_url : 'bower_components/plupload/Moxie.swf',
						filters : {
				          mime_types: [
				            {title : "Image files", extensions : "jpg,png"},
				            {title : "Flash files", extensions : "swf"}
				          ]
				        }
				}

				$log.debug('plupload options :', options);
				console.log('plupload options :', options);

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

						console.log("dragdrop ok !");
						console.log("rootId =", rootId);

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

			    uploader.bind('FilesAdded', function(up, files) {
			        for (var i in files) {
			        	console.debug("file :", files[i]);
			          $('#'+ rootId+' .upload-debug').html('<div id="' + files[i].id + '">' + files[i].name + ' (' + plupload.formatSize(files[i].size) + ') (' + files[i].type+ ')</div>');
			        }
			    });

 				uploader.init();
			}
		};
	}])
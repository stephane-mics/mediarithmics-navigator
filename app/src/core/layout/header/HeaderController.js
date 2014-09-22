define(['./module'], function (module) {
	'use strict';

	/* Searches for the right navbar */
	module.controller('core/layout/header/HeaderController', [
		'$scope', '$state', '$location', '$log',
		function ($scope, $state, $location, $log) {
			$scope.allNavbars = {};

//          Admin
			$scope.allNavbars['/admin'] = 'src/core/layout/header/navbar/admin-navbar/admin-navbar.html';
			$scope.allNavbars['/admin/home'] = 'src/core/layout/header/navbar/admin-navbar/admin-navbar.html';
			$scope.allNavbars['/admin/organisations'] = 'src/core/layout/header/navbar/admin-navbar/admin-navbar.html';

//			Basic editor
			$scope.allNavbars['/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/create'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/edit/:creative_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//			Default editor
			$scope.allNavbars['/{organisation_id}/creatives/com.mediarithmics.creative.display/default-editor/create'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/creatives/com.mediarithmics.creative.display/default-editor/edit/:creative_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//			core/campaigns
			$scope.allNavbars['/{organisation_id}/campaigns/select-campaign-template'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/campaigns/display/expert/edit/{campaign_id}'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/campaigns/display/expert/edit/:campaign_id/edit-ad-group/:ad_group_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//			core/keywords
			$scope.allNavbars['/{organisation_id}/library/keywordslists/new'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/library/keywordslists/:keywordslist_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/library/keywordslists'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//          core/campaigns/emails
			$scope.allNavbars['/{organisation_id}/campaigns/email/expert/:campaign_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/campaigns/email/expert'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//			core/campaigns/keywords
			$scope.allNavbars['/{organisation_id}/campaigns/display/keywords/:campaign_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/campaigns/display/keywords'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//          core/creatives
			$scope.allNavbars['/{organisation_id}/creatives/select-creative-template'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//          core/placementlists
			$scope.allNavbars['/{organisation_id}/library/placementlists/new'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/library/placementlists/:placementlist_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

//          core/usergroups
			$scope.allNavbars['/{organisation_id}/library/usergroups/:type/:usergroup_id'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';
			$scope.allNavbars['/{organisation_id}/library/usergroups/:type'] = 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html';

			$scope.findNavbar = function() {
				$log.debug($state.current.url);
				if(typeof $scope.allNavbars[$state.current.url] == 'undefined')
					return 'src/core/layout/header/navbar/navigator-navbar/navigator-navbar.html';
				else
					return $scope.allNavbars[$state.current.url];
			}
		}
	]);
});



/**
 * Angular Module
 */
var app = angular.module('CrafterAdminConsole', ['ngRoute', 'ui.bootstrap']);

/**
 * Global variables
 */
var attributeTypes = [
    { name: 'TEXT', label: 'Text' },
    { name: 'LARGE_TEXT', label: 'Large Text'},
    { name: 'NUMBER', label: 'Number' },
    { name: 'BOOLEAN', label: 'Boolean' },
    { name: 'STRING_LIST', label: 'String List' },
    { name: 'COMPLEX', label: 'Complex' }
];

var attributeActions = [
    { name: 'READ_ATTRIBUTE', label: 'Read' },
    { name: 'WRITE_ATTRIBUTE', label: 'Write'},
    { name: 'REMOVE_ATTRIBUTE', label: 'Remove' }
];

var paginationConfig = {
    size: 5,
    itemsPerPage: 10
};

/**
 * Constants
 */
app.constant('paginationConfig', {
    itemsPerPage: 10,
    boundaryLinks: true,
    directionLinks: true,
    previousText: '‹',
    nextText: '›',
    firstText: '«',
    lastText: '»',
    rotate: true
});

/**
 * Global functions
 */
function getObject(url, $http) {
    return $http.get(contextPath + url).then(function(result){
        return result.data;
    });
}

function postObject(url, obj, $http) {
    return $http.post(contextPath + url, obj).then(function(result){
        return result.data;
    });
}

function deleteObject(url, $http) {
    return $http.delete(contextPath + url).then(function(result){
        return result.data;
    });
}

function hasAllActionsWildcard(actions) {
    return actions.indexOf('*') > -1;
}

function getAllActions() {
    var actions = [];

    for (var i = 0; i < attributeActions.length; i++) {
        actions.push(attributeActions[i].name);
    }

    return actions;
}

function showGrowlMessage(type, message) {
    $.growl(message, {
        type: type,
        pause_on_mouseover: true,
        position: {
            from: 'top',
            align: 'center'
        },
        offset: 40
    });
}

function isLoggedIn() {
    var ticket = $.cookie('ticket');

    return ticket !== undefined && ticket !== null && ticket !== '';
}

/**
 * Filters
 */
app.filter('prettyStringify', function() {
    return function(input) {
        return angular.toJson(input, true);
    }
});

/**
 * Http Interceptors
 */
app.factory('httpErrorHandler', function ($q) {
    return {
        'response': function(response) {
            if (!isLoggedIn()) {
                window.location = 'login';
            }

            return response;
        },
        'responseError': function(rejection) {
            if (!isLoggedIn()) {
                window.location = 'login';
            } else {
                var message;

                if (rejection.status == 0) {
                    message = 'Unable to communicate with the server. Please try again later or contact IT support';
                } else {
                    message = 'Server responded with ' + rejection.status + ' error';
                    if (rejection.data.message) {
                        message += ': <strong>' + rejection.data.message + '</strong>';
                    }

                    message += '. Please contact IT support for more information';
                }

                showGrowlMessage('danger', message);
            }

            return $q.reject(rejection);
        }
    };
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpErrorHandler');
}]);

/**
 * Services
 */
app.factory('tenantService', function($http) {
    return {
        getTenantNames: function() {
            return getObject('/tenant/names', $http);
        },
        getTenant: function(tenantName) {
            return getObject('/tenant/' + tenantName, $http);
        },
        createTenant: function(tenant) {
            return postObject('/tenant/new', tenant, $http);
        },
        updateTenant: function(tenant) {
            return postObject('/tenant/update', tenant, $http);
        },
        deleteTenant: function(tenantName) {
            return deleteObject('/tenant/' + tenantName + '/delete', $http);
        }
    }

});

app.factory('profileService', function($http) {
    return {
        getProfileCount: function(tenantName, query) {
            var url = '/profile/count?tenantName=' + tenantName;
            if (query != undefined && query != null) {
                url += '&query=' + query;
            }

            return getObject(url, $http);
        },
        getProfileList: function(tenantName, query, start, count) {
            var url ='/profile/list?tenantName=' + tenantName;
            if (query != undefined && query != null) {
                url += '&query=' + query;
            }
            if (start != undefined && start != null) {
                url += '&start=' + start;
            }
            if (count != undefined && count != null) {
                url += '&count=' + count;
            }

            return getObject(url, $http);
        },
        getProfile: function(id) {
            return getObject('/profile/' + id, $http);
        },
        createProfile: function(profile) {
            return postObject('/profile/new', profile, $http);
        },
        updateProfile: function(profile) {
            return postObject('/profile/update', profile, $http);
        },
        deleteProfile: function(id) {
            return deleteObject('/profile/' + id + '/delete', $http);
        }
    }
});

/**
 * Routing
 */
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'ProfileListController',
        templateUrl: contextPath + '/profile/list/view',
        resolve: {
            tenantNames: function(tenantService) {
                return tenantService.getTenantNames();
            }
        }
    });

    $routeProvider.when('/profile/list', {
        controller: 'ProfileListController',
        templateUrl: contextPath + '/profile/list/view',
        resolve: {
            tenantNames: function(tenantService) {
                return tenantService.getTenantNames();
            }
        }
    });

    $routeProvider.when('/profile/new', {
        controller: 'NewProfileController',
        templateUrl: contextPath + '/profile/new/view',
        resolve: {
            tenantNames: function(tenantService) {
                return tenantService.getTenantNames();
            },
            profile: function() {
                return {
                    id: null,
                    username: null,
                    password: null,
                    email: null,
                    verified: false,
                    enabled: true,
                    createdOn: null,
                    lastModified: null,
                    tenant: null,
                    roles: [],
                    attributes: {}
                };
            }
        }
    });

    $routeProvider.when('/profile/update/:id', {
        controller: 'UpdateProfileController',
        templateUrl: contextPath + '/profile/update/view',
        resolve: {
            profile: function($route, profileService) {
                return profileService.getProfile($route.current.params.id);
            }
        }
    });

    $routeProvider.when('/tenant/list', {
        controller: 'TenantListController',
        templateUrl: contextPath + '/tenant/list/view',
        resolve: {
            tenantNames: function(tenantService) {
                return tenantService.getTenantNames();
            }
        }
    });

    $routeProvider.when('/tenant/new', {
        controller: 'TenantController',
        templateUrl: contextPath + '/tenant/new/view',
        resolve: {
            tenant: function() {
                return {
                    name: null,
                    verifyNewProfiles: false,
                    availableRoles: [],
                    attributeDefinitions: []
                };
            },
            newTenant: function() {
                return true;
            }
        }
    });

    $routeProvider.when('/tenant/update/:name', {
        controller: 'TenantController',
        templateUrl: contextPath + '/tenant/update/view',
        resolve: {
            tenant: function($route, tenantService) {
                return tenantService.getTenant($route.current.params.name);
            },
            newTenant: function() {
                return false;
            }
        }
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

/**
 * Controllers
 */
app.controller('ProfileListController', function($scope, $location, tenantNames, profileService) {
    // Abort if tenantNames is null or empty. It means there was a server error
    if (!tenantNames) {
        return;
    }

    $scope.tenantNames = tenantNames;
    $scope.selectedTenantName = $scope.tenantNames[0];
    $scope.itemsPerPage = 10;

    $scope.isValidUsername = function(text) {
        return /^\w+$/.test(text);
    };


    $scope.getCurrentPage = function(tenantName, searchText, currentPage, itemsPerPage) {
        var start = (currentPage - 1) * itemsPerPage;

        profileService.getProfileList(tenantName, searchText, start, itemsPerPage).then(function(profiles) {
            $scope.profiles = profiles;
        });
    };

    $scope.getProfiles = function(tenantName, searchText) {
        if ($scope.searchText == null || $scope.searchText == '' || $scope.isValidUsername($scope.searchText)) {
            profileService.getProfileCount(tenantName, searchText).then(function(count) {
                $scope.totalItems = count;
                $scope.currentPage = 1;

                $scope.getCurrentPage(tenantName, searchText, $scope.currentPage, $scope.itemsPerPage);
            });
        } else {
            showGrowlMessage('info', 'Search term must be a word with no spaces');
        }
    };

    $scope.resetSearchAndGetProfiles = function(tenantName) {
        $scope.searchText = "";

        $scope.getProfiles(tenantName, $scope.searchText);
    };

    $scope.showDeleteConfirmationDialog = function(profile, index) {
        $scope.profileToDelete = {};
        $scope.profileToDelete.username = profile.username;
        $scope.profileToDelete.id = profile.id;
        $scope.profileToDelete.index = index;

        $('#deleteConfirmationDialog').modal('show');
    };

    $scope.deleteProfile = function(id, index) {
        profileService.deleteProfile(id).then(function() {
            $scope.profiles.splice(index, 1);

            $('#deleteConfirmationDialog').modal('hide');
        });
    };

    $scope.resetSearchAndGetProfiles($scope.selectedTenantName);
});

app.controller('NewProfileController', function($scope, $location, tenantNames, profile, tenantService, profileService) {
    // Abort if tenantNames is null or empty. It means there was a server error
    if (!tenantNames) {
        return;
    }

    $scope.tenantNames = tenantNames;
    $scope.profile = profile;
    $scope.profile.tenant = $scope.tenantNames[0];
    $scope.profile.password = "";
    $scope.confirmPassword = "";

    $scope.getTenant = function(tenantName) {
        tenantService.getTenant(tenantName).then(function(tenant) {
            $scope.tenant = tenant;

            // Different tenant, Different roles and attributes
            $scope.profile.roles = [];
            $scope.profile.attributes = {};
        });
    };

    $scope.createProfile = function(profile) {
        profileService.createProfile(profile).then(function() {
            $location.path('/');
        });
    };

    $scope.cancel = function() {
        $location.path('/');
    };

    $scope.getTenant($scope.profile.tenant);
});

app.controller('UpdateProfileController', function($scope, $location, profile, tenantService, profileService) {
    // Abort if profile is null or empty. It means there was a server error
    if (!profile) {
        return;
    }

    $scope.profile = profile;
    $scope.profile.password = "";
    $scope.confirmPassword = "";

    $scope.getTenant = function(tenantName) {
        tenantService.getTenant(tenantName).then(function(tenant) {
            $scope.tenant = tenant;
        });
    };

    $scope.updateProfile = function(profile) {
        profileService.updateProfile(profile).then(function() {
            $location.path('/');
        });
    };

    $scope.cancel = function() {
        $location.path('/');
    };

    $scope.getTenant($scope.profile.tenant);
});

app.controller('TenantListController', function($scope, tenantNames, tenantService) {
    // Abort if tenantNames is null or empty. It means there was a server error
    if (!tenantNames) {
        return;
    }

    $scope.tenantNames = tenantNames;

    $scope.showDeleteConfirmationDialog = function(tenantName, index) {
        $scope.tenantToDelete = {};
        $scope.tenantToDelete.name = tenantName;
        $scope.tenantToDelete.index = index;

        $('#deleteConfirmationDialog').modal('show');
    };

    $scope.deleteTenant = function(name, index) {
        tenantService.deleteTenant(name).then(function() {
            $scope.tenantNames.splice(index, 1);

            $('#deleteConfirmationDialog').modal('hide');
        });
    };
});

app.controller('TenantController', function($scope, $location, tenant, newTenant, tenantService) {
    // Abort if tenant is null or empty. It means there was a server error
    if (!tenant) {
        return;
    }

    $scope.tenant = tenant;
    $scope.newTenant = newTenant;

    $scope.attributeTypes = attributeTypes;
    $scope.attributeActions = attributeActions;

    $scope.getLabelForAttributeType = function(typeName) {
        for (var i = 0; i < $scope.attributeTypes.length; i++) {
            if ($scope.attributeTypes[i].name == typeName) {
                return $scope.attributeTypes[i].label;
            }
        }

        return null;
    };

    $scope.showAttributeDefinitionModal = function(definition, index) {
        if (index > -1) {
            $scope.currentDefinition = angular.copy(definition);

            $('#attribName').attr('disabled', 'disabled');
        } else {
            var allActions = [];
            for (var action in attributeActions) {
                allActions.push(action);
            }

            $scope.currentDefinition = {
                name: null,
                metadata: {
                    label: null,
                    type: $scope.attributeTypes[0].name
                },
                permissions: [
                    {
                        application: '*',
                        allowedActions: getAllActions()
                    }
                ]
            };

            $('#attribName').removeAttr('disabled');
        }

        $scope.currentDefinitionIndex = index;
        $scope.newDefinition = index < 0;
        $scope.application = null;
        $scope.definitionForm.$setPristine();

        $('#attributeDefinitionModal').modal('show');
    };

    $scope.saveAttributeDefinition = function(definition, index) {
        if (index > -1) {
            $scope.tenant.attributeDefinitions[index] = definition;
        } else {
            $scope.tenant.attributeDefinitions.push(definition);
        }

        $('#attributeDefinitionModal').modal('hide');
    };

    $scope.deleteAttributeDefinitionAt = function(index) {
        $scope.tenant.attributeDefinitions.splice(index, 1);
    };

    $scope.addPermission = function(definition, application) {
        var permission = {
            'application': application,
            'allowedActions': []
        };

        if (!definition.permissions) {
            definition.permissions = [];
        }

        definition.permissions.push(permission);
    };

    $scope.deletePermissionAt = function(definition, index) {
        definition.permissions.splice(index, 1);
    };

    $scope.hasAction = function(permission, action) {
        if (!permission.allowedActions) {
            return false;
        }
        if (hasAllActionsWildcard(permission.allowedActions)) {
            return true;
        }
        if (permission.allowedActions.indexOf(action) > -1) {
            return true;
        }
    };

    $scope.toggleAction = function(permission, action) {
        if (permission.allowedActions === undefined || permission.allowedActions === null) {
            permission.allowedActions = [];
        }

        if (hasAllActionsWildcard(permission.allowedActions)) {
            permission.allowedActions = [];

            for (var attributeAction in $scope.attributeActions) {
                if (attributeAction != action) {
                    permission.allowedActions.push(attributeAction);
                }
            }
        } else {
            var index = permission.allowedActions.indexOf(action);
            if (index > -1) {
                permission.allowedActions.splice(index, 1);
            } else {
                permission.allowedActions.push(action);
            }
        }
    };

    $scope.saveTenant = function(tenant) {
        var promise;

        if (newTenant) {
            promise = tenantService.createTenant(tenant);
        } else {
            promise = tenantService.updateTenant(tenant);
        }

        promise.then(function() {
            $location.path('/');
        });
    };

    $scope.cancel = function() {
        $location.path('/');
    };
});

/**
 * Directives
 */
app.directive('checkboxList', function() {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            selected: '=',
            options: '='
        },
        controller: function($scope) {
            $scope.toggleOption = function(option) {
                var index = $scope.selected.indexOf(option);
                if (index > -1) {
                    $scope.selected.splice(index, 1);
                } else {
                    $scope.selected.push(option);
                }
            };
        },
        templateUrl: contextPath + '/directives/checkbox-list',
        replace: true
    };
});

app.directive('editableList', function() {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            items: '='
        },
        controller: function($scope) {
            if ($scope.items === undefined || $scope.items === null) {
                $scope.items = [];
            }

            $scope.addItem = function(item) {
                $scope.items.push(item);
            };

            $scope.deleteItemAt = function(index) {
                $scope.items.splice(index, 1);
            };
        },
        templateUrl: contextPath + '/directives/editable-list',
        replace: true
    };
});

app.directive('attributes', function() {
    return {
        restrict: 'E',
        scope: {
            definitions: '=',
            attributes: '='
        },
        controller: function($scope) {
            $scope.predicate = '+metadata.displayOrder';
        },
        templateUrl: contextPath + '/directives/attributes',
        replace: true
    };
});

app.directive('equals', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            equals: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return scope.equals == ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('equals', currentValue);
            });
        }
    };
});

app.directive('attributeNotRepeated', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            attributeDefinitions: '=attributeNotRepeated'
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                for (var i = 0; i < scope.attributeDefinitions.length; i++) {
                    if (scope.attributeDefinitions[i].name == ctrl.$modelValue) {
                        return false;
                    }
                }

                return true;
            }, function(currentValue) {
                ctrl.$setValidity('attributeNotRepeated', currentValue);
            });
        }
    };
});
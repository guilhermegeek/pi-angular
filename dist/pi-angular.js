(function(){
	var settings = {

	};
	var configFn = function($httpProvider){

		$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	};

	configFn.$inject = ['$httpProvider'];

	angular
		.module('pi', ['ngResource', 'pi.core', 'pi.core.app', 'pi.core.place', 'pi.core.question', 'pi.core.article', 'pi.core.payment', 'pi.core.chat', 'pi.core.likes', 'pi.core.product'])
		.config(configFn)
		.provider('pi', [function(){
			var appId,
				appSecret;

			this.setAppId = function(value) {
				appId = value;
			}

			this.$get = [function(){
				return {
					getAppId: function() {
						return appId;
					},
					setAppId: function(value) {
						appId = value;
					}
				}
			}];
		}]);
})();
(function(){
	'use strict';

	angular
		.module('pi.ui-router', ['pi', 'ui.router']);

	angular
		.module('pi.core', ['pi']);

	angular
		.module('pi.gallery', []);

	angular
		.module('pi.adsense', ['pi']);

	angular
		.module('pi.core.user', ['pi.core']);

	angular
		.module('pi.core.file', ['pi.core']);

	angular
		.module('pi.core.likes', ['pi.core']);

	angular
		.module('pi.core.product', ['pi.core']);

	angular
		.module('pi.core.article', ['pi.core']);

	angular
		.module('pi.core.question', ['pi.core']);

	angular
		.module('pi.core.place', ['pi.core']);

	angular
		.module('pi.ionic', ['pi.core']);

})();
function getCookie(cname) {
   var name = cname + "=",
       ca = document.cookie.split(';'),
       i,
       c,
       ca_length = ca.length;
   for (i = 0; i < ca_length; i += 1) {
       c = ca[i];
       while (c.charAt(0) === ' ') {
           c = c.substring(1);
       }
       if (c.indexOf(name) !== -1) {
           return c.substring(name.length, c.length);
       }
   }
   return "";
}

function setCookie(variable, value, expires_seconds) {
   var d = new Date();
   d = new Date(d.getTime() + 1000 * expires_seconds);
   document.cookie = variable + '=' + value + '; expires=' + d.toGMTString() + ';';
}

angular
	.module('pi.chat', []);
(function(){
	angular
		.module('pi.form', []);
})();
(function(){
  angular
    .module('pi.form-contact', ['pi.mandril']);
})();

(function(){
  angular
		.module('pi.mandril', []);
})();

(function(){
	angular.
		module('pi.ui-extensions', ['ui.router']);
})();
(function(){
  angular
      .module('pi.admin', []);

  angular
    .module('pi.admin')
    .config(['$stateProvider', function($stateProvider){
      $stateProvider
        .state('admin', {
          url: '/admin',
          controller: 'pi.admin.adminCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'admin/admin.html'
        })
        .state('article-manage', {
          url: '/admin/article',
          controller: 'pi.admin.articleManageCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'admin/article-manage.html'
        })
        .state('article-edit', {
          url: '/admin/article/:id',
          controller: 'pi.admin.articleEditCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'admin/article-edit.html'
        })
        .state('event-manage', {
          url: '/admin/event',
          controller: 'pi.admin.eventManageCtrl',
          controllerAsl: 'ctrl',
          templateUrl: 'admin/event-manage.html'
        })
        .state('event-edit', {
          url: '/admin/event/:id',
          controller: 'pi.admin.eventEditCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'admin/event-edit.html'
        });
    }]);
})();

(function(){
  angular
    .module('pi.auth', ['pi']);

  angular
    .module('pi.auth')
    .provider('piConfiguration', function(){
      var config = function(){
        var m = {};
        m.providers = ['basic'];
        m.loginUri = '/login';
        m.logoutUri = '/logout';

        return m;
      };

      var provider = function(){
        var me = config();
        var configs = {};
        configs['default'] = me;

        me.config = function(configName) {
          var c = configs[configName];
          if(!c) {
            c = config();
            configs[configName] = c;
          }
          return c;
        };

        me.$get = ['$q', function($q){
          var deferred = $q.defer();

          return function(configName) {
            return configs[configName];
          }
        }];

        return me;

      };

      return provider();
    })
    .controller('registerCtrl', ['$scope', 'piConfiguration', 'accountApi', function($scope, piConfiguration, accountApi){
      $scope.init = function(configName) {
        var config = piConfiguration(configName);
      }

      $scope.register = function(firstName, lastName, email, password, passwordConfirm, meta) {
        var req = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        };

        if(meta) {
          req = angular.extend(req, meta)
        }

        accountApi.register(req)
          .then(function(res){
            window.location = '/';
          }, function(res){
            alert('erro no login');
          });
      }
    }])
    .directive('piRegister', ['$document', function($document){
      return {
        controller: 'registerCtrl',
        controllerAs: 'ctrl',
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        compile: function compile(tElement, tAttrs, transclude) {
           return {
              pre: function preLink(scope, elemt, attrs, controller){

              },
              post: function postLink(scope, elem, attrs, ctrl) {
                var btn = angular.element(elem[0].querySelector('[login-submit]')),
                    mail = angular.element(elem[0].querySelector('[login-email]')),
                    pw = angular.element(elem[0].querySelector('[login-password]'));

                    if(navigator.appVersion.indexOf("Trident") != -1){
                        terminal.addClass('damn-ie');
                    }

                    var config = attrs['piConfig'];
                    scope.init(config || 'default');

                    var mouseover = false;

                    elem.on('mouseover', function(){
                      mouseover = true;
                    });

                    btn.on('click', function(){
                      scope.login(mail.val(), pw.val());
                    })

                    elem.on('mouseleave', function(){
                      mouseover = false;
                    });
              }
            }
          }
    }
    }])
    .controller('loginCtrl', ['$scope', 'piConfiguration', 'accountApi', function($scope, piConfiguration, accountApi){
      $scope.init = function(configName) {
        var config = piConfiguration(configName);
      }

      $scope.login = function(email, password) {
        accountApi.login(email, password)
          .then(function(res){
            window.location = '/';
          }, function(res){
            alert('erro no login');
          });
      }
    }])
    .directive('piAuth', ['$document', function($document){
      return {
        controller: 'loginCtrl',
        controllerAs: 'ctrl',
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        compile: function compile(tElement, tAttrs, transclude) {
           return {
              pre: function preLink(scope, elemt, attrs, controller){

              },
              post: function postLink(scope, elem, attrs, ctrl) {
                var btn = angular.element(elem[0].querySelector('[login-submit]')),
                    mail = angular.element(elem[0].querySelector('[login-email]')),
                    pw = angular.element(elem[0].querySelector('[login-password]'));

                    if(navigator.appVersion.indexOf("Trident") != -1){
                        terminal.addClass('damn-ie');
                    }

                    var config = attrs['piConfig'];
                    scope.init(config || 'default');

                    var mouseover = false;

                    elem.on('mouseover', function(){
                      mouseover = true;
                    });

                    btn.on('click', function(){
                      scope.login(mail.val(), pw.val());
                    })

                    elem.on('mouseleave', function(){
                      mouseover = false;
                    });
              }
            }
          }
    }
  }]);
})();

(function(){
	angular
		.module('pi.facebook', ['pi', 'facebook']);

	angular
		.module('pi.facebook')
		.run(['$rootScope',])
		.config(['$httpProvider',
			function($httpProvider) {
				$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			}]);
})();
(function(){
	
	angular
		.module('pi.ionic')
		.config(['$httpProvider', function($httpProvider){
			$httpProvider.interceptors.push(function($rootScope) {
		    return {
		      request: function(config) {
		        $rootScope.$broadcast('http:start')
		        return config
		      },
		      response: function(response) {
		        $rootScope.$broadcast('http:end')
		        return response
		      }
		    }
		  });
		}]);
})();
(function(){
	angular
		.module('pi.nav', ['pi']);
})();
(function(){
	'use strict';

	angular
		.module('pi.core.app', ['pi.core']);

})();
(function(){
	angular
		.module('pi.core.chat', ['pi.core']);
})();
(function(){
	'use strict';

	angular
		.module('pi.core.event', ['pi.core']);

})();
(function(){
	'use strict';

	angular
		.module('pi.core.payment', ['pi.core']);

})();

/**
 * Pi Provider
 *
 * The main module provider
 */
(function(){
	
	/**
	 * Global settings
	 *
	 * Settings that don't belong to a specific module are stored here
	 */	
 	var settings = { };

	var providerFn = function(){

		/**
		 * OAuth Provider
		 */
		settings.oAuthProviders =  [];

		this.getAuthProviders = function(){
			return settings.oAuthProviders;
		};

		this.addOAuthProvider = function(provider, appId) {
			settings.oAuthProviders.push({
				key: provider,
				appId: appId
			});
		};

		this.hasOAuthProvider = function(provider){
			angular.forEach(settings.oAuthProviders, function(value, key) {
				if(value.key == provider)  {
					return true;
				}
			});
			return false;
		};

		this.getOAuthAppId = function(provider){
			angular.forEach(settings.oAuthProviders, function(value, key) {
				if(value.key == provider) {
					return value.appId;
				}
			});

			return null;
		};


		/**
		 * Rest API
		 */
		settings.apiBaseUrl = '/api';

		this.getApiBaseUrl = function(){
			return settings.apiBaseUrl;
		};

		this.setApiBaseUrl = function(url){
			settings.apiBaseUrl = url;
		};

		/**
		 * Module version
		 */

		settings.version = '0.1';

		this.getVersion = function(){
			return settings.version;
		};

		this.setVersion = function(version) {
			settings.version = version;
		};

		/**
		 * Pi Modules
		 */
		settings.modules = [];

		this.getModules = function(){
			return settings.modules;
		};

		this.addModule = function(module) {
			settings.modules.push(module);
		};

		this.hasModule = function(module) {
			var ex = false;
			angular.forEach(settings.modules, function(value, vakey) {
				if(value === module) {
					ex = true;
				};
			});
			
			return ex;
		};

		var getFn = function(piSettings){

		};


		this.$get = [
		'piSettings', getFn];

        return this;
	};
	angular
        .module('pi')
        .value('piSettings', settings)
		.provider('piApp', providerFn);
})();
(function(){
  angular
    .module('pi.admin')
    .controller('pi.admin.adminCtrl', ['$rootScope', function($rootScope){

    }]);
})();

(function(){
  angular
    .module('pi.admin')
    .controller('pi.admin.articleEditCtrl', ['pi.core.article.articleSvc', '$scope', function(articleSvc, $scope){

    }]);
})();

(function(){
  angular
    .module('pi.admin')
    .controller('pi.admin.articleManageCtrl', ['pi.core.article.articleSvc', '$scope', function(articleSvc, $scope){

    }]);
})();

(function(){
  angular
    .module('pi.admin')
    .controller('pi.admin.eventEditCtrl', ['pi.core.app.eventSvc', '$scope', function(eventSvc, $scope){

    }]);
})();

(function(){
  angular
    .module('pi.admin')
    .controller('pi.admin.eventManageCtrl', ['pi.core.app.eventSvc', '$scope', function(eventSvc, $scope){

    }]);
})();

(function(){
  var piAlertStack = function(piStack)
  {
    var stack = {};
    var alertsOpened = piStack.create();

    var open = function(instance, alert)
    {
      alertsOpened.add(instance, alert);
    };

    var close = function(instance, result) {
      alertsOpened.remove(instance);
    }

    var dismiss = function(instance, reason)
    {
      alertsOpened.remove(instance);
    };

    var top = function(){
      return alertsOpened.top();;
    }

    return {
      open: open,
      dismiss: dmiss,
      close: close,
      top: top
    }
  };
  piAlertStack.inject = ['piStack'];

  var piAlert = function(piAlertStack, $q) {

    var piAlertProvider = {
      options: {
        relative: true
      },
    $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', 'piAlertStack',
    function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
      var piAlert = {};

      function getTemplatePromise(options) {
        return options.template ? $q.when(options.template) :
          $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
            return result.data;
          });
      }

      function getResolvePromises(resolves) {
        var promisesArr = [];
        angular.forEach(resolves, function (value, key) {
          if (angular.isFunction(value) || angular.isArray(value)) {
            promisesArr.push($q.when($injector.invoke(value)));
          }
        });
        return promisesArr;
      }
        piAlert.open = function(alertOptions) {
            var alertResultDererred = $q.defer(),
                alertOpenedDeferred = $q.defer(),
                instance = {
                  result: modalResultDeferred.promise,
                  opened: modalOpenendDeferred.promise,
                  close: function(result) {
                    piAlertStack.close(instance, result);
                  },
                  dismiss: function(reason) {
                    piAlertStack.dismiss(instane, reason);
                  }
                };
            modal
            piAlertStack.open(instance, alert);
        };

        alertOptions = angular.extend({}, alertProvider.options, alertOptions);
        alertOptions.resolve = alertOptions.resolve || {};

        if(!modalOptions.template && !modalOptions.templateUrl) {
          throw new Error('One of template or templateUrl options is required.');
        }

        var tplAndResolvePromise = $q
        .all([getTemplatePromise(alertOptions)])
        .concat(getResolvePromises(alertOptions.resolve));
    }]
};
    angular
      .module('pi')
      .provider('piAlert', piAlert)
      .factory('piAlertStack', piAlertStack);
  };

  piAlert.$inject = ['piAlertStack', '$q'];

  piAlertContainer = function(){
      var link = function(scope, elem, attrs)
      {
        scope.close = function(evt)
        {
          evt.preventDefault();
          evt.stopPropagation();
          var alert = piAlertStack.getTop();
          //if (alert && alert.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
          $modalStack.dismiss(modal.key, 'backdrop click');
        };
      };

      return {
        restrict: 'EA',
        templateUrl: 'pi/alert-container.html'
      }
  };

})();

(function(){
	'use strict';

	var chat = function(){
		var appKey = '',
			appSecret = '',
			appId = '',
			inbox = [];

		var receiveMessage = function(sender, message, datetime){

		}

		var sendMessage = function(sender, message){

		}

		return {
			setAppKey: function(value){
				appKey = value;
			},
			setAppSecret: function(value){
				appSecret = value;
			},
			setAppId: function(value){
				appId = value;
			},
			$get: function(){

				return {

				}
			}
		}
	}

	var chatWindow = function(){
		var controller = function(){

		};

		return {
			templateUrl: '/html/pi/chat-window.html',
			controller: controller,
			controllerAs: 'chatWindowCtrl'
		}
	}

	var chatMessage = function(){
		return {
			templateUrl: '/html/pi/chat-message.html',
		}
	}

	var chatMessagePreview = function(){
		return {
			templateUrl: '/html/pi/chat-message-preview.html'
		}
	}

	angular
		.module('pi.chat')
		.directive
})();
(function(){
	angular
		.module('pi.core.file')
		.factory('pi.core.file.fileSvc', ['piHttp', '$log', function(piHttp, $log){

			var self = this;

			this.remove = function(id) {
				return piHttp.post('/files/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/files/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/files/' + id, model);
			}

      this.find = function(model) {
				return piHttp.get('/files', {params: model});
			}

			return this;
		}]);
})();

(function(){
	angular
		.module('pi.gallery')
		.directive('piGallery', [function(){
	    	return {
	    		templateUrl: 'core/pi-gallery.tpl.html',
	    		scope: {
	    			images: '='
	    		},
	    		replace: true,
	    		controller: ['$scope', '$rootScope', function($scope, $rootScope){
	    			$scope.path = "src";
					$scope.tileWidth = 150;
					$scope.tileHeight = 150;

					$scope.displayImage = function (img) {
						$scope.selected = $scope.images.indexOf(img);
						$scope.selectedImg = img;
						$scope.showModal = true;
					};

					$scope.close = function(){
						$scope.showModal = false;
					}
	    		}]
	    	}
	    }]);

	    
})();
(function() {
    angular
        .module('pi')
        .factory('pi.core.placeSvc', ['piHttp', function (piHttp) {

            this.post= function (dto) {
                return piHttp.post('/place', dto);
            }

            this.find = function () {
                return piHttp.get('/place');
            }

            this.get = function (id) {
                return piHttp.get('/place/' + id);
            }


            return this;

        }]);
})();
(function(){
	angular
		.module('pi.core')
		.provider('pi.core.responseUtilsSvc', [function(){

			var getModelFromStateParams = function(names, model){
                angular.forEach(names, function(value){
                    if(!_.isUndefined($stateParams[value])) {
                        model[value] = $stateParams[value];
                    }
                });

                return model;
            };
			return {
				$get: ['$stateParams', function($stateParams){
					return {
						orderByNewest: function(items, keyDate) {
							if(!_.isArray(items) || !_.isString(keyDate)) {
								return null;
							}

							var events = _.groupBy(items, function (event) {
		                      return moment.utc(event[keyDate], 'X').startOf('day').format('DD-MM-YYYY');
		                    });

		                    events = _.map(events, function(group, day){
		                        return {
		                            day: day,
		                            results: group
		                        }
		                    });

							return events;
						},
						getModelFromStateParams: function(names, model){
		                    return getModelFromStateParams(names, model);
		                },
		                getQueryModel: function(data, queryKeys, take){
		                	var take = _.isNumber(take) ? take : 12,
		                		model = {
		                			skip: _.isObject(data) && _.isNumber(data.length) ? data.length : 0, 
		                			take: take
		                		};

		                    getModelFromStateParams(queryKeys, model);
		                    return model;
		                },
					}
				}]
			}
		}]);
})();
(function(){
  angular
    .module('pi.ui-router')
    .factory('pi.ui-router.stateUtils', ['$stateParams', function($stateParams){
      return {
        getModelFromStateParams: function(names, model){

            angular.forEach(names, function(value){
                if(!_.isUndefined($stateParams[value])) {
                    model[value] = $stateParams[value];
                }
            });

            return model;
        }
      }
    }]);
})();

(function(){

	var AccountRecover = function(AccountRecoverService)
	{
		var linkFn = function(scope, elem, attrs)
		{
			scope.submit = function()
			{
				var successFn = function(res)
					{
						scope.onSuccessFn(res);
					},
					errorFn = function(res)
					{
						scope.onError(res);
					};

				AccountRecoverService.requestRecover(scope.email)
					.then(successFn, errorFn);
			};

			scope.cancel = function()
			{

			};
		};

		return {
			scope: {
				'piConfig': '=piConfig',
				'onSuccess': '=onSuccess',
				'onError': '=onError'
			},
			link: linkFn
		};
	};

	AccountRecover.$inject = ['AccountRecoverService'];

	var AccountRecoverService = function($http, $q, modalSvc)
	{
		this.requestRecover = function(email)
		{
			var deferred = $q.defer(),
				successFn = function(res)
				{
					deferred.resolve(res.data);
				},
				errorFn = function(res)
				{
					deferred.reject(res);
				};
			$http.post('/account/recover')
				.then(successFn, errorFn, {email: email});

			return deferred.promise;
		};

		this.sendRecover = function(email, token, password, passwordConfirm)
		{
			var deferred = $q.defer(),
				model = {
					password: password,
					passwordConfirm: passwordConfirm,
					token: token,
					email: email
				},
				successFn = function(res)
				{
					deferred.resolve(res.data);
				},
				errorFn = function(res)
				{
					deferred.reject(res);
				};

			$http.post('/accouunt/recover/send', model)
				.then(successFn, errorFn);

			return deferred.promise;
		};

		return this;
	};

	AccountRecoverService.$inject = ['$http', '$q', 'modalSvc'];

	angular
		.module('pi')
		.directive('piAccountRecover', AccountRecover)
		.factory('AccountRecoverService', AccountRecoverService);
})();
(function(){
  angular
    .module('pi')
    .directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
})();

(function(){
	var PiBreadcrumb = function(PiBreadcrumbService)
	{
		var link = function(scope, elem, attrs)
		{
			scope.current = PiBreadcrumbService.current;
		}
		return {
			templateUrl: '/html/pi/breadcrumb.html',
			link: link
		}
	};

	PiBreadcrumb.$inject = ['piBreadcrumbService'];

	var PiBreadcrumbService = function($rootScope)
	{
		var _current = {name: 'First', image: null};
		var uiStateGenerated = true;

		var set = function(name, image){
			_current.name = name;

			if(!_.isNull(image)){
				_current.image = image;
			}
		};
		if(uiStateGenerated) {
			$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){
				_current.name = toState.name;
			});
		}
		var current = function()
		{

			return ;
		};
		return {
			set: set,
			current: _current
		};
	};

	PiBreadcrumbService.$inject = ['$rootScope'];

	angular
		.module('pi')
		.factory('piBreadcrumbService', PiBreadcrumbService)
		.directive('piBreadcrumb', PiBreadcrumb);
})();
(function(){
	'use strict';
	var piCommentResource = function($resource, piHttp) {
		return {
			create: function(namespace, id) {

				return $resource(piHttp.getBaseUrl() + '/comment/' + namespace + '/' + id,
		            {},
		            {
		            'query': {
		                method: 'GET',
		                transformResponse: function(res) {
		                    return angular.fromJson(res).comments || [];
		                },
		                isArray: true
		            }
		        });
			}
		}
	};
	piCommentResource.$inject = ['$resource', 'piHttp'];

	var piCommentWindow = function(piCommentResource) {
		

		var link = function(scope, elem, attrs) {
			
			
			
		}

		var ctrl = function($scope, $q) {
			var resource = piCommentResource.create($scope.namespace, $scope.id);

			$scope.comments = resource.query({});
			
			this.send = function(message) {
                var deferred = $q.defer();
				resource.save({message: message, id: $scope.id}, function(res){
                    $scope.comments.push(res.comment);
                    deferred.resolve(res);
                });
                return deferred.promise;
			}
		};
		return {
			controller: ctrl,
			link: link,
			scope: {
				namespace: '@',
				id: '@'
			},
			templateUrl: 'html/pi/comment-window.html'
		}
	};
	piCommentWindow.$inject = ['piCommentResource', '$q'];

	var piCommentMessage = function() {
		
		return {
			templateUrl: 'html/pi/comment-message.html',
			replace: true,
			scope: {
				'comment': '='
			}
		}
	};

	var piCommentForm = function() {
		var link = function(scope, elem, attrs, piCommentWindow) {
			scope.send = function() {
				piCommentWindow.send(scope.message)
                    .then(function(res){
                        scope.message = '';
                    });
			}
		};

		return {
			templateUrl: 'html/pi/comment-form.html',
			require: '^piCommentWindow',
			link: link
		}
	};

	var piCommentReplyForm = function() {
		return {
			templateUrl: 'html/pi/comment-reply-form.html'
		}
	};

	angular
		.module('pi')
		.factory('piCommentResource', piCommentResource)
		.directive('piCommentWindow', piCommentWindow)
		.directive('piCommentMessage', piCommentMessage)
		.directive('piCommentForm', piCommentForm)
		.directive('piCommentReplyForm', piCommentReplyForm);
})();
(function(){

	var piFormMaker = function(){
		var link = function(scope, elem, attrs, ctrl){

		}
		return {
			templateUrl: '/html/pi/form-maker.html',
			link: linkFn
		}
	};

	angular
		.module('pi')
		.directive('piFormMaker', piFormMaker);
})();
/**
 * @ng-doc directive
 * @name gist
 * @description
 *
 * Directive to embed a iframe from GitHub Gist service.
 * Original directive: https://gist.github.com/tleunen/5277011
 */
(function(){
	var directiveFn = function() { 
	    return function(scope, elm, attrs) {
	        var gistId = attrs.gistId;

	        var iframe = document.createElement('iframe');
	        iframe.setAttribute('width', '100%');
	        iframe.setAttribute('frameborder', '0');
	        iframe.id = "gist-" + gistId;
	        elm[0].appendChild(iframe);

	        var iframeHtml = '<html><head><base target="_parent"><style>table{font-size:12px;}</style></head><body onload="parent.document.getElementById(\'' + iframe.id + '\').style.height=document.body.scrollHeight + \'px\'"><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + gistId + '.js"></sc'+'ript></body></html>';

	        var doc = iframe.document;
	        if (iframe.contentDocument) doc = iframe.contentDocument;
	        else if (iframe.contentWindow) doc = iframe.contentWindow.document;

	        doc.open();
	        doc.writeln(iframeHtml);
	        doc.close();
	    };
	 };

	 angular
	 	.module('pi')
	 	.directive('gist', directiveFn);
})();
(function(){
  var PiMetaDirective = function(FieldsMetaService, $parse)
  {
      return {
        templateUrl: '/html/pi/meta.html',
        scope: {
          'piConfig': '=piConfig',
          'piMeta': '=piMeta'
        },
        link: function(scope, elem, attrs)
        {
          scope.viewEdit = false;
          scope.viewAdd = false;
          scope.viewAddAvailable = false;
          scope.metaAddCurrent = {};
          scope.metaSelectAddCurrent = {};
          scope.metaSelectCurrent = [];
          scope.metaSelectEditCurrent = {};
          scope.metaAdd = [];
          scope.metaType = '';
          var service = undefined;
          var config = {};

          if(!_.isUndefined(scope.piConfig))
          {
            config = scope.piConfig;
            if(_.isArray(config.defaults))
            {
              service = new FieldsMetaService(config.defaults);
            } else {
              service = new FieldsMetaService();
            }
          } else {
            service = new FieldsMetaService();
            config = {};
          }

          scope.meta = service.meta;
          scope.available = service.available;

          scope.addModel = {};

          scope.viewEditNewSelect = false;
          scope.viewEditSelect = false;

          scope.piMeta = service.meta;
          scope.metaEdit = scope.piMeta[0];

          scope.getPlaceholderText = function(obj, defaultPlaceholder){
            if(!_.isUndefined(obj.placeholder)){
              return obj.placeholder;
            }
            return defaultPlaceholder;
          }

          scope.addEntry = function()
          {
            var model = scope.metaAddCurrent;
            if(scope.metaType != '')
              model.metaType = scope.metaType;

              service.addObj(angular.copy(model));
              scope.metaAddCurrent = {};
              scope.viewAdd = false;
              scope.metaType = '';
          }

          scope.editSelectOpt = function(item)
          {
            scope.metaSelectEditCurrent = {
              displayNisplay:item.displayName,
              value: item.value
            };
            scope.viewEditNewSelect = true;
          };

          scope.editSelectEntry = function()
          {

          };

          scope.cancelEditSelect = function()
          {
            scope.viewEditNewSelect = false;
            scope.metaSelectEditCurrent = {};
          }

          scope.addSelectEntry = function()
          {
            scope.metaSelectCurrent.push(scope.metaSelectAddCurrent);
            scope.metaSelectAddCurrent = {};
          }

          scope.addSelect = function()
          {
            service.addObj({metaType: 'select', values: scope.metaSelectCurrent, key: scope.metaSelectCurrentKey, displayName: scope.metaSelectCurrentKey});
            scope.viewEditNewSelect = false;
            scope.metaSelectCurrent = [];
            scope.metaType = '';
            scope.metaSelectCurrentKey = '';
          }

          scope.change = function(item, model) {
            scope.metaEdit = angular.extend({}, item);
            scope.viewEdit = true;
          }

          scope.add = function(item, model){
            scope.viewEdit = false;
            scope.viewAdd = true;
            scope.metaAddCurrent = angular.copy(item);
            scope.metaType = item.metaType || '';
          }

          scope.goAdd = function()
          {
            scope.viewEdit = false;
            scope.viewAdd = true;
            scope.metaType = '';
          }

          scope.cancelAdd = function()
          {
            scope.viewAdd = false;
            scope.metaType = '';
          }

          scope.saveMeta = function() {
            angular.forEach(scope.piMeta, function(value, key) {
              if(value.key == scope.metaEdit.key) {
                scope.piMeta[key] = angular.extend({}, scope.metaEdit);
              }
            });
            scope.viewEdit = false;
          }

          scope.removeMeta = function(metaKey){
            if(_.isUndefined(metaKey))
            metaKey = scope.metaEdit.key;

            angular.forEach(scope.piMeta, function(value, key) {
              if(value.key == metaKey) {
                scope.piMeta.splice(key, 1);
              }
            });
            scope.viewEdit = {};
            scope.viewEdit = false;
            scope.metaEdit = {};
          };

          scope.cancelEdit = function(){
            scope.viewEdit = false;
            scope.metaEdit = {};
          }
        }
      }
  };
  PiMetaDirective.$inject = ['FieldsMetaService', '$parse'];

  angular
      .module('pi')
      .directive('piMeta', PiMetaDirective);
})();

(function(){
  angular
    .module('pi')
    .directive('ngPrism', ['$interpolate', function($interpolate){
            return {
                restrict: 'AEC',
                template: '<pre><code ng-transclude></code></pre>',
                replace: true,
                transclude: true,
                link: function (scope, elm) {
                    var tmp = $interpolate(elm.find('code').text())(scope);
                    elm.find('code').html(Prism.highlightElement(tmp).value);
                }
            };
        }]);
})();

(function(){

    /**
     * @name Partition Filter
     *
     * @description
     * Published at StackOveflow 
     * http://stackoverflow.com/questions/21644493/how-to-split-the-ng-repeat-data-with-three-columns-using-bootstrap
     */
    var Partition = function() {
    var cache = {}; // holds old arrays for difference repeat scopes
    var filter = function(newArr, size, scope) {
      var i,
        oldLength = 0,
        newLength = 0,
        arr = [],
        id = scope.$id,
        currentArr = cache[id];
      if (!newArr) return;

      if (currentArr) {
        for (i = 0; i < currentArr.length; i++) {
          oldLength += currentArr[i].length;
        }
      }
      if (newArr.length == oldLength) {
        return currentArr; // so we keep the old object and prevent rebuild (it blurs inputs)
      } else {
        for (i = 0; i < newArr.length; i += size) {
          arr.push(newArr.slice(i, i + size));
        }
        cache[id] = arr;
        return arr;
      }
    };
    return filter;
  }; 

  angular
    .module('pi')
    .filter('partition', Partition);
})();
(function(){
  "use strict";

  var piContentCtrl = function($scope)
  {
     var ctrl = this;
        ctrl.model = $scope.model = {view: 'normal'};

     var normalView = function()
     {
       $scope.model.view = "normal";
       ctrl.model.view = "normal";
       $scope.$broadcast('view',{"name":'normal'})
     };

     ctrl.getView = $scope.getView = function()
     {
       return $scope.view;
     }

     ctrl.viewEdit = $scope.viewEdit = function()
     {
         $scope.model.view = "edit";
         ctrl.model.view = "edit";
         $scope.$broadcast('view',{"name":'edit'})
     };

     ctrl.endEdit = $scope.endEdit = function()
     {
       normalView();
     };

     ctrl.cancelEdit = $scope.cancelEdit = function()
     {
       normalView();
     };
   };

  var piContent = function(){

       var linkFn = function(scope, elem, attrs)
       {
           elem.addClass('pi-content');

           if(scope.piContentEditable){
               elem.addClass('pi-content-editable');
           }

           elem.on('mouseenter', function(){
               elem.addClass('pi-content--hover');
           });

           elem.on('mouseleave', function(){
               elem.removeClass('pi-content--hover');
           });

           scope.$on('view', function(event, args){
             if(args.name == 'normal'){
               elem.removeClass('pi-content--edit');
             } else if(args.name == 'edit') {
               elem.addClass('pi-content--edit');
             }
           });

       };

       return {
           link: linkFn,
           restrict: 'A',
           controller: 'PiContentCtrl',
           scope: true
       }
   };

   var piContentView = function()
   {
       var linkFn = function(scope, elem, attrs, piContentCtrl)
       {
         scope.$on('view', function(event, args){
           if(args.name == 'normal'){
               elem.removeClass('hide');
           } else if(args.name == 'edit'){
               elem.addClass('hide');
           }
         });

         scope.ctrl = piContentCtrl;
         elem.addClass('pi-content-view');
       }
       return {
           link: linkFn,
           restrict: 'A',
           require: '^piContent',
           scope: {
             'view': '@'
           }
       }
   };

   var piContentEditable = function()
   {
       var linkFn = function(scope, elem, attrs, piContentCtrl)
       {
         elem.addClass('hide');

         scope.$on('view', function(event, args){
           if(args.name == 'edit'){
               elem.removeClass('hide');
           } else if(args.name == 'normal'){
               elem.addClass('hide');
           }
         });
           elem.addClass('pi-content-editable');
       }
       return {
           link: linkFn,
           restrict: 'A',
           require: '^piContent',
           scope: {
             'view': '='
           }
       }
   };

   var piContentEdit = function()
   {
       var linkFn = function(scope, elem, attrs, piContentCtrl)
       {
           elem.addClass('pi-content-edit');

           elem.bind('click', function(){
               piContentCtrl.viewEdit();
           })
       }
       return {
           link: linkFn,
           restrict: 'A',
           require: '^piContent'
       }
   };

   var piContentEditableCancel = function()
   {
       var linkFn = function(scope, elem, attrs, piContentCtrl)
       {
           elem.addClass('pi-content-editable-cancel');

           elem.bind('click', function(){
               piContentCtrl.cancelEdit();
           })
       }
       return {
           link: linkFn,
           restrict: 'A',
           require: '^piContent'
       }
   };
   var piContentEditableSubmit = function()
   {
       var linkFn = function(scope, elem, attrs, piContentCtrl)
       {
           elem.addClass('pi-content-editable-submit');

           elem.bind('click', function(){
               scope.onSubmit();
               piContentCtrl.endEdit();
           })
       }
       return {
           link: linkFn,
           restrict: 'A',
           require: '^piContent',
           scope: {
             'onSubmit': '&'
           }
       }
   };

   angular
    .module('pi')
      .controller('PiContentCtrl', piContentCtrl)
      .directive('piContent', piContent)
      .directive('piContentView', piContentView)
      .directive('piContentEditable', piContentEditable)
      .directive('piContentEditableCancel', piContentEditableCancel)
      .directive('piContentEditableSubmit', piContentEditableSubmit)
      .directive('piContentEdit', piContentEdit);
})();

/**
 * @ng-doc directive
 * @name scrollToId
 * @dependencies jquery jquery.animate
 *
 * @description
 * Scroll to an element by his id, animating the window
 *
 * @example
 * <a id="firstSection">First Section</a>
 * <a scroll-to-id scroll-to="firstSection">Scroll to first section</a>
 */
(function(){
	var fn =  function() {                                                      
	    return {                                                                                 
	        restrict: 'A',                                                                       
	        scope: {                                                                             
	            scrollTo: "@"                                                                    
	        },                                                                                   
	        link: function(scope, $elm,attr) {

	        	$elm.on('click', function() {                                                    
	                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, "slow");
	            });
	        }                
	    };
    };
})();
var INTEGER_REGEXP = /^\-?\d*$/;

(function(){
  var PiSeoValidator = function(SeoValidator)
  {


    var linkFn = function(scope, elem, attrs, ctrl)
    {
      ctrl.$parsers.unshift(function(viewValue) {
       if (INTEGER_REGEXP.test(viewValue)) {
         // it is valid
         ctrl.$setValidity('integer', true);
         return viewValue;
       } else {
         // it is invalid, return undefined (no model update)
         ctrl.$setValidity('integer', false);
         return undefined;
       }
     });
    };

    return {
      require: 'ngModel', // Validation is run agains the ng-model
      link: linkFn
    };
  };

  PiSeoValidator.$inject = ['SeoValidator'];

  angular
    .module('pi')
    .directive('piSeoValidator', PiSeoValidator);
})();

(function(){
    'use strict';
    var UploadThumbnail = function(Upload, piHttp){

        var linkFn = function(scope, elem, attrs, ngModel){
            var self = this;


            //scope.thumbnailSrc = _.isString(ngModel.$viewValue) ? ngModel.$viewValue : 'http://fitting.pt/dist/images/event-thumbnail.jpg';
            attrs.$observe('ngModel', function(value){ // Got ng-model bind path here
              scope.$watch(value,function(newValue){ // Watch given path for changes
                  scope.thumbnailSrc = _.isString(ngModel.$viewValue) ? ngModel.$viewValue : 'http://fitting.pt/dist/images/event-thumbnail.jpg';
              });
           });

            scope.$watch('files', function () {
                scope.upload(scope.files);
            });

            scope.upload = function (files) {

                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var url = piHttp.getBaseUrl() + '/filesystem';

                        Upload.upload({
                            url: url,
                            fields: {},
                            file: file
                        }).progress(function (evt) {
                            scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function (data, status, headers, config) {
                            ngModel.$setViewValue(data.uri);
                            scope.thumbnailSrc = data.uri;
                        });
                    }
                }
            };


            scope.getTemplate = function(){
                if(!_.isUndefined(attrs.piTemplate)){
                    return attrs.piTemplate;
                }

                return 'html/upload-thumbnail.html';
            }
        };

        return {
            require: '^ngModel',
            scope: {

            },
            link: linkFn,
            template: '<ng-include class="upload-thumbnail" src="getTemplate()"></ng-include>'
        }
    };

    UploadThumbnail.$inject = ['Upload', 'piHttp'];

    angular
        .module('pi')
        .directive('uploadThumbnail', UploadThumbnail);

})();
(function(){
	
	angular
		.module('pi')
		.factory('wizardService', ['$q', '$log',
			function($q, $log) {

				var svc = {
					defaultName: 'defaultWizard'
				};
				var wizards = {};

				svc.addWizard = function(name, wizard) {
					wizards[name] = wizard;
				};

				svc.removeWizard = function(name) {
					delete wizards[name];
				};

				svc.getWizard = function(name) {
					var nameToUse = name;
					if(!name) {
						nameToUse = svc.defaultName;
					}

					return wizards[nameToUse];
				}

				return service;
			}])
		.directive('piWizard', [function(){

			var firstRun = true;


			return {
				scope: {
					'currentStep': '=',
					'onFinish': '&',
					'hideIndicators': '=',
					'editMode': '=',
					'name': '@'
				},
				templateUrl: function(elem, attrs) {
					return attrs.template || 'pi/wizard.tpl.html';
				},
				controller: ['$scope', '$element', 'wizardService', '$q',
					function($scope, $element, wizardService, $q) {
						var wizardName = $scope.name || wizardService.defaultName;

						wizardService.addWizard(wizardName, this);

						$scope.$on('$destroy', function(){
							wizardService.remove(wizardName);
						});

						$scope.steps = [];
						$scope.context = {};
						this.context = $scope.context;

						var getStepByTitle = function(title) {
							var found = null;
							angular.forEach($scope.getEnabledSteps(), function(step) {
								if(step.wizardTitle === title) {
									found = step;
								}
							});

							return found;
						}

						var unselectAll = function() {
							 angular.forEach($scope.getEnabledSteps(), function (step) {
			                    step.selected = false;
			                });
			                
			                $scope.selectedStep = null;
						}	

						$scope.getEnabledSteps = function() {

						}

						$scope.$watch('currentStep', function(step) {
							if(!step) return;
							var stepTitle = $scope.selectedStep.wizardTitle;
							if($scope.selectedStep && stepTitle !== $scope.currentStep) {
								$scope.goToStep(getStepByTitle($scope.currentStep));
							}
						});

						this.addStep = function(step) {
							$scope.steps.push(step);

							if($scope.getEnabledSteps().length === 1) {
								$scope.goToStep($scope.getEnabledSteps()[0]);
							}
						}

						$scope.getEnabledSteps = function() {
			                return $scope.steps.filter(function(step){
			                    return step.disabled !== 'true';
			                });
			            };
						
						$scope.goToStep = function(step) {
							if(firstRun) { // bi-passes validation
								unselectAll();
								$scope.selectedStep = step;

								if(!_.isUndefined($scope.currentStep)) {
									$scope.currentStep = step.wizardTitle;
								}
								step.selected = true;
								$scope.$emit('wizard:stepChanged', {step: step});
								firstRun = false;
							} else { 
								var thisStep = $scope.currentStepNumber() > 0
									? $scope.currentStepNumber() - 1
									: 0;
							}
						}
					}]
			}
		}])
		.directive('piWizardStep', [function(){

			return {
				templateUrl: 'pi/wizard-step.tpl.html',
				controller: ['$scope', '$rootScope',
					function($scope, $rootScope) {

						
					}]
			}
		}])
		.directive('piWizardBack', [function(){

			return {
				templateUrl: 'pi/wizard-step.tpl.html',
				controller: ['$scope', '$rootScope',
					function($scope, $rootScope) {

						
					}]
			}
		}])
		.directive('piWizardButton', [function(){

			return {
				templateUrl: 'pi/wizard-step.tpl.html',
				controller: ['$scope', '$rootScope',
					function($scope, $rootScope) {

						
					}]
			}
		}]);
})();
/**
 *
 */
(function(){
	var settings = {};

	var flags = {
		sdk: false,
		ready: false
	};

	var provider = function(){
		
      this.setAppId = function(appId){
      	settings.appId = appId;
      };

      this.getAppId = function(){
      	return appId;
      };

      settings.locale = 'pt_PT';

      this.setLocale = function(locale) {
      	settings.locale = locale;
      };

      this.getLocal = function(){
      	return settings.locale;
      };
    
		settings.status = true;

		this.setStatus = function(status) {
		  settings.status = status;
		};

		this.getStatus = function() {
		  return settings.status;
		};

	settings.version = '2.0';
	this.setSdkVersion = function(version) {
		settings.version = version;
	};

	this.getSdkVersion = function(){
		return settings.version;
	};

	      /*
         * load SDK
         */
        settings.loadSDK = true;

        this.setLoadSDK = function(a) {
          settings.loadSDK = !!a;
        };

        this.getLoadSDK = function() {
          return settings.loadSDK;
        };

        /**
         * Custom option setting
         * key @type {String}
         * value @type {*}
         * @return {*}
         */
        this.setInitCustomOption = function(key, value) {
          if (!angular.isString(key)) {
            return false;
          }

          settings[key] = value;
          return settings[key];
        };

        /**
         * get init option
         * @param  {String} key
         * @return {*}
         */
        this.getInitOption = function(key) {
          // If key is not String or If non existing key return null
          if (!angular.isString(key) || !settings.hasOwnProperty(key)) {
            return false;
          }

          return settings[key];
        };

      this.shareDialog = function(title, content, url) {

      };

      this.like = function(postId) {
      	FB.ui(
		 {
		  method: 'share',
		  href: 'https://developers.facebook.com/docs/'
		}, function(response){});
      };

      this.getComments = function(url) {

      };

      var getFn = function($q, $rootScope, $timeout, $window){

      		/**
      		 * The NgFacebook class is retrieved from Facebook Service request
      		 */
      		function NgFacebook(){
      			this.appId = settings.appId;
      		}

      		NgFacebook.prototype.isReady = function(){
      			return flags.ready;
      		};

      		
      };

      this.$get = [
      	'$q',
      	'$rootScope',
      	'$timeout',
      	'$window', getFn];

	};

	angular
		.module('pi')
		.value('fbSettings', settings)
		.value('fbFlags', flags)

})();
(function(){

	var piFileManager = function(){



		return {

			$get: {

			}
		}
	}

	var piUploadService = function(){

		var upload = function(file, uploadDto){

		}
		return {
			upload: upload
		}
	}

	var piFileDashboard = function(){

		return {
			templateUrl: '/html/pi/file-dashboard.html'
		}
	}
	var piFileUpload = function(){

		var link = function(scope, elem, attr){

		}

		var controller = function($scope){
			this.upload = function(){

			}
		}
		return {
			link: link,
			controller: controller,
			controllerAs: 'ctrl'
		}
	}

	var  piFileUploadArea = function(){

		return {
			templateUrl: '/html/pi/file-upload-area.html'
		}
	}

	var piFileUploadBrowse = function(){
		return {
			templateUrl: '/html/pi/file-upload-browser.html'
		}
	}

	var piFileEditCard = function(){
		return {
			templateUrl: '/html/pi/file-edit-card.html'
		}
	}

	var piFileCard = function(){
		return {
			templateUrl: '/html/pi/file-card.html'
		}
	}

	
})();
/**
 * Filter to reverse a list
 * @ngdoc filter
 * @name reserve
 * @kind function
 *
 * @description
 * Reverse a array without replacing the original array since slice is used to return the array 
 *
 * @return {Array}
 *
 * @example
 * <div ng-repeat="verses in bibles.kingJames | reverse">
 * 	<em ng-bind="verse.number"></em> <span ng-bind="verse.message"></span>
 * </div>
 */
(function(){
	
	var reverseFilter = function(){

	  return function(items) {
	    return items ? items.slice().reverse() : [];
	  };

	};

	angular.module('pi')
		.filter('reverse', reverseFilter);
})();
(function(){
		'use strict';
    /**
     * @ngdoc directive
     * @name Pi Form
     * @description Directory to create a form
     */
	var piForm = function(){

        var compileFn = function(cElement, cAttrs, transclude) {

            var preFn = function(scope, pElement, pAttrs, pController) {

                },
                postFn = function(scope, pElement, pAttrs, pController) {

                };

            return {
                pre: preFn,
                post: postFn
            }
        };

				var controller = function($scope, $injector, $http, piStack)
		    {
		      if(_.isUndefined($scope.httpMethod)) {
		        $scope.httpMethod = 'POST';
		      }

		      var isService = !_.isUndefined($scope.serviceApp) && !_.isUndefined($scope.serviceUri);
		      $scope.model = {};

		      this.submit = function()
		      {
		        if(isService) {
		          serviceHandler();
		        } else if(isHttp) {
		          httpHandler();
		        } else {

		        }
		      };

		      this.setPreventSave = function()
		      {
		        $scope.$on('tentar mudar pagina', function(){
		          // mostrar modal que retorna uma promessa a ver se muda de página ou ão
		        });
		      };

		      var serviceHandler = function(dto)
		      {
		        var service = piServiceResolver.get($scope.serviceUri);
		        if(_.isNull(service)) {
		          // error
		        }
		        ServiceBroker.executeRequest($scope.serviceRequest, $scope.httpMethod, request)
		        .then(function(res) {
		            scope.onSuccess();
		          }, function(res) {
		            scope.onFailure();
		          });

		      };

		      var httpHandler = function(dto)
		      {
		        $http[$scope.httpMethod]($scope.httpUri, dto)
		          .then(function(res) {
		            scope.onSuccess();
		          }, function(res) {
		            scope.onFailure();
		          });
		      };
		    };
				controller.$inject = ['$scope', '$injector', '$http', 'piStack'];
        return {
            compile: compileFn,
						controller: controller,
						controllerAs: 'piFormCtrl'
        };
    };

    var piFormGroup = function($compile){
        var controllerFn = function($scope, $element, $attrs){

						var guide;

            this.focus = function(){
							if($attrs.piFormGuide){
								guide = $compile('<div class="fit-form__guide">' + $attrs.piFormGuide + '</div>')($scope);
								$element.append(guide);
							}
							// show help guide

                // show all labels with hide attr on form group
            };

            this.blur = function(){
								if(guide){
									guide.remove();
								}
                // hide all la
                // bels with hide attr  on form group
            }
        }
        return {
            controller: controllerFn,
						controllerAs: 'piFormGroupCtrl',
						require: '^piForm'
        }
    };
		piFormGroup.$inject = ['$compile'];

    var piFormFooter = function(){
        return {};
    };

    var piFormControl = function(piFormConfig){
        var compileFn = function(cElement, cAttrs) {

            var preFn = function(scope, pElement, pAttrs, parentCtrl) {
						//	if(piFormConfig.applyPiClasses && !pElement.hasClass('pi-form__control'))
								pElement.addClass('pi-form__control');

              var focusFn = function(fElement) {
                  parentCtrl.focus();
              };
              pElement.on('focus', focusFn);

							var blurFn = function(fElement){
								parentCtrl.blur();
							}
							pElement.on('blur', blurFn)
            },
            postFn = function(scope, pElement, pAttrs) {

            };

            return {
                pre: preFn,
                post: postFn
            }
        };
        return {
            compile: compileFn,
						restrict: 'EA',
						require: '^piFormGroup',
        }
    };
		piFormControl.$inject = ['piFormConfig'];

    var piFormLabel = function(){

        var compileFn = function(cElement, cAttrs, transclude) {

            var preFn = function(scope, pElement, pAttrs, pController) {
                    if(_.isNull(pAttrs.piHideFocus) && pAttrs.piHideFocus == true) {
                        cElement.css('display', 'none');
                    }
                },
                postFn = function(scope, pElement, pAttrs, pController) {

                };

            return {
                pre: preFn,
                post: postFn
            }
        };

        return {
            restrict: 'EAC',
            compile: compileFn
        };
    }

		var piFormClear = function()
	  {


	  };

	  var piFormSubmit = function()
	  {
	    var link = function(scope, elem, attrs, piFormCtrl)
	    {
	      var canSubmit = true;
	      var submit = function()
	      {
	        if(!canSubmit) return;
	        canSubmit = !canSubmit;
	        piFormCtrl.submit().success(function() {
	          canSubmit = true;
	        });
	      };
	      elem.bind('click', function(res) {
	        submit();
	      });
	      elem.bind('touch', function(res) {
	        submit();
	      });

	    }
	  }

	  /**
	   * @ng-doc directive
	   * Form Prevent Save
	   *
	   * Prevent a page from changing or some action that clear the form without user confirmation
	   */
	  var piFormPreventSave = function()
	  {
	    var link = function(scope, elem, attrs, piFormCtrl)
	    {
	        piFormCtrl.setPreventSave();
	    };

	    return {
	      restrict: 'A',
	      require: '^piForm',
	      link: link
	    }
	  };

		var piFormConfig = function(){
			var _applyPiClasses = true;

			return {
				setApplyPiClasses: function(value) {
					_applyPiClasses = value;
				},
				$get: function(){
					applyPiClasses: _applyPiClasses
				}
			}
		};

    angular
        .module('pi.form')
				.provider('piFormConfig', piFormConfig)
        .directive('piForm', piForm)
        .directive('piFormGroup', piFormGroup)
				.directive('piFormControl', piFormControl)
        .directive('piFormLabel', piFormLabel)
        .directive('piFormFooter', piFormFooter);

})();

(function(){
  angular
    .module('pi.form-contact')
    .provider('piFormConfiguration', [function(){
      var config = {
        toName: 'Localhost',
        toEmail: 'local@localhost',
        fromName: 'Localhost',
        fromEmail: 'local@localhost',
        subject: 'Form Contact'
      };
      return {
        $get: [function(){
          this.getToName = function(){
            return config['toName'];
          };

          this.getToEmail = function(){
            return config['toEmail'];
          };

          this.getFromName = function(){
            return config['fromName'];
          };

          this.getFromEmail = function(){
            return config['fromEmail'];
          };

          this.getSubject = function(){
            return config['subject'];
          };

          return this;
        }],
        setToName: function(value){
          config['toName'] = value;
        },
        setToEmail: function(value){
          config['toEmail'] = value
        },
        setFromName: function(value){
          config['fromName'] = value;
        },
        setFromEmail: function(value){
          config['fromEmail'] = value
        },
        setSubject: function(value){
          config['subject'] = value
        }
      }
    }])
    .directive('piFormContact', ['piMandril', 'piFormConfiguration', function(piMandril, piFormConfiguration){

        return {
            link: function(scope, elem, attrs) {
                scope.isActive = false;

                var buildFormBody = function(elems) {
                  var msg = '';
                  angular.forEach(elems, function(value, key){
                    msg = msg + '<p><b>' + value.name + '</b>: ' + value.value + '</p>';
                  });

                  return msg;
                }

                var cleanElements = function(elems){
                  angular.forEach(elems, function(value, key){
                    elems[key].value = '';
                  });
                }

                scope.submit = function(){
                    var elems = elem.find('[pi-form-control]');
                    var res = [];
                    var msg = buildFormBody(elems);

                    var toName = _.isUndefined(elem.attr('pi-form-to-name')) ? piFormConfiguration.getToEmail() : elem.attr('pi-form-to-name'),
                        toEmail = _.isUndefined(elem.attr('pi-form-to-email')) ? piFormConfiguration.getToEmail() : elem.attr('pi-form-to-email'),
                        subject = _.isUndefined(elem.attr('pi-form-subject')) ? piFormConfiguration.getSubject() : elem.attr('pi-form-subject');

                    var fromName = elem.find('[pi-form-from-name]').length > 0 ? elem.find('[pi-form-from-name]')[0].value : piFormConfiguration.getFromName(),
                        fromEmail = elem.find('[pi-form-from-email]').length > 0 ? elem.find('[pi-form-from-email]')[0].value : piFormConfiguration.getFromEmail();

                    isActive = true;
                    piMandril.send(fromEmail, fromName, toEmail, toName, subject, msg)
                      .then(function(res){
                    	   scope.formSented = true;
                         scope.isActive = false;
                         cleanElements(elems);
                    	}, function(err){
                        scope.isActive = false;
                      });
                }
            },
            controller: ['$scope', function($scope){
              this.submit = function(){
                $scope.submit();
              }
            }]
        }
    }])
    .directive('piFormSubmit', [function(){
      return {
        require: '^piFormContact',
        link: function(scope, elem, attrs, piFormContactCtrl) {
          elem.bind('click', function(){
              piFormContactCtrl.submit();
          })
        }
      }
    }]);

})();

(function(){
	var fn = function(apiException){

		var svc = function(response) {
			this.response = response;

			this.handle = function() {
				if(_.isUndefined(this.response || _.isUndefined(this.response.data))) {
					throw apiException.badRequest;
				}

				if(this.response.statusCode >= 400) {
					
				}

				this.success = true;
				return this.response.data;
			};
		};

		return {
			service: svc,
			setProvider: function(dependency) {
				svc.setHandler(dependency);
			}
		}
	};

	angular
        .module('pi')
		.constant('apiException', {
			badRequest: 502,
			notFound: 404,
			notAuthorize: 501,
			ok: 200
		})
		.factory('apiResponseProvider', ['apiException', fn]);
})();
(function(){
    angular
        .module('pi')
        .directive('piLayerHover', ['piLayer', '$timeout', 'piLayerStack', function(piLayer, $timeout, piLayerStack){

            return {
                link: function(scope, elem, attrs) {

                    var waiting = false,
                        waitingShow = false,
                        instance = null,
                        showTimer = null;

                    elem.on('mouseenter', function(){
                        waitingShow = true;

                        var topPos  = elem.offset().top;
                        var leftPos = elem.offset().left;

                        showTimer  = $timeout(function(){
                            waitingShow = false;
                            instance = piLayer.open({
                                namespace: scope.piNamespace,
                                entity: scope.piEntity,
                                top: topPos,
                                left: leftPos,
                                width: elem.width()
                            })
                        }, 700);


                    });

                    var clearFn = function(){
                        if(waitingShow) {
                            $timeout.cancel(showTimer)
                        }
                        waiting = true;
                        $timeout(function(){
                            scope.$apply(function(){
                                if(!_.isNull(instance)) {
                                    instance.close();
                                }
                            });
                        }, 3000)
                    }
                    elem.on('mouseleave', clearFn);
                    elem.on('blur', clearFn);
                },
                scope: {
                    piNamespace: '=',
                    piEntity: '='
                }
            }
        }])
        .directive('piLayerWindow', ['piLayerStack', function(piLayerStack){

            return {

                controller: function($scope){
                    $scope.visible = false;
                    $scope.current = piLayerStack.getTop();

                    $scope.closeCurrent = function(){
                        piLayerStack.dismiss($scope.current);
                        if(piLayerStack.length() > 0) {
                            $scope.current = piLayerStack.getTop();
                        } else {
                            $scope.current = null;
                            $scope.visible = false;
                        }
                    };

                    piLayerStack.onAdded(function(layer, opts){
                        currentLayer = layer;
                        if(!_.isUndefined($scope.current)) {
                            $scope.closeCurrent();
                        }

                        $scope.$apply(function(){
                            $scope.visible = true;
                            $scope.current = opts.entity;
                            $scope.top = opts.top;

                            $scope.left = opts.left - opts.width;
                        });
                    });


                }
            }
        }])
        .factory('piLayer', ['piLayerStack', '$q', function(piLayerStack, $q){
            this.open = function(opts) {
                var resultDeferred = $q.defer(),
                    openDeferred = $q.defer(),
                    instance = {
                        result: resultDeferred.promise,
                        opened: openDeferred.promise,
                        close: function(result) {
                            piLayerStack.close(instance);
                        },
                        dismiss: function(reason) {
                            piLayerStack.dismiss(instance);
                        }
                    };

                piLayerStack.open(instance, opts);

                return instance;
            };

            return this;
        }])
        .factory('piLayerStack', ['piStack', function(piStack){
            var stack = {};
            var callable;
            var layersVisibled = piStack.create();

            var open = function(instance, opts) {
                layersVisibled.add(instance, opts);
                if(!_.isUndefined(callable)){
                    callable(instance, opts);
                }

                return instance;
            }

            var close = function(instance) {
                layersVisibled.remove(instance);
            }

            var dismiss = function(instance) {
                layersVisibled.remove(instance);
            }

            var getTop = function() {
                return layersVisibled.top();
            }

            var getLength = function(){
                return layersVisibled.length();
            }

            return {
                length: getLength,
                open: open,
                onAdded: function(c) {
                    return callable = c;
                },
                length: function(){
                    return layersVisibled.length();
                },
                dismiss: dismiss,
                close: close,
                getTop: getTop
            }
        }]);
})();
(function(){
  (function(){
    angular
      .module('pi.mandril')
      .provider('piMandril', [function(){
      	var _token = '';
      	return {
      		$get: ['$q', function($q){

  				this.send =  function(from, fromName, to, toName, subject, body) {
  				      var mandrill_client = new mandrill.Mandrill(_token);

  					var promise = $q.defer(),
  						message = {
  		                  "html": body,
  		                  "text": body,
  		                  "subject": subject,
  		                  "from_email": from,
  		                  "from_name": 'Formulário',
  		                  "to": [{
  		                          "email": to,
  		                          "name": "Website",
  		                          "type": "to"
  		                      }]
  		              	};
  		              mandrill_client.messages.send({"message": message, "async": false}, function(result) {
  		                  promise.resolve(result);
  		              }, function(e) {
  		                  promise.reject(e);
  		              });

  		             return promise.promise;
      			}

      			return this;
      		}],
      		setToken: function(value){
      			_token = value;
      		}

      	}
      }]);
  })();
})();

(function(){
  var piModalStack = function(piStack)
  {
    var stack = {};
    var modalsOpened = piStack.create();

    var open = function(instance, modal)
    {
      modalsOpened.add(instance, modal);
    };

    var close = function(instance, result){
        modalsOpened.remove(instance);
    };

    var dismiss = function(instance, reason) {
      modalsOpened.remove(instance);
    };

    return {
        open: open,
        close: close,
        dismiss: dismiss
    }
  };

  piModalStack.$inject = ['piStack'];

  var piModal = function(piModalStack, $q)
  {
      this.open = function(modal)
      {
        var modalResultDeferred = $q.defer(),
            modalOpenedDeferred = $q.defer(),
            instance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                piModalStack.close(instance, result);
              },
              dismiss: function (reason) {
                piModalStack.dismiss(instance, reason);
              }
            };
        piModalStack.open(instance, modal);
      };

      return this;
  };

  piModal.$inject = ['piModalStack', '$q'];

  /**
   * Directive that handles the priority with z-index
   */
  var piModalBack = function($compile)
  {
    var ctrl = function() {

    };
    ctrl.$inject = [];

    return {
      templateUrl: 'pi/modal-back.html',
      controllerAs: 'ctrl',
      controller: ctrl
    }
  };

  var piModalWindow = function(piModalStack, $timeout) {
    var link = function(scope, elem, attrs) {
        scope.windowClass = attrs.windowClass;

        $timeout(function(){
          $scope.animate = true;
          elem[0].focus();
        });

        scope.close = function(evt) {
          var modal = $modalStack.getTop();
          if(modal && modal.value.backdrop){
            
          }
        }
    };
    return {
      restruct: 'EA',
      scope: {
        index: '@',
        animate: '='
      },
      replace: true,
      transclude: true,
      templateUrl: 'pi/modal-window.html',
      link: link
    }
  };

  piModalBack.$inject = ['$compile'];
})();

(function(){
  angular
    .module('pi.nav')
    .factory('piNavigationBuilder', [function(){
        function builder(idOrModel) {

          var self = this,
              cfg = {

              };
          if(_.isObject(idOrModel)) {
            cfg['id'] = idOrModel.id;
          } else if(_.isString(idOrModel)) {
            cfg['id'] = idOrModel;
          } else {
            cfg['id'] = 'random-id';
          }

          self.highlighted = false;
          self.hidden = true;
          self.menu = [];
          self.isChild = false;

          this.dispose = function() {
            this.hidden = true;
            self.menu = [];
          }

          this.addState = function(name, model) {
            self.menu.push({
              'name': name,
              'model': model,
              'type': 'link'
            });

          };

          this.remove = function(name) {
            for (var i = 0; i < self.menu.length; i++) {
              if(self.menu[i].name === name) {
                self.menu.splice(i, 1);
                break;
              }
            };
          };

          this.addAction = function(name, callback) {
            self.menu.push({
              'name': name,
              'callback': callback,
              'type': 'callback'
            })
          
          };

          this.hide = function() {
            if(self.hidden) {
              $log.info('The menu ' + cfg['id'] + ' is already hidden. Nothing to be done.');
              return;
            }
            self.hidden = true;
          }

          this.highlight = function() {
            if(self.highlighted) {
              $log.info('The menu ' + cfg['id'] + ' is already highlighted. Nothing to be done.');
              return;
            }
            self.highlighted = true;
          }

          this.show = function() {
            if(!self.hidden) {
              $log.info('The menu ' + cfg['id'] + ' is already visible. Nothing to be done.');
              return;
            }
            self.hidden = false;
          }

          this.id = function() {
            return cfg['id'];
          }

          return self;
        }

        return builder;
      }])
      .provider('piNavigation', [function(){

        return {
          $get: ['$rootScope','$log', 'piNavigationBuilder', 'piStack', '$log',
            function($rootScope, $log, piNavigationBuilder, piStack, $log) {
              var menus = piStack.create(),
                cfg = {
                  icons: {
                    remove: 'icon ion-android-delete',
                    save: 'icon ion-android-delete',
                    add: 'icon ion-android-delete',
                    info: 'icon ion-android-delete'  
                  }
                };

              this.setIcon = function(type, value) {
                if(_.isArray(type)) {
                  if(_.isUndefined(type['type']) || _.isUndefined(type['type'])) {
                    $log.error('Cant add ' + type);
                  }
                  for (var i = 0; i < type.length; i++) {
                    cfg.icons[type[i].type] = type[i].value;
                  };
                }
                cfg.icons[type] = value;
              }

              return {
                create: function(id) {
                  var menu = piNavigationBuilder(id);
                  menus.add(id, menu);
                  return menu;
                },
                close: function(id) {
                  menus.remove(id);
                }
              }
            }]

        }
      }])
      .directive('piNavigationTemplate', ['piNavigationProvider',
        function(piNavigationProvider) {
          return {
            scope: {
              'menu': '@'
            },
            link: function(scope, elem, attrs, ngModel) {
              scope.menu = piNavigationProvider.create();

              scope.close = function() {
                piNavigationProvider.close(scope.menu.id());
              }
            }
          }
        }
      ]);
})();
/**
 * @ng-doc service
 * @name ApiIsAuthorService
 *
 * @description
 * This service assumes an Pi based API is being used
 * An entity response from API may contain an author property
 * In such cases you can use this service to verify if a user is author of the entity
 * In the following example, we store the authenticated user id in $rootScope
 *
 * @example
 * var isAuthor = ApiIsAuthorService(response, $rootScope.userId)
 *
 */

(function(){
  "use strict";

  var ApiIsAuthorService = function()
  {
    /**
     * The response object expected may be: (in order of preference for performance)
     * - String with Id
     * - Author DTO, ie: {displayName: 'Jesus', id: 1}
     * - HTTP Response data object, ie: {code: 200, data: { author: { displayName: 'Jesus', id: 1}}}
     * - Object containing an property named author
     * @param entityId THE Id
     * @param res response object
     * @return boolean
     */
    var isAuthor = function(entityId, res){
      if(_.isNull(res)){
        return false;
      } else if(_.isString(res)){
        return entityId == res;
      }
      else if(res.id){
        return entityId == res.id;
      }
      else if(res.data && res.data.author && res.data.author.id)
      {
        return entityId == res.data.author.id;
      }
      else if(res.author && res.author.id) {
        return entityId == res.author.id;
      }

      return false;
    }

    return {
      isAuthor: isAuthor
    }

  };

  angular
    .module('pi')
    .factory('ApiIsAuthorService', ApiIsAuthorService);
})();

(function(){
	var TestService = function(ServiceBase){
		var service = new ServiceBase('TestService');

		return service;
	};

	TestService.$inject = ['ServiceBase'];

	angular
		.module('pi')
		.factory('TestService', TestService);

	var TestAppHost = function(AppHost) {
		var config = {
			'appName': 'test'
		};
		
		return new AppHost(config);
	};

	TestAppHost.$inject = ['AppHost'];

	var AppHost = function($log, ServiceBroker){

		var fn = function(configs) {

			var self = this;
			this.appName = configs.appName || 'default';
			this.mode = configs.mode || 'production';
			this.plugins = [];

			this.init = function()
			{
				var services = discoveryServices();
				self.registerService(services);
			};
			this.setConfigs = function(configs)
			{
				if(!_.isUndefined(configs['appName'])) {
					self.appName = configs.appName;
				}
				if(!_.isUndefined(configs['mode'])) {
					self.mode = configs.mode;
				}

				self.configs = configs;
			};

			this.getConfigs = function()
			{
				return self.configs;
			}

			this.registerService = function(service)
			{
				return ServiceBroker.register(service);
			};

			this.execute = function(requestType, method, requestDto)
			{
				return ServiceBroker.executeRequest(requestType, method, requestDto);
			};

			var discoveryServices = function()
			{
				return [
					{
						id: "serverId",
						endpoint: '/api/user',
						requestsTypes: [
							{
								name: 'GetUser',
								methods: ['GET'],
								roles: []
							},
							'PutUser',
							'DeleteUser'
						]
					},
					{
						id: "serverId2",
						endpoint: '/api/group'
					}
				];
			};
		};

		return fn;
	};

	AppHost.$inject = ['$log'];

	angular
		.module('pi')
		.factory('AppHost', AppHost)
		.factory('TestAppHost', TestAppHost);
})();
(function(){
	var FieldsMetaService = function()
	{
      var fn = function(defaultMeta)
      {
				metaDefault = _.isArray(defaultMeta) ? defaultMeta : [];

					var meta = [];

					var addMeta = function(value, key)
          {
            meta.push({
              value: value,
              key: key
            });
          };

					var addObj = function(obj)
					{
						meta.push(obj);
					}

          var removeMeta = function(value)
          {

          };

          return {
              add: addMeta,
							addObj: addObj,
              remove: removeMeta,
              meta: meta,
							available: metaDefault
          }
      };

      return fn;
  };

  angular
    .module('pi')
    .factory('FieldsMetaService', FieldsMetaService);
})();

(function(){
	var ServiceBase = function($resource, $q, MessageBroker) {
		var fn = function(serviceName)
		{
			this.serviceName = serviceName;
			this.requests	 = 0;
			this.currentRequest = undefined;
			this.httpBusy = false;
			this.MessageBroker = MessageBroker;
		};

		fn.prototype.update = function(first_argument) {
			// body...
		};

		fn.prototype.get = function(id) {
			
		};

		fn.prototype.remove = function(id) {
			// body...
		};

		fn.prototype.query = function() {
			// body...
		};

		return fn;
	};

	ServiceBase.$inject = ['$resource', '$q', 'MessageBroker'];

	angular
		.module('pi')
		.factory('ServiceBase', ServiceBase)
})();
(function(){

	var ServiceBroker = function($log, ServiceRunner) 
	{
		var services = [];
		/* Map the Service Request Type and the Service index
		 */
		var servicesMap = {};
		var self = this;

		this.register = function(serviceType)
		{
			var register = function(service)
			{
				var index = services.push(service);
				angular.forEach(service.requestsTypes, function(requestType, typeIndex){
					servicesMap[serviceType] = index;
				});
			}
			
			if(_.isArray(serviceType))
			{
				angular.forEach(serviceType, function(value, key) {
					register(value);
				});
			} else {
				register(serviceType);
			}
		};

		this.unregister = function(serviceType)
		{

		};

		/**
		 * Execute a request
		 * @param  {[type]} requestType [description]
		 * @param  {[type]} method      [description]
		 * @param  {[type]} requestDto  [description]
		 * @return {promise}             [description]
		 */
		this.executeRequest = function(requestType, method, requestDto)
		{
			var service = services[servicesMap[requestType]];
			var runner = new ServiceRunner(service, requestType, requestDto);
			
			return runner.execute(method);
		};

	};
	ServiceBroker.$inject = ['$log', 'ServiceRunner'];

	angular
		.module('pi')
		.factory('ServiceBroker', ServiceBroker);
})();
(function(){
	var ServiceConsumer = function($log) 
	{
		this.send = function()
		{

		};
	};
	ServiceConsumer.$inject = ['$log'];

	angular
		.module('pi')
		.factory('ServiceConsumer', ServiceConsumer)
})();
(function(){

	/**
	 * Service Request
	 */

	var PiServiceRequest = function()
	{
		var fn = function()
		{
			/**
			 * Unique identifier for the Service
			 * @type {[type]}
			 */
			this.id = undefined;
			this.externalId = undefined;
			this.attributes = []
		};

		fn.prototype.AddAttribute = function(objectOrArray) {
			if(_.isArray(objectOrArray))
			{
				this.attributes = objectOrArray;
			} 
			else if(_.isObject(objectOrArray))
			{
				this.attributes.push(objectOrArray);
			}
		};

		fn.prototype.Attributes = function() {
			return this.attributes;
		};

		return fn;
	};

	angular
		.module('pi')
		.factory('piServiceRequest)', PiServiceRequest);
})();
(function(){

	var ServiceRunner = function($http, $q){

		var fn = function(service, requestType, requestDto)
		{
			if(!_.isObject(service) || !_.isObject(requestType))
			{
				return false;
			}
			var self = this;

			this.execute = function(httpMethod)
			{
				var deferred = $q.defer(),
					success = function(response) 
					{
						deferred.resolve(res.data);
					},
					error = function(resposne)
					{
						deferred.reject(response);
					};

				$http({
					method: httpMethod,
					data: requestDto,
					url: service.endpoint
				})
				.then(success, error);

				return deferred.promise;
			};
			
		};

		return fn;
	};
	ServiceRunner.$inject = ['$http', '$q'];

	angular
		.module('pi')
		.factory('ServiceRunner', ServiceRunner);

})();
(function(){

	 var fn = function(){
	 	return {
	      createNew: function () {
	        var stack = [];

	        return {
	          add: function (key, value) {
	            stack.push({
	              key: key,
	              value: value
	            });
	          },
	          get: function (key) {
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                return stack[i];
	              }
	            }
	          },
	          keys: function() {
	            var keys = [];
	            for (var i = 0; i < stack.length; i++) {
	              keys.push(stack[i].key);
	            }
	            return keys;
	          },
	          top: function () {
	            return stack[stack.length - 1];
	          },
	          remove: function (key) {
	            var idx = -1;
	            for (var i = 0; i < stack.length; i++) {
	              if (key == stack[i].key) {
	                idx = i;
	                break;
	              }
	            }
	            return idx != -1 ? stack.splice(idx, 1)[0] : false;
	          },
	          removeTop: function () {
	            return stack.splice(stack.length - 1, 1)[0];
	          },
	          length: function () {
	            return stack.length;
	          }
	        };
	      }
	    };
	 };

	 angular
	 	.module('pi')
	 	.factory('StackedMap', fn)
})();

(function(){

	var UpdateBuilder = function($log){
		var fn = function(){
			this.current = undefined;
			this.request = {};
			var self = this;

			this.field = function(field) {
				self.current = field;
				return self;
			};

			this.set = function(value) {
				self.request[self.current] = value;
				self.current = undefined;
				$log.debug('field ' + self.current + ' set ' + value);
				return self;
			};

			this.getRequest = function(){
				return self.request;
			};
		};

		return fn;
	};

	UpdateBuilder.$inject = ['$log'];

	angular
		.module('pi')
		.factory('UpdateBuilder', UpdateBuilder);
})();

(function(){
	
	var svcFn = function($rootScope){

		var svc = function(model){
			var self = this;
			this.model = model;
			
			this.get = function(){
				return self.model;
			};

		};

		svc.prototype.build = function(skip, take) {
			
			if(_.isUndefined(this.model.skip)) {
				this.model.skip = _.isUndefined(skip) ? 0 : skip;
			}

			if(_.isUndefined(this.model.take)) {
				this.model.take = _.isUndefined(take) ? 40 : take;
			}
		};

		return svc;		
	};

	angular
		.module('pi')
		.factory('queryModelFactory', ['$rootScope', svcFn]);
})();
(function(){
	var commonUtils = function(){

		this.capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

		this.randomText =  function(counter)
		{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < counter; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
		};

		return this;
	};


	angular
		.module('pi')
		.factory('commonUtils', commonUtils);
})();

(function(){
	var pagingFn = function(){

        var svc = function(queryFnName){
            this.queryFnName = queryFnName;
            this.observerCallbacks = [];

            this.modelQuery = {
                current: 1,
                limit: 20,
                count: 0
            };

            var self = this;


            this.registerObserver = function(callback){
                self.observerCallbacks.push(callback);
            };

            this.notifyObservers = function() {
                angular.forEach(self.observerCallbacks, function(callback) {
                    callback();
                });
            };

        };

        svc.prototype.update = function(){
            this[this.queryFnName]();
        };

        svc.prototype.dataNext = function(){
            this.modelQuery.current++;
            this.bids = [];

            return this.queryFnName();

        };

        svc.prototype.dataPrevious = function(){
            this.modelQuery.current--;
            this.bids = [];

            this[this.queryFnName]();
        };

        return svc;
    };

    angular
    	.module('pi')
    	.factory('dataPagingBase', pagingFn)
})();
(function(){
	angular
		.module('pi')
		.provider('facebookMetaService', [function(){

			var _meta = {},
				_author = 'https://www.facebook.com/living.with.jesus',
				_publisher = 'https://www.facebook.com/codigo.ovh',
				_locale = 'pt_PT',
				_type = 'article',
				_siteName = 'Codigo',
				_image = '',
				_description = 'Os artigos que escrevo são daquilo que aprendo e faço, desde linguagens de programação e segurança informática a notícias e tutoriais.',
				_image = '';

			var setDefault = function() {
				_meta = {
					'og:site_name': _siteName,
					'og:type': _type,
					'og:locale': _locale,
					'og:image': _image,
					'article:author': _author,
					'article:publisher': _publisher,
					'og:description': _description,
					'description': _description
				};
			}

			setDefault();

			return {
				$get: function() {
					return {
						clean: function(){
							setDefault();
						},
						set: function(title, description, image) {
							_meta['og:locale'] = 'pt_PT';
							_meta['og:title'] = title;
							_meta['og:description'] = description;
							_meta['description'] = description;
							_meta['og:image'] = image;
						},
						meta: function(){
							return _meta;
						}
					}
				},
				setDescription: function(type) {
					_description = type;
				},
				setImage: function(image) {
					_image = image;
				},
				setAuthor: function(author){
					_author = author;
				},
				setPublisher: function(publisher) {
					_publisher = publisher;
				},
				setLocale: function(locale) {
					_locale = locale;
				},
				setType: function(type) {
					_type = type;
				},
				setSiteName: function(siteName) {
					_siteName = siteName;
				}
			}

			
		}])
		.directive('facebookMeta', [function(){
			return {
				replace: true,
				template: '<meta ng-repeat="(key, value) in $root.metas" property="{{key}}" content="{{value}}">',
				controller: ['$rootScope', '$scope', 'facebookMetaService', function($rootScope, $scope, facebookMetaService) {
					facebookMetaService.set('Codigo', 'Site de Programação', 'http://codigo.ovh/logo.png');
					$rootScope.metas = facebookMetaService.meta();
				}]
			}
		}])
})();
(function(){
    var fn = function($resource, fittingModel, piHttp) {
        return $resource(piHttp.getBaseUrl() + '/feed/' + fittingModel.userId,
            {},
            {
                'query': {
                    method: 'GET',
                    transformResponse: function(res) {
                        return angular.fromJson(res).feeds || [];
                    },
                    isArray: true
                }
            });
    };

    fn.$inject = ['$resource', 'fittingModel', 'piHttp'];

    angular
        .module('pi')
        .factory('FeedResource', fn);
})();

(function(){

	angular
		.module('pi.adsense')
		.run(['$rootScope', '$window', function($rootScope, $window){

			$rootScope.$on('$locationChangeStart', function () {
              Object.keys($window).filter(function(k) { return k.indexOf('google') >= 0 }).forEach(
                function(key) {
                  delete($window[key]);
                }
              );
            });

		}])
		.provider('googleAdSenseService', [function(){
	      
	      var self = this;
	      self.format = 'auto';

	      return {
	        $get: function() {

	          this.getClient = function(){
	            return self.client;
	          };

	          this.getSlot = function(){
	            return self.slot;
	          };

	          this.getFormat = function(){
	            return self.format;
	          };

	          return this;
	        },
	        setClient: function(value){
	          self.client = value;
	        },
	        setSlot: function(value){
	          self.slot = value;
	        },
	        setFormat: function(value){
	          self.format = value;
	        }
	      };

	    }])
	    .directive('googleAdSense', ['googleAdSenseService', function (googleAdSenseService) {
	        
	        return {
	            restrict: 'A',
	            replace: true,       
	            template: '<ins class="adsbygoogle" style="display:block" data-ad-client="{{client}}" data-ad-slot="{{slot}}" data-ad-format="{{format}}"></ins>',
	            controller: ['$scope', 'googleAdSenseService', function($scope, googleAdSenseService){
	              $scope.client = googleAdSenseService.getClient();
	              $scope.slot = googleAdSenseService.getSlot();
	              $scope.format = googleAdSenseService.getFormat();
	              (adsbygoogle = window.adsbygoogle || []).push({});
	            }]
	        };

	    }]);
})();
(function() {
    var svcFn = function($modal, $q) {

        var modalSvc = {};

        modalSvc.configuration = {
            internalErrorTitle: 'Erro Interno',
            internalErrorContent: 'Ocorreu um erro interno na nossa Plataforma que foi registado. Pedimos desculpa pelo incómodo.'
        };

        this.$get = function(){

            return modalSvc;
        };

        modalSvc.success = function(title, message) {
            addModal(title, message);
        };

        modalSvc.internalError = function(response) {
            addModal(modalSvc.configuration.internalErrorTitle, modalSvc.configuration.internalErrorContent);
        };

        var addModal = function(title, message, errors, statusCode) {
            var deferred = $q.defer();
            var instance = $modal.open({
                templateUrl: 'modalDisplay.html',
                controller: 'modalDisplayCtrl',
                resolve: {
                    modalObj: function() {
                        var res =  {
                            title: title,
                            body: message,
                            errors: _.isArray(errors) && errors.length > 0 ? errors : []
                        };
                        if(!_.isUndefined(statusCode)) {
                            res.sucess = statusCode < 300;
                            res.warning = statusCode >= 300 && statusCode < 400;
                            res.error = statusCode >= 400 && statusCode < 600;
                        } else if(res.errors.length > 0) {
                            res.sucess = false;
                            res.warning = false;
                            res.error = true;
                        } else {
                            res.sucess = true;
                            res.warning = false;
                            res.error = false;
                        }
                        return res;
                    }
                }
            });

            instance.result.then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });

            return deferred.promise;
        };

        var confirmModal = function(title, content, btnConfirm, btnDismiss) {
            var deferred = $q.defer();

            var instance = $modal.open({
                templateUrl: 'modalConfirm.html',
                controller: 'modalConfirmCtrl',
                resolve: {
                    model: function(){
                        return {
                            title: title,
                            content: content,
                            btnDismiss: _.isUndefined(btnDismiss) ? 'Cancelar' : btnDismiss,
                            btnConfirm: _.isUndefined(btnConfirm) ? 'Ok' : btnConfirm
                        }
                    }
                }
            });

            instance.result.then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });

            return deferred.promise;
        };
        /**
         * Modal Confirmation
         *
         * @return $q promise to handle the user behaviour: ok or cancel
         */
        modalSvc.confirm = confirmModal;

        modalSvc.display = function(res) {
            var response = _.isUndefined(res.data) ? res : res.data;
            var title = '';
            switch (response.statusCode) {
                case 400:
                    title = 'Erro de validação';
                    break;
                case 500:
                    title = 'Erro interno';
                    break;
            }
            var errors = _.isArray(response.validationErrors) ?
                    response.validationErrors :
                        !_.isUndefined(response.errors)  && _.isArray(response.errors) ? response.errors : [];
            var message = !_.isEmpty(response.errorDescription) ?
                    response.errorDescription :
                !_.isEmpty(response.errorMessage) ? response.errorMessage :
                !_.isEmpty(response.message) ? response.message :
                '';

            return addModal(title, message, errors, response.statusCode);
        };

        return modalSvc;
    };

    var confirmCtrl = function($scope, $modalInstance, model, $sce) {
        $scope.title = model.title;
        $scope.content = model.content;
        $scope.btnConfirm = model.btnConfirm;
        $scope.btnDismiss = model.btnDismiss;

        $scope.submit = function(){
             $modalInstance.close();

        };

        $scope.cancel = function(){
           $modalInstance.dismiss();
        };
    };

    var displayCtrl = function($scope, $modalInstance, modalObj, $sce) {
        $scope.title = modalObj.title;
        $scope.instance = $modalInstance;
        var body = !_.isEmpty(modalObj.body) ? modalObj.body :
            modalObj.errors.length > 0 ? null : 'Pedimos desculpa, ocorreu um erro interno.';

        $scope.status = {
            warning: modalObj.warning,
            error: modalObj.error,
            success: modalObj.success
        };

        $scope.body = $sce.trustAsHtml(body);
        $scope.errors = modalObj.errors;

        $scope.ok = function() {
            $modalInstance.close();
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');

        };
    };

    angular
        .module('pi')
        .service('piModal', ['$modal', '$q', svcFn])
        .controller('modalConfirmCtrl', ['$scope', '$modalInstance', 'model', '$sce', confirmCtrl])
        .controller('modalDisplayCtrl', ['$scope', '$modalInstance', 'modalObj', '$sce', displayCtrl]);
})();
(function(){
	'use strict';

	/**
	 * @ng-doc service
	 * @name piHttp
	 *
	 * This service is a wrapper for angular $http service
	 * http://stackoverflow.com/questions/23968129/limiting-http-interceptor-to-specific-domain
	 */
	 angular
	 	.module('pi')
		.provider('piHttp', [
			function () {
				var formatUrl = function(url) {
					return self.baseUrl + url;
				};
				var self = this;
				this.persist = false;

				return  {
					$get: function($http, pi) {

						var s = this;

						// Augments the request configuration object
						// with OAuth specific stuff (e.g. some header)
						function getAugmentedConfig(cfg) {
							var config  = cfg || {};
							config.headers = config.headers || {};
							if(!_.isUndefined(pi.getAppId())) {
								config.headers['X-Pi-Application'] = pi.getAppId();
							}
							//config.headers.someHeaderName = 'some-header-value';
							return config;
						}

						// The service object to be returned (`$http` wrapper)


						// Create wrappers for methods WITHOUT data
						['delete', 'get', 'head', 'jsonp'].forEach(function (method) {
							s[method] = function (url, config) {
							    var config = getAugmentedConfig(config);
							    return $http[method](formatUrl(url), config);
							};
						});

						// Create wrappers for methods WITH data
						['post', 'put'].forEach(function (method) {
							s[method] = function (url, data, config) {
							    var config = getAugmentedConfig(config);
							    return $http[method](formatUrl(url), data, config);
							};
						});

						this.getBaseUrl = function() {
							return self.baseUrl;
						}

						this.isPersist = function() {
							return self.persist;
						}


						function insertQuery(tblName, columns, data) {
							if(!_.isArray(columns) || columns.length === 0) 
								return null;

							var query = 'INSERT INTO ' + tblName + ' (';

							for (var i = 0; i < columns.length; i++) {
								query = query + (i === 0)
									? columns[i] // first column, no comma
									: ',' + columns[i];
							};
							query = query + ') VALUES(';

							for (var i = 0; i < columns.length; i++) {
								for(var j = 0; j < data.length; j++) {
									if(!_.isUndefined(data[columns[i]]) &&
										!_.isUndefined(data[columns[i]['name']]) &&
										!_.isString(data[columns[i]['name']])) {
										
									}
								}
								query = query + (i === 0)
									? '?'
									: ',?';
							};
							query = query + ');';

							return query;
						};

						this.persist = function(schema, data) {
							var query = insertQuery(sch)
						}

						return this;
					},
					baseUrl: '',
					token: null,
					setBaseUrl: function(url) {
						self.baseUrl = url;
					},
					setAuth: function(token) {
						self.token = token;
					},
					setPersist: function(persist) {
						self.persist = persist;
					}
				};
			}
		]);
})();

(function(){
  "use strict";

  var piPromptConfirmationStack = function(piStack) {
    var stack = piStack.create();

    var open = function(instance, prompt)
    {
      stack.add(instance, prompt);
    };

    var confirm = function(instance, result)
    {
      stack.remove(instance);
    };

    var dismiss = function(instance, reason)
    {
      stack.remove(instance);
    };

  };

  piPromptConfirmationStack.$inject = ['piStack'];

  /**
   * @ng-doc service
   * @name Prompt Confirmation
   * @description
   * This service allow you to prompt user before commiting an action
   * @todo
   * - implement a provider for prompt modal, alert, etc
   */
  var promtConfirmation = function(piPromptConfirmationStack)
  {
    this.prompt = function(messageOrObject) {
      var config;
      if(_.isObject(messageOrObject)) {
          config = angular.copy(messageOrObject);
      } else {
        config = {
          message: _.isString(messageOrObject) ? messageOrObject : 'Tens a certeza que pretendes continuar?'
        }
      }

      var resultDeferred = $q.defer(),
          openedDeferred = $q.defer(),
          instance = {
            result: resultDeferred,
            opened: openedDeferred,
            dismiss: function() {
              piPromptConfirmationStack.dismiss(instance);
            }
          };

      piPromptConfirmationStack.open(instance, config);
      
    };

    return this;
  };

  promtConfirmation.$inject = ['piPromptConfirmationStack'];

  angular
    .module('pi')
    .factory('piPromptConfirmation', promtConfirmation)
    .factory('piPromptConfirmationStack', piPromptConfirmationStack);
    
})();

(function(){
  var piStack = function() {

    return {
      create: function(){
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          addAll: function(arr) {
            stack = stack.concat(arr);
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    }
  };
  piStack.$inject = [];

  angular
    .module('pi')
    .factory('piStack', piStack);
})();

(function(){
	
	var registerFactory = function($http, $q){

		this.register = function(registerModel) {
			var model = registerModel;
				deferred = $q.defer(),
				successFn = function(res) {
					deferred.resolve(res.data);
				},
				errorFn = function(res) {
					deferred.reject(res);
				},
				httpObj = {
					method: 'POST',
					url: '/api/register',
					data: model
				};

			$http(httpObj)
				.then(successFn, errorFn);

			return deferred.promise;
		};
	};

	angular	
		.module('pi')
		.service('piRegisterService', registerFactory);
})();
/**
 * @author Gui <guilhermecardoso@volupio.com>
 * @ng-doc service
 * @name SEO Validator
 *
 * @description
 * Helper class to validate SEO
 * Functions started with "validate" will be used agains validateObject() with common properties array
 */
 var seoValidationResult = {
 	message: '',
 	error: false
 };

(function(){
	var SeoValidator = function(commonUtils, $log){
		var self = this,
			commonProperties = ['title', 'content', 'url', 'excerpt'];

    var createError = function(property, message)
    {
      return {
        key: property,
        value: message
      };

    };

    var validators = {
        validateTitle: function(title) {
    			if(title.length < 10 || title.length > 70) {
            return createError('title', 'Title length should be between 30 and 70');
    			}
          return true;
    		},
        validateContent: function(content) {

          if(content.length < 30 || content.length > 70) {
            return createError('content', 'Title length should be between 30 and 70');
          }
          return true;
    		},
        validateExcerpt: function(excerpt){
          if(excerpt.length < 10 || excerpt.length > 50) {
            return createError('excerpt', 'Title length should be between 30 and 70');
          }
          return true;
    		},
        validateUrl: function(url){
          if(url.length < 10 || url.length > 70) {
            return createError('url', 'Title length should be between 30 and 70');
          }
          return true;
    		}
    };
    this.validateTitle = validators.validateTitle;
    this.validateContext = validators.validateContent;
    this.validateExcerpt = validators.validateExcerpts;
    this.validateUrl = validators.validateUrl;
		/*
		 * Runs all the validation functions of the service agains the object
		 * The existence of the properties is checked, and the object must have the regular properties: title, content, url, etc
		 */
		this.validateObject = function(obj) {
			var results = [];

      angular.forEach(commonProperties, function(prop, key) {
				if(prop in obj) {
					/*var fnName = String('validate' + commonUtils.capitalizeFirstLetter(prop)),
            obj[prop],
            validators[fnName](val);

          if(!_.isUndefined(res) && res === 'true');
          {
            results.push(res);
          }*/
				}
			});

      if(results.length >= 0)
      {
        return {
          error: true,
          validation: results
        }
      }

      return true;
		};

    return this;
	};

  SeoValidator.$inject = ['commonUtils', '$log'];

	angular
		.module('pi')
		.factory('SeoValidator', SeoValidator);
})();

(function(){
	/**
	 * @ng-doc overview
	 * @name pi template editor
	 * 
	 * @description
	 * template editor for pi based apps
	 * the editor store dom with angular directives in jsonml
	 */

	 var svcFn = function(){

	 	/**
	 	 * @param bodyJson the jsonml retrieved from database
	 	 */
	 	var main = function(bodyJson) {
	 		this.toolBar = {
	 			items: [],
	 			version: '0.0.1'
	 		};
	 	}

	 };


	 var directive = function($compile){
	 	var compileFn = function(element, attributes) {
	 		var preFn = function(scope, element, attributes, controller) {

	 				},
	 				postFn = function(scope, iElement, attributes, controller) {
	 					$compile(iElement)(scope);
	 				};

	 		return {
	 			pre: preFn,
	 			post: postFn
	 		}
	 	}
 		return {
 			compile: compileFn
 		}
	 };
})();
(function(){
	
	var configFn = function($provide) {

		// use $state.forceReload() to reload the current state
		// delegate cames from SO http://stackoverflow.com/questions/21714655/angular-js-angular-ui-router-reloading-current-state-refresh-data
		$provide.decorator('$state', function($delegate, $stateParams) {
	        $delegate.forceReload = function() {
	            return $delegate.go($delegate.current, $stateParams, {
	                reload: true,
	                inherit: false,
	                notify: true
	            });
	        };
	        return $delegate;
	    });
	};
	angular
		.module('pi.ui-extensions')
		.config(['$provide', configFn]);
})();
(function(){

	var svc = function($state, $rootScope, $window) {

	  var history = [];

	  angular.extend(this, {
	    push: function(state, params) {
	      history.push({ state: state, params: params });
	    },
	    all: function() {
	      return history;
	    },
	    go: function(step) {
	      // TODO:
	      // (1) Determine # of states in stack with URLs, attempt to
	      //    shell out to $window.history when possible
	      // (2) Attempt to figure out some algorthim for reversing that,
	      //     so you can also go forward

	      var prev = this.previous(step || -1);
	      return $state.go(prev.state, prev.params);
	    },
	    previous: function(step) {
	      return history[history.length - Math.abs(step || 1)];
	    },
	    back: function() {
	      return this.go(-1);
	    }
	  });

	};

	svc.$inject = ['$state', '$rootScope', '$window'];

	var directiveFn = function($history){
		
		var linkFn = function(scope, elem, attrs) {
			elem.on('click', function(){
				$history.back();
			});
		};

		return {
			link: linkFn,
			restrict: 'A'
		}
	};

	directiveFn.$inject = ['$history'];

	angular
		.module('pi.ui-extensions')
		.directive('piUiBack', directiveFn)
		.service('$history', svc);
})();
(function(){

	var runFn = function($rootScope, $history, $state) {
	
		$rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
			if (!from.abstract) {
				$history.push(from, fromParams);
			}
	  	});

	  	$history.push($state.current, $state.params);
	};

	runFn.$inject = ['$rootScope', '$history', '$state'];

	angular
		.module('pi.ui-extensions')
		.run(runFn)
})();
(function(){
	'use strict';

	angular
		.module('pi.core.app')
		.factory('pi.core.app.appSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/application', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/application/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/application', {params: model});
			}

			this.put = function(id, model){
				return piHttp.post('/application/' + id, model);
			}

			return this;
		}]);

})();
(function(){
	angular
		.module('pi.core.article')
		.factory('pi.core.article.articleCategorySvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/article-category', model);
			}

			this.remove = function(id){
				return piHttp.post('/article-category-remove/' + id);
			}

			this.get = function(id, model) {
				return piHttp.get('/article-category/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/article-category', {params: model});
			};

			this.put = function(id, model) {
				return piHttp.post('/article-serie/' + id, model);
			};

			return this;
		}]);
})();

(function(){
	angular
		.module('pi.core.article')
		.factory('pi.core.article.articleSerieSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/article-serie', model);
			}

			this.remove = function(id) {
				return piHttp.post('/article-serie-remove/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/article-serie/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/article-serie/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/article-serie', {params: model});
			};
			return this;
		}]);
})();

(function(){
	angular
		.module('pi.core.article')
		.factory('$piArticleStateEnum', function(){
			return {
				Draft: 1,
				Published: 2,
				Censored: 3,
				Removed: 99
			};
		});
})();
(function(){
	angular
		.module('pi.core.article')
		.factory('pi.core.article.articleSvc', ['piHttp', '$log', function(piHttp, $log){

			var self = this;

			this.schema = [
			{
				name: 'id',
				type: 'objectId',
				required: true
			},
			{
				name: 'name',
				type: 'shortString',
				required: true
			},
			{
				name: 'headline',
				type: 'shortString',
				required: false
			},
			{
				name: 'articleBody',
				type: 'string',
				required: true
			},
			{
				name: 'keywords',
				type: 'string',
				required: false
			},
			{
				name: 'datePublished',
				type: 'string',
				required: false
			},
			{
				name: 'dateCreated',
				type: 'string',
				required: false
			},
			{
				name: 'image',
				type: 'string',
				required: false
			},
			{
				name: 'categoryPath',
				type: 'string',
				required: false
			},
			{
				name: 'category',
				type: 'string',
				required: false
			},
			{
				name: 'viewsCounter',
				type: 'int',
				required: false
			},
			{
				name: 'state',
				type: 'int',
				required: true
			},
			{
				name: 'author',
				type: 'string',
				required: false
			},
			{
				name: 'refferName',
				type: 'string',
				required: false
			},
			{
				name: 'refferUrl',
				type: 'string',
				required: false
			},
			{
				name: 'refferImage',
				type: 'string',
				required: false
			}];


			this.post = function(model){
				return piHttp.post('/article', model);
			}

			this.postPublisheDate = function(id, date){
				return piHttp.post('/article-publish/' + id, {
					id: id,
					date: date
				});
			}

			this.postCategory = function(id, catId){
				return piHttp.post('/article-save-category/' + id, {
					id: id,
					categoryId: catId
				});
			}

			this.postState = function(id, state){
				return piHttp.post('/article-state/' + id, {
					id: id,
					state: state
				});
			}

			this.postKeywords = function(id, keywords) {
				return piHttp.post('/article-keywords/' + id, {
					id: id,
					keywords: _.isArray(keywords) ? keywords : [keywords]
				});	
			}

			this.removeKeywords = function(id, keywords) {
				return piHttp.delete('/article-keywords/' + id, {
					id: id,
					keywords: _.isArray(keywords) ? keywords : [keywords]
				});	
			}

			this.postReffer = function(id, name, url, image){
				return piHttp.post('/article-reffer/' + id, {
					refferName: name,
					refferImage: image,
					refferUrl: url
				});
			}

			this.removeReffer = function(id, name, url, image){
				return piHttp.delete('/article-reffer/' + id);
			}

			this.remove = function(id) {
				return piHttp.post('/article-remove/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/article/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/article/' + id, model);
			}
			
			this.config = {};

			this.reset = function() {
				self.config = {
					lc: 'pt_PT',
					sortOrder: null,
					sortBy: null,
					size: 10
				};
			}

			this.withLanguage = function(lc) {
				self.config.lc = lc;
			}

			this.sortOrder = function(sort){
				self.config.sortOrder = sort;
			}

			this.sortBy = function(sort){
				self.config.sortBy = sort;
			}

			this.size = function(size){
				self.config.size = size;
			}

			this.find = function(model) {
				var promise = piHttp.get('/article', {params: model});
				self.reset();
				promise.then(function(res) {
					if(piHttp.isPersist()) {
						piHttp.persist(self.schema, res.data.articles);
					}
				});
				return promise;
			};
			return this;
		}]);
})();

(function(){

	angular
		.module('pi.core.chat')
		.factory('pi.core.chat.inboxSvc', ['piHttp', '$rootScope', function(piHttp, $rootScope){

			this.post = function(model){
				return piHttp.post('/inbox', model);
			}

			this.get = function(id) {
				var model = {};
				model.fromId = id;
				model.toId = $rootScope.userId;
				return piHttp.post('/inbox-view', model);
			}

			return this;
		}]);
})();
(function(){
	
	angular
		.module('pi.core.app')
		.factory('pi.core.app.eventAttendSvc', ['piHttp', function(piHttp){
			
			this.post = function(model) {
				return piHttp.post('/event-attend', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/event-attend/' + id);
			}

			this.find = function(model) {
				return piHttp.get('/event-attend', model);
			}

			return this;
		}]);
})();
(function(){
	angular
		.module('pi.core.app')
		.factory('pi.core.app.eventCategorySvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/event-category', model);
			}

			this.remove = function(id){
				return piHttp.post('/event-category-remove/' + id);
			}

			this.get = function(id, model) {
				return piHttp.get('/event-category/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/event-category', {params: model});
			};

			this.put = function(id, model) {
				return piHttp.post('/event-serie/' + id, model);
			};

			return this;
		}]);
})();

(function(){
	angular
		.module('pi.core.app')
		.factory('$piEventStateEnum', function(){
			return {
				Draft: 1,
				Published: 2,
				Censored: 3,
				Removed: 99
			};
		});
})();
(function(){
	angular
		.module('pi.core.app')
		.factory('pi.core.app.eventSubSvc', ['piHttp', function(piHttp){
			
			this.post = function(model) {
				return piHttp.post('/event-subscription', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/event-subscription/' + id);
			}

			this.find = function(model) {
				return piHttp.get('/event-subscription', model);
			}

			this.remove = function(id) {
				return piHttp.post('/event-subscription-remove/' + id);
			};

			return this;
		}]);
	})();
(function(){
	'use strict';

	angular
		.module('pi.core.app')
		.factory('pi.core.app.eventSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/event', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/event/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/event', {params: model});
			};

			this.remove = function(id) {
				return piHttp.post('/event-remove/' + id);
			};

			this.put = function(id, model) {
				return piHttp.post('/event/' + id, model);
			};

			this.postPublisheDate = function(id, date){
				return piHttp.post('/event-publish/' + id, {
					id: id,
					date: date
				});
			}

			this.postCategory = function(id, catId){
				return piHttp.post('/event-save-category/' + id, {
					id: id,
					categoryId: catId
				});
			}

			this.postState = function(id, state){
				return piHttp.post('/event-state/' + id, {
					id: id,
					state: state
				});
			}

			this.postKeywords = function(id, keywords) {
				return piHttp.post('/event-keywords/' + id, {
					id: id,
					keywords: _.isArray(keywords) ? keywords : [keywords]
				});	
			}

			this.removeKeywords = function(id, keywords) {
				return piHttp.delete('/event-keywords/' + id, {
					id: id,
					keywords: _.isArray(keywords) ? keywords : [keywords]
				});	
			}

			return this;
		}]);
})();
(function(){
    angular
        .module('pi.core.likes')
        .directive('piLikes', [function(){

            var ctrl = function(likesSvc, $scope) {
                var self = this,
                    loaded = false;

                $scope.$watch('entityId', function(current) {
                    if(!current) return;
                    self.entityId = current;
                    if(!loaded) {
                        self.get();
                        loaded = true;
                    }
                });

                $scope.$watch('entityNamespace', function(current) {
                    if(!current) return;
                    self.entityNamespace = current;
                });

                this.get = function() {
                    likesSvc.get(self.entityNamespace, self.entityId)
                        .then(function (res) {
                            self.users = res.data.likes;
                        });
                };


                this.like = function(){
                    likesSvc.like(self.entityNamespace, self.entityId);
                }
            }


            return {
                templateUrl: 'html/pi/likes.tpl.html',
                controller: ['pi.core.likes.likesSvc', '$scope', ctrl],
                controllerAs: 'ctrl',
                scope: {
                    entityId: '=',
                    entityNamespace: '='
                }
            }
        }]);
})();
(function(){
	angular
		.module('pi.core.likes')
		.factory('pi.core.likes.likesSvc', ['piHttp', function(piHttp){

            this.get = function(namespace, id) {
                return piHttp.get('/like/' + namespace + '/' + id);
            };

            this.hasLiked = function(namespace, id) {

            }

            this.like = function(namespace, id) {
                return piHttp.post('/like/' + namespace + '/' + id);
            }

            return this;

        }]);
})();
(function(){
	'use strict';

	angular
		.module('pi.core.app')
		.factory('pi.core.payment.paymentSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/payment/report', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/payment/report/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/payment/report', model);
			};

			return this;
		}]);
})();
(function(){
	angular
		.module('pi.core.payment')
		.factory('pi.core.payment.paymentMethod', [function(){
			var svc = [
				{ byBankTransferInAdvance: 1 },
				{ byInvoice: 2 },
				{ cash: 3 },
				{ checkInAdvance: 4 },
				{ cod: 5 },
				{ directDebit: 6 },
				{ googleCheckout: 7 },
				{ payPal: 8 },
				{ paySwarm: 9 }
			];
			return svc;
		}]);
})();
(function(){
	
	angular
		.module('pi.core.product')
		.directive('piPriceSpecifications', ['$log', function($log){
			return {

				link: function(scope, elem, attrs, ngModel) {
					scope.view = 'home';
					var modelDefault = {
							eligibleQuantity: null,
							eligibleTransactionVolume: null,
							minPrice: null,
							maxPrice: null,
							price: null,
							priceCurreny: 'EURO',
							validFrom: null,
							validThrough: null,
							valueAddedTaxIncluded: null
						};

					scope.model = {};
					scope.items = [];
			
					scope.setPrice = function() {
						var value = ngModel.$viewValue;
						value.push(scope.model);
						ngModel.$setViewValue(value);	
						scope.items.push(scope.model);

						scope.model = angular.copy(modelDefault);
						scope.view = 'home';
					}

					scope.edit = function(index) {
						scope.editIndex = index;
						scope.editModel = scope.items[index];
						scope.view = 'edit';
					}

					scope.save = function() {
						ngModel.$viewValue[scope.editIndex] = scope.editModel;
						scope.items[scope.editIndex] = scope.editModel;

						scope.view = 'home';
					}

					attrs.$observe('ngModel', function(value){
			        	scope.$watch(value, function(newValue){ 
			        			try {
			        				ngModel.$setViewValue(_.isObject(ngModel.$viewValue) ? ngModel.$viewValue : [modelDefault]);	
			        			} catch(err) {
			        				$log.info('piPriceSpecification couldnt set the ngModel, the default is used. Error: ' + err);
			        				ngModel.$setViewValue([modelDefault]);
			        			}
			                    
			            });
			        });

			        scope.model = angular.copy(modelDefault);
				},
				scope: {
					'piPriceSpecifications': '@'
				},
				require: '^ngModel',
				templateUrl: 'html/pi/price-specification.tpl.html'
			}
		}]);
})();
(function(){
	angular
		.module('pi.core.place')
		.factory('pi.core.place.placeCategorySvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/place-category', model);
			}

			this.remove = function(id){
				return piHttp.post('/place-category-remove/' + id);
			}

			this.get = function(id, model) {
				return piHttp.get('/place-category/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/place-category', {params: model});
			};

			this.put = function(id, model) {
				return piHttp.post('/place-serie/' + id, model);
			};

			return this;
		}]);
})();

(function(){
	'use strict';

	angular
		.module('pi.core.place')
		.factory('pi.core.place.placeSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/place', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/place/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/place', {params: model});
			};

			this.remove = function(id) {
				return piHttp.post('/place-remove/' + id);
			};

			this.put = function(id, model) {
				return piHttp.post('/place/' + id, model);
			};

			return this;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.businessEntity', [function(){
			var svc = [
				{ key: 'Business', value: 1 },
				{ key: 'Enduser', value: 2 },
				{ key: 'PublicInstitution', value: 3 },
				{ key: 'Reseller', value: 4 }
			];
			return svc;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.businessFunction', [function(){
			var svc = [
				{ key: 'ConstructionInstallation', value: 1 },
				{ key: 'Dispose', value: 2 },
				{ key: 'LeaseOut', value: 3 },
				{ key: 'Maintain', value: 4 },
				{ key: 'ProvideService', value: 5 },
				{ key: 'Repair', value: 6 },
				{ key: 'Sell', value: 7 },
				{ key: 'Buy', value: 8 }
			];
			return svc;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.deliveryMethod', [function(){
			var svc = [
				{ key: 'Direct Download', value: 1 },
				{ key: 'Freight', value: 2 },
				{ key: 'Mail', value: 3 },
				{ key: 'Own Fleet', value: 4 },
				{ key: 'PickUp Mode', value: 5 },
				{ key: 'DHL', value: 6 },
				{ key: 'Federal Express', value: 7 },
				{ key: 'UPS', value: 8 }
			];
			return svc;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.itemCondition', [function(){
			var svc = [
				{ key: 'Discontinued', value: 1 },
				{ key: 'InStock', value: 2 },
				{ key: 'InStoreOnly', value: 3 },
				{ key: 'LimitedAvailability', value: 4 },
				{ key: 'OnlineOnly', value: 5 },
				{ key: 'PutOfStock', value: 6 },
				{ key: 'PreOrder', value: 7 },
				{ key: 'SoldOut', value: 8 }
			];
			return svc;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.offerStatus', [function(){
			var svc = [
				{ damagedCondition: 1 },
				{ newCondition: 2 },
				{ refurbishedCondition: 3 },
				{ usedCondition: 4 }
			];
			return svc;
		}]);
})();
(function(){
	angular
		.module('pi.core.product')
		.factory('pi.core.product.productSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/product', model);
			}

			this.get = function(id, model) {
				return piHttp.get('/product/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/product', {params: model});
			};

			this.postOffer = function(productId, model) {
				return piHttp.post('/product-offer/' + productId, model);
			}

			return this;
		}]);
})();
(function(){
	angular
		.module('pi.core.question')
		.factory('pi.core.question.questionCategorySvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/question-category', model);
			}

			this.remove = function(id){
				return piHttp.post('/question-category-remove/' + id);
			}

			this.get = function(id, model) {
				return piHttp.get('/question-category/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/question-category', {params: model});
			};
			return this;
		}]);
})();

(function(){
	angular
		.module('pi.core.question')
		.factory('pi.core.question.questionSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/question', model);
			}

			this.remove = function(id) {
				return piHttp.post('/question-remove/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/question/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/question/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/question', {params: model});
			};
			return this;
		}]);
})();

(function(){
	angular
		.module('pi.core.user')
		.factory('pi.core.user.userSvc', ['piHttp', function(piHttp){

			this.post = function(model){
				return piHttp.post('/user', model);
			}

			this.remove = function(id) {
				return piHttp.post('/user-remove/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/user/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/user/' + id, model);
			}

			this.find = function(model) {
				return piHttp.get('/user', {params: model});
			};
			return this;
		}]);
})();

/*
window.sqlitePlugin = {};
window.sqlitePlugin.openDatabase = function() {
	return window.openDatabase('pi', '1.0', 'pidb', 10000000);
}

(function(){
	
	angular
		.module('pi.ionic.article')
		.factory('pi.ionic.db', ['$log', function($log) {

			this.processQueries = function(db, queries, dbName) {
				db.transaction(function(tx) {
					for (var i = 0; i < queries.length; i++) {
						tx.executeSql(queries[i], [], 
							function() {
								$log.debug(queries.length + ' queries processed.');
							}, function(tx, err) {
								$log.debug('failed to process queries');
							});
					};
				})
			}

			return this;
		}])
		.factory('pi.ionic.article.articleSvc', ['piHttp', '$ionicPlatform', '$cordovaSQLite', function(piHttp, $ionicPlatform, $cordovaSQLite){

			var db;

			window.document.addEventListener('deviceready', function(){
				db = $cordovaSQLite.openDB({
					name: 'pi',
					bgType: 1
				});
			}, false);


			this.post = function(id, name, headline, articleBody, dateCreated, datePublished, state){
				var query = 'INSERT INTO article (id, name, headline, articleBody, dateCreated, datePublished, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
					args = [id, name, headline, articleBody, dateCreated, datePublished, state],
					promise = $cordovaSQLite.execute(db, query, args)
						.then(function(res){
							return res;
						});
				
				return promise;
			}

			this.remove = function(id) {
				return piHttp.post('/article-remove/' + id);
			}

			this.put = function(id, model) {
				return piHttp.post('/article/' + id, model);
			}

			this.get = function(id, model) {
				return piHttp.get('/article/' + id, model);
			}

			this.find = function(model) {
				var query = 'SELECT * FROM article',
					promise = $cordovaSQLite.execute(db, query, [])
						.then(function(res){
							return res.rows;
						});

				return promise;
			};
			return this;
		}]);
})();

*/
(function(){
	
	var apiFn = function(){
		this.get = function(articleId) {
			var httpObj = {
				method: 'GET',
				url: '/api/blog/article/' + articleId
			};

			return $http(httpObj);
		};

		this.post = function(blogId, model) {
			model.blogId = blogId;

			var httpObj = {
				method: 'POST',
				url: '/api/blog/article',
				data: model
			};

			return $http(httpObj);
		};

		this.put = function(articleId, model) {
			var httpObj = {
				method: 'POST',
				url: '/api/blog/article/:id',
				data: model
			};

			return $http(httpObj);
		};

		this.remove = function(articleId) {
			var httpObj = {
				method: 'DELETE',
				url: '/api/blog/article/' + articleId
			};

			return $http(httpObj);
		};
	};

	var blogArticleResource = function($resource) {
		return $resource('/api/blog/article/:id');
	};
	blogArticleResource.$inject = ['$resource'];

	angular
		.module('pi')
		.factory('blogArticleResource', blogArticleResource)
		.service('blogArticleApi', ['$rootScope', '$q', '$http', apiFn]);

})();
/**
 * @ng-doc service
 * @name blogArticleCreateService
 *
 * @description
 * Create a new Article
 *
 * @dependencies blogApi
 */
(function(){
	
	var createService = function(blogApi){

		var fn = function(blogId) {
			this.blogId = blogId;
			this.model = {};
		};

		/*
		 * Title is validated agains the API to check titles already in use
		 */
		fn.prototype.slugIsValid = function(){
			if(blogApi.validateSlugTitle(this.model.title) == false) {

			};
		};

		fn.prototype.validateSeo = function(){

		};

		fn.prototype.create = function(){
			return blogApi.createArticle(this.model);
		};

		return fn;
	};

	createService.$inject = ['blogApi'];

	angular
		.module('pi')
		.factory('articleCreateService', createService);

})();
(function(){
	var apiFn = function($rootScope, $http, $q){
		this.get = function(id){
			var httpObj = {
				method: 'GET',
				url: '/api/blog/' + id
			};

			return $http(httpObj);
		};

		this.post = function(model) {
			var httpObj = {
				method: 'POST',
				url: '/api/blog',
				data: model
			};

			return $http(httpObj);
		};

		this.put = function(blogId, model) {
			var httpObj = {
				method: 'POST',
				url: '/api/blog/' + blogId,
				datA: datA
			};

			return $http(httpObj);
		};

		this.remove = function(blogId) {
			var httpObj = {
				method: 'DELETE',
				url: '/api/blog/' + blogId
			};

			return $http(httpObj);
		};
	};

	angular
		.module('pi')
		.service('blogApi', ['$rootScope', '$http', '$q', apiFn]);
})();
(function(){
	var directiveFn = function() {
		var linkFn = function(scope, element, attrs, blogApi) {
			scope.model = {};

			scope.submit = function(){
				
				blogApi
					.post(scope.model)
					.then(successFn, errorFn);
			};
		};

		return {
			link: linkFn,
			replace: false
		}
	};

	angular
		.module('piBlogCreate', [''])
})();
(function(){
	var svcFn = function($http, $q, $rootScope, piHttp) {

        /**
         * Login
         *
         * @param email
         * @param password
         * @returns {*}
         */
        this.login = function(email, password) {
            return piHttp.post('/login', {
                    email: email,
                    password: password
                })
        };

        /**
         * register new account
         * @param model
         * @returns {*}
         */
		this.register = function(model){
			return piHttp.post('/api/account', model)
		};

        /**
         * Request a recover link to email
         * @param email
         * @returns {*}
         */
        this.recoverFromEmail = function(email) {
            return piHttp.post('/api/account/recover', {
                    email: email
                });
        };

        /**
         * Update account credentials
         * @param email User email or nick handle
         * @param currentPassword Current password
         * @param newPassword New password
         * @param newPasswordConfirm Confirmation of new password
         * @returns {*}
         */
        this.updatePassword = function(email, currentPassword, newPassword, newPasswordConfirm) {
            return piHttp.post('/api/account/password', 
                {
                    email: email,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    newPasswordConfirm: newPasswordConfirm
                });
        };

	};

	angular
		.module('pi')
		.service('accountApi', ['$http', '$q', '$rootScope', 'piHttp', svcFn]);
	})();
(function(){
  var service = function($http, $q) {

    /**
     * @ngdoc function
     * @name Login
     * @description
     *
     * Try to authenticate using a username and password
     * If the authentication is confirmed, a token is returned to consume the API
     */
    this.login = function(username, password) {

      var deferred = $q.defer(),
          successFn = function(res) {
            deferred.resolve(res.data);
          },
          errorFn = function(res) {
            deferred.reject(res);
          },
          request = {
            email: username,
            password: password
          },
          httpObj = {
            url: '/login',
            method: 'POST',
            data: request
          };

          $http(httpObj)
            .then(sucessFn, errorFn);

      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name Domain Black List
     * @description
     *
     * A list of domains blocked from Pi network
     * Those domains have been banned and cannot register or login
     */
    this.domainBlackList = ['gov.pt'];
  };
})();

(function(){
    var svcFn = function(accountApi, $q) {

        this.recover = function(email){

            var deferred = $q.defer(),
                successFn = function(res){
                    deferred.resolve(res.data);
                },
                errorFn = function(res) {
                    deferred.reject(res);
                };

            accountApi
                .recoverFromEmail(email)
                .then(successFn, errorFn);

            return deferred.promise;
        };
    };

    var directiveFn = function(recoverSvc){
        var linkFn = function(scope, element, attrs) {

            scope.recover = function(){

                var successFn = function(res){
                        scope.onSuccess(res);
                    },
                    errorFn = function(res) {
                        scope.onError(res);
                    };

                recoverSvc
                    .recover(scope.email)
                    .then(successFn, errorFn);
            };
        };

        return {
            link: linkFn,
            replace: false,
            scope: {
                'onSuccess': '&',
                'onError': '&'            }
        }
    };

    var directiveSubmit = function()
    {
        var linkFn = function(scope, element, attrs, parentCtrl)
        {
            element.bind('click', function(){
                parentCtrl.recover();
            })
        };

        return {
            replace: false,
            link: linkFn
        }
    };

    angular
        .module('pi')
        .service('recoverSvc', ['accountApi', '$q', svcFn])
        .directive('piAccountRecover', ['recoverSvc', directiveFn])
        .directive('piAccountRecoverSubmit', directiveSubmit);
})();

(function(){
	var svcFn = function(accountApi, $q) {

		this.basic = function(email, password, passwordConfirm, requestModel) {

			if(_.isUndefined(requestModel) && !_.isObject(requestModel)) {
				requestModel = {};
			}
			requestModel.email = email;
			requestModel.password = password;

			var deferred = $q.defer(),
				successFn = function(res) {
					deferred.resolve(res.data);
				},
				errorFn = function(res) {
					deferred.reject(res.data);
				};

            accountApi.register(requestModel)
				.then(successFn, errorFn);

			return deferred.promise;
		};

	};

	var directiveFn = function(registerSvc){
		
		var linkFn = function(scope, element, attrs) {
			
			var disposeFn = function(){

			};

			element.on('$destroy', disposeFn);

			scope.account = {};

			scope.submit = function(){
				var model = {};
				registerSvc.basic(scope.account.email, scope.account.password, model);
			};

		};
		return {
			link: linkFn,
			scope: {
				'account': ''
			},
			replace: false
		}
	};

	angular
		.module('pi')
		.service('registerSvc', ['accountApi', '$q', svcFn])
		.directive('piRegister', ['registerSvc', directiveFn]);

})();


(function(){

	var svcFn = function($http, $q){
		/**
		 * Create a new forum
		 *
		 * @param model Request model
		 * @param parentId The forum parent id. If null or undefined, the forum is created as a Parent
		 */
		this.create = function(model, parentId) {

			var data = angular.copy(model);
			if(!_.isUndefined(parentId)) {
				data.parentId = parentId;
			}

			var deferred = $q.defer(),
				successFn = function(res) {
					deferred.resolve(res.data);
				},
				errorFn = function(res) {
					deferred.reject(res.data);
				},
				httpObj = {
					method: 'POST',
					url: '/api/community/forum',
					data: data
				};

			$http(httpObj)
				.then(successFn, errorFn);

			return deferred.promise;
		};

		this.updateInformation = function(forumId, model) {
			var data = angular.copy(model);
			data.id = forumId;

			var deferred = $q.defer(),
				successFn = function(res) {
					deferred.resolve(res.data);
				},
				errorFn = function(res) {
					deferred.reject(res);
				},
				httpObj = {
					method: 'POST',
					url: '/api/community/forum/info',
					data: data
				};

			$http(httpObj)
				.then(successFn, errorFn);

			return deferred.promise;
		};

		this.remove = function(forumId, reason) {
			var data = {
					id: forumId
				},
				deferred = $q.defer(),
				succesFn = function(res) {
					deferred.resolve(res.data);
				},
				errorFn = function(res) {
					deferred.reject(res);
				},
				httpObj = {
					method: 'DELETE',
					url: '/api/community/forum',
					data: data
				};

			$http(httpObj)
				.then(successFn, errorFn);

			return deferred.promise;
		};

		angular
			.module('pi')
			.service('forumApi', ['$http', '$q', svcFn]);
	};
});
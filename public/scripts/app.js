var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'angucomplete-alt',
   'nvd3', 'ae-datetimepicker', 'ui.select', 'ngSanitize'
]);

myApp
   .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {

      $urlRouterProvider.otherwise('/home');

      $stateProvider
         .state('home', {
            url: '/home',
            templateUrl: 'views/default.html',
            resolve: {
               pageData: homePageData
            },
            controller: function() {
               // console.log('home');
            }
         })
         .state('master', {
            abstract: true,
            url: '/master',
            template: '<div ui-view></div>'
         })
         // .state('master.department', {
         //    url: '/department',
         //    template: '<div ui-view></div>'
         // })
         // .state('master.department.list', {
         //    url: '/list',
         //    templateUrl: 'views/department-list.html',
         //    resolve: {
         //       pageData: departmentPageData
         //    },
         //    controller: 'DepartmentCtrl'
         // })
         // .state('master.department.new', {
         //    url: '/new',
         //    templateUrl: 'views/department-new.html',
         //    controller: 'DepartmentNewCtrl'
         // })
         // .state('master.department.detail', {
         //    url: '/:id',
         //    templateUrl: 'views/department-new.html',
         //    controller: 'DepartmentDetailCtrl'
         // })

      .state('master.materialT', {
            url: '/materialT',
            template: '<div ui-view></div>'
         })
         .state('master.materialT.list', {
            url: '/list',
            templateUrl: 'views/materialT-list.html',
            resolve: {
               pageData: materialTPageData
            },
            controller: 'MaterialTCtrl'
         })
         .state('master.materialT.new', {
            url: '/new',
            templateUrl: 'views/materialT-new.html',
            controller: 'MaterialTNewCtrl'
         })
         .state('master.materialT.detail', {
            url: '/:id',
            templateUrl: 'views/materialT-new.html',
            controller: 'MaterialTDetailCtrl'
         })

      .state('master.product', {
            url: '/product',
            template: '<div ui-view></div>'
         })
         .state('master.product.list', {
            url: '/list',
            templateUrl: 'views/product-list.html',
            resolve: {
               pageData: productPageData
            },
            controller: 'ProductCtrl'
         })
         .state('master.product.new', {
            url: '/new',
            templateUrl: 'views/product-new.html',
            controller: 'ProductNewCtrl'
         })
         .state('master.product.detail', {
            url: '/:id',
            templateUrl: 'views/product-new.html',
            controller: 'ProductDetailCtrl'
         })

      .state('master.supplier', {
            url: '/supplier',
            template: '<div ui-view></div>'
         })
         .state('master.supplier.list', {
            url: '/list',
            templateUrl: 'views/supplier-list.html',
            resolve: {
               pageData: supplierPageData
            },
            controller: 'SupplierCtrl'
         })
         .state('master.supplier.new', {
            url: '/new',
            templateUrl: 'views/supplier-new.html',
            controller: 'SupplierNewCtrl'
         })
         .state('master.supplier.detail', {
            url: '/:id',
            templateUrl: 'views/supplier-new.html',
            controller: 'SupplierDetailCtrl'
         })

      .state('master.process', {
            url: '/process',
            template: '<div ui-view></div>'
         })
         .state('master.process.list', {
            url: '/list',
            templateUrl: 'views/process-list.html',
            resolve: {
               pageData: processPageData
            },
            controller: 'ProcessCtrl'
         })
         .state('master.process.new', {
            url: '/new',
            templateUrl: 'views/process-new.html',
            controller: 'ProcessNewCtrl'
         })
         .state('master.process.detail', {
            url: '/:id',
            templateUrl: 'views/process-new.html',
            controller: 'ProcessDetailCtrl'
         })



      .state('master.role', {
            url: '/role',
            template: '<div ui-view></div>'
         })
         .state('master.role.list', {
            url: '/list',
            templateUrl: 'views/role-list.html',
            resolve: {
               pageData: rolePageData
            },
            controller: 'RoleCtrl'
         })
         .state('master.role.new', {
            url: '/new',
            templateUrl: 'views/role-new.html',
            controller: 'RoleNewCtrl'
         })
         .state('master.role.detail', {
            url: '/:id',
            templateUrl: 'views/role-new.html',
            controller: 'RoleDetailCtrl'
         })

      .state('record', {
         abstract: true,
         url: '/record',
         template: '<div ui-view></div>'
      })

      .state('record.purchaseOrder', {
            url: '/purchaseOrder',
            template: '<div ui-view></div>'
         })
         .state('record.purchaseOrder.list', {
            url: '/list',
            templateUrl: 'views/po-list.html',
            resolve: {
               pageData: purchaseOrderPageData
            },
            controller: 'PurchaseOrderCtrl'
         })
         .state('record.purchaseOrder.new', {
            url: '/new',
            templateUrl: 'views/po-new.html',
            resolve: {
               productList: productList,
               supplierList: supplierList,
               productPurchaseList: productPurchaseList,
               purchaseOrderInfo: purchaseOrderInfo
            },
            controller: 'PurchaseOrderNewCtrl'
         })
         .state('record.purchaseOrder.detail', {
            url: '/:id',
            templateUrl: 'views/po-new.html',
            resolve: {
               productList: productList,
               supplierList: supplierList,
               productPurchaseList: productPurchaseList,
               purchaseOrderInfo: purchaseOrderInfo
            },
            controller: 'PurchaseOrderNewCtrl'
         })

      .state('record.employee', {
            url: '/employee',
            template: '<div ui-view></div>'
         })
         .state('record.employee.list', {
            url: '/list',
            templateUrl: 'views/employee-list.html',
            resolve: {
               pageData: empPageData
            },
            controller: 'EmpCtrl'
         })
         .state('record.employee.new', {
            url: '/new',
            templateUrl: 'views/employee-new.html',
            controller: 'EmpNewCtrl'
         })
         .state('record.employee.detail', {
            url: '/:id',
            templateUrl: 'views/employee-new.html',
            controller: 'EmpDetailCtrl'
         })
         .state('record.customer', {
            url: '/customer',
            template: '<div ui-view></div>'
         })
         .state('record.customer.list', {
            url: '/list',
            templateUrl: 'views/client-list.html',
            resolve: {
               pageData: clientPageData
            },
            controller: 'ClientCtrl'
         })
         .state('record.customer.new', {
            url: '/new',
            templateUrl: 'views/client-new.html',
            controller: 'ClientNewCtrl'
         })
         .state('record.customer.detail', {
            url: '/:id',
            templateUrl: 'views/client-new.html',
            controller: 'ClientDetailCtrl'
         })
         .state('record.job', {
            url: '/job',
            template: '<div ui-view></div>'
         })
         .state('record.job.list', {
            url: '/list',
            templateUrl: 'views/job-list.html',
            resolve: {
               pageData: jobPageData
            },
            controller: 'JobCtrl'
         })
         .state('record.job.new', {
            url: '/new',
            templateUrl: 'views/job-new.html',
            resolve: {
               clientList: clientList
            },
            controller: 'JobNewCtrl'
         })
         .state('record.job.detail', {
            url: '/:id',
            templateUrl: 'views/job-new.html',
            resolve: {
               clientList: clientList
            },
            controller: 'JobDetailCtrl'
         })
         .state('record.job.process', {
            url: '/process/:id',
            templateUrl: 'views/job-process.html',
            resolve: {
               processList: processList,
               jobInfo: jobInfo
            },
            controller: 'JobProcessCtrl'
         })

      .state('record.material', {
            abstract: true,
            url: '/material',
            template: '<div ui-view></div>'
         })
         .state('record.material.list', {
            url: '/list/:id',
            templateUrl: 'views/job-material.html',
            resolve: {
               materialTList: materialTList,
               materialList: materialList,
               supplierList: supplierList,
               jobInfo: jobInfo
            },
            controller: 'MaterialCtrl'
         })

      .state('record.productPurchase', {
            abstract: true,
            url: '/productPurchase',
            template: '<div ui-view></div>'
         })
         .state('record.productPurchase.list', {
            url: '/list/:id',
            templateUrl: 'views/po-product.html',
            resolve: {
               productList: productList,
               productPurchaseList: productPurchaseList,
               purchaseOrderInfo: purchaseOrderInfo
            },
            controller: 'ProductPurchaseCtrl'
         })

      .state('record.scrap', {
            abstract: true,
            url: '/scrap',
            template: '<div ui-view></div>'
         })
         .state('record.scrap.list', {
            url: '/list/:id',
            templateUrl: 'views/job-scrap-material.html',
            resolve: {
               materialTList: materialTList,
               scrapList: scrapList,
               jobInfo: jobInfo
            },
            controller: 'ScrapCtrl'
         })

      .state('effort', {
            abstract: true,
            url: '/effort',
            template: '<div ui-view></div>'
         })
         .state('effort.list', {
            url: '/list',
            resolve: {
               pageData: effortPageData
            },
            templateUrl: 'views/effort-list.html',
            controller: 'EffortCtrl'
         })
         .state('effort.new', {
            url: '/new/:id',
            resolve: {
               processList: processList,
               jobEffort: jobEffort,
               jobInfo: jobInfo,
               userList: userList
            },
            templateUrl: 'views/effort-new.html',
            controller: 'EffortNewCtrl'
         })
         .state('effort.detail', {
            url: '/:id/:effort',
            resolve: {
               processList: processList,
               jobEffort: jobEffortFindOne,
               jobInfo: jobInfo,
               userList: userList
            },
            templateUrl: 'views/effort-detail.html',
            controller: 'EffortDetailCtrl'
         })

      .state('scrapEffort', {
            abstract: true,
            url: '/scrapEffort',
            template: '<div ui-view></div>'
         })
         .state('scrapEffort.list', {
            url: '/list',
            resolve: {
               pageData: scrapEffortPageData
            },
            templateUrl: 'views/scrap-effort-list.html',
            controller: 'ScrapEffortCtrl'
         })
         .state('scrapEffort.new', {
            url: '/new/:id',
            resolve: {
               partNoList: partNoList,
               jobScrapEffort: jobScrapEffort,
               jobInfo: jobInfo
            },
            templateUrl: 'views/scrap-effort-new.html',
            controller: 'ScrapEffortNewCtrl'
         })
         .state('jobReport', {
            url: '/jobReport',
            resolve: {
               // jobList: jobPageData
            },
            templateUrl: 'views/job-report.html',
            controller: 'JobReportCtrl'
         })
         .state('expenseReport', {
            url: '/expenseReport',
            resolve: {
               // jobList: jobPageData
            },
            templateUrl: 'views/expense-report.html',
            controller: 'ExpenseReportCtrl'
         }).state('processReport', {
            url: '/processReport',
            resolve: {
               // jobList: jobPageData
            },
            templateUrl: 'views/process-report.html',
            controller: 'ProcessReportCtrl'
         }).state('report4', {
            url: '/report4',
            resolve: {},
            templateUrl: 'views/report4.html',
            controller: 'Report4Ctrl'
         })
         .state('effortReport', {
            url: '/effortReport',
            resolve: {
               // empList: empPageData,
               // jobList: jobPageData
            },
            templateUrl: 'views/effort-report.html',
            controller: 'EffortReportCtrl'
         });

   }])
   .run(['$rootScope', 'ginfo', 'server', '$window', '$state',
      function($rootScope, ginfo, server, $window, $state) {
         var i = 1;
         $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
               if (i === 1) {
                  i++;
                  event.preventDefault();
                  server.crud('GET', 'ping', null, function(err, data) {
                     if (!!err) {
                        console.log('error pinging');
                     }
                     // console.log('user data after ping call', data);
                     localStorage.setItem("user", JSON.stringify(data));
                     // i++;
                     return $state.go(toState);
                  });
               }
            });
         $rootScope.ginfo = ginfo;
         $rootScope.logOff = function() {
            server.crud('GET', 'logout', null, function(err, data) {
               if (!!err) {
                  // console.log('error logiing off');
               }
               ginfo.logOff();
               $window.location.href = "/login";
            });

         };
      }
   ]);

var homePageData = ['server', 'ginfo', '$q', '$state',
   function(server, ginfo, $q, $state) {
      var deferred = $q.defer();
      server.crud('GET', 'ping', null, function(err, data) {
         if (!!err) {
            console.log('error pinging');
         }
         console.log('user data after ping call', data);
         ginfo.setUser(data);
         if (ginfo.isUsr()) {
            return $state.go('effort.new');
         }
         deferred.resolve(data);
      });
      return deferred.promise;
   }
];

var empPageData = ['empService', function(empService) {
   return empService.list();
}];

var supplierPageData = ['supplierService', function(supplierService) {
   return supplierService.list();
}];

var materialTPageData = ['materialTService', function(materialTService) {
   return materialTService.list();
}];

var productPageData = ['productService', function(productService) {
   return productService.list();
}];

var departmentPageData = ['departmentService', function(departmentService) {
   return departmentService.list();
}];

var clientPageData = ['clientService', function(clientService) {
   return clientService.list();
}];

var jobPageData = ['jobService', function(jobService) {
   return jobService.list();
}];


var effortPageData = ['effortService', function(effortService) {
   return effortService.list();
}];

var userList = ['effortService', '$stateParams', function(effortService) {
   return effortService.userList();
}];

var clientList = ['jobService', function(jobService) {
   return jobService.clientList();
}];

var processList = ['jobService', '$stateParams', function(jobService, $stateParams) {
   if ($stateParams.id) {
      return jobService.processList($stateParams.id);
   }
   return [];
}];

var processPageData = ['processService', function(processService) {
   return processService.list();
}];

var purchaseOrderPageData = ['purchaseOrderService', function(purchaseOrderService) {
   return purchaseOrderService.list();
}];

var rolePageData = ['roleService', function(roleService) {
   return roleService.list();
}];

var materialTList = ['materialService', function(materialService) {
   return materialService.materialTList();
}];

var productList = ['productService', function(productService) {
   return productService.list();
}];

var materialList = ['materialService', '$stateParams', function(materialService, $stateParams) {
   return materialService.materialList($stateParams.id);
}];

var supplierList = ['materialService', function(materialService) {
   return materialService.supplierList();
}];

var scrapList = ['scrapService', '$stateParams', function(scrapService, $stateParams) {
   return scrapService.scrapList($stateParams.id);
}];

var jobEffort = ['effortService', '$stateParams', function(effortService, $stateParams) {
   return effortService.jobEffort($stateParams.id);
}];

var jobEffortFindOne = ['effortService', '$stateParams', function(effortService, $stateParams) {
   return effortService.jobEffortFindOne($stateParams.id, $stateParams.effort);
}];

var effortPageData = ['effortService', function(effortService) {
   return effortService.list();
}];


var partNoList = ['scrapEffortService', '$stateParams', function(scrapEffortService, $stateParams) {
   return scrapEffortService.partNoList($stateParams.id);
}];


var jobScrapEffort = ['scrapEffortService', '$stateParams', function(scrapEffortService, $stateParams) {
   return scrapEffortService.jobScrapEffort($stateParams.id);
}];


var scrapEffortPageData = ['scrapEffortService', function(scrapEffortService) {
   return scrapEffortService.list();
}];

var jobInfo = ['jobService', '$stateParams', function(jobService, $stateParams) {
   if ($stateParams.id)
      return jobService.jobInfo($stateParams.id);
   return null;
}];

var productPurchaseInfo = ['productPurchaseService', '$stateParams', function(productPurchaseService, $stateParams) {
   if ($stateParams.id)
      return productPurchaseService.productPurchaseInfo($stateParams.id);
   return null;
}];

var productPurchaseList = ['productPurchaseService', '$stateParams', function(productPurchaseService, $stateParams) {
   if ($stateParams.id)
      return productPurchaseService.productPurchaseList($stateParams.id);
   return null;
}];

var purchaseOrderInfo = ['productPurchaseService', '$stateParams', function(productPurchaseService, $stateParams) {
   if ($stateParams.id)
      return productPurchaseService.purchaseOrderInfo($stateParams.id);
   return null;
}];

'use strict';


myApp
    .controller('ExpenseReportCtrl', ['themeInit', 'expenseService', '$scope',
        function(themeInit, expenseService, $scope) {

            themeInit.dataTable();
            themeInit.datePicker();
            $scope.expense = {};
            // $scope.empList = empList;
            // $scope.jobList = jobList;

            function parseDate(input) {
                var parts = input.split('/');
                // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
                return new Date(parts[2], parts[0] - 1, parts[1]); // Note: months are 0-based
            }

            function searchDate(input) {
                var parts = input.split('/');
                // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
                return new Date(parts[1]+'/'+parts[0]+'/'+parts[2]);
            }


            $scope.selectJob = function(selectedJob) {
                $scope.expense.job = selectedJob ? selectedJob.originalObject : '';
            };


            $scope.find = function() {
                $scope.showMe = true;
                var sDate = $('#start').val();
                var eDate = $('#end').val();

                $scope.expense.sDate = moment((searchDate(sDate)).setHours(0, 0, 0, 0)).toDate();
                $scope.expense.eDate = moment((searchDate(eDate)).setHours(23, 59, 59, 999)).toDate();
                expenseService.expenseReport($scope.expense)
                    .then(function(r) {
                        console.log(JSON.stringify(r));
                        $scope.pageData = r;
                    });
            };

            $scope.download = function() {
                $scope.showMe = true;
                var sDate = $('#start').val();
                var eDate = $('#end').val();
                $scope.effort.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
                $scope.effort.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
                effortService.downloadReport($scope.effort);

            };

            $scope.downloadpdf = function() {
                html2canvas(document.getElementById('exportthis'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        var docDefinition = {
                            content: [{
                                image: data,
                                width: 500,
                            }]
                        };
                        pdfMake.createPdf(docDefinition).download("report.pdf");
                    }
                })
            };


        }
    ]);
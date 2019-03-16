'use strict';


myApp
    .controller('SummaryCtrl', ['$scope', 'server', '$window', 'ginfo', function(
        $scope, server, $window, ginfo) {


        $scope.repeatArray = [0, 1, 2, 3];

        var sDate, eDate;
        $scope.pageData = [];
        $scope.reportQns = [];
        $scope.modelData = {};
        $scope.limitList = [5, 10, 20, 30, 40, 50];
        $scope.totalLength = 0;
        $scope.dateRange = '';
        //search option list
        $scope.userLocations = [];
        $scope.airLines = [];
        $scope.longesList = [];
        //search option list


        $scope.filterOptions = {
            location: {
                name: 'EMPTY'
            },
            airline: [],
            longe: [],
            sDate: '',
            eDate: ''
        };

        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;

        $scope.$watch('currentPage + numPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                end = begin + $scope.numPerPage;
            $scope.pageData = $scope.list(begin, $scope.numPerPage);
        });


        $scope.userDT = function(y) {
            var d = moment(y).format('MMMM Do YYYY'); //, h:mm:ss a  new Date(y).toString();

            return d;
        };

        $scope.download = function(file) {
            var airline, longe, location, locName, url;

            var dtRng;
            dtRng = $scope.dateRange.split('-');
            sDate = dtRng[0].trim();
            eDate = dtRng[1] ? dtRng[1].trim() : '';

            airline = $scope.filterOptions.airline ? $scope.filterOptions.airline : [];
            longe = $scope.filterOptions.longe ? $scope.filterOptions.longe : [];
            location = $scope.filterOptions.location._id ? $scope.filterOptions.location._id : '';
            locName = $scope.filterOptions.location.name ? $scope.filterOptions.location.name : '';
            // sDate = sDate ? sDate : '';
            // eDate = eDate ? eDate : '';
            if (sDate) {
                sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            }
            if (eDate) {
                eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            }
            url = 'feedback/download/' + file;

            server.download('POST', url, {
                'airline': airline,
                'longe': longe,
                'location': location,
                'sDate': sDate,
                'eDate': eDate,
                'locName': locName
            }, function(err, data) {
                if (!!err) {
                    console.log('error fetching');
                }

            });

        };

        $scope.displayGrade = function(x) {
            var grade;
            grade = (x == 1) ? 'Poor' : (x == 2) ? 'Average' : (x == 3) ? 'Good' : (x == 4) ? 'Outstanding' : '';
            return grade;
        };

        $scope.getScore = function(y) {
            var x;
            switch (y) {
                case 1:
                    x = "1,2";
                    break;
                case 2:
                    x = "3,4,5";
                    break;
                case 3:
                    x = "6,7,8";
                    break;
                case 4:
                    x = "9,10";
                    break;
                default:
                    break;
            }
            return x;

        };

        $scope.resCount = function(x, y) {
            var count = 0;
            for (var i = 0; i < x.response.length; ++i) {
                switch (y) {
                    case 1:
                        if ((x.response[i] == 1) || (x.response[i] == 2))
                            count++;
                        break;
                    case 2:
                        if ((x.response[i] == 3) || (x.response[i] == 4) || (x.response[i] == 5))
                            count++;
                        break;
                    case 3:
                        if ((x.response[i] == 6) || (x.response[i] == 7) || (x.response[i] == 8))
                            count++;
                        break;
                    case 4:
                        if ((x.response[i] == 9) || (x.response[i] == 10))
                            count++;
                        break;
                    default:
                        break;
                }

            }
            return count;
        };

        $scope.getSerarchOpts = function(data) {

            var initial = {
                name: 'ALL'
            };
            server.crud('GET', 'user/location', null, function(err, data) {

                if (!!err) {
                    console.log('error fetching');
                } else {
                    if (angular.isArray(data)) {
                        $scope.userLocations = data;
                    } else {
                        $scope.userLocations.push(data);
                    }
                    if (!$scope.userLocations.length) {
                        $scope.filterOptions.location = {
                            name: 'EMPTY'
                        };
                    } else {
                        $scope.filterOptions.location = $scope.userLocations[0];
                    }
                }

            });

            server.crud('GET', 'airline', null, function(err, data) {
                if (!!err) {
                    console.log('error fetching');
                } else {
                    if (angular.isArray(data)) {
                        $scope.airLines = data;
                    } else {
                        $scope.airLines.push(data);
                    }
                    // $scope.airLines.push(initial);
                    // $scope.filterOptions.airLine = initial;
                }
            });

            server.crud('GET', 'user/longes', null, function(err, data) {
                if (!!err) {
                    console.log('error fetching');
                } else {
                    if (angular.isArray(data)) {
                        $scope.longesList = data;
                    } else {
                        $scope.longesList.push(data);
                    }
                    // $scope.longesList.push(initial);
                    // $scope.filterOptions.longe = initial;
                }
            });
        };

        $scope.getSerarchOpts();


        $scope.list = function(b, l) {
            $scope.dateRange = $('#dateRg').val();
            var airline, longe, location, url;

            var dtRng;
            dtRng = $scope.dateRange.split('-');
            sDate = dtRng[0].trim();
            eDate = dtRng[1] ? dtRng[1].trim() : '';

            l = l || $scope.numPerPage;
            b = b || (($scope.currentPage - 1) * $scope.numPerPage);
            airline = $scope.filterOptions.airline;
            longe = $scope.filterOptions.longe;
            location = $scope.filterOptions.location._id ? $scope.filterOptions.location._id : '';
            // sDate = sDate ? sDate : '';
            // eDate = eDate ? eDate : '';
            if (sDate) {
                sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            }
            if (eDate) {
                eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            }
            url = 'feedback/locFeed';

            console.log(url);
            server.crud('POST', url, {
                'airline': airline,
                'longe': longe,
                'location': location,
                'startIndex': b,
                'limit': l,
                'sDate': sDate,
                'eDate': eDate
            }, function(err, data) {
                if (!!err) {
                    console.log('error fetching');
                } else {
                    console.log('data', data);
                    // data = data.feedback;
                    $scope.pageData = data;
                    // var excellent, good, poor, failed, total;
                    // for (var i = 0; i < $scope.pageData.length; ++i) {
                    //     excellent = 0;
                    //     good = 0;
                    //     poor = 0;
                    //     failed = 0;
                    //     total = 0;
                    //     for (var j = 0; j < $scope.pageData[i].response.length; ++j) {
                    //         var dat = $scope.pageData[i].response[j];
                    //         if ((dat == 1) || (dat == 2)) {
                    //             failed++;
                    //         } else if ((dat == 3) || (dat == 4) || (dat == 5)) {
                    //             poor++;
                    //         } else if ((dat == 6) || (dat == 7) || (dat == 8)) {
                    //             good++;
                    //         } else if ((dat == 9) || (dat == 10)) {
                    //             excellent++;
                    //         }
                    //     }
                    //     total = $scope.pageData[i].response.length;
                    //     $scope.pageData[i].excellent = ((excellent / total) * 100).toFixed(2);
                    //     $scope.pageData[i].poor = ((poor / total) * 100).toFixed(2);
                    //     $scope.pageData[i].failed = ((failed / total) * 100).toFixed(2);
                    //     $scope.pageData[i].good = ((good / total) * 100).toFixed(2);
                    //     $scope.pageData[i].total = total;
                    //     $scope.pageData[i].acceptable = (((excellent + good) / total) * 100).toFixed(2);
                    // }

                    // console.log('pageData___________________', JSON.stringify($scope.pageData));

                }

            });

        };

        //Date range picker
        $('#dateRg').daterangepicker();


    }]);

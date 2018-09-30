var app = angular.module('simpleTimer', []);

app.controller('mainController', function($scope) {

    $scope.timerstatus = "start";
    $scope.loginTimer = "timer1";
    $scope.time = 30;

    $scope.start= function() {
        $scope.timerstatus = "start";
    };

    $scope.stop = function(){
        $scope.timerstatus = "stop";
    }       

    $scope.pause = function(){
        $scope.timerstatus = "reset";
    }
});

app.directive("timer", ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            name: '@',
            interval: '@',
            time: '=',
            finishmsg: '@',
            timerstatus: '='
        },
        link: function (scope, element, attrs) {
            var validationCodeTime = scope.time || 60;
            scope.interval = scope.interval || 1000;
        
                scope.time = scope.time || validationCodeTime;

                var timerObj = null;
                var timer = new Timer(timerFn);
                scope.$watch('timerstatus', function () {
                    switch (scope.timerstatus){
                        case 'stop':
                            timer.stop();
                            break;
                        case 'start':
                            timer.start();
                            break;
                        case 'reset':
                            timer.reset();
                            break;
                        case 'idle':
                            timer.ready();
                            break;
                        default:
                            break;
                    }
                });
            
            function Timer(fn) {

                this.stop = function() {
                    if (timerObj) {
                        clearInterval(timerObj);
                        timerObj = null;
                    }
                    return this;
                }

                // start timer using current settings (if it's not already running)
                this.start = function(time) {
                    if (!timerObj) {
                        this.stop();
                        scope.time = time || scope.time;
                        timerObj = setInterval(fn, scope.interval);
                    }
                    return this;
                }

                // start with new interval, stop current interval
                this.reset = function() {
                    return this.stop().start(validationCodeTime);
                }

                this.ready = function(){
                    return this.reset().stop();
                }
            };

            function timerFn() {
                scope.time = scope.time - 1;
                var result = getText(scope.time, this);

                var template = "";
                if (result.length > 13) {
                    template = '<div class="msg" id="{{name}}">' + result + '</div>';
                }
                else {
                    template = '<div class="timer" id="{{name}}">' + result + '</div>';
                }
                element.html('');
                angular.element(element).append($compile(template)(scope));
            };

            var getText = function (time, interv) {
                var result = "";
                if (time <= 0) {
                    result = scope.finishmsg || "";
                    clearInterval(interv)
                }
                else if (time < '3600') {
                    var second = (time % 60).toString();
                    var minute = (Math.floor(time / 60)).toString();

                    second = second.length == 1 ? "0" + second : second;
                    minute = minute.length == 1 ? "0" + minute : minute;

                    result = minute + " : " + second;
                } else {

                    var hour = (Math.floor(time / 3600)).toString();
                    var minute = (Math.floor((time - hour * 3600) / 60)).toString();
                    var second = (time % 60).toString();

                    second = second.length == 1 ? "0" + second : second;
                    minute = minute.length == 1 ? "0" + minute : minute;
                    hour = hour.length == 1 ? "0" + hour : hour;

                    result = hour + " : " + minute + " : " + second;
                }
                return result;
            }
        }
    };
}])
;

if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
  module.exports = timerModule;
}
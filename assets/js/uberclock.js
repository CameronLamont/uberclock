angular.module('uberclock',[]);
angular.module('uberclock').controller('BaseCtrl',
    ['$scope', function ($scope) {

    $scope.clocks = {};        
    
    
     $scope.enableClock = function (clockid) {
        io.socket.get("/Clock/" + clockid + "/enable", function(data){
            console.log(data);
        });
    }

    
    $scope.disableClock = function (clockid) {
        io.socket.get("/Clock/" + clockid + "/disable", function(data){
            console.log(data);
        });
    }     


    io.socket.get('/Clock', function (clocks) {
        for (i = 0; i < clocks.length; i++){
             
            io.socket.get('/Clock/' + clocks[i].id + '/tick', function (clock) {
                $scope.clocks['clocks' + clock.id] = clock;
                $scope.$apply();
                });

        } 
        
    });     


/*        
    io.socket.get('/Clock/1/tick', function (data) {
        $scope.clocks['clocks' + data.id] = data;
        $scope.$apply();
        });

    io.socket.get('/Clock/2/tick',function (data) {
        $scope.clocks['clocks' + data.id] = data;
        $scope.$apply();
    });
*/

    io.socket.on('tick', function (msg) {
        //switch (event.verb) {
         //   case 'created':
        for (i = 0; i < msg.length; i++) {
            $scope.clocks['clocks' + msg[i].id] = msg[i];
            console.log(msg[i]);
        }    
        $scope.$apply();
         //       break;        
    //    } 
    });    

}]);
var app = angular.module('plunker', ["ngRoute", "smart-table"]);


app.config(['$routeProvider',
  function($routeProvider) {
    //  debugger;
    $routeProvider.
    when('/main', {
      templateUrl: 'productList.html',
      controller: 'MainCtrl'
    }).
    when('/main/:id', {
      templateUrl: 'productDetail.html',
      controller: 'DetailCtrl'
    }).
    when('/main/:id/:idDetail', {
      templateUrl: 'productSingle.html',
      controller: 'SingleCtrl'
    }).
    otherwise({
      redirectTo: '/main'
    });
  }
]);




app.controller('MainCtrl', function($scope, $http, $location, $routeParams) {



  //Make the call to get the json data
  $http.get("http://awsstaging.flashtalkingfeeds.com/temp/bas/test-api/get.php")
    .then(function(response) {
      $scope.myData = response.data.Data;
      //debugger;
    });



});

var globalProductPageState;
app.controller('DetailCtrl', function($scope, $http, $location, $routeParams) {
  $scope.idCategory = $routeParams.id;

  var stringHolder = "http://awsstaging.flashtalkingfeeds.com/temp/bas/test-api/get.php?category=" + $scope.idCategory;
  //Make the call to get the json data
  $http.get(stringHolder)
    .then(function(response) {
      $scope.myDetailData = response.data.Data;
      //debugger;
      if (localStorage.getItem($scope.idCategory) !== null) {
        //debugger;
        var objectify = JSON.parse(localStorage.getItem($scope.idCategory));
        console.log(localStorage.getItem($scope.idCategory));
       // debugger;

        if (objectify !== null) {
          for (i = 0; i < objectify.length; i++) {
            $scope.myDetailData = $scope.myDetailData.concat(objectify[i]);
          }
        }



      }



    });

  globalProductPageState = $scope.idCategory;


  /*  $scope.itemsList = [{
      productName: "Test Item",
      productImg: "http://www.patagonia.com/tsimages/83620_SHKP.fpx?ftr=8&cvt=jpeg,scans=progressive",
      productPrice: "350",
      productHref: "www.patagonia.com",

    }];*/

  //add them to the list 


  $scope.addItem = function() {


    $scope.myDetailData = $scope.myDetailData.concat([{
        href: $scope.formAddHref,
        id: $scope.formAddImg,
        image: $scope.formAddImg,
        price: $scope.formAddPrice,
        title: $scope.formAddName,
        type: $scope.formAddName
      },


    ]);


    var productSaver = {
      href: $scope.formAddHref,
      id: $scope.formAddImg,
      image: $scope.formAddImg,
      price: $scope.formAddPrice,
      title: $scope.formAddName,
      type: $scope.formAddName

    };
    // debugger;
    if (localStorage.getItem($scope.idCategory) === null) {
      localStorage.setItem($scope.idCategory, JSON.stringify(productSaver));
    } else {
      var olderData = JSON.parse(localStorage.getItem($scope.idCategory));
      var arr = [];
      //debugger;
      if (olderData !== null) {
        for (i = 0; i < olderData.length; i++) {
          arr.push(olderData[i]);
        }
      }


      arr.push(productSaver)
      localStorage.setItem($scope.idCategory, JSON.stringify(arr));
    }

    //console.log(olderData);
    $scope.formAddName = "";
    $scope.formAddImg = "";
    $scope.formAddPrice = "";
    $scope.formAddHref = "";



  }
  $scope.clearLocalSaves = function() {

    localStorage.setItem($scope.idCategory, null);
    //localStorage.clear();

  }
});


app.controller('SingleCtrl', function($scope, $http, $location, $routeParams) {
  $scope.idDetail = $routeParams.idDetail;
  var stringHolderDetail = "http://awsstaging.flashtalkingfeeds.com/temp/bas/test-api/get.php?category=" + globalProductPageState + "&" + $scope.idDetail;
  $http.get(stringHolderDetail)
    .then(function(response) {
      $scope.mySingleData = response.data.Data;

    });


});


app.directive('ngConfirmClick', [
  function() {
    return {
      link: function(scope, element, attr) {
        var msg = attr.ngConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click', function(event) {
          if (window.confirm(msg)) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }
])
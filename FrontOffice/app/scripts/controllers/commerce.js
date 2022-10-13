'use strict';

angular.module('frontOfficeApp')
  .controller('CommerceCtrl', function ($rootScope, $scope, $http) {
    $scope.foodProducts = [];
    $scope.gameProducts = [];
    $scope.boughtProducts = [];
    $scope.prodTotal = 0;
    $scope.buy = true;
    $scope.bought = false;
    $scope.food_data = {
	qty: []
    };

    $scope.toy_data = {
	qty: []
    };

    $scope.showBought = function(){
      $scope.buy = false;
      $scope.bought = true;
    };

    $scope.buyProduct = function(el,index){
      if($rootScope.userLogged == '') return alert('You\'ve to be logged in order to buy products')
      if(el.availability == 0 || el.availability < ((el.category=='food') ? $scope.food_data.qty[index] : $scope.toy_data.qty[index])) return alert('The selected amount for this product is not currently available!');
      if(((el.category=='food') ? $scope.food_data.qty[index] : $scope.toy_data.qty[index]) == undefined) return alert('Select a valid quantity for this purchase');
      $http.post(frontRoute + '/buyproduct', {
        user: $rootScope.userLogged,
        name: el.name,
        category: el.category,
        quantity: (el.category=='food') ? $scope.food_data.qty[index] : $scope.toy_data.qty[index]
      })
      .then(() => location.reload())
      .catch((err) => console.log(err));
    }

    $http.get(backRoute + '/products')
    .then((res) => {
      for(let i in res.data){
        if(res.data[i].category == 'food') $scope.foodProducts.push(res.data[i]);
        else $scope.gameProducts.push(res.data[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    
    $http.get(frontRoute + '/invoice?user='+ $rootScope.userLogged)
    .then((res) => {
      $scope.boughtProducts = res.data.products;
      $scope.prodTotal = res.data.totalProducts.toFixed(2);

    })
    .catch((err) => console.log(err))
});

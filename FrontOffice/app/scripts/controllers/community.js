'use strict';
angular.module('frontOfficeApp')
  .controller('CommunityCtrl', function ($scope,$rootScope, $http) {
    $scope.posts = [];
    $scope.preferences = [];
    $scope.showForm = false;
    $scope.showPosts = true;

    $scope.data = {
    availableOptions: [
      {id: '1', name: 'Funny Stuff', value: 'funny stuff'},
      {id: '2', name: 'Informative Stuff', value: 'informative stuff'},
      {id: '3', name: 'Psychologic Help', value: 'psychologic help'},
      {id: '4', name: 'Wedding Planning', value: 'wedding planning'}
    ],
    selectedOption: {id: '1', name: 'Funny Stuff', value: 'funny stuff'} 
    };

    $http.get(frontRoute + '/preferences?user=' + $rootScope.userLogged)
    .then(async (res) => {
      await ($scope.preferences = res.data);
    })
    .catch((err) => console.log(err));

    $http.get(frontRoute + '/posts')
    .then((res) => {
      for(let i = res.data.length - 1 ; i >= 0; i--){
        let date = res.data[i].date.split('T')[0];
        let time = res.data[i].date.split('T')[1];
        time = time.split(':')[0] + ':' + time.split(':')[1];
        let join = date.replace(/-/g,"/") + " " + time;
        $scope.posts.push({
          user: res.data[i].user,
          date: join,
          post: res.data[i].post,
          category: res.data[i].category
        });
      }
      $scope.posts.sort((a,b) => {
        if( $scope.preferences.includes(a.category) &&
            !($scope.preferences.includes(b.category)) ) return -1;
        else if( (!$scope.preferences.includes(a.category)) &&
                  $scope.preferences.includes(b.category) ) return 1;
        else return 0;
      });
    })
    .catch((err) => {
      console.log(err);
    });

    $scope.showPostForm = function(){
      $scope.showPosts = false;
      $scope.showForm = true;
    };

    $scope.writePost = function(postContent){
      if($rootScope.userLogged == '') return alert('You are not logged in!');
      let obj = {
        user: $rootScope.userLogged,
        category: $scope.data.selectedOption.value,
        date: new Date().toISOString(),
        post: postContent
      };
      
      $http.post(frontRoute + '/writepost', {obj})
      .then(() => {
        location.reload();
      })      
      .catch(() => {
        return alert('An error on the server occurred!');
      })
    }
});

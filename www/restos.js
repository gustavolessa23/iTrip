// document.addEventListener("deviceready", function() {
//     var div = document.getElementById("map");

//     // Create a Google Maps native view under the map_canvas div.
//     var map = plugin.google.maps.Map.getMap(div);

//       // Move to the position with animation
//       map.animateCamera({
//         target: {lat: 37.422359, lng: -122.084344},
//         zoom: 17,
//         tilt: 60,
//         bearing: 140,
//         duration: 5000
//       });

//       // Add a maker
//       var marker = map.addMarker({
//         position: {lat: 37.422359, lng: -122.084344},
//         title: "Welecome to \n" +
//                "Cordova GoogleMaps plugin for iOS and Android",
//         snippet: "This plugin is awesome!",
//         animation: plugin.google.maps.Animation.BOUNCE
//       });

//       // Show the info window
//       marker.showInfoWindow();



//   }, false);




// function saveData(){
//     NativeStorage.setItem(new Date(),<value>, <success-callback>, <error-callback>);
// }

//  function initMap() {
// //     var cct =
//         // {lat: Number(lat), lng: Number(lng)};
//         { lat: 53.346, lng: -6.2588 };
//     map = new google.maps.Map(document.getElementById('map'),
//         {
//             zoom: 4,
//             center: cct
//         }
//     );
//     var marker = new google.maps.Marker({
//         position: cct,
//         map: map
//     });
// }

// !function (d, s, id) { 
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (!d.getElementById(id)) { 
//     js = d.createElement(s); 
//     js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js'; 
//     fjs.parentNode.insertBefore(js, fjs); 
//   } 
// }(document, 'script', 'weatherwidget-io-js');


// "results" : [
//     {
//        "bounds" : {
//           "northeast" : {
//              "lat" : 53.359493,
//              "lng" : -6.2875035
//           },
//           "southwest" : {
//              "lat" : 53.359293,
//              "lng" : -6.2877035
//           }
//        },
//        "components" : {
//           "ISO_3166-1_alpha-2" : "IE",
//           "ISO_3166-1_alpha-3" : "IRL",
//           "_type" : "building",
//           "city" : "Dublin",
//           "city_district" : "Cabra East C ED",
//           "continent" : "Europe",
//           "country" : "Ireland",
//           "country_code" : "ie",
//           "county" : "County Dublin",
//           "county_code" : "D",
//           "house_number" : "79",
//           "locality" : "Grangegorman Middle",
//           "political_union" : "European Union",
//           "postcode" : "D07 EPK0",
//           "road" : "Annamoe Road",
//           "state" : "Leinster",
//           "state_code" : "L"
//        },


// function updateMap(){
//     alert("working");
//     getLocation();
//     initMap(lat, lng);
// }

// function initMap(lat, lng) {

//     var markers = {

//         cct = {lat: 53.346, lng: -6.2588},
//         another = {lat: 53.3458, lng: -6.2575},
//         location = {lat: lat, lng: lng}
//     }

//     var map = new
//         google.maps.Map(document.getElementById('map'), 
//         {  zoom: 9,
//         center: markers.location
//         }
//     );

//     var cct = new google.maps.Marker({
//         position: cct,
//         map: map
//     }); 

//     var another = new google.maps.Marker({
//         position: another,
//         map: map
//     });    

//     var location = new google.maps.Marker({
//         position: another,
//         map: map,
//         title: 'current location'
//     });    
// }


    // lat = latitude;
    // lng = longitude;

        // be certain to make an unique reference String for each variable!
        // if (window.cordova) {
            // document.addEventListener('deviceready', function() {
            //     window.sqlitePlugin.echoTest(function() {
            //       console.log('ECHO test OK');
            //     });
            //   });          
            //   document.addEventListener('deviceready', function() {
            //     window.sqlitePlugin.selfTest(function() {
            //       console.log('SELF test OK');
            //     });
            //   });
        // }

        // var obj = { name: "Teste", author: "123" };
        // var obj2 = { name: "Second", author: "456"};
        //console.log(obj);
        // window.NativeStorage.setItem("reference", obj, setSuccess, setError);
        // window.NativeStorage.setItem("reference", obj, setSuccess, setError);
        // window.NativeStorage.setItem("1", obj2);

       // window.NativeStorage.clear();
        // saveEntry("1", obj);
        // saveEntry("2", obj2);
        // getAllKeys();

        
        // NativeStorage.getItem("1",
        // // function(){
        // //     console.log("success");
        // //     alert("success");
        // // }
        // getSuccess,
        // function(){
		// 	console.log("fail");alert("failed :)");
        // });
        // NativeStorage.getItem("reference",
        // // function(){
        // //     console.log("success");
        // //     alert("success");
        // // }
        // getSuccess,
        // function(){
		// 	console.log("fail");alert("failed :)");
        // });
        // NativeStorage.keys(
        // // function(){
        // //     console.log("success");
        // //     alert("success");
        // // }
        // getSuccess,
        // function(){
		// 	console.log("fail");alert("failed :)");
		// });


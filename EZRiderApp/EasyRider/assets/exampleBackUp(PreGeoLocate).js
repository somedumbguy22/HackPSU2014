var gmarkers = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var selectedMarker;
var istPosition;

var TOTAL_DISTANCE;
var ESTIMATED_TIME;
var THE_MINUTES;
var THE_COST;
var REQUESTED_TAXI;
var OUTPUT_COST;

var taxiRequested = false;
var yourTaxi;

var YOU_HAVE_REQUESTED_A_TAXI = false;

var ISTLatLng = new google.maps.LatLng(40.793880, -77.867718);

var MAP;

var ReqWindow;

var CURRENT_MARKER;

var phoneNumber = localStorage.getItem('_PhoneNumber');
var address = localStorage.getItem('_Address');
var passengerNumber = localStorage.getItem('_PassengerNumber');

var currentTaxiNumber;
var currentLat;
var currentLong;
var currentDest;
var currentNum;

var DESTINATION_COST = true;

var markerStateTracker = false;


function initialize() {


console.log(phoneNumber);
console.log(address);

directionsDisplay = new google.maps.DirectionsRenderer();

var myLatlng = new google.maps.LatLng(40.796,-77.8685);
var Latlng_two = new google.maps.LatLng(40.798,-77.8715);
var Latlng_three = new google.maps.LatLng(40.798, -77.8693);
var Latlng_four = new google.maps.LatLng(40.7951, -77.8655);

istPosition = ISTLatLng;

var mapOptions = {
zoom: 15,
center: ISTLatLng
}
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

MAP = map;

var image = 'taxi-cab.png';

directionsDisplay.setMap(map);

var personMarker = new google.maps.Marker({
 position:ISTLatLng,
 map:map
});

var marker;
makeMarker(map, marker, myLatlng, image, 279001);

var marker_two;
makeMarker(map, marker_two, Latlng_two, image, 279002);

var marker_three;
makeMarker(map, marker_three, Latlng_three, image, 279003);

var marker_four;
makeMarker(map, marker_four,Latlng_four, image, 279004);

EstimateCost();

moveMarkers(map, gmarkers, myLatlng, Latlng_two, Latlng_three, Latlng_four);

//confirm('Would Like to use current location. Allow?');

}   

function makeMarker(map, marker,lat_long, image, carNumber){
 marker = new google.maps.Marker({
 position:lat_long,
 map:map,
 icon: image,
 number: carNumber
});

 gmarkers.push(marker);
 google.maps.event.addListener(marker, 'click', function(){

  if(REQUESTED_TAXI != marker && YOU_HAVE_REQUESTED_A_TAXI)
  {
    markerStateTracker = true;
  }

  
  if(taxiRequested && marker == CURRENT_MARKER && !YOU_HAVE_REQUESTED_A_TAXI)
  {
    taxiRequested = false;
    yourTaxi = marker;

     var contentString = 'Taxi requested' + '(Click the taxi again to cancel request)';
      /*ReqWindow = new google.maps.InfoWindow({
        content: contentString
      });
      ReqWindow.open(map,marker);*/


      REQUESTED_TAXI = marker;

      currentTaxiNumber = marker.number;
      currentLat = marker.position.lat();
      currentLong = marker.position.lng();
      currentDest = address;
      currentNum = phoneNumber;

      QueueToServer(currentTaxiNumber, currentLat, currentLong, currentDest, currentNum);

      alert(contentString);
      //alert("Estimated Cost of Trip: $" + THE_COST);
      YOU_HAVE_REQUESTED_A_TAXI = true;

  }

  else if(CURRENT_MARKER == null || (!taxiRequested || CURRENT_MARKER != marker) && marker != REQUESTED_TAXI)
  {
     taxiRequested = true;

    selectedMarker = marker.position;
    Route();

     CURRENT_MARKER = marker;
     calculateDistances(map,marker);
  }
  else if(YOU_HAVE_REQUESTED_A_TAXI && marker == REQUESTED_TAXI && !markerStateTracker)
  {
    alert('The Current Request was Canceled!');
    YOU_HAVE_REQUESTED_A_TAXI = false;
    taxiRequested = false;
    REQUESTED_TAXI = null;
    //closeInfoWindow(ReqWindow);
  }
  else if(YOU_HAVE_REQUESTED_A_TAXI && marker == REQUESTED_TAXI && markerStateTracker)
  {
    markerStateTracker = false;
    selectedMarker = marker.position;
    Route();
  }

 });


}

function moveMarkers(map,gmarkers,myLatlng,Latlng_two,Latlng_three){

setInterval(function() {
 myLatlng = new google.maps.LatLng(myLatlng.lat() - .0000038, myLatlng.lng() + .000005);
 gmarkers[0].setPosition(myLatlng);

 Latlng_two = new google.maps.LatLng(Latlng_two.lat() + .0000014, Latlng_two.lng() + .0000016);
 gmarkers[1].setPosition(Latlng_two);

 //Latlng_three = new google.maps.LatLng(Latlng_three.lat() - .0000022, Latlng_three.lng() - .000003);
 //gmarkers[2].setPosition(Latlng_three);

}, 750);

}

function removeMarker(gmarkers){

 gmarkers[0].setMap(null);
}


google.maps.event.addDomListener(window, 'load', initialize);


function Route() {

 var start = selectedMarker;
 var end = new google.maps.LatLng(40.793880, -77.867718);
 var request = {
 origin:start,
 destination:end,
 travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
 if (status == google.maps.DirectionsStatus.OK) {
   directionsDisplay.setDirections(result);
 }
 });
} 


function calculateDistances(map,marker) {
 var service = new google.maps.DistanceMatrixService();
 service.getDistanceMatrix(
   {
     origins: [selectedMarker],
     destinations: [istPosition],
     travelMode: google.maps.TravelMode.DRIVING,
     unitSystem: google.maps.UnitSystem.IMPERIAL,
     avoidHighways: false,
     avoidTolls: false
   }, callback);
}


function callback(response, status) {
 if (status != google.maps.DistanceMatrixStatus.OK) {
   alert('Error was: ' + status);
 } else {
   var origins = response.originAddresses;
   var destinations = response.destinationAddresses;


   var outputDiv = '';

   var currentDate = getCurrentTime();


    var results = response.rows[0].elements;


    THE_MINUTES = parseInt(results[0].duration.text);
    var currentDate = getCurrentTime();


    TOTAL_DISTANCE = "Toal Distance: " + results[0].distance.text;
    console.log(TOTAL_DISTANCE);
    ESTIMATED_TIME = "Estimated Arrival Time: " + currentDate + "  (about "+results[0].duration.text + ")";
    console.log(ESTIMATED_TIME);

    THE_COST = Math.round(THE_COST*100)/100;
    OUTPUT_COST = "The Estimated Cost: $" + THE_COST;
    console.log(OUTPUT_COST);

    if(DESTINATION_COST)
    {
      var cost = parseFloat(results[0].distance.text) * 1.75 + 1.90;
      THE_COST = cost;
    }


    var contentString = TOTAL_DISTANCE + "<br>" + ESTIMATED_TIME + "<br>" + OUTPUT_COST;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
   
   infowindow.open(MAP, CURRENT_MARKER);

   if(DESTINATION_COST)
   {
      closeInfoWindow(infowindow);
      DESTINATION_COST = false;
   }

       
 }
}

function closeInfoWindow(infowindow) 
{
      if (infowindow !== null) 
      {
          google.maps.event.clearInstanceListeners(infowindow); 
          infowindow.close();
          infowindow = null;
      }
}

var QueueToServer = function(currentTaxiNumber, currentLat, currentLong, currentDest, currentNum)
{
  $.get("http://ezriderapp.com/sendMail?", {
    num: currentNum, 
    current_lat: currentLat,
    current_long: currentLong,
    destination: currentDest,
    taxi_number: currentTaxiNumber 
  })
  .done(function() {
  })
  .error(function(xhr, ajaxOptions, thrownError) {
      alert("Track add failed\nError code: " + xhr.status + " " + thrownError);

  })
}

function EstimateCost() {
 var service = new google.maps.DistanceMatrixService();
 service.getDistanceMatrix(
   {
     origins:[istPosition],
     destinations: [address],
     travelMode: google.maps.TravelMode.DRIVING,
     unitSystem: google.maps.UnitSystem.IMPERIAL,
     avoidHighways: false,
     avoidTolls: false
   }, callback);
}


function getCurrentTime(){

  var currentDate = new Date();

  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();

  while(minutes + THE_MINUTES > 59)
  {
    hours++;
    minutes -= 60;
  }

  minutes+= THE_MINUTES;

  if(minutes < 10)
    minutes = "0" + minutes;
  if(hours > 12)
  {
    hours = hours - 12;
  }

  return hours+":"+minutes;

}
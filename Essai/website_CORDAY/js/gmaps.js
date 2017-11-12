function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(46.969148, 8.593011),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    size();
}

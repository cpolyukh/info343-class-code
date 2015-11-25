

$(function () {
    'use strict';

    var loc = [47.6097, -122.3331];
    var zoom = 11;

    //Creates the map that takes up the entirety of the web page and allow all other functions to work
    var map = L.map('map').setView(loc, zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    //Variable storing currently displayed markers
    var markers = new L.FeatureGroup();

    //This function adds markers to the page depending on the string passed in. Initially when the page is first
    //created, this is an empty string to demonstrate that all results should be displayed.
    function updateMarkers(stringToFind) {

        var jsonUrl = 'https://data.seattle.gov/resource/65fc-btcc.json';
        var numSDOT = 0;
        var numWSDOT = 0;

        if (stringToFind !== "") {
            map.removeLayer(markers);
            markers.clearLayers();
        }

        $.getJSON(jsonUrl).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var currentData = data[i];

                //Variables containing necessary information about each camera
                var location = currentData.location;
                var longitude = parseFloat(location.longitude);
                var latitude = parseFloat(location.latitude);
                var imageUrl = currentData.imageurl;
                var url = imageUrl.url;
                var ownershipCd = currentData.ownershipcd;
                var cameraLabel = currentData.cameralabel;
                var currentImageLocation = [latitude, longitude];
                var marker;

                //Determines whether the camera belongs to SDOT or WSDOT and styles it appropriately
                if (String(cameraLabel).toUpperCase().indexOf(stringToFind.toUpperCase()) != -1) {
                    if (ownershipCd === "SDOT") {
                        marker = L.circleMarker(currentImageLocation, {
                            fillColor: "#FF0000",
                            color: "#FF0000",
                            fillOpacity: 0.6
                        });
                        numSDOT++;
                    } else {
                        marker = L.circleMarker(currentImageLocation, {
                            fillColor: "#008000",
                            color: "#008000",
                            fillOpacity: 0.6
                        });
                        numWSDOT++;
                    }
                    //Adds marker to map
                    marker.addTo(map).bindPopup('<h3>' + cameraLabel + '</h3>' + '<img src=' + url + ' alt="location image" width="250px">');
                    markers.addLayer(marker);
                }
            }

            map.addLayer(markers);

            //Updates header
            $('#SDOT-num').text(numSDOT);
            $('#WSDOT-num').text(numWSDOT);
        });
    }

    //initial display of markers on screen
    updateMarkers("");

    var searchTerm = "";

    //Searches for given string any time the user types into the textbox and clicks "Search"
    $('#search-button').click(function() {
        searchTerm = $("#input").val();
        updateMarkers(searchTerm);
    });


});
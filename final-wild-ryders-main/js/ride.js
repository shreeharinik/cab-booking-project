var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function rideScopeWrapper($) {

    // === REQUEST FUNCTION ===
    function requestUnicorn(pickupLocation) {
        console.log("Requesting unicorn at:", pickupLocation);

        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {}, // No auth header
            data: JSON.stringify({
                PickupLocation: {
                    Latitude: pickupLocation.latitude,
                    Longitude: pickupLocation.longitude
                }
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    // === HANDLE REQUEST COMPLETION ===
    function completeRequest(result) {
        var unicorn = result.Unicorn || { Name: 'Twilight', Color: 'Silver', Gender: 'Female' };
        var pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';

        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
        animateArrival(function () {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', true).text('Set Pickup');
        });
    }

    // === UPDATE WHEN MAP POINT IS PICKED ===
    function handlePickupChanged() {
        console.log("Pickup location selected!");
        var requestButton = $('#request');
        requestButton.text('Request Unicorn');
        requestButton.prop('disabled', false);
    }

    // === HANDLE BUTTON CLICK ===
    function handleRequestClick(event) {
        event.preventDefault();
        var pickupLocation = WildRydes.map.selectedPoint;
        if (!pickupLocation) {
            alert("Please click on the map to set a pickup location first!");
            return;
        }
        requestUnicorn(pickupLocation);
    }

    // === SIMPLE ARRIVAL ANIMATION ===
    function animateArrival(callback) {
        var dest = WildRydes.map.selectedPoint;
        var origin = {
            latitude: WildRydes.map.extent.minLat,
            longitude: WildRydes.map.extent.minLng
        };

        WildRydes.map.animate(origin, dest, callback);
    }

    // === DISPLAY STATUS UPDATES ===
    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }

    // === INITIAL SETUP ON PAGE LOAD ===
    $(function onDocReady() {
        console.log("Ride.js loaded and ready");
        $('#request').click(handleRequestClick);
        $(WildRydes.map).on('pickupChange', handlePickupChanged);

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

}(jQuery));

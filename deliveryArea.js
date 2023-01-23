let checkDelivery;

checkDelivery.inputField = document.getElementById('check-delivery-input');
checkDelivery.deliveryOverlay = document.getElementById('delivery-overlay');
checkDelivery.deliveryResponse = document.getElementById('delivery-response');
checkDelivery.deliveryText = document.getElementById('delivery-text');
checkDelivery.mapContainer = document.getElementById('map-container');
checkDelivery.setAddressBtn = document.getElementById('set-address-btn');

checkDelivery.autocompleteOptions = {
    fields: ["address_components"],
    componentRestrictions: { country: 'us' },
    types: ['geocode']
};

function showDeliveryModal() {
    checkDelivery.deliveryOverlay.classList.add('active');
}
// Initialize AutoComplete on Address Field
function initDeliveryAreaMap() {
    checkDelivery.autocomplete = new google.maps.places.Autocomplete(checkDelivery.inputField, checkDelivery.autocompleteOptions);
    checkDelivery.autocomplete.addListener('place_changed', function() {
        lookUpServiceArea();
    });
}

const addressSave = {};
// Look up Service Areas to see if address matches api
function lookUpServiceArea() {
    let stateMatch = false;
    let cityMatch = false;
    let zipMatch = false;
    let stateId = "";
    let cityFee = "";
    let zipFee = "";
    let cityMinimumOrder;
    let zipMinimumOrder;
    let cityMinimumOrderText = "";
    let zipMinimumOrderText = "";
    
    let placeResult = checkDelivery.autocomplete.getPlace();
    let addressComponents = placeResult.address_components;
    let number = "";
    let street = "";
    let city = "";
    let stateShort = "";
    let stateLong = "";
    let postal = "";

    let fullAddress = checkDelivery.inputField.value;
    
    for (let i = 0; i < addressComponents.length; i++) {
        var addressType = addressComponents[i].types[0];
        switch(addressType) {
            case "route":
                street = addressComponents[i]["long_name"];
                break;
            case "street_number":
                number = addressComponents[i]["long_name"];
                break;
            case "postal_code" :
                postal = addressComponents[i]["long_name"];
                break;
            case "locality" :
                city = addressComponents[i]["long_name"];
                break;
            case "administrative_area_level_1" :
                stateShort = addressComponents[i]["short_name"];
                stateLong = addressComponents[i]["long_name"];
                break;
        }
    }
    
    addressSave.number = number;
    addressSave.street = street;
    addressSave.city = city;
    addressSave.stateShort = stateShort;
    addressSave.stateLong = stateLong;
    addressSave.postal = postal;
    
    stateAreas.forEach((stateAreas) => {
        if (stateAreas.name.toLowerCase() == stateShort.toLowerCase() || stateAreas.name.toLowerCase() == stateLong.toLowerCase()) {
            stateMatch = true;
            stateId = stateAreas.id;
        }
    });
    
    cityAreas.forEach((cityAreas) => {
        if (cityAreas.name.toLowerCase() == city.toLowerCase() && cityAreas.stateid == stateId) {
            cityMatch = true;
            cityFee = Number(cityAreas.travel_fee);
            cityMinimumOrder = Number(cityAreas.minimum_order);
            if (cityMinimumOrder != "") {
                cityMinimumOrderText = `, but we require a minimum order of $${cityMinimumOrder}`;
            }
        }
    });
    
    zipAreas.forEach((zipAreas) => {
        if (zipAreas.name.toLowerCase() == postal.toLowerCase()) {
            zipMatch = true;
            zipFee = Number(zipAreas.travel_fee);
            zipMinimumOrder = Number(zipAreas.minimum_order);
            if (zipMinimumOrder != "") {
                zipMinimumOrderText = `, but we require a minimum order of $${zipMinimumOrder}`;
            }
        }
    });
    
    let mapText;
    let showSetAddress = true;
    setAddressBtn.innerText = 'Set as Event Address';
    checkDelivery.deliveryText.innerHTML = '';
    
    if(stateMatch && cityMatch && zipMatch) {
        if (zipFee == 0) {
            mapText = `
                <p>We offer free delivery to ${city}, ${stateShort} ${postal}${zipMinimumOrderText}</p>
            `;
        } else {
            mapText = `
                <p>Yes, we deliver to ${city}, ${stateShort} ${postal} for $${zipFee}${zipMinimumOrderText}</p>
            `; 
        }
    } else if (stateMatch && cityMatch) {
        if (cityFee == 0) {
            mapText = `
                <p>We offer free delivery to ${city}, ${stateShort}${cityMinimumOrderText}</p>
            `;
        } else {
            mapText = `
                <p>Yes, we deliver to ${city}, ${stateShort} for $${cityFee}${cityMinimumOrderText}</p>`; 
        }
    } else {
        mapText = `
            <p>Sorry, we do not deliver to ${city}, ${stateShort}</p>
        `;
        showSetAddress = false;
    }
    
    let addressLatLng;    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=AIzaSyDsJNERGCxEar-aaRb1xvO_XjFpD1lDhEk`)
        .then((response) => {
            return response.json();
        }).then(jsonData => {
            addressLatLng = jsonData.results[0].geometry.location;
            initMap();
        })
        .catch(error => {
            console.log(error);
        })
        
    function initMap() {
        let map = new google.maps.Map(mapContainer, {
        center: addressLatLng,
        zoom: 14,
        });
        
        map.setOptions({gestureHandling: "none", streetViewControl: false, zoomControl: false, fullscreenControl: false, mapTypeControl: false, keyboardShortcuts: false, clickableIcons: false});
        
        const infowindow = new google.maps.InfoWindow({
            content: mapText,
            ariaLabel: "Delivery Map",
        });
        
        const marker = new google.maps.Marker({
            position: addressLatLng,
            map,
        });
        
        infowindow.open({
            anchor: marker,
            map,
        });
        
        if (showSetAddress) {
            checkDelivery.setAddressBtn.classList.add('active');
        }
        
        checkDelivery.deliveryResponse.classList.add('active');
        checkDelivery.mapContainer.classList.add('active');
    }
}

function saveAddress() {
    localStorage.setItem('addressSave', JSON.stringify(addressSave));
    checkDelivery.setAddressBtn.innerText = 'Address Set';
}

function clearDeliveryModel() {
    checkDelivery.deliveryText.innerHTML = ``;
    checkDelivery.mapContainer.innerHTML = ``;
    checkDelivery.mapContainer.classList.remove('active');
    checkDelivery.setAddressBtn.classList.remove('active');
    checkDelivery.deliveryResponse.classList.remove('active');
    checkDelivery.inputField.value = "";
}

checkDelivery.deliveryOverlay.addEventListener('click', function(event) {
  const isOutside = !event.target.closest('.delivery-modal-wrapper');
  if (isOutside) {
    checkDelivery.deliveryOverlay.classList.remove('active');
    clearDeliveryModel();
  }
})
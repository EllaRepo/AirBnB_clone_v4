const $ = window.$;
$(document).ready(function () {
  const myAmenities = {};
  let myList = [];
  const checkbox = $('.amenities input[type="checkbox"]');
  checkbox.prop('checked', false);
  checkbox.change(function () {
    const dataId = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    if (this.checked) {
      myAmenities[dataId] = dataName;
    } else {
      delete (myAmenities[dataId]);
    }
    for (const key in myAmenities) {
      myList.push(myAmenities[key]);
    }
    const output = myList.join(', ');
    $('div.amenities > h4').text(output);
    myList = [];
  });

  const apiStatus = $('div#api_status');
  const url = 'http://' + window.location.hostname;
  $.get(url + ':5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });

  $.ajax({
    url: url + ':5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('section.places').append(data.map(place => {
        return `<article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">
                            ${place.price_by_night}
                        </div>
                    </div>
                    <div class="information">
                        <div class="max_guest">
                            <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                            </br>
                            ${place.max_guest} Guests
                        </div>
                        <div class="number_rooms">
                            <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                            </br>
                            ${place.number_rooms} Bedrooms
                        </div>
                        <div class="number_bathrooms">
                            <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                            </br>
                            ${place.number_bathrooms} Bathrooms
                        </div>
                    </div>
                    <div class="description">
                        ${place.description}
                    </div>
                </article>`;
      }));
    }
  });
});

const $ = window.$;
$(document).ready(function () {
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
    success: appendPlaces
  });

  const amenities = {};
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    }
  });

  const states = {};
  $('.locations > ul > h2 > input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(locations).join(', '));
    }
  });

  const cities = {};
  $('.locations > ul > ul > li input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(locations).join(', '));
    }
  });

  $('button').click(function () {
    $.ajax({
      url: url + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        states: Object.keys(states),
        cities: Object.keys(cities),
        amenities: Object.keys(amenities)
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: appendPlaces
    });
  });

  setTimeout(function () {
    $('.reviews span').click(function () {
      if ($(this).text() === 'show') {
        const placeId = $(this).attr('data-id');
        const myReviews = $.ajax(url + ':5001/api/v1/places/' + placeId + '/reviews');
        const review = $(this);
        let myUser;
        myReviews.done(function (data) {
          for (let i = 0; i < data.length; i++) {
            myUser = $.ajax(url + ':5001/api/v1/users/' + data[i].user_id);
            myUser.done(function (userData) {
              let date = new Date(data[i].created_at);
              date = date.getDate() + 'th ' + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
              review.parent().find('ul').append('<li><h3>From ' + userData.first_name + ' ' + userData.last_name + ' the ' + date + '</h3><p>' + data[i].text + '</p></li>');
            });
          }
        });
        review.parent().find('ul').append('<li><h3>From Eliab Erango the 9th October, 2023 </h3><br><p>Fantastic place. It was clean, Adrienne was great (eventhough we did not meet in person) and everything went super smooth. Location is also greate if you like running and something a bit more quiet. I would suggest a car or take into consideration that you might have to Uber into the city from the location. Overall, would recommend the place anytime. </p></li>');
        $(this).text('hide');
      } else {
        $(this).text('show');
        $(this).parent().find('ul').empty();
      }
    });
  }, 1000);
});

function appendPlaces (data) {
  $('section.places').empty();
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
                  <div class="reviews">
                    <h2> Reviews </h2> <span data-id="${place.id}">show</span>
                    <ul> </ul>
                  </div>
              </article>`;
  }));
}

const $ = window.$;
$(document).ready(function () {
  const amenities = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenities).join(', '));
  });

  const apiStatus = $('div#api_status');
  const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  $.get(url, function (data) {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });
});

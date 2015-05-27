//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).ready(function(){

  //display car make selection
  $.ajax({
      type: "GET",
      url: "http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&state=new&api_key=scgz9esm95u72e7rh8mv5kyz",
      dataType: "jsonp",
      success: function(data) {
        var makeArray = data.makes;
        console.log(data.makes);
        $.each(makeArray, function(index, value) {
          $('#car_make').append('<option value="' + value.niceName + '">' + value.name + '</option>');
        });
      }
  });
  //display car model selection
  $(document).on('change', '#car_make', function() {
    retrieve_model(this.value);
  });

  function retrieve_model(make) {
    $.get('https://api.edmunds.com/api/vehicle/v2/' + make + '/models?fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var modelArray = data.models;
      console.log(data.models);
      $('#car_model').empty();
      $.each(modelArray, function(index, value) {
        $('#car_model').append('<option value="' + value.niceName + '">' + value.name + '</option>');
      });
    });
  }
  //display car model year selection
  $(document).on('change', '#car_model', function(){
    var make = $('#car_make').val();
    retrieve_years(make, this.value);
  });

  function retrieve_years(make, model) {
    $.get('https://api.edmunds.com/api/vehicle/v2/:'+make+'/:'+model+'/years?fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var yearsArray = data.years;
      console.log(data.years);
      console.log('hi');
      $('car_year').empty();
      $.each(yearsArray, function(index, value) {
        $('#car_year').append('<option>' + value.year + '</option>');
      });
    });
  }

});

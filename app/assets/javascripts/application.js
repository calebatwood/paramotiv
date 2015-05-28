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
      var yearArray = data.years;
      console.log(data.years);
      $('car_year').empty();
      $.each(yearArray, function(index, value) {
        $('#car_year').append('<option value="' + value.year + '">' + value.year + '</option>');
      });
    });
  }
  //display car model style selection
  $(document).on('change', '#car_year', function(){
    var make = $('#car_make').val();
    var model = $('#car_model').val();
    retrieve_styles(make, model, this.value);
  });

  function retrieve_styles(make, model, year) {
    $.get('https://api.edmunds.com/api/vehicle/v2/:'+make+'/:'+model+'/'+year+'/styles?fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var styleArray = data.styles;
      console.log(data.styles);
      $('car_style').empty();
      $.each(styleArray, function(index, value) {
        // $('#car_style').append('<option value="' + value.name + '">' + value.name + '</option>');
        $('#car_style').append($('<option>', {value: value.name, id: value.id, text: value.name}));
      });
    });
  }
  //obtain style_id
  $(document).on('change', '#car_style', function(){
    console.log('hi');
    var style_id = $('#car_style :selected').prop('id');
    $('#car_style_id').val(style_id);
  });

  //locate nearest dealer
  $('.btn-success').on('click', function(){
    console.log('hi');
    $(this).addClass('dealer');
    var zip = $('.dealer').attr('data');
    var make = $('.dealer').attr('value');
    nearest_dealer(zip, make);
  });

  function nearest_dealer(zip, make) {
    $.get('http://api.edmunds.com/api/dealer/v2/dealers/?zipcode='+zip+'&radius=30&make='+make+'&state=new&pageNum=1&pageSize=1&sortby=distance%3AASC&view=basic&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      console.log(data);
      console.log(data.dealers[0].name);
      console.log(data.dealers[0].address.street);
      console.log(data.dealers[0].address.city);
      console.log(data.dealers[0].address.stateCode);
      console.log(data.dealers[0].address.zipcode);
      console.log(data.dealers[0].contactInfo.phone);
      console.log(data.dealers[0].contactInfo.website);
      var name = (data.dealers[0].name);
      var street = (data.dealers[0].address.street);
      var city = (data.dealers[0].address.city);
      var state = (data.dealers[0].address.stateCode);
      var zip = (data.dealers[0].address.zipcode);
      var phone = (data.dealers[0].contactInfo.phone);
      var site = (data.dealers[0].contactInfo.website);
      $('td.dealer').removeClass('dealer');
      $('#dealer').append('<div class="well dealership"><h3>'+name+'</h3><h4>'+street+'</h4><h4>'+city+' ,'+state+' '+zip+'</h4><p>Phone: '+phone+'</p></div>');
    });

  }



});

//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require turbolinks
//= require_tree .

$(document).ready(function(){

  $('#my_garage').hide();
  $('nav').hide();

  //show home
  $('.h').on('click', function(){
    $('#welcome').show();
    $('nav').hide();
    $('#my_garage').hide();
  });
  //show garage
  $('.g').on('click', function(){
    $('#welcome').hide();
    $('#my_garage').show();
    $('nav').show();
  });

  $('.title').on('click', function(){
    $('#welcome').hide();
    $('#my_garage').show();
    $('nav').show();
  });
  //hide user registration and auth
  $('#auth').css('visibility', 'hidden');
  $('#register').css('visibility', 'hidden');

  //show user registration and auth
  $('#noob').on('click', function(){
    $('#register').css('visibility', 'visible');
  });

  $('#return').on('click', function(){
    $('#auth').css('visibility', 'visible');
  });


  //display car make selection
  $.ajax({
      type: "GET",
      url: "https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&state=new&api_key=scgz9esm95u72e7rh8mv5kyz",
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
        $('#car_style').append($('<option>', {value: value.name, id: value.id, text: value.name}));
          console.log(value.year);
          //obtain model_year_id
          var array = [];
          array.push(value.year);
          console.log(array[0].id);
          $('#car_model_year_id').val(array[0].id);
      });
    });
  }
  //obtain style_id
  $(document).on('change', '#car_style', function(){
    var style_id = $('#car_style :selected').prop('id');
    $('#car_style_id').val(style_id);
  });

  //locate nearest dealer
  $('#garage').on('click', '.nearest', function(){
    if ($(this).hasClass('dealer')) {
      $(this).removeClass('dealer');
      $('#garage .btn').css('background-color', '#b1ffe0');
      $('.service_schedule').remove();
      $('.recall_list').remove();
      $('.close_dealers').remove();
      $('.trade_in_values').remove();
    } else {
      $('#garage .btn').css('background-color', '#b1ffe0');
      $(this).css('background-color', 'rgba(214, 255, 224, 0.6)');
      $(this).addClass('dealer');
      $('#garage .close_dealers').remove();
      $(this).closest('.row').append('<div class="col-xs-12 close_dealers"></div>');
      var zip = $('.dealer').attr('data');
      var make = $('.dealer').attr('value');
      nearest_dealer(zip, make);
      $('.service_schedule').remove();
      $('.recall_list').remove();
      $('.trade_in_values').remove();
    }
  });

  function nearest_dealer(zip, make) {
    $.get('https://api.edmunds.com/api/dealer/v2/dealers/?zipcode='+zip+'&radius=30&make='+make+'&state=new&pageNum=1&pageSize=3&sortby=distance%3AASC&view=basic&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var name = (data.dealers[0].name);
      var street = (data.dealers[0].address.street);
      var city = (data.dealers[0].address.city);
      var state = (data.dealers[0].address.stateCode);
      var zip = (data.dealers[0].address.zipcode);
      var phone = (data.dealers[0].contactInfo.phone);
      var site = (data.dealers[0].contactInfo.website);
      var mon = (data.dealers[0].operations.Monday);
      var tue = (data.dealers[0].operations.Tuesday);
      var wed = (data.dealers[0].operations.Wednesday);
      var thur = (data.dealers[0].operations.Thursday);
      var fri = (data.dealers[0].operations.Friday);
      var sat = (data.dealers[0].operations.Saturday);
      var sund = (data.dealers[0].operations.Sunday);

        $('.close_dealers').append('<div class="dealership"><div class="col-xs-12 col-md-4 col-md-offset-4"><h3>'+name+'</h3><br><h4>'+street+'</h4><h4>'+city+', '+state+' '+zip+'</h4><h4>Phone: '+phone+'</h4><br></div><div class="col-xs-12 col-md-4"><h4><em>Hours of operation<em></h4><p>Monday:  '+mon+'</p><p>Tuesday:  '+tue+'</p><p>Wednesday:  '+wed+'</p><p>Thursday:  '+thur+'</p><p>Friday:  '+fri+'</p><p>Saturday:  '+sat+'</p><p>Sunday:  '+sund+'</p></div></div>');

    });
  }

  //get trade-in value
  $('#garage').on('click', '.btn-danger', function(){
    if ($('.btn-danger').hasClass('trade')){
      $(this).removeClass('trade');
      $('#garage .btn').css('background-color', '#b1ffe0');
      $('.tmv').remove();
      $('.service_schedule').remove();
      $('.recall_list').remove();
      $('.trade_in_values').remove();
      $('.close_dealers').remove();

    } else {
      $('#garage .btn').css('background-color', '#b1ffe0');
      $(this).css('background-color', 'rgba(214, 255, 224, 0.6)');
      $(this).addClass('trade');
      $(this).closest('.row').append('<div class="col-md-4 col-md-offset-8 col-xs-12 trade_in_values"></div>');
      var mileage = $('.trade').data('mileage');
      $('.trade_in_values').append('<div class="trade_form"><h6>Condition</h6><select class="form-control condition"><option disabled selected>Select Condition</option><option>Outstanding</option><option>Clean</option><option>Average</option><option>Rough</option><option>Damaged</option></select><h6>Mileage</h6><input type="text" class="form-control mileage" value="'+mileage+'"><div class="btn btn-default">Calculate True Market Value</div></div>');
      $('.trade_in_values').css('visibility', 'visible');
      $('.service_schedule').remove();
      $('.recall_list').remove();
      $('.close_dealers').remove();

    }
    $('#garage').on('click', '.btn-default', function(){
      console.log('hey');
      var styleid = $('.trade').attr('value');
      var condition = $('.condition').val();
      var mileage = $('.mileage').val();
      var zip = $('.trade').data('zip');
      market_value(styleid, condition, mileage, zip);

    });
  });



  function market_value(styleid, condition, mileage, zip) {
    $.get('https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid='+styleid+'&condition='+condition+'&mileage='+mileage+'&zip='+zip+'&fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var private_party = (data.tmv.totalWithOptions.usedPrivateParty);
      var retail = (data.tmv.totalWithOptions.usedTmvRetail);
      var trade_in = (data.tmv.totalWithOptions.usedTradeIn);
      $('.tmv').remove();
      $('.trade_in_values').append('<div class="tmv"><h3>Private Sale: $'+private_party+'</h3><h3>Trade In: $'+trade_in+'</h3><h3>Retail: $'+retail+'</h3></div>');
    });
  }

  //get maintenance schedule buttons
  $('#garage').on('click', '.btn-primary', function(){
    if ($(this).hasClass('maintenance')){
      $(this).removeClass('maintenance');
      $('#garage .btn').css('background-color', '#b1ffe0');
      $('.service_schedule').remove();
      $('.recall_list').remove();
      $('.close_dealers').remove();
      $('.trade_in_values').remove();
    } else {
      $('#garage .btn').css('background-color', '#b1ffe0');
      $(this).css('background-color', 'rgba(214, 255, 224, 0.6)');
      $(this).addClass('maintenance');
      $('#garage .service_schedule').remove();
      $(this).closest('.row').append('<div class="col-xs-12 service_schedule"></div>');
      var model_year_id = $('.maintenance').attr('value');
      maintenance_schedule(model_year_id);
      $('.recall_list').remove();
      $('.close_dealers').remove();
      $('.trade_in_values').remove();
    }
  });

  function maintenance_schedule(model_year_id) {
    $.get('https://api.edmunds.com/v1/api/maintenance/actionrepository/findbymodelyearid?modelyearid='+model_year_id+'&fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
        var mileageArray = [];
        var itemArray = [];
        var actionArray = [];
          $.each(data.actionHolder, function(index, value) {
            var mileage = value.intervalMileage;
            var item = value.item;
            var action = value.action;
            mileageArray.push(mileage);
            itemArray.push(item);
            actionArray.push(action);
          });

        match_arrays(mileageArray, itemArray, actionArray);
    });
  }

  function match_arrays(mileageArray, itemArray, actionArray) {
    var groupArray = [];
      for(i=0;i < itemArray.length; i++){
        var shiftArray = [];
        var mileage = mileageArray.shift();
        shiftArray.push(mileage);
        var action = actionArray.shift();
        shiftArray.push(action);
        var item = itemArray.shift();
        shiftArray.push(item);
        groupArray.push(shiftArray);
      }
    // console.log(groupArray);
    var buttonArray = [];
    $.each(groupArray, function(index, value){
      buttonArray.push(value[0]);
      // var service = value[0]+' '+value[1]+' '+value[2];
      // $('#maintenance').append('<p>'+service+'</p>');
    });
    // console.log(buttonArray);

    var unique = buttonArray.filter(function(item, i, ar) {
      return ar.indexOf(item) === i;
    });
    //sort unique array by ascending mileage
      var sorted = unique.sort(function(a, b){
        return a - b;
      });

      //make unique dynamic
      $.each(sorted, function(index, value){
        var miles = $('.maintenance').data('mileage');
        if (miles < value && value < 200000) {
        $('.service_schedule').append('<div class="col-xs-12 col-md-3 main" value="'+value+'"><h3>At '+value+' Miles</h3></div>');
        }
        // console.log(value);
        $.each(groupArray, function(index, val){
          // console.log(val[0]);
          if (val[0] == value) {
            $('.main[value="'+value+'"]').append('<p>'+val[1]+':  '+val[2]+'</p>');
              var seen = {};
              $('.main[value="'+value+'"] p').each(function() {
                  var service = $(this).text();
                  if (seen[service])
                      $(this).remove();
                  else
                      seen[service] = true;
              });
          }
        });
      });
  }

  //find recalls
  $('#garage').on('click', '.find_recalls', function(){
    if ($(this).hasClass('recall')) {
      $(this).removeClass('recall');
      $('#garage .btn').css('background-color', '#b1ffe0');
      $('.recall_list').remove();
      $('.service_schedule').remove();
      $('.close_dealers').remove();
      $('.trade_in_values').remove();
    } else {
      $('#garage .btn').css('background-color', '#b1ffe0');
      $(this).css('background-color', 'rgba(214, 255, 224, 0.6)');
      $(this).addClass('recall');
      $(this).closest('.row').append('<div class="col-xs-12 recall_list"></div>');
      var model_year_id = $('.recall').attr('value');
      retrieve_recalls(model_year_id);
      $('.service_schedule').remove();
      $('.close_dealers').remove();
      $('.trade_in_values').remove();
    }
  });
  function retrieve_recalls(model_year_id) {
    $.get('https://api.edmunds.com/v1/api/maintenance/recallrepository/findbymodelyearid?modelyearid='+model_year_id+'&fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data){
      console.log(data.recallHolder.length);
      if (data.recallHolder.length === 0) {
        $('.recall_list').append('<div class="col-xs-12 col-md-6 col-md-offset-3"><h3>There are no recalls for your vehicle at this time.</h3></div>');
      } else {
        $.each(data.recallHolder, function(index, value){
          var comp = value.componentDescription;
          var desc = value.defectDescription;
          var conseq = value.defectConsequence;
          var action = value.defectCorrectiveAction;
          var affected = value.numberOfVehiclesAffected;
          var date = value.ownerNotificationDate;
          console.log(comp);
          $('.recall_list').append('<div class="col-xs-12 col-md-4 recall_info"><h5>COMPONENT / '+comp+'</h5><h5>'+desc+'</h5><h5>'+conseq+'</h5><h5>'+action+'</h5><h5>'+affected+' VEHICLES AFFECTED</h5><h5>DATE OF RECALL / '+date+'</h5></div>');
        });
      }
    });


  }
  //new car form
  $('.new_car').css('visibility', 'hidden');
  $('.new_car').css('height', '0px');

  $('.new_cars').on('click', function(){
    $('.btn-info').css('background-color', 'rgba(214, 255, 224, 0.6)');
    $('.btn-info').css('color', 'rgba(0, 0, 0, 0.5)');
    if($('.new_car').css('visibility', 'hidden')){
      $('.new_car').css('visibility', 'visible');
      $('.new_car').css('height', '100%');
    }
  });

  $('.cancel_new_car').on('click', function(){

    $('.btn-info').css('background-color', '#b1ffe0');
    $('.btn-info').css('color', 'rgba(0, 0, 0, 0.5)');
    $('.new_car').css('visibility', 'hidden');
    $('.new_car').css('height', '0px');
    $('#car_make').val('');
    $('#car_model').val('');
    $('#car_year').val('');
    $('#car_style').val('');
    $('#car_zip').val('');
    $('#car_mileage').val('');
    $('#car_style_id').val('');
    $('#car_model_year_id').val('');

  });

  //add car to garage
  $('.add_car').on('click', function(e){
    e.preventDefault();
    $('.btn-info').css('background-color', '#b1ffe0');
    $('.btn-info').css('color', 'rgba(0, 0, 0, 0.5)');
    var user = $('#my_garage').data('user_id');
    var make = $('#car_make').val();
    var model = $('#car_model').val();
    var year = $('#car_year').val();
    var style = $('#car_style').val();
    var zip = $('#car_zip').val();
    var mileage = $('#car_mileage').val();
    var style_id = $('#car_style_id').val();
    var model_year_id = $('#car_model_year_id').val();
    $.post('cars', { car: { make: make, model: model, year: year, style: style, mileage: mileage, style_id: style_id, model_year_id: model_year_id } } ).done(function(res){
      $('#garage').prepend(res);
      $('.new_car').css('visibility', 'hidden');
      $('.new_car').css('height', '0px');
      $('#car_make').val('Select vehicle make...');
      $('#car_model').val('Select vehicle model...');
      $('#car_year').val('Select vehicle year...');
      $('#car_style').val('Select vehicle style...');
      $('#car_mileage').val('Enter vehicle mileage...');
      $('#car_style_id').val('');
      $('#car_model_year_id').val('');
    });

  });

  //delete car from garage
  $('#garage').on('click', '.btn-warning', function(){
    var url = $(this).closest('.row').data('car-url');
    var row = $(this).closest('.row');

    $.ajax({
      type: "DELETE",
      url: url,
      success: function(){
        $(row).remove();
      }
    });
  });




});

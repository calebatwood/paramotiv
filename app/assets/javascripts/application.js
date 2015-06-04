//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require turbolinks
//= require_tree .

$(document).ready(function(){

  //hide trade-in form initially
  $('#trade').css('visibility', 'hidden');

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
  $('.btn-success').on('click', function(){
    $(this).addClass('dealer');
    var zip = $('.dealer').attr('data');
    var make = $('.dealer').attr('value');
    nearest_dealer(zip, make);
    $('.well.dealership').remove();
    $('.well.maintenance').remove();
    $('#trade').css('visibility', 'hidden');
  });

  function nearest_dealer(zip, make) {
    $.get('http://api.edmunds.com/api/dealer/v2/dealers/?zipcode='+zip+'&radius=30&make='+make+'&state=new&pageNum=1&pageSize=1&sortby=distance%3AASC&view=basic&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      console.log(data);
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
      $('td.dealer').removeClass('dealer');
      $('#dealer').append('<div class="well dealership"><a class="btn">Close</a><h4>'+name+'</h4><p>'+street+'</p><p>'+city+' ,'+state+' '+zip+'</p><p>Phone: '+phone+'</p><h4><em>Hours of operation<em></h4><p>Monday:'+mon+'</p><p>Tuesday: '+tue+'</p><p>Wednesday: '+wed+'</p><p>Thursday: '+thur+'</p><p>Friday: '+fri+'</p><p>Saturday: '+sat+'</p><p>Sunday: '+sund+'</p></div>');
      $('.dealership a').on('click', function(){
        $('.well.dealership').remove();
      });
    });
  }

  //get trade-in value
  $('.btn-danger').on('click', function(){
    console.log('hi');
    $(this).addClass('trade');
    $('#trade').css('visibility', 'visible');
    $('.well.dealership').remove();
    $('.well.maintenance').remove();
  });

  $('.btn-default').on('click', function(){
    var styleid = $('.trade').attr('value');
    var condition = $('.condition').val();
    var mileage = $('.mileage').val();
    var zip = $('.trade').attr('data');
    market_value(styleid, condition, mileage, zip);
  });

  function market_value(styleid, condition, mileage, zip) {
    $.get('https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid='+styleid+'&condition='+condition+'&mileage='+mileage+'&zip='+zip+'&fmt=json&api_key=scgz9esm95u72e7rh8mv5kyz', function(data) {
      var private_party = (data.tmv.totalWithOptions.usedPrivateParty);
      var retail = (data.tmv.totalWithOptions.usedTmvRetail);
      var trade_in = (data.tmv.totalWithOptions.usedTradeIn);
      $('#trade').append('<h3>Private Sale: $'+private_party+'</h3><h3>Trade In: $'+trade_in+'</h3><h3>Retail: $'+retail+'</h3>');
    });
  }

  //get maintenance schedule buttons
  $('.btn-primary').on('click', function(){
    $(this).addClass('maintenance');
    var model_year_id = $('.maintenance').attr('value');
    maintenance_schedule(model_year_id);
    $('.well.maintenance').remove();
    $('.well.dealership').remove();
    $('#trade').css('visibility', 'hidden');
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

        $('td.maintenance').removeClass('maintenance');

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
        $('#maintenance').append('<div class="well maintenance"><div class="btn btn-default main" value="'+value+'">'+value+'</div></div>');
      });

      $('.main').on('click', function(){
        var val = $(this).attr('value');
        $.each(groupArray, function(index, value){
          console.log(val);
          console.log(value[0]);
          if (value[0] == val){
            console.log('wahoo');
            $('.main[value="'+val+'"]').parent().append('<p>'+value[1]+': '+value[2]+'</p>');
            $('.main[value="'+val+'"]').hide();
          }
        });
        $('.well.maintenance p').on('click', function(){
          $('.maintenance p').hide();
          $('.main[value="'+val+'"]').show();
        });
        // $('.main[value="'+val+'"]').html('Close').on('click', function(){
        //   $('.maintenance p').hide();
        //   $(this).show();
        // });
      });
  }




});

$(document).on("ready", function() {

  Crypto.getTickers().success(function(response) {
    console.log(response);
    var rows = '';
    $.each(response, function (i, item) {

      $tr = '<tr data-symbol="' + item.symbol + '" data-id="' + item.id + '">';

      if (parseInt(item.percent_change_24h) > 0) {
        $td = '<td class="text-success">';
      } else {
        $td = '<td class="text-danger">';
      }

      rows += $tr + 
                  '<td>' + item.rank                                                          + '</td>' + 
                  '<td>' + item.name                                                          + '</td>' + 
                  '<td>' + numeral(item.market_cap_usd).format('$0,0')                        + '</td>' + 
                  '<td>' + numeral(item.price_usd).format('$0,0.00')                          + '</td>' + 
                  '<td>' + numeral(item["24h_volume_usd"]).format('$0,0')                     + '</td>' + 
                  '<td>' + numeral(item.available_supply).format('0,0') + ' ' + item.symbol   + '</td>' + 
                   $td   + numeral(item.percent_change_24h/100).format('0.00%')               + '</td>' + 
              '</tr>';
    });
    $('#ticker-table').append(rows);
  });


  $('#ticker-table').on('click', 'tbody tr', function(){
    console.log("click");
    var link = "https://coinmarketcap.com/currencies/" + $(this).data().id + "/";
    window.location.href = link;
  });
});

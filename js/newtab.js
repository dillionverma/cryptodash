$(document).on("ready", function() {
  db.get("watchlist", function(e) {
    if(!e) db.set("watchlist", []);
  })

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


  $.getJSON('../../js/tickers.json', function(d) {
    $('#crypto-select').select2(
      {data: d.results } 
    );
  })

  $('#crypto-select').on('select2:select', function (e) {
      var data = e.params.data;
      Crypto.watch(data.ticker_id);
  });

  $('#crypto-select').on('select2:unselect', function (e) {
      var data = e.params.data;
      Crypto.unwatch(data.ticker_id);
  });

});


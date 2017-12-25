var searchBarInput = $("#search");
var clearSearchBtn = $(".clearSearchBarField");

$(document).ready(function(){

  updateTable();
  searchBarInput.keyup(function() {
		if( $(this).val().length === 0 ) {
			clearSearchBtn.hide()
		} else {
			clearSearchBtn.show()
		}
	});
  clearSearchBtn.on('click', function() {
    $('#ticker-table tbody').empty();
    resetInput();
    updateTable();
  });

  $('#ticker-table').on('click', 'tbody tr', function(){
    console.log("click");
    var link = "https://coinmarketcap.com/currencies/" + $(this).data().id + "/";
    chrome.tabs.create({ url: link });
  });

});
       
function updateTable() {
  $.get("https://api.coinmarketcap.com/v1/ticker/?limit=500").done(function(response) {
    console.log(response);
    var rows = '';
    $.each(response, function (i, item) {
      $tr = '<tr data-symbol="' + item.symbol + '" data-id="' + item.id + '">';

      if (parseInt(item.percent_change_1h) > 0) {
        $td = '<td class="green-text">';
      } else {
        $td = '<td class="red-text">';
      }
      if (parseInt(item.percent_change_24h) > 0) {
        $td2 = '<td class="green-text">';
      } else {
        $td2 = '<td class="red-text">';
      }

      rows += $tr + 
                  '<td>' + item.rank                                                          + '</td>' + 
                  '<td>' + item.name                                                          + '</td>' + 
                  '<td>' + item.symbol                                                        + '</td>' + 
                  '<td>' + numeral(item.price_usd).format('$0,0.00[000]')                     + '</td>' + 
                   $td   + numeral(item.percent_change_1h/100).format('0.00%')                + '</td>' + 
                   $td2  + numeral(item.percent_change_24h/100).format('0.00%')               + '</td>' + 
              '</tr>';
    });
    $('#ticker-table tbody').append(rows);
    tableSearch();
  });
}

function tableSearch() {
  var $rows = $('#ticker-table tbody tr');
  $('#search').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
  });
}

function resetInput() {
	clearSearchBtn.hide();
	searchBarInput.val('').focus();
}

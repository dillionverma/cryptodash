var searchBarInput = $("#search");
var clearSearchBtn = $(".clearSearchBarField");
var refreshBtn = $("#refresh");


chrome.storage.sync.get("watchlist", function(vals) {
  if (Object.keys(vals).length === 0) {
    chrome.storage.sync.set({"watchlist": {}}, function(){});
  }
});

chrome.storage.sync.get("watchlist-switch", function(vals) {
  if (Object.keys(vals).length === 0) {
    chrome.storage.sync.set({"watchlist-switch": false}, function(){});
  }
});

$(document).ready(function(){
  $(".loader").fadeOut(600);
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

  refreshBtn.on('click', function() {
    $(".loader").fadeIn();
    $('#ticker-table tbody').empty();
    resetInput();
    $(".loader").fadeOut(600);
    updateTable();
  });

  $('#ticker-table').on('click', 'tbody tr td:nth-child(-n+6)', function(){
    var link = "https://coinmarketcap.com/currencies/" + $(this).data().id + "/";
    chrome.tabs.create({ url: link });
  });

});
       
function updateTable() {
  $.get("https://api.coinmarketcap.com/v1/ticker/?limit=500").done(function(response) {
    chrome.storage.sync.get("watchlist", function (d) {
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

        if (d.watchlist[item.name] == true) {
          $td3 = '<td><input type="checkbox" class="watchlist" checked="checked" id="' + item.name + '" /><label for="' + item.name + '"></label></td>' 
        } else {
          $td3 = '<td><input type="checkbox" class="watchlist" id="' + item.name + '" /><label for="' + item.name + '"></label></td>' 
        }

        rows += $tr + 
                    '<td>' + item.rank                                                          + '</td>' + 
                    '<td>' + item.name                                                          + '</td>' + 
                    '<td>' + item.symbol                                                        + '</td>' + 
                    '<td>' + numeral(item.price_usd).format('$0,0.00[000]')                     + '</td>' + 
                     $td   + numeral(item.percent_change_1h/100).format('0.00%')                + '</td>' + 
                     $td2  + numeral(item.percent_change_24h/100).format('0.00%')               + '</td>' +
                     $td3  +
                '</tr>';
      });
      $('#ticker-table tbody').append(rows);

      $('.watchlist').on('click', function() {
        var name = $(this)[0].id;
        console.log(name);
        chrome.storage.sync.get("watchlist", function(d) {
          var vals = d.watchlist;
          if (vals[name] == null) {
            vals[name] = true;
            chrome.storage.sync.set({"watchlist": vals}, function() {
              console.log("added");
            });
          } else if (vals[name] == true) {
            delete vals[name];
            chrome.storage.sync.set({"watchlist": vals}, function() {
              console.log("removed");
            });
          }
        });
      });

      tableSearch();
      watchlist();
    });
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


function watchlist() {
  var $checked = $('#ticker-table tbody tr td:nth-child(7)> .watchlist');
  var $rows = $('#ticker-table tbody tr');
  $('#watchlist-switch').on('click', function() {
    chrome.storage.sync.get("watchlist-switch", function(s) {
      chrome.storage.sync.set({"watchlist-switch": !s["watchlist-switch"]}, function() {
        if (s["watchlist-switch"] == true) {
          $rows.show();
        } else {
          $checked.each(function() {
            if ($(this)[0].checked == false) {
              $(this).parent().parent().hide();
            }
          });
        } 
      });
    });
  });
}


function resetInput() {
	clearSearchBtn.hide();
	searchBarInput.val('').focus();
}

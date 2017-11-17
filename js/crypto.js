class Crypto {

  static getTicker(ticker) {
    return $.get("https://api.coinmarketcap.com/v1/ticker/" + ticker + "/");
  }

  static getTickers() {
    return $.get("https://api.coinmarketcap.com/v1/ticker/?limit=100");
  }

  static watch(ticker) {
    db.get("watchlist", function(list) {
      list.push(ticker);
      db.set("watchlist", list);
    });
  }

  static unwatch(ticker) {
    db.get("watchlist", function(list) {
      list = list.filter(function(i) { 
        return i !== ticker;
      })
      db.set("watchlist", list); 
    });
  }

};


window.Crypto = Crypto;

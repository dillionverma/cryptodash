class Crypto {

  static getTicker(ticker) {
    return $.get("https://api.coinmarketcap.com/v1/ticker/" + ticker + "/");
  }

  static getTickers() {
    return $.get("https://api.coinmarketcap.com/v1/ticker/?limit=100");
  }

};


window.Crypto = Crypto;

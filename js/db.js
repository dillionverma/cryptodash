window.db = {
  set: function(key, value) {
    if (!key || !value) {return;}
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },
  get: function(key) {
    var value = localStorage.getItem(key);
    if (!value) {return localStorage}
    if (value[0] === "{" || value[0] === "[") {
      value = JSON.parse(value);
    }
    return value;
  },
  destroy: function() {
    localStorage.clear();
  }
}

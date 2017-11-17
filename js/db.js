window.db = {
  set: function(key, value) {
    if (!key || !value) {return;}
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    chrome.storage.sync.set({[key]: value});
  },
  get: function(key, callback) {
    chrome.storage.sync.get(key, function(obj) { 
      if (obj[key][0] === "{" || obj[key][0] === "[") {
        val = JSON.parse(obj[key]);
      }
      callback(val); 
    });
  },
  destroy: function() {
    chrome.storage.sync.clear();
  }
}

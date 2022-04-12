const BLOCKED_PATTERNS = [
  // REST calls for the list of conversations.
  'https://twitter.com/i/api/1.1/dm/inbox_initial_state.json*',
  // REST calls for the conversation timelines.
  'https://twitter.com/i/api/1.1/dm/conversation/*',
];

const validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
/* Random comment because the previous line confuses my editor's highlighting. */

function blockRequest(details) {
  console.log("Blocked: ", details.url);
  return {
    cancel: true
  };
}

function isValidPattern(urlPattern) {
  return !!urlPattern.match(validPattern);
}

function updateFilters(urls) {
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }

  var validPatterns = patterns.filter(isValidPattern);
  console.log('Valid patterns: ', validPatterns);

  if (patterns.length) {
    try{
      chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
        urls: validPatterns
      }, ['blocking']);
    } catch (e) {
      console.error(e);
    }
  }
}

function load(callback) {
  chrome.storage.sync.get('blocked_patterns', function(data) {
    callback(data['blocked_patterns'] || []);
  });
}

function save(newPatterns, callback) {
  patterns = newPatterns;
  chrome.storage.sync.set({
    'blocked_patterns': newPatterns
  }, function() {
    updateFilters();
    callback.call();
  });
}

load(function(p) {
  patterns = p;
  updateFilters();
});

save(BLOCKED_PATTERNS, () => {console.log('Loaded patterns'); })

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log(msg);
  });
});

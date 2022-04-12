const BLOCKABLE_PATTERNS = [
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

function blockMaskFromPatterns(patt) {
  const blockMask = [];
  for (let item of BLOCKABLE_PATTERNS) {
    blockMask.push(patt.includes(item) ? true : false);
  }
  return blockMask;
}

function patternsFromBlockMask(blockMask) {
  const newPatterns = [];
  for (let i = 0; i < BLOCKABLE_PATTERNS.length; i++) {
    if (blockMask[i]) {
      newPatterns.push(BLOCKABLE_PATTERNS[i]);
    }
  }
  return newPatterns;
}

load(function(p) {
  patterns = p;
  updateFilters();
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.event === 'update_blocked') {
      save(patternsFromBlockMask(msg.data), () => {});
    }
    if (msg.event === 'get_blocked') {
      port.postMessage({
        event: 'current_blocked',
        data: blockMaskFromPatterns(patterns),
      });
    }
  });
});

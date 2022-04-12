let port;

const initPopup = () => {
  const port = chrome.runtime.connect({ name: 'knockknock' });
  port.postMessage({
    event: 'poof',
    data: {  },
  });
};

initPopup();

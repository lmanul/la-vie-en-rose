let port;

const initPopup = () => {
  const port = chrome.runtime.connect({ name: 'knockknock' });
};

initPopup();

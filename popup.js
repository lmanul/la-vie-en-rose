let port;

const onCheckboxChanged = () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const blockMask = [];
  for (c of checkboxes) {
    blockMask.push(c.checked);
  }
  port.postMessage({
    event: 'update_blocked',
    data: blockMask,
  });
};

const initPopup = () => {
  port = chrome.runtime.connect({ name: 'knockknock' });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  console.log(checkboxes);
  for (c of checkboxes) {
    c.addEventListener('click', (e) => {
      onCheckboxChanged();
    });
  }

  port.postMessage({
    event: 'poof',
    data: {  },
  });
};

initPopup();

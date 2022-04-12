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

  port.postMessage({
    event: 'get_blocked',
  });
  port.onMessage.addListener(function(msg) {
    console.log(msg);
    if (msg.event === 'current_blocked') {
      for (let i = 0; i < msg.data.length; i++) {
        console.log(checkboxes[i]);
        checkboxes[i].checked = msg.data[i];
      }
    }
  });

  for (c of checkboxes) {
    c.addEventListener('click', (e) => {
      onCheckboxChanged();
    });
  }
};

initPopup();

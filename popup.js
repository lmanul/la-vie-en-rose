let port;

const onCheckboxChanged = () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  console.log(checkboxes);
};

const initPopup = () => {
  const port = chrome.runtime.connect({ name: 'knockknock' });

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

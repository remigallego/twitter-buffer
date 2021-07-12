let isOn = true;

const whenReady = () => {
  let onOffButton = document.getElementById("onoffbutton");
  onOffButton.addEventListener("click", async () => {
    isOn = !isOn;
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      chrome.tabs.sendMessage(tab[0].id, {
        message: "toggleOnOff",
        value: isOn,
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", whenReady);

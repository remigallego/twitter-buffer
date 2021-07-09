let onOffButton = document.getElementById("onOffButton");
let onOffText = document.getElementById("onOffText");
let secondsInput = document.getElementById("secondsInput");

onOffButton.addEventListener("click", async () => {
  let newState = onOffText.innerText === "ON" ? "OFF" : "ON";
  onOffText.innerText = newState;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, {
      message: "toggleOnOff",
      value: newState,
    });
  });
});

secondsInput.addEventListener("change", (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, {
      message: "changeSeconds",
      value: e.value,
    });
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.set("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

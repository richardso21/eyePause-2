const { ipcRenderer } = require("electron");
const { Timer } = require("easytimer.js");
const { getDuration, getSkips } = require("./timeStore");

const breakTimer = new Timer({ countdown: true });

window.onload = () => {
  const DOMSelectors = {
    timer: document.querySelector(".timer"),
    skip: document.querySelector(".skip"),
  };

  // disable skip button if no skips left
  if (getSkips() < 1) {
    DOMSelectors.skip.disabled = true;
    DOMSelectors.skip.style.borderColor = "#124747";
    DOMSelectors.skip.style.color = "#124747";
    DOMSelectors.skip.innerHTML =
      "You have used too many skips. Wait this one out...";
  } else {
    DOMSelectors.skip.innerHTML = `Skip (${getSkips()} skips left)`;
  }

  // start timer on window load
  breakTimer.start({ startValues: { minutes: getDuration() } });

  // invoke notification on timer complete
  breakTimer.on("targetAchieved", () => {
    ipcRenderer.invoke("breakDone");
  });

  // send signal to main listener if skipped
  DOMSelectors.skip.addEventListener("click", () => {
    ipcRenderer.invoke("breakSkip");
  });

  // update timer
  breakTimer.on("secondsUpdated", () => {
    DOMSelectors.timer.innerHTML = breakTimer.getTimeValues().toString();
  });
};

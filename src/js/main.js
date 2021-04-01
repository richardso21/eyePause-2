const DOMSelectors = {
  settingsToggle: document.querySelector(".settings"),
  toggler: document.querySelector("#toggler"),
  timer: document.querySelector(".timer"),
  meter: document.querySelector(".meter"),
  restart: document.querySelector(".restart"),
};
const preload = window.main;

// display initial time
DOMSelectors.timer.innerHTML = preload.getTimeString();

// update UI on timer status
preload.eachSecond(() => {
  // update counter on window
  DOMSelectors.timer.innerHTML = preload.getTimeString();
  // update meter
  DOMSelectors.meter.style.width = `${preload.getProgress() * 100}%`;
});

// pause/resume timer when toggled
DOMSelectors.toggler.addEventListener("click", () => {
  // toggle classes
  DOMSelectors.timer.classList.toggle("off-timer");
  DOMSelectors.meter.classList.toggle("off-meter");
  // choose method based on toggler state
  preload.toggleTimer(DOMSelectors.toggler.checked);
});

// reset timer when pressing restart button
DOMSelectors.restart.addEventListener("click", () => {
  preload.resetTimer();
  // turn UI to default state
  DOMSelectors.toggler.checked = true;
  DOMSelectors.timer.classList.remove("off-timer");
  DOMSelectors.meter.classList.remove("off-meter");
  DOMSelectors.timer.innerHTML = preload.getTimeString();
  DOMSelectors.meter.style.width = "100%";
});

// open settings pane when clicked
DOMSelectors.settingsToggle.addEventListener("click", () => {
  preload.createSettingsWindow();
});

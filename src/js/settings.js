const DOMSelectors = {
    interval: document.getElementById("interval"),
    duration: document.getElementById("duration"),
    save: document.getElementById("save-form"),
};
preload = window.settings;

const { int, dur } = preload.loadSettings();
console.log(int, dur);
DOMSelectors.interval.value = int;
DOMSelectors.duration.value = dur;

DOMSelectors.save.addEventListener("submit", () => {
    const newInt = DOMSelectors.interval.value;
    const newDur = DOMSelectors.duration.value;
    console.log(newInt, newDur);
    preload.saveSettings(newInt, newDur);
});

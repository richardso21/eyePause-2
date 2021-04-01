const { ipcRenderer, contextBridge } = require("electron");
const {
  getInterval,
  getDuration,
  setInterval,
  setDuration,
} = require("./timeStore");

contextBridge.exposeInMainWorld("settings", {
  loadSettings: () => ({ int: getInterval(), dur: getDuration() }),
  saveSettings: (int, dur) => {
    setInterval(int);
    setDuration(dur);
    ipcRenderer.invoke(
      "alert",
      "Settings Saved!",
      "New settings will be in affect on the next timer cycle."
    );
  },
});

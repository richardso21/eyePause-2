const { ipcRenderer, contextBridge } = require("electron");
const { Timer } = require("easytimer.js");
const { getInterval } = require("./timeStore");

const intTimer = new Timer({ countdown: true });

// start timer on window load (add listener)
intTimer.start({ startValues: { minutes: getInterval() } });

// restart timer to current time interval setting
function restartTimer(min = getInterval()) {
    intTimer.stop();
    intTimer.start({ startValues: { minutes: min } });
}

// invoke notification on timer complete
intTimer.on("targetAchieved", () => {
    ipcRenderer.invoke("startBreak");
});

// send break reminder notifications
intTimer.on("minutesUpdated", () => {
    const minute = intTimer.getTimeValues().minutes;
    if ([9, 4, 0].includes(minute))
        ipcRenderer.invoke(
            "alert",
            "Break Reminder",
            `You have ${minute + 1} minute${
                minute != 0 ? "s" : ""
            } left before your break!`
        );
});

// start timer after break is done
ipcRenderer.on("startNewCycle", () => restartTimer());

// expose functions to front-end renderer
contextBridge.exposeInMainWorld("main", {
    createSettingsWindow: () => ipcRenderer.invoke("createSettingsWindow"),
    getTimeString: () => intTimer.getTimeValues().toString(),
    eachSecond: (f) => intTimer.on("secondsUpdated", f),
    getProgress: () => {
        const { minutes, seconds } = intTimer.getTimeValues();
        const intTimerLength = intTimer.getConfig().startValues[2] * 60;
        return (minutes * 60 + seconds) / intTimerLength;
    },
    toggleTimer: (checked) => {
        if (checked) intTimer.start();
        else intTimer.pause();
    },
    resetTimer: () => restartTimer(),
});

const Store = require("electron-store");
const store = new Store({ defaults: { interval: 30, duration: 5, skips: 3 } });

exports.getInterval = () => store.get("interval");
exports.setInterval = (min) => store.set("interval", parseInt(min));
exports.getDuration = () => store.get("duration");
exports.setDuration = (min) => store.set("duration", parseInt(min));
exports.useSkip = () => {
  let skips = store.get("skips");
  if (--skips < 0) skips = 0;
  store.set("skips", skips);
};
exports.getSkips = () => store.get("skips");
exports.refillSkips = () => store.set("skips", 3);

const voiceSpeak = (text) => {
  if (window.VIZIO && window.VIZIO.Chromevox && text) {
    window.VIZIO.Chromevox.cancel();
    window.VIZIO.Chromevox.play(text);
    // console.log(text);
  } else {
    // console.log(text);
  }
};

export default voiceSpeak;

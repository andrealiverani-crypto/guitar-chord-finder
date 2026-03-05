// Guitar Chord Finder — Audio Engine (Karplus-Strong Synthesis)

(function () {
  var audioCtx = null;
  var currentNodes = [];
  var progressionTimer = null;

  // Lazy AudioContext (must be created on user gesture)
  function getOrCreateContext() {
    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Get actual MIDI note for a string given voicing data
  function getMidiNote(fret, baseFret, tuningNote) {
    if (fret === -1) return -1; // muted
    if (fret === 0) return tuningNote; // open string
    return tuningNote + (baseFret - 1) + fret; // fretted
  }

  // Generate one plucked-string buffer using Karplus-Strong algorithm
  function createKarplusStrongBuffer(ctx, frequency, duration, brightness) {
    var sampleRate = ctx.sampleRate;
    var bufferLength = Math.ceil(sampleRate * duration);
    var delayLength = Math.round(sampleRate / frequency);

    if (delayLength < 2) delayLength = 2;

    var buffer = ctx.createBuffer(1, bufferLength, sampleRate);
    var data = buffer.getChannelData(0);

    // Fill delay line with shaped noise burst
    for (var i = 0; i < delayLength && i < bufferLength; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Apply Karplus-Strong: filtered feedback from one period ago
    var damping = brightness || 0.498;
    for (var i = delayLength; i < bufferLength; i++) {
      data[i] = (data[i - delayLength] * damping +
                 data[i - delayLength + 1] * (1 - damping)) * 0.998;
    }

    return buffer;
  }

  // ── Public API ───────────────────────────────────────────────────

  // Play a single chord (strum all non-muted strings)
  window.playChordSound = function (frets, tuningNotes, baseFret) {
    window.stopAllAudio();
    var ctx = getOrCreateContext();
    var strumDelay = 0.03;  // 30ms between strings
    var duration = 2.0;
    var now = ctx.currentTime;

    // Per-string brightness: lower strings warmer, higher strings brighter
    var brightnessMap = [0.504, 0.502, 0.500, 0.498, 0.496, 0.494];

    for (var i = 0; i < 6; i++) {
      if (frets[i] === -1) continue;

      var midi = getMidiNote(frets[i], baseFret, tuningNotes[i]);
      var freq = midiToFrequency(midi);
      var buffer = createKarplusStrongBuffer(ctx, freq, duration, brightnessMap[i]);

      var source = ctx.createBufferSource();
      source.buffer = buffer;

      var gain = ctx.createGain();
      var stringTime = now + i * strumDelay;
      gain.gain.setValueAtTime(0.22, stringTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stringTime + duration);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(stringTime);
      source.stop(stringTime + duration);
      currentNodes.push(source);
    }
  };

  // Play a sequence of chords (progression)
  window.playProgression = function (chordDataList, tuningNotes, onChordStart) {
    window.stopAllAudio();
    var chordGap = 1200; // ms between chord starts
    var index = 0;

    function playNext() {
      if (index >= chordDataList.length) {
        if (onChordStart) onChordStart(-1); // signal end
        return;
      }

      var data = chordDataList[index];
      if (onChordStart) onChordStart(index);
      window.playChordSound(data.frets, tuningNotes, data.baseFret);
      index++;
      progressionTimer = setTimeout(playNext, chordGap);
    }

    playNext();
  };

  // Stop all currently playing audio
  window.stopAllAudio = function () {
    if (progressionTimer) {
      clearTimeout(progressionTimer);
      progressionTimer = null;
    }
    for (var i = 0; i < currentNodes.length; i++) {
      try { currentNodes[i].stop(); } catch (e) { /* already stopped */ }
    }
    currentNodes = [];
  };
})();

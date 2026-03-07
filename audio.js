// Guitar Chord Finder — Audio Engine (Warm Acoustic Guitar Synthesis)

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

  // Expose shared AudioContext for tuner
  window.getAudioContext = getOrCreateContext;

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Get actual MIDI note for a string given voicing data
  function getMidiNote(fret, baseFret, tuningNote) {
    if (fret === -1) return -1; // muted
    if (fret === 0) return tuningNote; // open string
    return tuningNote + (baseFret - 1) + fret; // fretted
  }

  // Generate one warm plucked-string buffer using extended Karplus-Strong
  function createGuitarBuffer(ctx, frequency, duration, stringIndex) {
    var sampleRate = ctx.sampleRate;
    var bufferLength = Math.ceil(sampleRate * duration);
    var delayLength = Math.round(sampleRate / frequency);

    if (delayLength < 2) delayLength = 2;

    var buffer = ctx.createBuffer(1, bufferLength, sampleRate);
    var data = buffer.getChannelData(0);

    // ── Heavily shaped initial excitation for warm nylon-like attack ──
    var prev = 0;
    var prev2 = 0;
    for (var i = 0; i < delayLength && i < bufferLength; i++) {
      var noise = Math.random() * 2 - 1;
      // Aggressive low-pass on excitation: two-stage smoothing
      var excitationSmooth = 0.50 + stringIndex * 0.05; // 0.50→0.75
      var filtered = noise * (1 - excitationSmooth) + prev * excitationSmooth;
      // Second stage smoothing for extra warmth
      filtered = filtered * 0.6 + prev2 * 0.4;
      data[i] = filtered;
      prev2 = prev;
      prev = filtered;
    }

    // ── Extended Karplus-Strong with warm damping ──
    var dampingBase = 0.545;
    var dampingPerString = -0.005;
    var damping = dampingBase + stringIndex * dampingPerString;
    // Result: string 0 (low E) = 0.545, string 5 (high e) = 0.520

    var decay = 0.9996;

    for (var i = delayLength; i < bufferLength; i++) {
      // Two-point weighted average (low-pass)
      var twoPoint = data[i - delayLength] * damping +
                     data[i - delayLength + 1] * (1 - damping);

      // Additional 4-point smoothing for extra warmth
      var idx2 = i - delayLength + 2;
      if (idx2 < i && idx2 >= 0) {
        twoPoint = twoPoint * 0.80 + data[idx2] * 0.20;
      }

      data[i] = twoPoint * decay;
    }

    return buffer;
  }

  // Create an acoustic guitar body resonance filter chain
  function createBodyFilter(ctx) {
    // Low-pass to cut harsh highs
    var lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2800;
    lowpass.Q.value = 0.8;

    // Body resonance at ~180Hz for warmth
    var bodyResonance = ctx.createBiquadFilter();
    bodyResonance.type = "peaking";
    bodyResonance.frequency.value = 180;
    bodyResonance.gain.value = 4;
    bodyResonance.Q.value = 1.0;

    // Wood character at ~400Hz
    var woodResonance = ctx.createBiquadFilter();
    woodResonance.type = "peaking";
    woodResonance.frequency.value = 400;
    woodResonance.gain.value = 2;
    woodResonance.Q.value = 0.8;

    // Presence dip to remove harshness
    var presenceDip = ctx.createBiquadFilter();
    presenceDip.type = "peaking";
    presenceDip.frequency.value = 2500;
    presenceDip.gain.value = -4;
    presenceDip.Q.value = 1.0;

    // High-shelf rolloff above 2kHz
    var highShelf = ctx.createBiquadFilter();
    highShelf.type = "highshelf";
    highShelf.frequency.value = 2000;
    highShelf.gain.value = -3;

    // Chain: source → body → wood → presenceDip → highShelf → lowpass → destination
    bodyResonance.connect(woodResonance);
    woodResonance.connect(presenceDip);
    presenceDip.connect(highShelf);
    highShelf.connect(lowpass);

    return { input: bodyResonance, output: lowpass };
  }

  // ── Public API ───────────────────────────────────────────────────

  // Play a single chord (strum all non-muted strings)
  window.playChordSound = function (frets, tuningNotes, baseFret) {
    window.stopAllAudio();
    var ctx = getOrCreateContext();
    var strumDelay = 0.038;  // 38ms between strings
    var duration = 2.2;
    var now = ctx.currentTime;

    // Create shared body resonance filter
    var body = createBodyFilter(ctx);
    body.output.connect(ctx.destination);

    for (var i = 0; i < 6; i++) {
      if (frets[i] === -1) continue;

      var midi = getMidiNote(frets[i], baseFret, tuningNotes[i]);
      var freq = midiToFrequency(midi);
      var buffer = createGuitarBuffer(ctx, freq, duration, i);

      var source = ctx.createBufferSource();
      source.buffer = buffer;

      var gain = ctx.createGain();
      var stringTime = now + i * strumDelay;

      // Soft attack: ramp up quickly then decay naturally
      gain.gain.setValueAtTime(0.0, stringTime);
      gain.gain.linearRampToValueAtTime(0.18, stringTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, stringTime + duration);

      source.connect(gain);
      gain.connect(body.input);
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

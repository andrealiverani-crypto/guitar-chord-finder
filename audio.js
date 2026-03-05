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

    // ── Shaped initial excitation (softer than raw white noise) ──
    // Pre-filter the noise burst for a warmer pluck attack
    var prev = 0;
    for (var i = 0; i < delayLength && i < bufferLength; i++) {
      var noise = Math.random() * 2 - 1;
      // Simple low-pass on the excitation: mix with previous sample
      // Lower strings get more filtering (warmer attack)
      var excitationSmooth = 0.4 + stringIndex * 0.05; // 0.40→0.65
      data[i] = noise * (1 - excitationSmooth) + prev * excitationSmooth;
      prev = data[i];
    }

    // ── Extended Karplus-Strong with warm damping ──
    // Higher damping = more HF loss per cycle = warmer tone
    // Acoustic guitar: all strings relatively warm, bass strings warmest
    var dampingBase = 0.520; // much warmer than the 0.498 default
    var dampingPerString = -0.004; // treble strings slightly brighter
    var damping = dampingBase + stringIndex * dampingPerString;
    // Result: string 0 (low E) = 0.520, string 5 (high e) = 0.500

    // Energy loss per sample (controls sustain length)
    var decay = 0.9996; // slightly less sustain than 0.998 for natural feel

    for (var i = delayLength; i < bufferLength; i++) {
      // Two-point weighted average (low-pass) + 4-point smoothing for extra warmth
      var twoPoint = data[i - delayLength] * damping +
                     data[i - delayLength + 1] * (1 - damping);

      // Additional smoothing: blend with neighboring delay samples
      var idx2 = i - delayLength + 2;
      if (idx2 < i && idx2 >= 0) {
        twoPoint = twoPoint * 0.85 + data[idx2] * 0.15;
      }

      data[i] = twoPoint * decay;
    }

    return buffer;
  }

  // Create a body resonance filter chain (simulates acoustic guitar body)
  function createBodyFilter(ctx) {
    // Low-pass to cut harsh highs
    var lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3500; // cut above 3.5kHz
    lowpass.Q.value = 0.7;

    // Gentle peak at ~200Hz for body warmth
    var bodyResonance = ctx.createBiquadFilter();
    bodyResonance.type = "peaking";
    bodyResonance.frequency.value = 200;
    bodyResonance.gain.value = 3; // +3dB body warmth
    bodyResonance.Q.value = 1.2;

    // Slight presence dip at ~2kHz to reduce harshness
    var presenceDip = ctx.createBiquadFilter();
    presenceDip.type = "peaking";
    presenceDip.frequency.value = 2200;
    presenceDip.gain.value = -2; // -2dB
    presenceDip.Q.value = 1.0;

    // Chain: source → bodyResonance → presenceDip → lowpass → destination
    bodyResonance.connect(presenceDip);
    presenceDip.connect(lowpass);

    return { input: bodyResonance, output: lowpass };
  }

  // ── Public API ───────────────────────────────────────────────────

  // Play a single chord (strum all non-muted strings)
  window.playChordSound = function (frets, tuningNotes, baseFret) {
    window.stopAllAudio();
    var ctx = getOrCreateContext();
    var strumDelay = 0.035;  // 35ms between strings (slightly slower strum)
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
      gain.gain.linearRampToValueAtTime(0.20, stringTime + 0.008);
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

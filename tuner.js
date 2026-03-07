// Guitar Chord Finder — Guitar Tuner (Microphone Pitch Detection)

(function () {
  var audioCtx = null;
  var analyser = null;
  var mediaStream = null;
  var sourceNode = null;
  var rafId = null;
  var isRunning = false;
  var smoothedFreq = 0;
  var lastTickTime = 0;

  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Map flat names to sharp equivalents for matching
  var FLAT_TO_SHARP = {
    "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#",
    "Ab": "G#", "Bb": "A#", "Cb": "B"
  };

  function normalizeNoteName(name) {
    // Uppercase first letter
    var n = name.charAt(0).toUpperCase() + name.slice(1);
    return FLAT_TO_SHARP[n] || n;
  }

  function frequencyToNote(freq) {
    // A4 = 440Hz = MIDI 69 = noteNum 0
    var noteNum = 12 * Math.log2(freq / 440);
    var roundedNote = Math.round(noteNum);
    var cents = Math.round(1200 * Math.log2(freq / (440 * Math.pow(2, roundedNote / 12))));

    // Map to note name: A=0 in our calculation, but NOTE_NAMES starts at C
    // MIDI: C=0, C#=1, D=2, ... A=9, A#=10, B=11
    // From A: offset by 9 semitones to get to C-based index
    var noteIndex = ((roundedNote % 12) + 12 + 9) % 12;
    var name = NOTE_NAMES[noteIndex];
    var octave = Math.floor((roundedNote + 9) / 12) + 4;

    return { name: name, octave: octave, cents: cents, frequency: freq };
  }

  function autoCorrelate(buffer, sampleRate) {
    // Check RMS — is there enough signal?
    var rms = 0;
    for (var i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    if (rms < 0.01) return -1; // not enough signal

    // Trim silence from edges for better correlation
    var threshold = 0.2;
    var r1 = 0, r2 = buffer.length - 1;
    for (var i = 0; i < buffer.length / 2; i++) {
      if (Math.abs(buffer[i]) > threshold) { r1 = i; break; }
    }
    for (var i = buffer.length - 1; i >= buffer.length / 2; i--) {
      if (Math.abs(buffer[i]) > threshold) { r2 = i; break; }
    }

    var trimmed = buffer.slice(r1, r2 + 1);
    var size = trimmed.length;
    if (size < 2) return -1;

    // Autocorrelation
    var c = new Float32Array(size);
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size - i; j++) {
        c[i] += trimmed[j] * trimmed[j + i];
      }
    }

    // Find first dip after initial maximum
    var d = 0;
    while (d < size - 1 && c[d] > c[d + 1]) d++;

    // Find peak after dip
    var maxval = -1, maxpos = -1;
    for (var i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    if (maxpos < 1) return -1;

    // Parabolic interpolation for sub-sample accuracy
    var T0 = maxpos;
    if (T0 > 0 && T0 < size - 1) {
      var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
      var a = (x1 + x3 - 2 * x2) / 2;
      var b = (x3 - x1) / 2;
      if (a !== 0) T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  }

  function updateDisplay(noteInfo) {
    var noteEl = document.getElementById("tuner-note");
    var centsEl = document.getElementById("tuner-cents");
    var freqEl = document.getElementById("tuner-freq");
    var needleEl = document.getElementById("tuner-needle");
    var inTuneEl = document.getElementById("tuner-in-tune");

    if (!noteEl) return;

    if (!noteInfo) {
      noteEl.textContent = "--";
      centsEl.textContent = "0 cents";
      freqEl.textContent = "--";
      needleEl.style.left = "50%";
      needleEl.className = "tuner-needle";
      inTuneEl.style.display = "none";
      return;
    }

    noteEl.textContent = noteInfo.name + noteInfo.octave;
    centsEl.textContent = (noteInfo.cents >= 0 ? "+" : "") + noteInfo.cents + " cents";
    freqEl.textContent = noteInfo.frequency.toFixed(1) + " Hz";

    // Position needle: -50 cents = 0%, 0 cents = 50%, +50 cents = 100%
    var pct = Math.max(0, Math.min(100, 50 + noteInfo.cents));
    needleEl.style.left = pct + "%";

    // Color coding
    var absCents = Math.abs(noteInfo.cents);
    if (absCents <= 5) {
      needleEl.className = "tuner-needle tuner-needle-green";
      inTuneEl.style.display = "block";
    } else if (absCents <= 15) {
      needleEl.className = "tuner-needle tuner-needle-yellow";
      inTuneEl.style.display = "none";
    } else {
      needleEl.className = "tuner-needle tuner-needle-red";
      inTuneEl.style.display = "none";
    }
  }

  function highlightClosestString(noteInfo) {
    var buttons = document.querySelectorAll("#tuner-strings .tuner-string-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("tuner-string-active");
    }
    if (!noteInfo) return;
    var detected = normalizeNoteName(noteInfo.name);
    for (var i = 0; i < buttons.length; i++) {
      var btnNote = normalizeNoteName(buttons[i].dataset.note || "");
      if (btnNote === detected) {
        buttons[i].classList.add("tuner-string-active");
        break; // highlight first match only
      }
    }
  }

  function tick() {
    if (!isRunning) return;
    rafId = requestAnimationFrame(tick);

    // Throttle to ~15fps
    var now = performance.now();
    if (now - lastTickTime < 66) return;
    lastTickTime = now;

    var bufferLength = analyser.fftSize;
    var buffer;

    // Safari compatibility check
    if (analyser.getFloatTimeDomainData) {
      buffer = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(buffer);
    } else {
      var byteBuffer = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(byteBuffer);
      buffer = new Float32Array(bufferLength);
      for (var i = 0; i < bufferLength; i++) {
        buffer[i] = (byteBuffer[i] - 128) / 128;
      }
    }

    var freq = autoCorrelate(buffer, audioCtx.sampleRate);

    if (freq > 0 && freq > 60 && freq < 1400) {
      // Guitar range: ~82Hz (low E) to ~1319Hz (high E 24th fret)
      smoothedFreq = smoothedFreq === 0 ? freq : smoothedFreq * 0.7 + freq * 0.3;
      var note = frequencyToNote(smoothedFreq);
      updateDisplay(note);
      highlightClosestString(note);
    } else {
      // No signal detected — fade out smoothly
      smoothedFreq = 0;
      updateDisplay(null);
      highlightClosestString(null);
    }
  }

  function populateStringButtons() {
    var container = document.getElementById("tuner-strings");
    if (!container) return;
    container.innerHTML = "";
    var tuning = window.getCurrentTuning ? window.getCurrentTuning() : window.TUNINGS[0];
    for (var i = 0; i < tuning.stringNames.length; i++) {
      var btn = document.createElement("button");
      btn.className = "tuner-string-btn";
      btn.type = "button";
      btn.textContent = tuning.stringNames[i];
      btn.dataset.note = tuning.stringNames[i];
      container.appendChild(btn);
    }
  }

  // ── Public API ───────────────────────────────────────────────────

  window.GuitarTuner = {
    start: function () {
      if (isRunning) return;

      // Always show string buttons immediately
      populateStringButtons();

      // Use shared AudioContext from audio.js if available
      audioCtx = window.getAudioContext ? window.getAudioContext() :
        new (window.AudioContext || window.webkitAudioContext)();

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
          mediaStream = stream;
          sourceNode = audioCtx.createMediaStreamSource(stream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 4096;
          sourceNode.connect(analyser);
          // Do NOT connect to destination (would cause feedback)
          isRunning = true;
          smoothedFreq = 0;
          lastTickTime = 0;
          tick();
        })
        .catch(function (err) {
          console.error("Microphone access denied:", err);
          alert("Microphone access is required for the tuner. Please allow microphone access and try again.");
        });
    },

    stop: function () {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (sourceNode) {
        try { sourceNode.disconnect(); } catch (e) {}
        sourceNode = null;
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(function (t) { t.stop(); });
        mediaStream = null;
      }
      smoothedFreq = 0;
      updateDisplay(null);
      highlightClosestString(null);
    },

    isRunning: function () {
      return isRunning;
    },

    refreshStrings: function () {
      if (isRunning) populateStringButtons();
    }
  };

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (isRunning) window.GuitarTuner.stop();
  });
})();

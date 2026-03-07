// Guitar Chord Finder — App Logic
(function () {
  var display = document.getElementById("chord-display");
  var emptyState = document.getElementById("empty-state");
  var chordInfo = document.getElementById("chord-info");
  var tuningSelect = document.getElementById("tuning-select");
  var rootSelect = document.getElementById("root-select");
  var qualitySelect = document.getElementById("quality-select");

  var currentTuning = window.TUNINGS[0]; // default to standard
  var currentChord = null;

  // Root notes with display labels
  var ROOTS = [
    { value: "C",  label: "C" },
    { value: "C#", label: "C# / Db" },
    { value: "D",  label: "D" },
    { value: "D#", label: "D# / Eb" },
    { value: "E",  label: "E" },
    { value: "F",  label: "F" },
    { value: "F#", label: "F# / Gb" },
    { value: "G",  label: "G" },
    { value: "G#", label: "G# / Ab" },
    { value: "A",  label: "A" },
    { value: "A#", label: "A# / Bb" },
    { value: "B",  label: "B" }
  ];

  // Chord qualities with display labels
  var QUALITIES = [
    { value: "major", label: "Major" },
    { value: "minor", label: "Minor" },
    { value: "7",     label: "7" },
    { value: "maj7",  label: "Maj7" },
    { value: "min7",  label: "Min7" },
    { value: "sus2",  label: "Sus2" },
    { value: "sus4",  label: "Sus4" },
    { value: "dim",   label: "Dim" },
    { value: "aug",   label: "Aug" }
  ];

  // Quality display names (for voicing header)
  var QUALITY_LABELS = {
    major: "Major", minor: "Minor", "7": "Dominant 7th",
    maj7: "Major 7th", min7: "Minor 7th",
    sus2: "Suspended 2nd", sus4: "Suspended 4th",
    dim: "Diminished", aug: "Augmented"
  };

  // ── Populate dropdowns ──────────────────────────────────────────

  // Tuning dropdown
  window.TUNINGS.forEach(function (t) {
    var opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name + " (" + t.label + ")";
    tuningSelect.appendChild(opt);
  });

  // Root dropdown
  ROOTS.forEach(function (r) {
    var opt = document.createElement("option");
    opt.value = r.value;
    opt.textContent = r.label;
    rootSelect.appendChild(opt);
  });

  // Quality dropdown
  QUALITIES.forEach(function (q) {
    var opt = document.createElement("option");
    opt.value = q.value;
    opt.textContent = q.label;
    qualitySelect.appendChild(opt);
  });

  // ── Chord lookup and display ────────────────────────────────────

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function lookupAndDisplay() {
    var root = rootSelect.value;
    var quality = qualitySelect.value;
    var chord = window.CHORD_DB.find(function (c) {
      return c.root === root && c.quality === quality;
    });
    if (chord) {
      selectChord(chord);
    }
  }

  function selectChord(chord) {
    currentChord = chord;

    // Sync dropdowns (for when called externally from progression chips)
    rootSelect.value = chord.root;
    qualitySelect.value = chord.quality;

    display.innerHTML = "";

    // Get voicings for current tuning
    var voicings = window.getVoicingsForTuning(chord, currentTuning);

    // Handle no voicings found
    if (!voicings || voicings.length === 0) {
      display.innerHTML = '<div class="no-voicings">No playable voicings found for <strong>' +
        escapeHtml(chord.name) + '</strong> in ' +
        escapeHtml(currentTuning.name) + ' tuning.</div>';
      chordInfo.innerHTML = "";
      return;
    }

    var heading = document.createElement("div");
    heading.className = "voicings-header";
    heading.innerHTML =
      '<span class="voicings-chord-name">' + escapeHtml(chord.name) + '</span>' +
      '<span class="voicings-quality">' + escapeHtml(QUALITY_LABELS[chord.quality] || chord.quality) + '</span>' +
      (currentTuning.id !== "standard"
        ? '<span class="voicings-tuning-badge">' + escapeHtml(currentTuning.label) + '</span>'
        : '') +
      '<span class="voicings-count">' + voicings.length + ' voicing' + (voicings.length > 1 ? 's' : '') + '</span>';
    display.appendChild(heading);

    var grid = document.createElement("div");
    grid.className = "voicings-grid";

    for (var i = 0; i < voicings.length; i++) {
      var card = document.createElement("div");
      card.className = "voicing-card";

      var label = document.createElement("div");
      label.className = "voicing-label" + (voicings[i].thumb ? " voicing-label-thumb" : "");
      label.textContent = voicings[i].thumb ? "Thumb" : "Position " + (i + 1);
      card.appendChild(label);

      // Play button for this voicing
      var playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "play-btn voicing-play-btn";
      playBtn.innerHTML = "&#9654;";
      playBtn.title = "Play this voicing";
      playBtn.setAttribute("aria-label", "Play voicing");
      (function (v, btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          window.playChordSound(v.frets, currentTuning.notes, v.baseFret);
          btn.classList.add("playing");
          setTimeout(function () { btn.classList.remove("playing"); }, 1800);
        });
      })(voicings[i], playBtn);
      card.appendChild(playBtn);

      var diagramContainer = document.createElement("div");
      diagramContainer.className = "voicing-diagram";
      var voicingData = {
        name: chord.name,
        frets: voicings[i].frets,
        fingers: voicings[i].fingers,
        barres: voicings[i].barres,
        baseFret: voicings[i].baseFret
      };
      window.renderChord(voicingData, diagramContainer, currentTuning.stringNames);
      card.appendChild(diagramContainer);

      grid.appendChild(card);
    }

    display.appendChild(grid);

    // Render progressions below voicings
    if (window.renderProgressions) {
      window.renderProgressions(chord, chordInfo);
    } else {
      chordInfo.innerHTML = "";
    }
  }

  // Expose for external use (progression chips, tuner)
  window.selectChord = selectChord;
  window.getCurrentTuning = function () { return currentTuning; };

  // ── Event listeners ─────────────────────────────────────────────

  // Chord selector change
  rootSelect.addEventListener("change", lookupAndDisplay);
  qualitySelect.addEventListener("change", lookupAndDisplay);

  // Tuning change handler
  tuningSelect.addEventListener("change", function () {
    var tuningId = tuningSelect.value;
    currentTuning = window.TUNINGS.find(function (t) { return t.id === tuningId; }) || window.TUNINGS[0];

    // If a chord is currently displayed, re-render with the new tuning
    if (currentChord) {
      selectChord(currentChord);
    }

    // Refresh tuner string buttons if tuner is running
    if (window.GuitarTuner && window.GuitarTuner.isRunning()) {
      window.GuitarTuner.refreshStrings();
    }
  });

  // ── Tuner toggle ────────────────────────────────────────────────

  var tunerToggle = document.getElementById("tuner-toggle");
  var tunerPanel = document.getElementById("tuner-panel");
  var tunerClose = document.getElementById("tuner-close");

  if (tunerToggle && tunerPanel) {
    tunerToggle.addEventListener("click", function () {
      var isVisible = tunerPanel.style.display !== "none";
      if (isVisible) {
        tunerPanel.style.display = "none";
        tunerToggle.classList.remove("tuner-toggle-active");
        if (window.GuitarTuner) window.GuitarTuner.stop();
      } else {
        tunerPanel.style.display = "block";
        tunerToggle.classList.add("tuner-toggle-active");
        if (window.GuitarTuner) window.GuitarTuner.start();
      }
    });

    if (tunerClose) {
      tunerClose.addEventListener("click", function () {
        tunerPanel.style.display = "none";
        tunerToggle.classList.remove("tuner-toggle-active");
        if (window.GuitarTuner) window.GuitarTuner.stop();
      });
    }
  }

  // Auto-select C Major on load
  lookupAndDisplay();
})();

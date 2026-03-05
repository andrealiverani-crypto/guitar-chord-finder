// Guitar Chord Finder — App Logic
(function () {
  const input = document.getElementById("chord-input");
  const dropdown = document.getElementById("suggestions");
  const display = document.getElementById("chord-display");
  const emptyState = document.getElementById("empty-state");
  const chordInfo = document.getElementById("chord-info");
  const tuningSelect = document.getElementById("tuning-select");

  let activeIndex = -1;
  let results = [];
  let currentTuning = window.TUNINGS[0]; // default to standard
  let currentChord = null; // track the currently displayed chord

  // Populate tuning dropdown from TUNINGS data
  window.TUNINGS.forEach(function (t) {
    var opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name + " (" + t.label + ")";
    tuningSelect.appendChild(opt);
  });

  // Quality display names
  const QUALITY_LABELS = {
    major: "Major", minor: "Minor", "7": "Dominant 7th",
    maj7: "Major 7th", min7: "Minor 7th",
    sus2: "Suspended 2nd", sus4: "Suspended 4th",
    dim: "Diminished", aug: "Augmented"
  };

  // Search scoring
  function getMatchScore(chord, variants) {
    let best = 0;
    for (const q of variants) {
      const ql = q.toLowerCase();
      const nl = chord.name.toLowerCase();

      if (nl === ql) best = Math.max(best, 100);
      else if (nl.startsWith(ql)) best = Math.max(best, 80);
      else if (nl.includes(ql)) best = Math.max(best, 50);

      for (const alias of chord.aliases) {
        const al = alias.toLowerCase();
        if (al === ql) best = Math.max(best, 90);
        else if (al.startsWith(ql)) best = Math.max(best, 70);
        else if (al.includes(ql)) best = Math.max(best, 40);
      }

      const qualityLabel = QUALITY_LABELS[chord.quality] || "";
      if (qualityLabel.toLowerCase().startsWith(ql) && ql.length >= 3) {
        best = Math.max(best, 30);
      }
    }
    return best;
  }

  function searchChords(query) {
    const normalized = query.trim();
    if (!normalized) return [];

    const variants = [normalized];
    for (const [from, to] of Object.entries(window.ENHARMONIC_MAP)) {
      if (normalized.toLowerCase().startsWith(from.toLowerCase())) {
        variants.push(normalized.toLowerCase().replace(from.toLowerCase(), to));
      }
    }

    return window.CHORD_DB
      .map(chord => ({ chord, score: getMatchScore(chord, variants) }))
      .filter(item => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.chord.name.length - b.chord.name.length;
      })
      .slice(0, 10)
      .map(item => item.chord);
  }

  // Render dropdown
  function showDropdown(chords) {
    results = chords;
    activeIndex = -1;
    dropdown.innerHTML = "";

    if (chords.length === 0) {
      dropdown.classList.remove("open");
      return;
    }

    for (let i = 0; i < chords.length; i++) {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML =
        '<span class="suggestion-name">' + escapeHtml(chords[i].name) + '</span>' +
        '<span class="suggestion-quality">' + escapeHtml(QUALITY_LABELS[chords[i].quality] || chords[i].quality) + '</span>';

      item.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectChord(chords[i]);
      });
      dropdown.appendChild(item);
    }

    dropdown.classList.add("open");
  }

  function hideDropdown() {
    dropdown.classList.remove("open");
    results = [];
    activeIndex = -1;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Select and render all voicings for a chord
  function selectChord(chord) {
    input.value = chord.name;
    currentChord = chord;
    hideDropdown();

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
      // Build a chord-like object for the renderer
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

  // Expose selectChord and currentTuning for external use
  window.selectChord = selectChord;
  window.getCurrentTuning = function () { return currentTuning; };

  // Tuning change handler
  tuningSelect.addEventListener("change", function () {
    var tuningId = tuningSelect.value;
    currentTuning = window.TUNINGS.find(function (t) { return t.id === tuningId; }) || window.TUNINGS[0];

    // If a chord is currently displayed, re-render with the new tuning
    if (currentChord) {
      selectChord(currentChord);
    }
  });

  // Event listeners
  input.addEventListener("input", function () {
    const query = input.value;
    if (query.trim().length === 0) {
      hideDropdown();
      return;
    }
    const matches = searchChords(query);
    showDropdown(matches);
  });

  input.addEventListener("keydown", function (e) {
    if (!dropdown.classList.contains("open")) return;

    const items = dropdown.querySelectorAll(".suggestion-item");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        selectChord(results[activeIndex]);
      } else if (results.length > 0) {
        selectChord(results[0]);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  function updateActive(items) {
    items.forEach(function (item, i) {
      item.classList.toggle("active", i === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  input.addEventListener("blur", function () {
    setTimeout(hideDropdown, 150);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim().length > 0) {
      const matches = searchChords(input.value);
      showDropdown(matches);
    }
  });

  // Focus input on load
  input.focus();
})();

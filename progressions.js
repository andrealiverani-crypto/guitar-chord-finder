// Chord Progressions — Data, Resolver & Renderer

(function () {
  // ── Constants ───────────────────────────────────────────────────
  var NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  var NOTE_TO_PC = {
    "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
    "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
    "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
  };

  var QUALITY_SUFFIX = {
    major: "", minor: "m", "7": "7", maj7: "maj7", min7: "m7",
    sus2: "sus2", sus4: "sus4", dim: "dim", aug: "aug"
  };

  // ── Progression Templates ──────────────────────────────────────
  // Each chord entry: { semitones: offset from root, quality: chord quality }

  var PROGRESSIONS = {
    major: [
      {
        name: "Pop Progression",
        label: "I - V - vi - IV",
        romanNumerals: ["I", "V", "vi", "IV"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "50s Doo-Wop",
        label: "I - vi - IV - V",
        romanNumerals: ["I", "vi", "IV", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Blues / Rock",
        label: "I - IV - V - I",
        romanNumerals: ["I", "IV", "V", "I"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 0, quality: "major" }
        ]
      },
      {
        name: "Country",
        label: "I - V - IV - I",
        romanNumerals: ["I", "V", "IV", "I"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "major" }
        ]
      },
      {
        name: "Pop Ballad",
        label: "I - IV - vi - V",
        romanNumerals: ["I", "IV", "vi", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Sensitive Cadence",
        label: "I - vi - IV - V",
        romanNumerals: ["I", "vi", "IV", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Basic Loop",
        label: "I - IV - I - V",
        romanNumerals: ["I", "IV", "I", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Jazz iii-vi-ii-V",
        label: "iii - vi - ii - V",
        romanNumerals: ["iii", "vi", "ii", "V"],
        chords: [
          { semitones: 4, quality: "minor" },
          { semitones: 9, quality: "minor" },
          { semitones: 2, quality: "minor" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Uplifting",
        label: "I - V - IV - V",
        romanNumerals: ["I", "V", "IV", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      }
    ],

    minor: [
      {
        name: "Minor Pop",
        label: "i - iv - VII - III",
        romanNumerals: ["i", "iv", "VII", "III"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 5, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 3, quality: "major" }
        ]
      },
      {
        name: "Andalusian Cadence",
        label: "i - VII - VI - V",
        romanNumerals: ["i", "VII", "VI", "V"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Axis of Awesome",
        label: "vi - IV - I - V",
        subtitle: "as vi in relative major",
        romanNumerals: ["vi", "IV", "I", "V"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 8, quality: "major" },
          { semitones: 3, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      },
      {
        name: "Epic Minor",
        label: "i - VI - III - VII",
        romanNumerals: ["i", "VI", "III", "VII"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 8, quality: "major" },
          { semitones: 3, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      },
      {
        name: "Minor Blues",
        label: "i - iv - v - i",
        romanNumerals: ["i", "iv", "v", "i"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 5, quality: "minor" },
          { semitones: 7, quality: "minor" },
          { semitones: 0, quality: "minor" }
        ]
      },
      {
        name: "Melancholic",
        label: "vi - V - IV - V",
        subtitle: "as vi in relative major",
        romanNumerals: ["vi", "V", "IV", "V"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      },
      {
        name: "Phrygian Motion",
        label: "i - VII - VI - V",
        romanNumerals: ["i", "VII", "VI", "V"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Natural Minor Descent",
        label: "i - VI - VII - VI",
        romanNumerals: ["i", "VI", "VII", "VI"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 8, quality: "major" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" }
        ]
      },
      {
        name: "Minor Funk",
        label: "i - v - iv - i",
        romanNumerals: ["i", "v", "iv", "i"],
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 7, quality: "minor" },
          { semitones: 5, quality: "minor" },
          { semitones: 0, quality: "minor" }
        ]
      }
    ],

    "7": [
      {
        name: "Blues Shuffle",
        label: "I7 - IV7 - I7 - V7",
        romanNumerals: ["I7", "IV7", "I7", "V7"],
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "7" },
          { semitones: 0, quality: "7" },
          { semitones: 7, quality: "7" }
        ]
      },
      {
        name: "Blues Turnaround",
        label: "I7 - IV7 - V7 - I7",
        romanNumerals: ["I7", "IV7", "V7", "I7"],
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "7" }
        ]
      },
      {
        name: "Jazz Resolution",
        label: "V7 - I",
        subtitle: "as V7 resolving",
        romanNumerals: ["V7", "I"],
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "Jazz ii-V-I",
        label: "ii7 - V7 - I",
        subtitle: "as V7 resolving",
        romanNumerals: ["ii7", "V7", "I"],
        chords: [
          { semitones: 7, quality: "min7" },
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "Tritone Substitution",
        label: "I7 - bII7 - I7",
        romanNumerals: ["I7", "bII7", "I7"],
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 1, quality: "7" },
          { semitones: 0, quality: "7" }
        ]
      },
      {
        name: "Bebop Turnaround",
        label: "ii7 - V7 - I7",
        romanNumerals: ["ii7", "V7", "I7"],
        chords: [
          { semitones: 2, quality: "min7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "7" }
        ]
      },
      {
        name: "Extended Blues",
        label: "I7 - IV7 - V7 - I7",
        romanNumerals: ["I7", "IV7", "V7", "I7"],
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "7" }
        ]
      }
    ],

    maj7: [
      {
        name: "Jazz ii-V-I",
        label: "ii7 - V7 - Imaj7",
        romanNumerals: ["ii7", "V7", "Imaj7"],
        chords: [
          { semitones: 2, quality: "min7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "maj7" }
        ]
      },
      {
        name: "Bossa Nova",
        label: "Imaj7 - ii7 - V7 - Imaj7",
        romanNumerals: ["Imaj7", "ii7", "V7", "Imaj7"],
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 2, quality: "min7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "maj7" }
        ]
      },
      {
        name: "Pop Maj7",
        label: "I - V - vi - IV",
        romanNumerals: ["Imaj7", "V", "vi", "IV"],
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 7, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "Smooth Maj7 Cadence",
        label: "Imaj7 - IV - Imaj7",
        romanNumerals: ["Imaj7", "IV", "Imaj7"],
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "maj7" }
        ]
      },
      {
        name: "Maj7 Descending",
        label: "Imaj7 - VImaj7 - IV",
        romanNumerals: ["Imaj7", "VImaj7", "IV"],
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 5, quality: "maj7" },
          { semitones: 5, quality: "major" }
        ]
      }
    ],

    min7: [
      {
        name: "Minor ii-V-i",
        label: "iiø - V7 - i7",
        romanNumerals: ["iiø", "V7", "i7"],
        chords: [
          { semitones: 2, quality: "dim" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "min7" }
        ]
      },
      {
        name: "Minor Pop",
        label: "i7 - iv - VII - III",
        romanNumerals: ["i7", "iv", "VII", "III"],
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 5, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 3, quality: "major" }
        ]
      },
      {
        name: "Andalusian Cadence",
        label: "i7 - VII - VI - V",
        romanNumerals: ["i7", "VII", "VI", "V"],
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Minor Funk",
        label: "im7 - iv7 - i7",
        romanNumerals: ["im7", "iv7", "i7"],
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 5, quality: "min7" },
          { semitones: 0, quality: "min7" }
        ]
      },
      {
        name: "Minor ii-V Extended",
        label: "iiø7 - V7alt - i7",
        romanNumerals: ["iiø7", "V7alt", "i7"],
        chords: [
          { semitones: 2, quality: "dim" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "min7" }
        ]
      },
      {
        name: "Soul/R&B",
        label: "i7 - v7 - iv7 - i7",
        romanNumerals: ["i7", "v7", "iv7", "i7"],
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 7, quality: "min7" },
          { semitones: 5, quality: "min7" },
          { semitones: 0, quality: "min7" }
        ]
      }
    ],

    sus2: [
      {
        name: "Sus2 Lift",
        label: "I - Isus2 - V",
        romanNumerals: ["I", "Isus2", "V"],
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 0, quality: "sus2" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Sus2 Rocking",
        label: "Isus2 - IV - Isus2",
        romanNumerals: ["Isus2", "IV", "Isus2"],
        chords: [
          { semitones: 0, quality: "sus2" },
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "sus2" }
        ]
      }
    ],

    sus4: [
      {
        name: "Sus4 Resolution",
        label: "IV - Isus4 - I",
        romanNumerals: ["IV", "Isus4", "I"],
        chords: [
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "sus4" },
          { semitones: 0, quality: "major" }
        ]
      },
      {
        name: "Sus4 Pendulum",
        label: "Isus4 - V - Isus4",
        romanNumerals: ["Isus4", "V", "Isus4"],
        chords: [
          { semitones: 0, quality: "sus4" },
          { semitones: 7, quality: "major" },
          { semitones: 0, quality: "sus4" }
        ]
      }
    ],

    dim: [],
    aug: []
  };

  // ── Resolver ────────────────────────────────────────────────────
  function resolveChordName(rootPC, semitones, quality) {
    var targetPC = (rootPC + semitones) % 12;
    return NOTES[targetPC] + QUALITY_SUFFIX[quality];
  }

  function findChordInDB(name) {
    for (var i = 0; i < window.CHORD_DB.length; i++) {
      if (window.CHORD_DB[i].name === name) return window.CHORD_DB[i];
    }
    return null;
  }

  // ── Public API ──────────────────────────────────────────────────
  window.getProgressions = function (chord) {
    var templates = PROGRESSIONS[chord.quality];
    if (!templates || templates.length === 0) return [];

    var rootPC = NOTE_TO_PC[chord.root];
    if (rootPC === undefined) return [];

    return templates.map(function (template) {
      var resolved = template.chords.map(function (entry) {
        var chordName = resolveChordName(rootPC, entry.semitones, entry.quality);
        var chordObj = findChordInDB(chordName);
        return {
          name: chordName,
          chord: chordObj,
          isCurrent: (entry.semitones === 0 && entry.quality === chord.quality)
        };
      });

      return {
        name: template.name,
        label: template.label,
        subtitle: template.subtitle || null,
        romanNumerals: template.romanNumerals || [],
        chords: resolved
      };
    });
  };

  // ── Renderer ────────────────────────────────────────────────────
  window.renderProgressions = function (chord, container) {
    container.innerHTML = "";

    var progressions = window.getProgressions(chord);
    if (progressions.length === 0) return;

    var section = document.createElement("div");
    section.className = "progressions-section";

    var header = document.createElement("h3");
    header.className = "progressions-header";
    header.textContent = "Common Progressions";
    section.appendChild(header);

    for (var i = 0; i < progressions.length; i++) {
      var prog = progressions[i];
      var row = document.createElement("div");
      row.className = "progression-row";

      // Play button for the whole progression
      var progPlayBtn = document.createElement("button");
      progPlayBtn.type = "button";
      progPlayBtn.className = "play-btn progression-play-btn";
      progPlayBtn.innerHTML = "&#9654;";
      progPlayBtn.title = "Play progression";
      progPlayBtn.setAttribute("aria-label", "Play progression");
      row.appendChild(progPlayBtn);

      // Progression name + optional subtitle
      var nameEl = document.createElement("div");
      nameEl.className = "progression-name";

      var nameText = document.createElement("span");
      nameText.textContent = prog.name;
      nameEl.appendChild(nameText);

      if (prog.subtitle) {
        var subEl = document.createElement("span");
        subEl.className = "progression-subtitle";
        subEl.textContent = prog.subtitle;
        nameEl.appendChild(subEl);
      }

      row.appendChild(nameEl);

      // Chord chips with arrows
      var chordSeq = document.createElement("div");
      chordSeq.className = "progression-chords";

      for (var j = 0; j < prog.chords.length; j++) {
        if (j > 0) {
          var arrow = document.createElement("span");
          arrow.className = "progression-arrow";
          arrow.textContent = "\u2192";
          chordSeq.appendChild(arrow);
        }

        var chip = document.createElement("button");
        chip.className = "progression-chip";
        chip.type = "button";

        if (prog.chords[j].isCurrent) {
          chip.classList.add("progression-chip-active");
        }

        chip.textContent = prog.chords[j].name;

        if (prog.chords[j].chord) {
          (function (chordObj) {
            chip.addEventListener("click", function () {
              if (window.selectChord) window.selectChord(chordObj);
            });
          })(prog.chords[j].chord);
        } else {
          chip.disabled = true;
          chip.classList.add("progression-chip-disabled");
        }

        chordSeq.appendChild(chip);
      }

      row.appendChild(chordSeq);

      // Roman numeral pattern row (if romanNumerals are provided)
      if (prog.romanNumerals && prog.romanNumerals.length > 0) {
        var patternRow = document.createElement("div");
        patternRow.className = "progression-pattern";

        for (var j = 0; j < prog.romanNumerals.length; j++) {
          if (j > 0) {
            var patternArrow = document.createElement("span");
            patternArrow.className = "progression-pattern-arrow";
            patternArrow.textContent = "\u2192";
            patternRow.appendChild(patternArrow);
          }

          var patternItem = document.createElement("span");
          patternItem.className = "progression-pattern-item";
          patternItem.textContent = prog.romanNumerals[j];
          patternRow.appendChild(patternItem);
        }

        row.appendChild(patternRow);
      }

      // Wire up progression play button
      (function (progData, seqContainer, playButton) {
        playButton.addEventListener("click", function () {
          var tuning = window.getCurrentTuning ? window.getCurrentTuning() : window.TUNINGS[0];
          var chordDataList = [];

          // Resolve each chord to its first voicing
          for (var k = 0; k < progData.chords.length; k++) {
            var entry = progData.chords[k];
            if (!entry.chord) continue;
            var voicings = window.getVoicingsForTuning(entry.chord, tuning);
            if (!voicings || voicings.length === 0) continue;
            chordDataList.push({
              frets: voicings[0].frets,
              baseFret: voicings[0].baseFret,
              chipIndex: k
            });
          }

          if (chordDataList.length === 0) return;

          // If already playing, stop
          if (playButton.classList.contains("playing")) {
            window.stopAllAudio();
            playButton.classList.remove("playing");
            playButton.innerHTML = "&#9654;";
            var allChips = seqContainer.querySelectorAll(".progression-chip");
            for (var c = 0; c < allChips.length; c++) {
              allChips[c].classList.remove("chord-playing");
            }
            return;
          }

          playButton.classList.add("playing");
          playButton.innerHTML = "&#9632;"; // stop icon

          window.playProgression(chordDataList, tuning.notes, function (idx) {
            var allChips = seqContainer.querySelectorAll(".progression-chip");
            for (var c = 0; c < allChips.length; c++) {
              allChips[c].classList.remove("chord-playing");
            }

            if (idx >= 0 && idx < chordDataList.length) {
              var chipIdx = chordDataList[idx].chipIndex;
              if (allChips[chipIdx]) {
                allChips[chipIdx].classList.add("chord-playing");
              }
            } else {
              // Playback ended
              playButton.classList.remove("playing");
              playButton.innerHTML = "&#9654;";
            }
          });
        });
      })(prog, chordSeq, progPlayBtn);

      section.appendChild(row);
    }

    container.appendChild(section);
  };
})();

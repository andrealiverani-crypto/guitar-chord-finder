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
        label: "I \u2013 V \u2013 vi \u2013 IV",
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "50s Doo-Wop",
        label: "I \u2013 vi \u2013 IV \u2013 V",
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Blues / Rock",
        label: "I \u2013 IV \u2013 V \u2013 I",
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 0, quality: "major" }
        ]
      },
      {
        name: "Country",
        label: "I \u2013 V \u2013 IV \u2013 I",
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 7, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 0, quality: "major" }
        ]
      },
      {
        name: "Pop Ballad",
        label: "I \u2013 IV \u2013 vi \u2013 V",
        chords: [
          { semitones: 0, quality: "major" },
          { semitones: 5, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 7, quality: "major" }
        ]
      }
    ],

    minor: [
      {
        name: "Minor Pop",
        label: "i \u2013 iv \u2013 VII \u2013 III",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 5, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 3, quality: "major" }
        ]
      },
      {
        name: "Andalusian Cadence",
        label: "i \u2013 VII \u2013 VI \u2013 V",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      },
      {
        name: "Axis of Awesome",
        label: "vi \u2013 IV \u2013 I \u2013 V",
        subtitle: "as vi in relative major",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 8, quality: "major" },
          { semitones: 3, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      },
      {
        name: "Epic Minor",
        label: "i \u2013 VI \u2013 III \u2013 VII",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 8, quality: "major" },
          { semitones: 3, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      },
      {
        name: "Minor Blues",
        label: "i \u2013 iv \u2013 v \u2013 i",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 5, quality: "minor" },
          { semitones: 7, quality: "minor" },
          { semitones: 0, quality: "minor" }
        ]
      },
      {
        name: "Melancholic",
        label: "vi \u2013 V \u2013 IV \u2013 V",
        subtitle: "as vi in relative major",
        chords: [
          { semitones: 0, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 10, quality: "major" }
        ]
      }
    ],

    "7": [
      {
        name: "Blues Shuffle",
        label: "I7 \u2013 IV7 \u2013 I7 \u2013 V7",
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "7" },
          { semitones: 0, quality: "7" },
          { semitones: 7, quality: "7" }
        ]
      },
      {
        name: "Blues Turnaround",
        label: "I7 \u2013 IV7 \u2013 V7 \u2013 I7",
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "7" }
        ]
      },
      {
        name: "Jazz Resolution",
        label: "V7 \u2013 I",
        subtitle: "as V7 resolving",
        chords: [
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "major" }
        ]
      },
      {
        name: "Jazz ii-V-I",
        label: "ii7 \u2013 V7 \u2013 I",
        subtitle: "as V7 resolving",
        chords: [
          { semitones: 7, quality: "min7" },
          { semitones: 0, quality: "7" },
          { semitones: 5, quality: "major" }
        ]
      }
    ],

    maj7: [
      {
        name: "Jazz ii-V-I",
        label: "ii7 \u2013 V7 \u2013 Imaj7",
        chords: [
          { semitones: 2, quality: "min7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "maj7" }
        ]
      },
      {
        name: "Bossa Nova",
        label: "Imaj7 \u2013 ii7 \u2013 V7 \u2013 Imaj7",
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 2, quality: "min7" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "maj7" }
        ]
      },
      {
        name: "Pop Progression",
        label: "I \u2013 V \u2013 vi \u2013 IV",
        chords: [
          { semitones: 0, quality: "maj7" },
          { semitones: 7, quality: "major" },
          { semitones: 9, quality: "minor" },
          { semitones: 5, quality: "major" }
        ]
      }
    ],

    min7: [
      {
        name: "Minor ii-V-i",
        label: "ii\u00f8 \u2013 V7 \u2013 i7",
        chords: [
          { semitones: 2, quality: "dim" },
          { semitones: 7, quality: "7" },
          { semitones: 0, quality: "min7" }
        ]
      },
      {
        name: "Minor Pop",
        label: "i7 \u2013 iv \u2013 VII \u2013 III",
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 5, quality: "minor" },
          { semitones: 10, quality: "major" },
          { semitones: 3, quality: "major" }
        ]
      },
      {
        name: "Andalusian Cadence",
        label: "i \u2013 VII \u2013 VI \u2013 V",
        chords: [
          { semitones: 0, quality: "min7" },
          { semitones: 10, quality: "major" },
          { semitones: 8, quality: "major" },
          { semitones: 7, quality: "major" }
        ]
      }
    ],

    sus2: [],
    sus4: [],
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

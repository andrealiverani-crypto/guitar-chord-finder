// Guitar Tuning Definitions & Algorithmic Voicing Generator

(function () {
  // ── Tuning Definitions ──────────────────────────────────────────
  // notes: MIDI note numbers for 6 strings [low→high]
  // E2=40, F2=41, G2=43, A2=45, B2=47, C3=48, D3=50, E3=52, F3=53, G3=55, A3=57, B3=59, C4=60, D4=62, E4=64

  window.TUNINGS = [
    {
      id: "standard",
      name: "Standard",
      label: "EADGBe",
      notes: [40, 45, 50, 55, 59, 64],
      stringNames: ["E", "A", "D", "G", "B", "e"]
    },
    {
      id: "drop-d",
      name: "Drop D",
      label: "DADGBe",
      notes: [38, 45, 50, 55, 59, 64],
      stringNames: ["D", "A", "D", "G", "B", "e"]
    },
    {
      id: "open-g",
      name: "Open G",
      label: "DGDGBD",
      notes: [38, 43, 50, 55, 59, 62],
      stringNames: ["D", "G", "D", "G", "B", "D"]
    },
    {
      id: "open-d",
      name: "Open D",
      label: "DADF#AD",
      notes: [38, 45, 50, 54, 57, 62],
      stringNames: ["D", "A", "D", "F#", "A", "D"]
    },
    {
      id: "open-e",
      name: "Open E",
      label: "EBEG#BE",
      notes: [40, 47, 52, 56, 59, 64],
      stringNames: ["E", "B", "E", "G#", "B", "E"]
    },
    {
      id: "dadgad",
      name: "DADGAD",
      label: "DADGAD",
      notes: [38, 45, 50, 55, 57, 62],
      stringNames: ["D", "A", "D", "G", "A", "D"]
    },
    {
      id: "half-step-down",
      name: "Half Step Down",
      label: "Eb Ab Db Gb Bb Eb",
      notes: [39, 44, 49, 54, 58, 63],
      stringNames: ["Eb", "Ab", "Db", "Gb", "Bb", "Eb"]
    },
    {
      id: "full-step-down",
      name: "Full Step Down",
      label: "DGCFAD",
      notes: [38, 43, 48, 53, 57, 62],
      stringNames: ["D", "G", "C", "F", "A", "D"]
    },
    {
      id: "open-a",
      name: "Open A",
      label: "EAEAC#E",
      notes: [40, 45, 52, 57, 61, 64],
      stringNames: ["E", "A", "E", "A", "C#", "E"]
    },
    {
      id: "drop-c",
      name: "Drop C",
      label: "CGCFAD",
      notes: [36, 43, 48, 53, 57, 62],
      stringNames: ["C", "G", "C", "F", "A", "D"]
    }
  ];

  // ── Chord Intervals (semitones from root) ───────────────────────
  window.CHORD_INTERVALS = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    "7":   [0, 4, 7, 10],
    maj7:  [0, 4, 7, 11],
    min7:  [0, 3, 7, 10],
    sus2:  [0, 2, 7],
    sus4:  [0, 5, 7],
    dim:   [0, 3, 6],
    aug:   [0, 4, 8]
  };

  // ── Note name → pitch class ─────────────────────────────────────
  var NOTE_TO_PC = {
    "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
    "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
    "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
  };

  // ── Voicing cache ───────────────────────────────────────────────
  var voicingCache = {};

  // ── Main entry point ────────────────────────────────────────────
  // Returns hand-picked voicings for standard tuning, generated for others
  window.getVoicingsForTuning = function (chord, tuning) {
    if (tuning.id === "standard") {
      return chord.voicings;
    }
    return window.generateVoicings(chord.root, chord.quality, tuning);
  };

  // ── Voicing Generator ───────────────────────────────────────────
  window.generateVoicings = function (rootName, quality, tuning) {
    var cacheKey = tuning.id + ":" + rootName + ":" + quality;
    if (voicingCache[cacheKey]) return voicingCache[cacheKey];

    var intervals = window.CHORD_INTERVALS[quality];
    if (!intervals) return [];

    var rootPC = NOTE_TO_PC[rootName];
    if (rootPC === undefined) return [];

    var chordPCs = intervals.map(function (i) { return (rootPC + i) % 12; });
    var candidates = [];

    // Try each base fret window (0 = open position, 1–12 = higher positions)
    for (var baseFretPos = 0; baseFretPos <= 12; baseFretPos++) {
      var optionsPerString = buildStringOptions(tuning.notes, chordPCs, baseFretPos);
      searchCombinations(optionsPerString, tuning.notes, chordPCs, rootPC, baseFretPos, candidates);
    }

    // Deduplicate candidates (same frets = same voicing regardless of baseFretPos)
    var seen = {};
    var unique = [];
    for (var ci = 0; ci < candidates.length; ci++) {
      var key = candidates[ci].frets.join(",");
      if (!seen[key]) {
        seen[key] = true;
        unique.push(candidates[ci]);
      }
    }

    // Score, select best, finalize
    var scored = unique.map(function (c) {
      return { candidate: c, score: scoreVoicing(c, rootPC, chordPCs, tuning) };
    });
    scored.sort(function (a, b) { return b.score - a.score; });

    var result = selectDiverse(scored, 4);
    result = result.map(function (s) { return finalizeVoicing(s.candidate); });

    voicingCache[cacheKey] = result;
    return result;
  };

  // ── Build fret options for each string ──────────────────────────
  function buildStringOptions(tuningNotes, chordPCs, baseFretPos) {
    var options = [];
    for (var s = 0; s < 6; s++) {
      var stringOpts = [-1]; // muted always an option
      var openPC = tuningNotes[s] % 12;

      if (baseFretPos === 0) {
        // Open position: check frets 0–4
        for (var f = 0; f <= 4; f++) {
          var notePC = (tuningNotes[s] + f) % 12;
          if (chordPCs.indexOf(notePC) >= 0) {
            stringOpts.push(f);
          }
        }
      } else {
        // Higher position: check open string + frets in window
        if (chordPCs.indexOf(openPC) >= 0) {
          stringOpts.push(0);
        }
        for (var f = baseFretPos; f <= baseFretPos + 3; f++) {
          var notePC = (tuningNotes[s] + f) % 12;
          if (chordPCs.indexOf(notePC) >= 0) {
            stringOpts.push(f);
          }
        }
      }
      options.push(stringOpts);
    }
    return options;
  }

  // ── Backtracking search ─────────────────────────────────────────
  function searchCombinations(optionsPerString, tuningNotes, chordPCs, rootPC, baseFretPos, candidates) {
    var frets = new Array(6);
    var maxCandidatesPerPos = 80; // limit per position for performance
    var found = 0;

    function backtrack(idx, usedPCsBitmask, minFretted, maxFretted, playedCount) {
      if (found >= maxCandidatesPerPos) return;

      if (idx === 6) {
        // Validate: enough strings played
        if (playedCount < 3) return;

        // Validate: all essential chord tones present
        var missingCount = 0;
        for (var p = 0; p < chordPCs.length; p++) {
          if (!(usedPCsBitmask & (1 << chordPCs[p]))) missingCount++;
        }
        if (chordPCs.length <= 3 && missingCount > 0) return;
        if (chordPCs.length === 4 && missingCount > 1) return;
        // For 4-note chords, allow omitting the 5th only
        if (chordPCs.length === 4 && missingCount === 1) {
          if (usedPCsBitmask & (1 << chordPCs[2])) return; // 5th IS present, something else missing
        }

        // Check for excessive internal muting
        if (hasExcessiveInternalMutes(frets)) return;

        candidates.push({
          frets: frets.slice(),
          baseFretPos: baseFretPos
        });
        found++;
        return;
      }

      var opts = optionsPerString[idx];
      for (var o = 0; o < opts.length; o++) {
        var f = opts[o];

        if (f > 0) {
          // Check span constraint
          var newMin = minFretted === 999 ? f : Math.min(minFretted, f);
          var newMax = maxFretted === 0 ? f : Math.max(maxFretted, f);
          if (newMax - newMin > 3) continue; // exceeds hand span

          var pc = (tuningNotes[idx] + f) % 12;
          frets[idx] = f;
          backtrack(idx + 1, usedPCsBitmask | (1 << pc), newMin, newMax, playedCount + 1);
        } else if (f === 0) {
          var pc = tuningNotes[idx] % 12;
          frets[idx] = 0;
          backtrack(idx + 1, usedPCsBitmask | (1 << pc), minFretted, maxFretted, playedCount + 1);
        } else {
          // muted
          frets[idx] = -1;
          backtrack(idx + 1, usedPCsBitmask, minFretted, maxFretted, playedCount);
        }
      }
    }

    backtrack(0, 0, 999, 0, 0);
  }

  // ── Check for excessive internal muting ─────────────────────────
  function hasExcessiveInternalMutes(frets) {
    // Find first and last played string
    var first = -1, last = -1;
    for (var i = 0; i < 6; i++) {
      if (frets[i] !== -1) {
        if (first === -1) first = i;
        last = i;
      }
    }
    if (first === -1) return true;

    // Count muted strings between first and last played
    var internalMutes = 0;
    for (var i = first + 1; i < last; i++) {
      if (frets[i] === -1) internalMutes++;
    }
    return internalMutes > 1;
  }

  // ── Score a voicing candidate ───────────────────────────────────
  function scoreVoicing(candidate, rootPC, chordPCs, tuning) {
    var frets = candidate.frets;
    var score = 0;

    // 1. Bass note scoring: root preferred, any chord tone acceptable
    for (var i = 0; i < 6; i++) {
      if (frets[i] !== -1) {
        var bassPC = (tuning.notes[i] + frets[i]) % 12;
        if (bassPC === rootPC) score += 20;
        else if (chordPCs.indexOf(bassPC) >= 0) score += 5;
        else score -= 15;
        break;
      }
    }

    // 2. More strings played (higher bonus rewards full voicings)
    var playedCount = 0;
    var openCount = 0;
    for (var i = 0; i < 6; i++) {
      if (frets[i] !== -1) playedCount++;
      if (frets[i] === 0) openCount++;
    }
    score += playedCount * 5;

    // 3. Open strings bonus (rewards easy/open voicings)
    score += openCount * 4;

    // 3b. Full voicing bonus: all 6 strings played
    if (playedCount === 6) score += 8;

    // 3c. All-open bonus: if every string is open, it's the easiest voicing
    if (openCount === 6) score += 20;

    // 4. Lower position preference
    if (candidate.baseFretPos <= 3) score += 8;
    else if (candidate.baseFretPos <= 5) score += 4;
    else if (candidate.baseFretPos <= 7) score += 2;

    // 5. Smaller fret span
    var fretted = [];
    for (var i = 0; i < 6; i++) {
      if (frets[i] > 0) fretted.push(frets[i]);
    }
    if (fretted.length > 0) {
      var span = Math.max.apply(null, fretted) - Math.min.apply(null, fretted);
      score += (3 - span) * 2;
    }

    // 6. No internal muted strings bonus
    var first = -1, last = -1;
    for (var i = 0; i < 6; i++) {
      if (frets[i] !== -1) {
        if (first === -1) first = i;
        last = i;
      }
    }
    var hasInternalMute = false;
    for (var i = first + 1; i < last; i++) {
      if (frets[i] === -1) { hasInternalMute = true; break; }
    }
    if (!hasInternalMute) score += 5;

    // 7. All chord tones present
    var usedPCs = {};
    for (var i = 0; i < 6; i++) {
      if (frets[i] >= 0) {
        var pc = (tuning.notes[i] + frets[i]) % 12;
        usedPCs[pc] = true;
      }
    }
    var allPresent = true;
    for (var p = 0; p < chordPCs.length; p++) {
      if (!usedPCs[chordPCs[p]]) { allPresent = false; break; }
    }
    if (allPresent) score += 10;

    // 8. Penalize muted treble strings
    if (frets[5] === -1) score -= 5;
    if (frets[4] === -1) score -= 3;

    // 9. Penalize high positions
    if (candidate.baseFretPos > 9) score -= 5;

    return score;
  }

  // ── Select diverse voicings ─────────────────────────────────────
  function selectDiverse(scored, maxCount) {
    if (scored.length === 0) return [];

    var selected = [scored[0]];

    for (var i = 1; i < scored.length && selected.length < maxCount; i++) {
      var c = scored[i];
      var isDifferent = true;

      for (var j = 0; j < selected.length; j++) {
        var s = selected[j];
        var posDiff = Math.abs(c.candidate.baseFretPos - s.candidate.baseFretPos);
        var fretDiffs = 0;
        for (var k = 0; k < 6; k++) {
          if (c.candidate.frets[k] !== s.candidate.frets[k]) fretDiffs++;
        }
        if (posDiff < 3 && fretDiffs < 3) {
          isDifferent = false;
          break;
        }
      }

      if (isDifferent) selected.push(c);
    }

    // If fewer than 2, relax constraints
    if (selected.length < 2) {
      for (var i = 1; i < scored.length && selected.length < 2; i++) {
        var alreadySelected = false;
        for (var j = 0; j < selected.length; j++) {
          if (selected[j] === scored[i]) { alreadySelected = true; break; }
        }
        if (!alreadySelected) selected.push(scored[i]);
      }
    }

    return selected;
  }

  // ── Finalize a voicing into the output format ───────────────────
  function finalizeVoicing(candidate) {
    var absFrets = candidate.frets;

    // Compute baseFret from fretted (non-zero, non-muted) notes
    var fretted = [];
    for (var i = 0; i < 6; i++) {
      if (absFrets[i] > 0) fretted.push(absFrets[i]);
    }

    var baseFret;
    if (fretted.length === 0) {
      baseFret = 1;
    } else {
      baseFret = Math.min.apply(null, fretted);
    }

    // Convert absolute frets to relative (1-based from baseFret)
    var relativeFrets = absFrets.map(function (f) {
      if (f === -1) return -1;
      if (f === 0) return 0;
      return f - baseFret + 1;
    });

    // Assign fingers and detect barres
    var result = assignFingersAndBarres(relativeFrets);

    return {
      frets: relativeFrets,
      fingers: result.fingers,
      barres: result.barres,
      baseFret: baseFret
    };
  }

  // ── Finger assignment & barre detection ─────────────────────────
  function assignFingersAndBarres(relativeFrets) {
    var fingers = [0, 0, 0, 0, 0, 0];
    var barres = [];

    // Group strings by their fret number (only fretted notes, >0)
    var fretGroups = {};
    for (var i = 0; i < 6; i++) {
      var f = relativeFrets[i];
      if (f > 0) {
        if (!fretGroups[f]) fretGroups[f] = [];
        fretGroups[f].push(i);
      }
    }

    // Find barre opportunity: look for lowest fret with 2+ strings
    var sortedFrets = Object.keys(fretGroups).map(Number).sort(function (a, b) { return a - b; });
    var barreFret = -1;
    var barreStrings = [];

    for (var fi = 0; fi < sortedFrets.length; fi++) {
      var fretNum = sortedFrets[fi];
      var strings = fretGroups[fretNum];
      if (strings.length >= 2) {
        var minStr = Math.min.apply(null, strings);
        var maxStr = Math.max.apply(null, strings);

        // Verify barre is valid: no strings between min and max at a LOWER fret
        var isValidBarre = true;
        for (var s = minStr; s <= maxStr; s++) {
          if (relativeFrets[s] > 0 && relativeFrets[s] < fretNum) {
            isValidBarre = false;
            break;
          }
        }

        if (isValidBarre) {
          barreFret = fretNum;
          // Barre spans from minStr to maxStr
          barres.push({
            fret: fretNum,
            fromString: 6 - minStr,
            toString: 6 - maxStr
          });
          barreStrings = [];
          for (var s = minStr; s <= maxStr; s++) {
            if (relativeFrets[s] === fretNum) barreStrings.push(s);
          }
          break;
        }
      }
    }

    // Assign finger numbers
    // Barre strings at barre fret get finger 1
    for (var b = 0; b < barreStrings.length; b++) {
      fingers[barreStrings[b]] = 1;
    }

    // Collect remaining fretted positions
    var positions = [];
    for (var i = 0; i < 6; i++) {
      if (relativeFrets[i] > 0 && fingers[i] === 0) {
        positions.push({ string: i, fret: relativeFrets[i] });
      }
    }

    // Sort by fret ascending, then string ascending
    positions.sort(function (a, b) {
      return a.fret - b.fret || a.string - b.string;
    });

    // Assign fingers 2, 3, 4 (or 1, 2, 3, 4 if no barre)
    var nextFinger = barreFret >= 0 ? 2 : 1;
    for (var p = 0; p < positions.length; p++) {
      fingers[positions[p].string] = Math.min(nextFinger, 4);
      nextFinger++;
    }

    return { fingers: fingers, barres: barres };
  }
})();

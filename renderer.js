// SVG Chord Diagram Renderer
// Renders a guitar chord diagram as an SVG element

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Diagram layout constants
  const DIAGRAM_X = 50;
  const DIAGRAM_Y = 45;
  const STRING_SPACING = 22;
  const FRET_SPACING = 32;
  const NUM_FRETS = 5;
  const NUM_STRINGS = 6;
  const DOT_RADIUS = 8;
  const BARRE_HEIGHT = 14;
  const GRID_WIDTH = (NUM_STRINGS - 1) * STRING_SPACING;
  const GRID_HEIGHT = NUM_FRETS * FRET_SPACING;

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      el.setAttribute(k, v);
    }
    return el;
  }

  function renderChord(chordData, container) {
    container.innerHTML = "";

    const svg = svgEl("svg", {
      viewBox: `0 0 ${DIAGRAM_X * 2 + GRID_WIDTH} ${DIAGRAM_Y + GRID_HEIGHT + 40}`,
      class: "chord-svg",
      "aria-label": chordData.name + " chord diagram"
    });

    // Chord name title
    const title = svgEl("text", {
      x: DIAGRAM_X + GRID_WIDTH / 2,
      y: 18,
      "text-anchor": "middle",
      class: "chord-title"
    });
    title.textContent = chordData.name;
    svg.appendChild(title);

    // Nut or fret position label
    if (chordData.baseFret === 1) {
      svg.appendChild(svgEl("rect", {
        x: DIAGRAM_X - 2,
        y: DIAGRAM_Y - 4,
        width: GRID_WIDTH + 4,
        height: 6,
        rx: 1,
        class: "chord-nut"
      }));
    } else {
      const fretLabel = svgEl("text", {
        x: DIAGRAM_X + GRID_WIDTH + 12,
        y: DIAGRAM_Y + FRET_SPACING / 2 + 5,
        class: "chord-fret-label"
      });
      fretLabel.textContent = chordData.baseFret + "fr";
      svg.appendChild(fretLabel);
    }

    // Fret lines (horizontal)
    for (let i = 0; i <= NUM_FRETS; i++) {
      const y = DIAGRAM_Y + i * FRET_SPACING;
      svg.appendChild(svgEl("line", {
        x1: DIAGRAM_X, y1: y,
        x2: DIAGRAM_X + GRID_WIDTH, y2: y,
        class: "chord-fret-line"
      }));
    }

    // String lines (vertical)
    for (let i = 0; i < NUM_STRINGS; i++) {
      const x = DIAGRAM_X + i * STRING_SPACING;
      svg.appendChild(svgEl("line", {
        x1: x, y1: DIAGRAM_Y,
        x2: x, y2: DIAGRAM_Y + GRID_HEIGHT,
        class: "chord-string-line"
      }));
    }

    // Open / Muted indicators above nut
    for (let i = 0; i < NUM_STRINGS; i++) {
      const fret = chordData.frets[i];
      const x = DIAGRAM_X + i * STRING_SPACING;
      const y = DIAGRAM_Y - 14;

      if (fret === 0) {
        svg.appendChild(svgEl("circle", {
          cx: x, cy: y,
          r: 5,
          class: "chord-open-string"
        }));
      } else if (fret === -1) {
        const muted = svgEl("text", {
          x: x, y: y + 5,
          "text-anchor": "middle",
          class: "chord-muted-string"
        });
        muted.textContent = "\u00D7";
        svg.appendChild(muted);
      }
    }

    // Barre chords (draw before dots so dots overlay)
    if (chordData.barres) {
      for (const barre of chordData.barres) {
        const fromIdx = NUM_STRINGS - barre.fromString;
        const toIdx = NUM_STRINGS - barre.toString;
        const x1 = DIAGRAM_X + Math.min(fromIdx, toIdx) * STRING_SPACING;
        const x2 = DIAGRAM_X + Math.max(fromIdx, toIdx) * STRING_SPACING;
        const y = DIAGRAM_Y + (barre.fret - 0.5) * FRET_SPACING;

        svg.appendChild(svgEl("rect", {
          x: x1 - 2,
          y: y - BARRE_HEIGHT / 2,
          width: x2 - x1 + 4,
          height: BARRE_HEIGHT,
          rx: BARRE_HEIGHT / 2,
          ry: BARRE_HEIGHT / 2,
          class: "chord-barre"
        }));
      }
    }

    // Finger position dots
    for (let i = 0; i < NUM_STRINGS; i++) {
      const fret = chordData.frets[i];
      if (fret > 0) {
        const x = DIAGRAM_X + i * STRING_SPACING;
        const y = DIAGRAM_Y + (fret - 0.5) * FRET_SPACING;

        // Check if this position is covered by a barre
        const isBarre = chordData.barres && chordData.barres.some(b => {
          const fromIdx = NUM_STRINGS - b.fromString;
          const toIdx = NUM_STRINGS - b.toString;
          const minIdx = Math.min(fromIdx, toIdx);
          const maxIdx = Math.max(fromIdx, toIdx);
          return b.fret === fret && i >= minIdx && i <= maxIdx;
        });

        if (!isBarre) {
          svg.appendChild(svgEl("circle", {
            cx: x, cy: y,
            r: DOT_RADIUS,
            class: "chord-dot"
          }));

          // Finger number (5 = thumb, shown as "T")
          if (chordData.fingers && chordData.fingers[i] > 0) {
            var isThumb = chordData.fingers[i] === 5;
            var fingerText = svgEl("text", {
              x: x, y: y + 4,
              "text-anchor": "middle",
              class: isThumb ? "chord-finger-text chord-thumb-text" : "chord-finger-text"
            });
            fingerText.textContent = isThumb ? "T" : chordData.fingers[i];
            svg.appendChild(fingerText);

            // Thumb indicator: different dot style
            if (isThumb) {
              svg.removeChild(svg.lastChild); // remove text temporarily
              svg.removeChild(svg.lastChild); // remove the plain dot
              // Draw thumb-styled dot
              svg.appendChild(svgEl("circle", {
                cx: x, cy: y,
                r: DOT_RADIUS,
                class: "chord-dot chord-thumb-dot"
              }));
              // Re-add text
              svg.appendChild(fingerText);
            }
          }
        }
      }
    }

    // String name labels below
    const stringNames = ["E", "A", "D", "G", "B", "e"];
    for (let i = 0; i < NUM_STRINGS; i++) {
      const label = svgEl("text", {
        x: DIAGRAM_X + i * STRING_SPACING,
        y: DIAGRAM_Y + GRID_HEIGHT + 22,
        "text-anchor": "middle",
        class: "chord-string-label"
      });
      label.textContent = stringNames[i];
      svg.appendChild(label);
    }

    container.appendChild(svg);
  }

  window.renderChord = renderChord;
})();

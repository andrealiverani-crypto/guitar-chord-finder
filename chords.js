// Guitar Chord Database — Multiple Voicings
// 108 chords: 12 roots x 9 qualities, each with 2-3 voicings
// frets: [-1=muted, 0=open, 1+=fretted] for strings [lowE, A, D, G, B, highE]
// fingers: [0=not fingered, 1-4=finger number, 5=thumb (T)]
// barres: [{fret, fromString, toString}] strings numbered 6(lowE) to 1(highE)
// baseFret: 1=open position (nut shown), >1=position marker shown

window.ENHARMONIC_MAP = {
  "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#",
  "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb"
};

window.CHORD_DB = [
  // ===== C CHORDS =====
  { name: "C", aliases: ["Cmaj", "C major"], root: "C", quality: "major", voicings: [
    { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 8 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 3 }
  ]},
  { name: "Cm", aliases: ["Cmin", "C minor"], root: "C", quality: "minor", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 3 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 8 },
    { frets: [-1, 3, 1, 0, 1, -1], fingers: [0, 4, 2, 0, 1, 0], barres: [], baseFret: 1 }
  ]},
  { name: "C7", aliases: ["Cdom7", "C dominant 7"], root: "C", quality: "7", voicings: [
    { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 8 },
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 3 }
  ]},
  { name: "Cmaj7", aliases: ["CM7", "C major 7"], root: "C", quality: "maj7", voicings: [
    { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 3 },
    { frets: [-1, -1, 1, 3, 1, 3], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 3 }
  ]},
  { name: "Cm7", aliases: ["Cmin7", "C minor 7"], root: "C", quality: "min7", voicings: [
    { frets: [-1, 1, 1, 3, 1, 3], fingers: [0, 1, 1, 3, 1, 4], barres: [{ fret: 1, fromString: 5, toString: 2 }], baseFret: 3 },
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 8 },
    { frets: [-1, 3, 1, 3, 1, -1], fingers: [0, 3, 1, 4, 2, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Csus2", aliases: ["C suspended 2"], root: "C", quality: "sus2", voicings: [
    { frets: [-1, 3, 0, 0, 1, 3], fingers: [0, 2, 0, 0, 1, 4], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 3 }
  ]},
  { name: "Csus4", aliases: ["C suspended 4", "Csus"], root: "C", quality: "sus4", voicings: [
    { frets: [-1, 3, 3, 0, 1, 1], fingers: [0, 3, 4, 0, 1, 1], barres: [], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 8 }
  ]},
  { name: "Cdim", aliases: ["C diminished", "Co"], root: "C", quality: "dim", voicings: [
    { frets: [-1, 3, 1, -1, 1, -1], fingers: [0, 3, 1, 0, 2, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 2 }
  ]},
  { name: "Caug", aliases: ["C augmented", "C+"], root: "C", quality: "aug", voicings: [
    { frets: [-1, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 2, 1, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 2, 1, 1, 0], fingers: [0, 0, 3, 2, 1, 0], barres: [], baseFret: 1 }
  ]},

  // ===== C# / Db CHORDS =====
  { name: "C#", aliases: ["C#maj", "C# major", "Db", "Dbmaj", "Db major"], root: "C#", quality: "major", voicings: [
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 9 },
    { frets: [-1, -1, 3, 1, 2, 1], fingers: [0, 0, 3, 1, 2, 1], barres: [{ fret: 1, fromString: 3, toString: 1 }], baseFret: 1 }
  ]},
  { name: "C#m", aliases: ["C#min", "C# minor", "Dbm", "Dbmin", "Db minor"], root: "C#", quality: "minor", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 9 }
  ]},
  { name: "C#7", aliases: ["C# dominant 7", "Db7"], root: "C#", quality: "7", voicings: [
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 9 }
  ]},
  { name: "C#maj7", aliases: ["C#M7", "C# major 7", "Dbmaj7", "DbM7"], root: "C#", quality: "maj7", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 3, 1, 2, 1], fingers: [0, 0, 4, 1, 3, 2], barres: [], baseFret: 1 }
  ]},
  { name: "C#m7", aliases: ["C#min7", "C# minor 7", "Dbm7", "Dbmin7"], root: "C#", quality: "min7", voicings: [
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 4 },
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 9 }
  ]},
  { name: "C#sus2", aliases: ["C# suspended 2", "Dbsus2"], root: "C#", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 }
  ]},
  { name: "C#sus4", aliases: ["C# suspended 4", "C#sus", "Dbsus4", "Dbsus"], root: "C#", quality: "sus4", voicings: [
    { frets: [-1, 1, 1, 3, 4, 4], fingers: [0, 1, 1, 2, 3, 4], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 4 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 9 }
  ]},
  { name: "C#dim", aliases: ["C# diminished", "C#o", "Dbdim", "Dbo"], root: "C#", quality: "dim", voicings: [
    { frets: [-1, -1, 2, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 },
    { frets: [-1, 4, 2, -1, 2, -1], fingers: [0, 4, 1, 0, 2, 0], barres: [], baseFret: 1 }
  ]},
  { name: "C#aug", aliases: ["C# augmented", "C#+", "Dbaug", "Db+"], root: "C#", quality: "aug", voicings: [
    { frets: [-1, 4, 3, 2, 2, 1], fingers: [0, 4, 3, 2, 1, 1], barres: [], baseFret: 1 },
    { frets: [-1, -1, 3, 2, 2, 1], fingers: [0, 0, 4, 2, 3, 1], barres: [], baseFret: 1 }
  ]},

  // ===== D CHORDS =====
  { name: "D", aliases: ["Dmaj", "D major"], root: "D", quality: "major", voicings: [
    { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 10 }
  ]},
  { name: "Dm", aliases: ["Dmin", "D minor"], root: "D", quality: "minor", voicings: [
    { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 10 }
  ]},
  { name: "D7", aliases: ["Ddom7", "D dominant 7"], root: "D", quality: "7", voicings: [
    { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Dmaj7", aliases: ["DM7", "D major 7"], root: "D", quality: "maj7", voicings: [
    { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1], barres: [{ fret: 2, fromString: 3, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Dm7", aliases: ["Dmin7", "D minor 7"], root: "D", quality: "min7", voicings: [
    { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], barres: [{ fret: 1, fromString: 2, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 5 }
  ]},
  { name: "Dsus2", aliases: ["D suspended 2"], root: "D", quality: "sus2", voicings: [
    { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 3, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Dsus4", aliases: ["D suspended 4", "Dsus"], root: "D", quality: "sus4", voicings: [
    { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3], barres: [], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 10 }
  ]},
  { name: "Ddim", aliases: ["D diminished", "Do"], root: "D", quality: "dim", voicings: [
    { frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2], barres: [], baseFret: 1 },
    { frets: [-1, -1, 3, 4, 3, 4], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 }
  ]},
  { name: "Daug", aliases: ["D augmented", "D+"], root: "D", quality: "aug", voicings: [
    { frets: [-1, -1, 0, 3, 3, 2], fingers: [0, 0, 0, 2, 3, 1], barres: [], baseFret: 1 },
    { frets: [-1, 1, 0, 3, 3, 2], fingers: [0, 1, 0, 3, 4, 2], barres: [], baseFret: 1 }
  ]},

  // ===== D# / Eb CHORDS =====
  { name: "D#", aliases: ["D#maj", "D# major", "Eb", "Ebmaj", "Eb major"], root: "D#", quality: "major", voicings: [
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 6 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 11 },
    { frets: [-1, -1, 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3], barres: [], baseFret: 1 }
  ]},
  { name: "D#m", aliases: ["D#min", "D# minor", "Ebm", "Ebmin", "Eb minor"], root: "D#", quality: "minor", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 6 },
    { frets: [-1, -1, 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2], barres: [], baseFret: 1 }
  ]},
  { name: "D#7", aliases: ["D# dominant 7", "Eb7"], root: "D#", quality: "7", voicings: [
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 6 },
    { frets: [-1, -1, 1, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 }
  ]},
  { name: "D#maj7", aliases: ["D#M7", "D# major 7", "Ebmaj7", "EbM7"], root: "D#", quality: "maj7", voicings: [
    { frets: [-1, 1, 1, 3, 3, -1], fingers: [0, 1, 1, 2, 3, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 6 },
    { frets: [-1, -1, 1, 3, 3, 3], fingers: [0, 0, 1, 2, 3, 4], barres: [], baseFret: 1 }
  ]},
  { name: "D#m7", aliases: ["D#min7", "D# minor 7", "Ebm7", "Ebmin7"], root: "D#", quality: "min7", voicings: [
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 6 },
    { frets: [-1, -1, 1, 3, 2, 2], fingers: [0, 0, 1, 4, 2, 3], barres: [], baseFret: 1 }
  ]},
  { name: "D#sus2", aliases: ["D# suspended 2", "Ebsus2"], root: "D#", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 6 }
  ]},
  { name: "D#sus4", aliases: ["D# suspended 4", "D#sus", "Ebsus4", "Ebsus"], root: "D#", quality: "sus4", voicings: [
    { frets: [-1, 1, 1, 3, 4, 4], fingers: [0, 1, 1, 2, 3, 4], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 6 },
    { frets: [-1, -1, 1, 3, 4, 4], fingers: [0, 0, 1, 2, 3, 4], barres: [], baseFret: 1 }
  ]},
  { name: "D#dim", aliases: ["D# diminished", "D#o", "Ebdim", "Ebo"], root: "D#", quality: "dim", voicings: [
    { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 },
    { frets: [-1, -1, 4, 5, 4, 5], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 }
  ]},
  { name: "D#aug", aliases: ["D# augmented", "D#+", "Ebaug", "Eb+"], root: "D#", quality: "aug", voicings: [
    { frets: [-1, -1, 1, 0, 0, 3], fingers: [0, 0, 1, 0, 0, 4], barres: [], baseFret: 1 },
    { frets: [-1, -1, 1, 4, 4, 3], fingers: [0, 0, 1, 3, 4, 2], barres: [], baseFret: 1 }
  ]},

  // ===== E CHORDS =====
  { name: "E", aliases: ["Emaj", "E major"], root: "E", quality: "major", voicings: [
    { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 7 },
    { frets: [-1, -1, 2, 1, 0, 0], fingers: [0, 0, 2, 1, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Em", aliases: ["Emin", "E minor"], root: "E", quality: "minor", voicings: [
    { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 7 },
    { frets: [0, 2, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 3, 0], barres: [], baseFret: 1 }
  ]},
  { name: "E7", aliases: ["Edom7", "E dominant 7"], root: "E", quality: "7", voicings: [
    { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], barres: [], baseFret: 1 },
    { frets: [0, 2, 2, 1, 3, 0], fingers: [0, 2, 3, 1, 4, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 7 }
  ]},
  { name: "Emaj7", aliases: ["EM7", "E major 7"], root: "E", quality: "maj7", voicings: [
    { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 7 }
  ]},
  { name: "Em7", aliases: ["Emin7", "E minor 7"], root: "E", quality: "min7", voicings: [
    { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0], barres: [], baseFret: 1 },
    { frets: [0, 2, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 3, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 7 }
  ]},
  { name: "Esus2", aliases: ["E suspended 2"], root: "E", quality: "sus2", voicings: [
    { frets: [0, 2, 4, 4, 0, 0], fingers: [0, 1, 3, 4, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 7 }
  ]},
  { name: "Esus4", aliases: ["E suspended 4", "Esus"], root: "E", quality: "sus4", voicings: [
    { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0], barres: [], baseFret: 1 },
    { frets: [0, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Edim", aliases: ["E diminished", "Eo"], root: "E", quality: "dim", voicings: [
    { frets: [0, 1, 2, 0, -1, 0], fingers: [0, 1, 2, 0, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 2, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 1 }
  ]},
  { name: "Eaug", aliases: ["E augmented", "E+"], root: "E", quality: "aug", voicings: [
    { frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 2, 1, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 2, 1, 1, 0], fingers: [0, 0, 3, 2, 1, 0], barres: [], baseFret: 1 }
  ]},

  // ===== F CHORDS =====
  { name: "F", aliases: ["Fmaj", "F major"], root: "F", quality: "major", voicings: [
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 },
    { frets: [1, 0, 2, 3, 3, 1], fingers: [5, 0, 2, 3, 4, 1], barres: [], baseFret: 1, thumb: true },
    { frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], barres: [{ fret: 1, fromString: 2, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 8 }
  ]},
  { name: "Fm", aliases: ["Fmin", "F minor"], root: "F", quality: "minor", voicings: [
    { frets: [1, 1, 1, 3, 1, 1], fingers: [1, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 },
    { frets: [1, 0, 1, 3, 1, 1], fingers: [5, 0, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 4, toString: 1 }], baseFret: 1, thumb: true },
    { frets: [-1, -1, 3, 1, 1, 1], fingers: [0, 0, 3, 1, 1, 1], barres: [{ fret: 1, fromString: 3, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 8 }
  ]},
  { name: "F7", aliases: ["Fdom7", "F dominant 7"], root: "F", quality: "7", voicings: [
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 },
    { frets: [-1, -1, 1, 2, 1, 1], fingers: [0, 0, 1, 2, 1, 1], barres: [{ fret: 1, fromString: 4, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Fmaj7", aliases: ["FM7", "F major 7"], root: "F", quality: "maj7", voicings: [
    { frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 2, 1, 1], fingers: [1, 1, 2, 3, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Fm7", aliases: ["Fmin7", "F minor 7"], root: "F", quality: "min7", voicings: [
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 },
    { frets: [-1, -1, 3, 1, 1, 1], fingers: [0, 0, 4, 1, 1, 1], barres: [{ fret: 1, fromString: 3, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Fsus2", aliases: ["F suspended 2"], root: "F", quality: "sus2", voicings: [
    { frets: [-1, -1, 3, 0, 1, 1], fingers: [0, 0, 3, 0, 1, 1], barres: [], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Fsus4", aliases: ["F suspended 4", "Fsus"], root: "F", quality: "sus4", voicings: [
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 1 },
    { frets: [-1, -1, 3, 3, 1, 1], fingers: [0, 0, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 2, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Fdim", aliases: ["F diminished", "Fo"], root: "F", quality: "dim", voicings: [
    { frets: [-1, -1, 3, 1, 0, 1], fingers: [0, 0, 4, 1, 0, 2], barres: [], baseFret: 1 },
    { frets: [1, 2, 3, 1, -1, -1], fingers: [1, 2, 3, 1, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Faug", aliases: ["F augmented", "F+"], root: "F", quality: "aug", voicings: [
    { frets: [-1, -1, 3, 2, 2, 1], fingers: [0, 0, 4, 2, 3, 1], barres: [], baseFret: 1 },
    { frets: [1, 0, 3, 2, 2, 1], fingers: [1, 0, 4, 3, 2, 1], barres: [], baseFret: 1 }
  ]},

  // ===== F# / Gb CHORDS =====
  { name: "F#", aliases: ["F#maj", "F# major", "Gb", "Gbmaj", "Gb major"], root: "F#", quality: "major", voicings: [
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 2 },
    { frets: [1, 0, 2, 3, 3, 1], fingers: [5, 0, 2, 3, 4, 1], barres: [], baseFret: 2, thumb: true },
    { frets: [-1, -1, 4, 3, 2, 2], fingers: [0, 0, 4, 3, 1, 1], barres: [{ fret: 2, fromString: 2, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 9 }
  ]},
  { name: "F#m", aliases: ["F#min", "F# minor", "Gbm", "Gbmin", "Gb minor"], root: "F#", quality: "minor", voicings: [
    { frets: [1, 1, 1, 3, 2, 1], fingers: [1, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 2 },
    { frets: [1, 0, 1, 3, 2, 1], fingers: [5, 0, 1, 4, 3, 1], barres: [], baseFret: 2, thumb: true },
    { frets: [-1, -1, 4, 2, 2, 2], fingers: [0, 0, 4, 1, 1, 1], barres: [{ fret: 2, fromString: 3, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 9 }
  ]},
  { name: "F#7", aliases: ["F# dominant 7", "Gb7"], root: "F#", quality: "7", voicings: [
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 2 },
    { frets: [-1, -1, 4, 3, 2, 0], fingers: [0, 0, 4, 3, 2, 0], barres: [], baseFret: 1 }
  ]},
  { name: "F#maj7", aliases: ["F#M7", "F# major 7", "Gbmaj7", "GbM7"], root: "F#", quality: "maj7", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [-1, -1, 4, 3, 2, 1], fingers: [0, 0, 4, 3, 2, 1], barres: [], baseFret: 1 }
  ]},
  { name: "F#m7", aliases: ["F#min7", "F# minor 7", "Gbm7", "Gbmin7"], root: "F#", quality: "min7", voicings: [
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 2 },
    { frets: [-1, -1, 4, 2, 2, 2], fingers: [0, 0, 4, 1, 1, 1], barres: [{ fret: 2, fromString: 3, toString: 1 }], baseFret: 1 }
  ]},
  { name: "F#sus2", aliases: ["F# suspended 2", "Gbsus2"], root: "F#", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 }
  ]},
  { name: "F#sus4", aliases: ["F# suspended 4", "F#sus", "Gbsus4", "Gbsus"], root: "F#", quality: "sus4", voicings: [
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 2 },
    { frets: [-1, -1, 4, 4, 2, 2], fingers: [0, 0, 3, 4, 1, 1], barres: [{ fret: 2, fromString: 2, toString: 1 }], baseFret: 1 }
  ]},
  { name: "F#dim", aliases: ["F# diminished", "F#o", "Gbdim", "Gbo"], root: "F#", quality: "dim", voicings: [
    { frets: [-1, -1, 4, 2, 1, 2], fingers: [0, 0, 4, 2, 1, 3], barres: [], baseFret: 1 },
    { frets: [2, 3, 4, 2, -1, -1], fingers: [1, 2, 3, 1, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "F#aug", aliases: ["F# augmented", "F#+", "Gbaug", "Gb+"], root: "F#", quality: "aug", voicings: [
    { frets: [-1, -1, 4, 3, 3, 2], fingers: [0, 0, 4, 2, 3, 1], barres: [], baseFret: 1 },
    { frets: [2, 1, 0, 3, 3, 2], fingers: [2, 1, 0, 4, 3, 2], barres: [], baseFret: 1 }
  ]},

  // ===== G CHORDS =====
  { name: "G", aliases: ["Gmaj", "G major"], root: "G", quality: "major", voicings: [
    { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], barres: [], baseFret: 1 },
    { frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 3 }
  ]},
  { name: "Gm", aliases: ["Gmin", "G minor"], root: "G", quality: "minor", voicings: [
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 3 },
    { frets: [1, 0, 1, 3, 3, 1], fingers: [5, 0, 1, 3, 4, 1], barres: [], baseFret: 3, thumb: true },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 10 },
    { frets: [-1, -1, 5, 3, 3, 3], fingers: [0, 0, 4, 1, 1, 1], barres: [{ fret: 3, fromString: 3, toString: 1 }], baseFret: 1 }
  ]},
  { name: "G7", aliases: ["Gdom7", "G dominant 7"], root: "G", quality: "7", voicings: [
    { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 3 },
    { frets: [-1, -1, 0, 0, 0, 1], fingers: [0, 0, 0, 0, 0, 1], barres: [], baseFret: 1 }
  ]},
  { name: "Gmaj7", aliases: ["GM7", "G major 7"], root: "G", quality: "maj7", voicings: [
    { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 1, 0, 0, 0, 2], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 10 }
  ]},
  { name: "Gm7", aliases: ["Gmin7", "G minor 7"], root: "G", quality: "min7", voicings: [
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 3 },
    { frets: [-1, -1, 5, 3, 3, 3], fingers: [0, 0, 4, 1, 1, 2], barres: [{ fret: 3, fromString: 3, toString: 2 }], baseFret: 1 }
  ]},
  { name: "Gsus2", aliases: ["G suspended 2"], root: "G", quality: "sus2", voicings: [
    { frets: [3, 0, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 2, 3], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 10 }
  ]},
  { name: "Gsus4", aliases: ["G suspended 4", "Gsus"], root: "G", quality: "sus4", voicings: [
    { frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4], barres: [], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 3 }
  ]},
  { name: "Gdim", aliases: ["G diminished", "Go"], root: "G", quality: "dim", voicings: [
    { frets: [-1, -1, 5, 3, 2, 3], fingers: [0, 0, 4, 2, 1, 3], barres: [], baseFret: 1 },
    { frets: [3, 4, 5, 3, -1, -1], fingers: [1, 2, 3, 1, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Gaug", aliases: ["G augmented", "G+"], root: "G", quality: "aug", voicings: [
    { frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, 0, 0, 4], barres: [], baseFret: 1 },
    { frets: [-1, -1, 5, 4, 4, 3], fingers: [0, 0, 4, 2, 3, 1], barres: [], baseFret: 1 }
  ]},

  // ===== G# / Ab CHORDS =====
  { name: "G#", aliases: ["G#maj", "G# major", "Ab", "Abmaj", "Ab major"], root: "G#", quality: "major", voicings: [
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 4 },
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 11 },
    { frets: [-1, -1, 1, 1, 1, 4], fingers: [0, 0, 1, 1, 1, 4], barres: [{ fret: 1, fromString: 4, toString: 2 }], baseFret: 1 }
  ]},
  { name: "G#m", aliases: ["G#min", "G# minor", "Abm", "Abmin", "Ab minor"], root: "G#", quality: "minor", voicings: [
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 1, 1, 0, 4], fingers: [0, 0, 1, 2, 0, 4], barres: [], baseFret: 1 }
  ]},
  { name: "G#7", aliases: ["G# dominant 7", "Ab7"], root: "G#", quality: "7", voicings: [
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 1, 1, 1, 2], fingers: [0, 0, 1, 1, 1, 2], barres: [{ fret: 1, fromString: 4, toString: 2 }], baseFret: 1 }
  ]},
  { name: "G#maj7", aliases: ["G#M7", "G# major 7", "Abmaj7", "AbM7"], root: "G#", quality: "maj7", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 1, 1, 1, 3], fingers: [0, 0, 1, 1, 1, 4], barres: [{ fret: 1, fromString: 4, toString: 2 }], baseFret: 1 }
  ]},
  { name: "G#m7", aliases: ["G#min7", "G# minor 7", "Abm7", "Abmin7"], root: "G#", quality: "min7", voicings: [
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 1, 1, 0, 2], fingers: [0, 0, 1, 2, 0, 3], barres: [], baseFret: 1 }
  ]},
  { name: "G#sus2", aliases: ["G# suspended 2", "Absus2"], root: "G#", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 4 }
  ]},
  { name: "G#sus4", aliases: ["G# suspended 4", "G#sus", "Absus4", "Absus"], root: "G#", quality: "sus4", voicings: [
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 4 },
    { frets: [-1, -1, 1, 1, 2, 4], fingers: [0, 0, 1, 1, 2, 4], barres: [{ fret: 1, fromString: 4, toString: 3 }], baseFret: 1 }
  ]},
  { name: "G#dim", aliases: ["G# diminished", "G#o", "Abdim", "Abo"], root: "G#", quality: "dim", voicings: [
    { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2], barres: [], baseFret: 1 },
    { frets: [4, 5, 6, 4, -1, -1], fingers: [1, 2, 3, 1, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "G#aug", aliases: ["G# augmented", "G#+", "Abaug", "Ab+"], root: "G#", quality: "aug", voicings: [
    { frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 2, 1, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 2, 1, 1, 0], fingers: [0, 0, 3, 2, 1, 0], barres: [], baseFret: 1 }
  ]},

  // ===== A CHORDS =====
  { name: "A", aliases: ["Amaj", "A major"], root: "A", quality: "major", voicings: [
    { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 5 },
    { frets: [-1, 0, 2, 2, 2, 5], fingers: [0, 0, 1, 1, 1, 4], barres: [{ fret: 2, fromString: 4, toString: 2 }], baseFret: 1 }
  ]},
  { name: "Am", aliases: ["Amin", "A minor"], root: "A", quality: "minor", voicings: [
    { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 5 },
    { frets: [-1, 0, 2, 2, 1, 3], fingers: [0, 0, 2, 3, 1, 4], barres: [], baseFret: 1 }
  ]},
  { name: "A7", aliases: ["Adom7", "A dominant 7"], root: "A", quality: "7", voicings: [
    { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 5 },
    { frets: [-1, 0, 2, 2, 2, 3], fingers: [0, 0, 1, 1, 1, 2], barres: [{ fret: 2, fromString: 4, toString: 2 }], baseFret: 1 }
  ]},
  { name: "Amaj7", aliases: ["AM7", "A major 7"], root: "A", quality: "maj7", voicings: [
    { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Am7", aliases: ["Amin7", "A minor 7"], root: "A", quality: "min7", voicings: [
    { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 5 },
    { frets: [-1, 0, 2, 2, 1, 3], fingers: [0, 0, 2, 3, 1, 4], barres: [], baseFret: 1 }
  ]},
  { name: "Asus2", aliases: ["A suspended 2"], root: "A", quality: "sus2", voicings: [
    { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Asus4", aliases: ["A suspended 4", "Asus"], root: "A", quality: "sus4", voicings: [
    { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0], barres: [], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 5 }
  ]},
  { name: "Adim", aliases: ["A diminished", "Ao"], root: "A", quality: "dim", voicings: [
    { frets: [-1, 0, 1, 2, 1, -1], fingers: [0, 0, 1, 3, 2, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 4 }
  ]},
  { name: "Aaug", aliases: ["A augmented", "A+"], root: "A", quality: "aug", voicings: [
    { frets: [-1, 0, 3, 2, 2, 1], fingers: [0, 0, 4, 3, 2, 1], barres: [], baseFret: 1 },
    { frets: [-1, 0, 3, 2, 2, 5], fingers: [0, 0, 3, 2, 1, 4], barres: [], baseFret: 1 }
  ]},

  // ===== A# / Bb CHORDS =====
  { name: "A#", aliases: ["A#maj", "A# major", "Bb", "Bbmaj", "Bb major"], root: "A#", quality: "major", voicings: [
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 6 },
    { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 }
  ]},
  { name: "A#m", aliases: ["A#min", "A# minor", "Bbm", "Bbmin", "Bb minor"], root: "A#", quality: "minor", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 6 }
  ]},
  { name: "A#7", aliases: ["A# dominant 7", "Bb7"], root: "A#", quality: "7", voicings: [
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 6 }
  ]},
  { name: "A#maj7", aliases: ["A#M7", "A# major 7", "Bbmaj7", "BbM7"], root: "A#", quality: "maj7", voicings: [
    { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 6 }
  ]},
  { name: "A#m7", aliases: ["A#min7", "A# minor 7", "Bbm7", "Bbmin7"], root: "A#", quality: "min7", voicings: [
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 1 },
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 6 }
  ]},
  { name: "A#sus2", aliases: ["A# suspended 2", "Bbsus2"], root: "A#", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 }
  ]},
  { name: "A#sus4", aliases: ["A# suspended 4", "A#sus", "Bbsus4", "Bbsus"], root: "A#", quality: "sus4", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 2, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 1 },
    { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 6 }
  ]},
  { name: "A#dim", aliases: ["A# diminished", "A#o", "Bbdim", "Bbo"], root: "A#", quality: "dim", voicings: [
    { frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 2, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4], barres: [], baseFret: 2 }
  ]},
  { name: "A#aug", aliases: ["A# augmented", "A#+", "Bbaug", "Bb+"], root: "A#", quality: "aug", voicings: [
    { frets: [-1, 1, 0, 3, 3, 2], fingers: [0, 1, 0, 3, 4, 2], barres: [], baseFret: 1 },
    { frets: [-1, -1, 0, 3, 3, 2], fingers: [0, 0, 0, 2, 3, 1], barres: [], baseFret: 1 }
  ]},

  // ===== B CHORDS =====
  { name: "B", aliases: ["Bmaj", "B major"], root: "B", quality: "major", voicings: [
    { frets: [-1, 1, 1, 3, 3, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 7 },
    { frets: [1, 0, 2, 3, 3, 1], fingers: [5, 0, 2, 3, 4, 1], barres: [], baseFret: 7, thumb: true },
    { frets: [-1, -1, 4, 4, 4, 2], fingers: [0, 0, 2, 3, 4, 1], barres: [], baseFret: 1 }
  ]},
  { name: "Bm", aliases: ["Bmin", "B minor"], root: "B", quality: "minor", voicings: [
    { frets: [-1, 1, 1, 3, 2, 1], fingers: [0, 1, 1, 4, 3, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 7 },
    { frets: [1, 0, 1, 3, 3, 1], fingers: [5, 0, 1, 3, 4, 2], barres: [], baseFret: 7, thumb: true },
    { frets: [-1, -1, 4, 4, 3, 2], fingers: [0, 0, 3, 4, 2, 1], barres: [], baseFret: 1 }
  ]},
  { name: "B7", aliases: ["Bdom7", "B dominant 7"], root: "B", quality: "7", voicings: [
    { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 1, 1], fingers: [0, 1, 1, 3, 1, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [1, 1, 2, 1, 1, 1], fingers: [1, 1, 2, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 7 }
  ]},
  { name: "Bmaj7", aliases: ["BM7", "B major 7"], root: "B", quality: "maj7", voicings: [
    { frets: [-1, 1, 1, 3, 3, -1], fingers: [0, 1, 1, 2, 3, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 2 },
    { frets: [-1, 2, 1, 3, 0, -1], fingers: [0, 2, 1, 3, 0, 0], barres: [], baseFret: 1 }
  ]},
  { name: "Bm7", aliases: ["Bmin7", "B minor 7"], root: "B", quality: "min7", voicings: [
    { frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3], barres: [], baseFret: 1 },
    { frets: [-1, 1, 1, 3, 2, -1], fingers: [0, 1, 1, 4, 2, 0], barres: [{ fret: 1, fromString: 5, toString: 4 }], baseFret: 2 },
    { frets: [1, 1, 1, 1, 1, 1], fingers: [1, 1, 1, 1, 1, 1], barres: [{ fret: 1, fromString: 6, toString: 1 }], baseFret: 7 }
  ]},
  { name: "Bsus2", aliases: ["B suspended 2"], root: "B", quality: "sus2", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1], barres: [{ fret: 2, fromString: 2, toString: 1 }], baseFret: 1 }
  ]},
  { name: "Bsus4", aliases: ["B suspended 4", "Bsus"], root: "B", quality: "sus4", voicings: [
    { frets: [-1, 1, 1, 3, 4, 1], fingers: [0, 1, 1, 2, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 1 }], baseFret: 2 },
    { frets: [-1, 2, 4, 4, 5, 2], fingers: [0, 1, 3, 3, 4, 1], barres: [], baseFret: 1 }
  ]},
  { name: "Bdim", aliases: ["B diminished", "Bo"], root: "B", quality: "dim", voicings: [
    { frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], barres: [], baseFret: 1 },
    { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2], barres: [], baseFret: 1 }
  ]},
  { name: "Baug", aliases: ["B augmented", "B+"], root: "B", quality: "aug", voicings: [
    { frets: [-1, 2, 1, 0, 0, 3], fingers: [0, 2, 1, 0, 0, 4], barres: [], baseFret: 1 },
    { frets: [-1, -1, 1, 0, 0, 3], fingers: [0, 0, 1, 0, 0, 4], barres: [], baseFret: 1 }
  ]}
];

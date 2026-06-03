// AUTO-GENERAT din wordbank.json (+ assets/stress.json, assets/rhyme_extra.json) — NU EDITA (python gen_rhymes.py)
// RHYME_INDEX: cheie_rimă → [cuvinte]. RHYME_KEYS: cuvânt → {p:perfect, a:asonanță, n:silabe}.
// RHYME_STRESS: cuvânt → nucleu accentuat (override accent RoLEX, paritate JS).
// RHYME_EXTRA: cuvânt → rime externe (RoLEX) pt cele sub-deservite în bancă (grad 4→3).
const RHYME_INDEX = {
  "asonanta": {
    "1": [
      "desăvârși",
      "dârz",
      "izbândi",
      "tărâm",
      "urât",
      "veșmânt",
      "vânt",
      "îmblânzi"
    ],
    "1.@": [
      "brânză",
      "mână"
    ],
    "1.e": [
      "plânge",
      "râde",
      "înfrânge"
    ],
    "1.i.e": [
      "câine",
      "lămâie",
      "pâine"
    ],
    "@": [
      "adevăr",
      "măr",
      "păr",
      "sări"
    ],
    "@.i.u.i": [
      "dăinui"
    ],
    "@.u.i": [
      "dezlănțui",
      "dezvălui"
    ],
    "a": [
      "alerga",
      "asculta",
      "bani",
      "bea",
      "băiat",
      "cafea",
      "cal",
      "cald",
      "cap",
      "ceas",
      "copac",
      "corolar",
      "curaj",
      "cânta",
      "dansa",
      "destrăma",
      "extaz",
      "geam",
      "hotar",
      "infinitezimal",
      "lanț",
      "monumental",
      "mânca",
      "nas",
      "neînduplecat",
      "neînfricat",
      "oraș",
      "pat",
      "postulat",
      "preschimba",
      "sat",
      "spulbera",
      "stea",
      "subjuga",
      "talisman",
      "temerar",
      "viclean",
      "întunecat"
    ],
    "a.@": [
      "apă",
      "casă",
      "ceapă",
      "cireașă",
      "comoară",
      "coroană",
      "fată",
      "fortăreață",
      "făgăduială",
      "iarbă",
      "mamă",
      "masă",
      "otravă",
      "pară",
      "piatră",
      "rană",
      "speranță",
      "stradă",
      "tată",
      "tăgadă",
      "vacă",
      "varză",
      "vrajă",
      "zahăr",
      "zăpadă",
      "îndoială"
    ],
    "a.@.@": [
      "flacără"
    ],
    "a.@.e": [
      "pasăre"
    ],
    "a.e": [
      "accidentalitate",
      "actualitate",
      "alteritate",
      "ambiguitate",
      "anterioritate",
      "anxietate",
      "carne",
      "carte",
      "cauzalitate",
      "cetate",
      "complementaritate",
      "conceptualizare",
      "coroborare",
      "corporalitate",
      "cărare",
      "echivocitate",
      "efemeritate",
      "egalitate",
      "esențialitate",
      "eternitate",
      "exterioritate",
      "facticitate",
      "falsificabilitate",
      "finalitate",
      "floare",
      "frate",
      "frustrare",
      "imaterialitate",
      "imprevizibilitate",
      "indignare",
      "inexorabilitate",
      "infirmare",
      "intangibilitate",
      "interioritate",
      "intersubiectivitate",
      "lapte",
      "libertate",
      "loialitate",
      "mare",
      "modalitate",
      "necesitate",
      "nedreptate",
      "obiectivitate",
      "perenitate",
      "perisabilitate",
      "plauzibilitate",
      "posterioritate",
      "potențialitate",
      "previzibilitate",
      "reciprocitate",
      "rememorare",
      "remușcare",
      "sare",
      "seninătate",
      "simultaneitate",
      "soare",
      "spate",
      "spațialitate",
      "spiritualitate",
      "stipulare",
      "subiectivitate",
      "substanțialitate",
      "temporalitate",
      "tenacitate",
      "trădare",
      "ubicuitate",
      "uitare",
      "verificabilitate",
      "verosimilitate",
      "vindecare",
      "virtualitate",
      "șarpe"
    ],
    "a.i": [
      "imuabil",
      "indescifrabil",
      "inefabil",
      "irevocabil",
      "perisabil"
    ],
    "a.i.@": [
      "graniță",
      "taină"
    ],
    "a.i.e": [
      "demonstrație",
      "fundație",
      "mantie",
      "meditație",
      "ploaie",
      "prăpastie"
    ],
    "a.o": [
      "haos"
    ],
    "a.u": [
      "scaun"
    ],
    "e": [
      "blestem",
      "cer",
      "cuceri",
      "dispreț",
      "efemer",
      "elev",
      "etern",
      "giuvaier",
      "grotesc",
      "lent",
      "raționament",
      "resentiment",
      "secret",
      "vârtej"
    ],
    "e.@": [
      "ambivalență",
      "anamneză",
      "concomitență",
      "contingență",
      "epistemă",
      "imanență",
      "incongruență",
      "inferență",
      "ipoteză",
      "legendă",
      "lemă",
      "reminiscență",
      "rezistență"
    ],
    "e.e": [
      "bere",
      "deznădejde",
      "merge",
      "miere",
      "perete",
      "pește",
      "prieten",
      "putere",
      "rece",
      "tandrețe",
      "tăcere",
      "ureche",
      "verde",
      "vesel"
    ],
    "e.i": [
      "puternic",
      "întuneric"
    ],
    "e.i.@": [
      "dialectică",
      "temniță"
    ],
    "e.i.e": [
      "cheie",
      "femeie",
      "introspecție",
      "scânteie",
      "smerenie"
    ],
    "e.i.u": [
      "imperiu"
    ],
    "e.u": [
      "sceptru"
    ],
    "e.u.e": [
      "iepure"
    ],
    "i": [
      "abis",
      "antropocentrism",
      "apriorism",
      "azil",
      "bunic",
      "ceai",
      "citi",
      "copil",
      "coruptibil",
      "destin",
      "determinism",
      "empirism",
      "exil",
      "imponderabil",
      "incoruptibil",
      "indelebil",
      "ineluctabil",
      "inextricabil",
      "infinit",
      "ireductibil",
      "labirint",
      "mic",
      "mit",
      "nestăvilit",
      "nihilism",
      "nisip",
      "paralogism",
      "perfectibil",
      "privi",
      "rapid",
      "raționalism",
      "relativism",
      "silogism",
      "sofism",
      "solipsism",
      "sublim",
      "trist",
      "vecin",
      "vin"
    ],
    "i.@": [
      "albină",
      "conștiință",
      "credință",
      "enigmă",
      "găină",
      "hermeneutică",
      "lumină",
      "oglindă",
      "paradigmă",
      "pisică",
      "premisă",
      "ruină"
    ],
    "i.e": [
      "abducție",
      "abulie",
      "acedie",
      "amintire",
      "amnezie",
      "antinomie",
      "apatie",
      "aporie",
      "armonie",
      "bogăție",
      "cicatrice",
      "contemplație",
      "deducție",
      "dezamăgire",
      "dinte",
      "entropie",
      "escatologie",
      "euforie",
      "fenomenologie",
      "hârtie",
      "letargie",
      "lăcomie",
      "melancolie",
      "moștenire",
      "nemărginire",
      "nostalgie",
      "ontologie",
      "premoniție",
      "presimțire",
      "presupoziție",
      "pribegie",
      "profeție",
      "reverie",
      "scrie",
      "soteriologie",
      "sărăcie",
      "tautologie",
      "teleologie",
      "trufie",
      "uimire",
      "uneltire",
      "venerație",
      "vinovăție",
      "vremelnicie",
      "zădărnicie"
    ],
    "i.i.@": [
      "inimă",
      "intrigă",
      "metafizică"
    ],
    "i.i.e": [
      "ambiție",
      "neliniște",
      "supoziție",
      "tradiție"
    ],
    "i.i.u": [
      "sacrificiu"
    ],
    "i.u": [
      "echilibru",
      "străveziu"
    ],
    "o": [
      "ademenitor",
      "amăgitor",
      "antidot",
      "blazon",
      "cartof",
      "complot",
      "copleșitor",
      "creion",
      "dormi",
      "foc",
      "frumos",
      "molcom",
      "necruțător",
      "nor",
      "ochi",
      "om",
      "orizont",
      "picior",
      "porc",
      "profesor",
      "sfâșietor",
      "strălucitor",
      "telefon",
      "tron",
      "viitor",
      "vorbi"
    ],
    "o.@": [
      "axiomă",
      "busolă",
      "ciorbă",
      "parabolă",
      "revoltă",
      "soră"
    ],
    "o.e": [
      "fasole"
    ],
    "o.i.e": [
      "memorie",
      "ordine",
      "roșie"
    ],
    "o.o": [
      "doctor",
      "morcov"
    ],
    "u": [
      "drum",
      "făuri",
      "iubi",
      "lup",
      "ou",
      "râu",
      "trecut",
      "unt",
      "urs"
    ],
    "u.@": [
      "cenușă",
      "conjectură",
      "căpșună",
      "frunză",
      "furtună",
      "gură",
      "lună",
      "minciună",
      "muscă",
      "nucă",
      "prună",
      "prăjitură",
      "supă",
      "umbră",
      "ușă"
    ],
    "u.e": [
      "abstracțiune",
      "amărăciune",
      "compasiune",
      "culme",
      "cătușe",
      "deșertăciune",
      "munte",
      "pădure",
      "rațiune",
      "răscruce",
      "strugure",
      "vulpe"
    ],
    "u.i": [
      "lăuntric",
      "plăsmui",
      "tăinui"
    ],
    "u.i.e": [
      "concluzie",
      "corupție",
      "iluzie",
      "inducție"
    ],
    "u.i.u": [
      "refugiu"
    ]
  },
  "perfect": {
    "1.d.e": [
      "râde"
    ],
    "1.i.e": [
      "lămâie"
    ],
    "1.i.n.e": [
      "câine",
      "pâine"
    ],
    "1.m": [
      "tărâm"
    ],
    "1.n.@": [
      "mână"
    ],
    "1.n.d.j": [
      "izbândi"
    ],
    "1.n.dZ.e": [
      "plânge",
      "înfrânge"
    ],
    "1.n.t": [
      "veșmânt",
      "vânt"
    ],
    "1.n.z.@": [
      "brânză"
    ],
    "1.n.z.j": [
      "îmblânzi"
    ],
    "1.r.S.j": [
      "desăvârși"
    ],
    "1.r.z": [
      "dârz"
    ],
    "1.t": [
      "urât"
    ],
    "@.i.n.u.i": [
      "dăinui"
    ],
    "@.l.u.i": [
      "dezvălui"
    ],
    "@.n.T.u.i": [
      "dezlănțui"
    ],
    "@.r": [
      "adevăr",
      "măr",
      "păr"
    ],
    "@.r.j": [
      "sări"
    ],
    "a": [
      "alerga",
      "asculta",
      "bea",
      "cafea",
      "cânta",
      "dansa",
      "destrăma",
      "mânca",
      "preschimba",
      "spulbera",
      "stea",
      "subjuga"
    ],
    "a.S": [
      "oraș"
    ],
    "a.S.@": [
      "cireașă"
    ],
    "a.T.@": [
      "fortăreață"
    ],
    "a.T.i.e": [
      "demonstrație",
      "fundație",
      "meditație"
    ],
    "a.Z": [
      "curaj"
    ],
    "a.Z.@": [
      "vrajă"
    ],
    "a.b.i.l": [
      "imuabil",
      "indescifrabil",
      "inefabil",
      "irevocabil",
      "perisabil"
    ],
    "a.d.@": [
      "stradă",
      "tăgadă",
      "zăpadă"
    ],
    "a.h.@.r": [
      "zahăr"
    ],
    "a.i.e": [
      "ploaie"
    ],
    "a.i.n.@": [
      "taină"
    ],
    "a.k": [
      "copac"
    ],
    "a.k.@": [
      "vacă"
    ],
    "a.k.@.r.@": [
      "flacără"
    ],
    "a.l": [
      "cal",
      "infinitezimal",
      "monumental"
    ],
    "a.l.@": [
      "făgăduială",
      "îndoială"
    ],
    "a.l.d": [
      "cald"
    ],
    "a.m": [
      "geam"
    ],
    "a.m.@": [
      "mamă"
    ],
    "a.n": [
      "talisman",
      "viclean"
    ],
    "a.n.@": [
      "coroană",
      "rană"
    ],
    "a.n.T": [
      "lanț"
    ],
    "a.n.T.@": [
      "speranță"
    ],
    "a.n.i.T.@": [
      "graniță"
    ],
    "a.n.j": [
      "bani"
    ],
    "a.n.t.i.e": [
      "mantie"
    ],
    "a.o.s": [
      "haos"
    ],
    "a.p": [
      "cap"
    ],
    "a.p.@": [
      "apă",
      "ceapă"
    ],
    "a.p.t.e": [
      "lapte"
    ],
    "a.r": [
      "corolar",
      "hotar",
      "temerar"
    ],
    "a.r.@": [
      "comoară",
      "pară"
    ],
    "a.r.b.@": [
      "iarbă"
    ],
    "a.r.e": [
      "conceptualizare",
      "coroborare",
      "cărare",
      "floare",
      "frustrare",
      "indignare",
      "infirmare",
      "mare",
      "rememorare",
      "remușcare",
      "sare",
      "soare",
      "stipulare",
      "trădare",
      "uitare",
      "vindecare"
    ],
    "a.r.n.e": [
      "carne"
    ],
    "a.r.p.e": [
      "șarpe"
    ],
    "a.r.t.e": [
      "carte"
    ],
    "a.r.z.@": [
      "varză"
    ],
    "a.s": [
      "ceas",
      "nas"
    ],
    "a.s.@": [
      "casă",
      "masă"
    ],
    "a.s.@.r.e": [
      "pasăre"
    ],
    "a.s.t.i.e": [
      "prăpastie"
    ],
    "a.t": [
      "băiat",
      "neînduplecat",
      "neînfricat",
      "pat",
      "postulat",
      "sat",
      "întunecat"
    ],
    "a.t.@": [
      "fată",
      "tată"
    ],
    "a.t.e": [
      "accidentalitate",
      "actualitate",
      "alteritate",
      "ambiguitate",
      "anterioritate",
      "anxietate",
      "cauzalitate",
      "cetate",
      "complementaritate",
      "corporalitate",
      "echivocitate",
      "efemeritate",
      "egalitate",
      "esențialitate",
      "eternitate",
      "exterioritate",
      "facticitate",
      "falsificabilitate",
      "finalitate",
      "frate",
      "imaterialitate",
      "imprevizibilitate",
      "inexorabilitate",
      "intangibilitate",
      "interioritate",
      "intersubiectivitate",
      "libertate",
      "loialitate",
      "modalitate",
      "necesitate",
      "nedreptate",
      "obiectivitate",
      "perenitate",
      "perisabilitate",
      "plauzibilitate",
      "posterioritate",
      "potențialitate",
      "previzibilitate",
      "reciprocitate",
      "seninătate",
      "simultaneitate",
      "spate",
      "spațialitate",
      "spiritualitate",
      "subiectivitate",
      "substanțialitate",
      "temporalitate",
      "tenacitate",
      "ubicuitate",
      "verificabilitate",
      "verosimilitate",
      "virtualitate"
    ],
    "a.t.r.@": [
      "piatră"
    ],
    "a.u.n": [
      "scaun"
    ],
    "a.v.@": [
      "otravă"
    ],
    "a.z": [
      "extaz"
    ],
    "e.S.t.e": [
      "pește"
    ],
    "e.T": [
      "dispreț"
    ],
    "e.T.e": [
      "tandrețe"
    ],
    "e.Z": [
      "vârtej"
    ],
    "e.Z.d.e": [
      "deznădejde"
    ],
    "e.i.e": [
      "cheie",
      "femeie",
      "scânteie"
    ],
    "e.k.T.i.e": [
      "introspecție"
    ],
    "e.k.e": [
      "ureche"
    ],
    "e.k.t.i.k.@": [
      "dialectică"
    ],
    "e.m": [
      "blestem"
    ],
    "e.m.@": [
      "epistemă",
      "lemă"
    ],
    "e.m.n.i.T.@": [
      "temniță"
    ],
    "e.n.T.@": [
      "ambivalență",
      "concomitență",
      "contingență",
      "imanență",
      "incongruență",
      "inferență",
      "reminiscență",
      "rezistență"
    ],
    "e.n.d.@": [
      "legendă"
    ],
    "e.n.i.e": [
      "smerenie"
    ],
    "e.n.t": [
      "lent",
      "raționament",
      "resentiment"
    ],
    "e.p.t.r.u": [
      "sceptru"
    ],
    "e.p.u.r.e": [
      "iepure"
    ],
    "e.r": [
      "cer",
      "efemer",
      "giuvaier"
    ],
    "e.r.d.e": [
      "verde"
    ],
    "e.r.dZ.e": [
      "merge"
    ],
    "e.r.e": [
      "bere",
      "miere",
      "putere",
      "tăcere"
    ],
    "e.r.i.k": [
      "întuneric"
    ],
    "e.r.i.u": [
      "imperiu"
    ],
    "e.r.j": [
      "cuceri"
    ],
    "e.r.n": [
      "etern"
    ],
    "e.r.n.i.k": [
      "puternic"
    ],
    "e.s.e.l": [
      "vesel"
    ],
    "e.s.k": [
      "grotesc"
    ],
    "e.t": [
      "secret"
    ],
    "e.t.e": [
      "perete"
    ],
    "e.t.e.n": [
      "prieten"
    ],
    "e.tS.e": [
      "rece"
    ],
    "e.v": [
      "elev"
    ],
    "e.z.@": [
      "anamneză",
      "ipoteză"
    ],
    "i": [
      "ceai"
    ],
    "i.T.i.e": [
      "ambiție",
      "supoziție",
      "tradiție"
    ],
    "i.b.r.u": [
      "echilibru"
    ],
    "i.d": [
      "rapid"
    ],
    "i.e": [
      "abducție",
      "abulie",
      "acedie",
      "amnezie",
      "antinomie",
      "apatie",
      "aporie",
      "armonie",
      "bogăție",
      "contemplație",
      "deducție",
      "entropie",
      "escatologie",
      "euforie",
      "fenomenologie",
      "hârtie",
      "letargie",
      "lăcomie",
      "melancolie",
      "nostalgie",
      "ontologie",
      "premoniție",
      "presupoziție",
      "pribegie",
      "profeție",
      "reverie",
      "scrie",
      "soteriologie",
      "sărăcie",
      "tautologie",
      "teleologie",
      "trufie",
      "venerație",
      "vinovăție",
      "vremelnicie",
      "zădărnicie"
    ],
    "i.g.m.@": [
      "enigmă",
      "paradigmă"
    ],
    "i.k": [
      "bunic",
      "mic"
    ],
    "i.k.@": [
      "hermeneutică",
      "pisică"
    ],
    "i.l": [
      "azil",
      "copil",
      "coruptibil",
      "exil",
      "imponderabil",
      "incoruptibil",
      "indelebil",
      "ineluctabil",
      "inextricabil",
      "ireductibil",
      "perfectibil"
    ],
    "i.m": [
      "sublim"
    ],
    "i.n": [
      "destin",
      "vecin",
      "vin"
    ],
    "i.n.@": [
      "albină",
      "găină",
      "lumină",
      "ruină"
    ],
    "i.n.T.@": [
      "conștiință",
      "credință"
    ],
    "i.n.d.@": [
      "oglindă"
    ],
    "i.n.i.S.t.e": [
      "neliniște"
    ],
    "i.n.i.m.@": [
      "inimă"
    ],
    "i.n.t": [
      "labirint"
    ],
    "i.n.t.e": [
      "dinte"
    ],
    "i.n.t.r.i.g.@": [
      "intrigă"
    ],
    "i.p": [
      "nisip"
    ],
    "i.r.e": [
      "amintire",
      "dezamăgire",
      "moștenire",
      "nemărginire",
      "presimțire",
      "uimire",
      "uneltire"
    ],
    "i.s": [
      "abis"
    ],
    "i.s.@": [
      "premisă"
    ],
    "i.s.m": [
      "antropocentrism",
      "apriorism",
      "determinism",
      "empirism",
      "nihilism",
      "paralogism",
      "raționalism",
      "relativism",
      "silogism",
      "sofism",
      "solipsism"
    ],
    "i.s.t": [
      "trist"
    ],
    "i.t": [
      "infinit",
      "mit",
      "nestăvilit"
    ],
    "i.t.j": [
      "citi"
    ],
    "i.tS.e": [
      "cicatrice"
    ],
    "i.tS.i.u": [
      "sacrificiu"
    ],
    "i.u": [
      "străveziu"
    ],
    "i.v.j": [
      "privi"
    ],
    "i.z.i.k.@": [
      "metafizică"
    ],
    "o.S.i.e": [
      "roșie"
    ],
    "o.f": [
      "cartof"
    ],
    "o.k": [
      "foc"
    ],
    "o.k.j": [
      "ochi"
    ],
    "o.k.t.o.r": [
      "doctor"
    ],
    "o.l.@": [
      "busolă",
      "parabolă"
    ],
    "o.l.e": [
      "fasole"
    ],
    "o.l.t.@": [
      "revoltă"
    ],
    "o.m": [
      "molcom",
      "om"
    ],
    "o.m.@": [
      "axiomă"
    ],
    "o.n": [
      "blazon",
      "creion",
      "telefon",
      "tron"
    ],
    "o.n.t": [
      "orizont"
    ],
    "o.r": [
      "ademenitor",
      "amăgitor",
      "copleșitor",
      "necruțător",
      "nor",
      "picior",
      "profesor",
      "sfâșietor",
      "strălucitor",
      "viitor"
    ],
    "o.r.@": [
      "soră"
    ],
    "o.r.b.@": [
      "ciorbă"
    ],
    "o.r.b.j": [
      "vorbi"
    ],
    "o.r.d.i.n.e": [
      "ordine"
    ],
    "o.r.i.e": [
      "memorie"
    ],
    "o.r.k": [
      "porc"
    ],
    "o.r.k.o.v": [
      "morcov"
    ],
    "o.r.m.j": [
      "dormi"
    ],
    "o.s": [
      "frumos"
    ],
    "o.t": [
      "antidot",
      "complot"
    ],
    "u": [
      "ou",
      "râu"
    ],
    "u.S.@": [
      "cenușă",
      "ușă"
    ],
    "u.S.e": [
      "cătușe"
    ],
    "u.b.j": [
      "iubi"
    ],
    "u.dZ.i.u": [
      "refugiu"
    ],
    "u.i": [
      "plăsmui",
      "tăinui"
    ],
    "u.k.@": [
      "nucă"
    ],
    "u.k.T.i.e": [
      "inducție"
    ],
    "u.l.m.e": [
      "culme"
    ],
    "u.l.p.e": [
      "vulpe"
    ],
    "u.m": [
      "drum"
    ],
    "u.m.b.r.@": [
      "umbră"
    ],
    "u.n.@": [
      "căpșună",
      "furtună",
      "lună",
      "minciună",
      "prună"
    ],
    "u.n.e": [
      "abstracțiune",
      "amărăciune",
      "compasiune",
      "deșertăciune",
      "rațiune"
    ],
    "u.n.t": [
      "unt"
    ],
    "u.n.t.e": [
      "munte"
    ],
    "u.n.t.r.i.k": [
      "lăuntric"
    ],
    "u.n.z.@": [
      "frunză"
    ],
    "u.p": [
      "lup"
    ],
    "u.p.@": [
      "supă"
    ],
    "u.p.T.i.e": [
      "corupție"
    ],
    "u.r.@": [
      "conjectură",
      "gură",
      "prăjitură"
    ],
    "u.r.e": [
      "pădure",
      "strugure"
    ],
    "u.r.j": [
      "făuri"
    ],
    "u.r.s": [
      "urs"
    ],
    "u.s.k.@": [
      "muscă"
    ],
    "u.t": [
      "trecut"
    ],
    "u.tS.e": [
      "răscruce"
    ],
    "u.z.i.e": [
      "concluzie",
      "iluzie"
    ]
  }
};

const RHYME_KEYS = {
  "abducție": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "abis": {
    "a": "i",
    "n": 2,
    "p": "i.s"
  },
  "abstracțiune": {
    "a": "u.e",
    "n": 5,
    "p": "u.n.e"
  },
  "abulie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "accidentalitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "acedie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "actualitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "ademenitor": {
    "a": "o",
    "n": 5,
    "p": "o.r"
  },
  "adevăr": {
    "a": "@",
    "n": 3,
    "p": "@.r"
  },
  "albină": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.@"
  },
  "alerga": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "alteritate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "ambiguitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "ambivalență": {
    "a": "e.@",
    "n": 5,
    "p": "e.n.T.@"
  },
  "ambiție": {
    "a": "i.i.e",
    "n": 4,
    "p": "i.T.i.e"
  },
  "amintire": {
    "a": "i.e",
    "n": 4,
    "p": "i.r.e"
  },
  "amnezie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "amăgitor": {
    "a": "o",
    "n": 4,
    "p": "o.r"
  },
  "amărăciune": {
    "a": "u.e",
    "n": 6,
    "p": "u.n.e"
  },
  "anamneză": {
    "a": "e.@",
    "n": 4,
    "p": "e.z.@"
  },
  "anterioritate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "antidot": {
    "a": "o",
    "n": 3,
    "p": "o.t"
  },
  "antinomie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "antropocentrism": {
    "a": "i",
    "n": 5,
    "p": "i.s.m"
  },
  "anxietate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "apatie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "aporie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "apriorism": {
    "a": "i",
    "n": 4,
    "p": "i.s.m"
  },
  "apă": {
    "a": "a.@",
    "n": 2,
    "p": "a.p.@"
  },
  "armonie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "asculta": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "axiomă": {
    "a": "o.@",
    "n": 4,
    "p": "o.m.@"
  },
  "azil": {
    "a": "i",
    "n": 2,
    "p": "i.l"
  },
  "bani": {
    "a": "a",
    "n": 1,
    "p": "a.n.j"
  },
  "bea": {
    "a": "a",
    "n": 2,
    "p": "a"
  },
  "bere": {
    "a": "e.e",
    "n": 2,
    "p": "e.r.e"
  },
  "blazon": {
    "a": "o",
    "n": 2,
    "p": "o.n"
  },
  "blestem": {
    "a": "e",
    "n": 2,
    "p": "e.m"
  },
  "bogăție": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "brânză": {
    "a": "1.@",
    "n": 2,
    "p": "1.n.z.@"
  },
  "bunic": {
    "a": "i",
    "n": 2,
    "p": "i.k"
  },
  "busolă": {
    "a": "o.@",
    "n": 3,
    "p": "o.l.@"
  },
  "băiat": {
    "a": "a",
    "n": 3,
    "p": "a.t"
  },
  "cafea": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "cal": {
    "a": "a",
    "n": 1,
    "p": "a.l"
  },
  "cald": {
    "a": "a",
    "n": 1,
    "p": "a.l.d"
  },
  "cap": {
    "a": "a",
    "n": 1,
    "p": "a.p"
  },
  "carne": {
    "a": "a.e",
    "n": 2,
    "p": "a.r.n.e"
  },
  "carte": {
    "a": "a.e",
    "n": 2,
    "p": "a.r.t.e"
  },
  "cartof": {
    "a": "o",
    "n": 2,
    "p": "o.f"
  },
  "casă": {
    "a": "a.@",
    "n": 2,
    "p": "a.s.@"
  },
  "cauzalitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "ceai": {
    "a": "i",
    "n": 3,
    "p": "i"
  },
  "ceapă": {
    "a": "a.@",
    "n": 3,
    "p": "a.p.@"
  },
  "ceas": {
    "a": "a",
    "n": 2,
    "p": "a.s"
  },
  "cenușă": {
    "a": "u.@",
    "n": 3,
    "p": "u.S.@"
  },
  "cer": {
    "a": "e",
    "n": 1,
    "p": "e.r"
  },
  "cetate": {
    "a": "a.e",
    "n": 3,
    "p": "a.t.e"
  },
  "cheie": {
    "a": "e.i.e",
    "n": 3,
    "p": "e.i.e"
  },
  "cicatrice": {
    "a": "i.e",
    "n": 4,
    "p": "i.tS.e"
  },
  "ciorbă": {
    "a": "o.@",
    "n": 3,
    "p": "o.r.b.@"
  },
  "cireașă": {
    "a": "a.@",
    "n": 4,
    "p": "a.S.@"
  },
  "citi": {
    "a": "i",
    "n": 1,
    "p": "i.t.j"
  },
  "comoară": {
    "a": "a.@",
    "n": 4,
    "p": "a.r.@"
  },
  "compasiune": {
    "a": "u.e",
    "n": 5,
    "p": "u.n.e"
  },
  "complementaritate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "complot": {
    "a": "o",
    "n": 2,
    "p": "o.t"
  },
  "conceptualizare": {
    "a": "a.e",
    "n": 7,
    "p": "a.r.e"
  },
  "concluzie": {
    "a": "u.i.e",
    "n": 4,
    "p": "u.z.i.e"
  },
  "concomitență": {
    "a": "e.@",
    "n": 5,
    "p": "e.n.T.@"
  },
  "conjectură": {
    "a": "u.@",
    "n": 4,
    "p": "u.r.@"
  },
  "contemplație": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "contingență": {
    "a": "e.@",
    "n": 4,
    "p": "e.n.T.@"
  },
  "conștiință": {
    "a": "i.@",
    "n": 4,
    "p": "i.n.T.@"
  },
  "copac": {
    "a": "a",
    "n": 2,
    "p": "a.k"
  },
  "copil": {
    "a": "i",
    "n": 2,
    "p": "i.l"
  },
  "copleșitor": {
    "a": "o",
    "n": 4,
    "p": "o.r"
  },
  "coroană": {
    "a": "a.@",
    "n": 4,
    "p": "a.n.@"
  },
  "coroborare": {
    "a": "a.e",
    "n": 5,
    "p": "a.r.e"
  },
  "corolar": {
    "a": "a",
    "n": 3,
    "p": "a.r"
  },
  "corporalitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "coruptibil": {
    "a": "i",
    "n": 4,
    "p": "i.l"
  },
  "corupție": {
    "a": "u.i.e",
    "n": 4,
    "p": "u.p.T.i.e"
  },
  "credință": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.T.@"
  },
  "creion": {
    "a": "o",
    "n": 3,
    "p": "o.n"
  },
  "cuceri": {
    "a": "e",
    "n": 2,
    "p": "e.r.j"
  },
  "culme": {
    "a": "u.e",
    "n": 2,
    "p": "u.l.m.e"
  },
  "curaj": {
    "a": "a",
    "n": 2,
    "p": "a.Z"
  },
  "câine": {
    "a": "1.i.e",
    "n": 3,
    "p": "1.i.n.e"
  },
  "cânta": {
    "a": "a",
    "n": 2,
    "p": "a"
  },
  "căpșună": {
    "a": "u.@",
    "n": 3,
    "p": "u.n.@"
  },
  "cărare": {
    "a": "a.e",
    "n": 3,
    "p": "a.r.e"
  },
  "cătușe": {
    "a": "u.e",
    "n": 3,
    "p": "u.S.e"
  },
  "dansa": {
    "a": "a",
    "n": 2,
    "p": "a"
  },
  "deducție": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "demonstrație": {
    "a": "a.i.e",
    "n": 5,
    "p": "a.T.i.e"
  },
  "destin": {
    "a": "i",
    "n": 2,
    "p": "i.n"
  },
  "destrăma": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "desăvârși": {
    "a": "1",
    "n": 3,
    "p": "1.r.S.j"
  },
  "determinism": {
    "a": "i",
    "n": 4,
    "p": "i.s.m"
  },
  "dezamăgire": {
    "a": "i.e",
    "n": 5,
    "p": "i.r.e"
  },
  "dezlănțui": {
    "a": "@.u.i",
    "n": 4,
    "p": "@.n.T.u.i"
  },
  "deznădejde": {
    "a": "e.e",
    "n": 4,
    "p": "e.Z.d.e"
  },
  "dezvălui": {
    "a": "@.u.i",
    "n": 4,
    "p": "@.l.u.i"
  },
  "deșertăciune": {
    "a": "u.e",
    "n": 6,
    "p": "u.n.e"
  },
  "dialectică": {
    "a": "e.i.@",
    "n": 5,
    "p": "e.k.t.i.k.@"
  },
  "dinte": {
    "a": "i.e",
    "n": 2,
    "p": "i.n.t.e"
  },
  "dispreț": {
    "a": "e",
    "n": 2,
    "p": "e.T"
  },
  "doctor": {
    "a": "o.o",
    "n": 2,
    "p": "o.k.t.o.r"
  },
  "dormi": {
    "a": "o",
    "n": 1,
    "p": "o.r.m.j"
  },
  "drum": {
    "a": "u",
    "n": 1,
    "p": "u.m"
  },
  "dârz": {
    "a": "1",
    "n": 1,
    "p": "1.r.z"
  },
  "dăinui": {
    "a": "@.i.u.i",
    "n": 4,
    "p": "@.i.n.u.i"
  },
  "echilibru": {
    "a": "i.u",
    "n": 4,
    "p": "i.b.r.u"
  },
  "echivocitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "efemer": {
    "a": "e",
    "n": 3,
    "p": "e.r"
  },
  "efemeritate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "egalitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "elev": {
    "a": "e",
    "n": 2,
    "p": "e.v"
  },
  "empirism": {
    "a": "i",
    "n": 3,
    "p": "i.s.m"
  },
  "enigmă": {
    "a": "i.@",
    "n": 3,
    "p": "i.g.m.@"
  },
  "entropie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "epistemă": {
    "a": "e.@",
    "n": 4,
    "p": "e.m.@"
  },
  "escatologie": {
    "a": "i.e",
    "n": 6,
    "p": "i.e"
  },
  "esențialitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "etern": {
    "a": "e",
    "n": 2,
    "p": "e.r.n"
  },
  "eternitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "euforie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "exil": {
    "a": "i",
    "n": 2,
    "p": "i.l"
  },
  "extaz": {
    "a": "a",
    "n": 2,
    "p": "a.z"
  },
  "exterioritate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "facticitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "falsificabilitate": {
    "a": "a.e",
    "n": 8,
    "p": "a.t.e"
  },
  "fasole": {
    "a": "o.e",
    "n": 3,
    "p": "o.l.e"
  },
  "fată": {
    "a": "a.@",
    "n": 2,
    "p": "a.t.@"
  },
  "femeie": {
    "a": "e.i.e",
    "n": 4,
    "p": "e.i.e"
  },
  "fenomenologie": {
    "a": "i.e",
    "n": 7,
    "p": "i.e"
  },
  "finalitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "flacără": {
    "a": "a.@.@",
    "n": 3,
    "p": "a.k.@.r.@"
  },
  "floare": {
    "a": "a.e",
    "n": 3,
    "p": "a.r.e"
  },
  "foc": {
    "a": "o",
    "n": 1,
    "p": "o.k"
  },
  "fortăreață": {
    "a": "a.@",
    "n": 5,
    "p": "a.T.@"
  },
  "frate": {
    "a": "a.e",
    "n": 2,
    "p": "a.t.e"
  },
  "frumos": {
    "a": "o",
    "n": 2,
    "p": "o.s"
  },
  "frunză": {
    "a": "u.@",
    "n": 2,
    "p": "u.n.z.@"
  },
  "frustrare": {
    "a": "a.e",
    "n": 3,
    "p": "a.r.e"
  },
  "fundație": {
    "a": "a.i.e",
    "n": 4,
    "p": "a.T.i.e"
  },
  "furtună": {
    "a": "u.@",
    "n": 3,
    "p": "u.n.@"
  },
  "făgăduială": {
    "a": "a.@",
    "n": 6,
    "p": "a.l.@"
  },
  "făuri": {
    "a": "u",
    "n": 2,
    "p": "u.r.j"
  },
  "geam": {
    "a": "a",
    "n": 2,
    "p": "a.m"
  },
  "giuvaier": {
    "a": "e",
    "n": 5,
    "p": "e.r"
  },
  "graniță": {
    "a": "a.i.@",
    "n": 3,
    "p": "a.n.i.T.@"
  },
  "grotesc": {
    "a": "e",
    "n": 2,
    "p": "e.s.k"
  },
  "gură": {
    "a": "u.@",
    "n": 2,
    "p": "u.r.@"
  },
  "găină": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.@"
  },
  "haos": {
    "a": "a.o",
    "n": 2,
    "p": "a.o.s"
  },
  "hermeneutică": {
    "a": "i.@",
    "n": 6,
    "p": "i.k.@"
  },
  "hotar": {
    "a": "a",
    "n": 2,
    "p": "a.r"
  },
  "hârtie": {
    "a": "i.e",
    "n": 3,
    "p": "i.e"
  },
  "iarbă": {
    "a": "a.@",
    "n": 3,
    "p": "a.r.b.@"
  },
  "iepure": {
    "a": "e.u.e",
    "n": 4,
    "p": "e.p.u.r.e"
  },
  "iluzie": {
    "a": "u.i.e",
    "n": 4,
    "p": "u.z.i.e"
  },
  "imanență": {
    "a": "e.@",
    "n": 4,
    "p": "e.n.T.@"
  },
  "imaterialitate": {
    "a": "a.e",
    "n": 8,
    "p": "a.t.e"
  },
  "imperiu": {
    "a": "e.i.u",
    "n": 4,
    "p": "e.r.i.u"
  },
  "imponderabil": {
    "a": "i",
    "n": 5,
    "p": "i.l"
  },
  "imprevizibilitate": {
    "a": "a.e",
    "n": 8,
    "p": "a.t.e"
  },
  "imuabil": {
    "a": "a.i",
    "n": 4,
    "p": "a.b.i.l"
  },
  "incongruență": {
    "a": "e.@",
    "n": 5,
    "p": "e.n.T.@"
  },
  "incoruptibil": {
    "a": "i",
    "n": 5,
    "p": "i.l"
  },
  "indelebil": {
    "a": "i",
    "n": 4,
    "p": "i.l"
  },
  "indescifrabil": {
    "a": "a.i",
    "n": 5,
    "p": "a.b.i.l"
  },
  "indignare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "inducție": {
    "a": "u.i.e",
    "n": 4,
    "p": "u.k.T.i.e"
  },
  "inefabil": {
    "a": "a.i",
    "n": 4,
    "p": "a.b.i.l"
  },
  "ineluctabil": {
    "a": "i",
    "n": 5,
    "p": "i.l"
  },
  "inexorabilitate": {
    "a": "a.e",
    "n": 8,
    "p": "a.t.e"
  },
  "inextricabil": {
    "a": "i",
    "n": 5,
    "p": "i.l"
  },
  "inferență": {
    "a": "e.@",
    "n": 4,
    "p": "e.n.T.@"
  },
  "infinit": {
    "a": "i",
    "n": 3,
    "p": "i.t"
  },
  "infinitezimal": {
    "a": "a",
    "n": 6,
    "p": "a.l"
  },
  "infirmare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "inimă": {
    "a": "i.i.@",
    "n": 3,
    "p": "i.n.i.m.@"
  },
  "intangibilitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "interioritate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "intersubiectivitate": {
    "a": "a.e",
    "n": 9,
    "p": "a.t.e"
  },
  "intrigă": {
    "a": "i.i.@",
    "n": 3,
    "p": "i.n.t.r.i.g.@"
  },
  "introspecție": {
    "a": "e.i.e",
    "n": 5,
    "p": "e.k.T.i.e"
  },
  "ipoteză": {
    "a": "e.@",
    "n": 4,
    "p": "e.z.@"
  },
  "ireductibil": {
    "a": "i",
    "n": 5,
    "p": "i.l"
  },
  "irevocabil": {
    "a": "a.i",
    "n": 5,
    "p": "a.b.i.l"
  },
  "iubi": {
    "a": "u",
    "n": 2,
    "p": "u.b.j"
  },
  "izbândi": {
    "a": "1",
    "n": 2,
    "p": "1.n.d.j"
  },
  "labirint": {
    "a": "i",
    "n": 3,
    "p": "i.n.t"
  },
  "lanț": {
    "a": "a",
    "n": 1,
    "p": "a.n.T"
  },
  "lapte": {
    "a": "a.e",
    "n": 2,
    "p": "a.p.t.e"
  },
  "legendă": {
    "a": "e.@",
    "n": 3,
    "p": "e.n.d.@"
  },
  "lemă": {
    "a": "e.@",
    "n": 2,
    "p": "e.m.@"
  },
  "lent": {
    "a": "e",
    "n": 1,
    "p": "e.n.t"
  },
  "letargie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "libertate": {
    "a": "a.e",
    "n": 4,
    "p": "a.t.e"
  },
  "loialitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "lumină": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.@"
  },
  "lună": {
    "a": "u.@",
    "n": 2,
    "p": "u.n.@"
  },
  "lup": {
    "a": "u",
    "n": 1,
    "p": "u.p"
  },
  "lăcomie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "lămâie": {
    "a": "1.i.e",
    "n": 4,
    "p": "1.i.e"
  },
  "lăuntric": {
    "a": "u.i",
    "n": 3,
    "p": "u.n.t.r.i.k"
  },
  "mamă": {
    "a": "a.@",
    "n": 2,
    "p": "a.m.@"
  },
  "mantie": {
    "a": "a.i.e",
    "n": 3,
    "p": "a.n.t.i.e"
  },
  "mare": {
    "a": "a.e",
    "n": 2,
    "p": "a.r.e"
  },
  "masă": {
    "a": "a.@",
    "n": 2,
    "p": "a.s.@"
  },
  "meditație": {
    "a": "a.i.e",
    "n": 5,
    "p": "a.T.i.e"
  },
  "melancolie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "memorie": {
    "a": "o.i.e",
    "n": 4,
    "p": "o.r.i.e"
  },
  "merge": {
    "a": "e.e",
    "n": 2,
    "p": "e.r.dZ.e"
  },
  "metafizică": {
    "a": "i.i.@",
    "n": 5,
    "p": "i.z.i.k.@"
  },
  "mic": {
    "a": "i",
    "n": 1,
    "p": "i.k"
  },
  "miere": {
    "a": "e.e",
    "n": 3,
    "p": "e.r.e"
  },
  "minciună": {
    "a": "u.@",
    "n": 4,
    "p": "u.n.@"
  },
  "mit": {
    "a": "i",
    "n": 1,
    "p": "i.t"
  },
  "modalitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "molcom": {
    "a": "o",
    "n": 2,
    "p": "o.m"
  },
  "monumental": {
    "a": "a",
    "n": 4,
    "p": "a.l"
  },
  "morcov": {
    "a": "o.o",
    "n": 2,
    "p": "o.r.k.o.v"
  },
  "moștenire": {
    "a": "i.e",
    "n": 4,
    "p": "i.r.e"
  },
  "munte": {
    "a": "u.e",
    "n": 2,
    "p": "u.n.t.e"
  },
  "muscă": {
    "a": "u.@",
    "n": 2,
    "p": "u.s.k.@"
  },
  "mânca": {
    "a": "a",
    "n": 2,
    "p": "a"
  },
  "mână": {
    "a": "1.@",
    "n": 2,
    "p": "1.n.@"
  },
  "măr": {
    "a": "@",
    "n": 1,
    "p": "@.r"
  },
  "nas": {
    "a": "a",
    "n": 1,
    "p": "a.s"
  },
  "necesitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "necruțător": {
    "a": "o",
    "n": 4,
    "p": "o.r"
  },
  "nedreptate": {
    "a": "a.e",
    "n": 4,
    "p": "a.t.e"
  },
  "neliniște": {
    "a": "i.i.e",
    "n": 4,
    "p": "i.n.i.S.t.e"
  },
  "nemărginire": {
    "a": "i.e",
    "n": 5,
    "p": "i.r.e"
  },
  "nestăvilit": {
    "a": "i",
    "n": 4,
    "p": "i.t"
  },
  "neînduplecat": {
    "a": "a",
    "n": 5,
    "p": "a.t"
  },
  "neînfricat": {
    "a": "a",
    "n": 4,
    "p": "a.t"
  },
  "nihilism": {
    "a": "i",
    "n": 3,
    "p": "i.s.m"
  },
  "nisip": {
    "a": "i",
    "n": 2,
    "p": "i.p"
  },
  "nor": {
    "a": "o",
    "n": 1,
    "p": "o.r"
  },
  "nostalgie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "nucă": {
    "a": "u.@",
    "n": 2,
    "p": "u.k.@"
  },
  "obiectivitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "ochi": {
    "a": "o",
    "n": 1,
    "p": "o.k.j"
  },
  "oglindă": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.d.@"
  },
  "om": {
    "a": "o",
    "n": 1,
    "p": "o.m"
  },
  "ontologie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "oraș": {
    "a": "a",
    "n": 2,
    "p": "a.S"
  },
  "ordine": {
    "a": "o.i.e",
    "n": 3,
    "p": "o.r.d.i.n.e"
  },
  "orizont": {
    "a": "o",
    "n": 3,
    "p": "o.n.t"
  },
  "otravă": {
    "a": "a.@",
    "n": 3,
    "p": "a.v.@"
  },
  "ou": {
    "a": "u",
    "n": 2,
    "p": "u"
  },
  "parabolă": {
    "a": "o.@",
    "n": 4,
    "p": "o.l.@"
  },
  "paradigmă": {
    "a": "i.@",
    "n": 4,
    "p": "i.g.m.@"
  },
  "paralogism": {
    "a": "i",
    "n": 4,
    "p": "i.s.m"
  },
  "pară": {
    "a": "a.@",
    "n": 2,
    "p": "a.r.@"
  },
  "pasăre": {
    "a": "a.@.e",
    "n": 3,
    "p": "a.s.@.r.e"
  },
  "pat": {
    "a": "a",
    "n": 1,
    "p": "a.t"
  },
  "perenitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "perete": {
    "a": "e.e",
    "n": 3,
    "p": "e.t.e"
  },
  "perfectibil": {
    "a": "i",
    "n": 4,
    "p": "i.l"
  },
  "perisabil": {
    "a": "a.i",
    "n": 4,
    "p": "a.b.i.l"
  },
  "perisabilitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "pește": {
    "a": "e.e",
    "n": 2,
    "p": "e.S.t.e"
  },
  "piatră": {
    "a": "a.@",
    "n": 3,
    "p": "a.t.r.@"
  },
  "picior": {
    "a": "o",
    "n": 3,
    "p": "o.r"
  },
  "pisică": {
    "a": "i.@",
    "n": 3,
    "p": "i.k.@"
  },
  "plauzibilitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "ploaie": {
    "a": "a.i.e",
    "n": 4,
    "p": "a.i.e"
  },
  "plânge": {
    "a": "1.e",
    "n": 2,
    "p": "1.n.dZ.e"
  },
  "plăsmui": {
    "a": "u.i",
    "n": 3,
    "p": "u.i"
  },
  "porc": {
    "a": "o",
    "n": 1,
    "p": "o.r.k"
  },
  "posterioritate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "postulat": {
    "a": "a",
    "n": 3,
    "p": "a.t"
  },
  "potențialitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "premisă": {
    "a": "i.@",
    "n": 3,
    "p": "i.s.@"
  },
  "premoniție": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "preschimba": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "presimțire": {
    "a": "i.e",
    "n": 4,
    "p": "i.r.e"
  },
  "presupoziție": {
    "a": "i.e",
    "n": 6,
    "p": "i.e"
  },
  "previzibilitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "pribegie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "prieten": {
    "a": "e.e",
    "n": 3,
    "p": "e.t.e.n"
  },
  "privi": {
    "a": "i",
    "n": 1,
    "p": "i.v.j"
  },
  "profesor": {
    "a": "o",
    "n": 3,
    "p": "o.r"
  },
  "profeție": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "prună": {
    "a": "u.@",
    "n": 2,
    "p": "u.n.@"
  },
  "prăjitură": {
    "a": "u.@",
    "n": 4,
    "p": "u.r.@"
  },
  "prăpastie": {
    "a": "a.i.e",
    "n": 4,
    "p": "a.s.t.i.e"
  },
  "putere": {
    "a": "e.e",
    "n": 3,
    "p": "e.r.e"
  },
  "puternic": {
    "a": "e.i",
    "n": 3,
    "p": "e.r.n.i.k"
  },
  "pâine": {
    "a": "1.i.e",
    "n": 3,
    "p": "1.i.n.e"
  },
  "pădure": {
    "a": "u.e",
    "n": 3,
    "p": "u.r.e"
  },
  "păr": {
    "a": "@",
    "n": 1,
    "p": "@.r"
  },
  "rană": {
    "a": "a.@",
    "n": 2,
    "p": "a.n.@"
  },
  "rapid": {
    "a": "i",
    "n": 2,
    "p": "i.d"
  },
  "raționalism": {
    "a": "i",
    "n": 5,
    "p": "i.s.m"
  },
  "raționament": {
    "a": "e",
    "n": 5,
    "p": "e.n.t"
  },
  "rațiune": {
    "a": "u.e",
    "n": 4,
    "p": "u.n.e"
  },
  "rece": {
    "a": "e.e",
    "n": 2,
    "p": "e.tS.e"
  },
  "reciprocitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "refugiu": {
    "a": "u.i.u",
    "n": 4,
    "p": "u.dZ.i.u"
  },
  "relativism": {
    "a": "i",
    "n": 4,
    "p": "i.s.m"
  },
  "rememorare": {
    "a": "a.e",
    "n": 5,
    "p": "a.r.e"
  },
  "reminiscență": {
    "a": "e.@",
    "n": 5,
    "p": "e.n.T.@"
  },
  "remușcare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "resentiment": {
    "a": "e",
    "n": 4,
    "p": "e.n.t"
  },
  "reverie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "revoltă": {
    "a": "o.@",
    "n": 3,
    "p": "o.l.t.@"
  },
  "rezistență": {
    "a": "e.@",
    "n": 4,
    "p": "e.n.T.@"
  },
  "roșie": {
    "a": "o.i.e",
    "n": 3,
    "p": "o.S.i.e"
  },
  "ruină": {
    "a": "i.@",
    "n": 3,
    "p": "i.n.@"
  },
  "râde": {
    "a": "1.e",
    "n": 2,
    "p": "1.d.e"
  },
  "râu": {
    "a": "u",
    "n": 2,
    "p": "u"
  },
  "răscruce": {
    "a": "u.e",
    "n": 3,
    "p": "u.tS.e"
  },
  "sacrificiu": {
    "a": "i.i.u",
    "n": 5,
    "p": "i.tS.i.u"
  },
  "sare": {
    "a": "a.e",
    "n": 2,
    "p": "a.r.e"
  },
  "sat": {
    "a": "a",
    "n": 1,
    "p": "a.t"
  },
  "scaun": {
    "a": "a.u",
    "n": 2,
    "p": "a.u.n"
  },
  "sceptru": {
    "a": "e.u",
    "n": 2,
    "p": "e.p.t.r.u"
  },
  "scrie": {
    "a": "i.e",
    "n": 2,
    "p": "i.e"
  },
  "scânteie": {
    "a": "e.i.e",
    "n": 4,
    "p": "e.i.e"
  },
  "secret": {
    "a": "e",
    "n": 2,
    "p": "e.t"
  },
  "seninătate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "sfâșietor": {
    "a": "o",
    "n": 4,
    "p": "o.r"
  },
  "silogism": {
    "a": "i",
    "n": 3,
    "p": "i.s.m"
  },
  "simultaneitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "smerenie": {
    "a": "e.i.e",
    "n": 4,
    "p": "e.n.i.e"
  },
  "soare": {
    "a": "a.e",
    "n": 3,
    "p": "a.r.e"
  },
  "sofism": {
    "a": "i",
    "n": 2,
    "p": "i.s.m"
  },
  "solipsism": {
    "a": "i",
    "n": 3,
    "p": "i.s.m"
  },
  "soră": {
    "a": "o.@",
    "n": 2,
    "p": "o.r.@"
  },
  "soteriologie": {
    "a": "i.e",
    "n": 7,
    "p": "i.e"
  },
  "spate": {
    "a": "a.e",
    "n": 2,
    "p": "a.t.e"
  },
  "spațialitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "speranță": {
    "a": "a.@",
    "n": 3,
    "p": "a.n.T.@"
  },
  "spiritualitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "spulbera": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "stea": {
    "a": "a",
    "n": 2,
    "p": "a"
  },
  "stipulare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "stradă": {
    "a": "a.@",
    "n": 2,
    "p": "a.d.@"
  },
  "strugure": {
    "a": "u.e",
    "n": 3,
    "p": "u.r.e"
  },
  "strălucitor": {
    "a": "o",
    "n": 4,
    "p": "o.r"
  },
  "străveziu": {
    "a": "i.u",
    "n": 4,
    "p": "i.u"
  },
  "subiectivitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "subjuga": {
    "a": "a",
    "n": 3,
    "p": "a"
  },
  "sublim": {
    "a": "i",
    "n": 2,
    "p": "i.m"
  },
  "substanțialitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "supoziție": {
    "a": "i.i.e",
    "n": 5,
    "p": "i.T.i.e"
  },
  "supă": {
    "a": "u.@",
    "n": 2,
    "p": "u.p.@"
  },
  "sări": {
    "a": "@",
    "n": 1,
    "p": "@.r.j"
  },
  "sărăcie": {
    "a": "i.e",
    "n": 4,
    "p": "i.e"
  },
  "taină": {
    "a": "a.i.@",
    "n": 3,
    "p": "a.i.n.@"
  },
  "talisman": {
    "a": "a",
    "n": 3,
    "p": "a.n"
  },
  "tandrețe": {
    "a": "e.e",
    "n": 3,
    "p": "e.T.e"
  },
  "tată": {
    "a": "a.@",
    "n": 2,
    "p": "a.t.@"
  },
  "tautologie": {
    "a": "i.e",
    "n": 6,
    "p": "i.e"
  },
  "telefon": {
    "a": "o",
    "n": 3,
    "p": "o.n"
  },
  "teleologie": {
    "a": "i.e",
    "n": 6,
    "p": "i.e"
  },
  "temerar": {
    "a": "a",
    "n": 3,
    "p": "a.r"
  },
  "temniță": {
    "a": "e.i.@",
    "n": 3,
    "p": "e.m.n.i.T.@"
  },
  "temporalitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "tenacitate": {
    "a": "a.e",
    "n": 5,
    "p": "a.t.e"
  },
  "tradiție": {
    "a": "i.i.e",
    "n": 4,
    "p": "i.T.i.e"
  },
  "trecut": {
    "a": "u",
    "n": 2,
    "p": "u.t"
  },
  "trist": {
    "a": "i",
    "n": 1,
    "p": "i.s.t"
  },
  "tron": {
    "a": "o",
    "n": 1,
    "p": "o.n"
  },
  "trufie": {
    "a": "i.e",
    "n": 3,
    "p": "i.e"
  },
  "trădare": {
    "a": "a.e",
    "n": 3,
    "p": "a.r.e"
  },
  "tăcere": {
    "a": "e.e",
    "n": 3,
    "p": "e.r.e"
  },
  "tăgadă": {
    "a": "a.@",
    "n": 3,
    "p": "a.d.@"
  },
  "tăinui": {
    "a": "u.i",
    "n": 4,
    "p": "u.i"
  },
  "tărâm": {
    "a": "1",
    "n": 2,
    "p": "1.m"
  },
  "ubicuitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "uimire": {
    "a": "i.e",
    "n": 4,
    "p": "i.r.e"
  },
  "uitare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "umbră": {
    "a": "u.@",
    "n": 2,
    "p": "u.m.b.r.@"
  },
  "uneltire": {
    "a": "i.e",
    "n": 4,
    "p": "i.r.e"
  },
  "unt": {
    "a": "u",
    "n": 1,
    "p": "u.n.t"
  },
  "ureche": {
    "a": "e.e",
    "n": 3,
    "p": "e.k.e"
  },
  "urs": {
    "a": "u",
    "n": 1,
    "p": "u.r.s"
  },
  "urât": {
    "a": "1",
    "n": 2,
    "p": "1.t"
  },
  "ușă": {
    "a": "u.@",
    "n": 2,
    "p": "u.S.@"
  },
  "vacă": {
    "a": "a.@",
    "n": 2,
    "p": "a.k.@"
  },
  "varză": {
    "a": "a.@",
    "n": 2,
    "p": "a.r.z.@"
  },
  "vecin": {
    "a": "i",
    "n": 2,
    "p": "i.n"
  },
  "venerație": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "verde": {
    "a": "e.e",
    "n": 2,
    "p": "e.r.d.e"
  },
  "verificabilitate": {
    "a": "a.e",
    "n": 8,
    "p": "a.t.e"
  },
  "verosimilitate": {
    "a": "a.e",
    "n": 7,
    "p": "a.t.e"
  },
  "vesel": {
    "a": "e.e",
    "n": 2,
    "p": "e.s.e.l"
  },
  "veșmânt": {
    "a": "1",
    "n": 2,
    "p": "1.n.t"
  },
  "viclean": {
    "a": "a",
    "n": 3,
    "p": "a.n"
  },
  "viitor": {
    "a": "o",
    "n": 3,
    "p": "o.r"
  },
  "vin": {
    "a": "i",
    "n": 1,
    "p": "i.n"
  },
  "vindecare": {
    "a": "a.e",
    "n": 4,
    "p": "a.r.e"
  },
  "vinovăție": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "virtualitate": {
    "a": "a.e",
    "n": 6,
    "p": "a.t.e"
  },
  "vorbi": {
    "a": "o",
    "n": 1,
    "p": "o.r.b.j"
  },
  "vrajă": {
    "a": "a.@",
    "n": 2,
    "p": "a.Z.@"
  },
  "vremelnicie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "vulpe": {
    "a": "u.e",
    "n": 2,
    "p": "u.l.p.e"
  },
  "vânt": {
    "a": "1",
    "n": 1,
    "p": "1.n.t"
  },
  "vârtej": {
    "a": "e",
    "n": 2,
    "p": "e.Z"
  },
  "zahăr": {
    "a": "a.@",
    "n": 2,
    "p": "a.h.@.r"
  },
  "zădărnicie": {
    "a": "i.e",
    "n": 5,
    "p": "i.e"
  },
  "zăpadă": {
    "a": "a.@",
    "n": 3,
    "p": "a.d.@"
  },
  "îmblânzi": {
    "a": "1",
    "n": 2,
    "p": "1.n.z.j"
  },
  "îndoială": {
    "a": "a.@",
    "n": 5,
    "p": "a.l.@"
  },
  "înfrânge": {
    "a": "1.e",
    "n": 3,
    "p": "1.n.dZ.e"
  },
  "întunecat": {
    "a": "a",
    "n": 4,
    "p": "a.t"
  },
  "întuneric": {
    "a": "e.i",
    "n": 4,
    "p": "e.r.i.k"
  },
  "șarpe": {
    "a": "a.e",
    "n": 2,
    "p": "a.r.p.e"
  }
};

const RHYME_STRESS = {"alerga": 0, "ambiție": 2, "asculta": 0, "bea": 0, "cafea": 0, "ceai": 0, "cheie": 2, "concluzie": 2, "corupție": 2, "câine": 2, "cânta": 0, "dansa": 0, "demonstrație": 2, "destrăma": 0, "dezlănțui": 2, "dezvălui": 2, "dialectică": 2, "doctor": 1, "dăinui": 3, "femeie": 2, "flacără": 2, "fundație": 2, "graniță": 2, "haos": 1, "iepure": 2, "iluzie": 2, "imperiu": 2, "imuabil": 1, "indescifrabil": 1, "inducție": 2, "inefabil": 1, "inimă": 2, "intrigă": 2, "introspecție": 2, "irevocabil": 1, "lămâie": 2, "lăuntric": 1, "mantie": 2, "meditație": 2, "memorie": 2, "metafizică": 2, "morcov": 1, "mânca": 0, "neliniște": 2, "ordine": 2, "ou": 0, "pasăre": 2, "perisabil": 1, "ploaie": 2, "preschimba": 0, "prieten": 1, "prăpastie": 2, "puternic": 1, "pâine": 2, "refugiu": 2, "roșie": 2, "râu": 0, "sacrificiu": 2, "scaun": 1, "scânteie": 2, "smerenie": 2, "spulbera": 0, "stea": 0, "subjuga": 0, "supoziție": 2, "taină": 2, "temniță": 2, "tradiție": 2, "vesel": 1, "zahăr": 1, "întuneric": 1};

const RHYME_EXTRA = {
  "adevăr": [
    "văr",
    "neadevăr",
    "ivăr"
  ],
  "ambiție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "brânză": [
    "pânză",
    "vânză",
    "revânză",
    "tinză",
    "tunză",
    "bronză"
  ],
  "cheie": [
    "ncheie",
    "beie",
    "deie",
    "ieie",
    "leie",
    "teie"
  ],
  "concluzie": [
    "poezie",
    "decizie",
    "ocazie",
    "precizie",
    "explozie",
    "recenzie"
  ],
  "corupție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "câine": [
    "mâine",
    "haine",
    "taine",
    "poimâine",
    "faine",
    "răspoimâine"
  ],
  "dezlănțui": [
    "zbănțui",
    "înlănțui"
  ],
  "dezvălui": [
    "lui",
    "anului",
    "statului",
    "orașului",
    "celui",
    "domnului"
  ],
  "dialectică": [
    "adică",
    "politică",
    "mică",
    "publică",
    "muzică",
    "biserică"
  ],
  "doctor": [
    "director",
    "ajutor",
    "altor",
    "autor",
    "multor",
    "următor"
  ],
  "dăinui": [
    "unui",
    "nimănui",
    "continui",
    "vreunui",
    "niciunui",
    "destăinui"
  ],
  "echilibru": [
    "membru",
    "celebru",
    "calibru",
    "timbru",
    "zimbru",
    "sumbru"
  ],
  "fasole": [
    "articole",
    "agricole",
    "spectacole",
    "secole",
    "cole",
    "capitole"
  ],
  "femeie": [
    "zmeie",
    "întemeie",
    "beie",
    "deie",
    "ieie",
    "leie"
  ],
  "flacără": [
    "fără",
    "numără",
    "tânără",
    "cumpără",
    "tabără",
    "apără"
  ],
  "graniță": [
    "fetiță",
    "actriță",
    "grădiniță",
    "viță",
    "călugăriță",
    "zeiță"
  ],
  "haos": [
    "adaos",
    "repaos"
  ],
  "iepure": [
    "asigure",
    "singure",
    "dure",
    "sigure",
    "alăture",
    "fure"
  ],
  "iluzie": [
    "poezie",
    "decizie",
    "ocazie",
    "precizie",
    "explozie",
    "recenzie"
  ],
  "imperiu": [
    "propriu",
    "teritoriu",
    "scenariu",
    "obligatoriu",
    "salariu",
    "comentariu"
  ],
  "imuabil": [
    "probabil",
    "posibil",
    "imposibil",
    "responsabil",
    "capabil",
    "incredibil"
  ],
  "indescifrabil": [
    "probabil",
    "posibil",
    "imposibil",
    "responsabil",
    "capabil",
    "incredibil"
  ],
  "inducție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "inefabil": [
    "probabil",
    "posibil",
    "imposibil",
    "responsabil",
    "capabil",
    "incredibil"
  ],
  "inimă": [
    "maximă",
    "primă",
    "exprimă",
    "ultimă",
    "crimă",
    "victimă"
  ],
  "intrigă": [
    "câștigă",
    "strigă",
    "ligă",
    "obligă",
    "mămăligă",
    "aprigă"
  ],
  "introspecție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "irevocabil": [
    "probabil",
    "posibil",
    "imposibil",
    "responsabil",
    "capabil",
    "incredibil"
  ],
  "lămâie": [
    "mângâie",
    "tămâie",
    "scârțâie",
    "mâie",
    "rămâie",
    "alămâie"
  ],
  "lăuntric": [
    "istoric",
    "eric",
    "electric",
    "categoric",
    "generic",
    "folcloric"
  ],
  "memorie": [
    "noiembrie",
    "decembrie",
    "octombrie",
    "septembrie",
    "ianuarie",
    "februarie"
  ],
  "metafizică": [
    "adică",
    "politică",
    "mică",
    "publică",
    "muzică",
    "biserică"
  ],
  "morcov": [
    "roșcov",
    "țușcov"
  ],
  "mână": [
    "până",
    "română",
    "săptămână",
    "rămână",
    "lână",
    "bătrână"
  ],
  "măr": [
    "număr",
    "umăr",
    "enumăr"
  ],
  "neliniște": [
    "niște",
    "privește",
    "găsește",
    "vorbește",
    "folosește",
    "numește"
  ],
  "ordine": [
    "bine",
    "mine",
    "cine",
    "tine",
    "vine",
    "devine"
  ],
  "pasăre": [
    "dunăre",
    "mazăre",
    "lagăre",
    "ivăre",
    "cațăre",
    "licăre"
  ],
  "perisabil": [
    "probabil",
    "posibil",
    "imposibil",
    "responsabil",
    "capabil",
    "incredibil"
  ],
  "plânge": [
    "ajunge",
    "sânge",
    "atinge",
    "convinge",
    "învinge",
    "strânge"
  ],
  "puternic": [
    "tehnic",
    "britanic",
    "unic",
    "electronic",
    "zilnic",
    "mecanic"
  ],
  "pâine": [
    "mâine",
    "haine",
    "taine",
    "poimâine",
    "faine",
    "răspoimâine"
  ],
  "păr": [
    "cumpăr",
    "descopăr",
    "apăr",
    "supăr",
    "acopăr",
    "calapăr"
  ],
  "refugiu": [
    "subterfugiu"
  ],
  "roșie": [
    "cenușie",
    "moșie",
    "fâșie",
    "sfâșie",
    "duioșie",
    "voioșie"
  ],
  "râde": [
    "surâde",
    "gâde",
    "hâde"
  ],
  "sacrificiu": [
    "serviciu",
    "oficiu",
    "indiciu",
    "patriciu",
    "edificiu",
    "beneficiu"
  ],
  "scaun": [
    "caun",
    "ceaun",
    "miaun",
    "schiaun"
  ],
  "sceptru": [
    "pentru",
    "nostru",
    "patru",
    "centru",
    "ministru",
    "teatru"
  ],
  "scânteie": [
    "teie",
    "steie",
    "coteie",
    "beie",
    "deie",
    "ieie"
  ],
  "smerenie": [
    "iunie",
    "linie",
    "campanie",
    "prietenie",
    "nebunie",
    "curățenie"
  ],
  "străveziu": [
    "târziu",
    "cărămiziu"
  ],
  "supoziție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "sări": [
    "țări",
    "lucrări",
    "întrebări",
    "cercetări",
    "schimbări",
    "modificări"
  ],
  "taină": [
    "haină",
    "faină",
    "cocaină",
    "doină",
    "moină",
    "minioină"
  ],
  "temniță": [
    "fetiță",
    "actriță",
    "grădiniță",
    "viță",
    "călugăriță",
    "zeiță"
  ],
  "tradiție": [
    "funcție",
    "ediție",
    "atenție",
    "poliție",
    "producție",
    "educație"
  ],
  "înfrânge": [
    "ajunge",
    "sânge",
    "atinge",
    "convinge",
    "învinge",
    "strânge"
  ],
  "întuneric": [
    "istoric",
    "eric",
    "electric",
    "categoric",
    "generic",
    "numeric"
  ]
};

const RHYME_META = { count: 417, hash: "635fe364106e2740d3de28e00a2b82fc61d7e416170f4917c01133d269796e3f" };

# Hebrew Translation Sheet — The Lattice / Order game

Everything the players see, in one place. Fill the **HE:** lines (or paste a
section under the prompt below and let an LLM do it). Priority marks:
**⭐ = players see it during the event** · ◽ = solo-only or staff-only (lower priority).

> The networked event flow is: **badge QR → (skip Entry/Join) → Briefing → Hunt →
> back to Control → Reveal**, plus the **Ceremony** on the TV and the **Control
> dashboard**. The **Boot intro** and **Bond ritual** are SOLO-only (the opening
> *video* replaces the boot intro), so they're lower priority.

---

## 0 · The translation prompt (paste a section after it)

> You are translating a children's adventure game from English to Hebrew.
> **Players:** 7th–8th graders with emotional/behavioural difficulties, anxiety,
> ADHD, often ODD; many read below grade level and shut down at anything
> complicated or that feels like "you're wrong."
> **Tone is everything (more than literal accuracy):** short and simple (a
> struggling 5th-grader reads each line in 2 seconds), warm and encouraging,
> never blaming (a "wrong" must sound gentle/playful), natural informal spoken
> Hebrew, masculine-plural address (אתם) for the mixed group.
> **Voice:** **ראש המסדר** — a kind, wise, Gandalf-like leader of an order of young
> knights. Proud of them, a little magical, never scary or commanding.
> **Rules:** keep code placeholders/variables exactly as-is (`${name}`,
> `{cellName}`, `{n}`); keep element symbols (H, O…) but translate names per the
> glossary; use glossary terms consistently; return each item as English → Hebrew.

---

## 1 · Glossary (Hebrew suggestions — please verify)

| English | Hebrew (verify) |
|---|---|
| the Magister / head of the Order | **ראש המסדר** |
| the Order / a Knight / the Seer | המסדר / אביר / הרואֶה |
| Order of the Eagle / Dolphin / Lion | מסדר הנשרים / מסדר הדולפינים / מסדר האריות |
| guardian of the Air / Water / Sun | שומר האוויר / שומר המים / שומר השמש |
| chosen ones | הנבחרים |
| your gift | המתנה שלך |
| cell (the team) | החוליה |
| spark / atom | ניצוץ / אטום |
| Hydrogen / Oxygen / Carbon / Nitrogen / Sodium / Chlorine | מימן / חמצן / פחמן / חנקן / נתרן / כלור |
| Helium / Neon / Argon | הליום / ניאון / ארגון |
| Hydrogen Gas / Oxygen Gas | גז מימן / גז חמצן |
| Water / Salt / Ammonia / Methane / Carbon Dioxide | מים / מלח / אמוניה / מתאן / פחמן דו-חמצני |
| white / red / grey / blue / violet / green / gold | לבן / אדום / אפור / כחול / סגול / ירוק / זהב |

---

## 2 · ⭐ Mission story text (`src/data/missions.ts`) — the heart

**M1 Hydrogen — briefing:** "First task, CELL — and an easy one to start. Make HYDROGEN. Find two white sparks and bring them together. You’ve got this."

**M1 — clue:** "White sparks are tiny and there are lots of them. Look low, look close — start right near where you’re standing."
""
**M1 — reveal:** "Done! That’s HYDROGEN — the very first thing that ever existed. You made it look easy. I chose well."
""

**M2 Salt — briefing:** "Next: SALT — yes, the kind on your fries. Find one violet spark and one green one. Two colours, one team."
""
**M2 — clue:** "Violet is rare and a little wild. Green likes to hide in corners. Spread out and shout when you spot one."
""
**M2 — reveal:** "SALT! The violet and the green grabbed each other in a flash. Nice teamwork — that’s a gift, you know. Keep going."
""

**M3 Water — briefing:** "Now WATER — the most important thing alive. Two white sparks and one red one. You already know how to find white."
""
**M3 — clue:** "Red ones glow warm. Two white, one red — gather all three and you’re there."
""
**M3 — reveal:** "WATER. Every living thing needs it, and you made it from almost nothing. That took focus. I’m impressed — next!"
""

**M4 Ammonia — briefing:** "A tricky one: AMMONIA — the sharp smell in cleaning spray. One blue spark and THREE white. You can do hard things."
""
**M4 — clue:** "Blue is calm and hides out in the open. Three whites is a lot — split the hunt between you."
""
**M4 — reveal:** "AMMONIA — four pieces, locked tight. The hardest yet, and you didn’t quit. THAT is who you are. Almost there."
""

**M5 Methane — briefing:** "Last one before you rest: METHANE — the gas that makes fire. One grey spark and FOUR white. Big build. Big team."
""
**M5 — clue:** "Grey is heavy and slow, so it won’t be far. Four whites is a lot — share the load and hunt together."
""
**M5 — reveal:** "METHANE! Five pieces — your biggest build yet. Hour one is COMPLETE. Rest now, drink some water, shake out your legs. When you come back, the real secret begins. You earned it."
""

**M6 Oxygen — briefing:** "Welcome back, CELL. Here’s the big secret: BREATHING. Right now you’re breathing IN oxygen to stay alive. Let’s make some — find two red sparks."
""
**M6 — clue:** "Red ones are warm and glowing. You only need two. Go!"
""
**M6 — reveal:** "OXYGEN — the air in your lungs this very second. Animals like us breathe it IN. But what do we breathe OUT? Come — I’ll show you."
""

**M7 Carbon Dioxide — briefing:** "When you breathe OUT, you let go of CARBON DIOXIDE — you make it all day without even trying. Build it: one grey, two red."
""
**M7 — clue:** "One grey, two red. You’ve found both colours before — you know what to do."
""
**M7 — reveal:** "CARBON DIOXIDE — your own breath, made real. Animals breathe it out… and plants? Plants are HUNGRY for it. Watch what happens next."
""

**M8 Water (plant) — briefing:** "Here’s the magic: plants drink your carbon dioxide, plus WATER and sunlight, to make food — and to breathe out fresh air. Bring the water: two white, one red."
""
**M8 — clue:** "Two white, one red — same as before. You’re fast at this now."
""
**M8 — reveal:** "Now the plant has everything: your breath, water, and sunlight. And it gives something back… the very air you breathe. One last build, and you’ll see the whole circle."
""

**M9 The Breath of the World — briefing:** "The finale, CELL. The plant breathes out OXYGEN — and the circle closes. Make one last breath for the world. Two red sparks. Make it count."
""
**M9 — clue:** "Two red. You know exactly where to look. Finish strong, together."
""
**M9 — reveal (the big one):** "There it is — the BREATH OF THE WORLD. Animals breathe out carbon dioxide. Plants drink it and breathe out oxygen. Animals breathe that in… round and round, forever — and YOU restarted it.\n\nI said each of you was chosen for a gift. Now you’ve seen them: the one who never quit. The one who spotted what others missed. The ones who held the team together. It was never about the atoms. It was always about YOU.\n\nWell done, CELL. The world is breathing — because of you."
""

---

## 3 · ⭐ Scan messages (`src/components/ScanToast.tsx`)

| English | HE |
|---|---|
| (got an atom) `YES! You locked in a {name}. Keep going!` | ___ |
| (set complete) `That’s everything — YOU DID IT! Carry it to the Control Room.` | ___ |
| (duplicate card) `You already grabbed that one — go find a new spark!` | ___ |
| (wrong atom) `Not for this build — keep hunting, you’ve got this!` | ___ |
| (enough already) `You’ve got enough {name} — find the next colour!` | ___ |
| (a Noble/trap) `Ooh, that one likes to be alone — leave it and grab another!` | ___ |
| (unreadable) `Hmm, the signal’s fuzzy on that one. Try a different one!` | ___ |

---

## 4 · ⭐ Briefing screen (`BriefingScreen.tsx`)

| English | HE |
|---|---|
| WHAT TO MAKE | ___ |
| WHERE TO LOOK | ___ |
| Begin the Hunt | ___ |
| ACT / TRANSMISSION (header words) | ___ |
| colour cue, e.g. `2 white`, `1 red` | (use glossary colours) |
| finale: `You did it, {cellName}. The world is breathing again — because of you. Rest now, heroes. The Magister is proud.` | ___ |
| CELL COMPLETE | ___ |

## 4b · ⭐ Hunt screen (`HuntScreen.tsx`)

| English | HE |
|---|---|
| seeking {Molecule} | ___ |
| SENSOR FIELD · ACT {n} | ___ |
| HOLDING FIELD | ___ |
| THE SET IS WHOLE | ___ |
| Carry your lattice back to the Control Room — only they can stabilize the bond. | ___ |
| (solo) The set is whole · Forge the bond | ___ |

## 4c · ⭐ Reveal screen (`RevealScreen.tsx`)

| English | HE |
|---|---|
| STABILIZED | ___ |
| Continue the Descent | ___ |
| (molecule name + reveal text come from §2 / glossary) | — |

## 4d · ⭐ Field hint + status overlays (`App.tsx` FieldOverlays)

| English | HE |
|---|---|
| CONTROL ROOM (hint header) | ___ |
| RE-LINKING… / LINKING… | ___ |
| CODEX (button) | ___ |
| leave team | ___ |

---

## 5 · ⭐ Control dashboard (`ControlDashboard.tsx`) — the Seers see this

| English | HE |
|---|---|
| OPENING CHANNEL… / RE-ESTABLISHING CHANNEL… | ___ |
| CELL · {code} / Abort | ___ |
| CONTROL · {cell} | ___ |
| {n} field / {n} control (presence) | ___ |
| reset team | ___ |
| confirm: `Reset team {x} back to the first mission? This wipes their progress for everyone.` | ___ |
| leave | ___ |
| CELL COMPLETE / `Every lattice in this descent is stabilized. Hold the line.` | ___ |
| ACT {n} · TARGET {nn} | ___ |
| LIVE LATTICE · drag to rotate | ___ |
| SET COMPLETE | ___ |
| GATHERED / `— nothing in the field yet —` | ___ |
| TRANSMIT HINT / TRANSMISSION LOG / `— no transmissions sent —` | ___ |
| Type a transmission to the field… / Send | ___ |
| ⟡ Verify the model · Confirm Bond | ___ |
| Awaiting the full set… | ___ |
| STABILIZED (seal banner) | ___ |
| **Hint preset 1:** `↻ Relay the clue` (sends the current clue) | ___ |
| **Hint preset 2:** label `You have enough — assemble` → text `You already hold what you need. Bring the atoms together.` | ___ |
| **Hint preset 3:** label `A sealed one won’t bond` → text `One of those is sealed and will never bond — find another.` | ___ |
| **Hint preset 4:** label `Search the changed places` → text `Look where the world feels changed — heat, water, ash.` | ___ |

---

## 6 · ⭐ The Ceremony — the TV reveal (`ManagerPortal.tsx`)

| English | HE |
|---|---|
| THE INITIATION | ___ |
| `When you are ready, call the chosen — one by one — and let their Order claim them.` | ___ |
| `{Knight/Seer} of the Order of the {Eagle}` → e.g. `אביר ממסדר הנשרים` / `הרואֶה ממסדר הנשרים` | ___ |
| guardian of {the Air} | (glossary) |
| The Order is whole | ___ |
| `{n} knights have risen. Rise — and bring the world back to life.` | ___ |
| ⟡ Begin the Initiation / ⟡ Call the next Knight | ___ |

---

## 7 · ⭐ Codex flavor (`elements.ts` + `molecules.ts`) — shown if a player opens the Codex

**Atoms** (each line is one atom’s description):
- Hydrogen: "The first and smallest. Hydrogen remembers the beginning of everything and is desperate to hold on to anything. One hand only — but it never lets go." ""
- Oxygen: "Hungry and red. Oxygen takes with both hands and gives warmth in return — or fire, if provoked. Most of what the world breathes passes through its grip." ""
- Carbon: "The builder. Carbon holds four bonds at once and never tires of construction." ""
- Nitrogen: "Aloof and blue. Nitrogen binds in threes and resists being split. It fills the sky and asks for nothing." ""
- Sodium: "Soft, violet, and reckless. Sodium gives away its single bond at the slightest touch and flares when it meets water." ""
- Chlorine: "Pale green and sharp-edged. Chlorine wants exactly one thing and will scour a room to find it." ""
- Helium: "Golden and complete. Helium needs nothing and bonds with no one. A perfect, useless treasure." ""
- Neon: "It glows when the world burns around it, and stays exactly itself. Neon will not lend a hand." ""
- Argon: "The lazy one. Argon has filled the air for eons and never once joined a bond. There is nothing here to gather." ""

**Molecules:**
- Hydrogen Gas: "Two tiny white sparks holding hands. Hydrogen is the very first thing the universe ever made — and the first thing you made too." ""
- Salt: "A wild violet spark and a sharp green one, snapped together. On their own they are trouble — together they are the salt on your fries." ""
- Water: "Two white, one red. Water is the most important thing alive — every plant, every animal, every one of you is mostly this." ""
- Ammonia: "One calm blue spark holding three white ones. You have smelled it before — the sharp bite in cleaning spray." ""
- Methane: "One grey builder gripping four white sparks. Methane is the gas that makes fire." ""
- Oxygen Gas: "Two red sparks bound tight. This is the air in your lungs right now — animals breathe it IN, and plants breathe it back out for us." ""
- Carbon Dioxide: "One grey, two red, in a straight line. This is the air you breathe OUT — and the air plants are hungry to drink in." ""

**Codex screen labels:** The Codex · ATOMS DISCOVERED · LATTICES STABILIZED · STABILIZED LATTICE · UNSTABILIZED · Close · Seal Entry · `THE UNBINDING RECEDES WHERE A SHAPE STILL HOLDS.` **HE (each):** ___

---

## 8 · ◽ Lower priority (solo-only / staff-facing — translate if time allows)

**Boot intro (solo only — the opening *video* covers this for the event):**
"The signal found you. It only ever finds the right ones. / I am the Magister [→ראש המסדר]. I called you here because you are not ordinary — each of you carries a gift the world has been missing. / You can’t see your power yet. This mission will show you what you’re made of. / Together you are a CELL. Tell me its name — and we begin." + labels: THE MAGISTER→ראש המסדר, SIGNAL LOCK, NAME YOUR CELL, Establish Cell. ""

**Bond ritual (solo only):** THE BONDING RITUAL · All hands on the lattice · `Press and hold — every hand you can muster — to pull the atoms together.` · `HOLD. The bond is taking. Do not let go.` · BOUND · return to the field. ""

**Entry / Join (kids skip these via badge; staff use them to set up the control PCs):**
Assign this device · Field Device · Control Room · `The watch station — track the team, send hints, see the lattice in 3D` · run solo · Which cell are you? · Tune to a cell · back. ""

**Manager portal admin UI (staff only — fine to leave in English):**
LOAD ARRIVED NAME CLIPS · ROSTER · MARK ARRIVED · here / absent · SEER · Add · Begin the Ceremony · reset attendance, etc.

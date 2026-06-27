# The Lattice / המטריקס — Hebrew localization

**Layout:** for every section, the **English** is listed first, then the **Hebrew** underneath (right-aligned). The numbers match across the two blocks, so Hebrew line *N* is the translation of English line *N*. All `{placeholders}` and `\n\n` breaks are preserved exactly. Masculine-plural (אתם) throughout; element symbols unchanged; names per glossary.

---

## 1 · Glossary

*(Kept as a paired table on purpose — a glossary is a lookup, so the two columns belong side by side.)*

**Confirmed (yours):**

| English | עברית |
|---|---|
| head of the Order (the voice) | ראש המסדר |
| the Order / a Knight / the Seer | המסדר / אביר / הרואה |
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

**★NEW — world-terms I coined (confirm / swap):**

| English | עברית (used here) | Alternatives |
|---|---|---|
| lattice | **מטריקס** (echoes the title) | סריג / מבנה |
| the Descent | **המסע** | הצלילה |
| Act {n} | **מערכה {n}** | — |
| the Initiation | **טקס ההסמכה** | ההכתרה / החניכה |
| the Bonding Ritual | **טקס הקשירה** | — |
| The Unbinding | **הפירוק** | ההתפרקות / ההתרה |
| Codex | **הכתבים העתיקים** | הקודקס / ספר הידע |
| Control Room / Control | **חדר הבקרה / הבקרה** | — |
| Sensor / Holding Field | **שדה החיישנים / שדה ההחזקה** | (Holding → המאגר) |
| bond / stabilize / Forge | **קשר / לייצב·מיוצב / צרו את הקשר** | (Forge → חשלו) |

> Agreement reminder: **ניצוץ → ניצוצות** takes **masculine** adjectives (ניצוצות לבנים / אדומים).

---

## 2 · Mission story — `src/data/missions.ts`

**English**

1. **M1 Hydrogen · briefing** — First task, CELL — and an easy one to start. Make HYDROGEN. Find two white sparks and bring them together. You've got this.
2. **M1 · clue** — White sparks are tiny and there are lots of them. Look low, look close — start right near where you're standing.
3. **M1 · reveal** — Done! That's HYDROGEN — the very first thing that ever existed. You made it look easy. I chose well.
4. **M2 Salt · briefing** — Next: SALT — yes, the kind on your fries. Find one violet spark and one green one. Two colours, one team.
5. **M2 · clue** — Violet is rare and a little wild. Green likes to hide in corners. Spread out and shout when you spot one.
6. **M2 · reveal** — SALT! The violet and the green grabbed each other in a flash. Nice teamwork — that's a gift, you know. Keep going.
7. **M3 Water · briefing** — Now WATER — the most important thing alive. Two white sparks and one red one. You already know how to find white.
8. **M3 · clue** — Red ones glow warm. Two white, one red — gather all three and you're there.
9. **M3 · reveal** — WATER. Every living thing needs it, and you made it from almost nothing. That took focus. I'm impressed — next!
10. **M4 Ammonia · briefing** — A tricky one: AMMONIA — the sharp smell in cleaning spray. One blue spark and THREE white. You can do hard things.
11. **M4 · clue** — Blue is calm and hides out in the open. Three whites is a lot — split the hunt between you.
12. **M4 · reveal** — AMMONIA — four pieces, locked tight. The hardest yet, and you didn't quit. THAT is who you are. Almost there.
13. **M5 Methane · briefing** — Last one before you rest: METHANE — the gas that makes fire. One grey spark and FOUR white. Big build. Big team.
14. **M5 · clue** — Grey is heavy and slow, so it won't be far. Four whites is a lot — share the load and hunt together.
15. **M5 · reveal** — METHANE! Five pieces — your biggest build yet. Hour one is COMPLETE. Rest now, drink some water, shake out your legs. When you come back, the real secret begins. You earned it.
16. **M6 Oxygen · briefing** — Welcome back, CELL. Here's the big secret: BREATHING. Right now you're breathing IN oxygen to stay alive. Let's make some — find two red sparks.
17. **M6 · clue** — Red ones are warm and glowing. You only need two. Go!
18. **M6 · reveal** — OXYGEN — the air in your lungs this very second. Animals like us breathe it IN. But what do we breathe OUT? Come — I'll show you.
19. **M7 Carbon Dioxide · briefing** — When you breathe OUT, you let go of CARBON DIOXIDE — you make it all day without even trying. Build it: one grey, two red.
20. **M7 · clue** — One grey, two red. You've found both colours before — you know what to do.
21. **M7 · reveal** — CARBON DIOXIDE — your own breath, made real. Animals breathe it out… and plants? Plants are HUNGRY for it. Watch what happens next.
22. **M8 Water (plant) · briefing** — Here's the magic: plants drink your carbon dioxide, plus WATER and sunlight, to make food — and to breathe out fresh air. Bring the water: two white, one red.
23. **M8 · clue** — Two white, one red — same as before. You're fast at this now.
24. **M8 · reveal** — Now the plant has everything: your breath, water, and sunlight. And it gives something back… the very air you breathe. One last build, and you'll see the whole circle.
25. **M9 The Breath of the World · briefing** — The finale, CELL. The plant breathes out OXYGEN — and the circle closes. Make one last breath for the world. Two red sparks. Make it count.
26. **M9 · clue** — Two red. You know exactly where to look.
27. **M9 · reveal** — There it is — the BREATH OF THE WORLD. … It was never about the atoms. It was always about YOU. … Well done, CELL. The world is breathing — because of you.

**עברית**

<div dir="rtl" align="right">
1. המשימה הראשונה — ואחת קלה להתחלה. צרו מימן. מצאו שני ניצוצות לבנים וחברו אותם. אתם מסוגלים.<br>
2. ניצוצות לבנים הם קטנטנים, ויש מהם המון. חפשו נמוך וקרוב — ממש ליד הרגליים שלכם.<br>
3. סיימתם! זהו מימן — הדבר הראשון שאי-פעם היה קיים. גרמתם לזה להיראות קל. בחרתי נכון.<br>
4. הבא בתור: מלח — כן, זה שעל הצ'יפס. מצאו ניצוץ סגול אחד וניצוץ ירוק אחד. שני צבעים, צוות אחד.<br>
5. הסגול נדיר וקצת פראי. הירוק אוהב להתחבא בפינות. התפזרו, ומי שמוצא — שיצעק!<br>
6. מלח! הסגול והירוק תפסו אחד את השני בן רגע. עבודת צוות יפה — וזו מתנה, שתדעו. תמשיכו.<br>
7. עכשיו מים — הדבר הכי חשוב לחיים. שני ניצוצות לבנים ואחד אדום. את הלבנים אתם כבר יודעים למצוא.<br>
8. האדומים זוהרים בחום. שניים לבנים, אחד אדום — אספו את שלושתם, וזהו, הגעתם.<br>
9. מים. כל יצור חי צריך אותם, ואתם יצרתם אותם כמעט מכלום. זה דרש ריכוז. אני מתרשם — קדימה, הלאה!<br>
10. אחת קצת קשה: אמוניה — הריח החריף בתרסיס ניקוי. ניצוץ כחול אחד ושלושה לבנים. אתם יודעים לעשות דברים קשים.<br>
11. הכחול רגוע, ומתחבא דווקא במקום גלוי. שלושה לבנים זה הרבה — חלקו את החיפוש ביניכם.<br>
12. אמוניה — ארבעה חלקים, מחוברים חזק. הכי קשה עד עכשיו, ולא ויתרתם. זה מי שאתם, באמת. כמעט שם.<br>
13. אחרונה לפני שאתם נחים: מתאן — הגז שמדליק אש. ניצוץ אפור אחד וארבעה לבנים. בנייה גדולה. צוות גדול.<br>
14. האפור כבד ואיטי, אז הוא לא יהיה רחוק. ארבעה לבנים זה הרבה — חלקו את העבודה וחפשו ביחד.<br>
15. מתאן! חמישה חלקים — הבנייה הכי גדולה שלכם עד היום. שעה ראשונה — הושלמה! עכשיו נוחו, שתו קצת מים, נערו את הרגליים. כשתחזרו, מתחיל הסוד האמיתי. הרווחתם את זה.<br>
16. ברוכים השבים, חוליה. הנה הסוד הגדול: נשימה. ממש עכשיו אתם נושמים פנימה חמצן, כדי להישאר בחיים. בואו נכין קצת — מצאו שני ניצוצות אדומים.<br>
17. האדומים חמים וזוהרים. צריך רק שניים. קדימה!<br>
18. חמצן — האוויר שבתוך הריאות שלכם, ברגע זה ממש. חיות כמונו נושמות אותו פנימה. אבל מה אנחנו נושפים החוצה? בואו — אני אראה לכם.<br>
19. כשאתם נושפים החוצה, אתם משחררים פחמן דו-חמצני — אתם מייצרים אותו כל היום, בלי אפילו לנסות. בנו אותו: אפור אחד, שניים אדומים.<br>
20. אפור אחד, שניים אדומים. את שני הצבעים כבר מצאתם פעם — אתם יודעים מה לעשות.<br>
21. פחמן דו-חמצני — הנשימה שלכם עצמכם, שהפכה למשהו אמיתי. חיות נושפות אותו החוצה… והצמחים? הצמחים ממש רעבים לו. תראו מה קורה עכשיו.<br>
22. והנה הקסם: הצמחים שותים את הפחמן הדו-חמצני שלכם, ועוד מים ואור שמש. כך הם מייצרים אוכל — וגם נושפים החוצה אוויר נקי. הביאו את המים: שניים לבנים, אחד אדום.<br>
23. שניים לבנים, אחד אדום — בדיוק כמו קודם. אתם כבר זריזים בזה.<br>
24. עכשיו לצמח יש הכול: הנשימה שלכם, מים, ואור שמש. והוא נותן משהו בחזרה… בדיוק את האוויר שאתם נושמים. עוד בנייה אחת אחרונה, ותראו את כל המעגל.<br>
25. הסיום הגדול, חוליה. הצמח נושף החוצה חמצן — והמעגל נסגר. צרו נשימה אחת אחרונה בשביל העולם. שני ניצוצות אדומים. תנו את הכול.<br>
26. שניים אדומים. אתם יודעים בדיוק איפה לחפש.<br>
27. הנה זה — נשימת העולם. חיות נושפות החוצה פחמן דו-חמצני. צמחים קולטים אותו, מייצרים סוכר ופולטים החוצה חמצן. בעלי חיים ובני אדם נושמים אותו פנימה. וכך הלאה, סיבוב אחרי סיבוב, לנצח — ואתם, אתם התנעתם אותו מחדש.\n\nאמרתי לכם שכל אחד מכם נבחר בזכות מתנה. עכשיו ראיתם אותן: אלו שאף פעם לא ויתרו, אלה שששמו לב למה שאחרים פספסו. אלה שהחזיקו את הצוות ביחד ואלו שהמשיכו גם כשכבר לא היה חשק. זה אף פעם לא היה קשור לאטומים. זה תמיד היה קשור אליכם. כל הכבוד צוות  העולם נושם — בזכותכם.
</div>

---

## 3 · Scan messages — `src/components/ScanToast.tsx`

**English**

1. *(got an atom)* `YES! You locked in a {name}. Keep going!`
2. *(set complete)* `That's everything — YOU DID IT! Carry it to the Control Room.`
3. *(duplicate card)* `You already grabbed that one — go find a new spark!`
4. *(wrong atom)* `Not for this build — keep hunting, you've got this!`
5. *(enough already)* `You've got enough {name} — find the next colour!`
6. *(a Noble/trap)* `Ooh, that one likes to be alone — leave it and grab another!`
7. *(unreadable)* `Hmm, the signal's fuzzy on that one. Try a different one!`

**עברית**

<div dir="rtl" align="right">
1. יש! תפסתם {name}. ככה ממשיכים!<br>
2. זהו, יש לכם הכול — הצלחתם! קחו את זה לחדר הבקרה.<br>
3. את זה כבר תפסתם — לכו תמצאו ניצוץ חדש!<br>
4. לא בשביל הבנייה הזאת — תמשיכו לחפש, אתם מסוגלים!<br>
5. יש לכם מספיק {name} — עכשיו לצבע הבא!<br>
6. אופס, זה אוהב להיות לבד — עזבו אותו ותפסו אחר!<br>
7. הממ, הקליטה על זה קצת מטושטשת. נסו אחד אחר!
</div>

---

## 4 · Briefing screen — `BriefingScreen.tsx`

**English**

1. WHAT TO MAKE
2. WHERE TO LOOK
3. Begin the Hunt
4. ACT / TRANSMISSION (headers)
5. colour cue — `2 white`, `1 red`, `3 white`, `1 blue`, `1 violet`, `1 green`, `1 grey`
6. finale — `You did it, {cellName}. The world is breathing again — because of you. Rest now, heroes. The Magister is proud.`
7. CELL COMPLETE

**עברית**

<div dir="rtl" align="right">
1. מה בונים<br>
2. איפה מחפשים<br>
3. צאו לציד!<br>
4. מערכה / שידור<br>
5. ‏2 לבנים · 1 אדום · 3 לבנים · 1 כחול · 1 סגול · 1 ירוק · 1 אפור<br>
6. הצלחתם, {cellName}. העולם שוב נושם — בזכותכם. עכשיו נוחו, גיבורים. ראש המסדר גאה בכם.<br>
7. חוליה הושלמה
</div>

---

## 4b · Hunt screen — `HuntScreen.tsx`

**English**

1. seeking {Molecule}
2. SENSOR FIELD · ACT {n}
3. HOLDING FIELD
4. THE SET IS WHOLE
5. Carry your lattice back to the Control Room — only they can stabilize the bond.
6. *(solo)* The set is whole · Forge the bond

**עברית**

<div dir="rtl" align="right">
1. מחפשים {Molecule}<br>
2. שדה החיישנים · מערכה {n}<br>
3. שדה ההחזקה<br>
4. הסט שלם!<br>
5. קחו את המטריקס שלכם בחזרה לחדר הבקרה — רק שם אפשר לייצב את הקשר.<br>
6. הסט שלם · צרו את הקשר
</div>

---

## 4c · Reveal screen — `RevealScreen.tsx`

**English**

1. STABILIZED
2. Continue the Descent

**עברית**

<div dir="rtl" align="right">
1. מיוצב!<br>
2. המשיכו במסע
</div>

---

## 4d · Field hint + status overlays — `App.tsx` FieldOverlays

**English**

1. CONTROL ROOM (hint header)
2. RE-LINKING… / LINKING…
3. CODEX (button)
4. leave team

**עברית**

<div dir="rtl" align="right">
1. חדר הבקרה<br>
2. מתחבר מחדש… / מתחבר…<br>
3. הכתבים העתיקים<br>
4. יציאה מהחוליה
</div>

---

## 5 · Control dashboard — `ControlDashboard.tsx` (the Seers see this)

**English**

1. OPENING CHANNEL… / RE-ESTABLISHING CHANNEL…
2. CELL · {code} / Abort
3. CONTROL · {cell}
4. {n} field / {n} control
5. reset team
6. confirm — `Reset team {x} back to the first mission? This wipes their progress for everyone.`
7. leave
8. CELL COMPLETE / `Every lattice in this descent is stabilized. Hold the line.`
9. ACT {n} · TARGET {nn}
10. LIVE LATTICE · drag to rotate
11. SET COMPLETE
12. GATHERED / `— nothing in the field yet —`
13. TRANSMIT HINT / TRANSMISSION LOG / `— no transmissions sent —`
14. Type a transmission to the field… / Send
15. ⟡ Verify the model · Confirm Bond
16. Awaiting the full set…
17. STABILIZED (seal banner)
18. **Hint 1** — `↻ Relay the clue`
19. **Hint 2** label — `You have enough — assemble`
20. **Hint 2** text — `You already hold what you need. Bring the atoms together.`
21. **Hint 3** label — `A sealed one won't bond`
22. **Hint 3** text — `One of those is sealed and will never bond — find another.`
23. **Hint 4** label — `Search the changed places`
24. **Hint 4** text — `Look where the world feels changed — heat, water, ash.`

**עברית**

<div dir="rtl" align="right">
1. פותח ערוץ… / מחדש את הערוץ…<br>
2. חוליה · {code} / ביטול<br>
3. בקרה · {cell}<br>
4. ‏{n} בשדה / {n} בבקרה<br>
5. איפוס חוליה<br>
6. לאפס את חוליה {x} בחזרה למשימה הראשונה? זה ימחק את כל ההתקדמות, לכולם.<br>
7. יציאה<br>
8. חוליה הושלמה / כל מטריקס במסע הזה כבר מיוצב. החזיקו מעמד.<br>
9. מערכה {n} · מטרה {nn}<br>
10. מטריקס חי · גררו כדי לסובב<br>
11. הסט הושלם<br>
12. נאספו / — עדיין אין כלום בשדה —<br>
13. שלחו רמז / יומן שידורים / — לא נשלחו שידורים —<br>
14. הקלידו שידור לשדה… / שלח<br>
15. ⟡ בדקו את המודל · אשרו את הקשר<br>
16. ממתינים לסט המלא…<br>
17. מיוצב<br>
18. ↻ העבירו את הרמז<br>
19. יש לכם מספיק — הרכיבו<br>
20. כבר יש לכם כל מה שצריך. חברו את האטומים יחד.<br>
21. אטום סגור לא מתחבר<br>
22. אחד מהם סגור ולעולם לא יתחבר — מצאו אחר.<br>
23. חפשו במקומות שהשתנו<br>
24. חפשו איפה שהעולם מרגיש שונה — חום, מים, אפר.
</div>

---

## 6 · The Ceremony — `ManagerPortal.tsx` (the TV reveal)

**English**

1. THE INITIATION
2. `When you are ready, call the chosen — one by one — and let their Order claim them.`
3. `{Knight/Seer} of the Order of the {Eagle}` — pattern
4. guardian of {the Air} — pattern
5. The Order is whole
6. `{n} knights have risen. Rise — and bring the world back to life.`
7. ⟡ Begin the Initiation / ⟡ Call the next Knight

**עברית**

<div dir="rtl" align="right">
1. טקס ההסמכה<br>
2. כשאתם מוכנים, קראו לנבחרים — אחד אחד — ותנו למסדר שלהם לאמץ אותם.<br>
3. ‏{Knight/Seer} ממסדר ה{Eagle}  ←  אביר ממסדר הנשרים / הרואה ממסדר הנשרים<br>
4. שומר {the Air}  ←  שומר האוויר / שומר המים / שומר השמש<br>
5. המסדר שלם<br>
6. ‏{n} אבירים קמו. קומו — והחזירו את העולם לחיים.<br>
7. ⟡ התחילו את ההסמכה / ⟡ קראו לאביר הבא
</div>

---

## 7a · Codex — Atoms (`elements.ts`)

**English**

1. **Hydrogen** — The first and smallest. Hydrogen remembers the beginning of everything and is desperate to hold on to anything. One hand only — but it never lets go.
2. **Oxygen** — Hungry and red. Oxygen takes with both hands and gives warmth in return — or fire, if provoked. Most of what the world breathes passes through its grip.
3. **Carbon** — The builder. Carbon holds four bonds at once and never tires of construction.
4. **Nitrogen** — Aloof and blue. Nitrogen binds in threes and resists being split. It fills the sky and asks for nothing.
5. **Sodium** — Soft, violet, and reckless. Sodium gives away its single bond at the slightest touch and flares when it meets water.
6. **Chlorine** — Pale green and sharp-edged. Chlorine wants exactly one thing and will scour a room to find it.
7. **Helium** — Golden and complete. Helium needs nothing and bonds with no one. A perfect, useless treasure.
8. **Neon** — It glows when the world burns around it, and stays exactly itself. Neon will not lend a hand.
9. **Argon** — The lazy one. Argon has filled the air for eons and never once joined a bond. There is nothing here to gather.

**עברית**

<div dir="rtl" align="right">
1. הראשון והקטן ביותר. המימן זוכר את ראשית הכול, ונואש להיאחז בכל דבר. יד אחת בלבד — אבל הוא אף פעם לא מרפה.<br>
2. רעב ואדום. החמצן לוקח בשתי ידיים ומחזיר חום — או אש, אם מרגיזים אותו. רוב מה שהעולם נושם עובר דרך האחיזה שלו.<br>
3. הבנאי. הפחמן מחזיק ארבעה קשרים בבת אחת, ואף פעם לא נמאס לו לבנות.<br>
4. מרוחק וכחול. החנקן מתקשר בשלשות ומתנגד שיפרידו אותו. הוא ממלא את השמיים ולא מבקש כלום.<br>
5. רך, סגול, וחסר זהירות. הנתרן מוותר על הקשר היחיד שלו בנגיעה הקלה ביותר, ומתלקח כשהוא פוגש מים.<br>
6. ירוק חיוור וחד. הכלור רוצה בדיוק דבר אחד, ויסרוק חדר שלם כדי למצוא אותו.<br>
7. זהוב ושלם. ההליום לא צריך כלום ולא מתקשר עם אף אחד. אוצר מושלם וחסר תועלת.<br>
8. הוא זוהר כשהעולם בוער מסביבו, ונשאר בדיוק הוא עצמו. הניאון לא יושיט יד.<br>
9. העצלן. הארגון ממלא את האוויר כבר עידנים ואף פעם לא הצטרף לאף קשר. אין כאן מה לאסוף.
</div>

---

## 7b · Codex — Molecules (`molecules.ts`)

**English**

1. **Hydrogen Gas** — Two tiny white sparks holding hands. Hydrogen is the very first thing the universe ever made — and the first thing you made too.
2. **Salt** — A wild violet spark and a sharp green one, snapped together. On their own they are trouble — together they are the salt on your fries.
3. **Water** — Two white, one red. Water is the most important thing alive — every plant, every animal, every one of you is mostly this.
4. **Ammonia** — One calm blue spark holding three white ones. You have smelled it before — the sharp bite in cleaning spray.
5. **Methane** — One grey builder gripping four white sparks. Methane is the gas that makes fire.
6. **Oxygen Gas** — Two red sparks bound tight. This is the air in your lungs right now — animals breathe it IN, and plants breathe it back out for us.
7. **Carbon Dioxide** — One grey, two red, in a straight line. This is the air you breathe OUT — and the air plants are hungry to drink in.

**עברית**

<div dir="rtl" align="right">
1. שני ניצוצות לבנים קטנטנים שמחזיקים ידיים. המימן הוא הדבר הראשון שהיקום אי-פעם יצר — וגם הדבר הראשון שאתם יצרתם.<br>
2. ניצוץ סגול פראי וניצוץ ירוק חד, שנצמדו יחד. כל אחד לבד הוא צרה — ביחד הם המלח שעל הצ'יפס.<br>
3. שניים לבנים, אחד אדום. המים הם הדבר הכי חשוב לחיים — כל צמח, כל חיה, וכל אחד מכם עשוי בעיקר מהם.<br>
4. ניצוץ כחול רגוע אחד שמחזיק שלושה לבנים. כבר הרחתם את זה פעם — העקיצה החריפה בתרסיס ניקוי.<br>
5. בנאי אפור אחד שאוחז בארבעה ניצוצות לבנים. המתאן הוא הגז שמדליק אש.<br>
6. שני ניצוצות אדומים קשורים חזק. זה האוויר שבריאות שלכם עכשיו — חיות נושמות אותו פנימה, וצמחים נושפים אותו החוצה בשבילנו.<br>
7. אפור אחד, שניים אדומים, בשורה ישרה. זה האוויר שאתם נושפים החוצה — והאוויר שהצמחים רעבים לשתות.
</div>

---

## 7c · Codex — screen labels

**English**

1. The Codex
2. ATOMS DISCOVERED
3. LATTICES STABILIZED
4. STABILIZED LATTICE
5. UNSTABILIZED
6. Close
7. Seal Entry
8. `THE UNBINDING RECEDES WHERE A SHAPE STILL HOLDS.`

**עברית**

<div dir="rtl" align="right">
1. הכתבים העתיקים<br>
2. אטומים שהתגלו<br>
3. מטריקסים שיוצבו<br>
4. מטריקס מיוצב<br>
5. לא מיוצב<br>
6. סגירה<br>
7. חתמו את הערך<br>
8. הפירוק נסוג במקום שבו צורה עדיין מחזיקה.
</div>

---

## 8 · Lower priority (solo-only / staff-facing)

### 8a · Boot intro (solo only)

**English**

1. The signal found you. It only ever finds the right ones.
2. I am the Magister. I called you here because you are not ordinary — each of you carries a gift the world has been missing.
3. You can't see your power yet. This mission will show you what you're made of.
4. Together you are a CELL. Tell me its name — and we begin.
5. labels — THE MAGISTER / SIGNAL LOCK / NAME YOUR CELL / Establish Cell

**עברית**

<div dir="rtl" align="right">
1. האות מצא אתכם. הוא מוצא תמיד רק את הנכונים.<br>
2. אני ראש המסדר. קראתי לכם לכאן כי אתם לא רגילים — כל אחד מכם נושא מתנה שחסרה לעולם.<br>
3. אתם עדיין לא רואים את הכוח שלכם. המשימה הזאת תראה לכם ממה אתם עשויים.<br>
4. ביחד אתם חוליה. אמרו לי את שמה — ונתחיל.<br>
5. ראש המסדר / נעילת אות / תנו שם לחוליה / הקימו חוליה
</div>

### 8b · Bond ritual (solo only)

**English**

1. THE BONDING RITUAL
2. All hands on the lattice
3. `Press and hold — every hand you can muster — to pull the atoms together.`
4. `HOLD. The bond is taking. Do not let go.`
5. BOUND
6. return to the field

**עברית**

<div dir="rtl" align="right">
1. טקס הקשירה<br>
2. כל הידיים על המטריקס<br>
3. לחצו והחזיקו — כל יד שאתם יכולים לגייס — כדי למשוך את האטומים זה אל זה.<br>
4. החזיקו. הקשר נתפס. אל תרפו.<br>
5. נקשר!<br>
6. חזרה לשדה
</div>

### 8c · Entry / Join (staff set up the control PCs)

**English**

1. Assign this device
2. Field Device
3. Control Room
4. `The watch station — track the team, send hints, see the lattice in 3D`
5. run solo
6. Which cell are you?
7. Tune to a cell
8. back

**עברית**

<div dir="rtl" align="right">
1. שייכו את המכשיר הזה<br>
2. מכשיר שדה<br>
3. חדר הבקרה<br>
4. עמדת התצפית — עקבו אחרי החוליה, שלחו רמזים, וראו את המטריקס בתלת-ממד.<br>
5. הפעלה לבד<br>
6. לאיזו חוליה אתם שייכים?<br>
7. כווננו לחוליה<br>
8. חזרה
</div>

### 8d · Manager portal admin UI (staff only)

Left in English per your note: `LOAD ARRIVED NAME CLIPS`, `ROSTER`, `MARK ARRIVED`, `here / absent`, `SEER`, `Add`, `Begin the Ceremony`, `reset attendance`, etc. Say the word and I'll translate these too.

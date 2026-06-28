# New Hour-1 missions (Oxygen · CO₂ · Glucose) — translate, then voice

Step 1: run the **translation prompt** (any LLM) → get Hebrew → send it back to
Claude Code to put in the app. Step 2: fill the Hebrew into the **TTS prompt** and
run it in Claude Desktop (ElevenLabs MCP) → drop the mp3s into `public/audio/`.

---

## 1) TRANSLATION PROMPT

You are translating game text to Hebrew for a live-action adventure for 7th–8th-
grade kids. The narrator is **ראש המסדר** — a warm, wise, encouraging mentor. Keep
it FUN, short, simple, and by COLOUR not chemistry. Address the team as **אתם**
(masculine plural).

**Key term:** atoms are called **"יחידת חומר"** (feminine) in this game — so
numbers and colours must agree in the **feminine** (e.g. "two red" → "שתי יחידות
חומר אדומות"; "one grey" → "יחידת חומר אפורה אחת"). Colour words: white=לבנה,
red=אדומה, grey=אפורה. The English word "sparks" = "יחידות חומר".

**Names (use exactly):** oxygen → גז חמצן · carbon dioxide → פחמן דו-חמצני ·
glucose → גלוקוז · sugar → סוכר · methane → מתאן. Keep the heroic, celebratory
tone. Return all 12 lines, clearly labelled.

— MISSION 6 · OXYGEN —
briefing: Next: OXYGEN — the air every animal breathes. Two red sparks, that's all. Easy after methane.
clue: Red ones glow warm — you've grabbed them before. Just two this time. Go!
reveal: OXYGEN! The air in your lungs this very second. You made the thing that keeps every animal alive. Nice — keep rolling.

— MISSION 7 · CARBON DIOXIDE —
briefing: Now CARBON DIOXIDE — the gas you breathe OUT. One grey spark and two red. You know both colours.
clue: One grey, two red. Grey is heavy and stays low; red glows warm. Grab all three.
reveal: CARBON DIOXIDE! You breathe this out with every breath, and plants drink it in. You're flying today — one giant build left.

— MISSION 8 · GLUCOSE (the bonus "champions" build) —
briefing: The CHAMPIONS' build, only for the fastest teams: GLUCOSE — the sugar that fuels every living thing. It's massive: six grey, twelve white, six red. Split up and go big.
clue: Twenty-four pieces — the biggest yet. Some hunt grey, some white, some red, and bring them all back together.
reveal: GLUCOSE! Twenty-four pieces — the largest thing you have ever built. This is the sugar inside every plant, and inside you. You are LEGENDS of the Order. Rest now — you earned every bit of it.

— CODEX entries (short encyclopedia lines, same voice; text-only, no audio) —
oxygen: Two red, bound tight. This is the oxygen in every breath — the air that keeps every animal alive.
carbon dioxide: One grey between two red, in a straight line. The gas you breathe out with every breath — and the gas plants are hungry to drink in.
glucose: Six grey, twelve white, six red — twenty-four pieces in one ring. Glucose is sugar: the fuel that runs every living thing, from a blade of grass to you.

---

## 2) TTS PROMPT (fill in the Hebrew from step 1, then run in Claude Desktop)

You have the ElevenLabs MCP connected. Generate Hebrew voice clips in my **מגיסטר**
voice (= ראש המסדר). Use the SAME model/settings as my other clips
(eleven_multilingual_v2); MP3 44.1kHz/128kbps; Hebrew. Save each with the EXACT
filename (overwrite if present). Add **niqqud** to any word that gets
mispronounced (e.g. מסדר→מִסְדָּר, חברו→וְחַבְּרוּ). One at a time; then list them.

**`m6-oxygen-briefing.mp3`**
המשימה הבאה: גז חמצן — חלק מהאוויר שכל בעל חיים נושם. שתי יחידות חומר אדומות, וזהו. קלי קלות אחרי המתאן.

**`m6-oxygen-clue.mp3`**
האדומות זוהרות בחום — כבר תפסתם אותן בעבר. רק שתיים הפעם. קדימה!

**`m6-oxygen-reveal.mp3`**
גז חמצן! האוויר שממלא את הריאות שלכם ברגע זה ממש. יצרתם את מה ששומר על כל בעל חיים בחיים. יפה — ממשיכים הלאה!

**`m7-co2-briefing.mp3`**
עכשיו פחמן דו-חמצני — הגז שאתם נושפים החוצה. יחידת חומר אפורה אחת, ושתי יחידות חומר אדומות. אתם כבר מכירים את שני הצבעים.

**`m7-co2-clue.mp3`**
אחת אפורה, שתיים אדומות. האפורה כבדה ונשארת למטה; האדומות זוהרות בחום. אספו את שלושתן.

**`m7-co2-reveal.mp3`**
פחמן דו-חמצני! אתם נושפים אותו החוצה בכל נשימה, והצמחים שותים אותו פנימה. אתם עפים היום — נשארה רק בנייה ענקית אחת.

**`m8-glucose-briefing.mp3`**
בניית האלופים, רק לקבוצות המהירות ביותר: גלוקוז — הסוכר שנותן אנרגיה לכל יצור חי. בנייה ענקית: שש יחידות חומר אפורות, שתים עשרה לבנות, ושש אדומות. התפצלו וצאו בגדול!

**`m8-glucose-clue.mp3`**
עשרים וארבע יחידות חומר — הכי הרבה עד עכשיו. כמה מכם על האפורות, כמה על הלבנות, כמה על האדומות — ואז תאחדו את כולן יחד!

**`m8-glucose-reveal.mp3`**
גלוקוז! עשרים וארבע יחידות חומר — הדבר הגדול ביותר שבניתם אי פעם. זהו הסוכר שנמצא בתוך כל צמח — וגם בתוככם. אתם אגדות של הַמִּסְדָּר! עכשיו תנוחו — הרווחתם כל רגע מזה ביושר.

(9 clips. The Codex lines stay text-only — no audio.)

Then drop the 9 mp3s into `public/audio/` and tell Claude Code to redeploy.

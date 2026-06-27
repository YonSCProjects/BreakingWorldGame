# ראש המסדר — audio generation prompt (ElevenLabs MCP, Claude Desktop)

Paste everything in the box below into Claude Desktop (with the ElevenLabs MCP
connected). It generates every Hour-1 narration clip in the **מגיסטר** voice.

---

You have the ElevenLabs MCP connected. I need you to generate a set of Hebrew
voice-over clips for a game. The narrator is "ראש המסדר" (Head of the Order) — a
warm, wise, theatrical mentor.

**Voice:** First, list my ElevenLabs voices and find the one named **מגיסטר**.
Use that voice's `voice_id` for EVERY clip below. If you can't find it, stop and
tell me — do not substitute another voice.

**Settings for every clip:**
- Model: `eleven_multilingual_v2` (it handles Hebrew well).
- Output: MP3, 44.1 kHz / 128 kbps.
- Voice settings: stability ≈ 0.45, similarity_boost ≈ 0.85, style ≈ 0.3,
  speaker_boost on. (A little slow and grand — he's a mentor, not a newsreader.)
  If those knobs aren't available, just use the voice's defaults.
- Language: Hebrew. Read the punctuation pauses (— and …) for drama.

**Output:** Save each clip as its own MP3 into a folder called `lattice-audio`,
using the EXACT filename given before each line. Generate them one at a time so
nothing gets rate-limited, and when you're done, list every file you created.

Here are the clips — `filename` → text to speak:

**`boot-intro.mp3`**
האות מצא אתכם. הוא מוצא תמיד רק את הנכונים.
אני ראש המסדר. קראתי לכם לכאן כי אתם לא רגילים — כל אחד מכם נושא מתנה שחסרה לעולם.
אתם עדיין לא רואים את הכוח שלכם. המשימה הזאת תראה לכם ממה אתם עשויים.
ביחד אתם חוליה. אמרו לי את שמה — ונתחיל.

**`m1-hydrogen-briefing.mp3`**
המשימה הראשונה — ואחת קלה להתחלה. צרו מימן. מצאו שתי יחידות חומר לבנות וחברו אותן. אתם מסוגלים.

**`m1-hydrogen-clue.mp3`**
יחידות חומר לבנות הן קטנטנות, ויש מהן המון. חפשו נמוך וקרוב — ממש ליד הרגליים שלכם.

**`m1-hydrogen-reveal.mp3`**
סיימתם! זהו מימן — הדבר הראשון שאי-פעם היה קיים. גרמתם לזה להיראות קל. בחרתי נכון.

**`m2-salt-briefing.mp3`**
הבא בתור: מלח — כן, זה שעל הצ׳יפס. מצאו יחידת חומר סגולה אחת ויחידת חומר ירוקה אחת. שני צבעים, צוות אחד.

**`m2-salt-clue.mp3`**
הסגולה נדירה וקצת פראית. הירוקה אוהבת להתחבא בפינות. התפזרו, ומי שמוצא — שיצעק!

**`m2-salt-reveal.mp3`**
מלח! הסגולה והירוקה תפסו אחת את השנייה בן רגע. עבודת צוות יפה — וזו מתנה, שתדעו. תמשיכו.

**`m3-water-briefing.mp3`**
עכשיו מים — הדבר הכי חשוב לחיים. שתי יחידות חומר לבנות ואחת אדומה. את הלבנות אתם כבר יודעים למצוא.

**`m3-water-clue.mp3`**
האדומות זוהרות בחום. שתיים לבנות, אחת אדומה — אספו את שלושתן, וזהו, הגעתם.

**`m3-water-reveal.mp3`**
מים. כל יצור חי צריך אותם, ואתם יצרתם אותם כמעט מכלום. זה דרש ריכוז. אני מתרשם — קדימה, הלאה!

**`m4-ammonia-briefing.mp3`**
אחת קצת קשה: אמוניה — הריח החריף בתרסיס ניקוי. יחידת חומר כחולה אחת ושלוש לבנות. אתם יודעים לעשות דברים קשים.

**`m4-ammonia-clue.mp3`**
הכחולה רגועה, ומתחבאת דווקא במקום גלוי. שלוש לבנות זה הרבה — חלקו את החיפוש ביניכם.

**`m4-ammonia-reveal.mp3`**
אמוניה — ארבעה חלקים, מחוברים חזק. הכי קשה עד עכשיו, ולא ויתרתם. זה מי שאתם, באמת. כמעט שם.

**`m5-methane-briefing.mp3`**
אחרונה לפני שאתם נחים: מתאן — הגז שמדליק אש. יחידת חומר אפורה אחת וארבע לבנות. בנייה גדולה. צוות גדול.

**`m5-methane-clue.mp3`**
האפורה כבדה ואיטית, אז היא לא תהיה רחוקה. ארבע לבנות זה הרבה — חלקו את העבודה וחפשו ביחד.

**`m5-methane-reveal.mp3`**
מתאן! חמישה חלקים — הבנייה הכי גדולה שלכם עד היום. שעה ראשונה — הושלמה! עכשיו נוחו, שתו קצת מים, נערו את הרגליים. כשתחזרו, מתחיל הסוד האמיתי. הרווחתם את זה.

**`cell-complete.mp3`**
הצלחתם! העולם שוב נושם — בזכותכם. עכשיו נוחו, גיבורים. ראש המסדר גאה בכם.

That's all of them — 17 clips. (Hour 2's lines aren't included yet; their Hebrew
isn't final.) Go ahead and generate them now.

---

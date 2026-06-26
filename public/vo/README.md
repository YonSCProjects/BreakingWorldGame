# Magister voice-over (VO)

Drop the Magister's audio cues here. Files are served at `<base>vo/<file>` and
referenced by **stable cue id** from `src/audio/cues.ts` — so adding a line is
"drop the file in, add a `Cue`", no other code.

## Phase 0
- `boot-cold-open.mp3` — the Magister's first breath when the cell wakes the
  device (the "press your palm to the sigil" tap on the Boot screen).

Until that file exists, `AudioEngine` plays a short synthesized hum in its place,
so the iOS audio-unlock path is still audibly testable with zero assets.

## Format
- **MP3 or AAC, mono, ~96 kbps** — the iOS-safe baseline.
- Loudness-normalize every cue to roughly **−16 LUFS** so the welcome and the
  60th scan line are equally audible on a small phone speaker in a loud corridor.
- Language: **Hebrew** (the in-world text layer goes RTL to match).

## Generating in bulk
1. Write the lines into [`scripts/vo-lines.csv`](../../scripts/vo-lines.csv)
   (`filename,text` — one row per cue id; fill the Hebrew `text` column).
2. Generate the raw masters with the saved ElevenLabs voice:
   ```
   $env:ELEVENLABS_API_KEY='<key>'; $env:MAGISTER_VOICE_ID='<id>'; npm run vo
   ```
   This writes `<cue-id>.raw.mp3` here (empty CSV rows and already-existing
   files are skipped, so you can fill the CSV incrementally and never re-spend
   credits).
3. Post-process every master into the app-ready `<cue-id>.mp3`:
   ```powershell
   Get-ChildItem public\vo\*.raw.mp3 | ForEach-Object {
     $out = $_.FullName -replace '\.raw\.mp3$','.mp3'
     ffmpeg -y -i $_.FullName -ac 1 -af loudnorm=I=-16:TP=-1.5:LRA=11 `
       -ar 44100 -c:a libmp3lame -b:a 96k $out
   }
   ```
   The `*.raw.mp3` masters are gitignored; the final `*.mp3` are committed.

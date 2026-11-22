# Lavorare meglio con l'IA (Plenaria HIT)

Präsentations-Website als eine einzige Datei. Keine Abhängigkeiten, kein Build.

- `index.html`: die Website. Doppelklick genügt, läuft offline.
- `META-PROMPT.md`: der Bau-Prompt, wiederverwendbar für andere Kurse.

## Bedienung

Scrollen oder Pfeiltasten, Leertaste, Bild auf/ab (Presenter-Klicker). G Index, P alle Prompts, S Lösung, 1 bis 4 Abstimmungsfälle, T Timer, F Vollbild, L hell/dunkel, M Animationen aus, R Lesemodus.

## Auf Vercel

Als eigenes Projekt anlegen, damit die Chat-Widget-App unberührt bleibt: Repo importieren, Root Directory `presentations/hit-plenaria`, Framework Preset "Other", kein Build Command. Die Seite trägt `noindex`.

## Inhalt ändern

Alle Texte stehen im Array `S` am Anfang des Skripts in `index.html`. `==Text==` wird als Markierung dargestellt.

# Meta-Prompt: Kurs-PDF zu interaktiver Präsentations-Website

Einsatz: in Claude Code im Projektordner einfügen. Vorher `input/` anlegen und füllen (Abschnitt 2). Für einen anderen Kurs nur die Abschnitte 2 und 6 anpassen.

Was sich gegenüber der Copilot-Fassung geändert hat, steht ganz unten.

## 1. Auftrag

Aus `input/Lavorare-meglio-con-lIA.pdf` (49 Folien, Italienisch) entsteht eine interaktive Website. Sie hat drei Aufgaben, und jede Entscheidung im Bau richtet sich nach ihnen.

1. Sie ersetzt die Folien. Der Trainer präsentiert live am Beamer vor rund 40 Personen, mit Tastatur oder Presenter-Klicker. Was am Beamer aus zehn Metern nicht lesbar ist, ist ein Fehler.
2. Sie ist die Kursunterlage. Jeder Prompt aus dem PDF steht in einem Block mit Kopier-Button und zusätzlich in einer Prompt-Bibliothek. Die Teilnehmenden öffnen sie nach dem Kurs am eigenen Gerät.
3. Sie ist selbst ein Beleg. Das Publikum sieht, was ein gut gestellter Auftrag an eine KI heute hervorbringt. Deshalb zählt eine eigenständige Handschrift mehr als Effekte.

Dieser Prompt ist nach dem Muster gebaut, das der Kurs lehrt: Ziel, Kontext, "fertig wenn", überprüfbar. Er enthält bewusst keine Rollenzeile. Eine Rolle ("du bist Art Director mit 20 Jahren Erfahrung") färbt den Ton, verbessert aber nachweislich nicht die Richtigkeit (Zheng et al., Findings of EMNLP 2024; Basil et al., Wharton Prompting Science Report 4, 2025). Was das Ergebnis verbessert, ist das, was hier steht: wer es nutzt, wozu, woran man es prüft.

Arbeite ohne Rückfragen durch. Halte nur an, wenn eine Bedingung aus Abschnitt 3 nicht erfüllbar ist. Annahmen kommen in den Abschlussbericht.

## 2. Eingaben und Kontext

- `input/Lavorare-meglio-con-lIA.pdf`: die Inhaltsquelle.
- `input/bilder/`: optionale Fotos oder Logos von HIT. Ist der Ordner leer, bleibt die Seite rein typografisch. Keine Bilder generieren, keine aus dem Netz laden.
- Anlass: Plenaria für HIT (Hub Innovazione Trentino), Halbtag mit Pause. Trainer Lorenzo Nesler, AI Automation Coach.
- Publikum: Mitarbeitende eines Innovations-Hubs, die mit Forschenden, Unternehmen und Startups arbeiten. Kein Technikhintergrund nötig. Sie arbeiten mit Gemini im Google-Workspace-Arbeitskonto.
- Roter Faden 1: die KI ist "un collaboratore appena arrivato". Er bekommt im Lauf des Vormittags vier Dinge: un incarico, tempo per pensare, contesto e documenti, lo strumento e un metodo.
- Roter Faden 2: ein einziger echter Fall trägt den ganzen Vormittag. Die Horizon-Ausschreibung wird um 9 Uhr schlecht zusammengefasst und am Ende als Gap-Analyse und Direktionsnotiz geliefert. Vorher und Nachher müssen gestalterisch als derselbe Fall erkennbar sein.
- Sprache der Website: Italienisch, Anrede "voi" wie im PDF.

## 3. Feste Bedingungen

Jede Bedingung nennt ihren Grund. Wo ein Fall nicht geregelt ist, entscheide nach dem Grund.

**Inhalt**

- Der Text des PDF ist die Grundlage und erscheint wörtlich. Der Trainer steht mit seinem Namen für jeden Satz, deshalb wird nichts stillschweigend umformuliert, gekürzt oder ergänzt.
- Inhaltliche Verbesserungen sind erwünscht, laufen aber über eine Änderungsliste (Phase 1). Jede Änderung steht dort mit Folie, altem Text, neuem Text, Grund und Quelle. Ohne Eintrag keine Änderung.
- Erlaubte Änderungsarten: sachliche Korrektur mit Primärquelle, Datumsstempel bei kurzlebigen Fakten, aufdeckbare Lösungen zu Übungen (vorher selbst nachgerechnet), Quellenzeile zu einer Behauptung, Wiederherstellen von Listen und Titeln, die der PDF-Export verwürfelt hat.
- Nicht erlaubt: neue Zahlen ohne Quelle, neue Zitate, Werbesprache, zusätzliche Folien.
- Quellenzeilen und Einschränkungen des PDF bleiben sichtbar an ihrer Stelle.
- Neue Mikrotexte nur für die Bedienung (Copia, Copiato, Mostra soluzione, Indice). Italienisch, "voi", keine Gedankenstriche, keine Superlative.
- Rechtliche Aussagen (AI Act, L. 132/2025, D.Lgs. 179/2026, GDPR) nie verschärfen oder abschwächen. Abweichungen zum Faktencheck kommen in den Bericht, nicht in den Text.

**Präsentation**

- Eine Szene füllt genau einen Bildschirm. Weiter mit Pfeil rechts, Pfeil unten, Leertaste, Bild ab. Zurück mit Pfeil links, Pfeil oben, Bild auf. Das deckt handelsübliche Klicker ab.
- Inhalte bauen sich pro Tastendruck auf, wo der Trainer dazu spricht (Karten, Vergleich, Schlusssatz). Zurückblättern zeigt die vorige Szene vollständig.
- Jede Szene hat einen eigenen Hash, damit ein Neuladen an derselben Stelle landet.
- Tasten: G Index, P alle Prompts, S Lösung der Szene, 1 bis 4 einzelne Fälle aufdecken, T Timer (5, 10, 15 Minuten), F Vollbild, L hell oder dunkel, M Animationen aus, R Lesemodus (alles auf einer Seite, für die Teilnehmenden und fürs Handy).
- Fließtext mindestens 24 px bei 1920×1080, Kontrast mindestens WCAG AA, in hellem und dunklem Thema. Ein Seminarraum mit Tageslicht braucht das helle Thema, ein abgedunkelter das dunkle.
- Geprüft auf 1920×1080 und 1366×768: kein Text läuft über, auch nicht bei geöffneter Lösung.

**Technik**

- Läuft offline per Doppelklick auf eine HTML-Datei. Kein Server, kein CDN, keine Tracker. Im Seminarraum ist das WLAN die häufigste Fehlerquelle.
- Schriften lokal einbetten oder ein Fallback wählen, der ohne Netz gleich gut aussieht.
- Kein Smooth-Scroll und kein Scroll-Pinning. Die Navigation ist diskret (ein Tastendruck, ein Schritt), und Scroll-Bibliotheken kollidieren damit.
- Animationen nur über `transform` und `opacity`. `prefers-reduced-motion` wird respektiert.
- Kopier-Buttons nutzen die Clipboard-API mit Fallback und zeigen eine sichtbare Bestätigung.
- `<meta name="robots" content="noindex">`.

**Marken**

- Keine Produktlogos, weder nachgezeichnet noch generiert noch geladen. Gemini, ChatGPT, Claude und Copilot erscheinen als Text. Vier Marken nebeneinander korrekt zu lizenzieren lohnt nicht, und der Kurs vergleicht sie neutral.
- Fußzeile auf Start- und Schlussszene: Markenhinweis und der Satz, dass die Seite eine unabhängige Schulungsunterlage ist.

## 4. Skills

Liste zuerst alle installierten Skills und Plugins auf. Nutze, was zu Frontend-Design, Animation, Barrierefreiheit, Browser-Tests und italienischem Sprachstil passt, und nenne im Bericht, welche du genutzt hast und wofür. Fehlt ein Design-Skill, baue trotzdem und melde es im Bericht. Erfinde keine Skill-Namen.

## 5. Gestaltung

Ausgangspunkt, keine Vorschrift: Die Seite sieht aus wie die Arbeitsmappe zu einem Auftrag. Das eine wiederkehrende Stilmittel ist die Markierung dessen, was man nachprüfen kann (die "frase della fonte"). Die vier Gaben an den Collaboratore sind eine Fortschrittsanzeige, die sich Kapitel für Kapitel füllt.

Vermeide die typische KI-Optik: Verlaufs-Blobs, Glas-Karten, Emoji als Icons, alles zentriert, überall dieselben runden Karten, Creme mit Serifenschrift, Schwarz mit einer Neonfarbe. Eine Demo-Szene muss auf den ersten Blick als Demo erkennbar sein, weil der Trainer dort die Seite verlässt und live arbeitet.

## 6. Aufbau

| Kapitel | Folien | Inhalt |
|---|---|---|
| Apertura | 1 bis 3 | Titel, das Problem mit Prompt A und B, der Collaboratore |
| L'incarico | 4 bis 7 | Prompt als Auftrag, Prompt C, Meta-Prompt |
| Il ragionamento | 8 bis 11 | Fast oder Thinking, Kalender, Arbeitstage |
| Il contesto | 12 bis 17 | Gedächtnis, Profil-Interview, Gemini-Einstellungen |
| I documenti | 18 bis 22 | RAG, Notebook, Deep Research, Pause |
| Gli strumenti | 23 bis 30 | Modelle, Ranglisten, Vergleich, Werkzeugwahl |
| La verifica | 31 bis 35 | Fehlerarten, Fehlerjagd, vier Prüf-Prompts |
| Il caso completo | 36 bis 40 | Gap-Analyse, Vorher und Nachher, Synthese |
| Le regole | 41 bis 46 | AI Act, italienisches Recht, Abstimmung, Prompt Injection, Policy |
| Prossimi passi | 47 bis 49 | Materialien, eure Fälle |

Pflicht-Interaktionen. Weiteres schlagen die Kapitel-Agenten vor.

- Folie 2: Prompt A und B nebeneinander, danach die Frage ans Publikum, welcher die richtigere Antwort liefert. Die Auflösung kommt auf Folie 5 mit Quellenzeile.
- Folie 3: die vier Gaben erscheinen einzeln und kehren als Fortschrittsanzeige wieder.
- Folien 10, 11, 33: Lösung verdeckt, per Taste S aufdeckbar. Die Lösung vorher selbst nachrechnen (Kalender: genau eine Lösung; Arbeitstage: per Skript zählen; CORTEX2: von CORDIS lesen).
- Folie 35: die drei Prüf-Prompts sind kopierbar und stehen in der Bibliothek.
- Folie 39: Vorher und Nachher als direkter Vergleich.
- Folie 42: Zeitleiste, die am Tag der Präsentation selbst zeigt, was schon gilt und was kommt.
- Folie 44: vier Fälle, die Gruppe stimmt ab, der Trainer deckt einzeln auf. Die Antworten sind Vorschläge und im Bericht als "vom Trainer zu bestätigen" markiert.
- Folie 45: drei Schalter für die Regola del due. Sind alle drei aktiv, erscheint der Satz, dass die letzte Aktion ein Mensch ausführt.
- Demo-Szenen: einblendbarer Timer.

## 7. Ablauf

**Phase 0, du allein.** Skills auflisten. PDF vollständig lesen und nach `content/slides.json` übertragen: pro Folie Nummer, Kapitel, Typ, alle Texte wörtlich, Prompts als eigenes Feld, Quellenzeilen. Der PDF-Export verwürfelt Listen und zweizeilige Titel (Folien 6, 10, 17, 19, 38, 49). Stelle die Reihenfolge anhand der Seitenansicht wieder her und notiere jede Stelle.

**Phase 1, ein Recherche-Agent.** Faktencheck aller kurzlebigen Aussagen gegen Primärquellen: Modellnamen und Daten, Ranglisten, Preise, Datenresidenz, Gemini-Funktionen für Arbeitskonten, Studien, Rechtsdaten, die Ausschreibung und CORTEX2 auf CORDIS. Ergebnis ist `content/aenderungen.md` mit Urteil, Quelle und Abrufdatum pro Aussage. Gib dem Agenten die Aussagen, nicht deine Vermutung, welche falsch sind. Übernimm in die Website nur Korrekturen mit Primärquelle. Alles andere kommt als offene Frage in den Bericht.

**Phase 2, Fundament.** Designsystem als Tokens, Szenen-Steuerung, Bausteine (Prompt-Block, Karten, Lösung, Timer, Abstimmung, Zeitleiste). Baue drei Szenen, die sich stark unterscheiden (eine Karten-Szene, eine Demo mit langem Prompt, die Abstimmung), prüfe sie im Browser in beiden Auflösungen und gib das System erst dann frei.

**Phase 3, Kapitel.** Fünf Agenten parallel, je zwei Kapitel aus der Tabelle. Jeder erhält seine Folien aus `slides.json`, die Änderungsliste, die Tokens, die Bausteine und Abschnitt 3. Jeder ändert nur seine Kapiteldatei und meldet Wünsche an gemeinsamen Bausteinen an dich. Rückgabe: Szenenliste mit Foliennummer, offene Punkte, ein Screenshot pro Szene in 1920×1080.

**Phase 4, Prüfung.** Vier Prüfer parallel, die die Erbauer nicht kennen. Jeder bekommt das Ergebnis und die Quelle, nicht deine Einschätzung.

- Inhalt: vergleicht jede Szene mit `slides.json` und der Änderungsliste. Jeder Unterschied, der nicht in der Liste steht, ist ein Fehler.
- Präsentation: geht alle Szenen per Tastatur durch, in beiden Auflösungen, mit blockiertem Netzwerk. Misst Überläufe per Skript statt nach Augenmaß.
- Sprache: liest alle Mikrotexte und neuen Sätze als italienische Muttersprachlerin. Meldet KI-Floskeln und falsche Anrede.
- Technik: Konsole, Kontrast in beiden Themen, Kopier-Buttons, Hash-Rücksprung, Timer.

Befunde ordnen, nachbessern, die betroffenen Prüfungen wiederholen, bis nichts mehr offen ist.

## 8. Fertig, wenn

- Alle 49 Folien sind als Szenen vorhanden. Der Inhaltsprüfer meldet null Abweichungen außerhalb der Änderungsliste.
- Ein Durchlauf nur mit Pfeiltasten funktioniert offline in beiden Auflösungen ohne Konsolenfehler und ohne Überlauf.
- Jeder Prompt lässt sich mit einem Klick kopieren und steht in der Bibliothek.
- `BERICHT.md` enthält: genutzte Skills, Technik und Lizenzen, die Änderungsliste, Aussagen, die du nicht prüfen konntest, Aussagen mit Verfallsdatum (wann erneut prüfen), Auffälligkeiten im Text, vom Trainer zu bestätigende Lösungen, drei Vorschläge für die nächste Ausbaustufe.

Prüfe vor der Abgabe jedes Kriterium einzeln und schreibe im Bericht pro Kriterium, womit du es geprüft hast.

---

## Was sich gegenüber der Copilot-Fassung geändert hat

- Die Rollenzeile ist weg. An ihrer Stelle stehen Zweck, Publikum und Prüfkriterien. Das ist dieselbe Lehre wie auf Folie 5 und 38 des Kurses.
- Jede Bedingung nennt ihren Grund. Das Modell kann dann Fälle entscheiden, die keine Regel abdeckt, statt Regeln wörtlich zu befolgen.
- "Wörtlich, nichts ändern" wurde zu "wörtlich plus Änderungsliste", weil inhaltliche Verbesserung jetzt Teil des Auftrags ist und trotzdem nachvollziehbar bleiben muss.
- Ein Faktencheck ist eine eigene Phase. Das Deck enthält rund 40 Aussagen, die in Wochen veralten.
- Der unausgefüllte Skill-Platzhalter und der harte Stopp bei fehlendem Skill sind gestrichen. Ein Platzhalter im Prompt führt zu erfundenen Namen.
- Astro, GSAP, Lenis und sieben Seiten sind durch eine offline lauffähige Datei ersetzt. Weniger Abhängigkeiten, und Smooth-Scroll verträgt sich nicht mit Klicker-Navigation.
- Die Microsoft-Icon-Regeln sind durch "keine Logos" ersetzt.
- Prüfer bekommen Material statt Schlussfolgerungen und messen per Skript. Ein Prüfer, dem man die Vermutung mitgibt, bestätigt sie meistens.
- Neu: Sprachprüfung auf Italienisch, helles und dunkles Thema, Lesemodus, Verfallsdaten im Bericht.

# sameiet-bekkefaret-12.github.io

## Halloween

Alle 15 HTML-sider laster `assets/halloween.css` og `assets/halloween.js`.
Temaet vises bare 31. oktober i tidssonen `Europe/Oslo`, hvert år.
Åpne faner oppdateres ved midnatt og når fanen blir synlig igjen.

- Fire langsomme løv, tre små flaggermus og én edderkopp; mobil viser to løv og to flaggermus.
- Et lite gresskar i bunnteksten og en knapp for å stoppe bevegelsene.
- En liten edderkopp med bevegelige bein krysser skjermen rolig av og til, og to svake spindelvev dekorerer motsatte hjørner. Mindre på mobil.
- `prefers-reduced-motion` skjuler all animasjon; gresskaret står stille.
- Ingen lyd, eksterne biblioteker, bilder eller løpende JavaScript-animasjonsløkke.
- Dekorasjonene er skjult for skjermlesere og fanger ikke klikk.

Kjør `node --test halloween.test.cjs` for dato- og atferdstester.
En lokal HTTP-server på localhost/127.0.0.1 kan vise temaet utenom datoen
med `?halloween=preview`. Parameteren har ingen effekt på det publiserte domenet.

Kontrollert lokalt: forside og kontaktside, mobilbredde 390 px, stopp/start,
antall mobile dekorasjoner og ingen nettleserfeil på kontaktsiden.
Dato- og redusert-bevegelse-logikk er testet automatisk, inkludert vintertid.
Publisering skjer via GitHub Pages fra hovedgrenen etter godkjenning.

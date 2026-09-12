# BKG — Enlisted Discord Onboarding Form

Statička web forma (GitHub Pages) + Google Sheets kao baza (preko Apps Script).
Nema servera, nema hostinga, nema mesečnih troškova.

## Kako radi (kratko objašnjenje)

1. Aplikant otvori formu, odgovara na pitanja jedno po jedno.
2. Kad pošalje, forma šalje podatke Google Apps Script-u, koji ih upisuje kao
   novi red u Google Sheet-u i vraća aplikantu jedinstveni kod (npr. `BKG-4F7K2P`).
3. Ti (admin) otvoriš Sheet, pregledaš prijavu, i ručno upišeš `Approved` ili
   `Rejected` u kolonu **Status**.
4. Aplikant se vrati na formu, unese svoj kod u sekciju "Proveri status", i
   ako je odobren — automatski mu se pojavi dugme sa linkom ka Discord
   serveru. Ti ne moraš ništa ručno da mu šalješ.

Ovo je jedini realan način da "automatizuješ" slanje invite linka bez
prikupljanja email adrese i bez Discord bota — status-check stranica radi
posao umesto tebe.

---

## KORAK 1 — Napravi Google Sheet

1. Idi na sheets.google.com → **Blank spreadsheet**.
2. Nazovi ga npr. `BKG Enlisted Applications`.

## KORAK 2 — Zakači Apps Script na Sheet

1. U Sheet-u: **Extensions → Apps Script**.
2. Obriši sav postojeći kod u editoru.
3. Otvori fajl `apps-script/Code.gs` iz ovog paketa, kopiraj **ceo sadržaj**,
   i nalepi ga u Apps Script editor.
4. Klikni disketu (Save), Ctrl+S.

## KORAK 3 — Deploy kao Web App

1. Gore desno: **Deploy → New deployment**.
2. Klikni na zupčanik pored "Select type" → izaberi **Web app**.
3. Podesi:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klikni **Deploy**.
5. Google će tražiti da autorizuješ script (tvoj nalog) — klikni kroz to
   (Advanced → Go to [ime projekta] (unsafe) je normalno za sopstveni script).
6. Kopiraj **Web app URL** koji dobiješ — izgleda ovako:
   `https://script.google.com/macros/s/AKfycb.../exec`

## KORAK 4 — Ubaci URL u formu

1. Otvori `index.html` iz ovog paketa.
2. Pronađi liniju:
   ```
   const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Zameni tekst između navodnika sa URL-om iz Koraka 3.
4. Sačuvaj fajl.

## KORAK 5 — Objavi na GitHub Pages

1. Napravi novi repo na GitHub-u (npr. `bkg-enlisted-onboarding`) pod tvojom
   organizacijom `arhistrategstudio`.
2. Ubaci ceo sadržaj ovog paketa (`index.html` i folder `assets/`) u root
   tog repoa — folder `apps-script/` NE mora da ide na GitHub, to je samo
   za tebe, jer se taj kod ne izvršava u browseru.
3. U repo podešavanjima: **Settings → Pages → Source: main branch, / (root)**.
4. Za par minuta, forma je dostupna na:
   `https://arhistrategstudio.github.io/bkg-enlisted-onboarding/`

## KORAK 6 — Kako odobravaš prijave

1. Otvori Google Sheet.
2. Za svaku novu prijavu, u koloni **Status** upiši tačno `Approved` ili
   `Rejected` (bez navodnika, tačno ta reč, prvo slovo veliko).
3. Gotovo — aplikant će videti promenu čim proveri status na formi.

---

## Šta da uradiš ako menjaš Discord invite link

Otvori `apps-script/Code.gs`, promeni liniju:
```
const DISCORD_INVITE_LINK = "https://discord.gg/bkg";
```
i ponovo deploy-uj (**Deploy → Manage deployments → Edit (olovka) → New version → Deploy**).

Podcastify — web aplikacija za objašnjavanje i gledanje podkasta
Podcastify je SPA (Angular) za gledanje i objašnjavanje podkasta. Korisnici mogu da kreiraju nalog, gledaju i pretražuju podkaste, prilagode profil (profilna + baner), prate druge korisnike i označavaju videe kao omiljene.
Funkcionalnosti
Registracija / prijava (Firebase Auth)
Lista i detalj podkasta (embed video)
Pretraga po naslovu + filteri po kategorijama (uz sortiranje: najnovije/najstarije, A–Z/Z–A, najduže/najkraće)
Omiljeni podkasti
Profil: promena profilne i banera (samo vlasnik)
Praćenje korisnika (follow/unfollow) + broj pratilaca
Paginacija “Učitaj još”
Tehnologije
Angular (standalone komponente, Router, Forms)
Firebase (modularni @angular/fire): Auth, Firestore
Cloudinary (free, unsigned upload) za slike profila/banera (alternativa: Firebase Storage)
HashLocationStrategy (linkovi rade bez server konfiguracije)
Struktura projekta (skraćeno)
src/
  app/
    app.ts | app.config.ts | app.routes.ts
    pages/profile-page/ (profil)
    shared/components/podcast-card/
  core/
    services/{auth,user,podcast,follow,upload-img}
    models/{user,podcast}
  environments/firebase.config.ts
Pokretanje (kratko)
Instaliraj i kloniraj
npm i -g @angular/cli
git clone <repo-url>
cd <folder>
npm i
Podesi konfiguraciju
src/environments/firebase.config.ts – unesi/generiši Firebase ključeve.
Ako koristiš Cloudinary za slike: u ImageUploadService upiši svoj cloudName i uploadPreset.
Start
ng serve -o
(Opcionalno lokalno bez interneta) Emulatori: npx firebase emulators:start --only firestore,auth,storage
Minimalni opis podataka (Firestore)
users/{uid}: username, email, photoURL, bannerURL
podcasts/{id}: title, description, videoUrl, thumbnailUrl, category, duration, uploadDate, uploadedBy
follows/{follower_following}: follower, following, createdAt
Build
ng build
Artefakti su u dist/.
Napomene
Promenu avatara/banera može da radi samo vlasnik profila; klik na tuđ profil vodi na /profile/:id bez mogućnosti izmene, uz opciju praćenja.
Ako koristite Cloudinary, unsigned preset i dozvoljeni formati (jpg,jpeg,png,webp) su dovoljni za frontend upload.
# Piano Interactif avec React, Vite et Tone.js

Ce projet est une application web de piano interactif qui combine la musique et la vision par ordinateur. L'application permet non seulement de jouer du piano avec le clavier de l'ordinateur, mais elle utilise également la webcam pour détecter les émotions de l'utilisateur et suggérer ou jouer automatiquement des accords musicaux correspondants.

## Fonctionnalités

*   **Piano jouable** : Une octave de piano jouable avec la souris ou le clavier (disposition AZERTY).
*   **Sélecteur de sonorité** : Changez le type d'onde du synthétiseur (sinus, carré, etc.).
*   **Détection d'accords** : Affiche le nom de l'accord joué par l'utilisateur.
*   **Détection d'émotions** : Utilise la webcam et `face-api.js` pour détecter l'émotion de l'utilisateur (joyeux, triste, etc.).
*   **Piano émotionnel** :
    *   Suggère un type d'accord (majeur, mineur) en fonction de l'émotion détectée.
    *   Joue automatiquement un accord correspondant à l'émotion.
    *   L'interface s'adapte avec un smiley représentant l'émotion.
*   **Interaction intelligente** : La détection d'émotion se met en pause lorsque l'utilisateur joue du piano pour ne pas interférer.

---

## Organisation du code

Le projet a été structuré en suivant des principes de conception logicielle modernes pour garantir sa maintenabilité et son évolutivité. La séparation des responsabilités est au cœur de l'architecture.

```
/
├── public/
│   └── models/         # Modèles pré-entraînés pour face-api.js
├── src/
│   ├── assets/         # Fichiers statiques (logos, etc.)
│   ├── components/     # Composants React réutilisables
│   │   ├── Controls.tsx
│   │   ├── EmotionDetector.tsx
│   │   ├── EmotionSmiley.tsx
│   │   └── Piano.tsx
│   ├── context/
│   │   └── MusicProvider.tsx # Contexte React pour la gestion de l'état global
│   ├── hooks/
│   │   └── useSynth.ts     # Hook personnalisé pour la logique audio (Tone.js)
│   ├── App.tsx             # Composant racine de l'application
│   ├── main.tsx            # Point d'entrée de l'application
│   └── ...
└── package.json
```

---

## Design Patterns et Principes

L'architecture de ce projet s'appuie sur plusieurs design patterns et principes SOLID pour assurer un code propre et découplé.

### 1. Principe de Responsabilité Unique (SRP)

Chaque partie du code a une seule et unique raison de changer.

*   **Composants de présentation** (`Piano`, `Controls`, `EmotionSmiley`) : Leur seule responsabilité est d'afficher l'interface et de déléguer les interactions utilisateur. Ils sont "bêtes" et ne contiennent pas de logique métier.
*   **Hooks personnalisés** (`useSynth.ts`) : Toute la logique complexe liée à l'audio et à la bibliothèque `Tone.js` est encapsulée dans ce hook. Si nous voulions changer de bibliothèque audio, seul ce fichier serait à modifier.
*   **Contexte React** (`MusicProvider.tsx`) : Il est responsable de la gestion de l'état global et de la logique métier (ex: traduire une émotion en accord).

### 2. Inversion de Dépendances (via le Provider Pattern)

Plutôt que d'avoir un composant `App` qui contrôle tout et passe des dizaines de props à ses enfants (ce qui crée un fort couplage), nous utilisons le **Provider Pattern** avec un Contexte React.

*   `MusicProvider.tsx` agit comme un **conteneur d'injection de dépendances**. Il initialise les hooks, gère l'état et fournit les données et les fonctions nécessaires (`playNote`, `setEmotion`, etc.) à tous les composants enfants qui en ont besoin.
*   Les composants comme `Piano` ou `Controls` ne dépendent plus de `App`, mais d'une abstraction : le contexte `MusicContext`. Ils consomment ce dont ils ont besoin via le hook `useMusic()`. Cela les rend plus autonomes, plus faciles à tester et à réutiliser ailleurs.

### 3. Composition de composants

Le composant `App.tsx` est devenu un simple **composant de composition**. Son rôle est d'assembler les différentes briques de l'application (`EmotionDetector`, `Controls`, `Piano`) sans se soucier de leur fonctionnement interne.

---

## Guide du développeur

Ce guide vous aidera à prendre en main le projet et à le faire évoluer.

### Installation

1.  Clonez le dépôt.
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  **Important** : Ce projet utilise des bibliothèques qui ont été ajoutées au fur et à mesure. Assurez-vous qu'elles sont bien dans votre `package.json` ou installez-les manuellement :
    ```bash
    npm install tone @tonaljs/tonal face-api.js
    ```
4.  **Modèles `face-api.js`** : Téléchargez les modèles depuis le dépôt de face-api.js et placez-les dans le dossier `public/models`.

### Lancement

Pour lancer le serveur de développement :

```bash
npm run dev
```

### Comment faire évoluer le projet ?

Grâce à l'architecture mise en place, ajouter de nouvelles fonctionnalités est simplifié.

*   **Ajouter un effet audio (ex: Reverb)** :
    1.  Modifiez le hook `useSynth.ts` pour y ajouter un effet `Tone.Reverb`.
    2.  Exposez une nouvelle fonction (ex: `setReverbAmount(value)`) depuis le hook.
    3.  Ajoutez l'état et la fonction au `MusicProvider.tsx`.
    4.  Ajoutez un slider pour contrôler la réverbération dans le composant `Controls.tsx`.

*   **Ajouter une nouvelle octave au piano** :
    1.  Modifiez le tableau `NOTES_FR` dans `src/components/Piano.tsx`.
    2.  Vous pouvez rendre ce tableau dynamique et le passer en prop au composant `Piano` pour plus de flexibilité.

*   **Changer les accords associés aux émotions** :
    1.  Modifiez simplement les dictionnaires `EMOTION_TO_CHORD_TYPE` et `EMOTION_TO_CHORD_NOTES` dans `src/context/MusicProvider.tsx`. Toute la logique métier est centralisée à cet endroit.
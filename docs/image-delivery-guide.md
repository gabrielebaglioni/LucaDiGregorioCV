# Guida Cartelle Immagini e Metadati

Questa guida serve per preparare le cartelle immagini e modificare `src/assets.json` in modo semplice, anche per chi non programma.

## Obiettivo

Per ogni opera servono:

- un'immagine per `gallery`
- un'immagine per `index`
- un'immagine per il `detail`
- i metadati essenziali: `title`, `dimensions`, `materials`, `year`, `date`, `description`

Per lo `slider` della home non serve piu un'immagine dedicata dentro ogni opera: si scelgono alcune opere nel blocco `featured`.

La `description` puo essere `null`.

Non servono piu campi come:

- `price`
- `author`
- metadati extra non usati

## Struttura Cartelle Dentro `asset`

```text
asset/
  gallery/
    opera-slug.jpg
    altra-opera-slug.jpg

  index/
    2026/
      01-opera-slug.jpg
      02-altra-opera-slug.jpg
    2025/
      01-opera-slug.jpg
      02-altra-opera-slug.jpg

  detail/
    opera-slug.jpg
    altra-opera-slug.jpg
```

Questa struttura e obbligatoria: dentro `asset` deve esserci una cartella per ogni pagina o visualizzazione.

## Regole Per Le Cartelle

`gallery/`
- contiene immagini orizzontali per la pagina gallery
- una sola immagine per opera da usare nella card gallery

`index/`
- contiene immagini verticali
- le opere sono divise per anno
- dentro ogni anno l'ordine va dalla prima all'ultima usando il prefisso numerico nel nome file, per esempio `01-...`, `02-...`, `03-...`

`detail/`
- contiene l'immagine da visualizzare nella pagina dettaglio
- una per ogni opera
- puo essere la stessa immagine di una delle altre sezioni oppure una versione diversa piu adatta al dettaglio

## Proporzioni E Dimensioni Consigliate

### Gallery

- formato: rettangolo largo
- rapporto consigliato: `16:9`
- dimensione ideale: `2000 x 1125 px`
- minimo consigliato: `1600 x 900 px`
- scegliere immagini con lettura chiara anche in card piu piccole

### Index

- formato: rettangolo alto
- rapporto consigliato: `5:7`
- dimensione ideale: `1500 x 2100 px`
- minimo consigliato: `1200 x 1680 px`
- l'immagine deve funzionare bene come copertina verticale

### Detail

- formato: libero, ma meglio alta qualita
- lato lungo consigliato: almeno `2200 px`
- ideale: tra `2400 px` e `3200 px` sul lato lungo
- usare la versione piu leggibile e fedele dell'opera

## Regole Di Nomenclatura

- usare nomi file semplici e stabili
- preferire solo lettere minuscole, numeri e trattini
- esempio corretto: `panoramic-discovery-1.jpg`
- evitare spazi, parentesi e caratteri speciali

## Regole Metadati

Ogni opera deve avere solo questi dati:

- `id`
- `slug`
- `title`
- `dimensions`
- `materials`
- `year`
- `date`
- `description`
- `galleryOrder`
- `images.gallery`
- `images.index`
- `images.detail`

## Regole Di Visibilita

- tutte le opere si vedono sempre in `index`
- tutte le opere si vedono sempre in `detail`
- in `gallery` si vedono solo le opere che hanno `galleryOrder`
- lo slider home si controlla nel blocco `featured.homeCarouselSlugs`

## Regole Di Ordine

- `galleryOrder` decide l'ordine delle opere nella gallery
- `index` non usa un campo nel JSON: l'ordine e dato dal numero iniziale del file nella cartella anno, per esempio `01-...`, `02-...`, `03-...`

## Esempio Opera

```json
{
  "id": "panoramic-discovery-1",
  "slug": "panoramic-discovery-1",
  "title": "Panoramic Discovery 1",
  "dimensions": "120 x 80 cm",
  "materials": "oil on canvas",
  "year": 2026,
  "date": "2026-01-13",
  "description": null,
  "galleryOrder": 7,
  "images": {
    "gallery": "/asset/gallery/panoramic-discovery-1.jpg",
    "index": "/asset/index/2026/01-panoramic-discovery-1.jpg",
    "detail": "/asset/detail/panoramic-discovery-1.jpg"
  }
}
```

## Esempio Slider Home

```json
{
  "featured": {
    "homeHero": "/asset/pagina copertina entrata (nome, works, info)/zorrotzaurre .jpg",
    "homeCarouselSlugs": [
      "works-paintings-2026-dos-columnas-casa-roja",
      "works-sculptures-2025-2026-el-perro-y-el-castillo",
      "costruzioni-per-mostra"
    ]
  }
}
```

## Checklist Consegna

- ogni opera ha le immagini `gallery`, `index` e `detail`
- `index` e divisa per anno
- in `index` i file hanno prefisso numerico per l'ordine
- `description` e valorizzata oppure `null`
- nessun campo extra come `price` o `author`
- i file hanno nomi coerenti con lo `slug`

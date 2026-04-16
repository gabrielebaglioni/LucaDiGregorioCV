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
- `images.gallery`
- `images.index`
- `images.detail`

## Regole Di Visibilita

- tutte le opere si vedono sempre in `index`
- il `detail` non ha un blocco separato nel JSON
- il `detail` prende dati e immagine dagli oggetti di `gallery` e `index` tramite `detailImage`
- in `gallery` si vedono le opere che hanno una vera immagine in `public/asset/gallery`
- lo slider home si controlla nel blocco `featured.homeCarousel`

## Regole Di Ordine

- `gallery` non usa un campo nel JSON: l'ordine e dato dal nome file nella cartella `gallery`
- `index` non usa un campo nel JSON: l'ordine e dato dal numero iniziale del file nella cartella anno, per esempio `01-...`, `02-...`, `03-...`
- se vuoi controllare bene l'ordine usa sempre prefissi come `01-`, `02-`, `03-`

## Esempio Opera

```json
{
  "slug": "panoramic-discovery-1",
  "title": "Panoramic Discovery 1",
  "dimensions": "120 x 80 cm",
  "materials": "oil on canvas",
  "year": 2026,
  "date": "2026-01-13",
  "description": null,
  "galleryImage": "/asset/gallery/panoramic-discovery-1.jpg",
  "detailImage": "/asset/detail/panoramic-discovery-1.jpg"
}
```

## Nota Sul Detail

- non esiste piu una sezione `detail` separata nel JSON
- quando clicchi un'opera in `gallery`, il detail usa i dati di quell'oggetto
- quando clicchi un'opera in `index`, il detail usa i dati di quell'oggetto
- in entrambi i casi l'immagine del dettaglio e `detailImage`

## Esempio Slider Home

```json
{
  "featured": {
    "homeHero": "/asset/pagina copertina entrata (nome, works, info)/zorrotzaurre .jpg",
    "homeCarousel": [
      "/asset/slider/works-paintings-2026-dos-columnas-casa-roja.jpg",
      "/asset/slider/works-sculptures-2025-2026-el-perro-y-el-castillo.jpeg",
      "/asset/slider/costruzioni-per-mostra.jpeg"
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

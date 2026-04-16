COME AGGIORNARE LE FOTO E I METADATI

1. Metti le immagini nelle cartelle giuste:

- public/asset/gallery
  immagine orizzontale per la gallery

- public/asset/index/ANNO
  immagine verticale per la pagina index

- public/asset/detail
  immagine grande per la pagina detail

2. Apri il file:

- src/assets.json

3. Dentro "items" ogni oggetto rappresenta una sola opera.

Campi principali da modificare:

- title
- dimensions
- materials
- year
- date
- description
- galleryOrder

4. Regole semplici:

- tutte le opere si vedono sempre in index
- tutte le opere si vedono sempre in detail
- in gallery si vedono solo le opere che hanno galleryOrder compilato
- lo slider home si controlla in featured.homeCarouselSlugs usando gli slug delle opere
- la home usa l'immagine gallery dell'opera, oppure detail se gallery manca

5. Per collegare i file immagine usa "images":

- images.gallery
- images.index
- images.detail

6. Esempio:

{
  "title": "Nome opera",
  "dimensions": "120 x 80 cm",
  "materials": "oil on canvas",
  "year": 2026,
  "date": "2026-01-13",
  "description": "Testo descrizione oppure null",
  "galleryOrder": 4,
  "images": {
    "gallery": "/asset/gallery/nome-opera.jpg",
    "index": "/asset/index/2026/02-nome-opera.jpg",
    "detail": "/asset/detail/nome-opera.jpg"
  }
}

7. Esempio slider home:

Nel blocco featured scrivi solo gli slug delle opere da mostrare:

{
  "homeCarouselSlugs": [
    "opera-uno",
    "opera-due",
    "opera-tre"
  ]
}

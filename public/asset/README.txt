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

4. Regole semplici:

- tutte le opere si vedono sempre in index
- il detail non ha un blocco separato nel JSON
- il detail prende i dati dagli oggetti di gallery e index usando detailImage
- in gallery si vedono le opere che hanno una vera immagine in `public/asset/gallery`
- l'ordine in gallery e in index dipende dal nome file nella cartella
- se vuoi controllare l'ordine usa prefissi come `01-`, `02-`, `03-`
- lo slider home resta controllato da `featured.homeCarousel`

5. Per collegare i file immagine usa "images":

- images.gallery
- images.index

oppure, nel JSON attuale:

- galleryImage
- indexImage
- detailImage

6. Esempio:

{
  "title": "Nome opera",
  "dimensions": "120 x 80 cm",
  "materials": "oil on canvas",
  "year": 2026,
  "date": "2026-01-13",
  "description": "Testo descrizione oppure null",
  "images": {
    "gallery": "/asset/gallery/nome-opera.jpg",
    "index": "/asset/index/2026/02-nome-opera.jpg",
    "detail": "/asset/detail/nome-opera.jpg"
  }
}

7. Esempio slider home:

Nel blocco featured scrivi i path delle immagini da mostrare:

{
  "homeCarousel": [
    "/asset/slider/opera-uno.jpg",
    "/asset/slider/opera-due.jpg",
    "/asset/slider/opera-tre.jpg"
  ]
}

import {
  pageCache,
  imageCache,
  staticResourceCache,
  googleFontsCache,
  offlineFallback,
} from 'workbox-recipes';

pageCache();

googleFontsCache();

staticResourceCache();

imageCache();

offlineFallback();

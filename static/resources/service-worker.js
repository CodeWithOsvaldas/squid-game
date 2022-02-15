import {
  pageCache,
  imageCache,
  staticResourceCache,
  googleFontsCache,
  offlineFallback,
} from 'workbox-recipes';
import { registerRoute } from 'workbox-routing';
import * as strategies from 'workbox-strategies';

registerRoute(
  /.*resources\/models\//g,
  new strategies.CacheFirst({ matchOptions: { ignoreVary: true } }),
);

pageCache();

googleFontsCache();

staticResourceCache();

imageCache();

offlineFallback();

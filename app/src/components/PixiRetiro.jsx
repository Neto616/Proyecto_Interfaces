// src/components/PixiRetiro.jsx
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { initCochinito } from '../pixi\\retirarJS/cochinito';
import { initMartillo } from '../pixi\\retirarJS/martillo';

const PixiRetiro = ({ containerRef }) => {
  useEffect(() => {
    const app = new Application();
    let contenedor = null;

    (async () => {
      await app.init({
        width: 500,
        height: 400,
        backgroundColor: 0xffffff,
      });

      if (containerRef?.current) {
        containerRef.current.innerHTML = ''; // Limpia antes de montar
        containerRef.current.appendChild(app.canvas);
      }

      contenedor = await initCochinito(app);
      await initMartillo(app, contenedor);
    })();

    return () => {
      app.destroy(true, { children: true });
    };
  }, [containerRef]);

  return null; // no renderiza nada por sí solo
};

export default PixiRetiro;

// src/components/PixiAbonar.jsx
import { useEffect } from 'react';
import { Application, Container } from 'pixi.js';
import { crearCochinitoInicio, crearCochinitoFinal } from '../pixi/abonarJS/cochinito';
import { crearMoneda } from '../pixi/abonarJS/moneda';
import { crearTextoAbono } from '../pixi/abonarJS/text';
import { crearLucesFinal } from '../pixi/abonarJS/luces';
import coinSound from '../pixi/abonarJS/assets/coin.mp3';
import Swal from 'sweetalert2';

const PixiAbonar = ({ containerRef }) => {
  useEffect(() => {
    const app = new Application();
    let luces = null; 
    let moneda = null;
    let textoAbono = null;
    let cochinito = null;
    let cochinitoFinal = null;

    (async () => {
      await app.init({ width: 500, height: 400, backgroundColor: 0xffffff });

      if (containerRef?.current) {
        containerRef.current.innerHTML = ''; // limpia contenedor
        containerRef.current.appendChild(app.canvas);
      }

      const contenedor = new Container();
      app.stage.addChild(contenedor);

      cochinito = await crearCochinitoInicio(app);
      cochinitoFinal = await crearCochinitoFinal(app);
      moneda = await crearMoneda(app);
      textoAbono = crearTextoAbono();
      luces = await crearLucesFinal();

      luces.x = -115;
      luces.y = -80;

      cochinito.x = 0;
      cochinito.y = 0;
      cochinitoFinal.x = 0;
      cochinitoFinal.y = 0;

      moneda.x = 0;
      moneda.y = -150;

      contenedor.addChild(cochinito);
      contenedor.addChild(cochinitoFinal);
      contenedor.addChild(moneda);
      contenedor.addChild(textoAbono);
      contenedor.addChild(luces);

      contenedor.x = app.screen.width / 2;
      contenedor.y = app.screen.height / 2;

      luces.visible = false;
      cochinitoFinal.visible = false;
      textoAbono.visible = false;

      app.ticker.add(() => {
        if (moneda.visible) {
          moneda.rotation += 0.15;
          moneda.y += 2;

          if (moneda.y >= -43) {
            moneda.visible = false;
            cochinitoFinal.visible = true;
            cochinito.visible = false;
            textoAbono.visible = true;
            luces.visible = true;
            const sonido = new Audio(coinSound);
            sonido.play();
            setTimeout(() => Swal.close(), 1500); // o 1500ms si quieres un poco más de tiempo
          }
        }

        if (luces.visible) {
          luces.tick();
        }
      });
    })();

    return () => {
      app.destroy(true, { children: true });
    };
  }, [containerRef]);

  return null;
};

export default PixiAbonar;

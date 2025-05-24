import { Sprite, Assets, Texture, AnimatedSprite } from 'pixi.js';
import { mostrarCochinitoRoto } from './cochinito.js';
import Swal from 'sweetalert2'; // 🔁 asegúrate de importar esto si no lo tienes
// 📦 Importar imágenes para Webpack
import martillo1 from './assets/martillo1.png';
import martillo2 from './assets/martillo2.png';
import martillo3 from './assets/martillo3.png';
import martillo4 from './assets/martillo4.png';
import martillo5 from './assets/martillo5.png';
import martillo6 from './assets/martillo6.png';
import romperSound from '../retirarJS/assets/romper.mp3';

let martillo = null;
let tiempoPresionado = 0;
let etapaActual = -1;

const DURACION_TOTAL = 1;

// ✅ Usar import directamente en la lista
const rutas = [
  martillo1,
  martillo2,
  martillo3,
  martillo4,
  martillo5,
  martillo6
];

let texturas = [];
let explosionFrames = [];

export async function initMartillo(app, contenedor) {
  let martillo = null;
  let tiempoPresionado = 0;
  let etapaActual = -1;

  const DURACION_TOTAL = 1;

  // Cargar texturas del martillo (solo una vez si ya están cargadas)
  const texturas = await Promise.all(rutas.map(ruta => Assets.load(ruta)));

  // Cargar spritesheet de la explosión (si no se ha cargado antes)
  if (explosionFrames.length === 0) {
    await Assets.load('https://pixijs.com/assets/spritesheet/mc.json');
    for (let i = 0; i < 26; i++) {
      explosionFrames.push(Texture.from(`Explosion_Sequence_A ${i + 1}.png`));
    }
  }

  // Crear el sprite del martillo
  martillo = new Sprite(texturas[0]);
  martillo.anchor.set(0.5);
  martillo.x = -40;
  martillo.y = -80;
  martillo.scale.set(0.4);
  martillo.zIndex = 2;

  contenedor.addChild(martillo);

  app.ticker.add(function tick(time) {
    if (etapaActual >= texturas.length - 1) return;

    tiempoPresionado += time.deltaMS / 1000;
    const progreso = Math.min(tiempoPresionado / DURACION_TOTAL, 1);
    const nuevaEtapa = Math.floor(progreso * texturas.length);

    if (nuevaEtapa !== etapaActual && nuevaEtapa < texturas.length) {
      etapaActual = nuevaEtapa;
      martillo.texture = texturas[etapaActual];

      if (etapaActual === texturas.length - 1) {
        mostrarCochinitoRoto();
        const romperAudio = new Audio(romperSound);
        romperAudio.currentTime = 0;
        romperAudio.play();

        const explosion = new AnimatedSprite(explosionFrames);
        explosion.anchor.set(0.5);
        explosion.x = 0;
        explosion.y = -45;
        explosion.scale.set(0.4);
        explosion.animationSpeed = 0.5;
        explosion.loop = false;
        explosion.onComplete = () => {
          explosion.destroy();
          Swal.close();
        };

        contenedor.addChild(explosion);
        explosion.play();
        martillo.visible = false;
      }
    }
  });
}

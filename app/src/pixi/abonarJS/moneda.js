import { Assets, Sprite } from 'pixi.js';
import monedaImg from '../abonarJS/assets/moneda.png';

export async function crearMoneda() {
  const texture = await Assets.load(monedaImg);
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);         // ✅ Centra el eje de rotación
  sprite.scale.set(0.35);          // Tamaño adecuado
  return sprite;
}

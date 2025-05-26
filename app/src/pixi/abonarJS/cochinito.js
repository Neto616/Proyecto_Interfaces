import { Assets, Sprite } from 'pixi.js';
import cochinitoInicioImg from '../abonarJS/assets/cochinitoInicio.png';
import cochinitoFinalImg from '../abonarJS/assets/cochinitoFinal.png';

export async function crearCochinitoInicio(app) {
  const texture = await Assets.load(cochinitoInicioImg);
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.5, 0.8);
  return sprite;
}

export async function crearCochinitoFinal(app) {
  const texture = await Assets.load(cochinitoFinalImg);
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.5, 0.8);
  return sprite;
}
import { Container, Sprite, Assets } from 'pixi.js';
import { crearTextoRetiro } from './text.js';
import cochinitoInicio from './assets/cochinitoInicio.png';
import cochinitoRoto from './assets/cochinitoRoto.png';



let spriteCochinito = null;
let spriteCochinitoRoto = null;
let textoRetiro = null;

export async function initCochinito(app) {
  const contenedor = new Container();
  contenedor.zIndex = 1;

  // Cargar texturas
  const texturaCochinito = await Assets.load(cochinitoInicio);
  const texturaRoto = await Assets.load(cochinitoRoto);


  // Sprite normal
  spriteCochinito = new Sprite(texturaCochinito);
  spriteCochinito.anchor.set(0.5);
  spriteCochinito.scale.set(0.5, 0.8);

  // Sprite roto
  spriteCochinitoRoto = new Sprite(texturaRoto);
  spriteCochinitoRoto.anchor.set(0.5);
  spriteCochinitoRoto.scale.set(0.5, 0.8);
  spriteCochinitoRoto.visible = false;

  // Texto de retiro
  textoRetiro = crearTextoRetiro();
  textoRetiro.visible = false;

  // Agregar al contenedor
  contenedor.addChild(spriteCochinito);
  contenedor.addChild(spriteCochinitoRoto);
  contenedor.addChild(textoRetiro);

  contenedor.x = app.screen.width / 2;
  contenedor.y = app.screen.height / 2 + 40; // ajusta este valor según tu caso


  app.stage.addChild(contenedor);
  app.stage.sortableChildren = true;



  return contenedor;
}

// Mostrar cochinito roto + mensaje
export function mostrarCochinitoRoto() {
  if (spriteCochinito && spriteCochinitoRoto && textoRetiro) {
    spriteCochinito.visible = false;
    spriteCochinitoRoto.visible = true;
    textoRetiro.visible = true;
  }
}

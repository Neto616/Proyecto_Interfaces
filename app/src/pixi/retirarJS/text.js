import { Text, TextStyle } from 'pixi.js';

export function crearTextoRetiro() {
  const estilo = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 32,
    fill: '#b7315a', 
    stroke: '#000000',
    strokeThickness: 3
  });

  const texto = new Text('¡Retiro exitoso!', estilo);
  texto.anchor.set(0.5);
  texto.x = 0;
  texto.y = -150;
  texto.visible = false;

  return texto;
}

import { Text, TextStyle } from 'pixi.js';

export function crearTextoAbono() {
  const estilo = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 32,
    fill: '#b7315a', // color inicial
    stroke: '#000000',
    strokeThickness: 3
  });

  const texto = new Text('¡Abono realizado!', estilo);
  texto.anchor.set(0.5);
  texto.x = 0;
  texto.y = -120;
  texto.visible = false;

  return texto;
}

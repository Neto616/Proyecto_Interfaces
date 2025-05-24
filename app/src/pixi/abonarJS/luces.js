import { Assets, MeshPlane, Container } from 'pixi.js';
import lucesFinalImg from '../abonarJS/assets/LucesFinal.png';

let timer = 0;
let buffer = null;
let original = null;

export async function crearLucesFinal() {
  const texture = await Assets.load(lucesFinalImg);

  const container = new Container();
  container.zIndex = 80;

  const luz = new MeshPlane({
    texture,
    verticesX: 5,
    verticesY: 2,
  });

  luz.scale.set(0.8);

  container.addChild(luz);

  const { buffer: buf } = luz.geometry.getAttribute('aPosition');
  buffer = buf;
  original = [...buffer.data];

  container.tick = () => {
    for (let j = 0; j < buffer.data.length; j += 2) {
      const yIndex = j + 1;
      buffer.data[yIndex] = original[yIndex] + Math.sin(timer / 4 + j * 0.3) * 6;
    }

    buffer.update();
    timer++;
  };

  return container;
}

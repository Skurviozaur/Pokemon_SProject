const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 840;
canvas.height = 480;
c.imageSmoothingEnabled = false;
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}
class Boundary {
  static width = 12;
  static height = 12;
  constructor({ position, width, height }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
const boundaries = [];
const offset = {
  x: -588,
  y: -730,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const image = new Image();
image.src = "./images/Pokemon_Map2.png";
const playerImage = new Image();
playerImage.src = "./images/playerDown.png";
class Sprite {
  constructor({ position, velocity, image, canvas, frame = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.canvas = canvas;
    this.frame = frame;
    this.image.onload = () => {
      this.width = this.image.width / this.frame.max;
      this.height = this.image.height / this.frame.max;
    };
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frame.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this === background
        ? this.image.width * 4
        : this.image.width / this.frame.max, //,Make the background four times wider
      this === background ? this.image.height * 4 : this.image.height
    );
  }
}
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frame: { max: 4 },
});

const keys = {
  w: {
    pressed: false,
  },

  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },

  d: {
    pressed: false,
  },
};
const testBoundary = new Boundary({
  position: { x: 400, y: 400 },
});
const movables = [background, testBoundary];
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}
function animation() {
  window.requestAnimationFrame(animation);

  background.draw();
  // Draw the testBoundary first
  testBoundary.draw();
  player.draw();
  // Perform the collision check after drawing both testBoundary and player
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: testBoundary,
    })
  ) {
    console.log("dziala");
  }

  if (keys.w.pressed && lastKey === "w") {
    movables.forEach((movable) => {
      movable.position.y += 5;
    });
  } else if (keys.a.pressed && lastKey === "a") {
    movables.forEach((movable) => {
      movable.position.x += 5;
    });
  } else if (keys.s.pressed && lastKey === "s") {
    movables.forEach((movable) => {
      movable.position.y -= 5;
    });
  } else if (keys.d.pressed && lastKey === "d") {
    movables.forEach((movable) => {
      movable.position.x -= 5;
    });
  }
}
animation();
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;

      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
}),
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = false;
        console.log("pressed w");
        break;
      case "a":
        keys.a.pressed = false;
        console.log("pressed w");
        break;
      case "s":
        keys.s.pressed = false;

        console.log("pressed s");
        break;
      case "d":
        keys.d.pressed = false;
        console.log("pressed d");
        break;
    }
    console.log(keys);
  });
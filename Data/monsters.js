const GiantSpiritImage = new Image();
GiantSpiritImage.src = "./images/GiantSpirit.png";
const GiantSpiritDamageImage = new Image();
GiantSpiritDamageImage.src = "./images/GiantSpiritDamage.png";
const buddyImage = new Image();
buddyImage.src = "./images/embySprite.png";
const monsters = {
  buddy: {
    position: {
      x: 200,
      y: 300,
    },
    image: buddyImage,
    frame: {
      max: 4,
      hold: 10, //speed of animation
    },
    animate: true,
    name: "Fire Buddy",
    attacks: [attacks.Tackle, attacks.Fireball],
    isEnemy: false,
  },
  GiantSpirit: {
    position: {
      x: 630,
      y: 95,
    },
    image: GiantSpiritImage,
    frame: {
      max: 5,
      hold: 10, //speed of animation
    },
    animate: true,
    isEnemy: true,
    name: "Giant Spirit",
    attacks: [attacks.EnergyBall, attacks.Smoke],
  },
};

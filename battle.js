const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./images/battleBackground.png";
const battlebackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },

  image: battleBackgroundImage,
});

let GiantSpirit;
let buddy;
let renderedSprite;
let battleAnimationId;
let queue;
function initBattle() {
  document.querySelector("#Interface").style.display = "block";
  document.querySelector("#dialogBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#buddyHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren(); // without this in 2nd battle attack dialog is duplicated
  buddy = new Monster(monsters.buddy);
  GiantSpirit = new Monster(monsters.GiantSpirit);
  renderedSprites = [GiantSpirit, buddy];
  buddy.position.x = 200; // Initial x position
  buddy.position.y = 300; // Initial y position
  GiantSpirit.position.x = 630; // Initial x position
  GiantSpirit.position.y = 95; // Initial y position
  queue = [];

  buddy.attacks.forEach((attacks) => {
    const button = document.createElement("button");
    button.innerHTML = attacks.name;
    document.querySelector("#attacksBox").append(button);
  });
  // listener for buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      buddy.attack({
        attack: selectedAttack,
        recipient: GiantSpirit,
        renderedSprites,
      });
      //enemy attack
      if (GiantSpirit.health <= 0) {
        queue.push(() => {
          GiantSpirit.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animation();
              document.querySelector("#Interface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.Map.play();
            },
          });
        });
      }
      const RandomAttack =
        GiantSpirit.attacks[
          Math.floor(Math.random() * GiantSpirit.attacks.length)
        ];
      queue.push(() => {
        GiantSpirit.attack({
          attack: RandomAttack,
          recipient: buddy,
          renderedSprites,
        });
        if (buddy.health <= 0) {
          queue.push(() => {
            buddy.faint();
            queue.push(() => {
              //fade
              gsap.to("#overlappingDiv", {
                opacity: 1,
                onComplete: () => {
                  cancelAnimationFrame(battleAnimationId);
                  animation();
                  document.querySelector("#Interface").style.display = "none";
                  gsap.to("#overlappingDiv", {
                    opacity: 0,
                  });
                  battle.initiated = false;
                  audio.Map.play();
                },
              });
            });
          });
        }
      });
    });
    button.addEventListener("mouseenter", (e) => {
      const hoveredAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#h1").innerHTML = hoveredAttack.type;
      document.querySelector("#h1").style.color = hoveredAttack.color;
    });
  });
}
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battlebackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}
animation();
// initBattle();
// animateBattle();

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});

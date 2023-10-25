class Sprite {
  constructor({
    position,
    velocity,
    image,
    canvas,
    frame = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    opacity = 0,
  }) {
    this.position = position;
    this.image = image;
    this.canvas = canvas;
    this.frame = { ...frame, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frame.max;
      this.height = this.image.height / this.frame.max;
    };
    this.image.src = this.image.src;
    this.animate = animate;
    this.sprites = sprites;
    this.rotation = rotation;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frame.val * this.width,
      0,
      this.image.width / this.frame.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this === foreground
        ? this.image.width * 4
        : this === background
        ? this.image.width * 4
        : this === GiantSpirit
        ? this.image.width * 0.6
        : this.image.width / this.frame.max, //,Make the background four times wider
      this === foreground
        ? this.image.height * 4
        : this === background
        ? this.image.height * 4
        : this === GiantSpirit
        ? this.image.height * 4
        : this.image.height
    );
    c.restore();
    if (!this.animate) return; //if not moving - true

    if (this.frame.max > 1) {
      this.frame.elapsed++;
    }
    if (this.frame.elapsed % this.frame.hold === 0) {
      //animation speed
      if (this.frame.val < this.frame.max - 1)
        this.frame.val++; //character animation
      else this.frame.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    canvas,
    frame = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    opacity = 0,
    isEnemy = false,
    name,
    attacks,
  }) {
    {
      super({
        position,
        velocity,
        image,
        canvas,
        frame,
        sprites,
        animate,
        rotation,
        opacity,
        isEnemy,
        name,
      });
    }
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }
  faint() {
    document.querySelector("#dialogBox").innerHTML = this.name + " fainted";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.victory.play();
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogBox").style.display = "block";
    document.querySelector("#dialogBox").innerHTML =
      this.name + " used " + attack.name;
    let rotation = 1;
    if (this.isEnemy) rotation = -1.5;
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#buddyHealthBar";
    let movementDistance = 20;
    if (this.isEnemy) movementDistance = -20;
    recipient.health -= attack.damage;
    const initialPosition = {
      x: this.position.x + 40, //+40 in front of firebuddy
      y: this.position.y,
    };
    switch (attack.name) {
      case "Tackle":
        const tl = gsap.timeline();

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              //enemy gets hit
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.1,
                onUpdate: () => {
                  if (recipient.isEnemy) {
                    // Update the image during the animation if needed
                    recipient.image = GiantSpiritDamageImage;
                  }
                },
                onComplete() {
                  if (recipient.isEnemy) {
                    recipient.image = GiantSpiritImage;
                    // Restore the original image
                  }
                },
              });
              gsap.to(recipient, {
                opacity: 0.2,
                repeat: 5,
                yoyo: true,
                duration: 0.1,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case "Fireball":
        const fireballImage = new Image();
        fireballImage.src = "./images/fireball.png";
        audio.initFireball.play();

        if (this.isEnemy) {
          // Adjust the position for enemy's fireball
          initialPosition.x = this.position.x;
          initialPosition.y = this.position.y + 100;
        }
        const fireball = new Sprite({
          position: initialPosition,
          image: fireballImage,
          frame: { max: 4, hold: 10 },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, fireball); //attack between 1 and 2

        gsap.to(fireball.position, {
          x: recipient.position.x + 45,
          y: recipient.position.y + 80,
          onComplete: () => {
            audio.fireballHit.play();

            renderedSprites.splice(1, 1);
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.15,
              onUpdate: () => {
                if (recipient.isEnemy) {
                  // Update the image during the animation if needed
                  recipient.image = GiantSpiritDamageImage;
                }
              },
              onComplete() {
                if (recipient.isEnemy) {
                  recipient.image = GiantSpiritImage;
                }
              },
            });
            gsap.to(recipient, {
              opacity: 0.2,
              repeat: 5,
              yoyo: true,
              duration: 0.1,
            });
          },
        });
        break;

      case "EnergyBall":
        const energyBallImage = new Image();
        energyBallImage.src = "./images/EnergyBall.png";
        audio.initEnergyBall.play();
        if (this.isEnemy) {
          initialPosition.x = this.position.x - 30;
          initialPosition.y = this.position.y + 120;
        }
        const EnergyBall = new Sprite({
          position: initialPosition,
          image: energyBallImage,
          frame: { max: 4, hold: 10 }, // Set the frame for animation
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, EnergyBall); //attack between 1 and 2
        gsap.to(EnergyBall.position, {
          x: recipient.position.x,
          y: recipient.position.y + 50, //where att land
          onComplete: () => {
            audio.EnergyBallHit.play();
            renderedSprites.splice(1, 1);
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.15,
              onUpdate: () => {
                if (recipient.isEnemy) {
                  // Update the image during the animation if needed
                  recipient.image = GiantSpiritDamageImage;
                }
              },
              onComplete() {
                if (recipient.isEnemy) {
                  recipient.image = GiantSpiritImage;
                  // Restore the original image
                }
              },
            });
            gsap.to(recipient, {
              opacity: 0.2,
              repeat: 5,
              yoyo: true,
              duration: 0.1,
            });
          },
        });
        break;
      case "Smoke":
        const SmokeImage = new Image();
        SmokeImage.src = "./images/Smoke.png";
        audio.initSmoke.play();
        if (this.isEnemy) {
          initialPosition.x = this.position.x - 30;
          initialPosition.y = this.position.y + 120; // Attack position
        }
        const Smoke = new Sprite({
          position: initialPosition,
          image: SmokeImage,
          frame: { max: 6, hold: 10 }, // Set the frame for animation
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, Smoke); //attack between 1 and 2
        gsap.to(Smoke.position, {
          x: recipient.position.x, //where enemy attack lands
          y: recipient.position.y + 30,

          onComplete: () => {
            renderedSprites.splice(1, 1);
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.15,

              onUpdate: () => {
                if (recipient.isEnemy) {
                  // Update the image during the animation if needed
                  recipient.image = GiantSpiritDamageImage;
                }
              },
              onComplete() {
                if (recipient.isEnemy) {
                  recipient.image = GiantSpiritImage;
                  // Restore the original image
                }
              },
            });
            gsap.to(recipient, {
              opacity: 0.2,
              repeat: 5,
              yoyo: true,
              duration: 0.1,
            });
          },
        });
        break;
    }
  }
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position, width, height }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = "rgba(255,0,0,0)"; //For invisible boundaries change last parameter - alpha to 0
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

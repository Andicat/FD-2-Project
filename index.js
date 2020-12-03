'use strict';

//======================================FD-2 SCALE-GAME==================================
/*
*/

(function () {

    function renderGameSVG (cnt) {
        var blockGame = document.querySelector('.main');

        const app = new PIXI.Application({
            width: 500, height: 500, antialias: true, transparent: true
        });

        blockGame.appendChild(app.view);
        
        let path = [0,0, 300,0, 500,500, 0,500];
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xe74c3c);
        graphics.drawPolygon(path);
        graphics.endFill();
        app.stage.addChild(graphics);

        const texture = PIXI.Texture.from('img/ball.svg');

        //const container = new PIXI.Container();
        //container.width = 500;
        //container.height = 500;
        //container.backgroundColor = 0x555555;
        
        //app.stage.addChild(container);
        
        const ball = new PIXI.Sprite(texture);
        
        ball.width = 30;
        ball.height = 30;
        ball.x = 250;
        ball.y = 250;
        ball.anchor.set(0.5);
        app.stage.addChild(ball);

        const ball2 = new PIXI.Sprite(texture);
        
        ball2.width = 30;
        ball2.height = 30;
        ball2.x = 350;
        ball2.y = 250;
        ball2.anchor.set(0.5);
        app.stage.addChild(ball2);
        
        // Move container to the center
        /*container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        
        // Center ball sprite in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        
        // Listen for animate update
        app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            //container.rotation -= 0.01 * delta;
        });*/
        b = new Bump(PIXI)

        if (b.Hit(ball,ball2 )) {
            console.log("fff");
          } else {
            //There's no collision
          }

        
        
    }

    renderGameSVG();

})();

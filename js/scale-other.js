/*var recordsTable = [];
recordsTable.push({name:"Andi",score:10,color:this.levelColors[9]});
recordsTable.push({name:"Pasya",score:9,color:this.levelColors[8]});
recordsTable.push({name:"Patrik",score:8,color:this.levelColors[7]});
recordsTable.push({name:"Player",score:7,color:this.levelColors[6]});
recordsTable.push({name:"Porsh",score:6,color:this.levelColors[5]});
recordsTable.push({name:"Tayo",score:5,color:this.levelColors[4]});
recordsTable.push({name:"P-1",score:4,color:this.levelColors[3]});
recordsTable.push({name:"Kate",score:3,color:this.levelColors[2]});
recordsTable.push({name:"Tosh",score:2,color:this.levelColors[1]});
recordsTable.push({name:"Suslik",score:1,color:this.levelColors[0]});*/


for (var i=0; i<pointsNew.length; i++) {
    if (pointsNew[i].x===undefined||pointsNew[i].y===undefined) {
        debugger;
    }
}
//test 
/*var arr1 = [{x: 196, y: 199}
,{x: 196, y: 168}
,{x: 226, y: 168}
,{x: 226, y: 146}
,{x: 249, y: 146}
,{x: 249, y: 139}
,{x: 266, y: 124}
,{x: 266, y: 139}
,{x: 192, y: 276}
,{x: 192, y: 256}
, {x: 177, y: 224}
, {x: 281, y: 124}
, {x: 281, y: 145}
, {x: 254, y: 276}
, {x: 254, y: 237}
, {x: 293, y: 145}
, {x: 293, y: 237}
, {x: 177, y: 208}
, {x: 192, y: 199}
, {x: 192, y: 208}];

var arr2 = [{x: 3, y: 243}
    ,{x: 161, y: 243}
    ,{x: 142, y: 228}
    ,{x: 161, y: 256}
    ,{x: 142, y: 224}
    ,{x: 3, y: 240}
    ,{x: 130, y: 228}
    ,{x: 130, y: 240}];

var horizontal = findHorizontal(arr1,arr2);
var vertical = findVertical(arr1,arr2);
debugger*/

//if (r.right==this.ball.actualRect.right&&r.left==this.ball.actualRect.left) { return false}
                //return(r.left<this.ball.x-this.ball.radius||r.right<this.ball.x+this.ball.radius)
                





        /*
        if (((this.ball.x + this.ball.radius) > minRight)&&this.ball.speedX>0&&(deltaTop<0||deltaTop<deltaRight)&&(deltaBottom<0||deltaBottom<deltaRight)) {
            if ((deltaTop>0)||(deltaBottom>0)) {
                console.log("right!")
            }
            //right
            this.ball.speedX =- this.ball.speedX;
            var delta = (this.ball.x + this.ball.radius) -  minRight;
            this.ball.x = minRight - this.ball.radius;
            this.ball.y = (this.ball.speedY>0)?(this.ball.y - delta):(this.ball.y + delta);
        } else if (((this.ball.x - this.ball.radius) < maxLeft)&&this.ball.speedX<0&&(deltaTop<0||deltaTop<deltaLeft)&&(deltaBottom<0||deltaBottom<deltaLeft)) {
            //left
            if ((deltaTop>0)||(deltaBottom>0)) {
                console.log("left!")
            }
            this.ball.speedX =- this.ball.speedX;
            var delta = maxLeft - (this.ball.x - this.ball.radius);
            this.ball.x = maxLeft + this.ball.radius;
            this.ball.y = (this.ball.speedY>0)?(this.ball.y - delta):(this.ball.y + delta);
        } else if (((this.ball.y + this.ball.radius) > maxBottom)&&this.ball.speedY>0) { 
            //bottom
            var delta = (this.ball.y + this.ball.radius) - maxBottom;
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius,delta,"bottom",this.ball);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = maxBottom - this.ball.radius;
                this.ball.x = (this.ball.speedX>0)?(this.ball.x - delta):(this.ball.x + delta);
            }
        } else if (((this.ball.y - this.ball.radius) < minTop)&&this.ball.speedY<0) {
            //top
            var delta = minTop - (this.ball.y - this.ball.radius);
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius,delta,"top",this.ball);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = minTop + this.ball.radius;
                this.ball.x = (this.ball.speedX>0)?(this.ball.x - delta):(this.ball.x + delta);
            }
        }*/
        
        function findNextRect(rects,posX,posY,radius,deltaX,direction,ball) {
            var rectH = rects.filter(r => {return(r.top<=posY&&r.bottom>=posY)});
            if (rectH.length==0) {
                return;
            }
            var rectW = rectH.filter(r => {return(r.left<=posX-radius+deltaX&&r.right>=posX+radius-deltaX)});
            if (rectW[0]) {
                if ((rectW[0].right-rectW[0].left)<radius*2) {
                   // debugger
                }
            }
            return rectW[0];
        }



            //delete
    /*moveBall2 = function() {

        //console.log("x " + this.ball.x + " y " + this.ball.y + " speedX " + this.ball.speedX + " speedY " + this.ball.speedY + (this.ball.speedY>0?" bottom-":" top-") + (this.ball.speedX>0?"right":"left") + " radius " + this.ball.radius);

        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;   
        this.ball.rotation += 5;      
        var nextRect;

        //доп.проверка
        var bT = this.ball.y - this.ball.radius;
        var bB = this.ball.y + this.ball.radius;
        var rectsHeight = this.field.rects.filter(r => {
                if (r.top>=this.ball.y&&r.top<=bB) {
                    return true
                };
                if (r.top<=this.ball.y&&r.top>=bT) {
                    return true
                };
                if (r.bottom>=this.ball.y&&r.bottom<=bB) {
                    return true
                };
                if (r.bottom<=this.ball.y&&r.bottom>=bT) {
                    return true
                };
                return false;
                //return(r.top<=posY&&r.bottom>=posY)
            });
            if (rectsHeight.length>0) {
                var rectsWidth = rectsHeight.filter(r => {return(r.left>this.ball.x-this.ball.radius||r.right<this.ball.x+this.ball.radius)});
                if (rectsWidth.length>0) {
                    //debugger;
                    //return;
                }
            }

        //проверка области
        if ((this.ball.x + this.ball.radius) > this.ball.actualRect.right) {
            //right
            //console.log("--------------------ON RIGHT");
            this.ball.speedX =- this.ball.speedX;
            var delta = (this.ball.x + this.ball.radius) -  this.ball.actualRect.right;
            this.ball.x = this.ball.actualRect.right - this.ball.radius;
            this.ball.y = (this.ball.speedY>0)?(this.ball.y - delta):(this.ball.y + delta);
        } else if ((this.ball.x - this.ball.radius) < this.ball.actualRect.left) {
            //left
            //console.log("--------------------ON LEFT");
            this.ball.speedX =- this.ball.speedX;
            var delta = this.ball.actualRect.left - (this.ball.x - this.ball.radius);
            this.ball.x = this.ball.actualRect.left + this.ball.radius;
            this.ball.y = (this.ball.speedY>0)?(this.ball.y - delta):(this.ball.y + delta);
        } else if (((this.ball.y + this.ball.radius) > this.ball.actualRect.bottom)&&this.ball.speedY>0) { 
            //bottom
            //console.log("--------------------ON BOTTOM");
            //nextRect = this.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius);
            var delta = (this.ball.y + this.ball.radius) - this.ball.actualRect.bottom;
            //var delta = Math.abs(this.ball.actualRect.bottom - (this.ball.y + this.ball.radius));
            //var deltaX = (this.ball.speedX>0)?delta:-delta;
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius,delta,"bottom",this.ball);
            if (!nextRect) {
                //console.log("-----------------------------------NEXT ISN'T FOUND" + deltaX);
                /*var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.actualRect.bottom - this.ball.radius - this.ball.speedY;
                var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                if (!next2Rect) {
                    //debugger
                    if (this.ball.speedX>0) {
                        //this.ball.x = this.ball.actualRect.right - this.ball.radius;
                    } else {
                        //this.ball.x = this.ball.actualRect.left + this.ball.radius;
                    }
                    this.ball.speedX =- this.ball.speedX;
                }*/
                /*this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.bottom - this.ball.radius;
                this.ball.x = (this.ball.speedX>0)?(this.ball.x - delta):(this.ball.x + delta);
                var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.y + this.ball.speedY;
                //var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY-this.ball.radius,this.ball.radius);
                var next2Rect = findNextRect(this.ball.field.rects,nextX,nextY-this.ball.radius,this.ball.radius,delta + this.ball.speedX,"bottom",this.ball);
                if (!next2Rect) {
                    //debugger
                    //if (this.ball.speedX>0) {
                        //this.ball.x = this.ball.actualRect.right - this.ball.radius;
                    //} else {
                        //this.ball.x = this.ball.actualRect.left + this.ball.radius;
                    //}
                    //this.ball.speedX =- this.ball.speedX;
                }
            } else {
                /*if ((nextRect.bottom - nextRect.top)<this.ball.radius*2) {
                    var nextX = this.ball.x + this.ball.speedX;
                    var nextY = this.ball.actualRect.bottom - this.ball.radius - this.ball.speedY;
                    var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                    if (!next2Rect) {
                        //debugger
                        if (this.ball.speedX>0) {
                            //this.ball.x = this.ball.actualRect.right - this.ball.radius;
                        } else {
                            //this.ball.x = this.ball.actualRect.left + this.ball.radius;
                        }
                        this.ball.speedX =- this.ball.speedX;
                    }
                }*/
                //this.ball.actualRect = (this.ball.y > this.ball.actualRect.bottom)?nextRect:this.ball.actualRect;
               /* this.ball.actualRect = nextRect;
                //this.ball.y = this.ball.actualRect.bottom - this.ball.radius;
            }
        } else if (((this.ball.y - this.ball.radius) < this.ball.actualRect.top)&&this.ball.speedY<0) {
            //top
            //console.log("--------------------ON TOP");
            var delta = this.ball.actualRect.top - (this.ball.y - this.ball.radius);
            //var delta = Math.abs(this.ball.actualRect.top - (this.ball.y - this.ball.radius));
            //var deltaX = (this.ball.speedX>0)?delta:-delta;
            //nextRect = this.findActualRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius);
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius,delta,"top",this.ball);
            if (!nextRect) {
                //console.log("-----------------------------------NEXT ISN'T FOUND" + deltaX);
                /*var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.actualRect.top + this.ball.radius - this.ball.speedY;
                var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                */
               /* this.ball.speedY =- this.ball.speedY;
                this.ball.y = this.ball.actualRect.top + this.ball.radius;
                this.ball.x = (this.ball.speedX>0)?(this.ball.x - delta):(this.ball.x + delta);
                var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.y + this.ball.speedY;
                //var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius);
                var next2Rect = findNextRect(this.ball.field.rects,nextX,nextY+this.ball.radius,this.ball.radius,delta + this.ball.speedX,"bottom",this.ball);
                if (!next2Rect) {
                    //debugger
                    //if (this.ball.speedX>0) {
                        //this.ball.x = this.ball.actualRect.right - this.ball.radius;
                    //} else {
                        //this.ball.x = this.ball.actualRect.left + this.ball.radius;
                    //}
                    //this.ball.speedX =- this.ball.speedX;
                }
            } else {
                /*if ((nextRect.bottom - nextRect.top)<this.ball.radius*2) {
                    var nextX = this.ball.x + this.ball.speedX;
                    var nextY = this.ball.actualRect.bottom - this.ball.radius - this.ball.speedY;
                    var next2Rect = this.findActualRect(this.ball.field.rects,nextX,nextY-this.ball.radius,this.ball.radius);
                    if (!next2Rect) {
                        //debugger
                        if (this.ball.speedX>0) {
                            //this.ball.x = this.ball.actualRect.right - this.ball.radius;
                        } else {
                            //this.ball.x = this.ball.actualRect.left + this.ball.radius;
                        }
                        this.ball.speedX =- this.ball.speedX;
                    }
                }*/
                //this.ball.actualRect = (this.ball.y < this.ball.actualRect.top)?nextRect:this.ball.actualRect;
              /*  this.ball.actualRect = nextRect;
                //this.ball.y = this.ball.actualRect.top + this.ball.radius;
            }
        }
        // проверка коллизии с линиями blade
        if (this.isCutting) {
            var hit = hitSlit(this.ball,this.slit1)||hitSlit(this.ball,this.slit2);
            if (hit) {
                this.finishGame();
                return;
            }
        }
        this.ballCoords.push({x:this.ball.x,y:this.ball.y});
        if (this.ballCoords.length>20) {
            this.ballCoords.shift();
        }

        function findNextRect(rects,posX,posY,radius,deltaX,direction,ball) {
            var rectHeight = rects.filter(r => {return(r.top<=posY&&r.bottom>=posY)});
            if (rectHeight.length==0) {
                return;
            }
            var bT = ball.y - ball.radius;
            var bB = ball.y + ball.radius;
            var rectsHeight = rects.filter(r => {
                    if (r.top>=ball.y&&r.top<=bB) {
                        return true
                    };
                    if (r.top<=ball.y&&r.top>=bT) {
                        return true
                    };
                    if (r.bottom>=ball.y&&r.bottom<=bB) {
                        return true
                    };
                    if (r.bottom<=ball.y&&r.bottom>=bT) {
                        return true
                    };
                    return false;
                    //return(r.top<=posY&&r.bottom>=posY)
                });
                if (rectsHeight.length>0) {
                    var rectsWidth = rectsHeight.filter(r => {return(r.left>ball.x-ball.radius+deltaX||r.right<ball.x+ball.radius-deltaX)});
                    if (rectsWidth.length>0) {
                        //debugger;
                        return;
                    }
                }
            /*var rectBottom = rects[rects.indexOf(rectHeight[0])+1];
            if (rectBottom) {
                if (rectBottom.top<=posY-radius) {
                    //var rectsWidthBottom = rectBottom.filter(r => {return(r.left<=posX-radius&&r.right>=posX+radius)});
                    if (rectBottom.left>posX-radius||rectBottom.right<posX+radius) {
                        //console.log("NOT FIND " + direction + " x " + posX + " y " + posY + " radius " + radius + " delta " + deltaX);
                        console.log(rects);
                        return;
                    }    
                }
                
            }*/
            /*var rectTop = rects[rects.indexOf(rectHeight[0])-1];
            if (rectTop) {
                if (rectTop.top>=posY+radius) {
                    //var rectsWidthTop = rectTop.filter(r => {return(r.left<=posX-radius&&r.right>=posX+radius)});
                    if (rectTop.left>posX-radius||rectTop.right<posX+radius) {
                        //console.log("NOT FIND " + direction + " x " + posX + " y " + posY + " radius " + radius + " delta " + deltaX);
                        console.log(rects);
                        return;
                    }
                }
            }*/
            
            

           /* var rectsWidth = rectHeight.filter(r => {return(r.left<=posX-radius+deltaX*1.5&&r.right>=posX+radius-deltaX*1.5)});
            if (rectsWidth.length==0) {
                //console.log("NOT FIND " + direction + " x " + posX + " y " + posY + " radius " + radius + " delta " + deltaX);
                console.log(rects);
            }
            return rectsWidth[0];
        }

        function hitSlit(elem,slit) {
            var r1x = elem.x - elem.radius;
            var r1y = elem.y - elem.radius;
            var r1w = elem.radius*2;
            var r1h = elem.radius*2;
    
            if (slit.startX === slit.finishX) { // vertical
                var r2w = slit.width;
                var r2h = Math.abs(slit.startY - slit.currY);
                var r2x = slit.startX - slit.width/2;
                var r2y = Math.min(slit.startY,slit.currY);
            }
            if (slit.startY === slit.finishY) { // horizontal
                var r2w = Math.abs(slit.startX - slit.currX);
                var r2h = slit.width;
                var r2x = Math.min(slit.startX,slit.currX)
                var r2y = slit.startY - slit.width/2;;
            }
            if (r1x + r1w >= r2x &&    
                r1x <= r2x + r2w &&    
                r1y + r1h >= r2y &&    
                r1y <= r2y + r2h) {    
                return true;
            }
            return false;
        }
    }*/


        /*var rectsSuitableWidth = rects.filter(r => {return(r.left<=posX-radius&&r.right>=posX+radius)});
        var rectsSuitableHeight = rectsSuitableWidth.filter(r => {return(r.top<=posY&&r.bottom>=posY)});
        if (rectsSuitableHeight.length===0) {
            if (rectsSuitableHeight[0].bottom-rectsSuitableHeight[0].top<radius) {
                debugger;
            }
            //console.log("suitable for width " + rectsSuitableWidth.length);
            //console.log("suitable for height " + rectsSuitableHeight.length);
            //debugger    
        }
        return rectsSuitableHeight[0];*/

        /*var nextRect = rects.filter(r => {return (r.top<=posY&&r.bottom>=posY&&r.left<=posX-radius&&r.right>=posX+radius)})[0];
        //если узкий, проверим дальнейшие
        if (radius!==0&&nextRect) {
            if (nextRect.bottom-nextRect.top<radius) {
                var nextX = this.ball.x + this.ball.speedX;
                var nextY = this.ball.y + this.ball.speedY;
                var nextRect2 = rects.filter(r => {return (r.top<=nextY&&r.bottom>=nextY&&r.left<=nextX-radius&&r.right>=nextX+radius)})[0];
                if (!nextRect2) {
                    debugger
                }
            }
        }
        return nextRect;*/
        
        //return rects.filter(r => {return (r.top<=posY&&r.bottom>=posY&&r.left<=posX-radius&&r.right>=posX+radius)})[0];
    

        function launchFullScreen(element) {
            if(element.requestFullScreen) {
              element.requestFullScreen();
            } else if(element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if(element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
            } else if (elem.webkitEnterFullScreen) {
              //elem.webkitEnterFullScreen();
            }
          }
      
          function cancelFullscreen() {
            if(document.cancelFullScreen) {
              document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
          }

/*
//@media (orientation: portrait) {
    @media (max-aspect-ratio: 2/3) {
        &__container {
            //padding: 5vh 2vw;
        }

        &__progress {
            //margin: 0;
        }

        &__field {
            //width: 90vw;
            //height: 90vw;
            //max-width: 60vh;
            //max-height: 60vh;
        }

        &__button {
            &--start {
                //height: 70vw;
                //width: 70vw;
            }
            &--small {
                //min-height: 25vw;
                //min-width: 25vw;
                //margin: auto 2.5vw;
            }
        }
    }*/







     //********************************************************BALL
     moveBall = function() {
        this.inProgress = false;
        var nextRect;
        var rectsWidth;
        var rectsHeight;
        var shift;
        var delta;
        var limits = {};
        //var angle = false;

        //Test
        //var xxx = this.ball.x;
        //var yyy = this.ball.y;

        //текущие по высоте
        var bT = this.ball.y - this.ball.radius;
        var bB = this.ball.y + this.ball.radius;
        rectsHeight = this.field.rects.filter(r => {
            if (r.top>=this.ball.y&&r.top<=bB) { return true };
            if (r.top<=this.ball.y&&r.top>=bT) { return true };
            if (r.bottom>=this.ball.y&&r.bottom<=bB) { return true };
            if (r.bottom<=this.ball.y&&r.bottom>=bT) { return true };
            if (r.top<=bT&&r.bottom>=bB) { return true };
            return false;
        });
        
        if (rectsHeight.length>0) {
            limits.bottom = rectsHeight.sort((a,b) => {return b.bottom-a.bottom})[0].bottom;
            limits.top = rectsHeight.sort((a,b) => {return a.top-b.top})[0].top;
            rectsWidth = rectsHeight.filter(r => {
                if (r.left>this.ball.x) { return false}
                if (r.right<this.ball.x) { return false}
                return true;
            });
            if (rectsWidth.length>0) {
                limits.left = rectsWidth.sort((a,b) => {return b.left-a.left})[0].left;
                limits.right = rectsWidth.sort((a,b) => {return a.right-b.right})[0].right;
            }
        }

        //console.log("Top " + limits.top + " Bottom " + limits.bottom + " Left " + limits.left + " Right " + limits.right);
        //var nowX = 0+this.ball.x;
        //var nowY = 0+this.ball.y;
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;   
        this.ball.rotation += 5;   

        //проверка областей
        delta = getDelta(this.ball,limits);

        //if (delta.right>0&&delta.right>this.ball.radius/2&&this.ball.speedX>0) {debugger}
        //if (delta.left>0&&delta.left>this.ball.radius/2&&this.ball.speedX<0) {debugger}
        //if (delta.top>0&&delta.top>this.ball.radius/2) {debugger}
        //if (delta.bottom>0&&delta.bottom>this.ball.radius/2) {debugger}

        if (delta.left>0||delta.right>0||delta.top>0||delta.bottom>0) {
            console.log((delta.left>0?" shift left-" + delta.left:"") + (delta.right>0?" shift right-" + delta.right:"") + (delta.top>0?" shift top-" + delta.top:"") + (delta.bottom>0?" shift bottom-" + delta.bottom:""));
        }

        if (delta.left>0&&delta.right>0) {
            //this.ball.x -= this.ball.speedX;
            //this.ball.y -= this.ball.speedY;
            //this.ball.speedX =- this.ball.speedX;
            this.ball.speedY =- this.ball.speedY;
        }

        if (delta.right>0&&this.ball.speedX>0) {
            //right
            shift = (this.ball.x + this.ball.radius) -  limits.right;
            //if (shift<this.ball.radius/2) {
                this.ball.x = limits.right - this.ball.radius;
            //} else {
            //    this.ball.x -= this.ball.speedX;
            //    this.ball.y -= this.ball.speedY;
            //}
            this.ball.speedX =- this.ball.speedX;

            //корректировка после смещения
            delta = getDelta(this.ball,limits);

            if (delta.left>0) {
                console.log("vertical after moves--------------" + (delta.left>0?" shift left-" + delta.left:""));
                this.ball.speedY =- this.ball.speedY;
                this.ball.x = limits.left + this.ball.radius;
            //} else if (delta.top<0&&delta.bottom<0&&shift<this.ball.radius/2) {
            } else if (delta.top<0&&delta.bottom<0) {
                this.ball.y = (this.ball.speedY>0)?(this.ball.y - shift):(this.ball.y + shift);
            }
        }
        
        if (delta.left>0&&this.ball.speedX<0) {
            //left
            shift = limits.left - (this.ball.x - this.ball.radius);
            //if (shift<this.ball.radius/2) {
                this.ball.x = limits.left + this.ball.radius;
            //} else {
            //    this.ball.x -= this.ball.speedX;
            //    this.ball.y -= this.ball.speedY;
            //}
            this.ball.speedX =- this.ball.speedX;
            
            
            //корректировка после смещения
            delta = getDelta(this.ball,limits);

            if (delta.right>0) {
                console.log("vertical after moves--------------" + (delta.right>0?" shift right-" + delta.right:""));
                this.ball.speedY =- this.ball.speedY;
                this.ball.x = limits.right - this.ball.radius;
            //} else if (delta.top<0&&delta.bottom<0&&shift<this.ball.radius/2) {
            } else if (delta.top<0&&delta.bottom<0) {
                this.ball.y = (this.ball.speedY>0)?(this.ball.y - shift):(this.ball.y + shift);
            }
        } 

        if (delta.bottom>0) { 
            //bottom
            shift = (this.ball.y + this.ball.radius) - limits.bottom;
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y+this.ball.radius,this.ball.radius,shift,"bottom",this.ball);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = limits.bottom - this.ball.radius;
                if (delta.left<0&&delta.right<0) {
                    this.ball.x = (this.ball.speedX>0)?(this.ball.x - shift):(this.ball.x + shift);
                }
            }
        }
        if (delta.top>0) {
            //top
            shift = limits.top - (this.ball.y - this.ball.radius);
            nextRect = findNextRect(this.ball.field.rects,this.ball.x,this.ball.y-this.ball.radius,this.ball.radius,shift,"top",this.ball);
            if (!nextRect) {
                this.ball.speedY =- this.ball.speedY;
                this.ball.y = limits.top + this.ball.radius;
                if (delta.left<0&&delta.right<0) {
                    this.ball.x = (this.ball.speedX>0)?(this.ball.x - shift):(this.ball.x + shift);
                }
            }
        }

       /* var xxx2 = this.ball.x;
        var yyy2 = this.ball.y;

        if (Math.abs(xxx2-xxx)>this.ball.radius/2) {
            debugger;
        }
        if (Math.abs(yyy2-yyy)>this.ball.radius/2) {
            debugger;
        }*/

        
        // проверка коллизии с линиями blade
        if (this.isCutting) {
            var hit = hitSlit(this.ball,this.slit1)||hitSlit(this.ball,this.slit2);
            if (hit) {
                this.finishGame();
                return;
            }
        }
        
        this.inProgress = true;

        function getDelta(ball,limits) {
            var d = {};
            d.right = ((ball.x + ball.radius) - limits.right).toFixed(2);
            d.left = (limits.left - (ball.x - ball.radius)).toFixed(2);
            d.bottom = ((ball.y + ball.radius) - limits.bottom).toFixed(2);
            d.top = (limits.top - (ball.y - ball.radius)).toFixed(2);
            return d;
        }

        function findNextRect(rects,posX,posY,radius,deltaX,direction,ball) {
            var rectH = rects.filter(r => {return(r.top<=posY&&r.bottom>=posY)});
            if (rectH.length==0) {
                return;
            }
            var rectW = rectH.filter(r => {return(r.left<=posX-radius+deltaX&&r.right>=posX+radius-deltaX)});
            return rectW[0];
        }

        function hitSlit(elem,slit) {
            var r1x = elem.x - elem.radius;
            var r1y = elem.y - elem.radius;
            var r1w = elem.radius*2;
            var r1h = elem.radius*2;
    
            if (slit.startX === slit.finishX) { // vertical
                var r2w = slit.width;
                var r2h = Math.abs(slit.startY - slit.currY);
                var r2x = slit.startX - slit.width/2;
                var r2y = Math.min(slit.startY,slit.currY);
            }
            if (slit.startY === slit.finishY) { // horizontal
                var r2w = Math.abs(slit.startX - slit.currX);
                var r2h = slit.width;
                var r2x = Math.min(slit.startX,slit.currX)
                var r2y = slit.startY - slit.width/2;;
            }
            if (r1x + r1w >= r2x &&    
                r1x <= r2x + r2w &&    
                r1y + r1h >= r2y &&    
                r1y <= r2y + r2h) {    
                return true;
            }
            return false;
        }
    }

    this.pointsStart = [
        {x: 333, y: 223}
        ,{x: 366, y: 223}
        ,{x: 237, y: 238}
        ,{x: 211, y: 326}
        ,{x: 258, y: 326}
        ,{x: 258, y: 288}
        ,{x: 130, y: 307}
        ,{x: 186, y: 307}
        ,{x: 130, y: 282}
        ,{x: 200, y: 238}
        ,{x: 200, y: 282}
        ,{x: 237, y: 141}
        ,{x: 366, y: 245}
        ,{x: 326, y: 288}
        ,{x: 326, y: 245}
        ,{x: 186, y: 373}
        ,{x: 211, y: 373}
        ,{x: 333, y: 203}
        ,{x: 292, y: 141}
        ,{x: 292, y: 203}];




        if (delta.left>0||delta.right>0||delta.top>0||delta.bottom>0) {
            console.log((delta.left>0?" shift left-" + delta.left:"") + (delta.right>0?" shift right-" + delta.right:"") + (delta.top>0?" shift top-" + delta.top:"") + (delta.bottom>0?" shift bottom-" + delta.bottom:""));
        }



        //debugger
                //recordsTable[0].score = 25;
                //recordsTable.splice(10, 1);
                //recordsTable.splice(5, 1);
                //recordsTable.splice(2, 1);
                
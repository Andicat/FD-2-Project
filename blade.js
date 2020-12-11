class Slit {

    constructor(startX,startY,finishX,finishY,speed) {
        this.startX = startX;
        this.startY = startY;
        this.finishX = finishX;
        this.finishY = finishY;
        this.currX = startX;
        this.currY = startY;
        this.direction;
        this.speedX;
        this.speedY;
        if (startX!==finishX) {
            this.direction = "X";
            this.speedY = 0;
            this.speedX = Math.sign(finishX - startX)*4;
        }
        if (startY!==finishY) {
            this.direction = "Y";
            this.speedX = 0;
            this.speedY = Math.sign(finishY - startY)*4;
        }
    };

    move = function() {
        if (this.direction==="X") {
            var lenghtX = Math.abs(this.startX - this.finishX);
            var currLenghtX = Math.abs(this.startX - this.currX);
            if (currLenghtX<=lenghtX) {
                this.currX += this.speedX;
            } else {
                this.currX = this.finishX;
                this.direction = null;
            }
            return true;
        }
        if (this.direction==="Y") {
            var lenghtY = Math.abs(this.startY - this.finishY);
            var currLenghtY = Math.abs(this.startY - this.currY);
            if (currLenghtY<=lenghtY) {
                this.currY += this.speedY;
            }
            else {
                this.currY = this.finishY;
                this.direction = null;
            }
            return true;
        }
        return false;
    };
};
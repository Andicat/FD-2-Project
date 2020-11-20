'use strict';

(function () {

    try {
        var blockPuzzle = document.querySelector('.puzzle');
        var btnPuzzleCreate = blockPuzzle.querySelector('.puzzle__create');
        var cntPuzzle = blockPuzzle.querySelector('.puzzle__container');
    } catch {
        return;
    }

    var timer;
    const puzzle_SIZE = window.matchMedia("(max-width: 768px)").matches?300:500;
    const SIZES = {
        rows: 10,
        cols: 10,
    };
    
    function renderPuzzle (cnt) {

        cnt.style.width = puzzle_SIZE + "px";
        cnt.style.height = puzzle_SIZE + "px";

        var colorLeftTop = {
            red: 100,
            green: 60,
            blue: 60,
        };
        var colorRightTop = {
            red: 200,
            green: 200,
            blue: 70,
        };
        var colorLeftBottom = {
            red: 40,
            green: 170,
            blue: 160,
        };
        var colorRightBottom = {
            red: 240,
            green: 40,
            blue: 90,
        };

        /*console.log("left top " + colorLeftTop.red);
        console.log("right top " + colorRightTop.red);
        console.log("left bottom " + colorLeftBottom.red);
        console.log("right bottom " + colorRightBottom.red);
        console.log("left top-bottom " + (colorLeftTop.red - colorLeftBottom.red));*/

        var shiftRedLeft = (colorLeftBottom.red - colorLeftTop.red)/(SIZES.rows-1);
        var shiftRedRight = (colorRightBottom.red - colorRightTop.red)/(SIZES.rows-1);
        var shiftGreenLeft = (colorLeftBottom.green - colorLeftTop.green)/(SIZES.rows-1);
        var shiftGreenRight = (colorRightBottom.green - colorRightTop.green)/(SIZES.rows-1);
        var shiftBlueLeft = (colorLeftBottom.blue - colorLeftTop.blue)/(SIZES.rows-1);
        var shiftBlueRight = (colorRightBottom.blue - colorRightTop.blue)/(SIZES.rows-1);

        for (var r = 0; r < SIZES.rows; r++) {
            //red values
            var redStart = colorLeftTop.red + r*shiftRedLeft;
            var redEnd = colorRightTop.red + r*shiftRedRight;
            var redShift = (redEnd - redStart)/(SIZES.cols-1);
            //green values
            var greenStart = colorLeftTop.green + r*shiftGreenLeft;
            var greenEnd = colorRightTop.green + r*shiftGreenRight;
            var greenShift = (greenEnd - greenStart)/(SIZES.cols-1);
            //red values
            var blueStart = colorLeftTop.blue + r*shiftBlueLeft;
            var blueEnd = colorRightTop.blue + r*shiftBlueRight;
            var blueShift = (blueEnd - blueStart)/(SIZES.cols-1);
            
            var puzzleRow = document.createElement("div");
            puzzleRow.classList.add("puzzle__row");
            //puzzleRow.style.width = puzzle_SIZE + "px";
            //puzzleRow.style.height = puzzle_SIZE/SIZES.rows + "px";
            cnt.appendChild(puzzleRow);

            for (var c = 0; c < SIZES.cols; c++) {
                var red = redStart + c*redShift;
                var green = greenStart + c*greenShift;
                var blue = blueStart + c*blueShift;
                //create puzzle ceil
                var puzzleCeil = document.createElement("div");
                puzzleCeil.classList.add("puzzle__ceil");
                puzzleCeil.style.width = puzzle_SIZE/SIZES.cols + "px";
                puzzleCeil.style.height = puzzle_SIZE/SIZES.rows + "px";
                puzzleCeil.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
                puzzleRow.appendChild(puzzleCeil);
            }
        }
        /*for (var i = 0; i < SIZES.cols; i++) {
            var red = colorLeftBottom.red + i*(colorRightBottom.red - colorLeftBottom.red)/SIZES.cols;
            var green = colorLeftBottom.green + i*(colorRightBottom.green - colorLeftBottom.green)/SIZES.cols;
            var blue = colorLeftBottom.blue + i*(colorRightBottom.blue - colorLeftBottom.blue)/SIZES.cols;
            //create puzzle ceil
            var puzzle = document.createElement("div");
            puzzle.classList.add("puzzle__ceil");
            puzzle.style.width = puzzle_SIZE/SIZES.cols + "px";
            puzzle.style.height = puzzle_SIZE/SIZES.cols + "px";
            puzzle.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
            cnt.appendChild(puzzle);
        }*/
    }

    blockPuzzle.addEventListener('click', function() {
        clearInterval(timer);
        cntPuzzle.innerHTML = "";
        renderPuzzle(cntPuzzle);
    });

})();

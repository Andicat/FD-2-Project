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
            red: 180,
            green: 60,
            blue: 60,
        };
        var colorRightTop = {
            red: 230,
            green: 200,
            blue: 70,
        };
        var colorLeftBottom = {
            red: 30,
            green: 170,
            blue: 160,
        };
        var colorRightBottom = {
            red: 50,
            green: 40,
            blue: 90,
        };

        console.log("left top " + colorLeftTop.red);
        console.log("right top " + colorRightTop.red);
        console.log("left bottom " + colorLeftBottom.red);
        console.log("right bottom " + colorRightBottom.red);
        console.log("left top-bottom " + (colorLeftTop.red - colorLeftBottom.red));

        for (var j = 0; j < SIZES.rows; j++) {
            //  debugger;
            for (var i = 0; i < SIZES.cols; i++) {
                console.log("row " + j + " col " + i);
                var red = colorLeftTop.red + i*(colorRightTop.red - colorLeftTop.red)/SIZES.rows + j*(colorRightBottom.red - colorLeftBottom.red)/SIZES.cols;
                var green = colorLeftTop.green + i*(colorRightTop.green - colorLeftTop.green)/SIZES.rows + j*(colorRightBottom.green - colorLeftBottom.green)/SIZES.cols;
                var blue = colorLeftTop.blue + i*(colorRightTop.blue - colorLeftTop.blue)/SIZES.rows + j*(colorRightBottom.blue - colorLeftBottom.blue)/SIZES.cols;
                //create puzzle ceil
                console.log("red " + red);
                var puzzle = document.createElement("div");
                puzzle.classList.add("puzzle__ceil");
                puzzle.style.width = puzzle_SIZE/SIZES.rows + "px";
                puzzle.style.height = puzzle_SIZE/SIZES.rows + "px";
                puzzle.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
                cnt.appendChild(puzzle);
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

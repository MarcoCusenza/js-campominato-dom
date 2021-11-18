//*****PROGRAMMA*****
const grid = document.getElementById("grid");
let difficulty = 0; // 0=EASY 1=MEDIUM 2=HARD 3=CRAZY
let numBox = 49; //numero totale di box
let boxPerRow = 7; //numero di box per riga
let numBombs = 10; //numero totale di bombe
let buone = numBox - numBombs; //numero di caselle da scoprire
let perso = false;

const easy = document.querySelector(".easyBtn");
const medium = document.querySelector(".mediumBtn");
const hard = document.querySelector(".hardBtn");
const crazy = document.querySelector(".crazyBtn");

//Inizializzazione griglia modalità easy
changeDifficulty(0);


//Check cambio difficoltà --> nuova partita
easy.addEventListener('click', function () { changeDifficulty(0) });
medium.addEventListener('click', function () { changeDifficulty(1) });
hard.addEventListener('click', function () { changeDifficulty(2) });
crazy.addEventListener('click', function () { changeDifficulty(3) });

//*****FINE PROGRAMMA*****





//_____FUNZIONI_____

// +++ FUNZIONI GENERALI +++
//calcolo della posizione dei box in un sistema a matrice
function positionCalc(row, col) {
    return ((row * boxPerRow) + col)
}

//funzione destroy
function destroy(element) {
    element.innerHTML = '';
}
// +++ FINE FUNZIONI GENERALI +++



// +++ FUNZIONI SPECIFICHE +++
//Setup gioco
function setup(grid, numBombs) {
    destroy(document.getElementById("result"));
    destroy(grid); //svuota la griglia
    fillGrid(); //riempi la griglia
    bombsGenerator(numBombs); //genera e inserisci le bombe
    fillBox(); //riempi i box
}

//AAAAA REFACTORING CON SWITCH
//Cambio difficoltà (--> nuova partita)
function changeDifficulty(lvl) {
    if (lvl == 0) {//***livello facile
        numBox = 49;
        boxPerRow = 7;
        numBombs = 10;
        buone = numBox - numBombs;
        grid.className = "easyGrid";
        setup(grid, numBombs);

    } else if (lvl == 1) {//***livello medio
        numBox = 121;
        boxPerRow = 11;
        numBombs = 25;
        buone = numBox - numBombs;
        grid.className = "mediumGrid";
        setup(grid, numBombs);
    } else if (lvl == 2) {//***livello difficile
        numBox = 225;
        boxPerRow = 15;
        numBombs = 50;
        buone = numBox - numBombs;
        grid.className = "hardGrid";
        setup(grid, numBombs);
    } else {//***livello crazy
        numBox = 625;
        boxPerRow = 25;
        numBombs = 100;
        buone = numBox - numBombs;
        grid.className = "crazyGrid";
        setup(grid, numBombs);
    }
}

//Riempimento griglia con box + eventListener per il click sui box
function fillGrid() {
    for (let i = 0; i < boxPerRow; i++) {
        for (let j = 0; j < boxPerRow; j++) {
            const box = document.createElement('div');
            const overlay = document.createElement('overlay');
            box.className = `box box-${positionCalc(i, j)}`;
            overlay.className = `overlay overlay-${positionCalc(i, j)}`;
            grid.appendChild(box);
            box.appendChild(overlay);
            box.addEventListener('click', function () {//box cliccabili
                if (perso == false) {
                    console.log(this);
                    this.querySelector("overlay").remove();
                    if (this.classList.contains("bomb")) {
                        perso = true;
                        endGame();
                    } else if (buone > 1) {
                        buone--;
                    } else {
                        endGame();
                    }
                }
            });
        }
    }
}

//Generazione e inserimento bombe
function bombsGenerator(numBombs) {
    const arrayBox = document.getElementsByClassName('box');
    const array = [];
    for (let i = 0; i < numBombs; i++) {
        let token = Math.floor(Math.random() * (arrayBox.length - 1));
        if (array.includes(token)) {//controllo se l'array contiene già il numero
            i--;
        } else {
            array[i] = token;
        }
    }

    for (let j = 0; j < numBombs; j++) {
        arrayBox[array[j]].classList.add("bomb");//prendo i box che hanno indice array[j]
    }
}

//Riempimento di ogni box con il numero di bombe circostanti
function fillBox() {
    const arrayBox = document.getElementsByClassName('box');
    for (let i = 0; i < arrayBox.length; i++) {
        let row = parseInt(i / boxPerRow);
        let col = i % boxPerRow;
        // console.log("row =", row, "col =", col);
        if (arrayBox[i].classList.contains("bomb")) {
            arrayBox[i].innerHTML += '<i class="fas fa-bomb"></i>';
        } else {
            arrayBox[i].innerHTML += numBombsAround(row, col, arrayBox);
        }
    }
}

//calcolo di quante bombe ci sono intorno al box[row, col]
function numBombsAround(row, col, arrayBox) {
    let count = 0;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let a = (row - 1) + x;
            let b = (col - 1) + y;
            if (a >= 0 && a < boxPerRow && b >= 0 && b < boxPerRow) {
                if (arrayBox[positionCalc(a, b)].classList.contains("bomb")) {
                    count++;
                }
            }
        }
    }
    return count;
}

//concludere la partita
function endGame() {
    result = document.getElementById("result");
    if (buone == 1) {
        result.innerHTML = "Hai vinto! :D"
    } else {
        result.innerHTML = "Hai perso :("
    }
    result.classList.remove("hidden");
}


// +++ FINE FUNZIONI SPECIFICHE +++

//_____FINE FUNZIONI_____
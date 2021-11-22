//*****PROGRAMMA*****
const grid = document.getElementById("grid");
let difficulty = 0; // 0=EASY 1=MEDIUM 2=HARD 3=CRAZY
let numBox = 49; //numero totale di box
let boxPerRow = 7; //numero di box per riga
let numBombs = 10; //numero totale di bombe
let buone = numBox - numBombs; //numero di caselle da scoprire
let perso = false;

const boxMancanti = document.getElementById("buone");



const easy = document.querySelector(".easyBtn");
const medium = document.querySelector(".mediumBtn");
const hard = document.querySelector(".hardBtn");
const crazy = document.querySelector(".crazyBtn");

//Inizializzazione griglia modalità easy
changeDifficulty(2);


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

//dato l'elemento trova la sua riga (quadrati row = col)
function getRow(element) {
    return (parseInt(element / boxPerRow))
}

//dato l'elemento trova la sua colonna (quadrati row = col)
function getCol(element) {
    return (element % boxPerRow)
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
    perso = false;
    boxMancanti.innerHTML = `Box left: ${boxLeft()}`;//refresh box left
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
        numBombs = 40;
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
            const number = document.createElement('number');
            const flag = document.createElement('flag');
            flag.innerHTML = `<i class="fas fa-flag"></i>`;
            box.className = `box ${positionCalc(i, j)}`;
            number.className = `number ${positionCalc(i, j)} hidden`;
            flag.className = `flag ${positionCalc(i, j)} hidden`;
            box.appendChild(flag);
            box.appendChild(number);
            grid.appendChild(box);
            box.addEventListener('click', function () {//box cliccabili
                if (perso == false) {
                    console.log(this);
                    this.querySelector("number").classList.remove("hidden");
                    if (this.classList.contains("bomb")) {
                        perso = true;
                        endGame();
                    } else if (buone > 1) {
                        if (this.classList.contains("clicked") == false) {
                            buone--;
                            boxMancanti.innerHTML = `Box left: ${buone}`;//refresh box left
                        }
                        console.log("controlla", this.querySelector("number").innerHTML)
                        if (this.querySelector("number").innerHTML == '0') {
                            showAround(i, j);
                            buone = boxLeft();
                            boxMancanti.innerHTML = `Box left: ${boxLeft()}`;//refresh box left
                        }
                        console.log(buone);
                    } else if (!(this.classList.contains("clicked"))) {
                        endGame();
                    }
                    this.classList.add("clicked");
                }
            });
            box.addEventListener('contextmenu', function (ev) {//tasto destro bandierina
                ev.preventDefault();
                if (isFlagged(flag) == false && this.querySelector("number").classList.contains("hidden")) {
                    putFlag(flag);
                } else {
                    removeFlag(flag);
                }
                return false;
            }, false);
        }
    }
}

//aggiungi bandierina
function putFlag(flag) {
    flag.classList.remove("hidden");
    console.log(flag);
}

//rimuovi bandierina
function removeFlag(flag) {
    flag.classList.add("hidden");
    console.log(flag);
}

//verifica se c'è la bandierina
function isFlagged(el) {
    if (el.classList.contains("hidden")) {
        return false;
    }
    return true;
}

//Riempimento di ogni box con il numero di bombe circostanti
function fillBox() {
    const arrayBox = document.getElementsByClassName('box');
    const arrayNumbers = document.getElementsByClassName('number');
    for (let i = 0; i < arrayBox.length; i++) {
        let row = getRow(i) - 1;
        let col = getCol(i) - 1;
        if (arrayBox[i].classList.contains("bomb")) {
            arrayNumbers[i].innerHTML = '<i class="fas fa-bomb"></i>';
        } else {
            arrayNumbers[i].innerHTML = numBombsAround(row, col, arrayBox);

            switch (numBombsAround(row, col, arrayBox)) {
                case 0:
                    arrayNumbers[i].classList.add("zero");
                    break;
                case 1:
                    arrayNumbers[i].classList.add("one");
                    break;
                case 2:
                    arrayNumbers[i].classList.add("two");
                    break;
                case 3:
                    arrayNumbers[i].classList.add("three");
                    break;
                case 4:
                    arrayNumbers[i].classList.add("four");
                    break;
                case 5:
                    arrayNumbers[i].classList.add("five");
                    break;
                case 6:
                    arrayNumbers[i].classList.add("six");
                    break;
                case 7:
                    arrayNumbers[i].classList.add("seven");
                    break;
                case 8:
                    arrayNumbers[i].classList.add("eight");
                    break;
            }
        }
    }
}

//calcolo di quante bombe ci sono intorno al box[row, col]
function numBombsAround(row, col, arrayBox) {
    let count = 0;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let a = row + x;
            let b = col + y;
            if (a >= 0 && a < boxPerRow && b >= 0 && b < boxPerRow) {
                if (arrayBox[positionCalc(a, b)].classList.contains("bomb")) {
                    count++;
                }
            }
        }
    }
    return count;
}

//showAround
function showAround(row, col) {
    const arrayBox = document.getElementsByClassName('box');
    const arrayNumbers = document.getElementsByClassName('number');
    arrayBox[positionCalc(row, col)].classList.add("check");
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            let a = row + x;
            let b = col + y;
            let box = arrayBox[positionCalc(a, b)];
            if (a >= 0 && a < boxPerRow && b >= 0 && b < boxPerRow) {
                arrayNumbers[positionCalc(a, b)].classList.remove("hidden");
                arrayBox[positionCalc(a, b)].classList.add("clicked");
                console.log(arrayNumbers[positionCalc(a, b)]);
                if (arrayNumbers[positionCalc(a, b)].innerHTML == "0" && !(box.classList.contains("check"))) {
                    showAround(a, b);
                }
            }
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

//contare quante caselle non scoperte sono rimaste (dopo funzione ricorsiva)
function boxLeft() {
    const arrayBox = document.getElementsByClassName('box');
    let count = 0;
    for (let i = 0; i < arrayBox.length; i++) {
        if (arrayBox[i].classList.contains("clicked")) {
            count++;
            console.log("count =", count);
        }
    }
    let tot = arrayBox.length - numBombs - count;
    console.log("tot =", tot);
    return (tot);
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
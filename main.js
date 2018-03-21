$(document).ready(function() {
  $("#symb").click();
});

//
//global variables
var symbol;
var aiSymbol;
var winningSymbol;
//default difficulty of easy
var difficulty = "easy";
var turn = 0;
var usedIndexs = [];
var truthy = false;

//user vs ai
var userIndexValues = [];
var aiIndexValues = [];

//x 
var xIndexValues = [];
var xTotalCurrentWins = 0;

//o
var oIndexValues = [];
var oTotalCurrentWins = 0;

//possible win combinations
var wins = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7],
]

//functions
function addIcon(cell) {
  difficultySelection();
  turn++;
  //if nothing in the cell
  if (cell.innerHTML !== "X" && cell.innerHTML !== "O") {      
    //place current symbol
    cell.innerHTML = symbol;   
  } 
  //val is the index of the box (1-9, top left to bottom right)
  var val = $(cell).data('value');
  //if current symbol is X

  //make sure val can only be added once to list of total boxes filled
  if (!usedIndexs.includes(val)) {
    if (symbol == "X") {
        //populate array with current val
        usedIndexs.push(val);
        xIndexValues.push(val);
        userIndexValues.push(val);
    }
    if (symbol == "O") { 
        usedIndexs.push(val);
        oIndexValues.push(val);
        userIndexValues.push(val);
    }   
  }
  
  if (winCondition()) {
    console.log("user win");
  } else {
     if (difficulty === "hard") {
       aiMakeGreatChoice();
     } else if (difficulty === "medium") {
       aiMakeGoodChoice();
     } else if (difficulty === "easy") {
      aiChooseRandomSpot();
    }
  }
} //end addIcon

//win condition
function winCondition() {
  //for each winning possibility
  for (var i = 0; i < wins.length; i++) {
    //keep track of number in each win condition
    var xCount = 0;
    var oCount = 0;
    //join numbers into a string 
    var numbers = wins[i].join("");

    //for each number in X or O arrays, only check if at least 3 values
    if (xIndexValues.length > 2) {
      for (var j = 0; j < xIndexValues.length; j++) {
        if (numbers.indexOf(xIndexValues[j]) > -1) {
          xCount++;
        }
      }
    }   
    if (oIndexValues.length > 2) {
      for (var t = 0; t < oIndexValues.length; t++) {
        if (numbers.indexOf(oIndexValues[t]) > -1) {
          oCount++;
        }
      }
    }
    
    if (xCount >= 3) {   
      xTotalCurrentWins++;
      //keep track of winning symbol
      winningSymbol = "X";
      //update score and block further gameplay
      updateScore();
      preventGameplay();      
      return true;
    } else if (oCount >= 3) {
      //update total wins and keep track of winning symbol
      oTotalCurrentWins++;
      winningSymbol = "O";
      //update score and block further gameplay
      updateScore();
      preventGameplay();
      return true;
    //if neither symbol wins, declare a draw
    }  else if (usedIndexs.length == 9 && (xCount < 3 && oCount <3)) {
      $(".gameWinner").text("Draw!");
      $("#scoreText").text("X -- "+xTotalCurrentWins+" : "+oTotalCurrentWins+" -- O");
      preventGameplay();
    }
  }
  return false;  
}

//new game button 
function newGame() {
  //reset game board
  $(".gameboard div").empty();
  //clear previous game winner
  $(".gameWinner").empty();
  //reset global variables
  xIndexValues = [];
  oIndexValues = [];
  usedIndexs = [];
  userIndexValues = [];
  aiIndexValues = [];
  symbol = "";
  turn = 0;
  userCount = 0;
  aiCount = 0;
  truthy = false; 
  //reset modal and properties
  $("#modal-text").css("font-weight","normal");
  $("#modal-text").text("Choose your symbol");
  $("#input-field").css("background-color","white");
  //make boxes clickable again
  preventGameplay();
  resetClickProperty();   
  //prompt to choose symbol again 
  $("#symb").click();
}

//scoreboard 
function updateScore() {
  //score below gameboard
  $("#scoreText").text("X -- "+xTotalCurrentWins+" : "+oTotalCurrentWins+" -- O");
  //winner text above gameboard
  $(".gameWinner").text(winningSymbol + " is the winner!");
}

//select symbol
function selectSymbol() {
  $(".modal").css("display","block");
}

//close functionality for x button in modal
function closeModal() {
  $(".modal").css("display","none");
}

//when submit button is clicked in modal
function inputStuff() {
  //make sure input is upper case
  symbol = $("#input-field").val().toUpperCase();
  //if symbol not an X or O
  if (symbol != "X" && symbol != "O") {
    //change background of input to indicate bad input
    $("#input-field").css("background-color","pink");
    //change text of modal to indicate correct options
    $("#modal-text").css("font-weight","bold");
    $("#modal-text").text("Please select X or O");
  //if no problems close modal
  } else {    
    $(".modal").css("display", "none");
  }
}

//prevent any further gameplay if someone wins
function preventGameplay() {
  $(".gameboard div").each(function() {
    $(this).prop("onclick","null").off("click");
  });
}



//adds click functionality back to gameboard
function resetClickProperty() { 
  $(".gameboard div").each(function() {
    $(this).on("click", function() {
      addIcon(this);
    });
  });
}


//difficulty options
function difficultySelection() {
  var choice = $('input[name=difficulty]:checked').val();
  if (choice === "hard") {
    difficulty = "hard";
  } else if (choice === "medium") {
    difficulty = "medium";
  } else {
    difficulty = "easy";
  }
}
//give ai symbol that isnt being used
function aiChooseSymbol() {
  if (symbol === "X") {
    aiSymbol = "O";
  } else {
    aiSymbol = "X";
  }
}

//randomly selecting spot on board to choose
function aiChooseRandomSpot() {
  //choose symbol
  aiChooseSymbol();
  //get random int between 1 and 9
  var rando = getRandomInt(9);
  //if that index hasnt been used yet
  if (!usedIndexs.includes(rando)) {
    //add aiSymbol to cell randomly chosen
    $("div[data-value="+rando.toString()+"]").text(aiSymbol);
    //add to usedIndexs and aiIndexs
    aiIndexValues.push(rando);
    usedIndexs.push(rando);
    //add to proper array for tracking
    if (aiSymbol === "O") {
      oIndexValues.push(rando);
    } else {
      xIndexValues.push(rando);
    }
  //if random cell was already chosen, just call function again until an open cell is selected
  } else if (turn < 6) {
    aiChooseRandomSpot();
  } 
  if (winCondition()) {
      console.log("ai wins");
    }
}

//make a smart choice 45% of time and random choice 55%
function aiMakeGoodChoice() {
  var probability = Math.random();
  //45%
  if (probability < 0.45) {
    aiMakeGreatChoice();
  //otherwise make a random move
  } else {
    aiChooseRandomSpot();
  }
}

//always make best choice to prevent win for user
function aiMakeGreatChoice() {
  aiChooseSymbol();
  //always try to place into center cell on 1st turn
  if (turn === 1) {
    if (!usedIndexs.includes(5) && !userIndexValues.includes(5)) {
      $("div[data-value=5]").text(aiSymbol);
      aiIndexValues.push(5);
      usedIndexs.push(5);
      if (aiSymbol === "O") {
        oIndexValues.push(5);
      } else {
        xIndexValues.push(5);
      }
    //if user chose middle cell
    } else {
      aiChooseRandomSpot();
    }
  //anything past 1st turn
  } else if (turn > 1 && turn < 6) {
    truthy = false;
    //go through all winning possibilities first
    if (truthy === false) {
      cellToWin(1,2,3);
    }
    if (truthy === false) {
      cellToWin(1,3,2);
    }
    if (truthy === false) {
      cellToWin(3,2,1);
    }
    if (truthy === false) {
      cellToWin(1,4,7);
    }
    if (truthy === false) {
      cellToWin(1,7,4);
    }
    if (truthy === false) {
      cellToWin(1,5,9);
    }
    if (truthy === false) {
      cellToWin(1,9,5);
    }
    if (truthy === false) {
      cellToWin(2,5,8);
    }
    if (truthy === false) {
      cellToWin(2,8,5);
    }
    if (truthy === false) {
      cellToWin(3,6,9);
    }
    if (truthy === false) {
      cellToWin(3,9,6);
    }
    if (truthy === false) {
      cellToWin(3,5,7);
    }
    if (truthy === false) {
      cellToWin(3,7,5);
    }
    if (truthy === false) {
      cellToWin(4,5,6);
    }
    if (truthy === false) {
      cellToWin(4,6,5);
    }
    if (truthy === false) {
      cellToWin(5,6,4);
    }
    if (truthy === false) {
      cellToWin(7,8,9);
    }
    if (truthy === false) {
      cellToWin(7,9,8);
    }
    if (truthy === false) {
      cellToWin(8,9,7);
    }
    //then look to block if no winning moves    
    if (truthy === false) {
      cellToBlock(1,2,3);
    }
    if (truthy === false) {
      cellToBlock(1,3,2);
    }
    if (truthy === false) {
      cellToBlock(3,2,1);
    }
    if (truthy === false) {
      cellToBlock(1,4,7);
    }
    if (truthy === false) {
      cellToBlock(1,7,4);
    }
    if (truthy === false) {
      cellToBlock(1,5,9);
    }
    if (truthy === false) {
      cellToBlock(1,9,5);
    }
    if (truthy === false) {
      cellToBlock(2,5,8);
    }
    if (truthy === false) {
      cellToBlock(2,8,5);
    }
    if (truthy === false) {
      cellToBlock(3,6,9);
    }
    if (truthy === false) {
      cellToBlock(3,9,6);
    }
    if (truthy === false) {
      cellToBlock(3,5,7);
    }
    if (truthy === false) {
      cellToBlock(3,7,5);
    }
    if (truthy === false) {
      cellToBlock(4,5,6);
    }
    if (truthy === false) {
      cellToBlock(4,6,5);
    }
    if (truthy === false) {
      cellToBlock(5,6,4);
    }
    if (truthy === false) {
      cellToBlock(7,8,9);
    }
    if (truthy === false) {
      cellToBlock(7,9,8);
    }
    if (truthy === false) {
      cellToBlock(8,9,7);
    }    

    //if the random spot chosen was already used, call it again to get something different
    if (aiIndexValues.length < turn && usedIndexs.length != 9) {
      aiChooseRandomSpot();
    }
    if (winCondition()) {
      console.log("ai wins");
    }
  } else {
    //console.log("this means its past turn 5 which is impossible");
  }
  
}

//based on cell1 and cell2 locations, block cell to prevent win by user
function cellToBlock(cell1, cell2, cellBlock) {
  //if user has 2 cells lined up where a third can win the game
  //and index has not been used by AI or user  
  if ((userIndexValues.includes(cell1) && userIndexValues.includes(cell2)) &&
      !usedIndexs.includes(cellBlock) && !aiIndexValues.includes(cellBlock)) {
    //set that cell to aiSymbol
    $("div[data-value="+cellBlock.toString()+"]").text(aiSymbol);
    //push to proper arrays for tracking
    usedIndexs.push(cellBlock);
    aiIndexValues.push(cellBlock);
    addToProperArray(aiSymbol, cellBlock);
    //this is used to prevent this function from being called several times in 1 turn
    truthy = true;
  }
}
//ai to look for winning move
function cellToWin(cell1, cell2, winningCell) { 
  if ((aiIndexValues.includes(cell1) && aiIndexValues.includes(cell2)) &&
      !usedIndexs.includes(winningCell) && !userIndexValues.includes(winningCell)) {
    $("div[data-value="+winningCell.toString()+"]").text(aiSymbol);
    //push to arrays for tracking
    usedIndexs.push(winningCell);
    aiIndexValues.push(winningCell);
    addToProperArray(aiSymbol, winningCell);
    //this is used to prevent this function from being called several times in 1 turn
    truthy = true;
  }
}
      
//add symbol to the right array for tracking
function addToProperArray(symbol, value) {
  if (symbol === "X") {
    xIndexValues.push(value);
  } else {
    oIndexValues.push(value);
  }
}
//function to get a random integer between 1 and max
function getRandomInt(max) {
  return (Math.floor(Math.random() * Math.floor(max))) + 1;
}


//create countdown function
// global variables 
let timeSec = 10;
let timeH =$('#time');
let mathProblem = $('ul'); 
let countDown;

// global timer function 
function Timer(fn,t){
    // create object to set interval
    var timerObj = setInterval(fn, t);
    // create function that starts timer
    this.start = function(){
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    }
  // create function that stop timer
    this.stop = function () {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }
 // create function that reset timer
    this.reset = function (newT=t) {
        t = newT;
        timeSec = 10;
        return this.stop().start();
    }
}

// define function to display time
function displayTime(second) {    
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    
    timeH.html(`
    ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}
    `);
}

// define function to end count 
function endCount() {
    timeH = $('#time')  
}

// get the game popup window
let gamePopup = document.getElementById("gameWindow");

// get the button that opens the game popup window
let gameBtn = document.getElementById("gameStartButton");

// get the <span> element that close the popup window
let span = document.getElementsByClassName("close")[0];

// the function that opens the window when the user click the button
gameBtn.onclick = function(){
    gamePopup.style.display = "block";

    // create new timer when click button
    app.timer = new Timer(() => {        
        // call function to dispay time and pass parameter
        displayTime(timeSec);
        displayTask();
        //subtruct 1 from timeSec
        timeSec--;       
    }, 1000);
}

// the function that closes the window when the user click close the window
span.onclick = function () {
    gamePopup.style.display = "none";
    // reset the page when user close the popup window
    window.location.reload();     
}

// When the user clicks anywhere outside of the popup window, close it
window.onclick = function (event) {
    if (event.target == gamePopup) {           
        gamePopup.style.display = "none";
        // reset the page when user close the popup window
        window.location.reload();
    }
}

//display multiplication task of two random numbers
// declare a namespace of the object
const app = {};

app.randomResult;//holds result when multiply two random numbers in app.randomNumbers
app.userAnswer;//hold user's input
app.score = 0;//add one score if user's answer is correct in app.checkUserAnswer
app.timer;

// create function that gives two random numbers 
app.randomNumbers = function(){    
    // create two random numbers and save them
        let num1 = (Math.floor(Math.random() * 10) + 1);
        let num2 = (Math.floor(Math.random() * 10) + 1);
        
        // display two random numbers 
        mathProblem.html(`<li> ${num1} * ${num2} = ?</li>`);
        // save result of multiplication of two random numbers
        app.randomResult = num1 * num2;    
}

// add event listener that takes user's input by pressing "enter" key
app.addEventListener = function() {
    let userAnswer = document.getElementById("userInput");
    // listen the event if user hit the "enter" key
    userAnswer.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            // call function that saves user's input
            app.getUserAnswer();                       
        }
    })
}

//add event listener that calls function when user clicks button 
app.getUserAnswer = function(){
    // return user's input and save in variable
    let userAnswerVal = document.getElementById("userInput").value;
    // convert user's input from string to number
    app.userAnswer = parseInt(userAnswerVal);
    // call checkUserAnswer to check user's input
    let userAnswerValid = app.checkUserAnswer(); 

    // if user send a correct answer reset the timer and display new task
    //if user has wrong answer keep try until it's correct or time is over
    if (userAnswerValid){
        app.timer.reset();
        displayTask(true);   
    }   
    // reset input field after submition data
    document.getElementById("userInput").value = '';
}

// define function that checks user's input and result of multiplication of two random numbers
app.checkUserAnswer = () =>{ 
    // if user's input is equal app.randomResult   
    if(app.userAnswer === app.randomResult){
        // add score if user's answer is correct
        app.score++;
        return true
    }else{
        return false
    }
}

// define function that loops task
// define counter to count how many times task was displayed
let counter = 0;

function displayTask(userHasAnswerd=false) {
    // if user did not submit answer, but time is over then reset the timer and new task   
    if (timeSec == 0 || timeSec < 1) {      
        timeSec = 10;
        app.randomNumbers();
        counter++;
        if(counter === 10){
            counter = 0;
            app.timer.stop();
            endCount(); 
            clearInterval(countDown); 
            showResult();
        }             
    } else if (userHasAnswerd) {// if user submitted answer, then reset the timer and new task 
        app.timer.reset();
        app.randomNumbers(); 
        counter++;
        timeSec = 10;

        if(counter===10){
            counter = 0;
            app.timer.stop();
            endCount();
            clearInterval(countDown);
            showResult();
        }     
    }
}

// define a method which will initialize the app once the document is ready
app.init = function () {
    let form = document.getElementById("mainForm"); 
    form.addEventListener('submit', (event)=>{
        event.preventDefault();
    });   
    app.randomNumbers();
    app.addEventListener();     
}


// check whether the documetn is ready
$(() => {
    //call the initialization method
    app.init();
})

// define function that shows result of user's score 
function showResult() {
    if (app.score == 10) {
        $('.math-box').html(`<div class="result-box1"><p> Your score is <strong>${app.score}</strong> of <strong>10</strong>!!!<br>Great job</p>
        <img src="./assets/best.svg" alt="Best Result"></div>`);
    } else if (app.score >= 7) {
        $('.math-box').html(`<div class="result-box2"><p> Your score is <strong>${app.score}</strong> of <strong>10</strong>.<br>Nice, keep it up!</p>
         <img src="./assets/thumbs-up.svg" alt="Good Job"></div>`);
    } else if (app.score >= 4) {
        $('.math-box').html(`<div class="result-box3"><p> Your score is <strong>${app.score}</strong> of <strong>10</strong>.<br>Good, but practice more!</p>
         <img src="./assets/read.svg" alt="Study More"></div>`);
    } else {
        $('.math-box').html(`<div class="result-box4"><p> Your score is <strong>${app.score}</strong> of <strong>10</strong>.<br>Don't give up, you can do it!</p>
         <img src="./assets/reading.svg" alt="Don't give up"></div>`);
    }
    $('.input-box').html(`<button id="playmore-btn" class="playmoreBtn" onclick="app.playMore()">Play more</button>`);
}

// create function that displays/overwrite .popup-container element to start game if user click the Play More button
app.playMore = function() {
   
    $('.math-box').html(`
    <div id="timer" class="timer-box"><h2 id="time">00:00</h2></div>
    <div id="multiplicationTask" class="task-box">
        <ul class="task"></ul>
    </div> 
    </div>`);

    // console.log($('.math-box'))    
    $('.input-box').html(`    
    <form id='mainForm'>
        <label for="userInput" class="sr-only"></label>
        <input type="text" id="userInput"  placeholder="Your answer" class="userAnswer" onkeydown=""> 
        <button id="answBtn"  class="answerBtn" onclick="app.getUserAnswer()">Submit</button>
    </form>`);

    // need to initialize again due to rewtiring .mail-box and .input-box
    app.score = 0;
    timeH = $('#time')
    mathProblem = $('ul');
    // call event.preventDefault function one more time due to overwritten form element
    form = document.getElementById("mainForm");
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });

    app.timer.reset();
    app.randomNumbers();

}
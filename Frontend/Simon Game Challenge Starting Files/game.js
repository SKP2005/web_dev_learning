var gamePattern=[];
var userClickedPattern=[];
var flag=0;
var level=0;
var buttonColours=["red","blue","green","yellow"];

function nextSequence(){
    $("h1").text("Level "+level);
    level++;
    userClickedPattern=[];

    var randomNumber=Math.floor(Math.random()*4);
    var randomChosenColor=buttonColours[randomNumber];
    gamePattern.push(randomChosenColor);
    $("#"+randomChosenColor).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

$(".btn").click(function(event){
    // alert("hello");
    // console.log(event.target.id);
    var userChosenColor=this.id;
    userClickedPattern.push(userChosenColor);
    // console.log(userClickedPattern);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length);
});

function playSound(name){
    var audio=new Audio("./sounds/"+name+".mp3");
    audio.play();
}
function animatePress(currentColor){
    $("."+currentColor).addClass("pressed");
    setTimeout(function(){
        $("."+currentColor).removeClass("pressed");
    },100);
}  

$(document).keypress(function(){
    if(!flag){
        nextSequence();
        flag=1;
    }
});

function checkAnswer(currentLevel){
    if(userClickedPattern[currentLevel-1]==gamePattern[currentLevel-1]){
        if(currentLevel==gamePattern.length){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200);
        startOver();
    }
}

function startOver(){
    gamePattern=[];
    userClickedPattern=[];
    flag=0;
    level=0;
    $("h1").text("Game Over Press A key to Start");

}
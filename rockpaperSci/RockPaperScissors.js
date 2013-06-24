//var userChoice = prompt("Do you choose rock, paper,scissors,lizard or spock?");

function choose(userChoice){
var computerChoice = Math.random();
if (computerChoice < 0.2) {
	computerChoice = "rock";
} else if(computerChoice <= 0.4) {
	computerChoice = "paper";
} else if(computerChoice <=0.6){
	computerChoice = "scissors";
}
else if(computerChoice <=0.8){
	computerChoice = "spock";
}
else{
	computerChoice = "lizard";
}

document.getElementById('usr').innerHTML = "You Chose " + userChoice;
  
	document.getElementById('compPlayer').innerHTML = "The Computer Chose " + computerChoice;
  
   
var result;

function compare(choice1, choice2){
        /***tie****/
    if (choice1 == choice2){
       result = "The result is a tie!";
        return result;
    }
    /***rock****/
	
    if (choice1 == "rock"){
        
        if (choice2 == "scissors"){
		result = "rock breaks scissors";
        return result;
		}
		
        else if(choice2 == "paper"){
		result = "paper covers rock";
		 return result;
		}
		
		else if(choice2 == "spock"){
		result = "Spock vaporizes rock";
		 return result;
		}
		
		else if(choice2 == "lizard"){
		result = "Rock crushes lizard";
		 return result;
		}
		
    };
	
	
        /***paper****/
    if (choice1 == "paper"){
        
        if (choice2 == "scissors"){
        result = "scissors cuts paper";
		 return result;
        
    }
        else if(choice2 == "rock"){
		result = "paper covers rock";
		 return result;
		}
		
		else if(choice2 == "spock"){
		result = "Paper disproves Spock";
		 return result;
		}
		
		else if(choice2 == "lizard"){
		result = "Lizard eats paper";
		 return result;
		}
		
    }
    
	
	/**Scissors***/
    if (choice1 == "scissors"){
        
        if (choice2 == "rock"){
        result = "rock breaks scissors";
		 return result;
        
    }
        else if (choice2 == "paper"){
		result = "scissors beats paper";
		 return result;
		}
		
		else if (choice2 == "spock"){
		result = "Spock smashes scissors";
		 return result;
		}
		
		else if (choice2 == "lizard"){
		result = "Scissors decapitate lizard";
		 return result;
		}
		
    }
    
	/**Spock***/
    if (choice1 == "spock"){
        
        if (choice2 == "rock"){
        result = "Spock vaporizes rock";
		 return result;
        
    }
        else if (choice2 == "paper"){
		result = "Paper disproves Spock";
		 return result;
		}
		
		else if (choice2 == "scissors"){
		result = "Spock smashes scissors";
		 return result;
		}
		
		else if (choice2 == "lizard"){
		result = "Lizard poisons Spock";
		 return result;
		}
		
    }
	
	
	/**Lizard***/
    if (choice1 == "lizard"){
        
        if (choice2 == "rock"){
        result = "Rock crushes lizard";
		 return result;
        
    }
        else if (choice2 == "paper"){
		result = "Lizard eats paper";
		 return result;
		}
		
		else if (choice2 == "scissors"){
		result = "Scissors decapitate lizard";
		 return result;
		}
		
		else if (choice2 == "spock"){
		result = "Lizard poisons Spock";
		 return result;
		}
		
    }
	 document.getElementById('result').innerHTML = result;
}

compare(userChoice,computerChoice);
document.getElementById('result').innerHTML = result;
}




/* ============================================ */
/* JAVASCRIPT LEARNING FILE */
/* Learning: JavaScript makes web pages interactive */
/* Write your code here as you learn! */
/* ============================================ */

/* ============================================ */
/* LEARNING NOTES - Reference Guide */
/* ============================================ */

/* 
   VARIABLES:
   let - can be changed (modern way)
   const - cannot be changed (constant)
   var - old way (avoid using)
   
   Example:
   let xp = 0;
   const button1 = document.querySelector('#button1');
*/

/* 
   FUNCTIONS:
   function functionName() {
       // code here
   }
   
   Example:
   function goStore() {
       console.log("Going to store");
   }
*/

/* 
   GETTING HTML ELEMENTS:
   document.querySelector('#id') - Get element by ID
   document.getElementById('id') - Another way to get by ID
   document.querySelector('.class') - Get element by class
   
   Example:
   const button1 = document.querySelector('#button1');
*/

/* 
   CHANGING HTML CONTENT:
   element.textContent = "new text" - Change text
   element.innerHTML = "<p>HTML</p>" - Change HTML
   element.innerText = "text" - Change text (similar to textContent)
   
   Example:
   xpText.textContent = xp;
*/

/* 
   EVENT LISTENERS:
   element.onclick = function() { } - When clicked
   element.addEventListener('click', function() { }) - Modern way
   
   Example:
   button1.onclick = goStore;
*/

/* 
   ARRAYS:
   let items = ["item1", "item2", "item3"];
   items[0] - Get first item
   items.push("new") - Add item
   
   Example:
   let inventory = ["stick"];
*/

/* 
   OBJECTS:
   let weapon = { name: "sword", power: 10 };
   weapon.name - Get property
   weapon.power - Get property
   
   Example:
   const weapons = [
       { name: 'stick', power: 5 },
       { name: 'sword', power: 20 }
   ];
*/

/* 
   CONSOLE:
   console.log("message") - Print to browser console (F12 to see)
   console.log(variable) - Print variable value
   
   Example:
   console.log("Hello World");
*/

/* ============================================ */
/* YOUR CODE GOES HERE */
/* Start coding below this line! */
/* ============================================ */

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const locations = [
    {
        name: "town square", // Fixed: typo "twon" -> "town" 
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\"." // Fixed: typo "twon" -> "town"
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You entered the store." // Fixed: typo "enterd" -> "entered"

    },
    {
        name: "cave",
        "button text": ["Fight Slime", "Fight Lion", "Go to town square"],
        "button functions": [fightSlime, fightLion, goTown],
        text: "You entered the cave and now you see monsters." // Fixed: typo "enterd" -> "entered"

    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, run],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold' // Fixed: typo "experiance" -> "experience"

    },
    {
        name: "Lose",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You die. LOL!!!"
    },
    {
        name: "win",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You won!!! You defeated the monster!!!"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown], // Fixed: removed array brackets around pickEight
        text: "You found a seceret game. Pick a number from above. Ten numbers will be given randomly vhosse between 0 to 10 . if thne number you chosse matches one of the random numbers, you win!!!"
    }


];

const monsters = [

    {
        name: "slime",
        level: 2,
        health: 15

    },
    {
        name: "lion",
        level: 8,
        health: 60

    },
    {
        name: "dragon",
        level: 20,
        health: 300

    },

];
// Initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {

    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);

}

function goStore() {
    update(locations[1]);

}

function goCave() {
    update(locations[2]);
}


function buyHealth() {

    if (gold >= 10) {

        gold = gold - 10;
        health = health + 10;
        goldText.innerText = gold;
        healthText.innerText = health;

    } else {
        text.innerText = "You do not have enough gold.";
    }

}

function buyWeapon() {

    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon += 1;
            goldText.innerText = gold;
            let newWeapons = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapons + ". ";
            inventory.push(newWeapons);
            text.innerText = "In your inventory you now have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon";
        }
    } else {
        text.innerText = "You already have the most powerful weapon in the game";
        button2.innerText = "Sell your weapon for 15 gold"; // Fixed: "weapin" -> "weapon", "you" -> "your"
        button2.onclick = sellWeapon;

    }


}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + "."; // Fixed: added space after "a"
        text.innerText += " In your inventory you have: " + inventory; // Fixed: "you" -> "your", added space
    } else {
        text.innerText = "Don't sell your only weapon!"; // Fixed: "you" -> "your" 
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightLion() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;

}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack with your " + weapons[currentWeapon].name + ".";

    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);

    } else {
        text.innerText += " You miss.";
    }

    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            win(); // Fixed: was winGame(), should be win()
        } else {
            defeatMonster();
        }

    }
    if (Math.random() <= .1 && inventory.length !== 1) { // Fixed: Math.random needs () parentheses
        text.innerText += " Your " + inventory.pop() + " breaks."; // Fixed: added space before "breaks"
        currentWeapon -= 1;
    }

}

function getMonsterAttackValue(level) { // Fixed: added level parameter
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
    // Monster still attacks you after you dodge
    health -= monsters[fighting].level;
    healthText.innerText = health;
    if (health <= 0) {
        lose();
    }
}

function run() {
    // Run away and go back to town
    goTown();
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]); // Fixed typo: was locationsp[4], should be locations[4]
}

function lose() {
    update(locations[5]);
}

function win() {
    update(locations[6]);

}

function restart() {

    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"]; // Fixed: was [stick] - stick needs quotes to be a string
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg() {
    update(locations[7]);

}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(number) { // Fixed: created pick function that calls guess with the number
    guess(number);
}

function guess(number) { // Fixed: added number parameter instead of using undefined guess variable
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + number + ". Here are the random numbers: \n"; // Fixed: use number parameter

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(number) !== -1) { // Fixed: use number parameter
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;

    } else {
        text.innerText += "Wrong! You lose 10 health!"; // Fixed: typo "losse" -> "lose"
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }

}
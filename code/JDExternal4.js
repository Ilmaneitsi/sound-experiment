//This tutorial really helped me understand Genetic Algors more
//https://www.codecademy.com/courses/javascript-beginner-en-pqhEw/1/2

//I have made 4 copies of this External each with slightly different settings
//To put in this patch

//The aim of this external is to search for and approximate a string of
//characters which are then fed into the patch 3 at a time which control
//the playback segment speed and duration of vocal samples


inlets = 1;
//first outlet spits out a genome sequence, the second outlet spits out
//instructions
outlets = 2;

//DIFFERENCE!!!
//Purposely Muddled the Target on this Instance of the External to make it
//more likely to be played back low
var TARGET = "000104240343442547664742";
var ALPHABET= "01234567";
//Tracks whether or not the external has recieved a bang or not
var STARTED = 0;
//MUTPROB is the probability of a mutation occuring within a gene
var MUT_PROB= 10;
var generations = 0;
var fittest = generateGenome();
//ATTEMPT is the array by which the genome is spat out of the external
var ATTEMPT=[];
//ValueRepeats is to keep track of where we are in the genome
var valueRepeats= 0;

//DIFFERENCE!!!
//the bang functionality from the first external is moved to getValues()
//This bang is used to start the first evolution and start the external.
function bang(){
  if(STARTED===0){
    evolve();
    STARTED++;
  }
}

//Used for debugging
function clear(){
  fittest=generateGenome();
  ATTEMPT=[];
  valueRepeats= 0;
  bang();
}

//Generates a random string
function generateGenome(){
 var genome = [];
 for (i=0; i<TARGET.length; ++i){
    genome[i]=ALPHABET[Math.floor(Math.random()*ALPHABET.length)];
 }
 return genome.join("");
}

// Uses loops to check how close the genetic algo. is to completion.
function getFitness(genome){
    var fitness=0;
    for (var i=0; i<TARGET.length;++i){
        if (genome[i]===TARGET[i]){
            fitness++;
        }
    }
    return fitness;
}

//Creates 100 members of an array with the same genome (although this will change)
function getGenePool(genome){
    var genePool= [];
    for(var i=0; i<50;i++){
        genePool[i]= genome;
    }
    return genePool;
}

//Helps to determine which geneome to spit out
function getFittest(genePool){
    var fitness = 0;
    var fitLoc;
    for(var i=0;i<genePool.length;i++){
     if (getFitness(genePool[i])>fitness){
     fitness = getFitness(genePool[i]);
     fitLoc = i;
     }
    }
    return genePool[fitLoc];
}

//Replaces an incorrect character with a random one.
function doMutation(genome){
 var newGenome ="";
 for (var i=0;i<genome.length;i++){
  if(Math.floor(Math.random()*MUT_PROB)>1){
      if(genome[i]!=TARGET[i]){
          newGenome+=ALPHABET[Math.floor(Math.random()*ALPHABET.length)];
      }
      else{
       newGenome+=genome[i];
      }
  }
  else{
      newGenome+=genome[i];
 }
}
return newGenome;
}

//"Upgrades" the genepool to the next generation
function evolve(){
  //if statement stops the External's loop
  if(getFitness(fittest)>13){
    outlet(1, "bang");
    return;
  }
  //resets the genome tracker, very important for listing purposes
  valueRepeats = 0;
for (var i = 0; i<10;i++){
    generations++;
    var pool = getGenePool(fittest);
    var pool2= [];
    for (var i=0;i<pool.length;++i){
      pool2[i]=doMutation(pool[i],true);
    }
    fittest = getFittest(pool2);
    }
    //Starts the miniloop
  getValues();
  return fittest;

}

function getValues(){
  //stops the function loop just in case
  if (valueRepeats===24){
    if(getFitness(fittest)===TARGET.length){
      return;
    }
    //changes the genepool and resets the genome tracker
    evolve();
  }
  else {
    //records 3 genes in the fittest genome and then spits it out of the program
    ATTEMPT=fittest.slice(valueRepeats, valueRepeats+3);
    valueRepeats+= 3;
    //bang functionality from the first external is moved to here
    outlet(0,ATTEMPT);
    }
    return;
}

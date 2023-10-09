class Agent {
  constructor(noiseZRange) {
    this.vector = createVector(random(width), random(height));
    this.vectorOld = this.vector.copy();
    this.stepSize = random(1, 5);
    this.angle;
    this.noiseZ = random(noiseZRange);
    this.agentColor = color(random(0, 100), random(100, 200), random(200, 255));
  }

  update(strokeWidth, noiseScale, noiseStrength, noiseZVelocity, newColor) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) * noiseStrength;
    
    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;

    if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
    if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
    if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
    if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;

    strokeWeight(strokeWidth * this.stepSize);
    stroke(this.agentColor)
    line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);

    this.agentColor = lerpColor(this.agentColor, newColor, 0.1);

    this.vectorOld = this.vector.copy();

    this.noiseZ += noiseZVelocity;
  }
}

let agents = [];
let agentCount = 1000;
let noiseScale = 1000;
let noiseStrength = 10;
let noiseZRange = 0.4;
let noiseZVelocity = 0.01;
let overlayAlpha = 10;
let agentAlpha = 90;
let strokeWidth = 0.4;

let csvFilePath = './Eeg_data/Eeg_Test_data.csv';
let brainData = [];

let currentAf3, currentAf4, currentPz, currentT7, currentT8;
let currentIndex = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  brainData = await processData(csvFilePath);
  console.log(brainData)

  // currentAf3 = brainData[0]['EEG.AF3'];
  // currentAf4 = brainData[0]['EEG.AF4'];
  // currentPz = brainData[0]['EEG.Pz'];
  // currentT7 = brainData[0]['EEG.T7'];
  // currentT8 = brainData[0]['EEG.T8'];
  
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

let step = 0
function draw() {
 
  fill(0, overlayAlpha);
  noStroke();
  rect(0, 0, width, height);

  // if (currentIndex < brainData.length) {
  //   currentAf3 = brainData[currentIndex]['EEG.AF3'];
  //   currentAf4 = brainData[currentIndex]['EEG.AF4'];
  //   currentPz = brainData[currentIndex]['EEG.Pz'];
  //   currentT7 = brainData[currentIndex]['EEG.T7'];
  //   currentT8 = brainData[currentIndex]['EEG.T8'];
    
  //   currentIndex++;
  // } else {
  //   currentIndex = 0;
  // }

  // step++
  // if (step % 25 === 0) {
  //   noiseScale = lerp(noiseScale, (currentAf3-4000)*10, 0.3)
  //   strokeWidth = lerp(strokeWidth, (currentT7-4000)/500, 0.3)
  //   noiseStrength = lerp(noiseStrength, (currentPz-4000)/30, 0.3)
  // }

  // let newColor = color(random(0, 100), random(100, 200), random(200, 255));
  // if(noiseStrength > 4){
  //   newColor = color(random(0, 100), random(200, 255), random(0, 100));
  // }
  // if(noiseStrength > 6){
  //   newColor = color(random(200, 255), random(0, 100), random(0, 100));
  // }

  stroke(0, agentAlpha);
  for (var i = 0; i < agentCount; i++) {
    if(i <= 1000){
      agents[i].update(strokeWidth, noiseScale, noiseStrength, noiseZVelocity, color(random(0, 100), random(100, 200), random(200, 255))); 
    } /*else if(i <= 400) {
      agents[i].update(strokeWidth, noiseScale, noiseStrength*10, noiseZVelocity, color(random(0, 100), random(200, 255), random(0, 100))); 
    } else if(i <= 600) {
      agents[i].update(strokeWidth, noiseScale, noiseStrength*5, noiseZVelocity, color(random(200, 255), random(0, 100), random(0, 100))); 
    } else if(i <= 800) {
      agents[i].update(strokeWidth, noiseScale, noiseStrength*10, noiseZVelocity, color(random(0, 100), random(200, 255), random(0, 100))); 
    } else if(i <= 1000){
      agents[i].update(strokeWidth, noiseScale, noiseStrength*10, noiseZVelocity, color(random(0, 100), random(200, 255), random(0, 100))); 
    }*/
  }
}

class Agent {
  constructor(freqName) {
    this.vector = createVector(random(width), random(height));
    this.vectorOld = this.vector.copy();

    this.freqType = freqName
    this.noiseScale;
    this.noiseStrength;
    this.noiseZVelocity;
    this.strokeWidth;
    this.stepSize;
    this.angle;
    this.noiseZ;
    this.agentColor;
    this.speedFactor = 0.25;
    this.targetWidth;

    if (freqName == "gamma") {
      this.noiseScale = 1000;
      this.noiseStrength = 5;
      this.noiseZ = random(0.1);
      this.strokeWidth = 3;
      this.targetWidth = 3;
      this.agentColor = color(colors.gamma)
      this.stepSize = 25 * this.speedFactor;
      this.noiseZVelocity = 0.01;
    } else if (freqName == "betaH") {
      this.noiseScale = 1000;
      this.noiseStrength = 6;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.targetWidth = 3;
      this.agentColor = color(colors.betaH)
      this.stepSize = 17 * this.speedFactor;
      this.noiseZVelocity = 0.01;
    } else if (freqName == "betaL") {
      this.noiseScale = 1000;
      this.noiseStrength = 20;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.targetWidth = 3;
      this.agentColor = color(colors.betaL)
      this.stepSize = 10 * this.speedFactor;
      this.noiseZVelocity = 0.02;
    } else if (freqName == "alpha") {
      this.noiseScale = 1000;
      this.noiseStrength = 35;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.targetWidth = 3;
      this.agentColor = color(colors.alpha)
      this.stepSize = 10 * this.speedFactor;
      this.noiseZVelocity = 0.03;
    } else if (freqName == "theta") {
      this.noiseScale = 1000;
      this.noiseStrength = 40;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.targetWidth = 3;
      this.agentColor = color(colors.theta)
      this.stepSize = 3 * this.speedFactor;
      this.noiseZVelocity = 0.04;
    }
  }

  update() {
    this.angle = noise(this.vector.x / this.noiseScale, this.vector.y / this.noiseScale, this.noiseZ) * this.noiseStrength;

    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;

    if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
    if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
    if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
    if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;

    if(step % 50 == 0){
      if (this.freqType === 'gamma') {
        this.targetWidth =  map(gamma, highestAndLowestGamma.lowest, highestAndLowestGamma.highest, 2, 12, true)
      } else if (this.freqType === 'betaH') {
        this.targetWidth = map(gamma, highestAndLowestBetaH.lowest, highestAndLowestBetaL.highest, 2, 12, true)
      } else if (this.freqType === 'betaL') {
        this.targetWidth = map(gamma, highestAndLowestBetaL.lowest, highestAndLowestBetaL.highest, 2, 12, true)
      } else if (this.freqType === 'alpha') {
        this.targetWidth = map(gamma, highestAndLowestAlpha.lowest, highestAndLowestAlpha.highest, 2, 12, true)
      } else if (this.freqType === 'theta') {
        this.targetWidth = map(gamma, highestAndLowestTheta.lowest, highestAndLowestTheta.highest, 2, 12, true)
      }
    }

    if(this.targetWidth >= this.strokeWidth) {
      this.strokeWidth = lerp(this.strokeWidth, this.targetWidth, 0.5)
    } else {
      this.strokeWidth = lerp(this.targetWidth, this.strokeWidth, 0.5)
    }

    strokeWeight(this.strokeWidth);
    stroke(this.agentColor)
    line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);

    this.vectorOld = this.vector.copy();

    this.noiseZ += this.noiseZVelocity;
  }
}

let agents = [];
let agentCount = 1000;
let isPaused = false;
let overlayAlpha = 10;
let agentAlpha = 90;
let colors = {
  gamma: 'rgb(0, 149, 255)',
  betaH: 'rgb(19, 250, 2)',
  betaL: 'rgb(255, 247, 0)',
  alpha: 'rgb(255, 132, 0)',
  theta: 'rgb(255, 4, 0)'
}

let csvFilePath = './Eeg_data/Eeg_Test_data.csv';
let brainData = [];

let alpha, betaL, betaH, gamma, theta;
let freqTypes = ['gamma', 'betaL', 'betaH', 'alpha', 'theta']
let currentIndex = 0;
let highestAndLowestGamma, highestAndLowestBetaH, highestAndLowestBetaL, highestAndLowestAlpha, highestAndLowestTheta;

function findHighestAndLowest(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return "Please provide a valid non-empty array.";
  }

  let highest = numbers[0];
  let lowest = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > highest) {
      highest = numbers[i];
    }
    if (numbers[i] < lowest && numbers[i] !== 0) {
      lowest = numbers[i];
    }
  }

  return {
    highest: highest,
    lowest: lowest
  };
}

async function setup() {
  createCanvas(windowWidth, windowHeight);

  brainData = await processData(csvFilePath);
  const brainDataGammaVals = brainData.map((item) => {
    return (
      [Number(item.gamma)]
    )
  }).flat()

  highestAndLowestGamma = findHighestAndLowest(brainDataGammaVals)

  const brainDataBetaHVals = brainData.map((item) => {
    return (
      [Number(item.betaH)]
    )
  }).flat()

  highestAndLowestBetaH = findHighestAndLowest(brainDataBetaHVals)


  const brainDataBetaLVals = brainData.map((item) => {
    return (
      [Number(item.betaL)]
    )
  }).flat()

  highestAndLowestBetaL = findHighestAndLowest(brainDataBetaLVals)



  const brainDataAlphaVals = brainData.map((item) => {
    return (
      [Number(item.alpha)]
    )
  }).flat()

  highestAndLowestAlpha = findHighestAndLowest(brainDataAlphaVals)



  const brainDataThetaVals = brainData.map((item) => {
    return (
      [Number(item.theta)]
    )
  }).flat()

  highestAndLowestTheta = findHighestAndLowest(brainDataThetaVals)


  console.log('gamma', highestAndLowestGamma)
  console.log('beta h', highestAndLowestBetaH)
  console.log('beta l', highestAndLowestBetaL)
  console.log('alpha', highestAndLowestAlpha)
  console.log('theta', highestAndLowestTheta)

  for (let j = 0; j < freqTypes.length; j++) {

    const type = freqTypes[j]
    for (let i = 0; i < agentCount / 5; i++) {
      agents.push(new Agent(type));
    }
  }
}

let step = 0
function draw() {
  if(!isPaused){
    step++;

    fill(0, overlayAlpha);
    noStroke();
    rect(0, 0, width, height);
  
    if (currentIndex < brainData.length) {
      alpha = brainData[currentIndex].alpha;
      betaL = brainData[currentIndex].betaL;
      betaH = brainData[currentIndex].betaH;
      gamma = brainData[currentIndex].gamma;
      theta = brainData[currentIndex].theta;
      currentIndex++;
    } else {
      currentIndex = 0;
    }

    stroke(0, agentAlpha);
    for (var i = 0; i < agentCount; i++) {
      if (agents[i]) {
        agents[i].update();
      }
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    // Toggle animation pause when the space key is pressed
    isPaused = !isPaused;
  }
}
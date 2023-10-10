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

    if (freqName == "gamma") {
      this.noiseScale = 1000;
      this.noiseStrength = 5;
      this.noiseZ = random(0.1);
      this.strokeWidth = 8;
      this.agentColor = color(colors.gamma)
      this.stepSize = 25 * this.speedFactor;
      this.noiseZVelocity = 0.01;
    } else if (freqName == "betaH") {
      this.noiseScale = 1000;
      this.noiseStrength = 6;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.agentColor = color(colors.betaH)
      this.stepSize = 17 * this.speedFactor;
      this.noiseZVelocity = 0.01;
    } else if (freqName == "betaL") {
      this.noiseScale = 1000;
      this.noiseStrength = 20;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.agentColor = color(colors.betaL)
      this.stepSize = 10 * this.speedFactor;
      this.noiseZVelocity = 0.02;
    } else if (freqName == "alpha") {
      this.noiseScale = 1000;
      this.noiseStrength = 35;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
      this.agentColor = color(colors.alpha)
      this.stepSize = 10 * this.speedFactor;
      this.noiseZVelocity = 0.03;
    } else if (freqName == "theta") {
      this.noiseScale = 1000;
      this.noiseStrength = 40;
      this.noiseZ = random(0.4);
      this.strokeWidth = 3;
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

    if (this.freqType === 'gamma') {
      if (gamma > 10) {
        gamma = 10
      }
      this.strokeWidth = lerp(this.strokeWidth, gamma / 5)
    } else if (this.freqType === 'betaH') {
      this.strokeWidth = betaH / 5
    } else if (this.freqType === 'betaL') {
      this.strokeWidth = betaL / 5
    } else if (this.freqType === 'alpha') {
      this.strokeWidth = alpha / 5
    } else if (this.freqType === 'theta') {
      this.strokeWidth = theta / 50
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
let freqTypesTest = ['betaL', 'alpha', 'theta']
let currentIndex = 0;
let gammaValsArr = []

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
  const gammaVals = brainData.map((item) => {
    return (
      { gamma: Number(item.gamma) }
    )
  }).forEach((value) => {
    console.log('gama', value.gamma)
    gammaValsArr.push(value.gamma)
  })
  console.log('gamma', findHighestAndLowest(gammaValsArr))

  for (let j = 0; j < freqTypes.length; j++) {
    console.log(freqTypes[j] === "gamma")
    const type = freqTypes[j]
    for (let i = 0; i < agentCount / 5; i++) {
      agents.push(new Agent(type));
    }
  }


  // for (var i = 0; i < agentCount; i++) {
  //   if (i <= agentCount / 5) {
  //     agents[i] = new Agent("alpha");
  console.log("agent", agents)
}

let step = 0
function draw() {

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
    console.log('reset')
    currentIndex = 0;
  }

  // step++
  // if (step % 250 === 0 || currentIndex == 0) {
  //   noiseScale = lerp(noiseScale, (currentAf3 - 4000) * 10, 0.3)
  //   strokeWidth = lerp(strokeWidth, (currentT7 - 4000) / 500, 0.3)
  //   noiseStrength = lerp(noiseStrength, (currentPz - 4000) / 30, 0.3)

  // }

  stroke(0, agentAlpha);
  for (var i = 0; i < agentCount; i++) {
    if (agents[i]) {
      agents[i].update();
    }
  }
}

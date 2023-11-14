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

    if (step % 50 == 0) {
      if (this.freqType === 'gamma') {
        this.targetWidth = map(gamma, highestAndLowestGamma.lowest, highestAndLowestGamma.highest, 2, 12, true)
      } else if (this.freqType === 'betaH') {
        this.targetWidth = map(betaH, highestAndLowestBetaH.lowest, highestAndLowestBetaL.highest, 2, 12, true)
      } else if (this.freqType === 'betaL') {
        this.targetWidth = map(betaL, highestAndLowestBetaL.lowest, highestAndLowestBetaL.highest, 2, 12, true)
      } else if (this.freqType === 'alpha') {
        this.targetWidth = map(alpha, highestAndLowestAlpha.lowest, highestAndLowestAlpha.highest, 2, 12, true)
      } else if (this.freqType === 'theta') {
        this.targetWidth = map(theta, highestAndLowestTheta.lowest, highestAndLowestTheta.highest, 2, 12, true)
      }
    }

    if (this.targetWidth >= this.strokeWidth) {
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

class Bar {
  constructor(freqName) {
    this.height = 1;
    this.targeHeight = 1;
    this.freqType = freqName
    if (freqName === "gamma") {
      this.vector = createVector(width * 0.95 - 25, height / 5 - 50)
      this.color = colors.gamma
    } else if (freqName == "betaH") {
      this.vector = createVector(width * 0.95 - 25, height / 5 * 2 - 50)
      this.color = colors.betaH
    } else if (freqName == "betaL") {
      this.vector = createVector(width * 0.95 - 25, height / 5 * 3 - 50)
      this.color = colors.betaL
    } else if (freqName == "alpha") {
      this.vector = createVector(width * 0.95 - 25, height / 5 * 4 - 50)
      this.color = colors.alpha
    } else if (freqName == "theta") {
      this.vector = createVector(width * 0.95 - 25, height / 5 * 5 - 50)
      this.color = colors.theta
    }
  }

  update() {
    this.height = lerp(this.height, this.targeHeight, 0.1)

    fill(this.color);
    rect(this.vector.x, this.vector.y, 50, -this.height);

    fill(255);
    textAlign(CENTER);
    text(this.freqType, this.vector.x + 25, this.vector.y + 20);

    if (step % 50 == 0) {
      if (this.freqType === 'gamma') {
        this.targeHeight = map(gamma, highestAndLowestGamma.lowest, highestAndLowestGamma.highest, 1, 100, true);
      } else if (this.freqType === 'betaH') {
        this.targeHeight = map(betaH, highestAndLowestBetaH.lowest, highestAndLowestBetaH.highest, 1, 100, true);
      } else if (this.freqType === 'betaL') {
        this.targeHeight = map(betaL, highestAndLowestBetaL.lowest, highestAndLowestBetaL.highest, 1, 100, true);
      } else if (this.freqType === 'alpha') {
        this.targeHeight = map(alpha, highestAndLowestAlpha.lowest, highestAndLowestAlpha.highest, 1, 100, true);
      } else if (this.freqType === 'theta') {
        this.targeHeight = map(theta, highestAndLowestTheta.lowest, highestAndLowestTheta.highest, 1, 100, true);
      }
    }
  }
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.round(seconds % 60);
  return nf(minutes, 2) + ':' + nf(remainingSeconds, 2);
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


let csvFilePaths = [
  './Eeg_data/Instagram.csv',
  './Eeg_data/Chess_One.csv',
  './Eeg_data/Alarm_Sound.csv',
  './Eeg_data/Relaxing_Music.csv'
]


let csvFilePath = './Eeg_data/Instagram.csv';
let brainData = [];

let alpha, betaL, betaH, gamma, theta;
let freqTypes = ['gamma', 'betaL', 'betaH', 'alpha', 'theta']
let currentIndex = 0;
let highestAndLowestGamma, highestAndLowestBetaH, highestAndLowestBetaL, highestAndLowestAlpha, highestAndLowestTheta;

let show = true;
let bars = [];

let elapsedTime = 0;
let totalTime = 0;

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
  const buttonInstagram = createButton('instagram')
  buttonInstagram.position(100, 0)
  buttonInstagram.mousePressed(() => switchDataset(0))


  const buttonChess = createButton('chess')
  buttonChess.position(200, 0)
  buttonChess.mousePressed(() => switchDataset(1))

  const buttonAlarm = createButton('alarm')
  buttonAlarm.position(300, 0)
  buttonAlarm.mousePressed(() => switchDataset(2))


  const buttonMusic = createButton('music')
  buttonMusic.position(400, 0)
  buttonMusic.mousePressed(() => switchDataset(3))



  agentCount = windowWidth * windowHeight / 300
  brainData = await processData(csvFilePath);
  const brainDataGammaVals = brainData.map((item) => {
    return (
      [Number(item.gamma)]
    )
  }).flat()

  totalTime = brainData[brainData.length - 2].timestamp

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

  for (let j = 0; j < freqTypes.length; j++) {

    const type = freqTypes[j]
    for (let i = 0; i < agentCount / 5; i++) {
      agents.push(new Agent(type));
    }
    bars.push(new Bar(type))
  }
}

let step = 0
function draw() {
  if (!isPaused) {
    step++;
    if (step % 60 === 0) {
      elapsedTime++;
    }
    if (elapsedTime >= totalTime) {
      elapsedTime = 0;
    }

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

    if (show) {
      fill(0)
      noStroke()
      rect(width * 0.9, 0, width * 0.2, windowHeight)

      for (let i = 0; i < bars.length; i++) {
        if (bars[i]) {
          bars[i].update();
        }
      }

      let timerText = `${formatTime(elapsedTime)}/${formatTime(totalTime)}`;
      fill(255);
      noStroke();
      textAlign(CENTER);
      textSize(16);
      text(timerText, width * 0.95, 20);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
  }
  if (key === 'b') {
    show = !show;
  }
}


function switchDataset(index) {
  const filePath = csvFilePaths[index]
  csvFilePath = filePath
  console.log('test', filePath, index)


  agents = [];
  bars = [];
  step = 0;
  isPaused = false;
  elapsedTime = 0;
  totalTime = 0;

  // Call your existing setup code
  setup();
}
let ready = false;

let osc;
let osc2;

let wave;
let hzSet = document.querySelector('#button');
let inputSet = document.querySelector('#input-set');
let Hz = document.querySelector('#Hz');

let freq = 40;



//-------------------------------------------------



//---------------------------------------------------
// canvas to match browser size
function setup(){
    createCanvas(windowWidth, windowHeight);

    hzSet.addEventListener('click', () =>{
        Hz.innerText = inputSet.value;

    });

    osc = new Tone.Oscillator();
    osc.frequency.value = 45;
    osc.toDestination();

    osc2 = new Tone.Oscillator();
    osc2.frequency.value = 45;
    osc2.toDestination();

    wave = new Tone.Waveform();
    Tone.Master.connect(wave);

    Tone.Master.volume.value = -12;

}

// on window resize
function onResize(){
    resizeCanvas(windowWidth, windowHeight);
}

// main render loop
function draw(){
    background(0);

    if (ready){
        osc.frequency.value = map(mouseX, 0, width, 45, 45*2);

        strokeWeight(4);
        stroke(255);
        let buffer = wave.getValue(0);

        // looks for x-crossing (neg to pos)
        let start = 0;
        for (let i=1; i < buffer.length; i++ ) {
            if(buffer[i-1] < 0 && buffer[i] >= 0) {
                start = i;
                break;
            }
        }

        // draws waveform
        let end = start + buffer.length/2;

        for (let i=start; i < end; i++) {
            let x1 = map(i-1, start, end, 0 , width);
            let y1 = map(buffer[i-1], -1, 1, 0, height);
            let x2 = map(i, start, end, 0 , width);
            let y2 = map(buffer[i], -1, 1, 0, height);
            line(x1, y1, x2, y2);
        }


    }
    else{
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text("click to start", width/2, height/2)
    }
}


function mousePressed(){
    if (!ready) {

        osc.start();
        osc2.start();
        ready = true;
    }
}
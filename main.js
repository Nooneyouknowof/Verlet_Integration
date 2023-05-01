
/*
    Physics Engine made by Octavio McNaughton
    Verlet integration algorithm
*/

var Frame = document.getElementById("Frame");
var main = document.getElementById("main");
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0;
canvas.width = Frame.clientWidth;
canvas.height = Frame.clientHeight;
var count = 0;

var Settings = {
    Frame_Parallax_Multiplier: 1,
    Menu_Animation: true,
}

var Simulation = {
    BallCount: 100,
    BallSize: 10,
    grav: 0.1,
    friction: 0.99,
    bounceyness: 0.5,
}

var objects = {
    x: new Float32Array(Simulation.BallCount+1).fill(Simulation.BallSize),
    y: new Float32Array(Simulation.BallCount+1).fill(Simulation.BallSize),
    px: new Float32Array(Simulation.BallCount).fill(-10),
    py: new Float32Array(Simulation.BallCount).fill(4),
}

document.addEventListener('mousemove', (event) => {
    // Get the current mouse position
    const x = ((event.clientX/window.innerWidth)*Settings.Frame_Parallax_Multiplier)-(Settings.Frame_Parallax_Multiplier/2);
    const y = ((event.clientY/window.innerHeight)*Settings.Frame_Parallax_Multiplier)-(Settings.Frame_Parallax_Multiplier/2);

    // Do something with the mouse position
    Frame.style.transform = "translate("+(-50+x)+"%, "+(-50+y)+"%)"
});

// Enforce Settings Update
setInterval(function(){
    if (document.getElementById("Parallax").value != Settings.Frame_Parallax_Multiplier) {
        Settings.Frame_Parallax_Multiplier = document.getElementById("Parallax").value;
    }
    if (document.getElementById("Sim_Width").value != (Settings.width/main.innerWidth)*100) {
        Frame.style.width = document.getElementById("Sim_Width").value+"%";
    }
    if (document.getElementById("Sim_Height").value != (Settings.height/main.innerHeight)*100) {
        Frame.style.height = document.getElementById("Sim_Height").value+"%";
    }
    if (document.getElementById("Ball_Size").value != Simulation.BallSize) {
        Simulation.BallSize = document.getElementById("Ball_Size").value;
    }
    if (document.getElementById("Ball_Count").value != Simulation.BallCount) {
        Simulation.BallCount = document.getElementById("Ball_Count").value;
        document.getElementById("reset").disabled = false;
    }
    
    if (document.getElementById("Sim_Gravity").value != Simulation.grav) {
        document.getElementById("reset").disabled = false;
    }
    if (document.getElementById("Sim_Friction").value != Simulation.friction) {
        document.getElementById("reset").disabled = false;
    }
    if (document.getElementById("Sim_Bounceyness").value != Simulation.bounceyness) {
        document.getElementById("reset").disabled = false;
    }
},16);

function reset() {
    document.getElementById("reset").disabled = true;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    r = true;
    objects = {
        x: new Float32Array(Simulation.BallCount+1).fill(Simulation.BallSize+1),
        y: new Float32Array(Simulation.BallCount+1).fill(Simulation.BallSize+1),
        px: new Float32Array(Simulation.BallCount).fill(-10),
        py: new Float32Array(Simulation.BallCount).fill(4),
    }
    //Simulation.grav = document.getElementById("Sim_Gravity").value;
    Simulation.friction = document.getElementById("Sim_Friction").value;
    Simulation.bounceyness = document.getElementById("Sim_Bounceyness").value;
    count = 0;
}
document.getElementById("reset").disabled = true;
document.getElementById("Sim_Gravity").disabled = true;

/*
    Rendering Engine
*/

function RenderPoints() {
    for (var k = 0; k < count; k++) {
        ctx.beginPath();
        ctx.arc(objects.x[k], objects.y[k], Simulation.BallSize/2, 0, Math.PI * 2);
        ctx.fill();
    }
}

/*
    Physics Engine
*/

var count = 0;
window.onload = function() {
    function Update() {
        canvas.width = Frame.clientWidth;
        canvas.height = Frame.clientHeight;
        var g = Simulation.grav;

        if (count < Simulation.BallCount) {
            count++;
            console.log(count+" / "+Simulation.BallCount);
        }
        
        for (var i = 0; i < count; i++) {
            var vx = objects.x[i] - objects.px[i];
            var vy = objects.y[i] - objects.py[i];

            objects.px[i] = objects.x[i]
            objects.py[i] = objects.y[i]
            objects.x[i] += vx*Simulation.friction;
            objects.y[i] += (vy*Simulation.friction) + g;
            
            for (var j = 0; j < count; j++) {
                if (i != j) {
                    var a = objects.x[j]-objects.x[i];
                    var b = objects.y[j]-objects.y[i];
                    var d = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
                    if (Math.round(d) <= Simulation.BallSize) {
                        var midx = (objects.x[i]+objects.x[j])/2
                        var midy = (objects.y[i]+objects.y[j])/2
                        
                        var h = Simulation.BallSize/d;
                
                        objects.x[i] = midx - ((a*h)/2);
                        objects.y[i] = midy - ((b*h)/2);
                        objects.x[j] = midx + ((a*h)/2);
                        objects.y[j] = midy + ((b*h)/2);
                    }
                }
            }
            if (objects.x[i] > canvas.width-(Simulation.BallSize/2)) {
                objects.x[i] = canvas.width-(Simulation.BallSize/2);
                objects.px[i] = objects.x[i] + (vx*Simulation.bounceyness)
            } else if (objects.x[i] < (Simulation.BallSize/2)) {
                objects.x[i] = (Simulation.BallSize/2);
                objects.px[i] = objects.x[i] + (vx*Simulation.bounceyness)
            }
            if (objects.y[i] > canvas.height-(Simulation.BallSize/2)) {
                objects.y[i] = canvas.height-(Simulation.BallSize/2);
                objects.py[i] = objects.y[i] + (vy*Simulation.bounceyness)
            } else if (objects.y[i] < (Simulation.BallSize/2)) {
                objects.y[i] = (Simulation.BallSize/2);
                objects.py[i] = objects.y[i] + (vy*Simulation.bounceyness)
            }

        }
        RenderPoints();
        requestAnimationFrame(Update);
    }
    function onready(arg) {
        if (arg == true) {
            requestAnimationFrame(Update);
        } else {
    
        }
    }
    var ready = false
    setTimeout(function(){
        ready = true
    },1000);

    setInterval(function(){
        onready(ready)
    },10);
}



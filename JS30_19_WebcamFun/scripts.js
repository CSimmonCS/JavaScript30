const video = document.querySelector('.player');//class of player
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//The canvas video will be piped off the video and dumped into the canvas
//The canvas will manipulate the pixels 
//Strip is where we will put all of our images
//Audio is the snapshot sound

function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.src = window.URL.createObjectURL(localMediaStream);
			//MediaStream is an object and needs to be changed to be a URL
			video.play();
			//this updates so that the camera shouldn't just be one frame
			//if inspected, blob is the video being caught
		})
		.catch(err => {
			console.error(`WELP ERROR`, err);
		});
}


function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;
	//console.log(width, height);
	//if canvas is different than video, we have to change that

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		//take pixels out
		let pixels = ctx.getImageData(0, 0, width, height);
		//mess with them
		//pixels = redEffect(pixels);

		pixels = rgbSplit(pixels);
		// ctx.globalAlpha = 0.1;

		//pixels = greenScreen(pixels);

		//put them back
		ctx.putImageData(pixels, 0, 0);
	}, 16);
	//every 16 milliseconds the canvas is taking a frame from the video
}

function takePhoto() {
	snap.currentTime = 0;
	snap.play();
	//this plays the snapshot sound

	//take the data out of canvas
	const data = canvas.toDataURL('image/png');
	//console.log(data);
	//returns data attributes

	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'handsome');
	link.innerHTML = `<img src="${data}" alt="Handsome Bruh" />`;
	strip.insertBefore(link, strip.firstChild);

	//we create a link
	//set href to data
	//we set the attribute and text content
	//a link is then given 'Download Image'
	//image is then downloaded
	//URL is a data-image, the text string is image-attributes in text form


}
//filters work by getting pixels out of canvas and messing with rbg values
//and adding it to the canvas

function redEffect(pixels) {
	for(let i = 0; i < pixels.data.length; i+=4){
		pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
		pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
	}

	return pixels;
}

function rgbSplit(pixels){
		for(let i = 0; i < pixels.data.length; i+=4){
		pixels.data[i - 150] = pixels.data[i + 0]; //red
		pixels.data[i + 100] = pixels.data[i + 1]; //green
		pixels.data[i - 550] = pixels.data[i + 2]; //blue
	}

	return pixels;
}

function greenScreen(pixels) {
  const levels = {};//this holds min & max values

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
	//if the rbg is inbetween the min and max values then we set it to 0
	//aka transparent
  return pixels;
}



getVideo();


video.addEventListener('canplay', paintToCanvas);
//when video is playing "canplay" is emitted
//which in turn calls paintToCanvas

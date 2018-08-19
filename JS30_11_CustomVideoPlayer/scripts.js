/*Get Our Elements*/

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/*Build out functions*/

function togglePlay(){

	const method = video.paused ? 'play' : 'pause';
	video[method]();

	/*if(video.paused){
		video.play();
	} else {
		video.pause();
	}*/

}

function updateButton()
{
	const icon = this.paused ? '►' : '❚ ❚';
	toggle.textContent = icon;
	//console.log('Update the Button')
}

function skip(){
	//console.log(this.dataset.skip);
	video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(){
	video[this.name] = this.value;
	//this is either 'volume' or 'playbackRate'
}

function handleProgress(){
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
	const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
}

/*Hook up the event listeners*/


video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
//triggers whenever the time is updated, skipping forward and backward


toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
//listens for change event of ranges
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));


let mousedown = false;
progress.addEventListener('click', scrub);//listens and changes to where time is scrubbed
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
//when someone moves their mouse
//this checks for the variable if true, then goes to run scrub
//if false, returns false
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

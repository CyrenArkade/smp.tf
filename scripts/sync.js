(() => {
  const params = new URLSearchParams();
  if (window.location.href.includes('/videos/')) {
    const video = document.querySelector('video[aria-label="Twitch video player"]');
    params.set('vod', window.location.href.match(/videos\/(\d+)/)[1]);
    params.set('at', Math.floor(video.currentTime));
  }
  else {
    params.set('at', Math.floor(new Date().getTime() / 1000));
  }
  const url = `https://smp.tf/?${params}`;
  window.open(url);
})()

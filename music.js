import { MUSIC_TRACKS } from "./config.js";

const fmt = (sec) => {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export function initMusic() {
  const audio = document.getElementById("audio");
  const title = document.getElementById("musicTitle");
  const artist = document.getElementById("musicArtist");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const progress = document.getElementById("progress");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const loopBtn = document.getElementById("loopBtn");
  const muteBtn = document.getElementById("muteBtn");
  const volume = document.getElementById("volume");
  const playlist = document.getElementById("playlist-strip");
  const cover = document.querySelector(".music-cover");
  const trackIndex = document.getElementById("trackIndex");
  const trackCounter = document.querySelector(".music-badge");

  if (!audio || !title || !artist || !currentTime || !duration || !progress || !playBtn || !prevBtn || !nextBtn || !loopBtn || !muteBtn || !volume || !playlist || !cover || !trackIndex) {
    return;
  }

  const tracks = MUSIC_TRACKS.slice();
  let index = 0;
  let looping = false;
  let muted = false;

  const renderPlaylist = () => {
    playlist.innerHTML = "";
    tracks.forEach((track, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track-pill";
      btn.innerHTML = `<span>${String(idx + 1).padStart(2, "0")}</span>`;
      btn.title = track.title;
      btn.classList.toggle("is-active", idx === index);
      btn.addEventListener("click", () => setTrack(idx, true));
      playlist.appendChild(btn);
    });

    const idxText = `${String(index + 1).padStart(2, "0")} / ${String(tracks.length).padStart(2, "0")}`;
    trackIndex.textContent = idxText;
    if (trackCounter) trackCounter.textContent = "Now Playing";
  };

  const setIcons = () => {
    playBtn.innerHTML = audio.paused
      ? '<svg viewBox="0 0 24 24"><use href="#icon-play"></use></svg>'
      : '<svg viewBox="0 0 24 24"><use href="#icon-pause"></use></svg>';
    loopBtn.classList.toggle("is-active", looping);
    muteBtn.classList.toggle("is-active", muted);
    muteBtn.innerHTML = muted
      ? '<svg viewBox="0 0 24 24"><use href="#icon-mute"></use></svg>'
      : '<svg viewBox="0 0 24 24"><use href="#icon-volume"></use></svg>';
  };

  const setTrack = (newIndex, autoplay = false) => {
    index = (newIndex + tracks.length) % tracks.length;
    const track = tracks[index];

    title.textContent = track.title;
    artist.textContent = track.artist;
    cover.src = track.cover;
    audio.src = track.src;
    audio.loop = looping;
    audio.muted = muted;
    audio.load();

    renderPlaylist();
    setIcons();

    if (autoplay) {
      audio.play().catch(() => {});
    }
  };

  const savedVolume = Number(localStorage.getItem("phuonglinh-volume"));
  const initialVolume = Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1 ? savedVolume : 0.86;
  audio.volume = initialVolume;
  volume.value = String(initialVolume);

  const savedTrack = Number(localStorage.getItem("phuonglinh-track"));
  if (Number.isFinite(savedTrack) && savedTrack >= 0 && savedTrack < tracks.length) {
    index = savedTrack;
  }

  setTrack(index, false);

  playBtn.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.warn(err);
      }
    } else {
      audio.pause();
    }
    setIcons();
  });

  prevBtn.addEventListener("click", () => setTrack(index - 1, true));
  nextBtn.addEventListener("click", () => setTrack(index + 1, true));

  loopBtn.addEventListener("click", () => {
    looping = !looping;
    audio.loop = looping;
    setIcons();
  });

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    audio.muted = muted;
    setIcons();
  });

  audio.addEventListener("play", setIcons);
  audio.addEventListener("pause", setIcons);

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = fmt(audio.duration);
    progress.max = String(Math.floor(audio.duration || 0));
  });

  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = fmt(audio.currentTime);
    progress.value = String(Math.floor(audio.currentTime || 0));
  });

  progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value);
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    localStorage.setItem("phuonglinh-volume", String(volume.value));
  });

  audio.addEventListener("ended", () => {
    localStorage.setItem("phuonglinh-track", String(index));
    setTrack(index + 1, true);
  });

  tracks.forEach((_, idx) => {
    localStorage.setItem("phuonglinh-track", String(index));
  });

  renderPlaylist();
  setIcons();
}

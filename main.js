const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	songs: [
		{
			name: 'Không muốn yêu lại càng say đắm',
			singer: 'Mr. siro',
			path: './music/KhongMuonYeuLaiCangSayDamCover-NguyenThacBaoNgoc-6915125.mp3',
			image: './img/Mr.siro.jpg',
		},
		{
			name: 'Một bước yêu vạn dặm đau',
			singer: 'Mr. siro',
			path: './music/MotBuocBuocYeuVanDamDau.mp3',
			image: './img/mr.siro_2.webp',
		},
		{
			name: 'Đáy Biển',
			singer: 'Nhất Chi Lựu Liên',
			path: './music/DayBien.mp3',
			image: './img/NhatChiLuuLien.jpg',
		},
		{
			name: 'Đừng làm trái tim anh đau',
			singer: 'Sơn Tùng MTP',
			path: './music/DungLamTraiTimAnhDau.mp3',
			image: './img/SonTungMTP.jpg',
		},
		{
			name: 'Em hát ai nghe',
			singer: 'Orange',
			path: './music/EmHatAiNghe.mp3',
			image: './img/Orange.jpg',
		},
		{
			name: 'Vở kịch của em',
			singer: 'Hồ Phong An',
			path: './music/VoKichCuaEm.mp3',
			image: './img/HoPhongAn.jpg',
		},
		{
			name: 'Nên chờ hay nên quên',
			singer: 'Chu Thúy Quỳnh',
			path: './music/NenChoHayNenQuen.mp3',
			image: './img/ChuThuyQuynh.jpg',
		},
	],
	render: function () {
		const html = this.songs.map((song, index) => {
			return `
				<div class="song ${index === this.currentIndex ? 'active' : ''}">
					<div
						class="thumb"
						style="background-image: url(${song.image})"></div>
					<div class="body">
						<h3 class="title">${song.name}</h3>
						<p class="author">${song.singer}</p>
					</div>
					<div class="option">
						<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>`;
		});
		$('.playlist').innerHTML = html.join('');
	},
	defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},
	handleEvents: function () {
		const _this = this;
		const cdWidth = cd.offsetWidth;

		//Xử lý CD quay / dừng
		const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
			duration: 10000, //10 seconds
			iterations: Infinity,
		});
		cdThumbAnimate.pause();
		//Xử lý phóng to / thu nhỏ CD
		document.onscroll = function () {
			const scrollTop = document.documentElement.scrollTop || window.scrollY;
			const newCdWidth = cdWidth - scrollTop;

			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
			cd.style.opacity = newCdWidth / cdWidth;
		};

		//Xử lý khi click play
		playBtn.addEventListener('click', function () {
			if (_this.isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		});
		//khi song được play
		audio.onplay = function () {
			_this.isPlaying = true;
			player.classList.add('playing');
			cdThumbAnimate.play();
		};

		//khi song được play
		audio.onpause = function () {
			_this.isPlaying = false;
			player.classList.remove('playing');
			cdThumbAnimate.pause();
		};

		//Khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
				progress.value = progressPercent;
			}
		};

		//Xử lý khi tua song
		progress.addEventListener('change', function (e) {
			const seekTime = (audio.duration / 100) * e.target.value;
			audio.currentTime = seekTime;
		});
		//khi next song
		nextBtn.addEventListener('click', function () {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.render();
		});
		//khi prev song
		prevBtn.addEventListener('click', function () {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.prevSong();
			}
			audio.play();
			_this.render();
		});

		//Xử lý random song
		randomBtn.addEventListener('click', function () {
			_this.isRandom = !_this.isRandom;
			randomBtn.classList.toggle('active', _this.isRandom);
		});

		//Xử lý lặp lại song
		repeatBtn.addEventListener('click', function () {
			_this.isRepeat = !_this.isRepeat;
			repeatBtn.classList.toggle('active', _this.isRepeat);
		});

		//Xử lý next song khi audio ended
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play();
			} else {
				nextBtn.click();
			}
		};
	},

	loadCurrentSong: function () {
		heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
		audio.src = this.currentSong.path;
	},
	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},
	prevSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length;
		}
		this.loadCurrentSong();
	},
	playRandomSong: function () {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while (newIndex === this.currentIndex);

		this.currentIndex = newIndex;
		this.loadCurrentSong();
	},
	start: function () {
		//Định nghĩa các thuộc tính cho object
		this.defineProperties();

		//Lắng nghe / xử lý các sự kiện (DOM events)
		this.handleEvents();

		//Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong();

		//Render playlist
		this.render();
	},
};

app.start();

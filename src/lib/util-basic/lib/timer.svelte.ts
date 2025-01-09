export class Timer {
	#interval?: number;
	seconds = $state(0);

	reset() {
		this.seconds = 0;
	}

	start(seconds?: number) {
		this.seconds = seconds ?? this.seconds;

		if (this.seconds <= 0) return;
		if (this.#interval) return;

		this.#interval = setInterval(() => {
			if (this.seconds <= 0) return this.stop();
			this.seconds -= 1;
		}, 1000);
	}

	stop() {
		clearInterval(this.#interval);
		this.#interval = undefined;
	}

	async wait() {
		return new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (this.seconds <= 0) {
					clearInterval(interval);
					resolve();
				}
			}, 1000);
		});
	}
}

const timer = new Timer();
timer.seconds = 1;

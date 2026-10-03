let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioContextClass();
  }
  return sharedAudioCtx;
}

// User gesture unlocker: unlock audio early when user clicks play/toggle
export function unlockAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

// Crisp, gentle modern notification sound
export function playChimeSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const runSound = () => {
    try {
      const now = ctx.currentTime;

      const playTone = (freq: number, start: number, duration: number, maxGain = 0.18) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Pure sine wave for smooth glass notification ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(maxGain, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Soft modern notification ping: E5 (659.25Hz) -> A5 (880.00Hz)
      playTone(659.25, now, 0.22, 0.14);
      playTone(880.00, now + 0.10, 0.42, 0.18);
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
    }
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(runSound).catch(runSound);
  } else {
    runSound();
  }
}

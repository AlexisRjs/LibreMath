import { useState, useEffect, useCallback } from 'react';
import { PomodoroMode, PomodoroPresetId } from '../types/pomodoro';
import { playChimeSound, unlockAudioContext } from '../utils/sound';

const STORAGE_KEY = 'ingedata_pomodoro_state';
const CUSTOM_STORAGE_KEY = 'ingedata_pomodoro_custom_times';

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('study');
  const [selectedPresetId, setSelectedPresetId] = useState<PomodoroPresetId>('1h-10m');

  // Dedicated persistent custom times (remembered forever across sessions and presets)
  const [customStudyMinutes, setCustomStudyMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.study) return parsed.study;
      }
    } catch (e) {
      console.error(e);
    }
    return 45;
  });

  const [customBreakMinutes, setCustomBreakMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.break) return parsed.break;
      }
    } catch (e) {
      console.error(e);
    }
    return 15;
  });

  const [studyDurationMinutes, setStudyDurationMinutes] = useState<number>(60);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60);
  const [totalDuration, setTotalDuration] = useState<number>(60 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  const [isWidgetDismissed, setIsWidgetDismissed] = useState<boolean>(false);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.studyDurationMinutes) setStudyDurationMinutes(parsed.studyDurationMinutes);
        if (parsed.breakDurationMinutes) setBreakDurationMinutes(parsed.breakDurationMinutes);
        if (parsed.selectedPresetId) setSelectedPresetId(parsed.selectedPresetId);
        if (parsed.sessionsCompleted) setSessionsCompleted(parsed.sessionsCompleted);
      }
    } catch (e) {
      console.error('Failed to load pomodoro state:', e);
    }
  }, []);

  // Save changes to localStorage
  const saveState = useCallback(
    (studyM: number, breakM: number, preset: PomodoroPresetId, completed: number) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            studyDurationMinutes: studyM,
            breakDurationMinutes: breakM,
            selectedPresetId: preset,
            sessionsCompleted: completed,
          })
        );
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  // Countdown timer interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer reached 0:00 - trigger notification chime sound
          playChimeSound();

          // Switch mode
          if (mode === 'study') {
            setMode('break');
            const nextDuration = breakDurationMinutes * 60;
            setTotalDuration(nextDuration);
            return nextDuration;
          } else {
            setMode('study');
            const nextDuration = studyDurationMinutes * 60;
            setTotalDuration(nextDuration);
            setSessionsCompleted(c => {
              const updated = c + 1;
              saveState(studyDurationMinutes, breakDurationMinutes, selectedPresetId, updated);
              return updated;
            });
            return nextDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, studyDurationMinutes, breakDurationMinutes, selectedPresetId, saveState]);

  // Action: Select preset
  const selectPreset = useCallback((presetId: PomodoroPresetId) => {
    setSelectedPresetId(presetId);
    setIsRunning(false);
    setIsWidgetDismissed(false);

    let sMin = 60;
    let bMin = 10;

    if (presetId === '1h-10m') {
      sMin = 60;
      bMin = 10;
    } else if (presetId === '30m-5m') {
      sMin = 30;
      bMin = 5;
    } else {
      // Restore user's last custom configured times!
      sMin = customStudyMinutes;
      bMin = customBreakMinutes;
    }

    setStudyDurationMinutes(sMin);
    setBreakDurationMinutes(bMin);
    setMode('study');
    const newTotal = sMin * 60;
    setTotalDuration(newTotal);
    setTimeLeft(newTotal);
    saveState(sMin, bMin, presetId, sessionsCompleted);
  }, [customStudyMinutes, customBreakMinutes, sessionsCompleted, saveState]);

  // Action: Set custom durations & persist them forever
  const setCustomDurations = useCallback((studyMins: number, breakMins: number) => {
    const validStudy = Math.max(1, Math.min(180, studyMins));
    const validBreak = Math.max(1, Math.min(60, breakMins));

    // Save in dedicated custom storage
    setCustomStudyMinutes(validStudy);
    setCustomBreakMinutes(validBreak);
    try {
      localStorage.setItem(
        CUSTOM_STORAGE_KEY,
        JSON.stringify({ study: validStudy, break: validBreak })
      );
    } catch (e) {
      console.error('Failed to save custom pomodoro times:', e);
    }

    setStudyDurationMinutes(validStudy);
    setBreakDurationMinutes(validBreak);
    setSelectedPresetId('custom');
    setIsRunning(false);
    setIsWidgetDismissed(false);

    setMode('study');
    const newTotal = validStudy * 60;
    setTotalDuration(newTotal);
    setTimeLeft(newTotal);

    saveState(validStudy, validBreak, 'custom', sessionsCompleted);
  }, [sessionsCompleted, saveState]);

  // Timer controls
  const start = useCallback(() => {
    unlockAudioContext();
    setIsRunning(true);
    setIsWidgetDismissed(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    unlockAudioContext();
    setIsRunning(prev => {
      if (!prev) setIsWidgetDismissed(false);
      return !prev;
    });
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    const duration = (mode === 'study' ? studyDurationMinutes : breakDurationMinutes) * 60;
    setTimeLeft(duration);
    setTotalDuration(duration);
  }, [mode, studyDurationMinutes, breakDurationMinutes]);

  const skip = useCallback(() => {
    setIsRunning(false);
    if (mode === 'study') {
      setMode('break');
      const dur = breakDurationMinutes * 60;
      setTimeLeft(dur);
      setTotalDuration(dur);
    } else {
      setMode('study');
      const dur = studyDurationMinutes * 60;
      setTimeLeft(dur);
      setTotalDuration(dur);
    }
  }, [mode, studyDurationMinutes, breakDurationMinutes]);

  // Format time mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return {
    mode,
    timeLeft,
    totalDuration,
    isRunning,
    studyDurationMinutes,
    breakDurationMinutes,
    customStudyMinutes,
    customBreakMinutes,
    selectedPresetId,
    sessionsCompleted,
    isWidgetDismissed,
    setIsWidgetDismissed,
    start,
    pause,
    toggle,
    reset,
    skip,
    selectPreset,
    setCustomDurations,
    formatTime,
    progressPercent,
    testSound: playChimeSound,
  };
}

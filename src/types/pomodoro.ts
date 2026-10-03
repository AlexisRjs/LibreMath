export type PomodoroMode = 'study' | 'break';

export type PomodoroPresetId = '1h-10m' | '30m-5m' | 'custom';

export interface PomodoroPreset {
  id: PomodoroPresetId;
  name: string;
  studyMinutes: number;
  breakMinutes: number;
  description: string;
}

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  isRunning: boolean;
  studyDurationMinutes: number;
  breakDurationMinutes: number;
  selectedPresetId: PomodoroPresetId;
  sessionsCompleted: number;
}

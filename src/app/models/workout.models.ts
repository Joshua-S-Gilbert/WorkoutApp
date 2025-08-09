export type MuscleGroup = 'Back' | 'Chest' | 'Legs' | 'Arms' | 'Shoulders' | 'Core';

export interface Exercise{
  id:string;  //uuid
  name:string;
  group:MuscleGroup;
  notes?: string;
  isActive?:boolean;   // for catch-up logic
}

export interface SetLog{
  id:string;  //uuid
  exerciseId:string;
  reps:number;
  weight:number;  // kg by default cause we aren't animals
  rpe?:number;
  timestamp:number; 
}

export interface WorkoutSession{
  id:string; //uuid
  dateISO:string; // YYY-MM-DD
  exerciseIds: string[];  
  setLogs: SetLog[];
  notes?: string;
}

export interface AppState{
  units: 'metric' | 'imperial';
  exercises:Exercise[];
  sessions:WorkoutSession[];
  // quick cache for "today"
  todaySessionId?:string;
  lastUpdated:number;
}
import { computed, effect, Injectable, signal } from "@angular/core";
import { AppState, Exercise, SetLog, WorkoutSession } from "../models/workout.models";
import { StorageService } from "./storage.service";
import {v4 as uuid} from 'uuid';


function todayISO():string{
  return new Date().toISOString().slice(0,10);
}

const DEFAULT_STATE: AppState = {
  units: 'metric',
  exercises:[],
  sessions:[],
  todaySessionId:undefined,
  lastUpdated: Date.now(),
};

@Injectable({providedIn:'root'})
export class WorkoutStore{
  private state = signal<AppState>(DEFAULT_STATE);

  readonly units = computed(() => this.state().units);
  readonly exercises = computed(() => this.state().exercises);
  readonly sessions = computed(() => this.state().sessions);

  readonly today = computed<WorkoutSession | undefined>(() =>{
    const s = this.state();
    if (s.todaySessionId) return s.sessions.find(x => x.id === s.todaySessionId);
    return s.sessions.find(x => x.dateISO === todayISO());
  });

  readonly history = computed(() => {
    [...this.state().sessions].sort((a,b) => b.dateISO.localeCompare(a.dateISO))
  });

  private persistTimer: any;

  constructor(private storage: StorageService){
    // load saved state on bootstrap
    this.storage.load<AppState>().then(saved => {
      if (saved) this.state.set(saved);
      // ensure session exists for today
      this.ensureTodaySession();
    });

    effect(() => {
      const current = this.state();
      clearTimeout(this.persistTimer);
      this.persistTimer = setTimeout(() => {
        this.storage.save(current);
      }, 250);
    });

    
  }
  // updaters
  setUnits(units: 'metric'|'imperial'){
    this.patch({units, lastUpdated:Date.now() });
  }

  addExercise(data: Omit<Exercise, 'id'>){
    const ex:Exercise = {id: uuid(), ...data};
    const next=[...this.state().exercises, ex];
    this.patch({exercises:next, lastUpdated:Date.now()});
    return ex.id;
  }

  upsertTodaySet(setPartial: Omit<SetLog, 'id' | 'timestamp'>  & {timestamp?:number}){
    const s = this.ensureTodaySession();
    const setLog: SetLog = {
      id: uuid(),
      timestamp: setPartial.timestamp ?? Date.now(),
      ...setPartial,
    };
    const updatedSession:WorkoutSession = {
      ...s,
      setLogs: [...s.setLogs, setLog],
      exerciseIds: Array.from(new Set([...s.exerciseIds, setLog.exerciseId])),
    };
    this.replaceSession(updatedSession);
  }
  createSessionFor(dateISO:string){
    const session:WorkoutSession = {
      id: uuid(),
      dateISO,
      exerciseIds:[],
      setLogs:[],
    };
    const sessions = [...this.state().sessions, session];
    this.patch({sessions, todaySessionId: dateISO === todayISO() ? session.id : this.state().todaySessionId, lastUpdated:Date.now()});
    return session;
  }

  //helpers
  private ensureTodaySession():WorkoutSession{
    const dateISO = todayISO();
    const found = this.state().sessions.find(s => s.dateISO === dateISO);
    if (found) return found;
    return this.createSessionFor(dateISO);
  }

  private replaceSession(updated: WorkoutSession){
    const sessions = this.state().sessions.map(s => s.id === updated.id ? updated : s);
    this.patch({sessions, lastUpdated:Date.now()});
  }

  private patch(partial: Partial<AppState>){
    this.state.update(s => ({...s, ...partial}));
  }
}
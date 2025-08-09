import { Injectable } from "@angular/core";
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { get, set } from 'idb-keyval';

const STORAGE_KEY = "workout-tracker:v1";

@Injectable({providedIn: 'root'})
export class StorageService{
  private isNative = Capacitor.isNativePlatform();

  async load<T>(): Promise<T | null> {
    if (this.isNative){
      const {value} = await Preferences.get({key:STORAGE_KEY});
      return value ? JSON.parse(value) as T : null;
    } else {
      const val = await get(STORAGE_KEY);
      return (val ?? null) as T | null;
    }
  }

  async save<T>(data:T):Promise<void>{
    const payload = JSON.stringify(data);
    if (this.isNative){
      await Preferences.set({key:STORAGE_KEY, value:payload})
    } else {
      await set(STORAGE_KEY, data);
    }
  }
}
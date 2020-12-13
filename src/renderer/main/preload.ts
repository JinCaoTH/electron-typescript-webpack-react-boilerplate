import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	openSecondWindow: () => ipcRenderer.send('open-second-window')
});

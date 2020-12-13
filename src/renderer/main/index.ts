const h1 = document.createElement('H1');
h1.innerHTML = 'Hello World from main window！';
document.getElementById('root').appendChild(h1);
const button = document.createElement('button');
button.innerHTML = 'Open Second Window';
button.onclick = () => {
	console.log('open second window');
	window.electron.openSecondWindow();
};
document.getElementById('root').appendChild(button);

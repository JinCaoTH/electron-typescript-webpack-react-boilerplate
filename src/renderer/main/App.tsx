import React, { FC } from 'react';

export const App: FC = () => {
	const onClick = () => {
		window.electron.openSecondWindow();
	};
	return (
		<div>
			<h2>I am the main Window</h2>
			<h2>Click the button to open the second window</h2>
			<button onClick={onClick}>open second window</button>
		</div>
	);
};

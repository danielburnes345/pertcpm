import React from 'react';
import Pert from './pert.js';
//Code to import Budget.js
import Taskgen from './Taskgen';
// Add code to import the other components here under


import { AppProvider } from './AppContext';
const App = () => {
    return (
        <AppProvider>
            <div >
                <h1>PertCPM and Gantt Diagram generator</h1>
                    <div>
                        {
                            <Taskgen />
                            
                        }        

                           

                </div>
                <div>
                    {
                        <Pert />
                    }
                </div>

            </div>
        </AppProvider>
    );
};
export default App;
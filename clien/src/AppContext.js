import React, { createContext, useState, useEffect, useReducer } from 'react';

// Define your context
export const AppContext = createContext();

// Define your reducer function
export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasklist: [...state.tasklist, action.payload]
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasklist: state.tasklist.filter(task => task.text !== action.payload.text)
            };
        case 'SET_TASKLIST':
            
                state.tasklist = action.payload;
                state.loading = false;
                return {
                    ...state,
                };
        default:
            return state;
    }
};

// Create your provider component
export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, { tasklist: [],loading:true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/task');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                dispatch({ type: 'SET_TASKLIST', payload: data });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <AppContext.Provider value={{tasklist:state.tasklist, dispatch, loading:state.loading }}>
            {props.children}
        </AppContext.Provider>
    );
};
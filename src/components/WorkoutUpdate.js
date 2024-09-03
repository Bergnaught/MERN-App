import React, { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'

const WorkoutUpdate = ({ workoutId }) => {
    const { dispatch } = useWorkoutsContext()

    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    useEffect(() => {
        const fetchWorkout = async () => {
            const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`);
            const json = await response.json();

            if (response.ok) {
                setTitle(json.title);
                setLoad(json.load);
                setReps(json.reps);
            } else {
                setError('Failed to load workout data');
            }
        };

        fetchWorkout();
    }, [workoutId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const workout = { title, load, reps };

        const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
            method: 'PATCH',
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        } else {
            setError(null);
            console.log('Workout updated successfully:', json);
            dispatch({ type: 'UPDATE_WORKOUT', payload: json });
          }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Update Workout</h3>

            <label>Exercise Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Load (in kg):</label>
            <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className={emptyFields.includes('load') ? 'error' : ''}
            />

            <label>Number of Reps:</label>
            <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />

            <button>Update Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default WorkoutUpdate;

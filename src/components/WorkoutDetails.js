import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import WorkoutUpdate from "./WorkoutUpdate"

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()

  const [isEditing, setIsEditing] = useState(false);

  const handleClick = async () => {
    const response = await fetch('http://localhost:4000/api/workouts/' + workout._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  const updateClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <div className="icons">
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        <span className="material-symbols-outlined" onClick={updateClick}>edit</span>
      </div>
      {isEditing && (
        <WorkoutUpdate workoutId={workout._id} />
      )}
    </div>
  )
}

export default WorkoutDetails
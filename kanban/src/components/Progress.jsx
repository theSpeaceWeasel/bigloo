/* eslint-disable react/prop-types */


const Progress = ({ progress }) => {
  return (
    <div className="progress-display">
      <div className="progress-bar">
        <div className="progress-indicator" style={progress ? { width: `${progress}%` } : { width: 0 }}></div>
      </div>
    </div>
  )
}

export default Progress
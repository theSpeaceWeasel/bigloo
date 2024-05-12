/* eslint-disable react/prop-types */


const Progress = ({ progress }) => {
  let color

  if (progress >= 100) {
    color = 'rgb(0, 128, 0)';
  } else if (progress >= 50) {
    color = 'rgb(0, 0, 255)';
  } else if (progress >= 20 && progress < 50) {
    color = 'rgb(255, 255, 0)';
  } else {
    color = 'rgb(255, 0, 0)';
  }


  return (
    <div className="progress-display">
      <div className="progress-bar">
        <div className="progress-indicator" style={progress ? { width: `${progress}%`, backgroundColor: color } : { width: 0 }}></div>
      </div>
    </div>
  )
}

export default Progress
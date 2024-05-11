  export const getColor = (status) => {
    let color;
    switch(status){
      case 'done':
        color="rgb(186,255,201)"
        break
      case 'working':
        color="rgb(255,223,186)"
        break
     case 'stuck':
        color="rgb(255,179,186)"
        break  
      default:
        color="rgb(186,225,255)"
           
    }
    return color
  }
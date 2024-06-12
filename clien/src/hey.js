while(aux){
    let y =0;
    console.log(aux);
    if(aux.next){
      
      aux.next.forEach((link)=>{
        if(y==0){
        divs.push(<div class="line" style={{left:`${x-70}px`,top:`${y+25}px`,width:`${k}px`}} ></div>);
        } else {
          let x1=x,x2=x-100,y1=y,y2=0;
          divs.push(<div class="line" style={{
            position: 'absolute',
            left: `${x1+30}px`,
            top: `${y1+40}px`,
            zIndex =-1,
            width: `${Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))}px`, // Calculate the distance between points
            height: '0px', // Adjust line thickness as needed
            backgroundColor: 'black',
            transformOrigin: 'top left',
            transform: `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`, // Calculate the angle of rotation
          }} ></div>)
        }
        divs.push(<div class="node" style={{left:`${x}px`,top:`${y}px`}}>{link.id}</div>);
        
        y=y+50;
      })
    
  }
  aux = aux.next[0];
  x=x+k;
  //console.log(aux);  
  }
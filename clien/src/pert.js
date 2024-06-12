
import React, { useState, useContext } from "react";
import { AppContext } from './AppContext';
import './style.css';
import jStat from 'jStat';
class Node {
  constructor(id,duration,ot,mt,pt) {
    this.id = id;
    this.duration =duration;
    this.next = [];
    this.prev = [];
    this.pt = pt;
    this.ot = ot;
    this.es = 0;
    this.ef = 0;
    this.ls = 0;
    this.lf = 0;
    this.et = (ot + (4 * mt) + pt)/6
  }
}

class NodeTree {
  constructor() {
    this.vari =0;
    this.nodes = {};
  }
  
  append(id, prevIds,duration,ot,mt,pt) {
    //este codigo agrega un nodo, solo requiere de los nodos predecesores y de esa forma apunta hacia los nodos hacia adelante y hacia atras
    const newNode = new Node(id,duration,ot,mt,pt);
    this.nodes[id] = newNode;
    prevIds.forEach(prevId=> {
      if(this.nodes[prevId]){
        newNode.prev.push(this.nodes[prevId])
        this.nodes[prevId].next.push(newNode);
      }
    })
    this.pile = [newNode]
    if(!this.first){
      this.first = newNode; //primer nodo del arbol
    }
    //look for first node
    this.pile = [] 
    this.pile.push(this.first);
    this.forward();
    this.pile = [] 
    this.pile.push(this.last);
    this.backward();
  }
  forward(){
    
    if(this.pile.length===0){
      
    } else {
      let aux = this.pile[0];
      aux.next.forEach(node =>{
        this.pile.push(node);
      }
      )
      if(aux.prev.length === 0){
        aux.es = 0;
        aux.ef = aux.duration;
      }else{
        let maxes = 0;
        aux.prev.forEach(p => {
          if(Number(p.ef) > Number(maxes)){
            maxes = p.ef;
          }
        })
        aux.es = maxes;
        aux.ef = Number(maxes) + Number(aux.duration);
      } 
      this.last = this.pile[0];
      this.prduration = this.last.ef;
      this.pile.shift();
      this.forward();
    }
  }
  backward(){
    if(this.pile.length===0){

    } else {
      let aux = this.pile[0];
      aux.prev.forEach(node =>{
        this.pile.push(node);
      }
      )
      if(aux.next.length === 0){
        aux.lf = this.prduration;
        aux.ls = aux.lf - aux.duration;
      }else{
        let mines = aux.next[0].ls;
        aux.next.forEach(p => {
          if(Number(p.ls) < Number(mines)){
            mines = p.ls;
          }
        })
        aux.lf = mines;
        aux.ls = Number(aux.lf) - Number(aux.duration);
      }
      if(aux.lf===aux.ef){
        this.vari += Math.pow((Number(aux.pt)-Number(aux.ot))/6,2)
        console.log(aux.ot+"bitchSW"+aux.pt)
      }
      this.pile.shift();
      this.backward();
    }
  }
  
  display() {
    Object.values(this.nodes).forEach(node => {
      console.log(`Node ${node.id} has next nodes with ids:`, node.next.map(nextNode => nextNode.id));
      //console.log(`Node ${node.id} has ef of ${node.ef}`);
      //console.log(`Node ${node.id} has lf of ${node.lf}`);
    });
  }
}
function Pert(){
const tree = new NodeTree();
const { tasklist, dispatch, loading } = useContext(AppContext);
const [Prob, setProb] = useState(0);
const [Pr,setPr]  = useState(0);
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the value of the input element with id "prob"
  const probValue = parseFloat(document.getElementById("prob").value);

  // Update the state with the new value
  setProb(probValue);

  // Calculate Pr using the updated value of Prob
  const newPr = (probValue - tree.prduration) / Math.sqrt(tree.vari);
  setPr(jStat.normal.pdf(newPr, 0, 1));
  
  console.log(tree.vari + "he"); // Log the updated value of Pr
}
function generatePert(){
  tasklist.forEach((task)=>{
    tree.append(task.id,task.preid,task.time,task.ot,task.mt,task.pt);
  })
  let aux = tree.nodes[1];
  const k = 100;
  const divs = [];
  
  let x= k;
  let y = 0;
  let pile = [aux];
  let pile2 = []
  let pile3 = {}
  let pos={}
  while (pile.length > 0) {
    const aux = pile.shift(); // Take the first node from the pile
    
    // Check if the node has not been visited
    if (!pile3[aux.id]) {
        // Draw the node
        divs.push(<div className="node" style={{ left: `${x}px`, top: `${y}px` }}>{aux.id}:{aux.es},{aux.ef},{aux.ls},{aux.lf}</div>);
        pos[aux.id]= [x,y];
        console.log("x")
        // Mark the node as visited
        pile3[aux.id] = true;

        // Update y coordinate for the next node
        y += 100;

        // Add the forward nodes to the pile2
        if (aux.next) {
            aux.next.forEach(node => {
                pile2.push(node);
                console.log("a"+node.id)
            });
        }

        // If the pile is empty, update x coordinate and reset y coordinate
        

    }
    if (pile.length === 0) {
      pile = pile2;
      pile2 = [];
      y = 0;
      x += 100;
  }
}
  aux = tree.nodes[1];
  pile = [aux];
  while(aux){
    if(pile.length===0){
      
    } else {
      let aux = pile[0];
      
      aux.next.forEach(node =>{
        pile.push(node);
        let doted = 'dashed';
        if(node.lf-node.ef ===0){
          doted = 'solid'
        }
        divs.push(<div class="line" style={{
          position: 'absolute',
          left: `${pos[aux.id][0]+30}px`,
          top: `${pos[aux.id][1]+30}px`,
          width: `${Math.sqrt(Math.pow(pos[node.id][0] - pos[aux.id][0], 2) + Math.pow(pos[node.id][1] - pos[aux.id][1], 2))-30}px`, // Calculate the distance between points
          height: '0px', // Adjust line thickness as needed
          border: `1px ${doted} black`,
          zIndex:-1,
          transformOrigin: 'top left',
          transform: `rotate(${Math.atan2(pos[node.id][1] - pos[aux.id][1],pos[node.id][0] - pos[aux.id][0])}rad)`, // Calculate the angle of rotation
        }} ></div>)
      }
      )
      
    }
    pile.shift();
    aux = pile[0];
  }
  tree.display();
  return divs;
}
return (
  <div>
  
    <div class="container" >{loading ? (
      <div>Loading...</div>
    ) : (generatePert())}</div>
    <form onSubmit={handleSubmit}>
    <input type="number" id="prob" placeholder="Enter the probability to calculate"></input>
    <button type="submit">Calculate</button>
    </form>
    <div><div><div>Average time to finish project: {tree.prduration}</div><div>Probability to finish in {Prob}: {Pr}</div></div></div>
    </div>
      
);
}

export default Pert;
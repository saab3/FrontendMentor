import { useState } from 'react'
import './App.css'
import { Stage, Layer, Circle, Line, Group } from 'react-konva';



function App() {
  const offsetX = -500;
  const offsetY = 400;


  const [player1, setPlayer1] = useState(true)
  // actually played
  const [circles, setCircles] = useState([])
  // to be played
  const [position, setPosition] = useState()
  // set column
  const [col, setCol] = useState()
  const [win , setWin] = useState(false)
  
  //               ROWS             COLUMNS
  let map  = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]

  let board = [[0 , 0 , 0 , 0 , 0 , 0 , 0],
               [0 , 0 , 0 , 0 , 0 , 0 , 0],
               [0 , 0 , 0 , 0 , 0 , 0 , 0],
               [0 , 0 , 0 , 0 , 0 , 0 , 0],
               [0 , 0 , 0 , 0 , 0 , 0 , 0],
               [0 , 0 , 0 , 0 , 0 , 0 , 0]
             ]

  const [gameBoard, setGameBoard] = useState(board)
  
  function reset(){
   setCircles([])
   setPlayer1(true)
   setCol()
   setWin(false) 
   setGameBoard([[0 , 0 , 0 , 0 , 0 , 0 , 0],
                [0 , 0 , 0 , 0 , 0 , 0 , 0],
                [0 , 0 , 0 , 0 , 0 , 0 , 0],
                [0 , 0 , 0 , 0 , 0 , 0 , 0],
                [0 , 0 , 0 , 0 , 0 , 0 , 0],
                [0 , 0 , 0 , 0 , 0 , 0 , 0]])
  }

  function updateGameSlots(row,col) {
    // Replace state elements with the new value 
    const nextBoard = gameBoard.map((elem, i) => {
      if (i === row - 1) {
        switch (player1) {
          case true:
            elem[col-1] = 1
            setPlayer1(!player1)
            break
          case false:
            elem[col-1] = 2
            setPlayer1(!player1)
            break
          }
          return elem ;        
          } else {
            return elem;
      }
    });
    setGameBoard(nextBoard)
    // console.log(gameBoard)
  }
  
  // coords conversion
  function rowToY(row){
    let y = row * 50 - 25
    return y
  }

  function colToX(col){
    let x = col * 50 - 25 
    return x
  }

  function placeDisk(){
    for(let i = 0 ; i < gameBoard.length ; i++) {
        if (gameBoard[i][col-1] == 0){
          let row = i + 1
          updateGameSlots(row,col)
          checkWin(row)
          putCircle(colToX(col),rowToY(row))
          return
      }
    }
  }

  function checkWin(row){
    let currentRow = row -1
    let currentCol = col - 1 
    let scoreHz = {1:1 , 
                 2:1}
    let scoreVl = {1:1 , 
                 2:1}
    let scoreDR = {1:1 , 
                 2:1}
    var checkedCell
    if(player1){
      checkedCell = 1
    }else{
      checkedCell = 2
    }

    function checkHz(dx,c) {
      const step = c - 1;
      // check x +ve
      if( currentCol + dx <= 6){
        if(gameBoard [currentRow ] [currentCol + dx] == checkedCell && gameBoard [currentRow ] [currentCol + 1] == checkedCell){
          if (step > 0) {
            scoreHz[checkedCell] ++
            // console.log("score X UP",scoreHz[checkedCell])
            checkHz(dx + 1,step);
          }
        }
      }
        // check x -ve
      if(currentCol - dx >= 0 ){
        if(gameBoard [currentRow] [currentCol - dx] == checkedCell && gameBoard [currentRow] [currentCol - 1] == checkedCell){
          if (step > 0) {
              scoreHz[checkedCell] ++
              // console.log("score X UP" , scoreHz[checkedCell])
              checkHz(dx+1,step);
          }
        }
      }
      // check y -ve
      if(currentRow - dx >= 0){
        if(gameBoard [currentRow - dx ] [currentCol] == checkedCell){
          if (step > 0) {
            scoreVl[checkedCell] ++
            console.log("Vertical match",scoreVl)
            checkHz(dx + 1,step);
          }
        }
      }

      // check Diagonal right down
      if(currentRow - dx >= 0 && currentCol - dx >= 0){
        if(gameBoard [currentRow - dx ] [currentCol - dx] == checkedCell){
          if (step > 0) {
            scoreDR[checkedCell] ++
            console.log("Diagonal match",scoreDR)
            checkHz(dx + 1,step);
          }
        }
      }
    }

    checkHz(1,4)

    if(scoreHz[checkedCell] >= 4 || scoreVl[checkedCell] >= 4 || scoreDR[checkedCell] >= 4){
      setWin(true)
      console.log(win)
    }
  }

  // game flow
  function play(){
    placeDisk()
  }

  // for pointer disk
  function updatePosition(e){
    var color
    var shadowColor
    {player1  ? color = '#DC3535' : color = "#F49D1A"}
    {player1  ? shadowColor = '#DC3535' : shadowColor = "#FFE15D"}
    let mouseX = e.evt.layerX + offsetX,
             Y = 335,
          xCal = (Math.floor(mouseX/50)+1)*50 - 25
    
    if (xCal <= 350 && xCal >= 0){
      setPosition({
        x:  xCal,
        y:  Y,
        radius: 20,
        stroke: color,
        strokeWidth: 4,
        shadowColor: shadowColor,
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.5
      })
      setCol((xCal+25)/50)
    }
  }

  // to Drow a disk
  function putCircle(x,y){
    var color
    var shadowColor
    {player1  ? color = '#DC3535' : color = "#F49D1A"}
    {player1  ? shadowColor = '#DC3535' : shadowColor = "#FFE15D"}
    
    setCircles((prevCircles) => [
      ...prevCircles,
      {
        x:  x,
        y:  y,
        radius: 20,
        stroke: color,
        strokeWidth: 4,
        shadowColor: shadowColor,
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.5
      }
    ]);
  }

  return (
    <div className="App" id='stage-parent'>
      <div>
          <button onClick={reset} style={{"border":"solid 1px white"}}>Reset</button>
      </div>
      <div className="game">
        <Stage width={visualViewport.width} 
              height={visualViewport.height*.7} 
              onClick= {play} 
              onMouseMove={updatePosition}  
              scaleY={-1}  
              offsetX={offsetX} 
              offsetY={offsetY}>
          <Layer>
            <Group >
              <Circle {...position}/>
              {circles.map((shape) => (
                <Circle {...shape} />
              ))}
            </Group>
    {/* Grid Layer */}
          <Group >
            {map[1].map((s,i) =>(
              <Line
                key={i}
                x={50*(i)}
                y={0}
                points={[0, 0, 0, 300]}
                tension={0}
                stroke="white"
                shadowColor='#6ECCAF'
                shadowBlur = '5'
                shadowOpacity = '.8'
              />
            ))}
            {map[0].map((s,i) =>(
              <Line
                key={i}
                x={0}
                y={50*(i)}
                points={[0, 0, 350, 0]}
                tension={0}
                stroke="white"
                shadowColor='#6ECCAF'
                shadowBlur = '5'
                shadowOpacity = '.8'
              />
            ))}
            </Group>
            </Layer>
        </Stage>
      </div>
      <div class="attribution">
          Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
          Coded by <a href="#">Mahmoud Sabea</a>.
      </div>
      {(win) &&
        <div className='game-over' style={{position:'absolute',
                                          top:0,
                                          right:0,
                                          display:'flex',
                                          justifyContent:'center',
                                          alignItems:'center',
                                          flexDirection: 'column'
        }}>
          <h1 style={{background:"none",fontSize: 50}}>
            Game Over
            Player {(player1? '1' : '2')} win
          </h1>
          <button onClick={reset} style={{border:"solid 1px white",
                                          background:'none',
                                          width: 200 +'px',
                                          height: 50 + 'px'
        }}>Reset</button>
        </div> }
    </div>
  )
}

export default App

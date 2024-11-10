import { validate } from "uuid";
import { PlayArea, PlayerPos } from "./types/game.types";

const NUMBER_OF_ROWS = 6;
const NUMBER_OF_COLS = 6;

const NUMBER_OF_OBSTRUCTIONS = 2;


const generateGrid = (rows : number , cols : number ): number[][] => {
    return Array.from( { length : rows }, () => Array(cols).fill(0) )
}


// generates n random points in grid
const generateRandomPoints = (rows: number, cols: number, n: number): [number, number][] => {
    const points = new Set<string>();
    const result: [number, number][] = [];

    while (points.size < n) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const pointKey = `${row},${col}`;

        if (!points.has(pointKey)) {
            points.add(pointKey);
            result.push([row, col]);
        }
    }

    return result;
}

const generateRandomPointsInHalf = ( rows: number, cols: number, n: number, leftHalf: boolean ): [number, number][]  => {
    const points = new Set<string>();
    const result: [number, number][] = [];
  
    const colLimit = leftHalf ? Math.floor(cols / 2) : cols;
  
    while (points.size < n) {
      const row = Math.floor(Math.random() * rows);
      const col = leftHalf
        ? Math.floor(Math.random() * Math.floor(cols / 2))
        : Math.floor(Math.random() * Math.ceil(cols / 2)) + Math.floor(cols / 2);
  
      const pointKey = `${row},${col}`;
      if (!points.has(pointKey)) {
        points.add(pointKey);
        result.push([row, col]);
      }
    }
  
    return result;
}

const generateRandomPlayArea = (numberOfTanks : number): PlayArea => {

    let grid = generateGrid( NUMBER_OF_ROWS , NUMBER_OF_COLS )

    const genPoints = generateRandomPoints( NUMBER_OF_ROWS, NUMBER_OF_COLS ,NUMBER_OF_OBSTRUCTIONS )

    // marked obstacles as 2 
    genPoints.forEach(
        ([row , col]) => {
            grid[row][col] = 2;
        }
    )

    // get player tank pos

    const playerPos: PlayerPos = {
        playerAPos: generateRandomPointsInHalf(NUMBER_OF_ROWS, NUMBER_OF_COLS, numberOfTanks, true ),
        playerBPos: generateRandomPointsInHalf(NUMBER_OF_ROWS , NUMBER_OF_COLS , numberOfTanks, false )
    }

    // update grid todo:
    playerPos.playerAPos.forEach(
        ([row, col]) =>{
            grid[row][col] = 1
        }
    )

    // update B pos 
    playerPos.playerBPos.forEach(
        ([row, col]) => {
            grid[row][col] = 1
        }
    )

    const playArea: PlayArea = {
        grid: grid, 
        playerpos: playerPos
    }

    return playArea

}
const validPlayArea = (playArea : PlayArea): boolean => {
    //TODO: write some validations 
    return true
}

export const generatePlayArea = (numberOfTanks : number): PlayArea => {

    let playArea = generateRandomPlayArea(numberOfTanks)

    while(!validPlayArea(playArea)) {
        playArea = generateRandomPlayArea(numberOfTanks)
    }
    return playArea
}
//Required Modules
import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';

//Functions
//readmore
const readMore = String.fromCharCode(8206).repeat(4001)

//random pick from list
function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}

//delay before performing any action or task
const delay = time => new Promise(res => setTimeout(res, time))


//Exporting
export {
  readMore,
  pickRandom,
  delay
}
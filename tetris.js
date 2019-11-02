const canvas = document.getElementById('guiTetris');
const canvas_next_elem = document.getElementById('nextFigure');
const context = canvas.getContext('2d');
const context_next = canvas_next_elem.getContext('2d');
const audio_fall = new Audio('fall.wav');
const audio_line = new Audio('line.wav');
//Цвет Фона
context.scale(20,20);
context_next.scale(20,20);
function arenaSweep(){
	outer: for(let y = arena.length - 1; y > 0; --y){
		for(let x = 0; x < arena[y].length; ++x)
			if(arena[y][x] === 0) 
				continue outer;
		const row = arena.splice(y,1)[0].fill(0);
		arena.unshift(row);
		++y;
		audio_line.play();
	}	
}

//Фигура
/*const matrix = [
[0,0,0],
[1,1,1],
[0,1,0],
];*/
//Возможно ли заимодействие по Y
function collide(arena,player) {
	const m = player.matrix;
	const o = player.pos;
	//const [m,o] = [player.matrix, player.pos];
	for( let y =0; y < m.length; ++y) {
		for(let x=0;x< m[y].length;++x){
			if(m[y][x] !== 0 && (arena[y+ o.y] && arena[y+o.y][x+ o.x]) !== 0) 
				return true;
			
		}
	}
	return false;
}

function createMatrix(w,h){
	const matrix = [];
	while(h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix; 
}

function createPiece(type){
	
	if(type === 'T')
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0],
		];
	else if(type === 'O') 
		return [
			[2,2],
			[2,2],
			
		];
	else if(type === 'L')
		return [
			[0,3,0],
			[0,3,0],
			[0,3,3],
		];
	else if(type === 'J')
		return [
			[0,4,0],
			[0,4,0],
			[4,4,0],
		];
	else if(type === 'I')
		return [
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
		];
	else if(type === 'S')
		return [
			[0,6,6],
			[6,6,0],
			[0,0,0],
		];
	else if(type === 'Z')
		return [
			[7,7,0],
			[0,7,7],
			[0,0,0],
		];
}

//Рисуем фигуру
function draw() {
	context.fillStyle = '#000';
	context.fillRect(0,0,canvas.width,canvas.height);
	
	
	
	drawMatrix(arena, {x:0,y:0});
	drawMatrix(player.matrix,player.pos);
	/*
	context_next.fillStyle = '#FFFFFF';
	context_next.fillRect(0,0,canvas.width,canvas.height);
	drawMatrix_NEXT(player.matrix,{x:2,y:1});*/
}
function drawMatrix(matrix, offset){
matrix.forEach((row , y) => {
	row.forEach((value, x) => {
		if(value !==0) {
			context.fillStyle = colors[value];
			context.fillRect(x + offset.x,y + offset.y,1,1);
		}
	});
});
}
function drawMatrix_NEXT(matrix, offset){
matrix.forEach((row , y) => {
	row.forEach((value, x) => {
		if(value !==0) {
			context_next.fillStyle = colors[value];
			context_next.fillRect(x + offset.x,y + offset.y,1,1);
		}
	});
});
}
//Отмечаем в массиве позицию элемента 
function merge(arena,player){
	player.matrix.forEach((row,y) => {
		row.forEach((value,x) => {
			if(value !== 0){
				arena[y+player.pos.y][x+player.pos.x] = value;
			}
		});
	});
}
function playerDrop()
{
	player.pos.y++;
	if(collide(arena,player))
	{
		player.pos.y--;
		merge(arena,player);
		playerReset();
		arenaSweep();
		audio_fall.play();
	}
	dropCounter=0;
}
function playerMove(dir)
{
	player.pos.x += dir;
	if(collide(arena,player)) {
		player.pos.x -= dir;
	}
}
function playerReset(){
	context_next.fillStyle = '#FFFFFF';
	context_next.fillRect(0,0,canvas.width,canvas.height);
	
	//drawMatrix_NEXT(arena, {x:0,y:0});
	drawMatrix_NEXT(player.matrix,{x:2,y:1});
	const pieces = 'ILJOTSZ';
	player.matrix = createPiece(pieces[pieces.length*Math.random() | 0]);
	player.pos.y=0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
	if(collide(arena,player))
		arena.forEach(row => row.fill(0));
	
}
function playerRotate(dir){
	let offset = 1;
	rotate(player.matrix,dir);
	while(collide(arena,player)){
		player.pos.x += offset;
		offset = - (offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length) 
		{
			rotate(player.matrix,-dir);
			player.pos.x = pos;
			return;
		}
	}
}
function rotate(matrix, dir){
	for(let y=0;y<matrix.length;++y){	
		for(let x=0;x<y;++x){
			[matrix[x][y],matrix[y][x],] = [matrix[y][x],matrix[x][y],];
		}
			
	}
	if(dir > 0)
		matrix.forEach(row => row.reverse());
	else
		matrix.reverse();
}
//Обновление
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
function update(time = 0){
	const deltaTime = time - lastTime; 
	lastTime = time;
	//Перемещение обьекта
	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		playerDrop();
	}

	draw();
	requestAnimationFrame(update);
}

const colors = [
	null,
	'purple',
	'yellow',
	'orange',
	'green',
	'blue',
	'violet',
	'pink',
];
const arena = createMatrix(12,20);
//Обьект игрока
const player = {
	pos: {x: 5, y:5},
	matrix: createPiece('T'),
}
//Оброботка клавиш
document.addEventListener('keydown', event => {
	if(event.keyCode === 37)
		playerMove(-1);	
	else if(event.keyCode === 39)
		playerMove(1);
	else if(event.keyCode === 40 || event.keyCode === 32)
		playerDrop();
	else if(event.keyCode == 38)
		playerRotate(-1);
	//else if(event.keyCode == 87)
	//	playerRotate(1);
	
});

update();
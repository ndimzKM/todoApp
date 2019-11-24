/*try{
    const todos = document.querySelector('.todos');
    if(todos){
        console.log('there is a todo')
    }else{
        document.querySelector('.container').style.display = none;
        console.log('No todo')
    }
}catch{
    console.log('Some error')
}*/

const todos = document.querySelector('.todos');

let noTask = document.querySelector('.no-todo');
noTask.style.display = 'block';

if(todos){
    noTask.style.display = 'none'
}
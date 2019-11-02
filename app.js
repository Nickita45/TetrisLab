function store() {
    //localStorage["tetris.username"] = source.value;
    localStorage.setItem("tetris.username",document.getElementById("input1").value)    
}
function read() {
    document.getElementById("textname").innerText = "Имя:"+localStorage.getItem("tetris.username");
    //console.log(localStorage.getItem("tetris.username"))
}

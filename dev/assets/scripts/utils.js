String.prototype.startsWith = function(needle) {
  return(this.indexOf(needle) == 0);
};

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

String.prototype.removeAccents = function(){
  return this
    .replace(/[áàãâä]/gi,"a")
    .replace(/[éè¨ê]/gi,"e")
    .replace(/[íìïî]/gi,"i")
    .replace(/[óòöôõ]/gi,"o")
    .replace(/[úùüû]/gi, "u")
    .replace(/[ç]/gi, "c")
    .replace(/[ñ]/gi, "n")
    .replace(/[^a-zA-Z0-9]/g," ");
}
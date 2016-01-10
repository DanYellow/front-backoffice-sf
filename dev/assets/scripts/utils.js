String.prototype.startsWith = function(needle) {
  return(this.indexOf(needle) == 0);
};

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

module.exports = {
  pool: [],
  init: function (count) {
    let i = 0;
    while (i < count) {
      this.pool.push(i);
      i++;
    }
  },
  get: function () {
    const i = Math.floor(this.pool.length * Math.random());
    return this.pool.splice(i, 1)[0] || 0;
  },
};

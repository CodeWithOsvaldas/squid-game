const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

const getRandomInt = (from, to) => {
  const min = Math.ceil(from);
  const max = Math.floor(to);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { getRandomArbitrary, getRandomInt };

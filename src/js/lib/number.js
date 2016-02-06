import invariant from 'invariant';

export function clamp(input, min=0, max=1) {
  invariant(min <= max, `min (${min}) must be less than max (${max})`);
  return input < min ? min : (input > max ? max : input);
}

/**
 * Class representing a 2d location
 */
export class Vec {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  add(vec) {
    return new Vec(this.x + vec.x, this.y + vec.y);
  }
}

/**
 * This function converts all object values (except null and undefined) to
 * ints. If any conversions return NaN, the function throws
 */
export function getInts(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const itm = obj[key];
    if(itm === null || itm === undefined) {
      newObj[key] = itm;
      return;
    }
    const num_itm = Number.parseInt(itm);
    if(Number.isNaN(num_itm)) {
      throw new TypeError("Non-convertable value found");
    }
    newObj[key] = num_itm;
  });
  return newObj;
}


export function clamp(input, min=0, max=1) {
  if(!(min < max)) {
    throw new TypeError("min must be less than max")
  }
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

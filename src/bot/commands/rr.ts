import { createRandomRequestExecutor } from "./random-request";

const executor = createRandomRequestExecutor({
  atFront: false,
});

export default executor;

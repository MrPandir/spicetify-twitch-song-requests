import { createRandomRequestExecutor } from "./random-request";

const executor = createRandomRequestExecutor({
  atFront: true,
});

export default executor;

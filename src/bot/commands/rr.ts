import { createRandomRequestExecutor } from "./random-request";

const executor = createRandomRequestExecutor({
  atFront: false,
  requirePriorityPermission: false,
});

export default executor;

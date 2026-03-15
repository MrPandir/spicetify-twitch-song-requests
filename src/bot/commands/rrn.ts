import { createRandomRequestExecutor } from "./random-request";

const executor = createRandomRequestExecutor({
  atFront: true,
  requirePriorityPermission: true,
});

export default executor;

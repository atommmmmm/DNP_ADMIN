import * as actions from "./actions";
import System from "./components/SystemRoot";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

export default {
  mountPoint,
  rootPath,
  RootComponent: System,
  actions
};

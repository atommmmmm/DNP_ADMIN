import * as actions from "./actions";
import * as selectors from "./selectors";
import { PackagesRoot } from "./components/PackagesRoot";
import { PackageInterface } from "./components/PackageInterface";
import { PackagesList } from "./components/PackagesList";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

const components = {
  PackagesRoot,
  PackagesList,
  PackageInterface
};

export default {
  mountPoint,
  rootPath,
  RootComponent: PackagesRoot,
  actions,
  components,
  selectors
};

import { SkaffolderNode } from "../SkaffolderNode";

export class ModelRoot {
  /**
   * Create children list on node Model root
   */
  static execute(node: SkaffolderNode) {
    node.skaffolderObject.resources.forEach((element, index) => {
      node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "model_db", [index]));
    });
  }
}

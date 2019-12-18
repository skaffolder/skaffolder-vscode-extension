import { SkaffolderNode } from "../SkaffolderNode";

export class ModelRoot {
  static execute(node: SkaffolderNode) {
    node.skaffolderObject.resources.forEach((element, index) => {
      node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "model_db", [index]));
    });
  }
}

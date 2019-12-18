import { SkaffolderNode } from "../SkaffolderNode";

export class PageRoot {
  static execute(node: SkaffolderNode) {
    if (node.skaffolderObject.modules && node.skaffolderObject.modules.length > 0) {
      node.skaffolderObject.modules.forEach((element: any, index: number) => {
        node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "page_page", [index]));
      });
    } else {
      node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "page_page_not_found", []));
    }
  }
}

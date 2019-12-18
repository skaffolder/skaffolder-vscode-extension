import { SkaffolderNode } from "../SkaffolderNode";

export class PageRoot {
  /**
   * Create children list on node Page root
   */
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

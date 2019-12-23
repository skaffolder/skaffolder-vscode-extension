import * as vscode from "vscode";
import { SkaffolderObject } from "./SkaffolderObject";
import { Resource } from "./jsonreader/resource";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { PageRoot } from "./node/PageRoot";
import { PageNode } from "./node/PageNode";
import { PageApiNode } from "./node/PageApiNode";
import { PageNotFound } from "./node/PageNotFound";
import { ModelRoot } from "./node/ModelRoot";
import { ModelDbNode } from "./node/ModelDbNode";
import { ModelResourceNode } from "./node/ModelResourceNode";
import { ModelApiNode } from "./node/ModelApiNode";
import { ModelNotFound } from "./node/ModelNotFound";
import { Service } from "./jsonreader/service";
import { PageApiNotFound } from "./node/PageApiNotFound";

/**
 * Tree interface when in a Skaffolder project folder
 */
export class SkaffolderNode extends vscode.TreeItem {
  // Declare vars
  public children: SkaffolderNode[] = [];
  public params?: {
    db?: Db;
    model?: Resource;
    page?: Page;
    service?: Service;
    type?: string;
    contextUrl?: vscode.Uri;
    range?: vscode.Range;
  } = {};

  // Constructor
  constructor(
    public context: vscode.ExtensionContext,
    public readonly skaffolderObject: SkaffolderObject,
    type: string,
    indexMap: number[]
  ) {
    super("", vscode.TreeItemCollapsibleState.None);

    // Switch action by node type
    if (skaffolderObject !== undefined) {
      // Pages tree
      if (type === "page") {
        PageRoot.execute(this);
      } else if (type === "page_page") {
        PageNode.execute(this, indexMap);
      } else if (type === "page_page_api") {
        PageApiNode.execute(this, indexMap);
      } else if (type === "page_page_not_found") {
        PageNotFound.execute(this);
      } else if (type === "page_page_api_notfound") {
        PageApiNotFound.execute(this);
      }

      // Model tree
      else if (type === "model") {
        ModelRoot.execute(this);
      } else if (type === "model_db") {
        ModelDbNode.execute(this, indexMap);
      } else if (type === "model_db_resource") {
        ModelResourceNode.execute(this, indexMap);
      } else if (type === "api_db_resource_api") {
        ModelApiNode.execute(this, indexMap);
      } else if (type === "model_db_not_found") {
        ModelNotFound.execute(this);
      }
    }
  }
}

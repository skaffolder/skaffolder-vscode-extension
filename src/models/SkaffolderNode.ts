import * as vscode from "vscode";
import * as path from "path";
import { SkaffolderObject } from "./SkaffolderObject";
import { Entity } from "./jsonreader/entity";
import { Resource } from "./jsonreader/resource";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { Service } from "./jsonreader/service";
import { DataService } from "../services/DataService";
import { PageRoot } from "./node/PageRoot";
import { PageNode } from "./node/PageNode";
import { PageApiNode } from "./node/PageApiNode";
import { PageNotFound } from "./node/PageNotFound";
import { ModelRoot } from "./node/ModelRoot";
import { ModelDbNode } from "./node/ModelDbNode";
import { ModelResourceNode } from "./node/ModelResourceNode";
import { ModelApiNode } from "./node/ModelApiNode";
import { ModelNotFound } from "./node/ModelNotFound";

export class SkaffolderNode extends vscode.TreeItem {
  public children: SkaffolderNode[] = [];

  params?: {
    db?: Db;
    model?: Resource;
    page?: Page;
    type?: string;
    contextUrl?: vscode.Uri;
    range?: vscode.Range;
  } = {};

  constructor(
    public context: vscode.ExtensionContext,
    public readonly skaffolderObject: SkaffolderObject,
    type: string,
    indexMap: number[]
  ) {
    super("", vscode.TreeItemCollapsibleState.None);

    if (skaffolderObject !== undefined) {
      // Switch action
      // Pages tree
      if (type === "page") {
        PageRoot.execute(this);
      } else if (type === "page_page") {
        PageNode.execute(this, indexMap);
      } else if (type === "page_page_api") {
        PageApiNode.execute(this, indexMap);
      } else if (type === "page_page_not_found") {
        PageNotFound.execute(this);
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

import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";
import * as vscode from "vscode";
import { SkaffolderObject } from "./SkaffolderObject";

export class SkaffolderNode extends vscode.TreeItem {
  constructor(
    public readonly skaffolderObject: SkaffolderObject,
    type: string,
    indexMap: number[]
  ) {
    super("", vscode.TreeItemCollapsibleState.None);

    if (type === "api") {
      this.skaffolderObject.resources.forEach((element, index) => {
        this.children.push(
          new SkaffolderNode(skaffolderObject, "api_db", [index])
        );
      });
    } else if (type === "api_db") {
      // Set db
      this.label = this.skaffolderObject.resources[indexMap[0]].name;
      this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;

      // Find children
      this.skaffolderObject.resources[indexMap[0]]._resources.forEach(
        (element, index) => {
          let indexArr: number[] = [indexMap[0], index];
          this.children.push(
            new SkaffolderNode(skaffolderObject, "api_db_resource", indexArr)
          );
        }
      );
    } else if (type === "api_db_resource") {
      // Set resource
      this.label = this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ].name;
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

      // Find children
      this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ]._services.forEach((element, index) => {
        let indexArr: number[] = [indexMap[0], indexMap[1], index];
        this.children.push(
          new SkaffolderNode(skaffolderObject, "api_db_resource_api", indexArr)
        );
      });
    } else if (type === "api_db_resource_api") {
      // Set api
      this.label = this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ]._services[indexMap[2]].name;
    }

    if (type === "model") {
      this.skaffolderObject.resources.forEach((element, index) => {
        this.children.push(
          new SkaffolderNode(skaffolderObject, "model_db", [index])
        );
      });
    } else if (type === "model_db") {
      // Set db
      this.label = this.skaffolderObject.resources[indexMap[0]].name;
      this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;

      // Find children
      this.skaffolderObject.resources[indexMap[0]]._resources.forEach(
        (element, index) => {
          let indexArr: number[] = [indexMap[0], index];
          this.children.push(
            new SkaffolderNode(skaffolderObject, "model_db_resource", indexArr)
          );
        }
      );
    } else if (type === "model_db_resource") {
      // Set resource
      this.label = this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ].name;
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

      // Find children
      this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ]._entity._attrs.forEach((element, index) => {
        let indexArr: number[] = [indexMap[0], indexMap[1], index];
        this.children.push(
          new SkaffolderNode(
            skaffolderObject,
            "model_db_resource_attr",
            indexArr
          )
        );
      });
    } else if (type === "model_db_resource_attr") {
      // Set attr
      this.label = this.skaffolderObject.resources[indexMap[0]]._resources[
        indexMap[1]
      ]._entity._attrs[indexMap[2]].name;
    }
  }

  public children: SkaffolderNode[] = [];
}

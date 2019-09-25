import * as vscode from "vscode";
import * as path from "path";
import { SkaffolderObject } from "./SkaffolderObject";
import { Entity } from "./jsonreader/entity";
import { Resource } from "./jsonreader/resource";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { Service } from "./jsonreader/service";
import { DataService } from "../services/DataService";

export class SkaffolderNode extends vscode.TreeItem {
  params?: {
    db?: Db;
    model?: Resource;
    page?: Page;
    type?: string;
    contextUrl?: vscode.Uri;
    range?: vscode.Range;
  } = {};

  constructor(
    private context: vscode.ExtensionContext,
    public readonly skaffolderObject: SkaffolderObject,
    type: string,
    indexMap: number[]
  ) {
    super("", vscode.TreeItemCollapsibleState.None);

    if (skaffolderObject !== undefined) {
      // Switch action
      // Pages tree
      if (type === "page") {
        this.showPageRoot(context, skaffolderObject);
      } else if (type === "page_page") {
        this.showPage(context, skaffolderObject, indexMap);
      } else if (type === "page_page_api") {
        this.showPageApi(indexMap);
      } else if (type === "page_page_not_found") {
        this.showPageNotFound();
      }

      // Model tree
      else if (type === "model") {
        this.showModelRoot(context, skaffolderObject);
      } else if (type === "model_db") {
        this.showDbModel(indexMap, context, skaffolderObject);
      } else if (type === "model_db_resource") {
        this.showDbResource(indexMap, context, skaffolderObject);
      } else if (type === "api_db_resource_api") {
        this.showApi(indexMap);
      } else if (type === "model_db_not_found") {
        this.showModelsNotFound();
      }

      // } else if (type === "api") {
      //   this.showApiRoot(context, skaffolderObject);
      // } else if (type === "api_db") {
      //   this.showDb(indexMap, context, skaffolderObject);
      // } else if (type === "api_db_resource") {
      //   this.showResource(indexMap, context, skaffolderObject);
      // } else if (type === "model_db_resource_attr_menu") {
      //   this.showAttribute(indexMap, context, skaffolderObject);
      // } else if (type === "model_db_resource_api_menu") {
      //   this.showApiResource(indexMap, context, skaffolderObject);
      // } else if (type === "model_db_resource_attr") {
      //   this.showAttributeResource(indexMap);
    }
  }

  public children: SkaffolderNode[] = [];

  showPageNotFound() {
    this.label = "No pages found";
    this.contextValue = "empty";
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }

  showModelsNotFound() {
    this.label = "No models found";
    this.contextValue = "empty";
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }

  private showDbResource(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set resource
    let db = this.skaffolderObject.resources[indexMap[0]];
    let resource = db._resources[indexMap[1]];
    this.label = resource.name;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "model.svg")
      ),
      dark: this.context.asAbsolutePath(path.join("media", "dark", "model.svg"))
    };
    this.contextValue = "model";

    // Set params node
    this.params = {
      type: "resource",
      db: db,
      model: resource,
      range: resource.index
    };

    // Find children
    if (resource._services && resource._services.length > 0) {
      resource._services.forEach((element, index) => {
        let indexArr: number[] = [indexMap[0], indexMap[1], index];
        this.children.push(
          new SkaffolderNode(
            context,
            skaffolderObject,
            "api_db_resource_api",
            indexArr
          )
        );
      });
    } else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
  }

  private showDbModel(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set db
    let db = this.skaffolderObject.resources[indexMap[0]];
    this.label = db.name;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "database.svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "database.svg")
      )
    };

    this.params = {
      type: "db",
      db: db,
      range: db.index
    };

    // Find children
    db._resources.forEach((element, index) => {
      let indexArr: number[] = [indexMap[0], index];
      this.children.push(
        new SkaffolderNode(
          context,
          skaffolderObject,
          "model_db_resource",
          indexArr
        )
      );
    });

    // Menu model
    // let indexArr: number[] = [indexMap[0], indexMap[1]];

    // this.children.push(
    //   new SkaffolderNode(
    //     context,
    //     skaffolderObject,
    //     "model_db_resource_attr_menu",
    //     indexArr
    //   )
    // );

    // this.children.push(
    //   new SkaffolderNode(
    //     context,
    //     skaffolderObject,
    //     "model_db_resource_api_menu",
    //     indexArr
    //   )
    // );
  }

  private showModelRoot(
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    this.skaffolderObject.resources.forEach((element, index) => {
      this.children.push(
        new SkaffolderNode(context, skaffolderObject, "model_db", [index])
      );
    });
  }

  private showPageApi(indexMap: number[]) {
    // Set api
    let apiPage = this.skaffolderObject.modules[indexMap[0]]._services[
      indexMap[1]
    ] as Service;

    // Find api
    let api: Service = DataService.findApi(apiPage._id) as Service;
    let resource: Resource = DataService.findResource(
      (api._resource as Resource)._id
    ) as Resource;

    // Find db api
    let db;
    let dbId = (api._resource as Resource)._db;
    this.skaffolderObject.resources.forEach(item => {
      if (item._id === dbId) {
        db = item;
      }
    });

    this.label = resource.name + "." + api.name;
    this.description = api.method;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "api_" + api.method + ".svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "api_" + api.method + ".svg")
      )
    };
    this.params = {
      type: "resource",
      db: db,
      model: resource,
      range: api.index
    };
  }

  private showApi(indexMap: number[]) {
    // Set api

    let db = this.skaffolderObject.resources[indexMap[0]];
    let model = db._resources[indexMap[1]];
    let api = model._services[indexMap[2]];
    this.label = api.name;
    this.description = api.method;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join(
          "media",
          "light",
          "api_" +
            this.skaffolderObject.resources[indexMap[0]]._resources[indexMap[1]]
              ._services[indexMap[2]].method +
            ".svg"
        )
      ),
      dark: this.context.asAbsolutePath(
        path.join(
          "media",
          "dark",
          "api_" +
            this.skaffolderObject.resources[indexMap[0]]._resources[indexMap[1]]
              ._services[indexMap[2]].method +
            ".svg"
        )
      )
    };
    this.params = {
      type: "resource",
      db: db,
      model: model,
      range: api.index
    };
  }

  private showPage(
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject,
    indexMap: number[]
  ) {
    let page: Page = this.skaffolderObject.modules[indexMap[0]];
    this.label = page.name;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "database.svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "database.svg")
      )
    };
    let contexturl = vscode.Uri.file(
      vscode.workspace.rootPath + "/openapi.yaml"
    );
    let rangeModel = page.index;
    // this.command = {
    //   command: "skaffolder.openpage",
    //   title: "Open SKfile Page",
    //   arguments: [
    //     contexturl,
    //     rangeModel,
    //     page
    //   ]
    // };
    this.params = {
      type: "module",
      contextUrl: contexturl,
      page: page,
      range: rangeModel
    };
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "page.svg")
      ),
      dark: this.context.asAbsolutePath(path.join("media", "dark", "page.svg"))
    };

    // Find children
    if (page._services) {
      page._services.forEach((element: any, index: any) => {
        let indexArr: number[] = [indexMap[0], index];
        this.children.push(
          new SkaffolderNode(
            context,
            skaffolderObject,
            "page_page_api",
            indexArr
          )
        );
      });
    }
  }

  private showPageRoot(
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    if (
      this.skaffolderObject.modules &&
      this.skaffolderObject.modules.length > 0
    ) {
      this.skaffolderObject.modules.forEach((element, index) => {
        this.children.push(
          new SkaffolderNode(context, skaffolderObject, "page_page", [index])
        );
      });
    } else {
      this.children.push(
        new SkaffolderNode(context, skaffolderObject, "page_page_not_found", [])
      );
    }
  }
  /*
  private showAttributeResource(indexMap: number[]) {
    // Set attr

    let attr = (this.skaffolderObject.resources[indexMap[0]]._resources[
      indexMap[1]
    ]._entity as Entity)._attrs[indexMap[2]];
    this.label = attr.name;
    this.description = attr.type;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "string.svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "string.svg")
      )
    };
    let contexturl = vscode.Uri.file(
      vscode.workspace.rootPath + "/openapi.yaml"
    );
    let rangeModel = this.skaffolderObject.resources[indexMap[0]]._resources[
      indexMap[1]
    ].index;

    // this.command = {
    //   command: "skaffolder.openfiles",
    //   title: "Open SKfile",
    //   arguments: [
    //     this.skaffolderObject.resources[indexMap[0]]._resources[
    //       indexMap[1]
    //     ],
    //     this.skaffolderObject.resources[indexMap[0]]
    //   ]
    // };
  }

  private showApiResource(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set menu apis
    this.label = "APIs";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "api.svg")
      ),
      dark: this.context.asAbsolutePath(path.join("media", "dark", "api.svg"))
    };
    // Find children
    this.skaffolderObject.resources[indexMap[0]]._resources[
      indexMap[1]
    ]._services.forEach((element, index) => {
      let indexArr: number[] = [indexMap[0], indexMap[1], index];
      this.children.push(
        new SkaffolderNode(
          context,
          skaffolderObject,
          "api_db_resource_api",
          indexArr
        )
      );
    });
  }

  private showAttribute(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set menu attr
    this.label = "attributes";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "string.svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "string.svg")
      )
    };
    // Find children
    (this.skaffolderObject.resources[indexMap[0]]._resources[indexMap[1]]
      ._entity as Entity)._attrs.forEach((element, index) => {
      let indexArr: number[] = [indexMap[0], indexMap[1], index];
      this.children.push(
        new SkaffolderNode(
          context,
          skaffolderObject,
          "model_db_resource_attr",
          indexArr
        )
      );
    });
  }

  private showResource(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set resource

    this.label = this.skaffolderObject.resources[indexMap[0]]._resources[
      indexMap[1]
    ].name;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "model.svg")
      ),
      dark: this.context.asAbsolutePath(path.join("media", "dark", "model.svg"))
    };
    // Find children
    this.skaffolderObject.resources[indexMap[0]]._resources[
      indexMap[1]
    ]._services.forEach((element, index) => {
      let indexArr: number[] = [indexMap[0], indexMap[1], index];
      this.children.push(
        new SkaffolderNode(
          context,
          skaffolderObject,
          "api_db_resource_api",
          indexArr
        )
      );
    });

    // this.command = {
    //   command: "skaffolder.openapi",
    //   title: "Open SKfile API",
    //   arguments: [contexturl, rangeModel, this.params.model, this.params.db]
    // };
  }

  private showDb(
    indexMap: number[],
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    // Set db

    this.label = this.skaffolderObject.resources[indexMap[0]].name;
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join("media", "light", "database.svg")
      ),
      dark: this.context.asAbsolutePath(
        path.join("media", "dark", "database.svg")
      )
    };
    // Find children
    this.skaffolderObject.resources[indexMap[0]]._resources.forEach(
      (element, index) => {
        let indexArr: number[] = [indexMap[0], index];
        this.children.push(
          new SkaffolderNode(
            context,
            skaffolderObject,
            "api_db_resource",
            indexArr
          )
        );
      }
    );
  }

  private showApiRoot(
    context: vscode.ExtensionContext,
    skaffolderObject: SkaffolderObject
  ) {
    this.skaffolderObject.resources.forEach((element, index) => {
      this.children.push(
        new SkaffolderNode(context, skaffolderObject, "api_db", [index])
      );
    });
  }
  */
}

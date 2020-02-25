<p align="center"><a href="https://skaffolder.com"><img src="https://skaffolder.com/img/logo/skaffolder_logo-nero.svg" width="70%"></a></p>

<p align="center">
	<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/skaffolder/skaffolder-vscode-extension/main">
	<img alt="GitHub" src="https://img.shields.io/github/license/skaffolder/skaffolder-vscode-extension">
</p>

![Extension Gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/vscode_sample.gif)

# Skaffolder Generator

This extension allows to create, edit and manage a [Skaffolder](https://www.skaffolder.com) project.

It allows to create web and mobile applications starting from the technical documentation of database models, APIs and pages.

The documentation can be defined from the [Skaffolder web interface](https://app.skaffolder.com) having a free Skaffolder account or from the openapi.yaml file that extends the OpenAPI 3.0 standards. This exension allows to edit the openapi file from a visual interface according to the Skaffolder's standards.

## Features

- Create Features
  - [Create project](#create-project)
  - [Create model](#create-model)
  - [Create api](#create-api)
  - [Create page](#create-page)
  - [Create crud](#create-crud)
- [Open realeative files](#open-files)
- [Generate project](#generate-code)
- [Editing componetns](#editing-components)
- Skaffolder Account features
  - Skaffolder Login/Logout
  - [Export project to Skaffolder Platform](#export-project)
- [Setting for on-premise](#extension-settings-for-on-premise)

---

### Create Project

Create a new local Skaffolder project by clicking on _Create projects_. The button will only appear if the extension can't find an openapi.yaml file in the root of the current workspace.

![Create project Gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/create_project.gif)

### Generate code

Generate the source code of your project from the openapi.yaml file.

![Generate code Gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/generate_code.gif)

### Export project

Export your local project to Skaffolder Platform.
Before exporting your project you need to login with your Skaffolder [account](#requirements).

![Export project Gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/export_project.gif)

### Create model

Create a new model in the Skaffolder project by clicking on the symbol `+` of a database from the TreeView of your project:

![Create model gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/create_model.gif)

Or by typing `sk model` in the Command Palette:

![Create model gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/palette_create_model.gif)

### Create api

Create a new api int the Skaffolder project by clicking on the symbol `+` of a model from the TreeView of your project:

![Create api gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/create_api.gif)

Or by typing `sk api` in the Command Palette:

![Create api gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/palette_create_api.gif)

### Create page

Create a new page in the Skaffolder project by clicking on the symbol `+` on the _PAGES_ panel of your project:

![Create page gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/create_page.gif)

Or by typing `sk page` in the Command Palette:

![Create page gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/palette_create_page.gif)

### Create CRUD

Create a CRUD interface for a model by clicking by _Create CRUD_ of a the model editing panel:

![Create crud gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/create_crud.gif)

### Open Files

Open files related to a model, api or a page by clicking on the icon next the edit icon or by _Open related files_ in the component's editing panel:

![Open files Gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/open_files.gif)

### Editing components

Edit a component by clicking the edit icon and a new editing panel will open. When saving, any modification will be written in the openapi.yaml file.

![Add attribute from panel gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/add_attribute.gif)

Or you can edit directly from the openapi.yaml file:

![Edit attribute from file gif](https://raw.githubusercontent.com/skaffolder/skaffolder-vscode-extension/assets/gif/edit_attribute_file.gif)

## Requirements

Optional free Skaffolder account:
https://skaffolder.com/register

---

## Extension Settings for on-premise

- `skaffolder.endpoint`: configure link with on-premise Skaffolder platform
- `skaffolder.endpointDocs`: configure link with on-premise Skaffolder platform for displaying documentation

More info on Skaffolder on-premise for enterprises [here](https://skaffolder.com/enterprise/overview).

Get Skaffolder on-premise from:

- [Docker Hub](https://hub.docker.com/_/skaffolder-enterprise)
- [Google Marketplace](https://console.cloud.google.com/marketplace/details/skaffolder-public/skaffolder-enterprise)
- [AWS Marketplace](https://aws.amazon.com/marketplace/pp/B07SW4GPFY)
- [DigitalOcean Marketplace](https://marketplace.digitalocean.com/apps/skaffolder-enterprise)

---

## Contributing

Skaffolder-generator is an open-source project. Feel free to propose enhancements suggestions, report bugs and to submit pull requests.

/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR, MessageService } from "@theia/core/lib/common";
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { CommonMenus } from "@theia/core/lib/browser";

export const TargetManagementCommand = {
    id: 'TargetManagement.command',
    label: "Shows a message"
};

@injectable()
export class TargetManagementCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TargetManagementCommand);
        registry.registerHandler(TargetManagementCommand.id, {
            execute: (): any => {
                this.messageService.info('Hello World2!');
                return null;
            },
            isEnabled: () => true
        });
    }
}

@injectable()
export class TargetManagementMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction([
            MAIN_MENU_BAR,
            CommonMenus.EDIT_MENU,
            CommonMenus.EDIT_MENU_FIND_REPLACE_GROUP
        ], {
                commandId: TargetManagementCommand.id,
                label: 'Say Hello2'
            });
    }
}

@injectable()
export class TargetManagementFrontEndContribution implements FrontendApplicationContribution {

    constructor(
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
    ) { }

    async onStart(app: FrontendApplication): Promise<void> {
        const targetManagementWidget = await this.widgetManager.getOrCreateWidget('target-management');
        app.shell.addToLeftArea(targetManagementWidget, {
            rank: 300
        });
    }

}
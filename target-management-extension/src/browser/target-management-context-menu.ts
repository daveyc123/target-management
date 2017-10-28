/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable } from "inversify";
import { MenuContribution, MenuModelRegistry } from "@theia/core";
import { TARGET_MANAGEMENT_COMMANDS } from "./target-management-command";

export const TARGET_MANAGEMENT_CONTEXT_MENU: string = 'target-management-context-menu';

@injectable()
export class TargetManagementContextMenu implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu([], TARGET_MANAGEMENT_CONTEXT_MENU, '');

        menus.registerMenuAction([TARGET_MANAGEMENT_CONTEXT_MENU], {
            commandId: TARGET_MANAGEMENT_COMMANDS.CONNECT.id
        });
    }
}

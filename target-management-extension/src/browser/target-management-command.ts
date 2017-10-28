/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, ILogger, SelectionService} from "@theia/core/lib/common";
import { ConfirmDialog } from "@theia/core/lib/browser/dialogs";
import { OpenerService, open } from "@theia/core/lib/browser";
import { Target, TargetManager } from "../common/target-manager";
import { TargetUri } from "../common/target-uri";

export namespace TARGET_MANAGEMENT_COMMANDS {
    export const CONNECT = {
        id: 'target-management.connect',
        label: 'Connect'
    }
    export const DELETE = {
        id: 'target-management.delete',
        label: 'Delete'
    }
    export const CONFIGURE = {
        id: 'target-management.configure',
        label: 'Configure'
    }
}

@injectable()
export class TargetManagementCommandHandlers implements CommandContribution {

    constructor(
        @inject(ILogger) protected readonly logger: ILogger,
        @inject(SelectionService) protected readonly selectionService: SelectionService,
        @inject(TargetManager) protected readonly targetManager: TargetManager,
        @inject(OpenerService) protected readonly openerService: OpenerService
    ) { }

    // TODO be more file the FileSystemCommandHandler
    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TARGET_MANAGEMENT_COMMANDS.CONNECT);
        registry.registerHandler(TARGET_MANAGEMENT_COMMANDS.CONNECT.id, {
            execute: targetArg  => {
                const target: Target = (targetArg) ? targetArg : this.selectionService.selection;
                console.log("connect: " + target);
            },
            isEnabled: () => true
        });

        registry.registerCommand(TARGET_MANAGEMENT_COMMANDS.DELETE);
        registry.registerHandler(TARGET_MANAGEMENT_COMMANDS.DELETE.id, {
            execute: targetArg  => {
                const target: Target = (targetArg) ? targetArg : this.selectionService.selection;

                const dialog = new ConfirmDialog({
                    title: 'Delete Target',
                    msg: `Do you really want to delete '${target.name}'?`
                });
                return dialog.open().then(() => this.targetManager.deleteTarget(target));
            },
            isEnabled: () => true
        });

        registry.registerCommand(TARGET_MANAGEMENT_COMMANDS.CONFIGURE);
        registry.registerHandler(TARGET_MANAGEMENT_COMMANDS.CONFIGURE.id, {
            execute: targetArg  => {
                const target: Target = (targetArg) ? targetArg : this.selectionService.selection;
                open(this.openerService, TargetUri.toUri(target.name));
                console.log(target);
            },
            isEnabled: () => true
        });
    }
}

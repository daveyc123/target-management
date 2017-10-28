/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';


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
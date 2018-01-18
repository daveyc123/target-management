/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { OpenHandler, WidgetManager, FrontendApplication } from "@theia/core/lib/browser";
import { TargetUri } from "../common/target-uri";
import { Target, TargetManager } from "../common/target-manager";
import { TargetDetailWidget } from './target-detail-widget';

@injectable()
export class TargetManagementOpenHandler implements OpenHandler {

    readonly id = TargetUri.scheme;

    constructor(
        @inject(FrontendApplication) protected readonly app: FrontendApplication,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
        @inject(TargetManager) protected readonly targetManager: TargetManager
    ) { }

    canHandle(uri: URI): number {
        try {
            TargetUri.toTargetName(uri);
            return 500;
        } catch {
            return 0;
        }
    }

    async open(uri: URI): Promise<TargetDetailWidget> {
        const target: Target = await this.targetManager.getTarget(uri);
        const widget = await this.widgetManager.getOrCreateWidget<TargetDetailWidget>("target", target);
        this.app.shell.addWidget(widget, { area: 'main' });
        this.app.shell.activateWidget(widget.id);
        return widget;
    }

}

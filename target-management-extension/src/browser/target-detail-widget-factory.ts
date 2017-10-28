/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { WidgetFactory, FrontendApplication } from "@theia/core/lib/browser";
import { TargetUri } from "../common/target-uri";
import { TargetDetailWidget } from './target-detail-widget';
import { Target } from '../common/target-manager';

@injectable()
export class TargetDetailWidgetFactory implements WidgetFactory {

    readonly id = TargetUri.scheme;

    constructor(
        @inject(FrontendApplication) protected readonly app: FrontendApplication,
    ) { }

    async createWidget(target: Target): Promise<TargetDetailWidget> {
        const widget = new TargetDetailWidget(target);
        widget.id = 'target:' + target.name;
        widget.title.closable = true;
        widget.title.label = target.name;
        widget.title.iconClass = 'fa fa-gear';
        return widget;
    }

}

/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { TargetManagementCommandContribution, TargetManagementMenuContribution, TargetManagementFrontEndContribution } from './target-management-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { TargetManagementWidget } from './target-management-widget';
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(TargetManagementCommandContribution);
    bind(MenuContribution).to(TargetManagementMenuContribution);
    bind(FrontendApplicationContribution).to(TargetManagementFrontEndContribution).inSingletonScope();
    bind(TargetManagementWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: 'target-management',
        createWidget() {
            return ctx.container.get<TargetManagementWidget>(TargetManagementWidget);
        }
    })).inSingletonScope();


});
/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { TargetManagementFrontEndContribution } from './target-management-contribution';
import { TargetManagementCommandHandlers } from './target-management-command';
import { TargetManagementContextMenu } from './target-management-context-menu';
import { TargetManagementOpenHandler } from './target-management-open-handler';
import { TargetDetailWidgetFactory } from './target-detail-widget-factory';

import { CommandContribution, MenuContribution} from "@theia/core/lib/common";
import { FrontendApplicationContribution, WidgetFactory, OpenHandler } from '@theia/core/lib/browser';
import { TargetManagementWidget } from './target-management-widget';
import { ContainerModule } from "inversify";

import { LocalTargetManager, TargetManager} from '../common/target-manager';
import '../../src/browser/style/index.css';
import 'font-awesome/css/font-awesome.min.css'

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(TargetManagementCommandHandlers);
    bind(MenuContribution).to(TargetManagementContextMenu);
    bind(FrontendApplicationContribution).to(TargetManagementFrontEndContribution).inSingletonScope();
    bind(TargetManagementWidget).toSelf();

    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: 'target-management',
        createWidget() {
            return ctx.container.get<TargetManagementWidget>(TargetManagementWidget);
        }
    })).inSingletonScope();
    bind(TargetDetailWidgetFactory).toSelf().inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ctx.container.get(TargetDetailWidgetFactory)).inSingletonScope();

    bind(TargetManagementOpenHandler).toSelf().inSingletonScope();
    bind(OpenHandler).toDynamicValue(ctx => ctx.container.get(TargetManagementOpenHandler)).inSingletonScope();

    // these should probably go somewhere else, but this getting me there for now

    bind(LocalTargetManager).toSelf().inSingletonScope();
    bind(TargetManager).to(LocalTargetManager).inSingletonScope();
});
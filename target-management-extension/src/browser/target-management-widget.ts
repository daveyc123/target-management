/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from 'inversify';
import { VirtualWidget, VirtualRenderer, ContextMenuRenderer} from '@theia/core/lib/browser';
import { TargetManager, Target, TargetStatus } from '../common/target-manager';
import { TARGET_MANAGEMENT_CONTEXT_MENU } from './target-management-context-menu';
import { TARGET_MANAGEMENT_COMMANDS } from './target-management-command';

import { h, ElementAttrs } from '@phosphor/virtualdom';
import { MessageService, SelectionService, Disposable, CommandService } from "@theia/core/lib/common";

@injectable()
export class TargetManagementWidget extends VirtualWidget {

    targets: Target[] = [];
    hoveredTarget: Target | undefined = undefined;

    constructor(@inject(TargetManager) protected readonly targetManager: TargetManager,
                @inject(MessageService) protected readonly messageService: MessageService,
                @inject(ContextMenuRenderer) protected readonly contextMenuRenderer: ContextMenuRenderer,
                @inject(CommandService) protected readonly commandService: CommandService,
                @inject(SelectionService) protected readonly selectionService: SelectionService) {
        super();
        this.id = 'theia-targetManagementContainer';
        this.title.label = 'Targets';

        this.addClass('target-management');
        this.update();
        this.refreshTargets();
    }

    protected refreshTargets(): void {
        this.targetManager.getTargets().then(targets => {
            this.targets = targets;
            this.update();
        });
    }

    protected render(): h.Child {
        return h.div(this.renderToolbar(), this.renderHeader(), this.renderTargetList());
    }

    protected renderHeader(): h.Child {
        return h.div({ className: 'theia-header' }, 'Targets');
    }

    protected renderToolbar(): h.Child {
        const add = h.a({
            className: 'button',
            title: 'Add Target',
            onclick: async event => {
                const el = (event.target as HTMLElement).parentElement;
                if (el) {
                    this.contextMenuRenderer.render(TARGET_MANAGEMENT_CONTEXT_MENU, {
                        x: el.getBoundingClientRect().left,
                        y: el.getBoundingClientRect().top + el.offsetHeight
                    });
                }
            }
        }, h.i({ className: 'fa fa-plus' }));

        return h.div({ id: 'theia-targetManagementToolbar'}, add);
    }

    protected renderTargetList(): h.Child {
        const targetListDivs: h.Child[] = [];
        if (this.targets.length > 0) {
            this.targets.forEach(target => {
                targetListDivs.push(this.renderTarget(target));
            });
            return h.div({
                id: 'theia-targetManagementList'
            }, VirtualRenderer.flatten(targetListDivs));
        } else {
            return h.div("You have no targets");
        }
    }

    protected renderTarget(target: Target): h.Child {
        const liClasses = ['noselect'];
        const targetProps : ElementAttrs  = {
            className: liClasses.join(" "),
            oncontextmenu: event => this.handleContextMenuEvent(target, event),
            onmouseover: event => this.handleTargetHoverEnter(target, event),
            onmouseout: event => this.handleTargetHoverExit(target, event)
        };

        return h.li(targetProps, this.renderTargetIcon(target), this.renderTargetName(target), this.renderTargetActions(target));
    }

    protected renderTargetIcon(target: Target): h.Child {
        const iconClasses = ['fa', 'fa-fw', 'icon'];

        switch(target.status) {
            case TargetStatus.CONNECTED:
                iconClasses.push('fa-circle', 'icon-connected');
                break;
            case TargetStatus.DISCONNECTED:
                iconClasses.push('fa-circle', 'icon-disconnected');
                break;
            case TargetStatus.CONNECTING:
                iconClasses.push('fa-circle-o-notch', 'fa-spin', 'icon-connecting');
                break;
        }

        return h.span({ className: iconClasses.join(" ") });
    }

    protected renderTargetName(target: Target): h.Child {
        const nameClasses = ['name'];
        return h.span({ className: nameClasses.join(" ")}, target.name + ' ');
    }

    protected renderTargetActions(target: Target): h.Child {
        const actions: h.Child[] = [];

        if (target === this.hoveredTarget) {
            const deleteAction = h.span({
                    className: "fa fa-minus action",
                    onclick: event => this.handleRemoveTarget(target, event) });
            const configureAction = h.span({
                    className: "fa fa-gear action",
                    onclick: event => this.handleConfigureTarget(target, event) });
            actions.push(deleteAction, configureAction);
        }
        return h.span({ id: "theia-targetManagementListActionItems"}, VirtualRenderer.flatten(actions));
    }

    protected handleContextMenuEvent(target: Target, event: MouseEvent): void {
        this.selectionService.selection = target;

        this.onRender.push(Disposable.create(() =>
            setTimeout(() =>
                this.contextMenuRenderer.render(TARGET_MANAGEMENT_CONTEXT_MENU, event)
            )
        ));

        event.stopPropagation();
        event.preventDefault();
    }

    protected handleTargetHoverEnter(target: Target, event: MouseEvent): void {
        this.hoveredTarget = target;
        this.update();
    }

    protected handleTargetHoverExit(target: Target, event: MouseEvent): void {
        this.hoveredTarget = undefined;
        this.update();
    }

    protected handleRemoveTarget(target: Target, event: MouseEvent): void {
        // TODO we probably don't want to actually trigger off of the promise here. Instead the TargetManager should
        // have a listener mechanism that we can register for and this widget will listen for it
        this.commandService.executeCommand(TARGET_MANAGEMENT_COMMANDS.DELETE.id, target).then(() => this.refreshTargets());
    }

    protected handleConfigureTarget(target: Target, event: MouseEvent): void {
        this.commandService.executeCommand(TARGET_MANAGEMENT_COMMANDS.CONFIGURE.id, target).then(() => this.refreshTargets());
    }
}
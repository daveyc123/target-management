/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from 'inversify';
import { VirtualWidget } from '@theia/core/lib/browser';
import { TargetManager } from '../common/target-manager';
import { h } from '@phosphor/virtualdom';
import { MessageService } from "@theia/core/lib/common";

@injectable()
export class TargetManagementWidget extends VirtualWidget {

    constructor(@inject(TargetManager) protected readonly targetManager: TargetManager,
                @inject(MessageService) protected readonly messageService: MessageService) {
        super();
        this.id = 'theia-targetManagementContainer';
        this.title.label = 'Targets';

        this.addClass('target-management');
        this.update();
    }

    protected render(): h.Child {
        this.targetManager.getTargets().then(targets => {
            console.log("Hello");
        });

        const commit = h.a({
            className: 'button',
            title: 'Add Target',
            onclick: async event => {
                    this.messageService.error('This is where a target will be added!');
            }
        }, h.i({ className: 'fa fa-check' }));

        return h.div(commit);
    }


}
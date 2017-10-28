/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Target } from '../common/target-manager';
import { Message } from '@phosphor/messaging/lib';
import { VirtualWidget } from '@theia/core/lib/browser';
import { h } from '@phosphor/virtualdom/lib';

export class TargetDetailWidget extends VirtualWidget {

    constructor(
        protected readonly target: Target
    ) {
        super();
        this.target = target;
        this.addClass('theia-target-detail');
        this.update();

    }

    onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.update();
    }

    protected render(): h.Child {
        const name = h.div("Name: " + this.target.name);
        const type = h.div("Type: " + this.target.type);

        return h.div({ id: 'theia-targetDetails'}, name, type);
    }
}

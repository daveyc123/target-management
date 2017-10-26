/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { ILogger } from "@theia/core/lib/common";

export const TargetManager = Symbol('ITargetManager');

export interface TargetManager {

    getTargets(): Promise<Target[]>;

}

@injectable()
export class LocalTargetManager implements TargetManager {

    targets: Target[];

    constructor(@inject(ILogger) protected readonly logger: ILogger) {
        this.targets = [ new Target("target1", "type1"), new Target("target2", "type2") ];
    }

    public getTargets(): Promise<Target[]> {
        return Promise.resolve(this.targets);
    }
}

export class Target {

    name: String;
    type: String;

    constructor(name: String, type: String) {
        this.name = name;
        this.type = type;
    }

}


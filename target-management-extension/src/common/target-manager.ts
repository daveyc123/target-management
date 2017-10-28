/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from "inversify";
import { ILogger } from "@theia/core/lib/common";
import { TargetUri } from "./target-uri";
import URI from "@theia/core/lib/common/uri";

export const TargetManager = Symbol('ITargetManager');

export interface TargetManager {

    getTargets(): Promise<Target[]>;
    deleteTarget(targetToDelete: Target): Promise<void>;
    getTarget(uri: URI): Promise<Target>;

}

@injectable()
export class LocalTargetManager implements TargetManager {

    targets: Target[];

    constructor(@inject(ILogger) protected readonly logger: ILogger) {
        this.targets = [ new Target("Target1", "type1", TargetStatus.CONNECTED),
            new Target("Target2", "type2", TargetStatus.CONNECTING),
            new Target("Target3", "type3", TargetStatus.DISCONNECTED)
        ];
    }

    public getTargets(): Promise<Target[]> {
        return Promise.resolve(this.targets);
    }

    public deleteTarget(targetToDelete: Target): Promise<void> {
        // TODO find a lib for manipulating arrays when I have internet
        const newTargets: Target[] = [];
        for (var target of this.targets) {
            if (target !== targetToDelete) {
                newTargets.push(target);
            }
        }
        this.targets = newTargets;

        return Promise.resolve();
    }

    public getTarget(uri: URI): Promise<Target> {
        const targetName: String = TargetUri.toTargetName(uri);

        for (var target of this.targets) {
            if (target.name === targetName) {
                return Promise.resolve(target);
            }
        }

        return Promise.reject("No matching target found");
    }
}

export const enum TargetStatus {
    CONNECTING,
    CONNECTED,
    DISCONNECTED
}

export class Target {

    name: string;
    type: string;
    status: TargetStatus;

    constructor(name: string, type: string, status: TargetStatus) {
        this.name = name;
        this.type = type;
        this.status = status;
    }

}


/*
 * Copyright (C) 2017 QNX Software Systems and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import URI from "@theia/core/lib/common/uri";

export namespace TargetUri {
    export const scheme = 'target';
    export function toUri(targetName: string): URI {
        return new URI('').withScheme(scheme).withFragment(targetName);
    }
    export function toTargetName(uri: URI): string {
        if (uri.scheme === scheme) {
            return uri.fragment;
        }
        throw new Error('The given uri is not a target URI, uri: ' + uri);
    }
}

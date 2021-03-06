/*
 * Copyright (C) 2007-2014 Crafter Software Corporation.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.craftercms.profile.permissions;

import org.craftercms.commons.security.exception.PermissionException;
import org.craftercms.commons.security.permissions.Permission;
import org.craftercms.commons.security.permissions.PermissionResolver;
import org.craftercms.profile.api.AttributeDefinition;
import org.craftercms.profile.api.AttributePermission;

/**
 * {@link org.craftercms.commons.security.permissions.PermissionResolver} for attributes.
 *
 * @author avasquez
 */
public class AttributePermissionResolver implements PermissionResolver<Application, AttributeDefinition> {

    @Override
    public Permission getGlobalPermission(Application subject) throws PermissionException {
        throw new UnsupportedOperationException();
    }

    @Override
    public Permission getPermission(Application app, AttributeDefinition definition) throws PermissionException {
        for (AttributePermission permission : definition.getPermissions()) {
            String permittedApp = permission.getApplication();

            if (permittedApp.equals(AttributePermission.ANY_APPLICATION) || permittedApp.equals(app.getName())) {
                return permission;
            }
        }

        return null;
    }

}

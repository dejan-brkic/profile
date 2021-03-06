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
package org.craftercms.profile.services.impl;

import org.springframework.beans.factory.annotation.Required;

/**
 * Implementation of {@link org.craftercms.profile.services.impl.AccessTokenIdResolver} that uses a single
 * access token ID, set as property.
 *
 * @author avasquez
 */
public class SingleAccessTokenIdResolver implements AccessTokenIdResolver {

    protected String accessTokenId;

    @Required
    public void setAccessTokenId(String accessTokenId) {
        this.accessTokenId = accessTokenId;
    }

    @Override
    public String getAccessTokenId() {
        return accessTokenId;
    }

}

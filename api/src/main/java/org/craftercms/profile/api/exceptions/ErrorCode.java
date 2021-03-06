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
package org.craftercms.profile.api.exceptions;

/**
 * Contains profile's error codes.
 *
 * @author avasquez
 */
public enum ErrorCode {
    MISSING_ACCESS_TOKEN_ID_PARAM,
    NO_SUCH_ACCESS_TOKEN_ID,
    EXPIRED_ACCESS_TOKEN,
    ACTION_DENIED,
    NO_SUCH_TENANT,
    BAD_CREDENTIALS,
    DISABLED_PROFILE,
    NO_SUCH_PROFILE,
    NO_SUCH_TICKET,
    NO_SUCH_VERIFICATION_TOKEN,
    INVALID_EMAIL_ADDRESS,
    PERMISSION_ERROR,
    ROLE_STILL_USED,
    ATTRIBUTE_ALREADY_DEFINED,
    ATTRIBUTE_NOT_DEFINED,
    ATTRIBUTE_DEFINITION_STILL_USED,
    ATTRIBUTES_DESERIALIZATION_ERROR,
    TENANT_EXISTS,
    PROFILE_EXISTS,
    INVALID_QUERY,
    OTHER;
}

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
package org.craftercms.profile.v2.services;

import org.craftercms.profile.api.Profile;
import org.craftercms.profile.api.exceptions.ProfileException;

/**
 * Service used to verify recently created profiles.
 *
 * @author avasquez
 */
public interface VerificationService {

    /**
     * Sends the user an email to verify the new profile
     *
     * @param profile               the profile of the user
     * @param verificationBaseUrl   the URL the user should click to verify the new profile
     */
    void sendVerificationEmail(Profile profile, String verificationBaseUrl) throws ProfileException;

    /**
     * Verify that the token received from the user is correct.
     *
     * @param serializedToken the serialized token, sent in the verification email
     */
    void verifyToken(String serializedToken) throws ProfileException;

}

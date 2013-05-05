/*
 * Copyright (C) 2007-2013 Crafter Software Corporation.
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
package org.craftercms.security.authentication.impl;

import org.apache.commons.lang.StringUtils;
import org.craftercms.security.api.RequestContext;

import javax.servlet.http.Cookie;
import java.text.DateFormat;
import java.util.Date;

/**
 * Cookie that persists authentication information across requests.
 *
 * @author Alfonso Vásquez
 */
public class AuthenticationCookie {

    public static final String COOKIE = "crafterAuthCookie";
    public static final char COOKIE_SEP = '|';

    protected String ticket;
    protected Date profileOutdatedAfter;

    public AuthenticationCookie(String ticket, Date profileOutdatedAfter) {
        this.ticket = ticket;
        this.profileOutdatedAfter = profileOutdatedAfter;
    }

    public String getTicket() {
        return ticket;
    }

    public Date getProfileOutdatedAfter() {
        return profileOutdatedAfter;
    }

    public void setProfileOutdatedAfter(Date profileOutdatedAfter) {
        this.profileOutdatedAfter = profileOutdatedAfter;
    }

    public void save(RequestContext context, int cookieMaxAge) {
        String contextPath = context.getRequest().getContextPath();

        Cookie cookie = new Cookie(COOKIE, toCookieValue());
        cookie.setPath(StringUtils.isNotEmpty(contextPath)? contextPath : "/");
        cookie.setMaxAge(cookieMaxAge);

        context.getResponse().addCookie(cookie);
    }

    public void delete(RequestContext context) {
        String contextPath = context.getRequest().getContextPath();

        Cookie cookie = new Cookie(COOKIE, null);
        cookie.setPath(StringUtils.isNotEmpty(contextPath)? contextPath : "/");
        cookie.setMaxAge(0);

        context.getResponse().addCookie(cookie);
    }

    public String toCookieValue() {
        return ticket + COOKIE_SEP + DateFormat.getDateTimeInstance().format(profileOutdatedAfter);
    }


    @Override
    public String toString() {
        return "AuthenticationCookie[" +
                "ticket='" + ticket + '\'' +
                ", profileOutdatedAfter=" + profileOutdatedAfter +
                ']';
    }

}
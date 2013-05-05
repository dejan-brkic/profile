<#import "spring.ftl" as spring />
<#import "crafter.ftl" as crafter />
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Crafter Admin Console</title>
<link href="resources/image/favicon.ico" rel="Shortcut Icon">
<link rel="stylesheet" href="resources/css/profile.css">
<script src="resources/js/jquery-1.9.1.min.js"></script>
<script language="javascript" src="resources/js/util.js"></script>

</head>
<body>
	
<div id="content">

	<div id="header">
	 	<a class="logo" href="http://craftercms.org" title="Visit Crafter CMS"></a> 
	 	<ul class="page-actions">
	 		<li><a type="submit" href="javascript:onsubmitform('Logout');" value="Logout" id="Logout" name="operation">Logout</a></li>
	 		<li><a style="float:right" name="currentuser" href="item?username=${currentuser.username}&tenantName=${currentuser.tenantName}">User: ${currentuser.username!""}</a></li>
	 	</ul>
		<h1 class="mainTitle">Manage Profiles</h1>
	</div>

  <form id="form-list" onsubmit="return onsubmitform();" accept-charset="UTF-8">	
    <div class="top">
  		<div class="pad">
		<nav>
			<ul class="main-nav clearfix">
				<li><a type="submit" href="javascript:onsubmitform('New');" value="New Profile" id="New" name="operation">New Profile</a></li>
	    		<li><a type="submit" href="javascript:onsubmitform('Delete');" value="Delete Profile" id="Delete" name="operation">Delete Profile</a></li>
	    		<li><a type="submit" href="javascript:onsubmitform('GetTenants');" value="Get Tenants" id="GetTenants" name="operation">Manage Tenants</a></li>
	    	</ul>
	    	<ul class="page-actions">
		        <li>
		            <label  id="tenantLabel" for="selectedTenantName" style="width: 50px;">Tenant:</label>
                    <select style="width:150px;" id="selectedTenantName" name="selectedTenantName" onchange="javascript:onsubmitform('Accounts');">
                        <#list tenantNames?keys as key>
                            <#if (selectedTenantName == key) >
                                <#assign isSelected = true>
                            <#else>
                                <#assign isSelected = false>
                            </#if>
                            <option value="${key?html}"<#if isSelected> selected="selected"</#if>>${tenantNames[key]?html}
                        </#list>
                    </select>
    			</li>
			    <li><@crafter.formInput "filter.userName", "filter", "style=width:120px", "text"/>
		   			 <a type="submit" href="javascript:onsubmitform('Filter');" value="Search" id="Search" name="operation">Search</a></li>
	    	<li><a type="submit" href="javascript:onsubmitform('Previous');" value="Previous" id="Previous" name="operation">&lt;&lt;</a></li>
	        <li><a type="submit" href="javascript:onsubmitform('Next');" value="Next" id="Next" name="operation">&gt;&gt;</a></li>
		   </ul>
	    </nav>
	    </div>
   </div>      
  <table id="mytable">
  	<tr>
    	<th scope="col"><input type=checkbox onclick="checkAll();" name="all" value="all" unchecked></th>
    	<th scope="col">User Name</th>
    </tr>
    <#list userList as u>
      <tr>
        <td><input type=checkbox name="item" value="${u.id}" unchecked></td>
      	<td><a name="username" href="item?username=${u.username}&tenantName=${u.tenantName}">${u.username!""}</a></td>
      </tr>
     
    </#list>
    </table>
    </form>
</div> 
<div class="footer" style="margin: 0 auto; width: 960px; padding: 10px 0pt;">
&copy; 2007-2013 Crafter Software Corporation. All Rights Reserved.
</div> 
</body>
</html> 
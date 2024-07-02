## Local user/password authentication + external OIDC IdP

# Draft

### Local User/Password Authentication
Develop a gRPC service for authentication that validates user credentials and issues JWT access tokens (login method). 
The client application interacts with this service when a user submits the local login form. 
Successful login returns user's role and permissions.


### Role-Based Access Control

Assign each user a single(!) role. 
The role is used to determine the list of user’s permissions. 
Default roles has a fixed set of permissions (known at build time), while custom roles can be configured by the administrator.

The role claim must be embedded in the JWT token (regardless of whether a local or external provider is used). 

Store default role-permissions map only in memory (as they are known at build-time). 
Save custom role and its permissions in the database. 
Cache custom role-permissions map for optimized performance during token validation. 
Implement cache invalidation when custom role permissions list is changed or when a user is assigned to a different role.


### Simplified Token Refresh Mechanism
Since we don't aim to implement a full-fledged identity server 
(as we cannot support all the features that external IdP providers like Keycloak offer),
our token refresh mechanism will be designed with simplicity in mind. 
Implement a gRPC service method that issues a new access token based on a valid access token.
Use an extended lifetime for local authentication JWT tokens (e.g., 7 days). 
Client applications (web and mobile) refresh tokens periodically (e.g., once in an hour), 
prompting users to log in only if they have been inactive for the specified duration.


### External OIDC Providers Configuration
Store configurations for external OIDC providers in appsettings.json. 
Dynamically register the AddJwtBearer middleware for each external provider, 
using a unique authentication scheme for each. 
Design a login page with user/password fields for local login and redirect-buttons for external authentication providers. 
On login page load, make an unauthorized gRPC request to retrieve the list of external providers 
(provider name, redirect URL, authentication scheme, etc.), determining which buttons to display.
After application successfully get a token from an external provider, it should login with the token to the local authentication service.
Local authentication service should validate the token and issue a new local token which should be used as usual.

### Token Revocation Mechanism
Implement a mechanism to revoke authentication tokens when custom role-permission settings change. 

A viable approach could be revoking all user's token based on a time.

- Maintain a userId-lastPermissionOrRoleUpdateDateTime in memory map, 
which stores the last time a user's custom role (or role's permissions) were updated. 
This map should be stored in a persistent storage system too,
to ensure the latest values are retained after a server restart.

- During token validation, compare the token's issued time with the lastPermissionUpdateDateTime value from the map.
If the token's issued time is less than lastPermissionUpdateDateTime, consider the token invalid and require the user to re-authenticate.


### Summary
This approach centralizes configuration on the server-side and dynamically adjusts login options on the client-side.
Using only single role per user simplifies the implementation and allows us to use a single JWT token claim for role.
The simplified token refresh mechanism is a trade-off between security and simplicity.

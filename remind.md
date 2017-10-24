# Todo

## Sign up for API Key

Require field: 
```username```
```password```
```email```

Generate:
```_id```
```_time```
```API Key```: give to user
## Router 

```/authenticate```: authenticate user's information
```/user```: register a user

## API Key

To use the API service, you have to use your API key to authenticate, then you'll get a token. The token will be expired in a day, and only your ip is aviliable.
If failed to request the API server, you should resign a token.

## weather.users

```weather.users.username```: save the username
```weather.users.key```: save user's API key
```weather.users._id```: save user's id
```weather.<id>.devices```: save user's devices id
```weather.<id>```: save user's devices' meta and user's information

## weather.<id>

```
{
username: "admin",
password: "123456",
key: "1234567890",
address: "",
location: "Neihu"
}
```
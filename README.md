
# Camara de Administradores de Consorcio 🏢

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Run Locally

Clone the project

```bash
  git clone https://github.com/LaraSabatini/CAC-backend.git
```

Go to the project directory

```bash
  cd CAC-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
  -----------------
  npm run prod
  -----------------
  npm run test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NODE_ENV= development | production | test
HOST
PORT

DB_HOST
DB_USER
DB_PASS
DB

MP_PUBLIC_KEY
MP_ACCESS_TOKEN

MAIL_HOST
MAIL_PASS
```

## APIs

### Auth

#### Register admin

```http
  POST api/users/admin/register
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userName`| `string`| **Required**.             |
| `email`| `string`| **Required**.             |
| `password`| `string`| **Required**.             |
| `accessPermits`| `JSON`| **Required**.             |


#### Register client

```http
  POST /api/users/client/register
```
#### Body:


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userName`      | `string` | **Required**. |
| `email`      | `string` | **Required**. |
| `password`      | `password` | **Required**. |
| `contactInfo`      | `JSON` | `contactInfo interface` |
| `preferences`      | `JSON` | `number[]` |
| `accountBlocked`      | `boolean` | `0 / 1` En caso de que se bloquee por un administrador  |
| `subscription`      | `boolean` | `number[]` En caso de que se haya vencido el pago |

```
  // contactInfo Interface
  contactInfo: {
    phone: number
    address: {
      street: string
      streetNumber: number
      neighbourhood: string
      state: string
      country: string
    }
  }
```

#### Login

```http
  POST api/users/admin/login

  OR

  POST api/users/client/login
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`| `string`| **Required**.             |
| `password`| `string`| **Required**.             |


#### Change password

```http
  PUT api/users/admin/change-password

  OR

  PUT api/users/client/change-password
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`| `number`| **Required**.             |
| `newPassword`| `string`| **Required**.             |



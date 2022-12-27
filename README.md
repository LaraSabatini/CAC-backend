
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
  - contactInfo Interface
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


### Payments

#### Register payment in DB

```http
  POST api/payment/register-in-db
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `clientId`| `number`| **Required**.             |
| `mpUser`| `string`| **Required**.             |
| `paymentExpireDate`| `Date`| **Required**.             |
| `itemId`| `number`| **Required**.             |
| `pricePaid`| `number`| **Required**.             |


#### Get payments by client

```http
  GET api/payment/search/id=:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`| `number`| **Required**.             |

#### Create preference (MP)

```http
  POST api/payment/create-preference
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `items`| `itemInterface[]`| **Required**.             |
| `payer`| `payerInterface`| **Required**.             |
| `back_urls`| `urlsInterface`| **Required**.             |
| `auto_return`| `string / undefined`| "approved" / "all" / undefined             |


  ```
  - itemInterface
  {
    id: string
    title: string
    description?: string
    category_id?: string
    quantity: number
    currency_id?: string
    unit_price: number
    picture_url?: string
  }

  - payerInterface
  {
      name: string
      surname: string
      email: string
      date_created?: null
      last_purchase?: null
      phone?: {
        area_code: string
        number: string
      }
      identification: {
        type: string
        number: string
      }
      address?: {
        street_name: string
        street_number: string
        zip_code: string
      }
  }

  - urlsInterface
  {
    success: string
    failure: string
    pending: string
  }
```

### Pricing

#### Get price list

```http
  GET api/pricing
```

#### Create price item

```http
  POST api/pricing
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`| `string`| **Required**.             |
| `price`| `number`| **Required**.             |
| `description`| `string`| **Required**.             |

#### Edit price item

```http
  PUT api/pricing/id=:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`| `string`| **Required**.             |
| `price`| `number`| **Required**.             |
| `description`| `string`| **Required**.             |

#### Delete price item

```http
  DELETE api/pricing/id=:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`| `number`| **Required**.             |
| `name`| `string`| **Required**.             |
| `price`| `number`| **Required**.             |
| `description`| `string`| **Required**.             |


### Articles

#### Get articles

```http
  GET api/articles/page=:page
```

-Content comes in 25 items each time.-

#### Create article

```http
  POST api/articles
```

#### Body:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title`| `string`| **Required**.             |
| `description`| `string`| **Required**.             |
| `categories`| `JSON`| number[]             |
| `picture`| `Blob`|              |
| `attachment`| `Blob`|              |
| `createdBy`| `number`|         User id     |
| `changesHistory`| `changesHistoryInterface[]`|             |

```
  - changesHistoryInterface
  {
    date: Date,
    action: string,
    madeBy: number
  }
```

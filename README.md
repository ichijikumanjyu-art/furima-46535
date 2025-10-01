# README

## usersテーブル

|Column            |Type  |Options              |
|------------------|------|---------------------|
|nickname          |string|NOT NULL             |
|email             |string|NOT NULL,unique: true|
|encrypted_password|string|NOT NULL             |
|last_name         |string|NOT NULL             |
|first_name        |string|NOT NULL             | 
|last_name_kana    |string|NOT NULL             |
|first_name_kana   |string|NOT NULL             |
|birth             |date  |NOT NULL             |

### Association
- has_many :items
- has_many :orders


## itemsテーブル

|Column           |Type       |Options                      |
|-----------------|-----------|-----------------------------|
|product          |string     |null: false                  |
|introduce        |text       |null: false                  |
|price            |integer    |null: false                  |
|user             |references |null: false,foreign_key: true|
|category_id      |integer    |null: false                  |
|condition_id     |integer    |null: false                  |
|shipping_costs_id|integer    |null: false                  |
|prefecture_id    |integer    |null: false                  |
|shipping_date_id |integer    |null: false                  |


### Association
- belongs_to :user
- has_one :order


## ordersテーブル

|Colmun    |Type      |Options                      |
|----------|----------|-----------------------------|
|user      |references|null: false,foreign_key: true|
|item      |references|null: false,foreign_key: true|

### Association
- belongs_to :user
- belongs_to :item
- has_one :address


## addressesテーブル

|Colmun       |Type   |Options    |
|-------------|-------|-----------|
|post_code    |string |null: false|
|prefecture_id|integer|null: false|
|city         |string |null: false|
|street       |string |null: false|
|building     |string |           |
|phone_number |string |null: false|

### Association
- belongs_to :oder
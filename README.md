# README

## usersテーブル

|Column         |Type  |Options              |
|---------------|------|---------------------|
|nickname       |string|NOT NULL             |
|email          |string|NOT NULL,unique: true|
|passward       |string|NOT NULL             |
|last_name      |string|NOT NULL             |
|first_name     |string|NOT NULL             | 
|last_name_kana |string|NOT NULL             |
|first_name_kana|string|NOT NULL             |
|birth          |date  |NOT NULL             |

### Association
- has_many :items
- has_many :orders


## itemsテーブル

|Colimn           |Type       |Options                   |
|-----------------|-----------|--------------------------|
|product          |string     |NOT NULL                  |
|introduce        |text       |NOT NULL                  |
|price            |string     |NOT NULL                  |
|user             |references |NOT NULL,foreign_key: true|
|category_id      |integer    |NOT NULL                  |
|condition_id     |integer    |NOT NULL                  |
|shipping_costs_id|integer    |NOT NULL                  |
|prefecture_id    |integer    |NOT NULL                  |
|shipping_date_id |integer    |NOT NULL                  |


### Association
- belongs_to :user
- has_one :order


## odersテーブル

|Colmun    |Type      |Options                   |
|----------|----------|--------------------------|
|user      |references|NOT NULL,foreign_key: true|
|item      |references|NOT NULL,foreign_key: true|

### Association
- belongs_to :user
- belongs_to :item
- has_one :address


## addressテーブル

|Colmun       |Type  |Options |
|-------------|------|--------|
|post_code    |string|NOT NULL|
|prefecture_id|integer|NOT NULL|
|city         |string|NOT NULL|
|street       |string|NOT NULL|
|building     |string|        |
|phone_number |string|NOT NULL|

### Association
- belongs_to :oder
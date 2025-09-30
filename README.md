# README

## usersテーブル

|Column  |Type  |Options              |
|--------|------|---------------------|
|nickname|string|NOT NULL             |
|email   |string|NOT NULL,unique: true|
|passward|string|NOT NULL             |
|name    |string|NOT NULL             |
|katakana|string|NOT NULL             |
|birth   |string|NOT NULL             |

### Association
- has_many :items
- has_many :orders


## itemsテーブル

|Colimn        |Type      |Options                   |
|--------------|----------|--------------------------|
|product       |string    |NOT NULL                  |
|introduce     |text      |NOT NULL                  |
|price         |string    |NOT NULL                  |
|user          |references|NOT NULL,foreign_key: true|
|category      |string    |NOT NULL                  |
|condition     |string    |NOT NULL                  |
|shipping_costs|string    |NOT NULL                  |
|shipping_place|string    |NOT NULL                  |
|shipping_date |string    |NOT NULL                  |


### Association
- belongs_to :users
- has_one :orders


## odersテーブル

|Colmun    |Type      |Options                   |
|----------|----------|--------------------------|
|user      |references|NOT NULL,foreign_key: true|
|items     |references|NOT NULL,foreign_key: true|

### Association
- belongs_to :users
- belongs_to :items
- has_one :address


## addressテーブル

|Colmun      |Type  |Options |
|------------|------|--------|
|post_code   |string|NOT NULL|
|prefectures |string|NOT NULL|
|city        |text  |NOT NULL|
|street      |text  |NOT NULL|
|building    |text  |NOT NULL|
|phone_number|text  |NOT NULL|

### Association
- belongs_to :oders
class Item < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions

  belongs_to :category
  belongs_to :condition
  belongs_to :shipping_cost
  belongs_to :prefecture
  belongs_to :shipping_date
  belongs_to :user

  has_one_attached :image

  has_one :order

  # def sold_out?
  # order.present?
  # end

  # 商品画像が必須
  validates :image, presence: { message: 'を添付してください' }

  # 商品名・説明・価格が必須
  validates :product, presence: true
  validates :introduce, presence: true
  validates :price, presence: true

  # ActiveHashで「---（id: 1）」以外を選択必須とする
  with_options numericality: { other_than: 1, message: "can't be blank" } do
    validates :category_id
    validates :condition_id
    validates :shipping_cost_id
    validates :prefecture_id
    validates :shipping_date_id
  end

  # 半角数値チェック（整数のみ）
  validates_format_of :price, with: /\A[0-9]+\z/, message: 'は半角数字で入力してください'

  # 価格のバリデーション（範囲・数値）
  validates :price, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 300,
    less_than_or_equal_to: 9_999_999,
    message: 'は¥300〜¥9,999,999の範囲で入力してください'
  }
end
